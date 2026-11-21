// Closing a shift and starting the next one on the Shift Handover page, in the browser (js/shift-close.js; playwright
// .config.mjs runs this file in the 1440 px light project only). The restore points need IndexedDB, so the criteria
// of docs/plan-sot-2026-11-11/PLANI.md that speak of them (K14, with K12 and K13) are proved here, with the page's
// own "Make a restore point now" and "Restore". Fictional data: the example shift of the handover tool.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const KEY = "sc-shift-handover";
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
const active = (page) => page.evaluate(() => window.ShiftContext.active());
const openIssues = (state) => state.current.issues.filter((issue) => !issue.done).map((issue) => issue.text).sort();
const example = async (page) => {
  await page.goto("/tools/shift-handover/");
  // A device with the pilot on and no handover stored has no shift open: the first one is started like every other.
  if (await page.locator("[data-start]").isVisible()) await page.locator("[data-start-shift]").click();
  await page.locator("[data-example]").click();
  return stored(page);
};
const close = async (page) => {
  const asked = new Promise((resolve) => page.once("dialog", async (dialog) => { const message = dialog.message(); await dialog.accept(); resolve(message); }));
  await page.locator("[data-close]").click();
  return asked;
};
// The restore point made by hand last: the newest in the list.
const manualPoint = async (page) => {
  const toggle = page.locator("[data-sg-toggle]");
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
  return page.locator("[data-sg-list] li").filter({ hasText: "Made by hand" }).first();
};
// "Make a restore point now", waited for: the page says the point was made, and the list has one made by hand.
const makePoint = async (page) => {
  await page.locator("[data-sg-make]").click();
  await expect(page.locator("[data-work-status]")).toHaveText(/Restore point made/);
  await expect(await manualPoint(page)).toBeVisible();
  // The next "made" is a new message.
  await page.evaluate(() => { document.querySelector("[data-work-status]").textContent = ""; });
};
const restore = async (page) => {
  const point = await manualPoint(page);
  page.once("dialog", (dialog) => dialog.accept());
  await Promise.all([page.waitForEvent("load"), point.locator(".sg-point-actions .button-secondary").first().click()]);
};
const noDouble = (state) => {
  for (const h of [...(state.idle ? [] : [state.current]), ...state.history.map((entry) => entry.handover)]) {
    const texts = h.issues.map((issue) => issue.text);
    expect(new Set(texts).size, `${h.shift} ${h.date} holds each issue once`).toBe(texts.length);
  }
};

// The new way of closing is a setting of the device (js/shift-close.js). The tests below run on a device where it is
// on; the first one starts where it is off, as every device does.
const PILOT = "sc-shift-close-ui";
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.startsWith("off until")) return;
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ v: 1, on: true, set: 1 })), PILOT);
});

test("off until the visitor turns it on: the page closes as it always did, then the new way after the question, and off again by its button", async ({ page }) => {
  await example(page);
  expect(await page.evaluate((key) => localStorage.getItem(key), PILOT)).toBeNull();
  await expect(page.locator("[data-close]")).toHaveText("Close shift, start the next");
  await expect(page.locator(".sh-sync-note")).toBeHidden();
  expect(await close(page)).toContain("carry over to the next handover.");
  let state = await stored(page);
  expect(state.idle).toBe(false);
  expect(state.history[0].closeId).toBeUndefined();
  expect(state.current.issues.every((issue) => issue.carried >= 1)).toBe(true);
  await expect(page.locator("[data-start]")).toBeHidden();
  // Asked once, by the address; "no" turns nothing on.
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.goto("/tools/shift-handover/?pilot=shift-close");
  await expect(page).toHaveURL(/\/tools\/shift-handover\/$/);
  expect(await page.evaluate((key) => localStorage.getItem(key), PILOT)).toBeNull();
  const question = new Promise((resolve) => page.once("dialog", async (dialog) => { const message = dialog.message(); await dialog.accept(); resolve(message); }));
  await page.goto("/tools/shift-handover/?pilot=shift-close");
  expect(await question).toContain("Turn the new shift close on, on this device only?");
  await expect(page.locator("[data-close]")).toHaveText("Close the shift");
  await expect(page.locator(".sh-sync-note")).toBeVisible();
  await expectAccessible(page);
  expect(await close(page)).toContain("no shift is open until you start the next one");
  state = await stored(page);
  expect(state.idle).toBe(true);
  expect(state.history[0].closeId).toMatch(/^c[a-z0-9]{15}$/);
  // A reload keeps the setting; the button turns it off.
  await page.reload();
  await expect(page.locator("[data-start]")).toBeVisible();
  await page.locator("[data-start-shift]").click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-pilot-off]").click();
  await expect(page.locator("[data-close]")).toHaveText("Close shift, start the next");
  expect(await page.evaluate((key) => localStorage.getItem(key), PILOT)).toBeNull();
});

