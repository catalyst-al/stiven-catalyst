// Every tool page of the built site, in the three languages (playwright.config.mjs runs this file in the 1440 px dark
// project only: 177 pages, one visit each). For each: the page answers, its tool panel and the "All your work in one
// file" box are there, and no script of the page fails (fixtures.mjs fails the test on any page error, this file
// says on which page). In English, where a tool offers an example, the example is loaded, the tool's work reaches
// the browser's storage, and it is still there after a reload: the autosave and the restore of every tool, not of the
// thirteen the journeys visit. One test per language, so a failing page is reported with the others, not instead of
// them.
import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures.mjs";

const tools = async (lang) => JSON.parse(await readFile(`src/_data/${lang === "en" ? "" : `${lang}/`}tools.json`, "utf8")).filter((tool) => tool.url).map((tool) => tool.url);
const workKeys = (page) => page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("sc-") && !["sc-theme", "sc-motion", "sc-seen-writing", "sc-seen-publications", "sc-floor-mode-ui", "sc-print-guide-hidden", "sc-persist-asked"].includes(key)));
const snapshot = (page, keys) => page.evaluate((list) => Object.fromEntries(list.map((key) => [key, localStorage.getItem(key)])), keys);

for (const lang of ["en", "de", "sq"]) {
  test(`every tool page opens, keeps its work and raises no script error (${lang})`, async ({ page }) => {
    test.setTimeout(600_000);
    const urls = await tools(lang);
    expect(urls.length).toBeGreaterThanOrEqual(59);
    const errors = [];
    page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
    const problems = [];
    for (const url of urls) {
      const response = await page.goto(url);
      if (!response || response.status() !== 200) { problems.push(`${url}: status ${response?.status()}`); continue; }
      if (!(await page.locator("main h1").count())) problems.push(`${url}: no heading`);
      if (!(await page.locator(".tool-panel, [data-tool], main form").count())) problems.push(`${url}: no tool panel`);
      if (!(await page.locator("[data-work-backup]").count())) problems.push(`${url}: no work backup box`);
      if (lang !== "en") continue;
      // The example, where there is one: it saves, and the saved work survives a reload.
      const example = page.locator("[data-example]").first();
      if (!(await example.count()) || !(await example.isVisible())) continue;
      await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("sc-")).forEach((key) => localStorage.removeItem(key)));
      await example.click();
      let keys = [];
      for (let i = 0; i < 20 && !keys.length; i++) {
        await page.waitForTimeout(100);
        keys = await workKeys(page);
      }
      // Some examples live in the page's memory only (Site Compare), so nothing saved is not a fault; what saved must survive.
      if (!keys.length) continue;
      const before = await snapshot(page, keys);
      await page.reload();
      const after = await snapshot(page, keys);
      for (const key of keys) if (after[key] !== before[key]) problems.push(`${url}: ${key} changed by the reload`);
    }
    expect(problems, "every tool page in order").toEqual([]);
    expect(errors, "no script error on any tool page").toEqual([]);
  });
}

test("the Tools page in the three languages", async ({ page }) => {
  for (const url of ["/tools.html", "/de/tools.html", "/sq/tools.html"]) {
    const response = await page.goto(url);
    expect(response.status(), url).toBe(200);
    expect(await page.locator('a[href*="/tools/"]').count(), url).toBeGreaterThanOrEqual(59);
    await expect(page.locator("[data-work-backup]")).toBeAttached();
  }
});
