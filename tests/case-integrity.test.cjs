// The integrity of the case thread (review of PR #367): two cases with the same action text keep separate links; an
// action of a case is verified by the case alone, never by a result typed in the tracker; a deleted investigation's
// id is not given to a new one while its actions exist; the whys travel inside the browser, not in the address; the
// before and after windows never share a day and the sample floor is the one saved with the evidence; and when the
// browser cannot save during a decision, the tower and the tracker stay in agreement. Every row is the example
// station's, invented. Each test failed on the code before the fix it names.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { tower, startCase } = require('./helpers/cx-tower-page.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
// A storage that refuses one key: the browser is full, or the key is blocked.
const refusing = (w, key) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (k, value) {
    if (String(k) === key && this === w.localStorage) throw new w.DOMException('full', 'QuotaExceededError');
    return real.call(this, k, value);
  };
  return () => { w.Storage.prototype.setItem = real; };
};
const done = (t, id) => {
  t.S.update(t.S.forCase(id)[0].id, { status: 'done' });
  t.tab('actions');
  t.tab('deep');
  t.setValue('#cx-verify-from', '2026-09-14');
};

test('1. two investigations with the same action text get two actions, each linked to its own case', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const [a] = t.stored().cases;
  startCase(t, 'late', 'Late deliveries on the evening wave');
  t.click(t.button('Create the linked action'));
  const cases = t.stored().cases;
  assert.equal(cases.length, 2);
  const [, b] = cases;
  assert.notEqual(b.id, a.id);
  const actions = t.S.list();
  assert.equal(actions.length, 2, 'one action per case, the same text twice');
  assert.deepEqual(plain(actions.map((x) => x.title)), [actions[0].title, actions[0].title]);
  assert.deepEqual(plain(t.S.forCase(a.id).map((x) => x.id)), [a.trackerId]);
  assert.deepEqual(plain(t.S.forCase(b.id).map((x) => x.id)), [b.trackerId]);
  assert.notEqual(a.trackerId, b.trackerId, 'the second case never takes the first case\'s action');
  assert.equal(t.S.forCase(a.id)[0].caseId, a.id);
  assert.equal(t.S.forCase(b.id)[0].caseId, b.id);
  // A second click on either case adds nothing.
  t.click(t.button('Create the linked action'));
  assert.equal(t.S.list().length, 2);
  // The same text without a case (typed in the tracker) is a third, separate action; a repeat of it is the duplicate.
  assert.ok(t.S.add({ title: actions[0].title, source: 'cx-control-tower' }));
  assert.equal(t.S.add({ title: actions[0].title, source: 'cx-control-tower' }), null);
  assert.equal(t.S.lastAdd, 'duplicate');
  assert.equal(t.S.list().length, 3);
});

test('2. an action of a case is verified by the case, from the KPI: a result typed in the tracker does not verify it, and a verified one is not reopened by hand', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  const action = t.S.forCase(id)[0];
  // By hand: refused, whatever the result says.
  assert.equal(t.S.update(action.id, { status: 'verified', result: 'Looked fine to me' }), null);
  assert.equal(t.S.lastUpdate, 'case-verifies');
  assert.equal(t.S.list()[0].status, 'open');
  // Done by hand is fine; the result may be written; the status is the case's.
  assert.equal(t.S.update(action.id, { status: 'done', result: 'Sequence in place' }).status, 'done');
  done(t, id);
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.equal(t.stored().cases[0].status, 'Verified effective');
  const verified = t.S.list()[0];
  assert.equal(verified.status, 'verified');
  assert.ok(verified.result.includes('Verified effective'), 'the result is the case\'s decision');
  // Back to done or open by hand: refused; the case reopens it.
  assert.equal(t.S.update(action.id, { status: 'done' }), null);
  assert.equal(t.S.lastUpdate, 'case-verifies');
  assert.equal(t.S.update(action.id, { status: 'open' }), null);
  assert.equal(t.S.list()[0].status, 'verified');
  assert.equal(t.S.update(action.id, { result: 'A note added later' }).status, 'verified', 'the text may still be edited');
  // An action without a case is verified by hand as before, with a result.
  const plainAction = t.S.add({ title: 'Toolbox talk', source: 'manual' });
  assert.equal(t.S.update(plainAction.id, { status: 'verified', result: 'Held on 12 Sep, attendance list signed' }).status, 'verified');
});

