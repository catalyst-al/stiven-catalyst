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
  assert.equal(await w.WorkLock.lock('246810'), 'locked');
  assert.equal(w.localStorage.getItem('sc-five-s-audit'), null, 'the work is gone from localStorage');
  assert.deepEqual(idb.rowsOf('sc-media', 'photos'), [], 'and the photo from the photo store');
  const [record] = idb.rowsOf('sc-lock', 'blob');
  assert.ok(!contains(record.data, (await bytes(photo.blob)).slice(0, 64)), 'the record holds the photo only encrypted');
  // The page again, locked: what a colleague at the desk could open shows no photo.
  const locked = page({ idb, storage: kept(w) });
  assert.equal(locked.WorkLock.locked, true);
  assert.deepEqual(plain(await locked.MediaStore.list('five-s-audit')), []);
  assert.equal(await locked.WorkLock.unlock('135790'), 'wrong');
  assert.equal(await locked.WorkLock.unlock('246810'), 'unlocked');
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
  assert.equal(await w.WorkLock.lock('246810'), 'locked');
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
  assert.equal(await w.WorkLock.lock('246810'), 'locked');
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

// The author's decision of 27 October 2026: new PINs need 6 characters. A device locked earlier with a shorter PIN
// still opens with it; that PIN is then not kept for the tab, so the next lock asks for a new one, and the page says so.
const lockSection = (lang = 'en') => {
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => text);
  return env.render('partials/work-lock.njk', { lang });
};
// A record as an earlier version sealed it with a 4-digit PIN, written where work-lock.js keeps it.
const oldRecord = async (w, idb, pin, items) => {
  const M = w.WorkLockMath;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const record = await M.seal(await M.deriveKey(pin, salt), { items, points: [], media: [] }, salt);
  await new Promise((resolve, reject) => {
    const open = idb.open('sc-lock', 1);
    open.onupgradeneeded = () => open.result.createObjectStore('blob', { keyPath: 'id' });
    open.onsuccess = () => {
      const tx = open.result.transaction('blob', 'readwrite');
      tx.objectStore('blob').put(record);
      tx.oncomplete = resolve; tx.onerror = reject;
    };
    open.onerror = reject;
  });
};

test('a new PIN needs 6 characters; a device locked with a 4-digit PIN still opens, and the next lock asks for a new PIN', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-pareto': { rows: [] } } });
  assert.equal(w.WorkLockMath.MIN_PIN, 6);
  assert.equal(await w.WorkLock.lock('24680'), 'failed', 'five characters are too few for a new PIN');
  assert.equal(w.localStorage.getItem('sc-pareto'), '{"rows":[]}', 'nothing was locked away');

  const before = page({ idb });
  await oldRecord(before, idb, '2468', { 'sc-pareto': '{"rows":[{"cause":"late"}]}' });
  const locked = page({ idb, body: lockSection(), storage: { 'sc-locked': '1' } });
  assert.equal(locked.WorkLock.locked, true);
  assert.equal(await locked.WorkLock.unlock('2468'), 'unlocked', 'the old PIN still opens the old record');
  assert.equal(locked.localStorage.getItem('sc-pareto'), '{"rows":[{"cause":"late"}]}');
  assert.equal(await locked.WorkLock.sessionKey(), null, 'the short PIN is not kept for this tab');
  assert.equal(await locked.WorkLock.lock(), 'failed', 'locking again needs a new PIN');

  // The page after the reload, in the same tab: the PIN form is open and says why.
  const open = page({ idb, body: lockSection(), storage: kept(locked), scripts: [] });
  for (const key of Object.keys(locked.sessionStorage)) open.sessionStorage.setItem(key, locked.sessionStorage.getItem(key));
  open.eval(fs.readFileSync('src/js/work-lock.js', 'utf8'));
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(open.document.querySelector('[data-wl-setup]').hidden, false, 'the form for a new PIN is open');
  assert.match(open.document.querySelector('[data-wl-status]').textContent, /fewer than 6 characters.*at least 6/);
  for (const input of open.document.querySelectorAll('[data-wl-setup] input')) assert.equal(input.getAttribute('minlength'), '6');

  // A new PIN of 6 characters locks, and the note is gone for good.
  assert.equal(await open.WorkLock.lock('246810'), 'locked');
  assert.equal(open.sessionStorage.getItem('sc-lock-renew'), null);
  const again = page({ idb, storage: kept(open) });
  assert.equal(await again.WorkLock.unlock('246810'), 'unlocked');
});

test('the texts of the longer PIN are translated', () => {
  const keys = ['Choose a PIN of at least 6 characters. It is kept nowhere: without it the work cannot be read, by anyone.', 'Your PIN has fewer than {n} characters. Your work is open; to lock again, choose a new PIN of at least {n} characters.'];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const key of keys) assert.ok(ui[key], `${lang}: ${key}`);
    assert.ok(!('Choose a PIN of at least 4 characters. It is kept nowhere: without it the work cannot be read, by anyone.' in ui), `${lang}: the old text is gone`);
  }
});

