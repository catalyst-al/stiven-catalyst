// The unfinished forms of a file or a restore point put back (js/shift-context.js, js/work-backup.js; playwright.config.mjs
// runs this file in the 1440 px light project only). No page writes a draft yet, so the drafts are put into the browser
// with the page's own ShiftContext. Where the file and the browser hold a form for the same tool, day and shift with
// other values, the page asks before anything is changed; leaving the question changes nothing.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const NIGHT = { tool: "sc-damage-control", form: "entry", scope: "", date: "2026-11-11", index: 2, of: 3, label: "Night", list: "en" };
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
    window.ShiftContext.setActive({ date: "2026-11-12", index: 0, of: 3, label: "Early", list: "en" });
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

// The PIN of a shared computer (js/work-lock.js), through the page's own controls: the active shift, the drafts and
// the copy kept aside of drafts that could not be read are locked away with the rest of the work, are not there while
// the tools are locked, and come back whole. The file saved afterwards holds the drafts and the copy, not the active
// shift, and opens in an empty browser by the rules of docs/DATA-FORMATS.md.
test("drafts through the PIN lock and back, then into a saved file and out of it in an empty browser", async ({ page }) => {
  test.setTimeout(120_000);
  page.on("dialog", (dialog) => dialog.accept());
  const KEYS = ["sc-shift-ui", "sc-drafts-ui", "sc-drafts-unreadable-ui"];
  const three = () => page.evaluate((keys) => Object.fromEntries(keys.map((key) => [key, localStorage.getItem(key)])), KEYS);
  const EARLY = { ...NIGHT, date: "2026-11-12", index: 0, label: "Early" };
  const DAMAGED = '{"v":1,"drafts":[{"tool":"sc-damage-control","form":"ent';
  const PIN = "246810";

  await page.goto("/tools/damage-control/");
  // A list of drafts that cannot be read is found first and kept aside; then the work of two shifts.
  await page.evaluate(([damaged, night, early, here, there]) => {
    localStorage.setItem("sc-drafts-ui", damaged);
    window.ShiftContext.drafts();
    window.ShiftContext.setActive({ date: "2026-11-11", index: 2, of: 3, label: "Night", list: "en" });
    window.ShiftContext.save(night, here);
    window.ShiftContext.save(early, there);
  }, [DAMAGED, NIGHT, EARLY, HERE, THERE]);
  const before = await three();
  expect(before["sc-drafts-unreadable-ui"]).toBe(DAMAGED);
  expect(JSON.parse(before["sc-drafts-ui"]).drafts).toHaveLength(2);
  const drafts = await page.evaluate(() => window.ShiftContext.drafts());

  // Lock with the PIN, with the page's own form.
  await page.locator("[data-wl-lock]").click();
  const setup = page.locator("[data-wl-setup]");
  await setup.locator("[name=pin]").fill(PIN);
  await setup.locator("[name=again]").fill(PIN);
  await Promise.all([page.waitForEvent("load"), setup.locator("button[type=submit]").click()]);
  const lockDialog = page.locator("[data-work-lock-dialog]");
  // Locked, and again after a reload: none of the three is in the browser's plain storage, and nothing can be written.
  for (const again of [false, true]) {
    if (again) await page.reload();
    await expect(lockDialog).toBeVisible();
    expect(await three()).toEqual({ "sc-shift-ui": null, "sc-drafts-ui": null, "sc-drafts-unreadable-ui": null });
    expect(await page.evaluate(([night, here]) => ({
      active: window.ShiftContext.active(), drafts: window.ShiftContext.drafts().length,
      save: window.ShiftContext.save(night, here).reason,
      set: window.ShiftContext.setActive({ date: "2026-11-11", index: 2, of: 3, label: "Night", list: "en" }).reason,
    }), [NIGHT, HERE])).toEqual({ active: null, drafts: 0, save: "locked", set: "locked" });
    expect(await three()).toEqual({ "sc-shift-ui": null, "sc-drafts-ui": null, "sc-drafts-unreadable-ui": null });
  }
  // A wrong PIN opens nothing.
  await lockDialog.locator("[name=pin]").fill("135791");
  await lockDialog.locator("button[type=submit]").click();
  await expect(lockDialog.locator("[data-wl-error]")).not.toBeEmpty();
  expect(await three()).toEqual({ "sc-shift-ui": null, "sc-drafts-ui": null, "sc-drafts-unreadable-ui": null });

  // The PIN brings back all three, to the byte: every draft with its values and its rev, the copy aside, the shift.
  await lockDialog.locator("[name=pin]").fill(PIN);
  await Promise.all([page.waitForEvent("load"), lockDialog.locator("button[type=submit]").click()]);
  await expect(lockDialog).toBeHidden();
  expect(await three()).toEqual(before);
  expect(await page.evaluate(() => window.ShiftContext.drafts())).toEqual(drafts);
  expect(await page.evaluate(() => window.ShiftContext.activeOn(["Early", "Late", "Night"], "en"))).toMatchObject({ ok: true, index: 2, label: "Night" });

  // The saved file: the drafts and the copy aside as they are, and no active shift.
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-work-save]").click()]);
  const path = await download.path();
  const { readFile } = await import("node:fs/promises");
  const file = JSON.parse(await readFile(path, "utf8"));
  expect(file.items["sc-drafts-ui"]).toBe(before["sc-drafts-ui"]);
  expect(file.items["sc-drafts-unreadable-ui"]).toBe(DAMAGED);
  expect(Object.keys(file.items)).not.toContain("sc-shift-ui");

  // An empty browser opens it: the drafts are there with their values, the copy aside too, and no shift is active.
  await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("sc-") && key !== "sc-theme").forEach((key) => localStorage.removeItem(key)));
  await page.reload();
  expect(await page.evaluate(() => window.ShiftContext.drafts().length)).toBe(0);
  await Promise.all([page.waitForEvent("load"), page.locator("[data-work-open]").setInputFiles(path)]);
  await expect(page.locator("[data-work-drafts-dialog]")).toBeHidden();
  const restored = await page.evaluate(() => window.ShiftContext.drafts());
  const values = (list) => list.map((draft) => [draft.date, draft.index, draft.label, draft.list, draft.values]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  expect(values(restored)).toEqual(values(drafts));
  const after = await three();
  expect(after["sc-drafts-unreadable-ui"]).toBe(DAMAGED);
  expect(after["sc-shift-ui"]).toBeNull();

  // Opened again where a copy aside is already kept and the drafts are the same: nothing is asked, the copy here stays.
  await page.evaluate(() => localStorage.setItem("sc-drafts-unreadable-ui", "the copy this browser keeps"));
  const kept = await page.evaluate(() => window.ShiftContext.drafts());
  await Promise.all([page.waitForEvent("load"), page.locator("[data-work-open]").setInputFiles(path)]);
  expect((await three())["sc-drafts-unreadable-ui"]).toBe("the copy this browser keeps");
  expect(await page.evaluate(() => window.ShiftContext.drafts())).toEqual(kept);
  expect((await three())["sc-shift-ui"]).toBeNull();
});
