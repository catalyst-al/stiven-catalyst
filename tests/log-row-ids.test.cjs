// A row's id in the three logs of js/defect-log.js (Damage Control, Incomplete Control, the Night Audit Log), through
// the real pages. No page gives a row an id yet. What is settled first is that a page which meets one keeps it: a row
// written with an id by a later version, on another device of the team, must not be stripped of it here, or team sync
// would read the missing id as a deletion and the row would lose its id on every device (docs/DATA-FORMATS.md §1;
// docs/plan-sot-2026-11-11/PLANI.md, step 1).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const { openTool, keep, click, submit, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-11-11T11:00:00Z';
const LOGS = [['damage-control', 'sc-damage-control'], ['incomplete-control', 'sc-incomplete-control'], ['night-audit', 'sc-night-audit']];
const row = (extra = {}) => ({ date: '2026-11-10', shift: 'Late', stage: 'Loading', type: 'Crushed', cause: 'Stacking', units: 2, cost: null, note: '', ...extra });
const addEntry = async (w) => {
  const form = w.document.querySelector('[data-entry]');
  form.elements.units.value = '1';
  submit(w, form);
  await settle(w);
};
const paste = (w, text) => {
  w.document.querySelector('#dl-paste').value = text;
  click(w, w.document.querySelector('[data-import]'));
  return w.document.querySelector('[data-import-status]').textContent;
};

for (const [slug, key] of LOGS) {
  test(`${slug}: a row that has an id keeps it through a visit, last on the row; a row without one gets none`, async () => {
    const stored = { rows: [row({ id: 'r-8f3k2' }), row({ stage: 'Picking' })] };
    const w = openTool(slug, { storage: { [key]: stored }, now: NOW });
    await settle(w);
    await addEntry(w);
    const rows = keep(w)[key].rows;
    assert.equal(rows.length, 3, 'the two rows and the new entry');
    assert.equal(rows[0].id, 'r-8f3k2');
    assert.equal(Object.keys(rows[0]).at(-1), 'id', 'after the fields the page writes');
    assert.ok(!('id' in rows[1]), 'the row without an id is not given one');
    assert.ok(!('id' in rows[2]), 'the page gives a new entry no id yet');
    // And again after a reload.
    const again = openTool(slug, { storage: keep(w), now: NOW });
    await settle(again);
    await addEntry(again);
    assert.deepEqual(keep(again)[key].rows.map((r) => r.id || ''), ['r-8f3k2', '', '', '']);
  });
}

test('an id that is not one is dropped, and the row stays', async () => {
  const bad = [{ a: 1 }, 42, '', 'has space', 'x'.repeat(41), 'semi;colon', null];
  const stored = { rows: bad.map((id, i) => row({ id, note: `row ${i}` })) };
  const w = openTool('damage-control', { storage: { 'sc-damage-control': stored }, now: NOW });
  await settle(w);
  await addEntry(w);
  const rows = keep(w)['sc-damage-control'].rows;
  assert.equal(rows.length, bad.length + 1);
  rows.forEach((r, i) => assert.ok(!('id' in r), `row ${i}`));
});

test('a pasted row is the row already in the log when only the id sets them apart', async () => {
  const stored = { rows: [row({ id: 'r-8f3k2', units: 3 }), row({ id: 'r-11aa9', stage: 'Picking', type: 'Torn or punctured', cause: 'Handling', cost: 4.5, note: 'dock 2' })] };
  const w = openTool('damage-control', { storage: { 'sc-damage-control': stored }, now: NOW });
  await settle(w);
  const same = ['2026-11-10\tLate\tLoading\tCrushed\tStacking\t3\t\t', '2026-11-10\tLate\tPicking\tTorn\tHandling\t2\t4.5\tdock 2'].join('\n');
  assert.match(paste(w, same), /already in the log/i);
  await settle(w);
  assert.equal(keep(w)['sc-damage-control'].rows.length, 2);
  // Another row is still added, and the rows that were there keep their ids.
  paste(w, '2026-11-11\tEarly\tPacking\tWet\tPackaging\t1\t\t');
  await settle(w);
  assert.deepEqual(keep(w)['sc-damage-control'].rows.map((r) => r.id || ''), ['r-8f3k2', 'r-11aa9', '']);
});

