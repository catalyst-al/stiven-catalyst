// Corrections made after publication (corrections in an issue's or the special edition's data, drawn by
// partials/book-corrections.njk): on the built page, under the lede, dated, in each language; pages without one stay as
// they were.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/magazine/management-review-nr-47.html');
const note = (path) => fs.readFileSync(`_site/${path}`, 'utf8').match(/<div class="book-corrections">[\s\S]*?<\/div>/)?.[0] ?? '';
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

test('Issue 47 says, in each language, that its cover now credits Guest via Mintzberg, and since when', { skip: !hasSite }, () => {
  for (const [lang, start] of [['', 'Correction, 14 October 2026. The cover now credits the 48-second figure to Guest (1956) via Mintzberg (1975).'],
    ['sq/', 'Korrigjim, 14 tetor 2026. Kopertina tani ia atribuon shifrën e 48 sekondave Guest-it (1956) përmes Mintzberg-ut (1975).'],
    ['de/', 'Korrektur, 14. Oktober 2026. Der Titel nennt für die 48 Sekunden jetzt Guest (1956) über Mintzberg (1975).']]) {
    assert.ok(plain(note(`${lang}magazine/management-review-nr-47.html`)).startsWith(start), lang || 'en');
  }
});

test('the special edition says, in each language, that three figures now name their US samples', { skip: !hasSite }, () => {
  for (const [lang, start] of [['', 'Correction, 14 October 2026. Three figures now say they come from US samples'],
    ['sq/', 'Korrigjim, 14 tetor 2026. Tri shifra tani thonë se vijnë nga mostra në SHBA'],
    ['de/', 'Korrektur, 14. Oktober 2026. Drei Zahlen nennen jetzt ihre US-Stichproben']]) {
    assert.ok(plain(note(`${lang}magazine/management-review-2026-09.html`)).startsWith(start), lang || 'en');
  }
});

test('the note sits under the lede, and an issue without a correction has none', { skip: !hasSite }, () => {
  const html = fs.readFileSync('_site/magazine/management-review-nr-47.html', 'utf8');
  assert.ok(html.indexOf('class="lede"') < html.indexOf('class="book-corrections"'));
  assert.ok(html.indexOf('class="book-corrections"') < html.indexOf('class="book-facts"'));
  for (const path of ['magazine/management-review-nr-46.html', 'de/magazine/management-review-nr-01.html', 'sq/magazine/management-review-nr-80.html']) {
    assert.equal(note(path), '', path);
  }
});
