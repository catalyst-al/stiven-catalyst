// Shift Pulse reads the tools that joined later: Safety Cross, OEE, the Action Tracker and the 5S Audit. The numbers
// are in window.PulseMath (safety, oee, actions, fiveS); OEE is counted there without the OEE tool's script, so the
// tests hold it against window.OeeMath on the same rows.
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
  const texts = new Set([...source.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const m of source.matchAll(/tx\(\w[^?]*\?\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) { texts.add(JSON.parse(`"${m[1]}"`)); texts.add(JSON.parse(`"${m[2]}"`)); }
  const partial = fs.readFileSync('src/_includes/partials/shift-pulse.njk', 'utf8');
  for (const m of partial.matchAll(/\{\{ "((?:[^"\\]|\\.)*)" \| t\(lang\) \}\}/g)) texts.add(m[1]);
  for (const lang of ['de', 'sq']) {
    const ui = { ...JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8')), ...extra[lang] };
    for (const text of texts) assert.ok(ui[text], `${lang}: ${text}`);
  }
});
