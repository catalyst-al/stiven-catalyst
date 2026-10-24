// Shift Capacity (src/js/shift-capacity.js): the arithmetic in window.ShiftCapacityMath checked against hand-worked
// values (productive hours, heads rounded up, the absence gross-up, conversions between drivers, gap and capacity, the
// bottleneck, takt, overtime and agency, moves checked against a Skills Matrix in its real shape, a rate from a Time
// Study), the parsing of a pasted forecast, the three data files, and the page: the example on a first visit, its
// hand calculation, the hand-offs and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/shiftCapacity.json', de: 'src/_data/de/shiftCapacity.json', sq: 'src/_data/sq/shiftCapacity.json' };
const dataOf = (lang, name) => read(lang === 'en' ? `src/_data/${name}.json` : `src/_data/${lang}/${name}.json`);
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/shift-capacity.njk', {
  cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang, skillsMatrix: dataOf('en', 'skillsMatrix'), timeStudy: dataOf('en', 'timeStudy'),
  de: { skillsMatrix: dataOf('de', 'skillsMatrix'), timeStudy: dataOf('de', 'timeStudy') }, sq: { skillsMatrix: dataOf('sq', 'skillsMatrix'), timeStudy: dataOf('sq', 'timeStudy') },
}).replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {}, before = null } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/shift-capacity/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'shift-capacity']) {
    if (file === 'shift-capacity' && before) before(w);
    w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  }
  return w;
};
const math = () => load({ page: false }).ShiftCapacityMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const saved = (w, key = 'sc-shift-capacity') => JSON.parse(w.localStorage.getItem(key));

// A Skills Matrix in the shape js/skills-matrix.js saves: people with their shift, tasks, levels per person and task.
const skillsState = (shift = 'Early') => ({
  team: 'Hub', template: 'warehouse',
  people: [
    { id: 'p1', name: 'Marco', role: 'Forklift driver', shift },
    { id: 'p2', name: 'Anna', role: 'Loader', shift },
    { id: 'p3', name: 'Besnik', role: 'Team lead', shift },
    { id: 'p4', name: 'Lina', role: 'Loader', shift: 'Night' },
  ],
  tasks: [
    { id: 't1', name: 'Loading', crit: 3, min: 0, target: 3 },
    { id: 't2', name: 'Forklift', crit: 3, min: 0, target: 2 },
    { id: 't3', name: 'Picking', crit: 3, min: 2, target: 4 },
  ],
  levels: { p1: { t1: 4, t2: 4 }, p2: { t1: 3, t2: 2 }, p3: { t1: 3, t2: 3, t3: 4 }, p4: { t1: 4, t2: 4 } },
  plan: [], snapshots: [], anon: false, example: false,
});
const SHIFT = { length: 8, unpaid: 30, paid: 30 };

test('productive hours per person = (length − unpaid breaks − paid breaks and briefing) × utilisation', () => {
  const M = math();
  close(M.netHours(SHIFT), 7, 'net hours');
  close(M.productiveHours(SHIFT, 0.85), 5.95, '8 h − 30 min − 30 min at 85 %');
  // 8.5 h with 30 min unpaid and 25 min paid at 80 %: (8.5 − 0.5 − 0.41667) × 0.8 = 6.0667 h.
  close(M.productiveHours({ length: 8.5, unpaid: 30, paid: 25 }, 0.8), (8.5 - 0.5 - 25 / 60) * 0.8, '8.5 h shift');
  close(M.productiveHours({ length: 12, unpaid: 60, paid: 20 }, 0.9), (12 - 1 - 1 / 3) * 0.9, '12 h shift');
  assert.equal(M.productiveHours({ length: 0.5, unpaid: 30, paid: 30 }, 0.85), 0, 'never below zero');
});

test('heads are the hours over the productive hours, rounded up; whole multiples stay whole', () => {
  const M = math();
  close(M.hoursNeeded(52000, 750), 69.33333333333333, 'unloading hours');
  assert.equal(M.headsNeeded(69.33333333333333, 5.95), 12, '11.65 heads → 12');
  assert.equal(M.headsNeeded(11.9, 5.95), 2, '11.9 h is exactly 2 people (no float drift to 3)');
  assert.equal(M.headsNeeded(11.91, 5.95), 3, 'a little more is a third person');
  assert.equal(M.headsNeeded(0, 5.95), 0, 'no work, no heads');
  assert.equal(M.hoursNeeded(500, 0), 0, 'no rate, no hours');
});

