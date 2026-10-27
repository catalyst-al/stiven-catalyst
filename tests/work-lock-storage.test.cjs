// The PIN of a shared computer (src/js/work-lock.js) and what else keeps work on the device: the photos of the tools
// (IndexedDB sc-media, media-store.js) are locked away with the rest and come back with the PIN; "Forget everything"
// removes them; while the tools are locked no module writes work in plain text (photos, restore points, a file
// opened in the box, team sync). The stores run against tests/fake-indexeddb.cjs.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');
const { fakeIndexedDB } = require('./fake-indexeddb.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
const BOX = (text) => `<div data-work-backup data-text='${JSON.stringify(text)}'><p data-work-summary></p><p data-work-status></p><button data-work-save></button><input type="file" data-work-open></div>`;
const TEXT = { inBrowser: '{tools}', nothing: 'nothing', saved: 'Saved as {file}.', invalid: 'invalid', confirm: '{date} {tools}', full: 'full', opened: 'Opened.', blocked: '', locked: 'Locked: unlock first.' };
const page = ({ storage = {}, idb = fakeIndexedDB(), body = '', scripts = ['work-lock', 'media-store', 'storage-guard', 'work-backup'] } = {}) => {
  const dom = new JSDOM(`<html lang="en"><body>${body}</body></html>`, { url: 'https://stivencatalyst.com/tools/five-s-audit/', runScripts: 'outside-only' });
  const w = dom.window;
  w.indexedDB = idb;
  Object.defineProperty(w, 'crypto', { configurable: true, value: globalThis.crypto });
  Object.assign(w, { TextEncoder, TextDecoder, CompressionStream, DecompressionStream, Blob, Response });
  w.confirm = () => true;
  w.location.reload = () => {};
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  for (const file of scripts) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const jpeg = (seed) => new Blob([Uint8Array.from({ length: 3000 }, (_, i) => (i * 13 + seed) % 256)], { type: 'image/jpeg' });
const photo = { id: 'p-1', created: '2026-10-26T08:00:00.000Z', tool: 'five-s-audit', ref: 'audit-1', blob: jpeg(7), width: 640, height: 480 };
const bytes = async (blob) => [...new Uint8Array(await blob.arrayBuffer())];
const contains = (haystack, needle) => Buffer.from(haystack).indexOf(Buffer.from(needle)) >= 0;
// The same browser opened again: its localStorage, as a new page sees it.
const kept = (w) => Object.fromEntries(Object.keys(w.localStorage).map((key) => [key, w.localStorage.getItem(key)]));

test('the photos are locked away with the work, encrypted, and come back with the PIN', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-five-s-audit': { audits: [{ id: 'audit-1', area: 'Room 512, guest Mrs Weber' }] } } });
  await w.MediaStore.restore(photo);
  assert.equal(await w.WorkLock.lock('2468'), 'locked');
  assert.equal(w.localStorage.getItem('sc-five-s-audit'), null, 'the work is gone from localStorage');
  assert.deepEqual(idb.rowsOf('sc-media', 'photos'), [], 'and the photo from the photo store');
  const [record] = idb.rowsOf('sc-lock', 'blob');
  assert.ok(!contains(record.data, (await bytes(photo.blob)).slice(0, 64)), 'the record holds the photo only encrypted');
  // The page again, locked: what a colleague at the desk could open shows no photo.
  const locked = page({ idb, storage: kept(w) });
  assert.equal(locked.WorkLock.locked, true);
  assert.deepEqual(plain(await locked.MediaStore.list('five-s-audit')), []);
  assert.equal(await locked.WorkLock.unlock('1357'), 'wrong');
  assert.equal(await locked.WorkLock.unlock('2468'), 'unlocked');
  const back = await locked.MediaStore.get('p-1');
  assert.deepEqual(plain({ ...back, blob: null }), plain({ ...photo, blob: null }));
  assert.equal(back.blob.type, 'image/jpeg');
  assert.deepEqual(await bytes(back.blob), await bytes(photo.blob));
  assert.match(locked.localStorage.getItem('sc-five-s-audit'), /Mrs Weber/);
});

test('a record locked before photos were locked away still opens', async () => {
  const w = page();
  const M = w.WorkLockMath;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await M.deriveKey('2468', salt);
  const record = await M.seal(key, { items: { 'sc-pareto': '{}' }, points: [] }, salt);
  const back = await M.unseal(key, record);
  assert.deepEqual(plain(back.items), { 'sc-pareto': '{}' });
  assert.deepEqual(plain(back.media), []);
});

test('while locked nothing is written in plain text: no photo, no restore point, no file opened, no team sync', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-pareto': { rows: [] } } });
  assert.equal(await w.WorkLock.lock('2468'), 'locked');
  const locked = page({ idb, body: BOX(TEXT), storage: kept(w) });
  await assert.rejects(() => locked.MediaStore.restore(photo), /locked/);
  await assert.rejects(() => locked.MediaStore.keepAll([photo]), /locked/);
  assert.deepEqual(idb.rowsOf('sc-media', 'photos'), []);
  // Something a tool wrote in spite of the lock (the Action Tracker's store does not ask): no restore point keeps it.
  locked.localStorage.setItem('sc-actions', JSON.stringify({ rows: [{ id: 'a1', title: 'Call Mrs Weber' }] }));
  assert.equal(await locked.StorageGuard.makePoint('manual'), null);
  assert.deepEqual(idb.rowsOf('sc-restore', 'points'), []);
  // A file opened in the box would write work in plain text beside the locked record: refused, nothing written.
  const text = JSON.stringify({ format: 'stiven-catalyst-work', version: 1, exported: '', items: { 'sc-five-whys': '{"q":"x"}' } });
  const picker = locked.document.querySelector('[data-work-open]');
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'w.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new locked.Event('change'));
  for (let i = 0; i < 50 && !locked.document.querySelector('[data-work-status]').textContent; i++) await new Promise((r) => setTimeout(r, 5));
  assert.equal(locked.document.querySelector('[data-work-status]').textContent, 'Locked: unlock first.');
  assert.equal(locked.localStorage.getItem('sc-five-whys'), null);
});

