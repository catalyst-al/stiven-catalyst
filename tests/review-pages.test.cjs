// The pages of the Management Review alive on the site: the print's stylesheet is scoped to the page (.mr .pg), so
// nothing of the site reaches into a page and nothing of the page reaches out; the print and the reader draw each page
// from one partial; the site serves the fonts the print uses; and the stylesheet of the pages is one versioned file
// that only those pages load (lib/review-css.js, src/review-pages.njk).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(file, 'utf8');
const PRINT = 'src/_includes/print';

// Top-level rules of a stylesheet: [prelude, body], comments dropped.
const rules = (css) => {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let depth = 0; let start = 0; let open = -1;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '{') { if (depth === 0) open = i; depth += 1; }
    else if (text[i] === '}') { depth -= 1; if (depth === 0) { out.push([text.slice(start, open).trim(), text.slice(open + 1, i)]); start = i + 1; } }
  }
  return out;
};
const selectors = (prelude) => prelude.split(/,(?![^(]*\))/).map((s) => s.trim()).filter(Boolean);

test('every rule of the page stylesheets is scoped to the page, after the reset that shuts the site out', () => {
  for (const name of ['review-base.css', 'weekly.css']) {
    const list = rules(read(path.join(PRINT, name)));
    assert.ok(list.length > 100, name);
    for (const [prelude] of list) {
      assert.doesNotMatch(prelude, /^@/, `${name}: ${prelude} (fonts and the page size belong to print-head.css)`);
      for (const selector of selectors(prelude)) {
        assert.ok(selector === '.mr' || selector.startsWith('.mr .pg'), `${name}: ${selector}`);
      }
    }
  }
  const base = rules(read(path.join(PRINT, 'review-base.css')));
  const reset = base.find(([prelude]) => prelude === '.mr .pg, .mr .pg *');
  assert.ok(reset, 'the reset');
  assert.match(reset[1], /all:\s*revert/);
  assert.equal(base.indexOf(reset), 1, 'the reset comes right after the variables, before every rule it must lose to');
});

test('the page stylesheets name their fonts through variables the print and the site each set', () => {
  for (const name of ['review-base.css', 'weekly.css']) {
    const css = read(path.join(PRINT, name));
    assert.doesNotMatch(css, /"Inter"|Georgia|"Archivo Black"/, `${name}: font names`);
    assert.match(css, /var\(--mr-sans\)/);
  }
  for (const name of ['print-head.css', 'review-web.css']) {
    const css = read(path.join(PRINT, name));
    for (const variable of ['--mr-sans', '--mr-display', '--mr-serif']) assert.match(css, new RegExp(`${variable}:`), `${name}: ${variable}`);
  }
  const web = read(path.join(PRINT, 'review-web.css'));
  for (const weight of [400, 500, 600, 700]) {
    const file = `fonts/inter-latin-${weight}-normal.woff2`;
    assert.match(web, new RegExp(`/${file}`), `review-web.css: ${file}`);
    assert.ok(fs.existsSync(`src/${file}`), `src/${file}`);
  }
  assert.ok(fs.existsSync('src/fonts/Inter-OFL.txt'), 'the licence of Inter');
  assert.match(web, /font-family: "Inter MR"/, 'the web font keeps its own name, so the rest of the site keeps its own sans');
  assert.match(web, /\.book-page\.is-live > \.pg \{[^}]*transform: scale\(var\(--pg-scale/);
});

test('the print and the reader draw each page from the same partial', () => {
  for (const [print, reader, partial] of [['weekly', 'weekly-issue', 'weekly-page'], ['review', 'review', 'review-page']]) {
    const printed = read(`src/guide-print/${print}.njk`);
    const shown = read(`src/_includes/pages/${reader}.njk`);
    assert.match(printed, /<body class="mr">/, print);
    assert.ok(printed.includes(`{% include "print/${partial}.njk" %}`), `${print}: the partial`);
    assert.ok(shown.includes(`{%- include "print/${partial}.njk" %}`), `${reader}: the partial`);
    assert.match(shown, /class="book mr" data-book-pages/, `${reader}: the book is the scope`);
    assert.ok(fs.existsSync(`${PRINT}/${partial}.njk`));
    assert.ok(read(`${PRINT}/${partial}.njk`).includes('<section class="pg'), partial);
  }
  assert.match(read('src/js/book.js'), /is-live/);
  assert.match(read('src/js/book.js'), /--pg-scale/);
});

test('the stylesheet of the pages is one versioned file', async () => {
  const { reviewPagesCss, REVIEW_CSS_FILES } = await import('../lib/review-css.js');
  const { css, url } = reviewPagesCss();
  assert.deepEqual(REVIEW_CSS_FILES, ['review-base.css', 'weekly.css', 'review-web.css']);
  assert.match(url, /^\/review-pages\.css\?v=[0-9a-f]{10}$/);
  assert.ok(css.length > 20000 && !css.includes('/*'), 'minified');
  assert.match(css, /\.mr \.pg, ?\.mr \.pg \*\{all: ?revert/);
});

const hasSite = fs.existsSync('_site/review-pages.css');
test('the built site serves the stylesheet to the pages of the Management Review and to no other page', { skip: !hasSite }, () => {
  const css = read('_site/review-pages.css');
  assert.match(css, /\.book-page\.is-live ?> ?\.pg\{/);
  for (const file of ['magazine/management-review-nr-01.html', 'sq/magazine/management-review-nr-25.html', 'de/magazine/management-review-2026-09.html']) {
    const html = read(path.join('_site', file));
    assert.match(html, /href="\/review-pages\.css\?v=[0-9a-f]{10}"/, file);
    assert.ok((html.match(/class="book-page is-live"/g) || []).length >= 10, `${file}: live pages`);
    assert.ok(!/<img[^>]*loading="lazy"[^>]*>\s*<\/div>\s*<\/div>/.test(html), file);
  }
  for (const file of ['index.html', 'sq/publications.html', 'magazine/management-review.html', 'magazine/nga-terreni-01.html']) {
    assert.doesNotMatch(read(path.join('_site', file)), /review-pages\.css/, `${file} does not need it`);
  }
});
