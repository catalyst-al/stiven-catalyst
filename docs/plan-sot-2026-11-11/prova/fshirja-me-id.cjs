// Verifikim për auditimin e hapit 1 (docs/plan-sot-2026-11-11/AUDITIM-HAPI-1.md): mekanizmi ekzistues i fshirjes te
// sinkronizimi i ekipit, i provuar mbi rreshta të regjistrit të dëmeve që KANË `id`. Asnjë faqe nuk shkruan `id` sot
// (hapi 1c pret): rreshtat me `id` vihen këtu me dorë, për të parë çfarë do të bënte kodi ekzistues me ta.
// Përdor kodin e vërtetë (src/js/team-sync.js, storage-guard.js, work-backup.js) dhe një server të rremë.
// Nuk ndryshon asgjë në repo. Nis nga rrënja e repo-s, pas `npm ci`:
//   node docs/plan-sot-2026-11-11/prova/fshirja-me-id.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require(process.cwd() + '/node_modules/jsdom');

const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const KEY = 'sc-damage-control-sq';
const DAY = 24 * 60 * 60 * 1000;

const load = (rows) => {
  const w = new JSDOM('<html lang="sq"><body></body></html>', { url: 'https://stivencatalyst.com/sq/tools.html', runScripts: 'outside-only' }).window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.CompressionStream = CompressionStream; w.DecompressionStream = DecompressionStream;
  // Një orë e ngulitur që prova e shtyn përpara.
  w.eval(`(() => { const Real = Date; window.__now = new Real("2026-11-11T09:00:00Z").getTime(); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [window.__now])); } static now() { return window.__now; } }; })();`);
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
  return { spaces, fetch };
};
const device = async (rows) => { const w = load(rows); return { w, keys: await w.TeamSyncMath.deriveKeys(CODE, 1000) }; };
const sync = async (dev, server) => {
  const result = await dev.w.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys, selected: () => true, create: true, wait: async () => {} });
  assert.ok(['synced', 'unchanged'].includes(result.status), `sinkronizimi: ${result.status}`);
};
const ids = (dev) => JSON.parse(dev.w.localStorage.getItem(KEY)).rows.map((r) => r.id).sort().join(',') || '(asnjë)';
const setRows = (dev, list) => dev.w.localStorage.setItem(KEY, JSON.stringify({ rows: list }));
const rowsOf = (dev) => JSON.parse(dev.w.localStorage.getItem(KEY)).rows;
const later = (dev, ms) => { dev.w.__now += ms; };
const tombstones = async (server, dev) => Object.keys(((await dev.w.TeamSyncMath.unseal(server.spaces.get(dev.keys.spaceId), dev.keys.key)).deleted || {})[KEY] || {}).join(',') || '(asnjë)';
// Rikthimi nga një skedar ose pikë rikthimi, me dy hapat e vetë faqes: zëvendësimi i çelësit, pastaj rebase.
const putBack = (dev, text) => { dev.w.StorageGuardMath.replaceItems(dev.w.localStorage, { [KEY]: text }); dev.w.TeamSync.rebase(dev.w.localStorage, [KEY]); };
const row = (id, stage) => ({ date: '2026-11-11', shift: 'Pasdite', stage, type: 'Crushed', cause: 'Stivimi', units: 1, cost: null, note: '', id });
const say = (label, text) => console.log(`${label}\n  ${text}`);
const start = async () => {
  const server = fakeServer();
  const A = await device([row('r1', 'Ngarkimi'), row('r2', 'Paketimi')]);
  const B = await device([]);
  await sync(A, server); await sync(B, server);
  return { server, A, B };
};

