// Batch 2: Risk, Lean Assessment, Skills, Portfolio, 5S, Shift Capacity, Housekeeping — real page code vs independent values.
const { open, check, close, results } = require('./lib');
(async () => {
  let page;
  // ---- Risk assessment
  ({ page } = await open('/tools/risk-assessment/'));
  const ra = await page.evaluate(() => {
    const M = window.RiskAssessmentMath;
    const grid = []; for (let l = 1; l <= 5; l++) for (let s = 1; s <= 5; s++) grid.push([l, s, M.risk(l, s), M.band(M.risk(l, s))]);
    return { grid, custom: M.band(10, { low: 3, medium: 8, high: 15 }), bad: M.band(10, { low: 9, medium: 4, high: 16 }), only: M.stopCheck({ l: 4, s: 4, measures: [{ text: 'gloves', type: 'P' }] }), none: M.stopCheck({ l: 2, s: 3, measures: [] }), lowNone: M.stopCheck({ l: 1, s: 4, measures: [] }), r0: M.risk(0, 3), rS: M.risk('3', '4') };
  });
  const bandOf = (x) => (x <= 4 ? 'low' : x <= 9 ? 'medium' : x <= 16 ? 'high' : 'very-high');
  check('Risk 5x5 L×S and bands (low≤4, medium≤9, high≤16)', 0, ra.grid.filter(([l, s, r, b]) => r !== l * s || b !== bandOf(l * s)).length);
  check('Risk custom bands 10 -> high', 'high', ra.custom); check('Risk invalid custom bands fall back -> medium', 'medium', ra.bad);
  check('Risk PPE-only high -> only-p', 'only-p', ra.only); check('Risk medium w/o measure -> no-measure', 'no-measure', ra.none); check('Risk low w/o measure -> ok', '', ra.lowNone);
  check('Risk 0 -> null; "3"x"4"=12', [null, 12], [ra.r0, ra.rS]);
  await page.context().close();

  // ---- Lean assessment
  ({ page } = await open('/tools/lean-assessment/'));
  const la = await page.evaluate(() => {
    const M = window.LeanAssessmentMath;
    const dims = [{ key: 'a', name: 'A', statements: ['s1', 's2'] }, { key: 'b', name: 'B', statements: ['t1', 't2', 't3'] }];
    const r = M.assess({ scores: { 'a.0': [3, 5], 'a.1': [2, 'na'], 'b.0': ['na', 'na'], 'b.1': [4, 4], 'b.2': [1, null] } }, dims);
    return { overall: r.overall, dimA: r.dims[0].mean, dimB: r.dims[1].mean, dis: r.disagreements.map((s) => s.id), level: r.level, lv: [1.449, 1.45, 2.5, 4.49, 4.45].map(M.levelOf) };
  });
  // a: s1 mean 4 (spread 2 -> disagree), s2 mean 2 -> 3.0 ; b: t1 NA, t2 4, t3 1 -> 2.5 ; overall 2.75
  check('Lean dim A = 3', 3, la.dimA); check('Lean dim B = 2.5', 2.5, la.dimB); check('Lean overall 2.75 (unweighted)', 2.75, la.overall);
  check('Lean disagreement flagged a.0', ['a.0'], la.dis); check('Lean level of 2.75 -> 3', 3, la.level);
  console.log('Lean levelOf 1.449,1.45,2.5,4.49,4.45 ->', la.lv.join());
  await page.context().close();

  // ---- Skills matrix
  ({ page } = await open('/tools/skills-matrix/'));
  const sk = await page.evaluate(() => {
    const M = window.SkillsMath;
    const model = { people: [{ id: 'p1', shift: 'E' }, { id: 'p2', shift: 'E' }, { id: 'p3', shift: 'N' }], tasks: [{ id: 't1', target: 2, crit: 3 }, { id: 't2', target: 1 }, { id: 't3', target: 3 }],
      levels: { p1: { t1: 4, t2: 3, t3: 3 }, p2: { t1: 3, t3: 2 }, p3: { t3: 9 } } };
    return { cov: M.coverage(model).map((c) => [c.id, c.count, c.state]), flex: M.flexibilityIndex(model), shift: M.shiftCoverage(model, ['E', 'N']), plan: M.planSuggestions(model, { today: '2026-10-26' }).map((x) => [x.taskId, x.traineeId, x.trainerId, x.reason]) };
  });
  // t1: p1 4,p2 3 -> 2 ok ; t2: p1 3 -> 1 spof ; t3: p1 3 (p2 2, p3 invalid 9 -> 0) -> 1 spof (target 3)
  check('Skills coverage', [['t1', 2, 'ok'], ['t2', 1, 'spof'], ['t3', 1, 'spof']], sk.cov);
  check('Skills flexibility (4+3+3+3+0+2+0+0+0)/9/4', 15 / 36, sk.flex);
  console.log('Skills shift cover', JSON.stringify(sk.shift), 'plan', JSON.stringify(sk.plan));
  await page.context().close();

  // ---- Project portfolio
  ({ page } = await open('/tools/project-portfolio/'));
  const pp = await page.evaluate(() => {
    const M = window.PortfolioMath;
    return { dpmo: M.dpmo(25, 1000, 5), sig: M.sigma(M.dpmo(25, 1000, 5)), sig3: M.sigma(66807), sig0: M.sigma(0), bad: M.dpmo(6000, 1000, 5), rty: M.rty([{ step: 'a', fpy: 95 }, { step: 'b', fpy: '' }, { step: 'c', fpy: 90 }]), copq: M.copq({ internal: 1000, external: 500, appraisal: 300, prevention: 200 }), kano: [[0, 4], [1, 4], [0, 2], [2, 2], [4, 0], [0, 0]].map(([f, d]) => M.kanoClass(f, d)), raci: M.raciCheck({ people: ['x', 'y'], rows: [{ activity: 'a', cells: ['A', 'R'] }, { activity: 'b', cells: ['A', 'A'] }, { activity: 'c', cells: ['AR', ''] }] }).rows.map((r) => r.problems.join('+') || 'ok'), sav: M.savingsYear([{ savings: { hard: 12000, from: '2026-07-15', realised: [{ month: '2026-08', amount: 900 }] } }], 2026) };
  });
  check('Portfolio DPMO 25/(1000*5)*1e6 = 5000', 5000, pp.dpmo);
  // sigma (1.5 shift): z(1-0.005) + 1.5 = 2.5758 + 1.5 = 4.0758
  check('Portfolio sigma(5000 DPMO) = 4.076', 2.5758293035489 + 1.5, pp.sig, 1e-6);
  check('Portfolio sigma(66807) ≈ 3.0', 3.0, +pp.sig3.toFixed(3), 1e-3);
  check('Portfolio sigma(0) -> 6 (cap)', 6, pp.sig0);
  check('Portfolio defects > opportunities -> null', null, pp.bad);
  check('Portfolio RTY .95*.90 (blank step skipped)', 0.855, pp.rty.value);
  check('Portfolio COPQ month incl. prevention', 2000, pp.copq.month);
  check('Portfolio Kano classes', ['O', 'M', 'A', 'I', 'R', 'Q'].join(), pp.kano.join());
  check('Portfolio RACI', ['ok', 'manyA+noR', 'ok'].join(), pp.raci.join());
  check('Portfolio savings 2026 planned (Jul-Dec 6/12 of 12000)', 6000, pp.sav.planned);
  await page.context().close();

  // ---- 5S
  ({ page } = await open('/tools/five-s-audit/'));
  const fs = await page.evaluate(() => {
    const M = window.FiveSMath;
    const sc = M.score({ sort: [4, 4, 2], set: [3, null, null], shine: [] , std: [0, 1], sus: [4] }, ['sort', 'set', 'shine', 'std', 'sus']);
    return { overall: sc.overall, rated: sc.rated, perS: Object.fromEntries(Object.entries(sc.perS).map(([k, v]) => [k, v.pct])), band: [0.49, 0.5, 0.749, 0.75, 0.9].map(M.bandIndex), one: M.score({ sort: [1], set: [], shine: [], std: [], sus: [] }, ['sort', 'set', 'shine', 'std', 'sus']).overall };
  });
  // sort 10/3/4 = .8333 ; set 3/4 = .75 ; std .5/4=.125 ; sus 1 ; shine unrated -> mean of 4 = (0.8333+.75+.125+1)/4
  check('5S overall = mean of rated S shares', (10 / 12 + 0.75 + 0.125 + 1) / 4, fs.overall);
  check('5S bands', [0, 1, 1, 2, 3].join(), fs.band.join());
  console.log('5S: one answer of 1 in one S gives overall', fs.one, '(rated', fs.rated, ')');
  await page.context().close();

  // ---- Shift capacity
  ({ page } = await open('/tools/shift-capacity/'));
  const sc = await page.evaluate(() => {
    const M = window.ShiftCapacityMath;
    const processes = [{ id: 'pick', name: 'Picking', driver: 'lines', uph: '120', source: 'orders', factor: '2.4' }, { id: 'pack', name: 'Packing', driver: 'orders', uph: '60', source: 'orders', factor: '1' }];
    const r = M.analyseShift({ processes, shift: { length: 8, unpaid: 30, paid: 15 }, utilisation: 0.85, absenteeism: 0.08, mode: 'rostered', volumes: { orders: 2000 }, planned: { p: { pick: 6, pack: 6 } } });
    const t = M.analyseShift({ processes, shift: { length: 8, unpaid: 30, paid: 15 }, utilisation: 0.85, absenteeism: 0.08, mode: 'rostered', volumes: { orders: 2000 }, planned: { total: 12 } });
    return { ph: r.ph, rows: r.rows.map((x) => [x.volume, x.hours, x.heads, x.gross, x.gapHours]), totals: r.totals, status: r.status, bott: r.bottleneck && r.bottleneck.id, opt: r.options, tot: { pooled: t.totals.pooled, pooledGross: t.totals.pooledGross, gapHeads: t.totals.gapHeads, cov: t.totals.coverage }, uph: M.uphFromCycle(30, 0.15, 1) };
  });
  // ph = (8 - .5 - .25) * .85 = 6.1625 ; pick volume 4800 lines /120 = 40 h -> 40/6.1625 = 6.49 -> 7 heads -> /0.92 = 7.6 -> 8 gross
  const ph = 7.25 * 0.85;
  check('ShiftCap productive hours', ph, sc.ph);
  check('ShiftCap pick row [vol,hours,heads,gross]', [4800, 40, Math.ceil(40 / ph), Math.ceil(Math.ceil(40 / ph) / 0.92)].join(), sc.rows[0].slice(0, 4).map((x) => +x.toFixed(6)).join());
  check('ShiftCap pack row hours 2000/60', 2000 / 60, sc.rows[1][1]);
  check('ShiftCap pick gapHours = 6*0.92*ph - 40', 6 * 0.92 * ph - 40, sc.rows[0][4]);
  check('ShiftCap pooled heads ceil((40+33.33)/ph)', Math.ceil((40 + 2000 / 60) / ph), sc.tot.pooled);
  check('ShiftCap UPH from 30s cycle, 15% PF&D = 104.35', 3600 / (30 * 1.15), sc.uph);
  console.log('ShiftCap status', sc.status, 'bottleneck', sc.bott, 'options', JSON.stringify(sc.opt).slice(0, 400));
  await page.context().close();

  // ---- Housekeeping
  ({ page } = await open('/tools/housekeeping-planner/'));
  const hk = await page.evaluate(() => {
    const M = window.HousekeepingPlannerMath;
    const s = { mode: 'minutes', shiftHours: 8.5, breakMinutes: 30, productiveShare: 0.85, creditsPerAttendant: 20, minutes: { double: { departure: 30, stayover: 15, linen: 20, deep: 90 }, suite: { departure: 45, stayover: 25, linen: 30, deep: 120 } }, credits: { double: { departure: 1.5, stayover: 0.75, linen: 1, deep: 4.5 } }, vipMinutes: 10, vipCredits: 0.5, publicHours: 6, linenEvery: 3 };
    const rows = [M.cleanRow({ floor: '1', type: 'double', departure: 40, stayover: 60, linen: 20, vip: 2, deep: 1 }, ['double', 'suite']), M.cleanRow({ floor: '2', type: 'suite', departure: 5, stayover: 10, linen: 99, vip: 0 }, ['double', 'suite'])];
    const items = M.withMinutes(s, M.itemsFromRows(rows));
    const p = M.plan(items, s, { scheduled: 10, rate: 15 });
    const sec = M.balance(items, p.sections).map((g) => g.minutes);
    const sc = { ...s, mode: 'credits' };
    const pc = M.plan(M.withMinutes(sc, M.itemsFromRows([rows[0]])), sc, {});
    return { linenCap: rows[1].linen, total: p.totalMinutes, needed: p.needed, prod: p.productive, mpo: p.minutesPerOccupied, diffH: p.diffHours, sec, secN: p.sections, cost: p.costNeeded, credits: { total: pc.totalUnits, needed: pc.needed, mpc: pc.minutesPerCredit } };
  });
  // room minutes: floor1 dep 40*30=1200, linen 20*20=400, stay 40*15=600, deep 90, vip 2*10=20; floor2 dep 5*45=225, linen 10*30 = 300 (capped to stayover 10), stay 0
  const roomMin = 1200 + 400 + 600 + 90 + 20 + 225 + 300; const total = roomMin + 360; const prod = (8.5 * 60 - 30) * 0.85;
  check('Housekeeping linen capped at stay-overs', 10, hk.linenCap);
  check('Housekeeping total minutes', total, hk.total); check('Housekeeping productive min 408', 408, hk.prod);
  check('Housekeeping attendants ceil(total/408)', Math.ceil(total / 408), hk.needed);
  check('Housekeeping min/occupied room (dep+stay+linen+vip)/(45+70)', (1200 + 400 + 600 + 20 + 225 + 300) / 115, hk.mpo);
  check('Housekeeping diff hours 10*8 - total/408*8', 10 * 8 - total / 408 * 8, hk.diffH);
  check('Housekeeping sections sum = room minutes', roomMin, hk.sec.reduce((a, b) => a + b, 0));
  console.log('Housekeeping sections', hk.secN, hk.sec, 'max-min', Math.max(...hk.sec) - Math.min(...hk.sec), 'cost', hk.cost);
  // credits: 40*1.5 + 20*1 + 40*.75 + 4.5 + 2*.5 = 60+20+30+4.5+1 = 115.5 ; public 360 min / 20.4 = 17.647 -> 133.147 / 20 -> 7
  check('Housekeeping credits total', 115.5 + 360 / 20.4, hk.credits.total); check('Housekeeping credits attendants', Math.ceil((115.5 + 360 / 20.4) / 20), hk.credits.needed);
  await page.context().close();
  await close();
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} passed`);
})();
