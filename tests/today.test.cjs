// "Today", the pilot's work page (src/js/today.js, src/js/work-nav.js; docs/plan-sot-2026-11-11/PLANI.md, step 6),
// through the real pages: the built page of each language with its own scripts in its own order, which carries the
// Shift Handover's own code for starting and closing a shift. What is closed here is then looked at on the built
// Handover page. Nothing is modelled.
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, click, type, submit, scriptsOf, builtPage } = require('./helpers/tool-page.cjs');

const hasSite = fs.existsSync('_site/tools/today/index.html');
const NOW = '2026-11-11T15:00:00Z';
const LANGS = ['en', 'de', 'sq'];
const KEY = { en: 'sc-damage-control', de: 'sc-damage-control-de', sq: 'sc-damage-control-sq' };
const HANDOVER = { en: 'sc-shift-handover', de: 'sc-shift-handover-de', sq: 'sc-shift-handover-sq' };
const SHIFTS = { en: ['Early', 'Late', 'Night'], de: ['Früh', 'Spät', 'Nacht'], sq: ['Mëngjes', 'Pasdite', 'Natë'] };
const PILOT = { 'sc-shift-close-ui': { v: 1, on: true, set: 1 } };
const DRAFTS = 'sc-drafts-ui';
const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
const word = (lang, text) => (lang === 'en' ? text : ui[lang][text]);
const prefix = (lang) => (lang === 'en' ? '' : `/${lang}`);

const sheet = (lang, date, index, extra = {}) => ({ template: 'warehouse', date, shift: SHIFTS[lang][index], area: 'Dock A', from: 'Arben', to: 'Mira', metrics: [], issues: [{ text: 'Ramp 3 blocked', priority: 'High', owner: '', due: '', done: false, carried: 0 }], headsUp: '', safety: '', checks: [], ackAt: '', shared: [], ack: null, received: null, ...extra });
const handover = (lang, { open = ['2026-11-11', 1], closed = [] } = {}) => ({ [HANDOVER[lang]]: {
  current: open ? sheet(lang, ...open) : sheet(lang, '2026-11-11', 0, { issues: [] }), idle: !open, received: [], waiting: [],
  history: closed.map(([date, index], n) => ({ closedAt: `2026-11-1${n}T05:00:00.000Z`, handover: sheet(lang, date, index), text: '', closeId: `cabcdefgh123456${n}`, state: 'ready', written: true, changed: false, drafts: 0, carried: { date: '2026-11-11', shift: SHIFTS[lang][1], at: '2026-11-11T05:00:00.000Z' } })),
} });
const activeShift = (lang, { date = '2026-11-11', index = 1, list = lang } = {}) => ({ 'sc-shift-ui': { v: 1, date, index, of: 3, label: SHIFTS[lang][index], list, set: 1 } });
// A shift lead at work: the pilot on, a shift started with its handover open, and a damage log.
const atWork = (lang, extra = {}) => ({ ...PILOT, ...activeShift(lang), ...handover(lang), [KEY[lang]]: { rows: [] }, ...extra });

const opened = [];
after(() => opened.forEach((w) => w.close()));
const open = (slug, { lang = 'en', storage = {}, now = NOW, ...options } = {}) => {
  const w = openTool(slug, { lang, storage, now, scripts: [...scriptsOf(builtPage(slug, lang)), { dir: 'js', name: 'shift-context' }], ...options });
  w.asked = [];
  w.answer = true;
  w.confirm = (message) => { w.asked.push(message); return w.answer; };
  w.lang = lang;
  opened.push(w);
  return w;
};
const today = (lang, storage, options = {}) => open('today', { lang, storage, ...options });
const $ = (w, selector) => w.document.querySelector(selector);
const $$ = (w, selector) => [...w.document.querySelectorAll(selector)];
const shown = (node) => Boolean(node) && !node.closest('[hidden]');
const held = (w) => Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => w.localStorage.key(i)).sort().map((key) => [key, w.localStorage.getItem(key)]));
const asStored = (storage) => Object.fromEntries(Object.entries(storage).sort().map(([key, value]) => [key, typeof value === 'string' ? value : JSON.stringify(value)]));
const tick = () => new Promise((resolve) => setTimeout(resolve, 20));
const text = (w, name) => $(w, `[data-today-${name}]`).textContent;
const savedHandover = (w) => JSON.parse(w.localStorage.getItem(HANDOVER[w.lang]));
// A draft as the Damage Control page itself writes it, typed while its shift was the active one.
const draftOf = (lang, { index = 0, note = 'Left behind', mark } = {}) => {
  const w = open('damage-control', { lang, storage: { ...PILOT, ...activeShift(lang, { index }), ...handover(lang, { open: ['2026-11-11', index] }), [KEY[lang]]: { rows: [] } } });
  type(w, $(w, '[data-entry]').elements.note, note);
  const stored = JSON.parse(w.localStorage.getItem(DRAFTS));
  if (mark !== undefined) stored.drafts[0].values.entering = mark;
  return stored.drafts[0];
};
const draftsKey = (...drafts) => ({ [DRAFTS]: { v: 1, drafts } });

