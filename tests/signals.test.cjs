// Signals (src/js/signals.js): the control charts it draws through StatsKit (p with a volume per day, c, u, I-MR)
// against limits worked by hand, the rules on the latest point (beyond a limit, a run of 8, a trend of 6), the change on
// the timeline, the targets, every overdue rule, the safety rule, the ranking, the dismissal by date, the three data
// files, and the page: the example on a first visit, the visitor's own data first, links in the page's language, and
// an example that never writes another tool's key.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
// Arrays and objects made inside the page compare as plain data.
const same = (actual, expected, message) => assert.deepEqual(plain(actual), plain(expected), message);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/signals.json', de: 'src/_data/de/signals.json', sq: 'src/_data/sq/signals.json' };
const KEYS = { en: 'sc-signals', de: 'sc-signals-de', sq: 'sc-signals-sq' };
const TODAY = '2026-10-24';
const near = (actual, expected, tolerance = 1e-6, label = '') => assert.ok(Math.abs(actual - expected) <= tolerance, `${label} ${actual} ≠ ${expected}`);

// The data of the other tools the partial passes on, as the site's data cascade gives them.
const camel = (name) => name.replace(/\.json$/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const dataDir = (dir) => Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => [camel(f), read(`${dir}/${f}`)]));
const site = dataDir('src/_data');
site.de = dataDir('src/_data/de');
site.sq = dataDir('src/_data/sq');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/signals.njk', { ...site, cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');
const SCRIPTS = ['tool-kit', 'stats-kit', 'chart-kit', 'actions-store', 'oee', 'maintenance-planner', 'signals'];

