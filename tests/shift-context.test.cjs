// The active shift and the unfinished forms (src/js/shift-context.js; docs/plan-sot-2026-11-11/PLANI.md, step 2). No
// page shows them yet. What is settled here is how they are kept: the active shift as a setting of the device, outside
// the saved file, the restore points and team sync; the drafts outside team sync and inside the saved file, one for
// each form in each shift, never moved or replaced unasked; and data that cannot be read never breaking the page.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const ACTIVE = 'sc-shift-ui';
const DRAFTS = 'sc-drafts-ui';
const ASIDE = 'sc-drafts-unreadable-ui';

const give = (w) => {
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  w.CompressionStream = CompressionStream;
  w.DecompressionStream = DecompressionStream;
};
// A page: its address says the tool and the language; storage is what the browser holds when it opens.
const open = (path = '/sq/tools/damage-control/', { storage = {}, scripts = ['shift-context'], body = '', now = '2026-11-11T21:40:00Z', before } = {}) => {
  const dom = new JSDOM(`<html lang="sq"><body>${body}</body></html>`, { url: `https://stivencatalyst.com${path}`, runScripts: 'outside-only' });
  const w = dom.window;
  give(w);
  w.eval(`(() => { const Real = Date; window.__now = new Real(${JSON.stringify(now)}).getTime(); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [window.__now])); } static now() { return window.__now; } }; })();`);
  w.confirm = () => true;
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, value);
  before?.(w);
  for (const file of scripts) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// Everything the browser holds, as text: what the next page opens with.
const held = (w) => Object.fromEntries(Array.from({ length: w.localStorage.length }, (_, i) => w.localStorage.key(i)).sort().map((key) => [key, w.localStorage.getItem(key)]));
const reopen = (w, path, options = {}) => open(path, { ...options, storage: held(w) });

const NIGHT = { date: '2026-11-11', index: 2, of: 3, label: 'Natë' };
const EARLY = { date: '2026-11-12', index: 0, of: 3, label: 'Mëngjes' };
const entry = (shift, extra = {}) => ({ tool: 'sc-damage-control-sq', form: 'entry', scope: '', ...shift, ...extra });
const WET = { stage: 'Pranimi', cause: 'Ambalazhi', units: '4', note: 'kuti e lagur' };
const FORK = { stage: 'Pranimi', cause: 'Pajisjet', units: '2', note: 'pirun i dëmtuar' };

// ---- The active shift ----

test('the active shift is what was set, on every page and in every language, until it is set again or cleared', () => {
  const w = open();
  assert.equal(w.ShiftContext.active(), null, 'none until one is chosen');
  const set = w.ShiftContext.setActive(NIGHT);
  assert.ok(set.ok);
  assert.deepEqual(plain(w.ShiftContext.active()), { v: 1, ...NIGHT, set: Date.parse('2026-11-11T21:40:00Z') });
  // A reload, another tool, the German page: the same shift, by its place in the list.
  for (const path of ['/sq/tools/damage-control/', '/sq/tools/shift-handover/', '/de/tools/damage-control/', '/tools.html']) {
    const page = reopen(w, path);
    const active = page.ShiftContext.active();
    assert.deepEqual([active.date, active.index, active.of], ['2026-11-11', 2, 3], path);
  }
  assert.ok(w.ShiftContext.clearActive().ok);
  assert.equal(w.ShiftContext.active(), null);
  assert.equal(w.localStorage.getItem(ACTIVE), null);
});

test('the clock does not move the active shift: past midnight it is the date and the shift that were chosen', () => {
  const w = open();
  w.ShiftContext.setActive(NIGHT);
  w.__now += 3 * 60 * 60 * 1000;
  assert.equal(new w.Date().toISOString().slice(0, 10), '2026-11-12', 'the calendar has moved on');
  assert.deepEqual([w.ShiftContext.active().date, w.ShiftContext.active().index], ['2026-11-11', 2]);
  const next = reopen(w, '/sq/tools/damage-control/', { now: '2026-11-13T09:00:00Z' });
  assert.deepEqual([next.ShiftContext.active().date, next.ShiftContext.active().index], ['2026-11-11', 2], 'two days later too');
});

test('an active shift that is not one is refused, and one that cannot be read is none', () => {
  const w = open();
  const bad = [null, 'night', {}, { ...NIGHT, date: '11.11.2026' }, { ...NIGHT, date: '2026-02-30' }, { ...NIGHT, index: 3 }, { ...NIGHT, index: -1 }, { ...NIGHT, index: 1.5 }, { ...NIGHT, of: 0 }, { ...NIGHT, of: 25, index: 24 }];
  for (const value of bad) assert.deepEqual(plain(w.ShiftContext.setActive(value)), { ok: false, reason: 'invalid' }, JSON.stringify(value));
  assert.equal(w.localStorage.getItem(ACTIVE), null, 'nothing was written');
  for (const stored of ['{"v":1,"date":"2026-11-1', 'null', '[]', '"x"', JSON.stringify({ v: 2, ...NIGHT }), JSON.stringify({ v: 1, ...NIGHT, index: 9 })]) {
    const page = open('/sq/tools/damage-control/', { storage: { [ACTIVE]: stored } });
    assert.equal(page.ShiftContext.active(), null, stored);
    assert.ok(page.ShiftContext.setActive(EARLY).ok, 'and a shift can be chosen again');
    assert.equal(page.ShiftContext.active().date, '2026-11-12');
  }
});

