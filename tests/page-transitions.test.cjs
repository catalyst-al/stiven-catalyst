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
    assert.match(nav, new RegExp(`aria-current="page" href="${item}"[^>]*><span class="nav-orb" aria-hidden="true"></span>[^<]+<span class="nav-pill" aria-hidden="true"></span></a>`), file);
    assert.equal(nav.match(/class="nav-orb"/g)?.length, 5, `${file}: every menu item has its planet`);
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

test('Writing and Publications carry a stamp of what they hold, which changes when something comes out', { skip: !hasSite }, () => {
  const stampsOf = (file) => Object.fromEntries([...built(file).match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0]
    .matchAll(/data-news="([a-z]+)" data-stamp="([0-9a-f]{10})"/g)].map((m) => [m[1], m[2]]));
  const en = stampsOf('publications.html');
  assert.deepEqual(Object.keys(en), ['writing', 'publications']);
  assert.deepEqual(stampsOf('about.html'), en, 'the same on every page of a language');
  assert.notEqual(stampsOf('sq/about.html').writing, en.writing, 'each language has its own writing');
  assert.match(built('publications.html'), /data-new-label="New"/);
});

test('a returning reader sees the pulse where the stamp changed; opening the part stops it', () => {
  const { JSDOM } = require('jsdom');
  const page = (current) => `<html><body><header class="site-header"><nav class="main-nav" data-new-label="Neu">
    <a href="/insights.html" data-news="writing" data-stamp="w2"${current === 'writing' ? ' aria-current="page"' : ''}>Writing</a>
    <a href="/publications.html" data-news="publications" data-stamp="p1">Publications</a></nav>
    <button data-menu-toggle data-menu-label="Menu" data-close-label="Close" aria-expanded="false"></button>
    <nav data-mobile-panel data-open="false"><a href="/insights.html" data-news="writing">Writing</a></nav></header></body></html>`;
  const visit = (current, storage) => {
    const dom = new JSDOM(page(current), { url: 'https://example.test/', runScripts: 'outside-only', pretendToBeVisual: true });
    for (const [key, value] of Object.entries(storage)) dom.window.localStorage.setItem(key, value);
    dom.window.eval(fs.readFileSync('src/script.js', 'utf8'));
    const doc = dom.window.document;
    return {
      news: [...doc.querySelectorAll('.has-news')].map((el) => el.matches('[data-menu-toggle]') ? 'menu' : el.closest('.main-nav') ? `nav:${el.dataset.news}` : `phone:${el.dataset.news}`),
      label: doc.querySelector('.main-nav .has-news .visually-hidden')?.textContent,
      seen: { w: dom.window.localStorage.getItem('sc-seen-writing'), p: dom.window.localStorage.getItem('sc-seen-publications') },
    };
  };
  const first = visit('', {});
  assert.deepEqual(first.news, [], 'a first visit only notes what is there');
  assert.deepEqual(first.seen, { w: 'w2', p: 'p1' });
  const back = visit('', { 'sc-seen-writing': 'w1', 'sc-seen-publications': 'p1' });
  assert.deepEqual(back.news, ['nav:writing', 'menu', 'phone:writing']);
  assert.equal(back.label, ' (Neu)');
  const opened = visit('writing', { 'sc-seen-writing': 'w1', 'sc-seen-publications': 'p1' });
  assert.deepEqual(opened.news, [], 'on Writing itself nothing pulses');
  assert.equal(opened.seen.w, 'w2', 'and the new stamp is noted');
});

