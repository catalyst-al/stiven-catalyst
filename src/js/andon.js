(() => {
  // Andon Log: every call for help on the floor (a line stop, missing material, a quality doubt, safety, a system
  // down), how fast help arrives and how fast the work runs again, and who should be called when it takes longer.
  // Two ways in: live, a large button per reason that starts the clock (open calls are kept with their time stamps,
  // so a reload loses nothing), and after the fact, a form with the three times. The log is { rows: [{ date, shift,
  // area, reason, called, arrived, solved (HH:MM), responder, stopped, stopMin, note }], open: [live calls] }.
  // The date of a call is the day it was made on this device's clock: a night shift after midnight logs on the new
  // day, as in the other logs. Shift and area are names (the workplace profile's or the page's own).
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
  const pad = (n) => String(n).padStart(2, "0");
  // Monday 0 … Sunday 6.
  const weekdayOf = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;

  // A clock time as typed or pasted: 07:45, 7.45, 0745, 07:45:00, an Excel day fraction (0.3229) or a cell with the
  // date in front (24.10.2026 07:45). "" when it is no time.
  const timeOf = (value) => {
    const stamp = kit.parseDateTime(value);
    if (stamp.date && stamp.time) return stamp.time;
    const text = String(value ?? "").trim();
    let minutes = NaN;
    let match = null;
    if (/^0?[.,]\d+$/.test(text)) minutes = Math.round(kit.parseNumber(text) * 1440);
    else if ((match = text.match(/^(\d{1,2})[:.](\d{2})(?::\d{2})?$/))) minutes = Number(match[1]) * 60 + Number(match[2]);
    else if ((match = text.match(/^(\d{1,2})(\d{2})$/))) minutes = Number(match[1]) * 60 + Number(match[2]);
    if (!(minutes >= 0 && minutes < 1440) || (match && Number(match[2]) > 59)) return "";
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  };
  const toMinutes = (time) => (/^\d{2}:\d{2}$/.test(time) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  // Minutes from one clock time to a later one. A later time that is earlier on the clock is on the next day:
  // called 23:50, solved 00:10 is 20 minutes, not −1420. A call is never taken to last a whole day or more.
  const span = (from, to) => {
    const a = toMinutes(from);
    const b = toMinutes(to);
    if (a === null || b === null) return null;
    return b >= a ? b - a : b - a + 1440;
  };
  // A call closed live also keeps its moments (calledAt, arrivedAt, solvedAt: ms of the device clock) and is measured
  // on them, in the whole minutes its clock times count: on the night the clocks go back, a call at 02:40 summer time
  // solved at 02:10 winter time took 30 minutes, not 1,410 (audit 27 Oct 2026, P2A-05b). Rows typed after the fact,
  // and rows saved before, have their clock times only.
  const minutesBetween = (fromMs, toMs) => Math.floor(toMs / 6e4) - Math.floor(fromMs / 6e4);
  // Time to respond = help arrived − called; time to solve = solved − called (both from the moment of the call).
  const respondOf = (row) => (!row.arrived ? null : row.arrivedAt ? minutesBetween(row.calledAt, row.arrivedAt) : span(row.called, row.arrived));
  const resolveOf = (row) => (row.solvedAt ? minutesBetween(row.calledAt, row.solvedAt) : span(row.called, row.solved));
  // A stopped line counts its stopped minutes; a line that ran on counts none.
  const stopOf = (row) => (row.stopped ? Number(row.stopMin) || 0 : 0);

  const mean = (values) => {
    const list = values.filter(Number.isFinite);
    return list.length ? list.reduce((a, b) => a + b, 0) / list.length : null;
  };
  // The median: the middle value, or the mean of the two middle values of an even count.
  const median = (values) => {
    const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  // Within target = calls at or under the target ÷ calls with that time measured ("within 3 minutes" includes 3).
  const within = (values, target) => {
    const list = values.filter(Number.isFinite);
    const n = list.filter((v) => v <= target).length;
    return { within: n, n: list.length, share: list.length ? n / list.length : null };
  };

  // Escalation: levels [{ name, after }] with `after` minutes from the call, the first at 0. A call still open at
  // `after` minutes is due for that level: levelNow is the level to call at an elapsed time (an open call), and
  // levelReached the highest level a closed call was still open past (solved in exactly 5 minutes never needed the
  // level that starts at 5).
  const levelNow = (elapsed, afters) => {
    let level = 0;
    afters.forEach((after, i) => { if (elapsed >= after) level = i; });
    return level;
  };
  const levelReached = (minutes, afters) => {
    let level = 0;
    afters.forEach((after, i) => { if (i > 0 && minutes > after) level = i; });
    return level;
  };
  // Minutes until the next level, or null at the last one.
  const nextLevelIn = (elapsed, afters) => {
    const next = afters.find((after) => after > elapsed);
    return next === undefined ? null : next - elapsed;
  };

  // Settings typed in the page, or the data file's defaults. The escalation minutes must rise from level to level;
  // otherwise the defaults stand, so a typing slip never shuffles who is called.
  const settings = (cfg, typed = {}) => {
    const pick = (raw, fallback, min, max) => {
      const n = kit.parseNumber(String(raw ?? "").trim());
      return Number.isFinite(n) && n >= min && n <= max ? n : fallback;
    };
    const defaults = cfg.levels.map((level) => level.after);
    const afters = defaults.map((after, i) => (i === 0 ? 0 : pick(typed[`level${i}`], after, 1, 480)));
    const rising = afters.every((after, i) => i === 0 || after > afters[i - 1]);
    return {
      respond: pick(typed.respondTarget, cfg.targets.respond, 0.5, 240),
      resolve: pick(typed.resolveTarget, cfg.targets.resolve, 1, 1440),
      afters: rising ? afters : defaults,
      rising,
    };
  };

  // The figures of some calls.
  const summary = (rows, set) => {
    const respond = rows.map(respondOf).filter(Number.isFinite);
    const resolve = rows.map(resolveOf).filter(Number.isFinite);
    const reached = set.afters.map(() => 0);
    rows.forEach((row) => { reached[levelReached(resolveOf(row), set.afters)]++; });
    const stops = rows.filter((row) => row.stopped);
    return {
      n: rows.length,
      days: new Set(rows.map((row) => row.date)).size,
      respond: { mean: mean(respond), median: median(respond), n: respond.length, ...within(respond, set.respond) },
      resolve: { mean: mean(resolve), median: median(resolve), n: resolve.length, ...within(resolve, set.resolve) },
      reached,
      // Escalated = calls that went past the first level.
      escalated: rows.length - reached[0],
      stops: stops.length,
      stopMin: rows.reduce((sum, row) => sum + stopOf(row), 0),
    };
  };

  // The Pareto of a field: by calls (valueOf counts 1) or by stopped minutes; largest first, its share and the
  // cumulative share; class A is every key that starts below 80 % of the total, as the Pareto tool classes them.
  const pareto = (rows, field, valueOf = () => 1) => {
    const sums = new Map();
    rows.forEach((row) => sums.set(row[field], (sums.get(row[field]) || 0) + valueOf(row)));
    const total = [...sums.values()].reduce((a, b) => a + b, 0);
    let before = 0;
    return [...sums].map(([key, value]) => ({ key, value }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value || String(a.key).localeCompare(String(b.key)))
      .map((item) => {
        const share = total ? item.value / total : 0;
        const cls = before < 0.8 - 1e-9 ? "A" : before < 0.95 - 1e-9 ? "B" : "C";
        before += share;
        return { ...item, share, cumulative: before, cls };
      });
  };

  // Calls by weekday and hour of the call: counts[weekday][hour], with the weekdays and the hours that have calls.
  const heat = (rows) => {
    const counts = Array.from({ length: 7 }, () => Array(24).fill(0));
    rows.forEach((row) => {
      const minutes = toMinutes(row.called);
      if (!isIso(row.date) || minutes === null) return;
      counts[weekdayOf(row.date)][Math.floor(minutes / 60)]++;
    });
    const days = [0, 1, 2, 3, 4, 5, 6].filter((d) => counts[d].some(Boolean));
    const used = [];
    for (let h = 0; h < 24; h++) if (counts.some((day) => day[h])) used.push(h);
    // The hours between the first and the last with calls, quiet ones included, so the day reads as a clock.
    const hours = used.length ? Array.from({ length: used.at(-1) - used[0] + 1 }, (_, i) => used[0] + i) : [];
    const max = Math.max(0, ...counts.flat());
    return { counts, days, hours, max };
  };

  // Per shift or station: calls, median times and the share within the targets.
  const groups = (rows, field, set) => {
    const map = new Map();
    rows.forEach((row) => {
      const key = row[field] || "–";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return [...map].map(([key, list]) => ({ key, ...summary(list, set) }))
      .sort((a, b) => b.n - a.n || String(a.key).localeCompare(String(b.key)));
  };

  // The slowest calls by time to solve, the longest line stop first among equals.
  const slowest = (rows, n = 8) => [...rows].filter((row) => resolveOf(row) !== null)
    .sort((a, b) => resolveOf(b) - resolveOf(a) || stopOf(b) - stopOf(a) || b.date.localeCompare(a.date))
    .slice(0, n);

  // Median times per day, for the trend.
  const daily = (rows) => {
    const map = new Map();
    rows.forEach((row) => {
      if (!map.has(row.date)) map.set(row.date, []);
      map.get(row.date).push(row);
    });
    return [...map].sort(([a], [b]) => a.localeCompare(b)).map(([date, list]) => ({
      date, n: list.length, respond: median(list.map(respondOf)), resolve: median(list.map(resolveOf)),
    }));
  };

  // A typed shift or area to the name of the list when it is one of them (in any case), else as typed.
  const nameOf = (raw, names) => {
    const text = String(raw ?? "").trim();
    return names.find((name) => name.toLowerCase() === text.toLowerCase()) || text;
  };
  // A pasted reason to its key: the key, the name in this language, or the start of either.
  const reasonKey = (raw, cfg) => {
    const text = String(raw ?? "").trim().toLowerCase();
    if (!text) return "";
    const names = cfg.reasons.map((item) => [item.key, [item.key, item.name].map((name) => name.toLowerCase())]);
    const exact = names.find(([, n]) => n.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 3 && names.find(([, n]) => n.some((name) => name.startsWith(text) || text.startsWith(name)));
    return start ? start[0] : "";
  };
  // Yes or no in the three languages; null when the cell is empty or unclear (stopped minutes above 0 then mean yes).
  const yesNo = (raw) => {
    const text = String(raw ?? "").trim().toLowerCase();
    if (!text) return null;
    if (/^(y|yes|j|ja|po|1|true|x|✓)$/.test(text)) return true;
    if (/^(n|no|nein|jo|0|false|-|–)$/.test(text)) return false;
    return null;
  };

  // A saved row, cleaned: no date, no call time or no solved time, no row. An arrival that comes after the solved
  // time is a typing slip and is dropped (time to solve stays). Without stopped minutes a stopped line counts the
  // whole call, since the line waits until the work runs again. The moments of a live call are kept while they still
  // fall on the row's date and clock times; a row changed since is measured on its clock times.
  const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const cleanRow = (row, cfg) => {
    if (!isObject(row)) return null;
    const date = kit.parseDate(row.date);
    const called = timeOf(row.called);
    const solved = timeOf(row.solved);
    if (!date || !called || !solved) return null;
    const ms = (value) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0);
    const on = (at, time) => at > 0 && stampOf(at).time === time;
    const live = on(ms(row.calledAt), called) && stampOf(row.calledAt).date === date && on(ms(row.solvedAt), solved) && row.solvedAt >= row.calledAt
      ? { calledAt: row.calledAt, solvedAt: row.solvedAt } : null;
    let arrived = timeOf(row.arrived);
    if (live && on(ms(row.arrivedAt), arrived) && row.arrivedAt >= live.calledAt && row.arrivedAt <= live.solvedAt) live.arrivedAt = row.arrivedAt;
    const timed = { called, arrived, solved, ...live };
    if (arrived && respondOf(timed) > resolveOf(timed)) { arrived = ""; delete timed.arrivedAt; if (live) delete live.arrivedAt; }
    const s = (v) => (typeof v === "string" ? v.trim() : "");
    const stopped = row.stopped === true;
    const typed = typeof row.stopMin === "number" ? row.stopMin : kit.parseNumber(row.stopMin);
    const whole = resolveOf(timed);
    const stopMin = !stopped ? 0 : Number.isFinite(typed) && typed >= 0 ? Math.min(Math.round(typed), whole) : whole;
    return {
      date,
      shift: s(row.shift).slice(0, 40),
      area: s(row.area).slice(0, 60),
      reason: cfg.reasons.some((item) => item.key === row.reason) ? row.reason : "other",
      called, arrived, solved,
      responder: s(row.responder).slice(0, 80),
      stopped,
      stopMin,
      note: s(row.note).slice(0, 300),
      ...live,
    };
  };
  const cleanRows = (rows, cfg) => (Array.isArray(rows) ? rows.map((row) => cleanRow(row, cfg)).filter(Boolean) : []);

  // A live call: its time stamps in milliseconds of the device clock.
  const cleanOpen = (list, cfg) => (Array.isArray(list) ? list.filter(isObject).map((call) => {
    const calledAt = Number(call.calledAt);
    if (!(calledAt > 0)) return null;
    const arrivedAt = Number(call.arrivedAt) >= calledAt ? Number(call.arrivedAt) : 0;
    const s = (v) => (typeof v === "string" ? v.trim() : "");
    return {
      id: s(call.id).slice(0, 40) || `c${calledAt.toString(36)}`,
      area: s(call.area).slice(0, 60),
      shift: s(call.shift).slice(0, 40),
      reason: cfg.reasons.some((item) => item.key === call.reason) ? call.reason : "other",
      calledAt, arrivedAt,
      responder: s(call.responder).slice(0, 80),
      stopped: call.stopped === true,
      stopMin: s(String(call.stopMin ?? "")).slice(0, 6),
      note: s(call.note).slice(0, 300),
    };
  }).filter(Boolean) : []);

  // A moment on this device's clock as the date and time of the log.
  const stampOf = (ms) => {
    const date = new Date(ms);
    return { date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`, time: `${pad(date.getHours())}:${pad(date.getMinutes())}` };
  };
  // A live call when it is solved: the row of the log. Help that was never marked as arrived is taken to have
  // arrived when the call was solved.
  const closeCall = (call, solvedAt, cfg) => {
    const start = stampOf(call.calledAt);
    const typed = String(call.stopMin ?? "").trim();
    return cleanRow({
      date: start.date,
      shift: call.shift,
      area: call.area,
      reason: call.reason,
      called: start.time,
      arrived: stampOf(call.arrivedAt || solvedAt).time,
      solved: stampOf(solvedAt).time,
      calledAt: call.calledAt,
      arrivedAt: call.arrivedAt || solvedAt,
      solvedAt,
      responder: call.responder,
      stopped: call.stopped,
      stopMin: typed === "" ? "" : typed,
      note: call.note,
    }, cfg);
  };

  // Rows from a spreadsheet: date, shift, station, reason, called, help arrived, solved, responder, line stopped,
  // stopped minutes, note. A first row without a date is a header.
  const importRows = (text, cfg, lists = {}) => {
    const shifts = lists.shifts || cfg.shifts;
    const areas = lists.areas || cfg.areas;
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, shift, area, reason, called, arrived, solved, responder, stop, stopMin, note] = cells;
      const minutes = kit.parseNumber(stopMin);
      const stopped = yesNo(stop) ?? (minutes > 0);
      const row = cleanRow({ date, shift: nameOf(shift, shifts), area: nameOf(area, areas), reason: reasonKey(reason, cfg) || "other", called, arrived, solved, responder, stopped, stopMin: Number.isFinite(minutes) ? minutes : "", note }, cfg);
      if (row) added.push(row);
      else if (index > 0 || kit.parseDate(date)) skipped++;
    });
    return { added, skipped };
  };

  // The example of the data file, moved forward by whole weeks so that its last day is today or just before: the
  // weekdays stay where they are, and so does the heat map.
  const exampleShift = (cfg, today) => {
    const last = addDays(cfg.example.start, Math.max(...cfg.example.rows.map((row) => row.day)));
    const weeks = Math.floor(between(last, today) / 7);
    return weeks > 0 ? weeks * 7 : 0;
  };
  const exampleRows = (cfg, today) => {
    const shift = exampleShift(cfg, today);
    const ex = cfg.example;
    return cleanRows(ex.rows.map((row) => ({
      date: addDays(ex.start, row.day + shift),
      shift: cfg.shifts[row.shift],
      area: cfg.areas[row.area],
      reason: row.reason,
      called: row.called,
      arrived: row.arrived,
      solved: row.solved,
      responder: cfg.responders[row.by],
      stopped: row.stop === 1,
      stopMin: row.stopMin,
      note: ex.notes[row.note] || "",
    })), cfg);
  };

  window.AndonMath = {
    timeOf, toMinutes, span, respondOf, resolveOf, stopOf, mean, median, within, levelNow, levelReached, nextLevelIn,
    settings, summary, pareto, heat, groups, slowest, daily, weekdayOf, nameOf, reasonKey, yesNo, cleanRow, cleanRows,
    cleanOpen, stampOf, closeCall, importRows, exampleShift, exampleRows,
  };

  // The page.
  const dataEl = document.getElementById("andon-data");
  const root = document.querySelector("[data-andon]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Workplace = window.Workplace || null;
  const Actions = window.ActionsStore || null;
  const { tx, num, showDate, write, loadState, el, int, pct, today, parseNumber, parseDate, logBook, resultLayout, panel, stat, barList, focusCard, resultActions, flash, undoNote, dayMonth, inRange, rangeText, lower } = kit;
  const M = window.AndonMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const TOOL = "andon";
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const form = entry.elements;
  const entryStatus = root.querySelector("[data-entry-status]");
  const timesNote = root.querySelector("[data-times-note]");
  const paste = root.querySelector("#an-paste");
  const areaFilter = root.querySelector("[data-filter=area]");
  const reasonFilter = root.querySelector("[data-filter=reason]");
  const liveArea = root.querySelector("#an-live-area");
  const liveShift = root.querySelector("#an-live-shift");
  const liveStatus = root.querySelector("[data-live-status]");
  const openList = root.querySelector("[data-open-list]");

  const state = loadState(KEY, { rows: [], open: [], respondTarget: "", resolveTarget: "", level1: "", level2: "", fArea: "", fReason: "", liveArea: "", liveShift: "", example: {}, totalsFor: {}, from: "", to: "" });
  state.rows = M.cleanRows(state.rows, data);
  state.open = M.cleanOpen(state.open, data);
  const save = () => write(KEY, state);

  const reasonName = (key) => (data.reasons.find((item) => item.key === key) || { name: key }).name;
  const callsText = (n) => (n === 1 ? tx("1 call") : tx("{n} calls", { n: int.format(n) }));
  const minText = (v) => (v === null || !Number.isFinite(v) ? "–" : `${Number.isInteger(v) ? int.format(v) : num(v, 1)} min`);
  const S = () => M.settings(data, state);
  const levelName = (i) => data.levels[i]?.name || "";
  const shiftNames = () => (Workplace?.shifts().length ? Workplace.shifts() : data.shifts);
  const areaNames = () => (Workplace?.areas().length ? Workplace.areas().map((area) => area.name) : data.areas);
  const dayLabel = dayMonth(true);

  // The station and shift lists follow the workplace profile; the filter offers every station in the log too.
  const fillLists = () => {
    const fill = (select, names, wanted) => {
      const value = names.includes(wanted) ? wanted : names.includes(select.value) ? select.value : names[0];
      select.replaceChildren(...names.map((name) => { const option = el("option", null, name); option.value = name; return option; }));
      select.value = value ?? "";
    };
    fill(form.shift, shiftNames(), form.shift.value);
    fill(form.area, areaNames(), form.area.value);
    fill(liveShift, shiftNames(), state.liveShift);
    fill(liveArea, areaNames(), state.liveArea);
    const areas = [...new Set([...areaNames(), ...state.rows.map((row) => row.area).filter(Boolean)])];
    if (state.fArea && !areas.includes(state.fArea)) areas.push(state.fArea);
    const first = areaFilter.options[0];
    areaFilter.replaceChildren(first, ...areas.map((name) => { const option = el("option", null, name); option.value = name; return option; }));
    areaFilter.value = state.fArea;
    reasonFilter.value = data.reasons.some((item) => item.key === state.fReason) ? state.fReason : "";
  };

  const filtered = () => state.rows.filter((row) => (!state.fArea || row.area === state.fArea) && (!state.fReason || row.reason === state.fReason));
  const filterText = () => [state.fArea, state.fReason && reasonName(state.fReason)].filter(Boolean).join(" · ");

  const analyse = () => {
    const rows = inRange(filtered(), state.from, state.to);
    const dates = rows.map((row) => row.date).sort();
    const set = S();
    return {
      rows, set,
      from: state.from || dates[0] || "",
      to: state.to || dates.at(-1) || "",
      sum: M.summary(rows, set),
      byReason: M.pareto(rows, "reason"),
      byStop: M.pareto(rows, "reason", M.stopOf),
      heat: M.heat(rows),
      byShift: M.groups(rows, "shift", set),
      byArea: M.groups(rows, "area", set),
      slow: M.slowest(rows),
      days: M.daily(rows),
    };
  };

  const problemText = (a) => {
    const top = a.byReason[0];
    if (!top) return "";
    const stop = a.byStop.find((item) => item.key === top.key);
    return tx("{reason}: {n} of {total} calls ({share}), {min} of line stop.", { reason: reasonName(top.key), n: int.format(top.value), total: int.format(a.sum.n), share: pct(top.share, 0), min: minText(stop ? stop.value : 0) });
  };
  const withinText = (part) => (part.share === null ? "–" : pct(part.share, 0));
  const withinNote = (part, target) => tx("{a} of {b} within {t}", { a: int.format(part.within), b: int.format(part.n), t: minText(target) });
  const levelsText = (set) => set.afters.map((after, i) => `${levelName(i)} ${i ? tx("after {n}", { n: minText(after) }) : tx("at once")}`).join(" · ");

  const summaryText = (a) => {
    const s = a.sum;
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Period")}: ${rangeText({ from: a.from, to: a.to })}${filterText() ? ` · ${filterText()}` : ""}`, ""];
    lines.push(`${tx("Calls")}: ${int.format(s.n)} ${tx("on {d} days", { d: int.format(s.days) })}`);
    lines.push(`${tx("Time to respond")}: ${tx("median {m} · mean {a}", { m: minText(s.respond.median), a: minText(s.respond.mean) })} · ${tx("within target")} ${withinText(s.respond)} (${withinNote(s.respond, a.set.respond)})`);
    lines.push(`${tx("Time to solve")}: ${tx("median {m} · mean {a}", { m: minText(s.resolve.median), a: minText(s.resolve.mean) })} · ${tx("within target")} ${withinText(s.resolve)} (${withinNote(s.resolve, a.set.resolve)})`);
    lines.push(`${tx("Escalation")}: ${levelsText(a.set)}`);
    s.reached.forEach((n, i) => { if (i) lines.push(`- ${tx("Reached {level}", { level: levelName(i) })}: ${int.format(s.reached.slice(i).reduce((x, y) => x + y, 0))}`); });
    lines.push(`${tx("Line stopped")}: ${tx("{n} calls · {min} in all", { n: int.format(s.stops), min: minText(s.stopMin) })}`);
    lines.push("", `${tx("Calls by reason")}:`);
    a.byReason.forEach((item) => lines.push(`- ${reasonName(item.key)}: ${int.format(item.value)} (${pct(item.share, 0)})`));
    if (a.byStop.length) {
      lines.push("", `${tx("Stopped minutes by reason")}:`);
      a.byStop.forEach((item) => lines.push(`- ${reasonName(item.key)}: ${minText(item.value)} (${pct(item.share, 0)})`));
    }
    lines.push("", `${tx("Slowest calls")}:`);
    a.slow.slice(0, 5).forEach((row) => lines.push(`- ${showDate(row.date)} ${row.called} · ${row.area} · ${reasonName(row.reason)}: ${tx("respond {r}, solve {s}", { r: minText(M.respondOf(row)), s: minText(M.resolveOf(row)) })}${row.note ? ` · ${row.note}` : ""}`));
    const top = a.byReason[0];
    if (top) {
      const advice = data.advice[top.key] || data.advice.default;
      lines.push("", `${tx("Start here")}: ${problemText(a)}`, `${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    return lines.join("\n");
  };

  // The calls of the period for Pareto: one row per call, the reason as the category, the station as the filter and
  // the stopped minutes as the value (Pareto counts the calls; the minutes can be chosen there).
  const paretoTable = (a) => () => ({
    source: t.tool,
    template: TOOL,
    headers: [tx("Date"), tx("Station or area"), tx("Reason"), tx("Shift"), tx("Stopped minutes")],
    rows: a.rows.map((row) => [row.date, row.area, reasonName(row.reason), row.shift, String(M.stopOf(row))]),
    map: { date: 0, filter: 1, category: 2, count: -1, value: 4 },
    measure: "count",
    valueLabel: "min",
  });

  const actionButton = (getAction) => (Actions ? Actions.linkButton(tx("Add to actions"), getAction) : kit.trackerLink(tx("Add to actions"), getAction));
  const topAction = (a) => () => {
    const top = a.byReason[0];
    const advice = data.advice[top.key] || data.advice.default;
    const area = M.pareto(a.rows.filter((row) => row.reason === top.key), "area")[0]?.key || "";
    return {
      title: tx("Fewer andon calls for {reason}", { reason: lower(reasonName(top.key)) }),
      detail: `${problemText(a)} ${advice.moves[0]}`,
      source: TOOL,
      area,
      priority: top.share >= 0.3 ? "High" : "Medium",
      due: addDays(today(), 14),
      check: tx("The calls for {reason} per day are down over the next four weeks, and the median time to solve is within {t}.", { reason: lower(reasonName(top.key)), t: minText(a.set.resolve) }),
    };
  };
  // 5 Whys from one call: the page's own 5 Whys link says which worksheet to open.
  const whysLink = (row) => {
    const url = new URL(document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href));
    url.searchParams.set("problem", tx("Andon call {date} {time} at {area}: {reason}, solved after {min}.", { date: showDate(row.date), time: row.called, area: row.area, reason: lower(reasonName(row.reason)), min: minText(M.resolveOf(row)) }) + (row.note ? ` ${row.note}` : ""));
    const link = el("a", "inline-link", tx("5 Whys"));
    link.href = url.href;
    return link;
  };

  const paretoPanel = (title, items, unit, fileName, note) => {
    const vital = items.filter((item) => item.cls === "A");
    const box = panel(title, `${note} ${tx("The highlighted bars are the vital few:")} ${vital.map((item) => reasonName(item.key)).join(", ")}.`);
    box.append(Chart.figure(Chart.bars(items.map((item) => ({ label: reasonName(item.key), value: item.value, tip: `${reasonName(item.key)}: ${int.format(item.value)} ${unit} (${pct(item.share, 0)}, ${tx("cumulative")} ${pct(item.cumulative, 0)})` })), { title, unit, highlight: (bar) => vital.some((v) => reasonName(v.key) === bar.label) }), { fileName }));
    return box;
  };

  const heatPanel = (a) => {
    const h = a.heat;
    const box = panel(tx("Calls by hour and weekday"), tx("Darker is more calls. The hour is the hour of the call; tap a cell for the count."));
    box.classList.add("an-heat");
    const days = h.days.map((d) => data.weekdays[d]);
    const hours = h.hours.map((hour) => `${pad(hour)}:00`);
    box.append(Chart.figure(Chart.heatmap(days, hours, (r, c) => {
      const n = h.counts[h.days[r]][h.hours[c]];
      if (!n) return null;
      const share = n / (h.max || 1);
      return { text: String(n), color: Chart.C.blue, opacity: 0.18 + 0.82 * share, textColor: share > 0.45 ? "#ffffff" : Chart.C.text, tip: `${days[r]} ${hours[c]}–${pad(h.hours[c] + 1)}:00: ${callsText(n)}` };
    }, { title: tx("Calls by hour and weekday"), labelWidth: 56, cellSize: 36 }), { fileName: "andon-heatmap" }));
    return box;
  };

  const trendPanel = (a) => {
    const title = tx("Median times by day");
    const box = panel(title, tx("Time to respond and time to solve, the median of each day with calls. Targets: respond {r}, solve {s}.", { r: minText(a.set.respond), s: minText(a.set.resolve) }));
    const label = (row) => dayLabel(new Date(`${row.date}T00:00:00Z`));
    const series = [
      { label: tx("Time to respond"), points: a.days.map((row) => ({ x: label(row), y: row.respond ?? 0, tip: `${showDate(row.date)} · ${tx("Time to respond")}: ${minText(row.respond)} (${callsText(row.n)})` })) },
      { label: tx("Time to solve"), points: a.days.map((row) => ({ x: label(row), y: row.resolve ?? 0, state: row.resolve !== null && row.resolve > a.set.resolve ? "warn" : "ok", tip: `${showDate(row.date)} · ${tx("Time to solve")}: ${minText(row.resolve)}${row.resolve !== null && row.resolve > a.set.resolve ? ` · ${tx("above target")}` : ""}` })) },
    ];
    box.append(Chart.figure(Chart.line(series, { title, yMin: 0, unit: "min", target: a.set.resolve }), { fileName: "andon-times-by-day" }));
    box.append(Chart.legend([{ label: tx("Time to respond"), color: Chart.SERIES[0] }, { label: tx("Time to solve"), color: Chart.SERIES[1] }]));
    return box;
  };

  const levelPanel = (a) => {
    const box = panel(tx("Escalation level reached"), `${tx("The last level each call was still open past.")} ${levelsText(a.set)}.`);
    const items = a.sum.reached.map((n, i) => ({ label: levelName(i), value: n, tip: `${levelName(i)}: ${callsText(n)} (${a.sum.n ? pct(n / a.sum.n, 0) : "–"})` }));
    box.append(Chart.figure(Chart.bars(items, { title: tx("Escalation level reached"), highlight: (item) => item.label === levelName(data.levels.length - 1) && item.value > 0 }), { fileName: "andon-escalation" }));
    return box;
  };

  const groupPanel = (title, list, a) => {
    const box = panel(title, tx("Calls, median time to respond and to solve, and the share solved within target."));
    box.append(barList(list.map((item) => ({ ...item, value: item.n })), {
      label: (item) => [callsText(item.n), ` · ${minText(item.respond.median)} / ${minText(item.resolve.median)} · ${withinText(item.resolve)} ${tx("within target")}`],
      highlight: (item) => item === list[0],
    }));
    return box;
  };

  const slowPanel = (a) => {
    const box = panel(tx("Slowest calls"), tx("The longest time to solve first. Take one to 5 Whys to find out why it took so long."));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table an-slow");
    const head = el("tr");
    [tx("Date"), tx("Called"), tx("Station or area"), tx("Reason"), tx("Respond"), tx("Solve"), tx("Escalation level"), ""].forEach((name) => {
      const th = el("th", null, name);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    a.slow.forEach((row) => {
      const tr = el("tr");
      const level = M.levelReached(M.resolveOf(row), a.set.afters);
      const respond = M.respondOf(row);
      tr.append(
        el("td", "nowrap", showDate(row.date)),
        el("td", "nowrap", row.called),
        el("td", null, row.area),
        el("td", null, `${reasonName(row.reason)}${row.note ? ` · ${row.note}` : ""}`),
        el("td", "nowrap", `${minText(respond)}${respond !== null && respond > a.set.respond ? " ✕" : ""}`),
        el("td", "nowrap", `${minText(M.resolveOf(row))}${M.resolveOf(row) > a.set.resolve ? " ✕" : ""}`),
        el("td", null, levelName(level)),
      );
      const cell = el("td");
      cell.append(whysLink(row));
      tr.append(cell);
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    box.append(wrap, el("p", "dl-panel-note", tx("✕ marks a time above its target.")));
    return box;
  };

  const renderResults = () => {
    results.replaceChildren();
    fillLists();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const a = analyse();
    const s = a.sum;
    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${rangeText({ from: a.from, to: a.to })}${filterText() ? ` · ${filterText()}` : ""}`));
    const title = el("h2");
    if (!a.rows.length) {
      title.append(tx("No calls in this period."));
      head.append(title);
      results.append(head);
      return;
    }
    title.append(el("span", null, callsText(s.n)), ` · ${tx("help in {r}, solved in {s} (median)", { r: minText(s.respond.median), s: minText(s.resolve.median) })}`);
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Calls"), int.format(s.n), tx("{x} per day on {d} days with calls", { x: num(s.n / (s.days || 1), 1), d: int.format(s.days) })));
    stats.append(stat(tx("Time to respond"), minText(s.respond.median), `${tx("median {m} · mean {a}", { m: minText(s.respond.median), a: minText(s.respond.mean) })} · ${tx("from the call to help on site")}`));
    stats.append(stat(tx("Time to solve"), minText(s.resolve.median), `${tx("median {m} · mean {a}", { m: minText(s.resolve.median), a: minText(s.resolve.mean) })} · ${tx("from the call until the work runs again")}`));
    stats.append(stat(tx("Responded within target"), withinText(s.respond), withinNote(s.respond, a.set.respond)));
    stats.append(stat(tx("Solved within target"), withinText(s.resolve), withinNote(s.resolve, a.set.resolve)));
    stats.append(stat(tx("Escalated"), int.format(s.escalated), s.reached.map((n, i) => (i ? `${tx("Reached {level}", { level: levelName(i) })}: ${int.format(s.reached.slice(i).reduce((x, y) => x + y, 0))}` : "")).filter(Boolean).join(" · ")));
    stats.append(stat(tx("Line stopped"), minText(s.stopMin), tx("{n} of {total} calls stopped the line", { n: int.format(s.stops), total: int.format(s.n) })));

    const notes = [];
    if (!a.set.rising) notes.push(el("p", "dl-warning", tx("The escalation minutes must rise from level to level; the defaults are used until they do.")));

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
      paretoPanel(tx("Calls by reason (Pareto)"), a.byReason, tx("calls"), "andon-reasons", tx("Largest first.")),
      heatPanel(a),
      trendPanel(a),
      levelPanel(a),
      groupPanel(tx("By shift"), a.byShift, a),
      groupPanel(tx("By station or area"), a.byArea, a),
      slowPanel(a),
    ];
    if (a.byStop.length) panels.splice(1, 0, paretoPanel(tx("Stopped minutes by reason (Pareto)"), a.byStop, "min", "andon-stopped", tx("Minutes the line stood, largest first.")));
    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      state.respondTarget = "";
      state.resolveTarget = "";
      state.level1 = "";
      state.level2 = "";
      state.fArea = "";
      state.fReason = "";
    },
    cells: (row) => [
      el("td", "nowrap", showDate(row.date)),
      el("td", "nowrap", row.called),
      el("td", null, row.area),
      el("td", null, reasonName(row.reason)),
      el("td", "nowrap", minText(M.respondOf(row))),
      el("td", "nowrap", minText(M.resolveOf(row))),
      el("td", "nowrap", row.stopped ? minText(row.stopMin) : "–"),
    ],
    removeLabel: (row) => tx("Remove the call of {date} {time}", { date: showDate(row.date), time: row.called }),
    removedText: (row) => tx("Removed the call of {time}.", { time: row.called }),
    countText: (rows) => callsText(rows.length),
    importRows: (text) => M.importRows(text, data, { shifts: shiftNames(), areas: areaNames() }),
    importText: {
      none: tx("No rows found. Check that each row starts with the date and has the time called and the time solved."),
      done: (added, skipped) => `${tx("Imported {n} rows", { n: int.format(added) })}${skipped ? tx(", skipped {n} without a date or times", { n: int.format(skipped) }) : ""}.`,
    },
    loadExample: () => {
      state.rows = M.exampleRows(data, today());
      state.respondTarget = "";
      state.resolveTarget = "";
      state.level1 = "";
      state.level2 = "";
      state.fArea = "";
      state.fReason = "";
    },
    clearText: tx("Clear the whole {tool}?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), tx("Shift"), tx("Station or area"), tx("Reason"), tx("Called"), tx("Help arrived"), tx("Solved"), tx("Time to respond (min)"), tx("Time to solve (min)"), tx("Level reached"), tx("Responder"), tx("Line stopped"), tx("Stopped minutes"), tx("Note")],
        ...state.rows.map((row) => [row.date, row.shift, row.area, reasonName(row.reason), row.called, row.arrived, row.solved, M.respondOf(row) ?? "", M.resolveOf(row), levelName(M.levelReached(M.resolveOf(row), S().afters)), row.responder, row.stopped ? tx("yes") : tx("no"), M.stopOf(row), row.note]),
      ],
    }),
    renderResults,
  });

  [[areaFilter, "fArea"], [reasonFilter, "fReason"]].forEach(([select, name]) => select.addEventListener("change", () => {
    state[name] = select.value;
    save();
    renderResults();
  }));

  // The form after the fact: the times as they are typed give the minutes at once.
  const showTimes = () => {
    const called = M.timeOf(form.called.value);
    const solved = M.timeOf(form.solved.value);
    const arrived = M.timeOf(form.arrived.value);
    const parts = [];
    if (called && arrived) parts.push(`${tx("Time to respond")}: ${minText(M.span(called, arrived))}`);
    if (called && solved) parts.push(`${tx("Time to solve")}: ${minText(M.span(called, solved))}`);
    if (called && solved && toMinutesSafe(solved) < toMinutesSafe(called)) parts.push(tx("solved the next day"));
    timesNote.textContent = parts.join(" · ");
  };
  const toMinutesSafe = (time) => M.toMinutes(time) ?? 0;
  ["called", "arrived", "solved"].forEach((name) => form[name].addEventListener("input", showTimes));

  form.date.value = today();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date: the day of the call, the new day after midnight."));
      return;
    }
    const called = M.timeOf(form.called.value);
    if (!called) {
      form.called.focus();
      flash(entryStatus, tx("Enter the time of the call."));
      return;
    }
    const solved = M.timeOf(form.solved.value);
    if (!solved) {
      form.solved.focus();
      flash(entryStatus, tx("Enter the time the problem was solved."));
      return;
    }
    const arrived = form.arrived.value.trim() ? M.timeOf(form.arrived.value) : "";
    if (form.arrived.value.trim() && (!arrived || M.span(called, arrived) > M.span(called, solved))) {
      form.arrived.focus();
      flash(entryStatus, tx("Help arrived must be between the call and the solution."));
      return;
    }
    const typed = form.stopMin.value.trim();
    const minutes = typed ? parseNumber(typed) : NaN;
    if (typed && !(minutes >= 0)) {
      form.stopMin.focus();
      flash(entryStatus, tx("Enter the stopped minutes as a number, or leave it empty."));
      return;
    }
    const row = M.cleanRow({ date, shift: form.shift.value, area: form.area.value, reason: form.reason.value, called, arrived, solved, responder: form.responder.value, stopped: form.stopped.value === "yes", stopMin: typed ? minutes : "", note: form.note.value }, data);
    form.called.value = "";
    form.arrived.value = "";
    form.solved.value = "";
    form.stopMin.value = "";
    form.note.value = "";
    timesNote.textContent = "";
    book.add(row);
    flash(entryStatus, tx("Added: {reason} at {time}, solved after {min}.", { reason: reasonName(row.reason), time: row.called, min: minText(M.resolveOf(row)) }));
    form.called.focus();
  });

  // Live calls. Each open call is a card with its running minutes, the level to call now, and the buttons; the
  // minutes are redrawn every 15 seconds without rebuilding the card, so a field being typed in keeps its text.
  let timer = null;
  const minutesOpen = (call, now) => Math.max(0, (now - call.calledAt) / 6e4);
  const tickCard = (card, call, now) => {
    const set = S();
    const elapsed = minutesOpen(call, now);
    const whole = Math.floor(elapsed);
    const level = M.levelNow(elapsed, set.afters);
    const next = M.nextLevelIn(elapsed, set.afters);
    card.querySelector("[data-elapsed]").textContent = int.format(whole);
    // A call that reaches the next level is said once in the live status (read by screen readers), not every minute.
    if (card.dataset.level !== undefined && card.dataset.level !== String(level)) flash(liveStatus, `${tx("Call now: {level}", { level: levelName(level) })} · ${reasonName(call.reason)}, ${call.area}`);
    card.dataset.level = String(level);
    const status = card.querySelector("[data-help]");
    status.textContent = call.arrivedAt
      ? tx("Help on site since {time} ({min} to respond)", { time: M.stampOf(call.arrivedAt).time, min: minText(Math.round((call.arrivedAt - call.calledAt) / 6e4)) })
      : tx("Waiting for help");
    const esc = card.querySelector("[data-escalate]");
    const marker = level >= data.levels.length - 1 ? "▲▲ " : level > 0 ? "▲ " : "";
    esc.textContent = `${marker}${tx("Call now: {level}", { level: levelName(level) })}${next === null ? "" : ` · ${tx("{level} in {n}", { level: levelName(level + 1), n: minText(Math.ceil(next)) })}`}`;
  };
  const tick = () => {
    const now = Date.now();
    openList.querySelectorAll("[data-call-id]").forEach((card) => {
      const call = state.open.find((item) => item.id === card.dataset.callId);
      if (call) tickCard(card, call, now);
    });
  };
  const syncTimer = () => {
    if (state.open.length && !timer) timer = setInterval(tick, 15000);
    if (!state.open.length && timer) { clearInterval(timer); timer = null; }
  };

  const field = (id, label, input) => {
    const box = el("div", "field");
    const lab = el("label", null, label);
    lab.htmlFor = id;
    input.id = id;
    box.append(lab, input);
    return box;
  };
  const renderOpen = () => {
    openList.replaceChildren();
    openList.hidden = !state.open.length;
    const now = Date.now();
    state.open.forEach((call) => {
      const card = el("article", "an-open");
      card.dataset.callId = call.id;
      const top = el("div", "an-open-head");
      const name = el("h3", null, reasonName(call.reason));
      name.append(el("span", null, ` · ${call.area}`));
      top.append(name, el("p", "form-note", tx("{shift} · called at {time}", { shift: call.shift, time: M.stampOf(call.calledAt).time })));
      const clock = el("p", "an-timer");
      clock.append(el("strong", null, ""), ` ${tx("min open")}`);
      clock.firstChild.dataset.elapsed = "";
      const help = el("p", "an-help");
      help.dataset.help = "";
      const esc = el("p", "an-escalate");
      esc.dataset.escalate = "";

      const grid = el("div", "dl-grid an-open-fields");
      const by = el("input");
      by.setAttribute("list", "an-responders");
      by.autocomplete = "off";
      by.value = call.responder;
      by.placeholder = t.responderPlaceholder;
      by.addEventListener("input", () => { call.responder = by.value; save(); });
      const stopBox = el("label", "an-check");
      const stopped = el("input");
      stopped.type = "checkbox";
      stopped.checked = call.stopped;
      stopped.addEventListener("change", () => { call.stopped = stopped.checked; save(); });
      stopBox.append(stopped, ` ${tx("The line stopped")}`);
      const stopMin = el("input");
      stopMin.inputMode = "numeric";
      stopMin.autocomplete = "off";
      stopMin.value = call.stopMin;
      stopMin.placeholder = tx("the whole call");
      stopMin.addEventListener("input", () => { call.stopMin = stopMin.value; save(); });
      const note = el("input");
      note.autocomplete = "off";
      note.value = call.note;
      note.placeholder = t.notePlaceholder;
      note.addEventListener("input", () => { call.note = note.value; save(); });
      const noteField = field(`an-open-${call.id}-note`, tx("Note"), note);
      noteField.classList.add("dl-wide");
      grid.append(field(`an-open-${call.id}-by`, tx("Who responded"), by), stopBox, field(`an-open-${call.id}-min`, tx("Stopped minutes"), stopMin), noteField);

      const buttons = el("div", "tool-actions an-open-actions");
      if (!call.arrivedAt) {
        const arrived = el("button", "button-secondary an-arrived", tx("Help arrived"));
        arrived.type = "button";
        arrived.addEventListener("click", () => {
          call.arrivedAt = Date.now();
          save();
          renderOpen();
          flash(liveStatus, tx("Help arrived at {time}.", { time: M.stampOf(call.arrivedAt).time }));
          openList.querySelector(`[data-call-id="${call.id}"] .an-solved`)?.focus();
        });
        buttons.append(arrived);
      }
      const solved = el("button", "button-primary an-solved", tx("Solved"));
      solved.type = "button";
      solved.addEventListener("click", () => {
        const row = M.closeCall(call, Date.now(), data);
        state.open = state.open.filter((item) => item.id !== call.id);
        if (row) book.add(row);
        else save();
        renderOpen();
        flash(liveStatus, row ? tx("Solved: {reason} at {area}, {min} after the call.", { reason: reasonName(row.reason), area: row.area, min: minText(M.resolveOf(row)) }) : "");
        root.querySelector(`[data-call="${call.reason}"]`)?.focus();
      });
      const cancel = el("button", "button-ghost", tx("Cancel the call"));
      cancel.type = "button";
      cancel.addEventListener("click", () => {
        const index = state.open.indexOf(call);
        state.open.splice(index, 1);
        save();
        renderOpen();
        undoNote(liveStatus, tx("Call cancelled."), () => {
          state.open.splice(Math.min(index, state.open.length), 0, call);
          save();
          renderOpen();
        });
      });
      buttons.append(solved, cancel);
      card.append(top, clock, help, esc, grid, buttons);
      openList.append(card);
      tickCard(card, call, now);
    });
    syncTimer();
  };

  root.querySelectorAll("[data-call]").forEach((button) => button.addEventListener("click", () => {
    const now = Date.now();
    const call = M.cleanOpen([{ id: `c${now.toString(36)}${Math.random().toString(36).slice(2, 5)}`, area: liveArea.value, shift: liveShift.value, reason: button.dataset.call, calledAt: now }], data)[0];
    state.open.push(call);
    save();
    renderOpen();
    flash(liveStatus, tx("Call started: {reason} at {area}, {time}.", { reason: reasonName(call.reason), area: call.area, time: M.stampOf(now).time }));
  }));
  [[liveArea, "liveArea"], [liveShift, "liveShift"]].forEach(([select, name]) => select.addEventListener("change", () => {
    state[name] = select.value;
    save();
  }));
  // Back on the page after a while (a tablet asleep at the line): the minutes catch up at once.
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") tick(); });

  if (Workplace) {
    window.addEventListener("workplace:changed", renderResults);
    window.addEventListener("storage", (event) => { if (event.key === Workplace.KEY || event.key === null) renderResults(); });
  }
  book.render();
  renderOpen();
})();
