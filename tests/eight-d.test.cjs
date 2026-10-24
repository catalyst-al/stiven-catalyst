// The 8D Report (src/js/eight-d.js): the arithmetic in window.EightDMath (days open, to containment and to close, the
// target times and what is overdue, the overview of all reports), the completeness rules of 5W2H and IS / IS NOT, the
// containment and validation numbers, the hand-offs to the Action Tracker, the summary, the printed sheet and the Word
// file with every discipline, the read-only imports from 5 Whys and Fishbone, the three data files, and the page itself.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-12, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/eightD.json', de: 'src/_data/de/eightD.json', sq: 'src/_data/sq/eightD.json' };
const TODAY = '2026-10-24';

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: true });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value).replace(/</g, '\\u003c')));
const partial = (lang) => env.render('partials/eight-d.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {}, search = '' } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/eight-d/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'docx-kit', 'eight-d']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-eight-d') => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, node, value) => {
  if (node.type === 'checkbox') node.checked = value; else node.value = value;
  node.dispatchEvent(new w.Event('input', { bubbles: true }));
  node.dispatchEvent(new w.Event('change', { bubbles: true }));
};
const math = () => load({ page: false }).EightDMath;
const example = (lang = 'en', day = TODAY) => math().exampleReport(read(DATA[lang]).example, day);

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
// The numbers, flags and keys of a value, with every free text left out.
const numbers = (value) => (Array.isArray(value) ? value.map(numbers) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, numbers(value[key])])) : typeof value === 'string' ? 'text' : value);

