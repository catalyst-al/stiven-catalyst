// Turns an issue written in the format of the Management Review (lib/weekly/issues/NN.js: pages of blocks, every text
// in three languages, sources by id) into what the print and the reader show, in one language: the pages with their
// charts drawn (lib/weekly/charts.js), the source line at the foot of each page, the teasers with their page numbers
// and the charts again for the web page. src/_data/weekly.js builds the Management Review with it, and
// src/_data/magazine.js the issues of "Nga terreni" written the same way.
import { resolve, common, joinTitle, langs, blocks } from "./common.js";
import { chartMarkup, chartText, NARROW } from "./charts.js";

// The note on how a figure was checked (a source's "via"), in one language: a plain string when it only names a
// publication, else written in the three languages.
export const viaIn = (s, lang) => (s.via && typeof s.via === "object" ? s.via[lang] ?? s.via.en : s.via);

// "Gallup, 2015" or "Laszlo Bock, 2015, via World Economic Forum, 2015", for the foot of a page. Two sources by the
// same author in the same year are told apart by their titles: "Gallup, Indicator: Employee Engagement, 2026".
export const sourceLineFor = (sourceById, name) => (ids, lang) => {
  const list = ids.map((id) => {
    const s = sourceById[id];
    if (!s) throw new Error(`${name}: unknown source "${id}"`);
    return s;
  });
  const short = (s) => `${s.by}, ${s.year}`;
  return list.map((s) => {
    const twin = list.filter((other) => short(other) === short(s)).length > 1;
    const named = s.title.includes(String(s.year)) ? `${s.by}, ${s.title}` : `${s.by}, ${s.title}, ${s.year}`;
    return `${twin ? named : short(s)}${s.via ? ` (${common.labels.via[lang]} ${viaIn(s, lang)})` : ""}`;
  }).join("; ");
};

const withChart = (block) => {
  const svg = chartMarkup(block);
  return svg ? { ...block, chart: true, svg, alt: chartText(block) } : block;
};

export const pageNumbers = (issue) => Object.fromEntries(issue.pages.map((page, index) => [page.id, index + 1]));

// The issue in one language: its texts, its pages ready to draw and its charts for the web page.
export const issueText = (issue, lang, sourceLine) => {
  const pageOf = pageNumbers(issue);
  const text = resolve(issue, lang);
  const pages = text.pages.map((page) => ({
    ...page,
    heading: page.title ? joinTitle(page.title, lang) : undefined,
    blocks: (page.blocks || []).map(withChart),
    sourceLine: page.source ? sourceLine(page.source, lang) : "",
  }));
  return {
    date: text.date,
    theme: text.theme,
    heading: joinTitle(text.theme, lang),
    sub: text.sub,
    seo: text.seo,
    feature: text.feature,
    figure: text.figure,
    // A correction made in one edition only names its language (lang) and shows only there.
    corrections: (text.corrections || []).filter((correction) => !correction.lang || correction.lang === lang),
    teasers: text.teasers.map((teaser) => ({ ...teaser, number: pageOf[teaser.page] })),
    pages,
    // The charts again, for the web page: each with its own source when the page has several.
    charts: pages.flatMap((page) => page.blocks.filter((block) => block.chart).map((block) => ({
      ...block,
      kicker: page.kicker,
      sources: (block.source || page.source || []).length,
      svgNarrow: block.type === "donut" ? "" : chartMarkup(block, NARROW),
      sourceLine: block.source ? sourceLine(block.source, lang) : page.sourceLine,
    }))),
  };
};

// The month of an issue's edition as "2026-11", read from its English date ("November 2026"), so a list of issues can
// be narrowed to one month (src/_includes/partials/issue-filter.njk).
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const monthOf = (issue, name) => {
  const [month, year] = issue.date.en.split(" ");
  const index = MONTHS.indexOf(month);
  if (index < 0 || !/^\d{4}$/.test(year)) throw new Error(`${name} No. ${issue.number}: no month in "${issue.date.en}"`);
  return `${year}-${String(index + 1).padStart(2, "0")}`;
};

// The months of a list of issues (each with its .month and its date in every language), the newest first, each with
// its name in the three languages and how many issues it has.
export const monthsOf = (issues) =>
  [...new Set(issues.map((issue) => issue.month))].sort().reverse().map((id) => {
    const first = issues.find((issue) => issue.month === id);
    return { id, count: issues.filter((issue) => issue.month === id).length, ...Object.fromEntries(langs.map((lang) => [lang, first[lang].date])) };
  });

// The topics that have at least one issue, in the order of the plan.
export const blocksOf = (issues) => Object.keys(blocks).filter((id) => issues.some((issue) => issue.block === id)).map((id) => ({ id, ...blocks[id] }));
