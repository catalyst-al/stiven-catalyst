// The Downloads page (src/_includes/pages/downloads.njk): every file the site offers to keep, in one place and in
// the reader's language. The book, the Tools Guide with its earlier editions, the special edition and every issue of
// the Management Review (with its recording, where there is one), every volume of the treatise and every issue of
// From the Floor. Each file is listed only when it is on the site (src/media), with its size, so a link never leads
// nowhere; the list grows by itself as the publications do.
import fs from "node:fs";
import weekly from "./weekly.js";
import treatise from "./treatise.js";
import magazine from "./magazine.js";
import review from "./review.js";
import toolsGuide from "./toolsGuide.js";

const langs = ["en", "sq", "de"];
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, import.meta.url), "utf8"));
// The book in each language: the Albanian original and its translations (src/_data/books/<lang>.json).
const editions = Object.fromEntries(langs.map((lang) => [lang, read(`./books/${lang}.json`)]));
const audio = read("./audio.json");

// The size of a file under src/media, or null when it is not there.
const bytesOf = (href) => {
  try { return fs.statSync(new URL(`..${href}`, import.meta.url)).size; } catch { return null; }
};
const sizeIn = (bytes, lang) => {
  const mb = bytes / 1048576;
  const n = mb < 10 ? mb.toFixed(1) : String(Math.round(mb));
  return `${lang === "en" ? n : n.replace(".", ",")} MB`;
};
const file = (kind, href, lang, label) => {
  const bytes = bytesOf(href);
  return bytes === null ? null : { kind, href, size: sizeIn(bytes, lang), ...(label ? { label } : {}) };
};
const pdfOf = (slug, lang) => `/media/magazine/${slug}/${slug}-${lang}.pdf`;
const issueFiles = (slug, lang) => [file("PDF", pdfOf(slug, lang), lang), audio[slug]?.[lang] ? file("MP3", audio[slug][lang].src, lang) : null].filter(Boolean);

const labels = {
  en: {
    eyebrow: "Everything to keep", heading: "Downloads",
    lede: "Every publication of the site as a file to keep, read offline or print: the book, the guide, every issue and volume as a PDF, and the conversations about the issues as MP3. In your language, where it exists.",
    books: "Book and guide", review: "Management Review", treatise: treatise.en.short, floor: magazine.names.en.name,
    bookMeta: "A book · translated from the Albanian", original: "the Albanian original", guideMeta: `Edition ${toolsGuide.edition} · ${toolsGuide.editions[0].date.en}`, earlier: "Edition {n}",
    special: "Special edition", no: "No.", volume: "Volume", issue: "Issue", open: "Open", more: "All {n} issues",
    files: "{n} files", note: "The PDFs are the printed pages; the MP3s are AI conversations about an issue, the issue is the reference.",
  },
  sq: {
    eyebrow: "Gjithçka për ta mbajtur", heading: "Shkarkime",
    lede: "Çdo botim i faqes si skedar për ta mbajtur, për ta lexuar pa internet ose për ta printuar: libri, udhëzuesi, çdo numër dhe vëllim si PDF, dhe bisedat për numrat si MP3. Në gjuhën tënde, aty ku ekziston.",
    books: "Libri dhe udhëzuesi", review: "Management Review", treatise: treatise.sq.short, floor: magazine.names.sq.name,
    bookMeta: "Libër · në shqip", original: "origjinali shqip", guideMeta: `Botimi ${toolsGuide.edition} · ${toolsGuide.editions[0].date.sq}`, earlier: "Botimi {n}",
    special: "Botim i veçantë", no: "Nr.", volume: "Vëllimi", issue: "Numri", open: "Hape", more: "Të gjithë {n} numrat",
    files: "{n} skedarë", note: "PDF-të janë faqet e printuara; MP3-të janë biseda me AI për një numër, referenca mbetet numri.",
  },
  de: {
    eyebrow: "Alles zum Behalten", heading: "Downloads",
    lede: "Jede Publikation der Seite als Datei zum Behalten, offline Lesen oder Drucken: das Buch, der Leitfaden, jede Ausgabe und jeder Band als PDF und die Gespräche über die Ausgaben als MP3. In deiner Sprache, wo es sie gibt.",
    books: "Buch und Leitfaden", review: "Management Review", treatise: treatise.de.short, floor: magazine.names.de.name,
    bookMeta: "Ein Buch · aus dem Albanischen", original: "das albanische Original", guideMeta: `Ausgabe ${toolsGuide.edition} · ${toolsGuide.editions[0].date.de}`, earlier: "Ausgabe {n}",
    special: "Sonderausgabe", no: "Nr.", volume: "Band", issue: "Ausgabe", open: "Öffnen", more: "Alle {n} Ausgaben",
    files: "{n} Dateien", note: "Die PDFs sind die gedruckten Seiten; die MP3s sind KI-Gespräche über eine Ausgabe, maßgeblich ist die Ausgabe.",
  },
};

const sectionsFor = (lang) => {
  const L = labels[lang];
  const books = [
    {
      title: editions[lang].title,
      meta: L.bookMeta,
      page: `/books/${editions[lang].slug}.html`,
      // The edition in the reader's language, and with a translation the Albanian original beside it.
      files: [file("PDF", editions[lang].pdf, lang), lang === "sq" ? null : file("PDF", editions.sq.pdf, lang, L.original)].filter(Boolean),
    },
    {
      title: toolsGuide[lang].title,
      meta: L.guideMeta,
      page: "/guides/tools-guide.html",
      files: [
        file("PDF", `/media/guides/${toolsGuide.slug}/${toolsGuide.slug}-${lang}.pdf`, lang),
        ...toolsGuide.editions.filter((edition) => edition.pdf).map((edition) => file("PDF", edition.pdf[lang], lang, L.earlier.replace("{n}", edition.number))),
      ].filter(Boolean),
    },
  ];
  const reviewItems = [
    ...[...weekly.issues].reverse().map((issue) => ({ title: issue[lang].heading, meta: `${L.no} ${issue.no} · ${issue[lang].date}`, page: `/magazine/${issue.slug}.html`, files: issueFiles(issue.slug, lang) })),
    { title: review[lang].theme, meta: `${L.special} · ${review[lang].date}`, page: `/magazine/${review.slug}.html`, files: issueFiles(review.slug, lang) },
  ];
  const treatiseItems = [...treatise.volumes].reverse().map((volume) => ({ title: volume[lang].heading, meta: `${L.volume} ${volume.number} · ${volume[lang].date}`, page: `/magazine/${volume.slug}.html`, files: issueFiles(volume.slug, lang) }));
  const floorItems = [...magazine.issues].reverse().map((issue) => ({ title: issue[lang].theme, meta: `${L.issue} ${issue.number} · ${issue[lang].date}`, page: `/magazine/${issue.slug}.html`, files: issueFiles(issue.slug, lang) }));
  return [
    { id: "books", name: L.books, items: books },
    { id: "review", name: L.review, items: reviewItems },
    { id: "treatise", name: L.treatise, items: treatiseItems },
    { id: "floor", name: L.floor, items: floorItems },
  ]
    .map((section) => ({ ...section, items: section.items.filter((item) => item.files.length) }))
    .filter((section) => section.items.length)
    .map((section) => ({ ...section, count: section.items.reduce((n, item) => n + item.files.length, 0) }));
};

export default Object.fromEntries(langs.map((lang) => [lang, { ...labels[lang], sections: sectionsFor(lang) }]));
