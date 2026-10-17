// Five reader journeys through the built site, run in every project of playwright.config.mjs (three widths, two
// themes, with and without motion). Each one does what a reader does and checks what the page does in return; the
// main pages of each journey also go through axe-core (fixtures.mjs). Selectors are the data-* hooks the scripts
// themselves use, so a change of wording or design does not break them.
import { readFile } from "node:fs/promises";
import { test, expect, expectTheme, expectAccessible } from "./fixtures.mjs";

// What the browser keeps under a key, parsed.
const stored = (page, key) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), key);

test("homepage → an essay, read to the end", async ({ page, theme }) => {
  await page.goto("/");
  await expectTheme(page, theme);
  await expectAccessible(page);

  // The first essay featured on the homepage.
  const link = page.locator('.feature-card a[href^="/insights/"]').first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(href);
  const article = page.locator("[data-article]");
  const id = await article.getAttribute("data-essay-id");
  expect(href).toContain(id);
  await expectAccessible(page);

  // Scrolled to the end, the essay counts as read (article.js keeps it in "sc-reading").
  await page.locator("[data-article] > :last-child").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect.poll(async () => (await stored(page, "sc-reading"))?.[id]?.done).toBe(true);
});

test("search → a result, by keyboard only", async ({ page, theme }) => {
  await page.goto("/");
  await expectTheme(page, theme);

  // Tab from the top of the page to the search link in the header, and follow it with Enter.
  const searchLink = page.locator('.site-header a[href="/search.html"]');
  for (let i = 0; i < 40 && !(await searchLink.evaluate((a) => a === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(searchLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/search\.html$/);

  // The field has the focus; typing searches, and the question goes into the address.
  const input = page.locator("[data-search-input]");
  await expect(input).toBeFocused();
  await page.keyboard.type("handover");
  const results = page.locator("[data-search-results] > li > a");
  await expect(results.first()).toBeVisible();
  await expect(page).toHaveURL(/\?q=handover$/);
  expect(await results.count()).toBeGreaterThan(1);
  // Every result shows where the word was found.
  for (const result of await results.all()) await expect(result.locator("mark").first()).toBeAttached();
  await expectAccessible(page);

  // Tab to the first result and open it.
  const first = results.first();
  const href = await first.getAttribute("href");
  for (let i = 0; i < 10 && !(await first.evaluate((a) => a === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(href);
  await expect(page.locator("main h1").first()).toBeVisible();

  // Back, the search is still there from the address.
  await page.goBack();
  await expect(input).toHaveValue("handover");
  await expect(results.first()).toHaveAttribute("href", href);
});

test("a Management Review issue → its text version → the next page in the reader", async ({ page, theme }) => {
  await page.goto("/magazine/management-review-nr-01.html");
  await expectTheme(page, theme);
  await expectAccessible(page);

  // On a phone the whole text is open from the start, above the magazine layout; on a wider screen "Read it as
  // text" opens it below the reader.
  const details = page.locator("[data-book-details]");
  if ((page.viewportSize()?.width || 0) <= 620) {
    await expect(details).toHaveAttribute("open");
    await expect(details.locator(".book-text-body")).toBeVisible();
  } else {
    await expect(details).not.toHaveAttribute("open");
    await page.locator("[data-book-text]").first().click();
    await expect(details).toHaveAttribute("open");
    await expect(details.locator(".book-text-body")).toBeVisible();
    await expect(page).toHaveURL(/#text$/);
  }

  // "Open the issue" brings the reader into view and lifts the cover.
  const where = page.locator("[data-book-where]");
  const scrub = page.locator("[data-book-scrub]");
  await expect(scrub).toHaveValue("1");
  await page.locator("[data-book-open]").first().click();
  await expect(scrub).toHaveValue("2");
  await expect(page.locator("[data-book-prev]")).toBeEnabled();

  // The next-page button, then the arrow key, each turn one page; the address and the browser remember where.
  await page.locator("[data-book-next]").click();
  await expect(scrub).toHaveValue("3");
  // The arrow keys turn pages only while the book is on screen (js/book.js watches at least 15% of it): with smooth
  // scrolling the book may still be moving into view, so wait for it, and give the observer a moment to report it.
  await expect(page.locator("[data-book]")).toBeInViewport({ ratio: 0.3 });
  await page.waitForTimeout(100);
  await page.locator("body").press("ArrowRight");
  await expect(scrub).toHaveValue("4");
  await expect(where).not.toHaveText("");
  await expect(page).toHaveURL(/#faqe-4$/);
  const slug = await page.locator("[data-book]").getAttribute("data-slug");
  expect(await page.evaluate((key) => localStorage.getItem(key), `sc-book-${slug}`)).toBe("4");
});

test("a tool opens on its example, and the example comes back after it is cleared", async ({ page, theme }) => {
  await page.goto("/tools/damage-control/");
  await expectTheme(page, theme);

  // A first visit shows the example's result at once, marked as an example, and writes nothing to the browser.
  const results = page.locator("[data-results]");
  const figure = results.locator(".result-head h2 span");
  await expect(figure).toHaveText(/^\d+(\.\d+)?%$/);
  const rate = await figure.textContent();
  const note = page.locator(".dl-example-note");
  await expect(note).toBeVisible();
  expect(await stored(page, "sc-damage-control")).toBeNull();
  await expectAccessible(page);

  // Cleared, the log is empty and offers the example again.
  await note.locator("button").click();
  await expect(note).toBeHidden();
  await expect(page.locator("[data-log-empty]")).toBeVisible();
  await expect(figure).toHaveCount(0);

  // Loaded on purpose, the same result returns, the log fills, and now it is kept in the browser.
  await page.locator("[data-example]").click();
  await expect(figure).toHaveText(rate);
  await expect(results).toBeFocused();
  await expect(page.locator("[data-log] tr").first()).toBeVisible();
  await expect.poll(async () => (await stored(page, "sc-damage-control"))?.rows?.length).toBeGreaterThan(0);
});

test("save an essay to My shelf → save all work to a file → restore it in an empty browser", async ({ page, theme }, testInfo) => {
  const essay = "/insights/the-tools-you-build-yourself/";
  await page.goto(essay);
  await expectTheme(page, theme);

  // The bookmark in the essay's header saves it; the header badge counts it.
  const save = page.locator("[data-shelf-save]").filter({ visible: true }).first();
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-shelf-count]").first()).toHaveText("1");

  // The shelf lists it.
  await page.goto("/shelf.html");
  const savedRow = page.locator(`[data-shelf-saved] li a[href="${essay}"]`);
  await expect(savedRow).toBeVisible();
  await expectAccessible(page);

  // "Save all my work" on the Tools page gives one file with the shelf in it.
  await page.goto("/tools.html");
  await expectAccessible(page);
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-work-save]").click()]);
  const file = testInfo.outputPath("work.json");
  await download.saveAs(file);
  const backup = JSON.parse(await readFile(file, "utf8"));
  expect(backup.format).toBe("stiven-catalyst-work");
  expect(JSON.parse(backup.items["sc-shelf"]).items.map((item) => item.u)).toContain(essay);

  // Another browser: nothing saved, the shelf is empty.
  await page.evaluate(() => localStorage.clear());
  await page.goto("/shelf.html");
  await expect(savedRow).toHaveCount(0);
  await expect(page.locator("[data-shelf-saved] .shelf-empty")).toBeVisible();

  // Opening the file (and confirming) brings the work back; the page reloads by itself.
  await page.goto("/tools.html");
  page.once("dialog", (dialog) => dialog.accept());
  const reloaded = page.waitForEvent("load");
  await page.locator("[data-work-open]").setInputFiles(file);
  await reloaded;
  await page.goto("/shelf.html");
  await expect(savedRow).toBeVisible();
  await expect(page.locator("[data-shelf-count]").first()).toHaveText("1");
});
