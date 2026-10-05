// The link previews of the essays, the reflections and the writing pages (scripts/page-cards.mjs): every one has
// its card in every language, and a shared link shows that card instead of the homepage one.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('every essay, reflection and writing page has its preview in every language (run node scripts/page-cards.mjs after adding one)', async () => {
  const { cards, piecesOf, PAGES } = await import('../scripts/page-cards.mjs');
  const list = cards();
  for (const lang of ['en', 'de', 'sq']) {
    const expected = piecesOf(lang, 'insights').length + piecesOf(lang, 'reflections').length + Object.keys(PAGES).length;
    assert.equal(list.filter((card) => card.file.startsWith(`src/media/social/${lang}/`)).length, expected, lang);
  }
  for (const card of list) {
    assert.ok(card.title && card.kicker, `${card.file}: title and label`);
    assert.ok(fs.existsSync(card.file) && fs.statSync(card.file).size > 20000, `${card.file} exists`);
  }
});

const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const ogImage = (html) => (html.match(/<meta property="og:image" content="https:\/\/stivencatalyst\.com([^"?]+)/) || [])[1];

test('an essay, a reflection and the writing pages share their own card', { skip: !fs.existsSync('_site/start.html') }, () => {
  const cases = [
    ['insights/kpis-do-not-improve-in-excel/index.html', '/media/social/en/insight-kpis-do-not-improve-in-excel.jpg'],
    ['de/insights/the-operations-manager-i-want-to-be/index.html', '/media/social/de/insight-the-operations-manager-i-want-to-be.jpg'],
    ['sq/reflections/the-great-albanian-paradox/index.html', '/media/social/sq/reflection-the-great-albanian-paradox.jpg'],
    ['start.html', '/media/social/en/page-start.jpg'],
    ['sq/field-notes.html', '/media/social/sq/page-field-notes.jpg'],
    ['de/insights.html', '/media/social/de/page-insights.jpg'],
    ['index.html', '/media/social/en/home.jpg'],
  ];
  for (const [file, image] of cases) assert.equal(ogImage(built(file)), image, file);
});
