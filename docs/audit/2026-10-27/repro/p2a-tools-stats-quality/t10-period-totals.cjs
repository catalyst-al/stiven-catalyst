// Regression 3: period totals = sum of parts, across DST (25 Oct 2026) and month/week boundaries, in several tools.
// Runs under TZ=Europe/Berlin to expose local-time date arithmetic.
process.env.TZ = 'Europe/Berlin';
const { tool, check, note } = require('./lib.cjs');
const days = (from, n) => [...Array(n)].map((_, i) => { const d = new Date(`${from}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + i); return d.toISOString().slice(0, 10); });

// Shift Pulse: same rows, by day vs by week (Mon 19 Oct .. Sun 1 Nov spans DST end and a month end)
{
  const w = tool('/tools/shift-pulse/', {});
  const ds = days('2026-10-19', 14);
  const rows = ds.flatMap((d, i) => [...Array((i % 4) + 1)].map(() => ({ date: d, shift: 'Early', units: 1 + (i % 3) })));
  const expected = rows.reduce((s, r) => s + r.units, 0);
  const vol = ds.map((d) => ({ date: d, volume: 1000 }));
  const log = { damage: { rows, volumes: vol }, incomplete: { rows: [] }, delay: { rows: [] } };
  const byDay = w.PulseMath.compute(log, { from: ds[0], to: ds.at(-1), unit: 'day' });
  const byWeek = w.PulseMath.compute(log, { from: ds[0], to: ds.at(-1), unit: 'week' });
  check('Pulse: day slots = 14 (DST day counted once)', 14, byDay.slots.length);
  check('Pulse: week slots = 2', 2, byWeek.slots.length);
  check('Pulse: total by day = independent sum', expected, byDay.damage.total);
  check('Pulse: total by week = by day', byDay.damage.total, byWeek.damage.total);
  check('Pulse: sum of week values = total', expected, byWeek.damage.values.reduce((a, b) => a + b, 0));
  check('Pulse: rate = total/14000', expected / 14000, byDay.damage.rate);
}
// Energy: readings across DST and month end; month total vs sum of weeks vs independent
{
  const w = tool('/tools/energy-tracker/', {});
  const E = w.EnergyTrackerMath;
  const ints = E.intervals([{ date: '2026-10-01', value: 1000 }, { date: '2026-10-15', value: 1700 }, { date: '2026-11-02', value: 2600 }]);
  const { days: dayMap } = E.daily(ints);
  check('Energy: 32 days with a figure (1 Oct..1 Nov)', 32, dayMap.size);
  const oct = E.sumRange(dayMap, '2026-10-01', '2026-10-31');
  check('Energy: October use = 31 x 50', 1550, oct.qty);
  const weeks = E.buckets(dayMap, '2026-10-01', '2026-10-31', 'week');
  check('Energy: sum of week buckets = month', 1550, Math.round(weeks.reduce((s, b) => s + b.qty, 0) * 1e6) / 1e6);
  const dstWeek = weeks.find((b) => b.key === '2026-10-19');
  check('Energy: DST week 19–25 Oct = 7 days x 50', 350, dstWeek && dstWeek.qty);
  const months = E.buckets(dayMap, '2026-10-01', '2026-11-30', 'month');
  note('Energy: month buckets', months.map((b) => [b.key, b.qty, b.covered, b.span]));
}
// Waste Log: weekly totals vs totals of the period
{
  const w = tool('/tools/waste-log/', {});
  const W = w.WasteLogMath;
  const ds = days('2026-10-20', 12);
  const rows = ds.map((d, i) => ({ date: d, unit: 'kg', qty: 1.1 * (i + 1), cost: 2.35, category: 'buffet', dest: 'prevented' }));
  const tot = W.totals(rows);
  const wk = W.weekly(rows, ds[0], ds.at(-1), ['prevented']);
  const indep = Math.round(rows.reduce((s, r) => s + Math.round(r.qty * r.cost * 100) / 100, 0) * 100) / 100;
  check('Waste: total value = independent cent-rounded sum', indep, tot.value);
  check('Waste: sum of weekly values = total', tot.value, Math.round(wk.reduce((s, x) => s + x.value, 0) * 100) / 100);
  check('Waste: sum of weekly kg = total kg', tot.kg, Math.round(wk.reduce((s, x) => s + x.kg, 0) * 1e6) / 1e6);
  check('Waste: partial weeks count only their days (first week 20–25 Oct = 6 days)', 6, wk[0].days);
}
// ToolKit trendBuckets: month buckets across DST / leap
{
  const w = tool('/tools/damage-control/', {});
  const K = w.ToolKit;
  const rows = days('2026-10-20', 20).map((d) => ({ date: d }));
  const tr = K.trendBuckets(rows, () => 1, 60, null, { unit: 'week' });
  check('trendBuckets weekly sum = 20 rows', 20, tr.buckets.reduce((s, b) => s + b.value, 0));
  check('trendBuckets weekly keys are Mondays', true, tr.buckets.every((b) => new Date(`${b.key}T00:00:00Z`).getUTCDay() === 1));
  const many = days('2025-01-06', 7 * 70).map((d) => ({ date: d }));
  const big = K.trendBuckets(many, () => 1, 60, null, { unit: 'week' });
  check('trendBuckets: 70 weeks of data -> chart keeps 60 buckets', 60, big.buckets.length);
  note('trendBuckets: sum of shown buckets vs rows (truncation drops oldest weeks from the trend total)', [K.trendTotal(big).value, many.length]);
}
