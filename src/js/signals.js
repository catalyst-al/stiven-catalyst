// Signals (js/signals.js): the one page an area manager opens in the morning. It reads what the other tools hold in
// this browser (each tool's own key, sc-<slug> with -de or -sq on the translated pages, and the shared sc-actions,
// sc-workplace and sc-annotations), turns it into daily series and open items, and lists everything that needs
// attention in one ranked list:
// - statistical: each daily series gets the control chart it needs (StatsKit: a rate with its volume is a p-chart,
//   a count without volume a c-chart, complaints per room sold a u-chart, a measured value an individuals chart) and
//   the rules are read on its latest point: beyond a control limit, 8 in a row on one side, 6 rising or falling;
// - target: the latest day (audit, week) worse than its target;
// - overdue: actions, maintenance tasks, lost and found items, red tags, Kaizen ideas, re-cleans, layer walks;
// - safety: an accident or first aid in the last 7 days, always on top.
// Signals keeps only the visitor's choices (period, minimum severity, what was dismissed today) under its own key.
// The example is a set of tool states held in memory: it is never written to another tool's key.
// The arithmetic lives in window.SignalsMath, so tests can call it without the page.
(() => {
  const DAY = 864e5;
  // A control chart needs at least 8 points: with fewer, its limits say more about the few days than the process.
  const MIN_POINTS = 8;
  // Western Electric: 8 in a row on one side of the centre line. Nelson rule 3: 6 in a row rising or falling.
  const RUN = 8;
  const TREND = 6;
  const SAFETY_DAYS = 7;
  const RECLEAN_DAYS = 7;
  // The tools' own limits: a red tag older than 30 days (FiveSMath.OLD_TAG_DAYS), an answer to an idea within a week
  // (the Kaizen Board's own rule), LPA compliance of 90 % (the Gemba Walk's target line), OEE of 85 % when the
  // workplace profile has no target (the OEE tool's world class).
  const OLD_TAG_DAYS = 30;
  const IDEA_ANSWER_DAYS = 7;
  const LPA_TARGET = 0.9;
  const OEE_WORLD_CLASS = 0.85;
  // An overdue action becomes high when it is High priority or more than two weeks late.
  const ACTION_LATE_DAYS = 14;
  const SEVERITIES = ["high", "medium", "low"];
  const KINDS = ["safety", "stat", "target", "overdue"];
  const TOOLS = ["safety-cross", "damage-control", "incomplete-control", "night-audit", "delay-analyzer", "oee", "five-s-audit", "hotel-kpis",
    "room-inspection", "maintenance-planner", "lost-found", "kaizen-board", "action-tracker", "gemba-walk"];
  // The defect logs and the key of their target in the workplace profile (as defect-log.js reads it).
  const DEFECT_LOGS = { "damage-control": "damage", "incomplete-control": "incomplete", "night-audit": "nightAudit" };
  const ACCIDENTS = ["lost-time", "no-lost-time"];
  const INJURIES = [...ACCIDENTS, "first-aid"];
  const FIVE_S = { "5S": ["sort", "set", "shine", "standardize", "sustain"], "6S": ["sort", "set", "shine", "standardize", "sustain", "safety"], "8S": ["sort", "set", "shine", "standardize", "sustain", "safety", "security", "satisfaction"] };

  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const list = (value) => (Array.isArray(value) ? value : []);
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const sum = (values) => values.reduce((total, value) => total + value, 0);
  const addDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  const dayRange = (from, to) => {
    const out = [];
    for (let day = from; day <= to && out.length < 4000; day = addDays(day, 1)) out.push(day);
    return out;
  };
  const fold = (text) => String(text ?? "").trim().toLowerCase();
  // A typed number ("0.3", "0,3", "95 %"); NaN when there is none.
  const typed = (value) => {
    const text = String(value ?? "").replace(/[\s%]/g, "").replace(",", ".");
    return text && /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text) ? Number(text) : NaN;
  };
  const positive = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const latestDate = (dates) => dates.filter(isIso).sort().at(-1) || "";

  // Control charts --------------------------------------------------------------------------------------------------
  // One chart of the points of a series, through StatsKit. Every point gets its centre, limits, sigma and z (its
  // distance from the centre in sigmas). kind "p": rows { d, n } (d out of n); StatsKit has no p-chart, but an np-chart
  // divided by each day's n is one: p̄ = Σd / Σn, σᵢ = √(p̄(1 − p̄) / nᵢ), limits p̄ ± 3σᵢ (never below 0), the same z.
  // kind "c": rows { c }, c̄ ± 3√c̄. kind "u": rows { c, n }, ū ± 3√(ū / nᵢ). kind "imr": rows { value }, x̄ ± 2.66·MR̄
  // (3 / d2, d2 = 1.128). Returns null when the chart cannot be drawn (no volume, fewer than two values).
  const chartOf = (kind, rows, Stats = window.StatsKit) => {
    if (!Stats || !rows.length) return null;
    const input = kind === "p" ? rows.map((r) => ({ count: r.d, size: r.n }))
      : kind === "u" ? rows.map((r) => ({ count: r.c, size: r.n }))
        : kind === "c" ? rows.map((r) => ({ count: r.c }))
          : rows.map((r) => ({ value: r.value }));
    const chart = Stats.controlChart(kind === "p" ? "np" : kind, input);
    if (!chart || !chart.points.length) return null;
    const phase = chart.phases[0];
    const points = chart.points.map((point, i) => {
      const scale = kind === "p" ? rows[i].n : 1;
      const out = { ...rows[i], y: point.y / scale, center: point.center / scale, ucl: point.ucl / scale, lcl: point.lcl / scale, sigma: point.sigma / scale };
      out.z = out.sigma > 0 ? (out.y - out.center) / out.sigma : 0;
      return out;
    });
    const center = kind === "p" ? phase.rate : phase.center;
    return { kind, center, sigma: kind === "p" ? sum(points.map((p) => p.sigma)) / points.length : phase.sigma, points, signals: chart.signals, mrBar: kind === "imr" ? phase.secondCenter : null };
  };
  // The points at the end of the series on one side of the centre line, in a row (a point on the line breaks the run).
  const runLength = (zs) => {
    const side = Math.sign(zs.at(-1) || 0);
    if (!side) return { n: 0, dir: null };
    let n = 0;
    for (let i = zs.length - 1; i >= 0 && Math.sign(zs[i]) === side; i--) n++;
    return { n, dir: side > 0 ? "up" : "down" };
  };
  // Low counts. The 3σ line and the run of 8 assume that a point beyond 3σ is rare (0.135 % on each side) and that a
  // point is as likely above the centre line as below it. A count of a few a day is neither: at c̄ = 0.2 four days in
  // five are 0, below the centre line, so 8 in a row below it comes on one day in five; and 2 on a day is beyond
  // c̄ + 3√c̄ on 1.8 % of days. Under LOW_COUNT expected per point, a count chart's rules use the count's own law
  // instead: Poisson (c- and u-charts) or binomial (p-chart), with the chart's centre line as its mean.
  const LOW_COUNT = 5;
  const TAIL = 0.00135;
  const RUN_CHANCE = 0.5 ** RUN;
  // Each point of a count chart as { k (its count), e (the count its centre line expects), cdf (P(X ≤ x)) }; null for
  // an individuals chart, or without StatsKit's counts.
  const countModel = (chart, Stats = window.StatsKit) => {
    if (!chart || !["c", "u", "p"].includes(chart.kind) || !Stats?.poissonCdf || !Stats?.binomialCdf) return null;
    return chart.points.map((point) => {
      if (chart.kind === "p") {
        const n = Math.round(Number(point.n));
        return { k: Number(point.d), e: n * chart.center, cdf: (x) => Stats.binomialCdf(x, n, chart.center) };
      }
      const e = chart.kind === "u" ? chart.center * Number(point.n) : chart.center;
      return { k: Number(point.c), e, cdf: (x) => Stats.poissonCdf(x, e) };
    });
  };
  // A point beyond a limit that is rare by the count's own law too: on the high side P(X ≥ k) at most TAIL. A point on
  // the low side needs a lower limit above 0: with none, no count is low enough to be beyond it.
  const rareBeyond = (chart, model, i, dir) => {
    if (dir === "down" && chart.kind !== "imr" && !(chart.points[i].lcl > 0)) return false;
    const m = model?.[i];
    if (!m || m.e >= LOW_COUNT) return true;
    return dir === "up" ? 1 - m.cdf(m.k - 1) <= TAIL : m.cdf(m.k) <= TAIL;
  };
  // A run ending at the latest point that is as unlikely as 8 in a row on one side of a fair coin (0.5⁸): the chance
  // of each point on its side of the centre line by the count's law (0.5 from LOW_COUNT up), multiplied over the run.
  // At c̄ = 0.2 a day below the centre line has a chance of 0.82, so 8 zero days are no signal; at c̄ = 3.4, 10 are.
  const rareRun = (model, last, run) => {
    if (!model) return true;
    let chance = 1;
    for (let i = last; i > last - run.n; i--) {
      const m = model[i];
      chance *= m.e >= LOW_COUNT ? 0.5 : run.dir === "up" ? 1 - m.cdf(Math.floor(m.e)) : m.cdf(Math.ceil(m.e) - 1);
    }
    return chance <= RUN_CHANCE;
  };
  // The rules on the latest point of a chart. beyond: StatsKit's rule 1 on the standardized point (more than 3σ from
  // the centre, so a p-chart's own limits of the day count), and for a low count rare by its own law (rareBeyond).
  // run: 8 or more in a row on one side, ending with it, and for a low count as rare as 8 would be (rareRun). trend:
  // StatsKit's Nelson rule 3 (6 in a row, each higher or each lower than the one before) on the plotted values, ending
  // with it. Each rule says its direction; `better` ("up" or "down") says which direction is good news.
  const rulesAt = (chart, better, Stats = window.StatsKit) => {
    if (!chart || !(chart.sigma > 0)) return [];
    const last = chart.points.length - 1;
    const out = [];
    const zs = chart.points.map((p) => p.z);
    const model = countModel(chart, Stats);
    const beyond = zs[last] > 0 ? "up" : "down";
    if ((chart.signals[last] || []).includes(1) && rareBeyond(chart, model, last, beyond)) out.push({ rule: "beyond", dir: beyond, points: 1 });
    const run = runLength(zs);
    if (run.n >= RUN && rareRun(model, last, run)) out.push({ rule: "run", dir: run.dir, points: run.n });
    const values = chart.points.map((p) => p.y);
    const trend = Stats.nelson(values, chart.center, chart.sigma);
    if (last >= TREND - 1 && (trend[last] || []).includes(3)) {
      // The points of the trend: the latest and every one before it that keeps the same direction.
      const step = Math.sign(values[last] - values[last - 1]);
      let n = 2;
      while (last - n >= 0 && Math.sign(values[last - n + 1] - values[last - n]) === step) n++;
      out.push({ rule: "trend", dir: step > 0 ? "up" : "down", points: n });
    }
    return out.map((item) => ({ ...item, bad: item.dir !== better }));
  };
  // A bad point beyond a limit is high; a bad run or trend medium; a signal on the good side only is low.
  const statSeverity = (rules) => (rules.some((r) => r.bad && r.rule === "beyond") ? "high" : rules.some((r) => r.bad) ? "medium" : "low");

  // Events on the timeline (sc-annotations), as Annotations.clean keeps them: a date, a text, the tools (none: all).
  const annotations = (saved) => list(saved?.rows).filter(isObj).map((row) => ({ date: str(row.date), text: str(row.text).slice(0, 160), tools: list(row.tools).filter((t) => typeof t === "string") }))
    .filter((row) => isIso(row.date) && row.text).sort((a, b) => a.date.localeCompare(b.date));
  // The latest change on the timeline inside a series (after its first point, up to its last) for this tool. With 8 or
  // more points from that day on, the limits come from those points only; with fewer, from all, and the signal says so.
  const phaseOf = (points, events, tool) => {
    if (!points.length) return { used: points, change: null, since: 0, enough: false };
    const first = points[0].date, last = points.at(-1).date;
    const change = events.filter((e) => (!e.tools.length || e.tools.includes(tool)) && e.date > first && e.date <= last).at(-1) || null;
    if (!change) return { used: points, change: null, since: 0, enough: false };
    const after = points.filter((p) => p.date >= change.date);
    return after.length >= MIN_POINTS ? { used: after, change, since: after.length, enough: true } : { used: points, change, since: after.length, enough: false };
  };

  // Series of the tools ----------------------------------------------------------------------------------------------
  // A series: { tool, key, kind (p, c, u, imr), better, unit, points (oldest first, each with a date), target, source
  // (where the target came from), note }. The points stay inside the period { from, to }.
  const inPeriod = (date, period) => isIso(date) && date >= period.from && date <= period.to;
  const unitsOf = (row) => { const n = Math.round(Number(row.units)); return n > 0 ? n : 1; };
  const volumesOf = (saved) => {
    const byDate = new Map();
    list(saved?.volumes).filter(isObj).forEach((item) => {
      const volume = Math.round(Number(item.volume));
      if (isIso(item.date) && volume > 0 && Number.isSafeInteger(volume)) byDate.set(item.date, volume);
    });
    return [...byDate].sort(([a], [b]) => a.localeCompare(b)).map(([date, volume]) => ({ date, volume }));
  };
  // A target typed as a per cent ("0.3" is 0.3 %), else the workplace profile's; as a share. null without one.
  const shareTarget = (text, profile) => {
    const own = typed(text);
    if (own > 0) return { value: own / 100, source: "tool" };
    return Number.isFinite(profile) && profile > 0 ? { value: profile / 100, source: "workplace" } : null;
  };
  // Damage Control, Incomplete Control, the Night Audit Log: the units of each day out of the volume of that day. With
  // a volume on 8 days or more of the period, a p-chart of the days with a volume (a day with entries and no volume
  // cannot be a share and is counted in `skipped`). Otherwise a c-chart of the units per day, from the first day with
  // entries to the latest (a quiet day in between is 0, as Shift Pulse counts it); a count has no target.
  const defectSeries = (tool, saved, period, targets = {}) => {
    const rows = list(saved?.rows).filter(isObj).filter((row) => inPeriod(row.date, period));
    const units = new Map();
    rows.forEach((row) => units.set(row.date, (units.get(row.date) || 0) + unitsOf(row)));
    const volumes = volumesOf(saved).filter((item) => inPeriod(item.date, period));
    const have = new Set(volumes.map((item) => item.date));
    const shares = volumes.map((item) => ({ date: item.date, d: units.get(item.date) || 0, n: item.volume })).filter((p) => p.d <= p.n);
    const skipped = [...units.keys()].filter((date) => !have.has(date)).length + volumes.length - shares.length;
    const target = shareTarget(saved?.target, targets[DEFECT_LOGS[tool]]);
    const dates = [...units.keys()].sort();
    const points = dates.length ? dayRange(dates[0], dates.at(-1)).map((date) => ({ date, c: units.get(date) || 0 })) : [];
    // With too few days for either chart, the rate stays: its target can still be checked.
    if (shares.length >= MIN_POINTS || (shares.length && points.length < MIN_POINTS)) {
      return { tool, key: `${tool}:rate`, kind: "p", better: "down", unit: "share", points: shares, target: target?.value ?? null, source: target?.source || "", skipped };
    }
    return { tool, key: `${tool}:count`, kind: "c", better: "down", unit: "count", points, target: null, source: "", skipped: 0, volumeDays: shares.length };
  };

  // The Delay Analyzer: minutes after plan at arrival (a route across midnight stays within twelve hours); late is more
  // than the arrival grace (15 minutes when none was saved, as Shift Pulse reads it). Two series: the late routes of each
  // day out of its routes (a p-chart; with only some routes in the log, a c-chart of the late routes, as Shift Pulse
  // counts them), and the average minutes late of the day's late routes (an individuals chart). The on-time target
  // (typed, else the profile's) is checked on the latest day.
  const clock = (time) => (/^\d{2}:\d{2}$/.test(String(time ?? "")) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  const minutesLate = (planned, actual) => {
    const a = clock(planned), b = clock(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  const delaySeries = (saved, period, targets = {}, partial = false) => {
    const grace = saved?.arrivalGrace === undefined || saved?.arrivalGrace === null ? NaN : typed(saved.arrivalGrace === "" ? "0" : saved.arrivalGrace);
    const arrGrace = Number.isFinite(grace) && grace >= 0 ? grace : 15;
    const days = new Map();
    list(saved?.rows).filter(isObj).filter((row) => inPeriod(row.date, period)).forEach((row) => {
      const arr = minutesLate(row.planArr, row.actArr);
      if (arr === null) return;
      const day = days.get(row.date) || { routes: 0, late: 0, minutes: 0 };
      day.routes++;
      if (arr > arrGrace) { day.late++; day.minutes += arr; }
      days.set(row.date, day);
    });
    const dates = [...days.keys()].sort();
    const own = typed(saved?.target);
    const goal = own > 0 ? { value: own / 100, source: "tool" } : Number.isFinite(targets.ontime) && targets.ontime > 0 ? { value: targets.ontime / 100, source: "workplace" } : null;
    const late = partial
      ? { tool: "delay-analyzer", key: "delay-analyzer:late-count", kind: "c", better: "down", unit: "count", points: dates.length ? dayRange(dates[0], dates.at(-1)).map((date) => ({ date, c: days.get(date)?.late || 0 })) : [], target: null, source: "", partial: true }
      // The on-time target is a floor for the on-time share, so a ceiling of 1 − target for the late share.
      : { tool: "delay-analyzer", key: "delay-analyzer:late", kind: "p", better: "down", unit: "share", points: dates.map((date) => ({ date, d: days.get(date).late, n: days.get(date).routes })), target: goal && goal.value < 1 ? 1 - goal.value : null, onTime: goal?.value ?? null, source: goal?.source || "" };
    const minutes = { tool: "delay-analyzer", key: "delay-analyzer:minutes", kind: "imr", better: "down", unit: "minutes", points: dates.filter((date) => days.get(date).late > 0).map((date) => ({ date, value: days.get(date).minutes / days.get(date).late, late: days.get(date).late })), target: null, source: "" };
    return [late, minutes];
  };

  // OEE, per machine and day, the way the OEE tool counts it (OeeMath.entry and combine: several entries of a day add
  // up by time). A machine without an ideal rate has no OEE. Target: the profile's OEE, else 85 %.
  const oeeSeries = (saved, period, targets = {}, reasons = [], Oee = window.OeeMath) => {
    if (!Oee) return [];
    const machines = list(saved?.equipment).filter(isObj);
    const cycleOf = (name) => { const machine = machines.find((m) => fold(m.name) === fold(name)); return machine ? Oee.idealCycle(machine) : null; };
    const byMachine = new Map();
    list(saved?.rows).filter(isObj).filter((row) => inPeriod(row.date, period) && positive(row.planned) > 0 && str(row.equipment)).forEach((row) => {
      const cycle = cycleOf(row.equipment);
      if (!(cycle > 0)) return;
      const name = machines.find((m) => fold(m.name) === fold(row.equipment))?.name || str(row.equipment);
      if (!byMachine.has(name)) byMachine.set(name, new Map());
      const days = byMachine.get(name);
      if (!days.has(row.date)) days.set(row.date, []);
      days.get(row.date).push(Oee.entry({ ...row, stops: list(row.stops).filter(isObj) }, cycle, reasons));
    });
    const profile = Number(targets.oee);
    const goal = Number.isFinite(profile) && profile > 0 ? { value: profile > 1 ? profile / 100 : profile, source: "workplace" } : { value: OEE_WORLD_CLASS, source: "oee" };
    return [...byMachine].map(([name, days]) => ({
      tool: "oee", key: `oee:${fold(name)}`, subject: name, kind: "imr", better: "up", unit: "pct", target: goal.value, source: goal.source,
      points: [...days].sort(([a], [b]) => a.localeCompare(b)).map(([date, entries]) => ({ date, value: Oee.combine(entries).oee })).filter((p) => Number.isFinite(p.value)),
    }));
  };

  // 5S Audit: the overall share of each audit as the audit tool scores it (per S the mean of the answered questions,
  // 0–4, over 4; then the mean of the S with an answer), one series per area. Target: the profile's 5S score.
  const isScore = (value) => Number.isInteger(value) && value >= 0 && value <= 4;
  const fiveSOverall = (row, scopes = FIVE_S) => {
    const keys = Array.isArray(scopes[row.scope]) ? scopes[row.scope] : scopes["5S"];
    const shares = keys.map((key) => list(row.scores?.[key]).filter(isScore)).filter((values) => values.length).map((values) => sum(values) / values.length / 4);
    return shares.length ? sum(shares) / shares.length : null;
  };
  const fiveSSeries = (saved, period, targets = {}, scopes = FIVE_S) => {
    const byArea = new Map();
    list(saved?.rows).filter(isObj).map((row, i) => ({ row, i })).filter(({ row }) => inPeriod(row.date, period) && str(row.area))
      .sort((a, b) => a.row.date.localeCompare(b.row.date) || a.i - b.i).forEach(({ row }) => {
        const value = fiveSOverall(row, scopes);
        if (value === null) return;
        const area = str(row.area);
        if (!byArea.has(area)) byArea.set(area, []);
        byArea.get(area).push({ date: row.date, value });
      });
    const goal = shareTarget("", targets.fives);
    return [...byArea].map(([area, points]) => ({ tool: "five-s-audit", key: `five-s-audit:${fold(area)}`, subject: area, area, kind: "imr", better: "up", unit: "pct", points, target: goal?.value ?? null, source: goal?.source || "" }));
  };

  // Hotel KPIs, one row per night (a night typed twice keeps its latest figures): occupancy (rooms sold over rooms
  // available) and ADR (room revenue over rooms sold) as measured values; the no-show rate (no-shows over the
  // arrivals expected: arrivals plus no-shows) as a p-chart; complaints per room sold as a u-chart. The budget of the
  // hotel (occupancy, ADR) is the target.
  const hotelSeries = (saved, period) => {
    const byDate = new Map();
    list(saved?.rows).filter(isObj).forEach((row) => { if (isIso(row.date)) byDate.set(row.date, row); });
    const nights = [...byDate.values()].filter((row) => inPeriod(row.date, period) && positive(row.available) > 0).sort((a, b) => a.date.localeCompare(b.date))
      .map((row) => ({ date: row.date, available: positive(row.available), sold: Math.max(0, Math.round(Number(row.sold) || 0)), roomRev: positive(row.roomRev), arrivals: Math.round(positive(row.arrivals)), noShows: Math.round(positive(row.noShows)), complaints: Math.round(positive(row.complaints)) }));
    const occTyped = typed(saved?.budgetOcc);
    const occ = occTyped > 0 ? (occTyped > 1 ? occTyped / 100 : occTyped) : null;
    const adr = typed(saved?.budgetAdr) > 0 ? typed(saved.budgetAdr) : null;
    const base = { tool: "hotel-kpis", source: "tool" };
    return [
      { ...base, key: "hotel-kpis:occupancy", kind: "imr", better: "up", unit: "pct", points: nights.map((n) => ({ date: n.date, value: n.sold / n.available, d: n.sold, n: n.available })), target: occ },
      { ...base, key: "hotel-kpis:adr", kind: "imr", better: "up", unit: "euro", points: nights.filter((n) => n.sold > 0).map((n) => ({ date: n.date, value: n.roomRev / n.sold })), target: adr },
      { ...base, key: "hotel-kpis:no-shows", kind: "p", better: "down", unit: "share", points: nights.filter((n) => n.arrivals + n.noShows > 0).map((n) => ({ date: n.date, d: n.noShows, n: n.arrivals + n.noShows })), target: null },
      { ...base, key: "hotel-kpis:complaints", kind: "u", better: "down", unit: "perRoom", points: nights.filter((n) => n.sold > 0).map((n) => ({ date: n.date, c: n.complaints, n: n.sold })), target: null },
    ];
  };

  // The latest value of a series and whether it is worse than its target.
  const latestValue = (series) => {
    const p = series.points.at(-1);
    if (!p) return null;
    return series.kind === "p" ? (p.n > 0 ? p.d / p.n : null) : series.kind === "u" ? (p.n > 0 ? p.c / p.n : null) : series.kind === "c" ? p.c : p.value;
  };
  const missesTarget = (value, target, better) => Number.isFinite(value) && Number.isFinite(target) && (better === "down" ? value > target + 1e-12 : value < target - 1e-12);

  // A series, read: too few points for a chart (listed, with the reason), a statistical signal on its latest point, and
  // a target signal. A target missed on the day of a bad statistical signal is said in that signal, not twice.
  const analyse = (series, events, Stats = window.StatsKit) => {
    const out = { signals: [], tooFew: null };
    const points = series.points;
    if (!points.length) return out;
    const last = points.at(-1);
    const value = latestValue(series);
    const miss = series.target !== null && series.target !== undefined && missesTarget(value, series.target, series.better);
    let stat = null;
    if (points.length < MIN_POINTS) out.tooFew = { tool: series.tool, key: series.key, subject: series.subject || "", n: points.length, kind: series.kind };
    else {
      const phase = phaseOf(points, events, series.tool);
      const chart = chartOf(series.kind, phase.used, Stats);
      const rules = rulesAt(chart, series.better, Stats);
      // A chart without spread (every day the same, or no defect at all) has no limits to be beyond.
      if (chart && !(chart.sigma > 0)) out.tooFew = { tool: series.tool, key: series.key, subject: series.subject || "", n: points.length, kind: series.kind, flat: true };
      else if (chart) out.chart = { tool: series.tool, key: series.key, subject: series.subject || "", kind: series.kind, n: chart.points.length, all: points.length, change: phase.change, since: phase.since, enough: phase.enough, skipped: series.skipped || 0, volumeDays: series.volumeDays, partial: Boolean(series.partial) };
      if (rules.length) {
        const lp = chart.points.at(-1);
        stat = {
          id: `stat|${series.key}`, kind: "stat", severity: statSeverity(rules), tool: series.tool, date: last.date, series: series.key, subject: series.subject || "", area: series.area || "",
          rules, chart, phase: { change: phase.change, since: phase.since, enough: phase.enough, all: points.length },
          score: Math.max(...rules.map((r) => (r.rule === "beyond" ? 10 + Math.abs(lp.z) : r.points / 10))),
          vars: { value, center: chart.center, ucl: lp.ucl, lcl: lp.lcl, d: last.d, n: last.n, c: last.c, kind: series.kind, unit: series.unit, points: chart.points.length, from: chart.points[0].date, to: lp.date, target: miss ? series.target : null, source: series.source || "" },
        };
        out.signals.push(stat);
      }
    }
    if (miss && !(stat && stat.rules.some((r) => r.bad))) {
      out.signals.push({
        id: `target|${series.key}`, kind: "target", severity: "medium", tool: series.tool, date: last.date, series: series.key, subject: series.subject || "", area: series.area || "",
        score: series.target ? Math.abs(value - series.target) / series.target : 0,
        vars: { value, target: series.target, onTime: series.onTime ?? null, d: last.d, n: last.n, unit: series.unit, kind: series.kind, source: series.source || "" },
      });
    }
    return out;
  };

  // Open items --------------------------------------------------------------------------------------------------------
  // Safety Cross: every accident (with or without lost time) and every first aid of the last 7 days, today included.
  const safetySignals = (saved, today) => {
    const from = addDays(today, -(SAFETY_DAYS - 1));
    return list(saved?.rows).filter(isObj).filter((row) => INJURIES.includes(row.type) && isIso(row.date) && row.date >= from && row.date <= today)
      .map((row, i) => ({
        id: `safety|${row.date}|${row.type}|${fold(row.area)}|${fold(row.what).slice(0, 40)}`, kind: "safety", severity: "high", tool: "safety-cross", date: row.date, area: str(row.area),
        // A lost-time accident first, then an accident without lost time, then first aid; then the newest.
        score: 3 - INJURIES.indexOf(row.type) + (Number(row.severity) || 1) / 10, order: i,
        vars: { type: row.type, what: str(row.what), area: str(row.area), shift: str(row.shift), cause: str(row.cause), severity: Math.min(4, Math.max(1, Number.parseInt(row.severity, 10) || 1)), action: str(row.action), owner: str(row.owner), done: row.done === true },
      }));
  };

  // The Action Tracker (sc-actions): an open or doing action with a due date before today.
  const ACTION_STATUSES = ["open", "doing", "done", "verified"];
  const actionSignals = (saved, today) => (Array.isArray(saved?.rows) ? saved.rows : Array.isArray(saved) ? saved : []).filter(isObj)
    .map((row) => ({ id: str(row.id), title: str(row.title), owner: str(row.owner), due: isIso(str(row.due)) ? str(row.due) : "", status: ACTION_STATUSES.includes(row.status) ? row.status : "open", priority: ["High", "Medium", "Low"].includes(row.priority) ? row.priority : "Medium", area: str(row.area), source: str(row.source) }))
    .filter((row) => row.title && (row.status === "open" || row.status === "doing") && row.due && row.due < today)
    .map((row) => {
      const days = daysBetween(row.due, today);
      return {
        id: `overdue|action|${row.id || fold(row.title)}`, kind: "overdue", severity: row.priority === "High" || days > ACTION_LATE_DAYS ? "high" : "medium", tool: "action-tracker", date: row.due, area: row.area,
        score: days, code: "action", vars: { title: row.title, owner: row.owner, due: row.due, days, status: row.status, priority: row.priority, source: row.source },
      };
    });

  // Maintenance Planner: each task's next due date as the planner works it out (MaintenancePlannerMath.nextDue: the
  // interval after the last time it was done, the meter hours, a postponement), overdue when it lies before today. An A
  // asset or a statutory check is high, B medium, C low.
  const maintenanceSignals = (saved, today, Planner = window.MaintenancePlannerMath) => {
    if (!Planner) return [];
    const rows = list(saved?.rows).filter((row) => isObj(row) && isIso(row.date) && str(row.asset));
    const out = [];
    list(saved?.assets).filter(isObj).forEach((asset) => {
      const events = rows.filter((row) => row.asset === asset.id);
      const points = Planner.meterPoints(events);
      list(asset.tasks).filter((task) => isObj(task) && str(task.text)).forEach((task) => {
        const info = Planner.nextDue(task, events, points);
        if (Planner.statusOf(info.due, today) !== "overdue") return;
        const days = daysBetween(info.due, today);
        const crit = ["A", "B", "C"].includes(asset.crit) ? asset.crit : "B";
        out.push({
          id: `overdue|maintenance|${asset.id}|${task.id}`, kind: "overdue", severity: crit === "A" || task.statutory === true ? "high" : crit === "B" ? "medium" : "low", tool: "maintenance-planner",
          date: info.due, area: str(asset.area), score: days + (crit === "A" ? 1000 : 0), code: "maintenance",
          vars: { task: str(task.text), asset: [str(asset.tag), str(asset.name)].filter(Boolean).join(" · "), crit, statutory: task.statutory === true, due: info.due, days, area: str(asset.area), postponed: Boolean(info.postponed) },
        });
      });
    });
    return out;
  };

  // Lost & Found: an open item (stored or contacted) past its keep-until date: the date found plus the days its value is
  // kept (documents and cards their own few days), as typed in the register, else the register's defaults.
  const lostFoundSignals = (saved, today, rules = {}) => {
    const categories = list(rules.categories);
    const defaults = rules.retention || {};
    const pick = (value, fallback) => { const n = Number.parseInt(String(value ?? "").trim(), 10); return n > 0 && n < 3700 ? n : fallback; };
    const keep = { low: pick(saved?.retLow, defaults.low), medium: pick(saved?.retMedium, defaults.medium), high: pick(saved?.retHigh, defaults.high), docs: pick(saved?.retDocs, defaults.docs) };
    return list(saved?.rows).filter((row) => isObj(row) && isIso(row.date)).flatMap((row) => {
      const status = list(row.steps).filter(isObj).at(-1)?.status || "stored";
      if (status !== "stored" && status !== "contacted") return [];
      const category = categories.find((c) => c.key === row.category) || categories.find((c) => c.key === "other") || {};
      const value = ["low", "medium", "high"].includes(row.value) ? row.value : category.value || "low";
      const days = category.days ? keep.docs : keep[value] ?? keep.low;
      if (!(days > 0)) return [];
      const until = addDays(row.date, days);
      if (!(today > until)) return [];
      const late = daysBetween(until, today);
      return [{ id: `overdue|lost|${str(row.id) || `${row.date}|${fold(row.what)}`}`, kind: "overdue", severity: "medium", tool: "lost-found", date: until, area: str(row.area), score: late, code: "lostFound",
        vars: { item: str(row.id), what: str(row.what), category: str(row.category), found: row.date, until, days: late, status, guest: Boolean(str(row.guest)) } }];
    });
  };

  // 5S Audit red tags: open and older than 30 days, or past the date it was to be decided.
  const redTagSignals = (saved, today) => list(saved?.tags).filter((tag) => isObj(tag) && isIso(tag.date) && str(tag.item) && tag.done !== true).flatMap((tag) => {
    const age = daysBetween(tag.date, today);
    const late = isIso(tag.due) && tag.due < today ? daysBetween(tag.due, today) : 0;
    if (age <= OLD_TAG_DAYS && !late) return [];
    return [{ id: `overdue|tag|${str(tag.id) || `${tag.date}|${fold(tag.item)}`}`, kind: "overdue", severity: "medium", tool: "five-s-audit", date: tag.date, area: str(tag.area), score: age, code: "redTag",
      vars: { item: str(tag.item), area: str(tag.area), owner: str(tag.owner), due: isIso(tag.due) ? tag.due : "", age, late, decision: str(tag.decision) } }];
  });

  // Kaizen Board: an idea still in the Idea column longer than the week the board allows for an answer (its days in the
  // column count from the day it moved there, else from the day it was suggested).
  const kaizenSignals = (saved, today) => list(saved?.rows).filter((row) => isObj(row) && str(row.title)).flatMap((row) => {
    const status = ["idea", "plan", "do", "check", "act", "dropped"].includes(row.status) ? row.status : "idea";
    const since = isIso(row.moved) ? row.moved : isIso(row.date) ? row.date : "";
    if (status !== "idea" || !since) return [];
    const days = daysBetween(since, today);
    if (days <= IDEA_ANSWER_DAYS) return [];
    return [{ id: `overdue|idea|${str(row.id) || fold(row.title)}`, kind: "overdue", severity: "medium", tool: "kaizen-board", date: since, area: str(row.area), score: days, code: "kaizen",
      vars: { title: str(row.title), by: str(row.by), area: str(row.area), date: since, days, limit: IDEA_ANSWER_DAYS } }];
  });

  // Room Inspection: a room whose latest inspection, in the last 7 days, sent items back to the attendant (a failed
  // item not flagged for maintenance, as the inspection counts its re-cleans) and that has not been inspected since.
  // One from an earlier day is medium; one from today is low (the re-check may still come).
  const recleanSignals = (saved, today) => {
    const latest = new Map();
    list(saved?.rows).filter((row) => isObj(row) && isIso(row.date) && str(row.room)).forEach((row) => {
      const key = fold(row.room);
      const stamp = `${row.date} ${str(row.time)}`;
      if (!latest.has(key) || stamp >= latest.get(key).stamp) latest.set(key, { row, stamp });
    });
    const from = addDays(today, -(RECLEAN_DAYS - 1));
    return [...latest.values()].map(({ row }) => row).filter((row) => row.date >= from && row.date <= today).flatMap((row) => {
      const flags = isObj(row.flags) ? row.flags : {};
      const items = Object.entries(isObj(row.answers) ? row.answers : {}).filter(([qid, answer]) => answer === "fail" && flags[qid] !== "maintenance").length;
      if (!items) return [];
      return [{ id: `overdue|reclean|${fold(row.room)}|${row.date}`, kind: "overdue", severity: row.date < today ? "medium" : "low", tool: "room-inspection", date: row.date, area: str(row.floor), score: daysBetween(row.date, today), code: "reclean",
        vars: { room: str(row.room), date: row.date, time: str(row.time), items, attendant: str(row.attendant), days: daysBetween(row.date, today) } }];
    });
  };

  // Gemba Walk: a layer whose next walk (the last walk plus its cadence: a day, a week, a month) lies before today; and
  // the LPA compliance of each layer in its latest week (yes against yes + no) below the 90 % the walk aims for.
  const addMonths = (iso, months) => {
    const [y, m, d] = iso.split("-").map(Number);
    const first = new Date(Date.UTC(y, m - 1 + months, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(d, last));
    return first.toISOString().slice(0, 10);
  };
  const nextWalk = (last, cadence) => (!isIso(last) ? "" : cadence === "monthly" ? addMonths(last, 1) : addDays(last, cadence === "weekly" ? 7 : 1));
  const gembaSignals = (saved, today, layers = [], period = null) => {
    const rows = list(saved?.rows).filter((row) => isObj(row) && isIso(row.date) && str(row.area));
    if (!rows.length) return [];
    const out = [];
    layers.forEach((layer) => {
      const cadence = ["daily", "weekly", "monthly"].includes(saved?.cadence?.[layer.key]) ? saved.cadence[layer.key] : layer.cadence || "weekly";
      const last = latestDate(rows.filter((row) => row.layer === layer.key && row.date <= today).map((row) => row.date));
      const due = nextWalk(last, cadence);
      if (due && due < today) {
        const days = daysBetween(due, today);
        out.push({ id: `overdue|layer|${layer.key}`, kind: "overdue", severity: "medium", tool: "gemba-walk", date: due, area: "", score: days, code: "gemba", vars: { layer: layer.key, cadence, last, due, days } });
      }
      const lpa = rows.filter((row) => row.type === "lpa" && row.layer === layer.key && (!period || inPeriod(row.date, period)) && row.date <= today);
      const week = lpa.map((row) => mondayOf(row.date)).sort().at(-1);
      if (!week) return;
      let yes = 0, no = 0;
      lpa.filter((row) => mondayOf(row.date) === week).forEach((row) => list(row.answers).forEach((a) => { if (a === "yes") yes++; else if (a === "no") no++; }));
      const share = yes + no ? yes / (yes + no) : null;
      if (share !== null && share < LPA_TARGET - 1e-12) {
        out.push({ id: `target|gemba-walk:${layer.key}`, kind: "target", severity: "medium", tool: "gemba-walk", date: week, area: "", series: `gemba-walk:${layer.key}`, subject: layer.key, score: (LPA_TARGET - share) / LPA_TARGET,
          vars: { value: share, target: LPA_TARGET, d: yes, n: yes + no, unit: "pct", kind: "week", source: "gemba", layer: layer.key, week } });
      }
    });
    return out;
  };

  // Every tool at once ------------------------------------------------------------------------------------------------
  // get(key) returns what a key holds (the browser, or the example in memory). options: { today, period (days, 0 for
  // all), suffix ("", "-de", "-sq"), sources: { oeeReasons, lostFound, gembaLayers, fiveSScopes } }.
  // Returns { signals (ranked), read: [{ tool, entries, latest }], tooFew: [...], targets }.
  const latestOf = (tool, saved) => {
    if (!isObj(saved) && !Array.isArray(saved)) return { entries: 0, latest: "" };
    const rows = Array.isArray(saved) ? saved : list(saved.rows);
    const objects = rows.filter(isObj);
    switch (tool) {
      case "damage-control": case "incomplete-control": case "night-audit": {
        const volumes = list(saved.volumes).filter(isObj);
        return { entries: objects.length, volumes: volumes.length, latest: latestDate([...objects.map((r) => r.date), ...volumes.map((v) => v.date)]) };
      }
      case "five-s-audit": {
        const tags = list(saved.tags).filter(isObj);
        return { entries: objects.length, tags: tags.length, latest: latestDate([...objects.map((r) => r.date), ...tags.map((t) => t.date)]) };
      }
      case "maintenance-planner": return { entries: objects.length, assets: list(saved.assets).filter(isObj).length, latest: latestDate(objects.map((r) => r.date)) };
      case "lost-found": return { entries: objects.length, latest: latestDate(objects.flatMap((r) => [r.date, ...list(r.steps).filter(isObj).map((s) => s.date)])) };
      case "kaizen-board": return { entries: objects.length, latest: latestDate(objects.flatMap((r) => [r.date, r.moved, r.adopted])) };
      case "action-tracker": return { entries: objects.length, latest: latestDate(objects.flatMap((r) => [r.created, r.closed])) };
      default: return { entries: objects.length, latest: latestDate(objects.map((r) => r.date)) };
    }
  };
  const KEYS = (suffix) => Object.fromEntries(TOOLS.map((tool) => [tool, tool === "action-tracker" ? "sc-actions" : `sc-${tool}${suffix}`]));
  const SEV = { high: 0, medium: 1, low: 2 };
  const KIND = { safety: 0, stat: 1, target: 2, overdue: 3 };
  // Safety first, always; then high before medium before low; then statistical, target, overdue; then the stronger
  // signal (further beyond the limit, a longer run, more days late, a larger gap); then the newest; then by id, so the
  // order never changes between two readings of the same data.
  const compare = (a, b) => (a.kind === "safety" ? 0 : 1) - (b.kind === "safety" ? 0 : 1) || SEV[a.severity] - SEV[b.severity] || KIND[a.kind] - KIND[b.kind]
    || (b.score || 0) - (a.score || 0) || String(b.date).localeCompare(String(a.date)) || String(a.id).localeCompare(String(b.id));
  const rank = (signals) => [...signals].sort(compare);

  const collect = (get, options = {}) => {
    const today = options.today;
    const suffix = options.suffix || "";
    const sources = options.sources || {};
    const Stats = options.Stats || window.StatsKit;
    const period = { from: Number(options.period) > 0 ? addDays(today, -(Number(options.period) - 1)) : "0000-01-01", to: today };
    const keys = KEYS(suffix);
    const state = Object.fromEntries(TOOLS.map((tool) => [tool, get(keys[tool])]));
    const workplace = get("sc-workplace");
    const targets = {};
    if (isObj(workplace?.targets)) Object.entries(workplace.targets).forEach(([key, value]) => { const n = typed(value); if (Number.isFinite(n)) targets[key] = n; });
    const events = annotations(get("sc-annotations"));
    const series = [
      ...Object.keys(DEFECT_LOGS).map((tool) => defectSeries(tool, state[tool], period, targets)),
      ...delaySeries(state["delay-analyzer"], period, targets, Boolean(options.partialRoutes ?? window.ToolKit?.partialRouteLog?.(state["delay-analyzer"]))),
      ...oeeSeries(state.oee, period, targets, list(sources.oeeReasons), options.Oee || window.OeeMath),
      ...fiveSSeries(state["five-s-audit"], period, targets, isObj(sources.fiveSScopes) ? sources.fiveSScopes : FIVE_S),
      ...hotelSeries(state["hotel-kpis"], period),
    ];
    const signals = [];
    const tooFew = [];
    const charts = [];
    series.forEach((s) => {
      const result = analyse(s, events, Stats);
      signals.push(...result.signals);
      if (result.tooFew) tooFew.push(result.tooFew);
      if (result.chart) charts.push(result.chart);
    });
    signals.push(
      ...safetySignals(state["safety-cross"], today),
      ...actionSignals(state["action-tracker"], today),
      ...maintenanceSignals(state["maintenance-planner"], today, options.Planner || window.MaintenancePlannerMath),
      ...lostFoundSignals(state["lost-found"], today, sources.lostFound),
      ...redTagSignals(state["five-s-audit"], today),
      ...kaizenSignals(state["kaizen-board"], today),
      ...recleanSignals(state["room-inspection"], today),
      ...gembaSignals(state["gemba-walk"], today, list(sources.gembaLayers), period),
    );
    const read = TOOLS.map((tool) => ({ tool, ...latestOf(tool, state[tool]) })).map((item) => ({ ...item, has: item.entries > 0 || (item.volumes || 0) > 0 || (item.tags || 0) > 0 || (item.assets || 0) > 0 }));
    return { signals: rank(signals), read, tooFew, charts, events: events.length, workplace: Object.keys(targets).length > 0, period };
  };

  // The visitor's view: the signals at or above the minimum severity, of the chosen tool, without the ones dismissed
  // today. A dismissal holds for the day it was made: tomorrow the signal is back if it is still true.
  const visible = (signals, { minSeverity = "low", tool = "", dismissed = {}, today = "" } = {}) => signals.filter((s) => SEV[s.severity] <= (SEV[minSeverity] ?? 2)
    && (!tool || s.tool === tool) && dismissed[s.id] !== today);
  const pruneDismissed = (dismissed, today) => Object.fromEntries(Object.entries(isObj(dismissed) ? dismissed : {}).filter(([id, date]) => id && date === today));
  const counts = (signals) => Object.fromEntries(SEVERITIES.map((s) => [s, signals.filter((x) => x.severity === s).length]));

  // The example ------------------------------------------------------------------------------------------------------
  // A parcel hub's tool states, made from the data file's example (days are "days ago", so it always ends yesterday) and
  // held in memory only: get(key) of the page reads them while the example is shown. Every number comes from the data
  // file: damage and incomplete orders per day with the volume of the day, the routes and the minutes of the late ones,
  // the good pieces of each machine (planned 450 minutes at 600 pieces an hour, so OEE is good pieces / 4,500), the 5S
  // totals (20 questions of 0–4: the overall score is the total / 80), the safety events, actions, tasks, ideas, walks.
  const exampleStates = (ex, today, suffix = "") => {
    if (!isObj(ex)) return {};
    const ago = (n) => addDays(today, -Number(n));
    const keys = KEYS(suffix);
    const out = {};
    const days = (n) => Array.from({ length: n }, (_, i) => ago(n - i));
    // One defect log: per day its units, split over the causes in turn (one row per cause), and its volume.
    const defectLog = (spec) => {
      const dates = days(spec.units.length);
      const rows = [];
      dates.forEach((date, i) => {
        let left = spec.units[i];
        let k = 0;
        while (left > 0) {
          const part = k === spec.split.length - 1 ? left : Math.min(left, spec.split[k]);
          const cause = spec.causes[(i + k) % spec.causes.length];
          rows.push({ date, shift: spec.shifts[(i + k) % spec.shifts.length], stage: cause.stage, type: cause.type, cause: cause.cause, units: part, cost: null, note: "" });
          left -= part;
          k++;
        }
      });
      return { period: "", volume: "", target: spec.target, from: "", to: "", volumes: dates.map((date, i) => ({ date, volume: spec.volumes[i] })), rows, example: {}, totalsFor: {}, grain: "", compare: false };
    };
    if (ex.damage) out[keys["damage-control"]] = defectLog(ex.damage);
    if (ex.incomplete) out[keys["incomplete-control"]] = defectLog(ex.incomplete);
    if (ex.delay) {
      const d = ex.delay;
      const dates = days(d.late.length);
      const time = (minutes) => `${String(Math.floor(((minutes % 1440) + 1440) % 1440 / 60)).padStart(2, "0")}:${String((((minutes % 1440) + 1440) % 1440) % 60).padStart(2, "0")}`;
      const rows = [];
      dates.forEach((date, i) => {
        const late = d.late[i];
        for (let r = 0; r < d.routes; r++) {
          const plan = d.firstDeparture + r * d.every;
          const arrive = plan + d.drive;
          // The late routes are the first ones of the day; the others arrive within the grace, early or a little late.
          const delay = r < late.length ? late[r] : d.onTime[(i + r) % d.onTime.length];
          rows.push({ date, shift: d.shifts[r % d.shifts.length], route: `${d.prefix}${String(r + 1).padStart(2, "0")}`, planDep: time(plan), actDep: time(plan + Math.min(delay, d.dockShare[r % d.dockShare.length])), planArr: time(arrive), actArr: time(arrive + delay), reason: r < late.length ? d.reasons[(i + r) % d.reasons.length] : "", note: "" });
        }
      });
      out[keys["delay-analyzer"]] = { period: "", routes: "", departureGrace: "10", arrivalGrace: String(d.grace), target: d.target, from: "", to: "", rows, example: {}, totalsFor: {}, grain: "", compare: false };
    }
    if (ex.safety) out[keys["safety-cross"]] = { hours: "", nearMissTarget: "", freeDaysTarget: "", month: "", view: "cross", rows: ex.safety.map((row) => ({ date: ago(row.ago), shift: row.shift, type: row.type, area: row.area, what: row.what, cause: row.cause, severity: row.severity, action: row.action || "", owner: row.owner || "", done: row.done === true })), talks: [], example: {}, totalsFor: {}, from: "", to: "" };
    if (ex.oee) {
      const o = ex.oee;
      const rows = [];
      o.machines.forEach((machine) => {
        const dates = days(machine.good.length);
        dates.forEach((date, i) => {
          const rejects = o.rejects[i % o.rejects.length];
          const stop = o.stops[(i + machine.offset) % o.stops.length];
          rows.push({ date, shift: o.shift, equipment: machine.name, planned: o.planned, stops: [{ reason: stop.reason, minutes: stop.minutes }], pieces: machine.good[i] + rejects, rejects, startup: 0, note: "" });
        });
      });
      out[keys.oee] = { equipment: o.machines.map((m) => ({ name: m.name, rate: o.rate, planned: o.planned })), rows, machine: "", from: "", to: "", example: {}, totalsFor: {}, demoEquipment: [] };
    }
    if (ex.fiveS) {
      const f = ex.fiveS;
      // An audit total of 20 answers spread evenly over the five S (four questions each): total / 80 is its score.
      const scoresOf = (total) => {
        const answers = Array.from({ length: 20 }, (_, i) => Math.floor(total / 20) + (i < total % 20 ? 1 : 0));
        return Object.fromEntries(FIVE_S["5S"].map((key, s) => [key, answers.filter((_, i) => i % 5 === s)]));
      };
      const rows = f.audits.flatMap((audit, a) => audit.totals.map((total, i) => ({ id: `ex-a${a}-${i}`, date: ago(audit.ago[i]), area: audit.area, auditor: f.auditors[(a + i) % f.auditors.length], shift: "", scope: "5S", template: "", scores: scoresOf(total), notes: {} })))
        .sort((a, b) => a.date.localeCompare(b.date));
      const tags = f.tags.map((tag, i) => ({ id: `ex-t${i}`, date: ago(tag.ago), area: tag.area, item: tag.item, reason: tag.reason, decision: tag.decision, owner: tag.owner, due: tag.dueAgo === undefined ? "" : ago(tag.dueAgo), done: tag.done === true }));
      out[keys["five-s-audit"]] = { scope: "5S", template: "", rows, tags, draft: {}, view: "", example: {}, custom: {}, plan: [], planExample: false };
    }
    if (ex.maintenance) {
      const m = ex.maintenance;
      // A task is last done one interval before its next due date: due `dueAgo` days ago (negative: still to come).
      const back = (iso, every, unit) => (unit === "months" ? addMonths(iso, -every) : unit === "years" ? addMonths(iso, -12 * every) : addDays(iso, -(unit === "weeks" ? 7 : 1) * every));
      const assets = m.assets.map((asset, a) => ({ id: `ex-a${a}`, tag: asset.tag, name: asset.name, type: asset.type, area: asset.area, crit: asset.crit, supplier: "", contact: "",
        tasks: asset.tasks.map((task, t) => ({ id: `ex-a${a}-t${t}`, text: task.text, every: task.every, unit: task.unit, hours: 0, who: task.who || "internal", minutes: task.minutes || 30, statutory: task.statutory === true, checklist: [], last: back(ago(task.dueAgo), task.every, task.unit), lastHours: null, start: "" })) }));
      out[keys["maintenance-planner"]] = { site: m.site, assets, rows: [], sent: {}, show: "all", example: {} };
    }
    if (ex.kaizen) out[keys["kaizen-board"]] = { rows: ex.kaizen.map((row, i) => ({ id: `ex-k${i}`, title: row.title, waste: row.waste, area: row.area, by: row.by, date: ago(row.ago), effort: row.effort, impact: row.impact, saving: row.saving ?? "", status: row.status, owner: row.owner || "", due: "", next: row.next || "", result: "", reason: "", moved: ago(row.movedAgo ?? row.ago), adopted: row.status === "act" ? ago(row.movedAgo ?? row.ago) : "" })), example: {} };
    if (ex.actions) out[keys["action-tracker"]] = { rows: ex.actions.map((row, i) => ({ id: `ex-act${i}`, title: row.title, detail: row.detail || "", owner: row.owner, due: ago(row.dueAgo), source: row.source || "", check: row.check || "", area: row.area || "", priority: row.priority, status: row.status, created: ago(row.createdAgo), closed: row.status === "done" || row.status === "verified" ? ago(row.closedAgo ?? 0) : "", result: "" })) };
    if (ex.gemba) {
      const g = ex.gemba;
      const rows = g.walks.map((walk, i) => ({ id: `ex-w${i}`, type: "lpa", layer: walk.layer, template: "", date: ago(walk.ago), area: walk.area, walker: walk.walker, shift: "", minutes: 20, answers: [...walk.answers].map((ch) => ({ y: "yes", n: "no", "-": "na" }[ch] || null)), findings: {}, acts: {}, sent: {}, tallies: {}, notes: {} }))
        .sort((a, b) => a.date.localeCompare(b.date));
      out[keys["gemba-walk"]] = { template: "", cadence: {}, rows, draft: {}, example: {}, custom: {} };
    }
    out["sc-annotations"] = { rows: list(ex.events).map((event, i) => ({ id: `ex-e${i}`, date: ago(event.ago), text: event.text, tools: event.tools || [] })) };
    out["sc-workplace"] = { site: ex.site || "", shifts: [], areas: [], teams: [], targets: {} };
    return out;
  };

  window.SignalsMath = {
    MIN_POINTS, RUN, TREND, SAFETY_DAYS, RECLEAN_DAYS, OLD_TAG_DAYS, IDEA_ANSWER_DAYS, LPA_TARGET, OEE_WORLD_CLASS, ACTION_LATE_DAYS, SEVERITIES, KINDS, TOOLS, KEYS,
    addDays, daysBetween, mondayOf, typed, minutesLate, chartOf, runLength, rulesAt, statSeverity, annotations, phaseOf,
    defectSeries, delaySeries, oeeSeries, fiveSOverall, fiveSSeries, hotelSeries, latestValue, missesTarget, analyse,
    safetySignals, actionSignals, maintenanceSignals, lostFoundSignals, redTagSignals, kaizenSignals, recleanSignals, gembaSignals,
    latestOf, compare, rank, collect, visible, pruneDismissed, counts, exampleStates,
  };

  // The page -----------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-signals]");
  const dataEl = document.getElementById("signals-data");
  const results = document.querySelector("[data-results]");
  if (!root || !dataEl || !results || !window.ToolKit || !window.StatsKit) return;
  const kit = window.ToolKit;
  const { LANG, tx, el, int, num, pct, euro, showDate, today, addDays: kitAddDays, read, readOwn, write, loadState, isObject, stat, panel, focusCard, copy, undoNote, shareText, dayMonth, firstVisit, resultLayout } = kit;
  const CK = window.ChartKit;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const sources = (() => { try { return JSON.parse(document.getElementById("signals-sources")?.textContent || "{}"); } catch { return {}; } })();
  const links = isObject(sources.links) ? sources.links : {};
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const KEY = cfg.storageKey;
  const PERIODS = ["30", "60", "90", "180"];
  const MIN = ["low", "medium", "high"];
  const M = window.SignalsMath;

  const form = root;
  const periodSelect = form.querySelector("[name=period]");
  const severitySelect = form.querySelector("[name=severity]");
  const toolSelect = form.querySelector("[name=tool]");
  const status = form.querySelector("[data-status]");
  const empty = form.querySelector("[data-empty]");
  const exampleButton = form.querySelector("[data-example]");
  const restoreButton = form.querySelector("[data-restore]");
  const whysLink = document.querySelector("a[data-five-whys]");

  // The visitor's choices; nothing else is kept here.
  const state = loadState(KEY, { period: "90", minSeverity: "low", dismissed: {}, example: false });
  if (!PERIODS.includes(state.period)) state.period = "90";
  if (!MIN.includes(state.minSeverity)) state.minSeverity = "low";
  state.dismissed = M.pruneDismissed(state.dismissed, today());
  const save = () => write(KEY, { period: state.period, minSeverity: state.minSeverity, dismissed: M.pruneDismissed(state.dismissed, today()), example: state.example });
  // The example's dismissals stay on the page: they are not the visitor's.
  let exampleDismissed = {};
  let toolFilter = "";

  // The tools' own data only: an example a tool holds is not a signal (ToolKit readOwn).
  const realGet = (key) => readOwn(key, null);
  const realRead = () => M.collect(realGet, { today: today(), period: Number(state.period), suffix: SUFFIX, sources });
  // A first visit opens on the example, but only when no tool holds anything yet: the visitor's own data comes first.
  if (firstVisit(KEY) && !realRead().read.some((item) => item.has)) state.example = true;
  let example = null;
  const exampleGet = (key) => {
    if (!example || example.day !== today()) example = { day: today(), states: M.exampleStates(cfg.example, today(), SUFFIX) };
    return example.states[key] ?? null;
  };

  // Words ---------------------------------------------------------------------------------------------------------------
  const fill = (text, vars = {}) => String(text ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const toolName = (slug) => cfg.tools.find((t) => t.slug === slug)?.name || slug;
  const toolUrl = (slug) => links[slug] || new URL(`../${slug}/`, window.location.href).href;
  const date = (iso) => (iso ? showDate(iso) : "–");
  const dayName = dayMonth(false);
  const short = (iso) => dayName(new Date(`${iso}T00:00:00Z`));
  const days = (n) => `${int.format(n)} ${n === 1 ? cfg.text.dayOne : cfg.text.dayMany}`;
  const layerName = (key) => list(sources.gembaLayers).find((l) => l.key === key)?.name || key;
  const format = (unit, value) => {
    if (!Number.isFinite(value)) return "–";
    if (unit === "share") return shareText(value);
    if (unit === "pct") return pct(value, 1);
    if (unit === "minutes") return `${num(value, 1)} min`;
    if (unit === "euro") return euro.format(value);
    if (unit === "perRoom") return tx("{n} per 100 rooms sold", { n: num(value * 100, 2) });
    return Number.isInteger(value) ? int.format(value) : num(value, 1);
  };
  const seriesName = (s) => {
    const key = s.series || "";
    if (cfg.series[key]) return cfg.series[key];
    const base = key.split(":")[0];
    return fill(cfg.series[base] || key, { name: base === "gemba-walk" ? layerName(s.subject) : s.subject });
  };
  const KIND_LABEL = { safety: () => tx("Safety"), stat: () => tx("Statistical"), target: () => tx("Target"), overdue: () => tx("Overdue") };
  const SEV_LABEL = { high: () => tx("High"), medium: () => tx("Medium"), low: () => tx("Low") };
  const SEV_SIGN = { high: "▲", medium: "◆", low: "○" };
  const CHART_NAME = { p: () => tx("p-chart"), c: () => tx("c-chart"), u: () => tx("u-chart"), imr: () => tx("individuals chart (I-MR)") };
  const SOURCE = { tool: () => tx("typed in the tool"), workplace: () => tx("from the workplace profile"), oee: () => tx("the OEE tool's world class"), gemba: () => tx("the Gemba Walk's target") };
  const STATUS = { open: () => tx("not started"), doing: () => tx("in progress") };
  const cadenceName = (key) => list(sources.gembaCadences).find((c) => c.key === key)?.name || key;
  const join = (parts) => parts.filter(Boolean).join(" · ");
  const counted = (v) => (Number.isFinite(v.d) && Number.isFinite(v.n) && v.n > 0 ? ` (${tx("{a} of {b}", { a: int.format(v.d), b: int.format(v.n) })})` : "");

  // One signal in words: the sentence, the numbers behind it, the rule in plain words and any note.
  const describe = (s) => {
    const v = s.vars;
    const out = { text: "", numbers: "", rule: "", notes: [] };
    if (s.kind === "safety") {
      const type = cfg.text.safetyType[v.type] || v.type;
      out.text = fill(v.area ? cfg.text.safety : cfg.text.safetyNoArea, { type, date: date(s.date), area: v.area, what: v.what || type });
      out.numbers = join([v.shift && tx("Shift: {shift}", { shift: v.shift }), tx("severity {n} of 4", { n: v.severity }), v.cause && tx("Cause: {cause}", { cause: v.cause }), v.action && tx("Action: {action}", { action: v.owner ? `${v.action} (${v.owner})` : v.action }), v.done ? tx("action done") : ""]);
      out.rule = cfg.rules.safety;
    } else if (s.kind === "stat") {
      const name = seriesName(s);
      const words = s.rules.map((r) => fill(cfg.text.rules[`${r.rule}${r.dir === "up" ? "Up" : "Down"}`], { n: int.format(r.points) }));
      out.text = fill(cfg.text.stat, { series: name, rules: words.join(", "), date: date(s.date) });
      const variable = v.kind === "p" || v.kind === "u";
      out.numbers = join([
        tx("Latest {value} on {date}", { value: `${format(v.unit, v.value)}${counted(v)}`, date: date(s.date) }),
        tx("centre line {value}", { value: format(v.unit, v.center) }),
        tx(variable ? "limits that day {lcl} to {ucl}" : "limits {lcl} to {ucl}", { lcl: format(v.unit, v.lcl), ucl: format(v.unit, v.ucl) }),
        tx("{chart} of {n} points, {from} to {to}", { chart: CHART_NAME[v.kind](), n: int.format(v.points), from: date(v.from), to: date(v.to) }),
      ]);
      out.rule = s.rules.map((r) => cfg.rules[r.rule]).filter((text, i, all) => all.indexOf(text) === i).join(" ");
      if (s.phase.change) out.notes.push(s.phase.enough
        ? tx("Limits from the {n} points since the change on {date}: {text}.", { n: int.format(s.phase.since), date: date(s.phase.change.date), text: s.phase.change.text })
        : tx("Changed on {date} ({text}): only {n} points since, so the limits use all {all} points until there are 8.", { date: date(s.phase.change.date), text: s.phase.change.text, n: int.format(s.phase.since), all: int.format(s.phase.all) }));
      if (Number.isFinite(v.target)) out.notes.push(tx("Also worse than the target of {target} ({source}).", { target: format(v.unit, v.target), source: SOURCE[v.source]?.() || "" }));
      if (!s.rules.some((r) => r.bad)) out.notes.push(cfg.text.goodSide);
    } else if (s.kind === "target") {
      const name = seriesName(s);
      const shown = v.onTime !== null && v.onTime !== undefined ? { value: format("pct", 1 - v.value), target: format("pct", v.onTime), name: cfg.series["delay-analyzer:on-time"] } : { value: format(v.unit, v.value), target: format(v.unit, v.target), name };
      out.text = fill(cfg.text.target, { series: shown.name, value: shown.value, target: shown.target, date: date(s.date) });
      out.numbers = join([
        v.kind === "week" ? tx("Week from {date}", { date: date(s.date) }) + counted(v) : tx("Latest {value} on {date}", { value: `${shown.value}${counted(v)}`, date: date(s.date) }),
        tx("target {target}, {source}", { target: shown.target, source: SOURCE[v.source]?.() || "" }),
      ]);
      out.rule = cfg.rules.target;
    } else {
      const c = s.code;
      out.rule = cfg.rules[c];
      if (c === "action") {
        out.text = fill(cfg.text.action, { title: v.title, days: days(v.days) });
        out.numbers = join([tx("Due {date}", { date: date(v.due) }), v.owner, STATUS[v.status]?.(), tx("priority {p}", { p: tx(v.priority) }), v.source && tx("from {tool}", { tool: toolName(v.source) })]);
      } else if (c === "maintenance") {
        out.text = fill(cfg.text.maintenance, { task: v.task, asset: v.asset, days: days(v.days) });
        out.numbers = join([tx("Due {date}", { date: date(v.due) }), tx("criticality {crit}", { crit: v.crit }), v.statutory ? tx("statutory check") : "", v.postponed ? tx("postponed") : "", v.area]);
      } else if (c === "lostFound") {
        out.text = fill(cfg.text.lostFound, { what: v.what || v.item, item: v.item, days: days(v.days) });
        out.numbers = join([tx("Found {date}", { date: date(v.found) }), tx("keep until {date}", { date: date(v.until) }), v.status === "contacted" ? tx("guest contacted") : ""]);
      } else if (c === "redTag") {
        out.text = fill(cfg.text.redTag, { item: v.item, days: days(v.age) });
        out.numbers = join([tx("Tagged {date}", { date: date(s.date) }), v.area, v.owner, v.decision, v.due ? tx("decide by {date}", { date: date(v.due) }) : ""]);
      } else if (c === "kaizen") {
        out.text = fill(cfg.text.kaizen, { title: v.title, days: days(v.days) });
        out.numbers = join([tx("Suggested {date}", { date: date(v.date) }), v.by, v.area]);
      } else if (c === "reclean") {
        out.text = fill(cfg.text.reclean, { room: v.room });
        out.numbers = join([tx("Inspected {date}", { date: `${date(v.date)}${v.time ? ` ${v.time}` : ""}` }), tx("{n} items back to the attendant", { n: int.format(v.items) }), v.attendant]);
      } else if (c === "gemba") {
        out.text = fill(cfg.text.gemba, { layer: layerName(v.layer), days: days(v.days) });
        out.numbers = join([tx("Last walk {date}", { date: date(v.last) }), cadenceName(v.cadence), tx("Due {date}", { date: date(v.due) })]);
      }
    }
    return out;
  };

  // The hand-offs of a signal: 5 Whys with the problem, the Action Tracker with an action (a High signal is due
  // tomorrow, a Medium one in three days, a Low one in a week).
  const DUE_IN = { high: 1, medium: 3, low: 7 };
  const PRIORITY = { high: "High", medium: "Medium", low: "Low" };
  const problemOf = (s, words) => `${words.text} (${toolName(s.tool)}, ${date(s.date)})`;
  const whysUrl = (problem) => {
    const url = new URL(whysLink?.href || new URL("../five-whys/", window.location.href));
    url.searchParams.set("problem", problem);
    return url.href;
  };
  const actionOf = (s, words) => ({
    title: words.text.slice(0, 300),
    detail: join([toolName(s.tool), date(s.date), words.numbers, words.rule]).slice(0, 2000),
    owner: s.vars.owner || "",
    due: kitAddDays(today(), DUE_IN[s.severity]),
    source: "signals",
    check: cfg.text.check,
    area: s.area || "",
    priority: PRIORITY[s.severity],
  });

  // The chart of a statistical signal: the points, the centre line and the limits (a p- or u-chart's limits follow the
  // volume of each day, so they are drawn as lines of their own), the points of the signal in its colour.
  const LIMIT_TIP = "⁣";
  const chartOfSignal = (s) => {
    const c = s.chart;
    const unit = s.vars.unit;
    const fmt = (value) => format(unit, value);
    const last = c.points.length - 1;
    const marked = new Set();
    s.rules.forEach((r) => { for (let i = last - r.points + 1; i <= last; i++) marked.add(i); });
    const bad = s.rules.some((r) => r.bad);
    const name = seriesName(s);
    const points = c.points.map((p, i) => ({ x: short(p.date), y: p.y, state: marked.has(i) ? (bad ? "danger" : "ok") : undefined, tip: `${short(p.date)}: ${fmt(p.y)}${counted(p)}` }));
    const variable = c.kind === "p" || c.kind === "u";
    const series = [{ label: name, points, color: CK.C.blue }];
    const options = { title: `${name} · ${CHART_NAME[c.kind]()}`, center: c.center, format: fmt, centerLabel: "CL" };
    // The scale follows the points and the lines, so a run of 8 just below the centre is visible; a share or a count
    // starts at 0.
    const values = [...c.points.flatMap((p) => [p.y, p.ucl, p.lcl]), c.center].filter(Number.isFinite);
    const lo = Math.min(...values), hi = Math.max(...values);
    const pad = (hi - lo) * 0.1 || Math.abs(hi) * 0.1 || 1;
    options.yMin = unit === "share" || unit === "perRoom" || unit === "count" ? 0 : lo - pad;
    options.yMax = hi + pad;
    if (variable) {
      series.push({ label: "UCL", color: CK.C.danger, points: c.points.map((p) => ({ x: short(p.date), y: p.ucl, tip: LIMIT_TIP })) });
      if (c.points.some((p) => p.lcl > 0)) series.push({ label: "LCL", color: CK.C.danger, points: c.points.map((p) => ({ x: short(p.date), y: p.lcl, tip: LIMIT_TIP })) });
    } else {
      options.ucl = c.points[last].ucl;
      if (c.kind === "imr" || c.points[last].lcl > 0) options.lcl = c.points[last].lcl;
    }
    const svg = CK.line(series, options);
    // The limits are lines, not measurements: their points have no dot of their own.
    svg.querySelectorAll(`circle[data-tip="${LIMIT_TIP}"]`).forEach((dot) => dot.remove());
    return CK.figure(svg, { fileName: `signals-${s.series.replace(/[^a-z0-9-]+/gi, "-")}`, caption: describe(s).rule });
  };
  // Without a statistical signal, the open signals per tool.
  const chartOfTools = (shown) => {
    const byTool = new Map();
    shown.forEach((s) => byTool.set(s.tool, (byTool.get(s.tool) || 0) + 1));
    const items = [...byTool].sort((a, b) => b[1] - a[1]).map(([tool, n]) => ({ label: toolName(tool), value: n, tip: `${toolName(tool)}: ${int.format(n)}` }));
    return CK.figure(CK.bars(items, { title: tx("Signals per tool"), unit: tx("signals") }), { fileName: "signals-per-tool" });
  };

  // Results ----------------------------------------------------------------------------------------------------------
  const readNow = () => (state.example ? M.collect(exampleGet, { today: today(), period: Number(state.period), suffix: SUFFIX, sources, partialRoutes: false }) : realRead());
  const dismissedNow = () => (state.example ? exampleDismissed : state.dismissed);

  const fillTools = (signals) => {
    const tools = M.TOOLS.filter((tool) => signals.some((s) => s.tool === tool));
    if (toolFilter && !tools.includes(toolFilter)) toolFilter = "";
    const options = [["", tx("All tools")], ...tools.map((tool) => [tool, toolName(tool)])];
    toolSelect.replaceChildren(...options.map(([value, label]) => { const option = el("option", null, label); option.value = value; option.selected = value === toolFilter; return option; }));
  };

  const item = (s, index) => {
    const words = describe(s);
    const li = el("li", `sg-item is-${s.severity}`);
    li.dataset.signal = s.id;
    const head = el("p", "sg-item-head");
    const sev = el("span", `sg-sev is-${s.severity}`);
    sev.append(el("span", "sg-sign", SEV_SIGN[s.severity]), ` ${SEV_LABEL[s.severity]()}`);
    sev.querySelector(".sg-sign").setAttribute("aria-hidden", "true");
    const tool = el("a", "inline-link", toolName(s.tool));
    tool.href = toolUrl(s.tool);
    head.append(el("span", "sg-rank", `${index + 1}`), sev, el("span", "sg-kind", KIND_LABEL[s.kind]()), tool, el("span", "sg-date", date(s.date)));
    li.append(head, el("p", "sg-text", words.text));
    if (words.numbers) li.append(el("p", "sg-numbers", words.numbers));
    words.notes.forEach((note) => li.append(el("p", "sg-note", note)));
    if (words.rule) li.append(el("p", "sg-rule", words.rule));
    const actions = el("div", "sg-actions");
    const open = el("a", "button-secondary", tx("Open the tool"));
    open.href = toolUrl(s.tool);
    const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
    whys.href = whysUrl(problemOf(s, words));
    actions.append(open, whys);
    // An overdue action is already in the Action Tracker; everything else can become one.
    if (s.tool !== "action-tracker" && Actions) actions.append(Actions.linkButton(tx("Add to actions"), () => actionOf(s, words)));
    const dismiss = el("button", "button-ghost", tx("Dismiss for today"));
    dismiss.type = "button";
    dismiss.dataset.dismiss = s.id;
    dismiss.setAttribute("aria-label", `${tx("Dismiss for today")}: ${words.text}`);
    actions.append(dismiss);
    li.append(actions);
    return li;
  };

  const summaryText = (r, shown) => {
    const n = M.counts(shown);
    const lines = [`${tx("Signals")} · ${date(today())}${state.example ? ` · ${tx("Example")}` : ""}`, `${tx("High")} ${n.high} · ${tx("Medium")} ${n.medium} · ${tx("Low")} ${n.low}`];
    if (shown.length) lines.push(`${tx("First")}: ${describe(shown[0]).text} → ${cfg.moves[shown[0].kind]}`);
    lines.push("");
    shown.forEach((s, i) => {
      const words = describe(s);
      lines.push(`${i + 1}. ${SEV_LABEL[s.severity]()} · ${KIND_LABEL[s.kind]()} · ${toolName(s.tool)} · ${date(s.date)}`, `   ${words.text}`);
      if (words.numbers) lines.push(`   ${words.numbers}`);
      words.notes.forEach((note) => lines.push(`   ${note}`));
    });
    if (!shown.length) lines.push(tx("Nothing needs attention in what this browser holds."));
    lines.push("", `${tx("What was read")}:`);
    r.read.filter((x) => x.has).forEach((x) => lines.push(`- ${toolName(x.tool)}: ${x.latest ? tx("latest entry {date}", { date: date(x.latest) }) : tx("no dated entry")}`));
    if (r.tooFew.length) {
      lines.push("", `${tx("Too little data for a control chart")}:`);
      r.tooFew.forEach((x) => lines.push(`- ${tooFewText(x)}`));
    }
    return lines.join("\n");
  };
  const tooFewText = (x) => {
    const name = seriesName({ series: x.key, subject: x.subject });
    return x.flat ? tx("{series}: every point the same, so no limits to be beyond", { series: `${toolName(x.tool)} · ${name}` })
      : tx("{series}: {n} points, a control chart needs at least 8", { series: `${toolName(x.tool)} · ${name}`, n: int.format(x.n) });
  };

  const readPanel = (r) => {
    const box = panel(tx("What was read"), tx("Every tool that holds data in this browser, with the date of its latest entry."));
    const ul = el("ul", "sg-read");
    r.read.filter((x) => x.has).forEach((x) => {
      const li = el("li");
      const link = el("a", "inline-link", toolName(x.tool));
      link.href = toolUrl(x.tool);
      const parts = [x.latest ? tx("latest entry {date}", { date: date(x.latest) }) : tx("no dated entry"), x.entries ? tx("{n} entries", { n: int.format(x.entries) }) : "", x.volumes ? tx("{n} daily volumes", { n: int.format(x.volumes) }) : "", x.tags ? tx("{n} red tags", { n: int.format(x.tags) }) : "", x.assets ? tx("{n} assets", { n: int.format(x.assets) }) : ""];
      li.append(link, ` · ${join(parts)}`);
      ul.append(li);
    });
    box.append(ul);
    const none = r.read.filter((x) => !x.has).map((x) => toolName(x.tool));
    if (none.length) box.append(el("p", "form-note", `${tx("Nothing in this browser yet")}: ${none.join(", ")}.`));
    box.append(el("p", "form-note", join([r.events === 1 ? tx("Timeline: 1 event") : tx("Timeline: {n} events", { n: int.format(r.events) }), r.workplace ? tx("targets from the workplace profile") : tx("no targets in the workplace profile")])));
    if (r.charts.length) {
      box.append(el("p", "result-label sg-sub", tx("Control charts read")));
      const charts = el("ul", "sg-read");
      r.charts.forEach((c) => {
        const notes = [tx("{chart} of {n} points", { chart: CHART_NAME[c.kind](), n: int.format(c.n) })];
        if (c.change) notes.push(c.enough ? tx("since the change on {date}", { date: date(c.change.date) }) : tx("change on {date}, only {n} points since: limits from all points", { date: date(c.change.date), n: int.format(c.since) }));
        if (c.skipped) notes.push(tx("{n} days without a volume left out", { n: int.format(c.skipped) }));
        if (c.kind === "c" && c.volumeDays) notes.push(tx("a volume on only {n} days, so counted per day", { n: int.format(c.volumeDays) }));
        if (c.partial) notes.push(tx("only some routes logged, so late routes are counted"));
        charts.append(el("li", null, `${toolName(c.tool)} · ${seriesName({ series: c.key, subject: c.subject })}: ${join(notes)}`));
      });
      box.append(charts);
    }
    return box;
  };
  const fewPanel = (r) => {
    const box = panel(tx("Too little data for a control chart"), cfg.rules.minPoints);
    const ul = el("ul", "sg-read");
    r.tooFew.forEach((x) => ul.append(el("li", null, tooFewText(x))));
    box.append(ul);
    return box;
  };
  const rulesPanel = () => {
    const box = panel(tx("How the signals are found"), cfg.rules.charts);
    const dl = el("dl", "sg-rules");
    SEVERITIES_ORDER.forEach((sev) => { dl.append(el("dt", `sg-sev is-${sev}`, `${SEV_SIGN[sev]} ${SEV_LABEL[sev]()}`), el("dd", null, cfg.severity[sev])); });
    box.append(dl);
    const rules = el("ul", "sg-read");
    ["beyond", "run", "trend", "change", "target", "action", "maintenance", "lostFound", "redTag", "kaizen", "reclean", "gemba", "safety"].forEach((key) => rules.append(el("li", null, cfg.rules[key])));
    box.append(rules);
    return box;
  };
  const SEVERITIES_ORDER = ["high", "medium", "low"];

  const exampleNote = () => {
    const note = el("div", "dl-example-note");
    note.setAttribute("role", "status");
    const button = el("button", "button-ghost", tx("Clear the example"));
    button.type = "button";
    button.dataset.clearExample = "";
    note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("These signals come from an example parcel hub held on this page only; nothing is written to your tools. Clear it to read your own data.")), " ", button);
    return note;
  };

  const render = () => {
    const r = readNow();
    const now = today();
    const dismissed = dismissedNow();
    const anyData = r.read.some((x) => x.has);
    periodSelect.value = state.period;
    severitySelect.value = state.minSeverity;
    fillTools(r.signals);
    const shown = M.visible(r.signals, { minSeverity: state.minSeverity, tool: toolFilter, dismissed, today: now });
    const away = M.visible(r.signals, { minSeverity: state.minSeverity, tool: toolFilter, today: now }).length - shown.length;
    restoreButton.hidden = !away;
    restoreButton.textContent = tx("Show the {n} dismissed again", { n: int.format(away) });
    exampleButton.hidden = state.example;
    empty.hidden = anyData || state.example;
    results.hidden = !anyData && !state.example;
    results.replaceChildren();
    if (results.hidden) return;
    if (state.example) results.append(exampleNote());

    const head = el("div", "result-head");
    head.append(el("p", "result-label", tx("Signals")), el("h2", null, tx("What needs attention on {date}", { date: dayMonth(true)(new Date(`${now}T00:00:00Z`)) })));
    const n = M.counts(shown);
    const toolsRead = r.read.filter((x) => x.has).length;
    head.append(el("p", "sg-meta", join([shown.length === 1 ? tx("1 signal") : tx("{n} signals", { n: int.format(shown.length) }), tx("{n} tools read", { n: int.format(toolsRead) }), tx("control charts over the last {n} days", { n: state.period }), away ? tx("{n} dismissed for today", { n: int.format(away) }) : ""])));

    const stats = el("div", "dl-stats sg-stats");
    stats.append(
      stat(`${SEV_SIGN.high} ${tx("High")}`, int.format(n.high), tx("act today")),
      stat(`${SEV_SIGN.medium} ${tx("Medium")}`, int.format(n.medium), tx("this week")),
      stat(`${SEV_SIGN.low} ${tx("Low")}`, int.format(n.low), tx("keep an eye on it")),
      stat(tx("Tools read"), int.format(toolsRead), r.tooFew.length === 1 ? tx("1 series too short for a chart") : r.tooFew.length ? tx("{n} series too short for a chart", { n: int.format(r.tooFew.length) }) : tx("every series long enough")),
    );

    let focus = null;
    if (shown.length) {
      const top = shown[0];
      const words = describe(top);
      focus = focusCard({ title: words.text, detail: `${toolName(top.tool)}, ${date(top.date)}`, lede: cfg.moves[top.kind] });
      focus.classList.add("sg-focus");
    } else {
      focus = el("article", "result-card dl-focus sg-focus");
      focus.append(el("p", "result-label", tx("Start here")), el("h3", null, tx("Nothing needs attention in what this browser holds.")), el("p", null, cfg.text.quiet));
    }

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(r, shown), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    actions.append(copyButton, printButton);

    const topStat = shown.find((s) => s.kind === "stat");
    const chartBox = el("div", "sg-chart");
    if (topStat) {
      chartBox.append(el("p", "result-label", tx("Control chart of the first statistical signal")));
      chartBox.append(chartOfSignal(topStat));
    } else if (shown.length) chartBox.append(chartOfTools(shown));

    const listBox = el("section", "sg-list-box");
    listBox.setAttribute("aria-label", tx("Signals"));
    if (shown.length) {
      const ol = el("ol", "sg-list");
      shown.forEach((s, i) => ol.append(item(s, i)));
      listBox.append(ol);
    } else listBox.append(el("p", "dl-empty", r.signals.length ? tx("No signal at this severity for this tool. Choose all signals or all tools.") : cfg.text.quiet));

    const panels = [readPanel(r)];
    if (r.tooFew.length) panels.push(fewPanel(r));
    panels.push(rulesPanel());
    resultLayout(results, { head, stats, focus, actions, panels });
    // The chart and the list come after the first thing to do and before the details.
    const details = results.querySelector(".dl-details");
    const body = [chartBox.childNodes.length ? chartBox : null, listBox].filter(Boolean);
    if (details) details.before(...body);
    else results.append(...body);
  };

  // Controls ---------------------------------------------------------------------------------------------------------
  periodSelect.addEventListener("change", () => { state.period = PERIODS.includes(periodSelect.value) ? periodSelect.value : "90"; save(); render(); });
  severitySelect.addEventListener("change", () => { state.minSeverity = MIN.includes(severitySelect.value) ? severitySelect.value : "low"; save(); render(); });
  toolSelect.addEventListener("change", () => { toolFilter = toolSelect.value; render(); });
  exampleButton.addEventListener("click", () => {
    state.example = true;
    exampleDismissed = {};
    save();
    render();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  restoreButton.addEventListener("click", () => {
    if (state.example) exampleDismissed = {};
    else state.dismissed = {};
    save();
    render();
    kit.flash(status, tx("The dismissed signals are back."));
  });
  results.addEventListener("click", (event) => {
    const clear = event.target.closest("[data-clear-example]");
    if (clear) {
      state.example = false;
      exampleDismissed = {};
      toolFilter = "";
      save();
      render();
      (results.hidden ? exampleButton : results).focus?.({ preventScroll: true });
      return;
    }
    const button = event.target.closest("[data-dismiss]");
    if (!button) return;
    const id = button.dataset.dismiss;
    const text = button.closest(".sg-item")?.querySelector(".sg-text")?.textContent || "";
    const next = button.closest(".sg-item")?.nextElementSibling?.dataset.signal || button.closest(".sg-item")?.previousElementSibling?.dataset.signal || "";
    const store = dismissedNow();
    store[id] = today();
    save();
    render();
    const again = [...results.querySelectorAll(".sg-item")].find((li) => li.dataset.signal === next);
    (again?.querySelector("[data-dismiss]") || results).focus({ preventScroll: true });
    undoNote(status, tx("Dismissed for today: {text}", { text }), () => {
      delete dismissedNow()[id];
      save();
      render();
    });
  });
  // Another tab changed a tool, or the visitor comes back to this tab: read again.
  window.addEventListener("storage", (event) => { if (!event.key || event.key.startsWith("sc-")) render(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") render(); });
  render();
})();
