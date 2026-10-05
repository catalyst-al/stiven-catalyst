// The search index of one language (/search-index.json, /de/…, /sq/…), read by js/search.js on the Search page.
// Each entry: { k: kind, t: title, s: summary, b: body text, u: address }. The kind is one of essay, reflection,
// note, tool or page; the Search page names it in the reader's language. Bodies are the written text without
// Markdown, so a word from inside an essay finds it too.

// Markdown or HTML to plain text: links keep their words, marks and tags go.
export const plainText = (markdown) =>
  String(markdown || "")
    .replace(/<[^>]+>/g, " ")
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
export const searchIndex = ({ essays = [], reflections = [], notes = [], tools = [], pages = [], local }) => [
  ...essays
    .filter((item) => item.data.status !== "soon")
    .map((item) => ({ k: "essay", t: item.data.title, s: item.data.teaser || item.data.summary || "", b: plainText(item.rawInput).slice(0, MAX_BODY), u: item.url })),
  ...reflections.map((item) => ({ k: "reflection", t: item.data.title, s: item.data.summary || "", b: plainText(item.rawInput).slice(0, MAX_BODY), u: item.url })),
  ...notes.map((item) => ({ k: "note", t: item.data.quote, s: "", b: "", u: `${local("/field-notes.html")}#note-${item.fileSlug}` })),
  ...tools.map((tool) => ({ k: "tool", t: tool.name, s: tool.summary || "", b: "", u: tool.url })),
  ...pages.map((page) => ({ k: "page", t: page.title, s: page.summary || "", b: "", u: local(page.url) })),
];
