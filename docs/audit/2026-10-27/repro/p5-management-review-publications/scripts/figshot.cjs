const { chromium } = require(process.argv[2] + "/node_modules/playwright");
const out = process.argv[3]; const targets = JSON.parse(process.argv[4]);
(async () => {
  let browser; try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, reducedMotion: "reduce" });
  for (const [p, needle] of targets) {
    const page = await ctx.newPage(); await page.goto("http://localhost:8107" + p, { waitUntil: "networkidle" });
    const h = await page.evaluateHandle((needle) => { for (const s of document.querySelectorAll("svg.wk-svg")) { if (!s.getBoundingClientRect().width) continue; if ([...s.querySelectorAll("text")].some((t) => t.textContent.includes(needle))) return s.closest("figure") || s.parentElement; } return null; }, needle);
    const el = h.asElement(); if (!el) { console.log("not found", p); continue; }
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
    await el.screenshot({ path: `${out}/clip${p.replace(/\//g, "_")}.png` }); console.log("ok", p);
    await page.close();
  }
  await browser.close();
})();
