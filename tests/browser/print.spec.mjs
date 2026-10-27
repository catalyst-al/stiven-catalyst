// Print and "Save as PDF" in a real Chromium (audit T-09/P2A-06, T-10/P2B-06, T-24/P2C-03, M-05/PM-5): the page is
// printed as the reader's Ctrl+P prints it (print media, A4, the page's own @page size when it sets one), and the PDF
// is read back with the site's own pdf.js, in the browser.
//   - Tables: every header cell and every cell of the last row of every table on the page is on paper. Each cell is
//     tagged first with a short unique word in its top right corner, out of the flow, so a column cut at the page's
//     edge (or by a box that scrolls on screen) loses its tag. No table is wider than the page.
//   - A CV with one job of 70 bullet points prints all 70, the last one included.
//   - The charts of a Management Review issue print drawn, although the reader never scrolled to them.
// One project runs it (1440 px, dark theme, with motion): print does not depend on the window, and motion is the case
// in which the charts wait for the reader on screen.
import { test, expect } from "./fixtures.mjs";

const MARGIN = { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" };
const localPath = (lang, path) => (lang === "en" ? path : `/${lang}${path}`);

// The page as a PDF, the way the print dialog makes it.
const printPdf = async (page, options = {}) => {
  await page.emulateMedia({ media: "print" });
  return page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true, margin: MARGIN, ...options });
};

// The text of every page of a PDF, and the share of coloured (saturated) pixels on one page, read by pdf.js in a page
// of the test site.
const readPdf = async (browser, bytes, { inkOn = null } = {}) => {
  const context = await browser.newContext();
  const reader = await context.newPage();
  await reader.goto("/js/vendor/pdfjs/README.txt");
  const result = await reader.evaluate(async ({ data, inkOn }) => {
    const pdfjs = await import("/js/vendor/pdfjs/pdf.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = "/js/vendor/pdfjs/pdf.worker.min.mjs";
    const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    const doc = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
    const widthPt = (await doc.getPage(1)).getViewport({ scale: 1 }).width;
    const pages = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const content = await (await doc.getPage(n)).getTextContent();
      pages.push(content.items.map((item) => item.str).join(" "));
    }
    let ink = null;
    if (inkOn) {
      const n = pages.findIndex((text) => text.replace(/\s+/g, " ").includes(inkOn)) + 1;
      if (n > 0) {
        const pdfPage = await doc.getPage(n);
        const viewport = pdfPage.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;
        const { data: px } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let coloured = 0;
        for (let i = 0; i < px.length; i += 4) if (Math.max(px[i], px[i + 1], px[i + 2]) - Math.min(px[i], px[i + 1], px[i + 2]) > 60) coloured++;
        ink = { page: n, coloured: coloured / (px.length / 4) };
      }
    }
    await doc.destroy();
    return { pages, ink, widthPt };
  }, { data: Buffer.from(bytes).toString("base64"), inkOn });
  await context.close();
  return result;
};

// Every visible table of the page: wider than the paper, or cut by a box around it; and every header cell and cell of
// the last row tagged ("zq12x"). Returns what was found and the tags with the cell they stand for.
const tagTables = (page, paperWidth) => page.evaluate((W) => {
  const visible = (e) => { const s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && e.getClientRects().length > 0; };
  const found = { tables: 0, wide: [], clipped: [], tags: [] };
  for (const table of [...document.querySelectorAll("main table")].filter(visible)) {
    found.tables++;
    const name = String(table.className || "table").split(" ")[0];
    const box = table.getBoundingClientRect();
    if (box.right > W + 2) found.wide.push(`${name} ${Math.round(box.width)}px on ${W}px`);
    for (let a = table.parentElement; a && a !== document.body; a = a.parentElement) {
      if (getComputedStyle(a).overflowX !== "visible" && a.getBoundingClientRect().right + 2 < box.right) { found.clipped.push(`${name} in .${String(a.className).split(" ")[0]}`); break; }
    }
    const last = table.querySelector("tbody tr:last-child");
    for (const cell of [...table.querySelectorAll("thead th"), ...(last ? last.children : [])].filter(visible)) {
      const label = cell.innerText.trim().replace(/\s+/g, " ").slice(0, 40);
      if (!label) continue;
      const tag = `zq${found.tags.length}x`;
      const mark = document.createElement("span");
      mark.textContent = tag;
      mark.style.cssText = "position:absolute;right:1px;top:0;font:7px/1 monospace;white-space:nowrap;letter-spacing:0;text-transform:none";
      if (getComputedStyle(cell).position === "static") cell.style.position = "relative";
      cell.append(mark);
      found.tags.push([tag, `${cell.tagName.toLowerCase()} "${label}"`]);
    }
  }
  return found;
}, paperWidth);

