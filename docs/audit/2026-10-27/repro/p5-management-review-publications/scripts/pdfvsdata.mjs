import fs from "node:fs";
const [SRC, OUT] = [process.argv[2], process.argv[3]];
const w = (await import(SRC + "/src/_data/weekly.js")).default;
const tok = (s) => [...String(s).replace(/<[^>]+>/g, "").replace(/−/g, "-").replace(/[  ]/g, " ").matchAll(/\d+(?:[.,]\d+)*/g)].map((m) => m[0]);
let bad = 0;
for (const i of w.issues) for (const l of ["en", "de", "sq"]) {
  const leaves = [];
  const walk = (v, k) => { if (typeof v === "string") { if (!/^<svg/.test(v) && !/svg|alt|url|link/i.test(k||"")) leaves.push(v); } else if (Array.isArray(v)) v.forEach((x) => walk(x, k)); else if (v && typeof v === "object") for (const [kk, x] of Object.entries(v)) if (!["svg","svgNarrow","alt","charts","link","seo","feature"].includes(kk)) walk(x, kk); };
  walk(i[l].pages); walk(i[l].figure); walk(i[l].teasers); walk(i[l].corrections);
  const data = new Set(leaves.flatMap(tok).filter((t) => t.length >= 2));
  const txt = fs.readFileSync(`${OUT}/${i.slug}-${l}.txt`, "utf8").replace(/-\n\s*/g, "").replace(/[  ]/g, " ");
  const pdf = new Set(tok(txt));
  const missing = [...data].filter((t) => !pdf.has(t) && !txt.includes(t));
  if (missing.length) { bad++; console.log(i.no, l, "in data, not in PDF text:", missing.slice(0, 12).join(" ")); }
}
console.log("issues-langs with gaps:", bad);