test('heads incl. absence = heads ÷ (1 − absenteeism), rounded up', () => {
  const M = math();
  assert.equal(M.grossHeads(12, 0.08), 14, '12 ÷ 0.92 = 13.04 → 14');
  assert.equal(M.grossHeads(23, 0.08), 25, '23 ÷ 0.92 = 25 exactly');
  assert.equal(M.grossHeads(8, 0.08), 9, '8 ÷ 0.92 = 8.70 → 9');
  assert.equal(M.grossHeads(1, 0.08), 2, 'one person needs a second rostered');
  assert.equal(M.grossHeads(10, 0), 10, 'no absence');
  assert.equal(M.grossHeads(0, 0.08), 0);
});

test('conversions between drivers: the forecast unit × the factor gives the unit of the process', () => {
  const M = math();
  const picking = { id: 'a', name: 'Picking', driver: 'lines', source: 'Orders', uph: 110, factor: 2.4 };
  const volumes = { orders: 1000 };
  assert.equal(M.volumeOf(picking, volumes), 2400, '1,000 orders × 2.4 lines per order');
  close(M.hoursNeeded(M.volumeOf(picking, volumes), 110), 2400 / 110, 'picking hours');
  assert.equal(M.volumeOf({ ...picking, factor: '' }, volumes), 1000, 'no factor is 1');
  assert.equal(M.volumeOf({ ...picking, source: '' , driver: 'orders' }, volumes), 2400, 'no source: the driver itself');
  assert.equal(M.volumeOf(picking, { lines: 50 }), 0, 'a unit that is not in the forecast gives no volume');
  assert.equal(M.unitKey('  Orders '), 'orders');
  // Non-conveyables as a share of the parcels: 5 % of 52,000.
  assert.equal(M.volumeOf({ driver: 'non-conveyables', source: 'parcels', factor: 0.05 }, { parcels: 52000 }), 2600);
  const r = M.analyseShift({ processes: [picking], shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, volumes, planned: { p: { a: 4 } } });
  close(r.rows[0].hours, 21.818181818181817, 'hours');
  assert.equal(r.rows[0].heads, 4, '21.82 ÷ 5.95 = 3.67 → 4');
  assert.equal(r.rows[0].gross, 5, '4 ÷ 0.92 = 4.35 → 5');
});

