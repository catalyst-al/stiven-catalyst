// What keeps the pages light: small copies of the images shown small (scripts/thumbnails.mjs), and the
// minifier that must never rename the names the scripts share through the global scope (lib/js-minify.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out); else out.push(file);
  }
  return out;
};

test('every cover has its small copies, and every tool preview its 720 px copy', () => {
  const covers = ['books', 'magazine', 'guides'].flatMap((kind) => walk(path.join('src/media', kind)))
    .filter((file) => path.basename(file) === 'page-01.webp' && !/[/\\]art[/\\]/.test(file));
  assert.ok(covers.length >= 10, `found ${covers.length} covers`);
  for (const cover of covers) for (const width of [240, 480]) {
    assert.ok(fs.existsSync(cover.replace(/\.webp$/, `-${width}.webp`)), `${cover}: run node scripts/thumbnails.mjs`);
  }
  for (const lang of ['en', 'de', 'sq']) {
    const previews = fs.readdirSync(`src/media/tools/${lang}`).filter((name) => /^[a-z0-9-]+\.jpg$/.test(name));
    assert.equal(previews.length, 14, lang);
    for (const name of previews) {
      assert.ok(fs.existsSync(`src/media/tools/${lang}/${name.replace(/\.jpg$/, '-720.webp')}`), `${lang}/${name}: run node scripts/thumbnails.mjs`);
    }
  }
});

// The online readers (the book, the Tools Guide, the magazines, the Management Review) offer every page at 1000 and
// at 2000 px (scripts/page_images.py), so a sharp screen or a page opened large never enlarges a small picture.
test('every page of the online readers has a sharp copy twice as wide', () => {
  const read = (name) => JSON.parse(fs.readFileSync(`src/_data/${name}`, 'utf8'));
  const lists = [
    ['book', read('book.json').pages],
    ...Object.entries(read('toolsGuidePages.json')).map(([lang, entry]) => [`tools-guide ${lang}`, entry.pages]),
    ...Object.entries(read('magazinePages.json')).flatMap(([slug, langs]) => Object.entries(langs).map(([lang, entry]) => [`${slug} ${lang}`, entry.pages])),
  ];
  assert.ok(lists.length >= 20, `found ${lists.length} readers`);
  for (const [name, pages] of lists) {
    assert.ok(pages.length > 1, name);
    for (const page of pages) {
      const hint = `${name}, page ${page.number}: run scripts/guide-pages.py or scripts/book-pages.py`;
      assert.equal(page.width, 1000, hint);
      assert.equal(page.largeWidth, 2000, hint);
      assert.ok(page.large && fs.existsSync(path.join('src', page.large)), `${hint} (${page.large})`);
      assert.ok(fs.existsSync(path.join('src', page.image)), `${hint} (${page.image})`);
    }
  }
  for (const reader of ['book', 'guide', 'magazine-issue', 'review', 'weekly-issue']) {
    const template = fs.readFileSync(`src/_includes/pages/${reader}.njk`, 'utf8');
    assert.match(template, /\| pageSrcset \| safe/, `${reader}.njk: the page images need their srcset`);
    assert.match(template, /data-book-zoom/, `${reader}.njk: the zoom button`);
    assert.match(template, /data-book-view data-one="[^"]+" data-two="[^"]+"/, `${reader}.njk: the button for one large page or two pages`);
  }
  // On a wide screen the reader opens one page 1000 px wide (js/book.js, styles.css), so the small print is read at
  // its own size; the sizes the browser picks the picture by say the same, so above 1x it takes the 2000 px copy.
  assert.match(fs.readFileSync('src/styles.css', 'utf8'), /\.js \.book-reader\.is-large \.book \{\s*width: min\(100%, 1000px\);/);
  assert.match(fs.readFileSync('eleventy.config.js', 'utf8'), /\(min-width: 900px\) min\(calc\(100vw - 32px\), 1000px\)/);
});

test('the minifier shortens local names but keeps the shared top-level ones', async () => {
  const { minify } = await import('terser');
  const source = 'const ToolKit = (() => { const longLocalName = 41; return { answer: () => longLocalName + 1 }; })();\nfunction shared(value) { return value * 2; }\nwindow.Answer = ToolKit.answer();';
  const lib = fs.readFileSync('lib/js-minify.js', 'utf8');
  assert.match(lib, /toplevel: false/);
  assert.match(lib, /module: false/);
  const { code } = await minify(source, { ecma: 2020, module: false, toplevel: false, compress: { passes: 2 }, mangle: true });
  assert.match(code, /ToolKit/);
  assert.match(code, /function shared/);
  assert.doesNotMatch(code, /longLocalName/);
});
