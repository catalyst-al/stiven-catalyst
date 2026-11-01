// Phase 5A: the offline copies survive a deploy. The worker (src/sw.js) is driven through its own events (fetch,
// message, activate) against a fake Cache API and a fake network that serves "builds": each build is a set of pages
// naming versioned assets (?v=<build>), and the server, like GitHub Pages, answers a versioned address with the
// current build's bytes whatever the version asked for. The tests that name the defect (T1, T3, T4, T9) failed on
// the worker of 0b995e82; the others guard what must stay.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const ORIGIN = 'https://stivencatalyst.com';
const abs = (path) => (path.startsWith('http') ? path : ORIGIN + path);
const pathOf = (url) => new URL(url).pathname;
const typeOf = (pathname) => (/\.css$/.test(pathname) ? 'text/css' : /\.js$/.test(pathname) ? 'text/javascript' : /\.json$|webmanifest$/.test(pathname) ? 'application/json' : /\.svg$/.test(pathname) ? 'image/svg+xml' : 'text/html; charset=utf-8');

class FakeResponse {
  constructor(body, init = {}) {
    const { status = 200, type = 'basic' } = init;
    const contentType = init.contentType || (init.headers && (init.headers['content-type'] || init.headers['Content-Type'])) || 'text/html';
    this.body = body; this.status = status; this.ok = status >= 200 && status < 300; this.type = type; this.headers = { get: (name) => (name.toLowerCase() === 'content-type' ? contentType : null) };
  }
  async text() { return this.body; }
  async json() { return JSON.parse(this.body); }
  clone() { return new FakeResponse(this.body, { status: this.status, type: this.type, contentType: this.headers.get('content-type') }); }
  static error() { return new FakeResponse('', { status: 0, type: 'error' }); }
}
const urlOf = (request) => (typeof request === 'string' ? abs(request) : request.url);
class FakeCache {
  constructor() { this.store = new Map(); this.calls = { keys: 0, match: 0, put: 0, delete: 0 }; this.failPut = null; }
  async match(request, { ignoreSearch = false } = {}) {
    this.calls.match++;
    const url = urlOf(request);
    if (!ignoreSearch) return this.store.has(url) ? this.store.get(url).clone() : undefined;
    const want = pathOf(url);
    for (const [key, value] of this.store) if (pathOf(key) === want) return value.clone();
    return undefined;
  }
  // failPut(url, store) → true makes this one write fail (a quota error, a worker stopped); it is asked once per write.
  async put(request, response) { this.calls.put++; if (this.failPut && this.failPut(urlOf(request), this.store)) throw new Error('write failed'); this.store.set(urlOf(request), response.clone()); }
  async delete(request) { this.calls.delete++; return this.store.delete(urlOf(request)); }
  async keys() { this.calls.keys++; return [...this.store.keys()].map((url) => ({ url })); }
  async addAll(urls) { for (const url of urls) await this.put(url, await this.fetch(url)); }
}
// A build: pages naming versioned assets. The server answers a path with the current build's bytes.
const build = (n, { extraPages = {} } = {}) => {
  const v = `v=${n}${n}${n}`;
  const page = (title, scripts) => `<!doctype html><html><head><title>${title}</title><link rel="stylesheet" href="/styles-tool.css?${v}"><link rel="icon" href="/favicon.svg">`
    + `<script src="/js/tool-kit.js?${v}" defer></script>${scripts.map((s) => `<script src="/js/${s}.js?${v}" defer></script>`).join('')}</head><body><main>${title} build ${n}</main></body></html>`;
  return {
    n,
    files: {
      '/tools/a/': page('A', ['a']), '/tools/b/': page('B', ['b']), '/tools/c/': page('C', ['c']), '/tools.html': page('Tools', []),
      '/insights/essay/': `<!doctype html><html><head><link rel="stylesheet" href="/styles-essay.css?${v}"></head><body>essay build ${n}</body></html>`,
      '/styles-tool.css': `.tool{--build:${n}}`, '/styles-essay.css': `.essay{--build:${n}}`, '/js/tool-kit.js': `window.ToolKit={build:${n}}`,
      '/js/a.js': `a${n}`, '/js/b.js': `b${n}`, '/js/c.js': `c${n}`,
      '/offline.html': '<!doctype html><html><body>offline</body></html>', '/manifest.webmanifest': '{}', '/favicon.svg': '<svg/>',
      ...extraPages,
    },
  };
};
const versionOf = (n) => `v=${n}${n}${n}`;

