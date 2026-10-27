// Cost of Quality (src/js/cost-of-quality.js): the arithmetic in window.CostOfQualityMath (a period as a month, the cost
// of a line, the totals by PAF category, COPQ and its share of revenue, the cost per unit, the scenario, the Pareto,
// the read-only totals brought in from the Waste Log and Guest Complaints), the three data files, and the page: the
// example on a first visit, typing, bringing in, the hand-offs, the three languages and the texts.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/costOfQuality.json', de: 'src/_data/de/costOfQuality.json', sq: 'src/_data/sq/costOfQuality.json' };
const TODAY = '2026-10-24';
const addDays = (iso, days) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/cost-of-quality.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '');
const strings = (lang) => ({ ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/cost-of-quality.json')[lang] });

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/cost-of-quality/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  if (lang !== 'en') w.UiStrings = strings(lang);
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'cost-of-quality']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.document.addEventListener('click', (event) => { if (event.target.closest('a')) event.preventDefault(); });
  return w;
};
const math = () => load({ page: false }).CostOfQualityMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); };
const saved = (w, key = 'sc-cost-of-quality') => JSON.parse(w.localStorage.getItem(key));
const euros = (text) => Number(String(text).replace(/[^\d]/g, ''));

test('a period as a month: a week is 52/12 of a month, a quarter a third, a year a twelfth', () => {
  const M = math();
  assert.equal(M.monthly(450, 'week'), 1950);
  assert.equal(M.monthly(840, 'week'), 3640);
  assert.equal(M.monthly(100, 'month'), 100);
  assert.equal(M.monthly(4500, 'quarter'), 1500);
  assert.equal(M.monthly(6000, 'year'), 500);
  assert.equal(M.monthly(100, 'fortnight'), 0, 'an unknown period counts nothing');
  assert.equal(M.yearly(450, 'week'), 23400, '450 a week is 52 × 450 a year');
  assert.equal(M.amount('1.234,50'), 1234.5);
  assert.equal(M.amount('4,50'), 4.5);
  assert.equal(M.amount('4.50'), 4.5);
  assert.ok(Number.isNaN(M.amount('-5')), 'a cost is never negative');
  assert.ok(Number.isNaN(M.amount('')));
});

test('the cost of a line: hours × rate (or the default rate), count × cost per event, a fixed amount', () => {
  const M = math();
  assert.equal(M.lineCost({ basis: 'hours', qty: '40', rate: '32' }), 1280);
  assert.equal(M.lineCost({ basis: 'hours', qty: '120', rate: '' }, { hourlyRate: '28' }), 3360, 'hours without a rate use the default');
  assert.equal(M.lineCost({ basis: 'hours', qty: '120', rate: '' }), 0, 'and without a default they count nothing');
  assert.equal(M.lineCost({ basis: 'count', qty: '1800', rate: '4,50' }, { hourlyRate: '28' }), 8100, 'a count never takes the hourly rate');
  assert.equal(M.lineCost({ basis: 'count', qty: '900', rate: '' }, { hourlyRate: '28' }), 0);
  assert.equal(M.lineCost({ basis: 'fixed', amount: '27000', qty: '5', rate: '5' }), 27000);
  assert.equal(M.lineMonthly({ basis: 'fixed', amount: '27000', period: 'quarter' }), 9000);
  assert.equal(M.lineMonthly({ basis: 'hours', qty: '10', rate: '45', period: 'week' }), 1950);
});

