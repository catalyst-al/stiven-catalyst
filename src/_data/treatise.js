// The operational treatise: the volumes of the Management Review that follow one operational question through the
// three layers of every chapter (the living scene, the conceptual and scientific breakdown, the operating protocol
// for action), in English, Albanian and German. The volumes are in lib/treatise/volumes (01.js, 02.js …), the shared
// labels and the layers in lib/treatise/common.js, the sources in lib/weekly/sources.js (shared with the monthly
// issues). This file puts them together for the print (src/guide-print/treatise.njk, printed by
// scripts/treatise.mjs), the reader of each volume (src/_includes/pages/treatise-volume.njk) and the list of all
// volumes (src/_includes/pages/treatise-archive.njk).
//
// A volume lists its chapters as pages of type "chapter", each with its own pages, one layer each; here they are
// laid flat, numbered, and resolved per language, and the charts are drawn once (lib/weekly/charts.js), so the
// print and the web page show the same SVG.
import fs from "node:fs";
import { blocks } from "../../lib/weekly/common.js";
import { langs, resolve, common, layers, layerById } from "../../lib/treatise/common.js";
import { sources } from "../../lib/weekly/sources.js";
import { chartMarkup, chartText, NARROW } from "../../lib/weekly/charts.js";
import { viaIn } from "../../lib/weekly/build.js";

const folder = new URL("../../lib/treatise/volumes/", import.meta.url);
const files = fs.readdirSync(folder).filter((name) => /^\d{2}\.js$/.test(name)).sort();
const raw = await Promise.all(files.map((name) => import(new URL(name, folder)).then((module) => module.default)));

const pad = (n) => String(n).padStart(2, "0");
const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
// "Sexton et al., 2014" or "Womack, 2011 (via Lean Enterprise Institute …)", for the foot of a page; two sources by
// the same author in the same year are told apart by their titles.
const sourceLine = (ids, lang) => {
  const list = ids.map((id) => {
    const s = sourceById[id];
    if (!s) throw new Error(`Operational treatise: unknown source "${id}"`);
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

// The pages of a volume laid flat: a chapter's pages follow each other, each knowing its chapter and its layer.
const flatten = (volume) => {
  const pages = [];
  const chapters = [];
  for (const page of volume.pages) {
    if (page.type !== "chapter") { pages.push(page); continue; }
    const chapter = { id: page.id, numeral: page.numeral, title: page.title, index: chapters.length + 1, pages: page.pages.map((sub) => sub.id) };
    chapters.push(chapter);
    for (const sub of page.pages) {
      if (!layerById[sub.layer]) throw new Error(`Operational treatise: page "${sub.id}" of volume ${volume.number} has no layer (${layers.map((l) => l.id).join(", ")})`);
      pages.push({ ...sub, chapter: { id: chapter.id, numeral: chapter.numeral, title: chapter.title, index: chapter.index } });
    }
  }
  return { pages, chapters };
};

const volumes = raw.map((volume) => {
  const slug = `operational-treatise-vol-${pad(volume.number)}`;
  const { pages: flat, chapters } = flatten(volume);
  const pageOf = Object.fromEntries(flat.map((page, index) => [page.id, index + 1]));
  const perLang = Object.fromEntries(langs.map((lang) => {
    const L = resolve(common.labels, lang);
    const text = resolve({ ...volume, pages: flat }, lang);
    const layersIn = resolve(layers, lang);
    const pages = text.pages.map((page) => {
      const layer = page.layer ? { ...resolve(layerById[page.layer], lang) } : null;
      const kicker = page.chapter ? `${L.chapter} ${page.chapter.numeral} · ${page.chapter.title}` : page.kicker;
      // The section named in the running head of the page.
      const run = page.chapter ? `${L.chapter} ${page.chapter.numeral} · ${layer.short}` : page.type === "intro" ? resolve(common.intro.title, lang) : page.type === "contents" ? L.contents : page.type === "sources" ? L.sources : page.kicker;
      return {
        ...page,
        kicker,
        run,
        layerInfo: layer,
        heading: page.title && page.type !== "cover" ? page.title.join(" ") : undefined,
        blocks: (page.blocks || []).map(withChart),
        sourceLine: page.source ? sourceLine(page.source, lang) : "",
      };
    });
    const byId = Object.fromEntries(pages.map((page) => [page.id, page]));
    const chaptersIn = resolve(chapters, lang).map((chapter) => ({
      ...chapter,
      number: pageOf[chapter.pages[0]],
      pages: chapter.pages.map((id) => ({ id, number: pageOf[id], layer: byId[id].layer, layerShort: byId[id].layerInfo.short, heading: byId[id].heading })),
    }));
    // The pages outside the chapters that have a heading: the research note, the tool, the closing essay, the method.
    const also = pages.filter((page) => page.heading && !page.chapter && !["intro", "contents"].includes(page.type)).map((page) => ({ id: page.id, number: pageOf[page.id], kicker: page.kicker, heading: page.heading }));
    return [lang, {
      date: text.date,
      edition: L.edition,
      theme: text.theme,
      heading: text.theme.join(" "),
      sub: text.sub,
      seo: text.seo,
      feature: text.feature,
      figure: text.figure,
      contract: text.contract,
      blockName: blocks[volume.block][lang],
      teasers: text.teasers.map((teaser) => ({ ...teaser, number: pageOf[teaser.page] })),
      layers: layersIn,
      chapters: chaptersIn,
      also,
      pages,
      // The charts again, for the web page: each with its own source when the page has several, or marked as an
      // invented example.
      charts: pages.flatMap((page) => page.blocks.filter((block) => block.chart).map((block) => ({
        ...block,
        kicker: page.kicker,
        sources: block.hypothetical ? 1 : (block.source || page.source || []).length,
        svgNarrow: block.type === "donut" ? "" : chartMarkup(block, NARROW),
        sourceLine: block.hypothetical ? L.hypothetical : block.source ? sourceLine(block.source, lang) : page.sourceLine,
      }))),
    }];
  }));
  return {
    number: volume.number,
    no: pad(volume.number),
    numeral: volume.numeral,
    slug,
    block: volume.block,
    pageOf,
    pageCount: flat.length,
    chapterCount: chapters.length,
    sources: volume.sources.map((id) => sourceById[id]),
    ...perLang,
  };
});

export default {
  name: common.short.en,
  langs,
  cover: common.cover,
  volumes,
  latest: volumes.at(-1),
  blocks: Object.keys(blocks).filter((id) => volumes.some((volume) => volume.block === id)).map((id) => ({ id, ...blocks[id] })),
  prints: volumes.flatMap((volume) => langs.map((lang) => ({ slug: volume.slug, number: volume.number, lang }))),
  ...Object.fromEntries(langs.map((lang) => [lang, { ...resolve(common, lang), layers: resolve(layers, lang) }])),
};
