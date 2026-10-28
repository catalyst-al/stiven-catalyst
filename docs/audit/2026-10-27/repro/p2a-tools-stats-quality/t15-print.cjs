// Print clipping: each tool with its example (or seeded data), print media at A4 printable width, then page.pdf().
// Reports elements wider than the page, horizontally scrolled/clipped containers, and SVGs cut off.
const fs = require('node:fs');
const { launch, newPage, BASE } = require('./pw.cjs');
const TOOLS = ['shift-pulse', 'shift-handover', 'damage-control', 'incomplete-control', 'delay-analyzer', 'night-audit', 'cx-control-tower', 'kpi-diagnostic', 'sigma-control-chart', 'pareto', 'oee', 'signals', 'site-compare', 'cost-of-quality', 'daily-board', 'ops-report', 'hotel-kpis', 'energy-tracker', 'andon', 'safety-cross', 'waste-log', 'guest-complaints', 'lost-found'];
const langs = process.argv[2] ? process.argv[2].split(',') : ['en'];
(async () => {
  const browser = await launch();
  fs.mkdirSync(`${__dirname}/pdf`, { recursive: true });
  const out = [];
  for (const lang of langs) {
    const { context, page } = await newPage(browser);
    // Visit the logs first and touch a range button so Shift Pulse / Ops Report / Daily Board have data to print.
    for (const t of ['damage-control', 'incomplete-control', 'delay-analyzer']) {
      await page.goto(`${BASE}${lang === 'en' ? '' : `/${lang}`}/tools/${t}/`); await page.waitForTimeout(400);
      const p = page.locator('[data-preset="all"]').first(); if (await p.count()) await p.click();
    }
    for (const slug of TOOLS) {
      const url = `${BASE}${lang === 'en' ? '' : `/${lang}`}/tools/${slug}/`;
      await page.setViewportSize({ width: 1200, height: 900 });
      await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(700);
      // Example buttons for tools that do not open on their example
      const ex = page.locator('[data-example]').first();
      if (['shift-handover', 'cost-of-quality', 'site-compare', 'signals', 'ops-report'].includes(slug) && await ex.count()) { try { await ex.click({ timeout: 2000 }); await page.waitForTimeout(500); } catch {} }
      if (slug === 'kpi-diagnostic') {
        await page.evaluate(() => { document.querySelectorAll('fieldset.statement').forEach((f, i) => { const r = f.querySelectorAll('input[type=radio]'); r[i % 4].checked = true; }); document.querySelector('[data-diagnostic]').requestSubmit(); });
        await page.waitForTimeout(300);
      }
      await page.emulateMedia({ media: 'print' });
      await page.setViewportSize({ width: 718, height: 1000 }); // A4 at Chrome's default 1 cm margins ≈ 190 mm ≈ 718 px
      await page.waitForTimeout(300);
      const r = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const vis = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length; };
        const wide = [];
        const clipped = [];
        document.querySelectorAll('main *').forEach((e) => {
          if (!vis(e)) return;
          const b = e.getBoundingClientRect();
          if (b.width > 0 && b.right > W + 2 && !e.closest('svg') ) wide.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} right=${Math.round(b.right)}`);
          const s = getComputedStyle(e);
          if (['auto', 'scroll', 'hidden'].includes(s.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.clientWidth > 0) clipped.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${e.scrollWidth}>${e.clientWidth} (${s.overflowX})`);
        });
        return { W, docW: document.documentElement.scrollWidth, wide: [...new Set(wide)].slice(0, 6), clipped: [...new Set(clipped)].slice(0, 6), results: !!document.querySelector('[data-results]:not([hidden]), [data-pulse-results], [data-result]:not([hidden])') };
      });
      let pages = null;
      try {
        const file = `${__dirname}/pdf/${lang}-${slug}.pdf`;
        await page.pdf({ path: file, format: 'A4', printBackground: true });
        pages = (fs.readFileSync(file, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
      } catch (e) { pages = `pdf error ${e.message.slice(0, 60)}`; }
      await page.emulateMedia({ media: 'screen' });
      out.push({ lang, slug, pages, ...r });
      console.log(JSON.stringify({ lang, slug, pages, docW: r.docW, W: r.W, wide: r.wide, clipped: r.clipped }));
    }
    await context.close();
  }
  fs.writeFileSync(`${__dirname}/t15-print.json`, JSON.stringify(out, null, 1));
  await browser.close();
})();
