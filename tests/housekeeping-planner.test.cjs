// Housekeeping Planner (src/js/housekeeping-planner.js): the arithmetic in window.HousekeepingPlannerMath (the workload
// of the example worked by hand, attendants needed with the rounding up and the productive share, credits giving the
// same answer as minutes, the sections balanced by minutes on few floors, the codes of Room Status read in the shape
// room-status.js writes, the attendants applied and undone without touching anything else, the week from the
// forecast), the three data files, and the page itself on its first visit.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/housekeepingPlanner.json', de: 'src/_data/de/housekeepingPlanner.json', sq: 'src/_data/sq/housekeepingPlanner.json' };
const RS_DATA = { en: 'src/_data/roomStatus.json', de: 'src/_data/de/roomStatus.json', sq: 'src/_data/sq/roomStatus.json' };
const TODAY = '2026-10-24';
const close = (actual, expected, digits = 6, label = '') => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${label} ${actual} ≠ ${expected}`);

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/housekeeping-planner.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const windows = [];
const load = ({ lang = 'en', page = true, now = `${TODAY}T07:30:00Z`, storage = {}, scripts = ['tool-kit', 'chart-kit', 'actions-store', 'housekeeping-planner'] } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/housekeeping-planner/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of scripts) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  windows.push(w);
  return w;
};
test.afterEach(() => { while (windows.length) windows.pop().close(); });
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
const math = () => load({ page: false, scripts: ['tool-kit', 'housekeeping-planner'] }).HousekeepingPlannerMath;
const cfg = read(DATA.en);
const TYPES = cfg.roomTypes.map((t) => t.key);
const settings = (patch = {}) => ({ ...plain(cfg.defaults), ...patch });
const exampleItems = (M, s = settings()) => M.withMinutes(s, M.itemsFromRows(cfg.example.rows.map((row) => M.cleanRow(row, TYPES))));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));

test('the three data files share one shape, the same keys, standards and example, and their own storage keys', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-housekeeping-planner');
  assert.equal(en.roomStatusKey, 'sc-room-status');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-housekeeping-planner-${lang}`, `${lang} keeps its own plan`);
    assert.equal(other.roomStatusKey, `sc-room-status-${lang}`, `${lang} reads the Room Status of its language`);
    assert.equal(other.roomStatusKey, read(RS_DATA[lang]).storageKey, `${lang}: the key Room Status writes`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(other.defaults, en.defaults, `${lang}: the same standards`);
    assert.deepEqual(other.example, en.example, `${lang}: the same hotel`);
    assert.deepEqual(other.roomTypes.map((t) => t.key), en.roomTypes.map((t) => t.key));
    assert.deepEqual(other.cleanTypes.map((t) => t.key), en.cleanTypes.map((t) => t.key));
    assert.equal(other.tips.length, en.tips.length);
    for (const c of other.cleanTypes) assert.ok(c.name && c.short && c.meaning, `${lang} ${c.key}`);
    assert.ok(other.source.length > 200, `${lang}: says where the defaults come from`);
  }
  // The room types are those of Room Status, so its rooms keep their type.
  assert.deepEqual(en.roomTypes.map((t) => t.key), read(RS_DATA.en).roomTypes.map((t) => t.key));
  for (const type of TYPES) for (const clean of ['departure', 'stayover', 'linen', 'deep']) {
    assert.ok(en.defaults.minutes[type][clean] > 0 && en.defaults.credits[type][clean] > 0, `${type} ${clean}`);
    assert.ok(en.defaults.minutes[type].linen >= en.defaults.minutes[type].stayover, `${type}: a linen change takes longer than a stay-over`);
    assert.ok(en.defaults.minutes[type].departure > en.defaults.minutes[type].linen, `${type}: a departure takes longer than a linen change`);
  }
  // A credit is one stay-over of a double.
  assert.equal(en.defaults.credits.double.stayover, 1);
});