test("an issue sent from 5 Whys while no shift is open waits through a reload, can be discarded only when asked, and joins the started shift once", async ({ page }) => {
  await example(page);
  await close(page);
  const closedIssues = openIssues({ current: (await stored(page)).history[0].handover });
  await page.goto("/tools/shift-handover/?issue=Stacking%20rule%20as%20one%20picture&owner=Mira");
  await expect(page).toHaveURL(/\/tools\/shift-handover\/$/);
  await expect(page.locator("[data-start-waiting] li")).toHaveCount(1);
  await expect(page.locator("[data-start-waiting] li")).toContainText("Stacking rule as one picture (Mira)");
  expect((await stored(page)).idle).toBe(true);
  await expectAccessible(page);
  // A reload, the link opened again, and "no" to the discard: still one, still waiting.
  await page.reload();
  await page.goto("/tools/shift-handover/?issue=Stacking%20rule%20as%20one%20picture&owner=Mira");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("[data-discard-waiting]").click();
  await expect(page.locator("[data-start-waiting] li")).toHaveCount(1);
  expect((await stored(page)).waiting).toHaveLength(1);
  await expect(page.locator("[data-start-preview]")).toContainText("1 issue sent here while no shift was open will be added.");
  await page.locator("[data-start-shift]").click();
  let state = await stored(page);
  expect(state.waiting).toEqual([]);
  expect(openIssues(state)).toEqual([...closedIssues, "Stacking rule as one picture"].sort());
  await page.reload();
  state = await stored(page);
  expect(openIssues(state)).toEqual([...closedIssues, "Stacking rule as one picture"].sort());
  noDouble(state);
});

test("off until a file brings the state of a device where it is on: held, nothing is started or closed, and the visitor's yes lets the page go on", async ({ page }) => {
  // The state as a device with the new way on leaves it: a shift closed, its open issues waiting.
  await page.addInitScript((key) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem(key, JSON.stringify({ v: 1, on: true, set: 1 })); sessionStorage.setItem("seeded", "1"); } }, PILOT);
  await example(page);
  await close(page);
  const closed = await stored(page);
  // The setting goes, as on a device that opened this state from a file (a file never carries the setting).
  await page.evaluate((key) => localStorage.removeItem(key), PILOT);
  await page.reload();
  await expect(page.locator("[data-pilot-held]")).toBeVisible();
  await expect(page.locator("[data-pilot-held-facts]")).toContainText("No shift is open.");
  await expect(page.locator("[data-start]")).toBeHidden();
  await expect(page.locator("[data-handover]")).toBeHidden();
  await expectAccessible(page);
  expect(await stored(page)).toEqual(closed);
  // "No" leaves it held; "yes" turns the new way on and the start is offered.
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("[data-pilot-held-on]").click();
  await expect(page.locator("[data-pilot-held]")).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-pilot-held-on]").click();
  await expect(page.locator("[data-pilot-held]")).toBeHidden();
  await expect(page.locator("[data-start]")).toBeVisible();
  // While no shift is open the page shows the start only: the button that turns the new way off is with the handover,
  // and is not shown (it would be refused: tests/shift-close.test.cjs).
  await expect(page.locator("[data-pilot-off]")).toBeHidden();
  await page.locator("[data-start-shift]").click();
  const state = await stored(page);
  expect(openIssues(state)).toEqual(openIssues({ current: closed.history[0].handover }));
  noDouble(state);
});

test("the fifty-first issue from 5 Whys is refused without being used up; after a discard and a reload it is stored once", async ({ page }) => {
  await example(page);
  await close(page);
  // Fifty issues already wait (put in the store as the page keeps them; the arrival below is the real one).
  await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key));
    state.waiting = Array.from({ length: 50 }, (_, n) => ({ text: `Waiting issue ${n + 1}`, owner: "", due: "", from: "five-whys", at: "2026-11-11T20:00:00.000Z" }));
    localStorage.setItem(key, JSON.stringify(state));
  }, KEY);
  await page.goto("/tools/shift-handover/?issue=The%20fifty-first");
  await expect(page.locator("[data-status]")).toContainText("was not kept: too many issues already wait here");
  await expect(page).toHaveURL(/\?issue=The%20fifty-first$/);
  expect((await stored(page)).waiting).toHaveLength(50);
  await page.reload();
  await expect(page).toHaveURL(/\?issue=The%20fifty-first$/);
  expect((await stored(page)).waiting.some((item) => item.text === "The fifty-first")).toBe(false);
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-discard-waiting]").first().click();
  await expect(page.locator("[data-start-waiting] li")).toHaveCount(49);
  await page.reload();
  await expect(page).toHaveURL(/\/tools\/shift-handover\/$/);
  await expect(page.locator("[data-start-waiting] li")).toHaveCount(50);
  await page.reload();
  expect((await stored(page)).waiting.filter((item) => item.text === "The fifty-first")).toHaveLength(1);
});

