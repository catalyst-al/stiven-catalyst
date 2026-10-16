// "Listen" (src/js/listen.js): an essay read aloud by the browser's own voice, sentence by sentence, with the
// block being read marked, pause as a stop that remembers the sentence, and the bar in its place at once, with the
// button on hold until the voices are known and explained when the browser has no voice for the page's language.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const page = (lang) => `<!doctype html><html lang="${lang}"><body>
<section class="article-hero"><h1>The title</h1><p class="article-deck">An intro. Two sentences.</p></section>
<article data-article>
  <div class="essay-listen" data-listen data-lang="${lang}" hidden data-play-label="Listen" data-pause-label="Pause" data-resume-label="Resume"
       data-progress-label="Paragraph {a} of {b}" data-done-label="Read to the end" data-failed-label="Stopped" data-no-voice="No voice here.">
    <button type="button" data-listen-toggle aria-pressed="false"><span data-listen-label>Listen</span></button>
    <button type="button" data-listen-stop hidden>Start again</button>
    <select data-listen-rate><option value="0.9">0.9</option><option value="1" selected>1</option><option value="1.4">1.4</option></select>
    <span data-listen-status></span><div><span data-listen-bar></span></div><p data-listen-note>Read by your browser.</p>
  </div>
  <aside class="essay-moves"><ol><li>A move that is not read.</li></ol></aside>
  <details class="article-toc-fold"><summary>In this essay</summary><ol><li>Section</li></ol></details>
  <p>First paragraph. It has two sentences!</p>
  <h2>A section</h2>
  <blockquote><p>A quoted line.</p></blockquote>
  <ul><li>One item</li><li>Another item, e.g. this one.</li></ul>
  <p>Last paragraph.</p>
  <section class="essay-checklist"><ol><li><label><span>Not read either.</span></label></li></ol></section>
  <p class="visually-hidden">Hidden text.</p>