test('the example adds up: 180 rooms at 82 %, the workload worked by hand, attendants needed rounded up', () => {
  const M = math();
  const rows = cfg.example.rows;
  const total = (name) => rows.reduce((s, r) => s + r[name], 0);
  // 52 departures + 96 stay-overs = 148 rooms occupied last night = 82.2 % of 180.
  assert.equal(total('departure'), 52);
  assert.equal(total('stayover'), 96);
  assert.equal(total('linen'), 32);
  assert.equal(total('vip'), 4);
  assert.equal(total('deep'), 3);
  assert.equal(Math.round((148 / cfg.example.hotelRooms) * 100), 82);
  const p = M.plan(exampleItems(M), settings(), { scheduled: 10, rate: 17.5, hotelRooms: 180 });
  // Productive minutes = (8.5 h × 60 − 30) × 0.85 = 480 × 0.85 = 408.
  assert.equal(p.paid, 480);
  close(p.productive, 408);
  // Departures: 6×25 + 2×40 + 7×30 + 3×35 + 6×30 + 3×35 + 7×30 + 3×35 + 6×30 + 3×35 + 4×30 + 2×50 = 1 650.
  assert.equal(p.by.departure.n, 52);
  assert.equal(p.by.departure.units, 1650);
  // Stay-overs without a change (stay-overs − linen): 7×15 + 4×25 + 6×20 + 3×20 + 7×20 + 4×20 + 7×20 + 3×20 + 7×20 + 4×20 + 8×20 + 4×30 = 1 305.
  assert.equal(p.by.stayover.n, 64);
  assert.equal(p.by.stayover.units, 1305);
  // Linen changes: 3×20 + 2×30 + 4×25 + 2×30 + 4×25 + 2×30 + 3×25 + 2×30 + 4×25 + 2×30 + 3×25 + 1×40 = 850.
  assert.equal(p.by.linen.n, 32);
  assert.equal(p.by.linen.units, 850);
  // Deep cleans: 90 (single) + 120 + 120 (doubles) = 330; VIP: 4 × 15 = 60; public areas: 6 h = 360.
  assert.equal(p.by.deep.units, 330);
  assert.equal(p.by.vip.units, 60);
  assert.equal(p.publicMinutes, 360);
  // Total = 1 650 + 1 305 + 850 + 330 + 60 + 360 = 4 555; rooms alone 4 195.
  assert.equal(p.totalMinutes, 4555);
  assert.equal(p.roomMinutes, 4195);
  // Attendants needed = ⌈4 555 ÷ 408⌉ = ⌈11.16⌉ = 12; room sections = ⌈4 195 ÷ 408⌉ = ⌈10.28⌉ = 11.
  close(p.shifts, 4555 / 408);
  assert.equal(p.needed, 12);
  assert.equal(p.roomSections, 11);
  assert.equal(p.sections, 11);
  // 10 scheduled: 2 short; 10 × 8 h = 80 h against 4 555 ÷ 408 × 8 = 89.31 h needed: 9.31 h short.
  assert.equal(p.diffPersons, -2);
  close(p.hoursNeeded, 89.3137, 3);
  close(p.diffHours, -9.3137, 3);
  // Minutes per occupied room = (1 650 + 1 305 + 850 + 60) ÷ 148 = 3 865 ÷ 148 = 26.11.
  assert.equal(p.occupied, 148);
  assert.equal(p.cleaningMinutes, 3865);
  close(p.minutesPerOccupied, 26.1149, 3);
  // Rooms per attendant = (52 + 96 + 3) ÷ 11 = 13.7.
  assert.equal(p.cleaned, 151);
  close(p.roomsPerAttendant, 151 / 11);
  // Labour cost = 12 × 8 h × 17.50 € = 1 680 €, 11.35 € per occupied room.
  assert.equal(p.costNeeded, 1680);
  assert.equal(p.costScheduled, 1400);
  close(p.costPerOccupied, 1680 / 148);
  close(p.occupancy, 148 / 180);
});

