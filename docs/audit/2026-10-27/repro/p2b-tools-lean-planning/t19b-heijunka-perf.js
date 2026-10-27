// Heijunka: time of analyse() as the demand grows (pack-out 20, 5 days, 2 products), on the real page code.
const { open, close } = require('./lib');
(async () => {
  const { page } = await open('/tools/heijunka/');
  for (const demand of [5000, 10000, 20000]) {
    const ms = await page.evaluate((demand) => {
      const M = window.HeijunkaMath; const t = performance.now();
      M.analyse({ shifts: 3, shiftMin: 480, breakMin: 30, days: 5, runs: NaN, batchDays: NaN }, [{ name: 'A', demand, cycle: 1, packout: 1, changeover: 1 }, { name: 'B', demand: demand / 2, cycle: 1, packout: 1, changeover: 1 }]);
      return Math.round(performance.now() - t);
    }, demand);
    console.log(`demand ${demand}/week (${demand / 5} containers/day of A): analyse() took ${ms} ms`);
    if (ms > 20000) break;
  }
  await page.context().close(); await close();
})();
