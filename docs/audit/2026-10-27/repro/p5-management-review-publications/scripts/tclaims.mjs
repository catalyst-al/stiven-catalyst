// Extract every text fragment with a digit per issue (en), with page id, page sources and block sources.
const SRC = process.argv[2]; const nums = process.argv.slice(3).map(Number);
const w = (await import(SRC + "/src/_data/treatise.js")).default;
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
for (const issue of (w.volumes).filter((i) => nums.includes(i.number))) {
  const t = issue.en;
  console.log(`\n=== No. ${issue.no} ${t.heading} [${t.date}]`);
  console.log(`COVER FIGURE: ${t.figure?.n} ${strip(t.figure?.t)} (${t.figure?.by})`);
  for (const page of t.pages) {
    const walk = (v, path, src) => {
      if (v == null) return;
      if (typeof v === "string") { if (/\d/.test(v) && !/^<svg/.test(v) && path.indexOf("svg") < 0 && path.indexOf("alt")<0) console.log(`  [${page.id}${path}] {${(src||[]).join(",")}} ${strip(v)}`); return; }
      if (typeof v === "number") { if (!/(page|width|height|number)$/.test(path)) console.log(`  [${page.id}${path}] {${(src||[]).join(",")}} =${v}`); return; }
      if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`, src));
      if (typeof v === "object") { const s = v.source || src; for (const [k, x] of Object.entries(v)) { if (["source","sourceLine","svg","svgNarrow","id","type","chart"].includes(k)) continue; walk(x, `${path}.${k}`, s); } }
    };
    walk(page.blocks, "", page.source);
    for (const k of ["lead","note","reading","foot"]) if (page[k] && /\d/.test(page[k])) console.log(`  [${page.id}.${k}] {${(page.source||[]).join(",")}} ${strip(page[k])}`);
  }
  console.log("SOURCES:"); for (const s of issue.sources) console.log(`  - ${s.id}: ${s.by}, ${s.title}, ${s.year}${s.url ? " <" + s.url + ">" : " (no url)"}${s.via ? " via " + (typeof s.via === "string" ? s.via : s.via.en) : ""}`);
}