test('rounding up and the productive share: one minute over a shift is one more attendant', () => {
  const M = math();
  const s = settings({ publicHours: 0 });
  // 408 productive minutes: 17 double departures of 24 min would be 408; here 30-min departures.
  const items = (n) => M.withMinutes(s, Array.from({ length: n }, () => ({ room: '', floor: '1', type: 'double', clean: 'departure', vip: false })));
  const at = (n, patch = {}) => M.plan(items(n), { ...s, ...patch });
  // 13 × 30 = 390 ≤ 408 → 1; 14 × 30 = 420 > 408 → 2.
  assert.equal(at(13).needed, 1);
  assert.equal(at(14).needed, 2);
  // Exactly a shift is one attendant: 408 minutes of public areas alone.
  assert.equal(M.plan([], { ...s, publicHours: 408 / 60 }).needed, 1);
  assert.equal(M.ceilUp(11.000000000001), 11);
  assert.equal(M.ceilUp(11.0001), 12);
  // The productive share decides: at 100 % a shift holds 480 minutes, 16 departures fit; at 85 % only 13.
  assert.equal(at(16, { productiveShare: 1 }).needed, 1);
  assert.equal(at(16).needed, 2);
  // The example at 100 % productive: ⌈4 555 ÷ 480⌉ = ⌈9.49⌉ = 10 instead of 12.
  assert.equal(M.plan(exampleItems(M), settings({ productiveShare: 1 })).needed, 10);
  // A longer break shortens the shift: (8.5 × 60 − 60) × 0.85 = 382.5.
  close(M.productiveMinutes(settings({ breakMinutes: 60 })), 382.5);
  // Nothing scheduled or no rate: no comparison and no cost, not zero.
  const p = at(14);
  assert.equal(p.diffPersons, null);
  assert.equal(p.costNeeded, null);
});

test('credits give the same plan as minutes when one credit is one stay-over of a double', () => {
  const M = math();
  const minutes = settings();
  // Credits derived from the minutes: a credit = 20 min (a double's stay-over); the quota = 408 ÷ 20 = 20.4.
  const derived = settings({ mode: 'credits', vipCredits: 15 / 20, creditsPerAttendant: 408 / 20 });
  derived.credits = Object.fromEntries(TYPES.map((t) => [t, Object.fromEntries(Object.entries(minutes.minutes[t]).map(([k, v]) => [k, v / 20]))]));
  close(M.minutesPerCredit(derived), 20);
  const a = M.plan(exampleItems(M, minutes), minutes, { scheduled: 10 });
  const b = M.plan(exampleItems(M, derived), derived, { scheduled: 10 });
  // 4 555 min = 227.75 credits; ⌈227.75 ÷ 20.4⌉ = ⌈11.16⌉ = 12, the same as ⌈4 555 ÷ 408⌉.
  close(b.totalUnits, 227.75);
  close(b.totalMinutes, a.totalMinutes);
  close(b.shifts, a.shifts);
  assert.equal(b.needed, a.needed);
  assert.equal(b.roomSections, a.roomSections);
  close(b.hoursNeeded, a.hoursNeeded);
  close(b.minutesPerOccupied, a.minutesPerOccupied);
  // The same sections, room for room.
  const sa = M.balance(exampleItems(M, minutes), a.sections), sb = M.balance(exampleItems(M, derived), b.sections);
  assert.deepEqual(plain(sb.map((x) => x.items.length)), plain(sa.map((x) => x.items.length)));
  sb.forEach((x, i) => close(x.minutes, sa[i].minutes, 6, `section ${i + 1}`));
  // The default credit table (rounded to quarter credits, 20 per shift) lands on the same 12 for this hotel.
  const defaults = settings({ mode: 'credits' });
  const c = M.plan(exampleItems(M, defaults), defaults);
  // 52 departures: 6×1.25 + 2×2 + 7×1.5 + 3×1.75 + 6×1.5 + 3×1.75 + 7×1.5 + 3×1.75 + 6×1.5 + 3×1.75 + 4×1.5 + 2×2.5 = 82.5 credits.
  close(c.by.departure.units, 82.5);
  assert.equal(c.needed, 12);
});

