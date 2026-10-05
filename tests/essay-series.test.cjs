// The essays come in series (src/_data/essaySeries.json). Each series is numbered on its own ("Essay 1 of 10"),
// counts against the essays it plans, and its last published essay says what comes next.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');

const SERIES = JSON.parse(fs.readFileSync('src/_data/essaySeries.json', 'utf8'));
const dirs = { en: 'src/content/insights', de: 'src/content/de/insights', sq: 'src/content/sq/insights' };
const essays = (lang) => fs.readdirSync(dirs[lang]).filter((file) => file.endsWith('.md'))
  .map((file) => ({ file, data: matter.read(path.join(dirs[lang], file)).data }));

test('every series has a name in every language and a planned length', () => {
  assert.ok(SERIES.length >= 2);
  assert.equal(new Set(SERIES.map((entry) => entry.id)).size, SERIES.length);
  for (const entry of SERIES) {
    for (const lang of ['en', 'de', 'sq']) assert.ok(entry.name[lang], `${entry.id} ${lang}`);
    assert.ok(entry.planned > 0, entry.id);
  }
});

test('an essay belongs to a known series, the same one in every language', () => {
  const ids = SERIES.map((entry) => entry.id);
  const seriesOf = (lang) => Object.fromEntries(essays(lang).map(({ file, data }) => [file, data.series]));
  const en = seriesOf('en');
  for (const [file, id] of Object.entries(en)) assert.ok(!id || ids.includes(id), `${file}: ${id}`);
  for (const lang of ['de', 'sq']) assert.deepEqual(seriesOf(lang), en, lang);
});

test('the preview cards number an essay within its series', async () => {
  const { cards } = await import('../scripts/page-cards.mjs');
  const first = cards().find((card) => card.file === 'src/media/social/sq/insight-the-first-30-days.jpg');
  assert.equal(first.number, '01');
  assert.equal(first.sub, 'Operacioni që punon pa ty · Eseja 1 nga 10');
  const last = cards().find((card) => card.file === 'src/media/social/en/insight-the-operations-manager-i-want-to-be.jpg');
  assert.equal(last.sub, 'Ten years close to the work · Essay 12 of 12');
});

const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');

test('the site shows each series on its own', { skip: !fs.existsSync('_site/sq/insights/the-first-30-days/index.html') }, () => {
  // The first essay of the new series leads to the second.
  const first = built('sq/insights/the-first-30-days/index.html');
  assert.match(first, /Operacioni që punon pa ty · Eseja 1 nga 10/);
  assert.match(first, /href="\/sq\/insights\/ten-minutes-before-the-shift\/" rel="next"/);

  // The newest essay of the unfinished series says the next one is on its way.
  const newest = built('sq/insights/ten-minutes-before-the-shift/index.html');
  assert.match(newest, /Operacioni që punon pa ty · Eseja 2 nga 10/);
  assert.match(newest, /href="#newsletter-title">Merreni me email</);
  assert.match(newest, /Filloni sërish me esenë 1/);

  // The last essay of the finished first series leads into the second.
  const last = built('insights/the-operations-manager-i-want-to-be/index.html');
  assert.match(last, /The next series/);
  assert.match(last, /href="\/insights\/the-first-30-days\/"/);

  const page = built('sq/insights.html');
  assert.match(page, /aria-labelledby="series-panel-without-you"/);
  assert.match(page, /aria-labelledby="series-panel-ten-years"/);
  assert.match(page, /2 nga 10 ese/);
  assert.match(page, /12 ese</);
  const row = page.slice(page.indexOf('data-read-row="the-first-30-days"'));
  assert.match(row, /<span class="number">01<\/span>/);
  assert.match(row.slice(0, row.indexOf('</a>')), /Operacioni që punon pa ty · Operacione/);
});