// ---- One draft for each form in each shift ----

test('forms that share a date and a shift are separate drafts when the tool, the language, the form or the scope differ', () => {
  const w = open();
  const S = w.ShiftContext;
  const contexts = [
    entry(NIGHT),
    entry(NIGHT, { tool: 'sc-damage-control-de' }),
    entry(NIGHT, { tool: 'sc-damage-control' }),
    entry(NIGHT, { tool: 'sc-incomplete-control-sq' }),
    entry(NIGHT, { form: 'issue' }),
    entry(NIGHT, { tool: 'sc-shift-handover-sq', form: 'sheet', scope: 'Dock A' }),
    entry(NIGHT, { tool: 'sc-shift-handover-sq', form: 'sheet', scope: 'Dock B' }),
  ];
  contexts.forEach((context, i) => assert.ok(S.save(context, { note: `draft ${i}` }).ok, `draft ${i}`));
  assert.equal(S.drafts().length, contexts.length);
  contexts.forEach((context, i) => assert.equal(S.find(context).values.note, `draft ${i}`, `draft ${i} is found under its own identity`));
  assert.equal(new Set(contexts.map((context) => S.identity(context))).size, contexts.length);
  // The scope is compared as typed, spaces aside; the label is not part of the identity.
  assert.equal(S.find(entry(NIGHT, { tool: 'sc-shift-handover-sq', form: 'sheet', scope: '  Dock   A ' })).values.note, 'draft 5');
  assert.equal(S.find(entry({ ...NIGHT, label: 'Night' })).values.note, 'draft 0');
  // The same place in a list of another length is another shift.
  assert.equal(S.find(entry({ ...NIGHT, of: 4 })), null);
});

test('one identity has one draft: saving again replaces it, and empty values remove it', () => {
  const w = open();
  const S = w.ShiftContext;
  const first = S.save(entry(NIGHT), WET).draft;
  const second = S.save(entry(NIGHT), { ...WET, units: '5' }, { base: first.rev }).draft;
  assert.equal(S.drafts().length, 1);
  assert.equal(S.find(entry(NIGHT)).values.units, '5');
  assert.notEqual(second.rev, first.rev, 'a new rev at every save');
  assert.deepEqual(plain(S.save(entry(NIGHT), { stage: '', note: '   ' }, { base: second.rev })), { ok: true, draft: null });
  assert.equal(S.find(entry(NIGHT)), null);
  assert.equal(w.localStorage.getItem(DRAFTS), null, 'no list is kept for no drafts');
  assert.deepEqual(plain(S.drop(entry(NIGHT))), { ok: true, draft: null }, 'dropping what is not there is no error');
});

test('two shifts keep their drafts at the same time, through a reload and from page to page, and the active shift moves neither', () => {
  let w = open();
  w.ShiftContext.setActive(NIGHT);
  const night = w.ShiftContext.save(entry(NIGHT), WET).draft;
  // The device moves on to the next shift with the night's form unfinished.
  w.ShiftContext.setActive(EARLY);
  assert.equal(w.ShiftContext.find(entry(EARLY)), null, 'the form of the new shift is empty: nothing came along');
  const early = w.ShiftContext.save(entry(EARLY), FORK).draft;
  for (const path of ['/sq/tools/damage-control/', '/sq/tools/shift-handover/', '/sq/tools/damage-control/']) {
    w = reopen(w, path);
    assert.deepEqual(plain(w.ShiftContext.find(entry(NIGHT))), plain(night), `${path}: the night's draft as it was`);
    assert.deepEqual(plain(w.ShiftContext.find(entry(EARLY))), plain(early), `${path}: the early shift's draft as it was`);
    assert.equal(w.ShiftContext.active().date, '2026-11-12');
  }
  // Back to the night shift: its draft is there, the other one too.
  w.ShiftContext.setActive(NIGHT);
  assert.deepEqual(plain(w.ShiftContext.find(entry(NIGHT)).values), WET);
  assert.deepEqual(plain(w.ShiftContext.find(entry(EARLY)).values), FORK);
  assert.equal(w.ShiftContext.drafts().length, 2);
});