test('sections: balanced by minutes within one room, on as few floors as possible', () => {
  const M = math();
  // By hand: floor 1 has 30, 30, 20 minutes, floor 2 has 30, 20, 20; two sections of 150 ÷ 2 = 75. The running total is
  // nearest to 75 after the third room (80, not 60), so floor 1 and floor 2 become one section each: 80 and 70.
  const small = [[1, 101, 30], [1, 102, 30], [1, 103, 20], [2, 201, 30], [2, 202, 20], [2, 203, 20]].map(([floor, room, minutes]) => ({ floor: String(floor), room: String(room), minutes }));
  const two = M.balance(small, 2);
  assert.deepEqual(plain(two.map((s) => s.items.map((i) => i.room))), [['101', '102', '103'], ['201', '202', '203']]);
  assert.deepEqual(plain(two.map((s) => s.minutes)), [80, 70]);
  assert.deepEqual(plain(two.map((s) => s.floors)), [['1'], ['2']]);
  // More sections than rooms: one room each; none: nothing.
  assert.equal(M.balance(small, 10).length, 6);
  assert.deepEqual(plain(M.balance(small, 0)), []);
  // The neighbours rebalance: a heavy suite at the border moves to the lighter neighbour.
  const border = [['1', '101', 20], ['1', '102', 20], ['1', '103', 20], ['1', '104', 20], ['2', '201', 60], ['2', '202', 20]].map(([floor, room, minutes]) => ({ floor, room, minutes }));
  const b = M.balance(border, 2);
  assert.ok(Math.max(...b.map((s) => s.minutes)) - Math.min(...b.map((s) => s.minutes)) <= 60);

  // The example: 11 sections of 4 195 minutes, each on one or two neighbouring floors.
  const items = exampleItems(M);
  const sections = M.balance(items, 11);
  assert.equal(sections.length, 11);
  const sums = sections.map((s) => s.minutes);
  const largest = Math.max(...items.map((i) => i.minutes));
  assert.equal(largest, 120);
  assert.ok(Math.max(...sums) - Math.min(...sums) <= largest, `spread ${Math.max(...sums) - Math.min(...sums)}`);
  assert.ok(Math.max(...sums) - Math.min(...sums) <= 30, 'well within one room in practice');
  close(sums.reduce((a, v) => a + v, 0), 4195);
  assert.equal(sections.reduce((a, s) => a + s.items.length, 0), items.length);
  for (const s of sections) {
    assert.ok(s.floors.length <= 2, `${s.floors}`);
    if (s.floors.length === 2) assert.equal(Number(s.floors[1]) - Number(s.floors[0]), 1, 'neighbouring floors');
  }
  // Every section is under a shift of 408 productive minutes.
  for (const v of sums) assert.ok(v <= 408, String(v));

  // Any mix: the gap stays within the largest room, every room in one section, the minutes kept.
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let run = 0; run < 60; run++) {
    const n = 5 + Math.floor(rand() * 60);
    const list = Array.from({ length: n }, (_, i) => ({ floor: String(1 + Math.floor(rand() * 6)), room: String(100 + i), minutes: [15, 20, 25, 30, 35, 50, 120, 180][Math.floor(rand() * 8)] }));
    const k = 1 + Math.floor(rand() * Math.min(12, n));
    const out = M.balance(list, k);
    const s2 = out.map((s) => s.minutes);
    assert.equal(out.length, k);
    assert.ok(Math.max(...s2) - Math.min(...s2) <= Math.max(...list.map((i) => i.minutes)) + 1e-9, `run ${run}: ${s2}`);
    assert.equal(out.reduce((a, s) => a + s.items.length, 0), n);
    close(s2.reduce((a, v) => a + v, 0), list.reduce((a, i) => a + i.minutes, 0));
  }
});

test('typed counts become one item per clean, the linen and VIP inside the row', () => {
  const M = math();
  // Linen above the stay-overs and VIP above the rooms are clipped.
  assert.deepEqual(plain(M.cleanRow({ floor: ' 3 ', type: 'castle', departure: 2, stayover: 3, linen: 9, vip: 9, deep: 1 }, TYPES)), { floor: '3', type: 'double', departure: 2, stayover: 3, linen: 3, vip: 5, deep: 1 });
  const items = M.itemsFromRows([M.cleanRow({ floor: '6', type: 'suite', departure: 2, stayover: 5, linen: 1, vip: 3, deep: 0 }, TYPES)]);
  assert.deepEqual(plain(items.map((i) => `${i.clean}${i.vip ? '+vip' : ''}`)), ['departure+vip', 'departure+vip', 'linen+vip', 'stayover', 'stayover', 'stayover', 'stayover']);
  const s = settings();
  // Suite: 2 × (50 + 15) + (40 + 15) + 4 × 30 = 130 + 55 + 120 = 305.
  assert.equal(M.withMinutes(s, items).reduce((a, i) => a + i.minutes, 0), 305);
  const groups = M.groupLines(M.withMinutes(s, items));
  assert.deepEqual(plain(groups.map((g) => [g.clean, g.vip, g.n, g.minutes])), [['departure', true, 2, 130], ['linen', true, 1, 55], ['stayover', false, 4, 120]]);
});

