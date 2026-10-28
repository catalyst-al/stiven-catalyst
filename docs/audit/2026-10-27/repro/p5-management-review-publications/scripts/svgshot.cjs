const { chromium } = require(process.argv[2] + "/node_modules/playwright");
const out = process.argv[3];
(async () => {
  let browser; try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  for (const p of ["/de/magazine/management-review-nr-45.html", "/sq/magazine/management-review-nr-09.html", "/magazine/management-review-nr-01.html"]) {
    const page = await ctx.newPage(); await page.goto("http://localhost:8107" + p, { waitUntil: "networkidle" });
    const info = await page.evaluate(() => [...document.querySelectorAll("svg.wk-svg")].map((s, i) => { const r = s.getBoundingClientRect(); const vb = s.viewBox.baseVal; const sc = r.width / vb.width; const fs = [...s.querySelectorAll("text")].map((t) => parseFloat(getComputedStyle(t).fontSize) * sc); const fig = s.closest("figure,section,div"); return { i, w: r.width, min: fs.length ? Math.min(...fs) : null, cls: s.getAttribute("class"), parent: fig ? fig.className : "", over: [...s.querySelectorAll("text")].some((t) => t.getBoundingClientRect().right > window.innerWidth) }; }));
    console.log(p, JSON.stringify(info.filter((x) => x.w > 0)));
    const els = await page.$$("svg.wk-svg");
    let k = 0;
    for (let i = 0; i < els.length; i++) { const x = info[i]; if (x && x.w > 0 && (x.min < 8 || x.over) && k < 2) { await els[i].scrollIntoViewIfNeeded(); const box = await els[i].evaluateHandle((s) => s.closest("figure") || s.parentElement); await box.asElement().screenshot({ path: `${out}/svg${p.replace(/\//g, "_")}-${i}.png` }); k++; } }
    await page.close();
  }
  await browser.close();
})();
