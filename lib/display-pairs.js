// The large uppercase titles are set in Arial Black or Archivo Black with tight tracking (-.06em). In letter
// pairs whose bars reach the edge of the letter (F and T, T and T, T and Y…) the bars then run into one line:
// "SHIFT" reads "SHI—T". After the build, the first letter of each such pair in a heading is wrapped in
// <k-p class="kp1"> to "kp4", which adds just the space the pair is missing; styles.css applies it only in the
// display titles, so headings in other faces do not change. A custom element and not a span, so rules such
// as ".cta h2 span" do not reach it. The text stays the same for search, copy and screen readers.
//
// Measured in Archivo Black at -.06em: the gap between the two letters, brought to about .035em.
const PAIRS = {
  kp1: ["EJ", "ET", "EZ", "PT", "RT", "TC", "TÇ", "TG", "TO", "TÖ", "TQ", "TZ"],
  kp2: ["EY", "FT", "RZ", "YZ", "ZJ", "ZT", "ZZ"],
  kp3: ["FY", "TT", "ZY"],
  kp4: ["TY", "YT"],
};

const CLASS_OF = new Map(Object.entries(PAIRS).flatMap(([name, pairs]) => pairs.map((pair) => [pair, name])));

// Wraps the first letter of each pair in plain text (no tags, no entities).
const markText = (text) => {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const name = CLASS_OF.get((text[i] + (text[i + 1] || "")).toUpperCase());
    out += name ? `<k-p class="${name}">${text[i]}</k-p>` : text[i];
  }
  return out;
};

// Only the text between tags is touched; entities such as &shy; or &amp; are kept whole.
const markInner = (html) =>
  html
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith("<") ? part : part.split(/(&#?\w+;)/).map((bit) => (bit.startsWith("&") ? bit : markText(bit))).join("")))
    .join("");

// Headings, the strong labels the display face is used for (cards, the role names) and any element marked
// data-pairs (the manifesto lines on the home page).
const ELEMENTS = [/(<(h1|h2|h3|strong)\b[^>]*>)([\s\S]*?)(<\/\2>)/g, /(<(div)\b[^>]*\sdata-pairs\b[^>]*>)([\s\S]*?)(<\/\2>)/g];
// Scripts, styles and text areas are left as they are: a heading inside a script is a string, not a title.
const RAW = /(<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\2>)/i;
export const markPairs = (html) =>
  html
    .split(RAW)
    .map((part, i) => (i % 3 === 1 ? part : i % 3 === 2 ? "" : ELEMENTS.reduce((out, pattern) => out.replace(pattern, (all, open, tag, inner, close) => open + markInner(inner) + close), part)))
    .join("");
