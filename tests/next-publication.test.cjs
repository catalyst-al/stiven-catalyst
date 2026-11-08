// The publications in one line (the "nextPublication" filter in eleventy.config.js, and the "newer" issue of
// weekly-issue.njk and treatise-volume.njk): each issue leads to the next issue of its series; the newest issue of
// each series leads into the first of the next publication, at the end of the reader and in "Read another issue";
// the book leads back to the Management Review of September 2026, so no reader ends in a list.
//
// The newest issue of each series is read from the same data the pages are built from (src/_data/weekly.js,
// magazine.js, treatise.js), never written here as a number: a test that named issue 100 as the newest broke when
// issues 101–110 were added (CI run 856, PR #385). Every link of the chain is checked, in English, German and
// Albanian.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const hasSite = fs.existsSync('_site/sq/books/mall-per-durresin.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const onward = (html) => html.match(/<a class="book-onward" href="([^"]+)"/)?.[1];
const data = async (name) => (await import(pathToFileURL(path.resolve('src/_data', `${name}.js`)).href)).default;
const LANGS = { en: '', de: 'de/', sq: 'sq/' };
const label = (lang) => (lang === 'en' ? 'Next publication' : JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'))['Next publication']);
const page = (slug) => `magazine/${slug}.html`;

// The whole line, from the data: [from page, to page, crosses into another publication].
const chain = async () => {
  const weekly = await data('weekly');
  const magazine = await data('magazine');
  const treatise = await data('treatise');
  const series = (list) => list.map((item, i) => [page(item.slug), list[i + 1] ? page(list[i + 1].slug) : null]);
  const links = [];
  const join = (list, next) => series(list).forEach(([from, to]) => links.push(to ? [from, to, false] : [from, next, true]));
  links.push([page('management-review-2026-09'), page(weekly.issues[0].slug), true]);
  join(weekly.issues, page(magazine.issues[0].slug));
  join(magazine.issues, page(treatise.volumes[0].slug));
  join(treatise.volumes, 'books/mall-per-durresin.html');
  links.push(['books/mall-per-durresin.html', page('management-review-2026-09'), true]);
  return { links, weekly, magazine, treatise };
};

test('every issue leads to the next, and the newest of each publication into the next publication, in three languages', { skip: !hasSite }, async () => {
  const { links, weekly, magazine } = await chain();
  // The newest Management Review is the last issue of the data, and the site has its page and none after it.
  const newest = weekly.issues.at(-1);
  assert.equal(newest, weekly.latest, 'the data names its newest issue');
  assert.ok(fs.existsSync(path.join('_site', page(newest.slug))), `${newest.slug} is built`);
  assert.ok(!weekly.issues.some((issue) => issue.number === newest.number + 1), 'no issue after the newest');
  for (const [lang, prefix] of Object.entries(LANGS)) {
    for (const [from, to, crossing] of links) {
      const html = built(prefix + from);
      const href = `/${prefix}${to}`;
      assert.equal(onward(html), href, `${prefix}${from}: at the end of the reader`);
      if (crossing) {
        assert.match(html, new RegExp(`<a class="issue-more-card" href="${href}">[\\s\\S]*?${label(lang)}`), `${prefix}${from}: under the text, as the next publication`);
      }
    }
  }
  // The links the hot fix was about, named, so a reader of a failure sees them at once.
  for (const [lang, prefix] of Object.entries(LANGS)) {
    assert.equal(onward(built(`${prefix}magazine/management-review-nr-100.html`)), `/${prefix}magazine/management-review-nr-101.html`, `${lang}: 100 → 101`);
    assert.equal(onward(built(`${prefix}magazine/management-review-nr-109.html`)), `/${prefix}magazine/management-review-nr-110.html`, `${lang}: 109 → 110`);
    assert.equal(onward(built(`${prefix}${page(newest.slug)}`)), `/${prefix}${page(magazine.issues[0].slug)}`, `${lang}: the newest issue → Nga Terreni`);
  }
  assert.equal(magazine.issues[0].slug, 'nga-terreni-01', 'Nga Terreni comes after the Management Review');
  assert.match(built('de/books/mall-per-durresin.html'), /Nächste Publikation · Management Review/);
  // The lists of issues carry the way on to the month before.
  assert.match(built('sq/magazine/management-review.html'), /data-weekly-onward data-next-label="Vazhdo me muajin \{month\}"/);
});

test('the chain is read from the data: a newer issue moves the step into the next publication with it', async () => {
  const { links, weekly } = await chain();
  const crossing = links.filter(([, , c]) => c).map(([from]) => from);
  assert.ok(crossing.includes(page(weekly.issues.at(-1).slug)), 'the newest issue crosses into the next publication');
  assert.ok(!crossing.includes(page(weekly.issues.at(-2).slug)), 'the issue before it does not');
  assert.equal(links.length, weekly.issues.length + 2 + (await data('magazine')).issues.length + (await data('treatise')).volumes.length, 'one link per issue, volume, the review and the book');
});
