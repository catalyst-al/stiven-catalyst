// Andon live calls across the DST change of 25 Oct 2026 (Europe/Berlin: 03:00 CEST -> 02:00 CET).
process.env.TZ = 'Europe/Berlin';
const { tool, check, note } = require('./lib.cjs');
const w = tool('/tools/andon/', {});
const A = w.AndonMath;
const cfg = JSON.parse(w.document.getElementById('andon-data').textContent);
const call = (calledUtc, solvedUtc) => A.closeCall({ calledAt: Date.parse(calledUtc), reason: cfg.reasons[0].key, area: 'Line 1', shift: 'Night' }, Date.parse(solvedUtc), cfg);
// 00:40 UTC = 02:40 CEST; solved 30 real minutes later = 01:10 UTC = 02:10 CET
const r1 = call('2026-10-25T00:40:00Z', '2026-10-25T01:10:00Z');
note('fall-back call row', { called: r1.called, solved: r1.solved, resolve: A.summary([r1], A.settings(cfg)).resolve.mean });
check('fall-back: 30 real minutes recorded as 30', 30, A.summary([r1], A.settings(cfg)).resolve.mean);
// Spring-forward 29 Mar 2026: 00:50 UTC = 01:50 CET; solved 20 min later 01:10 UTC = 03:10 CEST
const r2 = call('2026-03-29T00:50:00Z', '2026-03-29T01:10:00Z');
check('spring-forward: 20 real minutes recorded as 20', 20, A.summary([r2], A.settings(cfg)).resolve.mean);
// Normal night crossing midnight
const r3 = call('2026-10-26T22:50:00Z', '2026-10-26T23:20:00Z');
check('midnight crossing: 30 minutes', 30, A.summary([r3], A.settings(cfg)).resolve.mean);
// A real call longer than 24 h is silently wrapped
const r4 = call('2026-10-20T08:00:00Z', '2026-10-21T09:00:00Z');
note('25-hour live call recorded as minutes', A.summary([r4], A.settings(cfg)).resolve.mean);