</article></body></html>`;

// A browser with the given voices and a speechSynthesis that remembers what it was asked to say.
const open = (lang, voices, { url = 'https://example.test/insights/x/', storage } = {}) => {
  const dom = new JSDOM(page(lang), { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const synth = { spoken: [], cancelled: 0, speak(u) { this.spoken.push(u); }, cancel() { this.cancelled++; }, getVoices: () => voices };
  w.speechSynthesis = synth;
  w.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  if (storage) for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
  w.eval(fs.readFileSync('src/js/listen.js', 'utf8'));
  const $ = (s) => w.document.querySelector(s);
  return { w, synth, $, box: $('[data-listen]'), toggle: $('[data-listen-toggle]'), label: $('[data-listen-label]'), status: $('[data-listen-status]') };
};
const DE = [{ lang: 'de-DE', name: 'Anna', localService: true, default: false }, { lang: 'de-DE', name: 'Online', localService: false, default: true }];

test('with a voice for the language the bar shows; the title, the intro and the text are read sentence by sentence, boxes left out', () => {
  const { synth, box, toggle, label, status, $ } = open('de', DE);
  assert.equal(box.hidden, false);
  toggle.click();
  assert.equal(label.textContent, 'Pause');
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  assert.equal($('[data-listen-stop]').hidden, false);
  const texts = [];
  // Each utterance ends and the next one starts, until the end.
  while (synth.spoken.length === texts.length + 1 || (synth.spoken.length === 1 && !texts.length)) {
    const u = synth.spoken[synth.spoken.length - 1];
    texts.push(u.text);
    u.onstart();
    if (texts.length === 1) {
      assert.equal(u.voice.name, 'Anna', 'the local voice before the online one');
      assert.equal(u.lang, 'de-DE');
      assert.equal(u.rate, 1);
      assert.ok($('h1').classList.contains('is-speaking'), 'the title is marked while it is read');
      assert.equal(status.textContent, 'Paragraph 1 of 8');
    }
    u.onend();
  }
  assert.deepEqual(texts, ['The title', 'An intro.', 'Two sentences.', 'First paragraph.', 'It has two sentences!', 'A section', 'A quoted line.', 'One item', 'Another item, e.g. this one.', 'Last paragraph.']);
  assert.equal(label.textContent, 'Listen', 'back to the start once the text is read');
  assert.equal(status.textContent, 'Read to the end');
  assert.equal($('.is-speaking'), null);
  assert.equal($('[data-listen-bar]').style.width, '100%');
});

test('pause stops the voice and remembers the sentence; resume starts again from it; start again goes back to the title', () => {
  const { synth, toggle, label, $ } = open('de', DE);
  toggle.click();
  synth.spoken[0].onstart(); synth.spoken[0].onend();
  synth.spoken[1].onstart(); synth.spoken[1].onend();
  assert.equal(synth.spoken[2].text, 'Two sentences.');
  synth.spoken[2].onstart();
  toggle.click();
  assert.equal(synth.cancelled, 1);
  assert.equal(label.textContent, 'Resume');
  synth.spoken[2].onerror({ error: 'interrupted' }); // what the browser reports after a cancel
  assert.equal(label.textContent, 'Resume', 'our own cancel is not a failure');
  toggle.click();
  assert.equal(synth.spoken[3].text, 'Two sentences.', 'resumes with the sentence that was cut');
  $('[data-listen-stop]').click();
  assert.equal(synth.cancelled, 2);
  assert.equal(synth.spoken[4].text, 'The title', 'starts again from the title, still playing');
  assert.equal(label.textContent, 'Pause');
});

test('the speed is remembered in this browser and applies from the next sentence', () => {
  const { synth, toggle, w, $ } = open('de', DE, { storage: { 'sc-listen-rate': '1.4' } });
  assert.equal($('[data-listen-rate]').value, '1.4');
  toggle.click();
  assert.equal(synth.spoken[0].rate, 1.4);
  const select = $('[data-listen-rate]');
  select.value = '0.9';
  select.dispatchEvent(new w.Event('change'));
  assert.equal(w.localStorage.getItem('sc-listen-rate'), '0.9');
  assert.equal(synth.cancelled, 1);
  assert.equal(synth.spoken[1].rate, 0.9);
  assert.equal(synth.spoken[1].text, 'The title', 'the sentence being read starts again at the new speed');
});

test('without a voice for the language the bar says so and the button is off; without speechSynthesis the bar stays hidden', () => {
  const none = open('sq', DE);
  assert.equal(none.box.hidden, false);
  assert.equal(none.toggle.disabled, true);
  assert.equal(none.$('[data-listen-note]').textContent, 'No voice here.');
  none.toggle.click();
  assert.equal(none.synth.spoken.length, 0);

  const dom = new JSDOM(page('en'), { url: 'https://example.test/insights/x/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/listen.js', 'utf8'));
  assert.equal(dom.window.document.querySelector('[data-listen]').hidden, true);
});

test('the voices may arrive later: the bar is in its place at once and the button waits for them', () => {
  const dom = new JSDOM(page('en'), { url: 'https://example.test/insights/x/', runScripts: 'outside-only' });
  const w = dom.window;
  let voices = [];
  const listeners = {};
  w.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => voices, onvoiceschanged: null, addEventListener: (name, fn) => { listeners[name] = fn; } };
  w.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
  w.eval(fs.readFileSync('src/js/listen.js', 'utf8'));
  const box = w.document.querySelector('[data-listen]');
  const toggle = w.document.querySelector('[data-listen-toggle]');
  assert.equal(box.hidden, false, 'the bar takes its room before the voices are known, so the text below never moves');
  assert.equal(toggle.disabled, true);
  assert.equal(toggle.getAttribute('aria-busy'), 'true');
  assert.equal(w.document.querySelector('[data-listen-note]').textContent, 'Read by your browser.', 'no verdict yet');
  voices = [{ lang: 'en-GB', name: 'Daniel', localService: true }];
  listeners.voiceschanged();
  assert.equal(box.hidden, false);
  assert.equal(toggle.disabled, false);
  assert.equal(toggle.hasAttribute('aria-busy'), false);
});

test('the article layout carries the bar before the moves box, loads the script, and its texts are translated', () => {
  const layout = fs.readFileSync('src/_includes/layouts/article.njk', 'utf8');
  assert.ok(layout.indexOf('data-listen') < layout.indexOf('class="essay-moves"'));
  assert.match(layout, /\/js\/listen\.js/);
  const found = new Set();
  const bar = layout.slice(layout.indexOf('<div class="essay-listen"'), layout.indexOf('</div>', layout.indexOf('data-listen-note')));
  for (const match of bar.matchAll(/'((?:[^'\\]|\\.)*)' \| t\(lang\)/g)) found.add(match[1]);
  for (const match of bar.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  assert.ok(found.size >= 8, `found ${found.size} texts`);
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const text of found) assert.ok(ui[text], `${lang}: ${text}`);
  }
  for (const lang of ['', 'de/', 'sq/']) {
    const file = `_site/${lang}insights/gemba/index.html`;
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<div class="essay-listen" data-listen data-lang="(en|de|sq)" hidden/, file);
    assert.match(html, /js\/listen\.js/, file);
  }
  assert.match(fs.readFileSync('src/datenschutz.njk', 'utf8'), /reading speed you chose/);
});
