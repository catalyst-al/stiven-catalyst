// The operational tools, as the audit of 28 November 2026 found them (docs/audits/full-platform-audit.md, TL-01 to
// TL-08): each case failed on the scripts before it. The pages are the built ones (npm run build first), driven in
// jsdom through tests/helpers/tool-page.cjs; every name, room and complaint is fictional.
//   TL-01  a tool counted another tool's example as the visitor's own figures (four readers)
//   TL-02  the same paste imported twice doubled Lost & Found and Guest Complaints
//   TL-03  a filter on a value that no longer exists hid the whole list while the select said "All"
//   TL-04  a new complaint or found item was stamped with the minute the page was opened
//   TL-05  a second tap on Save logged a maintenance task done twice
//   TL-06  a second tap on Add logged a phantom entry of one unit in the floor logs
//   TL-07  the Action Tracker said "Added." when nothing was added, and dropped an edit without a word
//   TL-08  a handover opened on a page in another language lost its shift and its priorities
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const page = require('./helpers/tool-page.cjs');

// Every page opened here is closed at the end: some keep a timer running (a clock, an idle sync), and the run would
// wait for it.
const opened = [];
const H = { ...page, openTool: (...args) => { const w = page.openTool(...args); opened.push(w); return w; } };
after(() => opened.forEach((w) => w.close()));