test('the example adds up by hand: P 3,730 + A 8,500 + IF 15,940 + EF 27,300 = 55,470 a month', () => {
  const M = math();
  const ex = M.fromExample(read(DATA.en).example);
  const opt = { hourlyRate: ex.setup.hourlyRate };
  // Prevention: 40 h × 32 = 1,280; 6,000 a year / 12 = 500; 10 h × 45 = 450 a week × 52/12 = 1,950.
  // Appraisal: 120 h × 28 = 3,360; 30 h × 28 = 840 a week × 52/12 = 3,640; 4,500 a quarter / 3 = 1,500.
  // Internal failure: 1,800 × 4.50 = 8,100; 30 h × 28 = 840 a week = 3,640; 4,200.
  // External failure: 900 × 12 = 10,800; 300 × 18 = 5,400; 60 h × 35 = 2,100; 27,000 a quarter = 9,000.
  const t = M.totals(ex.lines, opt);
  assert.deepEqual(plain(t.month), { prevention: 3730, appraisal: 8500, internal: 15940, external: 27300 });
  assert.equal(t.coq, 55470);
  assert.equal(t.coqYear, 665640);
  assert.equal(t.copq, 43240);
  assert.equal(t.copqYear, 518880);
  assert.equal(t.copqWide, 51740, 'with appraisal: 8,500 + 43,240');
  assert.equal(t.conformance, 12230);
  close(t.ratio, 43240 / 12230, 'failure : prevention and appraisal ≈ 3.54 : 1');
  close(t.shares.external, 27300 / 55470, 'share of external failure');
  close(M.revenueShare(t.copq, ex.setup.revenue), 43240 / 1800000, 'COPQ is 2.40 % of 1.8 M revenue');
  close(M.revenueShare(t.copqWide, '1800000'), 51740 / 1800000, 'and 2.87 % with appraisal');
  assert.equal(M.revenueShare(t.copq, ''), null);
  close(M.perUnit(t.coq, ex.setup.volume), 0.9245, 'cost of quality per order: 55,470 / 60,000');
  close(M.perUnit(t.copq, '60000'), 43240 / 60000, 'cost of poor quality per order');
  assert.equal(M.perUnit(t.coq, '0'), null);
  assert.equal(M.totals([]).ratio, null);
});

test('the scenario: net saving per year = cut × (IF + EF) × 12 − invest × 12', () => {
  const M = math();
  const ex = M.fromExample(read(DATA.en).example);
  const t = M.totals(ex.lines, { hourlyRate: '28' });
  const s = M.scenario(t, 0.3, 2000);
  assert.equal(s.failureSavedYear, 0.3 * 43240 * 12);
  close(s.failureSavedYear, 155664, '30 % × 43,240 × 12');
  assert.equal(s.addedYear, 24000, '2,000 × 12');
  close(s.netYear, 131664, '155,664 − 24,000');
  close(s.netMonth, 10972, 'a month');
  close(s.coqAfter, 3730 + 2000 + 8500 + 15940 * 0.7 + 27300 * 0.7, 'COQ after: 44,498');
  close(s.coqAfter, 44498, 'COQ after');
  close(s.ratioAfter, 30268 / 14230, 'ratio after');
  close(s.breakEven, 2000 / 43240, 'the cut that pays for 2,000 a month: 4.6 %');
  assert.ok(M.scenario(t, 0.01, 2000).netYear < 0, 'a small cut does not pay for the extra prevention');
  assert.equal(M.scenario(t, 1.5, -10).cut, 1, 'the cut stays within 0 to 100 %');
  assert.equal(M.scenario(t, 1.5, -10).invest, 0);
});

test('the Pareto of the items: largest first, ties in list order, shares and running shares', () => {
  const M = math();
  const ex = M.fromExample(read(DATA.en).example);
  const all = M.pareto(ex.lines, { hourlyRate: '28' });
  assert.equal(all.length, 13);
  assert.deepEqual(all.slice(0, 3).map((item) => Math.round(item.value)), [10800, 9000, 8100]);
  assert.equal(all[0].line.name, 'Returns processing (wrong or damaged item)');
  assert.deepEqual(all.filter((item) => item.value === 3640).map((item) => item.line.name), ['Cycle counts', 'Rework of damaged packaging']);
  close(all.at(-1).cum, 1, 'the running share ends at 100 %');
  close(all[0].share, 10800 / 55470, 'share of all quality costs');
  const failures = M.pareto(ex.lines, { hourlyRate: '28' }, M.FAILURE);
  assert.equal(failures.length, 7);
  close(failures[0].share, 10800 / 43240, 'returns are a quarter of the cost of poor quality');
});