test('a draft is carried to another shift only when asked, and never over work: both stay as they were', () => {
  const w = open();
  const S = w.ShiftContext;
  S.save(entry(NIGHT), WET);
  S.save(entry(EARLY), FORK);
  const before = w.localStorage.getItem(DRAFTS);
  const refused = S.move(entry(NIGHT), entry(EARLY));
  assert.equal(refused.ok, false);
  assert.equal(refused.reason, 'target-has-work');
  assert.deepEqual([plain(refused.source.values), plain(refused.target.values)], [WET, FORK], 'the answer shows both');
  assert.equal(w.localStorage.getItem(DRAFTS), before, 'not a byte changed');
  // The form on the page has work that is not saved yet: refused the same, with no draft in the way.
  const third = { date: '2026-11-12', index: 1, of: 3, label: 'Pasdite' };
  assert.equal(S.move(entry(NIGHT), entry(third), { targetHasWork: true }).reason, 'target-has-work');
  assert.equal(w.localStorage.getItem(DRAFTS), before);
  // The target cleared, the draft is carried: it is the target's now, with a new rev, and the source is gone.
  const fork = S.find(entry(EARLY));
  S.drop(entry(EARLY), { base: fork.rev });
  const night = S.find(entry(NIGHT));
  const moved = S.move(entry(NIGHT), entry(EARLY), { base: night.rev });
  assert.ok(moved.ok);
  assert.deepEqual(plain(S.find(entry(EARLY)).values), WET);
  assert.equal(S.find(entry(NIGHT)), null);
  assert.notEqual(moved.draft.rev, night.rev);
  assert.equal(S.drafts().length, 1);
  // What cannot be carried says why.
  assert.equal(S.move(entry(NIGHT), entry(third)).reason, 'missing');
  assert.equal(S.move(entry(EARLY), entry(EARLY)).reason, 'invalid');
  assert.equal(S.move(entry(EARLY), entry(third), { base: 'staleeee' }).reason, 'changed');
});

test('a form saves over the draft it loaded and no other: a draft changed underneath is not written over', () => {
  const w = open();
  const S = w.ShiftContext;
  const loaded = S.save(entry(NIGHT), WET).draft;
  // Another tab saves the same form.
  const other = reopen(w, '/sq/tools/damage-control/');
  const theirs = other.ShiftContext.save(entry(NIGHT), FORK, { base: loaded.rev }).draft;
  w.localStorage.setItem(DRAFTS, other.localStorage.getItem(DRAFTS));
  const late = S.save(entry(NIGHT), { ...WET, units: '9' }, { base: loaded.rev });
  assert.equal(late.ok, false);
  assert.equal(late.reason, 'changed');
  assert.deepEqual(plain(late.draft), plain(theirs), 'the answer is the draft that is there');
  assert.deepEqual(plain(S.find(entry(NIGHT)).values), FORK, 'and it stays');
  // Without the rev of what is there, nothing is written over it either; and a form that thinks it has a draft where
  // there is none is told so.
  assert.equal(S.save(entry(NIGHT), WET).reason, 'changed');
  assert.equal(S.drop(entry(NIGHT)).reason, 'changed');
  assert.equal(S.save(entry(EARLY), WET, { base: loaded.rev }).reason, 'changed');
  assert.equal(S.find(entry(EARLY)), null);
});

test('what is not a draft is refused or left out: the context, the fields, the size', () => {
  const w = open();
  const S = w.ShiftContext;
  const bad = [null, {}, entry(NIGHT, { tool: 'damage-control' }), entry(NIGHT, { tool: 'sc-drafts-ui' }), entry(NIGHT, { tool: 'sc-Damage' }), entry(NIGHT, { form: '' }), entry(NIGHT, { form: 'Entry Form' }),
    entry(NIGHT, { scope: 'x'.repeat(201) }), entry({ ...NIGHT, date: 'today' }), entry({ ...NIGHT, index: 3 })];
  for (const context of bad) assert.equal(S.save(context, WET).reason, 'invalid', JSON.stringify(context));
  assert.equal(w.localStorage.getItem(DRAFTS), null);
  const kept = S.save(entry(NIGHT), { note: 'x'.repeat(5000), 'bad name': 'a', '9lives': 'b', units: 3, list: ['a'], flag: true, nothing: null }).draft.values;
  assert.deepEqual(Object.keys(kept).sort(), ['note', 'units']);
  assert.equal(kept.note.length, 2000);
  assert.equal(kept.units, 3);
  // The list is bounded: a full one says so and keeps what it has.
  const full = open();
  for (let i = 0; i < full.ShiftContext.MAX_DRAFTS; i++) assert.ok(full.ShiftContext.save(entry(NIGHT, { scope: `area ${i}` }), WET).ok);
  const text = full.localStorage.getItem(DRAFTS);
  assert.equal(full.ShiftContext.save(entry(EARLY), WET).reason, 'full');
  assert.equal(full.localStorage.getItem(DRAFTS), text);
  assert.ok(full.ShiftContext.save(entry(NIGHT, { scope: 'area 0' }), FORK, { base: full.ShiftContext.find(entry(NIGHT, { scope: 'area 0' })).rev }).ok, 'a draft that is there can still be saved');
});