test('2b. the tracker page offers "verified" only for actions without a case', { skip: !fs.existsSync('_site/tools/action-tracker/index.html') && 'run npm run build first' }, () => {
  const { openTool } = require('./helpers/tool-page.cjs');
  const rows = [
    { id: 'a1', title: 'Heavy-first loading sequence', source: 'cx-control-tower', status: 'open', caseId: 'INV-20261028-001', created: '2026-09-01' },
    { id: 'a2', title: 'Toolbox talk', source: 'manual', status: 'open', created: '2026-09-01' },
    { id: 'a3', title: 'Marked shelf zones', source: 'cx-control-tower', status: 'verified', result: 'Before … → After …', closed: '2026-09-20', caseId: 'INV-20261028-002', created: '2026-09-01' },
  ];
  const w = openTool('action-tracker', { storage: { 'sc-actions': JSON.stringify({ rows }) } });
  w.document.querySelector('[data-status="all"]').click();
  const item = (id) => w.document.querySelector(`.at-item[data-id="${id}"]`);
  assert.equal(item('a1').querySelector('.at-status option[value=verified]').disabled, true, 'a case action: verified is the case\'s');
  assert.equal(item('a2').querySelector('.at-status option[value=verified]').disabled, false, 'a plain action: by hand, with a result');
  assert.equal(item('a3').querySelector('.at-status select').disabled, true, 'a verified case action is reopened in the investigation');
  // Even a forced change is refused by the store and said on the page.
  const select = item('a1').querySelector('.at-status select');
  select.value = 'verified';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(w.ActionsStore.list().find((a) => a.id === 'a1').status, 'open');
});

test('3. a deleted investigation\'s id is not given to a new one while its actions still name it', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const first = t.stored().cases[0];
  assert.match(first.id, /-001$/);
  // Deleted (the tracker's action stays, as the page says).
  const row = [...t.body.querySelectorAll('tr')].find((tr) => tr.textContent.includes(first.id) && tr.querySelector('.cx-case-manage'));
  t.click([...row.querySelectorAll('button')].find((b) => b.textContent === 'Delete'));
  assert.equal(t.stored().cases.length, 0);
  assert.equal(t.S.forCase(first.id).length, 1, 'the orphan action keeps the old id');
  // A new investigation the same day: the next number, never the orphan's.
  startCase(t, 'late', 'Late deliveries');
  t.click(t.button('Save the investigation'));
  const second = t.stored().cases[0];
  assert.match(second.id, /-002$/);
  assert.notEqual(second.id, first.id);
  assert.deepEqual(plain(t.S.forCase(second.id)), [], 'the new case inherits no action');
  // The station's register row names the old investigation too, and a case id in it is taken as well.
  assert.ok(t.stored().tables.actions.rows.some((cells) => cells.some((v) => String(v).includes(first.id))));
  // With the orphan action removed too, nothing names the id any more and it may be used again.
  t.S.remove(t.S.forCase(first.id)[0].id);
  startCase(t, 'incomplete', 'Incomplete deliveries');
  t.click(t.button('Save the investigation'));
  assert.match(t.stored().cases[1].id, /-003$/, 'the register row still names 001, so 003');
});

test('4. the whys travel inside the browser: the tower leaves the problem for 5 Whys in a note, the address names the case alone', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Save the investigation'));
  const id = t.stored().cases[0].id;
  const link = [...t.body.querySelectorAll('a')].find((a) => a.textContent === 'Work the whys in 5 Whys');
  const url = new URL(link.href);
  assert.equal(url.pathname, '/tools/five-whys/');
  assert.deepEqual([...url.searchParams.keys()], ['case'], 'no problem text in the address');
  assert.equal(url.searchParams.get('case'), id);
  t.click(link);
  const note = JSON.parse(t.w.sessionStorage.getItem('sc-case-handoff'));
  assert.deepEqual([note.caseId, note.from, note.problem], [id, 'cx-control-tower', 'Damage on the evening wave: too many on the evening wave']);
  // Before the investigation is saved there is nothing for the whys to come back to: the link says so.
  t.click(t.button('New investigation'));
  const fresh = [...t.body.querySelectorAll('a')].find((a) => a.textContent === 'Work the whys in 5 Whys');
  assert.equal(fresh.getAttribute('aria-disabled'), 'true');
  t.click(fresh);
  assert.match(t.note(), /Save the investigation first/);
});