test('the example parcel hub: Monday early shift by hand', () => {
  const w = load({ page: false });
  const M = w.ShiftCapacityMath;
  const cfg = read(DATA.en);
  const ex = plain(M.exampleState(cfg, TODAY));
  assert.equal(ex.rows[0].date, '2026-10-26', 'the coming Monday');
  assert.equal(ex.rows.length, 17, 'Monday to Friday three shifts, Saturday two');
  const monday = ex.rows[0];
  assert.deepEqual(monday.v, { parcels: 52000, pallets: 180 });
  const processes = ex.processes.map((p) => ({ ...p, uph: Number(p.uph), factor: Number(p.factor) }));
  const r = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, mode: 'rostered', overtime: 2, volumes: monday.v, planned: ex.planned[`${monday.date}|Early`], shiftName: 'Early' });
  close(r.ph, 5.95, 'productive hours');
  const by = Object.fromEntries(r.rows.map((row) => [row.name, row]));
  // Unloading: 52,000 ÷ 750 = 69.33 h; ÷ 5.95 = 11.65 → 12; ÷ 0.92 = 13.04 → 14; 10 planned → 9.2 present → 54.74 h.
  close(by.Unloading.hours, 52000 / 750, 'unloading hours');
  assert.deepEqual([by.Unloading.heads, by.Unloading.gross, by.Unloading.planned, by.Unloading.gapHeads], [12, 14, 10, -4]);
  close(by.Unloading.available, 10 * 0.92 * 5.95, 'unloading hours present');
  close(by.Unloading.gapHours, 10 * 0.92 * 5.95 - 52000 / 750, 'unloading gap in hours');
  close(by.Unloading.capacity, 10 * 0.92 * 5.95 * 750, 'unloading capacity = present heads × productive hours × UPH');
  close(by.Unloading.capacity, 41055, 'unloading capacity in parcels', 1e-6);
  close(by.Unloading.coverage, 41055 / 52000, 'unloading coverage');
  // Induction: 47.27 h → 7.95 → 8 → 8.70 → 9; Manual sort: 2,600 ÷ 160 = 16.25 h → 2.73 → 3 → 4.
  assert.deepEqual([by.Induction.heads, by.Induction.gross, by.Induction.gapHeads], [8, 9, -2]);
  close(by['Manual sort'].volume, 2600, 'non-conveyables');
  assert.deepEqual([by['Manual sort'].heads, by['Manual sort'].gross, by['Manual sort'].gapHeads], [3, 4, 0]);
  // Loading: 94.55 h → 15.89 → 16 → 17.39 → 18; Pallet handling: 180 ÷ 25 = 7.2 h → 1.21 → 2 → 3.
  assert.deepEqual([by.Loading.heads, by.Loading.gross, by.Loading.gapHeads], [16, 18, -3]);
  assert.deepEqual([by['Pallet handling'].heads, by['Pallet handling'].gross, by['Pallet handling'].gapHeads], [2, 3, -1]);
  close(by['Pallet handling'].gapHours, 2 * 0.92 * 5.95 - 7.2, 'pallets spare hours');
  // The shift: 234.6 h; 41 heads, 48 incl. absence; 38 planned → −10 heads and 38 × 0.92 × 5.95 − 234.6 = −26.6 h.
  const t = r.totals;
  close(t.hours, 52000 / 750 + 52000 / 1100 + 2600 / 160 + 52000 / 550 + 7.2, 'total hours');
  assert.deepEqual([t.heads, t.gross, t.planned, t.gapHeads], [41, 48, 38, -10]);
  close(t.gapHours, 38 * 0.92 * 5.95 - t.hours, 'total gap in hours');
  close(t.gapHours, -26.59, 'about 26.6 h short', 0.01);
  assert.deepEqual([t.pooled, t.pooledGross], [40, 44], 'pooled: 234.6 ÷ 5.95 = 39.4 → 40, ÷ 0.92 → 44');
  assert.equal(r.status, 'short');
  // The bottleneck is the lowest capacity against volume: unloading at 79 % (loading 87 %, induction 81 %).
  assert.equal(r.bottleneck.name, 'Unloading');
  close(r.bottleneck.coverage, 0.7895, 'bottleneck coverage', 1e-4);
  close(r.flows.parcels, r.bottleneck.coverage, 'the parcel flow is limited by unloading');
  // Takt: 7 h net = 25,200 s over 52,000 parcels.
  close(by.Unloading.takt, 25200 / 52000, 'takt');
  // Without a Skills Matrix: no move; the rest as overtime (hours ÷ utilisation) or agency (hours ÷ (PH × 0.92)).
  const unloading = r.options.find((o) => o.name === 'Unloading');
  assert.equal(r.options[0].name, 'Unloading', 'the largest shortfall first');
  assert.deepEqual(plain(unloading.moves), []);
  assert.ok(unloading.blocked.every((b) => b.status === 'missing' && b.missing === 'matrix'), 'skills data missing');
  close(unloading.overtime, (52000 / 750 - 10 * 0.92 * 5.95) / 0.85, 'overtime hours');
  assert.equal(unloading.overtimePeople, 9, '17.2 h at 2 h each');
  assert.equal(unloading.agency, 3, '14.6 ÷ (5.95 × 0.92) = 2.67 → 3');
  assert.deepEqual(plain(r.options.map((o) => o.name)), ['Unloading', 'Loading', 'Induction']);
});

