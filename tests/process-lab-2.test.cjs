// Process Lab, the second set of tabs (src/js/process-lab-2.js) and the statistics behind it (src/js/stats-kit.js):
// the control chart constants and limits against the printed tables and textbook examples (Montgomery's c and np
// examples), phases, the chi-square test, the regression line (Anscombe's first set), Fleiss' kappa (the textbook
// example of 14 raters), the AIAG MSA Gage R&R example worked by ANOVA, pasting, the examples and the data files.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const dataFile = (lang) => (lang === 'en' ? 'src/_data/processLab.json' : `src/_data/${lang}/processLab.json`);
const near = (actual, expected, tolerance, label) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} is not within ${tolerance} of ${expected}`);

// The partial with its includes put in and its template tags taken out, the loop over the chart kinds written out.
const partial = (name) => fs.readFileSync(`src/_includes/partials/${name}.njk`, 'utf8');
const pageHtml = (lang) => {
  const data = read(dataFile(lang));
  const kinds = data.lab.kinds.map((kind) => `<label class="pl-choice"><input type="radio" name="pl-kind" value="${kind.id}" data-kind> <span><strong>${kind.ask}</strong> <small>${kind.chart}</small></span></label>`).join('');
  return partial('process-lab')
    .replace('{% include "partials/process-lab-2-tabs.njk" %}', partial('process-lab-2-tabs'))
    .replace('{% include "partials/process-lab-2.njk" %}', partial('process-lab-2').replace(/\{%- for kind in cfg\.lab\.kinds %\}[\s\S]*?\{%- endfor %\}/, kinds))
    .replace(/\{#[\s\S]*?#\}/g, '').replace(/\{%-?[\s\S]*?-?%\}/g, '')
    .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *'([^']+)' *\| *local\(lang\) *\}\}/g, (match, url) => (lang === 'en' ? url : `/${lang}${url}`))
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(data))
    .replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '');
};
const strings = (lang) => ({ ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/process-lab.json')[lang], ...read('src/_data/i18n-parts/process-lab-2.json')[lang] });

const load = (lang = 'en', { page = false, now = '2026-10-23T10:00:00Z', storage = null } = {}) => {
  const html = `<html lang="${lang}"><body>${page ? pageHtml(lang) : ''}</body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/process-lab/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  if (storage) Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  // The translated pages load their texts from ui.json; until the integrator merges them, the part files add theirs.
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'stats-kit', 'process-lab', 'process-lab-2']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

// The AIAG MSA (4th edition) Gage R&R study: 10 parts, appraisers A, B and C, 3 trials each.
const AIAG = {
  A: [[0.29, -0.56, 1.34, 0.47, -0.80, 0.02, 0.59, -0.31, 2.26, -1.36], [0.41, -0.68, 1.17, 0.50, -0.92, -0.11, 0.75, -0.20, 1.99, -1.25], [0.64, -0.58, 1.27, 0.64, -0.84, -0.21, 0.66, -0.17, 2.01, -1.31]],
  B: [[0.08, -0.47, 1.19, 0.01, -0.56, -0.20, 0.47, -0.63, 1.80, -1.68], [0.25, -1.22, 0.94, 1.03, -1.20, 0.22, 0.55, 0.08, 2.12, -1.62], [0.07, -0.68, 1.34, 0.20, -1.28, 0.06, 0.83, -0.34, 2.19, -1.50]],
  C: [[0.04, -1.38, 0.88, 0.14, -1.46, -0.29, 0.02, -0.46, 1.77, -1.49], [-0.11, -1.13, 1.09, 0.20, -1.07, -0.67, 0.01, -0.56, 1.45, -1.77], [-0.15, -0.96, 0.67, 0.11, -1.45, -0.49, 0.21, -0.49, 1.87, -2.16]],
};
const aiagCube = () => [...Array(10)].map((_, i) => ['A', 'B', 'C'].map((op) => AIAG[op].map((trial) => trial[i])));

