// TEMPORARY probe for PR 404 (CI hardening A): fails on purpose in the 1440px dark project only, so CI must stay
// failed and keep exactly one trace. Fictional data only. Removed in the next commit; must not reach main.
import { test, expect } from "./fixtures.mjs";

test("CI trace probe: fictional failure", async ({ page }, testInfo) => {
  await page.goto("/tools.html");
  await page.locator("[data-tool-filter-input]").fill("fictionalprobe404");
  const expected = testInfo.project.name === "1440px dark" ? "deliberately wrong" : "fictionalprobe404";
  await expect(page.locator("[data-tool-filter-input]")).toHaveValue(expected, { timeout: 2000 });
});
