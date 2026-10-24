// The Operations Report (src/js/ops-report.js): the periods, each source counted the way its own tool counts it (held
// against DelayMath and PulseMath, SafetyMath, OeeMath, FiveSMath, GembaMath, HotelKpisMath and KaizenMath), the
// comparison with the period before and the target, the summary and the focus, the three data files, and the page:
// the example on a first visit (kept in the page's memory, never in the other tools), sections only for the sources
// that hold data, the text, the Word file and the hand-off to the Action Tracker.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { TextEncoder } = require('node:util');
const nunjucks = require('nunjucks');
const { JSDOM, VirtualConsole } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/opsReport.json', de: 'src/_data/de/opsReport.json', sq: 'src/_data/sq/opsReport.json' };
const OEE = { en: 'src/_data/oee.json', de: 'src/_data/de/oee.json', sq: 'src/_data/sq/oee.json' };
const dataOf = (name, lang) => read(lang === 'en' ? `src/_data/${name}.json` : `src/_data/${lang}/${name}.json`);
const OTHER = ['lostFound', 'roomInspection', 'maintenancePlanner'];
const TOOL_SCRIPTS = ['lost-found', 'room-inspection', 'maintenance-planner'];

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/ops-report.njk', {
  cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang, oee: read(OEE.en),
  ...Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'en')])),
  de: { oee: read(OEE.de), ...Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'de')])) },
  sq: { oee: read(OEE.sq), ...Object.fromEntries(OTHER.map((name) => [name, dataOf(name, 'sq')])) },
}).replace(/<script src=[^>]*><\/script>/g, '');
// The tools the report reads with their own arithmetic, as the page hands them in (the data files of the language).
const toolsFor = (w, lang = 'en') => {
  const lf = dataOf('lostFound', lang), ri = dataOf('roomInspection', lang), mp = dataOf('maintenancePlanner', lang);
  return {
    lostFound: { M: w.LostFoundMath, cfg: { retention: lf.retention, categories: lf.categories, followUpDays: lf.followUpDays, dueSoonDays: lf.dueSoonDays } },
    roomInspection: { M: w.RoomInspectionMath, cfg: { threshold: ri.threshold, zones: ri.zones, templates: ri.templates } },
    maintenance: { M: w.MaintenancePlannerMath, cfg: { target: mp.target } },
  };
};

