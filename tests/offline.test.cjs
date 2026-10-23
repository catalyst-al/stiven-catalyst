// The tools as an app that works offline: the manifest and its icons, the service worker at the root of the site
// (src/sw.js), the pages that register it (js/offline.js on the tools and the role pages) and what the worker keeps.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/sw.js');

test('the manifest names the app, its start page and icons that exist', () => {
  const manifest = JSON.parse(fs.readFileSync('src/manifest.webmanifest', 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.scope, '/');
  assert.match(manifest.start_url, /^\/tools\.html/);
  assert.ok(manifest.icons.length >= 3);
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(`src${icon.src}`), `${icon.src}: run node scripts/app-icons.mjs`);
    const png = fs.readFileSync(`src${icon.src}`);
    assert.equal(png.toString('ascii', 1, 4), 'PNG');
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes, icon.src);
  }
  assert.ok(manifest.icons.some((icon) => icon.purpose === 'maskable'), 'a maskable icon for Android');
});

test('every page links the manifest, and the tool pages register the worker', { skip: !hasSite }, () => {
  for (const file of ['index.html', 'tools/damage-control/index.html', 'de/tools/damage-control/index.html', 'sq/tools/five-whys/index.html', 'roles/shift-lead/index.html', 'tools.html', 'de/tools.html']) {
    const html = fs.readFileSync(`_site/${file}`, 'utf8');
    assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest">/, file);
    assert.match(html, /<link rel="apple-touch-icon" href="\/icons\/icon-192\.png">/, file);
    if (file.includes('tools') || file.includes('roles')) assert.match(html, /<script src="\/js\/offline\.js\?v=[0-9a-f]+" defer><\/script>/, file);
    else assert.doesNotMatch(html, /offline\.js/, file);
    // The policy allows a same-origin worker and manifest (default-src 'self').
    assert.match(html, /default-src 'self'/, file);
  }
  assert.match(fs.readFileSync('_site/tools/damage-control/index.html', 'utf8'), /data-offline-note hidden>Works offline too/);
  assert.match(fs.readFileSync('_site/de/tools/damage-control/index.html', 'utf8'), /data-offline-note hidden>Funktioniert auch offline/);
  assert.match(fs.readFileSync('_site/sq/tools/damage-control/index.html', 'utf8'), /data-offline-note hidden>Punon edhe offline/);
  for (const file of ['sw.js', 'manifest.webmanifest', 'offline.html', 'icons/icon-512.png', 'icons/icon-maskable-512.png']) assert.ok(fs.existsSync(`_site/${file}`), file);
  assert.match(fs.readFileSync('_site/offline.html', 'utf8'), /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(fs.readFileSync('_site/sitemap.xml', 'utf8'), /offline\.html/);
});

// The worker in a bare scope: its listeners are recorded, its helpers tested.
const worker = () => {
  const listeners = {};
  const self = { location: { origin: 'https://stivencatalyst.com' }, addEventListener: (name, fn) => { listeners[name] = fn; } };
  const fetched = [];
  const cache = { match: async () => null, put: async () => {}, keys: async () => [], delete: async () => {}, addAll: async () => {} };
  const caches = { open: async () => cache, keys: async () => [] };
  const fetch = async (request) => { fetched.push(typeof request === 'string' ? request : request.url); return { ok: true, type: 'basic', clone() { return this; }, text: async () => '' }; };
  new Function('self', 'caches', 'fetch', 'Response', fs.readFileSync('src/sw.js', 'utf8'))(self, caches, fetch, { error: () => 'error' });
  return { self, listeners, fetched };
};

test('the worker keeps only this site, never sw.js itself, and tells versioned files from the rest', async () => {
  const { self, listeners, fetched } = worker();
  assert.deepEqual(Object.keys(listeners).sort(), ['activate', 'fetch', 'install', 'message']);
  const { isVersioned, KEPT, PRECACHE, assetsOf } = self.SwKit;
  assert.ok(isVersioned(new URL('https://stivencatalyst.com/js/tool-kit.js?v=0123abcdef')));
  assert.ok(!isVersioned(new URL('https://stivencatalyst.com/media/tools/en/pareto.jpg')));
  assert.ok(KEPT.test('/styles-tool.css') && KEPT.test('/fonts/x.woff2') && KEPT.test('/icons/icon-192.png') && !KEPT.test('/tools/pareto/') && !KEPT.test('/feed.xml'));
  assert.deepEqual(PRECACHE, ['/offline.html', '/manifest.webmanifest', '/favicon.svg']);
  for (const file of PRECACHE) assert.ok(fs.existsSync(`src${file}`) || fs.existsSync(`src${file.replace(/\.html$/, '.njk')}`), file);
  const html = '<link rel="stylesheet" href="/styles-tool.css?v=1a"><link rel="icon" href="/favicon.svg"><script src="/js/ui-de.js?v=2b" defer></script>'
    + '<script>inline()</script><script src="https://static.cloudflareinsights.com/beacon.min.js"></script><link rel="stylesheet" href="../coaching.css?v=3c">';
  assert.deepEqual(assetsOf(html, 'https://stivencatalyst.com/de/tools/pareto/'), [
    'https://stivencatalyst.com/styles-tool.css?v=1a', 'https://stivencatalyst.com/js/ui-de.js?v=2b', 'https://stivencatalyst.com/de/tools/coaching.css?v=3c',
  ]);
  // Only GET requests of this site are answered; sw.js and other sites are left to the network.
  const seen = [];
  const answers = [];
  const event = (url, mode = 'navigate', method = 'GET') => ({ request: { url, mode, method, destination: mode === 'navigate' ? 'document' : '' }, respondWith: (p) => { seen.push(url); answers.push(p); } });
  listeners.fetch(event('https://stivencatalyst.com/tools/pareto/'));
  listeners.fetch(event('https://stivencatalyst.com/sw.js', 'no-cors'));
  listeners.fetch(event('https://static.cloudflareinsights.com/beacon.min.js', 'no-cors'));
  listeners.fetch(event('https://stivencatalyst.com/tools/pareto/', 'cors', 'POST'));
  listeners.fetch(event('https://stivencatalyst.com/js/tool-kit.js?v=ab12', 'no-cors'));
  assert.deepEqual(seen, ['https://stivencatalyst.com/tools/pareto/', 'https://stivencatalyst.com/js/tool-kit.js?v=ab12']);
  await Promise.all(answers);
  assert.deepEqual(fetched.map((url) => url.replace('https://stivencatalyst.com', '')), ['/tools/pareto/', '/js/tool-kit.js?v=ab12'], 'the page from the network first, the file once it is not in the copy');
  // A page asked for is fetched with the files it links; one already kept is not fetched again.
  fetched.length = 0;
  await listeners.message({ data: { type: 'keep', urls: ['https://stivencatalyst.com/tools/five-whys/', 'https://elsewhere.test/x'] }, waitUntil: (p) => answers.push(p) });
  await Promise.all(answers);
  assert.deepEqual(fetched, ['https://stivencatalyst.com/tools/five-whys/']);
});

test('the registration asks the worker to keep this tool, the others of its role and the Tools page', () => {
  const source = fs.readFileSync('src/js/offline.js', 'utf8');
  assert.match(source, /if \(!\("serviceWorker" in navigator\)\) return;/);
  assert.match(source, /new URL\("\.\.\/sw\.js", script\?\.src \|\| location\.href\)/);
  assert.match(source, /\.family-more-list a\[href\], \.main-nav a\[href\$="tools\.html"\]/);
  assert.match(source, /postMessage\(\{ type: "keep", urls \}\)/);
  assert.match(source, /data-offline-note/);
});
