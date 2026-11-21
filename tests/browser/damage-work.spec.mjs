// The work view of Damage Control in the browser (js/defect-work.js; docs/plan-sot-2026-11-11/PLANI.md, step 4), at
// every width and in both themes: the real journey from the Shift Handover, where the pilot is turned on and the shift
// is started, to an entry made with the keyboard, a reload in between, and an action that arrives on the Action
// Tracker. Fictional data: the example shift of the handover tool.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const prefix = (lang) => (lang === "en" ? "" : `/${lang}`);
const KEY = { en: "sc-damage-control", de: "sc-damage-control-de", sq: "sc-damage-control-sq" };
const rows = (page, lang) => page.evaluate((key) => (JSON.parse(localStorage.getItem(key)) || { rows: [] }).rows, KEY[lang]);
const drafts = (page) => page.evaluate(() => window.ShiftContext.drafts());
const noSideScroll = async (page) => expect(await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
// The shift lead turns the pilot on and starts a shift on the Handover page of their language; every question is
// answered yes.
const startShift = async (page, lang) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto(`${prefix(lang)}/tools/shift-handover/?pilot=shift-close`);
  await page.locator("[data-example]").click();
  await page.locator("[data-close]").click();
  await page.locator("[data-start-shift]").click();
  return page.evaluate(() => window.ShiftContext.active());
};

for (const lang of ["en", "de", "sq"]) {
  test(`${lang}: from the started shift to an entry by keyboard, through a reload, and on to an action`, async ({ page }) => {
    const active = await startShift(page, lang);
    await page.goto(`${prefix(lang)}/tools/damage-control/`);
    await expect(page.locator("[data-work-head]")).toBeVisible();
    await expect(page.locator('[data-entry] [name="date"]')).toBeHidden();
    await expect(page.locator('[data-entry] [name="shift"]')).toBeHidden();
    await expect(page.locator("[data-work-saved-with]")).toContainText(active.label);
    await expectAccessible(page);
    await noSideScroll(page);

    // Typed, then the page is loaded again: the form is as it was left.
    await page.locator('[data-entry] [name="note"]').fill("Cage 4, top layer");
    await page.locator('[data-entry] [name="units"]').fill("3");
    expect((await drafts(page)).map((draft) => draft.values.note)).toEqual(["Cage 4, top layer"]);
    await page.reload();
    await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Cage 4, top layer");
    await expect(page.locator('[data-entry] [name="units"]')).toHaveValue("3");
    await expect(page.locator("[data-work-clear]")).toBeVisible();

    // The keyboard alone: the stage, the cause, the units, the note, then Enter.
    await page.locator('[data-entry] [name="stage"]').focus();
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-entry] [name="cause"]')).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-entry] [name="units"]')).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-entry] [name="note"]')).toBeFocused();
    await page.keyboard.press("Enter");
    const logged = await rows(page, lang);
    expect(logged.filter((row) => row.note === "Cage 4, top layer")).toEqual([expect.objectContaining({ date: active.date, shift: active.label, units: 3, note: "Cage 4, top layer" })]);
    expect(logged.every((row) => !("id" in row))).toBe(true);
    expect(await drafts(page)).toEqual([]);
    await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("");
    await expect(page.locator('[data-entry] [name="stage"]')).toBeFocused();
    await page.reload();
    await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("");
    expect((await rows(page, lang)).filter((row) => row.note === "Cage 4, top layer")).toHaveLength(1);

    // The tabs by keyboard: one tab stop, the arrows move.
    await page.locator('[data-work-tab="work"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('[data-work-tab="learn"]')).toBeFocused();
    await expect(page.locator(".tool-aside")).toBeVisible();
    await expect(page.locator("[data-entry]")).toBeHidden();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#dl-paste")).toBeAttached();
    await expect(page.locator("[data-csv]")).toBeVisible();
    await expectAccessible(page);
    await noSideScroll(page);
    await page.keyboard.press("Home");
    await expect(page.locator("[data-entry]")).toBeVisible();

    // A filter, then the action for it: it arrives on the Action Tracker with where it came from.
    await page.locator(".dw-focus [data-focus-key^='pick:cause:']").first().click();
    await expect(page.locator("[data-work-filter]")).toBeVisible();
    await expect(page.locator('[data-work-exit="action"]')).toHaveClass(/dw-rec/);
    await expectAccessible(page);
    await noSideScroll(page);
    await page.locator('[data-work-exit="action"]').click();
    await expect(page).toHaveURL(/\/tools\/action-tracker\/$/);
    // The tracker takes the note and cleans the address; the action is on the list with its origin.
    await expect.poll(() => page.evaluate(() => (JSON.parse(localStorage.getItem("sc-actions")) || { rows: [] }).rows.length)).toBe(1);
    const [action] = await page.evaluate(() => JSON.parse(localStorage.getItem("sc-actions")).rows);
    expect(action.source).toBe("damage-control");
    expect(action.origin).toEqual(expect.objectContaining({ v: 1, tool: "damage-control", lang, kind: "filter" }));
    expect(action.origin.filter.field).toBe("cause");
  });
}