// ---- 1. Where the page works, and that opening it only reads ----

test('without the pilot the page says so in its language, shows nothing else, and turns nothing on', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const storage = { ...activeShift(lang), ...handover(lang), [KEY[lang]]: { rows: [] } };
    const w = today(lang, storage);
    assert.equal(shown($(w, '[data-today-off]')), true, lang);
    assert.ok(text(w, 'off').includes(word(lang, 'The pilot is not on, on this device, so there is nothing to show here. Nothing was turned on and nothing was changed.')), lang);
    assert.ok(!shown($(w, '[data-today-cards]')) && !shown($(w, '[data-today-handover]')) && !shown($(w, '[data-work-nav]')), `${lang}: no cards, no handover, no bar`);
    assert.deepEqual(held(w), asStored(storage), `${lang}: nothing written`);
    assert.equal(w.localStorage.getItem('sc-shift-close-ui'), null);
    assert.ok(builtPage('today', lang).includes('<meta name="robots" content="noindex">'), `${lang}: the page is not offered to search engines`);
  }
});

test('a workplace profile with shifts of its own keeps the page off, and says why', { skip: !hasSite }, () => {
  const storage = { ...atWork('en'), 'sc-workplace': { shifts: ['Day', 'Night'] } };
  const w = today('en', storage);
  assert.match(text(w, 'off'), /The workplace profile has shifts of its own \(Day, Night\), and the pilot works with the shifts of this page \(Early, Late, Night\)\. Nothing was changed\./);
  assert.ok(!shown($(w, '[data-today-cards]')) && !shown($(w, '[data-work-nav]')));
  assert.deepEqual(held(w), asStored(storage));
  assert.equal(shown($(today('en', { ...atWork('en'), 'sc-workplace': { shifts: ['Early', 'Late', 'Night'] } }), '[data-today-cards]')), true, 'the page\'s own shifts fit');
});

test('opening the page only reads: the pilot, the active shift, the handover, the drafts and the log are to the byte as they were', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const cases = [
      atWork(lang, draftsKey(draftOf(lang), draftOf(lang, { index: 1, note: 'Of this shift' }))),
      { ...PILOT, ...handover(lang, { open: null, closed: [['2026-11-11', 0]] }), [KEY[lang]]: { rows: [] }, ...draftsKey(draftOf(lang)) },
      { ...PILOT, ...handover(lang), [KEY[lang]]: { rows: [] } },
      { ...PILOT },
    ];
    for (const storage of cases) {
      const w = today(lang, storage);
      await tick();
      w.dispatchEvent(new w.Event('pagehide'));
      assert.deepEqual(held(w), asStored(storage), `${lang}: ${Object.keys(storage).join(', ')}`);
    }
  }
});

// ---- 2. No active shift: an explicit choice ----

