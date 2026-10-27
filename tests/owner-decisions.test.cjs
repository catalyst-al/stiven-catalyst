// The author's decisions on the phase 1 findings (27 October 2026), each held by a test.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';

// Hoshin Kanri offered the same bowling-chart table twice (in the results and under the plan), byte for byte: one
// CSV and one Excel button remain.
test('Hoshin Kanri: one CSV and one Excel button, the same table as before', async () => {
  const w = openTool('hoshin-kanri', { now: NOW });
  await settle(w, 50);
  const buttons = [...w.document.querySelectorAll('main button')].map((b) => b.textContent.trim());
  assert.equal(buttons.filter((t) => t === 'Download CSV').length, 1, buttons.join(' | '));
  assert.equal(buttons.filter((t) => t === 'Download Excel').length, 1);
});