const load = ({ lang = 'en', page = true, now = `${TODAY}T07:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/signals/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of SCRIPTS) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const math = () => load({ page: false }).SignalsMath;
const storageOf = (w) => Object.fromEntries(Object.keys(w.localStorage).map((key) => [key, w.localStorage.getItem(key)]));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const sources = (lang = 'en') => {
  const d = lang === 'en' ? site : site[lang];
  return { oeeReasons: d.oee.reasons, lostFound: { retention: d.lostFound.retention, categories: d.lostFound.categories }, gembaLayers: d.gembaWalk.layers, gembaCadences: d.gembaWalk.cadences, fiveSScopes: d.fiveSAudit.scopes };
};

test('p-chart with a volume per day: p̄ = Σd / Σn and limits p̄ ± 3√(p̄(1 − p̄)/nᵢ), worked by hand', () => {
  const M = math();
  // d = 4, 6, 3, 7, 5, 5, 4, 17 out of n = 400, 600, … : Σd = 51, Σn = 4,000, p̄ = 0.01275.
  // n = 400: σ = √(0.01275 × 0.98725 / 400) = 0.0056097, UCL = 0.01275 + 0.016829 = 0.029579, LCL = 0 (negative).
  // n = 600: σ = 0.0045803, UCL = 0.026491. The latest day, 17 / 600 = 0.028333, is beyond it: z = 3.4023.
  const n = [400, 600, 400, 600, 400, 600, 400, 600];
  const d = [4, 6, 3, 7, 5, 5, 4, 17];
  const rows = n.map((size, i) => ({ date: `2026-10-${String(i + 10).padStart(2, '0')}`, d: d[i], n: size }));
  const chart = M.chartOf('p', rows);
  near(chart.center, 0.01275, 1e-12, 'p̄');
  near(chart.points[0].ucl, 0.029579, 1e-6, 'UCL at 400');
  near(chart.points[1].ucl, 0.026491, 1e-6, 'UCL at 600');
  near(chart.points[0].sigma, 0.0056097, 1e-7, 'σ at 400');
  assert.equal(chart.points[0].lcl, 0, 'a negative lower limit is 0');
  near(chart.points[7].y, 17 / 600, 1e-12);
  near(chart.points[7].z, 3.4023, 1e-4, 'z of the latest day');
  // The same limits as StatsKit's np-chart divided by the day's volume.
  const np = load({ page: false }).StatsKit.controlChart('np', rows.map((r) => ({ count: r.d, size: r.n })));
  np.points.forEach((point, i) => near(chart.points[i].ucl, point.ucl / n[i], 1e-12, `np ${i}`));
  const rules = plain(M.rulesAt(chart, 'down'));
  same(rules, [{ rule: 'beyond', dir: 'up', points: 1, bad: true }]);
  assert.equal(M.statSeverity(rules), 'high');
});

test('c-chart: c̄ ± 3√c̄; I-MR: x̄ ± 3·MR̄/1.128, worked by hand', () => {
  const M = math();
  const days = (values, key) => values.map((value, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, [key]: value }));
  // 3, 5, 2, 4, 6, 3, 4, 13: c̄ = 40 / 8 = 5, UCL = 5 + 3√5 = 11.7082, LCL = max(0, 5 − 6.7082) = 0. 13 is beyond.
  const c = M.chartOf('c', days([3, 5, 2, 4, 6, 3, 4, 13], 'c'));
  assert.equal(c.center, 5);
  near(c.points[0].ucl, 11.7082, 1e-4, 'c UCL');
  assert.equal(c.points[0].lcl, 0);
  same((M.rulesAt(c, 'down')).map((r) => r.rule), ['beyond']);
  // 10, 12, 11, 13, 12, 14, 13, 15: x̄ = 12.5; moving ranges 2, 1, 2, 1, 2, 1, 2, MR̄ = 11/7 = 1.5714;
  // σ = 1.5714 / 1.128 = 1.3931; UCL = 16.6793, LCL = 8.3207. No rule holds on the latest point.
  const imr = M.chartOf('imr', days([10, 12, 11, 13, 12, 14, 13, 15], 'value'));
  near(imr.center, 12.5, 1e-12);
  near(imr.mrBar, 11 / 7, 1e-12);
  near(imr.points[0].ucl, 16.6793, 1e-4, 'I UCL');
  near(imr.points[0].lcl, 8.3207, 1e-4, 'I LCL');
  same((M.rulesAt(imr, 'up')), []);
  // u-chart: ū = Σc / Σn, limits ū ± 3√(ū / nᵢ). 2 + 1 + … = 16 complaints over 1,600 rooms: ū = 0.01; at 200 rooms
  // σ = √(0.01 / 200) = 0.0070711, UCL = 0.031213.
  const u = M.chartOf('u', [2, 1, 3, 2, 1, 2, 3, 2].map((count, i) => ({ date: `2026-10-0${i + 1}`, c: count, n: 200 })));
  near(u.center, 0.01, 1e-12);
  near(u.points[0].ucl, 0.031213, 1e-6, 'u UCL');
});

test('the run of 8 and the trend of 6 end on the latest point; a signal on the good side is low', () => {
  const M = math();
  const days = (values) => values.map((value, i) => ({ date: `2026-09-${String(i + 1).padStart(2, '0')}`, value }));
  // Mean 12; the last 8 points (13 and 14) are above it; σ = (17/15)/1.128 = 1.0047, UCL 15.01: no point beyond.
  const run = M.chartOf('imr', days([10, 11, 10, 11, 10, 11, 10, 11, 14, 13, 14, 13, 14, 13, 14, 13]));
  assert.equal(run.center, 12);
  const runRules = plain(M.rulesAt(run, 'down'));
  same(runRules, [{ rule: 'run', dir: 'up', points: 8, bad: true }]);
  assert.equal(M.statSeverity(runRules), 'medium');
  // Seven above is not a run yet.
  same((M.rulesAt(M.chartOf('imr', days([10, 11, 10, 11, 10, 11, 10, 11, 10, 14, 13, 14, 13, 14, 13, 14])), 'down')).filter((r) => r.rule === 'run'), []);
  // 20, 21, 22, 23, 24, 25 at the end: six points in a row, each higher (Nelson rule 3). x̄ = 298 / 14 = 21.29, UCL 25.58.
  const trend = M.chartOf('imr', days([20, 22, 19, 21, 20, 22, 19, 21, 20, 21, 22, 23, 24, 25]));
  const trendRules = plain(M.rulesAt(trend, 'down'));
  same(trendRules, [{ rule: 'trend', dir: 'up', points: 6, bad: true }]);
  // The same trend of a value where up is good is a low signal.
  const good = plain(M.rulesAt(trend, 'up'));
  assert.equal(good[0].bad, false);
  assert.equal(M.statSeverity(good), 'low');
  assert.equal(M.runLength([1, -1, 2, 2, 3]).n, 3);
});

test('fewer than 8 points: no statistical signal, listed with the reason; a change on the timeline restarts the limits', () => {
  const M = math();
  const short = { tool: 'oee', key: 'oee:sorter', subject: 'Sorter', kind: 'imr', better: 'up', unit: 'pct', target: null, points: [0.8, 0.82, 0.5].map((value, i) => ({ date: `2026-10-0${i + 1}`, value })) };
  const out = M.analyse(short, []);
  same(out.signals, []);
  same((out.tooFew), { tool: 'oee', key: 'oee:sorter', subject: 'Sorter', n: 3, kind: 'imr' });
  // 10 points at 0.4 % before a change and 9 at 0.2 % after: with the change, the limits come from the 9 points after it.
  const points = Array.from({ length: 19 }, (_, i) => ({ date: M.addDays('2026-10-01', i), d: i < 10 ? 4 + (i % 2) : 2 + (i % 2), n: 1000 }));
  const events = M.annotations({ rows: [{ date: '2026-10-11', text: 'New stacking rule', tools: ['damage-control'] }, { date: '2026-10-05', text: 'Other tool', tools: ['oee'] }] });
  const phase = M.phaseOf(points, events, 'damage-control');
  assert.equal(phase.change.text, 'New stacking rule');
  assert.equal(phase.since, 9);
  assert.equal(phase.enough, true);
  assert.equal(phase.used[0].date, '2026-10-11');
  // Without the change the last 9 days are a run of 9 below the centre (a good-side signal); with it, nothing.
  const series = { tool: 'damage-control', key: 'damage-control:rate', kind: 'p', better: 'down', unit: 'share', target: null, points };
  same((M.analyse(series, []).signals.map((s) => [s.severity, s.rules.map((r) => r.rule)])), [['low', ['run']]]);
  same(M.analyse(series, events).signals, []);
  // A change with fewer than 8 points after it: the limits use all points, and the result says so.
  const late = M.phaseOf(points, M.annotations({ rows: [{ date: '2026-10-15', text: 'x', tools: [] }] }), 'damage-control');
  assert.equal(late.enough, false);
  assert.equal(late.since, 5);
  assert.equal(late.used.length, 19);
});

test('targets: the latest day against the target typed in the tool, else the workplace profile', () => {
  const M = math();
  const period = { from: '2026-10-01', to: TODAY };
  const log = { target: '0,3', rows: [{ date: '2026-10-20', units: 4 }], volumes: [{ date: '2026-10-20', volume: 1000 }] };
  const typed = M.defectSeries('damage-control', log, period, { damage: 0.5 });
  assert.equal(typed.kind, 'p');
  assert.equal(typed.target, 0.003);
  assert.equal(typed.source, 'tool');
  const profile = M.defectSeries('damage-control', { ...log, target: '' }, period, { damage: 0.5 });
  assert.equal(profile.target, 0.005);
  assert.equal(profile.source, 'workplace');
  // 4 of 1,000 is 0.4 %: worse than 0.3 %, better than 0.5 %. One day is too few for a chart, but enough for a target.
  const missed = M.analyse(typed, []);
  same((missed.signals.map((s) => [s.kind, s.severity, s.vars.value, s.vars.target])), [['target', 'medium', 0.004, 0.003]]);
  same(M.analyse(profile, []).signals, []);
  assert.equal(M.missesTarget(0.79, 0.85, 'up'), true);
  assert.equal(M.missesTarget(0.85, 0.85, 'up'), false);
  // Without a volume a log is a count: a c-chart, and no target (the target is a rate).
  const counted = M.defectSeries('damage-control', { target: '0.3', rows: [{ date: '2026-10-20', units: 2 }, { date: '2026-10-22', units: 1 }] }, period);
  assert.equal(counted.kind, 'c');
  same((counted.points), [{ date: '2026-10-20', c: 2 }, { date: '2026-10-21', c: 0 }, { date: '2026-10-22', c: 1 }]);
  assert.equal(counted.target, null);
  // On-time routes: the on-time target is a ceiling of 1 − target for the late share.
  const delay = M.delaySeries({ target: '90', arrivalGrace: '15', rows: [
    { date: '2026-10-20', planArr: '08:00', actArr: '08:10' }, { date: '2026-10-20', planArr: '09:00', actArr: '09:30' }, { date: '2026-10-20', planArr: '23:50', actArr: '00:20' },
  ] }, period, {});
  near(delay[0].target, 0.1, 1e-12);
  same((delay[0].points), [{ date: '2026-10-20', d: 2, n: 3 }]);
  same((delay[1].points), [{ date: '2026-10-20', value: 30, late: 2 }], 'a route across midnight is 30 minutes late');
});

test('overdue: actions, maintenance, lost and found, red tags, ideas, re-cleans and layer walks', () => {
  const M = math();
  const ago = (n) => M.addDays(TODAY, -n);
  const actions = M.actionSignals({ rows: [
    { id: 'a', title: 'High one', due: ago(1), priority: 'High', status: 'open' },
    { id: 'b', title: 'Old one', due: ago(15), priority: 'Low', status: 'doing' },
    { id: 'c', title: 'Recent one', due: ago(3), priority: 'Medium', status: 'open' },
    { id: 'd', title: 'Due today', due: TODAY, priority: 'High', status: 'open' },
    { id: 'e', title: 'Done', due: ago(9), priority: 'High', status: 'done' },
  ] }, TODAY);
  same(actions.map((s) => [s.vars.title, s.severity, s.vars.days]), [['High one', 'high', 1], ['Old one', 'high', 15], ['Recent one', 'medium', 3]]);

  // Maintenance through the planner's own nextDue: last done 1 Sept, monthly, so due 1 Oct: overdue 23 days.
  const planner = M.maintenanceSignals({ assets: [
    { id: 'a1', tag: 'FL-1', name: 'Forklift', crit: 'A', tasks: [{ id: 't1', text: 'Check', every: 1, unit: 'months', last: '2026-09-01' }] },
    { id: 'a2', tag: 'DK', name: 'Dock', crit: 'C', tasks: [{ id: 't2', text: 'Grease', every: 1, unit: 'months', last: '2026-09-10' }, { id: 't3', text: 'Not yet', every: 2, unit: 'months', last: '2026-09-10' }] },
    { id: 'a3', tag: 'B1', name: 'Belt', crit: 'B', tasks: [{ id: 't4', text: 'Done again', every: 1, unit: 'months', last: '2026-09-01' }] },
  ], rows: [{ id: 'r', kind: 'done', asset: 'a3', task: 't4', date: '2026-10-05' }] }, TODAY);
  same(planner.map((s) => [s.vars.task, s.severity, s.date, s.vars.days]), [['Check', 'high', '2026-10-01', 23], ['Grease', 'low', '2026-10-10', 14]]);

  // Lost & Found: low value kept 90 days, documents 7; typed days win; a returned item is closed.
  const rules = { retention: { low: 90, medium: 90, high: 180, docs: 7 }, categories: [{ key: 'documents', value: 'high', days: true }, { key: 'other', value: 'low' }] };
  const lost = M.lostFoundSignals({ rows: [
    { id: 'L1', date: ago(10), category: 'documents', what: 'Passport', steps: [] },
    { id: 'L2', date: ago(91), category: 'other', value: 'low', what: 'Scarf', steps: [{ status: 'contacted', date: ago(5) }] },
    { id: 'L3', date: ago(90), category: 'other', value: 'low', what: 'Cap', steps: [] },
    { id: 'L4', date: ago(200), category: 'other', what: 'Umbrella', steps: [{ status: 'returned', date: ago(150) }] },
  ] }, TODAY, rules);
  same(lost.map((s) => [s.vars.item, s.vars.days]), [['L1', 3], ['L2', 1]]);
  assert.equal(M.lostFoundSignals({ retDocs: '14', rows: [{ id: 'L1', date: ago(10), category: 'documents', steps: [] }] }, TODAY, rules).length, 0);

  // Red tags: open more than 30 days, or past the date to decide; done tags never.
  const tags = M.redTagSignals({ tags: [
    { id: 't1', date: ago(31), item: 'Old', done: false }, { id: 't2', date: ago(30), item: 'Thirty', done: false },
    { id: 't3', date: ago(5), item: 'Past due', due: ago(1), done: false }, { id: 't4', date: ago(60), item: 'Done', done: true },
  ] }, TODAY);
  same(tags.map((s) => s.vars.item), ['Old', 'Past due']);

  // Kaizen: more than the week the board allows, counted from the day the idea moved to its column.
  const ideas = M.kaizenSignals({ rows: [
    { id: 'k1', title: 'Eight days', status: 'idea', date: ago(8) }, { id: 'k2', title: 'Seven days', status: 'idea', date: ago(7) },
    { id: 'k3', title: 'Moved back', status: 'idea', date: ago(30), moved: ago(2) }, { id: 'k4', title: 'Planned', status: 'plan', date: ago(40) },
  ] }, TODAY);
  same(ideas.map((s) => [s.vars.title, s.vars.days]), [['Eight days', 8]]);

  // Re-cleans: the room's latest inspection of the last 7 days sent items back (a failed item not flagged for
  // maintenance) and nobody has inspected it since.
  const rooms = M.recleanSignals({ rows: [
    { date: ago(1), time: '10:00', room: '101', answers: { 'bath-0': 'fail', 'bed-1': 'pass' }, flags: {} },
    { date: ago(1), time: '10:00', room: '102', answers: { 'bath-0': 'fail' }, flags: {} },
    { date: ago(1), time: '11:30', room: '102', answers: { 'bath-0': 'pass' }, flags: {} },
    { date: TODAY, time: '09:00', room: '103', answers: { 'bath-0': 'fail' }, flags: {} },
    { date: ago(1), time: '10:00', room: '104', answers: { 'bath-0': 'fail' }, flags: { 'bath-0': 'maintenance' } },
    { date: ago(9), time: '10:00', room: '105', answers: { 'bath-0': 'fail' }, flags: {} },
  ] }, TODAY);
  same(rooms.map((s) => [s.vars.room, s.severity, s.vars.items]), [['101', 'medium', 1], ['103', 'low', 1]]);

  // Layer walks: a weekly layer last walked 8 days ago was due yesterday; a daily one walked yesterday is due today.
  const layers = [{ key: 'team-lead', cadence: 'daily' }, { key: 'area-manager', cadence: 'weekly' }, { key: 'site-lead', cadence: 'monthly' }];
  const walks = M.gembaSignals({ cadence: {}, rows: [
    { type: 'lpa', layer: 'team-lead', date: ago(1), area: 'A', answers: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'no'] },
    { type: 'lpa', layer: 'area-manager', date: ago(8), area: 'A', answers: ['yes', 'no'] },
  ] }, TODAY, layers);
  same(walks.map((s) => [s.id, s.severity]), [['overdue|layer|area-manager', 'medium'], ['target|gemba-walk:area-manager', 'medium']]);
  assert.equal(walks[1].vars.value, 0.5, 'LPA compliance of its latest week, 1 yes of 2');
});

test('safety: every accident and first aid of the last 7 days, always on top', () => {
  const M = math();
  const ago = (n) => M.addDays(TODAY, -n);
  const safety = M.safetySignals({ rows: [
    { date: ago(6), type: 'first-aid', area: 'Dock', what: 'Cut' }, { date: ago(7), type: 'lost-time', what: 'Too old' },
    { date: ago(1), type: 'near-miss', what: 'Not an injury' }, { date: TODAY, type: 'no-lost-time', what: 'Today' },
  ] }, TODAY);
  same(safety.map((s) => [s.vars.what, s.severity]), [['Cut', 'high'], ['Today', 'high']]);
  // Ranking: safety first even before a stronger high signal; then high, medium, low; then statistical, target,
  // overdue; then the stronger; then the newest.
  const s = (id, kind, severity, score = 0, date = TODAY) => ({ id, kind, severity, score, date });
  const ranked = M.rank([
    s('overdue-low', 'overdue', 'low', 99), s('target', 'target', 'medium', 0.1), s('stat-medium', 'stat', 'medium', 0.8),
    s('overdue-high', 'overdue', 'high', 40), s('stat-high', 'stat', 'high', 13), s('safety', 'safety', 'high', 2.1),
    s('overdue-medium-old', 'overdue', 'medium', 9), s('overdue-medium-new', 'overdue', 'medium', 3), s('stat-high-strong', 'stat', 'high', 14.5),
    s('same-older', 'overdue', 'medium', 3, '2026-10-01'),
  ]);
  same(ranked.map((x) => x.id), ['safety', 'stat-high-strong', 'stat-high', 'overdue-high', 'stat-medium', 'target', 'overdue-medium-old', 'overdue-medium-new', 'same-older', 'overdue-low']);
});

test('dismissal holds for the day it was made; filters by minimum severity and by tool', () => {
  const M = math();
  const list = [{ id: 'a', severity: 'high', tool: 'oee' }, { id: 'b', severity: 'medium', tool: 'oee' }, { id: 'c', severity: 'low', tool: 'lost-found' }];
  same(M.visible(list, { today: TODAY }).map((x) => x.id), ['a', 'b', 'c']);
  same(M.visible(list, { today: TODAY, dismissed: { a: TODAY } }).map((x) => x.id), ['b', 'c']);
  same(M.visible(list, { today: TODAY, dismissed: { a: '2026-10-23' } }).map((x) => x.id), ['a', 'b', 'c'], 'yesterday\'s dismissal is gone');
  same(M.visible(list, { today: TODAY, minSeverity: 'medium' }).map((x) => x.id), ['a', 'b']);
  same(M.visible(list, { today: TODAY, minSeverity: 'high' }).map((x) => x.id), ['a']);
  same(M.visible(list, { today: TODAY, tool: 'lost-found' }).map((x) => x.id), ['c']);
  same((M.pruneDismissed({ a: TODAY, b: '2026-10-23', c: 'x' }, TODAY)), { a: TODAY });
});

test('the example: the same numbers in every language, and a signal of each kind', () => {
  const en = read(DATA.en);
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  const numbers = (value) => JSON.stringify(value, (key, v) => (typeof v === 'string' && !/^(?:[a-z-]+|\d+(?:\.\d+)?|[yn-]+)$/.test(v) ? '' : v));
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, KEYS[lang]);
    same(shape(other), shape(en), `${lang} shape`);
    assert.equal(numbers(other.example), numbers(en.example), `${lang}: the example's numbers and keys`);
    same(other.tools.map((t) => t.slug), en.tools.map((t) => t.slug));
    // Every template keeps its placeholders.
    const holes = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
    const walk = (a, b, path) => (typeof a === 'string' ? assert.equal(holes(b), holes(a), `${lang} ${path}`) : a && typeof a === 'object' && Object.keys(a).forEach((k) => walk(a[k], b[k], `${path}.${k}`)));
    walk({ text: en.text, series: en.series }, { text: other.text, series: other.series }, '');
  }
  assert.equal(en.storageKey, KEYS.en);
  const M = math();
  const states = M.exampleStates(en.example, TODAY, '');
  const out = M.collect((key) => states[key] ?? null, { today: TODAY, period: 90, sources: sources('en') });
  same(out.signals.map((s) => `${s.severity} ${s.kind} ${s.id}`), [
    'high safety safety|2026-10-22|first-aid|loading|cut on the hand at the stretch wrapper',
    'high stat stat|damage-control:rate',
    'high overdue overdue|maintenance|ex-a0|ex-a0-t0',
    'high overdue overdue|action|ex-act0',
    'medium stat stat|oee:sorter 1',
    'medium stat stat|delay-analyzer:minutes',
    'medium target target|incomplete-control:rate',
    'medium target target|oee:stretch wrapper',
    'medium target target|gemba-walk:team-lead',
    'medium overdue overdue|tag|ex-t0',
    'medium overdue overdue|idea|ex-k0',
    'medium overdue overdue|action|ex-act1',
    'medium overdue overdue|layer|area-manager',
    'low overdue overdue|maintenance|ex-a2|ex-a2-t0',
  ]);
  const byId = Object.fromEntries(out.signals.map((s) => [s.id, s]));
  // Damage: 314 units over 90,950 handled; the latest day 26 of 3,100 = 0.84 % is above its own UCL, and the target
  // of 0.3 % is said in the same signal, not twice.
  const damage = byId['stat|damage-control:rate'];
  assert.equal(damage.vars.d, 26);
  assert.equal(damage.vars.n, 3100);
  near(damage.vars.center, en.example.damage.units.reduce((a, b) => a + b, 0) / en.example.damage.volumes.reduce((a, b) => a + b, 0), 1e-12);
  assert.ok(damage.vars.value > damage.vars.ucl);
  assert.equal(damage.vars.target, 0.003);
  // OEE is good pieces / 4,500 (450 planned minutes at 600 pieces an hour): Sorter 1's latest day 3,570 is 79.3 %.
  near(byId['stat|oee:sorter 1'].vars.value, 3570 / 4500, 1e-12);
  // Incomplete orders: the change on the timeline 16 days ago gives limits from the 16 points since.
  const incomplete = out.charts.find((c) => c.key === 'incomplete-control:rate');
  assert.equal(incomplete.enough, true);
  assert.equal(incomplete.n, 16);
  near(byId['target|incomplete-control:rate'].vars.value, 7 / 1050, 1e-12);
  // The 5S audits of Packing are too few for a chart.
  same(out.tooFew.map((x) => [x.key, x.n]), [['five-s-audit:packing', 4]]);
  // 4 of 5 of the area manager's answers… the team lead's latest week: 41 yes of 49 answered.
  assert.equal(byId['target|gemba-walk:team-lead'].vars.d, 41);
  assert.equal(byId['target|gemba-walk:team-lead'].vars.n, 49);
});

