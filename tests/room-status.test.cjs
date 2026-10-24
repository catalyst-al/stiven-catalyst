// Room Status (src/js/room-status.js): the arithmetic in window.RoomStatusMath (status transitions and what goes with
// them, the history, the turnaround minutes worked by hand, the queue order, the PMS import mapping, the out-of-order
// share, the seeded example), the three data files, and the page itself: the example on a first visit, a room changed
// through its sheet and kept in the history, undo, the PMS import, OOO to the Action Tracker and the rooms of Room
// Inspection reused.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/roomStatus.json', de: 'src/_data/de/roomStatus.json', sq: 'src/_data/sq/roomStatus.json' };
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/room-status.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const windows = [];
const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/room-status/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'room-status']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  windows.push(w);
  return w;
};
// The page redraws every minute; close the windows so their timers end with the test.
test.afterEach(() => { while (windows.length) windows.pop().close(); });
const saved = (w, key = 'sc-room-status') => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const change = (w, input) => input.dispatchEvent(new w.Event('change', { bubbles: true }));
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
const math = () => load({ page: false }).RoomStatusMath;
const ctx = (time) => ({ date: TODAY, time });

test('the three data files share one shape, the same keys, codes and example, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-room-status');
  assert.equal(en.inspectionKey, 'sc-room-inspection');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-room-status-${lang}`, `${lang} keeps its own work`);
    assert.equal(other.inspectionKey, `sc-room-inspection-${lang}`, `${lang} reads its own Room Inspection`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    for (const list of ['statuses', 'flags', 'roomTypes', 'oooReasons']) assert.deepEqual(other[list].map((x) => x.key), en[list].map((x) => x.key), `${lang} ${list}`);
    // The status codes are the PMS codes, the same in every language; so are the aliases the import reads.
    assert.deepEqual(other.statuses.map((s) => [s.code, s.aliases]), en.statuses.map((s) => [s.code, s.aliases]));
    const { notes: a, ...restEn } = en.example;
    const { notes: b, ...restOther } = other.example;
    assert.deepEqual(restOther, restEn, `${lang}: the example is the same hotel`);
    assert.deepEqual(Object.keys(b), Object.keys(a));
    assert.equal(other.tips.length, en.tips.length);
    for (const s of other.statuses) assert.ok(s.name && s.short && s.meaning, `${lang} ${s.key}`);
  }
  assert.deepEqual(en.statuses.map((s) => s.code), ['VD', 'VC', 'VI', 'OCC', 'OD', 'DO', 'CO', 'OOO', 'OOS']);
  assert.deepEqual(en.flags.map((f) => f.key), ['dnd', 'vip', 'early', 'arrival']);
});

test('the room types include those of Room Inspection, so its rooms can be reused', () => {
  const mine = read(DATA.en).roomTypes.map((t) => t.key);
  for (const type of read('src/_data/roomInspection.json').roomTypes) assert.ok(mine.includes(type.key), type.key);
});

test('a status change is one event with its time, and brings what goes with it in practice', () => {
  const M = math();
  const start = { ...M.blankEntry('do'), flags: ['dnd', 'vip'], attendant: 'Marta' };
  // Check-out: the guest's DND and VIP leave with the guest.
  let r = M.transition(start, { status: 'co' }, ctx('09:12'), '204');
  assert.deepEqual(plain(r.events[0]), { t: '09:12', room: '204', kind: 'status', from: 'do', to: 'co', who: 'Marta' });
  assert.equal(r.entry.status, 'co');
  assert.equal(r.entry.at, `${TODAY} 09:12`);
  assert.deepEqual(plain(r.entry.flags), []);
  assert.deepEqual(plain(r.events.slice(1).map((e) => [e.kind, e.flag, e.to])), [['flag', 'dnd', 'off'], ['flag', 'vip', 'off']]);
  // With an arrival today the VIP is the arriving guest and stays.
  r = M.transition({ ...M.blankEntry('do'), flags: ['vip', 'arrival'] }, { status: 'co' }, ctx('09:20'), '310');
  assert.deepEqual(plain(r.entry.flags), ['vip', 'arrival']);
  // The attendant goes in, then reports the room clean: no longer in progress.
  r = M.transition(r.entry, { start: true }, ctx('09:30'), '310');
  assert.equal(r.entry.started, `${TODAY} 09:30`);
  assert.equal(r.events[0].kind, 'start');
  r = M.transition(r.entry, { status: 'vc' }, ctx('10:05'), '310');
  assert.equal(r.entry.started, '');
  // A start on a clean room means nothing.
  assert.equal(M.transition(r.entry, { start: true }, ctx('10:06'), '310').events.length, 0);
  r = M.transition(r.entry, { status: 'vi' }, ctx('10:20'), '310');
  // Check-in: the arrival flags are done, the VIP stays for the stay.
  r = M.transition({ ...r.entry, flags: ['vip', 'early', 'arrival'] }, { status: 'occ' }, ctx('14:02'), '310');
  assert.deepEqual(plain(r.entry.flags), ['vip']);
  // A stay-over serviced (OD → OCC) keeps its flags.
  r = M.transition({ ...M.blankEntry('od'), flags: ['vip'] }, { status: 'occ' }, ctx('11:00'), '410');
  assert.deepEqual(plain(r.entry.flags), ['vip']);
  // The same status again changes nothing and logs nothing.
  assert.equal(M.transition(r.entry, { status: 'occ' }, ctx('11:01'), '410').events.length, 0);
});

test('OOO keeps a reason and a date, and loses them when the room is back', () => {
  const M = math();
  let r = M.transition(M.blankEntry('vi'), { status: 'ooo' }, ctx('08:00'), '305');
  assert.deepEqual(plain(r.entry.ooo), { reason: '', back: '', sent: false });
  r = M.transition(r.entry, { ooo: { reason: 'plumbing', back: '2026-10-26' } }, ctx('08:01'), '305');
  assert.deepEqual(plain(r.entry.ooo), { reason: 'plumbing', back: '2026-10-26', sent: false });
  assert.deepEqual(plain(r.events), [{ t: '08:01', room: '305', kind: 'ooo', from: '', to: 'plumbing', who: '', back: '2026-10-26' }]);
  r = M.transition({ ...r.entry, ooo: { ...r.entry.ooo, sent: true } }, { ooo: { back: '2026-10-27' } }, ctx('08:02'), '305');
  assert.equal(r.entry.ooo.sent, true, 'a new date keeps the action sent');
  r = M.transition(r.entry, { status: 'vd' }, ctx('16:00'), '305');
  assert.equal(r.entry.ooo, null);
  // An OOO reason on a room that is not out of order is ignored.
  assert.equal(M.transition(M.blankEntry('vi'), { ooo: { reason: 'tv' } }, ctx('09:00'), '101').events.length, 0);
  // Attendant and note are logged too.
  r = M.transition(M.blankEntry('od'), { attendant: 'Ilir', note: 'Extra towels' }, ctx('09:00'), '204');
  assert.deepEqual(plain(r.events.map((e) => [e.kind, e.from, e.to])), [['attendant', '', 'Ilir'], ['note', '', 'Extra towels']]);
});

test('a new day turns occupied rooms into stay-overs and clears yesterday\'s marks', () => {
  const M = math();
  const board = {
    101: { ...M.blankEntry('occ'), flags: ['vip', 'dnd'] },
    102: { ...M.blankEntry('vi'), flags: ['arrival', 'early'] },
    103: { ...M.blankEntry('od'), started: `2026-10-23 15:00` },
    104: M.blankEntry('ooo'),
  };
  const r = M.newDay(board, ctx('06:30'));
  assert.equal(r.board[101].status, 'od');
  assert.deepEqual(plain(r.board[101].flags), ['vip']);
  assert.deepEqual(plain(r.board[102].flags), []);
  assert.equal(r.board[102].status, 'vi');
  assert.equal(r.board[103].started, '');
  assert.equal(r.board[104].status, 'ooo');
  assert.equal(r.events.filter((e) => e.kind === 'status').length, 1);
});

test('turnaround minutes, worked by hand', () => {
  const M = math();
  const s = (t, room, from, to) => ({ t, room, kind: 'status', from, to, who: '' });
  const events = [
    // A: departed 08:00, clean 08:40 (40 min), inspected 09:05 (25 min).
    s('08:00', 'A', 'do', 'co'), s('08:40', 'A', 'co', 'vc'), s('09:05', 'A', 'vc', 'vi'),
    // B: departed 08:10, clean 09:20 (70), failed at 09:30, clean again 09:55, inspected 10:00 (5 from the last VC).
    s('08:10', 'B', 'do', 'co'), s('09:20', 'B', 'co', 'vc'), s('09:30', 'B', 'vc', 'vd'), s('09:55', 'B', 'vd', 'vc'), s('10:00', 'B', 'vc', 'vi'),
    // C: dirty since last night, no departure today: only clean → inspected counts (20).
    s('07:30', 'C', 'vd', 'vc'), s('07:50', 'C', 'vc', 'vi'),
    // D: departed 09:00, set VD at 09:10 (still dirty, the clock runs), clean 09:45 (45), not inspected yet.
    s('09:00', 'D', 'do', 'co'), s('09:10', 'D', 'co', 'vd'), s('09:45', 'D', 'vd', 'vc'),
    // E: departed, then out of order: the clock stops, nothing counts.
    s('08:30', 'E', 'do', 'co'), s('08:50', 'E', 'co', 'ooo'), s('11:00', 'E', 'ooo', 'vc'),
    { t: '09:00', room: 'A', kind: 'flag', flag: 'dnd', from: 'off', to: 'on', who: '' },
  ];
  const t = M.turnaround(events);
  assert.deepEqual(plain(t.clean.pairs.map((p) => [p.room, p.minutes])), [['A', 40], ['B', 70], ['D', 45]]);
  assert.equal(t.clean.sum, 155);
  assert.equal(t.clean.n, 3);
  assert.ok(Math.abs(t.clean.avg - 155 / 3) < 1e-9);
  assert.deepEqual(plain(t.inspect.pairs.map((p) => [p.room, p.minutes])).sort(), [['A', 25], ['B', 5], ['C', 20]].sort());
  assert.equal(t.inspect.avg, 50 / 3);
  // Order of the list does not matter: the events are read by their time.
  assert.equal(M.turnaround([...events].reverse()).clean.sum, 155);
  assert.equal(M.turnaround([]).clean.avg, null);
  // By hour: departures, cleanings and inspections in each hour from the first to the last event.
  const hours = M.byHour(events);
  assert.deepEqual(plain(hours.map((h) => [h.label, h.departed, h.cleaned, h.inspected])), [
    ['07:00', 0, 1, 1], ['08:00', 3, 1, 0], ['09:00', 1, 3, 1], ['10:00', 0, 0, 1], ['11:00', 0, 0, 0],
  ]);
  assert.deepEqual(plain(hours[1].cleanMinutes), [40]);
});

test('the queue: early and VIP arrivals, departures with an arrival, other departures, VIP stay-overs, stay-overs', () => {
  const M = math();
  const rooms = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111'].map((number) => ({ number, floor: '1', type: 'double' }));
  const e = (status, flags = [], at = `${TODAY} 08:00`, extra = {}) => ({ ...M.blankEntry(status), flags, at, ...extra });
  const board = {
    101: e('od'),
    102: e('co', ['arrival'], `${TODAY} 09:30`),
    103: e('co', [], `${TODAY} 08:10`),
    104: e('co', ['arrival'], `${TODAY} 08:45`),
    105: e('vd', ['vip', 'arrival'], `${TODAY} 07:00`),
    106: e('co', ['early', 'arrival'], `${TODAY} 09:50`),
    107: e('od', ['vip']),
    108: e('od', ['dnd']),
    109: e('co', ['arrival'], `${TODAY} 07:40`, { started: `${TODAY} 09:00` }),
    110: e('vc', ['arrival']),
    111: e('do', ['arrival']),
  };
  const q = M.queue(rooms, board);
  assert.deepEqual(plain(q.map((item) => [item.room.number, item.tier])), [
    ['106', 0], ['105', 0], ['104', 1], ['102', 1], ['103', 2], ['107', 3], ['101', 4],
  ]);
  // DND, in progress, clean and due-out rooms are not in it.
  assert.equal(M.tierOf(board[108]), null);
  assert.equal(M.tierOf(board[109]), null);
  assert.equal(M.tierOf(board[110]), null);
  assert.equal(M.tierOf(board[111]), null);
  // A priority flag on a stay-over puts it first too.
  assert.equal(M.tierOf(e('od', ['early'])), 0);
  const inspect = M.inspectQueue(rooms, { ...board, 101: e('vc', [], `${TODAY} 07:00`) });
  assert.deepEqual(plain(inspect.map((item) => item.room.number)), ['110', '101']);
});

test('the PMS import maps the common codes in any case and lists the rest, never guessing', () => {
  const M = math();
  const statuses = read(DATA.en).statuses;
  const text = 'Room\tStatus\n101\tvd\n102\tOC\n103\tocc\n104; OD\n105, Do\n106 c/o\n107 CO\n108 OOO\n109 oos\n110 VI\n111 vr\n112 vc\n113 DI\n114\n999 VD\n101 VC\n';
  const rooms = ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114'];
  const r = M.parseImport(text, statuses, rooms);
  assert.deepEqual(plain(r.updates.map((u) => [u.room, u.status])), [
    ['101', 'vc'], ['102', 'occ'], ['103', 'occ'], ['104', 'od'], ['105', 'do'], ['106', 'co'], ['107', 'co'], ['108', 'ooo'], ['109', 'oos'], ['110', 'vi'], ['111', 'vi'], ['112', 'vc'],
  ]);
  assert.deepEqual(plain(r.unknownCodes), [{ room: '113', code: 'DI' }, { room: '114', code: '' }]);
  assert.deepEqual(plain(r.unknownRooms), [{ room: '999', code: 'VD' }]);
  assert.equal(r.skipped, 1, 'the header');
});

test('counts: ready against arrivals, rooms to clean, and the share of the inventory out of order', () => {
  const M = math();
  const rooms = Array.from({ length: 40 }, (_, i) => ({ number: String(101 + i), floor: '1', type: 'double' }));
  const board = Object.fromEntries(rooms.map((room) => [room.number, M.blankEntry('occ')]));
  board[101] = M.blankEntry('ooo');
  board[102] = M.blankEntry('ooo');
  board[103] = M.blankEntry('oos');
  board[104] = { ...M.blankEntry('vi'), flags: ['arrival'] };
  board[105] = { ...M.blankEntry('vi'), flags: [] };
  board[106] = { ...M.blankEntry('co'), flags: ['arrival'], started: `${TODAY} 09:00` };
  board[107] = { ...M.blankEntry('od'), flags: ['dnd'] };
  board[108] = M.blankEntry('vd');
  const c = M.counts(rooms, board);
  assert.equal(c.total, 40);
  // OOO share = OOO rooms / all rooms = 2 / 40; OOS stays in the sellable inventory.
  assert.equal(c.oooShare, 0.05);
  assert.equal(c.sellable, 38);
  assert.equal(c.oos, 1);
  assert.equal(c.ready, 2);
  assert.equal(c.arrivals, 2, 'from the flags');
  assert.equal(c.readyArrivals, 1);
  assert.equal(c.needed, 0);
  assert.equal(c.toClean, 3);
  assert.equal(c.departures, 2);
  assert.equal(c.stayovers, 1);
  assert.equal(c.inProgress, 1);
  assert.equal(c.dnd, 1);
  const typed = M.counts(rooms, board, 5);
  assert.equal(typed.arrivals, 5);
  assert.equal(typed.needed, 3);
  assert.equal(M.counts([], {}).oooShare, 0);
});

test('the example adds up: the morning replayed gives the board, the queue and the turnaround worked by hand', () => {
  const M = math();
  const cfg = read(DATA.en);
  const ex = M.exampleData(cfg.example, TODAY);
  assert.equal(ex.rooms.length, 40);
  assert.deepEqual([...new Set(ex.rooms.map((r) => r.floor))], ['1', '2', '3', '4']);
  const c = M.counts(ex.rooms, ex.board);
  const by = plain(c.by);
  // 14 departures (11 checked out, 3 still due out), 20 stay-overs (6 serviced), 2 VD from last night, 2 VI, 1 OOO, 1 OOS.
  assert.deepEqual(by, { vd: 0, vc: 1, vi: 10, occ: 6, od: 14, do: 3, co: 4, ooo: 1, oos: 1 });
  assert.equal(Object.values(by).reduce((s, n) => s + n, 0), 40);
  assert.equal(c.arrivals, 15);
  assert.equal(c.readyArrivals, 10);
  assert.equal(c.needed, 5);
  assert.equal(c.toClean, 18);
  assert.equal(c.inProgress, 4);
  assert.equal(c.dnd, 2);
  assert.equal(c.oooShare, 1 / 40);
  const events = ex.history[TODAY];
  assert.equal(events.filter((e) => e.kind === 'status' && e.to === 'co').length, 11);
  // Departed → clean: 104 45, 202 65, 402 50, 101 70, 301 50, 207 60, 304 50 = 390 min / 7 rooms.
  const t = M.turnaround(events);
  assert.equal(t.clean.sum, 390);
  assert.equal(t.clean.n, 7);
  // Clean → inspected: 405 15, 205 20, 402 15, 202 25, 301 25, 104 10 (after its re-clean), 101 35, 207 15 = 160 / 8.
  assert.equal(t.inspect.sum, 160);
  assert.equal(t.inspect.avg, 20);
  const q = plain(M.queue(ex.rooms, ex.board).map((item) => item.room.number));
  assert.deepEqual(q.slice(0, 4), ['406', '206', '109', '110']);
  assert.equal(q.length, 12, '18 to clean less 4 in progress and 2 DND');
  const people = plain(M.perAttendant(ex.rooms, ex.board, events));
  assert.deepEqual(people.map((p) => [p.name, p.assigned, p.done]), [['Ilir', 9, 4], ['Jonas', 10, 4], ['Marta', 9, 4], ['Sofia', 8, 3]]);
  // Every event's room is a room of the hotel and every status in the history leads to the board.
  for (const room of ex.rooms) {
    const last = events.filter((e) => e.kind === 'status' && e.room === room.number).at(-1);
    if (last) assert.equal(ex.board[room.number].status, last.to, room.number);
  }
});

test('rooms: generated, pasted (room, type, floor), merged, and the history trimmed to 30 days', () => {
  const M = math();
  const types = read(DATA.en).roomTypes;
  const gen = M.generateRooms({ floorFrom: 1, floorTo: 2, roomFrom: 1, roomTo: 3, type: 'twin' });
  assert.deepEqual(plain(gen.map((r) => r.number)), ['101', '102', '103', '201', '202', '203']);
  const pasted = M.parseRooms('Room;Type;Floor\n101; suite; 1\n1203 single\n0012; Accessible; 0\n', types);
  assert.deepEqual(plain(pasted.rooms), [{ number: '101', floor: '1', type: 'suite' }, { number: '1203', floor: '12', type: 'single' }, { number: '0012', floor: '0', type: 'accessible' }]);
  assert.equal(pasted.skipped, 1);
  const merged = M.mergeRooms(gen, pasted.rooms);
  assert.equal(merged.find((r) => r.number === '101').type, 'suite');
  assert.equal(merged.length, 8);
  assert.deepEqual(plain(M.parseNames('Marta; 1, 2\nIlir\nmarta')), [{ name: 'Marta', floors: ['1', '2'] }, { name: 'Ilir', floors: [] }]);
  assert.equal(M.sectionOf([{ name: 'Marta', floors: ['1', '2'] }], 2), 'Marta');
  const history = { '2026-09-24': [1], '2026-09-25': [2], '2026-10-24': [3], '2026-10-25': [4], bad: [5] };
  assert.deepEqual(Object.keys(M.trimHistory(history, TODAY, 30)), ['2026-09-25', '2026-10-24']);
  assert.equal(M.minutes('09:45'), 585);
  assert.ok(Number.isNaN(M.minutes('9.45')));
});

test('a first visit opens on the example; a room changed in its sheet is saved with its time, and undo puts it back', () => {
  const w = load();
  const d = w.document;
  assert.equal(d.querySelectorAll('.rs-tile').length, 40);
  assert.equal(d.querySelector('.rs-example-note').hidden, false);
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /^10 of 15/);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 2, 'status mix and turnaround charts');
  assert.match(results.textContent, /56 min/);
  assert.match(results.textContent, /20 min/);
  assert.equal(results.querySelector('.rs-queue-room').textContent, '406');
  assert.equal(w.localStorage.getItem('sc-room-status'), null, 'nothing written before the visitor acts');
  // Room 304 (VC) is inspected: tap, choose VI.
  click(w, d.querySelector('.rs-tile[data-room="304"]'));
  const sheet = d.querySelector('[data-sheet]');
  assert.equal(sheet.querySelector('[data-sheet-title]').textContent, 'Room 304');
  assert.equal(sheet.querySelector('[data-inspect]').hidden, false, 'a VC room offers the inspection');
  assert.match(sheet.querySelector('[data-inspect-room]').textContent, /304/);
  const vi = sheet.querySelector('input[name="rs-status"][value="vi"]');
  vi.checked = true;
  change(w, vi);
  let s = saved(w);
  assert.equal(s.board['304'].status, 'vi');
  const last = s.history[TODAY].at(-1);
  assert.deepEqual(last, { t: '10:45', room: '304', kind: 'status', from: 'vc', to: 'vi', who: 'Sofia' }, 'the example keeps its own clock');
  assert.match(d.querySelector('[data-results] h2').textContent, /^11 of 15/);
  // Clean → inspected now has 304 too: (160 + 50) / 9.
  const t = w.RoomStatusMath.turnaround(s.history[TODAY]);
  assert.equal(t.inspect.sum, 210);
  click(w, d.querySelector('[data-board-status] .dl-undo'));
  s = saved(w);
  assert.equal(s.board['304'].status, 'vc');
  assert.equal(s.history[TODAY].filter((e) => e.room === '304' && e.to === 'vi').length, 0);
});

test('the PMS import changes the known rooms and lists unknown codes and rooms', () => {
  const w = load();
  const d = w.document;
  d.querySelector('#rs-import').value = '106 CO\n307 xx\n999 VD\n409 co';
  click(w, d.querySelector('[data-import]'));
  const s = saved(w);
  assert.equal(s.board['106'].status, 'co');
  assert.equal(s.board['409'].status, 'co');
  assert.equal(s.board['307'].status, 'do', 'an unknown code leaves the room alone');
  const note = d.querySelector('[data-import-status]').textContent;
  assert.match(note, /2 rooms read, 2 changed/);
  assert.match(note, /307 “xx”/);
  assert.match(note, /999/);
});

test('an OOO room with a reason goes to the Action Tracker once, with the floor as its area', () => {
  const w = load();
  const d = w.document;
  click(w, d.querySelector('.rs-tile[data-room="305"]'));
  const sheet = d.querySelector('[data-sheet]');
  assert.equal(sheet.querySelector('[data-ooo]').hidden, false);
  const send = sheet.querySelector('[data-send-ooo]');
  click(w, send);
  const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
  assert.equal(actions.length, 1);
  assert.equal(actions[0].source, 'room-status');
  assert.equal(actions[0].area, 'Floor 3');
  assert.equal(actions[0].priority, 'High');
  assert.equal(actions[0].due, '2026-10-26', 'the date it is expected back');
  assert.match(actions[0].title, /Room 305 OOO: Plumbing/);
  assert.equal(saved(w).board['305'].ooo.sent, true);
  assert.equal(send.disabled, true);
  // The summary for the handover names it.
  assert.ok(sheet.querySelector('[data-sheet-status] a').href.endsWith('/tools/action-tracker/'));
  assert.match(d.querySelector('a[data-maintenance]').getAttribute('href'), /^\/tools\/maintenance-planner\/$/);
});

test('the rooms of Room Inspection are offered, and a German page keeps its own key and links', () => {
  const ri = { rooms: [{ number: '501', floor: '5', type: 'suite' }, { number: '502', floor: '5', type: 'double' }], attendants: [{ name: 'Petra', floors: ['5'] }], rows: [] };
  const w = load({ lang: 'de', storage: { 'sc-room-status-de': { rooms: [], board: {}, history: {} }, 'sc-room-inspection-de': ri } });
  const d = w.document;
  assert.equal(d.querySelectorAll('.rs-tile').length, 0, 'no example once something is saved');
  const button = d.querySelector('[data-from-inspection]');
  assert.equal(button.hidden, false);
  click(w, button);
  const s = saved(w, 'sc-room-status-de');
  assert.deepEqual(s.rooms.map((r) => r.number), ['501', '502']);
  assert.equal(s.board['501'].status, 'vd');
  assert.deepEqual(s.attendants, [{ name: 'Petra', floors: ['5'] }]);
  assert.equal(w.localStorage.getItem('sc-room-status'), null);
  assert.equal(d.querySelector('a[data-maintenance]').getAttribute('href'), '/de/tools/maintenance-planner/');
  // A room set dirty goes to the attendant of its section.
  click(w, d.querySelector('.rs-tile[data-room="502"]'));
  const co = d.querySelector('input[name="rs-status"][value="co"]');
  co.checked = true;
  change(w, co);
  assert.equal(saved(w, 'sc-room-status-de').board['502'].attendant, 'Petra');
});

test('the summary for the handover carries the board, and the board and attendant sheets print', () => {
  const w = load();
  const d = w.document;
  const button = (text) => [...d.querySelectorAll('[data-results] button')].find((b) => b.textContent === text);
  const print = d.querySelector('[data-print]');
  click(w, button('Print the board'));
  assert.equal(print.querySelectorAll('.rs-print-floor').length, 4);
  assert.equal(print.querySelectorAll('.rs-print-cell').length, 40);
  click(w, button('Print attendant sheets'));
  const sheets = [...print.querySelectorAll('.rs-print-person')];
  assert.deepEqual(sheets.map((page) => page.querySelector('h2').textContent), ['Ilir', 'Jonas', 'Marta', 'Sofia']);
  // Jonas's sheet starts with his next room in the queue: 406, the early arrival.
  assert.equal(sheets[1].querySelector('tbody td').textContent, '406');
  let copied = '';
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } }, configurable: true });
  const copyButton = [...d.querySelectorAll('[data-results] button')].find((b) => b.textContent === 'Copy summary');
  click(w, copyButton);
  return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
    assert.match(copied, /Ready \(VI\): 10 · arrivals expected: 15 · still needed: 5/);
    assert.match(copied, /Next to clean:\n- 406 · CO/);
    assert.match(copied, /305 OOO · Plumbing \/ water/);
    assert.match(copied, /2\.5%/);
  });
});
