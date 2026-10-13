// Links between the language versions of a page. The site is written in
// English; German lives under /de/ and Albanian under /sq/.
//
// A translated essay belongs to the English one with the same file name
// (without the date), or to the one named in its "original" field, which the
// editing panel fills in.
import fs from "node:fs";
import path from "node:path";

export const LANGS = ["en", "de", "sq"];

// The quotation marks of each language: outer and inner. English and Albanian write “…” and ‘…’, German „…“ and ‚…‘.
export const QUOTES = { en: ["“", "”", "‘", "’"], sq: ["“", "”", "‘", "’"], de: ["„", "“", "‚", "‘"] };
// German writes a space between a number and its per cent sign ("5 %"); a line must not break there, or a page
// reads "Doch nur 5" and "% der Beschäftigten" on two lines. On a German page the space in the text between tags
// becomes a no-break space; scripts and styles are left alone.
export const keepUnits = (html) =>
  /^\s*(<!doctype html>\s*)?<html lang="de"/i.test(html)
    ? html.replace(/(<(script|style)\b[\s\S]*?<\/\2>)|>([^<]+)</g, (match, block, tag, text) =>
      block ?? `>${text.replace(/(\d) (%|‰)/g, "$1\u00a0$2")}<`)
    : html;

// A quotation (a field note, a pull quote) in the quotes of its language. A quotation inside it, written with the
// language's own outer quotes, takes the inner ones: „„Ja, verstanden“ ist kein Beweis.“ would be wrong German.
// An English title quoted on a German page ("Onboarding “Buddy”") takes the German inner quotes too.
export const quoted = (text, lang) => {
  const [open, close, innerOpen, innerClose] = QUOTES[lang] || QUOTES.en;
  const pairs = lang === "de" ? [["„", "“"], ["“", "”"]] : [[open, close]];
  const inner = pairs.reduce((value, [o, c]) => value.replace(new RegExp(`${o}([^${o}${c}]*)${c}`, "g"), `${innerOpen}$1${innerClose}`), String(text ?? ""));
  return `${open}${inner}${close}`;
};

// Pages that exist in every language, besides the tools under /tools/, the roles under /roles/ and the
// issues of the magazine under /magazine/.
export const LOCAL_PAGES = new Set(["/", "/start.html", "/search.html", "/insights.html", "/challenges.html", "/reflections.html", "/field-notes.html", "/projects.html", "/tools.html", "/about.html", "/contact.html", "/your-challenge.html", "/shelf.html", "/books/mall-per-durresin.html", "/guides/tools-guide.html", "/publications.html", "/podcast.html", "/impressum.html", "/datenschutz.html"]);

// "/tools.html" in German is "/de/tools.html"; English keeps the address.
const everyLanguage = (url) => LOCAL_PAGES.has(url) || url.startsWith("/tools/") || url.startsWith("/roles/") || url.startsWith("/magazine/");
export const localUrl = (url, lang) => {
  if (!lang || lang === "en" || !everyLanguage(url)) return url;
  return url === "/" ? `/${lang}/` : `/${lang}${url}`;
};

// Essays (insights) and reflections, each in src/content/<section> and src/content/<lang>/<section>.
const SECTIONS = ["insights", "reflections"];
const folder = (section, lang) => (lang === "en" ? `src/content/${section}` : `src/content/${lang}/${section}`);

const slugOf = (file) => path.basename(file, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");
const field = (text, name) => text.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]*?)["']?\\s*$`, "m"))?.[1].trim() || "";

// Read once per build; the config clears the cache before each build.
const cache = new Map();
export const clearCache = () => cache.clear();

const essays = (section, lang) => {
  const id = `${section}/${lang}`;
  if (!cache.has(id)) {
    const dir = folder(section, lang);
    cache.set(id, (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        const text = fs.readFileSync(path.join(dir, file), "utf8");
        // Translations point at the English essay; English essays are their own key.
        const key = (lang !== "en" && field(text, "original")) || slugOf(file);
        return { slug: slugOf(file), key, address: field(text, "address"), soon: field(text, "status") === "soon" };
      }));
  }
  return cache.get(id);
};

const essayUrl = (section, lang, key) => {
  const essay = essays(section, lang).find((item) => item.key === key);
  if (!essay || essay.soon) return undefined;
  if (lang === "en") return essay.address || `/${section}/${essay.slug}/`;
  return `/${lang}/${section}/${essay.slug}/`;
};

// { en, de, sq } addresses of this page, or null when it has no other language. A noindex page
// (the legal pages) still gets them for its language switch; the layout leaves its hreflang links out.
export const alternates = (data) => {
  const url = data.page?.url;
  if (!url || data.status === "soon") return null;
  const found = {};
  const section = SECTIONS.find((name) => new RegExp(`/content/(?:[a-z]{2}/)?${name}/`).test(data.page.inputPath));
  if (section) {
    const lang = data.lang || "en";
    const key = (lang !== "en" && data.original) || data.page.fileSlug;
    for (const code of LANGS) {
      const href = essayUrl(section, code, key);
      if (href) found[code] = href;
    }
  } else {
    const base = url.replace(/^\/(?:de|sq)(?=\/)/, "") || "/";
    if (!everyLanguage(base)) return null;
    for (const code of LANGS) found[code] = localUrl(base, code);
  }
  return Object.keys(found).length > 1 ? found : null;
};
