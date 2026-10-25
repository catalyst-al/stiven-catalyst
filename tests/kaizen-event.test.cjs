// The Kaizen Event (src/js/kaizen-event.js): the arithmetic in window.KaizenEventMath (preparation due dates counted
// back from the first day, the change of each goal for "lower is better" and "higher is better" and whether its
// target is met, the status of an event, the 30-day follow-up list and its closed share, the team rule that operators
// from the area are required, the agenda folded into 3 or 4 days), the hand-off to the Action Tracker, the three data
// files, and the page itself in jsdom: the example on a first visit, the report-out, the charter and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/kaizenEvent.json', de: 'src/_data/de/kaizenEvent.json', sq: 'src/_data/sq/kaizenEvent.json' };
const DMAIC = { en: 'src/_data/dmaic.json', de: 'src/_data/de/dmaic.json', sq: 'src/_data/sq/dmaic.json' };
const BOARD = { en: 'src/_data/kaizenBoard.json', de: 'src/_data/de/kaizenBoard.json', sq: 'src/_data/sq/kaizenBoard.json' };
// A Saturday: the example's event ran Monday 28 September to Friday 2 October, its 30-day check is on 1 November.
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: true });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value).replace(/</g, '\\u003c')));
const partial = (lang) => env.render('partials/kaizen-event.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/kaizen-event/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'docx-kit', 'kaizen-event']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const math = () => load({ page: false }).KaizenEventMath;
const example = (M, lang = 'en', day = TODAY) => M.exampleEvent(read(DATA[lang]), day);
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, node, value) => {
  if (node.type === 'checkbox') node.checked = value; else node.value = value;
  node.dispatchEvent(new w.Event('input', { bubbles: true }));
  node.dispatchEvent(new w.Event('change', { bubbles: true }));
};
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
const numbers = (value) => (Array.isArray(value) ? value.map(numbers) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, numbers(value[key])])) : typeof value === 'string' ? 'text' : value);

