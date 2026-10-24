(() => {
  // Plain arithmetic, usable without the page (tests/process-lab.test.cjs): a pasted column of measurements and the
  // whole analysis of a sample. Needs window.ToolKit (parsing) and window.StatsKit (statistics).
  const fill = (template, vars = {}) => String(template ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  // A pasted column: one value per line, or a date and a value, or a row number and a value (the last number of a row
  // is the measurement, a cell that reads as a date is its label). A single line of numbers separated by spaces counts
  // too. Rows without a number (a header) are skipped.
  const parseValues = (text) => {
    const kit = window.ToolKit;
    const out = [];
    const source = String(text ?? "");
    // With a decimal comma and no tab or semicolon in the text, "47,2" is one value, not a row of 47 and 2: a
    // column copied from a German or Albanian Excel looks exactly like that.
    const commaColumn = kit.DECIMAL_COMMA && !/[\t;]/.test(source);
    const rows = commaColumn
      ? source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => (/^[+-]?\d[\d.]*(?:,\d+)?$/.test(line) ? [line] : kit.parseRows(line)[0] || []))
      : kit.parseRows(source);
    const single = rows.length === 1 && rows[0].length === 1 && /\s/.test(rows[0][0].trim());
    const lines = single ? rows[0][0].trim().split(/\s+/).map((cell) => [cell]) : rows;
    lines.forEach((cells) => {
      let date = "";
      let value = NaN;
      cells.forEach((cell) => {
        const day = kit.parseDate(cell);
        if (day && !date) { date = day; return; }
        const number = kit.parseNumber(cell);
        if (Number.isFinite(number)) value = number;
      });
      if (Number.isFinite(value)) out.push({ date, value });
    });
    return out;
  };
  // Decimals in the sample (at most 3), so the results are shown with one more than the data.
  const decimals = (values) => Math.min(3, Math.max(0, ...values.map((value) => { const text = String(value); const at = text.indexOf("."); return at < 0 ? 0 : text.length - at - 1; })));
  // Cpk read as a verdict: under 1 the process does not fit, 1.33 is the usual contract floor, 2 is six sigma.
  const band = (cpk) => (!Number.isFinite(cpk) ? "none" : cpk < 1 ? "low" : cpk < 1.33 ? "marginal" : cpk < 2 ? "capable" : "six");
  // A p-value as "1 in n" (n rounded to one figure), or null when the chance is large enough to say as a percentage.
  const oneIn = (p) => {
    if (!(p > 0) || p >= 0.1) return null;
    const raw = 1 / p;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    return Math.round(raw / magnitude) * magnitude;
  };
  // "real" under 5 %, "borderline" up to 10 %, otherwise "noise".
  const verdictOf = (p) => (!Number.isFinite(p) ? null : p < 0.05 ? "real" : p < 0.1 ? "borderline" : "noise");
  const analyse = (points, spec = {}) => {
    const S = window.StatsKit;
    const values = points.map((point) => point.value);
    const n = values.length;
    const chart = S.imr(values);
    const signals = n >= 2 ? S.nelson(values, chart.mean, chart.sigmaWithin) : values.map(() => []);
    const events = S.nelsonEvents(signals);
    const lsl = Number.isFinite(spec.lsl) ? spec.lsl : null;
    const usl = Number.isFinite(spec.usl) ? spec.usl : null;
    const cap = S.capability(values, lsl ?? NaN, usl ?? NaN);
    const ad = S.andersonDarling(values);
    // The points beyond 3σ pull the tails of the normality test; the test without them says whether the rest is normal.
    const beyond = signals.map((rules, i) => (rules.includes(1) ? i : -1)).filter((i) => i >= 0);
    const without = beyond.length && !ad.normal && ad.enough ? S.andersonDarling(values.filter((value, i) => !beyond.includes(i))) : null;
    // A drift over the whole sample counts when the slope is unlikely to be chance (t test of r, under 10 %).
    const line = n >= 10 ? S.regression(values.map((value, i) => i + 1), values) : null;
    const drift = line && Math.abs(line.r) < 1 ? { ...line, p: 2 * (1 - S.tCdf(Math.abs(line.r) * Math.sqrt((n - 2) / (1 - line.r * line.r)), n - 2)) } : line;
    return {
      n, values, chart, signals, events, cap, ad, without, beyond, drift,
      mean: S.mean(values), sd: S.sd(values), median: S.median(values),
      min: n ? Math.min(...values) : null, max: n ? Math.max(...values) : null,
      band: band(cap.cpk), digits: decimals(values), lsl, usl, target: Number.isFinite(spec.target) ? spec.target : null,
    };
  };
  window.ProcessLabMath = { fill, parseValues, decimals, band, oneIn, verdictOf, analyse };

  const dataEl = document.getElementById("process-lab-data");
  if (!dataEl || !window.ToolKit || !window.StatsKit || !window.ChartKit) return;

  const { tx, num, pct, int, showDate, dayMonth, write, isObject, str, loadState, el, parseNumber, panel, stat, resultActions, resultLayout, flash, downloadCsv, downloadXlsx, recentExample, firstVisit } = window.ToolKit;
  const S = window.StatsKit;
  const CK = window.ChartKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const root = document.querySelector("[data-process-lab]");
  const results = document.querySelector("[data-results]");
  const dayLabel = dayMonth(false);

  const state = loadState(KEY, { tab: "measure", values: "", name: "", unit: "", lsl: "", usl: "", target: "", prop: {}, means: {}, size: {}, example: false });
  // The tabs are the page's: the second set (process-lab-2.js) adds its own.
  if (![...root.querySelectorAll("[data-tab]")].some((tab) => tab.dataset.tab === state.tab)) state.tab = "measure";
  const save = () => write(KEY, state);
  const PROP_FIELDS = ["d1", "n1", "d2", "n2"];
  const SIZE_FIELDS = ["p0", "p1", "alpha", "power", "sd", "delta", "alpha2", "power2"];

  // Numbers in the page's format, with one decimal more than the data.
  const unitText = () => str(state.unit).trim();
  const withUnit = (value, digits) => `${num(value, digits)}${unitText() ? ` ${unitText()}` : ""}`;
  const pText = (p) => (!Number.isFinite(p) ? "–" : p < 0.001 ? `< ${num(0.001, 3)}` : num(p, 3));
  // "p = 0.015" or "p < 0.001", for the sentences.
  const pEq = (p) => (Number.isFinite(p) && p < 0.001 ? `p ${pText(p)}` : `p = ${pText(p)}`);
  // An index (Cp, Cpk) with two decimals, or a dash when the sample cannot give one.
  const idx = (value) => (Number.isFinite(value) ? num(value, 2) : "–");
  const chanceText = (p) => {
    const n = oneIn(p);
    return n ? fill(data.proportion.oneInWords, { n: int.format(n) }) : pct(p, 0);
  };
  const name = () => str(state.name).trim() || tx("Measurement");
  const ruleOf = (id) => data.rules.find((rule) => rule.id === id);
  const specOf = () => ({ lsl: parseNumber(state.lsl), usl: parseNumber(state.usl), target: parseNumber(state.target) });

  // Signals in words: "Point 23 (56.4) is beyond the 3σ limit", "9 points in a row on the same side (points 12–20)".
  const eventText = (event, result) => {
    const rule = ruleOf(event.rule);
    const count = event.to - event.from + 1;
    const rising = event.rule === 3 && result.values[event.to] > result.values[event.from];
    return fill(rule.signal, {
      n: event.rule === 1 ? event.from + 1 : count,
      value: withUnit(result.values[event.from], result.digits),
      from: event.from + 1,
      to: event.to + 1,
      direction: rising ? data.directions.up : data.directions.down,
    });
  };
  const pointLabel = (point, index) => (point.date ? dayLabel(new Date(`${point.date}T00:00:00Z`)) : String(index + 1));

  // The verdicts as text, used by the card and the copied summary.
  const controlText = (result) => {
    const parts = [result.events.length ? fill(data.control.signals, { count: result.events.length }) : fill(data.control.stable, { n: int.format(result.n) })];
    if (result.n < 20) parts.push(data.control.short);
    return parts.join(" ");
  };
  const capabilityText = (result) => {
    const { cap } = result;
    if (result.band === "none") return data.capability.none;
    const vars = { cp: idx(cap.cp), cpk: idx(cap.cpk), pp: idx(cap.pp), ppk: idx(cap.ppk), ppm: int.format(Math.round(cap.ppmTotal)), pct: pct(cap.ppmTotal / 1e6, cap.ppmTotal >= 1e4 ? 1 : 2), target: num(result.target ?? result.mean, result.digits) };
    const parts = [fill(data.capability[result.band].text, vars)];
    if (Number.isFinite(cap.cp) && cap.cp - cap.cpk > 0.25) parts.push(fill(data.capability.gap, vars));
    if (Number.isFinite(cap.pp) && Number.isFinite(cap.cp) && cap.cp > 0 && cap.pp / cap.cp < 0.8) parts.push(fill(data.capability.shortLong, vars));
    return parts.join(" ");
  };
  const normalityText = (result) => {
    const { ad, without } = result;
    if (!ad.enough) return data.normality.few;
    const parts = [fill(ad.normal ? data.normality.normal : data.normality.notNormal, { p: pEq(ad.p) })];
    if (without) parts.push(fill(data.normality.outliers, { n: result.beyond.length, verdict: without.normal ? data.normality.normalWord : data.normality.notNormalWord, p: pEq(without.p) }));
    return parts.join(" ");
  };
  const driftText = (result) => (result.drift && !(result.drift.p >= 0.1) ? fill(data.drift, { slope: `${result.drift.slope > 0 ? "+" : ""}${num(result.drift.slope, result.digits + 1)}`, unit: unitText(), r: num(result.drift.r, 2) }) : "");

  const summaryText = (result) => {
    const lines = [`${tx("Process Lab")} · ${name()} | Stiven Catalyst`, ""];
    lines.push(`${tx("Measurements")}: ${int.format(result.n)} · ${tx("Mean")} ${withUnit(result.mean, result.digits + 1)} · ${tx("Standard deviation")} ${num(result.sd, result.digits + 1)} · ${tx("Range")} ${num(result.min, result.digits)} – ${num(result.max, result.digits)}`);
    lines.push(`${tx("Control limits")}: ${num(result.chart.lcl, result.digits + 1)} – ${num(result.chart.ucl, result.digits + 1)}`);
    if (result.band !== "none") lines.push(`Cp ${idx(result.cap.cp)} · Cpk ${idx(result.cap.cpk)} · Pp ${idx(result.cap.pp)} · Ppk ${idx(result.cap.ppk)} · ${tx("Sigma level")} ${idx(result.cap.sigmaLevel)} · ${tx("Expected outside")} ${pct(result.cap.ppmTotal / 1e6, 2)}`);
    lines.push("", controlText(result));
    if (result.events.length) {
      lines.push("", `${tx("Signals")}:`);
      result.events.forEach((event) => lines.push(`- ${ruleOf(event.rule).name}: ${eventText(event, result)}`));
    }
    lines.push("", capabilityText(result), normalityText(result));
    const drift = driftText(result);
    if (drift) lines.push(drift);
    return lines.join("\n");
  };
  const problemText = (result) => (result.events.length
    ? `${name()}: ${eventText(result.events[0], result)}`
    : tx("{name} runs at {mean} on average with a spread (sd) of {sd}; Cpk {cpk}. The level itself comes from the way the work is done.", { name: name(), mean: withUnit(result.mean, result.digits + 1), sd: num(result.sd, result.digits + 1), cpk: idx(result.cap.cpk) }));

  // The points as rows for a file: value, limits, moving range and the rules that fired.
  const exportRows = (points, result) => [
    [tx("Point"), tx("Date"), name(), tx("Mean"), tx("Lower limit"), tx("Upper limit"), tx("Moving range"), tx("Signal")],
    ...points.map((point, i) => [i + 1, point.date, point.value, Number(result.chart.mean.toFixed(4)), Number(result.chart.lcl.toFixed(4)), Number(result.chart.ucl.toFixed(4)), i ? Number(result.chart.ranges[i - 1].toFixed(4)) : "", result.signals[i].map((rule) => ruleOf(rule).name).join(", ")]),
  ];

  // 1 · Measurements -----------------------------------------------------------------------------------------------
  const settings = [...root.querySelectorAll("[data-setting]")];
  const valuesCount = root.querySelector("[data-values-count]");
  const empty = root.querySelector("[data-empty]");
  const status = root.querySelector("[data-status]");
  const points = () => parseValues(state.values);

  const renderResults = () => {
    results.replaceChildren();
    const list = points();
    results.hidden = state.tab !== "measure" || list.length < 2;
    valuesCount.textContent = list.length ? tx("{n} measurements", { n: int.format(list.length) }) : "";
    empty.hidden = list.length > 0;
    if (results.hidden) return;
    const result = analyse(list, specOf());
    const d = result.digits;
    const unit = unitText();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Process Lab")} · ${name()}`));
    const title = el("h2");
    const titleText = result.events.length ? tx("Signals to investigate") : tx("Stable: this is noise");
    const [first, ...rest] = titleText.split(": ");
    title.append(first, rest.length ? ": " : "");
    if (rest.length) title.append(el("span", null, rest.join(": ")));
    head.append(title);

    const stats = el("div", "dl-stats");
    const span = list[0].date && list.at(-1).date ? `${showDate(list[0].date)} – ${showDate(list.at(-1).date)}` : tx("single values");
    stats.append(stat(tx("Measurements"), int.format(result.n), span));
    stats.append(stat(tx("Mean"), withUnit(result.mean, d + 1), `${tx("Median")} ${num(result.median, d + 1)}`));
    stats.append(stat(tx("Standard deviation"), num(result.sd, d + 1), `${tx("Range")} ${num(result.min, d)} – ${num(result.max, d)}`));
    stats.append(stat(tx("Signals"), String(result.events.length), result.events.length ? [...new Set(result.events.map((event) => ruleOf(event.rule).name))].join(", ") : tx("nothing to chase")));
    if (result.band !== "none") {
      stats.append(stat("Cpk", num(result.cap.cpk, 2), data.capability[result.band].label));
      stats.append(stat(tx("Expected outside"), pct(result.cap.ppmTotal / 1e6, result.cap.ppmTotal >= 1e4 ? 1 : 2), tx("{ppm} per million · sigma level {sigma}", { ppm: int.format(Math.round(result.cap.ppmTotal)), sigma: num(result.cap.sigmaLevel, 2) })));
    }

    const card = el("article", "result-card dl-focus pl-card");
    card.append(el("p", "result-label", tx("What it says")));
    card.append(el("p", "pl-verdict", controlText(result)));
    if (result.events.length) {
      const signals = el("ul", "pl-signals");
      result.events.forEach((event) => {
        const item = el("li");
        item.append(el("strong", null, `${ruleOf(event.rule).name}. `), eventText(event, result), " ", el("span", "pl-signal-why", ruleOf(event.rule).text));
        signals.append(item);
      });
      card.append(signals);
    }
    card.append(el("p", "result-label", tx("Capability")), el("p", null, capabilityText(result)));
    card.append(el("p", "result-label", tx("Normality")), el("p", null, normalityText(result)));
    const drift = driftText(result);
    if (drift) card.append(el("p", "dl-warning", drift));

    const actions = resultActions(() => summaryText(result), problemText(result));
    if (result.events.length && window.ActionsStore) {
      actions.append(window.ActionsStore.linkButton(tx("Add the signal to actions"), () => ({
        title: `${name()}: ${eventText(result.events[0], result)}`,
        detail: `${ruleOf(result.events[0].rule).text} ${tx("Control limits")}: ${num(result.chart.lcl, d + 1)} – ${num(result.chart.ucl, d + 1)}${unit ? ` ${unit}` : ""}.`,
        source: "process-lab",
        check: tx("The chart shows no new signal in the next 20 measurements."),
        priority: result.events.some((event) => event.rule === 1) ? "High" : "Medium",
      })));
    } else if (["low", "marginal"].includes(result.band) && window.ActionsStore) {
      // A stable process that does not fit the specification is a to-do too: the process itself has to change.
      actions.append(window.ActionsStore.linkButton(tx("Add to actions"), () => ({
        title: tx("Raise the Cpk of {name} from {cpk} to 1.33", { name: name(), cpk: idx(result.cap.cpk) }),
        detail: capabilityText(result),
        source: "process-lab",
        check: tx("Cpk at least 1.33 over the next 20 measurements."),
        priority: result.band === "low" ? "High" : "Medium",
      })));
    }

    // The evidence: I chart, MR chart, histogram, the capability table, the box plot.
    const format = (value) => num(value, d);
    const iPanel = panel(tx("Individual values with control limits"), tx("Each measurement in order. Points in the alert colour break a Nelson rule; point at one for its value."));
    // ChartKit.line starts its axis at zero unless told otherwise; values around 42 need their own range.
    const reach = [...result.values, result.chart.lcl, result.chart.ucl, result.lsl, result.usl].filter(Number.isFinite);
    const lo = Math.min(...reach), hi = Math.max(...reach), pad = (hi - lo || 1) * 0.08;
    const series = [{ label: name(), points: list.map((point, i) => ({ x: pointLabel(point, i), y: point.value, state: result.signals[i].length ? "danger" : undefined, tip: `${tx("Point")} ${i + 1}${point.date ? ` · ${showDate(point.date)}` : ""}: ${withUnit(point.value, d)}${result.signals[i].length ? `\n${result.signals[i].map((rule) => ruleOf(rule).name).join(", ")}` : ""}` })) }];
    iPanel.append(CK.figure(CK.line(series, { title: tx("Individual values with control limits"), unit, format, center: result.chart.mean, ucl: result.chart.ucl, lcl: result.chart.lcl, centerLabel: tx("Mean"), yMin: lo - pad, yMax: hi + pad }), { fileName: `${data.csv}-i-chart` }));
    const mrPanel = panel(tx("Moving range"), tx("The distance between neighbours. A range above its limit means a jump between two measurements."));
    const ranges = result.chart.ranges.map((range, i) => ({ x: pointLabel(list[i + 1], i + 1), y: range, state: range > result.chart.mrUcl ? "danger" : undefined, tip: `${tx("Point")} ${i + 1} → ${i + 2}: ${num(range, d)}` }));
    mrPanel.append(CK.figure(CK.line([{ label: tx("Moving range"), points: [{ x: pointLabel(list[0], 0), y: NaN }, ...ranges] }], { title: tx("Moving range"), unit, format, center: result.chart.mrBar, ucl: result.chart.mrUcl, yMin: 0, centerLabel: "MR" }), { fileName: `${data.csv}-mr-chart` }));
    const histPanel = panel(tx("Histogram with specification limits"), result.band === "none" ? tx("Add LSL or USL above to see the specification on the histogram.") : tx("Columns outside the specification are in the alert colour; the dashed curve is the normal fit of the sample."));
    histPanel.append(CK.figure(CK.histogram(result.values, { title: tx("Histogram with specification limits"), unit, format, lsl: result.lsl ?? undefined, usl: result.usl ?? undefined, target: result.target ?? undefined }), { fileName: `${data.csv}-histogram` }));
    const capPanel = panel(tx("Capability"), tx("Cp and Cpk from the moving ranges (what the process can do when stable), Pp and Ppk from the overall spread (what it delivers)."));
    const table = el("table", "dl-table pl-table");
    const tbody = el("tbody");
    const cap = result.cap;
    const row = (label, value, note) => {
      const tr = el("tr");
      const th = el("th", null, label);
      th.scope = "row";
      tr.append(th, el("td", "num", value), el("td", "dl-note", note || ""));
      tbody.append(tr);
    };
    row("Cp", idx(cap.cp), tx("spread against the specification, both limits"));
    row("Cpk", idx(cap.cpk), tx("the same, counting where the mean sits"));
    row("Pp", idx(cap.pp), tx("overall spread, both limits"));
    row("Ppk", idx(cap.ppk), tx("overall, counting where the mean sits"));
    if (result.lsl !== null && Number.isFinite(cap.pBelow)) row(tx("Below LSL"), pct(cap.pBelow, 2), tx("expected · observed {n} of {total}", { n: cap.outBelow, total: result.n }));
    if (result.usl !== null && Number.isFinite(cap.pAbove)) row(tx("Above USL"), pct(cap.pAbove, 2), tx("expected · observed {n} of {total}", { n: cap.outAbove, total: result.n }));
    row("PPM", Number.isFinite(cap.ppmTotal) ? int.format(Math.round(cap.ppmTotal)) : "–", tx("expected per million outside"));
    row("Z bench", idx(cap.zBench), tx("sigma level {sigma} with the 1.5 shift", { sigma: idx(cap.sigmaLevel) }));
    row(tx("Normality"), result.ad.enough ? pEq(result.ad.p) : "–", result.ad.enough ? `${tx("Anderson–Darling")} A² = ${num(result.ad.A2, 3)}` : data.normality.few);
    table.append(tbody);
    const tableWrap = el("div", "dl-table-wrap");
    tableWrap.tabIndex = 0;
    tableWrap.append(table);
    capPanel.append(tableWrap);
    const boxPanel = panel(tx("Box plot"), tx("Median, quartiles and the whiskers of the sample; dots are outliers (1.5 × IQR)."));
    boxPanel.append(CK.figure(CK.box([{ label: name(), values: result.values }], { title: tx("Box plot"), unit, format }), { fileName: `${data.csv}-box` }));

    resultLayout(results, { head, stats, focus: card, actions, panels: [iPanel, mrPanel, histPanel, capPanel, boxPanel] });
  };

  const showSettings = () => settings.forEach((input) => { input.value = state[input.name] ?? ""; });
  settings.forEach((input) => input.addEventListener("input", () => {
    state[input.name] = input.value;
    // Typing over the example is the visitor's own work from here on.
    if (input.name === "values") state.example = false;
    save();
    render();
  }));

  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.values.trim() || !window.confirm(tx("Clear all measurements?"))) return;
    state.values = "";
    state.example = false;
    showSettings();
    save();
    render();
  });
  root.querySelector("[data-csv]").addEventListener("click", () => {
    const list = points();
    if (list.length < 2) { flash(status, tx("Paste at least two measurements first.")); return; }
    downloadCsv(data.csv, exportRows(list, analyse(list, specOf())));
  });
  root.querySelector("[data-xlsx]").addEventListener("click", () => {
    const list = points();
    if (list.length < 2) { flash(status, tx("Paste at least two measurements first.")); return; }
    downloadXlsx(data.csv, exportRows(list, analyse(list, specOf())));
  });

  // 2 · Before / after -------------------------------------------------------------------------------------------
  const propForm = root.querySelector("[data-proportion]");
  const propOut = root.querySelector("[data-prop-out]");
  const meansForm = root.querySelector("[data-means]");
  const meansOut = root.querySelector("[data-means-out]");
  const hint = (text) => el("p", "form-note pl-hint", text);
  const verdictCard = (text, kind) => {
    const card = el("div", `pl-verdict-card is-${kind}`);
    card.append(el("strong", null, kind === "real" ? tx("Real change") : kind === "borderline" ? tx("Probably real") : tx("Could be noise")), " ", text);
    return card;
  };

  const renderProportion = () => {
    propOut.replaceChildren();
    const [d1, n1, d2, n2] = PROP_FIELDS.map((field) => Math.round(parseNumber(state.prop[field])));
    const test = S.twoProportion(d1, n1, d2, n2);
    if (!test) {
      if (PROP_FIELDS.some((field) => str(state.prop[field]).trim())) propOut.append(hint(tx("Enter defects and units for both periods; defects cannot be more than units.")));
      return;
    }
    const digits = Math.max(test.p1, test.p2) < 0.01 ? 2 : 1;
    const rate = (value) => pct(value, digits);
    const kind = verdictOf(test.p);
    const change = test.p1 > 0 ? (test.p2 - test.p1) / test.p1 : null;
    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat(tx("Before"), rate(test.p1), tx("{a} of {b}", { a: int.format(d1), b: int.format(n1) })));
    stats.append(stat(tx("After"), rate(test.p2), tx("{a} of {b}", { a: int.format(d2), b: int.format(n2) })));
    stats.append(stat(tx("Change"), change === null ? "–" : `${change > 0 ? "+" : ""}${pct(change, 0)}`, test.diff < 0 ? data.proportion.better : data.proportion.worse));
    stats.append(stat("p", pText(test.p), `z = ${num(test.z, 2)}`));
    propOut.append(stats);
    propOut.append(verdictCard(fill(data.proportion[kind], { p1: rate(test.p1), p2: rate(test.p2), p: pEq(test.p), chance: chanceText(test.p), low: `${test.ci95[0] > 0 ? "+" : ""}${pct(test.ci95[0], 2)}`, high: `${test.ci95[1] > 0 ? "+" : ""}${pct(test.ci95[1], 2)}` }), kind));
    const ci = (p, n) => { const half = 1.959964 * Math.sqrt(p * (1 - p) / n); return `${tx("95% CI")} ${rate(Math.max(0, p - half))} – ${rate(Math.min(1, p + half))}`; };
    const items = [{ label: tx("Before"), value: test.p1 * 100, tip: `${tx("Before")}: ${rate(test.p1)}\n${ci(test.p1, n1)}` }, { label: tx("After"), value: test.p2 * 100, tip: `${tx("After")}: ${rate(test.p2)}\n${ci(test.p2, n2)}`, color: kind === "real" ? (test.diff < 0 ? CK.C.ok : CK.C.danger) : undefined }];
    propOut.append(CK.figure(CK.bars(items, { title: tx("Two defect rates"), unit: "%", format: (value) => num(value, digits), labels: true }), { fileName: `${data.csv}-rates` }));
  };

  const renderMeans = () => {
    meansOut.replaceChildren();
    const a = parseValues(state.means.a).map((point) => point.value);
    const b = parseValues(state.means.b).map((point) => point.value);
    const test = S.welch(a, b);
    if (!test) {
      if (str(state.means.a).trim() || str(state.means.b).trim()) meansOut.append(hint(data.means.need));
      return;
    }
    const d = decimals([...a, ...b]) + 1;
    const kind = verdictOf(test.p);
    const stats = el("div", "dl-stats pl-stats");
    stats.append(stat(tx("Before"), withUnit(test.mean1, d), tx("n = {n} · sd {sd}", { n: a.length, sd: num(S.sd(a), d) })));
    stats.append(stat(tx("After"), withUnit(test.mean2, d), tx("n = {n} · sd {sd}", { n: b.length, sd: num(S.sd(b), d) })));
    stats.append(stat(tx("Change"), `${test.diff > 0 ? "+" : ""}${withUnit(test.diff, d)}`, `${tx("95% CI")} ${num(test.ci95[0], d)} – ${num(test.ci95[1], d)}`));
    stats.append(stat("p", pText(test.p), `t = ${num(test.t, 2)} · df ${num(test.df, 1)}`));
    meansOut.append(stats);
    meansOut.append(verdictCard(fill(data.means[kind], { m1: withUnit(test.mean1, d), m2: withUnit(test.mean2, d), diff: `${test.diff > 0 ? "+" : ""}${withUnit(test.diff, d)}`, t: num(test.t, 2), p: pEq(test.p), low: num(test.ci95[0], d), high: num(test.ci95[1], d) }), kind));
    meansOut.append(CK.figure(CK.box([{ label: tx("Before"), values: a }, { label: tx("After"), values: b }], { title: tx("Two sets of measurements"), unit: unitText(), format: (value) => num(value, d - 1) }), { fileName: `${data.csv}-before-after` }));
  };

  [propForm, meansForm].forEach((form) => form.addEventListener("submit", (event) => event.preventDefault()));
  const bind = (inputs, bucket, render) => inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!isObject(state[bucket])) state[bucket] = {};
      state[bucket][input.name] = input.value;
      save();
      render();
    });
  });
  bind([...propForm.querySelectorAll("[data-prop]")], "prop", renderProportion);
  bind([...meansForm.querySelectorAll("[data-mean]")], "means", renderMeans);

  // 3 · How many to measure ---------------------------------------------------------------------------------------
  const sizeForm = root.querySelector("[data-size]");
  const sizePropOut = root.querySelector("[data-size-prop-out]");
  const sizeMeanOut = root.querySelector("[data-size-mean-out]");
  const percent = (field, fallback) => { const value = parseNumber(state.size[field]); return Number.isFinite(value) ? value / 100 : fallback; };
  const renderSize = () => {
    sizePropOut.replaceChildren();
    sizeMeanOut.replaceChildren();
    const p0 = percent("p0", NaN), p1 = percent("p1", NaN);
    const alpha = percent("alpha", 0.05), power = percent("power", 0.8);
    const nProp = S.sampleSizeProportion(p0, p1, alpha, power);
    if (nProp) {
      const digits = Math.max(p0, p1) < 0.01 ? 2 : 1;
      sizePropOut.append(stat(tx("Per group"), int.format(nProp), tx("units before, and as many after")));
      sizePropOut.append(el("p", "pl-size-text", fill(data.size.proportionResult, { n: int.format(nProp), p0: pct(p0, digits), p1: pct(p1, digits) })));
    } else if (["p0", "p1"].some((field) => str(state.size[field]).trim())) sizePropOut.append(hint(data.size.need));
    const sdValue = parseNumber(state.size.sd), delta = parseNumber(state.size.delta);
    const nMean = S.sampleSizeMean(sdValue, delta, percent("alpha2", 0.05), percent("power2", 0.8));
    if (nMean) {
      sizeMeanOut.append(stat(tx("Per group"), int.format(nMean), tx("values before, and as many after")));
      sizeMeanOut.append(el("p", "pl-size-text", fill(data.size.meanResult, { n: int.format(nMean), delta: num(delta, decimals([delta])), unit: unitText(), sd: num(sdValue, decimals([sdValue])) })));
    } else if (["sd", "delta"].some((field) => str(state.size[field]).trim())) sizeMeanOut.append(hint(tx("Enter the spread (sd) and the change to detect, both above zero.")));
  };
  sizeForm.addEventListener("submit", (event) => event.preventDefault());
  bind([...sizeForm.querySelectorAll("[data-size]")], "size", renderSize);

  const showBuckets = () => {
    PROP_FIELDS.forEach((field) => { propForm.elements[field].value = str(state.prop[field]); });
    ["a", "b"].forEach((field) => { meansForm.elements[field].value = str(state.means[field]); });
    SIZE_FIELDS.forEach((field) => { sizeForm.elements[field].value = str(state.size[field]); });
  };

  // Tabs ----------------------------------------------------------------------------------------------------------
  const tabs = [...root.querySelectorAll("[data-tab]")];
  const panels = [...root.querySelectorAll("[data-panel]")];
  const showTab = () => {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === state.tab;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach((box) => { box.hidden = box.dataset.panel !== state.tab; });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      state.tab = tab.dataset.tab;
      save();
      showTab();
      renderResults();
    });
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    });
  });

  // The example: a sample of loading times, the DMAIC case for the rates, and the sample-size defaults. Its dates
  // move forward to recent weeks. The note above the tabs says it is an example; one tap clears it.
  const note = el("div", "dl-example-note pl-example-note");
  note.setAttribute("role", "status");
  const clearButton = el("button", "button-ghost", tx("Clear the example"));
  clearButton.type = "button";
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Paste your own measurements and it disappears, or clear it now.")), " ", clearButton);
  root.prepend(note);
  const loadExample = () => {
    const ex = data.example;
    const rows = recentExample(ex.rows).map((row) => { const [date, value] = row.split("|"); return `${showDate(date)}\t${num(Number(value), decimals([Number(value)]))}`; });
    Object.assign(state, { values: rows.join("\n"), name: ex.name, unit: ex.unit, lsl: ex.lsl, usl: ex.usl, target: ex.target, prop: { ...ex.proportion }, means: { ...ex.means }, size: { ...ex.size }, example: true });
    showSettings();
    showBuckets();
  };
  const dropExample = () => {
    Object.assign(state, { values: "", name: "", unit: "", lsl: "", usl: "", target: "", prop: {}, means: {}, size: {}, example: false });
    showSettings();
    showBuckets();
  };
  clearButton.addEventListener("click", () => {
    dropExample();
    save();
    render();
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    state.tab = "measure";
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });

  const render = () => {
    note.hidden = !state.example;
    showTab();
    renderResults();
    renderProportion();
    renderMeans();
    renderSize();
  };

  // A first visit opens on the example; nothing is written until the visitor acts.
  if (!state.values.trim() && firstVisit(KEY)) loadExample();
  else { showSettings(); showBuckets(); }
  render();
})();