test('confirmed heads: no absence on the planned team, compared with the heads needed', () => {
  const M = math();
  const processes = [{ id: 'u', name: 'Unloading', driver: 'parcels', source: 'parcels', uph: 750, factor: 1 }];
  const r = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, mode: 'confirmed', volumes: { parcels: 52000 }, planned: { p: { u: 12 } } });
  assert.equal(r.rows[0].need, 12, 'compared with the heads, not the heads incl. absence');
  assert.equal(r.rows[0].gapHeads, 0);
  close(r.rows[0].capacity, 12 * 5.95 * 750, 'capacity of 12 people');
  assert.equal(r.status, 'ok');
});

test('a total instead of heads per process: one pool across the processes', () => {
  const M = math();
  const processes = [
    { id: 'a', name: 'A', driver: 'parcels', source: 'parcels', uph: 600, factor: 1 },
    { id: 'b', name: 'B', driver: 'parcels', source: 'parcels', uph: 300, factor: 1 },
  ];
  // 3,000 ÷ 600 = 5 h and 3,000 ÷ 300 = 10 h: 15 h, 2.52 → 3 pooled heads, 4 incl. absence (per process 1 + 2 → 2 + 3).
  const r = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, volumes: { parcels: 3000 }, planned: { total: 3 } });
  assert.equal(r.mode, 'total');
  assert.deepEqual([r.totals.heads, r.totals.gross, r.totals.pooled, r.totals.pooledGross], [3, 5, 3, 4]);
  assert.equal(r.totals.gapHeads, -1, '3 planned against 4 pooled incl. absence');
  close(r.totals.gapHours, 3 * 0.92 * 5.95 - 15, 'hours: 16.42 present for 15 needed');
  assert.equal(r.status, 'rounding', 'short in heads only through rounding');
  assert.equal(r.bottleneck, null, 'a pooled team has no single bottleneck');
  close(r.rows[1].coverage, (3 * 0.92 * 5.95) / 15, 'every process covers the same share');
  const short = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, volumes: { parcels: 3000 }, planned: { total: 2 } });
  assert.equal(short.status, 'short');
  close(short.options[0].short, 15 - 2 * 0.92 * 5.95, 'short hours');
  assert.equal(short.options[0].agency, 1);
  // A process number wins over the total; empty processes then count 0.
  assert.equal(M.planOf({ p: { a: 2 }, total: 9 }, processes).mode, 'process');
  assert.deepEqual(plain(M.planOf({ p: { a: 2 }, total: 9 }, processes).heads), { a: 2, b: 0 });
  assert.equal(M.planOf({ p: {} }, processes).mode, 'none');
});

test('bottleneck: the lowest capacity against its own volume, not the largest gap', () => {
  const M = math();
  const processes = [
    { id: 'big', name: 'Big', driver: 'parcels', source: 'parcels', uph: 100, factor: 1 },
    { id: 'small', name: 'Small', driver: 'pallets', source: 'pallets', uph: 10, factor: 1 },
  ];
  // Big: 1,000 parcels = 10 h, 1 person present 5.95 h → 59.5 %; Small: 50 pallets = 5 h, 0 planned → 0 %.
  const r = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0, volumes: { parcels: 1000, pallets: 50 }, planned: { p: { big: 1, small: 0 } } });
  assert.equal(r.bottleneck.id, 'small');
  assert.equal(r.bottleneck.coverage, 0);
  close(r.flows.parcels, 0.595, 'the parcel flow on its own process');
  const enough = M.analyseShift({ processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0, volumes: { parcels: 1000, pallets: 50 }, planned: { p: { big: 1, small: 1 } } });
  assert.equal(enough.bottleneck.id, 'big', '59.5 % against 119 %');
});

