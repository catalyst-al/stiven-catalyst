(() => {
  // Hotel KPIs: the daily statistics of a hotel (rooms sold, room revenue, no-shows, rooms out of order, complaints),
  // read as occupancy, ADR and RevPAR against the month's budget, with the forecast for the month, the weekday pattern,
  // the revenue that leaked and the KPI to work on first. The log is { rows: [{ date, available, sold, roomRev, otherRev,
  // arrivals, departures, noShows, walkIns, ooo, complaints, covers, cause }] }, one row per night.
  const kit = window.ToolKit;

  // The arithmetic, apart from the page, so a test can call it.
  const CAUSES = ["cleanliness", "noise", "billing", "service", "maintenance", "other"];
  const COUNTS = ["arrivals", "departures", "noShows", "walkIns", "ooo", "complaints", "covers"];
  const SUMS = ["available", "sold", "roomRev", "otherRev", ...COUNTS];
  const DAY = 864e5;
  const ratio = (a, b) => (b > 0 ? a / b : null);

  const isIso = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const addDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
  // Monday is 0: hotels read their week from Monday, and so does the weekday chart.
  const weekday = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
  const monthDays = (ym) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0)).getUTCDate();
  const addMonths = (ym, n) => new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1 + n, 1)).toISOString().slice(0, 7);

  // The KPIs of one night or of any sum of nights. Occupancy is on the rooms available as the PMS counts them; a share
  // without its base (no room sold, no arrival expected) is null, not 0.
  const occupancy = (sold, available) => ratio(sold, available);
  const adr = (roomRev, sold) => ratio(roomRev, sold);
  const revpar = (roomRev, available) => ratio(roomRev, available);
  const trevpar = (roomRev, otherRev, available) => ratio(roomRev + otherRev, available);
  // A no-show is an arrival that was expected and did not come: its rate is over the arrivals plus the no-shows.
  const noShowRate = (noShows, arrivals) => ratio(noShows, arrivals + noShows);
  const oooShare = (ooo, available) => ratio(ooo, available);
  const complaintsPer100 = (complaints, sold) => (sold > 0 ? (complaints / sold) * 100 : null);

  const totals = (rows) => {
    const sum = Object.fromEntries(SUMS.map((name) => [name, 0]));
    rows.forEach((row) => SUMS.forEach((name) => { sum[name] += Number(row[name]) || 0; }));
    return { ...sum, days: rows.length };
  };
  const kpis = (t) => ({
    occ: occupancy(t.sold, t.available),
    adr: adr(t.roomRev, t.sold),
    revpar: revpar(t.roomRev, t.available),
    trevpar: trevpar(t.roomRev, t.otherRev, t.available),
    noShowRate: noShowRate(t.noShows, t.arrivals),
    oooShare: oooShare(t.ooo, t.available),
    complaintsPer100: complaintsPer100(t.complaints, t.sold),
  });

  // A night cannot sell more rooms than it has. Such a night (stored before the page checked it) stays in the log,
  // marked, so it can be corrected, but it counts in no total: one 120 % night lifts the month, the forecast and Signals.
  const oversold = (row) => Boolean(row) && row.sold > row.available;
  // One row per night: a day pasted twice keeps its latest figures. Oldest first. dailyRows are the nights that count;
  // oversoldNights the ones whose latest figures sell more rooms than there are.
  const nightsOf = (rows) => {
    const byDate = new Map();
    rows.forEach((row) => { if (row && isIso(row.date)) byDate.set(row.date, row); });
    return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  };
  const dailyRows = (rows) => nightsOf(rows).filter((row) => !oversold(row));
  const oversoldNights = (rows) => nightsOf(rows).filter(oversold);
  const monthRows = (rows, ym) => rows.filter((row) => String(row.date).startsWith(`${ym}-`));

  // The budget as typed: occupancy in % (78) or as a share (0.78), ADR and RevPAR in €. Without a RevPAR budget it is
  // occupancy times ADR, which is what RevPAR is.
  const budgetOf = (settings) => {
    const value = (text) => {
      const n = kit.parseNumber(String(text ?? "").replace(/%/g, ""));
      return Number.isFinite(n) && n > 0 ? n : null;
    };
    const occTyped = value(settings.budgetOcc);
    const occ = occTyped === null ? null : occTyped > 1 ? occTyped / 100 : occTyped;
    const adrBudget = value(settings.budgetAdr);
    const typed = value(settings.budgetRevpar);
    const derived = typed === null && occ !== null && adrBudget !== null;
    return { occ, adr: adrBudget, revpar: typed ?? (derived ? occ * adrBudget : null), derived };
  };

  // Averages by weekday, Monday first: the sums of each weekday and their KPIs.
  const weekdayAverages = (rows) => Array.from({ length: 7 }, (_, day) => {
    const t = totals(rows.filter((row) => weekday(row.date) === day));
    return { weekday: day, n: t.days, sold: t.sold, available: t.available, roomRev: t.roomRev, ...kpis(t) };
  });

  // The month as it will end: the nights logged, plus every night not logged at the average of the same weekday over the
  // last four weeks (a business hotel's Tuesday is not its Saturday), or the month's own daily average where that
  // weekday has no night yet. With nothing logged in the month there is no forecast.
  const forecast = (rows, ym, rooms = 0) => {
    const daily = dailyRows(rows);
    const month = monthRows(daily, ym);
    if (!month.length) return null;
    const last = month.at(-1).date;
    const week = weekdayAverages(daily.filter((row) => row.date <= last && row.date > addDays(last, -28)));
    const mtd = totals(month);
    const perDay = { sold: mtd.sold / month.length, available: mtd.available / month.length, roomRev: mtd.roomRev / month.length };
    const have = new Set(month.map((row) => row.date));
    const days = monthDays(ym);
    let { sold, available, roomRev } = mtd;
    let filled = 0, byWeekday = 0;
    for (let d = 1; d <= days; d++) {
      const iso = `${ym}-${String(d).padStart(2, "0")}`;
      if (have.has(iso)) continue;
      filled++;
      const w = week[weekday(iso)];
      const source = w.n ? { sold: w.sold / w.n, available: w.available / w.n, roomRev: w.roomRev / w.n } : perDay;
      if (w.n) byWeekday++;
      sold += source.sold;
      available += source.available || rooms;
      roomRev += source.roomRev;
    }
    return { days, logged: month.length, filled, byWeekday, sold, available, roomRev, occ: occupancy(sold, available), adr: adr(roomRev, sold), revpar: revpar(roomRev, available) };
  };

  // The best and the worst night by RevPAR, the number that holds occupancy and rate together.
  const bestWorst = (rows) => {
    const nights = rows.filter((row) => row.available > 0).map((row) => ({ row, revpar: revpar(row.roomRev, row.available), occ: occupancy(row.sold, row.available) }));
    if (!nights.length) return null;
    const sorted = [...nights].sort((a, b) => b.revpar - a.revpar || a.row.date.localeCompare(b.row.date));
    return { best: sorted[0], worst: sorted.at(-1) };
  };

  // A night against the same weekday a week before: the rooms and the RevPAR it gained or lost.
  const pickup = (rows, date) => {
    const daily = dailyRows(rows);
    const row = daily.find((item) => item.date === date);
    if (!row) return null;
    const before = daily.find((item) => item.date === addDays(date, -7)) || null;
    const now = revpar(row.roomRev, row.available);
    const then = before ? revpar(before.roomRev, before.available) : null;
    return {
      date, prevDate: addDays(date, -7), sold: row.sold, prevSold: before ? before.sold : null,
      diff: before ? row.sold - before.sold : null, revpar: now, prevRevpar: then, revparDiff: then === null || now === null ? null : now - then,
    };
  };

  // Revenue the house had and lost: every no-show and every room out of order priced at the ADR of its night (the
  // month's ADR on a night with no room sold). A no-show fee charged and a night that would not have filled anyway make
  // the real loss smaller, so this is the most that leaked.
  const leaks = (rows, fallbackAdr = 0) => {
    const out = { noShows: 0, ooo: 0, noShowNights: 0, oooNights: 0 };
    rows.forEach((row) => {
      const rate = adr(row.roomRev, row.sold) ?? fallbackAdr ?? 0;
      out.noShows += (row.noShows || 0) * rate;
      out.ooo += (row.ooo || 0) * rate;
      out.noShowNights += row.noShows || 0;
      out.oooNights += row.ooo || 0;
    });
    return out;
  };

  // Complaints by cause; a night with complaints and no cause counts under "".
  const causeTally = (rows) => {
    const map = new Map();
    rows.forEach((row) => { if (row.complaints > 0) map.set(row.cause || "", (map.get(row.cause || "") || 0) + row.complaints); });
    return [...map].map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
  };

  // What each weak KPI costs this month, in euros, so they can be put in one order: the room nights short of the
  // budget occupancy, the euros short of the budget ADR on every room sold, and the no-shows, rooms out of order and
  // complaints above their limits (a complaint counted as one room night: the compensation, and a guest who does not
  // return). The weakest KPI is the first with a cost above 0.
  const gaps = (t, budget, limits) => {
    const k = kpis(t);
    const rate = k.adr || budget.adr || 0;
    const list = [
      { key: "occupancy", euros: budget.occ ? Math.max(0, budget.occ * t.available - t.sold) * rate : 0 },
      { key: "adr", euros: budget.adr && k.adr !== null ? Math.max(0, budget.adr - k.adr) * t.sold : 0 },
      { key: "noShows", euros: Math.max(0, t.noShows - limits.noShowRate * (t.arrivals + t.noShows)) * rate },
      { key: "ooo", euros: Math.max(0, t.ooo - limits.oooShare * t.available) * rate },
      { key: "complaints", euros: Math.max(0, t.complaints - (limits.complaintsPer100 / 100) * t.sold) * rate },
    ];
    return list.sort((a, b) => b.euros - a.euros);
  };

  // A night's colour on the calendar: on budget, within 10 points of it, or further below. Without a budget, no colour.
  const dayState = (occ, budgetOcc) => {
    if (occ === null || occ === undefined) return "none";
    if (!budgetOcc) return "muted";
    if (occ >= budgetOcc - 1e-9) return "ok";
    return occ >= budgetOcc - 0.1 ? "warn" : "danger";
  };

  // A pasted cause: its key, its name in this language or in English, or the start of one; another word is "other".
  const EN_CAUSES = { cleanliness: "cleanliness", noise: "noise", billing: "billing", service: "service", maintenance: "maintenance", other: "other" };
  const causeOf = (value, cfg = {}) => {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return "";
    const names = CAUSES.map((key) => [key, [key, EN_CAUSES[key], cfg.causes?.[key]].filter(Boolean).map((name) => name.toLowerCase())]);
    const exact = names.find(([, list]) => list.includes(text));
    if (exact) return exact[0];
    const start = text.length >= 3 && names.find(([, list]) => list.some((name) => name.startsWith(text)));
    return start ? start[0] : "other";
  };
  // A saved row holds numbers; a typed or pasted one holds text in the page's number format.
  const numberOf = (value) => (typeof value === "number" ? value : kit.parseNumber(value));
  const count = (value) => {
    const n = Math.round(numberOf(value));
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const money = (value) => {
    const n = numberOf(value);
    return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
  };
  // A saved or typed row, cleaned: a night needs a date, rooms available and rooms sold; the rest falls back to 0.
  const cleanRow = (row, rooms = 0) => {
    if (!row || typeof row !== "object") return null;
    const date = kit.parseDate(row.date);
    const available = count(row.available) || count(rooms);
    const soldText = String(row.sold ?? "").trim();
    const sold = Math.round(numberOf(row.sold));
    if (!date || !available || !soldText || !Number.isFinite(sold) || sold < 0) return null;
    const out = { date, available, sold, roomRev: money(row.roomRev), otherRev: money(row.otherRev) };
    COUNTS.forEach((name) => { out[name] = count(row[name]); });
    out.cause = CAUSES.includes(row.cause) ? row.cause : "";
    return out;
  };
  // Rows from a spreadsheet or a PMS export: date, rooms available, rooms sold, room revenue, other revenue, arrivals,
  // departures, no-shows, walk-ins, out of order, complaints, breakfast covers, complaint cause. An empty "rooms
  // available" takes the rooms of the settings; a first row without a date is a header. A row with more rooms sold
  // than available is left out and counted apart (`oversold`).
  const importRows = (text, cfg = {}, rooms = 0) => {
    const added = [];
    let skipped = 0, tooMany = 0;
    kit.parseRows(text).forEach((cells, index) => {
      const [date, available, sold, roomRev, otherRev, arrivals, departures, noShows, walkIns, ooo, complaints, covers, cause] = cells;
      const row = cleanRow({ date, available, sold, roomRev, otherRev, arrivals, departures, noShows, walkIns, ooo, complaints, covers, cause: causeOf(cause, cfg) }, rooms);
      if (!row) {
        if (index > 0 || kit.parseDate(date)) skipped++;
        return;
      }
      if (oversold(row)) { tooMany++; return; }
      added.push(row);
    });
    return { added, skipped, oversold: tooMany };
  };
  // The example of the data file, moved forward so that its last night is recent.
  const exampleRows = (cfg) => importRows(kit.recentExample(cfg.example.rows).map((row) => row.replace(/\|/g, "\t")).join("\n"), cfg, cfg.example.rooms).added;

  window.HotelKpisMath = {
    CAUSES, occupancy, adr, revpar, trevpar, noShowRate, oooShare, complaintsPer100, totals, kpis, dailyRows, oversold, oversoldNights, monthRows,
    budgetOf, weekday, weekdayAverages, forecast, bestWorst, pickup, leaks, causeTally, gaps, dayState, causeOf, cleanRow,
    importRows, exampleRows, monthDays, addMonths,
  };
  // The name the brief gives the module.
  window.HotelMath = window.HotelKpisMath;

  // The page.
  const dataEl = document.getElementById("hotel-kpis-data");
  const root = document.querySelector("[data-hotel-kpis]");
  const Chart = window.ChartKit;
  if (!dataEl || !root || !kit || !Chart) return;
  const Actions = window.ActionsStore || null;
  const { tx, num, showDate, write, loadState, el, int, euro, pct, plural, today, parseNumber, parseDate, dayMonth,
    logBook, resultLayout, panel, stat, barList, focusCard, resultActions, flash, exampleMatches } = kit;
  const M = window.HotelKpisMath;

  const data = JSON.parse(dataEl.textContent);
  const t = data.text;
  const KEY = data.storageKey;
  const results = document.querySelector("[data-results]");
  const entry = root.querySelector("[data-entry]");
  const entryStatus = root.querySelector("[data-entry-status]");
  const paste = root.querySelector("#hk-paste");

  const state = loadState(KEY, { rooms: "", budgetOcc: "", budgetAdr: "", budgetRevpar: "", month: "", rows: [], example: {}, totalsFor: {}, from: "", to: "" });
  state.rows = state.rows.map((row) => M.cleanRow(row)).filter(Boolean);
  const save = () => write(KEY, state);

  const rooms = () => count(state.rooms);
  const money2 = (value) => (Number.isFinite(value) ? euro.format(value) : "–");
  const euro0 = new Intl.NumberFormat(kit.LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const money0 = (value) => (Number.isFinite(value) ? euro0.format(value) : "–");
  const share = (value, digits = 1) => (Number.isFinite(value) ? pct(value, digits) : "–");
  const monthName = (ym) => `${data.months[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
  const dayName = dayMonth(true);
  const dayText = (iso) => dayName(new Date(`${iso}T00:00:00Z`));
  const causeName = (key) => (key ? data.causes[key] || key : tx("Not recorded"));
  const nights = (n) => plural(Math.round(n), tx("room night"), tx("room nights"));
  const daily = () => M.dailyRows(state.rows);
  const shown = () => {
    if (/^\d{4}-\d{2}$/.test(state.month)) return state.month;
    const rows = daily();
    return rows.length ? rows.at(-1).date.slice(0, 7) : today().slice(0, 7);
  };

  // ▲ above, ▼ below, = on budget: the arrow and the words, never the colour alone.
  const chip = (diff, format, higherIsBetter = true) => {
    const box = el("span", "hk-chip");
    if (diff === null || !Number.isFinite(diff)) {
      box.classList.add("is-none");
      box.textContent = tx("no budget set");
      return box;
    }
    const level = Math.abs(diff) < 1e-9 ? "even" : diff > 0 ? "up" : "down";
    const good = level === "even" || (level === "up") === higherIsBetter;
    box.classList.add(good ? "is-good" : "is-bad");
    box.textContent = level === "even" ? `= ${tx("on budget")}` : `${level === "up" ? "▲" : "▼"} ${tx(level === "up" ? "{n} above budget" : "{n} below budget", { n: format(Math.abs(diff)) })}`;
    return box;
  };
  const points = (value) => tx("{n} pts", { n: num(value * 100, 1) });
  const kpiStat = (label, value, note, chipNode) => {
    const box = stat(label, value, note);
    if (chipNode) box.append(chipNode);
    return box;
  };

  const analyse = () => {
    const all = daily();
    const ym = shown();
    const month = M.monthRows(all, ym);
    const total = M.totals(month);
    const k = M.kpis(total);
    const budget = M.budgetOf(state);
    const fc = M.forecast(all, ym, rooms());
    const last = month.at(-1) || null;
    const end = last ? last.date : `${ym}-${String(M.monthDays(ym)).padStart(2, "0")}`;
    // The weekday pattern and the charts read the weeks up to the month shown, so an old month shows its own weeks.
    const recent = all.filter((row) => row.date <= end && row.date > kit.addDays(end, -56));
    const gapsList = M.gaps(total, budget, data.limits);
    const weakest = gapsList[0] && gapsList[0].euros > 0 ? gapsList[0] : null;
    return {
      ym, month, total, k, budget, fc, last, end, recent,
      week: M.weekdayAverages(recent),
      pick: last ? M.pickup(all, last.date) : null,
      bw: M.bestWorst(month),
      leak: M.leaks(month, k.adr || 0),
      causes: M.causeTally(month),
      gaps: gapsList,
      focusKey: weakest ? weakest.key : "onTrack",
      weakest,
    };
  };

  const budgetRevenue = (r) => (r.budget.revpar && r.fc ? r.budget.revpar * r.fc.available : null);

  const problemText = (r) => {
    if (!r.bw) return tx("No night logged in {month} yet.", { month: monthName(r.ym) });
    const w = r.bw.worst;
    return tx("{day}: occupancy {occ}, ADR {adr}, RevPAR {revpar}, the weakest night of {month}.", {
      day: dayText(w.row.date), occ: share(w.occ), adr: money2(M.adr(w.row.roomRev, w.row.sold)), revpar: money2(w.revpar), month: monthName(r.ym),
    }) + (r.budget.revpar ? ` ${tx("Budget RevPAR {n}.", { n: money2(r.budget.revpar) })}` : "");
  };

  const versus = (value, target, format) => (target ? ` (${tx("Budget")} ${format(target)})` : "");

  // The morning report: yesterday, the month so far, the forecast, what leaked and where to start.
  const summaryText = (r) => {
    const lines = [`${t.tool} | ${t.report} | Stiven Catalyst`, `${tx("Month")}: ${monthName(r.ym)} · ${plural(r.month.length, tx("night logged"), tx("nights logged"))}`, ""];
    if (r.last) {
      const row = r.last;
      lines.push(`${tx("Last night")} (${dayText(row.date)}): ${tx("occupancy")} ${share(M.occupancy(row.sold, row.available))} (${int.format(row.sold)}/${int.format(row.available)}), ADR ${money2(M.adr(row.roomRev, row.sold))}, RevPAR ${money2(M.revpar(row.roomRev, row.available))}`);
      if (r.pick && r.pick.diff !== null) lines.push(`${tx("Against the same night last week")}: ${r.pick.diff >= 0 ? "+" : "−"}${plural(Math.abs(r.pick.diff), tx("room"), tx("rooms"))}, RevPAR ${r.pick.revparDiff >= 0 ? "+" : "−"}${money2(Math.abs(r.pick.revparDiff))}`);
      lines.push(`${tx("Arrivals")} ${int.format(row.arrivals)} · ${tx("Departures")} ${int.format(row.departures)} · ${tx("No-shows")} ${int.format(row.noShows)} · ${tx("Walk-ins")} ${int.format(row.walkIns)} · ${tx("Out of order")} ${int.format(row.ooo)} · ${tx("Complaints")} ${int.format(row.complaints)} · ${tx("Breakfast covers")} ${int.format(row.covers)}`);
      lines.push("");
    }
    lines.push(`${tx("Month to date")}:`);
    lines.push(`- ${tx("Occupancy")}: ${share(r.k.occ)}${versus(r.k.occ, r.budget.occ, (v) => share(v))}`);
    lines.push(`- ADR: ${money2(r.k.adr)}${versus(r.k.adr, r.budget.adr, money2)}`);
    lines.push(`- RevPAR: ${money2(r.k.revpar)}${versus(r.k.revpar, r.budget.revpar, money2)}`);
    lines.push(`- TRevPAR: ${money2(r.k.trevpar)}`);
    lines.push(`- ${tx("Room revenue")}: ${money0(r.total.roomRev)} · ${tx("Other revenue")}: ${money0(r.total.otherRev)}`);
    if (r.fc) lines.push("", `${tx("Forecast for the month")}: ${tx("occupancy")} ${share(r.fc.occ)}, ADR ${money2(r.fc.adr)}, RevPAR ${money2(r.fc.revpar)}, ${tx("room revenue")} ${money0(r.fc.roomRev)}${budgetRevenue(r) ? ` (${tx("Budget")} ${money0(budgetRevenue(r))})` : ""}`);
    lines.push("", `${tx("No-show rate")}: ${share(r.k.noShowRate)} · ${tx("Out of order")}: ${share(r.k.oooShare)} · ${tx("Complaints per 100 rooms sold")}: ${Number.isFinite(r.k.complaintsPer100) ? num(r.k.complaintsPer100, 1) : "–"}`);
    lines.push(`${tx("Where the money leaked")}: ${tx("No-shows")} ${money0(r.leak.noShows)} · ${tx("Rooms out of order")} ${money0(r.leak.ooo)}`);
    if (r.causes.length) lines.push(`${tx("Complaint causes")}: ${r.causes.map((c) => `${causeName(c.key)} ${int.format(c.value)}`).join(", ")}`);
    const advice = data.advice[r.focusKey];
    lines.push("", `${tx("Start here")}: ${data.kpis[r.focusKey]}${r.weakest ? ` (${tx("about {n} this month", { n: money0(r.weakest.euros) })})` : ""}`);
    if (advice) {
      lines.push(`${tx("First moves")}:`);
      advice.moves.forEach((move) => lines.push(`- ${move}`));
      lines.push(`${tx("Question for the floor")}: ${advice.question}`);
    }
    return lines.join("\n");
  };

  // The complaints for the Pareto tool: one row per night and cause, the count of complaints.
  const paretoTable = (r) => () => ({
    source: t.tool,
    template: "guest-complaints",
    headers: [tx("Date"), tx("Cause"), tx("Count")],
    rows: r.month.filter((row) => row.complaints > 0).map((row) => [row.date, causeName(row.cause), String(row.complaints)]),
    map: { category: 1, count: 2, date: 0, filter: -1 },
    measure: "count",
  });

  // Result pieces.
  const monthNav = (ym) => {
    const nav = el("div", "hk-month-nav");
    const button = (label, text, move) => {
      const b = el("button", "button-ghost", text);
      b.type = "button";
      b.setAttribute("aria-label", label);
      b.dataset.month = String(move);
      return b;
    };
    nav.append(button(tx("Previous month"), "◀", -1), el("h3", "hk-month", monthName(ym)), button(tx("Next month"), "▶", 1));
    return nav;
  };

  const SIGN = { ok: "✓", warn: "!", danger: "✕" };
  const calendarChart = (r) => {
    const byDate = new Map(r.month.map((row) => [row.date, row]));
    return Chart.calendar(Number(r.ym.slice(0, 4)), Number(r.ym.slice(5, 7)), (iso) => {
      const row = byDate.get(iso);
      if (!row) return { state: "none", text: "", tip: `${dayText(iso)}: ${tx("not logged")}` };
      const occ = M.occupancy(row.sold, row.available);
      const name = M.dayState(occ, r.budget.occ);
      return {
        state: name,
        text: `${num(occ * 100, 0)}${SIGN[name] ? ` ${SIGN[name]}` : ""}`,
        tip: `${dayText(iso)}\n${tx("Occupancy")} ${share(occ)} (${int.format(row.sold)}/${int.format(row.available)})\nADR ${money2(M.adr(row.roomRev, row.sold))} · RevPAR ${money2(M.revpar(row.roomRev, row.available))}`,
      };
    }, { title: `${tx("Occupancy by night")}: ${monthName(r.ym)}`, cellSize: 60 });
  };

  const lastNightCard = (r) => {
    const card = el("article", "result-card hk-night");
    card.append(el("p", "result-label", tx("Last night")));
    if (!r.last) return card;
    const row = r.last;
    card.append(el("h3", null, dayText(row.date)));
    const grid = el("dl", "hk-night-grid");
    const item = (label, value) => grid.append(el("dt", null, label), el("dd", null, value));
    item(tx("Occupancy"), `${share(M.occupancy(row.sold, row.available))} · ${int.format(row.sold)}/${int.format(row.available)}`);
    item("ADR", money2(M.adr(row.roomRev, row.sold)));
    item("RevPAR", money2(M.revpar(row.roomRev, row.available)));
    item(tx("Arrivals / departures"), `${int.format(row.arrivals)} / ${int.format(row.departures)}`);
    item(tx("No-shows / walk-ins"), `${int.format(row.noShows)} / ${int.format(row.walkIns)}`);
    item(tx("Out of order"), int.format(row.ooo));
    item(tx("Complaints"), `${int.format(row.complaints)}${row.complaints && row.cause ? ` · ${causeName(row.cause)}` : ""}`);
    item(tx("Breakfast covers"), int.format(row.covers));
    card.append(grid);
    if (r.pick && r.pick.diff !== null) {
      // Pickup against the same weekday a week before: the arrow and the words carry it, the colour repeats it.
      const line = el("p", "hk-pickup");
      const sign = r.pick.diff > 0 ? "▲" : r.pick.diff < 0 ? "▼" : "=";
      line.append(el("span", `hk-chip ${r.pick.diff >= 0 ? "is-good" : "is-bad"}`, `${sign} ${tx(r.pick.diff >= 0 ? "{rooms} more than a week before" : "{rooms} fewer than a week before", { rooms: plural(Math.abs(r.pick.diff), tx("room"), tx("rooms")) })}`));
      line.append(` ${tx("{day}: RevPAR {a}, now {b}.", { day: dayText(r.pick.prevDate), a: money2(r.pick.prevRevpar), b: money2(r.pick.revpar) })}`);
      card.append(line);
    } else {
      card.append(el("p", "form-note", tx("No figures for the same night last week.")));
    }
    return card;
  };

  const linesPanel = (r) => {
    const rows = r.recent.slice(-42);
    const box = panel(tx("Occupancy and RevPAR by night"), tx("The last {n}, against the budget.", { n: plural(rows.length, tx("night"), tx("nights")) }));
    const xOf = (row) => dayText(row.date);
    const occLine = Chart.line([{ label: tx("Occupancy"), points: rows.map((row) => {
      const occ = M.occupancy(row.sold, row.available);
      const name = M.dayState(occ, r.budget.occ);
      return { x: xOf(row), y: occ * 100, state: name === "danger" ? "danger" : undefined, tip: `${dayText(row.date)}: ${tx("occupancy")} ${share(occ)}` };
    }) }], { title: tx("Occupancy by night"), unit: "%", format: (v) => num(v, 0), target: r.budget.occ ? r.budget.occ * 100 : undefined, yMin: 0, yMax: 100 });
    const revLine = Chart.line([{ label: "RevPAR", color: Chart.C.ok, points: rows.map((row) => ({ x: xOf(row), y: M.revpar(row.roomRev, row.available), tip: `${dayText(row.date)}: RevPAR ${money2(M.revpar(row.roomRev, row.available))}` })) }],
      { title: tx("RevPAR by night"), unit: "€", format: (v) => num(v, 0), target: r.budget.revpar || undefined, yMin: 0 });
    box.append(Chart.figure(occLine, { fileName: "hotel-occupancy" }), Chart.figure(revLine, { fileName: "hotel-revpar" }));
    return box;
  };

  const weekdayPanel = (r) => {
    const box = panel(tx("Average occupancy by weekday"), tx("The last eight weeks up to {date}. The weakest weekday is where a rate or a package earns most.", { date: showDate(r.end) }));
    const items = r.week.map((w) => ({
      label: data.weekdays[w.weekday],
      value: w.occ === null ? 0 : w.occ * 100,
      state: w.occ === null ? "none" : r.budget.occ ? M.dayState(w.occ, r.budget.occ) : undefined,
      tip: `${data.weekdaysLong[w.weekday]}: ${tx("occupancy")} ${share(w.occ)} · ADR ${money2(w.adr)} · RevPAR ${money2(w.revpar)} (${plural(w.n, tx("night"), tx("nights"))})`,
    }));
    box.append(Chart.figure(Chart.bars(items, { title: tx("Average occupancy by weekday"), unit: "%", yMax: 100, format: (v) => num(v, 0), target: r.budget.occ ? r.budget.occ * 100 : undefined, targetLabel: tx("Budget") }), { fileName: "hotel-weekdays" }));
    return box;
  };

  const revenuePanel = (r) => {
    const rows = r.recent.slice(-30);
    const box = panel(tx("Revenue per night"), tx("Room and other revenue of the last {n}.", { n: plural(rows.length, tx("night"), tx("nights")) }));
    const items = rows.map((row) => ({
      label: dayText(row.date),
      value: row.roomRev + row.otherRev,
      tip: `${dayText(row.date)}\n${tx("Room revenue")} ${money0(row.roomRev)}\n${tx("Other revenue")} ${money0(row.otherRev)}`,
    }));
    box.append(Chart.figure(Chart.bars(items, { title: tx("Revenue per night"), unit: "€", labels: false, format: (v) => int.format(Math.round(v)) }), { fileName: "hotel-revenue" }));
    return box;
  };

  const leakPanel = (r) => {
    const box = panel(tx("Where the money leaked"), tx("Each no-show and each room out of order at the ADR of its night. A no-show fee charged, or a night that would not have filled, makes the real loss smaller."));
    const items = [
      { key: tx("No-shows"), value: r.leak.noShows, nights: r.leak.noShowNights },
      { key: tx("Rooms out of order"), value: r.leak.ooo, nights: r.leak.oooNights },
    ].sort((a, b) => b.value - a.value);
    box.append(barList(items, { highlight: (item) => item === items[0] && item.value > 0, tag: tx("Most"), label: (item) => [money0(item.value), ` · ${nights(item.nights)}`] }));
    box.append(el("p", "dl-panel-note", tx("Together {n} in {month}, {share} of the room revenue.", { n: money0(r.leak.noShows + r.leak.ooo), month: monthName(r.ym), share: share(ratio(r.leak.noShows + r.leak.ooo, r.total.roomRev)) })));
    return box;
  };

  const causePanel = (r) => {
    const box = panel(tx("Complaint causes"), tx("{n} in {month}, {rate} per 100 rooms sold.", { n: plural(r.total.complaints, tx("complaint"), tx("complaints")), month: monthName(r.ym), rate: Number.isFinite(r.k.complaintsPer100) ? num(r.k.complaintsPer100, 1) : "–" }));
    const items = r.causes.map((c) => ({ key: causeName(c.key), value: c.value }));
    box.append(barList(items, { ranked: true, highlight: (item) => item === items[0], tag: tx("Most"), label: (item) => [int.format(item.value), ` · ${share(item.value / (r.total.complaints || 1), 0)}`] }));
    return box;
  };

  const bestWorstPanel = (r) => {
    const box = panel(tx("Best and worst night"), tx("By RevPAR, in {month}.", { month: monthName(r.ym) }));
    const list = el("dl", "hk-night-grid");
    [[tx("Best night"), r.bw.best], [tx("Worst night"), r.bw.worst]].forEach(([label, night]) => {
      list.append(el("dt", null, label), el("dd", null, `${dayText(night.row.date)} · RevPAR ${money2(night.revpar)} · ${tx("occupancy")} ${share(night.occ)} · ADR ${money2(M.adr(night.row.roomRev, night.row.sold))}`));
    });
    box.append(list);
    return box;
  };

  // Nights stored with more rooms sold than available: named above the result, counted in nothing.
  const oversoldNote = el("p", "dl-warning");
  oversoldNote.dataset.hkOversold = "";
  results.before(oversoldNote);
  const renderOversold = () => {
    const list = M.oversoldNights(state.rows);
    oversoldNote.hidden = !list.length;
    const dates = `${list.slice(0, 5).map((row) => `${showDate(row.date)} (${int.format(row.sold)} / ${int.format(row.available)})`).join(", ")}${list.length > 5 ? " …" : ""}`;
    oversoldNote.textContent = !list.length ? "" : list.length === 1
      ? tx("1 night has more rooms sold than available and counts in no total: {dates}. Enter it again with the right figures, or remove it from the log.", { dates })
      : tx("{n} nights have more rooms sold than available and count in no total: {dates}. Enter them again with the right figures, or remove them from the log.", { n: int.format(list.length), dates });
  };

  const renderResults = () => {
    renderOversold();
    results.replaceChildren();
    results.hidden = !state.rows.length;
    if (!state.rows.length) return;
    const r = analyse();

    const head = el("div", "result-head");
    head.append(el("p", "kicker", `${tx("Result")} · ${monthName(r.ym)} · ${tx("month to date")}`));
    const title = el("h2");
    if (r.month.length) title.append(tx("{n} of {month}: RevPAR {revpar}", { n: plural(r.month.length, tx("night"), tx("nights")), month: monthName(r.ym), revpar: money2(r.k.revpar) }));
    else title.append(tx("No night logged in {month} yet.", { month: monthName(r.ym) }));
    head.append(title);

    const board = el("div", "hk-board");
    const cal = el("div", "hk-calendar");
    cal.append(monthNav(r.ym));
    if (r.month.length) {
      cal.append(Chart.figure(calendarChart(r), { fileName: `hotel-occupancy-${r.ym}` }));
      cal.append(r.budget.occ ? Chart.legend([
        { label: `✓ ${tx("On or above budget")}`, state: "ok" },
        { label: `! ${tx("Within 10 points of budget")}`, state: "warn" },
        { label: `✕ ${tx("More than 10 points below")}`, state: "danger" },
      ]) : el("p", "form-note", tx("Add a budget occupancy in the settings to colour the nights.")));
    }
    board.append(cal);
    if (!r.month.length) {
      resultLayout(results, { head, notes: [board] });
      return;
    }
    board.append(lastNightCard(r));

    const stats = el("div", "dl-stats hk-stats");
    stats.append(kpiStat(tx("Occupancy"), share(r.k.occ), tx("{a} of {b} rooms", { a: int.format(r.total.sold), b: int.format(r.total.available) }), chip(r.budget.occ ? r.k.occ - r.budget.occ : null, points)));
    stats.append(kpiStat("ADR", money2(r.k.adr), tx("room revenue per room sold"), chip(r.budget.adr && r.k.adr !== null ? r.k.adr - r.budget.adr : null, money2)));
    stats.append(kpiStat("RevPAR", money2(r.k.revpar), r.budget.derived ? tx("budget = occupancy × ADR") : tx("room revenue per available room"), chip(r.budget.revpar ? r.k.revpar - r.budget.revpar : null, money2)));
    stats.append(stat("TRevPAR", money2(r.k.trevpar), tx("all revenue per available room")));
    const target = budgetRevenue(r);
    stats.append(kpiStat(tx("Forecast room revenue"), money0(r.fc.roomRev), tx("{occ} occupancy at month end", { occ: share(r.fc.occ) }), target ? chip(r.fc.roomRev - target, money0) : null));
    stats.append(stat(tx("No-show rate"), share(r.k.noShowRate), tx("{n} of {m} expected arrivals", { n: int.format(r.total.noShows), m: int.format(r.total.arrivals + r.total.noShows) })));
    stats.append(stat(tx("Out of order"), share(r.k.oooShare), nights(r.total.ooo)));
    stats.append(stat(tx("Complaints per 100 rooms sold"), Number.isFinite(r.k.complaintsPer100) ? num(r.k.complaintsPer100, 1) : "–", plural(r.total.complaints, tx("complaint"), tx("complaints"))));

    const notes = [board];
    if (!r.budget.occ && !r.budget.adr) notes.push(el("p", "dl-warning", tx("Add the month's budget (occupancy and ADR) in the settings to see each KPI against it.")));
    if (r.fc.filled) notes.push(el("p", "form-note hk-forecast-note", tx("Forecast: {a} logged, {b} still to come or not logged, each at the average of its weekday over the last four weeks.", { a: plural(r.fc.logged, tx("night"), tx("nights")), b: plural(r.fc.filled, tx("night"), tx("nights")) })));

    const advice = data.advice[r.focusKey];
    const focus = focusCard({
      title: data.kpis[r.focusKey],
      detail: r.weakest ? tx("about {n} this month", { n: money0(r.weakest.euros) }) : "",
      lede: r.weakest ? tx("Of all the KPIs this one costs the most against budget and limits this month.") : tx("No KPI is below its budget or above its limit this month."),
      advice,
    });
    if (Actions && advice) {
      const row = el("div", "tool-actions");
      row.append(Actions.linkButton(tx("Add to actions"), () => ({
        title: advice.action,
        detail: `${data.kpis[r.focusKey]} · ${monthName(r.ym)}${r.weakest ? ` · ${tx("about {n} this month", { n: money0(r.weakest.euros) })}` : ""}`,
        source: "hotel-kpis",
        check: advice.check,
        priority: r.weakest ? "High" : "Low",
        due: kit.addDays(today(), 7),
      })));
      focus.append(row);
    }

    const actions = resultActions(() => summaryText(r), problemText(r), r.causes.length ? paretoTable(r) : null);
    const copyButton = actions.querySelector("button");
    if (copyButton) copyButton.textContent = tx("Copy the morning report");
    const audit = el("a", "button-secondary", tx("Night Audit Log"));
    audit.href = new URL("../night-audit/", window.location.href).href;
    actions.append(audit);

    resultLayout(results, {
      head,
      stats,
      notes,
      focus,
      actions,
      panels: [linesPanel(r), weekdayPanel(r), revenuePanel(r), leakPanel(r), r.causes.length ? causePanel(r) : null, r.bw ? bestWorstPanel(r) : null].filter(Boolean),
    });
  };

  results.addEventListener("click", (event) => {
    const move = event.target.closest("[data-month]");
    if (!move) return;
    state.month = M.addMonths(shown(), Number(move.dataset.month));
    save();
    renderResults();
    results.querySelector(`[data-month="${move.dataset.month}"]`)?.focus();
  });

  const syncAvailable = () => {
    entry.elements.available.placeholder = rooms() ? String(rooms()) : t.availablePlaceholder;
  };

  const round2 = (value) => (Number.isFinite(value) ? Math.round(value * 100) / 100 : "");
  const percent2 = (value) => (Number.isFinite(value) ? Math.round(value * 10000) / 100 : "");
  let lastOversold = 0;
  const book = logBook({
    root,
    key: KEY,
    state,
    save,
    results,
    paste,
    // The example leaves with its settings, but a room total or a budget the visitor typed over it stays.
    clearExample: () => {
      const example = data.example;
      if (state.rooms === String(example.rooms)) state.rooms = "";
      if (state.budgetOcc === String(example.budgetOcc)) state.budgetOcc = "";
      if (state.budgetAdr === String(example.budgetAdr)) state.budgetAdr = "";
      state.month = "";
    },
    cells: (row) => [
      el("td", "nowrap", showDate(row.date)),
      el("td", "num", int.format(row.sold)),
      el("td", "num", int.format(row.available)),
      M.oversold(row) ? Object.assign(el("td", "num", `⚠ ${share(M.occupancy(row.sold, row.available))}`), { title: tx("More rooms sold than available: not counted") }) : el("td", "num", share(M.occupancy(row.sold, row.available))),
      el("td", "num nowrap", money0(row.roomRev)),
      el("td", "num nowrap", money2(M.adr(row.roomRev, row.sold))),
      el("td", "num nowrap", money2(M.revpar(row.roomRev, row.available))),
      el("td", "num", int.format(row.noShows)),
      el("td", "num", int.format(row.ooo)),
      el("td", "num", int.format(row.complaints)),
      el("td", null, row.complaints && row.cause ? causeName(row.cause) : ""),
    ],
    removeLabel: (row) => tx("Remove the night of {date}", { date: showDate(row.date) }),
    removedText: (row) => tx("Removed the night of {date}.", { date: showDate(row.date) }),
    countText: (rows) => plural(M.dailyRows(rows).length, tx("night"), tx("nights")),
    importRows: (text) => {
      const out = M.importRows(text, data, rooms());
      lastOversold = out.oversold;
      return out;
    },
    importText: {
      get none() {
        return lastOversold
          ? tx("No rows imported: {n} rows have more rooms sold than available. Check the rooms available, or the room total in the settings.", { n: lastOversold })
          : tx("No rows found. Each row needs a date, the rooms sold and, without a room total in the settings, the rooms available.");
      },
      done: (added, skipped) => `${tx("Imported {rows}", { rows: plural(added, tx("row"), tx("rows")) })}${skipped ? tx(", skipped {n} without a date or rooms sold", { n: skipped }) : ""}${lastOversold ? tx(", left out {n} with more rooms sold than available", { n: lastOversold }) : ""}.`,
    },
    loadExample: () => {
      const example = data.example;
      state.rows = M.exampleRows(data);
      state.rooms = String(example.rooms);
      state.budgetOcc = String(example.budgetOcc);
      state.budgetAdr = String(example.budgetAdr);
      state.budgetRevpar = "";
      state.month = "";
    },
    clearText: tx("Clear the whole {tool} log?", { tool: t.tool }),
    csv: () => ({
      name: t.csv,
      rows: [
        [tx("Date"), tx("Rooms available"), tx("Rooms sold"), `${tx("Occupancy")} %`, `${tx("Room revenue")} €`, `${tx("Other revenue")} €`, "ADR €", "RevPAR €", "TRevPAR €",
          tx("Arrivals"), tx("Departures"), tx("No-shows"), `${tx("No-show rate")} %`, tx("Walk-ins"), tx("Out of order"), `${tx("Out of order")} %`,
          tx("Complaints"), tx("Complaints per 100 rooms sold"), tx("Complaint cause"), tx("Breakfast covers")],
        ...M.dailyRows(state.rows).map((row) => [
          row.date, row.available, row.sold, percent2(M.occupancy(row.sold, row.available)), row.roomRev, row.otherRev,
          round2(M.adr(row.roomRev, row.sold)), round2(M.revpar(row.roomRev, row.available)), round2(M.trevpar(row.roomRev, row.otherRev, row.available)),
          row.arrivals, row.departures, row.noShows, percent2(M.noShowRate(row.noShows, row.arrivals)), row.walkIns, row.ooo, percent2(M.oooShare(row.ooo, row.available)),
          row.complaints, round2(M.complaintsPer100(row.complaints, row.sold)), row.cause ? causeName(row.cause) : "", row.covers,
        ]),
      ],
    }),
    renderResults: () => {
      syncAvailable();
      renderResults();
    },
  });

  // Log a night. A night already in the log is replaced: the PMS figures of a day can be corrected the next morning.
  entry.elements.date.value = kit.addDays(today(), -1);
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = entry.elements;
    const date = parseDate(form.date.value);
    if (!date) {
      form.date.focus();
      flash(entryStatus, tx("Enter the date of the night."));
      return;
    }
    const row = M.cleanRow({
      date,
      available: form.available.value,
      sold: form.sold.value,
      roomRev: form.roomRev.value,
      otherRev: form.otherRev.value,
      arrivals: form.arrivals.value,
      departures: form.departures.value,
      noShows: form.noShows.value,
      walkIns: form.walkIns.value,
      ooo: form.ooo.value,
      complaints: form.complaints.value,
      covers: form.covers.value,
      cause: form.cause.value,
    }, rooms());
    if (!row) {
      (form.sold.value.trim() ? form.available : form.sold).focus();
      flash(entryStatus, tx("Enter the rooms sold, and the rooms available or the total rooms in the settings."));
      return;
    }
    if (M.oversold(row)) {
      form.sold.focus();
      flash(entryStatus, tx("Rooms sold ({sold}) cannot be more than rooms available ({available}). Check the figures of the night, or the room total in the settings.", { sold: int.format(row.sold), available: int.format(row.available) }));
      return;
    }
    const noRevenue = !(parseNumber(form.roomRev.value) > 0) && row.sold > 0;
    ["sold", "roomRev", "otherRev", "arrivals", "departures", "noShows", "walkIns", "ooo", "complaints", "covers"].forEach((name) => { form[name].value = ""; });
    form.cause.value = "";
    state.month = date.slice(0, 7);
    const replaced = !exampleMatches(state) && state.rows.some((item) => item.date === date);
    if (!replaced) {
      book.add(row);
    } else {
      state.rows = state.rows.filter((item) => item.date !== date);
      state.rows.push(row);
      save();
      book.render();
    }
    flash(entryStatus, `${tx(replaced ? "Replaced the night of {date}." : "Added the night of {date}.", { date: showDate(date) })}${noRevenue ? ` ${tx("No room revenue: ADR and RevPAR of this night are 0.")}` : ""}`);
    form.date.value = kit.addDays(date, 1);
    form.sold.focus();
  });

  book.render();
})();
