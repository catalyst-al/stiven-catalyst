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
const PAGE_SCRIPTS = ['tool-kit', 'shift-context', 'shift-close', 'shift-handover', 'storage-guard', 'work-backup'];

// The Shift Handover page as it is built, with the scripts it loads run from src/js. `storage` is what the browser
// holds when the page opens; confirm() answers yes and keeps what it was asked.
const open = ({ lang = 'en', storage = {}, search = '', scripts = PAGE_SCRIPTS, before } = {}) => {
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
const reload = (w, options = {}) => open({ lang: w.lang, ...options, storage: held(w) });
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

test('a handover that arrives while one is open closes that one, and its open issues are not carried a second time', { skip: !hasSite }, async () => {
  const w = open({ storage: withHandover('en', { issues: [issue('Ramp 3 blocked'), issue('Mine alone')] }) });
  const Link = w.ShiftHandoverLink;
  const CODE = 'acid-acorn-acre-acts-afar-affix';
  const sealed = await Link.packHandover({ template: 'warehouse', date: '2026-11-11', shift: 'Late', area: 'Dock A', from: '', to: '', metrics: [], issues: [issue('Ramp 3 blocked'), issue('From the sender')], headsUp: '', safety: '', checks: [] }, CODE);
  const page = open({ storage: held(w), search: `#${sealed.fragment}` });
  const box = $(page, '[data-incoming]');
  for (let i = 0; i < 100 && box.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 10));
  const unlock = box.querySelector('[data-incoming-unlock]');
  unlock.elements.code.value = CODE;
  unlock.dispatchEvent(new page.Event('submit', { bubbles: true, cancelable: true }));
  const preview = box.querySelector('[data-incoming-preview]');
  for (let i = 0; i < 300 && preview.hidden; i++) await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(preview.hidden, false, 'opened with the code');
  box.querySelector('[data-incoming-open]').click();
  await new Promise((resolve) => setTimeout(resolve, 20));
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

test('an issue sent from another tool while no shift is open is not put anywhere, and no shift is started for it', { skip: !hasSite }, () => {
  const w = open({ storage: withHandover('en') });
  closeShift(w);
  const before = w.localStorage.getItem(KEYS.en);
  const page = open({ storage: held(w), search: '?issue=Stacking%20rule%20as%20one%20picture' });
  assert.equal(page.localStorage.getItem(KEYS.en), before);
  assert.match($(page, '[data-status]').textContent, /No shift is open\. Start the shift, then send the issue again\./);
  assert.equal(page.location.search, '', 'the address is cleaned');
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

test('K3, K4: the handover is not offered for team sync in any language, whatever a device ticked', { skip: !hasSite }, async () => {
  const w = open({ scripts: SYNC_SCRIPTS });
  for (const key of Object.values(KEYS)) assert.equal(w.TeamSyncMath.sharable(key), false, `${key} is not shared`);
  for (const key of ['sc-damage-control', 'sc-damage-control-sq', 'sc-incomplete-control-de', 'sc-night-audit', 'sc-actions', 'sc-workplace']) assert.equal(w.TeamSyncMath.sharable(key), true, `${key} is shared as before`);
  // A key that only looks like the handover's is not caught by the rule; a setting was never shared.
  assert.equal(w.TeamSyncMath.sharable('sc-shift-handover-notes'), true);
  assert.equal(w.TeamSyncMath.sharable('sc-shift-ui'), false);
  assert.equal(w.TeamSyncMath.sharable('sc-drafts-ui'), false);
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

// ---- 15 and 16. What the page and the document say ----

test('K15: the Handover page says in every language that team sync does not share the handover', { skip: !hasSite }, () => {
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  const english = 'Team sync does not share the handover or its history: each device keeps its own. A handover reaches another device only when you send it from here.';
  for (const lang of ['en', 'de', 'sq']) {
    const page = fs.readFileSync(`_site/${lang === 'en' ? '' : `${lang}/`}tools/shift-handover/index.html`, 'utf8');
    const note = /<p class="form-note sh-sync-note">([^<]+)<\/p>/.exec(page);
    // The words of the page, without the markup the headings are set with.
    const html = page.replace(/<[^>]+>/g, '');
    assert.ok(note, `${lang}: the note is on the page`);
    assert.equal(note[1], lang === 'en' ? english : ui[lang][english], `${lang}: in its language`);
    if (lang !== 'en') assert.notEqual(ui[lang][english], english);
    // The page starts and closes in its own words too.
    for (const text of ['Close the shift', 'Start this shift', 'No shift is open', 'Start the next shift']) assert.ok(html.includes(lang === 'en' ? text : ui[lang][text]), `${lang}: ${text}`);
    assert.ok(!html.includes(lang === 'en' ? 'Close shift, start the next' : ui[lang]['Close shift, start the next']), `${lang}: the button no longer says it starts the next shift`);
  }
});

test('K16: the document says what is kept and names both things that are not guaranteed', () => {
  const doc = fs.readFileSync('docs/DATA-FORMATS.md', 'utf8').replace(/\s+/g, ' ');
  assert.match(doc, /no handover holds twice an issue carried from the same closure/i);
  assert.match(doc, /It is not guaranteed that the carrying happens once in time/);
  assert.match(doc, /Nothing is guaranteed between devices/);
  for (const word of ['closeId', 'carriedFrom', 'ONE_DEVICE', 'keepActiveIfOpen']) assert.ok(doc.includes(word), word);
});
