// Team sync, old and new side by side: the Worker and the box as they run in production today
// (tests/fixtures/sync-v1, frozen copies of main) against the ones of this branch (workers/sync/worker.js,
// src/js/team-sync.js). The site and the Worker are published apart, so every order has to be safe: the new box on
// today's Worker, today's box on the new Worker, a tab still on the old page while another has the new one, and
// each of the two rolled back. The Worker runs in node with a fake of its Durable Objects whose storage survives a
// change of the Worker's code, as Cloudflare's does. Nothing is deployed. See docs/SYNC-WORKER-MIGRATION.md.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { JSDOM } = require('jsdom');

const ENDPOINT = 'https://stiven-catalyst-sync.example.workers.dev';
const SITE = 'https://stivencatalyst.com';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const ITERATIONS = 1000;
const WORKER = { v1: path.join(__dirname, 'fixtures', 'sync-v1', 'worker.js'), v2: path.join(__dirname, '..', 'workers', 'sync', 'worker.js') };
const CLIENT = { v1: fs.readFileSync(path.join(__dirname, 'fixtures', 'sync-v1', 'team-sync.js'), 'utf8'), v2: fs.readFileSync('src/js/team-sync.js', 'utf8') };

// Today's Worker hands the request's body stream on to its Durable Object as Cloudflare allows; node's Request wants
// the `duplex` option for that, which the Workers runtime does not.
const NodeRequest = globalThis.Request;
globalThis.Request = class extends NodeRequest {
  constructor(input, init) { super(input, init?.body && typeof init.body.getReader === 'function' && !init.duplex ? { ...init, duplex: 'half' } : init); }
};

// Durable Object storage, kept by the platform across deployments.
const fakeStorage = () => {
  const map = new Map();
  return {
    map,
    async get(key) { return Array.isArray(key) ? new Map(key.filter((k) => map.has(k)).map((k) => [k, structuredClone(map.get(k))])) : structuredClone(map.get(key)); },
    async put(key, value) { if (typeof key === 'object') Object.entries(key).forEach(([k, v]) => map.set(k, structuredClone(v))); else map.set(key, structuredClone(value)); },
    async delete(key) { (Array.isArray(key) ? key : [key]).forEach((k) => map.delete(k)); },
    async deleteAll() { map.clear(); },
    async setAlarm() {},
    async deleteAlarm() {},
  };
};
// One Cloudflare account: the objects' storage stays, the code of the Worker is whatever was deployed last.
const cloud = () => {
  const storages = new Map();
  let code = null;
  const env = {
    SPACES: {
      idFromName: (name) => ({ name }),
      get: ({ name }) => {
        if (!storages.has(name)) storages.set(name, fakeStorage());
        const object = new code.Space({ storage: storages.get(name) }, env);
        return { fetch: (request) => object.fetch(request) };
      },
    },
  };
  const deploy = async (version) => { code = await import(pathToFileURL(WORKER[version]).href); };
  // The browser's fetch, as the box calls it, through the Worker deployed now.
  const fetch = async (url, init = {}) => code.default.fetch(new Request(url, {
    method: init.method || 'GET',
    headers: { Origin: SITE, 'CF-Connecting-IP': '203.0.113.7', ...(init.headers || {}) },
    ...(init.body === undefined ? {} : { body: init.body }),
  }), env);
  const space = (id) => storages.get(id)?.map.get('meta') || null;
  return { deploy, fetch, space, storages };
};

// A browser tab with the box of one version.
const tab = (version, storage = {}) => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: `${SITE}/tools.html`, runScripts: 'outside-only' });
  const w = dom.window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  Object.assign(w, { TextEncoder, TextDecoder, CompressionStream, DecompressionStream });
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  for (const file of ['storage-guard', 'work-backup']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  w.eval(CLIENT[version]);
  return w;
};
const keysOf = (w) => w.TeamSyncMath.deriveKeys(CODE, ITERATIONS);
const sync = async (w, server, extra = {}) => {
  const result = await w.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: w.localStorage, keys: await keysOf(w), selected: () => true, create: false, wait: async () => {}, now: () => new Date(Date.now() + 2000 * ++clock), ...extra });
  return JSON.parse(JSON.stringify(result));
};
let clock = 0;
// The Worker allows one write a second per space; the tests wait that out instead of mocking the clock.
const pause = () => new Promise((resolve) => setTimeout(resolve, 1050));
const ids = (w, key = 'sc-actions') => (JSON.parse(w.localStorage.getItem(key) || '{"rows":[]}').rows || []).map((r) => r.id).sort();
const actions = (...rows) => ({ rows: rows.map((id) => ({ id, title: `Action ${id}` })) });
const setActions = (w, ...rows) => w.localStorage.setItem('sc-actions', JSON.stringify(actions(...rows)));

