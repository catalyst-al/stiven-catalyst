// The Maintenance Planner (src/js/maintenance-planner.js): the arithmetic in window.MaintenancePlannerMath (intervals in
// days to years, operating hours from meter readings, the next due date and its postponement, the history of a task and
// the PM compliance, MTBF and MTTR, the Pareto of the downtime, the calendar file), the seeded example of a parcel hub,
// the three data files, and the page itself: the example on a first visit, an asset added from its type, a task logged
// as done, postponed and broken down, the hand-offs to the Action Tracker, Pareto, 5 Whys and OEE, and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/maintenancePlanner.json', de: 'src/_data/de/maintenancePlanner.json', sq: 'src/_data/sq/maintenancePlanner.json' };
const TODAY = '2026-10-24';

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/maintenance-planner.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/maintenance-planner/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'maintenance-planner']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-maintenance-planner') => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const pickKind = (w, value) => { const input = w.document.querySelector(`input[name="mp-kind"][value="${value}"]`); input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const math = () => load({ page: false }).MaintenancePlannerMath;

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
// The numbers and keys of a value, with every text left out.
const numbers = (value) => (Array.isArray(value) ? value.map(numbers) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, numbers(value[key])])) : typeof value === 'string' ? 'text' : value);

test('the three data files share one shape, the same numbers and keys, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-maintenance-planner');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-maintenance-planner-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(other.types.map((t) => [t.key, t.sites, t.tasks.map(({ every, unit, hours, who, minutes, statutory, optional }) => [every, unit, hours, who, minutes, statutory, optional])]),
      en.types.map((t) => [t.key, t.sites, t.tasks.map(({ every, unit, hours, who, minutes, statutory, optional }) => [every, unit, hours, who, minutes, statutory, optional])]), `${lang} tasks`);
    assert.deepEqual(other.sites.map((s) => s.key), en.sites.map((s) => s.key));
    assert.deepEqual(other.causes.map((c) => c.key), en.causes.map((c) => c.key));
    assert.deepEqual(other.criticality.map((c) => c.key), ['A', 'B', 'C']);
    const strip = ({ assets, areas, people, notes, reasons, ...rest }) => ({ ...rest, assets: assets.map(({ name, supplier, ...a }) => a), areas: areas.length, people: people.length, notes: notes.length, reasons: reasons.length });
    assert.deepEqual(strip(other.example), strip(en.example), `${lang}: the example's numbers are the same`);
    assert.deepEqual(numbers(other.advice), numbers(en.advice));
    assert.equal(other.tips.length, en.tips.length);
    for (const [key, value] of Object.entries(other.text)) assert.ok(value.trim(), `${lang} text.${key}`);
  }
  const keys = en.types.map((t) => t.key);
  assert.ok(['forklift', 'sorter', 'conveyor', 'dock-door', 'dock-leveller', 'fire-extinguisher', 'emergency-light', 'lift', 'hvac', 'kitchen', 'minibar', 'other'].every((key) => keys.includes(key)));
  for (const site of en.sites) assert.ok(en.types.filter((t) => t.sites.includes(site.key)).length >= 5, `${site.key} has types`);
  assert.ok(en.types.flatMap((t) => t.tasks).filter((t) => t.statutory).length >= 10, 'statutory checks are marked');
  assert.match(en.text.statutory, /check your local rules/i);
});

test('intervals: days, weeks, months and years, the end of a month, and the tolerance of on time', () => {
  const M = math();
  assert.equal(M.addInterval('2026-01-31', 1, 'months'), '2026-02-28');
  assert.equal(M.addInterval('2024-02-29', 1, 'years'), '2025-02-28');
  assert.equal(M.addInterval('2026-10-24', 3, 'months'), '2027-01-24');
  assert.equal(M.addInterval('2026-10-24', -1, 'months'), '2026-09-24');
  assert.equal(M.addInterval('2026-10-24', 2, 'weeks'), '2026-11-07');
  assert.equal(M.addInterval('2026-10-24', 10, 'days'), '2026-11-03');
  assert.equal(M.addInterval('2026-10-24', 1, 'hours'), '');
  assert.equal(M.graceDays({ every: 1, unit: 'weeks' }), 0);
  assert.equal(M.graceDays({ every: 1, unit: 'months' }), 3);
  assert.equal(M.graceDays({ every: 1, unit: 'years' }), 7);
  assert.equal(M.graceDays({ every: 500, unit: 'hours' }, 10), 5);
  assert.equal(M.statusOf('2026-10-23', TODAY), 'overdue');
  assert.equal(M.statusOf('2026-10-25', TODAY), 'week', 'until Sunday');
  assert.equal(M.statusOf('2026-10-26', TODAY), 'later');
  assert.equal(M.statusOf('', TODAY), 'none');
});

