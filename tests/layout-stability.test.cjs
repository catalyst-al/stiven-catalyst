// What keeps a page still while it loads (the audit of 16 October 2026): the fallback of the display font sits where
// Archivo Black sits, the drawing behind a tool page appears only once it is placed, the CV check badge keeps its room
// while empty, and the home page's list of field notes is one cached file instead of part of every home page.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const css = fs.readFileSync('src/styles.css', 'utf8');
const hasSite = fs.existsSync('_site/index.html');
const built = (file) => fs.readFileSync(`_site/${file}`, 'utf8');

test('the fallback of Archivo Black is written for a browser that scales its overrides by size-adjust', () => {
  const face = css.slice(css.indexOf('font-family: "Archivo Black Fallback"'), css.indexOf('}', css.indexOf('font-family: "Archivo Black Fallback"')));
  const number = (name) => Number(face.match(new RegExp(`${name}: ([0-9.]+)%`))[1]);
  const adjust = number('size-adjust') / 100;
  // Archivo Black: an ascent of 88% and a descent of 21% of the font size, no line gap (measured in Chromium).
  assert.ok(Math.abs(number('ascent-override') * adjust - 88) < 0.3, `ascent ${number('ascent-override')}% × ${adjust}`);
  assert.ok(Math.abs(number('descent-override') * adjust - 21) < 0.3, `descent ${number('descent-override')}% × ${adjust}`);
  assert.equal(number('line-gap-override'), 0);
});

test('the drawing behind a tool page is unseen until family-sky.js has placed it', () => {
  assert.match(css, /\.js \.family-sky:not\(\.is-ready\) \{ opacity: 0; \}/);
  assert.match(css, /\.js \.family-sky \{ transition: opacity [^}]+\}/);
  const script = fs.readFileSync('src/js/family-sky.js', 'utf8');
  assert.match(script, /const ready = \(\) => sky\?\.classList\.add\("is-ready"\);/);
  assert.match(script, /if \(!sky \|\| !main \|\| !hero\) \{ ready\(\); return; \}/, 'shown at once when there is nothing to place');
  assert.match(script, /\n  place\(\);\n  ready\(\);\n/, 'shown once placed');
});

test('the CV check badge keeps the room of one line while the script has not filled it', { skip: !hasSite }, () => {
  assert.match(css, /\.cv-badge:empty \{ visibility: hidden; \}/);
  assert.match(css, /\.cv-badge:empty::before \{ content: "\\200B"; \}/);
  for (const file of ['tools/cv-builder/index.html', 'de/tools/ats-cv/index.html', 'sq/tools/cover-letter/index.html']) {
    assert.match(built(file), /<a class="cv-badge" href="#cv-check-title" data-check-badge><\/a>/, file);
  }
});

test('every home page loads its field notes from one file, before the script that reads them', { skip: !hasSite }, () => {
  for (const [file, lang, dir] of [['index.html', 'en', 'src/content/notes'], ['de/index.html', 'de', 'src/content/de/notes'], ['sq/index.html', 'sq', 'src/content/sq/notes']]) {
    const html = built(file);
    assert.doesNotMatch(html, /data-notes=/, `${file}: the list is not in the page`);
    const notesAt = html.search(new RegExp(`<script src="/js/notes-${lang}\\.js\\?v=[0-9a-f]{10}" defer></script>`));
    const scriptAt = html.indexOf('/js/note-of-the-day.js');
    assert.ok(notesAt > 0 && scriptAt > notesAt, `${file}: notes file, then the script`);
    const source = built(`js/notes-${lang}.js`);
    const dom = new JSDOM('<body></body>', { runScripts: 'outside-only' });
    dom.window.eval(source);
    const notes = dom.window.DayNotes;
    const count = fs.readdirSync(dir).filter((name) => name.endsWith('.md')).length;
    assert.equal(notes.length, count, `${lang}: every note`);
    for (const note of notes) {
      assert.match(note.q, /^[“„].+[”“]$/, `${lang}: ${note.id} in quotes`);
      assert.match(note.id, /^note-/);
      assert.match(note.iso, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(note.d);
    }
    // The address changes with the notes, so a browser never keeps an old list.
    const stamp = html.match(new RegExp(`/js/notes-${lang}\\.js\\?v=([0-9a-f]{10})`))[1];
    assert.ok(stamp, `${file}: stamp`);
  }
});

test('the sitemap carries "How this is made" in the three languages', { skip: !hasSite }, () => {
  const sitemap = built('sitemap.xml');
  for (const url of ['https://stivencatalyst.com/how-this-is-made.html', 'https://stivencatalyst.com/de/how-this-is-made.html', 'https://stivencatalyst.com/sq/how-this-is-made.html']) {
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), url);
  }
});
