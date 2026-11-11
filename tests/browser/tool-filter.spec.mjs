// Phase 5C (audit P1-03): the filter field of the Tools page in a real browser, at every width and theme of the
// projects. A named tool is found in a few keystrokes in English, German and Albanian; the field stays where it is
// while the list changes; Escape and the clear button bring the whole page back; the keyboard reaches the matches; the
// role cards still lead to their roles; nothing typed leaves the page (no request, no storage, no address); and
// without scripts the page lists every tool as before.
import { test, expect, expectAccessible } from "./fixtures.mjs";

const PAGES = { en: "/tools.html", de: "/de/tools.html", sq: "/sq/tools.html" };
const visibleCards = (page) => page.locator(".family-section:not([hidden]) .tool-card:not([hidden])");
const names = (page) => visibleCards(page).locator("h3").allTextContents().then((list) => list.map((s) => s.trim()));
const noSideScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

for (const [lang, query, first, total] of [
  ["en", "night audit", "Night Audit Log", "1 of 59 tools"],
  ["de", "night audit", "Night-Audit-Protokoll", "1 von 59 Tools"],
  ["sq", "night audit", "Regjistri i Night Audit", "1 nga 59 mjete"],
]) {
  test(`${lang}: a named tool is found by typing, and Escape brings every tool back`, async ({ page }) => {
    await page.goto(PAGES[lang]);
    const field = page.locator("[data-tool-filter-input]");
    await expect(field).toBeVisible();
    await expect(visibleCards(page)).toHaveCount(59);
    await expect(page.locator(".family-section:not([hidden])")).toHaveCount(4);
    // In the first screen, a large enough target, the page no wider than the screen.
    const box = await field.locator("xpath=..").boundingBox();
    const { height } = page.viewportSize();
    expect(box.y + box.height, "the field is in the first screen").toBeLessThan(height);
    expect(box.height, "the field is at least 44 px high").toBeGreaterThanOrEqual(44);
    expect(await noSideScroll(page)).toBe(true);

    await field.pressSequentially(query);
    await expect(visibleCards(page)).toHaveCount(1);
    expect(await names(page)).toEqual([first]);
    await expect(page.locator("[data-tool-filter-count]")).toHaveText(total);
    await expect(page.locator(".family-index")).toBeHidden();
    await expect(page.locator(".family-section:not([hidden])")).toHaveCount(1);
    // The field did not move while the list changed under it.
    const after = await field.locator("xpath=..").boundingBox();
    expect(Math.round(after.y)).toBe(Math.round(box.y));
    expect(await noSideScroll(page)).toBe(true);
    // The match is the first thing under the field: its card starts within the first screen.
    const card = await visibleCards(page).first().boundingBox();
    expect(card.y, "the first match starts in the first screen").toBeLessThan(height);
    await expectAccessible(page);

    // A word in the descriptions of several tools: the tool named by it comes first.
    await field.fill("pareto");
    expect((await names(page))[0]).toBe("Pareto 80/20");
    await expect(visibleCards(page)).toHaveCount(6);

    await field.press("Escape");
    await expect(field).toHaveValue("");
    await expect(visibleCards(page)).toHaveCount(59);
    await expect(page.locator(".family-section:not([hidden])")).toHaveCount(4);
    await expect(page.locator(".family-index")).toBeVisible();
    await expect(field).toBeFocused();
  });
}

// One test per language: three Tools pages and an axe run in one test came close to the 30 s limit in the projects
// with motion (23-29 s) and passed it once under load.
for (const [lang, words] of [["en", "No tool matches these words"], ["de", "Kein Tool passt zu diesen Wörtern"], ["sq", "Asnjë mjet nuk përputhet me këto fjalë"]]) {
  test(`${lang}: no match: a message in the page's language, then the clear button restores the page`, async ({ page }) => {
    await page.goto(PAGES[lang]);
    const field = page.locator("[data-tool-filter-input]");
    const clear = page.locator("[data-tool-filter-clear]");
    await expect(clear).toBeHidden();
    await field.fill("zzqx fictional");
    await expect(visibleCards(page)).toHaveCount(0);
    await expect(page.locator("[data-tool-filter-empty]")).toBeVisible();
    await expect(page.locator("[data-tool-filter-empty]")).toContainText(words);
    await expect(page.locator(".family-section:not([hidden])")).toHaveCount(0);
    await expect(page.locator("[data-tool-filter-count]")).toHaveText(/^0 /);
    expect(await noSideScroll(page)).toBe(true);
    const target = await clear.boundingBox();
    expect(target.width >= 44 && target.height >= 44, "the clear button is a 44 px target").toBe(true);
    await expectAccessible(page);
    await clear.click();
    await expect(field).toHaveValue("");
    await expect(field).toBeFocused();
    await expect(visibleCards(page)).toHaveCount(59);
    await expect(page.locator("[data-tool-filter-empty]")).toBeHidden();
    await expect(clear).toBeHidden();
  });
}