test('operating hours: the hours on a day, the day of a number of hours, and the next due date by whichever comes first', () => {
  const M = math();
  const readings = [{ kind: 'reading', date: '2026-10-01', hours: 1000 }, { kind: 'reading', date: '2026-10-11', hours: 1100 }];
  const points = M.meterPoints(readings);
  assert.equal(M.rateOf(points), 10);
  assert.equal(M.hoursAt(points, '2026-10-06'), 1050);
  assert.equal(M.hoursAt(points, '2026-10-21'), 1200, 'carried on at the rate');
  assert.equal(M.hoursAt(points, '2026-09-21'), 900);
  assert.equal(M.dateAtHours(points, 1055), '2026-10-07');
  assert.equal(M.dateAtHours(points, 1300), '2026-10-31');
  // Every 3 months or 250 hours: done on 1 October at 1000 h, so due at 1250 h, which the meter reaches on 26 October.
  const task = { id: 't1', every: 3, unit: 'months', hours: 250 };
  const events = [...readings, { kind: 'done', task: 't1', date: '2026-10-01' }];
  const info = plain(M.nextDue(task, events));
  assert.equal(info.due, '2026-10-26');
  assert.equal(info.by, 'hours');
  assert.equal(info.hoursDue, 1250);
  assert.equal(info.calendar, '2027-01-01');
  // Hours only, without readings: the date cannot be known yet.
  assert.equal(M.nextDue({ id: 't2', every: 500, unit: 'hours' }, []).by, 'meter');
  assert.equal(M.nextDue({ id: 't2', every: 500, unit: 'hours' }, []).due, '');
});

test('the next due date: after the last time done, else the last date before the plan, else the start; a postponement moves it', () => {
  const M = math();
  const task = { id: 't', every: 1, unit: 'months', last: '2026-08-10' };
  assert.equal(M.nextDue(task, []).due, '2026-09-10');
  assert.equal(M.nextDue({ id: 't', every: 1, unit: 'years', start: TODAY }, []).due, TODAY);
  const events = [{ kind: 'done', task: 't', date: '2026-09-12' }, { kind: 'postponed', task: 't', date: '2026-10-10', until: '2026-10-20', reason: 'No parts' }];
  const info = plain(M.nextDue(task, events));
  assert.equal(info.original, '2026-10-12');
  assert.equal(info.due, '2026-10-20');
  assert.equal(info.postponed.reason, 'No parts');
  // Done after the postponement: the plan goes on from the done date.
  const after = plain(M.nextDue(task, [...events, { kind: 'done', task: 't', date: '2026-10-19' }]));
  assert.equal(after.due, '2026-11-19');
  assert.equal(after.postponed, null);
  // The history judges each time against the original date: the postponed one was late.
  const h = plain(M.history(task, [...events, { kind: 'done', task: 't', date: '2026-10-19' }]));
  assert.deepEqual(h.done.map((o) => [o.due, o.done, o.onTime, o.late]), [['2026-09-10', '2026-09-12', true, 2], ['2026-10-12', '2026-10-19', false, 7]]);
  assert.equal(h.grace, 3);
  const c = plain(M.compliance([h], '2026-09-01', TODAY, TODAY));
  assert.deepEqual(c, { scheduled: 2, onTime: 1, rate: 0.5 });
  // An open task past its tolerance counts as due and not done.
  const late = M.history({ id: 'x', every: 1, unit: 'weeks', last: '2026-10-10' }, []);
  assert.deepEqual(plain(M.compliance([late], '2026-10-01', TODAY, TODAY)), { scheduled: 1, onTime: 0, rate: 0 });
});

