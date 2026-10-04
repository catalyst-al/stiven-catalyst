// The field note of the day on the home page (src/js/note-of-the-day.js) and the notes it draws from.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

test('every field note exists in English, German and Albanian, each with a quote and a date', () => {
  const list = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  const en = list('src/content/notes');
  assert.ok(en.length >= 20, `${en.length} notes`);
  for (const dir of ['src/content/de/notes', 'src/content/sq/notes']) assert.deepEqual(list(dir), en, dir);
  for (const dir of ['src/content/notes', 'src/content/de/notes', 'src/content/sq/notes']) {
    for (const file of en) {
      const text = fs.readFileSync(`${dir}/${file}`, 'utf8');
      assert.match(text, /^---\nquote: ".+"\ndate: \d{4}-\d{2}-\d{2}\n---\n$/, `${dir}/${file}`);
    }
  }
});

// The home page as the templates render it, on a given day.
const home = (date) => {
  const notes = ['A', 'B', 'C', 'D'].map((q, i) => ({ q: `Note ${q}`, id: `note-0${i + 1}-x`, d: `${i + 1} October 2026`, iso: `2026-10-0${i + 1}` }));
  const dom = new JSDOM(`<body><section data-note-of-day data-notes='${JSON.stringify(notes)}' data-page="https://example.test/field-notes.html">
    <p data-note-quote>“Note A”</p><a data-note-link href="/field-notes.html#note-01-x">All</a>
    <button data-note-copy data-copy-text="x">Copy</button><button data-note-share data-share-url="x" data-share-text="x">Share</button></section>
    <article data-note-slot="1"><blockquote>“Note B”</blockquote><time>1 October 2026</time></article>
    <article data-note-slot="2"><blockquote>“Note C”</blockquote><time>1 October 2026</time></article></body>`, { url: 'https://example.test/', runScripts: 'outside-only' });
  const RealDate = dom.window.Date;
  dom.window.Date = class extends RealDate { constructor(...a) { super(...(a.length ? a : [date])); } static UTC(...a) { return RealDate.UTC(...a); } };
  dom.window.eval(fs.readFileSync('src/js/note-of-the-day.js', 'utf8'));
  const $ = (s) => dom.window.document.querySelector(s);
  return { $, all: (s) => [...dom.window.document.querySelectorAll(s)].map((n) => n.textContent) };
};

test('the note follows the calendar day and the cards below show the two after it', () => {
  const dayOf = (iso) => Math.floor(Date.UTC(...iso.split('-').map((n, i) => Number(n) - (i === 1 ? 1 : 0))) / 864e5);
  const index = dayOf('2026-10-05') % 4;
  const { $, all } = home('2026-10-05T09:00:00');
  const letters = ['A', 'B', 'C', 'D'];
  assert.equal($('[data-note-quote]').textContent, `“Note ${letters[index]}”`);
  assert.deepEqual(all('[data-note-slot] blockquote'), [`“Note ${letters[(index + 1) % 4]}”`, `“Note ${letters[(index + 2) % 4]}”`]);
  assert.equal($('[data-note-link]').getAttribute('href'), `/field-notes.html#note-0${index + 1}-x`);
  assert.equal($('[data-note-copy]').dataset.copyText, `“Note ${letters[index]}” (Stiven Janaqi, Stiven Catalyst) https://example.test/field-notes.html#note-0${index + 1}-x`);
  assert.equal($('[data-note-share]').dataset.shareUrl, `https://example.test/field-notes.html#note-0${index + 1}-x`);
});

test('the same day in the morning and late at night shows the same note; the next day another', () => {
  const morning = home('2026-10-05T00:05:00').$('[data-note-quote]').textContent;
  const night = home('2026-10-05T23:55:00').$('[data-note-quote]').textContent;
  const next = home('2026-10-06T08:00:00').$('[data-note-quote]').textContent;
  assert.equal(morning, night);
  assert.notEqual(morning, next);
});