test("two shifts with unfinished forms: the closed shift offers no return, nothing is written over, and the form is brought only once this one is clean", async ({ page }) => {
  await startShift(page, "en");
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  await page.locator('[data-entry] [name="note"]').fill("Left in the first shift");
  // That shift is closed with its form unfinished, and the next one is started.
  await page.goto("/tools/shift-handover/");
  await page.locator("[data-close]").click();
  await page.locator("[data-start-shift]").click();
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  const note = page.locator("[data-work-draft]");
  await expect(note).toHaveCount(1);
  await expect(note).toContainText("Left in the first shift");
  await expect(note).toContainText("That shift is closed");
  await expect(note.locator("[data-work-back]")).toHaveCount(0);
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("");
  // This shift types its own: "Bring" goes, and both stay through a reload.
  await page.locator('[data-entry] [name="note"]').fill("Of the second shift");
  await expect(note.locator("[data-work-bring]")).toHaveCount(0);
  await expect(note.locator("[data-work-blocked]")).toBeVisible();
  await expectAccessible(page);
  await page.reload();
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Of the second shift");
  expect((await drafts(page)).map((draft) => draft.values.note).sort()).toEqual(["Left in the first shift", "Of the second shift"]);
  // Entered, this form is clean, and the other one can be brought here.
  await page.locator('[data-entry] [type="submit"]').click();
  await page.locator("[data-work-bring]").click();
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Left in the first shift");
  await expect(note).toHaveCount(0);
  expect(await drafts(page)).toHaveLength(1);
  await page.locator('[data-entry] [type="submit"]').click();
  expect(await drafts(page)).toEqual([]);
  expect((await rows(page, "en")).map((row) => row.note).filter(Boolean).sort()).toEqual(["Left in the first shift", "Of the second shift"]);
});

test("the entry is stored and its draft cannot be cleared: after a real reload the form is clean, the page says the entry is in the log, and no second row is added", async ({ page }) => {
  const active = await startShift(page, "en");
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  await page.locator('[data-entry] [name="note"]').fill("Pallet 7");
  await page.locator('[data-entry] [name="units"]').fill("2");
  // From here the browser refuses to remove the drafts, on this page and after a reload, until the test lifts it.
  await page.addInitScript(() => {
    if (sessionStorage.getItem("thawed")) return;
    const real = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (name) { if (name === "sc-drafts-ui") throw new DOMException("blocked", "InvalidStateError"); return real.call(this, name); };
  });
  await page.evaluate(() => {
    const real = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (name) { if (name === "sc-drafts-ui") throw new DOMException("blocked", "InvalidStateError"); return real.call(this, name); };
  });
  await page.locator('[data-entry] [type="submit"]').click();
  const pallets = async () => (await rows(page, "en")).filter((row) => row.note === "Pallet 7");
  expect(await pallets()).toEqual([expect.objectContaining({ date: active.date, shift: active.label, units: 2 })]);
  await expect(page.locator("[data-entry-status]")).toContainText("A copy of the form could not be cleared");
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("");
  await expect(page.locator("[data-work-entered]")).toContainText("Already in the log");
  await expect(page.locator("[data-work-entered]")).toContainText("Pallet 7");
  await expect(page.locator("[data-work-draft]")).toHaveCount(0);
  await expectAccessible(page);
  await page.reload();
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("");
  await expect(page.locator('[data-entry] [name="units"]')).toHaveValue("1");
  await expect(page.locator("[data-work-saved-with]")).not.toContainText("Unfinished form");
  await expect(page.locator("[data-work-entered]")).toHaveCount(1);
  expect(await pallets()).toHaveLength(1);
  // The same fields typed again are a second, real entry.
  await page.locator('[data-entry] [name="note"]').fill("Pallet 7");
  await page.locator('[data-entry] [name="units"]').fill("2");
  await expect(page.locator("[data-work-entered]")).toHaveCount(0);
  await page.locator('[data-entry] [type="submit"]').click();
  expect(await pallets()).toHaveLength(2);
  // The storage works again: the page clears what is left by itself.
  await page.evaluate(() => sessionStorage.setItem("thawed", "1"));
  await page.reload();
  await expect(page.locator("[data-work-entered]")).toHaveCount(0);
  expect(await drafts(page)).toEqual([]);
  expect(await pallets()).toHaveLength(2);
});

