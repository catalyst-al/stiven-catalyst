const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, click, settle } = require('./helpers/tool-page.cjs');

// The example letter is what the tool shows as good: it passes every point of the tool's own letter check, in each
// language (audit P2C-14: it had 144 words against the 150–400 the check asks for).
for (const lang of ['en', 'de', 'sq']) {
  test(`Cover letter (${lang}): the example passes its own letter check`, async () => {
    const w = openTool('cover-letter', { lang });
    click(w, w.document.querySelector('[data-act="example"]'));
    await settle(w, 100);
    const open = [...w.document.querySelectorAll('[data-check] .is-open')].map((li) => li.textContent);
    assert.deepEqual(open, [], `open checks: ${open.join(' / ')}`);
    const words = [...w.document.querySelectorAll('[data-check] li')].map((li) => li.textContent).find((text) => /\d+\)/.test(text));
    const n = Number(words.match(/(\d+)\)/)[1]);
    assert.ok(n >= 160 && n <= 400, `${n} words: a margin above 150, so a small edit does not fail the check`);
  });
}
