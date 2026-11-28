// Team sync and the integrity of the team's work (src/js/team-sync.js), found by the audit of 28 November 2026
// (docs/audits/full-platform-audit.md, TS-01 to TS-07): each case failed on the script before it. Two or three
// simulated devices against a fake of the sync server; the data is fictional.
//   TS-01  a correction or a removal in a log whose rows have no id came back at the device's own next sync
//   TS-02  two devices that changed two rooms of one board: one change was lost; a joining device replaced the board
//   TS-03  a copy written where the team's had been deleted was merged in as the team's
//   TS-04  a deleted row put back from a restore point was deleted again by the next sync
//   TS-06  two devices each sent "their" version at every sync, for ever
//   SEC-03 a small copy that unpacks to hundreds of megabytes was unpacked whole
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


const set = (dev, key, value) => dev.w.localStorage.setItem(key, JSON.stringify(value));
const get = (dev, key) => JSON.parse(dev.w.localStorage.getItem(key));
const LOGS = ['sc-safety-cross', 'sc-damage-control', 'sc-delay-analyzer', 'sc-night-audit', 'sc-incomplete-control'];

test('TS-01: a row without an id corrected or removed here stays so after this device\'s own next sync', async () => {
  for (const key of LOGS) {
    const server = fakeServer();
    const rows = [{ date: '2026-10-26', what: 'row one', qty: 1 }, { date: '2026-10-26', what: 'row two', qty: 2 }];
    const a = await device(blank({ storage: { [key]: { rows } } }));
    await sync(a, server);
    set(a, key, { rows: [{ ...rows[0], qty: 5 }] });
    await sync(a, server);
    assert.deepEqual(get(a, key).rows, [{ date: '2026-10-26', what: 'row one', qty: 5 }], key);
    await sync(a, server);
    assert.deepEqual(get(a, key).rows, [{ date: '2026-10-26', what: 'row one', qty: 5 }], `${key}, and at the sync after`);
  }
});

test('TS-01: the correction and the removal reach the other device; a row added there meanwhile stays', async () => {
  const key = 'sc-damage-control';
  const server = fakeServer();
  const rows = [{ date: '2026-10-26', what: 'pallet', qty: 1 }, { date: '2026-10-26', what: 'carton', qty: 2 }];
  const a = await device(blank({ storage: { [key]: { rows } } }));
  const b = await device(blank());
  await sync(a, server);
  await sync(b, server);
  assert.deepEqual(get(b, key).rows, rows);
  set(a, key, { rows: [{ ...rows[0], qty: 5 }] });
  set(b, key, { rows: [...rows, { date: '2026-10-27', what: 'crate', qty: 3 }] });
  await sync(a, server);
  await sync(b, server);
  await sync(a, server);
  const want = [{ date: '2026-10-26', what: 'pallet', qty: 5 }, { date: '2026-10-27', what: 'crate', qty: 3 }];
  const sorted = (list) => [...list].sort((x, y) => x.what.localeCompare(y.what));
  assert.deepEqual(sorted(get(a, key).rows), sorted(want));
  assert.deepEqual(sorted(get(b, key).rows), sorted(want));
});

test('TS-01: a device whose state was written before this change merges as before, and knows its rows from then on', async () => {
  const key = 'sc-night-audit';
  const server = fakeServer();
  const rows = [{ date: '2026-10-26', what: 'no-show', qty: 1 }];
  const a = await device(blank({ storage: { [key]: { rows } } }));
  await sync(a, server);
  // The state as the script before kept it: no fingerprints of id-less rows, none inside the fields of an object.
  const state = get(a, 'sc-team-state');
  Object.values(state.synced).forEach((base) => { delete base.c; delete base.n; });
  set(a, 'sc-team-state', state);
  set(a, key, { rows: [...rows, { date: '2026-10-27', what: 'declined card', qty: 1 }] });
  assert.equal((await sync(a, server)).status, 'synced');
  assert.equal(get(a, key).rows.length, 2);
  assert.ok(Array.isArray(get(a, 'sc-team-state').synced[key].c));
});

const entry = (status, at = '') => ({ status, at, flags: [], attendant: '', note: '', started: '', ooo: null });
const board = () => ({ rooms: [{ number: '101', floor: '1', type: 'double' }, { number: '205', floor: '2', type: 'double' }], board: { 101: entry('vd'), 205: entry('occ') }, history: { '2026-10-27': [] }, attendants: [], arrivals: {}, filters: {}, day: '2026-10-27', example: false });
const change = (dev, room, status, t, day = '2026-10-27') => {
  const s = get(dev, 'sc-room-status');
  s.board[room] = entry(status, `${day} ${t}`);
  s.history[day] = [...(s.history[day] || []), { t, room, kind: 'status', from: '', to: status, who: '' }];
  set(dev, 'sc-room-status', s);
};