// The tool with its example (loaded when the page does not open on it), at the printable width of A4 portrait.
const openTool = async (page, lang, slug) => {
  // window.print is the dialog; the PDF is made below.
  await page.addInitScript(() => { window.print = () => {}; });
  await page.goto(localPath(lang, `/tools/${slug}/`));
  await page.waitForLoadState("load");
  const example = page.locator("main [data-example]:visible").first();
  if (!(await page.locator(".dl-example-note").count()) && (await example.count())) await example.click();
  await page.waitForTimeout(300);
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 718, height: 1000 }); // A4 at 10 mm margins: 190 mm
};

const TOOLS = ["andon", "guest-complaints", "waste-log", "lost-found", "oee", "energy-tracker", "sigma-control-chart", "a3-report"];
for (const slug of TOOLS) {
  test(`${slug}: every column of every table is on paper, in English, German and Albanian`, async ({ page, browser }) => {
    test.setTimeout(90_000);
    for (const lang of ["en", "de", "sq"]) {
      await openTool(page, lang, slug);
      // A tool that prints on a landscape or an A3 sheet (@page) is measured at the width of that sheet.
      const { widthPt } = await readPdf(browser, await printPdf(page, { pageRanges: "1" }));
      const paper = Math.floor(((widthPt / 72) * 25.4 - 20) / 25.4 * 96);
      await page.setViewportSize({ width: paper, height: 1000 });
      const found = await tagTables(page, paper);
      expect(found.tables, `${lang} ${slug}: a table to print`).toBeGreaterThan(0);
      expect.soft(found.wide, `${lang} ${slug}: no table wider than the page`).toEqual([]);
      expect.soft(found.clipped, `${lang} ${slug}: no table cut by a box`).toEqual([]);
      const { pages } = await readPdf(browser, await printPdf(page));
      const text = pages.join(" ").replace(/\s+/g, "").toLowerCase();
      const missing = found.tags.filter(([tag]) => !text.includes(tag)).map(([, label]) => label);
      expect(missing, `${lang} ${slug}: cells not on paper`).toEqual([]);
      await page.emulateMedia({ media: "screen" });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
  });
}

test("CV Builder: a job with 70 bullet points prints all of them, the last one included", async ({ page, browser }) => {
  test.setTimeout(60_000);
  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/tools/cv-builder/");
  await page.locator('[data-act="example"]').first().click();
  await page.waitForFunction(() => localStorage.getItem("sc-cv-builder"));
  const bullets = Array.from({ length: 70 }, (_, i) => `Bullet number ${i + 1} with 3 results and a measurable outcome`).join("\n");
  await page.evaluate((text) => {
    const cv = JSON.parse(localStorage.getItem("sc-cv-builder"));
    cv.groups[0].entries[0].roles[0].bullets = `${text}\nFINAL-BULLET-MARKER`;
    localStorage.setItem("sc-cv-builder", JSON.stringify(cv));
  }, bullets);
  await page.reload();
  await page.waitForTimeout(800);
  const { pages } = await readPdf(browser, await printPdf(page));
  // Without spaces or hyphens: pdf.js returns a line in pieces, sometimes inside a word.
  const text = pages.join("").replace(/[\s\u2010\u2011-]+/g, "");
  const printed = Array.from({ length: 70 }, (_, i) => i + 1).filter((n) => text.includes(`Bulletnumber${n}with`));
  expect(printed.length, "bullet points on paper").toBe(70);
  expect(text.replace(/[^a-z0-9]/gi, "")).toContain("FINALBULLETMARKER");
  // Nothing runs past its page: no page is marked as too full.
  await page.emulateMedia({ media: "screen" });
  await expect(page.locator(".cv-page.is-over")).toHaveCount(0);
});

test("ATS CV: printed from the page, a job with 70 bullet points keeps all of them", async ({ page, browser }) => {
  test.setTimeout(60_000);
  await page.goto("/tools/ats-cv/");
  const bullets = Array.from({ length: 70 }, (_, i) => `Bullet number ${i + 1} with 3 results and a measurable outcome`).join("\n");
  await page.evaluate((text) => {
    localStorage.setItem("sc-ats-cv", JSON.stringify({
      person: { name: "Test Person", headline: "Operations", email: "a@example.test", phone: "+49 1", location: "Frankfurt" },
      summary: "A short summary.",
      experience: [{ title: "Shift lead", company: "Firm", from: "01.2020", to: "", bullets: `${text}\nFINAL-BULLET-MARKER` }],
    }));
  }, bullets);
  await page.reload();
  await page.waitForTimeout(800);
  const { pages } = await readPdf(browser, await printPdf(page));
  const text = pages.join("").replace(/[\s\u2010\u2011-]+/g, "");
  const printed = Array.from({ length: 70 }, (_, i) => i + 1).filter((n) => text.includes(`Bulletnumber${n}with`));
  expect(printed.length, "bullet points on paper").toBe(70);
  expect(text.replace(/[^a-z0-9]/gi, "")).toContain("FINALBULLETMARKER");
  await page.emulateMedia({ media: "screen" });
  await expect(page.locator(".ats-page.is-over")).toHaveCount(0);
});

test("Management Review: the charts of an issue print drawn, without scrolling to them first", async ({ page, browser }) => {
  test.setTimeout(60_000);
  await page.goto("/magazine/management-review-nr-80.html");
  await page.waitForLoadState("load");
  await page.waitForTimeout(500);
  // On paper no part of a chart waits for the reader: no bar at scale 0, no figure, line or legend still transparent.
  await page.emulateMedia({ media: "print" });
  const hidden = await page.evaluate(() => {
    const out = [];
    for (const chart of document.querySelectorAll("[data-weekly-chart]")) {
      for (const el of chart.querySelectorAll(".wk-grow, .wk-rise, .wk-pop, .wk-area, .wk-path, .wk-legend li, .wk-arc")) {
        const s = getComputedStyle(el);
        if (!el.getClientRects().length || s.display === "none") continue;
        // Scaled to nothing: the first or the second column of its matrix is zero (a rotation, as of an arc, is not).
        const m = /matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+),/.exec(s.transform);
        const scaled = !!m && ((Number(m[1]) === 0 && Number(m[2]) === 0) || (Number(m[3]) === 0 && Number(m[4]) === 0));
        if (Number(s.opacity) === 0 || scaled || (el.classList.contains("wk-path") && parseFloat(s.strokeDashoffset) > 0)) out.push(el.getAttribute("class"));
      }
    }
    return out;
  });
  expect(hidden, "parts of the charts hidden on paper").toEqual([]);
  // And the page of the first chart has its bars: coloured ink, not only its caption.
  const caption = await page.locator("[data-weekly-chart] figcaption strong").first().innerText();
  const { ink } = await readPdf(browser, await printPdf(page), { inkOn: caption.replace(/\s+/g, " ").slice(0, 24) });
  expect(ink, "the chart's caption is on paper").not.toBeNull();
  expect(ink.coloured, `coloured share of page ${ink?.page}`).toBeGreaterThan(0.004);
});

test("Treatise: the boxes that come in with the scroll print, unscrolled, in all three languages", async ({ page, browser }) => {
  test.setTimeout(60_000);
  for (const lang of ["en", "de", "sq"]) {
    await page.goto(localPath(lang, "/magazine/operational-treatise-vol-01.html"));
    await page.waitForLoadState("load");
    await page.emulateMedia({ media: "print" });
    // "How every chapter is built": its three boxes follow the scroll on screen (animation-timeline: view()).
    const layers = page.locator(".treatise-layer");
    await expect(layers).toHaveCount(3);
    const opacities = await layers.evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities, `${lang}: the boxes are not transparent on paper`).toEqual(["1", "1", "1"]);
    const last = (await layers.last().locator("p").innerText()).replace(/[^\p{L}\p{N}]+/gu, "");
    const { pages } = await readPdf(browser, await printPdf(page));
    expect(pages.join("").replace(/[^\p{L}\p{N}]+/gu, ""), `${lang}: the last box's text is in the PDF`).toContain(last.slice(0, 40));
    await page.emulateMedia({ media: "screen" });
  }
});
