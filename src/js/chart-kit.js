// Shared charts for the tools (window.ChartKit): radar, columns, stacked columns, lines with limits, a histogram with
// specification limits, box plots, a scatter with its fit, a heat map, a month calendar and a 2 × 2 matrix. Every chart
// is one <svg> drawn with the page's own colours (the --tr-* and state variables, so it follows the theme), with a title
// for screen readers and data-tip on the parts a visitor can point at. figure() wraps a chart with one shared tooltip
// (hover or tap) and the "Chart as SVG / PNG" buttons, exporting with print colours on a white background.
// No library: the file is small, works offline, and tests can call the arithmetic (niceMax, ticks, polygon points).
window.ChartKit = (() => {
  const kit = window.ToolKit || {};
  const tx = kit.tx || ((text) => text);
  const LANG = kit.LANG || (document.documentElement.lang in { en: 1, de: 1, sq: 1 } ? document.documentElement.lang : "en");
  const LOCALE = kit.LOCALE || { en: "en-GB", de: "de-DE", sq: "de-DE" }[LANG];
  const el = kit.el || ((tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  });
  const num = (value, digits = 0) => (Number.isFinite(value) ? value.toLocaleString(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "–");
  const SVG_NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => { if (value !== undefined && value !== null) node.setAttribute(key, value); });
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const FONT = "Inter, Segoe UI, Roboto, Arial, sans-serif";
  // On screen the charts use the page's variables; the export replaces each with a print colour.
  const C = {
    bar: "var(--tr-bar)", top: "var(--tr-top)", line: "var(--tr-line)", grid: "var(--tr-grid)", text: "var(--tr-text)", muted: "var(--tr-muted)", target: "var(--tr-target)",
    ok: "var(--ok)", warn: "var(--warn)", danger: "var(--danger)", blue: "var(--blue)", soft: "var(--blue-soft)", paper: "var(--paper-2)",
  };
  const EXPORT = {
    "var(--tr-bar)": "#0a6ab0", "var(--tr-top)": "#c2141b", "var(--tr-line)": "#1b2330", "var(--tr-grid)": "#e3e6ea", "var(--tr-text)": "#1b2330", "var(--tr-muted)": "#5f6870", "var(--tr-target)": "#7f5c1f",
    "var(--ok)": "#1d7a45", "var(--warn)": "#7f5c1f", "var(--danger)": "#c2141b", "var(--blue)": "#0a6ab0", "var(--blue-soft)": "#63bdf3", "var(--paper-2)": "#ffffff",
  };
  // Series colours, in the order a chart uses them: the accent first, then colours that read apart in both themes.
  const SERIES = [C.blue, C.warn, C.ok, "#a78bfa", C.soft, "#f472b6", C.muted];
  const stateColor = (state) => ({ ok: C.ok, warn: C.warn, danger: C.danger, none: C.grid, muted: C.muted }[state] || C.grid);

  // Scales -------------------------------------------------------------------------------------------------------------
  // The next 1, 2, 2.5, 5 or 10 times a power of ten at or above the value (0.12 gives 0.2, 7 gives 10, 0 gives 1).
  const niceMax = (value) => {
    if (!(value > 0)) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    return [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((m) => m >= value - 1e-12) || value;
  };
  // Round tick values from min to max, about `count` of them.
  const ticks = (min, max, count = 4) => {
    if (!(max > min)) return [min];
    const raw = (max - min) / count;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((m) => m >= raw) || raw;
    const out = [];
    for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) out.push(Number(v.toFixed(10)));
    return out;
  };
  const digitsFor = (max) => (max >= 100 ? 0 : max >= 10 ? 1 : 2);
  // Counts are whole numbers: 3, not 3.00. Only values with a fraction get the digits their size needs.
  // The axis of whole numbers carries whole ticks only (0, 1, 2), never 0.25.
  const axisTicks = (max, values) => (values.every((v) => !Number.isFinite(v) || Number.isInteger(v)) ? ticks(0, max, 4).filter(Number.isInteger) : ticks(0, max, 4));
  const digitsOf = (values, max) => (values.every((v) => !Number.isFinite(v) || Number.isInteger(v)) ? 0 : digitsFor(max));
  const shorten = (text, max = 18) => (String(text).length > max ? `${String(text).slice(0, max - 1)}…` : String(text));

  const frame = (W, H, title) => {
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": title || "", class: "ck-chart", "font-family": FONT });
    if (title) svg.append(svgEl("title", {}, title));
    return svg;
  };
  const tip = (node, text) => { if (text) node.setAttribute("data-tip", text); node.classList.add("ck-hit"); return node; };

  // Radar: axes [{ label, value, max }], options { title, levels, compare: [{ label, values }] (earlier audits, drawn
  // thin), format }. Returns the svg; polygonPoints is exposed for tests.
  const polygonPoints = (values, maxes, cx, cy, r) => values.map((value, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / values.length;
    const share = maxes[i] > 0 ? Math.max(0, Math.min(1, value / maxes[i])) : 0;
    return [cx + Math.cos(angle) * r * share, cy + Math.sin(angle) * r * share];
  });
  const radar = (axes, options = {}) => {
    const W = 520, H = 420, cx = W / 2, cy = H / 2 + 6, r = 150, levels = options.levels || 4;
    const svg = frame(W, H, options.title);
    const n = axes.length || 1;
    const format = options.format || ((v) => num(v, 1));
    for (let level = 1; level <= levels; level++) {
      const pts = polygonPoints(axes.map(() => level), axes.map(() => levels), cx, cy, r);
      svg.append(svgEl("polygon", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: C.grid, "stroke-width": 1 }));
    }
    axes.forEach((axis, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
      const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
      svg.append(svgEl("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: C.grid, "stroke-width": 1 }));
      const lx = cx + Math.cos(angle) * (r + 26), ly = cy + Math.sin(angle) * (r + 26);
      const anchor = Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
      const label = svgEl("text", { x: lx, y: ly + 4, "text-anchor": anchor, "font-size": 13, "font-weight": 600, fill: C.text }, shorten(axis.label, 22));
      svg.append(tip(label, `${axis.label}: ${format(axis.value)} / ${format(axis.max)}`));
    });
    (options.compare || []).forEach((set, i) => {
      const pts = polygonPoints(set.values, axes.map((a) => a.max), cx, cy, r);
      const poly = svgEl("polygon", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: SERIES[(i + 1) % SERIES.length], "stroke-width": 1.5, "stroke-dasharray": "5 4", opacity: 0.9 });
      svg.append(tip(poly, set.label));
    });
    const pts = polygonPoints(axes.map((a) => a.value), axes.map((a) => a.max), cx, cy, r);
    svg.append(svgEl("polygon", { points: pts.map((p) => p.join(",")).join(" "), fill: C.blue, "fill-opacity": 0.22, stroke: C.blue, "stroke-width": 2.5, "stroke-linejoin": "round" }));
    pts.forEach(([x, y], i) => {
      const dot = svgEl("circle", { cx: x, cy: y, r: 5, fill: C.blue, stroke: C.paper, "stroke-width": 2 });
      svg.append(tip(dot, `${axes[i].label}: ${format(axes[i].value)} / ${format(axes[i].max)}`));
    });
    return svg;
  };

  // Columns: items [{ label, value, color?, tip?, state? }], options { title, unit, target, targetLabel, format, yMax,
  // labels (values above the columns, default when ≤ 16 items), highlight(item) → bool (alert colour) }.
  const bars = (items, options = {}) => {
    const W = 640, H = 300, left = 48, right = 14, top = 28, bottom = 52;
    const svg = frame(W, H, options.title);
    const format = options.format || ((v) => num(v, digitsOf(items.map((i) => i.value), Math.max(...items.map((i) => i.value), 0))));
    const max = options.yMax || niceMax(Math.max(...items.map((i) => i.value), options.target || 0, 0));
    const plotW = W - left - right, plotH = H - top - bottom;
    const y = (v) => top + plotH - (v / max) * plotH;
    axisTicks(max, items.map((i) => i.value)).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid, "stroke-width": 1 }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(v)));
    });
    const band = plotW / (items.length || 1);
    const barW = Math.max(4, Math.min(44, band * 0.62));
    const showLabels = options.labels ?? items.length <= 16;
    items.forEach((item, i) => {
      const cx = left + band * i + band / 2;
      const g = svgEl("g");
      const hot = options.highlight ? options.highlight(item) : (options.target !== undefined && item.value > options.target);
      const color = item.color || (item.state ? stateColor(item.state) : hot ? C.top : C.bar);
      g.append(svgEl("rect", { x: cx - band / 2, y: top, width: band, height: plotH, fill: "transparent" }));
      if (item.value > 0) g.append(svgEl("rect", { x: cx - barW / 2, y: y(item.value), width: barW, height: Math.max(1, y(0) - y(item.value)), rx: 2, fill: color }));
      if (showLabels && item.value > 0) g.append(svgEl("text", { x: cx, y: y(item.value) - 5, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, format(item.value)));
      if (i % Math.ceil(items.length / 10) === 0 || items.length <= 12) svg.append(svgEl("text", { x: cx, y: top + plotH + 18, "text-anchor": "middle", "font-size": 12, fill: C.text }, shorten(item.label, Math.max(4, Math.floor(band / 7)))));
      svg.append(tip(g, item.tip || `${item.label}: ${format(item.value)}${options.unit ? ` ${options.unit}` : ""}`));
    });
    if (options.target !== undefined && options.target !== null) {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(options.target), y2: y(options.target), stroke: C.target, "stroke-width": 2, "pointer-events": "none" }));
      svg.append(svgEl("text", { x: W - right, y: 16, "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.target }, `${options.targetLabel || tx("Target")} ${format(options.target)}`));
    }
    if (options.unit) svg.append(svgEl("text", { x: left, y: 16, "font-size": 12, fill: C.muted }, options.unit));
    return svg;
  };

  // Stacked columns (a Yamazumi, waste by day): groups [{ label, parts: [{ key, value }] }], options { keys (order and
  // legend), colors, title, unit, line: { value, label } (the takt), format }.
  const stacked = (groups, options = {}) => {
    const keys = options.keys || [...new Set(groups.flatMap((g) => g.parts.map((p) => p.key)))];
    const colors = options.colors || Object.fromEntries(keys.map((key, i) => [key, SERIES[i % SERIES.length]]));
    const W = 640, H = 320 + Math.ceil(keys.length / 4) * 18, left = 48, right = 14, top = 28, bottom = 52 + Math.ceil(keys.length / 4) * 18;
    const svg = frame(W, H, options.title);
    const totals = groups.map((g) => g.parts.reduce((s, p) => s + p.value, 0));
    const max = options.yMax || niceMax(Math.max(...totals, options.line?.value || 0, 0));
    const format = options.format || ((v) => num(v, digitsOf(groups.flatMap((g) => g.parts.map((p) => p.value)), max)));
    const plotW = W - left - right, plotH = H - top - bottom;
    const y = (v) => top + plotH - (v / max) * plotH;
    axisTicks(max, groups.flatMap((g) => g.parts.map((p) => p.value))).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(v)));
    });
    const band = plotW / (groups.length || 1);
    const barW = Math.max(6, Math.min(56, band * 0.66));
    groups.forEach((group, i) => {
      const cx = left + band * i + band / 2;
      let acc = 0;
      keys.forEach((key) => {
        const value = group.parts.filter((p) => p.key === key).reduce((s, p) => s + p.value, 0);
        if (!(value > 0)) return;
        const rect = svgEl("rect", { x: cx - barW / 2, y: y(acc + value), width: barW, height: Math.max(1, y(acc) - y(acc + value)), fill: colors[key], stroke: C.paper, "stroke-width": 1 });
        svg.append(tip(rect, `${group.label} · ${key}: ${format(value)}${options.unit ? ` ${options.unit}` : ""} (${tx("total")} ${format(totals[i])})`));
        acc += value;
      });
      if (totals[i] > 0 && groups.length <= 14) svg.append(svgEl("text", { x: cx, y: y(totals[i]) - 5, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: C.text }, format(totals[i])));
      svg.append(svgEl("text", { x: cx, y: top + plotH + 18, "text-anchor": "middle", "font-size": 12, fill: C.text }, shorten(group.label, Math.max(4, Math.floor(band / 7)))));
    });
    if (options.line && Number.isFinite(options.line.value)) {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(options.line.value), y2: y(options.line.value), stroke: C.target, "stroke-width": 2, "stroke-dasharray": "6 4", "pointer-events": "none" }));
      svg.append(svgEl("text", { x: W - right, y: 16, "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.target }, `${options.line.label || tx("Takt")} ${format(options.line.value)}`));
    }
    keys.forEach((key, i) => {
      const lx = left + (i % 4) * (plotW / 4), ly = H - 10 - (Math.ceil(keys.length / 4) - 1 - Math.floor(i / 4)) * 18;
      svg.append(svgEl("rect", { x: lx, y: ly - 10, width: 12, height: 12, rx: 2, fill: colors[key] }));
      svg.append(svgEl("text", { x: lx + 17, y: ly, "font-size": 12, fill: C.text }, shorten(key, 22)));
    });
    return svg;
  };

  // Lines: series [{ label, points: [{ x (label), y, tip?, state? }], color? }], options { title, unit, format, center,
  // ucl, lcl (control limits), lsl, usl, target (specification), yMin, yMax, dots, step }. Points share the x labels
  // of the first series. A point with state "danger" or "warn" is drawn in that colour.
  const line = (series, options = {}) => {
    const W = 640, H = 300, left = 52, right = 16, top = 28, bottom = 44;
    const svg = frame(W, H, options.title);
    const all = series.flatMap((s) => s.points.map((p) => p.y)).filter(Number.isFinite);
    const extra = ["center", "ucl", "lcl", "lsl", "usl", "target"].map((k) => options[k]).filter(Number.isFinite);
    const lo = options.yMin ?? Math.min(...all, ...extra, 0);
    const hi = options.yMax ?? Math.max(...all, ...extra, lo + 1);
    const pad = (hi - lo) * 0.08;
    const min = options.yMin ?? (lo < 0 ? lo - pad : Math.max(0, lo - pad));
    const max = options.yMax ?? hi + pad;
    const format = options.format || ((v) => num(v, digitsFor(max - min)));
    const plotW = W - left - right, plotH = H - top - bottom;
    const n = Math.max(...series.map((s) => s.points.length), 1);
    const x = (i) => left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const y = (v) => top + plotH - ((v - min) / (max - min || 1)) * plotH;
    ticks(min, max, 4).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(v)));
    });
    const rule = (value, color, label, dash) => {
      if (!Number.isFinite(value)) return;
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(value), y2: y(value), stroke: color, "stroke-width": 1.5, "stroke-dasharray": dash, "pointer-events": "none" }));
      svg.append(svgEl("text", { x: W - right, y: y(value) - 4, "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: color }, `${label} ${format(value)}`));
    };
    rule(options.ucl, C.danger, "UCL", "4 4");
    rule(options.lcl, C.danger, "LCL", "4 4");
    rule(options.center, C.muted, options.centerLabel || "CL", "");
    rule(options.usl, C.target, "USL", "8 4");
    rule(options.lsl, C.target, "LSL", "8 4");
    rule(options.target, C.target, tx("Target"), "2 3");
    const labels = series[0]?.points || [];
    const every = Math.ceil(labels.length / 8);
    labels.forEach((p, i) => { if (i % every === 0 || i === labels.length - 1) svg.append(svgEl("text", { x: x(i), y: top + plotH + 18, "text-anchor": "middle", "font-size": 11, fill: C.text }, shorten(p.x, 10))); });
    series.forEach((s, si) => {
      const color = s.color || SERIES[si % SERIES.length];
      const d = s.points.map((p, i) => (Number.isFinite(p.y) ? `${i && Number.isFinite(s.points[i - 1].y) ? "L" : "M"}${x(i).toFixed(1)} ${y(p.y).toFixed(1)}` : "")).join(" ");
      if (d.trim()) svg.append(svgEl("path", { d: d.trim(), fill: "none", stroke: color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
      if (options.dots !== false) s.points.forEach((p, i) => {
        if (!Number.isFinite(p.y)) return;
        const fill = p.state ? stateColor(p.state) : color;
        const dot = svgEl("circle", { cx: x(i), cy: y(p.y), r: p.state && p.state !== "ok" ? 6 : 4, fill, stroke: C.paper, "stroke-width": 1.5 });
        svg.append(tip(dot, p.tip || `${p.x}${series.length > 1 ? ` · ${s.label}` : ""}: ${format(p.y)}${options.unit ? ` ${options.unit}` : ""}`));
      });
    });
    if (series.length > 1) series.forEach((s, i) => {
      const lx = left + i * 120;
      svg.append(svgEl("rect", { x: lx, y: 8, width: 12, height: 4, fill: s.color || SERIES[i % SERIES.length] }));
      svg.append(svgEl("text", { x: lx + 17, y: 14, "font-size": 12, fill: C.text }, shorten(s.label, 16)));
    });
    else if (options.unit) svg.append(svgEl("text", { x: left, y: 16, "font-size": 12, fill: C.muted }, options.unit));
    return svg;
  };

  // Histogram of values with specification limits and the normal curve of the sample: options { bins, lsl, usl, target,
  // title, unit, format, curve: true }. binsOf is exposed for tests.
  const binsOf = (values, count) => {
    const clean = values.filter(Number.isFinite);
    if (!clean.length) return [];
    const lo = Math.min(...clean), hi = Math.max(...clean);
    const n = count || Math.max(5, Math.min(20, Math.ceil(Math.sqrt(clean.length))));
    const width = (hi - lo) / n || 1;
    const bins = Array.from({ length: n }, (_, i) => ({ from: lo + i * width, to: lo + (i + 1) * width, count: 0 }));
    clean.forEach((v) => { bins[Math.min(n - 1, Math.floor((v - lo) / width))].count++; });
    return bins;
  };
  const histogram = (values, options = {}) => {
    const W = 640, H = 300, left = 44, right = 16, top = 28, bottom = 44;
    const svg = frame(W, H, options.title);
    const bins = binsOf(values, options.bins);
    if (!bins.length) return svg;
    const clean = values.filter(Number.isFinite);
    const mean = clean.reduce((s, v) => s + v, 0) / clean.length;
    const sd = Math.sqrt(clean.reduce((s, v) => s + (v - mean) ** 2, 0) / Math.max(1, clean.length - 1));
    const xs = [bins[0].from, bins.at(-1).to, options.lsl, options.usl, options.target].filter(Number.isFinite);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const span = xMax - xMin || 1;
    const maxCount = Math.max(...bins.map((b) => b.count));
    const plotW = W - left - right, plotH = H - top - bottom;
    const x = (v) => left + ((v - xMin - span * 0.03) / (span * 1.06)) * plotW;
    const y = (c) => top + plotH - (c / (maxCount || 1)) * plotH;
    const format = options.format || ((v) => num(v, digitsFor(span)));
    ticks(0, maxCount, 4).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, num(v)));
    });
    bins.forEach((bin) => {
      const out = (Number.isFinite(options.lsl) && bin.to <= options.lsl) || (Number.isFinite(options.usl) && bin.from >= options.usl);
      const rect = svgEl("rect", { x: x(bin.from) + 1, y: y(bin.count), width: Math.max(1, x(bin.to) - x(bin.from) - 2), height: Math.max(0, y(0) - y(bin.count)), fill: out ? C.top : C.bar, rx: 1 });
      svg.append(tip(rect, `${format(bin.from)} – ${format(bin.to)}: ${bin.count}`));
    });
    if (options.curve !== false && sd > 0) {
      const binWidth = bins[0].to - bins[0].from;
      const scale = clean.length * binWidth;
      const d = [];
      for (let i = 0; i <= 80; i++) {
        const v = xMin - span * 0.03 + (span * 1.06 * i) / 80;
        const density = Math.exp(-0.5 * ((v - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
        d.push(`${i ? "L" : "M"}${x(v).toFixed(1)} ${y(density * scale).toFixed(1)}`);
      }
      svg.append(svgEl("path", { d: d.join(" "), fill: "none", stroke: C.line, "stroke-width": 1.5, "stroke-dasharray": "5 3", "pointer-events": "none" }));
    }
    const vline = (v, label) => {
      if (!Number.isFinite(v)) return;
      svg.append(svgEl("line", { x1: x(v), x2: x(v), y1: top, y2: top + plotH, stroke: C.target, "stroke-width": 2, "pointer-events": "none" }));
      svg.append(svgEl("text", { x: x(v), y: 16, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.target }, `${label} ${format(v)}`));
    };
    vline(options.lsl, "LSL"); vline(options.usl, "USL"); vline(options.target, tx("Target"));
    ticks(xMin, xMax, 6).forEach((v) => svg.append(svgEl("text", { x: x(v), y: top + plotH + 18, "text-anchor": "middle", "font-size": 11, fill: C.text }, format(v))));
    if (options.unit) svg.append(svgEl("text", { x: left, y: H - 4, "font-size": 11, fill: C.muted }, options.unit));
    return svg;
  };

  // Box plots: groups [{ label, values }], options { title, unit, format }. quartiles is exposed for tests.
  const quartiles = (values) => {
    const s = values.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return null;
    const q = (p) => { const i = (s.length - 1) * p; const lo = Math.floor(i); return s[lo] + (s[Math.min(s.length - 1, lo + 1)] - s[lo]) * (i - lo); };
    const q1 = q(0.25), q2 = q(0.5), q3 = q(0.75), iqr = q3 - q1;
    const inside = s.filter((v) => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
    return { min: inside[0], q1, median: q2, q3, max: inside.at(-1), outliers: s.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr), n: s.length, mean: s.reduce((a, b) => a + b, 0) / s.length };
  };
  const box = (groups, options = {}) => {
    const W = 640, H = 300, left = 52, right = 16, top = 24, bottom = 44;
    const svg = frame(W, H, options.title);
    const stats = groups.map((g) => quartiles(g.values));
    const all = groups.flatMap((g) => g.values).filter(Number.isFinite);
    if (!all.length) return svg;
    const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo || 1) * 0.08;
    const min = lo - pad, max = hi + pad;
    const format = options.format || ((v) => num(v, digitsFor(max - min)));
    const plotW = W - left - right, plotH = H - top - bottom;
    const y = (v) => top + plotH - ((v - min) / (max - min)) * plotH;
    ticks(min, max, 4).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(v)));
    });
    const band = plotW / (groups.length || 1), bw = Math.min(70, band * 0.5);
    groups.forEach((g, i) => {
      const st = stats[i];
      const cx = left + band * i + band / 2;
      svg.append(svgEl("text", { x: cx, y: top + plotH + 18, "text-anchor": "middle", "font-size": 12, fill: C.text }, shorten(g.label, 14)));
      if (!st) return;
      const gr = svgEl("g");
      gr.append(svgEl("line", { x1: cx, x2: cx, y1: y(st.min), y2: y(st.q1), stroke: C.text, "stroke-width": 1.5 }));
      gr.append(svgEl("line", { x1: cx, x2: cx, y1: y(st.q3), y2: y(st.max), stroke: C.text, "stroke-width": 1.5 }));
      gr.append(svgEl("rect", { x: cx - bw / 2, y: y(st.q3), width: bw, height: Math.max(1, y(st.q1) - y(st.q3)), fill: C.blue, "fill-opacity": 0.35, stroke: C.blue, "stroke-width": 1.5, rx: 2 }));
      gr.append(svgEl("line", { x1: cx - bw / 2, x2: cx + bw / 2, y1: y(st.median), y2: y(st.median), stroke: C.text, "stroke-width": 2.5 }));
      [st.min, st.max].forEach((v) => gr.append(svgEl("line", { x1: cx - bw / 4, x2: cx + bw / 4, y1: y(v), y2: y(v), stroke: C.text, "stroke-width": 1.5 })));
      svg.append(tip(gr, `${g.label} (n = ${st.n})\n${tx("Median")} ${format(st.median)} · ${tx("Mean")} ${format(st.mean)}\nQ1 ${format(st.q1)} · Q3 ${format(st.q3)}\n${tx("Range")} ${format(st.min)} – ${format(st.max)}`));
      st.outliers.forEach((v) => svg.append(tip(svgEl("circle", { cx, cy: y(v), r: 4, fill: C.top }), `${g.label}: ${format(v)} (${tx("outlier")})`)));
    });
    if (options.unit) svg.append(svgEl("text", { x: left, y: 14, "font-size": 12, fill: C.muted }, options.unit));
    return svg;
  };

  // Scatter: points [{ x, y, label? }], options { title, xLabel, yLabel, fit: { slope, intercept, r } (drawn as a line), format }.
  const scatter = (points, options = {}) => {
    const W = 640, H = 320, left = 52, right = 16, top = 20, bottom = 52;
    const svg = frame(W, H, options.title);
    const clean = points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
    if (!clean.length) return svg;
    const xs = clean.map((p) => p.x), ys = clean.map((p) => p.y);
    const padX = (Math.max(...xs) - Math.min(...xs) || 1) * 0.08, padY = (Math.max(...ys) - Math.min(...ys) || 1) * 0.1;
    const xMin = Math.min(...xs) - padX, xMax = Math.max(...xs) + padX, yMin = Math.min(...ys) - padY, yMax = Math.max(...ys) + padY;
    const plotW = W - left - right, plotH = H - top - bottom;
    const x = (v) => left + ((v - xMin) / (xMax - xMin)) * plotW;
    const y = (v) => top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    const format = options.format || ((v) => num(v, digitsFor(Math.max(xMax - xMin, yMax - yMin))));
    ticks(yMin, yMax, 4).forEach((v) => {
      svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(v)));
    });
    ticks(xMin, xMax, 6).forEach((v) => svg.append(svgEl("text", { x: x(v), y: top + plotH + 18, "text-anchor": "middle", "font-size": 11, fill: C.text }, format(v))));
    if (options.fit && Number.isFinite(options.fit.slope)) {
      const { slope, intercept } = options.fit;
      svg.append(svgEl("line", { x1: x(xMin), y1: y(intercept + slope * xMin), x2: x(xMax), y2: y(intercept + slope * xMax), stroke: C.target, "stroke-width": 2, "stroke-dasharray": "6 4", "pointer-events": "none" }));
      if (Number.isFinite(options.fit.r)) svg.append(svgEl("text", { x: W - right, y: 14, "text-anchor": "end", "font-size": 12, "font-weight": 700, fill: C.target }, `r = ${num(options.fit.r, 2)}`));
    }
    clean.forEach((p) => svg.append(tip(svgEl("circle", { cx: x(p.x), cy: y(p.y), r: 5, fill: C.blue, "fill-opacity": 0.75, stroke: C.paper, "stroke-width": 1 }), `${p.label ? `${p.label}\n` : ""}${options.xLabel || "x"}: ${format(p.x)}\n${options.yLabel || "y"}: ${format(p.y)}`)));
    if (options.xLabel) svg.append(svgEl("text", { x: left + plotW / 2, y: H - 6, "text-anchor": "middle", "font-size": 12, fill: C.muted }, options.xLabel));
    if (options.yLabel) svg.append(svgEl("text", { x: left, y: 14, "font-size": 12, fill: C.muted }, options.yLabel));
    return svg;
  };

  // Heat map: rows and cols are labels; cell(r, c) returns { text, state | color, tip } or null for an empty cell.
  const heatmap = (rows, cols, cell, options = {}) => {
    const size = options.cellSize || 44, labelW = options.labelWidth || 150, head = 64;
    const W = labelW + cols.length * size + 12, H = head + rows.length * size + 8;
    const svg = frame(W, H, options.title);
    cols.forEach((col, c) => {
      const label = svgEl("text", { x: labelW + c * size + size / 2, y: head - 10, "text-anchor": "end", "font-size": 11, fill: C.text, transform: `rotate(-35 ${labelW + c * size + size / 2} ${head - 10})` }, shorten(col, 16));
      svg.append(label);
    });
    rows.forEach((row, r) => {
      svg.append(svgEl("text", { x: labelW - 10, y: head + r * size + size / 2 + 4, "text-anchor": "end", "font-size": 12, fill: C.text }, shorten(row, 22)));
      cols.forEach((col, c) => {
        const info = cell(r, c);
        const g = svgEl("g");
        g.append(svgEl("rect", { x: labelW + c * size + 2, y: head + r * size + 2, width: size - 4, height: size - 4, rx: 4, fill: info ? (info.color || stateColor(info.state)) : "transparent", stroke: C.grid, "fill-opacity": info && info.opacity !== undefined ? info.opacity : 1 }));
        if (info && info.text !== undefined && info.text !== "") g.append(svgEl("text", { x: labelW + c * size + size / 2, y: head + r * size + size / 2 + 4, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: info.textColor || "#ffffff" }, String(info.text)));
        svg.append(tip(g, info?.tip || `${row} · ${col}`));
      });
    });
    return svg;
  };

  // A month as a grid (the safety cross, a board of green and red days): dayOf(iso) returns { state, text, tip } or null.
  const DAY_NAMES = { en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], sq: ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"] };
  const calendar = (year, month, dayOf, options = {}) => {
    const size = options.cellSize || 56, head = 30;
    const first = new Date(Date.UTC(year, month - 1, 1));
    const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const offset = (first.getUTCDay() + 6) % 7;
    const weeks = Math.ceil((offset + days) / 7);
    const W = 7 * size + 8, H = head + weeks * size + 8;
    const svg = frame(W, H, options.title);
    (options.dayNames || DAY_NAMES[LANG] || DAY_NAMES.en).forEach((name, i) => svg.append(svgEl("text", { x: 4 + i * size + size / 2, y: 18, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.muted }, name)));
    for (let d = 1; d <= days; d++) {
      const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const slot = offset + d - 1, col = slot % 7, row = Math.floor(slot / 7);
      const info = dayOf(iso);
      const g = svgEl("g");
      g.append(svgEl("rect", { x: 4 + col * size + 2, y: head + row * size + 2, width: size - 4, height: size - 4, rx: 6, fill: info?.state && info.state !== "none" ? stateColor(info.state) : "transparent", stroke: C.grid, "fill-opacity": info?.state === "future" ? 0 : 1 }));
      g.append(svgEl("text", { x: 4 + col * size + 8, y: head + row * size + 16, "font-size": 11, "font-weight": 700, fill: info?.state && info.state !== "none" ? "#ffffff" : C.muted }, String(d)));
      if (info?.text) g.append(svgEl("text", { x: 4 + col * size + size / 2, y: head + row * size + size / 2 + 10, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: info.state && info.state !== "none" ? "#ffffff" : C.text }, String(info.text)));
      svg.append(tip(g, info?.tip || iso));
    }
    return svg;
  };

  // A 2 × 2 matrix (effort against impact): points [{ label, x, y, size? }] with x and y from 0 to max; options
  // { xLabel, yLabel, title, names: [top-left, top-right, bottom-left, bottom-right], max }.
  const quadrant = (points, options = {}) => {
    const W = 560, H = 420, left = 48, right = 16, top = 28, bottom = 44, max = options.max || 10;
    const svg = frame(W, H, options.title);
    const plotW = W - left - right, plotH = H - top - bottom;
    const x = (v) => left + (v / max) * plotW;
    const y = (v) => top + plotH - (v / max) * plotH;
    svg.append(svgEl("rect", { x: left, y: top, width: plotW, height: plotH, fill: "none", stroke: C.grid }));
    svg.append(svgEl("line", { x1: x(max / 2), x2: x(max / 2), y1: top, y2: top + plotH, stroke: C.grid, "stroke-dasharray": "4 4" }));
    svg.append(svgEl("line", { x1: left, x2: W - right, y1: y(max / 2), y2: y(max / 2), stroke: C.grid, "stroke-dasharray": "4 4" }));
    (options.names || []).forEach((name, i) => {
      const nx = i % 2 ? W - right - 8 : left + 8, ny = i < 2 ? top + 16 : top + plotH - 8;
      svg.append(svgEl("text", { x: nx, y: ny, "text-anchor": i % 2 ? "end" : "start", "font-size": 11, "font-weight": 800, "letter-spacing": ".08em", fill: C.muted }, String(name).toUpperCase()));
    });
    points.forEach((p, i) => {
      const g = svgEl("g");
      g.append(svgEl("circle", { cx: x(p.x), cy: y(p.y), r: 8 + (p.size || 0), fill: p.color || SERIES[i % SERIES.length], "fill-opacity": 0.85, stroke: C.paper, "stroke-width": 1.5 }));
      g.append(svgEl("text", { x: x(p.x) + 12, y: y(p.y) + 4, "font-size": 12, fill: C.text }, shorten(p.label, 18)));
      svg.append(tip(g, p.tip || `${p.label}\n${options.xLabel || "x"}: ${num(p.x, 1)} · ${options.yLabel || "y"}: ${num(p.y, 1)}`));
    });
    if (options.xLabel) svg.append(svgEl("text", { x: left + plotW / 2, y: H - 8, "text-anchor": "middle", "font-size": 12, fill: C.muted }, `${options.xLabel} →`));
    if (options.yLabel) svg.append(svgEl("text", { x: 14, y: top + plotH / 2, "text-anchor": "middle", "font-size": 12, fill: C.muted, transform: `rotate(-90 14 ${top + plotH / 2})` }, `${options.yLabel} →`));
    return svg;
  };

  // Export and figure -------------------------------------------------------------------------------------------------
  const exportSvg = (svg) => {
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", SVG_NS);
    const [, , w, h] = clone.getAttribute("viewBox").split(" ").map(Number);
    clone.setAttribute("width", w);
    clone.setAttribute("height", h);
    clone.insertBefore(svgEl("rect", { x: 0, y: 0, width: w, height: h, fill: "#ffffff" }), clone.firstChild?.nextSibling || null);
    let text = new XMLSerializer().serializeToString(clone);
    Object.entries(EXPORT).forEach(([token, hex]) => { text = text.split(token).join(hex); });
    // Any other variable has no value outside the page.
    return text.replace(/var\(--[a-z0-9-]+\)/g, "#1b2330").replace(/ data-tip="[^"]*"/g, "");
  };
  const saveBlob = (name, blob) => {
    const link = el("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  const today = kit.today || (() => new Date().toISOString().slice(0, 10));
  // One tooltip per figure: a pointer on a part with data-tip shows it; a tap on a phone does the same.
  const attachTooltip = (wrap, svg) => {
    if (kit.chartTooltip) return kit.chartTooltip(wrap, svg);
    const tooltip = el("div", "ck-tooltip");
    tooltip.hidden = true;
    tooltip.setAttribute("role", "status");
    wrap.append(tooltip);
    const show = (event) => {
      const target = event.target.closest?.("[data-tip]");
      if (!target) { tooltip.hidden = true; return; }
      const lines = target.getAttribute("data-tip").split("\n");
      tooltip.replaceChildren(...lines.map((text, i) => el(i ? "span" : "strong", null, text)));
      tooltip.hidden = false;
      const box = wrap.getBoundingClientRect();
      const left = event.clientX - box.left, top = event.clientY - box.top;
      const flip = left > box.width * 0.6;
      tooltip.style.left = `${flip ? left - tooltip.offsetWidth - 12 : left + 12}px`;
      tooltip.style.top = `${Math.max(0, top - tooltip.offsetHeight - 10)}px`;
    };
    svg.addEventListener("pointermove", show);
    svg.addEventListener("pointerdown", show);
    svg.addEventListener("pointerleave", () => { tooltip.hidden = true; });
    return tooltip;
  };
  // A figure with the chart, its tooltip and the SVG and PNG buttons. options { fileName, caption, buttons (default true) }.
  const figure = (svg, options = {}) => {
    const fig = el("figure", "ck-figure");
    const scroller = el("div", "ck-scroll");
    scroller.append(svg);
    fig.append(scroller);
    attachTooltip(scroller, svg);
    if (options.caption) fig.append(el("figcaption", "ck-caption", options.caption));
    if (options.buttons !== false) {
      const actions = el("div", "tool-actions ck-actions");
      const name = options.fileName || "chart";
      const svgButton = el("button", "button-secondary", tx("Chart as SVG"));
      svgButton.type = "button";
      svgButton.addEventListener("click", () => saveBlob(`${name}-${today()}.svg`, new Blob([exportSvg(svg)], { type: "image/svg+xml" })));
      const pngButton = el("button", "button-secondary", tx("Chart as PNG"));
      pngButton.type = "button";
      pngButton.addEventListener("click", () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;
          const ctx = canvas.getContext("2d");
          ctx.scale(2, 2);
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => blob && saveBlob(`${name}-${today()}.png`, blob));
        };
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(exportSvg(svg))}`;
      });
      actions.append(svgButton, pngButton);
      fig.append(actions);
    }
    return fig;
  };
  // A legend of colours and labels, as HTML, for charts whose colours mean something.
  const legend = (items) => {
    const list = el("ul", "ck-legend");
    items.forEach(({ label, color, state }) => {
      const item = el("li");
      const swatch = el("span", "ck-swatch");
      swatch.style.background = color || stateColor(state);
      item.append(swatch, label);
      list.append(item);
    });
    return list;
  };

  return { svgEl, C, SERIES, EXPORT, stateColor, niceMax, ticks, polygonPoints, binsOf, quartiles, radar, bars, stacked, line, histogram, box, scatter, heatmap, calendar, quadrant, exportSvg, figure, legend, attachTooltip };
})();