// A rollback while the tools are locked (the author's decision of 27 October 2026, rollback proof risk 2): the live
// site has no lock, so its tools open empty and what the visitor types there is saved in plain text under the same
// keys. At the unlock, back on this version, that work is kept as a restore point before the locked work returns:
// nothing is overwritten without a way back. The navigation stamps (sc-seen-*) are not work and do not count.
test('rollback while locked: what a page without the lock wrote is kept as a restore point at the unlock, and comes back from it', async () => {
  const idb = fakeIndexedDB();
  const lockedRow = '{"rows":[{"units":3,"note":"before the lock"}]}';
  const typedRow = '{"rows":[{"units":5,"note":"typed during the rollback"}]}';
  const w = page({ idb, storage: { 'sc-damage-control': lockedRow } });
  assert.equal(await w.WorkLock.lock('246810'), 'locked');
  // The live site, without a lock: it writes its rows and a navigation stamp, and leaves the lock's flag alone.
  const during = { ...kept(w), 'sc-damage-control': typedRow, 'sc-pareto': '{"rows":[{"cause":"late"}]}', 'sc-seen-writing': 'x1' };
  const back = page({ idb, storage: during, body: lockSection() });
  assert.equal(back.WorkLock.locked, true);
  assert.equal(await back.WorkLock.unlock('246810'), 'unlocked');
  assert.equal(back.localStorage.getItem('sc-damage-control'), lockedRow, 'the locked work is back');
  const points = idb.rowsOf('sc-restore', 'points').filter((p) => p.reason === 'before-unlock');
  assert.equal(points.length, 1, 'one restore point of what was written while locked');
  assert.deepEqual(plain(points[0].items), { 'sc-damage-control': typedRow, 'sc-pareto': '{"rows":[{"cause":"late"}]}' }, 'the rollback\'s work, without the navigation stamp');
  assert.equal(back.sessionStorage.getItem('sc-lock-kept'), '1', 'the page says so after the reload');
  // After the reload: the note, and the rollback's work restored from its point.
  const after = page({ idb, storage: kept(back), body: lockSection(), scripts: [] });
  after.sessionStorage.setItem('sc-lock-kept', '1');
  for (const file of ['work-lock', 'media-store', 'storage-guard', 'work-backup']) after.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  await new Promise((r) => setTimeout(r, 20));
  assert.match(after.document.querySelector('[data-wl-status]').textContent, /restore point/);
  await after.StorageGuard.ready;
  assert.equal(await after.StorageGuard.restorePoint(points[0].id), 'restored');
  assert.equal(after.localStorage.getItem('sc-damage-control'), typedRow, 'the rollback\'s work comes back from the point');
  assert.ok(idb.rowsOf('sc-restore', 'points').some((p) => p.reason === 'before-restore' && p.items['sc-damage-control'] === lockedRow), 'and the locked work is kept in turn');
});

test('an unlock with nothing written while locked makes no restore point (a navigation stamp is not work)', async () => {
  const idb = fakeIndexedDB();
  const w = page({ idb, storage: { 'sc-damage-control': '{"rows":[]}' } });
  assert.equal(await w.WorkLock.lock('246810'), 'locked');
  const back = page({ idb, storage: { ...kept(w), 'sc-seen-writing': 'x2' } });
  assert.equal(await back.WorkLock.unlock('246810'), 'unlocked');
  assert.deepEqual(idb.rowsOf('sc-restore', 'points').filter((p) => p.reason === 'before-unlock'), []);
  assert.equal(back.sessionStorage.getItem('sc-lock-kept'), null);
});

test('the privacy policy describes the PIN lock, the photos and every kind of restore point, in every language', () => {
  const privacy = fs.readFileSync('src/datenschutz.njk', 'utf8');
  const count = (pattern) => (privacy.match(pattern) || []).length;
  // The lock: the key from the PIN, the PIN kept nowhere, the key in the tab's session storage.
  assert.equal(count(/\(PBKDF2, AES-GCM\)/g), 3);
  assert.equal(count(/PIN itself is kept nowhere|PIN selbst wird nirgends gespeichert|PIN-i nuk ruhet askund/g), 3);
  assert.equal(count(/that tab's session storage|Session Storage\) dieses Tabs|Session Storage\) të asaj skede/g), 3);
  // The photos (media-store.js) and the restore points of storage-guard.js and work-lock.js.
  assert.equal(count(/made smaller on your device|auf Ihrem Gerät verkleinert|zvogëlohen në pajisjen tuaj/g), 3);
  assert.equal(count(/quarter of an hour|Viertelstunde|çerek ore/g), 3);
  assert.equal(count(/unlocked with the PIN|Entsperren mit der PIN|hapen me PIN/g), 3);
  // The legal basis is claimed only for the storage the visitor starts; what is written without an action (the
  // menu's marks, the reading progress, the service worker's copies) is named, with no legal basis claimed for it.
  assert.equal(count(/storage you start yourself|Speicherung, die Sie selbst auslösen|ruajtjen që e nisni vetë/g), 3);
  assert.equal(count(/Without any action of yours|Ohne Ihr Zutun|Pa veprimin tuaj/g), 3);
  assert.equal(count(/strictly necessary for the feature you asked for|für die von Ihnen gewünschte Funktion unbedingt erforderlich|e domosdoshme për funksionin që kërkoni ju/g), 0);
  // The visit count: the script, where it loads and what it is for; no claim that visits are being counted.
  assert.equal(count(/I count visits|zähle ich|i numëroj vizitat/g), 0);
  assert.equal(count(/Its purpose is to count|Es dient dazu, zu zählen|Qëllimi i tij është të numërojë/g), 3);
});
