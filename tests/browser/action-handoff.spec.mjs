// The hand-off to the Action Tracker in a real browser (phase 5B, privacy finding P1-02; playwright.config.mjs runs
// this file in the 1440 px light project only): what a visitor types into 5 Whys reaches the tracker through a note
// in the tab, never through the address the browser requests, never into the offline copy the service worker keeps;
// the tracker adds the action once, cleans its address and survives a reload; a new tab opened from the link (Ctrl-
// click) receives the note too; a link of the older shape still arrives; the German and Albanian pages do the same.
// Everything typed here is invented.
import { test, expect } from "./fixtures.mjs";

const PRIVATE = {
  problem: "Guest in room 412 complained about noise from the ice machine",
  cause: "Ice machine compressor on floor 4 runs at night",
  action: "Move the night cycle of the ice machine to the afternoon",
  owner: "Arta B.",
  due: "2026-11-20",
  check: "No noise complaint on floor 4 for two weeks",
};
const WORDS = ["412", "Arta", "ice machine", "noise", "compressor", "night cycle", "floor 4"];
const leaks = (text) => WORDS.filter((w) => decodeURIComponent(text).toLowerCase().includes(w.toLowerCase()));

// The requests the browser makes (navigations and files), to prove the address carried nothing typed.
const watch = (page) => { const urls = []; page.on("request", (r) => urls.push(r.url())); return urls; };

const fillWhys = async (page) => {
  for (const [name, value] of Object.entries(PRIVATE)) await page.locator(`[data-worksheet] [name="${name}"]`).fill(value);
};
const trackerRows = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("sc-actions") || '{"rows":[]}').rows.filter((r) => !r.example));
const cacheText = (page) => page.evaluate(async () => {
  // Every address the offline copy holds, and the whole reference index.
  const cache = await caches.open("sc-offline-v1");
  const keys = (await cache.keys()).map((k) => k.url);
  const refs = await cache.match("/__sw/refs");
  return keys.join("\n") + "\n" + (refs ? await refs.text() : "");
});

test.describe.configure({ mode: "serial" });

