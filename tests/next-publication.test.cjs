// The publications in one line (the "nextPublication" filter in eleventy.config.js): the newest issue of each series
// leads into the first of the next publication, at the end of the reader and in "Read another issue", and the book
// leads back to the Management Review of September 2026, so no reader ends in a list.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const onward = (html) => html.match(/<a class="book-onward" href="([^"]+)"/)?.[1];

const data = async (name) => {
  const mod = await import(path.resolve(`src/_data/${name}.js`));
  return typeof mod.default === 'function' ? mod.default() : mod.default;
};

test('the newest issue of each publication leads into the next one', { skip: !fs.existsSync('_site/sq/books/mall-per-durresin.html') }, async () => {
  // The newest of each series, from the data, so the test holds as new issues come out.
  const [weekly, magazine, treatise, review] = await Promise.all(['weekly', 'magazine', 'treatise', 'review'].map(data));
  const at = (slug) => `/sq/magazine/${slug}.html`;
  const chain = [
    [at(review.slug), at(weekly.issues[0].slug)],
    [at(weekly.issues.at(-1).slug), at(magazine.issues[0].slug)],
    [at(magazine.issues.at(-1).slug), at(treatise.volumes[0].slug)],
    [at(treatise.volumes.at(-1).slug), '/sq/books/mall-per-durresin.html'],
    ['/sq/books/mall-per-durresin.html', at(review.slug)],
  ];
  for (const [page, next] of chain) {
    const html = built(page.slice(1));
    assert.equal(onward(html), next, `${page}: at the end of the reader`);
    assert.match(html, new RegExp(`<a class="issue-more-card" href="${next}">[\\s\\S]*?Botimi i radhës`), `${page}: under the text`);
  }
  // An issue in the middle of its series still leads to the next issue of the same series.
  assert.equal(onward(built('magazine/management-review-nr-50.html')), '/magazine/management-review-nr-51.html');
  assert.match(built('de/books/mall-per-durresin.html'), /Nächste Publikation · Management Review/);
  // The lists of issues carry the way on to the month before.
  assert.match(built('sq/magazine/management-review.html'), /data-weekly-onward data-next-label="Vazhdo me muajin \{month\}"/);
});
