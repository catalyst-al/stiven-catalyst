// Moving between pages: the cross-document view transition (styles.css, "Moving between pages"), the marked menu item
// and writing tab that slide to their new place, and the links fetched before they are clicked (base.njk).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const hasSite = fs.existsSync('_site/publications.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');

test('pages move into each other only for readers who have not asked for less motion', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition \{ navigation: auto; \}\s*\}/);
  assert.doesNotMatch(css.replace(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition[^}]*\}\s*\}/, ''), /@view-transition/,
    'the transition is switched on in one place only');
  for (const name of ['site-header', 'nav-pill', 'writing-tabs', 'tab-pill']) {
    assert.equal(css.match(new RegExp(`view-transition-name: ${name};`, 'g'))?.length, 1, name);
  }
});

test('the menu item and the writing tab of the page carry the piece that slides', { skip: !hasSite }, () => {
  for (const [file, item] of [['publications.html', '/publications.html'], ['de/tools.html', '/de/tools.html'], ['sq/reflections.html', '/sq/insights.html']]) {
    const html = built(file);
    const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    assert.equal(nav.match(/class="nav-pill"/g)?.length, 1, `${file}: one line under the menu`);
    assert.match(nav, new RegExp(`aria-current="page" href="${item}">[^<]+<span class="nav-pill" aria-hidden="true"></span></a>`), file);
    assert.doesNotMatch(html.match(/<nav id="mobile-menu"[\s\S]*?<\/nav>/)[0], /nav-pill/, `${file}: the name stays unique`);
  }
  const reflections = built('reflections.html');
  assert.equal(reflections.match(/class="tab-pill"/g)?.length, 1);
  assert.match(reflections, /href="\/reflections.html" aria-current="page">Reflections<span class="tab-pill" aria-hidden="true"><\/span><\/a>/);
  assert.doesNotMatch(built('index.html'), /nav-pill|tab-pill/, 'the homepage marks no menu item');
});

test('links are fetched ahead, and the Content Security Policy allows exactly those rules', { skip: !hasSite }, () => {
  const { createHash } = require('node:crypto');
  for (const file of ['index.html', 'publications.html', 'tools/pareto/index.html', 'sq/insights.html']) {
    const html = built(file);
    const rules = html.match(/<script type="speculationrules">([^<]+)<\/script>/);
    assert.ok(rules, `${file}: speculation rules`);
    const parsed = JSON.parse(rules[1]);
    assert.equal(parsed.prefetch[0].eagerness, 'moderate');
    assert.ok(!('prerender' in parsed), 'only fetched, never run ahead (the visit counts stay true)');
    const hash = `'sha256-${createHash('sha256').update(rules[1]).digest('base64')}'`;
    assert.ok(html.match(/script-src([^;]*)/)[1].includes(hash), `${file}: the rules' hash is in script-src`);
  }
});

