// Links between the language versions of a page. The site is written in
// English; German lives under /de/ and Albanian under /sq/.
//
// A translated essay belongs to the English one with the same file name
// (without the date), or to the one named in its "original" field, which the
// editing panel fills in.
import fs from "node:fs";
import path from "node:path";

export const LANGS = ["en", "de", "sq"];

// Pages that exist in every language, besides the tools under /tools/.
export const LOCAL_PAGES = new Set(["/", "/insights.html", "/field-notes.html", "/projects.html", "/tools.html", "/about.html", "/contact.html"]);

// "/tools.html" in German is "/de/tools.html"; English keeps the address.
export const localUrl = (url, lang) => {
  if (!lang || lang === "en" || !(LOCAL_PAGES.has(url) || url.startsWith("/tools/"))) return url;
  return url === "/" ? `/${lang}/` : `/${lang}${url}`;
};

const ESSAYS = { en: "src/content/insights", de: "src/content/de/insights", sq: "src/content/sq/insights" };

const slugOf = (file) => path.basename(file, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");
const field = (text, name) => text.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]*?)["']?\\s*$`, "m"))?.[1].trim() || "";

// Read once per build; the config clears the cache before each build.
const cache = new Map();
export const clearCache = () => cache.clear();

const essays = (lang) => {
  if (!cache.has(lang)) {
    const dir = ESSAYS[lang];
    cache.set(lang, (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const text = fs.readFileSync(path.join(dir, file), "utf8");
        // Translations point at the English essay; English essays are their own key.
        const key = (lang !== "en" && field(text, "original")) || slugOf(file);
        return { slug: slugOf(file), key, address: field(text, "address"), soon: field(text, "status") === "soon" };
      }));
  }
  return cache.get(lang);
};

const essayUrl = (lang, key) => {
  const essay = essays(lang).find((item) => item.key === key);
  if (!essay || essay.soon) return undefined;
  if (lang === "en") return essay.address || `/insights/${essay.slug}/`;
  return `/${lang}/insights/${essay.slug}/`;
};

// { en, de, sq } addresses of this page, or null when it has no other language.
export const alternates = (data) => {
  const url = data.page?.url;
  if (!url || data.noindex || data.status === "soon") return null;
  const found = {};
  if (/\/content\/(?:[a-z]{2}\/)?insights\//.test(data.page.inputPath)) {
    const lang = data.lang || "en";
    const key = (lang !== "en" && data.original) || data.page.fileSlug;
    for (const code of LANGS) {
      const href = essayUrl(code, key);
      if (href) found[code] = href;
    }
  } else {
    const base = url.replace(/^\/(?:de|sq)(?=\/)/, "") || "/";
    if (!(LOCAL_PAGES.has(base) || base.startsWith("/tools/"))) return null;
    for (const code of LANGS) found[code] = localUrl(base, code);
  }
  return Object.keys(found).length > 1 ? found : null;
};
