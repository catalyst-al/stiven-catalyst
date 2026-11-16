// SEO Phase 2C: the Shift Handover pages explain, under the tool, how the template is used (EN, DE, SQ). The section
// names only what the tool does, the German one says plainly that there is no production template, it stays off the
// printed handover, and the page's metadata, canonical, hreflang and controls are as before.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const O = 'https://stivencatalyst.com';
const PAGES = {
  en: { url: '/tools/shift-handover/', title: 'Shift handover template: numbers, open issues, heads-up, safety', description: 'A structured shift handover: numbers, open issues with owners, heads-up for the next shift, safety and a handover check. Free and private.' },
  de: { url: '/de/tools/shift-handover/', title: 'Schichtübergabe-Vorlage: Zahlen, offene Punkte, Hinweise', description: 'Eine strukturierte Schichtübergabe: Zahlen, offene Punkte mit Verantwortlichen, Hinweise für die nächste Schicht, Sicherheit und ein Check. Kostenlos.' },
  sq: { url: '/sq/tools/shift-handover/', title: 'Dorëzimi i turnit | Stiven Catalyst', description: 'Dorëzim turni i strukturuar: numrat, çështjet e hapura me përgjegjës, paralajmërimet për turnin tjetër, siguria dhe një kontroll. Falas dhe privat.' },
};
const file = (url) => `_site${url}index.html`;
const hasSite = Object.values(PAGES).every((p) => fs.existsSync(file(p.url)));
// <k-p> wraps a kerned pair of letters inside a word (lib/title-fit.js): it goes without a space, other tags with one.
const text = (html) => html.replace(/<\/?k-p\b[^>]*>/g, '').replace(/<[^>]+>/g, ' ').replace(/&shy;/g, '').replace(/­/g, '').replace(/&nbsp;| /g, ' ').replace(/\s+/g, ' ');
const guideOf = (html) => html.match(/<section class="shell legal sh-guide"[\s\S]*?<\/section>/)?.[0] ?? '';

test('each Shift Handover page has the guide section under the tool, with a heading and sub-headings', { skip: !hasSite }, () => {
  for (const [lang, page] of Object.entries(PAGES)) {
    const html = fs.readFileSync(file(page.url), 'utf8');
    const guide = guideOf(html);
    assert.ok(guide, `${lang}: the guide section is there`);
    assert.match(guide, /aria-labelledby="sh-guide-title"/);
    assert.equal((guide.match(/<h2\b[^>]*id="sh-guide-title"/g) || []).length, 1, `${lang}: one h2`);
    assert.ok((guide.match(/<h3\b/g) || []).length >= 5, `${lang}: sub-headings to scan`);
    assert.ok(html.indexOf('sh-guide') > html.indexOf('data-history-section'), `${lang}: below the tool, after its history`);
    assert.ok(html.indexOf('sh-guide') < html.indexOf('tool-essays'), `${lang}: before the stories and the guide book`);
    const words = text(guide).split(' ').filter(Boolean).length;
    assert.ok(words > 200 && words < 520, `${lang}: compact (${words} words)`);
    assert.match(text(guide), /(invented|erfundene|trilluar)/i, `${lang}: the example says it is invented`);
  }
});

test('English names the template, handoff and turnover; German explains production without claiming a template', { skip: !hasSite }, () => {
  const en = text(guideOf(fs.readFileSync(file(PAGES.en.url), 'utf8')));
  for (const term of ['shift handover template', 'shift handoff', 'shift turnover', 'handover check', 'open issue', 'owner', 'printed', 'PDF']) {
    assert.ok(en.toLowerCase().includes(term.toLowerCase()), `EN: ${term}`);
  }
  const deHtml = fs.readFileSync(file(PAGES.de.url), 'utf8');
  const de = text(guideOf(deHtml));
  for (const term of ['Schichtübergabe-Vorlage', 'Schichtübergabe-Protokoll', 'Schichtübergabe in der Produktion', 'Offene Punkte und Verantwortlichkeiten', 'Übergabe an die nächste Schicht', 'Drucken und als PDF speichern']) {
    assert.ok(de.includes(term), `DE: ${term}`);
  }
  assert.ok(de.includes('Eine eigene Vorlage für die Produktion gibt es nicht.'), 'DE: says there is no production template');
  assert.ok(de.includes('Vorlage „Lager“'), 'DE: names the existing template to start from');
  // The tool itself offers no production template, so the page must not either.
  const options = [...deHtml.matchAll(/<select id="sh-template"[\s\S]*?<\/select>/g)][0][0];
  assert.doesNotMatch(options, /Produktion/);
  const sq = text(guideOf(fs.readFileSync(file(PAGES.sq.url), 'utf8')));
  for (const term of ['model', 'çështje', 'përgjegjës', 'PDF', 'kod transferimi']) assert.ok(sq.includes(term), `SQ: ${term}`);
});

test('metadata, canonical, hreflang, sitemap and the tool controls are unchanged', { skip: !hasSite }, async () => {
  const { parsePage } = await import('../lib/seo-audit.js');
  const sitemap = fs.readFileSync('_site/sitemap.xml', 'utf8');
  const hreflang = { en: `${O}${PAGES.en.url}`, de: `${O}${PAGES.de.url}`, sq: `${O}${PAGES.sq.url}`, 'x-default': `${O}${PAGES.en.url}` };
  for (const [lang, page] of Object.entries(PAGES)) {
    const html = fs.readFileSync(file(page.url), 'utf8');
    const p = parsePage(html, page.url);
    assert.equal(p.title, page.title, `${lang}: title`);
    assert.equal(p.description, page.description, `${lang}: description`);
    assert.deepEqual(p.canonicals, [`${O}${page.url}`], `${lang}: canonical`);
    assert.deepEqual(p.hreflang, hreflang, `${lang}: hreflang`);
    assert.equal(p.noindex, false);
    assert.equal(sitemap.split(`<loc>${O}${page.url}</loc>`).length - 1, 1, `${lang}: in the sitemap once`);
    for (const control of ['data-handover', 'data-add-issue', 'data-example', 'data-copy', 'data-send', 'data-pdf', 'data-print', 'data-close', 'data-ack', 'data-send-dialog']) {
      assert.ok(html.includes(control), `${lang}: ${control}`);
    }
  }
});

test('the guide stays off the printed handover', () => {
  const css = fs.readFileSync('src/css/06-tools.css', 'utf8');
  const print = css.match(/\.dl-setup,[^{]*\.sh-history,[^{]*\{ display: none !important; \}/)?.[0] ?? '';
  assert.match(print, /\.sh-guide\b/);
});
