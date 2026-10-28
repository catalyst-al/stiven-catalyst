// Shift Handover, the sealed transfer from one device to the next, in a real Chromium with two separate browser
// contexts (device A hands over, device B takes over). Everything is fictional: a warehouse late shift, Arben and
// Lena, docks and scanners. Runs in every project of playwright.config.mjs (three widths, two themes).
import { readFile } from "node:fs/promises";
import { test, expect, expectTheme, expectAccessible } from "./fixtures.mjs";

const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), key);
// A closed shift as it matters: the page rebuilds a saved handover field by field (missing records empty, the checks
// one per item of the template), so an entry is compared by what it says, not by its raw shape.
const closedShift = (entry) => ({ closedAt: entry.closedAt, text: entry.text, from: entry.handover.from, to: entry.handover.to, ackAt: entry.handover.ackAt, area: entry.handover.area, metrics: entry.handover.metrics, issues: entry.handover.issues });
const fill = async (page, selector, value) => {
  const node = page.locator(selector);
  await node.fill(value);
  await node.dispatchEvent("change");
};
// A second, separate device: its own storage, its own tab, the same theme and the same guard against script errors.
const otherDevice = async (browser, theme, errors) => {
  const context = await browser.newContext({ reducedMotion: theme === "light" ? "reduce" : "no-preference" });
  await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (route) => route.abort());
  await context.addInitScript((value) => { try { localStorage.setItem("sc-theme", value); } catch { /* storage unavailable */ } }, theme);
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`B: ${error.message}`));
  return { context, page };
};

