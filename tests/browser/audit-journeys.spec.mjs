// The journeys the audit of 28 November 2026 found broken or left unproven in a real browser, in the three languages
// (docs/audits/full-platform-audit.md): the Root causes tab of the CX Control Tower and its example in the page's
// language, the Action Tracker's refusals and what it keeps, a complaint and a found item logged at the time they
// are entered, the same paste imported twice, and two devices of one team meeting through the team sync (the sync
// server is a fake inside the test: nothing leaves this machine, and every name and room is fictional).
import { test, expect } from "./fixtures.mjs";

const LANGS = [
  { lang: "en", base: "", delay: "Delay", zone: "North" },
  { lang: "de", base: "/de", delay: "Verspätung", zone: "Nord" },
  { lang: "sq", base: "/sq", delay: "Vonesë", zone: "Veri" },
];
// The stored work of a tool, whatever suffix its key has in this language.
const stored = (page, prefix) => page.evaluate((p) => {
  // The tools write when the page is left (and at once where they must): ask for it as leaving does.
  window.dispatchEvent(new Event("pagehide"));
  const key = Object.keys(localStorage).find((k) => k === p || (k.startsWith(`${p}-`) && /^-(de|sq)$/.test(k.slice(p.length))));
  return key ? JSON.parse(localStorage.getItem(key)) : null;
}, prefix);

for (const { lang, base, delay, zone } of LANGS) {
  test(`${lang}: the CX Control Tower opens its Root causes, in the page's language, and hands the top cause on`, async ({ page }) => {
    await page.goto(`${base}/tools/cx-control-tower/`);
    await page.locator('[data-tab="causes"]').click();
    await expect(page.locator('main a[href*="action-tracker"]').first()).toBeVisible();
    // The example speaks the page's language: an incident type and a zone of it.
    // (in the page, shown or as a choice of a filter).
    await expect(page.locator("main").getByText(delay, { exact: true }).first()).toBeAttached();
    await page.locator('[data-tab="operations"]').click();
    await expect(page.locator("main").getByText(zone, { exact: true }).first()).toBeAttached();
  });

  test(`${lang}: the Action Tracker keeps an action through a reload and says when one is not added`, async ({ page }) => {
    await page.goto(`${base}/tools/action-tracker/`);
    const entry = page.locator("[data-action-tracker] [data-entry]");
    const add = async (title, owner) => {
      await entry.locator('[name="title"]').fill(title);
      await entry.locator('[name="owner"]').fill(owner);
      await entry.locator('[name="title"]').press("Enter");
    };
    await add("Check the fire door of dock 4", "Ana");
    const own = () => page.evaluate(() => window.ActionsStore.list().map((row) => `${row.title} (${row.owner})`));
    expect(await own()).toEqual(["Check the fire door of dock 4 (Ana)"]);
    await add("Check the fire door of dock 4", "Ben");
    expect(await own()).toHaveLength(1);
    await expect(page.locator("[data-entry-status]")).toHaveText(await page.evaluate(() => window.ToolKit.actionRefused("duplicate")));
    await expect(entry.locator('[name="title"]')).toHaveValue("Check the fire door of dock 4");
    await page.reload();
    expect(await own()).toEqual(["Check the fire door of dock 4 (Ana)"]);
    await expect(page.locator("[data-list] li")).toHaveCount(1);
  });

  test(`${lang}: a complaint and a found item are logged at the minute they are entered; the same paste is imported once`, async ({ page }) => {
    const minute = () => page.evaluate(() => new Date().toTimeString().slice(0, 5));
    const near = (time, now) => { const m = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3)); return Math.abs(m(time) - m(now)) <= 1 || Math.abs(m(time) - m(now)) >= 1439; };

    await page.goto(`${base}/tools/guest-complaints/`);
    const complaint = page.locator("[data-entry]").first();
    await complaint.locator('[name="room"]').fill("214");
    await complaint.locator('[name="what"]').fill("No hot water (test)");
    await complaint.locator('button[type="submit"]').first().click();
    const complaints = (await stored(page, "sc-guest-complaints")).rows.filter((row) => row.what === "No hot water (test)");
    expect(complaints).toHaveLength(1);
    expect(near(complaints[0].time, await minute()), `logged at ${complaints[0].time}`).toBe(true);

    await page.goto(`${base}/tools/lost-found/`);
    const found = page.locator("[data-entry]").first();
    await found.locator('[name="what"]').fill("Black scarf (test)");
    await found.locator('button[type="submit"]').first().click();
    const items = (await stored(page, "sc-lost-found")).rows.filter((row) => row.what === "Black scarf (test)");
    expect(items).toHaveLength(1);
    expect(near(items[0].time, await minute()), `logged at ${items[0].time}`).toBe(true);
    // The button of the row names itself by the words on it.
    const open = page.locator(".lf-open").first();
    expect((await open.getAttribute("aria-label")).startsWith((await open.textContent()).trim())).toBe(true);

    const before = (await stored(page, "sc-lost-found")).rows.length;
    const pasted = "2026-10-20\t09:15\tRooms\t214\tElectronics\tPhone charger\tLow\tAna\tOffice\t17\tMr Smith\tStored\n2026-10-21\t10:00\tLobby\t\tClothing\tBlue umbrella\tLow\tBen\tOffice\t18\t\tStored";
    // The paste box sits in a folded part of the page.
    await page.locator("#lf-paste").evaluate((box) => { for (let fold = box.closest("details"); fold; fold = fold.parentElement?.closest("details")) fold.open = true; });
    for (let round = 0; round < 2; round++) {
      await page.locator("#lf-paste").fill(pasted);
      await page.locator("[data-import]").click();
      await expect(page.locator("[data-import-status]")).not.toHaveText("");
    }
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    expect((await stored(page, "sc-lost-found")).rows.length).toBe(before + 2);
  });
}

