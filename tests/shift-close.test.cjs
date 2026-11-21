// Closing a shift and carrying its open issues (src/js/shift-close.js, used by the Shift Handover page; step 3 of
// docs/plan-sot-2026-11-11/PLANI.md and its criteria K1–K16, §3.6). Everything here runs the real page: the built
// Shift Handover with its own scripts, the real file box, the real team sync against a fake of its server. Nothing is
// modelled. The restore points need IndexedDB and are tested in the browser (tests/browser/shift-close.spec.mjs).
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const hasSite = fs.existsSync('_site/tools/shift-handover/index.html');
const KEYS = { en: 'sc-shift-handover', de: 'sc-shift-handover-de', sq: 'sc-shift-handover-sq' };
const SHIFTS = { en: ['Early', 'Late', 'Night'], de: ['Früh', 'Spät', 'Nacht'], sq: ['Mëngjes', 'Pasdite', 'Natë'] };
const ACTIVE = 'sc-shift-ui';
const DRAFTS = 'sc-drafts-ui';
const PILOT = 'sc-shift-close-ui';
const PAGE_SCRIPTS = ['tool-kit', 'shift-context', 'shift-close', 'shift-handover', 'storage-guard', 'work-backup'];

// The Shift Handover page as it is built, with the scripts it loads run from src/js. `storage` is what the browser
// holds when the page opens; confirm() answers yes and keeps what it was asked. The new way of closing is on unless a
// test says `pilot: false`: that is the device the criteria speak of. The page as it always was is tested in section 0.
const open = ({ lang = 'en', storage = {}, search = '', scripts = PAGE_SCRIPTS, before, pilot = true } = {}) => {
  const dir = lang === 'en' ? '' : `${lang}/`;
  const html = fs.readFileSync(`_site/${dir}tools/shift-handover/index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: `https://stivencatalyst.com/${dir}tools/shift-handover/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  Object.assign(w, { CompressionStream, DecompressionStream, Blob, Response, TextEncoder, TextDecoder });
  Object.defineProperty(w, 'crypto', { value: globalThis.crypto, configurable: true });
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = function () { if (!this.hasAttribute('open')) return; this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  w.asked = [];
  w.answer = true;
  w.confirm = (message) => { w.asked.push(message); return w.answer; };
  w.told = [];
  w.alert = (message) => { w.told.push(message); };
  if (pilot) w.localStorage.setItem(PILOT, JSON.stringify({ v: 1, on: true, set: 1 }));
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  before?.(w);
  // The page reloads 900 ms after a file is opened: here that is only counted.
  const realTimeout = w.setTimeout.bind(w);
  w.reloads = 0;
  w.setTimeout = (fn, ms, ...rest) => (ms === 900 ? (w.reloads += 1, 0) : realTimeout(fn, ms, ...rest));
  for (const file of scripts) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.lang = lang;
  opened.push(w);
  return w;
};
// Every page opened by a test goes with the tests: its timers would keep the run from ending.
const opened = [];
after(() => opened.forEach((w) => w.close()));
// The page writes its state as it keeps it (every field of a handover, in its order) at the first change. Touched, so
// that what is stored is what the page holds.
const settle = async (w) => {
  const area = w.document.querySelector('[data-handover] [name=area]');
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
  return w;
};
const held = (w) => Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => w.localStorage.key(i)).sort().map((key) => [key, w.localStorage.getItem(key)]));
// The same browser, the page loaded again (a reload, or the page opened later).
const reload = (w, options = {}) => open({ lang: w.lang, pilot: false, ...options, storage: held(w) });
const saved = (w) => JSON.parse(w.localStorage.getItem(KEYS[w.lang]));
const $ = (w, selector) => w.document.querySelector(selector);
const issue = (text, extra = {}) => ({ text, priority: 'High', owner: '', due: '', done: false, carried: 0, ...extra });
// A handover as the page keeps it.
const sheet = (lang, { date = '2026-11-11', shift = 1, area = 'Dock A', template = 'warehouse', issues = [issue('Ramp 3 blocked')], ...extra } = {}) => ({
  template, date, shift: SHIFTS[lang][shift], area, from: 'Arben', to: 'Mira', metrics: [], issues, headsUp: '', safety: '', checks: [], ackAt: '', shared: [], ack: null, received: null, ...extra,
});
const withHandover = (lang, options) => ({ [KEYS[lang]]: { current: sheet(lang, options), history: [], received: [] } });
const closeShift = (w) => $(w, '[data-close]').click();
const setStart = (w, { date, shift, area, template } = {}) => {
  const set = (name, value) => { if (value === undefined) return; const field = $(w, `[data-start] [name="start-${name}"]`); field.value = value; field.dispatchEvent(new w.Event('input', { bubbles: true })); };
  set('template', template); set('date', date); set('shift', shift === undefined ? undefined : SHIFTS[w.lang][shift]); set('area', area);
};
const startShift = (w, target) => { setStart(w, target); $(w, '[data-start-shift]').click(); };
const openTexts = (w) => saved(w).current.issues.filter((item) => !item.done).map((item) => item.text);
const isIdle = (w) => saved(w).idle === true;

// ---- 0. On or off, on this device ----

test('where the new way of closing is not on, the page closes as it always did: the next handover is made at once', { skip: !hasSite }, () => {
  const w = open({ pilot: false, storage: withHandover('en', { issues: [issue('Ramp 3 blocked'), issue('Done', { done: true })] }) });
  assert.equal(w.ShiftClose.enabled(), false);
  assert.equal($(w, '[data-close]').textContent, 'Close shift, start the next');
  assert.equal($(w, '.sh-sync-note').hidden, true);
  closeShift(w);
  assert.deepEqual(w.asked, ['Close the late shift? It moves to the history, and 1 open issue carries over to the next handover.']);
  const state = saved(w);
  assert.equal(state.idle, false, 'a handover is open at once');
  assert.deepEqual([state.current.date, state.current.shift, state.current.area, state.current.from], ['2026-11-11', 'Night', 'Dock A', 'Mira']);
  assert.deepEqual(state.current.issues, [issue('Ramp 3 blocked', { carried: 1 })]);
  assert.ok(!('carriedFrom' in state.current));
  assert.deepEqual(Object.keys(state.history[0]).sort(), ['closedAt', 'handover', 'text'], 'a closure as the page always wrote it: no id, no state');
  assert.equal($(w, '[data-start]').hidden, true);
  assert.equal(w.ShiftContext.active(), null, 'and no shift is made active');
  assert.match($(w, '[data-status]').textContent, /Started the night shift handover with 1 carried issue\./);
  // Nothing written: nothing to close, as before.
  const empty = open({ pilot: false });
  closeShift(empty);
  assert.deepEqual(empty.asked, []);
  assert.match($(empty, '[data-status]').textContent, /There is nothing to close yet\./);
  assert.equal(empty.localStorage.getItem(KEYS.en), null);
});

test('a missing or damaged setting is off, never on', { skip: !hasSite }, () => {
  for (const value of [null, 'x', 'true', '1', '[]', '{}', '{"v":1}', '{"v":1,"on":"yes"}', '{"v":1,"on":1}', '{"v":2,"on":true}', '{"on":true}']) {
    const w = open({ pilot: false, scripts: SYNC_SCRIPTS, storage: value === null ? {} : { [PILOT]: value } });
    assert.equal(w.ShiftClose.enabled(), false, `${value}: the page closes as before`);
    assert.equal(w.TeamSyncMath.closeOn(), false, `${value}: team sync reads it the same way`);
    assert.equal(w.TeamSyncMath.sharable(KEYS.en), true, `${value}: and treats the handover as before`);
    assert.equal($(w, '[data-close]').textContent, 'Close shift, start the next');
  }
  const on = open({ scripts: SYNC_SCRIPTS });
  assert.deepEqual([on.ShiftClose.enabled(), on.TeamSyncMath.closeOn(), on.TeamSyncMath.sharable(KEYS.en)], [true, true, false]);
});

test('it is turned on only by the visitor, on this device, and turned off the same way', { skip: !hasSite }, async () => {
  // Asked, and answered no: nothing is turned on.
  const no = open({ pilot: false, search: '?pilot=shift-close', storage: withHandover('en'), before: (w) => { w.answer = false; } });
  assert.match(no.asked[0], /^Turn the new shift close on, on this device only\? Closing a shift then starts nothing: .* Team sync stops sharing the handover and its history from this device; a handover reaches another device only when you send it\.$/);
  assert.equal(no.localStorage.getItem(PILOT), null);
  assert.equal(no.location.search, '', 'the address is cleaned either way');
  // Answered yes: on, and the page closes the new way from the next click.
  const w = open({ pilot: false, search: '?pilot=shift-close', storage: withHandover('en') });
  assert.equal(w.ShiftClose.enabled(), true);
  assert.equal(JSON.parse(w.localStorage.getItem(PILOT)).on, true);
  assert.equal($(w, '[data-close]').textContent, 'Close the shift');
  assert.equal($(w, '.sh-sync-note').hidden, false);
  closeShift(w);
  assert.equal(isIdle(w), true);
  assert.match(saved(w).history[0].closeId, /^c/);
  // It is a setting of the device: in no saved file, so a file put back turns nothing on.
  assert.equal(w.WorkBackup.isWork(PILOT), false);
  assert.ok(!JSON.stringify(fileOf(w)).includes(PILOT));
  const other = await putBack(open({ pilot: false, storage: withHandover('en', { date: '2026-11-01' }) }), fileOf(w));
  assert.equal(other.ShiftClose.enabled(), false, 'a device that opens the file of a device where it is on stays off');
  // What that device does with such a state is in "held", below.
  assert.equal($(other, '[data-pilot-held]').hidden, false);
  // Turned off by its button, after the question, once a shift is open and nothing waits.
  const page = reload(w, { pilot: true });
  startShift(page, {});
  page.answer = false;
  $(page, '[data-pilot-off]').click();
  assert.equal(page.ShiftClose.enabled(), true, 'the answer "no" leaves it on');
  page.answer = true;
  $(page, '[data-pilot-off]').click();
  assert.equal(page.ShiftClose.enabled(), false);
  assert.equal(page.localStorage.getItem(PILOT), null);
  assert.equal($(page, '[data-close]').textContent, 'Close shift, start the next');
  assert.equal($(page, '.sh-sync-note').hidden, true);
});

// ---- Held: what the new way left, on a device where it is off ----

// A device where the new way is on: a shift closed with an open issue, an issue from 5 Whys waiting for the next one.
const pilotDevice = () => open({ storage: held(idlePage()), search: sentSearch });
const heldFacts = (w) => $(w, '[data-pilot-held-facts]').textContent;