test('bring in: the Waste Log and guest compensation of the last 30 days, read defensively', () => {
  const M = math();
  assert.equal(M.inLast(TODAY, TODAY), true);
  assert.equal(M.inLast(addDays(TODAY, -29), TODAY), true, 'today and the 29 days before');
  assert.equal(M.inLast(addDays(TODAY, -30), TODAY), false);
  assert.equal(M.inLast(addDays(TODAY, 1), TODAY), false, 'not the future');
  // Rows in the Waste Log's own format (waste-log.js: qty and cost per unit). Until 27 October 2026 this reader looked
  // for quantity and unitCost, which the Waste Log never wrote, and brought in nothing (audit finding T-05); the
  // hand-off itself is followed through both pages in tests/handoffs-real.test.cjs.
  const waste = { rows: [
    { date: TODAY, qty: 10, cost: 2.5 },
    { date: addDays(TODAY, -29), qty: '4', cost: '10' },
    { date: addDays(TODAY, -30), qty: 100, cost: 100 },
    { date: TODAY, quantity: 5, unitCost: 5 },
    'not a row',
  ] };
  assert.deepEqual(plain(M.wasteTotal(waste, TODAY)), { total: 65, count: 2, rows: 5 }, 'a row in another shape counts nothing');
  assert.equal(M.wasteTotal(null, TODAY), null, 'no log');
  assert.equal(M.wasteTotal({ entries: [] }, TODAY), null, 'a different shape');
  assert.deepEqual(plain(M.wasteTotal([{ date: TODAY, qty: 2, cost: 3 }], TODAY)), { total: 6, count: 1, rows: 1 }, 'a bare array of rows');
  const complaints = { rows: [
    { date: TODAY, comp: 'refund', value: 129 },
    { date: addDays(TODAY, -3), comp: 'apology', value: 0 },
    { date: addDays(TODAY, -40), comp: 'voucher', value: 18 },
    { date: addDays(TODAY, -2), comp: 'discount', value: '30' },
  ] };
  assert.deepEqual(plain(M.complaintsTotal(complaints, TODAY)), { total: 159, count: 2, rows: 4 });
  // The same source replaces its line; a second import does not count twice.
  const lines = M.cleanLines([{ cat: 'internal', name: 'Rework', basis: 'fixed', amount: '100' }]);
  M.mergeImport(lines, 'waste-log', 'internal', 'Waste', 65);
  M.mergeImport(lines, 'waste-log', 'internal', 'Waste', 70);
  assert.equal(lines.length, 2);
  assert.deepEqual([lines[1].amount, lines[1].period, lines[1].basis, lines[1].source], ['70', 'month', 'fixed', 'waste-log']);
});

test('saved lines are cleaned: unknown keys fall back, ids stay unique, at most 80 lines', () => {
  const M = math();
  const [line] = plain(M.cleanLines([{ cat: 'nope', basis: 'magic', period: 'decade', qty: 5, name: 7, source: 'x' }]));
  assert.deepEqual([line.cat, line.basis, line.period, line.qty, line.name, line.source], ['prevention', 'fixed', 'month', '5', '', '']);
  const twins = M.cleanLines([{ id: 'abc-1' }, { id: 'abc-1' }]);
  assert.notEqual(twins[0].id, twins[1].id);
  assert.equal(M.cleanLines(Array.from({ length: 90 }, () => ({}))).length, 80);
  assert.deepEqual(plain(M.cleanLines('broken')), []);
});

