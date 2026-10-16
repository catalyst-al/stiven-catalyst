// The build's stylesheet step (lib/css-split.js): minifying, and the lighter copy for pages that are not tools.
const { test } = require('node:test');
const assert = require('node:assert/strict');

const load = () => import('../lib/css-split.js');

test('minify drops comments and spaces but keeps what the rules say', async () => {
  const { minify } = await load();
  assert.equal(minify('/* note */\n.a > .b {\n  margin: 0 auto;\n  width: calc(100% - 2px);\n}\n'), '.a > .b{margin: 0 auto;width: calc(100% - 2px)}');
});

test('the light copy keeps a rule only when every class it needs is known', async () => {
  const { lighten } = await load();
  const css = `
    .page .title { color: red; }
    .cv-sheet { width: 1px; }
    .page, .cv-sheet { margin: 0; }
    .page:not(.cv-sheet) { padding: 0; }
    :is(.page, .cv-sheet) b { font-weight: 700; }
    [data-theme="light"] .page { color: black; }
    @media (max-width: 600px) { .cv-sheet { width: 2px; } .page { width: 3px; } }
    @media print { .cv-sheet { display: none; } }
    @keyframes spin { to { transform: rotate(1turn); } }
    @font-face { font-family: X; src: url(x.woff2); }
  `;
  const known = (name) => ['page', 'title'].includes(name);
  const out = lighten(css, known);
  assert.ok(out.includes('.page .title{color: red}'));
  assert.ok(!out.includes('.cv-sheet{width: 1px}'));
  assert.ok(out.includes('.page{margin: 0}'), 'a selector list keeps only the parts that can match');
  assert.ok(out.includes('.page:not(.cv-sheet){padding: 0}'), 'classes inside :not() are not required');
  assert.ok(out.includes(':is(.page, .cv-sheet) b{font-weight: 700}'));
  assert.ok(out.includes('[data-theme="light"] .page{color: black}'));
  assert.ok(out.includes('@media (max-width: 600px){.page{width: 3px}}'));
  assert.ok(!out.includes('@media print'), 'an @media block with nothing left is dropped');
  assert.ok(out.includes('@keyframes spin{'));
  assert.ok(out.includes('@font-face{'));
});

test('@keyframes nobody animates with are left out; the ones named in animation and animation-name stay', async () => {
  const { dropUnusedKeyframes } = await load();
  const css = '.a{animation: spin 1s cubic-bezier(.2, 1, .3, 1) infinite}@keyframes spin{to{transform: rotate(1turn)}}@keyframes fade{0%,100%{opacity: 0}50%{opacity: 1}}.b{animation-name: beat,fade}@keyframes beat{50%{scale: 1.2}}@keyframes lonely{to{opacity: 0}}@media (max-width: 600px){.c{animation: late .3s both}}@keyframes late{from{opacity: 0}}';
  const out = dropUnusedKeyframes(css);
  for (const name of ['spin', 'fade', 'beat', 'late']) assert.ok(out.includes(`@keyframes ${name}{`), name);
  assert.ok(!out.includes('lonely'));
  assert.equal(dropUnusedKeyframes('.a{color: red}@keyframes lonely{to{opacity: 0}}'), '.a{color: red}');
});

test('what a page is known to carry: the classes of its elements, its data words and inline scripts, not its prose', async () => {
  const { pageWords } = await load();
  const seen = new Set();
  const prefixes = new Set();
  const html = `<html class="js"><body><p class="lede is-wide">The kicker word and the card word are only prose.</p>
    <div data-family="pulse" data-state="is-open|closed" style="--family: #fff"></div>
    <script type="application/json">{"tone":"tone-ok"}</script>
    <script>document.body.classList.add("sky-" + id); el.className = \`row-\${n}\`;</script>
    <script src="/js/tool-kit.js?v=abc" defer></script><script src="/script.js"></script></body></html>`;
  const scripts = pageWords(html, seen, prefixes);
  assert.deepEqual(scripts, ['/js/tool-kit.js', '/script.js']);
  for (const word of ['js', 'lede', 'is-wide', 'pulse', 'is-open', 'closed', 'tone-ok', '--family']) assert.ok(seen.has(word), word);
  for (const word of ['kicker', 'card', 'prose']) assert.ok(!seen.has(word), `${word} is only prose`);
  assert.deepEqual([...prefixes].sort(), ['row-', 'sky-']);
});

test('the kind of a page follows its address, in every language', async () => {
  const { groupOf } = await load();
  assert.equal(groupOf('/index.html'), 'home');
  assert.equal(groupOf('/sq/index.html'), 'home');
  assert.equal(groupOf('/insights/gemba/index.html'), 'essay');
  assert.equal(groupOf('/de/reflections/ghost-in-a-room-of-mirrors/index.html'), 'essay');
  assert.equal(groupOf('/magazine/management-review-nr-05.html'), 'reader');
  assert.equal(groupOf('/sq/books/mall-per-durresin.html'), 'reader');
  assert.equal(groupOf('/guides/tools-guide.html'), 'reader');
  assert.equal(groupOf('/tools/pareto/index.html'), 'tool');
  assert.equal(groupOf('/de/roles/shift-lead/index.html'), 'tool');
  for (const page of ['/insights.html', '/tools.html', '/about.html', '/404.html', '/de/search.html', '/sq/shelf.html', '/magazine/management-review.html'.replace('/magazine/', '/')]) assert.equal(groupOf(page), 'page', page);
});

test('every built page loads the stylesheet of its kind, and no other', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  if (!fs.existsSync('_site/index.html')) return;
  const walk = (dir, out = []) => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file, out); else if (entry.name.endsWith('.html')) out.push(file); } return out; };
  const sizes = {};
  return import('../lib/css-split.js').then(({ groupOf }) => {
    for (const file of walk('_site')) {
      const url = '/' + path.relative('_site', file).split(path.sep).join('/');
      const html = fs.readFileSync(file, 'utf8');
      const links = [...html.matchAll(/<link rel="stylesheet" href="\/(styles[a-z-]*\.css)\?v=([0-9a-f]+)"/g)].map((m) => m[1]);
      assert.deepEqual(links, [`styles-${groupOf(url)}.css`], url);
      sizes[groupOf(url)] = fs.statSync(`_site/styles-${groupOf(url)}.css`).size;
    }
    const full = fs.statSync('_site/styles.css').size;
    for (const [group, size] of Object.entries(sizes)) assert.ok(size < full * 0.8, `${group}: ${size} of ${full}`);
    assert.ok(sizes.home && sizes.essay && sizes.reader && sizes.page && sizes.tool, Object.keys(sizes).join(','));
  });
});