test('held: the file of a device where it is on, put back where it is off with the handover ticked for team sync, is neither worked on nor shared until the visitor decides', { skip: !hasSite }, async () => {
  const source = pilotDevice();
  const file = fileOf(source);
  // The device that opens it: the new way off, a handover of its own, the handover ticked for team sync.
  const target = open({ pilot: false, scripts: SYNC_SCRIPTS, storage: { ...withHandover('en', { date: '2026-11-01', issues: [issue('Its own')] }), 'sc-team-state': { choices: { 'shift-handover': true } }, 'sc-damage-control': { rows: [damageRow('Target')] } } });
  assert.equal(target.TeamSyncMath.sharable(KEYS.en), true, 'before the file, this device shares its handover as it always did');
  const w = await putBack(target, file);
  for (const file of ['team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  assert.equal(w.ShiftClose.enabled(), false, 'the file turned nothing on');
  assert.equal(w.localStorage.getItem(PILOT), null);
  const before = w.localStorage.getItem(KEYS.en);
  assert.deepEqual([saved(w).idle, saved(w).waiting.length, saved(w).history[0].closeId !== undefined], [true, 1, true], 'the state of the other device is here, whole');
  // The page says so, and offers neither way of going on.
  assert.equal($(w, '[data-pilot-held]').hidden, false);
  assert.equal(heldFacts(w), 'No shift is open. 1 open issue of a closed shift waits to be carried over. 1 issue sent here waits for a shift.');
  assert.equal($(w, '[data-start]').hidden, true, 'the start is not offered');
  assert.equal($(w, '[data-handover]').closest('section').hidden, true, 'nor a handover to close the old way');
  $(w, '[data-start-shift]').click();
  $(w, '[data-close]').click();
  assert.equal(w.localStorage.getItem(KEYS.en), before, 'asked all the same, neither starts nor closes anything');
  assert.deepEqual(w.asked, [], 'and asks nothing');
  assert.match($(w, '[data-status]').textContent, /Not done: this device holds a shift closed the new way/);
  // A handover that arrives is not taken over either.
  const arrived = await arrive(w, { pilot: false });
  await take(arrived);
  assert.equal(arrived.localStorage.getItem(KEYS.en), before);
  assert.equal($(arrived, '[data-incoming]').hidden, false, 'it stays offered');
  // Team sync: ticked, and still not shared, in or out. Another device of the team shares its own handover.
  assert.equal(w.TeamSyncMath.closeHeld(KEYS.en), true);
  assert.equal(w.TeamSyncMath.sharable(KEYS.en), false);
  const server = fakeServer();
  const dev = async (page, who) => ({ w: page, who, keys: await page.TeamSyncMath.deriveKeys(CODE, 1000), selected: (key) => page.TeamSyncMath.isOn(page.WorkBackup.toolSlug(key), JSON.parse(page.localStorage.getItem('sc-team-state')).choices || {}) });
  const mate = await dev(await settle(open({ pilot: false, scripts: SYNC_SCRIPTS, storage: { ...withHandover('en', { issues: [issue('Of the team mate')] }), 'sc-team-state': { choices: { 'shift-handover': true } }, 'sc-damage-control': { rows: [damageRow('Mate')] } } })), 'mate');
  const me = await dev(w, 'held');
  assert.equal(me.selected(KEYS.en), true, 'the handover is ticked on the held device');
  for (const device of [mate, me, mate, me]) await sync(device, server);
  assert.equal(w.localStorage.getItem(KEYS.en), before, 'the held handover is not replaced, to the byte');
  const team = await teamCopy(server, mate);
  assert.ok(team.items[KEYS.en].includes('Of the team mate') && !team.items[KEYS.en].includes('Ramp 3 blocked'), 'and is not sent: the team\'s copy holds the mate\'s only');
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-damage-control')).rows.map((row) => row.stage).sort(), ['Mate', 'Target'], 'the rest of team sync goes on: the damage rows of both');
  // The decision: the visitor turns the new way on, here. Then the page goes on the new way, whole.
  const page = reload(w);
  page.answer = false;
  $(page, '[data-pilot-held-on]').click();
  assert.match(page.asked.at(-1), /^Turn the new shift close on, on this device only\?/);
  assert.equal(page.ShiftClose.enabled(), false, '"no" leaves it held');
  assert.equal($(page, '[data-pilot-held]').hidden, false);
  page.answer = true;
  $(page, '[data-pilot-held-on]').click();
  assert.equal(page.ShiftClose.enabled(), true);
  assert.equal($(page, '[data-pilot-held]').hidden, true);
  assert.equal($(page, '[data-start]').hidden, false);
  startShift(page, {});
  assert.deepEqual(openTexts(page).sort(), ['Ramp 3 blocked', SENT], 'what waited is carried and added, each once');
  assert.deepEqual(saved(page).waiting, []);
});

test('held with a handover open: a closure of another area still waits, so the open handover is not closed the old way; it can still be written in', { skip: !hasSite }, async () => {
  const source = idlePage();
  startShift(source, { area: 'Dock B' });
  const w = await putBack(open({ pilot: false }), fileOf(source));
  assert.equal($(w, '[data-pilot-held]').hidden, false);
  assert.equal(heldFacts(w), '1 open issue of a closed shift waits to be carried over.');
  assert.equal($(w, '[data-handover]').closest('section').hidden, false, 'the open handover is shown');
  const area = $(w, '[data-handover] [name=headsUp]');
  area.value = 'Door 2 sticks';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(saved(w).current.headsUp, 'Door 2 sticks', 'writing is the same in both ways and is kept');
  const before = w.localStorage.getItem(KEYS.en);
  closeShift(w);
  assert.equal(w.localStorage.getItem(KEYS.en), before, 'closing is not done: the old way would never carry what waits');
  assert.deepEqual(w.asked, []);
  // Deleting the history is the visitor's own decision in either way, with its warning; after it nothing is held.
  $(w, '[data-clear-history]').click();
  assert.match(w.asked.at(-1), /1 open issue of a closed shift still waits to be carried over\. It is deleted too/);
  assert.equal($(w, '[data-pilot-held]').hidden, true);
  closeShift(w);
  assert.equal(saved(w).history.length, 1, 'now the page closes as it always did');
  assert.ok(!saved(w).history[0].closeId);
});

test('a device without anything the new way left is never held: the page and team sync are as they always were', { skip: !hasSite }, () => {
  for (const storage of [{}, withHandover('en'), { [KEYS.en]: { current: sheet('en'), history: [{ closedAt: '2026-11-01T06:00:00.000Z', handover: sheet('en', { date: '2026-10-31' }), text: 'old' }], received: [] } }]) {
    const w = open({ pilot: false, scripts: SYNC_SCRIPTS, storage });
    assert.equal($(w, '[data-pilot-held]').hidden, true);
    assert.equal(w.TeamSyncMath.closeHeld(KEYS.en), false);
    assert.equal(w.TeamSyncMath.sharable(KEYS.en), true);
  }
  // A closure the new way made that was carried, or has nothing open, holds nothing either.
  const done = open({ storage: withHandover('en') });
  closeShift(done);
  startShift(done, {});
  const w = open({ pilot: false, scripts: SYNC_SCRIPTS, storage: { [KEYS.en]: done.localStorage.getItem(KEYS.en) } });
  assert.deepEqual([$(w, '[data-pilot-held]').hidden, w.TeamSyncMath.closeHeld(KEYS.en), w.TeamSyncMath.sharable(KEYS.en)], [true, false, true]);
  // What cannot be read is not held, and not a reason to stop sharing other keys.
  const broken = open({ pilot: false, scripts: SYNC_SCRIPTS, storage: { [KEYS.en]: '{"idle":' } });
  assert.equal(broken.TeamSyncMath.closeHeld(KEYS.en), false);
});

test('turning the new way off: refused while no shift is open or something waits, with what to settle; with a handover open and nothing waiting it is turned off and the handover stays', { skip: !hasSite }, async () => {
  // No shift open, a closure waiting, an issue sent here waiting.
  const idle = pilotDevice();
  const before = held(idle);
  $(idle, '[data-pilot-off]').click();
  assert.equal(idle.ShiftClose.enabled(), true);
  assert.deepEqual(idle.asked, [], 'not asked: there is nothing to say yes to');
  assert.equal(idle.told.at(-1), 'The new shift close stays on: turning it off now would leave these with no way to go on.\n\nNo shift is open. 1 open issue of a closed shift waits to be carried over. 1 issue sent here waits for a shift.\n\nStart the shift that takes them, or delete or discard them, then turn it off.');
  assert.deepEqual(held(idle), before, 'nothing was changed');
  // A handover open, and a closure of another area that still waits.
  const waiting = idlePage();
  startShift(waiting, { area: 'Dock B' });
  $(waiting, '[data-pilot-off]').click();
  assert.equal(waiting.ShiftClose.enabled(), true);
  assert.match(waiting.told.at(-1), /\n\n1 open issue of a closed shift waits to be carried over\.\n\n/);
  // A handover open and nothing waiting: asked, with what happens to the open handover, then off.
  const open1 = await settle(open({ storage: withHandover('en') }));
  const stored = open1.localStorage.getItem(KEYS.en);
  $(open1, '[data-pilot-off]').click();
  assert.match(open1.asked.at(-1), /^Turn the new shift close off on this device\?[^]*\n\nThe late shift that is open stays open as it is\.$/);
  assert.equal(open1.ShiftClose.enabled(), false);
  assert.equal(open1.localStorage.getItem(KEYS.en), stored, 'the handover is as it was');
  assert.equal($(open1, '[data-pilot-held]').hidden, true, 'and nothing is held');
  // From here the page is the page as it always was, whole.
  closeShift(open1);
  assert.match(open1.asked.at(-1), /carries over to the next handover\.$/);
  assert.deepEqual([saved(open1).idle, saved(open1).current.shift, openTexts(open1)], [false, 'Night', ['Ramp 3 blocked']]);
  // After the waiting things are settled the new way, it can be turned off.
  startShift(idle, {});
  $(idle, '[data-pilot-off]').click();
  assert.equal(idle.ShiftClose.enabled(), false);
  assert.deepEqual(openTexts(idle).sort(), ['Ramp 3 blocked', SENT]);
});

// ---- The fifty-first issue that waits ----

test('the fifty-first issue sent while no shift is open is not kept, not used up and not lost: after room is made it is stored once', { skip: !hasSite }, () => {
  // Fifty issues arrive the real way, one page opened for each.
  let w = idlePage();
  for (let n = 1; n <= 50; n += 1) w = open({ storage: held(w), search: `?issue=${encodeURIComponent(`Waiting issue ${n}`)}` });
  assert.equal(saved(w).waiting.length, 50);
  const full = w.localStorage.getItem(KEYS.en);
  const note = { caseId: 'INV-51', from: 'cx-control-tower', issue: 'The fifty-first', owner: 'Arben', due: '2026-11-13' };
  const withNote = (page) => page.sessionStorage.setItem('sc-case-handoff', JSON.stringify(note));
  // What the tab still holds after a page: the address and the note, as a reload would find them.
  const again = (page, options = {}) => open({ storage: held(page), search: page.location.search, ...options, before: (next) => { const kept = page.sessionStorage.getItem('sc-case-handoff'); if (kept !== null) next.sessionStorage.setItem('sc-case-handoff', kept); options.before?.(next); } });
  const refusedOnce = (page, what) => {
    assert.equal(page.localStorage.getItem(KEYS.en), full, `${what}: nothing stored, nothing pushed out`);
    assert.equal(page.location.search, '?case=INV-51', `${what}: the address still asks`);
    assert.deepEqual(JSON.parse(page.sessionStorage.getItem('sc-case-handoff')), note, `${what}: the note is not used up`);
    assert.match($(page, '[data-status]').textContent, /“The fifty-first” was not kept: too many issues already wait here\. Start the shift or discard some, then reload the page\./, what);
  };
  let page = open({ storage: held(w), search: '?case=INV-51', before: withNote });
  refusedOnce(page, 'the first time');
  page = again(page);
  refusedOnce(page, 'after a reload');
  // Room is made: one of the fifty is discarded, by the visitor.
  $(page, '[data-discard-waiting]').click();
  assert.equal(saved(page).waiting.length, 49);
  assert.deepEqual(JSON.parse(page.sessionStorage.getItem('sc-case-handoff')), note, 'discarding another issue does not use the note up');
  // The storage fails on the next try: still not used up.
  let restore;
  const failing = again(page, { before: (next) => { restore = refuseSaves(next); } });
  assert.equal(failing.location.search, '?case=INV-51');
  assert.deepEqual(JSON.parse(failing.sessionStorage.getItem('sc-case-handoff')), note);
  assert.equal(saved(failing).waiting.length, 49);
  assert.match($(failing, '[data-status]').textContent, /could not be saved here/);
  restore();
  // And with the storage working: stored, once, and only now used up.
  page = again(failing);
  assert.equal(saved(page).waiting.filter((item) => item.text === 'The fifty-first').length, 1);
  assert.equal(saved(page).waiting.length, 50);
  assert.equal(page.location.search, '');
  assert.equal(page.sessionStorage.getItem('sc-case-handoff'), null);
  page = again(page);
  assert.equal(saved(page).waiting.filter((item) => item.text === 'The fifty-first').length, 1, 'a reload stores nothing twice');
  // The same limit for an issue from 5 Whys, whose text is in the address: refused, the address kept; stored once after room is made.
  let whys = open({ storage: held(page), search: '?issue=A%20fifty-first%20from%205%20Whys' });
  assert.equal(whys.location.search, '?issue=A%20fifty-first%20from%205%20Whys');
  assert.equal(saved(whys).waiting.length, 50);
  $(whys, '[data-discard-waiting]').click();
  whys = again(whys);
  assert.equal(whys.location.search, '');
  assert.equal(saved(whys).waiting.filter((item) => item.text === 'A fifty-first from 5 Whys').length, 1);
  // Started, the shift takes all fifty and what was carried, each once.
  startShift(whys, {});
  const texts = saved(whys).current.issues.map((item) => item.text);
  assert.equal(texts.length, 51);
  assert.equal(new Set(texts).size, 51);
});

test('turned on where no shift is open: the start panel is shown at once, without a reload, and nothing starts until the visitor starts it', { skip: !hasSite }, () => {
  for (const lang of ['en', 'de', 'sq']) {
    // A device that has never kept a handover, asked by the address; the answer is yes.
    const w = open({ lang, pilot: false, search: '?pilot=shift-close' });
    assert.equal(w.ShiftClose.enabled(), true, `${lang}: on`);
    assert.equal($(w, '[data-start]').hidden, false, `${lang}: the start panel, in the same visit`);
    assert.equal($(w, '[data-handover]').closest('section').hidden, true, `${lang}: not a blank handover to write in`);
    assert.equal($(w, '[data-output]').hidden, true);
    assert.equal(w.localStorage.getItem(KEYS[lang]), null, `${lang}: nothing of a handover was written`);
    assert.equal(w.ShiftContext.active(), null, `${lang}: and no shift was started or made active`);
    // The same on the next visit.
    const again = reload(w);
    assert.equal($(again, '[data-start]').hidden, false);
    assert.equal(again.localStorage.getItem(KEYS[lang]), null);
    // The shift starts when the visitor starts it, with the date and the shift they choose.
    $(w, '[name="start-date"]').value = '2026-11-10';
    $(w, '[name="start-shift"]').value = SHIFTS[lang][2];
    $(w, '[data-start-shift]').click();
    assert.deepEqual([saved(w).idle, saved(w).current.date, saved(w).current.shift], [false, '2026-11-10', SHIFTS[lang][2]]);
    assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().label], ['2026-11-10', SHIFTS[lang][2]]);
    assert.equal($(w, '[data-start]').hidden, true);
  }
  // Answered no: the page is the blank handover it always was.
  const no = open({ pilot: false, search: '?pilot=shift-close', before: (w) => { w.answer = false; } });
  assert.equal($(no, '[data-start]').hidden, true);
  assert.equal($(no, '[data-handover]').closest('section').hidden, false);
  // A handover that is open, stored or only typed so far, stays open when the pilot is turned on.
  const openOne = open({ pilot: false, search: '?pilot=shift-close', storage: withHandover('en') });
  assert.deepEqual([openOne.ShiftClose.enabled(), $(openOne, '[data-start]').hidden], [true, true]);
});