test('the data files: the same keys in English, German and Albanian, the storage keys, presets and the example', () => {
  const shape = (value) => (Array.isArray(value) ? (value.length && typeof value[0] === 'object' ? [shape(value[0])] : 'array') : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  const files = Object.fromEntries(Object.entries(DATA).map(([lang, file]) => [lang, read(file)]));
  assert.deepEqual(shape(files.de), shape(files.en));
  assert.deepEqual(shape(files.sq), shape(files.en));
  assert.equal(files.en.storageKey, 'sc-cost-of-quality');
  assert.equal(files.de.storageKey, 'sc-cost-of-quality-de');
  assert.equal(files.sq.storageKey, 'sc-cost-of-quality-sq');
  const M = math();
  for (const [lang, d] of Object.entries(files)) {
    assert.deepEqual(d.categories.map((c) => c.key), plain(M.CATS), lang);
    assert.deepEqual(d.bases.map((b) => b.key), plain(M.BASES), lang);
    assert.deepEqual(d.periods.map((p) => p.key), plain(M.PERIODS), lang);
    assert.deepEqual(d.sectors.map((s) => s.key), ['warehouse', 'hotel', 'delivery'], lang);
    d.sectors.forEach((s) => M.CATS.forEach((cat) => {
      assert.ok(s.presets[cat].length >= 3, `${lang} ${s.key} ${cat}`);
      assert.ok(s.presets[cat].every((p) => M.BASES.includes(p.basis) && p.name), `${lang} ${s.key} ${cat}`);
    }));
    M.CATS.forEach((cat) => assert.equal(d.advice[cat].moves.length, 3, `${lang} advice ${cat}`));
    // Every language's example is the same warehouse with the same totals.
    const ex = M.fromExample(d.example);
    const t = M.totals(ex.lines, { hourlyRate: ex.setup.hourlyRate });
    assert.equal(t.coq, 55470, lang);
    assert.equal(t.copq, 43240, lang);
    assert.deepEqual(ex.lines.map((l) => [l.cat, l.basis, l.period]), M.fromExample(files.en.example).lines.map((l) => [l.cat, l.basis, l.period]), lang);
    // The example's items are presets of the warehouse, so the list offers them.
    const presets = d.sectors[0].presets;
    assert.ok(ex.lines.every((l) => presets[l.cat].some((p) => p.name === l.name)), `${lang}: example items are presets`);
  }
});

test('a first visit opens on the example: the headline, the figures, the charts', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(d.querySelector('.dl-example-note').hidden, false);
  assert.match(results.querySelector('h2').textContent, /^Quality costs €55,470 a month; €43,240 of it is the cost of poor quality$/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => [s.querySelector('.dl-stat-label').textContent, s.querySelector('.dl-stat-value').textContent]);
  assert.deepEqual(stats, [
    ['Cost of quality', '€55,470'],
    ['Cost of poor quality', '€43,240'],
    ['COPQ share of revenue', '2.4%'],
    ['Failure : prevention and appraisal', '3.5 : 1'],
    ['Per order', '€0.92'],
    ['Net saving per year', '€131,664'],
    ['Cost of quality after', '€44,498'],
    ['Failure : prevention and appraisal after', '2.1 : 1'],
    ['Break-even cut', '4.6%'],
  ]);
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Returns processing \(wrong or damaged item\) · €10,800 a month · External failure$/);
  assert.ok(results.querySelectorAll('svg').length >= 2, 'the split and the Pareto as charts');
  assert.match(results.querySelector('.cq-sums').textContent, /30% × €43,240 × 12 = €155,664/);
  assert.match(results.querySelector('.cq-sums').textContent, /€2,000 × 12 = €24,000/);
  assert.match(results.querySelector('.cq-sums').textContent, /€155,664 − €24,000 = €131,664/);
  assert.equal(d.querySelectorAll('.cq-line').length, 13);
  assert.equal(d.querySelector('[data-group-total="external"]').textContent, '€27,300 a month');
  const weekly = [...d.querySelectorAll('.cq-line')].find((card) => card.querySelector('input').value === 'Standard work and quality planning');
  assert.equal(weekly.querySelector('.cq-line-out').textContent, '€450 a week = €1,950 a month · €23,400 a year');
  // The printed summary is ready and the page prints it.
  assert.ok(d.documentElement.classList.contains('cq-page'));
  assert.match(d.querySelector('[data-print]').textContent, /Key figures.*€665,640/s);
  // The inputs show the example.
  assert.equal(d.querySelector('#cq-revenue').value, '1800000');
  assert.equal(d.querySelector('#cq-cut-range').value, '30');
  assert.equal(d.querySelector('[data-unit-label]').textContent, 'orders');
});

