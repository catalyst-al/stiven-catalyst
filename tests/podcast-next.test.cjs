// The podcast episodes one after another (pages/podcast.njk, js/podcast.js): each episode links to the next one, and
// when one ends the next starts by itself, but not after the last.
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
