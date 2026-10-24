// Team sync (src/js/team-sync.js): the team code and what is derived from it, the sealed copy, the merge rules, what
// may leave the device, and whole syncs against a fake of the server's API (workers/sync/worker.js), including the
// 409 and 429 paths. The box section is the real partial rendered with Nunjucks.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nodeCrypto = require('node:crypto');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const part = read('src/_data/i18n-parts/team-sync.json');
const site = read('src/_data/site.json');
const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';

// jsdom has no WebCrypto, TextEncoder or compression streams: node's are handed in.
const give = (w, { compression = true } = {}) => {
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  if (compression) {
    w.CompressionStream = CompressionStream;
    w.DecompressionStream = DecompressionStream;
  }
};
const load = ({ url = 'https://stivencatalyst.com/tools.html', body = '', storage = {}, compression = true, before } = {}) => {
  const dom = new JSDOM(`<html lang="en"><body>${body}</body></html>`, { url, runScripts: 'outside-only' });
  const w = dom.window;
  give(w, { compression });
  w.confirm = () => true;
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  before?.(w);
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const M = load().TeamSyncMath;
const sha = (text) => nodeCrypto.createHash('sha256').update(text).digest('hex');

// ---- A fake of the sync server, the same API and answers as workers/sync/worker.js ----
const fakeServer = ({ rateLimit = false } = {}) => {
  const spaces = new Map();
  const log = [];
  let clock = 1_000_000;
  const hooks = { beforePut: null, putStatus: [] };
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  const fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    const match = /\/v1\/spaces\/([0-9a-f]{64})$/.exec(url);
    log.push({ method, url });
    if (!match) return reply(404, { error: 'not-found' });
    const id = match[1];
    const meta = spaces.get(id);
    if (method === 'GET') return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    const token = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
    if (!token) return reply(401, { error: 'token' });
    if (meta && meta.token !== token) return reply(403, { error: 'token' });
    if (method === 'DELETE') { spaces.delete(id); return reply(204); }
    if (hooks.beforePut) { const run = hooks.beforePut; hooks.beforePut = null; await run(id); }
    const forced = hooks.putStatus.shift();
    if (forced) return reply(forced, { error: 'forced' });
    const body = JSON.parse(init.body);
    if (typeof body.data !== 'string' || !/^[A-Za-z0-9+/=]{16,32}$/.test(body.iv) || !/^[A-Za-z0-9+/=]*$/.test(body.data)) return reply(400, { error: 'shape' });
    const current = spaces.get(id);
    const rev = current ? current.rev : 0;
    if (body.rev !== rev) return reply(409, { rev });
    clock += 5000;
    if (rateLimit && current && clock - current.updated < 1000) return reply(429, { error: 'slow-down' });
    spaces.set(id, { rev: rev + 1, updated: clock, iv: body.iv, data: body.data, token });
    return reply(200, { rev: rev + 1, updated: clock });
  };
  return { spaces, log, hooks, fetch };
};

// One device: its own browser (localStorage) and the team code.
const device = async (w, code = CODE) => ({ w, keys: await w.TeamSyncMath.deriveKeys(code, 1000) });
const run = (dev, server, extra = {}) => dev.w.TeamSync.syncOnce({
  endpoint: ENDPOINT, fetch: server.fetch, storage: dev.w.localStorage, keys: dev.keys,
  selected: (key) => dev.w.TeamSyncMath.isOn(dev.w.WorkBackup.toolSlug(key)), create: true, wait: async () => {}, ...extra,
});
const stored = (w, key) => JSON.parse(w.localStorage.getItem(key));
const teamCopy = async (server, dev) => {
  const box = server.spaces.get(dev.keys.spaceId);
  return plain(await dev.w.TeamSyncMath.unseal(box, dev.keys.key));
};

test('the word list and the team code: six of 1296 plain words, at least 60 bits, typed any way', () => {
  assert.equal(M.WORDS.length, 1296);
  assert.equal(new Set(M.WORDS).size, 1296);
  assert.ok(M.WORDS.every((word) => /^[a-z]{3,5}$/.test(word)), 'plain lowercase letters');
  assert.ok(M.BITS >= 60 && M.BITS < 63, `${M.BITS} bits`);
  const code = M.newCode();
  assert.match(code, /^[a-z]+(-[a-z]+){5}$/);
  assert.ok(M.parseCode(code).ok);
  // Values past the last whole multiple of 1296 are drawn again, so no word is likelier.
  const values = [65535, 64800, 0, 1, 1295, 1296, 2, 3];
  const fill = (array) => { array[0] = values.shift(); };
  assert.equal(M.newCode(fill), [M.WORDS[0], M.WORDS[1], M.WORDS[1295], M.WORDS[0], M.WORDS[2], M.WORDS[3]].join('-'));
  assert.equal(M.normalise('  Acid ACORN-acre\nacts.afar   affix '), CODE);
  const typo = plain(M.parseCode('acid acorn acre acts afar afix'));
  assert.equal(typo.ok, false);
  assert.deepEqual(typo.unknown, ['afix']);
  assert.equal(M.parseCode('acid acorn acre').ok, false);
});

