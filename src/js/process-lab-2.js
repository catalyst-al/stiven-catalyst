(() => {
  // Process Lab, the second set of tabs: the control chart family with phases, a chi-square test of a table, a
  // straight line through two columns, and the measurement system (attribute agreement and Gage R&R). The statistics
  // are in stats-kit.js; this file reads what was pasted, says what the numbers mean and draws them. It runs after
  // process-lab.js, which owns the tabs, and keeps its own saved work (cfg.lab.storageKey).
  const fill = (template, vars = {}) => String(template ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const kit = () => window.ToolKit;
  // A header that names the known answer of an attribute study, in the three languages.
  const STANDARD = /^(standard|reference|ref|master|known|soll|sollwert|referenz|standardi|referenca|etalon)$/i;

  // Pasted rows as cells and a reader for their numbers, the way the first set reads them (process-lab.js, readPaste):
  // tabs or semicolons split as in Excel, otherwise spaces, or commas in a comma-separated file. The decimal mark is
  // the one the pasted numbers prove, on every page ("47,2" is 47.2 on the English page too); `ambiguous` names a
  // value nothing in the paste settles, for the warning.
  const pasteOf = (text, options) => {
    const paste = window.ProcessLabMath.readPaste(text, options);
    return { ...paste, isNum: (cell) => Number.isFinite(paste.number(cell)) };
  };
  const cellsOf = (text) => pasteOf(text).rows;
  // The result of a parser with that `ambiguous`, kept out of its enumerable shape.
  const noting = (result, paste) => Object.defineProperty(result, "ambiguous", { value: paste.ambiguous });
  // A first cell that reads as a date (with separators: a five-digit count is not an Excel date here) is the row's date.
  const dateOf = (cell) => (/[-./]/.test(String(cell)) ? kit().parseDate(cell) : "");
  const decimals = (values) => Math.min(3, Math.max(0, ...values.map((value) => { const text = String(value); const at = text.indexOf("."); return at < 0 ? 0 : text.length - at - 1; })));
  const verdictOf = (p) => (!Number.isFinite(p) ? null : p < 0.05 ? "real" : p < 0.1 ? "borderline" : "noise");

  // Rows for a control chart: a date or label first (optional), then the numbers the chart needs. Rows without a
  // number (a header) are passed over; rows with the wrong numbers are counted as skipped.
  const parseChartRows = (text, kind) => {
    const paste = pasteOf(text);
    const rows = [];
    let skipped = 0;
    paste.rows.forEach((cells) => {
      const list = cells.map((cell) => String(cell).trim()).filter(Boolean);
      if (!list.length) return;
      let label = "", date = "";
      const day = dateOf(list[0]);
      if (day) { date = day; label = list.shift(); }
      else if (!paste.isNum(list[0])) label = list.shift();
      const numbers = list.map(paste.number).filter(Number.isFinite);
      if (!numbers.length) return;
      const row = { label, date };
      if (kind === "imr") row.value = numbers.at(-1);
      else if (kind === "xbar") {
        if (numbers.length < 2 || numbers.length > 25) { skipped++; return; }
        row.values = numbers;
      } else if (kind === "c") {
        if (!(numbers.at(-1) >= 0)) { skipped++; return; }
        row.count = numbers.at(-1);
      } else {
        const [count, size] = numbers;
        if (!(count >= 0) || !(size > 0) || ((kind === "np" || kind === "p") && count > size)) { skipped++; return; }
        row.count = count;
        row.size = size;
      }
      rows.push(row);
    });
    return noting({ rows, skipped }, paste);
  };

  // A table of counts: a header row with the column names (its first cell names the rows), then one row per group.
  const parseTable = (text) => {
    // Counts are whole numbers, so "1,234" or "1.234" in a table is a thousand on every page.
    const paste = pasteOf(text, { whole: true });
    const { isNum } = paste;
    const rows = paste.rows.filter((cells) => cells.some((cell) => String(cell).trim()));
    if (!rows.length) return null;
    let head = null;
    if (rows[0].slice(1).some((cell) => String(cell).trim() && !isNum(cell))) head = rows.shift();
    const width = Math.max(0, ...rows.map((cells) => cells.length));
    const labelled = rows.some((cells) => !isNum(cells[0]));
    const counts = [], rowLabels = [];
    let bad = 0;
    rows.forEach((cells, i) => {
      const values = (labelled ? cells.slice(1) : cells).map((cell) => (String(cell).trim() === "" ? 0 : paste.number(cell)));
      if (values.some((value) => !(value >= 0) || !Number.isInteger(value))) { bad++; return; }
      counts.push(values);
      rowLabels.push(labelled ? String(cells[0]).trim() || String(i + 1) : String(i + 1));
    });
    const columns = Math.max(0, ...counts.map((row) => row.length));
    const colLabels = [...Array(columns)].map((_, j) => String(head?.[labelled ? j + 1 : j] ?? "").trim() || String(j + 1));
    return noting({ rowName: labelled ? String(head?.[0] ?? "").trim() : "", rowLabels, colLabels, counts: counts.map((row) => [...Array(columns)].map((_, j) => row[j] || 0)), bad, width }, paste);
  };

  // Two columns, x and y; a header row gives their names, a text first cell is the point's label.
  const parseXY = (text) => {
    const paste = pasteOf(text);
    const { isNum } = paste;
    const points = [];
    let xName = "", yName = "";
    paste.rows.forEach((cells, index) => {
      const list = cells.map((cell) => String(cell).trim()).filter(Boolean);
      const numbers = list.filter(isNum);
      if (numbers.length < 2) {
        if (index === 0 && list.length >= 2 && !numbers.length) { [xName, yName] = list.slice(-2); }
        return;
      }
      const label = !isNum(list[0]) ? list[0] : "";
      points.push({ x: paste.number(numbers.at(-2)), y: paste.number(numbers.at(-1)), label });
    });
    return noting({ points, xName, yName }, paste);
  };

  // The header of a study table: Part, then Standard (optional), then a column per appraiser and trial ("Anna 1",
  // "Anna 2", "B3"): the trailing number is the trial, the rest the name.
  const columnsOf = (head) => head.slice(1).map((cell, j) => {
    const text = String(cell ?? "").trim();
    if (STANDARD.test(text)) return { kind: "standard", col: j + 1 };
    const match = text.match(/^(.*?)[\s_\-#.:]*(\d+)$/);
    const name = (match && match[1].trim()) || text || `#${j + 1}`;
    return { kind: "rating", col: j + 1, name };
  });
  const studyTable = (text) => {
    const paste = pasteOf(text);
    const rows = paste.rows.map((cells) => cells.map((cell) => String(cell ?? "").trim())).filter((cells) => cells.some(Boolean));
    if (rows.length < 3) return null;
    const [head, ...body] = rows;
    return noting({ head, body, columns: columnsOf(head), number: paste.number }, paste);
  };

  // Attribute agreement: judgements are words (good / bad, OK / damaged), matched without regard to case.
  const parseAttribute = (text) => {
    const table = studyTable(text);
    if (!table) return null;
    const standardCol = table.columns.find((column) => column.kind === "standard");
    const ratingCols = table.columns.filter((column) => column.kind === "rating");
    const names = [...new Set(ratingCols.map((column) => column.name))];
    if (!names.length) return null;
    const labels = {};
    const norm = (cell) => {
      const value = String(cell ?? "").trim();
      if (!value) return null;
      const key = value.toLocaleLowerCase();
      if (!(key in labels)) labels[key] = value;
      return key;
    };
    const parts = [], standard = [];
    const ratings = names.map((name) => ratingCols.filter((column) => column.name === name).map(() => []));
    let skipped = 0;
    table.body.forEach((cells) => {
      // The standard first: its spelling is the one a result shows.
      const known = standardCol ? norm(cells[standardCol.col]) : null;
      const values = ratingCols.map((column) => norm(cells[column.col]));
      if (values.some((value) => value === null) || (standardCol && known === null)) { skipped++; return; }
      parts.push(cells[0] || String(parts.length + 1));
      if (standardCol) standard.push(known);
      names.forEach((name, a) => {
        ratingCols.filter((column) => column.name === name).forEach((column, trial) => ratings[a][trial].push(values[ratingCols.indexOf(column)]));
      });
    });
    return { parts, names, standard: standardCol ? standard : null, ratings, labels, skipped };
  };

  // Gage R&R data: wide (Part, then "Anna 1", "Anna 2" …; a part may also come back on later rows for more trials) or
  // long (three columns: part, operator, value). Returns y[part][operator][trial], or an error word.
  const parseGage = (text) => {
    const table = studyTable(text);
    if (!table) return { error: "need" };
    const ratingCols = table.columns.filter((column) => column.kind === "rating");
    const repeated = new Set(ratingCols.map((column) => column.name)).size < ratingCols.length;
    const distinct = new Set(table.body.map((cells) => cells[1])).size;
    const long = !repeated && table.head.length === 3 && distinct <= Math.max(1, table.body.length / 3);
    const parts = [], operators = [];
    const cells = new Map();
    let skipped = 0;
    const put = (part, operator, value) => {
      if (!parts.includes(part)) parts.push(part);
      if (!operators.includes(operator)) operators.push(operator);
      const key = `${part}\u0000${operator}`;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(value);
    };
    table.body.forEach((row) => {
      const part = row[0] || "";
      if (long) {
        const value = table.number(row[2]);
        if (!part || !row[1] || !Number.isFinite(value)) { skipped++; return; }
        put(part, row[1], value);
        return;
      }
      const values = ratingCols.map((column) => table.number(row[column.col]));
      if (!part || values.some((value) => !Number.isFinite(value))) { skipped++; return; }
      ratingCols.forEach((column, i) => put(part, column.name, values[i]));
    });
    if (parts.length < 2 || !operators.length) return { error: "need" };
    const y = parts.map((part) => operators.map((operator) => cells.get(`${part}\u0000${operator}`) || []));
    const trials = y[0][0].length;
    if (trials < 2 || y.some((row) => row.some((cell) => cell.length !== trials))) return { error: "unbalanced", parts, operators };
    return noting({ parts, operators, trials, y, long, skipped }, table);
  };

  // Did the level change between the first phase and the last? Welch's t on the single values of a measurement chart,
  // two proportions for np, and for counts the two rates against the pooled one (a normal approximation of Poisson).
  const phaseTest = (kind, rows, chart) => {
    const S = window.StatsKit;
    if (!chart || chart.phases.length < 2) return null;
    const first = chart.phases[0], last = chart.phases.at(-1);
    const slice = (phase) => rows.slice(phase.from, phase.to + 1);
    if (kind === "imr" || kind === "xbar") {
      const values = (phase) => slice(phase).flatMap((row) => (kind === "imr" ? [row.value] : row.values));
      const test = S.welch(values(first), values(last));
      return test ? { p: test.p, verdict: verdictOf(test.p) } : null;
    }
    const total = (phase, key) => slice(phase).reduce((sum, row) => sum + (key === "rows" ? 1 : Number(row[key])), 0);
    if (kind === "np") {
      const test = S.twoProportion(total(first, "count"), total(first, "size"), total(last, "count"), total(last, "size"));
      return test ? { p: test.p, verdict: verdictOf(test.p) } : null;
    }
    const c1 = total(first, "count"), c2 = total(last, "count");
    const n1 = total(first, kind === "u" ? "size" : "rows"), n2 = total(last, kind === "u" ? "size" : "rows");
    const pooled = (c1 + c2) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 / n1 + 1 / n2));
    const p = se > 0 ? 2 * (1 - S.normalCdf(Math.abs(c2 / n2 - c1 / n1) / se)) : 1;
    return { p, verdict: verdictOf(p) };
  };

  // An example as pasted text: cells joined by tabs, dates moved to recent weeks and shown in the page's format,
  // numbers with the page's decimal mark and the decimals they were written with.
  const exampleText = (header, rows) => {
    const K = kit();
    const body = K.recentExample(rows).map((row) => String(row).split("|").map((cell) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(cell)) return K.showDate(cell);
      if (/^-?\d+(\.\d+)?$/.test(cell)) return K.num(Number(cell), decimals([cell]));
      return cell;
    }).join("\t"));
    return [...(header && header.length ? [header.join("\t")] : []), ...body].join("\n");
  };

  window.ProcessLab2Math = { fill, cellsOf, parseChartRows, parseTable, parseXY, parseAttribute, parseGage, phaseTest, exampleText, decimals, verdictOf };

  const dataEl = document.getElementById("process-lab-data");
  const root = document.querySelector("[data-process-lab]");
  if (!dataEl || !root || !root.querySelector("[data-lab]") || !window.ToolKit || !window.StatsKit || !window.ChartKit) return;

  const { tx, num, pct, int, lower, showDate, dayMonth, write, isObject, str, loadState, el, parseNumber, panel, stat, resultActions, resultLayout, downloadCsv, downloadXlsx, firstVisit } = window.ToolKit;
  const S = window.StatsKit;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const lab = data.lab;
  const KEY = lab.storageKey;
  const dayLabel = dayMonth(false);
  const BUCKETS = ["chart", "chi", "reg", "attr", "gage"];
  const state = loadState(KEY, { chart: {}, chi: {}, reg: {}, attr: {}, gage: {} });
  BUCKETS.forEach((name) => { if (!isObject(state[name])) state[name] = {}; });
  const save = () => write(KEY, state);

  // Numbers and p-values in the page's format.
  const n2 = (value, digits) => (Number.isFinite(value) ? num(value, digits) : "–");
  const pText = (p) => (!Number.isFinite(p) ? "–" : p < 0.001 ? `< ${num(0.001, 3)}` : num(p, 3));
  const pEq = (p) => (Number.isFinite(p) && p < 0.001 ? `p ${pText(p)}` : `p = ${pText(p)}`);
  const oneIn = (p) => {
    if (!(p > 0) || p >= 0.1) return null;
    const raw = 1 / p;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    return Math.round(raw / magnitude) * magnitude;
  };
  // Beyond 1 in 10,000 a bigger number says nothing more.
  const chanceText = (p) => { const n = oneIn(p); return n ? fill(data.proportion.oneInWords, { n: int.format(Math.min(n, 10000)) }) : pct(p, 0); };
  const signed = (value, digits, unit = "") => `${value > 0 ? "+" : ""}${n2(value, digits)}${unit ? ` ${unit}` : ""}`;
  const hint = (text) => el("p", "form-note pl-hint", text);
  // A decimal mark the paste leaves open is said above the result (process-lab.js, decimalNote).
  const decimalHint = (sec, parsed) => { const note = window.ProcessLabMath.decimalNote(parsed?.ambiguous); if (note) sec.out.append(hint(note)); };
  const verdictCard = (text, kind, words) => {
    const card = el("div", `pl-verdict-card is-${kind}`);
    card.append(el("strong", null, words[kind]), " ", text);
    return card;
  };
  const testWords = () => ({ real: tx("Real difference"), borderline: tx("Probably real"), noise: tx("Could be noise") });
  const tableOf = (headers, rows, className = "") => {
    const table = el("table", `dl-table pl-table ${className}`.trim());
    const thead = el("thead");
    const headRow = el("tr");
    headers.forEach((text) => headRow.append(el("th", null, text)));
    thead.append(headRow);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach((cell, i) => {
        const node = typeof cell === "object" && cell !== null ? cell : { text: cell };
        const td = el(i === 0 ? "th" : "td", node.className || (i ? "num" : null), node.text ?? "");
        if (i === 0) td.scope = "row";
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(thead, tbody);
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    wrap.append(table);
    return wrap;
  };

  // A control chart with limits that step: every point carries its own centre and limits (a u-chart's follow the
  // sample size, a new phase gets new ones), and a dashed line marks where a phase starts.
  const stepChart = (points, options = {}) => {
    const { svgEl, C } = CK;
    const W = 640, H = 300, left = 52, right = 70, top = 30, bottom = 44;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": options.title || "", class: "ck-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    if (options.title) svg.append(svgEl("title", {}, options.title));
    const reach = points.flatMap((point) => [point.y, point.ucl, point.lcl, point.center]).filter(Number.isFinite);
    if (!reach.length) return svg;
    let min = Math.min(...reach), max = Math.max(...reach);
    const pad = (max - min || 1) * 0.08;
    min = options.floor !== undefined ? Math.max(options.floor, min - pad) : min - pad;
    max += pad;
    const format = options.format || ((value) => n2(value, 1));
    const plotW = W - left - right, plotH = H - top - bottom;
    const n = points.length;
    const x = (i) => left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
    const y = (value) => top + plotH - ((value - min) / (max - min || 1)) * plotH;
    const tip = (node, text) => { if (text) node.setAttribute("data-tip", text); node.classList.add("ck-hit"); return node; };
    CK.ticks(min, max, 4).forEach((value) => {
      svg.append(svgEl("line", { x1: left, x2: left + plotW, y1: y(value), y2: y(value), stroke: C.grid }));
      svg.append(svgEl("text", { x: left - 8, y: y(value) + 4, "text-anchor": "end", "font-size": 12, fill: C.muted }, format(value)));
    });
    // Each limit runs half way to the neighbours on both sides, so a change between two points is a clean step.
    const step = (key) => {
      let d = "";
      points.forEach((point, i) => {
        const value = point[key];
        if (!Number.isFinite(value)) return;
        const x0 = i ? (x(i - 1) + x(i)) / 2 : x(i);
        const x1 = i < n - 1 ? (x(i) + x(i + 1)) / 2 : x(i);
        const joined = i && Number.isFinite(points[i - 1][key]) && points[i - 1].phase === point.phase;
        d += `${joined ? "L" : "M"}${x0.toFixed(1)} ${y(value).toFixed(1)} L${x1.toFixed(1)} ${y(value).toFixed(1)} `;
      });
      return d.trim();
    };
    [["ucl", C.danger, "4 4"], ["lcl", C.danger, "4 4"], ["center", C.muted, ""]].forEach(([key, color, dash]) => {
      const d = step(key);
      if (d) svg.append(svgEl("path", { d, fill: "none", stroke: color, "stroke-width": 1.5, "stroke-dasharray": dash, "pointer-events": "none" }));
    });
    const last = points.at(-1);
    [["UCL", last.ucl, C.danger], [options.centerLabel || "CL", last.center, C.muted], ["LCL", last.lcl, C.danger]].forEach(([label, value, color]) => {
      if (Number.isFinite(value)) svg.append(svgEl("text", { x: left + plotW + 6, y: y(value) + 4, "font-size": 11, "font-weight": 700, fill: color }, `${label} ${format(value)}`));
    });
    (options.phaseStarts || []).forEach((start, i) => {
      const at = (x(start - 1) + x(start)) / 2;
      svg.append(svgEl("line", { x1: at, x2: at, y1: top - 6, y2: top + plotH, stroke: C.target, "stroke-width": 1.5, "stroke-dasharray": "6 4", "pointer-events": "none" }));
      // The label reads away from the edge it is nearest to.
      const right = at > left + plotW / 2;
      svg.append(svgEl("text", { x: right ? at - 4 : at + 4, y: top - 10, "text-anchor": right ? "end" : "start", "font-size": 11, "font-weight": 700, fill: C.target }, options.phaseLabels?.[i] || ""));
    });
    const every = Math.ceil(n / 8);
    points.forEach((point, i) => { if (i % every === 0 || i === n - 1) svg.append(svgEl("text", { x: x(i), y: top + plotH + 18, "text-anchor": "middle", "font-size": 11, fill: C.text }, String(point.x).slice(0, 10))); });
    let d = "";
    points.forEach((point, i) => { if (Number.isFinite(point.y)) d += `${d && Number.isFinite(points[i - 1]?.y) ? "L" : "M"}${x(i).toFixed(1)} ${y(point.y).toFixed(1)} `; });
    if (d) svg.append(svgEl("path", { d: d.trim(), fill: "none", stroke: C.blue, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    points.forEach((point, i) => {
      if (!Number.isFinite(point.y)) return;
      svg.append(tip(svgEl("circle", { cx: x(i), cy: y(point.y), r: point.state ? 6 : 4, fill: point.state ? CK.stateColor(point.state) : C.blue, stroke: C.paper, "stroke-width": 1.5 }), point.tip));
    });
    if (options.unit) svg.append(svgEl("text", { x: left, y: 14, "font-size": 12, fill: C.muted }, options.unit));
    return svg;
  };

  // Each section: its box, its fields, its output, its example button and the note that an example is showing.
  const sections = {};
  BUCKETS.forEach((name) => {
    const box = root.querySelector(`[data-lab="${name}"]`);
    if (!box) return;
    const note = el("div", "dl-example-note pl-example-note");
    note.setAttribute("role", "status");
    const clear = el("button", "button-ghost", tx("Clear the example"));
    clear.type = "button";
    note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Paste your own data and it disappears, or clear it now.")), " ", clear);
    note.hidden = true;
    box.prepend(note);
    sections[name] = {
      box, note, clear,
      fields: [...box.querySelectorAll("[data-field]")],
      out: box.querySelector("[data-out]"),
      empty: box.querySelector("[data-empty]"),
      count: box.querySelector("[data-count]"),
      status: box.querySelector("[data-status]"),
      example: box.querySelector("[data-lab-example]"),
    };
  });

  const kinds = lab.kinds;
  const kindOf = (id) => kinds.find((kind) => kind.id === id) || kinds.find((kind) => kind.id === "xbar") || kinds[0];
  const chartLabel = (kind, chart) => (kind === "xbar" ? `Xbar-${chart?.spread || "R"}` : kind === "imr" ? "I-MR" : kind);

  // 4 · Control charts ---------------------------------------------------------------------------------------------
  const ruleOf = (id) => data.rules.find((rule) => rule.id === id);
  const renderChart = () => {
    const sec = sections.chart;
    if (!sec) return;
    const b = state.chart;
    const kind = kindOf(b.kind);
    sec.box.querySelectorAll("[data-kind]").forEach((radio) => { radio.checked = radio.value === kind.id; });
    sec.box.querySelector("[data-kind-help]").textContent = kind.help;
    const textarea = sec.box.querySelector("textarea[name='text']");
    textarea.placeholder = kind.placeholder;
    const parsed = parseChartRows(b.text, kind.id);
    const rows = parsed.rows;
    const labelOf = (row, i) => (row.date ? dayLabel(new Date(`${row.date}T00:00:00Z`)) : row.label || String(i + 1));
    const longLabel = (row, i) => (row.date ? showDate(row.date) : row.label || String(i + 1));
    // The split: any row that leaves at least two on each side.
    const select = sec.box.querySelector("select[name='split']");
    const options = [["", tx("No split")]];
    for (let i = 2; i <= rows.length - 2; i++) options.push([String(i + 1), `${tx("Row {n}", { n: i + 1 })} · ${longLabel(rows[i], i)}`]);
    select.replaceChildren(...options.map(([value, text]) => { const option = el("option", null, text); option.value = value; return option; }));
    select.value = options.some(([value]) => value === str(b.split)) ? str(b.split) : "";
    select.disabled = kind.id === "p";
    sec.count.textContent = rows.length ? `${tx("{n} rows", { n: int.format(rows.length) })}${parsed.skipped ? ` · ${fill(lab.chart.skipped, { n: parsed.skipped, need: lab.chart.need[kind.id] })}` : ""}` : "";
    sec.empty.hidden = Boolean(str(b.text).trim());
    sec.out.replaceChildren();
    decimalHint(sec, parsed);
    if (kind.id === "p") { renderP(sec, rows, b); return; }
    if (rows.length < 2) {
      if (str(b.text).trim()) sec.out.append(hint(fill(lab.chart.needRows, { need: lab.chart.need[kind.id] })));
      return;
    }
    const split = Number(select.value);
    const chart = S.controlChart(kind.id, rows, { phases: split ? [split - 1] : [] });
    if (!chart) { sec.out.append(hint(fill(lab.chart.needRows, { need: lab.chart.need[kind.id] }))); return; }
    const name = str(b.name).trim() || kind.measure;
    const unit = str(b.unit).trim();
    const label = chartLabel(kind.id, chart);
    const raw = kind.id === "imr" ? rows.map((row) => row.value) : kind.id === "xbar" ? rows.flatMap((row) => row.values) : [];
    const d = kind.id === "u" ? 3 : kind.id === "c" || kind.id === "np" ? 1 : decimals(raw) + 1;
    const fmt = (value) => n2(value, d);
    const withUnit = (value) => `${fmt(value)}${unit ? ` ${unit}` : ""}`;
    const phases = chart.phases;
    const current = phases.at(-1);
    const test = phaseTest(kind.id, rows, chart);
    const eventText = (event) => {
      const rule = ruleOf(event.rule);
      const rising = event.rule === 3 && chart.points[event.to].y > chart.points[event.from].y;
      return fill(rule.signal, { n: event.rule === 1 ? event.from + 1 : event.to - event.from + 1, value: withUnit(chart.points[event.from].y), from: event.from + 1, to: event.to + 1, direction: rising ? data.directions.up : data.directions.down });
    };

    // The words: signals, the spread chart, phases, sizes.
    const lines = [chart.events.length ? fill(lab.chart.signals, { count: chart.events.length }) : fill(lab.chart.stable, { n: int.format(rows.length) })];
    if (rows.length < 20) lines.push(lab.chart.short);
    const notes = [];
    if (chart.secondEvents.length) notes.push(fill(lab.chart.spread, { chart: chart.spread, count: chart.secondEvents.length }));
    let phaseText = "";
    if (phases.length > 1) {
      const first = phases[0];
      const level = (phase) => (kind.id === "np" ? pct(phase.rate, 1) : withUnit(phase.center));
      const change = kind.id === "np" ? (current.rate - first.rate) / (first.rate || 1) : (current.center - first.center) / (Math.abs(first.center) || 1);
      const verdict = test ? fill(lab.chart.phaseVerdicts[test.verdict], { p: pEq(test.p) }) : "";
      phaseText = fill(lab.chart.phaseLevel, { label: longLabel(rows[current.from], current.from), before: level(first), after: level(current), change: `${change > 0 ? "+" : ""}${pct(change, 0)}`, verdict });
      if (kind.id === "imr" || kind.id === "xbar") phaseText += ` ${fill(lab.chart.phaseSpread, { before: fmt(first.sigma), after: fmt(current.sigma), change: `${current.sigma > first.sigma ? "+" : ""}${pct((current.sigma - first.sigma) / (first.sigma || 1), 0)}` })}`;
      else phaseText += ` ${lab.chart.phaseCounts}`;
    }
    const sizes = kind.id === "xbar" ? rows.map((row) => row.values.length) : kind.id === "np" ? rows.map((row) => row.size) : [];
    if (sizes.length && Math.min(...sizes) !== Math.max(...sizes)) notes.push(fill(kind.id === "np" ? lab.chart.npVarying : lab.chart.sizes, { min: int.format(Math.min(...sizes)), max: int.format(Math.max(...sizes)) }));
    if (parsed.skipped) notes.push(fill(lab.chart.skipped, { n: parsed.skipped, need: lab.chart.need[kind.id] }));

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("{chart} chart", { chart: label })} · ${name}`));
    const title = el("h2");
    const titleText = chart.events.length ? tx("Signals to investigate") : tx("Stable: this is noise");
    const [lead, ...rest] = titleText.split(": ");
    title.append(lead, rest.length ? ": " : "");
    if (rest.length) title.append(el("span", null, rest.join(": ")));
    head.append(title);

    const stats = el("div", "dl-stats");
    const span = rows[0].date && rows.at(-1).date ? `${showDate(rows[0].date)} – ${showDate(rows.at(-1).date)}` : kind.id === "xbar" ? tx("groups of {n}", { n: n2(chart.subgroup, 0) }) : "";
    stats.append(stat(kind.id === "xbar" ? tx("Groups") : tx("Points"), int.format(rows.length), span));
    stats.append(stat(tx("Centre line"), kind.id === "np" ? n2(current.center, 2) : withUnit(current.center), kind.id === "np" ? `${pct(current.rate, 1)} · n ${n2(rows.at(-1).size, 0)}` : phases.length > 1 ? tx("after the change") : kind.id === "u" ? tx("per unit") : ""));
    stats.append(stat(tx("Control limits"), `${fmt(current.lcl)} – ${fmt(current.ucl)}`, kind.id === "u" ? tx("for the last sample's size") : kind.id === "imr" || kind.id === "xbar" ? `σ ${fmt(current.sigma)}` : ""));
    stats.append(stat(tx("Signals"), String(chart.events.length + chart.secondEvents.length), chart.events.length ? [...new Set(chart.events.map((event) => ruleOf(event.rule).name))].join(", ") : chart.secondEvents.length ? tx("{chart} chart", { chart: chart.spread }) : tx("nothing to chase")));
    if (phases.length > 1) {
      const first = phases[0];
      const change = kind.id === "np" ? (current.rate - first.rate) / (first.rate || 1) : (current.center - first.center) / (Math.abs(first.center) || 1);
      stats.append(stat(tx("Change"), `${change > 0 ? "+" : ""}${pct(change, 0)}`, test ? pEq(test.p) : ""));
    }

    const card = el("article", "result-card dl-focus pl-card");
    card.append(el("p", "result-label", tx("What it says")), el("p", "pl-verdict", lines.join(" ")));
    if (chart.events.length) {
      const list = el("ul", "pl-signals");
      chart.events.forEach((event) => {
        const item = el("li");
        item.append(el("strong", null, `${ruleOf(event.rule).name}. `), eventText(event), " ", el("span", "pl-signal-why", ruleOf(event.rule).text));
        list.append(item);
      });
      card.append(list);
    }
    if (phaseText) card.append(el("p", "result-label", tx("Before / after the change")), el("p", null, phaseText));
    notes.forEach((text) => card.append(el("p", "dl-warning", text)));

    const summary = () => {
      const out = [`${tx("Process Lab")} · ${tx("{chart} chart", { chart: label })} · ${name} | Stiven Catalyst`, ""];
      out.push(`${tx("Centre line")} ${withUnit(current.center)} · ${tx("Control limits")} ${fmt(current.lcl)} – ${fmt(current.ucl)}`);
      out.push("", lines.join(" "));
      chart.events.forEach((event) => out.push(`- ${ruleOf(event.rule).name}: ${eventText(event)}`));
      if (phaseText) out.push("", phaseText);
      notes.forEach((text) => out.push(text));
      return out.join("\n");
    };
    const problem = chart.events.length ? `${name}: ${eventText(chart.events[0])}` : chart.secondEvents.length ? `${name}: ${fill(lab.chart.spread, { chart: chart.spread, count: chart.secondEvents.length })}` : `${name}: ${lines[0]}`;
    const actions = resultActions(summary, problem);
    if ((chart.events.length || chart.secondEvents.length) && window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add the signal to actions"), () => ({
        title: problem,
        detail: `${chart.events.length ? ruleOf(chart.events[0].rule).text : ""} ${tx("Control limits")}: ${fmt(current.lcl)} – ${fmt(current.ucl)}${unit ? ` ${unit}` : ""}.`.trim(),
        source: "process-lab",
        check: tx("The chart shows no new signal in the next 20 measurements."),
        priority: chart.events.some((event) => event.rule === 1) ? "High" : "Medium",
      })));
    }
    const exportRows = () => [
      [tx("Point"), tx("Date"), name, tx("Centre line"), "LCL", "UCL", ...(chart.second ? [chart.spread, `${chart.spread} UCL`] : []), tx("Phase"), tx("Signal")],
      ...chart.points.map((point, i) => [i + 1, rows[i].date || rows[i].label, Number(point.y.toFixed(5)), Number(point.center.toFixed(5)), Number(point.lcl.toFixed(5)), Number(point.ucl.toFixed(5)),
        ...(chart.second ? [Number.isFinite(chart.second[i].y) ? Number(chart.second[i].y.toFixed(5)) : "", Number(chart.second[i].ucl.toFixed(5))] : []), point.phase + 1,
        [...chart.signals[i], ...(chart.secondSignals[i].length ? [chart.spread] : [])].map((rule) => (typeof rule === "number" ? ruleOf(rule).name : rule)).join(", ")]),
    ];
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(lab.csv, exportRows()));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(lab.csv, exportRows()));
    actions.append(csv, xlsx);

    const phaseStarts = phases.slice(1).map((phase) => phase.from);
    const phaseLabels = phases.slice(1).map((phase) => `${tx("Phase {n}", { n: phase.index + 1 })} · ${longLabel(rows[phase.from], phase.from)}`);
    const main = panel(tx("{chart} chart", { chart: kind.id === "xbar" ? "Xbar" : kind.id === "imr" ? "I" : kind.id }), kind.id === "u" ? tx("Defects per unit with limits for each sample's size. Points in the alert colour break a Nelson rule; point at one for its numbers.") : tx("Each point in order with its control limits; a new phase starts new limits. Points in the alert colour break a Nelson rule; point at one for its numbers."));
    const mainPoints = chart.points.map((point, i) => ({
      x: labelOf(rows[i], i), y: point.y, center: point.center, ucl: point.ucl, lcl: point.lcl, phase: point.phase,
      state: chart.signals[i].length ? "danger" : undefined,
      tip: `${longLabel(rows[i], i)}: ${withUnit(point.y)}${kind.id === "u" || kind.id === "np" ? ` (${n2(rows[i].count, 0)} / ${n2(rows[i].size, 0)})` : ""}\nLCL ${fmt(point.lcl)} · UCL ${fmt(point.ucl)}${chart.signals[i].length ? `\n${chart.signals[i].map((rule) => ruleOf(rule).name).join(", ")}` : ""}`,
    }));
    main.append(CK.figure(stepChart(mainPoints, { title: `${tx("{chart} chart", { chart: label })} · ${name}`, unit: kind.id === "u" ? tx("per unit") : unit, format: fmt, centerLabel: kind.id === "xbar" ? "X̿" : "CL", phaseStarts, phaseLabels, floor: kind.id === "imr" || kind.id === "xbar" ? undefined : 0 }), { fileName: `${lab.csv}-${kind.id}` }));
    const panels = [];
    if (chart.second) {
      const second = panel(tx("{chart} chart", { chart: chart.spread }), chart.spread === "MR" ? tx("The distance between neighbours. A range above its limit means a jump between two measurements.") : tx("The spread inside each group. A point above its limit means that group was mixed or disturbed."));
      const secondPoints = chart.second.map((point, i) => ({
        x: labelOf(rows[i], i), y: point.y, center: point.center, ucl: point.ucl, lcl: point.lcl, phase: point.phase,
        state: chart.secondSignals[i].length ? "danger" : undefined,
        tip: Number.isFinite(point.y) ? `${longLabel(rows[i], i)}: ${chart.spread} ${fmt(point.y)}\nUCL ${fmt(point.ucl)}` : "",
      }));
      second.append(CK.figure(stepChart(secondPoints, { title: `${tx("{chart} chart", { chart: chart.spread })} · ${name}`, unit, format: fmt, centerLabel: chart.spread === "S" ? "s̄" : chart.spread === "R" ? "R̄" : "MR̄", phaseStarts, phaseLabels, floor: 0 }), { fileName: `${lab.csv}-${chart.spread.toLowerCase()}` }));
      panels.push(second);
    }
    if (phases.length > 1 || kind.id !== "imr") {
      const limits = panel(tx("Limits by phase"), tx("Centre line, limits and spread of each phase."));
      limits.append(tableOf([tx("Phase"), tx("Rows"), tx("Centre line"), "LCL", "UCL", kind.id === "imr" || kind.id === "xbar" ? tx("σ within") : tx("Rate")], phases.map((phase) => [
        `${phase.index + 1} · ${longLabel(rows[phase.from], phase.from)}`, int.format(phase.count), fmt(phase.center), fmt(phase.lcl), fmt(phase.ucl),
        kind.id === "imr" || kind.id === "xbar" ? fmt(phase.sigma) : kind.id === "np" ? pct(phase.rate, 1) : fmt(phase.center),
      ])));
      panels.push(limits);
    }
    resultLayout(sec.out, { head, stats, notes: [main], focus: card, actions, panels });
  };

  // p: the Sigma & Control Chart draws it; this page hands the dated rows over.
  const renderP = (sec, rows, b) => {
    const box = el("div", "result-card pl-card");
    box.append(el("p", "result-label", tx("p chart")), el("p", null, lab.chart.pNote));
    const dated = rows.filter((row) => row.date);
    const link = el("a", "button-primary", tx("Open in the Sigma & Control Chart"));
    link.href = new URL("../sigma-control-chart/", window.location.href).href;
    if (dated.length) {
      link.addEventListener("click", () => {
        try { sessionStorage.setItem("sc-sigma-handoff", JSON.stringify({ source: "process-lab", metric: str(b.name).trim() || kindOf("p").measure, unit: "", rows: dated.map((row) => ({ date: row.date, n: row.size, d: row.count })) })); } catch { /* the chart opens as it was */ }
      });
      box.append(el("p", "form-note", tx("{n} dated rows go with it.", { n: int.format(dated.length) })));
    } else if (rows.length) box.append(el("p", "dl-warning", lab.chart.pNoDates));
    const actions = el("div", "tool-actions");
    actions.append(link);
    box.append(actions);
    sec.out.append(box);
  };

  // 5 · Chi-square -------------------------------------------------------------------------------------------------
  const renderChi = () => {
    const sec = sections.chi;
    if (!sec) return;
    const b = state.chi;
    sec.empty.hidden = Boolean(str(b.text).trim());
    sec.out.replaceChildren();
    if (!str(b.text).trim()) return;
    const parsed = parseTable(b.text);
    decimalHint(sec, parsed);
    const test = parsed && !parsed.bad ? S.chiSquare(parsed.counts) : null;
    if (!test) { sec.out.append(hint(lab.chi.need)); return; }
    const rowLabels = test.kept.rows.map((i) => parsed.rowLabels[i]);
    const colLabels = test.kept.cols.map((j) => parsed.colLabels[j]);
    const kind = verdictOf(test.p);
    // The cell furthest above what independence expects: where to look first.
    let top = { i: 0, j: 0, value: -Infinity };
    test.residuals.forEach((row, i) => row.forEach((value, j) => { if (value > top.value) top = { i, j, value }; }));
    const cellVars = { row: rowLabels[top.i], col: colLabels[top.j], obs: int.format(test.observed[top.i][top.j]), exp: n2(test.expected[top.i][top.j], 1) };
    const text = fill(lab.chi[kind], { p: pEq(test.p), chance: chanceText(test.p), total: int.format(test.total), ...cellVars });
    const strength = test.cramersV < 0.1 ? "weak" : test.cramersV < 0.3 ? "moderate" : "strong";

    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat("χ²", n2(test.chi2, 2), tx("{df} degrees of freedom", { df: test.df })));
    stats.append(stat("p", pText(test.p), testWords()[kind]));
    stats.append(stat("Cramér's V", n2(test.cramersV, 2), lab.chi.strength[strength]));
    stats.append(stat(tx("Total counted"), int.format(test.total), tx("{r} rows × {c} columns", { r: rowLabels.length, c: colLabels.length })));
    sec.out.append(stats, verdictCard(text, kind, testWords()));
    if (test.lowCells) sec.out.append(el("p", "dl-warning", fill(lab.chi.low, { n: test.lowCells, cells: test.expected.flat().length, min: n2(test.minExpected, 1) })));

    const tablePanel = panel(tx("Counted and expected"), tx("Each cell: what was counted, and in brackets what would be expected if rows and columns had nothing to do with each other. ▲ and ▼ mark cells well above or below that (more than 2 standardized residuals)."));
    const mark = (value) => (value > 2 ? " ▲" : value < -2 ? " ▼" : "");
    tablePanel.append(tableOf([parsed.rowName || "", ...colLabels, tx("Total")], [
      ...rowLabels.map((label, i) => [label, ...test.observed[i].map((value, j) => ({ text: `${int.format(value)} (${n2(test.expected[i][j], 1)})${mark(test.residuals[i][j])}`, className: `num${Math.abs(test.residuals[i][j]) > 2 ? " pl-strong" : ""}` })), int.format(test.rowSums[i])]),
      [tx("Total"), ...test.colSums.map((value) => int.format(value)), int.format(test.total)],
    ]));
    const heat = panel(tx("Where the table differs from chance"), tx("Darker blue: more than expected; grey: fewer. Point at a cell for its numbers."));
    const maxRes = Math.max(...test.residuals.flat().map(Math.abs), 1);
    heat.append(CK.figure(CK.heatmap(rowLabels, colLabels, (r, c) => {
      const res = test.residuals[r][c];
      const share = Math.min(1, Math.abs(res) / Math.max(3, maxRes));
      return { text: int.format(test.observed[r][c]), color: res >= 0 ? CK.C.blue : CK.C.muted, opacity: 0.15 + 0.75 * share, textColor: share > 0.45 ? "#ffffff" : CK.C.text, tip: `${rowLabels[r]} · ${colLabels[c]}\n${tx("Counted")} ${int.format(test.observed[r][c])} · ${tx("expected")} ${n2(test.expected[r][c], 1)}\n${tx("Residual")} ${signed(res, 2)}` };
    }, { title: tx("Chi-square"), labelWidth: 120 }), { fileName: `${lab.csv}-chi-square` }));
    const summary = () => [`${tx("Process Lab")} · ${tx("Chi-square")} | Stiven Catalyst`, "", `χ² = ${n2(test.chi2, 2)} · df ${test.df} · ${pEq(test.p)} · Cramér's V ${n2(test.cramersV, 2)}`, "", text, ...(test.lowCells ? [fill(lab.chi.low, { n: test.lowCells, cells: test.expected.flat().length, min: n2(test.minExpected, 1) })] : [])].join("\n");
    const actions = resultActions(summary, fill(lab.chi.problem, cellVars));
    if (kind !== "noise" && window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add to actions"), () => ({
        title: fill(lab.chi.action, cellVars), detail: text, source: "process-lab",
        check: tx("A new count shows no real difference between the rows."), priority: kind === "real" ? "High" : "Medium",
      })));
    }
    sec.out.append(actions, tablePanel, heat);
  };

  // 6 · Regression -------------------------------------------------------------------------------------------------
  const renderReg = () => {
    const sec = sections.reg;
    if (!sec) return;
    const b = state.reg;
    sec.empty.hidden = Boolean(str(b.text).trim());
    sec.out.replaceChildren();
    const parsed = parseXY(b.text);
    if (sec.count) sec.count.textContent = parsed.points.length ? tx("{n} pairs", { n: int.format(parsed.points.length) }) : "";
    if (!str(b.text).trim()) return;
    decimalHint(sec, parsed);
    if (parsed.points.length < 3) { sec.out.append(hint(lab.reg.need)); return; }
    const xs = parsed.points.map((point) => point.x), ys = parsed.points.map((point) => point.y);
    const fit = S.linearFit(xs, ys);
    if (!fit) { sec.out.append(hint(lab.reg.flat)); return; }
    const xName = str(b.x).trim() || parsed.xName || "x";
    const yName = str(b.y).trim() || parsed.yName || "y";
    // Names in the middle of a sentence start small ("changes loading time"), unless they are an acronym (OEE).
    const mid = (text) => (/^\p{Lu}\p{Ll}/u.test(text) ? lower(text) : text);
    const xUnit = str(b.xUnit).trim() || xName;
    const yUnit = str(b.yUnit).trim();
    const d = Math.min(3, decimals(ys) + 1);
    const kind = verdictOf(fit.p);
    const vars = {
      xUnit: mid(xUnit), xName, xMid: mid(xName), yName: mid(yName), yTitle: yName, signed: signed(fit.slope, d + 1, yUnit), low: n2(fit.ci95[0], d + 1), high: n2(fit.ci95[1], d + 1),
      r2: n2(fit.r2, 2), r2pct: pct(fit.r2, 0), rest: pct(1 - fit.r2, 0), p: pEq(fit.p), chance: chanceText(fit.p), sd: `${n2(fit.residualSd, d)}${yUnit ? ` ${yUnit}` : ""}`,
    };
    const text = [fill(lab.reg.sentence, vars), fill(lab.reg.r2, vars), fill(lab.reg[kind], vars), fill(lab.reg.miss, vars)].join(" ");
    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat(tx("Slope"), signed(fit.slope, d + 1, yUnit), `${tx("95% CI")} ${vars.low} – ${vars.high}`));
    stats.append(stat("r²", n2(fit.r2, 2), `r = ${n2(fit.r, 2)}`));
    stats.append(stat("p", pText(fit.p), `t = ${n2(fit.t, 2)} · df ${fit.df}`));
    stats.append(stat(tx("Pairs"), int.format(fit.n), `${tx("Intercept")} ${n2(fit.intercept, d)}`));
    sec.out.append(stats, verdictCard(text, kind, { real: tx("Real link"), borderline: tx("Probably real"), noise: tx("Could be noise") }));
    if (kind === "real") sec.out.append(el("p", "form-note", fill(lab.reg.cause, vars)));
    const plot = panel(tx("Scatter with the fitted line"), tx("Each point is one pair; the dashed line is the least-squares fit. Point at a dot for its values."));
    plot.append(CK.figure(CK.scatter(parsed.points.map((point) => ({ x: point.x, y: point.y, label: point.label })), { title: `${yName} · ${xName}`, xLabel: xName, yLabel: yUnit ? `${yName} (${yUnit})` : yName, fit: { slope: fit.slope, intercept: fit.intercept, r: fit.r } }), { fileName: `${lab.csv}-regression` }));
    const summary = () => [`${tx("Process Lab")} · ${tx("Regression")} · ${yName} | Stiven Catalyst`, "", `${yName} = ${n2(fit.intercept, d)} ${fit.slope >= 0 ? "+" : "−"} ${n2(Math.abs(fit.slope), d + 1)} × ${xName} · r² ${n2(fit.r2, 2)} · ${pEq(fit.p)} · n ${fit.n}`, "", text].join("\n");
    sec.out.append(resultActions(summary, fill(lab.reg.problem, vars)), plot);
  };

  // 7 · Measurement system: attribute agreement --------------------------------------------------------------------
  const renderAttr = () => {
    const sec = sections.attr;
    if (!sec) return;
    const b = state.attr;
    sec.empty.hidden = Boolean(str(b.text).trim());
    sec.out.replaceChildren();
    if (!str(b.text).trim()) return;
    const parsed = parseAttribute(b.text);
    const res = parsed && parsed.parts.length >= 2 ? S.attributeAgreement({ ratings: parsed.ratings, standard: parsed.standard }) : null;
    if (!res) { sec.out.append(hint(lab.attr.need)); return; }
    const word = (key) => parsed.labels[key] ?? key;
    const share = (item) => (item ? `${pct(item.pct, 0)}` : "–");
    const ci = (item) => (item?.ci95 ? `${pct(item.ci95[0], 0)} – ${pct(item.ci95[1], 0)}` : "");
    // The headline kappa: between appraisers when there are several, otherwise the one appraiser against the standard
    // (or with themselves).
    const headline = res.between?.kappa ?? (res.hasStandard ? res.appraisers[0].vsStandard?.kappa : res.appraisers[0].within?.kappa) ?? null;
    const band = S.kappaBand(headline);
    const lines = [];
    if (band !== "none") lines.push(fill(lab.attr.bands[band].text, { kappa: n2(headline, 2) }));
    if (res.hasStandard) {
      const worst = res.appraisers.map((item, a) => ({ ...item, name: parsed.names[a] })).sort((x, y) => x.vsStandard.pct - y.vsStandard.pct)[0];
      const misses = Object.entries(worst.wrong).filter(([, count]) => count > 0).map(([cat, count]) => fill(lab.attr.miss, { n: count, truth: word(cat) }));
      if (worst.vsStandard.mixed) misses.push(fill(lab.attr.mixed, { n: worst.vsStandard.mixed }));
      if (misses.length) lines.push(fill(lab.attr.worst, { name: worst.name, pct: share(worst.vsStandard), misses: misses.join(", ") }));
    } else lines.push(lab.attr.noStandard);
    if (parsed.skipped) lines.push(fill(lab.attr.skipped, { n: parsed.skipped }));
    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat(res.between ? tx("Fleiss' kappa") : "Kappa", n2(headline, 2), band !== "none" ? lab.attr.bands[band].label : ""));
    if (res.between) stats.append(stat(tx("Between appraisers"), share(res.between), tx("parts judged the same by everyone")));
    if (res.allVsStandard) stats.append(stat(tx("All vs the standard"), share(res.allVsStandard), tx("parts everyone got right every time")));
    stats.append(stat(tx("Study"), `${int.format(res.parts)} × ${int.format(parsed.names.length)}`, tx("parts × appraisers, {t} trials", { t: int.format(res.appraisers[0].trials) })));
    const kindOfBand = band === "excellent" ? "real" : band === "good" ? "borderline" : "noise";
    const card = el("div", `pl-verdict-card is-${kindOfBand}`);
    card.append(el("strong", null, band !== "none" ? lab.attr.bands[band].label : "–"), " ", lines.join(" "));
    sec.out.append(stats, card);

    const tablePanel = panel(tx("Agreement by appraiser"), tx("Within: the parts an appraiser judged the same in every trial. Against the standard: the same and right every time. 95% intervals are exact (Clopper–Pearson); kappa 0.9 and above is excellent, 0.75 to 0.9 good, below 0.75 needs work."));
    const rows = res.appraisers.map((item, a) => [parsed.names[a], item.within ? `${share(item.within)} (${ci(item.within)})` : "–", n2(item.within?.kappa, 2), item.vsStandard ? `${share(item.vsStandard)} (${ci(item.vsStandard)})` : "–", n2(item.vsStandard?.kappa, 2)]);
    if (res.between) rows.push([tx("All appraisers"), `${share(res.between)} (${ci(res.between)})`, n2(res.between.kappa, 2), res.allVsStandard ? `${share(res.allVsStandard)} (${ci(res.allVsStandard)})` : "–", n2(res.allVsStandard?.kappa, 2)]);
    tablePanel.append(tableOf([tx("Appraiser"), tx("Within"), "Kappa", tx("Against the standard"), "Kappa"], rows));
    const chartPanel = panel(res.hasStandard ? tx("Right every time, by appraiser") : tx("Consistent every time, by appraiser"), tx("The share of parts per appraiser; columns in the alert colour are below 90 %."));
    const items = res.appraisers.map((item, a) => {
      const value = (res.hasStandard ? item.vsStandard.pct : item.within?.pct ?? 0) * 100;
      return { label: parsed.names[a], value, tip: `${parsed.names[a]}: ${pct(value / 100, 0)}${item.within ? `\n${tx("Within")} ${share(item.within)} · kappa ${n2(item.within.kappa, 2)}` : ""}` };
    });
    chartPanel.append(CK.figure(CK.bars(items, { title: chartPanel.querySelector(".result-label").textContent, unit: "%", yMax: 100, format: (value) => n2(value, 0), labels: true, target: 90, targetLabel: "90 %", highlight: (item) => item.value < 90 }), { fileName: `${lab.csv}-agreement` }));
    const summary = () => [`${tx("Process Lab")} · ${tx("Attribute agreement")} | Stiven Catalyst`, "", ...rows.map((row) => `${row[0]}: ${tx("Within")} ${row[1]} · kappa ${row[2]} · ${tx("Against the standard")} ${row[3]} · kappa ${row[4]}`), "", lines.join(" ")].join("\n");
    const actions = resultActions(summary, fill(lab.attr.problem, { kappa: n2(headline, 2) }));
    if (band !== "excellent" && band !== "none" && window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add to actions"), () => ({
        title: fill(lab.attr.action, { kappa: n2(headline, 2) }), detail: lines.join(" "), source: "process-lab",
        check: tx("A new attribute study shows kappa 0.9 or higher."), priority: band === "poor" ? "High" : "Medium",
      })));
    }
    sec.out.append(actions, chartPanel, tablePanel);
  };

  // 7 · Measurement system: Gage R&R -------------------------------------------------------------------------------
  const renderGage = () => {
    const sec = sections.gage;
    if (!sec) return;
    const b = state.gage;
    sec.empty.hidden = Boolean(str(b.text).trim());
    sec.out.replaceChildren();
    if (!str(b.text).trim()) return;
    const parsed = parseGage(b.text);
    decimalHint(sec, parsed);
    if (parsed.error) { sec.out.append(hint(lab.gage[parsed.error] || lab.gage.need)); return; }
    const tolerance = parseNumber(b.tol);
    const g = S.gageRR(parsed.y, { tolerance });
    if (!g) { sec.out.append(hint(lab.gage.need)); return; }
    const name = str(b.name).trim() || tx("Measurement");
    const unit = str(b.unit).trim();
    const c = g.components;
    const band = S.gageBand(c.grr.pctStudy);
    const pc = (value) => (Number.isFinite(value) ? pct(value, 1) : "–");
    const d = Math.min(4, decimals(parsed.y.flat(2)) + 2);
    const lines = [fill(lab.gage.bands[band].text, { pct: pc(c.grr.pctStudy) })];
    if (c.grr.variance > 0) lines.push(c.repeatability.variance >= c.reproducibility.variance ? fill(lab.gage.repeat, { pct: pc(c.repeatability.pctStudy) }) : fill(lab.gage.reprod, { pct: pc(c.reproducibility.pctStudy) }));
    if (g.ndc !== null) lines.push(fill(g.ndc >= 5 ? lab.gage.ndc : lab.gage.ndcLow, { ndc: g.ndc }));
    if (g.operators > 1) lines.push(fill(g.pooled ? lab.gage.pooled : lab.gage.interaction, { p: pEq(g.pInteraction) }));
    if (g.tolerance) lines.push(fill(lab.gage.tolerance, { tol: `${n2(g.tolerance, decimals([g.tolerance]))}${unit ? ` ${unit}` : ""}`, pct: pc(c.grr.pctTolerance) }));
    if (parsed.skipped) lines.push(fill(lab.attr.skipped, { n: parsed.skipped }));
    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat(tx("Total Gage R&R"), pc(c.grr.pctStudy), lab.gage.bands[band].label));
    stats.append(stat(tx("Distinct categories"), g.ndc === null ? "–" : String(g.ndc), tx("5 or more needed")));
    stats.append(stat(tx("Repeatability"), pc(c.repeatability.pctStudy), tx("the gauge")));
    stats.append(stat(tx("Reproducibility"), pc(c.reproducibility.pctStudy), tx("the operators")));
    stats.append(stat(tx("Part-to-part"), pc(c.part.pctStudy), tx("{p} parts × {o} operators × {r} trials", { p: g.parts, o: g.operators, r: g.trials })));
    const kind = band === "good" ? "real" : band === "depends" ? "borderline" : "noise";
    const card = el("div", `pl-verdict-card is-${kind}`);
    card.append(el("strong", null, lab.gage.bands[band].label), " ", lines.join(" "));
    sec.out.append(stats, card);

    const names = [[tx("Total Gage R&R"), c.grr], [tx("Repeatability"), c.repeatability], [tx("Reproducibility"), c.reproducibility], [tx("Part-to-part"), c.part]];
    const barsPanel = panel(tx("Components of variation"), tx("% study variation of each component (its sd against the total sd). The line is 30 %, the limit for an acceptable system; 10 % and below is good."));
    barsPanel.append(CK.figure(CK.bars(names.map(([label, item]) => ({ label, value: item.pctStudy * 100, tip: `${label}\n% ${tx("study variation")} ${pc(item.pctStudy)} · % ${tx("contribution")} ${pc(item.pctContribution)}\nsd ${n2(item.sd, d)}${unit ? ` ${unit}` : ""}` })), { title: tx("Components of variation"), unit: "%", yMax: 100, format: (value) => n2(value, 1), labels: true, target: 30, targetLabel: "30 %", highlight: (item) => item.label !== tx("Part-to-part") && item.value > 30 }), { fileName: `${lab.csv}-gage-rr` }));
    const tablePanel = panel(tx("Gage R&R table"), tx("Standard deviation, study variation (6 sd) and the shares of each source."));
    const rowsOf = [...names.slice(0, 3), ...(g.operators > 1 ? [[`  ${tx("Operator")}`, c.operator], [`  ${tx("Part × operator")}`, c.interaction]] : []), names[3], [tx("Total variation"), c.total]];
    tablePanel.append(tableOf([tx("Source of variation"), "sd", `${tx("Study var")} (6 sd)`, `% ${tx("study var")}`, `% ${tx("contribution")}`, ...(g.tolerance ? [`% ${tx("tolerance")}`] : [])], rowsOf.map(([label, item]) => [label, n2(item.sd, d), n2(item.studyVar, d), pc(item.pctStudy), pc(item.pctContribution), ...(g.tolerance ? [pc(item.pctTolerance)] : [])])));
    const sourceName = { part: tx("Part"), operator: tx("Operator"), interaction: tx("Part × operator"), repeatability: tx("Repeatability"), total: tx("Total") };
    const anovaPanel = panel(tx("ANOVA table"), g.pooled && g.operators > 1 ? tx("Two-way ANOVA without the interaction, which was not significant.") : tx("Two-way ANOVA with the part × operator interaction."));
    anovaPanel.append(tableOf([tx("Source of variation"), "df", "SS", "MS", "F", "p"], g.anova.map((row) => [sourceName[row.source], String(row.df), n2(row.ss, 4), n2(row.ms, 5), n2(row.f, 2), row.p === null ? "" : pText(row.p)])));
    const linesPanel = panel(tx("Part averages by operator"), tx("One line per operator. Lines on top of each other mean the operators agree; lines that cross mean they measure some parts differently."));
    linesPanel.append(CK.figure(CK.line(parsed.operators.map((operator, j) => ({ label: operator, points: parsed.parts.map((part, i) => ({ x: part, y: g.cellMeans[i][j], tip: `${tx("Part")} ${part} · ${operator}: ${n2(g.cellMeans[i][j], d)}${unit ? ` ${unit}` : ""}` })) })), { title: tx("Part averages by operator"), unit, format: (value) => n2(value, Math.max(1, d - 2)), yMin: Math.min(...g.cellMeans.flat()) - 0.1 * (Math.max(...g.cellMeans.flat()) - Math.min(...g.cellMeans.flat()) || 1), yMax: Math.max(...g.cellMeans.flat()) + 0.1 * (Math.max(...g.cellMeans.flat()) - Math.min(...g.cellMeans.flat()) || 1) }), { fileName: `${lab.csv}-gage-parts` }));
    const boxPanel = panel(tx("Measurements by operator"), tx("All measurements of each operator. A box higher or lower than the others is an operator who reads differently."));
    boxPanel.append(CK.figure(CK.box(parsed.operators.map((operator, j) => ({ label: operator, values: parsed.y.flatMap((part) => part[j]) })), { title: tx("Measurements by operator"), unit, format: (value) => n2(value, Math.max(1, d - 2)) }), { fileName: `${lab.csv}-gage-operators` }));
    const summary = () => [`${tx("Process Lab")} · ${tx("Gage R&R")} · ${name} | Stiven Catalyst`, "", ...rowsOf.map(([label, item]) => `${label.trim()}: sd ${n2(item.sd, d)} · % ${tx("study var")} ${pc(item.pctStudy)} · % ${tx("contribution")} ${pc(item.pctContribution)}`), `ndc ${g.ndc ?? "–"}`, "", lines.join(" ")].join("\n");
    const actions = resultActions(summary, fill(lab.gage.problem, { name, pct: pc(c.grr.pctStudy) }));
    if (band !== "good" && window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add to actions"), () => ({
        title: fill(lab.gage.action, { name, pct: pc(c.grr.pctStudy) }), detail: lines.slice(0, 2).join(" "), source: "process-lab",
        check: tx("A new Gage R&R shows under 10 % of the study variation (at most 30 %)."), priority: band === "bad" ? "High" : "Medium",
      })));
    }
    sec.out.append(actions, barsPanel, linesPanel, tablePanel, anovaPanel, boxPanel);
  };

  const renders = { chart: renderChart, chi: renderChi, reg: renderReg, attr: renderAttr, gage: renderGage };

  // Examples: each section has its own, all loaded on a first visit. The control chart example follows the chosen
  // kind of data, so the chooser shows each chart with data that fits it.
  const ex = lab.examples;
  const chartExample = (kind) => {
    const source = kind === "imr" ? { name: data.example.name, unit: data.example.unit, header: [], rows: data.example.rows } : ex[kind === "p" ? "np" : kind];
    return { kind, text: exampleText(source.header, source.rows), name: source.name, unit: source.unit, split: source.split ? String(source.split) : "", example: true };
  };
  const examples = {
    chart: () => chartExample(state.chart.kind && kinds.some((kind) => kind.id === state.chart.kind) ? state.chart.kind : "xbar"),
    chi: () => ({ text: exampleText(ex.chi.header, ex.chi.rows), example: true }),
    reg: () => ({ text: exampleText(ex.reg.header, ex.reg.rows), x: ex.reg.x, y: ex.reg.y, xUnit: ex.reg.xUnit, yUnit: ex.reg.yUnit, example: true }),
    attr: () => ({ text: exampleText(ex.attr.header, ex.attr.rows), example: true }),
    gage: () => ({ text: exampleText(ex.gage.header, ex.gage.rows), name: ex.gage.name, unit: ex.gage.unit, tol: ex.gage.tol, example: true }),
  };
  const showFields = (name) => {
    const sec = sections[name];
    if (!sec) return;
    sec.fields.forEach((input) => { if (input.tagName !== "SELECT") input.value = str(state[name][input.name]); });
    sec.note.hidden = !state[name].example;
  };
  const render = (name) => {
    showFields(name);
    renders[name]();
  };

  Object.entries(sections).forEach(([name, sec]) => {
    sec.fields.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
      state[name][input.name] = input.value;
      // Typing over the example makes it the visitor's own work.
      if (input.name === "text") state[name].example = false;
      save();
      sec.note.hidden = !state[name].example;
      renders[name]();
    }));
    sec.example?.addEventListener("click", () => {
      state[name] = examples[name]();
      save();
      render(name);
      sec.out.scrollIntoView?.({ behavior: "smooth", block: "start" });
    });
    sec.clear.addEventListener("click", () => {
      state[name] = name === "chart" ? { kind: state.chart.kind } : {};
      save();
      render(name);
    });
  });
  // The chooser: a new kind of data. While the example shows, the example of that kind replaces it.
  sections.chart?.box.querySelectorAll("[data-kind]").forEach((radio) => radio.addEventListener("change", () => {
    if (!radio.checked) return;
    state.chart = state.chart.example ? chartExample(radio.value) : { ...state.chart, kind: radio.value, split: "" };
    save();
    render("chart");
  }));

  // A first visit opens every section on its example; nothing is written until the visitor acts.
  if (firstVisit(KEY)) BUCKETS.forEach((name) => { if (sections[name]) state[name] = examples[name](); });
  BUCKETS.forEach((name) => { if (sections[name]) render(name); });
})();