(async () => {
  // F1. Fshirja kalon te ekipi dhe lë një gur varri me id-në e rreshtit.
  {
    const { server, A, B } = await start();
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server); await sync(B, server);
    say('F1. A fshin r2', `A: ${ids(A)} · B: ${ids(B)} · gurë varri në kopjen e ekipit: ${await tombstones(server, A)}`);
    assert.deepEqual([ids(A), ids(B)], ['r1', 'r1']);
  }
  // F2. B ishte jashtë linje me r2 të pandryshuar dhe kthehet pas 10 ditësh.
  {
    const { server, A, B } = await start();
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server);
    later(B, 10 * DAY);
    await sync(B, server);
    say('F2. B kthehet pas 10 ditësh me r2 ende te vetja', `B: ${ids(B)}. Guri i varrit e fshin.`);
    assert.equal(ids(B), 'r1');
  }
  // F3. B e ka ndryshuar r2 ndërkohë: fshirja fiton.
  {
    const { server, A, B } = await start();
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server);
    setRows(B, rowsOf(B).map((r) => (r.id === 'r2' ? { ...r, units: 5 } : r)));
    await sync(B, server); await sync(A, server);
    say('F3. B e ndryshon r2 para se të marrë vesh fshirjen', `A: ${ids(A)} · B: ${ids(B)}. Fshirja fiton; versioni i B-së mbetet te pika e rikthimit.`);
    assert.deepEqual([ids(A), ids(B)], ['r1', 'r1']);
  }
  // F4. B rikthen një kopje të vjetër që e ka r2, brenda 90 ditëve.
  {
    const { server, A, B } = await start();
    const old = B.w.localStorage.getItem(KEY);
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server); await sync(B, server);
    putBack(B, old);
    const before = ids(B);
    await sync(B, server); await sync(A, server);
    say('F4. B rikthen një kopje të vjetër me r2, brenda 90 ditëve', `pas rikthimit B: ${before}; pas sinkronizimit A: ${ids(A)} · B: ${ids(B)}. Rreshti i fshirë nuk kthehet te ekipi.`);
    assert.deepEqual([before, ids(A), ids(B)], ['r1,r2', 'r1', 'r1']);
  }
  // F5. E njëjta gjë pas 91 ditësh, kur guri i varrit është hequr.
  {
    const { server, A, B } = await start();
    const old = B.w.localStorage.getItem(KEY);
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server); await sync(B, server);
    later(A, 91 * DAY); later(B, 91 * DAY);
    setRows(A, [...rowsOf(A), row('r3', 'Pranimi')]);
    await sync(A, server);
    const left = await tombstones(server, A);
    putBack(B, old);
    await sync(B, server); await sync(A, server);
    say('F5. B rikthen kopjen e vjetër pas 91 ditësh', `gurë varri të mbetur: ${left}; A: ${ids(A)} · B: ${ids(B)}. Rreshti i fshirë kthehet te të dyja.`);
    assert.deepEqual([left, ids(A), ids(B)], ['(asnjë)', 'r1,r2,r3', 'r1,r2,r3']);
  }
  // F6. B ishte jashtë 91 ditë me r2 të pandryshuar: e humb gjithsesi.
  {
    const { server, A, B } = await start();
    setRows(A, rowsOf(A).filter((r) => r.id !== 'r2'));
    await sync(A, server);
    later(A, 91 * DAY); later(B, 91 * DAY);
    setRows(A, [...rowsOf(A), row('r3', 'Pranimi')]);
    await sync(A, server); await sync(B, server);
    say('F6. B kthehet pas 91 ditësh me r2 të pandryshuar', `B: ${ids(B)}. Pa gur varri, por rreshti hiqet sepse B nuk e ka ndryshuar që nga sinkronizimi i fundit.`);
    assert.equal(ids(B), 'r1,r3');
  }
  // F7. Rreshtat pa id, si sot: fshirja nuk kalon, në asnjë rast.
  {
    const server = fakeServer();
    const strip = ({ id, ...rest }) => rest;
    const A = await device([strip(row('', 'Ngarkimi')), strip(row('', 'Paketimi'))]);
    const B = await device([]);
    await sync(A, server); await sync(B, server);
    setRows(A, rowsOf(A).filter((r) => r.stage !== 'Paketimi'));
    await sync(A, server); await sync(B, server);
    say('F7. Sot, pa id: A fshin një rresht', `A ka ${rowsOf(A).length} rreshta dhe B ${rowsOf(B).length}; gurë varri: ${await tombstones(server, A)}. Sjellja e sotme nuk ka ndryshuar.`);
    assert.deepEqual([rowsOf(A).length, rowsOf(B).length], [2, 2]);
  }
  console.log('\nTë shtatë rastet dolën siç pritej.');
})().catch((error) => { console.error('DËSHTOI:', error.message); process.exit(1); });