test('the page opens on the example on a first visit and never writes another tool\'s key', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.ok(results.querySelector('.dl-example-note'), 'the note says it is an example');
  assert.equal(results.querySelectorAll('.sg-item').length, 14);
  assert.ok(results.querySelector('.ck-figure svg'), 'a chart of the first statistical signal');
  // Links keep the page's language; 5 Whys gets the problem.
  const first = results.querySelector('.sg-item');
  assert.equal(new w.URL(first.querySelector('.sg-item-head a').href).pathname, '/de/tools/safety-cross/');
  const whys = new w.URL([...first.querySelectorAll('a')].find((a) => a.href.includes('five-whys')).href);
  assert.equal(whys.pathname, '/de/tools/five-whys/');
  assert.match(whys.searchParams.get('problem'), /Erste Hilfe/);
  // Dismissing, the period and the severity are the visitor's choices, saved under Signals' own key only.
  click(w, first.querySelector('[data-dismiss]'));
  assert.equal(results.querySelectorAll('.sg-item').length, 13);
  const severity = doc.querySelector('[name=severity]');
  severity.value = 'high';
  severity.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(results.querySelectorAll('.sg-item').length, 3);
  same(Object.keys(storageOf(w)), ['sc-signals-de']);
  // The example's dismissal is not stored with the visitor's.
  same((JSON.parse(w.localStorage.getItem('sc-signals-de')).dismissed), {});
  // Clearing the example shows the visitor's (empty) data.
  click(w, results.querySelector('[data-clear-example]'));
  assert.equal(results.hidden, true);
  assert.equal(doc.querySelector('[data-empty]').hidden, false);
  same(Object.keys(storageOf(w)), ['sc-signals-de']);
});