// The worker in a bare scope: its listeners recorded, the network and the cache fake, the build switchable.
// `cache` lets a second worker (an upgrade) take over the cache a first one left; `source` lets the first one be the
// worker of an earlier commit (tests/fixtures/sw-0b995e82.js is the worker of main at 0b995e82, verbatim).
// `extra(n)` adds pages and files to every build the worker sees (a deploy included).
const worker = ({ source = fs.readFileSync('src/sw.js', 'utf8'), extra = () => ({}), current = build(1, { extraPages: extra(1) }), cache = new FakeCache() } = {}) => {
  const state = { build: current, offline: false, failing: new Set(), requests: [] };
  const fetch = async (request) => {
    const url = urlOf(request);
    const path = pathOf(url);
    state.requests.push(path + (url.includes('?') ? url.slice(url.indexOf('?')) : ''));
    if (state.offline) throw new TypeError('Failed to fetch');
    if (state.failing.has(path)) throw new TypeError('Failed to fetch');
    const body = state.build.files[path];
    if (body === undefined) return new FakeResponse('not found', { status: 404 });
    return new FakeResponse(body, { contentType: typeOf(path) });
  };
  cache.fetch = fetch;
  const listeners = {};
  const self = { location: { origin: ORIGIN }, addEventListener: (name, fn) => { listeners[name] = fn; }, skipWaiting: async () => {}, clients: { claim: async () => {} }, registration: {} };
  const caches = { open: async () => cache, keys: async () => ['sc-offline-v1'], delete: async () => true };
  // The worker's timers run at once, unless a test holds them (state.holdTimers) to interleave work with a delayed refresh.
  state.holdTimers = false; state.timers = [];
  const setTimeout = (fn) => { if (state.holdTimers) state.timers.push(fn); else fn(); };
  new Function('self', 'caches', 'fetch', 'Response', 'setTimeout', source)(self, caches, fetch, FakeResponse, setTimeout);
  if (self.SwKit && self.SwKit.settings) self.SwKit.settings.graceMs = 0;
  const waits = [];
  const idle = async () => { if (self.SwKit && self.SwKit.idle) await self.SwKit.idle(); };
  // While timers are held, a delayed refresh cannot finish: only the chain is drained, twice, with the pending
  // microtasks between (a job enters the chain a tick after its event).
  const settle = async () => {
    if (state.holdTimers) { for (let i = 0; i < 2; i++) { await new Promise((resolve) => setImmediate(resolve)); await idle(); } return; }
    while (waits.length) await waits.shift();
    await idle();
  };
  // The held timers fire (the delayed refreshes go on), then everything settles.
  const releaseTimers = async () => { state.holdTimers = false; while (state.timers.length) state.timers.shift()(); await settle(); };
  // A navigation as the browser makes it: the response, then the browser's own requests for the page's assets.
  const navigate = async (path, { assets = true } = {}) => {
    let answer;
    const event = { request: { url: abs(path), mode: 'navigate', method: 'GET', destination: 'document' }, respondWith: (p) => { answer = p; }, waitUntil: (p) => waits.push(p.catch(() => {})) };
    listeners.fetch(event);
    const response = await answer;
    const html = response && response.ok ? await response.clone().text() : '';
    if (assets && html) {
      for (const match of html.matchAll(/(?:href|src)="([^"]+\?v=[^"]+)"/g)) {
        let a;
        const ev = { request: { url: abs(match[1]), mode: 'no-cors', method: 'GET', destination: /\.css/.test(match[1]) ? 'style' : 'script' }, respondWith: (p) => { a = p; }, waitUntil: (p) => waits.push(p.catch(() => {})) };
        listeners.fetch(ev);
        try { await a; } catch { /* offline */ }
      }
    }
    await settle();
    return { response, html };
  };
  // A request a script makes itself (fetch(): destination ""), as the browser routes it through the worker.
  const request = async (path, { destination = '' } = {}) => {
    let answer;
    const event = { request: { url: abs(path), mode: 'cors', method: 'GET', destination }, respondWith: (p) => { answer = p; }, waitUntil: (p) => waits.push(p.catch(() => {})) };
    listeners.fetch(event);
    let response = null;
    try { response = await answer; } catch { /* offline */ }
    await settle();
    return response;
  };
  const keep = async (urls) => { await listeners.message({ data: { type: 'keep', urls: urls.map(abs) }, waitUntil: (p) => waits.push(p.catch(() => {})) }); await settle(); };
  const activate = async () => { await listeners.activate({ waitUntil: (p) => waits.push(p) }); await settle(); };
  const install = async () => { await listeners.install({ waitUntil: (p) => waits.push(p) }); await settle(); };
  const cached = (path) => cache.store.has(abs(path));
  const cachedHtml = (path) => { if (cache.store.has(abs(path))) return cache.store.get(abs(path)).body; for (const [key, value] of cache.store) if (pathOf(key) === path) return value.body; return null; };
  // A page is complete when every versioned asset its cached HTML names is in the cache.
  const complete = (path) => { const html = cachedHtml(path); if (!html) return false; return [...html.matchAll(/(?:href|src)="([^"]+\?v=[^"]+)"/g)].every((m) => cache.store.has(abs(m[1]))); };
  const deploy = (n) => { state.build = build(n, { extraPages: extra(n) }); };
  const requestsSince = (from) => state.requests.slice(from);
  return { self, listeners, cache, state, navigate, request, keep, activate, install, cached, cachedHtml, complete, deploy, requestsSince, settle, releaseTimers };
};
const kept = ['/tools/a/', '/tools/b/', '/tools/c/', '/tools.html'];

