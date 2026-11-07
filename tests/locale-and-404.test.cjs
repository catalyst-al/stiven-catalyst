// The languages a page says it is in (audit SEO-06) and the 404 page on a German or Albanian address (ARCH-01).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/404.html') && fs.existsSync('_site/de/index.html');
const built = (file) => fs.readFileSync(`_site/${file}`, 'utf8');
const ld = (html) => JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];

test('every page names its locale for Open Graph, and the others it exists in', { skip: !hasSite }, () => {
  for (const [file, own, others] of [['index.html', 'en_GB', ['de_DE', 'sq_AL']], ['de/index.html', 'de_DE', ['en_GB', 'sq_AL']], ['sq/tools/fmea/index.html', 'sq_AL', ['en_GB', 'de_DE']]]) {
    const html = built(file);
    assert.match(html, new RegExp(`<meta property="og:locale" content="${own}">`), file);
    const alternates = [...html.matchAll(/<meta property="og:locale:alternate" content="([a-z_A-Z]+)">/g)].map((m) => m[1]).sort();
    assert.deepEqual(alternates, others.sort(), file);
  }
  assert.doesNotMatch(built('404.html'), /og:locale:alternate/, 'a page without alternates names none');
});

test('the language homes describe the site in their language, and the author has one url', { skip: !hasSite }, () => {
  const website = (file) => ld(built(file)).find((node) => node['@type'] === 'WebSite');
  assert.match(website('de/index.html').description, /ist eine unabhängige Publikation/);
  assert.equal(website('de/index.html').inLanguage, 'de');
  assert.match(website('sq/index.html').description, /është një publikim i pavarur/);
  assert.match(website('index.html').description, /is an independent publication/);
  const urls = new Set(['index.html', 'de/index.html', 'sq/index.html', 'de/tools/fmea/index.html'].map((file) => ld(built(file)).find((node) => node['@type'] === 'Person').url));
  assert.equal(urls.size, 1, [...urls].join(' '));
});

test('the 404 page on a German or Albanian address speaks that language first; on an English one it is unchanged', { skip: !hasSite }, () => {
  const open = (path) => {
    const html = built('404.html').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
    const dom = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only' });
    dom.window.eval(fs.readFileSync('src/js/lost.js', 'utf8'));
    return dom.window.document;
  };
  const de = open('/de/gibt-es-nicht/');
  assert.equal(de.documentElement.lang, 'de');
  assert.equal(de.querySelector('h1').textContent, 'Diese Seite gibt es hier nicht.');
  assert.match(de.title, /^Nicht gefunden/);
  const lines = [...de.querySelectorAll('[data-lost-line]')].map((p) => p.dataset.lostLine);
  assert.deepEqual(lines, ['de', 'en', 'sq'], 'the German line comes first');
  assert.equal(de.querySelector('[data-lost-line="de"] a').getAttribute('href'), '/de/');
  assert.equal(de.querySelector('[data-lost-line="en"]').lang, 'en');
  const sq = open('/sq/nuk-ekziston');
  assert.equal(sq.documentElement.lang, 'sq');
  assert.equal(sq.querySelector('h1').textContent, 'Kjo faqe nuk është këtu.');
  const en = open('/missing/');
  assert.equal(en.documentElement.lang, 'en');
  assert.equal(en.querySelector('h1').textContent, 'That page is not here.');
  assert.match(built('404.html'), /\/js\/lost\.js/);
});
