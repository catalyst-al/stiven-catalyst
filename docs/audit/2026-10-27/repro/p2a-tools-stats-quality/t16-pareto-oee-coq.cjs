// Pareto cumulative %, OEE = A x P x Q, Cost of Quality totals — independent values vs the real Math objects.
const { tool, check, note } = require('./lib.cjs');
// Pareto
{
  const w = tool('/tools/pareto/', {});
  const P = w.Pareto, K = w.ToolKit;
  const rows = [['Traffic', 40], ['Late loading', 25], ['Address', 15], ['Vehicle', 10], ['Other', 30], ['Weather', 5], ['Café', 3], ['Cafe', 2]].map(([c, n]) => [c, String(n)]);
  const r = P.analyse({ rows, hasHeader: false, firstLine: 1 }, { map: { category: 0, count: 1, value: -1, date: -1, filter: -1 }, measure: 'count', merges: [], notStated: 'Not stated', parseNumber: K.parseNumber, parseDate: K.parseDate });
  // Independent: total 130; Other kept last; Café+Cafe folded (accent) = 5 -> tie with Weather 5
  note('pareto items', r.items.map((i) => [i.key, i.amount, +(i.cumulative * 100).toFixed(2), i.cls]));
  check('total 130', 130, r.total);
  check('first cumulative = 40/130', 40 / 130, r.items[0].cumulative);
  check('Other is last', true, P.isOther(r.items.at(-1).key));
  check('cumulative of last = 1', 1, r.items.at(-1).cumulative);
  note('Café/Cafe merged and reported as merged', r.merged);
  note('vital few (A, not Other)', r.vital.map((i) => i.key));
  const neg = P.analyse({ rows: [['A', '-3'], ['B', '1,5'], ['C', 'abc']], hasHeader: false }, { map: { category: 0, count: 1, value: -1, date: -1, filter: -1 }, measure: 'count', merges: [], notStated: 'x', parseNumber: K.parseNumber, parseDate: K.parseDate });
  note('pareto negative/text counts skipped with reasons', neg.skipped);
}
// OEE
{
  const w = tool('/tools/oee/', {});
  const O = w.OeeMath;
  const cfg = JSON.parse(w.document.getElementById('oee-data').textContent);
  const reasons = cfg.reasons || [];
  note('reason list (first 6)', reasons.slice(0, 6));
  const planned = reasons.find((r) => r.loss === 'planned')?.name, brk = reasons.find((r) => r.loss === 'breakdowns')?.name, setup = reasons.find((r) => r.loss === 'setup')?.name;
  const e = O.entry({ planned: 480, stops: [{ reason: planned, minutes: 30 }, { reason: brk, minutes: 45 }, { reason: setup, minutes: 15 }], pieces: 350, rejects: 14 }, 60, reasons);
  // Independent: ppt 450, run 390, A=390/450, P=350*1/390, Q=336/350, OEE = 0.74667
  check('A', 390 / 450, e.availability);
  check('P', 350 / 390, e.performance);
  check('Q', 336 / 350, e.quality);
  check('OEE = A*P*Q', (390 / 450) * (350 / 390) * (336 / 350), e.oee);
  const e2 = O.entry({ planned: 240, stops: [], pieces: 300, rejects: 0 }, 60, reasons); // more pieces than possible
  note('impossible speed: performance capped + flagged', { performance: e2.performance, capped: e2.capped });
  const c = O.combine([e, e2]);
  check('combined OEE time-weighted = (336 + 240)/(450 + 240)', (336 + 240) / (450 + 240), c.oee);
  check('combined A*P*Q = OEE', c.oee, c.availability * c.performance * c.quality);
  note('parseStops("Jam 1,5; Changeover: 20 min, Break 30")', O.parseStops('Jam 1,5; Changeover: 20 min, Break 30', reasons));
}
// Cost of Quality
{
  const w = tool('/tools/cost-of-quality/', {});
  const Q = w.CostOfQualityMath;
  const lines = [
    { cat: 'prevention', basis: 'hours', qty: '10', rate: '', period: 'week' },
    { cat: 'appraisal', basis: 'count', qty: '200', rate: '1,50', period: 'month' },
    { cat: 'internal', basis: 'fixed', amount: '3.000', period: 'quarter' },
    { cat: 'external', basis: 'fixed', amount: '12000', period: 'year' },
  ];
  const t = Q.totals(lines, { hourlyRate: '30' });
  // Independent (EN page: "3.000" = 3.0!; "1,50" = 1.5): prevention 10*30*52/12=1300; appraisal 300; internal 3/3=1; external 1000
  note('CoQ month (EN page)', t.month);
  check('prevention per month = 10 h x 30 x 52/12', 1300, t.month.prevention);
  note('"3.000" typed on the EN page reads as', Q.amount('3.000'));
  const wd = tool('/de/tools/cost-of-quality/', {});
  note('"3.000" typed on the DE page reads as', wd.CostOfQualityMath.amount('3.000'));
  check('COPQ = IF + EF', t.month.internal + t.month.external, t.copq);
  const s = Q.scenario(t, 0.3, 200);
  check('scenario net/year = 0.3*COPQ*12 - 200*12', 0.3 * t.copq * 12 - 2400, s.netYear);
}
