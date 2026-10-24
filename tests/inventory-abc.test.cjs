// ABC/XYZ Inventory (src/js/inventory-abc.js): the arithmetic in window.InventoryAbcMath against hand-worked values (ABC
// with the crossing rule and ties, the CV with the sample standard deviation, the XYZ cut-offs, SKUs without demand,
// the inverse normal, safety stock, reorder point and EOQ, the cycle counts), the reading of pasted tables, the three
// data files and their example, and the page itself: the example on a first visit, a paste, and the hand-offs to Pareto
// 80/20 and the Action Tracker in English and German.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const near = (a, b, tolerance, message) => assert.ok(Math.abs(a - b) <= tolerance, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/inventoryAbc.json', de: 'src/_data/de/inventoryAbc.json', sq: 'src/_data/sq/inventoryAbc.json' };
const data = { en: read(DATA.en), de: read(DATA.de), sq: read(DATA.sq) };
const part = read('src/_data/i18n-parts/inventory-abc.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });
const TODAY = '2026-10-24';

const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/inventory-abc.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body><main><h1>ABC/XYZ</h1>${body.replace(/<script src=[^>]*><\/script>/g, '')}</main></body></html>`;
};
const load = ({ lang = 'en', page = false, storage = {}, now = `${TODAY}T09:30:00Z` } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/inventory-abc/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  // Downloads are recorded instead of followed (jsdom does not navigate).
  w.downloads = [];
  w.TextEncoder = TextEncoder; // jsdom has none; the Excel file needs it.
  w.HTMLAnchorElement.prototype.click = function () { w.downloads.push(this.download); };
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'import-map', 'chart-kit', 'actions-store', 'inventory-abc']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const M = load().InventoryAbcMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));

test('ABC: sorted by value, the SKU that crosses a threshold keeps the class it starts in', () => {
  // 70 + 20 + 6 + 4 = 100. Before each: 0 % (A), 70 % (A: it starts below 80 % and ends at 90 %), 90 % (B: ends at 96 %), 96 % (C).
  const out = plain(M.abc([{ key: 'd', value: 4 }, { key: 'b', value: 20 }, { key: 'a', value: 70 }, { key: 'c', value: 6 }]));
  assert.deepEqual(out.map((item) => item.key), ['a', 'b', 'c', 'd']);
  assert.deepEqual(out.map((item) => item.cls), ['A', 'A', 'B', 'C']);
  near(out[1].before, 0.7, 1e-12, 'b starts at 70 %');
  near(out[1].cumulative, 0.9, 1e-12, 'and ends at 90 %');
  near(out[3].share, 0.04, 1e-12, 'share of d');
  // Exactly on the threshold: 50 + 30 = 80 %, so the third SKU starts at 80 % and is B, not A.
  const exact = plain(M.abc([{ key: 'x', value: 50 }, { key: 'y', value: 30 }, { key: 'z', value: 20 }]));
  assert.deepEqual(exact.map((item) => item.cls), ['A', 'A', 'B']);
  // Other thresholds: A up to 70 %, B up to 90 %.
  assert.deepEqual(plain(M.abc([{ key: 'a', value: 70 }, { key: 'b', value: 20 }, { key: 'c', value: 6 }, { key: 'd', value: 4 }], { a: 0.7, b: 0.9 })).map((i) => i.cls), ['A', 'B', 'C', 'C']);
});

test('ABC: equal values share a class and are listed by SKU code; zero value is C', () => {
  // 50, 30, 10, 5, 5: the first 5 starts at 90 % (B), the second at 95 % (C by itself) but ties with the first, so B.
  const out = plain(M.abc([{ key: 'e', value: 5 }, { key: 'd', value: 5 }, { key: 'a', value: 50 }, { key: 'b', value: 30 }, { key: 'c', value: 10 }]));
  assert.deepEqual(out.map((item) => [item.key, item.cls]), [['a', 'A'], ['b', 'A'], ['c', 'B'], ['d', 'B'], ['e', 'B']]);
  const zero = plain(M.abc([{ key: 'a', value: 10 }, { key: 'b', value: 0 }]));
  assert.deepEqual(zero.map((item) => item.cls), ['A', 'C']);
  assert.deepEqual(plain(M.abc([{ key: 'a', value: 0 }, { key: 'b', value: 0 }])).map((item) => item.cls), ['C', 'C'], 'no value at all');
});

test('XYZ: CV = σ ÷ μ with the sample standard deviation, the cut-offs and the SKUs without demand', () => {
  // 10, 12, 8, 10: μ = 10, Σ(x − μ)² = 0 + 4 + 4 + 0 = 8, s² = 8 ÷ 3, s = 1.63299, CV = 0.163299.
  near(M.mean([10, 12, 8, 10]), 10, 1e-12, 'mean');
  near(M.sampleSd([10, 12, 8, 10]), Math.sqrt(8 / 3), 1e-12, 'sample σ, not population (which would be √2)');
  near(M.cv([10, 12, 8, 10]), Math.sqrt(8 / 3) / 10, 1e-12, 'CV');
  // 4, 8, 6, 2: μ = 5, Σ(x − μ)² = 1 + 9 + 1 + 9 = 20, s = √(20 ÷ 3) = 2.58199, CV = 0.5164: just above X.
  near(M.cv([4, 8, 6, 2]), Math.sqrt(20 / 3) / 5, 1e-12, 'CV 0.5164');
  assert.equal(M.xyzClass(M.cv([4, 8, 6, 2])), 'Y');
  // One spike in four periods: 0, 0, 30, 0: μ = 7.5, Σ(x − μ)² = 3 × 56.25 + 506.25 = 675, s = √225 = 15, CV = 2.
  near(M.cv([0, 0, 30, 0]), 2, 1e-12, 'periods without demand count as 0');
  assert.equal(M.xyzClass(2), 'Z');
  // The cut-offs are inclusive: a CV on the line belongs to the steadier class.
  assert.equal(M.xyzClass(0.5), 'X');
  assert.equal(M.xyzClass(0.5000001), 'Y');
  assert.equal(M.xyzClass(1), 'Y');
  assert.equal(M.xyzClass(1.0000001), 'Z');
  assert.equal(M.xyzClass(0.3, { x: 0.25, y: 0.5 }), 'Y', 'other cut-offs');
  // No demand: no CV and no XYZ class.
  assert.equal(M.cv([0, 0, 0, 0]), null);
  assert.equal(M.xyzClass(null), null);
  assert.equal(M.cv([5]), null, 'one period has no spread');
  assert.equal(M.sampleSd([5]), 0);
});

test('the inverse normal gives the z of the usual service levels', () => {
  for (const [p, z] of [[0.9, 1.2816], [0.95, 1.6449], [0.975, 1.9600], [0.98, 2.0537], [0.99, 2.3263], [0.995, 2.5758], [0.999, 3.0902]]) near(M.normInv(p), z, 5e-5, `z(${p})`);
  near(M.normInv(0.5), 0, 1e-12, 'z(50 %)');
  near(M.normInv(0.05), -1.6449, 5e-5, 'symmetric');
  assert.ok(Number.isNaN(M.normInv(1)) && Number.isNaN(M.normInv(0)));
});

test('safety stock, reorder point, EOQ and the order quantity, worked by hand', () => {
  // Fixed lead time: SS = z × σ_d × √LT = 2 × 3 × √4 = 12; ROP = d̄ × LT + SS = 5 × 4 + 12 = 32.
  assert.equal(M.safetyStock({ z: 2, sdDay: 3, meanDay: 5, lt: 4 }), 12);
  assert.equal(M.reorderPoint({ meanDay: 5, lt: 4, ss: 12 }), 32);
  // Varying lead time: SS = z × √(LT σ_d² + d̄² σ_LT²) = 2 × √(4 × 9 + 25 × 1) = 2 × √61.
  near(M.safetyStock({ z: 2, sdDay: 3, meanDay: 5, lt: 4, ltSd: 1 }), 2 * Math.sqrt(61), 1e-12, 'with σ_LT');
  // Per day from per week: μ = 70, σ = 14 a week → d̄ = 10, σ_d = 14 ÷ √7.
  const day = M.perDay(70, 14, 7);
  near(day.mean, 10, 1e-12, 'd̄');
  near(day.sd, 14 / Math.sqrt(7), 1e-12, 'σ_d');
  // EOQ = √(2 D S ÷ H) = √(2 × 1000 × 40 ÷ (0.25 × 8)) = √40000 = 200.
  near(M.eoq({ annual: 1000, orderCost: 40, unitCost: 8, holdingRate: 0.25 }), 200, 1e-9, 'EOQ');
  assert.equal(M.eoq({ annual: 1000, orderCost: 0, unitCost: 8, holdingRate: 0.25 }), null, 'no order cost, no EOQ');
  // Order: the smallest multiple of the EOQ that lifts the stock above the ROP; without one, the gap rounded up.
  assert.equal(M.orderQuantity({ stock: 50, rop: 93.03, eoq: 200 }), 200);
  assert.equal(M.orderQuantity({ stock: 50, rop: 260, eoq: 200 }), 400);
  assert.equal(M.orderQuantity({ stock: 50, rop: 93.03, eoq: null }), 44);
  assert.equal(M.orderQuantity({ stock: 100, rop: 93.03, eoq: 200 }), 0, 'not below');
});

test('one SKU worked out: weekly demand 84, 56, 84, 56, 70 at 95 % with a lead time of 7 days', () => {
  const s = plain(M.settingsOf({ unit: 'week', service: '95', a: '80', b: '95', x: '0.5', y: '1', leadTime: '14', ltSd: '0', orderCost: '40', holding: '25', countA: '12', countB: '4', countC: '1' }, data.en.defaults));
  assert.equal(s.days, 7);
  assert.equal(s.perYear, 52);
  near(s.z, 1.644854, 1e-6, 'z');
  assert.deepEqual(s.fixed, []);
  // μ = 70, deviations ±14 four times: s² = 4 × 196 ÷ 4 = 196, σ = 14 a week, σ_d = 14 ÷ √7, d̄ = 10.
  // SS = z × (14 ÷ √7) × √7 = 14 z = 23.028; ROP = 10 × 7 + 23.028 = 93.028.
  // D = 70 × 52 = 3640; value = 36,400; EOQ = √(2 × 3640 × 40 ÷ 2.5) = √116480 = 341.29; order 341.
  const item = plain(M.workOut({ sku: 'T-1', name: 'Test', cost: 10, lt: 7, ltSd: null, stock: 90, picks: null, demand: [84, 56, 84, 56, 70] }, s));
  near(item.mean, 70, 1e-12, 'μ');
  near(item.sd, 14, 1e-12, 'σ');
  near(item.cv, 0.2, 1e-12, 'CV');
  assert.equal(item.xyz, 'X');
  near(item.annual, 3640, 1e-9, 'D');
  near(item.value, 36400, 1e-9, 'value');
  near(item.ss, 14 * s.z, 1e-9, 'SS');
  near(item.rop, 70 + 14 * s.z, 1e-9, 'ROP');
  near(item.eoq, Math.sqrt(116480), 1e-9, 'EOQ');
  assert.equal(item.below, true, '90 < 93.03');
  assert.equal(item.order, 341);
  assert.equal(item.ltDefault, false);
  // With σ_LT = 2 days: SS = z × √(7 × 28 + 100 × 4) = z × √596.
  near(M.workOut({ sku: 'T-2', cost: 10, lt: 7, ltSd: 2, stock: null, demand: [84, 56, 84, 56, 70] }, s).ss, s.z * Math.sqrt(596), 1e-9, 'SS with σ_LT');
  // No lead time of its own: the default of 14 days.
  const fallback = M.workOut({ sku: 'T-3', cost: 10, lt: null, ltSd: null, stock: 500, demand: [84, 56, 84, 56, 70] }, s);
  assert.equal(fallback.lt, 14);
  assert.equal(fallback.ltDefault, true);
  assert.equal(fallback.below, false);
  // Months are a twelfth of 365 days.
  const monthly = M.settingsOf({ unit: 'month' }, data.en.defaults);
  near(monthly.days, 365 / 12, 1e-12, 'days per month');
  assert.equal(monthly.perYear, 12);
});

test('settings: typed values win, a wrong one falls back to its default and is named', () => {
  const d = data.en.defaults;
  const s = M.settingsOf({ a: '70', b: '60', x: '0,25', y: '0.5', service: '120', countA: '24' }, d);
  assert.equal(s.a, 0.7);
  assert.equal(s.b, 0.95, 'B must be above A');
  assert.equal(s.x, 0.25, 'a decimal comma is read');
  assert.equal(s.y, 0.5);
  assert.equal(s.service, 0.95, 'a service level of 120 % falls back');
  assert.equal(s.freq.A, 24);
  assert.deepEqual([...s.fixed].sort(), ['b', 'service']);
  assert.equal(M.settingsOf({ orderCost: '' }, d).orderCost, 0, 'an emptied order cost turns the EOQ off');
  assert.equal(M.settingsOf({}, d).orderCost, 40);
});

test('cycle counts: SKUs per class × counts per year, and per week', () => {
  const c = plain(M.cycleCounts({ A: 10, B: 20, C: 70 }, { A: 12, B: 4, C: 1 }));
  assert.deepEqual(c.byClass, { A: 120, B: 80, C: 70 });
  assert.equal(c.perYear, 270);
  near(c.perWeek, 270 / 52, 1e-12, 'per week');
  near(c.perMonth, 22.5, 1e-12, 'per month');
});

test('the example: 60 SKUs over 12 months, a long tail, the matrix adds up to every SKU', () => {
  const s = M.settingsOf({ unit: 'month' }, data.en.defaults);
  const skus = M.exampleSkus(data.en.example.rows, TODAY);
  assert.equal(skus.length, 60);
  assert.ok(skus.every((sku) => sku.demand.length === 12));
  // Laid on the last twelve whole months: November 2025 to October 2026 would include the current month; it ends in September.
  const months = M.exampleMonths(TODAY);
  assert.equal(months[0].iso, '2025-10-01');
  assert.equal(months.at(-1).iso, '2026-09-01');
  assert.equal(skus[0].demand[0], data.en.example.rows[0].demand[9], 'October first');
  const r = M.analyse(skus, s);
  const matrix = Object.fromEntries(M.CELLS.map((cell) => [cell, r.matrix[cell].n]));
  assert.deepEqual(matrix, { AX: 12, AY: 2, AZ: 1, BX: 13, BY: 2, BZ: 2, CX: 9, CY: 5, CZ: 12 });
  assert.equal(r.noDemand.length, 2);
  assert.equal(Object.values(matrix).reduce((a, b) => a + b, 0) + r.noDemand.length, skus.length, 'every SKU once');
  assert.deepEqual(plain(r.counts), { A: 15, B: 17, C: 28 });
  assert.equal(r.counts.A + r.counts.B + r.counts.C, 60);
  near(r.shares.A.valueShare + r.shares.B.valueShare + r.shares.C.valueShare, 1, 1e-12, 'value shares add to 1');
  near(r.items.at(-1).cumulative, 1, 1e-12, 'cumulative ends at 100 %');
  assert.ok(r.shares.A.skuShare <= 0.3 && r.shares.A.valueShare >= 0.78, 'a long tail: a quarter of the SKUs carry most of the value');
  // The value of the matrix is the value of the SKUs with demand, which is all of it (no demand has no value).
  near(M.CELLS.reduce((sum, cell) => sum + r.matrix[cell].value, 0), r.total, 1e-6, 'matrix value');
  assert.deepEqual(plain(r.cycle.byClass), { A: 180, B: 68, C: 28 });
  assert.equal(r.cycle.perYear, 276);
  // Seven SKUs were stocked below their reorder point in the example, four of them A.
  assert.deepEqual(r.belowRop.map((item) => item.sku).sort(), ['OF-5001', 'PK-1002', 'PK-1006', 'PK-1012', 'PK-1023', 'PP-2001', 'SP-4001']);
  assert.equal(r.belowRop.filter((item) => item.cls === 'A').length, 4);
  assert.equal(r.belowRop[0].cls, 'A', 'class A first');
  // The golden zone: AX and AY by picks, most picked first.
  assert.ok(r.golden.length === 14 && r.golden.every((item) => item.cls === 'A' && /[XY]/.test(item.xyz)));
  assert.ok(r.golden.every((item, i) => i === 0 || r.golden[i - 1].picks >= item.picks));
  assert.equal(r.golden[0].sku, 'PK-1002');
  // A Lorenz curve from (0, 0) to (1, 1).
  const curve = M.lorenz(r.items);
  assert.equal(curve.length, 61);
  assert.deepEqual([curve[0].skuShare, curve[0].valueShare], [0, 0]);
  near(curve.at(-1).skuShare, 1, 1e-12, 'last x');
  // The Pareto table carries every SKU with a value, its class as filter, measured by value.
  const table = plain(M.paretoTable(r.items, { source: 'ABC', sku: 'SKU', cls: 'Class', value: 'Value', valueLabel: 'Value' }));
  assert.equal(table.rows.length, 58);
  assert.deepEqual(table.map, { category: 0, count: -1, value: 2, date: -1, filter: 1 });
  assert.equal(table.measure, 'value');
  assert.ok(table.rows.every((row) => row.length === 3 && /^\d+(\.\d{1,2})?$/.test(row[2])), 'values with at most two decimals, read the same on every page');
});

test('reading a table: header by name, the demand columns, blanks as 0, a total column left out', () => {
  const sim = load().ImportMap.similarity;
  const parse = load().ToolKit.parseNumber;
  const rows = [
    ['Artikelnummer', 'Bezeichnung', 'Einstandspreis', 'Bestand', 'Jan', 'Feb', 'Mär', 'Apr', 'Summe'],
    ['A-1', 'Karton', '1,20 €', '50', '10', '', '12', '-3', '19'],
    ['A-2', 'Folie', '15', '', '4', '4', '4', '4', '16'],
    ['A-1', 'Doppelt', '1', '1', '1', '1', '1', '1', '4'],
    ['', 'ohne Nummer', '3', '', '1', '1', '1', '1', '4'],
  ];
  assert.equal(M.isHeaderRow(rows, data.en.aliases, sim, parse), true);
  const mapping = M.guessColumns(rows[0], data.en.aliases, sim);
  assert.deepEqual(plain(mapping), { sku: 0, name: 1, cost: 2, lt: -1, ltSd: -1, stock: 3, picks: -1 });
  const range = M.guessDemand(rows[0], rows.slice(1), mapping, data.en.aliases, sim, parse);
  assert.deepEqual(plain(range), { from: 4, to: 7 }, 'the sum column is not a period');
  const out = plain(M.readTable(rows, { header: true, mapping, ...range }, parse));
  assert.equal(out.skus.length, 2);
  assert.deepEqual(out.skus[0], { sku: 'A-1', name: 'Karton', cost: 1.2, lt: null, ltSd: null, stock: 50, picks: null, demand: [10, 0, 12, 0] });
  assert.equal(out.skus[1].stock, null, 'an empty stock is unknown, not 0');
  assert.equal(out.duplicates, 1);
  assert.equal(out.skipped, 1);
  assert.equal(out.odd, 1, 'the negative cell');
  assert.deepEqual(plain(M.periodLabels(rows[0], { header: true, mapping, ...range }, (n) => `P${n}`)), ['Jan', 'Feb', 'Mär', 'Apr']);
  // Without a header: SKU, description, unit cost, then the periods.
  const bare = [['B-1', 'Tape', '2.5', '3', '0', '6'], ['B-2', 'Film', '9', '1', '1', '1']];
  assert.equal(M.isHeaderRow(bare, data.en.aliases, sim, parse), false);
  const flat = plain(M.readTable(bare, { header: false, mapping: { sku: 0, name: 1, cost: 2, lt: -1, ltSd: -1, stock: -1, picks: -1 }, from: 3, to: 5 }, parse));
  assert.deepEqual(flat.skus.map((sku) => sku.demand), [[3, 0, 6], [1, 1, 1]]);
});

test('the three data files: one shape, the same numbers and keys, their own storage key', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  assert.equal(data.en.storageKey, 'sc-inventory-abc');
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.equal(other.storageKey, `sc-inventory-abc-${lang}`);
    assert.deepEqual(shape(other), shape(data.en), `${lang} shape`);
    assert.deepEqual(other.defaults, data.en.defaults);
    assert.deepEqual(other.aliases, data.en.aliases, 'the aliases cover all three languages');
    assert.deepEqual(other.example.rows.map(({ name, ...row }) => row), data.en.example.rows.map(({ name, ...row }) => row), `${lang}: the example's numbers`);
    assert.ok(other.example.rows.every((row) => typeof row.name === 'string' && row.name.trim()), `${lang} names`);
    assert.ok(other.example.rows.filter((row, i) => row.name !== data.en.example.rows[i].name).length >= 55, `${lang}: the names are translated`);
    assert.deepEqual(Object.keys(other.cells), Object.keys(data.en.cells));
    for (const cell of Object.keys(other.cells)) assert.ok(other.cells[cell].name && other.cells[cell].policy && other.cells[cell].slot, `${lang} ${cell}`);
    for (const key of ['reorder', 'slotting', 'dead']) assert.equal(other.focus[key].moves.length, data.en.focus[key].moves.length);
    for (const [key, value] of Object.entries(other.text)) assert.ok(String(value).trim(), `${lang} text.${key}`);
  }
  assert.deepEqual(Object.keys(data.en.cells), ['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']);
  assert.equal(data.en.defaults.a, 80);
  assert.equal(data.en.defaults.b, 95);
  assert.equal(data.en.defaults.x, 0.5);
  assert.equal(data.en.defaults.y, 1);
  assert.deepEqual([data.en.defaults.countA, data.en.defaults.countB, data.en.defaults.countC], [12, 4, 1]);
  assert.match(data.en.tips.map((tip) => tip.join(' ')).join(' '), /0\.25\/0\.5/, 'a tip names other cut-offs');
  // Every string of the partial and the script has its translation.
  const js = fs.readFileSync('src/js/inventory-abc.js', 'utf8');
  const njk = fs.readFileSync('src/_includes/partials/inventory-abc.njk', 'utf8');
  const keys = new Set([...js.matchAll(/\btx\(\s*"((?:[^"\\]|\\.)*)"/g), ...njk.matchAll(/\{\{\s*"((?:[^"\\]|\\.)*)"\s*\|\s*t\(lang\)/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const lang of ['de', 'sq']) {
    const ui = strings(lang);
    const missing = [...keys].filter((key) => !(key in ui));
    assert.deepEqual(missing, [], `${lang}: untranslated`);
  }
  const cards = read('src/_data/i18n-parts/inventory-abc.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.equal(cards.cards.de.url, '/de/tools/inventory-abc/');
  assert.equal(cards.routine.when, 'Every month');
});

test('the page: a first visit opens on the example, with its note, the matrix and the hand-offs', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the example says so');
  assert.equal(w.localStorage.getItem('sc-inventory-abc'), null, 'nothing saved before the visitor acts');
  assert.match(results.querySelector('.result-head h2').textContent, /15 A SKUs carry/);
  assert.ok(results.querySelector('.ia-matrix-block svg.ck-chart'), 'the heat map');
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 3, 'matrix, Pareto curve and shares');
  assert.equal(doc.querySelectorAll('[data-list] tr').length, 50, 'the first 50 rows of the list');
  assert.equal(doc.querySelector('[data-more]').hidden, false);
  // The filter shows only the SKUs below their reorder point.
  const filter = doc.querySelector('#ia-filter');
  filter.value = 'below';
  filter.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('[data-list] tr').length, 7);
  // Pareto 80/20 gets the classified list in the shape js/pareto.js reads.
  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent));
  assert.equal(new w.URL(pareto.href).pathname, '/tools/pareto/');
  pareto.addEventListener('click', (event) => event.preventDefault());
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.ok(Array.isArray(handoff.headers) && Array.isArray(handoff.rows));
  assert.equal(handoff.rows.length, 58);
  assert.equal(handoff.measure, 'value');
  assert.deepEqual(handoff.map, { category: 0, count: -1, value: 2, date: -1, filter: 1 });
  // The Action Tracker gets the reorder, with its source.
  const action = [...results.querySelectorAll('.result-actions a')].find((a) => a.textContent === 'Add to actions');
  action.addEventListener('click', (event) => event.preventDefault());
  click(w, action);
  const url = new w.URL(action.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'inventory-abc');
  assert.equal(url.searchParams.get('action'), 'Reorder 7 SKUs below their reorder point');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('detail'), /PK-1002/);
  // The classified list as CSV and Excel.
  click(w, doc.querySelector('[data-csv]'));
  click(w, doc.querySelector('[data-xlsx]'));
  assert.deepEqual(w.downloads, [`abc-xyz-inventory-${TODAY}.csv`, `abc-xyz-inventory-${TODAY}.xlsx`]);
});

