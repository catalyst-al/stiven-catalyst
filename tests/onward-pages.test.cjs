// The way on from the podcast and the projects page: each podcast episode links to the next one and, when one
// ends, the next starts by itself (pages/podcast.njk, js/podcast.js); the projects page ends with where to go next.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

test('start here marks the three essays already read and offers to continue where the reader left off', { skip: !fs.existsSync('_site/sq/start.html') }, () => {
  const picks = JSON.parse(fs.readFileSync('src/_data/homeEssays.json', 'utf8')).essays.map((e) => e.slug);
  for (const prefix of ['', '/sq', '/de']) {
    const html = fs.readFileSync(`_site${prefix}/start.html`, 'utf8');
    for (const slug of picks) assert.match(html, new RegExp(`data-read-row="${slug}"[\\s\\S]*?data-read-mark hidden`), `${prefix || '/'}: ${slug}`);
    assert.match(html, /<section class="shell home-continue"[^>]*data-home-continue hidden/);
    assert.match(html, /\/js\/writing\.js/);
    assert.match(html, /\/js\/home-continue\.js/);
  }
});

test('the publications page offers the publication left unfinished, in its language, opened on its page', () => {
  const page = (url, recent) => {
    const dom = new JSDOM(`<body><section data-pub-continue hidden data-page-label="Page {n} of {total}">
      <a href="#" data-pub-continue-link><small data-pub-continue-meta></small><strong data-pub-continue-title></strong></a></section></body>`, { url, runScripts: 'outside-only' });
    if (recent) dom.window.localStorage.setItem('sc-book-recent', JSON.stringify(recent));
    dom.window.eval(fs.readFileSync('src/js/pub-continue.js', 'utf8'));
    const box = dom.window.document.querySelector('[data-pub-continue]');
    return { hidden: box.hidden, href: box.querySelector('a').getAttribute('href'), meta: box.querySelector('small').textContent, title: box.querySelector('strong').textContent };
  };
  const recent = [
    { u: '/sq/magazine/management-review-nr-45.html', k: 'Management Review · Nr. 45', h: 'Puna me turne', p: 7, n: 10, t: 3 },
    { u: '/magazine/management-review-nr-12.html', k: 'Management Review · No. 12', h: 'Shift work', p: 4, n: 10, t: 2 },
    { u: '/magazine/management-review-nr-13.html', k: 'Management Review · No. 13', h: 'Finished', p: 10, n: 10, t: 9 },
  ];
  assert.equal(page('https://example.test/sq/publications.html', null).hidden, true, 'nothing read: nothing shown');
  assert.deepEqual(page('https://example.test/sq/publications.html', recent), { hidden: false, href: '/sq/magazine/management-review-nr-45.html#faqe-7', meta: 'Management Review · Nr. 45 · Page 7 of 10', title: 'Puna me turne' });
  assert.equal(page('https://example.test/publications.html', recent).href, '/magazine/management-review-nr-12.html#faqe-4', 'English: the English one, not the finished one');
  assert.equal(page('https://example.test/de/publications.html', recent).hidden, true, 'German: none read in German');
});

test('the slim line above the title leads to the one before, the list and the one after', { skip: !fs.existsSync('_site/sq/magazine/management-review-nr-20.html') }, () => {
  const pager = (file) => fs.readFileSync(`_site/${file}`, 'utf8').match(/<nav class="shell top-pager"[\s\S]*?<\/nav>/)?.[0] || '';
  const links = (html) => [...html.matchAll(/<a class="top-pager-(\w+)" href="([^"]+)"/g)].map((m) => `${m[1]} ${m[2]}`);
  // Above the title: the bar comes before the hero.
  const reflection = fs.readFileSync('_site/sq/reflections/cut-off-from-the-ground/index.html', 'utf8');
  assert.ok(reflection.indexOf('class="shell top-pager"') < reflection.indexOf('class="shell article-hero'));
  assert.deepEqual(links(pager('sq/magazine/management-review-nr-20.html')), ['prev /sq/magazine/management-review-nr-19.html', 'all /sq/magazine/management-review.html', 'next /sq/magazine/management-review-nr-21.html']);
  assert.match(pager('sq/reflections/cut-off-from-the-ground/index.html'), /class="top-pager-all" href="\/sq\/reflections.html"/);
  assert.match(pager('insights/starting-from-zero/index.html'), /class="top-pager-next" href="\/insights\/[^"]+\/" rel="next"/);
  assert.match(pager('sq/books/mall-per-durresin.html'), /class="top-pager-next" href="\/sq\/magazine\/management-review-2026-09.html"/);
});

test('download all: the list names every file of the Downloads page, each one built, and the file with all the writing', { skip: !fs.existsSync('_site/downloads/all-sq.json') }, async () => {
  const downloads = (await import(path.resolve('src/_data/downloads.js'))).default;
  for (const lang of ['en', 'sq', 'de']) {
    const manifest = JSON.parse(fs.readFileSync(`_site/downloads/all-${lang}.json`, 'utf8'));
    const files = manifest.sections.flatMap((s) => s.files);
    assert.equal(files.length + 1, downloads[lang].allCount, `${lang}: every file and the writing`);
    for (const f of [...files, manifest.writing]) assert.ok(fs.existsSync(`_site${f.href}`), `${lang}: ${f.href} is built`);
    assert.equal(new Set(files.map((f) => f.name)).size, files.length, `${lang}: no two files share a name in the archive`);
    const writing = fs.readFileSync(`_site${manifest.writing.href}`, 'utf8');
    assert.match(writing, /<meta name="robots" content="noindex">/);
    assert.ok((writing.match(/<article id="essay-/g) || []).length >= 40, `${lang}: the essays`);
    assert.ok((writing.match(/<article id="reflection-/g) || []).length >= 40, `${lang}: the reflections`);
    assert.doesNotMatch(writing, /<script/);
  }
  // The button is beside "Download PDF" on a publication and in the byline of an essay.
  assert.match(fs.readFileSync('_site/sq/magazine/management-review-nr-20.html', 'utf8'), /data-download-all data-download="\/downloads\/all-sq.json"/);
  assert.match(fs.readFileSync('_site/de/insights/starting-from-zero/index.html', 'utf8'), /data-download-all data-download="\/downloads\/all-de.json"/);
});
