// Verifikim për planin (docs/plan-sot-2026-11-11/PLANI.md, pjesa 5.1): çfarë ndryshon te sinkronizimi i ekipit kur
// rreshtat e regjistrit të dëmeve marrin `id`. Përdor kodin e vërtetë të sinkronizimit (src/js/team-sync.js,
// TeamSync.syncOnce) me një server të rremë si ai i tests/team-sync.test.cjs. Nuk ndryshon asgjë në repo.
// Nis nga rrënja e repo-s, pas `npm ci`:
//   node docs/plan-sot-2026-11-11/prova/id-e-rreshtave.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require(process.cwd() + '/node_modules/jsdom');

const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const KEY = 'sc-damage-control-sq';

const load = (rows) => {
  const w = new JSDOM('<html lang="sq"><body></body></html>', { url: 'https://stivencatalyst.com/sq/tools.html', runScripts: 'outside-only' }).window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.CompressionStream = CompressionStream; w.DecompressionStream = DecompressionStream;
  w.confirm = () => true;
  w.localStorage.setItem(KEY, JSON.stringify({ rows }));
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const fakeServer = () => {
  const spaces = new Map();
  let clock = 1_000_000;
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  const fetch = async (url, init = {}) => {
    const id = (/\/v1\/spaces\/([0-9a-f]{64})$/.exec(url) || [])[1];
    if (!id) return reply(404, { error: 'not-found' });
    const meta = spaces.get(id);
    if ((init.method || 'GET') === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    const token = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
    if (!token || (meta && meta.token !== token)) return reply(403, { error: 'token' });
    const body = JSON.parse(init.body);
    const rev = meta ? meta.rev : 0;
    if (body.rev !== rev) return reply(409, { rev });
    clock += 5000;
    spaces.set(id, { rev: rev + 1, updated: clock, iv: body.iv, data: body.data, token });
    return reply(200, { rev: rev + 1, updated: clock });
  };
  return { fetch };
};
const device = async (rows) => { const w = load(rows); return { w, keys: await w.TeamSyncMath.deriveKeys(CODE, 1000) }; };
const sync = async (dev, server) => {
  const result = await dev.w.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys, selected: () => true, create: true, wait: async () => {} });
  assert.ok(['synced', 'unchanged'].includes(result.status), `sinkronizimi: ${result.status}`);
};
const rows = (dev) => JSON.parse(dev.w.localStorage.getItem(KEY)).rows;
const setRows = (dev, list) => dev.w.localStorage.setItem(KEY, JSON.stringify({ rows: list }));
const row = (stage, extra = {}) => ({ date: '2026-11-11', shift: 'Pasdite', stage, cause: 'Stivimi', units: 1, cost: null, note: '', ...extra });
const say = (label, text) => console.log(`${label}\n  ${text}`);

(async () => {
  // 1. Sot: dy dëme identike në të njëjtën pajisje (i njëjti hap, shkak dhe njësi, dy herë në një turn).
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi'), row('Ngarkimi')]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    say('1. Pa id: dy rreshta identikë te A', `A i mban ${rows(A).length}; B merr ${rows(B).length}. Rreshti i dytë nuk arrin te pajisja tjetër.`);
    assert.equal(rows(B).length, 1);
  }
  // 2. Sot: një rresht i fshirë në një pajisje kthehet me sinkronizimin tjetër.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi'), row('Paketimi')]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    setRows(A, rows(A).filter((r) => r.stage !== 'Paketimi'));
    await sync(A, server); await sync(B, server);
    say('2. Pa id: A fshin një rresht', `pas sinkronizimit A ka ${rows(A).length} rreshta dhe B ${rows(B).length}. Fshirja nuk mban.`);
    assert.equal(rows(A).length, 2);
  }
  // 3. Me id: dy rreshta identikë mbeten dy.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi', { id: 'r1' }), row('Ngarkimi', { id: 'r2' })]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    say('3. Me id: dy rreshta identikë te A', `B merr ${rows(B).length}.`);
    assert.equal(rows(B).length, 2);
  }
  // 4. Me id: fshirja kalon te pajisja tjetër.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi', { id: 'r1' }), row('Paketimi', { id: 'r2' })]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    setRows(A, rows(A).filter((r) => r.id !== 'r2'));
    await sync(A, server); await sync(B, server);
    say('4. Me id: A fshin një rresht', `pas sinkronizimit A ka ${rows(A).length} dhe B ${rows(B).length}. Fshirja kalon te ekipi.`);
    assert.deepEqual([rows(A).length, rows(B).length], [1, 1]);
  }
  // 5. Pse rreshtat e vjetër nuk marrin id me vonesë: e njëjta pajisje i jep id një rreshti që ekipi e ka pa id.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi')]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    setRows(A, rows(A).map((r) => ({ ...r, id: 'r-late' })));
    await sync(A, server); await sync(B, server); await sync(A, server);
    say('5. Id e shtuar me vonesë te një rresht i vjetër', `A përfundon me ${rows(A).length} rreshta dhe B me ${rows(B).length}: i njëjti dëm dy herë.`);
    assert.equal(rows(B).length, 2);
  }
  // 6. Regjistër i përzier: rreshta të vjetër pa id dhe të rinj me id, në dy pajisje.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi'), row('Paketimi', { id: 'a1' })]);
    const B = await device([row('Ngarkimi'), row('Pranimi', { id: 'b1' })]);
    await sync(A, server); await sync(B, server); await sync(A, server);
    say('6. Të vjetër pa id dhe të rinj me id, bashkë', `A ka ${rows(A).length} dhe B ${rows(B).length}: rreshti i vjetër i përbashkët një herë, dy të rinjtë nga një herë.`);
    assert.deepEqual([rows(A).length, rows(B).length], [3, 3]);
  }
  // 7. Versione të përziera: B ka një faqe të vjetër, që e rindërton rreshtin pa id kur hapet.
  {
    const server = fakeServer();
    const A = await device([row('Ngarkimi', { id: 'r1' })]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    setRows(B, rows(B).map(({ id, ...rest }) => rest));
    await sync(B, server); await sync(A, server);
    const ids = [...rows(A), ...rows(B)].filter((r) => 'id' in r).length;
    say('7. Një pajisje me faqe të vjetër e heq id-në', `A ka ${rows(A).length} rresht dhe B ${rows(B).length}; rreshta me id te të dyja: ${ids}. Rreshti mbetet, id humbet te të gjithë.`);
    assert.deepEqual([rows(A).length, rows(B).length, ids], [1, 1, 0]);
  }
  console.log('\nTë shtatë rastet dolën siç pritej.');
})().catch((error) => { console.error('DËSHTOI:', error.message); process.exit(1); });
