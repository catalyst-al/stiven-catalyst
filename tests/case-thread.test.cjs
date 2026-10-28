// The case thread (Phase 3 pilot): one investigation of the CX Control Tower followed from the problem to the KPI
// verified before and after. The engine's rules (src/js/cx-tower.js: caseRows, afterWindow, verdict, caseToTracker,
// applyWhys), then the whole flow on the pages in jsdom: the tower creates the case and its action in the Action
// Tracker (js/actions-store.js, caseId), the tracker marks it done, the tower measures the same failure before and
// after the change on the same rows and closes or reopens, the 5 Whys worksheet carries the case id and sends its
// whys back. Every row is the example station's, invented.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const engine = () => {
  const context = {
    window: {},
    document: { documentElement: { lang: 'en' }, querySelector: () => null, getElementById: () => null, currentScript: null },
    TextEncoder, TextDecoder, Blob, Response, DecompressionStream, URL, Intl,
  };
  for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'cx-tower']) vm.runInNewContext(fs.readFileSync(`src/js/${file}.js`, 'utf8'), context);
  return context.window.CxTower;
};
const C = engine();
const ALL = new Set(C.FIELDS.deliveries);
const SETTINGS = { lateMinutes: 5, minSample: 50, loadingTarget: 20 };
const metric = (id) => C.DEEP.find((m) => m.id === id);
const EX = C.example('2026-09-27');

test('the verdict: effective needs enough rows after and fewer failures; not enough rows is no verdict', () => {
  const before = { k: 40, n: 3375, rate: 40 / 3375 };
  assert.equal(C.verdict({ before, after: { k: 13, n: 3388, rate: 13 / 3388 }, minN: 50 }).status, 'effective');
  assert.equal(C.verdict({ before, after: { k: 78, n: 3388, rate: 78 / 3388 }, minN: 50 }).status, 'not-effective');
  assert.equal(C.verdict({ before, after: { k: 40, n: 3388, rate: 40 / 3388 }, minN: 50 }).better, true, 'the same count on more rows is a lower rate');
  const few = C.verdict({ before, after: { k: 0, n: 20, rate: 0 }, minN: 50 });
  assert.deepEqual([few.status, few.enough, few.better], ['insufficient', false, true]);
  assert.equal(C.verdict({ before, after: null, minN: 50 }).status, 'insufficient');
  assert.equal(C.verdict({ before: { k: 0, n: 0, rate: null }, after: { k: 1, n: 100, rate: 0.01 }, minN: 50 }).status, 'insufficient', 'no before, no verdict');
  // With an approved maximum, fewer failures is not enough: the rate must sit within it.
  assert.equal(C.verdict({ before, after: { k: 30, n: 3000, rate: 0.01 }, target: 0.008, minN: 50 }).status, 'not-effective');
  assert.equal(C.verdict({ before, after: { k: 21, n: 3000, rate: 0.007 }, target: 0.008, minN: 50 }).status, 'effective');
  assert.equal(C.verdict({ before, after: { k: 40, n: 3375, rate: 40 / 3375 }, minN: 50 }).status, 'not-effective', 'unchanged is not effective');
});

test('the after window and the rows of a case: the same partner, shift, zone and segment, inside the dates', () => {
  assert.deepEqual(plain(C.afterWindow('2026-09-14', '2026-09-27')), { from: '2026-09-14', to: '2026-09-27', days: 14 });
  assert.equal(C.afterWindow('2026-09-28', '2026-09-27'), null, 'nothing after the last day');
  assert.equal(C.afterWindow('', '2026-09-27'), null);
  const snapshot = { DSP: 'DSP B', Shift: 'PM', Zone: '', dim: 'Zone', segment: 'North', from: '2026-08-31', to: '2026-09-13' };
  const rows = C.caseRows(EX.deliveries, snapshot, '2026-08-31', '2026-09-13');
  assert.ok(rows.length > 0);
  assert.ok(rows.every((row) => row.DSP === 'DSP B' && row.Shift === 'PM' && row.Zone === 'North' && row.Date >= '2026-08-31' && row.Date <= '2026-09-13'));
  assert.equal(rows.length, EX.deliveries.filter((row) => row.DSP === 'DSP B' && row.Shift === 'PM' && row.Zone === 'North' && row.Date >= '2026-08-31' && row.Date <= '2026-09-13').length);
  const everything = C.caseRows(EX.deliveries, { DSP: '', Shift: '', Zone: '', dim: 'DSP', segment: '' }, '', '');
  assert.equal(everything.length, EX.deliveries.length, 'no filters, no segment: every dated row');
  // By week: the segment is the ISO week of the row.
  const week = C.caseRows(EX.deliveries, { DSP: '', Shift: '', Zone: '', dim: 'Week', segment: '2026-W37' }, '', '');
  assert.ok(week.length > 0 && week.every((row) => C.isoWeek(row.Date) === '2026-W37'));
});

