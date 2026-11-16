// SEO Phase 2B: the German Damage Control page names its subject, "Schadenskontrolle" (its heading), at the start of
// its search title and in its description. Before, the title was fitted to "Schadensquote berechnen" and neither
// field carried the word. The address, the canonical and the EN/DE/SQ hreflang stay as they were.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const file = '_site/de/tools/damage-control/index.html';
const O = 'https://stivencatalyst.com';

test('German Damage Control: the title starts with "Schadenskontrolle", the description names it, canonical and hreflang hold', { skip: !fs.existsSync(file) }, async () => {
  const { parsePage } = await import('../lib/seo-audit.js');
  const html = fs.readFileSync(file, 'utf8');
  const page = parsePage(html, '/de/tools/damage-control/');

  assert.equal(page.title, 'Schadenskontrolle: Schadensquote und Schadensprotokoll für Lager');
  assert.ok(page.title.startsWith('Schadenskontrolle'), page.title);
  assert.ok([...page.title].length <= 65, 'the title is shown whole, not fitted');
  assert.match(page.description, /Schadenskontrolle/);
  assert.ok([...page.description].length <= 160, 'the description fits a search result');

  assert.equal(page.lang, 'de');
  assert.deepEqual(page.canonicals, [`${O}/de/tools/damage-control/`]);
  assert.deepEqual(page.hreflang, {
    en: `${O}/tools/damage-control/`,
    de: `${O}/de/tools/damage-control/`,
    sq: `${O}/sq/tools/damage-control/`,
    'x-default': `${O}/tools/damage-control/`,
  });
  assert.equal(page.noindex, false);
  // The visible heading is unchanged.
  assert.match(html, /<h1\b[^>]*>Schadens&shy;kontrolle<\/h1>/);
});
