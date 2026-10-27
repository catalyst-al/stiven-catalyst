// Work kept in the browser, made harder to lose (src/js/storage-guard.js, in the box "All your work in one file"):
// which keys a restore point keeps, how many points stay, sizes and the largest tools, the all-or-nothing restore,
// the hook before a Work Backup file replaces anything, and a page without IndexedDB that works as before.
// The box is the real partial rendered with Nunjucks; IndexedDB is a small fake of the parts the script uses.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const part = read('src/_data/i18n-parts/storage-guard.json');

// The partial as a page renders it, with the filters stubbed the way eleventy.config.js defines them.
const missing = new Set();
const render = (lang) => {
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: true });
  env.addFilter('t', (text) => { if (lang !== 'en' && ui[text] === undefined) missing.add(`${lang}: ${text}`); return lang === 'en' ? text : ui[text] ?? text; });
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value)));
  return env.render('partials/work-backup.njk', { lang, tools: read('src/_data/tools.json'), de: { tools: read('src/_data/de/tools.json') }, sq: { tools: read('src/_data/sq/tools.json') } })
    .replace(/<script src=[^>]*><\/script>/g, '');
};

// A minimal IndexedDB: one database of object stores keyed by keyPath; requests answer on a later turn, and a
// transaction completes once nothing is pending (as in browsers, a request made from a promise callback keeps it open).
const fakeIndexedDB = () => {
  const dbs = new Map();
  const later = (fn) => setTimeout(fn, 0);
  const request = (tx, work) => {
    const req = { result: undefined, error: null, onsuccess: null, onerror: null };
    if (tx) tx.pending += 1;
    later(() => {
      try { req.result = work(); req.onsuccess?.({ target: req }); } catch (error) { req.error = error; req.onerror?.({ target: req }); if (tx) tx.failed = error; }
      if (tx) { tx.pending -= 1; tx.check(); }
    });
    return req;
  };
  const clone = (value) => structuredClone(value);
  return {
    dbs,
    open(name) {
      const req = { result: null, onupgradeneeded: null, onsuccess: null, onerror: null, onblocked: null };
      later(() => {
        let db = dbs.get(name);
        const fresh = !db;
        if (fresh) {
          const stores = new Map();
          db = {
            stores,
            objectStoreNames: { contains: (store) => stores.has(store) },
            createObjectStore: (store, { keyPath }) => { stores.set(store, { keyPath, rows: new Map() }); },
            close() {},
            transaction(store) {
              const data = stores.get(store);
              const tx = {
                pending: 0, failed: null, finished: false, oncomplete: null, onerror: null, onabort: null,
                check() { later(() => { if (!tx.finished && tx.pending === 0) { tx.finished = true; if (tx.failed) { tx.error = tx.failed; tx.onabort?.(); } else tx.oncomplete?.(); } }); },
                objectStore: () => ({
                  put: (value) => request(tx, () => { data.rows.set(value[data.keyPath], clone(value)); return value[data.keyPath]; }),
                  get: (key) => request(tx, () => (data.rows.has(key) ? clone(data.rows.get(key)) : undefined)),
                  getAll: () => request(tx, () => [...data.rows.values()].map(clone)),
                  getAllKeys: () => request(tx, () => [...data.rows.keys()].sort()),
                  delete: (key) => request(tx, () => { data.rows.delete(key); }),
                }),
              };
              tx.check();
              return tx;
            },
          };
          dbs.set(name, db);
        }
        req.result = db;
        if (fresh) req.onupgradeneeded?.();
        req.onsuccess?.();
      });
      return req;
    },
  };
};
const rows = (idb) => [...(idb.dbs.get('sc-restore')?.stores.get('points')?.rows.values() || [])];