test('the example station: damage falls after the countermeasure, late deliveries do not', () => {
  const snapshot = { DSP: '', Shift: '', Zone: '', dim: 'DSP', segment: '', from: '2026-08-31', to: '2026-09-13' };
  const window = C.afterWindow('2026-09-14', '2026-09-26');
  const measure = (id) => {
    const m = metric(id);
    const before = C.deepAggregate(C.caseRows(EX.deliveries, snapshot, snapshot.from, snapshot.to), m, SETTINGS, ALL);
    const after = C.deepAggregate(C.caseRows(EX.deliveries, snapshot, window.from, window.to), m, SETTINGS, ALL);
    return { before, after, verdict: C.verdict({ before, after, minN: 50 }) };
  };
  const damage = measure('damage');
  assert.equal(damage.verdict.status, 'effective');
  assert.ok(damage.after.rate < damage.before.rate / 2, `${damage.before.rate} → ${damage.after.rate}`);
  assert.equal(measure('late').verdict.status, 'not-effective');
});

test('the case as an action of the tracker, and the whys a worksheet sends back', () => {
  const draft = { title: 'Damage on DSP B', problem: 'Damaged parcels on DSP B', rootStatus: 'Hypothesis', root: 'Heavy bags on light ones', corrective: 'Heavy-first loading sequence', owner: 'Shift Leader', deadline: '2026-09-13', verifyMetric: 'Damage rate', where: 'Loading' };
  const action = C.caseToTracker(draft, 'INV-20261028-001', { problem: 'Problem', hypothesis: 'Working hypothesis, not verified' });
  assert.deepEqual(plain(action), { title: 'Heavy-first loading sequence', detail: 'Problem: Damaged parcels on DSP B\nWorking hypothesis, not verified: Heavy bags on light ones', owner: 'Shift Leader', due: '2026-09-13', source: 'cx-control-tower', check: 'Damage rate', area: 'Loading', priority: 'High', caseId: 'INV-20261028-001' });
  assert.equal(C.caseToTracker({ ...draft, rootStatus: 'Verified' }, 'I', { root: 'Ursache' }).detail.split('\n')[1], 'Ursache: Heavy bags on light ones');
  assert.equal(C.caseToTracker({ ...draft, verifyMetric: '' }, 'I', { check: 'Quote vorher/nachher' }).check, 'Quote vorher/nachher');
  const merged = C.applyWhys({ title: 'T', why1: 'already here', root: '' }, { why1: 'other', why2: 'bags staged late', root: 'no sequence', problem: '' });
  assert.deepEqual(plain(merged), { draft: { title: 'T', why1: 'already here', root: 'no sequence', why2: 'bags staged late' }, filled: ['why2', 'root'], kept: ['why1'] });
  assert.deepEqual(plain(C.applyWhys({ why1: 'same' }, { why1: 'same' })), { draft: { why1: 'same' }, filled: [], kept: [] }, 'the same text is neither filled nor a conflict');
});

// ---------- The pages ----------
const cfg = fs.readFileSync('src/_data/cxTower.json', 'utf8');
const towerHtml = `<html lang="en"><body><div data-cx class="cx"><p data-cx-example-flag hidden></p><p data-cx-note></p>
  <div data-cx-filters hidden><input data-cx-filter="from" type="date"><input data-cx-filter="to" type="date"><select data-cx-filter="DSP"></select><select data-cx-filter="Shift"></select><select data-cx-filter="Zone"></select><button data-cx-reset-filters type="button"></button></div>
  <div data-cx-tabs></div><div data-cx-body id="cx-panel"></div></div><script type="application/json" id="cx-data">${cfg}</script></body></html>`;