test('TS-02: two devices change two rooms of one board between syncs: both changes and both events stay, on both', async () => {
  const server = fakeServer();
  const hk = await device(blank({ storage: { 'sc-room-status': board() } }));
  const fo = await device(blank({ storage: { 'sc-room-status': board() } }));
  await sync(hk, server); await sync(fo, server);
  change(hk, '101', 'vc', '10:05');
  change(fo, '205', 'co', '10:06');
  await sync(hk, server); await sync(fo, server); await sync(hk, server); await sync(fo, server);
  for (const dev of [hk, fo]) {
    const s = get(dev, 'sc-room-status');
    assert.equal(s.board[101].status, 'vc');
    assert.equal(s.board[205].status, 'co');
    assert.deepEqual(s.history['2026-10-27'].map((e) => e.room).sort(), ['101', '205']);
  }
  // A new day begun on both devices before either synced: the events of both.
  change(hk, '101', 'vd', '07:00', '2026-10-28');
  change(fo, '205', 'vd', '07:01', '2026-10-28');
  await sync(hk, server); await sync(fo, server); await sync(hk, server);
  for (const dev of [hk, fo]) assert.deepEqual(get(dev, 'sc-room-status').history['2026-10-28'].map((e) => e.room).sort(), ['101', '205']);
  // The same room changed on both: one version on both devices (the one of the device that synced last), not a mix.
  change(hk, '101', 'vc', '09:00', '2026-10-28');
  change(fo, '101', 'ooo', '09:01', '2026-10-28');
  await sync(hk, server); await sync(fo, server); await sync(hk, server);
  assert.equal(get(hk, 'sc-room-status').board[101].status, 'ooo');
  assert.equal(get(fo, 'sc-room-status').board[101].status, 'ooo');
});

test('TS-02: mergeInside keeps to what it can tell: an entry removed stays removed, a list that is not a record of events is not mixed', () => {
  const M = blank().TeamSyncMath;
  const was = { a: { n: 1 }, b: { n: 2 }, c: { n: 3 } };
  const node = M.nodeOf(was);
  // b removed here, c changed on the team, d added on the team, a changed here.
  assert.deepEqual(plain(M.mergeInside({ a: { n: 9 }, c: { n: 3 } }, { a: { n: 1 }, b: { n: 2 }, c: { n: 4 }, d: { n: 5 } }, node)), { a: { n: 9 }, c: { n: 4 }, d: { n: 5 } });
  // b removed on the team but changed here: the change stays.
  assert.deepEqual(plain(M.mergeInside({ a: { n: 1 }, b: { n: 7 }, c: { n: 3 }, e: 1 }, { a: { n: 1 }, c: { n: 3 }, f: 2 }, node)), { a: { n: 1 }, b: { n: 7 }, c: { n: 3 }, e: 1, f: 2 });
  // Lists of plain values (ticks by position) and lists changed inside: this device's, whole, as before.
  const ticks = M.nodeOf([false, false, false]);
  assert.deepEqual(plain(M.mergeInside([true, false, false], [false, true, false], ticks)), [true, false, false]);
  const list = M.nodeOf([{ id: 1, t: 'x' }]);
  assert.deepEqual(plain(M.mergeInside([{ id: 1, t: 'y' }], [{ id: 1, t: 'x' }, { id: 2, t: 'z' }], list)), [{ id: 1, t: 'y' }]);
  // Both only added records: all of them, each once.
  assert.deepEqual(plain(M.mergeInside([{ id: 1, t: 'x' }, { id: 3 }], [{ id: 1, t: 'x' }, { id: 2 }, { id: 3 }], list)), [{ id: 1, t: 'x' }, { id: 3 }, { id: 2 }]);
});

