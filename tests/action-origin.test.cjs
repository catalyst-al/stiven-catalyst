// Where in a log an action came from (origin, js/actions-store.js originOf; docs/DATA-FORMATS.md §1): the period as two
// ISO dates, the one filter that was on, or the one row. Kept only whole, written once, carried in the hand-off note and
// never in the address, and the same after a work file and a team sync. No tool sends one yet: this is the shape the
// tools will send, settled before any page changes (docs/plan-sot-2026-11-11/PLANI.md, step 1).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const HANDOFF_KEY = 'sc-action-handoff';

const load = (url = 'https://example.test/sq/tools/damage-control/', { more = [] } = {}) => {
  const dom = new JSDOM('<html lang="sq"><body></body></html>', { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real("2026-11-11T10:00:00Z"); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  w.confirm = () => true;
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', ...more]) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// What the tracker's tab holds when a hand-off link is followed in the same tab: the sender's note.
const follow = (from, href) => {
  const to = load(href.replace('https://example.test/sq/tools/damage-control/../', 'https://example.test/sq/tools/'));
  to.sessionStorage.setItem(HANDOFF_KEY, from.sessionStorage.getItem(HANDOFF_KEY));
  return to;
};

const PERIOD = { v: 1, tool: 'damage-control', lang: 'sq', kind: 'period', from: '2026-11-05', to: '2026-11-11' };
const FILTER = { ...PERIOD, kind: 'filter', filter: { field: 'cause', value: 'Stivimi' } };
const ROW = { ...PERIOD, kind: 'row', row: { id: '', date: '2026-11-11', shift: 'Pasdite', stage: 'Ngarkimi', cause: 'Stivimi', units: 3, twins: 2 } };
const action = (origin, extra = {}) => ({ title: 'Kundërmasë për stivimin', source: 'damage-control', origin, ...extra });

test('the three kinds are kept whole, each with only the fields of its kind', () => {
  const { ActionsStore } = load();
  assert.deepEqual(plain(ActionsStore.clean(action(PERIOD)).origin), PERIOD);
  assert.deepEqual(plain(ActionsStore.clean(action(FILTER)).origin), FILTER);
  assert.deepEqual(plain(ActionsStore.clean(action(ROW)).origin), ROW);
  // What does not belong to the kind is left out; text is trimmed and bounded; twins is 1 when not given.
  const noisy = plain(ActionsStore.clean(action({ ...PERIOD, filter: FILTER.filter, row: ROW.row, extra: 'x' })).origin);
  assert.deepEqual(noisy, PERIOD);
  const long = plain(ActionsStore.clean(action({ ...FILTER, filter: { field: 'stage', value: `  ${'N'.repeat(300)}  ` } })).origin);
  assert.equal(long.filter.value.length, 120);
  const { twins, ...rowWithout } = ROW.row;
  assert.equal(plain(ActionsStore.clean(action({ ...ROW, row: rowWithout })).origin).row.twins, 1);
  assert.equal(twins, 2);
});

test('an action without an origin has the shape it always had', () => {
  const { ActionsStore } = load();
  const a = plain(ActionsStore.clean({ title: 'Mark the floor', source: 'five-s-audit', owner: 'Besnik' }));
  assert.ok(!('origin' in a) && !('ref' in a));
  assert.deepEqual(Object.keys(a).sort(), ['area', 'check', 'closed', 'created', 'detail', 'due', 'id', 'owner', 'priority', 'result', 'source', 'status', 'title']);
});

test('a damaged origin is dropped and the action stays', () => {
  const { ActionsStore } = load();
  const damaged = {
    'another version': { ...PERIOD, v: 2 },
    'no version': { ...PERIOD, v: undefined },
    'a date that is not ISO': { ...PERIOD, from: '05.11.2026' },
    'no end': { ...PERIOD, to: '' },
    'the period backwards': { ...PERIOD, from: '2026-11-12' },
    'an unknown kind': { ...PERIOD, kind: 'week' },
    'an unknown language': { ...PERIOD, lang: 'it' },
    'a tool that is no slug': { ...PERIOD, tool: 'Damage Control' },
    'a filter without its value': { ...FILTER, filter: { field: 'cause', value: ' ' } },
    'a filter on a field no log filters by': { ...FILTER, filter: { field: 'note', value: 'x' } },
    'a filter kind without the filter': { ...PERIOD, kind: 'filter' },
    'a row without its date': { ...ROW, row: { ...ROW.row, date: '' } },
    'a row without whole units': { ...ROW, row: { ...ROW.row, units: 1.5 } },
    'a row kind without the row': { ...PERIOD, kind: 'row' },
    'a list': [PERIOD],
    'a word': 'damage-control',
  };
  for (const [what, origin] of Object.entries(damaged)) {
    const a = ActionsStore.clean(action(origin));
    assert.ok(a && a.title, `${what}: the action stays`);
    assert.ok(!('origin' in a), `${what}: the origin is dropped`);
  }
  // The origin is of the tool the action came from.
  assert.ok(!('origin' in ActionsStore.clean(action(PERIOD, { source: 'incomplete-control' }))), 'another tool\'s origin is not kept');
  assert.ok(!('origin' in ActionsStore.clean(action(PERIOD, { source: '' }))), 'an action without a source keeps none');
});

test('the origin travels in the hand-off note, from ToolKit and from the store, and never in the address', () => {
  for (const origin of [PERIOD, FILTER, ROW]) {
    for (const make of [(w) => w.ToolKit.trackerUrl(action(origin)), (w) => w.ActionsStore.link(action(origin))]) {
      const tool = load();
      const href = make(tool);
      const url = new tool.URL(href);
      assert.match(url.hash, /^#handoff=[a-z0-9]{16}$/, 'only a token in the fragment');
      assert.equal(url.search, '');
      for (const word of ['Stivimi', 'Ngarkimi', '2026-11-05', 'origin', 'damage-control/#']) assert.ok(!decodeURIComponent(href).includes(word), `${word} is not in the address`);
      const tracker = follow(tool, href);
      const arrived = tracker.ActionsStore.fromParams(tracker.location);
      assert.ok(arrived.added, `${origin.kind}: the action arrived`);
      assert.deepEqual(plain(arrived.added.origin), origin);
      assert.deepEqual(plain(tracker.ActionsStore.list()[0].origin), origin, 'and is on the list as it was sent');
      assert.equal(tracker.location.hash, '');
    }
  }
});

test('a damaged origin in the note costs the origin, not the action', () => {
  const tool = load();
  const href = tool.ToolKit.trackerUrl(action({ ...FILTER, from: 'last week' }));
  const tracker = follow(tool, href);
  const arrived = tracker.ActionsStore.fromParams(tracker.location);
  assert.equal(arrived.added.title, 'Kundërmasë për stivimin');
  assert.ok(!('origin' in arrived.added));
});

test('a link of the older shape carries no origin, whatever its address says', () => {
  const tracker = load(`https://example.test/sq/tools/action-tracker/?action=Old%20link&source=damage-control&origin=${encodeURIComponent(JSON.stringify(PERIOD))}`);
  const arrived = tracker.ActionsStore.fromParams(tracker.location);
  assert.equal(arrived.added.title, 'Old link');
  assert.ok(!('origin' in arrived.added));
});

test('the origin is written once: an update keeps it, whatever the patch says', () => {
  const { ActionsStore } = load();
  const a = ActionsStore.add(action(FILTER));
  const done = ActionsStore.update(a.id, { status: 'done', owner: 'Ana', origin: { ...PERIOD, from: '2026-01-01' } });
  assert.equal(done.status, 'done');
  assert.deepEqual(plain(done.origin), FILTER);
  const cleared = ActionsStore.update(a.id, { origin: null, result: '10 → 4', status: 'verified' });
  assert.deepEqual(plain(cleared.origin), FILTER);
  // An action made without one does not get one later.
  const b = ActionsStore.add({ title: 'Without origin', source: 'damage-control' });
  assert.ok(!('origin' in ActionsStore.update(b.id, { origin: PERIOD })));
});

test('a row with an id names the action; a row without one leaves the rule without a ref', () => {
  const { ActionsStore } = load();
  const withId = { ...ROW, row: { ...ROW.row, id: 'r-8f3k2' } };
  const first = ActionsStore.add(action(withId, { title: 'Row with id' }));
  assert.equal(first.ref, 'r-8f3k2');
  assert.equal(ActionsStore.add(action(withId, { title: 'The same row, other words' })), null);
  assert.equal(ActionsStore.lastAdd, 'duplicate');
  // Still the same action once it is done: the row was dealt with.
  ActionsStore.update(first.id, { status: 'done' });
  assert.equal(ActionsStore.add(action(withId, { title: 'The same row again' })), null);
  // Another row is another action, with the same words.
  assert.ok(ActionsStore.add(action({ ...ROW, row: { ...ROW.row, id: 'r-11aa9' } }, { title: 'Row with id' })));
  // Without an id: no ref, and the same open title from the same tool is the duplicate, as for any action.
  const old = ActionsStore.add(action(ROW, { title: 'Old row' }));
  assert.ok(!('ref' in old));
  assert.equal(ActionsStore.add(action(ROW, { title: 'Old row' })), null);
  assert.ok(ActionsStore.add(action(ROW, { title: 'Old row, second action' })), 'other words are another action: the row cannot be told from its twins');
  // A ref the tool gives itself is kept over the row's id.
  assert.equal(ActionsStore.clean(action(withId, { ref: 'own-ref' })).ref, 'own-ref');
});

test('the origin is the same after a work file and after a team sync', () => {
  const w = load('https://example.test/sq/tools/damage-control/', { more: ['storage-guard', 'work-backup', 'team-sync'] });
  const S = w.ActionsStore;
  const made = [S.add(action(PERIOD, { title: 'A' })), S.add(action(FILTER, { title: 'B' })), S.add(action(ROW, { title: 'C' }))];
  // The work file: written, read back, opened in another browser.
  const file = w.WorkBackup.readBackup(JSON.stringify(w.WorkBackup.makeBackup(w.localStorage)));
  assert.ok(file, 'the work file is sound');
  const other = load('https://example.test/sq/tools/action-tracker/', { more: ['storage-guard', 'work-backup', 'team-sync'] });
  other.localStorage.setItem('sc-actions', file.items['sc-actions']);
  assert.deepEqual(plain(other.ActionsStore.list().map((a) => a.origin)), [PERIOD, FILTER, ROW]);
  // Team sync: this device closed one action, the other added one; every origin is as it was made.
  other.ActionsStore.add(action({ ...FILTER, filter: { field: 'shift', value: 'Natë' } }, { title: 'D' }));
  S.update(made[1].id, { status: 'done' });
  const M = w.TeamSyncMath;
  const local = { 'sc-actions': w.localStorage.getItem('sc-actions') };
  const remote = { 'sc-actions': other.localStorage.getItem('sc-actions') };
  const merged = JSON.parse(M.merge(local, remote, M.baseOf({ 'sc-actions': file.items['sc-actions'] }), {})['sc-actions']).rows.map((row) => S.clean(row));
  assert.deepEqual(merged.map((a) => a.title).sort(), ['A', 'B', 'C', 'D']);
  assert.equal(merged.find((a) => a.title === 'B').status, 'done');
  assert.deepEqual(plain(merged.find((a) => a.title === 'B').origin), FILTER);
  assert.deepEqual(plain(merged.find((a) => a.title === 'C').origin), ROW);
  assert.equal(merged.find((a) => a.title === 'D').origin.filter.value, 'Natë');
});
