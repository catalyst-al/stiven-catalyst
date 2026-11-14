// The SEO audit (lib/seo-audit.js, scripts/seo-audit.mjs): first on a small site written for the test, where each
// kind of problem is planted once and must be found, and kept apart from the intentional exclusions; then on the
// real build, which must have no errors, keep exactly the pages excluded on purpose out of search, and serve every
// priority page of the backlog (docs/seo/priority-urls.json).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const hasSite = fs.existsSync('_site/index.html');
const O = 'https://stivencatalyst.com';

// One page of the fixture site, as the layout writes it.
const page = ({ lang = 'en', url, title, description = `About ${title}.`, canonical = `${O}${url}`, alternates = {}, noindex = false, body = '', nav = '', ogUrl, jsonLd = '{"@type":"WebPage"}' }) => `<!doctype html>
<html lang="${lang}">
<head>
  <title>${title}</title>
  <meta name="description" content="${description}">
${noindex ? '  <meta name="robots" content="noindex">' : `  <link rel="canonical" href="${canonical}">
${Object.entries(alternates).map(([code, href]) => `  <link rel="alternate" hreflang="${code}" href="${O}${href}">`).join('\n')}
  <meta property="og:url" content="${ogUrl ?? canonical}">
  <script type="application/ld+json">${jsonLd}</script>`}
</head>
<body><header>${nav}</header><main id="main">${body}</main><footer></footer></body>
</html>`;

const write = (root, file, text) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
};

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-audit-'));
  const tool = { en: '/tools/a/', de: '/de/tools/a/', 'x-default': '/tools/a/' };
  const nav = '<a href="/">Home</a> <a href="/tools/a/">A</a>';
  write(root, 'index.html', page({ url: '/', title: 'Home', nav, body: '<a href="/tools/a/">A</a> <a href="/about.html">About</a> <a href="/tools/b">B without slash</a> <a href="/missing.html">gone</a> <a href="/about">alias</a> <a href="https://example.org/x">elsewhere</a> <a href="mailto:a@b.c">mail</a>' }));
  write(root, 'tools/a/index.html', page({ url: '/tools/a/', title: 'Tool A', alternates: tool, nav, body: '<a href="/de/tools/a/">Deutsch</a>' }));
  write(root, 'de/tools/a/index.html', page({ lang: 'de', url: '/de/tools/a/', title: 'Tool A', alternates: tool, nav }));
  // hreflang that does not link back: B names C as its German page, C names nobody.
  write(root, 'tools/b/index.html', page({ url: '/tools/b/', title: 'Tool B', alternates: { en: '/tools/b/', de: '/de/tools/b/' }, nav, body: '<a href="/tools/a/">A</a>' }));
  write(root, 'de/tools/b/index.html', page({ lang: 'de', url: '/de/tools/b/', title: 'Werkzeug B', nav }));
  // A canonical that points elsewhere, a duplicate title, an og:url that differs, broken JSON-LD.
  write(root, 'about.html', page({ url: '/about.html', title: 'Tool B', canonical: `${O}/`, nav }));
  write(root, 'contact.html', page({ url: '/contact.html', title: 'Contact', ogUrl: `${O}/elsewhere.html`, jsonLd: '{broken', nav }));
  // A page nobody links to and the sitemap leaves out.
  write(root, 'lonely.html', page({ url: '/lonely.html', title: 'Lonely' }));
  // A noindex nobody asked for, and the ones that are intentional.
  write(root, 'hidden.html', page({ url: '/hidden.html', title: 'Hidden', noindex: true, nav }));
  write(root, '404.html', page({ url: '/404.html', title: 'Not found', noindex: true }));
  write(root, 'de/impressum.html', page({ lang: 'de', url: '/de/impressum.html', title: 'Impressum', noindex: true }));
  write(root, 'guide-print/part.html', '<section>a fragment, not a page</section>');
  const loc = (p) => `  <url><loc>${O}${p}</loc></url>`;
  write(root, 'sitemap.xml', `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    '/', '/tools/a/', '/de/tools/a/', '/tools/b/', '/de/tools/b/', '/about.html', '/contact.html',
    '/hidden.html', // noindex but listed
    '/tools/b', // redirects
    '/gone.html', // 404
    '/tools/a/', // twice
  ].map(loc).join('\n')}\n</urlset>\n`);
  write(root, 'robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${O}/sitemap.xml\n`);
  return root;
};

const load = () => import('../lib/seo-audit.js');
const found = (report, check, url, detail) => report.errors.concat(report.warnings).some((i) => i.check === check && (!url || i.url === url) && (!detail || detail.test(i.detail)));

test('GitHub Pages answers: a folder with a slash is 200, without it 301, a missing address 404, "/a" serves a.html', async () => {
  const { resolvePath } = await load();
  const root = fixture();
  assert.equal(resolvePath(root, '/tools/a/').status, 200);
  assert.deepEqual(resolvePath(root, '/tools/a'), { status: 301, location: '/tools/a/' });
  assert.equal(resolvePath(root, '/nothing/').status, 404);
  assert.equal(resolvePath(root, '/nothing.html').status, 404);
  assert.equal(resolvePath(root, '/about').alias, '/about.html');
});