test("device A seals and shares, device B opens with the code, takes over and confirms; A checks the code", async ({ page, browser, theme }) => {
  test.setTimeout(90_000);
  const errorsB = [];
  const B = await otherDevice(browser, theme, errorsB);

  // ---- Device A: a handover, kept across a reload ----
  await page.goto("/tools/shift-handover/");
  await expectTheme(page, theme);
  await page.locator("[data-example]").click();
  await fill(page, "[name=to]", "Lena");
  await page.locator("[data-add-issue]").click();
  await page.locator("[data-issues] .sh-issue-text").last().fill("Scanner 9 shows a blank screen after the update");
  await expect.poll(() => stored(page, "sc-shift-handover").then((s) => s?.current?.issues?.length)).toBeGreaterThanOrEqual(5);
  const beforeReload = await stored(page, "sc-shift-handover");
  await page.reload();
  expect((await stored(page, "sc-shift-handover")).current).toEqual(beforeReload.current);
  await expect(page.locator("[data-output-title]")).toContainText(/Ready to hand over|Almost ready/);

  // ---- Device A: prepare the transfer ----
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await expect(dialog).toBeVisible();
  // What goes is listed, and the names stay out until asked.
  await expect(dialog.locator("[data-send-summary] li")).toHaveCount(7);
  await expect(dialog.locator("[data-send-summary]")).toContainText("Names left out");
  await dialog.locator("[data-send-names]").check();
  await expect(dialog.locator("[data-send-summary]")).toContainText("Arben → Lena");
  await dialog.locator("[data-send-names]").uncheck();
  // The code is six words of the team-code list; a short one is refused; a weak one of one's own is warned about.
  const code = await dialog.locator("[data-send-code]").inputValue();
  expect(code).toMatch(/^[a-z]+(?:-[a-z]+){5}$/);
  await expect(dialog.locator("[data-send-code-warning]")).toBeHidden();
  await dialog.locator("[data-send-code]").fill("short");
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-prepare-status]")).toContainText("at least 8");
  await dialog.locator("[data-send-code]").fill("12345678");
  await expect(dialog.locator("[data-send-code-warning]")).toContainText("Weak code");
  await dialog.locator("[data-send-newcode]").click();
  await expect(dialog.locator("[data-send-code-warning]")).toBeHidden();
  await dialog.locator("[data-send-code]").fill(code);
  await dialog.locator("[data-send-make]").click();
  const linkBox = dialog.locator("[data-send-link]");
  await expect(linkBox).toHaveValue(/#h2=[A-Za-z0-9_-]+$/, { timeout: 20_000 });
  const link = await linkBox.inputValue();
  expect(link).not.toContain("Arben");
  expect(link.length).toBeLessThan(2331);
  await expect(dialog.locator("[data-send-qr] svg")).toBeVisible();
  // Generating is not sharing: the status changes only when the link is copied.
  expect((await stored(page, "sc-shift-handover")).current.shared).toEqual([]);
  await dialog.locator("[data-send-copy]").click();
  await expect(dialog.locator("[data-send-status]")).toContainText("Link copied");
  const sharedA = (await stored(page, "sc-shift-handover")).current.shared;
  expect(sharedA).toHaveLength(1);
  expect(sharedA[0].mode).toBe("link");
  await dialog.locator("[data-send-close]").last().click();
  await expect(page.locator("[data-output-title]")).toContainText("Shared, not yet confirmed");
  await expectAccessible(page);

  // ---- Device B: the link, the wrong code, the right code, the preview ----
  await B.page.goto("/tools/shift-handover/");
  // B has a closed shift in its history, one issue of its own, and the sender's "scanner 9" issue open already with an owner.
  await B.page.evaluate(() => {
    const own = { template: "warehouse", date: "2026-10-25", shift: "Night", area: "Inbound", from: "Mira", to: "Lena", ackAt: "2026-10-26T06:00:00.000Z", metrics: [["Units handled", "900", ""]], issues: [], headsUp: "", safety: "", checks: [] };
    localStorage.setItem("sc-shift-handover", JSON.stringify({ current: { ...own, date: "2026-10-26", shift: "Early", from: "Lena", to: "", ackAt: "", issues: [
      { text: "Pallet wrap running low on dock 3", priority: "Low", owner: "", due: "", done: false, carried: 0 },
      { text: "Scanner 9 shows a blank screen after the update", priority: "Low", owner: "IT desk", due: "2026-10-30", done: false, carried: 1 },
    ] }, history: [{ closedAt: "2026-10-26T06:05:00.000Z", handover: own, text: "Shift handover | Inbound" }] }));
  });
  await B.page.reload();
  const historyBefore = (await stored(B.page, "sc-shift-handover")).history;
  expect(historyBefore).toHaveLength(1);
  await B.page.goto(link);
  const box = B.page.locator("[data-incoming]");
  await expect(box).toBeVisible();
  await expect(box.locator("[data-incoming-text]")).toContainText("sealed handover");
  const unlock = box.locator("[data-incoming-unlock]");
  await unlock.locator("[name=code]").fill("acid-acorn-acre-acts");
  await unlock.locator("button[type=submit]").click();
  await expect(box.locator("[data-incoming-error]")).toContainText("Wrong code", { timeout: 20_000 });
  expect((await stored(B.page, "sc-shift-handover")).current.issues).toHaveLength(2);
  await unlock.locator("[name=code]").fill(code.toUpperCase().replace(/-/g, " "));
  await unlock.locator("button[type=submit]").click();
  const preview = box.locator("[data-incoming-preview]");
  await expect(preview).toBeVisible({ timeout: 20_000 });
  await expect(box.locator("[data-incoming-text]")).toContainText("A handover arrived");
  await expect(preview.locator("[data-incoming-summary]")).toContainText("Names left out");
  await expect(preview.locator("[data-incoming-issues] li.is-new").first()).toBeVisible();
  await expect(preview.locator("[data-incoming-issues] li.is-kept")).toContainText("Pallet wrap");
  // The same issue on both devices, with a higher priority there and an owner here: the difference is shown.
  const same = preview.locator("[data-incoming-issues] li.is-same");
  await expect(same).toContainText("Scanner 9");
  await expect(same.locator(".sh-conflict")).toContainText("another priority there");
  await expectAccessible(B.page);

  // ---- Device B: take over, keep what was open here, confirm, get the code ----
  B.page.once("dialog", (d) => d.accept());
  await box.locator("[data-incoming-open]").click();
  await expect(box).toBeHidden();
  expect(await B.page.evaluate(() => location.hash)).toBe("");
  const stateB = await stored(B.page, "sc-shift-handover");
  expect(stateB.current.received.id).toBe(sharedA[0].id);
  expect(stateB.current.from).toBe("");
  expect(stateB.current.issues.map((issue) => issue.text)).toContain("Pallet wrap running low on dock 3");
  const scanner = stateB.current.issues.find((issue) => issue.text === "Scanner 9 shows a blank screen after the update");
  expect([scanner.done, scanner.owner, scanner.due, scanner.priority, scanner.carried]).toEqual([false, "IT desk", "2026-10-30", "Medium", 1]);
  // The history B had is untouched; the shift B was on joined it.
  expect(stateB.history).toHaveLength(2);
  expect(closedShift(stateB.history[1])).toEqual(closedShift(historyBefore[0]));
  expect(stateB.history[0].handover.from).toBe("Lena");
  expect(stateB.received.map((entry) => entry.id)).toEqual([sharedA[0].id]);
  await expect(B.page.locator("[data-output-title]")).toContainText("Received");
  await fill(B.page, "[name=to]", "Lena");
  await B.page.locator("[data-ack]").click();
  const ackBox = B.page.locator("[data-ack-code]");
  await expect(ackBox).toBeVisible();
  const ackCode = (await ackBox.locator("[data-ack-code-text]").textContent()).trim();
  expect(ackCode).toMatch(/^[A-Z2-7]{3}-[A-Z2-7]{3}$/);
  await expect(B.page.locator("[data-output-title]")).toContainText("Taken over by Lena");

  // ---- Device B: the same link a second time is recognised ----
  await B.page.goto(link);
  await unlock.locator("[name=code]").fill(code);
  await unlock.locator("button[type=submit]").click();
  await expect(box.locator("[data-incoming-note]")).toContainText("Already received", { timeout: 20_000 });
  await expect(box.locator("[data-incoming-open]")).toBeHidden();
  await expect(box.locator("[data-incoming-again]")).toBeVisible();
  await box.locator("[data-incoming-ignore]").click();
  await expect(box).toBeHidden();
  expect((await stored(B.page, "sc-shift-handover")).history).toHaveLength(2);

  // ---- Device A: a wrong code is refused, the right one acknowledges ----
  const verify = page.locator("[data-ack-verify]");
  await expect(verify).toBeVisible();
  await verify.locator("[name=code]").fill("AAA-AAA");
  await verify.locator("button[type=submit]").click();
  await expect(verify.locator("[data-ack-verify-status]")).toContainText("does not match");
  await verify.locator("[name=code]").fill(ackCode.toLowerCase());
  await verify.locator("[name=by]").fill("Lena");
  await verify.locator("button[type=submit]").click();
  await expect(page.locator("[data-output-title]")).toContainText("Acknowledged: confirmation code typed in by hand (Lena)");
  await expect(page.locator("[data-transfer-state]")).toContainText("does not prove who opened it");
  const stateA = await stored(page, "sc-shift-handover");
  expect(stateA.current.ack.id).toBe(sharedA[0].id);
  expect(stateA.current.ack.code).toBe(ackCode.replace("-", ""));

  // ---- Device A: close the shift; the open issues carry over, the transfer records do not ----
  page.once("dialog", (d) => d.accept());
  await page.locator("[data-close]").click();
  const closed = await stored(page, "sc-shift-handover");
  expect(closed.history[0].handover.ack.code).toBe(ackCode.replace("-", ""));
  expect(closed.current.shared).toEqual([]);
  expect(closed.current.ack).toBeNull();

  expect(errorsB, "no script error on device B").toEqual([]);
  await B.context.close();
});