test("close the shift, then start the next one here: nothing starts by itself, the open issues are carried once", async ({ page }) => {
  test.setTimeout(90_000);
  const before = await example(page);
  const open = before.current.issues.filter((issue) => !issue.done).length;
  expect(open).toBeGreaterThan(0);
  const asked = await close(page);
  expect(asked).toContain("no shift is open until you start the next one. Closing sends nothing.");
  expect(asked).toContain("It has not been sent to another device.");
  // No shift is open: the page shows the start, not a handover, and the device has no active shift.
  const start = page.locator("[data-start]");
  await expect(start).toBeVisible();
  await expect(page.locator("[data-handover]")).toBeHidden();
  await expect(page.locator("[data-output]")).toBeHidden();
  const closed = await stored(page);
  expect(closed.idle).toBe(true);
  expect(closed.history).toHaveLength(1);
  expect(closed.history[0].closeId).toMatch(/^c[a-z0-9]{15}$/);
  expect(Math.abs(Date.parse(closed.history[0].closedAt) - Date.now())).toBeLessThan(60_000);
  expect(await active(page)).toBeNull();
  await expectAccessible(page);
  // A reload starts nothing.
  await page.reload();
  await expect(start).toBeVisible();
  expect(await stored(page)).toEqual(closed);
  // The proposal is the shift after the closed one; what will be carried is said before the start.
  const shifts = await page.evaluate(() => JSON.parse(document.getElementById("shift-handover-data").textContent).shifts);
  const at = shifts.indexOf(closed.history[0].handover.shift);
  await expect(start.locator("[name=start-shift]")).toHaveValue(shifts[(at + 1) % shifts.length]);
  await expect(start.locator("[data-start-preview]")).toHaveText(new RegExp(`^${open} open issues? will be carried over\\.$`));
  // A shift that does not follow the closed one would carry nothing; back to the proposal.
  const proposed = await start.locator("[name=start-date]").inputValue();
  await start.locator("[name=start-date]").fill("2020-01-01");
  await expect(start.locator("[data-start-preview]")).toHaveText(/^Nothing will be carried over/);
  await start.locator("[name=start-date]").fill(proposed);
  await start.locator("[data-start-shift]").dblclick();
  await expect(page.locator("[data-handover]")).toBeVisible();
  const started = await stored(page);
  expect(started.idle).toBe(false);
  expect(openIssues(started)).toEqual(openIssues(before));
  expect(started.current.carriedFrom).toEqual([closed.history[0].closeId]);
  expect(started.history).toHaveLength(1);
  expect(await active(page)).toMatchObject({ date: started.current.date, label: started.current.shift, list: "en" });
  // After a reload it is the same handover: nothing is carried again.
  await page.reload();
  expect(await stored(page)).toEqual(started);
  await expect(page.locator("[data-history] details .sh-closure")).toContainText("Its open issues were carried to");
  await expectAccessible(page);
});

test("a handover changed after it was really shared says so, and the state stays the one it had", async ({ page, context }) => {
  test.setTimeout(90_000);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await example(page);
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await dialog.locator("[data-send-code]").fill("pilot-river-cabin-amber");
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-link]")).toHaveValue(/#h2=/, { timeout: 20_000 });
  await dialog.locator("[data-send-copy]").click();
  await expect(dialog.locator("[data-send-status]")).toContainText("Link copied");
  await dialog.locator("[data-send-close]").last().click();
  const title = page.locator("[data-output-title]");
  const line = page.locator("[data-transfer-state]");
  await expect(title).toHaveText("Shared, not yet confirmed by the other device");
  await expect(line).not.toContainText("Changed after it was shared");
  expect((await stored(page)).current.shared[0].sum).toMatch(/^[a-z0-9]+$/);
  await page.locator("[data-handover] [name=headsUp]").fill("Changed after the link went out.");
  await expect(line).toContainText("Changed after it was shared at");
  await expect(title).toHaveText("Shared, not yet confirmed by the other device");
  const asked = await close(page);
  expect(asked).toContain("It was changed after it was last shared.");
  const [entry] = (await stored(page)).history;
  expect([entry.state, entry.changed]).toEqual(["shared", true]);
});