test('the subgroup constants are the printed ones', () => {
  const { StatsKit: S } = load();
  const table = { 2: [1.880, 0, 3.267, 1.128, 2.659, 0, 3.267, 0.7979], 5: [0.577, 0, 2.114, 2.326, 1.427, 0, 2.089, 0.9400], 8: [0.373, 0.136, 1.864, 2.847, 1.099, 0.185, 1.815, 0.9650], 10: [0.308, 0.223, 1.777, 3.078, 0.975, 0.284, 1.716, 0.9727], 25: [0.153, 0.459, 1.541, 3.931, 0.606, 0.565, 1.435, 0.9896] };
  for (const [n, [A2, D3, D4, d2, A3, B3, B4, c4]] of Object.entries(table)) {
    const k = S.spcConstants(Number(n));
    assert.deepEqual(plain([k.A2, k.D3, k.D4, k.d2, k.A3, k.B3, k.B4, k.c4]), [A2, D3, D4, d2, A3, B3, B4, c4], `n = ${n}`);
  }
  // The table agrees with its own definitions: c4 from the gamma function, A2 = 3 / (d2 √n), A3 = 3 / (c4 √n).
  for (let n = 2; n <= 25; n++) {
    const k = S.spcConstants(n);
    near(k.c4, Math.sqrt(2 / (n - 1)) * Math.exp(S.lgamma(n / 2) - S.lgamma((n - 1) / 2)), 6e-5, `c4(${n})`);
    near(k.A2, 3 / (k.d2 * Math.sqrt(n)), 7e-4, `A2(${n})`);
    near(k.A3, 3 / (k.c4 * Math.sqrt(n)), 7e-4, `A3(${n})`);
    if (k.D3 > 0) near(k.D3 + k.D4, 2, 2e-3, `D3 + D4 (${n})`);
  }
  assert.equal(S.spcConstants(1), null);
  assert.equal(S.spcConstants(26), null);
  assert.equal(S.spreadFor(8), 'R');
  assert.equal(S.spreadFor(9), 'S');
});

test('Xbar-R and Xbar-S limits of a small dataset worked by hand', () => {
  const { StatsKit: S } = load();
  // Subgroups 1 2 3 / 2 3 4 / 3 4 5: means 2, 3, 4, X̿ = 3; every range 2, every s 1.
  const rows = [[1, 2, 3], [2, 3, 4], [3, 4, 5]].map((values) => ({ values }));
  const r = S.controlChart('xbar', rows);
  assert.equal(r.spread, 'R');
  near(r.points[0].center, 3, 1e-12, 'X̿');
  near(r.points[0].ucl, 3 + 1.023 * 2, 1e-9, 'UCL = X̿ + A2 R̄');
  near(r.points[0].lcl, 3 - 1.023 * 2, 1e-9, 'LCL = X̿ − A2 R̄');
  near(r.second[0].center, 2, 1e-12, 'R̄');
  near(r.second[0].ucl, 2.574 * 2, 1e-9, 'UCL R = D4 R̄');
  assert.equal(r.second[0].lcl, 0, 'LCL R = D3 R̄ = 0 for n = 3');
  const s = S.controlChart('xbar', rows, { spread: 'S' });
  near(s.points[0].ucl, 3 + 1.954 * 1, 1e-9, 'UCL = X̿ + A3 s̄');
  near(s.second[0].center, 1, 1e-12, 's̄');
  near(s.second[0].ucl, 2.568, 1e-9, 'UCL S = B4 s̄');
  // Groups of ten go on an S chart by themselves.
  const ten = S.controlChart('xbar', [...Array(5)].map((_, i) => ({ values: [...Array(10)].map((__, j) => 10 + ((i + j) % 4)) })));
  assert.equal(ten.spread, 'S');
  assert.equal(ten.subgroup, 10);
});

test('c and np charts: Montgomery\'s printed circuit boards and orange juice cans', () => {
  const { StatsKit: S } = load();
  // Nonconformities on 26 samples of 100 boards: c̄ 19.85, UCL 33.22, LCL 6.48; samples 6 and 20 are outside.
  const boards = [21, 24, 16, 12, 15, 5, 28, 20, 31, 25, 20, 24, 16, 19, 10, 17, 13, 22, 18, 39, 30, 24, 16, 19, 17, 15];
  const c = S.controlChart('c', boards.map((count) => ({ count })));
  near(c.points[0].center, 19.85, 0.005, 'c̄');
  near(c.points[0].ucl, 33.22, 0.01, 'UCL');
  near(c.points[0].lcl, 6.48, 0.01, 'LCL');
  assert.deepEqual(plain(c.events.filter((e) => e.rule === 1).map((e) => e.from + 1)), [6, 20]);
  // Nonconforming cans in 30 samples of 50: p̄ 0.2313, so n p̄ 11.57, UCL 20.51, LCL 2.62; samples 15 and 23 are outside.
  const cans = [12, 15, 8, 10, 4, 7, 16, 9, 14, 10, 5, 6, 17, 12, 22, 8, 10, 5, 13, 11, 20, 18, 24, 15, 9, 12, 7, 13, 9, 6];
  const np = S.controlChart('np', cans.map((count) => ({ count, size: 50 })));
  near(np.phases[0].rate, 0.2313, 1e-4, 'p̄');
  near(np.points[0].ucl, 20.51, 0.01, 'UCL');
  near(np.points[0].lcl, 2.62, 0.01, 'LCL');
  assert.deepEqual(plain(np.events.filter((e) => e.rule === 1).map((e) => e.from + 1)), [15, 23]);
});

