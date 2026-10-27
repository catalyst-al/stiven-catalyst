// For every issue, collect numbers in each language per leaf text and compare EN vs DE vs SQ.
const SRC = process.argv[2];
const mod = process.argv[3] || "weekly";
const data = (await import(SRC + `/src/_data/${mod}.js`)).default;
const list = data.issues || data.volumes;
const norm = (s) => {
  // extract numbers: handle 10,000 (en) 10.000 (de/sq) 6.1 (en) 6,1 (de/sq)
  const out = [];
  const str = String(s).replace(/<[^>]+>/g, "").replace(/−/g, "-").replace(/(\d)[   ](\d{3})(?!\d)/g, "$1$2");
  for (const m of str.matchAll(/-?\d+(?:[.,]\d+)*/g)) out.push(m[0]);
  return out;
};
const canon = (n, lang) => {
  // decide thousands vs decimal
  if (lang === "en") { return n.replace(/,(\d{3})(?!\d)/g, "$1"); }
  // de/sq: '.' thousands, ',' decimal
  return n.replace(/\.(\d{3})(?!\d)/g, "$1").replace(",", ".");
};
const ignoreWords = /^(0?[1-9]|1[0-2])$/; // item numbers 01..12 are noise-ish but keep
let issuesWithDiff = 0, totalDiff = 0;
const rep = [];
for (const it of list) {
  const L = ["en", "de", "sq"].map((l) => it[l]);
  const walk = (a, b, c, path) => {
    if (typeof a === "string" && typeof b === "string" && typeof c === "string") {
      if (/^<svg/.test(a) || /svg|alt|url|link|href|src/i.test(path)) return;
      const [na, nb, nc] = [norm(a).map((n) => canon(n, "en")), norm(b).map((n) => canon(n, "de")), norm(c).map((n) => canon(n, "sq"))];
      const sa = [...na].sort().join("|"), sb = [...nb].sort().join("|"), sc = [...nc].sort().join("|");
      if (sa !== sb || sa !== sc) rep.push({ id: it.slug || it.number, path, en: sa, de: sb, sq: sc, ta: a.slice(0, 220), tb: b.slice(0, 220), tc: c.slice(0, 220) });
      return;
    }
    if (Array.isArray(a) && Array.isArray(b) && Array.isArray(c)) { if (a.length !== b.length || a.length !== c.length) rep.push({ id: it.slug, path, en: "LEN " + a.length, de: "LEN " + b.length, sq: "LEN " + c.length }); a.forEach((x, i) => walk(x, b[i], c[i], `${path}[${i}]`)); return; }
    if (a && typeof a === "object" && b && c) { for (const k of Object.keys(a)) { if (["svg", "svgNarrow", "alt", "sourceLine", "link", "corrections"].includes(k)) continue; walk(a[k], b[k], c[k], `${path}.${k}`); } }
  };
  walk(L[0], L[1], L[2], "");
}
console.log(JSON.stringify(rep, null, 1));