// ---- Data that cannot be read ----

test('drafts that cannot be read never break the page: they are kept aside once and the list reads as empty', () => {
  for (const damaged of ['{"v":1,"drafts":[{"tool":"sc-damage-control-sq","form":"ent', 'null', '[]', '"text"', '{"v":2,"drafts":[]}', '{"v":1,"drafts":{}}', '']) {
    const w = open('/sq/tools/damage-control/', { storage: { [DRAFTS]: damaged } });
    assert.deepEqual(plain(w.ShiftContext.drafts()), [], damaged);
    assert.equal(w.ShiftContext.find(entry(NIGHT)), null);
    assert.equal(w.localStorage.getItem(ASIDE), damaged, 'kept aside as it was');
    assert.equal(w.localStorage.getItem(DRAFTS), damaged, 'and still under its own key until something is saved');
    // The page goes on: a draft is saved, the copy aside stays.
    assert.ok(w.ShiftContext.save(entry(NIGHT), WET).ok);
    assert.equal(w.ShiftContext.drafts().length, 1);
    assert.equal(w.localStorage.getItem(ASIDE), damaged);
    // A second damaged list does not replace the first copy.
    w.localStorage.setItem(DRAFTS, 'again not json');
    assert.deepEqual(plain(w.ShiftContext.drafts()), []);
    assert.equal(w.localStorage.getItem(ASIDE), damaged);
  }
});

test('a record that is not a draft is left out, the others are read, and the list as it was is kept aside', () => {
  const w = open();
  const good = w.ShiftContext.save(entry(NIGHT), WET).draft;
  const older = { ...plain(good), values: FORK, updated: good.updated - 1000, rev: 'olderolder00' };
  const mixed = JSON.stringify({ v: 1, drafts: [good, { tool: 'sc-damage-control-sq' }, 'x', null, { ...good, rev: '' }, { ...good, index: 7 }, { ...entry(EARLY), values: { note: ' ' }, updated: 1, rev: 'emptyempty00' }, older] });
  const page = open('/sq/tools/damage-control/', { storage: { [DRAFTS]: mixed } });
  const list = plain(page.ShiftContext.drafts());
  assert.equal(list.length, 1, 'one draft: the good one, the later of the two with its identity');
  assert.deepEqual(list[0], plain(good));
  assert.equal(page.localStorage.getItem(ASIDE), mixed);
  assert.equal(page.ShiftContext.sound(mixed), false);
  assert.equal(page.ShiftContext.sound(JSON.stringify({ v: 1, drafts: [good] })), true);
});

test('nothing is written while the tools are locked with a PIN, and storage the browser refuses is no error', () => {
  const damaged = 'not json';
  const w = open('/sq/tools/damage-control/', { storage: { [DRAFTS]: damaged }, before: (win) => { win.WorkLock = { locked: true }; } });
  const before = held(w);
  assert.deepEqual(plain(w.ShiftContext.setActive(NIGHT)), { ok: false, reason: 'locked' });
  assert.deepEqual(plain(w.ShiftContext.save(entry(NIGHT), WET)), { ok: false, reason: 'locked' });
  assert.deepEqual(plain(w.ShiftContext.move(entry(NIGHT), entry(EARLY))), { ok: false, reason: 'locked' });
  assert.deepEqual(plain(w.ShiftContext.drafts()), []);
  assert.deepEqual(held(w), before, 'not even the copy aside');
  // No storage at all (a private window that refuses it).
  const blocked = open('/sq/tools/damage-control/', { before: (win) => { Object.defineProperty(win, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } }); } });
  assert.equal(blocked.ShiftContext.active(), null);
  assert.deepEqual(plain(blocked.ShiftContext.drafts()), []);
  assert.equal(blocked.ShiftContext.setActive(NIGHT).reason, 'unsaved');
  assert.equal(blocked.ShiftContext.save(entry(NIGHT), WET).reason, 'unsaved');
  assert.equal(blocked.ShiftContext.clearActive().reason, 'unsaved');
  // Storage that is full: the save says so and the draft that was there stays.
  const full = open();
  const kept = full.ShiftContext.save(entry(NIGHT), WET).draft;
  full.Storage.prototype.setItem = () => { throw new Error('quota'); };
  assert.equal(full.ShiftContext.save(entry(NIGHT), FORK, { base: kept.rev }).reason, 'unsaved');
  assert.deepEqual(plain(full.ShiftContext.find(entry(NIGHT)).values), WET);
});

// ---- The saved file, the restore points, team sync ----