const ROOT = path.join(__dirname, '..');
const built = fs.existsSync(path.join(ROOT, '_site', 'tools', 'action-tracker', 'index.html'));
const NOW = '2026-10-25T11:00:00Z';
const text = (node) => node.textContent.replace(/\s+/g, ' ').trim();
const change = (w, node) => node.dispatchEvent(new w.Event('change', { bubbles: true }));
// The page's clock moved on, as tool-page.cjs fixes it.
const setClock = (w, now) => w.eval(`(() => { const Real = Object.getPrototypeOf(Date); const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);

test('TL-01: Guest Complaints does not take the Hotel KPIs example for the hotel\'s room nights', { skip: !built }, async () => {
  const k = H.openTool('hotel-kpis', { now: NOW });
  await H.settle(k, 60);
  H.click(k, k.document.querySelector('[data-results] [data-month]'));
  await H.settle(k, 60);
  const kpis = H.keep(k)['sc-hotel-kpis'];
  assert.equal(kpis.example.on, true, 'one tap in the example saves it, marked as the example');
  const row = (id, date, room) => ({ id, date, time: '09:00', room, channel: 'desk', category: 'noise', severity: 'minor', what: 'Loud', guest: '', takenBy: 'A', learn: [], action: '', comp: 'none', value: 0, resolvedDate: '', resolvedTime: '', followUp: '', steps: [] });
  const g = H.openTool('guest-complaints', { now: NOW, storage: { 'sc-hotel-kpis': kpis, 'sc-guest-complaints': { rows: [row('GC-261020-AAA', '2026-10-20', '214'), row('GC-261022-AAB', '2026-10-22', '215')] } } });
  await H.settle(g, 60);
  const results = text(g.document.querySelector('[data-results]'));
  assert.doesNotMatch(results, /room nights from Hotel KPIs/);
  assert.match(results, /Enter the occupied room nights of the period, or fill in Hotel KPIs/);
});

test('TL-01: the Housekeeping Planner does not plan from the example board of Room Status', { skip: !built }, async () => {
  const r = H.openTool('room-status', { now: NOW });
  await H.settle(r, 60);
  H.click(r, r.document.querySelector('[data-room]'));
  await H.settle(r, 30);
  const status = [...r.document.querySelectorAll("input[name='rs-status']")].find((input) => !input.checked);
  status.checked = true;
  change(r, status);
  await H.settle(r, 60);
  const board = H.keep(r)['sc-room-status'];
  assert.equal(board.example, true);
  assert.ok(board.rooms.length > 0);
  const h = H.openTool('housekeeping-planner', { now: NOW, storage: { 'sc-room-status': board, 'sc-housekeeping-planner': {} } });
  await H.settle(h, 60);
  const radio = [...h.document.querySelectorAll('input[type=radio]')].find((input) => input.value === 'rooms');
  assert.equal(radio.disabled, true, '"From Room Status" is not offered for an example board');
  assert.doesNotMatch(text(radio.closest('label,div')), /\d+ rooms on the board/);
});

test('TL-01: Shift Pulse and the reminders do not count the Action Tracker\'s example as open or overdue', { skip: !built }, async () => {
  const w = H.openTool('action-tracker', { now: NOW });
  const kept = H.keep(w);
  assert.ok(kept['sc-actions'].rows.length > 0 && kept['sc-actions'].rows.every((row) => row.example === true));
  const p = H.openTool('shift-pulse', { now: NOW, storage: { 'sc-actions': kept['sc-actions'], 'sc-actions-ui': kept['sc-actions-ui'] } });
  await H.settle(p, 80);
  assert.doesNotMatch(text(p.document.body), /Fix the gap under door 7/);
  w.eval(fs.readFileSync(path.join(ROOT, 'src', 'js', 'reminders.js'), 'utf8'));
  const R = w.RemindersMath;
  assert.deepEqual(JSON.parse(JSON.stringify(R.dueNow(R.readRows(w.localStorage), '2026-10-28'))), { overdue: 0, today: 0, titles: [] });
  assert.deepEqual(JSON.parse(JSON.stringify(R.summarize(R.readRows(w.localStorage), new Date(NOW)).byDue)), {});
  // A list saved before the example was marked: its ids beside the list say which actions are the example's.
  w.localStorage.setItem('sc-actions', JSON.stringify({ rows: [{ id: 'old1', title: 'Example of before', due: '2026-10-01', status: 'open' }, { id: 'mine', title: 'My own', due: '2026-10-02', status: 'open' }] }));
  w.localStorage.setItem('sc-actions-ui', JSON.stringify({ exampleIds: ['old1'] }));
  assert.deepEqual(JSON.parse(JSON.stringify(R.dueNow(R.readRows(w.localStorage), '2026-10-28').titles)), ['My own']);
});

test('TL-02: the same paste imported twice adds its rows once, in Lost & Found and in Guest Complaints', { skip: !built }, () => {
  const run = (slug, key, field, pasted) => {
    const w = H.openTool(slug, { storage: { [key]: { rows: [] } } });
    const paste = w.document.querySelector(field);
    const status = w.document.querySelector('[data-import-status]');
    paste.value = pasted;
    H.click(w, w.document.querySelector('[data-import]'));
    assert.match(status.textContent, /Imported 2 rows/);
    paste.value = pasted;
    H.click(w, w.document.querySelector('[data-import]'));
    assert.match(status.textContent, /already in the log/);
    w.dispatchEvent(new w.Event('pagehide'));
    assert.equal(JSON.parse(w.localStorage.getItem(key)).rows.length, 2, slug);
  };
  run('lost-found', 'sc-lost-found', '#lf-paste', '2026-10-20\t09:15\tRooms\t214\tElectronics\tPhone charger\tLow\tAna\tOffice\t17\tMr Smith\tStored\n2026-10-21\t10:00\tLobby\t\tClothing\tBlack scarf\tLow\tBen\tOffice\t18\t\tStored');
  run('guest-complaints', 'sc-guest-complaints', '#gc-paste', '2026-10-20\t09:15\t214\tFront desk\tNoise\t2\tLoud neighbours\tMr Smith\tAna\tMoved room\t\t\t\t\t\t\n2026-10-21\t10:00\t310\tFront desk\tCleanliness\t3\tHair in bathroom\tMs Lee\tBen\tRecleaned\t\t\t\t\t\t');
});

test('TL-03: Room Status clears a filter on an attendant the board no longer has', { skip: !built }, async () => {
  const rooms = ['101', '102', '103'].map((number) => ({ number, floor: '1', type: '' }));
  const board = Object.fromEntries(rooms.map((room) => [room.number, { status: 'vd', at: '', flags: [], attendant: room.number === '101' ? 'Ana' : 'Ben', note: '', started: '', ooo: null }]));
  const w = H.openTool('room-status', { now: NOW, storage: { 'sc-room-status': { rooms, board, history: {}, attendants: [{ name: 'Ana' }, { name: 'Ben' }], arrivals: {}, filters: {}, day: '2026-10-25', example: false } } });
  await H.settle(w, 50);
  const d = w.document;
  const tiles = () => d.querySelectorAll('.rs-tile').length;
  const select = [...d.querySelectorAll('select')].find((s) => [...s.options].some((o) => o.value === 'Ana') && [...s.options].some((o) => o.textContent === 'All attendants'));
  select.value = 'Ana';
  change(w, select);
  await H.settle(w, 30);
  assert.equal(tiles(), 1);
  H.click(w, d.querySelector('[data-room]'));
  await H.settle(w, 20);
  const who = [...d.querySelectorAll('dialog select')].find((s) => [...s.options].some((o) => o.value === 'Ben'));
  who.value = 'Ben';
  change(w, who);
  await H.settle(w, 30);
  const names = [...d.querySelectorAll('textarea,input')].find((input) => /Ana/.test(input.value) && /Ben/.test(input.value));
  names.value = 'Ben';
  names.dispatchEvent(new w.Event('input', { bubbles: true }));
  await H.settle(w, 50);
  assert.equal(tiles(), 3, 'every room shows again');
  assert.equal(H.keep(w)['sc-room-status'].filters.attendant, '', 'and the saved filter is cleared, for the reload and the team');
});

test('TL-03 and TL-07: the Action Tracker says when an action was not added, and clears a filter on a renamed owner', { skip: !built }, () => {
  const w = H.openTool('action-tracker', { storage: { 'sc-actions': { rows: [] } } });
  const root = w.document.querySelector('[data-action-tracker]');
  const entry = root.querySelector('[data-entry]');
  const add = (title, owner) => { H.type(w, entry.elements.title, title); H.type(w, entry.elements.owner, owner); H.submit(w, entry); };
  add('Check fire door', 'Ana');
  add('Other', 'Ben');
  assert.equal(root.querySelector('[data-entry-status]').textContent, 'Added.');
  add('Check fire door', 'Ben');
  assert.equal(w.ActionsStore.list().length, 2);
  assert.equal(root.querySelector('[data-entry-status]').textContent, 'Already on the list.', 'not "Added."');
  assert.equal(entry.elements.title.value, 'Check fire door', 'what was typed stays');
  const owner = root.querySelector('[data-filter="owner"]');
  owner.value = 'Ana';
  change(w, owner);
  assert.equal(root.querySelectorAll('[data-list] li').length, 1);
  H.click(w, [...root.querySelector('[data-list] li').querySelectorAll('button')].find((b) => b.textContent === 'Edit'));
  const item = root.querySelector('[data-list] li');
  item.querySelector('input[name=owner]').value = 'Carla';
  H.click(w, [...item.querySelectorAll('button')].find((b) => b.textContent === 'Save changes'));
  assert.equal(root.querySelectorAll('[data-list] li').length, 2, 'the list is not left empty behind a filter nobody can see');
  const again = H.openTool('action-tracker', { storage: H.keep(w) });
  assert.equal(again.document.querySelectorAll('[data-list] li').length, 2);
});

test('TL-07: an edit that empties the result of a verified action keeps the other changes and asks for the result', { skip: !built }, () => {
  const w = H.openTool('action-tracker', { storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Post the rule', owner: 'Ana', status: 'verified', created: '2026-10-01', closed: '2026-10-20', result: 'Damage down to 0.2 %' }] }, 'sc-actions-ui': { status: 'all', owner: '', source: '', exampleIds: [] } } });
  const root = w.document.querySelector('[data-action-tracker]');
  H.click(w, [...root.querySelector('[data-list] li').querySelectorAll('button')].find((b) => b.textContent === 'Edit'));
  const item = root.querySelector('[data-list] li');
  item.querySelector('input[name=owner]').value = 'Ben';
  item.querySelector('input[name=due]').value = '2026-11-05';
  item.querySelector('input[name=result]').value = '';
  H.click(w, [...item.querySelectorAll('button')].find((b) => b.textContent === 'Save changes'));
  const saved = w.ActionsStore.all()[0];
  assert.equal(saved.owner, 'Ben');
  assert.equal(saved.due, '2026-11-05');
  assert.equal(saved.status, 'verified');
  assert.equal(saved.result, 'Damage down to 0.2 %', 'a verified action keeps its result');
  assert.match(text(root.querySelector('[data-list] li')), /Verified needs a result/);
});

test('TL-04: a complaint and a found item are logged at the time they are entered, not when the page was opened', { skip: !built }, async () => {
  const g = H.openTool('guest-complaints', { now: '2026-10-25T07:00:00Z', storage: { 'sc-guest-complaints': { rows: [] } } });
  const form = g.document.querySelector('[data-entry]');
  assert.equal(form.elements.time.value, '08:00');
  setClock(g, '2026-10-25T13:30:00Z');
  form.elements.what.value = 'No hot water';
  form.elements.room.value = '214';
  H.submit(g, form);
  await H.settle(g, 60);
  assert.equal(H.keep(g)['sc-guest-complaints'].rows[0].time, '14:30');
  // A time the person set is theirs: a complaint written down after the fact keeps it.
  setClock(g, '2026-10-25T15:00:00Z');
  H.type(g, form.elements.time, '11:20');
  form.elements.what.value = 'Noise in the night';
  H.submit(g, form);
  await H.settle(g, 60);
  assert.deepEqual(H.keep(g)['sc-guest-complaints'].rows.map((row) => row.time).sort(), ['11:20', '14:30']);
  const lf = H.openTool('lost-found', { now: '2026-10-25T07:00:00Z', storage: { 'sc-lost-found': { rows: [] } } });
  const found = lf.document.querySelector('[data-entry]');
  setClock(lf, '2026-10-25T13:30:00Z');
  found.elements.what.value = 'Phone';
  H.submit(lf, found);
  await H.settle(lf, 40);
  setClock(lf, '2026-10-25T17:10:00Z');
  found.elements.what.value = 'Scarf';
  H.submit(lf, found);
  await H.settle(lf, 40);
  assert.deepEqual(H.keep(lf)['sc-lost-found'].rows.map((row) => row.time).sort(), ['14:30', '18:10']);
});

test('TL-05: a second tap on Save does not log a maintenance task done twice', { skip: !built }, async () => {
  const state = {
    assets: [{ id: 'a1', tag: 'LIFT-1', name: 'Lift', type: 'other', area: '', crit: 'A', tasks: [{ id: 't1', text: 'Weekly safety check', every: 1, unit: 'weeks', who: 'internal', minutes: 20, start: '2026-10-05' }] }],
    rows: [{ id: 'r0', kind: 'done', asset: 'a1', task: 't1', date: '2026-10-05', minutes: 20, parts: 0, hours: null, by: 'A' }],
  };
  const w = H.openTool('maintenance-planner', { now: NOW, storage: { 'sc-maintenance-planner': state } });
  await H.settle(w, 60);
  H.click(w, w.document.querySelector('[data-log-task][data-log-kind="done"]'));
  await H.settle(w, 30);
  const save = w.document.querySelector('[data-log-save]');
  H.click(w, save);
  H.click(w, save);
  await H.settle(w, 80);
  assert.equal(H.keep(w)['sc-maintenance-planner'].rows.filter((row) => row.kind === 'done').length, 2, 'the one before and the one logged now');
});

test('TL-06: a second tap on Add does not log a phantom entry of one unit; a second entry typed after it does count', { skip: !built }, async () => {
  for (const [slug, key] of [['damage-control', 'sc-damage-control'], ['night-audit', 'sc-night-audit'], ['incomplete-control', 'sc-incomplete-control']]) {
    const w = H.openTool(slug, { storage: { [key]: { rows: [] } } });
    const form = w.document.querySelector('[data-entry]');
    form.elements.units.value = '12';
    form.elements.note.value = 'pallet dropped';
    H.submit(w, form);
    H.submit(w, form);
    await H.settle(w, 60);
    assert.deepEqual(H.keep(w)[key].rows.map((row) => row.units), [12], slug);
    H.type(w, form.elements.units, '3');
    H.submit(w, form);
    await H.settle(w, 60);
    assert.deepEqual(H.keep(w)[key].rows.map((row) => row.units).sort((a, b) => a - b), [3, 12], `${slug}: an entry typed right after is logged`);
  }
});

test('TL-08: a handover written on the German page and opened on the English one keeps its shift and its priorities', { skip: !built }, async () => {
  const open = async (lang, hash = '') => {
    const folder = lang === 'en' ? '' : `${lang}/`;
    const html = fs.readFileSync(path.join(ROOT, '_site', folder, 'tools', 'shift-handover', 'index.html'), 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
    const w = new JSDOM(html, { url: `https://example.test/${folder}tools/shift-handover/${hash}`, runScripts: 'outside-only', pretendToBeVisual: true }).window;
    Object.assign(w, { CompressionStream, DecompressionStream, Blob, Response, TextEncoder, TextDecoder });
    Object.defineProperty(w, 'crypto', { value: globalThis.crypto, configurable: true });
    w.HTMLElement.prototype.scrollIntoView = () => {};
    w.confirm = () => true;
    if (lang !== 'en') w.eval(fs.readFileSync(path.join(ROOT, '_site', 'js', `ui-${lang}.js`), 'utf8'));
    for (const file of ['tool-kit', 'shift-handover']) w.eval(fs.readFileSync(path.join(ROOT, 'src', 'js', `${file}.js`), 'utf8'));
    opened.push(w);
    return w;
  };
  const CODE = 'acid-acorn-acre-acts-afar-affix';
  const de = await open('de');
  const handover = { template: 'hotel', date: '2026-10-25', shift: 'Nacht', area: 'Rezeption', from: 'Besa', to: 'Dritan', metrics: [['Anreisen', '42', '']],
    issues: [{ text: 'Zimmer 1204: Safe schliesst nicht', priority: 'Hoch', owner: 'Technik', due: '06:00', done: false, carried: 2 }, { text: 'Etwas Unbekanntes', priority: 'Dringend', owner: '', due: '', done: false, carried: 0 }], headsUp: '', safety: '', checks: [] };
  const sealed = await de.ShiftHandoverLink.packHandover(handover, CODE);
  const en = await open('en', `#${sealed.fragment}`);
  const box = en.document.querySelector('[data-incoming]');
  for (let i = 0; i < 100 && box.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 10));
  const unlock = box.querySelector('[data-incoming-unlock]');
  unlock.elements.code.value = CODE;
  unlock.dispatchEvent(new en.Event('submit', { bubbles: true, cancelable: true }));
  const preview = box.querySelector('[data-incoming-preview]');
  for (let i = 0; i < 300 && preview.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 20));
  assert.match(box.querySelector('[data-incoming-text]').textContent, /Night shift/);
  box.querySelector('[data-incoming-open]').click();
  await new Promise((resolve) => setTimeout(resolve, 50));
  const current = JSON.parse(en.localStorage.getItem('sc-shift-handover')).current;
  assert.equal(current.shift, 'Night');
  assert.deepEqual(current.issues.map((issue) => issue.priority), ['High', 'Medium'], 'a name no language knows is medium, as before');
});

// TL-09, found by clicking every button of every tool in Chromium: the Root causes tab of the CX Control Tower
// threw "TK is not defined" (a name of the script's first part used in its second) as soon as it had a cause to show,
// so the tab stayed on the page before and its hand-off to the Action Tracker was never drawn.
test('TL-09: the Root causes tab of the CX Control Tower opens, with its hand-off to the Action Tracker', { skip: !built }, async () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = H.openTool('cx-control-tower', { lang });
    const errors = [];
    w.addEventListener('error', (event) => errors.push(event.message));
    await H.settle(w, 100);
    H.click(w, w.document.querySelector('[data-tab="causes"]'));
    await H.settle(w, 100);
    assert.deepEqual(errors, [], lang);
    assert.ok(w.document.querySelector('main a[href*="action-tracker"]'), `${lang}: the link that takes the top cause to the Action Tracker`);
  }
});
