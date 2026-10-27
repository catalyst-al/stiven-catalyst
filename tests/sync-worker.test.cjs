// The team sync server (workers/sync/worker.js), run in node against a fake of its one binding (SPACES, Durable
// Objects with their storage): the API as team-sync.js uses it, the origins a browser may call from (the site's only,
// localhost only where DEV_ORIGINS says so), the cap on a body with or without a Content-Length, and the limits on
// new spaces per address and for everyone. The Worker is not deployed by the tests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const FILE = process.env.SYNC_WORKER_FILE || path.join(__dirname, '..', 'workers', 'sync', 'worker.js');
const load = () => import(pathToFileURL(FILE).href);
const BASE = 'https://stiven-catalyst-sync.example.workers.dev';
const SITE = 'https://stivencatalyst.com';
const id = (n) => n.toString(16).padStart(64, '0');
const token = 'a'.repeat(64);

// Durable Object storage, as the Worker uses it.
const fakeStorage = () => {
  const map = new Map();
  let alarm = null;
  return {
    map,
    get alarm() { return alarm; },
    async get(key) { return Array.isArray(key) ? new Map(key.filter((k) => map.has(k)).map((k) => [k, structuredClone(map.get(k))])) : structuredClone(map.get(key)); },
    async put(key, value) { if (typeof key === 'object') Object.entries(key).forEach(([k, v]) => map.set(k, structuredClone(v))); else map.set(key, structuredClone(value)); },
    async delete(key) { (Array.isArray(key) ? key : [key]).forEach((k) => map.delete(k)); },
    async deleteAll() { map.clear(); },
    async setAlarm(at) { alarm = at; },
    async deleteAlarm() { alarm = null; },
  };
};
const world = async (vars = {}) => {
  const { default: worker, Space } = await load();
  const objects = new Map();
  const env = {
    ...vars,
    SPACES: {
      idFromName: (name) => ({ name }),
      get: ({ name }) => {
        if (!objects.has(name)) objects.set(name, new Space({ storage: fakeStorage() }, env));
        const object = objects.get(name);
        return { fetch: (request) => object.fetch(request) };
      },
    },
  };
  const call = (method, space, { origin = SITE, ip = '203.0.113.7', auth = token, body, headers = {} } = {}) => worker.fetch(new Request(`${BASE}/v1/spaces/${space}`, {
    method,
    headers: { ...(origin ? { Origin: origin } : {}), ...(ip ? { 'CF-Connecting-IP': ip } : {}), ...(auth ? { Authorization: `Bearer ${auth}` } : {}), ...headers },
    ...(body === undefined ? {} : { body, duplex: 'half' }),
  }), env);
  const put = (space, rev, extra = {}) => call('PUT', space, { body: JSON.stringify({ rev, iv: 'AAAAAAAAAAAAAAAA', data: 'Y2lwaGVy' }), ...extra });
  return { worker, env, objects, call, put };
};

test('the API: 404 before, a first PUT makes the space, 409 on a stale revision, 403 with another token, DELETE', async () => {
  const { call, put } = await world();
  assert.equal((await call('GET', id(1))).status, 404);
  const first = await put(id(1), 0);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.equal((await first.json()).rev, 1);
  const got = await call('GET', id(1));
  assert.deepEqual(await got.json(), { rev: 1, updated: (await (await call('GET', id(1))).json()).updated, iv: 'AAAAAAAAAAAAAAAA', data: 'Y2lwaGVy' });
  assert.equal((await put(id(1), 0)).status, 409);
  assert.equal((await put(id(1), 1, { auth: 'b'.repeat(64) })).status, 403);
  assert.equal((await call('DELETE', id(1))).status, 204);
  assert.equal((await call('GET', id(1))).status, 404);
});

