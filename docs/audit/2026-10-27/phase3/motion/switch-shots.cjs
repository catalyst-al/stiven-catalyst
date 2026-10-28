// Phase 3, motion: screenshots of where the motion switch sits (the footer of every page, and the hero's own corner on
// the homepage), for the author's decision on its place.
//   node docs/audit/2026-10-27/phase3/motion/switch-shots.cjs http://127.0.0.1:8322 docs/audit/2026-10-27/phase3/motion/shots
const { chromium } = require("playwright");
const fs = require("node:fs");

const [base, out] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const [width, theme, path, name] of [[1440, "dark", "/", "footer-1440-dark"], [390, "light", "/de/tools/shift-pulse/", "footer-390-light-de"], [390, "dark", "/", "hero-390-dark"]]) {
    const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 1 });
    await context.route((url) => !/^http:\/\/127\.0\.0\.1/.test(url.href), (route) => route.abort());
    await context.addInitScript(`try{localStorage.setItem("sc-theme",${JSON.stringify(theme)})}catch(e){}`);
    const page = await context.newPage();
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(800);
    const target = name.startsWith("footer") ? page.locator("footer.site-footer") : page.locator(".cosmos-system");
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await target.screenshot({ path: `${out}/${name}.png`, animations: "disabled" });
    await context.close();
  }
  await browser.close();
})();
