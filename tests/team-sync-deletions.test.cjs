// Team sync and deletions (src/js/team-sync.js): a row deleted on one device is deleted on every device of the team,
// through tombstones (the storage key, the row id and when it was deleted) in the team's copy, kept 90 days. The rows
// are written by the tools' own code: the Action Tracker's store (actions-store.js) and the Lost & Found page
// (lost-found.js, rendered from its partial), on two simulated devices against a fake of the sync server.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const DAY = 24 * 60 * 60 * 1000;

const give = (w) => {
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  w.CompressionStream = CompressionStream;
  w.DecompressionStream = DecompressionStream;
};
// A fixed clock for the page (the tools date their rows with it), moved on by the tests.
const clock = (w, iso) => {
  w.eval(`(() => { const Real = Date; window.__now = new Real(${JSON.stringify(iso)}).getTime(); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [window.__now])); } static now() { return window.__now; } }; })();`);
};
const later = (w, ms) => { w.__now += ms; };
const syncScripts = ['storage-guard', 'work-backup', 'team-sync'];
const blank = ({ storage = {}, scripts = [], now = '2026-10-27T09:00:00Z' } = {}) => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://stivencatalyst.com/tools/action-tracker/', runScripts: 'outside-only' });
  const w = dom.window;
  give(w);
  clock(w, now);
  w.confirm = () => true;
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  for (const file of [...scripts, ...syncScripts]) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

// ---- A fake of the sync server (the API of workers/sync/worker.js) ----
const fakeServer = () => {
  const spaces = new Map();
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  let updated = 1_000_000;
  const fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    const match = /\/v1\/spaces\/([0-9a-f]{64})$/.exec(url);
    if (!match) return reply(404, { error: 'not-found' });
    const meta = spaces.get(match[1]);
    if (method === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    const token = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
    if (!token) return reply(401, { error: 'token' });
    if (meta && meta.token !== token) return reply(403, { error: 'token' });
    if (method === 'DELETE') { spaces.delete(match[1]); return reply(204); }
    const body = JSON.parse(init.body);
    const rev = meta ? meta.rev : 0;
    if (body.rev !== rev) return reply(409, { rev });
    updated += 5000;
    spaces.set(match[1], { rev: rev + 1, updated, iv: body.iv, data: body.data, token });
    return reply(200, { rev: rev + 1, updated });
  };
  return { spaces, fetch };
};
const device = async (w) => ({ w, keys: await w.TeamSyncMath.deriveKeys(CODE, 1000) });
const sync = (dev, server, extra = {}) => dev.w.TeamSync.syncOnce({
  endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys,
  selected: (key) => dev.w.TeamSyncMath.isOn(dev.w.WorkBackup.toolSlug(key)), create: true, wait: async () => {}, ...extra,
});
const teamCopy = async (server, dev) => plain(await dev.w.TeamSyncMath.unseal(server.spaces.get(dev.keys.spaceId), dev.keys.key));
const rowsOf = (text) => JSON.parse(text).rows.map((row) => row.id);
const actionIds = (w) => plain(w.ActionsStore.list().map((row) => row.id));

test('TeamSyncMath.merge: a row deleted here since the last sync stays deleted (the audit\'s case)', () => {
  const w = blank();
  const M = w.TeamSyncMath;
  const team = JSON.stringify({ rows: [{ id: 'r1', title: 'keep', updated: 1 }, { id: 'r2', title: 'to delete', updated: 1 }] });
  const local = { 'sc-actions': JSON.stringify({ rows: [{ id: 'r1', title: 'keep', updated: 1 }] }) };
  const merged = M.merge(local, { 'sc-actions': team }, M.baseOf({ 'sc-actions': team }));
  assert.deepEqual(rowsOf(merged['sc-actions']), ['r1']);
  // What this device deleted, as tombstones: the key, the id and when.
  assert.deepEqual(plain(M.deletedHere(local, M.baseOf({ 'sc-actions': team }), 1_700_000_000_000)), { 'sc-actions': { r2: 1_700_000_000_000 } });
  // A tombstone from the team takes the row out of this device too, whatever this device holds.
  const here = { 'sc-actions': team };
  assert.deepEqual(rowsOf(M.merge(here, { 'sc-actions': local['sc-actions'] }, {}, { 'sc-actions': { r2: 1 } })['sc-actions']), ['r1']);
  // The team deleted a row this device has not changed since the last sync: it goes here as well, even without a
  // tombstone (one older than 90 days is gone).
  assert.deepEqual(rowsOf(M.merge(here, { 'sc-actions': local['sc-actions'] }, M.baseOf(here))['sc-actions']), ['r1']);
  // Old team data without tombstones and without a last sync still merges as before: rows of both sides, nothing lost.
  assert.deepEqual(rowsOf(M.merge(local, { 'sc-actions': team })['sc-actions']), ['r1', 'r2']);
});