test('typing changes the result: the default rate, a line, the scenario; the example note goes', () => {
  const w = load();
  const d = w.document;
  const h2 = () => d.querySelector('[data-results] h2').textContent;
  type(w, d.querySelector('#cq-rate'), '30');
  // 120 h + (30 h a week × 52/12) twice, at 2 € more: 240 + 260 + 260.
  assert.match(h2(), /€56,230 a month/);
  assert.equal(d.querySelector('.dl-example-note').hidden, true);
  assert.equal(saved(w).example, false);
  const chargebacks = [...d.querySelectorAll('.cq-line')].find((card) => /chargebacks/.test(card.querySelector('input').value));
  type(w, chargebacks.querySelector('[data-f="amount"]'), '0');
  assert.match(h2(), /€47,230 a month; €34,500/);
  assert.match(chargebacks.querySelector('.cq-line-out').textContent, /No cost yet/);
  type(w, d.querySelector('#cq-cut'), '50');
  assert.equal(d.querySelector('#cq-cut-range').value, '50');
  const sums = d.querySelector('.cq-sums').textContent;
  assert.match(sums, /50% × €34,500 × 12 = €207,000/);
  const basis = chargebacks.querySelector('[data-f="basis"]');
  basis.value = 'count';
  basis.dispatchEvent(new w.Event('change', { bubbles: true }));
  const card = d.querySelector(`[data-line="${chargebacks.dataset.line}"]`);
  assert.ok(card.querySelector('[data-f="qty"]') && card.querySelector('[data-f="rate"]'), 'a count shows count and cost per event');
  assert.equal(saved(w).lines.find((l) => l.id === chargebacks.dataset.line).basis, 'count');
});

test('adding and removing lines, with undo, and a preset bringing its basis', () => {
  const w = load({ storage: { 'sc-cost-of-quality': { setup: { sector: 'hotel', revenue: '', volume: '', hourlyRate: '25' }, lines: [], scenario: { cut: '30', invest: '' }, example: false } } });
  const d = w.document;
  assert.equal(d.querySelector('[data-results]').hidden, true);
  assert.equal(d.querySelector('[data-empty]').hidden, false);
  click(w, d.querySelector('[data-add="internal"]'));
  const card = d.querySelector('.cq-line');
  assert.ok(card);
  assert.equal(card.querySelector('[data-f="name"]').getAttribute('list'), 'cq-presets-hotel-internal');
  assert.equal(card.querySelector('[data-f="basis"]').value, 'count', 'the first preset of the category sets the basis');
  type(w, card.querySelector('[data-f="name"]'), 'Kitchen food waste and scrap');
  const fixed = d.querySelector('.cq-line');
  assert.equal(fixed.querySelector('[data-f="basis"]').value, 'fixed', 'the preset brings its own basis');
  type(w, fixed.querySelector('[data-f="amount"]'), '900');
  assert.match(d.querySelector('[data-results] h2').textContent, /€900 a month; €900/);
  assert.match(d.querySelector('[data-results]').textContent, /No costs yet for: Prevention, Appraisal, External failure/);
  click(w, fixed.querySelector('[data-remove]'));
  assert.equal(d.querySelectorAll('.cq-line').length, 0);
  click(w, d.querySelector('[data-status] .dl-undo'));
  assert.equal(d.querySelectorAll('.cq-line').length, 1);
  assert.equal(saved(w).lines.length, 1);
});