test('where it is not on, team sync shares the handover as before: offered, sent when ticked, and merged', { skip: !hasSite }, async () => {
  const device = async (who, pilot, ticked = true) => {
    const w = open({ pilot, scripts: SYNC_SCRIPTS, storage: {
      ...withHandover('en', { issues: [issue(`${who}: an issue of its own`)] }),
      'sc-damage-control': { rows: [damageRow(who)] },
      'sc-team-state': { choices: ticked ? { 'shift-handover': true } : {} },
    } });
    await settle(w);
    const keys = await w.TeamSyncMath.deriveKeys(CODE, 1000);
    const selected = (key) => w.TeamSyncMath.isOn(w.WorkBackup.toolSlug(key), JSON.parse(w.localStorage.getItem('sc-team-state')).choices || {});
    return { w, keys, selected, who };
  };
  // Two devices where it is off, the handover ticked: it goes to the team's copy and comes to the other device.
  let server = fakeServer();
  const a = await device('A', false);
  const b = await device('B', false);
  assert.equal(a.w.TeamSyncMath.sharable(KEYS.en), true);
  for (const dev of [a, b, a]) await sync(dev, server);
  assert.ok(Object.keys((await teamCopy(server, a)).items).includes(KEYS.en), 'the handover is in the team\'s copy, as before');
  assert.equal(a.w.localStorage.getItem(KEYS.en), b.w.localStorage.getItem(KEYS.en), 'and the two devices hold the same handover, as before');
  // Off and not ticked: not sent, as before (the handover was never on by itself).
  server = fakeServer();
  const c = await device('C', false, false);
  await sync(c, server);
  assert.deepEqual(Object.keys((await teamCopy(server, c)).items), ['sc-damage-control']);
  // One device on, one off, both ticked: the one that is on neither sends its handover nor takes the other's.
  server = fakeServer();
  const on = await device('On', true);
  const off = await device('Off', false);
  const before = on.w.localStorage.getItem(KEYS.en);
  for (const dev of [on, off, on, off]) await sync(dev, server);
  assert.equal(on.w.localStorage.getItem(KEYS.en), before, 'the device where it is on keeps its handover to the byte');
  assert.ok((await teamCopy(server, on)).items[KEYS.en].includes('Off: an issue of its own'), 'the team\'s copy holds the handover of the device where it is off');
  assert.ok(!(await teamCopy(server, on)).items[KEYS.en].includes('On: an issue of its own'));
  assert.deepEqual(JSON.parse(on.w.localStorage.getItem('sc-damage-control')).rows.map((row) => row.stage).sort(), ['Off', 'On'], 'the damage rows merge either way');
  // The setting itself is never in the team's copy.
  assert.ok(!JSON.stringify(await teamCopy(server, on)).includes(PILOT));
});

// ---- 1. One closing mechanism ----

test('closing keeps the handover as it is, with an id, the real time and where it stood, and sends nothing', { skip: !hasSite }, async () => {
  const w = await settle(open({ storage: withHandover('en') }));
  w.ShiftContext.setActive({ date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'en' });
  const was = saved(w).current;
  const from = Date.now();
  closeShift(w);
  const to = Date.now();
  assert.equal(w.asked.length, 1, 'asked once before closing');
  assert.match(w.asked[0], /^Close the late shift\? It moves to the history, and no shift is open until you start the next one\. Closing sends nothing\./);
  assert.match(w.asked[0], /It has not been sent to another device\./);
  assert.match(w.asked[0], /1 open issue waits for the next shift started in this area\./);
  const state = saved(w);
  const [entry] = state.history;
  assert.match(entry.closeId, /^c[a-z0-9]{15}$/, 'the closure has an id');
  assert.ok(Date.parse(entry.closedAt) >= from && Date.parse(entry.closedAt) <= to, 'closed at the real time');
  assert.deepEqual([entry.handover.date, entry.handover.shift, entry.handover.area], ['2026-11-11', 'Late', 'Dock A'], 'the operative date and the shift are the handover\'s own');
  assert.deepEqual(entry.handover, { ...was }, 'the handover is kept whole');
  assert.deepEqual([entry.state, entry.written, entry.changed, entry.drafts], ['ready', true, false, 0]);
  assert.ok(typeof entry.text === 'string' && entry.text.includes('Ramp 3 blocked'), 'with its text, as the history shows it');
  // Nothing was sent or marked as sent.
  assert.deepEqual(entry.handover.shared, []);
  assert.equal(entry.handover.ack, null);
  assert.ok(!('carried' in entry), 'and nothing was carried');
  // No shift is open, and none was made: the page shows the start, not a handover.
  assert.equal(state.idle, true);
  assert.equal(state.history.length, 1);
  assert.equal(w.ShiftContext.active(), null, 'no active shift');
  assert.equal($(w, '[data-start]').hidden, false);
  assert.equal($(w, '[data-handover]').closest('section').hidden, true);
  assert.equal($(w, '[data-output]').hidden, true);
  assert.match($(w, '[data-status]').textContent, /Closed\. No shift is open on this device\./);
});

test('the answer "no" closes nothing', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  w.ShiftContext.setActive({ date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'en' });
  const before = held(w);
  w.answer = false;
  closeShift(w);
  assert.equal(w.asked.length, 1);
  assert.deepEqual(held(w), before);
  assert.equal($(w, '[data-start]').hidden, true);
});

test('a handover with nothing written closes too, after the warning, and the history says it was not written', { skip: !hasSite }, () => {
  const w = open({ storage: { [KEYS.en]: { current: sheet('en', { area: '', issues: [], from: '', to: '' }), history: [], received: [] } } });
  closeShift(w);
  assert.match(w.asked[0], /Nothing is written in this handover; the history will say so\./);
  const [entry] = saved(w).history;
  assert.deepEqual([entry.written, entry.state], [false, 'draft']);
  assert.match(entry.closeId, /^c/);
  assert.equal(isIdle(w), true);
  const page = reload(w);
  assert.match($(page, '[data-history] details .sh-closure').textContent, /^Nothing was written in this handover\.$/);
  assert.match($(page, '[data-start-last]').textContent, /Nothing was written in this handover\./);
});

test('the history says where each handover stood, in every state the page has, and keeps the meaning of the states', { skip: !hasSite }, () => {
  const cases = [
    [{}, 'ready', /Closed ready, never sent from this device\./],
    [{ shared: [{ id: 'abc', at: '2026-11-11T20:00:00.000Z', mode: 'link', ack: 'x' }] }, 'shared', /Closed after it was shared; the other device had not confirmed\./],
    [{ ack: { id: 'abc', at: '2026-11-11T20:05:00.000Z', by: 'Mira', code: 'K' }, shared: [{ id: 'abc', at: '2026-11-11T20:00:00.000Z', mode: 'link', ack: 'x' }] }, 'acknowledged', /confirmation code was typed in here\./],
    [{ ackAt: '2026-11-11T20:10:00.000Z' }, 'taken', /Closed after the takeover was confirmed on this device\./],
    [{ received: { id: 'abc', at: '2026-11-11T20:00:00.000Z', from: 'Arben', ackCode: '' } }, 'received', /Closed as received, before the takeover was confirmed\./],
  ];
  for (const [extra, state, words] of cases) {
    const w = open({ storage: withHandover('en', extra) });
    closeShift(w);
    assert.equal(saved(w).history[0].state, state);
    assert.match($(reload(w), '[data-history] details .sh-closure').textContent, words, state);
  }
});

// ---- 2. No shift is open after closing; the next one is started by the visitor ----

test('nothing starts the next shift: after closing, a reload still has no shift open and no handover was made', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  for (const page of [reload(w), reload(reload(w))]) {
    assert.equal(isIdle(page), true);
    assert.equal(saved(page).history.length, 1);
    assert.equal(page.ShiftContext.active(), null);
    assert.equal($(page, '[data-start]').hidden, false);
    assert.equal(page.localStorage.getItem(KEYS.en), w.localStorage.getItem(KEYS.en), 'a load writes nothing');
  }
});