test('the calendar projection, MTBF and MTTR, the Pareto of the downtime and the calendar file', () => {
  const M = math();
  assert.deepEqual(plain(M.project({ every: 1, unit: 'weeks' }, { due: '2026-10-05', rate: null }, '2026-10-31')), ['2026-10-05', '2026-10-12', '2026-10-19', '2026-10-26']);
  const breakdowns = [
    { asset: 'a', date: '2026-09-01', minutes: 60, cost: 100, cause: 'sensor' },
    { asset: 'a', date: '2026-10-01', minutes: 120, cost: 0, cause: 'sensor' },
    { asset: 'a', date: '2026-10-10', minutes: 30, cost: 50, cause: 'jam' },
    { asset: 'b', date: '2026-10-02', minutes: 300, cost: 900, cause: 'damage' },
  ];
  const points = { a: [{ date: '2026-07-26', hours: 1000 }, { date: TODAY, hours: 1900 }] };
  const rel = plain(M.reliability(breakdowns, '2026-07-26', TODAY, (id) => points[id] || []));
  assert.equal(rel[0].asset, 'b', 'the most downtime first');
  assert.equal(rel[0].enough, false, 'one breakdown is not enough');
  assert.equal(rel[0].mttr, null);
  const a = rel[1];
  assert.deepEqual([a.n, a.minutes, a.cost, a.topCause, a.mttr], [3, 210, 150, 'sensor', 70]);
  assert.equal(a.mtbfHours, 300, '900 operating hours, three breakdowns');
  assert.ok(Math.abs(a.mtbfDays - (91 - 210 / 1440) / 3) < 1e-9);
  const p = plain(M.pareto([{ k: 'x', value: 50 }, { k: 'y', value: 300 }, { k: 'z', value: 150 }]));
  assert.deepEqual(p.map((i) => [i.k, i.share, i.cum, i.vital]), [['y', 0.6, 0.6, true], ['z', 0.3, 0.9, true], ['x', 0.1, 1, false]]);
  const text = M.ics([{ uid: 't1-2026-10-30', date: '2026-10-30', summary: 'FL-01 · Service, quarterly', description: 'Line one\nLine two; with a semicolon' }], new Date('2026-10-24T08:00:00Z'));
  assert.match(text, /^BEGIN:VCALENDAR\r\nVERSION:2.0\r\n/);
  assert.match(text, /DTSTART;VALUE=DATE:20261030\r\nDTEND;VALUE=DATE:20261031\r\n/);
  assert.match(text, /SUMMARY:FL-01 · Service\\, quarterly\r\n/);
  assert.match(text, /DESCRIPTION:Line one\\nLine two\\; with a semicolon\r\n/);
  assert.match(text, /DTSTAMP:20261024T080000Z/);
  assert.match(text, /END:VCALENDAR\r\n$/);
  assert.ok(text.split('\r\n').every((line) => line.length <= 75), 'long lines are folded');
});

test('the example: a parcel hub with 14 assets, three months of history, some overdue tasks and the sorter breaking down', () => {
  const M = math();
  const cfg = read(DATA.en);
  const ex = plain(M.exampleData(cfg.example, cfg.types, TODAY));
  assert.equal(ex.assets.length, 14);
  const count = (typeKey) => ex.assets.filter((a) => a.type === typeKey).length;
  assert.deepEqual([count('forklift'), count('sorter'), count('conveyor'), count('dock-door'), count('fire-extinguisher')], [4, 1, 2, 6, 1]);
  assert.deepEqual(plain(M.exampleData(cfg.example, cfg.types, TODAY)), ex, 'the same example every time');
  assert.ok(ex.rows.every((r) => r.date >= (r.kind === 'reading' ? '2026-07-06' : '2026-07-25') && r.date <= TODAY), 'three months, ending today (the meter from two weeks before)');
  assert.ok(ex.rows.some((r) => r.date === TODAY));
  assert.equal(ex.rows.filter((r) => r.kind === 'breakdown').length, 12);
  assert.ok(ex.rows.some((r) => r.kind === 'postponed'));
  assert.ok(ex.rows.filter((r) => r.kind === 'reading').length >= 50, 'weekly meter readings of the forklifts');
  assert.ok(ex.assets.flatMap((a) => a.tasks).every((t) => !/pre-use/.test(t.text)), 'the optional daily check is not in the plan');
  const tag = (t) => ex.assets.find((a) => a.tasks.includes(t)).tag;
  const overdue = ex.assets.flatMap((a) => a.tasks.map((t) => ({ t, info: M.nextDue(t, ex.rows.filter((r) => r.asset === a.id)) }))).filter(({ info }) => info.due < TODAY);
  assert.deepEqual(overdue.map(({ t, info }) => [tag(t), M.daysBetween(info.due, TODAY)]).sort(), [['DD-04', 9], ['FE-ALL', 6], ['FL-02', 12], ['SRT-01', 3]]);
});