// A board in the exact shape room-status.js keeps under sc-room-status (rooms, board entries with status, at, flags,
// attendant, note, started and ooo, the history, attendants, arrivals, filters, day, example).
const entry = (status, flags = [], extra = {}) => ({ status, at: `${TODAY} 07:00`, flags, attendant: '', note: '', started: '', ooo: null, ...extra });
const sampleBoard = (day = TODAY) => ({
  rooms: [
    { number: '101', floor: '1', type: 'double' }, { number: '102', floor: '1', type: 'double' }, { number: '103', floor: '1', type: 'single' },
    { number: '104', floor: '1', type: 'twin' }, { number: '105', floor: '1', type: 'double' }, { number: '106', floor: '1', type: 'double' },
    { number: '201', floor: '2', type: 'suite' }, { number: '202', floor: '2', type: 'double' }, { number: '203', floor: '2', type: 'double' },
    { number: '204', floor: '2', type: 'accessible' }, { number: '205', floor: '2', type: 'double' }, { number: '206', floor: '2', type: 'double' },
  ],
  board: {
    101: entry('do', ['arrival']), 102: entry('co'), 103: entry('vd'), 104: entry('od'), 105: entry('od', ['dnd']), 106: entry('occ'),
    201: entry('od', ['vip']), 202: entry('vi', ['vip', 'arrival']), 203: entry('vc'), 204: entry('ooo', [], { ooo: { reason: 'deepclean', back: TODAY, sent: false } }),
    205: entry('ooo', [], { ooo: { reason: 'plumbing', back: TODAY, sent: false } }), 206: entry('oos', [], { ooo: { reason: 'tv', back: '', sent: false } }),
  },
  history: { [TODAY]: [{ t: '07:05', room: '102', kind: 'status', from: 'do', to: 'co', who: '' }] },
  attendants: [{ name: 'Marta', floors: ['1'] }, { name: 'Ilir', floors: ['2'] }],
  arrivals: {}, filters: { status: '', floor: '', attendant: '', priority: false }, day, example: false,
});

test('Room Status: DO, CO and VD are departures, OD a stay-over, OCC served, OOO deep clean a deep clean', () => {
  const M = math();
  const rs = M.fromRoomStatus(sampleBoard(), { linenRooms: '104, 103', deepRooms: '203 105', today: TODAY, types: TYPES });
  const by = Object.fromEntries(rs.items.map((i) => [i.room, `${i.clean}${i.vip && i.clean !== 'vip' ? '+vip' : ''}`]));
  assert.deepEqual(plain(by), { 101: 'departure', 102: 'departure', 103: 'departure', 104: 'linen', 105: 'stayover', 201: 'stayover+vip', 202: 'vip', 203: 'deep', 204: 'deep' });
  assert.equal(rs.stale, false);
  assert.deepEqual(plain(rs.ignored), { linen: ['103'], deep: ['105'] }, 'a departure has no linen change; an occupied room is not deep-cleaned');
  assert.equal(rs.by.occ, 1);
  assert.equal(rs.by.out, 2, 'OOO for plumbing and OOS wait for maintenance');
  assert.equal(rs.arrivals, 2, 'flagged arrival today: 101 and 202');
  const s = settings({ publicHours: 0 });
  const p = M.plan(M.withMinutes(s, rs.items), s);
  // 30 (101) + 30 (102) + 25 (103 single) + 30 (104 twin, linen) + 20 (105) + 30 + 15 (201 suite + VIP) + 15 (202 VIP set-up)
  // + 120 (203 double deep) + 120 (204 accessible deep) = 435.
  assert.equal(p.totalMinutes, 435);
  assert.equal(p.departures, 3);
  assert.equal(p.stayovers, 3);
  assert.equal(p.linen, 1);
  assert.equal(p.vip, 2);
  assert.equal(p.deep, 2);
  assert.equal(p.cleaned, 8, 'the VIP set-up of a ready room is not a room cleaned');
  // A deep clean listed for a departure replaces it; arrivals typed in Room Status for today win over the flags.
  const listed = M.fromRoomStatus({ ...sampleBoard(), arrivals: { date: TODAY, n: 7 } }, { deepRooms: '102', today: TODAY, types: TYPES });
  assert.equal(listed.items.find((i) => i.room === '102').clean, 'deep');
  assert.equal(listed.by.co, 0);
  assert.equal(listed.arrivals, 7);
  assert.equal(listed.arrivalsTyped, true);
});

