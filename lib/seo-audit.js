// An SEO audit of the built site (_site), run after the build: what a search engine finds when it crawls the pages as
// GitHub Pages serves them. It reads the files only; nothing is fetched.
//
// The report keeps three lists apart:
//   errors       genuine problems (a sitemap address that does not answer 200, a canonical that is not the page's
//                own address, hreflang that does not link back, a broken internal link, a noindex nobody asked for);
//                CI fails on any of them;
//   warnings     genuine but not blocking (duplicate titles, links through a redirect, important pages that few
//                other pages link to in their text);
//   intentional  pages kept out of search on purpose (the 404, the offline page, the search page, the shelf, the
//                legal pages), with the reason; they are reported, not counted as problems.
//
// How GitHub Pages answers, which the audit follows: "/a/" and "/a/index.html" serve the file a/index.html (200);
// "/a" when a/index.html exists redirects to "/a/" (301); "/a" when a.html exists serves it (200, an alias of
// "/a.html"); anything else serves 404.html with status 404.
import fs from "node:fs";
import path from "node:path";

export const ORIGIN = "https://stivencatalyst.com";

// Pages that are noindex on purpose, by their path; the reason is part of the report. Any other noindex page is an
// error. A page listed here that is indexable is reported too (the list would then be out of date).
export const INTENTIONAL_NOINDEX = [
  { pattern: /^\/404\.html$/, reason: "Not-found page: served with status 404 for every missing address." },
  { pattern: /^\/offline\.html$/, reason: "Offline fallback of the service worker; not a page of its own." },
  { pattern: /^\/(?:(?:de|sq)\/)?search\.html$/, reason: "Site search results page: thin, query-driven content." },
  { pattern: /^\/(?:(?:de|sq)\/)?shelf\.html$/, reason: "The reader's personal shelf, stored in their browser; no content of its own." },
  { pattern: /^\/(?:(?:de|sq)\/)?(?:impressum|datenschutz)\.html$/, reason: "Legal notice and privacy policy: kept out of search so the author's postal address is not indexed." },
];

const decode = (text) =>
  String(text ?? "")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

// The attributes of one tag, as a lower-case-keyed object.
export const attributes = (tag) => {
  const out = {};
  for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    const name = match[1].toLowerCase();
    if (name === tag.match(/^<\s*([a-zA-Z0-9]+)/)?.[1].toLowerCase()) continue;
    out[name] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return out;
};

const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => ({ tag: m[0], index: m.index, attrs: attributes(m[0]) }));

// The address a built file is served at.
export const urlOfFile = (siteDir, file) => {
  const rel = "/" + path.relative(siteDir, file).split(path.sep).join("/");
  if (rel === "/index.html") return "/";
  return rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
};

// How GitHub Pages answers a path of this site: { status, file, location }.
export const resolvePath = (siteDir, urlPath) => {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { p = urlPath; }
  if (!p.startsWith("/")) p = "/" + p;
  const local = path.join(siteDir, ...p.split("/").filter(Boolean));
  const isFile = (f) => { try { return fs.statSync(f).isFile(); } catch { return false; } };
  if (p.endsWith("/")) {
    const index = path.join(local, "index.html");
    return isFile(index) ? { status: 200, file: index } : { status: 404 };
  }
  if (isFile(local)) return { status: 200, file: local };
  if (isFile(path.join(local, "index.html"))) return { status: 301, location: p + "/" };
  if (isFile(local + ".html")) return { status: 200, file: local + ".html", alias: p + ".html" };
  return { status: 404 };
};

// The path of a link on this site, or null for one elsewhere (or a mailto:, tel:, javascript:, data: link).
export const internalPath = (href, fromUrl) => {
  const value = String(href ?? "").trim();
  if (!value || value.startsWith("#") || /^(mailto|tel|javascript|data|blob|sms):/i.test(value)) return null;
  let url;
  try { url = new URL(value, ORIGIN + fromUrl); } catch { return null; }
  if (url.origin !== ORIGIN && url.origin !== "https://www.stivencatalyst.com" && url.origin !== "http://stivencatalyst.com") return null;
  return url.pathname;
};