// The tower's page, with the actions store the built page loads before it; `storage` seeds the browser (a reload).
const tower = ({ storage = {}, search = '', now = '2026-10-28T10:00:00Z' } = {}) => {
  const dom = new JSDOM(towerHtml, { url: `https://example.test/tools/cx-control-tower/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.URL.createObjectURL = () => 'blob:x';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, value));
  for (const file of ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'actions-store', 'cx-tower']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const body = w.document.querySelector('[data-cx-body]');
  const click = (node) => node.dispatchEvent(new w.Event('click', { bubbles: true }));
  const field = (name) => body.querySelector(`#cx-case-${name}`);
  const type = (name, value) => { const node = field(name); node.value = value; node.dispatchEvent(new w.Event(node.tagName === 'SELECT' || node.type === 'date' ? 'change' : 'input', { bubbles: true })); };
  const button = (text) => [...body.querySelectorAll('button')].find((b) => b.textContent === text);
  const filter = (key, value) => { const node = w.document.querySelector(`[data-cx-filter="${key}"]`); node.value = value; node.dispatchEvent(new w.Event('change', { bubbles: true })); };
  const stored = () => { w.dispatchEvent(new w.Event('pagehide')); return JSON.parse(w.localStorage.getItem('sc-cx-tower')); };
  const all = () => { w.dispatchEvent(new w.Event('pagehide')); const out = {}; for (let i = 0; i < w.localStorage.length; i++) { const key = w.localStorage.key(i); out[key] = w.localStorage.getItem(key); } return out; };
  const tab = (id) => click(w.document.querySelector(`[data-tab="${id}"]`));
  const note = () => body.querySelector('.cx-case-note').textContent;
  const deepMetric = (id) => { const select = body.querySelector('#cx-deep-metric'); select.value = id; select.dispatchEvent(new w.Event('change', { bubbles: true })); };
  return { w, body, click, field, type, button, filter, stored, all, tab, note, deepMetric, S: w.ActionsStore };
};
// The whole flow needs the example (a first visit opens on it), the deep dive on one failure, a before period.
const startCase = (t, id, title) => {
  t.tab('deep');
  t.deepMetric(id);
  t.filter('from', '2026-08-31');
  t.filter('to', '2026-09-13');
  t.click(t.button('New investigation'));
  t.type('title', title);
  t.type('problem', `${title}: too many on the evening wave`);
  t.type('evidence', 'Deliveries table, 31 Aug – 13 Sep, every row traceable');
  t.type('rootStatus', 'Verified');
  t.type('root', 'No loading sequence standard');
  t.type('corrective', 'Heavy-first loading sequence with marked shelf zones');
  t.type('owner', 'Shift Leader');
  t.type('deadline', '2026-09-13');
  t.type('verifyMetric', 'Failure rate before and after');
};

test('the flow on the tower page: case → action in the tracker (once) → done → before/after on the same rows → closed as verified effective', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  let state = t.stored();
  const row = state.cases[0];
  assert.match(row.id, /^INV-20261028-001$/);
  assert.deepEqual([row.snapshot.metric, row.snapshot.from, row.snapshot.to], ['damage', '2026-08-31', '2026-09-13']);
  // The action: once in the station's register, once in the tracker, both carrying the case.
  assert.equal(row.actionId, 'ACT006');
  const actions = t.S.list();
  assert.equal(actions.length, 1);
  assert.deepEqual([actions[0].caseId, actions[0].title, actions[0].owner, actions[0].due, actions[0].source, actions[0].status], [row.id, 'Heavy-first loading sequence with marked shelf zones', 'Shift Leader', '2026-09-13', 'cx-control-tower', 'open']);
  assert.equal(row.trackerId, actions[0].id);
  assert.deepEqual(plain(t.S.forCase(row.id).map((a) => a.id)), [actions[0].id]);
  assert.match(t.note(), /added to the Action Tracker/);
  // A second click adds nothing anywhere.
  t.click(t.button('Create the linked action'));
  assert.equal(t.S.list().length, 1);
  assert.equal(t.stored().tables.actions.rows.length, state.tables.actions.rows.length);
  // The verification box: no close before the action is done.
  assert.ok(t.body.querySelector('[data-cx-verify]'));
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /not done yet/);
  assert.equal(t.stored().cases[0].status, 'Open');
  // The owner marks it done in the tracker (another page, same browser): the stage follows by itself.
  assert.ok(t.S.update(actions[0].id, { status: 'done', result: 'Sequence in place since 14 Sep' }));
  t.tab('actions');
  t.tab('deep');
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  assert.equal(t.field('status').value, 'Verification pending');
  // The day the change took effect: the after window starts there; the tracker's closing day is only a default.
  const from = t.body.querySelector('#cx-verify-from');
  assert.equal(from.value, '2026-10-28', 'defaults to the day the action closed');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'insufficient', 'nothing after 28 Oct in the example');
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /No rows after the change yet/);
  from.value = '2026-09-14';
  from.dispatchEvent(new t.w.Event('change', { bubbles: true }));
  // The numbers are the engine's on the same rows: before 31 Aug – 13 Sep, after 14 – 26 Sep, all partners.
  const snapshot = { DSP: '', Shift: '', Zone: '', dim: 'DSP', segment: '' };
  const before = C.deepAggregate(C.caseRows(EX.deliveries, snapshot, '2026-08-31', '2026-09-13'), metric('damage'), SETTINGS, ALL);
  const after = C.deepAggregate(C.caseRows(EX.deliveries, snapshot, '2026-09-14', '2026-09-26'), metric('damage'), SETTINGS, ALL);
  const text = t.body.querySelector('[data-cx-verify]').textContent;
  assert.ok(text.includes(`${before.k} / ${before.n.toLocaleString('en-GB')} eligible`), `before in ${text}`);
  assert.ok(text.includes(`${after.k} / ${after.n.toLocaleString('en-GB')} eligible`), 'after');
  const d = (iso) => t.w.ToolKit.showDate(iso);
  assert.ok(text.includes(`${d('2026-09-14')} – ${d('2026-09-26')}`), 'the after window named');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'effective');
  // Without written evidence there is no close, verdict or not.
  const evidence = t.field('evidence').value;
  t.type('evidence', '');
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /needs a root cause verified/);
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  t.type('evidence', evidence);
  t.click(t.body.querySelector('[data-cx-close]'));
  state = t.stored();
  const closed = state.cases[0];
  assert.equal(closed.status, 'Verified effective');
  assert.deepEqual([closed.verification.status, closed.verification.decided, closed.verification.before.k, closed.verification.before.n, closed.verification.after.k, closed.verification.after.n, closed.verification.after.from, closed.verification.after.to], ['effective', '2026-10-28', before.k, before.n, after.k, after.n, '2026-09-14', '2026-09-26']);
  assert.ok(closed.verifyResult.startsWith(`Before ${d('2026-08-31')} – ${d('2026-09-13')}: ${before.k} / ${before.n.toLocaleString('en-GB')}`) && closed.verifyResult.includes(`→ After ${d('2026-09-14')} – ${d('2026-09-26')}: ${after.k} / ${after.n.toLocaleString('en-GB')}`) && closed.verifyResult.endsWith('Verified effective.'), closed.verifyResult);
  // The tracker's action is verified with the same numbers as its result; the register row says effective.
  const verified = t.S.list()[0];
  assert.deepEqual([verified.status, verified.closed], ['verified', '2026-10-28']);
  assert.equal(verified.result, closed.verification.text);
  const fields = state.tables.actions.fields;
  const register = Object.fromEntries(fields.map((f, i) => [f, state.tables.actions.rows[state.tables.actions.rows.length - 1][i]]));
  assert.deepEqual([register.Action_ID, register.Status, register.Verification_Status], ['ACT006', 'Completed', 'Effective']);
  assert.ok(register.Baseline && register.Result && register.Baseline !== register.Result);
  // Reloaded: the case, its verification and the link to the tracker's action are what was saved.
  const again = tower({ storage: t.all() });
  again.tab('deep');
  const kept = again.stored().cases[0];
  assert.deepEqual([kept.id, kept.status, kept.trackerId, kept.verifyFrom, kept.verification.status], [closed.id, 'Verified effective', verified.id, '2026-09-14', 'effective']);
  assert.ok(again.body.querySelector('.cx-decided.is-effective').textContent.includes(`Decided ${again.w.ToolKit.showDate('2026-10-28')}`));
  assert.equal(again.S.forCase(kept.id)[0].status, 'verified');
});