const backupScripts = ['shift-context', 'storage-guard', 'work-backup'];

test('the saved file holds the drafts and not the active shift; a file with a list of drafts it would not have written is refused', () => {
  const w = open('/sq/tools.html', { scripts: backupScripts });
  w.ShiftContext.setActive(NIGHT);
  w.ShiftContext.save(entry(NIGHT), WET);
  w.localStorage.setItem(ASIDE, 'an older damaged list');
  w.localStorage.setItem('sc-damage-control-sq', '{"rows":[]}');
  const { WorkBackup } = w;
  assert.ok(!WorkBackup.isWork(ACTIVE), 'the active shift is a setting');
  assert.ok(WorkBackup.isWork(DRAFTS) && WorkBackup.isWork(ASIDE), 'the drafts are work');
  assert.equal(WorkBackup.toolSlug(DRAFTS), 'drafts');
  assert.equal(WorkBackup.toolSlug(ASIDE), 'drafts');
  const file = plain(WorkBackup.makeBackup(w.localStorage));
  assert.deepEqual(Object.keys(file.items).sort(), [DRAFTS, ASIDE, 'sc-damage-control-sq'].sort());
  assert.ok(WorkBackup.readBackup(JSON.stringify(file)), 'and reads back');
  // A file that names an active shift all the same (written by hand): the shift is left out, the rest opens.
  const withShift = WorkBackup.readBackup(JSON.stringify({ ...file, items: { ...file.items, [ACTIVE]: JSON.stringify({ v: 1, ...EARLY, set: 1 }) } }));
  assert.ok(withShift && !(ACTIVE in withShift.items));
  // Drafts that are not as this site writes them: the whole file is refused, like a log that is not a list of rows.
  for (const bad of ['not json', '{"v":1,"drafts":[{"tool":"x"}]}', '{"v":3,"drafts":[]}', '[]']) {
    assert.equal(WorkBackup.readBackup(JSON.stringify({ ...file, items: { ...file.items, [DRAFTS]: bad } })), null, bad);
  }
  // A page that cannot check the drafts (the script that keeps them is not there) opens no file that holds any.
  const without = open('/sq/tools.html', { scripts: ['storage-guard', 'work-backup'] });
  assert.equal(without.WorkBackup.readBackup(JSON.stringify(file)), null);
  assert.ok(without.WorkBackup.readBackup(JSON.stringify({ ...file, items: { 'sc-damage-control-sq': '{"rows":[]}' } })), 'a file without drafts opens as before');
});

// The box "All your work in one file" as the page has it, with the question about drafts that differ.
const TEXT = { inBrowser: '{tools}', nothing: '', saved: '{file}', invalid: 'invalid', confirm: '{date} {tools}', full: 'full', opened: 'opened', blocked: '', locked: 'locked', drafts: 'Unfinished forms', draftsItem: '{tool}|{date}|{shift}|{mine}|{file}', draftsCancelled: 'cancelled' };
const BOX = `<div data-work-backup data-text='${JSON.stringify(TEXT)}'><p data-work-summary></p><p data-work-status></p><button data-work-save></button><input type="file" data-work-open></div>
  <dialog data-work-drafts-dialog><form method="dialog"><ul data-work-drafts-list></ul>
  <button type="button" data-work-drafts-choice="mine"></button><button type="button" data-work-drafts-choice="file"></button><button type="button" data-work-drafts-choice="cancel"></button></form></dialog>`;