test('the next shift is a proposal: the shift after the closed one, on the Handover page, to confirm or to change', { skip: !hasSite }, () => {
  const late = open({ storage: withHandover('en', { shift: 1 }) });
  closeShift(late);
  const field = (w, name) => $(w, `[data-start] [name="start-${name}"]`).value;
  assert.deepEqual([field(late, 'date'), field(late, 'shift'), field(late, 'area'), field(late, 'template')], ['2026-11-11', 'Night', 'Dock A', 'warehouse']);
  assert.match($(late, '[data-start-preview]').textContent, /^1 open issue will be carried over\.$/);
  // After the night shift, the early shift of the next day.
  const night = open({ storage: withHandover('en', { shift: 2 }) });
  closeShift(night);
  assert.deepEqual([field(night, 'date'), field(night, 'shift')], ['2026-11-12', 'Early']);
  // Changed by the visitor, and it stays as changed while they look.
  setStart(night, { date: '2026-11-13', shift: 1 });
  assert.deepEqual([field(night, 'date'), field(night, 'shift')], ['2026-11-13', 'Late']);
  startShift(night, {});
  const state = saved(night);
  assert.equal(state.idle, false);
  assert.deepEqual([state.current.date, state.current.shift, state.current.area], ['2026-11-13', 'Late', 'Dock A']);
  // The shift started is the active shift of the device, as the visitor chose it.
  assert.deepEqual(plain(night.ShiftContext.activeOn(SHIFTS.en, 'en')), { ok: true, active: plain(night.ShiftContext.active()), index: 1, label: 'Late' });
  assert.equal(night.ShiftContext.active().date, '2026-11-13');
  assert.equal($(night, '[data-start]').hidden, true);
  assert.equal($(night, '[data-handover]').closest('section').hidden, false);
});

// ---- 3 and 4. Carrying: only at the start, to the shift that follows, once ----

test('the open issues are carried when the following shift is started, with their count, and the closure and the handover name each other', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en', { issues: [issue('Ramp 3 blocked', { owner: 'Besnik', carried: 1 }), issue('Scanner 4 lost', { done: true }), issue('Pallets at door 2')] }) });
  closeShift(w);
  startShift(w, {});
  const state = saved(w);
  assert.deepEqual(state.current.issues.map((item) => [item.text, item.carried, item.owner, item.done]), [['Ramp 3 blocked', 2, 'Besnik', false], ['Pallets at door 2', 1, '', false]], 'the open ones, counted once more; the solved one stays behind');
  assert.deepEqual(state.current.carriedFrom, [state.history[0].closeId]);
  assert.deepEqual([state.history[0].carried.date, state.history[0].carried.shift], ['2026-11-11', 'Night']);
  assert.equal(state.current.from, 'Mira', 'the one who took over hands over next');
  assert.match($(w, '[data-status]').textContent, /Started the night shift handover with 2 carried issues\./);
  assert.match($(reload(w), '[data-history] details .sh-closure').textContent, /Its open issues were carried to Night, /);
});

test('asked twice, started once: a second click, a reload and a start repeated carry nothing again', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  setStart(w, {});
  const button = $(w, '[data-start-shift]');
  button.click();
  button.click();
  button.click();
  assert.deepEqual(openTexts(w), ['Ramp 3 blocked'], 'one handover, the issue once');
  assert.equal(saved(w).history.length, 1);
  const once = w.localStorage.getItem(KEYS.en);
  // A reload: the same handover, nothing to start.
  const page = reload(w);
  assert.equal(page.localStorage.getItem(KEYS.en), once);
  assert.equal($(page, '[data-start]').hidden, true);
  $(page, '[data-start-shift]').click();
  assert.equal(page.localStorage.getItem(KEYS.en), once, 'the hidden start does nothing to an open handover');
  // The shift closed and the one after it started: the issue goes on once, counted once more, from the new closure.
  closeShift(page);
  startShift(page, {});
  const state = saved(page);
  assert.deepEqual(state.current.issues.map((item) => [item.text, item.carried]), [['Ramp 3 blocked', 2]]);
  assert.deepEqual(state.current.carriedFrom, [state.history[0].closeId]);
  assert.ok(state.history.every((entry) => entry.carried), 'no closure is left waiting');
});

test('the mechanism itself refuses a second carrying: the closure named by a handover is never a source again', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  startShift(w, {});
  const state = saved(w);
  const { ShiftClose } = w;
  const target = { template: 'warehouse', date: '2026-11-12', shift: 'Early', area: 'Dock A' };
  assert.deepEqual(plain(ShiftClose.pending(state, SHIFTS.en, target)), []);
  // Even with the closure's own mark taken away, as an older copy of the history would have it.
  const unmarked = plain(state);
  delete unmarked.history[0].carried;
  assert.deepEqual(plain(ShiftClose.pending(unmarked, SHIFTS.en, target)), [], 'the handover that carried from it still names it');
  // And with the handover's own mark taken away instead.
  const unnamed = plain(state);
  delete unnamed.current.carriedFrom;
  assert.deepEqual(plain(ShiftClose.pending(unnamed, SHIFTS.en, target)), [], 'the closure still says where its issues went');
  // The start of the shift that is already open makes nothing.
  assert.deepEqual(plain(ShiftClose.start(state, { shifts: SHIFTS.en, template: 'warehouse', date: '2026-11-11', shift: 'Night', area: 'dock a', make: () => { throw new Error('made a handover'); }, merge: w.ShiftHandoverLink.mergeIssues })), { ok: true, started: false, added: 0, sources: 0, unclear: [] });
});

test('another workplace, an earlier shift or an unclear one carries nothing, and the closure goes on waiting', { skip: !hasSite }, () => {
  const cases = [
    ['another area', { area: 'Dock B' }],
    ['no area, where the closed shift had one', { area: '' }],
    ['another type of work', { template: 'delivery' }],
    ['an earlier shift of the same day', { shift: 0 }],
    ['the day before', { date: '2026-11-10', shift: 2 }],
  ];
  for (const [what, target] of cases) {
    const w = open({ storage: withHandover('en') });
    closeShift(w);
    setStart(w, target);
    assert.match($(w, '[data-start-preview]').textContent, /^Nothing will be carried over/, `${what}: said before the start`);
    $(w, '[data-start-shift]').click();
    const state = saved(w);
    assert.equal(state.idle, false, `${what}: the shift is started`);
    assert.deepEqual(state.current.issues, [], `${what}: nothing carried`);
    assert.ok(!('carriedFrom' in state.current) && !('carried' in state.history[0]), `${what}: the closure still waits`);
    // The shift that does follow, at the workplace of the closure, takes the issue later.
    closeShift(w);
    startShift(w, { date: '2026-11-12', shift: 1, area: 'DOCK  a', template: 'warehouse' });
    assert.deepEqual(openTexts(w), ['Ramp 3 blocked'], `${what}: carried by the shift that follows, area compared without case and spaces`);
  }
  // The mechanism: a date that is not one, or a shift the list does not have, cannot be placed and carries nothing.
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  const state = saved(w);
  const { ShiftClose } = w;
  for (const target of [{ date: '', shift: 'Night' }, { date: '12.11.2026', shift: 'Night' }, { date: '2026-11-12', shift: 'Graveyard' }]) {
    assert.deepEqual(plain(ShiftClose.pending(state, SHIFTS.en, { template: 'warehouse', area: 'Dock A', ...target })), [], JSON.stringify(target));
    assert.equal(ShiftClose.start(plain(state), { shifts: SHIFTS.en, template: 'warehouse', area: 'Dock A', ...target, make: () => ({}), merge: () => ({ issues: [] }) }).reason, 'invalid');
  }
  assert.equal(ShiftClose.compare(SHIFTS.en, { date: '2026-11-12', shift: 'Early' }, { date: '2026-11-11', shift: 'Night' }), 1, 'the early shift of the next day follows the night shift');
  assert.equal(ShiftClose.compare(SHIFTS.en, { date: '2026-11-11', shift: 'Early' }, { date: '2026-11-11', shift: 'Night' }), -1);
  assert.equal(ShiftClose.compare(SHIFTS.en, { date: '2026-11-11', shift: 'Night' }, { date: '2026-11-11', shift: 'Night' }), 0);
  assert.equal(ShiftClose.compare(SHIFTS.en, { date: '2026-11-11', shift: 'Nights' }, { date: '2026-11-11', shift: 'Night' }), null);
});

test('the history is only read: opening an entry, copying it and reloading carry nothing and start nothing', { skip: !hasSite }, async () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  const before = w.localStorage.getItem(KEYS.en);
  const page = reload(w);
  page.navigator.clipboard = { writeText: async () => {} };
  const details = $(page, '[data-history] details');
  details.open = true;
  details.dispatchEvent(new page.Event('toggle'));
  $(page, '[data-copy-history]').click();
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(page.localStorage.getItem(KEYS.en), before);
  assert.equal(page.ShiftContext.active(), null);
  assert.equal(isIdle(page), true);
  assert.deepEqual([...page.document.querySelectorAll('[data-history] button')].map((button) => Object.keys(button.dataset)), [['copyHistory']], 'the only thing an entry offers is a copy of its text');
});

test('a closed shift is not started again from the page; the closures of several shifts wait together and an issue they share arrives once', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  setStart(w, { date: '2026-11-11', shift: 1 });
  assert.match($(w, '[data-start-preview]').textContent, /This shift was closed in this area\. A closed shift is not started again\./);
  assert.equal($(w, '[data-start-shift]').disabled, true);
  assert.equal(w.ShiftClose.start(saved(w), { shifts: SHIFTS.en, template: 'warehouse', date: '2026-11-11', shift: 'Late', area: 'Dock A', make: () => ({}), merge: () => ({ issues: [] }) }).reason, 'closed');
  assert.equal(isIdle(w), true);
  // The same shift in another area is another workplace, and can be started.
  startShift(w, { date: '2026-11-11', shift: 1, area: 'Dock B' });
  assert.equal(isIdle(w), false);
  // Dock B is closed with the same issue written again and one of its own; the early shift of Dock A then starts.
  const state = saved(w);
  state.current.issues = [issue('Ramp 3 blocked'), issue('Dock B light out')];
  w.localStorage.setItem(KEYS.en, JSON.stringify(state));
  const page = reload(w);
  closeShift(page);
  startShift(page, { date: '2026-11-12', shift: 0, area: 'Dock A' });
  assert.deepEqual(openTexts(page), ['Ramp 3 blocked'], 'only the closure of Dock A is carried to Dock A');
  closeShift(page);
  // Two closures of Dock A wait for a later shift when one was skipped: started for Dock B in between.
  startShift(page, { date: '2026-11-12', shift: 1, area: 'Dock B' });
  assert.deepEqual(openTexts(page), ['Ramp 3 blocked', 'Dock B light out'], 'Dock B takes what waited for Dock B');
  closeShift(page);
  startShift(page, { date: '2026-11-12', shift: 2, area: 'Dock A' });
  assert.deepEqual(saved(page).current.issues.map((item) => [item.text, item.carried]), [['Ramp 3 blocked', 2]], 'the issue of Dock A, once, counted for each shift of Dock A it crossed');
});

test('an issue that cannot be told from one already carried is not added, and the page says so', { skip: !hasSite }, () => {
  // Two closures of the same workplace wait: the same words with another owner in each.
  const first = { closedAt: '2026-11-10T21:00:00.000Z', closeId: 'cfirstclosure0001', state: 'ready', written: true, changed: false, drafts: 0, text: '', handover: sheet('en', { date: '2026-11-10', issues: [issue('Ramp 3 blocked', { owner: 'Besnik' })] }) };
  const second = { closedAt: '2026-11-11T21:00:00.000Z', closeId: 'csecondclosure002', state: 'ready', written: true, changed: false, drafts: 0, text: '', handover: sheet('en', { date: '2026-11-11', issues: [issue('Ramp 3 blocked', { owner: 'Ana' }), issue('Door 2 jammed')] }) };
  const w = open({ storage: { [KEYS.en]: { current: sheet('en', { issues: [] }), idle: true, history: [second, first], received: [] } } });
  assert.match($(w, '[data-start-preview]').textContent, /^3 open issues will be carried over\.$/);
  startShift(w, { date: '2026-11-12', shift: 0 });
  const state = saved(w);
  assert.deepEqual(state.current.issues.map((item) => [item.text, item.owner]), [['Ramp 3 blocked', 'Besnik'], ['Door 2 jammed', '']], 'the first is carried; the second with the same words and another owner is not added by itself');
  assert.deepEqual(state.current.carriedFrom, ['cfirstclosure0001', 'csecondclosure002']);
  assert.match($(w, '[data-status]').textContent, /1 issue was not carried: it may be the same as one already carried\. It stays in the history\./);
  assert.ok(state.history.every((entry) => entry.carried), 'both closures are settled: nothing of them is carried later');
});

