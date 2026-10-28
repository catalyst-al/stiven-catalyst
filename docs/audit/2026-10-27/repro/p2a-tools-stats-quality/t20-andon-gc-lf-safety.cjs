// Andon summary, Guest Complaints within-target / per 100, Lost & Found keep-until, Safety Cross rates: fixtures vs independent values.
const { tool, check, note } = require('./lib.cjs');
{
  const w = tool('/tools/andon/', {});
  const A = w.AndonMath; const cfg = JSON.parse(w.document.getElementById('andon-data').textContent);
  const rows = [['08:00', '08:02', '08:10'], ['09:00', '09:05', '09:30'], ['23:50', '23:58', '00:20'], ['10:00', '', '10:03']].map(([called, arrived, solved], i) => A.cleanRows([{ date: '2026-10-20', shift: 'Early', area: 'L1', reason: cfg.reasons[0].key, called, arrived, solved }], cfg)[0]);
  const set = A.settings(cfg);
  const s = A.summary(rows, set);
  // respond: 2, 5, 8 (row 4 has no arrival) -> median 5; resolve: 10, 30, 30, 3 -> median (10+30)/2 = 20
  check('andon respond median', 5, s.respond.median);
  check('andon resolve median', 20, s.resolve.median);
  note('andon targets (respond, resolve) from data', [set.respond, set.resolve]);
  check('andon respond within target share', [2, 5, 8].filter((v) => v <= set.respond).length / 3, s.respond.share);
}
{
  const w = tool('/tools/guest-complaints/', {});
  const G = w.GuestComplaintsMath; const cfg = JSON.parse(w.document.getElementById('guest-complaints-data')?.textContent || '{}');
  if (G && cfg.channels) {
    const t = G.targets(cfg, {});
    const inh = cfg.channels.find((c) => c.inHouse !== false).key;
    const rows = [
      { date: '2026-10-20', time: '10:00', channel: inh, resolvedDate: '2026-10-20', resolvedTime: '10:10' },
      { date: '2026-10-20', time: '10:00', channel: inh, resolvedDate: '2026-10-20', resolvedTime: '13:00' },
      { date: '2026-10-20', time: '10:00', channel: inh, resolvedDate: '', resolvedTime: '' },
      { date: '2026-10-20', time: '', channel: inh, resolvedDate: '2026-10-20', resolvedTime: '11:00' },
    ];
    const r = G.withinTarget(rows, cfg, t, { date: '2026-10-21', time: '09:00' });
    note('gc targets', t);
    // independent: within=1 (10 min), missed: 180 min > target (if target < 180) + open past target -> decided 3, share 1/3; unknown 1
    check('gc within-target share', 1 / 3, r.share);
    check('gc unknown (no time)', 1, r.unknown);
    check('gc complaints per 100 room nights', 2.5, G.per100(5, 200));
  } else note('guest complaints math/data not found', Object.keys(w).filter((k) => /Guest/.test(k)));
}
{
  const w = tool('/tools/lost-found/', {});
  const L = w.LostFoundMath; const cfg = JSON.parse(w.document.getElementById('lost-found-data').textContent);
  const r = L.rules(cfg, {});
  const docCat = cfg.categories.find((c) => c.days)?.key, other = cfg.categories.find((c) => !c.days)?.key;
  check('L&F keep-until for a high-value item found 2026-10-25 = +180 days', '2027-04-23', L.keepUntil({ date: '2026-10-25', category: other, value: 'high' }, cfg, r));
  check('L&F documents keep 7 days', '2026-11-01', L.keepUntil({ date: '2026-10-25', category: docCat, value: 'low' }, cfg, r));
  check('L&F flag over on day after keep-until', 'over', L.flagOf({ date: '2026-10-25', category: docCat, value: 'low', steps: [] }, '2026-11-02', cfg, r));
}
{
  const w = tool('/tools/safety-cross/', {});
  const S = w.SafetyMath;
  const rows = [{ type: 'lost-time' }, { type: 'no-lost-time' }, { type: 'first-aid' }, { type: 'near-miss' }, { type: 'near-miss' }];
  const r = S.rates(rows, 160000);
  check('LTIFR = 1 x 1e6 / 160000', 6.25, r.ltifr);
  check('TRIR = 2 x 2e5 / 160000', 2.5, r.trir);
  note('Bird pyramid mapping (Bird 1969: 1 serious : 10 minor : 30 property damage : 600 no-injury incidents)', S.pyramid(rows).map((l) => [l.key, l.bird]));
  check('days since last accident across DST (2026-10-24 -> 2026-10-27)', 3, S.daysSince([{ type: 'lost-time', date: '2026-10-24' }], '2026-10-27'));
}
