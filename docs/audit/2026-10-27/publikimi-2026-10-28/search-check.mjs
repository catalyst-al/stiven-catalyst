const [pwPath, exe] = process.argv.slice(2);
const { chromium } = await import(pwPath);
const BASE = "https://stivencatalyst.com";
const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.route(/cloudflareinsights\.com/, (r) => r.abort());
let bad = 0;
for (const [lang, word] of [["/de", "Übergabe"], ["/sq", "dorëzim"]]) {
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${BASE}${lang}/search.html`, { waitUntil: "load" });
  await page.locator("[data-search-input]").click(); await page.keyboard.type(word, { delay: 40 });
  const links = page.locator("[data-search-results] > li > a"), first = links.first();
  await first.waitFor({ state: "visible", timeout: 10000 }).catch(() => {});
  const count = await links.count(); const href = count ? await first.getAttribute("href") : null;
  for (let i = 0; i < 10 && count && !(await first.evaluate((a) => a === document.activeElement)); i++) await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.waitForURL((u) => href && u.pathname === new URL(href, BASE).pathname, { timeout: 10000 }).catch(() => {});
  const ok = count > 1 && href && new URL(page.url()).pathname === new URL(href, BASE).pathname && !errors.length;
  if (!ok) bad++;
  console.log(`${ok ? "PASS" : "FAIL"} search ${lang} "${word}": ${count} results, ${decodeURI(page.url().replace(BASE, ""))}`);
}
await browser.close(); process.exit(bad ? 1 : 0);
