(() => {
  // Operations Report: the weekly or monthly management report, written from what the other tools hold in this
  // browser. It has no log of its own: it reads Damage Control, Incomplete Control, the Night Audit Log, Delay Analyzer,
  // Shift Handover, Safety Cross, OEE, the 5S Audit, Gemba Walk, Hotel KPIs, the Kaizen Board and the Action Tracker,
  // sets every number against the period before and its target, and writes the sentences from the templates of the
  // page's language. The arithmetic is in window.OpsReportMath; it counts the way each tool counts, and the tests hold
  // it against the tools' own Math objects.
  const DAY = 864e5;
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const listOf = (value) => (Array.isArray(value) ? value.filter(isObj) : []);
  const text = (value) => (typeof value === "string" ? value.trim() : "");
  const fold = (value) => text(String(value ?? "")).toLowerCase();
  const sum = (list) => list.reduce((total, value) => total + value, 0);
  const positive = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const addDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const weekday = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
  const mondayOf = (iso) => addDays(iso, -weekday(iso));
  const monthStart = (iso) => `${iso.slice(0, 7)}-01`;
  const monthEnd = (iso) => new Date(Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), 0)).toISOString().slice(0, 10);
  const inRange = (date, range) => isIso(date) && date >= range.from && date <= range.to;
  // A share typed as a percent (0.3 means 0.3 %); anything outside 0–100 % is no target.
  const percent = (value) => {
    const n = Number(String(value ?? "").replace(",", ".").replace("%", "").trim());
    return String(value ?? "").trim() !== "" && n > 0 && n < 100 ? n / 100 : null;
  };
  const number = (value) => {
    const n = Number(String(value ?? "").replace(/%/g, "").replace(",", ".").trim());
    return String(value ?? "").trim() !== "" && Number.isFinite(n) && n > 0 ? n : null;
  };

  // Periods ------------------------------------------------------------------------------------------------------------
  // The report's period and the one it is compared with: a week from Monday, a month, or any span of days. A week or a
  // month in progress is compared with the same days of the one before, so a Wednesday report is fair to last week.
  const KINDS = { thisWeek: "week", lastWeek: "week", thisMonth: "month", lastMonth: "month", custom: "custom" };
  const period = (name, today, custom = {}) => {
    const key = name in KINDS ? name : "lastWeek";
    let from, to, before;
    if (key === "thisWeek" || key === "lastWeek") {
      from = key === "thisWeek" ? mondayOf(today) : addDays(mondayOf(today), -7);
      to = key === "thisWeek" ? today : addDays(from, 6);
      before = { from: addDays(from, -7), to: addDays(to, -7) };
    } else if (key === "thisMonth" || key === "lastMonth") {
      from = key === "thisMonth" ? monthStart(today) : monthStart(addDays(monthStart(today), -1));
      to = key === "thisMonth" ? today : monthEnd(from);
      const prev = monthStart(addDays(from, -1));
      const end = monthEnd(prev);
      const same = addDays(prev, between(from, to));
      before = { from: prev, to: key === "thisMonth" && same < end ? same : end };
    } else {
      from = isIso(custom.from) ? custom.from : addDays(today, -6);
      to = isIso(custom.to) ? custom.to : today;
      if (to < from) [from, to] = [to, from];
      const n = between(from, to) + 1;
      before = { from: addDays(from, -n), to: addDays(from, -1) };
    }
    return { key, kind: KINDS[key], from, to, days: between(from, to) + 1, before };
  };
  // The slots of a chart: days up to a month, weeks from Monday beyond it.
  const slotsOf = (range) => {
    const unit = between(range.from, range.to) + 1 <= 31 ? "day" : "week";
    const keys = [];
    for (let day = range.from; day <= range.to && keys.length < 400; day = addDays(day, 1)) {
      const key = unit === "day" ? day : mondayOf(day);
      if (keys.at(-1) !== key) keys.push(key);
    }
    const at = new Map(keys.map((key, i) => [key, i]));
    return { unit, keys, indexOf: (day) => at.get(unit === "day" ? day : mondayOf(day)) };
  };
  const perSlot = (range, rows, valueOf = () => 1) => {
    const slots = slotsOf(range);
    const out = slots.keys.map(() => 0);
    rows.forEach((row) => { const i = slots.indexOf(row.date); if (i !== undefined) out[i] += valueOf(row); });
    return out;
  };

  // Sources ------------------------------------------------------------------------------------------------------------
  // Damage Control, Incomplete Control and the Night Audit Log keep { rows: [{ date, shift, stage, type, cause, units }],
  // volumes: [{ date, volume }], target (a percent) }. The rate is the units over the daily volumes of the period, as
  // Shift Pulse counts it: only when every day with an entry has its volume, so a missing day never flatters the rate.
  const defects = (saved, range, fallbackTarget = null) => {
    const rows = listOf(saved?.rows).filter((row) => inRange(row.date, range));
    if (!rows.length) return null;
    const units = (row) => (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1);
    const total = sum(rows.map(units));
    const volumeOf = new Map();
    listOf(saved?.volumes).forEach((item) => { const v = Math.round(Number(item.volume)); if (isIso(item.date) && v > 0) volumeOf.set(item.date, v); });
    const covered = rows.every((row) => volumeOf.has(row.date));
    const volume = covered ? sum([...volumeOf].filter(([date]) => inRange(date, range)).map(([, v]) => v)) : null;
    const causes = new Map();
    rows.forEach((row) => { const name = text(row.cause) || "–"; causes.set(name, (causes.get(name) || 0) + units(row)); });
    const top = [...causes].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    return {
      total,
      volume,
      rate: volume && total <= volume ? total / volume : null,
      target: percent(saved?.target) ?? (fallbackTarget > 0 ? fallbackTarget / 100 : null),
      cause: top && top[0] !== "–" ? { name: top[0], units: top[1], share: top[1] / total } : null,
      series: perSlot(range, rows, units),
    };
  };

  // Delay Analyzer: { rows: [{ date, planArr, actArr }], arrivalGrace, target (on-time percent) }. A route is late beyond
  // the arrival grace (15 minutes when none was saved). With only some routes logged, late routes are counted, not shared.
  const clock = (time) => (/^\d{2}:\d{2}$/.test(String(time ?? "")) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  const minutesLate = (planned, actual) => {
    const a = clock(planned), b = clock(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  const delivery = (saved, range, { partial = false, fallbackTarget = null } = {}) => {
    const routes = listOf(saved?.rows).filter((row) => inRange(row.date, range))
      .map((row) => ({ date: row.date, arr: minutesLate(row.planArr, row.actArr) })).filter((row) => row.arr !== null);
    if (!routes.length) return null;
    const typed = saved?.arrivalGrace === undefined || saved?.arrivalGrace === null ? NaN : Number(String(saved.arrivalGrace).replace(",", "."));
    const grace = Number.isFinite(typed) && typed >= 0 ? typed : 15;
    const late = routes.filter((row) => row.arr > grace);
    const target = percent(saved?.target) ?? (fallbackTarget > 0 ? fallbackTarget / 100 : null);
    const lateBy = perSlot(range, late);
    const all = perSlot(range, routes);
    return {
      routes: routes.length,
      late: late.length,
      partial: Boolean(partial),
      onTime: partial ? null : 1 - late.length / routes.length,
      minutes: late.length ? sum(late.map((row) => row.arr)) / late.length : null,
      target: partial ? null : target,
      series: all.map((n, i) => (n ? 1 - lateBy[i] / n : null)),
      lateSeries: lateBy,
    };
  };

  // Safety Cross: { rows: [{ date, type, area }] }. Accidents are recorded injuries (with or without lost time); near
  // misses count the unsafe conditions and acts too. Days without an accident count to the end of the period over the
  // whole log, as the Safety Cross counts them.
  const ACCIDENTS = ["lost-time", "no-lost-time"];
  const NEAR = ["near-miss", "unsafe-condition", "unsafe-act"];
  const safety = (saved, range) => {
    const all = listOf(saved?.rows).filter((row) => isIso(row.date));
    const rows = all.filter((row) => inRange(row.date, range));
    if (!rows.length) return null;
    const accidents = rows.filter((row) => ACCIDENTS.includes(row.type)).sort((a, b) => a.date.localeCompare(b.date));
    const last = all.filter((row) => ACCIDENTS.includes(row.type) && row.date <= range.to).map((row) => row.date).sort().at(-1) || null;
    const series = (types) => perSlot(range, rows.filter((row) => types.includes(row.type)));
    return {
      entries: rows.length,
      accidents: accidents.length,
      firstAid: rows.filter((row) => row.type === "first-aid").length,
      nearMisses: rows.filter((row) => NEAR.includes(row.type)).length,
      lastAccident: accidents.at(-1) ? { date: accidents.at(-1).date, area: text(accidents.at(-1).area) } : null,
      daysSince: last ? between(last, range.to) : null,
      series: { accidents: series(ACCIDENTS), firstAid: series(["first-aid"]), nearMisses: series(NEAR) },
    };
  };

  // OEE, as the OEE tool counts it (OeeMath.entry and combine): planned stops leave the planned time, breakdowns and
  // setup the run time, performance is the ideal time of the pieces over the run time (at most 100 %), quality the good
  // pieces over all; entries add up by time. A machine without an ideal rate has no OEE.
  const oeeTarget = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? (n > 1 ? n / 100 : n) : 0.85;
  };
  const oeeEntry = (row, cycle, reasons = []) => {
    if (!(cycle > 0)) return null;
    const lossOf = (reason) => reasons.find((r) => fold(r.name) === fold(reason))?.loss || "breakdowns";
    const logged = { breakdowns: 0, setup: 0, planned: 0 };
    listOf(row.stops).forEach((stop) => { const loss = lossOf(stop.reason); if (loss in logged) logged[loss] += positive(stop.minutes); });
    const ppt = Math.max(0, positive(row.planned) - logged.planned);
    const run = ppt - Math.min(ppt, logged.breakdowns + logged.setup);
    const total = Math.round(positive(row.pieces));
    const good = total - Math.min(total, Math.round(positive(row.rejects)));
    const performance = run > 0 ? Math.min(1, (total * cycle) / 60 / run) : 0;
    const atSpeed = run * performance;
    return { ppt, run, atSpeed, valuable: atSpeed * (total > 0 ? good / total : 1) };
  };
  const oeeCombine = (entries) => {
    const total = (key) => sum(entries.map((e) => e[key]));
    const ppt = total("ppt"), run = total("run"), atSpeed = total("atSpeed"), valuable = total("valuable");
    return { n: entries.length, availability: ppt > 0 ? run / ppt : null, performance: run > 0 ? atSpeed / run : null, quality: atSpeed > 0 ? valuable / atSpeed : null, oee: ppt > 0 ? valuable / ppt : null };
  };
  const equipment = (saved, range, reasons = [], target = null) => {
    const machines = listOf(saved?.equipment);
    const cycleOf = (name) => {
      const machine = machines.find((m) => fold(m.name) === fold(name));
      if (!machine) return null;
      if (Number(machine.rate) > 0) return 3600 / Number(machine.rate);
      return Number(machine.cycle) > 0 ? Number(machine.cycle) : null;
    };
    const rows = listOf(saved?.rows).filter((row) => inRange(row.date, range) && positive(row.planned) > 0);
    const rated = rows.map((row) => ({ row, e: oeeEntry(row, cycleOf(row.equipment), reasons) })).filter((item) => item.e);
    if (!rated.length) return null;
    const names = [...new Set(rated.map((item) => text(item.row.equipment)))];
    const perMachine = names.map((name) => ({ name, ...oeeCombine(rated.filter((item) => text(item.row.equipment) === name).map((item) => item.e)) }))
      .sort((a, b) => a.oee - b.oee || a.name.localeCompare(b.name));
    const factorOf = (m) => ["availability", "performance", "quality"].sort((a, b) => m[a] - m[b])[0];
    const low = perMachine[0];
    return { ...oeeCombine(rated.map((item) => item.e)), entries: rows.length, unrated: rows.length - rated.length, target: oeeTarget(target), machines: perMachine, lowest: { ...low, factor: factorOf(low) } };
  };

  // 5S Audit and Gemba Walk. A 5S audit scores 0–4 per question: per S the mean of the answered questions over 4, then
  // the mean of the S with an answer, so each S weighs the same (FiveSMath.score). The period's score is the mean of
  // its audits. Gemba compliance is yes over yes and no of the layered audits; n.a. is left out (GembaMath.combined).
  const isScore = (value) => Number.isInteger(value) && value >= 0 && value <= 4;
  const fiveSOverall = (scores) => {
    const shares = Object.values(isObj(scores) ? scores : {}).map((list) => (Array.isArray(list) ? list.filter(isScore) : []))
      .filter((values) => values.length).map((values) => sum(values) / values.length / 4);
    return shares.length ? sum(shares) / shares.length : null;
  };
  const workplace = (fiveSaved, gembaSaved, range, fivesTarget = null) => {
    const audits = listOf(fiveSaved?.rows).filter((row) => inRange(row.date, range)).map((row) => ({ area: text(row.area) || "–", date: row.date, score: fiveSOverall(row.scores) })).filter((row) => row.score !== null);
    const walks = listOf(gembaSaved?.rows).filter((row) => inRange(row.date, range));
    if (!audits.length && !walks.length) return null;
    const areas = [...new Set(audits.map((row) => row.area))].map((area) => {
      const list = audits.filter((row) => row.area === area).map((row) => row.score);
      return { area, score: sum(list) / list.length, audits: list.length };
    }).sort((a, b) => a.score - b.score || a.area.localeCompare(b.area));
    let yes = 0, no = 0;
    walks.filter((row) => row.type === "lpa").forEach((row) => (Array.isArray(row.answers) ? row.answers : []).forEach((a) => { if (a === "yes") yes++; else if (a === "no") no++; }));
    const n = Number(fivesTarget);
    return {
      audits: audits.length,
      fiveS: audits.length ? sum(audits.map((row) => row.score)) / audits.length : null,
      fiveSTarget: Number.isFinite(n) && n > 0 ? (n > 1 ? n / 100 : n) : null,
      areas,
      walks: walks.length,
      lpa: walks.filter((row) => row.type === "lpa").length,
      gemba: yes + no ? yes / (yes + no) : null,
      gembaTarget: 0.9,
    };
  };

  // Hotel KPIs: one row per night ({ date, available, sold, roomRev, noShows, arrivals }), the latest kept when a night
  // was pasted twice, and the month's budget as typed (occupancy in % or as a share, ADR and RevPAR in euros; RevPAR is
  // occupancy times ADR when only those two are set), as HotelKpisMath counts them.
  const budgetOf = (saved) => {
    const occTyped = number(saved?.budgetOcc);
    const occ = occTyped === null ? null : occTyped > 1 ? occTyped / 100 : occTyped;
    const adr = number(saved?.budgetAdr);
    const revpar = number(saved?.budgetRevpar) ?? (occ !== null && adr !== null ? occ * adr : null);
    return { occ, adr, revpar };
  };
  const hotel = (saved, range) => {
    const byDate = new Map();
    listOf(saved?.rows).forEach((row) => { if (isIso(row.date)) byDate.set(row.date, row); });
    const rows = [...byDate.values()].filter((row) => inRange(row.date, range)).sort((a, b) => a.date.localeCompare(b.date));
    if (!rows.length) return null;
    const total = (key) => sum(rows.map((row) => Number(row[key]) || 0));
    const available = total("available"), sold = total("sold"), roomRev = total("roomRev");
    const slots = slotsOf(range);
    const occBy = slots.keys.map(() => [0, 0]);
    rows.forEach((row) => { const i = slots.indexOf(row.date); occBy[i][0] += Number(row.sold) || 0; occBy[i][1] += Number(row.available) || 0; });
    return {
      nights: rows.length,
      occ: available > 0 ? sold / available : null,
      adr: sold > 0 ? roomRev / sold : null,
      revpar: available > 0 ? roomRev / available : null,
      noShows: total("noShows"),
      budget: budgetOf(saved),
      series: occBy.map(([s, a]) => (a > 0 ? s / a : null)),
    };
  };

  // Kaizen Board: ideas that came in during the period, ideas adopted in it (status "act", by their adoption date) and
  // the monthly saving of those adopted, as the board counts its savings.
  const improvement = (saved, range) => {
    const rows = listOf(saved?.rows);
    const ideas = rows.filter((row) => inRange(row.date, range));
    const adopted = rows.filter((row) => row.status === "act" && inRange(row.adopted, range));
    if (!ideas.length && !adopted.length) return null;
    return {
      ideas: ideas.length,
      adopted: adopted.length,
      saving: sum(adopted.map((row) => Number(row.saving) || 0)),
      list: adopted.map((row) => ({ title: text(row.title), saving: Number(row.saving) || 0 })).sort((a, b) => b.saving - a.saving),
      series: { ideas: perSlot(range, ideas), adopted: perSlot(range, adopted.map((row) => ({ date: row.adopted }))) },
    };
  };

  // The Action Tracker (sc-actions, one list in every language). Opened by the day it was created, closed and verified
  // by the day it closed; overdue as the list stood at the end of the period: created by then, not closed by then, due
  // before it. The Shift Handover adds the handovers closed in the period and the open issues they carried over.
  const isClosed = (row) => row.status === "done" || row.status === "verified";
  const openAt = (row, day) => isIso(row.created) && row.created <= day && (!isClosed(row) || (isIso(row.closed) && row.closed > day));
  const actions = (rows, range, handoverSaved = null) => {
    const list = listOf(rows).filter((row) => text(row.title));
    const opened = list.filter((row) => inRange(row.created, range));
    const closed = list.filter((row) => isClosed(row) && inRange(row.closed, range));
    const overdue = list.filter((row) => openAt(row, range.to) && isIso(row.due) && row.due < range.to).sort((a, b) => a.due.localeCompare(b.due));
    const handovers = listOf(handoverSaved?.history).map((entry) => entry.handover).filter((h) => isObj(h) && inRange(h.date, range));
    const carried = sum(handovers.map((h) => listOf(h.issues).filter((issue) => issue.done !== true && text(issue.text)).length));
    if (!opened.length && !closed.length && !overdue.length && !handovers.length) return null;
    const owners = new Map();
    overdue.forEach((row) => { const who = text(row.owner); owners.set(who, (owners.get(who) || 0) + 1); });
    return {
      total: list.length,
      opened: opened.length,
      closed: closed.length,
      verified: closed.filter((row) => row.status === "verified").length,
      overdue: overdue.length,
      overdueList: overdue.map((row) => ({ title: text(row.title), owner: text(row.owner), due: row.due, area: text(row.area) })),
      owners: [...owners].map(([owner, n]) => ({ owner, n })).sort((a, b) => b.n - a.n || a.owner.localeCompare(b.owner)),
      handovers: handovers.length,
      carried,
    };
  };

  // Comparison ---------------------------------------------------------------------------------------------------------
  // A number against the period before and its target. better says which way is good: "higher", "lower" or "none" (a
  // count that is neither, such as the routes driven). A change smaller than the shown precision is no change.
  const TOLERANCE = { int: 0.5, days: 0.5, share: 0.00005, pct: 0.0005, pct0: 0.005, euro: 0.005 };
  const FLOOR = { int: 1, days: 1, share: 0.001, pct: 0.01, pct0: 0.01, euro: 1 };
  const compare = (metric) => {
    const { value, before, better = "none", target = null, format = "int" } = metric;
    const tol = TOLERANCE[format] ?? 0;
    const out = { arrow: "", trend: "none", change: null, rel: 0, target: null };
    if (Number.isFinite(value) && Number.isFinite(before)) {
      const diff = value - before;
      out.change = diff;
      out.arrow = diff > tol ? "▲" : diff < -tol ? "▼" : "=";
      out.rel = out.arrow === "=" ? 0 : Math.abs(diff) / Math.max(Math.abs(before), FLOOR[format] ?? 1);
      if (out.arrow === "=") out.trend = "same";
      else if (better !== "none") out.trend = (diff > 0) === (better === "higher") ? "better" : "worse";
    }
    if (Number.isFinite(value) && Number.isFinite(target) && better !== "none") {
      out.target = (better === "higher" ? value >= target - 1e-9 : value <= target + 1e-9) ? "met" : "missed";
      out.gap = Math.abs(value - target) / Math.max(Math.abs(target), FLOOR[format] ?? 1);
    }
    return out;
  };

  // The sections of the report, each only when its source holds data in the period. A metric: { key, value, before,
  // target, better, format, minor } (minor numbers are shown, but never named as the period's best or worst).
  const SOURCES = ["damage", "incomplete", "night", "delay", "safety", "oee", "fiveS", "gemba", "hotel", "kaizen", "actions", "handover"];
  const sections = (src, range, before, opts = {}) => {
    const targets = isObj(opts.targets) ? opts.targets : {};
    const reasons = opts.reasons || [];
    const both = (fn) => ({ now: fn(range), then: fn(before) });
    const metric = (key, now, then, pick, extra = {}) => ({ key, value: now ? pick(now) : null, before: then ? pick(then) : null, ...extra });
    const list = [];

    const s = both((r) => safety(src.safety, r));
    if (s.now) {
      list.push({
        key: "safety", data: s.now, prev: s.then,
        metrics: [
          metric("accidents", s.now, s.then, (x) => x.accidents, { better: "lower", target: 0, format: "int" }),
          metric("nearMisses", s.now, s.then, (x) => x.nearMisses, { better: "none", format: "int", minor: true }),
          // The days without an accident grow by themselves; they are shown, not compared.
          ...(s.now.daysSince === null ? [] : [metric("daysSince", s.now, null, (x) => x.daysSince, { better: "none", format: "days", minor: true, bare: true })]),
        ],
      });
    }

    const logs = [
      ["damage", "damageRate", targets.damage],
      ["incomplete", "incompleteRate", targets.incomplete],
      ["night", "nightRate", targets.nightAudit],
    ].map(([key, rateKey, fallback]) => ({ key, rateKey, ...both((r) => defects(src[key], r, fallback)) })).filter((log) => log.now);
    if (logs.length) {
      const metrics = [];
      logs.forEach((log) => {
        if (log.now.rate !== null) metrics.push(metric(log.rateKey, log.now, log.then, (x) => x.rate, { better: "lower", target: log.now.target, format: "share" }));
        if (log.now.rate === null || logs.length === 1) metrics.push(metric(log.key, log.now, log.then, (x) => x.total, { better: "lower", format: "int", minor: log.now.rate !== null }));
      });
      list.push({ key: "quality", data: logs, metrics: metrics.slice(0, 4) });
    }

    const d = both((r) => delivery(src.delay, r, { partial: opts.partialDelay, fallbackTarget: targets.ontime }));
    if (d.now) {
      list.push({
        key: "delivery", data: d.now, prev: d.then,
        metrics: d.now.partial
          ? [metric("late", d.now, d.then, (x) => x.late, { better: "lower", format: "int" }), metric("routes", d.now, d.then, (x) => x.routes, { better: "none", format: "int", minor: true })]
          : [
            metric("onTime", d.now, d.then, (x) => x.onTime, { better: "higher", target: d.now.target, format: "pct" }),
            metric("late", d.now, d.then, (x) => x.late, { better: "lower", format: "int", minor: true }),
            metric("routes", d.now, d.then, (x) => x.routes, { better: "none", format: "int", minor: true }),
          ],
      });
    }

    const o = both((r) => equipment(src.oee, r, reasons, targets.oee));
    if (o.now) {
      list.push({
        key: "equipment", data: o.now, prev: o.then,
        metrics: [
          metric("oee", o.now, o.then, (x) => x.oee, { better: "higher", target: o.now.target, format: "pct" }),
          ...["availability", "performance", "quality"].map((key) => metric(key, o.now, o.then, (x) => x[key], { better: "higher", format: "pct0", minor: true })),
        ],
      });
    }

    const w = both((r) => workplace(src.fiveS, src.gemba, r, targets.fives));
    if (w.now) {
      const metrics = [];
      if (w.now.fiveS !== null) metrics.push(metric("fiveS", w.now, w.then, (x) => x.fiveS, { better: "higher", target: w.now.fiveSTarget, format: "pct0" }));
      if (w.now.gemba !== null) metrics.push(metric("gemba", w.now, w.then, (x) => x.gemba, { better: "higher", target: w.now.gembaTarget, format: "pct0" }));
      if (w.now.walks) metrics.push(metric("walks", w.now, w.then, (x) => x.walks, { better: "higher", format: "int", minor: true }));
      if (metrics.length) list.push({ key: "workplace", data: w.now, prev: w.then, metrics });
    }

    const h = both((r) => hotel(src.hotel, r));
    if (h.now) {
      const b = h.now.budget;
      list.push({
        key: "hotel", data: h.now, prev: h.then,
        metrics: [
          metric("revpar", h.now, h.then, (x) => x.revpar, { better: "higher", target: b.revpar, format: "euro" }),
          metric("occ", h.now, h.then, (x) => x.occ, { better: "higher", target: b.occ, format: "pct" }),
          metric("adr", h.now, h.then, (x) => x.adr, { better: "higher", target: b.adr, format: "euro" }),
        ],
      });
    }

    const k = both((r) => improvement(src.kaizen, r));
    if (k.now) {
      list.push({
        key: "improvement", data: k.now, prev: k.then,
        metrics: [
          metric("adopted", k.now, k.then, (x) => x.adopted, { better: "higher", format: "int" }),
          metric("saving", k.now, k.then, (x) => x.saving, { better: "higher", format: "euro", minor: true }),
          metric("ideas", k.now, k.then, (x) => x.ideas, { better: "higher", format: "int", minor: true }),
        ],
      });
    }

    const a = both((r) => actions(src.actions, r, src.handover));
    if (a.now) {
      const metrics = a.now.total
        ? [
          metric("opened", a.now, a.then, (x) => x.opened, { better: "none", format: "int", minor: true }),
          metric("closed", a.now, a.then, (x) => x.closed, { better: "higher", format: "int", minor: true }),
          metric("verified", a.now, a.then, (x) => x.verified, { better: "higher", format: "int", minor: true }),
          metric("overdue", a.now, a.then, (x) => x.overdue, { better: "lower", target: 0, format: "int" }),
        ]
        : [];
      list.push({ key: "actions", data: a.now, prev: a.then, metrics });
    }

    list.forEach((section) => section.metrics.forEach((m) => { m.cmp = compare(m); }));
    return list;
  };

  // The summary and the focus, as keys and values for the page's templates: what got better and worse the most, the
  // biggest risk (an accident first, then the number furthest from its target, then overdue actions, then the number
  // that got worse the most) and the decision it needs; the focus is the three most pressing things the data shows.
  const NOTABLE = 0.03;
  const highlights = (list) => {
    const all = list.flatMap((section) => section.metrics.map((m) => ({ ...m, section: section.key })));
    const lead = all.filter((m) => !m.minor);
    const ranked = (trend) => lead.filter((m) => m.cmp.trend === trend && m.cmp.rel >= NOTABLE).sort((a, b) => b.cmp.rel - a.cmp.rel);
    const better = ranked("better")[0] || null;
    const worse = ranked("worse")[0] || null;
    const safetySection = list.find((section) => section.key === "safety");
    const actionSection = list.find((section) => section.key === "actions");
    const misses = lead.filter((m) => m.cmp.target === "missed" && m.key !== "accidents" && m.key !== "overdue").sort((a, b) => b.cmp.gap - a.cmp.gap);
    let risk = { kind: "none" };
    if (safetySection?.data.accidents) risk = { kind: "accident", n: safetySection.data.accidents, date: safetySection.data.lastAccident.date, area: safetySection.data.lastAccident.area };
    else if (misses.length) risk = { kind: "target", metric: misses[0] };
    else if (actionSection?.data.overdue) risk = { kind: "overdue", n: actionSection.data.overdue };
    else if (worse) risk = { kind: "worse", metric: worse };

    const candidates = [];
    if (safetySection?.data.accidents) candidates.push({ kind: "accident", score: 1000, key: "accidents", n: safetySection.data.accidents, date: safetySection.data.lastAccident.date, area: safetySection.data.lastAccident.area });
    misses.forEach((m) => {
      const section = list.find((item) => item.key === m.section);
      if (m.key === "oee" && section.data.machines.length > 1) candidates.push({ kind: "machine", score: 500 + m.cmp.gap * 100, key: m.key, metric: m, machine: section.data.lowest });
      else if (m.key === "fiveS" && section.data.areas.length > 1 && section.data.areas[0].score < m.target) candidates.push({ kind: "area", score: 500 + m.cmp.gap * 100, key: m.key, metric: m, area: section.data.areas[0] });
      else candidates.push({ kind: "target", score: 500 + m.cmp.gap * 100, key: m.key, metric: m });
    });
    if (actionSection?.data.overdue) candidates.push({ kind: "overdue", score: 400 + actionSection.data.overdue, key: "overdue", n: actionSection.data.overdue, owners: actionSection.data.owners });
    const quality = list.find((section) => section.key === "quality");
    const worst = quality?.data.filter((log) => log.now.cause && log.now.cause.share >= 0.25)
      .sort((x, y) => ((y.now.target && y.now.rate > y.now.target) - (x.now.target && x.now.rate > x.now.target)) || y.now.cause.share - x.now.cause.share)[0];
    if (worst) candidates.push({ kind: "cause", score: 300 + worst.now.cause.share * 100, key: `${worst.key}-cause`, log: worst.key, cause: worst.now.cause });
    lead.filter((m) => m.cmp.trend === "worse" && m.cmp.rel >= NOTABLE && m.cmp.target !== "missed" && m.key !== "accidents" && m.key !== "overdue")
      .forEach((m) => candidates.push({ kind: "worse", score: 200 + m.cmp.rel * 100, key: m.key, metric: m }));
    const seen = new Set();
    const focus = candidates.sort((a, b) => b.score - a.score).filter((c) => (seen.has(c.key) ? false : seen.add(c.key))).slice(0, 3);
    return { better, worse, risk, focus };
  };

  // The example ---------------------------------------------------------------------------------------------------------
  // Fourteen weeks of a site, built from the few numbers in the data file with a seeded random generator, so the same
  // day always gives the same example. It lives in the page's memory only: nothing is written into the other tools.
  const rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const EXAMPLE_DAYS = 98;
  const exampleSources = (ex, today) => {
    const rand = rng(Number(ex.seed) || 7);
    const first = addDays(today, -(EXAMPLE_DAYS - 1));
    const days = Array.from({ length: EXAMPLE_DAYS }, (_, i) => addDays(first, i));
    const share = (iso) => between(first, iso) / (EXAMPLE_DAYS - 1);
    const lerp = ([a, b], x) => a + (b - a) * x;
    const pick = (list) => list[Math.floor(rand() * list.length)];
    // The first names of a list come up more often: one cause leads, as on a real floor.
    const lead = (list) => list[Math.min(list.length - 1, Math.floor(rand() ** 1.8 * list.length))];
    const working = days.filter((iso) => weekday(iso) < 6);
    const at = ([week, day]) => addDays(mondayOf(today), week * 7 + day);
    const hhmm = (minutes) => `${String(Math.floor(((minutes % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String(((minutes % 60) + 60) % 60).padStart(2, "0")}`;
    const shifts = ex.shifts || ["Early", "Late", "Night"];

    const defectLog = (spec, dates, shiftList) => {
      const rows = [];
      const volumes = [];
      dates.forEach((date) => {
        const volume = Math.round(spec.volume * (0.9 + 0.2 * rand()));
        volumes.push({ date, volume });
        let left = Math.round(volume * (lerp(spec.rate, share(date)) / 100) * (0.7 + 0.6 * rand()));
        while (left > 0) {
          const units = Math.min(left, 1 + Math.floor(rand() * 3));
          left -= units;
          rows.push({ date, shift: pick(shiftList), stage: lead(spec.stages), type: "", cause: lead(spec.causes), units, cost: "", note: "" });
        }
      });
      return { target: spec.target, volumes, rows };
    };

    const delayRows = [];
    working.forEach((date) => {
      const p = lerp(ex.delay.late, share(date)) / 100;
      for (let r = 0; r < ex.delay.routes; r++) {
        const plan = 6 * 60 + r * 40;
        const late = rand() < p;
        const arr = late ? 16 + Math.floor(rand() * 45) : -6 + Math.floor(rand() * 20);
        const dep = late && rand() < 0.6 ? Math.min(arr, 5 + Math.floor(rand() * 30)) : Math.floor(rand() * 8);
        delayRows.push({ date, shift: plan < 14 * 60 ? shifts[0] : shifts[1], route: `R${String(r + 1).padStart(2, "0")}`, planDep: hhmm(plan - 120), actDep: hhmm(plan - 120 + dep), planArr: hhmm(plan), actArr: hhmm(plan + arr), reason: "" });
      }
    });

    const areas = (ex.areas || []).map((a) => a.name);
    const safetyRows = [];
    working.forEach((date) => {
      if (rand() < ex.safety.near) safetyRows.push({ date, shift: pick(shifts), type: lead(["near-miss", "unsafe-condition", "unsafe-act"]), area: pick(areas), what: "", cause: "", severity: "", action: "", owner: "", done: false });
      if (rand() < 0.15) safetyRows.push({ date, shift: pick(shifts), type: "positive", area: pick(areas), what: "", cause: "", severity: "", action: "", owner: "", done: false });
    });
    ex.safety.events.forEach((event) => { const date = at([event.week, event.day]); if (date >= first && date <= today) safetyRows.push({ date, shift: shifts[1], type: event.type, area: areas[event.area] || "", what: "", cause: "", severity: "", action: "", owner: "", done: false }); });
    safetyRows.sort((a, b) => a.date.localeCompare(b.date));

    const oeeRows = [];
    working.forEach((date) => ex.oee.machines.forEach((machine) => shifts.slice(0, 2).forEach((shift) => {
      const planned = 450;
      const breakdown = Math.round(lerp(machine.breakdown, share(date)) * (0.4 + 1.2 * rand()));
      const setup = 10 + Math.floor(rand() * 20);
      const run = planned - 30 - breakdown - setup;
      const pieces = Math.round((machine.rate * Math.max(0, run)) / 60 * (0.82 + 0.12 * rand()));
      oeeRows.push({ date, shift, equipment: machine.name, planned, stops: [{ reason: ex.oee.stops.planned, minutes: 30 }, { reason: ex.oee.stops.breakdown, minutes: breakdown }, { reason: ex.oee.stops.setup, minutes: setup }], pieces, rejects: Math.round(pieces * (0.005 + 0.015 * rand())), startup: 0 });
    })));

    const PILLARS = ["sort", "set", "shine", "standardize", "sustain"];
    const fiveRows = [];
    days.filter((iso) => weekday(iso) === 2).forEach((date, w) => [0, 1].forEach((k) => {
      const index = (w * 2 + k) % Math.max(1, areas.length);
      const base = lerp(ex.fiveS.score, share(date)) - (index === ex.fiveS.weak ? 0.7 : 0);
      const scores = Object.fromEntries(PILLARS.map((p) => [p, Array.from({ length: 4 }, () => Math.max(0, Math.min(4, Math.round(base + rand() * 1.2 - 0.6))))]));
      fiveRows.push({ date, area: areas[index] || "", auditor: ex.areas[index]?.owner || "", shift: shifts[0], scores, notes: {} });
    }));

    const gembaRows = [];
    working.forEach((date) => {
      const layer = weekday(date) === 3 ? ex.gemba.layers[1] : weekday(date) % 2 === 0 ? ex.gemba.layers[0] : null;
      if (!layer) return;
      const p = lerp(ex.gemba.yes, share(date));
      gembaRows.push({ type: "lpa", date, layer, template: ex.gemba.template, area: pick(areas), walker: pick(ex.gemba.walkers), shift: shifts[0], minutes: 10 + Math.floor(rand() * 8), answers: Array.from({ length: 6 }, () => (rand() < p ? "yes" : rand() < 0.15 ? "na" : "no")), findings: {}, acts: {}, sent: {}, tallies: {}, notes: {} });
    });

    const hotelRows = days.map((date) => {
      const rooms = ex.hotel.rooms;
      const wd = weekday(date);
      const occ = Math.min(0.98, lerp(ex.hotel.occ, share(date)) + (wd < 4 ? 0.06 : wd === 4 ? -0.04 : -0.1) + (rand() - 0.5) * 0.08);
      const sold = Math.round(rooms * occ);
      const adr = lerp(ex.hotel.adr, share(date)) * (wd < 4 ? 1.04 : 0.93) * (0.97 + 0.06 * rand());
      return { date, available: rooms, sold, roomRev: Math.round(sold * adr * 100) / 100, otherRev: Math.round(sold * 17), arrivals: Math.round(sold * 0.45), departures: Math.round(sold * 0.44), noShows: rand() < 0.5 ? Math.floor(rand() * 3) : 0, walkIns: Math.floor(rand() * 2), ooo: Math.floor(rand() * 2), complaints: rand() < 0.3 ? 1 : 0, covers: Math.round(sold * 1.3), cause: "" };
    });

    const kaizenRows = ex.kaizen.map((idea, i) => {
      const date = at(idea.created);
      const adopted = idea.adopted ? at(idea.adopted) : "";
      return { id: `ex-k${i}`, title: idea.title, waste: idea.waste, area: idea.area, by: idea.by, date, effort: 2, impact: 3 + (i % 2), saving: idea.saving, status: adopted ? "act" : idea.status || "idea", owner: idea.by, due: "", next: "", result: "", reason: "", moved: adopted || date, adopted };
    }).filter((row) => row.date <= today);

    const actionRows = ex.actions.map((item, i) => ({
      id: `ex-a${i}`, title: item.title, detail: "", owner: item.owner, due: item.due ? at(item.due) : "", source: "", check: "", area: item.area, priority: "Medium",
      status: item.status, created: at(item.created), closed: item.closed ? at(item.closed) : "", result: "",
    })).filter((row) => row.created <= today && (!row.closed || row.closed <= today));

    const history = [];
    working.filter((date) => date < today && date >= addDays(today, -56)).forEach((date) => shifts.slice(0, 2).forEach((shift) => {
      const open = Math.floor(rand() * 2.4);
      const issues = Array.from({ length: open + 1 }, (_, k) => ({ text: pick(ex.handover.issues), priority: "", owner: pick(ex.handover.owners), due: "", done: k >= open, carried: 0 }));
      history.unshift({ closedAt: `${date}T${shift === shifts[0] ? "13" : "21"}:30:00.000Z`, handover: { date, shift, issues }, text: "" });
    }));

    const ws = working.filter((iso) => iso <= today);
    return {
      damage: defectLog(ex.damage, ws, shifts),
      incomplete: defectLog(ex.incomplete, ws, shifts),
      night: defectLog(ex.night, days, [shifts[2] || shifts[0]]),
      delay: { arrivalGrace: ex.delay.grace, departureGrace: "10", target: ex.delay.target, routes: "", rows: delayRows },
      safety: { rows: safetyRows },
      oee: { equipment: ex.oee.machines.map((m) => ({ name: m.name, rate: m.rate })), rows: oeeRows },
      fiveS: { rows: fiveRows },
      gemba: { rows: gembaRows },
      hotel: { rooms: String(ex.hotel.rooms), budgetOcc: ex.hotel.budgetOcc, budgetAdr: ex.hotel.budgetAdr, budgetRevpar: "", rows: hotelRows },
      kaizen: { rows: kaizenRows },
      actions: actionRows,
      handover: { history },
      workplace: { site: ex.site || "", shifts, areas: ex.areas || [], teams: [], targets: { ...(ex.targets || {}) } },
    };
  };

  // How many entries each source holds in a period (for the list of sources on the page).
  const counts = (src, range) => ({
    "damage-control": listOf(src.damage?.rows).filter((row) => inRange(row.date, range)).length,
    "incomplete-control": listOf(src.incomplete?.rows).filter((row) => inRange(row.date, range)).length,
    "night-audit": listOf(src.night?.rows).filter((row) => inRange(row.date, range)).length,
    "delay-analyzer": listOf(src.delay?.rows).filter((row) => inRange(row.date, range)).length,
    "shift-handover": listOf(src.handover?.history).filter((entry) => isObj(entry.handover) && inRange(entry.handover.date, range)).length,
    "safety-cross": listOf(src.safety?.rows).filter((row) => inRange(row.date, range)).length,
    oee: listOf(src.oee?.rows).filter((row) => inRange(row.date, range)).length,
    "five-s-audit": listOf(src.fiveS?.rows).filter((row) => inRange(row.date, range)).length,
    "gemba-walk": listOf(src.gemba?.rows).filter((row) => inRange(row.date, range)).length,
    "hotel-kpis": listOf(src.hotel?.rows).filter((row) => inRange(row.date, range)).length,
    "kaizen-board": listOf(src.kaizen?.rows).filter((row) => inRange(row.date, range) || inRange(row.adopted, range)).length,
    "action-tracker": listOf(src.actions).filter((row) => inRange(row.created, range) || inRange(row.closed, range)).length,
  });
  const holdsAnything = (src) => ["damage", "incomplete", "night", "delay", "safety", "oee", "fiveS", "gemba", "hotel", "kaizen"].some((key) => listOf(src[key]?.rows).length)
    || listOf(src.actions).length > 0 || listOf(src.handover?.history).length > 0;

  // A sentence template: a string, or { one, many } chosen by n; {name} placeholders filled from vars.
  const fill = (template, vars = {}, n = null) => {
    const chosen = isObj(template) ? (n === 1 ? template.one : template.many) ?? template.many ?? template.one : template;
    return String(chosen ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  };

  window.OpsReportMath = {
    KINDS, SOURCES, period, slotsOf, mondayOf, monthEnd, addDays, percent, minutesLate, defects, delivery, safety, oeeTarget, oeeEntry, oeeCombine,
    equipment, fiveSOverall, workplace, budgetOf, hotel, improvement, actions, compare, sections, highlights, rng, exampleSources, counts, holdsAnything, fill,
  };

  // The page -------------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-ops-report]");
  const dataEl = document.getElementById("ops-report-data");
  const results = document.querySelector("[data-results]");
  if (!root || !dataEl || !results || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { LANG, tx, el, int, euro, pct, showDate, read, write, loadState, isObject, today, firstVisit, shareText, capital, dayMonth, copy, partialRouteLog } = kit;
  const CK = window.ChartKit;
  const Workplace = window.Workplace;
  const Store = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  let reasons = [];
  try { reasons = JSON.parse(document.getElementById("ops-report-oee")?.textContent || "[]"); } catch { reasons = []; }
  const KEY = cfg.storageKey;
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const state = loadState(KEY, { period: "lastWeek", from: "", to: "", exampleOff: false });
  if (!(state.period in KINDS)) state.period = "lastWeek";
  const save = () => write(KEY, { period: state.period, from: state.from, to: state.to, exampleOff: state.exampleOff });
  let example = null;
  let adding = false;
  let notice = null;

  const periodBox = root.querySelector("[data-periods]");
  const customBox = root.querySelector("[data-custom]");
  const fromInput = root.querySelector("[name=from]");
  const toInput = root.querySelector("[name=to]");
  const spanNote = root.querySelector("[data-span]");
  const sourceList = root.querySelector("[data-sources]");
  const emptyNote = root.querySelector("[data-empty]");
  const exampleButton = root.querySelector("[data-example]");
  const setupBox = root.querySelector("[data-workplace]");
  const dayName = dayMonth(false);
  const short = (iso) => dayName(new Date(`${iso}T00:00:00Z`));
  const span = (range) => (range.from === range.to ? showDate(range.from) : `${showDate(range.from)} – ${showDate(range.to)}`);

  // The saved work of every tool, in this page's language (the actions and the workplace are one for all languages).
  const logOf = (tool) => {
    const saved = read(`sc-${tool}${SUFFIX}`, {});
    return isObject(saved) ? saved : {};
  };
  const readSources = () => ({
    damage: logOf("damage-control"), incomplete: logOf("incomplete-control"), night: logOf("night-audit"), delay: logOf("delay-analyzer"),
    safety: logOf("safety-cross"), oee: logOf("oee"), fiveS: logOf("five-s-audit"), gemba: logOf("gemba-walk"), hotel: logOf("hotel-kpis"),
    kaizen: logOf("kaizen-board"), handover: logOf("shift-handover"),
    actions: Store ? Store.list() : (Array.isArray(read("sc-actions", {})?.rows) ? read("sc-actions", {}).rows : []),
    workplace: Workplace ? Workplace.get() : { site: "", areas: [], targets: {} },
  });

  // Numbers in the page's format.
  const show = (value, format) => {
    if (!Number.isFinite(value)) return "–";
    if (format === "share") return shareText(value);
    if (format === "pct") return pct(value, 1);
    if (format === "pct0") return pct(value, 0);
    if (format === "euro") return euro.format(value);
    return int.format(Math.round(value));
  };
  const W = cfg.words;
  const label = (key) => cfg.metrics[key]?.label || key;
  const noun = (key) => cfg.metrics[key]?.noun || label(key);
  const names = (list) => (list.length <= 1 ? list.join("") : `${list.slice(0, -1).join(", ")} ${W.and} ${list.at(-1)}`);
  const trendText = (m) => (Number.isFinite(m.before)
    ? fill(cfg.sentences.trend, { value: show(m.value, m.format), before: show(m.before, m.format), trend: W[m.cmp.trend === "none" ? (m.cmp.arrow === "▲" ? "up" : m.cmp.arrow === "▼" ? "down" : "same") : m.cmp.trend] })
    : fill(cfg.sentences.noTrend, { value: show(m.value, m.format) }));
  const targetText = (m) => (m.cmp.target ? fill(m.cmp.target === "met" ? cfg.sentences.targetMet : cfg.sentences.targetMissed, { target: show(m.target, m.format) }) : "");
  const ownersText = (owners) => names(owners.map((o) => o.owner || W.noOwner));
  const areaOwner = (src, area) => (src.workplace?.areas || []).find((a) => fold(a.name) === fold(area))?.owner || "";

  // The sentence of each section, from the templates of the data file.
  const sentence = (section) => {
    const S = cfg.sentences;
    const m = Object.fromEntries(section.metrics.map((item) => [item.key, item]));
    const d = section.data;
    const parts = [];
    if (section.key === "safety") {
      const where = d.lastAccident?.area ? fill(S.safety.where, { area: d.lastAccident.area }) : "";
      parts.push(d.accidents ? fill(S.safety.accident, { n: int.format(d.accidents), date: showDate(d.lastAccident.date), where }, d.accidents) : fill(S.safety.none, { days: d.daysSince === null ? "–" : int.format(d.daysSince) }));
      parts.push(fill(S.safety.near, { near: int.format(d.nearMisses), nearBefore: section.prev ? int.format(section.prev.nearMisses) : "–" }));
    } else if (section.key === "quality") {
      section.metrics.filter((item) => !item.minor).forEach((item) => parts.push(fill(S.quality.lead, { metric: label(item.key), trend: trendText(item) }), targetText(item)));
      const main = d.find((log) => log.now.cause);
      if (main) parts.push(fill(S.quality.cause, { cause: main.now.cause.name, share: pct(main.now.cause.share, 0) }));
    } else if (section.key === "delivery") {
      if (d.partial) parts.push(fill(S.delivery.partial, { trend: trendText(m.late) }));
      else {
        parts.push(fill(S.delivery.lead, { trend: trendText(m.onTime) }), targetText(m.onTime));
        parts.push(d.late ? fill(S.delivery.late, { late: int.format(d.late), minutes: int.format(Math.round(d.minutes)) }, d.late) : S.delivery.none);
      }
    } else if (section.key === "equipment") {
      parts.push(fill(S.equipment.lead, { trend: trendText(m.oee) }), targetText(m.oee));
      if (d.machines.length > 1) parts.push(fill(S.equipment.machine, { machine: d.lowest.name, low: pct(d.lowest.oee, 1), factor: `${cfg.factors[d.lowest.factor]} ${pct(d.lowest[d.lowest.factor], 0)}` }));
    } else if (section.key === "workplace") {
      if (m.fiveS) {
        parts.push(fill(S.workplace.fiveS, { trend: trendText(m.fiveS) }), targetText(m.fiveS));
        if (d.areas.length > 1) parts.push(fill(S.workplace.weakest, { area: d.areas[0].area, low: pct(d.areas[0].score, 0) }));
      }
      if (m.gemba) parts.push(fill(S.workplace.gemba, { trend: trendText(m.gemba) }), targetText(m.gemba));
    } else if (section.key === "hotel") {
      parts.push(fill(S.hotel.lead, { trend: trendText(m.revpar) }), targetText(m.revpar));
      parts.push(fill(S.hotel.mix, { occ: show(d.occ, "pct"), adr: show(d.adr, "euro") }));
    } else if (section.key === "improvement") {
      parts.push(d.adopted ? fill(S.improvement.lead, { adopted: int.format(d.adopted), before: section.prev ? int.format(section.prev.adopted) : "–", saving: euro.format(d.saving) }, d.adopted) : S.improvement.none);
      if (d.ideas) parts.push(fill(S.improvement.ideas, { ideas: int.format(d.ideas) }, d.ideas));
    } else if (section.key === "actions") {
      if (section.metrics.length) {
        parts.push(fill(S.actions.lead, { opened: int.format(d.opened), closed: int.format(d.closed), verified: int.format(d.verified) }));
        parts.push(d.overdue ? fill(S.actions.overdue, { overdue: int.format(d.overdue), owners: ownersText(d.owners) }, d.overdue) : S.actions.overdueNone);
      }
      if (d.handovers) parts.push(fill(S.actions.handover, { n: int.format(d.handovers), carried: int.format(d.carried) }, d.handovers));
    }
    return parts.filter(Boolean).join(" ");
  };

  const summaryLines = (model, src, high) => {
    const S = cfg.summary;
    const site = src.workplace?.site ? fill(S.site, { site: src.workplace.site }) : "";
    const tools = Object.values(model.counts).filter((n) => n > 0).length;
    const lines = [fill(S.intro, { range: span(model.range), beforeRange: span(model.range.before), site, n: int.format(tools) }, tools)];
    const pair = (m) => ({ noun: noun(m.key), metric: label(m.key), before: show(m.before, m.format), value: show(m.value, m.format), target: show(m.target, m.format) });
    lines.push(high.better ? fill(S.better, pair(high.better)) : S.betterNone);
    lines.push(high.worse ? fill(S.worse, pair(high.worse)) : S.worseNone);
    const r = high.risk;
    if (r.kind === "accident") lines.push(fill(S.risk.accident, { n: int.format(r.n), date: showDate(r.date) }, r.n), S.decision.accident);
    else if (r.kind === "target") lines.push(fill(S.risk.target, pair(r.metric)), fill(S.decision.target, pair(r.metric)));
    else if (r.kind === "overdue") lines.push(fill(S.risk.overdue, { n: int.format(r.n) }, r.n), S.decision.overdue);
    else if (r.kind === "worse") lines.push(fill(S.risk.worse, pair(r.metric)), fill(S.decision.worse, pair(r.metric)));
    else lines.push(S.risk.none, S.decision.none);
    return lines.map((line) => capital(line));
  };

  // The focus items as actions: a title, the detail, an owner where the data names one, and how to check it.
  const focusItems = (high, src, range) => high.focus.map((c) => {
    const F = cfg.focus;
    const vars = c.metric ? { noun: noun(c.metric.key), metric: label(c.metric.key), value: show(c.metric.value, c.metric.format), before: show(c.metric.before, c.metric.format), target: show(c.metric.target, c.metric.format) } : {};
    const t = F[c.kind];
    let item;
    if (c.kind === "accident") {
      const where = c.area ? fill(cfg.sentences.safety.where, { area: c.area }) : "";
      item = { title: t.title, detail: fill(t.detail, { n: int.format(c.n), date: showDate(c.date), where }, c.n), check: t.check, owner: areaOwner(src, c.area), area: c.area, priority: "High" };
    } else if (c.kind === "overdue") {
      item = { title: t.title, detail: fill(t.detail, { n: int.format(c.n), owners: ownersText(c.owners) }, c.n), check: t.check, owner: c.owners.length === 1 ? c.owners[0].owner : "", priority: "High" };
    } else if (c.kind === "cause") {
      const key = c.log;
      item = { title: fill(t.title, { noun: noun(key), metric: label(key), cause: c.cause.name }), detail: fill(t.detail, { share: pct(c.cause.share, 0) }), check: fill(t.check, { cause: c.cause.name }), priority: "High" };
    } else if (c.kind === "machine") {
      const more = { ...vars, machine: c.machine.name, value: pct(c.machine.oee, 1), factor: `${cfg.factors[c.machine.factor]} ${pct(c.machine[c.machine.factor], 0)}` };
      item = { title: fill(t.title, more), detail: fill(t.detail, more), check: fill(t.check, more), priority: "High" };
    } else if (c.kind === "area") {
      const more = { ...vars, area: c.area.area, value: pct(c.area.score, 0) };
      item = { title: fill(t.title, more), detail: fill(t.detail, more), check: fill(t.check, more), owner: areaOwner(src, c.area.area), area: c.area.area, priority: "Medium" };
    } else {
      item = { title: fill(t.title, vars), detail: fill(t.detail, vars), check: fill(t.check, vars), priority: c.kind === "target" ? "High" : "Medium" };
    }
    return { ...item, title: capital(item.title), check: capital(item.check), due: addDays(range.to > today() ? range.to : today(), range.kind === "month" ? 30 : 7) };
  });

  // Charts -----------------------------------------------------------------------------------------------------------------
  const slotLabels = (range) => slotsOf(range).keys.map(short);
  const chartOf = (section, range) => {
    if (!CK) return null;
    const d = section.data;
    const labels = slotLabels(range);
    const title = cfg.sections[section.key];
    const file = `${cfg.text.file}-${section.key}`;
    let svg = null;
    if (section.key === "safety") {
      const keys = [label("accidents"), label("nearMisses")];
      if (d.firstAid) keys.splice(1, 0, label("firstAid"));
      const groups = labels.map((name, i) => ({ label: name, parts: [{ key: keys[0], value: d.series.accidents[i] }, ...(d.firstAid ? [{ key: keys[1], value: d.series.firstAid[i] }] : []), { key: keys.at(-1), value: d.series.nearMisses[i] }] }));
      if (!groups.some((g) => g.parts.some((p) => p.value > 0))) return null;
      svg = CK.stacked(groups, { keys, colors: Object.fromEntries(keys.map((key, i) => [key, i === 0 ? CK.C.danger : i === keys.length - 1 ? CK.C.warn : CK.C.muted])), title, unit: "" });
    } else if (section.key === "quality") {
      const series = d.map((log) => ({ label: label(log.key), points: labels.map((x, i) => ({ x, y: log.now.series[i] })) }));
      svg = CK.line(series, { title, unit: series.length === 1 ? series[0].label : "" });
    } else if (section.key === "delivery") {
      if (d.partial) svg = CK.bars(labels.map((name, i) => ({ label: name, value: d.lateSeries[i] })), { title, unit: label("late") });
      else svg = CK.bars(labels.map((name, i) => ({ label: name, value: d.series[i] ?? 0 })).filter((item, i) => d.series[i] !== null), { title, unit: label("onTime"), yMax: 1, format: (v) => pct(v, 0), target: d.target ?? undefined, highlight: (item) => d.target !== null && item.value < d.target - 1e-9 });
    } else if (section.key === "equipment") {
      svg = CK.bars(d.machines.map((m) => ({ label: m.name, value: m.oee ?? 0, tip: `${m.name}: OEE ${pct(m.oee ?? 0, 1)} · ${cfg.factors.availability} ${pct(m.availability ?? 0, 0)} · ${cfg.factors.performance} ${pct(m.performance ?? 0, 0)} · ${cfg.factors.quality} ${pct(m.quality ?? 0, 0)}` })), { title, unit: "OEE", yMax: 1, format: (v) => pct(v, 0), target: d.target, highlight: (item) => item.value < d.target - 1e-9 });
    } else if (section.key === "workplace") {
      if (d.areas.length) svg = CK.bars(d.areas.map((a) => ({ label: a.area, value: a.score })), { title, unit: label("fiveS"), yMax: 1, format: (v) => pct(v, 0), target: d.fiveSTarget ?? undefined, highlight: (item) => d.fiveSTarget !== null && item.value < d.fiveSTarget - 1e-9 });
    } else if (section.key === "hotel") {
      svg = CK.line([{ label: label("occ"), points: labels.map((x, i) => ({ x, y: d.series[i] ?? NaN })) }], { title, unit: label("occ"), yMin: 0, yMax: 1, format: (v) => pct(v, 0), target: d.budget.occ ?? undefined });
    } else if (section.key === "improvement") {
      if (d.list.length > 1) svg = CK.bars(d.list.slice(0, 8).map((idea) => ({ label: idea.title, value: idea.saving, tip: `${idea.title}: ${euro.format(idea.saving)}` })), { title, unit: label("saving"), format: (v) => int.format(Math.round(v)) });
    } else if (section.key === "actions") {
      if (d.owners.length) svg = CK.bars(d.owners.map((o) => ({ label: o.owner || W.noOwner, value: o.n })), { title, unit: label("overdue"), highlight: () => true });
    }
    return svg ? CK.figure(svg, { fileName: file }) : null;
  };

  // The model of the report for the period chosen, from the example or from this browser.
  const build = () => {
    const src = example || readSources();
    const range = period(state.period, today(), { from: state.from, to: state.to });
    const targets = { ...(src.workplace?.targets || {}) };
    const list = sections(src, range, range.before, { targets, reasons, partialDelay: example ? false : Boolean(partialRouteLog?.(src.delay)) });
    return { src, range, list, high: highlights(list), counts: counts(src, range), before: counts(src, range.before) };
  };

  // The report as plain text: for an email or a chat message.
  const asText = (model, summary, focus) => {
    const site = model.src.workplace?.site || "";
    const lines = [`${cfg.report.title}${site ? ` · ${site}` : ""}`, `${cfg.report.period}: ${span(model.range)} · ${cfg.report.before} ${span(model.range.before)}`, ""];
    lines.push(cfg.sections.summary.toUpperCase(), ...summary, "");
    model.list.forEach((section) => {
      lines.push(cfg.sections[section.key].toUpperCase());
      section.metrics.forEach((m) => lines.push(`- ${metricLine(m)}`));
      lines.push(sentence(section), "");
    });
    lines.push(focusTitle(model).toUpperCase());
    if (!focus.length) lines.push(cfg.focus.none);
    focus.forEach((item, i) => lines.push(`${i + 1}. ${item.title}. ${item.detail}${item.owner ? ` ${W.owner}: ${item.owner}.` : ""} ${W.check}: ${item.check}.`));
    return lines.join("\n").replace(/­/g, "");
  };
  const changeWords = (m) => (m.bare ? "" : Number.isFinite(m.before) ? `${m.cmp.arrow} ${m.cmp.trend === "none" ? "" : `${W[m.cmp.trend]} `}(${W.before} ${show(m.before, m.format)})`.replace(/\s+/g, " ").trim() : W.noBefore);
  const targetWords = (m) => (m.cmp.target ? `${W.target} ${show(m.target, m.format)}: ${W[m.cmp.target]}` : "");
  const metricLine = (m) => [`${label(m.key)}: ${show(m.value, m.format)}`, changeWords(m), targetWords(m)].filter(Boolean).join(" · ");
  const focusTitle = (model) => (model.range.kind === "month" ? cfg.sections.focusMonth : cfg.sections.focusWeek);

  // The Word file: title, period and site, each section with a heading, its numbers as a small table and its sentence.
  const wordFile = (model, summary, focus) => {
    const D = window.DocxKit;
    if (!D) return null;
    const { run, para, TEXT_WIDTH } = D;
    const GREY = '<w:color w:val="555555"/>';
    const body = [];
    const heading = (value) => body.push(para(run(value), '<w:pStyle w:val="Heading1"/>'));
    const site = model.src.workplace?.site || "";
    body.push(para(run(`${cfg.report.title}${site ? ` · ${site}` : ""}`), '<w:pStyle w:val="Title"/>'));
    body.push(para(run(`${cfg.report.period}: `, "<w:b/>") + run(`${span(model.range)} · ${cfg.report.before} ${span(model.range.before)}`)));
    if (site) body.push(para(run(`${cfg.report.site}: `, "<w:b/>") + run(site)));
    body.push(para(run(fill(cfg.report.written, { date: showDate(today()) }), GREY), '<w:spacing w:after="160"/>'));
    heading(cfg.sections.summary);
    summary.forEach((line) => body.push(para(run(line))));
    const widths = [3238, 1600, 1600, 1600, 1600];
    const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
    const cell = (value, width, head) => `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${head ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${para(run(value || "–", head ? "<w:b/>" : ""), '<w:spacing w:before="30" w:after="30"/>')}</w:tc>`;
    const table = (rows) => `<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${w}"/>`).join("")}</w:tblGrid>${rows.map((row, i) => `<w:tr>${i === 0 ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${row.map((value, j) => cell(value, widths[j], i === 0)).join("")}</w:tr>`).join("")}</w:tbl>`;
    model.list.forEach((section) => {
      heading(cfg.sections[section.key]);
      if (section.metrics.length) {
        body.push(table([cfg.report.table, ...section.metrics.map((m) => [label(m.key), show(m.value, m.format), show(m.before, m.format), changeWords(m), m.cmp.target ? `${show(m.target, m.format)} · ${W[m.cmp.target]}` : ""])]));
      }
      body.push(para(run(sentence(section)), '<w:spacing w:before="100"/>'));
    });
    heading(focusTitle(model));
    if (!focus.length) body.push(para(run(cfg.focus.none)));
    focus.forEach((item, i) => {
      body.push(para(run(`${i + 1}.  ${item.title}`, "<w:b/>"), '<w:ind w:left="397" w:hanging="397"/>'));
      body.push(para(run(`${item.detail}${item.owner ? ` ${W.owner}: ${item.owner}.` : ""} ${W.check}: ${item.check}.`), '<w:ind w:left="397"/>'));
    });
    return D.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: `${cfg.report.title}${site ? ` · ${site}` : ""}`, creator: site });
  };
  const download = (bytes, name) => {
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  // Rendering --------------------------------------------------------------------------------------------------------------
  const tile = (m) => {
    const box = el("div", `dl-stat or-stat${m.cmp.target === "missed" ? " is-missed" : ""}`);
    box.append(el("span", "dl-stat-label", label(m.key)), el("strong", "dl-stat-value", show(m.value, m.format)));
    if (!m.bare) box.append(el("span", `dl-stat-note or-change${m.cmp.trend === "better" ? " is-better" : m.cmp.trend === "worse" ? " is-worse" : ""}`, changeWords(m)));
    if (m.cmp.target) box.append(el("span", `dl-stat-note or-target is-${m.cmp.target}`, targetWords(m)));
    return box;
  };

  const renderSources = (model) => {
    sourceList.replaceChildren();
    Object.entries(cfg.sources).forEach(([tool, name]) => {
      const n = model.counts[tool] || 0;
      const item = el("li", n ? "has-data" : "");
      const link = el("a", null, name);
      link.href = new URL(`../${tool}/`, window.location.href).href;
      item.append(link, el("span", "or-count", n ? tx(n === 1 ? "{n} entry in the period" : "{n} entries in the period", { n: int.format(n) }) : tx("nothing in the period")));
      sourceList.append(item);
    });
  };

  const exampleNoteBox = el("div", "dl-example-note");
  exampleNoteBox.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNoteBox.append(el("strong", null, tx("Example")), " ", el("span", null, cfg.text.exampleNote), " ", clearExample);
  exampleNoteBox.hidden = true;
  results.before(exampleNoteBox);

  const render = () => {
    const live = readSources();
    const has = holdsAnything(live);
    if (has) example = null;
    const model = build();
    const range = model.range;
    spanNote.textContent = tx("{range}, compared with {before}", { range: span(range), before: span(range.before) });
    customBox.hidden = state.period !== "custom";
    renderSources(model);
    emptyNote.hidden = has || Boolean(example);
    exampleNoteBox.hidden = !example;
    results.replaceChildren();
    if (!has && !example) { results.hidden = true; return; }
    results.hidden = false;

    const report = el("article", "or-report");
    const head = el("header", "or-head");
    const site = model.src.workplace?.site || "";
    head.append(el("p", "kicker", `${range.kind === "month" ? cfg.report.monthly : range.kind === "week" ? cfg.report.weekly : cfg.report.periodReport} · ${span(range)}`));
    head.append(el("h2", "or-title", `${cfg.report.title}${site ? ` · ${site}` : ""}`));
    head.append(el("p", "or-meta", `${cfg.report.before} ${span(range.before)} · ${fill(cfg.report.written, { date: showDate(today()) })}`));
    report.append(head);

    if (!model.list.length) {
      report.append(el("p", "or-sentence", cfg.text.nothing));
      results.append(report);
      return;
    }
    const summary = summaryLines(model, model.src, model.high);
    const summaryBox = el("section", "or-section or-summary");
    summaryBox.append(el("h3", "or-section-title", cfg.sections.summary), el("p", "or-summary-text", summary.join(" ")));
    report.append(summaryBox);

    model.list.forEach((section) => {
      const box = el("section", `or-section or-${section.key}`);
      box.append(el("h3", "or-section-title", cfg.sections[section.key]));
      if (section.metrics.length) {
        const stats = el("div", "or-stats");
        section.metrics.forEach((m) => stats.append(tile(m)));
        box.append(stats);
      }
      const chart = chartOf(section, range);
      if (chart) box.append(chart);
      box.append(el("p", "or-sentence", sentence(section)));
      report.append(box);
    });

    const focus = focusItems(model.high, model.src, range);
    const focusBox = el("section", "or-section or-focus");
    focusBox.append(el("h3", "or-section-title", focusTitle(model)));
    if (focus.length) {
      const list = el("ol", "or-focus-list");
      focus.forEach((item) => {
        const li = el("li");
        li.append(el("strong", null, item.title), el("span", null, ` ${item.detail}`));
        li.append(el("small", null, `${item.owner ? `${W.owner}: ${item.owner} · ` : ""}${W.check}: ${item.check}`));
        list.append(li);
      });
      focusBox.append(list);
    } else {
      focusBox.append(el("p", "or-sentence", cfg.focus.none));
    }
    report.append(focusBox);
    results.append(report);

    // Exports and the hand-off.
    const bar = el("div", "tool-actions result-actions or-actions");
    const status = el("p", "form-note or-status");
    status.setAttribute("aria-live", "polite");
    const button = (text, cls, onClick) => {
      const b = el("button", cls, text);
      b.type = "button";
      b.addEventListener("click", onClick);
      bar.append(b);
      return b;
    };
    const copyButton = button(tx("Copy as text"), "button-primary", () => copy(asText(model, summary, focus), copyButton));
    button(tx("Print or save as PDF"), "button-secondary", () => window.print());
    const wordButton = button(tx("Download Word"), "button-secondary", () => {
      const bytes = wordFile(model, summary, focus);
      if (bytes) download(bytes, `${cfg.text.file}-${range.from}-${range.to}.docx`);
    });
    wordButton.hidden = !window.DocxKit;
    if (focus.length && Store) {
      const monthly = range.kind === "month";
      const add = button(tx(monthly ? "Add next month's focus to the actions" : "Add next week's focus to the actions"), "button-secondary", () => {
        if (example) return;
        const open = Store.list().filter((a) => Store.isOpen(a) && a.source === "ops-report").map((a) => a.title);
        // Each add announces itself; the report is drawn once, after the last one, with the note below it.
        adding = true;
        let added = [];
        try { added = focus.filter((item) => !open.includes(item.title)).map((item) => Store.add({ ...item, source: "ops-report" })).filter(Boolean); } finally { adding = false; }
        notice = added.length ? tx(added.length === 1 ? "{n} action added to the Action Tracker." : "{n} actions added to the Action Tracker.", { n: int.format(added.length) }) : tx("These actions are already in the Action Tracker.");
        render();
      });
      if (example) {
        add.disabled = true;
        status.textContent = cfg.text.exampleActions;
      }
    }
    if (notice && Store) {
      const link = el("a", "inline-link", tx("Open the Action Tracker"));
      link.href = Store.trackerUrl().href;
      status.replaceChildren(notice, " ", link);
      notice = null;
    }
    results.append(bar, status);
  };

  // The period buttons and the custom days.
  periodBox.querySelectorAll("input[name=period]").forEach((input) => { input.checked = input.value === state.period; });
  fromInput.value = state.from;
  toInput.value = state.to;
  periodBox.addEventListener("change", (event) => {
    if (event.target.name !== "period") return;
    state.period = event.target.value;
    if (state.period === "custom" && !state.from) {
      const range = period("custom", today());
      state.from = range.from;
      state.to = range.to;
      fromInput.value = state.from;
      toInput.value = state.to;
    }
    save();
    render();
  });
  [fromInput, toInput].forEach((input) => input.addEventListener("change", () => {
    state.from = kit.parseDate(fromInput.value) || "";
    state.to = kit.parseDate(toInput.value) || "";
    save();
    render();
  }));

  const loadExample = () => {
    example = exampleSources(cfg.example, today());
    render();
  };
  exampleButton?.addEventListener("click", () => {
    state.exampleOff = false;
    save();
    loadExample();
    results.focus?.();
  });
  clearExample.addEventListener("click", () => {
    example = null;
    state.exampleOff = true;
    save();
    render();
  });

  // The site and the targets live in the workplace profile, which the logs share.
  if (Workplace && setupBox) Workplace.renderSetup(setupBox, { prefix: "or", show: ["site", "targets"], targets: cfg.targets, onChange: render });
  window.addEventListener("actions:changed", () => { if (!adding) render(); });
  window.addEventListener("storage", (event) => { if (!event.key || event.key.startsWith("sc-")) render(); });

  // A first visit with nothing in this browser opens on the example; real work in any tool replaces it.
  if (!state.exampleOff && firstVisit(KEY) && !holdsAnything(readSources())) example = exampleSources(cfg.example, today());
  render();
})();