test("a damaged link, a foreign fragment and a file: refused or opened, by keyboard, offline once the app is kept", async ({ page, browser, theme }) => {
  test.setTimeout(90_000);
  const errorsB = [];
  const B = await otherDevice(browser, theme, errorsB);
  const code = "pilot-river-cabin-amber";

  // Device A seals the example and saves it as a file.
  await page.goto("/tools/shift-handover/");
  await page.locator("[data-example]").click();
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await dialog.locator("[data-send-code]").fill(code);
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-link]")).toHaveValue(/#h2=/, { timeout: 20_000 });
  const link = await dialog.locator("[data-send-link]").inputValue();
  const [download] = await Promise.all([page.waitForEvent("download"), dialog.locator("[data-send-file]").click()]);
  const fileText = await readFile(await download.path(), "utf8");
  expect(download.suggestedFilename()).toMatch(/^handover-.*\.json$/);
  expect(JSON.parse(fileText).format).toBe("stiven-catalyst-handover-file");
  expect(fileText).not.toContain("Arben");
  expect((await stored(page, "sc-shift-handover")).current.shared[0].mode).toBe("file");
  await dialog.locator("[data-send-close]").last().click();

  // Device B has used the app before, so the page is kept for offline use.
  await B.page.goto("/tools/shift-handover/");
  await B.page.waitForFunction(() => navigator.serviceWorker?.controller !== null && navigator.serviceWorker.controller !== undefined, null, { timeout: 20_000 }).catch(() => null);
  const controlled = await B.page.evaluate(() => Boolean(navigator.serviceWorker?.controller));

  // A damaged link: the sealed bytes with a character changed open nothing; the code is not blamed wrongly either.
  const damaged = link.replace(/#h2=(.{20})(.)/, (m, head, ch) => `#h2=${head}${ch === "A" ? "B" : "A"}`);
  await B.page.goto(damaged);
  const box = B.page.locator("[data-incoming]");
  const unlock = box.locator("[data-incoming-unlock]");
  await unlock.locator("[name=code]").fill(code);
  await unlock.locator("button[type=submit]").click();
  await expect(box.locator("[data-incoming-error]")).toContainText(/Wrong code, or the handover was changed/, { timeout: 20_000 });
  // Bytes that are not a sealed handover: the code is asked for, then the page says what this is not.
  await B.page.goto("/tools/shift-handover/#h2=notvalid");
  await expect(box).toBeVisible();
  await unlock.locator("[name=code]").fill(code);
  await unlock.locator("button[type=submit]").click();
  await expect(box.locator("[data-incoming-error]")).toContainText("not a handover that this page can open", { timeout: 20_000 });
  // A fragment that is not even a link of this page is said so, and leaves the address.
  await B.page.goto("/tools/shift-handover/#h2=not%20valid!");
  await expect(B.page.locator("[data-status]")).toContainText("does not hold a handover");
  expect(await B.page.evaluate(() => location.hash)).toBe("");
  await expect(box).toBeHidden();

  // Offline, once the app is kept: from another page, with no network, the link still opens the tool from the copy
  // the service worker kept and the code still works; nothing needs a server. (Without a controlling worker, which a
  // fresh context sometimes lacks, the same steps run online.)
  await B.page.goto("/tools.html");
  if (controlled) await B.context.setOffline(true);
  await B.page.goto(link);
  await expect(box).toBeVisible({ timeout: 20_000 });
  // By keyboard only: the code field has the focus, Enter opens, Tab reaches "Take over", Enter takes over.
  await expect(unlock.locator("[name=code]")).toBeFocused();
  await B.page.keyboard.type(code);
  await B.page.keyboard.press("Enter");
  await expect(box.locator("[data-incoming-preview]")).toBeVisible({ timeout: 20_000 });
  await expect(box.locator("[data-incoming-open]")).toBeFocused();
  await B.page.keyboard.press("Enter");
  await expect(box).toBeHidden();
  await expect(B.page.locator("[data-output-title]")).toContainText("Received");
  if (controlled) await B.context.setOffline(false);

  // The file opens the same way, and the same transfer is recognised as already received.
  await B.page.locator("[data-incoming-file]").setInputFiles({ name: "handover.json", mimeType: "application/json", buffer: Buffer.from(fileText) });
  await expect(box).toBeVisible();
  await expect(box.locator("[data-incoming-text]")).toContainText("handover file");
  await unlock.locator("[name=code]").fill(code);
  await unlock.locator("button[type=submit]").click();
  await expect(box.locator("[data-incoming-note]")).toContainText("Already received", { timeout: 20_000 });
  // Not a handover file.
  await B.page.locator("[data-incoming-file]").setInputFiles({ name: "x.json", mimeType: "application/json", buffer: Buffer.from('{"hello":1}') });
  await expect(B.page.locator("[data-status]")).toContainText("not a handover file");
  // Cancel: "Not now" leaves everything as it was.
  await B.page.locator("[data-incoming-file]").setInputFiles({ name: "handover.json", mimeType: "application/json", buffer: Buffer.from(fileText) });
  await box.locator("[data-incoming-ignore]").click();
  await expect(box).toBeHidden();
  expect((await stored(B.page, "sc-shift-handover")).received).toHaveLength(1);

  expect(errorsB, "no script error on device B").toEqual([]);
  await B.context.close();
});