test('the three data files share one shape, the same keys and numbers, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-kaizen-event');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-kaizen-event-${lang}`);
    assert.deepEqual(shape(other), shape(en), `${lang}: same shape`);
    assert.deepEqual(numbers({ ...other, storageKey: '' }), numbers({ ...en, storageKey: '' }), `${lang}: same numbers, keys, statuses and dates`);
    for (const name of ['eventStatuses', 'ideaStatuses', 'directions']) assert.deepEqual(Object.keys(other[name]), Object.keys(en[name]), `${lang}: ${name}`);
    assert.deepEqual(other.roles.map((r) => r.key), en.roles.map((r) => r.key));
    assert.deepEqual(other.links.map((l) => l.url), en.links.map((l) => l.url));
    assert.deepEqual(other.plans, en.plans);
    assert.deepEqual(other.prep.map((p) => p.weeks), en.prep.map((p) => p.weeks));
    assert.deepEqual(other.agenda.map((d) => d.items.length), en.agenda.map((d) => d.items.length));
  }
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = read(DATA[lang]);
    // The 8 wastes are those of the DMAIC course, with the same names in each language.
    assert.deepEqual(cfg.wastes.map((w) => [w.key, w.name]), read(DMAIC[lang]).wastes.map(([key, name]) => [key, name]), `${lang}: wastes as in dmaic.json`);
    // The matrix names are the Kaizen Board's.
    assert.deepEqual(cfg.quadrants, read(BOARD[lang]).quadrants, `${lang}: quadrants as on the Kaizen Board`);
    assert.equal(cfg.agenda.length, 5);
    assert.ok(cfg.example.members.some((m) => m.role === 'operator'), `${lang}: the example has operators`);
    for (const days of ['3', '4', '5']) {
      assert.equal(cfg.plans[days].length, Number(days));
      assert.deepEqual(cfg.plans[days].flat(), [0, 1, 2, 3, 4], `${lang}: every standard day is in the ${days}-day plan once`);
    }
  }
});

test('preparation due dates count back from the first day in whole weeks', () => {
  const M = math();
  assert.equal(M.prepDue('2026-11-16', 6), '2026-10-05');
  assert.equal(M.prepDue('2026-11-16', 4), '2026-10-19');
  assert.equal(M.prepDue('2026-11-16', 1), '2026-11-09');
  assert.equal(M.prepDue('2026-11-16', 0), '2026-11-16');
  assert.equal(M.prepDue('', 3), '', 'no start, no due date');
  const e = M.cleanEvent({ start: '2026-11-16', prep: [
    { text: 'Charter', weeks: 6, done: false },
    { text: 'Data', weeks: 3, done: false },
    { text: 'Operators released', weeks: 2, done: false },
    { text: 'Team invited', weeks: 4, done: true },
  ] });
  const plan = plain(M.prepPlan(e, '2026-10-25'));
  assert.deepEqual(plan.items.map((p) => [p.due, p.state]), [['2026-10-05', 'overdue'], ['2026-10-26', 'soon'], ['2026-11-02', 'open'], ['2026-10-19', 'done']]);
  assert.deepEqual([plan.done, plan.total, plan.overdue], [1, 4, 1]);
  // On its due date a task is not yet overdue.
  assert.equal(M.prepPlan(e, '2026-10-05').items[0].state, 'soon');
  // The event: five days back to back, the 30-day check 30 days after the last.
  assert.equal(M.endDate('2026-11-16', 5), '2026-11-20');
  assert.equal(M.endDate('2026-11-16', 3), '2026-11-18');
  assert.equal(M.checkDate('2026-11-16', 5), '2026-12-20');
  assert.deepEqual(plain(M.eventDates('2026-11-16', 4)), ['2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19']);
});

test('the change of a goal is measured the right way round, and its target is met or not', () => {
  const M = math();
  // Lower is better: (baseline − result) / baseline.
  close(M.improvement(18.4, 7.6, 'lower'), 10.8 / 18.4, 'walking');
  close(M.improvement('96', '74', 'lower'), 22 / 96, 'cycle time');
  close(M.improvement(42, 50, 'lower'), -8 / 42, 'worse: negative');
  // Higher is better: (result − baseline) / baseline.
  close(M.improvement(37.5, 46.2, 'higher'), 8.7 / 37.5, 'productivity');
  close(M.improvement(37.5, 30, 'higher'), -7.5 / 37.5, 'productivity down');
  assert.equal(M.improvement(0, 5, 'lower'), null, 'no baseline, no share');
  assert.equal(M.improvement(10, '', 'lower'), null);
  // Typed with a decimal comma.
  close(M.improvement('18,4', '7,6', 'lower'), 10.8 / 18.4, 'decimal comma');
  // Target met.
  assert.equal(M.targetMet(75, 78, 'lower'), false);
  assert.equal(M.targetMet(75, 75, 'lower'), true, 'at the target is met');
  assert.equal(M.targetMet(75, 74, 'lower'), true);
  assert.equal(M.targetMet(48, 46.2, 'higher'), false);
  assert.equal(M.targetMet(48, 48, 'higher'), true);
  assert.equal(M.targetMet(48, 48.6, 'higher'), true);
  assert.equal(M.targetMet('', 48.6, 'higher'), null);
  // The share of the planned change reached.
  close(M.gapClosed(18.4, 9, 7.6), 10.8 / 9.4, 'beyond the target');
  close(M.gapClosed(96, 75, 78), 18 / 21, 'short of the target');
  close(M.gapClosed(37.5, 48, 46.2), 8.7 / 10.5, 'higher is better');
  // The example: after the event 2 of 4 targets met, at the 30-day check 3 of 4.
  const g = plain(M.goalsSummary(example(M)));
  assert.deepEqual(g.goals.map((x) => [x.after.met, x.day30.met]), [[true, true], [false, true], [true, false], [false, true]]);
  assert.deepEqual([g.after.met, g.day30.met, g.latest.met, g.total], [2, 3, 3, 4]);
  close(g.goals[0].targetChange, 9.4 / 18.4, 'planned change of the walk');
  close(g.goals[3].day30.change, 11.1 / 37.5, 'productivity at day 30');
  assert.equal(g.goals[2].latest.when, 'day30');
});

test('the status of an event and its 30-day follow-up list', () => {
  const M = math();
  const e = example(M);
  assert.equal(e.start, '2026-09-28');
  assert.equal(M.endDate(e.start, e.days), '2026-10-02');
  assert.equal(M.eventStatus(e, '2026-09-27'), 'planned');
  assert.equal(M.eventStatus(e, '2026-09-28'), 'running');
  assert.equal(M.eventStatus(e, '2026-10-02'), 'running');
  assert.equal(M.eventStatus(e, '2026-10-03'), 'followup');
  assert.equal(M.eventStatus({ ...e, closedOn: '2026-11-01' }, TODAY), 'closed');
  assert.equal(M.eventStatus(M.cleanEvent({}), TODAY), 'planned', 'no start: planned');

  // After the event: two items put on the list, two closed since, and the trial still running.
  const f = plain(M.followUp(e, TODAY));
  assert.equal(f.due, '2026-11-01');
  assert.equal(f.left, 8);
  assert.equal(f.items.length, 5);
  assert.deepEqual([f.closed, f.inTime, f.late, f.open], [2, 2, 0, 3]);
  close(f.share, 2 / 5, 'closed share');
  assert.equal(f.state, 'open');
  // During the event the trial is not yet a follow-up item.
  assert.equal(M.followUp(e, '2026-10-01').items.length, 4);
  // Past the check with items open: overdue, days left negative.
  const late = plain(M.followUp(e, '2026-11-05'));
  assert.deepEqual([late.left, late.state], [-4, 'overdue']);
  // An item closed after the check counts as closed, but not by day 30.
  const after = M.cleanEvent(JSON.parse(JSON.stringify(e)));
  after.ideas[6].status = 'done';
  after.ideas[6].closed = '2026-11-03';
  const g = plain(M.followUp(after, '2026-11-05'));
  assert.deepEqual([g.closed, g.inTime, g.late], [3, 2, 1]);
  close(g.share, 2 / 5, 'late closing does not count by day 30');
  // All closed: done.
  const all = M.cleanEvent(JSON.parse(JSON.stringify(e)));
  all.ideas.forEach((i) => { if (i.fu || i.status === 'trying') { i.status = 'done'; i.closed = i.closed || '2026-10-20'; } });
  assert.equal(M.followUp(all, TODAY).state, 'done');
  assert.equal(M.followUp(all, TODAY).share, 1);
  // The list of events.
  const o = plain(M.overview([e, M.cleanEvent({ name: 'Next', start: '2026-12-07', days: 3 })], TODAY));
  assert.deepEqual(o.byStatus, { planned: 1, running: 0, followup: 1, closed: 0 });
  assert.deepEqual([o.items[0].left, o.items[0].goalsMet, o.items[0].goalsTotal, o.items[0].followUpInTime], [8, 3, 4, 2]);
  assert.equal(o.items[1].check, '2027-01-08');
});

test('the team needs operators from the area', () => {
  const M = math();
  const team = (roles) => M.teamCheck(roles.map((role, i) => ({ name: `P${i}`, role })));
  assert.deepEqual(plain(team(['supervisor', 'maintenance', 'support', 'outsider', 'other', 'support'])), { size: 6, operators: 0, warnings: ['noOperator'], ok: false });
  assert.deepEqual(plain(team(['operator', 'supervisor', 'maintenance', 'support', 'outsider', 'other', 'support'])).warnings, ['fewOperators'], '1 of 7 is less than a third');
  assert.deepEqual(plain(team(['operator', 'operator', 'operator', 'supervisor', 'maintenance', 'support', 'outsider'])).warnings, [], '3 of 7');
  assert.deepEqual(plain(team(['operator', 'support'])).warnings, ['small']);
  assert.deepEqual(plain(team(Array(11).fill('operator'))).warnings, ['large']);
  // A row without a name does not count.
  assert.equal(M.teamCheck([{ name: '', role: 'operator' }, { name: 'Ana', role: 'support' }]).operators, 0);
  assert.equal(M.teamCheck(example(M).members).ok, true);
});

test('the agenda folds the five standard days into 3 or 4, and a new length keeps the ticks', () => {
  const M = math();
  const cfg = read(DATA.en);
  const five = plain(M.buildAgenda(cfg.agenda, cfg.plans, 5));
  assert.deepEqual(five.map((d) => d.title), cfg.agenda.map((d) => d.title));
  const three = plain(M.buildAgenda(cfg.agenda, cfg.plans, 3));
  assert.equal(three.length, 3);
  assert.equal(three[1].title, `${cfg.agenda[1].title} · ${cfg.agenda[2].title}`);
  assert.equal(three[2].items.length, cfg.agenda[3].items.length + cfg.agenda[4].items.length);
  assert.equal(three.flatMap((d) => d.items).length, cfg.agenda.flatMap((d) => d.items).length, 'no item lost');
  const four = M.buildAgenda(cfg.agenda, cfg.plans, 4);
  assert.equal(four.length, 4);
  // Rebuild: the tick on the first walk and an added line on day 2 survive.
  const old = M.buildAgenda(cfg.agenda, cfg.plans, 5);
  old[0].items[2].done = true;
  old[1].items.push({ text: 'Visit the supplier', done: true });
  const rebuilt = plain(M.rebuildAgenda(old, cfg.agenda, cfg.plans, 3));
  assert.equal(rebuilt[0].items[2].done, true);
  assert.equal(rebuilt[1].items.at(-1).text, 'Visit the supplier');
  assert.equal(rebuilt.flatMap((d) => d.items).filter((i) => i.done).length, 2);
  assert.deepEqual(plain(M.agendaProgress(rebuilt))[0], { done: 1, total: cfg.agenda[0].items.length });
  // The example: every line ticked but the training of the other shifts on day 4.
  const progress = plain(M.agendaProgress(example(M).agenda));
  assert.deepEqual(progress.map((p) => p.total - p.done), [0, 0, 0, 1, 0]);
});

test('the hand-off to the Action Tracker and the text for the Kaizen Board', () => {
  const M = math();
  const e = example(M);
  const printer = e.ideas[6];
  const payload = plain(M.actionPayload(e, printer, { event: 'Kaizen event: Packing line 2', list: '30-day follow-up list', waste: 'Waste: Motion', check: 'Closed by the 30-day check on 2026-11-01' }));
  assert.deepEqual(payload, {
    title: 'A label printer at every bench, printing on the last scan',
    detail: 'Kaizen event: Packing line 2 · 30-day follow-up list · Waste: Motion',
    owner: 'Nina Hofmann', due: '2026-10-27', source: 'kaizen-event', check: 'Closed by the 30-day check on 2026-11-01', area: 'Packing', priority: 'High',
  });
  // No date of its own: due by the 30-day check; impact below 4: medium.
  const spider = plain(M.actionPayload(e, { ...e.ideas[10], due: '' }));
  assert.deepEqual([spider.due, spider.priority, spider.source], ['2026-11-01', 'Medium', 'kaizen-event']);
  // The tracker link keeps the page's language and carries the source.
  const w = load({ lang: 'de', page: false });
  const url = new URL(w.ActionsStore.link(payload));
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'kaizen-event');
  assert.equal(url.searchParams.get('due'), '2026-10-27');
  // The Kaizen Board reads no address: the idea is copied as text.
  const board = M.boardText(e, e.ideas[11], { waste: 'Motion' });
  assert.match(board, /^Height-adjustable tables for all eight benches\nWaste: Motion · Effort: 5\/5 · Impact: 3\/5\nFrom: Packing line 2/);
  // Effort and impact as on the Kaizen Board.
  assert.deepEqual([M.quadrant(1, 5), M.quadrant(5, 5), M.quadrant(1, 2), M.quadrant(5, 2), M.quadrant(3, 3), M.quadrant(4, 3)], [0, 1, 2, 3, 0, 1]);
  assert.deepEqual([M.matrixPos(1), M.matrixPos(3), M.matrixPos(5)], [0, 5, 10]);
});

test('the page: the example on a first visit, the report-out, the charter, the exports and the hand-offs', () => {
  const w = load();
  const doc = w.document;
  const saved = JSON.parse(w.localStorage.getItem('sc-kaizen-event'));
  assert.equal(saved.events.length, 1, 'the example is saved');
  assert.equal(saved.example, saved.current);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('.result-head').textContent, /Follow-up: 8 days to the 30-day check on 2026-11-01\. 3 of 5 follow-up items open\./);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /Targets met3 of 4/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /Follow-up closed40%/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /€61,600/.test(s)));
  // The report-out with a chart per goal, the follow-up list and the team; the charter in the details.
  const report = results.querySelector('.ke-report');
  assert.ok(report, 'report-out sheet');
  assert.equal(report.querySelectorAll('.ke-goal-chart svg').length, 4);
  assert.equal(report.querySelectorAll('.ke-goals-table tbody tr').length, 4);
  assert.match(report.textContent, /58\.7% better/);
  assert.match(report.textContent, /A label printer at every bench/);
  const charter = results.querySelector('.ke-charter');
  assert.ok(charter, 'charter sheet');
  assert.match(charter.textContent, /2026-08-17/, 'the first preparation task is due six weeks before');
  assert.ok(results.querySelector('.ck-chart'), 'the effort and impact matrix');
  // The form shows the example: goals, team, prep with due dates, the five days, the ideas.
  assert.equal(doc.getElementById('ke-name').value, 'Packing line 2: walk less, pack faster');
  assert.equal(doc.querySelectorAll('[data-rows="goals"] .ke-row').length, 4);
  assert.equal(doc.querySelectorAll('[data-rows="ideas"] .ke-row').length, 13);
  assert.equal(doc.querySelectorAll('[data-agenda] .ke-day').length, 5);
  assert.match(doc.querySelector('[data-calc="prep:0"]').textContent, /Due 2026-08-17 · ✓ done/);
  assert.match(doc.querySelector('[data-team-note]').textContent, /Team size: 7; operators from the area: 3\./);
  // Exports.
  const M = w.KaizenEventMath;
  const e = saved.events[0];
  const rows = M.actionRows(M.cleanEvent(e));
  assert.equal(rows.length, 14);
  assert.deepEqual(plain(rows[0].slice(0, 3)), ['No.', 'Idea or action', 'Waste']);
  assert.equal(rows.filter((r) => r[10] === 'Yes').length, 5, 'five on the follow-up list');
  const bytes = M.wordFile(M.cleanEvent(e));
  assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK');
  const summary = M.asText(M.cleanEvent(e));
  assert.match(summary, /30-day follow-up list · 2 of 5 closed · check on 2026-11-01/);
  assert.match(summary, /Hard savings per year: €61,600 /);
  // Print the charter: the root says which sheet.
  let printed = '';
  w.print = () => { printed = doc.documentElement.dataset.kePrint; };
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Print the charter'));
  assert.equal(printed, 'charter');
  // Send the open follow-up items to the tracker, once.
  const send = [...results.querySelectorAll('button')].find((b) => b.textContent === 'Send the follow-up list to the Action Tracker');
  click(w, send);
  const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
  assert.equal(actions.length, 3);
  assert.ok(actions.every((a) => a.source === 'kaizen-event' && a.area === 'Packing'));
  click(w, [...doc.querySelectorAll('[data-results] button')].find((b) => b.textContent === 'Send the follow-up list to the Action Tracker'));
  assert.equal(JSON.parse(w.localStorage.getItem('sc-actions')).rows.length, 3, 'not twice');
  // The links of the page keep their language.
  const de = load({ lang: 'de' });
  const hrefs = [...de.document.querySelectorAll('.ke-links a')].map((a) => a.getAttribute('href'));
  assert.ok(hrefs.length >= 8 && hrefs.every((href) => href.startsWith('/de/tools/')), hrefs.join(' '));
  assert.match(de.document.querySelector('.ke-links').textContent, /Zeitstudie/);
});

test('editing: the example becomes the visitor\'s own, a status change dates the closing, no operator warns', () => {
  const w = load();
  const doc = w.document;
  type(w, doc.getElementById('ke-name'), 'Line 3');
  const saved = JSON.parse(w.localStorage.getItem('sc-kaizen-event'));
  assert.equal(saved.example, '', 'the first change makes it the visitor\'s');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  // The training item (follow-up) is closed today.
  const status = doc.getElementById('ke-ideas-status-9');
  type(w, status, 'done');
  const idea = JSON.parse(w.localStorage.getItem('sc-kaizen-event')).events[0].ideas[9];
  assert.deepEqual([idea.status, idea.closed, idea.fu], ['done', TODAY, true]);
  // The trial, closed after the event, stays a follow-up item.
  type(w, doc.getElementById('ke-ideas-status-10'), 'done');
  const trial = JSON.parse(w.localStorage.getItem('sc-kaizen-event')).events[0].ideas[10];
  assert.deepEqual([trial.status, trial.fu], ['done', true]);
  assert.match(doc.querySelector('.result-head').textContent, /1 of 5 follow-up items open/);
  // Every member becomes a support function: the warning.
  [0, 1, 2].forEach((i) => type(w, doc.getElementById(`ke-members-role-${i}`), 'support'));
  assert.match(doc.querySelector('[data-team-note]').textContent, /No operator from the area on the team/);
  assert.ok(doc.querySelector('[data-team-note]').classList.contains('is-warning'));
  assert.match(doc.querySelector('[data-results]').textContent, /! No operator from the area on the team/);
  // A new event starts six weeks ahead on a Monday, with the standard preparation and agenda.
  click(w, doc.querySelector('[data-new]'));
  const now = JSON.parse(w.localStorage.getItem('sc-kaizen-event'));
  const fresh = now.events.find((e) => e.id === now.current);
  assert.equal(fresh.start, '2026-11-30', 'the Monday of the week six weeks ahead');
  assert.equal(fresh.prep.length, 9);
  assert.equal(fresh.agenda.length, 5);
  // Three days instead of five: the agenda is folded.
  type(w, doc.getElementById('ke-days'), '3');
  assert.equal(doc.querySelectorAll('[data-agenda] .ke-day').length, 3);
  assert.match(doc.querySelector('[data-dates-note]').textContent, /2026-11-30 – 2026-12-02\. 30-day check: 2027-01-01\./);
});

test('a damaged save loads without breaking, and the German page counts back too', () => {
  const w = load({ storage: { 'sc-kaizen-event': { events: [null, 5, { name: 'Kept', days: 9, start: 'soon', goals: 'x', ideas: [{ text: 'A', status: 'weird', effort: 99 }] }], current: 7 } } });
  const doc = w.document;
  assert.equal(doc.querySelectorAll('.ke-item').length, 1);
  assert.equal(doc.getElementById('ke-name').value, 'Kept');
  assert.equal(doc.getElementById('ke-days').value, '5', 'an unknown length is 5 days');
  assert.equal(doc.getElementById('ke-start').value, '', 'a damaged date is dropped');
  const clean = w.KaizenEventMath.cleanEvent({ ideas: [{ text: 'A', status: 'weird', effort: 99, waste: 'Z' }] }).ideas[0];
  assert.deepEqual([clean.status, clean.effort, clean.waste], ['idea', 5, '']);
  const de = load({ lang: 'de' });
  const saved = JSON.parse(de.localStorage.getItem('sc-kaizen-event-de'));
  assert.equal(saved.events[0].goals[0].baseline, '18,4', 'the example is written as German writes numbers');
  assert.equal(de.document.querySelector('[data-calc="prep:0"]').textContent.startsWith('Due 17.08.2026'), true);
});