test('u chart limits follow each sample\'s size', () => {
  const { StatsKit: S } = load();
  // 14 defects on 8 units: ū = 1.75, limits ū ± 3 √(ū / n) for each n.
  const rows = [[2, 1], [3, 2], [8, 4], [1, 1]].map(([count, size]) => ({ count, size }));
  const u = S.controlChart('u', rows);
  near(u.points[0].center, 1.75, 1e-12, 'ū');
  [1, 2, 4, 1].forEach((n, i) => {
    near(u.points[i].ucl, 1.75 + 3 * Math.sqrt(1.75 / n), 1e-12, `UCL ${i}`);
    near(u.points[i].lcl, Math.max(0, 1.75 - 3 * Math.sqrt(1.75 / n)), 1e-12, `LCL ${i}`);
  });
  near(u.points[2].y, 2, 1e-12, '8 defects on 4 units');
});

test('phases: limits per phase, Nelson rules within each, and a split too near the end is ignored', () => {
  const { StatsKit: S, ProcessLab2Math: M } = load();
  const before = [10, 11, 9, 10, 12, 10, 9, 11, 10, 10];
  const after = [6, 7, 5, 6, 6, 7, 5, 6, 6, 7];
  const rows = [...before, ...after].map((value) => ({ value }));
  const one = S.controlChart('imr', rows);
  const two = S.controlChart('imr', rows, { phases: [10] });
  assert.equal(two.phases.length, 2);
  near(two.phases[0].center, 10.2, 1e-12, 'level before');
  near(two.phases[1].center, 6.1, 1e-12, 'level after');
  assert.equal(two.second[10].y, null, 'no moving range across the change');
  assert.ok(one.events.some((e) => e.rule === 2), 'without phases the drop is a shift');
  assert.equal(two.events.length, 0, 'with phases each part is stable');
  assert.equal(S.controlChart('imr', rows, { phases: [19] }).phases.length, 1, 'a phase of one row is not a phase');
  const verdict = M.phaseTest('imr', rows, two);
  assert.equal(verdict.verdict, 'real');
  assert.ok(verdict.p < 0.001);
});

test('chi-square: a 2 × 2 table with a known p, small expected counts and zero rows', () => {
  const { StatsKit: S } = load();
  const r = S.chiSquare([[20, 30], [30, 20]]);
  near(r.chi2, 4, 1e-12, 'χ²');
  assert.equal(r.df, 1);
  near(r.p, 0.0455, 1e-4, 'p');
  near(r.cramersV, 0.2, 1e-12, 'V');
  assert.equal(r.lowCells, 0);
  const small = S.chiSquare([[3, 1], [1, 3]]);
  assert.equal(small.lowCells, 4, 'every cell expects 2');
  const trimmed = S.chiSquare([[5, 0, 7], [0, 0, 0], [6, 0, 2]]);
  assert.deepEqual(plain(trimmed.kept), { rows: [0, 2], cols: [0, 2] });
  assert.equal(S.chiSquare([[1, 2]]), null);
  assert.equal(S.chiSquare([[1, -2], [3, 4]]), null);
  // 3 × 4: df 6, χ² 0.95 quantile 12.592.
  near(1 - S.chi2Cdf(12.592, 6), 0.05, 2e-4, 'χ² table value');
});

test('regression: Anscombe\'s first set (slope 0.500, r² 0.667, p 0.002)', () => {
  const { StatsKit: S } = load();
  const x = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
  const y = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];
  const fit = S.linearFit(x, y);
  near(fit.slope, 0.5001, 1e-4, 'slope');
  near(fit.intercept, 3.0001, 1e-4, 'intercept');
  near(fit.r2, 0.6665, 1e-4, 'r²');
  near(fit.se, 0.1179, 1e-4, 'SE of the slope');
  near(fit.t, 4.241, 1e-3, 't');
  near(fit.p, 0.00217, 1e-5, 'p');
  near(fit.ci95[0], 0.233, 1e-3, 'lower 95 %');
  near(fit.ci95[1], 0.767, 1e-3, 'upper 95 %');
  near(fit.residualSd, 1.237, 1e-3, 'residual sd');
  assert.equal(S.linearFit([1, 1, 1], [1, 2, 3]), null, 'no spread in x');
});