const box = (storage) => {
  const w = open('/sq/tools.html', { storage, scripts: backupScripts, body: BOX, before: (win) => {
    // jsdom has no modal dialogs: open and close as the browser does, with the close event.
    win.HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
    win.HTMLDialogElement.prototype.close = function () { if (!this.hasAttribute('open')) return; this.removeAttribute('open'); this.dispatchEvent(new win.Event('close')); };
  } });
  w.reloads = 0;
  w.points = [];
  // The restore point made before a file replaces anything (storage-guard.js sets this hook when the page is ready):
  // here it only records that it was asked for, and for which keys.
  Object.defineProperty(w.WorkBackup, 'beforeReplace', { configurable: true, get: () => async (keys) => { w.points.push([...keys]); }, set: () => {} });
  // The page reloads 900 ms after a file is opened; here that is only counted.
  const realTimeout = w.setTimeout.bind(w);
  w.setTimeout = (fn, ms, ...rest) => (ms === 900 ? (w.reloads += 1, 0) : realTimeout(fn, ms, ...rest));
  return w;
};
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
// Picks the file; answers the question about drafts with `choice` when it is asked ("" leaves it with Esc).
const openFile = async (w, file, choice) => {
  const picker = w.document.querySelector('[data-work-open]');
  const text = typeof file === 'string' ? file : JSON.stringify(file);
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'work.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new w.Event('change'));
  const dialog = w.document.querySelector('[data-work-drafts-dialog]');
  const status = () => w.document.querySelector('[data-work-status]').textContent;
  let asked = null;
  for (let i = 0; i < 80 && !status(); i++) {
    await tick();
    if (dialog.hasAttribute('open') && !asked) {
      asked = [...dialog.querySelectorAll('[data-work-drafts-list] li')].map((item) => item.textContent);
      if (choice) dialog.querySelector(`[data-work-drafts-choice="${choice}"]`).click(); else dialog.close();
    }
  }
  return { status: status(), asked };
};
const fileOf = (w) => plain(w.WorkBackup.makeBackup(w.localStorage));
// Two browsers that each hold a draft for the night's entry form, with other values, and something else each.
const twoSides = () => {
  const theirs = open('/sq/tools.html', { scripts: backupScripts });
  theirs.ShiftContext.save(entry(NIGHT), FORK);
  theirs.ShiftContext.save(entry(NIGHT, { tool: 'sc-incomplete-control-sq' }), { note: 'only in the file' });
  theirs.localStorage.setItem('sc-damage-control-sq', '{"rows":[{"date":"2026-11-10","units":1}]}');
  const mine = box({});
  mine.ShiftContext.setActive(EARLY);
  mine.ShiftContext.save(entry(NIGHT), WET);
  mine.ShiftContext.save(entry(EARLY), { note: 'only here' });
  mine.localStorage.setItem('sc-damage-control-sq', '{"rows":[]}');
  return { mine, file: fileOf(theirs) };
};

test('a file put back adds its drafts to the ones here, replaces none, and sets no active shift', async () => {
  const theirs = open('/sq/tools.html', { scripts: backupScripts });
  theirs.ShiftContext.setActive(NIGHT);
  theirs.ShiftContext.save(entry(NIGHT), WET);
  const mine = box({});
  mine.ShiftContext.save(entry(EARLY), FORK);
  const own = mine.ShiftContext.find(entry(EARLY));
  const result = await openFile(mine, fileOf(theirs));
  assert.equal(result.status, 'opened');
  assert.equal(result.asked, null, 'nothing differs, so nothing is asked');
  assert.deepEqual(plain(mine.ShiftContext.find(entry(NIGHT)).values), WET, 'the draft of the file is here');
  assert.deepEqual(plain(mine.ShiftContext.find(entry(EARLY))), plain(own), 'the draft that was here is as it was, rev and all');
  assert.equal(mine.ShiftContext.active(), null, 'no shift was made active: the device had none');
  assert.equal(mine.reloads, 1);
  // And a device that has an active shift keeps it.
  const busy = box({});
  busy.ShiftContext.setActive(EARLY);
  await openFile(busy, fileOf(theirs));
  assert.deepEqual([busy.ShiftContext.active().date, busy.ShiftContext.active().index], ['2026-11-12', 0]);
});

test('drafts that differ are asked about before anything is changed, and leaving the question changes nothing', async () => {
  for (const leave of ['', 'cancel']) {
    const { mine, file } = twoSides();
    const before = held(mine);
    const result = await openFile(mine, file, leave);
    assert.deepEqual(result.asked, ['damage-control|2026-11-11|Natë|Pranimi, Ambalazhi, 4, kuti e lagur|Pranimi, Pajisjet, 2, pirun i dëmtuar'], 'the one draft that differs: its tool, day and shift, and both sides');
    assert.equal(result.status, 'cancelled');
    assert.deepEqual(held(mine), before, 'not a key changed: not the drafts, not the log the file also holds');
    assert.deepEqual(mine.points, [], 'no restore point was made: nothing was about to be replaced');
    assert.equal(mine.reloads, 0);
  }
});

test('the drafts of this browser kept: the rest of the file opens, and a form open on the kept draft goes on saving', async () => {
  const { mine, file } = twoSides();
  const open1 = mine.ShiftContext.find(entry(NIGHT));
  const result = await openFile(mine, file, 'mine');
  assert.equal(result.status, 'opened');
  const S = mine.ShiftContext;
  assert.deepEqual(plain(S.find(entry(NIGHT))), plain(open1), 'the draft here, untouched');
  assert.equal(S.find(entry(EARLY)).values.note, 'only here');
  assert.equal(S.find(entry(NIGHT, { tool: 'sc-incomplete-control-sq' })).values.note, 'only in the file');
  assert.equal(mine.localStorage.getItem('sc-damage-control-sq'), file.items['sc-damage-control-sq'], 'the log of the file replaced the one here, as before');
  assert.equal(mine.points.length, 1, 'after a restore point of what was here');
  assert.ok(S.save(entry(NIGHT), { ...WET, units: '6' }, { base: open1.rev }).ok);
  assert.deepEqual([S.active().date, S.active().index], ['2026-11-12', 0], 'and the active shift is the one the device had');
});