test('with data in the browser the page reads it, not the example; the example leaves that data untouched', () => {
  const ago = (n) => new Date(Date.parse(`${TODAY}T00:00:00Z`) - n * 864e5).toISOString().slice(0, 10);
  const storage = {
    'sc-actions': { rows: [{ id: 'x1', title: 'Fix the gate', owner: 'Ana', due: ago(2), priority: 'Medium', status: 'open', created: ago(9) }] },
    'sc-damage-control': { rows: [{ date: ago(3), units: 2 }], volumes: [], target: '' },
  };
  const w = load({ lang: 'en', storage });
  const before = storageOf(w);
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.querySelector('.dl-example-note'), null);
  const items = [...results.querySelectorAll('.sg-item')];
  assert.equal(items.length, 1);
  assert.match(items[0].querySelector('.sg-text').textContent, /Action overdue by 2 days: Fix the gate/);
  // An overdue action is already in the tracker: no second hand-off to it.
  assert.equal([...items[0].querySelectorAll('a')].some((a) => a.textContent === 'Add to actions'), false);
  assert.match(results.textContent, /Damage Control · latest entry/);
  click(w, w.document.querySelector('[data-example]'));
  assert.ok(results.querySelector('.dl-example-note'));
  assert.equal(results.querySelectorAll('.sg-item').length, 14);
  // An "Add to actions" link of the example goes to the tracker in the page's language, with source "signals".
  const add = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Add to actions');
  click(w, add);
  const url = new w.URL(add.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'signals');
  const after = storageOf(w);
  for (const key of Object.keys(before)) assert.equal(after[key], before[key], `${key} untouched`);
  same(Object.keys(after).sort(), [...Object.keys(before), 'sc-signals'].sort());
});
