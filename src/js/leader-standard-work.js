// Leader Standard Work: the routine of each leader written down as a standard (what, when, how long, what done looks
// like, which tool), checked off every day, and reviewed once a week by the next level up. Adherence is done ÷ due:
// a task marked "not relevant today" or "not due" is left out, and a task nobody marked by the end of its day counts
// as missed (not recorded). The arithmetic lives in window.LeaderStandardWorkMath, so tests can call it.
(() => {
  // The share of a leader's day that is standard work falls with the level. The defaults follow David Mann, "Creating
  // a Lean Culture" (the chart of leader standard work by level): about 80 % for a team leader, 50 % for a supervisor
  // (here the shift lead), 25 % for a value stream or area manager, and less again for the plant manager (about 10 %,
  // used here for the site manager). They are guides, not targets, and can be changed on the page.
  const LEVEL_SHARE = { team: 0.8, shift: 0.5, area: 0.25, site: 0.1 };
  const LEVELS = Object.keys(LEVEL_SHARE);
  const FREQS = ["daily", "shift", "weekly", "monthly"];
  const STATUSES = ["done", "missed", "na"];
  // A task missed this often within this many days (today included) is a repeat miss: it goes to the Action Tracker.
  const REPEAT_COUNT = 3;
  const REPEAT_DAYS = 14;
  const UNRECORDED = "unrecorded";
  const EXCLUDED = ["notrelevant"];
  const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7];

  const pad = (n) => String(n).padStart(2, "0");
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // ISO weekday: 1 is Monday, 7 is Sunday.
  const weekday = (iso) => { const d = new Date(`${iso}T00:00:00Z`).getUTCDay(); return d === 0 ? 7 : d; };
  const mondayOf = (iso) => addDays(iso, 1 - weekday(iso));
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  const lastDayOfMonth = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();
  // Day d of a month, or the last day of a month that is shorter: day 31 is 30 April, 28 February (29 in a leap year).
  const monthDate = (year, month, day) => `${year}-${pad(month)}-${pad(Math.min(day, lastDayOfMonth(year, month)))}`;
  const toMinutes = (text) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(text ?? "").trim());
    if (!match) return NaN;
    const h = Number(match[1]), m = Number(match[2]);
    return h < 24 && m < 60 ? h * 60 + m : NaN;
  };
  const clock = (minutes) => { const m = ((Math.round(minutes) % 1440) + 1440) % 1440; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
  const workdays = (leader) => (Array.isArray(leader?.days) && leader.days.length ? leader.days : ALL_DAYS);
  // The first working day of the leader on or after a date (a week always has one).
  const nextWorkingDay = (iso, days) => {
    for (let i = 0; i < 7; i++) { const d = addDays(iso, i); if (days.includes(weekday(d))) return d; }
    return iso;
  };

  // When a task is in the leader's day, in minutes from the midnight that starts the shift's date. A per-shift task is
  // its minutes after the shift start (past 24:00 in a night shift); a task at a clock time that lies before the start of
  // a shift that runs past midnight is in the part after midnight, so it stays in the same shift.
  const minuteOf = (leader, task) => {
    const start = toMinutes(leader.start);
    if (task.freq === "shift") return start + task.offset;
    const t = toMinutes(task.time);
    const end = start + leader.hours * 60;
    return end > 1440 && t < start && t + 1440 <= end ? t + 1440 : t;
  };
  // A night shift belongs to the day it starts: just after midnight, the shift to check off is yesterday's.
  const shiftDay = (leader, today, nowMinute) => {
    const end = toMinutes(leader.start) + leader.hours * 60;
    const yesterday = addDays(today, -1);
    return end > 1440 && nowMinute < end - 1440 && workdays(leader).includes(weekday(yesterday)) ? yesterday : today;
  };

  // The dates a weekly or monthly task falls on, before a day off moves it.
  const nominalDates = (task, from, to) => {
    const out = [];
    if (task.freq === "weekly") {
      for (let d = addDays(from, (task.weekday - weekday(from) + 7) % 7); d <= to; d = addDays(d, 7)) out.push(d);
    } else if (task.freq === "monthly") {
      let year = Number(from.slice(0, 4)), month = Number(from.slice(5, 7));
      for (let i = 0; i < 1200; i++) {
        const d = monthDate(year, month, task.monthDay);
        if (d > to) break;
        if (d >= from) out.push(d);
        month += 1;
        if (month > 12) { month = 1; year += 1; }
      }
    }
    return out;
  };
  // The due tasks of a leader from one date to another, in time order. The rules:
  // - daily (at a clock time) and per-shift (minutes after the shift start) tasks are due on each working day;
  // - a weekly task is due on its weekday, a monthly task on its day of the month (or the last day of a shorter month);
  //   one that falls on a day off moves to the leader's next working day;
  // - nothing is due before the leader's standard started (since), nor a task before it was added (its since).
  const schedule = (leader, from, to) => {
    const days = workdays(leader);
    const begin = isIso(leader.since) && leader.since > from ? leader.since : from;
    if (!(begin <= to)) return [];
    const out = [];
    (leader.tasks || []).forEach((task) => {
      const start = isIso(task.since) && task.since > begin ? task.since : begin;
      if (start > to) return;
      let dates = [];
      if (task.freq === "daily" || task.freq === "shift") {
        for (let d = start; d <= to; d = addDays(d, 1)) if (days.includes(weekday(d))) dates.push(d);
      } else {
        dates = nominalDates(task, addDays(start, -6), to).map((d) => nextWorkingDay(d, days)).filter((d) => d >= start && d <= to);
      }
      const minute = minuteOf(leader, task);
      dates.forEach((date) => out.push({ date, leaderId: leader.id, taskId: task.id, minute, key: `${leader.id}|${task.id}|${date}` }));
    });
    return out.sort((a, b) => a.date.localeCompare(b.date) || a.minute - b.minute);
  };
  const dueOn = (leader, date) => schedule(leader, date, date);

  // The state of one due task: as marked, or open while its day lasts, or missed "not recorded" once the day is over.
  const statusOf = (mark, date, today) => {
    if (mark && STATUSES.includes(mark.s)) return { s: mark.s, r: mark.s === "missed" ? String(mark.r || "") : "" };
    return date < today ? { s: "missed", r: UNRECORDED } : { s: "open", r: "" };
  };
  // Adherence = done ÷ due, where due = done + missed. Left out: "not due", the reasons that are excluded ("not relevant
  // today") and what is still open today.
  const tally = (items, excluded = EXCLUDED) => {
    const t = { scheduled: items.length, done: 0, missed: 0, excluded: 0, na: 0, open: 0, unrecorded: 0, due: 0, adherence: null };
    items.forEach(({ s, r }) => {
      if (s === "done") t.done++;
      else if (s === "na") t.na++;
      else if (s === "open") t.open++;
      else if (excluded.includes(r)) t.excluded++;
      else { t.missed++; if (r === UNRECORDED) t.unrecorded++; }
    });
    t.due = t.done + t.missed;
    t.adherence = t.due ? t.done / t.due : null;
    return t;
  };
  const isMiss = (item, excluded = EXCLUDED) => item.s === "missed" && !excluded.includes(item.r);
  // Every due task of the leaders in a period with its state. With the minute of the day, a night shift that is still
  // running after midnight keeps yesterday's tasks open instead of "not recorded".
  const entries = (leaders, marks, from, to, today, nowMinute = null) => leaders.flatMap((leader) => {
    const day = nowMinute === null ? today : shiftDay(leader, today, nowMinute);
    return schedule(leader, from, to).map((occ) => ({ ...occ, ...statusOf(marks?.[occ.key], occ.date, day) }));
  });
  const byWeek = (items, excluded = EXCLUDED) => {
    const groups = new Map();
    items.forEach((item) => { const key = mondayOf(item.date); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(item); });
    return [...groups].sort(([a], [b]) => a.localeCompare(b)).map(([week, list]) => ({ week, ...tally(list, excluded) }));
  };
  // Misses per task (leader and task), most first, with their reasons.
  const missesByTask = (items, excluded = EXCLUDED) => {
    const groups = new Map();
    items.forEach((item) => {
      const key = `${item.leaderId}|${item.taskId}`;
      if (!groups.has(key)) groups.set(key, { key, leaderId: item.leaderId, taskId: item.taskId, misses: 0, due: 0, excluded: 0, reasons: {}, dates: [] });
      const g = groups.get(key);
      if (item.s === "done") g.due++;
      if (item.s === "missed" && excluded.includes(item.r)) g.excluded++;
      if (isMiss(item, excluded)) { g.misses++; g.due++; g.reasons[item.r] = (g.reasons[item.r] || 0) + 1; g.dates.push(item.date); }
    });
    return [...groups.values()].filter((g) => g.misses > 0)
      .map((g) => ({ ...g, top: Object.entries(g.reasons).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0] }))
      .sort((a, b) => b.misses - a.misses || b.due - a.due || a.key.localeCompare(b.key));
  };
  const reasonCounts = (items) => {
    const counts = {};
    items.filter((item) => item.s === "missed").forEach((item) => { counts[item.r] = (counts[item.r] || 0) + 1; });
    return counts;
  };
  // The repeat-miss rule: a task missed REPEAT_COUNT times or more in the REPEAT_DAYS days that end today (excluded
  // reasons do not count, "not recorded" does).
  const repeatMisses = (leaders, marks, today, excluded = EXCLUDED, nowMinute = null, count = REPEAT_COUNT, days = REPEAT_DAYS) => missesByTask(entries(leaders, marks, addDays(today, -(days - 1)), today, today, nowMinute), excluded)
    .filter((g) => g.misses >= count);

  // Minutes of standard work in an average working day: daily and per-shift tasks on every working day, a weekly task
  // once a week, a monthly task 12 times in 52 weeks; the minutes of a week over the working days of the week. The share
  // is those minutes over the length of the leader's day (the shift), against the guide of the level.
  const planned = (leader, shares = LEVEL_SHARE) => {
    const n = workdays(leader).length;
    let week = 0;
    (leader.tasks || []).forEach((t) => { week += t.freq === "daily" || t.freq === "shift" ? t.minutes * n : t.freq === "weekly" ? t.minutes : (t.minutes * 12) / 52; });
    const perDay = week / n;
    const dayMinutes = leader.hours * 60;
    return { perWeek: week, perDay, dayMinutes, share: dayMinutes > 0 ? perDay / dayMinutes : null, guide: Number.isFinite(shares?.[leader.level]) ? shares[leader.level] : null };
  };

  // Clean records (saved data and template files can be damaged; keep only what has the expected shape).
  const str = (value) => (typeof value === "string" ? value : "");
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const intIn = (value, min, max, fallback) => { const n = Math.round(Number(value)); return Number.isFinite(n) && n >= min && n <= max ? n : fallback; };
  const cleanTask = (raw, tools = null) => {
    if (!isObject(raw) || !str(raw.title).trim()) return null;
    const freq = FREQS.includes(raw.freq) ? raw.freq : "daily";
    const tool = str(raw.tool);
    return {
      id: str(raw.id).replace(/[^a-z0-9-]/gi, "").slice(0, 40) || `t${Math.random().toString(36).slice(2, 9)}`,
      title: str(raw.title).trim().slice(0, 160),
      freq,
      time: Number.isFinite(toMinutes(raw.time)) ? clock(toMinutes(raw.time)) : "08:00",
      offset: intIn(raw.offset, 0, 1440, 0),
      weekday: intIn(raw.weekday, 1, 7, 1),
      monthDay: intIn(raw.monthDay, 1, 31, 1),
      minutes: intIn(raw.minutes, 1, 600, 15),
      done: str(raw.done).trim().slice(0, 300),
      tool: !tools || tools.includes(tool) ? tool.slice(0, 40) : "",
      since: isIso(raw.since) ? raw.since : "",
    };
  };
  const cleanLeader = (raw, tools = null, today = "") => {
    if (!isObject(raw) || !str(raw.name).trim()) return null;
    const days = [...new Set((Array.isArray(raw.days) ? raw.days : []).map(Number).filter((d) => Number.isInteger(d) && d >= 1 && d <= 7))].sort();
    const hours = Number(raw.hours);
    const seen = new Set();
    return {
      id: str(raw.id).replace(/[^a-z0-9-]/gi, "").slice(0, 40) || `l${Math.random().toString(36).slice(2, 9)}`,
      name: str(raw.name).trim().slice(0, 80),
      level: LEVELS.includes(raw.level) ? raw.level : "team",
      area: str(raw.area).trim().slice(0, 80),
      shift: str(raw.shift).trim().slice(0, 40),
      start: Number.isFinite(toMinutes(raw.start)) ? clock(toMinutes(raw.start)) : "06:00",
      hours: hours >= 1 && hours <= 16 ? Math.round(hours * 4) / 4 : 8,
      days: days.length ? days : [1, 2, 3, 4, 5],
      reportsTo: str(raw.reportsTo).slice(0, 40),
      since: isIso(raw.since) ? raw.since : today,
      tasks: (Array.isArray(raw.tasks) ? raw.tasks : []).map((t) => cleanTask(t, tools)).filter((t) => t && !seen.has(t.id) && seen.add(t.id)).slice(0, 60),
    };
  };
  // A template of the data file for one leader: the at minutes after the shift start become a clock time for daily,
  // weekly and monthly tasks, and stay minutes after the start for per-shift tasks.
  const fromTemplate = (tpl, leader, since, idOf = (i) => `t${Date.now().toString(36)}${i}`) => (tpl?.tasks || []).map((t, i) => cleanTask({
    id: idOf(i), title: t.title, freq: t.freq, minutes: t.minutes, done: t.done, tool: t.tool, since,
    offset: t.freq === "shift" ? t.at : 0,
    time: clock(toMinutes(leader.start) + (Number(t.at) || 0)),
    weekday: t.freq === "weekly" ? t.day : 1,
    monthDay: t.freq === "monthly" ? t.day : 1,
  })).filter(Boolean);

  // The standard as a calendar file (iCalendar, RFC 5545), the same way as the 5S audit plan and the Action Tracker:
  // escaped text, lines folded at 75 bytes, a UID that stays the same, so importing again updates instead of doubling.
  // Times are floating (the phone's own time zone). Daily and per-shift tasks repeat weekly on the working days, a weekly
  // task on its (moved) weekday; a monthly task is one entry per date for the next months, because "the last day of a
  // shorter month, moved off a day off" has no RRULE.
  // Escaping and folding (75 octets of UTF-8) are the shared ones of ActionsStore, which the tool page loads first;
  // looked up when a file is written, so a page that only reads this tool's numbers does not need it.
  const icsText = (value) => window.ActionsStore.icsText(value);
  const fold = (line) => window.ActionsStore.icsFold(line);
  const BYDAY = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const stampAt = (date, minute) => `${addDays(date, Math.floor(minute / 1440)).replace(/-/g, "")}T${clock(minute).replace(":", "")}00`;
  const ics = (leader, { from, months = 12, stamp = new Date(), labels = {} } = {}) => {
    const dt = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stiven Catalyst//Leader Standard Work//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${icsText(labels.calendar || leader.name)}`];
    const days = workdays(leader);
    const open = { ...leader, since: "" };
    const event = (uid, date, minute, task, rule) => {
      lines.push("BEGIN:VEVENT", `UID:${uid}@stivencatalyst.com`, `DTSTAMP:${dt}`, `DTSTART:${stampAt(date, minute)}`, `DTEND:${stampAt(date, minute + task.minutes)}`);
      if (rule) lines.push(rule);
      lines.push(`SUMMARY:${icsText(task.title)}`);
      const description = [task.done ? `${labels.done || "Done when"}: ${task.done}` : "", task.tool && labels.tool ? `${labels.toolLabel || "Tool"}: ${labels.tool(task.tool)}` : "", `${leader.name}${leader.area ? ` · ${leader.area}` : ""}`].filter(Boolean).join("\n");
      lines.push(`DESCRIPTION:${icsText(description)}`, "END:VEVENT");
    };
    (leader.tasks || []).forEach((task) => {
      const only = { ...open, tasks: [{ ...task, since: "" }] };
      if (task.freq === "monthly") {
        const until = addDays(monthDate(Number(from.slice(0, 4)) + Math.floor((Number(from.slice(5, 7)) - 1 + months) / 12), ((Number(from.slice(5, 7)) - 1 + months) % 12) + 1, 1), -1);
        schedule(only, from, until).forEach((occ) => event(`lsw-${leader.id}-${task.id}-${occ.date.replace(/-/g, "")}`, occ.date, occ.minute, task, ""));
        return;
      }
      const first = schedule(only, from, addDays(from, 13))[0];
      if (!first) return;
      const shift = Math.floor(first.minute / 1440);
      const byday = (task.freq === "weekly" ? [weekday(first.date)] : days).map((d) => BYDAY[(d - 1 + shift) % 7]);
      event(`lsw-${leader.id}-${task.id}`, first.date, first.minute, task, `RRULE:FREQ=WEEKLY;BYDAY=${byday.join(",")}`);
    });
    lines.push("END:VCALENDAR");
    return `${lines.map(fold).join("\r\n")}\r\n`;
  };

  // The example: a seeded random walk through the weeks of a warehouse, so every visitor sees the same numbers. It starts
  // on the Monday two weeks before this one and runs to now: today's tasks before the current minute are marked, the
  // rest of today is still open.
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
  const exampleData = (spec, templates, today, nowMinute) => {
    const rand = random(spec.seed);
    const monday = mondayOf(today);
    const first = addDays(monday, -7 * (spec.weeks - 1));
    const leaders = spec.leaders.map((l) => {
      const leader = cleanLeader({ id: `ex-${l.key}`, name: l.name, level: l.level, area: l.area, shift: l.shift, start: l.start, hours: l.hours, days: l.days, reportsTo: l.reportsTo ? `ex-${l.reportsTo}` : "", since: first, tasks: [] });
      leader.tasks = fromTemplate(templates[l.template], leader, first, (i) => `t${i + 1}`);
      return leader;
    });
    const marks = {};
    spec.leaders.forEach((l, index) => {
      const leader = leaders[index];
      const weights = Object.entries(l.reasons || {});
      const total = weights.reduce((sum, [, w]) => sum + w, 0);
      const reasonOf = (x) => { let rest = x * total; for (const [key, w] of weights) { rest -= w; if (rest < 0) return key; } return weights[0][0]; };
      const absent = new Set((l.absent || []).map((a) => addDays(monday, 7 * a.week + a.day - 1)));
      schedule(leader, first, today).forEach((occ) => {
        const [x, y, z] = [rand(), rand(), rand()];
        if (occ.date === today && occ.minute > nowMinute) return;
        if (absent.has(occ.date)) { marks[occ.key] = { s: "missed", r: "absent" }; return; }
        if (occ.date < today && x < l.unrecorded) return;
        if (z < spec.na) { marks[occ.key] = { s: "na" }; return; }
        const factor = spec.week[Math.floor(daysBetween(first, occ.date) / 7)] ?? 1;
        const taskIndex = leader.tasks.findIndex((t) => t.id === occ.taskId);
        const recurring = (l.recurring || []).find((r) => r.task === taskIndex);
        if (recurring && y < recurring.rate) marks[occ.key] = { s: "missed", r: recurring.reason };
        else if (y < l.miss * factor) marks[occ.key] = { s: "missed", r: reasonOf((z - spec.na) / (1 - spec.na)) };
        else marks[occ.key] = { s: "done" };
      });
    });
    const reviews = {};
    (spec.reviews || []).forEach((r) => { reviews[`ex-${r.leader}|${addDays(monday, 7 * r.week)}`] = r.note; });
    return { leaders, marks, reviews, current: `ex-${spec.current}`, from: first };
  };

  window.LeaderStandardWorkMath = { LEVEL_SHARE, LEVELS, FREQS, STATUSES, REPEAT_COUNT, REPEAT_DAYS, UNRECORDED, EXCLUDED, isIso, addDays, weekday, mondayOf, daysBetween, lastDayOfMonth, monthDate, toMinutes, clock, workdays, nextWorkingDay, minuteOf, shiftDay, nominalDates, schedule, dueOn, statusOf, tally, isMiss, entries, byWeek, missesByTask, reasonCounts, repeatMisses, planned, cleanTask, cleanLeader, fromTemplate, icsText, fold, ics, random, exampleData };

  const dataEl = document.getElementById("leader-standard-work-data");
  const root = document.querySelector("[data-leader-standard-work]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, dayMonth, lower, copy, write, loadState, el, int, today, flash, undoNote, panel, stat, barList, focusCard, resultActions, resultLayout, firstVisit, downloadCsv, downloadXlsx, keepFocus, trackerLink } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const Workplace = window.Workplace;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = "leader-standard-work";
  const TOOL_KEYS = cfg.tools.map((t) => t.key);
  const excluded = cfg.reasons.filter((r) => r.excluded).map((r) => r.key);
  const levelName = (key) => cfg.levels.find((l) => l.key === key)?.name || key;
  const freqName = (key) => cfg.frequencies.find((f) => f.key === key)?.short || key;
  const toolName = (key) => cfg.tools.find((t) => t.key === key)?.name || "";
  const toolUrl = (key) => new URL(`../${key}/`, window.location.href).href;
  const reasonName = (key) => (key === UNRECORDED ? tx("Not recorded") : cfg.reasons.find((r) => r.key === key)?.name || key);
  const adviceOf = (key) => (key === UNRECORDED ? cfg.unrecorded : cfg.reasons.find((r) => r.key === key) || null);
  const dayLong = (iso) => cfg.weekdays.long[weekday(iso) - 1];
  const dayShort = (n) => cfg.weekdays.short[n - 1];
  const nowMinute = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
  const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const pctOrDash = (value, digits = 0) => (value === null || value === undefined ? "–" : pct(value, digits));
  const hoursText = (hours) => num(hours, hours % 1 ? (hours % 0.5 ? 2 : 1) : 0);
  // The marks of every leader, read on this device's clock (a night shift after midnight is still yesterday's).
  const entriesNow = (leaders, from, to) => entries(leaders, state.marks, from, to, today(), nowMinute());

  // State: the leaders with their standard (tasks), the marks of each due task (key leader|task|date → { s, r }), the
  // reviewer's notes per leader and week, the chosen leader, the period and view of the results, the guide shares.
  const state = loadState(KEY, { leaders: [], marks: {}, reviews: {}, current: "", period: "4", filter: "", view: "results", reviewWeek: "", reviewer: "", shares: { ...LEVEL_SHARE }, example: {} });
  const cleanAll = () => {
    const seen = new Set();
    state.leaders = state.leaders.map((l) => cleanLeader(l, TOOL_KEYS, today())).filter((l) => l && !seen.has(l.id) && seen.add(l.id)).slice(0, 80);
    state.marks = Object.fromEntries(Object.entries(isObject(state.marks) ? state.marks : {}).filter(([key, m]) => /^[a-z0-9-]+\|[a-z0-9-]+\|\d{4}-\d{2}-\d{2}$/i.test(key) && isObject(m) && STATUSES.includes(m.s))
      .map(([key, m]) => [key, m.s === "missed" ? { s: "missed", r: cfg.reasons.some((r) => r.key === m.r) ? m.r : cfg.reasons[0].key } : { s: m.s }]));
    state.reviews = Object.fromEntries(Object.entries(isObject(state.reviews) ? state.reviews : {}).filter(([key, note]) => /\|\d{4}-\d{2}-\d{2}$/.test(key) && typeof note === "string").map(([key, note]) => [key, note.slice(0, 1000)]));
    LEVELS.forEach((level) => { const v = Number(state.shares[level]); state.shares[level] = v > 0 && v <= 1 ? v : LEVEL_SHARE[level]; });
    if (!["1", "2", "4", "12"].includes(state.period)) state.period = "4";
    if (!["results", "review"].includes(state.view)) state.view = "results";
  };
  cleanAll();
  const isExample = () => isObject(state.example) && state.example.on === true;
  const save = () => write(KEY, state);
  const leaderOf = (id) => state.leaders.find((l) => l.id === id) || null;
  const current = () => leaderOf(state.current) || state.leaders[0] || null;
  const taskOf = (leader, id) => leader?.tasks.find((t) => t.id === id) || null;
  const timeText = (minute) => `${clock(minute)}${minute >= 1440 ? " (+1)" : ""}`;
  const leaderLabel = (l) => [l.name, levelName(l.level), l.area].filter(Boolean).join(" · ");
  const shiftText = (l) => `${l.shift ? `${l.shift} ` : ""}${l.start}–${clock(toMinutes(l.start) + l.hours * 60)}`;
  const daysText = (l) => {
    const d = workdays(l);
    const run = d.length > 2 && d.every((v, i) => i === 0 || v === d[i - 1] + 1);
    return run ? `${dayShort(d[0])}–${dayShort(d.at(-1))}` : d.map(dayShort).join(", ");
  };
  const whenText = (leader, task) => {
    const minute = minuteOf(leader, task);
    if (task.freq === "shift") return tx("{time} (start + {n} min)", { time: timeText(minute), n: int.format(task.offset) });
    if (task.freq === "weekly") return `${cfg.weekdays.long[task.weekday - 1]} ${timeText(minute)}`;
    if (task.freq === "monthly") return tx("Day {n}, {time}", { n: task.monthDay, time: timeText(minute) });
    return timeText(minute);
  };

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const leaderSelect = q("#lw-leader");
  const leaderStatus = q("[data-leader-status]");
  const leaderForm = q("[data-leader-form]");
  const leaderFormTitle = q("[data-leader-form-title]");
  const field = (id) => q(`#${id}`);
  const dayBoxes = [...root.querySelectorAll("input[name='lw-days']")];
  const reportsSelect = field("lw-reports");
  const shareInputs = LEVELS.map((level) => field(`lw-share-${level}`));
  const templateSelect = field("lw-template");
  const plannedNote = q("[data-planned]");
  const tasksBody = q("[data-tasks]");
  const tasksWrap = q("[data-tasks-wrap]");
  const tasksEmpty = q("[data-tasks-empty]");
  const taskForm = q("[data-task-form]");
  const taskFormTitle = q("[data-task-form-title]");
  const taskSave = q("[data-task-save]");
  const taskStatus = q("[data-task-status]");
  const dayInput = field("lw-day");
  const dayHead = q("[data-day-head]");
  const dayProgress = q("[data-day-progress]");
  const dayList = q("[data-day-list]");
  const logCount = q("[data-log-count]");
  const logEmpty = q("[data-log-empty]");
  const logStatus = q("[data-log-status]");
  const periodSelect = field("lw-period");
  const filterSelect = field("lw-filter");
  let day = "";
  let editingLeader = "";
  let editingTask = "";

  // The example note above the results: what it is, and one tap to clear it.
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExampleButton = el("button", "button-ghost", tx("Clear the example"));
  clearExampleButton.type = "button";
  note.append(el("strong", null, tx("Example")), " ", el("span", null, cfg.text.exampleNote), " ", clearExampleButton);
  note.hidden = true;
  results.before(note);
  const dropExample = () => {
    const ids = new Set(state.leaders.filter((l) => l.id.startsWith("ex-")).map((l) => l.id));
    state.leaders = state.leaders.filter((l) => !ids.has(l.id));
    Object.keys(state.marks).forEach((key) => { if (ids.has(key.split("|")[0])) delete state.marks[key]; });
    Object.keys(state.reviews).forEach((key) => { if (ids.has(key.split("|")[0])) delete state.reviews[key]; });
    state.example = {};
    if (!leaderOf(state.current)) state.current = state.leaders[0]?.id || "";
    if (!leaderOf(state.filter)) state.filter = "";
    if (!leaderOf(state.reviewer)) state.reviewer = "";
  };
  const loadExample = () => {
    dropExample();
    const ex = exampleData(cfg.example, cfg.templates, today(), nowMinute());
    state.leaders = [...ex.leaders, ...state.leaders];
    Object.assign(state.marks, ex.marks);
    Object.assign(state.reviews, ex.reviews);
    state.current = ex.current;
    state.filter = "";
    state.reviewer = "";
    state.reviewWeek = "";
    state.period = "4";
    state.example = { on: true };
    day = "";
  };
  clearExampleButton.addEventListener("click", () => { dropExample(); changed(); });

  // 1 · Leaders.
  const fillDatalist = (id, values) => { const list = q(`#${id}`); if (list) list.replaceChildren(...[...new Set(values.filter(Boolean))].map((value) => el("option", null, value))); };
  const renderLeaders = () => {
    const leader = current();
    leaderSelect.replaceChildren(...state.leaders.map((l) => { const option = el("option", null, leaderLabel(l)); option.value = l.id; return option; }));
    if (!state.leaders.length) { const option = el("option", null, tx("No leader yet")); option.value = ""; leaderSelect.append(option); }
    leaderSelect.value = leader?.id || "";
    leaderSelect.disabled = !state.leaders.length;
    q("[data-leader-edit]").disabled = !leader;
    q("[data-leader-remove]").disabled = !leader;
    leaderStatus.textContent = leader ? `${shiftText(leader)} · ${daysText(leader)} · ${hoursText(leader.hours)} h${leader.reportsTo && leaderOf(leader.reportsTo) ? ` · ${tx("reports to {name}", { name: leaderOf(leader.reportsTo).name })}` : ""}` : tx("Add the first leader: name, level and shift.");
    const workplace = Workplace ? Workplace.get() : null;
    fillDatalist("lw-area-list", [...(workplace ? workplace.areas.map((a) => a.name) : []), ...state.leaders.map((l) => l.area)]);
    fillDatalist("lw-shift-list", [...(workplace ? workplace.shifts : []), ...state.leaders.map((l) => l.shift)]);
    shareInputs.forEach((input, i) => { if (document.activeElement !== input) input.value = String(Math.round(state.shares[LEVELS[i]] * 100)); });
  };
  const openLeaderForm = (leader) => {
    editingLeader = leader ? leader.id : "";
    leaderFormTitle.textContent = leader ? tx("Edit {name}", { name: leader.name }) : tx("New leader");
    const profile = Workplace ? Workplace.get() : null;
    field("lw-name").value = leader?.name || "";
    field("lw-level").value = leader?.level || "team";
    field("lw-area").value = leader?.area ?? (profile?.areas[0]?.name || "");
    field("lw-shift").value = leader?.shift ?? (profile?.shifts[0] || "");
    field("lw-start").value = leader?.start || "06:00";
    field("lw-hours").value = String(leader?.hours ?? 8);
    const days = leader ? workdays(leader) : [1, 2, 3, 4, 5];
    dayBoxes.forEach((box) => { box.checked = days.includes(Number(box.value)); });
    reportsSelect.replaceChildren(el("option", null, tx("Nobody")), ...state.leaders.filter((l) => l.id !== editingLeader).map((l) => { const o = el("option", null, leaderLabel(l)); o.value = l.id; return o; }));
    reportsSelect.firstChild.value = "";
    reportsSelect.value = leader?.reportsTo && leaderOf(leader.reportsTo) ? leader.reportsTo : "";
    leaderForm.hidden = false;
    field("lw-name").focus();
  };
  q("[data-leader-new]").addEventListener("click", () => openLeaderForm(null));
  q("[data-leader-edit]").addEventListener("click", () => openLeaderForm(current()));
  q("[data-leader-cancel]").addEventListener("click", () => { leaderForm.hidden = true; editingLeader = ""; q("[data-leader-new]").focus(); });
  q("[data-leader-save]").addEventListener("click", () => {
    const name = field("lw-name").value.trim();
    if (!name) { flash(leaderStatus, tx("Give the leader a name.")); field("lw-name").focus(); return; }
    const days = dayBoxes.filter((box) => box.checked).map((box) => Number(box.value));
    if (!days.length) { flash(leaderStatus, tx("Tick at least one working day.")); dayBoxes[0].focus(); return; }
    const old = leaderOf(editingLeader);
    // A leader of one's own replaces the example, so the visitor's own work is never mixed into it.
    if (!old && isExample()) dropExample();
    const leader = cleanLeader({
      ...(old || {}), id: old ? old.id : newId("l"), name, level: field("lw-level").value, area: field("lw-area").value, shift: field("lw-shift").value,
      start: field("lw-start").value, hours: field("lw-hours").value, days, reportsTo: reportsSelect.value, since: old ? old.since : today(), tasks: old ? old.tasks : [],
    }, TOOL_KEYS, today());
    if (old) state.leaders[state.leaders.indexOf(old)] = leader; else state.leaders.push(leader);
    state.current = leader.id;
    if (!old) chooseTemplateFor(leader);
    leaderForm.hidden = true;
    editingLeader = "";
    day = "";
    changed();
    flash(leaderStatus, old ? tx("Saved: {name}.", { name: leader.name }) : tx("Added: {name}. Now give them a standard: start from a template below.", { name: leader.name }));
  });
  q("[data-leader-remove]").addEventListener("click", () => {
    const leader = current();
    if (!leader || !window.confirm(tx("Remove {name} with their standard, their check-offs and the review notes?", { name: leader.name }))) return;
    state.leaders = state.leaders.filter((l) => l.id !== leader.id);
    state.leaders.forEach((l) => { if (l.reportsTo === leader.id) l.reportsTo = ""; });
    Object.keys(state.marks).forEach((key) => { if (key.startsWith(`${leader.id}|`)) delete state.marks[key]; });
    Object.keys(state.reviews).forEach((key) => { if (key.startsWith(`${leader.id}|`)) delete state.reviews[key]; });
    if (!state.leaders.some((l) => l.id.startsWith("ex-"))) state.example = {};
    state.current = state.leaders[0]?.id || "";
    if (state.filter === leader.id) state.filter = "";
    if (state.reviewer === leader.id) state.reviewer = "";
    day = "";
    changed();
  });
  leaderSelect.addEventListener("change", () => { state.current = leaderSelect.value; day = ""; editingTask = ""; taskForm.hidden = true; save(); render(); });
  shareInputs.forEach((input, i) => input.addEventListener("change", () => {
    const value = Number(String(input.value).replace(",", "."));
    if (value > 0 && value <= 100) state.shares[LEVELS[i]] = value / 100;
    input.value = String(Math.round(state.shares[LEVELS[i]] * 100));
    save();
    renderStandard();
    renderResults();
  }));
  q("[data-shares-reset]").addEventListener("click", () => { state.shares = { ...LEVEL_SHARE }; save(); render(); });

  // 2 · The standard of the chosen leader.
  const chooseTemplateFor = (leader) => {
    const sector = templateSelect.value ? (cfg.templates[templateSelect.value]?.sector || "warehouse") : "warehouse";
    const key = Object.keys(cfg.templates).find((k) => cfg.templates[k].sector === sector && cfg.templates[k].level === leader.level);
    if (key) templateSelect.value = key;
  };
  const plannedText = (leader) => {
    const p = planned(leader, state.shares);
    if (!leader.tasks.length) return tx("No tasks yet. Start from a template or add the first task.");
    const share = pctOrDash(p.share);
    const guide = p.guide === null ? "–" : pct(p.guide, 0);
    const verdict = p.share === null ? "" : p.share > 1 ? tx("More standard work than the shift has.") : p.share > p.guide + 0.15 ? tx("Well above the guide: little room for the unexpected.") : p.share < p.guide - 0.15 ? tx("Well below the guide: add the routine checks of this level.") : tx("Close to the guide.");
    return `${tx("Planned: {min} min of standard work per working day, {share} of a day of {hours} hours. Guide for a {level}: about {guide}.", { min: int.format(Math.round(p.perDay)), share, hours: hoursText(leader.hours), level: lower(levelName(leader.level)), guide })} ${verdict}`;
  };
  const sortedTasks = (leader) => [...leader.tasks].sort((a, b) => FREQS.indexOf(a.freq === "shift" ? "daily" : a.freq) - FREQS.indexOf(b.freq === "shift" ? "daily" : b.freq)
    || (a.freq === "weekly" ? a.weekday - b.weekday : a.freq === "monthly" ? a.monthDay - b.monthDay : 0) || minuteOf(leader, a) - minuteOf(leader, b));
  const renderStandard = () => {
    const leader = current();
    root.querySelectorAll("[data-needs-leader]").forEach((node) => { node.disabled = !leader; });
    tasksBody.replaceChildren();
    if (!leader) {
      plannedNote.textContent = tx("Add a leader first.");
      tasksWrap.hidden = true;
      tasksEmpty.hidden = false;
      return;
    }
    plannedNote.textContent = plannedText(leader);
    sortedTasks(leader).forEach((task) => {
      const tr = el("tr");
      const what = el("td");
      what.append(el("strong", null, task.title));
      if (task.done) what.append(el("span", "lw-done-means", `${tx("Done when")}: ${task.done}`));
      const tool = el("td");
      if (task.tool) { const a = el("a", "inline-link", toolName(task.tool)); a.href = toolUrl(task.tool); tool.append(a); }
      const tools = el("td", "lw-row-tools");
      const edit = el("button", "button-ghost lw-row-edit", tx("Edit"));
      edit.type = "button";
      edit.dataset.editTask = task.id;
      edit.setAttribute("aria-label", tx("Edit the task {task}", { task: task.title }));
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeTask = task.id;
      remove.setAttribute("aria-label", tx("Remove the task {task}", { task: task.title }));
      tools.append(edit, remove);
      tr.append(el("td", "lw-when", whenText(leader, task)), what, el("td", null, freqName(task.freq)), el("td", "num", int.format(task.minutes)), tool, tools);
      tasksBody.append(tr);
    });
    tasksWrap.hidden = !leader.tasks.length;
    tasksEmpty.hidden = leader.tasks.length > 0;
  };
  const syncTaskFields = () => {
    const freq = field("lw-task-freq").value;
    root.querySelectorAll("[data-for-freq]").forEach((node) => { node.hidden = !node.dataset.forFreq.split(" ").includes(freq); });
  };
  const openTaskForm = (task) => {
    const leader = current();
    if (!leader) return;
    editingTask = task ? task.id : "";
    taskFormTitle.textContent = task ? tx("Edit the task") : tx("Add a task");
    taskSave.textContent = task ? tx("Save the task") : tx("Add the task");
    field("lw-task-title").value = task?.title || "";
    field("lw-task-freq").value = task?.freq || "shift";
    field("lw-task-time").value = task?.time || clock(toMinutes(leader.start) + 60);
    field("lw-task-offset").value = String(task?.offset ?? 30);
    field("lw-task-weekday").value = String(task?.weekday || workdays(leader)[0]);
    field("lw-task-day").value = String(task?.monthDay || 1);
    field("lw-task-minutes").value = String(task?.minutes || 15);
    field("lw-task-tool").value = task?.tool || "";
    field("lw-task-done").value = task?.done || "";
    syncTaskFields();
    taskForm.hidden = false;
    field("lw-task-title").focus();
  };
  field("lw-task-freq").addEventListener("change", syncTaskFields);
  q("[data-task-new]").addEventListener("click", () => openTaskForm(null));
  q("[data-task-cancel]").addEventListener("click", () => { taskForm.hidden = true; editingTask = ""; q("[data-task-new]").focus(); });
  taskSave.addEventListener("click", () => {
    const leader = current();
    if (!leader) return;
    const title = field("lw-task-title").value.trim();
    if (!title) { flash(taskStatus, tx("Name the task.")); field("lw-task-title").focus(); return; }
    const freq = field("lw-task-freq").value;
    if (freq !== "shift" && !Number.isFinite(toMinutes(field("lw-task-time").value))) { flash(taskStatus, tx("Give the time as hh:mm.")); field("lw-task-time").focus(); return; }
    const old = taskOf(leader, editingTask);
    const task = cleanTask({
      id: old ? old.id : newId("t"), title, freq, time: field("lw-task-time").value, offset: field("lw-task-offset").value, weekday: field("lw-task-weekday").value,
      monthDay: field("lw-task-day").value, minutes: field("lw-task-minutes").value, tool: field("lw-task-tool").value, done: field("lw-task-done").value, since: old ? old.since : today(),
    }, TOOL_KEYS);
    if (old) leader.tasks[leader.tasks.indexOf(old)] = task; else leader.tasks.push(task);
    taskForm.hidden = true;
    editingTask = "";
    changed();
    flash(taskStatus, old ? tx("Saved: {task}.", { task: task.title }) : tx("Added: {task}.", { task: task.title }));
    q("[data-task-new]").focus();
  });
  tasksBody.addEventListener("click", (event) => {
    const leader = current();
    const edit = event.target.closest("[data-edit-task]");
    if (edit) { openTaskForm(taskOf(leader, edit.dataset.editTask)); return; }
    const remove = event.target.closest("[data-remove-task]");
    if (!remove || !leader) return;
    const index = leader.tasks.findIndex((t) => t.id === remove.dataset.removeTask);
    if (index < 0) return;
    const [removed] = leader.tasks.splice(index, 1);
    changed();
    q("[data-task-new]").focus();
    undoNote(taskStatus, tx("Removed: {task}.", { task: removed.title }), () => { leader.tasks.splice(Math.min(index, leader.tasks.length), 0, removed); changed(); });
  });
  q("[data-template-apply]").addEventListener("click", () => {
    const leader = current();
    const tpl = cfg.templates[templateSelect.value];
    if (!leader || !tpl) return;
    if (leader.tasks.length && !window.confirm(tx("Replace the {n} tasks of {name} with the template “{template}”?", { n: leader.tasks.length, name: leader.name, template: tpl.name }))) return;
    leader.tasks = fromTemplate(tpl, leader, today());
    changed();
    flash(taskStatus, tx("{n} tasks from “{template}”. Change the times and the words to your own day.", { n: leader.tasks.length, template: tpl.name }));
  });

  // The standard as a template file (js/template-pack.js): saved from one leader, opened for the chosen one.
  const cleanStandard = (raw) => {
    if (!isObject(raw) || !Array.isArray(raw.tasks)) return null;
    const tasks = raw.tasks.map((t) => cleanTask(t, TOOL_KEYS)).filter(Boolean);
    return tasks.length ? { name: str(raw.name).slice(0, 80), level: LEVELS.includes(raw.level) ? raw.level : "team", start: Number.isFinite(toMinutes(raw.start)) ? raw.start : "06:00", hours: Number(raw.hours) >= 1 && Number(raw.hours) <= 16 ? Number(raw.hours) : 8, tasks } : null;
  };
  let pack = null;
  const packHost = q("[data-template-pack]");
  if (window.TemplatePack && packHost) {
    pack = window.TemplatePack.ui(packHost, {
      tool: TOOL, kind: "leader-standard", validate: cleanStandard,
      name: () => { const l = current(); return l ? `${levelName(l.level)} ${l.area || l.name}` : ""; },
      data: () => { const l = current(); return l && l.tasks.length ? { name: `${levelName(l.level)}${l.area ? ` · ${l.area}` : ""}`, level: l.level, start: l.start, hours: l.hours, tasks: l.tasks.map(({ since, ...task }) => task) } : null; },
      onOpen: (result) => {
        const std = result.data;
        let leader = current();
        if (!leader || isExample()) {
          if (isExample()) dropExample();
          leader = cleanLeader({ id: newId("l"), name: std.name || tx("New leader"), level: std.level, start: std.start, hours: std.hours, since: today(), tasks: [] }, TOOL_KEYS, today());
          state.leaders.push(leader);
          state.current = leader.id;
        } else if (leader.tasks.length && !window.confirm(tx("Replace the {n} tasks of {name} with the standard from the file?", { n: leader.tasks.length, name: leader.name }))) return false;
        // The file's times are kept; new ids, so marks of the old tasks never attach to the new ones.
        leader.tasks = std.tasks.map((t, i) => ({ ...t, id: `t${Date.now().toString(36)}${i}`, since: today() }));
        changed();
        return tx("Opened: {n} tasks for {name}.", { n: leader.tasks.length, name: leader.name });
      },
    });
  }

  // Printing: the standard as a card to carry (A4, the leader's day as a checklist with a box per working day), the week
  // sheet of a leader, and the review of a week. The rest of the page is hidden while it prints.
  const printOnly = (build) => {
    printBox.replaceChildren(...build());
    printBox.hidden = false;
    document.documentElement.classList.add("lw-printing");
    const done = () => {
      document.documentElement.classList.remove("lw-printing");
      printBox.hidden = true;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the page back a moment later.
    setTimeout(done, 2000);
  };
  const BOX = "☐";
  const th = (text, className) => { const cell = el("th", className, text); cell.scope = "col"; return cell; };
  const printHead = (leader, title) => {
    const head = el("div", "lw-print-head");
    head.append(el("p", "kicker", cfg.text.tool), el("h2", null, title));
    head.append(el("p", "lw-print-meta", [levelName(leader.level), leader.area, shiftText(leader), daysText(leader)].filter(Boolean).join(" · ")));
    return head;
  };
  // On paper the clock time is enough; the minutes after the start are in the standard on the page.
  const printWhen = (leader, task) => (task.freq === "daily" || task.freq === "shift" ? timeText(minuteOf(leader, task)) : whenText(leader, task));
  const card = (leader) => {
    const out = [printHead(leader, leader.name), el("p", "lw-print-meta", plannedText(leader))];
    const days = workdays(leader);
    // The card: when, the task with what done means and its tool, the minutes, and a box per day (or week).
    const table = (list, extra) => {
      const t = el("table", "lw-print-table lw-card-table");
      const head = el("tr");
      head.append(th(tx("When"), "lw-when"), th(tx("Task")), th(tx("min"), "num"), ...extra.map((name) => th(name, "lw-box")));
      t.append(el("thead"));
      t.tHead.append(head);
      const body = el("tbody");
      list.forEach((task) => {
        const tr = el("tr");
        const what = el("td");
        what.append(el("strong", null, task.title));
        if (task.done) what.append(el("span", "lw-print-done", `${tx("Done when")}: ${task.done}`));
        if (task.tool) what.append(el("span", "lw-print-done", `${tx("Tool")}: ${toolName(task.tool)}`));
        tr.append(el("td", "lw-when", printWhen(leader, task)), what, el("td", "num", int.format(task.minutes)), ...extra.map(() => el("td", "lw-box", BOX)));
        body.append(tr);
      });
      t.append(body);
      return t;
    };
    const sorted = sortedTasks(leader);
    const daily = sorted.filter((t) => t.freq === "daily" || t.freq === "shift");
    const weekly = sorted.filter((t) => t.freq === "weekly");
    const monthly = sorted.filter((t) => t.freq === "monthly");
    if (daily.length) out.push(el("h3", null, tx("Every working day")), table(daily, days.map(dayShort)));
    if (weekly.length) out.push(el("h3", null, tx("Every week")), table(weekly, [tx("Week 1"), tx("Week 2"), tx("Week 3"), tx("Week 4")]));
    if (monthly.length) out.push(el("h3", null, tx("Every month")), table(monthly, [tx("Done")]));
    out.push(el("p", "lw-print-foot", `${tx("Missed? Write the reason")}: ${cfg.reasons.map((r) => r.name).join(" · ")}. ${tx("Day 29 to 31 falls on the last day of a shorter month; a weekly or monthly task on a day off moves to the next working day.")}`));
    out.push(el("p", "lw-print-sign", `${tx("Leader")}: ____________________   ${tx("Reviewed by")}: ____________________   ${tx("Date")}: __________`));
    return out;
  };
  const markSymbol = (item) => (item.s === "done" ? "✓" : item.s === "na" ? "–" : item.s === "open" ? BOX : `✗ ${reasonName(item.r)}`);
  const weekSheet = (leader, monday) => {
    const sunday = addDays(monday, 6);
    const now = today();
    const items = entriesNow([leader], monday, sunday);
    const t = tally(items.filter((i) => i.date <= now), excluded);
    const out = [printHead(leader, `${leader.name} · ${tx("Week of {date}", { date: showDate(monday) })}`)];
    out.push(el("p", "lw-print-meta", `${tx("Adherence")}: ${pctOrDash(t.adherence)} (${tx("{a} of {b} due tasks done", { a: int.format(t.done), b: int.format(t.due) })})`));
    const dates = Array.from({ length: 7 }, (_, i) => addDays(monday, i)).filter((d) => workdays(leader).includes(weekday(d)) || items.some((i) => i.date === d));
    const table = el("table", "lw-print-table lw-week-table");
    const head = el("tr");
    head.append(th(tx("When"), "lw-when"), th(tx("Task")), ...dates.map((d) => th(`${dayShort(weekday(d))} ${dateLabel(d)}`, "lw-box")));
    table.append(el("thead"));
    table.tHead.append(head);
    const body = el("tbody");
    sortedTasks(leader).forEach((task) => {
      const tr = el("tr");
      tr.append(el("td", "lw-when", printWhen(leader, task)), el("td", null, task.title));
      dates.forEach((d) => { const item = items.find((i) => i.taskId === task.id && i.date === d); tr.append(el("td", "lw-box", item ? markSymbol(item) : "")); });
      body.append(tr);
    });
    table.append(body);
    out.push(table);
    const reviewNote = state.reviews[`${leader.id}|${monday}`];
    out.push(el("p", "lw-print-foot", `${tx("Review note")}: ${reviewNote || "______________________________________________"}`));
    out.push(el("p", "lw-print-sign", `${tx("Leader")}: ____________________   ${tx("Reviewed by")}: ____________________`));
    return out;
  };
  q("[data-print-card]").addEventListener("click", () => { const l = current(); if (l && l.tasks.length) printOnly(() => card(l)); else flash(taskStatus, tx("Give the leader a standard first.")); });
  q("[data-print-week]").addEventListener("click", () => { const l = current(); if (l) printOnly(() => weekSheet(l, mondayOf(day || today()))); });
  q("[data-ics]").addEventListener("click", () => {
    const leader = current();
    if (!leader || !leader.tasks.length) { flash(taskStatus, tx("Give the leader a standard first.")); return; }
    const text = ics(leader, { from: today(), labels: { calendar: `${cfg.text.tool} · ${leader.name}`, done: tx("Done when"), toolLabel: tx("Tool"), tool: toolName } });
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/calendar;charset=utf-8" }));
    link.download = `${cfg.text.icsName}-${window.TemplatePack ? window.TemplatePack.slug(leader.name) : "leader"}-${today()}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    flash(taskStatus, tx("Calendar file saved: open it on the phone to add the standard to the calendar."));
  });

  // 3 · Check off the day: the due tasks of the chosen leader in time order, each done, missed with a reason, or not due.
  const renderDay = () => {
    const leader = current();
    dayList.replaceChildren();
    if (!leader) { dayHead.textContent = tx("Add a leader first."); dayProgress.textContent = ""; return; }
    if (!day) day = shiftDay(leader, today(), nowMinute());
    dayInput.value = day;
    dayInput.max = today();
    const items = entriesNow([leader], day, day);
    dayHead.textContent = `${dayLong(day)}, ${showDate(day)} · ${leader.name} · ${shiftText(leader)}`;
    if (!items.length) {
      dayProgress.textContent = day < leader.since ? tx("The standard of {name} starts on {date}: nothing is due before.", { name: leader.name, date: showDate(leader.since) })
        : leader.tasks.length ? tx("Nothing is due on this day: not a working day of {name}.", { name: leader.name }) : tx("No standard yet. Start from a template above.");
      return;
    }
    const t = tally(items, excluded);
    dayProgress.textContent = `${tx("{a} of {b} tasks done", { a: int.format(t.done), b: int.format(items.length) })}${t.missed ? ` · ${tx("{n} missed", { n: int.format(t.missed) })}` : ""}${t.open ? ` · ${tx("{n} open", { n: int.format(t.open) })}` : ""}${t.excluded + t.na ? ` · ${tx("{n} not counted", { n: int.format(t.excluded + t.na) })}` : ""}`;
    items.forEach((item, index) => {
      const task = taskOf(leader, item.taskId);
      const li = el("li", "lw-item");
      li.dataset.state = item.s;
      const mark = state.marks[item.key];
      const time = el("span", "lw-item-time", timeText(item.minute));
      const body = el("div", "lw-item-body");
      const title = el("p", "lw-item-title");
      title.append(el("strong", null, task.title), el("span", "lw-item-meta", ` · ${freqName(task.freq)} · ${int.format(task.minutes)} ${tx("min")}`));
      body.append(title);
      if (task.done) body.append(el("p", "lw-done-means", `${tx("Done when")}: ${task.done}`));
      if (task.tool) { const a = el("a", "inline-link lw-item-tool", tx("Open {tool}", { tool: toolName(task.tool) })); a.href = toolUrl(task.tool); body.append(a); }
      if (!mark && item.s === "missed") body.append(el("span", "dl-tag lw-unrecorded", tx("not recorded")));
      const buttons = el("div", "lw-marks");
      buttons.setAttribute("role", "group");
      buttons.setAttribute("aria-label", task.title);
      [["done", `✓ ${tx("Done")}`], ["missed", `✗ ${tx("Missed")}`], ["na", `– ${tx("Not due")}`]].forEach(([s, label]) => {
        const b = el("button", `lw-mark is-${s}`, label);
        b.type = "button";
        b.dataset.mark = s;
        b.dataset.key = item.key;
        b.dataset.focusKey = `mark:${item.key}:${s}`;
        b.setAttribute("aria-pressed", String(mark?.s === s));
        buttons.append(b);
      });
      li.append(time, body, buttons);
      if (mark?.s === "missed") {
        const wrap = el("div", "lw-reason");
        const id = `lw-reason-${index}`;
        const label = el("label", null, tx("Reason"));
        label.htmlFor = id;
        const select = el("select");
        select.id = id;
        select.dataset.reasonKey = item.key;
        select.dataset.focusKey = `reason:${item.key}`;
        cfg.reasons.forEach((r) => { const o = el("option", null, r.excluded ? `${r.name} (${tx("not counted")})` : r.name); o.value = r.key; select.append(o); });
        select.value = mark.r;
        wrap.append(label, select);
        li.append(wrap);
      }
      dayList.append(li);
    });
  };
  dayInput.addEventListener("change", () => { day = /^\d{4}-\d{2}-\d{2}$/.test(dayInput.value) && dayInput.value <= today() ? dayInput.value : today(); renderDay(); });
  q("[data-day-today]").addEventListener("click", () => { const l = current(); day = l ? shiftDay(l, today(), nowMinute()) : today(); renderDay(); });
  dayList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mark]");
    if (!button) return;
    const key = button.dataset.key;
    const s = button.dataset.mark;
    // A second tap on the pressed state takes the mark away again.
    if (state.marks[key]?.s === s) delete state.marks[key];
    else state.marks[key] = s === "missed" ? { s, r: state.marks[key]?.r || cfg.reasons[0].key } : { s };
    keepFocus(() => { save(); renderDay(); renderLog(); renderResults(); });
    if (s === "missed" && state.marks[key]) dayList.querySelector(`[data-reason-key="${key}"]`)?.focus();
  });
  dayList.addEventListener("change", (event) => {
    const select = event.target.closest("[data-reason-key]");
    if (!select || !state.marks[select.dataset.reasonKey]) return;
    state.marks[select.dataset.reasonKey].r = select.value;
    save();
    keepFocus(() => { renderDay(); renderResults(); });
  });

  // 4 · The log: what is marked, the period and the leader of the results, the exports.
  const firstDate = () => state.leaders.reduce((min, l) => (l.since && (!min || l.since < min) ? l.since : min), "") || today();
  const renderLog = () => {
    const n = Object.keys(state.marks).length;
    logCount.textContent = state.leaders.length ? tx("{n} check-offs · {m} leaders", { n: int.format(n), m: int.format(state.leaders.length) }) : "";
    logEmpty.hidden = state.leaders.length > 0;
    filterSelect.replaceChildren(el("option", null, tx("All leaders")), ...state.leaders.map((l) => { const o = el("option", null, leaderLabel(l)); o.value = l.id; return o; }));
    filterSelect.firstChild.value = "";
    filterSelect.value = leaderOf(state.filter) ? state.filter : "";
    periodSelect.value = state.period;
  };
  periodSelect.addEventListener("change", () => { state.period = periodSelect.value; save(); renderResults(); });
  filterSelect.addEventListener("change", () => { state.filter = filterSelect.value; save(); renderResults(); });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!Object.keys(state.marks).length || !window.confirm(tx("Clear every check-off and review note? The leaders and their standards stay."))) return;
    state.marks = {};
    state.reviews = {};
    changed();
  });
  const statusName = (item) => (item.s === "done" ? tx("Done") : item.s === "na" ? tx("Not due") : item.s === "open" ? tx("Open") : tx("Missed"));
  const csvRows = () => {
    const rows = [[tx("Date"), tx("Weekday"), tx("Leader"), tx("Leadership level"), tx("Area"), tx("Shift"), tx("Task"), tx("Frequency"), tx("Time"), tx("Minutes"), tx("Tool"), tx("Status"), tx("Reason"), tx("Counted")]];
    entriesNow(state.leaders, firstDate(), today()).forEach((item) => {
      const leader = leaderOf(item.leaderId);
      const task = taskOf(leader, item.taskId);
      const counted = item.s === "done" || isMiss(item, excluded);
      rows.push([item.date, dayLong(item.date), leader.name, levelName(leader.level), leader.area, leader.shift, task.title, freqName(task.freq), timeText(item.minute), task.minutes, toolName(task.tool), statusName(item), item.s === "missed" ? reasonName(item.r) : "", counted ? tx("yes") : tx("no")]);
    });
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.leaders.length) downloadCsv(cfg.text.csvName, csvRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.leaders.length) downloadXlsx(cfg.text.csvName, csvRows()); });

  // The results.
  const shortDate = dayMonth(false);
  const dateLabel = (iso) => shortDate(new Date(`${iso}T00:00:00Z`));
  const periodText = () => ({ 1: tx("This week"), 2: tx("Last 2 weeks"), 4: tx("Last 4 weeks"), 12: tx("Last 12 weeks") }[state.period]);
  const analysis = () => {
    const now = today();
    const from = addDays(mondayOf(now), -7 * (Number(state.period) - 1));
    const scope = state.filter && leaderOf(state.filter) ? [leaderOf(state.filter)] : state.leaders;
    const items = entriesNow(scope, from, now);
    const past = items.filter((i) => i.s !== "open");
    return {
      now, from, scope, items,
      total: tally(items, excluded),
      week: tally(items.filter((i) => i.date >= mondayOf(now)), excluded),
      todayItems: items.filter((i) => i.date === now),
      perLeader: scope.map((l) => ({ leader: l, ...tally(items.filter((i) => i.leaderId === l.id), excluded), plan: planned(l, state.shares) })),
      weeks: byWeek(items, excluded).filter((w) => w.due > 0),
      misses: missesByTask(items, excluded),
      reasons: reasonCounts(past),
      repeats: repeatMisses(scope, state.marks, now, excluded, nowMinute()),
    };
  };
  const taskTitle = (g) => taskOf(leaderOf(g.leaderId), g.taskId)?.title || "";
  const repeatAction = (g) => {
    const leader = leaderOf(g.leaderId);
    const task = taskOf(leader, g.taskId);
    const reasons = Object.entries(g.reasons).sort((a, b) => b[1] - a[1]).map(([key, n]) => `${reasonName(key)} ${n}×`).join(", ");
    return {
      title: tx("Standard work missed {n} times in 2 weeks: {task}", { n: g.misses, task: task.title }),
      detail: `${leader.name} · ${levelName(leader.level)}${leader.area ? ` · ${leader.area}` : ""} · ${whenText(leader, task)} · ${reasons}`,
      owner: leader.name, due: addDays(today(), 7), source: TOOL, check: cfg.text.checkText, area: leader.area, priority: g.misses >= 5 ? "High" : "Medium",
    };
  };
  const summaryText = (r) => {
    const lines = [`${cfg.text.tool} · ${periodText()} · ${showDate(r.now)}`, ""];
    lines.push(`${tx("Adherence")}: ${pctOrDash(r.total.adherence)} (${tx("{a} of {b} due tasks done", { a: int.format(r.total.done), b: int.format(r.total.due) })}; ${tx("not counted: {n} not relevant, {m} not due", { n: int.format(r.total.excluded), m: int.format(r.total.na) })})`);
    lines.push(`${tx("Not recorded")}: ${int.format(r.total.unrecorded)}`);
    lines.push("", `${tx("Per leader")}:`);
    r.perLeader.forEach((p) => lines.push(`- ${p.leader.name} (${levelName(p.leader.level)}${p.leader.area ? `, ${p.leader.area}` : ""}): ${pctOrDash(p.adherence)} (${int.format(p.done)}/${int.format(p.due)}) · ${tx("{share} of the day in standard work, guide {guide}", { share: pctOrDash(p.plan.share), guide: pctOrDash(p.plan.guide) })}`));
    if (r.misses.length) {
      lines.push("", `${tx("Tasks missed most")}:`);
      r.misses.slice(0, 5).forEach((g) => lines.push(`- ${leaderOf(g.leaderId).name} · ${taskTitle(g)}: ${int.format(g.misses)} × (${tx("mostly {reason}", { reason: reasonName(g.top) })})`));
    }
    if (r.repeats.length) {
      lines.push("", `${tx("Missed 3 times or more in the last 2 weeks")}:`);
      r.repeats.forEach((g) => lines.push(`- ${leaderOf(g.leaderId).name} · ${taskTitle(g)}: ${int.format(g.misses)} ×`));
    }
    return lines.join("\n");
  };

  const viewSwitch = () => {
    const box = el("div", "lw-views");
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", tx("Show"));
    [["results", tx("Results")], ["review", tx("Review")]].forEach(([view, label]) => {
      const b = el("button", null, label);
      b.type = "button";
      b.dataset.focusKey = `view:${view}`;
      b.setAttribute("aria-pressed", String(state.view === view));
      b.addEventListener("click", () => { state.view = view; save(); keepFocus(renderResults); });
      box.append(b);
    });
    return box;
  };
  const cellOf = (item) => (item.s === "done" ? { text: "✓", state: "ok" } : item.s === "na" ? { text: "–", state: "muted" } : item.s === "open" ? { text: "○", state: "none", textColor: ChartKit.C.muted }
    : excluded.includes(item.r) ? { text: "–", state: "muted" } : { text: item.r === UNRECORDED ? "?" : "✗", state: "danger" });
  const renderResultsView = (r) => {
    const head = el("div", "result-head lw-head");
    head.append(el("p", "kicker", `${cfg.text.tool} · ${periodText()}${state.filter && leaderOf(state.filter) ? ` · ${leaderOf(state.filter).name}` : ""}`));
    const h2 = el("h2");
    h2.append(pctOrDash(r.total.adherence), el("span", null, ` · ${tx("adherence")}`));
    head.append(h2, el("p", "lw-meta", `${tx("{a} of {b} due tasks done", { a: int.format(r.total.done), b: int.format(r.total.due) })} · ${tx("{n} leaders", { n: int.format(r.scope.length) })} · ${tx("Adherence = done ÷ due. Not relevant today and not due are left out; a task not marked by the end of its day counts as missed.")}`), viewSwitch());

    const stats = el("div", "dl-stats lw-stats");
    const todayT = tally(r.todayItems, excluded);
    stats.append(stat(tx("Adherence"), pctOrDash(r.total.adherence), tx("{a} of {b} due tasks", { a: int.format(r.total.done), b: int.format(r.total.due) })));
    stats.append(stat(tx("This week"), pctOrDash(r.week.adherence), tx("{a} of {b} due tasks", { a: int.format(r.week.done), b: int.format(r.week.due) })));
    stats.append(stat(tx("Today"), tx("{a} of {b}", { a: int.format(todayT.done), b: int.format(r.todayItems.length) }), tx("{n} open", { n: int.format(todayT.open) })));
    stats.append(stat(tx("Not recorded"), int.format(r.total.unrecorded), tx("tasks nobody marked on their day")));
    stats.append(stat(tx("Repeat misses"), int.format(r.repeats.length), tx("missed 3 times or more in 2 weeks")));
    const one = r.scope.length === 1 ? r.perLeader[0] : null;
    if (one) stats.append(stat(tx("Standard work in the day"), pctOrDash(one.plan.share), tx("guide for a {level}: {guide}", { level: lower(levelName(one.leader.level)), guide: pctOrDash(one.plan.guide) })));

    const notes = [];
    if (r.repeats.length) {
      const box = el("div", "lw-repeats");
      box.append(el("p", "result-label", tx("Missed 3 times or more in the last 2 weeks")));
      const list = el("ul", "lw-repeat-list");
      r.repeats.forEach((g) => {
        const leader = leaderOf(g.leaderId);
        const li = el("li");
        const text = el("p");
        text.append(el("strong", null, `${leader.name} · ${taskTitle(g)}`), ` · ${tx("{n} times in 14 days, mostly {reason}", { n: int.format(g.misses), reason: reasonName(g.top) })}`);
        const link = Actions ? Actions.linkButton(tx("Add to actions"), () => repeatAction(g)) : trackerLink(tx("Add to actions"), () => repeatAction(g));
        link.setAttribute("aria-label", `${tx("Add to actions")}: ${leader.name} · ${taskTitle(g)}`);
        li.append(text, link);
        list.append(li);
      });
      box.append(list, el("p", "form-note", tx("Either the day needs help or the standard needs changing: decide which with the leader.")));
      notes.push(box);
    }

    const top = r.misses[0];
    let focus = null;
    let problem = cfg.text.tool;
    if (top) {
      const leader = leaderOf(top.leaderId);
      const advice = adviceOf(top.top);
      focus = focusCard({
        title: taskTitle(top),
        detail: leader.name,
        lede: tx("Missed {n} of {due} times in this period, most often: {reason}.", { n: int.format(top.misses), due: int.format(top.due), reason: reasonName(top.top) }),
        advice: advice ? { meaning: advice.meaning, moves: advice.moves, question: advice.question } : null,
      });
      problem = tx("Leader standard work: “{task}” of {leader} missed {n} times", { task: taskTitle(top), leader: leader.name, n: int.format(top.misses) });
    }
    const actions = resultActions(() => summaryText(r), problem, null);
    if (top) actions.append(Actions ? Actions.linkButton(tx("Add to actions"), () => repeatAction(top)) : trackerLink(tx("Add to actions"), () => repeatAction(top)));
    const printWeek = el("button", "button-secondary", tx("Print the week sheet"));
    printWeek.type = "button";
    printWeek.addEventListener("click", () => { const l = one?.leader || current(); if (l) printOnly(() => weekSheet(l, mondayOf(r.now))); });
    actions.append(printWeek);

    const panels = [];
    if (ChartKit) {
      if (r.perLeader.length > 1) {
        const p = panel(tx("Adherence per leader"), tx("Done ÷ due in the period. A low bar asks the next level for help, not for blame."));
        p.append(ChartKit.figure(ChartKit.bars(r.perLeader.filter((x) => x.due).map((x) => ({ label: x.leader.name.split(" ")[0], value: x.adherence, tip: `${leaderLabel(x.leader)}: ${pct(x.adherence, 0)} (${tx("{a} of {b} due tasks", { a: int.format(x.done), b: int.format(x.due) })})` })),
          { title: tx("Adherence per leader"), yMax: 1, format: (v) => pct(v, 0), highlight: () => false }), { fileName: "leader-standard-work-adherence" }));
        panels.push(p);
      }
      if (r.weeks.length) {
        const p = panel(tx("Adherence per week"), r.scope.length > 1 ? tx("Week by week, Monday to Sunday, per level.") : tx("Week by week, Monday to Sunday."));
        // One line per level when several leaders are shown (a chart of six names is unreadable), one line for one leader.
        const groups = r.scope.length > 1 ? LEVELS.filter((level) => r.scope.some((l) => l.level === level)).map((level) => ({ label: levelName(level), ids: new Set(r.scope.filter((l) => l.level === level).map((l) => l.id)) })) : [{ label: r.scope[0].name, ids: new Set([r.scope[0].id]) }];
        const series = groups.map((g) => {
          const w = byWeek(r.items.filter((i) => g.ids.has(i.leaderId)), excluded);
          return { label: g.label, points: r.weeks.map((week) => { const hit = w.find((x) => x.week === week.week); return { x: dateLabel(week.week), y: hit && hit.due ? hit.adherence : NaN, tip: `${tx("Week of {date}", { date: showDate(week.week) })} · ${g.label}: ${hit && hit.due ? `${pct(hit.adherence, 0)} (${hit.done}/${hit.due})` : "–"}` }; }) };
        });
        p.append(ChartKit.figure(ChartKit.line(series, { title: tx("Adherence per week"), yMin: 0, yMax: 1, format: (v) => pct(v, 0) }), { fileName: "leader-standard-work-trend" }));
        panels.push(p);
      }
      const reasonItems = [...cfg.reasons.map((x) => x.key), UNRECORDED].filter((key) => r.reasons[key]).map((key) => ({ key, value: r.reasons[key] })).sort((a, b) => b.value - a.value);
      if (reasonItems.length) {
        const p = panel(tx("Misses by reason"), tx("Every missed task by its reason. Not relevant today is shown but left out of the adherence."));
        p.append(ChartKit.figure(ChartKit.bars(reasonItems.map((x) => ({ label: reasonName(x.key), value: x.value, state: excluded.includes(x.key) ? "muted" : undefined, tip: `${reasonName(x.key)}: ${int.format(x.value)}${excluded.includes(x.key) ? ` (${tx("not counted")})` : ""}` })),
          { title: tx("Misses by reason"), highlight: () => false }), { fileName: "leader-standard-work-reasons" }));
        panels.push(p);
      }
      // Tasks × days for one leader; leaders × days (the share done each day) for all of them.
      const days = [...new Set(r.items.map((i) => i.date))].sort();
      if (days.length) {
        const cols = days.map(dateLabel);
        const size = 40;
        let svg;
        if (one) {
          const leader = one.leader;
          const tasks = sortedTasks(leader).filter((t) => r.items.some((i) => i.taskId === t.id));
          const at = new Map(r.items.map((i) => [`${i.taskId}|${i.date}`, i]));
          svg = ChartKit.heatmap(tasks.map((t) => t.title), cols, (ri, ci) => {
            const item = at.get(`${tasks[ri].id}|${days[ci]}`);
            if (!item) return null;
            return { ...cellOf(item), tip: `${dayLong(days[ci])}, ${showDate(days[ci])} · ${tasks[ri].title}: ${statusName(item)}${item.s === "missed" ? ` (${reasonName(item.r)})` : ""}` };
          }, { title: tx("Task by day"), cellSize: size, labelWidth: 230 });
        } else {
          svg = ChartKit.heatmap(r.scope.map((l) => l.name), cols, (ri, ci) => {
            const t = tally(r.items.filter((i) => i.leaderId === r.scope[ri].id && i.date === days[ci]), excluded);
            if (!t.scheduled) return null;
            if (!t.due) return { text: "", color: ChartKit.C.blue, opacity: 0.06, tip: `${r.scope[ri].name} · ${showDate(days[ci])}: ${tx("{n} open", { n: t.open })}` };
            const opacity = 0.12 + 0.88 * t.adherence;
            return { text: String(Math.round(t.adherence * 100)), color: ChartKit.C.blue, opacity, textColor: opacity > 0.55 ? "#ffffff" : ChartKit.C.text, tip: `${r.scope[ri].name} · ${dayLong(days[ci])}, ${showDate(days[ci])}: ${pct(t.adherence, 0)} (${t.done}/${t.due})` };
          }, { title: tx("Leader by day"), cellSize: size, labelWidth: 160 });
        }
        const p = panel(one ? tx("Task by day") : tx("Leader by day"), one ? tx("✓ done · ✗ missed · ? not recorded · – not counted · ○ still open. Rows in time order.") : tx("The number is the share of due tasks done that day; the darker, the more was done."));
        p.classList.add("lw-panel-heat");
        // The heat map keeps its own width and scrolls sideways, so a long period stays readable on a phone.
        svg.style.width = `${Number(String(svg.getAttribute("viewBox")).split(" ")[2]) || 600}px`;
        p.append(ChartKit.figure(svg, { fileName: "leader-standard-work-heatmap" }));
        if (one) p.append(ChartKit.legend([{ label: `✓ ${tx("Done")}`, state: "ok" }, { label: `✗ ${tx("Missed")}`, state: "danger" }, { label: `– ${tx("not counted")}`, state: "muted" }]));
        panels.push(p);
      }
    }
    const missPanel = panel(tx("Tasks missed most"), r.misses.length ? tx("Misses per task in the period, with the reason given most often.") : tx("No task was missed in this period."));
    if (r.misses.length) missPanel.append(barList(r.misses.slice(0, 10).map((g) => ({ key: `${leaderOf(g.leaderId).name.split(" ")[0]} · ${taskTitle(g)}`, value: g.misses, g })), {
      label: (item) => [int.format(item.value), ` / ${int.format(item.g.due)} · ${reasonName(item.g.top)}`], ranked: true,
      highlight: (item) => r.repeats.some((g) => g.key === item.g.key), tag: tx("repeat"),
    }));
    panels.push(missPanel);
    // The standard in the day: planned minutes against the shift, by leader, with the guide of the level.
    const sharePanel = panel(tx("Standard work in the day"), tx("Planned minutes of standard work per working day over the length of the shift, against the guide for the level (after David Mann: about 80 % team leader, 50 % shift lead, 25 % manager)."));
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table lw-share-table");
    const headRow = el("tr");
    [tx("Leader"), tx("Planned per day"), tx("Share of the day"), tx("Guide")].forEach((text, i) => headRow.append(th(text, i ? "num" : "")));
    table.append(el("thead"));
    table.tHead.append(headRow);
    const body = el("tbody");
    r.perLeader.forEach((p) => {
      const tr = el("tr");
      const who = el("td");
      who.append(el("strong", null, p.leader.name), el("span", "lw-done-means", levelName(p.leader.level)));
      tr.append(who, el("td", "num", `${int.format(Math.round(p.plan.perDay))} / ${int.format(p.plan.dayMinutes)} ${tx("min")}`), el("td", "num", pctOrDash(p.plan.share)), el("td", "num", pctOrDash(p.plan.guide)));
      body.append(tr);
    });
    table.append(body);
    wrap.append(table);
    sharePanel.append(wrap);
    panels.push(sharePanel);
    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };

  // The review of the next level up: per leader the adherence of a week, the change from the week before, the task
  // missed most, and the reviewer's note.
  const reviewWeeks = () => Array.from({ length: 8 }, (_, i) => addDays(mondayOf(today()), -7 * i));
  const reviewRows = (week) => {
    const now = today();
    const reviewer = leaderOf(state.reviewer);
    const scope = reviewer ? state.leaders.filter((l) => l.reportsTo === reviewer.id) : state.leaders;
    const end = addDays(week, 6) < now ? addDays(week, 6) : now;
    return scope.map((leader) => {
      const items = week <= now ? entriesNow([leader], week, end) : [];
      const before = entriesNow([leader], addDays(week, -7), addDays(week, -1));
      const t = tally(items, excluded);
      const b = tally(before, excluded);
      return { leader, t, change: t.adherence !== null && b.adherence !== null ? t.adherence - b.adherence : null, top: missesByTask(items, excluded)[0] || null, note: state.reviews[`${leader.id}|${week}`] || "" };
    });
  };
  const changeText = (change) => (change === null ? "" : `${change > 0.005 ? "↑" : change < -0.005 ? "↓" : "→"} ${num(Math.abs(change) * 100, 0)} ${tx("pts")}`);
  const reviewText = (week, rows) => {
    const lines = [`${cfg.text.tool} · ${tx("Review")} · ${tx("Week of {date}", { date: showDate(week) })}`, ""];
    rows.forEach((row) => {
      lines.push(`${row.leader.name} (${levelName(row.leader.level)}): ${pctOrDash(row.t.adherence)} (${int.format(row.t.done)}/${int.format(row.t.due)})${row.change !== null ? ` ${changeText(row.change)}` : ""}`);
      if (row.top) lines.push(`  ${tx("Missed most")}: ${taskTitle(row.top)} ${int.format(row.top.misses)} × (${reasonName(row.top.top)})`);
      if (row.note) lines.push(`  ${tx("Note")}: ${row.note}`);
    });
    return lines.join("\n");
  };
  const reviewSheet = (week, rows) => {
    const head = el("div", "lw-print-head");
    head.append(el("p", "kicker", cfg.text.tool), el("h2", null, `${tx("Review")} · ${tx("Week of {date}", { date: showDate(week) })}`));
    if (leaderOf(state.reviewer)) head.append(el("p", "lw-print-meta", `${tx("Reviewer")}: ${leaderOf(state.reviewer).name}`));
    const table = el("table", "lw-print-table lw-review-print");
    const hr = el("tr");
    [tx("Leader"), tx("Adherence"), tx("Missed most"), tx("Note")].forEach((text) => hr.append(th(text)));
    table.append(el("thead"));
    table.tHead.append(hr);
    const body = el("tbody");
    rows.forEach((row) => {
      const tr = el("tr");
      tr.append(el("td", null, leaderLabel(row.leader)), el("td", "num", `${pctOrDash(row.t.adherence)} (${row.t.done}/${row.t.due}) ${changeText(row.change)}`), el("td", null, row.top ? `${taskTitle(row.top)} · ${row.top.misses} × · ${reasonName(row.top.top)}` : "–"), el("td", null, row.note));
      body.append(tr);
    });
    table.append(body);
    return [head, table, el("p", "lw-print-sign", `${tx("Reviewed by")}: ____________________   ${tx("Date")}: __________`)];
  };
  const renderReviewView = () => {
    const weeks = reviewWeeks();
    if (!weeks.includes(state.reviewWeek)) state.reviewWeek = weeks[1];
    const week = state.reviewWeek;
    const head = el("div", "result-head lw-head");
    head.append(el("p", "kicker", `${cfg.text.tool} · ${tx("Review")}`));
    const h2 = el("h2");
    h2.append(tx("Week of {date}", { date: showDate(week) }));
    head.append(h2, el("p", "lw-meta", tx("The next level up looks at each leader’s week with them: the adherence, the task missed most, and what they agreed.")), viewSwitch());
    const controls = el("div", "dl-grid lw-review-controls");
    const select = (id, label, options, value, onChange) => {
      const box = el("div", "field");
      const lab = el("label", null, label);
      lab.htmlFor = id;
      const s = el("select");
      s.id = id;
      s.dataset.focusKey = id;
      options.forEach(([v, text]) => { const o = el("option", null, text); o.value = v; s.append(o); });
      s.value = value;
      s.addEventListener("change", () => onChange(s.value));
      box.append(lab, s);
      return box;
    };
    controls.append(select("lw-review-week", tx("Week"), weeks.map((w, i) => [w, `${tx("Week of {date}", { date: showDate(w) })}${i === 0 ? ` (${tx("this week")})` : ""}`]), week, (v) => { state.reviewWeek = v; save(); keepFocus(renderResults); }));
    const reviewers = state.leaders.filter((l) => state.leaders.some((x) => x.reportsTo === l.id));
    controls.append(select("lw-reviewer", tx("Reviewer"), [["", tx("All leaders")], ...reviewers.map((l) => [l.id, tx("{name} and the leaders who report to them", { name: l.name })])], leaderOf(state.reviewer) ? state.reviewer : "", (v) => { state.reviewer = v; save(); keepFocus(renderResults); }));
    const rows = reviewRows(week);
    const wrap = el("div", "dl-table-wrap lw-review-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table lw-review");
    const hr = el("tr");
    [tx("Leader"), tx("Adherence"), tx("Missed most"), tx("Reviewer’s note")].forEach((text, i) => hr.append(th(text, i === 1 ? "num" : "")));
    table.append(el("thead"));
    table.tHead.append(hr);
    const body = el("tbody");
    rows.forEach((row, index) => {
      const tr = el("tr");
      const who = el("td");
      who.append(el("strong", null, row.leader.name), el("span", "lw-done-means", [levelName(row.leader.level), row.leader.area, row.leader.shift].filter(Boolean).join(" · ")));
      const adherence = el("td", "num");
      adherence.append(el("strong", null, pctOrDash(row.t.adherence)), el("span", "lw-done-means", `${int.format(row.t.done)} / ${int.format(row.t.due)}${row.change !== null ? ` · ${changeText(row.change)}` : ""}`));
      const missed = el("td");
      if (row.top) missed.append(el("span", null, taskTitle(row.top)), el("span", "lw-done-means", `${int.format(row.top.misses)} × · ${reasonName(row.top.top)}`));
      else missed.append(row.t.due ? tx("Nothing missed") : "–");
      const noteCell = el("td", "lw-note-cell");
      const id = `lw-note-${index}`;
      const label = el("label", "visually-hidden", tx("Note on {name}", { name: row.leader.name }));
      label.htmlFor = id;
      const area = el("textarea", "lw-note");
      area.id = id;
      area.rows = 2;
      area.placeholder = cfg.text.reviewPlaceholder;
      area.value = row.note;
      area.dataset.reviewKey = `${row.leader.id}|${week}`;
      noteCell.append(label, area);
      tr.append(who, adherence, missed, noteCell);
      body.append(tr);
    });
    table.append(body);
    wrap.append(table);
    // Typing a note saves it and leaves the table alone, so the cursor stays where it is.
    wrap.addEventListener("input", (event) => {
      const area = event.target.closest("[data-review-key]");
      if (!area) return;
      const text = area.value.slice(0, 1000);
      if (text.trim()) state.reviews[area.dataset.reviewKey] = text; else delete state.reviews[area.dataset.reviewKey];
      save();
    });
    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy the review"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(reviewText(week, reviewRows(week)), copyButton));
    const print = el("button", "button-secondary", tx("Print the review"));
    print.type = "button";
    print.addEventListener("click", () => printOnly(() => reviewSheet(week, reviewRows(week))));
    actions.append(copyButton, print);
    results.append(head, controls, rows.length ? wrap : el("p", "form-note", tx("Nobody reports to this reviewer yet: set “Reports to” on the leaders.")), actions);
  };
  const renderResults = () => {
    results.replaceChildren();
    note.hidden = !isExample();
    if (!state.leaders.length || !state.leaders.some((l) => l.tasks.length)) { results.hidden = true; return; }
    results.hidden = false;
    if (state.view === "review") renderReviewView();
    else renderResultsView(analysis());
  };

  const render = () => {
    renderLeaders();
    renderStandard();
    renderDay();
    renderLog();
    renderResults();
  };
  const changed = () => { save(); render(); };

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.leaders.length && firstVisit(KEY)) loadExample();
  if (!leaderOf(state.current)) state.current = state.leaders[0]?.id || "";
  render();
})();
