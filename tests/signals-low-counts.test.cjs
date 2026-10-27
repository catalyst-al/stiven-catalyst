// Signals (src/js/signals.js) on rare events: a stable process of a few counts a day must not raise signals from noise
// (audit P2A-11, T-13). A seeded Monte Carlo of stable Poisson series through the real SignalsMath.analyse and StatsKit
// holds the false-signal rate on the latest day under a stated bound; hand-made series show that a single point on the
// good side needs a lower limit above 0, that a run below a centre line under 1 is no longer 8 zero days, and that a
// real change in a low count is still found.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const load = () => {
  const { window } = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools/signals/', runScripts: 'outside-only' });
  for (const file of ['tool-kit', 'stats-kit', 'signals']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};
const w = load();
const M = w.SignalsMath;
const plain = (value) => JSON.parse(JSON.stringify(value));

// A seeded generator (mulberry32, in 32-bit integers: the audit's LCG loses bits in floating point and draws far too
// few high counts), so the run is the same every time, and Knuth's Poisson.
const generator = (seed) => {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const poisson = (lambda) => { const L = Math.exp(-lambda); let k = 0, p = 1; do { k++; p *= rnd(); } while (p > L); return k - 1; };
  return { rnd, poisson };
};
const series = (kind, points) => ({ tool: 'damage-control', key: `damage-control:${kind}`, kind, better: 'down', unit: kind === 'p' ? 'share' : 'count', target: null, points });
const days = (values, key = 'c') => values.map((value, i) => ({ date: M.addDays('2026-09-01', i), ...(typeof value === 'object' ? value : { [key]: value }) }));
// The share of stable 30-day series with a statistical signal on their latest day, and of those on the good side only.
const falseRate = (make, runs = 4000, seed = 12345) => {
  const g = generator(seed);
  let any = 0, good = 0;
  for (let r = 0; r < runs; r++) {
    const s = make(g);
    const stat = M.analyse(s, []).signals.find((x) => x.kind === 'stat');
    if (stat) { any++; if (!stat.rules.some((x) => x.bad)) good++; }
  }
  return { any: any / runs, good: good / runs };
};
// The bound: with normal data, a point beyond 3σ, a run of 8 and a trend of 6 on the latest point come to about 1 %.
// A stable count may raise a signal on fewer than 2 % of days, and one on the good side on fewer than 0.5 %.
const BOUND = 0.02, GOOD_BOUND = 0.005;

test('stable Poisson counts of 0.2, 0.5, 2 and 10 a day: a signal on fewer than 2 % of days, good side under 0.5 %', () => {
  for (const lambda of [0.2, 0.5, 2, 10]) {
    const rate = falseRate((g) => series('c', days(Array.from({ length: 30 }, () => g.poisson(lambda)))));
    assert.ok(rate.any < BOUND, `Poisson(${lambda}): a signal on ${(rate.any * 100).toFixed(1)} % of days`);
    assert.ok(rate.good < GOOD_BOUND, `Poisson(${lambda}): a good-side signal on ${(rate.good * 100).toFixed(1)} % of days`);
  }
});

test('a stable p-chart with about one defect a day (n = 500): a signal on fewer than 2 % of days', () => {
  const rate = falseRate((g) => series('p', days(Array.from({ length: 30 }, () => ({ d: g.poisson(1), n: 500 })))));
  assert.ok(rate.any < BOUND, `${(rate.any * 100).toFixed(1)} %`);
  assert.ok(rate.good < GOOD_BOUND, `good side ${(rate.good * 100).toFixed(1)} %`);
});

