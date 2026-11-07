// The content security policy of the built pages (audit PM-15): Google's icon service only where the CV Builder shows
// company logos, forms posting only to this site and the providers named in site.json, a referrer policy everywhere,
// and a policy on the offline page too.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/tools/cv-builder/index.html');
const built = (file) => fs.readFileSync(`_site/${file}`, 'utf8');
const csp = (html) => (html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
const directive = (policy, name) => (policy.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `)) || '');
const site = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));
const origin = (url) => (url ? new URL(url).origin : '');

test('Google\'s icon service only on the CV Builder pages', { skip: !hasSite }, () => {
  for (const file of ['tools/cv-builder/index.html', 'de/tools/cv-builder/index.html', 'sq/tools/cv-builder/index.html']) {
    assert.match(directive(csp(built(file)), 'img-src'), /https:\/\/www\.google\.com/, file);
  }
  for (const file of ['index.html', 'tools/fmea/index.html', 'tools/ats-cv/index.html', 'de/index.html']) {
    assert.doesNotMatch(directive(csp(built(file)), 'img-src'), /google/, file);
  }
});

test('forms post only to this site and the providers in site.json; every page names a referrer policy', { skip: !hasSite }, () => {
  const allowed = new Set(["'self'", origin(site.newsletter?.action), origin(site.contact?.action)].filter(Boolean));
  for (const file of ['index.html', 'tools/fmea/index.html', 'contact.html', 'de/your-challenge.html']) {
    const html = built(file);
    const sources = directive(csp(html), 'form-action').split(/\s+/).slice(1);
    assert.ok(sources.length > 0, file);
    for (const source of sources) assert.ok(allowed.has(source), `${file}: ${source}`);
    assert.doesNotMatch(directive(csp(html), 'form-action'), /\bhttps:(?!\/\/)/, `${file}: no bare https:`);
    assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin">/, file);
  }
  if (site.newsletter?.action) assert.match(directive(csp(built('index.html')), 'form-action'), new RegExp(origin(site.newsletter.action).replace(/\./g, '\\.')));
});

test('the offline page has a policy of its own, with no script', { skip: !hasSite }, () => {
  const policy = csp(built('offline.html'));
  assert.match(policy, /default-src 'self'/);
  assert.match(directive(policy, 'script-src'), /'none'/);
  assert.doesNotMatch(built('offline.html'), /<script\b/);
});
