// The book in three editions (scripts/book-edition.py, scripts/book/<lang>.txt, src/_data/books/<lang>.json): the
// Albanian original and the English and German translations, set page for page in the same design. Each language's
// page reads its own edition, the chapters start on the same pages, and the Albanian edition keeps its own files.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = (file) => fs.readFileSync(file, 'utf8');
const books = Object.fromEntries(['sq', 'en', 'de'].map((lang) => [lang, JSON.parse(read(`src/_data/books/${lang}.json`))]));
const TITLES = { sq: 'Mall për Durrësin', en: 'Longing for Durrës', de: 'Sehnsucht nach Durrës' };

// The pages of a text file and, for each, what it holds: its keys, paragraphs, dialogue lines and photographs.
const shape = (lang) => {
  const pages = {};
  let page = null;
  for (const line of read(`scripts/book/${lang}.txt`).split('\n')) {
    const start = line.match(/^== (\d\d)$/);
    if (start) pages[start[1]] = page = [];
    else if (page && line && !line.startsWith('#')) {
      const key = line.match(/^(kicker|chapter|section|quote|cover-title|subtitle|title|dedication|note-heading|note|edition|contents|contents-note|heading|blurb): /);
      page.push(key ? key[1] : line.startsWith('— ') ? 'dialogue' : line.startsWith('[image') ? line : 'p');
    }
  }
  return pages;
};

test('each edition has the 33 pages, with the chapters on the same pages', () => {
  for (const [lang, book] of Object.entries(books)) {
    assert.equal(book.language, lang);
    assert.equal(book.title, TITLES[lang], lang);
    assert.equal(book.pageCount, 33, lang);
    assert.equal(book.pages.length, 33, lang);
    assert.deepEqual(book.chapters.map((c) => c.page), books.sq.chapters.map((c) => c.page), `${lang}: the chapters start on the same pages`);
    assert.deepEqual(book.chapters.map((c) => /^[IVX]+$/.test(c.label)), books.sq.chapters.map((c) => /^[IVX]+$/.test(c.label)), lang);
    for (const page of book.pages) {
      assert.ok(fs.existsSync(`src${page.image}`), page.image);
      assert.ok(fs.existsSync(`src${page.large}`), page.large);
    }
    for (const width of [240, 480, 720]) assert.ok(fs.existsSync(`src${book.pages[0].image.replace('.webp', `-${width}.webp`)}`), `${lang}: the cover at ${width} px`);
    assert.ok(fs.existsSync(`src${book.pdf}`), book.pdf);
    assert.ok(fs.existsSync(`src${book.social}`), book.social);
    assert.ok(book.text.length > 100, `${lang}: the whole text`);
  }
});

test('the Albanian edition keeps its own files; the translations have theirs', () => {
  assert.equal(books.sq.pdf, '/media/books/mall-per-durresin/mall-per-durresin.pdf');
  assert.match(books.sq.pages[0].image, /^\/media\/books\/mall-per-durresin\/page-01\.webp$/);
  for (const lang of ['en', 'de']) {
    assert.ok(books[lang].pages.every((page) => page.image.startsWith(`/media/books/mall-per-durresin/${lang}/`)), lang);
    assert.ok(books[lang].pdf.startsWith(`/media/books/mall-per-durresin/${lang}/`), lang);
  }
});

test('a translation keeps the pages, titles, paragraphs, dialogue and photographs of the original', () => {
  const original = shape('sq');
  for (const lang of ['en', 'de']) {
    const pages = shape(lang);
    assert.deepEqual(Object.keys(pages), Object.keys(original), lang);
    for (const number of Object.keys(original)) assert.deepEqual(pages[number], original[number], `${lang}: page ${number}`);
    assert.match(read(`scripts/book/${lang}.txt`), new RegExp(`^language: ${lang}$`, 'm'));
  }
});

const hasSite = fs.existsSync('_site/sq/books/mall-per-durresin.html');

test('each language reads its own edition and links the others', { skip: !hasSite && 'needs the built site' }, () => {
  for (const [lang, prefix] of [['en', ''], ['de', 'de/'], ['sq', 'sq/']]) {
    const html = read(`_site/${prefix}books/mall-per-durresin.html`);
    const book = books[lang];
    assert.match(html, new RegExp(`<h1[^>]*>${TITLES[lang]}</h1>`), lang);
    assert.ok(html.includes(`src="${book.pages[0].image}"`), `${lang}: its own cover`);
    assert.ok(html.includes(`href="${book.pdf}" download`), `${lang}: its own PDF`);
    assert.ok(!/<h1 lang=/.test(html), `${lang}: the book is in the page's language`);
    const editions = html.match(/<p class="book-languages">[\s\S]*?<\/p>/)?.[0] ?? '';
    for (const [other, path] of [['en', '/books/'], ['de', '/de/books/'], ['sq', '/sq/books/']]) {
      if (other !== lang) assert.ok(editions.includes(`href="${path}mall-per-durresin.html" hreflang="${other}"`), `${lang} links ${other}`);
    }
    for (const chapter of book.chapters) assert.ok(html.includes(`data-book-goto="${chapter.page}"`), `${lang}: chapter on page ${chapter.page}`);
  }
  assert.match(read('_site/sq/books/mall-per-durresin.html'), /Kapitulli I</);
  assert.match(read('_site/books/mall-per-durresin.html'), /Chapter I</);
  assert.match(read('_site/de/books/mall-per-durresin.html'), /Kapitel I</);
});