test('tombstones: joined, newest time per row, read only in a sound shape, gone after 90 days', () => {
  const M = blank().TeamSyncMath;
  assert.equal(M.TOMBSTONE_DAYS, 90);
  const now = Date.parse('2026-10-27T09:00:00Z');
  const joined = M.joinDeleted({ 'sc-actions': { a: now - 5 * DAY, b: now - 91 * DAY } }, { 'sc-actions': { a: now - DAY }, 'sc-lost-found': { x: now } });
  assert.deepEqual(plain(joined), { 'sc-actions': { a: now - DAY, b: now - 91 * DAY }, 'sc-lost-found': { x: now } });
  assert.deepEqual(plain(M.purgeDeleted(joined, now)), { 'sc-actions': { a: now - DAY }, 'sc-lost-found': { x: now } });
  // From a team copy: only keys that may be shared, string ids, times as numbers; anything else is left out.
  const read = M.readPayload({ format: M.FORMAT, version: 2, items: {}, deleted: { 'sc-actions': { a: 5, b: 'x', ['c'.repeat(300)]: 1 }, 'sc-cv-builder': { a: 1 }, 'sc-team': { a: 1 }, 'sc-pareto': [] } });
  assert.deepEqual(plain(read.deleted), { 'sc-actions': { a: 5 } });
  assert.deepEqual(plain(M.readPayload({ format: M.FORMAT, version: 1, items: {} }).deleted), {}, 'a copy from before tombstones has none');
});

test('Action Tracker: deleted on one device, synced, the action is gone on both and stays gone', async () => {
  const server = fakeServer();
  const a = await device(blank({ scripts: ['actions-store'] }));
  const b = await device(blank({ scripts: ['actions-store'] }));
  const fix = a.w.ActionsStore.add({ title: 'Fix dock door', owner: 'Maintenance' });
  const guest = a.w.ActionsStore.add({ title: 'Call back Mrs Weber, +49 170 1234567, about her lost ring', owner: 'Front office' });
  assert.equal((await sync(a, server)).status, 'synced');
  assert.equal((await sync(b, server)).status, 'synced');
  assert.deepEqual(actionIds(b.w), [fix.id, guest.id]);
  // A deletes the action with the guest's phone number in it.
  later(a.w, 60_000);
  a.w.ActionsStore.remove(guest.id);
  assert.equal((await sync(a, server)).status, 'synced');
  const copy = await teamCopy(server, a);
  assert.deepEqual(rowsOf(copy.items['sc-actions']), [fix.id], 'not in the team copy');
  assert.ok(!JSON.stringify(copy).includes('Weber'), 'nothing of it in the team copy');
  assert.equal(copy.deleted['sc-actions'][guest.id], a.w.Date.now(), 'a tombstone with the time it was seen deleted');
  const second = await sync(b, server);
  assert.deepEqual(plain(second.changed), ['sc-actions']);
  assert.deepEqual(actionIds(b.w), [fix.id], 'gone on the other device');
  // Both sync again, twice: it never comes back.
  for (let i = 0; i < 2; i++) {
    await sync(a, server);
    await sync(b, server);
  }
  assert.deepEqual(actionIds(a.w), [fix.id]);
  assert.deepEqual(actionIds(b.w), [fix.id]);
});

test('Action Tracker: an edit on one device and a delete on the other at the same time: the delete wins, in either order', async () => {
  for (const order of ['edit-first', 'delete-first']) {
    const server = fakeServer();
    const a = await device(blank({ scripts: ['actions-store'] }));
    const b = await device(blank({ scripts: ['actions-store'] }));
    const action = a.w.ActionsStore.add({ title: 'Replace the cracked tile at the pool' });
    await sync(a, server);
    await sync(b, server);
    // Neither has heard of the other's change.
    b.w.ActionsStore.update(action.id, { status: 'doing', owner: 'Ana' });
    a.w.ActionsStore.remove(action.id);
    const steps = order === 'edit-first' ? [b, a, b] : [a, b, a];
    for (const dev of steps) assert.equal((await sync(dev, server)).status, 'synced', order);
    assert.deepEqual(actionIds(a.w), [], order);
    assert.deepEqual(actionIds(b.w), [], `${order}: the edit does not bring the row back`);
    assert.deepEqual(rowsOf((await teamCopy(server, a)).items['sc-actions']), [], order);
  }
});

