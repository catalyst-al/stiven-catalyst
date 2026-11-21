// The work view of Damage Control (src/js/defect-work.js; docs/plan-sot-2026-11-11/PLANI.md, step 4), through the real
// pages: the built page of each language with its own scripts, in the order the page loads them, and the modules it
// stands on as they are (the active shift and the drafts of js/shift-context.js, what the handover says of a shift in
// js/shift-close.js, the hand-off to the Action Tracker in js/tool-kit.js and js/actions-store.js). Nothing is modelled.
process.env.TZ = 'Europe/Berlin';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, click, type, submit, settle, scriptsOf, builtPage, handedOver, carry } = require('./helpers/tool-page.cjs');

const hasSite = fs.existsSync('_site/tools/damage-control/index.html');
const NOW = '2026-11-11T15:00:00Z';
const LANGS = ['en', 'de', 'sq'];
const KEY = { en: 'sc-damage-control', de: 'sc-damage-control-de', sq: 'sc-damage-control-sq' };
const HANDOVER = { en: 'sc-shift-handover', de: 'sc-shift-handover-de', sq: 'sc-shift-handover-sq' };
const SHIFTS = { en: ['Early', 'Late', 'Night'], de: ['Früh', 'Spät', 'Nacht'], sq: ['Mëngjes', 'Pasdite', 'Natë'] };
const PILOT = { 'sc-shift-close-ui': { v: 1, on: true, set: 1 } };
const DRAFTS = 'sc-drafts-ui';
const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
const word = (lang, text) => (lang === 'en' ? text : ui[lang][text]);
const fieldsOf = (lang) => Object.fromEntries(JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}damageControl.json`, 'utf8')).fields.map((f) => [f.name, f]));

const activeShift = (lang, { date = '2026-11-11', index = 1, list = lang } = {}) => ({ 'sc-shift-ui': { v: 1, date, index, of: 3, label: SHIFTS[lang][index], list, set: 1 } });
const sheet = (lang, date, index) => ({ template: 'warehouse', date, shift: SHIFTS[lang][index], area: 'Dock A', from: '', to: '', metrics: [], issues: [], headsUp: '', safety: '', checks: [], ackAt: '', shared: [], ack: null, received: null });
// The handover as the Handover page keeps it: one shift open, others closed.
const handover = (lang, { open = ['2026-11-11', 1], closed = [] } = {}) => ({ [HANDOVER[lang]]: {
  current: open ? sheet(lang, ...open) : sheet(lang, '2026-11-11', 0), idle: !open, received: [], waiting: [],
  history: closed.map(([date, index], n) => ({ closedAt: `2026-11-1${n}T05:00:00.000Z`, handover: sheet(lang, date, index), text: '', closeId: `cabcdefgh1234567${n}`.slice(0, 16), state: 'ready', written: true, changed: false, drafts: 0, carried: { date: '2026-11-11', shift: SHIFTS[lang][1], at: '2026-11-11T05:00:00.000Z' } })),
} });
const row = (lang, extra = {}) => { const f = fieldsOf(lang); return { date: '2026-11-10', shift: f.shift.options[1], stage: f.stage.options[4], type: f.type.options[0], cause: f.cause.options[0], units: 2, cost: null, note: '', ...extra }; };
// A shift lead in the pilot: the pilot on, a shift started (active, with its handover open), a log of their own.
const pilotStorage = (lang, { rows = [], ...shift } = {}) => ({ ...PILOT, ...activeShift(lang, shift), ...handover(lang, { open: [shift.date || '2026-11-11', shift.index ?? 1] }), [KEY[lang]]: { rows } });

const opened = [];
after(() => opened.forEach((w) => w.close()));
// The page as it loads: its own scripts in its own order, then the site-wide module the view stands on.
const open = (slug, { lang = 'en', storage = {}, ...options } = {}) => {
  const w = openTool(slug, { lang, storage, now: NOW, scripts: [...scriptsOf(builtPage(slug, lang)), { dir: 'js', name: 'shift-context' }], ...options });
  w.asked = [];
  w.answer = true;
  w.confirm = (message) => { w.asked.push(message); return w.answer; };
  w.lang = lang;
  w.slug = slug;
  opened.push(w);
  return w;
};
const page = (lang, storage, options = {}) => open('damage-control', { lang, storage, ...options });
const reload = (w, options = {}) => { const storage = keep(w); return open(w.slug, { lang: w.lang, storage, ...options }); };
const $ = (w, selector) => w.document.querySelector(selector);
const $$ = (w, selector) => [...w.document.querySelectorAll(selector)];
const shown = (node) => Boolean(node) && !node.closest('[hidden]') && !node.closest('.dw-off');
const isOn = (w) => w.document.body.classList.contains('dw-on');
const form = (w) => $(w, '[data-entry]').elements;
const rowsOf = (w) => JSON.parse(w.localStorage.getItem(KEY[w.lang])).rows;
const draftsOf = (w) => { const raw = w.localStorage.getItem(DRAFTS); return raw ? JSON.parse(raw).drafts : []; };
const status = (w) => $(w, '[data-entry-status]').textContent;
const add = (w) => submit(w, $(w, '[data-entry]'));
const refuse = (w, key) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (name, value) { if (name === key) throw new w.DOMException('full', 'QuotaExceededError'); return real.call(this, name, value); };
  return () => { w.Storage.prototype.setItem = real; };
};
const draftNotes = (w) => $$(w, '[data-work-draft]');
const noteButton = (note, name) => note.querySelector(`[data-work-${name}]`);

// ---- 1. Where the view is on, and where the page is as it always was ----

test('off by default: without the pilot the Damage Control page is as it always was, in every language', { skip: !hasSite }, async () => {
  for (const lang of LANGS) {
    const w = page(lang, { ...activeShift(lang), ...handover(lang), [KEY[lang]]: { rows: [row(lang)] } });
    assert.equal(isOn(w), false, `${lang}: not on`);
    assert.equal($(w, '[data-work-head]').hidden, true);
    assert.equal($(w, '[data-work-off]').hidden, true);
    assert.equal($(w, '[data-work-col]').hidden, true);
    assert.equal(w.document.querySelectorAll('.dw-off, .dw-drafts, .dw-focus, .dw-next, .dw-mine').length, 0, `${lang}: nothing of the view is on the page`);
    assert.ok(shown(form(w).date) && shown(form(w).shift), `${lang}: the date and the shift are asked as before`);
    // An entry is made as before: with the date and the shift of the form, written by the page's own save.
    form(w).date.value = '2026-11-09';
    form(w).shift.value = SHIFTS[lang][2];
    add(w);
    await settle(w);
    const added = rowsOf(w).at(-1);
    assert.deepEqual([added.date, added.shift, added.type], ['2026-11-09', SHIFTS[lang][2], fieldsOf(lang).type.options[0]]);
    assert.equal(w.localStorage.getItem(DRAFTS), null, `${lang}: no draft is written`);
    assert.equal($$(w, '[data-log] tr')[0].children.length, 9, `${lang}: the log has the columns it had`);
  }
});

test('Incomplete Control and the Night Audit Log do not have the view at all, with the pilot on or off', { skip: !hasSite }, async () => {
  for (const [slug, key] of [['incomplete-control', 'sc-incomplete-control'], ['night-audit', 'sc-night-audit']]) {
    for (const lang of LANGS) {
      const html = builtPage(slug, lang);
      assert.ok(!html.includes('data-work-head') && !html.includes('defect-work') && !html.includes('data-work-col'), `${slug} ${lang}: no markup and no script of the view`);
      assert.ok(!html.includes('"workUi"'), `${slug} ${lang}: its data does not ask for it`);
    }
    const stored = { [key]: { rows: [{ date: '2026-11-10', shift: 'Late', stage: 'x', type: 'y', cause: 'z', units: 1, cost: null, note: '' }] } };
    const plain = open(slug, { storage: stored });
    const pilot = open(slug, { storage: { ...stored, ...PILOT, ...activeShift('en'), ...handover('en') } });
    assert.equal(pilot.document.body.className, plain.document.body.className);
    // The token of a hand-off link is made anew on every page: it is not the page.
    const markup = (w) => w.document.querySelector('main').innerHTML.replace(/#handoff=[a-z0-9]+/g, '#handoff=…');
    assert.equal(markup(pilot), markup(plain), `${slug}: the page is the same to the letter with the pilot on`);
    // And an entry there still takes the date and the shift of its form.
    pilot.document.querySelector('[data-entry]').elements.date.value = '2026-11-08';
    submit(pilot, pilot.document.querySelector('[data-entry]'));
    await settle(pilot);
    assert.equal(JSON.parse(pilot.localStorage.getItem(key)).rows.at(-1).date, '2026-11-08');
    assert.equal(pilot.localStorage.getItem(DRAFTS), null);
  }
});

test('a workplace profile with shifts of its own keeps the view off and says why; the same shifts as the page fit', { skip: !hasSite }, () => {
  const off = page('en', { ...pilotStorage('en'), 'sc-workplace': { shifts: ['Day', 'Night'] } });
  assert.equal(isOn(off), false);
  assert.equal($(off, '[data-work-off]').hidden, false);
  assert.equal($(off, '[data-work-off]').textContent, 'The work view of the pilot is not shown here: the workplace profile has shifts of its own (Day, Night), and the pilot works with the shifts of this page (Early, Late, Night). The page works as it always did.');
  assert.ok(shown(form(off).date) && shown(form(off).shift), 'the form asks the date and the shift, as before');
  assert.deepEqual([...form(off).shift.options].map((option) => option.value), ['Day', 'Night'], 'with the profile\'s shifts, as before');
  // The same words in another order are other shifts too.
  assert.equal(isOn(page('en', { ...pilotStorage('en'), 'sc-workplace': { shifts: ['Late', 'Early', 'Night'] } })), false);
  // The page's own shifts, or a profile without shifts, fit.
  assert.equal(isOn(page('en', { ...pilotStorage('en'), 'sc-workplace': { shifts: ['Early', 'Late', 'Night'], site: 'Durrës' } })), true);
  assert.equal(isOn(page('en', { ...pilotStorage('en'), 'sc-workplace': { site: 'Durrës', targets: { damage: 0.3 } } })), true);
  // German and Albanian say it in their language.
  for (const lang of ['de', 'sq']) {
    const w = page(lang, { ...pilotStorage(lang), 'sc-workplace': { shifts: ['A', 'B'] } });
    assert.equal(isOn(w), false);
    assert.ok($(w, '[data-work-off]').textContent.includes(SHIFTS[lang].join(', ')) && !$(w, '[data-work-off]').textContent.startsWith('The work view'), lang);
  }
});

// ---- 2. The form of the active shift ----

test('on: the form belongs to the active shift, in every language; an entry gets its operative date and its shift, and the row is the row the log always wrote', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const f = fieldsOf(lang);
    const w = page(lang, pilotStorage(lang, { date: '2026-11-10', index: 2 }));
    assert.equal(isOn(w), true, `${lang}: on`);
    assert.equal($(w, '[data-work-head]').hidden, false);
    assert.deepEqual($$(w, '[data-work-tab]').map((tab) => tab.textContent), ['Work', 'Learn', 'Data'].map((text) => word(lang, text)));
    assert.ok(!shown(form(w).date) && !shown(form(w).shift), `${lang}: the date and the shift are not asked`);
    assert.ok(shown(form(w).stage) && shown(form(w).cause) && shown(form(w).units) && shown(form(w).note));
    assert.ok(!shown(form(w).type) && !shown(form(w).cost), `${lang}: the type and the cost open on request`);
    // The steps and the causes are the warehouse's, as the page has them.
    assert.deepEqual([...form(w).stage.options].map((option) => option.value), f.stage.options);
    assert.deepEqual([...form(w).cause.options].map((option) => option.value), f.cause.options);
    assert.ok($(w, '[data-work-saved-with]').textContent.includes(`${SHIFTS[lang][2]} · `), `${lang}: the form says which shift it is saved with`);
    type(w, form(w).stage, f.stage.options[4]);
    type(w, form(w).cause, f.cause.options[0]);
    type(w, form(w).units, '3');
    type(w, form(w).note, 'Cage 4');
    add(w);
    // The calendar says 11 November, 16:00; the entry is of the operative date of the night shift started the day before.
    assert.deepEqual(rowsOf(w), [{ date: '2026-11-10', shift: SHIFTS[lang][2], stage: f.stage.options[4], type: word(lang, 'Not recorded'), cause: f.cause.options[0], units: 3, cost: null, note: 'Cage 4' }]);
    assert.deepEqual(Object.keys(rowsOf(w)[0]), ['date', 'shift', 'stage', 'type', 'cause', 'units', 'cost', 'note'], `${lang}: the same fields in the same order, and no id`);
    assert.equal(draftsOf(w).length, 0, `${lang}: the draft is cleared by the entry`);
    assert.ok($(w, '.dw-mine').textContent.includes('Cage 4'), `${lang}: listed under this shift`);
    assert.deepEqual([form(w).units.value, form(w).note.value, form(w).stage.value], ['1', '', f.stage.options[4]], `${lang}: the form is clean, the stage stays`);
    // With the type and the cost opened, they are written as before.
    click(w, $(w, '[data-work-more]'));
    type(w, form(w).type, f.type.options[3]);
    type(w, form(w).cost, '55');
    add(w);
    assert.deepEqual([rowsOf(w)[1].type, rowsOf(w)[1].cost], [f.type.options[3], 55]);
  }
});

test('no active shift, or one that is not surely a shift of this page: no form, and the page points to the Shift Handover', { skip: !hasSite }, () => {
  const none = page('en', { ...PILOT, [KEY.en]: { rows: [row('en')] } });
  assert.equal(isOn(none), true);
  assert.ok(!shown($(none, '[data-entry]')), 'no form');
  assert.match($(none, '.dw-noshift').textContent, /No shift is active on this device, so an entry has nowhere to go\. A shift is started on the Shift Handover page, with its date\./);
  assert.equal($(none, '.dw-noshift a').href, 'https://example.test/tools/shift-handover/');
  add(none);
  assert.equal(rowsOf(none).length, 1, 'a submit all the same adds nothing');
  // A shift chosen from the profile's list: the same word proves nothing (js/shift-context.js).
  const unclear = page('en', { ...PILOT, ...activeShift('en', { list: 'profile' }), [KEY.en]: { rows: [] } });
  assert.ok(!shown($(unclear, '[data-entry]')));
  assert.match($(unclear, '.dw-noshift').textContent, /The shift this device is working in \(Late · [^)]*11[^)]*\) is not surely one of this page's shifts \(Early, Late, Night\)/);
  // A shift started on the German Handover page is the same shift on the English page, in this page's word.
  const german = page('en', { ...PILOT, 'sc-shift-ui': { v: 1, date: '2026-11-11', index: 1, of: 3, label: 'Spät', list: 'de', set: 1 }, [KEY.en]: { rows: [] } });
  assert.ok(shown($(german, '[data-entry]')));
  add(german);
  assert.equal(rowsOf(german)[0].shift, 'Late');
  // Started later, in another tab: the form appears without a reload.
  none.ShiftContext.setActive({ date: '2026-11-11', index: 0, of: 3, label: 'Early', list: 'en' });
  assert.ok(shown($(none, '[data-entry]')));
  assert.ok($(none, '[data-work-saved-with]').textContent.includes('Early · '));
});

// ---- 3. The unfinished form ----

test('what is typed is the draft of the shift at once, comes back after a reload, and goes when the entry is stored or the form is cleared', { skip: !hasSite }, () => {
  let w = page('en', pilotStorage('en'));
  assert.ok(!shown($(w, '[data-work-clear]')), 'a clean form has nothing to clear');
  type(w, form(w).note, 'Top layer collapsed');
  type(w, form(w).units, '4');
  const [draft] = draftsOf(w);
  assert.deepEqual([draft.tool, draft.form, draft.scope, draft.date, draft.index, draft.of, draft.label, draft.list], ['sc-damage-control', 'entry', '', '2026-11-11', 1, 3, 'Late', 'en']);
  assert.deepEqual(draft.values, { stage: 'Receiving', cause: 'Stacking', units: '4', note: 'Top layer collapsed' });
  assert.match($(w, '[data-work-saved-with]').textContent, /^Unfinished form of this shift: what you typed stays here when you go to another page\. Saved with Late · /);
  // A reload, and the page opened later: the form is as it was left.
  w = reload(w);
  assert.deepEqual([form(w).note.value, form(w).units.value], ['Top layer collapsed', '4']);
  assert.ok(shown($(w, '[data-work-clear]')));
  assert.equal(draftsOf(w).length, 1, 'loading it wrote nothing new');
  // Typed on, it is still one draft.
  type(w, form(w).note, 'Top layer collapsed, cage 4');
  assert.equal(draftsOf(w).length, 1);
  assert.equal(draftsOf(w)[0].values.note, 'Top layer collapsed, cage 4');
  // The type and the cost are part of it when opened.
  click(w, $(w, '[data-work-more]'));
  type(w, form(w).cost, '12.5');
  w = reload(w);
  assert.ok(shown(form(w).cost));
  assert.equal(form(w).cost.value, '12.5');
  add(w);
  assert.deepEqual([rowsOf(w).length, rowsOf(w)[0].note, rowsOf(w)[0].units, rowsOf(w)[0].cost], [1, 'Top layer collapsed, cage 4', 4, 12.5]);
  assert.equal(w.localStorage.getItem(DRAFTS), null, 'stored: the draft is gone');
  assert.equal(reload(w).document.querySelector('[data-entry]').elements.note.value, '', 'and does not come back');
  // "Clear the form" drops the draft without an entry.
  type(w, form(w).note, 'Not this one');
  assert.equal(draftsOf(w).length, 1);
  click(w, $(w, '[data-work-clear]'));
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  assert.equal(form(w).note.value, '');
  assert.equal(rowsOf(w).length, 1);
});

test('an entry that cannot be stored leaves the form and its draft for another try, and is then stored once', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en', { rows: [row('en')] }));
  type(w, form(w).note, 'Pallet 7');
  type(w, form(w).units, '2');
  const before = w.localStorage.getItem(KEY.en);
  const restore = refuse(w, KEY.en);
  add(w);
  assert.equal(w.localStorage.getItem(KEY.en), before, 'nothing was stored');
  assert.equal($$(w, '[data-log] tr').length, 1, 'and the page does not show an entry it does not hold');
  assert.equal(status(w), 'Not added: the browser\'s storage did not take the entry. What you typed is still in the form; try again.');
  assert.deepEqual([form(w).note.value, form(w).units.value], ['Pallet 7', '2'], 'what was typed is still in the form');
  assert.equal(draftsOf(w)[0].values.note, 'Pallet 7', 'and still kept as the draft');
  // Still there after a reload while the storage refuses.
  assert.equal(reload(w, { before: (next) => refuse(next, KEY.en) }).document.querySelector('[data-entry]').elements.note.value, 'Pallet 7');
  restore();
  add(w);
  assert.deepEqual(rowsOf(w).map((item) => item.note), ['', 'Pallet 7'], 'stored once');
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  add(w);
  assert.equal(rowsOf(w).filter((item) => item.note === 'Pallet 7').length, 1, 'a second press adds a new, clean entry, not the same one again');
});

test('a draft that cannot be kept is said at once, and what was typed stays in the form', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en'));
  const restore = refuse(w, DRAFTS);
  type(w, form(w).note, 'Typed while the storage is full');
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  assert.equal(status(w), 'What you typed is still here, but it could not be kept as an unfinished form: The browser\'s storage did not take it.');
  assert.equal(form(w).note.value, 'Typed while the storage is full');
  // The entry itself can still be made.
  add(w);
  assert.equal(rowsOf(w)[0].note, 'Typed while the storage is full');
  restore();
  // Locked with a PIN: nothing is kept, and the page says so.
  const locked = page('en', pilotStorage('en'));
  locked.WorkLock = { locked: true };
  type(locked, form(locked).note, 'x');
  assert.match(status(locked), /The tools are locked with a PIN/);
});

// ---- 3b. The entry is stored and its draft cannot be cleared ----

// The storage stops taking changes to the drafts: removals at once, writes after `writes` more (the mark that a form
// is being entered is a write; "0" lets none through).
const freezeDrafts = (w, writes = Infinity) => {
  const proto = w.Storage.prototype;
  const real = { set: proto.setItem, remove: proto.removeItem };
  let left = writes;
  proto.removeItem = function (name) { if (name === DRAFTS) throw new w.DOMException('blocked', 'InvalidStateError'); return real.remove.call(this, name); };
  proto.setItem = function (name, value) { if (name === DRAFTS && (left -= 1) < 0) throw new w.DOMException('full', 'QuotaExceededError'); return real.set.call(this, name, value); };
  return () => { proto.setItem = real.set; proto.removeItem = real.remove; };
};
const typePallet = (w) => { type(w, form(w).note, 'Pallet 7'); type(w, form(w).units, '2'); };
const copies = (w) => $$(w, '[data-work-entered]');
const pallets = (w) => rowsOf(w).filter((item) => item.note === 'Pallet 7').length;
const waitingText = /Unfinished form of this shift/;

test('the row is stored and the draft cannot be cleared: the form is clean at once and after a reload, the page says the entry is in the log, and the same form adds no second row', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en'));
  typePallet(w);
  // The mark and the word "entered" can be written; the draft cannot be removed.
  const thaw = freezeDrafts(w);
  add(w);
  assert.equal(pallets(w), 1, 'the row is stored');
  assert.equal(status(w), 'Added 2 damaged units at Receiving. A copy of the form could not be cleared; the page shows it as already in the log.');
  assert.deepEqual([form(w).note.value, form(w).units.value], ['', '1'], 'the form is clean');
  assert.doesNotMatch($(w, '[data-work-saved-with]').textContent, waitingText, 'and does not say that work waits');
  assert.ok(!shown($(w, '[data-work-clear]')));
  assert.equal(copies(w).length, 1);
  assert.match(copies(w)[0].textContent, /^Already in the log \(Late · [^)]+\): Receiving · Stacking · 2 damaged units · Pallet 7\. A copy of this form is still kept here; it is not waiting to be entered\./);
  assert.equal($$(w, '[data-work-draft]').length, 0, 'it is not listed as an unfinished form either');
  assert.equal(draftsOf(w)[0].values.entered, '1', 'the stored copy says it was entered');
  // After a reload, with the drafts still frozen: the same.
  let again = reload(w, { before: (next) => freezeDrafts(next) });
  assert.deepEqual([form(again).note.value, form(again).units.value], ['', '1'], 'the form is clean after a reload');
  assert.doesNotMatch($(again, '[data-work-saved-with]').textContent, waitingText);
  assert.equal(copies(again).length, 1);
  assert.equal(pallets(again), 1);
  // The storage works again: the page clears the copy by itself, and nothing is left to enter.
  thaw();
  again = reload(w);
  assert.equal(copies(again).length, 0);
  assert.equal(again.localStorage.getItem(DRAFTS), null);
  assert.equal(form(again).note.value, '');
  assert.equal(pallets(again), 1, 'one row, through all of it');
});

test('when even the word "entered" cannot be written, the log is the evidence: the copy is shown, not offered as work, and cleared when the visitor says so', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en', { rows: [row('en')] }));
  typePallet(w);
  // One more write is taken (the mark, made before the row); then nothing.
  const thaw = freezeDrafts(w, 1);
  add(w);
  assert.equal(pallets(w), 1);
  assert.deepEqual([draftsOf(w)[0].values.entering, draftsOf(w)[0].values.entered], ['0', undefined], 'only the mark made before the row is stored: there were no such rows then');
  assert.equal(form(w).note.value, '');
  assert.equal(copies(w).length, 1, 'said at once');
  thaw();
  const again = reload(w);
  assert.equal(form(again).note.value, '', 'not put back in the form');
  assert.doesNotMatch($(again, '[data-work-saved-with]').textContent, waitingText);
  assert.equal(copies(again).length, 1, 'shown, and not cleared unasked: only the log says it was entered');
  assert.equal(draftsOf(again).length, 1);
  click(again, copies(again)[0].querySelector('[data-work-copy]'));
  assert.equal(again.localStorage.getItem(DRAFTS), null);
  assert.equal(copies(again).length, 0);
  assert.equal(pallets(again), 1);
  // A copy left by another shift is told the same way there, with no "Bring" and no "Back to".
  const stale = page('en', { ...pilotStorage('en', { index: 2, rows: rowsOf(w) }), [DRAFTS]: w.localStorage.getItem(DRAFTS) });
  assert.equal($$(stale, '[data-work-draft]').length, 0);
  assert.equal(copies(stale).length, 1);
  assert.equal(copies(stale)[0].querySelector('[data-work-bring], [data-work-back]'), null);
});

test('two real entries with the same fields are still two rows; a copy left behind does not stand in the way', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en'));
  typePallet(w);
  add(w);
  typePallet(w);
  add(w);
  assert.equal(pallets(w), 2, 'typed twice, entered twice');
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  assert.equal(copies(w).length, 0);
  // With a copy of the first one left behind (only the log says it was entered), the second is typed and entered.
  const left = page('en', pilotStorage('en'));
  typePallet(left);
  const thaw = freezeDrafts(left, 1);
  add(left);
  thaw();
  const again = reload(left);
  assert.equal(copies(again).length, 1);
  typePallet(again);
  assert.equal(copies(again).length, 0, 'what is typed now is the form of this shift, saved over the copy');
  assert.deepEqual([draftsOf(again)[0].values.note, draftsOf(again)[0].values.entering], ['Pallet 7', undefined]);
  add(again);
  assert.equal(pallets(again), 2);
  assert.equal(again.localStorage.getItem(DRAFTS), null);
  assert.equal(pallets(reload(again)), 2, 'and a reload adds nothing');
});

test('a draft that cannot be marked as being entered is not entered; an entry that is not stored leaves the form waiting, mark or no mark', { skip: !hasSite }, () => {
  // The mark cannot be written: nothing is written at all.
  const w = page('en', pilotStorage('en'));
  typePallet(w);
  let thaw = freezeDrafts(w, 0);
  add(w);
  assert.equal(pallets(w), 0);
  assert.match(status(w), /^Not added, and nothing was written: the unfinished form could not be marked as being entered \(The browser's storage did not take it\.\)/);
  assert.equal(form(w).note.value, 'Pallet 7');
  assert.equal(draftsOf(w)[0].values.entering, undefined);
  thaw();
  add(w);
  assert.equal(pallets(w), 1);
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  // The row is not stored, and the mark cannot be taken back either: after a reload the form waits, it is not "in the log".
  const failed = page('en', pilotStorage('en'));
  typePallet(failed);
  thaw = freezeDrafts(failed, 1);
  const restore = refuse(failed, KEY.en);
  add(failed);
  assert.equal(pallets(failed), 0);
  assert.equal(draftsOf(failed)[0].values.entering, '0', 'the mark is still there');
  assert.equal(form(failed).note.value, 'Pallet 7');
  thaw();
  restore();
  const again = reload(failed);
  assert.equal(copies(again).length, 0, 'the log has no such row: the form was not entered');
  assert.deepEqual([form(again).note.value, form(again).units.value], ['Pallet 7', '2'], 'and waits, as it was');
  assert.match($(again, '[data-work-saved-with]').textContent, waitingText);
  add(again);
  assert.equal(pallets(again), 1);
  assert.equal(again.localStorage.getItem(DRAFTS), null);
});

// ---- 4. Drafts of other shifts: Back to, Bring here, Discard ----

// The draft another shift left, as the page itself writes it: typed on the page while that shift was active.
const withDraftOf = (lang, { date = '2026-11-11', index = 0, note = 'Left in the early shift' } = {}) => {
  const w = page(lang, pilotStorage(lang, { date, index }));
  type(w, form(w).note, note);
  type(w, form(w).units, '5');
  return { [DRAFTS]: w.localStorage.getItem(DRAFTS) };
};

test('two shifts with unfinished forms at once: neither is written over, "Bring" is refused while this form has work, and both stay', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const early = withDraftOf(lang);
    const w = page(lang, { ...pilotStorage(lang), ...handover(lang, { open: ['2026-11-11', 1], closed: [['2026-11-11', 0]] }), ...early });
    assert.equal(form(w).note.value, '', `${lang}: the form of this shift does not take the other shift's draft`);
    const [note] = draftNotes(w);
    assert.ok(note.textContent.includes(`${SHIFTS[lang][0]} · `) && note.textContent.includes('Left in the early shift'), `${lang}: the other shift's form is named`);
    assert.ok(noteButton(note, 'bring'), `${lang}: with a clean form here it can be brought`);
    // This shift gets work of its own.
    type(w, form(w).note, 'Of the late shift');
    const [blocked] = draftNotes(w);
    assert.equal(noteButton(blocked, 'bring'), null, `${lang}: "Bring" is not offered while this form has work`);
    assert.ok(blocked.querySelector('[data-work-blocked]').textContent.includes('Of the late shift'), `${lang}: and the page says why`);
    assert.deepEqual(draftsOf(w).map((draft) => [draft.label, draft.values.note]).sort(), [[SHIFTS[lang][0], 'Left in the early shift'], [SHIFTS[lang][1], 'Of the late shift']].sort(), `${lang}: both drafts are kept`);
    // The mechanism itself refuses, whatever the page shows.
    const [source, target] = [draftsOf(w).find((draft) => draft.index === 0), draftsOf(w).find((draft) => draft.index === 1)];
    const stored = w.localStorage.getItem(DRAFTS);
    assert.equal(w.ShiftContext.move(source, target, { base: source.rev }).reason, 'target-has-work');
    assert.equal(w.ShiftContext.move(source, { ...target, date: '2026-11-12' }, { base: source.rev, targetHasWork: true }).reason, 'target-has-work');
    assert.equal(w.localStorage.getItem(DRAFTS), stored);
    // Both survive a reload, each with its shift.
    const again = reload(w);
    assert.equal(form(again).note.value, 'Of the late shift');
    assert.ok(draftNotes(again)[0].textContent.includes('Left in the early shift'));
  }
});