test('the audit finds each planted problem and reports it as an error or a warning', async () => {
  const { audit } = await load();
  const report = audit(fixture(), { priority: [{ url: '/tools/a/' }, { url: '/gone/' }], minContextualLinks: 3 });
  // Sitemap.
  assert.ok(found(report, 'sitemap', '/hidden.html', /noindex/), 'a noindex page in the sitemap');
  assert.ok(found(report, 'sitemap', '/tools/b', /301/), 'a sitemap address that redirects');
  assert.ok(found(report, 'sitemap', '/gone.html', /404/), 'a sitemap address that is missing');
  assert.ok(found(report, 'sitemap', '/tools/a/', /more than once/), 'a sitemap address listed twice');
  assert.ok(found(report, 'sitemap', '/about.html', /canonical/), 'a sitemap address whose canonical is elsewhere');
  assert.ok(found(report, 'sitemap', '/lonely.html', /missing from the sitemap/), 'an indexable page left out');
  // Canonical, hreflang, og:url, structured data.
  assert.ok(found(report, 'canonical', '/about.html', /not the page's own address/));
  assert.ok(found(report, 'hreflang', '/tools/b/', /does not link back/));
  assert.ok(!found(report, 'hreflang', '/tools/a/'), 'reciprocal hreflang is not a problem');
  assert.ok(found(report, 'og-url', '/contact.html'));
  assert.ok(found(report, 'structured-data', '/contact.html'));
  // Links.
  assert.ok(found(report, 'broken-link', '/', /missing\.html/));
  assert.ok(found(report, 'redirect-link', '/', /\/tools\/b\b.*redirects/));
  assert.ok(found(report, 'alias-link', '/', /\/about\.html/));
  assert.ok(!report.errors.concat(report.warnings).some((i) => /example\.org|mailto/.test(i.detail)), 'links elsewhere are not checked');
  // Indexing.
  assert.ok(found(report, 'noindex', '/hidden.html', /not on the list/), 'an unexpected noindex is an error');
  // Duplicates: "Tool B" on /tools/b/ and /about.html is one; "Tool A" in English and German (translations) is not.
  assert.ok(report.duplicateTitles.some((d) => d.value === 'Tool B' && d.urls.length === 2));
  assert.ok(!report.duplicateTitles.some((d) => d.value === 'Tool A'), 'a translation may share its title');
  // Internal links.
  assert.ok(report.orphans.includes('/lonely.html'));
  assert.ok(found(report, 'weak-internal-links', '/tools/a/'), 'a priority page with fewer than 3 links from text');
  assert.ok(found(report, 'priority', '/gone/', /404/), 'a priority page that is missing');
  // Errors and warnings stay apart: duplicates, redirects and orphans do not fail the build.
  for (const check of ['duplicate-title', 'redirect-link', 'alias-link', 'orphan', 'weak-internal-links']) {
    assert.ok(!report.errors.some((i) => i.check === check), `${check} is a warning`);
  }
});

test('intentional exclusions are reported apart from the problems, with their reason', async () => {
  const { audit } = await load();
  const report = audit(fixture());
  assert.deepEqual(report.intentional.map((i) => i.url).sort(), ['/404.html', '/de/impressum.html']);
  assert.ok(report.intentional.every((i) => i.reason && !i.inSitemap));
  assert.ok(!report.errors.some((i) => i.url === '/404.html' || i.url === '/de/impressum.html'));
  assert.ok(!report.errors.concat(report.warnings).some((i) => i.url.startsWith('/guide-print/')), 'a fragment is not a page');
});

test('the command exits 1 on errors, prints Markdown and writes the JSON report', async () => {
  const { execFileSync } = require('node:child_process');
  const root = fixture();
  const json = path.join(root, 'report.json');
  let status = 0;
  let out = '';
  try { out = execFileSync('node', ['scripts/seo-audit.mjs', '--site', root, '--json', json], { encoding: 'utf8' }); } catch (error) { status = error.status; out = error.stdout; }
  assert.equal(status, 1);
  assert.match(out, /^# SEO audit of the built site/m);
  assert.match(out, /## Intentional exclusions \(not problems\)/);
  assert.ok(JSON.parse(fs.readFileSync(json, 'utf8')).errors.length > 0);
});

test('the built site: no SEO errors, and only the pages excluded on purpose are noindex', { skip: !hasSite }, async () => {
  const { audit } = await load();
  const config = JSON.parse(fs.readFileSync('docs/seo/priority-urls.json', 'utf8'));
  const report = audit('_site', { priority: config.urls, minContextualLinks: config.minContextualLinks });
  assert.deepEqual(report.errors, []);
  const excluded = report.intentional.map((i) => i.url).sort();
  assert.deepEqual(excluded, [
    '/404.html', '/datenschutz.html', '/de/datenschutz.html', '/de/impressum.html', '/de/search.html', '/de/shelf.html',
    '/impressum.html', '/offline.html', '/search.html', '/shelf.html', '/sq/datenschutz.html', '/sq/impressum.html',
    '/sq/search.html', '/sq/shelf.html',
  ]);
  assert.equal(report.summary.sitemapUrls, report.summary.indexable, 'every indexable page is in the sitemap, and only those');
  // Every HTML page of the backlog answers 200, is indexable, in the sitemap, self-canonical and in three languages.
  for (const row of report.priority.filter((r) => !/\.(pdf|xml|js)$/.test(r.url))) {
    assert.equal(row.status, 200, row.url);
    assert.ok(row.indexable && row.inSitemap && row.canonicalOk, row.url);
    assert.deepEqual(row.hreflang, ['de', 'en', 'sq'], row.url);
  }
});
