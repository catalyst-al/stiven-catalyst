// Hotel KPIs: occupancy/ADR/RevPAR, no-show denominator vs Signals, invalid sold > available, hidden limits.
const { tool, check, note, text } = require('./lib.cjs');
const nights = [
  { date: '2026-10-19', available: 100, sold: 80, roomRev: 8000, otherRev: 1000, arrivals: 30, noShows: 2, ooo: 1, complaints: 1 },
  { date: '2026-10-20', available: 100, sold: 90, roomRev: 9900, otherRev: 0, arrivals: 40, noShows: 0, ooo: 0, complaints: 0 },
  { date: '2026-10-21', available: 100, sold: 120, roomRev: 12000, otherRev: 0, arrivals: 50, noShows: 5, ooo: 3, complaints: 4 },
];
const w = tool('/tools/hotel-kpis/', { 'sc-hotel-kpis': { rows: nights, budgetOcc: '85', budgetAdr: '105', example: {} } });
const M = w.HotelKpisMath;
const clean = nights.map((n) => M.cleanRow(n));
note('cleanRow keeps sold 120 > available 100?', clean[2]);
check('sold > available is rejected or flagged (cleanRow returns null)', null, clean[2]);
const t = M.totals(clean.filter(Boolean));
const k = M.kpis(t);
// Independent over the 3 nights as stored: sold 290 / avail 300; ADR 29900/290; RevPAR 29900/300
check('occupancy 290/300', 290 / 300, k.occ);
check('ADR 29900/290', 29900 / 290, k.adr);
check('RevPAR 29900/300', 29900 / 300, k.revpar);
check('no-show rate 7/(120+7)', 7 / 127, k.noShowRate);
const page = text(w, '[data-results], main');
note('page shows occupancy over 100%? (night 3)', /120[.,]?0?\s?%/.test(page));
note('limits used for "weakest KPI" stated on page? (5% no-show)', /5\s?%[^.]{0,40}no-show|no-show[^.]{0,60}5\s?%/i.test(page));
const i = page.search(/Work on first|weakest|costs the most/i);
note('weakest KPI card', page.slice(Math.max(0, i - 50), i + 400));
// Signals reads the same rows: no-show p-chart denominator arrivals+noShows (consistent)
const ws = tool('/tools/signals/', {});
const hs = ws.SignalsMath.hotelSeries({ rows: nights }, { from: '2026-10-01', to: '2026-10-31' });
note('Signals hotel occupancy values', hs[0].points.map((p) => +p.value.toFixed(3)));