test('"Bring it here" moves the draft in one write: here it is the form\'s, there it is gone; when the write fails it stays where it was', { skip: !hasSite }, () => {
  const w = page('en', { ...pilotStorage('en'), ...withDraftOf('en') });
  const before = w.localStorage.getItem(DRAFTS);
  // The storage does not take it: nothing moved, nothing lost.
  const restore = refuse(w, DRAFTS);
  click(w, noteButton(draftNotes(w)[0], 'bring'));
  assert.equal(w.localStorage.getItem(DRAFTS), before, 'the draft is still the early shift\'s');
  assert.equal(form(w).note.value, '');
  assert.equal(status(w), 'Not brought, and nothing was lost: The browser\'s storage did not take it.');
  assert.equal(draftNotes(w).length, 1);
  restore();
  click(w, noteButton(draftNotes(w)[0], 'bring'));
  assert.deepEqual([form(w).note.value, form(w).units.value], ['Left in the early shift', '5']);
  assert.deepEqual(draftsOf(w).map((draft) => [draft.label, draft.date, draft.values.note]), [['Late', '2026-11-11', 'Left in the early shift']], 'one draft, of this shift: the source went with the same write');
  assert.equal(draftNotes(w).length, 0);
  assert.match(status(w), /^Brought here from Early · /);
  // Entered, it is an entry of this shift, and no draft is left anywhere.
  add(w);
  assert.deepEqual([rowsOf(w)[0].shift, rowsOf(w)[0].note, rowsOf(w)[0].units], ['Late', 'Left in the early shift', 5]);
  assert.equal(w.localStorage.getItem(DRAFTS), null);
});

