// Waste Log (src/js/waste-log.js): the value of an entry, the totals in kg and euro, grams per cover, the weeks per
// day, the baseline and target, the change against the days before, the Pareto shares, where the waste went, pasted
// rows, and the page that shows them. The small fixture is worked out by hand below; the example of the data file
// (86 entries over four weeks of a hotel breakfast and its warehouse) was added up separately.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/wasteLog.json'), de: read('src/_data/de/wasteLog.json'), sq: read('src/_data/sq/wasteLog.json') };
const part = read('src/_data/i18n-parts/waste-log.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/waste-log.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

// Sunday 25 October 2026, noon in Frankfurt: the last day of the example, which therefore stays where it is.
const NOW = '2026-10-25T11:00:00Z';
const load = ({ lang = 'en', page = false, now = NOW, storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/waste-log/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'waste-log']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const near = (actual, expected, digits = 6) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≈ ${expected}`);

// Five entries over two weeks, by hand:
//   A Mon 05.10 buffet  10 kg × 4.50 = 45.00  overproduction  compost
//   B Tue 06.10 plate    3 kg × 4.00 = 12.00  leftovers       compost
//   C Wed 07.10 expired 20 pcs × 0.45 =  9.00  expiry          residual
//   D Mon 12.10 buffet   8 kg × 4.50 = 36.00  overproduction  donated
//   E Tue 13.10 damaged  6 l × 1.60  =  9.60  damage          residual
// Total 111.60 €, 21 kg, 20 pcs, 6 l. Covers 150 on 05.10, 120 on 06.10, 160 on 12.10.
const FIXTURE = [
  { date: '2026-10-05', shift: 'Early', area: 'Breakfast buffet', category: 'buffet', item: 'Buffet mix', qty: 10, unit: 'kg', cost: 4.5, reason: 'overproduction', dest: 'compost', note: '' },
  { date: '2026-10-06', shift: 'Early', area: 'Breakfast buffet', category: 'plate', item: 'Plates', qty: 3, unit: 'kg', cost: 4, reason: 'leftovers', dest: 'compost', note: '' },
  { date: '2026-10-07', shift: 'Late', area: 'Warehouse', category: 'expired', item: 'Yoghurt', qty: 20, unit: 'pcs', cost: 0.45, reason: 'expiry', dest: 'residual', note: '' },
  { date: '2026-10-12', shift: 'Early', area: 'Breakfast buffet', category: 'buffet', item: 'Pastries', qty: 8, unit: 'kg', cost: 4.5, reason: 'overproduction', dest: 'donated', note: '' },
  { date: '2026-10-13', shift: 'Late', area: 'Warehouse', category: 'damaged', item: 'Juice', qty: 6, unit: 'l', cost: 1.6, reason: 'damage', dest: 'residual', note: '' },
];
const COVERS = { '2026-10-05': 150, '2026-10-06': 120, '2026-10-12': 160 };
const FOOD = ['buffet', 'prep', 'plate'];

test('the three data files have the same keys, and each language keeps its own log', () => {
  const shape = (cfg) => ({
    top: Object.keys(cfg).sort(),
    text: Object.keys(cfg.text).sort(),
    shifts: cfg.shifts.length, areas: cfg.areas.length,
    units: cfg.units.map((u) => u.key),
    categories: cfg.categories.map((c) => [c.key, c.food]),
    reasons: cfg.reasons.map((r) => r.key),
    destinations: cfg.destinations.map((d) => d.key),
    target: cfg.target,
    advice: Object.fromEntries(Object.entries(cfg.advice).map(([k, v]) => [k, Object.keys(v).sort(), v.moves.length])),
    tips: cfg.tips.map((tip) => tip.length),
    example: { top: Object.keys(cfg.example).sort(), start: cfg.example.start, settings: cfg.example.settings, items: Object.keys(cfg.example.items).sort(), notes: Object.keys(cfg.example.notes).sort(), rows: cfg.example.rows, covers: cfg.example.covers },
  });
  for (const lang of ['de', 'sq']) {
    assert.deepEqual(shape(data[lang]), shape(data.en), lang);
    assert.equal(data[lang].storageKey, `sc-waste-log-${lang}`);
  }
  assert.equal(data.en.storageKey, 'sc-waste-log');
  assert.deepEqual(data.en.destinations.map((d) => d.key), ['prevented', 'donated', 'feed', 'compost', 'recycling', 'residual'], 'the order of the waste hierarchy');
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = data[lang];
    Object.keys(cfg.advice).forEach((key) => assert.ok(key === 'default' || cfg.reasons.some((r) => r.key === key), `${lang}: advice for ${key}`));
    cfg.reasons.forEach((r) => assert.ok(cfg.advice[r.key], `${lang}: advice for the reason ${r.key}`));
    cfg.example.rows.forEach((row) => {
      assert.ok(cfg.example.items[row.item], `${lang}: item ${row.item}`);
      assert.ok(!row.note || cfg.example.notes[row.note], `${lang}: note ${row.note}`);
      assert.ok(cfg.shifts[row.shift] && cfg.areas[row.area], `${lang}: shift and area of day ${row.day}`);
    });
    assert.match(cfg.text.hierarchy, /2008\/98/);
    assert.match(cfg.text.feedNote, /1069\/2009/);
  }
  assert.equal(data.en.example.covers.length, 28);
  const cards = read('src/_data/i18n-parts/waste-log.cards.json');
  assert.equal(cards.family, 'pulse');
  assert.deepEqual(['en', 'de', 'sq'].map((l) => cards.cards[l].url), ['/tools/waste-log/', '/de/tools/waste-log/', '/sq/tools/waste-log/']);
  assert.ok(fs.readFileSync('src/css/56-waste-log.css', 'utf8').split('{').length === fs.readFileSync('src/css/56-waste-log.css', 'utf8').split('}').length, 'braces balanced');
});

test('value = quantity × cost per unit; totals keep kg, pieces and litres apart', () => {
  const M = load().WasteLogMath;
  assert.equal(M.value({ qty: 2.4, cost: 6 }), 14.4);
  assert.equal(M.value({ qty: 0.1, cost: 3 }), 0.3);
  assert.equal(M.value({ qty: 3, cost: 1.005 }), 3.02, '3.015 rounds to the cent');
  assert.equal(M.value({ qty: 5, cost: 0 }), 0);
  assert.deepEqual(plain(M.totals(FIXTURE)), { n: 5, kg: 21, pcs: 20, l: 6, value: 111.6 });
  assert.equal(M.days('2026-10-05', '2026-10-13'), 9);
  assert.equal(M.days('2026-10-13', '2026-10-05'), 0);
});

test('grams per cover: food rows in kg on days with covers only', () => {
  const M = load().WasteLogMath;
  // A 10 kg (05.10) + B 3 kg (06.10) + D 8 kg (12.10) = 21 kg over 150 + 120 + 160 = 430 covers: 21 000 / 430 g.
  const c = M.perCover(FIXTURE, COVERS, '2026-10-05', '2026-10-13', FOOD);
  assert.equal(c.kg, 21);
  assert.equal(c.covers, 430);
  assert.equal(c.days, 3);
  assert.equal(c.missing, 6);
  near(c.grams, 21000 / 430);
  // Without the covers of 12.10, D does not count either: 13 kg over 270 covers.
  const without = M.perCover(FIXTURE, { '2026-10-05': 150, '2026-10-06': 120 }, '2026-10-05', '2026-10-13', FOOD);
  assert.equal(without.kg, 13);
  near(without.grams, 13000 / 270);
  assert.equal(M.perCover(FIXTURE, {}, '2026-10-05', '2026-10-13', FOOD).grams, null);
});

test('weeks per day, the baseline and its target, the change, the Pareto and the destinations', () => {
  const M = load().WasteLogMath;
  // The period 07.10–13.10 cuts the week of 05.10 to 5 days (only C) and the week of 12.10 to 2 days (D, E).
  const weeks = plain(M.weekly(FIXTURE.filter((r) => r.date >= '2026-10-07'), '2026-10-07', '2026-10-13', ['donated', 'residual']));
  assert.equal(weeks.length, 2);
  assert.deepEqual([weeks[0].week, weeks[0].from, weeks[0].to, weeks[0].days, weeks[0].value, weeks[0].kg], ['2026-10-05', '2026-10-07', '2026-10-11', 5, 9, 0]);
  near(weeks[0].valuePerDay, 1.8);
  assert.deepEqual([weeks[1].week, weeks[1].days, weeks[1].value, weeks[1].kg, weeks[1].kgPerDay, weeks[1].valuePerDay], ['2026-10-12', 2, 45.6, 8, 4, 22.8]);
  assert.deepEqual(weeks[1].byDest, { donated: 36, residual: 9.6 });

  // One week of baseline: 05.10–11.10, 66.00 € and 13 kg over 7 days; the target 20 % below it.
  const b = M.baseline(FIXTURE, 1);
  assert.deepEqual([b.from, b.to, b.days, b.complete, b.value, b.kg], ['2026-10-05', '2026-10-11', 7, true, 66, 13]);
  near(b.valuePerDay, 66 / 7);
  const goal = M.target(b, 20);
  near(goal.valuePerDay, (66 / 7) * 0.8);
  near(goal.kgPerDay, (13 / 7) * 0.8);
  // Four weeks asked, nine days logged: the baseline is what there is, and says so.
  const b4 = M.baseline(FIXTURE, 4);
  assert.deepEqual([b4.to, b4.days, b4.complete], ['2026-10-13', 9, false]);
  near(b4.valuePerDay, 12.4);

  near(M.change(389.34, 420.57), (389.34 - 420.57) / 420.57);
  assert.equal(M.change(10, 0), null);

  // Pareto by reason: 81.00, 12.00, 9.60, 9.00 of 111.60. A while the share before is under 80 %.
  const p = plain(M.pareto(FIXTURE, 'reason'));
  assert.deepEqual(p.map((i) => [i.key, i.value, i.cls]), [['overproduction', 81, 'A'], ['leftovers', 12, 'A'], ['damage', 9.6, 'B'], ['expiry', 9, 'B']]);
  near(p[0].share, 81 / 111.6);
  near(p[1].cumulative, 93 / 111.6);
  near(p.at(-1).cumulative, 1);

  const d = plain(M.destinations(FIXTURE, ['prevented', 'donated', 'feed', 'compost', 'recycling', 'residual']));
  assert.deepEqual(d.map((i) => [i.key, i.value]), [['prevented', 0], ['donated', 36], ['feed', 0], ['compost', 57], ['recycling', 0], ['residual', 18.6]]);
  near(d[3].share, 57 / 111.6);

  const cfg = data.en;
  assert.deepEqual(plain(M.settings(cfg, {})), { reduction: 20, baselineWeeks: 4 });
  assert.deepEqual(plain(M.settings(cfg, { reduction: '30', baselineWeeks: '2' })), { reduction: 30, baselineWeeks: 2 });
  assert.deepEqual(plain(M.settings(cfg, { reduction: '120', baselineWeeks: '1.5' })), { reduction: 20, baselineWeeks: 4 }, 'out of range falls back');
});

test('pasted rows: names to keys in the page language, a header skipped, a row without quantity skipped', () => {
  const en = load().WasteLogMath;
  const text = 'Date\tShift\tArea\tCategory\tItem\tQuantity\tUnit\tCost\tReason\tDestination\tNote\n'
    + '2026-10-12\tearly\tBreakfast buffet\tBreakfast buffet\tScrambled eggs\t3.2\tKG\t4.50\tOverproduction\tCompost or biogas\tlate refill\n'
    + '2026-10-12\tLate\tDock 3\tsomething\tPallet\t1\tpiece\t8\tbroken\t\t\n'
    + '2026-10-13\tLate\tWarehouse\tExpired goods\tMilk\t\tl\t1.10\tExpiry\tResidual waste\t';
  const { added, skipped } = en.importRows(text, data.en);
  assert.equal(skipped, 1);
  assert.deepEqual(plain(added[0]), { date: '2026-10-12', shift: 'Early', area: 'Breakfast buffet', category: 'buffet', item: 'Scrambled eggs', qty: 3.2, unit: 'kg', cost: 4.5, reason: 'overproduction', dest: 'compost', note: 'late refill' });
  assert.deepEqual([added[1].area, added[1].category, added[1].unit, added[1].reason, added[1].dest], ['Dock 3', 'other', 'pcs', 'other', 'residual']);
  const de = load({ lang: 'de' }).WasteLogMath;
  const row = de.importRows('12.10.2026;Früh;Lager;Abgelaufene Ware;Joghurt;24;Stk.;0,45;Datum abgelaufen;Kompost oder Biogas;', data.de).added[0];
  assert.deepEqual([row.date, row.category, row.qty, row.unit, row.cost, row.reason, row.dest, de.value(row)], ['2026-10-12', 'expired', 24, 'pcs', 0.45, 'expiry', 'compost', 10.8]);
});

test('the example: 86 entries over 28 days that add up, moved by whole weeks', () => {
  const M = load().WasteLogMath;
  const rows = M.exampleRows(data.en, '2026-10-25');
  assert.equal(rows.length, 86);
  assert.equal(rows[0].date, '2026-09-28');
  assert.equal(rows.at(-1).date, '2026-10-25');
  assert.deepEqual(plain(M.totals(rows)), { n: 86, kg: 378.7, pcs: 157, l: 36, value: 1855.6 });
  const covers = M.exampleCovers(data.en, '2026-10-25');
  assert.equal(Object.keys(covers).length, 26);
  const c = M.perCover(rows, covers, '2026-09-28', '2026-10-25', FOOD);
  assert.deepEqual([c.kg, c.covers, c.days, c.missing], [346.3, 3750, 26, 2]);
  near(c.grams, 346300 / 3750);
  assert.deepEqual(plain(M.pareto(rows, 'reason').slice(0, 2).map((i) => [i.key, i.value])), [['overproduction', 1213.2], ['leftovers', 340.8]]);
  assert.deepEqual(plain(M.pareto(rows, 'category').slice(0, 3).map((i) => [i.key, i.value])), [['buffet', 1213.2], ['plate', 340.8], ['expired', 111.6]]);
  const weeks = M.weekly(rows, '2026-09-28', '2026-10-25');
  assert.deepEqual(plain(weeks.map((w) => w.value)), [491.65, 554.04, 420.57, 389.34]);
  assert.deepEqual(plain(weeks.map((w) => w.kg)), [108.3, 104.8, 86.8, 78.8]);
  const b = M.baseline(rows, 2);
  assert.deepEqual([b.days, b.value, b.kg], [14, 1045.69, 213.1]);
  // Nine days later the example moves one week forward, weekdays unchanged.
  assert.equal(M.exampleShift(data.en, '2026-11-03'), 7);
  assert.equal(M.exampleRows(data.en, '2026-11-03')[0].date, '2026-10-05');
  // Every buffet day is between 6 and 12 kg, as a hotel breakfast for 120–180 covers.
  rows.filter((r) => r.item === data.en.example.items.buffetMix).forEach((r) => assert.ok(r.qty >= 6 && r.qty <= 12, `${r.date}: ${r.qty}`));
});

test('a first visit opens on the example: the numbers, the target, the charts and the hand-offs', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.match(results.querySelector('h2').textContent, /^1\.855,60\s€ Verlust · 378,7 kg · 92 g pro Gast/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Gesamtgewicht378,7 kgzusätzlich 157 Stk\. · 36 l/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Wert pro Tag66,27\s€28 Tage/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Veränderung des Werts−7\s%Letzte 7 Tage/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Lebensmittelabfall pro Gast92 g346,3 kg .*3\.750 Gäste an 26 Tagen.*2 Tage ohne Gästezahl/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Gegenüber dem Ziel55,62\s€Woche ab 19\.10\.2026 · ✓ im Ziel · Ziel 59,75\s€ pro Tag: 20\s% unter der Basis von 74,69\s€/.test(s)), stats.join(' | '));
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Überproduktion · 65\s%/);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 5, 'two Pareto charts, two weeks, the destinations');
  assert.match(results.textContent, /Gespendet 4\s% · Kompost oder Biogas 90\s% · Recycling 2\s% · Restmüll 2\s%/);
  assert.equal(results.querySelectorAll('.wl-register tbody tr').length, 86, 'the whole period for print');

  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent) && a.href.includes('/pareto/'));
  assert.equal(new URL(pareto.href).pathname, '/de/tools/pareto/');
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.measure, 'value');
  assert.equal(handoff.rows.length, 86);
  assert.deepEqual(handoff.map, { date: 0, filter: 1, category: 3, count: -1, value: 7 });
  assert.deepEqual(handoff.rows[0], ['2026-09-28', 'Frühstücksbuffet', 'Frühstücksbuffet', 'Überproduktion', 'Buffetmix: Eier, Würstchen, Obst, Brot', '11.4', 'kg', '51.3']);

  const action = results.querySelector('.dl-focus a');
  action.addEventListener('click', (event) => event.preventDefault());
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(action.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'waste-log');
  assert.equal(url.searchParams.get('area'), 'Frühstücksbuffet');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('action'), /Überproduktion/);
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('/five-whys/'));
  assert.ok(whys.href.startsWith('https://example.test/de/tools/five-whys/?problem='), whys.href);
});

test('an entry replaces the example; filters, covers and settings change the result; saving keeps it', () => {
  const w = load({ lang: 'en', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  // The area filter narrows the result to the warehouse of the example: 163.44 €.
  const area = doc.querySelector('#wl-filter-area');
  area.value = 'Warehouse';
  area.dispatchEvent(new w.Event('change'));
  assert.match(results.querySelector('h2').textContent, /^€163\.44 lost · 6\.0 kg/);
  area.value = '';
  area.dispatchEvent(new w.Event('change'));

  const form = doc.querySelector('[data-entry]');
  form.elements.date.value = '2026-10-25';
  form.elements.category.value = 'buffet';
  form.elements.product.value = 'Scrambled eggs';
  form.elements.qty.value = '2.5';
  form.elements.cost.value = '4.00';
  form.elements.qty.dispatchEvent(new w.Event('input'));
  assert.match(doc.querySelector('[data-value-note]').textContent, /€10\.00/);
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.equal(doc.querySelector('.dl-example-note').hidden, true, 'the example left with the first own entry');
  assert.match(results.querySelector('h2').textContent, /^€10\.00 lost · 2\.5 kg/);

  const covers = doc.querySelector('[data-covers]');
  covers.elements.coversDate.value = '2026-10-25';
  covers.elements.covers.value = '125';
  covers.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.match(results.querySelector('h2').textContent, /· 20 g per cover/, '2.5 kg × 1000 / 125');
  flush(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-waste-log'));
  assert.equal(saved.rows.length, 1);
  assert.deepEqual(saved.covers, { '2026-10-25': 125 });
  assert.equal(saved.costs['scrambled eggs'].cost, 4);
  // The item brings its cost back next time.
  form.elements.product.value = 'Scrambled eggs';
  form.elements.product.dispatchEvent(new w.Event('change'));
  assert.equal(form.elements.cost.value, '4.00');
});

test('the workplace profile gives the shifts and areas; a saved log in another state never throws', () => {
  const w = load({ lang: 'sq', page: true, storage: { 'sc-workplace': { shifts: ['A', 'B'], areas: [{ name: 'Kuzhina 2', owner: '' }] }, 'sc-waste-log-sq': { rows: [{ date: 'x' }, null, { date: '2026-10-20', qty: '2', unit: 'kg', cost: '3', category: 'nope' }], covers: { bad: 3, '2026-10-20': 0 } } } });
  const doc = w.document;
  assert.deepEqual([...doc.querySelector('#wl-shift').options].map((o) => o.value), ['A', 'B']);
  assert.ok([...doc.querySelector('#wl-filter-area').options].some((o) => o.value === 'Kuzhina 2'));
  assert.match(doc.querySelector('[data-results] h2').textContent, /^6,00\s€ të humbura · 2,0 kg/);
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
});