test('keys: the space id and the write token are SHA-256 of the code, the key is PBKDF2 → AES-GCM, all deterministic', async () => {
  const w = load();
  const a = await w.TeamSyncMath.deriveKeys(CODE);
  assert.equal(a.spaceId, sha(`space:${CODE}`));
  assert.equal(a.writeToken, sha(`write:${CODE}`));
  assert.match(a.spaceId, /^[0-9a-f]{64}$/);
  assert.notEqual(a.spaceId, a.writeToken);
  const b = await w.TeamSyncMath.deriveKeys('ACID acorn acre acts afar affix');
  assert.equal(b.spaceId, a.spaceId);
  assert.equal(b.writeToken, a.writeToken);
  // Sealed with one derivation, opened with another of the same code.
  const payload = { format: 'stiven-catalyst-team', version: 1, sent: '2026-10-24T08:00:00.000Z', device: { id: 'abc123', name: '' }, items: { 'sc-actions': '{"rows":[]}' } };
  const box = await w.TeamSyncMath.seal(payload, a.key);
  assert.deepEqual(plain(await w.TeamSyncMath.unseal(box, b.key)), payload);
  // The parameters are exactly the documented ones: node derives the same key on its own and opens the box.
  const raw = nodeCrypto.pbkdf2Sync(CODE, 'stiven-catalyst-sync-v1', 310000, 32, 'sha256');
  const bytes = Buffer.from(box.data, 'base64');
  const decipher = nodeCrypto.createDecipheriv('aes-256-gcm', raw, Buffer.from(box.iv, 'base64'));
  decipher.setAuthTag(bytes.subarray(bytes.length - 16));
  const body = Buffer.concat([decipher.update(bytes.subarray(0, bytes.length - 16)), decipher.final()]);
  assert.equal(body[0], 1, 'flagged as gzip');
  assert.deepEqual(JSON.parse(require('node:zlib').gunzipSync(body.subarray(1)).toString('utf8')), payload);
  // Another code cannot open it.
  const other = await w.TeamSyncMath.deriveKeys('zesty zippy zone zoom yacht amino');
  assert.notEqual(other.spaceId, a.spaceId);
  await assert.rejects(() => w.TeamSyncMath.unseal(box, other.key));
});

test('seal → unseal: a fresh 12-byte IV each time, gzip when the browser has it, plain JSON when not, damage refused', async () => {
  const w = load();
  const { key } = await w.TeamSyncMath.deriveKeys(CODE, 1000);
  const payload = { format: 'stiven-catalyst-team', version: 1, sent: '', device: { id: 'd1', name: 'Phone of Ana' }, items: { 'sc-night-audit': JSON.stringify({ rows: Array.from({ length: 200 }, (_, i) => ({ id: `r${i}`, note: 'Room checked, minibar refilled' })) }) } };
  const one = await w.TeamSyncMath.seal(payload, key);
  const two = await w.TeamSyncMath.seal(payload, key);
  assert.equal(one.iv.length, 16);
  assert.equal(Buffer.from(one.iv, 'base64').length, 12);
  assert.notEqual(one.iv, two.iv);
  assert.notEqual(one.data, two.data);
  assert.deepEqual(plain(await w.TeamSyncMath.unseal(one, key)), payload);
  // Without CompressionStream: flagged plain, smaller gain, same content; a device with gzip reads it.
  const bare = load({ compression: false });
  const flat = await bare.TeamSyncMath.seal(payload, key);
  assert.ok(flat.data.length > one.data.length * 3, 'gzip shrinks a log a lot');
  assert.deepEqual(plain(await w.TeamSyncMath.unseal(flat, key)), payload);
  // One changed character of the ciphertext: AES-GCM refuses it.
  const bytes = Buffer.from(one.data, 'base64');
  bytes[5] ^= 1;
  await assert.rejects(() => w.TeamSyncMath.unseal({ iv: one.iv, data: bytes.toString('base64') }, key));
});

test('merge: keys and rows one side lacks are kept; rows by id; rows without id by content', () => {
  const log = (rows, extra = {}) => JSON.stringify({ ...extra, rows });
  const out = plain(M.merge(
    { 'sc-actions': log([{ id: 'a', title: 'Fix dock door' }, { id: 'b', title: 'Label racks' }]), 'sc-only-here': '{"x":1}' },
    { 'sc-actions': log([{ id: 'c', title: 'Order gloves' }, { id: 'a', title: 'Fix dock door' }]), 'sc-only-there': '{"y":2}' },
  ));
  assert.deepEqual(Object.keys(out).sort(), ['sc-actions', 'sc-only-here', 'sc-only-there']);
  assert.deepEqual(JSON.parse(out['sc-actions']).rows.map((row) => row.id), ['a', 'b', 'c'], 'this device\'s order, then the new ones');
  // Rows without id: the same row once, the different ones both.
  const noId = JSON.parse(M.mergeValue(log([{ date: '2026-10-20', units: 3 }, { date: '2026-10-21', units: 1 }]), log([{ date: '2026-10-21', units: 1 }, { date: '2026-10-22', units: 4 }])));
  assert.deepEqual(noId.rows, [{ date: '2026-10-20', units: 3 }, { date: '2026-10-21', units: 1 }, { date: '2026-10-22', units: 4 }]);
  // A duplicated id on one side stays once.
  assert.deepEqual(JSON.parse(M.mergeValue(log([{ id: 'a', n: 1 }, { id: 'a', n: 1 }]), log([]))).rows, [{ id: 'a', n: 1 }]);
  // Numeric ids count as ids.
  assert.deepEqual(JSON.parse(M.mergeValue(log([{ id: 1, n: 1 }]), log([{ id: 1, n: 1 }, { id: 2, n: 2 }]))).rows.map((r) => r.id), [1, 2]);
  // A side with no log at all (or no rows) loses nothing of the other.
  assert.deepEqual(JSON.parse(M.mergeValue('{"filter":"all"}', log([{ id: 'z' }]))).rows, [{ id: 'z' }]);
  assert.equal(M.merge({}, {})['sc-x'], undefined);
});

