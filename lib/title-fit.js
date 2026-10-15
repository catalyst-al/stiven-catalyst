// A title never splits a word. On a phone, one long word in a large title ("MANAGEMENT", "Entscheidungen",
// "Herkunftsländern") can be wider than the screen at the title's size, and the browser then breaks it anywhere
// (overflow-wrap: anywhere, which keeps the page from scrolling sideways): "MANAGEME/NT". After the build each
// h1, h2 and h3, and each title marked data-fit, gets the width of its longest word, in em, in the two faces titles
// are set in:
//   --wd  in the display face, upper case (Archivo Black; the uppercase titles),
//   --ws  in the serif (the wider of Georgia, Gelasio standing in for its measures, and Noto Serif, the serif of
//         Android).
// styles.css sets a title no larger than the width it has divided by that width (--fit-d, --fit-s), so its longest
// word always fits on one line. A word breaks only where it has a break of its own: a space, a soft hyphen (drawn
// as a hyphen), a hyphen, a dash or a slash.
//
// The widths are the fonts' advance widths (lib/title-widths.json), without the titles' tighter tracking: that
// leaves a little room for Arial Black, which computers that have it use in place of Archivo Black.
import fs from "node:fs";

const WIDTHS = JSON.parse(fs.readFileSync(new URL("./title-widths.json", import.meta.url), "utf8"));
const FALLBACK = { display: WIDTHS.display.M, serif: WIDTHS.serif.M };

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", shy: "­", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", bdquo: "„" };
const decode = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, name) =>
      name[0] === "#" ? String.fromCodePoint(name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1))) : ENTITIES[name.toLowerCase()] ?? all);

const charWidth = (face, ch) => {
  const table = WIDTHS[face];
  if (ch === "­" || ch === "‑") return table["-"];
  // The display titles are in upper case: "ß" becomes "SS".
  const text = face === "display" ? ch.toUpperCase() : ch;
  let width = 0;
  for (const c of text) width += table[c] ?? FALLBACK[face];
  return width;
};

// The pieces a line may break between: after a space, a soft hyphen, a hyphen, a dash or a slash. The mark
// stays with the piece before it (a soft hyphen is drawn as a hyphen at the end of the line).
export const pieces = (text) => text.split(/[\s ]+/).flatMap((word) => word.split(/(?<=[­\-–—\/])/)).filter(Boolean);

// The width of the longest piece of a title, in em.
export const longestWord = (html, face) => {
  let widest = 0;
  for (const piece of pieces(decode(html))) {
    let width = 0;
    for (const ch of piece) width += charWidth(face, ch);
    widest = Math.max(widest, width);
  }
  return Math.round(widest * 100) / 100;
};

const HEADINGS = /<(h[123])\b([^>]*)>([\s\S]*?)<\/\1>/g;
// Other titles set large in a narrow box (the role's name on a card) are marked data-fit in their template.
const MARKED = /<(strong|span)\b([^>]*\sdata-fit\b[^>]*)>([\s\S]*?)<\/\1>/g;
// Scripts, styles and text areas are left as they are: a heading inside a script is a string, not a title.
const RAW = /(<(script|style|textarea|template)\b[^>]*>[\s\S]*?<\/\2>)/i;

const withWidths = (all, tag, attrs, inner) => {
  const wd = longestWord(inner, "display");
  if (!wd) return all;
  const vars = `--wd:${wd};--ws:${longestWord(inner, "serif")}`;
  const style = /\sstyle="([^"]*)"/.exec(attrs);
  const open = style ? attrs.replace(style[0], ` style="${vars};${style[1]}"`) : `${attrs} style="${vars}"`;
  return `<${tag}${open}>${inner}</${tag}>`;
};

export const fitTitles = (html) =>
  html
    .split(RAW)
    .map((part, i) => (i % 3 === 1 ? part : i % 3 === 2 ? "" : part.replace(HEADINGS, withWidths).replace(MARKED, withWidths)))
    .join("");
