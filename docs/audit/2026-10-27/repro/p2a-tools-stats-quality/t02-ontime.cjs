// Regression 2: on-time % in Shift Pulse and Shift Handover vs an independent computation and vs Delay Analyzer.
const { tool, check, note, text, click, isoDaysAgo } = require('./lib.cjs');
const D = isoDaysAgo(0);
// Fixture: 10 routes on D, Early shift, arrival grace 15.
//  R1 +0, R2 +15 (exactly at grace -> on time), R3 +16 (late), R4 -30 (early -> on time), R5 +45 late,
//  R6 23:50 -> 00:20 (+30, crosses midnight, late), R7 +5, R8 +120 late, R9 actual missing (cannot be judged),
//  R10 planned 08:00 actual 07:59 (early by 1)
const routes = [
  ['08:00', '08:00'], ['08:00', '08:15'], ['08:00', '08:16'], ['08:00', '07:30'], ['08:00', '08:45'],
  ['23:50', '00:20'], ['09:00', '09:05'], ['09:00', '11:00'], ['09:00', ''], ['08:00', '07:59'],
].map(([planArr, actArr], i) => ({ date: D, shift: 'Early', route: `R${i + 1}`, planDep: '06:00', actDep: '06:00', planArr, actArr, reason: '', note: '' }));
// Independent: judged = routes with both times = 9; late = >15 => R3,R5,R6,R8 = 4; on-time = 5/9 = 55.56 %
const judged = 9, late = 4, expectedOnTime = (judged - late) / judged;
const delay = { period: '', routes: '', departureGrace: '10', arrivalGrace: '15', target: '95', from: '', to: '', rows: routes, example: {}, totalsFor: {} };

// Shift Pulse (math from the real script loaded in the real page)
let w = tool('/tools/shift-pulse/', { 'sc-delay-analyzer': delay });
const m = w.PulseMath.compute({ delay, damage: { rows: [] }, incomplete: { rows: [] } }, { from: D, to: D, unit: 'day' });
check('Pulse routes judged', judged, m.delay.routes);
check('Pulse late', late, m.delay.late);
check('Pulse onTime', expectedOnTime, m.delay.onTime);
const card = text(w, '.sp-card');
note('Pulse card text', card.slice(0, 300));
check('Pulse card shows 55.6%', true, /55\.6%/.test(card));
// Delay Analyzer on the same log (R9 is dropped by the analyzer on load since it lacks actual arrival)
w = tool('/tools/delay-analyzer/', { 'sc-delay-analyzer': delay });
const res = text(w, '[data-results]');
note('Delay Analyzer head', res.slice(0, 250));
check('Delay Analyzer shows 55.6% on time', true, /55\.6%/.test(res));
// Shift Handover: delivery template, fill from logs
const ho = { current: { template: 'delivery', date: D, shift: 'Early', area: '', from: '', to: '', headsUp: '', safety: '', metrics: [], issues: [], checks: [] }, history: [] };
w = tool('/tools/shift-handover/', { 'sc-delay-analyzer': delay, 'sc-shift-handover': ho });
click(w, '[data-fill-logs]');
const st = JSON.parse(w.localStorage.getItem('sc-shift-handover'));
const ot = st.current.metrics.find(([l]) => /On-time/.test(l));
note('Handover on-time metric', ot);
check('Handover on-time = 55.6%', true, /55\.6/.test(ot[1]));
// Partial route log: routes in period 50 typed for the same (all) days -> counts only
const partial = { ...delay, routes: '50', totalsFor: { routes: '|' } };
w = tool('/tools/shift-pulse/', {});
const mp = w.PulseMath.compute({ delay: partial, damage: { rows: [] }, incomplete: { rows: [] } }, { from: D, to: D, unit: 'day' });
check('Pulse partial log -> no on-time share', null, mp.delay.onTime);
// Grace typed with decimal comma "15,5" in DE: 15.5 -> +16 late still, +15 on time
const m2 = w.PulseMath.compute({ delay: { ...delay, arrivalGrace: '15,5' }, damage: { rows: [] }, incomplete: { rows: [] } }, { from: D, to: D, unit: 'day' });
check('Pulse grace "15,5" honoured (late still 4)', 4, m2.delay.late);
// Empty grace box: Delay Analyzer treats empty as 0 (parseNumber('')=NaN -> ||0); Pulse treats '' as ... ?
const m3 = w.PulseMath.compute({ delay: { ...delay, arrivalGrace: '' }, damage: { rows: [] }, incomplete: { rows: [] } }, { from: D, to: D, unit: 'day' });
note('Pulse late with arrivalGrace "" (analyzer uses 0 => late would be R2,R3,R5,R6,R7,R8 = 6)', m3.delay.late);
check('Pulse and Analyzer agree when grace box is empty (6 late)', 6, m3.delay.late);
const wa = tool('/tools/delay-analyzer/', { 'sc-delay-analyzer': { ...delay, arrivalGrace: '' } });
note('Analyzer head with empty grace', text(wa, '[data-results] .result-head').slice(0, 200));
const wh = tool('/tools/shift-handover/', { 'sc-delay-analyzer': { ...delay, arrivalGrace: '' }, 'sc-shift-handover': ho });
click(wh, '[data-fill-logs]');
note('Handover on-time with empty grace', JSON.parse(wh.localStorage.getItem('sc-shift-handover')).current.metrics.find(([l]) => /On-time/.test(l)));