test('merge: the same row changed on both sides, newest by updated / closed / created, else the team copy', () => {
  const log = (row) => JSON.stringify({ rows: [row] });
  const pickedTitle = (local, remote, base) => JSON.parse(M.mergeValue(log(local), log(remote), base)).rows[0].title;
  assert.equal(pickedTitle({ id: 'a', title: 'mine', updated: '2026-10-24T09:00:00Z' }, { id: 'a', title: 'theirs', updated: '2026-10-24T08:00:00Z' }), 'mine');
  assert.equal(pickedTitle({ id: 'a', title: 'mine', updated: '2026-10-24T07:00:00Z' }, { id: 'a', title: 'theirs', updated: '2026-10-24T08:00:00Z' }), 'theirs');
  assert.equal(pickedTitle({ id: 'a', title: 'mine', updated: 1700000002000 }, { id: 'a', title: 'theirs', updated: 1700000001000 }), 'mine', 'numbers too');
  // No "updated": a closed row is newer than an open one, then the later closing date.
  assert.equal(pickedTitle({ id: 'a', title: 'mine', created: '2026-10-01', closed: '2026-10-20' }, { id: 'a', title: 'theirs', created: '2026-10-01', closed: '' }), 'mine');
  assert.equal(pickedTitle({ id: 'a', title: 'mine', closed: '2026-10-20' }, { id: 'a', title: 'theirs', closed: '2026-10-22' }), 'theirs');
  assert.equal(pickedTitle({ id: 'a', title: 'mine', created: '2026-10-21' }, { id: 'a', title: 'theirs', created: '2026-10-20' }), 'mine');
  // Nothing to tell them apart: a true conflict goes to the team's copy.
  assert.equal(pickedTitle({ id: 'a', title: 'mine', created: '2026-10-20' }, { id: 'a', title: 'theirs', created: '2026-10-20' }), 'theirs');
  assert.equal(pickedTitle({ id: 'a', title: 'mine' }, { id: 'a', title: 'theirs' }), 'theirs');
  // With what was last synced: the side that did not change the row gives way, whatever the dates say.
  const synced = { id: 'a', title: 'before', created: '2026-10-20' };
  const base = M.baseOf({ k: log(synced) }).k;
  assert.equal(pickedTitle({ id: 'a', title: 'mine', created: '2026-10-20' }, synced, base), 'mine', 'only this device changed it');
  assert.equal(pickedTitle(synced, { id: 'a', title: 'theirs', created: '2026-10-20' }, base), 'theirs', 'only the team changed it');
  assert.equal(pickedTitle({ id: 'a', title: 'mine', created: '2026-10-20' }, { id: 'a', title: 'theirs', created: '2026-10-20' }, base), 'theirs', 'both: the team copy');
});

test('merge: the other fields of a log are this device\'s unless empty here', () => {
  const out = JSON.parse(M.mergeValue(
    JSON.stringify({ rows: [], target: 2, draft: '', view: {}, owner: null, tags: [] }),
    JSON.stringify({ rows: [], target: 5, draft: 'Shift B note', view: { range: '7' }, owner: 'Ana', tags: ['a'], extra: true }),
  ));
  assert.deepEqual(out, { rows: [], target: 2, draft: 'Shift B note', view: { range: '7' }, owner: 'Ana', tags: ['a'], extra: true });
});

test('merge: plain objects field by field, the team\'s value only where this device has not changed it since the last sync', () => {
  const synced = JSON.stringify({ areas: ['Dock'], shifts: ['Early'], target: 2 });
  const base = M.baseOf({ 'sc-workplace': synced })['sc-workplace'];
  const local = JSON.stringify({ areas: ['Dock', 'Yard'], shifts: ['Early'], target: 2 });
  const remote = JSON.stringify({ areas: ['Dock'], shifts: ['Early', 'Late'], target: 3, teams: ['A'] });
  assert.deepEqual(JSON.parse(M.mergeValue(local, remote, base)), { areas: ['Dock', 'Yard'], shifts: ['Early', 'Late'], target: 3, teams: ['A'] });
  // Both changed the same field: this device's stays.
  assert.deepEqual(JSON.parse(M.mergeValue(JSON.stringify({ target: 4 }), JSON.stringify({ target: 3 }), base)), { target: 4 });
  // Never synced: this device's fields win, the team's new fields come in, nothing is deleted.
  assert.deepEqual(JSON.parse(M.mergeValue(local, remote)), { areas: ['Dock', 'Yard'], shifts: ['Early'], target: 2, teams: ['A'] });
  assert.deepEqual(JSON.parse(M.mergeValue(JSON.stringify({ a: 1 }), JSON.stringify({ b: 2 }), M.baseOf({ k: JSON.stringify({ a: 1, b: 2 }) }).k)), { a: 1, b: 2 }, 'a field one side lacks is never dropped');
  // Values that are not objects: whole, the team's when this device has not changed it.
  const wordBase = M.baseOf({ k: 'two' }).k;
  assert.equal(M.mergeValue('two', 'one', wordBase), 'one');
  assert.equal(M.mergeValue('three', 'one', wordBase), 'three');
  assert.equal(M.mergeValue('three', 'one'), 'three');
  assert.equal(M.mergeValue('[1,2]', '{"rows":[]}'), '[1,2]', 'a different shape is not merged');
  assert.equal(M.mergeValue('not json', 'other'), 'not json');
});