test('no shift open: the page asks for the shift and its date in the handover\'s own start panel, and starting there is the handover\'s start', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    // A device that has never started a shift: nothing of a handover is stored.
    const w = today(lang, { ...PILOT, [KEY[lang]]: { rows: [] } });
    assert.ok(text(w, 'now').includes(word(lang, 'Choose the shift and its operative date.')), lang);
    assert.equal(shown($(w, '[data-start]')), true, `${lang}: the start panel of the handover`);
    assert.ok(!shown($(w, '[data-today-handover] .sh-setup')) || w.getComputedStyle($(w, '[data-today-handover] .sh-setup')).display !== undefined);
    assert.equal(w.ShiftContext.active(), null, `${lang}: no shift is made active by opening the page`);
    assert.equal(w.localStorage.getItem(HANDOVER[lang]), null, `${lang}: and none is started`);
    // The visitor chooses: the night shift of the day before.
    $(w, '[name="start-date"]').value = '2026-11-10';
    $(w, '[name="start-shift"]').value = SHIFTS[lang][2];
    click(w, $(w, '[data-start-shift]'));
    assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().label, w.ShiftContext.active().list], ['2026-11-10', SHIFTS[lang][2], lang]);
    assert.deepEqual([savedHandover(w).idle, savedHandover(w).current.date, savedHandover(w).current.shift], [false, '2026-11-10', SHIFTS[lang][2]]);
    assert.ok(text(w, 'now').startsWith(`${word(lang, 'Now')} · ${SHIFTS[lang][2]} · `), `${lang}: the page follows`);
    assert.equal(shown($(w, '[data-start]')), false);
    assert.ok($(w, '[data-wn-shift]').textContent.startsWith(`${SHIFTS[lang][2]} · `), `${lang}: the bar names the shift`);
  }
  // A device that just turned the pilot on and wants out: the start panel's own way out works here too, and the page
  // then says the pilot is off.
  const out = today('en', { ...PILOT, [KEY.en]: { rows: [] } });
  assert.equal(shown($(out, '[data-pilot-start-off]')), true);
  click(out, $(out, '[data-pilot-off-start]'));
  assert.equal(out.ShiftClose.enabled(), false);
  assert.equal(out.ShiftContext.active(), null);
  // After a closed shift: the page says which shift is closed, and proposes nothing by the clock.
  const closed = today('en', { ...PILOT, ...handover('en', { open: null, closed: [['2026-11-11', 0]] }), [KEY.en]: { rows: [] } });
  assert.match(text(closed, 'now'), /^The shift is closedEarly · [^ ]+ is closed\./);
  assert.equal(closed.ShiftContext.active(), null);
  assert.equal($(closed, '[data-wn-shift]').textContent, 'No shift is active');
});

test('the handover has a shift open that is not the active one: nothing is assumed, and the visitor says that they work in it', { skip: !hasSite }, () => {
  const storage = { ...PILOT, ...handover('en'), [KEY.en]: { rows: [] } };
  const w = today('en', storage);
  assert.match(text(w, 'now'), /^Before you startThe Shift Handover has Late · [^ ]+ open\.No shift is active on this device\. Nothing is assumed from the clock/);
  assert.equal(w.ShiftContext.active(), null);
  assert.equal($$(w, '[data-today-phase]').length, 0, 'no work is offered before the choice');
  click(w, $(w, '[data-today-use]'));
  assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().label], ['2026-11-11', 'Late']);
  assert.equal(w.localStorage.getItem(HANDOVER.en), JSON.stringify(storage[HANDOVER.en]), 'the handover is not touched by the choice');
  assert.equal($$(w, '[data-today-phase]').length, 3);
  // A shift of the profile's list, or another shift: said, not followed.
  const unclear = today('en', { ...storage, ...activeShift('en', { list: 'profile' }) });
  assert.match(text(unclear, 'now'), /is not surely one of this page's shifts\. Nothing is assumed/);
  const other = today('en', { ...storage, ...activeShift('en', { index: 2 }) });
  assert.match(text(other, 'now'), /This device is set to another shift \(Night · /);
  assert.equal($$(other, '[data-today-phase]').length, 0);
});

// ---- 3. At work, and closing from here ----

