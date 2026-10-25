// Print Pack (src/js/print-pack.js): which documents can be printed (availability, the tool's own example, the
// defaults), each document worked out from sample states in the tools' real shapes with hand-worked values, the
// example pack, the three data files and the i18n part, and the page itself: the example on a first visit, the team's
// own pack once a tool holds data, the German page reading the German keys, and no key of another tool ever written.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
// Objects made inside the page have the page's own prototypes: compare them as plain data.
const eq = (actual, expected, message) => assert.deepEqual(plain(actual), plain(expected), message);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const camel = (name) => name.replace(/\.json$/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const dataDir = (dir) => Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => [camel(f), read(`${dir}/${f}`)]));
const DATA = dataDir('src/_data');
DATA.de = dataDir('src/_data/de');
DATA.sq = dataDir('src/_data/sq');
const FILES = { en: 'src/_data/printPack.json', de: 'src/_data/de/printPack.json', sq: 'src/_data/sq/printPack.json' };
// A Monday: the pack is printed before the huddle.
const DAY = '2026-10-26';
const SCRIPTS = ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'room-inspection', 'maintenance-planner', 'five-s-audit', 'leader-standard-work', 'safety-cross', 'daily-board', 'room-status', 'housekeeping-planner', 'print-pack'];

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/print-pack.njk', { ...DATA, cfg: lang === 'en' ? DATA.printPack : DATA[lang].printPack, lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const windows = [];
const load = ({ lang = 'en', page = true, now = `${DAY}T07:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/print-pack/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.printed = 0;
  w.print = () => { w.printed++; };
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  for (const file of SCRIPTS) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  windows.push(w);
  return w;
};
test.afterEach(() => { while (windows.length) windows.pop().close(); });
const libs = (w) => ({ MP: w.MaintenancePlannerMath, FS: w.FiveSMath, LSW: w.LeaderStandardWorkMath, SM: w.SafetyMath, RS: w.RoomStatusMath, HP: w.HousekeepingPlannerMath, DB: w.DailyBoardMath });
const snapshot = (w) => Object.fromEntries(Object.keys(w.localStorage).sort().map((key) => [key, w.localStorage.getItem(key)]));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
// The sources the partial hands to the script, as the page has them.
const sourcesOf = (w) => JSON.parse(w.document.getElementById('print-pack-sources').textContent);

// ---- Sample states in the tools' own shapes ----
const ACTIONS = { rows: [
  { id: 'a1', title: 'Fix dock light', owner: 'Besnik', due: '2026-10-20', status: 'open', created: '2026-10-01', source: 'five-s-audit', priority: 'High', area: 'Dock 1' },
  { id: 'a2', title: 'Train new starter', owner: 'Anna', due: '2026-10-30', status: 'doing', created: '2026-10-02', priority: 'Medium' },
  { id: 'a3', title: 'Order tape', owner: 'Anna', due: '2026-10-25', status: 'open', created: '2026-10-10', priority: 'Low' },
  { id: 'a4', title: 'Closed one', owner: 'Anna', due: '2026-10-01', status: 'done', created: '2026-09-20', closed: '2026-10-01' },
  { id: 'a5', title: 'Undated idea', owner: 'Anna', due: '', status: 'open', created: '2026-09-01' },
  { id: 'a6', title: 'Nobody yet', owner: '', due: '2026-11-02', status: 'open', created: '2026-10-20' },
] };
const MAINTENANCE = {
  site: 'warehouse',
  assets: [
    { id: 'a1', tag: 'FL-01', name: 'Forklift 1', type: 'forklift', area: 'Dock', crit: 'A', supplier: 'Linde Service', tasks: [
      // Monthly, last done before the plan began on 20 September: due 20 October, six days overdue on the 26th.
      { id: 't1', text: 'Monthly check', every: 1, unit: 'months', who: 'internal', minutes: 30, statutory: false, checklist: ['Forks', 'Chains'], last: '2026-09-20' },
      // Every two weeks, done on 15 October: due 29 October, in the week (Sunday is 1 November).
      { id: 't2', text: 'Battery water', every: 2, unit: 'weeks', who: 'internal', minutes: 10, last: '2026-09-01' },
      // Yearly, done in March: next March, not this week.
      { id: 't3', text: 'Statutory inspection', every: 1, unit: 'years', who: 'external', minutes: 60, statutory: true, last: '2026-03-01' },
    ] },
    { id: 'a2', tag: 'DD-05', name: 'Dock door 5', type: 'door', area: '', crit: 'B', tasks: [
      // Weekly, done on 12 October (due the 19th), postponed on the 20th until the 30th: due the 30th, in the week.
      { id: 't4', text: 'Door sensors', every: 1, unit: 'weeks', who: 'external', minutes: 20, statutory: true, last: '2026-10-05' },
    ] },
  ],
  rows: [
    { id: 'r1', kind: 'done', asset: 'a1', task: 't2', date: '2026-10-15', by: 'Ilir', minutes: 10, parts: 0, hours: null, checked: [] },
    { id: 'r2', kind: 'done', asset: 'a2', task: 't4', date: '2026-10-12', by: 'Ilir', minutes: 20, parts: 0, hours: null, checked: [] },
    { id: 'r3', kind: 'postponed', asset: 'a2', task: 't4', date: '2026-10-20', until: '2026-10-30', reason: 'Part on order', by: 'Ilir' },
    { id: 'r4', kind: 'breakdown', asset: 'a1', date: '2026-10-21', minutes: 45, cause: 'wear', cost: 0, by: 'Ilir' },
  ],
  sent: {}, oee: {}, show: 'all', example: {},
};
const FIVES = {
  rows: [
    { id: 'x1', date: '2026-10-12', area: 'Dock', auditor: 'Anna', scores: {}, notes: {} },
    { id: 'x2', date: '2026-10-20', area: 'Packing', auditor: 'Clara', scores: {}, notes: {} },
  ],
  plan: [
    // Weekly, last audit 12 October by Anna: due the 19th, a week overdue; on the day, and Besnik's turn.
    { id: 'p1', area: 'Dock', cadence: 'weekly', auditors: ['Anna', 'Besnik'] },
    // Every two weeks from 20 October: due 3 November, after the seven days.
    { id: 'p2', area: 'Packing', cadence: 'biweekly', auditors: ['Clara'] },
    // Never audited: due on the day, the first name of the rotation.
    { id: 'p3', area: 'Yard', cadence: 'monthly', auditors: 'Dritan, Eva' },
  ],
  planExample: false, tags: [], example: {},
};
const LSW = { leaders: [{
  id: 'l1', name: 'Lena Vogel', level: 'team', area: 'Picking', shift: 'Early', start: '06:00', hours: 8, days: [1, 2, 3, 4, 5], since: '2026-09-01',
  tasks: [
    { id: 'm1', title: 'Monthly safety walk', freq: 'monthly', monthDay: 31, time: '10:00', minutes: 20 },
    { id: 'w1', title: 'Weekly 5S audit', freq: 'weekly', weekday: 3, time: '12:00', minutes: 30, tool: 'five-s-audit' },
    { id: 's1', title: 'Huddle', freq: 'shift', offset: 15, minutes: 10, done: 'Board read out' },
    { id: 'd1', title: 'First check', freq: 'daily', time: '06:05', minutes: 15 },
  ],
}], marks: {}, reviews: {}, shares: { team: 0.8, shift: 0.5, area: 0.25, site: 0.1 }, example: {} };
const SAFETY = { rows: [
  { date: '2026-10-05', type: 'no-lost-time', area: 'Dock', what: 'Cut hand', shift: 'Early', cause: '', severity: 2, action: 'Gloves', owner: 'Anna', done: true },
  { date: '2026-10-05', type: 'near-miss', area: 'Dock', what: 'Pallet', severity: 1 },
  { date: '2026-10-12', type: 'unsafe-condition', area: 'Yard', what: 'Light out', severity: 1 },
  { date: '2026-10-14', type: 'positive', area: 'Yard', what: 'Good catch', severity: 1 },
  { date: '2026-09-30', type: 'first-aid', area: 'Dock', what: 'Before the month', severity: 1 },
], example: {} };
const ROOMS = {
  rooms: [{ number: '101', floor: '1', type: 'double' }, { number: '102', floor: '1', type: 'single' }, { number: '103', floor: '1', type: 'double' }, { number: '104', floor: '1', type: 'twin' }, { number: '105', floor: '1', type: 'double' }],
  board: {
    101: { status: 'vd', flags: [], attendant: 'Marta', note: '', at: '2026-10-26 07:00' },
    102: { status: 'co', flags: ['arrival'], attendant: 'Marta', note: 'Cot', at: '2026-10-26 08:10' },
    103: { status: 'vc', flags: [], attendant: 'Marta', note: '', at: '2026-10-26 08:00' },
    104: { status: 'od', flags: ['vip'], attendant: '', note: '', at: '2026-10-26 07:00' },
    105: { status: 'ooo', flags: [], attendant: 'Marta', note: '', at: '2026-10-26 07:00', ooo: { reason: '', back: '' } },
  },
  history: {}, attendants: [{ name: 'Marta', floors: ['1'] }], arrivals: {}, filters: {}, day: DAY, example: false,
};
const HOUSEKEEPING = { source: 'counts', rows: [{ floor: '1', type: 'double', departure: 2, stayover: 3, linen: 1, vip: 0, deep: 0 }], names: ['Marta'], hotelRooms: 20, arrivals: null, scheduled: null, rate: null, sections: null, settings: {}, week: {}, example: false };

// ---- The data files and the texts ----
test('the three data files have the same shape, the storage keys of the convention and one entry per document', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  const en = read(FILES.en);
  assert.equal(en.storageKey, 'sc-print-pack');
  assert.equal(read(FILES.de).storageKey, 'sc-print-pack-de');
  assert.equal(read(FILES.sq).storageKey, 'sc-print-pack-sq');
  for (const lang of ['de', 'sq']) eq(shape(read(FILES[lang])), shape(en), lang);
  const w = load({ page: false });
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = read(FILES[lang]);
    eq(cfg.docs.map((d) => d.key), plain(w.PrintPackMath.DOCS), lang);
    eq(cfg.docs.filter((d) => d.hotel).map((d) => d.key), plain(w.PrintPackMath.HOTEL), lang);
    cfg.docs.forEach((doc) => assert.ok(fs.existsSync(`src/tools/${doc.slug}.njk`), `${lang}: ${doc.slug} is a tool`));
    assert.ok(cfg.example.note.length > 40);
  }
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const part = read('src/_data/i18n-parts/print-pack.json');
  const ui = { de: { ...read('src/_data/de/ui.json'), ...part.de }, sq: { ...read('src/_data/sq/ui.json'), ...part.sq } };
  const js = fs.readFileSync('src/js/print-pack.js', 'utf8');
  const njk = fs.readFileSync('src/_includes/partials/print-pack.njk', 'utf8');
  const texts = new Set([...js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  [...njk.matchAll(/["']([^"']+)["']\s*\|\s*t\(lang\)/g)].forEach((m) => texts.add(m[1]));
  assert.ok(texts.size > 80);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => typeof ui[lang][text] !== 'string');
    eq(missing, [], lang);
    // A placeholder of the English text is in the translation too.
    [...texts].forEach((text) => (text.match(/\{\w+\}/g) || []).forEach((p) => assert.ok(ui[lang][text].includes(p), `${lang}: ${text} keeps ${p}`)));
  }
  // The floor mode switch in the layout.
  const floor = read('src/_data/i18n-parts/floor-mode.json');
  const layout = fs.readFileSync('src/_includes/layouts/base.njk', 'utf8');
  for (const text of ['Floor mode', 'Larger buttons, text and contrast for gloves, one hand and bright light. It stays on in this browser until you switch it off.']) {
    assert.ok(layout.includes(text), text);
    for (const lang of ['de', 'sq']) assert.equal(typeof floor[lang][text], 'string');
  }
});

// ---- Each document ----
test('open actions by owner: open and in-progress only, owners in order, overdue first within each', () => {
  const w = load({ page: false });
  const m = w.PrintPackMath.actionsModel(ACTIONS.rows, DAY);
  assert.equal(m.open, 5);
  // a1 (due the 20th) and a3 (the 25th) are past their date on the 26th.
  assert.equal(m.overdue, 2);
  eq(m.owners.map((o) => o.owner), ['Anna', 'Besnik', '']);
  eq(m.owners[0].items.map((a) => a.id), ['a3', 'a2', 'a5']);
  eq(m.owners[0].items.map((a) => a.late), [1, 0, 0]);
  assert.equal(m.owners[1].items[0].late, 6);
  assert.equal(m.owners[0].overdue, 1);
  // The tracker's example is on while every action is one of its ids.
  assert.equal(w.PrintPackMath.actionsExampleOn(ACTIONS.rows, { exampleIds: ACTIONS.rows.map((a) => a.id) }), true);
  assert.equal(w.PrintPackMath.actionsExampleOn(ACTIONS.rows, { exampleIds: ['a1'] }), false);
});

test('maintenance work list: overdue and due by Sunday, by the planner\'s own next date and postponement', () => {
  const w = load({ page: false });
  const m = w.PrintPackMath.maintenanceModel(MAINTENANCE, DAY, w.MaintenancePlannerMath, 'No area');
  assert.equal(m.monday, '2026-10-26');
  assert.equal(m.sunday, '2026-11-01');
  assert.equal(m.tasks, 4);
  assert.equal(m.count, 3);
  assert.equal(m.overdue, 1);
  assert.equal(m.minutes, 30 + 10 + 20);
  eq(m.groups.map(([area]) => area), ['Dock', 'No area']);
  const dock = m.groups[0][1];
  eq(dock.map((t) => [t.task.id, t.due, t.status, t.late]), [['t1', '2026-10-20', 'overdue', 6], ['t2', '2026-10-29', 'week', 0]]);
  const door = m.groups[1][1][0];
  eq([door.task.id, door.due, door.status], ['t4', '2026-10-30', 'week']);
  assert.equal(door.postponed.reason, 'Part on order');
  // The same dates as the planner's own arithmetic.
  const MP = w.MaintenancePlannerMath;
  assert.equal(MP.nextDue(MAINTENANCE.assets[0].tasks[0], MAINTENANCE.rows.filter((r) => r.asset === 'a1')).due, '2026-10-20');
});

test('5S audits of the week: FiveSMath.schedule for seven days, overdue on the day, the next auditor in turn', () => {
  const w = load({ page: false });
  const m = w.PrintPackMath.fivesModel(FIVES, DAY, w.FiveSMath);
  assert.equal(m.planned, 3);
  assert.equal(m.until, '2026-11-01');
  eq(plain(m.items.map((i) => [i.date, i.area, i.auditor, i.overdue, i.late, i.due])), [
    ['2026-10-26', 'Dock', 'Besnik', true, 7, '2026-10-19'],
    ['2026-10-26', 'Yard', 'Dritan', false, 0, '2026-10-26'],
  ]);
  assert.equal(m.overdue, 1);
});

test('Leader Standard Work cards: the tool\'s cleaned leader, the card order and the planned minutes', () => {
  const w = load({ page: false });
  const [card] = w.PrintPackMath.lswModel(LSW, w.LeaderStandardWorkMath, ['five-s-audit'], DAY);
  eq(card.daily.map((t) => t.id), ['d1', 's1']);
  eq(card.weekly.map((t) => t.id), ['w1']);
  eq(card.monthly.map((t) => t.id), ['m1']);
  eq(plain(card.days), [1, 2, 3, 4, 5]);
  // Per week: (15 + 10) × 5 days + 30 + 20 × 12 / 52 = 159.615 min; per day ÷ 5 = 31.92; share of 480 min = 6.65 %.
  assert.ok(Math.abs(card.planned.perWeek - (125 + 30 + 240 / 52)) < 1e-9);
  assert.ok(Math.abs(card.planned.perDay - 31.923) < 1e-3);
  assert.ok(Math.abs(card.planned.share - 31.923 / 480) < 1e-5);
  assert.equal(card.planned.guide, 0.8);
  // A leader without tasks gets no card.
  assert.equal(w.PrintPackMath.lswModel({ leaders: [{ id: 'x', name: 'No tasks', tasks: [] }] }, w.LeaderStandardWorkMath, [], DAY).length, 0);
});

test('Safety Cross of the month: day states from SafetyMath, the days ahead blank, the days since the last accident', () => {
  const w = load({ page: false });
  const m = w.PrintPackMath.safetyModel(SAFETY, DAY, w.SafetyMath);
  assert.equal(m.ym, '2026-10');
  assert.equal(m.cells.length, 31);
  const state = (n) => m.cells.find((c) => c.day === n).state;
  assert.equal(state(5), 'danger');
  assert.equal(m.cells.find((c) => c.day === 5).n, 2);
  assert.equal(state(12), 'warn');
  assert.equal(state(14), 'ok');
  assert.equal(state(26), 'ok');
  assert.equal(state(27), 'future');
  // 26 days so far: one red, one amber, 24 green; the September first aid is not in October.
  eq([m.red, m.amber, m.green], [1, 1, 24]);
  assert.equal(m.events.length, 4);
  assert.equal(m.since, 21);
  // A 30-day month leaves its 31st cell out.
  assert.equal(w.PrintPackMath.safetyModel(SAFETY, '2026-11-02', w.SafetyMath).cells.find((c) => c.day === 31).state, 'none');
});

test('Daily Board of the month: DailyBoardMath.board with the Safety Cross log and the rows typed by hand', () => {
  const w = load({ page: false });
  const store = { 'sc-safety-cross': JSON.stringify(SAFETY) };
  const logs = w.PrintPackMath.boardLogs((key) => (key in store ? JSON.parse(store[key]) : null), '');
  eq(Object.keys(logs), Object.keys(w.PrintPackMath.BOARD_LOGS));
  assert.equal(logs.safety.rows.length, 5);
  const saved = { rows: [{ date: '2026-10-20', shift: 'Early', letter: 'C', state: 'red', note: 'Overtime' }, { date: '2026-10-21', letter: 'X', state: 'red' }] };
  const m = w.PrintPackMath.boardModel(saved, logs, DAY, w.DailyBoardMath, {});
  assert.equal(m.month, '2026-10');
  assert.equal(m.rows, 1);
  const day = (d) => m.days.find((x) => x.date === d).letters;
  assert.equal(day('2026-10-05').S.state, 'red');
  assert.equal(day('2026-10-12').S.state, 'amber');
  assert.equal(day('2026-10-20').C.state, 'red');
  assert.equal(day('2026-10-27').S.state, 'future');
  assert.equal(m.counts.C.red, 1);
  assert.equal(w.PrintPackMath.logsInUse(logs), true);
  assert.equal(w.PrintPackMath.logsInUse({}), false);
});

test('Room Status attendant sheets: the queue order, out-of-order rooms left off, the unassigned sheet', () => {
  const w = load({ page: false });
  const m = w.PrintPackMath.roomsModel(ROOMS, DAY, w.RoomStatusMath, ['single', 'double', 'twin', 'suite', 'accessible'], 'Not assigned');
  assert.equal(m.rooms, 5);
  assert.equal(m.stale, false);
  eq(m.sheets.map((s) => s.name), ['Marta', 'Not assigned']);
  // The departure with an arrival (tier 1) before the vacant dirty room (tier 2); the clean room last, and done.
  eq(m.sheets[0].rooms.map((r) => r.number), ['102', '101', '103']);
  assert.equal(m.sheets[0].done, 1);
  eq(m.sheets[1].rooms.map((r) => r.number), ['104']);
  assert.equal(w.PrintPackMath.roomsModel({ ...ROOMS, day: '2026-10-25' }, DAY, w.RoomStatusMath, [], 'Not assigned').stale, true);
});

test('Housekeeping section sheets: the planner\'s minutes, plan and balance from typed counts and from Room Status', () => {
  const w = load({ page: false });
  const src = sourcesOf(load());
  const HP = w.HousekeepingPlannerMath;
  const m = w.PrintPackMath.housekeepingModel(HOUSEKEEPING, null, DAY, HP, src.housekeeping);
  // Productive minutes = (8.5 h × 60 − 30) × 85 % = 408. Rooms: 2 departures × 30 + 1 linen change × 25 + 2 stay-overs
  // × 20 = 125 min, one section (⌈125 ÷ 408⌉); with 6 h of public areas 485 min need ⌈485 ÷ 408⌉ = 2 attendants.
  assert.equal(m.productive, 408);
  assert.equal(m.needed, 2);
  assert.equal(m.sections.length, 1);
  assert.equal(m.sections[0].minutes, 125);
  assert.equal(m.sections[0].rooms, 5);
  assert.equal(m.sections[0].name, 'Marta');
  // A setting out of bounds falls back to the default, as in the planner.
  assert.equal(w.PrintPackMath.tidySettings({ shiftHours: 40, breakMinutes: 45 }, src.housekeeping.defaults, ['double'], HP.CLEANS).shiftHours, 8.5);
  // From Room Status: the departure (CO), the vacant dirty room and the stay-over (OD) are cleans; VC and OOO are not.
  const fromRooms = w.PrintPackMath.housekeepingModel({ source: 'rooms' }, ROOMS, DAY, HP, src.housekeeping);
  eq(fromRooms.sections.flatMap((s) => s.items.map((i) => `${i.room}:${i.clean}`)).sort(), ['101:departure', '102:departure', '104:stayover']);
  // The names of Room Status stand in when none are typed.
  assert.equal(fromRooms.sections[0].name, 'Marta');
});

// ---- Availability and the choice ----
test('a document is available once its tool holds data; a tool\'s own example is marked and not ticked by default', () => {
  const w = load();
  const M = w.PrintPackMath;
  const src = sourcesOf(w);
  const empty = { actions: { rows: [], ui: null }, maintenance: null, fives: null, lsw: null, safety: null, board: { saved: null, logs: {} }, rooms: null, housekeeping: { saved: null, rs: null } };
  const none = M.availability(empty, DAY, libs(w), src);
  assert.ok(M.DOCS.every((key) => !none[key].has));
  assert.equal(M.ownAny(none), false);
  // The example pack: every document can be ticked, all but the hotel sheets are.
  eq(plain(M.picked(none, {}, true)), ['actions', 'maintenance', 'fives', 'lsw', 'safety', 'board']);
  const states = {
    actions: { rows: ACTIONS.rows, ui: null }, maintenance: MAINTENANCE, fives: { ...FIVES, planExample: true }, lsw: { ...LSW, example: { on: true } }, safety: SAFETY,
    board: { saved: null, logs: { safety: SAFETY } }, rooms: ROOMS, housekeeping: { saved: HOUSEKEEPING, rs: null },
  };
  const avail = M.availability(states, DAY, libs(w), src);
  assert.ok(M.DOCS.every((key) => avail[key].has), JSON.stringify(plain(avail)));
  assert.equal(avail.fives.toolExample, true);
  assert.equal(avail.lsw.toolExample, true);
  assert.equal(avail.actions.toolExample, false);
  assert.equal(M.ownAny(avail), true);
  eq(plain(M.picked(avail, {}, false)), ['actions', 'maintenance', 'safety', 'board', 'rooms', 'housekeeping']);
  // A choice made on the page wins over the default, but never ticks a document without data.
  eq(plain(M.picked(avail, { rooms: false, lsw: true }, false)), ['actions', 'maintenance', 'lsw', 'safety', 'board', 'housekeeping']);
  eq(plain(M.picked({ ...none }, { actions: true }, false)), []);
  // A log still on its example stamp is the tool's example.
  assert.equal(M.stampMatches({ rows: [{ date: '2026-10-01' }, { date: '2026-10-02' }], example: { n: 2, first: '2026-10-01', last: '2026-10-02' } }), true);
  assert.equal(M.stampMatches({ rows: [{ date: '2026-10-01' }], example: { n: 2, first: '2026-10-01', last: '2026-10-02' } }), false);
});

test('the example pack is made from the tools\' own examples, for the date on the pack, in memory', () => {
  const w = load();
  const M = w.PrintPackMath;
  const src = sourcesOf(w);
  const ex = M.examplePack(src, DAY, libs(w), w.ActionsStore.clean);
  const avail = M.availability(ex, DAY, libs(w), src);
  assert.ok(M.DOCS.every((key) => avail[key].has), JSON.stringify(plain(avail)));
  // The actions are dated from the day, as the tracker dates its example.
  const first = src.actions.example[0];
  assert.equal(ex.actions.rows[0].due, w.ToolKit.addDays(DAY, first.offset));
  // Nothing of the example is in the future, and the 5S audits were moved by whole weeks.
  assert.ok(ex.fives.rows.every((r) => r.date <= DAY));
  assert.equal((Date.parse(ex.fives.rows[0].date) - Date.parse(src.fives.example.audits[0].date)) / 864e5 % 7, 0);
  assert.ok(ex.safety.rows.length > 0 && ex.safety.rows.every((r) => r.date <= DAY));
  assert.equal(ex.rooms.day, DAY);
  assert.equal(M.weeksShift('2026-10-12', DAY), 14);
  assert.equal(M.weeksShift('2026-10-30', DAY), 0);
});

// ---- The page ----
test('a first visit with nothing in the browser shows the example pack and writes nothing', () => {
  const w = load();
  const d = w.document;
  assert.equal(d.querySelector('.pk-example-note').hidden, false);
  assert.equal(d.querySelector('[data-example]').hidden, true);
  const boxes = [...d.querySelectorAll('[data-pick]')];
  assert.equal(boxes.length, 8);
  eq(boxes.filter((b) => b.checked).map((b) => b.value), ['actions', 'maintenance', 'fives', 'lsw', 'safety', 'board']);
  assert.ok(boxes.every((b) => !b.disabled));
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  const sheets = [...results.querySelectorAll('.pk-sheet')];
  // Actions, maintenance, 5S, one card per leader of the example (six), the cross and the board.
  assert.equal(sheets.length, 11);
  eq([...new Set(sheets.map((s) => s.dataset.doc))], ['actions', 'maintenance', 'fives', 'lsw', 'safety', 'board']);
  sheets.forEach((s) => assert.ok(s.querySelector('.pk-top').textContent.includes(DATA.dailyBoard.example.profile.site)));
  assert.ok(results.querySelector('.pk-sheet .ck-chart'), 'the chart of open actions per owner');
  // Ticking the hotel sheets adds a sheet per attendant and per section, and is not stored for the example.
  boxes.find((b) => b.value === 'rooms').click();
  assert.ok(results.querySelectorAll('.pk-sheet[data-doc="rooms"]').length > 0);
  click(w, d.querySelector('[data-print]'));
  assert.equal(w.printed, 1);
  eq(snapshot(w), {});
});

test('with the team\'s own data the pack is theirs: documents without data say which tool to fill, choices are kept', () => {
  const storage = { 'sc-actions': ACTIONS, 'sc-maintenance-planner': MAINTENANCE, 'sc-workplace': { site: 'Hub West', shifts: [], areas: [], teams: [], targets: {} }, 'sc-five-s-audit-de': FIVES };
  const w = load({ storage });
  const before = snapshot(w);
  const d = w.document;
  assert.equal(d.querySelector('.pk-example-note').hidden, true);
  const box = (key) => d.querySelector(`[data-pick="${key}"]`);
  assert.equal(box('actions').checked, true);
  assert.equal(box('maintenance').checked, true);
  // The German 5S plan is not the English page's.
  assert.equal(box('fives').disabled, true);
  const note = box('fives').closest('.pk-doc').querySelector('.pk-doc-note');
  assert.equal(note.querySelector('a').getAttribute('href'), 'https://example.test/tools/five-s-audit/');
  // The Daily Board reads the planner's log too: its breakdown of 21 October makes that day's Delivery amber.
  const sheets = [...d.querySelectorAll('.pk-sheet')];
  eq(sheets.map((s) => s.dataset.doc), ['actions', 'maintenance', 'board']);
  const oct21 = [...sheets[2].querySelectorAll('tbody tr')][20];
  assert.ok(oct21.textContent.includes('2026-10-21'));
  assert.ok(oct21.querySelector('td.is-amber'), 'D is amber on the day of the breakdown');
  assert.ok(sheets[0].querySelector('.pk-top').textContent.startsWith('Hub West'));
  // The actions sheet: one block per owner, the maintenance sheet the planner's work list of the week.
  eq([...sheets[0].querySelectorAll('h3')].map((h) => h.textContent.split(' · ')[0]), ['Anna', 'Besnik', 'No owner']);
  assert.equal(sheets[1].querySelector('h2').textContent, 'Work list · week of 2026-10-26');
  assert.equal(sheets[1].querySelectorAll('tbody tr').length, 3);
  assert.ok(sheets[1].textContent.includes('6 days overdue'));
  // Unticking is kept in the pack's own key, and only there.
  box('maintenance').click();
  eq([...d.querySelectorAll('.pk-sheet')].map((s) => s.dataset.doc), ['actions', 'board']);
  const after = snapshot(w);
  eq(JSON.parse(after['sc-print-pack']).picked, { maintenance: false });
  delete after['sc-print-pack'];
  eq(after, before);
  // The example can still be looked at, and put away again.
  click(w, d.querySelector('[data-example]'));
  assert.equal(d.querySelector('.pk-example-note').hidden, false);
  click(w, d.querySelector('.pk-example-note .button-ghost'));
  assert.equal(d.querySelector('.pk-example-note').hidden, true);
  eq([...d.querySelectorAll('.pk-sheet')].map((s) => s.dataset.doc), ['actions', 'board']);
});

test('the German page reads the German keys of the tools, and the date on the pack moves the week', () => {
  const storage = { 'sc-five-s-audit-de': FIVES, 'sc-room-status-de': ROOMS, 'sc-housekeeping-planner-de': { ...HOUSEKEEPING, source: 'rooms', names: [] }, 'sc-room-status': { ...ROOMS, rooms: [] } };
  const w = load({ lang: 'de', storage });
  const before = snapshot(w);
  const d = w.document;
  const ready = [...d.querySelectorAll('[data-pick]')].filter((b) => !b.disabled).map((b) => b.value);
  // The board reads the German 5S log (its audits) as well.
  eq(ready, ['fives', 'board', 'rooms', 'housekeeping']);
  const hk = d.querySelectorAll('.pk-sheet[data-doc="housekeeping"]');
  assert.equal(hk.length, 1);
  assert.equal(hk[0].querySelector('h2').textContent, 'Marta');
  assert.equal(d.querySelector('.pk-sheet[data-doc="fives"] tbody').rows.length, 2);
  // A week later, Dock (due 19 October, never done) is still the first, two weeks late.
  const date = d.getElementById('pk-date');
  date.value = '2026-11-02';
  date.dispatchEvent(new w.Event('change', { bubbles: true }));
  const first = d.querySelector('.pk-sheet[data-doc="fives"] tbody tr');
  assert.ok(first.textContent.includes('Dock'));
  assert.ok(first.textContent.includes('14'));
  eq(snapshot(w), before);
});

test('every tool script stops before its page code here, leaving its arithmetic', () => {
  const w = load();
  for (const name of ['MaintenancePlannerMath', 'FiveSMath', 'LeaderStandardWorkMath', 'SafetyMath', 'RoomStatusMath', 'HousekeepingPlannerMath', 'DailyBoardMath', 'RoomInspectionMath', 'PrintPackMath']) assert.equal(typeof w[name], 'object', name);
  // None of them drew its own page into this one.
  assert.equal(w.document.querySelectorAll('[data-results]').length, 1);
});
