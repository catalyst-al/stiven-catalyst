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