test('Fleiss\' kappa: 10 subjects, 14 raters, 5 categories gives 0.210', () => {
  const { StatsKit: S } = load();
  const counts = [[0, 0, 0, 0, 14], [0, 2, 6, 4, 2], [0, 0, 3, 5, 6], [0, 3, 9, 2, 0], [2, 2, 8, 1, 1], [7, 7, 0, 0, 0], [3, 2, 6, 3, 0], [2, 5, 3, 2, 2], [6, 5, 2, 1, 0], [0, 2, 2, 3, 7]];
  const k = S.fleissKappa(counts);
  near(k.Pbar, 0.378, 1e-3, 'P̄');
  near(k.Pe, 0.213, 1e-3, 'P̄e');
  near(k.kappa, 0.210, 1e-3, 'kappa');
  assert.equal(S.fleissKappa([[1, 1], [2, 1]]), null, 'the same number of raters for every subject');
  assert.equal(S.kappaBand(0.9), 'excellent');
  assert.equal(S.kappaBand(0.75), 'good');
  assert.equal(S.kappaBand(0.7499), 'poor');
  // Exact interval for 9 of 10: 55.5 % to 99.7 %.
  const ci = S.binomialCi(9, 10);
  near(ci[0], 0.5550, 1e-4, 'lower');
  near(ci[1], 0.9975, 1e-4, 'upper');
});

test('attribute agreement: within, against the standard, between appraisers', () => {
  const { StatsKit: S } = load();
  const std = ['g', 'g', 'b', 'g', 'b', 'g'];
  const r = S.attributeAgreement({ ratings: [[std, std], [std, ['g', 'b', 'b', 'g', 'b', 'g']]], standard: std });
  assert.equal(r.appraisers[0].within.agree, 6);
  assert.equal(r.appraisers[0].vsStandard.agree, 6);
  near(r.appraisers[0].vsStandard.kappa, 1, 1e-12, 'perfect kappa');
  assert.equal(r.appraisers[1].within.agree, 5, 'one part judged differently');
  assert.equal(r.appraisers[1].vsStandard.agree, 5);
  assert.deepEqual(plain(r.appraisers[1].wrong), { b: 0, g: 1 }, 'one good part called bad');
  assert.equal(r.between.agree, 5);
  assert.equal(r.allVsStandard.agree, 5);
  assert.equal(S.attributeAgreement({ ratings: [] }), null);
});

test('Gage R&R by ANOVA: the AIAG example (%GRR 27.9, ndc 4, interaction pooled)', () => {
  const { StatsKit: S } = load();
  const g = S.gageRR(aiagCube(), { tolerance: 5 });
  const row = (source) => g.anova.find((item) => item.source === source);
  near(row('part').ss, 88.3619, 1e-4, 'SS parts');
  near(row('operator').ss, 3.1673, 1e-4, 'SS appraisers');
  near(row('total').ss, 94.6471, 1e-4, 'SS total');
  assert.equal(g.pooled, true, 'interaction p 0.97, pooled');
  near(g.pInteraction, 0.974, 1e-3, 'interaction p');
  near(row('repeatability').ss, 0.3590 + 2.7589, 1e-3, 'SS pooled error');
  near(g.components.repeatability.sd, 0.19993, 1e-5, 'EV');
  near(g.components.reproducibility.sd, 0.22684, 1e-5, 'AV');
  near(g.components.grr.sd, 0.30237, 1e-5, 'GRR');
  near(g.components.part.sd, 1.04233, 1e-5, 'PV');
  near(g.components.total.sd, 1.08530, 1e-5, 'TV');
  near(g.components.grr.pctStudy, 0.2786, 1e-4, '%GRR');
  near(g.components.repeatability.pctStudy, 0.1842, 1e-4, '%EV');
  near(g.components.reproducibility.pctStudy, 0.2090, 1e-4, '%AV');
  near(g.components.part.pctStudy, 0.9604, 1e-4, '%PV');
  near(g.components.grr.pctContribution, 0.0776, 1e-4, '% contribution');
  near(g.components.grr.pctTolerance, 6 * 0.30237 / 5, 1e-5, '% tolerance');
  assert.equal(g.ndc, 4, '1.41 × 1.042 / 0.302 = 4.86, rounded down');
  assert.equal(S.gageBand(g.components.grr.pctStudy), 'depends');
  assert.equal(S.gageBand(0.09), 'good');
  assert.equal(S.gageBand(0.31), 'bad');
  // A strong interaction stays in the model: operator 2 reads part 1 high and part 2 low.
  const y = [[[1, 1.1], [3, 3.1]], [[2, 2.1], [0, 0.1]], [[5, 5.1], [5, 5.1]]];
  const full = S.gageRR(y);
  assert.equal(full.pooled, false);
  assert.ok(full.components.interaction.variance > 0);
  assert.equal(S.gageRR([[[1, 2]], [[1]]]), null, 'unbalanced');
});

