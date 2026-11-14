// The unfinished forms of a file or a restore point put back (js/shift-context.js, js/work-backup.js; playwright.config.mjs
// runs this file in the 1440 px light project only). No page writes a draft yet, so the drafts are put into the browser
// with the page's own ShiftContext. Where the file and the browser hold a form for the same tool, day and shift with
// other values, the page asks before anything is changed; leaving the question changes nothing.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const NIGHT = { tool: "sc-damage-control", form: "entry", scope: "", date: "2026-11-11", index: 2, of: 3, label: "Night" };
const HERE = { stage: "Receiving", cause: "Packaging", units: "4", note: "wet box" };
const THERE = { stage: "Receiving", cause: "Equipment", units: "2", note: "damaged fork" };
const held = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((key) => key.startsWith("sc-") && !/^sc-(theme|seen-)/.test(key)).sort().map((key) => [key, localStorage.getItem(key)])));
const draft = (page) => page.evaluate((context) => window.ShiftContext.find(context)?.values ?? null, NIGHT);
const workFile = () => ({
  name: "stiven-catalyst-2026-11-11.json",
  mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify({
    format: "stiven-catalyst-work", version: 1, exported: "2026-11-11T20:00:00.000Z",
    items: {
      "sc-drafts-ui": JSON.stringify({ v: 1, drafts: [{ ...NIGHT, values: THERE, updated: 1, rev: "fromthefile00" }] }),
      "sc-damage-control": JSON.stringify({ rows: [{ date: "2026-11-10", shift: "Late", stage: "Loading", type: "Crushed", cause: "Stacking", units: 2, cost: null, note: "" }] }),
    },
  })),
});

test("a file whose unfinished form differs from the one here: asked first, Esc changes nothing, the choice is kept", async ({ page }) => {
  test.setTimeout(90_000);
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/tools.html");
  await page.evaluate(([context, values]) => {
    window.ShiftContext.setActive({ date: "2026-11-12", index: 0, of: 3, label: "Early" });
    window.ShiftContext.save(context, values);
  }, [NIGHT, HERE]);
  const before = await held(page);
  expect(Object.keys(before)).toEqual(["sc-drafts-ui", "sc-shift-ui"]);

  // Asked before anything is changed.
  await page.locator("[data-work-open]").setInputFiles(workFile());
  const question = page.locator("[data-work-drafts-dialog]");
  await expect(question).toBeVisible();
  await expect(question.locator("[data-work-drafts-list] li")).toHaveText(/2026-11-11, Night\. Here: Receiving, Packaging, 4, wet box\. In the file: Receiving, Equipment, 2, damaged fork\./);
  expect(await held(page)).toEqual(before);
  await expectAccessible(page);
  // Esc leaves the question: nothing is changed, and the page says so.
  await page.keyboard.press("Escape");
  await expect(question).toBeHidden();
  await expect(page.locator("[data-work-status]")).toHaveText(/Nothing was changed/);
  expect(await held(page)).toEqual(before);

  // The same with Cancel.
  await page.locator("[data-work-open]").setInputFiles(workFile());
  await question.locator('[data-work-drafts-choice="cancel"]').click();
  await expect(question).toBeHidden();
  expect(await held(page)).toEqual(before);

  // The forms of this browser kept: the rest of the file opens, the draft and the active shift are as they were.
  await page.locator("[data-work-open]").setInputFiles(workFile());
  await Promise.all([page.waitForEvent("load"), question.locator('[data-work-drafts-choice="mine"]').click()]);
  expect(await draft(page)).toEqual(HERE);
  expect((await held(page))["sc-damage-control"]).toContain("Stacking");
  expect((await held(page))["sc-shift-ui"]).toBe(before["sc-shift-ui"]);

  // The forms of the file taken.
  await page.locator("[data-work-open]").setInputFiles(workFile());
  await expect(question).toBeVisible();
  await Promise.all([page.waitForEvent("load"), question.locator('[data-work-drafts-choice="file"]').click()]);
  expect(await draft(page)).toEqual(THERE);
  expect((await held(page))["sc-shift-ui"]).toBe(before["sc-shift-ui"]);
});

test("a restore point whose unfinished form differs from the one here asks the same question before it changes anything", async ({ page }) => {
  test.setTimeout(90_000);
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/tools.html");
  const first = await page.evaluate(([context, values]) => window.ShiftContext.save(context, values).draft.rev, [NIGHT, HERE]);
  await page.locator("[data-sg-make]").click();
  const toggle = page.locator("[data-sg-toggle]");
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
  // The point made by hand holds the form as it is now (the page may have made a daily point of its own before it).
  const point = page.locator("[data-sg-list] li").filter({ hasText: "Made by hand" });
  await expect(point).toHaveCount(1);
  // The form goes on after the point was made.
  await page.evaluate(([context, values, base]) => window.ShiftContext.save(context, values, { base }), [NIGHT, THERE, first]);
  const before = await held(page);
  const points = await page.locator("[data-sg-list] li").count();
  const restore = point.locator(".sg-point-actions .button-secondary").first();
  const question = page.locator("[data-work-drafts-dialog]");
  await restore.click();
  await expect(question).toBeVisible();
  await question.locator('[data-work-drafts-choice="cancel"]').click();
  await expect(page.locator("[data-sg-status], [data-work-status]").filter({ hasText: /Nothing was changed/ })).toHaveCount(1);
  expect(await held(page)).toEqual(before);
  await expect(page.locator("[data-sg-list] li"), "no point of now was made: nothing was about to be replaced").toHaveCount(points);
  // The point's form taken: it is the draft now.
  await restore.click();
  await Promise.all([page.waitForEvent("load"), question.locator('[data-work-drafts-choice="file"]').click()]);
  expect(await draft(page)).toEqual(HERE);
});