test("K14 with K8, K12, K13: a restore point from before the carrying, put back: no shift is active, the start carries, each issue once", async ({ page }) => {
  test.setTimeout(120_000);
  const before = await example(page);
  await close(page);
  await makePoint(page);
  await page.locator("[data-start-shift]").click();
  const started = await stored(page);
  expect(started.idle).toBe(false);
  expect(await active(page)).not.toBeNull();
  await restore(page);
  const back = await stored(page);
  expect(back.idle).toBe(true);
  expect(back.history[0].carried).toBeUndefined();
  expect(await active(page), "K12: the handover of the active shift is gone, so the shift is not active").toBeNull();
  await page.locator("[data-start-shift]").click();
  const again = await stored(page);
  expect(openIssues(again)).toEqual(openIssues(before));
  noDouble(again);
});

test("K14 with K7, K12, K13: a restore point from after the carrying, put back: the shift stays open and active, nothing is carried again", async ({ page }) => {
  test.setTimeout(120_000);
  const before = await example(page);
  await close(page);
  await page.locator("[data-start-shift]").click();
  await makePoint(page);
  const point = await stored(page);
  await page.locator("[data-handover] [name=headsUp]").fill("Written after the point was made.");
  await expect.poll(async () => (await stored(page)).current.headsUp).toBe("Written after the point was made.");
  await restore(page);
  const back = await stored(page);
  expect(back).toEqual(point);
  expect(back.idle).toBe(false);
  await expect(page.locator("[data-start]")).toBeHidden();
  expect(await active(page), "K12: the open handover is the active shift's").toMatchObject({ date: back.current.date, label: back.current.shift });
  expect(openIssues(back)).toEqual(openIssues(before));
  noDouble(back);
});

test("K14 with K9, K12, K13: a restore point from before the closing, put back: the shift is open again, no shift is active, and closing it is another closure", async ({ page }) => {
  test.setTimeout(120_000);
  const before = await example(page);
  await makePoint(page);
  await close(page);
  const first = (await stored(page)).history[0].closeId;
  await page.locator("[data-start-shift]").click();
  await restore(page);
  const back = await stored(page);
  expect(back.idle === true).toBe(false);
  expect(back.history).toHaveLength(0);
  expect(back.current.shift).toBe(before.current.shift);
  expect(await active(page), "K12: the shift that was started is not the handover put back").toBeNull();
  await close(page);
  const second = (await stored(page)).history[0].closeId;
  expect(second).toMatch(/^c[a-z0-9]{15}$/);
  expect(second).not.toBe(first);
  await page.locator("[data-start-shift]").click();
  const again = await stored(page);
  expect(again.current.carriedFrom).toEqual([second]);
  expect(openIssues(again)).toEqual(openIssues(before));
  noDouble(again);
});

test("K14 with K10 and K11: a restore point without the handover leaves it alone; one from the page as it was before is never carried", async ({ page }) => {
  test.setTimeout(120_000);
  // A point that holds another tool's work only.
  await page.goto("/tools/shift-handover/");
  await page.evaluate(() => localStorage.setItem("sc-damage-control", JSON.stringify({ rows: [{ date: "2026-11-10", shift: "Late", stage: "Loading", type: "Crushed", cause: "Stacking", units: 1, cost: null, note: "" }] })));
  await page.reload();
  await makePoint(page);
  // No handover is stored here yet, so no shift is open: the first one is started, then the example is loaded.
  await page.locator("[data-start-shift]").click();
  const before = await (async () => { await page.locator("[data-example]").click(); return stored(page); })();
  await close(page);
  await page.locator("[data-start-shift]").click();
  const kept = await stored(page);
  const shift = await active(page);
  await restore(page);
  expect(await stored(page), "K10: the handover and its history are as they were").toEqual(kept);
  expect(await active(page), "K12: its shift is still the active one").toEqual(shift);
  noDouble(await stored(page));
  // The handover as the page kept it before: a closure without an id, and the next handover made at once.
  const legacy = { current: { ...before.current, issues: before.current.issues.filter((issue) => !issue.done).map((issue) => ({ ...issue, carried: 1 })) }, history: [{ closedAt: "2026-11-10T21:40:00.000Z", handover: before.current, text: "Shift handover" }], received: [] };
  await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [KEY, legacy]);
  await page.reload();
  await makePoint(page);
  await page.evaluate((key) => localStorage.removeItem(key), KEY);
  await page.reload();
  await restore(page);
  const back = await stored(page);
  expect(back.history[0].closeId, "K11: a closure of before has no id").toBeUndefined();
  await close(page);
  await page.locator("[data-start-shift]").click();
  const after = await stored(page);
  expect(after.current.carriedFrom).toEqual([after.history[0].closeId]);
  expect(after.history[1].carried, "the closure of before was not carried").toBeUndefined();
  expect(openIssues(after)).toEqual(openIssues(legacy));
  noDouble(after);
});
