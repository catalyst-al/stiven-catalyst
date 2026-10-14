// "How this is made" (src/how-this-is-made.njk) and the dates of the publications (src/_data/online.json): the page says
// only what the site can show, and stays true when the site changes. Its quote is the sentence that closes the essay
// it links; its list of corrections is the publications that carry a correction note; the publications give the day
// they went online, to readers and to search engines. Built pages (_site).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/how-this-is-made.html');
const read = (path) => fs.readFileSync(`_site/${path}`, 'utf8');
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const online = JSON.parse(fs.readFileSync('src/_data/online.json', 'utf8'));
const LANGS = [['en', ''], ['de', 'de/'], ['sq', 'sq/']];

test('the page exists in each language, and every page links it from the footer in its own language', { skip: !hasSite }, () => {
  for (const [, prefix] of LANGS) {
    assert.ok(fs.existsSync(`_site/${prefix}how-this-is-made.html`), prefix || 'en');
    for (const page of ['index.html', 'tools.html', 'magazine/management-review-nr-47.html']) {
      assert.match(read(`${prefix}${page}`), new RegExp(`<footer[\\s\\S]*href="/${prefix}how-this-is-made.html"`), `${prefix}${page}`);
    }
  }
});

test('its quote is the sentence that closes the essay it names, in each language', { skip: !hasSite }, () => {
  for (const [lang, prefix] of LANGS) {
    const essay = fs.readFileSync(`src/content/${lang === 'en' ? '' : `${lang}/`}insights/2026-10-13-the-report-a-machine-wrote.md`, 'utf8');
    const closing = [...essay.matchAll(/\*\*([^*]+)\*\*/g)].at(-1)[1];
    assert.ok(plain(read(`${prefix}how-this-is-made.html`)).includes(closing), `${lang}: ${closing}`);
    assert.match(read(`${prefix}how-this-is-made.html`), new RegExp(`href="/${prefix}insights/the-report-a-machine-wrote/"`));
  }
});

test('its list of corrections is exactly the publications that carry a correction note', { skip: !hasSite }, () => {
  const corrected = fs.readdirSync('_site/magazine').filter((name) => name.endsWith('.html') && read(`magazine/${name}`).includes('class="book-corrections"')).sort();
  const page = read('how-this-is-made.html');
  const section = page.slice(page.indexOf('<h2>Corrections</h2>'), page.indexOf('<h2>Your data</h2>'));
  const listed = [...section.matchAll(/href="\/magazine\/([^"]+\.html)"/g)].map((m) => m[1]).sort();
  assert.deepEqual(listed, corrected);
  // And the podcast episodes whose recording was cut (corrections in audio.json), on the podcast page.
  const audio = JSON.parse(fs.readFileSync('src/_data/audio.json', 'utf8'));
  const cut = Object.keys(audio).filter((slug) => Object.values(audio[slug]).some((track) => track.corrections?.length)).sort();
  assert.deepEqual([...section.matchAll(/href="\/podcast\.html#episode-([^"]+)"/g)].map((m) => m[1]).sort(), cut);
  for (const [, prefix] of LANGS) {
    const html = read(`${prefix}how-this-is-made.html`);
    for (const slug of cut) assert.ok(html.includes(`podcast.html#episode-${slug}"`), `${prefix}: ${slug}`);
  }
});

test('the publications say when they went online, and tell search engines the same', { skip: !hasSite }, () => {
  for (const [slug, label, prefix] of [['management-review-nr-47', 'Online since', ''], ['management-review-nr-01', 'Online seit', 'de/'], ['management-review-2026-09', 'Online që më', 'sq/'], ['nga-terreni-02', 'Online since', ''], ['operational-treatise-vol-01', 'Online since', '']]) {
    const html = read(`${prefix}magazine/${slug}.html`);
    assert.match(html, new RegExp(`<dt>${label}</dt><dd>[^<]+</dd>`), `${prefix}${slug}`);
    assert.equal(html.match(/"datePublished":"([^"]+)"/)[1], online[slug].published, slug);
    assert.equal(html.match(/"dateModified":"([^"]+)"/)[1], online[slug].modified, slug);
  }
  // Every issue, From the Floor and the treatise has its dates; a date is a real day, the change never before it.
  for (const [slug, { published, modified }] of Object.entries(online)) {
    assert.match(published, /^2026-\d\d-\d\d$/, slug);
    assert.ok(modified >= published, slug);
  }
  assert.equal(Object.keys(online).filter((slug) => slug.startsWith('management-review-nr-')).length, 80);
  for (const [, prefix] of LANGS) assert.doesNotMatch(read(`${prefix}magazine/management-review.html`), /every month brings|çdo muaj vjen|jeden Monat kommt/);
});

test('the diagram of "The system is faster than you" gives no number it cannot source', () => {
  const diagrams = fs.readFileSync('lib/diagrams.js', 'utf8');
  const split = diagrams.slice(diagrams.indexOf('id: "decision-split"'), diagrams.indexOf('id: "dashboard-lag"'));
  assert.doesNotMatch(split, /\b98\b|hundred|hundert|njëqind/);
});