test('4b. 5 Whys reads the tower\'s note for its problem and leaves no text in the address', { skip: !fs.existsSync('_site/tools/five-whys/index.html') && 'run npm run build first' }, () => {
  const { openTool } = require('./helpers/tool-page.cjs');
  const w = openTool('five-whys', { search: '?case=INV-20261028-001', before: (win) => win.sessionStorage.setItem('sc-case-handoff', JSON.stringify({ caseId: 'INV-20261028-001', from: 'cx-control-tower', problem: 'Damage on the evening wave' })) });
  const form = w.document.querySelector('[data-worksheet]');
  assert.equal(form.elements.problem.value, 'Damage on the evening wave');
  assert.equal(form.elements.case.value, 'INV-20261028-001');
  assert.equal(w.sessionStorage.getItem('sc-case-handoff'), null, 'read once');
  assert.equal(w.location.search, '');
  // A note for another case is not this worksheet's problem.
  const other = openTool('five-whys', { search: '?case=INV-20261028-002', before: (win) => win.sessionStorage.setItem('sc-case-handoff', JSON.stringify({ caseId: 'INV-20261028-001', from: 'cx-control-tower', problem: 'Someone else\'s problem' })) });
  assert.equal(other.document.querySelector('[data-worksheet]').elements.problem.value, '');
  assert.equal(other.document.querySelector('[data-worksheet]').elements.case.value, 'INV-20261028-002');
});

test('5. the after window never shares a day with the before period, and the sample floor is the one saved with the evidence', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  assert.equal(t.stored().cases[0].snapshot.minN, 50);
  t.S.update(t.S.forCase(id)[0].id, { status: 'done' });
  t.tab('actions');
  t.tab('deep');
  // Inside the before period (which ends 13 Sep): no window, no verdict, and the reason named.
  t.setValue('#cx-verify-from', '2026-09-10');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'insufficient');
  assert.match(t.body.querySelector('[data-cx-verdict]').textContent, /must start after the before period ends/);
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /must start after the before period ends/);
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  t.setValue('#cx-verify-from', '2026-09-13');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'insufficient', 'the last day of the before period is still inside it');
  t.setValue('#cx-verify-from', '2026-09-14');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'effective');
  // The deep dive's floor changes afterwards: the verification keeps the floor of the evidence and says so.
  t.setValue('#cx-deep-min', '5000');
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'effective', 'still judged at the saved floor of 50');
  assert.match(t.body.querySelector('[data-cx-verify]').textContent, /sample floor 50.*now uses 5,000/);
  t.click(t.body.querySelector('[data-cx-close]'));
  const row = t.stored().cases[0];
  assert.equal(row.verification.minN, 50, 'the floor used is recorded with the decision');
  assert.ok(row.verification.after.from > row.verification.before.to);
  assert.match(row.verification.text, /sample floor 50/);
  // The register carries it, and a case imported from it keeps it.
  const C = t.w.CxTower;
  assert.equal(C.afterWindow('2026-09-13', '2026-09-26', '2026-09-13'), null);
  assert.deepEqual(plain(C.afterWindow('2026-09-14', '2026-09-26', '2026-09-13')), { from: '2026-09-14', to: '2026-09-26', days: 13 });
});

test('6. when the browser cannot save during a decision, the tower and the tracker stay in agreement', () => {
  // (a) the tracker cannot be saved: nothing changes anywhere.
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  done(t, id);
  assert.equal(t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict, 'effective');
  let restore = refusing(t.w, 'sc-actions');
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /Action Tracker could not be saved/);
  restore();
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  assert.ok(!t.stored().cases[0].verification, 'nothing decided');
  assert.equal(t.S.forCase(id)[0].status, 'done');
  // (b) the tower cannot be saved: the tracker's action goes back to done, the case stays pending.
  restore = refusing(t.w, 'sc-cx-tower');
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /investigation could not be saved/);
  restore();
  assert.equal(t.S.forCase(id)[0].status, 'done', 'the tracker was rolled back');
  assert.ok(!t.S.forCase(id)[0].result.includes('Verified effective'));
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  assert.ok(!t.stored().cases[0].verification, 'nothing decided');
  // (c) with the storage back, the same click decides, once, in both places.
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.equal(t.stored().cases[0].status, 'Verified effective');
  assert.equal(t.S.forCase(id)[0].status, 'verified');
  // The store never reports a save it did not make.
  const refuse = refusing(t.w, 'sc-actions');
  assert.equal(t.S.update(t.S.forCase(id)[0].id, { result: 'changed' }), null);
  assert.equal(t.S.lastUpdate, 'unsaved');
  refuse();
});
