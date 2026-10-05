// Anonymous visit counts (Cloudflare Web Analytics): the beacon runs on the writing pages only, the Content
// Security Policy allows exactly it there, and the tools and role pages load nothing from outside. The privacy
// policy describes it in every language.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const site = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const csp = (html) => (html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
const hasSite = fs.existsSync('_site/index.html');

test('the analytics token is set', () => {
  assert.match(site.analytics.cloudflareToken, /^[0-9a-f]{32}$/);
});

test('the beacon runs on the writing pages and is allowed there', { skip: !hasSite }, () => {
  for (const file of ['index.html', 'sq/index.html', 'start.html', 'de/insights/kpis-do-not-improve-in-excel/index.html', 'sq/field-notes.html', 'search.html']) {
    const html = built(file);
    assert.ok(html.includes(`src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${site.analytics.cloudflareToken}"}'`), `${file}: beacon`);
    assert.match(csp(html), /script-src [^;]*https:\/\/static\.cloudflareinsights\.com/, `${file}: script-src`);
    assert.match(csp(html), /connect-src [^;]*https:\/\/cloudflareinsights\.com/, `${file}: connect-src`);
  }
});

test('the tools and the role pages load nothing from Cloudflare', { skip: !hasSite }, () => {
  for (const file of ['tools/pareto/index.html', 'sq/tools/shift-handover/index.html', 'de/tools/cv-builder/index.html', 'roles/shift-lead/index.html']) {
    const html = built(file);
    assert.ok(!html.includes('cloudflareinsights'), `${file}`);
  }
});

test('the privacy policy describes the visit counts in every language', { skip: !hasSite }, () => {
  for (const [file, words] of [['de/datenschutz.html', 'Cloudflare Web Analytics'], ['sq/datenschutz.html', 'Cloudflare Web Analytics'], ['datenschutz.html', 'Cloudflare Web Analytics']]) {
    const html = built(file);
    assert.ok(html.includes(words), `${file}: named`);
    assert.ok(/101 Townsend St/.test(html), `${file}: provider address`);
    assert.ok(!/setzt keine Cookies und verwendet keine Analyse/.test(html) && !/sets no cookies and uses no analytics/.test(html) && !/nuk vendos cookies dhe nuk përdor shërbime analize/.test(html), `${file}: no outdated promise`);
  }
});
