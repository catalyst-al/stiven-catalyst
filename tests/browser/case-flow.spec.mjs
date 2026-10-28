// The case thread in a real browser (playwright.config.mjs runs this file in the 1440 px light project only): one
// investigation of the CX Control Tower followed through the pages. The problem and its evidence in the tower, the
// whys in 5 Whys and back, the action in the Action Tracker with its owner and deadline, done there, the same failure
// measured before and after the change in the tower, the case closed as verified effective, the action on the shift
// handover; then a reload and a restore from the work file. Everything on the example station, invented.
import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures.mjs";

const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);
// The tower writes its state a moment after a change (300 ms): read it once it is there.
const towerState = async (page) => { await page.waitForTimeout(500); return stored(page, "sc-cx-tower"); };

test("problem → whys → action → done → KPI before/after → closed, across the tower, 5 Whys, the tracker and the handover", async ({ page }) => {
  test.setTimeout(150_000);
  // The tower on its example: the deep dive on damaged deliveries, 31 Aug – 13 Sep as the period of the evidence.
  await page.goto("/tools/cx-control-tower/");
  await expect(page.locator("[data-cx-example-flag]")).toBeVisible();
  await page.locator('[data-tab="deep"]').click();
  await page.locator("#cx-deep-metric").selectOption("damage");
  await page.locator("#cx-from").fill("2026-08-31");
  await page.locator("#cx-to").fill("2026-09-13");
  await page.getByRole("button", { name: "New investigation" }).click();
  const field = (name) => page.locator(`#cx-case-${name}`);
  await field("title").fill("Damage on the evening wave");
  await field("problem").fill("Damaged parcels on the evening wave, 31 Aug – 13 Sep");
  await field("evidence").fill("Deliveries table, every affected row traceable; loading sequence named in 9 of 12 incidents");
  await field("rootStatus").selectOption("Verified");
  await field("root").fill("No loading sequence standard for heavy items");
  await field("corrective").fill("Heavy-first loading sequence with marked shelf zones");
  await field("owner").fill("Shift Leader");
  await field("deadline").fill("2026-09-13");
  await page.getByRole("button", { name: "Create the linked action" }).click();
  await expect(page.locator(".cx-case-note")).toContainText("added to the Action Tracker");
  const tower = await towerState(page);
  const caseId = tower.cases[0].id;
  expect(caseId).toMatch(/^INV-\d{8}-001$/);
  const actions = await stored(page, "sc-actions");
  expect(actions.rows).toHaveLength(1);
  expect(actions.rows[0]).toMatchObject({ caseId, title: "Heavy-first loading sequence with marked shelf zones", owner: "Shift Leader", due: "2026-09-13", status: "open" });
  expect(tower.cases[0].trackerId).toBe(actions.rows[0].id);

  // The whys in 5 Whys: the worksheet names the case, and sends the cause back into the same investigation.
  await page.getByRole("link", { name: "Work the whys in 5 Whys" }).click();
  await expect(page).toHaveURL(/\/tools\/five-whys\/$/);
  await expect(page.locator("[data-case]")).toContainText(`Investigation ${caseId}`);
  await page.locator("#ws-why-1").fill("Heavy bags were stacked on light ones");
  await page.locator("#ws-why-2").fill("Drivers load in arrival order");
  await page.locator("#ws-cause").fill("No loading sequence standard for heavy items");
  await page.getByRole("link", { name: "Send the cause back to the investigation" }).click();
  await expect(page).toHaveURL(/\/tools\/cx-control-tower\/$/);
  await expect(page.locator("[data-cx-note]")).toContainText("2 fields filled from 5 Whys");
  await expect(field("why1")).toHaveValue("Heavy bags were stacked on light ones");
  await expect(field("why2")).toHaveValue("Drivers load in arrival order");
  await expect(field("root")).toHaveValue("No loading sequence standard for heavy items");

  // The owner marks the action done in the Action Tracker; the tracker names the investigation.
  await page.getByRole("link", { name: "Open the Action Tracker" }).click();
  await expect(page).toHaveURL(/\/tools\/action-tracker\/$/);
  const item = page.locator(".at-item").filter({ hasText: "Heavy-first loading sequence" });
  await expect(item.locator(".at-case a")).toHaveText(`Investigation ${caseId}`);
  // "Verified" is not a click here: it asks for the result and leaves the status as it was.
  await item.locator(".at-status select").selectOption("verified");
  await expect(item.locator(".at-pending")).toBeVisible();
  expect((await stored(page, "sc-actions")).rows[0].status).toBe("open");
  await item.getByRole("button", { name: "Cancel" }).click();
  await item.locator(".at-status select").selectOption("done");
  await expect.poll(() => stored(page, "sc-actions").then((s) => s.rows[0].status)).toBe("done");

  // Back in the tower by the case link (the closed action is under "all"): the stage waits for verification; the same
  // failure before and after.
  await page.locator('[data-status="all"]').click();
  await item.locator(".at-case a").click();
  await expect(page).toHaveURL(/\/tools\/cx-control-tower\/$/);
  await expect(field("status")).toHaveValue("Verification pending");
  const verify = page.locator("[data-cx-verify]");
  await expect(verify).toContainText("Done");
  await page.locator("#cx-verify-from").fill("2026-09-14");
  await expect(page.locator("[data-cx-verdict]")).toHaveAttribute("data-cx-verdict", "effective");
  await expect(verify).toContainText("Before");
  await expect(verify).toContainText("After");
  await page.locator("[data-cx-close]").click();
  await expect(page.locator(".cx-case-note")).toContainText("closed as verified effective");
  await expect(field("status")).toHaveValue("Verified effective");
  await expect(page.locator(".cx-decided.is-effective")).toContainText("Verified effective");
  const closed = await towerState(page);
  expect(closed.cases[0].verification).toMatchObject({ status: "effective", after: { from: "2026-09-14", to: "2026-09-26" } });
  expect(closed.cases[0].verification.before.n).toBeGreaterThan(closed.cases[0].verification.after.n / 2);
  const verified = (await stored(page, "sc-actions")).rows[0];
  expect(verified.status).toBe("verified");
  expect(verified.result).toContain("Verified effective");

  // The action on the shift handover, with the case id in its text, once.
  await page.getByRole("link", { name: "Put the action on the shift handover" }).click();
  await expect(page).toHaveURL(/\/tools\/shift-handover\/$/);
  await expect(page.locator("[data-status]")).toContainText(caseId);
  const handover = await stored(page, "sc-shift-handover");
  const issues = handover.current.issues.filter((issue) => issue.text.startsWith(`${caseId}: `));
  expect(issues).toHaveLength(1);
  expect(issues[0]).toMatchObject({ owner: "Shift Leader", due: "2026-09-13", done: false });

  // A reload keeps the thread; a restore from the work file keeps it too.
  await page.goto("/tools/cx-control-tower/");
  await page.locator('[data-tab="deep"]').click();
  await expect(field("status")).toHaveValue("Verified effective");
  await expect(verify).toContainText("Verified");
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-work-save]").click()]);
  const file = await readFile(await download.path(), "utf8");
  expect(JSON.parse(file).items["sc-cx-tower"]).toContain(caseId);
  await page.evaluate(() => { localStorage.removeItem("sc-cx-tower"); localStorage.removeItem("sc-actions"); });
  await page.reload();
  page.once("dialog", (d) => d.accept());
  // The work box writes the file's work and reloads the page: wait for that load before reading.
  const reloaded = page.waitForEvent("load", { timeout: 30_000 });
  await page.locator("[data-work-open]").setInputFiles({ name: "work.json", mimeType: "application/json", buffer: Buffer.from(file) });
  await reloaded;
  await expect.poll(() => stored(page, "sc-cx-tower").then((s) => s?.cases?.[0]?.id ?? null).catch(() => null), { timeout: 20_000 }).toBe(caseId);
  const restored = await stored(page, "sc-cx-tower");
  const restoredActions = await stored(page, "sc-actions");
  expect(restored.cases[0].trackerId).toBe(restoredActions.rows[0].id);
  expect(restoredActions.rows[0]).toMatchObject({ caseId, status: "verified" });
});