test('Room Status with yesterday\'s board: OCC counts as a stay-over and yesterday\'s arrival flags are left out', () => {
  const M = math();
  const rs = M.fromRoomStatus(sampleBoard('2026-10-23'), { today: TODAY, types: TYPES });
  assert.equal(rs.stale, true);
  assert.equal(rs.items.find((i) => i.room === '106').clean, 'stayover');
  assert.equal(rs.items.some((i) => i.room === '202'), false, 'no VIP set-up for yesterday\'s arrival');
  assert.equal(rs.arrivals, null);
});

test('Room Status: its own example board, read in the shape it writes, counts as its codes say', () => {
  const w = load({ page: false, scripts: ['tool-kit', 'room-status', 'housekeeping-planner'] });
  const ex = w.RoomStatusMath.exampleData(read(RS_DATA.en).example, TODAY);
  const state = plain({ ...ex, arrivals: {}, filters: {}, day: TODAY, example: true });
  const rs = w.HousekeepingPlannerMath.fromRoomStatus(state, { today: TODAY, types: TYPES });
  const count = (codes) => Object.values(state.board).filter((e) => codes.includes(e.status)).length;
  assert.equal(rs.items.filter((i) => i.clean === 'departure').length, count(['do', 'co', 'vd']));
  assert.equal(rs.items.filter((i) => i.clean === 'stayover').length, count(['od']));
  assert.equal(rs.by.occ, count(['occ']));
  assert.equal(rs.by.out, count(['ooo', 'oos']), 'its OOO is plumbing, its OOS the TV');
  assert.equal(rs.rooms, 40);
  // A VIP counts where the flag sits on a room with a clean today, or on a clean room with an arrival (its VIP set-up).
  const vip = Object.entries(state.board).filter(([, e]) => e.flags.includes('vip') && (['do', 'co', 'vd', 'od'].includes(e.status) || (['vc', 'vi'].includes(e.status) && e.flags.includes('arrival')))).map(([n]) => n).sort();
  assert.deepEqual(plain(rs.items.filter((i) => i.vip).map((i) => i.room).sort()), vip);
});

test('apply sets only the attendant of each room, and undo puts the previous ones back', () => {
  const M = math();
  const before = sampleBoard();
  before.board['101'].attendant = 'Marta';
  const assignment = { 101: 'Sofia', 102: 'Sofia', 201: 'Jonas', 999: 'Nobody' };
  const r = M.applyAttendants(plain(before), assignment);
  assert.deepEqual(plain(r.prev), { 101: 'Marta', 102: '', 201: '' });
  assert.deepEqual(plain(r.set), { 101: 'Sofia', 102: 'Sofia', 201: 'Jonas' }, 'a room not on the board is left out');
  const after = plain(r.state);
  // Everything but those three attendants is unchanged.
  const strip = (s) => { const c = plain(s); Object.values(c.board).forEach((e) => { e.attendant = ''; }); return c; };
  assert.deepEqual(strip(after), strip(before));
  assert.equal(after.board['101'].attendant, 'Sofia');
  assert.equal(after.board['202'].attendant, '');
  // Undo: back to exactly what it was.
  const u = M.undoAttendants(after, { set: r.set, prev: r.prev });
  assert.deepEqual(plain(u.state), plain(before));
  // A room changed again in Room Status since keeps that change.
  const changed = plain(after);
  changed.board['201'].attendant = 'Elena';
  const u2 = M.undoAttendants(changed, { set: r.set, prev: r.prev });
  assert.deepEqual(plain(u2.kept), ['201']);
  assert.equal(u2.state.board['201'].attendant, 'Elena');
  assert.equal(u2.state.board['101'].attendant, 'Marta');
});

