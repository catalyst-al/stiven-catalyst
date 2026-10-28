// The KPI integrity of the case thread (second review of PR #367): no "effective" on a before period under the sample
// floor, however many rows come after; a case started from an ISO-week segment is still measurable when the
// countermeasure applies the week after; and a decision never changes by itself when the approved target or the
// historical rows change afterwards: the recorded comparison stays, and the difference is shown. Every row is the
// example station's, invented. Each test that names a fix failed on the code before it.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { tower, startCase } = require('./helpers/cx-tower-page.cjs');

const plain = (value) => JSON.parse(JSON.stringify(value));
const finish = (t, id, from = '2026-09-14') => {
  t.S.update(t.S.forCase(id)[0].id, { status: 'done' });
  t.tab('actions');
  t.tab('deep');
  t.setValue('#cx-verify-from', from);
};
const verdict = (t) => t.body.querySelector('[data-cx-verdict]').dataset.cxVerdict;

test('1. no "effective" on a before period under the sample floor, however many rows come after', () => {
  const C = tower().w.CxTower;
  const after = { k: 13, n: 3388, rate: 13 / 3388 };
  assert.equal(C.verdict({ before: { k: 1, n: 10, rate: 0.1 }, after, minN: 50 }).status, 'insufficient', 'ten rows before say nothing');
  assert.equal(C.verdict({ before: { k: 1, n: 10, rate: 0.1 }, after, minN: 50 }).short, 'before');
  assert.equal(C.verdict({ before: { k: 40, n: 3375, rate: 40 / 3375 }, after: { k: 0, n: 20, rate: 0 }, minN: 50 }).short, 'after');
  assert.equal(C.verdict({ before: { k: 40, n: 3375, rate: 40 / 3375 }, after, minN: 50 }).status, 'effective');
  const t = tower();
  t.tab('deep');
  t.deepMetric('damage');
  // One weekday of evidence (the example has no Sunday deliveries), under a floor of 300; two weeks after it above it.
  t.filter('from', '2026-09-11');
  t.filter('to', '2026-09-11');
  t.setValue('#cx-deep-min', '300');
  t.click(t.button('New investigation'));
  t.type('title', 'Damage, one day of evidence');
  t.type('evidence', 'One day only');
  t.type('rootStatus', 'Verified');
  t.type('root', 'No loading sequence standard');
  t.type('corrective', 'Heavy-first loading sequence');
  t.type('owner', 'Shift Leader');
  t.type('deadline', '2026-09-13');
  t.click(t.button('Create the linked action'));
  const row = t.stored().cases[0];
  assert.ok(row.snapshot.n > 0 && row.snapshot.n < 300, `${row.snapshot.n} rows of evidence, under the floor`);
  finish(t, row.id);
  const text = t.body.querySelector('[data-cx-verify]').textContent;
  assert.equal(verdict(t), 'insufficient', text);
  assert.match(t.body.querySelector('[data-cx-verdict]').textContent, /before period.*\(\d+ of 300\)/);
  t.click(t.body.querySelector('[data-cx-close]'));
  assert.match(t.note(), /before period/);
  assert.equal(t.stored().cases[0].status, 'Verification pending');
  assert.equal(t.S.forCase(row.id)[0].status, 'done');
});

test('2. a case started from an ISO-week segment: the week is the before period, and the weeks after are measured', () => {
  const t = tower();
  t.tab('deep');
  t.deepMetric('damage');
  t.setValue('#cx-deep-dim', 'Week');
  const segment = [...t.body.querySelectorAll('.cx-seg-table .cx-seg')].find((b) => b.textContent === '2026-W37');
  assert.ok(segment, 'the week W37 is a segment');
  t.click(segment);
  t.click(t.button('New investigation'));
  t.type('title', 'Damage in week 37');
  t.type('evidence', 'Week 37 against the other weeks');
  t.type('rootStatus', 'Verified');
  t.type('root', 'No loading sequence standard');
  t.type('corrective', 'Heavy-first loading sequence, from week 38');
  t.type('owner', 'Shift Leader');
  t.type('deadline', '2026-09-13');
  t.click(t.button('Create the linked action'));
  const row = t.stored().cases[0];
  assert.deepEqual([row.snapshot.dim, row.snapshot.segment], ['Week', '2026-W37']);
  // The engine: the before window of a week segment is that week, inside the snapshot's period.
  const C = t.w.CxTower;
  assert.deepEqual(plain(C.beforeWindow(row.snapshot)), { from: '2026-09-07', to: '2026-09-13' });
  assert.deepEqual(plain(C.beforeWindow({ ...row.snapshot, dim: 'DSP', segment: 'DSP B' })), { from: row.snapshot.from, to: row.snapshot.to });
  assert.deepEqual(plain(C.beforeWindow({ ...row.snapshot, to: '2026-09-10' })), { from: '2026-09-07', to: '2026-09-10' }, 'cut to the period');
  // The countermeasure applies from the Monday after: the after window has rows, the week is not a filter on them.
  finish(t, row.id, '2026-09-14');
  const box = t.body.querySelector('[data-cx-verify]').textContent;
  const d = (iso) => t.w.ToolKit.showDate(iso);
  assert.ok(box.includes(`${d('2026-09-07')} – ${d('2026-09-13')}`), `the before window is week 37: ${box}`);
  assert.notEqual(verdict(t), 'insufficient', box);
  const EX = C.example('2026-09-27');
  const ALL = new Set(C.FIELDS.deliveries);
  const settings = { lateMinutes: 5, minSample: 50, loadingTarget: 20 };
  const metric = C.DEEP.find((m) => m.id === 'damage');
  const before = C.deepAggregate(EX.deliveries.filter((r) => r.Date >= '2026-09-07' && r.Date <= '2026-09-13'), metric, settings, ALL);
  const after = C.deepAggregate(EX.deliveries.filter((r) => r.Date >= '2026-09-14'), metric, settings, ALL);
  assert.ok(box.includes(`${before.k} / ${before.n.toLocaleString('en-GB')} eligible`), 'before = week 37 on all rows');
  assert.ok(box.includes(`${after.k} / ${after.n.toLocaleString('en-GB')} eligible`), 'after = every row from 14 Sep');
  assert.equal(verdict(t), C.verdict({ before, after, minN: 50 }).status);
  // Inside week 37 is still inside the before period.
  t.setValue('#cx-verify-from', '2026-09-12');
  assert.equal(verdict(t), 'insufficient');
  assert.match(t.body.querySelector('[data-cx-verdict]').textContent, /must start after the before period ends/);
  t.setValue('#cx-verify-from', '2026-09-14');
  t.click(t.body.querySelector('[data-cx-close]'));
  const decided = t.stored().cases[0];
  assert.equal(decided.status, 'Verified effective');
  assert.deepEqual([decided.verification.before.from, decided.verification.before.to, decided.verification.after.from], ['2026-09-07', '2026-09-13', '2026-09-14']);
});

