// Hand-offs between tools, followed through both tools' real code: the source tool is opened as a reader opens it
// (tests/helpers/tool-page.cjs), its own form writes the data, and the reading tool is opened on what the source left
// in the browser. The audit of 27 October 2026 found a hand-off whose unit test passed with a fixture in the shape the
// reader expected while the real writer used other field names (Cost of Quality ← Waste Log, finding T-05); these
// tests exist so that cannot happen again.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, keep, click, submit } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const SUFFIX = { en: '', de: '-de', sq: '-sq' };

// One entry typed into the Waste Log form: 10 units at 2.50 € (2,50 in German and Albanian).
const logWaste = (lang, storage = {}) => {
  const w = openTool('waste-log', { lang, storage, now: NOW });
  const form = w.document.querySelector('[data-entry]');
  form.elements.product.value = 'Croissants';
  form.elements.qty.value = '10';
  form.elements.cost.value = lang === 'en' ? '2.50' : '2,50';
  submit(w, form);
  return keep(w);
};

for (const lang of ['en', 'de', 'sq']) {
  test(`Waste Log → Cost of Quality (${lang}): an entry typed in the Waste Log is brought in at its value`, () => {
    const storage = logWaste(lang);
    const log = storage[`sc-waste-log${SUFFIX[lang]}`];
    assert.ok(log && Array.isArray(log.rows), 'the Waste Log saved its log');
    const own = log.rows.filter((row) => row.item === 'Croissants');
    assert.equal(own.length, 1, 'the typed entry is in the log');

    const w = openTool('cost-of-quality', { lang, storage, now: NOW });
    click(w, w.document.querySelector('[data-import]'));
    const status = w.document.querySelector('.coq [data-status], [data-status]')?.textContent ?? '';
    const saved = keep(w)[`sc-cost-of-quality${SUFFIX[lang]}`];
    const line = saved?.lines?.find((item) => item.source === 'waste-log');
    assert.ok(line, `a Waste Log line is brought in (the page said: "${status}")`);
    assert.equal(Number(line.amount), 25, 'the line is worth 10 × 2.50 = 25 €');
    assert.equal(line.period, 'month');
  });
}

// The Daily Board reads the 5S Audit's audits and must score each one as the 5S Audit does: the mean of the shares of
// the S that have an answer, each S weighing 1 (audit finding T-16: the board pooled every question, 80 % where the
// tool said 50 %). Every audit of the 5S Audit's example, saved by its own page, is scored by both.
test('Daily Board scores a 5S audit exactly as the 5S Audit does', async () => {
  const five = openTool('five-s-audit', { now: NOW });
  click(five, five.document.querySelector('[data-example]') || five.document.body);
  const saved = keep(five)['sc-five-s-audit'] || { rows: [] };
  const rows = saved.rows.length ? saved.rows : five.eval('JSON.parse(JSON.stringify(window.__fiveRows || []))');
  const cfg = JSON.parse(five.document.getElementById('five-s-audit-data').textContent);
  const board = openTool('daily-board', { now: NOW });
  // A lopsided audit: Sort fully answered at 4, the other S with a single 0. Pooled: 80 %; per S: 4/4, 0, 0, 0, 0 → 20 %.
  const lopsided = { date: '2026-10-24', area: 'Packing', scope: '5S', scores: { sort: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], set: [0], shine: [0], standardize: [0], sustain: [0] } };
  for (const row of [...rows, lopsided]) {
    const M = five.FiveSMath;
    const tool = M.score(row.scores, M.pillarsFor(row.scope, cfg.scopes)).overall;
    const daily = board.DailyBoardMath.fivesScore(row);
    assert.ok(Math.abs(tool - daily) < 1e-9, `${row.date} ${row.area}: 5S Audit ${tool}, Daily Board ${daily}`);
  }
  assert.ok(rows.length > 0, 'the 5S Audit\'s own audits were scored too');
});

// Every tool that reads the 5S Audit's audits scores each one as the 5S Audit does, and leaves out an audit the 5S
// Audit calls partial (fewer than 80 % of its questions scored, or an S without a score: FiveSMath.isComplete). They
// each had their own copy of the formula, which is how the Daily Board drifted (T-16); they now share ToolKit.fiveSScore.
test('Daily Board, Shift Pulse, Ops Report and Signals score every 5S audit as the 5S Audit does, partial ones left out', () => {
  const five = openTool('five-s-audit', { now: NOW });
  const M = five.FiveSMath;
  const cfg = JSON.parse(five.document.getElementById('five-s-audit-data').textContent);
  const keys = M.pillarsFor('5S', cfg.scopes);
  const full = (value) => Object.fromEntries(keys.map((key) => [key, [value, value, value, value]]));
  const rows = [
    { date: '2026-10-20', area: 'Packing', scope: '5S', scores: full(3) },
    { date: '2026-10-21', area: 'Packing', scope: '5S', scores: { ...full(4), [keys[1]]: [0, 1, 2, null] } },
    // Partial: one S fully answered, the others empty.
    { date: '2026-10-22', area: 'Dock', scope: '5S', scores: { ...Object.fromEntries(keys.map((key) => [key, [null, null, null, null]])), [keys[0]]: [4, 4, 4, 4] } },
    // Partial: every S has an answer, but only 5 of 20 questions.
    { date: '2026-10-23', area: 'Dock', scope: '5S', scores: Object.fromEntries(keys.map((key, i) => [key, [i === 0 ? 2 : 1, null, null, null]])) },
  ];
  const board = openTool('daily-board', { now: NOW }).DailyBoardMath;
  const pulse = openTool('shift-pulse', { now: NOW }).PulseMath;
  const ops = openTool('ops-report', { now: NOW }).OpsReportMath;
  const signals = openTool('signals', { now: NOW }).SignalsMath;
  for (const row of rows) {
    const complete = M.isComplete(row, cfg.scopes);
    const expected = complete ? M.score(row.scores, M.pillarsFor(row.scope, cfg.scopes)).overall : null;
    const got = { board: board.fivesScore(row), pulse: pulse.fiveSOverall(row.scores), ops: ops.fiveSOverall(row.scores), signals: signals.fiveSOverall(row) };
    for (const [reader, value] of Object.entries(got)) {
      if (expected === null) assert.equal(value, null, `${row.date} is partial: ${reader} gives ${value}`);
      else assert.ok(value !== null && Math.abs(value - expected) < 1e-9, `${row.date}: 5S Audit ${expected}, ${reader} ${value}`);
    }
  }
});