// ---- 6. Drafts, the closed shift, and a handover that arrives ----

test('closing warns about the unfinished forms of the shift and leaves them as they are', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  const late = { date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'en' };
  w.ShiftContext.setActive(late);
  w.ShiftContext.save({ tool: 'sc-damage-control', form: 'entry', scope: '', ...late }, { stage: 'Loading', note: 'wet box' });
  w.ShiftContext.save({ tool: 'sc-incomplete-control', form: 'entry', scope: '', ...late }, { note: 'two parcels' });
  w.ShiftContext.save({ tool: 'sc-damage-control', form: 'entry', scope: '', ...late, index: 2, label: 'Night' }, { note: 'of another shift' });
  const drafts = w.localStorage.getItem(DRAFTS);
  closeShift(w);
  assert.match(w.asked[0], /2 unfinished forms of this shift stay as drafts\./);
  assert.equal(w.localStorage.getItem(DRAFTS), drafts, 'not a draft was touched');
  assert.equal(saved(w).history[0].drafts, 2);
  assert.match($(reload(w), '[data-history] details .sh-closure').textContent, /2 unfinished forms of this shift were left as drafts\./);
  assert.equal(w.ShiftContext.active(), null);
  assert.equal(w.ShiftContext.drafts().length, 3, 'the drafts stay, to be carried or dropped by the visitor');
});

// A sealed handover arrives on a device and is opened with its code: the page shows what it holds. Nothing is taken
// over until the test clicks.
const TRANSFER = 'acid-acorn-acre-acts-afar-affix';
const arrive = async (w, options = {}) => {
  const sealed = await w.ShiftHandoverLink.packHandover({ template: 'warehouse', date: '2026-11-11', shift: 'Late', area: 'Dock A', from: '', to: '', metrics: [], issues: [issue('Ramp 3 blocked'), issue('From the sender')], headsUp: '', safety: '', checks: [] }, TRANSFER);
  const page = open({ pilot: false, ...options, storage: held(w), search: `#${sealed.fragment}` });
  const box = $(page, '[data-incoming]');
  for (let i = 0; i < 100 && box.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 10));
  const unlock = box.querySelector('[data-incoming-unlock]');
  unlock.elements.code.value = TRANSFER;
  unlock.dispatchEvent(new page.Event('submit', { bubbles: true, cancelable: true }));
  const preview = box.querySelector('[data-incoming-preview]');
  for (let i = 0; i < 300 && preview.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(preview.hidden, false, 'opened with the code');
  return page;
};
const take = async (page) => { $(page, '[data-incoming-open]').click(); await new Promise((resolve) => setTimeout(resolve, 20)); };
const TAKE_OVER = 'Take over the handover that arrived?\n\nThe late shift of Wed 11 Nov that is open here is closed first: it moves to the history as it is, and nothing is sent from it.\n\nIts 2 open issues stay open on the handover you take over, and are not carried again when a shift is started.';

test('a handover that arrives while one is open: the page says what taking over closes, then closes that one, and its open issues are not carried a second time', { skip: !hasSite }, async () => {
  const w = open({ storage: withHandover('en', { issues: [issue('Ramp 3 blocked'), issue('Mine alone')] }) });
  const page = await arrive(w);
  // Said in the box before the button is pressed, and asked again by the button.
  assert.match($(page, '[data-incoming-note]').textContent, /The late shift of Wed 11 Nov that is open here is closed first: it moves to the history as it is, and nothing is sent from it\. Its 2 open issues stay open on the handover you take over/);
  await take(page);
  assert.equal(page.asked.at(-1), TAKE_OVER);
  const state = saved(page);
  assert.deepEqual(state.current.issues.map((item) => item.text).sort(), ['From the sender', 'Mine alone', 'Ramp 3 blocked']);
  const [replaced] = state.history;
  assert.match(replaced.closeId, /^c/);
  assert.ok(replaced.carried, 'what was here is closed and not left waiting');
  assert.deepEqual(state.current.carriedFrom, [replaced.closeId]);
  assert.deepEqual(plain(page.ShiftClose.pending(state, SHIFTS.en, { template: 'warehouse', date: '2026-11-12', shift: 'Early', area: 'Dock A' })), []);
  // Closing it and starting the next shift carries each issue once.
  closeShift(page);
  startShift(page, {});
  assert.deepEqual(openTexts(page).sort(), ['From the sender', 'Mine alone', 'Ramp 3 blocked']);
});

test('taking over answered "no", or not saved: the open handover is not closed, nothing is lost and nothing is marked as carried', { skip: !hasSite }, async () => {
  const w = await settle(open({ storage: withHandover('en', { issues: [issue('Ramp 3 blocked'), issue('Mine alone')] }) }));
  const before = w.localStorage.getItem(KEYS.en);
  const untouched = (page, what) => {
    assert.equal(page.localStorage.getItem(KEYS.en), before, `${what}: stored to the byte as before`);
    assert.equal($(page, '[data-handover] [name=area]').value, 'Dock A', `${what}: the open handover is still the one shown`);
    assert.deepEqual([...page.document.querySelectorAll('[data-issue="text"]')].map((field) => field.value), ['Ramp 3 blocked', 'Mine alone'], `${what}: with its issues`);
    assert.equal(page.document.querySelectorAll('[data-history] details').length, 0, `${what}: nothing went to the history`);
    assert.equal($(page, '[data-incoming]').hidden, false, `${what}: the handover that arrived is still offered`);
    assert.ok(page.location.hash.startsWith('#h2='), `${what}: and still in the address`);
  };
  // "No".
  const refused = await arrive(w);
  refused.answer = false;
  await take(refused);
  assert.equal(refused.asked.at(-1), TAKE_OVER);
  untouched(refused, 'answered no');
  // "Yes", and the storage does not take it.
  const failing = await arrive(w);
  const restore = refuseSaves(failing);
  await take(failing);
  untouched(failing, 'not saved');
  assert.match($(failing, '[data-status]').textContent, /Not taken over: the browser's storage did not take it\. What was here is as it was\./);
  // The same page, once the storage works: taken over once, one closure, nothing carried twice.
  restore();
  await take(failing);
  const state = saved(failing);
  assert.equal(state.history.length, 1, 'one closure, not one for each attempt');
  assert.deepEqual(state.current.carriedFrom, [state.history[0].closeId]);
  assert.deepEqual(state.current.issues.map((item) => item.text).sort(), ['From the sender', 'Mine alone', 'Ramp 3 blocked']);
  assert.ok(state.current.issues.every((item) => item.carried === 0), 'no issue was counted as carried by the attempts');
  // The device that said no still closes and carries its own shift as if nothing had arrived.
  refused.answer = true;
  closeShift(refused);
  startShift(refused, {});
  assert.deepEqual(openTexts(refused).sort(), ['Mine alone', 'Ramp 3 blocked']);
  assert.ok(saved(refused).current.issues.every((item) => item.carried === 1));
});

test('a handover that arrives while no shift is open closes nothing, asks nothing, and takes the issues that waited', { skip: !hasSite }, async () => {
  const closed = open({ storage: held(idlePage()), search: sentSearch });
  const page = await arrive(closed);
  const asked = page.asked.length;
  assert.doesNotMatch($(page, '[data-incoming-note]').textContent, /closed first/);
  await take(page);
  assert.equal(page.asked.length, asked, 'no question: there is nothing here to close');
  const state = saved(page);
  assert.equal(state.history.length, 1, 'the closure from before, and no other');
  assert.equal(state.idle, false);
  assert.deepEqual(state.current.issues.map((item) => item.text).sort(), ['From the sender', 'Ramp 3 blocked', SENT]);
  assert.deepEqual(state.waiting, []);
});

// ---- An issue sent here while no shift is open ----

const SENT = 'Stacking rule as one picture';
const sentSearch = `?issue=${encodeURIComponent(SENT)}&owner=Mira&due=Friday`;
const idlePage = () => { const w = open({ storage: withHandover('en') }); closeShift(w); return w; };
// The storage refuses the handover's key, as a full or blocked storage would.
const refuseSaves = (w, key = KEYS.en) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (name, value) { if (name === key) throw new w.DOMException('full', 'QuotaExceededError'); return real.call(this, name, value); };
  return () => { w.Storage.prototype.setItem = real; };
};

test('an issue sent from 5 Whys while no shift is open is kept until a shift is started, once, through reloads', { skip: !hasSite }, () => {
  const closed = idlePage();
  let page = open({ storage: held(closed), search: sentSearch });
  assert.equal(isIdle(page), true, 'no shift is started for it');
  assert.deepEqual(saved(page).waiting.map(({ text, owner, due, from }) => [text, owner, due, from]), [[SENT, 'Mira', 'Friday', 'five-whys']]);
  assert.equal(page.location.search, '', 'the address is cleaned once the issue is stored');
  assert.match($(page, '[data-status]').textContent, /No shift is open\. “Stacking rule as one picture” is kept here and becomes an open issue of the shift you start\./);
  // A reload, and the same link opened a second time: still one.
  page = reload(page);
  assert.equal(saved(page).waiting.length, 1);
  page = open({ storage: held(page), search: sentSearch });
  assert.equal(saved(page).waiting.length, 1, 'the same issue sent again is not kept twice');
  assert.match($(page, '[data-status]').textContent, /already waits here/);
  // The start panel shows it and says what the start will do.
  assert.equal($(page, '[data-start-waiting]').hidden, false);
  assert.match($(page, '[data-start-waiting] li').textContent, /Stacking rule as one picture \(Mira · Friday\) · from 5 Whys/);
  assert.match($(page, '[data-start-preview]').textContent, /1 open issue will be carried over\. 1 issue sent here while no shift was open will be added\./);
  startShift(page, {});
  assert.deepEqual(openTexts(page).sort(), ['Ramp 3 blocked', SENT]);
  assert.deepEqual(saved(page).current.issues.find((item) => item.text === SENT), { text: SENT, priority: 'High', owner: 'Mira', due: 'Friday', done: false, carried: 0 });
  assert.deepEqual(saved(page).waiting, [], 'used up by the start');
  // Going on: a reload and a second click add nothing.
  $(page, '[data-start-shift]').click();
  page = reload(page);
  assert.equal(copiesOf(page, SENT), 1);
  // Closed and started again, it is carried like any open issue, once.
  closeShift(page);
  startShift(page, {});
  assert.equal(copiesOf(page, SENT), 1);
  assert.equal(saved(page).current.issues.find((item) => item.text === SENT).carried, 1);
});

test('an issue that waits is discarded only when the visitor says so', { skip: !hasSite }, () => {
  const page = open({ storage: held(idlePage()), search: sentSearch });
  const before = page.localStorage.getItem(KEYS.en);
  page.answer = false;
  $(page, '[data-discard-waiting]').click();
  assert.match(page.asked.at(-1), /^Discard “Stacking rule as one picture”\? It was sent here while no shift was open and is on no handover: discarded, it is gone\.$/);
  assert.equal(page.localStorage.getItem(KEYS.en), before, 'the answer "no" changes nothing');
  page.answer = true;
  $(page, '[data-discard-waiting]').click();
  assert.deepEqual(saved(page).waiting, []);
  assert.equal($(page, '[data-start-waiting]').hidden, true);
  startShift(page, {});
  assert.deepEqual(openTexts(page), ['Ramp 3 blocked'], 'a discarded issue joins no shift');
});