test("two issues with the same text but another owner and date are kept apart on both devices, and the history stays", async ({ page, browser, theme }) => {
  test.setTimeout(60_000);
  const errorsB = [];
  const B = await otherDevice(browser, theme, errorsB);
  const code = "cabin-river-pilot-amber-delta-ember";
  const seed = (from, issues) => ({ template: "warehouse", date: "2026-10-26", shift: "Early", area: "Outbound", from, to: "", ackAt: "", metrics: [["Units handled", "500", ""]], issues, headsUp: "", safety: "", checks: [] });
  // Device A: the same text twice, with another owner and date each (names included, so they travel).
  await page.goto("/tools/shift-handover/");
  await page.evaluate((state) => localStorage.setItem("sc-shift-handover", JSON.stringify(state)), { current: seed("Arben", [
    { text: "Dock 4 door jams at the top", priority: "High", owner: "Facilities", due: "2026-10-29", done: false, carried: 0 },
    { text: "Dock 4 door jams at the top", priority: "Low", owner: "Maintenance", due: "2026-10-27", done: true, carried: 0 },
  ]), history: [] });
  await page.reload();
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await dialog.locator("[data-send-names]").check();
  await dialog.locator("[data-send-code]").fill(code);
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-link]")).toHaveValue(/#h2=/, { timeout: 20_000 });
  const link = await dialog.locator("[data-send-link]").inputValue();
  // Device B: the same text once more, with a third owner, and a closed shift in the history.
  await B.page.goto("/tools/shift-handover/");
  const history = [{ closedAt: "2026-10-26T06:05:00.000Z", handover: seed("Mira", []), text: "Shift handover | Outbound" }];
  await B.page.evaluate((state) => localStorage.setItem("sc-shift-handover", JSON.stringify(state)), { current: seed("Lena", [
    { text: "Dock 4 door jams at the top", priority: "Medium", owner: "Lena", due: "2026-10-28", done: false, carried: 1 },
  ]), history });
  await B.page.goto(link);
  const box = B.page.locator("[data-incoming]");
  await box.locator("[data-incoming-unlock] [name=code]").fill(code);
  await box.locator("[data-incoming-unlock] button[type=submit]").click();
  const issues = box.locator("[data-incoming-issues] li");
  await expect(issues).toHaveCount(3, { timeout: 20_000 });
  await expect(box.locator("[data-incoming-issues] li.is-ambiguous")).toHaveCount(2);
  await expect(box.locator("[data-incoming-issues] li.is-ambiguous").first()).toContainText("same text as an issue here");
  await expect(box.locator("[data-incoming-issues] li.is-kept")).toContainText("Lena");
  B.page.once("dialog", (d) => d.accept());
  await box.locator("[data-incoming-open]").click();
  await expect(box).toBeHidden();
  const state = await stored(B.page, "sc-shift-handover");
  expect(state.current.issues.map((issue) => [issue.owner, issue.due, issue.done, issue.carried])).toEqual([
    ["Facilities", "2026-10-29", false, 0],
    ["Maintenance", "2026-10-27", true, 0],
    ["Lena", "2026-10-28", false, 1],
  ]);
  expect(state.history).toHaveLength(2);
  expect(closedShift(state.history[1])).toEqual(closedShift(history[0]));
  expect(state.history[0].handover.from).toBe("Lena");
  expect(errorsB).toEqual([]);
  await B.context.close();
});

