import { HtmlBasePlugin } from "@11ty/eleventy";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { clearCache, localUrl } from "./lib/translations.js";

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

  for (const path of ["styles.css", "script.js", "favicon.svg", "social.png", "fonts", "media", "js"]) {
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
    eleventyConfig.addCollection(`projects${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/projects/*.md`).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    );
  }

  eleventyConfig.addGlobalData("year", new Date().getFullYear());

  // {{ "Add to log" | t(lang) }}: the German or Albanian text on those pages, else the English one.
  eleventyConfig.addFilter("t", (text, lang) => (TRANSLATED.has(lang) ? readUi(lang)[text] ?? text : text));
  // The interface texts a tool page hands to tool-kit.js.
  eleventyConfig.addFilter("uiStrings", (lang) => JSON.stringify(TRANSLATED.has(lang) ? readUi(lang) : {}));
  // collections["notes" + (lang | langSuffix)]: notes, notesDe or notesSq.
  eleventyConfig.addFilter("langSuffix", (lang) => (TRANSLATED.has(lang) ? lang[0].toUpperCase() + lang.slice(1) : ""));
  // A changed asset gets a new URL, so browsers do not keep an old script or stylesheet.
  eleventyConfig.addFilter("assetUrl", (path) => {
    const file = `src${path}`;
    if (!assetVersions.has(file)) {
      assetVersions.set(file, createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, 10));
    }
    return `${path}?v=${assetVersions.get(file)}`;
  });
  // Links stay in the page's language: /tools/x/ becomes /de/tools/x/ or /sq/tools/x/.
  eleventyConfig.addFilter("local", localUrl);
  // The tools of one family (families.json), in the page's language and in the family's order.
  eleventyConfig.addFilter("familyTools", (family, tools, lang) =>
    family.tools.map((url) => tools.find((tool) => tool.url === localUrl(url, lang))).filter(Boolean)
  );
  // The family a tool page belongs to (/tools/x/, /de/tools/x/ or /sq/tools/x/), else null.
  eleventyConfig.addFilter("familyOf", (url, families) => {
    const path = String(url || "").replace(/^\/(de|sq)(?=\/)/, "");
    return families.find((family) => family.tools.includes(path)) || null;
  });
  // The social preview of a tool page or the Tools page (made by scripts/social-cards.mjs), if there is one.
  eleventyConfig.addFilter("socialCard", (url, lang) => {
    const path = String(url || "").replace(/^\/(de|sq)(?=\/)/, "");
    const slug = path === "/tools.html" ? "tools" : path.match(/^\/tools\/([^/]+)\/$/)?.[1];
    const file = slug && `/media/social/${TRANSLATED.has(lang) ? lang : "en"}/${slug}.jpg`;
    return file && fs.existsSync(`src${file}`) ? file : null;
  });
  // Tools that no family lists yet, so a new tool is never left off the page.
  eleventyConfig.addFilter("unassigned", (tools, families, lang) =>
    tools.filter((tool) => !families.some((family) => family.tools.some((url) => localUrl(url, lang) === tool.url)))
  );
  // Lower case mid-sentence, except in German, where nouns keep their capital.
  eleventyConfig.addFilter("lc", (text, lang) => (lang === "de" ? String(text) : String(text).toLowerCase()));
  eleventyConfig.addWatchTarget("src/_data/de/");
  eleventyConfig.addWatchTarget("src/_data/sq/");
  eleventyConfig.on("eleventy.before", () => { ui.clear(); clearCache(); assetVersions.clear(); });

  eleventyConfig.addFilter("readableDate", (date, lang) =>
    new Date(date).toLocaleDateString(LOCALES[lang] || LOCALES.en, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("pad", (value) => String(value).padStart(2, "0"));
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
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