test('pasting: chart rows, a table, pairs, a study table, wide and long Gage data', () => {
  const en = load('en').ProcessLab2Math;
  const xbar = en.parseChartRows('Date\tP1\tP2\tP3\n2026-10-01\t10\t11\t12\n2026-10-02\t9\n2026-10-05\t10\t10\t11\n', 'xbar');
  assert.equal(xbar.rows.length, 2);
  assert.equal(xbar.skipped, 1, 'a group of one value');
  assert.deepEqual(plain(xbar.rows[0]), { label: '2026-10-01', date: '2026-10-01', values: [10, 11, 12] });
  assert.deepEqual(plain(en.parseChartRows('Mon,3,50\nTue,60,50', 'np')), { rows: [{ label: 'Mon', date: '', count: 3, size: 50 }], skipped: 1 });
  assert.deepEqual(plain(en.parseChartRows('12345\n6', 'c').rows.map((row) => row.count)), [12345, 6], 'a five-digit count is not a date');
  const table = en.parseTable('Shift\tA\tB\nEarly\t3\t4\nLate\t5\t\n');
  assert.deepEqual(plain(table.counts), [[3, 4], [5, 0]]);
  assert.deepEqual(plain([table.rowName, table.rowLabels, table.colLabels]), ['Shift', ['Early', 'Late'], ['A', 'B']]);
  const xy = en.parseXY('Pallets\tMinutes\n10\t30\nTruck 7\t12\t35\n');
  assert.deepEqual(plain(xy), { points: [{ x: 10, y: 30, label: '' }, { x: 12, y: 35, label: 'Truck 7' }], xName: 'Pallets', yName: 'Minutes' });
  const attr = en.parseAttribute('Part\tStandard\tAnna 1\tAnna 2\tBen 1\tBen 2\n1\tGood\tgood\tGood\tbad\tgood\n2\tBad\tbad\tbad\tbad\t\n3\tBad\tBad\tbad\tbad\tbad\n');
  assert.deepEqual(plain(attr.names), ['Anna', 'Ben']);
  assert.deepEqual(plain(attr.standard), ['good', 'bad']);
  assert.deepEqual(plain(attr.ratings[1]), [['bad', 'bad'], ['good', 'bad']]);
  assert.equal(attr.skipped, 1, 'the row with an empty cell');
  assert.equal(attr.labels.good, 'Good');
  const wide = en.parseGage('Part\tA1\tA2\tB1\tB2\n1\t1.0\t1.1\t1.2\t1.3\n2\t2.0\t2.1\t2.2\t2.3\n');
  assert.deepEqual(plain(wide.y), [[[1, 1.1], [1.2, 1.3]], [[2, 2.1], [2.2, 2.3]]]);
  const long = en.parseGage(['Part\tOperator\tValue', ...[1, 2, 3].flatMap((part) => ['A', 'B'].flatMap((op) => [0, 1].map((trial) => `${part}\t${op}\t${part + trial / 10}`)))].join('\n'));
  assert.equal(long.long, true);
  assert.deepEqual(plain(long.operators), ['A', 'B']);
  assert.deepEqual(plain(long.y[2][1]), [3, 3.1]);
  assert.equal(en.parseGage('Part\tA1\tA2\tB1\n1\t1\t2\t3\n2\t1\t2\t3').error, 'unbalanced');
  const de = load('de').ProcessLab2Math;
  assert.deepEqual(plain(de.parseChartRows('14.10.2026 47,2 44,1\n15.10.2026 45,0 46,3', 'xbar').rows.map((row) => row.values)), [[47.2, 44.1], [45, 46.3]], 'a German paste with spaces');
  assert.equal(de.exampleText(['Teil', 'A 1'], ['1|0.29', '2|-1.36']), 'Teil\tA 1\n1\t0,29\n2\t-1,36');
});