test("a browser that cannot copy does not count the handover as shared", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("no clipboard")) } });
    document.execCommand = () => false;
  });
  await page.goto("/tools/shift-handover/");
  await page.locator("[data-example]").click();
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-link]")).toHaveValue(/#h2=/, { timeout: 20_000 });
  await dialog.locator("[data-send-copy]").click();
  await expect(dialog.locator("[data-send-status]")).toContainText("did not copy the link");
  expect((await stored(page, "sc-shift-handover")).current.shared).toEqual([]);
  await dialog.locator("[data-send-close]").last().click();
  await expect(page.locator("[data-output-title]")).not.toContainText("Shared");
});

test("in German and Albanian the same flow reads in its language", async ({ page, browser, theme }) => {
  test.setTimeout(60_000);
  const errorsB = [];
  const B = await otherDevice(browser, theme, errorsB);
  const code = "amber-cabin-river-pilot";
  await page.goto("/de/tools/shift-handover/");
  await page.locator("[data-example]").click();
  await page.locator("[data-send]").click();
  const dialog = page.locator("[data-send-dialog]");
  await expect(dialog.locator("#sh-send-title")).toContainText("Übergabe");
  await expect(dialog.locator("[data-send-summary]")).toContainText("Namen weggelassen");
  await dialog.locator("[data-send-code]").fill(code);
  await dialog.locator("[data-send-make]").click();
  await expect(dialog.locator("[data-send-link]")).toHaveValue(/#h2=/, { timeout: 20_000 });
  const link = await dialog.locator("[data-send-link]").inputValue();
  await dialog.locator("[data-send-copy]").click();
  await expect(page.locator("[data-output-title]")).toContainText("Geteilt");
  await B.page.goto(link.replace("/de/tools/", "/sq/tools/"));
  const box = B.page.locator("[data-incoming]");
  await expect(box.locator("[data-incoming-text]")).toContainText("dorëzim i vulosur");
  await box.locator("[data-incoming-unlock] [name=code]").fill(code);
  await box.locator("[data-incoming-unlock] button[type=submit]").click();
  await expect(box.locator("[data-incoming-preview]")).toBeVisible({ timeout: 20_000 });
  await expect(box.locator("[data-incoming-summary]")).toContainText("Emrat jashtë");
  await box.locator("[data-incoming-open]").click();
  await expect(B.page.locator("[data-output-title]")).toContainText("E marrë");
  expect(errorsB).toEqual([]);
  await B.context.close();
});
