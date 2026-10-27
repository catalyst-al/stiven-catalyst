// LSW adherence, Gemba compliance/vital few, Maintenance next due/MTBF/compliance, Poka-yoke, Kaizen event, Spaghetti, Standard Work.
const { open, check, close, results } = require('./lib');
(async () => {
  let { page } = await open('/tools/leader-standard-work/');
  let r = await page.evaluate(() => { const M = window.LeaderStandardWorkMath; return M.tally([{ s: 'done' }, { s: 'done' }, { s: 'missed', r: M.UNRECORDED }, { s: 'missed', r: M.EXCLUDED[0] }, { s: 'na' }, { s: 'open' }]); });
  check('LSW adherence = done/(done+missed) = 2/3, excluded/na/open left out', [2, 1, 1, 2 / 3], [r.done, r.missed, r.excluded, r.adherence]);
  await page.context().close();
  ({ page } = await open('/tools/gemba-walk/'));
  r = await page.evaluate(() => { const M = window.GembaMath; return { c: M.compliance(['yes', 'yes', 'no', 'na', null]), v: M.vitalFew([{ key: 'a', value: 50 }, { key: 'b', value: 30 }, { key: 'c', value: 15 }, { key: 'd', value: 5 }]) }; });
  check('Gemba compliance yes/(yes+no) = 2/3', 2 / 3, r.c.pct); check('Gemba vital few up to 80%', ['a', 'b'], r.v);
  await page.context().close();
  ({ page } = await open('/tools/maintenance-planner/'));
  r = await page.evaluate(() => {
    const M = window.MaintenancePlannerMath;
    const task = { id: 't', every: 1, unit: 'months', start: '2026-01-31' };
    const ev = [{ task: 't', kind: 'done', date: '2026-01-31' }];
    const nd = M.nextDue(task, ev);
    const rel = M.reliability([{ asset: 'A', date: '2026-10-01', minutes: 120, cause: 'x' }, { asset: 'A', date: '2026-10-15', minutes: 60, cause: 'x' }], '2026-10-01', '2026-10-30');
    const h = M.history({ id: 't', every: 7, unit: 'days', start: '2026-10-01' }, [{ task: 't', kind: 'done', date: '2026-10-01' }, { task: 't', kind: 'done', date: '2026-10-09' }, { task: 't', kind: 'done', date: '2026-10-20' }]);
    return { due: nd.due, mttr: rel[0].mttr, mtbf: rel[0].mtbfDays, onTime: h.done.map((d) => d.onTime), grace: h.grace, comp: M.compliance([h], '2026-10-01', '2026-10-31', '2026-10-27') };
  });
  check('Maintenance 31 Jan + 1 month = 28 Feb', '2026-02-28', r.due);
  check('MTTR 180/2 = 90 min', 90, r.mttr); check('MTBF days (30 - 180/1440)/2', (30 - 180 / 1440) / 2, r.mtbf);
  // weekly task: grace floor(7*0.1)=0; done 10-01 (due 10-01 start) ok, 10-09 vs due 10-08 late, 10-20 vs due 10-16 late
  check('Maintenance on-time with 0 grace for weekly', [true, false, false], r.onTime);
  console.log('maintenance compliance', JSON.stringify(r.comp));
  await page.context().close();
  ({ page } = await open('/tools/kaizen-event/'));
  r = await page.evaluate(() => { const M = window.KaizenEventMath; return [M.improvement(100, 70, 'lower'), M.gapClosed(100, 60, 70), M.targetMet(60, 70, 'lower'), M.improvement(0, 5, 'higher')]; });
  check('Kaizen event improvement/gap/target', [0.3, 0.75, false, null], r);
  await page.context().close();
  ({ page } = await open('/tools/spaghetti-diagram/'));
  r = await page.evaluate(() => { const M = window.SpaghettiMath; const a = M.analyse({ walks: [{ points: [{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 3, y: 0 }], cycles: 2 }] }, { plan: {}, speed: '1,2', shift: 100 }); return [a.metres, a.perCycle, a.secondsPerCycle, a.perShift]; });
  check('Spaghetti 5+4=9 m, 2 cycles -> 4.5 m/cycle, 3.75 s at 1.2 m/s, 450 m/shift', [9, 4.5, 3.75, 450], r);
  await page.context().close();
  ({ page } = await open('/tools/standard-work/'));
  r = await page.evaluate(() => { const M = window.StandardWorkMath; return ['45', '45 s', '7,5', '1:30', '1:02:30', '-3', 'abc'].map((v) => { const x = M.seconds(v); return Number.isNaN(x) ? null : x; }); });
  console.log('StandardWork seconds parse 45|45 s|7,5|1:30|1:02:30|-3|abc ->', JSON.stringify(r));
  await page.context().close();
  ({ page } = await open('/tools/poka-yoke/'));
  r = await page.evaluate(() => { const M = window.PokaYokeMath; return [M.effectiveness(10, 2), M.effectiveness(0, 0), M.totalEffect([{ before: 10, after: 2 }, { before: 5, after: 5 }, { before: null, after: 1 }]).rate]; });
  check('Poka-yoke effectiveness', [0.8, null, (15 - 7) / 15], r);
  await page.context().close();
  await close();
  console.log(`\n${results.filter((x) => x.ok).length}/${results.length} passed`);
})();