test('TS-02: a device that joins with a board of its own (here the example) does not replace the team\'s', async () => {
  const server = fakeServer();
  const team = await device(blank({ storage: { 'sc-room-status': board() } }));
  await sync(team, server);
  const mine = { ...board(), rooms: [{ number: '901', floor: '9', type: 'single' }, { number: '902', floor: '9', type: 'single' }], board: { 901: entry('occ'), 902: entry('vd') }, example: true };
  const joiner = await device(blank({ storage: { 'sc-room-status': mine } }));
  let before = null;
  assert.equal((await sync(joiner, server, { create: false, beforeWrite: () => { before = joiner.w.localStorage.getItem('sc-room-status'); } })).status, 'synced');
  assert.deepEqual(JSON.parse(before).rooms.map((r) => r.number), ['901', '902'], 'what the joiner held is handed to the restore point first');
  await sync(team, server);
  for (const dev of [team, joiner]) {
    const s = get(dev, 'sc-room-status');
    assert.deepEqual(s.rooms.map((r) => r.number), ['101', '205']);
    assert.deepEqual(Object.keys(s.board), ['101', '205']);
    assert.equal(s.example, false);
  }
});

test('TS-04: a deleted row put back from a restore point stays, here and on the other device; deleted again, it goes again', async () => {
  const server = fakeServer();
  const a = await device(blank({ scripts: ['actions-store'] }));
  const b = await device(blank({ scripts: ['actions-store'] }));
  const keep = a.w.ActionsStore.add({ title: 'Keep' });
  const oops = a.w.ActionsStore.add({ title: 'Deleted by mistake' });
  await sync(a, server); await sync(b, server);
  const point = a.w.localStorage.getItem('sc-actions');
  a.w.ActionsStore.remove(oops.id);
  await sync(a, server); await sync(b, server);
  assert.deepEqual(actionIds(b.w), [keep.id]);
  // The restore point's two steps (StorageGuard.restorePoint needs IndexedDB), a minute later.
  later(a.w, 60_000);
  a.w.StorageGuardMath.replaceItems(a.w.localStorage, { 'sc-actions': point });
  assert.equal(a.w.TeamSync.rebase(a.w.localStorage, ['sc-actions']), true);
  await sync(a, server);
  assert.deepEqual(actionIds(a.w).sort(), [keep.id, oops.id].sort(), 'not deleted again');
  await sync(b, server);
  assert.deepEqual(actionIds(b.w).sort(), [keep.id, oops.id].sort(), 'and back on the other device, which knew the tombstone');
  await sync(a, server); await sync(b, server);
  assert.deepEqual(actionIds(a.w).sort(), [keep.id, oops.id].sort());
  assert.equal((await teamCopy(server, a)).revived['sc-actions'][oops.id] > 0, true);
  // Deleted on purpose now, on the other device, whose clock is an hour behind.
  later(b.w, -3_600_000);
  b.w.ActionsStore.remove(oops.id);
  await sync(b, server); await sync(a, server);
  assert.deepEqual(actionIds(a.w), [keep.id]);
  assert.deepEqual(actionIds(b.w), [keep.id]);
});

test('TS-06: two devices that agree stop uploading, whatever order their rows were in and whichever setting each had', async () => {
  const server = fakeServer();
  const a = await device(blank({ storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'x' }] }, 'sc-damage-control': { rows: [{ date: '2026-10-26', qty: 1 }], hours: 1000 } } }));
  const b = await device(blank({ storage: { 'sc-actions': { rows: [{ id: 'b1', title: 'y' }] }, 'sc-damage-control': { rows: [{ date: '2026-10-27', qty: 2 }], hours: 2500 } } }));
  await sync(a, server); await sync(b, server); await sync(a, server);
  const rev = server.spaces.get(a.keys.spaceId).rev;
  for (let round = 0; round < 3; round++) {
    assert.equal((await sync(b, server)).uploaded, false);
    assert.equal((await sync(a, server)).uploaded, false);
  }
  assert.equal(server.spaces.get(a.keys.spaceId).rev, rev);
  assert.equal(a.w.localStorage.getItem('sc-actions'), b.w.localStorage.getItem('sc-actions'));
  assert.equal(a.w.localStorage.getItem('sc-damage-control'), b.w.localStorage.getItem('sc-damage-control'));
  assert.equal(get(a, 'sc-damage-control').rows.length, 2);
});