test('not effective: the case is reopened, the action stays done with the result, and the next action joins the same case', () => {
  const t = tower();
  startCase(t, 'late', 'Late deliveries on the evening wave');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  const first = t.S.forCase(id)[0];
  t.S.update(first.id, { status: 'done' });
  t.tab('actions');
  t.tab('deep');
  const from = t.body.querySelector('#cx-verify-from');
  from.value = '2026-09-14';
  from.dispatchEvent(new t.w.Event('change', { bubbles: true }));
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'not-effective');
  // Closing as effective is refused by the numbers; reopening is recorded.
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /Not effective: the failure rate did not fall/);
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  t.click(t.body.querySelector('[data-cx-reopen]'));
  let row = t.stored().cases[0];
  assert.deepEqual([row.status, row.verification.status], ['Reopened', 'not-effective']);
  const done = t.S.forCase(id)[0];
  assert.deepEqual([done.status, done.result.includes('Not effective')], ['done', true]);
  const fields = t.stored().tables.actions.fields;
  const register = t.stored().tables.actions.rows.map((cells) => Object.fromEntries(fields.map((f, i) => [f, cells[i]]))).find((a) => a.Action_ID === row.actionId);
  assert.equal(register.Verification_Status, 'Not effective');
  // A new countermeasure for the same case: a second action with the same case id, the first untouched.
  t.type('corrective', 'Wave start moved 15 minutes earlier, loading finished before the drivers arrive');
  t.click(t.button('Create the linked action'));
  row = t.stored().cases[0];
  assert.deepEqual([row.status, row.verification, row.verifyFrom], ['Investigating', null, '']);
  const actions = t.S.forCase(id);
  assert.equal(actions.length, 2);
  assert.deepEqual(plain(actions.map((a) => a.status)), ['done', 'open']);
  assert.notEqual(row.actionId, 'ACT006');
  assert.equal(row.trackerId, actions[1].id);
  assert.equal(t.S.list().length, 2, 'nothing duplicated');
});

