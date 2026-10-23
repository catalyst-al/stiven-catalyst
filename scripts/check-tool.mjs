// A quick check of one tool's pages without the whole build: renders src/tools/<slug>.njk, src/de/tools/<slug>.njk and
// src/sq/tools/<slug>.njk with Nunjucks and the data in src/_data (the filters the tool pages use are stubbed the way
// eleventy.config.js defines them), lists the texts of the German and Albanian pages that have no translation in
// ui.json, checks the script files with node --check, and reports the missing pieces of a new tool (pages, data
// files, cards, previews). Run it while making a tool:  node scripts/check-tool.mjs <slug>
// It changes nothing. The full build (npm run build) and the tests (npm test) remain the real check.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { localUrl } from "../lib/translations.js";

const slug = process.argv[2];
if (!slug) { console.error("usage: node scripts/check-tool.mjs <tool-slug>"); process.exit(2); }
const require = createRequire(import.meta.url);
const nunjucks = require("nunjucks");

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const camel = (name) => name.replace(/\.json$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const dataDir = (dir) => Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => [camel(f), read(path.join(dir, f))]));
const data = dataDir("src/_data");
data.de = dataDir("src/_data/de");
data.sq = dataDir("src/_data/sq");
const ui = { de: { ...data.de.ui }, sq: { ...data.sq.ui } };
// Translations a tool keeps in src/_data/i18n-parts/<slug>.json until the integrator merges them into ui.json count too.
const partFile = `src/_data/i18n-parts/${slug}.json`;
if (fs.existsSync(partFile)) { const part = read(partFile); for (const lang of ["de", "sq"]) Object.assign(ui[lang], part[lang] || {}); }
const problems = [];
const missing = { de: new Set(), sq: new Set() };

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(["src/_includes"]), { autoescape: false, throwOnUndefined: false });
env.addFilter("t", (text, lang) => { if (lang === "de" || lang === "sq") { const hit = ui[lang][text]; if (hit === undefined) missing[lang].add(text); return hit ?? text; } return text; });
env.addFilter("local", (url, lang) => localUrl(url, lang));
env.addFilter("assetUrl", (url) => `${url}?v=check`);
env.addFilter("scriptJson", (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`));
env.addFilter("lc", (text, lang) => (lang === "de" ? String(text) : String(text).toLowerCase()));
env.addFilter("inLang", (value, lang) => (value && typeof value === "object" && !Array.isArray(value) ? value[lang] ?? value.en : value));
env.addFilter("enPath", (url) => String(url || "").replace(/^\/(de|sq)(?=\/)/, ""));
env.addFilter("imageSize", () => null);
env.addFilter("srcsetFor", (src) => src);
env.addFilter("toolPreview", () => "");
env.addFilter("familyTools", (family, tools, lang, key = "tools") => (family?.[key] || []).map((url) => tools.find((tool) => tool.url === localUrl(url, lang))).filter(Boolean));
env.addFilter("roleUrl", (family, lang) => localUrl(`/roles/${family.slug}/`, lang));
env.addFilter("toolAt", (tools, url, lang) => tools.find((tool) => tool.url === localUrl(url, lang)) || null);

const frontMatter = (text) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta = {};
  match[1].split("\n").forEach((line) => { const m = line.match(/^(\w+):\s*(.*)$/); if (m) meta[m[1]] = m[2].replace(/^"(.*)"$/, "$1"); });
  return { meta, body: match[2] };
};

for (const lang of ["en", "de", "sq"]) {
  const file = lang === "en" ? `src/tools/${slug}.njk` : `src/${lang}/tools/${slug}.njk`;
  if (!fs.existsSync(file)) { problems.push(`missing page: ${file}`); continue; }
  const { meta, body } = frontMatter(fs.readFileSync(file, "utf8"));
  const expected = lang === "en" ? `/tools/${slug}/` : `/${lang}/tools/${slug}/`;
  if (meta.permalink !== expected) problems.push(`${file}: permalink should be ${expected} (is ${meta.permalink})`);
  if (lang !== "en" && meta.lang !== lang) problems.push(`${file}: front matter needs lang: ${lang}`);
  if (!meta.title) problems.push(`${file}: no title`);
  if (!meta.description) problems.push(`${file}: no description`);
  else if (meta.description.length > 160) problems.push(`${file}: description is ${meta.description.length} characters (max 160)`);
  if (meta.activeNav !== localUrl("/tools.html", lang)) problems.push(`${file}: activeNav should be ${localUrl("/tools.html", lang)}`);
  try {
    const html = env.renderString(body, { ...data, lang: lang === "en" ? undefined : lang, page: { url: expected }, tools: lang === "en" ? data.tools : data[lang].tools, families: data.families });
    const unclosed = (html.match(/<(section|div|form|table|fieldset|details|ul|ol|li|label)\b/g) || []).length - (html.match(/<\/(section|div|form|table|fieldset|details|ul|ol|li|label)>/g) || []).length;
    if (unclosed) problems.push(`${file}: ${Math.abs(unclosed)} ${unclosed > 0 ? "unclosed" : "extra closing"} block tag(s) in the rendered page`);
    if (!/data-example/.test(html)) problems.push(`${file}: no [data-example] button (scripts/tool-previews.mjs needs one, hidden when the example is already shown is fine)`);
    if (!/data-results/.test(html)) problems.push(`${file}: no [data-results] element (the preview photographs it)`);
    if (!/js\/tool-kit\.js/.test(html)) problems.push(`${file}: tool-kit.js is not loaded`);
    for (const match of html.matchAll(/<script src="\/js\/([a-z0-9-]+)\.js\?v=check" defer><\/script>/g)) {
      if (!fs.existsSync(`src/js/${match[1]}.js`)) problems.push(`${file}: loads js/${match[1]}.js, which does not exist`);
    }
    if (process.env.DUMP) fs.writeFileSync(`/tmp/check-${slug}-${lang}.html`, html);
  } catch (error) {
    problems.push(`${file}: ${String(error.message).split("\n")[0]}`);
  }
}

for (const lang of ["en", "de", "sq"]) {
  const list = lang === "en" ? data.tools : data[lang].tools;
  if (!list.some((tool) => tool.url === localUrl(`/tools/${slug}/`, lang))) problems.push(`no card for /tools/${slug}/ in src/_data/${lang === "en" ? "" : `${lang}/`}tools.json (a snippet in src/_data/i18n-parts/${slug}.cards.json is fine until it is merged)`);
  if (!fs.existsSync(`src/media/tools/${lang}/${slug}.jpg`)) problems.push(`no preview yet: src/media/tools/${lang}/${slug}.jpg (node scripts/tool-previews.mjs after the build)`);
}
const owned = data.families.some((family) => [...family.tools, ...family.learn].includes(`/tools/${slug}/`));
if (!owned) problems.push(`/tools/${slug}/ has no family in src/_data/families.json yet`);

for (const file of fs.readdirSync("src/js").filter((f) => f.endsWith(".js"))) {
  try { execFileSync("node", ["--check", `src/js/${file}`], { stdio: "pipe" }); } catch (error) { problems.push(`src/js/${file}: ${String(error.stderr).split("\n").slice(0, 3).join(" ")}`); }
}
for (const lang of ["de", "sq"]) {
  if (missing[lang].size) console.log(`\n${lang}: ${missing[lang].size} text(s) without translation in src/_data/${lang}/ui.json:\n  ${[...missing[lang]].map((t) => JSON.stringify(t)).join("\n  ")}`);
}
if (problems.length) { console.log(`\n${problems.length} problem(s):\n  ${problems.join("\n  ")}`); process.exit(1); }
console.log(`\n${slug}: the three pages render, the scripts parse.`);