test('TS-03: a copy with a lower revision than this device last saw is not the team\'s: nothing is merged, the copy counts as gone', async () => {
  const server = fakeServer();
  const a = await device(blank({ scripts: ['actions-store'] }));
  const b = await device(blank({ scripts: ['actions-store'] }));
  const real = b.w.ActionsStore.add({ title: 'Real action' });
  await sync(a, server); await sync(b, server); await sync(a, server);
  assert.ok(get(b, 'sc-team-state').rev >= 2);
  // The team's copy is deleted, and someone who holds the address and the key (a read-only code) writes their own.
  const planted = await a.w.TeamSyncMath.seal({ format: 'stiven-catalyst-team', version: 2, sent: '', device: null, devices: [], items: { 'sc-actions': JSON.stringify({ rows: [{ id: 'x1', title: 'PLANTED' }] }) }, deleted: {} }, a.keys.key);
  server.spaces.set(b.keys.spaceId, { rev: 1, updated: 1, iv: planted.iv, data: planted.data, token: 'f'.repeat(64) });
  const before = b.w.localStorage.getItem('sc-actions');
  const result = await sync(b, server, { create: false });
  assert.equal(result.status, 'gone');
  assert.equal(b.w.localStorage.getItem('sc-actions'), before);
  assert.deepEqual(actionIds(b.w), [real.id]);
  // The same for a device that only reads.
  const vw = blank({ scripts: ['actions-store'] });
  const viewer = { w: vw, keys: await vw.TeamSyncMath.viewerKeys((await vw.TeamSyncMath.parseViewer(await a.w.TeamSyncMath.viewerCode(a.keys))).text) };
  set(viewer, 'sc-team-state', { viewer: true, rev: 5 });
  assert.equal((await vw.TeamSync.pullOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: vw.localStorage, keys: viewer.keys, selected: () => true })).status, 'gone');
  assert.equal(vw.localStorage.getItem('sc-actions'), null);
});

test('SEC-03: a copy that unpacks to far more than any team\'s work is given up on, not unpacked whole', async () => {
  const w = blank();
  const M = w.TeamSyncMath;
  const keys = await M.deriveKeys(CODE, 1000);
  // 80 MB of spaces inside a JSON text: about 80 KB gzipped, well within the server's 4 MB.
  const zipped = new Uint8Array(await new Response(new Blob([new Uint8Array(80 * 1024 * 1024).fill(32)]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  const body = new Uint8Array(zipped.length + 1);
  body[0] = 1;
  body.set(zipped, 1);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await globalThis.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, keys.key, body));
  await assert.rejects(M.unseal({ iv: M.toBase64(iv), data: M.toBase64(data) }, keys.key), /too-large/);
  // An honest copy still opens.
  const sealed = await M.seal({ format: 'stiven-catalyst-team', version: 2, items: { 'sc-actions': '{"rows":[]}' } }, keys.key);
  assert.equal(plain(await M.unseal(sealed, keys.key)).items['sc-actions'], '{"rows":[]}');
});

// The rules the author approved on 28 November 2026, each named here so a later change has to face it:
//   1. a device that joins takes the team's value and keeps what it held in the restore point (the TS-02 test above);
//   2. a log this device has not changed takes the team's order (below);
//   3. the Worker keeps the hash of a deleted space's token for 180 days, nothing of the team's work, and lets it go
//      by itself (tests/sync-worker.test.cjs, tests/sync-compat.test.cjs).
test('approved rule 2: a log this device has not changed since its last sync takes the team\'s order; one it has changed keeps its own', async () => {
  const server = fakeServer();
  const rows = ['a', 'b', 'c'].map((id) => ({ id, title: `Action ${id}` }));
  const a = await device(blank({ storage: { 'sc-actions': { rows } } }));
  const b = await device(blank());
  await sync(a, server); await sync(b, server);
  // B puts the list in another order and syncs; A has changed nothing.
  set(b, 'sc-actions', { rows: [rows[2], rows[0], rows[1]] });
  await sync(b, server);
  await sync(a, server);
  assert.deepEqual(get(a, 'sc-actions').rows.map((row) => row.id), ['c', 'a', 'b'], 'unchanged here: the team\'s order');
  // Both change: A adds a row, B reorders again. Nothing is lost, and A keeps its own order with its change.
  set(a, 'sc-actions', { rows: [...get(a, 'sc-actions').rows, { id: 'd', title: 'Action d' }] });
  set(b, 'sc-actions', { rows: [rows[1], rows[2], rows[0]] });
  await sync(b, server);
  await sync(a, server);
  assert.deepEqual(get(a, 'sc-actions').rows.map((row) => row.id), ['c', 'a', 'b', 'd'], 'changed here: this device\'s order, every row kept');
  await sync(b, server);
  assert.deepEqual(get(b, 'sc-actions').rows.map((row) => row.id).sort(), ['a', 'b', 'c', 'd']);
});
