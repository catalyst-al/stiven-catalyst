(() => {
  // Guest Complaints: the complaint and service-recovery log of a front office, from the moment a guest complains to
  // the call back. The log is { rows: [{ id, date, time, room, channel, category, severity, what, guest, takenBy,
  // learn: [steps of LEARN done], action, comp, value (€), resolvedDate, resolvedTime, followed, satisfied }] }.
  // A complaint's status follows from its dates: with a follow-up date it is followed up, with a resolved date it is
  // resolved, otherwise it is open. Times are read on the device clock, as the desk writes them.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const STATUSES = ["open", "resolved", "followed"];
  const SEVERITIES = ["minor", "major", "critical"];
  const SATISFIED = ["yes", "no", "unknown"];
  const LEARN = ["listen", "empathise", "apologise", "resolve", "notify"];
  const LETTERS = { L: "listen", E: "empathise", A: "apologise", R: "resolve", N: "notify" };
  const DAY = 864e5;
  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  const fill = (text, vars = {}) => String(text ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const timeOf = (value) => {
    const match = String(value ?? "").trim().match(/^(\d{1,2})[:.](\d{2})$/);
    return match && Number(match[1]) < 24 && Number(match[2]) < 60 ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
  };
  // Both ends are wall-clock times of the same desk, so they are compared as they are written. Only the one night a
  // year when the clocks change can be an hour off.
  const minutesBetween = (date1, time1, date2, time2) => (isIso(date1) && time1 && isIso(date2) && time2
    ? Math.round((Date.parse(`${date2}T${time2}:00Z`) - Date.parse(`${date1}T${time1}:00Z`)) / 6e4)
    : null);

  const categoryOf = (cfg, key) => cfg.categories.find((item) => item.key === key) || cfg.categories.at(-1);
  const channelOf = (cfg, key) => cfg.channels.find((item) => item.key === key) || cfg.channels[0];
  const severityOf = (cfg, key) => cfg.severities.find((item) => item.key === key) || cfg.severities[0];
  const compOf = (cfg, key) => cfg.compensation.find((item) => item.key === key) || cfg.compensation[0];
  const statusOf = (row) => (row.followed ? "followed" : row.resolvedDate ? "resolved" : "open");
  const isOpen = (row) => statusOf(row) === "open";
  // A guest in the house complains in person, by phone or in the chat; an email, a review or a survey usually comes
  // after the stay, and is measured against the target in hours.
  const inHouse = (row, cfg) => channelOf(cfg, row.channel).inHouse !== false;

  // Time to resolve = resolved time − time the complaint was logged, in minutes; null while open, without a time, or
  // when the resolved time is before the complaint (a typing error, not a result).
  const ttr = (row) => {
    if (!row.resolvedDate) return null;
    const minutes = minutesBetween(row.date, row.time, row.resolvedDate, row.resolvedTime);
    return minutes === null || minutes < 0 ? null : minutes;
  };

  // The targets in force: minutes for a guest in the house, hours for a complaint after the stay. A typed setting
  // wins over the data file's default.
  const targets = (cfg, typed = {}) => {
    const pick = (value, fallback, max) => {
      const n = kit.parseNumber(String(value ?? "").trim());
      return n > 0 && n <= max ? n : fallback;
    };
    return { inHouse: pick(typed.targetInHouse, cfg.targets.inHouse, 1440), postStay: pick(typed.targetPostStay, cfg.targets.postStay, 720) };
  };
  const targetMinutes = (row, cfg, t) => (inHouse(row, cfg) ? t.inHouse : t.postStay * 60);

  // Resolved within target = complaints resolved within their target ÷ complaints whose target is decided: every
  // resolved one, and every open one already past its target (it can no longer make it). An open complaint still
  // inside its target is pending, not counted either way; one without a time cannot be measured.
  const withinTarget = (rows, cfg, t, now) => {
    const out = { within: 0, missed: 0, pending: 0, unknown: 0 };
    rows.forEach((row) => {
      const limit = targetMinutes(row, cfg, t);
      if (!isOpen(row)) {
        const minutes = ttr(row);
        if (minutes === null) out.unknown++;
        else if (minutes <= limit) out.within++;
        else out.missed++;
        return;
      }
      const age = minutesBetween(row.date, row.time, now.date, now.time);
      if (age === null) out.unknown++;
      else if (age > limit) out.missed++;
      else out.pending++;
    });
    out.decided = out.within + out.missed;
    out.share = out.decided ? out.within / out.decided : null;
    return out;
  };

  // The median: the middle value, or the mean of the two middle values of an even count.
  const median = (values) => {
    const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  // Median time to resolve, apart for the guests in the house (minutes) and after the stay (hours): one median over
  // both would mix a 12-minute fix with a 5-hour email.
  const resolveTimes = (rows, cfg) => {
    const done = rows.filter((row) => !isOpen(row) && ttr(row) !== null);
    const here = done.filter((row) => inHouse(row, cfg)).map(ttr);
    const after = done.filter((row) => !inHouse(row, cfg)).map(ttr);
    return { inHouse: median(here), postStay: median(after), all: median(done.map(ttr)), nInHouse: here.length, nPostStay: after.length };
  };

  const round2 = (n) => Math.round(n * 100) / 100;
  // Recovery cost = the € value of every gesture; cost per complaint = recovery cost ÷ complaints, the figure a
  // budget compares; per compensated complaint = recovery cost ÷ complaints that cost something.
  const costs = (rows) => {
    const total = round2(rows.reduce((sum, row) => sum + (row.value > 0 ? row.value : 0), 0));
    const paid = rows.filter((row) => row.value > 0);
    const byType = new Map();
    paid.forEach((row) => byType.set(row.comp, round2((byType.get(row.comp) || 0) + row.value)));
    return {
      total,
      n: rows.length,
      perComplaint: rows.length ? total / rows.length : null,
      compensated: paid.length,
      perCompensated: paid.length ? total / paid.length : null,
      byType: [...byType].map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key)),
    };
  };

  // Satisfied after recovery = guests who said yes ÷ guests who answered (yes or no), over the complaints that were
  // resolved; "not known" is counted apart, never as a no.
  const satisfaction = (rows) => {
    const closed = rows.filter((row) => !isOpen(row));
    const yes = closed.filter((row) => row.satisfied === "yes").length;
    const no = closed.filter((row) => row.satisfied === "no").length;
    return { yes, no, unknown: closed.length - yes - no, answered: yes + no, share: yes + no ? yes / (yes + no) : null };
  };

  // Complaints per 100 occupied room nights = complaints ÷ occupied room nights × 100, the rate that lets a full
  // week and a quiet week be compared.
  const per100 = (complaints, roomNights) => (roomNights > 0 ? (complaints / roomNights) * 100 : null);

  // Room nights of a period from a map { date: rooms sold }: the sum, and whether every night of the period is there.
  const nightsTotal = (map, from, to) => {
    if (!isIso(from) || !isIso(to) || to < from) return { sold: 0, have: 0, days: 0, complete: false };
    let sold = 0, have = 0, days = 0;
    for (let day = from; day <= to; day = addDays(day, 1)) {
      days++;
      const value = map?.[day];
      if (Number.isFinite(value) && value >= 0) {
        sold += value;
        have++;
      }
    }
    return { sold, have, days, complete: days > 0 && have === days };
  };
  // The rooms sold per night of the Hotel KPIs log of this browser (one row per night; a night pasted twice keeps
  // its latest figures, as there).
  const hotelNights = (saved) => {
    const map = {};
    const rows = saved && typeof saved === "object" && Array.isArray(saved.rows) ? saved.rows : [];
    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;
      const date = kit.parseDate(row.date);
      const sold = Number(row.sold);
      if (date && Number.isFinite(sold) && sold >= 0) map[date] = sold;
    });
    return map;
  };

  // Repeat rooms: the same room with the same category again within `days` days of the complaint before. A run
  // continues while each complaint follows the last within the window, so it is reported once with all its dates.
  const roomKey = (room) => String(room ?? "").trim().toLowerCase();
  const repeats = (rows, days = 30) => {
    const groups = new Map();
    rows.forEach((row) => {
      if (!roomKey(row.room)) return;
      const key = `${roomKey(row.room)}|${row.category}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    });
    const out = [];
    groups.forEach((list) => {
      const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date) || String(a.time).localeCompare(String(b.time)));
      let run = [sorted[0]];
      const close = () => {
        if (run.length >= 2) out.push({ room: run[0].room, category: run[0].category, count: run.length, first: run[0].date, last: run.at(-1).date, ids: run.map((row) => row.id) });
      };
      for (let i = 1; i < sorted.length; i++) {
        if (between(run.at(-1).date, sorted[i].date) <= days) run.push(sorted[i]);
        else {
          close();
          run = [sorted[i]];
        }
      }
      close();
    });
    return out.sort((a, b) => b.count - a.count || b.last.localeCompare(a.last) || String(a.room).localeCompare(String(b.room)));
  };

  // The Pareto of the categories: largest first, its share and the cumulative share; class A is every category that
  // starts below 80 % of the total, as the Pareto tool classes them.
  const pareto = (rows, cfg) => {
    const counts = new Map();
    rows.forEach((row) => counts.set(row.category, (counts.get(row.category) || 0) + 1));
    const total = rows.length;
    let before = 0;
    return [...counts].map(([key, value]) => ({ key, name: categoryOf(cfg, key).name, value }))
      .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
      .map((item) => {
        const share = total ? item.value / total : 0;
        const cls = before < 0.8 - 1e-9 ? "A" : before < 0.95 - 1e-9 ? "B" : "C";
        before += share;
        return { ...item, share, cumulative: before, cls };
      });
  };

  // Complaints per week (Monday to Sunday) and severity, over the weeks of the period, the latest `max` of them.
  const weekly = (rows, from, to, max = 12) => {
    if (!isIso(from) || !isIso(to) || to < from) return [];
    const last = mondayOf(to);
    let first = mondayOf(from);
    if (between(first, last) > (max - 1) * 7) first = addDays(last, -(max - 1) * 7);
    const weeks = [];
    for (let week = first; week <= last; week = addDays(week, 7)) weeks.push({ week, minor: 0, major: 0, critical: 0, total: 0 });
    rows.forEach((row) => {
      const item = weeks.find((w) => row.date >= w.week && row.date < addDays(w.week, 7));
      if (!item) return;
      item[SEVERITIES.includes(row.severity) ? row.severity : "minor"]++;
      item.total++;
    });
    return weeks;
  };

  // The steps of LEARN done, over the complaints.
  const learnCounts = (rows) => LEARN.map((key) => ({ key, value: rows.filter((row) => row.learn.includes(key)).length }));

  // Guest names are personal data: once a complaint is resolved, the name has done its job. Gives the rows without
  // the names of closed complaints, and how many were removed.
  const removeNames = (rows) => {
    let removed = 0;
    const out = rows.map((row) => {
      if (isOpen(row) || !row.guest) return row;
      removed++;
      return { ...row, guest: "" };
    });
    return { rows: out, removed };
  };

  // Complaint ids: GC, the day, three characters that cannot be misread (no 0/O, 1/I).
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const newId = (date, taken = new Set(), random = Math.random) => {
    const stem = `GC-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-`;
    for (let attempt = 0; attempt < 60; attempt++) {
      let tail = "";
      for (let i = 0; i < 3; i++) tail += CHARS[Math.floor(random() * CHARS.length) % CHARS.length];
      if (!taken.has(stem + tail)) return stem + tail;
    }
    let n = taken.size + 1;
    while (taken.has(`${stem}${n}`)) n++;
    return `${stem}${n}`;
  };

  // A saved row, cleaned: no date, no complaint; unknown names fall back to the first choice ("other" for a
  // category); a follow-up needs a resolution first.
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const learnOf = (value) => {
    const list = Array.isArray(value) ? value : String(value ?? "").toUpperCase().split("").map((letter) => LETTERS[letter]);
    return LEARN.filter((key) => list.includes(key));
  };
  const cleanRow = (row, cfg) => {
    if (!isObject(row)) return null;
    const date = kit.parseDate(row.date);
    if (!date) return null;
    const s = (value) => (typeof value === "string" ? value.trim() : "");
    const [resolvedText = "", resolvedClock = ""] = s(row.resolved).split(/\s+/);
    const resolvedDate = kit.parseDate(row.resolvedDate ?? resolvedText);
    const resolvedTime = resolvedDate ? timeOf(row.resolvedTime ?? resolvedClock) : "";
    const followed = resolvedDate ? kit.parseDate(row.followed) : "";
    const value = typeof row.value === "number" ? row.value : kit.parseNumber(row.value);
    return {
      id: /^[A-Za-z0-9-]{3,30}$/.test(s(row.id)) ? s(row.id) : "",
      date,
      time: timeOf(row.time),
      room: s(row.room).slice(0, 12),
      channel: cfg.channels.some((item) => item.key === row.channel) ? row.channel : cfg.channels[0].key,
      category: cfg.categories.some((item) => item.key === row.category) ? row.category : "other",
      severity: SEVERITIES.includes(row.severity) ? row.severity : "minor",
      what: s(row.what),
      guest: s(row.guest),
      takenBy: s(row.takenBy),
      learn: learnOf(row.learn),
      action: s(row.action),
      comp: cfg.compensation.some((item) => item.key === row.comp) ? row.comp : "none",
      value: Number.isFinite(value) && value > 0 ? round2(value) : 0,
      resolvedDate,
      resolvedTime,
      followed,
      satisfied: SATISFIED.includes(row.satisfied) ? row.satisfied : "unknown",
    };
  };
  // Rows with an id each, unique: a missing or repeated one gets a new id.
  const cleanRows = (rows, cfg, taken = new Set()) => rows.map((row) => cleanRow(row, cfg)).filter(Boolean).map((row) => {
    if (!row.id || taken.has(row.id)) row.id = newId(row.date, taken);
    taken.add(row.id);
    return row;
  });

  // A pasted name to its key: the key itself, the name in this language or the start of it.
  const keyOf = (value, entries) => {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return "";
    const lists = entries.map(([key, names]) => [key, [key, ...names].filter(Boolean).map((name) => String(name).toLowerCase())]);
    const exact = lists.find(([, names]) => names.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 3 && lists.find(([, names]) => names.some((name) => name.startsWith(text) || text.startsWith(name)));
    return start ? start[0] : "";
  };
  const named = (list) => list.map((item) => [item.key, [item.name]]);
  // Rows from a spreadsheet: date, time, room, channel, category, severity, what happened, guest, taken by, action
  // taken, compensation, value €, resolved date, resolved time, follow-up date, satisfied. A row needs a date; a
  // first row without one is a header.
  const importRows = (text, cfg, taken = new Set()) => {
    const added = [];
    let skipped = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, time, room, channel, category, severity, what, guest, takenBy, action, comp, value, resolvedDate, resolvedTime, followed, satisfied] = cells;
      const day = kit.parseDate(date);
      if (!day) {
        if (index > 0) skipped++;
        return;
      }
      added.push({
        date: day, time, room, what, guest, takenBy, action, value, resolvedDate, resolvedTime, followed,
        channel: keyOf(channel, named(cfg.channels)),
        category: keyOf(category, named(cfg.categories)) || "other",
        severity: keyOf(severity, named(cfg.severities)),
        comp: keyOf(comp, named(cfg.compensation)),
        satisfied: keyOf(satisfied, SATISFIED.map((key) => [key, [cfg.satisfied[key]]])),
        learn: [],
      });
    });
    return { added: cleanRows(added, cfg, taken), skipped };
  };

  // The example of the data file, moved forward by whole weeks so that its last day is today or just before; every
  // date (complaints, resolutions, follow-ups and the nights) moves together, so the weekdays stay the same.
  const exampleShift = (cfg, today) => {
    const dates = cfg.example.rows.flatMap((row) => [row.date, String(row.resolved).slice(0, 10), row.followed]).filter(isIso).sort();
    const weeks = dates.length ? Math.floor(between(dates.at(-1), today) / 7) : 0;
    return weeks > 0 ? weeks * 7 : 0;
  };
  const exampleRows = (cfg, today) => {
    const days = exampleShift(cfg, today);
    const move = (iso) => (isIso(iso) && days ? addDays(iso, days) : iso);
    return cleanRows(cfg.example.rows.map((row, index) => {
      const date = move(row.date);
      const [day = "", clock = ""] = String(row.resolved || "").split(" ");
      return { ...row, id: `GC-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-${String(index + 1).padStart(3, "0")}`, date, resolved: day ? `${move(day)} ${clock}` : "", followed: move(row.followed) };
    }), cfg);
  };
  // The rooms sold of the example's nights, on the same moved dates.
  const exampleNights = (cfg, today) => {
    const start = addDays(cfg.example.nights.from, exampleShift(cfg, today));
    return Object.fromEntries(cfg.example.nights.sold.map((sold, i) => [addDays(start, i), sold]));
  };

  // The reply to the guest, from the templates of the data file: an email (with a subject line), a short message for
  // the chat, or a public answer to an online review, which names no room and no compensation.
  // Mid-sentence lower case, except in German, where nouns keep their capital; an Albanian sentence may open on a
  // one-letter word ("E kaluam…"), an English one keeps its "I".
  const firstLower = (text, lang) => (lang !== "de" && (/^\p{Lu}\p{Ll}/u.test(text) || (lang === "sq" && /^\p{Lu}\s/u.test(text))) ? text.charAt(0).toLowerCase() + text.slice(1) : text);
  const sentence = (text) => (text && !/[.!?…]$/.test(text) ? `${text}.` : text);
  const replyText = (row, cfg, { kind = "email", hotel = "", me = "", lang = "en", date = (iso) => iso, money = (n) => String(n) } = {}) => {
    const tpl = cfg.replies[kind] || cfg.replies.email;
    const category = categoryOf(cfg, row.category);
    const comp = compOf(cfg, row.comp);
    const vars = {
      guest: row.guest,
      hotel: hotel || cfg.text.hotelFallback,
      issue: category.issue,
      dept: category.dept,
      date: date(row.date),
      action: sentence(firstLower(row.action, lang)),
      id: row.id,
      comp: fill(comp.phrase, { value: money(row.value) }),
    };
    const line = (text) => fill(text, vars).replace(/ {2,}/g, " ").replace(/ ([.,:])/g, "$1");
    const hello = line(row.guest ? tpl.hello : tpl.helloAnon);
    const lines = [];
    if (tpl.subject) lines.push(line(tpl.subject), "");
    if (tpl.inline) lines.push(`${hello} ${line(tpl.sorry)}`);
    else lines.push(hello, "", line(tpl.sorry));
    if (isOpen(row) || !row.action) lines.push(line(tpl.doing));
    else lines.push(line(tpl.done));
    if (tpl.comp && comp.phrase && !isOpen(row)) lines.push(line(tpl.comp));
    if (tpl.prevent && row.learn.includes("notify")) lines.push(line(tpl.prevent));
    lines.push("", line(tpl.bye));
    if (me) lines.push(me);
    if (hotel) lines.push(hotel);
    return lines.join("\n");
  };

  window.GuestComplaintsMath = {
    STATUSES, SEVERITIES, SATISFIED, LEARN, addDays, mondayOf, minutesBetween, categoryOf, channelOf, severityOf, compOf,
    statusOf, isOpen, inHouse, ttr, targets, targetMinutes, withinTarget, median, resolveTimes, costs, satisfaction,
    per100, nightsTotal, hotelNights, repeats, pareto, weekly, learnCounts, removeNames, newId, cleanRow, cleanRows,
    keyOf, importRows, exampleShift, exampleRows, exampleNights, replyText,
  };

  // The page.
  const dataEl = document.getElementById("guest-complaints-data");
  const root = document.querySelector("[data-guest-complaints]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Workplace = window.Workplace || null;
  const Actions = window.ActionsStore || null;
  const { LANG, tx, num, showDate, write, read, loadState, el, int, euro, pct, plural, today, parseNumber, parseDate, logBook, resultLayout, panel, stat, focusCard, resultActions, flash, copy, dayMonth, inRange, periodTotal, rangeText, exampleMatches, lower } = kit;
  const M = window.GuestComplaintsMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const TOOL = "guest-complaints";
  // Hotel KPIs keeps its nights under the same language key as this page.
  const HOTEL_KEY = `sc-hotel-kpis${LANG === "en" ? "" : `-${LANG}`}`;
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const severityNote = entry.querySelector("[data-severity-note]");
  const paste = root.querySelector("#gc-paste");
  const nightsNote = root.querySelector("[data-nights-note]");
  const box = root.querySelector("[data-case-box]");
  const pick = box.querySelector("#gc-pick");
  const card = box.querySelector("[data-case-card]");
  const recovery = box.querySelector("[data-recovery]");
  const recoveryStatus = box.querySelector("[data-recovery-status]");
  const replyBox = box.querySelector("#gc-reply");
  const replyKind = box.querySelector("#gc-reply-kind");
  const caseParts = box.querySelector("[data-case-parts]");
  const caseEmpty = box.querySelector("[data-case-empty]");

  const state = loadState(KEY, { me: "", hotel: "", targetInHouse: "", targetPostStay: "", roomNights: "", nights: {}, rows: [], example: {}, totalsFor: {}, selected: "", from: "", to: "" });
  state.rows = M.cleanRows(state.rows, data);
  const save = () => write(KEY, state);

  const catName = (key) => M.categoryOf(data, key).name;
  const channelName = (key) => M.channelOf(data, key).name;
  const sevName = (key) => M.severityOf(data, key).name;
  const compName = (key) => M.compOf(data, key).name;
  const statusName = (key) => data.statuses[key] || key;
  const money = (value) => euro.format(value);
  // Whole euros on a chart axis: "€400", not "€400.00", so the labels fit.
  const wholeEuro = new Intl.NumberFormat(kit.LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const weekLabel = dayMonth(false);
  const complaints = (count) => plural(count, tx("complaint"), tx("complaints"));
  const roomText = (row) => (row.room ? `${tx("Room")} ${row.room}` : tx("No room"));
  const clock = () => new Date().toTimeString().slice(0, 5);
  const now = () => ({ date: today(), time: clock() });
  // "14 min", "5,1 h", "6 days": a duration in the unit a desk reads.
  const duration = (minutes) => (minutes === null || !Number.isFinite(minutes) ? "–"
    : minutes < 60 ? `${int.format(Math.round(minutes))} min`
    : minutes < 2880 ? `${num(minutes / 60, 1)} h`
    : `${int.format(Math.round(minutes / 1440))} ${tx("days")}`);
  const T = () => M.targets(data, state);
  const targetText = (tt) => tx("in the house {m} min, after the stay {h} h", { m: int.format(tt.inHouse), h: int.format(tt.postStay) });
  // Where a complaint stands against its target: met, missed, still open inside it, or past it.
  const clockOf = (row, tt = T()) => {
    const limit = M.targetMinutes(row, data, tt);
    if (!M.isOpen(row)) {
      const minutes = M.ttr(row);
      return { minutes, late: minutes !== null && minutes > limit };
    }
    const age = M.minutesBetween(row.date, row.time, today(), clock());
    return { minutes: age, late: age !== null && age > limit, open: true };
  };

  // The occupied room nights of the period: the example's own nights while it is shown, else Hotel KPIs of this
  // browser when it has every night of the period, else the number typed for the period.
  const roomNights = (from, to) => {
    const example = exampleMatches(state);
    const map = example ? state.nights : M.hotelNights(read(HOTEL_KEY, null));
    const n = M.nightsTotal(map, from, to);
    if (n.complete && n.sold > 0) return { ...n, value: n.sold, source: example ? "example" : "kpis" };
    const typed = periodTotal(state, "roomNights");
    const value = parseNumber(typed.value);
    if (value > 0) return { ...n, value: Math.round(value), source: "typed" };
    return { ...n, value: null, source: null, stale: typed.stale };
  };
  const nightsText = (nights) => {
    if (nights.source === "example") return tx("{n} occupied room nights of the example hotel.", { n: int.format(nights.value) });
    if (nights.source === "kpis") return tx("{n} occupied room nights from Hotel KPIs.", { n: int.format(nights.value) });
    if (nights.source === "typed") return tx("{n} occupied room nights, as typed.", { n: int.format(nights.value) });
    if (nights.stale) return tx("The room nights were typed for {range}. Enter them for this period.", { range: rangeText(nights.stale) });
    if (nights.have) return tx("Hotel KPIs has {a} of the {b} nights of this period. Enter the room nights of the period.", { a: int.format(nights.have), b: int.format(nights.days) });
    return tx("Enter the occupied room nights of the period, or fill in Hotel KPIs.");
  };

  const analyse = () => {
    const rows = inRange(state.rows, state.from, state.to);
    const dates = rows.map((row) => row.date).sort();
    const from = state.from || dates[0] || "";
    const to = state.to || dates.at(-1) || "";
    const tt = T();
    const nights = roomNights(from, to);
    const open = rows.filter(M.isOpen).sort((a, b) => SEVERITIES.indexOf(b.severity) - SEVERITIES.indexOf(a.severity) || `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    return {
      rows, from, to, tt, nights, open,
      rate: M.per100(rows.length, nights.value),
      target: M.withinTarget(rows, data, tt, now()),
      times: M.resolveTimes(rows, data),
      cost: M.costs(rows),
      sat: M.satisfaction(rows),
      repeats: M.repeats(state.rows, data.repeatDays).filter((item) => (!to || item.first <= to) && (!from || item.last >= from)),
      pareto: M.pareto(rows, data),
      weeks: M.weekly(rows, from, to),
      learn: M.learnCounts(rows),
      bySeverity: Object.fromEntries(SEVERITIES.map((key) => [key, rows.filter((row) => row.severity === key).length])),
    };
  };

  const problemText = (a) => {
    const top = a.pareto[0];
    if (!top) return "";
    return tx("{category}: {n} of {total} complaints in the period ({share}).", { category: top.name, n: int.format(top.value), total: int.format(a.rows.length), share: pct(top.share, 0) });
  };
  const rateText = (a) => (a.rate === null ? "–" : num(a.rate, 2));

  const summaryText = (a) => {
    const lines = [`${t.tool} | Stiven Catalyst`, `${tx("Period")}: ${rangeText({ from: a.from, to: a.to })}`, ""];
    lines.push(`${tx("Complaints")}: ${int.format(a.rows.length)} (${tx("{c} critical · {m} major · {o} open", { c: int.format(a.bySeverity.critical), m: int.format(a.bySeverity.major), o: int.format(a.open.length) })})`);
    lines.push(`${tx("Per 100 occupied room nights")}: ${rateText(a)}${a.nights.value ? ` (${tx("{n} room nights", { n: int.format(a.nights.value) })})` : ""}`);
    lines.push(`${tx("Resolved within target")}: ${a.target.share === null ? "–" : pct(a.target.share, 0)} (${tx("{a} of {b}", { a: int.format(a.target.within), b: int.format(a.target.decided) })}; ${targetText(a.tt)})`);
    lines.push(`${tx("Median time to resolve")}: ${duration(a.times.inHouse)} ${tx("in the house")} · ${duration(a.times.postStay)} ${tx("after the stay")}`);
    lines.push(`${tx("Recovery cost")}: ${money(a.cost.total)} · ${a.cost.perComplaint === null ? "–" : money(a.cost.perComplaint)} ${tx("per complaint")}`);
    lines.push(`${tx("Satisfied after recovery")}: ${a.sat.share === null ? "–" : pct(a.sat.share, 0)} (${tx("{a} of {b} who answered", { a: int.format(a.sat.yes), b: int.format(a.sat.answered) })})`);
    lines.push("", `${tx("Open for the next shift")}: ${int.format(a.open.length)}`);
    a.open.forEach((row) => {
      const c = clockOf(row, a.tt);
      lines.push(`- ${row.id} · ${roomText(row)} · ${catName(row.category)} · ${sevName(row.severity)} · ${showDate(row.date)} ${row.time}${row.guest ? ` · ${row.guest}` : ""}${c.late ? ` · ${tx("past the target")}` : ""}${row.what ? ` · ${row.what}` : ""}`);
    });
    if (a.repeats.length) {
      lines.push("", `${tx("Repeat rooms")}:`);
      a.repeats.forEach((item) => lines.push(`- ${tx("Room")} ${item.room} · ${catName(item.category)} · ${tx("{n} complaints, {from} – {to}", { n: int.format(item.count), from: showDate(item.first), to: showDate(item.last) })}`));
    }
    const top = a.pareto[0];
    if (top) {
      const advice = data.advice[top.key] || data.advice.default;
      lines.push("", `${tx("Start here")}: ${problemText(a)}`, `${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    return lines.join("\n");
  };

  // The complaints of the period for Pareto: one count per complaint, by category, the department as the filter and
  // the compensation as the value. The Pareto tool has a guest complaints template for exactly this table.
  const paretoTable = (a) => () => ({
    source: t.tool,
    template: "guest-complaints",
    headers: [tx("Date"), tx("Department"), tx("Room"), tx("Category"), tx("Count"), tx("Compensation €"), tx("Note")],
    rows: a.rows.map((row) => [row.date, M.categoryOf(data, row.category).dept, row.room, catName(row.category), "1", String(row.value), sevName(row.severity)]),
    map: { date: 0, filter: 1, category: 3, count: 4, value: 5 },
    measure: "count",
    valueLabel: tx("Compensation €"),
  });

  // The action for one complaint: a room defect goes to engineering with the room as the area, the rest to the
  // department that owns the category.
  const caseAction = (row) => {
    const category = M.categoryOf(data, row.category);
    const fix = Boolean(category.roomFix && row.room);
    return {
      title: row.room ? tx("{category} in room {room}: remove the cause", { category: category.name, room: row.room }) : tx("{category}: remove the cause", { category: category.name }),
      detail: [row.what, row.action].filter(Boolean).join(" "),
      source: TOOL,
      area: fix ? row.room : category.dept,
      priority: row.severity === "minor" ? "Medium" : "High",
      due: M.addDays(today(), row.severity === "critical" ? 2 : row.severity === "major" ? 7 : 14),
      check: row.room ? tx("No new complaint about {category} from room {room} in the next 30 days.", { category: lower(category.name), room: row.room }) : tx("No new complaint about {category} in the next 30 days.", { category: lower(category.name) }),
    };
  };
  const repeatAction = (item) => {
    const category = M.categoryOf(data, item.category);
    return {
      title: tx("Room {room}: {category} came back {n} times", { room: item.room, category: lower(category.name), n: int.format(item.count) }),
      detail: tx("{n} complaints about {category} from room {room} between {from} and {to}.", { n: int.format(item.count), category: lower(category.name), room: item.room, from: showDate(item.first), to: showDate(item.last) }),
      source: TOOL,
      area: category.roomFix ? item.room : category.dept,
      priority: "High",
      due: M.addDays(today(), 7),
      check: tx("No new complaint about {category} from room {room} in the next 30 days.", { category: lower(category.name), room: item.room }),
    };
  };
  const actionButton = (getAction) => (Actions ? Actions.linkButton(tx("Add to actions"), getAction) : kit.trackerLink(tx("Add to actions"), getAction));

  const openButton = (row) => {
    const button = el("button", "button-ghost gc-open", tx("Open it"));
    button.type = "button";
    button.dataset.pick = row.id;
    button.setAttribute("aria-label", `${tx("Open complaint")} ${row.id}`);
    return button;
  };

  const openCard = (a) => {
    const box2 = el("article", "result-card gc-open-card");
    box2.append(el("p", "result-label", tx("Open complaints")));
    if (!a.open.length) {
      box2.append(el("p", null, tx("Every complaint in the period is resolved.")));
      return box2;
    }
    const list = el("ul", "gc-list");
    a.open.forEach((row) => {
      const c = clockOf(row, a.tt);
      const item = el("li", c.late || row.severity === "critical" ? "is-danger" : row.severity === "major" ? "is-warn" : "");
      const text = el("div", "gc-list-text");
      text.append(
        el("strong", null, `${roomText(row)} · ${catName(row.category)} · ${sevName(row.severity)}`),
        el("span", `gc-flag${c.late ? " is-danger" : ""}`, c.late ? `✕ ${tx("open for {t}, past the target", { t: duration(c.minutes) })}` : `! ${tx("open for {t}", { t: duration(c.minutes) })}`),
        el("small", null, `${row.id} · ${showDate(row.date)} ${row.time}${row.guest ? ` · ${row.guest}` : ""}${row.what ? ` · ${row.what}` : ""}`),
      );
      item.append(text, openButton(row));
      list.append(item);
    });
    box2.append(list);
    return box2;
  };

  const repeatCard = (a) => {
    const box2 = el("article", "result-card gc-repeat-card");
    box2.append(el("p", "result-label", tx("Repeat rooms")));
    if (!a.repeats.length) {
      box2.append(el("p", null, tx("No room had the same complaint twice within {d} days.", { d: int.format(data.repeatDays) })));
      return box2;
    }
    box2.append(el("p", "dl-panel-note", tx("The same room with the same complaint again within {d} days: a cause to remove, not bad luck.", { d: int.format(data.repeatDays) })));
    const list = el("ul", "gc-list");
    a.repeats.forEach((item) => {
      const li = el("li", "is-warn");
      const text = el("div", "gc-list-text");
      text.append(
        el("strong", null, `${tx("Room")} ${item.room} · ${catName(item.category)}`),
        el("span", "gc-flag", `! ${tx("{n} complaints, {from} – {to}", { n: int.format(item.count), from: showDate(item.first), to: showDate(item.last) })}`),
        el("small", null, item.ids.join(", ")),
      );
      li.append(text, actionButton(() => repeatAction(item)));
      list.append(li);
    });
    box2.append(list);
    return box2;
  };

  // The log on paper: every complaint of the period, A4, only in print.
  const registerTable = (a) => {
    const wrap = el("section", "gc-register");
    wrap.append(el("h3", "result-label", `${t.tool} · ${rangeText({ from: a.from, to: a.to })}`));
    const table = el("table", "dl-table");
    const head = el("tr");
    [tx("ID"), tx("Logged"), tx("Room"), tx("Channel"), tx("Category"), tx("Severity"), tx("What happened"), tx("Action taken"), tx("Compensation"), tx("Status")].forEach((name) => {
      const th = el("th", null, name);
      th.scope = "col";
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    a.rows.forEach((row) => {
      const tr = el("tr");
      tr.append(
        el("td", "nowrap", row.id),
        el("td", "nowrap", `${showDate(row.date)} ${row.time}`),
        el("td", null, row.room),
        el("td", null, channelName(row.channel)),
        el("td", null, catName(row.category)),
        el("td", null, sevName(row.severity)),
        el("td", null, row.what),
        el("td", null, row.action),
        el("td", null, row.value > 0 ? `${compName(row.comp)} · ${money(row.value)}` : compName(row.comp)),
        el("td", null, statusText(row)),
      );
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    return wrap;
  };

  const statusText = (row) => {
    const c = clockOf(row);
    const status = statusName(M.statusOf(row));
    if (c.open) return `${status} · ${duration(c.minutes)}${c.late ? ` · ✕ ${tx("past the target")}` : ""}`;
    return `${status} · ${duration(c.minutes)}${c.late ? ` · ! ${tx("over the target")}` : c.minutes !== null ? " · ✓" : ""}`;
  };

  const renderResults = () => {
    results.replaceChildren();
    renderCase();
    results.hidden = !state.rows.length;
    if (!state.rows.length) {
      nightsNote.textContent = t.nightsNote;
      return;
    }
    const a = analyse();
    nightsNote.textContent = `${nightsText(a.nights)} ${t.nightsNote}`;

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${rangeText({ from: a.from, to: a.to })}`));
    const title = el("h2");
    if (!a.rows.length) {
      title.append(tx("No complaints in this period."));
      head.append(title);
      results.append(head);
      return;
    }
    title.append(el("span", null, int.format(a.rows.length)), ` ${a.rows.length === 1 ? tx("complaint") : tx("complaints")} · ${a.rate === null ? tx("{p} resolved within target", { p: a.target.share === null ? "–" : pct(a.target.share, 0) }) : tx("{r} per 100 occupied room nights", { r: rateText(a) })}`);
    head.append(title);

    const stats = el("div", "dl-stats");
    stats.append(stat(tx("Complaints"), int.format(a.rows.length), tx("{c} critical · {m} major · {o} open", { c: int.format(a.bySeverity.critical), m: int.format(a.bySeverity.major), o: int.format(a.open.length) })));
    stats.append(stat(tx("Per 100 occupied room nights"), rateText(a), nightsText(a.nights)));
    stats.append(stat(tx("Resolved within target"), a.target.share === null ? "–" : pct(a.target.share, 0), `${tx("{a} of {b}", { a: int.format(a.target.within), b: int.format(a.target.decided) })} · ${targetText(a.tt)}`));
    stats.append(stat(tx("Median time to resolve"), duration(a.times.inHouse), `${tx("in the house")} · ${tx("after the stay: {t}", { t: duration(a.times.postStay) })}`));
    stats.append(stat(tx("Recovery cost"), money(a.cost.total), `${a.cost.perComplaint === null ? "–" : money(a.cost.perComplaint)} ${tx("per complaint")} · ${tx("{n} compensated", { n: int.format(a.cost.compensated) })}`));
    stats.append(stat(tx("Satisfied after recovery"), a.sat.share === null ? "–" : pct(a.sat.share, 0), `${tx("{a} of {b} who answered", { a: int.format(a.sat.yes), b: int.format(a.sat.answered) })} · ${tx("{n} not known", { n: int.format(a.sat.unknown) })}`));
    stats.append(stat(tx("Repeat rooms"), int.format(a.repeats.length), a.repeats.length ? a.repeats.slice(0, 3).map((item) => `${item.room} · ${catName(item.category)}`).join("; ") : tx("same room, same complaint, {d} days", { d: int.format(data.repeatDays) })));

    const notes = [openCard(a), repeatCard(a)];
    const critical = a.rows.filter((row) => row.severity === "critical");
    if (critical.length) notes.push(el("p", "dl-warning", `${tx("{n} critical: the general manager is told at once and an incident report is written for each.", { n: int.format(critical.length) })} ${critical.map((row) => `${roomText(row)} · ${catName(row.category)} (${showDate(row.date)})`).join("; ")}`));

    let focus = null;
    const top = a.pareto[0];
    if (top) {
      const advice = data.advice[top.key] || data.advice.default;
      focus = focusCard({ title: top.name, detail: M.categoryOf(data, top.key).dept, lede: problemText(a), advice });
      const action = () => ({
        title: tx("Fewer complaints about {category}", { category: lower(top.name) }),
        detail: `${problemText(a)} ${advice.moves[0]}`,
        source: TOOL,
        area: M.categoryOf(data, top.key).dept,
        priority: top.share >= 0.2 ? "High" : "Medium",
        due: M.addDays(today(), 14),
        check: tx("Fewer complaints about {category} per 100 occupied room nights over the next four weeks.", { category: lower(top.name) }),
      });
      const buttons = el("div", "tool-actions");
      buttons.append(actionButton(action));
      focus.append(buttons);
    }

    const actions = resultActions(() => summaryText(a), problemText(a) || t.tool, paretoTable(a));

    const vital = a.pareto.filter((item) => item.cls === "A");
    const paretoPanel = panel(tx("Complaints by category (Pareto)"), `${tx("Largest first. The highlighted bars are the vital few that make up 80 % of the complaints:")} ${vital.map((item) => item.name).join(", ")}.`);
    paretoPanel.append(Chart.figure(Chart.bars(a.pareto.map((item) => ({ label: item.name, value: item.value, tip: `${item.name}: ${int.format(item.value)} (${pct(item.share, 0)}, ${tx("cumulative")} ${pct(item.cumulative, 0)})` })), { title: tx("Complaints by category (Pareto)"), highlight: (item) => vital.some((v) => v.name === item.label), yMax: Chart.niceMax(Math.max(4, ...a.pareto.map((item) => item.value))), format: (v) => int.format(v) }), { fileName: "guest-complaints-pareto" }));

    const weekNights = (week) => {
      const from = week.week < a.from ? a.from : week.week;
      const end = M.addDays(week.week, 6);
      const to = end > a.to ? a.to : end;
      const n = roomNights(from, to);
      return n.source && n.source !== "typed" ? M.per100(week.total, n.value) : null;
    };
    const rates = a.weeks.map((week) => ({ week, rate: weekNights(week) }));
    const rateLine = rates.filter((item) => item.rate !== null).map((item) => `${tx("Week of {date}", { date: showDate(item.week.week) })}: ${num(item.rate, 2)}`).join(" · ");
    const weekPanel = panel(tx("Complaints per week"), `${tx("By severity. Weeks start on Monday.")}${rateLine ? ` ${tx("Per 100 occupied room nights")}: ${rateLine}.` : ""}`);
    const sevColors = { [sevName("minor")]: Chart.C.bar, [sevName("major")]: Chart.C.warn, [sevName("critical")]: Chart.C.danger };
    weekPanel.append(Chart.figure(Chart.stacked(a.weeks.map((week) => ({ label: weekLabel(new Date(`${week.week}T00:00:00Z`)), parts: SEVERITIES.map((key) => ({ key: sevName(key), value: week[key] })) })), { title: tx("Complaints per week"), keys: SEVERITIES.map(sevName), colors: sevColors, format: (v) => int.format(v) }), { fileName: "guest-complaints-weeks" }));

    const costPanel = panel(tx("Recovery cost by gesture"), a.cost.total ? tx("{total} in the period: {per} per complaint, {paid} per compensated complaint.", { total: money(a.cost.total), per: money(a.cost.perComplaint), paid: money(a.cost.perCompensated) }) : tx("No compensation with a value in the period."));
    if (a.cost.byType.length) costPanel.append(Chart.figure(Chart.bars(a.cost.byType.map((item) => ({ label: compName(item.key), value: item.value, tip: `${compName(item.key)}: ${money(item.value)}` })), { title: tx("Recovery cost by gesture"), format: (v) => wholeEuro.format(v), labels: true }), { fileName: "guest-complaints-cost" }));

    const skipped = [...a.learn].sort((x, y) => x.value - y.value)[0];
    const learnName = (key) => data.learn.find((step) => step.key === key)?.name || key;
    const learnPanel = panel(tx("LEARN, step by step"), `${tx("How many of the {n} complaints went through each step.", { n: int.format(a.rows.length) })}${skipped && skipped.value < a.rows.length ? ` ${tx("Most often skipped: {step}.", { step: learnName(skipped.key) })}` : ""}`);
    learnPanel.append(Chart.figure(Chart.bars(a.learn.map((item) => ({ label: learnName(item.key), value: item.value, tip: `${learnName(item.key)}: ${int.format(item.value)} / ${int.format(a.rows.length)} (${pct(item.value / a.rows.length, 0)})` })), { title: tx("LEARN, step by step"), yMax: Chart.niceMax(a.rows.length), format: (v) => int.format(v) }), { fileName: "guest-complaints-learn" }));

    resultLayout(results, { head, stats, notes, focus, actions, panels: [paretoPanel, weekPanel, costPanel, learnPanel] });
    results.append(registerTable(a));
  };

  // Box 4: one complaint, its recovery, the reply to the guest and its action.
  const selected = () => state.rows.find((row) => row.id === state.selected) || null;
  const fillPick = () => {
    const option = (row) => {
      const node = el("option", null, `${row.id} · ${row.room || "–"} · ${catName(row.category)}`);
      node.value = row.id;
      return node;
    };
    const groups = STATUSES.map((status) => {
      const rows = state.rows.filter((row) => M.statusOf(row) === status).reverse();
      if (!rows.length) return null;
      const group = el("optgroup");
      group.label = statusName(status);
      group.append(...rows.map(option));
      return group;
    }).filter(Boolean);
    pick.replaceChildren(...groups);
    if (!selected()) state.selected = state.rows.filter(M.isOpen).at(-1)?.id || state.rows.at(-1)?.id || "";
    pick.value = state.selected;
  };
  const detailRow = (list, label, value) => {
    if (!value) return;
    list.append(el("dt", null, label), el("dd", null, value));
  };
  const syncRecoveryFields = () => {
    const f = recovery.elements;
    recovery.querySelector("[data-resolved-fields]").hidden = f.status.value === "open";
    recovery.querySelector("[data-followed-field]").hidden = f.status.value !== "followed";
  };
  let shownId = "";
  const renderCase = () => {
    fillPick();
    const row = selected();
    caseParts.hidden = !row;
    caseEmpty.hidden = Boolean(row);
    if (!row) {
      card.replaceChildren();
      shownId = "";
      return;
    }
    const c = clockOf(row);
    const status = M.statusOf(row);
    card.replaceChildren();
    const head = el("div", "gc-case-head");
    const flagState = c.late ? "danger" : status === "open" ? "warn" : "ok";
    head.append(el("strong", "gc-case-id", row.id), el("span", `gc-flag is-${flagState}`, statusText(row)));
    card.append(head);
    const severity = M.severityOf(data, row.severity);
    const list = el("dl", "gc-facts");
    detailRow(list, tx("Logged"), `${showDate(row.date)} ${row.time}${row.takenBy ? ` · ${row.takenBy}` : ""}`);
    detailRow(list, tx("Room"), row.room);
    detailRow(list, tx("Channel"), `${channelName(row.channel)} · ${M.inHouse(row, data) ? tx("in the house") : tx("after the stay")}`);
    detailRow(list, tx("Category"), `${catName(row.category)} · ${M.categoryOf(data, row.category).dept}`);
    detailRow(list, tx("Severity"), `${severity.name} · ${tx("Escalate to")}: ${severity.escalate}`);
    detailRow(list, tx("What happened"), row.what);
    detailRow(list, tx("Guest"), row.guest);
    if (row.followed) detailRow(list, tx("Followed up"), `${showDate(row.followed)} · ${tx("Guest satisfied")}: ${data.satisfied[row.satisfied]}`);
    card.append(list);

    // A newly chosen complaint fills the recovery form and the reply with its own values.
    if (shownId !== row.id) {
      shownId = row.id;
      const f = recovery.elements;
      recovery.querySelectorAll("input[name=learn]").forEach((input) => { input.checked = row.learn.includes(input.value); });
      f.action.value = row.action;
      f.comp.value = row.comp;
      f.compValue.value = row.value ? num(row.value, 2) : "";
      f.status.value = status;
      f.resolvedDate.value = row.resolvedDate;
      f.resolvedTime.value = row.resolvedTime;
      f.followed.value = row.followed;
      f.satisfied.value = row.satisfied;
      syncRecoveryFields();
      replyKind.value = row.channel === "review" ? "review" : row.channel === "chat" ? "message" : "email";
    }
    renderReply();
  };
  const renderReply = () => {
    const row = selected();
    if (!row) return;
    replyBox.value = M.replyText(row, data, {
      kind: replyKind.value,
      hotel: state.hotel.trim() || Workplace?.get().site || "",
      me: state.me.trim(),
      lang: LANG,
      date: showDate,
      money,
    });
  };
  const choose = (id, { scroll = false } = {}) => {
    state.selected = id;
    save();
    renderCase();
    if (scroll) {
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      pick.focus({ preventScroll: true });
    }
  };

  results.addEventListener("click", (event) => {
    const open = event.target.closest("[data-pick]");
    if (open) choose(open.dataset.pick, { scroll: true });
  });
  root.querySelector("[data-log]").addEventListener("click", (event) => {
    const open = event.target.closest("[data-pick]");
    if (open) choose(open.dataset.pick, { scroll: true });
  });
  pick.addEventListener("change", () => choose(pick.value));

  // A step of LEARN counts the moment it is ticked: the desk ticks while it talks to the guest.
  recovery.addEventListener("change", (event) => {
    const row = selected();
    const f = recovery.elements;
    if (event.target.name === "learn" && row) {
      row.learn = LEARN.filter((key) => recovery.querySelector(`input[name=learn][value=${key}]`)?.checked);
      book.render();
      save();
    } else if (event.target.name === "status") {
      if (f.status.value !== "open" && !f.resolvedDate.value) {
        f.resolvedDate.value = today();
        f.resolvedTime.value = clock();
      }
      if (f.status.value === "followed" && !f.followed.value) f.followed.value = today();
      syncRecoveryFields();
    } else if (event.target.name === "comp") {
      // A gesture brings its usual value; a value typed for it stays.
      const value = M.compOf(data, f.comp.value).value;
      f.compValue.value = value ? num(value, 2) : "";
    }
  });
  recovery.addEventListener("submit", (event) => {
    event.preventDefault();
    const row = selected();
    if (!row) return;
    const f = recovery.elements;
    const status = f.status.value;
    const action = f.action.value.trim();
    const value = parseNumber(f.compValue.value);
    const next = { learn: LEARN.filter((key) => recovery.querySelector(`input[name=learn][value=${key}]`)?.checked), action, comp: f.comp.value, value: Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : 0, satisfied: f.satisfied.value, resolvedDate: "", resolvedTime: "", followed: "" };
    if (status !== "open") {
      const date = parseDate(f.resolvedDate.value);
      const time = f.resolvedTime.value;
      if (!date || !time) {
        (date ? f.resolvedTime : f.resolvedDate).focus();
        flash(recoveryStatus, tx("Enter the date and time it was resolved."));
        return;
      }
      const minutes = M.minutesBetween(row.date, row.time || "00:00", date, time);
      if (minutes !== null && minutes < 0) {
        f.resolvedDate.focus();
        flash(recoveryStatus, tx("It cannot be resolved before it was logged."));
        return;
      }
      if (!action) {
        f.action.focus();
        flash(recoveryStatus, tx("Write what was done, so the next shift and the reply know it."));
        return;
      }
      next.resolvedDate = date;
      next.resolvedTime = time;
      if (status === "followed") {
        const followed = parseDate(f.followed.value);
        if (!followed || followed < date) {
          f.followed.focus();
          flash(recoveryStatus, tx("Enter the day the guest was contacted again, on or after the day it was resolved."));
          return;
        }
        next.followed = followed;
      }
    }
    Object.assign(row, next);
    shownId = "";
    book.render();
    save();
    flash(recoveryStatus, tx("{id}: {status}.", { id: row.id, status: statusName(M.statusOf(row)) }));
  });
  replyKind.addEventListener("change", renderReply);
  box.querySelector("[data-copy-reply]").addEventListener("click", (event) => { if (replyBox.value) copy(replyBox.value, event.currentTarget); });
  box.querySelector("[data-case-actions]").append(actionButton(() => (selected() ? caseAction(selected()) : {})));

  // Guest names are personal data: once a complaint is resolved, the name has done its job.
  root.querySelector("[data-forget]").addEventListener("click", () => {
    const status = root.querySelector("[data-log-status]");
    const count = state.rows.filter((row) => !M.isOpen(row) && row.guest).length;
    if (!count) {
      flash(status, tx("No closed complaint has a guest name."));
      return;
    }
    if (!window.confirm(tx("Remove the guest names of {n}?", { n: plural(count, tx("closed complaint"), tx("closed complaints")) }))) return;
    state.rows = M.removeNames(state.rows).rows;
    book.render();
    save();
    flash(status, tx("Guest names removed from {n}.", { n: plural(count, tx("closed complaint"), tx("closed complaints")) }));
  });

  const statusCell = (row) => {
    const c = clockOf(row);
    const cell = el("td", `gc-status${c.late ? " is-danger" : M.isOpen(row) ? " is-warn" : ""}`);
    cell.append(el("span", null, statusText(row)), openButton(row));
    return cell;
  };

  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    clearExample: () => {
      state.me = "";
      state.hotel = "";
      state.selected = "";
      state.nights = {};
      state.roomNights = "";
    },
    cells: (row) => [
      el("td", "nowrap gc-id", row.id),
      el("td", "nowrap", `${showDate(row.date)} ${row.time}`),
      el("td", "nowrap", row.room),
      el("td", null, catName(row.category)),
      el("td", `nowrap${row.severity === "critical" ? " gc-critical" : ""}`, sevName(row.severity)),
      statusCell(row),
    ],
    removeLabel: (row) => tx("Remove {id}", { id: row.id }),
    removedText: (row) => tx("Removed {id}.", { id: row.id }),
    countText: (rows) => `${complaints(rows.length)} · ${tx("{n} open", { n: int.format(rows.filter(M.isOpen).length) })}`,
    importRows: (text) => M.importRows(text, data, new Set(state.rows.map((row) => row.id))),
    importText: {
      none: tx("No rows found. Check that each row starts with the date of the complaint."),
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date", { n: skipped }) : ""}.`,
    },
    loadExample: () => {
      state.rows = M.exampleRows(data, today());
      state.nights = M.exampleNights(data, today());
      state.roomNights = "";
      state.me = data.example.me;
      state.hotel = data.example.hotel;
      state.selected = state.rows.find(M.isOpen)?.id || "";
      shownId = "";
    },
    clearText: tx("Clear the whole {tool} log?", { tool: t.tool }),
    csv: () => {
      const tt = T();
      return {
        name: t.csv,
        rows: [
          [tx("ID"), tx("Date"), tx("Time"), tx("Room"), tx("Channel"), tx("Category"), tx("Department"), tx("Severity"), tx("What happened"), tx("Guest"), tx("Taken by"), "LEARN", tx("Action taken"), tx("Compensation"), tx("Value €"), tx("Resolved date"), tx("Resolved time"), tx("Minutes to resolve"), tx("Within target"), tx("Follow-up date"), tx("Status"), tx("Guest satisfied")],
          ...state.rows.map((row) => {
            const minutes = M.ttr(row);
            return [row.id, row.date, row.time, row.room, channelName(row.channel), catName(row.category), M.categoryOf(data, row.category).dept, sevName(row.severity), row.what, row.guest, row.takenBy, row.learn.map((key) => key.charAt(0).toUpperCase()).join(""), row.action, compName(row.comp), row.value, row.resolvedDate, row.resolvedTime, minutes ?? "", minutes === null ? "" : minutes <= M.targetMinutes(row, data, tt) ? tx("Yes") : tx("No"), row.followed, statusName(M.statusOf(row)), data.satisfied[row.satisfied]];
          }),
        ],
      };
    },
    renderResults,
  });

  // Log a complaint.
  const form = entry.elements;
  const showSeverity = () => {
    const severity = M.severityOf(data, form.severity.value);
    severityNote.textContent = `${severity.means} ${tx("Escalate to")}: ${severity.escalate}.`;
  };
  form.date.value = today();
  form.time.value = clock();
  form.severity.addEventListener("change", showSeverity);
  showSeverity();
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date of the complaint."));
      return;
    }
    if (!form.time.value) {
      form.time.focus();
      flash(entryStatus, tx("Enter the time: the clock for the target starts here."));
      return;
    }
    if (!form.what.value.trim()) {
      form.what.focus();
      flash(entryStatus, tx("Write what happened, in the guest's words."));
      return;
    }
    const [row] = M.cleanRows([{
      date,
      time: form.time.value,
      room: form.room.value,
      channel: form.channel.value,
      category: form.category.value,
      severity: form.severity.value,
      what: form.what.value,
      guest: form.guest.value,
      takenBy: form.takenBy.value,
      learn: [],
    }], data, new Set(state.rows.map((item) => item.id)));
    // Keep the date, the channel and who took it: the next complaint often comes on the same shift.
    form.room.value = "";
    form.what.value = "";
    form.guest.value = "";
    form.time.value = clock();
    state.selected = row.id;
    shownId = "";
    book.add(row);
    flash(entryStatus, tx("Added {id}. Work through the recovery in box 4.", { id: row.id }));
    form.what.focus();
  });

  book.render();
})();
