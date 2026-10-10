// The field notes as images to post (scripts/note-cards.mjs) and the "Start here" page: every note has its image
// in every language, the Field Notes page and the note of the day offer it, and the start page carries its three
// steps in English, German and Albanian.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DIRS = { en: 'src/content/notes', de: 'src/content/de/notes', sq: 'src/content/sq/notes' };
const slugs = (dir) => fs.readdirSync(dir).filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));

test('every field note has its image in every language (run node scripts/note-cards.mjs after adding one)', () => {
  for (const [lang, dir] of Object.entries(DIRS)) {
    for (const slug of slugs(dir)) {
      const file = path.join('src/media/notes', lang, `${slug}.jpg`);
      assert.ok(fs.existsSync(file), `${lang}: ${slug}`);
      assert.ok(fs.statSync(file).size > 20000, `${lang}: ${slug} is not empty`);
    }
  }
});

test('the card script reads the quote of every note', async () => {
  const { notesOf } = await import('../scripts/note-cards.mjs');
  for (const dir of Object.values(DIRS)) {
    const notes = notesOf(dir);
    assert.equal(notes.length, slugs(dir).length, dir);
    for (const note of notes) assert.ok(note.quote.length > 20 && !note.quote.startsWith('"'), `${dir}: ${note.slug}`);
  }
});

const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const hasSite = fs.existsSync('_site/start.html');

test('the Field Notes page and the note of the day offer each note as an image', { skip: !hasSite }, () => {
  for (const [lang, dir] of Object.entries(DIRS)) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const page = built(`${prefix}field-notes.html`);
    for (const slug of slugs(dir)) assert.ok(page.includes(`href="/media/notes/${lang}/${slug}.jpg?v=`), `${lang}: ${slug}`);
    const home = built(`${prefix}index.html`);
    assert.match(home, /data-note-image/, `${lang}: note of the day`);
    assert.match(home, /&quot;img&quot;:&quot;\/media\/notes\//, `${lang}: image in the notes data`);
  }
});

test('notes of the same day keep their numeric order past 99', { skip: !hasSite }, () => {
  // "100-…" sorts before "99-…" as text; the page compares the numbers.
  const ids = [...built('field-notes.html').matchAll(/id="note-(\d+)-/g)].map((match) => Number(match[1]));
  const at = (n) => ids.indexOf(n);
  assert.ok(at(99) >= 0 && at(100) >= 0, 'notes 99 and 100 are on the page');
  assert.ok(at(99) < at(100) && at(91) < at(99), 'notes 91, 99 and 100 in order');
});

test('"Start here" has its three steps and the newsletter in every language, and the footer links to it', { skip: !hasSite }, () => {
  for (const [file, home] of [['start.html', 'index.html'], ['de/start.html', 'de/index.html'], ['sq/start.html', 'sq/index.html']]) {
    const page = built(file);
    assert.equal((page.match(/class="article-card"/g) || []).length, 3, `${file}: three essays`);
    assert.match(page, /class="article-card start-tool"/, `${file}: the tool`);
    assert.match(page, /class="note-card"/, `${file}: the field note`);
    assert.match(page, /data-newsletter /, `${file}: the newsletter`);
    assert.match(page, /hreflang="de"/, `${file}: language versions`);
    assert.ok(built(home).includes(`href="/${file}"`), `${home}: footer link`);
  }
});
