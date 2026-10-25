// Energy & Water (src/js/energy-tracker.js): the use between readings spread over the days, a lower reading and a
// replaced meter, gas from m³ to kWh (DVGW G 685), cost, CO₂ (gas on Hi), per unit, weeks and months, the baseline and
// its signal, the weekday pattern, Hotel KPIs read only, pasted rows, the data files and the page. The fixtures are
// worked out by hand in the comments; the example (68 readings of a 140-room hotel over 16 weeks) is checked against its
// first and last readings.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/energyTracker.json'), de: read('src/_data/de/energyTracker.json'), sq: read('src/_data/sq/energyTracker.json') };
const part = read('src/_data/i18n-parts/energy-tracker.json');
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
  const body = env.render('partials/energy-tracker.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

// Sunday 25 October 2026, noon in Frankfurt: the last reading of the example (Monday 19 October) stays where it is.
const NOW = '2026-10-25T11:00:00Z';
const load = ({ lang = 'en', page = false, now = NOW, storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/energy-tracker/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'energy-tracker']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const near = (actual, expected, digits = 6) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≈ ${expected}`);
const CONV = { calorific: 11.0, zustand: 0.95, oilKwhPerLitre: 10, hsHi: 1.11 };
const FACTORS = { electricity: 0.38, gas: 0.201, water: 0, heat: 0, oil: 0.266, hsHi: 1.11 };

test('the three data files have the same shape, and each language keeps its own saved work', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])])) : typeof value);
  for (const lang of ['de', 'sq']) {
    assert.deepEqual(shape(data[lang]), shape(data.en), `${lang} has the keys of en`);
    assert.deepEqual(data[lang].media.map((m) => [m.key, m.unit, m.tariffUnit, m.co2, m.co2Unit]), data.en.media.map((m) => [m.key, m.unit, m.tariffUnit, m.co2, m.co2Unit]));
    assert.deepEqual(data[lang].conversion, data.en.conversion);
    assert.deepEqual(data[lang].signal, data.en.signal);
    assert.deepEqual(data[lang].denominators.map((d) => d.key), data.en.denominators.map((d) => d.key));
    assert.deepEqual(Object.keys(data[lang].advice).sort(), Object.keys(data.en.advice).sort());
    for (const key of ['start', 'rooms', 'settings', 'occupied', 'readings']) assert.deepEqual(data[lang].example[key], data.en.example[key], `example.${key}`);
    assert.deepEqual(data[lang].example.meters.map((m) => [m.id, m.medium]), data.en.example.meters.map((m) => [m.id, m.medium]));
    assert.deepEqual(Object.keys(data[lang].example.notes).sort(), Object.keys(data.en.example.notes).sort());
  }
  assert.equal(data.en.storageKey, 'sc-energy-tracker');
  assert.equal(data.de.storageKey, 'sc-energy-tracker-de');
  assert.equal(data.sq.storageKey, 'sc-energy-tracker-sq');
  // The defaults the page promises: 11.0 kWh/m³ and 0.95 for gas, 10 kWh/l for oil, district heat and water without a factor.
  assert.deepEqual(data.en.conversion, CONV);
  assert.equal(data.en.media.find((m) => m.key === 'gas').co2, 0.201);
  assert.equal(data.en.media.find((m) => m.key === 'heat').co2, 0);
  for (const cfg of Object.values(data)) for (const advice of Object.values(cfg.advice)) assert.equal(advice.moves.length, 3);
  // Every translated text has a German and an Albanian version.
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
});

test('gas from m³ to kWh, cost and CO₂ per medium', () => {
  const M = load().EnergyTrackerMath;
  // DVGW G 685: 100 m³ × 11.0 × 0.95 = 1,045 kWh; with the bill's 11.15 and 0.9542: 1,063.933 kWh.
  near(M.gasKwh(100, 11, 0.95), 1045);
  near(M.gasKwh(100, 11.15, 0.9542), 1063.933);
  const gas = M.resolveMeter({ id: 'g', name: 'Gas', medium: 'gas', tariff: '0.08', calorific: '', zustand: '' }, CONV);
  assert.equal(gas.calorific, 11);
  assert.equal(gas.zustand, 0.95);
  near(M.kwhOf(gas, 100), 1045);
  // Gas is priced per kWh: 1,045 × 0.08 = 83.60.
  near(M.costOf(gas, 100), 83.6);
  // CO₂ on Hi: 1,045 ÷ 1.11 × 0.201 = 189.2297 kg.
  near(M.co2Of(gas, 100, FACTORS), 189.229730, 5);
  const oil = M.resolveMeter({ id: 'o', name: 'Oil', medium: 'oil', tariff: '1.00' }, CONV);
  // 50 l × 10 kWh/l = 500 kWh; priced per litre: 50 × 1.00 = 50; CO₂ 500 × 0.266 = 133.
  near(M.kwhOf(oil, 50), 500);
  near(M.costOf(oil, 50), 50);
  near(M.co2Of(oil, 50, FACTORS), 133);
  const power = M.resolveMeter({ id: 'e', name: 'E', medium: 'electricity', tariff: '0.25' }, CONV);
  near(M.costOf(power, 700), 175);
  near(M.co2Of(power, 700, FACTORS), 266);
  const water = M.resolveMeter({ id: 'w', name: 'W', medium: 'water', tariff: '4.80' }, CONV);
  assert.equal(M.kwhOf(water, 10), null, 'water has no kWh');
  near(M.costOf(water, 10), 48);
  assert.equal(M.co2Of(water, 10, FACTORS), null, 'no factor: not known, not 0');
  near(M.co2Of(water, 10, { ...FACTORS, water: 0.5 }), 5);
  const heat = M.resolveMeter({ id: 'h', name: 'H', medium: 'heat', tariff: '' }, CONV);
  assert.equal(M.costOf(heat, 100), null, 'no price: no cost');
  assert.equal(M.co2Of(heat, 100, FACTORS), null, 'district heat has no default factor');
  assert.equal(M.measureOf(gas, 100), 1045);
  assert.equal(M.measureOf(water, 10), 10);
});

test('intervals: the use between readings, spread over the days; a lower reading and a meter swap', () => {
  const M = load().EnergyTrackerMath;
  // 05.10: 1,000 · 08.10: 1,300 (300 over 3 days = 100 a day) · 12.10: 1,700 (400 over 4 days = 100 a day).
  const ints = M.intervals([
    { date: '2026-10-12', value: 1700 }, { date: '2026-10-05', value: 1000 }, { date: '2026-10-08', value: 1250 }, { date: '2026-10-08', value: 1300 },
  ]);
  assert.deepEqual(plain(ints.map((iv) => [iv.from, iv.to, iv.days, iv.qty, iv.perDay, iv.status])), [
    ['2026-10-05', '2026-10-08', 3, 300, 100, 'ok'],
    ['2026-10-08', '2026-10-12', 4, 400, 100, 'ok'],
  ], 'one reading per day, the last entered wins; sorted by date');
  const { days, gaps } = M.daily(ints);
  assert.equal(days.size, 7, 'a reading closes the days before it: 05.10 to 11.10');
  assert.equal(days.get('2026-10-05'), 100);
  assert.equal(days.get('2026-10-11'), 100);
  assert.equal(days.has('2026-10-12'), false, 'the day of the last reading has no figure yet');
  assert.equal(gaps.size, 0);
  assert.deepEqual(plain(M.sumRange(days, '2026-10-07', '2026-10-13')), { qty: 500, covered: 5, span: 7 });

  // A lower reading without the tick is a gap: nothing is invented over its 3 days.
  const lower = M.intervals([{ date: '2026-10-05', value: 100 }, { date: '2026-10-08', value: 90 }, { date: '2026-10-12', value: 110 }]);
  assert.deepEqual(plain(lower.map((iv) => [iv.status, iv.qty])), [['gap-lower', null], ['ok', 20]]);
  assert.equal(M.daily(lower).gaps.size, 3);
  // Replaced, with the old meter's last reading 130: 130 − 100 = 30 up to the swap, then the new meter 5 → 25 = 20.
  const swap = M.intervals([{ date: '2026-10-05', value: 100 }, { date: '2026-10-08', value: 5, replaced: true, oldFinal: 130 }, { date: '2026-10-12', value: 25 }]);
  assert.deepEqual(plain(swap.map((iv) => [iv.status, iv.qty, iv.days])), [['swap', 30, 3], ['ok', 20, 4]]);
  near(M.daily(swap).days.get('2026-10-06'), 10);
  near(M.daily(swap).days.get('2026-10-09'), 5);
  // Replaced without it: a gap, and the new meter counts from its own first reading.
  const blind = M.intervals([{ date: '2026-10-05', value: 100 }, { date: '2026-10-08', value: 5, replaced: true, oldFinal: null }, { date: '2026-10-12', value: 25 }]);
  assert.deepEqual(plain(blind.map((iv) => [iv.status, iv.qty])), [['gap-replaced', null], ['ok', 20]]);
  // An old last reading below the reading before cannot be right: a gap too.
  assert.equal(M.intervals([{ date: '2026-10-05', value: 100 }, { date: '2026-10-08', value: 5, replaced: true, oldFinal: 90 }])[0].status, 'gap-replaced');
});

test('weeks and months cut at the period, and use per unit on the days that have both', () => {
  const M = load().EnergyTrackerMath;
  const days = M.daily(M.intervals([{ date: '2026-10-05', value: 1000 }, { date: '2026-10-08', value: 1300 }, { date: '2026-10-12', value: 1700 }])).days;
  // From Wednesday 07.10 to Tuesday 13.10: the week of 05.10 has 5 days in the period (all with a figure), the week of
  // 12.10 has 2 days and none with a figure.
  assert.deepEqual(plain(M.buckets(days, '2026-10-07', '2026-10-13', 'week')), [
    { key: '2026-10-05', from: '2026-10-07', to: '2026-10-11', qty: 500, covered: 5, span: 5 },
    { key: '2026-10-12', from: '2026-10-12', to: '2026-10-13', qty: 0, covered: 0, span: 2 },
  ]);
  const months = M.buckets(days, '2026-09-28', '2026-10-11', 'month');
  assert.deepEqual(plain(months.map((b) => [b.key, b.from, b.to, b.qty, b.covered, b.span])), [
    ['2026-09-01', '2026-09-28', '2026-09-30', 0, 0, 3],
    ['2026-10-01', '2026-10-01', '2026-10-11', 700, 7, 11],
  ]);
  // Units on 05.10 (50), 06.10 (50) and 07.10 (100): 300 ÷ 200 = 1.5 per unit, over 3 days; the other days have no unit.
  assert.deepEqual(plain(M.perUnit(days, { '2026-10-05': 50, '2026-10-06': 50, '2026-10-07': 100, '2026-10-20': 80 }, '2026-10-01', '2026-10-31')), { qty: 300, units: 200, days: 3, value: 1.5 });
  assert.equal(M.perUnit(days, {}, '2026-10-01', '2026-10-31').value, null);
  assert.equal(M.weekday('2026-10-05'), 0, 'Monday first');
  assert.equal(M.mondayOf('2026-10-11'), '2026-10-05');
});

test('baseline and signal: Σ use ÷ Σ units over complete weeks, the latest week against it', () => {
  const M = load().EnergyTrackerMath;
  // Four weeks from Monday 07.09 with 10 units a day: 100 a day, 100, 105, 120. Per unit: 10, 10, 10.5, 12.
  const perDay = [100, 100, 105, 120];
  const days = new Map();
  const units = {};
  perDay.forEach((q, w) => { for (let d = 0; d < 7; d++) { const date = M.addDays('2026-09-07', w * 7 + d); days.set(date, q); units[date] = 10; } });
  const weeks = M.weekSeries(days, units, true);
  assert.deepEqual(plain(weeks.map((w) => [w.week, w.complete, w.qty, w.units, w.value])), [
    ['2026-09-07', true, 700, 70, 10], ['2026-09-14', true, 700, 70, 10], ['2026-09-21', true, 735, 70, 10.5], ['2026-09-28', true, 840, 70, 12],
  ]);
  // Baseline of 2 weeks: 1,400 ÷ 140 = 10. The latest week (12) is 20 % above: a signal at 10 %, none at 25 %.
  const two = M.baseline(weeks, 2);
  assert.deepEqual(plain(two), { weeks: ['2026-09-07', '2026-09-14'], from: '2026-09-07', to: '2026-09-20', value: 10, full: true });
  const sig = M.signal(weeks, two, 0.1);
  assert.equal(sig.week, '2026-09-28');
  near(sig.change, 0.2);
  assert.equal(sig.fires, true);
  assert.equal(M.signal(weeks, two, 0.25).fires, false);
  assert.equal(M.signal(weeks, two, 0.2).fires, false, 'exactly at the threshold is not above it');
  // Baseline of 3 weeks: (700 + 700 + 735) ÷ 210 = 10.1667; 12 ÷ 10.1667 − 1 = +18.03 %.
  near(M.signal(weeks, M.baseline(weeks, 3), 0.1).change, 12 / (2135 / 210) - 1);
  // A chosen period, 14.09 to 27.09: (700 + 735) ÷ 140 = 10.25.
  near(M.baseline(weeks, 4, { from: '2026-09-14', to: '2026-09-27' }).value, 10.25);
  // Baseline of 6 weeks with 4 there: all 4, marked as not full, and no later week for a signal.
  assert.equal(M.baseline(weeks, 6).full, false);
  assert.equal(M.signal(weeks, M.baseline(weeks, 6), 0.1), null);
  // A day without units makes its week incomplete per unit; per day it stays complete (840 ÷ 7 = 120).
  delete units['2026-09-30'];
  assert.equal(M.weekSeries(days, units, true)[3].complete, false);
  assert.equal(M.weekSeries(days, units, false)[3].value, 120);
});

test('weekday pattern from daily readings only; Hotel KPIs rooms; pasted rows', () => {
  const M = load().EnergyTrackerMath;
  // Mon 05.10 → Tue 06.10: 120 (one day); Tue → Wed: 80 (one day); Wed → Mon 12.10: 500 over 5 days, left out.
  const ints = M.intervals([{ date: '2026-10-05', value: 0 }, { date: '2026-10-06', value: 120 }, { date: '2026-10-07', value: 200 }, { date: '2026-10-12', value: 700 }]);
  const pattern = M.weekdayPattern(ints, { '2026-10-05': 60, '2026-10-06': 40 });
  assert.deepEqual(plain(pattern.slice(0, 3)), [
    { weekday: 0, days: 1, avg: 120, perUnit: 2 },
    { weekday: 1, days: 1, avg: 80, perUnit: 2 },
    { weekday: 2, days: 0, avg: null, perUnit: null },
  ]);
  assert.deepEqual(plain(M.hotelRooms({ rows: [{ date: '2026-10-05', sold: 112 }, { date: 'x', sold: 3 }, null, { date: '2026-10-06', sold: 'n' }] })), { '2026-10-05': 112 });
  assert.deepEqual(plain(M.hotelRooms(null)), {});
  // The figures typed here win over the hotel's.
  assert.deepEqual(plain(M.unitsOf({ '2026-10-05': 100 }, { '2026-10-05': 112, '2026-10-06': 98 }, true)), { '2026-10-05': 100, '2026-10-06': 98 });
  assert.deepEqual(plain(M.unitsOf({ '2026-10-05': 100 }, { '2026-10-06': 98 }, false)), { '2026-10-05': 100 });
  const meters = [{ id: 'm1', name: 'Electricity main' }, { id: 'm3', name: 'Water' }];
  const { added, skipped } = M.importRows('Date\tMeter\tReading\n2026-10-12\telectricity main\t1234\t\t\tRead at 06:00\n12.10.2026\tWater\t5\tx\t2471.4\tswap\n2026-10-12\tSteam\t9\n2026-10-13\tWater\t\n', meters);
  assert.deepEqual(plain(added), [
    { date: '2026-10-12', meter: 'm1', value: 1234, replaced: false, oldFinal: null, note: 'Read at 06:00' },
    { date: '2026-10-12', meter: 'm3', value: 5, replaced: true, oldFinal: 2471.4, note: 'swap' },
  ]);
  assert.equal(skipped, 2, 'an unknown meter and a row without a reading');
  assert.equal(M.meterOf('elec', meters), 'm1', 'the start of a name');
  assert.deepEqual(plain(M.cleanMeters([{ id: 'a', name: 'X', medium: 'steam' }, { id: 'a', name: 'Y' }, null])), [{ id: 'a', name: 'X', medium: 'electricity', tariff: '', calorific: '', zustand: '', kwhPerLitre: '' }]);
});

test('the example: 68 readings over 16 weeks that add up, moved by whole weeks', () => {
  const M = load().EnergyTrackerMath;
  const cfg = data.en;
  const rows = M.exampleRows(cfg, '2026-10-25');
  assert.equal(rows.length, 68);
  assert.equal(rows[0].date, '2026-06-29');
  assert.equal(rows.at(-1).date, '2026-10-19', 'the last reading is the Monday before today');
  assert.equal(M.exampleShift(cfg, '2026-11-03'), 14, 'two weeks on, it moves two weeks');
  const units = M.exampleUnits(cfg, '2026-10-25');
  const nights = Object.values(units);
  assert.equal(nights.length, 112);
  assert.ok(Math.min(...nights) >= 84 && Math.max(...nights) <= 126, '60–90 % of 140 rooms');
  const of = (id) => rows.filter((r) => r.meter === id);
  const last = (id) => of(id).at(-1).value;
  const first = (id) => of(id)[0].value;
  // Electricity and gas: last − first; water: the old meter up to the swap, then the new one from 0.
  const use = (id) => M.sumRange(M.daily(M.intervals(of(id))).days, '2026-06-29', '2026-10-18').qty;
  near(use('m1'), last('m1') - first('m1'), 6);
  near(use('m2'), last('m2') - first('m2'), 6);
  const swap = of('m3').find((r) => r.replaced);
  near(use('m3'), swap.oldFinal - first('m3') + last('m3'), 6);
  assert.equal(of('m3').length, 16, 'one water reading missed, spread over 14 days');
  // The electricity drift of the last two weeks is a signal; gas and water stay within 10 %.
  const meters = cfg.example.meters.map((m) => M.resolveMeter(m, cfg.conversion));
  const signals = meters.map((meter) => {
    const days = M.daily(M.intervals(of(meter.id))).days;
    const measured = new Map([...days].map(([d, q]) => [d, M.measureOf(meter, q)]));
    const weeks = M.weekSeries(measured, units, true);
    return M.signal(weeks, M.baseline(weeks, 4), 0.1);
  });
  assert.deepEqual(plain(signals.map((s) => s.fires)), [true, false, false]);
  assert.ok(signals[0].change > 0.12 && signals[0].change < 0.16, `electricity +${signals[0].change}`);
  const perRoom = (i) => signals[i].base;
  assert.ok(perRoom(0) > 25 && perRoom(0) < 40, 'electricity 25–40 kWh per occupied room night');
  assert.ok(perRoom(2) > 0.3 && perRoom(2) < 0.5, 'water 0.3–0.5 m³ per occupied room night');
});

test('a first visit opens on the example: the numbers, the signal, the charts and the hand-off to the Action Tracker', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  // 405,068 + 164,750 kWh; water 2,401.1 + 2,471.4 m³; cost 97,216.32 + 14,003.75 + 23,388.00.
  assert.match(results.querySelector('h2').textContent, /^569\.818 kWh · 4\.873 m³ · 134\.608,07\s€ · 183,8 t CO₂e/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Energie pro belegte Zimmernacht47,3 kWh112 Tage/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Wasser pro belegte Zimmernacht0,405 m³/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^CO₂e183,8 t CO₂ekein Faktor für Wasser/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Signal✕ Strom Hauptzähler \+14\s%/.test(s)), stats.join(' | '));
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Zähler Strom Hauptzähler prüfen · \+14\s%/);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 6, 'energy, water, three baselines, the weekday pattern');
  const rows = [...results.querySelectorAll('.et-table tbody tr')].map((tr) => tr.textContent);
  assert.match(rows[0], /^Strom Hauptzähler405\.068 kWh405\.068 kWh97\.216,32\s€153,9 t CO₂e/);
  assert.match(rows[1], /^Gas15\.485 m³164\.750 kWh14\.003,75\s€29,8 t CO₂e/);
  assert.match(rows[2], /^Wasser4\.873 m³–23\.388,00\s€kein Faktor/);
  const action = results.querySelector('.dl-focus a');
  const url = new URL(action.href);
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  const clicked = new URL(action.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.match(clicked.searchParams.get('action'), /^Zähler Strom Hauptzähler prüfen: \+14\s% gegenüber dem Ausgangswert$/);
  assert.equal(clicked.searchParams.get('source'), 'energy-tracker');
  assert.equal(clicked.searchParams.get('area'), 'Strom Hauptzähler');
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('/five-whys/'));
  assert.match(whys.href, /\/de\/tools\/five-whys\/\?problem=/);
  assert.match(doc.querySelector('[data-log-count]').textContent, /^68 Zählerstände von 3 Zählern/);
});

test('readings by hand: the example leaves, a lower reading is refused, a swap counts; Hotel KPIs is read, never written', () => {
  const hotelSaved = { rows: [{ date: '2026-10-05', available: 140, sold: 100 }, { date: '2026-10-06', available: 140, sold: 120 }, { date: '2026-10-07', available: 140, sold: 80 }] };
  const w = load({ lang: 'en', page: true, storage: { 'sc-hotel-kpis': hotelSaved } });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  const form = doc.querySelector('[data-entry]');
  const set = (name, value) => { form.elements[name].value = value; form.elements[name].dispatchEvent(new w.Event('input', { bubbles: true })); };
  const submit = () => form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  form.elements.meter.value = 'm1';
  set('date', '2026-10-05');
  set('value', '1000');
  submit();
  assert.equal(doc.querySelector('.dl-example-note').hidden, true, 'the example left with the first own reading');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 1);
  assert.match(results.querySelector('h2').textContent, /^No use in this period yet/);
  set('date', '2026-10-08');
  set('value', '1300');
  submit();
  set('date', '2026-10-12');
  assert.match(doc.querySelector('[data-reading-hint]').textContent, /^Reading before: 1,300 on 2026-10-08\.$/);
  // Lower than the reading before, without the tick: refused, with the reason.
  set('value', '900');
  submit();
  assert.match(doc.querySelector('[data-entry-status]').textContent, /lower than the one of 2026-10-08 \(1,300\)/);
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 2);
  // A swap: the old meter ended at 1,700, the new one starts at 0. Use: 300 + 400 = 700 kWh over 05.10–11.10.
  form.elements.replaced.checked = true;
  form.elements.replaced.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelector('[data-old-final]').hidden, false);
  set('value', '0');
  set('oldFinal', '1700');
  submit();
  assert.match(results.querySelector('h2').textContent, /^700 kWh · 266 kg CO₂e$/, '700 × 0.38 = 266 kg; no price yet, so no cost (not €0)');
  // Per occupied room from Hotel KPIs: days 05–07 have rooms (300); 300 kWh of use on them → 1.0 kWh per room night.
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Energy per occupied room night1\.0 kWh3 days/.test(s)), stats.join(' | '));
  assert.match(doc.querySelector('[data-hotel-note]').textContent, /3 nights \(2026-10-05 – 2026-10-07\)/);
  assert.match([...doc.querySelectorAll('[data-log] tr')][0].textContent, /new meter.*400 kWh · 4 days · meter replaced/);
  // A price makes the cost: 700 × 0.25 = €175.00.
  const tariff = doc.querySelector('#et-m1-tariff');
  tariff.value = '0.25';
  tariff.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.match(results.querySelector('h2').textContent, /^700 kWh · €175\.00 · 266 kg CO₂e$/);
  flush(w);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-hotel-kpis')), hotelSaved, 'Hotel KPIs is never written');
  const saved = JSON.parse(w.localStorage.getItem('sc-energy-tracker'));
  assert.equal(saved.rows.length, 3);
  assert.equal(saved.meters[0].tariff, '0.25');
  // Damaged saved work never throws.
  const w2 = load({ lang: 'sq', page: true, storage: { 'sc-energy-tracker-sq': { meters: 'x', rows: [{ date: 'bad' }, null], units: { x: 2 } } } });
  assert.equal(w2.document.querySelector('[data-results]').hidden, true);
  assert.equal(w2.document.querySelectorAll('.et-meter').length, 3, 'the default meters come back');
});
