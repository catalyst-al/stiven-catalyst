// The one action list every tool shares (sc-actions, js/actions-store.js), followed through the real pages: its
// example never becomes the visitor's actions (audit finding T-03), a hand-off is not added twice, and a tool says
// "added" only when the action was saved (T-19).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, click, submit, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const own = (storage) => (storage['sc-actions']?.rows ?? []).filter((row) => !row.example);

// A Kaizen Board idea of the visitor's own, moved on to "plan", from its real form and its real buttons.
const kaizenPlan = async (storage = {}) => {
  const w = openTool('kaizen-board', { storage, now: NOW });
  const form = w.document.querySelector('[data-entry]');
  form.elements.title.value = 'Second scanner at the outbound dock';
  form.elements.owner.value = 'Mira';
  submit(w, form);
  await settle(w);
  for (let i = 0; i < 3 && !w.document.querySelector('[data-action="action"]'); i++) {
    click(w, w.document.querySelector('.kb-card [data-action="forward"]'));
    await settle(w);
  }
  assert.ok(w.document.querySelector('[data-action="action"]'), 'the idea reached "plan"');
  return w;
};
const sendFromKaizen = (w) => {
  click(w, w.document.querySelector('[data-action="action"]'));
  return w.document.querySelector('[data-status]').textContent;
};

test('the Action Tracker example is replaced, not joined, by an action another tool hands over', async () => {
  const tracker = openTool('action-tracker', { now: NOW });
  assert.ok(!tracker.document.querySelector('.dl-example-note').hidden, 'a first visit shows the example');
  let storage = keep(tracker);
  assert.ok((storage['sc-actions']?.rows ?? []).length >= 10, 'the example is in the shared list');
  const kaizen = await kaizenPlan(storage);
  sendFromKaizen(kaizen);
  storage = keep(kaizen);
  assert.equal(storage['sc-actions'].rows.length, 1, `only the handed-over action is on the list (${storage['sc-actions'].rows.length})`);
  assert.equal(storage['sc-actions'].rows[0].source, 'kaizen-board');
  const again = openTool('action-tracker', { storage, now: NOW });
  assert.ok(again.document.querySelector('.dl-example-note').hidden, 'no example note');
  assert.equal(again.document.querySelectorAll('[data-list] > *').length, 1);
});

test('a list mixed by the old code (example ids remembered, an own action added) is told apart again', async () => {
  // The code before phase 1 (tests/fixtures/pre-phase1, frozen copies of 605d0df: a shallow clone has no history).
  const oldTracker = fs.readFileSync('tests/fixtures/pre-phase1/action-tracker.js', 'utf8');
  const oldStore = fs.readFileSync('tests/fixtures/pre-phase1/actions-store.js', 'utf8');
  const old = openTool('action-tracker', { now: NOW, code: { 'action-tracker': oldTracker, 'actions-store': oldStore } });
  old.ActionsStore.add({ title: 'Fix the dock door sensor', source: 'manual', owner: 'Ana' });
  const storage = keep(old);
  assert.ok(storage['sc-actions'].rows.length > 10, 'the old code mixed them');
  const reader = openTool('ops-report', { storage, now: NOW });
  assert.deepEqual(JSON.parse(JSON.stringify(reader.ActionsStore.list().map((a) => a.title))), ['Fix the dock door sensor'], 'the readers see only the own action');
  const tracker = openTool('action-tracker', { storage, now: NOW });
  await settle(tracker);
  assert.deepEqual(own(keep(tracker)).map((a) => a.title), ['Fix the dock door sensor']);
});

test('a hand-off is added once: twice in a row, or again after a reload, gives one action', async () => {
  const w = await kaizenPlan();
  sendFromKaizen(w);
  const second = sendFromKaizen(w);
  let storage = keep(w);
  assert.equal(own(storage).length, 1, 'clicked twice, one action');
  assert.match(second, /Already on the list/);
  const reloaded = openTool('kaizen-board', { storage, now: NOW });
  sendFromKaizen(reloaded);
  storage = keep(reloaded);
  assert.equal(own(storage).length, 1, 'after a reload, still one');
});

test('when the browser cannot save, the tool does not say the action was added', async () => {
  const w = await kaizenPlan();
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (key, value) {
    if (key === 'sc-actions') throw new w.DOMException('full', 'QuotaExceededError');
    return real.call(this, key, value);
  };
  const said = sendFromKaizen(w);
  assert.doesNotMatch(said, /Added to the actions/, `the page said: ${said}`);
  assert.equal(w.localStorage.getItem('sc-actions'), null, 'nothing was saved');
});

// A tool that still shows its example can hand the example's actions over, so the visitor sees how it works; they
// arrive as example actions, never as the visitor's (the tools that read the list do not count them), and the first
// own action replaces them.
test('actions handed over from a tool\'s example arrive as example actions, never as the visitor\'s', async () => {
  const cross = openTool('safety-cross', { now: NOW });
  const send = [...cross.document.querySelectorAll('[data-results] button')].find((b) => /Action Tracker/.test(b.textContent));
  assert.ok(send, 'the example offers the hand-off');
  click(cross, send);
  let storage = keep(cross);
  const rows = storage['sc-actions']?.rows ?? [];
  assert.equal(own(storage).length, 0, `no example action counts as the visitor's (${rows.length} stored)`);
  const kaizen = await kaizenPlan(storage);
  sendFromKaizen(kaizen);
  storage = keep(kaizen);
  assert.deepEqual(storage['sc-actions'].rows.map((row) => row.source), ['kaizen-board'], 'the first own action replaces them');
});
