// The audio overview of an issue (src/_data/audio.json, scripts/audio.mjs, partials/audio-player.njk,
// js/audio-player.js): every recording listed is there and small enough to stream, belongs to an issue that exists,
// and the bar plays, skips, changes speed, remembers the place and comes back to it, with the browser's own player
// left in place when the script does not run.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const audio = JSON.parse(fs.readFileSync('src/_data/audio.json', 'utf8'));

// The length of an MP3 from the frame count LAME writes in its first frame (the Info header): frames × 1152 samples.
const mp3Seconds = (file) => {
  const b = fs.readFileSync(file);
  let i = b.toString('latin1', 0, 3) === 'ID3' ? 10 + (((b[6] & 127) << 21) | ((b[7] & 127) << 14) | ((b[8] & 127) << 7) | (b[9] & 127)) : 0;
  while (!(b[i] === 0xff && (b[i + 1] & 0xe0) === 0xe0)) i += 1;
  const at = i + 4 + ((b[i + 3] >> 6) === 3 ? 17 : 32);
  assert.match(b.toString('latin1', at, at + 4), /^(Info|Xing)$/, `${file}: no frame count`);
  return (b.readUInt32BE(at + 8) * 1152) / 44100;
};

test('every recording in audio.json exists, belongs to an issue, and says how it was made', async () => {
  const weekly = (await import('../src/_data/weekly.js')).default;
  const magazine = (await import('../src/_data/magazine.js')).default;
  const slugs = new Set([...weekly.issues, ...(magazine.issues || [])].map((issue) => issue.slug));
  assert.ok(Object.keys(audio).length >= 1);
  for (const [slug, langs] of Object.entries(audio)) {
    assert.ok(slugs.has(slug), `${slug} is not an issue`);
    for (const [lang, track] of Object.entries(langs)) {
      assert.ok(['en', 'sq', 'de'].includes(lang), `${slug} ${lang}`);
      assert.equal(track.src, `/media/audio/${slug}-${lang}.mp3`);
      const file = path.join('src', track.src);
      assert.ok(fs.existsSync(file), `${file} is missing`);
      assert.equal(fs.statSync(file).size, track.bytes, `${file}: run scripts/audio.mjs again`);
      // About 0.5 MB a minute at 64 kbps; a file far above that was not encoded by scripts/audio.mjs.
      assert.ok(track.bytes / (track.seconds / 60) < 600 * 1024, `${file} is larger than 64 kbps`);
      assert.ok(track.title && track.title.trim(), `${slug} ${lang}: title`);
      assert.ok(Number.isInteger(track.seconds) && track.seconds > 0, `${slug} ${lang}: seconds`);
      assert.ok(Math.abs(mp3Seconds(file) - track.seconds) < 1, `${file} lasts ${mp3Seconds(file).toFixed(1)} s, not ${track.seconds}`);
      assert.ok(!('ai' in track) || (typeof track.ai === 'string' && track.ai), `${slug} ${lang}: ai names the tool`);
    }
  }
});

test('the reader of an issue shows the bar only for the language it was recorded in, and loads its script then', () => {
  const page = fs.readFileSync('src/_includes/pages/weekly-issue.njk', 'utf8');
  assert.match(page, /audio\[issue\.slug\]\[lang\]/);
  assert.match(page, /\{%- if track %\}\s*<script src="\{\{ '\/js\/audio-player\.js' \| assetUrl \}\}" defer><\/script>/);
  const partial = fs.readFileSync('src/_includes/partials/audio-player.njk', 'utf8');
  assert.match(partial, /preload="none"/, 'nothing is downloaded before play');
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const [, text] of partial.matchAll(/["']([^"']+)["'] \| t\(lang\)/g)) assert.ok(ui[text], `${lang}: "${text}"`);
  }
});

const markup = `<!doctype html><html lang="en"><body>
<div class="audio-player" data-audio data-key="issue-en" data-seconds="600" data-title="A title" data-album="Review · No. 01"
     data-artwork="/cover.webp" data-play-label="Play" data-pause-label="Pause" data-resume-label="Resume"
     data-time-label="{a} of {b}" data-error-label="Could not load.">
  <audio controls preload="none" src="/a.mp3" data-audio-media></audio>
  <div data-audio-controls hidden>
    <button type="button" data-audio-toggle aria-pressed="false"><span data-audio-label>Play</span></button>
    <button type="button" data-audio-skip="-15">−15</button>
    <input type="range" data-audio-scrub min="0" max="600" step="1" value="0">
    <span data-audio-time><span data-audio-now>0:00</span> / 10:00</span>
    <button type="button" data-audio-skip="15">+15</button>
    <button type="button" data-audio-rate><span data-audio-rate-value>1×</span></button>
  </div>
  <p data-audio-note><a href="/a.mp3" download>Download MP3</a></p>
</div></body></html>`;

