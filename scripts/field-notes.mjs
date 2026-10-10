// New field notes from the essays. Every essay sets its principles apart as a bold line of their own; this script
// takes those that stand alone as a note (a full thought of eight words or more, not a step of a list), leaves out
// those that are already a note, and offers the rest, in English, German and Albanian at once: the German and
// Albanian essays have the same principles in the same order, so the three languages of a note match.
//
//   node scripts/field-notes.mjs              the proposals, numbered; nothing is written
//   node scripts/field-notes.mjs --write 2,5  writes proposals 2 and 5 as notes (or --write all)
//   ... --date 2026-10-12                     the date of the new notes (today by default)
//
// A note is three files with the same name, src/content/notes/, de/notes/ and sq/notes/ (the note's number follows
// the last one). The site links each to its essay and tool by itself (lib/writing-links.js). After writing, make
// their images: node scripts/note-cards.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { principles, standsAlone, overlap } from "../lib/writing-links.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["en", "de", "sq"];
const dirOf = (kind, lang) => path.join(ROOT, "src/content", lang === "en" ? "" : lang, kind);
const markdown = (dir) => fs.readdirSync(dir).filter((file) => file.endsWith(".md")).sort();
const read = (file) => fs.readFileSync(file, "utf8");
const field = (text, name) => (text.match(new RegExp(`^${name}:\\s*(["']?)(.*)\\1\\s*$`, "m")) || [])[2] || "";

// The notes there are: { file, number, quote } (English).
export const existingNotes = () =>
  markdown(dirOf("notes", "en")).map((file) => ({
    file,
    number: Number(file.match(/^\d{4}-\d{2}-\d{2}-(\d+)-/)?.[1] || 0),
    quote: field(read(path.join(dirOf("notes", "en"), file)), "quote").replace(/\\"/g, '"'),
  }));

// Whether a line says what a note already says: most of its words are in the note, or the note's in it.
const said = (line, quote) => overlap(line, quote) >= 0.6 || overlap(quote, line) >= 0.75;

// The proposals: { essay, title, quotes: { en, de, sq } }, in the order of the essays.
export const proposals = (notes = existingNotes()) => {
  const found = [];
  for (const file of markdown(dirOf("insights", "en"))) {
    const texts = Object.fromEntries(LANGS.map((lang) => {
      const target = path.join(dirOf("insights", lang), file);
      return [lang, fs.existsSync(target) ? read(target) : ""];
    }));
    if (field(texts.en, "status") === "soon") continue;
    const lines = Object.fromEntries(LANGS.map((lang) => [lang, principles(texts[lang])]));
    if (!lines.en.length) continue;
    if (LANGS.some((lang) => lines[lang].length !== lines.en.length)) {
      console.warn(`${file}: the principles differ in number between the languages; left out`);
      continue;
    }
    lines.en.forEach((line, i) => {
      if (!standsAlone(line)) return;
      if (notes.some((note) => said(line, note.quote)) || found.some((other) => said(line, other.quotes.en))) return;
      found.push({ essay: file, title: field(texts.en, "title"), quotes: Object.fromEntries(LANGS.map((lang) => [lang, lines[lang][i]])) });
    });
  }
  return found;
};

// A file name for a note: its date, number and the first words that say something.
const SMALL = new Set(["a", "an", "the", "is", "are", "it", "to", "of", "did", "which", "me", "my", "while", "can", "its", "and", "or", "not", "do", "does", "i", "we", "you", "that", "this", "in", "on", "be", "will", "have", "has", "what", "how", "so", "for", "with", "at", "just", "because"]);
export const fileName = (date, number, quote) => {
  const words = quote.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word && !SMALL.has(word));
  return `${date}-${String(number).padStart(2, "0")}-${words.slice(0, 3).join("-") || "note"}.md`;
};

const yamlQuote = (text) => `"${String(text).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export const writeNotes = (chosen, date, notes = existingNotes()) => {
  let number = Math.max(0, ...notes.map((note) => note.number));
  return chosen.map((proposal) => {
    number += 1;
    const name = fileName(date, number, proposal.quotes.en);
    for (const lang of LANGS) {
      fs.writeFileSync(path.join(dirOf("notes", lang), name), `---\nquote: ${yamlQuote(proposal.quotes[lang])}\ndate: ${date}\n---\n`);
    }
    return name;
  });
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const option = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] || "" : null; };
  const date = option("--date") || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date ${date}: write it as YYYY-MM-DD`);
  const list = proposals();
  const pick = option("--write");
  if (pick === null) {
    if (!list.length) console.log("Every principle that stands alone is already a field note.");
    list.forEach((proposal, i) => {
      console.log(`\n${i + 1}. ${proposal.title}`);
      for (const lang of LANGS) console.log(`   ${lang}: ${proposal.quotes[lang]}`);
    });
    if (list.length) console.log(`\nWrite them with --write all, or a choice such as --write 1,3.`);
  } else {
    const chosen = pick === "all" ? list : pick.split(",").map((n) => list[Number(n) - 1]).filter(Boolean);
    if (!chosen.length) throw new Error(`--write ${pick}: no such proposal (there are ${list.length})`);
    for (const name of writeNotes(chosen, date)) console.log(`wrote ${name} (en, de, sq)`);
    console.log("Now make their images: node scripts/note-cards.mjs");
  }
}