test('"Back to" is offered only for the shift the handover has open; a closed shift, or one the handover does not have, offers no return', { skip: !hasSite }, () => {
  const early = withDraftOf('en');
  // Closed.
  const closed = page('en', { ...pilotStorage('en'), ...handover('en', { open: ['2026-11-11', 1], closed: [['2026-11-11', 0]] }), ...early });
  assert.equal(noteButton(draftNotes(closed)[0], 'back'), null);
  assert.match(draftNotes(closed)[0].textContent, /That shift is closed: there is no going back to it\./);
  assert.ok(noteButton(draftNotes(closed)[0], 'bring') && noteButton(draftNotes(closed)[0], 'drop'), 'it can still be brought here or discarded');
  // Never started on the Handover page.
  const unknown = page('en', { ...pilotStorage('en'), ...early });
  assert.equal(noteButton(draftNotes(unknown)[0], 'back'), null);
  assert.match(draftNotes(unknown)[0].textContent, /That shift is not open on the Shift Handover page/);
  // Open on the Handover page, while another shift is the active one of the device.
  const w = page('en', { ...PILOT, ...activeShift('en', { index: 1 }), ...handover('en', { open: ['2026-11-11', 0] }), [KEY.en]: { rows: [] }, ...early });
  type(w, form(w).note, 'Of the late shift');
  const back = noteButton(draftNotes(w)[0], 'back');
  assert.match(back.textContent, /^Back to Early · /);
  click(w, back);
  assert.deepEqual([w.ShiftContext.active().label, w.ShiftContext.active().date], ['Early', '2026-11-11'], 'the shift the handover has open is the active one again');
  assert.equal(form(w).note.value, 'Left in the early shift', 'and the form shows its draft');
  assert.ok(draftNotes(w)[0].textContent.includes('Of the late shift'), 'the form left behind is now the other shift\'s, kept');
  assert.equal(draftsOf(w).length, 2);
  // With no shift active the draft is still shown, to be discarded or returned to.
  const idle = page('en', { ...PILOT, ...handover('en', { open: null, closed: [['2026-11-11', 0]] }), [KEY.en]: { rows: [] }, ...early });
  assert.equal(draftNotes(idle).length, 1);
  assert.deepEqual([noteButton(draftNotes(idle)[0], 'back'), noteButton(draftNotes(idle)[0], 'bring')], [null, null], 'nowhere to bring it and no shift to go back to');
});