test('the three data files share one shape, the same keys, numbers and dates, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-eight-d');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-eight-d-${lang}`);
    assert.deepEqual(shape(other), shape(en), `${lang}: same shape`);
    const keys = (list) => list.map((item) => item.key);
    assert.deepEqual(keys(other.disciplines), keys(en.disciplines), `${lang}: disciplines`);
    assert.deepEqual(other.disciplines.map((d) => d.code), en.disciplines.map((d) => d.code));
    assert.deepEqual(keys(other.w2h), keys(en.w2h));
    assert.deepEqual(keys(other.isNot), keys(en.isNot));
    assert.deepEqual(keys(other.locations), keys(en.locations));
    assert.deepEqual(keys(other.preventions), keys(en.preventions));
    assert.deepEqual(Object.keys(other.stepStatuses), Object.keys(en.stepStatuses));
    assert.deepEqual(Object.keys(other.actionStatuses), Object.keys(en.actionStatuses));
    assert.deepEqual(other.targets, en.targets);
    assert.equal(other.criteria.length, 6);
    // The example: same dates, quantities, statuses, places and kinds; only the words differ.
    const hard = (ex) => ({ steps: ex.steps, opened: ex.opened, criteria: ex.d0.criteria, eraDate: ex.d0.eraDate,
      d3: ex.d3.actions.map((a) => [a.date, a.where, a.sorted, a.found, a.status]), cleanPoint: ex.d3.cleanPoint,
      d5: ex.d5.actions.map((a) => [a.addresses, a.due, a.verified, a.status]), d6: ex.d6.actions.map((a) => [a.due, a.status]),
      v: [ex.d6.beforeBad, ex.d6.beforeTotal, ex.d6.afterBad, ex.d6.afterTotal, ex.d6.containmentRemoved],
      d7: ex.d7.lines.map((l) => [l.kind, l.due, l.status]), members: ex.d1.members.length });
    assert.deepEqual(hard(other.example), hard(en.example), `${lang}: example numbers`);
    assert.deepEqual(numbers(other.example), numbers(en.example));
    assert.deepEqual(Object.keys(other.fishboneSets), Object.keys(en.fishboneSets));
  }
  // The Fishbone category names of each language are those of the Fishbone tool.
  for (const lang of ['en', 'de', 'sq']) {
    const fish = read(lang === 'en' ? 'src/_data/fishbone.json' : `src/_data/${lang}/fishbone.json`);
    fish.sets.forEach((set) => assert.deepEqual(read(DATA[lang]).fishboneSets[set.key], set.categories, `${lang} ${set.key}`));
  }
});

test('the example loads with its dates moved to recent days and its numbers adding up', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const r = example(lang);
    const M = math();
    assert.equal(r.opened, '2026-09-16', `${lang}: opened 38 days ago`);
    assert.equal(r.steps.d3.date, '2026-09-17');
    assert.equal(r.steps.d6.date, '2026-10-14');
    assert.equal(r.d6.containmentRemoved, '2026-10-14');
    assert.equal(r.d7.lines[1].due, '2026-10-28');
    const c = M.containment(r.d3);
    assert.equal(c.sorted, 2880 + 960 + 4800);
    assert.equal(c.found, 84 + 31 + 144);
    close(c.rate, 259 / 8640, 'share found');
    const v = M.validation(r.d6);
    close(v.before.rate, 0.03, '144 / 4,800 = 3.0 %');
    close(v.after.rate, 0.0009375, '9 / 9,600');
    close(v.reduction, 1 - 0.0009375 / 0.03, 'reduction 96.9 %');
    // Worked to D6: D7 in progress, D8 not started; only the lessons of D8 are missing.
    assert.equal(M.currentStep(r), 'd7');
    const gaps = M.gaps(r);
    assert.deepEqual(plain(Object.fromEntries(Object.entries(gaps).filter(([, list]) => list.length))), { d8: ['lessons'] }, lang);
  }
});

test('days open, to containment and to close, and which target is overdue', () => {
  const M = math();
  const r = example();
  assert.equal(M.daysOpen(r, TODAY), 38);
  assert.equal(M.daysToContainment(r), 1);
  assert.equal(M.daysToClose(r), null, 'not closed');
  const d = Object.fromEntries(M.deadlines(r, M.DEFAULT_TARGETS, TODAY).map((x) => [x.key, x]));
  assert.deepEqual(plain(Object.fromEntries(Object.entries(d).map(([k, x]) => [k, [x.state, x.days, x.due]]))), {
    d3: ['ok', 1, '2026-09-17'], d4: ['ok', 8, '2026-09-26'], d5: ['ok', 13, '2026-09-30'], d6: ['ok', 28, '2026-10-16'], d8: ['open', null, '2026-11-15'],
  });
  assert.equal(d.d8.left, 22);
  assert.deepEqual(plain(M.overdue(r, M.DEFAULT_TARGETS, TODAY)), []);

  // A report of its own: opened 1 Oct, contained on 3 Oct (2 days against 1: late), D4 not done.
  const own = M.cleanReport({ opened: '2026-10-01', steps: { d0: { status: 'done', date: '2026-10-01' }, d3: { status: 'done', date: '2026-10-03' }, d4: { status: 'doing' } } });
  const at = (day) => Object.fromEntries(M.deadlines(own, M.DEFAULT_TARGETS, day).map((x) => [x.key, x]));
  assert.equal(at('2026-10-05').d3.state, 'late');
  assert.equal(M.daysToContainment(own), 2);
  assert.equal(at('2026-10-11').d4.state, 'open', 'on the due date (opened + 10) still in time');
  assert.equal(at('2026-10-11').d4.left, 0);
  assert.equal(at('2026-10-12').d4.state, 'overdue', 'the day after it is overdue');
  assert.equal(at('2026-10-12').d4.left, -1);
  assert.deepEqual(plain(M.overdue(own, M.DEFAULT_TARGETS, '2026-10-12')), ['d4']);
  assert.deepEqual(plain(M.overdue(own, M.DEFAULT_TARGETS, '2026-10-17')), ['d4', 'd5'], 'D5 is due on opened + 14');
  assert.equal(M.currentStep(own), 'd1', 'the first discipline not done');
  // Across the change to winter time (25 Oct 2026) a day is still a day.
  assert.equal(M.daysOpen(own, '2026-10-30'), 29);
  assert.equal(M.daysBetween('2026-10-20', '2026-10-30'), 10);
  // Closed: D8 done on 20 Nov. Days open stop at the closing date, and nothing is overdue any more.
  own.steps.d8 = { status: 'done', date: '2026-11-20' };
  assert.equal(M.isClosed(own), true);
  assert.equal(M.currentStep(own), 'closed');
  assert.equal(M.daysOpen(own, '2026-12-31'), 50);
  assert.equal(M.daysToClose(own), 50);
  assert.deepEqual(plain(M.overdue(own, M.DEFAULT_TARGETS, '2026-12-31')), []);
  assert.equal(Object.fromEntries(M.deadlines(own, M.DEFAULT_TARGETS, '2026-12-31').map((x) => [x.key, x.state])).d8, 'ok', '50 days against 60');
  // Edited target times: containment within 0 days makes the 2-day containment late, a target of 1 day for D4 overdue.
  const tight = M.cleanTargets({ d3: 0, d4: 1, d5: 'x', d6: -3, d8: 60 });
  assert.deepEqual(plain(tight), { d3: 0, d4: 1, d5: 14, d6: 30, d8: 60 }, 'a target that is not a whole number of days falls back to the default');
  // No opening date: no days and no deadlines.
  const undated = M.cleanReport({});
  assert.equal(M.daysOpen(undated, TODAY), null);
  assert.deepEqual(plain(M.overdue(undated, M.DEFAULT_TARGETS, TODAY)), []);
});

test('the overview counts open, closed and overdue reports, the discipline each is in and the averages', () => {
  const M = math();
  const a = example();
  const b = M.cleanReport({ id: 'b', title: 'Late labels', opened: '2026-09-01', steps: { d0: { status: 'done', date: '2026-09-01' }, d1: { status: 'done', date: '2026-09-01' }, d2: { status: 'done', date: '2026-09-02' }, d3: { status: 'done', date: '2026-09-03' } } });
  // c: every discipline done five days after the one before, from 1 Aug: D3 on 16 Aug, D8 on 10 Sept.
  const plus = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 864e5).toISOString().slice(0, 10);
  const c = M.cleanReport({ id: 'c', title: 'Damaged pallets', opened: '2026-08-01', steps: Object.fromEntries(M.STEPS.map((key, i) => [key, { status: 'done', date: plus('2026-08-01', i * 5) }])) });
  const o = M.overview([a, b, c], M.DEFAULT_TARGETS, TODAY);
  assert.equal(o.total, 3);
  assert.equal(o.open, 2);
  assert.equal(o.closed, 1);
  assert.equal(o.overdue, 1, 'only b, with D4, D5, D6 past their dates');
  assert.deepEqual(plain(o.items[1].overdue), ['d4', 'd5', 'd6']);
  assert.equal(o.byStep.d7, 1);
  assert.equal(o.byStep.d4, 1);
  assert.equal(o.byStep.closed, 1);
  // Containment: a 1 day, b 2, c 15, so (1 + 2 + 15) / 3 = 6; closed: only c, after 40 days.
  assert.equal(o.items[2].toContainment, 15);
  assert.equal(o.items[2].toClose, 40);
  assert.equal(o.items[2].age, 40, 'a closed report stops ageing');
  close(o.avgContainment, 6, 'average days to containment');
  close(o.avgClose, 40, 'average days to close');
  assert.equal(o.oldest, 53, 'b is open since 1 Sept');
});

test('5W2H and IS / IS NOT: what complete means', () => {
  const M = math();
  const empty = M.w2hCheck({});
  assert.equal(empty.filled, 0);
  assert.equal(empty.total, 7);
  assert.deepEqual(plain(empty.missing), ['what', 'why', 'where', 'when', 'who', 'how', 'howMany']);
  assert.equal(empty.complete, false);
  const words = { what: 'Wrong item', why: 'Fees', where: 'Route 7', when: 'Since Monday', who: 'Store team', how: 'Receipt audit', howMany: 'a lot' };
  const noNumber = M.w2hCheck(words);
  assert.equal(noNumber.filled, 7);
  assert.equal(noNumber.howManyNumber, false);
  assert.equal(noNumber.complete, false, 'how many needs a number');
  assert.equal(M.w2hCheck({ ...words, howMany: '144 of 4,800 lines' }).complete, true);
  assert.deepEqual(plain(M.w2hCheck({ ...words, where: '   ', howMany: '3 %' }).missing), ['where'], 'blank is missing');

  const t = M.isNotCheck({});
  assert.equal(t.completeRows, 0);
  assert.equal(t.total, 4);
  assert.deepEqual(plain(t.missing), ['what', 'where', 'when', 'extent']);
  const table = {
    what: { is: 'Wrong variant', isNot: 'Missing lines', diff: 'Look-alikes' },
    where: { is: 'Route R7', isNot: 'Route r7 ' },
    when: { is: 'Since re-slotting', isNot: '' },
    extent: { is: '3.0 %', isNot: 'Other routes 0.2 %' },
  };
  const checked = M.isNotCheck(table);
  assert.equal(checked.completeRows, 2, 'what and extent');
  assert.deepEqual(plain(checked.missing), ['where', 'when']);
  assert.deepEqual(plain(checked.same), ['where'], 'IS and IS NOT may not say the same');
  assert.equal(checked.diffs, 1);
  assert.equal(checked.complete, false);
  assert.equal(M.isNotCheck(example().d2.isNot).complete, true);
  assert.equal(M.w2hCheck(example().d2.w).complete, true);
  // D0: all six criteria warrant an 8D.
  const r = example();
  assert.deepEqual(plain(M.criteriaCheck(r)), { met: 6, total: 6, warranted: true });
  r.d0.criteria[3] = false;
  assert.equal(M.criteriaCheck(r).warranted, false);
});

test('every action of D3, D5, D6 and D7 hands over with its owner, date, check and source', () => {
  const M = math();
  const r = example();
  const items = M.allActions(r);
  assert.deepEqual(plain(items.map((i) => i.stage)), ['d3', 'd3', 'd3', 'd5', 'd5', 'd6', 'd6', 'd6', 'd7', 'd7', 'd7', 'd7', 'd7']);
  const d3 = M.actionPayload(r, 'd3', r.d3.actions[0], { heading: 'D3 · Interim containment actions' });
  assert.deepEqual(plain(d3), {
    title: r.d3.actions[0].text, detail: '8D Complaint 2026-118 · Wrong items to the retailer on route R7 · D3 · Interim containment actions',
    owner: 'Jonas B.', due: '2026-09-16', source: 'eight-d', check: r.d3.actions[0].verified, area: 'Outbound, DC North', priority: 'High', status: 'done',
  });
  const d5 = M.actionPayload(r, 'd5', r.d5.actions[1], { heading: 'D5 · Permanent corrective actions', extra: 'Escape point (non-detection)' });
  assert.equal(d5.due, '2026-09-29');
  assert.equal(d5.check, 'Trial: 11 of 11 wrong picks stopped; pick rate −2 %, accepted');
  assert.equal(d5.priority, 'High');
  assert.match(d5.detail, /D5 · Permanent corrective actions · Escape point/);
  const d7 = M.actionPayload(r, 'd7', r.d7.lines[2], { heading: 'D7 · Prevent recurrence', extra: 'Update standard work', check: 'weekly audit' });
  assert.deepEqual(plain([d7.owner, d7.due, d7.priority, d7.status, d7.check]), ['Daniel R.', '2026-11-01', 'Medium', 'open', 'weekly audit']);
  assert.equal(M.actionPayload(r, 'd6', r.d6.actions[0], {}).priority, 'Medium');
});

test('the page: the example on a first visit, the sheet with every discipline, the hand-offs and the exports', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = read(DATA[lang]);
    const key = cfg.storageKey;
    const w = load({ lang });
    const doc = w.document;
    const results = doc.querySelector('[data-results]');
    assert.equal(results.hidden, false, `${lang}: the result shows`);
    assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the example note');
    assert.equal(saved(w, key).reports.length, 1);
    assert.ok(results.querySelectorAll('svg').length >= 2, 'the deadline chart and the overview charts');
    const sheet = results.querySelector('.ed-sheet');
    cfg.disciplines.forEach((d) => assert.ok(sheet.textContent.includes(`${d.code} · ${d.title}`), `${lang}: the sheet has ${d.code}`));
    const text = w.EightDMath.asText(w.EightDMath.cleanReport(saved(w, key).reports[0]));
    cfg.disciplines.forEach((d) => assert.ok(text.includes(`${d.code} · ${d.title}`), `${lang}: the summary has ${d.code}`));
    const bytes = w.EightDMath.wordFile(w.EightDMath.cleanReport(saved(w, key).reports[0]));
    const xml = Buffer.from(bytes).toString('utf8');
    cfg.disciplines.forEach((d) => assert.ok(xml.includes(`${d.code} · ${d.title}`), `${lang}: the Word file has ${d.code}`));
    assert.ok(xml.includes('Heading1'));
    // The form shows the example.
    assert.equal(doc.querySelector('[data-f="d2.statement"]').value, cfg.example.d2.statement);
    assert.equal(doc.querySelectorAll('[data-rows="d3.actions"] .ed-row').length, 3);
    // A row's link to the Action Tracker, in the page's language.
    const link = doc.querySelector('[data-rows="d5.actions"] .ed-handoff');
    link.addEventListener('click', (event) => event.preventDefault()); // jsdom does not navigate
    click(w, link);
    const url = new URL(link.href);
    assert.equal(url.pathname, `${lang === 'en' ? '' : `/${lang}`}/tools/action-tracker/`);
    assert.equal(url.searchParams.get('source'), 'eight-d');
    assert.equal(url.searchParams.get('action'), cfg.example.d5.actions[0].text);
    assert.equal(url.searchParams.get('due'), '2026-09-27');
    assert.equal(url.searchParams.get('priority'), 'High');
    // All actions at once, once.
    const sendButton = () => [...doc.querySelectorAll('[data-results] .result-actions button')].find((b) => b.textContent === 'Send all actions to the Action Tracker');
    click(w, sendButton());
    const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
    assert.equal(actions.length, 13, `${lang}: 13 actions`);
    assert.ok(actions.every((a) => a.source === 'eight-d'));
    assert.equal(actions.filter((a) => a.status === 'done').length, 10);
    assert.equal(actions.filter((a) => a.priority === 'High').length, 5, 'containment and corrective actions');
    click(w, sendButton());
    assert.equal(JSON.parse(w.localStorage.getItem('sc-actions')).rows.length, 13, 'not twice');
    // The overview as CSV rows, header first.
    const rows = w.EightDMath.overviewRows();
    assert.equal(rows.length, 2);
    assert.equal(rows[1][6], 38);
    assert.equal(rows[1][7], 1);
    assert.equal(rows[1][5], 'D7');
  }
});

test('editing: a discipline marked done gets today, the example becomes the visitor\'s own, a new report starts with D7', () => {
  const w = load();
  const doc = w.document;
  type(w, doc.querySelector('[data-f="steps.d7.status"]'), 'done');
  const r = saved(w).reports[0];
  assert.equal(r.steps.d7.status, 'done');
  assert.equal(r.steps.d7.date, TODAY, 'the date of the day');
  assert.equal(doc.querySelector('[data-f="steps.d7.date"]').value, TODAY);
  assert.equal(saved(w).example, '', 'an edit makes the example the visitor\'s own');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  type(w, doc.querySelector('[data-f="d0.criteria.2"]'), false);
  assert.equal(saved(w).reports[0].d0.criteria[2], false);
  type(w, doc.querySelector('[data-f="d2.isNot.where.isNot"]'), 'Somewhere else');
  assert.equal(saved(w).reports[0].d2.isNot.where.isNot, 'Somewhere else');
  // D8 done closes the report.
  type(w, doc.querySelector('[data-f="steps.d8.status"]'), 'done');
  assert.match(doc.querySelector('[data-results] .result-head').textContent, /Closed after 38 days/);
  // A row typed into the containment list.
  click(w, doc.querySelector('[data-add="d3.actions"]'));
  const rows = doc.querySelectorAll('[data-rows="d3.actions"] .ed-row');
  assert.equal(rows.length, 4);
  type(w, rows[3].querySelector('[data-k="sorted"]'), '1.200');
  assert.equal(saved(w).reports[0].d3.actions[3].sorted, '1.200');
  // A new report: opened today, D7 with the five systems to change.
  click(w, doc.querySelector('[data-new]'));
  const fresh = saved(w).reports[0];
  assert.equal(fresh.opened, TODAY);
  assert.deepEqual(plain(fresh.d7.lines.map((l) => l.kind)), ['fmea', 'controlPlan', 'standardWork', 'training', 'readAcross']);
  assert.equal(saved(w).reports.length, 2);
  // Target times are kept with the reports.
  const target = doc.querySelector('[data-target="d3"]');
  type(w, target, '2');
  assert.equal(saved(w).targets.d3, 2);
});

test('5 Whys and Fishbone are offered as text for D4 when this browser has them, and are never written', () => {
  const whys = { problem: 'Wrong items on R7', why1: 'Wrong variant picked', why2: 'Look-alike in the next slot', why3: '', cause: 'No slotting rule for look-alikes', action: 'Add the rule' };
  const fish = { current: 'f2', diagrams: [
    { id: 'f1', effect: 'Other', set: '6m', causes: [[{ text: 'x' }]] },
    { id: 'f2', effect: 'Wrong items', set: '6m', causes: [[], [], [{ text: 'No look-alike rule', likely: true, votes: 3, subs: ['Slotting by speed only'] }, { text: 'Rushed re-slotting', votes: 1 }], [{ text: 'Same label colour' }], [], [], [{ text: 'Hidden in a 7th bone' }]] },
  ] };
  const M = math();
  assert.equal(M.whysText(whys), 'Problem: Wrong items on R7\nWhy 1: Wrong variant picked\nWhy 2: Look-alike in the next slot\nRoot cause: No slotting rule for look-alikes\nCountermeasure: Add the rule');
  assert.equal(M.whysText({}), '');
  const sets = read(DATA.en).fishboneSets;
  assert.equal(M.fishboneText(fish, sets), 'Effect: Wrong items\nMethod: No look-alike rule (likely, 3 votes): Slotting by speed only · Rushed re-slotting (1 vote)\nMaterial: Same label colour');
  assert.equal(M.fishboneText({ diagrams: [] }, sets), '');

  const empty = load({ storage: { 'sc-eight-d': { reports: [] } } });
  assert.equal(empty.document.querySelector('[data-from-whys]').hidden, true, 'nothing to take: no button');
  assert.equal(empty.document.querySelector('[data-from-fishbone]').hidden, true);
  assert.equal(empty.document.querySelector('[data-results]').hidden, true, 'no report, no result');

  const w = load({ storage: { 'sc-five-whys': whys, 'sc-fishbone': fish } });
  const before = [w.localStorage.getItem('sc-five-whys'), w.localStorage.getItem('sc-fishbone')];
  const whysButton = w.document.querySelector('[data-from-whys]');
  assert.equal(whysButton.hidden, false);
  click(w, whysButton);
  click(w, w.document.querySelector('[data-from-fishbone]'));
  const notes = saved(w).reports[0].d4.notes;
  assert.ok(notes.includes('5 Whys:\nProblem: Wrong items on R7'), notes);
  assert.ok(notes.includes('Fishbone:\nEffect: Wrong items'));
  assert.equal(w.document.querySelector('[data-f="d4.notes"]').value, notes);
  click(w, whysButton);
  assert.equal(saved(w).reports[0].d4.notes, notes, 'not twice');
  assert.deepEqual([w.localStorage.getItem('sc-five-whys'), w.localStorage.getItem('sc-fishbone')], before, 'their keys are untouched');
  // The German page reads the German worksheet only.
  const de = load({ lang: 'de', storage: { 'sc-five-whys': whys } });
  assert.equal(de.document.querySelector('[data-from-whys]').hidden, true);
});

test('a damaged save loads without breaking, and the links keep the language', () => {
  const w = load({ storage: { 'sc-eight-d': { reports: [null, 7, { steps: { d3: { status: 'weird', date: 'yesterday' } }, d3: { actions: 'no' }, d7: { lines: [{ kind: 'fmea', text: 'x', status: 'nope' }] } }], targets: { d3: 'soon' } } } });
  assert.equal(w.document.querySelectorAll('.ed-item').length, 1, 'only the report with a shape is listed');
  // The first edit writes the cleaned state back.
  type(w, w.document.querySelector('[data-f="title"]'), 'Recovered');
  const r = saved(w).reports;
  assert.equal(r.length, 1);
  assert.equal(r[0].title, 'Recovered');
  assert.equal(r[0].steps.d3.status, 'todo');
  assert.equal(r[0].steps.d3.date, '');
  assert.deepEqual(plain(r[0].d3.actions), []);
  assert.equal(r[0].d7.lines[0].status, 'open');
  assert.equal(saved(w).targets.d3, 1);
  for (const lang of ['de', 'sq']) {
    const page = load({ lang });
    const hrefs = [...page.document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href'));
    assert.ok(hrefs.length >= 5);
    hrefs.forEach((href) => assert.ok(href.startsWith(`/${lang}/tools/`), `${lang}: ${href}`));
  }
  // A problem handed over by another tool opens a new report on it.
  const handed = load({ search: '?problem=Labels%20missing%20on%20route%203' });
  assert.equal(saved(handed).reports[0].title, 'Labels missing on route 3');
  assert.equal(handed.location.search, '');
});
