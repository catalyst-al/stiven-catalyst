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

test('the report says its statuses are modelled, and marks indexing as n/a for non-HTML addresses', async () => {
  const { audit, toMarkdown } = await load();
  const root = fixture();
  write(root, 'feed.xml', '<feed/>');
  const md = toMarkdown(audit(root, { priority: [{ url: '/feed.xml' }, { url: '/tools/a/' }] }));
  assert.match(md, /modelled from the built files/);
  assert.match(md, /\| `\/feed\.xml` \| 200 \| n\/a \| n\/a \| n\/a \|/);
  assert.match(md, /\| `\/tools\/a\/` \| 200 \| yes \| yes \| yes \|/);
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

// A small site with nothing wrong (fictional pages): each test below plants one problem in it, so what the audit
// reports comes from that problem alone.
const cleanSite = ({ robots = `User-agent: *\nAllow: /\n\nSitemap: ${O}/sitemap.xml\n`, lastmod = '2026-11-14' } = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-clean-'));
  const pair = { en: '/tools/fictional/', de: '/de/tools/fictional/', 'x-default': '/tools/fictional/' };
  const ld = '{"@context":"https://schema.org","@type":"WebPage"}';
  const links = '<a href="/">Home</a> <a href="/tools/fictional/">Fictional tool</a> <a href="/de/tools/fictional/">Deutsch</a> <a href="/team/">Team</a>';
  write(root, 'index.html', page({ url: '/', title: 'Fictional home', description: 'A fictional home page.', jsonLd: ld, body: links }));
  write(root, 'tools/fictional/index.html', page({ url: '/tools/fictional/', title: 'Fictional tool', description: 'A fictional tool page.', alternates: pair, jsonLd: ld, body: links }));
  write(root, 'de/tools/fictional/index.html', page({ lang: 'de', url: '/de/tools/fictional/', title: 'Fiktives Werkzeug', description: 'Eine fiktive Werkzeugseite.', alternates: pair, jsonLd: ld, body: links }));
  write(root, 'team/index.html', page({ url: '/team/', title: 'Fictional team', description: 'A fictional team page.', jsonLd: ld, body: links }));
  write(root, '404.html', page({ url: '/404.html', title: 'Not found', noindex: true }));
  const urls = ['/', '/tools/fictional/', '/de/tools/fictional/', '/team/'];
  write(root, 'sitemap.xml', `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${O}${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  write(root, 'robots.txt', robots);
  return root;
};
const replaceIn = (root, file, from, to) => {
  const full = path.join(root, file);
  const text = fs.readFileSync(full, 'utf8');
  assert.ok(text.includes(from), `${file} contains ${from}`);
  fs.writeFileSync(full, text.replace(from, to));
};

test('the clean fictional site has no errors and no warnings', async () => {
  const { audit } = await load();
  const report = audit(cleanSite());
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.warnings, []);
});

test('robots.txt is read the way Google reads it: groups, the longest rule, Allow on a tie, * and $', async () => {
  const { parseRobots, robotsBlocks } = await load();
  // The regression: Disallow /t must not block /tools/ when Allow /tools/ is longer.
  let g = parseRobots('User-agent: *\nDisallow: /t\nAllow: /tools/\n');
  assert.equal(robotsBlocks(g, 'Googlebot', '/tools/fictional/'), false, 'Allow /tools/ is the longer match');
  assert.equal(robotsBlocks(g, 'Googlebot', '/team/'), true, 'Disallow /t still blocks /team/');
  // Allow wins a tie of equal length.
  g = parseRobots('User-agent: *\nDisallow: /tools/\nAllow: /tools/\n');
  assert.equal(robotsBlocks(g, '*', '/tools/x'), false);
  // User-agent lines in a row share their rules; a comment and an empty Disallow change nothing.
  g = parseRobots('# fictional\nUser-agent: ExampleBot\nUser-agent: *\nDisallow: /private/ # comment\n\nUser-agent: OtherBot\nDisallow:\n');
  assert.equal(robotsBlocks(g, 'Googlebot', '/private/a'), true, 'the * group shared with ExampleBot');
  assert.equal(robotsBlocks(g, 'OtherBot', '/private/a'), false, 'an empty Disallow allows everything');
  // A Googlebot group replaces the * group for Googlebot, and two Googlebot groups are merged.
  g = parseRobots('User-agent: *\nDisallow: /\n\nUser-agent: Googlebot\nAllow: /tools/\n\nUser-agent: googlebot\nDisallow: /tools/secret\n');
  assert.equal(robotsBlocks(g, 'Googlebot', '/tools/fictional/'), false);
  assert.equal(robotsBlocks(g, 'Googlebot', '/tools/secret/x'), true);
  assert.equal(robotsBlocks(g, 'Googlebot', '/team/'), false, 'no Googlebot rule matches: allowed');
  assert.equal(robotsBlocks(g, '*', '/team/'), true);
  // Wildcards and the end anchor.
  g = parseRobots('User-agent: *\nDisallow: /*.pdf$\nDisallow: /*fictional-draft\n');
  assert.equal(robotsBlocks(g, '*', '/media/a.pdf'), true);
  assert.equal(robotsBlocks(g, '*', '/media/a.pdf.html'), false, '$ anchors the end');
  assert.equal(robotsBlocks(g, '*', '/tools/fictional-draft/'), true);
  assert.equal(robotsBlocks(g, '*', '/tools/fictional/'), false);
});

test('the audit: Disallow /t with Allow /tools/ blocks nothing the sitemap offers under /tools/', async () => {
  const { audit } = await load();
  const report = audit(cleanSite({ robots: `User-agent: *\nDisallow: /t\nAllow: /tools/\n\nSitemap: ${O}/sitemap.xml\n` }));
  assert.ok(!report.errors.some((e) => e.url.startsWith('/tools/') || e.url.startsWith('/de/')), 'no false error under /tools/');
  assert.ok(found(report, 'robots', '/team/', /Googlebot and \*/), 'the page /t really blocks is still reported');
  assert.ok(found(report, 'sitemap', '/team/', /disallows/));
});

test('a robots rule for Googlebot alone, or behind a grouped user-agent, is found', async () => {
  const { audit } = await load();
  let report = audit(cleanSite({ robots: `User-agent: Googlebot\nDisallow: /tools/\n\nSitemap: ${O}/sitemap.xml\n` }));
  assert.ok(found(report, 'robots', '/tools/fictional/', /Googlebot/));
  report = audit(cleanSite({ robots: `User-agent: *\nUser-agent: Googlebot\nDisallow: /tools/\n\nSitemap: ${O}/sitemap.xml\n` }));
  assert.ok(found(report, 'robots', '/tools/fictional/', /Googlebot and \*/));
});

test('a missing og:url and a missing x-default are warnings', async () => {
  const { audit } = await load();
  const root = cleanSite();
  replaceIn(root, 'team/index.html', `  <meta property="og:url" content="${O}/team/">\n`, '');
  replaceIn(root, 'de/tools/fictional/index.html', `  <link rel="alternate" hreflang="x-default" href="${O}/tools/fictional/">\n`, '');
  const report = audit(root);
  assert.deepEqual(report.errors, []);
  assert.ok(found(report, 'og-url', '/team/', /no og:url/));
  assert.ok(found(report, 'hreflang', '/de/tools/fictional/', /without x-default/));
  assert.ok(!found(report, 'hreflang', '/tools/fictional/'), 'the page that keeps x-default is not reported');
});

test('JSON-LD: checked in the body too; no parse or no @context is an error, an item without @type a warning', async () => {
  const { audit, checkJsonLd } = await load();
  assert.deepEqual(checkJsonLd('{"@context":"https://schema.org","@graph":[{"@type":"WebSite"},{"@type":"Person"}]}'), { parses: true, missingContext: false, missingType: false });
  assert.deepEqual(checkJsonLd('[{"@context":"https://schema.org","@type":"WebPage"},{"@type":"Thing"}]'), { parses: true, missingContext: true, missingType: false });
  assert.equal(checkJsonLd('{"@context":"https://schema.org","@graph":[{"name":"x"}]}').missingType, true);
  const root = cleanSite();
  replaceIn(root, 'team/index.html', '</main>', '</main><script type="application/ld+json">{broken</script>');
  replaceIn(root, 'tools/fictional/index.html', '{"@context":"https://schema.org","@type":"WebPage"}', '{"@type":"WebPage"}');
  replaceIn(root, 'de/tools/fictional/index.html', '{"@context":"https://schema.org","@type":"WebPage"}', '{"@context":"https://schema.org"}');
  const report = audit(root);
  assert.ok(found(report, 'structured-data', '/team/', /block 2 \(body\) does not parse/));
  assert.ok(report.errors.some((e) => e.check === 'structured-data' && e.url === '/tools/fictional/' && /no @context/.test(e.detail)));
  assert.ok(report.warnings.some((w) => w.check === 'structured-data' && w.url === '/de/tools/fictional/' && /without @type/.test(w.detail)));
  assert.ok(!report.errors.some((e) => e.url === '/de/tools/fictional/'), 'a missing @type is not an error');
});

test('titles and descriptions that differ only in capitals or whitespace are duplicates', async () => {
  const { audit } = await load();
  const root = cleanSite();
  replaceIn(root, 'team/index.html', '<title>Fictional team</title>', '<title>FICTIONAL   home</title>');
  replaceIn(root, 'team/index.html', 'content="A fictional team page."', 'content="A  fictional HOME page. "');
  const report = audit(root);
  assert.ok(report.duplicateTitles.some((d) => d.urls.join() === '/,/team/'));
  assert.ok(report.duplicateDescriptions.some((d) => d.urls.join() === '/,/team/'));
  assert.ok(!report.errors.length, 'duplicates are warnings');
});

test('sitemap lastmod: the W3C forms pass, anything else is an error', async () => {
  const { audit, validLastmod } = await load();
  for (const ok of ['2026', '2026-11', '2026-11-14', '2026-11-14T08:30Z', '2026-11-14T08:30:05+01:00', '2026-11-14T08:30:05.123Z', '2024-02-29']) assert.equal(validLastmod(ok), true, ok);
  for (const bad of ['14.11.2026', '2026-13-01', '2026-02-30', '2025-02-29', '2026-11-14T25:00Z', '2026-11-14T08:30', 'yesterday', '']) assert.equal(validLastmod(bad), false, bad);
  assert.ok(found(audit(cleanSite({ lastmod: '2026-02-30' })), 'sitemap', '/sitemap.xml', /not a valid W3C date/));
  assert.deepEqual(audit(cleanSite({ lastmod: '2026-11-14T08:30:05+01:00' })).errors, []);
});

test('the command exits 2 and says why when there is no built site', () => {
  const { spawnSync } = require('node:child_process');
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-empty-'));
  const run = spawnSync('node', ['scripts/seo-audit.mjs', '--site', empty], { encoding: 'utf8' });
  assert.equal(run.status, 2);
  assert.match(run.stderr, /No built site/);
  assert.equal(run.stdout, '');
});

test('Search Console exports: ignored wherever unpacked, and none is tracked', { skip: !fs.existsSync('.git') }, () => {
  const { execFileSync, spawnSync } = require('node:child_process');
  const exportName = /(^|\/)(Queries|Pages|Countries|Devices|Dates|Chart|Filters|Table|Metadata|Search appearance|Critical issues|Non-critical issues)\.csv$|Performance-on-Search|Coverage-(Validation|Drilldown)|search-console|Search-Console|(^|\/)gsc-export|^docs\/seo\/private\//;
  const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  assert.deepEqual(tracked.filter((f) => exportName.test(f)), [], 'no Search Console export is tracked');
  // Fictional paths: each must be ignored, so `git add .` never picks one up.
  const ignored = (f) => spawnSync('git', ['check-ignore', '-q', '--no-index', f]).status === 0;
  for (const f of ['Queries.csv', 'downloads/fictional-export/Pages.csv', 'docs/seo/Countries.csv', 'x/Devices.csv', 'x/Dates.csv', 'x/Chart.csv', 'x/Filters.csv', 'x/Table.csv', 'x/Metadata.csv', 'x/Search appearance.csv', 'x/Critical issues.csv', 'x/Non-critical issues.csv', 'docs/seo/private/notes.md', 'fictional-Performance-on-Search-2026.zip', 'fictional-Coverage-Drilldown.zip', 'gsc-export-fictional.xlsx']) {
    assert.ok(ignored(f), `${f} is ignored`);
  }
  // Files of the project are not caught by these names.
  for (const f of ['docs/seo/BACKLOG.md', 'docs/seo/priority-urls.json', 'lib/seo-audit.js', 'src/pages.njk', 'tests/fixtures/queries.json']) {
    assert.ok(!ignored(f), `${f} is not ignored`);
  }
});
