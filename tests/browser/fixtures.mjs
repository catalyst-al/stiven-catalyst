// What every browser test shares: nothing leaves the local server (the analytics beacon and any other outside
// address are refused, so a test neither waits on the network nor counts as a visit), the colour theme of its
// project set before the first paint (the same localStorage key the theme button writes), a page that fails the
// test on any script error, and the accessibility check.
import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const test = base.extend({
  theme: ["dark", { option: true }],
  context: async ({ context }, use) => {
    await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (route) => route.abort());
    await use(context);
  },
  page: async ({ page, theme }, use) => {
    await page.addInitScript((value) => {
      try { localStorage.setItem("sc-theme", value); } catch { /* storage unavailable */ }
    }, theme);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use(page);
    expect(errors, "no script error on any page of the journey").toEqual([]);
  },
});
export { expect };

// The page is drawn in the theme of the project.
export const expectTheme = async (page, theme) => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
};

// axe-core on the page as it is now, against WCAG 2.1 A and AA. Only serious and critical violations fail the test;
// the message names each rule and the first elements it found.
export const expectAccessible = async (page) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const grave = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const report = grave.map((v) => `${v.impact} ${v.id}: ${v.help}\n${v.nodes.slice(0, 5).map((n) => `  ${n.target.join(" ")}${n.failureSummary ? ` (${n.failureSummary.split("\n").slice(1).join(" ").trim()})` : ""}`).join("\n")}`);
  expect(report, `accessibility on ${new URL(page.url()).pathname}`).toEqual([]);
};