test('merge: an unchanged text stays the very same string, and merging again changes nothing', () => {
  const local = '{ "rows": [ {"id":"a","n":1} ] }';
  assert.equal(M.mergeValue(local, '{"rows":[{"id":"a","n":1}]}'), local, 'not written again because of spacing');
  const a = { 'sc-actions': JSON.stringify({ rows: [{ id: 'a', title: 'x' }, { id: 'b', title: 'y' }] }), 'sc-workplace': '{"areas":["Dock"]}' };
  const b = { 'sc-actions': JSON.stringify({ rows: [{ id: 'c', title: 'z' }] }), 'sc-workplace': '{"shifts":["Late"]}' };
  const once = M.merge(a, b);
  const base = M.baseOf(once);
  assert.deepEqual(plain(M.merge(once, once, base)), plain(once));
  assert.deepEqual(plain(M.merge(once, b, base)), plain(once), 'an older team copy takes nothing back');
  assert.deepEqual(plain(M.changedSince(once, base)), []);
  assert.deepEqual(plain(M.changedSince({ ...once, 'sc-workplace': '{}' }, base)), ['sc-workplace']);
});

test('what is offered: work keys of the tools, never this module\'s own, the career tools, the shelf, reading or coaching', () => {
  const w = load();
  for (const key of ['sc-actions', 'sc-workplace', 'sc-annotations', 'sc-night-audit-de', 'sc-damage-control-sq-check', 'sc-five-whys', 'sc-oee'])
    assert.ok(w.TeamSyncMath.offerable(key), key);
  for (const key of ['sc-team', 'sc-team-state', 'sc-theme', 'sc-print-guide-hidden', 'sc-cv-builder', 'sc-cv-builder-de', 'sc-ats-cv', 'sc-cover-letter-sq', 'sc-shelf', 'sc-reading', 'sc-checklists', 'sc-coaching-v1', 'sc-book-view', 'sc-audio-weekly', 'sc-listen-rate', 'sc-import-maps', 'sc-actions-ui', 'other'])
    assert.ok(!w.TeamSyncMath.offerable(key), key);
  // Ticked by default: the action list, the workplace, the timeline events and the logs, in every language.
  const on = (key) => w.TeamSyncMath.isOn(w.WorkBackup.toolSlug(key));
  for (const key of ['sc-actions', 'sc-workplace', 'sc-annotations', 'sc-damage-control', 'sc-night-audit-sq', 'sc-delay-analyzer-de', 'sc-sigma-chart', 'sc-incomplete-control']) assert.ok(on(key), key);
  for (const key of ['sc-five-whys', 'sc-oee', 'sc-pareto']) assert.ok(!on(key), key);
  assert.equal(w.TeamSyncMath.isOn('pareto', { pareto: true }), true);
  assert.equal(w.TeamSyncMath.isOn('action-tracker', { 'action-tracker': false }), false);
  // The team code is not work: a saved file never carries it.
  assert.ok(!w.WorkBackup.isWork('sc-team') && !w.WorkBackup.isWork('sc-team-state'));
  w.localStorage.setItem('sc-team', JSON.stringify({ code: CODE }));
  w.localStorage.setItem('sc-pareto', '{}');
  assert.deepEqual(Object.keys(plain(w.WorkBackup.makeBackup(w.localStorage)).items), ['sc-pareto']);
});

test('the payload never holds a skipped or personal key, and a team copy cannot plant one here', async () => {
  const personal = { 'sc-team-state': { deviceId: 'abcd1234' }, 'sc-theme': 'dark', 'sc-cv-builder': { name: 'Ana' }, 'sc-ats-cv-de': {}, 'sc-cover-letter': {}, 'sc-shelf': [], 'sc-reading': {}, 'sc-checklists': {}, 'sc-coaching-v1': {}, 'sc-book-view': 'two', 'sc-actions-ui': {}, 'sc-import-maps': {} };
  const w = load({ storage: { 'sc-team': { code: CODE }, ...personal, 'sc-actions': { rows: [{ id: 'a1', title: 'Fix dock door' }] }, 'sc-night-audit': { rows: [] }, 'sc-pareto': {} } });
  const server = fakeServer();
  const dev = await device(w);
  // Even with every tool ticked.
  const result = await run(dev, server, { selected: () => true });
  assert.equal(result.status, 'synced');
  const copy = await teamCopy(server, dev);
  assert.equal(copy.format, 'stiven-catalyst-team');
  assert.equal(copy.version, 1);
  assert.deepEqual(Object.keys(copy.items).sort(), ['sc-actions', 'sc-night-audit', 'sc-pareto']);
  assert.ok(!JSON.stringify(copy).includes(CODE), 'the code is not in the payload');
  // A copy that carries personal or skipped keys (made by hand): they are dropped on reading, never written here.
  const evil = { format: 'stiven-catalyst-team', version: 1, sent: '', device: { id: 'eeee1111', name: '' }, devices: [], items: { 'sc-cv-builder': '{"name":"Mallory"}', 'sc-team': '{"code":"x"}', 'sc-theme': 'light', 'sc-actions': 'garbage', 'sc-pareto': '{"from":"team"}' } };
  const box = await w.TeamSyncMath.seal(evil, dev.keys.key);
  const meta = server.spaces.get(dev.keys.spaceId);
  server.spaces.set(dev.keys.spaceId, { ...meta, ...box });
  const other = load({ storage: { 'sc-cv-builder': { name: 'Ana' } } });
  const result2 = await run(await device(other), server, { selected: () => true });
  assert.equal(result2.status, 'synced');
  assert.deepEqual(stored(other, 'sc-cv-builder'), { name: 'Ana' });
  assert.equal(other.localStorage.getItem('sc-theme'), null);
  assert.equal(other.localStorage.getItem('sc-team'), null);
  assert.equal(other.localStorage.getItem('sc-actions'), null, 'a damaged log is not taken');
  assert.deepEqual(stored(other, 'sc-pareto'), { from: 'team' });
});

