const { chromium } = require(process.argv[2] + "/node_modules/playwright");
(async () => {
  let browser; try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.route(/cloudflareinsights|googletagmanager/, (r) => r.abort());
  const urls = [];
  for (let n = 1; n <= 80; n++) for (const l of ["", "de/", "sq/"]) urls.push(`/${l}magazine/management-review-nr-${String(n).padStart(2, "0")}.html`);
  for (let n = 1; n <= 13; n++) for (const l of ["", "de/", "sq/"]) urls.push(`/${l}magazine/operational-treatise-vol-${String(n).padStart(2, "0")}.html`);
  for (const s of ["nga-terreni-01", "nga-terreni-02"]) for (const l of ["", "de/", "sq/"]) urls.push(`/${l}magazine/${s}.html`);
  let total = 0, pagesHit = 0, scrollOver = 0, tiny = 0;
  for (const u of urls) {
    await page.goto("http://localhost:8107" + u, { waitUntil: "load" });
    const r = await page.evaluate(() => {
      const res = []; let minF = 99;
      for (const s of document.querySelectorAll("svg.wk-svg")) {
        const sb = s.getBoundingClientRect(); if (!sb.width) continue;
        const sc = sb.width / (s.viewBox.baseVal.width || sb.width);
        for (const t of s.querySelectorAll("text")) { const b = t.getBoundingClientRect(); const f = parseFloat(getComputedStyle(t).fontSize) * sc; if (f < minF) minF = f; if (b.right > sb.right + 1 || b.left < sb.left - 1) res.push(t.textContent.slice(0, 70)); }
      }
      return { clipped: res, scrollW: document.documentElement.scrollWidth, minF };
    });
    if (r.scrollW > 390) scrollOver++;
    if (r.minF < 8) tiny++;
    if (r.clipped.length) { pagesHit++; total += r.clipped.length; console.log(u, "minFont", r.minF.toFixed(1), "CLIPPED:", r.clipped.slice(0, 3).join(" || ")); }
  }
  console.log(`pages ${urls.length}, pages with clipped chart text ${pagesHit}, clipped labels ${total}, pages with horizontal scroll ${scrollOver}, pages with chart text <8px ${tiny}`);
  await browser.close();
})();