test("5 Whys → Action Tracker: nothing typed in any request address, the action arrives once, the address is cleaned, a reload adds nothing, the offline copy holds no text", async ({ page }) => {
  test.setTimeout(120_000);
  const urls = watch(page);
  await page.goto("/tools/five-whys/", { waitUntil: "load" });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await fillWhys(page);
  const link = page.locator("[data-worksheet] [data-tracker]");
  const href = await link.getAttribute("href");
  expect(href, "the address carries only a token in its fragment").toMatch(/\/tools\/action-tracker\/#handoff=[a-z0-9]{16}$/);
  expect(leaks(href)).toEqual([]);
  await link.click();
  await page.waitForURL(/\/tools\/action-tracker\/$/);
  await expect(page.locator("[data-log-status]")).toContainText("Added from 5 Whys");
  expect(page.url().endsWith("/tools/action-tracker/"), "the token is cleaned from the address").toBe(true);
  const rows = await trackerRows(page);
  expect(rows.length).toBe(1);
  expect(rows[0]).toMatchObject({ title: PRIVATE.action, owner: PRIVATE.owner, due: PRIVATE.due, check: PRIVATE.check, source: "five-whys", priority: "High", status: "open" });
  expect(rows[0].detail).toContain(PRIVATE.cause);
  // No request the browser made carried a word of it.
  const leaking = urls.filter((u) => leaks(u).length);
  expect(leaking, "requests carrying typed text").toEqual([]);
  // The note is consumed (the drafts written while the fields were being filled stay, bounded at twelve, until the
  // tab closes or newer ones push them out).
  const token = href.split("#handoff=")[1];
  const notes = await page.evaluate(() => JSON.parse(sessionStorage.getItem("sc-action-handoff") || "{}"));
  expect(notes[token]).toBeUndefined();
  expect(Object.keys(notes).length).toBeLessThanOrEqual(12);
  // A reload adds nothing.
  await page.reload({ waitUntil: "load" });
  expect((await trackerRows(page)).length).toBe(1);
  // The same hand-off again: not twice.
  await page.goto("/tools/five-whys/", { waitUntil: "load" });
  await page.locator("[data-worksheet] [data-tracker]").click();
  await page.waitForURL(/\/tools\/action-tracker\/$/);
  await expect(page.locator("[data-log-status]")).toContainText("Already on the list");
  expect((await trackerRows(page)).length).toBe(1);
  // The offline copy (phase 5A worker) holds the tracker under its plain address and no word of the action.
  await page.waitForTimeout(2500);
  const copy = await cacheText(page);
  expect(leaks(copy), "typed text in the offline copy").toEqual([]);
  expect(copy).toContain("/tools/action-tracker/");
  expect(copy).not.toMatch(/action-tracker\/\?action=/);
});

test("a tab opened from the link with Ctrl-click or a middle click does not receive the hand-off (Chromium gives it no copy of the session storage): the tracker there says so, adds nothing and leaks nothing; a copied link opened on its own says the same", async ({ page, context }) => {
  test.setTimeout(120_000);
  const urls = watch(page);
  await page.goto("/tools/five-whys/", { waitUntil: "load" });
  await fillWhys(page);
  for (const opts of [{ modifiers: ["Control"] }, { button: "middle" }]) {
    const [tab] = await Promise.all([context.waitForEvent("page"), page.locator("[data-worksheet] [data-tracker]").click(opts)]);
    const tabUrls = watch(tab);
    await tab.waitForLoadState("domcontentloaded");
    await expect(tab.locator("[data-log-status]")).toContainText("did not arrive");
    expect((await trackerRows(tab)).length, "nothing added in the new tab").toBe(0);
    expect(tab.url().endsWith("/tools/action-tracker/"), "the token is cleaned in the new tab too").toBe(true);
    expect([...urls, ...tabUrls].filter((u) => leaks(u).length)).toEqual([]);
    await tab.close();
  }
  // The tool still holds the action: followed in this tab, the link hands it over.
  await page.locator("[data-worksheet] [data-tracker]").click();
  await page.waitForURL(/\/tools\/action-tracker\/$/);
  expect((await trackerRows(page)).length).toBe(1);
  // A link with a token and no note (opened on its own, in a fresh tab without the note): no silent nothing.
  const alone = await context.newPage();
  await alone.goto("/tools/action-tracker/#handoff=abcdefghij012345", { waitUntil: "domcontentloaded" });
  await expect(alone.locator("[data-log-status]")).toContainText("did not arrive");
  expect(alone.url().endsWith("/tools/action-tracker/")).toBe(true);
  expect((await trackerRows(alone)).length, "nothing added, the earlier action untouched").toBe(1);
  await alone.close();
});

test("a link of the older shape (?action=…) still arrives once and is cleaned; the pages do not generate it any more", async ({ page }) => {
  await page.goto("/tools/action-tracker/?action=Old%20link%20still%20works&source=five-whys&priority=Low", { waitUntil: "load" });
  await expect(page.locator("[data-log-status]")).toContainText("Added from 5 Whys");
  expect(page.url().endsWith("/tools/action-tracker/")).toBe(true);
  const rows = await trackerRows(page);
  expect(rows.map((r) => r.title)).toContain("Old link still works");
  await page.goto("/tools/five-whys/", { waitUntil: "load" });
  await fillWhys(page);
  expect(await page.locator("[data-worksheet] [data-tracker]").getAttribute("href")).not.toContain("?action=");
});

for (const [lang, added] of [["de", "Hinzugef\u00fcgt aus"], ["sq", "U shtua nga"]]) {
  test(`${lang}: the hand-off keeps the language and carries nothing typed in the address`, async ({ page }) => {
    const urls = watch(page);
    await page.goto(`/${lang}/tools/five-whys/`, { waitUntil: "load" });
    await fillWhys(page);
    const href = await page.locator("[data-worksheet] [data-tracker]").getAttribute("href");
    expect(href).toMatch(new RegExp(`/${lang}/tools/action-tracker/#handoff=[a-z0-9]{16}$`));
    await page.locator("[data-worksheet] [data-tracker]").click();
    await page.waitForURL(new RegExp(`/${lang}/tools/action-tracker/$`));
    // The message in the page's language clears itself after a moment; the list is the proof.
    await expect.poll(async () => (await trackerRows(page)).length, { timeout: 10000 }).toBe(1);
    expect((await trackerRows(page))[0]).toMatchObject({ title: PRIVATE.action, owner: PRIVATE.owner, source: "five-whys" });
    const status = await page.locator("[data-log-status]").textContent();
    if (status) expect(status).toContain(added);
    expect(urls.filter((u) => leaks(u).length)).toEqual([]);
  });
}

test("F5B-02 in the browser: the Shift Handover with fourteen open issues builds fourteen links; the first, followed last, still hands its issue over, and the address carries nothing typed", async ({ page }) => {
  const urls = watch(page);
  const issues = Array.from({ length: 14 }, (_, i) => ({ text: `Open issue ${i + 1}: pallet ${100 + i} blocked at dock ${(i % 4) + 1}`, priority: "High", owner: `Lead ${i + 1}`, due: "", done: false, carried: 0 }));
  await page.goto("/tools/shift-handover/", { waitUntil: "load" });
  await page.evaluate((rows) => { localStorage.setItem("sc-shift-handover", JSON.stringify({ current: { template: "warehouse", issues: rows } })); }, issues);
  await page.reload({ waitUntil: "load" });
  const links = page.locator("a.sh-tracker");
  await expect(links).toHaveCount(14);
  await links.first().click();
  await page.waitForURL(/\/tools\/action-tracker\/$/);
  await expect.poll(async () => (await trackerRows(page)).length, { timeout: 10000 }).toBe(1);
  expect((await trackerRows(page))[0]).toMatchObject({ title: "Open issue 1: pallet 100 blocked at dock 1", owner: "Lead 1", source: "shift-handover" });
  expect(urls.filter((u) => /pallet|dock|Lead/i.test(decodeURIComponent(u)))).toEqual([]);
});

test("F5B-01 in the browser: a save the browser refuses keeps the note and the token and says the action is still waiting; once writes work again a reload hands it over; nothing typed in any request", async ({ page }) => {
  const urls = watch(page);
  // localStorage refuses every write while a flag of this tab says so (the way a full or blocked storage, or the PIN
  // lock, refuses it); sessionStorage, where the note lives, keeps working.
  await page.addInitScript(() => {
    const real = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) { if (this === localStorage && sessionStorage.getItem("sc-test-block-writes") === "1") throw new Error("blocked"); return real.call(this, key, value); };
  });
  await page.goto("/tools/five-whys/", { waitUntil: "load" });
  await fillWhys(page);
  const href = await page.locator("[data-worksheet] [data-tracker]").getAttribute("href");
  const token = href.split("#handoff=")[1];
  await page.evaluate(() => { sessionStorage.setItem("sc-test-block-writes", "1"); });
  await page.locator("[data-worksheet] [data-tracker]").click();
  await page.waitForURL(/\/tools\/action-tracker\//);
  await expect(page.locator("[data-log-status]")).toContainText("still waiting");
  expect(page.url()).toContain(`#handoff=${token}`);
  expect(await page.evaluate((t) => Boolean(JSON.parse(sessionStorage.getItem("sc-action-handoff") || "{}")[t]), token)).toBe(true);
  expect((await trackerRows(page)).length).toBe(0);
  // Writes work again: the reload, with the token still in the address, hands the action over.
  await page.evaluate(() => { sessionStorage.removeItem("sc-test-block-writes"); });
  await page.reload({ waitUntil: "load" });
  await expect.poll(async () => (await trackerRows(page)).length, { timeout: 10000 }).toBe(1);
  expect((await trackerRows(page))[0]).toMatchObject({ title: PRIVATE.action, owner: PRIVATE.owner, source: "five-whys" });
  expect(page.url().endsWith("/tools/action-tracker/")).toBe(true);
  expect(await page.evaluate((t) => Boolean(JSON.parse(sessionStorage.getItem("sc-action-handoff") || "{}")[t]), token)).toBe(false);
  expect(urls.filter((u) => leaks(u).length)).toEqual([]);
});
