// Writing: the section ids and principles in an essay body (lib/essay-body.js), and the list of essays that
// shows what this browser has read and where to continue (src/js/writing.js).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const load = () => import('../lib/essay-body.js');

test('section titles get unique ids, the contents list them in order', async () => {
  const { essayBody, essayContents } = await load();
  const html = '<p>Intro</p><h2>1. People</h2><p>a</p><h2>Ditët 1–30: Kupto &amp; mëso</h2><h3>Sub</h3><h2>1. People</h2>';
  const body = essayBody(html);
  assert.match(body, /<h2 id="1-people">1\. People<\/h2>/);
  assert.match(body, /<h2 id="ditet-1-30-kupto-meso">/);
  assert.match(body, /<h2 id="1-people-2">/);
  assert.match(body, /<h3>Sub<\/h3>/, 'only the section titles get ids');
  assert.deepEqual(essayContents(html).map((s) => s.id), ['1-people', 'ditet-1-30-kupto-meso', '1-people-2']);
  assert.equal(essayContents(html)[1].html, 'Ditët 1–30: Kupto &amp; mëso');
});

test('a paragraph that is only a bold sentence becomes a principle; the words do not change', async () => {
  const { essayBody } = await load();
  assert.equal(essayBody('<p><strong>I will not ignore it.</strong></p>'), '<p class="essay-principle"><strong>I will not ignore it.</strong></p>');
  assert.equal(essayBody('<p>For me, <strong>this</strong> matters.</p>'), '<p>For me, <strong>this</strong> matters.</p>');
  assert.equal(essayBody('<p><strong>One</strong> and <strong>two</strong></p>'), '<p><strong>One</strong> and <strong>two</strong></p>');
  const strip = (h) => h.replace(/<[^>]+>/g, '');
  const md = fs.readFileSync('src/content/insights/2026-10-04-the-operations-manager-i-want-to-be.md', 'utf8');
  const sample = md.split('\n').filter((l) => l.startsWith('## ') || /^\*\*[^*]+\*\*$/.test(l)).map((l) => l.startsWith('## ') ? `<h2>${l.slice(3)}</h2>` : `<p><strong>${l.slice(2, -2)}</strong></p>`).join('');
  assert.equal(strip(essayBody(sample)), strip(sample));
});

// The Insights list as the template renders it, with what a reader has read so far.
const list = (reading) => {
  const dots = Array.from({ length: 4 }, (_, i) => `<li><a href="/insights/e${i + 1}/" data-essay-dot="e${i + 1}" data-essay-number="${i + 1}"></a></li>`).join('');
  const rows = Array.from({ length: 4 }, (_, i) => `<a class="list-row" data-read-row="e${i + 1}"><span class="row-meta">x<span data-read-mark hidden>Read</span></span></a>`).join('');
  const dom = new JSDOM(`<body><section data-series-panel data-read-label="{a} of {b} read" data-continue-label="Continue with essay {n}" data-resume-label="Continue reading essay {n}">
    <p data-series-count>4 essays</p><ol>${dots}</ol><a data-series-next href="/insights/e1/">Start with essay 1</a></section>${rows}</body>`, { url: 'https://example.test/insights.html', runScripts: 'outside-only' });
  if (reading) dom.window.localStorage.setItem('sc-reading', JSON.stringify(reading));
  dom.window.eval(fs.readFileSync('src/js/writing.js', 'utf8'));
  const $ = (s) => dom.window.document.querySelector(s);
  return { $, all: (s) => [...dom.window.document.querySelectorAll(s)] };
};

test('with nothing read the list stays as built', () => {
  const { $ } = list(null);
  assert.equal($('[data-series-next]').textContent, 'Start with essay 1');
  assert.equal($('[data-series-count]').textContent, '4 essays');
});

test('read essays are marked, and the button continues with the first one not read', () => {
  const { $, all } = list({ e1: { p: 1, done: true, t: 1 }, e2: { p: 0.95, done: true, t: 2 } });
  assert.equal($('[data-series-count]').textContent, '2 of 4 read');
  assert.equal($('[data-series-next]').textContent, 'Continue with essay 3');
  assert.equal($('[data-series-next]').getAttribute('href'), '/insights/e3/');
  assert.deepEqual(all('[data-read-mark]').map((m) => m.hidden), [false, false, true, true]);
  assert.deepEqual(all('[data-essay-dot]').map((d) => d.classList.contains('is-read')), [true, true, false, false]);
});

test('an essay begun and not finished comes first', () => {
  const { $ } = list({ e1: { p: 1, done: true, t: 1 }, e4: { p: 0.4, done: false, t: 5 } });
  assert.equal($('[data-series-next]').textContent, 'Continue reading essay 4');
  assert.equal($('[data-series-next]').getAttribute('href'), '/insights/e4/');
});
