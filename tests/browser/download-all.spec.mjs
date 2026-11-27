// "Download all" in a real browser (js/download-all.js): one section of the Downloads page as a ZIP, made in the
// browser from the files of the site. The archive is opened here and checked the way a ZIP program checks it: its
// end record counts the files, every name is in the section's folder, and every file's CRC-32 matches its bytes.
import { test, expect } from "./fixtures.mjs";
import { readFile } from "node:fs/promises";

const table = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (bytes) => {
  let c = 0xffffffff;
  for (const b of bytes) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

// One project is enough for a download: the others leave this spec out (playwright.config.mjs).
test("one section of the Downloads page comes as a ZIP that a ZIP program opens", async ({ page }) => {
  await page.goto("/sq/downloads.html");
  const button = page.locator('[data-download-all][data-section="floor"]');
  await expect(button).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent("download"), button.click()]);
  expect(download.suggestedFilename()).toMatch(/^stiven-catalyst-sq-floor-\d{4}-\d{2}-\d{2}\.zip$/);
  await expect(page.locator("#download-all-status-floor")).toContainText(download.suggestedFilename());
  const zip = new DataView((await readFile(await download.path())).buffer);
  const end = zip.byteLength - 22;
  expect(zip.getUint32(end, true)).toBe(0x06054b50);
  const count = zip.getUint16(end + 10, true);
  const manifest = await (await page.request.get("/downloads/all-sq.json")).json();
  const expected = manifest.sections.find((s) => s.id === "floor").files;
  expect(count).toBe(expected.length);
  let at = 0;
  const names = [];
  for (let i = 0; i < count; i++) {
    expect(zip.getUint32(at, true)).toBe(0x04034b50);
    const crc = zip.getUint32(at + 14, true);
    const size = zip.getUint32(at + 18, true);
    const nameLength = zip.getUint16(at + 26, true);
    const name = new TextDecoder().decode(new Uint8Array(zip.buffer, at + 30, nameLength));
    const data = new Uint8Array(zip.buffer, at + 30 + nameLength, size);
    expect(crc32(data), name).toBe(crc);
    names.push(name);
    at += 30 + nameLength + size;
  }
  expect(names).toEqual(expected.map((f) => `${manifest.archive}/${f.name}`));
});