test('the drafts of the file taken: a form still open on the replaced draft cannot write over the one put back', async () => {
  const { mine, file } = twoSides();
  const open1 = mine.ShiftContext.find(entry(NIGHT));
  const result = await openFile(mine, file, 'file');
  assert.equal(result.status, 'opened');
  const S = mine.ShiftContext;
  const restored = S.find(entry(NIGHT));
  assert.deepEqual(plain(restored.values), FORK);
  assert.notEqual(restored.rev, open1.rev);
  assert.equal(S.find(entry(EARLY)).values.note, 'only here', 'a draft the file does not have stays');
  // The form that was open on the old draft saves late (another tab, or the page before its reload).
  const late = S.save(entry(NIGHT), { ...WET, units: '6' }, { base: open1.rev });
  assert.equal(late.reason, 'changed');
  assert.deepEqual(plain(late.draft.values), FORK, 'it is shown the draft that is there');
  assert.deepEqual(plain(S.find(entry(NIGHT)).values), FORK);
});

test('a draft saved in another tab while the question is open is not written over: the file is not opened', async () => {
  const { mine, file } = twoSides();
  const picker = mine.document.querySelector('[data-work-open]');
  const text = JSON.stringify(file);
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'work.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new mine.Event('change'));
  const dialog = mine.document.querySelector('[data-work-drafts-dialog]');
  for (let i = 0; i < 80 && !dialog.hasAttribute('open'); i++) await tick();
  // Meanwhile a third form gets a draft that the file also holds, with other values.
  mine.ShiftContext.save(entry(NIGHT, { tool: 'sc-incomplete-control-sq' }), { note: 'typed while the question was open' });
  const before = held(mine);
  dialog.querySelector('[data-work-drafts-choice="mine"]').click();
  for (let i = 0; i < 80 && !mine.document.querySelector('[data-work-status]').textContent; i++) await tick();
  assert.equal(mine.document.querySelector('[data-work-status]').textContent, 'cancelled');
  assert.deepEqual(held(mine), before);
});

test('the copy kept aside of unreadable drafts in a file never replaces the one this browser keeps', async () => {
  const theirs = open('/sq/tools.html', { scripts: backupScripts });
  theirs.localStorage.setItem(ASIDE, 'their damaged list');
  theirs.localStorage.setItem('sc-damage-control-sq', '{"rows":[]}');
  const mine = box({ [ASIDE]: 'my damaged list' });
  await openFile(mine, fileOf(theirs));
  assert.equal(mine.localStorage.getItem(ASIDE), 'my damaged list');
  const empty = box({});
  await openFile(empty, fileOf(theirs));
  assert.equal(empty.localStorage.getItem(ASIDE), 'their damaged list', 'where there is none, the file\'s is kept');
});

test('a restore point settles its drafts the same way, before the point of now is made; without the question the drafts here stay', () => {
  const source = fs.readFileSync('src/js/storage-guard.js', 'utf8');
  const body = source.slice(source.indexOf('const restorePoint = async'), source.indexOf('// Ask once a session'));
  const settle = body.indexOf('window.WorkBackup.settleDrafts(all)');
  assert.ok(settle > 0, 'the restore point asks through the same question');
  assert.ok(body.indexOf('return "cancelled"') > settle);
  assert.ok(body.indexOf('makePoint("before-restore")') > body.indexOf('return "cancelled"'), 'nothing is made or replaced before the answer');
  assert.ok(body.indexOf('replaceItems(storage, items)') > body.indexOf('makePoint("before-restore")'));
  assert.match(body, /filter\(\(\[key\]\) => key !== "sc-drafts-ui"\)/, 'no question, no drafts replaced');
  // The same function, given a point's items: drafts that cannot be read are left out, the rest goes through.
  const w = box({});
  w.ShiftContext.save(entry(NIGHT), WET);
  return w.WorkBackup.settleDrafts({ [DRAFTS]: 'not json', 'sc-damage-control-sq': '{"rows":[]}' }).then((items) => {
    assert.deepEqual(Object.keys(items), ['sc-damage-control-sq']);
    assert.deepEqual(plain(w.ShiftContext.find(entry(NIGHT)).values), WET);
  });
});

// ---- Team sync ----