test('"Discard" asks first; "no" changes nothing', { skip: !hasSite }, () => {
  const w = page('en', { ...pilotStorage('en'), ...withDraftOf('en') });
  const before = w.localStorage.getItem(DRAFTS);
  w.answer = false;
  click(w, noteButton(draftNotes(w)[0], 'drop'));
  assert.match(w.asked.at(-1), /^Discard the unfinished form from Early · .*\? What was typed in it is gone\.$/);
  assert.equal(w.localStorage.getItem(DRAFTS), before);
  w.answer = true;
  click(w, noteButton(draftNotes(w)[0], 'drop'));
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  assert.equal(draftNotes(w).length, 0);
});

test('a draft changed under an open form is not written over: the page asks which one to keep', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en'));
  type(w, form(w).note, 'Typed here');
  // Another tab saves the same shift's draft.
  const other = reload(w);
  type(other, form(other).note, 'Typed in the other tab');
  w.localStorage.setItem(DRAFTS, other.localStorage.getItem(DRAFTS));
  type(w, form(w).note, 'Typed here, on');
  assert.equal(draftsOf(w)[0].values.note, 'Typed in the other tab', 'the stored draft was not written over');
  assert.match($(w, '.dw-conflict').textContent, /was changed somewhere else/);
  click(w, $(w, '[data-work-conflict="mine"]'));
  assert.equal(draftsOf(w)[0].values.note, 'Typed here, on');
  assert.equal($(w, '.dw-conflict'), null);
});

