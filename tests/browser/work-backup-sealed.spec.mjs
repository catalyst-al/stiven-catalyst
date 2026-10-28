// "All your work in one file" sealed with a password (playwright.config.mjs runs this file in the 1440 px light
// project only): the file saved with the box ticked holds nothing readable, opens only with its password, and a wrong
// password changes nothing. Fictional data: the example shift of the handover tool.
import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures.mjs";

const stored = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);

test("a work file sealed with a password: unreadable, refused with the wrong password, opened with the right one", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/tools/shift-handover/");
  await page.locator("[data-example]").click();
  const work = await stored(page, "sc-shift-handover");
  expect(work).toContain("Arben");
  // Save with the password.
  await page.locator("[data-work-seal]").check();
  await page.locator("[data-work-save]").click();
  const dialog = page.locator("[data-work-password-dialog]");
  await expect(dialog).toBeVisible();
  await dialog.locator("[name=password]").fill("short");
  await dialog.locator("button[type=submit]").click();
  await expect(dialog.locator("[data-work-password-error]")).toContainText("at least 8");
  await dialog.locator("[name=password]").fill("night-shift-2026");
  await dialog.locator("[name=again]").fill("night-shift-2027");
  await dialog.locator("button[type=submit]").click();
  await expect(dialog.locator("[data-work-password-error]")).toContainText("differ");
  await dialog.locator("[name=again]").fill("night-shift-2026");
  const [download] = await Promise.all([page.waitForEvent("download"), dialog.locator("button[type=submit]").click()]);
  expect(download.suggestedFilename()).toMatch(/^stiven-catalyst-\d{4}-\d{2}-\d{2}\.sealed\.json$/);
  const text = await readFile(await download.path(), "utf8");
  const file = JSON.parse(text);
  expect(file.format).toBe("stiven-catalyst-work-sealed");
  expect(text).not.toContain("Arben");
  expect(text).not.toContain("sc-shift-handover");
  await expect(page.locator("[data-work-status]")).toContainText("Saved sealed", { timeout: 20_000 });

  // Another device with no work: the wrong password opens nothing; the right one brings the work.
  await page.evaluate(() => localStorage.removeItem("sc-shift-handover"));
  await page.reload();
  expect(await stored(page, "sc-shift-handover")).toBeNull();
  // Count the dialog's live listeners: each way of closing it (Esc, Cancel, Continue) must leave none behind.
  await page.evaluate(() => {
    const dialog = document.querySelector("[data-work-password-dialog]");
    const form = dialog.querySelector("form");
    const live = { submit: 0, close: 0, click: 0 };
    const watch = (target, type) => {
      const add = target.addEventListener.bind(target);
      const remove = target.removeEventListener.bind(target);
      target.addEventListener = (kind, ...rest) => { if (kind === type) live[type] += 1; return add(kind, ...rest); };
      target.removeEventListener = (kind, ...rest) => { if (kind === type) live[type] -= 1; return remove(kind, ...rest); };
    };
    watch(form, "submit");
    watch(dialog, "close");
    watch(dialog.querySelector("[data-work-password-cancel]"), "click");
    window.__wbLive = live;
  });
  const live = () => page.evaluate(() => ({ ...window.__wbLive }));
  const open = async (password) => {
    await page.locator("[data-work-open]").setInputFiles({ name: "work.sealed.json", mimeType: "application/json", buffer: Buffer.from(text) });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("[data-work-password-again]")).toBeHidden();
    await dialog.locator("[name=password]").fill(password);
    await dialog.locator("button[type=submit]").click();
  };
  await open("night-shift-2027");
  await expect(page.locator("[data-work-status]")).toContainText("Wrong password", { timeout: 20_000 });
  expect(await stored(page, "sc-shift-handover")).toBeNull();
  expect(await live()).toEqual({ submit: 0, close: 0, click: 0 });
  // Cancelled: nothing happens.
  await page.locator("[data-work-open]").setInputFiles({ name: "work.sealed.json", mimeType: "application/json", buffer: Buffer.from(text) });
  await expect(dialog).toBeVisible();
  expect(await live()).toEqual({ submit: 1, close: 1, click: 1 });
  await dialog.locator("[data-work-password-cancel]").click();
  await expect(dialog).toBeHidden();
  expect(await stored(page, "sc-shift-handover")).toBeNull();
  expect(await live()).toEqual({ submit: 0, close: 0, click: 0 });
  // Closed with Esc: nothing happens, no listener stays, and the dialog opens again clean.
  await page.locator("[data-work-open]").setInputFiles({ name: "work.sealed.json", mimeType: "application/json", buffer: Buffer.from(text) });
  await expect(dialog).toBeVisible();
  await dialog.locator("[name=password]").fill("night-shift-2026");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(await stored(page, "sc-shift-handover")).toBeNull();
  expect(await live()).toEqual({ submit: 0, close: 0, click: 0 });
  // After Esc, the wrong password is still refused once, with a clean field; then the right one works.
  await page.locator("[data-work-open]").setInputFiles({ name: "work.sealed.json", mimeType: "application/json", buffer: Buffer.from(text) });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[name=password]")).toHaveValue("");
  await expect(dialog.locator("[data-work-password-error]")).toHaveText("");
  await dialog.locator("[name=password]").fill("short");
  await dialog.locator("button[type=submit]").click();
  await expect(dialog.locator("[data-work-password-error]")).toContainText("at least 8");
  await dialog.locator("[name=password]").fill("night-shift-2027");
  await dialog.locator("button[type=submit]").click();
  await expect(page.locator("[data-work-status]")).toContainText("Wrong password", { timeout: 20_000 });
  await expect(dialog).toBeHidden();
  expect(await stored(page, "sc-shift-handover")).toBeNull();
  expect(await live()).toEqual({ submit: 0, close: 0, click: 0 });
  // The right password: the usual confirmation, then the work is back and the page reloads with it.
  page.once("dialog", (d) => d.accept());
  await open("night-shift-2026");
  await expect.poll(() => stored(page, "sc-shift-handover"), { timeout: 20_000 }).toContain("Arben");
  // A plain file still opens as before.
  const plain = JSON.stringify({ format: "stiven-catalyst-work", version: 1, exported: "2026-10-28T10:00:00.000Z", items: { "sc-five-whys": JSON.stringify({ problem: "Dock 4 door jams" }) } });
  await page.waitForTimeout(1200);
  page.once("dialog", (d) => d.accept());
  await page.locator("[data-work-open]").setInputFiles({ name: "work.json", mimeType: "application/json", buffer: Buffer.from(plain) });
  await expect.poll(() => stored(page, "sc-five-whys"), { timeout: 20_000 }).toContain("Dock 4");
});
