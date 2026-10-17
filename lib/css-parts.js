// The site's stylesheet is written in parts, src/css/NN-name.css, one per area of the site (the foundation and the
// header, the homepage, the tools, the readers and so on), and put together in the order of their numbers into
// src/styles.css before every build (eleventy.config.js). The page loads that one file, as before, and
// lib/css-split.js still splits the built copy by kind of page. Edit the parts, never styles.css itself: the next
// build writes it again, and tests/css-parts.test.cjs fails while the two differ.
import fs from "node:fs";
import path from "node:path";

export const PARTS = "src/css";
export const STYLESHEET = "src/styles.css";

// The parts in order, joined as they are, with nothing added between them.
export const joinParts = (root = ".") => {
  const dir = path.join(root, PARTS);
  return fs.readdirSync(dir).filter((name) => /^\d\d-[a-z0-9-]+\.css$/.test(name)).sort()
    .map((name) => fs.readFileSync(path.join(dir, name), "utf8")).join("");
};

// Writes styles.css from the parts when they changed, so a build that changes nothing leaves the file alone.
export const writeStylesheet = (root = ".") => {
  const file = path.join(root, STYLESHEET);
  const css = joinParts(root);
  if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== css) fs.writeFileSync(file, css);
};