// ---- 5. Where an action comes from ----

const follow = (w, link) => { link.dispatchEvent(new w.MouseEvent('mousedown', { bubbles: true })); return handedOver(w, link.href).action; };
const store = (w) => { w.eval(fs.readFileSync('src/js/actions-store.js', 'utf8')); return w.ActionsStore; };
const sameRows = (lang) => [row(lang, { date: '2026-11-09' }), row(lang, { date: '2026-11-10', note: 'twin' }), row(lang, { date: '2026-11-10', note: 'twin' }), row(lang, { date: '2026-11-11', cause: fieldsOf(lang).cause.options[1], stage: fieldsOf(lang).stage.options[2], id: 'r-8f3k2' })];

test('an action carries its origin: the period, the filter, or the row; a row without an id as a copy of its fields with its twins', { skip: !hasSite }, () => {
  for (const lang of LANGS) {
    const f = fieldsOf(lang);
    const w = page(lang, pilotStorage(lang, { rows: sameRows(lang) }));
    const Store = store(w);
    const exit = (kind) => $(w, `[data-work-exit="${kind}"]`);
    // The period.
    let action = follow(w, exit('action'));
    assert.deepEqual(action.origin, { v: 1, tool: 'damage-control', lang, kind: 'period', from: '2026-11-09', to: '2026-11-11' }, `${lang}: the period`);
    assert.equal(action.source, 'damage-control');
    assert.deepEqual(JSON.parse(JSON.stringify(Store.originOf(action.origin))), action.origin, `${lang}: the store takes it whole`);
    assert.ok(action.title.includes($(w, '[data-work-problem]').textContent), `${lang}: the title is the sentence the page shows`);
    // A filter: chosen in "Start here", it changes the sentence, the strip and the origin.
    click(w, $$(w, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === `pick:cause:${f.cause.options[0]}`));
    assert.ok($(w, '[data-work-problem]').textContent.includes(`${f.cause.label} ${f.cause.options[0]}`), `${lang}: the sentence follows the filter`);
    assert.ok($(w, '[data-work-filter]').textContent.includes(`${f.cause.label} = ${f.cause.options[0]}`), `${lang}: the head names the filter`);
    assert.ok(exit('action').textContent.includes(f.cause.options[0]) && exit('action').classList.contains('dw-rec'), `${lang}: the action is for the cause, and suggested`);
    action = follow(w, exit('action'));
    assert.deepEqual(action.origin, { v: 1, tool: 'damage-control', lang, kind: 'filter', from: '2026-11-09', to: '2026-11-11', filter: { field: 'cause', value: f.cause.options[0] } }, `${lang}: the filter`);
    assert.deepEqual(JSON.parse(JSON.stringify(Store.originOf(action.origin))), action.origin);
    assert.ok($(w, '[data-work-carry]').textContent.includes(`${f.cause.label}: ${f.cause.options[0]}`), `${lang}: the strip says what is carried`);
    // One filter at a time: a stage chosen replaces the cause.
    click(w, $$(w, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === `pick:stage:${f.stage.options[4]}`));
    assert.deepEqual(follow(w, exit('action')).origin.filter, { field: 'stage', value: f.stage.options[4] }, `${lang}: one filter at a time`);
    click(w, $(w, '[data-work-filter]'));
    assert.equal($(w, '[data-work-filter]'), null);
    // A row. The log shows the newest first: the row with an id, then the two twins, then the oldest.
    const links = $$(w, '[data-log] .dw-row-action');
    assert.equal(links.length, 4, `${lang}: every row can become an action`);
    action = follow(w, links[0]);
    assert.deepEqual(action.origin, { v: 1, tool: 'damage-control', lang, kind: 'row', from: '2026-11-11', to: '2026-11-11', row: { id: 'r-8f3k2', date: '2026-11-11', shift: f.shift.options[1], stage: f.stage.options[2], cause: f.cause.options[1], units: 2, twins: 1 } }, `${lang}: a row with an id names it`);
    action = follow(w, links[1]);
    assert.deepEqual(action.origin.row, { id: '', date: '2026-11-10', shift: f.shift.options[1], stage: f.stage.options[4], cause: f.cause.options[0], units: 2, twins: 2 }, `${lang}: a row without an id is a copy of its fields, with the rows that look the same`);
    assert.equal(action.detail, 'twin');
    assert.deepEqual(JSON.parse(JSON.stringify(Store.originOf(action.origin))), action.origin);
    assert.equal(follow(w, links[3]).origin.row.twins, 1);
    // No row was given an id for it, and the log is as it was.
    assert.deepEqual(rowsOf(w).map((item) => item.id || ''), ['', '', '', 'r-8f3k2'], `${lang}: no id was written`);
  }
});

