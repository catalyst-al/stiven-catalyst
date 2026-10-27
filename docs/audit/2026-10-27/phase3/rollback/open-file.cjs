// The cause of the refused work files, isolated. node open-file.cjs <site dir> <file...> opens each work file in an
// empty browser's Tools page ("Open a saved file"), on its own origin (port 8362), and prints what the page says and
// which keys it wrote. Run on the new site (rollback.md, "Cause check"):
//   node open-file.cjs <tmp>/site-new files/work-saved-by-old.json files/work-saved-by-old.less-sc-motion.json \
//     files/work-saved-by-old-while-locked.json files/work-saved-by-old-while-locked.less-sc-locked.json
// The ".less-…" files are the same files with that one settings key taken out (made by this script when missing).
const path = require("node:path");
const http = require("node:http");
const fs = require("node:fs");
const { chromium } = require(path.join(__dirname, "../../../../../node_modules/playwright"));
const [root, ...files] = process.argv.slice(2);

for (const [file, key] of [["work-saved-by-old.json", "sc-motion"], ["work-saved-by-old-while-locked.json", "sc-locked"]]) {
  const from = path.join(__dirname, "files", file);
  const to = from.replace(/\.json$/, `.less-${key}.json`);
  if (fs.existsSync(from) && !fs.existsSync(to)) {
    const data = JSON.parse(fs.readFileSync(from, "utf8"));
    delete data.items[key];
    fs.writeFileSync(to, `${JSON.stringify(data)}\n`);
  }
}

const server = http.createServer((req, res) => {
  let f = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, "index.html"); fs.accessSync(f); } catch { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css" }[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
}).listen(8362, "127.0.0.1");

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--disable-dev-shm-usage"] });
  for (const file of files) {
    const ctx = await browser.newContext();
    await ctx.route((u) => !u.href.startsWith("http://127.0.0.1:8362"), (r) => r.abort());
    const page = await ctx.newPage();
    page.on("dialog", (d) => d.accept());
    page.on("pageerror", (e) => console.log("  pageerror", e.message));
    await page.goto("http://127.0.0.1:8362/tools.html");
    await page.waitForTimeout(800);
    const reload = page.waitForEvent("load", { timeout: 5000 }).then(() => true).catch(() => false);
    await page.locator("[data-work-open]").first().setInputFiles(file);
    let said = "";
    for (let i = 0; i < 20 && !said; i++) { await page.waitForTimeout(100); said = (await page.locator("[data-work-status]").first().textContent().catch(() => "")) || ""; }
    const reloaded = await reload;
    const keys = await page.evaluate(() => Object.keys(localStorage).sort());
    console.log(`${path.basename(file)} | opened: ${reloaded} | "${said}" | keys after: ${keys.join(", ")}`);
    await ctx.close();
  }
  await browser.close();
  server.close();
})();