test('too few rows after the change is no verdict; an action done only in the register also counts; the tracker refuses verified without a result', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage, small sample');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  t.S.update(t.S.forCase(id)[0].id, { status: 'done' });
  t.tab('actions');
  t.tab('deep');
  // A sample floor the after window cannot reach.
  const min = t.body.querySelector('#cx-deep-min');
  min.value = '5000';
  min.dispatchEvent(new t.w.Event('change', { bubbles: true }));
  const from = t.body.querySelector('#cx-verify-from');
  from.value = '2026-09-14';
  from.dispatchEvent(new t.w.Event('change', { bubbles: true }));
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'insufficient');
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /Too few eligible rows after the change/);
  t.click(t.body.querySelector('[data-cx-reopen]'));
  assert.match(t.note(), /Too few eligible rows after the change/);
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  // The store itself: verified needs a result, whoever asks.
  const action = t.S.forCase(id)[0];
  assert.equal(t.S.update(action.id, { status: 'verified' }), null);
  assert.equal(t.S.lastUpdate, 'needs-result');
  assert.equal(t.S.list()[0].status, 'done');
  assert.equal(t.S.update(action.id, { status: 'verified', result: 'Damage rate 0.4% in the two weeks after' }).status, 'verified');
});

test('the address opens a case and fills its empty whys from 5 Whys; an unknown case is said', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on DSP B');
  t.type('why1', 'Heavy bags on top');
  t.click(t.button('Save the investigation'));
  const id = t.stored().cases[0].id;
  const storage = t.all();
  const search = `?case=${id}&problem=${encodeURIComponent('Damage on DSP B: 1.2%')}&why1=${encodeURIComponent('Other first why')}&why2=${encodeURIComponent('No loading sequence')}&why3=${encodeURIComponent('Standard never written')}&root=${encodeURIComponent('No loading standard for heavy items')}&utm=keep`;
  const again = tower({ storage, search });
  const state = again.stored();
  assert.equal(state.tab, 'deep');
  assert.equal(state.caseId, id);
  const row = state.cases[0];
  assert.deepEqual([row.why1, row.why2, row.why3, row.root], ['Heavy bags on top', 'No loading sequence', 'Standard never written', 'No loading sequence standard'], 'empty whys filled; the why and the root already written are kept');
  assert.equal(row.problem, 'Damage on DSP B: too many on the evening wave', 'the problem already written is kept');
  assert.equal(again.field('why2').value, 'No loading sequence');
  assert.match(again.w.document.querySelector('[data-cx-note]').textContent, /2 fields filled from 5 Whys.*3 fields already written here were kept/);
  assert.equal(again.w.location.search, '?utm=keep', 'the address is cleaned, the rest stays');
  const missing = tower({ storage, search: '?case=INV-20991231-009' });
  assert.match(missing.w.document.querySelector('[data-cx-note]').textContent, /INV-20991231-009 is not in this browser/);
  assert.equal(missing.w.location.search, '');
});

