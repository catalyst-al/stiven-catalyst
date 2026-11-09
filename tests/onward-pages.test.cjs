// The way on from the podcast and the projects page: each podcast episode links to the next one and, when one
// ends, the next starts by itself (pages/podcast.njk, js/podcast.js); the projects page ends with where to go next.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const episode = (slug) => `<li class="podcast-episode" id="episode-${slug}"><div data-audio><audio data-audio-media></audio>
  <div data-audio-controls><button data-audio-toggle>Play</button></div></div></li>`;

test('when an episode ends, the next one starts, and the last one ends the list', () => {
  const dom = new JSDOM(`<body><ol>${episode('a')}${episode('b')}${episode('c')}</ol></body>`, { runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.Element.prototype.scrollIntoView = () => {};
  const pressed = [];
  w.document.querySelectorAll('[data-audio-toggle]').forEach((button) => button.addEventListener('click', () => pressed.push(button.closest('li').id)));
  w.eval(fs.readFileSync('src/js/podcast.js', 'utf8'));
  const media = [...w.document.querySelectorAll('[data-audio-media]')];
  media[0].dispatchEvent(new w.Event('ended'));
  assert.deepEqual(pressed, ['episode-b']);
  media[1].dispatchEvent(new w.Event('ended'));
  assert.deepEqual(pressed, ['episode-b', 'episode-c']);
  media[2].dispatchEvent(new w.Event('ended'));
  assert.deepEqual(pressed, ['episode-b', 'episode-c'], 'nothing after the last');
});

test('each episode on the podcast page links to the next one', { skip: !fs.existsSync('_site/sq/podcast.html') }, () => {
  const html = fs.readFileSync('_site/sq/podcast.html', 'utf8');
  const ids = [...html.matchAll(/<li class="podcast-episode" id="([^"]+)"/g)].map((m) => m[1]);
  const nexts = [...html.matchAll(/data-podcast-next="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length < 2) return;
  assert.deepEqual(nexts, ids.map((_, i) => ids[(i + 1) % ids.length]));
  assert.match(html, /Episodi i radhës: /);
});

test('the projects page ends with the way on: the tools, essay 1 and the newest issue', { skip: !fs.existsSync('_site/sq/projects.html') }, () => {
  for (const [lang, prefix] of [['en', ''], ['sq', '/sq'], ['de', '/de']]) {
    const html = fs.readFileSync(`_site${prefix || ''}/projects.html`, 'utf8');
    const section = html.match(/<section class="shell issue-more projects-more"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, `${lang}: the section is there`);
    const links = [...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(links[0], `${prefix}/tools.html`);
    assert.match(links[1], new RegExp(`^${prefix}/insights/[^/]+/$`));
    assert.match(links[2], new RegExp(`^${prefix}/magazine/management-review-nr-\\d+\\.html$`));
  }
});

test('the homepage offers to continue where the reader left off, and nothing on a first visit', () => {
  const order = [
    { s: 'one', t: 'Essay one', u: '/insights/one/', k: 'Essay', d: 'First.' },
    { s: 'two', t: 'Essay two', u: '/insights/two/', k: 'Essay', d: 'Second.' },
    { s: 'three', t: 'Reflection three', u: '/reflections/three/', k: 'Reflection', d: '' },
  ];
  const page = (reading) => {
    const dom = new JSDOM(`<body><section data-home-continue hidden data-continue-label="Continue" data-next-label="Up next" data-read-label="{p}% read">
      <p data-home-continue-kicker></p><a href="#" data-home-continue-link><small data-home-continue-meta></small><strong data-home-continue-title></strong><span data-home-continue-summary></span></a>
      <script type="application/json" data-home-continue-data>${JSON.stringify(order)}</script></section></body>`, { url: 'https://example.test/', runScripts: 'outside-only' });
    if (reading) dom.window.localStorage.setItem('sc-reading', JSON.stringify(reading));
    dom.window.eval(fs.readFileSync('src/js/home-continue.js', 'utf8'));
    const box = dom.window.document.querySelector('[data-home-continue]');
    return { hidden: box.hidden, kicker: box.querySelector('[data-home-continue-kicker]').textContent, href: box.querySelector('a').getAttribute('href'), meta: box.querySelector('small').textContent };
  };
  assert.equal(page(null).hidden, true, 'a first visit sees nothing');
  const begun = page({ one: { p: 1, done: true, t: 1 }, three: { p: 0.4, done: false, t: 3 }, two: { p: 0.2, done: false, t: 2 } });
  assert.deepEqual(begun, { hidden: false, kicker: 'Continue', href: '/reflections/three/', meta: 'Reflection · 40% read' });
  const finished = page({ one: { p: 1, done: true, t: 5 } });
  assert.deepEqual(finished, { hidden: false, kicker: 'Up next', href: '/insights/two/', meta: 'Essay' });
  assert.equal(page({ one: { p: 1, done: true, t: 1 }, two: { p: 1, done: true, t: 2 }, three: { p: 1, done: true, t: 3 } }).hidden, true, 'nothing left to read');
});

test('the about page ends with where to go next: start here, essay 1, projects and contact', { skip: !fs.existsSync('_site/sq/about.html') }, () => {
  for (const prefix of ['', '/sq', '/de']) {
    const html = fs.readFileSync(`_site${prefix}/about.html`, 'utf8');
    const section = html.match(/<section class="shell issue-more about-next"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, `${prefix || '/'}: the section is there`);
    const links = [...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(links.length, 4);
    assert.equal(links[0], `${prefix}/start.html`);
    assert.match(links[1], new RegExp(`^${prefix}/insights/[^/]+/$`));
    assert.deepEqual(links.slice(2), [`${prefix}/projects.html`, `${prefix}/contact.html`]);
  }
});

test('the contact page ends with where to go next: start here, essay 1, the tools and about', { skip: !fs.existsSync('_site/sq/contact.html') }, () => {
  for (const prefix of ['', '/sq', '/de']) {
    const html = fs.readFileSync(`_site${prefix}/contact.html`, 'utf8');
    const section = html.match(/<section class="shell issue-more contact-next"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, `${prefix || '/'}: the section is there`);
    const links = [...section.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(links.length, 4);
    assert.equal(links[0], `${prefix}/start.html`);
    assert.match(links[1], new RegExp(`^${prefix}/insights/[^/]+/$`));
    assert.deepEqual(links.slice(2), [`${prefix}/tools.html`, `${prefix}/about.html`]);
  }
});
