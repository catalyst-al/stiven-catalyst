// A 5S audit with only a few answers is a partial audit (audit of 27 October 2026, P2B-11): a single "4" read as
// "100 %" and stood in the trend and the league table as if the whole area had been walked. An audit counts there
// only when at least 80 % of its questions are scored and every S has a score; a partial one stays in the log,
// marked, and the page says why it is left out.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-23T10:00:00Z';
const plain = (value) => JSON.parse(JSON.stringify(value));
const KEYS = ['sort', 'set', 'shine', 'standardize', 'sustain'];
const all = (value) => Object.fromEntries(KEYS.map((key) => [key, [value, value, value, value]]));
const ROWS = [
  { id: 'd1', date: '2026-10-01', area: 'Dock', auditor: 'Ana', shift: 'Early', scope: '5S', scores: all(2), notes: {} },
  // One "4" in Sort and nothing else: 1 of 20 questions.
  { id: 'd2', date: '2026-10-08', area: 'Dock', auditor: 'Ana', shift: 'Early', scope: '5S', scores: { ...Object.fromEntries(KEYS.map((key) => [key, [null, null, null, null]])), sort: [4, null, null, null] }, notes: {} },
  { id: 'p1', date: '2026-10-05', area: 'Packing', auditor: 'Ben', shift: 'Late', scope: '5S', scores: all(3), notes: {} },
  { id: 'p2', date: '2026-10-12', area: 'Packing', auditor: 'Ben', shift: 'Late', scope: '5S', scores: all(3), notes: {} },
];

test('the arithmetic: coverage makes an audit complete or partial, and only complete audits trend and rank', () => {
  const w = openTool('five-s-audit', { now: NOW });
  const M = w.FiveSMath;
  const scopes = { '5S': KEYS };
  assert.equal(M.COMPLETE_SHARE, 0.8);
  assert.equal(M.score(ROWS[0].scores, KEYS).complete, true);
  const one = M.score(ROWS[1].scores, KEYS);
  assert.deepEqual([one.overall, one.answered, one.total, one.complete], [1, 1, 20, false], 'a single 4 is 100 % of what was asked, and partial');
  // 16 of 20 answered with every S scored is complete; 16 of 20 with one S empty is not.
  const sixteen = { sort: [4, 4, 4, null], set: [4, 4, 4, null], shine: [4, 4, 4, null], standardize: [4, 4, 4, null], sustain: [4, 4, 4, 4] };
  assert.equal(M.score(sixteen, KEYS).complete, true, '80 % with every S scored');
  const noSustain = { sort: [4, 4, 4, 4], set: [4, 4, 4, 4], shine: [4, 4, 4, 4], standardize: [4, 4, 4, 4], sustain: [null, null, null, null] };
  assert.equal(M.score(noSustain, KEYS).complete, false, 'an S without a score is not an audit of the whole standard');
  assert.equal(M.score({ sort: [4, 4, 4, null, null], set: [4, 4, 4, 4, 4] }, ['sort', 'set']).complete, true, '8 of 10');
  assert.equal(M.score({ sort: [4, 4, 4, null, null], set: [4, 4, 4, 4, null] }, ['sort', 'set']).complete, false, '7 of 10');
  assert.equal(M.score({ sort: [4, 4, 4, 4, null], set: [4, 4, 4, 4, null], shine: [4, 4, 4, 4, 4] }, ['sort', 'set', 'shine']).complete, true, '12 of 15 is 80 % exactly');
  // Saved by an older version: arrays of the answered questions only. They count as before.
  assert.equal(M.score({ sort: [2] }, ['sort']).complete, true);
  const trend = plain(M.trend(ROWS, scopes));
  assert.deepEqual(trend.map((s) => [s.area, s.points.map((p) => p.pct)]), [['Packing', [0.75, 0.75]], ['Dock', [0.5]]], 'the partial Dock audit is not a point');
  const league = plain(M.latestByArea(ROWS, scopes));
  assert.deepEqual(league.map((x) => [x.area, x.pct, x.date]), [['Packing', 0.75, '2026-10-12'], ['Dock', 0.5, '2026-10-01']], 'Dock ranks by its latest complete audit');
  assert.deepEqual(plain(M.latestByArea([ROWS[1]], scopes)), [], 'an area with only partial audits is not ranked');
  assert.equal(M.partialCount(ROWS, scopes), 1);
});

for (const [lang, word, note] of [
  ['en', 'partial', /1 partial audit .*left out of the trend and the league table.*80 %/],
  ['de', 'unvollständig', /1 unvollständiges Audit .*nicht im Trend und nicht in der Rangliste.*80 %/],
  ['sq', 'i pjesshëm', /1 auditim i pjesshëm .*nuk hyn në trend dhe në renditje.*80 %/],
]) {
  test(`${lang}: the page marks the partial audit and leaves it out of the trend and the league table`, () => {
    const key = lang === 'en' ? 'sc-five-s-audit' : `sc-five-s-audit-${lang}`;
    const w = openTool('five-s-audit', { lang, now: NOW, storage: { [key]: { scope: '5S', rows: ROWS, tags: [], view: 'd2' } } });
    const doc = w.document;
    const results = doc.querySelector('[data-results]');
    const league = results.querySelector('.fs-panel-league');
    assert.ok(league, 'a league table');
    // The bars' tips: area · date: share. Dock stands with its complete audit of 1 October, not the single "4".
    const dock = [...league.querySelectorAll('[data-tip]')].map((g) => g.dataset.tip).filter((tip) => tip.startsWith('Dock'));
    assert.equal(dock.length, 1);
    assert.match(dock[0], /^Dock · .*: 50\s?%$/, 'the single 4 is not a 100 % in the league table');
    const trend = results.querySelector('.fs-panel-trend');
    assert.ok(trend, 'a trend');
    const dockPoints = [...trend.querySelectorAll('[data-tip]')].map((g) => g.dataset.tip).filter((tip) => tip.startsWith('Dock'));
    assert.ok(dockPoints.length >= 1 && dockPoints.every((tip) => /: 50\s?%$/.test(tip)), `the trend has no 100 % point for Dock: ${dockPoints}`);
    assert.match(trend.textContent, note);
    const rows = [...doc.querySelectorAll('[data-log] tr')];
    const partial = rows.filter((tr) => tr.textContent.includes(word));
    assert.equal(partial.length, 1, 'one log row marked partial');
    assert.match(partial[0].textContent, /Dock/);
    assert.match(results.querySelector('.fs-stats').textContent, new RegExp(word), 'the result says the shown audit is partial');
  });
}