test('T1/T2: two cached pages share an asset version; refreshing one keeps the version the other still names, refreshing both collects it', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.navigate('/tools/b/');
  assert.ok(w.complete('/tools/a/') && w.complete('/tools/b/'));
  w.deploy(2);
  await w.navigate('/tools/b/');
  assert.ok(w.complete('/tools/b/'), 'the refreshed page is complete with its new assets');
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(1)}`), 'T1: the old tool-kit stays while /tools/a/ still names it');
  assert.ok(w.cached(`/styles-tool.css?${versionOf(1)}`), 'T1: the old stylesheet stays while /tools/a/ still names it');
  assert.ok(w.complete('/tools/a/'), 'T1: /tools/a/ is still complete offline');
  await w.navigate('/tools/a/');
  assert.ok(w.complete('/tools/a/') && w.complete('/tools/b/'));
  assert.ok(!w.cached(`/js/tool-kit.js?${versionOf(1)}`), 'T2: nothing names the old tool-kit any more: collected');
  assert.ok(!w.cached(`/styles-tool.css?${versionOf(1)}`), 'T2: the old stylesheet is collected');
  assert.ok(!w.cached(`/js/a.js?${versionOf(1)}`) && !w.cached(`/js/b.js?${versionOf(1)}`));
});

test('T3: D1 → D2 → D3 with one kept page reopened online per deploy: every kept page opens whole offline after each deploy', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.keep(kept);
  for (const page of kept) assert.ok(w.complete(page), `${page} kept whole on D1`);
  // D2: one page reopened online, the others only offline.
  w.deploy(2);
  await w.navigate('/tools/b/');
  w.state.offline = true;
  for (const page of kept) {
    const { response } = await w.navigate(page);
    assert.ok(response && response.ok, `${page} answers offline after D2`);
    assert.ok(w.complete(page), `${page} is complete offline after D2 (its assets were not evicted)`);
  }
  w.state.offline = false;
  // D3: another page reopened online.
  w.deploy(3);
  await w.navigate('/tools/c/');
  w.state.offline = true;
  for (const page of kept) assert.ok(w.complete(page), `${page} is complete offline after D3`);
  w.state.offline = false;
  // The pages that were never reopened still hold D1; the reopened ones hold their build; nothing broken.
  assert.match(w.cachedHtml('/tools/a/'), /build 1/);
  assert.match(w.cachedHtml('/tools/b/'), /build 2/);
  assert.match(w.cachedHtml('/tools/c/'), /build 3/);
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(1)}`) && w.cached(`/js/tool-kit.js?${versionOf(2)}`) && w.cached(`/js/tool-kit.js?${versionOf(3)}`), 'three versions, each named by a cached page');
});

test('T4/T5: keep repairs a cached but incomplete page from fresh HTML (never an old asset address) and leaves a complete one alone', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.keep(kept);
  // Damage: the old asset of /tools/b/ is gone (what the old worker did), the page is cached but incomplete.
  await w.cache.delete(abs(`/js/b.js?${versionOf(1)}`));
  assert.ok(!w.complete('/tools/b/'));
  w.deploy(2);
  const from = w.state.requests.length;
  await w.keep(kept);
  const requests = w.requestsSince(from);
  assert.ok(w.complete('/tools/b/'), 'T4: the incomplete page is whole again');
  assert.match(w.cachedHtml('/tools/b/'), /build 2/, 'T4: repaired from fresh HTML');
  assert.ok(!requests.includes(`/js/b.js?${versionOf(1)}`), 'T4: the old asset address was never fetched');
  assert.ok(requests.includes('/tools/b/'), 'T4: the page was fetched');
  assert.ok(!requests.includes('/tools/a/') && !requests.includes('/tools/c/') && !requests.includes('/tools.html'), 'T5: complete pages are not fetched again, even though a newer build exists');
  assert.match(w.cachedHtml('/tools/a/'), /build 1/, 'T5: a complete page keeps its build until it is visited online');
  assert.ok(w.complete('/tools/a/'));
});

