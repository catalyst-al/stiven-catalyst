// One switch for the motion of the whole site (audit PM-2, PM-3; WCAG 2.2.2): "Pause the motion" in the footer of
// every page (and beside the planets on the homepage) stops every decorative loop, the CSS ones and the planets'
// drawing, and the browser remembers it from page to page. A reader who asks the system for reduced motion starts
// paused and may still choose the motion. Checked by what the browser does, not by what the stylesheet says:
// document.getAnimations() for the endless CSS animations that are running, and a count of what the planets'
// canvas draws.
import { test, expect } from "./fixtures.mjs";

// Counts every drawing call on any 2D canvas, from before the page's own scripts run.
const countDrawing = (page) => page.addInitScript(() => {
  window.__draws = 0;
  const proto = CanvasRenderingContext2D.prototype;
  for (const name of ["clearRect", "fillRect", "fill", "stroke", "drawImage"]) {
    const original = proto[name];
    proto[name] = function (...args) { window.__draws += 1; return original.apply(this, args); };
  }
});
// Records whether data-motion was already set on <html> before <body> existed, i.e. before anything was painted.
const watchFirstPaint = (page) => page.addInitScript(() => {
  window.__motionBeforeBody = null;
  new MutationObserver((records, observer) => {
    if (document.documentElement?.dataset.motion === undefined) return;
    window.__motionBeforeBody = !document.body;
    observer.disconnect();
  }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-motion"] });
});

const runningLoops = (page) => page.evaluate(() => document.getAnimations()
  .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity)
  .map((a) => `${a.animationName} on ${a.effect.target?.className || a.effect.target?.tagName}${a.effect.pseudoElement || ""}`));
const drawsDuring = async (page, ms) => {
  const before = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(ms);
  return (await page.evaluate(() => window.__draws)) - before;
};
const reduced = (page) => page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);

test("the motion switch stops every loop and the planets, and the browser keeps the choice", async ({ page }) => {
  await countDrawing(page);
  await watchFirstPaint(page);
  await page.goto("/");
  const toggle = page.locator("footer [data-motion-toggle]");
  await expect(toggle).toBeVisible();

  if (await reduced(page)) {
    // Reduced motion: paused from the first paint, with nothing stored, and the switch offers the motion.
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    expect(await page.evaluate(() => window.__motionBeforeBody)).toBe(true);
    await expect(toggle).toHaveAccessibleName("Play the motion");
    expect(await runningLoops(page)).toEqual([]);
    expect(await drawsDuring(page, 600)).toBe(0);
    // The reader may still choose the motion: the planets turn, and the choice is kept. (With the switch beside the
    // planets, the same switch: the one at the foot of the page would scroll the planets out of view, where they are
    // rightly not drawn.)
    await page.locator("[data-cosmos] [data-motion-toggle]").click();
    await expect(page.locator("html")).not.toHaveAttribute("data-motion", "paused");
    await expect(toggle).toHaveAccessibleName("Pause the motion");
    expect(await drawsDuring(page, 600)).toBeGreaterThan(0);
    expect(await page.evaluate(() => localStorage.getItem("sc-motion"))).toBe("on");
    await page.reload();
    await expect(page.locator("footer [data-motion-toggle]")).toHaveAccessibleName("Pause the motion");
    expect(await drawsDuring(page, 600)).toBeGreaterThan(0);
    return;
  }

  // With motion: the loops run and the planets are drawn.
  await expect(page.locator("html")).not.toHaveAttribute("data-motion", "paused");
  expect((await runningLoops(page)).length).toBeGreaterThan(0);
  expect(await drawsDuring(page, 600)).toBeGreaterThan(0);

  // Paused: nothing endless runs any more, the canvas draws nothing, and both switches say so.
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(toggle).toHaveAccessibleName("Play the motion");
  await expect(page.locator("[data-cosmos] [data-motion-toggle]")).toHaveAccessibleName("Play the motion");
  expect(await runningLoops(page)).toEqual([]);
  expect(await drawsDuring(page, 600)).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem("sc-motion"))).toBe("paused");

  // Kept after a reload (set before the first paint, so nothing moves even for a frame) and on the next page.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  expect(await page.evaluate(() => window.__motionBeforeBody)).toBe(true);
  await expect(page.locator("footer [data-motion-toggle]")).toHaveAccessibleName("Play the motion");
  expect(await runningLoops(page)).toEqual([]);
  expect(await drawsDuring(page, 600)).toBe(0);
  for (const url of ["/tools/cx-control-tower/", "/tools/shift-pulse/", "/tools.html", "/books/mall-per-durresin.html", "/magazine/management-review-nr-80.html"]) {
    await page.goto(url);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    expect(await runningLoops(page), url).toEqual([]);
  }

  // Played again from another page: the loops run there, and the planets turn on the homepage.
  await page.locator("footer [data-motion-toggle]").click();
  await expect(page.locator("html")).not.toHaveAttribute("data-motion", "paused");
  expect((await runningLoops(page)).length).toBeGreaterThan(0);
  await page.goto("/");
  expect(await drawsDuring(page, 600)).toBeGreaterThan(0);
});

test("the switch is in every language", async ({ page }) => {
  for (const [url, pause, play] of [["/de/", "Bewegung anhalten", "Bewegung fortsetzen"], ["/sq/", "Ndalo lëvizjen", "Vazhdo lëvizjen"]]) {
    await page.goto(url);
    const toggle = page.locator("footer [data-motion-toggle]");
    await expect(toggle).toHaveAccessibleName((await reduced(page)) ? play : pause);
    await toggle.click();
    await expect(toggle).toHaveAccessibleName((await reduced(page)) ? pause : play);
    await toggle.click();
  }
});

// The wheel scrolls the page the browser's own way (audit PM-6): the site no longer cancels the wheel to move the page
// itself frame by frame on the main thread (a notch took 0.37 s, 1.1 s on the homepage of a slow computer), so the
// scrolling runs on the compositor, whatever the page is doing. Links to a place on the page still glide (scroll-behavior).
test("a turn of the wheel scrolls the page at once, by the browser", async ({ page }) => {
  await page.addInitScript(() => {
    window.__prevented = [];
    window.addEventListener("wheel", (event) => setTimeout(() => window.__prevented.push(event.defaultPrevented)), { passive: true, capture: true });
  });
  for (const url of ["/", "/field-notes.html"]) {
    await page.goto(url);
    await page.mouse.move(200, 400);
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => window.__prevented.length)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.__prevented), url).toEqual([false]);
    // Within a frame or two, not over a third of a second.
    await page.waitForTimeout(120);
    expect(await page.evaluate(() => window.scrollY) - before, url).toBeGreaterThanOrEqual(270);
  }
});

// A tool that brings its result into view does it at once for a reader who asks for reduced motion, and glides for the
// others (audit PM-16 feared the 63 calls of scrollIntoView({ behavior: "smooth" }) in the tools glided all the same;
// Chromium 153 itself makes them instant under reduced motion, and this keeps any script of the site from undoing it).
test("a tool brings its result into view at once under reduced motion", async ({ page }) => {
  await page.goto("/tools/kaizen-board/");
  const result = await page.evaluate(() => new Promise((resolve) => {
    const footer = document.querySelector("footer.site-footer");
    footer.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => requestAnimationFrame(() => resolve({ y: window.scrollY, max: document.documentElement.scrollHeight - window.innerHeight, top: footer.getBoundingClientRect().top })));
  }));
  const settled = Math.abs(result.top) < 2 || Math.abs(result.y - result.max) < 2;
  expect(settled, JSON.stringify(result)).toBe(await reduced(page));
});