test('at work: the phase is the visitor\'s choice, and "Close the shift" is the handover\'s own close, found closed on the Handover page afterwards', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = today(lang, atWork(lang, { [KEY[lang]]: { rows: [{ date: '2026-11-11', shift: SHIFTS[lang][1], stage: 'x', type: 'y', cause: 'z', units: 3, cost: null, note: '' }, { date: '2026-11-10', shift: SHIFTS[lang][1], stage: 'x', type: 'y', cause: 'z', units: 5, cost: null, note: '' }] } }));
    const pressed = () => $$(w, '[data-today-phase]').filter((node) => node.getAttribute('aria-pressed') === 'true').map((node) => node.dataset.todayPhase);
    assert.deepEqual(pressed(), ['during'], `${lang}: "during" until the visitor says otherwise`);
    assert.ok(text(w, 'now').includes(word(lang, 'Log every damage where it happens.')));
    assert.equal(new URL($(w, '[data-today-now] a.button-primary').href).pathname, `${prefix(lang)}/tools/damage-control/`);
    assert.equal($(w, '[data-today-damage] strong').textContent, '3', `${lang}: the damage of this shift, not of the day before`);
    click(w, $(w, '[data-today-phase="start"]'));
    assert.deepEqual(pressed(), ['start']);
    assert.ok(text(w, 'now').includes(word(lang, 'Read the last handover before the briefing.')));
    click(w, $(w, '[data-today-phase="end"]'));
    assert.ok(text(w, 'now').includes(word(lang, 'Close the shift in three steps.')));
    assert.deepEqual($$(w, '[data-today-now] .td-steps a').map((node) => new URL(node.href).pathname), ['shift-pulse', 'action-tracker', 'shift-handover'].map((slug) => `${prefix(lang)}/tools/${slug}/`));
    // "No" closes nothing.
    w.answer = false;
    click(w, $(w, '[data-today-close]'));
    assert.ok(w.asked.at(-1).includes(word(lang, 'It has not been sent to another device.')), `${lang}: the handover's own question`);
    assert.equal(savedHandover(w).idle, false);
    assert.equal(w.ShiftContext.active().label, SHIFTS[lang][1]);
    w.answer = true;
    click(w, $(w, '[data-today-close]'));
    await tick();
    assert.equal(savedHandover(w).idle, true, `${lang}: closed`);
    assert.equal(w.ShiftContext.active(), null, `${lang}: no shift is active after it`);
    assert.ok(text(w, 'now').includes(word(lang, '{shift} is closed.').replace('{shift}', `${SHIFTS[lang][1]} · `).split(' · ')[0]), `${lang}: the page says the shift is closed`);
    assert.equal(shown($(w, '[data-start]')), true, `${lang}: and offers the start, started by nothing`);
    assert.ok(text(w, 'status').includes(word(lang, 'Closed. No shift is open on this device.')), `${lang}: the handover's word is passed on`);
    // Looked at on the Handover page: the same closure, by the same mechanism.
    const page = open('shift-handover', { lang, storage: keep(w) });
    const state = JSON.parse(page.localStorage.getItem(HANDOVER[lang]));
    assert.equal(state.idle, true);
    assert.match(state.history[0].closeId, /^c[a-z0-9]{15}$/);
    assert.deepEqual([state.history[0].handover.date, state.history[0].handover.shift, state.history[0].state, state.history[0].written], ['2026-11-11', SHIFTS[lang][1], 'ready', true]);
    assert.equal(shown($(page, '[data-start]')), true, `${lang}: the Handover page has no shift open`);
    assert.equal($$(page, '[data-history] details').length, 1, `${lang}: and lists the closure`);
    // Started again there, the open issue is carried once: what this page closed is a closure like any other.
    click(page, $(page, '[data-start-shift]'));
    const next = JSON.parse(page.localStorage.getItem(HANDOVER[lang]));
    assert.deepEqual(next.current.issues.map((issue) => [issue.text, issue.carried]), [['Ramp 3 blocked', 1]]);
    assert.deepEqual(next.current.carriedFrom, [state.history[0].closeId]);
  }
});

// ---- 4. After midnight ----