const built = fs.existsSync('_site/tools/five-whys/index.html') && fs.existsSync('_site/tools/action-tracker/index.html');
test('5 Whys carries the case id and sends the whys back; the tracker names the investigation', { skip: !built && 'run npm run build first' }, () => {
  const { openTool, type: typeIn, click: clickIn } = require('./helpers/tool-page.cjs');
  const whys = openTool('five-whys', { search: `?problem=${encodeURIComponent('Damage on DSP B')}&case=INV-20261028-001` });
  const form = whys.document.querySelector('[data-worksheet]');
  assert.equal(form.elements.problem.value, 'Damage on DSP B');
  assert.equal(form.elements.case.value, 'INV-20261028-001');
  assert.equal(whys.location.search, '', 'the address is cleaned');
  const box = form.querySelector('[data-case]');
  assert.equal(box.hidden, false);
  assert.match(box.textContent, /Investigation INV-20261028-001 of the CX Control Tower/);
  typeIn(whys, form.elements.why1, 'Heavy bags on light ones');
  typeIn(whys, form.elements.why2, 'No loading sequence');
  typeIn(whys, form.elements.cause, 'No standard for heavy items');
  const back = new URL(form.querySelector('[data-case-back]').href);
  assert.equal(back.pathname, '/tools/cx-control-tower/');
  assert.deepEqual([back.searchParams.get('case'), back.searchParams.get('problem'), back.searchParams.get('why1'), back.searchParams.get('why2'), back.searchParams.get('why3'), back.searchParams.get('root')], ['INV-20261028-001', 'Damage on DSP B', 'Heavy bags on light ones', 'No loading sequence', null, 'No standard for heavy items']);
  // Saved with the worksheet, so a reload keeps the thread; cleared with it.
  assert.equal(JSON.parse(whys.localStorage.getItem('sc-five-whys')).case, 'INV-20261028-001');
  const reopened = openTool('five-whys', { storage: { 'sc-five-whys': whys.localStorage.getItem('sc-five-whys') } });
  assert.equal(reopened.document.querySelector('[data-worksheet]').elements.case.value, 'INV-20261028-001');
  clickIn(reopened, reopened.document.querySelector('[data-clear]'));
  assert.equal(reopened.document.querySelector('[data-case]').hidden, true);
  // A worksheet already written on another problem is not taken over by a case link; it is asked (confirm) and, kept, keeps no case.
  const busy = openTool('five-whys', { storage: { 'sc-five-whys': JSON.stringify({ problem: 'Another problem', why1: 'x' }) }, search: '?problem=Third&case=INV-1', before: (w) => { w.confirm = () => false; } });
  assert.equal(busy.document.querySelector('[data-worksheet]').elements.case.value, '');
  // The tracker: the action of a case shows the investigation with a link to it, and "verified" waits for a result.
  const tracker = openTool('action-tracker', { storage: { 'sc-actions': JSON.stringify({ rows: [{ id: 'a1', title: 'Heavy-first loading sequence', owner: 'Shift Leader', due: '2026-09-13', source: 'cx-control-tower', status: 'open', caseId: 'INV-20261028-001', created: '2026-09-01' }] }) } });
  const item = tracker.document.querySelector('.at-item');
  const caseLink = item.querySelector('.at-case a');
  assert.equal(caseLink.textContent, 'Investigation INV-20261028-001');
  assert.equal(new URL(caseLink.href).search, '?case=INV-20261028-001');
  const select = item.querySelector('select');
  select.value = 'verified';
  select.dispatchEvent(new tracker.Event('change', { bubbles: true }));
  assert.equal(tracker.ActionsStore.list()[0].status, 'open');
  assert.ok(tracker.document.querySelector('.at-pending'));
  // The hand-off address carries the case, and the tracker reads it back.
  const link = new URL(tracker.ActionsStore.link({ title: 'T', source: 'cx-control-tower', caseId: 'INV-7' }));
  assert.equal(link.searchParams.get('case'), 'INV-7');
  const fresh = openTool('action-tracker', { search: '?action=Walk%20the%20ramp&source=cx-control-tower&case=INV-7' });
  assert.equal(fresh.ActionsStore.list().find((a) => a.title === 'Walk the ramp').caseId, 'INV-7');
});
