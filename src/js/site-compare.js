// Site Compare (js/site-compare.js): an area or regional manager compares the sites they look after, each of which runs
// Team Sync, from each site's read-only code, without joining any team and without being able to change anything.
// "Update" reads each site's encrypted team copy with TeamSync.readTeamCopy (one GET; it sends no PUT or DELETE, writes
// nothing and leaves this browser's own team alone), decrypts it on this device, works out the figures and keeps only
// those, with the time of the update: the sites' work itself is never stored here.
// The figures are counted the way each tool counts them, with the tools' own arithmetic, whose scripts the page loads
// (they stop before their page code), as Signals and the Operations Report do: OpsReportMath for the defect rates, the
// on-time share, the 5S score, the actions, PM compliance, the first-time pass rate and the Kaizen ideas (its tests hold
// it against the tools' Math objects), and OeeMath, SafetyMath and GuestComplaintsMath themselves.
// The read-only codes are secrets of the sites. They are kept under this tool's key, which Team Sync never offers to a
// team (its PERSONAL pattern), so they stay on this device and in the visitor's own saved work file.
// The arithmetic is in window.SiteCompareMath, so tests can call it without the page.
(() => {
  const DAY = 864e5;
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const list = (value) => (Array.isArray(value) ? value.filter(isObj) : []);
  const fold = (value) => String(value ?? "").trim().toLowerCase();
  const positive = (value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : 0);
  const addDays = (iso, days) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
  const weekday = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;
  const inRange = (date, range) => isIso(date) && date >= range.from && date <= range.to;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);

  const PERIODS = ["last7", "last30", "thisMonth", "lastMonth"];
  // A tool's key in each language: the English page keeps sc-<slug>, the German and Albanian ones add -de and -sq.
  const SUFFIXES = ["", "-de", "-sq"];
  const LANG_OF = { "": "en", "-de": "de", "-sq": "sq" };
  const TOOLS = ["damage-control", "incomplete-control", "delay-analyzer", "oee", "five-s-audit", "safety-cross", "action-tracker",
    "kaizen-board", "maintenance-planner", "room-inspection", "guest-complaints", "hotel-kpis"];
  // Every figure, its tool, how it is shown and which way is good. ranked: a rate or an average, so it can be set
  // against a site of another size; counts are shown and marked, but they grow with a site and do not rank it.
  const KPIS = [
    { key: "damageRate", group: "quality", tool: "damage-control", format: "share", better: "lower", ranked: true },
    { key: "damageUnits", group: "quality", tool: "damage-control", format: "int", better: "lower" },
    { key: "incompleteRate", group: "quality", tool: "incomplete-control", format: "share", better: "lower", ranked: true },
    { key: "incompleteUnits", group: "quality", tool: "incomplete-control", format: "int", better: "lower" },
    { key: "onTime", group: "delivery", tool: "delay-analyzer", format: "pct", better: "higher", ranked: true },
    { key: "lateRoutes", group: "delivery", tool: "delay-analyzer", format: "int", better: "lower" },
    { key: "oee", group: "equipment", tool: "oee", format: "pct", better: "higher", ranked: true },
    { key: "pm", group: "equipment", tool: "maintenance-planner", format: "pct", better: "higher", ranked: true },
    { key: "pmOverdue", group: "equipment", tool: "maintenance-planner", format: "int", better: "lower" },
    { key: "fiveS", group: "workplace", tool: "five-s-audit", format: "pct", better: "higher", ranked: true },
    { key: "accidents", group: "safety", tool: "safety-cross", format: "int", better: "lower" },
    { key: "firstAid", group: "safety", tool: "safety-cross", format: "int", better: "lower" },
    // More near misses reported can be a better safety culture as much as a worse floor: shown, never marked.
    { key: "nearMisses", group: "safety", tool: "safety-cross", format: "int", better: "none" },
    { key: "daysSince", group: "safety", tool: "safety-cross", format: "days", better: "higher" },
    { key: "openActions", group: "actions", tool: "action-tracker", format: "int", better: "lower" },
    { key: "overdueActions", group: "actions", tool: "action-tracker", format: "int", better: "lower" },
    { key: "kaizenDone", group: "actions", tool: "kaizen-board", format: "int", better: "higher" },
    { key: "firstPass", group: "hotel", tool: "room-inspection", format: "pct", better: "higher", ranked: true },
    { key: "complaintsPer100", group: "hotel", tool: "guest-complaints", format: "per100", better: "lower", ranked: true },
    { key: "complaints", group: "hotel", tool: "guest-complaints", format: "int", better: "lower" },
  ];
  const KPI = Object.fromEntries(KPIS.map((kpi) => [kpi.key, kpi]));
  // What a figure may carry besides its value, and why a value can be missing.
  const DETAILS = ["units", "volume", "late", "routes", "entries", "machines", "audits", "onTime", "scheduled", "first", "firstPass", "complaints", "nights"];
  const WHY = ["empty", "volume", "partial", "unrated", "noAccident", "noneDue", "nights"];
  // Two values are the same when they look the same: share to a hundredth of a per cent, a per cent to a tenth,
  // complaints per 100 to two decimals, counts and days whole.
  const PRECISION = { share: 1e-4, pct: 1e-3, per100: 1e-2, int: 1, days: 1 };

  // The periods, on the day of the update: the last 7 and 30 days up to it, the month so far, and the month before
  // (the months as the Operations Report counts them).
  const rangeOf = (key, today, Ops = window.OpsReportMath) => {
    if (key === "last7") return { from: addDays(today, -6), to: today };
    if (key === "thisMonth" || key === "lastMonth") {
      const p = Ops.period(key, today);
      return { from: p.from, to: p.to };
    }
    return { from: addDays(today, -29), to: today };
  };

  // The language of a tool to read: the site's team may share sc-damage-control and sc-damage-control-de at once (two
  // pages of the tool in use). The one with the latest entry is the one the site works in; then the one with more
  // entries; then English, German, Albanian. A key that holds nothing (a page opened once) is no use.
  const parse = (text) => { try { return JSON.parse(text); } catch { return undefined; } };
  const rowsOf = (state) => (Array.isArray(state) ? state.filter(isObj) : list(state?.rows));
  const entriesOf = (state) => rowsOf(state).length + list(state?.volumes).length + list(state?.assets).length;
  const DATE_FIELDS = ["date", "created", "closed", "adopted", "moved", "resolvedDate"];
  const latestIn = (state) => {
    let latest = "";
    rowsOf(state).forEach((row) => DATE_FIELDS.forEach((field) => { if (isIso(row[field]) && row[field] > latest) latest = row[field]; }));
    list(state?.volumes).forEach((item) => { if (isIso(item.date) && item.date > latest) latest = item.date; });
    return latest;
  };
  const keysOf = (tool) => (tool === "action-tracker" ? [["sc-actions", ""]] : SUFFIXES.map((suffix) => [`sc-${tool}${suffix}`, suffix]));
  const candidates = (items, tool) => keysOf(tool).map(([key, suffix], order) => {
    const state = typeof items?.[key] === "string" ? parse(items[key]) : undefined;
    const ok = isObj(state) || (tool === "action-tracker" && Array.isArray(state));
    return ok ? { key, suffix, state, order, latest: latestIn(state), entries: entriesOf(state) } : null;
  }).filter((c) => c && c.entries > 0);
  const pickVariant = (items, tool) => candidates(items, tool)
    .sort((a, b) => b.latest.localeCompare(a.latest) || b.entries - a.entries || a.order - b.order)[0] || null;

  // The figures of one period ------------------------------------------------------------------------------------------
  // Damage Control and Incomplete Control: units over the volume of the period, as OpsReportMath.defects counts them
  // (a rate only when every day with an entry has its volume). Nothing logged in a period with volumes is a rate of 0
  // of them, the same formula with no units; without volumes there is no rate.
  const volumeIn = (state, range) => {
    const byDate = new Map();
    list(state?.volumes).forEach((item) => { const v = Math.round(Number(item.volume)); if (isIso(item.date) && v > 0) byDate.set(item.date, v); });
    return [...byDate].filter(([date]) => inRange(date, range)).reduce((total, [, v]) => total + v, 0);
  };
  const defectFigures = (state, range, Ops, prefix) => {
    const d = Ops.defects(state, range);
    if (d) {
      return {
        [`${prefix}Rate`]: d.rate === null ? { value: null, units: d.total, why: "volume" } : { value: d.rate, units: d.total, volume: d.volume },
        [`${prefix}Units`]: { value: d.total },
      };
    }
    const volume = volumeIn(state, range);
    return { [`${prefix}Rate`]: volume > 0 ? { value: 0, units: 0, volume } : { value: null, units: 0, why: "empty" }, [`${prefix}Units`]: { value: 0 } };
  };
  // Delay Analyzer: the share of routes that arrived within the arrival grace (OpsReportMath.delivery); a log that
  // holds only some routes of its days (ToolKit.partialRouteLog) has late routes, but no share.
  const deliveryFigures = (state, range, Ops, partialOf) => {
    const d = Ops.delivery(state, range, { partial: Boolean(partialOf?.(state)) });
    if (!d) return { onTime: { value: null, why: "empty" }, lateRoutes: { value: null, why: "empty" } };
    return {
      onTime: d.partial ? { value: null, late: d.late, routes: d.routes, why: "partial" } : { value: d.onTime, late: d.late, routes: d.routes },
      lateRoutes: { value: d.late },
    };
  };
  // OEE, the OEE tool's own way (OeeMath.entry and combine): every shift of a machine with an ideal rate, added up by
  // time, so OEE = valuable time / planned production time over all machines. The stop reasons are those of the
  // tool's language, so a planned stop leaves the planned time as it does there.
  const oeeFigures = (state, range, Oee, reasons = []) => {
    const machines = list(state?.equipment);
    const cycleOf = (name) => { const machine = machines.find((m) => fold(m.name) === fold(name)); return machine ? Oee.idealCycle(machine) : null; };
    const rows = rowsOf(state).filter((row) => inRange(row.date, range) && positive(row.planned) > 0 && String(row.equipment ?? "").trim());
    const entries = [];
    const names = new Set();
    rows.forEach((row) => {
      const cycle = cycleOf(row.equipment);
      if (!(cycle > 0)) return;
      entries.push(Oee.entry({ ...row, stops: list(row.stops) }, cycle, reasons));
      names.add(fold(row.equipment));
    });
    if (!entries.length) return { oee: { value: null, why: rows.length ? "unrated" : "empty" } };
    const total = Oee.combine(entries);
    return { oee: finite(total.oee) ? { value: total.oee, entries: entries.length, machines: names.size } : { value: null, why: "empty" } };
  };
  // 5S Audit: the mean score of the audits of the period (OpsReportMath.workplace, per S the mean of the answered
  // questions over 4, then the mean of the S, as FiveSMath.score).
  const fiveSFigures = (state, range, Ops) => {
    const w = Ops.workplace(state, null, range);
    return { fiveS: w && w.fiveS !== null ? { value: w.fiveS, audits: w.audits } : { value: null, why: "empty" } };
  };
  // Safety Cross (SafetyMath): accidents are recorded injuries with or without lost time; first aid on its own; near
  // misses with the unsafe conditions and acts, as the Operations Report counts them. A day without an entry is a
  // safe day on the cross, so a period without entries is 0 of each. Days since the last accident to the end of the
  // period, over the whole log (SafetyMath.daysSince); none when the log has no accident.
  const NEAR = ["near-miss", "unsafe-condition", "unsafe-act"];
  const safetyFigures = (state, range, Safety) => {
    const rows = rowsOf(state).filter((row) => isIso(row.date));
    const counts = Safety.counts(rows.filter((row) => inRange(row.date, range)));
    const since = Safety.daysSince(rows, range.to);
    return {
      accidents: { value: Safety.ACCIDENTS.reduce((total, type) => total + (counts[type] || 0), 0) },
      firstAid: { value: counts["first-aid"] || 0 },
      nearMisses: { value: NEAR.reduce((total, type) => total + (counts[type] || 0), 0) },
      daysSince: since === null ? { value: null, why: "noAccident" } : { value: since },
    };
  };
  // The Action Tracker: open and overdue as the list stood at the end of the period (OpsReportMath.actions: created by
  // then, not closed by then; overdue when due before it).
  const isClosed = (row) => row.status === "done" || row.status === "verified";
  const openAt = (row, day) => isIso(row.created) && row.created <= day && (!isClosed(row) || (isIso(row.closed) && row.closed > day));
  const actionFigures = (state, range, Ops) => {
    const rows = rowsOf(state).filter((row) => String(row.title ?? "").trim());
    const a = Ops.actions(rows, range);
    return { openActions: { value: rows.filter((row) => openAt(row, range.to)).length }, overdueActions: { value: a ? a.overdue : 0 } };
  };
  // Kaizen Board: the ideas adopted (moved to Act) in the period, by their adoption date (OpsReportMath.improvement).
  const kaizenFigures = (state, range, Ops) => {
    const k = Ops.improvement(state, range);
    return { kaizenDone: { value: k ? k.adopted : 0 } };
  };
  // Maintenance Planner (MaintenancePlannerMath through OpsReportMath.maintenance): PM compliance, the share of the
  // tasks due in the period done within their tolerance; the tasks overdue as the plan stood at the end of the period.
  const maintenanceFigures = (state, range, today, Ops, Planner, cfg) => {
    const m = Ops.maintenance(state, range, today, { M: Planner, cfg: isObj(cfg) ? cfg : {} });
    if (!m) return { pm: { value: null, why: "noneDue" }, pmOverdue: { value: 0 } };
    return { pm: m.pm === null ? { value: null, why: "noneDue" } : { value: m.pm, onTime: m.onTime, scheduled: m.scheduled }, pmOverdue: { value: m.overdue } };
  };
  // Room Inspection (RoomInspectionMath through OpsReportMath.inspection): the rooms that passed at the first
  // inspection, a re-check on the day it failed left out, with the checklists and the pass mark of the tool.
  const inspectionFigures = (state, range, Ops, Inspection, cfg) => {
    const r = Ops.inspection(state, range, { M: Inspection, cfg });
    return { firstPass: r && r.rate !== null ? { value: r.rate, first: r.first, firstPass: r.firstPass } : { value: null, why: "empty" } };
  };
  // Guest Complaints (GuestComplaintsMath): complaints ÷ occupied room nights × 100, the room nights from the site's
  // Hotel KPIs when it has every night of the period, as the tool takes them; otherwise the count only.
  const complaintFigures = (state, hotel, range, Complaints) => {
    const n = rowsOf(state).filter((row) => inRange(row.date, range)).length;
    const nights = hotel ? Complaints.nightsTotal(Complaints.hotelNights(hotel), range.from, range.to) : null;
    const rate = nights && nights.complete && nights.sold > 0 ? Complaints.per100(n, nights.sold) : null;
    return {
      complaintsPer100: rate === null ? { value: null, complaints: n, why: "nights" } : { value: rate, complaints: n, nights: nights.sold },
      complaints: { value: n },
    };
  };

  // ctx: { Ops, Oee, Safety, Planner, Inspection, Complaints, partial (ToolKit.partialRouteLog), reasons ({ en, de,
  // sq }: the OEE stop reasons of each language), inspection (the Room Inspection checklists), maintenance ({ target }) }.
  // A figure is there only when the site has its tool; a tool without its arithmetic on the page is left out.
  const figures = (picked, range, today, ctx) => {
    const out = {};
    const has = (tool) => Boolean(picked[tool]);
    const state = (tool) => picked[tool].state;
    if (ctx.Ops) {
      if (has("damage-control")) Object.assign(out, defectFigures(state("damage-control"), range, ctx.Ops, "damage"));
      if (has("incomplete-control")) Object.assign(out, defectFigures(state("incomplete-control"), range, ctx.Ops, "incomplete"));
      if (has("delay-analyzer")) Object.assign(out, deliveryFigures(state("delay-analyzer"), range, ctx.Ops, ctx.partial));
      if (has("five-s-audit")) Object.assign(out, fiveSFigures(state("five-s-audit"), range, ctx.Ops));
      if (has("action-tracker")) Object.assign(out, actionFigures(state("action-tracker"), range, ctx.Ops));
      if (has("kaizen-board")) Object.assign(out, kaizenFigures(state("kaizen-board"), range, ctx.Ops));
      if (has("maintenance-planner") && ctx.Planner) Object.assign(out, maintenanceFigures(state("maintenance-planner"), range, today, ctx.Ops, ctx.Planner, ctx.maintenance));
      if (has("room-inspection") && ctx.Inspection && isObj(ctx.inspection)) Object.assign(out, inspectionFigures(state("room-inspection"), range, ctx.Ops, ctx.Inspection, ctx.inspection));
    }
    if (has("oee") && ctx.Oee) Object.assign(out, oeeFigures(state("oee"), range, ctx.Oee, list(ctx.reasons?.[LANG_OF[picked.oee.suffix]])));
    if (has("safety-cross") && ctx.Safety) Object.assign(out, safetyFigures(state("safety-cross"), range, ctx.Safety));
    if (has("guest-complaints") && ctx.Complaints) Object.assign(out, complaintFigures(state("guest-complaints"), picked.hotel?.state || null, range, ctx.Complaints));
    return out;
  };

  // The summary of one site from the items of its team copy ({ storage key: text }): the figures of every period on the
  // day of the update, and the language each tool was read in. This is all that is kept of a site.
  const summarize = (items, today, ctx = {}) => {
    const picked = {};
    TOOLS.forEach((tool) => { const variant = pickVariant(items, tool); if (variant) picked[tool] = variant; });
    // Guest Complaints reads the Hotel KPIs of its own language; another language's only when that one is missing.
    if (picked["guest-complaints"]) {
      const same = candidates(items, "hotel-kpis").find((c) => c.suffix === picked["guest-complaints"].suffix);
      picked.hotel = same || picked["hotel-kpis"] || null;
    }
    const periods = Object.fromEntries(PERIODS.map((key) => [key, figures(picked, rangeOf(key, today, ctx.Ops), today, ctx)]));
    const tools = Object.fromEntries(TOOLS.filter((tool) => picked[tool]).map((tool) => [tool, picked[tool].suffix]));
    return { asOf: today, tools, periods };
  };

  // What is read back from storage: numbers, the known reasons and nothing else, so a damaged or hand-made file cannot
  // put anything else on the page.
  const cleanFigure = (figure) => {
    if (!isObj(figure)) return null;
    const out = { value: finite(figure.value) ? figure.value : null };
    DETAILS.forEach((name) => { if (finite(figure[name])) out[name] = figure[name]; });
    if (out.value === null && WHY.includes(figure.why)) out.why = figure.why;
    return out;
  };
  const cleanSummary = (summary) => {
    if (!isObj(summary) || !isIso(summary.asOf) || !isObj(summary.periods)) return null;
    const periods = {};
    PERIODS.forEach((key) => {
      const p = isObj(summary.periods[key]) ? summary.periods[key] : {};
      periods[key] = {};
      KPIS.forEach((kpi) => { const f = cleanFigure(p[kpi.key]); if (f) periods[key][kpi.key] = f; });
    });
    const tools = {};
    if (isObj(summary.tools)) TOOLS.forEach((tool) => { if (SUFFIXES.includes(summary.tools[tool])) tools[tool] = summary.tools[tool]; });
    const out = { asOf: summary.asOf, tools, periods };
    if (typeof summary.sent === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(summary.sent)) out.sent = summary.sent;
    return out;
  };
  const STATUSES = ["ok", "offline", "gone", "unreadable", "refused", "error", "off", "no-crypto", "damaged", "version", "team-code"];
  const stamp = (value) => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value) ? value : "");
  // A saved site: its name, its read-only code (kept only in the shape of one), the last update and its result.
  const cleanSite = (site) => {
    if (!isObj(site)) return null;
    const name = String(site.name ?? "").trim().slice(0, 60);
    const code = String(site.code ?? "").replace(/\s+/g, "");
    if (!name || !/^scr\d+\.[A-Za-z0-9_-]{8,200}$/.test(code)) return null;
    return {
      id: /^[a-z0-9]{4,24}$/.test(site.id) ? site.id : Math.random().toString(36).slice(2, 10),
      name, code, fetched: stamp(site.fetched), tried: stamp(site.tried),
      status: STATUSES.includes(site.status) ? site.status : "",
      summary: cleanSummary(site.summary),
    };
  };
  const cleanSites = (sites) => {
    const seen = new Set();
    return (Array.isArray(sites) ? sites : []).map(cleanSite).filter((site) => site && !seen.has(site.code) && seen.add(site.code)).slice(0, 12);
  };

  // A code typed or scanned into the form. Only a read-only code is taken; a six-word team code is refused with a
  // clear reason (it lets whoever holds it change the team's work). Sync: TeamSyncMath (team-sync.js).
  const checkCode = async (input, Sync = window.TeamSyncMath) => {
    const text = String(input ?? "").trim();
    if (!text) return { ok: false, reason: "empty" };
    if (!Sync) return { ok: false, reason: "off" };
    if (!Sync.looksViewer(text)) {
      // Six words of the list: a team code. Three or more words of the list and nothing else: a team code cut or
      // mistyped. Neither is taken, and the page does not keep them.
      const team = Sync.parseCode(text);
      return { ok: false, reason: team.ok ? "team-code" : team.words.length >= 3 && !team.unknown.length ? "team-code-typo" : "damaged" };
    }
    const parsed = await Sync.parseViewer(text);
    return parsed.ok ? { ok: true, code: parsed.text } : { ok: false, reason: parsed.reason };
  };

  // Comparing ---------------------------------------------------------------------------------------------------------
  const rounded = (value, format) => Math.round(value / (PRECISION[format] || 1e-9));
  // The best and the worst site of one figure: the sites with a value (at least two, not all the same when shown),
  // equal values sharing the mark. entries: [{ id, value }].
  const marks = (entries, kpi) => {
    const def = typeof kpi === "string" ? KPI[kpi] : kpi;
    const out = { best: [], worst: [] };
    if (!def || def.better === "none") return out;
    const known = entries.filter((e) => finite(e.value)).map((e) => ({ id: e.id, r: rounded(e.value, def.format) }));
    if (known.length < 2) return out;
    const values = known.map((e) => e.r);
    const hi = Math.max(...values), lo = Math.min(...values);
    if (hi === lo) return out;
    const best = def.better === "higher" ? hi : lo;
    const worst = def.better === "higher" ? lo : hi;
    out.best = known.filter((e) => e.r === best).map((e) => e.id);
    out.worst = known.filter((e) => e.r === worst).map((e) => e.id);
    return out;
  };
  // What a rate must rest on before it ranks a site: the number behind it (the figure's own detail) and its minimum.
  // Two routes on time out of two say nothing about a depot; a rate of a few units handled, a single audit or a few
  // shifts neither. A figure without its number (none should be: every summary has kept them) does not rank.
  const MIN_N = {
    damageRate: { field: "volume", min: 1000 },
    incompleteRate: { field: "volume", min: 1000 },
    onTime: { field: "routes", min: 30 },
    oee: { field: "entries", min: 5 },
    pm: { field: "scheduled", min: 5 },
    fiveS: { field: "audits", min: 2 },
    firstPass: { field: "first", min: 30 },
    complaintsPer100: { field: "nights", min: 300 },
  };
  const sampleOf = (key, figure) => (finite(figure?.[MIN_N[key]?.field]) ? figure[MIN_N[key].field] : null);
  const enough = (key, figure) => finite(figure?.value) && Boolean(MIN_N[key]) && sampleOf(key, figure) >= MIN_N[key].min;
  // The ranking, of the sites with enough data. A rate is compared when two or more sites have it with enough behind it
  // (MIN_N); a site is ranked when it has enough on at least half of the rates compared (and on one at least), so a
  // site is not ranked on a corner of what the others are ranked on. On each compared rate the best ranked site gets
  // 100 points and the worst 0, the others in between by their place (n sites, place p from 1, equal values sharing
  // the mean place: points = (n − p) / (n − 1) × 100), each with the number behind it (n). A site's score is the mean
  // of its points; the higher, the better. The others follow, not ranked, with the reason (why): "volume" when none of
  // its rates has enough behind it (short lists them, with the number and the minimum), "coverage" when it has enough
  // on fewer than half of the rates compared (covered of compared), "shared" when it shares no rate with a ranked site.
  // sites: [{ id, name, figures }].
  const ranking = (sites) => {
    const rated = KPIS.filter((kpi) => kpi.ranked);
    const usable = new Map(sites.map((site) => [site.id, new Set(rated.filter((kpi) => enough(kpi.key, site.figures?.[kpi.key])).map((kpi) => kpi.key))]));
    const compared = rated.filter((kpi) => sites.filter((site) => usable.get(site.id).has(kpi.key)).length >= 2);
    const needed = Math.max(1, Math.ceil(compared.length / 2));
    const coverOf = (site) => compared.filter((kpi) => usable.get(site.id).has(kpi.key)).length;
    const eligible = new Set(sites.filter((site) => coverOf(site) >= needed).map((site) => site.id));
    const points = new Map(sites.map((site) => [site.id, []]));
    compared.forEach((kpi) => {
      const known = sites.filter((site) => eligible.has(site.id) && usable.get(site.id).has(kpi.key))
        .map((site) => ({ id: site.id, r: rounded(site.figures[kpi.key].value, kpi.format), n: sampleOf(kpi.key, site.figures[kpi.key]) }));
      const n = known.length;
      if (n < 2) return;
      known.forEach((e) => {
        const better = known.filter((o) => (kpi.better === "higher" ? o.r > e.r : o.r < e.r)).length;
        const same = known.filter((o) => o.r === e.r).length;
        const place = better + (same + 1) / 2;
        points.get(e.id).push({ kpi: kpi.key, place, points: ((n - place) / (n - 1)) * 100, n: e.n });
      });
    });
    return sites.map((site) => {
      const list = points.get(site.id);
      const ranked = list.length > 0;
      const covered = coverOf(site);
      const short = rated.filter((kpi) => finite(site.figures?.[kpi.key]?.value) && !usable.get(site.id).has(kpi.key))
        .map((kpi) => ({ kpi: kpi.key, n: sampleOf(kpi.key, site.figures[kpi.key]), min: MIN_N[kpi.key].min }));
      const why = ranked ? null : covered > 0 && covered < needed ? "coverage" : short.length && !covered ? "volume" : "shared";
      return { id: site.id, name: site.name, kpis: list.length, score: ranked ? list.reduce((t, p) => t + p.points, 0) / list.length : null, places: list, ranked, why, short, covered, compared: compared.length };
    }).sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || b.kpis - a.kpis || a.name.localeCompare(b.name));
  };
  // The prompt: the rate with the largest gap between its best and its worst site, relative to the larger of the two,
  // among the figures with enough behind them to rank.
  const widestGap = (sites) => {
    let top = null;
    KPIS.filter((kpi) => kpi.ranked).forEach((kpi) => {
      const entries = sites.map((site) => ({ id: site.id, value: enough(kpi.key, site.figures?.[kpi.key]) ? site.figures[kpi.key].value : null }));
      const m = marks(entries, kpi);
      if (!m.best.length || !m.worst.length) return;
      const valueOf = (id) => entries.find((e) => e.id === id).value;
      const best = valueOf(m.best[0]), worst = valueOf(m.worst[0]);
      const gap = Math.abs(best - worst) / Math.max(Math.abs(best), Math.abs(worst));
      if (!top || gap > top.gap + 1e-12) top = { kpi: kpi.key, gap, best: m.best[0], worst: m.worst[0], bestValue: best, worstValue: worst };
    });
    return top;
  };

  // The example ----------------------------------------------------------------------------------------------------------
  // The items of one example site's team copy, made from the data file's few numbers: per weekday (Monday first) the
  // volume and the units of the defect logs, the routes and the late ones, shifts of the machines, weekly 5S audits
  // (20 answers spread evenly over the five S, so the score is the total / 80), safety events, actions, maintenance
  // tasks and Kaizen ideas, all "days ago" from today. The page summarizes them like a real copy and keeps only the
  // summary, in memory: nothing goes to the network or into another tool's key.
  const EXAMPLE_DAYS = 75;
  const exampleItems = (site, today, suffix = "", reasons = []) => {
    const items = {};
    const first = addDays(today, -(EXAMPLE_DAYS - 1));
    const days = Array.from({ length: EXAMPLE_DAYS }, (_, i) => addDays(first, i));
    const at = (pattern, i) => (Array.isArray(pattern) && pattern.length ? pattern[((i % pattern.length) + pattern.length) % pattern.length] : 0);
    const ago = (n) => addDays(today, -Number(n));
    const hhmm = (minutes) => `${String(Math.floor((((minutes % 1440) + 1440) % 1440) / 60)).padStart(2, "0")}:${String((((minutes % 1440) + 1440) % 1440) % 60).padStart(2, "0")}`;
    const put = (tool, value) => { items[tool === "action-tracker" ? "sc-actions" : `sc-${tool}${suffix}`] = JSON.stringify(value); };
    const defectLog = (spec) => {
      const rows = [], volumes = [];
      days.forEach((date, i) => {
        const volume = Number(spec.volume[weekday(date)]) || 0;
        if (!(volume > 0)) return;
        volumes.push({ date, volume });
        let left = Math.max(0, (Number(spec.units[weekday(date)]) || 0) + at(spec.extra, i));
        for (let k = 0; left > 0; k++) {
          const units = Math.min(left, 3);
          rows.push({ date, shift: "", stage: "", type: "", cause: at(spec.causes, i + k), units, cost: "", note: "" });
          left -= units;
        }
      });
      return { target: "", volumes, rows };
    };
    if (site.damage) put("damage-control", defectLog(site.damage));
    if (site.incomplete) put("incomplete-control", defectLog(site.incomplete));
    if (site.delay) {
      const d = site.delay;
      const rows = [];
      days.forEach((date, i) => {
        const n = Number(d.routes[weekday(date)]) || 0;
        const late = Math.min(n, Math.max(0, (Number(d.late[weekday(date)]) || 0) + at(d.extra, i)));
        for (let r = 0; r < n; r++) {
          const plan = 6 * 60 + r * 30;
          // The late routes arrive past the 15 minutes of grace; the others within it, early or a little late.
          const delay = r < late ? d.minutes + ((r * 7) % 20) : at([-4, 0, 3, 8, -2, 5], i + r);
          rows.push({ date, shift: "", route: `R${String(r + 1).padStart(2, "0")}`, planDep: hhmm(plan - 90), actDep: hhmm(plan - 90), planArr: hhmm(plan), actArr: hhmm(plan + delay), reason: "", note: "" });
        }
      });
      put("delay-analyzer", { arrivalGrace: "15", departureGrace: "10", target: "", routes: "", from: "", to: "", rows });
    }
    if (site.oee) {
      const o = site.oee;
      const stop = (reasons.find((r) => r.loss === "breakdowns") || {}).name || "Breakdown";
      const rows = [];
      days.forEach((date, i) => {
        if (weekday(date) > 4) return;
        o.machines.forEach((m, k) => {
          const down = at(m.breakdown, i + k);
          const pieces = Math.round((m.rate * (o.planned - down)) / 60 * at(m.perf, i));
          rows.push({ date, shift: "", equipment: m.name, planned: o.planned, stops: down ? [{ reason: stop, minutes: down }] : [], pieces, rejects: Math.round(pieces * m.scrap), startup: 0, note: "" });
        });
      });
      put("oee", { equipment: o.machines.map((m) => ({ name: m.name, rate: m.rate })), rows });
    }
    if (site.fiveS) {
      const f = site.fiveS;
      const pillars = ["sort", "set", "shine", "standardize", "sustain"];
      const scoresOf = (total) => {
        const answers = Array.from({ length: 20 }, (_, i) => Math.floor(total / 20) + (i < total % 20 ? 1 : 0));
        return Object.fromEntries(pillars.map((key, s) => [key, answers.filter((_, i) => i % 5 === s)]));
      };
      const rows = days.filter((date) => weekday(date) === f.weekday).flatMap((date, w) => f.areas.map((area, a) => ({ id: `ex-${a}-${w}`, date, area, auditor: "", shift: "", scope: "5S", template: "", scores: scoresOf(at(f.totals, w + a * 3)), notes: {} })));
      put("five-s-audit", { scope: "5S", rows, tags: [] });
    }
    if (site.safety) put("safety-cross", { rows: site.safety.map(([n, type]) => ({ date: ago(n), shift: "", type, area: "", what: "", cause: "", severity: "", action: "", owner: "", done: false })).sort((a, b) => a.date.localeCompare(b.date)) });
    if (site.actions) {
      put("action-tracker", { rows: site.actions.map(([created, due, status, closed], i) => ({ id: `ex-a${i}`, title: `#${i + 1}`, detail: "", owner: "", due: ago(due), source: "", check: "", area: "", priority: "Medium", status, created: ago(created), closed: closed === undefined ? "" : ago(closed), result: "" })) });
    }
    if (site.maintenance) {
      const assets = [], rows = [];
      site.maintenance.forEach((spec, a) => {
        const asset = { id: `ex-m${a}`, tag: spec.tag, name: spec.tag, type: "other", area: "", crit: "B", supplier: "", contact: "", tasks: [] };
        spec.tasks.forEach((t, k) => {
          const task = { id: `ex-m${a}-t${k}`, text: spec.tag, every: t.every, unit: "weeks", hours: 0, who: "internal", minutes: 30, statutory: false, checklist: [], last: addDays(first, -k), lastHours: null, start: "" };
          asset.tasks.push(task);
          let last = task.last;
          for (let n = 0; n < 80; n++) {
            const due = addDays(last, 7 * t.every);
            // A task left open: its last date before today is not done, so it is overdue now.
            if (due > today || (t.open && addDays(due, 7 * t.every) > today)) break;
            const done = addDays(due, at(t.late, n));
            if (done > today) break;
            rows.push({ id: `ex-d${rows.length}`, kind: "done", asset: asset.id, task: task.id, date: done, by: "", note: "", minutes: 30, parts: 0, hours: null, checked: [] });
            last = done;
          }
        });
        assets.push(asset);
      });
      put("maintenance-planner", { site: "", assets, rows: rows.sort((x, y) => x.date.localeCompare(y.date)), sent: {}, show: "all" });
    }
    if (site.kaizen) {
      const k = site.kaizen;
      const idea = (n, adopted, i) => ({ id: `ex-k${i}`, title: `#${i + 1}`, waste: "", area: "", by: "", date: ago(adopted ? n + 6 : n), effort: 2, impact: 3, saving: "", status: adopted ? "act" : "idea", owner: "", due: "", next: "", result: "", reason: "", moved: ago(n), adopted: adopted ? ago(n) : "" });
      put("kaizen-board", { rows: [...(k.done || []).map((n, i) => idea(n, true, i)), ...(k.ideas || []).map((n, i) => idea(n, false, i + 100))] });
    }
    return items;
  };

  window.SiteCompareMath = {
    PERIODS, SUFFIXES, TOOLS, KPIS, DETAILS, WHY, PRECISION, rangeOf, latestIn, pickVariant, summarize, figures, cleanSummary, cleanSite, cleanSites,
    checkCode, marks, MIN_N, ranking, widestGap, exampleItems, openAt,
  };

  // The page -------------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-site-compare]");
  const dataEl = document.getElementById("site-compare-data");
  const results = document.querySelector("[data-results]");
  if (!root || !dataEl || !results || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { LANG, tx, el, int, num, pct, showDate, today, read, write, loadState, shareText, copy, undoNote, firstVisit, panel, stat, downloadCsv, downloadXlsx } = kit;
  const CK = window.ChartKit;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const tools = (() => { try { return JSON.parse(document.getElementById("site-compare-tools")?.textContent || "{}") || {}; } catch { return {}; } })();
  const KEY = cfg.storageKey;
  const SUFFIX = LANG === "en" ? "" : `-${LANG}`;
  const MAX_SITES = 12;
  const ctx = () => ({
    Ops: window.OpsReportMath, Oee: window.OeeMath, Safety: window.SafetyMath, Planner: window.MaintenancePlannerMath,
    Inspection: window.RoomInspectionMath, Complaints: window.GuestComplaintsMath, partial: kit.partialRouteLog,
    reasons: isObj(tools.oeeReasons) ? tools.oeeReasons : {}, inspection: tools.roomInspection, maintenance: tools.maintenance,
  });

  const state = loadState(KEY, { period: "last30", sites: [] });
  state.sites = cleanSites(state.sites);
  if (!PERIODS.includes(state.period)) state.period = "last30";
  const save = () => write(KEY, { period: state.period, sites: state.sites });
  // The example lives in this page's memory only.
  let example = null;
  let busy = false;

  const form = root;
  const nameField = form.querySelector("[name=name]");
  const codeField = form.querySelector("[name=code]");
  const addButton = form.querySelector("[data-add]");
  const addNote = form.querySelector("[data-add-note]");
  const siteList = form.querySelector("[data-sites]");
  const emptyNote = form.querySelector("[data-empty]");
  const updateButton = form.querySelector("[data-update]");
  const clearButton = form.querySelector("[data-clear]");
  const statusNote = form.querySelector("[data-status]");
  const offNote = form.querySelector("[data-off]");
  const periodBox = form.querySelector("[data-periods]");

  const fill = (template, vars = {}) => String(template ?? "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const label = (key) => cfg.kpis?.[key]?.label || key;
  const periodLabel = (key) => cfg.periods.find((p) => p.key === key)?.label || key;
  const pad = (n) => String(n).padStart(2, "0");
  const when = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return `${showDate(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  const show = (value, format) => {
    if (!finite(value)) return "–";
    if (format === "share") return shareText(value);
    if (format === "pct") return pct(value, 1);
    if (format === "per100") return num(value, 2);
    if (format === "days") return tx("{n} days", { n: int.format(value) });
    return int.format(value);
  };
  const WHY_TEXT = () => ({
    empty: tx("no entries in the period"), volume: tx("no volume for every day"), partial: tx("only some routes logged"),
    unrated: tx("no ideal rate for the machines"), noAccident: tx("no accident in the log"), noneDue: tx("no task due in the period"),
    nights: tx("room nights not complete in Hotel KPIs"),
  });
  const detailOf = (key, figure) => {
    const template = cfg.kpis?.[key]?.detail;
    if (!template || !finite(figure?.value)) return "";
    const vars = Object.fromEntries(DETAILS.filter((name) => finite(figure[name])).map((name) => [name, int.format(figure[name])]));
    return /\{\w+\}/.test(fill(template, vars)) ? "" : fill(template, vars);
  };
  // The number behind a rate, in words ("2,000 routes", "4 audits"); "–" when the figure has none.
  const sampleText = (key, n) => fill(cfg.kpis?.[key]?.sample || "{n}", { n: finite(n) ? int.format(n) : "–" });
  // Why a site is not ranked, in words, with the rates that have too little behind them.
  const unrankedText = (r) => {
    const short = r.short.map((s) => fill(tx("{kpi}: {sample}, at least {min} needed"), { kpi: label(s.kpi), sample: sampleText(s.kpi, s.n), min: int.format(s.min) })).join("; ");
    const lead = r.why === "volume" ? tx("not ranked: too little data.")
      : r.why === "coverage" ? fill(tx("not ranked: enough data on {k} of the {m} rates compared; a site needs at least half."), { k: int.format(r.covered), m: int.format(r.compared) })
        : tx("not ranked: no rate shared with another site");
    return short && r.why !== "shared" ? `${lead} ${short}.` : lead;
  };

  // ---- Sites ----
  const STATUS_TEXT = (site) => {
    const last = site.fetched ? fill(tx("Figures from {when}."), { when: when(site.fetched) }) : "";
    switch (site.status) {
      case "ok": {
        // When the site's devices last saved their copy: figures of a copy weeks old are weeks old.
        const sent = site.summary?.sent ? ` ${fill(tx("The site's copy was last saved {when}."), { when: when(site.summary.sent) })}` : "";
        const none = site.summary && !Object.values(site.summary.periods).some((p) => Object.keys(p).length) ? ` ${tx("The site shares none of the tools compared here.")}` : "";
        return `${fill(tx("Updated {when}."), { when: when(site.fetched) })}${sent}${none}`;
      }
      case "reading": return tx("Reading…");
      case "offline": return `${tx("No connection.")} ${last}`.trim();
      case "gone": return `${tx("This site's team copy is no longer on the server: the team may have changed its code. Ask the site for its new read-only code.")} ${last}`.trim();
      case "unreadable": return `${tx("This code does not open the site's copy. Ask the site for its current read-only code.")} ${last}`.trim();
      case "refused": return `${tx("The sync server refused the request.")} ${last}`.trim();
      case "off": return tx("This page has no sync server, so it cannot read the sites.");
      case "no-crypto": return tx("This browser cannot decrypt the copies (it has no WebCrypto).");
      case "error": return `${tx("The sync server answered with an error.")} ${last}`.trim();
      default: return tx("Not updated yet.");
    }
  };
  const siteId = () => Array.from(globalThis.crypto?.getRandomValues ? globalThis.crypto.getRandomValues(new Uint8Array(6)) : Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)), (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
  const renderSites = () => {
    siteList.replaceChildren(...state.sites.map((site) => {
      const item = el("li", "sv-site");
      const text = el("div", "sv-site-text");
      text.append(el("strong", null, site.name));
      const line = el("span", `sv-site-status${site.status && site.status !== "ok" && site.status !== "reading" ? " is-problem" : ""}`, STATUS_TEXT(site));
      text.append(line);
      const remove = el("button", "button-ghost sv-remove", tx("Remove"));
      remove.type = "button";
      remove.setAttribute("aria-label", fill(tx("Remove {name} and its code"), { name: site.name }));
      remove.disabled = busy;
      remove.addEventListener("click", () => {
        const index = state.sites.indexOf(site);
        if (index < 0) return;
        state.sites.splice(index, 1);
        save();
        renderAll();
        undoNote(statusNote, fill(tx("{name} removed with its code."), { name: site.name }), () => {
          if (state.sites.length >= MAX_SITES || state.sites.some((s) => s.code === site.code)) return;
          state.sites.splice(Math.min(index, state.sites.length), 0, site);
          save();
          renderAll();
        });
      });
      item.append(text, remove);
      return item;
    }));
    emptyNote.hidden = state.sites.length > 0;
    updateButton.hidden = !state.sites.length;
    updateButton.parentElement.hidden = !state.sites.length;
    updateButton.disabled = busy;
    clearButton.hidden = !state.sites.length;
    addButton.disabled = busy;
  };

  const REFUSED = () => ({
    empty: tx("Paste or scan the site's read-only code."),
    off: tx("This page has no sync server, so it cannot read the sites."),
    "team-code": tx("This is a team code (six words). Comparing needs read-only codes: a team code lets whoever holds it change the team's work. Ask the site for a read-only code instead. The six words were not kept."),
    "team-code-typo": tx("This looks like a team code (words). Comparing needs read-only codes, which start with “scr”. The words were not kept."),
    damaged: tx("This read-only code is incomplete or damaged. Copy it again in full, or scan its QR code."),
    version: tx("This read-only code is from a newer version of the tools. Reload the page and try again."),
  });
  const addSite = async () => {
    if (busy) return;
    const name = nameField.value.trim().slice(0, 60);
    const typed = codeField.value;
    const checked = await checkCode(typed);
    if (!checked.ok) {
      // A team code is not kept anywhere, not even in the field.
      if (checked.reason === "team-code" || checked.reason === "team-code-typo") codeField.value = "";
      addNote.textContent = REFUSED()[checked.reason] || REFUSED().damaged;
      codeField.focus();
      return;
    }
    if (!name) { addNote.textContent = tx("Give the site a name."); nameField.focus(); return; }
    const twin = state.sites.find((site) => site.code === checked.code);
    if (twin) { addNote.textContent = fill(tx("This code is already in the list as {name}."), { name: twin.name }); return; }
    if (state.sites.length >= MAX_SITES) { addNote.textContent = fill(tx("At most {n} sites. Remove one first."), { n: MAX_SITES }); return; }
    const site = cleanSite({ id: siteId(), name, code: checked.code });
    state.sites.push(site);
    if (example) example = null;
    save();
    nameField.value = "";
    codeField.value = "";
    addNote.textContent = fill(tx("{name} added. Its code stays on this device."), { name });
    renderAll();
    await update([site]);
  };

  // ---- Update: one site after the other, each with its own result ----
  const readSite = async (site) => {
    const Sync = window.TeamSync;
    if (!Sync?.readTeamCopy) return { status: "off" };
    try { return await Sync.readTeamCopy(site.code, { endpoint: tools.endpoint || "" }); } catch { return { status: "error" }; }
  };
  const update = async (sites = state.sites) => {
    if (busy || !sites.length) return;
    busy = true;
    renderSites();
    let done = 0;
    for (const site of sites) {
      if (!state.sites.includes(site)) continue;
      site.status = "reading";
      renderSites();
      const result = await readSite(site);
      const now = new Date().toISOString();
      if (result.status === "ok") {
        // The figures and nothing else: result.items (the site's work) is dropped once they are counted.
        const summary = summarize(result.items, today(), ctx());
        if (typeof result.sent === "string") summary.sent = result.sent;
        site.summary = cleanSummary(summary);
        site.fetched = now;
        done++;
      }
      site.tried = now;
      site.status = STATUSES.includes(result.status) ? result.status : "error";
      save();
    }
    busy = false;
    statusNote.textContent = fill(tx("{a} of {b} sites updated."), { a: int.format(done), b: int.format(sites.length) });
    renderAll();
  };

  // ---- The comparison ----
  const shown = () => (example ? example.sites : state.sites.filter((site) => site.summary));
  const figuresOf = (site) => site.summary?.periods?.[state.period] || {};
  // The sites as the arithmetic takes them: an id, a name and the figures of the chosen period.
  const forMath = (sites) => sites.map((site) => ({ id: site.id, name: site.name, figures: figuresOf(site) }));
  const present = (sites) => KPIS.filter((kpi) => sites.some((site) => figuresOf(site)[kpi.key]));
  const tagText = (id, m) => (m.best.includes(id) ? tx("best") : m.worst.includes(id) ? tx("worst") : "");
  const betterText = (kpi) => (kpi.better === "higher" ? tx("higher is better") : kpi.better === "lower" ? tx("lower is better") : tx("not compared"));

  const valueCell = (site, kpi, m) => {
    const figure = figuresOf(site)[kpi.key];
    const cell = el("td", "num sv-cell");
    if (!figure) { cell.append(el("span", "sv-none", tx("not in use"))); return cell; }
    cell.append(el("strong", "sv-value", show(figure.value, kpi.format)));
    const tag = tagText(site.id, m);
    if (tag) cell.append(" ", el("span", `dl-tag sv-tag ${m.best.includes(site.id) ? "is-best" : "is-worst"}`, tag));
    const detail = finite(figure.value) ? detailOf(kpi.key, figure) : WHY_TEXT()[figure.why] || "";
    if (detail) cell.append(el("span", "sv-detail", detail));
    return cell;
  };
  const table = (sites, kpis) => {
    const wrap = el("div", "dl-table-wrap sv-table-wrap");
    const t = el("table", "dl-table sv-table");
    const note = fill(tx("{period}: each figure as the site's own tool counts it. Best and worst are named in the cell; counts are marked but not ranked."), { period: periodLabel(state.period) });
    // The note stands above the table, which scrolls sideways on a phone; the caption names the table for a screen reader.
    t.append(el("caption", "visually-hidden", note));
    const lead = el("p", "form-note sv-table-note", note);
    const head = el("tr");
    head.append(el("th", null, tx("Figure")));
    sites.forEach((site) => {
      const th = el("th", "num");
      th.scope = "col";
      th.append(el("span", "sv-site-head", site.name), el("span", "sv-asof", fill(tx("as of {date}"), { date: showDate(site.summary.asOf) })));
      head.append(th);
    });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    let group = "";
    kpis.forEach((kpi) => {
      if (kpi.group !== group) {
        group = kpi.group;
        const row = el("tr", "sv-group");
        const th = el("th", null, cfg.groups?.[group] || group);
        th.colSpan = sites.length + 1;
        th.scope = "colgroup";
        row.append(th);
        body.append(row);
      }
      const m = marks(sites.map((site) => ({ id: site.id, value: figuresOf(site)[kpi.key]?.value })), kpi);
      const row = el("tr");
      const th = el("th", "sv-kpi");
      th.scope = "row";
      th.append(el("span", null, label(kpi.key)), el("span", "sv-better", betterText(kpi)));
      row.append(th, ...sites.map((site) => valueCell(site, kpi, m)));
      body.append(row);
    });
    t.append(thead, body);
    wrap.append(t);
    const box = el("div", "sv-table-box");
    lead.setAttribute("aria-hidden", "true");
    box.append(lead, wrap);
    return box;
  };
  const rankingPanel = (sites) => {
    const box = panel(cfg.summary.ranking, tx("A rate counts when two or more sites have it with enough data behind it (for example 30 routes, 1,000 units handled, 5 shifts or 2 audits); a site is ranked when it has enough on at least half of those rates. On each, the best site gets 100 points and the worst 0, the others in between by their place; equal values share it. A site's score is the mean over its rates, with the number behind each. Counts are left out: they grow with the size of a site."));
    const ranks = ranking(forMath(sites));
    // The ranked sites in order, each score with the number behind every rate; the others apart, with the reason.
    const ol = el("ol", "sv-ranking");
    ranks.filter((r) => r.ranked).forEach((r) => {
      const li = el("li");
      li.append(el("strong", null, r.name), " ", el("span", null, fill(tx("{score} points over {n} rates"), { score: int.format(Math.round(r.score)), n: int.format(r.kpis) })));
      li.append(el("span", "sv-detail sv-sample", r.places.map((p) => `${label(p.kpi)}: ${sampleText(p.kpi, p.n)}`).join(" · ")));
      ol.append(li);
    });
    if (ol.children.length) box.append(ol);
    const apart = ranks.filter((r) => !r.ranked);
    if (apart.length) {
      box.append(el("p", "result-label", tx("Not ranked")));
      const ul = el("ul", "sv-unranked");
      apart.forEach((r) => {
        const li = el("li");
        li.append(el("strong", null, r.name), " ", el("span", null, unrankedText(r)));
        ul.append(li);
      });
      box.append(ul);
    }
    return { box, ranks };
  };
  const promptCard = (sites) => {
    const gap = widestGap(forMath(sites));
    const card = el("article", "result-card dl-focus sv-prompt");
    card.append(el("p", "result-label", cfg.prompt.title));
    if (!gap) { card.append(el("p", null, cfg.prompt.none)); return { card, gap }; }
    const kpi = KPI[gap.kpi];
    const name = (id) => sites.find((site) => site.id === id)?.name || "";
    const vars = { best: name(gap.best), worst: name(gap.worst), kpi: label(gap.kpi), bestValue: show(gap.bestValue, kpi.format), worstValue: show(gap.worstValue, kpi.format) };
    card.append(el("p", "dl-focus-lede", fill(cfg.prompt.lead, vars)), el("p", null, fill(cfg.prompt.ask, vars)));
    const actions = el("div", "tool-actions");
    const gemba = el("a", "button-secondary", tx("Plan a Gemba Walk"));
    gemba.href = new URL("../gemba-walk/", window.location.href).href;
    const kaizen = el("a", "button-secondary", tx("Open the Kaizen Board"));
    kaizen.href = new URL("../kaizen-board/", window.location.href).href;
    actions.append(gemba, kaizen);
    if (Actions) {
      actions.append(Actions.linkButton(tx("Add to actions"), () => ({
        title: fill(tx("Learn from {best}: {kpi}"), vars).slice(0, 300),
        detail: fill(cfg.prompt.lead, vars),
        source: "site-compare",
        check: fill(tx("{kpi} at {worst} closer to {best} in four weeks."), vars),
        priority: "Medium",
      })));
    }
    card.append(actions);
    return { card, gap };
  };

  const summaryText = (sites, kpis, ranks, gap) => {
    const lines = [`${cfg.summary.title} · ${periodLabel(state.period)}`, ""];
    sites.forEach((site) => lines.push(`${site.name}: ${fill(tx("as of {date}"), { date: showDate(site.summary.asOf) })}`));
    lines.push("");
    kpis.forEach((kpi) => {
      const m = marks(sites.map((site) => ({ id: site.id, value: figuresOf(site)[kpi.key]?.value })), kpi);
      const cells = sites.filter((site) => figuresOf(site)[kpi.key]).map((site) => {
        const figure = figuresOf(site)[kpi.key];
        const tag = tagText(site.id, m);
        return `${site.name} ${show(figure.value, kpi.format)}${tag ? ` (${tag})` : ""}`;
      });
      lines.push(`${label(kpi.key)}: ${cells.join(" · ")}`);
    });
    lines.push("", `${cfg.summary.ranking}:`);
    ranks.filter((r) => r.ranked).forEach((r, i) => lines.push(`${i + 1}. ${r.name} · ${int.format(Math.round(r.score))} (${r.places.map((p) => `${label(p.kpi)}: ${sampleText(p.kpi, p.n)}`).join(" · ")})`));
    ranks.filter((r) => !r.ranked).forEach((r) => lines.push(`- ${r.name}: ${unrankedText(r)}`));
    if (gap) {
      const kpi = KPI[gap.kpi];
      const name = (id) => sites.find((site) => site.id === id)?.name || "";
      const vars = { best: name(gap.best), worst: name(gap.worst), kpi: label(gap.kpi), bestValue: show(gap.bestValue, kpi.format), worstValue: show(gap.worstValue, kpi.format) };
      lines.push("", `${cfg.prompt.title}: ${fill(cfg.prompt.lead, vars)}`);
    }
    return lines.join("\n");
  };
  // Numbers for a spreadsheet: shares and per cents as per cent figures, with their unit.
  const UNIT = () => ({ share: "%", pct: "%", per100: tx("per 100 room nights"), days: tx("days"), int: "" });
  const cellValue = (value, format) => (!finite(value) ? "" : format === "share" ? Math.round(value * 1e6) / 1e4 : format === "pct" ? Math.round(value * 1e5) / 1e3 : format === "per100" ? Math.round(value * 100) / 100 : value);
  const sheet = (sites, kpis) => {
    const rows = [[tx("Figure"), tx("Unit"), ...sites.map((site) => site.name), tx("Best site"), tx("Worst site")]];
    kpis.forEach((kpi) => {
      const m = marks(sites.map((site) => ({ id: site.id, value: figuresOf(site)[kpi.key]?.value })), kpi);
      const names = (ids) => sites.filter((site) => ids.includes(site.id)).map((site) => site.name).join(", ");
      rows.push([label(kpi.key), UNIT()[kpi.format], ...sites.map((site) => cellValue(figuresOf(site)[kpi.key]?.value, kpi.format)), names(m.best), names(m.worst)]);
    });
    return rows;
  };
  const chartPanels = (sites, kpis) => {
    if (!CK) return [];
    return kpis.map((kpi) => {
      const known = sites.filter((site) => finite(figuresOf(site)[kpi.key]?.value));
      if (!known.length) return null;
      const m = marks(sites.map((site) => ({ id: site.id, value: figuresOf(site)[kpi.key]?.value })), kpi);
      const scale = kpi.format === "share" || kpi.format === "pct" ? 100 : 1;
      const items = known.map((site) => {
        const value = figuresOf(site)[kpi.key].value;
        const tag = tagText(site.id, m);
        return { label: site.name, value: value * scale, tip: `${site.name}: ${show(value, kpi.format)}${tag ? ` · ${tag}` : ""}` };
      });
      // Whole axis steps read whole ("100 %"); the bars keep the precision of the table.
      const format = (v) => (scale === 100 ? `${num(v, kpi.format === "share" ? 2 : Number.isInteger(v) ? 0 : 1)} %` : num(v, kpi.format === "per100" && !Number.isInteger(v) ? 2 : 0));
      const box = panel(label(kpi.key), `${periodLabel(state.period)} · ${betterText(kpi)}`);
      box.append(CK.figure(CK.bars(items, { title: `${label(kpi.key)} · ${periodLabel(state.period)}`, format }), { fileName: `site-compare-${kpi.key}` }));
      const missing = sites.filter((site) => !known.includes(site)).map((site) => site.name);
      if (missing.length) box.append(el("p", "dl-panel-note", fill(tx("No figure: {names}."), { names: missing.join(", ") })));
      return box;
    }).filter(Boolean);
  };

  const renderResults = () => {
    const sites = shown();
    results.replaceChildren();
    if (!sites.length) { results.hidden = true; return; }
    results.hidden = false;
    const kpis = present(sites);
    if (example) {
      const note = el("div", "dl-example-note");
      note.setAttribute("role", "status");
      const clear = el("button", "button-ghost", tx("Clear the example"));
      clear.type = "button";
      clear.addEventListener("click", () => { example = null; save(); renderAll(); });
      note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("Three sites with made-up figures, counted from example tool data in this page's memory: nothing was read from a server. Add a site and it disappears, or clear it now.")), " ", clear);
      results.append(note);
    }
    const head = el("div", "result-head sv-head");
    head.append(el("p", "result-label", cfg.summary.title), el("h2", null, periodLabel(state.period)));
    const days = new Set(sites.map((site) => site.summary.asOf));
    head.append(el("p", "form-note", days.size > 1 ? tx("The sites were updated on different days: each one's period ends on its own day of update.") : fill(tx("Figures as of {date}."), { date: showDate([...days][0]) })));
    results.append(head);
    const { box: rankBox, ranks } = rankingPanel(sites);
    const stats = el("div", "dl-stats");
    const leader = ranks[0]?.score !== null && ranks[0]?.score !== undefined ? ranks[0] : null;
    stats.append(
      stat(tx("Sites compared"), int.format(sites.length)),
      stat(tx("Figures"), int.format(kpis.length)),
      stat(tx("Highest score"), leader ? leader.name : "–", leader ? fill(tx("{score} points over {n} rates"), { score: int.format(Math.round(leader.score)), n: int.format(leader.kpis) }) : ""),
    );
    results.append(stats);
    const { card, gap } = promptCard(sites);
    results.append(card);
    results.append(table(sites, kpis));
    results.append(rankBox);
    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(summaryText(sites, kpis, ranks, gap), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const csvButton = el("button", "button-secondary", tx("Download CSV"));
    csvButton.type = "button";
    csvButton.addEventListener("click", () => downloadCsv("site-compare", sheet(sites, kpis)));
    const xlsxButton = el("button", "button-secondary", tx("Download Excel"));
    xlsxButton.type = "button";
    xlsxButton.addEventListener("click", () => downloadXlsx("site-compare", sheet(sites, kpis), { sheet: "Sites", title: cfg.summary.title }));
    actions.append(copyButton, printButton, csvButton, xlsxButton);
    results.append(actions);
    const charts = chartPanels(sites, kpis);
    if (charts.length) {
      const details = el("details", "dl-details sv-charts");
      details.open = window.matchMedia ? window.matchMedia("(min-width: 761px)").matches : true;
      window.addEventListener("beforeprint", () => { details.open = true; }, { once: true });
      details.append(el("summary", "dl-details-summary", fill(tx("Charts by figure ({n})"), { n: int.format(charts.length) })));
      const grid = el("div", "sv-chart-grid");
      grid.append(...charts);
      details.append(grid);
      results.append(details);
    }
  };

  const loadExample = () => {
    const spec = cfg.example?.sites || [];
    const day = today();
    const reasons = list(tools.oeeReasons?.[LANG]);
    // Made like a real copy and summarized the same way; the tool data itself goes when the summary is made.
    example = { sites: spec.map((site, i) => ({ id: `ex${i}`, name: site.name, summary: cleanSummary(summarize(exampleItems(site, day, SUFFIX, reasons), day, ctx())) })) };
  };

  const renderPeriods = () => {
    periodBox.querySelectorAll("input[name=period]").forEach((input) => { input.checked = input.value === state.period; });
  };
  const renderAll = () => {
    renderSites();
    renderPeriods();
    renderResults();
  };

  // ---- Events ----
  addButton.addEventListener("click", () => { addSite(); });
  codeField.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); addSite(); } });
  updateButton.addEventListener("click", () => { update(); });
  clearButton.addEventListener("click", () => {
    if (!window.confirm(tx("Remove every site and its read-only code from this device?"))) return;
    state.sites = [];
    save();
    statusNote.textContent = tx("All sites and their codes are removed from this device.");
    renderAll();
  });
  periodBox.addEventListener("change", (event) => {
    if (event.target.name !== "period" || !PERIODS.includes(event.target.value)) return;
    state.period = event.target.value;
    // The example's period is the visitor's choice too; nothing else of it is kept.
    if (!example || state.sites.length) save();
    renderResults();
  });
  form.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    renderAll();
    results.focus();
  }));

  // Team Sync's script comes later on the page (in the box at the foot); its parser and reader are there by the
  // time the page is ready.
  const ready = () => {
    offNote.hidden = Boolean(window.TeamSync?.readTeamCopy && tools.endpoint);
  };
  if (document.readyState === "complete") ready();
  else document.addEventListener("DOMContentLoaded", ready, { once: true });

  // A first visit with nothing saved opens on the example, with the note.
  if (firstVisit(KEY) && !state.sites.length) loadExample();
  renderAll();
})();
