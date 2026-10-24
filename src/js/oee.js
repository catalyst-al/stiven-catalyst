// OEE (js/oee.js): the overall equipment effectiveness of a few machines, shift by shift. An entry is the planned time,
// the stops with their reasons, the pieces made and the rejects. The reasons map onto the six big losses, so the result
// says not only how much time was lost but where it went. The log itself is ToolKit.logBook, as in the defect logs.
// The arithmetic lives in window.OeeMath, so the tests can call it without the page.
(() => {
  const LOSSES = ["breakdowns", "setup", "smallStops", "speed", "startupRejects", "productionRejects"];
  const GROUP_OF = { breakdowns: "availability", setup: "availability", smallStops: "performance", speed: "performance", startupRejects: "quality", productionRejects: "quality" };
  const GROUPS = ["availability", "performance", "quality"];
  // World class from 85 %, a usual plant from 60 %, low from 40 %, poor below.
  const BANDS = [0.85, 0.6, 0.4];
  const WORLD_CLASS = BANDS[0];
  const positive = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const zeroLosses = () => Object.fromEntries(LOSSES.map((key) => [key, 0]));
  const fold = (text) => String(text ?? "").trim().toLowerCase();
  const toNumber = (text) => (window.ToolKit ? window.ToolKit.parseNumber(text) : Number(String(text).replace(",", ".")));

  // The ideal cycle in seconds per piece: from the ideal rate (pieces per hour) or from the cycle itself.
  const idealCycle = (machine) => {
    const rate = Number(machine?.rate);
    if (rate > 0) return 3600 / rate;
    const cycle = Number(machine?.cycle);
    return cycle > 0 ? cycle : null;
  };

  // A typed reason onto a known one: the same name in any case, or the start of one (three letters or more).
  const matchReason = (text, reasons = []) => {
    const wanted = fold(text);
    if (!wanted) return "";
    const hit = reasons.find((r) => fold(r.name) === wanted) || (wanted.length >= 3 && reasons.find((r) => fold(r.name).startsWith(wanted)));
    return hit ? hit.name : String(text).trim();
  };
  // A reason nobody listed is an unplanned stop: it counts as a breakdown until it gets its own place in the list.
  const lossOf = (reason, reasons = []) => reasons.find((r) => fold(r.name) === fold(reason))?.loss || "breakdowns";
  const known = (reason, reasons = []) => reasons.some((r) => fold(r.name) === fold(reason));

  // "Jam: 12; Changeover 20, Break: 30 min" → [{ reason, minutes }]. A comma before a digit is a decimal comma.
  const parseStops = (text, reasons = []) => {
    const stops = [];
    String(text ?? "").split(/[;\n|]|,(?=\s*[^\d\s])/).forEach((part) => {
      const match = part.trim().match(/^(.*?)[\s:=]*(\d+(?:[.,]\d+)?)\s*(?:min\.?|m|')?$/i);
      if (!match) return;
      const minutes = Math.round(toNumber(match[2]) * 10) / 10;
      if (!(minutes > 0)) return;
      stops.push({ reason: matchReason(match[1].replace(/[\s:=–-]+$/, ""), reasons), minutes });
    });
    return stops;
  };
  const stopsText = (stops) => stops.map((stop) => `${stop.reason}: ${String(stop.minutes)}`).join("; ");
  // Logged minutes per loss of one entry (and the planned stops), before anything is capped.
  const loggedOf = (stops, reasons = []) => {
    const logged = { breakdowns: 0, setup: 0, smallStops: 0, speed: 0, planned: 0 };
    (stops || []).forEach((stop) => { logged[lossOf(stop.reason, reasons)] += positive(stop.minutes); });
    return logged;
  };

  // One entry. Planned stops leave the planned time; breakdowns and setup leave the run time; what the pieces made say
  // about the rest splits it into performance and quality. The six losses and the good time add up to the planned
  // production time exactly, so a stacked column is never taller or shorter than the shift. Performance is capped at
  // 100 %: more pieces than the ideal rate allows means the rate or the minutes are wrong, and `capped` says so.
  const entry = (row, cycle, reasons = []) => {
    const planned = positive(row.planned);
    const logged = loggedOf(row.stops, reasons);
    const ppt = Math.max(0, planned - logged.planned);
    const down = logged.breakdowns + logged.setup;
    // More stop minutes than planned time: the stops are scaled down to it, so a loss never exceeds the time.
    const scale = down > ppt && down > 0 ? ppt / down : 1;
    const losses = zeroLosses();
    losses.breakdowns = logged.breakdowns * scale;
    losses.setup = logged.setup * scale;
    const run = Math.max(0, ppt - down * scale);
    const total = Math.round(positive(row.pieces));
    const rejects = Math.min(total, Math.round(positive(row.rejects)));
    const startup = Math.min(rejects, Math.round(positive(row.startup)));
    const good = total - rejects;
    const base = { planned, plannedStops: logged.planned, ppt, run, total, good, rejects, startup, logged, losses, availability: ppt > 0 ? run / ppt : 0 };
    if (!(cycle > 0)) return { ...base, rated: false, ideal: null, performance: null, quality: null, oee: null, capped: false, atSpeed: null, valuable: null };
    const ideal = (total * cycle) / 60;
    const capped = ideal > run * 1.001 + 1e-9;
    const performance = run > 0 ? Math.min(1, ideal / run) : 0;
    const quality = total > 0 ? good / total : 1;
    const atSpeed = run * performance;
    const performanceLoss = run - atSpeed;
    const qualityLoss = atSpeed * (1 - quality);
    // Small stops that were logged are part of the performance loss; the rest of it is speed.
    losses.smallStops = Math.min(logged.smallStops, performanceLoss);
    losses.speed = performanceLoss - losses.smallStops;
    losses.startupRejects = rejects > 0 ? qualityLoss * (startup / rejects) : 0;
    losses.productionRejects = qualityLoss - losses.startupRejects;
    const valuable = atSpeed - qualityLoss;
    return { ...base, rated: true, ideal, performance, quality, oee: ppt > 0 ? valuable / ppt : 0, capped, atSpeed, valuable };
  };

  // Several entries as one: time-weighted, so a long shift counts more than a short one, and OEE = A × P × Q still holds.
  // Entries without an ideal rate (rated: false) have no performance and stay out; `unrated` counts them.
  const combine = (entries) => {
    const rated = entries.filter((e) => e.rated);
    const sum = (pick) => rated.reduce((total, e) => total + pick(e), 0);
    const ppt = sum((e) => e.ppt), run = sum((e) => e.run), atSpeed = sum((e) => e.atSpeed), valuable = sum((e) => e.valuable);
    const losses = zeroLosses();
    rated.forEach((e) => LOSSES.forEach((key) => { losses[key] += e.losses[key]; }));
    const groups = Object.fromEntries(GROUPS.map((group) => [group, LOSSES.filter((key) => GROUP_OF[key] === group).reduce((total, key) => total + losses[key], 0)]));
    return {
      n: rated.length,
      unrated: entries.length - rated.length,
      planned: sum((e) => e.planned),
      plannedStops: sum((e) => e.plannedStops),
      ppt, run, atSpeed, valuable,
      total: sum((e) => e.total), good: sum((e) => e.good), rejects: sum((e) => e.rejects),
      availability: ppt > 0 ? run / ppt : null,
      performance: run > 0 ? atSpeed / run : null,
      quality: atSpeed > 0 ? valuable / atSpeed : null,
      oee: ppt > 0 ? valuable / ppt : null,
      losses, groups,
      lost: ppt - valuable,
      capped: rated.filter((e) => e.capped).length,
    };
  };

  // 0 world class, 1 typical, 2 low, 3 poor.
  const verdict = (oee) => {
    const index = BANDS.findIndex((band) => oee >= band - 1e-9);
    return index < 0 ? BANDS.length : index;
  };

  // The six losses largest first, with their share of the lost time and the vital few that carry 80 % of it.
  const rank = (losses) => {
    const total = LOSSES.reduce((sum, key) => sum + positive(losses[key]), 0);
    let running = 0;
    return LOSSES.map((key) => ({ key, value: positive(losses[key]) }))
      .sort((a, b) => b.value - a.value || LOSSES.indexOf(a.key) - LOSSES.indexOf(b.key))
      .map((item) => {
        const share = total > 0 ? item.value / total : 0;
        const vital = item.value > 0 && running < 0.8 - 1e-9;
        running += share;
        return { ...item, share, cumulative: running, vital };
      });
  };

  // The stops that count as breakdowns (a reason nobody listed counts as one), one by one: the Maintenance Planner
  // reads the same stops from this log and takes them over as breakdowns of its assets.
  const breakdownStops = (rows, reasons = []) => (rows || []).flatMap((row) => (row.stops || [])
    .filter((stop) => positive(stop.minutes) > 0 && lossOf(stop.reason, reasons) === "breakdowns")
    .map((stop) => ({ date: row.date, shift: row.shift, equipment: row.equipment, reason: stop.reason, minutes: positive(stop.minutes) })));

  window.OeeMath = { LOSSES, GROUP_OF, GROUPS, BANDS, WORLD_CLASS, idealCycle, matchReason, lossOf, known, parseStops, stopsText, loggedOf, entry, combine, verdict, rank, breakdownStops };

  const root = document.querySelector("[data-oee]");
  const dataEl = document.getElementById("oee-data");
  if (!root || !dataEl || !window.ToolKit || !window.ChartKit) return;

  const {
    LANG, tx, el, int, num, pct, showDate, today, addDays, parseNumber, parseDate, parseRows, canon, isObject, str, loadState,
    write, plural, lower, logBook, panel, stat, barList, focusCard, resultActions, resultLayout, flash, recentExample, inRange,
    dateSpan, spanText } = window.ToolKit;
  const Chart = window.ChartKit;
  const Workplace = window.Workplace;
  const Actions = window.ActionsStore;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const reasons = data.reasons;
  const results = document.querySelector("[data-results]");
  const entryForm = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const preview = root.querySelector("[data-stops-preview]");
  const machineForm = root.querySelector("[data-machine-form]");
  const machineBody = root.querySelector("[data-machine-list]");
  const machineWrap = root.querySelector("[data-machine-wrap]");
  const machineEmpty = root.querySelector("[data-machine-empty]");
  const machineStatus = root.querySelector("[data-machine-status]");
  const filterSelect = root.querySelector("[data-machine-filter]");

  const lossName = (key) => data.losses[key]?.name || key;
  const GROUP_NAME = { availability: tx("Availability"), performance: tx("Performance"), quality: tx("Quality") };
  const GOOD = tx("Good time");
  const minutes = (value) => `${int.format(Math.round(value))} min`;
  const share = (value) => (value === null || !Number.isFinite(value) ? "–" : pct(value, 1));
  // Short day labels that fit 14 columns: 18/9 or 18.9.
  const shortDay = (iso) => `${Number(iso.slice(8, 10))}${LANG === "en" ? "/" : "."}${Number(iso.slice(5, 7))}`;
  const target = () => {
    const value = Workplace?.target("oee");
    return Number.isFinite(value) && value > 0 ? (value > 1 ? value / 100 : value) : WORLD_CLASS;
  };

  // Saved work is rebuilt field by field, so damaged data cannot break the page.
  const cleanMachine = (item) => {
    if (!isObject(item) || !str(item.name).trim()) return null;
    const rate = positive(item.rate) || (positive(item.cycle) ? 3600 / positive(item.cycle) : 0);
    return { name: str(item.name).trim().slice(0, 80), rate: Math.round(rate * 100) / 100, planned: Math.round(positive(item.planned)) };
  };
  const cleanRow = (row) => {
    if (!isObject(row)) return null;
    const date = parseDate(row.date);
    const planned = positive(row.planned);
    if (!date || !str(row.equipment).trim() || !(planned > 0)) return null;
    const pieces = Math.round(positive(row.pieces));
    const rejects = Math.min(pieces, Math.round(positive(row.rejects)));
    return {
      date,
      shift: str(row.shift).trim(),
      equipment: str(row.equipment).trim(),
      planned,
      stops: Array.isArray(row.stops) ? row.stops.filter(isObject).map((stop) => ({ reason: str(stop.reason).trim(), minutes: Math.round(positive(stop.minutes) * 10) / 10 })).filter((stop) => stop.minutes > 0) : [],
      pieces,
      rejects,
      startup: Math.min(rejects, Math.round(positive(row.startup))),
      note: str(row.note).trim(),
    };
  };
  const state = loadState(KEY, { equipment: [], rows: [], machine: "", from: "", to: "", example: {}, totalsFor: {}, demoEquipment: [] });
  state.equipment = state.equipment.map(cleanMachine).filter(Boolean);
  state.rows = state.rows.map(cleanRow).filter(Boolean);
  state.from = parseDate(state.from);
  state.to = parseDate(state.to);
  state.demoEquipment = state.demoEquipment.filter((name) => typeof name === "string");
  const save = () => write(KEY, state);

  const machineOf = (name) => state.equipment.find((machine) => fold(machine.name) === fold(name));
  const machineNames = () => {
    const names = state.equipment.map((machine) => machine.name);
    state.rows.forEach((row) => { if (!names.some((name) => fold(name) === fold(row.equipment))) names.push(row.equipment); });
    return names;
  };
  const calc = (row) => ({ row, ...entry(row, idealCycle(machineOf(row.equipment)), reasons) });

  // The selects follow the list of machines and the workplace profile; a value that is no longer offered is kept.
  const fill = (select, values, current, first) => {
    const list = [...new Set([...values, ...(current ? [current] : [])])];
    select.replaceChildren(...(first ? [first] : []), ...list.map((value) => {
      const option = el("option", null, value);
      option.value = value;
      return option;
    }));
    select.value = current && list.includes(current) ? current : first ? first.value : list[0] || "";
  };
  const fillSelects = () => {
    const names = machineNames();
    fill(entryForm.elements.equipment, state.equipment.map((machine) => machine.name), entryForm.elements.equipment.value);
    if (state.machine && !names.includes(state.machine)) state.machine = "";
    const all = el("option", null, tx("All equipment"));
    all.value = "";
    fill(filterSelect, names, state.machine, all);
    const shifts = Workplace?.shifts().length ? Workplace.shifts() : data.shifts;
    fill(entryForm.elements.shift, shifts, entryForm.elements.shift.value || shifts[0]);
  };

  // Machines to set up: name, ideal rate (or cycle) and the planned minutes of a shift.
  const renderMachines = () => {
    machineBody.replaceChildren();
    state.equipment.forEach((machine, index) => {
      const tr = el("tr");
      const cycle = idealCycle(machine);
      const count = state.rows.filter((row) => fold(row.equipment) === fold(machine.name)).length;
      tr.append(
        el("td", null, machine.name),
        el("td", "num", machine.rate > 0 ? num(machine.rate, machine.rate % 1 ? 1 : 0) : "–"),
        el("td", "num", cycle ? num(cycle, 2) : "–"),
        el("td", "num", machine.planned ? int.format(machine.planned) : "–"),
        el("td", "num", int.format(count)),
      );
      const cell = el("td");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeMachine = index;
      remove.setAttribute("aria-label", tx("Remove {name}", { name: machine.name }));
      cell.append(remove);
      tr.append(cell);
      machineBody.append(tr);
    });
    machineWrap.hidden = !state.equipment.length;
    machineEmpty.hidden = state.equipment.length > 0;
  };

  // Pasted rows: date, shift, equipment, planned minutes, stops, pieces, rejects, startup rejects, note. A machine
  // that is not in the list yet is added without a rate; the result asks for it.
  let keepMachines = new Set();
  const importRows = (text) => {
    const added = [];
    let skipped = 0;
    parseRows(text).forEach((cells, index) => {
      const [date, shift, equipment, planned, stops, pieces, rejects, startup, ...note] = cells;
      const day = parseDate(date);
      const plan = parseNumber(planned);
      const made = parseNumber(pieces);
      const name = canon(machineNames(), equipment, "");
      if (!day || !name || !(plan > 0) || !(made >= 0)) {
        // A first row with words where the date and the numbers belong is a header.
        if (index > 0) skipped++;
        return;
      }
      const bad = parseNumber(rejects);
      const first = parseNumber(startup);
      const row = cleanRow({ date: day, shift: canon(data.shifts, shift, ""), equipment: name, planned: plan, stops: parseStops(stops, reasons), pieces: made, rejects: bad >= 0 ? bad : 0, startup: first >= 0 ? first : 0, note: note.join(", ") });
      if (!row) { skipped++; return; }
      if (!machineOf(name)) state.equipment.push({ name, rate: 0, planned: Math.round(plan) });
      keepMachines.add(name);
      added.push(row);
    });
    return { added, skipped };
  };

  // The example: three weeks of two machines, moved forward to end in the last days. Its machines join the list and
  // leave with it, unless an entry of one's own uses them.
  const loadExample = () => {
    const ex = data.example;
    keepMachines = new Set();
    const before = new Set(state.equipment.map((machine) => fold(machine.name)));
    ex.equipment.forEach((item) => { if (!before.has(fold(item.name))) state.equipment.push(cleanMachine(item)); });
    state.demoEquipment = ex.equipment.map((item) => item.name).filter((name) => !before.has(fold(name)));
    state.machine = "";
    state.rows = importRows(recentExample(ex.rows).map((row) => row.replace(/\|/g, "\t")).join("\n")).added;
    keepMachines = new Set();
  };
  const clearExample = () => {
    state.equipment = state.equipment.filter((machine) => !state.demoEquipment.includes(machine.name) || keepMachines.has(machine.name));
    state.demoEquipment = [];
    state.machine = "";
    keepMachines = new Set();
    renderMachines();
  };

  // The rows of the chosen days and machine.
  const periodRows = () => inRange(state.rows, state.from, state.to).filter((row) => !state.machine || row.equipment === state.machine);

  // The reasons behind a loss that is logged by reason (breakdowns, setup, small stops), largest first.
  const reasonsOf = (entries, key) => {
    const map = new Map();
    entries.forEach((e) => e.row.stops.forEach((stop) => {
      if (lossOf(stop.reason, reasons) !== key) return;
      const name = stop.reason || tx("No reason");
      map.set(name, (map.get(name) || 0) + stop.minutes);
    }));
    return [...map].map(([name, value]) => ({ key: name, value })).sort((a, b) => b.value - a.value);
  };

  const analyse = (rows) => {
    const entries = rows.map(calc);
    const all = combine(entries);
    const names = [...new Set(rows.map((row) => row.equipment))];
    const machines = names.map((name) => {
      const own = entries.filter((e) => e.row.equipment === name);
      return { name, entries: own, result: combine(own) };
    });
    const ranked = rank(all.losses);
    const top = ranked[0];
    // Where the biggest loss is biggest: the machine to start at.
    const worst = machines.filter((m) => m.result.n).sort((a, b) => b.result.losses[top.key] - a.result.losses[top.key])[0];
    return { rows, entries, all, machines, ranked, top, worst, span: dateSpan(rows), unrated: [...new Set(entries.filter((e) => !e.rated).map((e) => e.row.equipment))] };
  };

  const problemText = (result) => {
    const { top, worst, span } = result;
    const own = worst.result;
    return tx("{equipment}: {loss} took {minutes} of {planned} planned minutes ({pct}), {span}.", {
      equipment: worst.name, loss: lower(lossName(top.key)), minutes: int.format(Math.round(own.losses[top.key])), planned: int.format(Math.round(own.ppt)),
      pct: pct(own.ppt ? own.losses[top.key] / own.ppt : 0, 0), span: span ? spanText(span) : "",
    });
  };

  const summaryText = (result) => {
    const { all } = result;
    const band = data.verdicts[verdict(all.oee)];
    const lines = [`${data.title} | Stiven Catalyst`];
    lines.push(`${tx("Period")}: ${[result.span && spanText(result.span), state.machine || tx("All equipment")].filter(Boolean).join(" · ")}`);
    lines.push("", `OEE: ${share(all.oee)} (${band.name}) · ${tx("Target")} ${pct(target(), 0)}`);
    lines.push(`${GROUP_NAME.availability} ${share(all.availability)} · ${GROUP_NAME.performance} ${share(all.performance)} · ${GROUP_NAME.quality} ${share(all.quality)}`);
    lines.push(tx("Planned time {planned} (planned stops left out: {stops}) · lost {lost}", { planned: minutes(all.ppt), stops: minutes(all.plannedStops), lost: minutes(all.lost) }));
    lines.push("", `${tx("By equipment")}:`);
    result.machines.forEach((m) => lines.push(m.result.n
      ? `- ${m.name}: OEE ${share(m.result.oee)} · ${GROUP_NAME.availability} ${share(m.result.availability)} · ${GROUP_NAME.performance} ${share(m.result.performance)} · ${GROUP_NAME.quality} ${share(m.result.quality)}`
      : `- ${m.name}: ${tx("no ideal rate")}`));
    lines.push("", `${tx("The six big losses")}:`);
    result.ranked.forEach((item) => lines.push(`- ${lossName(item.key)}: ${minutes(item.value)} (${pct(item.share, 0)})${item.vital ? ` [${tx("vital few")}]` : ""}`));
    lines.push("", `${tx("Start here")}: ${problemText(result)}`);
    const advice = data.losses[result.top.key];
    lines.push(`${tx("First moves")}:`);
    advice.moves.forEach((move) => lines.push(`- ${move}`));
    lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    return lines.join("\n");
  };

  // The six losses for the Pareto tool: one row per entry and loss, measured in minutes.
  const paretoTable = (result) => () => ({
    source: document.querySelector("h1")?.textContent.replace(/­/g, "").trim() || data.title,
    template: "idle-downtime",
    headers: [tx("Loss"), tx("Minutes")],
    rows: result.entries.filter((e) => e.rated).flatMap((e) => LOSSES.filter((key) => e.losses[key] >= 0.05).map((key) => [lossName(key), String(Math.round(e.losses[key] * 10) / 10)])),
    map: { category: 0, value: 1 },
    measure: "value",
    valueLabel: tx("Minutes"),
  });

  const COLORS = { [GOOD]: Chart.C.blue };
  const LOSS_COLORS = { breakdowns: Chart.C.warn, setup: "#a78bfa", smallStops: Chart.C.soft, speed: "#f472b6", startupRejects: Chart.C.muted, productionRejects: Chart.C.line };
  LOSSES.forEach((key) => { COLORS[lossName(key)] = LOSS_COLORS[key]; });

  const stackedPanel = (result) => {
    const dates = [...new Set(result.entries.filter((e) => e.rated).map((e) => e.row.date))].sort().slice(-14);
    if (!dates.length) return null;
    const box = panel(tx("Where the planned time went"), tx("Planned time per day, for the last 14 days with entries: good time at the bottom, then each of the six losses. Planned stops are left out."));
    const groups = dates.map((date) => {
      const day = combine(result.entries.filter((e) => e.row.date === date));
      return { label: shortDay(date), parts: [{ key: GOOD, value: day.valuable }, ...LOSSES.map((key) => ({ key: lossName(key), value: day.losses[key] }))] };
    });
    const svg = Chart.stacked(groups, { keys: [GOOD, ...LOSSES.map(lossName)], colors: COLORS, title: tx("Where the planned time went"), unit: tx("Minutes"), format: (v) => int.format(Math.round(v)) });
    box.append(Chart.figure(svg, { fileName: "oee-time" }));
    return box;
  };

  const trendPanel = (result) => {
    const dates = [...new Set(result.entries.filter((e) => e.rated).map((e) => e.row.date))].sort().slice(-31);
    if (dates.length < 2) return null;
    const goal = target();
    const box = panel(tx("OEE trend by equipment"), tx("OEE per day for each machine. The line is the target, {pct}.", { pct: pct(goal, 0) }));
    const series = result.machines.filter((m) => m.result.n).map((m) => ({
      label: m.name,
      points: dates.map((date) => {
        const day = combine(m.entries.filter((e) => e.row.date === date));
        return { x: shortDay(date), y: day.n ? day.oee : NaN, tip: day.n ? `${showDate(date)} · ${m.name}: OEE ${share(day.oee)}` : "" };
      }),
    }));
    const svg = Chart.line(series, { title: tx("OEE trend by equipment"), yMin: 0, yMax: 1, target: goal, format: (v) => pct(v, 0) });
    box.append(Chart.figure(svg, { fileName: "oee-trend" }));
    return box;
  };

  const lossesPanel = (result) => {
    const vital = result.ranked.filter((item) => item.vital);
    const box = panel(tx("The six big losses"), tx("Lost minutes by loss, largest first. {names} carry {pct} of the lost time: the vital few, in the alert colour.", { names: vital.map((item) => lossName(item.key)).join(", "), pct: pct(vital.at(-1)?.cumulative || 0, 0) }));
    const svg = Chart.bars(result.ranked.map((item) => ({
      label: lossName(item.key), value: item.value, vital: item.vital,
      tip: `${lossName(item.key)} (${GROUP_NAME[GROUP_OF[item.key]]}): ${minutes(item.value)} · ${pct(item.share, 0)}${item.vital ? ` · ${tx("vital few")}` : ""}`,
    })), { title: tx("The six big losses"), unit: tx("Minutes"), highlight: (item) => item.vital, format: (v) => int.format(Math.round(v)) });
    box.append(Chart.figure(svg, { fileName: "oee-losses" }));
    const groups = el("ul", "ck-chips oe-groups");
    GROUPS.forEach((group) => groups.append(el("li", "ck-chip", `${GROUP_NAME[group]}: ${minutes(result.all.groups[group])}`)));
    box.append(groups);
    return box;
  };

  // The breakdowns of the chosen days go on to the Maintenance Planner, where they count in MTBF and MTTR.
  const plannerUrl = () => new URL(document.querySelector("a[data-planner-link]")?.href || new URL("../maintenance-planner/", window.location.href)).href;
  const plannerLink = (className) => {
    const link = el("a", className, tx("Log in the Maintenance Planner"));
    link.href = plannerUrl();
    return link;
  };
  const breakdownNote = (result) => {
    const stops = breakdownStops(result.rows, reasons);
    if (!stops.length) return null;
    const note = el("p", "dl-panel-note oe-planner-note");
    note.append(`${tx("{stops} ({minutes}) in these days: the Maintenance Planner takes them over as breakdowns of the asset.", {
      stops: plural(stops.length, tx("breakdown stop"), tx("breakdown stops")), minutes: minutes(stops.reduce((sum, stop) => sum + stop.minutes, 0)),
    })} `, plannerLink("inline-link"));
    return note;
  };

  const reasonPanel = (result) => {
    const items = ["breakdowns", "setup", "smallStops"].flatMap((key) => reasonsOf(result.entries.filter((e) => e.rated), key).map((item) => ({ ...item, loss: key })))
      .sort((a, b) => b.value - a.value).slice(0, 8);
    if (!items.length) return null;
    const box = panel(tx("Stop reasons"), tx("The logged stops by reason, in minutes. Planned stops are not counted."));
    box.append(barList(items, { ranked: true, label: (item) => [int.format(Math.round(item.value)), ` min · ${lossName(item.loss)}`] }));
    const note = breakdownNote(result);
    if (note) box.append(note);
    return box;
  };

  const machinePanel = (result) => {
    const box = panel(tx("By equipment"), tx("Availability × performance × quality = OEE, for each machine over the chosen days."));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table oe-table");
    const head = el("tr");
    [tx("Equipment"), tx("Entries"), GROUP_NAME.availability, GROUP_NAME.performance, GROUP_NAME.quality, "OEE", tx("Verdict"), tx("Biggest loss")].forEach((text, i) => {
      const th = el("th", i && i < 6 ? "num" : null, text);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const tbody = el("tbody");
    result.machines.forEach((m) => {
      const r = m.result;
      const tr = el("tr");
      const th = el("th", null, m.name);
      th.scope = "row";
      const biggest = r.n ? rank(r.losses)[0] : null;
      tr.append(th, el("td", "num", int.format(m.entries.length)), el("td", "num", share(r.availability)), el("td", "num", share(r.performance)), el("td", "num", share(r.quality)),
        el("td", "num oe-oee", share(r.oee)), el("td", null, r.n ? data.verdicts[verdict(r.oee)].name : tx("no ideal rate")), el("td", null, biggest && biggest.value > 0 ? `${lossName(biggest.key)} · ${minutes(biggest.value)}` : "–"));
      tbody.append(tr);
    });
    table.append(thead, tbody);
    wrap.append(table);
    box.append(wrap);
    return box;
  };

  const renderResults = () => {
    fillSelects();
    renderMachines();
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const rows = periodRows();
    const card = (text) => {
      const box = el("article", "result-card dl-focus");
      box.append(el("p", "result-label", tx("Result")), el("p", "dl-focus-lede", text));
      results.append(box);
    };
    if (!rows.length) { card(tx("No entries in this period. Choose another period or All.")); return; }
    const result = analyse(rows);
    const { all } = result;
    if (!all.n) {
      card(tx("No ideal rate for {names}. Add it under Equipment to see the OEE.", { names: result.unrated.join(", ") }));
      return;
    }
    const band = verdict(all.oee);
    const goal = target();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${[state.machine || tx("All equipment"), result.span && spanText(result.span)].filter(Boolean).join(" · ")}`));
    const title = el("h2");
    title.append("OEE ", el("span", null, share(all.oee)));
    head.append(title);
    const verdictLine = el("p", `oe-verdict is-${band === 0 ? "ok" : band === 1 ? "warn" : "danger"}`);
    verdictLine.append(el("strong", null, data.verdicts[band].name), ` · ${data.verdicts[band].note}`);
    head.append(verdictLine);

    const stats = el("div", "dl-stats");
    stats.append(
      stat(GROUP_NAME.availability, share(all.availability), tx("run time out of {planned} planned", { planned: minutes(all.ppt) })),
      stat(GROUP_NAME.performance, share(all.performance), tx("ideal time for the pieces made, of the run time")),
      stat(GROUP_NAME.quality, share(all.quality), tx("{good} good of {total} pieces", { good: int.format(all.good), total: int.format(all.total) })),
    );
    const gap = all.oee - goal;
    stats.append(stat(tx("Target"), gap >= -1e-9 ? tx("On target") : tx("{n} points below", { n: num(-gap * 100, 1) }), `OEE ${pct(goal, 0)}${Workplace?.target("oee") ? "" : ` · ${tx("world class")}`}`));
    stats.append(stat(tx("Lost time"), minutes(all.lost), tx("{pct} of the planned time", { pct: pct(all.ppt ? all.lost / all.ppt : 0, 0) })));

    const notes = [];
    if (all.capped) notes.push(el("p", "dl-warning", tx("{n} capped at 100 % performance: more pieces than the ideal rate allows in the run time. Check the ideal rate or the stop minutes.", { n: plural(all.capped, tx("entry"), tx("entries")) })));
    if (result.unrated.length) notes.push(el("p", "dl-warning", tx("No ideal rate for {names}: these entries are left out of the OEE. Add the rate under Equipment.", { names: result.unrated.join(", ") })));
    const unknown = [...new Set(result.rows.flatMap((row) => row.stops.map((stop) => stop.reason)).filter((reason) => !known(reason, reasons)))];
    if (unknown.length) notes.push(el("p", "dl-panel-note", tx("Reasons not in the list count as breakdowns: {names}.", { names: unknown.map((name) => name || tx("No reason")).join(", ") })));

    const top = result.top;
    const advice = data.losses[top.key];
    const topReasons = reasonsOf(result.worst.entries, top.key).slice(0, 3);
    const focus = focusCard({
      title: lossName(top.key),
      detail: result.machines.length > 1 ? result.worst.name : GROUP_NAME[GROUP_OF[top.key]],
      lede: problemText(result),
      advice,
      extraLabel: topReasons.length ? tx("Top reasons") : "",
      extra: topReasons.map((item) => `${item.key} ${minutes(item.value)}`).join(" · "),
    });

    const problem = problemText(result);
    const actions = resultActions(() => summaryText(result), problem, paretoTable(result));
    if (Actions) {
      actions.append(Actions.linkButton(tx("Add to actions"), () => ({
        title: `${result.worst.name}: ${advice.moves[0]}`,
        detail: problem,
        due: addDays(today(), 7),
        source: "oee",
        check: tx("{loss} on {equipment} down for two weeks, and OEE towards {pct}.", { loss: lossName(top.key), equipment: result.worst.name, pct: pct(goal, 0) }),
        area: result.worst.name,
        priority: "High",
      })));
    }
    if (breakdownStops(result.rows, reasons).length) actions.append(plannerLink("button-ghost"));

    resultLayout(results, {
      head,
      stats,
      notes,
      focus,
      actions,
      panels: [stackedPanel(result), trendPanel(result), lossesPanel(result), machinePanel(result), reasonPanel(result)].filter(Boolean),
    });
  };

  const CSV_HEAD = () => [tx("Date"), tx("Shift"), tx("Equipment"), tx("Planned minutes"), tx("Planned stops (min)"), tx("Stops"), tx("Pieces"), tx("Rejects"), tx("Startup rejects"),
    `${GROUP_NAME.availability} %`, `${GROUP_NAME.performance} %`, `${GROUP_NAME.quality} %`, "OEE %", ...LOSSES.map((key) => `${lossName(key)} (min)`), tx("Note")];
  const percent = (value) => (value === null ? "" : Math.round(value * 1000) / 10);
  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste: root.querySelector("#oe-paste"),
    clearExample,
    cells: (row) => {
      const e = calc(row);
      return [
        el("td", "nowrap", showDate(row.date)),
        el("td", null, row.shift),
        el("td", null, row.equipment),
        el("td", "num", int.format(row.planned)),
        el("td", "dl-note", stopsText(row.stops)),
        el("td", "num", int.format(row.pieces)),
        el("td", "num", int.format(row.rejects)),
        el("td", "num", e.rated ? share(e.oee) : "–"),
        el("td", "dl-note", row.note),
      ];
    },
    removeLabel: (row) => tx("Remove {equipment} on {date}", { equipment: row.equipment, date: showDate(row.date) }),
    removedText: (row) => tx("Removed {equipment} on {date}.", { equipment: row.equipment, date: showDate(row.date) }),
    countText: (rows) => plural(rows.length, tx("entry"), tx("entries")),
    importRows,
    importText: {
      none: tx("No rows found. Check the order: date, shift, equipment, planned minutes, stops, pieces, rejects."),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date, equipment or planned minutes", { n: skipped }) : ""}.`,
    },
    loadExample,
    clearText: tx("Clear the whole {tool} log?", { tool: data.title }),
    csv: () => ({
      name: "oee",
      rows: [CSV_HEAD(), ...state.rows.map((row) => {
        const e = calc(row);
        return [row.date, row.shift, row.equipment, row.planned, e.plannedStops, stopsText(row.stops), row.pieces, row.rejects, row.startup,
          percent(e.availability), percent(e.performance), percent(e.quality), percent(e.oee), ...LOSSES.map((key) => (e.rated || GROUP_OF[key] === "availability" ? Math.round(e.losses[key] * 10) / 10 : "")), row.note];
      })],
    }),
    renderResults,
  });

  // The machine form: the same name again replaces the machine (a corrected rate recalculates every entry).
  const rateInput = machineForm.elements.mrate;
  const cycleInput = machineForm.elements.mcycle;
  rateInput.addEventListener("input", () => {
    const rate = parseNumber(rateInput.value);
    cycleInput.placeholder = rate > 0 ? `= ${num(3600 / rate, 2)}` : "";
  });
  cycleInput.addEventListener("input", () => {
    const cycle = parseNumber(cycleInput.value);
    rateInput.placeholder = cycle > 0 ? `= ${num(3600 / cycle, 0)}` : "";
  });
  machineForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = machineForm.elements;
    const name = form.mname.value.trim();
    const rate = parseNumber(form.mrate.value);
    const cycle = parseNumber(form.mcycle.value);
    if (!name) { form.mname.focus(); flash(machineStatus, tx("Enter the name of the machine.")); return; }
    if (!(rate > 0) && !(cycle > 0)) { form.mrate.focus(); flash(machineStatus, tx("Enter the ideal rate (pieces per hour) or the ideal cycle (seconds per piece).")); return; }
    const planned = parseNumber(form.mplanned.value);
    const machine = cleanMachine({ name, rate: rate > 0 ? rate : 3600 / cycle, planned: planned > 0 ? planned : data.defaultPlanned });
    const index = state.equipment.findIndex((item) => fold(item.name) === fold(name));
    if (index >= 0) state.equipment[index] = { ...machine, name: state.equipment[index].name };
    else state.equipment.push(machine);
    state.demoEquipment = state.demoEquipment.filter((item) => fold(item) !== fold(name));
    save();
    book.render();
    entryForm.elements.equipment.value = machineOf(name).name;
    syncPlanned();
    flash(machineStatus, tx(index >= 0 ? "Updated {name}." : "Added {name}.", { name: machineOf(name).name }));
    ["mname", "mrate", "mcycle", "mplanned"].forEach((field) => { form[field].value = ""; });
    rateInput.placeholder = "";
    cycleInput.placeholder = "";
    form.mname.focus();
  });
  machineBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-machine]");
    if (!button) return;
    const machine = state.equipment[Number(button.dataset.removeMachine)];
    if (!machine) return;
    const used = state.rows.some((row) => fold(row.equipment) === fold(machine.name));
    if (used && !window.confirm(tx("Remove {name}? Its entries stay in the log but have no OEE until the machine is added again.", { name: machine.name }))) return;
    state.equipment = state.equipment.filter((item) => item !== machine);
    save();
    book.render();
    flash(machineStatus, tx("Removed {name}.", { name: machine.name }));
    (machineBody.querySelector("[data-remove-machine]") || machineForm.elements.mname).focus();
  });

  // The entry form: picking a machine fills its planned minutes; the stops are read as they are typed.
  const syncPlanned = () => {
    const machine = machineOf(entryForm.elements.equipment.value);
    if (machine?.planned) entryForm.elements.planned.value = machine.planned;
  };
  entryForm.elements.equipment.addEventListener("change", syncPlanned);
  const renderPreview = () => {
    const stops = parseStops(entryForm.elements.stops.value, reasons);
    if (!stops.length) { preview.textContent = ""; return; }
    const logged = loggedOf(stops, reasons);
    const parts = ["breakdowns", "setup", "smallStops", "speed"].filter((key) => logged[key] > 0).map((key) => `${lossName(key)} ${minutes(logged[key])}`);
    if (logged.planned > 0) parts.push(tx("planned, left out: {n}", { n: minutes(logged.planned) }));
    const unknown = stops.filter((stop) => !known(stop.reason, reasons)).map((stop) => stop.reason || tx("No reason"));
    preview.textContent = `${parts.join(" · ")}${unknown.length ? `. ${tx("Reasons not in the list count as breakdowns: {names}.", { names: unknown.join(", ") })}` : ""}`;
  };
  entryForm.elements.stops.addEventListener("input", renderPreview);
  root.querySelectorAll("[data-reason]").forEach((button) => button.addEventListener("click", () => {
    const input = entryForm.elements.stops;
    const text = input.value.trim();
    input.value = `${text}${text ? "; " : ""}${button.dataset.reason}: `;
    input.focus();
    input.setSelectionRange?.(input.value.length, input.value.length);
    renderPreview();
  }));
  entryForm.elements.date.value = today();
  entryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entryForm.elements;
    const date = parseDate(form.date.value);
    const name = form.equipment.value;
    const planned = parseNumber(form.planned.value);
    const pieces = parseNumber(form.pieces.value);
    const rejects = form.rejects.value.trim() ? parseNumber(form.rejects.value) : 0;
    const startup = form.startup.value.trim() ? parseNumber(form.startup.value) : 0;
    const stops = parseStops(form.stops.value, reasons);
    const logged = loggedOf(stops, reasons);
    const fail = (field, message) => { field.focus(); flash(entryStatus, message); };
    if (!date) return fail(form.date, tx("Enter a date."));
    if (!name || !machineOf(name)) return fail(machineForm.elements.mname, tx("Add a machine under Equipment first."));
    if (!(planned > 0)) return fail(form.planned, tx("Enter the planned minutes of the shift."));
    if (!(pieces >= 0) || !form.pieces.value.trim()) return fail(form.pieces, tx("Enter the pieces made, good and bad together."));
    if (!(rejects >= 0) || rejects > pieces) return fail(form.rejects, tx("The rejects cannot be more than the pieces made."));
    if (!(startup >= 0) || startup > rejects) return fail(form.startup, tx("The startup rejects are part of the rejects, so they cannot be more."));
    if (logged.breakdowns + logged.setup + logged.planned > planned) return fail(form.stops, tx("The stops are longer than the planned time. Check the minutes."));
    const row = cleanRow({ date, shift: form.shift.value, equipment: machineOf(name).name, planned, stops, pieces, rejects, startup, note: form.note.value });
    // An example machine used by an entry of one's own stays when the example leaves.
    keepMachines = new Set([row.equipment]);
    ["stops", "pieces", "rejects", "startup", "note"].forEach((field) => { form[field].value = ""; });
    preview.textContent = "";
    book.add(row);
    keepMachines = new Set();
    const e = calc(row);
    flash(entryStatus, tx("Added {equipment} on {date}: OEE {pct}.", { equipment: row.equipment, date: showDate(row.date), pct: e.rated ? share(e.oee) : "–" }));
    form.stops.focus();
  });
  window.addEventListener("workplace:changed", () => book.render());
  book.render();
  syncPlanned();
})();