test('moves between processes only for people at level 3+ on both, from the Skills Matrix in its real shape', () => {
  const M = math();
  const model = M.skillsModel(skillsState());
  assert.ok(model, 'the saved matrix is read');
  const loading = { id: 'l', name: 'Loading' };
  const pallets = { id: 'p', name: 'Pallet handling', skill: 'Forklift' };
  assert.equal(M.taskFor(model, pallets).name, 'Forklift', 'the task named for the process');
  assert.equal(M.taskFor(model, { name: 'loading ' }).name, 'Loading', 'or its own name');
  assert.equal(M.taskFor(model, { name: 'Unloading' }), null);
  // Early: Marco (4/4) and Besnik (3/3) are at level 3+ on both; Anna has Forklift 2; Lina works nights.
  const early = M.qualified(model, pallets, loading, 'Early');
  assert.equal(early.status, 'ok');
  assert.deepEqual(plain(early.people), ['p1', 'p3']);
  assert.equal(early.byShift, true);
  assert.deepEqual(plain(M.qualified(model, pallets, loading, 'early').people), ['p1', 'p3'], 'shift names match without case');
  assert.deepEqual(plain(M.qualified(model, pallets, loading, 'Night').people), ['p4']);
  // A shift the matrix does not know: the whole team counts.
  const late = M.qualified(model, pallets, loading, 'Late');
  assert.equal(late.byShift, false);
  assert.deepEqual(plain(late.people), ['p1', 'p3', 'p4']);
  assert.equal(M.qualified(model, pallets, loading, 'Early', new Set(['p1', 'p3'])).status, 'few', 'people already moved are not counted twice');
  assert.deepEqual(plain(M.qualified(null, pallets, loading, 'Early')), { status: 'missing', missing: 'matrix', people: [] }, 'no matrix: skills data missing');
  assert.equal(M.qualified(model, { id: 'x', name: 'Manual sort' }, loading, 'Early').missing, 'Manual sort', 'a process without a task: missing');
  assert.equal(M.skillsModel({ people: [], tasks: [] }), null, 'an empty matrix is no data');
  assert.equal(M.skillsModel('broken'), null);
  assert.equal(M.levelOf(model, 'p2', 't3'), 0, 'an empty cell is level 0');

  // In a shift: pallet handling has 2 people planned (10.95 h) for 3.6 h of work; loading is 9 h short.
  const processes = [
    { id: 'l', name: 'Loading', driver: 'parcels', source: 'parcels', uph: 550, factor: 1, skill: '' },
    { id: 'p', name: 'Pallet handling', driver: 'pallets', source: 'pallets', uph: 25, factor: 1, skill: 'Forklift' },
  ];
  const volumes = { parcels: 550 * (4 * 0.92 * 5.95 + 9), pallets: 90 };
  const args = { processes, shift: SHIFT, utilisation: 0.85, absenteeism: 0.08, overtime: 2, volumes, planned: { p: { l: 4, p: 2 } }, shiftName: 'Early' };
  const r = M.analyseShift({ ...args, skills: model });
  const option = r.options[0];
  close(option.short, 9, 'loading short');
  const spare = 2 * 0.92 * 5.95 - 3.6;
  assert.equal(option.moves.length, 1);
  close(option.moves[0].hours, spare, 'all the spare pallet hours move');
  assert.equal(option.moves[0].people, 2, '7.35 h is more than one person’s 5.95 h');
  assert.deepEqual(plain(option.moves[0].names), ['Marco', 'Besnik']);
  close(option.rest, 9 - spare, 'the rest after the move');
  close(option.overtime, (9 - spare) / 0.85, 'overtime for the rest');
  assert.equal(option.agency, 1);
  // Only one person qualified: the move is limited to one person's productive hours.
  const one = skillsState();
  one.levels.p3.t2 = 2;
  const limited = M.analyseShift({ ...args, skills: M.skillsModel(one) }).options[0];
  close(limited.moves[0].hours, 5.95, 'one qualified person');
  assert.equal(limited.moves[0].limited, true);
  // No matrix: nothing moves and the spare hours are reported as missing skills data.
  const none = M.analyseShift({ ...args, skills: null }).options[0];
  assert.deepEqual(plain(none.moves), []);
  assert.equal(none.blocked[0].status, 'missing');
  close(none.blocked[0].hours, spare, 'the spare hours named');
  close(none.rest, 9, 'all of it still to close');
});