test('the week: workload of each day from today\'s mix, attendants needed against scheduled', () => {
  const M = math();
  const s = settings();
  const items = exampleItems(M, s);
  const r = M.weekRates(items, s);
  // Per departure (with its VIP set-ups): (1 650 + 3 × 15) ÷ 52 = 32.60; per stay-over: (1 305 + 850 + 15) ÷ 96 = 22.60;
  // the daily programme: 330 deep-clean minutes; public areas 360.
  close(r.departure, 1695 / 52);
  close(r.stayover, 2170 / 96);
  assert.equal(r.daily, 330);
  assert.equal(r.publicUnits, 360);
  const days = M.weekPlan(cfg.example.week.map((d) => ({ date: `D${d.day}`, ...d })), r, s);
  // Day 0 is today: 52 × 32.60 + 96 × 22.60 + 330 + 360 = 4 555, the same 12 as the plan of the day.
  close(days[0].minutes, 4555);
  assert.equal(days[0].needed, 12);
  // Day 3: 166 occupied, 62 departures → 104 stay-overs: 62 × 32.60 + 104 × 22.60 + 690 = 5 061.8 → ⌈12.41⌉ = 13, 12 scheduled.
  assert.equal(days[3].stayovers, 104);
  close(days[3].minutes, 62 * 1695 / 52 + 104 * 2170 / 96 + 690);
  assert.equal(days[3].needed, 13);
  assert.equal(days[3].diff, -1);
  assert.deepEqual(plain(days.map((d) => d.needed)), [12, 12, 12, 13, 13, 12, 10]);
  assert.deepEqual(plain(days.map((d) => d.diff)), [-2, 0, 0, -1, 0, -1, 0]);
  // Without rooms today a double stands in: departure 30, stay-over (2 × 20 + 25) ÷ 3 = 21.67 with a change every third night.
  const empty = M.weekRates([], s);
  assert.equal(empty.departure, 30);
  close(empty.stayover, 65 / 3);
  assert.equal(empty.fromToday, false);
  // A day without a forecast has no need.
  assert.equal(M.weekPlan([{ date: 'X', occupied: null, departures: null, scheduled: 3 }], r, s)[0].needed, null);
});

test('the pasted forecast: date; occupied; departures; scheduled, in either date format, headers skipped', () => {
  const w = load({ page: false, scripts: ['tool-kit', 'housekeeping-planner'] });
  const { rows, skipped } = w.HousekeepingPlannerMath.parseWeek('Date;Occupied;Departures;Scheduled\n2026-10-26; 154; 44; 12\n27.10.2026\t160\t40\n2026-10-28,166,62,12\n', w.ToolKit.parseDate);
  assert.equal(skipped, 1);
  assert.deepEqual(plain(rows), [
    { date: '2026-10-26', occupied: 154, departures: 44, scheduled: 12 },
    { date: '2026-10-27', occupied: 160, departures: 40, scheduled: null },
    { date: '2026-10-28', occupied: 166, departures: 62, scheduled: 12 },
  ]);
});

test('a first visit opens on the example: 12 needed for 10 scheduled, 11 sections, the week and the action', () => {
  const w = load();
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /12 attendants needed/);
  assert.match(results.querySelector('h2').textContent, /2 short/);
  assert.equal(results.querySelectorAll('.hp-section').length, 11);
  assert.match(results.querySelector('.hp-section h4').textContent, /Marta/);
  assert.match([...results.querySelectorAll('.hp-section h4')].at(-1).textContent, /Housekeeping section 11/, 'the eleventh section has no attendant yet');
  assert.ok(results.querySelectorAll('svg').length >= 2, 'the sections chart and the week chart');
  assert.match(results.querySelector('.hp-formula').textContent, /⌈4,555 ÷ 408⌉ = ⌈11\.16⌉ = 12/);
  assert.equal(results.querySelectorAll('.hp-week-table tr.is-short').length, 3);
  const action = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Add to actions');
  assert.ok(action, 'understaffed: an action for the tracker');
  click(w, action);
  const url = new URL(action.href);
  assert.equal(url.searchParams.get('source'), 'housekeeping-planner');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('action'), /12 attendants needed, 10 scheduled/);
  assert.match(w.document.querySelector('.hp-example-note').textContent, /180-room hotel/);
  assert.equal(w.localStorage.getItem('sc-housekeeping-planner'), null, 'nothing is written until the visitor acts');
  // The print sheets: one per section, with start and finish columns.
  const sheets = w.document.querySelectorAll('[data-print] .hp-print-person');
  assert.equal(sheets.length, 11);
  assert.ok([...sheets[0].querySelectorAll('th')].some((th) => th.textContent === 'Finish'));
  // The short days of the week go to the Action Tracker once.
  const send = [...results.querySelectorAll('button')].find((b) => /short days to actions/.test(b.textContent));
  click(w, send);
  click(w, send);
  const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
  assert.equal(actions.length, 3);
  assert.ok(actions.every((a) => a.source === 'housekeeping-planner' && a.priority === 'High'));
});

