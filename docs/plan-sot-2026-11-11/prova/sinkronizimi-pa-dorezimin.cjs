// Verifikim për planin (docs/plan-sot-2026-11-11/PLANI.md, pjesa 3.3): dorëzimi dhe historiku i tij jashtë
// sinkronizimit të ekipit, me regjistrin e dëmeve brenda. Përdor kodin e vërtetë të sinkronizimit
// (src/js/team-sync.js, TeamSync.syncOnce) me një server të rremë si ai i tests/team-sync.test.cjs.
// Nuk ndryshon asgjë në repo. Nis nga rrënja e repo-s, pas `npm ci`:
//   node docs/plan-sot-2026-11-11/prova/sinkronizimi-pa-dorezimin.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require(process.cwd() + '/node_modules/jsdom');

const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const DAMAGE = 'sc-damage-control-sq';
const HANDOVER = 'sc-shift-handover-sq';

const load = (storage) => {
  const w = new JSDOM('<html lang="sq"><body></body></html>', { url: 'https://stivencatalyst.com/sq/tools.html', runScripts: 'outside-only' }).window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder; w.CompressionStream = CompressionStream; w.DecompressionStream = DecompressionStream;
  w.confirm = () => true;
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, JSON.stringify(value));
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// I njëjti API dhe të njëjtat përgjigje si workers/sync/worker.js, sa i duhen një sinkronizimi.
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

const row = (date, shift, stage, cause, units) => ({ date, shift, stage, cause, units, cost: null, note: '' });
const issue = (text, extra = {}) => ({ text, priority: 'High', owner: '', due: '', done: false, carried: 0, ...extra });
const sheet = (date, shift, issues) => ({ template: 'warehouse', date, shift, area: 'Dock A', issues });
const closed = sheet('2026-11-11', 'Pasdite', [issue('Rampa 3 e bllokuar')]);
const handover = (who, extra) => ({
  current: sheet('2026-11-11', 'Natë', [issue('Rampa 3 e bllokuar', { carried: 1, ...extra }), issue(`${who}: çështje e vetë`)]),
  history: [{ closedAt: `2026-11-11T21:4${who === 'A' ? 0 : 5}:00.000Z`, handover: closed, text: '' }],
  received: [],
});
const shared = [row('2026-11-10', 'Pasdite', 'Ngarkimi', 'Stivimi', 1)];

// `rule` thotë çfarë ndan pajisja: "default" është zgjedhja e sotme e pajisjes (dorëzimi i pandezur), "ticked" është
// dorëzimi i ndezur me dorë, "pilot" është rregulli i planit: dorëzimi nuk ndahet kurrë, edhe kur kutia është e ndezur.
const makeDevice = async (who, rule) => {
  const w = load({
    [DAMAGE]: { rows: [...shared, row('2026-11-11', 'Natë', who === 'A' ? 'Paketimi' : 'Pranimi', 'Ambalazhi', who === 'A' ? 2 : 3)] },
    [HANDOVER]: handover(who, who === 'A' ? { done: true } : {}),
  });
  const choices = rule === 'default' ? {} : { 'shift-handover': true };
  const selected = (key) => {
    const slug = w.WorkBackup.toolSlug(key);
    if (rule === 'pilot' && slug === 'shift-handover') return false;
    return w.TeamSyncMath.isOn(slug, choices);
  };
  return { who, w, selected, keys: await w.TeamSyncMath.deriveKeys(CODE, 1000) };
};
const sync = (dev, server) => dev.w.TeamSync.syncOnce({ endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys, selected: dev.selected, create: true, wait: async () => {} });
const stored = (dev, key) => JSON.parse(dev.w.localStorage.getItem(key));
const teamKeys = async (server, dev) => Object.keys((await dev.w.TeamSyncMath.unseal(server.spaces.get(dev.keys.spaceId), dev.keys.key)).items).sort();

const scenario = async (label, ruleA, ruleB) => {
  const server = fakeServer();
  const A = await makeDevice('A', ruleA);
  const B = await makeDevice('B', ruleB);
  const before = { A: JSON.stringify(stored(A, HANDOVER)), B: JSON.stringify(stored(B, HANDOVER)) };
  for (const dev of [A, B, A, B]) { const result = await sync(dev, server); assert.ok(['synced', 'unchanged'].includes(result.status), `sinkronizimi: ${result.status}`); }
  const out = {
    damageA: stored(A, DAMAGE).rows.length, damageB: stored(B, DAMAGE).rows.length,
    handoverA: JSON.stringify(stored(A, HANDOVER)) === before.A, handoverB: JSON.stringify(stored(B, HANDOVER)) === before.B,
    team: await teamKeys(server, A),
  };
  console.log(`${label}\n  dëmet te A / te B: ${out.damageA} / ${out.damageB} rreshta · dorëzimi i A-së i paprekur: ${out.handoverA} · i B-së: ${out.handoverB}\n  kopja e ekipit mban: ${out.team.join(', ')}`);
  return out;
};

(async () => {
  // 1. Sot, pa asnjë ndryshim: dorëzimi nuk është te mjetet e ndezura vetë (DEFAULT_ON), dëmet po.
  const today = await scenario('1. Zgjedhja e sotme e pajisjes (dorëzimi i pandezur)', 'default', 'default');
  assert.deepEqual([today.damageA, today.damageB], [3, 3], 'tre rreshtat e dëmeve te të dyja');
  assert.ok(today.handoverA && today.handoverB, 'asnjë dorëzim nuk preket');
  assert.deepEqual(today.team, [DAMAGE], 'dorëzimi nuk është në kopjen e ekipit');

  // 2. Rreziku: të dyja pajisjet e kanë ndezur dorëzimin me dorë. Njëra humbet dorëzimin e vet.
  const both = await scenario('2. Dorëzimi i ndezur me dorë te të dyja', 'ticked', 'ticked');
  assert.deepEqual([both.damageA, both.damageB], [3, 3]);
  assert.ok(both.handoverA !== both.handoverB, 'saktësisht njëra pajisje e humbet dorëzimin e vet');

  // 3. Rregulli i pilotit: kutia është e ndezur te të dyja, por dorëzimi nuk ndahet. Dëmet vazhdojnë.
  const pilot = await scenario('3. Rregulli i pilotit, edhe me kutinë e ndezur', 'pilot', 'pilot');
  assert.deepEqual([pilot.damageA, pilot.damageB], [3, 3], 'sinkronizimi i dëmeve ruhet');
  assert.ok(pilot.handoverA && pilot.handoverB, 'asnjë dorëzim nuk preket');
  assert.deepEqual(pilot.team, [DAMAGE], 'dorëzimi dhe historiku nuk dalin nga pajisja');

  // 4. Një pajisje nën rregullin e pilotit, tjetra me dorëzimin të ndezur (p.sh. faqe e vjetër në memorie).
  const mixed = await scenario('4. A nën rregullin e pilotit, B me dorëzimin të ndezur', 'pilot', 'ticked');
  assert.ok(mixed.handoverA && mixed.handoverB, 'A nuk e merr dorëzimin e B-së dhe B mban të vetin');
  assert.deepEqual(mixed.team, [DAMAGE, HANDOVER].sort(), 'dorëzimi i B-së mbetet në kopjen e ekipit, pa u lexuar nga A');

  console.log('\nTë katër rastet dolën siç pritej.');
})().catch((error) => { console.error('DËSHTOI:', error.message); process.exit(1); });