test('the fixtures are the production code: SHA-256 ids and payload version 1 in the box, no limits in the Worker', async () => {
  const old = tab('v1');
  const keys = await keysOf(old);
  const sha = (text) => require('node:crypto').createHash('sha256').update(text).digest('hex');
  assert.equal(keys.spaceId, sha(`space:${CODE}`));
  assert.match(CLIENT.v1, /const VERSION = 1;/);
  assert.match(CLIENT.v2, /const VERSION = 2;/);
  assert.doesNotMatch(fs.readFileSync(WORKER.v1, 'utf8'), /CREATE_LIMIT/);
});

test('step 1, the Worker first: today\'s box keeps working on the new Worker (create, sync, merge, delete the copy)', async () => {
  const server = cloud();
  await server.deploy('v2');
  const a = tab('v1', { 'sc-actions': actions('a1') });
  assert.equal((await sync(a, server, { create: true })).status, 'synced');
  const b = tab('v1', { 'sc-actions': actions('b1') });
  await pause();
  assert.equal((await sync(b, server)).status, 'synced');
  await pause();
  assert.equal((await sync(a, server)).status, 'synced');
  assert.deepEqual([ids(a), ids(b)], [['a1', 'b1'], ['a1', 'b1']]);
  assert.equal(await a.TeamSync.deleteCopy({ endpoint: ENDPOINT, fetch: server.fetch, keys: await keysOf(a) }), 'deleted');
  assert.equal((await sync(b, server)).status, 'gone');
});

test('step 2, then the site: the new box moves a team of today\'s box to its new address; a tab still on the old page stops, writes nothing', async () => {
  const server = cloud();
  await server.deploy('v2');
  // The team as it is today: two devices on the old page.
  const old1 = tab('v1', { 'sc-actions': actions('a1') });
  const old2 = tab('v1', { 'sc-actions': actions('b1') });
  assert.equal((await sync(old1, server, { create: true })).status, 'synced');
  await pause();
  assert.equal((await sync(old2, server)).status, 'synced');
  const legacy = (await keysOf(old1)).spaceId;
  // Device 1 reloads and gets the new page, with what it holds.
  const new1 = tab('v2', Object.fromEntries(Object.keys(old1.localStorage).map((k) => [k, old1.localStorage.getItem(k)])));
  await pause();
  const moved = await sync(new1, server);
  assert.equal(moved.status, 'synced');
  assert.equal(moved.moved, true);
  const keys = await keysOf(new1);
  assert.equal(server.space(legacy), null, 'the old space is gone');
  assert.ok(server.space(keys.spaceId), 'the copy is at the new address');
  assert.deepEqual(ids(new1), ['a1', 'b1']);
  // Device 2 still has the old page open: its next sync finds no copy and stops, without making the old space again.
  const before = server.space(keys.spaceId).rev;
  assert.equal((await sync(old2, server)).status, 'gone');
  assert.equal(server.space(legacy), null, 'nothing written at the old address');
  assert.equal(server.space(keys.spaceId).rev, before, 'nor at the new one');
  // Even pointed at the new copy (version 2, with tombstones), the old page reads nothing and writes nothing.
  const pointed = await old2.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: old2.localStorage, keys, selected: () => true, create: false, wait: async () => {} });
  assert.equal(pointed.status, 'unreadable');
  assert.equal(server.space(keys.spaceId).rev, before);
  // Device 2 reloads: the new page finds the team at the new address, its own row goes up, nothing is lost.
  const new2 = tab('v2', Object.fromEntries(Object.keys(old2.localStorage).map((k) => [k, old2.localStorage.getItem(k)])));
  assert.deepEqual(ids(new2), ['a1', 'b1'], 'what the old page had synced');
  setActions(new2, 'a1', 'b1', 'b2');
  await pause();
  assert.equal((await sync(new2, server)).status, 'synced');
  await pause();
  assert.equal((await sync(new1, server)).status, 'synced');
  assert.deepEqual([ids(new1), ids(new2)], [['a1', 'b1', 'b2'], ['a1', 'b1', 'b2']]);
  // And a deletion now reaches every device (what the move was for).
  setActions(new1, 'a1', 'b2');
  await pause();
  assert.equal((await sync(new1, server)).status, 'synced');
  await pause();
  assert.equal((await sync(new2, server)).status, 'synced');
  assert.deepEqual(ids(new2), ['a1', 'b2']);
});

