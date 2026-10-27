// Team sync keys (src/js/team-sync.js): the space id and the write token the server sees come from the team code
// through PBKDF2 with a salt of their own, never from one SHA-256 of it, so a guess of the code costs a guesser who
// holds a space id as much as one who holds the copy. A team made before (its space at the SHA-256 id) keeps working:
// it is read there, moved to the new id at the next sync, and the old space is deleted.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nodeCrypto = require('node:crypto');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const ENDPOINT = 'https://sync.example.test';
const CODE = 'acid-acorn-acre-acts-afar-affix';
const sha = (text) => nodeCrypto.createHash('sha256').update(text).digest('hex');
const pbkdf2 = (code, salt, iterations, bytes) => nodeCrypto.pbkdf2Sync(code, salt, iterations, bytes, 'sha256');

const load = (storage = {}) => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://stivencatalyst.com/tools.html', runScripts: 'outside-only' });
  const w = dom.window;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  w.TextEncoder = TextEncoder;
  w.TextDecoder = TextDecoder;
  w.CompressionStream = CompressionStream;
  w.DecompressionStream = DecompressionStream;
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const fakeServer = () => {
  const spaces = new Map();
  const log = [];
  const reply = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => (body === undefined ? null : JSON.parse(JSON.stringify(body))) });
  const fetch = async (url, init = {}) => {
    const method = init.method || 'GET';
    const match = /\/v1\/spaces\/([0-9a-f]{64})$/.exec(url);
    log.push(`${method} ${match ? match[1] : url}`);
    if (!match) return reply(404, { error: 'not-found' });
    const meta = spaces.get(match[1]);
    if (method === 'GET') return meta ? reply(200, { rev: meta.rev, updated: 1, iv: meta.iv, data: meta.data }) : reply(404, { error: 'empty' });
    const token = (/^Bearer ([0-9a-f]{64})$/.exec(init.headers?.Authorization || '') || [])[1];
    if (!token) return reply(401, { error: 'token' });
    if (meta && meta.token !== token) return reply(403, { error: 'token' });
    if (method === 'DELETE') { spaces.delete(match[1]); return reply(204); }
    const body = JSON.parse(init.body);
    const rev = meta ? meta.rev : 0;
    if (body.rev !== rev) return reply(409, { rev });
    spaces.set(match[1], { rev: rev + 1, iv: body.iv, data: body.data, token });
    return reply(200, { rev: rev + 1, updated: 1 });
  };
  return { spaces, log, fetch };
};
const sync = (w, keys, server, extra = {}) => w.TeamSync.syncOnce({
  endpoint: ENDPOINT, fetch: server.fetch, storage: w.localStorage, keys, selected: () => true, create: false, wait: async () => {}, ...extra,
});

test('the space id and the write token come from PBKDF2 with their own salt, apart from the encryption key', async () => {
  const w = load();
  const keys = await w.TeamSyncMath.deriveKeys(CODE, 1000);
  assert.notEqual(keys.spaceId, sha(`space:${CODE}`), 'not one SHA-256 of the code');
  assert.notEqual(keys.writeToken, sha(`write:${CODE}`));
  const bits = pbkdf2(CODE, w.TeamSyncMath.ID_SALT, 1000, 64);
  assert.notEqual(w.TeamSyncMath.ID_SALT, w.TeamSyncMath.SALT, 'a salt of their own');
  assert.equal(keys.spaceId, bits.subarray(0, 32).toString('hex'));
  assert.equal(keys.writeToken, bits.subarray(32).toString('hex'));
  // The encryption key is the one teams have always had: what a read-only code carries opens their copies.
  const viewer = await w.TeamSyncMath.parseViewer(await w.TeamSyncMath.viewerCode(CODE, 1000));
  assert.equal(Buffer.from(viewer.key).toString('hex'), pbkdf2(CODE, w.TeamSyncMath.SALT, 1000, 32).toString('hex'));
  assert.equal(viewer.spaceId, keys.spaceId, 'a new read-only code points at the new space');
  // Neither the id nor the token can be had from the key a read-only code carries.
  assert.notEqual(keys.spaceId, sha(Buffer.from(viewer.key).toString('hex')));
  // The old values, kept to find a team's copy made before.
  assert.deepEqual(plain(keys.legacy), { spaceId: sha(`space:${CODE}`), writeToken: sha(`write:${CODE}`) });
  // The real work factor is the default.
  assert.equal(w.TeamSyncMath.ITERATIONS, 310000);
});