test('the action arrives on the Action Tracker with its origin, and nothing of it is in the address', { skip: !hasSite }, async () => {
  const w = page('en', pilotStorage('en', { rows: sameRows('en') }));
  const link = $$(w, '[data-log] .dw-row-action')[1];
  const sent = follow(w, link);
  assert.match(new URL(link.href).hash, /^#handoff=[a-z0-9]+$/);
  assert.equal(new URL(link.href).search, '');
  assert.ok(!link.href.includes('Stacking') && !link.href.includes('2026-11-10'), 'the address carries a token and nothing else');
  const tracker = openTool('action-tracker', { now: NOW, search: new URL(link.href).hash, before: (next) => carry(w, next) });
  opened.push(tracker);
  await settle(tracker, 60);
  const form = tracker.document.querySelector('form[data-add], form[data-action-form], form');
  const stored = () => JSON.parse(tracker.localStorage.getItem('sc-actions') || '{"rows":[]}').rows;
  if (!stored().length && form) { submit(tracker, form); await settle(tracker, 60); }
  assert.equal(stored().length, 1, 'the action is on the list');
  assert.deepEqual(stored()[0].origin, sent.origin);
  assert.equal(stored()[0].source, 'damage-control');
});

// ---- 6. The page, sorted: the head, Start here, Next step, the tabs ----

test('the head, "Start here" and the six ways on, none of them required', { skip: !hasSite }, () => {
  const empty = page('en', pilotStorage('en'));
  assert.equal($(empty, '.dw-focus h2').textContent, 'No damage logged yet.');
  assert.ok(!shown($(empty, '.dw-next')), 'no ways on without entries');
  const w = page('en', pilotStorage('en', { rows: sameRows('en') }));
  // With the volume, the head has the rate against the target.
  type(w, $(w, '[name="volume"]'), '2000');
  type(w, $(w, '[name="target"]'), '0.3');
  assert.equal($(w, '.dw-rate').textContent, '0.40% · target 0.30% · 2 over');
  assert.equal($(w, '[data-work-problem]').textContent, '2026-11-09 – 2026-11-11 · 8 damaged units; most at Loading (6 of 8), mostly stacking (6 of 8).');
  assert.deepEqual($$(w, '[data-work-exit]').map((node) => [node.dataset.workExit, node.tagName]), [['action', 'A'], ['whys', 'A'], ['floor', 'BUTTON'], ['chart', 'A'], ['pareto', 'A'], ['handover', 'A']]);
  assert.equal($$(w, '.dw-rec').length, 0, 'nothing is suggested without a filter');
  assert.equal($(w, '[data-work-carry]').textContent, 'Carries: Period: 2026-11-09 – 2026-11-11 · Shift: all · Stage: all · Cause: all · 4 of 4 entries · 8 of 8 units');
  assert.equal(new URL($(w, '[data-work-exit="whys"]').href).searchParams.get('problem'), $(w, '[data-work-problem]').textContent);
  assert.equal($(w, '[data-work-exit="handover"]').href, 'https://example.test/tools/shift-handover/', 'the handover is opened with nothing in the address');
  // The unknown cause suggests the floor; another field suggests 5 Whys.
  const unknown = page('en', pilotStorage('en', { rows: [row('en', { cause: 'Unknown' }), row('en')] }));
  click(unknown, $$(unknown, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === 'pick:cause:Unknown'));
  assert.equal($(unknown, '.dw-rec').dataset.workExit, 'floor');
  assert.match($(unknown, '.dw-focus .dl-warning').textContent, /50% of damaged units have no known cause\. Check on the floor before the analysis\./);
  click(unknown, $$(unknown, '.dw-focus [data-focus-key]').find((node) => node.dataset.focusKey === 'pick:shift:Late'));
  assert.equal($(unknown, '.dw-rec').dataset.workExit, 'whys');
  // Pareto and the control chart take what they always took.
  click(w, $(w, '[data-work-exit="pareto"]'));
  assert.equal(JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff')).rows.length, 4);
});

test('Work · Learn · Data: one view at a time, by pointer and by keyboard, and nothing of the page is lost', { skip: !hasSite }, () => {
  const w = page('en', pilotStorage('en', { rows: sameRows('en') }));
  const tab = (name) => $(w, `[data-work-tab="${name}"]`);
  const selected = () => $$(w, '[data-work-tab]').filter((node) => node.getAttribute('aria-selected') === 'true').map((node) => node.dataset.workTab);
  const key = (node, name) => node.dispatchEvent(new w.KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
  assert.deepEqual(selected(), ['work']);
  assert.ok(shown($(w, '[data-entry]')) && shown($(w, '[data-log]')) && shown($(w, '.dw-focus')) && shown($(w, '[data-floor-check]')));
  assert.ok(!shown($(w, '.dl-paste')) && !shown($(w, '.tool-aside')) && !shown($(w, '[data-csv]')));
  click(w, tab('data'));
  assert.deepEqual(selected(), ['data']);
  for (const selector of ['.dl-paste', '[data-range]', '[data-volumes]', '[data-csv]', '[data-xlsx]', '[data-clear]', '[name="volume"]', '[name="target"]']) assert.ok(shown($(w, selector)), `Data shows ${selector}`);
  assert.ok(!shown($(w, '[data-entry]')) && !shown($(w, '[data-log]')));
  assert.equal($(w, '.dw-data a').getAttribute('href'), '#work-backup-title');
  // The keyboard: the arrows move between the tabs, Home and End to the ends; one tab stop.
  key(tab('data'), 'ArrowLeft');
  assert.deepEqual(selected(), ['learn']);
  assert.equal(w.document.activeElement, tab('learn'));
  assert.ok(shown($(w, '.tool-aside')) && !shown($(w, '.dl-paste')));
  key(tab('learn'), 'Home');
  assert.deepEqual(selected(), ['work']);
  key(tab('work'), 'ArrowLeft');
  assert.deepEqual(selected(), ['data'], 'it wraps');
  key(tab('data'), 'End');
  key(tab('data'), 'ArrowRight');
  assert.deepEqual(selected(), ['work']);
  assert.deepEqual($$(w, '[data-work-tab]').map((node) => node.tabIndex), [0, -1, -1]);
  // Import and export still work from Data.
  click(w, tab('data'));
  $(w, '#dl-paste').value = '2026-11-08\tLate\tLoading\tCrushed\tStacking\t1\t\t';
  click(w, $(w, '[data-import]'));
  assert.equal(JSON.parse(JSON.stringify(keep(w)[KEY.en].rows.length)), 5);
  // "Check on the floor" comes back to Work, at the floor check.
  click(w, $(w, '[data-work-exit="floor"]') || tab('work'));
  click(w, tab('work'));
  click(w, $(w, '[data-work-exit="floor"]'));
  assert.deepEqual(selected(), ['work']);
  assert.equal(w.document.activeElement, $(w, '[data-floor-check] input'));
});
