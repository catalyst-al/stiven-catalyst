// The monthly Management Review: a monthly edition in numbered issues, 10 pages each, in English, Albanian and German. The issues
// are in lib/weekly/issues (01.js, 02.js …), the sources and shared labels in lib/weekly. This file puts them
// together for the print (src/guide-print/weekly.njk, printed by scripts/weekly.mjs), the reader of each issue
// (src/_includes/pages/weekly-issue.njk) and the list of all issues (src/_includes/pages/weekly-archive.njk).
//
// Each issue is resolved per language, and its charts are drawn here once (lib/weekly/charts.js), so the print
// and the web page show the same SVG.
import fs from "node:fs";
import { langs, resolve, blocks, common } from "../../lib/weekly/common.js";
import { sources } from "../../lib/weekly/sources.js";
import { chartMarkup, chartText, NARROW } from "../../lib/weekly/charts.js";

const folder = new URL("../../lib/weekly/issues/", import.meta.url);
const files = fs.readdirSync(folder).filter((name) => /^\d{2}\.js$/.test(name)).sort();
const raw = await Promise.all(files.map((name) => import(new URL(name, folder)).then((module) => module.default)));

const pad = (n) => String(n).padStart(2, "0");
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
// "Gallup, 2015" or "Laszlo Bock, 2015, via World Economic Forum, 2015", for the foot of a page. Two sources by the
// same author in the same year are told apart by their titles: "Gallup, Indicator: Employee Engagement, 2026".
const sourceLine = (ids, lang) => {
  const list = ids.map((id) => {
    const s = sourceById[id];
    if (!s) throw new Error(`Management Review: unknown source "${id}"`);
    return s;
  });
  const short = (s) => `${s.by}, ${s.year}`;
  return list.map((s) => {
    const twin = list.filter((other) => short(other) === short(s)).length > 1;
    const named = s.title.includes(String(s.year)) ? `${s.by}, ${s.title}` : `${s.by}, ${s.title}, ${s.year}`;
    return `${twin ? named : short(s)}${s.via ? ` (${common.labels.via[lang]} ${s.via})` : ""}`;
  }).join("; ");
};

const withChart = (block) => {
  const svg = chartMarkup(block);
  return svg ? { ...block, chart: true, svg, alt: chartText(block) } : block;
};

const issues = raw.map((issue) => {
  const slug = `management-review-nr-${pad(issue.number)}`;
  const pageOf = Object.fromEntries(issue.pages.map((page, index) => [page.id, index + 1]));
  const perLang = Object.fromEntries(langs.map((lang) => {
    const text = resolve(issue, lang);
    const pages = text.pages.map((page) => ({
      ...page,
      heading: page.title ? page.title.join(" ") : undefined,
      blocks: (page.blocks || []).map(withChart),
      sourceLine: page.source ? sourceLine(page.source, lang) : "",
    }));
    return [lang, {
      date: text.date,
      theme: text.theme,
      heading: text.theme.join(" "),
      sub: text.sub,
      seo: text.seo,
      feature: text.feature,
      figure: text.figure,
      blockName: blocks[issue.block][lang],
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
    }];
  }));
  return {
    number: issue.number,
    no: pad(issue.number),
    slug,
    block: issue.block,
    pageOf,
    pageCount: issue.pages.length,
    sources: issue.sources.map((id) => sourceById[id]),
    ...perLang,
  };
});

export default {
  name: common.name,
  langs,
  cover: common.cover,
  issues,
  latest: issues.at(-1),
  // The blocks that have at least one issue, in the order of the plan, for the list of issues.
  blocks: Object.keys(blocks).filter((id) => issues.some((issue) => issue.block === id)).map((id) => ({ id, ...blocks[id] })),
  prints: issues.flatMap((issue) => langs.map((lang) => ({ slug: issue.slug, number: issue.number, lang }))),
  ...Object.fromEntries(langs.map((lang) => [lang, resolve(common, lang)])),
};