test('eight zero days below a centre line of 0.2 are no signal; a real fall in a low count is still found', () => {
  // 22 days with a few single counts, then 8 days of 0: c̄ = 6/30 = 0.2, so every zero day is below the centre line.
  const quiet = days([0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(plain(M.analyse(series('c', quiet), []).signals), []);
  // About five a day for 20 days, then 10 days of 0 or 1: c̄ = 3.43; each low day is below it with a Poisson chance
  // of 0.55, so a run must be longer than 8 (0.55^10 < 0.5^8): the 10 low days are one.
  const fall = days([4, 6, 5, 5, 7, 3, 5, 6, 4, 5, 6, 4, 5, 5, 6, 4, 5, 5, 4, 6, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0]);
  const stat = M.analyse(series('c', fall), []).signals.find((x) => x.kind === 'stat');
  assert.ok(stat, 'the fall is found');
  assert.deepEqual(plain(stat.rules), [{ rule: 'run', dir: 'down', points: 10, bad: false }]);
  // And a real rise: one day of 6 among days of 0 and 1 is beyond the limit (P(6 or more | 0.4) is far below 0.135 %).
  const rise = days([0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 6]);
  const up = M.analyse(series('c', rise), []).signals.find((x) => x.kind === 'stat');
  assert.equal(up.rules[0].rule, 'beyond');
  assert.equal(up.rules[0].bad, true);
  // Two on a day at c̄ = 8/30 is above the 3σ line (1.82) but happens on 3.0 % of days: not a signal.
  const two = days([0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2]);
  assert.deepEqual(plain(M.analyse(series('c', two), []).signals), []);
});

test('no single point on the good side when the lower control limit is 0', () => {
  // A chart whose StatsKit rule 1 marks the latest point 3σ below the centre while its lower limit is 0: the point is
  // not beyond any limit drawn, so it is not a signal.
  const points = Array.from({ length: 10 }, (_, i) => ({ date: M.addDays('2026-10-01', i), c: i === 9 ? 8 : 25, y: i === 9 ? 8 : 25, center: 25, ucl: 40, lcl: 0, sigma: 5, z: i === 9 ? -3.4 : 0 }));
  const chart = { kind: 'c', center: 25, sigma: 5, points, signals: points.map((_, i) => (i === 9 ? [1] : [])) };
  assert.equal(M.rulesAt(chart, 'down').filter((r) => r.rule === 'beyond').length, 0);
  // The same point under a lower limit of 10 (c̄ = 25: 25 − 3 × 5) is one, on the good side.
  const limited = { ...chart, points: points.map((p) => ({ ...p, lcl: 10 })) };
  assert.deepEqual(plain(M.rulesAt(limited, 'down').filter((r) => r.rule === 'beyond')), [{ rule: 'beyond', dir: 'down', points: 1, bad: false }]);
});

test('StatsKit counts: Poisson and binomial P(X ≤ k) against values worked by hand', () => {
  const K = w.StatsKit;
  const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-9, `${label}: ${actual} ≠ ${expected}`);
  near(K.poissonCdf(0, 0.2), Math.exp(-0.2), 'P(0 | 0.2) = e^-0.2');
  near(K.poissonCdf(1, 2), 3 * Math.exp(-2), 'P(≤1 | 2) = 3e^-2');
  // P(X ≥ 3 | 0.2) = 1 − e^-0.2 (1 + 0.2 + 0.02) = 0.001148: under the one-sided 3σ tail of 0.135 %.
  near(1 - K.poissonCdf(2, 0.2), 1 - Math.exp(-0.2) * 1.22, 'P(≥3 | 0.2)');
  near(K.poissonCdf(2.7, 2), K.poissonCdf(2, 2), 'k is rounded down');
  assert.equal(K.poissonCdf(-1, 2), 0);
  assert.equal(K.poissonCdf(4, 0), 1);
  assert.equal(K.poissonCdf(1, -1), null);
  // 10 trials at 0.1: P(≤1) = 0.9^10 + 10 × 0.1 × 0.9^9 = 0.7360989.
  near(K.binomialCdf(1, 10, 0.1), 0.9 ** 10 + 0.9 ** 9, 'P(≤1 | 10, 0.1)');
  near(K.binomialCdf(0, 500, 0.002), 0.998 ** 500, 'P(0 | 500, 0.002)');
  assert.equal(K.binomialCdf(10, 10, 0.3), 1);
  assert.equal(K.binomialCdf(3, 10, 0), 1);
  assert.equal(K.binomialCdf(3, 10, 1), 0);
  assert.equal(K.binomialCdf(3, 10.5, 0.2), null);
});