// A page with the bar, and an <audio> that plays without a sound card: play() and pause() fire their events, and
// the file's length is known once it "loads".
const open = ({ storage = {} } = {}) => {
  const dom = new JSDOM(markup, { url: 'https://example.test/magazine/issue.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
  const media = w.document.querySelector('[data-audio-media]');
  let paused = true;
  let time = 0;
  let ready = 0;
  Object.defineProperty(media, 'paused', { get: () => paused });
  Object.defineProperty(media, 'readyState', { get: () => ready });
  Object.defineProperty(media, 'duration', { get: () => (ready ? 600 : NaN) });
  Object.defineProperty(media, 'currentTime', { get: () => time, set: (v) => { time = v; } });
  media.play = () => {
    if (!ready) { ready = 1; media.dispatchEvent(new w.Event('loadedmetadata')); }
    paused = false;
    media.dispatchEvent(new w.Event('play'));
    return Promise.resolve();
  };
  media.pause = () => { paused = true; media.dispatchEvent(new w.Event('pause')); };
  const tick = (to) => { time = to; media.dispatchEvent(new w.Event('timeupdate')); };
  w.eval(fs.readFileSync('src/js/audio-player.js', 'utf8'));
  const $ = (s) => w.document.querySelector(s);
  return { w, media, tick, $, store: w.localStorage };
};

test('the bar takes the place of the browser player; play, pause and the label follow the audio', () => {
  const { media, $ } = open();
  assert.equal(media.hasAttribute('controls'), false);
  assert.equal(media.hidden, true);
  assert.equal($('[data-audio-controls]').hidden, false);
  assert.equal($('[data-audio-scrub]').getAttribute('aria-valuetext'), '0:00 of 10:00');
  $('[data-audio-toggle]').click();
  assert.equal(media.paused, false);
  assert.equal($('[data-audio-label]').textContent, 'Pause');
  assert.equal($('[data-audio-toggle]').getAttribute('aria-pressed'), 'true');
  $('[data-audio-toggle]').click();
  assert.equal(media.paused, true);
  assert.equal($('[data-audio-label]').textContent, 'Play', 'at the very start it is still "Play"');
});

test('skipping moves 15 seconds and stops at both ends; the slider seeks when let go', () => {
  const { media, $, tick } = open();
  $('[data-audio-toggle]').click();
  tick(100);
  $('[data-audio-skip="15"]').click();
  assert.equal(media.currentTime, 115);
  $('[data-audio-skip="-15"]').click();
  $('[data-audio-skip="-15"]').click();
  assert.equal(media.currentTime, 85);
  tick(5);
  $('[data-audio-skip="-15"]').click();
  assert.equal(media.currentTime, 0);
  tick(595);
  $('[data-audio-skip="15"]').click();
  assert.ok(media.currentTime < 600);
  const scrub = $('[data-audio-scrub]');
  scrub.value = '300';
  scrub.dispatchEvent(new media.ownerDocument.defaultView.Event('input'));
  assert.equal($('[data-audio-now]').textContent, '5:00', 'the time follows the drag');
  scrub.dispatchEvent(new media.ownerDocument.defaultView.Event('change'));
  assert.equal(media.currentTime, 300);
});

test('a position chosen before anything has loaded is applied when the file arrives', () => {
  const { media, $ } = open();
  $('[data-audio-skip="15"]').click();
  $('[data-audio-skip="15"]').click();
  assert.equal($('[data-audio-now]').textContent, '0:30');
  assert.equal(media.currentTime, 0, 'not loaded yet');
  $('[data-audio-toggle]').click();
  assert.equal(media.currentTime, 30);
});

test('the speed goes round 1×, 1.25×, 1.5×, 2× and is kept for the next recording', () => {
  const { media, $, store } = open();
  const rate = $('[data-audio-rate]');
  const values = [];
  for (let i = 0; i < 4; i++) { rate.click(); values.push($('[data-audio-rate-value]').textContent); }
  assert.deepEqual(values, ['1.25×', '1.5×', '2×', '1×']);
  assert.equal(store.getItem('sc-audio-rate'), null, '1× is the default and is not stored');
  rate.click();
  assert.equal(media.playbackRate, 1.25);
  assert.equal(store.getItem('sc-audio-rate'), '1.25');
  const again = open({ storage: { 'sc-audio-rate': '1.5' } });
  assert.equal(again.$('[data-audio-rate-value]').textContent, '1.5×');
  assert.equal(again.media.defaultPlaybackRate, 1.5);
});

test('the place reached is remembered, offered as "Resume", and forgotten at the end', () => {
  const { $, tick, store, media } = open();
  $('[data-audio-toggle]').click();
  tick(200);
  $('[data-audio-toggle]').click();
  assert.equal(store.getItem('sc-audio-issue-en'), '200');
  assert.equal($('[data-audio-label]').textContent, 'Resume');

  const back = open({ storage: { 'sc-audio-issue-en': '200' } });
  assert.equal(back.$('[data-audio-label]').textContent, 'Resume');
  assert.equal(back.$('[data-audio-now]').textContent, '3:20');
  back.$('[data-audio-toggle]').click();
  assert.equal(back.media.currentTime, 200, 'playback starts where it stopped');

  tick(599);
  media.dispatchEvent(new media.ownerDocument.defaultView.Event('ended'));
  assert.equal(store.getItem('sc-audio-issue-en'), null);
  assert.equal($('[data-audio-now]').textContent, '0:00');
});

test('when the file cannot be loaded, the note says so and the download link stays', () => {
  const { media, $ } = open();
  media.dispatchEvent(new media.ownerDocument.defaultView.Event('error'));
  media.dispatchEvent(new media.ownerDocument.defaultView.Event('error'));
  assert.equal($('[data-audio-note]').querySelectorAll('.audio-player-error').length, 1);
  assert.match($('[data-audio-note]').textContent, /Could not load\. Download MP3/);
});