test('origins: the site only; http://localhost:8080 only where DEV_ORIGINS lists it', async () => {
  const prod = await world();
  for (const origin of ['http://localhost:8080', 'https://evil.example']) {
    const response = await prod.call('GET', id(2), { origin });
    assert.equal(response.status, 403, origin);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null, origin);
  }
  assert.equal((await prod.call('GET', id(2), { origin: 'https://www.stivencatalyst.com' })).status, 404);
  const dev = await world({ DEV_ORIGINS: 'http://localhost:8080' });
  const local = await dev.call('GET', id(2), { origin: 'http://localhost:8080' });
  assert.equal(local.status, 404);
  assert.equal(local.headers.get('Access-Control-Allow-Origin'), 'http://localhost:8080');
  assert.equal((await dev.call('GET', id(2), { origin: 'https://evil.example' })).status, 403);
});

test('a body past 4 MB is refused before it reaches a space, also when it comes without a Content-Length', async () => {
  const { put, call, objects } = await world();
  // 5 MB of JSON whose ciphertext is small: only the size of the body tells.
  const padding = ' '.repeat(5 * 1024 * 1024);
  const text = `{"rev":0,"iv":"AAAAAAAAAAAAAAAA","data":"Y2lwaGVy"${padding}}`;
  const stream = () => new ReadableStream({ start(controller) { for (let i = 0; i < text.length; i += 65536) controller.enqueue(new TextEncoder().encode(text.slice(i, i + 65536))); controller.close(); } });
  const chunked = await call('PUT', id(3), { body: stream() });
  assert.equal(chunked.status, 413);
  assert.equal((await call('GET', id(3))).status, 404, 'nothing kept');
  assert.equal(objects.has(id(3)) && objects.get(id(3)).storage.map.size > 0, false);
  const declared = await call('PUT', id(3), { body: text });
  assert.equal(declared.status, 413);
  assert.equal((await put(id(3), 0)).status, 200, 'a normal body still goes through');
});

test('new spaces: ten an hour from one address, then 429; another address, an existing space and the next hour go on', async () => {
  const { put, objects } = await world();
  for (let n = 0; n < 10; n++) assert.equal((await put(id(100 + n), 0)).status, 200, `space ${n}`);
  const refused = await put(id(200), 0);
  assert.equal(refused.status, 429);
  assert.deepEqual(await refused.json(), { error: 'too-many-spaces' });
  assert.equal((await put(id(200), 0, { headers: { 'X-Sync-Client': 'someone-else' } })).status, 429, 'a header from outside does not change who asks');
  // An IPv6 address counts by its /64: another host in the same network is the same client.
  const v6 = await world({ CREATE_LIMIT_IP: '1' });
  assert.equal((await v6.put(id(1), 0, { ip: '2001:db8:1:2:aaaa::1' })).status, 200);
  assert.equal((await v6.put(id(2), 0, { ip: '2001:db8:1:2:bbbb::9' })).status, 429);
  assert.equal((await v6.put(id(3), 0, { ip: '2001:db8:1:3::1' })).status, 200);
  // Writing to a space that exists is not counted.
  assert.equal((await put(id(100), 1)).status, 429, 'one write a second still holds');
  const space = objects.get(id(100));
  const meta = await space.storage.get('meta');
  await space.storage.put('meta', { ...meta, updated: meta.updated - 2000 });
  assert.equal((await put(id(100), 1)).status, 200);
  // Another address may make its own.
  assert.equal((await put(id(201), 0, { ip: '198.51.100.4' })).status, 200);
  // The hour is over: the counter's alarm deletes it, and the address may make spaces again.
  const counter = objects.get('limit:ip:203.0.113.7');
  assert.ok(counter.storage.alarm > Date.now());
  const limit = await counter.storage.get('limit');
  await counter.storage.put('limit', { ...limit, start: limit.start - 60 * 60 * 1000 });
  await counter.alarm();
  assert.equal(counter.storage.map.size, 0);
  assert.equal((await put(id(200), 0)).status, 200);
});

test('new spaces: a cap for everyone a day, set by a variable', async () => {
  const { put } = await world({ CREATE_LIMIT_ALL: '3' });
  for (let n = 0; n < 3; n++) assert.equal((await put(id(300 + n), 0, { ip: `192.0.2.${n}` })).status, 200);
  assert.equal((await put(id(399), 0, { ip: '192.0.2.99' })).status, 429);
});
