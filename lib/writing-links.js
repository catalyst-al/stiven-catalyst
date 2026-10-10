// The writing and the tools, linked: which tools an essay is about, which essay a field note comes from and which
// tool a field note points to. Everything is read from the English texts, so the three languages link the same way
// (the German and Albanian essays follow their English original, a note keeps its file name in every language).
//
// - An essay's tools: "relatedTools" in its front matter when it has them; otherwise the tools its text talks about
//   most (TOOL_WORDS), at most two, each named at least MIN_ESSAY_HITS times (a new essay is linked before anyone
//   lists its tools; a list in the front matter is the editor's choice and always wins).
// - A note's essay: the essay that holds the note's words, in one sentence or a short passage (most notes were written
//   from an essay; a note that was not stands alone).
// - A note's tool: the tool its own words name; otherwise the first tool of its essay.
//
// scripts/field-notes.mjs uses the same reading to propose new field notes from the principles in the essays.

// The words that name a tool's subject, in English. Each pattern is matched on its own word boundaries.
export const TOOL_WORDS = {
  "/tools/shift-handover/": ["handovers?", "hand(s|ed)? (it |the work )?over", "next shift", "changed? hands", "inherit(ing)?", "transfer of responsibility"],
  "/tools/shift-pulse/": ["briefings?", "before the (shift|work) starts", "before a shift", "first hour of the shift", "the shift starts"],
  "/tools/kpi-diagnostic/": ["kpis?", "dashboards?", "metrics?", "(the|a|one) number", "numbers", "excel"],
  "/tools/five-whys/": ["root cause", "why (did )?it happened?", "same mistake", "(does not )?comes? back", "born", "5 why", "five whys"],
  "/tools/pareto/": ["pareto", "80/20", "priorit(y|ies|ise)"],
  "/tools/damage-control/": ["damaged?", "damage rate"],
  "/tools/incomplete-control/": ["incomplete (deliveries|orders)", "missing items"],
  "/tools/delay-analyzer/": ["delays?", "delayed", "on time", "departures?"],
  "/tools/sigma-control-chart/": ["sigma", "variation", "control chart", "consistent"],
  "/tools/cx-control-tower/": ["customers?", "complaints?", "last[- ]mile", "deliver(y|ies)"],
  "/tools/six-sigma-dmaic/": ["dmaic", "six sigma"],
  "/tools/cv-builder/": ["cv", "résumé", "job applications?", "career"],
  "/tools/ats-cv/": ["ats"],
  "/tools/cover-letter/": ["cover letter"],
};
const MIN_ESSAY_HITS = 6;
const PATTERNS = Object.entries(TOOL_WORDS).map(([url, words]) => [url, new RegExp(`(?<![\\w-])(${words.join("|")})(?![\\w-])`, "gi")]);

