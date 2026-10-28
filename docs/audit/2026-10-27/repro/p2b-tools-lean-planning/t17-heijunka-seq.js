// Heijunka levelled sequence and edge inputs, plus Time Study balance with tiny samples and VSM edge inputs, on the real page code.
const { open, close } = require('./lib');
(async () => {
  let { page } = await open('/tools/heijunka/');
  const r = await page.evaluate(() => {
    const M = window.HeijunkaMath;
    const line = { shifts: 2, shiftMin: 480, breakMin: 30, days: 5, runs: NaN, batchDays: NaN };
    const prods = [{ name: 'A', demand: 2000, cycle: 30, packout: 20, changeover: 15 }, { name: 'B', demand: 1000, cycle: 45, packout: 20, changeover: 20 }, { name: 'C', demand: 500, cycle: 60, packout: 10, changeover: 10 }];
    const a = M.analyse(line, prods);
    const over = M.analyse(line, [{ name: 'X', demand: 5000, cycle: 90, packout: 10, changeover: 30 }]);
    const neg = M.analyse({ ...line, shifts: -1 }, prods);
    const huge = M.analyse(line, [{ name: 'H', demand: 1e9, cycle: 1, packout: 1, changeover: 1 }]);
    return { seq: a.seq.map((s) => 'ABC'[s.index] + s.containers).join(' '), runs: a.runs, fits: a.fits, levelMin: a.levelMin, over: [over.load.state, over.epei, over.takt], neg: [neg.availableMin, neg.takt], huge: [huge.seq.length, huge.takt] };
  });
  console.log('heijunka', JSON.stringify(r));
  await page.context().close();
  ({ page } = await open('/tools/time-study/'));
  const t = await page.evaluate(() => {
    const M = window.TimeStudyMath;
    const one = M.analyse({ stations: [{ name: 'S1', elements: [{ name: 'a', type: 'VA' }] }, { name: 'S2', elements: [{ name: 'b', type: 'VA' }] }], rows: [{ s: 0, e: 0, c: 1, t: 50 }, { s: 1, e: 0, c: 1, t: 10 }], takt: 40 });
    return { ops: one.operators, moves: one.moves, eff: one.efficiency, cycles: one.cycles };
  });
  console.log('time-study 1 obs per element:', JSON.stringify(t));
  await page.context().close(); await close();
})();
