// work-lock.js, the PIN of a shared computer: what is locked away and what stays, the encrypted record and its way
// back with the right PIN only, the PIN rules. The browser parts (IndexedDB, the dialog) are checked in the browser.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const fakeStorage = (entries = {}) => {
  const map = new Map(Object.entries(entries));
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    map,
  };
};
const load = (storage) => {
  const context = {
    window: {}, document: { querySelector: () => null, addEventListener: () => {}, readyState: 'complete' },
    localStorage: storage, sessionStorage: fakeStorage(), crypto: globalThis.crypto, TextEncoder, TextDecoder, Blob, Response,
    CompressionStream, DecompressionStream, btoa, atob, setTimeout, clearTimeout, setInterval, location: { reload: () => {} },
  };
  context.window.localStorage = storage;
  context.window.sessionStorage = context.sessionStorage;
  vm.runInNewContext(fs.readFileSync('src/js/work-lock.js', 'utf8'), context);
  return context.window;
};
const plain = (value) => JSON.parse(JSON.stringify(value));

test('the work and the team code are locked away; the theme, the floor mode and the lock settings stay readable', () => {
  const storage = fakeStorage({ 'sc-theme': 'dark', 'sc-floor-mode-ui': '1', 'sc-print-guide-hidden': '1', 'sc-locked': '0', 'sc-lock-idle': '15', 'sc-damage-control': '{"rows":[]}', 'sc-team': 'acid acorn acre acts afar affix', 'sc-team-state': '{}', 'sc-ats-cv': '{}', other: 'x' });
  const { WorkLockMath: M, WorkLock } = load(storage);
  assert.deepEqual(Object.keys(M.gather(storage)).sort(), ['sc-ats-cv', 'sc-damage-control', 'sc-team', 'sc-team-state']);
  assert.ok(M.lockable('sc-five-whys') && !M.lockable('sc-theme') && !M.lockable('sc-locked') && !M.lockable('other'));
  assert.equal(WorkLock.locked, false, 'the flag "0" is not locked');
  assert.ok(M.goodPin('1234') && M.goodPin(' 12345 ') && !M.goodPin('123') && !M.goodPin('') && !M.goodPin(null));
  assert.deepEqual([5, 15, 30, 60, 0, 7, 'x', undefined].map(M.idleMinutes), [5, 15, 30, 60, 0, 0, 0, 0]);
  assert.deepEqual(plain([...M.fromBase64(M.toBase64(Uint8Array.from([0, 1, 254, 255])))]), [0, 1, 254, 255]);
});

test('a locked page is known from the flag before any tool reads its storage, without IndexedDB too', () => {
  const { WorkLock } = load(fakeStorage({ 'sc-locked': '1' }));
  assert.equal(WorkLock.locked, true);
});

test('the record opens with the PIN that sealed it and with no other; what comes back is what went in', async () => {
  const { WorkLockMath: M } = load(fakeStorage());
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await M.deriveKey('2468', salt);
  const items = { 'sc-damage-control': JSON.stringify({ rows: [{ date: '2026-10-26', units: 3, note: 'ëç äöü €' }] }), 'sc-team': 'acid acorn acre acts afar affix', 'sc-theme': 'dark' };
  const points = [{ id: '2026-10-26T06:00:00.000Z daily', created: '2026-10-26T06:00:00.000Z', reason: 'daily', items: { 'sc-damage-control': '{"rows":[]}' }, bytes: 20 }];
  const record = await M.seal(key, { items, points }, salt, new Date('2026-10-26T14:00:00Z'));
  assert.equal(record.id, 'work');
  assert.equal(record.format, M.FORMAT);
  assert.equal(record.locked, '2026-10-26T14:00:00.000Z');
  assert.equal(record.iv.length, 12);
  assert.ok(record.data.length > 16, 'ciphertext with its tag');
  const text = Buffer.from(record.data).toString('latin1');
  assert.ok(!text.includes('damage') && !text.includes('acorn'), 'nothing readable in the record');
  // The same PIN, a key derived again: the work and the points, the theme (not lockable) left out.
  const back = await M.unseal(await M.deriveKey('2468', salt), record);
  assert.deepEqual(plain(back), { locked: '2026-10-26T14:00:00.000Z', items: { 'sc-damage-control': items['sc-damage-control'], 'sc-team': items['sc-team'] }, points, media: [] });
  // A wrong PIN, a wrong salt, a changed byte, a foreign record: null, never an exception.
  assert.equal(await M.unseal(await M.deriveKey('2469', salt), record), null);
  assert.equal(await M.unseal(await M.deriveKey('2468', crypto.getRandomValues(new Uint8Array(16))), record), null);
  const damaged = { ...record, data: Uint8Array.from(record.data) };
  damaged.data[5] ^= 1;
  assert.equal(await M.unseal(key, damaged), null);
  assert.equal(await M.unseal(key, { ...record, format: 'other' }), null);
  assert.equal(await M.unseal(key, null), null);
  // Two seals of the same work differ (a fresh IV each time) and both open.
  const again = await M.seal(key, { items, points }, salt);
  assert.notEqual(Buffer.from(again.iv).toString('hex'), Buffer.from(record.iv).toString('hex'));
  assert.deepEqual(plain((await M.unseal(key, again)).items), plain(back.items));
  // The key travels through the tab's session as raw bytes and comes back the same key.
  const raw = await M.exportKey(key);
  assert.deepEqual(plain((await M.unseal(await M.importKey(raw), record)).items), plain(back.items));
});
