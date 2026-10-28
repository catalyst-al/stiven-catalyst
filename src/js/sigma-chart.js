(() => {
  // Days handed over by Damage Control, Incomplete Control or Delay Analyzer ("Open as control chart"), without the
  // page (tests/pulse-tools.test.cjs uses it too). given: { metric, unit, rows: [{ date, n, d }] }; current: the chart as
  // it is. Gives the rows that can be points (d defects out of n handled, on a date) and whether they are added to the
  // chart (the same metric and unit, and a chart that has days) or replace it.
  const takeOver = (given, current) => {
    const kit = window.ToolKit;
    const rows = given.rows.filter(kit.isObject)
      .map((row) => ({ date: kit.parseDate(row.date), n: Math.round(Number(row.n)), d: Math.round(Number(row.d)), note: "" }))
      .filter((row) => row.date && row.n > 0 && row.d >= 0 && row.d <= row.n);
    const same = (a, b) => kit.str(a).trim().toLowerCase() === kit.str(b).trim().toLowerCase();
    return { rows, merge: current.rows.length > 0 && same(current.metric, given.metric) && same(current.unit, given.unit) };
  };
  // The days of the log as weeks, each from its Monday: handled and defects add up and the notes are joined, so the
  // weekly chart is a p-chart of the week (a week with more handled gets narrower limits).
  const byWeek = (rows) => {
    const weeks = new Map();
    rows.forEach((row) => {
      const key = window.ToolKit.mondayOf(row.date);
      const week = weeks.get(key) || { date: key, n: 0, d: 0, notes: [] };
      week.n += row.n;
      week.d += row.d;
      if (row.note && !week.notes.includes(row.note)) week.notes.push(row.note);
      weeks.set(key, week);
    });
    return [...weeks.values()].sort((a, b) => a.date.localeCompare(b.date)).map(({ notes, ...week }) => ({ ...week, note: notes.join("; ") }));
  };
  // The limits of one point: three standard errors around the centre line, for the n of that point.
  const limitsFor = (n, centre) => {
    const spread = 3 * Math.sqrt((centre * (1 - centre)) / n);
    return { ucl: centre + spread, lcl: Math.max(0, centre - spread) };
  };
  // Phases: the chart split at changes on the timeline. rows are in date order; each cut is the first date of a new
  // phase (a cut on or before the first row, or after the last, splits nothing). Each phase has its own centre line, its
  // defects over its handled, so the level before a change does not blur the level after it.
  const phases = (rows, cuts = []) => {
    const starts = [...new Set(cuts.map((cut) => rows.findIndex((row) => row.date >= cut)).filter((index) => index > 0))].sort((a, b) => a - b);
    return [0, ...starts].map((start, k, all) => {
      const end = all[k + 1] ?? rows.length;
      const part = rows.slice(start, end);
      const n = part.reduce((sum, row) => sum + row.n, 0);
      const d = part.reduce((sum, row) => sum + row.d, 0);
      return { start, end, from: part[0]?.date ?? "", to: part.at(-1)?.date ?? "", n, d, pBar: n ? d / n : 0 };
    });
  };
  // The three signal rules on points that share one centre line: a point beyond a limit; eight or more in a row on one
  // side of the centre line; six in a row each higher (or lower) than the one before (the turning point of one trend is
  // the first point of the next). points: [{ p, ucl, lcl }]. Gives [{ rule, worse, from, to }], from and to being the
  // indices of the first and last point of the signal.
  const signalRules = (points, centre) => {
    const found = [];
    points.forEach((point, i) => {
      if (point.p > point.ucl) found.push({ rule: "beyond", worse: true, from: i, to: i });
      else if (point.lcl > 0 && point.p < point.lcl) found.push({ rule: "beyond", worse: false, from: i, to: i });
    });
    const side = (point) => Math.sign(point.p - centre);
    let from = 0;
    for (let i = 1; i <= points.length; i++) {
      if (i < points.length && side(points[i - 1]) !== 0 && side(points[i - 1]) === side(points[i])) continue;
      if (i - from >= 8 && side(points[from]) !== 0) found.push({ rule: "run", worse: side(points[from]) > 0, from, to: i - 1 });
      from = i;
    }
    const step = (a, b) => Math.sign(b.p - a.p);
    let start = 0;
    for (let i = 1; i <= points.length; i++) {
      const s = i < points.length ? step(points[i - 1], points[i]) : 0;
      const before = i - 1 > start ? step(points[i - 2], points[i - 1]) : null;
      if (s !== 0 && (before === null || before === s)) continue;
      if (i - start >= 6) found.push({ rule: "trend", worse: step(points[start], points[start + 1]) > 0, from: start, to: i - 1 });
      start = s !== 0 ? i - 1 : i;
    }
    return found;
  };
  // How the level moved at each split: the centre line before and after, and the change as a share of before.
  const levelChanges = (parts) => parts.slice(1).map((part, k) => ({
    at: part.from, before: parts[k].pBar, after: part.pBar, change: parts[k].pBar > 0 ? (part.pBar - parts[k].pBar) / parts[k].pBar : null,
  }));
  window.SigmaMath = { takeOver, byWeek, limitsFor, phases, signalRules, levelChanges };

  const dataEl = document.getElementById("sigma-chart-data");
  if (!dataEl || !window.ToolKit) return;

  const {
    DECIMAL_COMMA, tx, num, showDate, dayMonth, lower,
    read, write, isObject, str, loadState, el, int, pct, plural, today,
    parseNumber, parseDate, parseRows, sigma, sigmaText,
    panel, stat, resultActions, flash, undoNote, downloadCsv, downloadXlsx, LOG_LIMIT, shownNote, renderOnPause, recentExample, firstVisit, exampleStamp, exampleMatches, exampleNote } = window.ToolKit;

  const data = JSON.parse(dataEl.textContent);
  const SVG = "http://www.w3.org/2000/svg";
  const svg = (tag, attrs = {}) => {
    const node = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };
  const dayLabel = dayMonth(false);
  const shortDate = (iso) => (iso ? dayLabel(new Date(`${iso}T00:00:00Z`)) : "-");
  const rate = (value, digits = 2) => pct(value, digits);
  const days = (count) => plural(count, tx("day"), tx("days"));
  const direction = (worse) => (worse ? tx("worse") : tx("better"));

  // 1 · Calculator ----------------------------------------------------------
  const calcSigma = document.querySelector("[data-calc-sigma]");
  const calcPerfect = document.querySelector("[data-calc-perfect]");
  const sigmaOut = document.querySelector("[data-sigma-out]");
  const perfectOut = document.querySelector("[data-perfect-out]");
  const sigmaTable = document.querySelector("[data-sigma-table]");
  const CALC_KEY = `${data.storageKey}-calc`;
  const savedCalc = read(CALC_KEY, {});
  const calcState = isObject(savedCalc) ? savedCalc : {};

  const hint = (text) => el("p", "form-note sc-hint", text);

  // How far a sigma level can be trusted. d defects of n chances: the 95 % range of the defect rate (Wilson's score
  // interval) as sigma levels; when it spans more than half a sigma, the level is a rough figure and the note says how
  // rough. No defect at all: the level the data can prove (the rule of three) and no higher. null: a firm figure.
  const wilson = (d, n, z = 1.96) => {
    const p = d / n, z2 = z * z, scale = 1 + z2 / n;
    const centre = (p + z2 / (2 * n)) / scale;
    const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / scale;
    return [Math.max(0, centre - half), Math.min(1, centre + half)];
  };
  const sigmaCaveat = (d, n, unitText = "") => {
    if (!(n > 0)) return null;
    if (d <= 0) return tx("no defect in {n}: the data can show this level and no higher (95% confidence, rule of three). Collect more to show more.", { n: `${int.format(n)}${unitText ? ` ${unitText}` : ""}` });
    const [low, high] = wilson(d, n);
    if (sigma(low) - sigma(high) <= 0.5) return null;
    return tx("a rough figure: with {n} chances the level could be anywhere from {low} to {high} (95% range)", { n: int.format(n), low: num(sigma(high), 2), high: num(sigma(low), 2) });
  };

  // dpmo: the process's defects per million chances, or null.
  const renderTable = (dpmo) => {
    sigmaTable.replaceChildren();
    // Mark the highest level the current process reaches, read on the DPMO column the table shows: 233 DPMO is
    // 5.0 sigma there, although the exact level of 233 is 4.9993 (5.0 sigma is 232.6 DPMO).
    const reached = dpmo == null ? null : [...data.sigmaTable].reverse().find((row) => dpmo <= row.dpmo + 1e-9);
    data.sigmaTable.forEach((row) => {
      const tr = el("tr");
      if (row === reached) tr.classList.add("is-current");
      const level = el("th", null, num(row.sigma, 1));
      level.scope = "row";
      if (row === reached) level.append(el("span", "dl-tag", tx("You")));
      tr.append(level);
      tr.append(el("td", "num", row.dpmo < 10 ? num(row.dpmo, 1) : int.format(row.dpmo)));
      tr.append(el("td", "num", pct(1 - row.dpmo / 1e6, row.dpmo < 100 ? 4 : 2)));
      tr.append(el("td", "num", num(row.dpmo / 1000, row.dpmo < 1000 ? 3 : 1)));
      sigmaTable.append(tr);
    });
  };

  const renderSigma = () => {
    const units = parseNumber(calcSigma.elements.units.value);
    const defects = parseNumber(calcSigma.elements.defects.value);
    const opportunities = Math.max(1, Math.round(parseNumber(calcSigma.elements.opportunities.value)) || 1);
    sigmaOut.replaceChildren();
    if (!(units > 0) || !(defects >= 0)) {
      sigmaOut.append(hint(tx("Enter units and defects to see the sigma level.")));
      renderTable(null);
      return null;
    }
    const chances = units * opportunities;
    if (defects > chances) {
      sigmaOut.append(hint(tx("There are more defects than chances. Check the numbers or the chances per unit.")));
      renderTable(null);
      return null;
    }
    const value = defects / chances;
    sigmaOut.append(
      stat(tx("Defect rate"), rate(value), tx("{a} of {b}", { a: int.format(defects), b: int.format(chances) })),
      stat("DPMO", int.format(Math.round(value * 1e6)), tx("defects per million chances")),
      stat(tx("Yield"), rate(1 - value), tx("right first time")),
      stat(tx("Sigma level"), sigmaText(value, chances), defects ? (sigmaCaveat(defects, chances) || tx("short term, with 1.5 shift")) : tx("no defect in this sample: the least it can be, with 95% confidence (rule of three)")),
    );
    renderTable(value * 1e6);
    return value;
  };

  const renderPerfect = () => {
    const typed = [["On time", "onTime"], ["Undamaged", "undamaged"], ["Complete", "complete"]]
      .map(([label, name]) => ({ label: tx(label), raw: calcPerfect.elements[name].value.trim(), value: parseNumber(calcPerfect.elements[name].value) / 100 }))
      .filter((part) => part.raw);
    // A box with 120 or -5 is named, not left out without a word; one measure alone is not a perfect delivery.
    const parts = typed.filter((part) => part.value >= 0 && part.value <= 1);
    const outside = typed.filter((part) => !parts.includes(part));
    perfectOut.replaceChildren();
    if (outside.length) perfectOut.append(hint(tx("A percentage is between 0 and 100. Check: {fields}.", { fields: outside.map((part) => part.label).join(", ") })));
    if (parts.length < 2) {
      perfectOut.append(hint(tx("Enter at least two of the three percentages.")));
      return;
    }
    const perfect = parts.reduce((product, part) => product * part.value, 1);
    const weakest = [...parts].sort((a, b) => a.value - b.value)[0];
    perfectOut.append(
      stat(tx("Perfect delivery"), rate(perfect), parts.length < 3 ? tx("from {n} of 3 measures", { n: parts.length }) : tx("on time, undamaged and complete")),
      stat(tx("Fail at least once"), num(1000 * (1 - perfect), 1), tx("per 1,000 deliveries")),
      stat(tx("Sigma level"), sigmaText(1 - perfect), tx("of the whole delivery")),
      stat(tx("Weakest link"), weakest.label, tx("{pct} fail here", { pct: rate(1 - weakest.value) })),
    );
  };

  [calcSigma, calcPerfect].forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
    form.querySelectorAll("[data-calc]").forEach((input) => {
      if (typeof calcState[input.name] === "string") input.value = calcState[input.name];
      input.addEventListener("input", () => {
        calcState[input.name] = input.value;
        write(CALC_KEY, calcState);
        if (form === calcSigma) renderSigma();
        else renderPerfect();
      });
    });
  });
  renderSigma();
  renderPerfect();

  // 2 · Control chart (p-chart) ----------------------------------------------
  const root = document.querySelector("[data-control-chart]");
  const entry = root.querySelector("[data-entry]");
  const logBody = root.querySelector("[data-log]");
  const logWrap = root.querySelector("[data-log-wrap]");
  const logEmpty = root.querySelector("[data-log-empty]");
  const logCount = root.querySelector("[data-log-count]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const importStatus = root.querySelector("[data-import-status]");
  const pasteArea = root.querySelector("#cc-paste");
  const results = document.querySelector("[data-results]");
  const KEY = data.storageKey;

  const state = loadState(KEY, { metric: "", unit: "", baseline: "", grain: "day", rows: [], example: {}, splits: [] });
  if (state.grain !== "week") state.grain = "day";
  state.splits = state.splits.filter((id) => typeof id === "string");
  state.rows = state.rows.filter(isObject)
    .map((row) => ({ date: parseDate(row.date), n: Math.round(Number(row.n)), d: Math.round(Number(row.d)), note: str(row.note) }))
    .filter((row) => row.date && row.n > 0 && row.d >= 0 && row.d <= row.n);
  const save = () => write(KEY, state);
  // The chart is by day, or by week (the days added up from each Monday). The log below it is always by day.
  const weekly = () => state.grain === "week";
  const chartRows = () => (weekly() ? byWeek(state.rows) : state.rows);
  const periods = (count) => (weekly() ? plural(count, tx("week"), tx("weeks")) : days(count));
  const metric = () => state.metric.trim() || tx("Defects");
  const unit = () => state.unit.trim() || tx("Handled");

  // One row per date: a new value for a date replaces the old one.
  const upsert = (rows) => {
    const byDate = new Map(state.rows.map((row) => [row.date, row]));
    rows.forEach((row) => byDate.set(row.date, row));
    state.rows = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  };

  const importRows = (text) => {
    const added = [];
    let skipped = 0;
    parseRows(text).forEach((cells, index) => {
      const [date, n, d] = cells;
      const note = cells.slice(cells.length >= 9 ? 8 : 3);
      const row = { date: parseDate(date), n: Math.round(parseNumber(n)), d: Math.round(parseNumber(d)), note: note.join(", ").trim() };
      if (!row.date || !(row.n > 0) || !(row.d >= 0) || row.d > row.n) {
        if (index > 0) skipped++;
        return;
      }
      added.push(row);
    });
    return { added, skipped };
  };

  // Changes on the timeline (js/annotations.js) inside the chart: the first point on or after each is where a phase
  // can start. By week, the week of the change is the first week of the new phase.
  const Annotations = window.Annotations || null;
  const SLUG = Annotations ? Annotations.slugHere() : "";
  const changesIn = (rows) => {
    if (!Annotations || rows.length < 2) return [];
    const last = weekly() ? window.ToolKit.addDays(rows.at(-1).date, 6) : rows.at(-1).date;
    return Annotations.list(rows[0].date, last, SLUG).map((item) => {
      const cut = weekly() ? window.ToolKit.mondayOf(item.date) : item.date;
      const index = rows.findIndex((row) => row.date >= cut);
      // Each side needs two points of its own for a centre line worth the name.
      return { ...item, cut, index, splittable: index >= 2 && rows.length - index >= 2 };
    });
  };
  const splitCuts = (rows) => changesIn(rows).filter((item) => item.splittable && state.splits.includes(item.id)).map((item) => item.cut);

  // Limits, and the three signal rules: over the whole chart (or from its first days), or within each phase when the
  // limits are split at a change.
  const analyse = () => {
    const rows = chartRows();
    const parts = phases(rows, splitCuts(rows));
    const split = parts.length > 1;
    const baseCount = Math.round(parseNumber(state.baseline));
    const useBase = !split && baseCount >= 2 && baseCount < rows.length;
    const base = useBase ? rows.slice(0, baseCount) : rows;
    const pBar = split ? parts.at(-1).pBar : base.reduce((sum, row) => sum + row.d, 0) / base.reduce((sum, row) => sum + row.n, 0);
    // What the centre line (and its sigma level) rests on: the handled and the defects behind it.
    const behind = split ? { n: parts.at(-1).n, d: parts.at(-1).d } : { n: base.reduce((sum, row) => sum + row.n, 0), d: base.reduce((sum, row) => sum + row.d, 0) };

    const points = rows.map((row, index) => {
      const phase = split ? parts.findIndex((part) => index >= part.start && index < part.end) : 0;
      const centre = split ? parts[phase].pBar : pBar;
      return { ...row, index, p: row.d / row.n, phase, centre, ...limitsFor(row.n, centre), signals: [] };
    });

    const found = split
      ? parts.flatMap((part) => signalRules(points.slice(part.start, part.end), part.pBar).map((item) => ({ ...item, from: item.from + part.start, to: item.to + part.start })))
      : signalRules(points, pBar);
    const events = found.map((item) => {
      const from = points[item.from];
      const to = points[item.to];
      const length = item.to - item.from + 1;
      points.slice(item.from, item.to + 1).forEach((point) => point.signals.push({ rule: item.rule, worse: item.worse }));
      const text = item.rule === "beyond"
        ? (item.worse ? tx("{rate} is above the upper limit of {limit}.", { rate: rate(from.p), limit: rate(from.ucl) }) : tx("{rate} is below the lower limit of {limit}.", { rate: rate(from.p), limit: rate(from.lcl) }))
        : item.rule === "run"
          ? (weekly()
            ? tx(item.worse ? "{n} weeks in a row above the centre line." : "{n} weeks in a row below the centre line.", { n: length })
            : tx(item.worse ? "{n} days in a row above the centre line." : "{n} days in a row below the centre line.", { n: length }))
          // Six points make five rises: "5 days in a row each higher than the one before".
          : (weekly()
            ? tx(item.worse ? "{n} weeks in a row each higher than the one before." : "{n} weeks in a row each lower than the one before.", { n: length - 1 })
            : tx(item.worse ? "{n} days in a row each higher than the one before." : "{n} days in a row each lower than the one before.", { n: length - 1 }));
      return { rule: item.rule, worse: item.worse, from, to, text };
    });
    events.sort((a, b) => a.from.index - b.from.index);

    const total = rows.reduce((sum, row) => sum + row.d, 0) / rows.reduce((sum, row) => sum + row.n, 0);
    const after = useBase ? rows.slice(baseCount) : [];
    const afterRate = after.length ? after.reduce((sum, row) => sum + row.d, 0) / after.reduce((sum, row) => sum + row.n, 0) : null;
    return { points, events, pBar, behind, total, useBase, baseCount, afterRate, phases: split ? parts : null, changes: split ? levelChanges(parts) : [] };
  };
  // The sigma level of the centre line, with the n behind it: no defect in 250 is "≥ 3.76" (rule of three), not "6+".
  const levelOf = (result) => sigmaText(result.pBar, result.behind.n);
  const levelNote = (result) => sigmaCaveat(result.behind.d, result.behind.n, lower(unit()));
  // "From 12 Oct the level moved from 0.57% to 0.42% (−26%)."
  const levelText = (change) => tx("From {date} the level moved from {before} to {after} ({change}).", {
    date: shortDate(change.at), before: rate(change.before), after: rate(change.after),
    change: change.change === null ? "–" : window.ToolKit.changeText ? window.ToolKit.changeText(change.change) : pct(change.change, 0),
  });

  const ruleName = (rule) => data.rules.find((item) => item.id === rule).name;
  const signalText = (point) => point.signals.map((s) => `${ruleName(s.rule)} (${direction(s.worse)})`).join(", ");
  const span = (event) => (event.from === event.to ? shortDate(event.from.date) : `${shortDate(event.from.date)} – ${shortDate(event.to.date)}`);

  // Round the axis to clean steps.
  const niceMax = (value) => {
    const raw = value / 4;
    const power = 10 ** Math.floor(Math.log10(raw));
    const stepSize = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw);
    return { step: stepSize, max: Math.ceil(value / stepSize) * stepSize };
  };

  const chart = (result, width) => {
    const { points, pBar } = result;
    const height = width < 560 ? 260 : 320;
    const m = { top: 18, right: width < 560 ? 44 : 56, bottom: 30, left: 48 };
    const w = width - m.left - m.right;
    const h = height - m.top - m.bottom;
    const peak = Math.max(...points.map((p) => Math.max(p.p, p.ucl)));
    const { step: yStep, max: yMax } = niceMax(peak * 1.08 || 0.01);
    const band = w / points.length;
    const x = (i) => m.left + band * (i + 0.5);
    const y = (v) => m.top + h - (v / yMax) * h;

    const root = svg("svg", { viewBox: `0 0 ${width} ${height}`, width, height, class: "sc-chart", role: "img", "aria-label": weekly() ? tx("Control chart of {metric} rate by week. The table below lists every value.", { metric: lower(metric()) }) : tx("Control chart of {metric} rate by day. The table below lists every value.", { metric: lower(metric()) }) });

    for (let v = 0; v <= yMax + 1e-12; v += yStep) {
      root.append(svg("line", { x1: m.left, x2: m.left + w, y1: y(v), y2: y(v), class: "sc-grid" }));
      const label = svg("text", { x: m.left - 8, y: y(v) + 4, class: "sc-axis", "text-anchor": "end" });
      label.textContent = pct(v, yStep * 100 < 0.1 ? 2 : yStep * 100 < 1 ? 1 : 0);
      root.append(label);
    }
    const every = Math.max(1, Math.ceil(points.length / Math.floor(w / 64)));
    points.forEach((point, i) => {
      if (i % every) return;
      const label = svg("text", { x: x(i), y: height - 8, class: "sc-axis", "text-anchor": "middle" });
      label.textContent = shortDate(point.date);
      root.append(label);
    });

    if (result.useBase) {
      const at = m.left + band * result.baseCount;
      root.append(svg("line", { x1: at, x2: at, y1: m.top, y2: m.top + h, class: "sc-divider" }));
      if (width >= 480) {
        const label = svg("text", { x: at - 6, y: m.top + 12, class: "sc-axis", "text-anchor": "end" });
        label.textContent = tx("Limits from here ←");
        root.append(label);
      }
    }

    // Limits follow each day's volume, so they are drawn as steps.
    const stepPath = (key) => points.map((p, i) => `${i ? "L" : "M"}${m.left + band * i},${y(p[key])}H${m.left + band * (i + 1)}`).join("");
    root.append(svg("path", { d: stepPath("ucl"), class: "sc-limit" }));
    if (points.some((p) => p.lcl > 0)) root.append(svg("path", { d: stepPath("lcl"), class: "sc-limit" }));
    // Split at a change, each phase has its own centre line: a step where the phase begins.
    if (result.phases) {
      root.append(svg("path", { d: stepPath("centre"), class: "sc-center" }));
      result.phases.slice(1).forEach((part) => {
        const at = m.left + band * part.start;
        root.append(svg("line", { x1: at, x2: at, y1: m.top, y2: m.top + h, class: "sc-divider" }));
      });
    } else {
      root.append(svg("line", { x1: m.left, x2: m.left + w, y1: y(pBar), y2: y(pBar), class: "sc-center" }));
    }
    // Changes on the timeline: a dashed line with a flag where the change begins (its text is in the day's tooltip).
    (result.marks || []).forEach((mark) => {
      const at = m.left + band * mark.index;
      root.append(svg("line", { x1: at, x2: at, y1: m.top - 4, y2: m.top + h, class: "sc-event" }));
      root.append(svg("path", { d: `M${at.toFixed(1)},${m.top - 10}h9l-3,4l3,4h-9z`, class: "sc-flag" }));
    });
    const endLabel = (text, value) => {
      const label = svg("text", { x: m.left + w + 6, y: y(value) + 4, class: "sc-axis sc-end" });
      label.textContent = text;
      root.append(label);
    };
    endLabel(tx("UCL"), points.at(-1).ucl);
    endLabel(tx("Avg"), points.at(-1).centre ?? pBar);

    root.append(svg("path", { d: points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.p)}`).join(""), class: "sc-line" }));
    points.forEach((point, i) => {
      const worse = point.signals.some((s) => s.worse);
      const better = point.signals.some((s) => !s.worse);
      const cls = worse ? "sc-dot is-worse" : better ? "sc-dot is-better" : "sc-dot";
      const r = band < 12 ? 3 : 4;
      root.append(svg("circle", { cx: x(i), cy: y(point.p), r: worse || better ? r + 1.5 : r, class: cls }));
      // Label only the days outside the limits.
      if (point.signals.some((s) => s.rule === "beyond")) {
        const label = svg("text", { x: x(i), y: y(point.p) - 12, class: "sc-axis sc-callout", "text-anchor": "middle" });
        label.textContent = rate(point.p);
        root.append(label);
      }
    });

    // Hover: a crosshair that snaps to the nearest day, with one tooltip.
    const cross = svg("line", { y1: m.top, y2: m.top + h, class: "sc-cross", visibility: "hidden" });
    root.append(cross);
    const hit = svg("rect", { x: m.left, y: m.top, width: w, height: h, class: "sc-hit" });
    root.append(hit);
    return { node: root, x, y, band, left: m.left, cross, hit, marks: result.marks || [] };
  };

  const tooltip = el("div", "sc-tooltip");
  tooltip.hidden = true;

  const attachHover = (wrap, drawn, points) => {
    wrap.append(tooltip);
    const show = (event) => {
      const box = drawn.node.getBoundingClientRect();
      const scale = box.width / drawn.node.viewBox.baseVal.width;
      const i = Math.min(points.length - 1, Math.max(0, Math.floor(((event.clientX - box.left) / scale - drawn.left) / drawn.band)));
      const point = points[i];
      drawn.cross.setAttribute("x1", drawn.x(i));
      drawn.cross.setAttribute("x2", drawn.x(i));
      drawn.cross.setAttribute("visibility", "visible");
      tooltip.replaceChildren(
        el("strong", "sc-tip-value", rate(point.p)),
        el("span", "sc-tip-date", weekly() ? tx("Week of {date}", { date: shortDate(point.date) }) : shortDate(point.date)),
        el("span", null, tx("{a} of {b}", { a: int.format(point.d), b: int.format(point.n) })),
        el("span", null, tx("Limits {low} – {high}", { low: rate(point.lcl), high: rate(point.ucl) })),
      );
      if (point.signals.length) tooltip.append(el("span", "sc-tip-signal", signalText(point)));
      if (point.note) tooltip.append(el("span", "sc-tip-note", point.note));
      (drawn.marks || []).filter((mark) => mark.index === i).forEach((mark) => tooltip.append(el("span", "sc-tip-note", `${tx("Change")}: ${showDate(mark.date)} · ${mark.text}`)));
      tooltip.hidden = false;
      const wrapBox = wrap.getBoundingClientRect();
      const left = drawn.x(i) * scale + (box.left - wrapBox.left);
      const flip = left > wrapBox.width * 0.6;
      tooltip.style.left = `${flip ? left - tooltip.offsetWidth - 14 : left + 14}px`;
      tooltip.style.top = `${drawn.y(point.p) * scale + (box.top - wrapBox.top) - 20}px`;
    };
    const hide = () => {
      tooltip.hidden = true;
      drawn.cross.setAttribute("visibility", "hidden");
    };
    drawn.hit.addEventListener("pointermove", show);
    drawn.hit.addEventListener("pointerdown", show);
    drawn.hit.addEventListener("pointerleave", hide);
  };

  const legend = () => {
    const box = el("div", "sc-legend");
    [["sc-key-line", tx("{metric} rate", { metric: metric() })], ["sc-key-center", tx("Average")], ["sc-key-limit", tx("Control limits")], ["sc-key-worse", tx("Signal, worse")], ["sc-key-better", tx("Signal, better")]]
      .forEach(([cls, text]) => {
        const item = el("span", "sc-legend-item");
        item.append(el("span", `sc-key ${cls}`), text);
        box.append(item);
      });
    return box;
  };

  const verdict = (result) => {
    const worse = result.events.some((e) => e.worse);
    // Only a shift (eight or more in a row on the better side) shows a lasting improvement. One point beyond a limit,
    // or a trend, on the better side is a signal to investigate: something was different, not yet a new level.
    const lasting = result.events.some((e) => !e.worse && e.rule === "run");
    const better = result.events.some((e) => !e.worse && e.rule !== "run");
    const parts = [];
    if (!worse && !lasting && !better) parts.push(data.verdicts.stable);
    if (worse) parts.push(data.verdicts.badSpecial);
    if (lasting) parts.push(data.verdicts.goodSpecial);
    else if (better) parts.push(weekly() && data.verdicts.goodSignalWeek ? data.verdicts.goodSignalWeek : data.verdicts.goodSignal);
    if (result.points.length < 12) parts.push(weekly() && data.verdicts.shortWeek ? data.verdicts.shortWeek : data.verdicts.short);
    return { title: worse ? tx("Signals to investigate") : lasting ? tx("A real improvement") : better ? tx("Better than usual: a signal to investigate") : tx("Stable: this is noise"), text: parts.join(" ") };
  };

  const problemText = (result) => {
    const bad = result.events.find((e) => e.worse && e.rule === "beyond") || result.events.find((e) => e.worse);
    if (bad) return `${metric()}, ${span(bad)}: ${bad.text}`;
    return tx("{metric} run at {rate} on average and the process is stable: the level itself comes from the way the work is done.", { metric: metric(), rate: rate(result.pBar) });
  };

  const summaryText = (result) => {
    const v = verdict(result);
    const lines = [`${tx("Control chart")} | Stiven Catalyst`, "", `${tx("{metric} out of {unit}", { metric: metric(), unit: lower(unit()) })}, ${periods(result.points.length)} (${shortDate(result.points[0].date)} – ${shortDate(result.points.at(-1).date)})`];
    if (result.phases) {
      lines.push(`${tx("Limits split at the changes on the timeline")}:`);
      result.phases.forEach((part) => lines.push(`- ${shortDate(part.from)} – ${shortDate(part.to)}: ${tx("Average")} ${rate(part.pBar)}`));
      result.changes.forEach((change) => lines.push(levelText(change)));
      lines.push(`${tx("sigma level")} ${levelOf(result)}${levelNote(result) ? ` (${levelNote(result)})` : ""}`);
    } else {
      lines.push(`${tx("Average")} ${rate(result.pBar)}${result.useBase ? ` ${weekly() ? tx("over the first {n} weeks", { n: result.baseCount }) : tx("over the first {n} days", { n: result.baseCount })}` : ""} · ${tx("sigma level")} ${levelOf(result)}${levelNote(result) ? ` (${levelNote(result)})` : ""}`);
    }
    if (result.afterRate !== null) lines.push(`${tx("Since then")}: ${rate(result.afterRate)}`);
    lines.push("", `${v.title}. ${v.text}`);
    if (result.events.length) {
      lines.push("", `${tx("Signals")}:`);
      result.events.forEach((e) => lines.push(`- ${span(e)}: ${ruleName(e.rule)}, ${direction(e.worse)}. ${e.text}`));
    }
    return lines.join("\n");
  };

  let lastWidth = 0;

  const renderResults = () => {
    results.replaceChildren();
    const shown = chartRows();
    results.hidden = shown.length < 2 && !(weekly() && state.rows.length >= 2);
    if (results.hidden) return;
    if (shown.length < 2) {
      const note = el("article", "result-card dl-focus");
      note.append(el("p", "result-label", tx("Control chart")), el("p", "dl-focus-lede", tx("Add days from at least two different weeks to see the chart by week.")));
      results.append(note);
      return;
    }
    const result = analyse();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Control chart")} · ${metric()}`));
    const v = verdict(result);
    const title = el("h2");
    const [first, ...rest] = v.title.split(": ");
    title.append(first, rest.length ? ": " : "");
    if (rest.length) title.append(el("span", null, rest.join(": ")));
    head.append(title);
    results.append(head);

    const stats = el("div", "dl-stats");
    if (result.phases) {
      // The level since the last change, against the phase before it.
      const now = result.phases.at(-1);
      const change = result.changes.at(-1);
      stats.append(stat(tx("Since the change"), rate(now.pBar), `${periods(now.end - now.start)} · ${tx("from {date}", { date: shortDate(now.from) })}`));
      const prior = result.phases.at(-2);
      stats.append(stat(tx("Before the change"), rate(prior.pBar), change.change === null ? periods(prior.end - prior.start) : `${window.ToolKit.changeText ? window.ToolKit.changeText(change.change) : pct(change.change, 0)} ${tx("since the change")}`));
    } else {
      stats.append(stat(tx("Average rate"), rate(result.pBar), result.useBase ? (weekly() ? tx("first {n} weeks", { n: result.baseCount }) : tx("first {n} days", { n: result.baseCount })) : periods(result.points.length)));
    }
    if (result.afterRate !== null) {
      const change = (result.afterRate - result.pBar) / result.pBar;
      const against = { change: `${change > 0 ? "+" : ""}${pct(change, 0)}`, n: result.baseCount };
      stats.append(stat(tx("Since then"), rate(result.afterRate), weekly() ? tx("{change} against the first {n} weeks", against) : tx("{change} against the first {n} days", against)));
    }
    const last = result.points.at(-1);
    stats.append(stat(weekly() ? tx("Latest week") : tx("Latest day"), rate(last.p), last.signals.length ? signalText(last) : tx("inside the limits, noise")));
    stats.append(stat(tx("Signals"), String(result.events.length), result.events.length ? tx("{a} worse, {b} better", { a: result.events.filter((e) => e.worse).length, b: result.events.filter((e) => !e.worse).length }) : tx("nothing to chase")));
    stats.append(stat(tx("Sigma level"), levelOf(result), levelNote(result) || tx("at the average rate")));
    results.append(stats);

    const chartPanel = weekly()
      ? panel(tx("{metric} rate by week", { metric: metric() }), tx("Out of {unit}. Hover a week for its numbers.", { unit: lower(unit()) }))
      : panel(tx("{metric} rate by day", { metric: metric() }), tx("Out of {unit}. Hover a day for its numbers.", { unit: lower(unit()) }));
    chartPanel.classList.add("sc-chart-panel");
    chartPanel.append(legend());
    const wrap = el("div", "sc-chart-wrap");
    chartPanel.append(wrap);
    results.append(chartPanel);
    lastWidth = wrap.clientWidth;
    const changes = changesIn(chartRows());
    result.marks = changes.filter((item) => item.index >= 0).map((item) => ({ index: item.index, date: item.date, text: item.text }));
    const drawn = chart(result, Math.max(240, lastWidth));
    wrap.append(drawn.node);
    attachHover(wrap, drawn, result.points);
    // Each change inside the chart can split the limits: before and after get their own centre line and limits.
    if (changes.length) {
      const box = el("div", "sc-changes");
      box.append(el("p", "result-label", tx("Changes on the timeline")));
      const list = el("ul", "sc-change-list");
      changes.forEach((item) => {
        const line = el("li");
        line.append(el("strong", "nowrap", showDate(item.date)), " ", el("span", null, item.text), " ");
        if (item.splittable) {
          const on = state.splits.includes(item.id);
          const button = el("button", "button-secondary", on ? tx("Use one set of limits again") : tx("Split the limits at this change"));
          button.type = "button";
          button.dataset.focusKey = `split:${item.id}`;
          button.addEventListener("click", () => {
            state.splits = on ? state.splits.filter((id) => id !== item.id) : [...state.splits, item.id];
            save();
            window.ToolKit.keepFocus ? window.ToolKit.keepFocus(renderResults) : renderResults();
          });
          line.append(button);
        } else {
          line.append(el("span", "form-note", weekly() ? tx("Too close to the edge of the chart to split: each side needs two weeks.") : tx("Too close to the edge of the chart to split: each side needs two days.")));
        }
        list.append(line);
      });
      box.append(list);
      chartPanel.append(box);
    }

    const card = el("article", "result-card dl-focus");
    card.append(el("p", "result-label", tx("What it says")));
    card.append(el("p", "sc-verdict", v.text));
    if (result.phases) {
      result.changes.forEach((change) => card.append(el("p", "sc-verdict", levelText(change))));
      card.append(el("p", "form-note", tx("The limits are split at the change: each phase has its own average and limits, and the signal rules run within each phase.")));
      if (Math.round(parseNumber(state.baseline)) >= 2) card.append(el("p", "form-note", tx("“Limits from the first” is not used while the limits are split.")));
    }
    // A p-chart needs enough per point: with fewer than about five expected per day (week) the limits are so wide
    // that even a day where everything went wrong can sit inside them.
    const sizes = result.points.map((point) => point.n).sort((a, b) => a - b);
    const expected = sizes[Math.floor(sizes.length / 2)] * result.pBar;
    if (expected < 5) card.append(el("p", "dl-warning", weekly()
      ? tx("About {n} {metric} expected per week: with so few, the limits are wide and one week says little on its own. Add more weeks before you judge.", { n: num(expected, 1), metric: lower(metric()) })
      : tx("About {n} {metric} expected per day: with so few, the limits are wide and one day says little on its own. Read the chart by week.", { n: num(expected, 1), metric: lower(metric()) })));
    if (result.events.length) {
      card.append(el("p", "result-label", tx("Signals")));
      const list = el("ul", "sc-signals");
      result.events.forEach((e) => {
        const item = el("li");
        item.append(el("strong", null, `${span(e)} · ${ruleName(e.rule)}, ${direction(e.worse)}. `), e.text);
        const note = [...new Set(result.points.slice(e.from.index, e.to.index + 1).map((p) => p.note).filter(Boolean))].join("; ");
        if (note) item.append(el("span", "sc-signal-note", ` ${tx("Note")}: ${note}`));
        list.append(item);
      });
      card.append(list);
    }
    results.append(card);

    const many = result.points.length > LOG_LIMIT;
    const tablePanel = weekly()
      ? panel(many ? tx("The latest {n} weeks", { n: LOG_LIMIT }) : tx("Every week"), many ? tx("The same numbers as the chart. Download the CSV for every week.") : tx("The same numbers as the chart."))
      : panel(many ? tx("The latest {n} days", { n: LOG_LIMIT }) : tx("Every day"), many ? tx("The same numbers as the chart. Download the CSV for every day.") : tx("The same numbers as the chart."));
    const tableWrap = el("div", "dl-table-wrap");
    tableWrap.tabIndex = 0;
    const table = el("table", "dl-table");
    const thead = el("thead");
    const headRow = el("tr");
    [weekly() ? tx("Week from") : tx("Date"), unit(), metric(), tx("Rate"), tx("Lower"), tx("Upper"), tx("Signal"), tx("Note")].forEach((text, i) => {
      const th = el("th", i && i < 6 ? "num" : null, text);
      th.scope = "col";
      headRow.append(th);
    });
    thead.append(headRow);
    const tbody = el("tbody");
    result.points.slice(-LOG_LIMIT).forEach((point) => {
      const tr = el("tr");
      if (point.signals.length) tr.classList.add("is-signal");
      [shortDate(point.date), int.format(point.n), int.format(point.d), rate(point.p), rate(point.lcl), rate(point.ucl)].forEach((text, i) => tr.append(el("td", i ? "num" : "nowrap", text)));
      tr.append(el("td", null, signalText(point)));
      tr.append(el("td", "dl-note", point.note || ""));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    tableWrap.append(table);
    tablePanel.append(tableWrap);
    results.append(tablePanel);

    results.append(resultActions(() => summaryText(result), problemText(result)));
  };

  const renderLog = () => {
    logBody.replaceChildren();
    [...state.rows].reverse().slice(0, LOG_LIMIT).forEach((row) => {
      const tr = el("tr");
      tr.append(el("td", "nowrap", showDate(row.date)), el("td", "num", int.format(row.n)), el("td", "num", int.format(row.d)), el("td", "num", rate(row.d / row.n)), el("td", "dl-note", row.note || ""));
      const cell = el("td");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = row.date;
      remove.setAttribute("aria-label", tx("Remove {name}", { name: showDate(row.date) }));
      cell.append(remove);
      tr.append(cell);
      logBody.append(tr);
    });
    logWrap.hidden = !state.rows.length;
    logEmpty.hidden = state.rows.length > 0;
    logCount.textContent = state.rows.length ? `${days(state.rows.length)}${shownNote(state.rows.length)}` : "";
  };

  const render = () => {
    note.sync(state);
    renderLog();
    renderResults();
  };

  const renderSetting = renderOnPause(() => {
    save();
    renderResults();
  }, () => state.rows.length);
  // "Limits from the first [ ] days" counts weeks when the chart is by week.
  const baselineUnit = root.querySelector("[data-grain-unit]");
  const syncGrain = () => { if (baselineUnit) baselineUnit.textContent = weekly() ? tx("weeks, optional") : tx("days, optional"); };
  root.querySelectorAll("[data-setting]").forEach((input) => {
    input.value = state[input.name] ?? "";
    input.addEventListener("input", () => {
      const was = state.grain;
      state[input.name] = input.value;
      // The first days (or weeks) that set the limits keep their length in time when the chart changes its grain.
      if (input.name === "grain" && was !== state.grain) {
        const count = Math.round(parseNumber(state.baseline));
        if (count >= 2) state.baseline = weekly() ? (Math.round(count / 7) >= 2 ? String(Math.round(count / 7)) : "") : String(count * 7);
        root.querySelector('[name="baseline"]').value = state.baseline;
      }
      syncGrain();
      renderSetting();
    });
  });
  syncGrain();

  entry.elements.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const row = { date: form.date.value, n: Math.round(parseNumber(form.n.value)), d: Math.round(parseNumber(form.d.value)), note: form.note.value.trim() };
    if (!row.date || !(row.n > 0) || !(row.d >= 0) || row.d > row.n) {
      flash(entryStatus, tx("Check the numbers: defects cannot be more than handled."));
      return;
    }
    leaveExample();
    const replaced = state.rows.some((item) => item.date === row.date);
    upsert([row]);
    save();
    render();
    // Move to the next day, the usual next entry.
    const next = new Date(`${row.date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    form.date.value = next.toISOString().slice(0, 10);
    form.n.value = "";
    form.d.value = "";
    form.note.value = "";
    flash(entryStatus, tx(replaced ? "Replaced {date}: {rate}." : "Added {date}: {rate}.", { date: showDate(row.date), rate: rate(row.d / row.n) }));
    form.n.focus();
  });

  root.querySelector("[data-import]").addEventListener("click", () => {
    const { added, skipped } = importRows(pasteArea.value);
    if (!added.length) {
      flash(importStatus, tx("No rows found. Check the order: date, handled, defects."));
      return;
    }
    leaveExample();
    upsert(added);
    save();
    render();
    pasteArea.value = "";
    flash(importStatus, `${tx("Imported {rows}", { rows: days(added.length) })}${skipped ? tx(", skipped {n} that did not add up", { n: skipped }) : ""}.`);
  });

  logBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    state.rows = state.rows.filter((row) => row.date !== button.dataset.remove);
    save();
    render();
    (logBody.querySelector("[data-remove]") || entry.elements.date).focus();
  });

  const loadExample = () => {
    const { rows, ...settings } = data.example;
    Object.assign(state, settings);
    state.rows = [];
    upsert(importRows(recentExample(rows).map((row) => row.replace(/\|/g, "\t")).join("\n")).added);
    state.example = exampleStamp(state.rows);
    root.querySelectorAll("[data-setting]").forEach((input) => { input.value = state[input.name]; });
  };
  // The example leaves as a whole, its days and its settings, before the visitor's own days go in.
  const dropExample = () => {
    state.rows = [];
    state.example = {};
    state.metric = ""; state.unit = ""; state.baseline = "";
    root.querySelectorAll("[data-setting]").forEach((input) => { input.value = state[input.name]; });
  };
  const leaveExample = () => { if (exampleMatches(state)) dropExample(); };
  const note = exampleNote(results, () => {
    dropExample();
    save();
    render();
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });

  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear all days from the chart?"))) return;
    leaveExample();
    state.rows = [];
    save();
    render();
  });

  // The chart as rows for a file: by week, the file holds the weeks of the chart, from their Mondays. The CSV writes
  // the percentages as text in the page's decimal mark; the Excel workbook gets them as numbers.
  const exportRows = (asNumbers) => {
    const exported = chartRows();
    const result = exported.length > 1 ? analyse() : null;
    return [
      [weekly() ? tx("Week from") : tx("Date"), unit(), metric(), tx("Rate %"), tx("Average %"), tx("Lower limit %"), tx("Upper limit %"), tx("Signal"), tx("Note")],
      ...exported.map((row, i) => {
        const point = result?.points[i];
        const fixed = (value) => (value == null ? "" : asNumbers ? Number((value * 100).toFixed(3)) : (value * 100).toFixed(3).replace(".", DECIMAL_COMMA ? "," : "."));
        return [row.date, row.n, row.d, fixed(row.d / row.n), fixed(point?.centre ?? result?.pBar), fixed(point?.lcl), fixed(point?.ucl), point ? signalText(point) : "", row.note];
      }),
    ];
  };
  root.querySelector("[data-csv]").addEventListener("click", () => {
    if (!state.rows.length) return;
    downloadCsv(data.csv || "control-chart", exportRows(false));
  });
  root.querySelector("[data-xlsx]")?.addEventListener("click", () => {
    if (!state.rows.length) return;
    downloadXlsx(data.csv || "control-chart", exportRows(true));
  });

  // Days handed over by Damage Control, Incomplete Control or Delay Analyzer ("Open as control chart"): defects out of
  // the volume of each day. The same metric and unit are added to the chart (a day already in it is replaced);
  // anything else replaces the chart, and Undo puts the old days back for a few seconds.
  const handoff = (() => {
    try {
      const raw = sessionStorage.getItem("sc-sigma-handoff");
      sessionStorage.removeItem("sc-sigma-handoff");
      const value = raw && JSON.parse(raw);
      return isObject(value) && Array.isArray(value.rows) ? value : null;
    } catch {
      return null;
    }
  })();
  const handoffStatus = root.querySelector("[data-handoff-status]");
  const applyHandoff = (given) => {
    // An example still on the chart is never mixed with real days: the handed-over days replace it, its
    // settings (the baseline above all) included.
    const onExample = exampleMatches(state);
    const { rows, merge } = takeOver(given, onExample ? { ...state, rows: [] } : state);
    if (!rows.length) return;
    const before = { metric: state.metric, unit: state.unit, baseline: state.baseline, example: state.example, rows: state.rows.map((row) => ({ ...row })) };
    if (!merge) {
      state.metric = str(given.metric);
      state.unit = str(given.unit);
      state.baseline = "";
      state.example = {};
      state.rows = [];
    }
    upsert(rows);
    const showSettings = () => root.querySelectorAll("[data-setting]").forEach((input) => { input.value = state[input.name] ?? ""; });
    showSettings();
    save();
    render();
    const skipped = Math.round(Number(given.skipped)) || 0;
    const message = [
      tx(merge ? "{source}: {days} taken over and added to the chart. A day that was already in it was replaced." : "{source}: {days} taken over. They replace what was in the chart.", { source: str(given.source), days: days(rows.length) }),
      skipped ? tx(skipped === 1 ? "{n} day without a volume was left out." : "{n} days without a volume were left out.", { n: skipped }) : "",
    ].filter(Boolean).join(" ");
    if (before.rows.length) {
      undoNote(handoffStatus, message, () => {
        Object.assign(state, before);
        showSettings();
        save();
        render();
      });
    } else {
      handoffStatus.textContent = message;
    }
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  };

  // Redraw the chart when its width changes.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const wrap = results.querySelector(".sc-chart-wrap");
      if (wrap && Math.abs(wrap.clientWidth - lastWidth) > 8) renderResults();
    }, 150);
  });

  // Events on the timeline: the form adds them, and the chart redraws when one is added or removed (here or in another tab).
  if (Annotations) {
    Annotations.mount(document.querySelector("[data-annotations]"), SLUG);
    window.addEventListener("annotations:changed", () => renderResults());
  }

  // A first visit opens on the example month, so the chart is visible at once; the note says so. Nothing is written
  // to the browser until the visitor acts, as in the log tools.
  if (!state.rows.length && !handoff && firstVisit(KEY)) loadExample();
  render();
  if (handoff) applyHandoff(handoff);
})();