test('T6: a keep while offline deletes nothing and changes nothing', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.keep(kept);
  const before = new Map(w.cache.store);
  w.deploy(2);
  w.state.offline = true;
  await w.keep([...kept, '/tools/new/']);
  assert.deepEqual([...w.cache.store.keys()].sort(), [...before.keys()].sort(), 'the same entries');
  for (const [key, value] of before) assert.equal(w.cache.store.get(key).body, value.body);
});

test('T7: a refresh whose asset download fails leaves the previously complete page and its assets untouched', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  assert.ok(w.complete('/tools/a/'));
  w.deploy(2);
  w.state.failing.add('/js/a.js');
  const { response } = await w.navigate('/tools/a/');
  assert.ok(response.ok, 'the browser still gets the new page from the network');
  assert.match(w.cachedHtml('/tools/a/'), /build 1/, 'the cached copy is still the complete old one');
  assert.ok(w.complete('/tools/a/'), 'and complete');
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(1)}`), 'its assets were not collected');
  // The network heals: the next visit refreshes it whole.
  w.state.failing.clear();
  await w.navigate('/tools/a/');
  assert.match(w.cachedHtml('/tools/a/'), /build 2/);
  assert.ok(w.complete('/tools/a/'));
  assert.ok(!w.cached(`/js/tool-kit.js?${versionOf(1)}`), 'now the old version is collected');
});

test('T8: two refreshes and a collection started together end with every page complete and no shared asset lost', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.navigate('/tools/b/');
  await w.navigate('/tools/c/');
  w.deploy(2);
  // Three navigations in flight at once, without waiting between them.
  const runs = ['/tools/a/', '/tools/b/', '/tools/c/'].map((page) => w.navigate(page));
  await Promise.all(runs);
  await w.settle();
  for (const page of ['/tools/a/', '/tools/b/', '/tools/c/']) { assert.ok(w.complete(page), `${page} complete`); assert.match(w.cachedHtml(page), /build 2/); }
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(2)}`));
  assert.ok(!w.cached(`/js/tool-kit.js?${versionOf(1)}`), 'the old shared version is collected once nothing names it');
});

test('T9: a cache left by the old worker (pages whose assets were evicted) is indexed on activate, serves offline as before, and is repaired on the next keep from fresh HTML', async () => {
  const w = worker();
  // Simulate directly: page A cached at D1, its assets missing except what D2 shares by path (different version).
  await w.navigate('/tools/a/');
  await w.navigate('/tools/b/');
  for (const key of [...w.cache.store.keys()]) if (key.includes(versionOf(1)) && !key.includes('/js/b.js')) await w.cache.delete(key);
  w.deploy(2);
  // The pages are there, their assets are not: the state after the old worker's eviction.
  assert.ok(w.cachedHtml('/tools/a/') && !w.complete('/tools/a/'));
  await w.activate();
  assert.ok(w.cachedHtml('/tools/a/'), 'activate drops no page');
  // Offline: the page still answers (with what it has), as before.
  w.state.offline = true;
  const { response } = await w.navigate('/tools/a/');
  assert.ok(response && response.ok);
  w.state.offline = false;
  const from = w.state.requests.length;
  await w.keep(['/tools/a/', '/tools/b/']);
  assert.ok(w.complete('/tools/a/') && w.complete('/tools/b/'), 'repaired');
  assert.match(w.cachedHtml('/tools/a/'), /build 2/);
  assert.ok(!w.requestsSince(from).some((r) => r.includes(versionOf(1))), 'no old asset address fetched during the repair');
});

test('T10: the keep message checks the origin of each address it is given, not event.origin', async () => {
  const w = worker();
  const waits = [];
  await w.listeners.message({ data: { type: 'keep', urls: ['https://elsewhere.test/tools/a/', abs('/tools/a/')] }, origin: 'https://elsewhere.test', waitUntil: (p) => waits.push(p) });
  await Promise.all(waits);
  await w.settle();
  assert.ok(w.cached('/tools/a/'), 'the same-origin address is kept');
  assert.ok(!w.state.requests.some((r) => r.includes('elsewhere')), 'the other origin is never fetched');
  assert.ok(![...w.cache.store.keys()].some((k) => k.includes('elsewhere')));
});

