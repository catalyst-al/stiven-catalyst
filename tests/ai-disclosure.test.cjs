// "How this is made" names the direction of the translations rightly (audit P4-15 / P6-05): the reflections and the
// book are written in Albanian, and their English and German versions are made with Claude. The page said "the German
// and Albanian versions", as if every original were English. The built pages, in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const PAGES = {
  en: ['_site/how-this-is-made.html', 'the reflections and the book are written in Albanian; their English and German versions are made this way'],
  de: ['_site/de/how-this-is-made.html', 'die Reflexionen und das Buch sind auf Albanisch geschrieben; ihre englische und deutsche Fassung entstehen so'],
  sq: ['_site/sq/how-this-is-made.html', 'reflektimet dhe libri janë shkruar në shqip; versionet e tyre në anglisht dhe në gjermanisht bëhen kështu'],
};

for (const [lang, [file, said]] of Object.entries(PAGES)) {
  test(`the AI note (${lang}) says the reflections and the book are Albanian originals`, () => {
    const html = fs.readFileSync(file, 'utf8');
    assert.ok(html.includes(said), said);
    assert.ok(!/the German and Albanian versions|die deutsche und die albanische Fassung|versionet në gjermanisht dhe në shqip/.test(html));
  });
}
