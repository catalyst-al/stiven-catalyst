// Cost of Quality: the cost of quality in one number, by the PAF model (prevention, appraisal, internal failure,
// external failure; A. V. Feigenbaum, Total Quality Control, and the cost-of-quality pages of ASQ). Every line is one
// cost with its basis (hours × hourly rate, count × cost per event, or a fixed amount) and the period it covers; all of
// it is brought to a month and a year.
//   Cost of quality (COQ)        = P + A + IF + EF
//   Cost of poor quality (COPQ)  = IF + EF
// Some authors also count appraisal as a cost of poor quality (checking exists only because work can be wrong); the
// tool shows both. The arithmetic lives in window.CostOfQualityMath so the tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const CATS = ["prevention", "appraisal", "internal", "external"];
  const FAILURE = ["internal", "external"];
  const BASES = ["hours", "count", "fixed"];
  const PERIODS = ["week", "month", "quarter", "year"];
  const SOURCES = ["", "waste-log", "guest-complaints"];
  const MAX_LINES = 80;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const newId = () => `q${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // Arithmetic -------------------------------------------------------------------------------------------------------
  // A typed amount: 1.234,50, 1,234.50, "€ 80" and numbers all read; empty, negative or text is NaN.
  const amount = (value) => {
    const n = typeof value === "number" ? value : parseNumber(value);
    return finite(n) && n >= 0 ? n : NaN;
  };
  // A cost of one period as a month. A year has 52 weeks and 12 months, so a week is 52/12 of a month (not 4); a
  // quarter is a third of a year's 12 months.
  const monthly = (value, period) => {
    if (!finite(value)) return 0;
    if (period === "week") return (value * 52) / 12;
    if (period === "quarter") return value / 3;
    if (period === "year") return value / 12;
    return period === "month" ? value : 0;
  };
  const yearly = (value, period) => monthly(value, period) * 12;
  // The cost of a line over its own period: hours × hourly rate, count × cost per event, or the amount itself. Hours
  // without a rate of their own use the default hourly rate.
  const lineCost = (line, options = {}) => {
    if (!isObject(line)) return 0;
    const basis = BASES.includes(line.basis) ? line.basis : "fixed";
    if (basis === "fixed") {
      const a = amount(line.amount);
      return finite(a) ? a : 0;
    }
    const qty = amount(line.qty);
    let rate = amount(line.rate);
    if (!finite(rate) && basis === "hours") rate = amount(options.hourlyRate);
    return finite(qty) && finite(rate) ? qty * rate : 0;
  };
  const lineMonthly = (line, options) => monthly(lineCost(line, options), PERIODS.includes(line?.period) ? line.period : "month");
  const share = (part, whole) => (finite(part) && finite(whole) && whole > 0 ? part / whole : null);

  // Totals by category, a month and a year, with COQ, COPQ (with and without appraisal) and the ratio of failure to
  // prevention and appraisal ("conformance" in Crosby's words: what is spent to get it right and to check it).
  const totals = (lines, options = {}) => {
    const month = Object.fromEntries(CATS.map((cat) => [cat, 0]));
    (Array.isArray(lines) ? lines : []).forEach((line) => { if (CATS.includes(line?.cat)) month[line.cat] += lineMonthly(line, options); });
    const coq = CATS.reduce((sum, cat) => sum + month[cat], 0);
    const copq = month.internal + month.external;
    const conformance = month.prevention + month.appraisal;
    return {
      month,
      year: Object.fromEntries(CATS.map((cat) => [cat, month[cat] * 12])),
      shares: Object.fromEntries(CATS.map((cat) => [cat, share(month[cat], coq) ?? 0])),
      coq, coqYear: coq * 12,
      copq, copqYear: copq * 12,
      copqWide: copq + month.appraisal,
      conformance,
      ratio: conformance > 0 ? copq / conformance : null,
    };
  };
  // COPQ as a share of the revenue of the same month; null without a revenue.
  const revenueShare = (cost, revenue) => share(cost, amount(revenue));
  // Cost per unit of volume (orders, room nights, parcels) in the same month; null without a volume.
  const perUnit = (cost, volume) => {
    const v = amount(volume);
    return v > 0 && finite(cost) ? cost / v : null;
  };
  // The scenario: failure costs fall by cut (a share: 0.3 for 30 %) and prevention rises by invest € a month.
  //   Net saving per year = cut × (IF + EF) × 12 − invest × 12
  const scenario = (t, cut, invest) => {
    const c = finite(cut) ? Math.min(1, Math.max(0, cut)) : 0;
    const y = finite(invest) && invest > 0 ? invest : 0;
    const failureSavedYear = c * t.copq * 12;
    const addedYear = y * 12;
    const netYear = failureSavedYear - addedYear;
    const after = {
      prevention: t.month.prevention + y,
      appraisal: t.month.appraisal,
      internal: t.month.internal * (1 - c),
      external: t.month.external * (1 - c),
    };
    const coqAfter = CATS.reduce((sum, cat) => sum + after[cat], 0);
    const conformance = after.prevention + after.appraisal;
    return {
      cut: c, invest: y, failureSavedYear, addedYear, netYear, netMonth: netYear / 12,
      after, coqAfter, copqAfter: after.internal + after.external,
      ratioAfter: conformance > 0 ? (after.internal + after.external) / conformance : null,
      // The cut at which the extra prevention pays for itself: invest = cut × COPQ.
      breakEven: t.copq > 0 ? y / t.copq : null,
    };
  };
  // The items by cost a month, largest first, with their share of the whole and the running share (a Pareto).
  const pareto = (lines, options = {}, cats = CATS) => {
    const items = (Array.isArray(lines) ? lines : []).map((line, index) => ({ index, line, value: cats.includes(line?.cat) ? lineMonthly(line, options) : 0 }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value || a.index - b.index);
    const total = items.reduce((sum, item) => sum + item.value, 0);
    let cum = 0;
    return items.map((item) => {
      cum += item.value;
      return { ...item, share: total ? item.value / total : 0, cum: total ? cum / total : 0 };
    });
  };

  // Lines as saved: numbers are kept as typed (strings), so "28,50" stays what the visitor wrote.
  const numText = (value) => (finite(value) ? String(value) : str(value).trim().slice(0, 24));
  const cleanLine = (raw) => {
    const line = isObject(raw) ? raw : {};
    return {
      id: /^[A-Za-z0-9-]{3,30}$/.test(str(line.id)) ? line.id : newId(),
      cat: CATS.includes(line.cat) ? line.cat : "prevention",
      name: str(line.name).slice(0, 120),
      basis: BASES.includes(line.basis) ? line.basis : "fixed",
      qty: numText(line.qty),
      rate: numText(line.rate),
      amount: numText(line.amount),
      period: PERIODS.includes(line.period) ? line.period : "month",
      source: SOURCES.includes(line.source) ? line.source : "",
    };
  };
  const cleanLines = (lines) => {
    const taken = new Set();
    return (Array.isArray(lines) ? lines : []).slice(0, MAX_LINES).map(cleanLine).map((line) => {
      if (taken.has(line.id)) line.id = newId();
      taken.add(line.id);
      return line;
    });
  };
  const fromExample = (example) => {
    const ex = isObject(example) ? example : {};
    return {
      setup: isObject(ex.setup) ? { ...ex.setup } : {},
      scenario: isObject(ex.scenario) ? { ...ex.scenario } : {},
      lines: cleanLines(ex.lines),
    };
  };

  // Bring in from this browser: read only, and only when the saved data has the expected shape.
  const addDaysIso = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // The last `days` days up to today, today included: with 30, today and the 29 days before.
  const inLast = (date, todayIso, days = 30) => isDate(date) && date <= todayIso && date > addDaysIso(todayIso, -days);
  const rowsOf = (saved) => (isObject(saved) && Array.isArray(saved.rows) ? saved.rows : Array.isArray(saved) ? saved : null);
  const dateOf = (row) => str(row.date).slice(0, 10);
  // The Waste Log: rows as waste-log.js saves them, { date, qty, cost (€ per unit), … }; the € of a row is qty × cost,
  // as the Waste Log itself counts it. A row without a cost is worth nothing here, as there.
  const wasteTotal = (saved, todayIso, days = 30) => {
    const rows = rowsOf(saved);
    if (!rows) return null;
    let total = 0, count = 0;
    rows.forEach((row) => {
      if (!isObject(row) || !inLast(dateOf(row), todayIso, days)) return;
      const q = amount(row.qty), u = amount(row.cost);
      if (!finite(q) || !finite(u)) return;
      total += q * u;
      count += 1;
    });
    return { total, count, rows: rows.length };
  };
  // Guest Complaints: rows with date and value, the € of the compensation given (0 for an apology).
  const complaintsTotal = (saved, todayIso, days = 30) => {
    const rows = rowsOf(saved);
    if (!rows) return null;
    let total = 0, count = 0;
    rows.forEach((row) => {
      if (!isObject(row) || !inLast(dateOf(row), todayIso, days)) return;
      const v = amount(row.value);
      if (!(v > 0)) return;
      total += v;
      count += 1;
    });
    return { total, count, rows: rows.length };
  };
  // A brought-in total as a line: a fixed amount for one month (30 days count as a month). The same source replaces
  // its earlier line, so bringing in twice does not count it twice.
  const mergeImport = (lines, source, cat, name, total) => {
    const round = Math.round(total * 100) / 100;
    const at = lines.findIndex((line) => line.source === source);
    const line = cleanLine({ ...(at >= 0 ? lines[at] : {}), cat, name: at >= 0 && lines[at].name.trim() ? lines[at].name : name, basis: "fixed", amount: String(round), period: "month", source });
    if (at >= 0) lines[at] = line; else lines.push(line);
    return lines;
  };

  window.CostOfQualityMath = { CATS, FAILURE, BASES, PERIODS, amount, monthly, yearly, lineCost, lineMonthly, totals, revenueShare, perUnit, scenario, pareto, cleanLine, cleanLines, fromExample, inLast, wasteTotal, complaintsTotal, mergeImport };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-cost-of-quality]");
  const dataEl = document.getElementById("cost-of-quality-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const { LANG, LOCALE, tx, num, pct, euro, el, read, readOwn, write, loadState, firstVisit, today, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, keepFocus, flash, undoNote, downloadCsv, downloadXlsx, copy } = window.ToolKit;
  const CK = window.ChartKit;
  const AS = window.ActionsStore;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const TOOL = "cost-of-quality";
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const money = (value) => new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(finite(value) ? value : 0));
  const catOf = (key) => data.categories.find((c) => c.key === key) || data.categories[0];
  const periodOf = (key) => data.periods.find((p) => p.key === key) || data.periods[1];
  const basisOf = (key) => data.bases.find((b) => b.key === key) || data.bases[2];
  const catColor = CK ? { prevention: CK.C.blue, appraisal: CK.C.soft, internal: "#a78bfa", external: CK.C.muted } : {};

  // Printing this page prints the one-page management summary (css/57-cost-of-quality.css), whatever starts it.
  document.documentElement.classList.add("cq-page");
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const setupInputs = [...root.querySelectorAll("[data-setup]")];
  const scenarioInputs = [...root.querySelectorAll("[data-scenario]")];
  const cutRange = root.querySelector("[data-cut-range]");
  const linesBox = root.querySelector("[data-lines]");
  const empty = root.querySelector("[data-empty]");
  const status = root.querySelector("[data-status]");
  const unitLabel = root.querySelector("[data-unit-label]");

  // State: the operation (sector, revenue, volume, default hourly rate), the cost lines, the scenario.
  const blankSetup = () => ({ sector: data.defaults.sector, revenue: "", volume: "", hourlyRate: String(data.defaults.hourlyRate ?? "") });
  const blankScenario = () => ({ cut: String(data.defaults.cut ?? ""), invest: "" });
  const state = loadState(KEY, { setup: blankSetup(), lines: [], scenario: blankScenario(), example: false });
  const fit = (saved, blank) => Object.fromEntries(Object.keys(blank).map((name) => [name, typeof saved?.[name] === "string" ? saved[name].slice(0, 40) : blank[name]]));
  state.setup = fit(state.setup, blankSetup());
  if (!data.sectors.some((s) => s.key === state.setup.sector)) state.setup.sector = data.sectors[0].key;
  state.scenario = fit(state.scenario, blankScenario());
  state.lines = cleanLines(state.lines);
  state.example = state.example === true;
  const loadExample = () => {
    const ex = fromExample(data.example);
    Object.assign(state, { setup: fit(ex.setup, blankSetup()), scenario: fit(ex.scenario, blankScenario()), lines: ex.lines, example: true });
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.lines.length && firstVisit(KEY)) loadExample();
  const save = () => write(KEY, state);
  // The visitor's own first change ends the example: the data stays, the note goes.
  const own = () => { state.example = false; };
  const options = () => ({ hourlyRate: state.setup.hourlyRate });
  const sector = () => data.sectors.find((s) => s.key === state.setup.sector) || data.sectors[0];
  const label = (line) => line.name.trim() || tx("Unnamed line");
  const cutShare = () => {
    const c = amount(state.scenario.cut);
    return finite(c) ? Math.min(100, c) / 100 : 0;
  };
  const investValue = () => {
    const y = amount(state.scenario.invest);
    return finite(y) ? y : 0;
  };

  // Example note above the results, with one tap to clear the example.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    Object.assign(state, { setup: blankSetup(), lines: [], scenario: blankScenario(), example: false });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);

  // The operation and the scenario ------------------------------------------------------------------------------------
  const showInputs = () => {
    setupInputs.forEach((input) => { input.value = state.setup[input.name] ?? ""; });
    scenarioInputs.forEach((input) => { input.value = state.scenario[input.name] ?? ""; });
    cutRange.value = String(Math.round(cutShare() * 100));
    unitLabel.textContent = sector().unitMany;
  };
  setupInputs.forEach((input) => input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => {
    state.setup[input.name] = input.value;
    own();
    save();
    if (input.name === "sector") unitLabel.textContent = sector().unitMany;
    if (input.name === "sector" || input.name === "hourlyRate") keepFocus(renderLines);
    renderSoon();
  }));
  scenarioInputs.forEach((input) => input.addEventListener("input", () => {
    state.scenario[input.name] = input.value;
    if (input.name === "cut") cutRange.value = String(Math.round(cutShare() * 100));
    own();
    save();
    renderSoon();
  }));
  cutRange.addEventListener("input", () => {
    state.scenario.cut = cutRange.value;
    root.querySelector('[data-scenario][name="cut"]').value = cutRange.value;
    own();
    save();
    renderSoon();
  });

  // The cost lines, grouped by category --------------------------------------------------------------------------------
  const lineOut = (line) => {
    const per = lineCost(line, options());
    const m = lineMonthly(line, options());
    if (!(per > 0)) return tx("No cost yet: fill in the numbers.");
    return line.period === "month"
      ? tx("{month} a month · {year} a year", { month: money(m), year: money(m * 12) })
      : tx("{per} {period} = {month} a month · {year} a year", { per: money(per), period: periodOf(line.period).per, month: money(m), year: money(m * 12) });
  };
  const field = (id, text, control, extra) => {
    const box = el("div", "field");
    const lab = el("label", null, text);
    lab.htmlFor = id;
    if (extra) lab.append(" ", el("span", "optional", extra));
    control.id = id;
    box.append(lab, control);
    return box;
  };
  const select = (items, value, f, line) => {
    const node = el("select");
    items.forEach((item) => {
      const option = el("option", null, item.name);
      option.value = item.key;
      node.append(option);
    });
    node.value = value;
    node.dataset.f = f;
    node.dataset.id = line.id;
    node.dataset.focusKey = `line:${line.id}:${f}`;
    return node;
  };
  const input = (value, f, line, attrs = {}) => {
    const node = el("input");
    node.value = value;
    node.dataset.f = f;
    node.dataset.id = line.id;
    node.dataset.focusKey = `line:${line.id}:${f}`;
    node.autocomplete = "off";
    Object.entries(attrs).forEach(([name, v]) => node.setAttribute(name, v));
    return node;
  };
  const lineCard = (line) => {
    const card = el("div", "cq-line");
    card.dataset.line = line.id;
    const id = (f) => `cq-${line.id}-${f}`;
    const grid = el("div", "dl-grid cq-line-grid");
    grid.append(
      field(id("name"), tx("Cost item"), input(line.name, "name", line, { list: `cq-presets-${sector().key}-${line.cat}`, placeholder: tx("Pick a preset or type your own"), maxlength: "120" })),
      field(id("cat"), tx("Category"), select(data.categories, line.cat, "cat", line)),
      field(id("basis"), tx("Basis"), select(data.bases, line.basis, "basis", line)),
    );
    const numberAttrs = { inputmode: "decimal" };
    if (line.basis === "fixed") {
      grid.append(field(id("amount"), tx("Amount (€)"), input(line.amount, "amount", line, { ...numberAttrs, placeholder: "0" })));
    } else {
      const hours = line.basis === "hours";
      grid.append(
        field(id("qty"), hours ? tx("Hours") : tx("Count"), input(line.qty, "qty", line, { ...numberAttrs, placeholder: "0" })),
        field(id("rate"), hours ? tx("€ per hour") : tx("€ per event"), input(line.rate, "rate", line, { ...numberAttrs, placeholder: hours && amount(state.setup.hourlyRate) >= 0 ? state.setup.hourlyRate : "0" }), hours ? tx("empty = default rate") : undefined),
      );
    }
    grid.append(field(id("period"), tx("Period"), select(data.periods, line.period, "period", line)));
    const foot = el("div", "cq-line-foot");
    const out = el("p", "cq-line-out", lineOut(line));
    out.dataset.out = line.id;
    if (line.source) out.prepend(el("span", "dl-tag", line.source === "waste-log" ? data.text.fromWaste : data.text.fromComplaints), " ");
    const remove = el("button", "button-ghost cq-remove", tx("Remove"));
    remove.type = "button";
    remove.dataset.remove = line.id;
    remove.setAttribute("aria-label", tx("Remove {item}", { item: label(line) }));
    foot.append(out, remove);
    card.append(grid, foot);
    return card;
  };
  const renderLines = () => {
    const t = totals(state.lines, options());
    linesBox.replaceChildren(...data.categories.map((c) => {
      const group = el("section", "cq-group");
      group.dataset.cat = c.key;
      const head = el("div", "cq-group-head");
      const title = el("h3", "cq-group-title");
      title.append(el("span", "cq-letter", c.short), " ", c.name);
      const sub = el("span", "cq-group-total", tx("{month} a month", { month: money(t.month[c.key]) }));
      sub.dataset.groupTotal = c.key;
      head.append(title, sub);
      group.append(head, el("p", "form-note cq-group-hint", c.hint));
      state.lines.filter((line) => line.cat === c.key).forEach((line) => group.append(lineCard(line)));
      const add = el("button", "button-secondary cq-add", tx("Add a line"));
      add.type = "button";
      add.dataset.add = c.key;
      add.dataset.focusKey = `add:${c.key}`;
      add.setAttribute("aria-label", tx("Add a line: {category}", { category: c.name }));
      group.append(add);
      return group;
    }));
    empty.hidden = state.lines.length > 0;
  };
  // While typing, only the outputs change; the list is rebuilt when a choice changes its fields.
  const refreshOuts = () => {
    const t = totals(state.lines, options());
    state.lines.forEach((line) => {
      const out = linesBox.querySelector(`[data-out="${line.id}"]`);
      if (!out) return;
      const tag = out.querySelector(".dl-tag");
      out.replaceChildren(...(tag ? [tag, " "] : []), lineOut(line));
    });
    linesBox.querySelectorAll("[data-group-total]").forEach((node) => { node.textContent = tx("{month} a month", { month: money(t.month[node.dataset.groupTotal]) }); });
  };
  const lineById = (id) => state.lines.find((line) => line.id === id);
  linesBox.addEventListener("input", (event) => {
    const { f, id } = event.target.dataset;
    const line = lineById(id);
    if (!line || event.target.tagName === "SELECT") return;
    line[f] = event.target.value.slice(0, f === "name" ? 120 : 24);
    // A preset typed or picked brings its usual basis, as long as no number has been entered yet.
    if (f === "name") {
      const preset = (sector().presets[line.cat] || []).find((p) => p.name === line.name.trim());
      if (preset && preset.basis !== line.basis && !line.qty && !line.rate && !line.amount) {
        line.basis = preset.basis;
        own();
        save();
        keepFocus(renderLines);
        renderSoon();
        return;
      }
    }
    own();
    save();
    refreshOuts();
    renderSoon();
  });
  linesBox.addEventListener("change", (event) => {
    const { f, id } = event.target.dataset;
    const line = lineById(id);
    if (!line || event.target.tagName !== "SELECT") return;
    line[f] = event.target.value;
    own();
    save();
    keepFocus(renderLines);
    renderSoon();
  });
  linesBox.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.add) {
      if (state.lines.length >= MAX_LINES) { flash(status, tx("The tool holds up to {n} lines.", { n: MAX_LINES })); return; }
      const cat = button.dataset.add;
      const preset = (sector().presets[cat] || [])[0];
      const line = cleanLine({ cat, basis: preset?.basis || "hours", period: "month" });
      state.lines.push(line);
      own();
      save();
      renderLines();
      renderSoon();
      linesBox.querySelector(`#cq-${line.id}-name`)?.focus();
    } else if (button.dataset.remove) {
      const index = state.lines.findIndex((line) => line.id === button.dataset.remove);
      if (index < 0) return;
      const [removed] = state.lines.splice(index, 1);
      own();
      save();
      renderLines();
      renderSoon();
      linesBox.querySelector(`[data-add="${removed.cat}"]`)?.focus();
      undoNote(status, tx("Removed {item}.", { item: label(removed) }), () => {
        state.lines.splice(Math.min(index, state.lines.length), 0, removed);
        save();
        renderLines();
        renderSoon();
      });
    }
  });

  // Bring in from this browser: the Waste Log and the guest compensation of the last 30 days, read only.
  root.querySelector("[data-import]").addEventListener("click", () => {
    const day = today();
    // Read as data: an example either tool holds is not brought in (ToolKit readOwn).
    const waste = wasteTotal(readOwn(`sc-waste-log${SUFFIX}`, null), day);
    const comp = complaintsTotal(readOwn(`sc-guest-complaints${SUFFIX}`, null), day);
    const said = [];
    if (waste && waste.total > 0) {
      mergeImport(state.lines, "waste-log", "internal", data.text.wasteLine, waste.total);
      said.push(tx("Waste Log: {total} from {n} entries", { total: money(waste.total), n: waste.count }));
    }
    if (comp && comp.total > 0) {
      mergeImport(state.lines, "guest-complaints", "external", data.text.complaintsLine, comp.total);
      said.push(tx("Guest Complaints: {total} of compensation from {n} complaints", { total: money(comp.total), n: comp.count }));
    }
    if (!said.length) { flash(status, tx("Nothing to bring in: this browser holds no Waste Log entries and no guest compensation with a value in the last 30 days.")); return; }
    own();
    save();
    renderLines();
    renderSoon();
    status.textContent = `${tx("Brought in for the last 30 days")}: ${said.join(" · ")}.`;
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.lines.length || !window.confirm(tx("Clear all {n} cost lines?", { n: state.lines.length }))) return;
    Object.assign(state, { lines: [], example: false });
    save();
    renderAll();
  });

  // Tables and files --------------------------------------------------------------------------------------------------
  const tableRows = () => {
    const o = options();
    const rows = [[tx("Category"), tx("Cost item"), tx("Basis"), tx("Quantity"), tx("Rate (€)"), tx("Amount (€)"), tx("Period"), tx("Cost per period (€)"), tx("€ per month"), tx("€ per year")]];
    const r2 = (v) => Math.round(v * 100) / 100;
    data.categories.forEach((c) => state.lines.filter((line) => line.cat === c.key).forEach((line) => {
      const fixed = line.basis === "fixed";
      const rate = !fixed && !line.rate.trim() && line.basis === "hours" ? state.setup.hourlyRate : line.rate;
      rows.push([c.name, label(line), basisOf(line.basis).name, fixed ? "" : line.qty, fixed ? "" : rate, fixed ? line.amount : "", periodOf(line.period).name, r2(lineCost(line, o)), r2(lineMonthly(line, o)), r2(lineMonthly(line, o) * 12)]);
    }));
    const t = totals(state.lines, o);
    data.categories.forEach((c) => rows.push([c.name, tx("Total"), "", "", "", "", "", "", r2(t.month[c.key]), r2(t.year[c.key])]));
    rows.push([tx("Cost of quality"), "P + A + IF + EF", "", "", "", "", "", "", r2(t.coq), r2(t.coqYear)]);
    rows.push([tx("Cost of poor quality"), "IF + EF", "", "", "", "", "", "", r2(t.copq), r2(t.copqYear)]);
    return rows;
  };
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.lines.length) downloadCsv(data.csv, tableRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.lines.length) downloadXlsx(data.csv, tableRows(), { sheet: "COQ" }); });

  // Results ------------------------------------------------------------------------------------------------------------
  const analyse = () => {
    const o = options();
    const t = totals(state.lines, o);
    const s = scenario(t, cutShare(), investValue());
    const items = pareto(state.lines, o);
    const failures = pareto(state.lines, o, FAILURE);
    const unit = sector();
    return {
      t, s, items, failures, unit,
      copqRevenue: revenueShare(t.copq, state.setup.revenue),
      copqWideRevenue: revenueShare(t.copqWide, state.setup.revenue),
      coqRevenue: revenueShare(t.coq, state.setup.revenue),
      coqUnit: perUnit(t.coq, state.setup.volume),
      copqUnit: perUnit(t.copq, state.setup.volume),
      zero: state.lines.filter((line) => !(lineCost(line, o) > 0)).length,
    };
  };
  const ratioText = (ratio) => (ratio === null ? "–" : `${num(ratio, 1)} : 1`);
  const scenarioLines = (a) => [
    [tx("Failure costs saved"), `${pct(a.s.cut, 0)} × ${money(a.t.copq)} × 12 = ${money(a.s.failureSavedYear)}`],
    [tx("Extra prevention"), `${money(a.s.invest)} × 12 = ${money(a.s.addedYear)}`],
    [tx("Net saving per year"), `${money(a.s.failureSavedYear)} − ${money(a.s.addedYear)} = ${money(a.s.netYear)}`],
  ];
  const biggestFailure = (a) => a.failures[0] || null;
  const actionOf = (a) => {
    const top = biggestFailure(a);
    if (!top) return null;
    return {
      title: tx("Cut {item}: {cost} a month of poor quality", { item: label(top.line), cost: money(top.value) }),
      detail: tx("{item} ({category}) is {share} of the cost of poor quality: {month} a month, {year} a year. Find the cause, remove it and measure the cost again next month.", { item: label(top.line), category: catOf(top.line.cat).name, share: pct(top.share, 0), month: money(top.value), year: money(top.value * 12) }),
      check: tx("The monthly cost of this line in Cost of Quality, a month after the change"),
      source: TOOL,
      priority: "High",
    };
  };
  const summaryText = (a) => {
    const lines = [`${data.title} | Stiven Catalyst`, `${sector().name} · ${tx("as of {date}", { date: window.ToolKit.showDate(today()) })}`, ""];
    lines.push(
      `${tx("Cost of quality")}: ${money(a.t.coq)} ${tx("a month")} · ${money(a.t.coqYear)} ${tx("a year")}`,
      `${tx("Cost of poor quality")}: ${money(a.t.copq)} ${tx("a month")} · ${money(a.t.copqYear)} ${tx("a year")}${a.copqRevenue !== null ? ` · ${tx("{share} of revenue", { share: pct(a.copqRevenue, 1) })}` : ""}`,
      `${tx("With appraisal counted as poor quality")}: ${money(a.t.copqWide)} ${tx("a month")}${a.copqWideRevenue !== null ? ` · ${tx("{share} of revenue", { share: pct(a.copqWideRevenue, 1) })}` : ""}`,
      `${tx("Failure : prevention and appraisal")}: ${ratioText(a.t.ratio)}`,
    );
    if (a.coqUnit !== null) lines.push(`${tx("Per {unit}", { unit: a.unit.unitOne })}: ${tx("cost of quality")} ${euro.format(a.coqUnit)} · ${tx("cost of poor quality")} ${euro.format(a.copqUnit)}`);
    lines.push("", `${tx("The split")}:`);
    data.categories.forEach((c) => lines.push(`${c.short} ${c.name}: ${money(a.t.month[c.key])} ${tx("a month")} (${pct(a.t.shares[c.key], 0)})`));
    lines.push("", `${tx("Top items")}:`);
    a.items.slice(0, 5).forEach((item, i) => lines.push(`${i + 1}. ${label(item.line)} [${catOf(item.line.cat).short}]: ${money(item.value)} ${tx("a month")} (${pct(item.share, 0)})`));
    lines.push("", `${tx("Scenario")}: ${tx("failure costs fall by {cut}, prevention rises by {invest} a month", { cut: pct(a.s.cut, 0), invest: money(a.s.invest) })}`);
    scenarioLines(a).forEach(([name, text]) => lines.push(`${name}: ${text}`));
    return lines.join("\n");
  };
  const paretoTable = (a) => () => ({
    source: data.title,
    headers: [tx("Cost item"), tx("Category"), tx("€ per month")],
    rows: a.items.map((item) => [label(item.line), catOf(item.line.cat).name, String(Math.round(item.value * 100) / 100)]),
    map: { category: 0, count: -1, value: 2, date: -1, filter: 1 },
    measure: "value",
    valueLabel: tx("€ per month"),
  });
  const table = (headers, rows, className, foot) => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const node = el("table", `dl-table ${className}`);
    const hr = el("tr");
    headers.forEach(([text, cls]) => { const th = el("th", cls, text); th.scope = "col"; hr.append(th); });
    const thead = el("thead");
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach(([text, cls]) => tr.append(el("td", cls, text)));
      tbody.append(tr);
    });
    node.append(thead, tbody);
    if (foot) {
      const tfoot = el("tfoot");
      const tr = el("tr", "cq-total");
      foot.forEach(([text, cls]) => tr.append(el("td", cls, text)));
      tfoot.append(tr);
      node.append(tfoot);
    }
    wrap.append(node);
    return wrap;
  };
  // One bar of the whole, split by category: the words and the euros say what each part is; the colour repeats it.
  const splitBar = (t) => {
    const bar = el("div", "cq-split");
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", data.categories.map((c) => `${c.name} ${pct(t.shares[c.key], 0)}`).join(", "));
    data.categories.forEach((c) => {
      if (!(t.shares[c.key] > 0)) return;
      const part = el("span", `cq-split-part is-${c.key}`, t.shares[c.key] >= 0.08 ? `${c.short} ${pct(t.shares[c.key], 0)}` : "");
      part.style.width = `${t.shares[c.key] * 100}%`;
      part.title = `${c.name}: ${money(t.month[c.key])} · ${pct(t.shares[c.key], 0)}`;
      bar.append(part);
    });
    return bar;
  };
  const splitRows = (a) => data.categories.map((c) => [[`${c.short} · ${c.name}`], [money(a.t.month[c.key]), "num"], [money(a.t.year[c.key]), "num"], [pct(a.t.shares[c.key], 0), "num"]]);
  const splitHeaders = () => [[tx("Category")], [tx("A month"), "num"], [tx("A year"), "num"], [tx("Share of total"), "num"]];

  // The one-page management summary: printed instead of the page.
  const renderPrint = (a) => {
    const head = el("div", "cq-print-head");
    head.append(el("p", "kicker", `${data.title} · ${sector().name}`), el("h2", null, tx("Quality costs {coq} a month; {copq} of it is the cost of poor quality", { coq: money(a.t.coq), copq: money(a.t.copq) })), el("p", "cq-print-meta", tx("as of {date}", { date: window.ToolKit.showDate(today()) })));
    const keys = table([[tx("Figure")], [tx("A month"), "num"], [tx("A year"), "num"], [tx("Note")]], [
      [[tx("Cost of quality")], [money(a.t.coq), "num"], [money(a.t.coqYear), "num"], ["P + A + IF + EF"]],
      [[tx("Cost of poor quality")], [money(a.t.copq), "num"], [money(a.t.copqYear), "num"], [a.copqRevenue !== null ? tx("{share} of revenue", { share: pct(a.copqRevenue, 1) }) : "IF + EF"]],
      [[tx("With appraisal counted as poor quality")], [money(a.t.copqWide), "num"], [money(a.t.copqWide * 12), "num"], [a.copqWideRevenue !== null ? tx("{share} of revenue", { share: pct(a.copqWideRevenue, 1) }) : "A + IF + EF"]],
      [[tx("Failure : prevention and appraisal")], [ratioText(a.t.ratio), "num"], [""], [""]],
      ...(a.coqUnit !== null ? [[[tx("Per {unit}", { unit: a.unit.unitOne })], [euro.format(a.coqUnit), "num"], [""], [tx("cost of poor quality {x}", { x: euro.format(a.copqUnit) })]]] : []),
    ], "cq-print-table");
    const split = table(splitHeaders(), splitRows(a), "cq-print-table");
    const top = table([[tx("No."), "num"], [tx("Cost item")], [tx("Category")], [tx("A month"), "num"], [tx("Share of total"), "num"]], a.items.slice(0, 6).map((item, i) => [[String(i + 1), "num"], [label(item.line)], [catOf(item.line.cat).name], [money(item.value), "num"], [pct(item.share, 0), "num"]]), "cq-print-table");
    const sc = el("div", "cq-print-scenario");
    sc.append(el("h3", null, `${tx("Scenario")}: ${tx("failure costs fall by {cut}, prevention rises by {invest} a month", { cut: pct(a.s.cut, 0), invest: money(a.s.invest) })}`));
    scenarioLines(a).forEach(([name, text]) => { const p = el("p"); p.append(el("strong", null, `${name}: `), text); sc.append(p); });
    printBox.replaceChildren(head, el("h3", null, tx("Key figures")), keys, el("h3", null, tx("The split")), split, el("h3", null, tx("Top items")), top, sc, el("p", "cq-print-foot", data.text.printFoot));
  };

  const renderResults = () => {
    note.hidden = !state.example;
    results.replaceChildren();
    const a = analyse();
    const any = a.t.coq > 0;
    results.hidden = !any;
    if (!any) { printBox.replaceChildren(); return; }

    const top = el("div", "result-head");
    top.append(el("p", "kicker", `${tx("Result")} · ${sector().name}`));
    const title = el("h2");
    const [p0, p1, p2] = tx("Quality costs {coq} a month; {copq} of it is the cost of poor quality", { coq: "\u0000", copq: "\u0001" }).split(/[\u0000\u0001]/);
    title.append(p0, money(a.t.coq), p1, el("span", null, money(a.t.copq)), p2 ?? "");
    top.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Cost of quality"), money(a.t.coq), tx("a month · {year} a year · P + A + IF + EF", { year: money(a.t.coqYear) })));
    stats.append(stat(tx("Cost of poor quality"), money(a.t.copq), tx("a month · {year} a year · internal + external failure", { year: money(a.t.copqYear) })));
    stats.append(stat(tx("COPQ share of revenue"), a.copqRevenue !== null ? pct(a.copqRevenue, 1) : "–", a.copqRevenue !== null ? tx("of {revenue} revenue a month; with appraisal {share}", { revenue: money(amount(state.setup.revenue)), share: pct(a.copqWideRevenue, 1) }) : tx("enter the revenue per month to see it")));
    stats.append(stat(tx("Failure : prevention and appraisal"), ratioText(a.t.ratio), a.t.ratio !== null ? tx("{failure} of failure against {conformance} spent preventing and checking", { failure: money(a.t.copq), conformance: money(a.t.conformance) }) : tx("no prevention or appraisal costs yet")));
    if (a.coqUnit !== null) stats.append(stat(tx("Per {unit}", { unit: a.unit.unitOne }), euro.format(a.coqUnit), tx("cost of quality; poor quality alone {x}", { x: euro.format(a.copqUnit) })));
    stats.append(stat(tx("Net saving per year"), money(a.s.netYear), tx("if failure falls by {cut} and prevention rises by {invest} a month", { cut: pct(a.s.cut, 0), invest: money(a.s.invest) })));

    const notes = [];
    if (a.zero) notes.push(el("p", "dl-warning", tx("{n} lines have no cost yet and count as zero.", { n: a.zero })));
    const missing = data.categories.filter((c) => !(a.t.month[c.key] > 0));
    if (missing.length) notes.push(el("p", "dl-panel-note", tx("No costs yet for: {list}. The total is only as complete as its four parts.", { list: missing.map((c) => c.name).join(", ") })));
    if (a.s.netYear < 0) notes.push(el("p", "dl-warning", tx("In this scenario the extra prevention costs more than it saves: failure would have to fall by at least {cut} to pay for it.", { cut: pct(a.s.breakEven ?? 0, 0) })));

    const big = biggestFailure(a);
    const focus = big ? focusCard({
      title: label(big.line),
      detail: tx("{month} a month · {category}", { month: money(big.value), category: catOf(big.line.cat).name }),
      lede: tx("The largest cost of poor quality: {share} of all failure costs, {year} a year. Halving it would save {half} a year.", { share: pct(big.share, 0), year: money(big.value * 12), half: money(big.value * 6) }),
      advice: data.advice[big.line.cat],
    }) : null;

    const problem = big ? tx("{item} costs {cost} a month of poor quality", { item: label(big.line), cost: money(big.value) }) : tx("Quality costs {coq} a month; {copq} of it is the cost of poor quality", { coq: money(a.t.coq), copq: money(a.t.copq) });
    const actions = resultActions(() => summaryText(a), problem, a.items.length ? paretoTable(a) : null);
    if (big) {
      const action = () => actionOf(a);
      actions.append(AS ? AS.linkButton(tx("Add to actions"), action) : window.ToolKit.trackerLink(tx("Add to actions"), action));
    }

    const panels = [];
    // The split by category: a bar of the whole and the columns of each part.
    const splitPanel = panel(tx("The split: P, A, IF, EF"), data.text.splitNote);
    splitPanel.append(splitBar(a.t));
    if (CK) {
      splitPanel.append(CK.figure(CK.bars(data.categories.map((c) => ({ label: `${c.short} · ${c.name}`, value: Math.round(a.t.month[c.key]), color: catColor[c.key], tip: `${c.name}: ${money(a.t.month[c.key])} ${tx("a month")} · ${pct(a.t.shares[c.key], 0)}` })), { title: `${data.title}: ${tx("The split: P, A, IF, EF")}`, unit: tx("€ per month"), format: (v) => num(v, 0) }), { fileName: `${data.csv}-split` }));
    }
    splitPanel.append(table(splitHeaders(), splitRows(a), "cq-split-table", [[tx("Cost of quality")], [money(a.t.coq), "num"], [money(a.t.coqYear), "num"], [pct(1, 0), "num"]]));
    splitPanel.append(el("p", "dl-panel-note", tx("With appraisal counted as poor quality, as some authors do: {month} a month{share}.", { month: money(a.t.copqWide), share: a.copqWideRevenue !== null ? ` (${tx("{share} of revenue", { share: pct(a.copqWideRevenue, 1) })})` : "" })));
    panels.push(splitPanel);

    // The items, largest first: where the money goes.
    const paretoPanel = panel(tx("Top items (Pareto)"), tx("Every line by its cost a month, largest first, with the running share. Failure lines are where the money is lost; prevention lines are what is spent to stop it."));
    if (CK) {
      const shown = a.items.slice(0, 10);
      paretoPanel.append(CK.figure(CK.bars(shown.map((item) => ({ label: label(item.line), value: Math.round(item.value), color: catColor[item.line.cat], tip: `${label(item.line)} (${catOf(item.line.cat).name}): ${money(item.value)} · ${pct(item.share, 0)} · ${tx("cumulative")} ${pct(item.cum, 0)}` })), { title: `${data.title}: ${tx("Top items (Pareto)")}`, unit: tx("€ per month"), format: (v) => num(v, 0) }), { fileName: `${data.csv}-pareto` }));
      paretoPanel.append(CK.legend(data.categories.map((c) => ({ label: `${c.short} · ${c.name}`, color: catColor[c.key] }))));
    }
    paretoPanel.append(table([[tx("No."), "num"], [tx("Cost item")], [tx("Category")], [tx("A month"), "num"], [tx("Share of total"), "num"], [tx("Cumulative"), "num"]], a.items.map((item, i) => [[String(i + 1), "num"], [label(item.line)], [catOf(item.line.cat).short], [money(item.value), "num"], [pct(item.share, 0), "num"], [pct(item.cum, 0), "num"]]), "cq-pareto"));
    panels.push(paretoPanel);

    // The scenario, with its arithmetic in plain sight.
    const scPanel = panel(tx("Scenario: less failure, more prevention"), tx("failure costs fall by {cut}, prevention rises by {invest} a month", { cut: pct(a.s.cut, 0), invest: money(a.s.invest) }));
    const sums = el("dl", "cq-sums");
    scenarioLines(a).forEach(([name, text], i) => {
      const row = el("div", i === 2 ? "cq-sum is-net" : "cq-sum");
      row.append(el("dt", null, name), el("dd", null, text));
      sums.append(row);
    });
    scPanel.append(sums);
    const after = el("div", "dl-stats cq-after");
    after.append(
      stat(tx("Cost of quality after"), money(a.s.coqAfter), tx("a month, from {before}", { before: money(a.t.coq) })),
      stat(tx("Failure : prevention and appraisal after"), ratioText(a.s.ratioAfter), tx("from {before}", { before: ratioText(a.t.ratio) })),
    );
    if (a.s.invest > 0 && a.s.breakEven !== null) after.append(stat(tx("Break-even cut"), pct(a.s.breakEven, 1), tx("the cut in failure costs that pays for the extra prevention")));
    scPanel.append(after, el("p", "dl-panel-note", data.text.scenarioNote));
    panels.push(scPanel);

    // How to read it: the model and its limits.
    const reading = panel(tx("How to read the numbers"));
    data.text.reading.forEach((text) => reading.append(el("p", "dl-panel-note", text)));
    panels.push(reading);

    resultLayout(results, { head: top, stats, notes, focus, actions, panels });
    renderPrint(a);
  };
  const renderSoon = renderOnPause(renderResults, () => state.lines.length, 40);

  const renderAll = () => {
    showInputs();
    renderLines();
    renderResults();
  };
  renderAll();
})();
