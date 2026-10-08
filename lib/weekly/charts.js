// The charts of the weekly Management Review, drawn as SVG from the figures of an issue (lib/weekly/issues).
// The same markup goes into the printed pages (src/guide-print/weekly.njk) and onto the web page of the issue
// (src/_includes/pages/weekly-issue.njk). Colours come from classes, so the print and the site (dark or light)
// colour it their own way; on the site the parts move in once (js/weekly.js) unless motion is reduced.
//
// A chart is drawn in a box 340 units wide (WIDE): about one unit per point on the printed page, where the text
// column is 122 mm. A phone gets the same chart drawn 230 units wide (NARROW), so its text stays readable. Figures
// arrive already written for the language ("31%", "31 %"); v is the value to draw.

const esc = (value) => String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const r = (n) => Math.round(n * 10) / 10;
export const WIDE = 340;
export const NARROW = 230;

const svg = (W, height, label, body) =>
  `<svg class="wk-svg" viewBox="0 0 ${W} ${r(height)}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, cls, value, anchor = "middle", extra = "") =>
  `<text class="${cls}" x="${r(x)}" y="${r(y)}" text-anchor="${anchor}"${extra}>${esc(value)}</text>`;
const order = (i) => ` style="--i:${i}"`;

// Round steps for the value axis: 0, 10, 20 … between min and max.
const ticksFor = (min, max) => {
  const span = max - min;
  const step = [1, 2, 5, 10, 20, 25, 50, 100].find((s) => span / s <= 5) || Math.ceil(span / 5);
  const out = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) out.push(t);
  return out;
};

// A line over time: one series, or several (a missing year is left out of the line, never drawn through).
function line(b, W) {
  const H = b.height || 150;
  const pad = { l: 30, r: 18, t: 22, b: 22 };
  // The first and last points sit a little inside the grid, so their figures clear the axis.
  const inset = 18;
  const series = b.series || [{ points: b.points, alert: b.alert }];
  const keys = series[0].points.map((p) => p.k);
  const min = b.min ?? 0;
  const max = b.max ?? 100;
  const span = W - pad.l - pad.r - 2 * inset;
  const x = (i) => pad.l + inset + (keys.length === 1 ? span / 2 : (i * span) / (keys.length - 1));
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  let body = "";
  for (const t of b.ticks || ticksFor(min, max)) {
    body += `<line class="wk-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${r(y(t))}" y2="${r(y(t))}"/>`;
    body += text(pad.l - 7, y(t) + 2.6, "wk-axis", `${t}${b.unit ?? ""}`, "end");
  }
  keys.forEach((k, i) => { body += text(x(i), H - 6, "wk-axis", k); });
  let step = 0;
  series.forEach((s) => {
    const tone = s.alert ? " is-alert" : s.dim ? " is-dim" : "";
    const known = s.points.map((p, i) => ({ ...p, i })).filter((p) => p.v != null);
    const runs = [];
    known.forEach((p, j) => { if (j === 0 || p.i !== known[j - 1].i + 1) runs.push([]); runs.at(-1).push(p); });
    for (const run of runs) {
      const d = run.map((p, j) => `${j ? "L" : "M"}${r(x(p.i))} ${r(y(p.v))}`).join(" ");
      if (series.length === 1 && run.length > 1) {
        body += `<path class="wk-area wk-fade${tone}" d="${d} L${r(x(run.at(-1).i))} ${r(y(min))} L${r(x(run[0].i))} ${r(y(min))} Z"/>`;
      }
      if (run.length > 1) body += `<path class="wk-path${tone}" pathLength="1" d="${d}"/>`;
    }
    known.forEach((p) => {
      const last = p.i === keys.length - 1;
      body += `<circle class="wk-dot wk-pop${tone}${last ? " is-key" : ""}"${order(step)} cx="${r(x(p.i))}" cy="${r(y(p.v))}" r="${last ? 4.2 : 3.3}"/>`;
      body += text(x(p.i), y(p.v) - (last ? 9 : 7.5), `wk-value wk-pop${last ? " is-key" : ""}${tone}`, p.n, "middle", order(step));
      step += 1;
    });
  });
  const label = `${b.label}: ${series.map((s) => `${s.name ? `${s.name} ` : ""}${s.points.filter((p) => p.v != null).map((p) => `${p.k} ${p.n}`).join(", ")}`).join("; ")}`;
  return svg(W, H, label, body);
}

// Two moments for a few groups: where each group started and where it is now.
function dumbbell(b, W) {
  const rowH = b.rowH || 28;
  const top = 22;
  const H = top + b.rows.length * rowH;
  const x0 = 104;
  const x1 = W - 14;
  const min = b.min ?? 0;
  const max = b.max ?? 100;
  const x = (v) => x0 + ((v - min) / (max - min)) * (x1 - x0);
  let body = "";
  body += `<circle class="wk-dot-a" cx="${x0 + 4}" cy="8" r="3.3"/>` + text(x0 + 11, 10.6, "wk-axis", b.from, "start");
  const second = x0 + 26 + String(b.from).length * 4.6;
  body += `<circle class="wk-dot-key" cx="${r(second)}" cy="8" r="3.3"/>` + text(second + 7, 10.6, "wk-axis", b.to, "start");
  b.rows.forEach((row, i) => {
    const cy = top + i * rowH + rowH / 2;
    const tone = row.alert ? " is-alert" : "";
    const xa = x(row.a);
    const xb = x(row.b);
    body += text(0, cy + 3, "wk-label", row.k, "start");
    body += `<line class="wk-track" x1="${x0}" x2="${x1}" y1="${cy}" y2="${cy}"/>`;
    body += `<line class="wk-seg wk-grow${tone}${row.b < row.a ? " is-back" : ""}"${order(i)} x1="${r(Math.min(xa, xb))}" x2="${r(Math.max(xa, xb))}" y1="${cy}" y2="${cy}"/>`;
    body += `<circle class="wk-dot-a" cx="${r(xa)}" cy="${cy}" r="3.6"/>`;
    body += `<circle class="wk-dot wk-pop${tone}"${order(i + 1)} cx="${r(xb)}" cy="${cy}" r="4.2"/>`;
    if (Math.abs(xa - xb) < 26) {
      const [left, right] = xa < xb ? [[xa, row.an, "is-a"], [xb, row.bn, `wk-pop${tone}`]] : [[xb, row.bn, `wk-pop${tone}`], [xa, row.an, "is-a"]];
      body += text(left[0] - 7, cy + 3, `wk-value ${left[2]}`, left[1], "end", left[2] === "is-a" ? "" : order(i + 1));
      body += text(right[0] + 7, cy + 3, `wk-value ${right[2]}`, right[1], "start", right[2] === "is-a" ? "" : order(i + 1));
    } else {
      body += text(xa, cy - 7, "wk-value is-a", row.an);
      body += text(xb, cy - 7.5, `wk-value wk-pop${tone}`, row.bn, "middle", order(i + 1));
    }
  });
  const label = `${b.label}: ${b.rows.map((row) => `${row.k} ${b.from} ${row.an}, ${b.to} ${row.bn}`).join("; ")}`;
  return svg(W, H, label, body);
}

// One share of a whole, as a ring with the figure in the middle.
function donut(b, W) {
  const v = Math.max(0, Math.min(100, b.v));
  const tone = b.alert ? " is-alert" : "";
  const body =
    `<circle class="wk-ring" cx="60" cy="60" r="46"/>` +
    `<circle class="wk-arc${tone}" cx="60" cy="60" r="46" pathLength="100" stroke-dasharray="${v} 100" transform="rotate(-90 60 60)" style="--v:${v}"/>` +
    `<text class="wk-donut-n wk-count" x="60" y="${b.sub ? 64 : 68}" text-anchor="middle">${esc(b.n)}</text>` +
    (b.sub ? text(60, 79, "wk-axis", b.sub) : "");
  return `<svg class="wk-svg wk-svg-donut" viewBox="0 0 120 120" role="img" aria-label="${esc(`${b.n} ${b.t || b.label || ""}`.trim())}">${body}</svg>`;
}

// People out of ten (or another small whole), coloured by group.
function people(b, W) {
  const total = b.groups.reduce((sum, g) => sum + g.v, 0);
  const size = 20;
  const gap = Math.min(total > 10 ? 4 : 10, (W - 4 - total * size) / Math.max(1, total - 1));
  const width = total * size + (total - 1) * gap;
  const start = (W - width) / 2;
  let body = "";
  let i = 0;
  for (const g of b.groups) {
    for (let k = 0; k < g.v; k += 1) {
      const cx = start + i * (size + gap) + size / 2;
      body += `<g class="wk-person wk-pop tone-${g.tone || "dim"}"${order(i)}><circle cx="${r(cx)}" cy="6.5" r="5"/><path d="M${r(cx - 7.5)} 34 V23 a7.5 7.5 0 0 1 7.5 -7.5 a7.5 7.5 0 0 1 7.5 7.5 V34 Z"/></g>`;
      i += 1;
    }
  }
  const label = `${b.label}: ${b.groups.map((g) => `${g.n} ${g.t}`).join(", ")}`;
  const legend = `<ul class="wk-legend">${b.groups.map((g) => `<li class="tone-${g.tone || "dim"}"><b>${esc(g.n)}</b><span>${esc(g.t)}</span></li>`).join("")}</ul>`;
  return svg(W, 35, label, body) + legend;
}

// Before and after, side by side for each group.
function pairs(b, W) {
  const rowH = 44;
  const top = 18;
  const H = top + b.rows.length * rowH - 4;
  const max = b.max ?? 100;
  const span = W - 44;
  let body = "";
  body += `<rect class="wk-bar-a" x="0" y="3" width="9" height="6" rx="1.5"/>` + text(13, 9, "wk-axis", b.from, "start");
  const second = 26 + String(b.from).length * 4.6;
  body += `<rect class="wk-bar" x="${r(second)}" y="3" width="9" height="6" rx="1.5"/>` + text(second + 13, 9, "wk-axis", b.to, "start");
  b.rows.forEach((row, i) => {
    const y = top + i * rowH;
    const wa = (row.a / max) * span;
    const wb = (row.b / max) * span;
    body += text(0, y + 9, "wk-label", row.k, "start");
    body += `<rect class="wk-bar-a wk-grow"${order(i * 2)} x="0" y="${y + 14}" width="${r(wa)}" height="8" rx="2"/>`;
    body += text(wa + 6, y + 20.6, "wk-value is-a", row.an, "start");
    body += `<rect class="wk-bar wk-grow${row.alert ? " is-alert" : ""}"${order(i * 2 + 1)} x="0" y="${y + 25}" width="${r(wb)}" height="11" rx="2.5"/>`;
    body += text(wb + 6, y + 33.6, "wk-value wk-pop", row.bn, "start", order(i * 2 + 1));
  });
  const label = `${b.label}: ${b.rows.map((row) => `${row.k} ${b.from} ${row.an}, ${b.to} ${row.bn}`).join("; ")}`;
  return svg(W, H, label, body);
}

// A few values as columns.
function columns(b, W) {
  const H = b.height || 150;
  const pad = { t: 18, b: 26 };
  const max = b.max ?? Math.max(...b.items.map((item) => item.v));
  const slot = W / b.items.length;
  const width = Math.min(46, slot * 0.58);
  const base = H - pad.b;
  let body = `<line class="wk-grid" x1="0" x2="${W}" y1="${base}" y2="${base}"/>`;
  b.items.forEach((item, i) => {
    const h = (item.v / max) * (base - pad.t);
    const cx = slot * i + slot / 2;
    body += `<rect class="wk-col wk-rise${item.alert ? " is-alert" : ""}"${order(i)} x="${r(cx - width / 2)}" y="${r(base - h)}" width="${r(width)}" height="${r(h)}" rx="2.5"/>`;
    body += text(cx, base - h - 6, "wk-value wk-pop", item.n, "middle", order(i));
    body += text(cx, H - 9, "wk-axis", item.k);
  });
  return svg(W, H, `${b.label}: ${b.items.map((item) => `${item.k} ${item.n}`).join(", ")}`, body);
}

// Shares of different groups, one bar each, the label above its bar.
function hbars(b, W) {
  const rowH = 30;
  const max = b.max ?? 100;
  const span = W - 46;
  const H = b.items.length * rowH - 4;
  let body = "";
  b.items.forEach((item, i) => {
    const y = i * rowH;
    const w = Math.max(1.5, (item.v / max) * span);
    body += text(0, y + 8.5, "wk-label", item.k, "start");
    body += `<rect class="wk-bar-a" x="0" y="${y + 13}" width="${span}" height="11" rx="2.5"/>`;
    body += `<rect class="wk-bar wk-grow${item.alert ? " is-alert" : ""}"${order(i)} x="0" y="${y + 13}" width="${r(w)}" height="11" rx="2.5"/>`;
    body += text(span + 6, y + 21.6, `wk-value wk-pop${item.alert ? " is-key is-alert" : ""}`, item.n, "start", order(i));
  });
  return svg(W, H, `${b.label}: ${b.items.map((item) => `${item.k} ${item.n}`).join(", ")}`, body);
}

// A long span of days, one square each, with the share that counted marked in the last one.
function days(b, W) {
  const cols = b.cols || 29;
  const rows = Math.ceil(b.total / cols);
  const cell = W / cols;
  const size = cell * 0.8;
  const H = rows * cell;
  let body = "";
  for (let d = 0; d < b.total; d += 1) {
    const col = d % cols;
    const row = Math.floor(d / cols);
    const x = col * cell;
    const y = row * cell;
    const last = d === b.total - 1;
    body += `<rect class="wk-day wk-pop${last ? " is-key" : ""}"${order(row)} x="${r(x)}" y="${r(y)}" width="${r(size)}" height="${r(size)}" rx="1.2"/>`;
    if (last) body += `<rect class="wk-day-part wk-pop"${order(rows + 1)} x="${r(x)}" y="${r(y)}" width="${r(Math.max(0.8, size * b.part))}" height="${r(size)}" rx="0.6"/>`;
  }
  const legend = `<ul class="wk-legend">${b.legend.map((item, i) => `<li class="tone-${i ? "red" : "dim"}"><b>${esc(item.n)}</b><span>${esc(item.t)}</span></li>`).join("")}</ul>`;
  return svg(W, H, `${b.label}: ${b.legend.map((item) => `${item.n} ${item.t}`).join(", ")}`, body) + legend;
}

const DRAW = { line, dumbbell, donut, people, pairs, columns, hbars, days };
export const CHARTS = Object.keys(DRAW);

// The SVG (and legend) of a chart block, or "" for any other block.
export const chartMarkup = (block, width = WIDE) => (DRAW[block.type] ? DRAW[block.type](block, width) : "");

// The same figures in one sentence, for the text version of the issue and for screen readers.
export const chartText = (block) => {
  switch (block.type) {
    case "line":
      return (block.series || [{ points: block.points }]).map((s) => `${s.name ? `${s.name}: ` : ""}${s.points.filter((p) => p.v != null).map((p) => `${p.k} ${p.n}`).join(", ")}`).join("; ");
    case "dumbbell":
    case "pairs":
      return block.rows.map((row) => `${row.k}: ${block.from} ${row.an}, ${block.to} ${row.bn}`).join("; ");
    case "donut":
      return `${block.n} ${block.t || ""}`.trim();
    case "people":
      return block.groups.map((g) => `${g.n} ${g.t}`).join(", ");
    case "columns":
    case "hbars":
      return block.items.map((item) => `${item.k} ${item.n}`).join(", ");
    case "days":
      return block.legend.map((item) => `${item.n} ${item.t}`).join(", ");
    default:
      return "";
  }
};