test('the other order is safe too: the new box on today\'s Worker (moves, tombstones, deleting the copy)', async () => {
  const server = cloud();
  await server.deploy('v1');
  const old1 = tab('v1', { 'sc-actions': actions('a1', 'a2') });
  assert.equal((await sync(old1, server, { create: true })).status, 'synced');
  const new1 = tab('v2', Object.fromEntries(Object.keys(old1.localStorage).map((k) => [k, old1.localStorage.getItem(k)])));
  await pause();
  const moved = await sync(new1, server);
  assert.equal(moved.moved, true);
  const new2 = tab('v2');
  await pause();
  assert.equal((await sync(new2, server)).status, 'synced');
  assert.deepEqual(ids(new2), ['a1', 'a2']);
  setActions(new1, 'a1');
  await pause();
  assert.equal((await sync(new1, server)).status, 'synced');
  await pause();
  assert.equal((await sync(new2, server)).status, 'synced');
  assert.deepEqual(ids(new2), ['a1'], 'the deletion arrives through today\'s Worker');
  assert.equal(await new1.TeamSync.deleteCopy({ endpoint: ENDPOINT, fetch: server.fetch, keys: await keysOf(new1) }), 'deleted');
  assert.equal((await sync(new2, server)).status, 'gone');
});

test('rollback of the Worker: the spaces the new Worker wrote open with today\'s Worker; its counters are out of reach', async () => {
  const server = cloud();
  await server.deploy('v2');
  const new1 = tab('v2', { 'sc-actions': actions('a1') });
  assert.equal((await sync(new1, server, { create: true })).status, 'synced');
  assert.ok([...server.storages.keys()].some((name) => name.startsWith('limit:')), 'the new Worker counted the new space');
  await server.deploy('v1');
  const new2 = tab('v2', { 'sc-actions': actions('b1') });
  await pause();
  assert.equal((await sync(new2, server)).status, 'synced');
  await pause();
  assert.equal((await sync(new1, server)).status, 'synced');
  assert.deepEqual([ids(new1), ids(new2)], [['a1', 'b1'], ['a1', 'b1']]);
  // A counter's name is not a space id: no request from outside reaches it, with either Worker.
  const counter = [...server.storages.keys()].find((name) => name.startsWith('limit:'));
  assert.equal((await server.fetch(`${ENDPOINT}/v1/spaces/${encodeURIComponent(counter)}`)).status, 404);
});

test('rollback of the site after teams moved: the old page finds no copy and writes nothing; the new page finds it again', async () => {
  const server = cloud();
  await server.deploy('v2');
  const new1 = tab('v2', { 'sc-actions': actions('a1') });
  assert.equal((await sync(new1, server, { create: true })).status, 'synced');
  const keys = await keysOf(new1);
  const rev = server.space(keys.spaceId).rev;
  const rolledBack = tab('v1', Object.fromEntries(Object.keys(new1.localStorage).map((k) => [k, new1.localStorage.getItem(k)])));
  assert.equal((await sync(rolledBack, server)).status, 'gone');
  assert.equal(server.space(keys.spaceId).rev, rev, 'the copy is untouched');
  assert.deepEqual(ids(rolledBack), ['a1'], 'the work stays on the device');
  const forward = tab('v2', Object.fromEntries(Object.keys(rolledBack.localStorage).map((k) => [k, rolledBack.localStorage.getItem(k)])));
  await pause();
  assert.equal((await sync(forward, server)).status, 'synced');
  assert.deepEqual(ids(forward), ['a1']);
});