// Audit 27 Oct 2026, P2B-01: the second set read pastes the same way, so "47,2" on the English page was a row of 47
// and 2. Every section now reads the decimal mark from the paste (process-lab.js, readPaste) in all three languages.
test('pasting: every section reads decimal commas and points the same in English, German and Albanian', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const M = load(lang).ProcessLab2Math;
    const at = `${lang}: `;
    assert.deepEqual(plain(M.parseChartRows('47,2\n48,1\n46,9', 'imr').rows.map((row) => row.value)), [47.2, 48.1, 46.9], `${at}a decimal-comma column`);
    assert.deepEqual(plain(M.parseChartRows('47.2\n48.1', 'imr').rows.map((row) => row.value)), [47.2, 48.1], `${at}a decimal-point column`);
    assert.deepEqual(plain(M.parseChartRows('14.10.2026 47,2 44,1\n15.10.2026 45,0 46,3', 'xbar').rows.map((row) => row.values)), [[47.2, 44.1], [45, 46.3]], `${at}subgroups with spaces`);
    assert.deepEqual(plain(M.parseChartRows('2026-10-14\t47.2\t44.1\n2026-10-15\t45.0\t46.3', 'xbar').rows.map((row) => row.values)), [[47.2, 44.1], [45, 46.3]], `${at}subgroups from Excel`);
    assert.deepEqual(plain(M.parseChartRows('Mon,3,50\nTue,60,50', 'np').rows.map((row) => [row.count, row.size])), [[3, 50]], `${at}a comma-separated file`);
    assert.deepEqual(plain(M.parseXY('Pallets\tMinutes\n10\t30,5\n12\t35,25').points.map((p) => [p.x, p.y])), [[10, 30.5], [12, 35.25]], `${at}pairs with a decimal comma`);
    assert.deepEqual(plain(M.parseXY('10;1.234,5\n12;987,5').points.map((p) => p.y)), [1234.5, 987.5], `${at}pairs with German thousands`);
    assert.deepEqual(plain(M.parseGage('Part\tA1\tA2\tB1\tB2\n1\t1,0\t1,1\t1,2\t1,3\n2\t2,0\t2,1\t2,2\t2,3\n').y), [[[1, 1.1], [1.2, 1.3]], [[2, 2.1], [2.2, 2.3]]], `${at}Gage data with decimal commas`);
    assert.equal(M.parseChartRows('47,2\n48,1', 'imr').ambiguous, null, `${at}nothing unclear`);
    const unclear = M.parseChartRows('1,234\n1,236\n1,229', 'imr');
    assert.deepEqual(plain(unclear.rows.map((row) => row.value)), lang === 'en' ? [1234, 1236, 1229] : [1.234, 1.236, 1.229], `${at}the page's convention`);
    assert.equal(unclear.ambiguous.count, 3, `${at}the warning counts the values`);
    assert.equal(M.parseXY('1\t1,234\n2\t1,236').ambiguous.token, '1,234', `${at}pairs warn too`);
    const counts = M.parseTable('Shift\tA\tB\nEarly\t1,234\t87\nLate\t1.050\t90');
    assert.deepEqual(plain(counts.counts), [[1234, 87], [1050, 90]], `${at}counts are whole: a separator groups thousands`);
    assert.equal(counts.ambiguous, null, `${at}and that is not unclear`);
  }
});

test('the page shows the warning when a pasted decimal mark is unclear', () => {
  const texts = { en: /Check the decimal mark/, de: /Dezimalzeichen/, sq: /shenjën dhjetore/ };
  for (const lang of ['en', 'de', 'sq']) {
    const w = load(lang, { page: true });
    const box = w.document.querySelector('[data-lab="chart"]');
    const textarea = box.querySelector("textarea[name='text']");
    w.document.querySelector(`[data-kind][value="imr"]`).click();
    textarea.value = '47,2\n48,1\n46,9\n47,5\n48,0\n47,7';
    textarea.dispatchEvent(new w.Event('input', { bubbles: true }));
    assert.doesNotMatch(box.textContent, texts[lang], `${lang}: a clear column`);
    assert.match(box.querySelector('[data-count]').textContent, /6/, `${lang}: six rows`);
    textarea.value = '1,234\n1,236\n1,229\n1,241\n1,238';
    textarea.dispatchEvent(new w.Event('input', { bubbles: true }));
    assert.match(box.textContent, texts[lang], `${lang}: the unclear decimal mark is said`);
  }
});

