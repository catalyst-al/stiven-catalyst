// After the build: the stylesheet is minified, and pages that are not a tool or a role page get
// a lighter copy without the rules that cannot match anything on them (the CV Builder, the Pareto
// tool, the course and so on). Tool and role pages keep the whole stylesheet, in its original order.
//
// A rule is left out of the light copy only when one of the classes it needs appears nowhere in
// those pages or in the scripts they load. Words are matched loosely (any word in the HTML or the
// scripts counts), so in doubt a rule stays.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

// Top-level blocks of a stylesheet: { prelude, body } for "x { ... }", comments dropped.
export const blocks = (css) => {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  let depth = 0;
  let start = 0;
  let open = -1;
  let quote = "";
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === "\\") i += 1;
      else if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "{") {
      if (depth === 0) open = i;
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        out.push({ prelude: text.slice(start, open).trim(), body: text.slice(open + 1, i) });
        start = i + 1;
      }
    }
  }
  return out;
};

// Classes a selector cannot match without. Classes inside (...) (:not, :is, :where, :has) are optional.
const required = (selector) => {
  let flat = "";
  let depth = 0;
  for (const ch of selector) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    else if (depth === 0) flat += ch;
  }
  return [...flat.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
};

// Splits a selector list at its top-level commas.
const parts = (list) => {
  const out = [];
  let depth = 0;
  let current = "";
  for (const ch of list) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === "," && depth === 0) {
      out.push(current);
      current = "";
    } else current += ch;
  }
  out.push(current);
  return out.map((s) => s.trim()).filter(Boolean);
};

export const minify = (css) => css
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();

// The stylesheet without the rules that need a class `known` does not have.
export const lighten = (css, known) => {
  const keep = (list) => list.map(({ prelude, body }) => {
    if (prelude.startsWith("@media") || prelude.startsWith("@supports")) {
      const inner = keep(blocks(body));
      return inner ? `${prelude}{${inner}}` : "";
    }
    if (prelude.startsWith("@")) return `${prelude}{${body}}`;
    const matching = parts(prelude).filter((selector) => required(selector).every(known));
    return matching.length ? `${matching.join(",")}{${body}}` : "";
  }).join("");
  return minify(keep(blocks(css)));
};

// Every word in a text; also the start of class names a script builds, as in `family-${id}`.
const words = (text, into, prefixes) => {
  for (const m of text.matchAll(/[A-Za-z0-9_-]+/g)) into.add(m[0]);
  for (const m of text.matchAll(/([A-Za-z0-9_-]+-)(?:\$\{|["']\s*\+)/g)) prefixes.add(m[1]);
};

const pagesIn = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) return pagesIn(file);
  return entry.name.endsWith(".html") ? [file] : [];
});

const STYLESHEET = /(<link rel="stylesheet" href=")([^"]*?)styles\.css\?v=[0-9a-f]+(")/;

export const splitStylesheet = (site) => {
  const full = path.join(site, "styles.css");
  if (!fs.existsSync(full)) return;
  const css = fs.readFileSync(full, "utf8");
  fs.writeFileSync(full, minify(css));

  // Tool pages (/tools/x/) and role pages (/roles/x/), in every language, keep the whole stylesheet.
  const light = pagesIn(site).filter((file) => !/[\\/](tools|roles)[\\/][^\\/]+[\\/]index\.html$/.test(file));
  const seen = new Set();
  const prefixes = new Set();
  const scripts = new Set();
  for (const file of light) {
    const html = fs.readFileSync(file, "utf8");
    words(html, seen, prefixes);
    for (const m of html.matchAll(/<script[^>]*\ssrc="([^"?]+)/g)) scripts.add(m[1]);
  }
  for (const src of scripts) {
    const file = path.join(site, src.replace(/^\/+/, ""));
    if (fs.existsSync(file)) words(fs.readFileSync(file, "utf8"), seen, prefixes);
  }
  const known = (name) => seen.has(name) || [...prefixes].some((prefix) => name.startsWith(prefix));

  const lightCss = lighten(css, known);
  const version = createHash("sha256").update(lightCss).digest("hex").slice(0, 10);
  fs.writeFileSync(path.join(site, "styles-light.css"), lightCss);
  for (const file of light) {
    const html = fs.readFileSync(file, "utf8");
    const next = html.replace(STYLESHEET, `$1$2styles-light.css?v=${version}$3`);
    if (next !== html) fs.writeFileSync(file, next);
  }
};
