// The charts of the publications on a phone (audit E-07): no label, figure or key runs past the edge of its chart.
// The pages are the 61 where the audit of 27 October 2026 found 105 cut texts at 390 px (for example German No. 45,
// "Arbeiteten 2+ Stunden zwischen 22 und 5 Uhr, mindestens monatlich", cut before "monatlich"). Run in the phone
// projects only (playwright.config.mjs); docs/audit/2026-10-27/phase3/charts/clip.cjs checks all 285 pages.
import { test, expect } from "./fixtures.mjs";

const PAGES = {
  "en": [
    "/magazine/management-review-nr-03.html",
    "/magazine/management-review-nr-10.html",
    "/magazine/management-review-nr-12.html",
    "/magazine/management-review-nr-24.html",
    "/magazine/management-review-nr-45.html",
    "/magazine/management-review-nr-49.html",
    "/magazine/management-review-nr-51.html",
    "/magazine/management-review-nr-56.html",
    "/magazine/management-review-nr-57.html",
    "/magazine/management-review-nr-58.html",
    "/magazine/management-review-nr-59.html",
    "/magazine/management-review-nr-62.html",
    "/magazine/management-review-nr-80.html",
    "/magazine/nga-terreni-02.html",
    "/magazine/operational-treatise-vol-02.html",
    "/magazine/operational-treatise-vol-05.html",
    "/magazine/operational-treatise-vol-06.html",
    "/magazine/operational-treatise-vol-08.html"
  ],
  "de": [
    "/de/magazine/management-review-nr-03.html",
    "/de/magazine/management-review-nr-06.html",
    "/de/magazine/management-review-nr-08.html",
    "/de/magazine/management-review-nr-10.html",
    "/de/magazine/management-review-nr-12.html",
    "/de/magazine/management-review-nr-24.html",
    "/de/magazine/management-review-nr-31.html",
    "/de/magazine/management-review-nr-45.html",
    "/de/magazine/management-review-nr-51.html",
    "/de/magazine/management-review-nr-56.html",
    "/de/magazine/management-review-nr-57.html",
    "/de/magazine/management-review-nr-58.html",
    "/de/magazine/management-review-nr-59.html",
    "/de/magazine/management-review-nr-62.html",
    "/de/magazine/management-review-nr-77.html",
    "/de/magazine/management-review-nr-80.html",
    "/de/magazine/nga-terreni-01.html",
    "/de/magazine/nga-terreni-02.html",
    "/de/magazine/operational-treatise-vol-02.html",
    "/de/magazine/operational-treatise-vol-03.html",
    "/de/magazine/operational-treatise-vol-05.html",
    "/de/magazine/operational-treatise-vol-06.html",
    "/de/magazine/operational-treatise-vol-08.html"
  ],
  "sq": [
    "/sq/magazine/management-review-nr-03.html",
    "/sq/magazine/management-review-nr-08.html",
    "/sq/magazine/management-review-nr-10.html",
    "/sq/magazine/management-review-nr-12.html",
    "/sq/magazine/management-review-nr-24.html",
    "/sq/magazine/management-review-nr-45.html",
    "/sq/magazine/management-review-nr-56.html",
    "/sq/magazine/management-review-nr-58.html",
    "/sq/magazine/management-review-nr-62.html",
    "/sq/magazine/management-review-nr-65.html",
    "/sq/magazine/management-review-nr-77.html",
    "/sq/magazine/management-review-nr-80.html",
    "/sq/magazine/nga-terreni-01.html",
    "/sq/magazine/nga-terreni-02.html",
    "/sq/magazine/operational-treatise-vol-02.html",
    "/sq/magazine/operational-treatise-vol-03.html",
    "/sq/magazine/operational-treatise-vol-05.html",
    "/sq/magazine/operational-treatise-vol-06.html",
    "/sq/magazine/operational-treatise-vol-08.html",
    "/sq/magazine/operational-treatise-vol-13.html"
  ]
};

for (const [lang, paths] of Object.entries(PAGES)) {
  test(`publication charts on a phone (${lang}): no text past the edge`, async ({ page }) => {
    test.setTimeout(120_000);
    const cut = [];
    for (const path of paths) {
      await page.goto(path);
      const found = await page.evaluate(() => {
        const out = [];
        for (const svg of document.querySelectorAll("svg.wk-svg")) {
          const box = svg.getBoundingClientRect();
          if (!box.width) continue;
          for (const text of svg.querySelectorAll("text")) {
            const r = text.getBoundingClientRect();
            if (r.right > box.right + 1 || r.left < box.left - 1) out.push(text.textContent.slice(0, 70));
          }
        }
        return out;
      });
      cut.push(...found.map((text) => `${path}: ${text}`));
    }
    expect(cut).toEqual([]);
  });
}
