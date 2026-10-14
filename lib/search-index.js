// The search index of one language (/search-index.json, /de/…, /sq/…), read by js/search.js on the Search page.
// Each entry: { k: kind, t: title, s: summary, b: body text, u: address }. The kind is one of essay, reflection,
// note, tool or page; the Search page names it in the reader's language. Bodies are the written text without
// Markdown, so a word from inside an essay finds it too.

// Markdown or HTML to plain text: links keep their words, marks and tags go.
export const plainText = (markdown) =>
  String(markdown || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{diagram\}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~]+/g, "")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const MAX_BODY = 12000;

// items: { essays, reflections, notes } (Eleventy collection items), tools (the tools list of the language),
// pages: [{ title, summary, url }], local(url): the address in this language.
// The publications of a language, by what their reader shows first: each issue of the Management Review and its special
// edition, the volumes of the treatise, the magazine from the floor and the Tools Guide, and the podcast page. Title,
// line, the opening text and the teasers are indexed, not every page word for word (that would make the index heavy).
// Kinds: issue, treatise, floor, guide, podcast. Addresses are English; the caller makes them local.
export const publicationEntries = ({ weekly, treatise, magazine, review, toolsGuide, podcast } = {}, lang = "en") => {
  const of = (item) => item?.[lang] || item?.en || {};
  const join = (...parts) => parts.flat().filter(Boolean).join(" · ");
  // name: the publication's own name in this language, so that "Management Review" or "No. 14" finds its issues.
  const entry = (k, item, name) => {
    const text = of(item);
    return { k, t: text.heading || "", s: text.sub || "", b: plainText(join(name, item.no && `${lang === "en" ? "No." : "Nr."} ${item.no}`, text.feature, (text.teasers || []).map((teaser) => teaser.title), text.figure?.by)), u: `/magazine/${item.slug}.html` };
  };
  const reviewName = weekly ? of(weekly).name || weekly.name : "";
  const special = review ? of(review) : null;
  const guide = toolsGuide ? of(toolsGuide) : null;
  const listen = podcast ? of(podcast) : null;
  return [
    ...(weekly?.issues || []).map((item) => entry("issue", item, reviewName)),
    ...(special ? [{ k: "issue", t: join(special.theme), s: special.sub || "", b: plainText(join(special.name, special.tagline)), u: `/magazine/${review.slug}.html` }] : []),
    ...(treatise?.volumes || []).map((item) => entry("treatise", item, of(item).edition)),
    ...(magazine?.issues || []).map((item) => entry("floor", item, of(magazine.names).name)),
    ...(guide ? [{ k: "guide", t: guide.title || "", s: guide.subtitle || "", b: "", u: "/guides/tools-guide.html" }] : []),
    ...(listen ? [{ k: "podcast", t: listen.heading || "", s: listen.lede || "", b: plainText(join("Podcast", listen.lede)), u: "/podcast.html" }] : []),
  ].filter((item) => item.t);
};

export const searchIndex = ({ essays = [], reflections = [], notes = [], tools = [], pages = [], publications = [], local }) => [
  ...essays
    .filter((item) => item.data.status !== "soon")
    .map((item) => ({ k: "essay", t: item.data.title, s: item.data.teaser || item.data.summary || "", b: plainText(item.rawInput).slice(0, MAX_BODY), u: item.url })),
  ...reflections.map((item) => ({ k: "reflection", t: item.data.title, s: item.data.summary || "", b: plainText(item.rawInput).slice(0, MAX_BODY), u: item.url })),
  ...notes.map((item) => ({ k: "note", t: item.data.quote, s: "", b: "", u: `${local("/field-notes.html")}#note-${item.fileSlug}` })),
  ...tools.map((tool) => ({ k: "tool", t: tool.name, s: tool.summary || "", b: "", u: tool.url })),
  ...pages.map((page) => ({ k: "page", t: page.title, s: page.summary || "", b: "", u: local(page.url) })),
  ...publications.map((item) => ({ ...item, u: local(item.u) })),
];