test('3. a decision does not change by itself when the target or the historical rows change: the recorded comparison stays and the difference is shown', () => {
  const t = tower();
  startCase(t, 'damage', 'Damage on the evening wave');
  t.click(t.button('Create the linked action'));
  const id = t.stored().cases[0].id;
  finish(t, id);
  assert.equal(verdict(t), 'effective');
  t.click(t.body.querySelector('[data-cx-close]'));
  const decided = t.stored().cases[0];
  assert.equal(decided.status, 'Verified effective');
  assert.ok('target' in decided.verification, 'the approved maximum of the day is recorded with the decision');
  const saved = t.all();
  // (a) A stricter approved maximum later: live, the after rate would fail it; the decision stands, and the box says so.
  const withTarget = JSON.parse(saved['sc-cx-tower']);
  withTarget.targets.damage = 0.001;
  const a = tower({ storage: { ...saved, 'sc-cx-tower': JSON.stringify(withTarget) } });
  a.tab('deep');
  const rowA = a.stored().cases[0];
  assert.equal(rowA.status, 'Verified effective');
  assert.deepEqual(plain(rowA.verification), plain(decided.verification), 'nothing rewritten');
  const boxA = a.body.querySelector('[data-cx-verify]').textContent;
  assert.match(boxA, /Decided/);
  assert.ok(boxA.includes(decided.verification.text), 'the recorded comparison is what the box shows');
  const changedA = a.body.querySelector('[data-cx-changed]');
  assert.ok(changedA, 'the change since the decision is shown');
  assert.match(changedA.textContent, /approved maximum/);
  assert.ok(!a.body.querySelector('[data-cx-verdict]')?.textContent.includes('Not effective'), 'no live verdict contradicts the decision in silence');
  // (b) Historical rows re-imported with half of the before period gone: the decision stands, the box names the old
  // and the new numbers.
  const reimported = JSON.parse(saved['sc-cx-tower']);
  const fields = reimported.tables.deliveries.fields;
  const dateAt = fields.indexOf('Date');
  reimported.tables.deliveries.rows = reimported.tables.deliveries.rows.filter((cells, i) => !(cells[dateAt] <= '2026-09-13' && i % 2));
  const b = tower({ storage: { ...saved, 'sc-cx-tower': JSON.stringify(reimported) } });
  b.tab('deep');
  const rowB = b.stored().cases[0];
  assert.equal(rowB.status, 'Verified effective');
  assert.deepEqual(plain(rowB.verification), plain(decided.verification));
  const changedB = b.body.querySelector('[data-cx-changed]');
  assert.ok(changedB);
  assert.ok(changedB.textContent.includes(`${decided.verification.before.k} / ${decided.verification.before.n.toLocaleString('en-GB')}`), `the recorded before: ${changedB.textContent}`);
  assert.match(changedB.textContent, /now/);
  // (c) Nothing changed: no notice.
  const c = tower({ storage: saved });
  c.tab('deep');
  assert.equal(c.body.querySelector('[data-cx-changed]'), null);
  // (d) Before any decision, rows of the evidence period that changed are said against the recorded evidence.
  const t2 = tower();
  startCase(t2, 'damage', 'Damage, evidence then re-import');
  t2.click(t2.button('Create the linked action'));
  const snap = t2.stored().cases[0].snapshot;
  const re2 = t2.stored();
  re2.tables.deliveries.rows = re2.tables.deliveries.rows.filter((cells, i) => !(cells[dateAt] <= '2026-09-13' && i % 2));
  const d2 = tower({ storage: { ...t2.all(), 'sc-cx-tower': JSON.stringify(re2) } });
  d2.tab('deep');
  const changedD = d2.body.querySelector('[data-cx-changed]');
  assert.ok(changedD, 'the evidence no longer matches the rows');
  assert.ok(changedD.textContent.includes(`${snap.k} / ${snap.n.toLocaleString('en-GB')}`));
});
