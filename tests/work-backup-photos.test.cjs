// "All your work in one file" with the photos (src/js/work-backup.js, src/js/media-store.js): the photos the tools
// keep in IndexedDB "sc-media" go into the saved file (newest first, up to 20 MB of them, the rest named as left
// out), and opening the file in another browser puts them back without replacing a photo that is already there. The
// photos are written and read by MediaStore itself, against a small IndexedDB like the one storage-guard.test.cjs
// uses (tests/fake-indexeddb.cjs); the Save and Open buttons of the box are the real ones.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const { fakeIndexedDB } = require('./fake-indexeddb.cjs');

const TEXT = { inBrowser: '{tools}', nothing: 'nothing', saved: 'Saved as {file}.', savedPhotos: 'Photos in the file: {n}.', photosLeft: 'Left out: {n}.', photosUnread: 'unread', invalid: 'invalid', confirm: '{date} {tools}', full: 'full', opened: 'Opened.', openedPhotos: 'Photos from the file: {n}.', photosFailed: 'photos failed', blocked: '' };
const BOX = `<div data-work-backup data-text='${JSON.stringify(TEXT)}'><p data-work-summary></p><p data-work-status></p><button data-work-save></button><input type="file" data-work-open></div>`;
const browser = (storage = {}) => {
  const dom = new JSDOM(`<html lang="en"><body>${BOX}</body></html>`, { url: 'https://stivencatalyst.com/tools.html', runScripts: 'outside-only' });
  const w = dom.window;
  w.indexedDB = fakeIndexedDB();
  // Node's Blob: jsdom's has no arrayBuffer(); the page sees one Blob class as in a browser.
  w.Blob = Blob;
  w.confirm = () => true;
  w.location.reload = () => {};
  w.saved = [];
  w.URL.createObjectURL = (blob) => { w.saved.push(blob); return 'blob:saved'; };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function click() { w.downloaded = this.download; };
  for (const [key, value] of Object.entries(storage)) w.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  for (const file of ['media-store', 'work-backup']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const status = (w) => w.document.querySelector('[data-work-status]').textContent;
const waitFor = async (check, tries = 200) => { for (let i = 0; i < tries && !check(); i++) await new Promise((r) => setTimeout(r, 5)); return check(); };
const jpeg = (seed, size = 2000) => new Blob([Uint8Array.from({ length: size }, (_, i) => (i * 31 + seed) % 256)], { type: 'image/jpeg' });
const photo = (n, extra = {}) => ({ id: `p-${n}`, created: `2026-10-2${n}T08:00:00.000Z`, tool: 'five-s-audit', ref: 'audit-1', blob: jpeg(n), width: 640, height: 480, ...extra });
const bytes = async (blob) => [...new Uint8Array(await blob.arrayBuffer())];
const save = async (w) => {
  w.saved.length = 0;
  w.document.querySelector('[data-work-save]').click();
  assert.ok(await waitFor(() => w.saved.length === 1), 'a file was made');
  return JSON.parse(await w.saved[0].text());
};
const open = async (w, file) => {
  const text = JSON.stringify(file);
  const picker = w.document.querySelector('[data-work-open]');
  Object.defineProperty(picker, 'files', { configurable: true, value: [{ name: 'work.json', size: text.length, text: async () => text }] });
  picker.dispatchEvent(new w.Event('change'));
  assert.ok(await waitFor(() => /^(Opened|invalid|full)/.test(status(w))), status(w));
};

test('the saved file holds the photos of the tools, and opening it in another browser brings them back as they were', async () => {
  const a = browser({ 'sc-five-s-audit': { audits: [{ id: 'audit-1', area: 'Dock' }] } });
  await a.MediaStore.restore(photo(1));
  await a.MediaStore.restore(photo(2, { tool: 'safety-cross', ref: '2026-10-22' }));
  const file = await save(a);
  assert.equal(file.format, 'stiven-catalyst-work');
  assert.equal(file.version, 1, 'the same format: older versions of the site open the work and skip the photos');
  assert.deepEqual(Object.keys(file.items), ['sc-five-s-audit']);
  assert.deepEqual(file.media.map((m) => [m.id, m.tool, m.ref, m.type, m.width, m.height]), [['p-2', 'safety-cross', '2026-10-22', 'image/jpeg', 640, 480], ['p-1', 'five-s-audit', 'audit-1', 'image/jpeg', 640, 480]]);
  assert.equal(status(a), `Saved as ${a.downloaded}. Photos in the file: 2.`);
  // Another browser, empty: the work and both photos.
  const b = browser();
  await open(b, file);
  assert.equal(status(b), 'Opened. Photos from the file: 2.');
  assert.deepEqual(JSON.parse(b.localStorage.getItem('sc-five-s-audit')), { audits: [{ id: 'audit-1', area: 'Dock' }] });
  const back = await b.MediaStore.list('five-s-audit', 'audit-1');
  assert.equal(back.length, 1);
  assert.deepEqual(plain({ ...back[0], blob: undefined }), plain({ ...photo(1), blob: undefined }));
  assert.equal(back[0].blob.type, 'image/jpeg');
  assert.deepEqual(await bytes(back[0].blob), await bytes(jpeg(1)));
  assert.equal((await b.MediaStore.list('safety-cross')).length, 1);
});

test('a photo already in this browser is never replaced by the file\'s; the work goes through the restore point as before', async () => {
  const a = browser({ 'sc-five-s-audit': { audits: [] } });
  await a.MediaStore.restore(photo(1));
  const file = await save(a);
  const b = browser({ 'sc-five-s-audit': { audits: [{ id: 'newer' }] } });
  const newer = photo(1, { blob: jpeg(99), ref: 'moved' });
  await b.MediaStore.restore(newer);
  const points = [];
  b.WorkBackup.beforeReplace = async (keys) => { points.push(keys); };
  await open(b, file);
  assert.deepEqual(plain(points), [['sc-five-s-audit']], 'a restore point before the work is replaced');
  const kept = await b.MediaStore.get('p-1');
  assert.equal(kept.ref, 'moved');
  assert.deepEqual(await bytes(kept.blob), await bytes(jpeg(99)));
  assert.equal(status(b), 'Opened. Photos from the file: 0.');
});

test('past the limit the newest photos go in and the box says how many were left out', async () => {
  const a = browser({ 'sc-safety-cross': { days: {} } });
  for (let n = 1; n <= 5; n++) await a.MediaStore.restore(photo(n));
  a.WorkBackup.photoLimit = 4500;
  const file = await save(a);
  assert.deepEqual(file.media.map((m) => m.id), ['p-5', 'p-4'], 'the two newest fit 4500 bytes');
  assert.match(status(a), /Photos in the file: 2\. Left out: 3\.$/);
  // Photos alone are work too: a browser with photos and nothing else saves them.
  const only = browser();
  await only.MediaStore.restore(photo(1));
  const photosOnly = await save(only);
  assert.deepEqual(Object.keys(photosOnly.items), []);
  assert.equal(photosOnly.media.length, 1);
  const c = browser();
  await open(c, photosOnly);
  assert.equal((await c.MediaStore.list('five-s-audit')).length, 1);
});

test('photo entries are checked: a damaged one is skipped, a file whose photos are not a list is refused', () => {
  const w = browser();
  const good = { format: 'stiven-catalyst-work', version: 1, exported: '', items: { 'sc-pareto': '{}' } };
  const entry = { id: 'p-1', created: '2026-10-21T08:00:00.000Z', tool: 'five-s-audit', ref: 'a', width: 10, height: 10, type: 'image/jpeg', data: Buffer.from([1, 2, 3]).toString('base64') };
  const read = w.WorkBackup.readBackup(JSON.stringify({ ...good, media: [entry, { ...entry, id: '../x' }, { ...entry, id: 'p-2', type: 'text/html' }, { ...entry, id: 'p-3', data: 'not base64!' }, { ...entry, id: 'p-4', tool: '<script>' }, null] }));
  assert.deepEqual(plain(read.media.map((m) => m.id)), ['p-1']);
  assert.equal(w.WorkBackup.readBackup(JSON.stringify({ ...good, media: {} })), null);
  assert.equal(w.WorkBackup.readBackup(JSON.stringify({ ...good, items: {}, media: [] })), null, 'nothing in it');
  assert.deepEqual(plain(w.WorkBackup.readBackup(JSON.stringify(good)).media), [], 'a file from before photos');
});

test('the photo texts are translated and the box says what the file holds', () => {
  const keys = [
    'The file holds the tools\' photos too, up to 20 MB of them; restore points stay on this device.',
    'Photos in the file: {n}.', 'Left out so that the file stays under 20 MB: {n} older photos. They stay on this device.',
    'The photos could not be read here, so the file holds the work without them.', 'Photos from the file: {n}.',
    'The photos in the file could not be kept in this browser; the rest of the work is opened.',
  ];
  const partial = fs.readFileSync('src/_includes/partials/work-backup.njk', 'utf8');
  for (const key of keys) assert.ok(partial.includes(`"${key.replace(/'/g, "\\'")}"`) || partial.includes(`"${key}"`), key);
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const key of keys) assert.ok(ui[key], `${lang}: ${key}`);
  }
  assert.doesNotMatch(fs.readFileSync('src/js/media-store.js', 'utf8'), /not part of the Work Backup file/);
});
