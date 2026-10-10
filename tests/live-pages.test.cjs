// The pages of the Management Review, the magazine "Nga terreni" and the Tools Guide alive on the site: each print's
// stylesheet is scoped to its page (.mr .pg, .mz .pg, .tg .pg), so nothing of the site reaches into a page and nothing
// of the page reaches out; the print and the reader draw each page from one partial; the site serves the fonts the
// print uses; and the stylesheet of each publication's pages is one versioned file that only its reader loads
// (lib/live-pages.js, src/live-pages.njk).
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

const SCOPED = [['review-base.css', 'mr'], ['weekly.css', 'mr'], ['magazine.css', 'mz'], ['guide.css', 'tg']];

test('every rule of the page stylesheets is scoped to the page, after the reset that shuts the site out', () => {
  for (const [name, scope] of SCOPED) {
    const list = rules(read(path.join(PRINT, name)));
    assert.ok(list.length > 60, name);
    for (const [prelude] of list) {
      assert.doesNotMatch(prelude, /^@/, `${name}: ${prelude} (fonts and the page size belong to print-head.css)`);
      for (const selector of selectors(prelude)) {
        assert.ok(selector === `.${scope}` || selector.startsWith(`.${scope} .pg`), `${name}: ${selector}`);
      }
    }
  }
  for (const [name, scope] of SCOPED.filter(([file]) => file !== 'weekly.css')) {
    const list = rules(read(path.join(PRINT, name)));
    // The inside of an SVG stays out of the reset: its geometry and paint are attributes the reset would wipe.
    const reset = list.find(([prelude]) => prelude === `.${scope} .pg, .${scope} .pg *:not(svg *)`);
    assert.ok(reset, `${name}: the reset`);
    assert.match(reset[1], /all:\s*revert/);
    assert.equal(list.indexOf(reset), 1, `${name}: the reset comes right after the variables, before every rule it must lose to`);
  }
});