test('T11: cost. One keys() per page update, no cache scan on asset requests, and only the missing pages fetched by keep', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  await w.keep(kept);
  const keysBefore = w.cache.calls.keys;
  const from = w.state.requests.length;
  // A hundred asset requests served from the copy: no scan.
  for (let i = 0; i < 100; i++) {
    let a;
    w.listeners.fetch({ request: { url: abs(`/js/tool-kit.js?${versionOf(1)}`), mode: 'no-cors', method: 'GET', destination: 'script' }, respondWith: (p) => { a = p; }, waitUntil: () => {} });
    await a;
  }
  assert.equal(w.cache.calls.keys, keysBefore, 'asset requests never list the cache');
  assert.equal(w.requestsSince(from).length, 0, 'and never touch the network when the copy has them');
  // A page update: a bounded number of listings.
  w.deploy(2);
  const k0 = w.cache.calls.keys;
  await w.navigate('/tools/a/');
  const perUpdate = w.cache.calls.keys - k0;
  assert.ok(perUpdate >= 1 && perUpdate <= 3, `one page update lists the cache ${perUpdate} time(s)`);
  // A keep with everything complete: no network at all.
  const f0 = w.state.requests.length;
  await w.keep(kept);
  const extra = w.requestsSince(f0);
  assert.ok(extra.every((r) => !r.startsWith('/tools/')) , `keep fetched no complete page (${extra.join(', ')})`);
  console.log(`  cost: ${perUpdate} keys() per page update; keep over ${kept.length} complete pages made ${extra.length} request(s); ${w.cache.calls.match} match() calls in the whole test`);
  // At scale: 200 ordinary pages in the copy (a reader's essays), then one page update. The index keeps the work to
  // one listing and set arithmetic; no cached page is parsed again.
  const pages = {};
  for (let i = 0; i < 200; i++) pages[`/insights/essay-${i}/`] = `<!doctype html><html><head><link rel="stylesheet" href="/styles-essay.css?v=222"><script src="/js/shelf.js?v=222" defer></script></head><body>essay ${i}</body></html>`;
  w.state.build = build(2, { extraPages: pages });
  for (const path of Object.keys(pages)) await w.navigate(path, { assets: false });
  const m0 = w.cache.calls.match; const k1 = w.cache.calls.keys;
  const t0 = process.hrtime.bigint();
  await w.navigate('/tools/b/');
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  console.log(`  scale: ${Object.keys(w.cache.store).length || w.cache.store.size} entries in the copy, one page update: ${w.cache.calls.keys - k1} keys(), ${w.cache.calls.match - m0} match(), ${ms.toFixed(1)} ms in the fake (no I/O)`);
  assert.ok(w.cache.calls.keys - k1 <= 3);
});

test('precache, offline page and unversioned files behave as before', async () => {
  const w = worker();
  await w.install();
  assert.ok(w.cached('/offline.html') && w.cached('/manifest.webmanifest') && w.cached('/favicon.svg'));
  w.state.offline = true;
  const { response } = await w.navigate('/never/seen/');
  assert.equal(await response.text(), '<!doctype html><html><body>offline</body></html>', 'an unknown page offline gets the offline page');
  w.state.offline = false;
  // An unversioned file: served from the copy and refreshed behind it.
  let a;
  w.listeners.fetch({ request: { url: abs('/favicon.svg'), mode: 'no-cors', method: 'GET', destination: 'image' }, respondWith: (p) => { a = p; }, waitUntil: () => {} });
  assert.equal(await (await a).text(), '<svg/>');
});

