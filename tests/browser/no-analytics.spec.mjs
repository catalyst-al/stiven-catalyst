// Visit counts are off (audit P2-09 / A-01): no page asks Cloudflare Web Analytics for its beacon or sends it a
// report, so no page address leaves the site, not even a Search address with what the visitor typed in ?q=. Every
// request a page makes is recorded (the fixtures refuse anything outside the test server, but the attempt is still
// seen here). The text typed here is invented.
import { test, expect } from "./fixtures.mjs";

const TYPED = "fictionalroom512";
const outside = (page) => {
  const seen = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.hostname !== "127.0.0.1") seen.push(request.url());
  });
  return seen;
};
// A page fully loaded and given a moment, the way the beacon would have loaded after the page and reported on leaving.
const settle = async (page) => {
  await page.waitForLoadState("load");
  await page.waitForTimeout(400);
};

test("Search with typed text in ?q= sends nothing outside the site, in three languages", async ({ page }) => {
  const seen = outside(page);
  for (const prefix of ["", "/de", "/sq"]) {
    await page.goto(`${prefix}/search.html?q=${TYPED}+pareto`);
    await settle(page);
    // The page reads the words from its address (the reason this test exists) …
    await expect(page.locator("[data-search-input]")).toHaveValue(`${TYPED} pareto`);
    // … and typing more changes the address again.
    await page.locator("[data-search-input]").fill(`${TYPED} night audit`);
    await expect(page).toHaveURL(new RegExp(`\\?q=${TYPED}`));
    await settle(page);
    // Leaving the page is when a beacon would report.
    await page.goto(`${prefix}/tools.html`);
    await settle(page);
  }
  expect(seen, "requests that left the site").toEqual([]);
  expect(await page.locator('script[src*="cloudflareinsights"]').count()).toBe(0);
});

test("the Tools pages, an essay, a reflection and a publication load nothing from Cloudflare analytics", async ({ page }) => {
  const seen = outside(page);
  const visited = [];
  for (const url of ["/tools.html", "/de/tools.html", "/sq/tools.html", "/insights.html", "/reflections.html", "/publications.html"]) {
    await page.goto(url);
    await settle(page);
    visited.push(url);
    expect(await page.locator('script[src*="cloudflareinsights"], script[data-cf-beacon]').count(), url).toBe(0);
  }
  // One of each kind of writing, taken from its list so the test follows the content.
  for (const [list, pattern] of [["/insights.html", /^\/insights\/[^/]+\/$/], ["/reflections.html", /^\/reflections\/[^/]+\/$/], ["/publications.html", /^\/(books|magazine|guides)\/[^/]+\.html$/]]) {
    await page.goto(list);
    const href = (await page.locator("main a[href]").evaluateAll((links) => links.map((a) => a.getAttribute("href")))).find((h) => pattern.test(h || ""));
    expect(href, `${list}: a piece of writing to open`).toBeTruthy();
    await page.goto(href);
    await settle(page);
    visited.push(href);
    expect(await page.locator('script[src*="cloudflareinsights"]').count(), href).toBe(0);
  }
  expect(visited.length).toBe(9);
  expect(seen, "requests that left the site").toEqual([]);
});