test('a full sync between two devices: rows meet, only changed keys are written, after a restore point', async () => {
  const server = fakeServer();
  const a = await device(load({ storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Fix dock door', created: '2026-10-20', closed: '' }] }, 'sc-workplace': { areas: ['Dock'] }, 'sc-team-state': { deviceName: 'Phone of Ana' } } }));
  const first = await run(a, server);
  assert.equal(first.status, 'synced');
  assert.equal(first.rev, 1);
  assert.equal(first.uploaded, true);
  assert.deepEqual(plain(first.changed), []);
  // The second device has its own action and a night audit log.
  const bWindow = load({ storage: { 'sc-actions': { rows: [{ id: 'b1', title: 'Order gloves', created: '2026-10-21', closed: '' }] }, 'sc-night-audit': { rows: [{ date: '2026-10-23', note: 'All rooms checked' }] }, 'sc-five-whys': { q: 'mine' } } });
  const b = await device(bWindow);
  const writes = [];
  const realSet = bWindow.Storage.prototype.setItem;
  bWindow.Storage.prototype.setItem = function setItem(key, value) { if (!key.startsWith('sc-team')) writes.push(key); return realSet.call(this, key, value); };
  const points = [];
  const second = await run(b, server, { beforeWrite: async (keys) => { points.push([...keys], writes.length); } });
  assert.equal(second.status, 'synced');
  assert.equal(second.rev, 2);
  assert.deepEqual(plain(second.changed).sort(), ['sc-actions', 'sc-workplace']);
  assert.deepEqual(points, [['sc-actions', 'sc-workplace'], 0], 'the restore point comes before any write');
  assert.deepEqual(writes.sort(), ['sc-actions', 'sc-workplace'], 'only the changed keys');
  assert.deepEqual(stored(bWindow, 'sc-actions').rows.map((row) => row.id), ['b1', 'a1']);
  assert.deepEqual(stored(bWindow, 'sc-workplace'), { areas: ['Dock'] });
  const copy = await teamCopy(server, b);
  assert.deepEqual(Object.keys(copy.items).sort(), ['sc-actions', 'sc-night-audit', 'sc-workplace'], 'five whys is not ticked by default');
  assert.equal(copy.devices.length, 2);
  assert.equal(copy.devices[0].id, plain(stored(bWindow, 'sc-team-state')).deviceId, 'this device first');
  assert.equal(copy.devices[1].name, 'Phone of Ana');
  // Back on the first device: B's rows arrive; the state says what was seen.
  const third = await run(a, server);
  assert.equal(third.status, 'synced');
  assert.deepEqual(stored(a.w, 'sc-actions').rows.map((row) => row.id), ['a1', 'b1']);
  assert.deepEqual(stored(a.w, 'sc-night-audit').rows, [{ date: '2026-10-23', note: 'All rooms checked' }]);
  const state = stored(a.w, 'sc-team-state');
  assert.equal(state.rev, third.rev);
  assert.ok(state.size > 0 && state.lastSync);
  assert.equal(state.devices.length, 2);
  // Nothing new anywhere: no upload, no write.
  const quiet = await run(a, server);
  assert.equal(quiet.status, 'synced');
  assert.equal(quiet.uploaded, false);
  assert.deepEqual(plain(quiet.changed), []);
  assert.equal(server.spaces.get(a.keys.spaceId).rev, third.rev);
  // A changes a field B never touched since the last sync; B takes it, and B's own edit to another field stays.
  a.w.localStorage.setItem('sc-workplace', JSON.stringify({ areas: ['Dock', 'Yard'] }));
  await run(a, server);
  bWindow.localStorage.setItem('sc-workplace', JSON.stringify({ areas: ['Dock'], shifts: ['Late'] }));
  await run(b, server);
  assert.deepEqual(stored(bWindow, 'sc-workplace'), { areas: ['Dock', 'Yard'], shifts: ['Late'] });
});

test('409: another device saved between the GET and the PUT; the sync runs once more from the GET and keeps both', async () => {
  const server = fakeServer();
  const a = await device(load({ storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Fix dock door' }] } } }));
  await run(a, server);
  const b = await device(load({ storage: { 'sc-actions': { rows: [{ id: 'b1', title: 'Order gloves' }] } } }));
  // While B is about to save, A saves a new action.
  server.hooks.beforePut = async () => {
    a.w.localStorage.setItem('sc-actions', JSON.stringify({ rows: [{ id: 'a1', title: 'Fix dock door' }, { id: 'a2', title: 'Sweep bay 4' }] }));
    assert.equal((await run(a, server)).status, 'synced');
  };
  const result = await run(b, server);
  assert.equal(result.status, 'synced');
  const puts = server.log.filter((entry) => entry.method === 'PUT').length;
  assert.equal(puts, 4, 'A first, A in between, B refused, B again');
  assert.deepEqual((await teamCopy(server, b)).items['sc-actions'] && JSON.parse((await teamCopy(server, b)).items['sc-actions']).rows.map((row) => row.id).sort(), ['a1', 'a2', 'b1']);
  // Two refusals in a row: it stops and says so.
  b.w.localStorage.setItem('sc-actions', JSON.stringify({ rows: [{ id: 'b1', title: 'Order gloves' }, { id: 'b2', title: 'New' }] }));
  server.hooks.putStatus.push(409, 409);
  assert.equal((await run(b, server)).status, 'conflict');
});

test('429: waits 2 s and tries once more; offline, gone, refused and unreadable say so and change nothing', async () => {
  const server = fakeServer();
  const a = await device(load({ storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Fix dock door' }] } } }));
  const waits = [];
  server.hooks.putStatus.push(429);
  const slow = await run(a, server, { wait: async (ms) => { waits.push(ms); } });
  assert.equal(slow.status, 'synced');
  assert.deepEqual(waits, [2000]);
  a.w.localStorage.setItem('sc-actions', JSON.stringify({ rows: [{ id: 'a1', title: 'Fix dock door' }, { id: 'a2', title: 'x' }] }));
  server.hooks.putStatus.push(429, 429);
  assert.equal((await run(a, server)).status, 'busy');
  // No connection.
  const offline = await run(a, { fetch: async () => { throw new TypeError('Failed to fetch'); } });
  assert.equal(offline.status, 'offline');
  // The copy was deleted after this device synced: it does not start a new one by itself.
  server.spaces.clear();
  assert.equal((await run(a, server, { create: false })).status, 'gone');
  assert.equal(server.spaces.size, 0);
  assert.equal((await run(a, server, { create: true })).status, 'synced', '"Send this device\'s work again"');
  // A token the space does not know.
  const meta = server.spaces.get(a.keys.spaceId);
  server.spaces.set(a.keys.spaceId, { ...meta, token: 'f'.repeat(64) });
  a.w.localStorage.setItem('sc-pareto', '{}');
  const refused = await run(a, server, { selected: () => true });
  assert.equal(refused.status, 'refused');
  // A copy sealed with another key: nothing is written here.
  const before = a.w.localStorage.getItem('sc-actions');
  const otherKey = (await a.w.TeamSyncMath.deriveKeys('zesty zippy zone zoom yacht amino', 1000)).key;
  server.spaces.set(a.keys.spaceId, { ...meta, ...(await a.w.TeamSyncMath.seal({ format: 'stiven-catalyst-team', version: 1, items: { 'sc-actions': '{"rows":[]}' } }, otherKey)) });
  assert.equal((await run(a, server)).status, 'unreadable');
  assert.equal(a.w.localStorage.getItem('sc-actions'), before);
  // The team copy is deleted with the token.
  server.spaces.set(a.keys.spaceId, meta);
  assert.equal(await a.w.TeamSync.deleteCopy({ endpoint: ENDPOINT, fetch: server.fetch, keys: a.keys }), 'deleted');
  assert.equal(server.spaces.size, 0);
});

test('a restore point before a team sync writes: its own reason, kept apart so it never pushes out one made by hand', () => {
  const G = load().StorageGuardMath;
  assert.ok(G.REASONS.includes('before-sync'));
  const at = (i, reason) => G.parseId(G.pointId(new Date(Date.UTC(2026, 9, 1 + i, 6)).toISOString(), reason));
  const points = [...Array.from({ length: 8 }, (_, i) => at(i, 'before-sync')), at(0, 'manual'), at(1, 'before-open')];
  const dropped = plain(G.prune(points));
  assert.deepEqual(dropped.sort(), [at(0, 'before-sync').id, at(1, 'before-sync').id, at(2, 'before-sync').id].sort());
});

test('devices: this device first, then by last seen, ten at most; a recent visit does not upload again', () => {
  const list = Array.from({ length: 12 }, (_, i) => ({ id: `dev${String(i).padStart(2, '0')}`, name: '', seen: `2026-10-${String(10 + i).padStart(2, '0')}T08:00:00.000Z` }));
  const now = new Date('2026-10-24T09:00:00Z');
  const out = plain(M.withDevice(list, { id: 'mine1234', name: 'Phone of Ana' }, now));
  assert.equal(out.length, 10);
  assert.deepEqual(out[0], { id: 'mine1234', name: 'Phone of Ana', seen: '2026-10-24T09:00:00.000Z' });
  assert.equal(out[1].seen, '2026-10-19T08:00:00.000Z');
  assert.ok(M.deviceFresh(out, { id: 'mine1234', name: 'Phone of Ana' }, new Date('2026-10-24T20:00:00Z')));
  assert.ok(!M.deviceFresh(out, { id: 'mine1234', name: 'Phone of Ana' }, new Date('2026-10-25T10:00:00Z')), 'a day later');
  assert.ok(!M.deviceFresh(out, { id: 'mine1234', name: 'Laptop' }, now), 'a new name');
});

const QR_GOLDEN = {
  "acid-acorn-acre-acts-afar-affix": { version: 3, mask: 7, rows: ["1fc6467f", "104f1541", "17426c5d", "174d965d", "1749045d", "10553241", "1fd5557f", "0007bd00", "12d952a0", "0691bcc3", "097bee3e", "0886914c", "1a516cc0", "1fa8f30e", "1a73c85b", "08a42fd1", "1cde8a88", "0eaef0cf", "17f574cf", "07324e59", "124831f5", "001e6b1b", "1fc20952", "10566115", "174b29f2", "17590afd", "1749801d", "104f6b72", "1fdb6992"] },
  "012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789": { version: 7, mask: 2, rows: ["1fc34822797f", "1045b09e8a41", "175d1da1fa5d", "1753275a4b5d", "1750e9f0675d", "1050b91fa041", "1fd55555557f", "001bc315fd00", "17ca5bfaca7c", "141546224927", "0b47301fa7cc", "049a74b1fc94", "1ecf967202a8", "17a779227937", "1d4713de85c0", "02147c91f895", "1359447a4a68", "023909205907", "1cd5079f86c8", "1195a4a1fb96", "0ff1b7f6c3f8", "0d149b124b17", "1d54e75fa55c", "1915dd11fd14", "0dfc27f203f8", "11a75e5179e7", "1370482c8620", "161b5b11fbc4", "11ee058a8999", "1f92ce5059a7", "0fd9602f8618", "01b338d1fbe6", "1250b396c098", "1e371a726a6f", "015e912f8404", "0f0f0f51fbc4", "134cd9fe0df8", "0013af117917", "1fcd075c8750", "1056e911fb16", "175959fa89f9", "175dc9a35a97", "1758665c85ea", "104433213924", "1fdeb01640ca"] },
  "hello": { version: 1, mask: 3, rows: ["1fd07f", "105041", "174a5d", "17555d", "174e5d", "104f41", "1fd57f", "001f00", "16eb4b", "1d27cd", "1bda03", "1a8e7a", "0a7921", "001644", "1fd720", "10543e", "1741ff", "17565e", "175164", "1040b1", "1fdca4"] },
};

test('the QR code matches a reference encoder (byte mode, level M), and is drawn as SVG with its quiet zone', () => {
  // The reference matrices were made with segno 1.6 (error "m", mode "byte", the same mask).
  for (const [text, golden] of Object.entries(QR_GOLDEN)) {
    const qr = M.qrEncode(text, golden.mask);
    assert.equal(qr.version, golden.version, text);
    const size = golden.version * 4 + 17;
    const rows = plain(qr.matrix).map((row) => BigInt(`0b${row.join('')}`).toString(16).padStart(Math.ceil(size / 4), '0'));
    assert.deepEqual(rows, golden.rows, text);
  }
  // A team code fits a small symbol; the mask is chosen by the standard's penalty, and any choice reads the same.
  const auto = M.qrEncode(M.newCode());
  assert.ok(auto.version <= 3 && auto.mask >= 0 && auto.mask < 8);
  assert.equal(M.qrEncode('x'.repeat(213)).version, 10);
  assert.equal(M.qrEncode('x'.repeat(214)), null, 'beyond version 10 at level M');
  const svg = M.qrSvg(M.qrEncode('hello', 3).matrix, 'QR "code"');
  assert.match(svg, /^<svg [^>]*viewBox="0 0 29 29"[^>]*aria-label="QR &quot;code&quot;"/);
  assert.match(svg, /<rect width="29" height="29" fill="#fff"\/><path d="M4 4h7v1h-7z/);
});

// ---- The section in the box ----
const render = (lang, withSite = true) => {
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
  const missing = new Set();
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => { if (lang !== 'en' && ui[text] === undefined) missing.add(text); return lang === 'en' ? text : ui[text] ?? text; });
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value)));
  const html = env.render('partials/work-backup.njk', { lang, site: withSite ? { sync: { endpoint: ENDPOINT } } : {}, tools: read('src/_data/tools.json'), de: { tools: read('src/_data/de/tools.json') }, sq: { tools: read('src/_data/sq/tools.json') } });
  return { html: html.replace(/<script src=[^>]*><\/script>/g, ''), scripts: [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]), missing: [...missing] };
};

test('the section shows only with an endpoint, after the box scripts, and every text is translated', () => {
  const on = render('en');
  assert.match(on.html, /data-team-sync data-endpoint="https:\/\/sync\.example\.test"/);
  assert.deepEqual(on.scripts, ['/js/storage-guard.js', '/js/work-backup.js', '/js/team-sync.js']);
  const off = render('en', false);
  assert.doesNotMatch(off.html, /data-team-sync/);
  assert.deepEqual(off.scripts, ['/js/storage-guard.js', '/js/work-backup.js']);
  for (const lang of ['de', 'sq']) assert.deepEqual(render(lang).missing, [], lang);
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  assert.equal(site.sync.endpoint, 'https://stiven-catalyst-sync.stivenjanaqi1.workers.dev');
  // The Content Security Policy lets the tools and the Tools page reach the server, and only them: the line of
  // base.njk that sets it, rendered with the filters as eleventy.config.js defines them.
  const line = fs.readFileSync('src/_includes/layouts/base.njk', 'utf8').match(/\{%- set csp = [^\n]*-%\}/)[0];
  const env = new nunjucks.Environment(null, { autoescape: false });
  env.addFilter('cspHash', () => "'sha256-x'");
  env.addFilter('originOf', (url) => { try { return new URL(url).origin; } catch { return ''; } });
  env.addFilter('enPath', (url) => String(url || '').replace(/^\/(de|sq)(?=\/)/, ''));
  const csp = (url, toolFamily, rolePage = false, sync = site.sync) => env.renderString(`${line}{{ csp }}`, { page: { url }, toolFamily, rolePage, site: { ...site, sync }, themeScript: '', speculationRules: '', coachingLoader: '', analyticsToken: '' });
  const origin = 'https://stiven-catalyst-sync.stivenjanaqi1.workers.dev';
  const connect = (policy) => policy.match(/connect-src ([^;]*)/)[1].split(' ');
  for (const [url, family] of [['/tools/pareto/', 'pulse'], ['/sq/tools/night-audit/', 'zenith'], ['/tools.html', null], ['/de/tools.html', null]]) assert.ok(connect(csp(url, family)).includes(origin), url);
  for (const [url, family, role] of [['/', null, false], ['/insights/kpis/', null, false], ['/roles/shift-lead/', 'pulse', true]]) assert.ok(!connect(csp(url, family, role)).includes(origin), url);
  assert.ok(!connect(csp('/tools/pareto/', 'pulse', false, { endpoint: '' })).includes(origin), 'no endpoint, no origin');
  const privacy = fs.readFileSync('src/datenschutz.njk', 'utf8');
  assert.equal((privacy.match(/\{%- if site\.sync\.endpoint %\}\n  <p>(Team-Synchronisierung|Sinkronizimi i ekipit|Team sync):/g) || []).length, 3);
  assert.equal((privacy.match(/180/g) || []).length >= 3, true);
});

test('in the box: start a team, the code once with a QR, a first sync; the status line; leave', async (t) => {
  const server = fakeServer();
  const w = load({
    url: 'https://stivencatalyst.com/tools.html',
    body: render('en').html,
    storage: { 'sc-actions': { rows: [{ id: 'a1', title: 'Fix dock door' }] }, 'sc-cv-builder': { name: 'Ana' } },
    before: (win) => { win.fetch = server.fetch; },
  });
  // The box checks for idle changes every few seconds; the window goes with the test.
  t.after(() => w.close());
  const doc = w.document;
  const $ = (selector) => doc.querySelector(selector);
  assert.equal($('[data-tm-summary]').textContent, 'Off');
  assert.equal($('[data-tm-on]').hidden, true);
  // Joining with a mistyped code says what is wrong; a code nobody uses joins nothing.
  $('[data-tm-join-code]').value = 'acid acorn acre acts afar afix';
  $('[data-tm-join]').click();
  assert.match($('[data-tm-message]').textContent, /Check these words of the code: afix\./);
  $('[data-tm-join-code]').value = 'acid acorn acre';
  $('[data-tm-join]').click();
  assert.match($('[data-tm-message]').textContent, /A team code is 6 words/);
  $('[data-tm-join-code]').value = CODE;
  $('[data-tm-join]').click();
  for (let i = 0; i < 100 && !/No team/.test($('[data-tm-message]').textContent); i++) await new Promise((r) => setTimeout(r, 20));
  assert.match($('[data-tm-message]').textContent, /No team uses this code/);
  assert.equal(w.localStorage.getItem('sc-team'), null);
  // Start.
  $('[data-tm-start]').click();
  const code = JSON.parse(w.localStorage.getItem('sc-team')).code;
  assert.ok(w.TeamSyncMath.parseCode(code).ok);
  assert.equal($('[data-tm-code]').textContent, code);
  assert.match($('[data-tm-qr]').innerHTML, /^<svg/);
  for (let i = 0; i < 300 && !/^Synced/.test($('[data-tm-status]').textContent); i++) await new Promise((r) => setTimeout(r, 20));
  assert.match($('[data-tm-status]').textContent, /^Synced today \d\d:\d\d · version 1 · \d+ KB · 1 device\.$/);
  assert.match($('[data-tm-summary]').textContent, /^On · synced today/);
  assert.equal(server.spaces.size, 1);
  // The tools offered: the action list, ticked; never the CV.
  const boxes = [...doc.querySelectorAll('[data-tm-tools] input')];
  assert.deepEqual(boxes.map((box) => [box.dataset.slug, box.checked]), [['action-tracker', true]]);
  assert.match($('[data-tm-devices]').textContent, /^Devices: this device\.$/);
  // Offline: said in words.
  w.fetch = async () => { throw new TypeError('offline'); };
  $('[data-tm-sync]').click();
  for (let i = 0; i < 100 && !/No connection/.test($('[data-tm-status]').textContent); i++) await new Promise((r) => setTimeout(r, 20));
  assert.match($('[data-tm-status]').textContent, /^No connection: your work is safe here; it will sync later\. Last synced today/);
  // Leave: the code is gone, the work stays.
  $('[data-tm-leave]').click();
  assert.equal(w.localStorage.getItem('sc-team'), null);
  assert.ok(w.localStorage.getItem('sc-actions'));
  assert.equal($('[data-tm-off]').hidden, false);
  assert.equal($('[data-tm-new]').hidden, true, 'the code is not shown again');
});

test('the stylesheet is balanced and keeps to the brand colours', () => {
  const css = fs.readFileSync('src/css/40-team-sync.css', 'utf8');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((stripped.match(/\{/g) || []).length, (stripped.match(/\}/g) || []).length);
  assert.doesNotMatch(css, /--red|--gold/);
});
