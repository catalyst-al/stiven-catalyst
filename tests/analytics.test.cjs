// Visit counts are switched off (audit P2-09 / A-01, owner's decision of 7 November 2026): Cloudflare Web Analytics
// stays off the whole site until its configuration and privacy are reviewed. With `analytics.cloudflareToken` empty,
// base.njk loads no beacon and the Content Security Policy allows nothing of Cloudflare's analytics, and the privacy
// policy says, in every language, that the site uses no analytics. Team sync, a separate Cloudflare service that the
// visitor turns on, is not affected. To switch the visit counts on again, set the token in src/_data/site.json and
// change this file in the same pull request.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const site = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const csp = (html) => (html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
const hasSite = fs.existsSync('_site/index.html');
const pages = (dir = '_site') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? pages(file) : entry.name.endsWith('.html') ? [file] : [];
});

test('the analytics token is empty: visit counts are off', () => {
  assert.equal(site.analytics.cloudflareToken, '');
});

test('no built page loads the beacon or allows Cloudflare analytics in its policy', { skip: !hasSite }, () => {
  const all = pages();
  assert.ok(all.length > 800, `the whole site is checked (${all.length} pages)`);
  const loading = all.filter((file) => /cloudflareinsights|data-cf-beacon/.test(fs.readFileSync(file, 'utf8')));
  assert.deepEqual(loading, [], 'pages that still name Cloudflare analytics');
  // Every kind of page named in the decision, in three languages: the Tools pages, Search, essays, reflections,
  // publications, the homepage and a tool page.
  for (const file of [
    'tools.html', 'de/tools.html', 'sq/tools.html',
    'search.html', 'de/search.html', 'sq/search.html',
    'index.html', 'de/insights/kpis-do-not-improve-in-excel/index.html', 'reflections.html', 'publications.html',
    'sq/field-notes.html', 'tools/pareto/index.html',
  ]) {
    const policy = csp(built(file));
    assert.ok(policy.startsWith("default-src 'self'"), `${file}: a policy`);
    assert.doesNotMatch(policy, /cloudflareinsights/, `${file}: no analytics host in the policy`);
    assert.match(policy, /script-src 'self' [^;]*;/, `${file}: scripts from this site only, plus hashed inline ones`);
    assert.doesNotMatch(policy.match(/script-src [^;]*/)[0], /https:/, `${file}: no outside script host`);
  }
});

test('Team sync, a separate Cloudflare service, is still allowed where it runs', { skip: !hasSite }, () => {
  const sync = new URL(site.sync.endpoint).origin;
  for (const file of ['tools.html', 'de/tools.html', 'sq/tools.html', 'tools/pareto/index.html']) {
    assert.match(csp(built(file)), new RegExp(`connect-src [^;]*${sync.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `${file}: team sync`);
  }
});

test('the privacy policy says, in every language, that the site uses no analytics', { skip: !hasSite }, () => {
  for (const [file, heading, sentence] of [
    ['datenschutz.html', 'No cookies, no tracking', 'uses no analytics or tracking services'],
    ['de/datenschutz.html', 'Keine Cookies, kein Tracking', 'verwendet keine Analyse- oder Tracking-Dienste'],
    ['sq/datenschutz.html', 'Pa cookies, pa gjurmim', 'nuk përdor shërbime analize apo gjurmimi'],
  ]) {
    const html = built(file);
    assert.ok(html.includes(heading), `${file}: heading`);
    assert.ok(html.includes(sentence), `${file}: no analytics`);
    assert.ok(!html.includes('Cloudflare Web Analytics'), `${file}: the visit counts are no longer described`);
    assert.ok(!/anonyme Besuchszahlen|anonymous visit counts|numërimin anonim të vizitave/.test(html), `${file}: no word of visit counts`);
    // Team sync is still described, with its provider.
    assert.ok(/101 Townsend St/.test(html) && /Durable Objects/.test(html), `${file}: team sync still described`);
  }
});