test('the menu slides open and its button turns into a cross; closed, nothing in it can be reached', { skip: !hasSite }, () => {
  const nav = built('publications.html').match(/<button class="menu-button"[\s\S]*?<\/button>/)[0];
  assert.equal(nav.match(/class="menu-line"/g)?.length, 3, 'three lines that can move');
  assert.match(css, /\.menu-button\[aria-expanded="true"\] \.menu-line:nth-child\(1\) \{ transform: rotate\(45deg\) translateY\(5px\); \}/);
  const narrow = css.slice(css.indexOf('@media (max-width: 900px) {'));
  assert.match(narrow, /\.mobile-panel \{\s*display: grid;[\s\S]*?visibility: hidden;/, 'closed, the menu is hidden, not only transparent');
  assert.match(narrow, /\.mobile-panel\[data-open="true"\] \{\s*visibility: visible;/);
});

test('a tap on the dimmed page closes the menu and presses nothing underneath', () => {
  const { JSDOM } = require('jsdom');
  const html = `<html><body><header class="site-header"><button data-menu-toggle data-menu-label="Menu" data-close-label="Close" aria-expanded="false"></button>
    <nav data-mobile-panel data-open="false"><a href="#a">A</a></nav></header><main><button id="under">Under</button></main></body></html>`;
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  const { window } = dom;
  window.eval(fs.readFileSync('src/script.js', 'utf8'));
  const doc = window.document;
  const panel = doc.querySelector('[data-mobile-panel]');
  let pressed = 0;
  doc.getElementById('under').addEventListener('click', () => { pressed += 1; });
  doc.querySelector('[data-menu-toggle]').click();
  assert.equal(panel.dataset.open, 'true');
  const under = doc.getElementById('under');
  under.dispatchEvent(new window.MouseEvent('pointerdown', { bubbles: true }));
  under.click();
  assert.equal(panel.dataset.open, 'false');
  assert.equal(pressed, 0, 'the tap only closed the menu');
  under.click();
  assert.equal(pressed, 1, 'with the menu closed, the page works as before');
});

test('the blue of the chosen month is one pill that follows the month chosen', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(`<html><body><div class="weekly-months"><button aria-pressed="true">Nov</button><button aria-pressed="false">Oct</button></div></body></html>`, { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  // jsdom lays nothing out: each button is 100 × 40 px, the second one 110 px to the right.
  for (const [name, value] of [['offsetWidth', () => 100], ['offsetHeight', () => 40], ['offsetTop', () => 5], ['offsetLeft', function () { return this.textContent === 'Oct' ? 115 : 5; }]]) {
    Object.defineProperty(window.HTMLElement.prototype, name, { configurable: true, get: value });
  }
  window.eval(fs.readFileSync('src/script.js', 'utf8'));
  const group = window.document.querySelector('.weekly-months');
  const pill = group.querySelector('.month-pill');
  assert.ok(pill && group.classList.contains('has-pill'));
  assert.equal(pill.getAttribute('aria-hidden'), 'true');
  assert.equal(pill.style.transform, 'translate(5px, 5px)');
  assert.equal(pill.style.width, '100px');
  const [nov, oct] = group.querySelectorAll('button');
  nov.setAttribute('aria-pressed', 'false');
  oct.setAttribute('aria-pressed', 'true');
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.equal(pill.style.transform, 'translate(115px, 5px)', 'the pill moved to October');
});

test('the rows come in one after another after a click on a topic, not while typing', () => {
  const { JSDOM } = require('jsdom');
  const rows = ['a', 'b', 'c'].map((id, i) => `<a class="list-row" data-filter-item data-topic="${i ? 'x' : 'y'}" data-search="${id}"></a>`).join('');
  const dom = new JSDOM(`<body><section data-filter-list><div data-filter-controls><input type="search" data-filter-search>
    <button class="chip" data-topic="">All</button><button class="chip" data-topic="x">x</button><p data-filter-count></p></div>${rows}<p data-filter-empty hidden></p></section></body>`,
    { url: 'https://example.test/insights.html', runScripts: 'outside-only' });
  const { window } = dom;
  window.eval(fs.readFileSync('src/js/filter.js', 'utf8'));
  const doc = window.document;
  const entering = () => [...doc.querySelectorAll('.is-entering')].map((row) => row.dataset.search);
  assert.deepEqual(entering(), [], 'nothing moves when the page opens');
  doc.querySelector('[data-topic="x"]').click();
  assert.deepEqual(entering(), ['b', 'c']);
  assert.deepEqual([...doc.querySelectorAll('.is-entering')].map((row) => row.style.getPropertyValue('--i')), ['0', '1']);
  doc.querySelectorAll('.is-entering').forEach((row) => row.dispatchEvent(new window.Event('animationend')));
  assert.deepEqual(entering(), [], 'the class goes when the row has come in');
  const search = doc.querySelector('[data-filter-search]');
  search.value = 'c';
  search.dispatchEvent(new window.Event('input'));
  assert.deepEqual(entering(), []);
});

test('every button changes smoothly and gives under the finger, without touching its own transform', () => {
  assert.match(css, /:where\(button, \.button-primary, \.button-secondary, \.button-ghost, \.icon-button, [^)]*\) \{\s*transition: [^;]*scale \.25s/);
  assert.match(css, /:is\(button, [^)]*\):active:where\(:not\(:disabled\)\) \{ scale: \.96; \}/);
  assert.doesNotMatch(css, /:active[^{]*\{[^}]*transform: scale\(\.96\)/, 'the press uses scale, not transform');
  for (const rule of ['.chip {', '.weekly-filter button {', '.writing-tabs a {', '.book-button {']) {
    const body = css.slice(css.indexOf(rule), css.indexOf('}', css.indexOf(rule)));
    assert.match(body, /transition:[^;]*scale/, `${rule} lets the press move smoothly`);
  }
});