const textOf = (html) =>
  decode(html.replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();

// What the audit needs from one page.
export const parsePage = (html, url) => {
  const head = html.slice(0, (html.search(/<\/head>/i) + 1 || html.length + 1) - 1);
  const title = decode(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim();
  const metas = tags(head, "meta");
  const description = metas.find((m) => m.attrs.name?.toLowerCase() === "description")?.attrs.content ?? null;
  const robots = metas.filter((m) => m.attrs.name?.toLowerCase() === "robots" || m.attrs.name?.toLowerCase() === "googlebot").map((m) => (m.attrs.content || "").toLowerCase());
  const links = tags(head, "link");
  const canonicals = links.filter((l) => (l.attrs.rel || "").toLowerCase().split(/\s+/).includes("canonical")).map((l) => l.attrs.href);
  const hreflang = {};
  for (const l of links.filter((l) => (l.attrs.rel || "").toLowerCase() === "alternate" && l.attrs.hreflang)) hreflang[l.attrs.hreflang.toLowerCase()] = l.attrs.href;
  const lang = (html.match(/<html\b[^>]*\blang="([^"]*)"/i)?.[1] || "").toLowerCase();
  const mainStart = html.search(/<main\b/i);
  const mainEnd = html.search(/<\/main>/i);
  const main = mainStart >= 0 && mainEnd > mainStart ? html.slice(mainStart, mainEnd) : "";
  const anchors = tags(html, "a").filter((a) => a.attrs.href !== undefined);
  const outgoing = anchors.map((a) => ({
    href: a.attrs.href,
    path: internalPath(a.attrs.href, url),
    contextual: mainStart >= 0 && a.index > mainStart && a.index < mainEnd,
  })).filter((a) => a.path !== null);
  const ogUrl = metas.find((m) => m.attrs.property === "og:url")?.attrs.content ?? null;
  const jsonLd = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try { JSON.parse(m[1]); return true; } catch { return false; }
  });
  return {
    url, title, description, lang, canonicals, hreflang, ogUrl, jsonLd,
    noindex: robots.some((r) => /\bnoindex\b/.test(r)),
    nofollow: robots.some((r) => /\bnofollow\b/.test(r)),
    words: main ? textOf(main).split(" ").filter(Boolean).length : 0,
    outgoing,
  };
};

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : entry.name.endsWith(".html") ? [file] : [];
});

const normalise = (u) => u.replace(/\/index\.html$/, "/");
const pathOfAbsolute = (u) => { try { const x = new URL(u); return x.origin === ORIGIN ? x.pathname : null; } catch { return null; } };