test('the examples: the Xbar-R example drops at its change, the tables give the intended verdicts', () => {
  const { StatsKit: S, ProcessLab2Math: M } = load();
  const lab = read(dataFile('en')).lab;
  const ex = lab.examples;
  const xbar = M.parseChartRows(M.exampleText(ex.xbar.header, ex.xbar.rows), 'xbar').rows;
  assert.equal(xbar.length, 25);
  const chart = S.controlChart('xbar', xbar, { phases: [ex.xbar.split - 1] });
  assert.equal(chart.spread, 'R');
  assert.ok(chart.phases[1].center < chart.phases[0].center - 5, 'about 7 minutes faster after the change');
  assert.ok(chart.phases[1].sigma < chart.phases[0].sigma, 'and steadier');
  assert.equal(M.phaseTest('xbar', xbar, chart).verdict, 'real');
  assert.ok(chart.events.some((e) => e.rule === 1 && e.from === 8), 'one disturbed day before the change');
  for (const kind of ['np', 'c', 'u']) {
    const rows = M.parseChartRows(M.exampleText(ex[kind].header, ex[kind].rows), kind).rows;
    assert.equal(rows.length, ex[kind].rows.length, `${kind}: every row reads`);
    assert.ok(S.controlChart(kind, rows).events.some((e) => e.rule === 1), `${kind}: a point beyond the limit`);
  }
  const chi = S.chiSquare(M.parseTable(M.exampleText(ex.chi.header, ex.chi.rows)).counts);
  assert.ok(chi.p < 0.01 && chi.lowCells === 0, 'defects depend on the shift');
  const xy = M.parseXY(M.exampleText(ex.reg.header, ex.reg.rows));
  const fit = S.linearFit(xy.points.map((p) => p.x), xy.points.map((p) => p.y));
  near(fit.slope, 1.8, 0.15, 'about 1.8 minutes per pallet');
  assert.ok(fit.r2 > 0.6 && fit.p < 0.001);
  const attr = M.parseAttribute(M.exampleText(ex.attr.header, ex.attr.rows));
  const agreement = S.attributeAgreement({ ratings: attr.ratings, standard: attr.standard });
  assert.equal(S.kappaBand(agreement.between.kappa), 'poor');
  const gage = M.parseGage(M.exampleText(ex.gage.header, ex.gage.rows));
  near(S.gageRR(gage.y).components.grr.pctStudy, 0.2786, 1e-4, 'the AIAG study');
});