test("two devices of one team meet through the sync: a correction stays, a board keeps both changes, and nothing leaves in the clear", async ({ page, browser, baseURL }) => {
  // The sync server as the Worker answers, kept in the test; both devices' requests to the real address land here.
  const spaces = new Map();
  const seen = [];
  const serve = async (route) => {
    const request = route.request();
    const id = /\/v1\/spaces\/([0-9a-f]{64})$/.exec(new URL(request.url()).pathname)?.[1];
    const reply = (status, body) => route.fulfill({ status, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Authorization, Content-Type", "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS" }, body: body === undefined ? "" : JSON.stringify(body) });
    if (request.method() === "OPTIONS") return reply(204);
    if (!id) return reply(404, { error: "not-found" });
    const meta = spaces.get(id);
    if (request.method() === "GET") return meta ? reply(200, { rev: meta.rev, updated: meta.updated, iv: meta.iv, data: meta.data }) : reply(404, { error: "empty" });
    const token = /^Bearer ([0-9a-f]{64})$/.exec((await request.allHeaders()).authorization || "")?.[1];
    if (!token) return reply(401, { error: "token" });
    if (meta && meta.token !== token) return reply(403, { error: "token" });
    const body = JSON.parse(request.postData());
    seen.push(request.postData());
    if (body.rev !== (meta ? meta.rev : 0)) return reply(409, { rev: meta ? meta.rev : 0 });
    spaces.set(id, { rev: body.rev + 1, updated: Date.now(), iv: body.iv, data: body.data, token });
    return reply(200, { rev: body.rev + 1, updated: Date.now() });
  };
  const SERVER = /^https:\/\/stiven-catalyst-sync\.[a-z0-9.-]+\//;
  const other = await browser.newContext();
  await other.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (route) => route.abort());
  await other.route(SERVER, serve);
  await page.context().route(SERVER, serve);
  const second = await other.newPage();
  const errors = [];
  second.on("pageerror", (error) => errors.push(error.message));

  const entry = (status) => ({ status, at: "", flags: [], attendant: "", note: "", started: "", ooo: null });
  const board = { rooms: [{ number: "101", floor: "1", type: "double" }, { number: "205", floor: "2", type: "double" }], board: { 101: entry("vd"), 205: entry("occ") }, history: { "2026-10-27": [] }, attendants: [], arrivals: {}, filters: {}, day: "2026-10-27", example: false };
  const log = { rows: [{ date: "2026-10-26", stage: "Loading", type: "Crushed", units: 1, note: "pallet (test)" }, { date: "2026-10-26", stage: "Loading", type: "Wet", units: 2, note: "carton (test)" }] };
  const sync = (p, create = false) => p.evaluate(async (make) => {
    const keys = await window.TeamSyncMath.deriveKeys("acid-acorn-acre-acts-afar-affix", 1000);
    const endpoint = document.querySelector("[data-team-sync]").dataset.endpoint;
    const result = await window.TeamSync.syncOnce({ endpoint, fetch: (...args) => window.fetch(...args), storage: localStorage, keys, selected: (key) => key === "sc-room-status" || key === "sc-damage-control", create: make });
    return result.status;
  }, create);
  const put = (p, key, value) => p.evaluate(([k, v]) => localStorage.setItem(k, JSON.stringify(v)), [key, value]);
  const get = (p, key) => p.evaluate((k) => JSON.parse(localStorage.getItem(k)), key);

  await page.goto("/tools/room-status/");
  await second.goto(`${baseURL}/tools/room-status/`);
  await put(page, "sc-room-status", board);
  await put(page, "sc-damage-control", log);
  expect(await sync(page, true)).toBe("synced");
  expect(await sync(second)).toBe("synced");
  expect((await get(second, "sc-damage-control")).rows).toHaveLength(2);

  // A correction and a removal on the first device; a room changed on each.
  await put(page, "sc-damage-control", { rows: [{ ...log.rows[0], units: 5 }] });
  const change = (p, room, status) => p.evaluate(([r, s]) => { const state = JSON.parse(localStorage.getItem("sc-room-status")); state.board[r] = { ...state.board[r], status: s }; state.history["2026-10-27"].push({ t: "10:00", room: r, kind: "status", from: "", to: s, who: "" }); localStorage.setItem("sc-room-status", JSON.stringify(state)); }, [room, status]);
  await change(page, "101", "vc");
  await change(second, "205", "co");
  for (const device of [page, second, page, second]) expect(await sync(device)).toBe("synced");
  for (const device of [page, second]) {
    expect((await get(device, "sc-damage-control")).rows.map((row) => `${row.note}:${row.units}`)).toEqual(["pallet (test):5"]);
    const state = await get(device, "sc-room-status");
    expect([state.board[101].status, state.board[205].status]).toEqual(["vc", "co"]);
    expect(state.history["2026-10-27"].map((event) => event.room).sort()).toEqual(["101", "205"]);
  }
  // What went to the server is sealed: none of the words of the work is in it.
  expect(seen.length).toBeGreaterThan(1);
  for (const body of seen) expect(/pallet|carton|Loading|rooms|"101"/.test(body)).toBe(false);
  expect(errors).toEqual([]);
  await other.close();
});