export const audit = (siteDir = "_site", { priority = [], minContextualLinks = 3 } = {}) => {
  const errors = [];
  const warnings = [];
  const intentional = [];
  const err = (check, url, detail) => errors.push({ check, url, detail });
  const warn = (check, url, detail) => warnings.push({ check, url, detail });

  // Every page, keyed by its address. A file without <html> is a fragment (a print part), not a page.
  const pages = new Map();
  for (const file of walk(siteDir)) {
    const html = fs.readFileSync(file, "utf8");
    if (!/<html\b/i.test(html)) continue;
    const url = urlOfFile(siteDir, file);
    pages.set(url, parsePage(html, url));
  }

  // robots.txt: a Disallow for every crawler would hide pages the sitemap offers.
  const robotsFile = path.join(siteDir, "robots.txt");
  const robotsTxt = fs.existsSync(robotsFile) ? fs.readFileSync(robotsFile, "utf8") : "";
  if (!robotsTxt) err("robots", "/robots.txt", "robots.txt is missing");
  const disallows = [];
  let star = false;
  for (const line of robotsTxt.split(/\r?\n/)) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (/^user-agent$/i.test(key.trim())) star = value === "*";
    else if (star && /^disallow$/i.test(key.trim()) && value) disallows.push(value);
  }
  if (!/^sitemap:\s*https:\/\/stivencatalyst\.com\/sitemap\.xml\s*$/im.test(robotsTxt)) err("robots", "/robots.txt", "robots.txt does not name the sitemap at its absolute address");
  const blocked = (p) => disallows.some((d) => p.startsWith(d));

  // The sitemap.
  const sitemapFile = path.join(siteDir, "sitemap.xml");
  const sitemapXml = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, "utf8") : "";
  if (!sitemapXml) err("sitemap", "/sitemap.xml", "sitemap.xml is missing");
  const locs = [...sitemapXml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => decode(m[1]).trim());
  const inSitemap = new Set();
  for (const loc of locs) {
    const p = pathOfAbsolute(loc);
    if (p === null) { err("sitemap", loc, "address is not on https://stivencatalyst.com"); continue; }
    if (inSitemap.has(p)) err("sitemap", p, "listed more than once");
    inSitemap.add(p);
    const answer = resolvePath(siteDir, p);
    if (answer.status !== 200) { err("sitemap", p, `answers ${answer.status}${answer.location ? ` → ${answer.location}` : ""}, not 200`); continue; }
    if (answer.alias) err("sitemap", p, `served as an alias of ${answer.alias}; list the canonical address`);
    const page = pages.get(normalise(p));
    if (!page) continue;
    if (page.noindex) err("sitemap", p, "listed but the page is noindex");
    if (page.canonicals[0] && page.canonicals[0] !== ORIGIN + p) err("sitemap", p, `listed but its canonical is ${page.canonicals[0]}`);
    if (blocked(p)) err("sitemap", p, "listed but robots.txt disallows it");
  }
  const lastmods = [...sitemapXml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1]);
  for (const day of lastmods) if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) err("sitemap", "/sitemap.xml", `lastmod "${day}" is not a date`);

  // Each page: indexing, canonical, hreflang, title and description.
  for (const page of pages.values()) {
    const { url } = page;
    const reason = INTENTIONAL_NOINDEX.find((rule) => rule.pattern.test(url))?.reason;
    if (page.noindex) {
      if (reason) intentional.push({ url, kind: "noindex", reason, inSitemap: inSitemap.has(url) });
      else err("noindex", url, "noindex that is not on the list of intentional exclusions");
      if (page.canonicals.length) warn("canonical", url, "a noindex page also names a canonical address");
      continue;
    }
    if (reason) err("noindex", url, "listed as an intentional exclusion but indexable; update INTENTIONAL_NOINDEX or the page");
    if (url === "/404.html") err("404", url, "the not-found page is indexable");

    if (page.canonicals.length !== 1) err("canonical", url, `${page.canonicals.length} canonical links, expected 1`);
    const canonical = page.canonicals[0];
    if (canonical && canonical !== ORIGIN + url) err("canonical", url, `canonical ${canonical} is not the page's own address`);
    if (!inSitemap.has(url)) err("sitemap", url, "indexable page missing from the sitemap");
    if (blocked(url)) err("robots", url, "indexable page disallowed by robots.txt");

    if (page.ogUrl && canonical && page.ogUrl !== canonical) err("og-url", url, `og:url ${page.ogUrl} differs from the canonical ${canonical}`);
    page.jsonLd.forEach((ok, i) => { if (!ok) err("structured-data", url, `JSON-LD block ${i + 1} does not parse`); });
    if (!page.title) err("title", url, "no <title>");
    if (!page.description) err("description", url, "no meta description");
    if (!page.lang) err("lang", url, "<html> has no lang");

    const codes = Object.keys(page.hreflang);
    if (codes.length) {
      const own = page.lang || "en";
      if (page.hreflang[own] !== ORIGIN + url) err("hreflang", url, `no self-referencing hreflang="${own}"`);
      if (page.hreflang["x-default"] && page.hreflang["x-default"] !== page.hreflang.en) err("hreflang", url, "x-default is not the English page");
      for (const code of codes) {
        if (code === "x-default") continue;
        const target = pathOfAbsolute(page.hreflang[code]);
        if (target === null) { err("hreflang", url, `hreflang="${code}" is not on this site: ${page.hreflang[code]}`); continue; }
        const answer = resolvePath(siteDir, target);
        if (answer.status !== 200) { err("hreflang", url, `hreflang="${code}" → ${target} answers ${answer.status}`); continue; }
        const other = pages.get(normalise(target));
        if (!other) continue;
        if (other.noindex) err("hreflang", url, `hreflang="${code}" → ${target} is noindex`);
        if (other.lang && other.lang !== code) err("hreflang", url, `hreflang="${code}" → ${target}, a page in "${other.lang}"`);
        if (target !== url && other.hreflang[own] !== ORIGIN + url) err("hreflang", url, `${target} does not link back with hreflang="${own}"`);
      }
    }
  }

  // Internal links: broken, through a redirect, or to an alias; and how many pages link to each page.
  const inbound = new Map();
  const contextualInbound = new Map();
  const add = (map, key, from) => { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(from); };
  const seen = new Set();
  for (const page of pages.values()) {
    for (const link of page.outgoing) {
      const answer = resolvePath(siteDir, link.path);
      const key = `${page.url} ${link.path}`;
      if (answer.status === 404) {
        if (!seen.has(key)) err("broken-link", page.url, `links to ${link.href}, which answers 404`);
      } else if (answer.status === 301) {
        if (!seen.has(key)) warn("redirect-link", page.url, `links to ${link.href}, which redirects to ${answer.location}`);
      } else if (answer.alias) {
        if (!seen.has(key)) warn("alias-link", page.url, `links to ${link.href}; the address is ${answer.alias}`);
      }
      seen.add(key);
      const target = answer.status === 301 ? answer.location : answer.alias || link.path;
      const targetUrl = normalise(target);
      if (targetUrl === page.url || !pages.has(targetUrl)) continue;
      add(inbound, targetUrl, page.url);
      if (link.contextual) add(contextualInbound, targetUrl, page.url);
    }
  }

  // Duplicate titles and descriptions among indexable pages. The same page in two languages may share a title (a
  // tool's name), so pages linked to each other by hreflang are not duplicates of each other.
  const indexable = [...pages.values()].filter((p) => !p.noindex);
  const cluster = (p) => new Set([p.url, ...Object.values(p.hreflang).map(pathOfAbsolute).filter(Boolean)]);
  const duplicates = (field) => {
    const groups = new Map();
    for (const p of indexable) if (p[field]) { if (!groups.has(p[field])) groups.set(p[field], []); groups.get(p[field]).push(p); }
    const out = [];
    for (const [value, members] of groups) {
      if (members.length < 2) continue;
      const translationsOnly = members.every((a) => members.every((b) => a === b || cluster(a).has(b.url)));
      if (!translationsOnly) out.push({ value, urls: members.map((m) => m.url).sort() });
    }
    return out.sort((a, b) => b.urls.length - a.urls.length || a.value.localeCompare(b.value));
  };
  const duplicateTitles = duplicates("title");
  const duplicateDescriptions = duplicates("description");
  for (const d of duplicateTitles) warn("duplicate-title", d.urls[0], `"${d.value}" on ${d.urls.length} pages: ${d.urls.join(", ")}`);
  for (const d of duplicateDescriptions) warn("duplicate-description", d.urls[0], `the same description on ${d.urls.length} pages: ${d.urls.join(", ")}`);

  // Pages no other page links to (orphans), and important pages with few links from the text of other pages.
  const orphans = indexable.filter((p) => p.url !== "/" && !(inbound.get(p.url)?.size)).map((p) => p.url).sort();
  for (const url of orphans) warn("orphan", url, "no other page links to it; only the sitemap leads here");

  const priorityReport = priority.map((entry) => {
    const url = typeof entry === "string" ? entry : entry.url;
    const p = pathOfAbsolute(url.startsWith("http") ? url : ORIGIN + url) ?? url;
    const answer = resolvePath(siteDir, p);
    const page = pages.get(normalise(p));
    const row = {
      url: p,
      label: entry.label || "",
      status: answer.status,
      indexable: page ? !page.noindex : false,
      inSitemap: inSitemap.has(p),
      canonicalOk: page ? page.canonicals.length === 1 && page.canonicals[0] === ORIGIN + p : false,
      hreflang: page ? Object.keys(page.hreflang).filter((c) => c !== "x-default").sort() : [],
      title: page?.title ?? "",
      titleLength: page?.title.length ?? 0,
      descriptionLength: page?.description?.length ?? 0,
      words: page?.words ?? 0,
      inbound: inbound.get(normalise(p))?.size ?? 0,
      contextualInbound: contextualInbound.get(normalise(p))?.size ?? 0,
    };
    if (answer.status !== 200 && !url.match(/\.(pdf|xml|js)(\?|$)/)) err("priority", p, `a priority page answers ${answer.status}`);
    else if (page && !page.noindex && row.contextualInbound < minContextualLinks) {
      warn("weak-internal-links", p, `only ${row.contextualInbound} other page(s) link to it from their text (target ${minContextualLinks}+)`);
    }
    return row;
  });

  // The not-found page.
  const notFound = pages.get("/404.html");
  if (!notFound) err("404", "/404.html", "404.html is missing; GitHub Pages would show its own page");

  return {
    summary: {
      pages: pages.size,
      indexable: indexable.length,
      sitemapUrls: locs.length,
      intentionalExclusions: intentional.length,
      errors: errors.length,
      warnings: warnings.length,
    },
    errors, warnings, intentional, duplicateTitles, duplicateDescriptions, orphans, priority: priorityReport,
  };
};