test('the page opens every new section on its example, in German, with charts and hand-offs', () => {
  const w = load('de', { page: true });
  const doc = w.document;
  const out = (name) => doc.querySelector(`[data-lab="${name}"] [data-out]`);
  // The control charts: Xbar-R with the change at row 16, both charts with step limits.
  const chart = out('chart');
  assert.match(chart.textContent, /Xbar-R-Karte/);
  assert.ok(chart.querySelectorAll('svg.ck-chart').length >= 2, 'Xbar and R');
  assert.match(chart.textContent, /echte Verschiebung/);
  assert.equal(doc.querySelector('#pl-chart-split').value, '16');
  const action = [...chart.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
  action.dispatchEvent(new w.MouseEvent('click', { cancelable: true }));
  const handed = new w.URL(action.href);
  assert.equal(handed.pathname, '/de/tools/action-tracker/');
  assert.equal(handed.searchParams.get('source'), 'process-lab');
  const whys = [...chart.querySelectorAll('a')].find((a) => /five-whys/.test(a.href));
  assert.equal(new w.URL(whys.href).pathname, '/de/tools/five-whys/');
  // The other sections.
  assert.match(out('chi').textContent, /Echter Unterschied/);
  assert.ok(out('chi').querySelector('svg.ck-chart'));
  assert.match(out('reg').textContent, /Pro Palette mehr ändert sich Beladezeit um etwa \+1,\d+ min/);
  assert.ok(out('reg').querySelector('svg.ck-chart'));
  assert.match(out('attr').textContent, /Verbesserung nötig/);
  assert.match(out('gage').textContent, /27,9/);
  assert.ok(out('gage').querySelectorAll('svg.ck-chart').length >= 3);
  assert.equal(w.localStorage.getItem('sc-process-lab-de-calc'), null, 'nothing saved until the visitor acts');
  // The chooser: picking counts on a constant unit shows the c-chart example.
  const c = doc.querySelector('[data-kind][value="c"]');
  c.checked = true;
  c.dispatchEvent(new w.Event('change'));
  assert.match(chart.textContent, /c-Karte/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-process-lab-de-calc')).chart.kind, 'c');
  // p goes to the Sigma & Control Chart with the dated rows.
  const p = doc.querySelector('[data-kind][value="p"]');
  p.checked = true;
  p.dispatchEvent(new w.Event('change'));
  const link = [...chart.querySelectorAll('a')].find((a) => /sigma-control-chart/.test(a.href));
  assert.equal(new w.URL(link.href).pathname, '/de/tools/sigma-control-chart/');
  link.dispatchEvent(new w.MouseEvent('click', { cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-sigma-handoff'));
  assert.equal(handoff.source, 'process-lab');
  assert.equal(handoff.rows.length, 30);
  assert.deepEqual(Object.keys(handoff.rows[0]).sort(), ['d', 'date', 'n']);
  // Clearing an example empties only its own section.
  doc.querySelector('[data-lab="chi"] .pl-example-note button').click();
  assert.equal(out('chi').textContent, '');
  assert.notEqual(out('reg').textContent, '');
  // The first tab keeps working as before.
  assert.equal(doc.querySelector('[data-results]').hidden, false);
});

test('a saved tab of the second set is reopened, and typing replaces the example', () => {
  const w = load('en', { page: true, storage: { 'sc-process-lab': { tab: 'msa', values: '' }, 'sc-process-lab-calc': { chart: {}, chi: {}, reg: {}, attr: {}, gage: { text: 'Part\tA1\tA2\n1\t1\t1.1\n2\t2\t2.2\n3\t3\t3.1' } } } });
  const doc = w.document;
  assert.equal(doc.querySelector('#pl-panel-msa').hidden, false);
  assert.equal(doc.querySelector('#pl-tab-msa').getAttribute('aria-selected'), 'true');
  assert.match(doc.querySelector('[data-lab="gage"] [data-out]').textContent, /Total Gage R&R/);
  assert.equal(doc.querySelector('[data-lab="chi"] [data-out]').textContent, '', 'not a first visit: no example');
  const area = doc.querySelector('#pl-chi-text');
  area.value = 'Shift\tA\tB\nEarly\t30\t10\nLate\t10\t30';
  area.dispatchEvent(new w.Event('input'));
  assert.match(doc.querySelector('[data-lab="chi"] [data-out]').textContent, /Real difference/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-process-lab-calc')).chi.example, false);
});

test('the three data files share the new section\'s shape and placeholders, with their own storage keys', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])])) : typeof value);
  const holes = (value, path = '', out = {}) => {
    if (typeof value === 'string') out[path] = (value.match(/\{\w+\}/g) || []).sort().join(' ');
    else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => holes(v, `${path}.${k}`, out));
    return out;
  };
  const en = read(dataFile('en')).lab;
  assert.equal(en.storageKey, 'sc-process-lab-calc');
  assert.deepEqual(en.kinds.map((kind) => kind.id), ['imr', 'xbar', 'np', 'p', 'c', 'u']);
  for (const lang of ['de', 'sq']) {
    const other = read(dataFile(lang)).lab;
    assert.deepEqual(shape(other), shape(en), `${lang} has the same shape`);
    assert.equal(other.storageKey, `sc-process-lab-${lang}-calc`, 'the Work Backup files it under Process Lab');
    assert.deepEqual(holes({ ...other, examples: null }), holes({ ...en, examples: null }), `${lang} keeps every {placeholder}`);
    for (const kind of ['xbar', 'np', 'c', 'u', 'gage']) assert.deepEqual(other.examples[kind].rows, en.examples[kind].rows, `${lang} ${kind} example rows`);
  }
});

test('every new text has a German and an Albanian translation, and the card mentions the new sections', () => {
  const part = read('src/_data/i18n-parts/process-lab-2.json');
  const texts = [
    ...['process-lab-2', 'process-lab-2-tabs'].flatMap((name) => [...partial(name).matchAll(/\{\{ *"([^"]+)" *\| *t\(lang\)/g)]),
    ...fs.readFileSync('src/js/process-lab-2.js', 'utf8').matchAll(/tx\("((?:[^"\\]|\\.)*)"/g),
  ].map((m) => m[1]);
  for (const lang of ['de', 'sq']) {
    const ui = strings(lang);
    assert.deepEqual([...new Set(texts)].filter((text) => !(text in ui)), [], `${lang}: untranslated`);
    // A key already in ui.json keeps its translation there: the part file never gives it another one.
    const shared = read(`src/_data/${lang}/ui.json`);
    assert.deepEqual(Object.keys(part[lang]).filter((key) => key in shared && shared[key] !== part[lang][key]), [], `${lang}: a key of ui.json translated differently`);
  }
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  for (const lang of ['en', 'de', 'sq']) {
    const tools = read(lang === 'en' ? 'src/_data/tools.json' : `src/_data/${lang}/tools.json`);
    const card = tools.find((tool) => tool.url === `${lang === 'en' ? '' : `/${lang}`}/tools/process-lab/`);
    assert.match(card.summary, /Xbar/);
    assert.match(card.summary, /R&R/);
    assert.ok(card.summary.length < 300, `${lang}: about the old length`);
  }
});