test('the page stylesheets name their fonts through variables the print and the site each set', () => {
  for (const [name] of SCOPED) {
    const css = read(path.join(PRINT, name));
    assert.doesNotMatch(css, /"Inter"|Georgia|"Archivo Black"/, `${name}: font names`);
    assert.match(css, /var\(--mr-sans\)/);
  }
  for (const name of ['print-head.css', 'live-pages.css']) {
    const css = read(path.join(PRINT, name));
    for (const variable of ['--mr-sans', '--mr-display', '--mr-serif']) assert.match(css, new RegExp(`${variable}:`), `${name}: ${variable}`);
    assert.match(css, /\.mr, \.mz, \.tg \{/, `${name}: the variables for the three scopes`);
  }
  const web = read(path.join(PRINT, 'live-pages.css'));
  for (const weight of [400, 500, 600, 700]) {
    const file = `fonts/inter-latin-${weight}-normal.woff2`;
    assert.match(web, new RegExp(`/${file}`), `review-web.css: ${file}`);
    assert.ok(fs.existsSync(`src/${file}`), `src/${file}`);
  }
  assert.ok(fs.existsSync('src/fonts/Inter-OFL.txt'), 'the licence of Inter');
  // The serif of the print, Liberation Serif (the measures of Times New Roman), so the lines break as on paper; a
  // device with Times uses its own copy.
  for (const face of ['regular', 'italic', 'bold']) {
    const file = `fonts/liberation-serif-latin-${face}.woff2`;
    assert.match(web, new RegExp(`/${file}`), `review-web.css: ${file}`);
    assert.ok(fs.existsSync(`src/${file}`), `src/${file}`);
  }
  assert.match(web, /local\("Times New Roman"\)/);
  assert.ok(fs.existsSync('src/fonts/LiberationSerif-OFL.txt'), 'the licence of Liberation Serif');
  assert.match(read(path.join(PRINT, 'print-head.css')), /--mr-serif: "Liberation Serif"/);
  assert.match(read(path.join(PRINT, 'review-web.css')), /\.mr \.pg \.wk-svg/, 'the review keeps its chart resets');
  assert.match(web, /font-family: "Inter MR"/, 'the web font keeps its own name, so the rest of the site keeps its own sans');
  assert.match(web, /\.book-page\.is-live > \.pg \{[^}]*transform: scale\(var\(--pg-scale/);
});

test('the print and the reader draw each page from the same partial', () => {
  const pairs = [['weekly', 'weekly-issue', 'weekly-page', 'mr'], ['review', 'review', 'review-page', 'mr'], ['magazine', 'magazine-issue', 'magazine-pages', 'mz'], ['print', 'guide', 'guide-pages', 'tg']];
  for (const [print, reader, partial, scope] of pairs) {
    const printed = read(`src/guide-print/${print}.njk`);
    const shown = read(`src/_includes/pages/${reader}.njk`);
    assert.match(printed, new RegExp(`<body class="${scope}">`), print);
    assert.ok(printed.includes(`{% include "print/${partial}.njk" %}`), `${print}: the partial`);
    assert.ok(shown.includes(`{%- include "print/${partial}.njk" %}`), `${reader}: the partial`);
    assert.match(shown, new RegExp(`class="book ${scope}" data-book-pages`), `${reader}: the book is the scope`);
    assert.ok(fs.existsSync(`${PRINT}/${partial}.njk`));
    assert.ok(read(`${PRINT}/${partial}.njk`).includes('<section class="pg'), partial);
  }
  // The magazine and the guide wrap their pages in the partial itself, so the print and the reader share them whole.
  for (const partial of ['magazine-pages', 'guide-pages']) assert.match(read(`${PRINT}/${partial}.njk`), /class="book-page is-live" (id="[^"]+" )?data-page="\{\{ [^}]+ \}\}"/, partial);
  assert.match(read('src/js/book.js'), /is-live/);
  assert.match(read('src/js/book.js'), /--pg-scale/);
});

test('the stylesheet of each publication is one versioned file', async () => {
  const { livePagesCss, LIVE_PAGES } = await import('../lib/live-pages.js');
  assert.deepEqual(Object.keys(LIVE_PAGES), ['review', 'magazine', 'guide']);
  for (const [name, scope] of [['review', 'mr'], ['magazine', 'mz'], ['guide', 'tg']]) {
    const { css, url } = livePagesCss(name);
    assert.ok(LIVE_PAGES[name].files.at(-1) === 'live-pages.css', `${name}: the shared rules come last, so the scale of a page wins`);
    assert.match(url, new RegExp(`^/${name}-pages\\.css\\?v=[0-9a-f]{10}$`));
    assert.ok(css.length > 10000 && !css.includes('/*'), `${name}: minified`);
    assert.match(css, new RegExp(`\\.${scope} \\.pg, ?\\.${scope} \\.pg \\*:not\\(svg \\*\\)\\{all: ?revert`), `${name}: the reset`);
    assert.match(css, /\.book-page\.is-live ?> ?\.pg\{/, `${name}: the scale`);
  }
  assert.throws(() => livePagesCss('book'));
});

const hasSite = fs.existsSync('_site/review-pages.css');
test('the built site serves each stylesheet to its reader pages and to no other page', { skip: !hasSite }, () => {
  // The special edition has 26 pages, an issue of the Management Review 10, an issue of the magazine 10 or 11 (the
  // pages of "From the floor" vary), the guide 29: every printed page sits in its wrapper.
  const cases = [
    ['review', ['magazine/management-review-nr-01.html', 'sq/magazine/management-review-nr-25.html', 'de/magazine/management-review-2026-09.html'], 10],
    ['magazine', ['magazine/nga-terreni-01.html', 'sq/magazine/nga-terreni-02.html', 'de/magazine/nga-terreni-01.html'], 10],
    ['guide', ['guides/tools-guide.html', 'sq/guides/tools-guide.html', 'de/guides/tools-guide.html'], 29],
  ];
  for (const [name, files, least] of cases) {
    assert.match(read(`_site/${name}-pages.css`), /\.book-page\.is-live ?> ?\.pg\{/, name);
    for (const file of files) {
      const html = read(path.join('_site', file));
      assert.match(html, new RegExp(`href="/${name}-pages\\.css\\?v=[0-9a-f]{10}"`), file);
      const live = (html.match(/class="book-page is-live"/g) || []).length;
      assert.ok(live >= least, `${file}: ${live} live pages`);
      assert.equal((html.match(/<section class="pg/g) || []).length, live, `${file}: every printed page in its wrapper`);
      assert.equal((html.match(/-pages\.css\?v=/g) || []).length, 1, `${file}: one stylesheet of live pages`);
    }
  }
  for (const file of ['index.html', 'sq/publications.html', 'magazine/management-review.html', 'books/mall-per-durresin.html']) {
    assert.doesNotMatch(read(path.join('_site', file)), /-pages\.css/, `${file} does not need it`);
  }
});

test('at rest the pages being read lie flat, outside any 3D scene, so their text is drawn sharp', () => {
  const css = read('src/styles.css');
  assert.match(read('src/js/book.js'), /classList\.toggle\("is-still", !sheets\.some\(\(sheet\) => sheet\.busy > 0\)\)/);
  assert.match(css, /\.book\.is-still \.book-sheet:not\(\.is-turned\) \{ transform-style: flat; \}/);
  assert.match(css, /\.book\.is-still \.book-sheet:not\(\.is-turned\) \.book-face\.is-back \{ visibility: hidden; \}/);
  assert.match(css, /\.is-single \.book\.is-still \{ perspective: none; \}/);
  assert.match(css, /\.is-single \.book\.is-still \.book-sheet\.is-turned \{ visibility: hidden; \}/);
});