test('cards and rows light up under the pointer and rise into view without fighting the other animations', () => {
  for (const card of ['.article-card', '.note-card', '.project-card', '.mini-card']) {
    assert.match(css, new RegExp(`\\${card}::before[\\s\\S]*?radial-gradient\\(440px circle at var\\(--mx, 50%\\) var\\(--my, 0%\\)`), card);
  }
  assert.match(css, /a\.list-row::before \{[\s\S]*?var\(--mx, 30%\) var\(--my, 50%\)/);
  assert.match(css, /@media \(max-width: 620px\) \{ a\.list-row::before \{ inset: 4px -10px; \} \}/, 'the band stays inside the phone margin');
  // The rise on scroll has no specificity, so the rows that come in after a filter (.is-entering) keep theirs, and it
  // moves `translate`, so the hover lift (transform) still works.
  assert.match(css, /@supports \(animation-timeline: view\(\)\) \{\s*@media \(prefers-reduced-motion: no-preference\) \{\s*:where\(\.article-card,/);
  assert.match(css, /@keyframes scroll-rise \{ from \{ opacity: 0; translate: 0 26px; \} \}/);
});

test('the light follows a mouse across a card, and touch leaves it alone', () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<html><body><article class="article-card"><a href="#">Read</a></article><a class="list-row" href="#"><h2>Row</h2></a></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.eval(fs.readFileSync('src/script.js', 'utf8'));
  const card = window.document.querySelector('.article-card');
  card.getBoundingClientRect = () => ({ left: 100, top: 50, width: 300, height: 200 });
  const move = (target, pointerType) => {
    const event = new window.MouseEvent('pointermove', { bubbles: true, clientX: 160, clientY: 90 });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    target.dispatchEvent(event);
  };
  move(card.querySelector('a'), 'touch');
  assert.equal(card.style.getPropertyValue('--mx'), '');
  move(card.querySelector('a'), 'mouse');
  assert.equal(card.style.getPropertyValue('--mx'), '60px');
  assert.equal(card.style.getPropertyValue('--my'), '40px');
});

test('tool cards light up in the colour of their family and rise into view like the article cards', () => {
  assert.match(css, /\.tool-card::before \{[\s\S]*?color-mix\(in srgb, var\(--family, var\(--blue\)\) 15%, transparent\)/);
  assert.match(css, /\.tool-card:has\(a\):hover \{[\s\S]*?box-shadow: 0 26px 60px -34px color-mix\(in srgb, var\(--family, var\(--blue\)\) 80%/);
  assert.match(css, /\.family-card:hover,\s*\.family-card:focus-visible \{[\s\S]*?box-shadow: 0 24px 54px -30px color-mix\(in srgb, var\(--family\) 85%/);
  assert.match(css, /:where\(\.article-card, \.note-card, \.project-card, \.mini-card, \.tool-card, \.family-card,/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /closest\?\.\("\.article-card, \.note-card, \.project-card, \.mini-card, \.tool-card, [^"]*a\.list-row"\)/);
});

test('a publication answers the pointer as a whole, and a magazine cover catches the light', () => {
  assert.match(css, /\.book-feature::after \{[\s\S]*?radial-gradient\(620px circle at var\(--mx, 30%\) var\(--my, 50%\)/);
  assert.match(css, /\.book-feature:hover \.book-object-cover \{ transform: rotateY\(-9deg\) rotateX\(1deg\); \}/);
  assert.match(css, /@media \(max-width: 620px\) \{ \.book-feature::after \{ inset: 10px -10px; \} \}/, 'the band stays inside the phone margin');
  assert.match(css, /\.weekly-card:hover \.weekly-card-cover::after \{[^}]*background-position: -30% 0; \}/);
  assert.match(css, /:where\([^)]*\.book-feature, [^)]*\.list-row,/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.tool-card, \.book-feature, [^"]*a\.list-row"/);
});

test('a project card carries a chip with a planet that lights up, and its title steps forward', () => {
  assert.match(css, /\.project-card \.tag::before \{[\s\S]*?border-radius: 50%;[\s\S]*?radial-gradient\(circle at 35% 30%, #fff 0 12%, var\(--blue\) 48%/);
  assert.match(css, /\.project-card:hover \.tag \{[^}]*box-shadow: 0 0 16px -6px/);
  assert.match(css, /\.project-card:has\(a\):hover h2 \{ translate: 5px 0;/);
  assert.match(css, /\.project-card:hover \.project-image \{ scale: 1\.025; \}/);
});

test('About: the figures count up once in view and keep their own writing, and screen readers get the figure', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<html><body><dl class="about-stats"><div><dt>years</dt><dd>10+</dd></div><div><dt>drivers</dt><dd>~250</dd></div></dl></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  let seen = null;
  window.matchMedia = () => ({ matches: false });
  window.IntersectionObserver = class { constructor(cb) { seen = cb; this.cb = cb; } observe(el) { (this.els ||= []).push(el); } unobserve() {} };
  window.eval(fs.readFileSync('src/script.js', 'utf8'));
  const dds = [...window.document.querySelectorAll('dd')];
  seen(dds.map((target) => ({ target, isIntersecting: true })));
  assert.deepEqual(dds.map((dd) => dd.getAttribute('aria-label')), ['10+', '~250']);
  await new Promise((resolve) => window.setTimeout(resolve, 1500));
  assert.deepEqual(dds.map((dd) => dd.textContent), ['10+', '~250'], 'they end on the figure as written');
});

test('About: pillars, figures and the steps of the path answer the pointer like the cards', () => {
  assert.match(css, /\.pillar::before \{[\s\S]*?radial-gradient\(260px circle at var\(--mx, 50%\) var\(--my, 0%\)/);
  assert.match(css, /\.about-timeline li::before \{[\s\S]*?radial-gradient\(480px circle at var\(--mx, 20%\) var\(--my, 50%\)/);
  assert.match(css, /@media \(max-width: 620px\) \{ \.about-timeline li::before \{ inset: 4px -10px; \} \}/);
  assert.match(css, /\.about-portrait \{[\s\S]*?animation: portrait-breathe 5s ease-in-out infinite;/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.pillar, \.about-timeline li, a\.list-row"/);
});

test('Contact: the two ways to write are cards with a planet that answer the pointer', { skip: !hasSite }, () => {
  for (const [file, prefix] of [['contact.html', ''], ['sq/contact.html', '/sq'], ['de/contact.html', '/de']]) {
    const html = built(file);
    const cards = html.match(/<a class="contact-card"[\s\S]*?<\/a>/g) || [];
    assert.equal(cards.length, 2, file);
    assert.match(cards[0], /href="mailto:[^"]+@[^"]+"/);
    assert.match(cards[0], /<strong>[^<]+@<wbr>[^<]+<\/strong>/, `${file}: the address breaks after the @ if it must`);
    assert.match(cards[1], new RegExp(`href="${prefix}/your-challenge.html"`));
    for (const card of cards) assert.match(card, /<span class="contact-card-orb" aria-hidden="true"><\/span>/);
  }
  assert.match(css, /\.contact-card::before \{[\s\S]*?radial-gradient\(380px circle at var\(--mx, 30%\) var\(--my, 50%\)/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.contact-card, /);
});

test('Home: the featured essay answers the pointer, the outline fills with blue and the manifesto comes in line by line', () => {
  assert.match(css, /\.feature-card::before \{[\s\S]*?z-index: -1;[\s\S]*?radial-gradient\(560px circle at var\(--mx, 70%\) var\(--my, 20%\)/);
  assert.match(css, /\.feature-card:hover::after \{ color: color-mix\(in srgb, var\(--blue\) 40%, transparent\);/);
  assert.match(css, /\.meta-strip strong::before \{[\s\S]*?border-radius: 50%;/);
  const scroll = css.slice(css.indexOf('.cta h2 span {\n      background:') - 200, css.indexOf('@keyframes manifesto-in'));
  assert.match(scroll, /@supports \(animation-timeline: view\(\)\) \{\s*@media \(prefers-reduced-motion: no-preference\) \{/, 'only where scroll-driven animations run, and not for reduced motion');
  assert.match(scroll, /animation: cta-fill linear both;/);
  assert.match(scroll, /\.manifesto-line span:nth-child\(4\) \{ animation-range: entry 55% cover 40%; \}/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.feature-card, \.meta-strip > div, /);
});

test('Tools: a role section carries its colour, and the section reached from its card flashes once', () => {
  assert.match(css, /\.family-section::before \{[\s\S]*?inset: 0 0 auto;[\s\S]*?color-mix\(in srgb, var\(--family, var\(--blue\)\) 12%, transparent\)/, 'the light stays inside the page width');
  assert.match(css, /\.family-section:target::before \{ animation: family-arrive 1\.6s ease-out 1; \}/);
  assert.match(css, /@keyframes family-arrive \{ 0%, 25% \{ filter: brightness\(2\.6\) saturate\(1\.4\); \} \}/);
  assert.match(css, /\.family-card:hover \.family-count > span \{ translate: 0 3px; \}/);
  assert.match(css, /:where\([^)]*\.family-head,/);
});

test('Insights: series light up, the next essay beats, search and the chosen topic glow', () => {
  assert.match(css, /\.series-panel::before \{[\s\S]*?var\(--mx, 50%\) var\(--my, 50%\)/);
  assert.match(css, /@media \(max-width: 620px\) \{ \.series-panel::before \{ inset: 4px -10px; \} \}/);
  assert.match(css, /\.series-panel \.series-dots a\.is-next \{ animation: dot-next 2\.2s ease-in-out infinite; \}/);
  assert.match(css, /\.series-panel \.series-dots li:nth-child\(12\) \{ animation-range: entry 48% entry 88%; \}/);
  assert.match(css, /\.filter-search:focus-within \{[\s\S]*?box-shadow: 0 0 0 4px/);
  assert.match(css, /\.filter-chips \.chip\[aria-pressed="true"\]::before \{[\s\S]*?border-radius: 50%;/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.series-panel, /);
});

test('Reflections: a warm gold light for the personal pieces, and a sign-up row that glows', () => {
  assert.match(css, /\.reflection-list a\.list-row::before \{[\s\S]*?color-mix\(in srgb, var\(--gold\) 13%, transparent\)/);
  assert.match(css, /\.reflection-list \.number time::before \{[\s\S]*?var\(--gold\) 50%/);
  assert.match(css, /\.reflection-hero::before \{[\s\S]*?animation: reflection-breathe 7s ease-in-out infinite;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{ \.reflection-hero::before \{ animation: none; \} \}/);
  assert.match(css, /\.newsletter-row:focus-within \{[\s\S]*?box-shadow: 0 0 0 4px/);
});

test('Field Notes: "Copy" says it is done with a short glow, and a shared note greets the reader', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<html><body><div data-note-actions hidden><button data-copy-text="x" data-copied-label="Kopjuar">Kopjo</button></div></body></html>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async () => {} } });
  window.eval(fs.readFileSync('src/js/share.js', 'utf8'));
  const button = window.document.querySelector('button');
  button.click();
  await new Promise((resolve) => window.setTimeout(resolve, 20));
  assert.equal(button.textContent, 'Kopjuar');
  assert.ok(button.classList.contains('is-done'));
  await new Promise((resolve) => window.setTimeout(resolve, 1700));
  assert.equal(button.textContent, 'Kopjo');
  assert.ok(!button.classList.contains('is-done'), 'the glow goes with the word');
  assert.match(css, /\.note-card:target \{[\s\S]*?animation: note-arrive 2\.2s ease-out 1;/);
  assert.match(css, /\.note-actions \.is-done,\s*\.share-links \.is-done \{[\s\S]*?color: var\(--ok\);/);
});

test('Challenges: essays answer the pointer, index chips glow, and the challenge reached from the index flashes once', () => {
  assert.match(css, /\.challenge-essays li a::before \{[\s\S]*?radial-gradient\(380px circle at var\(--mx, 30%\) var\(--my, 0%\)/);
  assert.match(css, /\.challenge:target::before \{ animation: challenge-arrive 1\.8s ease-out 1; \}/);
  assert.match(css, /\.challenge::before \{[\s\S]*?inset: 0 0 auto;/, 'the light stays inside the page width');
  assert.match(css, /\.challenge-index a:hover b \{ text-shadow:/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.challenge-essays li a, /);
});

test('Tool pages: sibling tools and essays answer the pointer in the role colour, the box being filled glows, the badge breathes', () => {
  assert.match(css, /\.family-more-list a::before, \.tool-essays-list li a::before \{[\s\S]*?var\(--family, var\(--blue\)\)/);
  assert.match(css, /:where\(\.tool-panel \.dl-box, \.work-backup-card\):focus-within \{[\s\S]*?box-shadow: 0 0 0 4px/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.family-badge > span \{ animation: badge-breathe/);
  assert.match(css, /:where\([^)]*\.family-more-list li, \.tool-essays-list li[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.family-more-list a, \.tool-essays-list li a, /);
});

test('Role pages: rings fill with the planet colour, the ring jumped to greets you, cards answer the pointer, the routine draws itself', () => {
  assert.match(css, /\.role-rings a:hover b \{ background: var\(--family\);/);
  assert.match(css, /\.role-ring:target \.role-ring-head h2::after \{[\s\S]*?animation: ring-arrive/);
  assert.match(css, /\.role-borrowed a::before, \.role-reading a::before, \.role-next-card::before \{[\s\S]*?radial-gradient\(380px circle at var\(--mx, 30%\)/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\) \{\s*@media \(prefers-reduced-motion: no-preference\) \{\s*\.role-routine::before \{[^}]*animation: routine-draw/);
  assert.match(css, /:where\([^)]*\.role-borrowed li, \.role-reading li, \.role-next-card[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.role-borrowed a, \.role-reading a, \.role-next-card, /);
});

test('Essays: the next essay and the tools answer the pointer, a principle draws its line, the section jumped to greets you, the cover settles', () => {
  assert.match(css, /\.essay-tools li a::before, a\.essay-series-next::before \{[\s\S]*?radial-gradient\(420px circle at var\(--mx, 30%\)/);
  assert.match(css, /\.article-content h2\[id\]:target::after \{[\s\S]*?animation: ring-arrive/);
  assert.match(css, /\.article-content :is\(p\.essay-principle, blockquote\) \{ animation: principle-in linear both; animation-timeline: view\(\);/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.series-track \.series-dots a\.is-next \{ animation: dot-next/);
  assert.match(css, /\.article-hero-media img \{ animation: cover-settle/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.essay-tools li a, a\.essay-series-next, /);
  const light = fs.readFileSync('_site/styles-light.css', 'utf8');
  assert.match(light, /@keyframes ring-arrive/, 'essays use the light stylesheet, which keeps the arrival line');
});

test('Publications: the cover floats, the contents open softly, the reader buttons glow, the other issues answer the pointer', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.book-object \{ animation: cover-float/);
  assert.match(css, /\.book-contents:not\(\[hidden\]\) \{ animation: contents-in/);
  assert.match(css, /\[data-book-next\]:hover:not\(:disabled\) svg \{ translate: 2px 0; \}/);
  assert.match(css, /\.issue-more-card::before \{[\s\S]*?radial-gradient\(380px circle at var\(--mx, 30%\)/);
  assert.match(css, /\.book-closing blockquote p::before \{ animation: closing-line linear both; animation-timeline: view\(\);/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.issue-more-card, /);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes contents-in/, 'publications use the light stylesheet');
});

test('Projects: the cards fill in one after another, a project in progress beats, an outside link turns its arrow', () => {
  assert.match(css, /\.project-grid \.project-card > :is\(\.tag, div\) \{ animation: list-in/);
  assert.match(css, /\.project-card \.tag\.is-live::before \{ animation: news-beat/);
  assert.match(css, /\.project-card:hover \.project-link\[href\^="http"\] > span\[aria-hidden="true"\] \{[^}]*rotate: -45deg;/);
  for (const page of ['_site/projects.html', '_site/sq/projects.html', '_site/de/projects.html']) {
    const html = fs.readFileSync(page, 'utf8');
    assert.equal((html.match(/class="tag is-live"/g) || []).length, 1, `${page}: only the project in progress beats`);
  }
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /\.tag\.is-live/);
});

test('Start here: the portrait breathes, each step number lights up as it is reached, the closing links draw their line', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.start-intro img \{ animation: portrait-breathe/);
  assert.match(css, /\.start-number \{ animation: step-reach linear both; animation-timeline: view\(\);/);
  assert.match(css, /\.start-more a:hover \{ background-size: 100% 1px; \}/);
  assert.match(css, /:where\([^)]*\.start-intro[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes step-reach/);
});

test('Search: the box glows, results come in one after another with the words swept in, a result answers the pointer', () => {
  const js = fs.readFileSync('src/js/search.js', 'utf8');
  assert.match(js, /li\.className = "is-entering";/);
  assert.match(js, /li\.style\.setProperty\("--i", Math\.min\(list\.children\.length, 12\)\)/, 'the delay stops growing after a dozen results');
  assert.match(css, /\.search-form:focus-within \{ box-shadow: 0 0 0 4px/);
  assert.match(css, /\.search-results \.is-entering mark \{ animation: mark-sweep/);
  assert.match(css, /\.search-results a::before \{[\s\S]*?radial-gradient\(520px circle at var\(--mx, 30%\)/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.search-results a, /);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes mark-sweep/);
});

test('Podcast: the cover floats, a playing episode glows and breathes, apps and episodes answer the pointer, steps light up', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.podcast-cover \{ animation: cover-float/);
  assert.match(css, /\.audio-player\.is-playing \.audio-player-play \{ animation: news-ring/);
  assert.match(css, /\.audio-player\.is-playing \{ border-color:/);
  assert.match(css, /\.podcast-episode:has\(\.audio-player\.is-playing\) \{ border-color:/, 'inside an episode the whole card glows');
  assert.match(css, /\.podcast-app::before, \.podcast-episode::before \{[\s\S]*?radial-gradient\(420px circle at var\(--mx, 30%\)/);
  assert.match(css, /\.podcast-steps li b \{ animation: step-reach linear both; animation-timeline: view\(\);/);
  assert.match(css, /\.podcast-episode:target \{ animation: episode-arrive/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.podcast-app, \.podcast-episode, /);
  const light = fs.readFileSync('_site/styles-light.css', 'utf8');
  for (const name of ['cover-float', 'episode-arrive', 'step-reach', 'news-ring']) assert.match(light, new RegExp(`@keyframes ${name}`));
});

test('a player in a narrow column takes the phone layout from its own width, above the narrowest phones', () => {
  assert.match(css, /\.audio-player \{ container-type: inline-size; \}\n@media \(min-width: 381px\) \{ @container \(max-width: 480px\) \{/);
});

test('Shelf: rows lift under the pointer, reading fills its line, a removed row slides away', () => {
  assert.match(css, /\.shelf-row-link\.has-progress::after \{[\s\S]*?width: calc\(var\(--p, 0\) \* 100%\);/);
  assert.match(css, /\.shelf-row-link\.has-progress::after \{ animation: progress-fill/);
  assert.match(css, /\.shelf-row\.is-leaving \{ animation: row-leave/);
  assert.match(css, /:where\([^)]*\.shelf-section[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes row-leave/);
});

test('404: the title comes into focus, the three lines follow, and a small planet drifts around the orbit it slipped off', () => {
  assert.match(fs.readFileSync('src/404.njk', 'utf8'), /<div class="lost-orbit" aria-hidden="true"><i><\/i><b><\/b><\/div>/);
  assert.match(css, /\.lost-orbit \{ display: none; \}\n@media \(min-width: 980px\)/, 'only where there is room beside the lines');
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.lost-hero h1 \{ animation: lost-focus/);
  assert.match(css, /\.lost-orbit i \{ animation: lost-drift 14s linear infinite; \}/);
  assert.match(fs.readFileSync('_site/404.html', 'utf8'), /class="shell page-hero lost-hero"/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes lost-drift/);
});

test('legal pages: each heading draws a short blue line as it is reached, the text stays still, links turn blue', () => {
  assert.match(css, /\.legal h2::before \{[\s\S]*?background: var\(--blue\);/);
  assert.match(css, /\.legal h2::before \{ animation: legal-tick linear both; animation-timeline: view\(\);/);
  assert.match(css, /\.legal a:hover \{ color: var\(--blue\);/);
  assert.doesNotMatch(css, /\.legal p \{[^}]*animation/, 'the text itself does not move');
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes legal-tick/);
});

test('How this is made reads as a path: a line that fills as the page is read, a stop at each heading that lights up', () => {
  assert.equal((fs.readFileSync('src/how-this-is-made.njk', 'utf8').match(/<section class="shell legal how-made">/g) || []).length, 3, 'in all three languages');
  assert.match(css, /\.how-made::after \{ animation: how-fill linear both; animation-timeline: view\(\);/);
  assert.match(css, /\.how-made h2::before \{ animation: how-reach linear both; animation-timeline: view\(\);/);
  assert.match(css, /\.how-made > \*, \.how-made h2 \{ padding-left: 30px; \}/, 'headings and text start on the same line');
  for (const page of ['_site/how-this-is-made.html', '_site/sq/how-this-is-made.html', '_site/de/how-this-is-made.html']) assert.match(fs.readFileSync(page, 'utf8'), /class="shell legal how-made"/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes how-fill/);
});

test('Operational treatise: the three layers come in one after another, each lights up in its own colour under the pointer', () => {
  assert.match(css, /\.treatise-layer\.is-scene \{ --layer: var\(--red\); \}/);
  assert.match(css, /\.treatise-layer::after \{[\s\S]*?color-mix\(in srgb, var\(--layer\) 13%, transparent\)/);
  assert.match(css, /\.treatise-layer:nth-child\(3\) \{ animation-range: entry 60px entry 200px; \}/);
  assert.match(css, /\.treatise-layer::before \{ animation: layer-bar linear both; animation-timeline: view\(\);/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.treatise-layer, /);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes layer-bar/);
});

test('Management Review: "Review" is underlined as the page opens, a cover tilts towards the pointer with a glare', () => {
  const js = fs.readFileSync('src/script.js', 'utf8');
  assert.match(js, /\.treatise-layer, \.weekly-card, /);
  assert.match(js, /card\.style\.setProperty\("--px", Math\.min\(Math\.max\(\(event\.clientX - box\.left\) \/ box\.width, 0\), 1\)\.toFixed\(2\)\)/);
  assert.match(css, /\.weekly-hero \.weekly-mark::after \{ animation: mark-draw/);
  assert.match(css, /\.weekly-card:hover \.weekly-card-cover \{ transform: perspective\(700px\) translateY\(-4px\) rotateY\(calc\(\(var\(--px, \.5\) - \.5\) \* 14deg\)\)/);
  assert.match(css, /\.weekly-card-cover::before \{[\s\S]*?radial-gradient\(220px circle at var\(--mx, 50%\) var\(--my, 0%\)/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes mark-draw/);
});

test('From the Floor: the title rises from below its own line as the page opens, the lede follows', () => {
  assert.match(fs.readFileSync('src/_includes/pages/magazine-archive.njk', 'utf8'), /<section class="shell page-hero weekly-hero floor-hero">/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.floor-hero h1 \{ animation: floor-rise/);
  assert.match(css, /@keyframes floor-rise \{ from \{ clip-path: inset\(-\.2em -\.2em 100% -\.2em\); translate: 0 100%; \}/, 'the clip and the move cancel out, so the lower edge stays put');
  for (const page of ['_site/magazine/from-the-floor.html', '_site/sq/magazine/from-the-floor.html', '_site/de/magazine/from-the-floor.html']) assert.match(fs.readFileSync(page, 'utf8'), /floor-hero/);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /@keyframes floor-rise/);
});

test('Issue pages: the facts come in one after another, the charts answer the pointer and a bar lights up under it', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.book-hero \.book-facts > div \{ animation: list-in/);
  assert.match(css, /\.weekly-chart::before \{[\s\S]*?radial-gradient\(460px circle at var\(--mx, 30%\)/);
  assert.match(css, /\.wk-svg :is\(\.wk-bar, \.wk-col, \.wk-dot, \.wk-person, \.wk-day\):hover \{ filter: brightness\(1\.25\)/);
  assert.match(css, /:where\([^)]*\.weekly-chart[^)]*\) \{\s*animation: scroll-rise/);
  assert.match(fs.readFileSync('src/script.js', 'utf8'), /\.weekly-card, \.weekly-chart, /);
  assert.match(fs.readFileSync('_site/styles-light.css', 'utf8'), /\.weekly-chart::before/);
});