// Independent audit of 05f26949 (ChatGPT, 31 October 2026): two more offline-integrity defects, each with the test
// that failed on that head.
test('T12 (audit F1): a page cached under its plain address and under a query variant are two documents; refreshing the variant keeps the files the plain copy names', async () => {
  const w = worker();
  await w.navigate('/tools/a/');
  assert.ok(w.complete('/tools/a/'));
  w.deploy(2);
  await w.navigate('/tools/a/?action=synthetic');
  assert.ok(w.cached('/tools/a/?action=synthetic'), 'the variant is cached under its own address');
  assert.match(w.cachedHtml('/tools/a/?action=synthetic'), /build 2/);
  assert.match(w.cachedHtml('/tools/a/'), /build 1/, 'the plain copy is still the D1 page');
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(1)}`) && w.cached(`/styles-tool.css?${versionOf(1)}`) && w.cached(`/js/a.js?${versionOf(1)}`), 'the files the plain D1 copy names are kept');
  assert.ok(w.complete('/tools/a/'), 'the plain copy is complete');
  assert.ok(w.complete('/tools/a/?action=synthetic'), 'and so is the variant');
  // Offline, the plain address opens whole.
  w.state.offline = true;
  const { response } = await w.navigate('/tools/a/');
  assert.ok(response.ok);
  assert.match(await response.text(), /build 1/);
  assert.ok(w.complete('/tools/a/'));
  w.state.offline = false;
  // Both refreshed to D2 later: the D1 files go.
  await w.navigate('/tools/a/');
  assert.ok(w.complete('/tools/a/') && w.complete('/tools/a/?action=synthetic'));
  assert.ok(!w.cached(`/js/a.js?${versionOf(1)}`), 'nothing names the D1 files any more');
});

test('T13 (audit F2): an interrupted index write never lets collection delete a file a cached page names; the index heals at the next collection', async () => {
  // (a) The write after the new HTML is stored fails: the index still protects the new files.
  const w = worker();
  await w.navigate('/tools/a/');
  await w.navigate('/tools/b/');
  w.deploy(2);
  let failed = 0;
  w.cache.failPut = (url, store) => { if (url.endsWith('/__sw/refs') && failed === 0 && [...store.values()].some((r) => /A build 2/.test(r.body))) { failed++; return true; } return false; };
  await w.navigate('/tools/a/');
  assert.equal(failed, 1, 'the index write after the new page was stored failed once');
  w.cache.failPut = null;
  assert.match(w.cachedHtml('/tools/a/'), /build 2/, 'the new page is in the copy');
  // Another page's update runs a collection.
  await w.navigate('/tools/b/');
  assert.ok(w.cached(`/js/a.js?${versionOf(2)}`), 'the new file of the page whose index write failed is not collected');
  assert.ok(w.cached(`/js/tool-kit.js?${versionOf(2)}`));
  assert.ok(w.complete('/tools/a/'), 'the page is complete');
  w.state.offline = true;
  const { response } = await w.navigate('/tools/a/');
  assert.ok(response.ok && /build 2/.test(await response.text()));
  assert.ok(w.complete('/tools/a/'), 'and complete offline');
  w.state.offline = false;
  // The index has healed: after one more collection nothing stale is left and the old files are gone.
  const refs = JSON.parse(w.cache.store.get(abs('/__sw/refs')).body);
  assert.ok(Object.values(refs.docs).some((list) => list.some((href) => href.includes(`a.js?${versionOf(2)}`))), 'the entry names the new file');
  assert.ok(!w.cached(`/js/a.js?${versionOf(1)}`), 'the old file, named by no page, is collected');
  // (b) The write before the new HTML is stored fails: nothing changes, the complete old copy stays.
  const w2 = worker();
  await w2.navigate('/tools/a/');
  w2.deploy(2);
  let first = 0;
  w2.cache.failPut = (url) => { if (url.endsWith('/__sw/refs') && first === 0) { first++; return true; } return false; };
  await w2.navigate('/tools/a/');
  w2.cache.failPut = null;
  assert.equal(first, 1);
  assert.match(w2.cachedHtml('/tools/a/'), /build 1/, 'the page was not replaced');
  assert.ok(w2.complete('/tools/a/'));
  await w2.navigate('/tools/b/');
  assert.ok(w2.complete('/tools/a/'), 'still complete after a collection');
  // (c) A keep whose index write fails: the kept page is either the old complete one or the new complete one, never a broken one.
  const w3 = worker();
  await w3.navigate('/tools/a/');
  await w3.keep(kept);
  w3.deploy(2);
  await w3.cache.delete(abs(`/js/b.js?${versionOf(1)}`));
  let n = 0;
  w3.cache.failPut = (url) => { if (url.endsWith('/__sw/refs')) { n++; return n === 2; } return false; };
  await w3.keep(kept);
  w3.cache.failPut = null;
  await w3.navigate('/tools/c/');
  assert.ok(w3.complete('/tools/b/'), 'the repaired page is complete after the failed write and a collection');
});

const OLD_WORKER = fs.readFileSync('tests/fixtures/sw-0b995e82.js', 'utf8');
// The Search page as built: its script fetches the index named by data-index (js/search.js, fetch(root.dataset.index)),
// a versioned file no <link> or <script> names. A build changes the index's version with its content.
const searchPages = (n) => ({ '/search.html': `<!doctype html><html><head><title>Search</title></head><body><main data-index="/search-index.json?${versionOf(n)}">search build ${n}</main></body></html>`, '/search-index.json': `[{"build":${n}}]`, '/js/extra.js': `extra${n}` });

test('T14 (audit F3): the upgrade from the worker of 0b995e82 keeps the versioned files a script fetched itself (the search index; a file no page names at all); each is retired only once nothing needs it', async () => {
  // The old worker, as deployed: the Search page and the index its script fetches; a file no page names (a script's own import); one tool page.
  const old = worker({ source: OLD_WORKER, extra: searchPages });
  await old.navigate('/search.html');
  const answer = await old.request(`/search-index.json?${versionOf(1)}`);
  assert.ok(answer && answer.ok && old.cached(`/search-index.json?${versionOf(1)}`), 'the old worker caches the versioned index');
  await old.request(`/js/extra.js?${versionOf(1)}`);
  assert.ok(old.cached(`/js/extra.js?${versionOf(1)}`));
  await old.navigate('/tools/a/');
  assert.ok(old.complete('/tools/a/'));
  // The new worker takes over the same cache: installed, activated, no index entry yet.
  const w = worker({ cache: old.cache, extra: searchPages });
  await w.install();
  await w.activate();
  assert.ok(w.cached('/search.html'), 'the Search page survives the upgrade');
  assert.ok(w.cached(`/search-index.json?${versionOf(1)}`), 'so does the index its script fetched: no <link> or <script> names it, no record knows it');
  assert.ok(w.cached(`/js/extra.js?${versionOf(1)}`), 'and the file no page names at all: the only version of its path, adopted');
  assert.ok(w.complete('/tools/a/'), 'the tool page is still complete');
  // Offline, Search works as before: the page and the index both answer from the copy.
  w.state.offline = true;
  assert.ok((await w.navigate('/search.html')).response.ok);
  const offlineIndex = await w.request(`/search-index.json?${versionOf(1)}`);
  assert.ok(offlineIndex && offlineIndex.ok, 'the index answers offline');
  w.state.offline = false;
  assert.ok(!w.state.requests.some((r) => r.includes(versionOf(1))), 'no old version address was fetched to achieve this');
  // A build changes the index. The Search page reopened online is replaced whole (its index is not downloaded for that:
  // the script fetches it when it needs it); once the script has fetched the new index, a page update retires the old
  // one, which no cached document names any more. The adopted file retires once a newer version of it is fetched.
  w.deploy(2);
  const from = w.state.requests.length;
  await w.navigate('/search.html');
  assert.match(w.cachedHtml('/search.html'), /build 2/);
  assert.equal(w.requestsSince(from).filter((r) => r.startsWith('/search-index.json')).length, 0, 'the index was not downloaded for the page');
  await w.request(`/search-index.json?${versionOf(2)}`);
  await w.request(`/js/extra.js?${versionOf(2)}`);
  await w.navigate('/tools/b/');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`), 'the new index is kept');
  assert.ok(!w.cached(`/search-index.json?${versionOf(1)}`), 'the old index, named by no cached document, is collected: the copy does not grow without bound');
  assert.ok(w.cached(`/js/extra.js?${versionOf(2)}`) && !w.cached(`/js/extra.js?${versionOf(1)}`), 'the adopted file keeps its latest fetched version only');
  assert.equal(w.requestsSince(from).filter((r) => r.startsWith('/search-index.json')).length, 1, 'the index was fetched once, by the script');
  // A second upgrade-shaped collection changes nothing more.
  await w.activate();
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`) && w.cached('/search.html'));
});

test('T15 (audit F4): a keep for a plain address cached only under a query variant fetches the plain page, keeps the variant, and a second keep fetches nothing', async () => {
  const w = worker();
  await w.navigate('/tools/a/?action=synthetic');
  assert.ok(w.cached('/tools/a/?action=synthetic') && !w.cached('/tools/a/'), 'only the variant is cached');
  const from = w.state.requests.length;
  await w.keep(['/tools/a/']);
  assert.ok(w.cached('/tools/a/'), 'the plain address asked for is now in the copy under its exact address');
  assert.ok(w.cached('/tools/a/?action=synthetic'), 'the variant stays');
  assert.ok(w.complete('/tools/a/') && w.complete('/tools/a/?action=synthetic'));
  const pages = w.requestsSince(from).filter((r) => r.startsWith('/tools/a/'));
  assert.deepEqual(pages, ['/tools/a/'], 'exactly the plain page was fetched; its files were already in the copy');
  const refs = JSON.parse(w.cache.store.get(abs('/__sw/refs')).body);
  assert.ok(refs.docs[abs('/tools/a/')] && refs.docs[abs('/tools/a/?action=synthetic')], 'both documents have their own entry');
  // A second keep: everything complete, nothing fetched.
  const again = w.state.requests.length;
  await w.keep(['/tools/a/']);
  assert.equal(w.requestsSince(again).length, 0, 'a repeated keep makes no request');
});

test('T16 (audit F5): a cached Search page keeps the index version its data-index names, through the upgrade and after a later build fetched a newer one; the index is never downloaded for the page, its absence never makes the page incomplete', async () => {
  // D1 under the old worker: the Search page and its index.
  const old = worker({ source: OLD_WORKER, extra: searchPages });
  await old.navigate('/search.html');
  await old.request(`/search-index.json?${versionOf(1)}`);
  // The new worker over the same cache.
  const w = worker({ cache: old.cache, extra: searchPages });
  await w.install();
  await w.activate();
  assert.ok(w.cached('/search.html') && w.cached(`/search-index.json?${versionOf(1)}`), 'both survive the upgrade');
  // D2: Search opened online under a query (another document); the plain copy stays the D1 page. The script fetches
  // the D2 index; another page's visit collects.
  w.deploy(2);
  const from = w.state.requests.length;
  await w.navigate('/search.html?q=new');
  assert.ok(w.cached('/search.html?q=new') && /build 2/.test(w.cachedHtml('/search.html?q=new')));
  assert.match(w.cachedHtml('/search.html'), /build 1/, 'the plain copy is still the D1 page');
  await w.request(`/search-index.json?${versionOf(2)}`);
  await w.navigate('/tools/a/');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`), 'the D2 index is kept for the D2 document');
  assert.ok(w.cached(`/search-index.json?${versionOf(1)}`), 'the D1 index is kept: the cached D1 Search page names it through data-index');
  assert.equal(w.requestsSince(from).filter((r) => r.startsWith('/search-index.json')).length, 1, 'the index was fetched once, by the script: never downloaded for a page');
  // Offline: the D1 Search page opens and finds its index; the D2 document finds its own.
  w.state.offline = true;
  const d1 = await w.navigate('/search.html');
  assert.ok(d1.response.ok && /build 1/.test(d1.html));
  const i1 = await w.request(`/search-index.json?${versionOf(1)}`);
  assert.ok(i1 && i1.ok && /"build":1/.test(await i1.text()), 'the D1 page fetches its index offline');
  const i2 = await w.request(`/search-index.json?${versionOf(2)}`);
  assert.ok(i2 && i2.ok && /"build":2/.test(await i2.text()));
  w.state.offline = false;
  // A missing index is not incompleteness: a keep of the Search page fetches nothing for it.
  await w.cache.delete(abs(`/search-index.json?${versionOf(2)}`));
  const before = w.state.requests.length;
  await w.keep(['/search.html', '/search.html?q=new']);
  assert.equal(w.requestsSince(before).length, 0, 'an absent lazy file is not a reason to fetch the page again, nor is the file fetched');
  await w.request(`/search-index.json?${versionOf(2)}`);
  // Once the plain Search page is reopened online at D2, nothing names the D1 index: it is collected normally.
  await w.navigate('/search.html');
  assert.match(w.cachedHtml('/search.html'), /build 2/);
  await w.navigate('/tools/b/');
  assert.ok(!w.cached(`/search-index.json?${versionOf(1)}`), 'the D1 index, named by no cached document, is collected');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`));
  assert.ok(!w.state.requests.some((r) => r === `/search-index.json?${versionOf(1)}` && w.state.requests.indexOf(r) >= from), 'the old index address was never fetched by the worker');
});

test('T17 (audit F6): while a Search refresh waits its grace period, the index the new page fetched is protected from a collection run by another page', async () => {
  const w = worker({ extra: searchPages });
  // D1: the Search page and its index, as the script fetched it.
  await w.navigate('/search.html');
  await w.request(`/search-index.json?${versionOf(1)}`);
  assert.ok(w.cached('/search.html') && w.cached(`/search-index.json?${versionOf(1)}`));
  // D2: the same Search address reopened online. The page goes to the browser at once; its refresh in the copy waits
  // the grace period (held here). The new page's script fetches the D2 index meanwhile.
  w.deploy(2);
  w.state.holdTimers = true;
  const from = w.state.requests.length;
  const { html } = await w.navigate('/search.html');
  assert.match(html, /build 2/, 'the browser has the D2 page');
  assert.match(w.cachedHtml('/search.html'), /build 1/, 'the copy still holds D1: the refresh is waiting');
  assert.equal(w.state.timers.length, 1, 'one grace timer is pending');
  await w.request(`/search-index.json?${versionOf(2)}`);
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`), 'the script stored the D2 index');
  // Another page's visit collects before the Search refresh resumes.
  await w.navigate('/tools/a/');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`), 'the D2 index survives the collection: the refresh in flight holds it');
  assert.ok(w.cached(`/search-index.json?${versionOf(1)}`), 'the D1 index stays while the cached D1 page names it');
  // The refresh resumes and stores the D2 page, which names the D2 index.
  await w.releaseTimers();
  assert.match(w.cachedHtml('/search.html'), /build 2/, 'the D2 page is in the copy');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`), 'and its index is there for it');
  // Offline, Search works with the D2 page and its index.
  w.state.offline = true;
  const offline = await w.navigate('/search.html');
  assert.ok(offline.response.ok && /build 2/.test(offline.html));
  const index = await w.request(`/search-index.json?${versionOf(2)}`);
  assert.ok(index && index.ok && /"build":2/.test(await index.text()), 'the D2 page fetches its index offline');
  w.state.offline = false;
  // Eventual removal: nothing names the D1 index any more; the next collection drops it. No eager download anywhere.
  await w.navigate('/tools/b/');
  assert.ok(!w.cached(`/search-index.json?${versionOf(1)}`), 'the D1 index, named by no cached document, is collected');
  assert.ok(w.cached(`/search-index.json?${versionOf(2)}`));
  assert.deepEqual(w.requestsSince(from).filter((r) => r.startsWith('/search-index.json')), [`/search-index.json?${versionOf(2)}`], 'the index was fetched once, by the script, and never for a page');
});
