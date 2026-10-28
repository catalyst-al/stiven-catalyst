const { chromium } = require(process.argv[2] + "/node_modules/playwright");
const out = process.argv[3];
(async () => {
  let browser; try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  for (const rm of ["no-preference", "reduce"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: rm });
    for (const p of ["/de/magazine/management-review-nr-45.html", "/magazine/management-review-nr-45.html"]) {
      const page = await ctx.newPage(); await page.goto("http://localhost:8107" + p, { waitUntil: "networkidle" });
      const els = await page.$$("figure svg.wk-svg");
      const vis = [];
      for (const e of els) if ((await e.boundingBox())?.width > 0) vis.push(e);
      const e = vis[0];
      await e.scrollIntoViewIfNeeded(); await page.waitForTimeout(2500);
      const fig = await e.evaluateHandle((s) => s.closest("figure") || s.parentElement);
      await fig.asElement().screenshot({ path: `${out}/fig-${rm}${p.replace(/\//g, "_")}.png` });
      const t = await e.evaluate((s) => [...s.querySelectorAll("text")].map((x) => x.textContent).join(" | "));
      console.log(rm, p, t);
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
})();
