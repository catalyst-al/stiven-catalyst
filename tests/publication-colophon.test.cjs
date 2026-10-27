// Every publication says who makes it and how (weekly.colophon, the facts of How this is made): on its back cover,
// which the PDF and the reader both show, and at the end of its text. The method on the sources page says what was
// checked how, and no longer that every unconfirmed figure was left out.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/magazine/management-review-nr-01.html');
const LANGS = [['en', ''], ['sq', 'sq/'], ['de', 'de/']];
const PAGES = ['management-review-nr-01', 'management-review-nr-80', 'management-review-2026-09', 'nga-terreni-01', 'nga-terreni-02', 'operational-treatise-vol-01', 'operational-treatise-vol-13'];
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

test('the colophon names the editor, Claude and Anthropic, and what "the editors" means, in each language', async () => {
  const { common } = await import('../lib/weekly/common.js');
  for (const lang of ['en', 'sq', 'de']) {
    const text = common.colophon.text[lang];
    for (const word of ['Stiven Janaqi', 'Claude', 'Anthropic']) assert.ok(text.includes(word), `${lang}: ${word}`);
    assert.match(common.colophon.url[lang], /^stivencatalyst\.com\/(?:(?:sq|de)\/)?how-this-is-made\.html$/);
  }
  assert.match(common.colophon.text.en, /“the editors” in this publication means him/);
});

test('every publication shows the colophon on its back cover and at the end of its text, in each language', { skip: !hasSite }, async () => {
  const { common } = await import('../lib/weekly/common.js');
  for (const [lang, prefix] of LANGS) {
    for (const slug of PAGES) {
      const html = decode(fs.readFileSync(`_site/${prefix}magazine/${slug}.html`, 'utf8'));
      const back = html.slice(html.lastIndexOf('class="pg back'));
      assert.ok(back.includes(common.colophon.text[lang]) && back.includes(common.colophon.url[lang]), `${prefix}${slug}: back cover`);
      assert.ok(html.includes(`${common.colophon.text[lang]} <a href="/${prefix}how-this-is-made.html">`), `${prefix}${slug}: end of the text`);
    }
  }
});

test('the method no longer says that figures that could not be confirmed are not in the issue', async () => {
  const { common } = await import('../lib/weekly/common.js');
  assert.doesNotMatch(common.sourcesPage.methodText.en, /could not be confirmed are not in the issue/);
  assert.match(common.sourcesPage.methodText.en, /marked “via”/);
  assert.match(common.sourcesPage.methodText.en, /marked so on its page, or left out/);
  assert.doesNotMatch(common.sourcesPage.methodText.sq, /nuk janë në numër/);
  assert.doesNotMatch(common.sourcesPage.methodText.de, /stehen nicht in der Ausgabe/);
  const made = fs.readFileSync('src/how-this-is-made.njk', 'utf8');
  assert.doesNotMatch(made, /A figure that cannot be confirmed is not published|erscheint nicht\.|nuk botohet\./);
});

test('No. 1 says where the 70% and 77% come from; No. 21 no longer dates the layoffs 2023', async () => {
  const one = (await import('../lib/weekly/issues/01.js')).default;
  const pairs = one.pages.flatMap((page) => page.blocks || []).find((block) => block.type === 'pairs');
  assert.match(pairs.note.en, /70% and 77% are Bock's/);
  assert.match(pairs.note.en, /we did not see the book/);
  const src = fs.readFileSync('lib/weekly/issues/21.js', 'utf8');
  assert.doesNotMatch(src, /In 2023 they made up|tracked in 2023|2023 stellten sie|stellten 2023|Në vitin 2023, sipas/);
});

test('treatise Vol 4 in German keeps the caveat on the 30, 60 and 90 days', () => {
  const src = fs.readFileSync('lib/treatise/volumes/04.js', 'utf8');
  assert.doesNotMatch(src, /kein Studienintervall/);
  assert.match(src, /Doyle et al. \(2013\); von keiner Studie belegt\."/);
});
