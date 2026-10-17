// The homepage's way in: the three essays to read first (src/_data/homeEssays.json, a provisional choice until the
// author confirms it) exist in English, German and Albanian, each with its sentence on why in every language, and the
// homepage shows them with the two paths (Start here, the tools) in every language.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = JSON.parse(fs.readFileSync('src/_data/homeEssays.json', 'utf8'));
const DIRS = { en: 'src/content/insights', de: 'src/content/de/insights', sq: 'src/content/sq/insights' };
const fileOf = (dir, slug) => fs.readdirSync(dir).find((file) => file.replace(/^\d{4}-\d{2}-\d{2}-/, '') === `${slug}.md`);

test('three essays, each published in every language, each with a why sentence per language', () => {
  assert.match(data._note, /provisional/i, 'the file says the choice awaits the author');
  assert.equal(data.essays.length, 3);
  assert.equal(new Set(data.essays.map((e) => e.slug)).size, 3, 'three different essays');
  for (const essay of data.essays) {
    for (const [lang, dir] of Object.entries(DIRS)) {
      const file = fileOf(dir, essay.slug);
      assert.ok(file, `${lang}: ${essay.slug} exists`);
      assert.doesNotMatch(fs.readFileSync(path.join(dir, file), 'utf8'), /^status: soon$/m, `${lang}: ${essay.slug} is published`);
      const why = essay.why?.[lang] || '';
      assert.ok(why.length > 40 && why.length < 220, `${lang}: ${essay.slug} has its sentence`);
      assert.match(why, /[.]$/, `${lang}: ${essay.slug} ends as a sentence`);
      assert.doesNotMatch(why, /—/, `${lang}: ${essay.slug} without an em dash`);
    }
  }
});

const hasSite = fs.existsSync('_site/index.html');

test('the homepage shows the way in and the three essays with their sentences, in every language', { skip: !hasSite }, () => {
  for (const [lang, prefix] of [['en', ''], ['de', 'de/'], ['sq', 'sq/']]) {
    const html = fs.readFileSync(path.join('_site', prefix, 'index.html'), 'utf8');
    const start = html.match(/<section class="shell home-start"[\s\S]*?<\/section>/)?.[0] || '';
    assert.ok(start.includes(`href="/${prefix}start.html"`), `${lang}: Start here`);
    assert.ok(start.includes(`href="/${prefix}tools.html"`), `${lang}: the tools`);
    const picks = html.match(/<section class="shell section home-picks"[\s\S]*?<\/section>/)?.[0] || '';
    assert.equal((picks.match(/class="article-card home-pick"/g) || []).length, 3, `${lang}: three essays`);
    for (const essay of data.essays) {
      assert.ok(picks.includes(`href="/${prefix}insights/${essay.slug}/"`), `${lang}: ${essay.slug} linked`);
      const why = essay.why[lang].replace(/&/g, '&amp;').replace(/'/g, '&#39;');
      assert.ok(picks.includes(why), `${lang}: ${essay.slug} sentence shown`);
    }
    // "Start here" in the menu, and in the phone menu.
    assert.match(html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0], new RegExp(`class="nav-start" href="/${prefix}start.html"`));
    assert.ok(html.match(/<nav id="mobile-menu"[\s\S]*?<\/nav>/)[0].includes(`href="/${prefix}start.html"`), `${lang}: phone menu`);
  }
});
