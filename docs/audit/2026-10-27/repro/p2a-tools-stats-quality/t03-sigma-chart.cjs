// Sigma & Control Chart: p-chart limits per subgroup, signal rules, verdict wording, sigma calculator small samples.
const { tool, check, note, text, type } = require('./lib.cjs');
const days = (k, start = '2026-09-01') => { const d = new Date(`${start}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
const st = (rows) => ({ 'sc-sigma-chart': { metric: 'Damaged', unit: 'Units', baseline: '', grain: 'day', rows, example: {}, splits: [] } });

// 1) p-chart limits, independent: 14 days, varying n
const rows = [...Array(14)].map((_, i) => ({ date: days(i), n: 800 + 100 * (i % 5), d: [4, 6, 5, 3, 7, 5, 4, 6, 5, 4, 6, 5, 5, 4][i], note: '' }));
const N = rows.reduce((s, r) => s + r.n, 0), Dd = rows.reduce((s, r) => s + r.d, 0), pbar = Dd / N;
let w = tool('/tools/sigma-control-chart/', st(rows));
const M = w.SigmaMath;
rows.forEach((r, i) => { if (i < 3) { const e = pbar + 3 * Math.sqrt(pbar * (1 - pbar) / r.n); check(`UCL day ${i} n=${r.n}`, e, M.limitsFor(r.n, pbar).ucl); } });
note('result head (stable data)', text(w, '[data-results] .result-head, [data-results] h2').slice(0, 200));

// 2) Nelson-style rules independent check: 8 above centre -> run; 6 rising -> trend
const pts = (ps) => ps.map((p) => ({ p, ucl: 1, lcl: 0 }));
check('run of 8 above centre detected', true, M.signalRules(pts([.6, .6, .6, .6, .6, .6, .6, .6, .4]), .5).some((s) => s.rule === 'run'));
check('run of 7 not flagged', false, M.signalRules(pts([.6, .6, .6, .6, .6, .6, .6, .4]), .5).some((s) => s.rule === 'run'));
check('6 rising points = trend', true, M.signalRules(pts([.1, .2, .3, .4, .5, .6]), .35).some((s) => s.rule === 'trend'));
check('5 rising points no trend', false, M.signalRules(pts([.1, .2, .3, .4, .5]), .3).some((s) => s.rule === 'trend'));
check('ties break a trend (.1,.2,.2,.3,.4,.5)', false, M.signalRules(pts([.1, .2, .2, .3, .4, .5]), .3).some((s) => s.rule === 'trend'));

// 3) One single low day among stable days: does the verdict claim a "lasting improvement"?
const low = rows.map((r, i) => (i === 10 ? { ...r, d: 0, n: 5000 } : r));
w = tool('/tools/sigma-control-chart/', st(low));
const res = text(w, '[data-results]');
note('single low point verdict', res.slice(0, 500));
check('one point below LCL is NOT described as a "lasting improvement"', false, /lasting improvement|A real improvement/.test(res));

// 4) Three days only, one high: is the alarm raised and is the short-sample caveat shown?
const three = [{ date: days(0), n: 1000, d: 2, note: '' }, { date: days(1), n: 1000, d: 3, note: '' }, { date: days(2), n: 1000, d: 15, note: '' }];
w = tool('/tools/sigma-control-chart/', st(three));
const r3 = text(w, '[data-results]');
note('3-point chart', r3.slice(0, 400));
check('3-point chart carries the "fewer than 12" caveat', true, /Fewer than 12/.test(r3));

// 5) A chart with zero defects: sigma level text
const zero = [...Array(5)].map((_, i) => ({ date: days(i), n: 50, d: 0, note: '' }));
w = tool('/tools/sigma-control-chart/', st(zero));
const rz = text(w, '[data-results]');
const sig = rz.match(/Sigma level\s*([^\s]+\s?[^\s]*)/);
note('zero-defect chart sigma', sig && sig[0]);
check('250 units with 0 defects is not reported as "6+" sigma (rule of three => >= ~4.25-ish bound)', false, /Sigma level\s*6\+/.test(rz));

// 6) Sigma calculator: 5 orders, 1 defect; and decimal comma in EN page; huge numbers
w = tool('/tools/sigma-control-chart/', {});
const calc = (u, d, o) => { type(w, '[data-calc][name="units"]', u); type(w, '[data-calc][name="defects"]', d); if (o !== undefined) type(w, '[data-calc][name="opportunities"]', o); return text(w, '[data-sigma-out]'); };
const out5 = calc('5', '1');
note('sigma 5 units 1 defect', out5);
// independent: p=0.2 -> z(0.8)=0.841621 -> 2.34
check('sigma for 1 of 5 = 2.34 (with 1.5 shift)', true, /2\.34/.test(out5));
check('small-sample caveat shown for n=5', true, /few|small|sample|rough/i.test(out5.replace(/no defect in this sample/, '')));
const outBig = calc('1000000000000', '3');
note('sigma 1e12 units 3 defects', outBig);
const outNeg = calc('-100', '5');
note('negative units', outNeg);
const outDec = calc('1000', '2,5');
note('defects "2,5" on EN page', outDec);
console.log('jsdom errors', w.__errors.slice(0, 3));