test('a rate from a time study: UPH = 3600 ÷ (cycle seconds × (1 + allowance)) × units per cycle', () => {
  const M = math();
  close(M.uphFromCycle(24, 0.15), 3600 / (24 * 1.15), '24 s with 15 %');
  close(M.uphFromCycle(24, 0.15), 130.43478260869566, 'about 130 per hour');
  close(M.uphFromCycle(24, 0), 150, 'no allowance');
  close(M.uphFromCycle(30, 0.1, 2), 7200 / 33, 'two units per cycle');
  assert.equal(M.uphFromCycle(0, 0.15), null);
  // The Time Study's saved state: the cycle of a station is the sum of the medians of its elements.
  const study = {
    process: 'Packing', demand: '480', available: '450',
    stations: [{ name: 'Pack', elements: [{ name: 'Pick up', type: 'VA' }, { name: 'Tape', type: 'VA' }, { name: 'Label', type: 'NVA' }] }, { name: 'Empty', elements: [{ name: 'x', type: 'VA' }] }],
    rows: [{ s: 0, e: 0, c: 1, t: 10 }, { s: 0, e: 0, c: 2, t: 12 }, { s: 0, e: 0, c: 3, t: 30 }, { s: 0, e: 1, c: 1, t: 8 }, { s: 0, e: 1, c: 2, t: 9 }],
  };
  const cycles = plain(M.studyCycles(study));
  assert.equal(cycles.length, 1, 'a station without timings is left out');
  assert.deepEqual(cycles[0], { index: 0, name: 'Pack', seconds: 20.5, timed: 2, elements: 3, process: 'Packing' }, 'median 12 + median 8.5');
  assert.deepEqual(plain(M.studyCycles(null)), []);
  assert.equal(M.median([3, 1, 2, 10]), 2.5);
});

test('takt and capacity edge cases', () => {
  const M = math();
  close(M.takt(25200, 52000), 0.48461538461538461, 'takt');
  assert.equal(M.takt(25200, 0), null);
  close(M.capacity(9.2, 5.95, 750), 41055, 'capacity', 1e-6);
  assert.equal(M.capacity(0, 5.95, 750), 0);
});

test('a pasted forecast: date, shift, one volume per unit, then the planned total', () => {
  const M = math();
  const text = 'Date;Shift;Parcels;Pallets;Heads\n2026-10-26;Early;52000;180;38\n27.10.2026;late;49 500;160\n2026-10-28;Weekend;1000;5\nbad;Early;1;1\n2026-10-29;;5;5';
  const { added, skipped, newShifts } = plain(M.parseForecast(text, ['parcels', 'pallets'], ['Early', 'Late', 'Night']));
  assert.deepEqual(added, [
    { date: '2026-10-26', shift: 'Early', v: { parcels: 52000, pallets: 180 }, total: 38 },
    { date: '2026-10-27', shift: 'Late', v: { parcels: 49500, pallets: 160 } },
    { date: '2026-10-28', shift: 'Weekend', v: { parcels: 1000, pallets: 5 } },
  ]);
  assert.deepEqual(newShifts, ['Weekend'], 'an unknown shift is added');
  assert.equal(skipped, 2, 'a row without a date or a shift; the header is not counted');
});

