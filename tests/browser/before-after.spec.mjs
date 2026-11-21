// Before and after an action, in the browser (js/defect-source.js; docs/plan-sot-2026-11-11/PLANI.md, step 7), at
// every width and in both themes: the action is made from the damage log, marked done on the Action Tracker with the
// list's own control on a given day, and its source is opened a week later. The days are set by the browser's clock.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const prefix = (lang) => (lang === "en" ? "" : `/${lang}`);
const KEY = { en: "sc-damage-control", de: "sc-damage-control-de", sq: "sc-damage-control-sq" };
const day = (n, time = "12:00:00") => new Date(`2026-11-${String(n).padStart(2, "0")}T${time}`);
const iso = (n) => `2026-11-${String(n).padStart(2, "0")}`;
const noSideScroll = async (page) => expect(await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
// The log as the page keeps it, with the words of the page's own lists: rows of [day, units], volumes of [day, volume].
const writeLog = (page, lang, rows, volumes) => page.evaluate(({ key, rows, volumes }) => {
  const data = JSON.parse(document.getElementById("defect-log-data").textContent);
  const option = (name, index) => data.fields.find((field) => field.name === name).options[index];
  localStorage.setItem(key, JSON.stringify({
    rows: rows.map(([date, units]) => ({ date, shift: option("shift", 1), stage: option("stage", 4), type: option("type", 0), cause: option("cause", 0), units, cost: null, note: "" })),
    volumes: volumes.map(([date, volume]) => ({ date, volume })),
  }));
}, { key: KEY[lang], rows, volumes });

for (const lang of ["en", "de", "sq"]) {
  test(`${lang}: an action is marked done on the list, and a week later its source sets the days before beside the days after`, async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept());
    // 9 November: the week the problem was seen in is in the log, and the action for it is made.
    await page.clock.setFixedTime(day(9));
    await page.goto(`${prefix(lang)}/tools/damage-control/`);
    await writeLog(page, lang, [[iso(3), 4], [iso(5), 6], [iso(9), 4]], [[iso(3), 2000], [iso(5), 2000], [iso(9), 2000]]);
    await page.reload();
    await page.locator('.result-actions a[href*="action-tracker"]').first().click();
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/action-tracker/$`));
    await expect(page.locator("[data-open-source]")).toHaveCount(0);
    // The page as it always was sends no origin: the action for the period is made from the pilot's view.
    await page.evaluate(() => localStorage.setItem("sc-shift-close-ui", JSON.stringify({ v: 1, on: true, set: 1 })));
    await page.evaluate(() => localStorage.removeItem("sc-actions"));
    await page.goto(`${prefix(lang)}/tools/damage-control/`);
    await expect(page.locator("[data-work-head]")).toBeVisible();
    await page.locator('[data-work-exit="action"]').click();
    await expect(page.locator("[data-open-source]")).toHaveCount(1);
    const id = await page.locator("[data-open-source]").getAttribute("data-open-source");
    await expect(page.locator(".at-source")).not.toContainText(/before and after|Vorher und Nachher|para dhe pas/);
    // 10 November: the countermeasure is in place, and the action is marked done with the list's own control.
    await page.clock.setFixedTime(day(10));
    await page.reload();
    await page.locator(".at-status select").first().selectOption("done");
    const action = await page.evaluate((wanted) => JSON.parse(localStorage.getItem("sc-actions")).rows.find((item) => item.id === wanted), id);
    expect([action.status, action.closed]).toEqual(["done", iso(10)]);
    // 18 November: the log has the day of the action and the week after it.
    await page.clock.setFixedTime(day(18));
    await page.goto(`${prefix(lang)}/tools/damage-control/`);
    await writeLog(page, lang, [[iso(3), 4], [iso(5), 6], [iso(9), 4], [iso(10), 50], [iso(12), 2], [iso(15), 4]], [[iso(3), 2000], [iso(5), 2000], [iso(9), 2000], [iso(10), 2000], [iso(11), 1500], [iso(12), 1500], [iso(15), 1500], [iso(17), 1500]]);
    const before = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)])));
    await page.goto(`${prefix(lang)}/tools/action-tracker/`);
    const link = page.locator(`[data-open-source="${id}"]`);
    if (await link.count()) {
      await expect(page.locator(".at-source").first()).toContainText(/with before and after|mit Vorher und Nachher|me para dhe pas/);
      await link.focus();
      await page.keyboard.press("Enter");
    } else await page.goto(`${prefix(lang)}/tools/damage-control/?source=${id}`);
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/damage-control/\\?source=${id}$`));
    const box = page.locator("[data-source-compare]");
    await expect(box).toHaveAttribute("data-source-compare", "ok");
    const cells = (name) => page.locator(`[data-source-period="${name}"] td`).allTextContents();
    expect((await cells("before"))[1]).toBe("14");
    expect((await cells("after"))[1]).toBe("6");
    expect((await cells("before"))[2].replace(/\D/g, "")).toBe("6000");
    expect((await cells("after"))[2].replace(/\D/g, "")).toBe("6000");
    expect((await cells("before"))[3].replace(/\s/g, "").replace(",", ".")).toBe("0.23%");
    expect((await cells("after"))[3].replace(/\s/g, "").replace(",", ".")).toBe("0.10%");
    await expect(page.locator("[data-source-measured]")).toHaveAttribute("data-source-measured", "rate");
    await expectAccessible(page);
    await noSideScroll(page);
    // The table can be reached and scrolled by keyboard, and nothing was written or decided for the visitor.
    await page.locator(".dw-compare .dl-table-wrap").focus();
    await expect(page.locator(".dw-compare .dl-table-wrap")).toBeFocused();
    expect(await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)])))).toEqual(before);
  });
}
