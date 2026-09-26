// Pairs English and German essays. A German essay belongs to the English one
// with the same file name (without the date), or to the one named in its
// "original" field, which the editing panel fills in.
import fs from "node:fs";
import path from "node:path";

const EN = "src/content/insights";
const DE = "src/content/de/insights";

const slugOf = (file) => path.basename(file, ".md").replace(/^\d{4}-\d{2}-\d{2}-/, "");
const field = (text, name) => text.match(new RegExp(`^${name}:\\s*["']?([^"'\\n]*?)["']?\\s*$`, "m"))?.[1].trim() || "";

const essays = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    return { slug: slugOf(file), original: field(text, "original"), address: field(text, "address"), soon: field(text, "status") === "soon" };
  });

// The English page for a German essay.
export const englishUrl = (slug, original) => {
  const essay = essays(EN).find((item) => item.slug === (original || slug));
  if (!essay || essay.soon) return undefined;
  return essay.address || `/insights/${essay.slug}/`;
};

// The German page for an English essay.
export const germanUrl = (slug) => {
  const essay = essays(DE).find((item) => (item.original || item.slug) === slug);
  return essay && !essay.soon ? `/de/insights/${essay.slug}/` : undefined;
};