test('a typed count changes the plan and is saved; the German page keeps its own key', () => {
  const w = load();
  const input = w.document.querySelector('#hp-row-0-departure');
  input.value = '20';
  input.dispatchEvent(new w.Event('input', { bubbles: true }));
  const saved = JSON.parse(w.localStorage.getItem('sc-housekeeping-planner'));
  assert.equal(saved.rows[0].departure, 20);
  assert.equal(saved.example, false);
  // 14 more single departures: 4 555 + 14 × 25 = 4 905 → ⌈12.02⌉ = 13.
  assert.match(w.document.querySelector('[data-results] h2').textContent, /13 attendants needed/);
  const de = load({ lang: 'de' });
  assert.equal(de.document.querySelector('[data-results]').hidden, false);
  assert.equal(de.localStorage.getItem('sc-housekeeping-planner-de'), null);
  assert.ok(de.document.querySelector('a[data-room-status]').getAttribute('href').startsWith('/de/tools/room-status/'));
});

test('from Room Status on the page: the sections are applied after reading the board again, and undone', () => {
  const board = sampleBoard();
  const w = load({ storage: { 'sc-room-status': board, 'sc-housekeeping-planner': { source: 'rooms', names: ['Marta', 'Ilir'], sections: 2 } } });
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.querySelectorAll('.hp-section').length, 2);
  assert.match(w.document.querySelector('[data-rs-summary]').textContent, /3 departures \(DO 1, CO 1, VD 1\)/);
  // Room Status changes after the plan was drawn (a note in another tab): the apply keeps it.
  const changed = plain(board);
  changed.board['104'].note = 'Extra pillow';
  w.localStorage.setItem('sc-room-status', JSON.stringify(changed));
  const apply = [...results.querySelectorAll('button')].find((b) => b.textContent === 'Apply sections to Room Status');
  click(w, apply);
  const after = JSON.parse(w.localStorage.getItem('sc-room-status'));
  assert.equal(after.board['104'].note, 'Extra pillow');
  const names = Object.fromEntries(Object.entries(after.board).map(([n, e]) => [n, e.attendant]));
  // Work: floor 1 125 min (30 + 30 + 25 + 20 + 20), floor 2 180 (201 suite 30 + VIP 15, 202 VIP set-up 15, 204 deep 120).
  // Two sections of 305 ÷ 2 = 152.5: the running total is nearest after 201 (170, not 125), so Marta takes floor 1 and
  // 201, Ilir 202 and 204: 170 and 135 minutes, 35 apart instead of 55. Rooms without work keep no attendant.
  assert.deepEqual(names, { 101: 'Marta', 102: 'Marta', 103: 'Marta', 104: 'Marta', 105: 'Marta', 106: '', 201: 'Marta', 202: 'Ilir', 203: '', 204: 'Ilir', 205: '', 206: '' });
  const strip = (s) => { const c = plain(s); Object.values(c.board).forEach((e) => { e.attendant = ''; }); return c; };
  assert.deepEqual(strip(after), strip(changed), 'only the attendants changed');
  assert.match(w.document.querySelector('.hp-apply-note').textContent, /attendant of 8 rooms/);
  click(w, w.document.querySelector('.hp-apply-note .dl-undo'));
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-room-status')), changed);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-housekeeping-planner')).lastApply, null);
});