test('a first visit opens on the example with a rich result; clearing it leaves an empty page', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /PM compliance/);
  assert.equal(results.querySelectorAll('.dl-stat').length, 5);
  assert.match(results.querySelector('.dl-stat').textContent, /Due this week/);
  assert.ok(results.querySelectorAll('svg').length >= 4, 'calendar, compliance by area and type, breakdowns by asset');
  assert.match(results.querySelector('.dl-focus h3').textContent, /SRT-01 · Parcel sorter · 4 breakdowns/);
  assert.match(results.querySelector('.dl-focus').textContent, /Also overdue.*FL-02/);
  assert.ok(results.querySelectorAll('.mp-panel-reliability tbody tr').length >= 3, 'MTBF and MTTR where there is enough');
  assert.ok(results.querySelectorAll('.mp-worklist li').length >= 5, 'the work list of the week');
  assert.ok(results.querySelectorAll('.mp-panel-calendar [data-tip]').length >= 20, 'days in the calendar');
  assert.equal(d.querySelectorAll('[data-plan] tr').length, 36);
  assert.match(d.querySelector('[data-plan] tr').textContent, /FL-02.*12 days overdue/);
  const note = d.querySelector('.dl-example-note');
  assert.equal(note.hidden, false);
  assert.equal(w.localStorage.getItem('sc-maintenance-planner'), null, 'nothing is written until the visitor acts');
  click(w, note.querySelector('button'));
  assert.equal(results.hidden, true);
  assert.equal(saved(w).assets.length, 0);
  assert.equal(saved(w).rows.length, 0);
  assert.equal(d.querySelector('[data-plan-empty]').hidden, false);
});

