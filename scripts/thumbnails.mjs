// Smaller copies of the images that pages show small: the covers of the book, the magazine issues, the
// Management Review and the Tools Guide (page-01.webp, shown at 74–300 px) and the tool previews
// (media/tools/<lang>/<tool>.jpg, shown at 255–360 px, so 720 px for a phone screen). Each gets WebP copies next to it, named
// page-01-240.webp, page-01-480.webp and <tool>-720.webp; the srcsetFor filter (eleventy.config.js) offers
// them to the browser when they exist. Needs ImageMagick (convert). Run it again after the covers or the
// previews change: node scripts/thumbnails.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const media = "src/media";
const jobs = [];
const walk = (folder) => {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === "page-01.webp" && !/[/\\]art[/\\]/.test(file)) jobs.push([file, [240, 480]]);
  }
};
for (const kind of ["books", "magazine", "guides"]) walk(path.join(media, kind));
for (const lang of ["en", "de", "sq"]) {
  const dir = path.join(media, "tools", lang);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) if (/^[a-z0-9-]+\.jpg$/.test(name)) jobs.push([path.join(dir, name), [720]]);
}

let made = 0;
for (const [file, widths] of jobs) {
  for (const width of widths) {
    const out = file.replace(/\.(webp|jpg)$/, `-${width}.webp`);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(file).mtimeMs) continue;
    execFileSync("convert", [file, "-resize", `${width}x`, "-strip", "-quality", "80", "-define", "webp:method=6", out]);
    made += 1;
  }
}
console.log(`${jobs.length} images, ${made} copies written.`);
