// Phase 4B (Room Inspection → Action Tracker → Done → re-inspection → Verified / reopened): a maintenance defect is
// closed by proof, not by report. "Reinspect" on a saved inspection opens a re-inspection of that inspection (kind
// "recheck", recheckOf: its id, the same room and checklist, nothing marked pass by itself); saved, it verifies the
// defect's action when the action is done and the item passes, reopens it when the item fails again, and leaves it as
// it is in every other case, saying why. The re-inspection is the proof on the action. Fictional rooms, faults and
// names throughout.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/roomInspection.json', de: 'src/_data/de/roomInspection.json', sq: 'src/_data/sq/roomInspection.json' };
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/room-inspection.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang }).replace(/<script src=[^>]*><\/script>/g, '');

// The page in jsdom; `storage` seeds localStorage (a reload), `before(w)` runs before the scripts.
const load = ({ lang = 'en', now = '2026-10-24T09:30:00Z', storage = {}, before = null } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const dom = new JSDOM(`<html lang="${lang}"><body><main id="main">${partial(lang)}</main></body></html>`, { url: `https://example.test${base}/tools/room-inspection/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  if (lang !== 'en' && fs.existsSync(`_site/js/ui-${lang}.js`)) w.eval(fs.readFileSync(`_site/js/ui-${lang}.js`, 'utf8'));
  if (before) before(w);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'template-pack', 'room-inspection']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// The Action Tracker page (Albanian build data, as its own tests load it) on the same storage.
const loadTracker = (storage) => {
  const html = `<html lang="en"><body>${fs.readFileSync('src/_includes/partials/action-tracker.njk', 'utf8')
    .replace(/\{%-?[\s\S]*?-?%\}/g, '').replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1').replace(/\{\{ *'([^']+)' *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(read('src/_data/actionTracker.json'))).replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
  const dom = new JSDOM(html, { url: 'https://example.test/tools/action-tracker/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'action-tracker']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-room-inspection') => JSON.parse(w.localStorage.getItem(key));
const actions = (w) => (JSON.parse(w.localStorage.getItem('sc-actions')) || { rows: [] }).rows.filter((a) => a.source === 'room-inspection');
const all = (w) => { const out = {}; for (let i = 0; i < w.localStorage.length; i++) { const key = w.localStorage.key(i); out[key] = w.localStorage.getItem(key); } return out; };
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const choose = (w, input) => { input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
// A storage that refuses a key: every write, or only the writes whose value `when` picks out.
const refusing = (w, key, { when = () => true } = {}) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (k, value) {
    if (String(k) === key && this === w.localStorage && when(String(value))) throw new w.DOMException('full', 'QuotaExceededError');
    return real.call(this, k, value);
  };
  return () => { w.Storage.prototype.setItem = real; };
};
const SETUP = { rooms: [{ number: '412', floor: '4', type: 'suite' }, { number: '413', floor: '4', type: 'double' }], attendants: [{ name: 'Jonas', floors: ['4'] }], inspectors: ['Elena'] };
const TAP = 'Tap, drain and flush work, nothing drips';
// An inspection of room `room` with the shower tap (bathroom-5, maintenance) failed, the rest passed, saved.
const inspect = (w, room, note = 'Shower tap drips', date = null) => {
  const d = w.document;
  type(w, d.querySelector('#ri-room'), room);
  if (date) type(w, d.querySelector('#ri-date'), date);
  const tap = d.querySelector('input[name="ri-bathroom-5"][value="fail"]');
  choose(w, tap);
  type(w, tap.closest('.ri-item').querySelector('.ri-note'), note);
  click(w, d.querySelector('[data-rest-pass]'));
  click(w, d.querySelector('[data-save]'));
};
const status = (w) => w.document.querySelector('[data-walk-status]')?.textContent || '';
const logStatus = (w) => w.document.querySelector('[data-log-status]')?.textContent || '';
const answer = (w, qid, value) => choose(w, w.document.querySelector(`input[name="ri-${qid}"][value="${value}"]`));
const checkedCount = (w) => w.document.querySelectorAll('.ri-item input[data-answer]:checked').length;
const reinspectButton = (w, rowId) => w.document.querySelector(`[data-reinspect="${rowId}"]`);
// "Reinspect" asks about the draft's photos first (async, nothing here): the test lets the handler finish.
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
const reinspect = async (w, rowId) => { click(w, reinspectButton(w, rowId)); await settle(); };
const applyButton = (w, rowId) => w.document.querySelector(`[data-apply="${rowId}"]`);
const maintTag = (w, rowId) => w.document.querySelector(`tr[data-row="${rowId}"] .ri-maint`)?.dataset.maintenance || null;
const recheckTag = (w, rowId) => w.document.querySelector(`tr[data-row="${rowId}"] .ri-recheck`);
const recheckRows = (w) => saved(w).rows.filter((r) => r.kind === 'recheck');
const done = (w, id, result = 'Cartridge replaced') => { assert.ok(w.ActionsStore.update(id, { status: 'done', result }), 'the tracker marks it done'); };
// The common start: one inspection with the tap failed, its action in the tracker and marked done; the page reloaded.
const defectDone = (extra = {}) => {
  const w0 = load({ storage: { 'sc-room-inspection': SETUP }, ...extra });
  inspect(w0, '412');
  const row = saved(w0).rows[0];
  const id = `ri-${row.id}-bathroom-5`;
  assert.equal(actions(w0)[0].id, id);
  done(w0, id);
  const w = load({ storage: all(w0), ...extra });
  return { w, row, id };
};

test('defect → action → done → reinspect pass → verified, with the re-inspection as the proof and nothing marked pass by itself', async () => {
  const { w, row, id } = defectDone();
  assert.equal(maintTag(w, row.id), '0/1/0/0/0', 'the log shows the action done');
  const again = reinspectButton(w, row.id);
  assert.ok(again, 'the inspection with a done defect offers Reinspect');
  await reinspect(w, row.id);
  // The draft is a re-inspection of that inspection: its room and checklist, locked; nothing answered.
  const d = w.document;
  assert.equal(d.querySelector('#ri-room').value, '412');
  assert.equal(d.querySelector('#ri-room').disabled, true, 'the room is the inspection\'s');
  assert.equal(d.querySelector('#ri-template').disabled, true, 'so is the checklist');
  assert.equal(d.querySelector('#ri-kind').value, 'recheck');
  assert.equal(d.querySelector('#ri-kind').disabled, true);
  assert.equal(checkedCount(w), 0, 'nothing is marked pass by itself');
  assert.equal(d.querySelector('[data-save]').disabled, true, 'nothing to save until an item is judged');
  const note = d.querySelector('[data-recheck-note]');
  assert.equal(note.hidden, false);
  assert.match(note.textContent, /Re-inspection of room 412/);
  assert.match(note.textContent, new RegExp(`1 maintenance defect to check: ${TAP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  const item = d.querySelector('.ri-item[data-qid="bathroom-5"]');
  assert.ok(item.classList.contains('is-to-verify'));
  assert.equal(item.dataset.verify, 'done');
  assert.match(item.querySelector('.ri-verify-tag').textContent, /pass verifies it, fail reopens it/);
  assert.equal(d.querySelectorAll('.ri-item.is-to-verify').length, 1, 'only the defect is marked');
  assert.equal(saved(w).draft.recheckOf, row.id, 'the re-inspection in progress is saved as one');
  // The tap passes: saved, the action is verified with the proof.
  answer(w, 'bathroom-5', 'pass');
  click(w, d.querySelector('[data-save]'));
  const rows = saved(w).rows;
  assert.equal(rows.length, 2);
  const re = rows.find((r) => r.kind === 'recheck');
  assert.ok(re, 'the re-inspection is saved with kind recheck');
  assert.equal(re.recheckOf, row.id, 'and names the inspection it checks');
  assert.deepEqual([re.room, re.floor, re.roomType, re.template], [row.room, row.floor, row.roomType, row.template], 'the room and the checklist of the inspection');
  assert.deepEqual(plain(re.answers), { 'bathroom-5': 'pass' });
  const a = actions(w);
  assert.equal(a.length, 1, 'no second action');
  assert.equal(a[0].status, 'verified');
  assert.equal(a[0].closed, re.date, 'closed on the day of the proof');
  assert.deepEqual(plain(a[0].proof), { recheck: re.id, date: re.date, time: re.time, qid: 'bathroom-5', item: TAP, answer: 'pass' });
  assert.match(a[0].result, /^Cartridge replaced · Verified by the re-inspection of room 412 on .*: Tap, drain and flush work, nothing drips passes\.$/);
  assert.equal(a[0].ref, `${row.id}|bathroom-5`, 'the reference of the original defect stays');
  assert.match(status(w), /Re-inspection of room 412 saved/);
  assert.match(status(w), /1 defects verified in the Action Tracker, with this re-inspection as the proof/);
  assert.match(status(w), /counts in no first-time pass rate/);
  // The draft is blank again, not a re-inspection.
  assert.equal(d.querySelector('#ri-room').value, '');
  assert.equal(d.querySelector('#ri-room').disabled, false);
  assert.equal(d.querySelector('#ri-kind').value, 'checkout');
  assert.equal(d.querySelector('[data-recheck-note]').hidden, true);
  assert.equal(saved(w).draft.recheckOf, undefined);
  // The log: the original shows the defect verified, the re-inspection what it did.
  assert.equal(maintTag(w, row.id), '0/0/1/0/0');
  assert.equal(recheckTag(w, re.id).dataset.recheck, '1/0/0/0');
  assert.match(recheckTag(w, re.id).textContent, /Re-inspection: 1 verified/);
  assert.match(w.document.querySelector(`tr[data-row="${re.id}"] .ri-recheck-of`).textContent, /re-inspection of/);
  assert.equal(applyButton(w, re.id), null, 'nothing left to apply');
  assert.equal(maintTag(w, re.id), null, 'the re-inspection has no defect of its own');
  // After a reload the same.
  const w2 = load({ storage: all(w) });
  assert.equal(recheckTag(w2, re.id).dataset.recheck, '1/0/0/0');
  assert.equal(actions(w2)[0].status, 'verified');
});

test('defect → action → done → reinspect fail → reopened, the failed check kept, no second action; fixed again and checked again → verified by the later re-inspection', async () => {
  const { w, row, id } = defectDone();
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'fail');
  assert.equal(w.document.querySelector('input[name="ri-flag-bathroom-5"][value="maintenance"]').checked, true, 'the fault keeps its usual fix');
  click(w, w.document.querySelector('[data-save]'));
  const re1 = recheckRows(w)[0];
  let a = actions(w);
  assert.equal(a.length, 1, 'the same defect: no second action');
  assert.equal(a[0].status, 'open', 'reopened');
  assert.equal(a[0].closed, '');
  assert.deepEqual(plain(a[0].proof), { recheck: re1.id, date: re1.date, time: re1.time, qid: 'bathroom-5', item: TAP, answer: 'fail' });
  assert.match(a[0].result, /^Cartridge replaced · Re-inspection of room 412 on .*: .* fails again; reopened\.$/, 'the result of the failed check is kept with the earlier one');
  assert.match(status(w), /1 reopened in the Action Tracker: the fix did not hold/);
  assert.equal(recheckTag(w, re1.id).dataset.recheck, '0/1/0/0');
  assert.equal(maintTag(w, re1.id), null, 'the re-inspection\'s fault is the inspection\'s defect, not a new one');
  assert.equal([...w.document.querySelectorAll('button')].find((b) => /maintenance items to actions/.test(b.textContent)), undefined, 'nothing to send');
  assert.equal(maintTag(w, row.id), '1/0/0/0/0', 'the inspection shows it open again');
  // Fixed again, checked again: verified by the second re-inspection; the first one's verdict is history.
  done(w, id, 'Cartridge replaced again');
  const w2 = load({ storage: all(w), now: '2026-10-24T14:00:00Z' });
  await reinspect(w2, row.id);
  answer(w2, 'bathroom-5', 'pass');
  click(w2, w2.document.querySelector('[data-save]'));
  const re2 = recheckRows(w2).find((r) => r.id !== re1.id);
  a = actions(w2);
  assert.equal(a.length, 1);
  assert.equal(a[0].status, 'verified');
  assert.equal(a[0].proof.recheck, re2.id);
  assert.match(a[0].result, /Cartridge replaced again · Verified by the re-inspection/);
  assert.equal(recheckTag(w2, re2.id).dataset.recheck, '1/0/0/0');
  assert.equal(recheckTag(w2, re1.id).dataset.recheck, '0/0/0/1', 'the first check is unchanged history');
  assert.match(recheckTag(w2, re1.id).title, /the action changed since the check/);
  assert.equal(maintTag(w2, re1.id), null, 'and still not a new defect');
});

test('the same re-inspection never verifies twice: a tracker that could not be saved leaves the verdict to apply, applying it later writes it once, and a second apply or reload changes nothing', async () => {
  const { w, row, id } = defectDone();
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'pass');
  let block = refusing(w, 'sc-actions');
  click(w, w.document.querySelector('[data-save]'));
  const re = recheckRows(w)[0];
  assert.ok(re, 'the re-inspection is saved');
  assert.equal(actions(w)[0].status, 'done', 'the action is untouched');
  assert.match(status(w), /1 could not be written to the Action Tracker: this browser could not save it\. The re-inspection is saved; apply it again from the log/);
  assert.doesNotMatch(status(w), /verified in the Action Tracker/, 'no false success');
  assert.equal(recheckTag(w, re.id).dataset.recheck, '0/0/1/0', 'one verdict to apply');
  assert.ok(recheckTag(w, re.id).classList.contains('is-pending'));
  assert.ok(applyButton(w, re.id), 'the log offers to apply it');
  // Still failing: the same, honestly.
  click(w, applyButton(w, re.id));
  assert.equal(actions(w)[0].status, 'done');
  assert.match(logStatus(w), /could not be written/);
  assert.ok(applyButton(w, re.id));
  // The page reloaded in the middle: the verdict still waits.
  block();
  const w2 = load({ storage: all(w) });
  assert.equal(recheckTag(w2, re.id).dataset.recheck, '0/0/1/0');
  click(w2, applyButton(w2, re.id));
  let a = actions(w2);
  assert.equal(a[0].status, 'verified');
  assert.equal(a[0].proof.recheck, re.id);
  assert.match(logStatus(w2), /1 defects verified/);
  assert.equal(recheckTag(w2, re.id).dataset.recheck, '1/0/0/0');
  assert.equal(applyButton(w2, re.id), null);
  const once = a[0].result;
  assert.equal((once.match(/Verified by the re-inspection/g) || []).length, 1);
  // Applied again by hand (the function behind the button): nothing is written twice.
  const w3 = load({ storage: all(w2) });
  assert.equal(applyButton(w3, re.id), null, 'nothing to apply after a reload');
  assert.equal(actions(w3)[0].result, once);
  assert.equal(actions(w3).length, 1);
  // The tools locked with a PIN: the same path as a full storage. The re-inspection itself cannot be saved while
  // locked: nothing happens, the draft stays a re-inspection, in memory and in storage.
  const { w: w4, row: row4 } = defectDone();
  await reinspect(w4, row4.id);
  answer(w4, 'bathroom-5', 'pass');
  assert.equal(saved(w4).draft.recheckOf, row4.id);
  w4.WorkLock = { locked: true };
  click(w4, w4.document.querySelector('[data-save]'));
  assert.equal(recheckRows(w4).length, 0);
  assert.match(status(w4), /could not save the inspection: nothing was sent/);
  assert.equal(w4.document.querySelector('#ri-kind').value, 'recheck', 'the re-inspection in progress is kept');
  assert.equal(saved(w4).draft.recheckOf, row4.id);
  assert.equal(actions(w4)[0].status, 'done');
  w4.WorkLock = { locked: false };
  click(w4, w4.document.querySelector('[data-save]'));
  assert.equal(recheckRows(w4).length, 1);
  assert.equal(actions(w4)[0].status, 'verified');
});

test('two defects with the same words are kept apart: the re-inspection of one inspection verifies its own action only, linked to the inspection it was started from', async () => {
  const w0 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w0, '412', 'Shower tap drips', '2026-10-20');
  inspect(w0, '412', 'Shower tap drips again', '2026-10-23');
  const [first, second] = saved(w0).rows;
  assert.notEqual(first.id, second.id);
  done(w0, `ri-${first.id}-bathroom-5`);
  done(w0, `ri-${second.id}-bathroom-5`);
  const w = load({ storage: all(w0) });
  assert.ok(reinspectButton(w, first.id) && reinspectButton(w, second.id));
  await reinspect(w, second.id);
  assert.equal(saved(w).draft.recheckOf, second.id, 'the re-inspection is of the row clicked, not of the room');
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  const re = recheckRows(w)[0];
  assert.equal(re.recheckOf, second.id);
  const byId = Object.fromEntries(actions(w).map((a) => [a.id, a]));
  assert.equal(byId[`ri-${second.id}-bathroom-5`].status, 'verified');
  assert.equal(byId[`ri-${second.id}-bathroom-5`].proof.recheck, re.id);
  assert.equal(byId[`ri-${first.id}-bathroom-5`].status, 'done', 'the other defect with the same words is untouched');
  assert.equal(byId[`ri-${first.id}-bathroom-5`].proof, undefined);
  assert.equal(maintTag(w, first.id), '0/1/0/0/0');
  assert.equal(maintTag(w, second.id), '0/0/1/0/0');
  // A room not in the room list: the re-inspection still takes the inspection's room and floor.
  const w1 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w1, '777');
  const odd = saved(w1).rows[0];
  done(w1, `ri-${odd.id}-bathroom-5`);
  const w2 = load({ storage: all(w1) });
  await reinspect(w2, odd.id);
  assert.equal(w2.document.querySelector('#ri-room').value, '777');
  answer(w2, 'bathroom-5', 'pass');
  click(w2, w2.document.querySelector('[data-save]'));
  const re2 = recheckRows(w2)[0];
  assert.deepEqual([re2.room, re2.floor, re2.recheckOf], ['777', '7', odd.id]);
  assert.equal(actions(w2)[0].status, 'verified');
});

test('an item not judged or n.a. changes nothing; an action still open or doing is not verified by a passing check; a defect not in the tracker is left alone', async () => {
  // (a) n.a. and not judged.
  const { w, row } = defectDone();
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'na');
  click(w, w.document.querySelector('[data-save]'));
  const re = recheckRows(w)[0];
  assert.equal(actions(w)[0].status, 'done', 'n.a. verifies nothing');
  assert.equal(actions(w)[0].proof, undefined);
  assert.equal(recheckTag(w, re.id).dataset.recheck, '0/0/0/1');
  assert.match(recheckTag(w, re.id).title, /not checked/);
  assert.equal(applyButton(w, re.id), null);
  assert.doesNotMatch(status(w), /verified|reopened/);
  await reinspect(w, row.id);
  answer(w, 'bathroom-0', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  assert.equal(actions(w)[0].status, 'done', 'another item judged, the defect not: nothing');
  assert.equal(recheckRows(w).length, 2);
  // (b) The action is open (the work was not reported done): a pass does not verify it, a fail does not reopen anything.
  const w0 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w0, '413');
  const open = saved(w0).rows[0];
  const w1 = load({ storage: all(w0) });
  assert.ok(reinspectButton(w1, open.id), 'an open defect can be looked at too');
  await reinspect(w1, open.id);
  assert.equal(w1.document.querySelector('.ri-item[data-qid="bathroom-5"]').dataset.verify, 'open');
  answer(w1, 'bathroom-5', 'pass');
  click(w1, w1.document.querySelector('[data-save]'));
  assert.equal(actions(w1)[0].status, 'open');
  assert.equal(actions(w1)[0].proof, undefined);
  assert.match(recheckTag(w1, recheckRows(w1)[0].id).title, /the action was not done when checked/);
  await reinspect(w1, open.id);
  answer(w1, 'bathroom-5', 'fail');
  click(w1, w1.document.querySelector('[data-save]'));
  assert.equal(actions(w1).length, 1, 'a fail on a still-open defect is the same defect, no second action');
  assert.equal(actions(w1)[0].status, 'open');
  // (c) The defect never reached the tracker (it refused): the re-inspection leaves it, and says so.
  const w2 = load({ storage: { 'sc-room-inspection': SETUP } });
  const block = refusing(w2, 'sc-actions');
  inspect(w2, '412');
  block();
  const unsentRow = saved(w2).rows[0];
  assert.equal(actions(w2).length, 0);
  const w3 = load({ storage: all(w2) });
  assert.equal(reinspectButton(w3, unsentRow.id), null, 'nothing in the tracker to check against');
});

test('a changed checklist, another action under the id, or an action without a ref never verifies the wrong item', async () => {
  // The team's own checklist: the suite checklist with the tap item renamed after the defect was sent.
  const suite = read(DATA.en).templates.suite;
  const custom = { 'custom-x': { name: 'Own suite list', roomTypes: ['suite'], questions: JSON.parse(JSON.stringify(suite.questions)) } };
  const w0 = load({ storage: { 'sc-room-inspection': { ...SETUP, custom, template: 'custom-x' } } });
  inspect(w0, '412');
  const row = saved(w0).rows[0];
  assert.equal(row.template, 'custom-x');
  const id = `ri-${row.id}-bathroom-5`;
  assert.equal(actions(w0)[0].title, `Room 412: ${TAP}`);
  done(w0, id);
  // (a) The checklist item is reworded: the action's title no longer names it; the check does not touch the action.
  const changed = saved(w0);
  changed.custom['custom-x'].questions.bathroom[5].text = 'Tap and drain work (new wording)';
  const w = load({ storage: { ...all(w0), 'sc-room-inspection': changed } });
  await reinspect(w, row.id);
  assert.equal(w.document.querySelector('.ri-item[data-qid="bathroom-5"]').dataset.verify, 'other');
  assert.match(w.document.querySelector('.ri-item[data-qid="bathroom-5"] .ri-verify-tag').textContent, /cannot be matched/);
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  assert.equal(actions(w)[0].status, 'done', 'not verified against a reworded item');
  assert.equal(actions(w)[0].proof, undefined);
  assert.match(recheckTag(w, recheckRows(w)[0].id).title, /the action cannot be matched/);
  // (b) The id held by another tool, or by this tool for another reference: not touched either.
  for (const stranger of [{ source: 'manual' }, { ref: 'otherrow|bathroom-5' }]) {
    const w1 = load({ storage: all(w0) });
    w1.ActionsStore.replaceAll([{ ...actions(w1)[0], ...stranger }]);
    const w2 = load({ storage: all(w1) });
    const tag = maintTag(w2, row.id);
    if (reinspectButton(w2, row.id)) {
      await reinspect(w2, row.id);
      answer(w2, 'bathroom-5', 'pass');
      click(w2, w2.document.querySelector('[data-save]'));
    }
    assert.equal(actions(w2).concat(JSON.parse(w2.localStorage.getItem('sc-actions')).rows.filter((a) => a.source === 'manual'))[0].status, 'done', `${JSON.stringify(stranger)}: untouched (${tag})`);
  }
  // (c) An action of an older page without a ref: found by id, not verified by the check; by hand it still can be.
  const w3 = load({ storage: all(w0) });
  const old = { ...actions(w3)[0] }; delete old.ref;
  w3.ActionsStore.replaceAll([old]);
  const w4 = load({ storage: all(w3) });
  await reinspect(w4, row.id);
  answer(w4, 'bathroom-5', 'pass');
  click(w4, w4.document.querySelector('[data-save]'));
  assert.equal(actions(w4)[0].status, 'done', 'an action without a ref cannot be linked with certainty');
  assert.ok(w4.ActionsStore.update(id, { status: 'verified', result: 'Checked by the chief engineer' }), 'and is verified by hand as before');
});

test('a verified defect keeps its proof: a later check that fails is a new defect with the re-inspection\'s identity, never a change of the old proof', async () => {
  const { w, row, id } = defectDone();
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  const re1 = recheckRows(w)[0];
  const proof = plain(actions(w)[0].proof);
  assert.equal(actions(w)[0].status, 'verified');
  // A week later the tap drips again: the check fails.
  const w2 = load({ storage: all(w), now: '2026-10-31T10:00:00Z' });
  assert.ok(reinspectButton(w2, row.id), 'a verified defect can be checked again');
  await reinspect(w2, row.id);
  assert.equal(w2.document.querySelector('.ri-item[data-qid="bathroom-5"]').dataset.verify, 'verified');
  answer(w2, 'bathroom-5', 'fail');
  click(w2, w2.document.querySelector('[data-save]'));
  const re2 = recheckRows(w2).find((r) => r.id !== re1.id);
  const list = actions(w2);
  assert.equal(list.length, 2, 'a new defect, a new action');
  const old = list.find((a) => a.id === id);
  const fresh = list.find((a) => a.id !== id);
  assert.equal(old.status, 'verified', 'the history stands');
  assert.deepEqual(plain(old.proof), proof, 'the old proof is not copied or changed');
  assert.equal(fresh.id, `ri-${re2.id}-bathroom-5`, 'the new defect carries the re-inspection\'s identity');
  assert.equal(fresh.ref, `${re2.id}|bathroom-5`);
  assert.equal(fresh.status, 'open');
  assert.equal(fresh.proof, undefined);
  assert.equal(re2.sent['bathroom-5'], true, 'sent from the re-inspection');
  assert.equal(maintTag(w2, re2.id), '1/0/0/0/0', 'the re-inspection shows its own new defect');
  assert.equal(recheckTag(w2, re2.id).dataset.recheck, '0/0/0/1');
  assert.match(recheckTag(w2, re2.id).title, /verified before, fails: a new defect/);
  assert.match(status(w2), /1 maintenance items added to actions/);
  // A passing later check leaves the old proof too.
  const w3 = load({ storage: all(w), now: '2026-11-02T10:00:00Z' });
  await reinspect(w3, row.id);
  answer(w3, 'bathroom-5', 'pass');
  click(w3, w3.document.querySelector('[data-save]'));
  assert.deepEqual(plain(actions(w3)[0].proof), proof);
  assert.equal(actions(w3).length, 1);
  assert.match(recheckTag(w3, recheckRows(w3).find((r) => r.id !== re1.id).id).title, /verified before, passes/);
});

test('the store: Verified on a defect action comes from the re-inspection alone; by hand it is refused, cases and plain actions keep their rules, and the proof is the re-inspection\'s to write', async () => {
  const w = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w, '412');
  const S = w.ActionsStore;
  const id = `ri-${saved(w).rows[0].id}-bathroom-5`;
  assert.ok(S.byRecheckOnly(S.byId(id)));
  assert.ok(S.update(id, { status: 'done', result: 'Replaced' }), 'done by hand, as the tracker does');
  assert.equal(S.update(id, { status: 'verified', result: 'Looks fine' }), null, 'verified by hand: refused');
  assert.equal(S.lastUpdate, 'recheck-verifies');
  assert.equal(S.byId(id).status, 'done');
  // A proof by hand: the update goes through (the status did not change), the proof is dropped.
  assert.ok(S.update(id, { proof: { recheck: 'rX', qid: 'bathroom-5', answer: 'pass' } }));
  assert.equal(S.byId(id).proof, undefined, 'the proof written by hand is dropped');
  const proof = { recheck: 'r1abc', date: '2026-10-24', time: '09:30', qid: 'bathroom-5', item: TAP, answer: 'pass' };
  const verified = S.update(id, { status: 'verified', closed: '2026-10-24', result: 'Replaced · Verified', proof }, { byRecheck: true });
  assert.ok(verified);
  assert.deepEqual(plain(verified.proof), proof);
  // The re-inspection may drop the proof again (proofOf(null) keeps none); verified still needs its result.
  assert.ok(S.update(id, { status: 'verified', result: 'x', proof: null }, { byRecheck: true }));
  assert.equal(S.byId(id).proof, undefined);
  assert.ok(S.update(id, { status: 'verified', result: 'Replaced · Verified', proof }, { byRecheck: true }));
  // Reopened by hand (maintenance says it is not fixed) is allowed, and keeps the proof as history.
  assert.ok(S.update(id, { status: 'open' }));
  assert.deepEqual(plain(S.byId(id).proof), proof);
  // A plain action and an older one without a ref: verified by hand with a result, as before.
  const plainOne = S.add({ title: 'Fix the lobby light', source: 'manual' });
  assert.equal(S.update(plainOne.id, { status: 'verified' }), null);
  assert.equal(S.lastUpdate, 'needs-result');
  assert.ok(S.update(plainOne.id, { status: 'verified', result: 'Light works' }));
  const older = S.add({ id: 'a-old-1', title: 'Room 412: Tap', source: 'room-inspection', status: 'done', result: 'Fixed' });
  assert.ok(!S.byRecheckOnly(older));
  assert.ok(S.update(older.id, { status: 'verified', result: 'Fixed and seen' }));
  // A case's action keeps the case's rule.
  const cased = S.add({ title: 'Brief the drivers', source: 'cx-tower', caseId: 'INV-2026-0001', status: 'done', result: 'Briefed' });
  assert.equal(S.update(cased.id, { status: 'verified', result: 'Rate fell' }), null);
  assert.equal(S.lastUpdate, 'case-verifies');
  assert.ok(S.update(cased.id, { status: 'verified', result: 'Rate fell' }, { byCase: true }));
  // The proof is cleaned whole or not at all.
  assert.equal(S.clean({ title: 't', proof: { recheck: 'r1', qid: 'bad qid', answer: 'pass' } }).proof, undefined);
  assert.equal(S.clean({ title: 't', proof: { recheck: 'r1', qid: 'bathroom-5', answer: 'maybe' } }).proof, undefined);
  assert.deepEqual(plain(S.clean({ title: 't', proof: { recheck: 'r1/../x', qid: 'bathroom-5', answer: 'fail', date: 'yesterday', time: '25:00', item: 'Tap' } }).proof), { recheck: 'r1x', date: '', time: '', qid: 'bathroom-5', item: 'Tap', answer: 'fail' });
});

test('the Action Tracker page: Verified is greyed on a defect action until a re-inspection, the proof is shown, and the message says where Verified comes from', async () => {
  const w0 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w0, '412');
  const id = `ri-${saved(w0).rows[0].id}-bathroom-5`;
  done(w0, id);
  // The tracker opens on open actions; the done one is under "All".
  const t = loadTracker({ ...all(w0), 'sc-actions-ui': { status: 'all' } });
  const li = t.document.querySelector(`.at-item[data-id="${id}"]`);
  assert.ok(li, 'the defect action is listed');
  const select = li.querySelector('select');
  const option = [...select.options].find((o) => o.value === 'verified');
  assert.equal(option.disabled, true, 'Verified is not for the hand here');
  assert.match(select.title, /Verified comes from a re-inspection of the room/);
  assert.match(li.textContent, /Verified by a re-inspection of the room, once the fix is checked there/);
  // Forced anyway (a script, an old page): refused with the message.
  select.value = 'verified';
  select.dispatchEvent(new t.Event('change', { bubbles: true }));
  assert.equal(JSON.parse(t.localStorage.getItem('sc-actions')).rows.find((a) => a.id === id).status, 'done');
  assert.match(t.document.querySelector('[data-log-status]').textContent, /Verified comes from a re-inspection of the room in Room Inspection/);
  // After the re-inspection: verified, with the proof on the page.
  const w1 = load({ storage: all(w0) });
  await reinspect(w1, saved(w1).rows[0].id);
  answer(w1, 'bathroom-5', 'pass');
  click(w1, w1.document.querySelector('[data-save]'));
  const t2 = loadTracker({ ...all(w1), 'sc-actions-ui': { status: 'all' } });
  const li2 = t2.document.querySelector(`.at-item[data-id="${id}"]`);
  assert.equal(li2.querySelector('select').value, 'verified');
  assert.match(li2.querySelector('.at-proof').textContent, /^Checked in the room on .*: Tap, drain and flush work, nothing drips passes\.$/);
  assert.match(li2.textContent, /Verified by the re-inspection of room 412/);
  // A plain action of the tracker is verified by hand as before.
  const plainOne = t2.ActionsStore.add({ title: 'Fix the lobby light', source: 'manual', status: 'done', result: 'Light works' });
  t2.dispatchEvent(new t2.Event('storage'));
  const li3 = [...t2.document.querySelectorAll('.at-item')].find((n) => n.dataset.id === plainOne.id) || (t2.document.querySelector('[data-status-filter] button[data-status="done"]') && null);
  if (li3) assert.equal([...li3.querySelector('select').options].find((o) => o.value === 'verified').disabled, false);
  assert.ok(t2.ActionsStore.update(plainOne.id, { status: 'verified' }));
});

test('KPI: a re-inspection counts in no first-time pass rate (total, attendant, floor, week), a complete one counts in the average score, an incomplete one in neither, and the same-day re-check rule stays', async () => {
  const M = load({ storage: {} }).RoomInspectionMath;
  const items = M.itemsOf({ questions: { bed: [{ text: 'Linen', weight: 3, critical: true }, { text: 'Made', weight: 2 }], bathroom: [{ text: 'Tap', weight: 2, fix: 'maintenance' }] } }, ['bed', 'bathroom']);
  const row = (id, date, time, room, floor, attendant, answers, extra = {}) => ({ id, date, time, room, floor, attendant, template: 't', kind: 'checkout', answers, flags: { 'bathroom-0': 'maintenance' }, sent: {}, ...extra });
  const rows = [
    row('r1', '2026-10-20', '10:00', '412', '4', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'fail' }),
    // The re-inspection two days later, the tap only: incomplete, counts nowhere.
    row('c1', '2026-10-22', '09:00', '412', '4', 'Ana', { 'bathroom-0': 'pass' }, { kind: 'recheck', recheckOf: 'r1' }),
    // A re-inspection that checks every item: in the average score, not in the first-time pass rate.
    row('c2', '2026-10-23', '09:00', '412', '4', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }, { kind: 'recheck', recheckOf: 'r1' }),
    // A first inspection of another room, and the same room again on the day it failed (the rule of before).
    row('r2', '2026-10-23', '11:00', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'fail', 'bathroom-0': 'pass' }),
    row('r3', '2026-10-23', '11:40', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
    // Room 412 again the next week: a first inspection, whatever happened before.
    row('r4', '2026-10-27', '10:00', '412', '4', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
  ];
  const a = M.annotate(rows, () => items, 0.9);
  assert.deepEqual(plain(a.map((r) => [r.id, r.recheck, r.pass, r.incomplete])), [['r1', false, false, false], ['c1', true, null, true], ['c2', true, true, false], ['r2', false, false, false], ['r3', true, true, false], ['r4', false, true, false]]);
  const all = plain(M.overall(a));
  assert.deepEqual([all.n, all.first, all.firstPass, all.incomplete], [6, 3, 1, 1], 'first inspections: r1, r2, r4; passed at first: r4');
  assert.equal(all.rate, 1 / 3);
  assert.equal(all.scored, undefined);
  // The average: r1 (5/7), c2 (1), r2 (5/7), r3 (1), r4 (1); c1 is incomplete.
  assert.ok(Math.abs(all.avg - (5 / 7 + 1 + 5 / 7 + 1 + 1) / 5) < 1e-12, `average ${all.avg}`);
  const ana = plain(M.rateBy(a, (r) => r.attendant).find((g) => g.key === 'Ana'));
  assert.deepEqual([ana.n, ana.first, ana.firstPass], [4, 2, 1], 'Ana: r1 and r4 count, the re-inspections do not');
  const floor4 = plain(M.rateBy(a, (r) => r.floor).find((g) => g.key === '4'));
  assert.deepEqual([floor4.first, floor4.firstPass], [3, 1]);
  assert.deepEqual(plain(M.weekly(a)).map((wk) => [wk.week, wk.n, wk.first, wk.firstPass]), [['2026-10-19', 5, 2, 0], ['2026-10-26', 1, 1, 1]]);
  // Without the re-inspections the rate is the same: they inflate nothing.
  const without = plain(M.overall(M.annotate(rows.filter((r) => r.kind !== 'recheck'), () => items, 0.9)));
  assert.deepEqual([without.first, without.firstPass, without.rate], [all.first, all.firstPass, all.rate]);
  // On the page: the first-time pass figures before and after a re-inspection that passes.
  const { w, row: orig } = defectDone();
  const figure = () => w.document.querySelector('.ri-stats').textContent.match(/(\d+) of (\d+) rooms passed at the first inspection/).slice(1, 3).map(Number);
  const before = figure();
  assert.equal(before[1], 1, 'one first inspection');
  await reinspect(w, orig.id);
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  assert.deepEqual(figure(), before, 'a passing re-inspection is neither a first inspection nor a first-time pass');
  assert.match(w.document.querySelector('.ri-stats').textContent, /1 incomplete inspection, not counted/, 'one item checked: incomplete, in neither rate');
});

test('old data opens as before, and a re-inspection row is read whole or not at all', async () => {
  const rows = [
    { id: 'rold1', date: '2026-10-20', time: '09:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'checkout', template: 'suite', answers: { 'bathroom-5': 'fail', 'bathroom-0': 'pass' }, notes: {}, flags: { 'bathroom-5': 'maintenance' }, sent: { 'bathroom-5': true } },
    // A row with recheckOf but another kind (made by hand or by a damaged save): the link is dropped, the row stays.
    { id: 'rodd', date: '2026-10-21', time: '09:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'vip', template: 'suite', answers: { 'bathroom-5': 'pass' }, notes: {}, flags: {}, sent: {}, recheckOf: 'rold1' },
    // A re-inspection whose inspection is gone: kept, shown as such, nothing to apply.
    { id: 'rgone', date: '2026-10-22', time: '09:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'recheck', template: 'suite', answers: { 'bathroom-5': 'pass' }, notes: {}, flags: {}, sent: {}, recheckOf: 'r-missing' },
    // A re-inspection with a damaged link.
    { id: 'rbad', date: '2026-10-22', time: '10:00', room: '412', floor: '4', roomType: 'suite', attendant: 'Jonas', inspector: 'Elena', kind: 'recheck', template: 'suite', answers: { 'bathroom-5': 'pass' }, notes: {}, flags: {}, sent: {}, recheckOf: { id: 'x' } },
  ];
  const oldAction = { id: 'a1k2j3', title: `Room 412: ${TAP}`, source: 'room-inspection', status: 'done', result: 'Fixed', created: '2026-10-20', closed: '2026-10-21' };
  const w = load({ storage: { 'sc-room-inspection': { ...SETUP, rows, draft: { room: '412', answers: { 'bathroom-5': 'pass' }, recheckOf: 'r-missing', kind: 'recheck' } }, 'sc-actions': { rows: [oldAction] } } });
  const kept = saved(w) || { rows: [] };
  // Nothing is written on a plain load; the page's view of the data:
  assert.equal(w.document.querySelectorAll('tr[data-row]').length, 4, 'every row opens');
  assert.equal(maintTag(w, 'rold1'), '0/0/0/1/0', 'an older page\'s sent flag reads as sent');
  assert.equal(reinspectButton(w, 'rold1'), null, 'no action to find by id or ref: nothing to check against');
  assert.match(w.document.querySelector('tr[data-row="rgone"] .ri-recheck-of').textContent, /the inspection it checked is gone/);
  assert.match(recheckTag(w, 'rgone').textContent, /inspection not found/);
  assert.equal(applyButton(w, 'rgone'), null);
  assert.equal(w.document.querySelector('tr[data-row="rbad"] .ri-recheck'), null, 'a damaged link is dropped: a re-inspection without one');
  assert.equal(w.document.querySelector('#ri-kind').value, 'checkout', 'a draft that re-inspects a missing inspection is a plain draft again');
  assert.equal(w.document.querySelector('#ri-room').disabled, false);
  // The first change saves the cleaned state.
  type(w, w.document.querySelector('#ri-inspector'), 'Elena');
  const now = saved(w);
  assert.equal(now.rows.find((r) => r.id === 'rodd').recheckOf, undefined);
  assert.equal(now.rows.find((r) => r.id === 'rgone').recheckOf, 'r-missing');
  assert.equal(now.rows.find((r) => r.id === 'rbad').recheckOf, undefined);
  assert.equal(now.rows.find((r) => r.id === 'rbad').kind, 'recheck');
  assert.equal(now.draft.recheckOf, undefined);
  assert.deepEqual(plain(w.ActionsStore.list()), [plain(w.ActionsStore.clean(oldAction))], 'the old action is left as it is');
  assert.equal(kept.rows.length, 4);
});

test('German and Albanian: the button, the note, the kind, the messages and the proof in the page\'s language', { skip: !fs.existsSync('_site/js/ui-de.js') && 'run npm run build first' }, async () => {
  for (const [lang, words] of [['de', { button: 'Nachkontrolle', note: /Nachkontrolle Zimmer 412/, saved: /Nachkontrolle von Zimmer 412 gespeichert/, verified: /1 Mängel im Maßnahmen-Tracker geprüft/, kind: 'Nachkontrolle', proof: /^Geprüft durch die Nachkontrolle von Zimmer 412/ }], ['sq', { button: 'Riinspekto', note: /Riinspektim i dhomës 412/, saved: /Riinspektimi i dhomës 412 u ruajt/, verified: /1 defekte të verifikuara/, kind: 'Riinspektim', proof: /^Verifikuar nga riinspektimi i dhomës 412/ }]]) {
    const key = read(DATA[lang]).storageKey;
    const w0 = load({ lang, storage: { [key]: SETUP } });
    inspect(w0, '412');
    const row = saved(w0, key).rows[0];
    done(w0, `ri-${row.id}-bathroom-5`);
    const w = load({ lang, storage: all(w0) });
    const again = reinspectButton(w, row.id);
    assert.equal(again.textContent, words.button, `${lang}: the button`);
    await reinspect(w, row.id);
    assert.match(w.document.querySelector('[data-recheck-note]').textContent, words.note, `${lang}: the note`);
    assert.doesNotMatch(w.document.querySelector('[data-recheck-note]').textContent, /Re-inspection of room|maintenance defect to check/, `${lang}: no English in the note`);
    answer(w, 'bathroom-5', 'pass');
    click(w, w.document.querySelector('[data-save]'));
    assert.match(status(w), words.saved, `${lang}: ${status(w)}`);
    assert.match(status(w), words.verified, `${lang}: ${status(w)}`);
    const re = saved(w, key).rows.find((r) => r.kind === 'recheck');
    assert.equal(w.document.querySelector(`tr[data-row="${re.id}"] td:nth-child(5)`).textContent, words.kind, `${lang}: the kind in the log`);
    assert.doesNotMatch(w.document.querySelector(`tr[data-row="${re.id}"]`).textContent, /Re-inspection:|verified\b/, `${lang}: the tag is translated`);
    const a = actions(w)[0];
    assert.equal(a.status, 'verified');
    assert.match(a.result.split(' · ').pop(), words.proof, `${lang}: the result line`);
  }
});

test('two devices with team sync: a re-inspection made on one device verifies the defect on the other after the merge; a stale status can still win the merge, and the page then offers the verdict again, never twice', async () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools.html', runScripts: 'outside-only' });
  const t = dom.window;
  Object.defineProperty(t, 'crypto', { configurable: true, value: globalThis.crypto });
  Object.assign(t, { TextEncoder, TextDecoder, CompressionStream, DecompressionStream });
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) t.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const M = t.TeamSyncMath;
  // Device A: the inspection, its action marked done on 21 October.
  const wA = load({ storage: { 'sc-room-inspection': SETUP }, now: '2026-10-20T09:00:00Z' });
  inspect(wA, '412');
  const row = saved(wA).rows[0];
  const id = `ri-${row.id}-bathroom-5`;
  wA.ActionsStore.update(id, { status: 'done', result: 'Cartridge replaced', closed: '2026-10-21' });
  // Device B holds the same copy (after a sync) and makes the re-inspection on 23 October: verified there.
  const wB = load({ storage: all(wA), now: '2026-10-23T10:00:00Z' });
  await reinspect(wB, row.id);
  {
    answer(wB, 'bathroom-5', 'pass');
    click(wB, wB.document.querySelector('[data-save]'));
    const re = recheckRows(wB)[0];
    assert.equal(actions(wB)[0].status, 'verified');
    assert.equal(actions(wB)[0].closed, '2026-10-23', 'closed on the day of the proof: the verified row is the newer one');
    // (a) The merge: A's rows gain the re-inspection; A's done action meets B's verified one, and the newer (B) wins.
    const rows = M.mergeRows(saved(wA).rows, saved(wB).rows);
    assert.equal(rows.length, 2, 'the re-inspection travels as a row of its own');
    assert.ok(rows.some((r) => r.id === re.id && r.recheckOf === row.id));
    const merged = M.mergeRows(actions(wA), actions(wB));
    assert.equal(merged.length, 1, 'one action for one defect');
    assert.equal(merged[0].status, 'verified');
    assert.equal(merged[0].proof.recheck, re.id, 'the proof travels with the action');
    // On device A after the sync: verified, nothing to apply, nothing written twice.
    const wA2 = load({ storage: { ...all(wA), 'sc-room-inspection': { ...saved(wA), rows }, 'sc-actions': { rows: merged } }, now: '2026-10-23T12:00:00Z' });
    assert.equal(recheckTag(wA2, re.id).dataset.recheck, '1/0/0/0');
    assert.equal(applyButton(wA2, re.id), null);
    assert.equal(maintTag(wA2, row.id), '0/0/1/0/0');
    // (b) A stale status: device A reopened the action by hand on the same day the re-inspection verified it, so no
    // stamp tells the rows apart; pickRow keeps the team's copy whole, and one side's change is lost. The page does not
    // hide it: with the done/open action beside a re-inspection that passed, it offers the verdict to apply again.
    const staleA = [{ ...actions(wA)[0], status: 'open', closed: '', result: 'Not fixed after all' }];
    const picked = M.mergeRows(staleA, actions(wB));
    assert.equal(picked.length, 1);
    assert.ok(['open', 'verified'].includes(picked[0].status), 'one version wins whole; the code does not merge the two');
    const wA3 = load({ storage: { ...all(wA), 'sc-room-inspection': { ...saved(wA), rows }, 'sc-actions': { rows: [{ ...actions(wA)[0] }] } }, now: '2026-10-23T12:00:00Z' });
    assert.equal(actions(wA3)[0].status, 'done', 'the stale done copy won on this device');
    assert.equal(recheckTag(wA3, re.id).dataset.recheck, '0/0/1/0', 'the re-inspection shows its verdict as not yet applied here');
    click(wA3, applyButton(wA3, re.id));
    assert.equal(actions(wA3)[0].status, 'verified');
    assert.equal(actions(wA3)[0].proof.recheck, re.id);
    assert.equal((actions(wA3)[0].result.match(/Verified by the re-inspection/g) || []).length, 1, 'written once');
    assert.equal(applyButton(wA3, re.id), null);
    // (c) A reopening lost to a stale "done" (the reopened row has no closed date, so the dated one reads as newer):
    // the page offers the reopening again on that device.
    const wC = load({ storage: all(wA), now: '2026-10-23T10:00:00Z' });
    await reinspect(wC, row.id);
    answer(wC, 'bathroom-5', 'fail');
    click(wC, wC.document.querySelector('[data-save]'));
    const reC = recheckRows(wC)[0];
    assert.equal(actions(wC)[0].status, 'open', 'reopened on device C');
    const lost = M.mergeRows(actions(wA), actions(wC));
    assert.equal(lost[0].status, 'done', 'the stale done copy wins the merge: a limit of pickRow, documented, not hidden');
    const wC2 = load({ storage: { ...all(wA), 'sc-room-inspection': { ...saved(wA), rows: M.mergeRows(saved(wA).rows, saved(wC).rows) }, 'sc-actions': { rows: lost } }, now: '2026-10-23T12:00:00Z' });
    assert.equal(recheckTag(wC2, reC.id).dataset.recheck, '0/0/1/0', 'the reopening waits to be applied again');
    click(wC2, applyButton(wC2, reC.id));
    assert.equal(actions(wC2)[0].status, 'open');
    assert.equal(actions(wC2)[0].proof.recheck, reC.id);
  }
});

// Audit of 28d3a357: four gaps, each with the test that failed on it.
test('gap 1: a re-inspection replays only the verdict that was eligible when it was made; a later repair is not verified or reopened by an old check, and a verdict whose action changed since is not written', async () => {
  // (a) Pass while the action was open: nothing then, nothing after the action is done later.
  const w0 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w0, '412');
  const row = saved(w0).rows[0];
  const id = `ri-${row.id}-bathroom-5`;
  const w = load({ storage: all(w0) });
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  const re = recheckRows(w)[0];
  assert.equal(actions(w)[0].status, 'open', 'open when checked: nothing verified');
  assert.deepEqual(plain(re.checks['bathroom-5']).status, 'open', 'the state of the action at the check is kept with the re-inspection');
  done(w, id);
  const w2 = load({ storage: all(w) });
  assert.equal(applyButton(w2, re.id), null, 'the old check does not become a verdict on the later repair');
  assert.equal(recheckTag(w2, re.id).dataset.recheck, '0/0/0/1');
  assert.match(recheckTag(w2, re.id).title, /the action was not done when checked/);
  assert.equal(actions(w2)[0].status, 'done');
  assert.equal(actions(w2)[0].proof, undefined);
  // (b) Fail while open, then done: the old failure does not reopen the newer repair.
  const w3 = load({ storage: { 'sc-room-inspection': SETUP } });
  inspect(w3, '413');
  const row3 = saved(w3).rows[0];
  const w4 = load({ storage: all(w3) });
  await reinspect(w4, row3.id);
  answer(w4, 'bathroom-5', 'fail');
  click(w4, w4.document.querySelector('[data-save]'));
  const re4 = recheckRows(w4)[0];
  done(w4, `ri-${row3.id}-bathroom-5`);
  const w5 = load({ storage: all(w4) });
  assert.equal(applyButton(w5, re4.id), null);
  assert.equal(actions(w5)[0].status, 'done', 'the later repair stands');
  assert.equal(recheckTag(w5, re4.id).dataset.recheck, '0/0/0/1');
  // (c) Done when checked, the tracker could not be written: the verdict waits and is applied; but once the action
  // changed materially since (reopened and done again, a new closed date), the old verdict is not written over it.
  const { w: w6, row: row6, id: id6 } = defectDone();
  await reinspect(w6, row6.id);
  answer(w6, 'bathroom-5', 'pass');
  const block = refusing(w6, 'sc-actions');
  click(w6, w6.document.querySelector('[data-save]'));
  block();
  const re6 = recheckRows(w6)[0];
  assert.equal(plain(re6.checks['bathroom-5']).status, 'done');
  const w7 = load({ storage: all(w6) });
  assert.ok(applyButton(w7, re6.id), 'the same repair: the verdict waits');
  // The repair is redone before anyone applies it.
  assert.ok(w7.ActionsStore.update(id6, { status: 'open' }));
  assert.ok(w7.ActionsStore.update(id6, { status: 'done', result: 'Whole tap replaced', closed: '2026-10-30' }));
  const w8 = load({ storage: all(w7) });
  assert.equal(applyButton(w8, re6.id), null, 'another repair: the old check says nothing about it');
  assert.match(recheckTag(w8, re6.id).title, /the action changed since the check/);
  assert.equal(actions(w8)[0].status, 'done');
  assert.equal(actions(w8)[0].proof, undefined);
  // A re-inspection saved without the record of the action's state (an older row): nothing is applied by it.
  const w9 = load({ storage: all(w6) });
  const s9 = saved(w9); delete s9.rows.find((r) => r.id === re6.id).checks;
  const w10 = load({ storage: { ...all(w9), 'sc-room-inspection': s9 } });
  assert.equal(applyButton(w10, re6.id), null);
  assert.match(recheckTag(w10, re6.id).title, /no record of the action's state when checked/);
});

test('gap 2: a new defect found by a re-inspection has its own lifecycle: its row offers Reinspect, the check verifies its own action, and the original proof stands', async () => {
  const { w, row, id } = defectDone();
  await reinspect(w, row.id);
  answer(w, 'bathroom-5', 'pass');
  click(w, w.document.querySelector('[data-save]'));
  const re1 = recheckRows(w)[0];
  const proof1 = plain(actions(w)[0].proof);
  // Generation two: a later check fails → a new defect under the re-inspection's identity.
  const w2 = load({ storage: all(w), now: '2026-10-31T10:00:00Z' });
  await reinspect(w2, row.id);
  answer(w2, 'bathroom-5', 'fail');
  click(w2, w2.document.querySelector('[data-save]'));
  const re2 = recheckRows(w2).find((r) => r.id !== re1.id);
  const id2 = `ri-${re2.id}-bathroom-5`;
  assert.equal(actions(w2).length, 2);
  assert.equal(actions(w2).find((a) => a.id === id2).status, 'open');
  // Maintenance fixes it: done. The row that owns the new defect offers Reinspect.
  done(w2, id2, 'Second cartridge');
  const w3 = load({ storage: all(w2), now: '2026-11-01T10:00:00Z' });
  assert.equal(maintTag(w3, re2.id), '0/1/0/0/0');
  assert.ok(reinspectButton(w3, re2.id), 'the re-inspection row with its own defect can be re-inspected');
  await reinspect(w3, re2.id);
  assert.equal(saved(w3).draft.recheckOf, re2.id, 'the check is of the row that owns the new defect');
  assert.match(w3.document.querySelector('[data-recheck-note]').textContent, /1 maintenance defect to check/);
  assert.equal(w3.document.querySelector('.ri-item[data-qid="bathroom-5"]').dataset.verify, 'done');
  answer(w3, 'bathroom-5', 'pass');
  click(w3, w3.document.querySelector('[data-save]'));
  const re3 = recheckRows(w3).find((r) => r.recheckOf === re2.id);
  assert.ok(re3);
  const list = actions(w3);
  const second = list.find((a) => a.id === id2);
  const first = list.find((a) => a.id === id);
  assert.equal(second.status, 'verified', 'the new defect is verified by its own check');
  assert.equal(second.proof.recheck, re3.id);
  assert.equal(first.status, 'verified', 'the original stands');
  assert.deepEqual(plain(first.proof), proof1, 'with its own proof untouched');
  assert.equal(list.length, 2, 'no third action');
  assert.equal(recheckTag(w3, re3.id).dataset.recheck, '1/0/0/0');
  assert.equal(maintTag(w3, re2.id), '0/0/1/0/0');
  assert.equal(maintTag(w3, row.id), '0/0/1/0/0');
  // The second-generation re-inspection has no defect of its own, and the first generation is unchanged history.
  assert.equal(maintTag(w3, re3.id), null);
  assert.equal(recheckTag(w3, re2.id).dataset.recheck, '0/0/0/1');
});

test('gap 3: a failed re-inspection does not turn the next ordinary inspection of the room that day into a same-day re-check; the ordinary rule and the KPIs stay', () => {
  const M = load({ storage: {} }).RoomInspectionMath;
  const items = M.itemsOf({ questions: { bed: [{ text: 'Linen', weight: 3, critical: true }, { text: 'Made', weight: 2 }], bathroom: [{ text: 'Tap', weight: 2, fix: 'maintenance' }] } }, ['bed', 'bathroom']);
  const row = (id, date, time, room, floor, attendant, answers, extra = {}) => ({ id, date, time, room, floor, attendant, template: 't', kind: 'checkout', answers, flags: { 'bathroom-0': 'maintenance' }, sent: {}, ...extra });
  const rows = [
    row('r1', '2026-10-20', '10:00', '412', '4', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'fail' }),
    // Today: the re-inspection of r1 fails (the tap still drips), then the room is cleaned and inspected as usual.
    row('c1', '2026-10-24', '09:00', '412', '4', 'Ana', { 'bathroom-0': 'fail' }, { kind: 'recheck', recheckOf: 'r1' }),
    row('r2', '2026-10-24', '11:00', '412', '4', 'Ana', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
    // Another room: an ordinary fail, then the same room again that day: the rule of before.
    row('r3', '2026-10-24', '12:00', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'fail', 'bathroom-0': 'pass' }),
    row('r4', '2026-10-24', '12:40', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
    // A complete re-inspection that fails: excluded from the rate, in the average; and the room's next-day inspection is a first one.
    row('c2', '2026-10-25', '09:00', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'fail', 'bathroom-0': 'pass' }, { kind: 'recheck', recheckOf: 'r3' }),
    row('r5', '2026-10-25', '11:00', '413', '4', 'Ben', { 'bed-0': 'pass', 'bed-1': 'pass', 'bathroom-0': 'pass' }),
  ];
  const a = M.annotate(rows, () => items, 0.9);
  assert.deepEqual(plain(a.map((r) => [r.id, r.recheck, r.pass])), [['r1', false, false], ['c1', true, null], ['r2', false, true], ['r3', false, false], ['r4', true, true], ['c2', true, false], ['r5', false, true]],
    'r2 is a first inspection (only a re-inspection failed before it); r4 is a same-day re-check as before; r5 is a first inspection');
  const all = plain(M.overall(a));
  assert.deepEqual([all.n, all.first, all.firstPass, all.incomplete], [7, 4, 2, 1], 'first: r1, r2, r3, r5; passed at first: r2, r5');
  assert.equal(all.rate, 0.5);
  // The average: r1 5/7, r2 1, r3 5/7, r4 1, c2 5/7, r5 1; c1 incomplete.
  assert.ok(Math.abs(all.avg - (5 / 7 + 1 + 5 / 7 + 1 + 5 / 7 + 1) / 6) < 1e-12);
  const ana = plain(M.rateBy(a, (r) => r.attendant).find((g) => g.key === 'Ana'));
  assert.deepEqual([ana.n, ana.first, ana.firstPass, ana.rate], [3, 2, 1, 0.5]);
  const ben = plain(M.rateBy(a, (r) => r.attendant).find((g) => g.key === 'Ben'));
  assert.deepEqual([ben.n, ben.first, ben.firstPass], [4, 2, 1]);
  const floor4 = plain(M.rateBy(a, (r) => r.floor).find((g) => g.key === '4'));
  assert.deepEqual([floor4.first, floor4.firstPass], [4, 2]);
  assert.deepEqual(plain(M.weekly(a)).map((wk) => [wk.week, wk.n, wk.first, wk.firstPass]), [['2026-10-19', 7, 4, 2]]);
  // On the page: a re-inspection that fails, then an ordinary inspection of the room that passes: a first-time pass.
  const { w, row: orig } = defectDone();
  return (async () => {
    await reinspect(w, orig.id);
    answer(w, 'bathroom-5', 'fail');
    click(w, w.document.querySelector('[data-save]'));
    const figure = () => w.document.querySelector('.ri-stats').textContent.match(/(\d+) of (\d+) rooms passed at the first inspection/).slice(1, 3).map(Number);
    const before = figure();
    inspect(w, '412');
    assert.deepEqual(figure(), [before[0] + 1, before[1] + 1], 'the ordinary inspection after the failed re-inspection counts as a first inspection that passed');
    assert.equal(w.document.querySelectorAll('tr[data-row] .dl-tag:not(.ri-maint):not(.ri-recheck):not(.ri-verify-tag)').length, 0, 'no same-day re-check tag on it');
  })();
});

test('gap 4: in a re-inspection "Mark the rest as pass" leaves the defects to check for the supervisor\'s own answer, so an unchecked defect is never verified; the ordinary inspection keeps bulk pass', async () => {
  const { w, row, id } = defectDone();
  await reinspect(w, row.id);
  const rest = w.document.querySelector('[data-rest-pass]');
  click(w, rest);
  assert.equal(w.document.querySelector('input[name="ri-bathroom-5"]:checked'), null, 'the defect to check is not answered by the bulk pass');
  assert.ok(checkedCount(w) > 0, 'the other items are');
  assert.match(status(w), /the defects to check wait for your own answer/);
  assert.equal(rest.disabled, true, 'nothing left for the bulk pass but the defects');
  click(w, w.document.querySelector('[data-save]'));
  const re = recheckRows(w)[0];
  assert.equal(re.answers['bathroom-5'], undefined);
  assert.equal(actions(w)[0].status, 'done', 'not verified');
  assert.equal(actions(w)[0].proof, undefined);
  assert.equal(recheckTag(w, re.id).dataset.recheck, '0/0/0/1');
  assert.match(recheckTag(w, re.id).title, /not checked/);
  assert.equal(applyButton(w, re.id), null);
  assert.equal(id, `ri-${row.id}-bathroom-5`);
  // An ordinary inspection: bulk pass answers every open item, as before.
  type(w, w.document.querySelector('#ri-room'), '413');
  click(w, w.document.querySelector('[data-rest-pass]'));
  assert.equal(w.document.querySelectorAll('.ri-item input[data-answer]:not(:checked)').length, w.document.querySelectorAll('.ri-item').length * 2, 'every item has one answer');
  assert.match(status(w), /items marked as pass\./);
});