test('team sync shares neither the active shift nor the drafts, whatever is ticked, and the damage log still merges', async () => {
  const CODE = 'acid-acorn-acre-acts-afar-affix';
  const server = (() => {
    const spaces = new Map();
    const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
    let updated = 1_000_000;
    const fetch = async (url, init = {}) => {
      const id = (/\/v1\/spaces\/([0-9a-f]{64})$/.exec(url) || [])[1];
      if (!id) return reply(404, { error: 'not-found' });
      const meta = spaces.get(id);
      if ((init.method || 'GET') === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
      const tokenOf = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
      if (!tokenOf || (meta && meta.token !== tokenOf)) return reply(403, { error: 'token' });
      const body = JSON.parse(init.body);
      const rev = meta ? meta.rev : 0;
      if (body.rev !== rev) return reply(409, { rev });
      updated += 5000;
      spaces.set(id, { rev: rev + 1, updated, iv: body.iv, data: body.data, token: tokenOf });
      return reply(200, { rev: rev + 1, updated });
    };
    return { spaces, fetch };
  })();
  const scripts = ['shift-context', 'storage-guard', 'work-backup', 'team-sync'];
  const row = (stage) => ({ date: '2026-11-11', shift: 'Natë', stage, type: 'Crushed', cause: 'Stivimi', units: 1, cost: null, note: '' });
  const device = async (stage, shift, values) => {
    const w = open('/sq/tools.html', { scripts });
    w.localStorage.setItem('sc-damage-control-sq', JSON.stringify({ rows: [row(stage)] }));
    w.ShiftContext.setActive(shift);
    w.ShiftContext.save(entry(shift), values);
    w.localStorage.setItem(ASIDE, `damaged list of ${stage}`);
    return { w, keys: await w.TeamSyncMath.deriveKeys(CODE, 1000) };
  };
  // Every box ticked: what may not be shared is not shared whatever the device chose.
  const sync = async (dev) => {
    const result = await dev.w.TeamSync.syncOnce({ endpoint: 'https://sync.example.test', fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys, selected: () => true, create: true, wait: async () => {} });
    assert.ok(['synced', 'unchanged'].includes(result.status), result.status);
  };
  const a = await device('Ngarkimi', NIGHT, WET);
  const b = await device('Pranimi', EARLY, FORK);
  for (const key of [ACTIVE, DRAFTS, ASIDE]) assert.ok(!a.w.TeamSyncMath.offerable(key), `${key} is not offered`);
  const before = { a: held(a.w), b: held(b.w) };
  for (const dev of [a, b, a, b]) await sync(dev);
  const team = plain(await a.w.TeamSyncMath.unseal(server.spaces.get(a.keys.spaceId), a.keys.key));
  assert.deepEqual(Object.keys(team.items), ['sc-damage-control-sq'], 'the team has the log and nothing else');
  for (const [dev, was] of [[a, before.a], [b, before.b]]) {
    assert.equal(JSON.parse(dev.w.localStorage.getItem('sc-damage-control-sq')).rows.length, 2, 'the damage rows of both');
    for (const key of [ACTIVE, DRAFTS, ASIDE]) assert.equal(dev.w.localStorage.getItem(key), was[key], `${key} as it was on its own device`);
  }
  assert.deepEqual([a.w.ShiftContext.active().index, b.w.ShiftContext.active().index], [2, 0], 'each device in its own shift');
  assert.deepEqual([plain(a.w.ShiftContext.drafts()[0].values), plain(b.w.ShiftContext.drafts()[0].values)], [WET, FORK]);
});

// ---- The pages ----

test('the built pages load the script before the file box, show nothing of it, and ask the question in their own language', () => {
  const pages = { en: '_site/tools/damage-control/index.html', de: '_site/de/tools/damage-control/index.html', sq: '_site/sq/tools/damage-control/index.html', tools: '_site/tools.html' };
  const english = 'Unfinished forms differ';
  for (const [name, file] of Object.entries(pages)) {
    const html = fs.readFileSync(file, 'utf8');
    const at = (script) => html.search(new RegExp(`<script src="[^"]*/js/${script}\\.js[^"]*" defer></script>`));
    assert.ok(at('shift-context') > 0, `${name}: the script is on the page`);
    assert.ok(at('shift-context') < at('storage-guard') && at('storage-guard') < at('work-backup'), `${name}: before the restore points and the file box`);
    const dialog = /<dialog[^>]*data-work-drafts-dialog[\s\S]*?<\/dialog>/.exec(html);
    assert.ok(dialog, `${name}: the question is on the page`);
    assert.ok(!/<dialog[^>]*data-work-drafts-dialog[^>]*\bopen\b/.test(dialog[0]), `${name}: closed until it is needed`);
    for (const choice of ['mine', 'file', 'cancel']) assert.ok(dialog[0].includes(`data-work-drafts-choice="${choice}"`), `${name}: ${choice}`);
    if (name === 'de' || name === 'sq') assert.ok(!dialog[0].includes(english), `${name}: translated`);
    else assert.ok(dialog[0].includes(english));
  }
  // No tool script uses the context yet: the new interface is not switched on.
  const users = fs.readdirSync('src/js').filter((file) => file.endsWith('.js') && file !== 'shift-context.js' && fs.readFileSync(`src/js/${file}`, 'utf8').includes('ShiftContext'));
  assert.deepEqual(users, ['work-backup.js'], 'only the file box, to settle the drafts of a file');
});
