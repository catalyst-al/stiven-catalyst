// Andon Log (src/js/andon.js): minutes between clock times (across midnight), time to respond and to solve, mean and
// median, the shares within target, the escalation level of an open and of a closed call, stopped minutes, the
// Pareto, the hour × weekday grid, pasted rows, a live call closed into the log, and the page that shows them. The
// small fixture is worked out by hand below; the example of the data file (121 calls over two weeks of a two-shift
// warehouse) was added up separately.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/andon.json'), de: read('src/_data/de/andon.json'), sq: read('src/_data/sq/andon.json') };
const part = read('src/_data/i18n-parts/andon.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/andon.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

// Sunday 25 October 2026, noon in Frankfurt: the day after the last day of the example (Saturday), which therefore
// stays where it is.
const NOW = '2026-10-25T11:00:00Z';
const load = ({ lang = 'en', page = false, now = NOW, storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/andon/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; let fixed = new Real(${JSON.stringify(now)}).getTime(); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed; } }; window.__setNow = (ms) => { fixed = ms; }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'andon']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const near = (actual, expected, digits = 9) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≈ ${expected}`);

// Five calls, by hand (targets 3 and 15 min, levels set to 0, 5 and 15 min):
//   A Mon 05.10 07:10 → help 07:12 → solved 07:20  material  respond 2  solve 10  ran on
//   B Mon 05.10 09:00 → help 09:04 → solved 09:30  machine   respond 4  solve 30  stopped 25 min
//   C Tue 06.10 14:30 → help 14:31 → solved 14:34  it        respond 1  solve  4  stopped, minutes not typed: 4
//   D Tue 06.10 23:50 → help 23:58 → solved 00:10  machine   respond 8  solve 20  stopped 20 min (past midnight)
//   E Wed 07.10 07:45 → no help time → solved 07:51 quality  respond –  solve  6  ran on
// Respond 2, 4, 1, 8: mean 3.75, median (2 + 4) / 2 = 3, within 3 min: 2 of 4.
// Solve 10, 30, 4, 20, 6: mean 70 / 5 = 14, median 10, within 15 min: 3 of 5.
// Level reached (open past 5 → supervisor, past 15 → manager): A 1, B 2, C 0, D 2, E 1 → [1, 2, 2], escalated 4.
// Stopped: 3 calls, 25 + 4 + 20 = 49 min.
const FIXTURE = [
  { date: '2026-10-05', shift: 'Early', area: 'Picking', reason: 'material', called: '07:10', arrived: '07:12', solved: '07:20', responder: 'Team lead', stopped: false, stopMin: '', note: '' },
  { date: '2026-10-05', shift: 'Early', area: 'Packing', reason: 'machine', called: '09:00', arrived: '09:04', solved: '09:30', responder: 'Maintenance', stopped: true, stopMin: 25, note: '' },
  { date: '2026-10-06', shift: 'Late', area: 'Picking', reason: 'it', called: '14:30', arrived: '14:31', solved: '14:34', responder: 'IT support', stopped: true, stopMin: '', note: '' },
  { date: '2026-10-06', shift: 'Late', area: 'Dispatch', reason: 'machine', called: '23:50', arrived: '23:58', solved: '00:10', responder: 'Maintenance', stopped: true, stopMin: 20, note: 'Dock leveller' },
  { date: '2026-10-07', shift: 'Early', area: 'Goods-in', reason: 'quality', called: '07:45', arrived: '', solved: '07:51', responder: '', stopped: false, stopMin: '', note: '' },
];

test('the three data files have the same keys, and each language keeps its own log', () => {
  const shape = (cfg) => ({
    top: Object.keys(cfg).sort(),
    text: Object.keys(cfg.text).sort(),
    shifts: cfg.shifts.length, areas: cfg.areas.length, responders: cfg.responders.length, weekdays: cfg.weekdays.length,
    reasons: cfg.reasons.map((r) => [r.key, Object.keys(r).sort()]),
    levels: cfg.levels.map((l) => l.after),
    targets: cfg.targets,
    advice: Object.fromEntries(Object.entries(cfg.advice).map(([k, v]) => [k, Object.keys(v).sort(), v.moves.length])),
    tips: cfg.tips.map((tip) => tip.length),
    example: { top: Object.keys(cfg.example).sort(), start: cfg.example.start, notes: Object.keys(cfg.example.notes).sort(), rows: cfg.example.rows },
  });
  for (const lang of ['de', 'sq']) {
    assert.deepEqual(shape(data[lang]), shape(data.en), lang);
    assert.equal(data[lang].storageKey, `sc-andon-${lang}`);
  }
  assert.equal(data.en.storageKey, 'sc-andon');
  assert.deepEqual(data.en.reasons.map((r) => r.key), ['quality', 'material', 'machine', 'safety', 'people', 'it', 'other']);
  assert.deepEqual(data.en.levels.map((l) => l.after), [0, 15, 30], 'team lead at once, supervisor once the solve target of 15 min is missed, manager after 30');
  assert.deepEqual(data.en.targets, { respond: 3, resolve: 15 });
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = data[lang];
    cfg.reasons.forEach((r) => assert.ok(cfg.advice[r.key], `${lang}: advice for the reason ${r.key}`));
    assert.ok(cfg.advice.default, `${lang}: default advice`);
    cfg.example.rows.forEach((row) => {
      assert.ok(!row.note || cfg.example.notes[row.note], `${lang}: note ${row.note}`);
      assert.ok(cfg.shifts[row.shift] && cfg.areas[row.area] && cfg.responders[row.by], `${lang}: names of day ${row.day}`);
    });
  }
  const cards = read('src/_data/i18n-parts/andon.cards.json');
  assert.equal(cards.family, 'pulse');
  assert.deepEqual(['en', 'de', 'sq'].map((l) => cards.cards[l].url), ['/tools/andon/', '/de/tools/andon/', '/sq/tools/andon/']);
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort(), 'every translated text in both languages');
  const css = fs.readFileSync('src/css/61-andon.css', 'utf8');
  assert.equal(css.split('{').length, css.split('}').length, 'braces balanced');
  assert.doesNotMatch(css, /--red|--gold/);
});

test('minutes between clock times: a later time earlier on the clock is the next day', () => {
  const M = load().AndonMath;
  assert.equal(M.span('07:10', '07:20'), 10);
  assert.equal(M.span('23:50', '00:10'), 20, 'across midnight');
  assert.equal(M.span('22:15', '01:05'), 170);
  assert.equal(M.span('08:00', '08:00'), 0);
  assert.equal(M.span('10:00', '09:59'), 1439, 'one minute earlier is almost a day later');
  assert.equal(M.span('', '09:00'), null);
  assert.equal(M.timeOf('7.45'), '07:45');
  assert.equal(M.timeOf('0745'), '07:45');
  assert.equal(M.timeOf('07:45:30'), '07:45');
  assert.equal(M.timeOf('24.10.2026 08:15'), '08:15');
  assert.equal(M.timeOf('0.5'), '12:00', 'an Excel day fraction');
  assert.equal(M.timeOf('25:00'), '');
  assert.equal(M.timeOf('7:60'), '');
  const rows = M.cleanRows(FIXTURE, data.en);
  assert.deepEqual(plain(rows.map(M.respondOf)), [2, 4, 1, 8, null]);
  assert.deepEqual(plain(rows.map(M.resolveOf)), [10, 30, 4, 20, 6]);
  assert.deepEqual(plain(rows.map(M.stopOf)), [0, 25, 4, 20, 0], 'a stopped line without minutes counts the whole call');
});

test('mean, median, within target, escalation and stopped minutes of the fixture', () => {
  const M = load().AndonMath;
  assert.equal(M.median([2, 4, 1, 8]), 3);
  assert.equal(M.median([10, 30, 4, 20, 6]), 10);
  assert.equal(M.median([]), null);
  assert.equal(M.mean([2, 4, 1, 8]), 3.75);
  assert.deepEqual(plain(M.within([2, 4, 1, 8], 3)), { within: 2, n: 4, share: 0.5 });
  assert.deepEqual(plain(M.within([3], 3)), { within: 1, n: 1, share: 1 }, 'at the target is within it');

  assert.deepEqual(plain(M.settings(data.en, {})), { respond: 3, resolve: 15, afters: [0, 15, 30], rising: true }, 'the defaults');
  const set = M.settings(data.en, { level1: '5', level2: '15' });
  assert.deepEqual(plain(set), { respond: 3, resolve: 15, afters: [0, 5, 15], rising: true });
  const s = M.summary(M.cleanRows(FIXTURE, data.en), set);
  assert.equal(s.n, 5);
  assert.equal(s.days, 3);
  assert.deepEqual(plain(s.respond), { mean: 3.75, median: 3, n: 4, within: 2, share: 0.5 });
  assert.deepEqual(plain(s.resolve), { mean: 14, median: 10, n: 5, within: 3, share: 0.6 });
  assert.deepEqual(plain(s.reached), [1, 2, 2]);
  assert.equal(s.escalated, 4);
  assert.equal(s.stops, 3);
  assert.equal(s.stopMin, 49);

  // An open call: the level to call at the minutes it has been open.
  const afters = [0, 5, 15];
  assert.deepEqual([0, 4.9, 5, 14.99, 15, 90].map((m) => M.levelNow(m, afters)), [0, 0, 1, 1, 2, 2]);
  assert.deepEqual([3, 7, 20].map((m) => M.nextLevelIn(m, afters)), [2, 8, null]);
  // A closed call: the last level it was still open past; solved in exactly 5 minutes never needed the supervisor.
  assert.deepEqual([0, 5, 6, 15, 16].map((m) => M.levelReached(m, afters)), [0, 0, 1, 1, 2]);

  // Typed settings: a decimal comma or point, and escalation minutes that do not rise fall back to the defaults.
  assert.deepEqual(plain(M.settings(data.en, { respondTarget: '2.5', resolveTarget: '20', level1: '4', level2: '12' })), { respond: 2.5, resolve: 20, afters: [0, 4, 12], rising: true });
  assert.deepEqual(plain(M.settings(data.en, { level1: '8', level2: '6' })).afters, [0, 15, 30]);
  assert.equal(M.settings(data.en, { level1: '8', level2: '6' }).rising, false);
});

test('Pareto, the hour × weekday grid, the groups and the slowest calls', () => {
  const M = load().AndonMath;
  const rows = M.cleanRows(FIXTURE, data.en);
  // Machine 2 of 5 (40 %), then it, material and quality with one each in name order; class A while below 80 % before.
  assert.deepEqual(plain(M.pareto(rows, 'reason').map((i) => [i.key, i.value, i.cls])), [['machine', 2, 'A'], ['it', 1, 'A'], ['material', 1, 'A'], ['quality', 1, 'B']]);
  // Stopped minutes: machine 45 (25 + 20), it 4; the reasons without a stop are left out.
  const stops = M.pareto(rows, 'reason', M.stopOf);
  assert.deepEqual(plain(stops.map((i) => [i.key, i.value])), [['machine', 45], ['it', 4]]);
  near(stops[0].share, 45 / 49);
  const h = M.heat(rows);
  assert.deepEqual(plain(h.days), [0, 1, 2], 'Monday to Wednesday');
  assert.deepEqual([h.hours[0], h.hours.at(-1), h.hours.length], [7, 23, 17]);
  assert.equal(h.counts[0][7] + h.counts[0][9] + h.counts[1][14] + h.counts[1][23] + h.counts[2][7], 5);
  assert.equal(h.max, 1);
  assert.equal(M.weekdayOf('2026-10-25'), 6, 'a Sunday');
  const set = M.settings(data.en, {});
  const byShift = M.groups(rows, 'shift', set);
  assert.deepEqual(plain(byShift.map((g) => [g.key, g.n, g.resolve.median])), [['Early', 3, 10], ['Late', 2, 12]]);
  assert.deepEqual(plain(M.slowest(rows, 3).map((r) => r.called)), ['09:00', '23:50', '07:10']);
});

test('pasted rows, saved rows that are damaged, and a live call closed into the log', () => {
  const w = load();
  const M = w.AndonMath;
  const text = [
    'Date\tShift\tStation\tReason\tCalled\tArrived\tSolved\tResponder\tStopped\tMinutes\tNote',
    '2026-10-14\tearly\tPicking\tMissing material\t07:12\t07:14\t07:21\tTeam lead\tno\t\tPick face A-12 empty',
    '14.10.2026\tLate\tDock 2\tmach\t23:40\t23:50\t00:05\tMaintenance\t\t20\t',
    '2026-10-14\tLate\tPacking\tIT\t08:00\t\t\t\t\t\t',
  ].join('\n');
  const { added, skipped } = M.importRows(text, data.en);
  assert.equal(skipped, 1, 'a row without a solved time');
  assert.deepEqual(plain(added.map((r) => [r.date, r.shift, r.area, r.reason, M.resolveOf(r), r.stopped, r.stopMin])), [
    ['2026-10-14', 'Early', 'Picking', 'material', 9, false, 0],
    ['2026-10-14', 'Late', 'Dock 2', 'machine', 25, true, 20],
  ]);
  // An arrival after the solution is a slip and is dropped; stopped minutes never exceed the call.
  const odd = M.cleanRow({ date: '2026-10-14', called: '08:00', arrived: '08:30', solved: '08:10', stopped: true, stopMin: 60, reason: 'nope' }, data.en);
  assert.deepEqual(plain([odd.arrived, odd.stopMin, odd.reason]), ['', 10, 'other']);
  assert.equal(M.cleanRows([null, { date: 'x' }, { date: '2026-10-14', called: '8:00' }], data.en).length, 0);

  // A call at 23:50 on Saturday solved at 00:10: the log keeps the day of the call, and 20 minutes.
  const calledAt = new w.Date(2026, 9, 24, 23, 50).getTime();
  const row = M.closeCall({ calledAt, arrivedAt: 0, area: 'Dispatch', shift: 'Late', reason: 'machine', stopped: true, stopMin: '', responder: 'Maintenance', note: '' }, calledAt + 20 * 6e4, data.en);
  assert.deepEqual(plain([row.date, row.called, row.arrived, row.solved, M.resolveOf(row), row.stopMin]), ['2026-10-24', '23:50', '00:10', '00:10', 20, 20]);
});

test('the example adds up: 121 calls over twelve working days, moved by whole weeks', () => {
  const M = load().AndonMath;
  const rows = M.exampleRows(data.en, '2026-10-25');
  assert.equal(rows.length, 121);
  assert.deepEqual([rows[0].date, rows.at(-1).date], ['2026-10-12', '2026-10-24']);
  const days = [...new Set(rows.map((r) => r.date))];
  assert.equal(days.length, 12, 'Monday to Saturday, two weeks');
  days.forEach((d) => { const n = rows.filter((r) => r.date === d).length; assert.ok(n >= 6 && n <= 14, `${d}: ${n} calls`); });
  const s = M.summary(rows, M.settings(data.en, {}));
  // Added up separately: respond 392 min over 121 calls, solve 1299 min.
  near(s.respond.mean, 392 / 121);
  near(s.resolve.mean, 1299 / 121);
  assert.deepEqual([s.respond.median, s.resolve.median], [2, 8]);
  assert.deepEqual([s.respond.within, s.resolve.within], [94, 100]);
  assert.deepEqual(plain(s.reached), [100, 15, 6]);
  assert.deepEqual([s.stops, s.stopMin], [43, 538]);
  assert.deepEqual(plain(M.pareto(rows, 'reason').slice(0, 3).map((i) => [i.key, i.value])), [['material', 38], ['machine', 25], ['it', 18]]);
  // The call that ran past midnight is in it, on the day it was made.
  const late = rows.find((r) => r.called === '23:41');
  assert.deepEqual([late.date, M.resolveOf(late)], ['2026-10-23', 32]);
  // A week later the example moves one week forward, weekdays unchanged.
  assert.equal(M.exampleShift(data.en, '2026-11-01'), 7);
  assert.equal(M.exampleRows(data.en, '2026-11-01')[0].date, '2026-10-19');
});

test('a first visit opens on the example: the numbers, the charts and the hand-offs', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.match(results.querySelector('h2').textContent, /^121 Rufe · Hilfe in 2 min, gelöst in 8 min \(Median\)/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Rufe12110,1 pro Tag an 12 Tagen mit Rufen/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Reaktion im Ziel78\s%94 von 121 innerhalb von 3 min/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Gelöst im Ziel83\s%100 von 121 innerhalb von 15 min/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Eskaliert21Supervisor erreicht: 21 · Schichtleitung erreicht: 6/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Linie stand538 min43 von 121 Rufen/.test(s)), stats.join(' | '));
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Fehlendes Material · 31\s%/);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 5, 'two Pareto charts, the heat map, the days, the levels');
  assert.equal(results.querySelectorAll('.an-slow tbody tr').length, 8);

  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/pareto/'));
  assert.equal(new URL(pareto.href).pathname, '/de/tools/pareto/');
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.rows.length, 121);
  assert.deepEqual(handoff.map, { date: 0, filter: 1, category: 2, count: -1, value: 4 });
  assert.equal(handoff.rows[0][0], '2026-10-12');

  const action = results.querySelector('.dl-focus a');
  action.addEventListener('click', (event) => event.preventDefault());
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(action.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'andon');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.match(url.searchParams.get('action'), /Fehlendes Material/);
  const whys = results.querySelector('.an-slow a');
  assert.ok(whys.href.startsWith('https://example.test/de/tools/five-whys/?problem='), whys.href);
  assert.match(new URL(whys.href).searchParams.get('problem'), /^Andon-Ruf am \d\d\.10\.2026 um \d\d:\d\d/);
});

test('a live call: the clock, the level to call now, help arrived and solved; it survives a reload', () => {
  const calledAt = Date.parse(NOW) - 17 * 6e4;
  const open = [{ id: 'c1', area: 'Picking', shift: 'Early', reason: 'material', calledAt, arrivedAt: 0, responder: '', stopped: false, stopMin: '', note: '' }];
  const w = load({ lang: 'en', page: true, storage: { 'sc-andon': { rows: [], open } } });
  const doc = w.document;
  const card = doc.querySelector('[data-call-id="c1"]');
  assert.ok(card, 'the open call is back after the reload');
  assert.equal(card.querySelector('[data-elapsed]').textContent, '17');
  assert.equal(card.dataset.level, '1');
  assert.equal(card.querySelector('[data-escalate]').textContent, '▲ Call now: Supervisor · Shift manager in 13 min');
  assert.equal(card.querySelector('[data-help]').textContent, 'Waiting for help');
  assert.equal(doc.querySelector('[data-results]').hidden, true, 'no closed call yet, no result');

  // Help arrives a minute later; the call is solved four minutes after that, with the line stopped.
  w.__setNow(calledAt + 18 * 6e4);
  card.querySelector('.an-arrived').click();
  const again = doc.querySelector('[data-call-id="c1"]');
  assert.match(again.querySelector('[data-help]').textContent, /^Help on site since \d\d:\d\d \(18 min to respond\)/);
  const box = again.querySelector('input[type=checkbox]');
  box.checked = true;
  box.dispatchEvent(new w.Event('change'));
  w.__setNow(calledAt + 22 * 6e4);
  again.querySelector('.an-solved').click();
  assert.equal(doc.querySelector('[data-call-id="c1"]'), null);
  flush(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-andon'));
  assert.equal(saved.open.length, 0);
  assert.equal(saved.rows.length, 1);
  assert.deepEqual([saved.rows[0].date, saved.rows[0].reason, saved.rows[0].stopped, saved.rows[0].stopMin], ['2026-10-25', 'material', true, 22]);
  assert.match(doc.querySelector('[data-results] h2').textContent, /^1 call · help in 18 min, solved in 22 min/);

  // A new call from the big button.
  doc.querySelector('[data-call="safety"]').click();
  assert.equal(doc.querySelectorAll('[data-call-id]').length, 1);
  assert.match(doc.querySelector('[data-live-status]').textContent, /^Call started: Safety at /);
  flush(w);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-andon')).open[0].reason, 'safety');
  w.close();
});

test('an entry after the fact replaces the example; filters and the workplace profile', () => {
  const w = load({ lang: 'sq', page: true, storage: { 'sc-workplace': { shifts: ['A', 'B'], areas: [{ name: 'Rampa 1', owner: '' }] } } });
  const doc = w.document;
  assert.deepEqual([...doc.querySelector('#an-shift').options].map((o) => o.value), ['A', 'B']);
  assert.deepEqual([...doc.querySelector('#an-live-area').options].map((o) => o.value), ['Rampa 1']);
  const results = doc.querySelector('[data-results]');
  const reason = doc.querySelector('#an-filter-reason');
  reason.value = 'machine';
  reason.dispatchEvent(new w.Event('change'));
  assert.match(results.querySelector('h2').textContent, /^25 thirrje/);
  reason.value = '';
  reason.dispatchEvent(new w.Event('change'));

  const form = doc.querySelector('[data-entry]');
  form.elements.date.value = '2026-10-25';
  form.elements.reason.value = 'it';
  form.elements.called.value = '23:55';
  form.elements.arrived.value = '23:58';
  form.elements.solved.value = '00:20';
  form.elements.solved.dispatchEvent(new w.Event('input'));
  assert.match(doc.querySelector('[data-times-note]').textContent, /Koha e zgjidhjes: 25 min · zgjidhur ditën tjetër/);
  form.elements.stopped.value = 'yes';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.equal(doc.querySelector('.dl-example-note').hidden, true, 'the example left with the first own entry');
  assert.match(results.querySelector('h2').textContent, /^1 thirrje · ndihma për 3 min, zgjidhur për 25 min/);
  flush(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-andon-sq'));
  assert.deepEqual(plain([saved.rows.length, saved.rows[0].shift, saved.rows[0].area, saved.rows[0].stopMin]), [1, 'A', 'Rampa 1', 25]);

  // Help arrived after the solution is refused.
  form.elements.called.value = '08:00';
  form.elements.arrived.value = '08:30';
  form.elements.solved.value = '08:10';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.match(doc.querySelector('[data-entry-status]').textContent, /midis thirrjes dhe zgjidhjes/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-andon-sq')).rows.length, 1);
});