const load = ({ lang = 'en', storage = {}, idb = fakeIndexedDB(), persisted = false, page = true } = {}) => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${page ? render(lang) : ''}</body></html>`, { url: `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/pareto/`, runScripts: 'outside-only' });
  const { window } = dom;
  if (idb) window.indexedDB = idb;
  const asked = [];
  if (persisted !== null) {
    Object.defineProperty(window.navigator, 'storage', { configurable: true, value: {
      persisted: async () => persisted,
      persist: async () => { asked.push(true); return false; },
      estimate: async () => ({ usage: 3 * 1024 * 1024, quota: 2 * 1024 * 1024 * 1024 }),
    } });
  }
  window.confirm = () => true;
  window.URL.createObjectURL = () => 'blob:x';
  window.URL.revokeObjectURL = () => {};
  for (const [key, value] of Object.entries(storage)) window.localStorage.setItem(key, value);
  window.eval(fs.readFileSync('src/js/storage-guard.js', 'utf8'));
  window.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
  return { window, idb, asked };
};
const settle = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

test('a restore point keeps the work and nothing else; sizes and the largest tools', () => {
  const { window } = load({ page: false, idb: null, persisted: null });
  const M = window.StorageGuardMath;
  window.localStorage.setItem('sc-theme', 'dark');
  window.localStorage.setItem('sc-night-audit', `{"rows":[${'1,'.repeat(500)}1]}`);
  window.localStorage.setItem('sc-night-audit-de', '{"rows":[]}');
  window.localStorage.setItem('sc-pareto', '{}');
  window.localStorage.setItem('other', 'x');
  const items = plain(M.snapshot(window.localStorage, window.WorkBackup.isWork));
  assert.deepEqual(Object.keys(items).sort(), ['sc-night-audit', 'sc-night-audit-de', 'sc-pareto']);
  assert.equal(M.sizeOf('sc-pareto', '{}'), 11);
  assert.equal(M.itemsBytes({ a: 'bc', de: 'f' }), 6);
  const top = plain(M.largest(items, window.WorkBackup.toolSlug, 2));
  assert.deepEqual(top.map((tool) => tool.slug), ['night-audit', 'pareto']);
  assert.deepEqual(top[0].keys.sort(), ['sc-night-audit', 'sc-night-audit-de']);
  assert.equal(top[0].bytes, M.itemsBytes({ 'sc-night-audit': items['sc-night-audit'], 'sc-night-audit-de': items['sc-night-audit-de'] }));
  assert.ok(!M.nearlyFull(4 * 1024 * 1024 - 1) && M.nearlyFull(4 * 1024 * 1024));
  assert.equal(M.formatBytes(1.8 * 1024 * 1024), '1.8 MB');
  assert.equal(M.formatBytes(1.8 * 1024 * 1024, 'de'), '1,8 MB');
  assert.equal(M.formatBytes(12 * 1024), '12 KB');
  assert.equal(M.formatBytes(10), '1 KB');
  assert.equal(M.formatBytes(0), '0 KB');
  assert.equal(M.formatBytes(2 * 1024 ** 3, 'sq'), '2,0 GB');
  assert.equal(M.storageBytes(window.localStorage), ['sc-theme', 'sc-night-audit', 'sc-night-audit-de', 'sc-pareto', 'other'].reduce((sum, key) => sum + key.length + window.localStorage.getItem(key).length, 0));
});

test('the last 14 daily points and the last 5 others stay; one daily point a day', () => {
  const { window } = load({ page: false, idb: null, persisted: null });
  const M = window.StorageGuardMath;
  const day = (d, reason = 'daily') => M.parseId(M.pointId(new Date(Date.UTC(2026, 9, d, 6)).toISOString(), reason));
  const points = [...Array.from({ length: 20 }, (_, i) => day(i + 1)), ...['before-open', 'manual', 'before-restore', 'manual', 'before-open', 'manual', 'manual'].map((reason, i) => day(i + 1, reason))];
  const dropped = M.prune(points);
  assert.equal(dropped.length, 6 + 2);
  const kept = points.filter((p) => !dropped.includes(p.id));
  assert.equal(kept.filter((p) => p.reason === 'daily').length, 14);
  assert.equal(kept.filter((p) => p.reason !== 'daily').length, 5);
  // The oldest go.
  assert.ok(dropped.includes(day(1).id) && dropped.includes(day(6).id) && !dropped.includes(day(7).id));
  assert.ok(dropped.includes(day(1, 'before-open').id) && dropped.includes(day(2, 'manual').id) && !dropped.includes(day(3, 'before-restore').id));
  assert.deepEqual(plain(M.parseId(M.pointId('2026-10-24T08:14:00.000Z', 'before-open', 2))), { id: '2026-10-24T08:14:00.000Z before-open 2', created: '2026-10-24T08:14:00.000Z', reason: 'before-open' });
  const now = new window.Date(2026, 9, 24, 9, 0);
  assert.ok(M.needsDaily([], now));
  assert.ok(M.needsDaily([M.parseId(M.pointId(new window.Date(2026, 9, 23, 22).toISOString(), 'daily'))], now));
  assert.ok(M.needsDaily([M.parseId(M.pointId(new window.Date(2026, 9, 24, 7).toISOString(), 'manual'))], now), 'a manual point is not the daily one');
  assert.ok(!M.needsDaily([M.parseId(M.pointId(new window.Date(2026, 9, 24, 0, 5).toISOString(), 'daily'))], now));
});

test('a restore replaces exactly its keys, all or nothing', () => {
  const { window } = load({ page: false, idb: null, persisted: null });
  const M = window.StorageGuardMath;
  const store = new Map([['sc-a', 'old a'], ['sc-c', 'keep c']]);
  // The third new value does not fit; putting an old one back always does.
  let full = true;
  const storage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { if (full && key === 'sc-d') throw new Error('QuotaExceededError'); store.set(key, value); },
    removeItem: (key) => store.delete(key),
  };
  assert.equal(M.replaceItems(storage, { 'sc-a': 'new a', 'sc-b': 'new b', 'sc-d': 'new d' }), false);
  assert.deepEqual([...store.entries()].sort(), [['sc-a', 'old a'], ['sc-c', 'keep c']], 'the old state is back, the new key is gone');
  full = false;
  assert.equal(M.replaceItems(storage, { 'sc-a': 'new a', 'sc-b': 'new b' }), true);
  assert.deepEqual([...store.entries()].sort(), [['sc-a', 'new a'], ['sc-b', 'new b'], ['sc-c', 'keep c']]);
  // A point opens as a Work Backup file.
  const file = plain(window.WorkBackup.makeBackup(M.asStorage({ 'sc-pareto': '{}' }), new window.Date('2026-10-24T08:14:00Z')));
  assert.deepEqual(plain(window.WorkBackup.readBackup(JSON.stringify(file))).items, { 'sc-pareto': '{}' });
});

test('with work saved: the browser is asked to keep it, a daily point is made once, the box shows them', async () => {
  const storage = { 'sc-damage-control': '{"rows":[{"units":3}]}', 'sc-pareto': '{}', 'sc-theme': 'dark' };
  const { window, idb, asked } = load({ storage });
  await window.StorageGuard.ready;
  await settle();
  assert.equal(asked.length, 1, 'persist asked once');
  const points = rows(idb);
  assert.equal(points.length, 1);
  assert.equal(points[0].reason, 'daily');
  assert.deepEqual(Object.keys(points[0].items).sort(), ['sc-damage-control', 'sc-pareto']);
  assert.equal(points[0].bytes, window.StorageGuardMath.itemsBytes(points[0].items));
  const doc = window.document;
  assert.equal(doc.querySelector('[data-storage-guard]').hidden, false);
  assert.match(doc.querySelector('[data-sg-keep]').textContent, /may clear it/);
  assert.match(doc.querySelector('[data-sg-points-text]').textContent, /^Restore points: 1, the latest today \d\d:\d\d\.$/);
  assert.match(doc.querySelector('[data-sg-space]').textContent, /Your work takes 1 KB.*3\.0 MB of 2\.0 GB/);
  assert.equal(doc.querySelector('[data-sg-full]').hidden, true);
  // Showing the list: the date, the reason and the tools by the names the box uses.
  doc.querySelector('[data-sg-toggle]').click();
  await settle();
  const item = doc.querySelector('.sg-point');
  assert.match(item.textContent, /Daily/);
  assert.match(item.querySelector('.sg-point-tools').textContent, /Damage Control/);
  assert.equal(doc.querySelector('[data-sg-toggle]').getAttribute('aria-expanded'), 'true');
  // A second visit the same day makes no second daily point; a point by hand is added.
  const again = load({ storage, idb });
  await again.window.StorageGuard.ready;
  await settle();
  assert.equal(rows(idb).length, 1);
  again.window.document.querySelector('[data-sg-make]').click();
  await settle(60);
  assert.deepEqual(rows(idb).map((p) => p.reason).sort(), ['daily', 'manual']);
  assert.match(again.window.document.querySelector('[data-work-status]').textContent, /Restore point made: Damage Control, Pareto/);
});

test('a kept browser says so; no work means no point and no question', async () => {
  const kept = load({ storage: { 'sc-pareto': '{}' }, persisted: true });
  await kept.window.StorageGuard.ready;
  assert.equal(kept.asked.length, 0);
  assert.match(kept.window.document.querySelector('[data-sg-keep]').textContent, /^Kept by the browser/);
  const empty = load({ storage: { 'sc-theme': 'dark' } });
  await empty.window.StorageGuard.ready;
  await settle();
  assert.equal(empty.asked.length, 0);
  assert.equal(rows(empty.idb).length, 0);
  assert.equal(empty.window.document.querySelector('[data-sg-keep]').hidden, true);
  assert.match(empty.window.document.querySelector('[data-sg-points-text]').textContent, /No restore points yet/);
  assert.equal(empty.window.document.querySelector('[data-sg-toggle]').hidden, true);
});

test('before a file replaces anything a point is made; a restore makes one too and puts the keys back', async () => {
  const { window, idb } = load({ storage: { 'sc-pareto': '{"before":1}', 'sc-five-whys': '{"q":"why"}' } });
  await window.StorageGuard.ready;
  await settle();
  const record = await window.WorkBackup.beforeReplace(['sc-pareto']);
  assert.equal(record.reason, 'before-open');
  assert.deepEqual(plain(record.items), { 'sc-pareto': '{"before":1}', 'sc-five-whys': '{"q":"why"}' });
  // The file is opened; then the visitor goes back.
  window.localStorage.setItem('sc-pareto', '{"from":"file"}');
  window.localStorage.setItem('sc-oee', '{}');
  assert.equal(await window.StorageGuard.restorePoint(record.id), 'restored');
  assert.equal(window.localStorage.getItem('sc-pareto'), '{"before":1}');
  assert.equal(window.localStorage.getItem('sc-oee'), '{}', 'keys not in the point stay');
  const before = rows(idb).find((p) => p.reason === 'before-restore');
  assert.deepEqual(before.items, { 'sc-pareto': '{"from":"file"}', 'sc-five-whys': '{"q":"why"}', 'sc-oee': '{}' });
  assert.equal(await window.StorageGuard.restorePoint('nope'), 'gone');
  // Never more than 5 points that are not daily.
  for (let i = 0; i < 7; i++) await window.StorageGuard.makePoint('manual', undefined, new window.Date(Date.UTC(2026, 9, 24, 10, i)));
  assert.equal(rows(idb).filter((p) => p.reason !== 'daily').length, 5);
  assert.equal(rows(idb).filter((p) => p.reason === 'daily').length, 1);
});

test('nearly full: the three largest tools are named, with a file of them', async () => {
  const big = (n) => `{"rows":["${'x'.repeat(n)}"]}`;
  const { window } = load({ storage: { 'sc-night-audit': big(1.8 * 1024 * 1024), 'sc-damage-control': big(1.2 * 1024 * 1024), 'sc-pareto': big(0.9 * 1024 * 1024), 'sc-oee': big(200 * 1024) } });
  await window.StorageGuard.ready;
  const full = window.document.querySelector('[data-sg-full]');
  assert.equal(full.hidden, false);
  assert.match(full.textContent, /nearly full \(4\.1 MB of about 5 MB\)\. The largest: Night Audit[^,]* 1\.8 MB, Damage Control 1\.2 MB, Pareto[^,]* 0\.9 MB\./);
  assert.deepEqual(JSON.parse(full.dataset.keys).sort(), ['sc-damage-control', 'sc-night-audit', 'sc-pareto']);
});

test('without IndexedDB or storage APIs the box works as before, with no error', async () => {
  const errors = [];
  const { window } = load({ storage: { 'sc-pareto': '{}' }, idb: null, persisted: null });
  window.addEventListener('error', (event) => errors.push(event.error));
  await window.StorageGuard.ready;
  await settle();
  const doc = window.document;
  assert.equal(doc.querySelector('[data-sg-points]').hidden, true);
  assert.equal(doc.querySelector('[data-sg-keep]').hidden, true);
  assert.match(doc.querySelector('[data-work-summary]').textContent, /Pareto/);
  assert.equal(await window.WorkBackup.beforeReplace(['sc-pareto']), null);
  assert.deepEqual(errors, []);
  // A page without the box: the script only sets itself up.
  const bare = load({ page: false });
  await bare.window.StorageGuard.ready;
  assert.equal(typeof bare.window.WorkBackup.beforeReplace, 'function');
});

test('German and Albanian: every text is translated, the box reads in that language', async () => {
  missing.clear();
  for (const lang of ['de', 'sq']) render(lang);
  assert.deepEqual([...missing], []);
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  const { window } = load({ lang: 'de', storage: { 'sc-pareto-de': '{}' } });
  await window.StorageGuard.ready;
  assert.match(window.document.querySelector('[data-sg-points-text]').textContent, /^Wiederherstellungspunkte: 1, der neueste heute \d\d:\d\d\.$/);
});

test('the stylesheet is balanced and keeps to the brand colours', () => {
  const css = fs.readFileSync('src/css/39-storage-guard.css', 'utf8');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.equal((stripped.match(/\{/g) || []).length, (stripped.match(/\}/g) || []).length);
  assert.doesNotMatch(css, /--red|--gold/);
});

test('the points made while working keep the last six and never push out a point made by hand', () => {
  const { window } = load({ page: false, idb: null, persisted: null });
  const M = window.StorageGuardMath;
  assert.equal(M.RECENT_MS, 15 * 60 * 1000);
  assert.ok(M.REASONS.includes('recent'));
  const at = (minute, reason) => M.parseId(M.pointId(new Date(Date.UTC(2026, 9, 26, 8, minute)).toISOString(), reason));
  const points = [...Array.from({ length: 10 }, (_, i) => at(i * 15, 'recent')), at(3, 'manual'), at(4, 'before-open'), at(5, 'daily')];
  const dropped = M.prune(points);
  assert.equal(dropped.length, 4);
  assert.ok(dropped.every((id) => id.endsWith(' recent')), 'only recent points go');
  assert.ok(dropped.includes(at(0, 'recent').id) && dropped.includes(at(45, 'recent').id) && !dropped.includes(at(60, 'recent').id));
});
