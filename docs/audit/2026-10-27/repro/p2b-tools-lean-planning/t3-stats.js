// Process Lab statistics (StatsKit, ProcessLabMath on the real page) vs scipy reference values (stats_expected.json).
const fs = require('fs');
const { open, check, close, results } = require('./lib');
const E = JSON.parse(fs.readFileSync(__dirname + '/stats_expected.json', 'utf8'));
(async () => {
  const { page, errors } = await open('/tools/process-lab/');
  const r = await page.evaluate((E) => {
    const S = window.StatsKit, P = window.ProcessLabMath;
    const a = P.analyse(E.x.map((value) => ({ value, date: '' })), { lsl: 44, usl: 57 });
    const g = S.gageRR(E.gage.y);
    const t = S.chiSquare(E.chi.table);
    const w = S.welch(E.welch.a, E.welch.b);
    const l = S.linearFit(E.x.map((_, i) => i + 1), E.x);
    const parsedDE = null;
    return { imr: a.chart, cap: a.cap, ad: a.ad, chi: t, w, l, g: { pInt: g.pInteraction, pct: g.components.grr.pctStudy, ndc: g.ndc, pooled: g.pooled }, parse: P.parseValues('Value\n47,2\n48.1\n2026-01-03;49,5\n\nabc') };
  }, E);
  check('I-MR mean', E.imr.mean, r.imr.mean); check('I-MR UCL', E.imr.ucl, r.imr.ucl); check('I-MR LCL', E.imr.lcl, r.imr.lcl); check('MR UCL', E.imr.mrUcl, r.imr.mrUcl);
  check('Cp', E.cap.cp, r.cap.cp); check('Cpk', E.cap.cpk, r.cap.cpk); check('Pp', E.cap.pp, r.cap.pp); check('Ppk', E.cap.ppk, r.cap.ppk); check('PPM expected', E.cap.ppm, r.cap.ppmTotal, 1e-6);
  check('Anderson-Darling A2 (vs scipy)', E.ad.scipy, r.ad.A2, 1e-6);
  check('Chi-square stat', E.chi.chi2, r.chi.chi2); check('Chi-square p', E.chi.p, r.chi.p, 1e-7); check('Chi-square df', E.chi.df, r.chi.df);
  check('Welch t (sign: mean2-mean1)', -E.welch.t, r.w.t, 1e-9); check('Welch p', E.welch.p, r.w.p, 1e-7);
  check('Linear slope', E.lin.slope, r.l.slope); check('Linear p', E.lin.p, r.l.p, 1e-6);
  check('Gage pInt', E.gage.pInt, r.g.pInt, 1e-6); check('Gage %SV', E.gage.at005.pctStudy, r.g.pct, 1e-9); check('Gage ndc', E.gage.at005.ndc, r.g.ndc);
  console.log('EN parseValues', JSON.stringify(r.parse));
  console.log('errors', errors);
  await page.context().close();
  await close();
  console.log(`\n${results.filter((x) => x.ok).length}/${results.length} passed`);
})();
