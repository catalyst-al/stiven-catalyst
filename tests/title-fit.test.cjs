// A title never splits a word (lib/title-fit.js): each heading carries the width of its longest word, and the
// large titles are set no larger than that word allows.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const load = () => import('../lib/title-fit.js');

test('the longest word is measured in each face, in em, up to a break of its own', async () => {
  const { longestWord, pieces } = await load();
  // MANAGEMENT in Archivo Black, upper case.
  assert.equal(longestWord('Management <span class="weekly-mark">Review</span>', 'display'), 8.11);
  assert.ok(longestWord('Entscheidungen', 'serif') > 7.5 && longestWord('Entscheidungen', 'serif') < 8);
  // A soft hyphen, a hyphen, a dash and a slash are breaks; the hyphen drawn at the break counts with the piece.
  assert.deepEqual(pieces('Vollständigkeits­kontrolle ATS-Lebenslauf a/b 5–Why'), ['Vollständigkeits­', 'kontrolle', 'ATS-', 'Lebenslauf', 'a/', 'b', '5–', 'Why']);
  assert.equal(longestWord('Vollständigkeits&shy;kontrolle', 'display'), longestWord('Vollständigkeits-', 'display'));
  assert.ok(longestWord('Vollständigkeits&shy;kontrolle', 'display') < longestWord('Vollständigkeitskontrolle', 'display'));
  // A non-breaking hyphen does not break: "CV‑së" is one word, "CV-së" two.
  assert.ok(longestWord('CV&#8209;së', 'display') > longestWord('CV-së', 'display') + 1);
  // "ß" is "SS" in an uppercase title.
  assert.equal(longestWord('Maß', 'display'), longestWord('MASS', 'display'));
  // Tags inside the title (the kerning of lib/display-pairs.js) do not split a word.
  assert.equal(longestWord('Shi<k-p class="kp2">f</k-p>t', 'display'), longestWord('Shift', 'display'));
});

test('every h1, h2 and h3 and each title marked data-fit gets its widths; other elements, scripts and attributes stay as they are', async () => {
  const { fitTitles } = await load();
  assert.equal(fitTitles('<h1>Tools</h1>'), '<h1 style="--wd:3.78;--ws:2.53">Tools</h1>');
  assert.match(fitTitles('<strong data-fit>Karriere</strong><strong>Karriere</strong>'), /^<strong data-fit style="--wd:[\d.]+;--ws:[\d.]+">Karriere<\/strong><strong>Karriere<\/strong>$/);
  assert.match(fitTitles('<blockquote data-fit>“Quote”</blockquote><blockquote>Other</blockquote>'), /^<blockquote data-fit style="--wd:[\d.]+;--ws:[\d.]+">“Quote”<\/blockquote><blockquote>Other<\/blockquote>$/);
  assert.match(fitTitles('<h2 class="x" style="color:red">Wo</h2>'), /^<h2 class="x" style="--wd:[\d.]+;--ws:[\d.]+;color:red">Wo<\/h2>$/);
  assert.equal(fitTitles('<p>Management</p><h4>Management</h4>'), '<p>Management</p><h4>Management</h4>');
  const script = '<script>el.innerHTML = "<h1>Shift</h1>";</script>';
  assert.equal(fitTitles(script), script);
  assert.equal(fitTitles('<h3></h3>'), '<h3></h3>');
});

const css = fs.readFileSync('src/styles.css', 'utf8');
test('the large titles are no larger than their longest word allows', () => {
  // The measure of a title: the width of its container (cqi) over the width of its longest word.
  assert.match(css, /--fit-d: calc\(var\(--measure, 100cqi\) \/ var\(--wd\)\);/);
  assert.match(css, /--fit-s: calc\(var\(--measure, 100cqi\) \/ var\(--ws\)\);/);
  // Every rule that sizes a large title takes the smaller of its size and the fit.
  const sized = [...css.matchAll(/^([^{}@/]*\b(?:h1|h2)\b[^{}]*)\{([^}]*font-size: (?:clamp|min)\([^;]*)/gm)]
    .filter(([, selector]) => /\.(page-hero|article-hero|book-hero|cosmos|book-feature)\b/.test(selector));
  assert.ok(sized.length >= 10, `${sized.length} title rules`);
  for (const [, selector, body] of sized) assert.match(body, /min\(.*var\(--fit-[ds], 1000px\)\)$/, selector.trim());
  // The role's name on a card, marked data-fit.
  assert.match(css, /\.role-next-text strong \{[^}]*font-size: min\(26px, var\(--fit-d, 1000px\)\)/);
  assert.match(css, /\.family-card strong \{[^}]*font-size: min\(24px, var\(--fit-d, 1000px\)\)/);
  // A field note's quote, the next essay of a series, the lines of the manifesto, the titles of a publication's text.
  assert.match(css, /\.note-card blockquote \{[^}]*font-size: min\(clamp\(28px, 3vw, 43px\), var\(--fit-s, 1000px\)\)/);
  assert.match(css, /\.essay-series-next strong \{[^}]*--measure: calc\(100cqi - 40px\);[^}]*font-size: min\(clamp\(28px, 3\.4vw, 40px\), var\(--fit-s, 1000px\)\)/);
  assert.match(css, /\.manifesto-line span \{[^}]*font-size: min\(1em, 12\.5cqi, var\(--fit-d, 1000px\)\)/);
  assert.match(css, /\.book-text-body h2 \{[^}]*font-size: min\(42px, var\(--fit-s, 1000px\)\)/);
  // Each of them sits in a container, so 100cqi is the width the title has.
  for (const box of ['.page-hero', '.cosmos-copy', '.article-hero-text', '.book-hero-copy', '.book-feature-copy', '.role-next-text', '.family-card-text', '.note-card', '.essay-series-next', '.book-text-body']) {
    assert.ok(new RegExp(`(^|[,\\s])${box.replace('.', '\\.')}[^{]*\\{[^}]*container-type: inline-size`, 'm').test(css), box);
  }
});

const built = '_site/de/your-challenge.html';
test('the built pages carry the widths, and the longest German words have a place to break', { skip: !fs.existsSync(built) }, () => {
  assert.match(fs.readFileSync(built, 'utf8'), /<h1 style="--wd:[\d.]+;--ws:[\d.]+">Schicken Sie mir Ihre Heraus\u00adforderung\.<\/h1>/);
  assert.match(fs.readFileSync('_site/magazine/management-review.html', 'utf8'), /<h1 class="hero-long" style="--wd:8\.11;--ws:[\d.]+">Management/);
  // A German source title on an English page is marked German, so it is read and hyphenated as German.
  const issue30 = fs.readFileSync('_site/magazine/management-review-nr-30.html', 'utf8');
  assert.match(issue30, /<ul class="book-text-sources">[\s\S]*?<span lang="de">“Gründe gegen die Nutzung[^<]*Beschäftigtengrößenklassen”<\/span>/);
  assert.doesNotMatch(fs.readFileSync('_site/de/magazine/management-review-nr-30.html', 'utf8'), /<span lang="de">/, 'not on a German page');
});