test('the action of an investigation waits the same way, and its note is used up only once the issue is stored', { skip: !hasSite }, () => {
  const note = { caseId: 'INV-7', from: 'cx-control-tower', issue: 'Call the carrier about route 12', owner: 'Arben', due: '2026-11-13' };
  const withNote = (w) => w.sessionStorage.setItem('sc-case-handoff', JSON.stringify(note));
  const closed = idlePage();
  // The storage does not take it: nothing is used up, so the page opened again still has the issue to offer.
  let restore;
  const failed = open({ storage: held(closed), search: '?case=INV-7', before: (w) => { withNote(w); restore = refuseSaves(w); } });
  assert.equal(failed.localStorage.getItem(KEYS.en), closed.localStorage.getItem(KEYS.en), 'nothing was stored');
  assert.equal(failed.location.search, '?case=INV-7', 'the address still asks for the case');
  assert.deepEqual(JSON.parse(failed.sessionStorage.getItem('sc-case-handoff')), note, 'the note is not used up');
  assert.match($(failed, '[data-status]').textContent, /could not be saved here/);
  assert.equal($(failed, '[data-start-waiting]').hidden, true, 'and the page does not show what it does not hold');
  restore();
  // Opened again with the storage working: kept, and now used up.
  const page = open({ storage: held(closed), search: '?case=INV-7', before: withNote });
  assert.deepEqual(saved(page).waiting.map(({ text, owner, due, from }) => [text, owner, due, from]), [[note.issue, 'Arben', '2026-11-13', 'cx-control-tower']]);
  assert.equal(page.sessionStorage.getItem('sc-case-handoff'), null);
  assert.equal(page.location.search, '');
  assert.match($(page, '[data-start-waiting] li').textContent, /from the CX Control Tower/);
  // A reload cannot add it again: the note is gone and the address is clean.
  assert.equal(saved(reload(page)).waiting.length, 1);
  startShift(page, {});
  assert.equal(copiesOf(page, note.issue), 1);
});

test('with a shift open, an issue sent here is not used up either before it is stored', { skip: !hasSite }, () => {
  let restore;
  const failed = open({ storage: withHandover('en'), search: sentSearch, before: (w) => { restore = refuseSaves(w); } });
  assert.equal(failed.location.search, sentSearch, 'the address keeps the issue');
  assert.ok(!$(failed, '[data-issues]').textContent.includes(SENT) && ![...failed.document.querySelectorAll('[data-issue="text"]')].some((field) => field.value === SENT), 'the page does not show an issue it could not store');
  restore();
  const page = open({ storage: held(failed), search: sentSearch });
  assert.equal(copiesOf(page, SENT), 1);
  assert.equal(page.location.search, '');
  assert.equal(copiesOf(open({ storage: held(page), search: sentSearch }), SENT), 1, 'sent again, it is already open here');
});

test('a start that cannot be saved starts nothing: the closure and the issue sent here still wait', { skip: !hasSite }, () => {
  const page = open({ storage: held(idlePage()), search: sentSearch });
  const before = page.localStorage.getItem(KEYS.en);
  const restore = refuseSaves(page);
  startShift(page, {});
  assert.equal(page.localStorage.getItem(KEYS.en), before);
  assert.equal($(page, '[data-start]').hidden, false, 'the page still shows that no shift is open');
  assert.equal(page.ShiftContext.active(), null, 'and no shift became active');
  restore();
  startShift(page, {});
  assert.deepEqual(openTexts(page).sort(), ['Ramp 3 blocked', SENT], 'started once the storage takes it, each issue once');
});

// ---- The limit of the history and the closures that still wait ----

test('more than thirty closures: an old closure whose issues still wait is not dropped, and is carried when its area starts again', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en', { date: '2026-10-01', shift: 0 }) });
  closeShift(w);
  const waitingId = saved(w).history[0].closeId;
  // Thirty-four shifts of another area follow, each started and closed here.
  for (let day = 0; day < 34; day += 1) {
    startShift(w, { date: new Date(Date.UTC(2026, 9, 2 + day)).toISOString().slice(0, 10), shift: 0, area: 'Dock B' });
    assert.equal(isIdle(w), false, `day ${day}: started`);
    closeShift(w);
  }
  const state = saved(w);
  assert.equal(state.history.length, 30, 'the history keeps to its limit');
  assert.equal(state.history.at(-1).closeId, waitingId, 'the oldest closure is the one that waits: thirty-four newer ones did not push it out');
  assert.equal(state.history.filter((entry) => entry.handover.area === 'Dock B').length, 29);
  assert.match($(reload(w), '[data-history] details:last-child .sh-closure').textContent, /Its open issues wait for the next shift started in this area\./);
  startShift(w, { date: '2026-11-11', shift: 0, area: 'Dock A' });
  assert.deepEqual(openTexts(w), ['Ramp 3 blocked'], 'carried after thirty-four other closures');
  // Carried, it waits for nothing and goes with the next closures like any other.
  closeShift(w);
  startShift(w, { date: '2026-11-12', shift: 0, area: 'Dock B' });
  closeShift(w);
  assert.ok(!saved(w).history.some((entry) => entry.closeId === waitingId), 'once carried it is dropped by the limit like the rest');
  assert.equal(saved(w).history.length, 30);
});

test('when every closure waits, the history grows past its limit rather than drop one', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  const state = { current: sheet('en'), idle: false, history: [], received: [] };
  for (let n = 0; n < 36; n += 1) {
    state.current = sheet('en', { area: `Area ${n}`, issues: [issue(`Open in area ${n}`)] });
    state.idle = false;
    w.ShiftClose.close(state, { text: '', placeholder: sheet('en'), max: 30 });
  }
  assert.equal(state.history.length, 36);
  assert.equal(w.ShiftClose.waiting(state).length, 36);
  // The page as it always closed uses the same rule: a closure that waits is not sliced away by it either.
  const carried = plain(state);
  carried.history.forEach((entry) => { entry.carried = { date: '2026-11-12', shift: 'Early', at: '2026-11-12T05:00:00.000Z' }; });
  const old = open({ pilot: false, storage: { [KEYS.en]: { ...carried, idle: false, current: sheet('en', { area: 'Elsewhere', issues: [] }) } } });
  closeShift(old);
  assert.equal(saved(old).history.length, 30, 'closures that wait for nothing are dropped by the limit there as before');
});

test('"Delete history" says when open issues still wait, and the answer "no" changes nothing', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en', { issues: [issue('Ramp 3 blocked'), issue('Scanner 4 broken'), issue('Solved one', { done: true })] }) });
  closeShift(w);
  startShift(w, { area: 'Dock B' });
  closeShift(w);
  const before = w.localStorage.getItem(KEYS.en);
  w.answer = false;
  $(w, '[data-clear-history]').click();
  assert.equal(w.asked.at(-1), 'Delete all earlier handovers on this device?\n\n2 open issues of closed shifts still wait to be carried over. They are deleted too, and will not be carried to any shift.');
  assert.equal(w.localStorage.getItem(KEYS.en), before, 'not deleted');
  assert.equal(w.document.querySelectorAll('[data-history] details').length, 2);
  w.answer = true;
  $(w, '[data-clear-history]').click();
  assert.deepEqual(saved(w).history, []);
  assert.equal(isIdle(w), true, 'deleting the history starts nothing');
  // Nothing waits: the question is the one the page always asked.
  const carried = open({ storage: withHandover('en') });
  closeShift(carried);
  startShift(carried, {});
  $(carried, '[data-clear-history]').click();
  assert.equal(carried.asked.at(-1), 'Delete all earlier handovers on this device?');
  const one = open({ storage: withHandover('en') });
  closeShift(one);
  one.answer = false;
  $(one, '[data-clear-history]').click();
  assert.match(one.asked.at(-1), /\n\n1 open issue of a closed shift still waits to be carried over\. It is deleted too, and will not be carried to any shift\.$/);
});

// ---- "Changed after it was shared" ----

test('a handover changed after it was shared says so, beside the state it had, and the closure keeps it', { skip: !hasSite }, async () => {
  const probe = await settle(open({ storage: withHandover('en') }));
  const current = saved(probe).current;
  const shared = { ...current, shared: [{ id: 'abc123', at: '2026-11-11T20:00:00.000Z', mode: 'link', ack: 'XK', sum: probe.ShiftClose.sum(current) }] };
  const w = open({ storage: { [KEYS.en]: { current: shared, history: [], received: [] } } });
  const title = () => $(w, '[data-output-title]').textContent;
  const line = () => $(w, '[data-transfer-state]').textContent;
  assert.equal(title(), 'Shared, not yet confirmed by the other device');
  assert.doesNotMatch(line(), /Changed after it was shared/);
  // The visitor changes it.
  const area = $(w, '[data-handover] [name=area]');
  area.value = 'Dock A, door 2';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.equal(title(), 'Shared, not yet confirmed by the other device', 'the state is the one it was: it was shared');
  assert.match(line(), /Changed after it was shared at \d\d:\d\d: the other device has the earlier version\. Share it again to send this one\./);
  // Put back as it was shared: no longer changed.
  area.value = 'Dock A';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
  assert.doesNotMatch(line(), /Changed after it was shared/);
  area.value = 'Dock A, door 2';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 150));
  closeShift(w);
  assert.match(w.asked[0], /It was changed after it was last shared\./);
  assert.doesNotMatch(w.asked[0], /It has not been sent to another device\./);
  const [entry] = saved(w).history;
  assert.deepEqual([entry.state, entry.changed], ['shared', true]);
  assert.match($(reload(w), '[data-history] details .sh-closure').textContent, /Closed after it was shared; the other device had not confirmed\. It was changed after it was last shared\./);
  // A share made by the page as it was before kept nothing of what was shared: it says nothing either way.
  const old = open({ storage: { [KEYS.en]: { current: { ...current, area: 'Changed', shared: [{ id: 'abc123', at: '2026-11-11T20:00:00.000Z', mode: 'link', ack: 'XK' }] }, history: [], received: [] } } });
  assert.doesNotMatch($(old, '[data-transfer-state]').textContent, /Changed after it was shared/);
  // What this device keeps of where the issues came from does not travel with a handover.
  assert.ok(!('carriedFrom' in probe.ShiftHandoverLink.forTransfer({ ...current, carriedFrom: ['cabcdefgh12345678'] }, { names: true })));
});

// ---- 5. Team sync: K1–K6 ----