// Markdown as plain text: no front matter, links keep their words, no emphasis marks or headings.
export const plainText = (markdown) =>
  String(markdown || "")
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`#>]+/g, " ")
    .replace(/[ \t]+/g, " ");

// How often a text names each tool's subject: [[url, hits], …], most first, in the order of TOOL_WORDS on a tie.
export const toolScores = (text) => {
  const plain = plainText(text);
  return PATTERNS.map(([url, pattern]) => [url, (plain.match(pattern) || []).length])
    .filter(([, hits]) => hits > 0)
    .sort((a, b) => b[1] - a[1]);
};

// The tools an essay is about, read from its text.
export const toolsForEssay = (markdown) => toolScores(markdown).filter(([, hits]) => hits >= MIN_ESSAY_HITS).slice(0, 2).map(([url]) => url);

// Words to compare by: lower case, no accents or punctuation, without the short words every sentence has.
const words = (text) =>
  String(text || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 3);

// The share of a note's words that a passage holds (0–1).
export const overlap = (quote, passage) => {
  const own = [...new Set(words(quote))];
  if (!own.length) return 0;
  const there = new Set(words(passage));
  return own.filter((word) => there.has(word)).length / own.length;
};

// The passages of an essay a note could come from: each paragraph, and its summary, teaser and description.
const passages = (essay) => [
  essay.data?.summary, essay.data?.teaser, essay.data?.description,
  ...plainText(essay.text).split(/\n\s*\n/),
].filter(Boolean);

// The essay that holds a note's words: the best match, if it holds at least this share of them.
const SOURCE_SHARE = 0.75;
export const sourceEssay = (quote, essays) => {
  if (words(quote).length < 4) return null;
  let best = null;
  for (const essay of essays) {
    const share = Math.max(...passages(essay).map((passage) => overlap(quote, passage)));
    if (share >= SOURCE_SHARE && (!best || share > best.share)) best = { slug: essay.slug, share };
  }
  return best?.slug || null;
};

// All the links at once. essays: [{ slug, date, text, data: { relatedTools, summary, teaser, description } }],
// notes: [{ slug, date, quote }], both in English.
export const writingLinks = ({ essays = [], notes = [] }) => {
  const essayTools = Object.fromEntries(essays.map((essay) => [
    essay.slug,
    essay.data?.relatedTools?.length ? [...essay.data.relatedTools] : toolsForEssay(essay.text),
  ]));
  const noteLinks = Object.fromEntries(notes.map((note) => {
    const essay = sourceEssay(note.quote, essays);
    const named = toolScores(note.quote)[0]?.[0] || null;
    return [note.slug, { essay, tool: named || (essay && essayTools[essay][0]) || null }];
  }));
  // A tool's essays: first those it leads (the first tool of the essay), then the others, newest first in each.
  const time = (item) => new Date(item.date || 0).getTime();
  const essayBySlug = new Map(essays.map((essay) => [essay.slug, essay]));
  const toolEssays = {};
  for (const [slug, urls] of Object.entries(essayTools)) urls.forEach((url, place) => (toolEssays[url] ||= []).push({ slug, place }));
  for (const [url, list] of Object.entries(toolEssays)) {
    toolEssays[url] = list.sort((a, b) => (a.place > 0) - (b.place > 0) || time(essayBySlug.get(b.slug)) - time(essayBySlug.get(a.slug)))
      .map((entry) => entry.slug);
  }
  // A tool's notes newest first; an essay's in the order they were written.
  const noteBySlug = new Map(notes.map((note) => [note.slug, note]));
  const byNoteDate = (a, b) => time(noteBySlug.get(a)) - time(noteBySlug.get(b)) || a.localeCompare(b, "en", { numeric: true });
  const toolNotes = {};
  for (const [slug, link] of Object.entries(noteLinks)) if (link.tool) (toolNotes[link.tool] ||= []).push(slug);
  for (const list of Object.values(toolNotes)) list.sort((a, b) => byNoteDate(b, a));
  const essayNotes = {};
  for (const [slug, link] of Object.entries(noteLinks)) if (link.essay) (essayNotes[link.essay] ||= []).push(slug);
  for (const list of Object.values(essayNotes)) list.sort(byNoteDate);
  return { essayTools, noteLinks, toolEssays, toolNotes, essayNotes };
};

// The principles of an essay: each paragraph that is only a bold sentence (as lib/essay-body.js marks them).
export const principles = (markdown) =>
  [...String(markdown || "").replace(/^---\n[\s\S]*?\n---\n/, "").matchAll(/^\*\*([^*\n]+)\*\*\s*$/gm)].map((match) => match[1].trim());

// Whether a principle can stand alone as a field note: a full thought of eight words or more, not a step of a list
// ("Day 1: …", "2. What has changed?", "First: …"), a label or someone else's words in quotation marks.
export const standsAlone = (line) =>
  String(line).split(/\s+/).length >= 8
  && !/^(\d+[.):]\s|(day|tag|dita) \d|(first|second|third|erstens|zweitens|drittens|së pari|së dyti|së treti)\b)/i.test(line)
  && !/^[“"„«]/.test(line);
