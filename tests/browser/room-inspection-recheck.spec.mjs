// Room Inspection → Action Tracker → done → re-inspection → verified, in a real browser (playwright.config.mjs runs
// this file in the 1440 px light project only). A maintenance fault becomes an action; the tracker marks it done and
// cannot mark it verified by hand; "Reinspect" opens a re-inspection of that inspection with nothing marked pass; the
// tap passes; the action is verified with the re-inspection as its proof, shown in the tracker. Then the German and
// Albanian pages carry the same flow in their own words. Fictional rooms.
import { test, expect } from "./fixtures.mjs";

const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
const TAP = "Tap, drain and flush work, nothing drips";

test("a done maintenance action is verified by a re-inspection that sees the item pass, and by nothing else", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/tools/room-inspection/");
  // The example opens first; our own inspection replaces it.
  await page.locator("#ri-room").fill("412");
  await page.locator('input[name="ri-bathroom-5"][value="fail"]').check();
  await page.locator(".ri-item[data-qid='bathroom-5'] .ri-note").fill("Shower tap drips");
  await page.locator("[data-rest-pass]").click();
  await page.locator("[data-save]").click();
  await expect(page.locator("[data-walk-status]")).toContainText("1 maintenance items added to actions");
  const row = (await stored(page, "sc-room-inspection")).rows.find((r) => r.room === "412");
  const id = `ri-${row.id}-bathroom-5`;
  // The tracker: the action is open; Verified is not for the hand; done is.
  await page.goto("/tools/action-tracker/");
  const item = page.locator(`.at-item[data-id="${id}"]`);
  await expect(item).toBeVisible();
  await expect(item.locator(".at-status select option[value='verified']")).toBeDisabled();
  await expect(item).toContainText("Verified by a re-inspection of the room, once the fix is checked there.");
  await item.locator(".at-status select").selectOption("done");
  await page.locator("[data-status-filter] button[data-status='done']").click();
  await expect(item.locator(".at-status select")).toHaveValue("done");
  // Back in Room Inspection: the log shows the defect done and offers Reinspect.
  await page.goto("/tools/room-inspection/");
  const tr = page.locator(`tr[data-row="${row.id}"]`);
  await expect(tr.locator(".ri-maint")).toHaveAttribute("data-maintenance", "0/1/0/0/0");
  await tr.locator("[data-reinspect]").click();
  await expect(page.locator("#ri-room")).toHaveValue("412");
  await expect(page.locator("#ri-room")).toBeDisabled();
  await expect(page.locator("#ri-kind")).toHaveValue("recheck");
  await expect(page.locator("[data-recheck-note]")).toContainText("Re-inspection of room 412");
  await expect(page.locator("[data-recheck-note]")).toContainText(`1 maintenance defect to check: ${TAP}`);
  await expect(page.locator(".ri-item input[data-answer]:checked")).toHaveCount(0);
  await expect(page.locator("[data-save]")).toBeDisabled();
  const toVerify = page.locator(".ri-item.is-to-verify");
  await expect(toVerify).toHaveCount(1);
  await expect(toVerify).toHaveAttribute("data-qid", "bathroom-5");
  await expect(toVerify.locator(".ri-verify-tag")).toContainText("Maintenance done: pass verifies it, fail reopens it");
  // The tap passes: saved, verified, with the proof.
  await page.locator('input[name="ri-bathroom-5"][value="pass"]').check();
  await page.locator("[data-save]").click();
  await expect(page.locator("[data-walk-status]")).toContainText("1 defects verified in the Action Tracker, with this re-inspection as the proof");
  const state = await stored(page, "sc-room-inspection");
  const re = state.rows.find((r) => r.kind === "recheck");
  expect(re.recheckOf).toBe(row.id);
  expect(re.answers).toEqual({ "bathroom-5": "pass" });
  const actions = (await stored(page, "sc-actions")).rows.filter((a) => a.source === "room-inspection");
  expect(actions).toHaveLength(1);
  expect(actions[0].status).toBe("verified");
  expect(actions[0].proof).toMatchObject({ recheck: re.id, qid: "bathroom-5", item: TAP, answer: "pass" });
  await expect(tr.locator(".ri-maint")).toHaveAttribute("data-maintenance", "0/0/1/0/0");
  await expect(page.locator(`tr[data-row="${re.id}"] .ri-recheck`)).toHaveAttribute("data-recheck", "1/0/0/0");
  await expect(page.locator("#ri-kind")).toHaveValue("checkout");
  await expect(page.locator("[data-recheck-note]")).toBeHidden();
  // The first-time pass figure did not move: one first inspection, as before the re-inspection.
  await expect(page.locator(".ri-stats")).toContainText("of 1 rooms passed at the first inspection");
  // The tracker shows the proof.
  await page.goto("/tools/action-tracker/");
  await page.locator("[data-status-filter] button[data-status='verified']").click();
  await expect(item.locator(".at-status select")).toHaveValue("verified");
  await expect(item.locator(".at-proof")).toContainText(`Checked in the room on`);
  await expect(item.locator(".at-proof")).toContainText(`${TAP} passes.`);
  await expect(item).toContainText("Verified by the re-inspection of room 412");
});

for (const [lang, words] of [
  ["de", { added: "Maßnahmen", button: "Nachkontrolle", note: "Nachkontrolle Zimmer 412", verified: "1 Mängel im Maßnahmen-Tracker geprüft", proof: "Im Zimmer geprüft am" }],
  ["sq", { added: "veprime", button: "Riinspekto", note: "Riinspektim i dhomës 412", verified: "1 defekte të verifikuara", proof: "Kontrolluar në dhomë më" }],
]) {
  test(`${lang}: the re-inspection in the page's language`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto(`/${lang}/tools/room-inspection/`);
    await page.locator("#ri-room").fill("412");
    await page.locator('input[name="ri-bathroom-5"][value="fail"]').check();
    await page.locator("[data-rest-pass]").click();
    await page.locator("[data-save]").click();
    await expect(page.locator("[data-walk-status]")).toContainText(words.added);
    const key = `sc-room-inspection-${lang}`;
    const row = (await stored(page, key)).rows.find((r) => r.room === "412");
    const id = `ri-${row.id}-bathroom-5`;
    // Done, from the tracker's own store (as the tracker page would), then the re-inspection.
    await page.evaluate((actionId) => window.ActionsStore.update(actionId, { status: "done", result: "Repariert" }), id);
    await page.reload();
    const again = page.locator(`tr[data-row="${row.id}"] [data-reinspect]`);
    await expect(again).toHaveText(words.button);
    await again.click();
    await expect(page.locator("[data-recheck-note]")).toContainText(words.note);
    await expect(page.locator("[data-recheck-note]")).not.toContainText("Re-inspection of room");
    await page.locator('input[name="ri-bathroom-5"][value="pass"]').check();
    await page.locator("[data-save]").click();
    await expect(page.locator("[data-walk-status]")).toContainText(words.verified);
    const actions = (await stored(page, "sc-actions")).rows.filter((a) => a.id === id);
    expect(actions[0].status).toBe("verified");
    await page.goto(`/${lang}/tools/action-tracker/`);
    await page.locator("[data-status-filter] button[data-status='verified']").click();
    await expect(page.locator(`.at-item[data-id="${id}"] .at-proof`)).toContainText(words.proof);
  });
}
