// Moving between pages: the cross-document view transition (styles.css, "Moving between pages"), the marked menu item
// and writing tab that slide to their new place, and the links fetched before they are clicked (base.njk).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const hasSite = fs.existsSync('_site/publications.html');
const built = (file) => fs.readFileSync(path.join('_site', file), 'utf8');
const css = fs.readFileSync('src/styles.css', 'utf8');

test('pages move into each other only for readers who have not asked for less motion', () => {
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition \{ navigation: auto; \}\s*\}/);
  assert.doesNotMatch(css.replace(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition[^}]*\}\s*\}/, ''), /@view-transition/,
    'the transition is switched on in one place only');
  for (const name of ['site-header', 'nav-pill', 'writing-tabs', 'tab-pill']) {
    assert.equal(css.match(new RegExp(`view-transition-name: ${name};`, 'g'))?.length, 1, name);
  }
});

test('the menu item and the writing tab of the page carry the piece that slides', { skip: !hasSite }, () => {
  for (const [file, item] of [['publications.html', '/publications.html'], ['de/tools.html', '/de/tools.html'], ['sq/reflections.html', '/sq/insights.html']]) {
    const html = built(file);
    const nav = html.match(/<nav class="main-nav"[\s\S]*?<\/nav>/)[0];
    assert.equal(nav.match(/class="nav-pill"/g)?.length, 1, `${file}: one line under the menu`);
    assert.match(nav, new RegExp(`aria-current="page" href="${item}">[^<]+<span class="nav-pill" aria-hidden="true"></span></a>`), file);
    assert.doesNotMatch(html.match(/<nav id="mobile-menu"[\s\S]*?<\/nav>/)[0], /nav-pill/, `${file}: the name stays unique`);
  }
  const reflections = built('reflections.html');
  assert.equal(reflections.match(/class="tab-pill"/g)?.length, 1);
  assert.match(reflections, /href="\/reflections.html" aria-current="page">Reflections<span class="tab-pill" aria-hidden="true"><\/span><\/a>/);
  assert.doesNotMatch(built('index.html'), /nav-pill|tab-pill/, 'the homepage marks no menu item');
});

test('links are fetched ahead, and the Content Security Policy allows exactly those rules', { skip: !hasSite }, () => {
  const { createHash } = require('node:crypto');
  for (const file of ['index.html', 'publications.html', 'tools/pareto/index.html', 'sq/insights.html']) {
    const html = built(file);
    const rules = html.match(/<script type="speculationrules">([^<]+)<\/script>/);
    assert.ok(rules, `${file}: speculation rules`);
    const parsed = JSON.parse(rules[1]);
    assert.equal(parsed.prefetch[0].eagerness, 'moderate');
    assert.ok(!('prerender' in parsed), 'only fetched, never run ahead (the visit counts stay true)');
    const hash = `'sha256-${createHash('sha256').update(rules[1]).digest('base64')}'`;
    assert.ok(html.match(/script-src([^;]*)/)[1].includes(hash), `${file}: the rules' hash is in script-src`);
  }
});
