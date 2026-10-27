(() => {
  // Safety Cross: every safety event of the month on a green cross, one cell per day, with the rates, the Bird pyramid,
  // the causes behind the events and the talk of the day. The log is { rows: [{ date, shift, type, area, what, cause,
  // severity, action, owner, done }] }; the Daily Board reads the same rows for its S letter.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const TYPES = ["lost-time", "no-lost-time", "first-aid", "near-miss", "unsafe-condition", "unsafe-act", "positive"];
  // Accidents are injuries that are recorded: with lost time or without. First aid is an injury too, and makes a red day,
  // but it is not a recordable case for TRIR.
  const ACCIDENTS = ["lost-time", "no-lost-time"];
  const RED = ["lost-time", "no-lost-time", "first-aid"];
  const AMBER = ["near-miss", "unsafe-condition", "unsafe-act"];
  const DAY = 864e5;

  // The cross: a 7 × 7 grid where only the plus sign is used. Rows of cells, as [first column, how many]:
  //
  //            1  2  3            row 0: columns 2–4
  //            4  5  6            row 1: columns 2–4
  //   7  8  9 10 11 12 13         row 2: columns 0–6
  //  14 15 16 17 18 19 20         row 3: columns 0–6
  //  21 22 23 24 25 26 27         row 4: columns 0–6
  //           28 29 30            row 5: columns 2–4
  //              31               row 6: column 3
  //
  // Day 17 sits in the centre. A month with fewer days leaves its last cells empty, so the shape never changes.
  const CROSS_ROWS = [[2, 3], [2, 3], [0, 7], [0, 7], [0, 7], [2, 3], [3, 1]];
  const crossLayout = () => {
    const cells = [];
    CROSS_ROWS.forEach(([start, count], row) => {
      for (let col = start; col < start + count; col++) cells.push({ day: cells.length + 1, col, row });
    });
    return cells;
  };

  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const monthDays = (ym) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0)).getUTCDate();
  const addMonths = (ym, n) => {
    const date = new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1 + n, 1));
    return date.toISOString().slice(0, 7);
  };
  const monthRows = (rows, ym) => rows.filter((row) => String(row.date).startsWith(`${ym}-`));
  const counts = (rows) => {
    const out = Object.fromEntries(TYPES.map((type) => [type, 0]));
    rows.forEach((row) => { if (row.type in out) out[row.type]++; });
    return out;
  };

  // The state of one day from its events: an injury is a red day, a near miss or an unsafe condition or act an amber
  // one, nothing (or only a positive observation) a green one. A day still to come has no colour.
  const dayState = (events, iso, today = "") => {
    if (today && iso > today) return "future";
    if (events.some((row) => RED.includes(row.type))) return "danger";
    if (events.some((row) => AMBER.includes(row.type))) return "warn";
    return "ok";
  };

  // Whole days from the last accident to today; null with no accident in the log.
  const daysSince = (rows, today, types = ACCIDENTS) => {
    const last = rows.filter((row) => types.includes(row.type) && isIso(row.date) && row.date <= today).map((row) => row.date).sort().at(-1);
    return last ? between(last, today) : null;
  };

  // LTIFR: lost-time accidents per million hours worked. TRIR: recordable accidents per 200,000 hours (100 people for a
  // year). Without hours there is no rate.
  const rates = (rows, hours) => {
    const c = counts(rows);
    const lostTime = c["lost-time"];
    const recordable = c["lost-time"] + c["no-lost-time"];
    const ok = Number.isFinite(hours) && hours > 0;
    return {
      lostTime,
      recordable,
      ltifr: ok ? (lostTime * 1e6) / hours : null,
      trir: ok ? (recordable * 2e5) / hours : null,
      nearMissPerAccident: recordable ? c["near-miss"] / recordable : null,
    };
  };

  // Bird's pyramid, top to bottom, next to the 1 : 10 : 30 : 600 of his study.
  const BIRD = [1, 10, 30, 600];
  const pyramid = (rows) => {
    const c = counts(rows);
    return [
      { key: "lost-time", n: c["lost-time"], bird: BIRD[0] },
      { key: "recordable", n: c["no-lost-time"] + c["first-aid"], bird: BIRD[1] },
      { key: "near-miss", n: c["near-miss"], bird: BIRD[2] },
      { key: "unsafe", n: c["unsafe-condition"] + c["unsafe-act"], bird: BIRD[3] },
    ];
  };

  // The talk of the day walks the list one talk a day, the same for everyone on that date.
  const talkIndex = (iso, length) => (length > 0 ? Math.floor(Date.parse(`${iso}T00:00:00Z`) / DAY) % length : 0);

  // A pasted row's type: the key itself, or its long or short name in this language (or in English).
  const typeOf = (value, cfg) => {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return "";
    if (TYPES.includes(text)) return text;
    const names = TYPES.map((type) => [type, [cfg.types?.[type], cfg.short?.[type], type.replace(/-/g, " ")].filter(Boolean).map((name) => name.toLowerCase())]);
    const exact = names.find(([, list]) => list.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 4 && names.find(([, list]) => list.some((name) => name.startsWith(text)));
    return start ? start[0] : "";
  };
  const YES = /^(?:y|yes|ja|j|po|true|1|x|✓|done|erledigt|kryer|e kryer)$/i;
  const severityOf = (value) => {
    const n = Number.parseInt(String(value ?? "").trim(), 10);
    return n >= 1 && n <= 4 ? n : 1;
  };
  // Rows from a spreadsheet: date, shift, type, area, what happened, cause, severity, action, owner, done. A row needs a
  // date and a type; a first row without them is a header.
  const importRows = (text, cfg) => {
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, shift, type, area, what, cause, severity, action, owner, done] = cells;
      const day = kit.parseDate(date);
      const kind = typeOf(type, cfg);
      if (!day || !kind) {
        if (index > 0) skipped++;
        return;
      }
      added.push({
        date: day,
        shift: kit.canon(cfg.shifts || [], shift, ""),
        type: kind,
        area: kit.canon(cfg.areas || [], area, ""),
        what: String(what ?? "").trim(),
        cause: kit.canon(cfg.causes || [], cause, ""),
        severity: severityOf(severity),
        action: String(action ?? "").trim(),
        owner: String(owner ?? "").trim(),
        done: YES.test(String(done ?? "").trim()),
      });
    });
    return { added, skipped };
  };
  // The example of the data file, moved to recent weeks.
  const exampleRows = (cfg) => importRows(kit.recentExample(cfg.example.rows).map((row) => row.replace(/\|/g, "\t")).join("\n"), cfg).added;
  // A saved row, cleaned: an unknown type is dropped, the rest falls back to empty.
  const cleanRow = (row) => {
    if (!row || typeof row !== "object" || !TYPES.includes(row.type)) return null;
    const date = kit.parseDate(row.date);
    if (!date) return null;
    const s = (value) => (typeof value === "string" ? value.trim() : "");
    return { date, shift: s(row.shift), type: row.type, area: s(row.area), what: s(row.what), cause: s(row.cause), severity: severityOf(row.severity), action: s(row.action), owner: s(row.owner), done: row.done === true };
  };

  window.SafetyMath = { TYPES, ACCIDENTS, RED, AMBER, BIRD, crossLayout, monthDays, addMonths, monthRows, counts, dayState, daysSince, rates, pyramid, talkIndex, typeOf, importRows, exampleRows, cleanRow };

  // The page.
  const dataEl = document.getElementById("safety-cross-data");
  const root = document.querySelector("[data-safety-cross]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Workplace = window.Workplace || null;
  const Actions = window.ActionsStore || null;
  const { tx, num, showDate, lower, write, isObject, str, loadState, el, int, pct, plural, today, parseNumber, parseDate,
    logBook, resultLayout, panel, stat, barList, focusCard, resultActions, flash } = kit;
  const M = window.SafetyMath;
  const svg = Chart.svgEl;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const paste = root.querySelector("#sx-paste");

  const state = loadState(KEY, { hours: "", nearMissTarget: "", freeDaysTarget: "", month: "", view: "cross", rows: [], talks: [], example: {}, totalsFor: {}, from: "", to: "" });
  state.rows = state.rows.map(M.cleanRow).filter(Boolean);
  state.talks = state.talks.filter(isObject).map((talk) => ({ date: parseDate(talk.date), title: str(talk.title), example: talk.example === true })).filter((talk) => talk.date);
  if (state.view !== "calendar") state.view = "cross";
  const save = () => write(KEY, state);

  const typeName = (type) => data.types[type] || type;
  const shortName = (type) => data.short[type] || type;
  const monthName = (ym) => `${data.months[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  const shown = () => (/^\d{4}-\d{2}$/.test(state.month) ? state.month : today().slice(0, 7));
  const events = (count) => plural(count, tx("event"), tx("events"));
  const SIGN = { ok: "✓", warn: "!", danger: "✕", future: "", none: "" };
  const stateWords = (dayStateName) => ({ ok: tx("No incident"), warn: tx("Near miss or unsafe condition"), danger: tx("Accident or first aid"), future: tx("Still to come"), none: tx("No such day this month") }[dayStateName]);
  const isOpenAction = (row) => row.action && !row.done;
  const priorityOf = (row) => (RED.includes(row.type) || row.severity >= 4 ? "High" : row.severity >= 3 ? "Medium" : "Low");

  // Areas and shifts: the workplace profile when it has them, else the data file's.
  const areas = () => (Workplace?.areas().length ? Workplace.areas().map((area) => area.name) : data.areas);
  const shifts = () => (Workplace?.shifts().length ? Workplace.shifts() : data.shifts);
  const fillChoices = () => {
    if (!Workplace) return;
    Workplace.fillSelect(entry.elements.area, areas(), entry.elements.area.value);
    Workplace.fillSelect(entry.elements.shift, shifts(), entry.elements.shift.value);
  };

  // The month's events by date.
  const byDate = (rows) => {
    const map = new Map();
    rows.forEach((row) => map.set(row.date, [...(map.get(row.date) || []), row]));
    return map;
  };
  const dayTip = (iso, list, dayStateName) => {
    const lines = [`${showDate(iso)}: ${stateWords(dayStateName)}`];
    list.forEach((row) => lines.push(`${shortName(row.type)}${row.area ? ` · ${row.area}` : ""}${row.what ? `: ${row.what}` : ""}`));
    return lines.join("\n");
  };

  // The green cross, as one SVG of 31 cells (the layout is drawn in the comment on CROSS_ROWS).
  const crossChart = (ym, rowsOfMonth, now) => {
    const CELL = 60, GAP = 6, PAD = 6;
    const size = PAD * 2 + 7 * CELL + 6 * GAP;
    const chart = svg("svg", { viewBox: `0 0 ${size} ${size}`, role: "img", "aria-label": `${t.tool}: ${monthName(ym)}`, class: "ck-chart sx-cross-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    chart.append(svg("title", {}, `${t.tool}: ${monthName(ym)}`));
    const days = monthDays(ym);
    const map = byDate(rowsOfMonth);
    M.crossLayout().forEach(({ day, col, row }) => {
      const x = PAD + col * (CELL + GAP), y = PAD + row * (CELL + GAP);
      const iso = `${ym}-${String(day).padStart(2, "0")}`;
      const real = day <= days;
      const list = real ? map.get(iso) || [] : [];
      const name = real ? M.dayState(list, iso, now) : "none";
      const filled = name === "ok" || name === "warn" || name === "danger";
      const g = svg("g", { class: `sx-cell ck-hit is-${name}` });
      g.append(svg("rect", { x, y, width: CELL, height: CELL, rx: 8, fill: filled ? Chart.stateColor(name) : "transparent", stroke: Chart.C.grid, "stroke-width": filled ? 0 : 1.5, "stroke-dasharray": name === "none" ? "4 4" : undefined }));
      if (real) {
        g.append(svg("text", { x: x + 8, y: y + 17, "font-size": 13, "font-weight": 700, fill: filled ? "#ffffff" : Chart.C.muted }, String(day)));
        if (SIGN[name]) g.append(svg("text", { x: x + CELL / 2, y: y + CELL / 2 + 13, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#ffffff" }, SIGN[name]));
        if (list.length > 1) g.append(svg("text", { x: x + CELL - 8, y: y + 17, "text-anchor": "end", "font-size": 11, "font-weight": 700, fill: "#ffffff" }, `×${list.length}`));
        g.setAttribute("data-tip", dayTip(iso, list, name));
      } else {
        g.setAttribute("data-tip", stateWords("none"));
      }
      chart.append(g);
    });
    return chart;
  };
  // The same month as a calendar, for those who read weeks rather than a cross.
  const calendarChart = (ym, rowsOfMonth, now) => {
    const map = byDate(rowsOfMonth);
    return Chart.calendar(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), (iso) => {
      const list = map.get(iso) || [];
      const name = M.dayState(list, iso, now);
      return { state: name === "future" ? "none" : name, text: SIGN[name], tip: dayTip(iso, list, name) };
    }, { title: `${t.tool}: ${monthName(ym)}`, cellSize: 56 });
  };

  // Bird's pyramid: four levels, the narrowest on top, each with its count and Bird's number beside it.
  // Long names take two lines, so the labels fit beside the pyramid in every language.
  const wrap = (text, max = 30) => {
    const lines = [""];
    String(text).split(" ").forEach((word) => {
      const line = lines.at(-1);
      if (line && (line + " " + word).length > max && lines.length < 2) lines.push(word);
      else lines[lines.length - 1] = line ? `${line} ${word}` : word;
    });
    return lines;
  };
  const pyramidChart = (levels) => {
    const W = 640, H = 290, top = 16, h = 64, cx = 130, base = 240, labelX = 268;
    const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": tx("Safety pyramid"), class: "ck-chart sx-pyramid", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    chart.append(svg("title", {}, tx("Safety pyramid")));
    const half = (y) => ((y - top) / (4 * h)) * (base / 2);
    const fills = [[Chart.C.danger, 1], [Chart.C.danger, 0.6], [Chart.C.warn, 1], [Chart.C.warn, 0.55]];
    const names = data.pyramid;
    levels.forEach((level, i) => {
      const y0 = top + i * h + (i ? 3 : 0), y1 = top + (i + 1) * h;
      const points = [[cx - half(y0), y0], [cx + half(y0), y0], [cx + half(y1), y1], [cx - half(y1), y1]].map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
      const g = svg("g", { class: "ck-hit" });
      g.append(svg("rect", { x: 0, y: y0, width: W, height: y1 - y0, fill: "transparent" }));
      g.append(svg("polygon", { points, fill: fills[i][0], "fill-opacity": fills[i][1] }));
      const ly = top + i * h + h / 2;
      g.append(svg("line", { x1: cx + half(ly) + 6, x2: labelX - 8, y1: ly, y2: ly, stroke: Chart.C.grid, "stroke-width": 1 }));
      g.append(svg("text", { x: labelX + 44, y: ly + 7, "text-anchor": "end", "font-size": 22, "font-weight": 800, fill: Chart.C.text }, int.format(level.n)));
      const lines = wrap(names[level.key]);
      const first = ly - (lines.length - 1) * 8 - 4;
      lines.forEach((line, n) => g.append(svg("text", { x: labelX + 56, y: first + n * 16, "font-size": 13, "font-weight": 700, fill: Chart.C.text }, line)));
      g.append(svg("text", { x: labelX + 56, y: first + lines.length * 16, "font-size": 12, fill: Chart.C.muted }, tx("Bird: {n}", { n: int.format(level.bird) })));
      g.setAttribute("data-tip", `${names[level.key]}: ${int.format(level.n)}\n${tx("Bird: {n}", { n: int.format(level.bird) })}`);
      chart.append(g);
    });
    return chart;
  };

  // Tallies over the log: by cause and by area, positive observations left out (they are not a hazard).
  const tally = (rows, name) => {
    const map = new Map();
    rows.forEach((row) => {
      const key = row[name] || tx("Not recorded");
      const item = map.get(key) || { key, value: 0, serious: 0 };
      item.value++;
      if (row.severity >= 3) item.serious++;
      map.set(key, item);
    });
    return [...map.values()].sort((a, b) => b.value - a.value || b.serious - a.serious || a.key.localeCompare(b.key));
  };
  const hazards = () => state.rows.filter((row) => row.type !== "positive");

  const analyse = () => {
    const ym = shown();
    const now = today();
    const rows = M.monthRows(state.rows, ym);
    const c = M.counts(rows);
    const hours = parseNumber(state.hours);
    const rate = M.rates(rows, hours);
    const days = monthDays(ym);
    const elapsed = now.slice(0, 7) > ym ? days : now.slice(0, 7) < ym ? 0 : Number(now.slice(8, 10));
    const map = byDate(rows);
    const tallyDays = { ok: 0, warn: 0, danger: 0 };
    for (let d = 1; d <= elapsed; d++) {
      const iso = `${ym}-${String(d).padStart(2, "0")}`;
      tallyDays[M.dayState(map.get(iso) || [], iso, now)]++;
    }
    const causes = tally(hazards(), "cause");
    const areaList = tally(hazards(), "area");
    const top = causes[0] || null;
    const topArea = top ? tally(hazards().filter((row) => (row.cause || tx("Not recorded")) === top.key), "area")[0] : null;
    return {
      ym, now, rows, c, hours: hours > 0 ? hours : null, rate, days, elapsed, tallyDays,
      since: M.daysSince(state.rows, now),
      firstDate: state.rows.map((row) => row.date).sort()[0] || now,
      nearMissTarget: parseNumber(state.nearMissTarget) > 0 ? Math.round(parseNumber(state.nearMissTarget)) : null,
      freeDaysTarget: parseNumber(state.freeDaysTarget) > 0 ? Math.round(parseNumber(state.freeDaysTarget)) : null,
      pyramid: M.pyramid(state.rows),
      causes, areas: areaList, top, topArea,
      open: state.rows.map((row, index) => ({ row, index })).filter(({ row }) => isOpenAction(row)).reverse(),
      talksHeld: state.talks.filter((talk) => talk.date.startsWith(`${ym}-`)).length,
    };
  };

  const problemText = (r) => (r.top
    ? tx("{cause}: {n} of {total} safety events in the log, {serious} with serious or fatal potential, most in {area}.", { cause: r.top.key, n: int.format(r.top.value), total: int.format(hazards().length), serious: int.format(r.top.serious), area: r.topArea?.key || "-" })
    : tx("No hazard in the log yet: only positive observations."));

  const summaryText = (r) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Month")}: ${monthName(r.ym)}`, ""];
    lines.push(`${tx("Days without an incident")}: ${tx("{a} of {b}", { a: int.format(r.tallyDays.ok), b: int.format(r.elapsed) })}`);
    lines.push(`${tx("Days since the last accident")}: ${r.since === null ? tx("no accident in the log") : int.format(r.since)}`);
    if (r.hours) lines.push(`${tx("Hours worked")}: ${int.format(r.hours)} · LTIFR ${num(r.rate.ltifr, 2)} · TRIR ${num(r.rate.trir, 2)}`);
    lines.push("", `${tx("Events this month")}: ${int.format(r.rows.length)}`);
    M.TYPES.forEach((type) => { if (r.c[type]) lines.push(`- ${typeName(type)}: ${int.format(r.c[type])}`); });
    lines.push(`${tx("Near misses reported")}: ${int.format(r.c["near-miss"])}${r.nearMissTarget ? ` (${tx("Target")} ${int.format(r.nearMissTarget)})` : ""}`);
    lines.push("", `${tx("Safety pyramid")} (${tx("all {n} in the log", { n: events(state.rows.length) })}):`);
    r.pyramid.forEach((level) => lines.push(`- ${data.pyramid[level.key]}: ${int.format(level.n)} (Bird ${int.format(level.bird)})`));
    if (r.top) {
      lines.push("", `${tx("Start here")}: ${problemText(r)}`);
      const advice = data.advice[r.top.key];
      if (advice) {
        lines.push(`${tx("First moves")}:`);
        advice.moves.forEach((move) => lines.push(`- ${move}`));
        lines.push(`${tx("Question for the floor")}: ${advice.question}`);
      }
    }
    lines.push("", `${tx("Open actions")}: ${int.format(r.open.length)}`);
    r.open.forEach(({ row }) => lines.push(`- ${row.action}${row.owner ? ` (${row.owner})` : ""} · ${showDate(row.date)} · ${shortName(row.type)}`));
    lines.push("", `${tx("Safety talks held this month")}: ${int.format(r.talksHeld)}`);
    return lines.join("\n");
  };

  // The log for the Pareto tool: one count per event, by cause; the area is the filter.
  const paretoTable = () => ({
    source: t.tool,
    headers: [tx("Date"), tx("Shift"), tx("Type"), tx("Area"), tx("Cause"), tx("Severity"), tx("Count")],
    rows: hazards().map((row) => [row.date, row.shift, shortName(row.type), row.area, row.cause || tx("Not recorded"), String(row.severity), "1"]),
    map: { category: 4, count: 6, date: 0, filter: 3 },
    measure: "count",
  });

  // Open actions to the Action Tracker, each once: an action already open there from this tool is not added again.
  const sendActions = (status) => {
    if (!Actions) return;
    const open = state.rows.filter(isOpenAction);
    const there = new Set(Actions.list().filter((action) => Actions.isOpen(action) && action.source === "safety-cross").map((action) => action.title));
    let added = 0;
    open.forEach((row) => {
      if (there.has(row.action)) return;
      const detail = `${typeName(row.type)} · ${showDate(row.date)}${row.area ? ` · ${row.area}` : ""}${row.what ? `: ${row.what}` : ""}`;
      if (Actions.add({ title: row.action, detail, owner: row.owner, example: row.example === true, source: "safety-cross", area: row.area, priority: priorityOf(row), check: tx("The same event does not happen again in this area for a month") })) added++;
      there.add(row.action);
    });
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    status.replaceChildren(`${added ? tx("{n} sent to the Action Tracker.", { n: plural(added, tx("action"), tx("actions")) }) : tx("All open actions are already in the Action Tracker.")} `, link);
  };

  // Result pieces.
  const monthNav = (ym) => {
    const nav = el("div", "sx-month-nav");
    const button = (label, text, move) => {
      const b = el("button", "button-ghost", text);
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.dataset.month = String(move);
      return b;
    };
    nav.append(button(tx("Previous month"), "◀", -1), el("h3", "sx-month", monthName(ym)), button(tx("Next month"), "▶", 1));
    const views = el("div", "sx-views");
    views.setAttribute("role", "group");
    views.setAttribute("aria-label", tx("View"));
    [["cross", tx("Cross")], ["calendar", tx("Calendar")]].forEach(([name, label]) => {
      const b = el("button", "button-ghost", label);
      b.type = "button";
      b.dataset.view = name;
      b.setAttribute("aria-pressed", String(state.view === name));
      views.append(b);
    });
    nav.append(views);
    return nav;
  };

  const talkCard = (r) => {
    const card = el("article", "result-card sx-talk");
    const talk = data.talks[M.talkIndex(r.now, data.talks.length)];
    card.append(el("p", "result-label", tx("Talk of the day")));
    if (!talk) return card;
    card.append(el("h3", null, talk.title), el("p", null, talk.text));
    const held = state.talks.some((item) => item.date === r.now);
    const actions = el("div", "tool-actions");
    const button = el("button", held ? "button-secondary" : "button-primary", held ? `✓ ${tx("Held today")}` : tx("Mark as held"));
    button.type = "button";
    button.dataset.talkHeld = "";
    button.disabled = held;
    button.dataset.title = talk.title;
    const count = state.talks.filter((item) => item.date.startsWith(`${r.now.slice(0, 7)}-`)).length;
    actions.append(button, el("p", "form-note", tx("{n} held this month", { n: plural(count, tx("talk"), tx("talks")) })));
    card.append(actions);
    return card;
  };

  const openPanel = (r) => {
    const box = panel(tx("Open actions"), r.open.length ? tx("Tick an action when it is done. Every event deserves one, with an owner.") : tx("Every action in the log is done."));
    if (r.open.length) {
      const list = el("ul", "sx-actions");
      r.open.slice(0, 15).forEach(({ row, index }) => {
        const item = el("li", RED.includes(row.type) ? "is-danger" : AMBER.includes(row.type) ? "is-warn" : "");
        const box = el("input");
        box.type = "checkbox";
        box.id = `sx-done-${index}`;
        box.dataset.done = String(index);
        const label = el("label");
        label.htmlFor = box.id;
        label.append(el("strong", null, row.action), el("small", null, `${row.owner ? `${row.owner} · ` : ""}${showDate(row.date)} · ${shortName(row.type)}${row.area ? ` · ${row.area}` : ""}`));
        item.append(box, label);
        list.append(item);
      });
      box.append(list);
      if (r.open.length > 15) box.append(el("p", "dl-panel-note", tx("{n} more in the log.", { n: int.format(r.open.length - 15) })));
      if (Actions) {
        const actions = el("div", "tool-actions");
        const send = el("button", "button-secondary", tx("Send open actions to the Action Tracker"));
        send.type = "button";
        const status = el("p", "form-note");
        status.setAttribute("aria-live", "polite");
        send.addEventListener("click", () => sendActions(status));
        actions.append(send, status);
        box.append(actions);
      }
    }
    return box;
  };

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const r = analyse();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${monthName(r.ym)}`));
    const title = el("h2");
    if (r.elapsed) title.append(el("span", null, int.format(r.tallyDays.ok)), ` ${tx("of {n} days without an incident", { n: int.format(r.elapsed) })}`);
    else title.append(tx("{month} has not started yet.", { month: monthName(r.ym) }));
    head.append(title);

    const stats = el("div", "dl-stats");
    const sinceNote = r.freeDaysTarget ? tx("goal {n} days", { n: int.format(r.freeDaysTarget) }) : tx("lost time or not");
    stats.append(r.since === null
      ? stat(tx("Days since the last accident"), `${int.format(Math.max(0, Math.round((Date.parse(`${r.now}T00:00:00Z`) - Date.parse(`${r.firstDate}T00:00:00Z`)) / DAY)))}+`, tx("no accident in the log"))
      : stat(tx("Days since the last accident"), int.format(r.since), sinceNote));
    stats.append(stat("LTIFR", r.hours ? num(r.rate.ltifr, 2) : "–", r.hours ? tx("lost-time accidents per million hours") : tx("add the hours worked")));
    stats.append(stat("TRIR", r.hours ? num(r.rate.trir, 2) : "–", r.hours ? tx("recordable accidents per 200,000 hours") : tx("add the hours worked")));
    stats.append(stat(tx("Near misses per accident"), r.rate.nearMissPerAccident === null ? int.format(r.c["near-miss"]) : num(r.rate.nearMissPerAccident, 1), r.rate.nearMissPerAccident === null ? tx("near misses, no accident this month") : tx("this month; Bird found 30 or more")));
    stats.append(stat(tx("Near misses reported"), r.nearMissTarget ? tx("{a} of {b}", { a: int.format(r.c["near-miss"]), b: int.format(r.nearMissTarget) }) : int.format(r.c["near-miss"]), r.nearMissTarget ? (r.c["near-miss"] >= r.nearMissTarget ? tx("target reached") : tx("{n} to go this month", { n: int.format(r.nearMissTarget - r.c["near-miss"]) })) : tx("this month")));

    // The cross (or the calendar) and the talk of the day, side by side where there is room.
    const board = el("div", "sx-board");
    const crossBox = el("div", "sx-cross");
    crossBox.append(monthNav(r.ym));
    const chart = state.view === "calendar" ? calendarChart(r.ym, r.rows, r.now) : crossChart(r.ym, r.rows, r.now);
    crossBox.append(Chart.figure(chart, { fileName: `safety-cross-${r.ym}` }));
    crossBox.append(Chart.legend([
      { label: `✓ ${tx("No incident")}`, state: "ok" },
      { label: `! ${tx("Near miss or unsafe condition")}`, state: "warn" },
      { label: `✕ ${tx("Accident or first aid")}`, state: "danger" },
    ]));
    board.append(crossBox, talkCard(r));

    const notes = [board];
    if (!r.hours) notes.push(el("p", "dl-warning", tx("Add the hours worked in {month} to see LTIFR and TRIR.", { month: monthName(r.ym) })));

    const focus = r.top ? focusCard({
      title: r.top.key,
      detail: r.topArea?.key,
      lede: problemText(r),
      advice: data.advice[r.top.key],
    }) : null;

    const actions = resultActions(() => summaryText(r), problemText(r), r.causes.length ? paretoTable : null);

    // Events of the month by type, in the order of the pyramid.
    const types = panel(tx("Events this month by type"), tx("{n} in {month}. Red are injuries, amber the warnings before them.", { n: events(r.rows.length), month: monthName(r.ym) }));
    types.append(Chart.figure(Chart.bars(M.TYPES.map((type) => ({
      label: shortName(type),
      value: r.c[type],
      state: RED.includes(type) ? "danger" : AMBER.includes(type) ? "warn" : "ok",
      tip: `${typeName(type)}: ${int.format(r.c[type])}`,
    })), { title: `${tx("Events this month by type")}: ${monthName(r.ym)}`, yMax: Chart.niceMax(Math.max(4, ...Object.values(r.c))), format: (v) => int.format(v) }), { fileName: `safety-events-${r.ym}` }));

    const pyramid = panel(tx("Safety pyramid"), tx("All {n} in the log. Bird found about 1 serious injury for every 10 minor ones, 30 property-damage incidents and 600 near misses (1 : 10 : 30 : 600). A wide base is good news: the team reports what could have happened.", { n: events(state.rows.length) }));
    pyramid.append(Chart.figure(pyramidChart(r.pyramid), { fileName: "safety-pyramid" }));

    const share = (item, total) => [int.format(item.value), ` · ${pct(item.value / total, 0)}${item.serious ? ` · ${tx("{n} serious", { n: int.format(item.serious) })}` : ""}`];
    const total = hazards().length || 1;
    const causes = panel(tx("Causes"), tx("Every event in the log except positive observations, by cause."));
    causes.append(barList(r.causes, { ranked: true, highlight: (item) => item === r.top, tag: tx("Most"), label: (item) => share(item, total) }));
    const areaPanel = panel(tx("Areas"), tx("Where the events happen. The area at the top gets the next walk."));
    areaPanel.append(barList(r.areas, { highlight: (item) => item === r.areas[0], tag: tx("Most"), label: (item) => share(item, total) }));

    resultLayout(results, {
      head,
      stats,
      notes,
      focus,
      actions,
      panels: [openPanel(r), types, pyramid, r.causes.length ? causes : null, r.areas.length ? areaPanel : null].filter(Boolean),
    });
  };

  // Clicks inside the result: the month, the view, a talk held, an action done.
  results.addEventListener("click", (event) => {
    const move = event.target.closest("[data-month]");
    const view = event.target.closest("[data-view]");
    const talk = event.target.closest("[data-talk-held]");
    if (move) {
      state.month = M.addMonths(shown(), Number(move.dataset.month));
      save();
      renderResults();
      results.querySelector(`[data-month="${move.dataset.month}"]`)?.focus();
    } else if (view) {
      state.view = view.dataset.view;
      save();
      renderResults();
      results.querySelector(`[data-view="${state.view}"]`)?.focus();
    } else if (talk && !talk.disabled) {
      state.talks.push({ date: today(), title: talk.dataset.title || "" });
      save();
      renderResults();
      results.querySelector("[data-talk-held]")?.focus();
    }
  });
  results.addEventListener("change", (event) => {
    const box = event.target.closest("[data-done]");
    if (!box) return;
    const row = state.rows[Number(box.dataset.done)];
    if (!row) return;
    row.done = box.checked;
    save();
    book.render();
    flash(root.querySelector("[data-log-status]"), tx("Done: {action}", { action: row.action }));
  });

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      state.hours = "";
      state.nearMissTarget = "";
      state.freeDaysTarget = "";
      state.month = "";
      state.talks = state.talks.filter((talk) => !talk.example);
    },
    cells: (row) => [
      el("td", "nowrap", showDate(row.date)),
      el("td", null, row.shift),
      el("td", `sx-type is-${RED.includes(row.type) ? "danger" : AMBER.includes(row.type) ? "warn" : "ok"}`, shortName(row.type)),
      el("td", null, row.area),
      el("td", "dl-note", row.what),
      el("td", null, row.cause),
      el("td", "num", String(row.severity)),
      el("td", "dl-note", row.action),
      el("td", null, row.owner),
      el("td", "nowrap", row.action ? (row.done ? `✓ ${tx("Done")}` : tx("Open")) : ""),
    ],
    removeLabel: (row) => tx("Remove {type} on {date}", { type: lower(shortName(row.type)), date: showDate(row.date) }),
    removedText: (row) => tx("Removed {type} on {date}.", { type: lower(shortName(row.type)), date: showDate(row.date) }),
    countText: (rows) => `${events(rows.length)} · ${tx("{n} open actions", { n: int.format(rows.filter(isOpenAction).length) })}`,
    importRows: (text) => M.importRows(text, { ...data, areas: areas(), shifts: shifts() }),
    importText: {
      none: tx("No rows found. Check that each row has a date first and the type in the third column."),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date or type", { n: skipped }) : ""}.`,
    },
    loadExample: () => {
      const example = data.example;
      state.rows = M.exampleRows(data);
      state.hours = String(example.hours);
      state.nearMissTarget = String(example.nearMissTarget);
      state.freeDaysTarget = String(example.freeDaysTarget);
      state.month = today().slice(0, 7);
      // A few talks held in the example month, so the count has something to show.
      const now = today();
      const talks = [];
      for (let d = 1; `${now.slice(0, 8)}${String(d).padStart(2, "0")}` < now; d += 2) {
        const date = `${now.slice(0, 8)}${String(d).padStart(2, "0")}`;
        talks.push({ date, title: data.talks[M.talkIndex(date, data.talks.length)].title, example: true });
      }
      state.talks = [...state.talks.filter((talk) => !talk.example), ...talks];
    },
    clearText: tx("Clear the whole {tool} log?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), tx("Shift"), tx("Type"), tx("Area"), tx("What happened"), tx("Cause"), tx("Severity"), tx("Action"), tx("Owner"), tx("Done")],
        ...state.rows.map((row) => [row.date, row.shift, typeName(row.type), row.area, row.what, row.cause, row.severity, row.action, row.owner, row.done ? tx("yes") : tx("no")]),
      ],
    }),
    renderResults,
  });

  // Log an event.
  fillChoices();
  window.addEventListener("workplace:changed", fillChoices);
  entry.elements.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date of the event."));
      return;
    }
    const row = M.cleanRow({
      date,
      shift: form.shift.value,
      type: form.type.value,
      area: form.area.value,
      what: form.what.value,
      cause: form.cause.value,
      severity: form.severity.value,
      action: form.action.value,
      owner: form.owner.value,
      done: form.done.checked,
    });
    // Keep the date, shift and area: the next event is often from the same place. The form is cleared before the
    // results change, so the page is laid out once.
    form.what.value = "";
    form.action.value = "";
    form.owner.value = "";
    form.done.checked = false;
    // A new event is in its own month: the cross shows it.
    state.month = date.slice(0, 7);
    book.add(row);
    flash(entryStatus, tx("Added: {type} on {date}.", { type: shortName(row.type), date: showDate(date) }));
    form.what.focus();
  });

  book.render();
})();
