// Signals: I-MR limits, small-sample gating, and a Monte Carlo of false alarms on STABLE processes using the real code.
const { tool, check, note } = require('./lib.cjs');
const w = tool('/tools/signals/', {});
const S = w.SignalsMath, K = w.StatsKit;
// 1) I-MR limits independent
const vals = [72, 75, 71, 78, 74, 73, 76, 70, 77, 74];
const mean = vals.reduce((a, b) => a + b) / vals.length;
const mr = vals.slice(1).map((v, i) => Math.abs(v - vals[i])); const mrBar = mr.reduce((a, b) => a + b) / mr.length;
const ch = S.chartOf('imr', vals.map((value, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, value })), K);
check('I-MR UCL = mean + 2.66*MRbar (3/1.128=2.6596)', mean + 3 / 1.128 * mrBar, ch.points[0].ucl);
check('I-MR LCL', mean - 3 / 1.128 * mrBar, ch.points[0].lcl);
// 2) p-chart per-point limits
const prow = [[5, 1000], [8, 1500], [3, 600], [6, 1000], [4, 900], [7, 1200], [5, 1000], [9, 1100]].map(([d, n], i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, d, n }));
const pc = S.chartOf('p', prow, K); const pb = prow.reduce((s, r) => s + r.d, 0) / prow.reduce((s, r) => s + r.n, 0);
check('p-chart UCL point 2 (n=600)', pb + 3 * Math.sqrt(pb * (1 - pb) / 600), pc.points[2].ucl);
// 3) fewer than 8 points: no stat alarm, listed as too few
const few = { tool: 'damage-control', key: 'x', kind: 'c', better: 'down', unit: 'count', target: null, points: [1, 0, 2, 9].map((c, i) => ({ date: `2026-10-0${i + 1}`, c })) };
const r3 = S.analyse(few, [], K);
check('4 points: no statistical signal', 0, r3.signals.length);
check('4 points: listed as too few', true, !!r3.tooFew);
// 4) Monte Carlo: stable Poisson c-chart processes, 30 days, alarm on the LATEST point
let seed = 12345; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pois = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
for (const lambda of [0.2, 0.5, 2, 10]) {
  let bad = 0, good = 0, any = 0; const R = 3000;
  for (let r = 0; r < R; r++) {
    const pts = [...Array(30)].map((_, i) => ({ date: S.addDays('2026-09-01', i), c: pois(lambda) }));
    const out = S.analyse({ tool: 'damage-control', key: 'k', kind: 'c', better: 'down', unit: 'count', target: null, points: pts }, [], K);
    const st = out.signals.find((s) => s.kind === 'stat');
    if (st) { any++; if (st.rules.some((x) => x.bad)) bad++; else good++; }
  }
  note(`stable Poisson(${lambda}) c-chart, 30 days: P(signal on latest day)`, { any: (any / R).toFixed(3), worse: (bad / R).toFixed(3), goodSide: (good / R).toFixed(3) });
}
// Independent reference: normal-theory 3-sigma + run8 + trend6 false alarm on one point ~ 0.0027 + 2*0.5^8(=0.0078) + small ≈ 1 %.
// 5) p-chart with tiny expected count (damage 0.2% of 500/day ≈ 1/day)
{
  let bad = 0, good = 0; const R = 3000;
  for (let r = 0; r < R; r++) {
    const pts = [...Array(30)].map((_, i) => ({ date: S.addDays('2026-09-01', i), d: pois(1), n: 500 }));
    const out = S.analyse({ tool: 'damage-control', key: 'k', kind: 'p', better: 'down', unit: 'share', target: null, points: pts }, [], K);
    const st = out.signals.find((s) => s.kind === 'stat');
    if (st) { if (st.rules.some((x) => x.bad)) bad++; else good++; }
  }
  note('stable p-chart ~1 defect/day (n=500), 30 days: P(signal latest day)', { worse: (bad / R).toFixed(3), goodSide: (good / R).toFixed(3) });
}