test('team sync: a device that keeps the id has the row as the team has it; a copy stripped of it would cost every device the id', () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools.html', runScripts: 'outside-only' });
  const w = dom.window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const M = w.TeamSyncMath;
  const KEY = 'sc-damage-control';
  const team = { [KEY]: JSON.stringify({ rows: [row({ id: 'r-8f3k2' })] }) };
  const base = M.baseOf(team);
  const rowsOf = (items) => JSON.parse(items[KEY]).rows;
  // As this page keeps it: the same row, nothing to merge.
  assert.equal(rowsOf(M.merge({ ...team }, team, base, {})).length, 1);
  assert.deepEqual(Object.keys(M.deletedHere({ ...team }, base, 1)), [], 'and nothing is taken for deleted');
  // As a page that rebuilt the row without its id would have saved it: the id is gone from this device, which team
  // sync reads as the row deleted here. The row itself comes through as a row without an id, and the id is dead.
  const { id, ...stripped } = row({ id: 'r-8f3k2' });
  const local = { [KEY]: JSON.stringify({ rows: [stripped] }) };
  const dead = M.deletedHere(local, base, 1);
  assert.deepEqual(Object.keys(dead[KEY] || {}), [id], 'the id is marked deleted for the team');
  const merged = rowsOf(M.merge(local, team, base, dead));
  assert.equal(merged.length, 1);
  assert.ok(!('id' in merged[0]), 'which is why the id is kept before any page writes one');
});

// The logs have no way to edit a row: a row is added, pasted, removed (with an undo) or cleared with the whole log.
// What else writes the log is a setting of the page, saved with the rows as they are.
test('removing a row and undoing it puts the same row back, id and all, and the others keep theirs', async () => {
  const stored = { rows: [row({ id: 'r-1' }), row({ id: 'r-2', stage: 'Picking' }), row({ stage: 'Packing' })] };
  const w = openTool('damage-control', { storage: { 'sc-damage-control': stored }, now: NOW });
  await settle(w);
  const ids = () => keep(w)['sc-damage-control'].rows.map((r) => r.id || '');
  const target = [...w.document.querySelectorAll('[data-remove]')].find((button) => keep(w)['sc-damage-control'].rows[Number(button.dataset.remove)].id === 'r-1');
  click(w, target);
  await settle(w);
  assert.deepEqual(ids(), ['r-2', '']);
  click(w, w.document.querySelector('[data-log-status] .dl-undo'));
  await settle(w);
  assert.deepEqual(ids(), ['r-1', 'r-2', ''], 'back in its place');
  assert.deepEqual(keep(w)['sc-damage-control'].rows[0], stored.rows[0], 'the very row');
});

test('a setting of the log changed and saved leaves every row as it was', async () => {
  const stored = { rows: [row({ id: 'r-1' }), row({ stage: 'Picking' })] };
  const w = openTool('damage-control', { storage: { 'sc-damage-control': stored }, now: NOW });
  await settle(w);
  const volume = w.document.querySelector('[data-defect-log] [name="volume"]');
  volume.value = '4000';
  volume.dispatchEvent(new w.Event('input', { bubbles: true }));
  await settle(w, 400);
  const saved = keep(w)['sc-damage-control'];
  assert.equal(String(saved.volume), '4000', 'the setting was saved');
  assert.deepEqual(saved.rows, stored.rows);
});

test('the work file carries the id: saved here, opened in another browser, kept through a visit there', async () => {
  const stored = { rows: [row({ id: 'r-1' }), row({ stage: 'Picking' })] };
  const first = openTool('damage-control', { storage: { 'sc-damage-control': stored }, now: NOW });
  await settle(first);
  await addEntry(first);
  // The file as work-backup.js writes and reads it.
  const box = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools.html', runScripts: 'outside-only' }).window;
  for (const [key, value] of Object.entries(keep(first))) box.localStorage.setItem(key, JSON.stringify(value));
  for (const file of ['storage-guard', 'work-backup']) box.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const file = box.WorkBackup.readBackup(JSON.stringify(box.WorkBackup.makeBackup(box.localStorage)));
  assert.ok(file, 'the file is sound');
  const second = openTool('damage-control', { storage: { 'sc-damage-control': JSON.parse(file.items['sc-damage-control']) }, now: NOW });
  await settle(second);
  await addEntry(second);
  assert.deepEqual(keep(second)['sc-damage-control'].rows.map((r) => r.id || ''), ['r-1', '', '', ''], 'the id is there, and no row was given one');
});