// The report as Markdown, for a person (and the CI log).
export const toMarkdown = (report) => {
  const lines = [];
  const s = report.summary;
  lines.push("# SEO audit of the built site", "");
  lines.push(`Pages: ${s.pages} · indexable: ${s.indexable} · in the sitemap: ${s.sitemapUrls} · intentional exclusions: ${s.intentionalExclusions}`);
  lines.push(`**Errors: ${s.errors}** · warnings: ${s.warnings}`, "");
  const group = (items) => {
    const by = new Map();
    for (const item of items) { if (!by.has(item.check)) by.set(item.check, []); by.get(item.check).push(item); }
    return by;
  };
  lines.push("## Errors (genuine problems; CI fails)", "");
  if (!report.errors.length) lines.push("None.", "");
  for (const [check, items] of group(report.errors)) {
    lines.push(`### ${check} (${items.length})`, "");
    for (const i of items.slice(0, 50)) lines.push(`- \`${i.url}\`: ${i.detail}`);
    if (items.length > 50) lines.push(`- … and ${items.length - 50} more`);
    lines.push("");
  }
  lines.push("## Warnings (genuine, not blocking)", "");
  if (!report.warnings.length) lines.push("None.", "");
  for (const [check, items] of group(report.warnings)) {
    lines.push(`### ${check} (${items.length})`, "");
    for (const i of items.slice(0, 50)) lines.push(`- \`${i.url}\`: ${i.detail}`);
    if (items.length > 50) lines.push(`- … and ${items.length - 50} more`);
    lines.push("");
  }
  lines.push("## Intentional exclusions (not problems)", "");
  for (const i of report.intentional) lines.push(`- \`${i.url}\`: ${i.reason}${i.inSitemap ? " **(but listed in the sitemap)**" : " Not in the sitemap."}`);
  lines.push("");
  if (report.priority.length) {
    lines.push("## Priority pages", "");
    lines.push("| Page | Status | Indexable | Sitemap | Canonical | hreflang | Title chars | Desc chars | Words | Links in | In text |");
    lines.push("|---|---|---|---|---|---|---|---|---|---|---|");
    for (const r of report.priority) {
      const yes = (v) => (v ? "yes" : "**no**");
      lines.push(`| \`${r.url}\` | ${r.status} | ${yes(r.indexable)} | ${yes(r.inSitemap)} | ${yes(r.canonicalOk)} | ${r.hreflang.join(" ") || "–"} | ${r.titleLength} | ${r.descriptionLength} | ${r.words} | ${r.inbound} | ${r.contextualInbound} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
};