test('after midnight the operative date stays the shift\'s own until the visitor closes the shift, here and in an entry', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const night = { ...PILOT, ...activeShift(lang, { index: 2 }), ...handover(lang, { open: ['2026-11-11', 2] }), [KEY[lang]]: { rows: [] } };
    const before = today(lang, night, { now: '2026-11-11T22:30:00Z' });
    assert.equal($(before, '[data-today-midnight]'), null, `${lang}: nothing to say before midnight`);
    // 00:20 on the 12th.
    const w = today(lang, night, { now: '2026-11-11T23:20:00Z' });
    const note = $(w, '[data-today-midnight]');
    assert.ok(note, `${lang}: said after midnight`);
    assert.ok(note.textContent.includes(SHIFTS[lang][2]));
    assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().label], ['2026-11-11', SHIFTS[lang][2]], `${lang}: the active shift is as it was`);
    assert.deepEqual(held(w), asStored(night), `${lang}: nothing was written`);
    assert.ok(text(w, 'now').startsWith(`${word(lang, 'Now')} · ${SHIFTS[lang][2]} · `));
    assert.equal(shown($(w, '[data-start]')), false, `${lang}: no other shift is proposed`);
    // An entry made now on Damage Control gets the operative date.
    const damage = open('damage-control', { lang, storage: keep(w), now: '2026-11-11T23:20:00Z' });
    submit(damage, $(damage, '[data-entry]'));
    const [row] = JSON.parse(damage.localStorage.getItem(KEY[lang])).rows;
    assert.deepEqual([row.date, row.shift], ['2026-11-11', SHIFTS[lang][2]], `${lang}: the entry is of the night shift of the 11th`);
    // Back on Today it is counted with that shift.
    assert.equal($(today(lang, keep(damage), { now: '2026-11-11T23:20:00Z' }), '[data-today-damage] strong').textContent, '1');
  }
});

// ---- 5. Continue: drafts by shift and by what can be said of them ----

test('two unfinished forms: each is listed with its shift and its state by the rules of the pages that own them, and none is moved', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const mine = draftOf(lang, { index: 1, note: 'Of this shift' });
    const early = draftOf(lang, { index: 0 });
    const storage = { ...atWork(lang), ...handover(lang, { open: ['2026-11-11', 1], closed: [['2026-11-11', 0]] }), ...draftsKey(mine, early) };
    const w = today(lang, storage);
    const states = Object.fromEntries($$(w, '[data-today-draft]').map((node) => [node.dataset.todayDraft, node.dataset.todayDraftState]));
    assert.deepEqual(states, { [`2026-11-11|${SHIFTS[lang][1]}`]: 'waiting:this', [`2026-11-11|${SHIFTS[lang][0]}`]: 'waiting:closed' }, lang);
    const lines = $$(w, '[data-today-draft]').map((node) => node.textContent);
    assert.ok(lines.some((line) => line.includes(word(lang, 'its shift is closed: there is no going back to it'))), `${lang}: the closed shift is named`);
    assert.ok(lines.some((line) => line.includes(word(lang, 'of this shift')) && line.includes(word(lang, 'unfinished form'))), `${lang}: this shift's form`);
    assert.ok($$(w, '[data-today-draft] a').every((node) => new URL(node.href).pathname === `${prefix(lang)}/tools/damage-control/`), `${lang}: settled on Damage Control`);
    assert.equal($$(w, '[data-today-continue] button').length, 0, `${lang}: nothing is brought or discarded from here`);
    assert.deepEqual(held(w), asStored(storage), `${lang}: and nothing was moved`);
  }
  // A shift that is not open, one that is not surely of this page, and forms that are marked.
  const row = { date: '2026-11-11', shift: 'Late', stage: 'Receiving', type: 'Not recorded', cause: 'Stacking', units: 1, cost: null, note: 'Of this shift' };
  const unsure = draftOf('en', { index: 1, note: 'Of this shift', mark: '0' });
  const notOpen = draftOf('en', { index: 2, note: 'Night form' });
  const profile = { ...draftOf('en', { index: 0, note: 'Profile form' }), list: 'profile', of: 2 };
  const w = today('en', { ...atWork('en', { [KEY.en]: { rows: [row] } }), ...draftsKey(unsure, notOpen, profile) });
  const states = Object.fromEntries($$(w, '[data-today-draft]').map((node) => [node.dataset.todayDraft, node.dataset.todayDraftState]));
  assert.deepEqual(states, { '2026-11-11|Late': 'unconfirmed:this', '2026-11-11|Night': 'waiting:none', '2026-11-11|Early': 'waiting:unclear' });
  assert.match(text(w, 'continue'), /it cannot be confirmed that this form was stored/);
  assert.match(text(w, 'attention'), /1 form cannot be confirmed as stored: decide on Damage Control/);
  // The same form on Damage Control is held there, by the same rule.
  const damage = open('damage-control', { storage: keep(w) });
  assert.equal($$(damage, '[data-work-unconfirmed]').length, 1);
  // Confirmed as entered: said as a copy, not as work.
  const entered = today('en', { ...atWork('en', { [KEY.en]: { rows: [row] } }), ...draftsKey({ ...unsure, values: { ...unsure.values, entered: '1' } }) });
  assert.equal($(entered, '[data-today-draft]').dataset.todayDraftState, 'entered:this');
  assert.equal(text(entered, 'attention').includes('cannot be confirmed'), false);
});

