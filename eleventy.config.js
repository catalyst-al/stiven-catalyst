import { HtmlBasePlugin } from "@11ty/eleventy";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { clearCache, localUrl } from "./lib/translations.js";
import { splitStylesheet } from "./lib/css-split.js";
import { minifyScripts } from "./lib/js-minify.js";
import { markPairs } from "./lib/display-pairs.js";
import { essayBody, essayContents } from "./lib/essay-body.js";
import { searchIndex } from "./lib/search-index.js";

const site = JSON.parse(fs.readFileSync("src/_data/site.json", "utf8"));
// Interface texts in German and Albanian, keyed by the English text (also used
// by the tools' scripts). Read once per build; a rebuild in watch mode reads them again.
const ui = new Map();
const readUi = (lang) => {
  if (!ui.has(lang)) ui.set(lang, JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, "utf8")));
  return ui.get(lang);
};
const TRANSLATED = new Set(["de", "sq"]);
const LOCALES = { en: "en-GB", de: "de-DE", sq: "sq-AL" };
const assetVersions = new Map();

const byDate = (a, b) => a.date - b.date || a.fileSlug.localeCompare(b.fileSlug);

export default function (eleventyConfig) {
  // Pages are written with root-relative links ("/styles.css"); this plugin
  // prefixes them with the folder the site lives in (for example /stiven-catalyst/ on a GitHub Pages project address).
  eleventyConfig.addPlugin(HtmlBasePlugin);

  for (const path of ["styles.css", "coaching.css", "script.js", "favicon.svg", "social.png", "fonts", "media", "js"]) {
    eleventyConfig.addPassthroughCopy(`src/${path}`);
  }

  // Insights, numbered oldest first (01, 02, ...), as on the Insights page.
  eleventyConfig.addCollection("insights", (api) =>
    api.getFilteredByGlob("src/content/insights/*.md").sort(byDate).map((item, index) => {
      item.data.number = String(index + 1).padStart(2, "0");
      return item;
    })
  );
  eleventyConfig.addCollection("notes", (api) =>
    api.getFilteredByGlob("src/content/notes/*.md").sort((a, b) => b.date - a.date || a.fileSlug.localeCompare(b.fileSlug))
  );
  // Reflections: personal essays, newest first.
  eleventyConfig.addCollection("reflections", (api) =>
    api.getFilteredByGlob("src/content/reflections/*.md").filter((item) => item.data.status !== "soon").sort((a, b) => b.date - a.date)
  );
  // The feed carries the English essays and reflections together.
  eleventyConfig.addCollection("feed", (api) =>
    api.getFilteredByGlob(["src/content/insights/*.md", "src/content/reflections/*.md"]).filter((item) => item.data.status !== "soon").sort(byDate)
  );
  eleventyConfig.addCollection("projects", (api) =>
    api.getFilteredByGlob("src/content/projects/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  // The same collections in German and Albanian: insightsDe, notesSq, ...
  for (const [lang, suffix] of [["de", "De"], ["sq", "Sq"]]) {
    eleventyConfig.addCollection(`insights${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/insights/*.md`).sort(byDate).map((item, index) => {
        item.data.number = String(index + 1).padStart(2, "0");
        return item;
      })
    );
    eleventyConfig.addCollection(`notes${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/notes/*.md`).sort((a, b) => b.date - a.date || a.fileSlug.localeCompare(b.fileSlug))
    );
    eleventyConfig.addCollection(`reflections${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/reflections/*.md`).filter((item) => item.data.status !== "soon").sort((a, b) => b.date - a.date)
    );
    // The feed in this language: its essays and reflections together.
    eleventyConfig.addCollection(`feed${suffix}`, (api) =>
      api.getFilteredByGlob([`src/content/${lang}/insights/*.md`, `src/content/${lang}/reflections/*.md`]).filter((item) => item.data.status !== "soon").sort(byDate)
    );
    eleventyConfig.addCollection(`projects${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/projects/*.md`).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    );
  }

  eleventyConfig.addGlobalData("year", new Date().getFullYear());

  // {{ "Add to log" | t(lang) }}: the German or Albanian text on those pages, else the English one.
  eleventyConfig.addFilter("t", (text, lang) => (TRANSLATED.has(lang) ? readUi(lang)[text] ?? text : text));
  // The interface texts a tool page hands to tool-kit.js: only those the scripts can ask for, that is every
  // text that appears as a string in src/js (literal tx("…") calls and the labels the tools keep in their own
  // tables, such as the KPI names of the CX Control Tower). Texts used only in templates are already in the HTML.
  const scriptSource = () => fs.readdirSync("src/js").filter((file) => file.endsWith(".js"))
    .map((file) => fs.readFileSync(`src/js/${file}`, "utf8")).join("\n");
  const inScripts = (source, text) => source.includes(JSON.stringify(text))
    || source.includes(`'${text.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`)
    || source.includes(`\`${text}\``);
  const scriptStringsCache = new Map();
  eleventyConfig.on("eleventy.before", () => scriptStringsCache.clear());
  const scriptStrings = (lang) => {
    if (!TRANSLATED.has(lang)) return {};
    if (!scriptStringsCache.has(lang)) {
      const source = scriptSource();
      scriptStringsCache.set(lang, Object.fromEntries(Object.entries(readUi(lang)).filter(([text]) => inScripts(source, text))));
    }
    return scriptStringsCache.get(lang);
  };
  eleventyConfig.addFilter("uiStrings", (lang) => JSON.stringify(scriptStrings(lang)));
  // The address of that text as one file (src/ui-strings.njk), which the browser keeps between
  // tool pages; it changes when the translations do.
  eleventyConfig.addFilter("uiStringsUrl", (lang) =>
    `/js/ui-${lang}.js?v=${createHash("sha256").update(JSON.stringify(scriptStrings(lang))).digest("hex").slice(0, 10)}`
  );
  // JSON embedded in HTML must not be able to close its script element.
  eleventyConfig.addFilter("scriptJson", (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`));
  // The coaching curriculum as one file (src/coaching-data.njk) the browser keeps; its address changes with the content.
  const coachingUrls = new WeakMap();
  eleventyConfig.addFilter("coachingDataUrl", (coaching) => {
    if (!coachingUrls.has(coaching)) coachingUrls.set(coaching, `/js/coaching-data.js?v=${createHash("sha256").update(JSON.stringify(coaching)).digest("hex").slice(0, 10)}`);
    return coachingUrls.get(coaching);
  });
  // collections["notes" + (lang | langSuffix)]: notes, notesDe or notesSq.
  eleventyConfig.addFilter("langSuffix", (lang) => (TRANSLATED.has(lang) ? lang[0].toUpperCase() + lang.slice(1) : ""));
  // A changed asset gets a new URL, so browsers do not keep an old script or stylesheet.
  // The pixel size of an image in src/ (JPEG, PNG or WebP), so an <img> can carry width and height
  // and the page does not move when the picture arrives; null when it cannot be read.
  const imageSizes = new Map();
  eleventyConfig.addFilter("imageSize", (path) => {
    const file = `src${String(path || "").split("?")[0]}`;
    if (!imageSizes.has(file)) {
      let size = null;
      try {
        const b = fs.readFileSync(file);
        if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") size = { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
        else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
          const kind = b.toString("ascii", 12, 16);
          if (kind === "VP8X") size = { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
          else if (kind === "VP8L") { const bits = b.readUInt32LE(21); size = { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) }; }
          else if (kind === "VP8 ") size = { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
        } else if (b[0] === 0xff && b[1] === 0xd8) {
          for (let i = 2; i + 9 < b.length && !size;) {
            if (b[i] !== 0xff) { i += 1; continue; }
            const marker = b[i + 1];
            if ([0xc0, 0xc1, 0xc2].includes(marker)) size = { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
            else i += 2 + b.readUInt16BE(i + 2);
          }
        }
      } catch { size = null; }
      imageSizes.set(file, size);
    }
    return imageSizes.get(file);
  });
  // The hash of an inline script, for the Content Security Policy in layouts/base.njk.
  eleventyConfig.addFilter("cspHash", (code) => `'sha256-${createHash("sha256").update(String(code)).digest("base64")}'`);
  const assetUrl = (path) => {
    const file = `src${path}`;
    if (!assetVersions.has(file)) {
      assetVersions.set(file, createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10));
    }
    return `${path}?v=${assetVersions.get(file)}`;
  };
  eleventyConfig.addFilter("assetUrl", assetUrl);
  // A field note as an image to post (made by scripts/note-cards.mjs), or "" while it has none.
  const noteImage = (slug, lang) => {
    const path = `/media/notes/${lang || "en"}/${slug}.jpg`;
    return fs.existsSync(`src${path}`) ? assetUrl(path) : "";
  };
  eleventyConfig.addFilter("noteImage", noteImage);
  // Links stay in the page's language: /tools/x/ becomes /de/tools/x/ or /sq/tools/x/.
  eleventyConfig.addFilter("local", localUrl);
  // The tools of one family (families.json), in the page's language and in the family's order:
  // its own tools, or with key "learn" its training modules, or with "also" the tools it borrows from other families.
  eleventyConfig.addFilter("familyTools", (family, tools, lang, key = "tools") =>
    (family?.[key] || []).map((url) => tools.find((tool) => tool.url === localUrl(url, lang))).filter(Boolean)
  );
  // The family of a tool page, a training module or a role page (/tools/x/, /roles/x/, in any language), else null.
  eleventyConfig.addFilter("familyOf", (url, families) => {
    const path = String(url || "").replace(/^\/(de|sq)(?=\/)/, "");
    return families.find((family) => family.tools.includes(path) || family.learn.includes(path) || path === `/roles/${family.slug}/`) || null;
  });
  // The text of a guide (toolsGuide.js): [[Label]] is a button or field of a tool, written in quotes in the guide's language.
  const GUIDE_QUOTES = { en: ["“", "”"], sq: ["“", "”"], de: ["„", "“"] };
  eleventyConfig.addFilter("guideText", (text, lang) => {
    const [open, close] = GUIDE_QUOTES[lang] || GUIDE_QUOTES.en;
    return String(text || "").replace(/\[\[(.+?)\]\]/g, (_, label) => `${open}${TRANSLATED.has(lang) ? readUi(lang)[label] ?? label : label}${close}`);
  });
  // The page of a family's role: /roles/shift-lead/, /de/roles/shift-lead/ ...
  eleventyConfig.addFilter("roleUrl", (family, lang) => localUrl(`/roles/${family.slug}/`, lang));
  // One tool by its English address, in the page's language.
  // The essays before and after this one in its language's list (published only), for the series navigation at the end of an essay.
  // The body of an essay with ids on its section titles, and the list of those sections (lib/essay-body.js).
  eleventyConfig.addFilter("essayBody", essayBody);
  eleventyConfig.addFilter("essayContents", essayContents);
  // Today's place in a cycle of {count} items, counted in whole days since 1970 (UTC at build time; the
  // browser counts by the reader's own date, js/note-of-the-day.js).
  eleventyConfig.addFilter("dayOfCycle", (count) => (count ? Math.floor(Date.now() / 864e5) % count : 0));
  // The essays that have a page, without those marked "soon".
  eleventyConfig.addFilter("published", (items) => (items || []).filter((item) => item.data.status !== "soon"));
  eleventyConfig.addFilter("seriesNeighbours", (items, url) => {
    const published = (items || []).filter((item) => item.data.status !== "soon");
    const index = published.findIndex((item) => item.url === url);
    if (index < 0) return null;
    return { prev: published[index - 1] || null, next: published[index + 1] || null, number: index + 1, total: published.length };
  });
  // The origin of an address (https://host), for naming a form provider in the Content Security Policy.
  eleventyConfig.addFilter("originOf", (url) => { try { return new URL(url).origin; } catch { return ""; } });
  eleventyConfig.addFilter("toolAt", (tools, url, lang) => tools.find((tool) => tool.url === localUrl(url, lang)) || null);
  // A family by its id (the "next" orbit of a role).
  eleventyConfig.addFilter("familyById", (families, id) => families.find((family) => family.id === id) || null);
  // Essays by file slug, in the order given.
  eleventyConfig.addFilter("bySlugs", (items, slugs) =>
    (slugs || []).map((slug) => (items || []).find((item) => item.fileSlug === slug)).filter(Boolean)
  );
  // The social preview of the homepage, the Tools page, a tool page or a role page (made by scripts/social-cards.mjs), if there is one.
  eleventyConfig.addFilter("socialCard", (url, lang) => {
    const path = String(url || "").replace(/^\/(de|sq)(?=\/)/, "");
    const role = path.match(/^\/roles\/([^/]+)\/$/)?.[1];
    // The writing pages and Start here have cards of their own (made by scripts/page-cards.mjs).
    const page = path.match(/^\/(start|insights|reflections|field-notes|about)\.html$/)?.[1];
    const slug = path === "/" ? "home" : path === "/tools.html" ? "tools" : page ? `page-${page}` : role ? `role-${role}` : path.match(/^\/tools\/([^/]+)\/$/)?.[1];
    const file = slug && `/media/social/${TRANSLATED.has(lang) ? lang : "en"}/${slug}.jpg`;
    return file && fs.existsSync(`src${file}`) ? file : null;
  });
  // The search index of a language, as JSON (lib/search-index.js, read by js/search.js).
  eleventyConfig.addFilter("searchIndex", (lang, collections, tools, pages) => {
    const suffix = TRANSLATED.has(lang) ? lang[0].toUpperCase() + lang.slice(1) : "";
    return JSON.stringify(searchIndex({
      essays: collections[`insights${suffix}`],
      reflections: collections[`reflections${suffix}`],
      notes: collections[`notes${suffix}`],
      tools,
      pages,
      local: (url) => localUrl(url, lang),
    }));
  });
  // The link preview of an essay or a reflection (made by scripts/page-cards.mjs), if there is one; it follows
  // the file, so an essay that keeps an older address still finds it.
  eleventyConfig.addFilter("pieceCard", (page, lang) => {
    const section = String(page?.inputPath || "").match(/\/(insights|reflections)\/[^/]+\.md$/)?.[1];
    if (!section) return null;
    const file = `/media/social/${TRANSLATED.has(lang) ? lang : "en"}/${section === "insights" ? "insight" : "reflection"}-${page.fileSlug}.jpg`;
    return fs.existsSync(`src${file}`) ? file : null;
  });
  // The picture of a tool's result on its card (made by scripts/tool-previews.mjs), if there is one.
  // The smaller WebP copies of an image (scripts/thumbnails.mjs: name-240.webp, name-480.webp, name-720.webp)
  // and the image itself, as a srcset; only copies that exist are offered, so a missing one costs nothing.
  eleventyConfig.addFilter("srcsetFor", (src) => {
    const clean = String(src || "").split("?")[0];
    const base = clean.replace(/\.(webp|jpg|png)$/, "");
    if (!clean || base === clean) return "";
    const copies = [240, 480, 720].filter((width) => fs.existsSync(`src${base}-${width}.webp`)).map((width) => `${base}-${width}.webp ${width}w`);
    if (!copies.length) return "";
    const size = eleventyConfig.getFilter("imageSize")(clean);
    return size ? [...copies, `${src} ${size.width}w`].join(", ") : copies.join(", ");
  });
  eleventyConfig.addFilter("toolPreview", (url, lang) => {
    const slug = String(url || "").replace(/^\/(de|sq)(?=\/)/, "").match(/^\/tools\/([^/]+)\/$/)?.[1];
    const file = slug && `/media/tools/${TRANSLATED.has(lang) ? lang : "en"}/${slug}.jpg`;
    return file && fs.existsSync(`src${file}`) ? file : null;
  });
  // The English address of a page in any language: /de/tools/x/ becomes /tools/x/.
  eleventyConfig.addFilter("enPath", (url) => String(url || "").replace(/^\/(de|sq)(?=\/)/, ""));
  // The essay of a language that translates the English essay with this file slug (its "original"), or the English one itself.
  eleventyConfig.addFilter("byOriginal", (items, slug) => (items || []).find((item) => item.data.original === slug || item.fileSlug === slug) || null);
  // Tools that no family lists yet, so a new tool is never left off the page.
  eleventyConfig.addFilter("unassigned", (tools, families, lang) =>
    tools.filter((tool) => !families.some((family) => [...family.tools, ...family.learn].some((url) => localUrl(url, lang) === tool.url)))
  );
  // Lower case mid-sentence, except in German, where nouns keep their capital.
  eleventyConfig.addFilter("lc", (text, lang) => (lang === "de" ? String(text) : String(text).toLowerCase()));
  eleventyConfig.addWatchTarget("src/_data/de/");
  eleventyConfig.addWatchTarget("src/_data/sq/");
  eleventyConfig.on("eleventy.before", () => { ui.clear(); clearCache(); assetVersions.clear(); imageSizes.clear(); });
  // A minified stylesheet, and a lighter one for the pages that are not tools (lib/css-split.js).
  eleventyConfig.on("eleventy.after", ({ dir }) => splitStylesheet(dir?.output || "_site"));
  // Letter pairs that would touch in the tight display titles get their space (lib/display-pairs.js).
  eleventyConfig.addTransform("display-pairs", function (content) {
    return (this.page.outputPath || "").endsWith(".html") ? markPairs(content) : content;
  });
  // Minified scripts in the output; the sources stay readable (lib/js-minify.js).
  eleventyConfig.on("eleventy.after", async ({ dir }) => { await minifyScripts(dir?.output || "_site"); });

  eleventyConfig.addFilter("readableDate", (date, lang) =>
    new Date(date).toLocaleDateString(LOCALES[lang] || LOCALES.en, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  // Oldest first, and in file order within a day (the order the note of the day cycles through).
  eleventyConfig.addFilter("chronological", (items) => [...(items || [])].sort((a, b) => a.date - b.date || a.fileSlug.localeCompare(b.fileSlug)));
  // The field notes as the home page's note of the day reads them (js/note-of-the-day.js).
  eleventyConfig.addFilter("noteDayData", (notes, lang) =>
    (notes || []).map((note) => ({
      q: note.data.quote,
      id: `note-${note.fileSlug}`,
      d: new Date(note.date).toLocaleDateString(LOCALES[lang] || LOCALES.en, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
      iso: new Date(note.date).toISOString().slice(0, 10),
      // The note as an image to post (scripts/note-cards.mjs), when there is one.
      img: noteImage(note.fileSlug, lang),
    }))
  );
  eleventyConfig.addFilter("pad", (value) => String(value).padStart(2, "0"));
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  // One object over another, for the structured data (partials/structured-data.njk).
  eleventyConfig.addFilter("merge", (base, extra) => ({ ...base, ...extra }));
  // The first item of a list whose key has this value (a tool by its url).
  eleventyConfig.addFilter("where", (list, key, value) => (list || []).find((item) => item[key] === value));
  eleventyConfig.addFilter("absoluteUrl", (path) => new URL(String(path).replace(/^\//, ""), site.url).href);
  // The newest published essay marked "featured", for the homepage.
  eleventyConfig.addFilter("featured", (items) =>
    items.filter((item) => item.data.featured && item.data.status !== "soon").at(-1)
  );
  eleventyConfig.addFilter("topics", (items, key) =>
    [...new Set(items.map((item) => item.data[key]).filter(Boolean))].sort()
  );
  eleventyConfig.addFilter("except", (items, excluded) => items.filter((item) => item !== excluded));
  eleventyConfig.addFilter("last", (items, count) => items.slice(-count));
  eleventyConfig.addFilter("first", (items, count) => items.slice(0, count));

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: new URL(site.url).pathname,
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
