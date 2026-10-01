import { HtmlBasePlugin } from "@11ty/eleventy";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { clearCache, localUrl } from "./lib/translations.js";
import { splitStylesheet } from "./lib/css-split.js";

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
    eleventyConfig.addCollection(`projects${suffix}`, (api) =>
      api.getFilteredByGlob(`src/content/${lang}/projects/*.md`).sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    );
  }

  eleventyConfig.addGlobalData("year", new Date().getFullYear());

  // {{ "Add to log" | t(lang) }}: the German or Albanian text on those pages, else the English one.
  eleventyConfig.addFilter("t", (text, lang) => (TRANSLATED.has(lang) ? readUi(lang)[text] ?? text : text));
  // The interface texts a tool page hands to tool-kit.js.
  eleventyConfig.addFilter("uiStrings", (lang) => JSON.stringify(TRANSLATED.has(lang) ? readUi(lang) : {}));
  // The address of that text as one file (src/ui-strings.njk), which the browser keeps between
  // tool pages; it changes when the translations do.
  eleventyConfig.addFilter("uiStringsUrl", (lang) =>
    `/js/ui-${lang}.js?v=${createHash("sha256").update(JSON.stringify(readUi(lang))).digest("hex").slice(0, 10)}`
  );
  // JSON embedded in HTML must not be able to close its script element.
  eleventyConfig.addFilter("scriptJson", (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`));
  // The coaching curriculum as one file (src/coaching-data.njk) the browser keeps; its address changes with the content.
  eleventyConfig.addFilter("coachingDataUrl", (coaching) =>
    `/js/coaching-data.js?v=${createHash("sha256").update(JSON.stringify(coaching)).digest("hex").slice(0, 10)}`
  );
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
  // The page of a family's role: /roles/shift-lead/, /de/roles/shift-lead/ ...
  eleventyConfig.addFilter("roleUrl", (family, lang) => localUrl(`/roles/${family.slug}/`, lang));
  // One tool by its English address, in the page's language.
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
    const slug = path === "/" ? "home" : path === "/tools.html" ? "tools" : role ? `role-${role}` : path.match(/^\/tools\/([^/]+)\/$/)?.[1];
    const file = slug && `/media/social/${TRANSLATED.has(lang) ? lang : "en"}/${slug}.jpg`;
    return file && fs.existsSync(`src${file}`) ? file : null;
  });
  // Tools that no family lists yet, so a new tool is never left off the page.
  eleventyConfig.addFilter("unassigned", (tools, families, lang) =>
    tools.filter((tool) => !families.some((family) => [...family.tools, ...family.learn].some((url) => localUrl(url, lang) === tool.url)))
  );
  // Lower case mid-sentence, except in German, where nouns keep their capital.
  eleventyConfig.addFilter("lc", (text, lang) => (lang === "de" ? String(text) : String(text).toLowerCase()));
  eleventyConfig.addWatchTarget("src/_data/de/");
  eleventyConfig.addWatchTarget("src/_data/sq/");
  eleventyConfig.on("eleventy.before", () => { ui.clear(); clearCache(); assetVersions.clear(); });
  // A minified stylesheet, and a lighter one for the pages that are not tools (lib/css-split.js).
  eleventyConfig.on("eleventy.after", ({ dir }) => splitStylesheet(dir?.output || "_site"));

  eleventyConfig.addFilter("readableDate", (date, lang) =>
    new Date(date).toLocaleDateString(LOCALES[lang] || LOCALES.en, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
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
