// Site Compare ranking: sample size and coverage are ignored.
const { tool, check, note } = require('./lib.cjs');
const w = tool('/tools/site-compare/', {});
const S = w.SiteCompareMath;
const sites = [
  // Big site: 2,000 routes at 97 % on time, damage 0.20 % of 50,000, OEE 70 %, 5S 85 %
  { id: 'big', name: 'Big hub', figures: { onTime: { value: 0.97, routes: 2000 }, damageRate: { value: 0.002, volume: 50000 }, oee: { value: 0.70 }, fiveS: { value: 0.85 } } },
  // Tiny site: 2 routes both on time; nothing else logged
  { id: 'tiny', name: 'Tiny depot', figures: { onTime: { value: 1, routes: 2 } } },
  // Mid site: everything slightly worse than big
  { id: 'mid', name: 'Mid site', figures: { onTime: { value: 0.96, routes: 800 }, damageRate: { value: 0.003, volume: 20000 }, oee: { value: 0.65 }, fiveS: { value: 0.80 } } },
];
const r = S.ranking(sites);
note('ranking', r.map((x) => [x.name, x.score === null ? null : +x.score.toFixed(1), x.kpis]));
check('a site with 2 routes and no other data does not rank first', false, r[0].id === 'tiny');