test("a form that cannot be confirmed as stored: the page says so, enters nothing through reloads, and the form is put back whole when the visitor asks", async ({ page }) => {
  const active = await startShift(page, "en");
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  await page.locator('[data-entry] [name="note"]').fill("Pallet 7");
  await page.locator('[data-entry] [name="units"]').fill("2");
  // As after an entry that failed with its mark left behind, and a row with the same fields that came by team sync:
  // the draft carries the mark "0 such rows", and the log has one. Written from another page, as sync or another tab
  // would (the open form would write its own draft again as it is left).
  await page.goto("/tools/shift-handover/");
  await page.evaluate(({ date, label }) => {
    const drafts = JSON.parse(localStorage.getItem("sc-drafts-ui"));
    drafts.drafts[0].values.entering = "0";
    localStorage.setItem("sc-drafts-ui", JSON.stringify(drafts));
    const log = JSON.parse(localStorage.getItem("sc-damage-control")) || { rows: [] };
    log.rows = [{ date, shift: label, stage: drafts.drafts[0].values.stage, type: "Not recorded", cause: drafts.drafts[0].values.cause, units: 2, cost: null, note: "Pallet 7" }];
    localStorage.setItem("sc-damage-control", JSON.stringify(log));
  }, active);
  const pallets = async () => (await rows(page, "en")).filter((row) => row.note === "Pallet 7").length;
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeVisible();
  for (let visit = 0; visit < 2; visit += 1) {
    if (visit) await page.reload();
    await expect(page.locator("[data-work-unconfirmed]")).toContainText("It cannot be confirmed that this form was stored.");
    await expect(page.locator("[data-work-unconfirmed]")).toContainText("Pallet 7");
    await expect(page.locator("[data-work-entered]")).toHaveCount(0);
    await expect(page.locator('[data-entry] [name="note"]')).toBeDisabled();
    await expect(page.locator('[data-entry] [type="submit"]')).toBeDisabled();
    await expect(page.locator("[data-log] tr")).toHaveCount(1);
    expect(await pallets()).toBe(1);
  }
  await expectAccessible(page);
  await noSideScroll(page);
  // By keyboard: the first decision is reached and taken with Enter.
  await page.locator('[data-work-held="back"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Pallet 7");
  await expect(page.locator('[data-entry] [name="units"]')).toHaveValue("2");
  await expect(page.locator('[data-entry] [name="note"]')).toBeEnabled();
  await expect(page.locator("[data-work-unconfirmed]")).toHaveCount(0);
  expect(await pallets()).toBe(1);
  await page.reload();
  await expect(page.locator('[data-entry] [name="note"]')).toHaveValue("Pallet 7");
  expect(await pallets()).toBe(1);
  await page.locator('[data-entry] [type="submit"]').click();
  expect(await pallets()).toBe(2);
  expect(await drafts(page)).toEqual([]);
});

test("without the pilot the page is the page it always was", async ({ page }) => {
  await page.goto("/tools/damage-control/");
  await expect(page.locator("[data-work-head]")).toBeHidden();
  await expect(page.locator('[data-entry] [name="date"]')).toBeVisible();
  await expect(page.locator('[data-entry] [name="shift"]')).toBeVisible();
  await expect(page.locator(".tool-aside")).toBeVisible();
  await expect(page.locator(".dw-focus")).toHaveCount(0);
  await page.locator('[data-entry] [type="submit"]').click();
  expect(await page.evaluate(() => localStorage.getItem("sc-drafts-ui"))).toBeNull();
});
