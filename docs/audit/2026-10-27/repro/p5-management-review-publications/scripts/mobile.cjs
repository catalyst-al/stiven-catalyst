const { chromium } = require(process.argv[2] + "/node_modules/playwright");
const out = process.argv[3];
const pages = ["/magazine/management-review.html", "/magazine/management-review-nr-01.html", "/de/magazine/management-review-nr-45.html", "/sq/magazine/management-review-nr-09.html", "/magazine/management-review-nr-80.html", "/magazine/operational-treatise-vol-13.html", "/magazine/from-the-floor.html", "/magazine/nga-terreni-02.html", "/magazine/management-review-2026-09.html", "/publications.html", "/sq/magazine/operational-treatise.html", "/guides/tools-guide.html"];
(async () => {
  let browser;
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }); }
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const res = [];
  for (const p of pages) {
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const r = await page.goto("http://localhost:8107" + p, { waitUntil: "networkidle" });
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const over = [...document.querySelectorAll("body *")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > window.innerWidth + 1) && getComputedStyle(el).position !== "fixed"; }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} r=${Math.round(el.getBoundingClientRect().right)}`);
      const smallText = [...document.querySelectorAll("svg text")].map((t) => parseFloat(getComputedStyle(t).fontSize) * (t.ownerSVGElement ? t.ownerSVGElement.getBoundingClientRect().width / (t.ownerSVGElement.viewBox.baseVal.width || t.ownerSVGElement.getBoundingClientRect().width) : 1)).filter((x) => x > 0);
      const svgs = [...document.querySelectorAll("svg.wk-svg")].filter((s) => s.getBoundingClientRect().width > 0).map((s) => { const r = s.getBoundingClientRect(); const vb = s.viewBox.baseVal; const scale = r.width / (vb.width || r.width); const fs = [...s.querySelectorAll("text")].map((t) => parseFloat(getComputedStyle(t).fontSize) * scale); return { w: Math.round(r.width), minFont: fs.length ? Math.min(...fs).toFixed(1) : null }; });
      const pFont = parseFloat(getComputedStyle(document.querySelector("main p") || document.body).fontSize);
      return { scrollW: de.scrollWidth, innerW: window.innerWidth, over, svgs: svgs.slice(0, 10), pFont, height: de.scrollHeight };
    });
    res.push({ p, status: r.status(), ...m, errs });
    await page.screenshot({ path: `${out}/${p.replace(/\//g, "_")}.png`, fullPage: false });
    await page.close();
  }
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