test('an asset from its type: the tasks it brings with their last dates, then done, postponed, a breakdown and a reading', () => {
  const w = load({ storage: { 'sc-maintenance-planner': { site: 'warehouse', assets: [], rows: [] } } });
  const d = w.document;
  type(w, d.querySelector('#mp-type'), 'forklift');
  const boxes = [...d.querySelectorAll('[data-type-task]')];
  assert.equal(boxes.length, 4);
  assert.deepEqual(boxes.map((b) => b.checked), [false, true, true, true], 'the daily check is optional');
  assert.match(d.querySelector('[data-type-tasks]').textContent, /statutory · check your local rules/);
  type(w, d.querySelector('[data-type-last="2"]'), '2026-08-01');
  type(w, d.querySelector('[data-type-last="3"]'), '2025-10-01');
  type(w, d.querySelector('#mp-tag'), 'FL-09');
  type(w, d.querySelector('#mp-area'), 'Inbound');
  d.querySelector('#mp-crit').value = 'A';
  click(w, d.querySelector('[data-add-asset]'));
  let state = saved(w);
  assert.equal(state.assets.length, 1);
  const asset = state.assets[0];
  assert.deepEqual([asset.tag, asset.name, asset.area, asset.crit], ['FL-09', 'Forklift truck', 'Inbound', 'A']);
  assert.deepEqual(asset.tasks.map((t) => [t.unit, t.every, t.hours, t.last, t.start]), [['weeks', 1, 0, '', TODAY], ['months', 3, 500, '2026-08-01', ''], ['years', 1, 0, '2025-10-01', '']]);
  // The same tag again is refused.
  type(w, d.querySelector('#mp-tag'), 'fl-09');
  click(w, d.querySelector('[data-add-asset]'));
  assert.equal(saved(w).assets.length, 1);
  assert.match(d.querySelector('[data-asset-status]').textContent, /already in the plan/);
  // The plan: the yearly inspection is overdue (due 1 October), the battery check is due today.
  const rows = [...d.querySelectorAll('[data-plan] tr')];
  assert.match(rows[0].textContent, /Yearly inspection.*23 days overdue/);
  assert.match(rows[1].textContent, /Battery.*Due this week/);
  // Done from the plan's button: the log form opens on the task.
  const inspection = asset.tasks[2];
  click(w, d.querySelector(`[data-log-task="${inspection.id}"][data-log-kind="done"]`));
  assert.equal(d.querySelector('#mp-log-asset').value, 'FL-09');
  assert.equal(d.querySelector('#mp-log-task').value, inspection.id);
  type(w, d.querySelector('#mp-log-by'), 'Prüfdienst');
  type(w, d.querySelector('#mp-log-parts'), '45.50');
  click(w, d.querySelector('[data-log-save]'));
  state = saved(w);
  assert.equal(state.rows.length, 1);
  assert.deepEqual([state.rows[0].kind, state.rows[0].task, state.rows[0].date, state.rows[0].by, state.rows[0].parts, state.rows[0].minutes], ['done', inspection.id, TODAY, 'Prüfdienst', 45.5, 60]);
  assert.match(d.querySelector('[data-log-status]').textContent, /Next due 2027-10-24/);
  // Postponed: the battery check moves, with its reason.
  const battery = asset.tasks[0];
  click(w, d.querySelector(`[data-log-task="${battery.id}"][data-log-kind="postponed"]`));
  assert.equal(d.querySelector('#mp-log-until').value, '2026-10-31');
  type(w, d.querySelector('#mp-log-reason'), 'Truck at the supplier');
  click(w, d.querySelector('[data-log-save]'));
  assert.equal(saved(w).rows.at(-1).until, '2026-10-31');
  assert.match(d.querySelector(`[data-plan] tr[data-task="${battery.id}"]`).textContent, /2026-10-31.*was 2026-10-24.*postponed/);
  // A meter reading, then a breakdown with its 5 Whys link.
  pickKind(w, 'reading');
  assert.equal(d.querySelector('#mp-log-task').closest('.field').hidden, true);
  type(w, d.querySelector('#mp-log-hours'), '2310');
  click(w, d.querySelector('[data-log-save]'));
  assert.equal(saved(w).rows.at(-1).hours, 2310);
  pickKind(w, 'breakdown');
  type(w, d.querySelector('#mp-log-downtime'), '95');
  d.querySelector('#mp-log-cause').value = 'hydraulic';
  type(w, d.querySelector('#mp-log-cost'), '320');
  type(w, d.querySelector('#mp-log-note'), 'Hose burst');
  click(w, d.querySelector('[data-log-save]'));
  const breakdown = saved(w).rows.at(-1);
  assert.deepEqual([breakdown.kind, breakdown.minutes, breakdown.cause, breakdown.cost, breakdown.note], ['breakdown', 95, 'hydraulic', 320, 'Hose burst']);
  const whys = d.querySelector('[data-log] a.mp-whys');
  assert.equal(new URL(whys.href).pathname, '/tools/five-whys/');
  assert.equal(new URL(whys.href).searchParams.get('problem'), `FL-09 · Forklift truck stopped on ${TODAY}: Hydraulic or oil leak, 95 min of downtime (Hose burst)`);
  // A lower reading than the last is refused.
  pickKind(w, 'reading');
  type(w, d.querySelector('#mp-log-hours'), '2000');
  click(w, d.querySelector('[data-log-save]'));
  assert.equal(saved(w).rows.length, 4);
  assert.match(d.querySelector('[data-log-status]').textContent, /cannot be lower/);
});