const CODE = 'acid-acorn-acre-acts-afar-affix';
const ENDPOINT = 'https://sync.example.test';
const fakeServer = () => {
  const spaces = new Map();
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  let updated = 1_000_000;
  const fetch = async (url, init = {}) => {
    const id = (/\/v1\/spaces\/([0-9a-f]{64})$/.exec(url) || [])[1];
    if (!id) return reply(404, { error: 'not-found' });
    const meta = spaces.get(id);
    if ((init.method || 'GET') === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    const token = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
    if (!token || (meta && meta.token !== token)) return reply(403, { error: 'token' });
    const body = JSON.parse(init.body);
    const rev = meta ? meta.rev : 0;
    if (body.rev !== rev) return reply(409, { rev });
    updated += 5000;
    spaces.set(id, { rev: rev + 1, updated, iv: body.iv, data: body.data, token });
    return reply(200, { rev: rev + 1, updated });
  };
  return { spaces, fetch };
};
const SYNC_SCRIPTS = [...PAGE_SCRIPTS, 'team-sync'];
const damageRow = (stage) => ({ date: '2026-11-11', shift: 'Late', stage, type: 'Crushed', cause: 'Stacking', units: 1, cost: null, note: '' });
// A device of the team: the handover box ticked, as a device that shared it before would have it.
const teamDevice = async (lang, who, stage) => {
  const w = open({ lang, scripts: SYNC_SCRIPTS, storage: {
    ...withHandover(lang, { issues: [issue('Ramp 3 blocked'), issue(`${who}: an issue of its own`)] }),
    'sc-damage-control': { rows: [damageRow('Loading'), damageRow(stage)] },
    'sc-actions': { rows: [{ id: `a-${who}`, title: `Action of ${who}`, status: 'open', created: '2026-11-11' }] },
    'sc-team-state': { choices: { 'shift-handover': true } },
  } });
  // The real page: this device closes its shift and starts the next, and has a draft and an active shift.
  closeShift(w);
  startShift(w, {});
  w.ShiftContext.save({ tool: 'sc-damage-control', form: 'entry', scope: '', date: '2026-11-11', index: 2, of: 3, label: SHIFTS[lang][2], list: lang }, { note: `draft of ${who}` });
  const keys = await w.TeamSyncMath.deriveKeys(CODE, 1000);
  const selected = (key) => w.TeamSyncMath.isOn(w.WorkBackup.toolSlug(key), JSON.parse(w.localStorage.getItem('sc-team-state')).choices || {});
  return { w, keys, selected, who };
};
const sync = async (dev, server) => {
  const result = await dev.w.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys, selected: dev.selected, create: true, wait: async () => {} });
  assert.ok(['synced', 'unchanged'].includes(result.status), `sync of ${dev.who}: ${result.status}`);
};
const teamCopy = async (server, dev) => plain(await dev.w.TeamSyncMath.unseal(server.spaces.get(dev.keys.spaceId), dev.keys.key));

test('K1, K2, K3, K6: two devices with the handover ticked and other handovers for the same shift: both stay to the byte, the damage rows and the actions merge, and the team gets no handover, shift or draft', { skip: !hasSite }, async () => {
  for (const lang of ['en', 'de', 'sq']) {
    const server = fakeServer();
    const a = await teamDevice(lang, 'A', 'Packing');
    const b = await teamDevice(lang, 'B', 'Receiving');
    assert.equal(a.selected(KEYS[lang]), true, 'the device ticked the handover before');
    assert.notEqual(a.w.localStorage.getItem(KEYS[lang]), b.w.localStorage.getItem(KEYS[lang]), 'two other handovers of the same shift');
    const before = { a: held(a.w), b: held(b.w) };
    for (const dev of [a, b, a, b]) await sync(dev, server);
    for (const [dev, was] of [[a, before.a], [b, before.b]]) {
      assert.equal(dev.w.localStorage.getItem(KEYS[lang]), was[KEYS[lang]], `${lang} K1: the handover and its history of ${dev.who}, to the byte`);
      for (const key of [ACTIVE, DRAFTS]) assert.equal(dev.w.localStorage.getItem(key), was[key], `${lang} K6: ${key} of ${dev.who} as it was`);
      assert.deepEqual(JSON.parse(dev.w.localStorage.getItem('sc-damage-control')).rows.map((row) => row.stage).sort(), ['Loading', 'Packing', 'Receiving'], `${lang} K2: the damage rows of both on ${dev.who}`);
      assert.deepEqual(JSON.parse(dev.w.localStorage.getItem('sc-actions')).rows.map((row) => row.id).sort(), ['a-A', 'a-B'], `${lang}: the actions of both on ${dev.who}`);
    }
    const team = await teamCopy(server, a);
    assert.deepEqual(Object.keys(team.items).sort(), ['sc-actions', 'sc-damage-control'], `${lang} K3 and K6: the team's copy holds the log and the actions, nothing of the handover, the shift or the drafts`);
    assert.ok(!JSON.stringify(team).includes('Ramp 3 blocked'), `${lang}: not a word of a handover`);
  }
});

test('K3, K4: where the new way of closing is on, the handover is not offered for team sync in any language, whatever the device ticked', { skip: !hasSite }, async () => {
  const w = open({ scripts: SYNC_SCRIPTS });
  for (const key of Object.values(KEYS)) assert.equal(w.TeamSyncMath.sharable(key), false, `${key} is not shared`);
  for (const key of ['sc-damage-control', 'sc-damage-control-sq', 'sc-incomplete-control-de', 'sc-night-audit', 'sc-actions', 'sc-workplace']) assert.equal(w.TeamSyncMath.sharable(key), true, `${key} is shared as before`);
  // A key that only looks like the handover's is not caught by the rule; a setting was never shared.
  assert.equal(w.TeamSyncMath.sharable('sc-shift-handover-notes'), true);
  for (const key of ['sc-shift-ui', 'sc-drafts-ui', PILOT]) assert.equal(w.TeamSyncMath.sharable(key), false, `${key} is a setting`);
});

test('K5: a handover an older page left in the team\'s copy is not read, and stays there untouched', { skip: !hasSite }, async () => {
  const server = fakeServer();
  const a = await teamDevice('en', 'A', 'Packing');
  await sync(a, server);
  // The team's copy as a page from before would have left it: with a handover of its own in it.
  const old = JSON.stringify({ current: sheet('en', { issues: [issue('From the old team copy')] }), history: [{ closedAt: '2026-11-01T06:00:00.000Z', handover: sheet('en', { date: '2026-10-31' }), text: 'old' }], received: [] });
  const space = server.spaces.get(a.keys.spaceId);
  const payload = await a.w.TeamSyncMath.unseal(space, a.keys.key);
  const sealed = await a.w.TeamSyncMath.seal({ ...payload, items: { ...payload.items, [KEYS.en]: old, [KEYS.sq]: old } }, a.keys.key);
  server.spaces.set(a.keys.spaceId, { ...space, iv: sealed.iv, data: sealed.data });
  const b = await teamDevice('en', 'B', 'Receiving');
  const before = { a: a.w.localStorage.getItem(KEYS.en), b: b.w.localStorage.getItem(KEYS.en) };
  for (const dev of [b, a, b, a]) await sync(dev, server);
  assert.equal(a.w.localStorage.getItem(KEYS.en), before.a, 'A keeps its own handover');
  assert.equal(b.w.localStorage.getItem(KEYS.en), before.b, 'B, new to the team, keeps its own and takes none');
  assert.equal(b.w.localStorage.getItem(KEYS.sq), null, 'and no handover of another language arrives');
  assert.ok(!held(b.w)[KEYS.en].includes('From the old team copy'));
  const team = await teamCopy(server, a);
  assert.equal(team.items[KEYS.en], old, 'what was in the team\'s copy is left as it was: not read, not written, not deleted');
  assert.equal(team.items[KEYS.sq], old);
  assert.deepEqual(JSON.parse(b.w.localStorage.getItem('sc-damage-control')).rows.map((row) => row.stage).sort(), ['Loading', 'Packing', 'Receiving'], 'the damage rows still merge');
});

// ---- 6. The saved file: K7–K13 ----

const fileOf = (w) => plain(w.WorkBackup.makeBackup(w.localStorage));
const putBack = async (w, file) => {
  const picker = $(w, '[data-work-open]');
  const text = JSON.stringify(file);
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'work.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new w.Event('change'));
  for (let i = 0; i < 100 && !w.reloads; i++) await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(w.reloads, 1, 'the file was opened');
  return reload(w);
};
const copiesOf = (w, text = 'Ramp 3 blocked') => saved(w).current.issues.filter((item) => item.text === text).length;
const everyHandover = (w) => { const state = saved(w); return [...(state.idle ? [] : [state.current]), ...state.history.map((entry) => entry.handover)]; };
// K13: no handover holds an issue of one closure twice.
const noDouble = (w, what) => everyHandover(w).forEach((h) => {
  const texts = h.issues.map((item) => item.text);
  assert.equal(new Set(texts).size, texts.length, `${what}: ${h.shift} ${h.date} holds each issue once`);
});
const lateShift = () => { const w = open({ storage: withHandover('en') }); w.ShiftContext.setActive({ date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'en' }); return w; };

test('K7 (R1): a file saved after the carrying, put back: the shift started is still the open one, starting it again adds nothing, the active shift stays', { skip: !hasSite }, async () => {
  let w = lateShift();
  closeShift(w);
  startShift(w, {});
  const file = fileOf(w);
  const state = saved(w);
  state.current.issues.push(issue('Written after the file was saved'));
  w.localStorage.setItem(KEYS.en, JSON.stringify(state));
  w = await putBack(reload(w), file);
  assert.equal(isIdle(w), false);
  assert.deepEqual(openTexts(w), ['Ramp 3 blocked'], 'as the file had it: what was written after it is in the restore point, not here');
  assert.equal($(w, '[data-start]').hidden, true, 'nothing to start');
  assert.deepEqual(plain(w.ShiftClose.start(saved(w), { shifts: SHIFTS.en, template: 'warehouse', date: '2026-11-11', shift: 'Night', area: 'Dock A', make: () => { throw new Error('made'); }, merge: w.ShiftHandoverLink.mergeIssues })), { ok: true, started: false, added: 0, sources: 0, unclear: [] });
  assert.equal(copiesOf(w), 1);
  assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().label], ['2026-11-11', 'Night'], 'K12: the active shift is the open handover\'s, so it stays');
  noDouble(w, 'K13');
});

test('K8 (R2): a file saved before the carrying, put back: no shift is active, the start carries, and the handover has each issue once', { skip: !hasSite }, async () => {
  let w = lateShift();
  closeShift(w);
  const file = fileOf(w);
  startShift(w, {});
  assert.equal(w.ShiftContext.active().label, 'Night');
  w = await putBack(reload(w), file);
  assert.equal(isIdle(w), true, 'the handover of the night shift is gone with the file');
  assert.equal(w.ShiftContext.active(), null, 'K12: no shift is active');
  assert.ok(!('carried' in saved(w).history[0]), 'the closure waits again, as it did when the file was saved');
  startShift(w, {});
  assert.equal(copiesOf(w), 1, 'carried again, into a handover that did not have it');
  assert.deepEqual(saved(w).current.issues.map((item) => item.carried), [1]);
  noDouble(w, 'K13');
});

test('K9 (R3): a file saved before the closing, put back: the shift is open again, no shift is active, and closing it again is another closure', { skip: !hasSite }, async () => {
  let w = lateShift();
  const file = fileOf(w);
  closeShift(w);
  const firstId = saved(w).history[0].closeId;
  startShift(w, {});
  w = await putBack(reload(w), file);
  const state = saved(w);
  assert.deepEqual([state.idle === true, state.history.length, state.current.shift], [false, 0, 'Late'], 'the late shift is open as the file had it, and its closure is gone');
  assert.equal(w.ShiftContext.active(), null, 'K12: the night shift was active; the handover put back is not of it');
  closeShift(w);
  const secondId = saved(w).history[0].closeId;
  assert.match(secondId, /^c[a-z0-9]{15}$/);
  assert.notEqual(secondId, firstId, 'a closure of its own');
  startShift(w, {});
  assert.equal(copiesOf(w), 1);
  assert.deepEqual(saved(w).current.carriedFrom, [secondId]);
  noDouble(w, 'K13');
});

test('K10 (R4): a file without the handover, put back: the handover and its history are not touched, and the active shift stays', { skip: !hasSite }, async () => {
  let w = lateShift();
  closeShift(w);
  startShift(w, {});
  const before = w.localStorage.getItem(KEYS.en);
  const active = w.localStorage.getItem(ACTIVE);
  const other = open({ storage: { 'sc-damage-control': { rows: [damageRow('Loading')] } } });
  const file = fileOf(other);
  assert.deepEqual(Object.keys(file.items), ['sc-damage-control']);
  w = await putBack(reload(w), file);
  assert.equal(w.localStorage.getItem(KEYS.en), before);
  assert.equal(w.localStorage.getItem(ACTIVE), active, 'K12: the handover open now is still the active shift\'s');
  assert.equal(copiesOf(w), 1);
  noDouble(w, 'K13');
});

