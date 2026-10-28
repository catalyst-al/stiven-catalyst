// Untranslated English in the RESULT areas of DE and SQ tool pages (with example data). Heuristic: English function
// words inside result containers. Real Chromium.
const fs = require('node:fs');
const { launch, newPage, BASE } = require('./pw.cjs');
const TOOLS = ['shift-pulse', 'shift-handover', 'damage-control', 'incomplete-control', 'delay-analyzer', 'night-audit', 'cx-control-tower', 'kpi-diagnostic', 'sigma-control-chart', 'pareto', 'oee', 'signals', 'site-compare', 'cost-of-quality', 'daily-board', 'ops-report', 'hotel-kpis', 'energy-tracker', 'andon', 'safety-cross', 'waste-log', 'guest-complaints', 'lost-found'];
const EN = /\b(the|of|and|with|per day|entries|routes|target|units|this week|last week|on time|late|no data|average|signal|Result|Example)\b/g;
(async () => {
  const browser = await launch();
  const report = {};
  for (const lang of ['de', 'sq']) {
    const { context, page } = await newPage(browser, { locale: lang === 'de' ? 'de-DE' : 'sq-AL' });
    for (const t of ['damage-control', 'incomplete-control', 'delay-analyzer']) {
      await page.goto(`${BASE}/${lang}/tools/${t}/`); await page.waitForTimeout(400);
      const p = page.locator('[data-preset="all"]').first(); if (await p.count()) await p.click();
    }
    for (const slug of TOOLS) {
      await page.goto(`${BASE}/${lang}/tools/${slug}/`); await page.waitForTimeout(700);
      const ex = page.locator('[data-example]').first();
      if (['shift-handover', 'cost-of-quality', 'site-compare', 'signals', 'ops-report'].includes(slug) && await ex.count()) { try { await ex.click({ timeout: 2000 }); await page.waitForTimeout(500); } catch {} }
      const txt = await page.evaluate(() => [...document.querySelectorAll('[data-results], [data-pulse-results], [data-result], .result-card, [data-output], output')].map((n) => n.textContent).join('\n'));
      const hits = [...txt.matchAll(EN)].map((m) => m[0]);
      const ctx = [...txt.matchAll(EN)].slice(0, 4).map((m) => txt.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, ' '));
      report[`${lang}/${slug}`] = { chars: txt.length, hits: hits.length, sample: ctx };
      console.log(lang, slug, txt.length, hits.length, JSON.stringify(ctx).slice(0, 400));
    }
    await context.close();
  }
  fs.writeFileSync(`${__dirname}/t17-lang.json`, JSON.stringify(report, null, 1));
  await browser.close();
})();
