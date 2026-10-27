// Batch 1: independent checks of FMEA, Kanban, Heijunka, Time Study, VSM, SMED, ABC against the real page code.
const { open, check, close, results } = require('./lib');
(async () => {
  // ---------- FMEA: full AP table vs independent AIAG-VDA table (transcribed from the 2019 handbook) ----------
  let { page, errors } = await open('/tools/fmea/');
  const indep = (s, o, d) => {
    const S = s >= 9 ? 0 : s >= 7 ? 1 : s >= 4 ? 2 : s >= 2 ? 3 : 4;
    const O = o >= 8 ? 0 : o >= 6 ? 1 : o >= 4 ? 2 : o >= 2 ? 3 : 4;
    const D = d >= 7 ? 0 : d >= 5 ? 1 : d >= 2 ? 2 : 3;
    const T = [
      ['HHHH', 'HHHH', 'HHHM', 'HMLL', 'LLLL'],
      ['HHHH', 'HHHM', 'HMMM', 'MMLL', 'LLLL'],
      ['HHMM', 'MMML', 'MLLL', 'LLLL', 'LLLL'],
      ['MMLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL'],
      ['LLLL', 'LLLL', 'LLLL', 'LLLL', 'LLLL']];
    return T[S][O][D];
  };
  const fm = await page.evaluate(() => { const M = window.FmeaMath; const out = []; for (let s = 1; s <= 10; s++) for (let o = 1; o <= 10; o++) for (let d = 1; d <= 10; d++) out.push([s, o, d, M.ap(s, o, d), M.rpn(s, o, d)]); return out; });
  let mism = fm.filter(([s, o, d, ap, r]) => ap !== indep(s, o, d) || r !== s * o * d);
  check('FMEA all 1000 S/O/D combos: AP and RPN match independent table', 0, mism.length);
  const edge = await page.evaluate(() => { const M = window.FmeaMath; return [M.rpn('', 5, 5), M.rpn(0, 5, 5), M.rpn('7,0', 5, 5), M.rpn(' 7 ', 5, 5), M.rpn(7.5, 5, 5), M.summarize([{ s: 9, o: 3, d: 7, action: 'x', status: 'open', due: '2026-01-01' }, { s: 2, o: 2, d: 2 }, { s: 5 }], '2026-10-26')]; });
  check('FMEA empty rating -> null', null, edge[0]); check('FMEA 0 rating -> null', null, edge[1]);
  check('FMEA "7,0" -> null (not accepted)', null, edge[2]); check('FMEA " 7 " string -> 175', 175, edge[3]);
  const sm = edge[5];
  check('FMEA summarize: rated 2 / unrated 1 / H 1 / overdue 1 / rpnBefore 189+8', [2, 1, 1, 1, 197], [sm.rated, sm.unrated, sm.H, sm.overdue, sm.rpnBefore]);
  await page.context().close();

  // ---------- Kanban sizing ----------
  ({ page, errors } = await open('/tools/kanban-sizing/'));
  const kb = await page.evaluate(() => {
    const M = window.KanbanSizingMath;
    const s = M.settingsOf({ method: 'toyota', alpha: '10', service: '95' }, { alpha: 10, service: 95, method: 'toyota' });
    const st = M.settingsOf({ method: 'stat', alpha: '10', service: '95' }, { alpha: 10, service: 95, method: 'toyota' });
    return {
      t1: M.sizeLoop({ demand: 400, interval: 0.5, lead: 1, container: 50, type: 'kanban' }, s),
      t2: M.sizeLoop({ demand: 400, interval: 0, lead: 1, container: 40, type: 'kanban' }, { ...s, alpha: 0 }),
      t3: M.sizeLoop({ demand: 120, interval: 1, lead: 2, container: 25, sd: 30, type: 'kanban' }, st),
      t4: M.sizeLoop({ demand: 10, interval: 0, lead: 3, container: 20, type: 'twobin' }, s),
      t5: M.sizeLoop({ demand: -5, interval: 1, lead: 2, container: 10 }, s),
      t6: M.sizeLoop({ demand: 100, interval: 1, lead: 2, container: 0 }, s),
      z: [90, 95, 97.5, 98, 99].map((p) => M.zFor(p)),
      t7: M.sizeLoop({ demand: 1e12, interval: 1, lead: 1, container: 1 }, s),
    };
  });
  // independent: 400*1.5*1.1/50 = 13.2 -> 14
  check('Kanban Toyota D=400 L=1.5 a=10% C=50 -> 14 cards', 14, kb.t1.cards);
  check('Kanban exact 400*1/40=10 -> 10 (no over-round)', 10, kb.t2.cards);
  // stat: L=3, SS = 1.644854*30*sqrt3 = 85.469; (360+85.469)/25 = 17.82 -> 18
  const z95 = 1.6448536269514722;
  check('Kanban stat SS', z95 * 30 * Math.sqrt(3), kb.t3.ss, 1e-6);
  check('Kanban stat cards -> 18', Math.ceil((360 + z95 * 30 * Math.sqrt(3)) / 25), kb.t3.cards);
  check('Kanban two-bin binQty = ceil(10*3*1.1)=33 ; C=20 tooSmall', [33, true, 'short'], [kb.t4.binQty, kb.t4.tooSmall, kb.t4.status]);
  check('Kanban negative demand -> incomplete', 'incomplete', kb.t5.status);
  check('Kanban zero container -> incomplete', 'incomplete', kb.t6.status);
  check('Kanban z table', [1.2816, 1.6449, 1.96, 2.0537, 2.3263].join(), kb.z.map((v) => v.toFixed(4).replace(/0+$/, '')).join());
  console.log('Kanban huge demand cards:', kb.t7.cards);
  await page.context().close();

  // ---------- Heijunka ----------
  ({ page, errors } = await open('/tools/heijunka/'));
  const hj = await page.evaluate(() => {
    const M = window.HeijunkaMath;
    const line = { shifts: 2, shiftMin: 480, breakMin: 30, days: 5, runs: NaN, batchDays: NaN };
    const prods = [
      { name: 'A', demand: 2000, cycle: 30, packout: 20, changeover: 15 },
      { name: 'B', demand: 1000, cycle: 45, packout: 20, changeover: 20 },
      { name: 'C', demand: 500, cycle: 60, packout: 10, changeover: 10 },
    ];
    const r = M.analyse(line, prods);
    const r2 = M.analyse(line, [...prods, { name: 'D (no pack-out)', demand: 1500, cycle: 30, packout: NaN, changeover: 5 }]);
    return { avail: r.availableMin, takt: r.takt, pitches: r.pitches, load: r.load.share, epei: r.epei, seqUnits: r.seq.reduce((s, x) => s + x.units, 0), seqEnd: r.seq.at(-1).end, takt2: r2.takt, totalDaily2: r2.totalDaily, load2: r2.load.share, activeN2: r2.active.length, runs: r.runs, switches: r.switches };
  });
  // independent: avail = 2*(480-30)=900 min = 54000 s; daily A 400, B 200, C 100 = 700; takt = 77.142857 s
  check('Heijunka available min', 900, hj.avail);
  check('Heijunka takt', 54000 / 700, hj.takt);
  check('Heijunka pitch A/B/C', [54000 / 700 * 20, 54000 / 700 * 20, 54000 / 700 * 10].map((x) => +x.toFixed(6)).join(), hj.pitches.map((x) => +x.toFixed(6)).join());
  const run = 400 * 30 + 200 * 45 + 100 * 60; // 27000 s = 450 min
  check('Heijunka load share', run / 54000, hj.load);
  check('Heijunka EPEI = 45/(900-450) = 0.1 day', 45 / 450, hj.epei);
  check('Heijunka sequence covers 700 units & 900 min', [700, 900], [hj.seqUnits, Math.round(hj.seqEnd)]);
  check('Heijunka product w/o pack-out still counted in takt (demand 300/day) -> takt 54000/1000', 54000 / 1000, hj.takt2);
  console.log('heijunka r2 totalDaily', hj.totalDaily2, 'active', hj.activeN2, 'runs', hj.runs, 'switches', JSON.stringify(hj.switches));
  await page.context().close();

  // ---------- Time study ----------
  ({ page, errors } = await open('/tools/time-study/'));
  const ts = await page.evaluate(() => {
    const M = window.TimeStudyMath;
    const st = M.stats([10, 12, 11, 30, 11]);
    const one = M.stats([7]);
    const a = M.analyse({ stations: [{ name: 'S1', elements: [{ name: 'a', type: 'VA' }, { name: 'b', type: 'NVA' }] }, { name: 'S2', elements: [{ name: 'c', type: 'VA' }] }],
      rows: [{ s: 0, e: 0, c: 1, t: 30 }, { s: 0, e: 0, c: 2, t: 34 }, { s: 0, e: 1, c: 1, t: 20 }, { s: 1, e: 0, c: 1, t: 25 }], takt: 45 });
    const p = M.parseObservations('Station;Element;Cycle;Seconds\n1;1;1;12,5\n1;1;2;abc\nS1;a;3;-4\n1;1;x;9', [{ name: 'S1', elements: [{ name: 'a' }] }]);
    return { st, one, a: { sum: a.sum, eff: a.efficiency, ops: a.operators, over: a.over.map((s) => s.name), moves: a.moves, shares: a.shares, bott: a.bottleneck.name, cycles: a.cycles }, p };
  });
  check('TimeStudy median [10,12,11,30,11] = 11', 11, ts.st.median);
  check('TimeStudy sample SD', Math.sqrt(((10 - 14.8) ** 2 + (12 - 14.8) ** 2 + (11 - 14.8) ** 2 + (30 - 14.8) ** 2 + (11 - 14.8) ** 2) / 4), ts.st.sd);
  check('TimeStudy outlier 30 flagged', [30], ts.st.outliers);
  check('TimeStudy single obs sd=0 (not undefined)', 0, ts.one.sd);
  // S1 = median(30,34)=32 + 20 = 52 ; S2 = 25 ; sum 77 ; eff = 77/(2*52)
  check('TimeStudy sum', 77, ts.a.sum); check('TimeStudy line efficiency', 77 / 104, ts.a.eff); check('TimeStudy operators ceil(77/45)=2', 2, ts.a.ops);
  console.log('TimeStudy moves', JSON.stringify(ts.a.moves), 'parse', JSON.stringify(ts.p));
  await page.context().close();

  // ---------- VSM ----------
  ({ page, errors } = await open('/tools/value-stream-map/'));
  const vs = await page.evaluate(() => {
    const M = window.VsmMath;
    const map = { demand: 460, minutes: 460, finished: 920, steps: [
      { name: 'Stamp', ct: 1, inv: 4600, va: true, co: 60, uptime: 85, batch: 1200 },
      { name: 'Weld', ct: 39, inv: 1100, va: true, operators: 1 },
      { name: 'Assy', ct: 62, inv: 1600, va: true, operators: 2, uptime: 50 },
      { name: 'Ship', ct: 0, inv: 0, va: false },
    ] };
    const a = M.analyse(map);
    return { takt: a.takt, lead: a.lead, leadDays: a.leadDays, va: a.va, pce: a.pce, bott: a.bottleneck && a.bottleneck.name, caps: a.steps.map((s) => s.capacity), over: a.overloaded.map((s) => s.name), yield: a.yield };
  });
  // independent: takt = 460*60/460 = 60 s; waits: 4600/460=10 d, 1100/460=2.391 d, 1600/460=3.478 d, 920/460=2 d -> 17.87 days*460*60 s
  const waitDays = (4600 + 1100 + 1600 + 920) / 460;
  check('VSM takt 60 s', 60, vs.takt);
  check('VSM lead (working s)', waitDays * 460 * 60 + 102, vs.lead);
  check('VSM lead days', (waitDays * 460 * 60 + 102) / 60 / 460, vs.leadDays);
  check('VSM PCE = 102 / lead', 102 / (waitDays * 460 * 60 + 102), vs.pce);
  // capacity: Assy eff = 31 s, uptime 50% -> 460*60*0.5/31 = 445 < demand 460 -> overloaded; Weld eff 39 bottleneck by CT
  console.log('VSM bottleneck', vs.bott, 'capacities', vs.caps, 'overloaded', vs.over);
  await page.context().close();

  // ---------- SMED ----------
  ({ page, errors } = await open('/tools/smed/'));
  const sd = await page.evaluate(() => {
    const M = window.SmedMath;
    const p = ['4:30', '1:02:30', '4,5', '4.5', '90 s', '2 min', '0', '-3', '4:75', '1.5h', '', 'abc'].map(M.parseDuration);
    const els = [
      { cat: 'prep', start: 0, dur: 300, now: 'stopped', kind: 'external' },
      { cat: 'mount', start: 300, dur: 600, now: 'stopped', kind: 'internal', who: 'Ann' },
      { cat: 'mount', start: 900, dur: 300, now: 'stopped', kind: 'internal', who: 'Bob' },
      { cat: 'trial', start: 1500, dur: 300, now: 'stopped', kind: 'internal', after: 'removed' },
    ];
    const a = M.analyse(els, { perWeek: 10, costPerMinute: 2, weeks: 46, target: 600 });
    return { p, before: a.before, after: a.after.downtime, saving: a.saving, freed: a.freed, sep: a.separated, single: a.singleMinute };
  });
  check('SMED parseDuration', [270, 3750, 270, 270, 90, 120, 0, null, null, null, null, null].join(), sd.p.map((x) => (Number.isNaN(x) ? null : x)).join());
  // before: span = 1800 - 0 = 1800 (gap 300 between 1200 and 1500); work 1500; after: Ann 600, Bob 300 -> 600
  check('SMED before downtime (span incl. unrecorded gap)', 1800, sd.before.downtime);
  check('SMED after downtime (parallel lanes)', 600, sd.after);
  check('SMED freed min/week = (1200/60)*10 = 200', 200, sd.freed.minutesWeek);
  console.log('SMED before', JSON.stringify(sd.before), 'saving', sd.saving, 'single', sd.single);
  await page.context().close();

  // ---------- ABC ----------
  ({ page, errors } = await open('/tools/inventory-abc/'));
  const ab = await page.evaluate(() => {
    const M = window.InventoryAbcMath;
    const r3 = M.abc([{ key: 'x', value: 100 }, { key: 'y', value: 50 }, { key: 'z', value: 10 }], { a: 0.8, b: 0.95 });
    const ties = M.abc([{ key: 'a', value: 70 }, { key: 'b', value: 10 }, { key: 'c', value: 10 }, { key: 'd', value: 10 }], { a: 0.8, b: 0.95 });
    const zero = M.abc([{ key: 'a', value: 0 }, { key: 'b', value: 0 }]);
    const s = M.settingsOf({ unit: 'month', a: '80', b: '95', x: '0.5', y: '1', service: '95', leadTime: '10', countA: '12', countB: '4', countC: '1' }, { unit: 'month', a: 80, b: 95, x: 0.5, y: 1, service: 95, leadTime: 14, countA: 12, countB: 4, countC: 1 });
    const w = M.workOut({ sku: 'S1', cost: 2, demand: [100, 120, 80, 100, 110, 90, 100, 105, 95, 100, 100, 100], lt: 10, ltSd: null, stock: 50 }, s);
    const eoq = M.eoq({ annual: 1200, orderCost: 50, unitCost: 2, holdingRate: 0.25 });
    return { r3: r3.map((i) => i.cls), ties: ties.map((i) => i.cls), zero: zero.map((i) => i.cls), w: { mean: w.mean, sd: w.sd, cv: w.cv, xyz: w.xyz, ss: w.ss, rop: w.rop, annual: w.annual, value: w.value, below: w.below }, eoq, z: s.z };
  });
  check('ABC 3 items 100/50/10 -> A,A,B (crossing rule)', 'A,A,B', ab.r3.join());
  check('ABC ties 70/10/10/10 -> A + same class for ties', 'A,A,A,A', ab.ties.join());
  console.log('ABC zero ->', ab.zero.join());
  const dem = [100, 120, 80, 100, 110, 90, 100, 105, 95, 100, 100, 100];
  const mu = dem.reduce((a, b) => a + b) / 12; const sdv = Math.sqrt(dem.reduce((a, v) => a + (v - mu) ** 2, 0) / 11);
  const days = 365 / 12; const sdDay = sdv / Math.sqrt(days); const ss = 1.6448536269514722 * sdDay * Math.sqrt(10);
  check('ABC mean', mu, ab.w.mean); check('ABC sd', sdv, ab.w.sd); check('ABC SS', ss, ab.w.ss, 1e-6); check('ABC ROP', mu / days * 10 + ss, ab.w.rop, 1e-6);
  check('ABC EOQ sqrt(2*1200*50/(0.25*2)) = 489.9', Math.sqrt(2 * 1200 * 50 / 0.5), ab.eoq);
  await page.context().close();
  await close();
  console.log(`\n${results.filter((r) => r.ok).length}/${results.length} passed`);
})();