test('a team made before: its copy is read at the old id, moved to the new one at the next sync, the old one deleted', async () => {
  const server = fakeServer();
  const w = load({ 'sc-actions': { rows: [{ id: 'a1', title: 'Mine' }] }, 'sc-team-state': { rev: 7 } });
  const keys = await w.TeamSyncMath.deriveKeys(CODE, 1000);
  // The copy as an older version of the site wrote it: at SHA-256("space:" + code), version 1, with its token.
  const old = { format: 'stiven-catalyst-team', version: 1, sent: '2026-10-01T08:00:00.000Z', device: { id: 'old00001', name: '' }, devices: [], items: { 'sc-actions': JSON.stringify({ rows: [{ id: 't1', title: 'Team' }] }) } };
  server.spaces.set(keys.legacy.spaceId, { rev: 7, token: keys.legacy.writeToken, ...(await w.TeamSyncMath.seal(old, keys.key)) });
  const result = await sync(w, keys, server);
  assert.equal(result.status, 'synced');
  assert.equal(result.moved, true);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-actions')).rows.map((r) => r.id), ['a1', 't1']);
  assert.ok(!server.spaces.has(keys.legacy.spaceId), 'the old space is deleted with the old token');
  const box = server.spaces.get(keys.spaceId);
  assert.equal(box.token, keys.writeToken, 'the new space belongs to the new token');
  assert.deepEqual(JSON.parse(plain(await w.TeamSyncMath.unseal(box, keys.key)).items['sc-actions']).rows.map((r) => r.id), ['a1', 't1']);
  assert.deepEqual(server.log.map((line) => line.replace(keys.spaceId, 'new').replace(keys.legacy.spaceId, 'old')), ['GET new', 'GET old', 'PUT new', 'DELETE old']);
  // Another device of the team, still on its old state: it finds the copy at the new id, no request to the old one.
  const other = load({ 'sc-team-state': { rev: 7 } });
  server.log.length = 0;
  assert.equal((await sync(other, await other.TeamSyncMath.deriveKeys(CODE, 1000), server)).status, 'synced');
  assert.deepEqual(JSON.parse(other.localStorage.getItem('sc-actions')).rows.map((r) => r.id), ['a1', 't1']);
  assert.ok(server.log.every((line) => !line.includes(keys.legacy.spaceId)));
  // Neither copy exists: gone, as before. The old address answering with an error is not "gone" (a device that
  // thinks its team is gone stops syncing by itself).
  const lost = fakeServer();
  assert.equal((await sync(load(), keys, lost)).status, 'gone');
  const failing = async (url, init = {}) => (url.endsWith(keys.legacy.spaceId) ? { status: 500, ok: false, json: async () => ({}) } : lost.fetch(url, init));
  assert.deepEqual(plain(await sync(load(), keys, { fetch: failing })), { status: 'error', code: 500 });
});

test('the old space cannot be deleted at once: it is kept to delete at a later sync', async () => {
  const server = fakeServer();
  const w = load({ 'sc-team': { code: CODE }, 'sc-actions': { rows: [{ id: 'a1', title: 'Mine' }] } });
  const keys = await w.TeamSyncMath.deriveKeys(CODE, 1000);
  server.spaces.set(keys.legacy.spaceId, { rev: 2, token: keys.legacy.writeToken, ...(await w.TeamSyncMath.seal({ format: 'stiven-catalyst-team', version: 1, items: {} }, keys.key)) });
  const failing = async (url, init = {}) => (init.method === 'DELETE' ? { status: 500, ok: false, json: async () => ({}) } : server.fetch(url, init));
  const result = await sync(w, keys, { fetch: failing });
  assert.equal(result.status, 'synced');
  assert.deepEqual(plain(w.TeamSync.retireList(w.localStorage)), [plain(keys.legacy)]);
  assert.equal(await w.TeamSync.retireOld({ endpoint: ENDPOINT, fetch: server.fetch, storage: w.localStorage }), 'deleted');
  assert.ok(!server.spaces.has(keys.legacy.spaceId));
  // "Delete the team's copy" deletes both, the old one too where it is still there.
  server.spaces.set(keys.legacy.spaceId, { rev: 1, token: keys.legacy.writeToken, iv: 'x', data: '' });
  assert.equal(await w.TeamSync.deleteCopy({ endpoint: ENDPOINT, fetch: server.fetch, keys }), 'deleted');
  assert.equal(server.spaces.size, 0);
});

// ---- In the box ----
const nunjucks = require('nunjucks');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const boxHtml = () => {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => text);
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value)));
  return env.render('partials/work-backup.njk', { lang: 'en', site: { sync: { endpoint: ENDPOINT } }, tools: read('src/_data/tools.json'), de: { tools: read('src/_data/de/tools.json') }, sq: { tools: read('src/_data/sq/tools.json') } }).replace(/<script src=[^>]*><\/script>/g, '');
};
const waitFor = async (check, tries = 400) => { for (let i = 0; i < tries && !check(); i++) await new Promise((r) => setTimeout(r, 20)); return check(); };

test('in the box: joining a team made before finds its copy at the old address, and the first sync moves it', async (t) => {
  const server = fakeServer();
  const helper = load();
  const keys = await helper.TeamSyncMath.deriveKeys(CODE);
  const old = { format: 'stiven-catalyst-team', version: 1, sent: '', device: { id: 'old00001', name: '' }, devices: [], items: { 'sc-actions': JSON.stringify({ rows: [{ id: 't1', title: 'Team' }] }) } };
  server.spaces.set(keys.legacy.spaceId, { rev: 3, token: keys.legacy.writeToken, ...(await helper.TeamSyncMath.seal(old, keys.key)) });
  const dom = new JSDOM(`<html lang="en"><body>${boxHtml()}</body></html>`, { url: 'https://stivencatalyst.com/tools.html', runScripts: 'outside-only' });
  const w = dom.window;
  t.after(() => w.close());
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  Object.assign(w, { TextEncoder, TextDecoder, CompressionStream, DecompressionStream, fetch: server.fetch });
  w.confirm = () => true;
  for (const file of ['storage-guard', 'work-backup', 'team-sync']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const $ = (selector) => w.document.querySelector(selector);
  $('[data-tm-join-code]').value = CODE;
  $('[data-tm-join]').click();
  assert.ok(await waitFor(() => /^Joined\./.test($('[data-tm-message]').textContent)), $('[data-tm-message]').textContent);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-actions')).rows.map((r) => r.id), ['t1']);
  assert.ok(server.spaces.has(keys.spaceId) && !server.spaces.has(keys.legacy.spaceId), 'moved to the new address');
  assert.equal(JSON.parse(w.localStorage.getItem('sc-team-state')).space, keys.spaceId);
});