test('the three data files: one shape, the same numbers, their own storage key; the translations and the cards', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-shift-capacity');
  const numbersOf = (cfg) => ({ defaults: cfg.defaults, templates: cfg.templates.map((t) => [t.key, t.processes.map((p) => [p.uph, p.factor, Boolean(p.skill)])]), example: { ...cfg.example, site: '', shifts: cfg.example.shifts.map(({ name, ...s }) => s) } });
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-shift-capacity-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} has the same keys`);
    assert.deepEqual(numbersOf(other), numbersOf(en), `${lang}: the same rates, conversions and example numbers`);
    assert.deepEqual(other.example.shifts.map((s) => s.name), other.shifts, `${lang}: the example uses the shift names`);
    for (const [key, value] of Object.entries(other.text)) assert.ok(value.trim(), `${lang} text.${key}`);
    assert.equal(other.tips.length, en.tips.length);
    // The skills of the templates are tasks of the Skills Matrix templates in the same language.
    const tasks = Object.values(dataOf(lang, 'skillsMatrix').templates).flatMap((t) => t.tasks.map((task) => task.name));
    other.templates.flatMap((t) => t.processes).filter((p) => p.skill).forEach((p) => assert.ok(tasks.includes(p.skill), `${lang}: ${p.skill} is a Skills Matrix task`));
  }
  const tasks = Object.values(dataOf('en', 'skillsMatrix').templates).flatMap((t) => t.tasks.map((task) => task.name));
  en.templates.flatMap((t) => t.processes).filter((p) => p.skill).forEach((p) => assert.ok(tasks.includes(p.skill), `${p.skill} is a Skills Matrix task`));
  assert.deepEqual(en.templates.map((t) => t.key), ['parcel-hub', 'warehouse', 'delivery-station', 'laundry-kitchen']);
  for (const t of en.templates) for (const p of t.processes) assert.ok(p.uph > 0 && p.factor > 0, `${t.key} · ${p.name}`);
  for (const advice of Object.values(en.advice)) assert.ok(advice.meaning && advice.moves.length >= 2 && advice.question);
  // Translations: the same keys in German and Albanian, none of them empty.
  const part = read('src/_data/i18n-parts/shift-capacity.json');
  assert.deepEqual(Object.keys(part.sq), Object.keys(part.de));
  for (const lang of ['de', 'sq']) for (const [key, value] of Object.entries(part[lang])) assert.ok(value.trim(), `${lang}: ${key}`);
  const cards = read('src/_data/i18n-parts/shift-capacity.cards.json');
  assert.equal(cards.family, 'zenith');
  assert.deepEqual(Object.keys(cards.cards), ['en', 'de', 'sq']);
  assert.equal(cards.cards.en.url, '/tools/shift-capacity/');
  assert.equal(cards.cards.de.url, '/de/tools/shift-capacity/');
  assert.equal(cards.cards.sq.url, '/sq/tools/shift-capacity/');
  assert.equal(cards.cards.en.type, 'Planning');
  assert.equal(cards.routine.when, 'Every week');
  assert.ok(cards.routine.de.do && cards.routine.sq.do);
});

test('the page opens on the example on a first visit, without saving it, and shows the hand-worked shift', () => {
  const w = load();
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false, 'the result is shown');
  assert.equal(w.localStorage.getItem('sc-shift-capacity'), null, 'nothing is saved until the visitor acts');
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the example note says so');
  assert.match(results.querySelector('.cp-head h2').textContent, /of 17 shifts/);
  const rows = [...results.querySelectorAll('.cp-shift-table tbody tr')].map((tr) => [...tr.children].map((td) => td.textContent));
  assert.equal(rows.length, 5);
  assert.deepEqual(rows[0].slice(0, 9), ['Unloading Bottleneck', '52,000 parcels', '750', '69.3', '12', '14', '10', '−4', '−14.6 h']);
  assert.deepEqual(rows[3].slice(4, 8), ['16', '18', '15', '−3']);
  const foot = [...results.querySelectorAll('.cp-shift-table tfoot td')].map((td) => td.textContent);
  assert.deepEqual(foot.slice(3, 9), ['234.6', '41', '48', '38', '−10', '−26.6 h']);
  assert.ok(results.querySelector('.cp-shift-panel .ck-chart'), 'needed against planned as a chart');
  assert.equal(results.querySelectorAll('.ck-chart').length, 3, 'needed vs planned, the week by process, capacity against volume');
  assert.match(results.querySelector('.cp-options').textContent, /there is no Skills Matrix in this browser: the skills data is missing/);
  assert.match(doc.querySelector('.cp-ph').textContent, /5\.95 h/, 'the productive hours of each shift');
  // A change of the visitor's own ends the example and is saved.
  type(w, doc.querySelector('[data-forecast] .cp-vol'), '50000');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  assert.equal(saved(w).rows[0].v.parcels, 50000);
});

test('moves use the Skills Matrix of the same language; the gap goes to the Action Tracker; CSV and print', () => {
  const exports = [];
  const w = load({ storage: { 'sc-skills-matrix': skillsState() }, before: (win) => { win.ToolKit.downloadCsv = (name, rows) => exports.push({ name, rows }); } });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  const options = results.querySelector('.cp-options').textContent;
  assert.match(options, /Move 1 person from Pallet handling for 3\.7 h \(Marco\) · level 3 or above on both processes/, 'pallet handling (Forklift) to loading: 3.7 h is one person');
  assert.match(options, /Unloading is not a task in the Skills Matrix/);
  assert.equal(doc.querySelector('[data-skill-head]').hidden, false, 'the task column shows when a matrix exists');
  const link = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Add to actions');
  click(w, link);
  const url = new URL(link.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'shift-capacity');
  assert.match(url.searchParams.get('action'), /^Close the gap on Mon 26 Oct · Early: 36\.0 h short$/);
  assert.equal(url.searchParams.get('due'), '2026-10-25', 'the day before the shift');
  assert.equal(url.searchParams.get('owner'), 'Shift lead');
  assert.match(url.searchParams.get('detail'), /Bottleneck: Unloading, 79%/);
  // The CSV: one row per shift and process, the header first.
  click(w, doc.querySelector('[data-csv]'));
  assert.equal(exports.length, 1);
  const { name, rows } = exports[0];
  assert.equal(name, 'shift-capacity');
  assert.equal(rows[0][0], 'Date', 'the header row first');
  assert.equal(rows.length, 1 + 17 * 5, 'one row per shift and process');
  assert.deepEqual(plain(rows[1].slice(0, 13)), ['2026-10-26', 'Early', 'Unloading', 'parcels', 52000, 750, 69.33, 5.95, 12, 14, 10, -4, -14.59]);
  // Print: the plan of the day is built before printing and removed after.
  w.dispatchEvent(new w.Event('beforeprint'));
  const sheet = doc.querySelector('[data-print]');
  assert.equal(sheet.hidden, false);
  assert.equal(sheet.querySelectorAll('.cp-print-table').length, 3, 'the three shifts of Monday');
  assert.ok(doc.documentElement.classList.contains('cp-printing'));
  w.dispatchEvent(new w.Event('afterprint'));
  assert.equal(sheet.hidden, true);
});

test('the planned heads of a shift: per process, the total, copied to every shift of that name', () => {
  const w = load();
  const doc = w.document;
  const select = doc.querySelector('#cp-plan-shift');
  assert.equal(select.value, '2026-10-26|Early');
  const fields = [...doc.querySelectorAll('[data-plan]')];
  assert.equal(fields.length, 5);
  assert.equal(fields[0].value, '10');
  type(w, fields[0], '14');
  assert.equal(saved(w).planned['2026-10-26|Early'].p['ex-p1'], 14);
  const row = [...doc.querySelectorAll('.cp-shift-table tbody tr')][0];
  assert.equal(row.children[7].textContent, '±0', 'unloading is now planned as needed');
  click(w, doc.querySelector('[data-copy-plan]'));
  const plan = saved(w).planned;
  assert.equal(plan['2026-10-31|Early'].p['ex-p1'], 14, 'Saturday early has the same crew now');
  // Only a total: the team is one pool.
  w.localStorage.clear();
  const w2 = load();
  const d2 = w2.document;
  [...d2.querySelectorAll('[data-plan]')].forEach((input) => type(w2, input, ''));
  type(w2, d2.querySelector('#cp-plan-total'), '44');
  assert.match(d2.querySelector('[data-plan-note]').textContent, /Only the total/);
  assert.match(d2.querySelector('.cp-shift-panel').textContent, /Planned as a total of 44/);
});

test('German and Albanian pages run on their own data and keys', () => {
  for (const lang of ['de', 'sq']) {
    const w = load({ lang });
    const results = w.document.querySelector('[data-results]');
    assert.equal(results.hidden, false, lang);
    const cfg = read(DATA[lang]);
    assert.match(results.querySelector('.cp-shift-table tbody tr').textContent, new RegExp(cfg.templates[0].processes[0].name));
    const action = [...results.querySelectorAll('a')].find((a) => a.href.includes('action-tracker'));
    assert.ok(new URL(action.href).pathname.startsWith(`/${lang}/tools/action-tracker/`), `${lang} tracker link keeps the language`);
    type(w, w.document.querySelector('[data-forecast] .cp-vol'), '1000');
    assert.ok(w.localStorage.getItem(`sc-shift-capacity-${lang}`), `${lang} saves under its own key`);
    assert.equal(w.localStorage.getItem('sc-shift-capacity'), null);
  }
});
