// "Listen" on the built essay pages (audit P7-01 to P7-03): what the voice reads of a real page, in three languages,
// and what the bar says about the voice. The page is _site's HTML as a reader gets it; the script is src/js/listen.js;
// speechSynthesis is a stand-in that records every utterance and lets each one end at once.
//   - The voice reads the essay and its case box (headings, paragraphs, items, quotes, and the case's terms and
//     descriptions), and nothing of the form under it, the privacy line, the "Join in" box, the share row or any button.
//   - A voice on the device is taken before an online one; the note says which kind reads, and for an online voice
//     that the browser sends the text to its maker.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const built = (lang, slug) => {
  const file = path.join(ROOT, '_site', lang === 'en' ? '' : lang, slug, 'index.html');
  if (!fs.existsSync(file)) throw new Error(`${file} is missing: run npm run build first`);
  return fs.readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
};
const LISTEN = fs.readFileSync(path.join(ROOT, 'src', 'js', 'listen.js'), 'utf8');

const open = (lang, slug, voices) => {
  const dom = new JSDOM(built(lang, slug), { url: `https://example.test/${slug}/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const synth = { spoken: [], speak(u) { this.spoken.push(u); }, cancel() {}, getVoices: () => voices };
  w.speechSynthesis = synth;
  w.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.eval(LISTEN);
  const $ = (s) => w.document.querySelector(s);
  return { w, synth, $, note: () => $('[data-listen-note]').textContent, toggle: $('[data-listen-toggle]') };
};
// Everything the voice says, start to end; page.blocks: the element marked as read for each sentence.
const readAll = (page) => {
  page.toggle.click();
  page.blocks = [];
  for (let i = 0; i < 5000 && page.synth.spoken[i]; i++) {
    page.synth.spoken[i].onstart();
    page.blocks.push(page.$('.is-speaking'));
    page.synth.spoken[i].onend();
  }
  return page.synth.spoken.map((u) => u.text);
};
const flat = (s) => s.replace(/\s+/g, ' ').trim();
const LOCAL = (lang) => ({ lang: { en: 'en-GB', de: 'de-DE', sq: 'sq-AL' }[lang], name: 'Device voice', localService: true, default: false });
const ONLINE = (lang) => ({ lang: { en: 'en-US', de: 'de-DE', sq: 'sq-AL' }[lang], name: 'Cloud voice (Natural)', localService: false, default: true });
const ESSAY = 'insights/pareto-and-5-why-in-practice';

for (const lang of ['en', 'de', 'sq']) {
  test(`${lang}: the essay and its whole case box are read, and nothing of the form, the Join box or the share row`, () => {
    const page = open(lang, ESSAY, [LOCAL(lang)]);
    const { $ } = page;
    const said = readAll(page);
    const all = said.join(' ');
    // The case box: its heading, its date, and every term and description, "What cannot be confirmed" included.
    const kase = $('.essay-case');
    assert.ok(kase, 'the essay has a case box');
    const parts = [...kase.querySelectorAll('dt, dd')].map((e) => flat(e.textContent));
    assert.equal(parts.length, 10, 'five terms and their descriptions');
    for (const part of parts) assert.ok(all.includes(part.slice(0, 60)), `read: ${part.slice(0, 60)}`);
    assert.ok(all.includes(flat($('.essay-case .is-limit dt').textContent)), 'the limits of the evidence are read');
    // It ends with the case box, the last thing of the text.
    assert.equal(said[said.length - 1], flat(kase.querySelector('dl > div:last-child dd').textContent).split(/(?<=[.!?…])\s+/).pop());
    // Nothing of what follows the text.
    for (const selector of ['.essay-feedback', '.essay-join', '.share-row', 'form']) {
      const box = $(selector);
      assert.ok(box, `${selector} is on the page`);
      page.blocks.forEach((block, i) => assert.ok(!box.contains(block), `not read from ${selector}: ${said[i]}`));
    }
    assert.ok(!said.includes(flat($('#essay-join-title').textContent)), 'not "Join in"');
    // No text of a button or a form control.
    const controls = [...$('[data-article]').querySelectorAll('button, label, select, textarea, input')].map((e) => flat(e.textContent)).filter(Boolean);
    for (const c of controls) assert.ok(!said.includes(c), `no control read: ${c}`);
  });
}

test('a reflection without a case box ends on its last paragraph, in all three languages', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const page = open(lang, 'reflections/the-tyranny-of-the-small-man', [LOCAL(lang)]);
    const said = readAll(page);
    const article = page.$('[data-article]');
    // The last paragraph of the text: the last <p> before the feedback box that is the text's own.
    const body = [...article.children].filter((e) => e.tagName === 'P' && !e.className);
    const last = flat(body[body.length - 1].textContent);
    assert.ok(last.endsWith(said[said.length - 1]), `${lang}: ends on "${said[said.length - 1]}"`);
  }
});

test('a voice on the device is taken before an online one, and the note says the text stays on the device', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const page = open(lang, ESSAY, [ONLINE(lang), LOCAL(lang)]);
    const said = readAll(page);
    assert.ok(said.length > 10);
    assert.equal(page.synth.spoken[0].voice.name, 'Device voice', `${lang}: the local voice`);
    const box = page.$('[data-listen]');
    assert.equal(page.note(), box.dataset.localNote, `${lang}: the note for a voice on the device`);
    assert.ok(box.dataset.localNote && box.dataset.localNote.length > 20, `${lang}: the page carries the note`);
  }
});

test('with only an online voice, the note names it and says the browser sends the text to its maker', () => {
  const expected = {
    en: /Cloud voice \(Natural\).*online voice.*sends the text/,
    de: /Cloud voice \(Natural\).*Online-Stimme.*sendet .*Text/,
    sq: /Cloud voice \(Natural\).*online.*dërgon tekstin/,
  };
  for (const lang of ['en', 'de', 'sq']) {
    const page = open(lang, ESSAY, [ONLINE(lang)]);
    readAll(page);
    assert.equal(page.synth.spoken[0].voice.name, 'Cloud voice (Natural)');
    assert.match(page.note(), expected[lang], `${lang}: ${page.note()}`);
    assert.doesNotMatch(page.note(), /\{a\}/);
  }
});

test('without any voice for the language, the note says so and does not send the reader to a browser with online voices', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const page = open(lang, ESSAY, [{ lang: 'fr-FR', name: 'Other', localService: true }]);
    assert.equal(page.toggle.disabled, true);
    assert.equal(page.note(), page.$('[data-listen]').dataset.noVoice);
    assert.doesNotMatch(page.note(), /Edge/);
    assert.match(page.note(), { en: /online voice/, de: /Online-Stimme/, sq: /online/ }[lang]);
  }
});

// Pause, speed and "Start again" (audit P7-05) with the two ways a browser reports a cancelled utterance: Chrome's
// "interrupted" error, and an "end" that arrives late (some engines deliver it well after the cancel). Neither may
// move the reading on: the sentence that was cut is read again, once, and "Start again" starts at the title.
const engine = (mode) => {
  const synth = { spoken: [], active: [], speak(u) { this.spoken.push(u); this.active.push(u); }, getVoices: () => [LOCAL('en')] };
  synth.cancel = () => {
    for (const u of synth.active.splice(0)) {
      if (mode === 'interrupted') setTimeout(() => u.onerror?.({ error: 'interrupted' }), 0);
      else setTimeout(() => u.onend?.(), 25);
    }
  };
  // The voice finishes the utterance it is reading.
  synth.finish = () => { const u = synth.active.shift(); u.onstart?.(); u.onend?.(); };
  return synth;
};
const openWith = (synth) => {
  const dom = new JSDOM(built('en', ESSAY), { url: `https://example.test/${ESSAY}/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.speechSynthesis = synth;
  w.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.eval(LISTEN);
  return { w, $: (s) => w.document.querySelector(s) };
};
const settle = () => new Promise((resolve) => setTimeout(resolve, 60));

for (const mode of ['interrupted', 'late-end']) {
  test(`${mode}: a speed change and a pause keep the sentence being read; "Start again" starts at the title`, async () => {
    const synth = engine(mode);
    const { w, $ } = openWith(synth);
    $('[data-listen-toggle]').click();
    synth.active[0].onstart();
    for (let i = 0; i < 3; i++) synth.finish();
    const reading = synth.active[0];
    reading.onstart();
    const sentence = reading.text;
    // Speed: the same sentence again, at the new speed, and nothing else.
    const select = $('[data-listen-rate]');
    select.value = '1.4';
    select.dispatchEvent(new w.Event('change'));
    await settle();
    assert.deepEqual(synth.active.map((u) => u.text), [sentence], 'one utterance waiting: the sentence that was cut');
    assert.equal(synth.active[0].rate, 1.4);
    const next = synth.spoken.length;
    synth.finish();
    assert.equal(synth.spoken.length, next + 1);
    // Pause and resume: the sentence that was cut.
    const cut = synth.active[0];
    cut.onstart();
    $('[data-listen-toggle]').click();
    await settle();
    assert.equal(synth.active.length, 0, 'nothing is read while paused');
    $('[data-listen-toggle]').click();
    await settle();
    assert.deepEqual(synth.active.map((u) => u.text), [cut.text], 'resumes with the sentence that was cut');
    // Start again while reading: the title, once.
    synth.active[0].onstart();
    $('[data-listen-stop]').click();
    await settle();
    assert.deepEqual(synth.active.map((u) => u.text), [flat($('.article-hero h1').textContent)]);
  });
}
