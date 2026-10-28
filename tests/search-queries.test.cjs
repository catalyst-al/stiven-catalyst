const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

// The Search page as built, over the index the build wrote for its language (audit P2C-12): the count says how many
// pages were found, not how many are listed; "fuehrung" finds what "Führung" finds, as the ATS CV matcher does; and
// "C#" or a single letter gets an answer, not a blank page.
const SITE = path.join(__dirname, '..', '_site');
const script = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'search.js'), 'utf8');

const open = (lang) => {
  const file = path.join(SITE, lang === 'en' ? '' : lang, 'search.html');
  if (!fs.existsSync(file)) throw new Error(`${file} is missing: run npm run build first`);
  const html = fs.readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  const index = JSON.parse(fs.readFileSync(path.join(SITE, lang === 'en' ? '' : lang, 'search-index.json'), 'utf8'));
  const dom = new JSDOM(html, { url: `https://example.test${lang === 'en' ? '' : `/${lang}`}/search.html`, runScripts: 'outside-only' });
  const w = dom.window;
  w.HTMLElement.prototype.focus = () => {};
  w.fetch = async () => ({ json: async () => index });
  w.eval(script);
  const search = async (text) => {
    const input = w.document.querySelector('[data-search-input]');
    input.value = text;
    input.dispatchEvent(new w.Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 200));
  };
  const count = () => w.document.querySelector('[data-search-count]').textContent;
  const results = () => [...w.document.querySelectorAll('[data-search-results] li a')].map((a) => a.getAttribute('href'));
  return { w, index, search, count, results };
};

// Pages whose text holds the word, written any of the ways people write it: counted here without search.js.
const holding = (index, forms) => index.filter((item) => forms.some((form) => `${item.t} ${item.s} ${item.b}`.normalize('NFC').toLowerCase().includes(form))).length;

test('German: "Führung" says how many pages hold it, and lists the first 30 of them', async () => {
  const { index, search, count, results } = open('de');
  const total = holding(index, ['führung', 'fuehrung']);
  assert.ok(total > 30, `the index has ${total} pages with Führung`);
  await search('Führung');
  assert.equal(count(), `Die ersten 30 von ${total} Ergebnissen`);
  assert.equal(results().length, 30);
});

test('German: "fuehrung" and "fuhrung" find what "Führung" finds', async () => {
  const { search, count, results } = open('de');
  await search('Führung');
  const expected = { count: count(), results: results() };
  for (const query of ['fuehrung', 'FUEHRUNG', 'fuhrung', 'Führung']) {
    await search(query);
    assert.deepEqual({ count: count(), results: results() }, expected, query);
  }
});

test('Albanian: "pergjegjesi" and "ceshtje" find the words with ë and ç', async () => {
  const { index, search, count } = open('sq');
  await search('përgjegjësi');
  const withMarks = count();
  assert.notEqual(withMarks, '');
  await search('pergjegjesi');
  assert.equal(count(), withMarks);
  const total = holding(index, ['çështje']);
  assert.ok(total > 0);
  await search('ceshtje');
  assert.match(count(), total === 1 ? /^1 rezultat$/ : new RegExp(`\\b${total}\\b`));
});

test('"C#", a single letter or only signs get an answer, never a blank page', async () => {
  const { w, index, search, count, results } = open('en');
  const none = w.document.querySelector('[data-search]').dataset.noneLabel;
  for (const query of ['C#', 'R', '#', '?!']) {
    await search(query);
    assert.notEqual(count(), '', `${query}: the count is blank`);
    if (results().length === 0) assert.equal(count(), none, query);
  }
  // A letter on its own is a word, not any "r" inside a word: "R" finds pages with the word "R" only.
  await search('R');
  const byUrl = new Map(index.map((item) => [item.u, item]));
  for (const href of results()) assert.match(`${byUrl.get(href).t} ${byUrl.get(href).s} ${byUrl.get(href).b}`, /(?:^|[^\p{L}\p{N}])r(?![\p{L}\p{N}])/iu, href);
  // "C#" is looked for as written, so it never lists pages that only hold a "c".
  await search('C#');
  for (const href of results()) assert.match(`${byUrl.get(href).t} ${byUrl.get(href).s} ${byUrl.get(href).b}`, /(?:^|[^\p{L}\p{N}])c#/iu, href);
  // A short word beside a real one still finds pages.
  await search('handover a');
  assert.ok(results().length > 0, '"handover a" finds pages');
});

test('the question is still kept in the address', async () => {
  const { w, search } = open('en');
  await search('C#');
  assert.equal(new w.URL(w.location.href).searchParams.get('q'), 'C#');
});