test('K11 (R5): a file from the page as it was before, put back: its closures have no id and are never carried', { skip: !hasSite }, async () => {
  // As the page wrote it before: closing made the next handover at once, with the open issues in it.
  const legacy = { current: sheet('en', { shift: 2, from: 'Mira', to: '', issues: [issue('Ramp 3 blocked', { carried: 1 })] }), history: [{ closedAt: '2026-11-11T21:40:00.000Z', handover: sheet('en'), text: 'Shift handover | Dock A' }], received: [] };
  const old = open({ storage: { [KEYS.en]: legacy } });
  const file = fileOf(old);
  let w = await putBack(open({ storage: withHandover('en', { date: '2026-11-13', issues: [] }) }), file);
  const state = saved(w);
  assert.equal(state.history[0].closeId, undefined, 'a closure of before has no id');
  assert.deepEqual(plain(w.ShiftClose.pending(state, SHIFTS.en, { template: 'warehouse', date: '2026-11-12', shift: 'Early', area: 'Dock A' })), [], 'and never waits');
  assert.equal(copiesOf(w), 1, 'the handover it made at once has the issue, once');
  // Closed with the page as it is now and the next shift started: the issue goes on from the new closure alone.
  closeShift(w);
  startShift(w, {});
  const after = saved(w);
  assert.deepEqual(after.current.issues.map((item) => [item.text, item.carried]), [['Ramp 3 blocked', 2]]);
  assert.deepEqual(after.current.carriedFrom, [after.history[0].closeId]);
  assert.equal(after.history[1].carried, undefined, 'the closure of before was left alone');
  noDouble(w, 'K13');
});

test('K12: after a file is put back the active shift stays only for the handover that is open now, date and shift', { skip: !hasSite }, async () => {
  const cases = [
    ['the open handover is of the active shift', { date: '2026-11-11', shift: 1 }, true],
    ['another shift of the same day is open', { date: '2026-11-11', shift: 2 }, false],
    ['the same shift of another day is open', { date: '2026-11-12', shift: 1 }, false],
  ];
  for (const [what, target, kept] of cases) {
    const source = open({ storage: withHandover('en', target) });
    const file = fileOf(source);
    let w = lateShift();
    w = await putBack(w, file);
    assert.equal(Boolean(w.ShiftContext.active()), kept, what);
  }
  // No shift open in the file: none is active after it.
  const closedSource = open({ storage: withHandover('en') });
  closeShift(closedSource);
  let w = await putBack(lateShift(), fileOf(closedSource));
  assert.equal(w.ShiftContext.active(), null);
  // A shift chosen on the page of another language is measured against that language's handover, not this one.
  const sq = open({ lang: 'sq', storage: withHandover('sq') });
  sq.ShiftContext.setActive({ date: '2026-11-11', index: 1, of: 3, label: 'Pasdite', list: 'sq' });
  const kept = await putBack(sq, fileOf(open({ lang: 'sq', storage: withHandover('sq') })));
  assert.equal(kept.ShiftContext.active().label, 'Pasdite');
  const crossed = open({ storage: { ...withHandover('en'), ...withHandover('sq', { date: '2026-11-12' }) } });
  crossed.ShiftContext.setActive({ date: '2026-11-11', index: 1, of: 3, label: 'Pasdite', list: 'sq' });
  w = await putBack(crossed, fileOf(open({ storage: withHandover('en') })));
  assert.equal(w.ShiftContext.active(), null, 'the Albanian handover open now is of another day');
});

test('K12: the active shift is kept only when it is proved to be the open handover\'s shift; what does not match or cannot be proved is cleared, with the reason', { skip: !hasSite }, async () => {
  const late = { date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'en' };
  const check = (storage, shift = late) => {
    const w = open({ storage });
    assert.equal(w.ShiftContext.setActive(shift).ok, true);
    const result = plain(w.ShiftContext.keepActiveIfOpen());
    return { ...result, active: w.ShiftContext.active() };
  };
  // Proved: a handover is open under the list's own key, of the same date and the same shift.
  const proved = check(withHandover('en'));
  assert.deepEqual([proved.kept, proved.reason], [true, undefined]);
  assert.equal(proved.active.label, 'Late');
  // Each part of the proof, missing in turn.
  const closed = idlePage();
  for (const [what, storage, reason] of [
    ['no handover is stored', {}, 'idle'],
    ['the last shift was closed and none started', { [KEYS.en]: closed.localStorage.getItem(KEYS.en) }, 'idle'],
    ['another shift of the day is open', withHandover('en', { shift: 2 }), 'other-shift'],
    ['the same shift of another day is open', withHandover('en', { date: '2026-11-12' }), 'other-shift'],
    ['what is stored is not a handover', { [KEYS.en]: '{"current":' }, 'unreadable'],
    ['what is stored has no open handover in it', { [KEYS.en]: '{"history":[]}' }, 'unreadable'],
    ['only the handover of another language is open', withHandover('sq'), 'idle'],
  ]) {
    const result = check(storage);
    assert.deepEqual([result.kept, result.reason, result.active], [false, reason, null], what);
  }
  // A shift of the profile's list, with an open handover of the same date and the very same word. It is cleared, and
  // not because of where it came from: a handover keeps its shift as a word of the page's built-in list, and the
  // profile's list is another list. Here the profile has two shifts, "Late" the first of them; on the page "Late" is
  // the second of three. The word is the same; nothing stored says the shift is.
  const profileLate = { date: '2026-11-11', index: 0, of: 2, label: 'Late', list: 'profile' };
  const page = open({ storage: withHandover('en') });
  assert.equal(saved(page) === null ? 'Late' : JSON.parse(page.localStorage.getItem(KEYS.en)).current.shift, 'Late', 'the open handover has the same word');
  assert.deepEqual(plain(page.ShiftContext.place(profileLate, SHIFTS.en, 'en')), { state: 'unclear', candidates: [] }, 'the profile\'s shift and the page\'s list cannot be compared');
  assert.deepEqual(plain(page.ShiftContext.place(late, SHIFTS.en, 'en')), { state: 'same', index: 1, candidates: [1] }, 'a shift of the page\'s own list can');
  const unclear = check(withHandover('en'), profileLate);
  assert.deepEqual([unclear.kept, unclear.reason, unclear.active], [false, 'unprovable', null]);
  // Even a profile list with the same words in the same order proves nothing by itself: the list is the visitor's to change.
  const twin = check(withHandover('en'), { date: '2026-11-11', index: 1, of: 3, label: 'Late', list: 'profile' });
  assert.deepEqual([twin.kept, twin.reason], [false, 'unprovable']);
  // The same through the real file box.
  const w = open({ storage: withHandover('en') });
  w.ShiftContext.setActive(profileLate);
  const after = await putBack(w, fileOf(open({ storage: withHandover('en') })));
  assert.equal(after.ShiftContext.active(), null, 'a file put back clears a shift that cannot be proved');
  // With no active shift there is nothing to keep or to clear.
  assert.deepEqual(plain(open({ storage: withHandover('en') }).ShiftContext.keepActiveIfOpen()), { ok: true, kept: false, reason: 'none' });
});

// ---- 15 and 16. What the page and the document say ----

test('K15: the Handover page says in every language that team sync does not share the handover, where the new way of closing is on', { skip: !hasSite }, () => {
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  const said = ['The new shift close is on, on this device.', 'Team sync does not share the handover or its history: each device keeps its own. A handover reaches another device only when you send it from here.'];
  const word = (lang, text) => (lang === 'en' ? text : ui[lang][text]);
  for (const lang of ['en', 'de', 'sq']) {
    for (const text of said) if (lang !== 'en') assert.ok(ui[lang][text] && ui[lang][text] !== text, `${lang}: translated`);
    const on = open({ lang, storage: withHandover(lang) });
    const off = open({ lang, pilot: false, storage: withHandover(lang) });
    const note = (w) => $(w, '.sh-sync-note');
    assert.equal(note(on).hidden, false, `${lang}: shown where it is on`);
    for (const text of said) assert.ok(note(on).textContent.includes(word(lang, text)), `${lang}: ${text}`);
    assert.equal(note(off).hidden, true, `${lang}: not shown where it is off, where team sync shares the handover as before`);
    // The button says what it does in each state, in the page's language.
    assert.equal($(on, '[data-close]').textContent, word(lang, 'Close the shift'));
    assert.equal($(off, '[data-close]').textContent, word(lang, 'Close shift, start the next'));
    for (const text of ['Start this shift', 'No shift is open', 'Start the next shift']) assert.ok(on.document.body.textContent.includes(word(lang, text)), `${lang}: ${text}`);
  }
});

test('K15: the Tools Guide says it too, in its three languages, in the edition that is on the site and in its PDF', { skip: !hasSite }, async () => {
  const guide = (await import('../src/_data/toolsGuide.js')).default;
  const said = {
    en: 'Without the pilot, team sync shares the handover only where it is ticked. With the new shift close turned on (a pilot, on one device), it shares neither the handover nor its history: the handover reaches another device only when you send it.',
    sq: 'Pa pilotin, Sinkronizimi i ekipit e ndan dorëzimin vetëm aty ku është zgjedhur. Me mbylljen e re të turnit të ndezur (një pilot, në një pajisje), ai nuk ndan as dorëzimin, as historikun e tij: dorëzimi arrin në një pajisje tjetër vetëm kur e dërgon ti.',
    de: 'Ohne den Piloten teilt die Team-Synchronisierung die Übergabe nur dort, wo sie angehakt ist. Mit eingeschaltetem neuem Schichtabschluss (ein Pilot, auf einem Gerät) teilt sie weder die Übergabe noch ihren Verlauf: Die Übergabe erreicht ein anderes Gerät nur, wenn Sie sie senden.',
  };
  assert.ok(guide.edition >= 9, 'a new edition: the earlier one is kept as it was printed');
  assert.ok(guide.editions.find((edition) => edition.number === 8).pdf, 'edition 8 is archived');
  for (const lang of ['en', 'sq', 'de']) {
    assert.ok(fs.existsSync(`src/media/guides/tools-guide/editions/tools-guide-8-${lang}.pdf`), `${lang}: the PDF of edition 8 is kept`);
    assert.ok(guide[lang].tools['/tools/shift-handover/'].data.endsWith(said[lang]), `${lang}: the guide's text`);
    assert.ok(guide.editions[0].changes[lang].some((line) => /pilot/i.test(line)), `${lang}: the edition says what changed`);
    // The reader on the site, and the tool page that shows its page of the guide.
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const words = (file) => fs.readFileSync(`_site/${prefix}${file}`, 'utf8').replace(/<[^>]+>/g, '').replace(/&nbsp;|­/g, ' ').replace(/\s+/g, ' ');
    assert.ok(words('guides/tools-guide.html').includes(said[lang]), `${lang}: the reader`);
    // The guide still names the button as the page shows it where nothing was turned on.
    const button = lang === 'en' ? 'Close shift, start the next' : JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'))['Close shift, start the next'];
    assert.ok(words('guides/tools-guide.html').includes(button), `${lang}: the button's name in the guide`);
    assert.equal($(open({ lang, pilot: false }), '[data-close]').textContent, button, `${lang}: and on the page`);
  }
});

test('K16: the document says what is kept and names both things that are not guaranteed', () => {
  const doc = fs.readFileSync('docs/DATA-FORMATS.md', 'utf8').replace(/\s+/g, ' ');
  assert.match(doc, /no handover holds twice an issue carried from the same closure/i);
  assert.match(doc, /It is not guaranteed that the carrying happens once in time/);
  assert.match(doc, /Nothing is guaranteed between devices/);
  for (const word of ['closeId', 'carriedFrom', 'ONE_DEVICE', 'keepActiveIfOpen']) assert.ok(doc.includes(word), word);
});
