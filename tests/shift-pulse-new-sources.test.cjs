// Shift Pulse reads the tools that joined later: Safety Cross, OEE, the Action Tracker, the 5S Audit, and then Room
// Inspection, the Maintenance Planner and Lost & Found. The numbers are in window.PulseMath (safety, oee, actions,
// fiveS, rooms, maintenance, lostFound); OEE is counted there without the OEE tool's script, so the tests hold it
// against window.OeeMath on the same rows. The last three use the tools' own arithmetic (their scripts are loaded),
// and the tests check them against values worked out by hand.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (v) => JSON.parse(JSON.stringify(v));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);

const load = (scripts = [], { lang = 'en', url = 'https://example.test/tools/shift-pulse/', html = '', storage = {} } = {}) => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${html}</body></html>`, { url, runScripts: 'outside-only' });
  Object.entries(storage).forEach(([key, value]) => dom.window.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['src/js/tool-kit.js', ...scripts, 'src/js/shift-pulse.js']) dom.window.eval(fs.readFileSync(file, 'utf8'));
  return dom.window;
};

test('safety: accidents, first aid and near misses per day, the flag on the latest day, days since the last accident', () => {
  const { PulseMath } = load();
  const rows = [
    { date: '2026-08-20', shift: 'Early', type: 'lost-time', area: 'Dock' },
    { date: '2026-09-01', shift: 'Early', type: 'near-miss', area: 'Dock' },
    { date: '2026-09-01', shift: 'Late', type: 'unsafe-act', area: 'Dock' },
    { date: '2026-09-02', shift: 'Early', type: 'first-aid', area: 'Aisle' },
    { date: '2026-09-02', shift: 'Late', type: 'positive', area: 'Aisle' },
    { date: '2026-09-03', shift: 'Late', type: 'no-lost-time', area: 'Dock' },
    { date: '2026-09-03', shift: 'Early', type: 'unsafe-condition', area: 'Dock' },
    { date: 'not a date', type: 'lost-time' },
  ];
  const all = plain(PulseMath.safety({ rows }, { from: '2026-09-01', to: '2026-09-05' }));
  assert.deepEqual(all.accidents, [0, 0, 1, 0, 0]);
  assert.deepEqual(all.firstAid, [0, 1, 0, 0, 0]);
  assert.deepEqual(all.nearMisses, [2, 0, 1, 0, 0]);
  assert.deepEqual(all.events, [2, 1, 2, 0, 0]);
  assert.deepEqual(all.totals, { accidents: 1, firstAid: 1, nearMisses: 3, entries: 6 });
  assert.equal(all.latest.key, '2026-09-03', 'the latest day with an entry');
  assert.equal(all.accident, true);
  assert.equal(all.lastAccident, '2026-09-03');
  assert.equal(all.daysSince, 2, 'counted to the end of the period');

  // One shift: the counts are the shift's, the days since the last accident stay the site's.
  const early = plain(PulseMath.safety({ rows }, { from: '2026-09-01', to: '2026-09-05', shift: 'Early' }));
  assert.equal(early.totals.accidents, 0);
  assert.equal(early.accident, false);
  assert.equal(early.daysSince, 2);

  // Before the accident of the 3rd: the one of 20 August is the last.
  const before = plain(PulseMath.safety({ rows }, { from: '2026-09-01', to: '2026-09-02' }));
  assert.equal(before.accident, false);
  assert.equal(before.daysSince, 13);
  assert.equal(plain(PulseMath.safety({ rows: rows.filter((r) => !/lost-time/.test(r.type)) }, { from: '2026-09-01', to: '2026-09-02' })).daysSince, null);

  // By the week from Monday (2026-08-31 and 2026-09-07 are Mondays).
  const weeks = plain(PulseMath.safety({ rows: [...rows, { date: '2026-09-08', shift: 'Early', type: 'near-miss' }] }, { from: '2026-08-31', to: '2026-09-09', unit: 'week' }));
  assert.deepEqual(weeks.slots, ['2026-08-31', '2026-09-07']);
  assert.deepEqual(weeks.accidents, [1, 0]);
  assert.equal(weeks.latest.key, '2026-09-07');
  assert.equal(weeks.accident, false, 'the latest week has no accident');
  assert.deepEqual(plain(PulseMath.safety({ rows: 'broken' }, { from: '2026-09-01', to: '2026-09-02' })).totals, { accidents: 0, firstAid: 0, nearMisses: 0, entries: 0 });
});

test('safety: days since the last accident agree with the Safety Cross', () => {
  const { PulseMath, SafetyMath } = load(['src/js/safety-cross.js']);
  const rows = [{ date: '2026-09-01', type: 'no-lost-time' }, { date: '2026-09-10', type: 'near-miss' }];
  assert.equal(PulseMath.safety({ rows }, { from: '2026-09-10', to: '2026-09-15' }).daysSince, SafetyMath.daysSince(rows, '2026-09-15'));
});

const reasons = JSON.parse(fs.readFileSync('src/_data/oee.json', 'utf8')).reasons;
const oeeSaved = {
  equipment: [{ name: 'Sorter 1', rate: 600, planned: 480 }, { name: 'Wrapper', rate: 0, cycle: 12 }, { name: 'Labeller', rate: 0 }],
  rows: [
    { date: '2026-09-01', shift: 'Early', equipment: 'Sorter 1', planned: 480, stops: [{ reason: 'Break', minutes: 30 }, { reason: 'Jam', minutes: 10 }, { reason: 'Changeover', minutes: 25 }], pieces: 3600, rejects: 40, startup: 10 },
    { date: '2026-09-01', shift: 'Late', equipment: 'wrapper', planned: 240, stops: [{ reason: 'Breakdown', minutes: 40 }], pieces: 900, rejects: 9 },
    { date: '2026-09-02', shift: 'Early', equipment: 'Sorter 1', planned: 480, stops: [{ reason: 'Break', minutes: 30 }], pieces: 4000, rejects: 20 },
    { date: '2026-09-02', shift: 'Late', equipment: 'Labeller', planned: 480, stops: [], pieces: 1000, rejects: 0 },
    // More pieces than the ideal rate allows: performance stays at 100 %.
    { date: '2026-09-03', shift: 'Early', equipment: 'Sorter 1', planned: 100, stops: [], pieces: 5000, rejects: 0 },
  ],
};

test('OEE per day, time-weighted, the same as the OEE tool counts it', () => {
  const { PulseMath, OeeMath } = load(['src/js/oee.js']);
  const result = plain(PulseMath.oee(oeeSaved, { from: '2026-09-01', to: '2026-09-04' }, reasons));
  const machine = (name) => oeeSaved.equipment.find((m) => m.name.toLowerCase() === name.toLowerCase());
  const day = (date) => OeeMath.combine(oeeSaved.rows.filter((r) => r.date === date).map((r) => OeeMath.entry(r, OeeMath.idealCycle(machine(r.equipment)), reasons)));
  ['2026-09-01', '2026-09-02', '2026-09-03'].forEach((date, i) => {
    const expected = day(date);
    for (const key of ['availability', 'performance', 'quality', 'oee']) close(result.perSlot[i][key], expected[key], `${date} ${key}`);
    assert.equal(result.perSlot[i].n, expected.n, `${date}: rated entries`);
  });
  assert.equal(result.values[3], null, 'a day without entries has no OEE');
  assert.equal(result.perSlot[2].performance, 1, 'performance is capped at 100 %');
  const period = OeeMath.combine(oeeSaved.rows.map((r) => OeeMath.entry(r, OeeMath.idealCycle(machine(r.equipment)), reasons)));
  close(result.period.oee, period.oee, 'the period');
  assert.equal(result.unrated, 1, 'the labeller has no ideal rate');
  assert.equal(result.entries, 5);
  assert.equal(result.latest.key, '2026-09-03');
  assert.equal(result.target, 0.85);
  assert.equal(result.below, result.latest.oee < 0.85);

  // The first day by hand: Sorter 1 450 planned production minutes, 425 run, 360 ideal, 3560 good of 3600;
  // the wrapper 240, 200 run, 180 ideal, 891 of 900.
  const valuable = 360 * (3560 / 3600) + 180 * (891 / 900);
  close(result.perSlot[0].oee, valuable / 690, 'first day');
  close(result.perSlot[0].availability, 625 / 690, 'first day availability');
});

test('OEE: the shift, the week, the target and a log without the reason list', () => {
  const { PulseMath } = load();
  const late = plain(PulseMath.oee(oeeSaved, { from: '2026-09-01', to: '2026-09-03', shift: 'Late' }, reasons));
  assert.equal(late.period.n, 1, 'only the wrapper on the late shift has a rate');
  assert.equal(late.latest.key, '2026-09-01');
  const weeks = plain(PulseMath.oee(oeeSaved, { from: '2026-08-31', to: '2026-09-06', unit: 'week' }, reasons));
  assert.deepEqual(weeks.slots, ['2026-08-31']);
  close(weeks.latest.oee, weeks.period.oee, 'one week is the whole period');
  assert.equal(PulseMath.oeeTarget(70), 0.7);
  assert.equal(PulseMath.oeeTarget(0.6), 0.6);
  assert.equal(PulseMath.oeeTarget(null), 0.85);
  assert.equal(PulseMath.oeeTarget(undefined), 0.85);
  const strict = plain(PulseMath.oee(oeeSaved, { from: '2026-09-01', to: '2026-09-02', target: 99 }, reasons));
  assert.equal(strict.below, true);
  const easy = plain(PulseMath.oee(oeeSaved, { from: '2026-09-01', to: '2026-09-02', target: 10 }, reasons));
  assert.equal(easy.below, false);
  // Without the reason list a break is an unplanned stop, as in the OEE tool: availability drops.
  const bare = plain(PulseMath.oee(oeeSaved, { from: '2026-09-02', to: '2026-09-02' }));
  const full = plain(PulseMath.oee(oeeSaved, { from: '2026-09-02', to: '2026-09-02' }, reasons));
  assert.ok(bare.latest.availability < full.latest.availability);
  assert.equal(plain(PulseMath.oee({ rows: [] }, { from: '2026-09-01', to: '2026-09-02' })).latest, null);
  assert.equal(plain(PulseMath.oee({ equipment: 'x', rows: oeeSaved.rows }, { from: '2026-09-01', to: '2026-09-02' })).period.oee, null, 'no machines, no rate, no OEE');
});

test('actions: open, overdue and due today', () => {
  const { PulseMath } = load();
  const rows = [
    { title: 'Fix the dock door', status: 'open', due: '2026-09-01' },
    { title: 'Label the aisles', status: 'doing', due: '2026-09-05' },
    { title: 'Train the late shift', status: 'open', due: '2026-09-03' },
    { title: 'No date yet', status: 'open', due: '' },
    { title: 'Closed late', status: 'done', due: '2026-08-01' },
    { title: 'Checked', status: 'verified', due: '2026-08-02' },
    { title: 'Odd status', status: 'waiting', due: '2026-09-02' },
    { title: '  ', status: 'open' },
    'not an action',
  ];
  const result = plain(PulseMath.actions({ rows }, '2026-09-05'));
  assert.equal(result.total, 7);
  assert.equal(result.open, 5);
  assert.equal(result.doing, 1);
  assert.equal(result.closed, 2);
  assert.equal(result.overdue, 3, 'a closed action is never overdue; an unknown status is open');
  assert.equal(result.dueToday, 1);
  assert.equal(result.oldest.title, 'Fix the dock door');
  assert.equal(plain(PulseMath.actions([{ title: 'Old list shape', due: '2026-09-01' }], '2026-09-05')).overdue, 1);
  assert.equal(plain(PulseMath.actions(null, '2026-09-05')).total, 0);
});

test('5S: the latest audit, its overall share as the 5S Audit shows it, and the area before', () => {
  const { PulseMath, FiveSMath } = load(['src/js/five-s-audit.js']);
  const rows = [
    { date: '2026-09-10', area: 'Dock', scores: { sort: [4, 4], set: [2, null, 2] } },
    { date: '2026-09-01', area: 'Dock', scores: { sort: [2, 2], set: [2, 2, 2] } },
    { date: '2026-09-05', area: 'Aisle', scores: { sort: [3] } },
    { date: '2026-09-12', area: 'Dock', scores: { sort: [null] } },
  ];
  const result = plain(PulseMath.fiveS({ rows }));
  assert.equal(result.date, '2026-09-10');
  assert.equal(result.area, 'Dock');
  // Sort 4/4, Set 2/4: each S weighs the same, 75 %.
  assert.equal(result.overall, 0.75);
  assert.equal(result.overall, FiveSMath.score(rows[0].scores, ['sort', 'set']).overall);
  assert.equal(result.previous, 0.5);
  assert.deepEqual(result.series, [0.5, 0.75]);
  assert.equal(result.audits, 3, 'an audit without a score is left out');
  assert.equal(PulseMath.fiveS({ rows: [] }), null);
});

// The page as the partial draws it, with the four sources in the German keys.
const PAGE = `<form data-shift-pulse><select name="days"><option value="7">7</option><option value="14">14</option><option value="30">30</option><option value="w8">w8</option><option value="w12">w12</option></select>
<select name="shift"><option value="">All</option><option>Early</option><option>Late</option></select></form>
<section data-pulse-results></section>
<script type="application/json" id="shift-pulse-data">${JSON.stringify({ shifts: ['Early', 'Late'], priorities: ['High', 'Medium', 'Low'], damage: { many: 'damages', volumeLabel: 'units', rateLabel: 'Damage rate' }, incomplete: { many: 'incomplete', volumeLabel: 'orders', rateLabel: 'Incomplete rate' }, oeeReasons: reasons })}</script>`;

test('the page shows a card for each source that holds data, in the language of the page, and none for the others', () => {
  const probe = load();
  const today = probe.ToolKit.today();
  const ago = (n) => probe.ToolKit.addDays(today, -n);
  const storage = {
    'sc-safety-cross-de': { rows: [{ date: ago(1), shift: 'Early', type: 'near-miss' }, { date: today, shift: 'Late', type: 'lost-time' }] },
    'sc-safety-cross': { rows: [{ date: today, type: 'near-miss' }] },
    'sc-oee-de': { equipment: [{ name: 'Sorter 1', rate: 600 }], rows: [{ date: today, shift: 'Early', equipment: 'Sorter 1', planned: 480, stops: [{ reason: 'Breakdown', minutes: 200 }], pieces: 1000, rejects: 0 }] },
    'sc-actions': { rows: [{ title: 'Fix the dock door', status: 'open', due: ago(3) }, { title: 'Sweep', status: 'doing', due: today }] },
  };
  const win = load(['src/js/workplace.js'], { lang: 'de', url: 'https://example.test/de/tools/shift-pulse/', html: PAGE, storage });
  const cards = [...win.document.querySelectorAll('.sp-card')];
  const labels = cards.map((card) => card.querySelector('.result-label').textContent);
  assert.deepEqual(labels.slice(3), ['Accidents', 'OEE', 'Open actions'], 'no 5S card without an audit');
  const byLabel = (label) => cards.find((card) => card.querySelector('.result-label').textContent === label);
  assert.equal(byLabel('Accidents').querySelector('.sp-card-value').textContent, '1');
  assert.ok(byLabel('Accidents').querySelector('.sp-flag'), 'an accident on the latest day is flagged');
  assert.match(byLabel('Accidents').textContent, /Days since the last accident: 0/);
  assert.ok(byLabel('Accidents').querySelector('svg.sp-spark'));
  assert.ok(byLabel('OEE').querySelector('.sp-flag'), 'OEE below 85 % is flagged');
  assert.ok(byLabel('OEE').querySelector('svg.sp-spark'));
  assert.equal(byLabel('Open actions').querySelector('.sp-card-value').textContent, '2');
  assert.match(byLabel('Open actions').textContent, /1 overdue · 1 due today/);
  assert.equal(byLabel('Open actions').querySelector('a').href, 'https://example.test/de/tools/action-tracker/');
  assert.equal(byLabel('OEE').querySelector('a').href, 'https://example.test/de/tools/oee/');
  const attention = win.document.querySelector('.sp-attention').textContent;
  assert.match(attention, /Accidents on/);
  assert.match(attention, /OEE is below the target/);
  assert.match(attention, /1 action is overdue/);
});

test('with only a 5S audit saved, the page still shows its card, with the area and its trend', () => {
  const storage = { 'sc-five-s-audit': { rows: [{ date: '2026-09-01', area: 'Dock', scores: { sort: [2, 2] } }, { date: '2026-09-10', area: 'Dock', scores: { sort: [3, 3] } }] } };
  const win = load([], { html: PAGE, storage });
  const card = [...win.document.querySelectorAll('.sp-card')].find((item) => item.querySelector('.result-label').textContent === '5S audit');
  assert.ok(card, 'the 5S card is there');
  assert.match(card.querySelector('.sp-card-value').textContent, /75/);
  assert.match(card.textContent, /Dock/);
  assert.match(card.textContent, /Previous audit of this area: 50/);
  assert.ok(card.querySelector('svg.sp-spark'));
  assert.equal(win.document.querySelectorAll('.sp-card').length, 4, 'the three log cards and the 5S card, no empty ones');
});

test('every new text of Shift Pulse has German and Albanian', () => {
  const source = fs.readFileSync('src/js/shift-pulse.js', 'utf8');
  const extra = JSON.parse(fs.readFileSync('src/_data/i18n-parts/shift-pulse-extra.json', 'utf8'));
  const third = JSON.parse(fs.readFileSync('src/_data/i18n-parts/pulse-board-3.json', 'utf8'));
  const texts = new Set([...source.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const m of source.matchAll(/tx\(\w[^?]*\?\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) { texts.add(JSON.parse(`"${m[1]}"`)); texts.add(JSON.parse(`"${m[2]}"`)); }
  const partial = fs.readFileSync('src/_includes/partials/shift-pulse.njk', 'utf8');
  for (const m of partial.matchAll(/\{\{ "((?:[^"\\]|\\.)*)" \| t\(lang\) \}\}/g)) texts.add(m[1]);
  for (const lang of ['de', 'sq']) {
    const ui = { ...JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8')), ...extra[lang], ...third[lang] };
    for (const text of texts) assert.ok(ui[text], `${lang}: ${text}`);
  }
});

// Room Inspection, Maintenance Planner and Lost & Found: their scripts give the arithmetic.
const TOOLS = ['src/js/room-inspection.js', 'src/js/maintenance-planner.js', 'src/js/lost-found.js'];

// A checklist small enough to score by hand: weights 3 (critical), 1, 2 and 1, so 7 in all; the pass mark 90 %.
const roomCfg = {
  threshold: 0.9,
  zones: [{ key: 'bathroom', name: 'Bathroom' }, { key: 'bed', name: 'Bed' }],
  templates: {
    standard: { name: 'Standard room', questions: {
      bathroom: [{ text: 'No hair', weight: 3, critical: true, fix: 'reclean' }, { text: 'Mirror polished', weight: 1, fix: 'reclean' }],
      bed: [{ text: 'Linen clean', weight: 2, fix: 'reclean' }, { text: 'Lamp works', weight: 1, fix: 'maintenance' }],
    } },
    suite: { name: 'Suite', questions: { bathroom: [{ text: 'Bath clean', weight: 2 }] } },
  },
};
const allPass = { 'bathroom-0': 'pass', 'bathroom-1': 'pass', 'bed-0': 'pass', 'bed-1': 'pass' };
const inspect = (date, time, room, fails = {}, flags = {}) => ({ date, time, room, template: 'standard', answers: { ...allPass, ...fails }, flags });
const roomRows = [
  inspect('2026-08-20', '10:00', '101', { 'bathroom-0': 'fail' }, { 'bathroom-0': 'reclean' }),
  inspect('2026-09-01', '10:00', '101'),
  // 6 of 7 is 86 %, below the pass mark; the lamp goes to maintenance, not back to the attendant.
  inspect('2026-09-01', '11:00', '102', { 'bed-1': 'fail' }, { 'bed-1': 'maintenance' }),
  inspect('2026-09-01', '12:00', '102'),
  // A failed critical item fails the room on its own; nobody checked it again.
  inspect('2026-09-02', '10:00', '103', { 'bathroom-0': 'fail' }, { 'bathroom-0': 'reclean' }),
  inspect('2026-09-02', '11:00', '104', { 'bathroom-1': 'fail' }, { 'bathroom-1': 'reclean' }),
  inspect('2026-09-02', '12:00', '105'),
  inspect('2026-09-03', '09:00', '104'),
  // n.a. leaves the weight out: 5 of 5.
  inspect('2026-09-03', '10:00', '106', { 'bed-0': 'na' }),
  inspect('2026-09-03', '11:00', '107', { 'bathroom-0': 'fail' }, { 'bathroom-0': 'reclean' }),
];

test('rooms: first-time pass rate per day by hand, re-checks left out, open re-cleans and the item that fails most', () => {
  const { PulseMath, RoomInspectionMath: RI } = load(TOOLS);
  const result = plain(PulseMath.rooms({ rows: roomRows }, { from: '2026-09-01', to: '2026-09-03' }, roomCfg));
  // First inspections: 1 Sept 101 pass, 102 fail; 2 Sept 103, 104 fail, 105 pass; 3 Sept 104, 106 pass, 107 fail.
  // The second look at 102 on 1 Sept is a re-check; the 20 August fail is outside the period.
  assert.deepEqual(result.first, [2, 3, 3]);
  assert.deepEqual(result.fails, [1, 2, 1]);
  assert.deepEqual(result.inspections, [3, 3, 3]);
  close(result.values[0], 1 / 2, '1 Sept');
  close(result.values[1], 1 / 3, '2 Sept');
  close(result.values[2], 2 / 3, '3 Sept');
  assert.equal(result.total.first, 8);
  assert.equal(result.total.firstPass, 4);
  assert.equal(result.total.rate, 0.5);
  assert.equal(result.total.n, 9);
  assert.equal(result.threshold, 0.9);
  assert.equal(result.latest.key, '2026-09-03');
  close(result.latest.rate, 2 / 3, 'the latest day');
  // Usual: 3 fails of 5 first inspections before the latest day, so 40 % passed.
  close(result.usual, 0.4, 'the usual pass rate');
  // p-chart: 0.6 + 3 √(0.6 · 0.4 / 3) = 1.45; one fail of three is inside it.
  assert.equal(result.above, false);
  // Re-cleans: 103, 104 (2 Sept) and 107 had an item sent back; 104 passed the next day, so 103 and 107 are open.
  assert.equal(result.recleans, 3);
  assert.equal(result.openRecleans, 2);
  assert.deepEqual(result.worst, { text: 'No hair', count: 2, share: 0.5 });
  // The same rows through the tool's own overall rate.
  const items = (row) => RI.itemsOf(roomCfg.templates[row.template], ['bathroom', 'bed']);
  const tool = RI.overall(RI.annotate(roomRows, items, 0.9).filter((row) => row.date >= '2026-09-01'));
  assert.equal(result.total.rate, tool.rate);

  // The pass mark the team saved wins: at 80 %, 6 of 7 passes, so 102 passes the first time.
  const easy = plain(PulseMath.rooms({ threshold: 0.8, rows: roomRows }, { from: '2026-09-01', to: '2026-09-03' }, roomCfg));
  assert.equal(easy.threshold, 0.8);
  assert.deepEqual(easy.fails, [0, 1, 1], '102 and 104 pass at 86 %; 103 and 107 still fail, a failed critical item fails the room at any pass mark');
  // By the week from Monday (31 August): one slot for the three days.
  const weeks = plain(PulseMath.rooms({ rows: roomRows }, { from: '2026-08-31', to: '2026-09-06', unit: 'week' }, roomCfg));
  assert.deepEqual(weeks.slots, ['2026-08-31']);
  assert.equal(weeks.values[0], 0.5);
  // An unknown checklist is scored with the first one, as the tool does; nothing saved, or no script, no card.
  assert.equal(plain(PulseMath.rooms({ rows: [{ ...roomRows[1], template: 'gone' }] }, { from: '2026-09-01', to: '2026-09-01' }, roomCfg)).total.rate, 1);
  assert.equal(PulseMath.rooms({ rows: [] }, { from: '2026-09-01', to: '2026-09-03' }, roomCfg), null);
  assert.equal(load().PulseMath.rooms({ rows: roomRows }, { from: '2026-09-01', to: '2026-09-03' }, roomCfg), null);
});

test('rooms: the flag is the p-chart of the fail share of first inspections', () => {
  const { PulseMath } = load(TOOLS);
  const rows = [];
  // Three days of ten rooms with one fail each, then a day of ten rooms with six fails.
  ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04'].forEach((date, d) => {
    for (let i = 0; i < 10; i++) rows.push(inspect(date, `1${i}:00`, `${d + 1}0${i}`, i < (d === 3 ? 6 : 1) ? { 'bathroom-1': 'fail' } : {}, { 'bathroom-1': 'reclean' }));
  });
  const result = plain(PulseMath.rooms({ rows }, { from: '2026-09-01', to: '2026-09-04' }, roomCfg));
  // Usual fail share 3 / 30 = 10 %; limit 0.1 + 3 √(0.1 · 0.9 / 10) = 38.5 %; 60 % is beyond it.
  close(result.usual, 0.9, 'usual pass');
  close(result.latest.rate, 0.4, 'latest');
  assert.equal(result.above, true);
  // Fewer rooms on the latest day widen the limit: 4 fails of 8 (50 %) against 0.1 + 3 √(0.09 / 8) = 41.8 % is a
  // signal, 3 of 7 (42.9 %) against 0.1 + 3 √(0.09 / 7) = 44.0 % is not.
  const without = (rooms) => plain(PulseMath.rooms({ rows: rows.filter((row) => !(row.date === '2026-09-04' && rooms.includes(row.room))) }, { from: '2026-09-01', to: '2026-09-04' }, roomCfg));
  const eight = without(['400', '401']);
  close(eight.latest.rate, 4 / 8, '4 of 8 passed');
  assert.equal(eight.above, true);
  const seven = without(['400', '401', '402']);
  close(seven.latest.rate, 4 / 7, '4 of 7 passed');
  assert.equal(seven.above, false);
  // A single failed room is never a signal (at least two, as for every number here).
  const one = plain(PulseMath.rooms({ rows: [inspect('2026-09-01', '10:00', '101'), inspect('2026-09-02', '10:00', '102', { 'bathroom-0': 'fail' })] }, { from: '2026-09-01', to: '2026-09-02' }, roomCfg));
  assert.equal(one.latest.rate, 0);
  assert.equal(one.above, false);
  // As for damage with a volume: after days without a fail there is no usual share to stand on, so no flag.
  const clean = rows.filter((row) => row.date === '2026-09-04').concat(['2026-09-01', '2026-09-02'].flatMap((date, d) => [0, 1, 2].map((i) => inspect(date, `0${i}:00`, `9${d}${i}`))));
  const fresh = plain(PulseMath.rooms({ rows: clean }, { from: '2026-09-01', to: '2026-09-04' }, roomCfg));
  close(fresh.latest.rate, 0.4, '6 of 10 fail');
  assert.equal(fresh.usual, 1);
  assert.equal(fresh.above, false);
});

// A small plan, due dates worked out by hand for 20 September 2026.
const plan = {
  assets: [
    { id: 'a1', tag: 'SRT-1', name: 'Sorter', crit: 'A', tasks: [
      // Done on 1 August, monthly: due 1 September, 19 days overdue.
      { id: 't1', text: 'Belt check', every: 1, unit: 'months', hours: 0, last: '', lastHours: null, start: '' },
      // Done on 1 September, every two weeks: due 15 September, but postponed to the 25th: not overdue.
      { id: 't2', text: 'Lubricate chain', every: 2, unit: 'weeks', hours: 0, last: '2026-09-01', lastHours: null, start: '' },
      // Every 500 operating hours from 1,000: the meter runs 10 h a day and reaches 1,500 h on 11 September.
      { id: 't5', text: 'Gearbox oil', every: 500, unit: 'hours', hours: 0, last: '', lastHours: 1000, start: '' },
    ] },
    { id: 'a2', tag: 'FLT-2', name: 'Forklift', crit: 'B', tasks: [
      // Yearly, last on 10 September 2025: due 10 September 2026.
      { id: 't3', text: 'Brake test', every: 1, unit: 'years', hours: 0, last: '2025-09-10', lastHours: null, start: '' },
    ] },
    { id: 'a3', tag: 'DOOR-4', name: '', crit: 'C', tasks: [
      // Every six months from 20 April: due 20 October.
      { id: 't4', text: 'Hinges', every: 6, unit: 'months', hours: 0, last: '2026-04-20', lastHours: null, start: '' },
    ] },
  ],
  rows: [
    { kind: 'done', asset: 'a1', task: 't1', date: '2026-08-01', minutes: 30 },
    { kind: 'postponed', asset: 'a1', task: 't2', date: '2026-09-14', until: '2026-09-25', reason: 'Part on order' },
    { kind: 'reading', asset: 'a1', date: '2026-09-01', hours: 1400 },
    { kind: 'reading', asset: 'a1', date: '2026-09-11', hours: 1500 },
    { kind: 'breakdown', asset: 'a1', date: '2026-08-30', minutes: 50, cause: 'wear' },
    { kind: 'breakdown', asset: 'a1', date: '2026-09-18', minutes: 30, cause: 'jam' },
    { kind: 'breakdown', asset: 'a1', date: '2026-09-19', minutes: 45, cause: 'electrical' },
    { kind: 'breakdown', asset: 'a2', date: '2026-09-19', minutes: 20, cause: 'other' },
    // An asset that is no longer in the plan is not counted, as in the planner.
    { kind: 'breakdown', asset: 'gone', date: '2026-09-19', minutes: 100, cause: 'other' },
  ],
};

test('maintenance: overdue tasks by the planner\'s own due dates, those on A assets, breakdowns and downtime', () => {
  const { PulseMath, MaintenancePlannerMath: MP } = load(TOOLS);
  const result = plain(PulseMath.maintenance(plan, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20'));
  assert.equal(result.tasks, 5);
  // Overdue: the belt check (1 Sept, A), the brake test (10 Sept, B) and the gearbox oil (11 Sept, A).
  assert.equal(result.overdue, 3);
  assert.equal(result.overdueA, 2);
  assert.deepEqual(result.oldest, { task: 'Belt check', asset: 'SRT-1 · Sorter', due: '2026-09-01', crit: 'A' });
  // The dates by hand against the planner's nextDue.
  const events = plan.rows.filter((row) => row.asset === 'a1');
  assert.equal(MP.nextDue(plan.assets[0].tasks[2], events).due, '2026-09-11', 'the meter reaches 1,500 h on 11 September');
  assert.equal(MP.nextDue(plan.assets[0].tasks[1], events).due, '2026-09-25', 'the postponement moves the date');
  // Breakdowns from 14 to 20 September: one on the 18th, two on the 19th; 30 + 45 + 20 = 95 minutes.
  assert.deepEqual(result.values, [0, 0, 0, 0, 1, 2, 0]);
  assert.deepEqual(result.minutesBySlot, [0, 0, 0, 0, 30, 65, 0]);
  assert.equal(result.breakdowns, 3);
  assert.equal(result.downtime, 95);
  // c-chart: the usual day before the 19th is 1 / 5 = 0.2; 0.2 + 3 √0.2 = 1.54, so two breakdowns are a signal.
  assert.equal(result.latest.key, '2026-09-19');
  close(result.usual, 0.2, 'usual');
  close(result.limit, 0.2 + 3 * Math.sqrt(0.2), 'limit');
  assert.equal(result.above, true);
  // A week later the plan has moved on: the postponed chain is due on the 25th and is overdue on the 27th.
  assert.equal(plain(PulseMath.maintenance(plan, { from: '2026-09-21', to: '2026-09-27' }, '2026-09-27')).overdue, 4);
  // By the week: one slot with the three breakdowns.
  const weeks = plain(PulseMath.maintenance(plan, { from: '2026-09-14', to: '2026-09-20', unit: 'week' }, '2026-09-20'));
  assert.deepEqual(weeks.values, [3]);
  assert.equal(weeks.above, false, 'one week has no week before it');
  assert.equal(PulseMath.maintenance({ assets: [] }, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20'), null);
  assert.equal(load().PulseMath.maintenance(plan, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20'), null, 'no planner script, no card');
});

const lfCfg = JSON.parse(fs.readFileSync('src/_data/lostFound.json', 'utf8'));
const found = [
  // High value, kept 180 days: 1 March + 180 = 28 August, past it.
  { id: 'LF-1', date: '2026-03-01', category: 'phone', what: 'Black phone', value: 'high', steps: [] },
  // Documents are decided on in 7 days: 10 + 7 = 17 September, past it.
  { id: 'LF-2', date: '2026-09-10', category: 'documents', what: 'Passport', value: 'high', steps: [] },
  // Low value, 90 days: 14 December.
  { id: 'LF-3', date: '2026-09-15', category: 'clothing', what: 'Grey scarf', value: 'low', steps: [] },
  // Returned: closed.
  { id: 'LF-4', date: '2026-09-16', category: 'keys', what: 'Car key', value: 'low', steps: [{ status: 'returned', date: '2026-09-17', by: 'Ana' }] },
  // Medium, 90 days: 1 June + 90 = 30 August; the guest was contacted and never came, still open.
  { id: 'LF-5', date: '2026-06-01', category: 'bag', what: 'Blue backpack', value: 'medium', steps: [{ status: 'contacted', date: '2026-06-02', by: 'Ana' }] },
  { id: 'LF-6', date: '2026-09-19', category: 'toy', what: 'Teddy bear', value: 'low', steps: [] },
];

test('lost & found: items logged per day, open items and those past their keep-until date', () => {
  const { PulseMath, LostFoundMath: LF } = load(TOOLS);
  const result = plain(PulseMath.lostFound({ rows: found }, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20', lfCfg));
  assert.deepEqual(result.values, [0, 1, 1, 0, 0, 1, 0], 'found on the 15th, 16th and 19th');
  assert.equal(result.logged, 3);
  assert.equal(result.open, 5);
  assert.equal(result.over, 3, 'the phone, the backpack and the passport');
  assert.deepEqual(result.oldest, { what: 'Black phone', until: '2026-08-28' });
  // The register's own count agrees.
  const stats = LF.stats(LF.cleanRows(found, lfCfg), '2026-09-20', lfCfg, LF.rules(lfCfg));
  assert.equal(result.open, stats.open);
  assert.equal(result.over, stats.over);
  // The days the team typed win: low value kept 3 days, so the scarf (until the 18th) is past it too.
  assert.equal(plain(PulseMath.lostFound({ retLow: '3', rows: found }, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20', lfCfg)).over, 4);
  assert.equal(PulseMath.lostFound({ rows: [] }, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20', lfCfg), null);
  assert.equal(PulseMath.lostFound({ rows: found }, { from: '2026-09-14', to: '2026-09-20' }, '2026-09-20', {}), null, 'no rules, no card');
});

test('the page: cards for Room Inspection, the Maintenance Planner and Lost & Found, their flags, links and summary', async () => {
  const probe = load();
  const today = probe.ToolKit.today();
  const ago = (n) => probe.ToolKit.addDays(today, -n);
  const shiftDates = (rows, from) => rows.map((row) => ({ ...row, date: probe.ToolKit.addDays(today, Math.round((Date.parse(`${row.date}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5)) }));
  const page = PAGE.replace('"oeeReasons"', `"rooms":${JSON.stringify(roomCfg)},"lostFound":${JSON.stringify({ categories: lfCfg.categories, retention: lfCfg.retention, dueSoonDays: lfCfg.dueSoonDays, followUpDays: lfCfg.followUpDays })},"oeeReasons"`);
  const storage = {
    // The room rows with 3 September as today.
    'sc-room-inspection-sq': { threshold: 0.9, rows: shiftDates(roomRows, '2026-09-03') },
    // The plan with 20 September as today; postponements and readings move with it.
    'sc-maintenance-planner-sq': { ...plan, assets: plan.assets.map((asset) => ({ ...asset, tasks: asset.tasks.map((task) => ({ ...task, last: task.last ? shiftDates([{ date: task.last }], '2026-09-20')[0].date : '' })) })), rows: shiftDates(plan.rows, '2026-09-20').map((row) => (row.until ? { ...row, until: shiftDates([{ date: row.until }], '2026-09-20')[0].date } : row)) },
    'sc-lost-found-sq': { rows: shiftDates(found, '2026-09-20').map((row) => ({ ...row, steps: row.steps.map((step) => ({ ...step, date: shiftDates([step], '2026-09-20')[0].date })) })) },
    // The English register is not the Albanian page's.
    'sc-lost-found': { rows: [{ id: 'LF-9', date: today, category: 'toy', what: 'x', steps: [] }] },
  };
  const win = load(TOOLS, { lang: 'sq', url: 'https://example.test/sq/tools/shift-pulse/', html: page, storage });
  let copied = '';
  Object.defineProperty(win.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } } });
  const cards = [...win.document.querySelectorAll('.sp-card')];
  const byLabel = (label) => cards.find((card) => card.querySelector('.result-label').textContent === label);
  assert.deepEqual(cards.slice(3).map((card) => card.querySelector('.result-label').textContent), ['First-time pass', 'Overdue maintenance', 'Breakdowns', 'Found items']);
  const rooms = byLabel('First-time pass');
  assert.match(rooms.querySelector('.sp-card-value').textContent, /^50/);
  assert.match(rooms.textContent, /9 inspections · pass mark 90/);
  assert.match(rooms.textContent, /4 of 8 rooms passed at the first inspection/);
  assert.match(rooms.textContent, /Re-cleans open: 2/);
  assert.match(rooms.textContent, /Fails most: No hair \(2 ×\)/);
  assert.ok(rooms.querySelector('svg.sp-spark'));
  assert.ok(!rooms.querySelector('.sp-flag'), 'inside the p-chart limit');
  assert.equal(rooms.querySelector('a').href, 'https://example.test/sq/tools/room-inspection/');
  const overdue = byLabel('Overdue maintenance');
  assert.equal(overdue.querySelector('.sp-card-value').textContent, '3');
  assert.match(overdue.textContent, /2 on A assets/);
  assert.match(overdue.textContent, /Belt check · SRT-1 · Sorter/);
  assert.ok(overdue.querySelector('.sp-flag'));
  assert.equal(overdue.querySelector('a').href, 'https://example.test/sq/tools/maintenance-planner/');
  const stops = byLabel('Breakdowns');
  assert.equal(stops.querySelector('.sp-card-value').textContent, '3');
  assert.match(stops.textContent, /Downtime: 95 min/);
  assert.ok(stops.querySelector('.sp-flag'), 'two breakdowns beyond the c-chart limit');
  const items = byLabel('Found items');
  assert.equal(items.querySelector('.sp-card-value').textContent, '3');
  assert.match(items.textContent, /Open items: 5 · Past the keep-until date: 3/);
  assert.match(items.textContent, /Kept until .*: Black phone/);
  assert.equal(items.querySelector('.sp-flag').textContent, 'Decision due');
  assert.equal(items.querySelector('a').href, 'https://example.test/sq/tools/lost-found/');
  const attention = win.document.querySelector('.sp-attention').textContent;
  assert.match(attention, /3 maintenance tasks are overdue \(2 on A assets\)/);
  assert.match(attention, /Breakdowns are above the usual level on/);
  assert.match(attention, /3 found items are past their keep-until date/);
  assert.doesNotMatch(attention, /First-time pass is below/);
  // One shift chosen: the three tools keep no shift, and their cards say so.
  const shift = win.document.querySelector('[name=shift]');
  shift.value = 'Early';
  shift.dispatchEvent(new win.Event('change', { bubbles: true }));
  assert.match(win.document.querySelector('.sp-card:nth-child(4)').textContent, /This tool keeps no shift/);
  shift.value = '';
  shift.dispatchEvent(new win.Event('change', { bubbles: true }));
  [...win.document.querySelectorAll('button')].find((button) => button.textContent === 'Copy summary').click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.match(copied, /First-time pass rate: 50\s?% \(4 of 8 rooms\) · 9 inspections · pass mark 90\s?% · Re-cleans open: 2 · Fails most: No hair \(2 ×\)/);
  assert.match(copied, /Overdue maintenance: 3 \(2 on A assets\) · Breakdowns: 3 · Downtime: 95 min/);
  assert.match(copied, /Found items: 3 · Open items: 5 · Past the keep-until date: 3/);
});