test('hand-offs: overdue A-tasks and repeated breakdowns to the Action Tracker, the causes to Pareto, the calendar file', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  const send = [...results.querySelectorAll('button')].find((b) => /^Send \d+ to actions$/.test(b.textContent));
  assert.equal(send.textContent, 'Send 5 to actions');
  click(w, send);
  const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
  assert.equal(actions.length, 5);
  assert.ok(actions.every((a) => a.source === 'maintenance-planner'));
  assert.deepEqual(actions.filter((a) => /^Overdue/.test(a.title)).map((a) => a.title.match(/ · ([A-Z]+-[A-Z0-9]+) · /)[1]).sort(), ['FE-ALL', 'FL-02', 'SRT-01']);
  const fl02 = actions.find((a) => /FL-02/.test(a.title));
  assert.deepEqual([fl02.priority, fl02.area, fl02.due, fl02.owner], ['High', 'Inbound docks', '2026-10-26', 'Liftec Service']);
  assert.match(fl02.detail, /Statutory check/);
  assert.deepEqual(actions.filter((a) => /^Repeated/.test(a.title)).map((a) => a.title).sort(), ['Repeated breakdowns: FL-03 · Forklift 3 · electric 1.6 t', 'Repeated breakdowns: SRT-01 · Parcel sorter']);
  assert.ok(![...results.querySelectorAll('button')].some((b) => /^Send \d+ to actions$/.test(b.textContent)), 'sent once');
  // Pareto 80/20 opens the breakdowns in its maintenance template, weighed by the downtime.
  const pareto = [...results.querySelectorAll('a')].find((a) => /Pareto/.test(a.textContent));
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.template, 'maintenance');
  assert.deepEqual(handoff.headers, ['Date', 'Area', 'Asset', 'Cause', 'Count', 'Downtime minutes', 'Note']);
  assert.equal(handoff.rows.length, 12);
  assert.deepEqual(handoff.map, { category: 3, count: 4, value: 5, date: 0, filter: 1 });
  assert.equal(handoff.measure, 'value');
  const whys = [...results.querySelectorAll('a')].find((a) => /5 Whys/.test(a.textContent));
  assert.match(new URL(whys.href).searchParams.get('problem'), /^SRT-01 · Parcel sorter: 4 breakdowns in 90 days, 330 min of downtime, most often Sensor or control$/);
  const oee = [...results.querySelectorAll('a')].find((a) => /OEE/.test(a.textContent));
  assert.equal(new URL(oee.href).pathname, '/tools/oee/');
  // The calendar file: one event per task, the overdue ones today.
  let blob = null;
  const Real = w.Blob;
  w.Blob = class extends Real { constructor(parts, options) { super(parts, options); if (options?.type?.startsWith('text/calendar')) blob = parts.join(''); } };
  w.HTMLAnchorElement.prototype.click = () => {};
  click(w, d.querySelector('[data-ics]'));
  assert.ok(blob, 'a calendar file');
  const events = blob.split('BEGIN:VEVENT').length - 1;
  assert.equal(events, 36);
  assert.match(blob, /DTSTART;VALUE=DATE:20261024\r\nDTEND;VALUE=DATE:20261025\r\nSUMMARY:Overdue: FL-02/);
});

test('German page: links keep /de/, the plan is in German, and removing a log entry can be undone', () => {
  const w = load({ lang: 'de' });
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  const tracker = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
  assert.match(tracker.href, /\/de\/tools\/action-tracker\//);
  const whys = [...results.querySelectorAll('a')].find((a) => /five-whys/.test(a.href));
  assert.match(whys.href, /\/de\/tools\/five-whys\//);
  const oee = [...results.querySelectorAll('a')].find((a) => /\/oee\//.test(a.href));
  assert.match(oee.href, /\/de\/tools\/oee\/$/);
  assert.match(d.querySelector('[data-plan]').textContent, /Stapler/);
  const n = saved(w, 'sc-maintenance-planner-de');
  assert.equal(n, null);
  click(w, d.querySelector('[data-log] .dl-remove'));
  const count = saved(w, 'sc-maintenance-planner-de').rows.length;
  click(w, d.querySelector('[data-history-status] .dl-undo'));
  assert.equal(saved(w, 'sc-maintenance-planner-de').rows.length, count + 1);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const part = read('src/_data/i18n-parts/maintenance-planner.json');
  const njk = fs.readFileSync('src/_includes/partials/maintenance-planner.njk', 'utf8');
  const js = fs.readFileSync('src/js/maintenance-planner.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*["']((?:[^"'\\]|\\.)*)["']\s*\|\s*t\(lang\)/g)].map((m) => m[1]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 150);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (part[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(part[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/maintenance-planner.cards.json');
  assert.equal(cards.family, 'zenith');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/maintenance-planner/', '/de/tools/maintenance-planner/', '/sq/tools/maintenance-planner/']);
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].type), ['Equipment', 'Anlagen', 'Pajisje']);
});

test('the stylesheet part uses its prefix and the theme variables only', () => {
  const css = fs.readFileSync('src/css/38-maintenance-planner.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(css, /--red|--gold/);
  const classes = [...css.matchAll(/\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]).filter((name) => !/^(dl|ck|fc|kicker|form-note|button|is-|field|optional|num)/.test(name));
  assert.ok(classes.every((name) => name.startsWith('mp-')), classes.filter((name) => !name.startsWith('mp-')).join(', '));
  assert.match(css, /@media print/);
});
