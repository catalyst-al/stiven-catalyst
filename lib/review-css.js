// The stylesheet of the Management Review's live pages, /review-pages.css (src/review-pages.njk): the print's own
// rules (src/_includes/print/review-base.css and weekly.css, every selector scoped to .mr) and what the site adds for
// the screen (print/review-web.css), minified, with a version from their content for the address. Only the pages of
// the issues and the special edition load it (reviewPages in their front matter, layouts/base.njk).
import fs from "node:fs";
import { createHash } from "node:crypto";
import { minify } from "./css-split.js";

export const REVIEW_CSS_FILES = ["review-base.css", "weekly.css", "review-web.css"];
let cache = null;

export const reviewPagesCss = () => {
  if (!cache) {
    const css = minify(REVIEW_CSS_FILES.map((name) => fs.readFileSync(`src/_includes/print/${name}`, "utf8")).join("\n"));
    cache = { css, url: `/review-pages.css?v=${createHash("sha256").update(css).digest("hex").slice(0, 10)}` };
  }
  return cache;
};
export const clearReviewCss = () => { cache = null; };
