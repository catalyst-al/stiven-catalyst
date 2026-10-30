// Room Inspection → Action Tracker in a real browser (playwright.config.mjs runs this file in the 1440 px light project
// only): a maintenance fault becomes one action with the inspection's identity, the tracker shows it, a second
// inspection with the same words is a second action, and a resend after the link is lost adds nothing. Fictional rooms.
import { test, expect } from "./fixtures.mjs";

const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);

test("a maintenance fault is one action with the inspection's identity; the same words twice are two; a resend adds nothing", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/tools/room-inspection/");
  // The example opens first; our own inspection replaces it.
  const inspect = async (room, note) => {
    await page.locator("#ri-room").fill(room);
    await page.locator('input[name="ri-bathroom-5"][value="fail"]').check();
    await page.locator(".ri-item[data-qid='bathroom-5'] .ri-note").fill(note);
    await page.locator("[data-rest-pass]").click();
    await page.locator("[data-save]").click();
  };
  await inspect("412", "Shower tap drips");
  await expect(page.locator("[data-walk-status]")).toContainText("1 maintenance items added to actions");
  let state = await stored(page, "sc-room-inspection");
  const row = state.rows.find((r) => r.room === "412");
  expect(row.sent["bathroom-5"]).toBe(true);
  let actions = await stored(page, "sc-actions");
  const mine = actions.rows.filter((a) => a.source === "room-inspection");
  expect(mine).toHaveLength(1);
  expect(mine[0].id).toBe(`ri-${row.id}-bathroom-5`);
  expect(mine[0].ref).toBe(`${row.id}|bathroom-5`);
  await expect(page.locator(`tr[data-row="${row.id}"] .ri-maint`)).toHaveAttribute("data-maintenance", "1/0/0/0/0");
  // The same words on another day: a second defect, a second action.
  await page.locator("#ri-date").fill("2026-10-20");
  await inspect("412", "Shower tap drips again");
  state = await stored(page, "sc-room-inspection");
  expect(state.rows.filter((r) => r.room === "412")).toHaveLength(2);
  actions = await stored(page, "sc-actions");
  expect(actions.rows.filter((a) => a.source === "room-inspection")).toHaveLength(2);
  // The tracker lists both, from this tool.
  await page.goto("/tools/action-tracker/");
  await expect(page.locator(".at-item").filter({ hasText: "Room 412: Tap, drain and flush work" })).toHaveCount(2);
  // The link is lost (an older page, a failed write): the fault shows as not sent; the resend finds the action, adds nothing.
  await page.goto("/tools/room-inspection/");
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("sc-room-inspection")); s.rows.forEach((r) => { r.sent = {}; }); localStorage.setItem("sc-room-inspection", JSON.stringify(s)); });
  await page.reload();
  await expect(page.locator(".ri-maint.is-unsent")).toHaveCount(2);
  await page.getByRole("button", { name: /maintenance items to actions/ }).click();
  await expect(page.locator("[data-log-status]")).toContainText("2 were already in the Action Tracker");
  actions = await stored(page, "sc-actions");
  expect(actions.rows.filter((a) => a.source === "room-inspection")).toHaveLength(2);
  state = await stored(page, "sc-room-inspection");
  expect(state.rows.filter((r) => r.room === "412").every((r) => r.sent["bathroom-5"] === true)).toBe(true);
  await expect(page.locator(".ri-maint.is-unsent")).toHaveCount(0);
});