test('bring in from this browser adds one line each, replaces it the second time and never writes the other keys', () => {
  const waste = { rows: [{ date: TODAY, qty: 10, cost: 2.5 }, { date: addDays(TODAY, -5), qty: 4, cost: 10 }] };
  const complaints = { rows: [{ date: TODAY, comp: 'refund', value: 129 }, { date: addDays(TODAY, -60), comp: 'refund', value: 129 }] };
  const w = load({ storage: { 'sc-waste-log': waste, 'sc-guest-complaints': complaints } });
  const d = w.document;
  const before = { w: w.localStorage.getItem('sc-waste-log'), g: w.localStorage.getItem('sc-guest-complaints') };
  click(w, d.querySelector('[data-import]'));
  assert.equal(d.querySelectorAll('.cq-line').length, 15);
  assert.match(d.querySelector('[data-status]').textContent, /Waste Log: €65 from 2 entries · Guest Complaints: €129 of compensation from 1 complaints/);
  assert.match(d.querySelector('[data-results] h2').textContent, /€55,664 a month; €43,434/);
  const lines = saved(w).lines.filter((l) => l.source);
  assert.deepEqual(lines.map((l) => [l.source, l.cat, l.amount]), [['waste-log', 'internal', '65'], ['guest-complaints', 'external', '129']]);
  click(w, d.querySelector('[data-import]'));
  assert.equal(d.querySelectorAll('.cq-line').length, 15, 'the second time replaces');
  assert.equal(w.localStorage.getItem('sc-waste-log'), before.w);
  assert.equal(w.localStorage.getItem('sc-guest-complaints'), before.g);
  // Nothing to bring in: a note, no line.
  const empty = load();
  click(empty, empty.document.querySelector('[data-import]'));
  assert.equal(empty.document.querySelectorAll('.cq-line').length, 13);
  assert.match(empty.document.querySelector('[data-status]').textContent, /Nothing to bring in/);
  // The German page reads the German keys only.
  const de = load({ lang: 'de', storage: { 'sc-waste-log': waste, 'sc-waste-log-de': { rows: [{ date: TODAY, qty: 1, cost: 7 }] } } });
  click(de, de.document.querySelector('[data-import]'));
  assert.deepEqual(JSON.parse(de.localStorage.getItem('sc-cost-of-quality-de')).lines.filter((l) => l.source).map((l) => l.amount), ['7']);
});

test('hand-offs: the biggest failure item to the Action Tracker, the items to Pareto, the problem to 5 Whys', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  const tracker = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Add to actions');
  click(w, tracker);
  const url = new URL(tracker.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('action'), 'Cut Returns processing (wrong or damaged item): €10,800 a month of poor quality');
  assert.equal(url.searchParams.get('source'), 'cost-of-quality');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('detail'), /is 25% of the cost of poor quality: €10,800 a month, €129,600 a year/);
  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent));
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.measure, 'value');
  assert.equal(handoff.rows.length, 13);
  assert.deepEqual(handoff.rows[0], ['Returns processing (wrong or damaged item)', 'External failure', '10800']);
  assert.deepEqual(handoff.map, { category: 0, count: -1, value: 2, date: -1, filter: 1 });
  const whys = [...results.querySelectorAll('a')].find((a) => /5 Whys/.test(a.textContent));
  assert.equal(new URL(whys.href).searchParams.get('problem'), 'Returns processing (wrong or damaged item) costs €10,800 a month of poor quality');
});

