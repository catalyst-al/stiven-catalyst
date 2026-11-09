// The printed publications for readers who use a screen reader or navigate a PDF (audit P5-08, P6-04): every PDF of
// the Management Review, the treatise, From the Floor, the special edition and the current Tools Guide is tagged,
// says its language and has bookmarks; the sources pages of the magazines carry their addresses as links; the
// book's translations say their language and have the original's bookmarks. The earlier editions of the guide stay as
// they were printed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pdfsIn = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  if (entry.isDirectory()) return entry.name === 'editions' ? [] : pdfsIn(full);
  return entry.name.endsWith('.pdf') ? [full] : [];
}) : []);
const has = (bytes, key) => bytes.includes(Buffer.from(key));

test('every publication PDF is tagged, names its language and has bookmarks', () => {
  const files = [...pdfsIn('src/media/magazine'), ...pdfsIn('src/media/guides/tools-guide')];
  assert.ok(files.length > 300, `${files.length} PDFs`);
  const missing = [];
  for (const file of files) {
    const bytes = fs.readFileSync(file);
    for (const key of ['/StructTreeRoot', '/MarkInfo', '/Lang', '/Outlines', '/Author']) if (!has(bytes, key)) missing.push(`${file}: ${key}`);
  }
  assert.deepEqual(missing, []);
});

test('the sources of an issue or a volume are links in its PDF', () => {
  const files = pdfsIn('src/media/magazine').filter((file) => /management-review-nr-|operational-treatise-vol-/.test(file));
  const without = files.filter((file) => !has(fs.readFileSync(file), '/URI'));
  assert.deepEqual(without, []);
});

test('the book\'s translations name their language and carry the bookmarks of the original', () => {
  for (const [file, lang] of [['src/media/books/mall-per-durresin/en/longing-for-durres.pdf', 'en-GB'], ['src/media/books/mall-per-durresin/de/sehnsucht-nach-durres.pdf', 'de-DE']]) {
    const bytes = fs.readFileSync(file);
    assert.ok(has(bytes, `/Lang(${lang})`) || has(bytes, `/Lang (${lang})`), `${file}: /Lang ${lang}`);
    assert.ok(has(bytes, '/Outlines'), `${file}: bookmarks`);
  }
});
