// What round two of the check of 16 October 2026 made lighter or steadier: the Field Notes cards carry each quote
// once, the window titles stay within what a search result shows, the search index is fetched fresh after a change,
// and the covers of the issues carry their size.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/index.html');
const built = (file) => fs.readFileSync(`_site/${file}`, 'utf8');
const pages = (dir, out = []) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) pages(file, out); else if (entry.name.endsWith('.html')) out.push(file); } return out; };
const decode = (text) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

test('a field note card carries its quote once: no copy text, share text or search text repeats it', { skip: !hasSite }, () => {
  for (const file of ['field-notes.html', 'de/field-notes.html', 'sq/field-notes.html']) {
    const html = built(file);
    const cards = html.match(/<article class="note-card"[\s\S]*?<\/article>/g) || [];
    assert.ok(cards.length > 100, `${file}: ${cards.length} cards`);
    for (const card of cards) {
      assert.doesNotMatch(card, /data-search=/, file);
      assert.doesNotMatch(card, /data-copy-text="/, file);
      assert.doesNotMatch(card, /data-share-text="/, file);
      assert.match(card, /<button type="button" data-copied-label="[^"]+" data-copy-text>/, file);
      assert.match(card, /<button type="button" data-share-url="https:\/\/stivencatalyst\.com\/(de\/|sq\/)?field-notes\.html#note-[^"]+" data-share-text>/, file);
    }
    // About 1.2 kB a card: room for some 280 notes.
    assert.ok(html.length < 360000, `${file}: ${html.length} bytes`);
  }
});

test('the copy and share texts of a card come from its quote and its address', async () => {
  const dom = new JSDOM(`<body><article class="note-card" id="note-7-x"><blockquote data-fit>“A short <k-p class="kp1">no</k-p>te.”</blockquote>
    <div class="note-actions" data-note-actions hidden><button type="button" data-copied-label="Copied" data-copy-text>Copy</button>
    <button type="button" data-share-url="https://example.test/field-notes.html#note-7-x" data-share-text>Share</button></div></article>
    <div data-note-actions hidden><button type="button" data-copied-label="Copied" data-copy-text="Given text">Copy</button></div></body>`, { url: 'https://example.test/field-notes.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const copied = [];
  const shared = [];
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async (text) => { copied.push(text); } } });
  Object.defineProperty(w.navigator, 'share', { value: async (data) => { shared.push(data); } });
  w.eval(fs.readFileSync('src/js/share.js', 'utf8'));
  const [copy, given] = w.document.querySelectorAll('[data-copy-text]');
  copy.click();
  given.click();
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(copied, ['“A short note.” (Stiven Janaqi, Stiven Catalyst) https://example.test/field-notes.html#note-7-x', 'Given text']);
  assert.equal(copy.textContent, 'Copied');
  w.document.querySelector('[data-share-url]').click();
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(JSON.parse(JSON.stringify(shared)), [{ title: w.document.title, text: '“A short note.”', url: 'https://example.test/field-notes.html#note-7-x' }]);
});

test('the filter searches a field note in its quote and its topic when the card carries no search text', () => {
  const dom = new JSDOM(`<body><section data-filter-list><div data-filter-controls data-count-label="{a} of {b}"><input data-filter-search><span data-filter-count></span></div>
    <article class="note-card" data-filter-item data-topic="Handover" data-month="2026-10"><blockquote>“The handover is a contract.”</blockquote><button>Copy</button></article>
    <article class="note-card" data-filter-item data-topic="" data-month="2026-10"><blockquote>“A KPI is a report with an age.”</blockquote><button>Copy</button></article>
    <a data-filter-item data-topic="x" data-month="2026-10" data-search="given words only">Row</a>
    <p data-filter-empty hidden>Nothing</p></section></body>`, { url: 'https://example.test/field-notes.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(fs.readFileSync('src/js/filter.js', 'utf8'));
  const search = w.document.querySelector('[data-filter-search]');
  const shown = () => [...w.document.querySelectorAll('[data-filter-item]')].map((item) => !item.hidden);
  search.value = 'contract';
  search.dispatchEvent(new w.Event('input'));
  assert.deepEqual(shown(), [true, false, false], 'found in the quote');
  search.value = 'handover';
  search.dispatchEvent(new w.Event('input'));
  assert.deepEqual(shown(), [true, false, false], 'found in the topic');
  search.value = 'copy';
  search.dispatchEvent(new w.Event('input'));
  assert.deepEqual(shown(), [false, false, false], 'the buttons are not searched');
  search.value = 'given';
  search.dispatchEvent(new w.Event('input'));
  assert.deepEqual(shown(), [false, false, true], 'an item with its own search text keeps it');
});

test('a window title carries the site name only while the whole stays within 60 characters', { skip: !hasSite }, () => {
  const suffix = ' | Stiven Catalyst';
  let withName = 0;
  for (const file of pages('_site')) {
    const title = decode(fs.readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/)[1]);
    if (title.endsWith(suffix)) { withName += 1; assert.ok(title.length <= 60, `${file}: ${title.length}: ${title}`); }
    else if (title !== 'Stiven Catalyst | Leadership, Operations & Ideas' && !/^Stiven Catalyst \| /.test(title)) assert.ok(title.length + suffix.length > 60, `${file}: the name would have fit: ${title}`);
  }
  assert.ok(withName > 150, `${withName} titles with the name`);
  assert.match(built('index.html'), /<title>Stiven Catalyst \| Leadership, Operations &amp; Ideas<\/title>/);
});

test('the search index is fetched with a stamp of its content in the address', { skip: !hasSite }, () => {
  for (const [file, index] of [['search.html', '/search-index.json'], ['de/search.html', '/de/search-index.json'], ['sq/search.html', '/sq/search-index.json']]) {
    assert.match(built(file), new RegExp(`data-index="${index.replace(/\//g, '\\/')}\\?v=[0-9a-f]{10}"`), file);
  }
  assert.match(fs.readFileSync('src/js/search.js', 'utf8'), /fetch\(root\.dataset\.index\)/);
});

test('the cover picture of an issue carries its size', { skip: !hasSite }, () => {
  for (const file of ['magazine/management-review-nr-05.html', 'de/magazine/management-review-2026-09.html', 'sq/magazine/operational-treatise-vol-02.html', 'magazine/nga-terreni-02.html']) {
    const html = built(file);
    const covers = html.match(/<img src="\/media\/magazine\/[^"]*\/art\/[^"]+" alt=""[^>]*>/g) || [];
    assert.ok(covers.length >= 1, `${file}: ${covers.length} cover pictures`);
    for (const img of covers) assert.match(img, / width="\d+" height="\d+"/, `${file}: ${img}`);
  }
});