test('German and Albanian pages: the example in that language, links keep /de/ and /sq/, the texts are translated', () => {
  for (const lang of ['de', 'sq']) {
    const w = load({ lang });
    const d = w.document;
    const results = d.querySelector('[data-results]');
    assert.equal(results.hidden, false);
    const h2 = results.querySelector('h2').textContent;
    assert.match(h2, lang === 'de' ? /^Qualität kostet 55\.470\s€ pro Monat, davon 43\.240\s€ Kosten schlechter Qualität$/ : /^Cilësia kushton 55\.470\s€ në muaj; 43\.240\s€ prej tyre janë kosto e cilësisë së dobët$/);
    const tracker = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
    click(w, tracker);
    assert.equal(new URL(tracker.href).pathname, `/${lang}/tools/action-tracker/`);
    assert.equal(new URL([...results.querySelectorAll('a')].find((a) => /five-whys/.test(a.href)).href).pathname, `/${lang}/tools/five-whys/`);
    assert.equal(new URL([...results.querySelectorAll('a')].find((a) => /\/pareto\//.test(a.href)).href).pathname, `/${lang}/tools/pareto/`);
    assert.doesNotMatch(results.textContent, /a month|Cost of quality|Failure costs saved|Top items/);
    assert.equal(euros(d.querySelector('[data-group-total="prevention"]').textContent), 3730);
    type(w, d.querySelector('#cq-invest'), '1000');
    assert.equal(JSON.parse(w.localStorage.getItem(`sc-cost-of-quality-${lang}`)).scenario.invest, '1000');
    assert.equal(w.localStorage.getItem('sc-cost-of-quality'), null, `${lang}: the English work is not touched`);
  }
});

test('the CSV has a header row, every line, the category totals and COQ and COPQ', async () => {
  const w = load();
  const d = w.document;
  let blob = null;
  w.URL.createObjectURL = (b) => { blob = b; return 'blob:test'; };
  click(w, d.querySelector('[data-csv]'));
  assert.ok(blob, 'a file is offered');
  const text = typeof blob.text === 'function' ? await blob.text() : await new Promise((resolve) => { const r = new w.FileReader(); r.onload = () => resolve(r.result); r.readAsText(blob); });
  const lines = text.replace(/^\ufeff/, '').trim().split(/\r?\n/);
  assert.match(lines[0], /^Category.Cost item.Basis.Quantity.Rate \(€\).Amount \(€\).Period.Cost per period \(€\).€ per month.€ per year$/);
  assert.equal(lines.length, 1 + 13 + 4 + 2);
  assert.match(lines.find((l) => /Cycle counts/.test(l)), /Appraisal.Cycle counts.Hours × hourly rate.30.28..Per week.840.3640.43680/);
  assert.match(lines.at(-2), /^Cost of quality.P \+ A \+ IF \+ EF.*55470.665640$/);
  assert.match(lines.at(-1), /^Cost of poor quality.IF \+ EF.*43240.518880$/);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const own = read('src/_data/i18n-parts/cost-of-quality.json');
  const njk = fs.readFileSync('src/_includes/partials/cost-of-quality.njk', 'utf8');
  const js = fs.readFileSync('src/js/cost-of-quality.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*["']((?:[^"'\\]|\\.)*)["']\s*\|\s*t\(lang\)/g)].map((m) => m[1]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 100);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (own[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(own[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/cost-of-quality.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/cost-of-quality/', '/de/tools/cost-of-quality/', '/sq/tools/cost-of-quality/']);
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].name), ['Cost of Quality', 'Qualitätskosten', 'Kostoja e cilësisë']);
  for (const [file, lang] of [['src/tools/cost-of-quality.njk', 'en'], ['src/de/tools/cost-of-quality.njk', 'de'], ['src/sq/tools/cost-of-quality.njk', 'sq']]) {
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, lang === 'en' ? /\{% set cfg = costOfQuality %\}/ : new RegExp(`\\{% set cfg = ${lang}\\.costOfQuality %\\}`));
    const description = page.match(/^description: "(.*)"$/m)[1];
    assert.ok(description.length <= 160, `${file}: ${description.length}`);
  }
});

test('the stylesheet part uses its prefix and the theme variables only, and prints only on this page', () => {
  const css = fs.readFileSync('src/css/57-cost-of-quality.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /--red|--gold/);
  const classes = [...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]).filter((name) => !/^(dl|ck|kicker|form-note|button|is-|field|optional|num)/.test(name));
  assert.ok(classes.every((name) => name.startsWith('cq-')), classes.filter((name) => !name.startsWith('cq-')).join(', '));
  assert.match(css, /@media print/);
  assert.equal((css.match(/main > :not/g) || []).length, (css.match(/html\.cq-page main > :not/g) || []).length, 'the print rule is scoped to html.cq-page');
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
});
