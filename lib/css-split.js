// After the build: the stylesheet is minified, and each kind of page gets a copy of it with only the rules that
// can match something on pages of that kind: the home page, the essays and reflections, the online readers (the
// Management Review, the magazine, the treatise, the book, the guide), the tools and the roles, and the other pages
// (the lists, About, Contact, Search and so on). Each copy keeps the rules in their original order, so nothing in the
// cascade changes, and carries a version of its content in its address.
//
// A rule is left out of a copy only when one of the classes it needs appears nowhere on those pages or in the
// scripts they load: the classes of their elements, the words of their data attributes, inline styles and inline
// scripts, and every word of the scripts they load (a class a script adds is a string in it; a class it builds from
// a start, `family-${id}`, counts by its start). In doubt a rule stays. @keyframes nobody animates with are left out
// too. Tested in tests/css-split.test.cjs.
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

// Splits a selector list (or a declaration value) at its top-level commas.
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
    if (prelude.startsWith("@media") || prelude.startsWith("@supports") || prelude.startsWith("@container")) {
      const inner = keep(blocks(body));
      return inner ? `${prelude}{${inner}}` : "";
    }
    if (prelude.startsWith("@")) return `${prelude}{${body}}`;
    const matching = parts(prelude).filter((selector) => required(selector).every(known));
    return matching.length ? `${matching.join(",")}{${body}}` : "";
  }).join("");
  return minify(keep(blocks(css)));
};

// Every word named in the animation and animation-name declarations of a stylesheet (the names of the animations,
// and harmlessly their timing words too).
const animationWords = (css) => {
  const words = new Set();
  for (const m of css.matchAll(/animation(?:-name)?\s*:([^;}]+)/g)) {
    for (const part of parts(m[1])) for (const token of part.split(/\s+/)) if (/^[A-Za-z_][\w-]*$/.test(token)) words.add(token);
  }
  return words;
};

// The stylesheet without the @keyframes no rule in it animates with. Only the stylesheet names animations: no script
// or inline style of the site sets one.
export const dropUnusedKeyframes = (css) => {
  const used = animationWords(css);
  return css.replace(/@keyframes\s+([\w-]+)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, (match, name) => (used.has(name) ? match : ""));
};

// Every word in a text; also the start of class names a script builds, as in `family-${id}` or "family-" + id.
export const words = (text, into, prefixes) => {
  for (const m of text.matchAll(/[A-Za-z0-9_-]+/g)) into.add(m[0]);
  for (const m of text.matchAll(/([A-Za-z0-9_-]+-)(?:\$\{|["']\s*\+)/g)) prefixes.add(m[1]);
};

// What a page is known to carry, from its HTML: the classes of its elements, the words of its data attributes, of its
// inline styles and inline scripts (the JSON a tool keeps in the page included), and the addresses of the scripts it
// loads, whose words the caller adds.
export const pageWords = (html, into, prefixes) => {
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) for (const name of m[1].split(/\s+/)) if (name) into.add(name);
  for (const m of html.matchAll(/\sdata-[a-z0-9-]+="([^"]*)"/g)) words(m[1], into, prefixes);
  for (const m of html.matchAll(/\sstyle="([^"]*)"/g)) words(m[1], into, prefixes);
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) words(m[1], into, prefixes);
  for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)) words(m[1], into, prefixes);
  return [...html.matchAll(/<script[^>]*\ssrc="([^"?]+)/g)].map((m) => m[1]);
};

// The kind of a page, from its address in the built site (/de/tools/pareto/index.html, /insights.html, ...).
export const groupOf = (url) => {
  const path = url.replace(/^\/(de|sq)(?=\/)/, "");
  if (/^\/(tools|roles)\/[^/]+\/index\.html$/.test(path)) return "tool";
  if (path === "/index.html") return "home";
  if (/^\/(insights|reflections)\/[^/]+\/index\.html$/.test(path)) return "essay";
  if (/^\/(magazine|books|guides)\//.test(path)) return "reader";
  return "page";
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

  const groups = new Map();
  for (const file of pagesIn(site)) {
    const group = groupOf("/" + path.relative(site, file).split(path.sep).join("/"));
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(file);
  }
  // The words of a script, read once however many pages load it.
  const scriptWords = new Map();
  const ofScript = (src) => {
    if (!scriptWords.has(src)) {
      const seen = new Set();
      const prefixes = new Set();
      const file = path.join(site, src.replace(/^\/+/, ""));
      if (fs.existsSync(file)) words(fs.readFileSync(file, "utf8"), seen, prefixes);
      scriptWords.set(src, { seen, prefixes });
    }
    return scriptWords.get(src);
  };
  for (const [group, files] of groups) {
    const seen = new Set();
    const prefixes = new Set();
    for (const file of files) {
      for (const src of pageWords(fs.readFileSync(file, "utf8"), seen, prefixes)) {
        const script = ofScript(src);
        for (const word of script.seen) seen.add(word);
        for (const prefix of script.prefixes) prefixes.add(prefix);
      }
    }
    const known = (name) => seen.has(name) || [...prefixes].some((prefix) => name.startsWith(prefix));
    const sheet = dropUnusedKeyframes(lighten(css, known));
    const version = createHash("sha256").update(sheet).digest("hex").slice(0, 10);
    fs.writeFileSync(path.join(site, `styles-${group}.css`), sheet);
    for (const file of files) {
      const html = fs.readFileSync(file, "utf8");
      const next = html.replace(STYLESHEET, `$1$2styles-${group}.css?v=${version}$3`);
      if (next !== html) fs.writeFileSync(file, next);
    }
  }
};
