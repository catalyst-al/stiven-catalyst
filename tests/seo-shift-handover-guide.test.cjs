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

test('what the guide says about privacy matches the tool: no absolute promise, team sync and sharing named', { skip: !hasSite }, () => {
  // A handover leaves the device when it is printed, copied, saved or sent, and as an encrypted copy when a team uses
  // team sync (js/team-sync.js); what is shared through another service passes through it.
  const claims = {
    en: { must: [/encrypted with a transfer code/, /team sync/, /passes through that service/, /left out unless you include them/], never: /nothing is uploaded|never leaves|completely private/i },
    de: { must: [/verschlüsselt mit einem Übergabecode/, /Team-Synchronisierung/, /läuft über diesen Dienst/, /nur mitgesendet, wenn Sie dies auswählen/], never: /hochgeladen wird nichts|verlässt nie/i },
    sq: { must: [/të enkriptuar me një kod transferimi/, /sinkronizimin e ekipit/, /kalon përmes atij shërbimi/, /nuk përfshihen, përveç nëse/], never: /asgjë nuk ngarkohet|nuk largohet kurrë/i },
  };
  for (const [lang, { must, never }] of Object.entries(claims)) {
    const guide = text(guideOf(fs.readFileSync(file(PAGES[lang].url), 'utf8')));
    for (const pattern of must) assert.match(guide, pattern, `${lang}: ${pattern}`);
    assert.doesNotMatch(guide, never, `${lang}: no absolute privacy promise`);
  }
});

test('the whole page: the side note and the names in a sent handover are described as the tool behaves', { skip: !hasSite }, () => {
  // Send (js/shift-handover.js forTransfer) leaves out the name fields unless "include names" is ticked; the free text
  // travels as typed, and the warning in the Send dialog looks for e-mail addresses, IBANs, card and phone numbers
  // only. Team sync (js/team-sync.js) keeps an encrypted copy of a tool's work on the sync server.
  const pages = {
    en: {
      note: 'Handovers are stored in this browser. They leave it only when you copy, print, save or send them, or as an encrypted copy if your team uses team sync. Check names and guest details before you share.',
      names: [/name fields \(who hands over, who takes over, each issue’s owner\) are left out unless you include them/, /can contain names or other personal details/, /does not detect names or remove anything/, /read those fields before sending/],
    },
    de: {
      note: 'Übergaben werden in diesem Browser gespeichert. Sie verlassen ihn nur, wenn Sie sie kopieren, drucken, speichern oder senden, oder als verschlüsselte Kopie, wenn Ihr Team die Team-Synchronisierung nutzt. Prüfen Sie Namen und Gästedaten, bevor Sie etwas teilen.',
      names: [/Namensfelder \(wer übergibt, wer übernimmt und die verantwortliche Person jedes Punkts\) nur mitgesendet, wenn Sie dies auswählen/, /können Namen oder andere personenbezogene Angaben enthalten/, /erkennt aber keine Namen und entfernt nichts/, /vor dem Senden durch/],
    },
    sq: {
      note: 'Dorëzimet ruhen në këtë shfletues. Ato largohen prej tij vetëm kur i kopjoni, i printoni, i ruani ose i dërgoni, ose si kopje e enkriptuar nëse ekipi juaj përdor sinkronizimin e ekipit. Kontrolloni emrat dhe të dhënat e mysafirëve para se të ndani diçka.',
      names: [/fushat e emrave \(kush e dorëzon, kush e merr dhe përgjegjësi i çdo çështjeje\) nuk përfshihen, përveç nëse/, /mund të përmbajë emra ose të dhëna të tjera personale/, /nuk dallon emra dhe nuk heq asgjë/, /lexojini këto fusha para dërgimit/],
    },
  };
  // The side note's old sentence is gone from the whole page. The stricter check (no "nothing is uploaded", no
  // automatic anonymising) covers this tool's own text: the side note and the guide. The shared "All your work in one
  // file" box on every tool page has its own wording, outside this page's scope.
  const oldNote = /Nothing is sent or uploaded|Nichts wird gesendet oder hochgeladen|Asgjë nuk dërgohet apo ngarkohet/;
  const absolute = /nothing is uploaded|hochgeladen wird nichts|asgjë nuk ngarkohet|automatically anonymi[sz]ed|automatisch anonymisiert|anonimizohet automatikisht/i;
  for (const [lang, { note, names }] of Object.entries(pages)) {
    const html = fs.readFileSync(file(PAGES[lang].url), 'utf8');
    const side = html.match(/<p class="privacy-note">([\s\S]*?)<\/p>/)?.[1] ?? '';
    assert.equal(text(side).trim(), note, `${lang}: the side note`);
    const page = text(html);
    for (const pattern of names) assert.match(page, pattern, `${lang}: ${pattern}`);
    assert.doesNotMatch(page, oldNote, `${lang}: the old side note is gone from the page`);
    assert.doesNotMatch(text(side) + ' ' + text(guideOf(html)), absolute, `${lang}: no absolute promise in the tool's own text`);
  }
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
