// Before/after pictures of the phone charts that the audit found cut (E-07): the live site (before) and the
// local build (after), 390 px wide, reduced motion so the charts are drawn in full.
const { chromium } = require("playwright");
const OUT = process.argv[2];
const PAGES = [["de", "45"], ["en", "56"], ["sq", "12"]];
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, reducedMotion: "reduce" })).newPage();
  await page.route(/cloudflareinsights|googletagmanager/, (r) => r.abort());
  for (const [lang, n] of PAGES) {
    const path = `/${lang === "en" ? "" : `${lang}/`}magazine/management-review-nr-${n}.html`;
    for (const [tag, base] of [["before", "https://stivencatalyst.com"], ["after", process.env.BASE || "http://127.0.0.1:8341"]]) {
      await page.goto(base + path);
      const fig = page.locator("figure:has(svg.wk-svg)").filter({ has: page.locator("svg.wk-svg:visible") }).first();
      await fig.scrollIntoViewIfNeeded();
      await fig.screenshot({ path: `${OUT}/${lang}-nr${n}-${tag}.png` });
    }
  }
  await browser.close();
})();
