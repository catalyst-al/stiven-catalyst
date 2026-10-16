// The Downloads page (src/_data/downloads.js, pages/downloads.njk): every file of the site to keep, by kind of
// publication, in the reader's language, each listed only when it is on the site and with its size.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const hasSite = fs.existsSync('_site/downloads.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

test('the page exists in three languages, linked from the footer of every page', { skip: !hasSite }, () => {
  for (const [file, lang, heading] of [['downloads.html', 'en', 'Downloads'], ['sq/downloads.html', 'sq', 'Shkarkime'], ['de/downloads.html', 'de', 'Downloads']]) {
    const html = built(file);
    assert.match(html, new RegExp(`<h1[^>]*>${heading}</h1>`));
    assert.match(html, new RegExp(`<html lang="${lang}"`));
  }
  assert.match(built('index.html'), /<nav class="footer-links"[\s\S]*?<a href="\/downloads\.html">Downloads<\/a>/);
  assert.match(built('sq/index.html'), /<nav class="footer-links"[\s\S]*?<a href="\/sq\/downloads\.html">Shkarkime<\/a>/);
});

test('every file listed is on the site, in the language of the page, with its size', { skip: !hasSite }, () => {
  for (const [file, lang] of [['downloads.html', 'en'], ['sq/downloads.html', 'sq'], ['de/downloads.html', 'de']]) {
    const html = built(file);
    const files = [...html.matchAll(/<a class="downloads-file" href="([^"]+)" download><b>(PDF|MP3)<\/b>[^<]*<span>([\d.,]+ MB)<\/span>/g)];
    assert.ok(files.length > 80, `${file}: the book, the guide and every issue`);
    for (const [, href, kind, size] of files) {
      assert.ok(fs.existsSync(path.join('_site', href)), `${href} is on the site`);
      if (href.startsWith('/media/magazine/') || href.startsWith('/media/audio/') || href.includes('/tools-guide-')) assert.match(href, new RegExp(`-${lang}\\.(pdf|mp3)$`), `${href} is in ${lang}`);
      assert.equal(kind, href.endsWith('.mp3') ? 'MP3' : 'PDF');
      if (lang !== 'en') assert.doesNotMatch(size, /\./, 'a decimal comma in sq and de');
    }
    assert.match(html, /href="\/media\/books\/mall-per-durresin\/mall-per-durresin\.pdf" download/, 'the Albanian original');
    const edition = JSON.parse(fs.readFileSync(`src/_data/books/${lang}.json`, 'utf8'));
    assert.ok(html.includes(`href="${edition.pdf}" download`), `${file}: the book in its own language`);
    assert.ok(html.includes(`management-review-nr-80-${lang}.pdf`) && html.includes(`management-review-nr-01-${lang}.pdf`), 'the newest and the first issue');
  }
});

test('a long list shows its newest eight and keeps the rest one tap away; each row links to its page', { skip: !hasSite }, () => {
  const html = built('downloads.html');
  const review = html.slice(html.indexOf('id="review"'), html.indexOf('id="treatise"'));
  const open = review.slice(0, review.indexOf('<details'));
  assert.equal((open.match(/class="downloads-row"/g) || []).length, 8);
  assert.match(review, /<details class="downloads-more">\s*<summary>All 81 issues<\/summary>/);
  assert.match(open, /<a class="downloads-title" href="\/magazine\/management-review-nr-80\.html">/);
  assert.match(built('sq/downloads.html'), /<a class="downloads-title" href="\/sq\/magazine\/management-review-nr-80\.html">/);
});

test('in motion: rows rise and answer the pointer, a file\'s arrow drops, the rest unfolds one row after another', () => {
  const css = fs.readFileSync('src/styles.css', 'utf8');
  assert.match(css, /\.downloads-file:hover i \{ translate: 0 3px; \}/);
  assert.match(css, /\.downloads-row::before \{[^}]*radial-gradient\(460px circle at var\(--mx, 30%\)/);
  assert.match(css, /\.downloads-more\[open\] \.downloads-row \{ animation: list-in/);
  assert.match(css, /:where\([^)]*\.downloads-list > \.downloads-row[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.book-object, \.downloads-row, /);
});

test('search finds the page in each language', { skip: !hasSite }, () => {
  for (const [file, url, title] of [['search-index.json', '/downloads.html', 'Downloads'], ['sq/search-index.json', '/sq/downloads.html', 'Shkarkime'], ['de/search-index.json', '/de/downloads.html', 'Downloads']]) {
    const entry = JSON.parse(built(file)).find((item) => item.u === url);
    assert.ok(entry, `${file} has ${url}`);
    assert.equal(entry.t, title);
  }
});