const NOW = '2026-10-24T10:00:00Z'; // a Saturday: last week is 12–18 October
const load = ({ lang = 'en', page = true, now = NOW, storage = {}, scripts = [] } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const virtualConsole = new VirtualConsole(); // the download link "navigates", which jsdom only reports
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`, { url: `https://example.test${base}/tools/ops-report/`, runScripts: 'outside-only', virtualConsole });
  const w = dom.window;
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.print = () => { w.printed = true; };
  w.downloads = [];
  w.URL.createObjectURL = (blob) => { w.downloads.push(blob); return 'blob:ops-report'; };
  w.URL.revokeObjectURL = () => {};
  w.Blob = class { constructor(parts, options) { this.parts = parts; this.type = options?.type; } };
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async (text) => { w.copied = text; } } });
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'docx-kit', ...TOOL_SCRIPTS, ...scripts, 'ops-report']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const sectionTitles = (w) => [...w.document.querySelectorAll('.or-section-title')].map((h) => h.textContent);

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape and keep their own storage key; the example stops are real OEE reasons', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-ops-report');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-ops-report-${lang}`, `${lang} keeps its own settings`);
    assert.deepEqual(shape(other), shape({ ...en, storageKey: other.storageKey }), `${lang} shape`);
    assert.deepEqual(other.periods.map((p) => p.key), en.periods.map((p) => p.key));
    assert.deepEqual(Object.keys(other.sources), Object.keys(en.sources));
  }
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = read(DATA[lang]);
    const reasons = read(OEE[lang]).reasons;
    const loss = (name) => reasons.find((r) => r.name === name)?.loss;
    assert.equal(loss(cfg.example.oee.stops.planned), 'planned', `${lang}: the break is a planned stop`);
    assert.equal(loss(cfg.example.oee.stops.breakdown), 'breakdowns', `${lang}: a breakdown`);
    assert.equal(loss(cfg.example.oee.stops.setup), 'setup', `${lang}: a changeover`);
    assert.ok(cfg.tips.length >= 3 && cfg.tips.every((tip) => tip.length === 2 && tip[0] && tip[1]));
  }
});

test('the periods: a week from Monday, a month, the same days before, and a custom span', () => {
  const { OpsReportMath: M } = load({ page: false });
  const last = plain(M.period('lastWeek', '2026-10-24'));
  assert.deepEqual([last.from, last.to, last.before.from, last.before.to, last.kind], ['2026-10-12', '2026-10-18', '2026-10-05', '2026-10-11', 'week']);
  const now = plain(M.period('thisWeek', '2026-10-22'));
  assert.deepEqual([now.from, now.to, now.before.from, now.before.to], ['2026-10-19', '2026-10-22', '2026-10-12', '2026-10-15'], 'a week in progress against the same days');
  const month = plain(M.period('thisMonth', '2026-03-31'));
  assert.deepEqual([month.from, month.to, month.before.from, month.before.to], ['2026-03-01', '2026-03-31', '2026-02-01', '2026-02-28'], 'never past the end of a shorter month');
  const partMonth = plain(M.period('thisMonth', '2026-10-10'));
  assert.deepEqual([partMonth.before.from, partMonth.before.to], ['2026-09-01', '2026-09-10']);
  const lastMonth = plain(M.period('lastMonth', '2026-01-15'));
  assert.deepEqual([lastMonth.from, lastMonth.to, lastMonth.before.from, lastMonth.before.to, lastMonth.kind], ['2025-12-01', '2025-12-31', '2025-11-01', '2025-11-30', 'month']);
  const custom = plain(M.period('custom', '2026-10-24', { from: '2026-10-10', to: '2026-10-01' }));
  assert.deepEqual([custom.from, custom.to, custom.days, custom.before.from, custom.before.to], ['2026-10-01', '2026-10-10', 10, '2026-09-21', '2026-09-30'], 'swapped dates are put in order');
  assert.equal(M.period('nonsense', '2026-10-24').key, 'lastWeek');
  assert.equal(M.slotsOf({ from: '2026-10-01', to: '2026-10-31' }).unit, 'day');
  assert.deepEqual(plain(M.slotsOf({ from: '2026-08-01', to: '2026-10-01' })).keys.slice(0, 2), ['2026-07-27', '2026-08-03'], 'longer spans by the week from Monday');
});

test('quality and delivery count as Shift Pulse counts the logs: units, the rate on the daily volumes, on time after the grace', () => {
  const { OpsReportMath: M, PulseMath } = load({ page: false, scripts: ['shift-pulse'] });
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const damage = {
    target: '0.3',
    volumes: [{ date: '2026-10-12', volume: 3000 }, { date: '2026-10-13', volume: 2800 }, { date: '2026-10-14', volume: 3100 }, { date: '2026-10-20', volume: 999 }],
    rows: [
      { date: '2026-10-12', shift: 'Early', cause: 'Stacking', units: 4 }, { date: '2026-10-13', shift: 'Late', cause: 'Stacking', units: 3 },
      { date: '2026-10-13', shift: 'Late', cause: 'Handling', units: 2 }, { date: '2026-10-14', shift: 'Early', cause: 'Stacking', units: '' },
      { date: '2026-10-25', shift: 'Early', cause: 'Handling', units: 9 },
    ],
  };
  const mine = plain(M.defects(damage, range));
  const pulse = plain(PulseMath.compute({ damage, incomplete: { rows: [] }, delay: { rows: [] } }, range).damage);
  assert.equal(mine.total, 10);
  assert.equal(mine.total, pulse.total);
  close(mine.rate, pulse.rate, 'the damage rate');
  close(mine.rate, 10 / 8900, 'units over the volumes of the period');
  close(mine.target, 0.003, 'a target typed in percent');
  assert.deepEqual(mine.cause, { name: 'Stacking', units: 8, share: 0.8 });
  assert.deepEqual(mine.series, [4, 5, 1, 0, 0, 0, 0]);
  // A day with entries and no volume: no rate, as in Shift Pulse.
  const gap = { ...damage, volumes: damage.volumes.slice(1) };
  assert.equal(M.defects(gap, range).rate, null);
  assert.equal(PulseMath.compute({ damage: gap, incomplete: { rows: [] }, delay: { rows: [] } }, range).damage.rate, null);
  // The profile's target stands in for an empty box; no rows in the period is no section.
  close(M.defects({ ...damage, target: '' }, range, 0.5).target, 0.005, 'profile target');
  assert.equal(M.defects(damage, { from: '2026-09-01', to: '2026-09-07' }), null);

  const delay = {
    arrivalGrace: '10', target: '95',
    rows: [
      { date: '2026-10-12', planArr: '10:00', actArr: '10:05' }, { date: '2026-10-12', planArr: '11:00', actArr: '11:25' },
      { date: '2026-10-13', planArr: '23:50', actArr: '00:20' }, { date: '2026-10-13', planArr: '08:00', actArr: '08:10' },
      { date: '2026-10-14', planArr: '09:00', actArr: '' },
    ],
  };
  const d = plain(M.delivery(delay, range));
  const p = plain(PulseMath.compute({ damage: { rows: [] }, incomplete: { rows: [] }, delay }, range).delay);
  assert.equal(d.routes, 4, 'a route without its arrival is left out');
  assert.equal(d.late, 2, 'past midnight is 30 minutes late, ten minutes is inside the grace');
  close(d.onTime, p.onTime, 'on time');
  assert.equal(d.minutes, 27.5);
  close(d.target, 0.95, 'target');
  assert.deepEqual(d.series.slice(0, 3), [0.5, 0.5, null]);
  assert.equal(M.minutesLate('23:50', '00:20'), PulseMath.minutesLate('23:50', '00:20'));
  const partial = plain(M.delivery(delay, range, { partial: true }));
  assert.equal(partial.onTime, null);
  assert.equal(partial.target, null);
});

test('safety, OEE and the workplace count as the Safety Cross, the OEE tool, the 5S Audit and the Gemba Walk do', () => {
  const w = load({ page: false, scripts: ['safety-cross', 'oee', 'five-s-audit', 'gemba-walk'] });
  const { OpsReportMath: M, SafetyMath, OeeMath, FiveSMath, GembaMath } = w;
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const safetyRows = [
    { date: '2026-09-02', type: 'lost-time', area: 'Dock' }, { date: '2026-10-13', type: 'near-miss' }, { date: '2026-10-14', type: 'unsafe-act' },
    { date: '2026-10-14', type: 'first-aid' }, { date: '2026-10-15', type: 'no-lost-time', area: 'Loading' }, { date: '2026-10-16', type: 'positive' },
  ];
  const s = plain(M.safety({ rows: safetyRows }, range));
  const c = SafetyMath.counts(safetyRows.filter((r) => r.date >= range.from && r.date <= range.to));
  assert.equal(s.accidents, c['lost-time'] + c['no-lost-time']);
  assert.equal(s.nearMisses, c['near-miss'] + c['unsafe-condition'] + c['unsafe-act']);
  assert.equal(s.firstAid, c['first-aid']);
  assert.equal(s.daysSince, SafetyMath.daysSince(safetyRows, range.to));
  assert.deepEqual(s.lastAccident, { date: '2026-10-15', area: 'Loading' });
  assert.deepEqual(s.series.accidents, [0, 0, 0, 1, 0, 0, 0]);
  assert.equal(M.safety({ rows: safetyRows }, { from: '2026-10-01', to: '2026-10-07' }), null, 'no entry, no section');

  const reasons = read(OEE.en).reasons;
  const saved = {
    equipment: [{ name: 'Sorter 1', rate: 600 }, { name: 'Wrapper', cycle: 12 }, { name: 'Labeller' }],
    rows: [
      { date: '2026-10-12', equipment: 'Sorter 1', planned: 480, stops: [{ reason: 'Break', minutes: 30 }, { reason: 'Jam', minutes: 10 }, { reason: 'Changeover', minutes: 25 }], pieces: 3600, rejects: 40 },
      { date: '2026-10-13', equipment: 'wrapper', planned: 240, stops: [{ reason: 'Breakdown', minutes: 40 }], pieces: 900, rejects: 9 },
      { date: '2026-10-14', equipment: 'Sorter 1', planned: 100, stops: [], pieces: 5000, rejects: 0 },
      { date: '2026-10-14', equipment: 'Labeller', planned: 480, stops: [], pieces: 1000 },
    ],
  };
  const o = plain(M.equipment(saved, range, reasons, 80));
  const machine = (name) => saved.equipment.find((m) => m.name.toLowerCase() === name.toLowerCase());
  const theirs = OeeMath.combine(saved.rows.slice(0, 3).map((r) => OeeMath.entry(r, OeeMath.idealCycle(machine(r.equipment)), reasons)));
  for (const key of ['availability', 'performance', 'quality', 'oee']) close(o[key], theirs[key], key);
  assert.equal(o.unrated, 1, 'the labeller has no ideal rate');
  assert.equal(o.target, 0.8);
  assert.equal(M.oeeTarget(0.7), 0.7);
  assert.equal(M.oeeTarget(null), 0.85);
  assert.deepEqual(o.machines.map((m) => m.name), ['wrapper', 'Sorter 1'].sort((a, b) => o.machines.find((m) => m.name === a).oee - o.machines.find((m) => m.name === b).oee));
  assert.equal(o.lowest.name, o.machines[0].name);
  assert.ok(['availability', 'performance', 'quality'].includes(o.lowest.factor));

  const pillars = ['sort', 'set', 'shine', 'standardize', 'sustain'];
  const audits = [
    { date: '2026-10-13', area: 'Dock', scores: { sort: [4, 4], set: [2, null, 2], shine: [] } },
    { date: '2026-10-15', area: 'Aisle', scores: { sort: [3, 1], set: [2], shine: [4], standardize: [0], sustain: [2, 2] } },
    { date: '2026-10-16', area: 'Dock', scores: { sort: [2] } },
    { date: '2026-09-01', area: 'Dock', scores: { sort: [0] } },
  ];
  audits.slice(0, 3).forEach((a) => close(M.fiveSOverall(a.scores), FiveSMath.score(a.scores, pillars).overall, `5S ${a.date}`));
  const walks = [
    { type: 'lpa', date: '2026-10-12', layer: 'team-lead', answers: ['yes', 'no', 'na', 'yes', null] },
    { type: 'lpa', date: '2026-10-14', layer: 'area-manager', answers: ['yes', 'yes', 'yes', 'no'] },
    { type: 'waste', date: '2026-10-15', tallies: { motion: 3 } },
    { type: 'lpa', date: '2026-09-01', answers: ['no', 'no'] },
  ];
  const wp = plain(M.workplace({ rows: audits }, { rows: walks }, range, 80));
  close(wp.gemba, GembaMath.combined(walks.slice(0, 3)).pct, 'Gemba compliance');
  assert.equal(wp.walks, 3);
  assert.equal(wp.lpa, 2);
  assert.equal(wp.audits, 3);
  close(wp.fiveS, (M.fiveSOverall(audits[0].scores) + M.fiveSOverall(audits[1].scores) + M.fiveSOverall(audits[2].scores)) / 3, 'mean of the audits');
  assert.equal(wp.fiveSTarget, 0.8);
  assert.equal(wp.areas[0].area, wp.areas[0].score <= wp.areas[1].score ? wp.areas[0].area : '', 'the weakest area first');
  assert.equal(M.workplace({ rows: [] }, { rows: [] }, range), null);
});

test('the hotel and the Kaizen Board count as Hotel KPIs and the board do', () => {
  const w = load({ page: false, scripts: ['hotel-kpis', 'kaizen-board'] });
  const { OpsReportMath: M, HotelKpisMath: H, KaizenMath: K } = w;
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const rows = [
    { date: '2026-10-12', available: 120, sold: 90, roomRev: 10350, noShows: 2, arrivals: 40 },
    { date: '2026-10-13', available: 120, sold: 100, roomRev: 12000, noShows: 0, arrivals: 45 },
    { date: '2026-10-13', available: 120, sold: 104, roomRev: 12480, noShows: 1, arrivals: 46 },
    { date: '2026-10-20', available: 120, sold: 60, roomRev: 6000 },
  ];
  const h = plain(M.hotel({ rows, budgetOcc: '80', budgetAdr: '118' }, range));
  const k = H.kpis(H.totals(H.dailyRows(rows).filter((r) => r.date <= range.to)));
  close(h.occ, k.occ, 'occupancy');
  close(h.adr, k.adr, 'ADR');
  close(h.revpar, k.revpar, 'RevPAR');
  assert.equal(h.nights, 2, 'a night pasted twice keeps its latest figures');
  const budget = H.budgetOf({ budgetOcc: '80', budgetAdr: '118', budgetRevpar: '' });
  assert.deepEqual(plain(h.budget), { occ: budget.occ, adr: budget.adr, revpar: budget.revpar });
  assert.deepEqual(plain(M.budgetOf({ budgetOcc: '0.75', budgetAdr: '100', budgetRevpar: '70' })), { occ: 0.75, adr: 100, revpar: 70 });

  const ideas = [
    { title: 'A', date: '2026-09-01', status: 'act', adopted: '2026-10-13', saving: 300 },
    { title: 'B', date: '2026-10-14', status: 'idea', adopted: '', saving: 100 },
    { title: 'C', date: '2026-10-15', status: 'act', adopted: '2026-10-16', saving: '' },
    { title: 'D', date: '2026-08-01', status: 'act', adopted: '2026-08-20', saving: 900 },
  ];
  const i = plain(M.improvement({ rows: ideas }, range));
  assert.equal(i.ideas, 2);
  assert.equal(i.adopted, 2);
  assert.equal(i.saving, K.savings(ideas.filter((r) => r.adopted >= range.from && r.adopted <= range.to)).month);
  assert.equal(M.improvement({ rows: ideas }, { from: '2026-07-01', to: '2026-07-31' }), null);
});

test('Lost & Found counts as the register does: logged in the period, back with the owner by its end, past the keep-until date', () => {
  const w = load({ page: false });
  const M = w.OpsReportMath;
  const tools = toolsFor(w);
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const rows = [
    { date: '2026-10-12', category: 'phone', value: 'high', steps: [{ status: 'contacted', date: '2026-10-12' }, { status: 'returned', date: '2026-10-14' }] },
    { date: '2026-10-13', category: 'bag', value: 'medium', steps: [{ status: 'contacted', date: '2026-10-13' }, { status: 'returned', date: '2026-10-21' }] },
    { date: '2026-10-16', category: 'clothing', value: 'low', steps: [] },
    // Documents are kept 7 days: found on the 8th, still here on the 18th.
    { date: '2026-10-08', category: 'documents', value: 'high', steps: [{ status: 'contacted', date: '2026-10-08' }] },
    // A coat found 100 days before the end and never claimed: past its 90 days.
    { date: '2026-07-10', category: 'clothing', value: 'low', steps: [] },
    // The same, but given to charity before the end: closed.
    { date: '2026-07-10', category: 'clothing', value: 'low', steps: [{ status: 'charity', date: '2026-10-11' }] },
    // Past its date, but decided on after the end: it was still open then.
    { date: '2026-07-01', category: 'keys', value: 'low', steps: [{ status: 'destroyed', date: '2026-10-20' }] },
  ];
  const lf = plain(M.lostFound({ rows }, range, tools.lostFound));
  assert.equal(lf.logged, 3, 'three found in the period');
  assert.equal(lf.returned, 1, 'the bag went back after the end, so it does not count yet');
  close(lf.returnRate, 1 / 3, 'one of three back with its owner');
  assert.equal(lf.over, 3, 'the passport (7 days), the coat (90 days) and the keys, decided on only after the end');
  // The register itself, on the last day of the period with the steps known by then, says the same.
  const L = w.LostFoundMath;
  const cfg = tools.lostFound.cfg;
  const asOf = rows.map((row) => ({ ...row, steps: row.steps.filter((step) => step.date <= range.to) }));
  assert.equal(L.stats(asOf, range.to, cfg, L.rules(cfg, {})).over, lf.over);
  // A retention typed into the register wins: 120 days for low-value items keeps the coat and the keys.
  assert.equal(M.lostFound({ rows, retLow: '120' }, range, tools.lostFound).over, 1);
  assert.equal(M.lostFound({ rows: [] }, range, tools.lostFound), null, 'nothing logged, nothing over: no part');
  assert.equal(M.lostFound({ rows }, range, null), null, 'without the register\'s arithmetic there is no part');
});

test('Room Inspection counts as the tool does: the pass mark, a failed critical item, re-checks left out, the item that fails most', () => {
  const w = load({ page: false });
  const M = w.OpsReportMath;
  const tools = toolsFor(w);
  const R = w.RoomInspectionMath;
  const cfg = tools.roomInspection.cfg;
  const zones = cfg.zones.map((z) => z.key);
  const items = R.itemsOf(cfg.templates.standard, zones);
  const all = (answer, fails = []) => Object.fromEntries(items.map((item) => [item.qid, fails.includes(item.qid) ? 'fail' : answer]));
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const rows = [
    { date: '2026-10-13', time: '10:00', room: '101', template: 'standard', answers: all('pass') },
    // A critical item fails the room on its own; the same room again that day is a re-check.
    { date: '2026-10-13', time: '10:30', room: '102', template: 'standard', answers: all('pass', ['bathroom-0']) },
    { date: '2026-10-13', time: '11:05', room: '102', template: 'standard', answers: all('pass') },
    // Two items of weight 2 fail: 58 of 62 = 93.5 %, above the pass mark of 90 %.
    { date: '2026-10-14', time: '09:40', room: '103', template: 'standard', answers: all('pass', ['bathroom-2', 'minibar-1']) },
    { date: '2026-10-15', time: '09:40', room: '104', template: 'standard', answers: all('pass', ['bathroom-2']) },
    { date: '2026-10-08', time: '09:40', room: '101', template: 'standard', answers: all('pass', ['bathroom-2']) },
  ];
  const ri = plain(M.inspection({ rows }, range, tools.roomInspection));
  assert.equal(ri.inspections, 5, 'five in the period, the re-check among them');
  assert.deepEqual([ri.first, ri.firstPass], [4, 3], 'the re-check is no first inspection');
  close(ri.rate, 3 / 4, 'first-time pass rate');
  assert.equal(ri.threshold, 0.9);
  assert.deepEqual(ri.fault, { name: 'Shower screen, tiles and grout free of lime and mould', zone: 'Bathroom', count: 2, share: 2 / 4 });
  // The tool's own arithmetic on the same rows.
  const own = R.overall(R.annotate(rows, (row) => R.itemsOf(cfg.templates[row.template], zones), cfg.threshold).filter((row) => row.date >= range.from && row.date <= range.to));
  assert.deepEqual([own.first, own.firstPass], [ri.first, ri.firstPass]);
  // The pass mark saved in the tool counts: at 95 % room 103 fails too.
  const strict = plain(M.inspection({ rows, threshold: 0.95 }, range, tools.roomInspection));
  assert.deepEqual([strict.firstPass, strict.threshold], [2, 0.95]);
  assert.equal(M.inspection({ rows }, { from: '2026-09-01', to: '2026-09-30' }, tools.roomInspection), null);
});

test('the Maintenance Planner counts as the planner does: PM compliance, overdue at the end, breakdowns, MTTR and MTBF by hand', () => {
  const w = load({ page: false });
  const M = w.OpsReportMath;
  const tools = toolsFor(w);
  // A weekly task (no tolerance) last done on 28 September: due 5 October, done that day; due 12 October, done three days
  // late on the 15th; due 22 October, not done.
  const task = { id: 't1', text: 'Check the sorter belt', every: 1, unit: 'weeks', hours: 0, who: 'internal', minutes: 30, statutory: false, checklist: [], last: '2026-09-28', lastHours: null, start: '' };
  const saved = {
    assets: [{ id: 'a1', tag: 'SRT-1', name: 'Sorter 1', tasks: [task] }, { id: 'a2', tag: 'FL-01', name: 'Forklift 1', tasks: [] }],
    rows: [
      { id: 'r1', kind: 'done', asset: 'a1', task: 't1', date: '2026-10-05', minutes: 30, hours: null },
      { id: 'r2', kind: 'done', asset: 'a1', task: 't1', date: '2026-10-15', minutes: 30, hours: null },
      { id: 'r3', kind: 'breakdown', asset: 'a1', date: '2026-10-13', minutes: 30, cause: 'sensor' },
      { id: 'r4', kind: 'breakdown', asset: 'a2', date: '2026-10-16', minutes: 90, cause: 'battery' },
      { id: 'r5', kind: 'breakdown', asset: 'a2', date: '2026-10-08', minutes: 45, cause: 'battery' },
      { id: 'r6', kind: 'breakdown', asset: 'gone', date: '2026-10-14', minutes: 500, cause: 'other' },
    ],
  };
  const today = '2026-10-24';
  const last = plain(M.maintenance(saved, { from: '2026-10-12', to: '2026-10-18' }, today, tools.maintenance));
  assert.deepEqual([last.scheduled, last.onTime, last.pm], [1, 0, 0], 'due on the 12th, done on the 15th: late');
  assert.equal(last.overdue, 0, 'at the end of the 18th the next date was the 22nd');
  assert.deepEqual([last.breakdowns, last.minutes], [2, 120], 'an entry of an asset no longer in the plan is left out');
  assert.equal(last.mttr, 60, 'MTTR = 120 minutes / 2');
  // MTBF = operating time / failures: 2 assets × 7 days × 24 h = 336 h, less the 2 h stopped, over 2 = 167 h.
  close(last.mtbf, (2 * 7 * 24 - 120 / 60) / 2, 'MTBF');
  assert.equal(last.mtbf, 167);
  assert.equal(last.target, read('src/_data/maintenancePlanner.json').target);
  const before = plain(M.maintenance(saved, { from: '2026-10-05', to: '2026-10-11' }, today, tools.maintenance));
  assert.deepEqual([before.scheduled, before.onTime, before.pm, before.overdue, before.breakdowns], [1, 1, 1, 0, 1]);
  assert.equal(before.mttr, null, 'one breakdown is not enough to say');
  assert.equal(before.mtbf, null);
  const now = plain(M.maintenance(saved, { from: '2026-10-19', to: '2026-10-24' }, today, tools.maintenance));
  assert.deepEqual([now.scheduled, now.onTime, now.overdue], [1, 0, 1], 'due on the 22nd and still open today');
  // The planner's own compliance over the same weeks.
  const P = w.MaintenancePlannerMath;
  const events = saved.rows.filter((r) => r.asset === 'a1');
  const h = P.history(task, events, P.meterPoints(events));
  assert.deepEqual(plain(P.compliance([h], '2026-10-05', '2026-10-24', today)), { scheduled: 3, onTime: 1, rate: 1 / 3 });
  assert.equal(M.maintenance({ assets: [], rows: saved.rows }, { from: '2026-10-12', to: '2026-10-18' }, today, tools.maintenance), null, 'no plan, no part');
});

test('the hotel and equipment sections take in their other tools, each part against the period before, even without the first tool', () => {
  const w = load({ page: false });
  const M = w.OpsReportMath;
  const tools = toolsFor(w);
  const range = M.period('lastWeek', '2026-10-24');
  const src = {
    lostFound: { rows: [{ date: '2026-10-13', category: 'phone', value: 'high', steps: [{ status: 'returned', date: '2026-10-14' }] }, { date: '2026-10-06', category: 'bag', value: 'medium', steps: [] }] },
    maintenance: { assets: [{ id: 'a1', tag: 'SRT-1', tasks: [] }], rows: [{ id: 'b1', kind: 'breakdown', asset: 'a1', date: '2026-10-14', minutes: 40, cause: 'jam' }] },
  };
  const list = M.sections(src, range, range.before, { tools, today: '2026-10-24' });
  assert.deepEqual(plain(list.map((s) => s.key)), ['equipment', 'hotel']);
  const [eq, hotel] = list;
  assert.equal(eq.data, null, 'no OEE');
  assert.deepEqual(Object.keys(eq.parts), ['maintenance']);
  assert.deepEqual(plain(eq.metrics.map((m) => [m.key, m.part, m.value, m.before])), [['pm', 'maintenance', null, null], ['pmOverdue', 'maintenance', 0, null], ['breakdowns', 'maintenance', 1, null], ['downtime', 'maintenance', 40, null]]);
  assert.equal(hotel.data, null, 'no Hotel KPIs');
  assert.deepEqual(plain(hotel.metrics.map((m) => [m.key, m.value, m.before])), [['lostLogged', 1, 1], ['lostReturned', 1, 0], ['lostOver', 0, 0]]);
  assert.equal(hotel.metrics[1].cmp.trend, 'better');
  // Without the tools' arithmetic the parts stay out, and so do the sections.
  assert.deepEqual(plain(M.sections(src, range, range.before, {}).map((s) => s.key)), []);
  const counts = M.counts(src, range);
  assert.deepEqual([counts['lost-found'], counts['maintenance-planner'], counts['room-inspection']], [1, 1, 0]);
  assert.equal(M.holdsAnything({ maintenance: { assets: [{ id: 'a1' }], rows: [] } }), true, 'a plan without a log yet is data');
});

test('actions: opened, closed and verified in the period, overdue as the list stood at its end, and the handovers', () => {
  const { OpsReportMath: M } = load({ page: false });
  const range = { from: '2026-10-12', to: '2026-10-18' };
  const rows = [
    { title: 'Open, due before the end', owner: 'Anna', status: 'open', created: '2026-10-01', due: '2026-10-15' },
    { title: 'Closed after the period, overdue at its end', owner: 'Marco', status: 'done', created: '2026-10-02', due: '2026-10-10', closed: '2026-10-20' },
    { title: 'Closed in the period', owner: 'Marco', status: 'done', created: '2026-10-12', due: '2026-10-11', closed: '2026-10-14' },
    { title: 'Verified in the period', owner: 'Jonas', status: 'verified', created: '2026-10-05', due: '2026-10-20', closed: '2026-10-16' },
    { title: 'Created after the period', owner: 'Anna', status: 'open', created: '2026-10-20', due: '2026-10-01' },
    { title: 'Due on the last day', owner: 'Besnik', status: 'doing', created: '2026-10-13', due: '2026-10-18' },
  ];
  const handover = { history: [
    { handover: { date: '2026-10-13', issues: [{ text: 'Door sticks', done: false }, { text: 'Fixed', done: true }, { text: ' ', done: false }] } },
    { handover: { date: '2026-10-09', issues: [{ text: 'Old', done: false }] } },
  ] };
  const a = plain(M.actions(rows, range, handover));
  assert.equal(a.opened, 2);
  assert.equal(a.closed, 2);
  assert.equal(a.verified, 1);
  assert.equal(a.overdue, 2, 'the open one and the one closed only after the period');
  assert.deepEqual(a.owners, [{ owner: 'Anna', n: 1 }, { owner: 'Marco', n: 1 }]);
  assert.equal(a.handovers, 1);
  assert.equal(a.carried, 1);
  assert.equal(M.actions([], { from: '2026-01-01', to: '2026-01-07' }, null), null);
});

test('the comparison: arrows for the direction, words for better or worse, the target met or missed', () => {
  const { OpsReportMath: M } = load({ page: false });
  assert.deepEqual(plain(M.compare({ value: 0.004, before: 0.003, better: 'lower', target: 0.003, format: 'share' })).arrow, '▲');
  const worse = plain(M.compare({ value: 0.004, before: 0.003, better: 'lower', target: 0.003, format: 'share' }));
  assert.equal(worse.trend, 'worse');
  assert.equal(worse.target, 'missed');
  const better = plain(M.compare({ value: 0.91, before: 0.88, better: 'higher', target: 0.9, format: 'pct' }));
  assert.deepEqual([better.arrow, better.trend, better.target], ['▲', 'better', 'met']);
  assert.equal(M.compare({ value: 12, before: 12.2, better: 'higher', format: 'int' }).trend, 'same', 'less than the shown precision is no change');
  assert.equal(M.compare({ value: 3, before: 5, better: 'none', format: 'int' }).arrow, '▼');
  assert.equal(M.compare({ value: 3, before: 5, better: 'none', format: 'int' }).trend, 'none');
  assert.equal(M.compare({ value: 3, before: null, better: 'lower', target: 0, format: 'int' }).trend, 'none');
  assert.equal(M.compare({ value: 0, before: 2, better: 'lower', target: 0, format: 'int' }).target, 'met');
  assert.equal(M.fill({ one: 'One {x}.', many: '{n} {x}s.' }, { n: 3, x: 'day' }, 3), '3 days.');
  assert.equal(M.fill({ one: 'One {x}.', many: '{n} {x}s.' }, { n: 1, x: 'day' }, 1), 'One day.');
});

test('the example: fourteen weeks for every source, the same on the same day, and every section of the report', () => {
  const w = load({ page: false });
  const { OpsReportMath: M } = w;
  const tools = toolsFor(w);
  const cfg = read(DATA.en);
  const a = plain(M.exampleSources(cfg.example, '2026-10-24', tools));
  const b = plain(M.exampleSources(cfg.example, '2026-10-24', tools));
  assert.deepEqual(a, b, 'seeded: the same day gives the same example');
  ['damage', 'incomplete', 'night', 'delay', 'safety', 'oee', 'maintenance', 'fiveS', 'gemba', 'hotel', 'lostFound', 'roomInspection', 'kaizen'].forEach((key) => assert.ok(a[key].rows.length > 0, key));
  assert.equal(a.maintenance.assets.length, 5);
  assert.ok(a.maintenance.rows.filter((r) => r.kind === 'breakdown').length >= 20, 'breakdowns through the fourteen weeks');
  assert.ok(a.roomInspection.rows.length > 500 && a.lostFound.rows.length > 50);
  // The example's maintenance log is one the planner reads: its tasks have due dates and the open ones are overdue today.
  const P = w.MaintenancePlannerMath;
  const overdue = a.maintenance.assets.flatMap((asset) => asset.tasks.map((task) => { const ev = a.maintenance.rows.filter((r) => r.asset === asset.id); return P.statusOf(P.nextDue(task, ev, P.meterPoints(ev)).due, '2026-10-24'); })).filter((st) => st === 'overdue').length;
  assert.equal(overdue, cfg.example.maintenance.open.length, 'the tasks left open are overdue');
  assert.ok(a.actions.length >= 5);
  assert.ok(a.handover.history.length > 0);
  const dates = ['damage', 'delay', 'safety', 'oee', 'hotel'].flatMap((key) => a[key].rows.map((r) => r.date)).sort();
  assert.equal(dates.at(-1) <= '2026-10-24', true, 'nothing in the future');
  assert.ok(dates[0] <= '2026-07-20', 'the month before last month is covered');
  for (const [name, today] of [['lastWeek', '2026-10-24'], ['thisMonth', '2026-10-24'], ['lastMonth', '2026-10-24'], ['lastWeek', '2026-11-02']]) {
    const src = M.exampleSources(cfg.example, today, tools);
    const p = M.period(name, today);
    const list = M.sections(src, p, p.before, { targets: src.workplace.targets, reasons: read(OEE.en).reasons, tools, today });
    assert.deepEqual(plain(list.map((s) => s.key)), ['safety', 'quality', 'delivery', 'equipment', 'workplace', 'hotel', 'improvement', 'actions'], `${name} on ${today}`);
    // Each tool of a section shows two to four numbers: the section's own, then each of its parts.
    list.forEach((s) => [undefined, ...Object.keys(s.parts || {})].forEach((part) => {
      const n = s.metrics.filter((m) => m.part === part).length;
      assert.ok(n >= 2 && n <= 4, `${s.key}${part ? ` · ${part}` : ''}: two to four numbers (${n})`);
    }));
    assert.deepEqual(Object.keys(list.find((s) => s.key === 'equipment').parts), ['maintenance']);
    assert.deepEqual(Object.keys(list.find((s) => s.key === 'hotel').parts), ['lostFound', 'inspection']);
    assert.ok(list.flatMap((s) => s.metrics).filter((m) => m.part).every((m) => Number.isFinite(m.before) || m.value === null || m.before === null), 'the parts have a period before');
    const high = M.highlights(list);
    assert.ok(high.focus.length === 3, 'three focus items');
    assert.notEqual(high.risk.kind, 'none');
  }
  // Last week holds the example's accident, which leads the risk and the focus.
  const src = M.exampleSources(cfg.example, '2026-10-24', tools);
  const p = M.period('lastWeek', '2026-10-24');
  const high = M.highlights(M.sections(src, p, p.before, { targets: src.workplace.targets, reasons: read(OEE.en).reasons, tools, today: '2026-10-24' }));
  assert.equal(high.risk.kind, 'accident');
  assert.equal(high.focus[0].kind, 'accident');
});

test('the risk and the focus follow the data: a target missed before overdue actions, before a number that got worse', () => {
  const { OpsReportMath: M } = load({ page: false });
  const range = M.period('lastWeek', '2026-10-24');
  const day = (d) => `2026-10-${String(d).padStart(2, '0')}`;
  const delay = (late) => ({ target: '95', rows: Array.from({ length: 20 }, (_, i) => ({ date: day(12 + (i % 5)), planArr: '10:00', actArr: i < late ? '10:40' : '10:00' })) });
  const before = (late) => ({ ...delay(late), rows: delay(late).rows.map((r) => ({ ...r, date: day(5 + (Number(r.date.slice(8)) - 12)) })) });
  const src = { delay: { ...delay(3), rows: [...delay(3).rows, ...before(1).rows] }, actions: [{ title: 'Late one', owner: 'Anna', status: 'open', created: day(1), due: day(10) }] };
  const list = M.sections(src, range, range.before, {});
  const high = M.highlights(list);
  assert.equal(high.risk.kind, 'target', 'on time 85 % against 95 %');
  assert.equal(high.risk.metric.key, 'onTime');
  assert.deepEqual(plain(high.focus.map((f) => f.kind)), ['target', 'overdue']);
  assert.equal(high.worse.key, 'onTime');
  const fine = M.highlights(M.sections({ delay: { ...delay(0), rows: [...delay(0).rows, ...before(2).rows] } }, range, range.before, {}));
  assert.equal(fine.risk.kind, 'none');
  assert.equal(fine.better.key, 'onTime');
  assert.deepEqual(plain(fine.focus), []);
});

test('a first visit opens on the example: every section with numbers, a chart and a sentence, held in memory only', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load({ lang });
    const doc = w.document;
    const results = doc.querySelector('[data-results]');
    assert.equal(results.hidden, false, `${lang}: the report shows`);
    const cfg = read(DATA[lang]);
    assert.deepEqual(sectionTitles(w), [cfg.sections.summary, cfg.sections.safety, cfg.sections.quality, cfg.sections.delivery, cfg.sections.equipment, cfg.sections.workplace, cfg.sections.hotel, cfg.sections.improvement, cfg.sections.actions, cfg.sections.focusWeek]);
    assert.ok(doc.querySelectorAll('.or-section svg.ck-chart').length >= 6, `${lang}: charts`);
    // Lost & Found and Room Inspection in the hotel, the Maintenance Planner with the equipment: a title, numbers, a sentence.
    assert.deepEqual([...doc.querySelectorAll('.or-hotel .or-part-title')].map((h) => h.textContent), [cfg.parts.lostFound, cfg.parts.inspection]);
    assert.deepEqual([...doc.querySelectorAll('.or-equipment .or-part-title')].map((h) => h.textContent), [cfg.parts.maintenance]);
    doc.querySelectorAll('.or-part').forEach((part) => {
      assert.ok(part.querySelectorAll('.or-stat').length >= 2, `${lang}: numbers in ${part.className}`);
      assert.ok(part.querySelector('.or-sentence').textContent.length > 30, `${lang}: a sentence in ${part.className}`);
    });
    assert.match(doc.querySelector('.or-part-inspection .or-sentence').textContent, /90\s?%/, `${lang}: the pass mark in the sentence`);
    assert.match(doc.querySelector('.or-part-maintenance .or-sentence').textContent, /MTBF .* MTTR /, `${lang}: MTBF and MTTR where there are two breakdowns or more`);
    const sourceNames = [...doc.querySelectorAll('.or-sources li a')].map((a) => a.textContent);
    ['maintenance-planner', 'lost-found', 'room-inspection'].forEach((tool) => assert.ok(sourceNames.includes(cfg.sources[tool]), `${lang}: ${tool} in the list of sources`));
    assert.equal(doc.querySelectorAll('.or-focus-list li').length, 3);
    assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the example note says so');
    assert.ok(doc.querySelector('[data-empty]').hidden);
    const text = results.textContent;
    assert.ok(!/\{\w+\}/.test(text), `${lang}: every placeholder filled: ${text.match(/.{40}\{\w+\}.{20}/)?.[0]}`);
    assert.ok(!/undefined|NaN/.test(text), `${lang}: no undefined or NaN`);
    const summary = doc.querySelector('.or-summary-text').textContent;
    const sentences = summary.split(/(?<=[.?])\s+(?=\p{Lu})/u).filter(Boolean);
    assert.ok(sentences.length >= 4 && sentences.length <= 7, `${lang}: the summary in a few sentences (${sentences.length})`);
    // Words, not only colour: every tile with a period before says better, worse or unchanged in words.
    const tiles = [...doc.querySelectorAll('.or-stat')];
    assert.ok(tiles.some((t) => t.textContent.includes(cfg.words.better) || t.textContent.includes(cfg.words.worse)));
    assert.ok(tiles.some((t) => t.textContent.includes(cfg.words.missed)));
    assert.ok(tiles.some((t) => /[▲▼]/.test(t.textContent)));
    // Nothing of the example reaches the storage of the other tools.
    const keys = Object.keys(w.localStorage);
    assert.deepEqual(keys.filter((key) => key !== cfg.storageKey), [], `${lang}: no other key written`);
    // The hand-off is off for the example.
    const add = [...doc.querySelectorAll('.or-actions button')].find((b) => /focus|Fokus|fokusin/.test(b.textContent));
    assert.ok(add.disabled);
    assert.equal(doc.querySelector('.or-status').textContent, cfg.text.exampleActions);
  }
});

test('the text, the print and the Word file carry the title, the period, the site and every section', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  const buttons = [...doc.querySelectorAll('.or-actions button')];
  click(w, buttons.find((b) => b.textContent === 'Copy as text'));
  return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
    const text = w.copied;
    assert.match(text, /^Betriebsbericht · Hub Frankfurt\nZeitraum: 12\.10\.2026 – 18\.10\.2026 · Verglichen mit 05\.10\.2026 – 11\.10\.2026\n/);
    ['ZUSAMMENFASSUNG', 'ARBEITSSICHERHEIT', 'QUALITÄT', 'LIEFERUNG', 'ANLAGEN', 'ARBEITSPLATZ', 'HOTEL', 'VERBESSERUNG', 'MASSNAHMEN', 'FOKUS DER NÄCHSTEN WOCHE'].forEach((h) => assert.ok(text.includes(h), h));
    assert.match(text, /- Unfälle: 1 · ▲ schlechter \(vorher \d+\) · Ziel 0: nicht im Ziel/);
    assert.match(text, /\n1\. Gegenmaßnahme jedes Unfalls/);
    click(w, buttons.find((b) => b.textContent === 'Drucken oder als PDF speichern' || b.textContent === 'Print or save as PDF'));
    assert.equal(w.printed, true);
    click(w, buttons.find((b) => b.textContent === 'Download Word'));
    assert.equal(w.downloads.length, 1);
    const bytes = w.downloads[0].parts[0];
    assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK');
    const xml = Buffer.from(bytes).toString('utf8');
    assert.ok(xml.includes('Betriebsbericht · Hub Frankfurt'));
    assert.ok(xml.includes('<w:lang w:val="de-DE"/>'));
    assert.equal((xml.match(/w:val="Heading1"/g) || []).length, 10, 'the summary, eight sections and the focus');
    assert.equal((xml.match(/<w:tbl>/g) || []).length, 8, 'a small table per section');
    assert.ok(xml.includes('Vorzeitraum'));
  });
});

test('real data: only the sections with data in the period, the site from the profile, and the focus into the Action Tracker', () => {
  const day = (d) => `2026-10-${String(d).padStart(2, '0')}`;
  const storage = {
    'sc-workplace': { site: 'Hub Köln', areas: [{ name: 'Dock', owner: 'Anna' }], targets: { ontime: 95 } },
    'sc-delay-analyzer': { rows: Array.from({ length: 20 }, (_, i) => ({ date: day(12 + (i % 5)), planArr: '10:00', actArr: i < 4 ? '10:40' : '10:00' })) },
    'sc-actions': { rows: [{ id: 'a1', title: 'Fix door 4', owner: 'Jonas', status: 'open', created: day(1), due: day(9), priority: 'High' }] },
    'sc-safety-cross-de': { rows: [{ date: day(13), type: 'lost-time', area: 'Dock' }] },
  };
  const w = load({ storage });
  const doc = w.document;
  assert.ok(doc.querySelector('.dl-example-note').hidden, 'no example over real work');
  assert.deepEqual(sectionTitles(w), ['Summary', 'Delivery', 'Actions', "Next week's focus"], 'the German safety log stays on the German page');
  assert.match(doc.querySelector('.or-title').textContent, /Operations Report · Hub Köln/);
  assert.match(doc.querySelector('.or-summary-text').textContent, /at Hub Köln/);
  assert.match(doc.querySelector('.or-delivery .or-sentence').textContent, /On time: 80\.0%, with no period before.*That misses the target of 95\.0%\./);
  const sources = [...doc.querySelectorAll('.or-sources li')];
  assert.match(sources.find((li) => li.textContent.startsWith('Delay Analyzer')).textContent, /20 entries in the period/);
  assert.match(sources.find((li) => li.textContent.startsWith('Damage Control')).textContent, /nothing in the period/);
  assert.equal(sources.find((li) => li.textContent.startsWith('OEE')).querySelector('a').href, 'https://example.test/tools/oee/');
  const add = [...doc.querySelectorAll('.or-actions button')].find((b) => b.textContent === "Add next week's focus to the actions");
  assert.equal(add.disabled, false);
  click(w, add);
  const added = w.ActionsStore.list().filter((a) => a.source === 'ops-report');
  assert.equal(added.length, 2, 'the on-time target and the overdue action');
  assert.match(added[0].title, /on-time rate back to 95\.0%/);
  assert.equal(added[1].owner, 'Jonas', 'the owner of the only overdue action');
  assert.ok(added.every((a) => a.due === '2026-10-31' && a.check));
  assert.match(doc.querySelector('.or-status').textContent, /2 actions added to the Action Tracker/);
  click(w, [...doc.querySelectorAll('.or-actions button')].find((b) => b.textContent === "Add next week's focus to the actions"));
  assert.equal(w.ActionsStore.list().filter((a) => a.source === 'ops-report').length, 2, 'not added twice');
  assert.match(doc.querySelector('.or-status').textContent, /already in the Action Tracker/);

  // Another period: this month compares with the same days of September.
  const radio = doc.querySelector('input[name=period][value=thisMonth]');
  radio.checked = true;
  radio.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.match(doc.querySelector('[data-span]').textContent, /2026-10-01 – 2026-10-24, compared with 2026-09-01 – 2026-09-24/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-ops-report')).period, 'thisMonth');
  assert.ok(sectionTitles(w).includes("Next month's focus"));
});

test('with nothing saved after the example was cleared, the page offers the example again and shows no report', () => {
  const w = load({ lang: 'sq' });
  const doc = w.document;
  click(w, doc.querySelector('.dl-example-note button'));
  assert.equal(doc.querySelector('[data-results]').hidden, true);
  assert.equal(doc.querySelector('[data-empty]').hidden, false);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-ops-report-sq')).exampleOff, true);
  const again = load({ lang: 'sq', storage: { 'sc-ops-report-sq': { period: 'lastWeek', from: '', to: '', exampleOff: true } } });
  assert.equal(again.document.querySelector('[data-results]').hidden, true, 'a cleared example stays cleared');
  click(again, again.document.querySelector('[data-example]'));
  assert.equal(again.document.querySelector('[data-results]').hidden, false);
  assert.equal(sectionTitles(again).length, 10);
});

test('every text of the page and the script has German and Albanian', () => {
  const source = fs.readFileSync('src/js/ops-report.js', 'utf8');
  const part = read('src/_data/i18n-parts/ops-report.json');
  const texts = new Set([...source.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const m of source.matchAll(/tx\(\w[^?"]*\?\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) { texts.add(JSON.parse(`"${m[1]}"`)); texts.add(JSON.parse(`"${m[2]}"`)); }
  const njk = fs.readFileSync('src/_includes/partials/ops-report.njk', 'utf8');
  for (const m of njk.matchAll(/\{\{ "((?:[^"\\]|\\.)*)" \| t\(lang\) \}\}/g)) texts.add(m[1]);
  assert.ok(texts.has("Add next week's focus to the actions") && texts.has('{n} entries in the period'));
  for (const lang of ['de', 'sq']) {
    const ui = { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
    for (const text of texts) assert.ok(ui[text], `${lang}: ${text}`);
  }
  const cards = read('src/_data/i18n-parts/ops-report.cards.json');
  assert.equal(cards.family, 'zenith');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/ops-report/', '/de/tools/ops-report/', '/sq/tools/ops-report/']);
  assert.equal(cards.cards.en.time, '5 min');
  assert.equal(cards.cards.en.type, 'Report');
});
