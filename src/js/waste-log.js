(() => {
  // Waste Log: what is thrown away or written off, weighed or counted where it happens (the breakfast buffet, the
  // kitchen, the warehouse, housekeeping), valued at purchase cost and followed against a reduction target. The log is
  // { rows: [{ date, shift, area, category, item, qty, unit, cost (€ per unit), reason, dest, note }], covers: { date:
  // guests served } }. Shift and area are names (the workplace profile's or the page's own); category, unit, reason
  // and destination are keys of the data file. A night shift after midnight logs on the new day, as in the other logs.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const DAY = 864e5;
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  // Cents and grams without the float noise of sums (0.1 + 0.2).
  const round2 = (n) => Math.round(n * 100 + (n >= 0 ? 1e-7 : -1e-7)) / 100;
  const round6 = (n) => Math.round(n * 1e6) / 1e6;
  // Calendar days from one date to another, both counted: 1–7 Oct is 7 days.
  const days = (from, to) => (isIso(from) && isIso(to) && to >= from ? between(from, to) + 1 : 0);

  // Value of an entry = quantity × cost per unit, in euro to the cent.
  const value = (row) => round2((Number(row.qty) || 0) * (Number(row.cost) || 0));

  const UNITS = ["kg", "pcs", "l"];
  // The totals of some rows: weight only of the rows in kg (pieces and litres are counted apart, never added to kg).
  const totals = (rows) => {
    const out = { n: rows.length, kg: 0, pcs: 0, l: 0, value: 0 };
    rows.forEach((row) => {
      if (UNITS.includes(row.unit)) out[row.unit] += Number(row.qty) || 0;
      out.value += value(row);
    });
    return { n: out.n, kg: round6(out.kg), pcs: round6(out.pcs), l: round6(out.l), value: round2(out.value) };
  };

  // Food waste per cover = kg of food waste × 1000 ÷ covers, in grams: the usual food-waste figure of a restaurant or
  // a breakfast. Only rows in kg of the food categories count, and only on days of the period with covers entered:
  // a day without covers would add waste without its guests.
  const perCover = (rows, covers, from, to, foodKeys) => {
    const food = new Set(foodKeys);
    const withCovers = new Set();
    let guests = 0;
    const span = days(from, to);
    for (let i = 0; i < span; i++) {
      const date = addDays(from, i);
      const n = Number(covers?.[date]);
      if (n > 0) {
        withCovers.add(date);
        guests += n;
      }
    }
    const kg = round6(rows.filter((row) => row.unit === "kg" && food.has(row.category) && withCovers.has(row.date)).reduce((sum, row) => sum + (Number(row.qty) || 0), 0));
    return { kg, covers: guests, days: withCovers.size, missing: span - withCovers.size, grams: guests > 0 ? (kg * 1000) / guests : null };
  };

  // The change from before to now as a share of before: €420 to €389 is −7.4 %. null when before is 0 or missing.
  const change = (now, before) => (Number.isFinite(now) && Number.isFinite(before) && before > 0 ? (now - before) / before : null);

  // Weeks from Monday to Sunday over the period; each week counts only its days inside the period, so a week cut by
  // the period is compared per day, not as a short week.
  const weekly = (rows, from, to, destKeys = []) => {
    if (!isIso(from) || !isIso(to) || to < from) return [];
    const weeks = [];
    for (let week = mondayOf(from); week <= to; week = addDays(week, 7)) {
      const start = week < from ? from : week;
      const end = addDays(week, 6) > to ? to : addDays(week, 6);
      const inWeek = rows.filter((row) => row.date >= start && row.date <= end);
      const sum = totals(inWeek);
      const byDest = Object.fromEntries(destKeys.map((key) => [key, round2(inWeek.filter((row) => row.dest === key).reduce((s, row) => s + value(row), 0))]));
      const n = days(start, end);
      weeks.push({ week, from: start, to: end, days: n, kg: sum.kg, value: sum.value, kgPerDay: sum.kg / n, valuePerDay: sum.value / n, byDest });
    }
    return weeks;
  };

  // The baseline: the first `weeks` weeks of the log, from its first entry, as an average per calendar day. With
  // fewer days logged it is the days there are, and says it is not complete yet.
  const baseline = (rows, weeks) => {
    const dates = rows.map((row) => row.date).filter(isIso).sort();
    if (!dates.length) return null;
    const first = dates[0];
    const end = addDays(first, weeks * 7 - 1);
    const to = dates.at(-1) < end ? dates.at(-1) : end;
    const sum = totals(rows.filter((row) => row.date >= first && row.date <= to));
    const n = days(first, to);
    return { from: first, to, days: n, complete: dates.at(-1) >= end, kg: sum.kg, value: sum.value, kgPerDay: sum.kg / n, valuePerDay: sum.value / n };
  };
  // Target = baseline per day × (1 − reduction).
  const target = (base, reduction) => (base ? { kgPerDay: base.kgPerDay * (1 - reduction / 100), valuePerDay: base.valuePerDay * (1 - reduction / 100) } : null);

  // The Pareto of a field by value: largest first, its share and the cumulative share; class A is every key that
  // starts below 80 % of the total, as the Pareto tool classes them.
  const pareto = (rows, field) => {
    const sums = new Map();
    rows.forEach((row) => sums.set(row[field], (sums.get(row[field]) || 0) + value(row)));
    const total = [...sums.values()].reduce((a, b) => a + b, 0);
    let before = 0;
    return [...sums].map(([key, sum]) => ({ key, value: round2(sum) }))
      .sort((a, b) => b.value - a.value || String(a.key).localeCompare(String(b.key)))
      .map((item) => {
        const share = total ? item.value / total : 0;
        const cls = before < 0.8 - 1e-9 ? "A" : before < 0.95 - 1e-9 ? "B" : "C";
        before += share;
        return { ...item, share, cumulative: before, cls };
      });
  };

  // Where the waste went, in the order of the waste hierarchy (the data file's order), by value: every unit counts.
  const destinations = (rows, keys) => {
    const total = rows.reduce((sum, row) => sum + value(row), 0);
    return keys.map((key) => {
      const sum = round2(rows.filter((row) => row.dest === key).reduce((s, row) => s + value(row), 0));
      return { key, value: sum, share: total ? sum / total : 0 };
    });
  };

  // Settings typed in the page, or the data file's defaults.
  const settings = (cfg, typed = {}) => {
    const pick = (raw, fallback, min, max, whole) => {
      const n = kit.parseNumber(String(raw ?? "").trim());
      return Number.isFinite(n) && n >= min && n <= max && (!whole || Number.isInteger(n)) ? n : fallback;
    };
    return { reduction: pick(typed.reduction, cfg.target.reduction, 1, 90, false), baselineWeeks: pick(typed.baselineWeeks, cfg.target.baselineWeeks, 1, 12, true) };
  };

  // A pasted or typed name to its key: the key itself, the name in this language, or the start of it.
  const keyOf = (raw, list, aliases = {}) => {
    const text = String(raw ?? "").trim().toLowerCase();
    if (!text) return "";
    const names = list.map((item) => [item.key, [item.key, item.name, ...(aliases[item.key] || [])].map((name) => String(name).toLowerCase())]);
    const exact = names.find(([, n]) => n.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 3 && names.find(([, n]) => n.some((name) => name.length >= 3 && (name.startsWith(text) || text.startsWith(name))));
    return start ? start[0] : "";
  };
  const UNIT_ALIASES = { kg: ["kilo", "kilogram", "kilogramm", "kilogramë"], pcs: ["pc", "pce", "piece", "pieces", "stk", "stk.", "stück", "copë", "cope", "copa", "x"], l: ["litre", "liter", "litres", "liters", "ltr", "litër", "litra"] };
  // A typed shift or area to the name of the list when it is one of them (in any case), else as typed.
  const nameOf = (raw, names) => {
    const text = String(raw ?? "").trim();
    return names.find((name) => name.toLowerCase() === text.toLowerCase()) || text;
  };

  // A saved row, cleaned: no date or no quantity above 0, no row. An unknown category or reason becomes "other"; an
  // unknown destination residual waste, the one that assumes nothing was recovered.
  const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const cleanRow = (row, cfg) => {
    if (!isObject(row)) return null;
    const date = kit.parseDate(row.date);
    const qty = typeof row.qty === "number" ? row.qty : kit.parseNumber(row.qty);
    if (!date || !(qty > 0)) return null;
    const cost = typeof row.cost === "number" ? row.cost : kit.parseNumber(row.cost);
    const s = (v) => (typeof v === "string" ? v.trim() : "");
    const has = (list, key) => list.some((item) => item.key === key);
    return {
      date,
      shift: s(row.shift).slice(0, 40),
      area: s(row.area).slice(0, 60),
      category: has(cfg.categories, row.category) ? row.category : "other",
      item: s(row.item).slice(0, 120),
      qty: round6(qty),
      unit: has(cfg.units, row.unit) ? row.unit : "kg",
      cost: Number.isFinite(cost) && cost > 0 ? round6(cost) : 0,
      reason: has(cfg.reasons, row.reason) ? row.reason : "other",
      dest: has(cfg.destinations, row.dest) ? row.dest : "residual",
      note: s(row.note).slice(0, 300),
    };
  };
  const cleanRows = (rows, cfg) => (Array.isArray(rows) ? rows.map((row) => cleanRow(row, cfg)).filter(Boolean) : []);
  // Covers per date: whole numbers above 0 only.
  const cleanCovers = (map) => {
    const out = {};
    if (isObject(map)) Object.entries(map).forEach(([date, n]) => { const v = Number(n); if (isIso(date) && Number.isInteger(v) && v > 0) out[date] = v; });
    return out;
  };

  // Rows from a spreadsheet: date, shift, area, category, item, quantity, unit, cost per unit €, reason, where it
  // went, note. A row needs a date and a quantity; a first row without a date is a header.
  const importRows = (text, cfg, lists = {}) => {
    const shifts = lists.shifts || cfg.shifts;
    const areas = lists.areas || cfg.areas;
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, shift, area, category, item, qty, unit, cost, reason, dest, note] = cells;
      const row = cleanRow({
        date, item, qty, cost, note,
        shift: nameOf(shift, shifts),
        area: nameOf(area, areas),
        category: keyOf(category, cfg.categories) || "other",
        unit: keyOf(unit, cfg.units, UNIT_ALIASES) || "kg",
        reason: keyOf(reason, cfg.reasons) || "other",
        dest: keyOf(dest, cfg.destinations) || "residual",
      }, cfg);
      if (row) added.push(row);
      else if (index > 0 || kit.parseDate(date)) skipped++;
    });
    return { added, skipped };
  };

  // The example of the data file, moved forward by whole weeks so that its last day is today or just before: the
  // weekdays (and the busy weekends) stay where they are.
  const exampleShift = (cfg, today) => {
    const last = addDays(cfg.example.start, Math.max(...cfg.example.rows.map((row) => row.day)));
    const weeks = Math.floor(between(last, today) / 7);
    return weeks > 0 ? weeks * 7 : 0;
  };
  const exampleRows = (cfg, today) => {
    const shift = exampleShift(cfg, today);
    const ex = cfg.example;
    return cleanRows(ex.rows.map((row) => ({
      ...row,
      date: addDays(ex.start, row.day + shift),
      shift: cfg.shifts[row.shift],
      area: cfg.areas[row.area],
      item: ex.items[row.item] || row.item,
      note: ex.notes[row.note] || "",
    })), cfg);
  };
  const exampleCovers = (cfg, today) => {
    const shift = exampleShift(cfg, today);
    const out = {};
    cfg.example.covers.forEach((n, i) => { if (n > 0) out[addDays(cfg.example.start, i + shift)] = n; });
    return out;
  };

  window.WasteLogMath = {
    addDays, mondayOf, days, round2, value, totals, perCover, change, weekly, baseline, target, pareto, destinations,
    settings, keyOf, nameOf, cleanRow, cleanRows, cleanCovers, importRows, exampleShift, exampleRows, exampleCovers,
  };

  // The page.
  const dataEl = document.getElementById("waste-log-data");
  const root = document.querySelector("[data-waste-log]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Workplace = window.Workplace || null;
  const Actions = window.ActionsStore || null;
  const { tx, num, showDate, write, loadState, el, int, euro, pct, today, parseNumber, parseDate, logBook, resultLayout, panel, stat, barList, focusCard, resultActions, flash, dayMonth, inRange, previousRange, changeText, rangeText, lower } = kit;
  const M = window.WasteLogMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const TOOL = "waste-log";
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const form = entry.elements;
  const entryStatus = root.querySelector("[data-entry-status]");
  const valueNote = root.querySelector("[data-value-note]");
  const paste = root.querySelector("#wl-paste");
  const coversForm = root.querySelector("[data-covers]");
  const coversStatus = root.querySelector("[data-covers-status]");
  const areaFilter = root.querySelector("[data-filter=area]");
  const categoryFilter = root.querySelector("[data-filter=category]");
  const itemList = root.querySelector("#wl-items");

  const state = loadState(KEY, { rows: [], covers: {}, reduction: "", baselineWeeks: "", fArea: "", fCategory: "", costs: {}, example: {}, totalsFor: {}, from: "", to: "" });
  state.rows = M.cleanRows(state.rows, data);
  state.covers = M.cleanCovers(state.covers);
  if (!state.costs || typeof state.costs !== "object" || Array.isArray(state.costs)) state.costs = {};
  const save = () => write(KEY, state);

  const nameIn = (list, key) => (list.find((item) => item.key === key) || { name: key }).name;
  const catName = (key) => nameIn(data.categories, key);
  const reasonName = (key) => nameIn(data.reasons, key);
  const destName = (key) => nameIn(data.destinations, key);
  const unitName = (key) => nameIn(data.units, key);
  const money = (v) => euro.format(v);
  const wholeEuro = new Intl.NumberFormat(kit.LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const kg = (v) => `${num(v, 1)} kg`;
  const digits = (q) => (Number.isInteger(q) ? 0 : Math.abs(q * 10 - Math.round(q * 10)) < 1e-9 ? 1 : 2);
  const qtyText = (row) => `${num(row.qty, digits(row.qty))} ${unitName(row.unit)}`;
  const weekLabel = dayMonth(false);
  const FOOD = data.categories.filter((item) => item.food).map((item) => item.key);
  const DEST = data.destinations.map((item) => item.key);
  const S = () => M.settings(data, state);
  const shiftNames = () => (Workplace?.shifts().length ? Workplace.shifts() : data.shifts);
  const areaNames = () => (Workplace?.areas().length ? Workplace.areas().map((area) => area.name) : data.areas);

  // The entry form's shift and area lists follow the workplace profile; the filter offers every area in the log too.
  const fillLists = () => {
    if (Workplace) {
      // A choice the profile no longer has gives way to its first one.
      const keep = (select, names) => Workplace.fillSelect(select, names, names.includes(select.value) ? select.value : names[0]);
      keep(form.shift, shiftNames());
      keep(form.area, areaNames());
    }
    const areas = [...new Set([...areaNames(), ...state.rows.map((row) => row.area).filter(Boolean)])];
    if (state.fArea && !areas.includes(state.fArea)) areas.push(state.fArea);
    const first = areaFilter.options[0];
    areaFilter.replaceChildren(first, ...areas.map((name) => { const option = el("option", null, name); option.value = name; return option; }));
    areaFilter.value = state.fArea;
    categoryFilter.value = data.categories.some((item) => item.key === state.fCategory) ? state.fCategory : "";
    itemList.replaceChildren(...Object.values(state.costs).slice(-60).map((known) => { const option = el("option"); option.value = known.item; return option; }));
  };

  const filtered = () => state.rows.filter((row) => (!state.fArea || row.area === state.fArea) && (!state.fCategory || row.category === state.fCategory));
  const filterText = () => [state.fArea, state.fCategory && catName(state.fCategory)].filter(Boolean).join(" · ");

  const analyse = () => {
    const base = filtered();
    const rows = inRange(base, state.from, state.to);
    const dates = base.map((row) => row.date).sort();
    const from = state.from || dates[0] || "";
    const to = state.to || dates.at(-1) || "";
    const span = M.days(from, to);
    const sum = M.totals(rows);
    // The same number of days just before the period; with every day of the log shown, the last 7 days against the 7
    // before them, since nothing comes before the log.
    let compare = null;
    if (state.from && state.to) {
      const prev = previousRange({ from, to });
      compare = { label: tx("Against the {n} days before", { n: int.format(prev.days) }), now: sum, before: M.totals(inRange(base, prev.from, prev.to)) };
    } else if (span >= 14) {
      compare = { label: tx("Last 7 days against the 7 days before"), now: M.totals(inRange(base, M.addDays(to, -6), to)), before: M.totals(inRange(base, M.addDays(to, -13), M.addDays(to, -7))) };
    }
    if (compare) {
      compare.value = compare.before.n ? M.change(compare.now.value, compare.before.value) : null;
      compare.kg = compare.before.n ? M.change(compare.now.kg, compare.before.kg) : null;
    }
    const set = S();
    const base0 = M.baseline(base, set.baselineWeeks);
    const goal = M.target(base0, set.reduction);
    const weeks = M.weekly(rows, from, to, DEST);
    const latest = [...weeks].reverse().find((week) => week.days === 7) || weeks.at(-1) || null;
    return {
      base, rows, from, to, span, sum, compare, set, baseline: base0, goal, weeks, latest,
      perDay: span ? sum.value / span : null,
      cover: M.perCover(rows, state.covers, from, to, FOOD),
      byCategory: M.pareto(rows, "category"),
      byReason: M.pareto(rows, "reason"),
      byArea: M.pareto(rows, "area"),
      dest: M.destinations(rows, DEST),
    };
  };

  const otherUnits = (sum) => [sum.pcs ? `${num(sum.pcs, digits(sum.pcs))} ${unitName("pcs")}` : "", sum.l ? `${num(sum.l, digits(sum.l))} ${unitName("l")}` : ""].filter(Boolean).join(" · ");
  const gramsText = (cover) => (cover.grams === null ? "–" : `${int.format(Math.round(cover.grams))} g`);
  const coverNote = (cover) => (cover.grams === null
    ? tx("Enter the covers of the day to see grams per cover.")
    : `${tx("{kg} of food waste over {covers} covers on {d} days with covers", { kg: kg(cover.kg), covers: int.format(cover.covers), d: int.format(cover.days) })}${cover.missing ? ` · ${tx("{n} days without covers left out", { n: int.format(cover.missing) })}` : ""}`);
  const verdict = (now, goal) => (now <= goal + 1e-9 ? `✓ ${tx("on target")}` : `✕ ${tx("above target")}`);
  const problemText = (a) => {
    const top = a.byReason[0];
    if (!top) return "";
    return tx("{reason}: {value} of {total} lost in the period ({share}).", { reason: reasonName(top.key), value: money(top.value), total: money(a.sum.value), share: pct(top.share, 0) });
  };
  const targetLine = (a) => (a.goal ? tx("Target {target} per day: {r} below the baseline of {base} per day ({from} – {to})", { target: money(a.goal.valuePerDay), r: pct(a.set.reduction / 100, 0), base: money(a.baseline.valuePerDay), from: showDate(a.baseline.from), to: showDate(a.baseline.to) }) : "");

  const summaryText = (a) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Period")}: ${rangeText({ from: a.from, to: a.to })}${filterText() ? ` · ${filterText()}` : ""}`, ""];
    lines.push(`${tx("Total weight")}: ${kg(a.sum.kg)}${otherUnits(a.sum) ? ` (${tx("plus {units}", { units: otherUnits(a.sum) })})` : ""}`);
    lines.push(`${tx("Total value")}: ${money(a.sum.value)} · ${a.perDay === null ? "–" : money(a.perDay)} ${tx("per day")}`);
    if (a.compare) lines.push(`${a.compare.label}: ${tx("value {a} · weight {b}", { a: a.compare.value === null ? "–" : changeText(a.compare.value), b: a.compare.kg === null ? "–" : changeText(a.compare.kg) })}`);
    lines.push(`${tx("Food waste per cover")}: ${gramsText(a.cover)} (${coverNote(a.cover)})`);
    if (a.goal && a.latest) lines.push(`${tx("Week of {date}", { date: showDate(a.latest.week) })}: ${money(a.latest.valuePerDay)} ${tx("per day")} · ${verdict(a.latest.valuePerDay, a.goal.valuePerDay)} · ${targetLine(a)}`);
    lines.push("", `${tx("By reason")}:`);
    a.byReason.forEach((item) => lines.push(`- ${reasonName(item.key)}: ${money(item.value)} (${pct(item.share, 0)})`));
    lines.push("", `${tx("By category")}:`);
    a.byCategory.forEach((item) => lines.push(`- ${catName(item.key)}: ${money(item.value)} (${pct(item.share, 0)})`));
    lines.push("", `${tx("Where it went")}:`);
    a.dest.filter((item) => item.value > 0).forEach((item) => lines.push(`- ${destName(item.key)}: ${money(item.value)} (${pct(item.share, 0)})`));
    const top = a.byReason[0];
    if (top) {
      const advice = data.advice[top.key] || data.advice.default;
      lines.push("", `${tx("Start here")}: ${problemText(a)}`, `${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    return lines.join("\n");
  };

  // The entries of the period for Pareto: one row per entry, the reason as the category, the area as the filter and
  // the value in euro as the measure.
  const paretoTable = (a) => () => ({
    source: t.tool,
    template: TOOL,
    headers: [tx("Date"), tx("Area"), tx("Category"), tx("Reason"), tx("Item or product"), tx("Quantity"), tx("Unit"), tx("Value €")],
    rows: a.rows.map((row) => [row.date, row.area, catName(row.category), reasonName(row.reason), row.item, String(row.qty), unitName(row.unit), String(M.value(row))]),
    map: { date: 0, filter: 1, category: 3, count: -1, value: 7 },
    measure: "value",
    valueLabel: "€",
  });

  const actionButton = (getAction) => (Actions ? Actions.linkButton(tx("Add to actions"), getAction) : kit.trackerLink(tx("Add to actions"), getAction));
  const topAction = (a) => () => {
    const top = a.byReason[0];
    const advice = data.advice[top.key] || data.advice.default;
    const area = M.pareto(a.rows.filter((row) => row.reason === top.key), "area")[0]?.key || "";
    return {
      title: tx("Cut the waste from {reason}", { reason: lower(reasonName(top.key)) }),
      detail: `${problemText(a)} ${advice.moves[0]}`,
      source: TOOL,
      area,
      priority: top.share >= 0.3 ? "High" : "Medium",
      due: M.addDays(today(), 14),
      check: tx("The value per day from {reason} is down by {r} against the baseline over the next four weeks.", { reason: lower(reasonName(top.key)), r: pct(a.set.reduction / 100, 0) }),
    };
  };

  // The log on paper: every entry of the period, A4, only in print.
  const registerTable = (a) => {
    const wrap = el("section", "wl-register");
    wrap.append(el("h3", "result-label", `${t.tool} · ${rangeText({ from: a.from, to: a.to })}`));
    const table = el("table", "dl-table");
    const head = el("tr");
    [tx("Date"), tx("Shift"), tx("Area"), tx("Category"), tx("Item or product"), tx("Quantity"), tx("Value €"), tx("Reason"), tx("Where it went"), tx("Note")].forEach((name) => {
      const th = el("th", null, name);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    a.rows.forEach((row) => {
      const tr = el("tr");
      tr.append(el("td", "nowrap", showDate(row.date)), el("td", null, row.shift), el("td", null, row.area), el("td", null, catName(row.category)), el("td", null, row.item), el("td", "nowrap", qtyText(row)), el("td", "nowrap", money(M.value(row))), el("td", null, reasonName(row.reason)), el("td", null, destName(row.dest)), el("td", null, row.note));
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    return wrap;
  };

  const paretoPanel = (title, items, nameOfKey, fileName) => {
    const vital = items.filter((item) => item.cls === "A");
    const box = panel(title, `${tx("Largest first. The highlighted bars are the vital few that make up 80 % of the value:")} ${vital.map((item) => nameOfKey(item.key)).join(", ")}.`);
    box.append(Chart.figure(Chart.bars(items.map((item) => ({ label: nameOfKey(item.key), value: item.value, tip: `${nameOfKey(item.key)}: ${money(item.value)} (${pct(item.share, 0)}, ${tx("cumulative")} ${pct(item.cumulative, 0)})` })), { title, highlight: (bar) => vital.some((v) => nameOfKey(v.key) === bar.label), format: (v) => wholeEuro.format(v) }), { fileName }));
    return box;
  };

  const weekPanel = (a, measure) => {
    const isValue = measure === "value";
    const title = isValue ? tx("Value per day, by week") : tx("Weight per day, by week");
    const format = isValue ? (v) => wholeEuro.format(v) : (v) => num(v, 1);
    const show = isValue ? money : kg;
    const goal = a.goal ? (isValue ? a.goal.valuePerDay : a.goal.kgPerDay) : null;
    const note = `${tx("Weeks start on Monday; a week cut by the period counts only its days in it.")}${a.goal ? ` ${tx("Target")}: ${show(goal)} ${tx("per day")}${a.baseline.complete ? "" : ` (${tx("the baseline has only {n} days so far", { n: int.format(a.baseline.days) })})`}.` : ""}`;
    const box = panel(title, note);
    const points = a.weeks.map((week) => {
      const y = isValue ? week.valuePerDay : week.kgPerDay;
      const label = weekLabel(new Date(`${week.week}T00:00:00Z`));
      return { x: label, y, state: goal === null ? undefined : y <= goal + 1e-9 ? "ok" : "warn", tip: `${tx("Week of {date}", { date: showDate(week.week) })} (${int.format(week.days)} ${tx("days")}): ${show(y)} ${tx("per day")}${goal === null ? "" : ` · ${verdict(y, goal)}`}` };
    });
    box.append(Chart.figure(Chart.line([{ label: title, points }], { title, format, target: goal ?? undefined, yMin: 0, unit: isValue ? `€ ${tx("per day")}` : `kg ${tx("per day")}` }), { fileName: `waste-log-${isValue ? "value" : "kg"}-weeks` }));
    return box;
  };

  const destPanel = (a) => {
    const used = a.dest.filter((item) => item.value > 0);
    const box = panel(tx("Where it went"), `${tx("By value, so pieces and litres count too, in the order of the waste hierarchy:")} ${used.map((item) => `${destName(item.key)} ${pct(item.share, 0)}`).join(" · ")}.`);
    const keys = DEST.map(destName);
    box.append(Chart.figure(Chart.stacked(a.weeks.map((week) => ({ label: weekLabel(new Date(`${week.week}T00:00:00Z`)), parts: DEST.map((key) => ({ key: destName(key), value: week.byDest[key] })) })), { title: tx("Where it went"), keys, format: (v) => wholeEuro.format(v) }), { fileName: "waste-log-destination" }));
    box.append(el("p", "dl-panel-note", t.hierarchy));
    box.append(el("p", "dl-panel-note", t.feedNote));
    return box;
  };

  const areaPanel = (a) => {
    const box = panel(tx("By area"), tx("Value lost in each area in the period."));
    box.append(barList(a.byArea.map((item) => ({ key: item.key || "–", value: item.value, share: item.share })), { label: (item) => [money(item.value), ` · ${pct(item.share, 0)}`], highlight: (item) => item === a.byArea[0] }));
    return box;
  };

  const renderResults = () => {
    results.replaceChildren();
    fillLists();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const a = analyse();
    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${rangeText({ from: a.from, to: a.to })}${filterText() ? ` · ${filterText()}` : ""}`));
    const title = el("h2");
    if (!a.rows.length) {
      title.append(tx("No waste logged in this period."));
      head.append(title);
      results.append(head);
      return;
    }
    title.append(el("span", null, money(a.sum.value)), ` ${tx("lost")} · ${kg(a.sum.kg)}${a.cover.grams === null ? "" : ` · ${tx("{g} per cover", { g: gramsText(a.cover) })}`}`);
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Total weight"), kg(a.sum.kg), otherUnits(a.sum) ? tx("plus {units}, counted apart", { units: otherUnits(a.sum) }) : tx("{n} entries", { n: int.format(a.sum.n) })));
    stats.append(stat(tx("Total value"), money(a.sum.value), `${tx("{n} entries", { n: int.format(a.sum.n) })} · ${tx("quantity × cost per unit")}`));
    stats.append(stat(tx("Value per day"), a.perDay === null ? "–" : money(a.perDay), tx("{n} days in the period", { n: int.format(a.span) })));
    if (a.compare) stats.append(stat(tx("Change in value"), a.compare.value === null ? "–" : changeText(a.compare.value), a.compare.before.n ? `${a.compare.label} · ${money(a.compare.now.value)} / ${money(a.compare.before.value)} · ${tx("weight {b}", { b: a.compare.kg === null ? "–" : changeText(a.compare.kg) })}` : `${a.compare.label} · ${tx("no entries in those days")}`));
    else stats.append(stat(tx("Change in value"), "–", tx("Choose a period, or log at least 14 days, to compare.")));
    stats.append(stat(tx("Food waste per cover"), gramsText(a.cover), coverNote(a.cover)));
    if (a.goal && a.latest) stats.append(stat(tx("Against the target"), `${money(a.latest.valuePerDay)}`, `${tx("Week of {date}", { date: showDate(a.latest.week) })} · ${verdict(a.latest.valuePerDay, a.goal.valuePerDay)} · ${targetLine(a)}`));

    const notes = [];
    if (a.cover.grams !== null) notes.push(el("p", "dl-panel-note wl-cover-note", t.perCoverNote.replace("{categories}", FOOD.map(catName).join(", "))));

    let focus = null;
    const top = a.byReason[0];
    if (top) {
      const advice = data.advice[top.key] || data.advice.default;
      focus = focusCard({ title: reasonName(top.key), detail: pct(top.share, 0), lede: problemText(a), advice });
      const buttons = el("div", "tool-actions");
      buttons.append(actionButton(topAction(a)));
      focus.append(buttons);
    }

    const actions = resultActions(() => summaryText(a), problemText(a) || t.tool, paretoTable(a));
    const panels = [
      paretoPanel(tx("Value by category (Pareto)"), a.byCategory, catName, "waste-log-category"),
      paretoPanel(tx("Value by reason (Pareto)"), a.byReason, reasonName, "waste-log-reason"),
      weekPanel(a, "value"),
      weekPanel(a, "kg"),
      destPanel(a),
      areaPanel(a),
    ];
    resultLayout(results, { head, stats, notes, focus, actions, panels });
    results.append(registerTable(a));
  };

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      state.covers = {};
      state.reduction = "";
      state.baselineWeeks = "";
      state.fArea = "";
      state.fCategory = "";
      state.costs = {};
    },
    cells: (row) => [
      el("td", "nowrap", showDate(row.date)),
      el("td", null, row.area),
      el("td", null, row.item || catName(row.category)),
      el("td", "nowrap", qtyText(row)),
      el("td", "nowrap", money(M.value(row))),
      el("td", null, reasonName(row.reason)),
      el("td", null, destName(row.dest)),
    ],
    removeLabel: (row) => tx("Remove {item} of {date}", { item: row.item || catName(row.category), date: showDate(row.date) }),
    removedText: (row) => tx("Removed {item}.", { item: row.item || catName(row.category) }),
    countText: (rows) => `${tx("{n} entries", { n: int.format(rows.length) })} · ${money(M.totals(rows).value)}`,
    importRows: (text) => M.importRows(text, data, { shifts: shiftNames(), areas: areaNames() }),
    importText: {
      none: tx("No rows found. Check that each row starts with the date and has a quantity."),
      done: (added, skipped) => `${tx("Imported {n} rows", { n: int.format(added) })}${skipped ? tx(", skipped {n} without a date or quantity", { n: int.format(skipped) }) : ""}.`,
    },
    loadExample: () => {
      state.rows = M.exampleRows(data, today());
      state.covers = M.exampleCovers(data, today());
      state.reduction = data.example.settings.reduction;
      state.baselineWeeks = data.example.settings.baselineWeeks;
      state.fArea = "";
      state.fCategory = "";
    },
    clearText: tx("Clear the whole {tool} log?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), tx("Shift"), tx("Area"), tx("Category"), tx("Item or product"), tx("Quantity"), tx("Unit"), tx("Cost per unit (€)"), tx("Value €"), tx("Reason"), tx("Where it went"), tx("Note"), tx("Covers of the day")],
        ...state.rows.map((row) => [row.date, row.shift, row.area, catName(row.category), row.item, row.qty, unitName(row.unit), row.cost, M.value(row), reasonName(row.reason), destName(row.dest), row.note, state.covers[row.date] ?? ""]),
      ],
    }),
    renderResults,
  });

  // The filters belong to the results, not to the log: they are kept, but every entry stays in the table and the CSV.
  [[areaFilter, "fArea"], [categoryFilter, "fCategory"]].forEach(([select, name]) => select.addEventListener("change", () => {
    state[name] = select.value;
    save();
    renderResults();
  }));

  // The value of the entry as it is typed: quantity × cost per unit.
  const showValue = () => {
    const qty = parseNumber(form.qty.value);
    const cost = parseNumber(form.cost.value);
    valueNote.textContent = qty > 0 && cost >= 0 ? `${tx("Value")}: ${money(M.value({ qty, cost }))}` : "";
  };
  form.qty.addEventListener("input", showValue);
  form.cost.addEventListener("input", showValue);
  // An item logged before brings back its cost, unit and category, so a daily weighing is quick to repeat.
  form.product.addEventListener("change", () => {
    const known = state.costs[form.product.value.trim().toLowerCase()];
    if (!known) return;
    if (!form.cost.value.trim()) form.cost.value = num(known.cost, 2);
    form.unit.value = known.unit;
    form.category.value = known.category;
    showValue();
  });

  form.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date: the shift date, the new day after midnight."));
      return;
    }
    if (!form.product.value.trim()) {
      form.product.focus();
      flash(entryStatus, tx("Write what was thrown away or written off."));
      return;
    }
    const qty = parseNumber(form.qty.value);
    if (!(qty > 0)) {
      form.qty.focus();
      flash(entryStatus, tx("Enter the quantity, above 0."));
      return;
    }
    const cost = form.cost.value.trim() ? parseNumber(form.cost.value) : 0;
    if (!(cost >= 0)) {
      form.cost.focus();
      flash(entryStatus, tx("Enter the cost per unit in euro, or leave it empty."));
      return;
    }
    const row = M.cleanRow({ date, shift: form.shift.value, area: form.area.value, category: form.category.value, item: form.product.value, qty, unit: form.unit.value, cost, reason: form.reason.value, dest: form.dest.value, note: form.note.value }, data);
    // Keep the date, shift, area, category, unit, reason and destination: the next entry is often from the same place.
    form.product.value = "";
    form.qty.value = "";
    form.cost.value = "";
    form.note.value = "";
    valueNote.textContent = "";
    book.add(row);
    // Remembered after the add: a first own entry clears the example and its remembered items with it.
    const remember = row.item.toLowerCase();
    delete state.costs[remember];
    state.costs[remember] = { item: row.item, cost: row.cost, unit: row.unit, category: row.category };
    const names = Object.keys(state.costs);
    if (names.length > 200) delete state.costs[names[0]];
    save();
    fillLists();
    flash(entryStatus, tx("Added: {item}, {qty}, {value}.", { item: row.item, qty: qtyText(row), value: money(M.value(row)) }));
    form.product.focus();
  });

  // Covers per date: an empty box removes the day's covers.
  const cf = coversForm.elements;
  const showCovers = () => { cf.covers.value = state.covers[cf.coversDate.value] ?? ""; };
  cf.coversDate.value = today();
  cf.coversDate.addEventListener("change", showCovers);
  coversForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(cf.coversDate.value);
    if (!date) {
      cf.coversDate.focus();
      flash(coversStatus, tx("Enter the date of the covers."));
      return;
    }
    const raw = cf.covers.value.trim();
    const n = raw ? Number(raw) : 0;
    if (raw && !(Number.isInteger(n) && n >= 0)) {
      cf.covers.focus();
      flash(coversStatus, tx("Enter the covers as a whole number."));
      return;
    }
    // The visitor's own covers: the example leaves first (ToolKit logBook ownWork).
    book.ownWork();
    if (n > 0) state.covers[date] = n;
    else delete state.covers[date];
    save();
    renderResults();
    flash(coversStatus, n > 0 ? tx("{n} covers saved for {date}.", { n: int.format(n), date: showDate(date) }) : tx("Covers removed for {date}.", { date: showDate(date) }));
  });

  if (Workplace) {
    window.addEventListener("workplace:changed", renderResults);
    window.addEventListener("storage", (event) => { if (event.key === Workplace.KEY || event.key === null) renderResults(); });
  }
  book.render();
  showCovers();
})();