// ---- Lost & Found, its own page ----
const lfData = JSON.parse(fs.readFileSync('src/_data/lostFound.json', 'utf8'));
const lfPage = () => {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => text);
  env.addFilter('local', (url) => url);
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  return env.render('partials/lost-found.njk', { cfg: lfData }).replace(/<script src=[^>]*><\/script>/g, '');
};
const lostFound = (storage) => {
  const dom = new JSDOM(`<html lang="en"><body>${lfPage()}</body></html>`, { url: 'https://stivencatalyst.com/tools/lost-found/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  give(w);
  clock(w, '2026-10-27T09:00:00Z');
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [key, value] of Object.entries(storage || {})) w.localStorage.setItem(key, value);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'media-store', 'floor-capture', 'lost-found', ...syncScripts]) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const addItem = (w, what, guest) => {
  const form = w.document.querySelector('[data-entry]');
  form.elements.category.value = 'jewellery';
  form.elements.category.dispatchEvent(new w.Event('change'));
  form.elements.what.value = what;
  form.elements.guest.value = guest;
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
};
const register = (w) => JSON.parse(w.localStorage.getItem('sc-lost-found')).rows;

test('Lost & Found: a guest\'s item deleted in the register on one device is deleted on the other after a sync', async () => {
  const server = fakeServer();
  const aw = lostFound({ 'sc-lost-found': JSON.stringify({ rows: [] }) });
  addItem(aw, 'Gold ring with a red stone', 'Mrs K. Weber, +49 170 1234567');
  addItem(aw, 'Black umbrella', '');
  const [ring, umbrella] = register(aw);
  assert.equal(ring.guest, 'Mrs K. Weber, +49 170 1234567');
  const a = await device(aw);
  assert.equal((await sync(a, server)).status, 'synced');
  // The second device opens the page with the team's register.
  const bw0 = blank();
  const b0 = await device(bw0);
  await sync(b0, server);
  const bw = lostFound({ 'sc-lost-found': bw0.localStorage.getItem('sc-lost-found'), 'sc-team-state': bw0.localStorage.getItem('sc-team-state') });
  const b = await device(bw);
  assert.deepEqual(register(bw).map((row) => row.id), [ring.id, umbrella.id]);
  // The guest's ring is removed in the register of the first device (the × of its row).
  aw.document.querySelector(`[data-log] [aria-label="Remove ${ring.id}"]`).click();
  flush(aw);
  assert.deepEqual(register(aw).map((row) => row.id), [umbrella.id]);
  await sync(a, server);
  assert.ok(!JSON.stringify(await teamCopy(server, a)).includes('Weber'), 'the guest\'s name and phone are out of the team copy');
  await sync(b, server);
  assert.deepEqual(register(bw).map((row) => row.id), [umbrella.id], 'and out of the other device');
  assert.ok(!bw.localStorage.getItem('sc-lost-found').includes('Weber'));
  // The other device keeps working and syncs again: the ring does not come back anywhere.
  addItem(bw, 'Blue scarf', '');
  await sync(b, server);
  await sync(a, server);
  assert.deepEqual(register(aw).map((row) => row.what).sort(), ['Black umbrella', 'Blue scarf']);
  assert.deepEqual(register(bw).map((row) => row.what).sort(), ['Black umbrella', 'Blue scarf']);
});