// ---- 6. The bar, and the action count ----

test('the bar: Today, + Log, Actions with the number of the list, Handover, Catalyst; on the pilot\'s pages only where the pilot is on', { skip: !hasSite }, () => {
  const actions = { rows: [
    { id: 'a1', title: 'Open one', source: 'manual', status: 'open', created: '2026-11-01', due: '2026-11-05', owner: 'Mira' },
    { id: 'a2', title: 'Doing one', source: 'manual', status: 'doing', created: '2026-11-01' },
    { id: 'a3', title: 'Done one', source: 'manual', status: 'done', created: '2026-11-01', closed: '2026-11-02', result: 'ok' },
    { id: 'a4', title: 'Example one', source: 'manual', status: 'open', created: '2026-11-01', example: true },
  ] };
  for (const lang of LANGS) {
    const w = today(lang, { ...atWork(lang), 'sc-actions': actions });
    const nav = $(w, '[data-work-nav]');
    assert.equal(shown(nav), true);
    assert.deepEqual($$(w, '[data-work-nav] a[data-wn]').map((node) => [node.dataset.wn, new URL(node.href).pathname]), [['today', `${prefix(lang)}/tools/today/`], ['log', `${prefix(lang)}/tools/damage-control/`], ['actions', `${prefix(lang)}/tools/action-tracker/`], ['handover', `${prefix(lang)}/tools/shift-handover/`], ['catalyst', `${prefix(lang)}/tools.html`]]);
    assert.ok($(w, '[data-wn="log"]').textContent.includes(word(lang, 'Log an entry')));
    assert.equal($(w, '[data-wn="today"]').getAttribute('aria-current'), 'page');
    assert.equal($(w, '[data-wn-count]').textContent, String(w.ActionsStore.open().length), `${lang}: the number is the list's own`);
    assert.equal($(w, '[data-wn-count]').textContent, '2');
    assert.ok($(w, '[data-wn-shift]').textContent.startsWith(`${SHIFTS[lang][1]} · `));
    // The page's own attention card counts from the same list.
    assert.ok(text(w, 'attention').includes(word(lang, '{n} action is overdue').replace('{n}', '1')), `${lang}: one overdue`);
    assert.ok(text(w, 'attention').includes(word(lang, '{n} open action has no owner').replace('{n}', '1')), `${lang}: one without an owner`);
    for (const slug of ['damage-control', 'shift-handover', 'action-tracker']) {
      const on = open(slug, { lang, storage: { ...atWork(lang), 'sc-actions': actions } });
      assert.equal(shown($(on, '[data-work-nav]')), true, `${lang} ${slug}: shown with the pilot on`);
      assert.equal($(on, `[data-work-nav] [aria-current="page"]`).dataset.wn, { 'damage-control': 'log', 'shift-handover': 'handover', 'action-tracker': 'actions' }[slug]);
      const { 'sc-shift-close-ui': gone, ...off } = { ...atWork(lang), 'sc-actions': actions };
      assert.equal(shown($(open(slug, { lang, storage: off }), '[data-work-nav]')), false, `${lang} ${slug}: not shown without it`);
    }
    for (const slug of ['incomplete-control', 'night-audit']) assert.ok(!builtPage(slug, lang).includes('data-work-nav'), `${lang} ${slug}: no bar at all`);
  }
});
