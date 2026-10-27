// Maintenance Planner: the plan of preventive maintenance and statutory checks of a site's assets. Each asset has its
// tasks (what, how often in days, weeks, months, years or operating hours, who, how long); the log holds what was done,
// what was postponed and why, the meter readings and the breakdowns between the tasks. From that log the planner works
// out when each task is due next, what is overdue, how much of the plan was done on time (PM compliance) and how often
// each asset stops (MTBF, MTTR). The arithmetic lives in window.MaintenancePlannerMath, so tests can call it.
(() => {
  const UNITS = ["days", "weeks", "months", "years", "hours"];
  const KINDS = ["done", "postponed", "breakdown", "reading"];
  const WHO = ["internal", "external"];
  const CRITS = ["A", "B", "C"];
  const DAY = 864e5;
  const pad = (n) => String(n).padStart(2, "0");
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value));
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  const weekEnd = (iso) => addDays(mondayOf(iso), 6);
  const monthEnd = (iso) => { const [y, m] = iso.split("-").map(Number); return `${y}-${pad(m)}-${pad(new Date(Date.UTC(y, m, 0)).getUTCDate())}`; };
  // A month or a year later keeps the day where it can; 31 January plus one month is the last day of February.
  const addInterval = (iso, every, unit) => {
    const n = Math.round(Number(every)) || 0;
    if (!isIso(iso)) return "";
    if (unit === "days") return addDays(iso, n);
    if (unit === "weeks") return addDays(iso, 7 * n);
    if (unit === "months" || unit === "years") {
      const [y, m, d] = iso.split("-").map(Number);
      const total = y * 12 + (m - 1) + (unit === "years" ? 12 * n : n);
      const year = Math.floor(total / 12), month = total - year * 12;
      const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      return `${String(year).padStart(4, "0")}-${pad(month + 1)}-${pad(Math.min(d, last))}`;
    }
    return "";
  };
  const intervalDays = (task) => {
    const n = Number(task?.every) || 0;
    return { days: n, weeks: 7 * n, months: 30.44 * n, years: 365.25 * n }[task?.unit] ?? null;
  };
  // The tolerance of "on time": a tenth of the interval, at most 7 days (a weekly check has none, a yearly one a week).
  const graceDays = (task, rate = null) => {
    const spans = [intervalDays(task)];
    const hours = task?.unit === "hours" ? Number(task.every) : Number(task?.hours);
    if (hours > 0 && rate > 0) spans.push(hours / rate);
    const days = Math.min(...spans.filter((d) => d > 0));
    return Number.isFinite(days) ? Math.min(7, Math.floor(days * 0.1)) : 0;
  };
  const byDate = (a, b) => String(a.date).localeCompare(String(b.date));

  // Operating hours: the meter readings of an asset (and the hours written on a done task), the hours it runs per day,
  // the hours on a given day (between two readings, or carried on at the rate) and the day it reaches a number of hours.
  const meterPoints = (events) => events.filter((e) => (e.kind === "reading" || e.kind === "done") && typeof e.hours === "number" && Number.isFinite(e.hours) && e.hours >= 0 && isIso(e.date))
    .map((e) => ({ date: e.date, hours: e.hours })).sort((a, b) => a.date.localeCompare(b.date) || a.hours - b.hours);
  const rateOf = (points) => {
    if (points.length < 2) return null;
    const first = points[0], last = points.at(-1);
    const days = daysBetween(first.date, last.date);
    return days > 0 && last.hours > first.hours ? (last.hours - first.hours) / days : null;
  };
  const hoursAt = (points, date) => {
    if (!points.length || !isIso(date)) return null;
    const rate = rateOf(points);
    const first = points[0], last = points.at(-1);
    if (date <= first.date) return date === first.date ? first.hours : rate ? Math.max(0, first.hours - rate * daysBetween(date, first.date)) : null;
    if (date >= last.date) return date === last.date ? last.hours : rate ? last.hours + rate * daysBetween(last.date, date) : null;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (date <= b.date) {
        const span = daysBetween(a.date, b.date);
        return span > 0 ? a.hours + ((b.hours - a.hours) * daysBetween(a.date, date)) / span : b.hours;
      }
    }
    return last.hours;
  };
  const dateAtHours = (points, hours) => {
    if (!points.length || !Number.isFinite(hours)) return "";
    const rate = rateOf(points);
    const first = points[0], last = points.at(-1);
    if (hours <= first.hours) return rate ? addDays(first.date, -Math.floor((first.hours - hours) / rate)) : first.date;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (hours <= b.hours && b.hours > a.hours) return addDays(a.date, Math.ceil(((hours - a.hours) / (b.hours - a.hours)) * daysBetween(a.date, b.date)));
    }
    return rate ? addDays(last.date, Math.ceil((hours - last.hours) / rate)) : "";
  };

  // When a task is due next: its interval after the last time it was done (or after the date it was last done before
  // the plan began, else on its start date), or when the meter reaches the hours, whichever comes first. A postponement
  // logged after the last done moves the date; the original date stays for the compliance.
  const nextDue = (task, events, points = meterPoints(events)) => {
    const mine = events.filter((e) => e.task === task.id && isIso(e.date)).sort(byDate);
    const doneAt = mine.reduce((at, e, i) => (e.kind === "done" ? i : at), -1);
    const last = doneAt >= 0 ? mine[doneAt] : null;
    const lastDate = last ? last.date : isIso(task.last) ? task.last : "";
    const hourEvery = task.unit === "hours" ? Number(task.every) : Number(task.hours) || 0;
    const calendar = task.unit === "hours" ? "" : lastDate ? addInterval(lastDate, task.every, task.unit) : isIso(task.start) ? task.start : "";
    let byHours = "", hoursDue = null, lastHours = null;
    const hoursNow = points.length ? points.at(-1).hours : null;
    if (hourEvery > 0 && points.length) {
      if (last && typeof last.hours === "number") lastHours = last.hours;
      else if (last) lastHours = hoursAt(points, last.date);
      else if (typeof task.lastHours === "number" && Number.isFinite(task.lastHours)) lastHours = task.lastHours;
      else if (lastDate) lastHours = hoursAt(points, lastDate);
      // Never done and no hours known: the count starts at the first reading.
      if (lastHours === null) lastHours = points[0].hours;
      hoursDue = lastHours + hourEvery;
      byHours = dateAtHours(points, hoursDue);
    }
    const options = [calendar && { date: calendar, by: "date" }, byHours && { date: byHours, by: "hours" }].filter(Boolean).sort(byDate);
    const original = options[0]?.date || "";
    const by = options[0]?.by || (hourEvery > 0 ? "meter" : "");
    const post = mine.filter((e, i) => e.kind === "postponed" && isIso(e.until) && i > doneAt).at(-1) || null;
    return {
      due: post ? post.until : original, original, by, calendar, byHours, hoursDue, hoursNow, lastDate, lastHours,
      postponed: post ? { until: post.until, reason: post.reason || "", date: post.date } : null, rate: rateOf(points),
    };
  };
  // The history of a task: each time it was done, against the date it was due then, and the open occurrence now.
  const history = (task, events, points = meterPoints(events)) => {
    const mine = events.filter((e) => e.task === task.id && isIso(e.date)).sort(byDate);
    const grace = graceDays(task, rateOf(points));
    const done = [];
    mine.forEach((e, i) => {
      if (e.kind !== "done") return;
      const info = nextDue(task, mine.slice(0, i), points);
      const due = info.original;
      done.push({ id: e.id, due, done: e.date, onTime: !due || e.date <= addDays(due, grace), late: due ? Math.max(0, daysBetween(due, e.date)) : 0, postponed: Boolean(info.postponed) });
    });
    const open = nextDue(task, mine, points);
    return { done, open: { due: open.original, effective: open.due, postponed: open.postponed, by: open.by }, grace };
  };
  // PM compliance: of the tasks due in the period, the share done on time. A task still open past its tolerance counts
  // as due and not done; one still within its tolerance is not judged yet.
  const compliance = (histories, from, to, today) => {
    let scheduled = 0, onTime = 0;
    histories.forEach((h) => {
      h.done.forEach((o) => { if (o.due && o.due >= from && o.due <= to) { scheduled++; if (o.onTime) onTime++; } });
      const o = h.open;
      if (o.due && o.due >= from && o.due <= to && addDays(o.due, h.grace) < today) scheduled++;
    });
    return { scheduled, onTime, rate: scheduled ? onTime / scheduled : null };
  };
  const statusOf = (due, today) => (!isIso(due) ? "none" : due < today ? "overdue" : due <= weekEnd(today) ? "week" : "later");
  // The dates a task falls on up to a day, from its next due date on, for the calendar.
  const project = (task, info, until, limit = 400) => {
    const out = [];
    if (!isIso(info.due)) return out;
    const hourEvery = task.unit === "hours" ? Number(task.every) : Number(task.hours) || 0;
    const hourDays = hourEvery > 0 && info.rate > 0 ? Math.max(1, Math.ceil(hourEvery / info.rate)) : 0;
    let date = info.due;
    while (date <= until && out.length < limit) {
      out.push(date);
      const steps = [task.unit !== "hours" ? addInterval(date, task.every, task.unit) : "", hourDays ? addDays(date, hourDays) : ""].filter(Boolean).sort();
      if (!steps.length || steps[0] <= date) break;
      date = steps[0];
    }
    return out;
  };
  // Breakdowns per asset in a period: how many, the downtime, the cost; the mean time to repair (minutes of downtime per
  // breakdown) and the mean time between failures (operating hours when the meter tells, else days of the period, per
  // breakdown). With fewer than two breakdowns there is not enough to say.
  const reliability = (breakdowns, from, to, pointsOf = () => []) => {
    const groups = new Map();
    breakdowns.filter((b) => b.date >= from && b.date <= to).forEach((b) => {
      if (!groups.has(b.asset)) groups.set(b.asset, { asset: b.asset, n: 0, minutes: 0, cost: 0, causes: {} });
      const g = groups.get(b.asset);
      g.n++;
      g.minutes += Number(b.minutes) || 0;
      g.cost += Number(b.cost) || 0;
      g.causes[b.cause] = (g.causes[b.cause] || 0) + 1;
    });
    const days = daysBetween(from, to) + 1;
    return [...groups.values()].map((g) => {
      const points = pointsOf(g.asset);
      const start = hoursAt(points, from), end = hoursAt(points, to);
      const run = start !== null && end !== null && end > start ? end - start : null;
      const enough = g.n >= 2;
      const topCause = Object.entries(g.causes).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
      return { ...g, topCause, enough, mttr: enough ? g.minutes / g.n : null, mtbfDays: enough ? (days - g.minutes / 1440) / g.n : null, mtbfHours: enough && run !== null ? run / g.n : null };
    }).sort((a, b) => b.minutes - a.minutes || b.n - a.n || String(a.asset).localeCompare(String(b.asset)));
  };
  // The largest first, with each one's share and the running share; the vital few make up the first 80 %.
  const pareto = (items) => {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    let cum = 0;
    return [...items].sort((a, b) => b.value - a.value).map((item) => {
      const before = cum;
      cum += item.value;
      return { ...item, share: total ? item.value / total : 0, cum: total ? cum / total : 0, vital: total > 0 && before / total < 0.8 };
    });
  };
  // A calendar file of the due tasks: each one an all-day event, so a phone can remind whoever does it.
  const ics = (items, stamp = new Date()) => {
    const esc = (text) => String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    // Lines longer than 75 bytes are folded; 60 characters keep a line with umlauts inside the limit.
    const fold = (line) => { const parts = []; let rest = line; while (rest.length > 60) { parts.push(rest.slice(0, 60)); rest = ` ${rest.slice(60)}`; } parts.push(rest); return parts.join("\r\n"); };
    const dt = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stiven Catalyst//Maintenance Planner//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    items.filter((item) => isIso(item.date)).forEach((item) => {
      lines.push("BEGIN:VEVENT", `UID:${item.uid}@stivencatalyst.com`, `DTSTAMP:${dt}`, `DTSTART;VALUE=DATE:${item.date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${addDays(item.date, 1).replace(/-/g, "")}`, fold(`SUMMARY:${esc(item.summary)}`));
      if (item.description) lines.push(fold(`DESCRIPTION:${esc(item.description)}`));
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return `${lines.join("\r\n")}\r\n`;
  };

  // The example: a seeded walk through three months of a parcel hub, so every visitor sees the same numbers.
  const random = (seed) => {
    let s = seed >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const taskFrom = (template, taskId) => ({
    id: taskId, text: template.text, every: template.every, unit: template.unit, hours: template.hours || 0, who: template.who, minutes: template.minutes,
    statutory: template.statutory === true, checklist: [...(template.checklist || [])], last: "", lastHours: null, start: "",
  });
  const exampleData = (spec, types, end) => {
    const rand = random(spec.seed);
    const pick = (list) => list[Math.floor(rand() * list.length)];
    const start = addDays(end, -spec.days);
    const typeOf = Object.fromEntries(types.map((type) => [type.key, type]));
    const rows = [];
    let seq = 0;
    const rid = () => `ex-${seq++}`;
    const keyOf = new Map();
    const assets = spec.assets.map((a, i) => {
      const id = `ex-a${i}`;
      const tasks = typeOf[a.type].tasks.map((template, j) => ({ template, j })).filter(({ template }) => !template.optional).map(({ template, j }) => {
        const task = taskFrom(template, `${id}-t${j}`);
        keyOf.set(task, `${a.tag}|${j}`);
        return task;
      });
      return { id, tag: a.tag, name: a.name, type: a.type, area: spec.areas[a.area] || "", crit: a.crit, supplier: a.supplier || "", contact: a.contact || "", tasks };
    });
    const round5 = (value) => Math.max(5, Math.round(value / 5) * 5);
    // Weekly meter readings on Mondays, from two weeks before the history starts.
    assets.forEach((asset) => {
      const meter = spec.meters[asset.tag];
      if (meter === undefined) return;
      let hours = meter;
      for (let date = mondayOf(addDays(start, -14)); date <= end; date = addDays(date, 7)) {
        rows.push({ id: rid(), kind: "reading", asset: asset.id, date, hours: Math.round(hours), by: spec.people[0], note: "" });
        hours += spec.rates[asset.tag] * 7 * (0.85 + rand() * 0.3);
      }
    });
    const doneRow = (asset, task, date) => ({
      id: rid(), kind: "done", asset: asset.id, task: task.id, date, by: task.who === "external" ? asset.supplier || pick(spec.people) : pick(spec.people),
      minutes: round5(task.minutes * (0.8 + rand() * 0.5)), parts: task.who === "external" ? Math.round(40 + rand() * spec.parts) : rand() < 0.15 ? Math.round(10 + rand() * 30) : 0,
      hours: null, note: "", checked: task.checklist.map((_, i) => i),
    });
    assets.forEach((asset) => asset.tasks.forEach((task) => {
      const key = keyOf.get(task);
      const post = spec.postponed.find((p) => p.task === key);
      const fixed = spec.overdue[key] ?? (post ? post.due : null);
      if (fixed !== null && fixed !== undefined && task.unit !== "hours" && !task.hours) {
        // A task left undone: its open date lies `fixed` days back, and the occurrences before it were done on their day.
        const open = addDays(end, -fixed);
        const chain = [];
        let k = 1, date = addInterval(open, -task.every, task.unit);
        while (date >= start && k < 500) { chain.push(date); k++; date = addInterval(open, -k * task.every, task.unit); }
        task.last = date;
        chain.reverse().forEach((day) => rows.push(doneRow(asset, task, day)));
        if (post) rows.push({ id: rid(), kind: "postponed", asset: asset.id, task: task.id, date: addDays(open, -1), until: addDays(end, post.days), reason: spec.reasons[post.reason] || "", by: spec.people[0], note: "" });
        return;
      }
      // Every other task: done when due, a little early or sometimes late, until the next date is today or later.
      const own = () => rows.filter((row) => row.asset === asset.id);
      const span = Math.max(1, Math.round(intervalDays(task) ?? 30));
      task.last = addDays(start, -Math.floor(rand() * span));
      let previous = "";
      for (let guard = 0; guard < 400; guard++) {
        const info = nextDue(task, own());
        if (!info.original || info.original >= end) break;
        const shift = rand() < spec.late ? 2 + Math.floor(rand() * 6) : -Math.floor(rand() * 2);
        let date = addDays(info.original, shift);
        if (previous && date <= previous) date = addDays(previous, 1);
        if (date > end) date = end;
        rows.push(doneRow(asset, task, date));
        previous = date;
      }
    }));
    spec.breakdowns.forEach(([ago, tag, minutes, cause, cost, note]) => {
      const asset = assets.find((a) => a.tag === tag);
      if (asset) rows.push({ id: rid(), kind: "breakdown", asset: asset.id, date: addDays(end, -ago), minutes, cause, cost, by: spec.people[ago % spec.people.length], note: spec.notes[note] || "" });
    });
    return { site: spec.site, assets, rows: rows.sort(byDate) };
  };

  // From OEE: the stops of its log that are breakdowns, as the OEE tool counts them (the loss of the reason in its list; a
  // reason nobody listed counts as a breakdown). OEE rows have no ids, so each stop gets a stable key: the date, the
  // machine, the shift, the reason and the minutes, and how often the same stop came before it (two identical lines of
  // one shift stay two). The key does not depend on a row's position, so adding or removing other rows in OEE leaves it
  // as it was.
  const lowered = (text) => String(text ?? "").trim().toLowerCase();
  const oeeBreakdowns = (saved, reasons = []) => {
    const lossOf = (reason) => reasons.find((r) => lowered(r.name) === lowered(reason))?.loss || "breakdowns";
    const seen = new Map();
    const out = [];
    (Array.isArray(saved?.rows) ? saved.rows : []).forEach((row) => {
      if (!row || typeof row !== "object" || !isIso(row.date) || !lowered(row.equipment) || !Array.isArray(row.stops)) return;
      row.stops.forEach((stop) => {
        const minutes = Math.round(Number(stop?.minutes) * 10) / 10;
        if (!(minutes > 0) || lossOf(stop.reason) !== "breakdowns") return;
        const base = [row.date, lowered(row.equipment), lowered(row.shift), lowered(stop.reason), minutes].join("|");
        const n = seen.get(base) || 0;
        seen.set(base, n + 1);
        out.push({ key: `oee|${base}|${n}`, date: row.date, shift: String(row.shift ?? "").trim(), machine: String(row.equipment).trim(), reason: String(stop.reason ?? "").trim(), minutes });
      });
    });
    return out.sort((a, b) => b.date.localeCompare(a.date));
  };
  // An OEE machine onto an asset of the plan: the same tag, else the same name, in any case.
  const matchAsset = (name, assets) => {
    const wanted = lowered(name);
    if (!wanted) return null;
    return assets.find((a) => lowered(a.tag) === wanted) || assets.find((a) => lowered(a.name) === wanted) || null;
  };
  // An OEE reason onto a cause of the planner: the same name or key in any case, else "other" (the reason stays in the note).
  const causeFor = (reason, causes) => causes.find((c) => lowered(c.name) === lowered(reason) || c.key === lowered(reason))?.key || "other";

  window.MaintenancePlannerMath = { UNITS, KINDS, WHO, CRITS, isIso, addDays, daysBetween, mondayOf, weekEnd, monthEnd, addInterval, intervalDays, graceDays, meterPoints, rateOf, hoursAt, dateAtHours, nextDue, history, compliance, statusOf, project, reliability, pareto, ics, random, taskFrom, exampleData, oeeBreakdowns, matchAsset, causeFor };

  const dataEl = document.getElementById("maintenance-planner-data");
  const root = document.querySelector("[data-maintenance-planner]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, int, euro, pct, num, showDate, monthYear, read, write, loadState, isObject, str, el, today, parseDate, parseNumber, flash, undoNote, panel, stat, focusCard, resultActions, resultLayout, exampleNote, exampleStamp, exampleMatches, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const Workplace = window.Workplace || null;
  const Capture = window.FloorCapture;
  const media = window.MediaStore;
  const photos = Boolean(Capture && media && media.supported());
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = "maintenance-planner";
  const SITES = cfg.sites.map((site) => site.key);
  const TYPES = cfg.types.map((type) => type.key);
  const typeOf = (key) => cfg.types.find((type) => type.key === key) || cfg.types.find((type) => type.key === "other") || cfg.types[0];
  const CAUSES = cfg.causes.map((cause) => cause.key);
  const causeName = (key) => cfg.causes.find((cause) => cause.key === key)?.name || key;
  const id = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const amount = (value) => { const n = typeof value === "number" ? value : parseNumber(value); return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0; };
  const hoursValue = (value) => { const n = typeof value === "number" ? value : parseNumber(value); return Number.isFinite(n) && n >= 0 ? Math.round(n * 10) / 10 : null; };

  // State: the site kind, the assets with their tasks, the log (done, postponed, breakdown, reading), what was already
  // sent to the Action Tracker, the OEE stops already taken over or ignored (by their key), and the example's stamp.
  const state = loadState(KEY, { site: cfg.example.site, assets: [], rows: [], sent: {}, oee: {}, show: "all", example: {} });
  if (!SITES.includes(state.site)) state.site = SITES[0];
  if (!["all", "due", "overdue", "statutory"].includes(state.show)) state.show = "all";
  const cleanTask = (raw) => {
    if (!isObject(raw) || !str(raw.text).trim()) return null;
    const every = Math.round(Number(raw.every));
    return {
      id: str(raw.id) || id("t"), text: str(raw.text).trim().slice(0, 200), every: every >= 1 && every <= 100000 ? every : 1, unit: UNITS.includes(raw.unit) ? raw.unit : "months",
      hours: Math.max(0, Math.round(Number(raw.hours) || 0)), who: WHO.includes(raw.who) ? raw.who : "internal", minutes: Math.max(0, Math.round(Number(raw.minutes) || 0)),
      statutory: raw.statutory === true, checklist: (Array.isArray(raw.checklist) ? raw.checklist : []).map(str).map((s) => s.trim().slice(0, 160)).filter(Boolean).slice(0, 20),
      last: parseDate(raw.last) || "", lastHours: typeof raw.lastHours === "number" && Number.isFinite(raw.lastHours) && raw.lastHours >= 0 ? raw.lastHours : null, start: parseDate(raw.start) || "",
    };
  };
  const cleanAsset = (raw) => {
    if (!isObject(raw) || !str(raw.tag).trim()) return null;
    return {
      id: str(raw.id) || id("a"), tag: str(raw.tag).trim().slice(0, 40), name: str(raw.name).trim().slice(0, 120), type: TYPES.includes(raw.type) ? raw.type : "other",
      area: str(raw.area).trim().slice(0, 80), crit: CRITS.includes(raw.crit) ? raw.crit : "B", supplier: str(raw.supplier).trim().slice(0, 120), contact: str(raw.contact).trim().slice(0, 120),
      tasks: (Array.isArray(raw.tasks) ? raw.tasks : []).map(cleanTask).filter(Boolean).slice(0, 60),
    };
  };
  const cleanRow = (raw) => {
    if (!isObject(raw) || !KINDS.includes(raw.kind) || !parseDate(raw.date) || !str(raw.asset)) return null;
    const row = { id: str(raw.id) || id("r"), kind: raw.kind, asset: str(raw.asset), date: parseDate(raw.date), by: str(raw.by).trim().slice(0, 80), note: str(raw.note).trim().slice(0, 500) };
    if (raw.kind === "done") return { ...row, task: str(raw.task), minutes: Math.round(amount(raw.minutes)), parts: amount(raw.parts), hours: hoursValue(raw.hours), checked: (Array.isArray(raw.checked) ? raw.checked : []).filter((i) => Number.isInteger(i) && i >= 0 && i < 20) };
    if (raw.kind === "postponed") return parseDate(raw.until) ? { ...row, task: str(raw.task), until: parseDate(raw.until), reason: str(raw.reason).trim().slice(0, 300) } : null;
    if (raw.kind === "breakdown") return { ...row, minutes: Math.round(amount(raw.minutes)), cause: CAUSES.includes(raw.cause) ? raw.cause : "other", cost: amount(raw.cost) };
    const hours = hoursValue(raw.hours);
    return hours === null ? null : { ...row, hours };
  };
  state.assets = state.assets.map(cleanAsset).filter(Boolean);
  state.rows = state.rows.map(cleanRow).filter(Boolean).sort(byDate);
  state.sent = Object.fromEntries(Object.entries(state.sent).filter(([, value]) => value === true));
  state.oee = Object.fromEntries(Object.entries(state.oee).filter(([key, value]) => key.startsWith("oee|") && (value === "taken" || value === "ignored")));
  const save = () => write(KEY, state);
  // The OEE log of the same language and its stop reasons, which say which stops are breakdowns.
  const oeeCfg = (() => { try { return JSON.parse(document.getElementById("maintenance-planner-oee")?.textContent || "{}") || {}; } catch { return {}; } })();
  const OEE_KEY = typeof oeeCfg.key === "string" && oeeCfg.key.startsWith("sc-oee") ? oeeCfg.key : `sc-oee${KEY.slice("sc-maintenance-planner".length)}`;
  const oeeReasons = Array.isArray(oeeCfg.reasons) ? oeeCfg.reasons : [];

  const assetById = (assetId) => state.assets.find((a) => a.id === assetId) || null;
  const fold = (text) => String(text).trim().toLowerCase();
  const assetByTag = (text) => {
    const wanted = fold(String(text).split(" · ")[0]);
    return wanted ? state.assets.find((a) => fold(a.tag) === wanted) || state.assets.find((a) => fold(a.name) === fold(text)) || null : null;
  };
  const taskById = (asset, taskId) => asset?.tasks.find((t) => t.id === taskId) || null;
  const eventsOf = (assetId) => state.rows.filter((row) => row.asset === assetId);
  const assetLabel = (asset) => (asset ? `${asset.tag} · ${asset.name || typeOf(asset.type).name}` : "–");
  const areaList = () => {
    const site = cfg.sites.find((s) => s.key === state.site) || cfg.sites[0];
    const profile = Workplace ? Workplace.areas().map((a) => a.name) : [];
    return [...new Set([...profile, ...state.assets.map((a) => a.area).filter(Boolean), ...site.areas])];
  };

  // Texts.
  const everyText = (every, unit) => {
    const n = int.format(Number(every) || 1);
    const one = Number(every) === 1;
    if (unit === "days") return one ? tx("every day") : tx("every {n} days", { n });
    if (unit === "weeks") return one ? tx("every week") : tx("every {n} weeks", { n });
    if (unit === "months") return one ? tx("every month") : tx("every {n} months", { n });
    if (unit === "years") return one ? tx("every year") : tx("every {n} years", { n });
    return tx("every {n} operating hours", { n });
  };
  const intervalText = (task) => (task.unit !== "hours" && task.hours > 0 ? tx("{every} or {n} operating hours", { every: everyText(task.every, task.unit), n: int.format(task.hours) }) : everyText(task.every, task.unit));
  const whoText = (who) => (who === "external" ? tx("External") : tx("Internal"));
  const kindText = { done: () => tx("Done"), postponed: () => tx("Postponed"), breakdown: () => tx("Breakdown"), reading: () => tx("Meter reading") };
  const unitName = { days: () => tx("days"), weeks: () => tx("weeks"), months: () => tx("months"), years: () => tx("years"), hours: () => tx("operating hours") };
  const minutesText = (m) => tx("{n} min", { n: int.format(Math.round(m)) });
  const hoursText = (h) => tx("{n} h", { n: num(h, h >= 100 ? 0 : 1) });
  const overdueText = (days) => (days === 1 ? tx("1 day overdue") : tx("{n} days overdue", { n: int.format(days) }));

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const setupBox = q("[data-setup]");
  const setupCount = q("[data-setup-count]");
  const assetForm = { site: q("#mp-site"), type: q("#mp-type"), tag: q("#mp-tag"), name: q("#mp-name"), area: q("#mp-area"), crit: q("#mp-crit"), supplier: q("#mp-supplier"), contact: q("#mp-contact") };
  const typeTasks = q("[data-type-tasks]");
  const addAssetButton = q("[data-add-asset]");
  const cancelEdit = q("[data-cancel-edit]");
  const assetStatus = q("[data-asset-status]");
  const taskForm = { asset: q("#mp-task-asset"), text: q("#mp-task-text"), every: q("#mp-task-every"), unit: q("#mp-task-unit"), hours: q("#mp-task-hours"), who: q("#mp-task-who"), minutes: q("#mp-task-minutes"), last: q("#mp-task-last"), statutory: q("#mp-task-statutory"), checklist: q("#mp-task-checklist") };
  const taskStatus = q("[data-task-status]");
  const assetsBody = q("[data-assets]");
  const assetsWrap = q("[data-assets-wrap]");
  const planBody = q("[data-plan]");
  const planWrap = q("[data-plan-wrap]");
  const planEmpty = q("[data-plan-empty]");
  const planCount = q("[data-plan-count]");
  const planStatus = q("[data-plan-status]");
  const showSelect = q("#mp-show");
  const logBox = q("[data-log-form]");
  const logForm = { asset: q("#mp-log-asset"), task: q("#mp-log-task"), date: q("#mp-log-date"), by: q("#mp-log-by"), minutes: q("#mp-log-minutes"), parts: q("#mp-log-parts"), until: q("#mp-log-until"), reason: q("#mp-log-reason"), downtime: q("#mp-log-downtime"), cause: q("#mp-log-cause"), cost: q("#mp-log-cost"), hours: q("#mp-log-hours"), note: q("#mp-log-note") };
  const logAssetNote = q("[data-log-asset-note]");
  const checklistBox = q("[data-log-checklist]");
  const photoBox = q("[data-log-photo]");
  const logStatus = q("[data-log-status]");
  const logBody = q("[data-log]");
  const logWrap = q("[data-log-wrap]");
  const logEmpty = q("[data-log-empty]");
  const logCount = q("[data-log-count]");
  const historyStatus = q("[data-history-status]");
  const oeeBox = q("[data-oee-box]");
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const fiveWhysUrl = () => new URL(document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href));
  const fill = (select, options, current) => {
    select.replaceChildren(...options.map(([value, text]) => { const o = el("option", null, text); o.value = value; return o; }));
    if (options.some(([value]) => value === current)) select.value = current;
  };

  // The analysis: every task with its next date, its history and its status; the breakdowns and the reliability.
  const analysis = () => {
    const now = today();
    const tasks = [];
    state.assets.forEach((asset) => {
      const events = eventsOf(asset.id);
      const points = meterPoints(events);
      asset.tasks.forEach((task) => {
        const info = nextDue(task, events, points);
        const hist = history(task, events, points);
        tasks.push({ asset, task, info, hist, status: statusOf(info.due, now), late: isIso(info.due) && info.due < now ? daysBetween(info.due, now) : 0 });
      });
    });
    const order = { overdue: 0, week: 1, later: 2, none: 3 };
    tasks.sort((a, b) => order[a.status] - order[b.status] || String(a.info.due).localeCompare(String(b.info.due)) || a.asset.tag.localeCompare(b.asset.tag, undefined, { numeric: true }));
    const monthStart = `${now.slice(0, 7)}-01`;
    const from90 = addDays(now, -90);
    const rows = state.rows.filter((row) => assetById(row.asset));
    const doneMonth = tasks.flatMap((t) => t.hist.done.filter((o) => o.done >= monthStart && o.done <= now));
    const breakdowns = rows.filter((row) => row.kind === "breakdown");
    const monthBreakdowns = breakdowns.filter((b) => b.date >= monthStart && b.date <= now);
    const pointsOf = (assetId) => meterPoints(eventsOf(assetId));
    const reliable = reliability(breakdowns, from90, now, pointsOf);
    const groupRate = (keyOf) => {
      const groups = new Map();
      tasks.forEach((t) => { const key = keyOf(t); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(t.hist); });
      return [...groups].map(([key, list]) => ({ key, ...compliance(list, from90, now, now) })).filter((g) => g.scheduled > 0).sort((a, b) => a.key.localeCompare(b.key));
    };
    const overdue = tasks.filter((t) => t.status === "overdue");
    const week = tasks.filter((t) => t.status === "week");
    return {
      now, tasks, rows, monthStart, from90, overdue, week,
      overdueA: overdue.filter((t) => t.asset.crit === "A"),
      weekMinutes: week.reduce((sum, t) => sum + t.task.minutes, 0),
      doneMonth, doneOnTime: doneMonth.filter((o) => o.onTime).length,
      total: compliance(tasks.map((t) => t.hist), from90, now, now),
      byArea: groupRate((t) => t.asset.area || tx("No area")),
      byType: groupRate((t) => typeOf(t.asset.type).name),
      breakdowns, monthBreakdowns, monthDowntime: monthBreakdowns.reduce((sum, b) => sum + b.minutes, 0),
      reliable,
      repeated: reliable.filter((g) => g.n >= 3 && assetById(g.asset)),
    };
  };

  // Hand-offs to the Action Tracker: overdue tasks on A assets and assets that broke down three times or more in 90 days.
  const overdueAction = (t) => ({
    title: tx("Overdue: {task} · {asset}", { task: t.task.text, asset: assetLabel(t.asset) }),
    detail: [tx("Due {date}", { date: showDate(t.info.due) }), overdueText(t.late), t.task.statutory ? tx("Statutory check") : "", t.asset.supplier ? `${t.asset.supplier}${t.asset.contact ? ` (${t.asset.contact})` : ""}` : "", cfg.text.tool].filter(Boolean).join(" · "),
    owner: t.task.who === "external" ? t.asset.supplier || cfg.text.maintenanceOwner : cfg.text.maintenanceOwner,
    due: addDays(today(), t.task.statutory ? 2 : 5), example: exampleMatches(state), source: TOOL, check: cfg.text.checkOverdue, area: t.asset.area, priority: "High",
  });
  const repeatedAction = (g) => {
    const asset = assetById(g.asset);
    return {
      title: tx("Repeated breakdowns: {asset}", { asset: assetLabel(asset) }),
      detail: [tx("{n} breakdowns in 90 days, {minutes} of downtime", { n: int.format(g.n), minutes: minutesText(g.minutes) }), tx("Most often: {cause}", { cause: causeName(g.topCause) }), cfg.text.tool].join(" · "),
      owner: cfg.text.maintenanceOwner, due: addDays(today(), 7), example: exampleMatches(state), source: TOOL, check: cfg.text.checkRepeated, area: asset?.area || "", priority: asset?.crit === "A" ? "High" : "Medium",
    };
  };
  const sentKey = { overdue: (t) => `due|${t.task.id}|${t.info.due}`, repeated: (g) => `bd|${g.asset}|${g.n}` };
  const unsent = (r) => [
    ...r.overdueA.filter((t) => !state.sent[sentKey.overdue(t)]).map((t) => ({ key: sentKey.overdue(t), action: overdueAction(t) })),
    ...r.repeated.filter((g) => !state.sent[sentKey.repeated(g)]).map((g) => ({ key: sentKey.repeated(g), action: repeatedAction(g) })),
  ];
  const trackerNote = (node, message) => {
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    node.replaceChildren(`${message} `, link);
    clearTimeout(node.timer);
    node.timer = setTimeout(() => { node.textContent = ""; }, 8000);
  };

  // Printing: the work list of the week (A4, by area, with boxes to tick); the rest of the page is hidden meanwhile.
  const printOnly = (build) => {
    printBox.replaceChildren(...build());
    printBox.hidden = false;
    document.documentElement.classList.add("mp-printing");
    const done = () => {
      document.documentElement.classList.remove("mp-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  const workList = (r) => {
    const items = [...r.overdue, ...r.week];
    const groups = new Map();
    items.forEach((t) => { const key = t.asset.area || tx("No area"); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(t); });
    return [...groups].sort((a, b) => a[0].localeCompare(b[0]));
  };
  const dueLabel = (t) => (t.status === "overdue" ? `${showDate(t.info.due)} · ${overdueText(t.late)}` : showDate(t.info.due));
  const workSheet = (r) => {
    const head = el("div", "mp-print-head");
    const site = Workplace?.get().site || "";
    head.append(el("p", "kicker", [cfg.text.tool, site].filter(Boolean).join(" · ")), el("h2", null, tx("Work list · week of {date}", { date: showDate(mondayOf(r.now)) })));
    head.append(el("p", "mp-print-meta", [tx("{n} tasks", { n: int.format(r.overdue.length + r.week.length) }), tx("{n} overdue", { n: int.format(r.overdue.length) }), tx("about {t} planned", { t: minutesText(r.weekMinutes + r.overdue.reduce((s, t) => s + t.task.minutes, 0)) })].join(" · ")));
    const out = [head];
    workList(r).forEach(([area, list]) => {
      out.push(el("h3", null, area));
      const table = el("table", "mp-print-table");
      const thead = el("thead");
      const htr = el("tr");
      ["", tx("Asset"), tx("Task"), tx("Who"), tx("Minutes"), tx("Due"), tx("Done by, date, note")].forEach((text) => { const th = el("th", null, text); th.scope = "col"; htr.append(th); });
      thead.append(htr);
      const tbody = el("tbody");
      list.forEach((t) => {
        const tr = el("tr");
        const task = el("td");
        task.append(el("strong", null, t.task.text));
        if (t.task.statutory) task.append(el("span", "mp-print-flag", ` · § ${tx("statutory")}`));
        if (t.task.checklist.length) {
          const ul = el("ul", "mp-print-check");
          t.task.checklist.forEach((item) => ul.append(el("li", null, `☐ ${item}`)));
          task.append(ul);
        }
        tr.append(el("td", "mp-box", "☐"), el("td", null, assetLabel(t.asset)), task, el("td", null, t.task.who === "external" ? t.asset.supplier || whoText("external") : whoText("internal")), el("td", "num", int.format(t.task.minutes)), el("td", null, dueLabel(t)), el("td", "mp-print-note", ""));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      out.push(table);
    });
    if (out.length === 1) out.push(el("p", null, tx("Nothing is due this week.")));
    out.push(el("p", "mp-print-foot", cfg.text.statutory));
    out.push(el("p", "mp-print-sign", `${tx("Signature")}: ____________________`));
    return out;
  };

  // Results.
  let exampleUi = null;
  let calendarMonth = "";
  const summaryText = (r) => {
    const lines = [`${cfg.text.tool} · ${showDate(r.now)}`, ""];
    lines.push(`${tx("PM compliance")}: ${r.total.rate === null ? "–" : pct(r.total.rate, 0)} (${tx("{a} of {b} on time, last 90 days", { a: int.format(r.total.onTime), b: int.format(r.total.scheduled) })})`);
    lines.push(`${tx("Overdue")}: ${int.format(r.overdue.length)} (${tx("{n} on A assets", { n: int.format(r.overdueA.length) })}) · ${tx("Due this week")}: ${int.format(r.week.length)}`);
    lines.push(`${tx("Done this month")}: ${int.format(r.doneMonth.length)} (${r.doneMonth.length ? pct(r.doneOnTime / r.doneMonth.length, 0) : "–"} ${tx("on time")})`);
    lines.push(`${tx("Breakdowns this month")}: ${int.format(r.monthBreakdowns.length)} · ${minutesText(r.monthDowntime)}`);
    if (r.overdue.length) {
      lines.push("", `${tx("Overdue")}:`);
      r.overdue.forEach((t) => lines.push(`- ${assetLabel(t.asset)}: ${t.task.text} · ${dueLabel(t)}${t.task.statutory ? ` · § ${tx("statutory")}` : ""}`));
    }
    if (r.reliable.length) {
      lines.push("", `${tx("Breakdowns by asset, last 90 days")}:`);
      r.reliable.forEach((g) => lines.push(`- ${assetLabel(assetById(g.asset))}: ${int.format(g.n)} × · ${minutesText(g.minutes)}${g.mttr !== null ? ` · MTTR ${minutesText(g.mttr)}` : ""}`));
    }
    return lines.join("\n");
  };
  // The breakdown causes for Pareto 80/20, one row per breakdown, in the columns of its maintenance template.
  const paretoTable = (r) => () => ({
    source: cfg.text.tool,
    template: "maintenance",
    headers: [tx("Date"), tx("Area"), tx("Asset"), tx("Cause"), tx("Count"), tx("Downtime minutes"), tx("Note")],
    rows: r.breakdowns.map((b) => { const asset = assetById(b.asset); return [b.date, asset?.area || "", assetLabel(asset), causeName(b.cause), "1", String(b.minutes), b.note]; }),
    map: { category: 3, count: 4, value: 5, date: 0, filter: 1 },
    measure: "value",
    valueLabel: tx("Downtime minutes"),
  });
  const calendarPanel = (r) => {
    const month = calendarMonth || r.now.slice(0, 7);
    const first = `${month}-01`, last = monthEnd(first);
    const days = {};
    const add = (date, kind, text) => { if (date < first || date > last) return; (days[date] ||= { overdue: [], due: [], done: [] })[kind].push(text); };
    r.tasks.forEach((t) => {
      const name = `${t.asset.tag} · ${t.task.text}`;
      t.hist.done.forEach((o) => add(o.done, "done", name));
      if (t.status === "overdue") add(t.info.due, "overdue", name);
      project(t.task, t.info, last).forEach((date, i) => { if (date >= r.now && (i > 0 || t.status !== "overdue")) add(date, "due", name); });
    });
    const p = panel(tx("Calendar"), tx("Red: overdue on its due day. Amber: due. Green: done. The number is how many tasks; point at a day for the list."));
    p.classList.add("mp-panel-calendar");
    const nav = el("div", "mp-cal-nav");
    const move = (step) => { const [y, m] = month.split("-").map(Number); const d = new Date(Date.UTC(y, m - 1 + step, 1)); calendarMonth = d.toISOString().slice(0, 7); renderResults(); results.querySelector("[data-cal-title]")?.focus(); };
    const prev = el("button", "button-ghost", `‹ ${tx("Previous month")}`);
    prev.type = "button";
    prev.addEventListener("click", () => move(-1));
    const title = el("strong", "mp-cal-title", monthYear(new Date(`${first}T00:00:00Z`)));
    title.tabIndex = -1;
    title.dataset.calTitle = "";
    const next = el("button", "button-ghost", `${tx("Next month")} ›`);
    next.type = "button";
    next.addEventListener("click", () => move(1));
    nav.append(prev, title, next);
    const [y, m] = month.split("-").map(Number);
    const svg = ChartKit.calendar(y, m, (iso) => {
      const day = days[iso];
      if (!day) return null;
      const state = day.overdue.length ? "danger" : day.due.length ? "warn" : day.done.length ? "ok" : "none";
      const lines = [showDate(iso), ...day.overdue.map((t) => `✗ ${t}`), ...day.due.map((t) => `○ ${t}`), ...day.done.map((t) => `✓ ${t}`)];
      return { state, text: String(day.overdue.length + day.due.length || day.done.length), tip: lines.slice(0, 12).join("\n") + (lines.length > 12 ? "\n…" : "") };
    }, { title: tx("Maintenance calendar {month}", { month: monthYear(new Date(`${first}T00:00:00Z`)) }) });
    p.append(nav, ChartKit.figure(svg, { fileName: `maintenance-calendar-${month}` }), ChartKit.legend([{ label: tx("Overdue"), state: "danger" }, { label: tx("Due"), state: "warn" }, { label: tx("Done"), state: "ok" }]));
    return p;
  };
  const rateBars = (groups, title, fileName) => ChartKit.figure(ChartKit.bars(groups.map((g) => ({
    label: g.key, value: g.rate, tip: `${g.key}: ${pct(g.rate, 0)} · ${tx("{a} of {b} on time", { a: int.format(g.onTime), b: int.format(g.scheduled) })}`,
  })), { title, yMax: 1, format: (v) => pct(v, 0), target: cfg.target, highlight: (item) => item.value < cfg.target - 1e-9 }), { fileName });
  const renderResults = () => {
    results.replaceChildren();
    if (exampleUi) exampleUi.sync(state);
    if (!state.assets.length) { results.hidden = true; return; }
    results.hidden = false;
    const r = analysis();
    const head = el("div", "result-head mp-head");
    head.append(el("p", "kicker", `${tx("Maintenance plan")} · ${showDate(r.now)}`));
    const h2 = el("h2");
    h2.append(r.total.rate === null ? "–" : pct(r.total.rate, 0), el("span", null, ` · ${tx("PM compliance, last 90 days")}`));
    head.append(h2, el("p", "mp-meta", [tx("{n} assets", { n: int.format(state.assets.length) }), tx("{n} tasks", { n: int.format(r.tasks.length) }), tx("target {p}", { p: pct(cfg.target, 0) })].join(" · ")));

    const stats = el("div", "dl-stats mp-stats");
    stats.append(stat(tx("Due this week"), int.format(r.week.length), tx("about {t} planned", { t: minutesText(r.weekMinutes) })));
    stats.append(stat(tx("Overdue"), int.format(r.overdue.length), tx("{n} on A assets", { n: int.format(r.overdueA.length) })));
    stats.append(stat(tx("Done this month"), int.format(r.doneMonth.length), r.doneMonth.length ? tx("{p} on time", { p: pct(r.doneOnTime / r.doneMonth.length, 0) }) : tx("nothing logged yet")));
    stats.append(stat(tx("PM compliance"), r.total.rate === null ? "–" : pct(r.total.rate, 0), tx("{a} of {b} on time, last 90 days", { a: int.format(r.total.onTime), b: int.format(r.total.scheduled) })));
    stats.append(stat(tx("Breakdowns this month"), int.format(r.monthBreakdowns.length), tx("{t} of downtime", { t: minutesText(r.monthDowntime) })));

    // Start here: the critical asset that breaks down most, else the oldest overdue task on a critical asset.
    const worst = r.reliable.find((g) => g.n >= 2 && assetById(g.asset)?.crit === "A");
    const oldest = [...r.overdueA].sort((a, b) => b.late - a.late)[0] || null;
    let focus;
    let problem = cfg.text.tool;
    let focusAction = null;
    if (worst) {
      const asset = assetById(worst.asset);
      const lastBreakdown = r.breakdowns.filter((b) => b.asset === worst.asset).at(-1);
      problem = tx("{asset}: {n} breakdowns in 90 days, {minutes} of downtime, most often {cause}", { asset: assetLabel(asset), n: int.format(worst.n), minutes: minutesText(worst.minutes), cause: causeName(worst.topCause) });
      focus = focusCard({
        title: assetLabel(asset), detail: tx("{n} breakdowns", { n: int.format(worst.n) }),
        lede: tx("The critical asset that stops most: {minutes} of downtime in 90 days, most often {cause}. Last time: {date}{note}.", { minutes: minutesText(worst.minutes), cause: causeName(worst.topCause), date: showDate(lastBreakdown.date), note: lastBreakdown.note ? `, ${lastBreakdown.note}` : "" }),
        advice: cfg.advice.breakdown,
        extraLabel: oldest ? tx("Also overdue") : undefined, extra: oldest ? `${assetLabel(oldest.asset)}: ${oldest.task.text} · ${overdueText(oldest.late)}` : undefined,
      });
      focusAction = repeatedAction(worst);
    } else if (oldest) {
      problem = tx("{task} on {asset} is {days}", { task: oldest.task.text, asset: assetLabel(oldest.asset), days: overdueText(oldest.late) });
      focus = focusCard({
        title: `${assetLabel(oldest.asset)}: ${oldest.task.text}`, detail: overdueText(oldest.late),
        lede: tx("The oldest overdue task on a critical asset, due {date}.", { date: showDate(oldest.info.due) }),
        advice: cfg.advice.overdue, warning: oldest.task.statutory ? cfg.text.statutory : undefined,
      });
      focusAction = overdueAction(oldest);
    } else {
      focus = focusCard({ title: tx("Nothing critical is overdue"), lede: tx("No task on an A asset is past its date, and no A asset broke down twice in 90 days."), advice: cfg.advice.none });
    }
    const actions = resultActions(() => summaryText(r), problem, r.breakdowns.length ? paretoTable(r) : null);
    const pending = Actions ? unsent(r) : [];
    if (pending.length) {
      const send = el("button", "button-secondary", tx("Send {n} to actions", { n: int.format(pending.length) }));
      send.type = "button";
      send.title = tx("Overdue tasks on A assets and repeated breakdowns");
      send.addEventListener("click", () => {
        let n = 0;
        // Marked as sent only when the action is on the list (added now, or already open there).
        unsent(analysis()).forEach(({ key, action }) => { const added = Actions.add(action); if (added) n++; if (added || Actions.lastAdd === "duplicate") state.sent[key] = true; });
        save();
        renderResults();
        trackerNote(planStatus, tx("Added {n} actions.", { n: int.format(n) }));
      });
      actions.append(send);
    }
    if (Actions && focusAction) actions.append(Actions.linkButton(tx("Add to actions"), () => focusAction));
    const print = el("button", "button-secondary", tx("Print the work list"));
    print.type = "button";
    print.addEventListener("click", () => printOnly(() => workSheet(analysis())));
    const oee = el("a", "button-ghost", tx("Downtime in OEE"));
    oee.href = new URL("../oee/", window.location.href).href;
    actions.append(print, oee);

    const panels = [];
    // The work list of this week, by area, as it prints.
    const listPanel = panel(tx("Work list for this week"), r.overdue.length + r.week.length ? tx("Overdue first, then what is due until Sunday, by area. Print it for the Monday meeting and tick it off on the floor.") : tx("Nothing is due this week."));
    listPanel.classList.add("mp-panel-list");
    workList(r).forEach(([area, list]) => {
      listPanel.append(el("p", "mp-list-area", area));
      const ul = el("ul", "mp-worklist");
      list.forEach((t) => {
        const li = el("li", t.status === "overdue" ? "is-overdue" : "");
        li.append(el("span", "mp-box", "☐"));
        const body = el("span", "mp-work-body");
        body.append(el("strong", null, t.task.text), el("span", "mp-work-meta", [assetLabel(t.asset), t.task.who === "external" ? t.asset.supplier || whoText("external") : whoText("internal"), minutesText(t.task.minutes), t.status === "overdue" ? `✗ ${overdueText(t.late)}` : showDate(t.info.due), t.task.statutory ? `§ ${tx("statutory")}` : ""].filter(Boolean).join(" · ")));
        li.append(body);
        ul.append(li);
      });
      listPanel.append(ul);
    });
    panels.push(listPanel);
    if (ChartKit) {
      panels.push(calendarPanel(r));
      if (r.byArea.length) {
        const p = panel(tx("PM compliance by area"), tx("Tasks due in the last 90 days done on time. A bar below the line ({p}) asks for slots, people or a supplier date.", { p: pct(cfg.target, 0) }));
        p.append(rateBars(r.byArea, tx("PM compliance by area"), "maintenance-compliance-areas"));
        panels.push(p);
      }
      if (r.byType.length > 1) {
        const p = panel(tx("PM compliance by asset type"), tx("The same tasks by the kind of equipment: a low type often lacks a supplier date or a person who owns it."));
        p.append(rateBars(r.byType, tx("PM compliance by asset type"), "maintenance-compliance-types"));
        panels.push(p);
      }
      if (r.reliable.length) {
        const items = pareto(r.reliable.map((g) => ({ g, value: g.minutes })));
        const p = panel(tx("Breakdowns by asset"), tx("Downtime of the last 90 days, largest first. The marked assets make up 80 % of the downtime."));
        p.classList.add("mp-panel-pareto");
        p.append(ChartKit.figure(ChartKit.bars(items.map((item) => ({
          label: assetById(item.g.asset)?.tag || "–", value: item.value,
          tip: `${assetLabel(assetById(item.g.asset))}: ${tx("{n} breakdowns", { n: int.format(item.g.n) })} · ${minutesText(item.value)} · ${pct(item.share, 0)} · ${tx("cumulative")} ${pct(item.cum, 0)}${item.g.cost ? ` · ${euro.format(item.g.cost)}` : ""}`,
        })), { title: tx("Breakdowns by asset"), unit: tx("Downtime minutes"), highlight: (bar) => items.find((item) => (assetById(item.g.asset)?.tag || "–") === bar.label)?.vital }), { fileName: "maintenance-breakdowns" }));
        panels.push(p);
      }
    }
    // MTBF and MTTR per asset, where there is enough to say.
    const relPanel = panel(tx("MTBF and MTTR"), tx("Mean time between failures (operating hours where the meter is logged, else days) and mean time to repair, per asset with two breakdowns or more in 90 days."));
    relPanel.classList.add("mp-panel-reliability");
    const enough = r.reliable.filter((g) => g.enough);
    if (enough.length) {
      const wrap = el("div", "dl-table-wrap");
      wrap.tabIndex = 0;
      const table = el("table", "dl-table mp-rel");
      const thead = el("thead");
      const htr = el("tr");
      [tx("Asset"), tx("Breakdowns"), tx("Downtime"), "MTTR", "MTBF", tx("Cost")].forEach((text, i) => { const th = el("th", i ? "num" : null, text); th.scope = "col"; htr.append(th); });
      thead.append(htr);
      const tbody = el("tbody");
      enough.forEach((g) => {
        const tr = el("tr");
        tr.append(el("td", null, assetLabel(assetById(g.asset))), el("td", "num", int.format(g.n)), el("td", "num", minutesText(g.minutes)), el("td", "num", minutesText(g.mttr)),
          el("td", "num", g.mtbfHours !== null ? hoursText(g.mtbfHours) : tx("{n} days", { n: num(g.mtbfDays, 0) })), el("td", "num", euro.format(g.cost)));
        tbody.append(tr);
      });
      table.append(thead, tbody);
      wrap.append(table);
      relPanel.append(wrap);
    } else relPanel.append(el("p", "form-note", tx("Not enough breakdowns yet: an asset needs two in 90 days.")));
    panels.push(relPanel);
    resultLayout(results, { head, stats, focus, actions, panels });
  };

  // The asset form: the site kind picks the types, the type the tasks it brings (each with its last date).
  const renderTypes = () => {
    fill(assetForm.type, cfg.types.filter((type) => type.sites.includes(state.site)).map((type) => [type.key, type.name]), assetForm.type.value);
    renderTypeTasks();
  };
  let editing = "";
  const renderTypeTasks = () => {
    typeTasks.replaceChildren();
    typeTasks.hidden = Boolean(editing);
    if (editing) return;
    const type = typeOf(assetForm.type.value);
    typeTasks.append(el("p", "mp-sub", tx("Tasks of this type")));
    const list = el("ul", "mp-type-tasks");
    type.tasks.forEach((task, i) => {
      const li = el("li");
      const label = el("label", "mp-check");
      const box = el("input");
      box.type = "checkbox";
      box.checked = !task.optional;
      box.dataset.typeTask = String(i);
      const text = el("span");
      text.append(el("strong", null, task.text), el("span", "mp-task-meta", [intervalText(cleanTask(task)), whoText(task.who), minutesText(task.minutes)].join(" · ")));
      if (task.statutory) text.append(el("span", "dl-tag mp-statutory", `§ ${tx("statutory · check your local rules")}`));
      label.append(box, text);
      const date = el("input", "mp-last");
      date.type = "date";
      date.dataset.typeLast = String(i);
      date.setAttribute("aria-label", tx("Last done: {task}", { task: task.text }));
      date.title = tx("Last done (optional)");
      li.append(label, date);
      list.append(li);
    });
    typeTasks.append(list, el("p", "form-note", tx("Give the date each task was last done, so the first due date is right. Without it, the task is due today.")));
  };
  const renderAreas = () => {
    q("#mp-area-list").replaceChildren(...areaList().map((name) => el("option", null, name)));
  };
  const resetAssetForm = () => {
    editing = "";
    ["tag", "name", "area", "supplier", "contact"].forEach((name) => { assetForm[name].value = ""; });
    assetForm.crit.value = "B";
    addAssetButton.textContent = tx("Add asset");
    cancelEdit.hidden = true;
    renderTypeTasks();
  };
  const editAsset = (asset) => {
    editing = asset.id;
    if (!typeOf(asset.type).sites.includes(state.site)) { state.site = typeOf(asset.type).sites[0]; assetForm.site.value = state.site; renderTypes(); }
    assetForm.type.value = asset.type;
    ["tag", "name", "area", "supplier", "contact"].forEach((name) => { assetForm[name].value = asset[name]; });
    assetForm.crit.value = asset.crit;
    addAssetButton.textContent = tx("Save changes");
    cancelEdit.hidden = false;
    renderTypeTasks();
    setupBox.open = true;
    assetForm.tag.focus();
  };
  const renderAssets = () => {
    setupCount.textContent = state.assets.length ? tx("{n} assets · {m} tasks", { n: int.format(state.assets.length), m: int.format(state.assets.reduce((s, a) => s + a.tasks.length, 0)) }) : tx("No assets yet");
    assetsBody.replaceChildren();
    [...state.assets].sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true })).forEach((asset) => {
      const tr = el("tr");
      const name = el("td");
      name.append(el("strong", null, asset.tag), ` · ${asset.name || typeOf(asset.type).name}`);
      const tools = el("td", "mp-row-tools");
      const edit = el("button", "button-ghost mp-small", tx("Edit"));
      edit.type = "button";
      edit.dataset.editAsset = asset.id;
      edit.setAttribute("aria-label", tx("Edit {asset}", { asset: assetLabel(asset) }));
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeAsset = asset.id;
      remove.setAttribute("aria-label", tx("Remove {asset} and its log", { asset: assetLabel(asset) }));
      tools.append(edit, remove);
      tr.append(name, el("td", null, typeOf(asset.type).name), el("td", null, asset.area), el("td", null, asset.crit), el("td", null, [asset.supplier, asset.contact].filter(Boolean).join(" · ")), el("td", "num", int.format(asset.tasks.length)), tools);
      assetsBody.append(tr);
    });
    assetsWrap.hidden = !state.assets.length;
    const current = taskForm.asset.value;
    fill(taskForm.asset, [...state.assets].sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true })).map((a) => [a.id, assetLabel(a)]), current);
    q("#mp-asset-list").replaceChildren(...state.assets.map((a) => { const o = el("option"); o.value = a.tag; o.label = a.name; return o; }));
    renderAreas();
  };

  // The plan: every task with its last and next date and its status, overdue first.
  const statusCell = (t) => {
    const cell = el("td");
    const text = t.status === "overdue" ? `✗ ${overdueText(t.late)}` : t.status === "week" ? `○ ${tx("Due this week")}` : t.status === "later" ? tx("Planned") : t.info.by === "meter" ? tx("Needs a meter reading") : "–";
    cell.append(el("span", `mp-status is-${t.status}`, text));
    if (t.info.postponed) cell.append(" ", el("span", "dl-tag", tx("postponed")));
    return cell;
  };
  const renderPlan = () => {
    const r = analysis();
    const shown = r.tasks.filter((t) => state.show === "all" || (state.show === "due" && (t.status === "overdue" || t.status === "week")) || (state.show === "overdue" && t.status === "overdue") || (state.show === "statutory" && t.task.statutory));
    planBody.replaceChildren();
    shown.forEach((t) => {
      const tr = el("tr");
      tr.dataset.task = t.task.id;
      const asset = el("td");
      asset.append(el("strong", null, t.asset.tag), el("span", "mp-cell-note", t.asset.name || typeOf(t.asset.type).name));
      const task = el("td");
      task.append(el("span", null, t.task.text));
      if (t.task.statutory) task.append(" ", el("span", "dl-tag mp-statutory", `§ ${tx("statutory")}`));
      if (t.task.checklist.length) task.append(el("span", "mp-cell-note", tx("{n} checklist items", { n: int.format(t.task.checklist.length) })));
      const last = el("td", null, t.info.lastDate ? showDate(t.info.lastDate) : "–");
      const next = el("td");
      next.append(t.info.due ? showDate(t.info.due) : "–");
      if (t.info.by === "hours" && t.info.hoursDue !== null) next.append(el("span", "mp-cell-note", tx("at {h} (now {now})", { h: hoursText(t.info.hoursDue), now: hoursText(t.info.hoursNow) })));
      if (t.info.postponed) next.append(el("span", "mp-cell-note", tx("was {date}", { date: showDate(t.info.original) })));
      const tools = el("td", "mp-row-tools");
      const done = el("button", "button-secondary mp-small", tx("Done"));
      done.type = "button";
      done.dataset.logTask = t.task.id;
      done.dataset.logKind = "done";
      done.setAttribute("aria-label", tx("Log {task} on {asset} as done", { task: t.task.text, asset: t.asset.tag }));
      const later = el("button", "button-ghost mp-small", tx("Postpone"));
      later.type = "button";
      later.dataset.logTask = t.task.id;
      later.dataset.logKind = "postponed";
      later.setAttribute("aria-label", tx("Postpone {task} on {asset}", { task: t.task.text, asset: t.asset.tag }));
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeTask = t.task.id;
      remove.setAttribute("aria-label", tx("Remove the task {task} on {asset}", { task: t.task.text, asset: t.asset.tag }));
      tools.append(done, later, remove);
      tr.append(asset, task, el("td", null, intervalText(t.task)), el("td", null, whoText(t.task.who)), last, next, statusCell(t), tools);
      planBody.append(tr);
    });
    planWrap.hidden = !state.assets.length;
    planEmpty.hidden = state.assets.length > 0;
    planCount.textContent = state.assets.length ? tx("{n} tasks · {a} overdue · {b} due this week", { n: int.format(r.tasks.length), a: int.format(r.overdue.length), b: int.format(r.week.length) }) : "";
    if (state.assets.length && !shown.length) {
      const tr = el("tr");
      const td = el("td", "form-note", tx("No task matches this view."));
      td.colSpan = 8;
      tr.append(td);
      planBody.append(tr);
    }
  };

  // The log form: one kind at a time, the fields of that kind shown.
  let kind = "done";
  let photoControl = null;
  const logAsset = () => assetByTag(logForm.asset.value);
  const renderLogKind = () => {
    root.querySelectorAll("[data-kinds]").forEach((node) => { node.hidden = !node.dataset.kinds.split(" ").includes(kind); });
    root.querySelectorAll("input[name='mp-kind']").forEach((input) => { input.checked = input.value === kind; });
    renderChecklist();
  };
  const renderLogTasks = () => {
    const asset = logAsset();
    const current = logForm.task.value;
    fill(logForm.task, asset ? asset.tasks.map((t) => [t.id, `${t.text} · ${everyText(t.every, t.unit)}`]) : [], current);
    if (!asset) logAssetNote.textContent = logForm.asset.value.trim() ? tx("This tag is not in the plan.") : tx("Scan the code on the asset or type its tag.");
    else {
      const events = eventsOf(asset.id);
      const points = meterPoints(events);
      logAssetNote.textContent = [asset.name || typeOf(asset.type).name, asset.area, `${tx("criticality")} ${asset.crit}`, points.length ? tx("meter {h} on {date}", { h: hoursText(points.at(-1).hours), date: showDate(points.at(-1).date) }) : ""].filter(Boolean).join(" · ");
    }
    renderChecklist();
  };
  const renderChecklist = () => {
    checklistBox.replaceChildren();
    const task = taskById(logAsset(), logForm.task.value);
    checklistBox.hidden = kind !== "done" || !task?.checklist.length;
    if (checklistBox.hidden) return;
    const set = el("fieldset", "mp-checklist");
    set.append(el("legend", "mp-sub", tx("Checklist")));
    task.checklist.forEach((item, i) => {
      const label = el("label", "mp-check");
      const box = el("input");
      box.type = "checkbox";
      box.dataset.checkItem = String(i);
      label.append(box, el("span", null, item));
      set.append(label);
    });
    checklistBox.append(set);
  };
  const openLog = (taskId, nextKind) => {
    const asset = state.assets.find((a) => a.tasks.some((t) => t.id === taskId));
    if (!asset) return;
    kind = nextKind;
    logForm.asset.value = asset.tag;
    renderLogTasks();
    logForm.task.value = taskId;
    logForm.date.value = today();
    if (nextKind === "done") logForm.minutes.value = String(taskById(asset, taskId).minutes || "");
    if (nextKind === "postponed") logForm.until.value = addDays(today(), 7);
    renderLogKind();
    logBox.scrollIntoView({ behavior: "smooth", block: "start" });
    (nextKind === "postponed" ? logForm.until : logForm.by).focus({ preventScroll: true });
  };

  // The log table: newest first, a breakdown with its link to 5 Whys.
  const LOG_ROWS = 40;
  const detailOf = (row) => {
    const asset = assetById(row.asset);
    const task = taskById(asset, row.task);
    if (row.kind === "done") return [task?.text || "–", row.minutes ? minutesText(row.minutes) : "", row.parts ? `${tx("parts")} ${euro.format(row.parts)}` : "", typeof row.hours === "number" ? hoursText(row.hours) : "", task?.checklist.length ? tx("{a} of {b} checked", { a: int.format(row.checked.length), b: int.format(task.checklist.length) }) : "", row.note].filter(Boolean).join(" · ");
    if (row.kind === "postponed") return [task?.text || "–", tx("to {date}", { date: showDate(row.until) }), row.reason, row.note].filter(Boolean).join(" · ");
    if (row.kind === "breakdown") return [causeName(row.cause), tx("{t} of downtime", { t: minutesText(row.minutes) }), row.cost ? euro.format(row.cost) : "", row.note].filter(Boolean).join(" · ");
    return [hoursText(row.hours), row.note].filter(Boolean).join(" · ");
  };
  const renderLog = () => {
    const list = state.rows.filter((row) => assetById(row.asset)).slice().reverse().slice(0, LOG_ROWS);
    logBody.replaceChildren();
    list.forEach((row) => {
      const asset = assetById(row.asset);
      const tr = el("tr");
      tr.dataset.row = row.id;
      const what = el("td");
      what.append(el("span", `mp-kind is-${row.kind}`, kindText[row.kind]()));
      const detail = el("td", null, detailOf(row));
      if (row.kind === "breakdown") {
        const url = fiveWhysUrl();
        url.searchParams.set("problem", tx("{asset} stopped on {date}: {cause}, {minutes} of downtime", { asset: assetLabel(asset), date: showDate(row.date), cause: causeName(row.cause), minutes: minutesText(row.minutes) }) + (row.note ? ` (${row.note})` : ""));
        const link = el("a", "inline-link mp-whys", tx("5 Whys"));
        link.href = url.href;
        detail.append(" ", link);
      }
      const tools = el("td", "mp-row-tools");
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeRow = row.id;
      remove.setAttribute("aria-label", tx("Remove the entry of {asset} on {date}", { asset: asset.tag, date: showDate(row.date) }));
      tools.append(remove);
      const assetCell = el("td");
      assetCell.append(el("strong", null, asset.tag));
      tr.append(el("td", null, showDate(row.date)), assetCell, what, detail, el("td", null, row.by), tools);
      logBody.append(tr);
    });
    const n = state.rows.filter((row) => assetById(row.asset)).length;
    logWrap.hidden = !n;
    logEmpty.hidden = n > 0;
    logCount.textContent = n ? `${tx("{n} entries", { n: int.format(n) })}${n > LOG_ROWS ? tx(" · newest {n} shown, CSV has all", { n: LOG_ROWS }) : ""}` : "";
    decorateLog();
  };
  // A logged task with photos gets a button that opens them.
  let drawing = 0;
  const decorateLog = async () => {
    if (!photos) return;
    const mine = ++drawing;
    let counts = {};
    try { counts = await media.counts(TOOL); } catch { return; }
    if (mine !== drawing) return;
    logBody.querySelectorAll("tr[data-row]").forEach((tr) => {
      tr.querySelector(".fc-row-photos")?.remove();
      const n = counts[tr.dataset.row] || 0;
      if (!n) return;
      const row = state.rows.find((item) => item.id === tr.dataset.row);
      const asset = assetById(row?.asset);
      const open = el("button", "fc-row-photos has-photos", tx("Photos · {n}", { n: int.format(n) }));
      open.type = "button";
      open.setAttribute("aria-label", `${open.textContent}, ${asset ? asset.tag : ""}, ${showDate(row.date)}`);
      open.addEventListener("click", () => Capture.openPhotos({ title: `${assetLabel(asset)} · ${showDate(row.date)}`, tool: TOOL, refs: [{ ref: row.id, label: detailOf(row) }], onClose: decorateLog }));
      tr.cells[1]?.append(" ", open);
    });
  };
  const movePhotos = async (rowId) => {
    if (!photos) return;
    try {
      for (const record of (await media.list(TOOL)).filter((r) => r.ref === "draft")) await media.update(record.id, { ref: rowId });
    } catch { /* the photos stay with the form and can be added again */ }
    photoControl?.refresh();
    decorateLog();
  };

  // From OEE: the breakdown stops of the OEE log not taken over or ignored yet, newest first. Each is taken over as a
  // breakdown of the asset its machine matches by tag or name (or the one picked), with its minutes and its cause; the
  // OEE reason stays in the note. While either tool shows its example, nothing is offered: example stops do not belong
  // in a real plan, and a real stop does not belong to an example asset.
  const OEE_SHOWN = 8;
  const oeeStops = () => {
    const saved = read(OEE_KEY, null);
    if (!isObject(saved) || exampleMatches(saved)) return [];
    return oeeBreakdowns(saved, oeeReasons).filter((stop) => !state.oee[stop.key]);
  };
  const oeeText = (stop) => [showDate(stop.date), stop.machine, minutesText(stop.minutes), stop.reason || tx("No reason"), stop.shift].filter(Boolean).join(" · ");
  const renderOee = () => {
    if (!oeeBox) return;
    const list = oeeBox.querySelector("[data-oee-list]");
    const note = oeeBox.querySelector("[data-oee-note]");
    const all = oeeBox.querySelector("[data-oee-ignore-all]");
    const pending = oeeStops();
    const status = oeeBox.querySelector("[data-oee-status]");
    oeeBox.hidden = !pending.length && !status.textContent;
    list.replaceChildren();
    all.hidden = pending.length < 2 || exampleMatches(state);
    if (!pending.length) { note.textContent = ""; return; }
    if (exampleMatches(state)) {
      note.textContent = tx("OEE holds {stops} not in this log. Clear the example to take them over.", { stops: pending.length === 1 ? tx("1 breakdown stop") : tx("{n} breakdown stops", { n: int.format(pending.length) }) });
      return;
    }
    const assets = [...state.assets].sort((a, b) => a.tag.localeCompare(b.tag, undefined, { numeric: true }));
    note.textContent = [
      pending.length > OEE_SHOWN ? tx("{n} breakdown stops, the newest {m} shown.", { n: int.format(pending.length), m: int.format(OEE_SHOWN) }) : "",
      assets.length ? "" : tx("Add the machine as an asset first, then take its stops over."),
    ].filter(Boolean).join(" ");
    pending.slice(0, OEE_SHOWN).forEach((stop, i) => {
      const li = el("li", "mp-oee-item");
      li.dataset.oeeKey = stop.key;
      li.append(el("p", "mp-oee-what", oeeText(stop)));
      const pick = el("div", "mp-oee-pick");
      const match = matchAsset(stop.machine, state.assets);
      const asset = el("select");
      asset.id = `mp-oee-asset-${i}`;
      asset.dataset.oeeAsset = "";
      const assetLabelEl = el("label", "visually-hidden", tx("Asset for {machine}", { machine: stop.machine }));
      assetLabelEl.htmlFor = asset.id;
      fill(asset, [...(match ? [] : [["", tx("Pick the asset")]]), ...assets.map((a) => [a.id, assetLabel(a)])], match?.id || "");
      const cause = el("select");
      cause.id = `mp-oee-cause-${i}`;
      cause.dataset.oeeCause = "";
      const causeLabelEl = el("label", "visually-hidden", tx("Cause"));
      causeLabelEl.htmlFor = cause.id;
      fill(cause, cfg.causes.map((c) => [c.key, c.name]), causeFor(stop.reason, cfg.causes));
      const take = el("button", "button-secondary mp-small", tx("Take over as a breakdown"));
      take.type = "button";
      take.dataset.oeeTake = stop.key;
      take.disabled = !assets.length;
      take.setAttribute("aria-label", `${tx("Take over as a breakdown")}: ${oeeText(stop)}`);
      const ignore = el("button", "button-ghost mp-small", tx("Ignore"));
      ignore.type = "button";
      ignore.dataset.oeeIgnore = stop.key;
      ignore.setAttribute("aria-label", `${tx("Ignore")}: ${oeeText(stop)}`);
      pick.append(assetLabelEl, asset, causeLabelEl, cause, take, ignore);
      li.append(pick);
      list.append(li);
    });
  };

  const render = () => {
    renderAssets();
    renderPlan();
    renderLog();
    renderOee();
    renderResults();
  };
  const changed = () => { save(); render(); };

  // The example: three months of a parcel hub with 14 assets; it ends today.
  const loadExample = () => {
    const ex = exampleData(cfg.example, cfg.types, today());
    state.site = ex.site;
    state.assets = [...state.assets.filter((a) => !a.id.startsWith("ex-")), ...ex.assets];
    state.rows = ex.rows;
    state.sent = {};
    state.example = exampleStamp(state.rows);
  };
  const dropExample = () => {
    const ids = new Set(state.assets.filter((a) => a.id.startsWith("ex-")).map((a) => a.id));
    state.assets = state.assets.filter((a) => !ids.has(a.id));
    state.rows = state.rows.filter((row) => !ids.has(row.asset));
    state.sent = {};
    state.example = {};
  };
  // The first own asset replaces the example as a whole.
  const ownWork = () => { if (exampleMatches(state)) dropExample(); };
  exampleUi = exampleNote(results, () => { dropExample(); resetAssetForm(); changed(); });

  // Asset events.
  assetForm.site.addEventListener("change", () => { state.site = assetForm.site.value; save(); renderTypes(); renderAreas(); });
  assetForm.type.addEventListener("change", renderTypeTasks);
  addAssetButton.addEventListener("click", () => {
    const tag = assetForm.tag.value.trim();
    if (!tag) { flash(assetStatus, tx("Give the asset a tag, the code on its label.")); assetForm.tag.focus(); return; }
    const twin = state.assets.find((a) => fold(a.tag) === fold(tag) && a.id !== editing);
    if (twin) { flash(assetStatus, tx("{tag} is already in the plan: {asset}.", { tag, asset: assetLabel(twin) })); assetForm.tag.focus(); return; }
    const fields = { tag, name: assetForm.name.value.trim(), type: assetForm.type.value, area: assetForm.area.value.trim(), crit: assetForm.crit.value, supplier: assetForm.supplier.value.trim(), contact: assetForm.contact.value.trim() };
    if (editing) {
      const asset = assetById(editing);
      if (asset) Object.assign(asset, cleanAsset({ ...asset, ...fields }));
      const message = tx("Saved: {asset}.", { asset: assetLabel(asset) });
      resetAssetForm();
      changed();
      flash(assetStatus, message);
      return;
    }
    ownWork();
    const type = typeOf(fields.type);
    const now = today();
    const tasks = [...typeTasks.querySelectorAll("[data-type-task]")].filter((box) => box.checked).map((box) => {
      const i = Number(box.dataset.typeTask);
      const last = parseDate(typeTasks.querySelector(`[data-type-last="${i}"]`)?.value) || "";
      return { ...taskFrom(type.tasks[i], id("t")), last, start: last ? "" : now };
    });
    const asset = cleanAsset({ ...fields, id: id("a"), name: fields.name || type.name, tasks });
    state.assets.push(asset);
    resetAssetForm();
    changed();
    flash(assetStatus, tx("Added {asset} with {n} tasks.", { asset: assetLabel(asset), n: int.format(asset.tasks.length) }));
    taskForm.asset.value = asset.id;
  });
  cancelEdit.addEventListener("click", resetAssetForm);
  assetsBody.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-asset]");
    if (edit) { const asset = assetById(edit.dataset.editAsset); if (asset) editAsset(asset); return; }
    const button = event.target.closest("[data-remove-asset]");
    if (!button) return;
    const index = state.assets.findIndex((a) => a.id === button.dataset.removeAsset);
    if (index < 0) return;
    const [removed] = state.assets.splice(index, 1);
    const rows = state.rows.filter((row) => row.asset === removed.id);
    state.rows = state.rows.filter((row) => row.asset !== removed.id);
    if (editing === removed.id) resetAssetForm();
    changed();
    undoNote(assetStatus, tx("Removed {asset} and {n} log entries.", { asset: assetLabel(removed), n: int.format(rows.length) }), () => {
      state.assets.splice(Math.min(index, state.assets.length), 0, removed);
      state.rows = [...state.rows, ...rows].sort(byDate);
      changed();
    });
  });

  // A task added by hand to an asset.
  const syncHours = () => { taskForm.hours.disabled = taskForm.unit.value === "hours"; };
  taskForm.unit.addEventListener("change", syncHours);
  q("[data-add-task]").addEventListener("click", () => {
    const asset = assetById(taskForm.asset.value);
    if (!asset) { flash(taskStatus, tx("Add an asset first.")); return; }
    const text = taskForm.text.value.trim();
    if (!text) { flash(taskStatus, tx("Say what the task is.")); taskForm.text.focus(); return; }
    const every = Math.round(parseNumber(taskForm.every.value));
    if (!(every >= 1)) { flash(taskStatus, tx("Give the interval as a whole number, 1 or more.")); taskForm.every.focus(); return; }
    const last = parseDate(taskForm.last.value) || "";
    const task = cleanTask({ id: id("t"), text, every, unit: taskForm.unit.value, hours: taskForm.unit.value === "hours" ? 0 : Math.round(parseNumber(taskForm.hours.value)) || 0, who: taskForm.who.value, minutes: Math.round(parseNumber(taskForm.minutes.value)) || 0, statutory: taskForm.statutory.checked, checklist: taskForm.checklist.value.split(/\r?\n/), last, start: last ? "" : today() });
    asset.tasks.push(task);
    ["text", "hours", "minutes", "last", "checklist"].forEach((name) => { taskForm[name].value = ""; });
    taskForm.statutory.checked = false;
    changed();
    flash(taskStatus, tx("Added to {asset}: {task}, {every}.", { asset: asset.tag, task: task.text, every: intervalText(task) }));
  });

  // The plan's buttons: done and postpone open the log form; × removes the task (with undo).
  planBody.addEventListener("click", (event) => {
    const log = event.target.closest("[data-log-task]");
    if (log) { openLog(log.dataset.logTask, log.dataset.logKind); return; }
    const button = event.target.closest("[data-remove-task]");
    if (!button) return;
    const asset = state.assets.find((a) => a.tasks.some((t) => t.id === button.dataset.removeTask));
    if (!asset) return;
    const index = asset.tasks.findIndex((t) => t.id === button.dataset.removeTask);
    const [removed] = asset.tasks.splice(index, 1);
    changed();
    undoNote(planStatus, tx("Removed the task {task} from {asset}. Its log stays.", { task: removed.text, asset: asset.tag }), () => {
      asset.tasks.splice(Math.min(index, asset.tasks.length), 0, removed);
      changed();
    });
  });
  showSelect.value = state.show;
  showSelect.addEventListener("change", () => { state.show = showSelect.value; save(); renderPlan(); });

  // Log events.
  root.querySelectorAll("input[name='mp-kind']").forEach((input) => input.addEventListener("change", () => { if (input.checked) { kind = input.value; renderLogKind(); } }));
  logForm.asset.addEventListener("input", renderLogTasks);
  logForm.task.addEventListener("change", () => {
    renderChecklist();
    const task = taskById(logAsset(), logForm.task.value);
    if (kind === "done" && task && !logForm.minutes.value) logForm.minutes.value = String(task.minutes || "");
  });
  q("[data-log-save]").addEventListener("click", async () => {
    const asset = logAsset();
    if (!asset) { flash(logStatus, tx("Pick the asset: scan its code or type its tag.")); logForm.asset.focus(); return; }
    const date = parseDate(logForm.date.value) || today();
    const base = { id: id("r"), kind, asset: asset.id, date, by: logForm.by.value.trim(), note: logForm.note.value.trim() };
    let row;
    if (kind === "done" || kind === "postponed") {
      const task = taskById(asset, logForm.task.value);
      if (!task) { flash(logStatus, tx("Pick the task.")); logForm.task.focus(); return; }
      if (kind === "done") row = { ...base, task: task.id, minutes: Math.round(amount(logForm.minutes.value)), parts: amount(logForm.parts.value), hours: hoursValue(logForm.hours.value), checked: [...checklistBox.querySelectorAll("[data-check-item]")].filter((box) => box.checked).map((box) => Number(box.dataset.checkItem)) };
      else {
        const until = parseDate(logForm.until.value);
        if (!until || until <= date) { flash(logStatus, tx("Give the new date, after the day you postpone it.")); logForm.until.focus(); return; }
        row = { ...base, task: task.id, until, reason: logForm.reason.value.trim() };
      }
    } else if (kind === "breakdown") row = { ...base, minutes: Math.round(amount(logForm.downtime.value)), cause: logForm.cause.value, cost: amount(logForm.cost.value) };
    else {
      const hours = hoursValue(logForm.hours.value);
      if (hours === null || !String(logForm.hours.value).trim()) { flash(logStatus, tx("Give the operating hours on the meter.")); logForm.hours.focus(); return; }
      const before = meterPoints(eventsOf(asset.id)).filter((p) => p.date <= date).at(-1);
      if (before && hours < before.hours) { flash(logStatus, tx("The meter showed {h} on {date}; a reading cannot be lower.", { h: hoursText(before.hours), date: showDate(before.date) })); logForm.hours.focus(); return; }
      row = { ...base, hours };
    }
    const clean = cleanRow(row);
    state.rows.push(clean);
    state.rows.sort(byDate);
    const info = clean.task ? nextDue(taskById(asset, clean.task), eventsOf(asset.id)) : null;
    ["by", "minutes", "parts", "until", "reason", "downtime", "cost", "hours", "note"].forEach((name) => { if (name !== "by") logForm[name].value = ""; });
    changed();
    renderChecklist();
    const message = clean.kind === "done" ? tx("Logged: {task} on {asset}. Next due {date}.", { task: taskById(asset, clean.task).text, asset: asset.tag, date: info?.due ? showDate(info.due) : "–" })
      : clean.kind === "postponed" ? tx("Postponed to {date}: {task} on {asset}.", { date: showDate(clean.until), task: taskById(asset, clean.task).text, asset: asset.tag })
        : clean.kind === "breakdown" ? tx("Breakdown logged: {asset}, {t} of downtime.", { asset: asset.tag, t: minutesText(clean.minutes) })
          : tx("Meter reading logged: {asset}, {h}.", { asset: asset.tag, h: hoursText(clean.hours) });
    flash(logStatus, message);
    await movePhotos(clean.id);
  });

  // From OEE: take a stop over as a breakdown of the chosen asset, or ignore it; either can be undone.
  const oeeStatus = oeeBox?.querySelector("[data-oee-status]");
  oeeBox?.addEventListener("click", (event) => {
    const takeButton = event.target.closest("[data-oee-take]");
    const ignoreButton = event.target.closest("[data-oee-ignore]");
    const allButton = event.target.closest("[data-oee-ignore-all]");
    if (allButton) {
      const pending = oeeStops();
      if (!pending.length || !window.confirm(tx("Ignore all {n} breakdown stops from OEE? They are not offered again.", { n: int.format(pending.length) }))) return;
      pending.forEach((stop) => { state.oee[stop.key] = "ignored"; });
      changed();
      undoNote(oeeStatus, tx("{n} stops from OEE ignored.", { n: int.format(pending.length) }), () => { pending.forEach((stop) => { delete state.oee[stop.key]; }); changed(); });
      renderOee();
      return;
    }
    const key = takeButton?.dataset.oeeTake || ignoreButton?.dataset.oeeIgnore;
    if (!key) return;
    const stop = oeeStops().find((item) => item.key === key);
    if (!stop) return;
    const item = event.target.closest("[data-oee-key]");
    if (ignoreButton) {
      state.oee[key] = "ignored";
      changed();
      undoNote(oeeStatus, tx("Ignored: {stop}.", { stop: oeeText(stop) }), () => { delete state.oee[key]; changed(); });
      renderOee();
      return;
    }
    const asset = assetById(item?.querySelector("[data-oee-asset]")?.value);
    if (!asset) { flash(oeeStatus, tx("Pick the asset in the plan for this machine.")); item?.querySelector("[data-oee-asset]")?.focus(); return; }
    const cause = item.querySelector("[data-oee-cause]")?.value;
    const row = cleanRow({ id: id("r"), kind: "breakdown", asset: asset.id, date: stop.date, minutes: stop.minutes, cause, cost: 0, by: "", note: [`${tx("From OEE")}: ${stop.reason || tx("No reason")}`, stop.shift].filter(Boolean).join(" · ") });
    state.rows.push(row);
    state.rows.sort(byDate);
    state.oee[key] = "taken";
    changed();
    undoNote(oeeStatus, tx("Breakdown logged: {asset}, {t} of downtime.", { asset: asset.tag, t: minutesText(row.minutes) }), () => {
      state.rows = state.rows.filter((r) => r.id !== row.id);
      delete state.oee[key];
      changed();
    });
    renderOee();
    (oeeBox.querySelector("[data-oee-take]") || logForm.asset).focus();
  });
  // OEE logged in another tab: offer its new stops here too.
  window.addEventListener("storage", (event) => { if (event.key === OEE_KEY) renderOee(); });

  // The log: remove one (with undo), the exports and clearing.
  logBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-row]");
    if (!button) return;
    const index = state.rows.findIndex((row) => row.id === button.dataset.removeRow);
    if (index < 0) return;
    const [removed] = state.rows.splice(index, 1);
    changed();
    undoNote(historyStatus, tx("Removed the entry of {asset} on {date}.", { asset: assetById(removed.asset)?.tag || "", date: showDate(removed.date) }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      changed();
    });
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    assetForm.site.value = state.site;
    renderTypes();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the whole log? The assets and their tasks stay; the due dates go back to the last dates given."))) return;
    state.rows = [];
    state.sent = {};
    state.oee = {};
    state.example = {};
    changed();
  });
  q("[data-clear-plan]").addEventListener("click", () => {
    if (!state.assets.length || !window.confirm(tx("Clear the whole plan? Every asset, task and log entry is removed."))) return;
    state.assets = [];
    state.rows = [];
    state.sent = {};
    state.oee = {};
    state.example = {};
    resetAssetForm();
    changed();
  });
  const planRows = () => {
    const r = analysis();
    const rows = [[tx("Tag"), tx("Asset"), tx("Type"), tx("Area"), tx("Criticality"), tx("Supplier"), tx("Task"), tx("Interval"), tx("Every"), tx("Unit"), tx("Or operating hours"), tx("Who"), tx("Minutes"), tx("Statutory"), tx("Last done"), tx("Next due date"), tx("Status"), tx("Checklist")]];
    r.tasks.forEach((t) => rows.push([t.asset.tag, t.asset.name, typeOf(t.asset.type).name, t.asset.area, t.asset.crit, t.asset.supplier, t.task.text, intervalText(t.task), t.task.every, unitName[t.task.unit](), t.task.hours || "", whoText(t.task.who), t.task.minutes, t.task.statutory ? tx("yes") : tx("no"), t.info.lastDate, t.info.due,
      t.status === "overdue" ? overdueText(t.late) : t.status === "week" ? tx("Due this week") : t.status === "later" ? tx("Planned") : "", t.task.checklist.join("; ")]));
    return rows;
  };
  const logRows = () => {
    const rows = [[tx("Date"), tx("Tag"), tx("Asset"), tx("Area"), tx("Entry"), tx("Task"), tx("Done by"), tx("Minutes"), tx("Parts €"), tx("Cost €"), tx("Cause"), tx("Operating hours"), tx("New date"), tx("Reason"), tx("Note")]];
    state.rows.filter((row) => assetById(row.asset)).forEach((row) => {
      const asset = assetById(row.asset);
      rows.push([row.date, asset.tag, asset.name, asset.area, kindText[row.kind](), taskById(asset, row.task)?.text || "", row.by, row.minutes ?? "", row.parts ?? "", row.cost ?? "", row.kind === "breakdown" ? causeName(row.cause) : "", typeof row.hours === "number" ? row.hours : "", row.until || "", row.reason || "", row.note]);
    });
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.assets.length) downloadCsv(cfg.text.csvName, planRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.assets.length) downloadXlsx(cfg.text.csvName, planRows()); });
  q("[data-log-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(cfg.text.logName, logRows()); });
  q("[data-log-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(cfg.text.logName, logRows()); });
  // The calendar file: every task's next date within a year, overdue ones on today.
  const icsItems = () => {
    const r = analysis();
    const until = addDays(r.now, 366);
    return r.tasks.filter((t) => isIso(t.info.due) && t.info.due <= until).map((t) => ({
      uid: `${t.task.id}-${t.info.due}`,
      date: t.info.due < r.now ? r.now : t.info.due,
      summary: `${t.status === "overdue" ? `${tx("Overdue")}: ` : ""}${t.asset.tag} · ${t.task.text}`,
      description: [assetLabel(t.asset), t.asset.area, `${whoText(t.task.who)}${t.task.who === "external" && t.asset.supplier ? `: ${t.asset.supplier}${t.asset.contact ? ` (${t.asset.contact})` : ""}` : ""}`, minutesText(t.task.minutes), intervalText(t.task),
        t.status === "overdue" ? tx("Due {date}", { date: showDate(t.info.due) }) : "", t.task.statutory ? `§ ${cfg.text.statutory}` : "", t.task.checklist.length ? `${tx("Checklist")}: ${t.task.checklist.join("; ")}` : ""].filter(Boolean).join("\n"),
    }));
  };
  q("[data-ics]").addEventListener("click", () => {
    if (!state.assets.length) return;
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([ics(icsItems())], { type: "text/calendar;charset=utf-8" }));
    link.download = `${cfg.text.csvName}-${today()}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    flash(planStatus, tx("Calendar file saved: open it on your phone or in Outlook to get the due dates as events."));
  });

  // Start: the selects, the photo control, the example on a first visit (nothing is written until the visitor acts).
  fill(assetForm.site, cfg.sites.map((s) => [s.key, s.name]), state.site);
  fill(assetForm.crit, cfg.criticality.map((c) => [c.key, c.name]), "B");
  fill(logForm.cause, cfg.causes.map((c) => [c.key, c.name]), "wear");
  fill(taskForm.unit, UNITS.map((u) => [u, unitName[u]()]), "months");
  fill(taskForm.who, WHO.map((w) => [w, whoText(w)]), "internal");
  syncHours();
  logForm.date.value = today();
  if (photos && photoBox) photoControl = Capture.attach(photoBox, { tool: TOOL, ref: "draft" });
  if (!state.assets.length && !state.rows.length && firstVisit(KEY)) loadExample();
  assetForm.site.value = state.site;
  renderTypes();
  resetAssetForm();
  setupBox.open = !state.assets.length;
  renderLogKind();
  renderLogTasks();
  render();
  if (Workplace) window.addEventListener("workplace:changed", renderAreas);
})();
