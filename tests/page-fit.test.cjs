// The fixed pages of the publications (lib/page-fit.js): src/_data/pageFit.json, which scripts/page-fit.mjs writes
// from measuring every page in Chromium, names only pages that exist, in the languages of their publication, each
// with a step the stylesheets define; the page templates read it, the stylesheets keep every step modest, and the
// print scripts stop before printing a page that does not fit. No browser is needed: the measuring is the script's.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const data = async (name) => (await import(`../src/_data/${name}.js`)).default;

// Every document with fixed pages, by the key of its pages in pageFit.json: its languages and how many pages it has
// in each.
const documents = async () => {
  const [weekly, magazine, treatise, review, toolsGuide] = await Promise.all(['weekly', 'magazine', 'treatise', 'review', 'toolsGuide'].map(data));
  const docs = {};
  for (const issue of weekly.issues) docs[issue.slug] = Object.fromEntries(weekly.langs.map((lang) => [lang, issue[lang].pages.length]));
  for (const issue of magazine.issues) docs[issue.slug] = Object.fromEntries(magazine.langs.map((lang) => [lang, issue[lang].pages.length]));
  for (const volume of treatise.volumes) docs[volume.slug] = Object.fromEntries(treatise.langs.map((lang) => [lang, volume[lang].pages.length]));
  docs[review.slug] = Object.fromEntries(review.langs.map((lang) => [lang, review[lang].pages.length]));
  docs[toolsGuide.slug] = Object.fromEntries(toolsGuide.langs.map((lang) => [lang, toolsGuide.pages.length]));
  return docs;
};

test('pageFit.json names only pages that exist, each with a step from 1 to the last', async () => {
  const { FIT_STEPS } = await import('../lib/page-fit.js');
  const fit = JSON.parse(read('src/_data/pageFit.json'));
  const docs = await documents();
  assert.equal(typeof fit, 'object');
  for (const [key, langs] of Object.entries(fit)) {
    assert.ok(docs[key], `pageFit.json: no publication with the slug ${key}`);
    assert.ok(Object.keys(langs).length, `pageFit.json: ${key} has no language`);
    for (const [lang, pages] of Object.entries(langs)) {
      assert.ok(lang in docs[key], `pageFit.json: ${key} has no language ${lang}`);
      assert.ok(Object.keys(pages).length, `pageFit.json: ${key} ${lang} has no page`);
      for (const [page, step] of Object.entries(pages)) {
        assert.match(page, /^[1-9]\d*$/, `pageFit.json: ${key} ${lang}: "${page}" is not a page number`);
        assert.ok(Number(page) <= docs[key][lang], `pageFit.json: ${key} ${lang} has ${docs[key][lang]} pages, not ${page}`);
        assert.ok(Number.isInteger(step) && step >= 1 && step <= FIT_STEPS, `pageFit.json: ${key} ${lang} p${page}: step ${step} is not 1 to ${FIT_STEPS}`);
      }
    }
  }
});

test('the stylesheets define every step, none more than 12 per cent smaller, and the templates set it', async () => {
  const { FIT_STEPS } = await import('../lib/page-fit.js');
  for (const [file, scope] of [['src/_includes/print/review-base.css', '.mr'], ['src/_includes/print/guide.css', '.tg']]) {
    const css = read(file);
    let last = 1;
    for (let step = 1; step <= FIT_STEPS; step++) {
      const found = css.match(new RegExp(`\\${scope} \\.pg\\.fit-${step} \\{ --fit: ([\\d.]+); \\}`));
      assert.ok(found, `${file}: no step fit-${step}`);
      const value = Number(found[1]);
      assert.ok(value < last && value >= 0.88, `${file}: fit-${step} is ${value}, it has to be smaller than the step before and at least .88`);
      last = value;
    }
    assert.match(css, /zoom: var\(--fit\)/, `${file}: the steps are not applied`);
  }
  for (const [file, key] of [['weekly-page.njk', 'issue.slug'], ['treatise-page.njk', 'volume.slug'], ['review-page.njk', 'review.slug'], ['guide-pages.njk', 'toolsGuide.slug']]) {
    const njk = read(`src/_includes/print/${file}`);
    assert.ok(njk.includes(`pageFit[${key}][lang]`), `${file} does not read pageFit.json`);
    const sections = njk.match(/<section class="pg[^"]*"/g);
    assert.ok(sections.length && sections.every((tag) => tag.includes('{{ fitClass }}')), `${file}: a page without its step`);
  }
});

test('the print scripts stop before printing a page that does not fit', () => {
  for (const script of ['weekly', 'magazine', 'treatise', 'review', 'tools-guide']) {
    const source = read(`scripts/${script}.mjs`);
    assert.match(source, /const unfit = await checkPagesFit\(browser, /, `scripts/${script}.mjs does not check the pages`);
    assert.ok(source.indexOf('checkPagesFit(browser') < source.indexOf('page.pdf('), `scripts/${script}.mjs checks the pages after printing them`);
    assert.match(source, /process\.exit\(1\)/, `scripts/${script}.mjs does not fail when a page does not fit`);
  }
});