test("the keyboard: Tab goes from the field to the clear button to the first match, Enter opens the way in", async ({ page }) => {
  await page.goto(PAGES.de);
  const field = page.locator("[data-tool-filter-input]");
  await field.focus();
  await page.keyboard.type("lebenslauf");
  await expect(visibleCards(page)).toHaveCount(3);
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-tool-filter-clear]")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator('.tool-card a.text-link[href="/de/tools/cv-builder/"]')).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(field).toBeFocused();
  // Enter in the field: the first match's link takes the focus; Enter again opens the tool.
  await field.fill("night audit");
  await field.press("Enter");
  const link = page.locator('.tool-card a.text-link[href="/de/tools/night-audit/"]');
  await expect(link).toBeFocused();
  await Promise.all([page.waitForURL("**/de/tools/night-audit/"), page.keyboard.press("Enter")]);
  await expect(page.locator("main h1")).toBeVisible();
});

test("a filtered tool's link opens the tool, and the role cards still lead to their roles", async ({ page }) => {
  await page.goto(PAGES.sq);
  await page.locator("[data-tool-filter-input]").fill("pareto");
  await Promise.all([page.waitForURL("**/sq/tools/pareto/"), visibleCards(page).first().locator("a.text-link").click()]);
  await expect(page.locator("main h1")).toBeVisible();
  // Back on the Tools page, cleared: the role card of the second role scrolls to its section.
  await page.goto(PAGES.en);
  await page.locator("[data-tool-filter-input]").fill("cv");
  await page.locator("[data-tool-filter-input]").press("Escape");
  const card = page.locator("nav.family-index a.family-card").nth(1);
  const id = (await card.getAttribute("href")).slice(1);
  await card.click();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(page.locator(`#${id}`)).toBeInViewport();
});

test("nothing typed leaves the page: no request, no storage, no change of address", async ({ page }) => {
  // What is still open from the load is noted (from #399), so a run that waits or fails here says what kept the
  // network busy. Nothing waits for the network to go quiet: on a first visit the service worker keeps the role's
  // tools in the background, so a quiet network came after about 1.2 s or, on a loaded runner, not within the 30 s of
  // the test (CI runs 861 and 863). Requests still arriving after the page is ready are recorded below and must pass
  // every check.
  const open = new Set();
  page.on("request", (request) => open.add(request));
  page.on("requestfinished", (request) => open.delete(request));
  page.on("requestfailed", (request) => open.delete(request));
  await page.goto(PAGES.en, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // Ready when the filter answers. The number of tools comes from the cards on the page, not from this file.
  const total = await page.locator(".family-section .tool-card").count();
  expect(total, "the page lists its tools").toBeGreaterThan(0);
  const count = page.locator("[data-tool-filter-count]");
  await expect(count).toHaveText(new RegExp(`^${total}\\b`));
  const atRest = await count.textContent();
  const ready = page.locator("[data-tool-filter-input]");
  await ready.fill("zzqx");
  await expect(count).toHaveText(/^0 /);
  await ready.fill("");
  // Cleared: the count reads as it did before the search, and every card is shown again.
  await expect(count).toHaveText(atRest);
  await expect(visibleCards(page)).toHaveCount(total);
  if (open.size) console.log(`${page.url()}: still open when the filter was ready: ${[...open].map((r) => `${r.resourceType()} ${r.url()}`).join(", ")}`);
  // Fictional saved work and a fictional hand-off note, to show the filter leaves them as they are.
  await page.evaluate(() => {
    localStorage.setItem("sc-actions", JSON.stringify([{ id: "fx1", title: "Fictional action: tidy the returns shelf" }]));
    sessionStorage.setItem("sc-action-handoff", JSON.stringify({ fictionaltoken01: { title: "Fictional hand-off" } }));
  });
  const snapshot = () => page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, url: location.href, cookie: document.cookie }));
  const before = await snapshot();
  // Every file the page already names (scripts, styles, the previews of the cards, which load lazily when a filtered
  // card comes into view): a request while typing may only be one of these.
  const named = await page.evaluate(() => document.documentElement.outerHTML);
  const seen = [];
  page.on("request", (request) => seen.push({ url: request.url(), method: request.method(), body: request.postData() || "" }));
  const field = page.locator("[data-tool-filter-input]");
  for (const typed of ["fictionalroom512", "night audit", "pareto"]) {
    await field.fill("");
    await field.pressSequentially(typed);
  }
  await field.press("Escape");
  await page.waitForTimeout(500);
  expect(seen.filter((r) => `${r.url} ${r.body}`.toLowerCase().includes("fictionalroom512")), "no request carries the typed text").toEqual([]);
  for (const r of seen) {
    const url = new URL(r.url);
    expect(r.method, r.url).toBe("GET");
    expect(r.body, r.url).toBe("");
    expect(url.origin, "nothing leaves the site").toBe(new URL(page.url()).origin);
    expect(url.search === "" || /^\?v=[0-9a-f]+$/.test(url.search), `${r.url}: no query but a file version`).toBe(true);
    expect(named.includes(url.pathname), `${r.url}: a file the page already named`).toBe(true);
  }
  expect(await snapshot()).toEqual(before);
});

test("without scripts the field is not drawn and every tool is listed", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  await page.goto(PAGES.en);
  await expect(page.locator("[data-tool-filter]")).toBeHidden();
  await expect(page.locator(".family-section .tool-card")).toHaveCount(59);
  await expect(page.locator(".family-section .tool-card").last()).toBeVisible();
  await expect(page.locator("nav.family-index")).toBeVisible();
  expect(await page.locator(".family-section .tool-card a.text-link").count()).toBe(59);
  await context.close();
});
