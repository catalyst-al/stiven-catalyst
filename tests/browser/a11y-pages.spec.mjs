// Accessibility across the site (playwright.config.mjs runs this file in the two 1440 px projects, one per theme):
// axe-core with the WCAG 2.0 and 2.1 A and AA rules, every impact, plus heading order, on a set of pages that stands
// for the whole site (the home page, an essay, a reflection, a Management Review issue, the issue archive, Field
// Notes, five tools among them the CX Control Tower and the 8D report, the book and How this is made), in English,
// German and Albanian, each at a desktop and a phone width. Then the keyboard checks axe cannot make: the charts of
// the CX Control Tower and the focus under the share button on a phone.
//
// Parts of a page further down are drawn only when they come near the screen (content-visibility: auto). axe cannot
// see the colours of a part that is not drawn yet and reads them against white, so before each check every part is
// drawn as the reader will see it when they get there.
import { test, expect, expectTheme } from "./fixtures.mjs";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  "/", "/insights/the-tools-you-build-yourself/", "/reflections/architects-of-smoke/",
  "/magazine/management-review-nr-80.html", "/magazine/management-review.html", "/field-notes.html",
  "/tools/cx-control-tower/", "/tools/cv-builder/", "/tools/eight-d/", "/tools/damage-control/",
  "/tools/kpi-diagnostic/", "/books/mall-per-durresin.html", "/how-this-is-made.html",
];
const LANGS = ["", "/de", "/sq"];
const WIDTHS = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];

// What is left for the author to decide, exactly: theme, page (in every language), and for each failing node the
// width, the rule and the colours axe measured. Anything else, or any of these that changes or goes, fails the test,
// so this list is kept true. See docs/audit/2026-10-27/phase3/ci-a11y.md.
const KNOWN = [
  // The 8D report in the light theme: the "hand off" and "remove" buttons of the D7 rows are the Lumen family's gold
  // accent (#9c824a, 3.18:1) on the row's grey. A colour decision for the author (the separate commit "Lumen tools,
  // light theme: the gold accent reads at 4.5:1 or more" proposes one).
  { theme: "light", path: "/tools/eight-d/", nodes: [1440, 390].flatMap((width) => Array(10).fill(`${width} color-contrast #9c824a on #eceff0`)) },
];

const drawEverything = (page) => page.addStyleTag({ content: "* { content-visibility: visible !important; }" });

// Each failing node as { node: "rule colours", where: "rule: target colours" }: the first is compared, the second
// says where it is.
const violationsOf = async (page) => {
  await drawEverything(page);
  const wcag = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const order = await new AxeBuilder({ page }).withRules(["heading-order"]).analyze();
  return [...wcag.violations, ...order.violations].flatMap((v) => v.nodes.map((n) => {
    const data = n.any[0]?.data;
    const colours = data && data.fgColor ? ` ${data.fgColor} on ${data.bgColor}` : "";
    return { node: `${v.id}${colours}`, where: `${v.id}: ${n.target.join(" ")}${colours}` };
  }));
};

for (const lang of LANGS) {
  for (const path of PAGES) {
    const url = lang + path;
    test(`axe: ${url}`, async ({ page, theme }) => {
      test.setTimeout(90_000);
      const found = [];
      for (const viewport of WIDTHS) {
        await page.setViewportSize(viewport);
        await page.goto(url);
        await expectTheme(page, theme);
        await page.waitForLoadState("networkidle");
        for (const { node, where } of await violationsOf(page)) found.push({ node: `${viewport.width} ${node}`, where: `${viewport.width} ${where}` });
      }
      const known = KNOWN.filter((k) => k.theme === theme && k.path === path).flatMap((k) => k.nodes);
      const report = found.map((f) => f.where).sort().join("\n");
      expect(found.map((f) => f.node).sort(), `accessibility of ${url} (${theme}):\n${report}`).toEqual(known.sort());
    });
  }
}

// PM-9: the points of the Control Tower's charts are not each a tab stop. The chart is one image whose name reads
// every week's value (and which weeks are off target); the points keep their tooltip for the mouse.
test("CX Control Tower: the charts are images with a name, not a run of tab stops", async ({ page }) => {
  await page.goto("/tools/cx-control-tower/");
  const charts = page.locator(".cx-mini-chart");
  const check = async () => {
    expect(await charts.count()).toBeGreaterThan(0);
    for (const chart of await charts.all()) {
      await expect(chart).toHaveAttribute("role", "img");
      await expect(chart).toHaveAttribute("aria-label", /\d/);
    }
    expect(await page.locator(".cx-mini-chart [tabindex]").count(), "no focusable part inside a chart").toBe(0);
  };
  await check();
  // Some point of the example is off target, and the chart's name says which.
  expect((await charts.evaluateAll((list) => list.map((c) => c.getAttribute("aria-label")))).join(" ")).toMatch(/off target/);
  await page.locator("[data-cx-tabs] [role=tab]").filter({ hasText: "Deep dive" }).click();
  await check();
});

// PM-10: on a phone, a control reached with Tab is never under the share button at the bottom right, in the text or
// at the very end of the page (the footer). Tabs through each page from the top, as a keyboard reader does
// (docs/audit/2026-10-27/phase3/ci-a11y/share-overlap.cjs does the same on more pages, languages and widths).
for (const url of ["/de/magazine/management-review-nr-80.html", "/sq/insights/the-tools-you-build-yourself/", "/tools/damage-control/"]) {
  test(`phone: the share button never covers the focus on ${url}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 412, height: 800 });
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    // The focused control against the share button, with its 2 px focus ring, once any smooth scroll has ended.
    const where = () => page.evaluate(async () => {
      const check = () => {
        const a = document.activeElement;
        if (!a || a === document.body || a.closest(".share-orbit")) return "end";
        const b = document.querySelector(".share-orbit-button");
        if (b.closest(".share-orbit").classList.contains("is-resting")) return "";
        const r = a.getBoundingClientRect();
        const s = b.getBoundingClientRect();
        // A tall control (a text area, a card, a scrolling table) may run behind the planet as long as its top, where
        // the caret and the reading start, is clear of it; a link, a button or a field must be clear entirely.
        const bottom = r.height > 64 ? r.top + 24 : r.bottom;
        const overlap = r.width > 0 && r.right + 2 > s.left && r.left - 2 < s.right && bottom + 2 > s.top && r.top - 2 < s.bottom;
        return overlap ? `${a.tagName.toLowerCase()} "${(a.textContent || a.getAttribute("aria-label") || "").trim().slice(0, 40)}"` : "";
      };
      if (!check() || check() === "end") return check();
      await new Promise((done) => setTimeout(done, 700));
      return check();
    });
    const covered = [];
    for (let i = 0; i < 400; i++) {
      await page.keyboard.press("Tab");
      const found = await where();
      if (found === "end") break;
      if (found) covered.push(found);
    }
    expect(covered, "focused controls under the share button").toEqual([]);
  });
}

// A table that scrolls sideways must take the focus, or the keyboard cannot scroll it (WCAG 2.1.1; axe
// scrollable-region-focusable): the A3 report at every width, the 8D sheet on a phone.
for (const [url, width] of [["/tools/a3-report/", 1440], ["/tools/eight-d/", 390]]) {
  test(`${url} at ${width} px: every table that scrolls can take the focus`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const stuck = await page.locator(".dl-table-wrap").evaluateAll((wraps) => wraps
      .filter((w) => w.checkVisibility() && (w.scrollWidth > w.clientWidth || w.scrollHeight > w.clientHeight) && w.tabIndex < 0)
      .map((w) => w.className));
    expect(stuck).toEqual([]);
  });
}
