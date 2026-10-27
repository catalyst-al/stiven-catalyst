// "All your work in one file" with the photos, in a real Chromium: a photo taken in the 5S audit is kept by
// MediaStore (made smaller on a canvas, stored in IndexedDB "sc-media"), saved from the Tools page (which loads
// media-store.js only when it saves), and opened in an empty browser, where the same photo comes back. One width is
// enough: the journey checks storage, not layout.
import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures.mjs";

test("a 5S photo goes into the saved file and comes back in an empty browser", async ({ page, browser }, testInfo) => {
  await page.goto("/tools/five-s-audit/");
  // A small PNG made on a canvas, kept the way the audit keeps a photo.
  const kept = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 48;
    const context = canvas.getContext("2d");
    context.fillStyle = "#c33";
    context.fillRect(0, 0, 64, 48);
    const file = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    const record = await window.MediaStore.add(file, { tool: "five-s-audit", ref: "audit-1" });
    const bytes = [...new Uint8Array(await record.blob.arrayBuffer())];
    return { id: record.id, width: record.width, height: record.height, type: record.blob.type, bytes };
  });
  expect(kept.type).toBe("image/jpeg");

  await page.goto("/tools.html");
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-work-save]").click()]);
  const file = testInfo.outputPath("work.json");
  await download.saveAs(file);
  const backup = JSON.parse(await readFile(file, "utf8"));
  expect(backup.media.map((m) => [m.id, m.tool, m.ref, m.type])).toEqual([[kept.id, "five-s-audit", "audit-1", "image/jpeg"]]);
  await expect(page.locator("[data-work-status]")).toContainText("1");

  // Another browser, nothing in it.
  const context = await browser.newContext();
  const other = await context.newPage();
  await other.goto("/tools.html");
  other.once("dialog", (dialog) => dialog.accept());
  const reloaded = other.waitForEvent("load");
  await other.locator("[data-work-open]").setInputFiles(file);
  await reloaded;
  await other.goto("/tools/five-s-audit/");
  const back = await other.evaluate(async () => {
    const [record] = await window.MediaStore.list("five-s-audit", "audit-1");
    return record ? { id: record.id, width: record.width, height: record.height, type: record.blob.type, bytes: [...new Uint8Array(await record.blob.arrayBuffer())] } : null;
  });
  expect(back).toEqual(kept);
  await context.close();
});

test("the PIN of a shared computer locks the photos away and brings them back", async ({ page }, testInfo) => {
  await page.goto("/tools/five-s-audit/");
  const id = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    canvas.getContext("2d").fillRect(0, 0, 16, 16);
    const file = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    return (await window.MediaStore.add(file, { tool: "five-s-audit", ref: "audit-1" })).id;
  });
  expect(await page.evaluate(() => window.WorkLock.lock("246810"))).toBe("locked");
  await page.reload();
  await expect(page.locator("[data-work-lock-dialog]")).toBeVisible();
  expect(await page.evaluate(async () => (await window.MediaStore.list("five-s-audit")).length)).toBe(0);
  expect(await page.evaluate(() => window.WorkLock.unlock("246810"))).toBe("unlocked");
  await page.reload();
  expect(await page.evaluate(async () => (await window.MediaStore.list("five-s-audit")).map((record) => record.id))).toEqual([id]);
});
