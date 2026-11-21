// "Today", the pilot's work page, in the browser (js/today.js, js/work-nav.js; docs/plan-sot-2026-11-11/PLANI.md,
// step 6), at every width and in both themes: the first shift is started here by keyboard, forms are left unfinished
// in two shifts, the clock passes midnight, and the shift is closed here and then looked at on the Shift Handover.
import { test, expect, expectAccessible as checkAccessible } from "./fixtures.mjs";

// The accessibility check on the page as it stands once it has settled. The work box every tool page carries (the
// PIN lock's select in it) fades in as it is scrolled into view; on a page as short as this one it sits at the edge
// of the window, and with motion on axe measured its colours half way (contrast 1.3 to 3.5, another value each run).
// The check here is of the settled page: what moves is brought to its end first.
const expectAccessible = async (page) => {
  if (!(await page.locator("style[data-settled]").count())) await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; }" }).then((tag) => tag.evaluate((node) => node.setAttribute("data-settled", "")));
  await checkAccessible(page);
};

const prefix = (lang) => (lang === "en" ? "" : `/${lang}`);
const HANDOVER = { en: "sc-shift-handover", de: "sc-shift-handover-de", sq: "sc-shift-handover-sq" };
const everything = (page) => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map((key) => [key, localStorage.getItem(key)])));
const handover = (page, lang) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), HANDOVER[lang]);
const active = (page) => page.evaluate(() => window.ShiftContext.active());
const noSideScroll = async (page) => expect(await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
const pilotOn = (page) => page.addInitScript(() => { if (!sessionStorage.getItem("pilot-set")) { localStorage.setItem("sc-shift-close-ui", JSON.stringify({ v: 1, on: true, set: 1 })); sessionStorage.setItem("pilot-set", "1"); } });

for (const lang of ["en", "de", "sq"]) {
  test(`${lang}: the first shift is started on Today by keyboard, two shifts leave forms, and the shift closed here is closed on the Handover page`, async ({ page }) => {
    // A long journey over four pages: on a loaded machine it ran out of the usual thirty seconds once.
    test.setTimeout(90_000);
    page.on("dialog", (dialog) => dialog.accept());
    await pilotOn(page);
    await page.goto(`${prefix(lang)}/tools/today/`);
    // A device that never started a shift: the page reads, and asks.
    await expect(page.locator("[data-today-cards]")).toBeVisible();
    await expect(page.locator("[data-work-nav]")).toBeVisible();
    await expect(page.locator("[data-start]")).toBeVisible();
    await expect(page.locator("[data-today-handover] .sh-setup")).toBeHidden();
    await expect(page.locator("[data-today-handover] [data-output]")).toBeHidden();
    expect(await active(page)).toBeNull();
    expect(Object.keys(await everything(page)).filter((key) => key.startsWith("sc-shift"))).toEqual(["sc-shift-close-ui"]);
    await expectAccessible(page);
    await noSideScroll(page);
    // By keyboard: the start button of the handover's own panel.
    await page.locator("[data-start-shift]").focus();
    await page.keyboard.press("Enter");
    const first = await active(page);
    expect(first.list).toBe(lang);
    await expect(page.locator("[data-today-phase]")).toHaveCount(3);
    await expect(page.locator("[data-wn-shift]")).toContainText(first.label);
    await expect(page.locator("[data-start]")).toBeHidden();
    await expectAccessible(page);
    // The bar leads on: + Log opens Damage Control, where a form is left unfinished.
    await page.locator('[data-wn="log"]').click();
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/damage-control/$`));
    // The work view is on (its scripts have run) before anything is typed.
    await expect(page.locator("[data-work-head]")).toBeVisible();
    await page.locator('[data-entry] [name="note"]').fill("Left in the first shift");
    await page.locator('[data-wn="today"]').click();
    await expect(page.locator("[data-today-draft]")).toHaveCount(1);
    await expect(page.locator("[data-today-draft]")).toHaveAttribute("data-today-draft-state", "waiting:this");
    // The phase by keyboard, then the shift is closed here.
    await page.locator('[data-today-phase="end"]').focus();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-today-phase="end"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-today-phase="end"]')).toBeFocused();
    await expectAccessible(page);
    await noSideScroll(page);
    await page.locator("[data-today-close]").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-start]")).toBeVisible();
    expect(await active(page)).toBeNull();
    await expect(page.locator("[data-wn-shift]")).toHaveClass(/is-unset/);
    // The form of the closed shift is still listed, as a closed shift's.
    await expect(page.locator("[data-today-draft]")).toHaveAttribute("data-today-draft-state", "waiting:closed");
    // Looked at on the Handover page: closed, by the same mechanism.
    await page.locator('[data-wn="handover"]').click();
    await expect(page).toHaveURL(new RegExp(`${prefix(lang)}/tools/shift-handover/$`));
    const closed = await handover(page, lang);
    expect(closed.idle).toBe(true);
    expect(closed.history[0].closeId).toMatch(/^c[a-z0-9]{15}$/);
    expect([closed.history[0].handover.date, closed.history[0].handover.shift]).toEqual([first.date, first.label]);
    expect(closed.history[0].drafts).toBe(1);
    await expect(page.locator("[data-start]")).toBeVisible();
    await expect(page.locator("[data-history] details")).toHaveCount(1);
    // The next shift is started back on Today; a second form is left in it.
    await page.locator('[data-wn="today"]').click();
    await page.locator("[data-start-shift]").click();
    const second = await active(page);
    expect([second.date, second.label]).not.toEqual([first.date, first.label]);
    await page.locator('[data-wn="log"]').click();
    // The work view is on (its scripts have run) before anything is typed.
    await expect(page.locator("[data-work-head]")).toBeVisible();
    await page.locator('[data-entry] [name="note"]').fill("Of the second shift");
    await page.locator('[data-wn="today"]').click();
    await expect(page.locator("[data-today-draft]")).toHaveCount(2);
    expect((await page.locator("[data-today-draft]").evaluateAll((nodes) => nodes.map((node) => node.dataset.todayDraftState))).sort()).toEqual(["waiting:closed", "waiting:this"]);
    await expectAccessible(page);
    await noSideScroll(page);
    // Opening Today moved nothing: both drafts are where they were.
    const before = await everything(page);
    await page.reload();
    expect(await everything(page)).toEqual(before);
  });
}

test("after midnight the operative date stays: the page says so, the shift is the same, and an entry gets the shift's date", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await pilotOn(page);
  await page.clock.install({ time: new Date("2026-11-11T21:30:00") });
  await page.goto("/tools/today/");
  await page.locator('[name="start-shift"]').selectOption("Night");
  await page.locator("[data-start-shift]").click();
  expect((await active(page)).date).toBe("2026-11-11");
  await expect(page.locator("[data-today-midnight]")).toHaveCount(0);
  // 00:20 the next day.
  await page.clock.setFixedTime(new Date("2026-11-12T00:20:00"));
  await page.reload();
  await expect(page.locator("[data-today-midnight]")).toBeVisible();
  await expect(page.locator("[data-today-midnight]")).toContainText("Night");
  expect([(await active(page)).date, (await active(page)).label]).toEqual(["2026-11-11", "Night"]);
  await expect(page.locator("[data-start]")).toBeHidden();
  // No accessibility check here: the test holds the browser's clock still, which also holds what the page draws with
  // it, and axe then reads colours the page never shows. The same page is checked in the journeys above.
  await page.locator('[data-wn="log"]').click();
  // The work view is on (its scripts have run) before anything is typed.
  await expect(page.locator("[data-work-head]")).toBeVisible();
  await page.locator('[data-entry] [name="note"]').fill("After midnight");
  await page.locator('[data-entry] [type="submit"]').click();
  const rows = await page.evaluate(() => JSON.parse(localStorage.getItem("sc-damage-control")).rows.filter((row) => row.note === "After midnight"));
  expect(rows).toEqual([expect.objectContaining({ date: "2026-11-11", shift: "Night" })]);
  await page.locator('[data-wn="today"]').click();
  await expect(page.locator("[data-today-damage] strong")).toHaveText("1");
});

test("without the pilot Today says so and the bar is on none of the pages", async ({ page }) => {
  await page.goto("/tools/today/");
  await expect(page.locator("[data-today-off]")).toContainText("The pilot is not on, on this device");
  await expect(page.locator("[data-today-cards]")).toBeHidden();
  await expect(page.locator("[data-work-nav]")).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("sc-shift-close-ui"))).toBeNull();
  await expectAccessible(page);
  for (const slug of ["damage-control", "shift-handover", "action-tracker"]) {
    await page.goto(`/tools/${slug}/`);
    await expect(page.locator("[data-work-nav]")).toBeHidden();
  }
});