test('team sync stays off on a locked page: no start, no join, nothing fetched', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-pareto': { rows: [] }, 'sc-team': { code: 'acid-acorn-acre-acts-afar-affix' } } });
  assert.equal(await w.WorkLock.lock('2468'), 'locked');
  assert.equal(w.localStorage.getItem('sc-team'), null, 'the team code is locked away too');
  // The section as the site renders it.
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => text);
  const html = env.render('partials/team-sync.njk', { lang: 'en', site: { sync: { endpoint: 'https://sync.example.test' } } });
  const calls = [];
  const locked = page({ idb, body: html, scripts: ['work-lock', 'storage-guard', 'work-backup'], storage: kept(w) });
  locked.fetch = async (...args) => { calls.push(args); throw new Error('no network in this test'); };
  locked.eval(fs.readFileSync('src/js/team-sync.js', 'utf8'));
  assert.equal(locked.document.querySelector('[data-tm-off]').hidden, true, 'neither start nor join is offered');
  assert.equal(locked.document.querySelector('[data-tm-message]').textContent, 'Team sync is paused while the tools are locked.');
  await new Promise((r) => setTimeout(r, 50));
  assert.deepEqual(calls, []);
});

test('"Forget everything" removes the photos too', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-pareto': { rows: [] } } });
  await w.MediaStore.restore(photo);
  await w.WorkLock.forget();
  assert.ok(idb.deleted.includes('sc-media'), 'the photo store is deleted');
  for (const name of ['sc-lock', 'sc-restore', 'sc-reminders']) assert.ok(idb.deleted.includes(name), name);
  assert.equal(w.localStorage.getItem('sc-pareto'), null);
});

test('the lock texts are translated', () => {
  const keys = ['The tools are locked. Unlock them with the PIN first; nothing was changed.', 'Team sync is paused while the tools are locked.'];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const key of keys) assert.ok(ui[key], `${lang}: ${key}`);
  }
});
