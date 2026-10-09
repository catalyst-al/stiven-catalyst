// The stylesheets of the live pages, one per publication: the Management Review (/review-pages.css), the magazine
// "Nga terreni" (/magazine-pages.css) and the Tools Guide (/guide-pages.css). Each is the print's own rules
// (src/_includes/print/*.css, every selector scoped to the page of its scope: .mr, .mz, .tg), what the site adds for
// the screen (print/live-pages.css: fonts, the scale of a page, the pages enlarged), minified, with a version from
// its content for the address (src/live-pages.njk writes the files). Only the reader pages load them (livePages in
// their front matter, layouts/base.njk).
import fs from "node:fs";
import { createHash } from "node:crypto";
import { minify } from "./css-split.js";

export const LIVE_PAGES = {
  review: { files: ["review-base.css", "weekly.css", "review-web.css", "live-pages.css"], path: "/review-pages.css" },
  magazine: { files: ["magazine.css", "live-pages.css"], path: "/magazine-pages.css" },
  guide: { files: ["guide.css", "live-pages.css"], path: "/guide-pages.css" },
};
const cache = new Map();

export const livePagesCss = (name) => {
  const sheet = LIVE_PAGES[name];
  if (!sheet) throw new Error(`live pages: no stylesheet named "${name}" (${Object.keys(LIVE_PAGES).join(", ")})`);
  if (!cache.has(name)) {
    const css = minify(sheet.files.map((file) => fs.readFileSync(`src/_includes/print/${file}`, "utf8")).join("\n"));
    cache.set(name, { css, url: `${sheet.path}?v=${createHash("sha256").update(css).digest("hex").slice(0, 10)}` });
  }
  return cache.get(name);
};
export const clearLivePages = () => cache.clear();