test('the page: pasted rows replace the example and are saved; a setting changes the result', () => {
  const w = load({ page: true });
  const doc = w.document;
  doc.querySelector('#ia-paste').value = 'SKU\tDescription\tUnit cost\tLead time\tStock\tW1\tW2\tW3\tW4\tW5\n'
    + 'T-1\tCarton\t10\t7\t90\t84\t56\t84\t56\t70\nT-2\tTape\t1\t\t\t0\t0\t0\t0\t0\nT-3\tFilm\t2\t7\t500\t10\t10\t10\t10\t10';
  click(w, doc.querySelector('[data-import]'));
  const saved = JSON.parse(w.localStorage.getItem('sc-inventory-abc'));
  assert.equal(saved.rows.length, 3);
  assert.deepEqual(saved.periods, ['W1', 'W2', 'W3', 'W4', 'W5']);
  assert.deepEqual(saved.example, {});
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  assert.match(doc.querySelector('[data-import-status]').textContent, /Imported 3 SKUs with 5 periods/);
  const unit = doc.querySelector('#ia-unit');
  unit.value = 'week';
  unit.dispatchEvent(new w.Event('change', { bubbles: true }));
  const rows = [...doc.querySelectorAll('[data-list] tr')];
  assert.equal(rows.length, 3);
  const first = rows[0].textContent;
  // T-1: SS = 14 z = 23.03 → 24, ROP = 70 + 23.03 = 93.03 → 94, stock 90: below.
  assert.match(first, /T-1/);
  assert.match(first, /24/);
  assert.match(first, /94/);
  assert.match(first, /Below ROP/);
  assert.match(rows.at(-1).textContent, /No demand/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-inventory-abc')).settings.unit, 'week');
});

test('the German page keeps its language in the hand-offs and its own storage', () => {
  const w = load({ lang: 'de', page: true });
  const results = w.document.querySelector('[data-results]');
  assert.match(results.querySelector('.result-head h2').textContent, /15 A-Artikel tragen/);
  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent));
  assert.equal(new w.URL(pareto.href).pathname, '/de/tools/pareto/');
  const action = [...results.querySelectorAll('.result-actions a')].find((a) => a.textContent === 'Zu den Maßnahmen');
  action.addEventListener('click', (event) => event.preventDefault());
  click(w, action);
  assert.equal(new w.URL(action.href).pathname, '/de/tools/action-tracker/');
  click(w, w.document.querySelector('[data-reset-settings]'));
  assert.ok(w.localStorage.getItem('sc-inventory-abc-de'), 'the German work under its own key');
  assert.equal(w.localStorage.getItem('sc-inventory-abc'), null);
});
