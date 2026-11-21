// "Open the source" of an action, in the browser (js/defect-source.js, js/action-tracker.js; docs/plan-sot-2026-11-11/
// PLANI.md, step 5), at every width and in both themes: an entry is made on Damage Control, becomes an action on the
// Action Tracker by a real click, and the tracker's link is followed back to the log. Fictional data.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const prefix = (lang) => (lang === "en" ? "" : `/${lang}`);
const KEY = { en: "sc-damage-control", de: "sc-damage-control-de", sq: "sc-damage-control-sq" };
const everything = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)])));
const noSideScroll = async (page) => expect(await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
const startShift = async (page, lang) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto(`${prefix(lang)}/tools/shift-handover/?pilot=shift-close`);
  await page.locator("[data-example]").click();
  await page.locator("[data-close]").click();
  await page.locator("[data-start-shift]").click();
};

for (const lang of ["en", "de", "sq"]) {
  test(`${lang}: an entry becomes an action, and the action opens its source in the log: the row, read only`, async ({ page }) => {
    await startShift(page, lang);
    await page.goto(`${prefix(lang)}/tools/damage-control/`);
    await expect(page.locator("[data-work-head]")).toBeVisible();
    await page.locator('[data-entry] [name="note"]').fill("Cage 4");
    await page.locator('[data-entry] [type="submit"]').click();
    await page.locator('[data-entry] [name="note"]').fill("Half typed");
    // The entry's own "Action": on to the tracker, where it is listed with "Open the source".
    await page.locator("[data-log] .dw-row-action").first().click();
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/action-tracker/$`));
    const link = page.locator("[data-open-source]");
    await expect(link).toHaveCount(1);
    const id = await link.getAttribute("data-open-source");
    expect(new URL(await link.evaluate((node) => node.href)).search).toBe(`?source=${id}`);
    await expectAccessible(page);
    const before = await everything(page);
    // By keyboard: the link is reached and followed with Enter.
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/damage-control/\\?source=${id}$`));
    const note = page.locator("[data-source-note]");
    await expect(note).toBeVisible();
    await expect(note.locator(".dl-warning")).toHaveCount(0);
    await expect(page.locator("[data-log] tr")).toHaveCount(1);
    await expect(page.locator("[data-log] tr")).toContainText("Cage 4");
    await expect(page.locator(".ci-log-filter .ci-chip")).toBeVisible();
    // The unfinished form is still in the form, and nothing the browser holds was changed.
    await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Half typed");
    expect(await everything(page)).toEqual(before);
    await expectAccessible(page);
    await noSideScroll(page);
    // A reload shows the same source; leaving it cleans the address and writes nothing.
    await page.reload();
    await expect(note).toBeVisible();
    await page.locator("[data-source-leave]").focus();
    await page.keyboard.press("Enter");
    await expect(note).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/damage-control/$`));
    expect(await everything(page)).toEqual(before);
  });
}

test("a period and a filter open as they were stored; an action without an origin has no link; another device is told the source is not there", async ({ page, browser }) => {
  await startShift(page, "en");
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  for (const text of ["First", "Second"]) {
    await page.locator('[data-entry] [name="note"]').fill(text);
    await page.locator('[data-entry] [type="submit"]').click();
  }
  // The filter, then the action for it.
  await page.locator(".dw-focus [data-focus-key^='pick:cause:']").first().click();
  await page.locator('[data-work-exit="action"]').click();
  await expect(page.locator("[data-open-source]")).toHaveCount(1);
  // An action from before sources were kept is listed without the link.
  await page.evaluate(() => {
    const list = JSON.parse(localStorage.getItem("sc-actions"));
    list.rows.push({ id: "a-old1", title: "From before", source: "damage-control", status: "open", priority: "Medium", created: "2026-10-01" });
    localStorage.setItem("sc-actions", JSON.stringify(list));
  });
  await page.reload();
  await expect(page.locator(".at-title")).toHaveCount(2);
  await expect(page.locator("[data-open-source]")).toHaveCount(1);
  const href = await page.locator("[data-open-source]").evaluate((node) => node.href);
  const actions = await page.evaluate(() => localStorage.getItem("sc-actions"));
  await page.locator("[data-open-source]").click();
  await expect(page.locator("[data-source-note]")).toBeVisible();
  await expect(page.locator("[data-work-filter]")).toBeVisible();
  await expect(page.locator("[data-source-note] .dl-warning")).toHaveCount(0);
  await page.goto("/tools/damage-control/?source=a-old1");
  await expect(page.locator("[data-source-note] .dl-warning")).toContainText("does not say where in the log it came from");
  await expectAccessible(page);
  // Another device: the action list arrived there (team sync or a file), the log did not.
  const context = await browser.newContext({ viewport: page.viewportSize() });
  const other = await context.newPage();
  await other.goto("/tools/action-tracker/");
  await other.evaluate((list) => localStorage.setItem("sc-actions", list), actions);
  await other.goto(href);
  await expect(other.locator("[data-source-note] .dl-warning")).toContainText("The source is not found on this device.");
  await expect(other.locator("[data-source-note]")).toContainText("its example, not your log");
  expect(await other.evaluate(() => localStorage.getItem("sc-shift-close-ui"))).toBeNull();
  await context.close();
});