test('a copy written before tombstones (version 1) is read and merged, and the next upload adds them', async () => {
  const server = fakeServer();
  const a = await device(blank({ storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Mine' }] } } }));
  const old = { format: 'stiven-catalyst-team', version: 1, sent: '2026-10-01T08:00:00.000Z', device: { id: 'old00001', name: '' }, devices: [], items: { 'sc-actions': JSON.stringify({ rows: [{ id: 't1', title: 'Team' }] }) } };
  server.spaces.set(a.keys.spaceId, { rev: 4, updated: 1, token: a.keys.writeToken, ...(await a.w.TeamSyncMath.seal(old, a.keys.key)) });
  const result = await sync(a, server);
  assert.equal(result.status, 'synced');
  assert.deepEqual(rowsOf(a.w.localStorage.getItem('sc-actions')), ['a1', 't1']);
  const copy = await teamCopy(server, a);
  assert.equal(copy.version, 2);
  assert.deepEqual(copy.deleted, {});
});

test('tombstones older than 90 days leave the team copy; a device away that long still drops a row it never changed', async () => {
  const server = fakeServer();
  const a = await device(blank({ scripts: ['actions-store'] }));
  const b = await device(blank({ scripts: ['actions-store'] }));
  const x = a.w.ActionsStore.add({ title: 'Old action' });
  const y = a.w.ActionsStore.add({ title: 'Other' });
  await sync(a, server);
  await sync(b, server);
  a.w.ActionsStore.remove(x.id);
  await sync(a, server);
  assert.ok(x.id in (await teamCopy(server, a)).deleted['sc-actions']);
  // 91 days later A syncs again: the tombstone is purged.
  later(a.w, 91 * DAY);
  a.w.ActionsStore.update(y.id, { owner: 'Ana' });
  await sync(a, server);
  assert.deepEqual((await teamCopy(server, a)).deleted, {});
  // B was away all that time with the row as it was: it goes all the same, since B had not changed it.
  later(b.w, 91 * DAY);
  await sync(b, server);
  assert.deepEqual(actionIds(b.w), [y.id]);
});

// The box "All your work in one file" as work-backup.js reads it.
const BOX = `<div data-work-backup data-text='${JSON.stringify({ inBrowser: '{tools}', nothing: '', saved: '{file}', invalid: 'invalid', confirm: '{date} {tools}', full: 'full', opened: 'opened', blocked: '' })}'>
  <p data-work-summary></p><p data-work-status></p><button data-work-save></button><input type="file" data-work-open></div>`;
const openFile = async (w, backup) => {
  const picker = w.document.querySelector('[data-work-open]');
  // jsdom's File has no text(): what the script uses of a picked file.
  const text = JSON.stringify(backup);
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'work.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new w.Event('change'));
  for (let i = 0; i < 50 && w.document.querySelector('[data-work-status]').textContent !== 'opened'; i++) await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(w.document.querySelector('[data-work-status]').textContent, 'opened');
};

test('a saved file put back (or a restore point) is not a deletion: the team keeps the rows the file lacks', async () => {
  const server = fakeServer();
  const aw = blank({ scripts: ['actions-store'] });
  aw.document.body.innerHTML = BOX;
  // The box script again, now that the page has the box.
  aw.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
  aw.eval(fs.readFileSync('src/js/team-sync.js', 'utf8'));
  aw.location.reload = () => {};
  const a = await device(aw);
  const b = await device(blank({ scripts: ['actions-store'] }));
  const mine = aw.ActionsStore.add({ title: 'Mine' });
  await sync(a, server);
  const file = plain(aw.WorkBackup.makeBackup(aw.localStorage));
  const theirs = b.w.ActionsStore.add({ title: 'Theirs' });
  await sync(b, server);
  await sync(a, server);
  assert.deepEqual(actionIds(aw), [mine.id, theirs.id]);
  // A opens the file saved before B's action arrived.
  await openFile(aw, file);
  assert.deepEqual(actionIds(aw), [mine.id]);
  await sync(a, server);
  await sync(b, server);
  assert.deepEqual(actionIds(b.w).sort(), [mine.id, theirs.id].sort(), 'B keeps its action');
  assert.deepEqual(actionIds(aw).sort(), [mine.id, theirs.id].sort(), 'and A gets it back');
  // The same through the restore points' own replace (StorageGuard.restorePoint needs IndexedDB, so its two steps).
  aw.StorageGuardMath.replaceItems(aw.localStorage, { 'sc-actions': file.items['sc-actions'] });
  aw.TeamSync.rebase(aw.localStorage, ['sc-actions']);
  await sync(a, server);
  assert.deepEqual(actionIds(aw).sort(), [mine.id, theirs.id].sort());
  assert.match(fs.readFileSync('src/js/storage-guard.js', 'utf8'), /if \(!replaceItems\(storage, items\)\) return "full";\n.*\n.*TeamSync\?\.rebase\?\.\(storage, Object\.keys\(items\)\)/);
});
