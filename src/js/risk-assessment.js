// Risk Assessment (Gefährdungsbeurteilung): the documented assessment of each work area or activity, as the German
// Occupational Safety and Health Act asks for it (ArbSchG § 5: assess the hazards per area or activity; § 6: keep the
// result, the measures and the check of their effect on file). Each hazard comes from the hazard-factor groups of the
// BAuA handbook, is rated likelihood × severity on a 5 × 5 matrix, gets measures in the STOP order (§ 4 No. 5: personal
// protection comes after the others), an effectiveness check (§ 3 (1)) and a residual risk. The arithmetic lives in
// window.RiskAssessmentMath so the tests can call it.
(() => {
  // Arithmetic -------------------------------------------------------------------------------------------------------
  const LEVELS = [1, 2, 3, 4, 5];
  const BANDS = ["low", "medium", "high", "very-high"];
  const DEFAULT_BANDS = { low: 4, medium: 9, high: 16 };
  const STOP = ["S", "T", "O", "P"];
  const STATUSES = ["open", "doing", "done"];
  const CHECKS = ["", "effective", "partly", "not-effective"];
  // Injuries make a review due at once; so does a near miss that could have killed (severity 4 on the Safety Cross).
  const ACCIDENTS = ["lost-time", "no-lost-time", "first-aid"];
  const DAY = 864e5;

  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const isIso = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const pad = (n) => String(n).padStart(2, "0");
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const between = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);
  // Whole months on, the day kept where the month has it: 31 January + 1 month is 28 February.
  const addMonths = (iso, months) => {
    if (!isIso(iso) || !Number.isInteger(months)) return "";
    const [y, m, d] = iso.split("-").map(Number);
    const total = y * 12 + (m - 1) + months;
    const year = Math.floor(total / 12), month = total - year * 12;
    const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return `${String(year).padStart(4, "0")}-${pad(month + 1)}-${pad(Math.min(d, last))}`;
  };

  const level = (value) => {
    const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
    return Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
  };
  // Risk = likelihood × severity, each 1–5, so 1 to 25; only when both are rated: a missing rating is not a 1.
  const risk = (l, s) => {
    const a = level(l), b = level(s);
    return a && b ? a * b : null;
  };
  // The scores a 5 × 5 matrix can give: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 25 (no 7, 11, 13, 14, 17–19, 21–24).
  const PRODUCTS = [...new Set(LEVELS.flatMap((l) => LEVELS.map((s) => l * s)))].sort((a, b) => a - b);
  // The bands are three upper limits (low up to 4, medium up to 9, high up to 16, very high above). A set that does not
  // rise from 1 to below 25 falls back to the standard one, so a typo never leaves a score without a band.
  const cleanBands = (raw) => {
    const o = isObject(raw) ? raw : {};
    const n = (value) => (Number.isInteger(Number(value)) && String(value).trim() !== "" ? Number(value) : NaN);
    const bands = { low: n(o.low), medium: n(o.medium), high: n(o.high) };
    return bands.low >= 1 && bands.low < bands.medium && bands.medium < bands.high && bands.high < 25 ? bands : { ...DEFAULT_BANDS };
  };
  const validBands = (raw) => {
    const clean = cleanBands(raw);
    return isObject(raw) && ["low", "medium", "high"].every((key) => Number(raw[key]) === clean[key]);
  };
  const band = (score, bands = DEFAULT_BANDS) => {
    if (!Number.isFinite(score) || score < 1) return null;
    const b = cleanBands(bands);
    return score <= b.low ? "low" : score <= b.medium ? "medium" : score <= b.high ? "high" : "very-high";
  };
  const isHigh = (key) => key === "high" || key === "very-high";
  // Each band with its range of scores (min–max) and the scores the matrix can actually give in it (from–to).
  const bandRanges = (bands = DEFAULT_BANDS) => {
    const b = cleanBands(bands);
    const limits = { low: [1, b.low], medium: [b.low + 1, b.medium], high: [b.medium + 1, b.high], "very-high": [b.high + 1, 25] };
    return BANDS.map((key) => {
      const scores = PRODUCTS.filter((p) => band(p, b) === key);
      return { key, min: limits[key][0], max: limits[key][1], from: scores[0] ?? null, to: scores.at(-1) ?? null };
    });
  };

  const measuresOf = (hazard) => (Array.isArray(hazard?.measures) ? hazard.measures.filter((m) => str(m.text).trim()) : []);
  const byStop = (a, b) => STOP.indexOf(a.type) - STOP.indexOf(b.type);
  // The STOP order: Substitution, Technical, Organisational, Personal (ArbSchG § 4 No. 5: individual protection comes
  // after the other measures). A high or very high risk met with PPE alone is flagged; so is any risk above low without
  // a measure at all.
  const stopCheck = (hazard, bands = DEFAULT_BANDS) => {
    const key = band(risk(hazard.l, hazard.s), bands);
    if (!key) return "";
    const list = measuresOf(hazard);
    if (!list.length) return key === "low" ? "" : "no-measure";
    if (isHigh(key) && list.every((m) => m.type === "P")) return "only-p";
    return "";
  };
  // Residual risk: the hazard rated again for when its measures are in place (the effectiveness check confirms it).
  const residual = (hazard) => risk(hazard.l2, hazard.s2);
  // A hazard not rated again counts at its first rating: until then, nothing shows the risk went down.
  const current = (hazard) => residual(hazard) ?? risk(hazard.l, hazard.s);
  const enrich = (hazard, bands = DEFAULT_BANDS) => {
    const before = risk(hazard.l, hazard.s);
    const after = residual(hazard);
    return { ...hazard, risk: before, band: band(before, bands), residual: after, band2: band(after, bands), now: after ?? before, bandNow: band(after ?? before, bands), stop: stopCheck(hazard, bands), higher: before !== null && after !== null && after > before };
  };

  // The effectiveness check of a measure that is done: its result, or "check-pending" (no date or a date to come) and
  // "check-overdue" (the date has passed without a result). An open measure has nothing to check yet.
  const checkState = (measure, today) => {
    if (measure.status !== "done") return "";
    if (measure.check) return measure.check;
    return isIso(measure.checkDate) && measure.checkDate < today ? "check-overdue" : "check-pending";
  };
  const isOpenMeasure = (measure) => measure.status !== "done";

  const norm = (text) => str(text).trim().toLowerCase();
  const sameArea = (a, b) => norm(a) !== "" && norm(a) === norm(b);

  // When the assessment is due again. An injury in the area since the assessment (or a near miss that could have been
  // fatal), or a change on site, makes it due now (ArbSchG § 3: adjust the measures to changed circumstances); else the
  // review date set for it: overdue once passed, "soon" within the days given.
  const reviewState = (assessment, today, { soon = 30, events = [] } = {}) => {
    const since = (event) => isIso(event.date) && event.date <= today && (!isIso(assessment.date) || event.date > assessment.date);
    const hits = events.filter((event) => sameArea(event.area, assessment.area) && since(event) && (ACCIDENTS.includes(event.type) || (event.type === "near-miss" && event.severity >= 4)));
    const next = isIso(assessment.nextReview) ? assessment.nextReview : "";
    const days = next ? between(today, next) : null;
    const overdue = days !== null && days < 0;
    if (hits.length) return { state: "event", events: hits.sort((a, b) => a.date.localeCompare(b.date)), due: today, next, overdue };
    if (assessment.changed === true) return { state: "change", due: today, next, overdue };
    if (!next) return { state: "none", due: "", next, overdue: false };
    if (overdue) return { state: "overdue", due: next, next, days: -days, overdue };
    return { state: days <= soon ? "soon" : "ok", due: next, next, days, overdue: false };
  };
  const reviewDue = (review) => ["event", "change", "overdue"].includes(review.state);

  // The Safety Cross log as this tool reads it: { rows: [{ date, shift, type, area, what, cause, severity, ... }] }.
  const cleanEvent = (row) => {
    if (!isObject(row) || !isIso(row.date) || !str(row.type)) return null;
    const severity = Number.parseInt(row.severity, 10);
    return { date: row.date, type: row.type, area: str(row.area).trim(), cause: str(row.cause).trim(), severity: severity >= 1 && severity <= 4 ? severity : 1, what: str(row.what).trim() };
  };
  const readEvents = (saved) => (isObject(saved) && Array.isArray(saved.rows) ? saved.rows.map(cleanEvent).filter(Boolean) : []);
  // The safety events of each area set against its assessments: an area with events and no assessment is flagged, and so
  // is a cause none of the area's hazards covers. causeGroups maps a Safety Cross cause to the hazard groups that cover
  // it; "*" (procedure, PPE, other) is covered by any assessment of the area. Positive observations are not events.
  const crossCheck = (assessments, events, { causeGroups = {}, from = "", to = "" } = {}) => {
    const areas = new Map();
    events.filter((event) => event.type !== "positive" && (!from || event.date >= from) && (!to || event.date <= to)).forEach((event) => {
      if (!event.area) return;
      const key = norm(event.area);
      if (!areas.has(key)) areas.set(key, { area: event.area, events: [] });
      areas.get(key).events.push(event);
    });
    return [...areas.values()].map((item) => {
      const own = assessments.filter((a) => sameArea(a.area, item.area));
      const groups = new Set(own.flatMap((a) => (a.hazards || []).map((h) => h.group)));
      const causes = new Map();
      item.events.forEach((event) => causes.set(event.cause, (causes.get(event.cause) || 0) + 1));
      const uncovered = own.length ? [...causes].filter(([cause]) => {
        const list = causeGroups[cause];
        return Array.isArray(list) && list.length && !list.includes("*") && !list.some((key) => groups.has(key));
      }).map(([cause, n]) => ({ cause, n, groups: causeGroups[cause] })) : [];
      return {
        area: item.area, events: item.events.length, accidents: item.events.filter((event) => ACCIDENTS.includes(event.type)).length,
        causes: [...causes].map(([cause, n]) => ({ cause, n })).sort((a, b) => b.n - a.n),
        assessed: own.length > 0, assessments: own.map((a) => a.id), uncovered,
        flag: !own.length ? "no-assessment" : uncovered.length ? "not-covered" : "",
      };
    }).sort((a, b) => Number(Boolean(b.flag)) - Number(Boolean(a.flag)) || b.events - a.events || a.area.localeCompare(b.area));
  };

  // Hazards per cell of the matrix, before (l × s) or after (l2 × s2) the measures; keys "likelihood-severity".
  const matrix = (hazards, which = "before") => {
    const cells = {};
    hazards.forEach((hazard) => {
      const after = which === "after" && residual(hazard) !== null;
      const l = level(after ? hazard.l2 : hazard.l), s = level(after ? hazard.s2 : hazard.s);
      if (!l || !s) return;
      (cells[`${l}-${s}`] ||= []).push(hazard);
    });
    return cells;
  };
  const bandCounts = (hazards, bands = DEFAULT_BANDS, which = "before") => {
    const out = { low: 0, medium: 0, high: 0, "very-high": 0, unrated: 0 };
    hazards.forEach((hazard) => { out[band(which === "after" ? current(hazard) : risk(hazard.l, hazard.s), bands) || "unrated"] += 1; });
    return out;
  };
  const allHazards = (assessments) => assessments.flatMap((a) => a.hazards.map((h) => ({ ...h, assessment: a })));
  // Open measures, by due date (none last), then in STOP order.
  const openMeasures = (assessments, today) => assessments.flatMap((a) => a.hazards.flatMap((h) => measuresOf(h).filter(isOpenMeasure)
    .map((m) => ({ ...m, area: a.area, activity: a.activity, hazard: h.text, hazardId: h.id, assessmentId: a.id, risk: risk(h.l, h.s), overdue: isIso(m.due) && m.due < today }))))
    .sort((x, y) => (x.due || "9999").localeCompare(y.due || "9999") || byStop(x, y));
  const byOwner = (measures) => {
    const map = new Map();
    measures.forEach((m) => {
      const key = m.owner.trim() || "";
      const item = map.get(key) || { owner: key, open: 0, overdue: 0, next: "" };
      item.open += 1;
      if (m.overdue) item.overdue += 1;
      if (m.due && (!item.next || m.due < item.next)) item.next = m.due;
      map.set(key, item);
    });
    return [...map.values()].sort((a, b) => b.overdue - a.overdue || b.open - a.open || a.owner.localeCompare(b.owner));
  };

  // The whole set in numbers.
  const summarize = (assessments, today, bands = DEFAULT_BANDS, events = []) => {
    const hazards = allHazards(assessments).map((h) => ({ ...enrich(h, bands), assessment: h.assessment }));
    const before = bandCounts(hazards, bands, "before");
    const after = bandCounts(hazards, bands, "after");
    const measures = assessments.flatMap((a) => a.hazards.flatMap(measuresOf));
    const open = openMeasures(assessments, today);
    const checks = measures.map((m) => checkState(m, today));
    const reviews = assessments.map((a) => ({ assessment: a, ...reviewState(a, today, { events }) }));
    const ranked = hazards.filter((h) => h.risk !== null).sort((a, b) => b.now - a.now || b.risk - a.risk);
    return {
      assessments: assessments.length, hazards: hazards.length, rated: hazards.filter((h) => h.risk !== null).length,
      before, after, highBefore: before.high + before["very-high"], highAfter: after.high + after["very-high"],
      measures: measures.length, open: open.length, overdue: open.filter((m) => m.overdue).length,
      checksPending: checks.filter((c) => c === "check-pending").length, checksOverdue: checks.filter((c) => c === "check-overdue").length,
      partly: checks.filter((c) => c === "partly").length, notEffective: checks.filter((c) => c === "not-effective").length,
      stopWarnings: hazards.filter((h) => h.stop), onlyP: hazards.filter((h) => h.stop === "only-p").length, noMeasure: hazards.filter((h) => h.stop === "no-measure").length,
      highResidual: hazards.filter((h) => h.residual !== null && isHigh(h.band2)), notReRated: hazards.filter((h) => h.risk !== null && h.residual === null).length,
      reviews, reviewsDue: reviews.filter(reviewDue).length, top: ranked[0] || null, ranked,
    };
  };

  // Saved work, a template file and the example are rebuilt field by field.
  const text = (value, max = 300) => (typeof value === "string" ? value.slice(0, max) : typeof value === "number" ? String(value) : "");
  const isoDate = (value) => (isIso(value) ? value : "");
  let counter = 0;
  const newId = (prefix = "x") => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const idOf = (value, prefix) => (typeof value === "string" && /^[\w-]{1,40}$/.test(value) ? value : newId(prefix));
  const keys = (list, allowed) => (Array.isArray(list) ? [...new Set(list.filter((key) => allowed.includes(key)))] : []);
  const cleanMeasure = (raw) => (isObject(raw) ? {
    id: idOf(raw.id, "m"), type: STOP.includes(raw.type) ? raw.type : "O", text: text(raw.text), owner: text(raw.owner, 120),
    due: isoDate(raw.due), status: STATUSES.includes(raw.status) ? raw.status : "open", checkDate: isoDate(raw.checkDate), check: CHECKS.includes(raw.check) ? raw.check : "",
  } : null);
  const cleanHazard = (raw, groups) => (isObject(raw) ? {
    id: idOf(raw.id, "h"), group: groups.includes(raw.group) ? raw.group : groups.at(-1) || "other", text: text(raw.text),
    l: level(raw.l), s: level(raw.s), l2: level(raw.l2), s2: level(raw.s2),
    measures: (Array.isArray(raw.measures) ? raw.measures : []).slice(0, 40).map(cleanMeasure).filter(Boolean),
  } : null);
  const cleanAssessment = (raw, cfg) => {
    if (!isObject(raw)) return null;
    const groups = (cfg.groups || []).map((g) => g.key);
    const months = Number(raw.reviewMonths);
    return {
      id: idOf(raw.id, "a"), area: text(raw.area, 120), activity: text(raw.activity, 200), date: isoDate(raw.date), assessor: text(raw.assessor, 160),
      exposed: keys(raw.exposed, (cfg.exposed || []).map((e) => e.key)), special: keys(raw.special, (cfg.special || []).map((e) => e.key)),
      reviewMonths: (cfg.reviewMonths || []).includes(months) ? months : 0, nextReview: isoDate(raw.nextReview), changed: raw.changed === true, note: text(raw.note, 600),
      hazards: (Array.isArray(raw.hazards) ? raw.hazards : []).slice(0, 80).map((h) => cleanHazard(h, groups)).filter(Boolean),
    };
  };
  const cleanState = (raw, cfg) => {
    const o = isObject(raw) ? raw : {};
    const ids = new Set();
    const assessments = (Array.isArray(o.assessments) ? o.assessments : []).slice(0, 200).map((a) => cleanAssessment(a, cfg)).filter(Boolean)
      .map((a) => { if (ids.has(a.id)) a.id = newId("a"); ids.add(a.id); return a; });
    const sectors = (cfg.sectors || []).map((s) => s.key);
    return {
      assessments, current: assessments.some((a) => a.id === o.current) ? o.current : assessments[0]?.id || "",
      bands: cleanBands(o.bands), sector: sectors.includes(o.sector) ? o.sector : sectors[0] || "", example: o.example === true,
    };
  };
  // The example of the data file, its dates counted from the given day: daysAgo for the assessment, dueIn and checkIn
  // for the measures, and the review date from the review interval.
  const fromExample = (example, today, cfg) => (example?.assessments || []).map((raw) => {
    const date = Number.isInteger(raw.daysAgo) ? addDays(today, -raw.daysAgo) : today;
    const a = cleanAssessment({ ...raw, id: undefined, date, hazards: (raw.hazards || []).map((h) => ({ ...h, measures: (h.measures || []).map((m) => ({ ...m, due: Number.isInteger(m.dueIn) ? addDays(today, m.dueIn) : "", checkDate: Number.isInteger(m.checkIn) ? addDays(today, m.checkIn) : "" })) })) }, cfg);
    a.nextReview = a.reviewMonths ? addMonths(date, a.reviewMonths) : "";
    return a;
  });
  // A template for another site: what is assessed and how, without the people, dates and progress of this one.
  const toTemplate = (a) => ({
    area: a.area, activity: a.activity, exposed: [...a.exposed], special: [...a.special], reviewMonths: a.reviewMonths,
    hazards: a.hazards.map((h) => ({ group: h.group, text: h.text, l: h.l, s: h.s, l2: h.l2, s2: h.s2, measures: measuresOf(h).map((m) => ({ type: m.type, text: m.text })) })),
  });
  const fromTemplate = (raw, today, cfg) => {
    if (!isObject(raw) || !Array.isArray(raw.hazards)) return null;
    const a = cleanAssessment({ ...raw, id: undefined, date: today, assessor: "", nextReview: "", changed: false, hazards: raw.hazards.map((h) => (isObject(h) ? { ...h, id: undefined, measures: (Array.isArray(h.measures) ? h.measures : []).map((m) => (isObject(m) ? { type: m.type, text: m.text } : null)) } : null)) }, cfg);
    if (!a || (!a.hazards.length && !a.area && !a.activity)) return null;
    if (!a.reviewMonths) a.reviewMonths = cfg.reviewMonths?.includes(12) ? 12 : 0;
    a.nextReview = a.reviewMonths ? addMonths(today, a.reviewMonths) : "";
    return a;
  };

  window.RiskAssessmentMath = {
    LEVELS, BANDS, DEFAULT_BANDS, STOP, STATUSES, CHECKS, ACCIDENTS, PRODUCTS, addDays, addMonths, level, risk, cleanBands, validBands, band, isHigh, bandRanges,
    measuresOf, byStop, stopCheck, residual, current, enrich, checkState, isOpenMeasure, reviewState, reviewDue, cleanEvent, readEvents, crossCheck,
    matrix, bandCounts, openMeasures, byOwner, summarize, cleanMeasure, cleanHazard, cleanAssessment, cleanState, fromExample, toTemplate, fromTemplate,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-risk-assessment]");
  const dataEl = document.getElementById("risk-assessment-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { tx, int, el, read, write, firstVisit, today, showDate, panel, stat, focusCard, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx } = kit;
  const CK = window.ChartKit;
  const Actions = window.ActionsStore || null;
  const Pack = window.TemplatePack || null;
  const Workplace = window.Workplace || null;
  const M = window.RiskAssessmentMath;
  const data = JSON.parse(dataEl.textContent);
  const sx = (() => { try { return JSON.parse(document.getElementById("risk-assessment-sx")?.textContent || "{}"); } catch { return {}; } })();
  const KEY = data.storageKey;
  const T = data.text;
  const groupOf = (key) => data.groups.find((g) => g.key === key) || data.groups.at(-1);
  const groupName = (key) => { const g = groupOf(key); return `${g.no} · ${g.name}`; };
  const bandName = (key) => (key ? data.bands[key].name : tx("not rated"));
  const stopName = (type) => `${type} · ${data.stop[type].name}`;
  const levelText = (scale, n) => (n ? `${n} · ${data[scale][n - 1][0]}` : "–");
  const riskText = (score, key) => (score === null ? tx("not rated") : `${int.format(score)} · ${bandName(key)}`);
  const BAND_STATE = { low: "ok", medium: "warn", high: "danger", "very-high": "danger" };
  const BAND_OPACITY = { low: 1, medium: 1, high: 0.72, "very-high": 1 };

  const results = document.querySelector("[data-results]");
  const printBox = document.querySelector("[data-print]");
  const form = root.querySelector("[data-header]");
  const pick = root.querySelector("[data-pick]");
  const pickNote = root.querySelector("[data-pick-note]");
  const headStatus = root.querySelector("[data-head-status]");
  const specialNotes = root.querySelector("[data-special-notes]");
  const hazardBox = root.querySelector("[data-hazards]");
  const hazardEmpty = root.querySelector("[data-hazards-empty]");
  const hazardCount = root.querySelector("[data-hazard-count]");
  const hazardStatus = root.querySelector("[data-hazard-status]");
  const add = root.querySelector("[data-add-form]");
  const addRisk = root.querySelector("[data-add-risk]");
  const exampleList = root.querySelector("#ra-examples");
  const catalogue = root.querySelector("[data-catalogue]");
  const sectorSelect = root.querySelector("[data-sector]");
  const bandForm = root.querySelector("[data-bands]");
  const bandText = [...document.querySelectorAll("[data-bands-text]")];
  const bandStatus = root.querySelector("[data-bands-status]");

  // State: the assessments, which one is open, the bands and the sector whose examples are offered.
  const state = M.cleanState(read(KEY, null), data);
  const save = () => write(KEY, state);
  const cur = () => state.assessments.find((a) => a.id === state.current) || state.assessments[0] || null;
  const loadExample = () => {
    state.assessments = M.fromExample(data.example, today(), data);
    state.current = state.assessments[0]?.id || "";
    state.example = true;
  };
  // A first visit opens on the example, so the result is visible at once; the note above it says so.
  if (!state.assessments.length && firstVisit(KEY)) loadExample();
  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearButton = el("button", "button-ghost", tx("Clear the example"));
  clearButton.type = "button";
  clearButton.addEventListener("click", () => {
    Object.assign(state, { assessments: [], current: "", example: false });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearButton);
  results.before(note);
  // The visitor's own first change ends the example: the assessments stay, the note goes.
  const own = () => { if (state.example) { state.example = false; note.hidden = true; } };

  // The Safety Cross of this language, read when the results are drawn (it may change in another tab).
  const sxEvents = () => (sx.key ? M.readEvents(read(sx.key, null)) : []);
  const sxType = (type) => sx.types?.[type] || type;

  const areaNames = () => (Workplace?.areas().length ? Workplace.areas().map((a) => a.name) : data.areas);
  const fillAreas = () => {
    const list = root.querySelector("#ra-area-list");
    list.replaceChildren(...[...new Set([...areaNames(), ...state.assessments.map((a) => a.area).filter(Boolean)])].map((name) => { const o = el("option"); o.value = name; return o; }));
    const owners = root.querySelector("#ra-owner-list");
    const people = new Set([...(Workplace?.areas() || []).map((a) => a.owner), ...state.assessments.flatMap((a) => a.hazards.flatMap((h) => h.measures.map((m) => m.owner)))].map((s) => str(s).trim()).filter(Boolean));
    owners.replaceChildren(...[...people].sort().map((name) => { const o = el("option"); o.value = name; return o; }));
  };
  const titleOf = (a) => [a.area, a.activity].filter(Boolean).join(" · ") || tx("New assessment");
  const hazardsText = (n) => (n === 1 ? tx("1 hazard") : tx("{n} hazards", { n }));
  const one = (n, single, many) => (n === 1 ? tx(single) : tx(many, { n }));

  // The header of the open assessment ---------------------------------------------------------------------------------
  const blank = () => {
    const date = today();
    const months = data.reviewMonths.includes(12) ? 12 : data.reviewMonths[0];
    return M.cleanAssessment({ date, reviewMonths: months, nextReview: M.addMonths(date, months), exposed: [data.exposed[0].key], hazards: [] }, data);
  };
  const ensure = () => {
    let a = cur();
    if (!a) {
      a = blank();
      state.assessments.push(a);
      state.current = a.id;
      renderPick();
    }
    return a;
  };
  const renderPick = () => {
    pick.replaceChildren(...state.assessments.map((a) => {
      const o = el("option", null, `${titleOf(a)} (${hazardsText(a.hazards.length)})`);
      o.value = a.id;
      return o;
    }));
    pick.value = cur()?.id || "";
    pick.disabled = !state.assessments.length;
    root.querySelector("[data-delete]").disabled = !state.assessments.length;
    pickNote.textContent = state.assessments.length === 1 ? tx("1 assessment in this browser.") : state.assessments.length ? tx("{n} assessments in this browser.", { n: state.assessments.length }) : tx("No assessment yet: type the area below, or load the example.");
  };
  const renderSpecial = (a) => {
    const ticked = data.special.filter((g) => a?.special.includes(g.key));
    specialNotes.replaceChildren(...ticked.map((g) => { const li = el("li"); li.append(el("strong", null, g.name), ` ${g.note}`); return li; }));
    specialNotes.hidden = !ticked.length;
  };
  const showHeader = () => {
    const a = cur();
    ["area", "activity", "date", "assessor", "nextReview", "note"].forEach((name) => { form.elements[name].value = a ? a[name] : ""; });
    form.elements.reviewMonths.value = a ? String(a.reviewMonths) : "12";
    form.elements.changed.checked = Boolean(a?.changed);
    form.querySelectorAll("input[name=exposed]").forEach((box) => { box.checked = Boolean(a?.exposed.includes(box.value)); });
    form.querySelectorAll("input[name=special]").forEach((box) => { box.checked = Boolean(a?.special.includes(box.value)); });
    renderSpecial(a);
  };
  form.addEventListener("input", (event) => {
    const input = event.target;
    if (!input.name) return;
    const a = ensure();
    if (input.name === "exposed" || input.name === "special") {
      a[input.name] = [...form.querySelectorAll(`input[name=${input.name}]:checked`)].map((box) => box.value);
      if (input.name === "special") renderSpecial(a);
    } else if (input.name === "changed") {
      a.changed = input.checked;
    } else if (input.name === "reviewMonths") {
      a.reviewMonths = Number(input.value) || 0;
      if (a.reviewMonths && a.date) { a.nextReview = M.addMonths(a.date, a.reviewMonths); form.elements.nextReview.value = a.nextReview; }
    } else if (input.name === "date") {
      a.date = /^\d{4}-\d{2}-\d{2}$/.test(input.value) ? input.value : "";
      if (a.reviewMonths && a.date) { a.nextReview = M.addMonths(a.date, a.reviewMonths); form.elements.nextReview.value = a.nextReview; }
    } else if (input.name === "nextReview") {
      // A date typed by hand is the team's own: the interval no longer moves it.
      a.nextReview = /^\d{4}-\d{2}-\d{2}$/.test(input.value) ? input.value : "";
      a.reviewMonths = 0;
      form.elements.reviewMonths.value = "0";
    } else if (input.name in a) {
      a[input.name] = input.value.slice(0, input.name === "note" ? 600 : 200);
    }
    own();
    save();
    if (input.name === "area" || input.name === "activity") {
      const option = pick.querySelector(`option[value="${a.id}"]`);
      if (option) option.textContent = `${titleOf(a)} (${hazardsText(a.hazards.length)})`;
    }
    renderSoon();
  });
  pick.addEventListener("change", () => { state.current = pick.value; save(); showHeader(); renderHazards(); });
  root.querySelector("[data-new]").addEventListener("click", () => {
    // A new assessment is the visitor's own work: the example makes way for it.
    if (state.example) Object.assign(state, { assessments: [], example: false });
    const a = blank();
    state.assessments.push(a);
    state.current = a.id;
    own();
    save();
    renderAll();
    form.elements.area.focus();
  });
  root.querySelector("[data-delete]").addEventListener("click", () => {
    const a = cur();
    if (!a) return;
    const index = state.assessments.indexOf(a);
    state.assessments.splice(index, 1);
    state.current = state.assessments[Math.min(index, state.assessments.length - 1)]?.id || "";
    own();
    save();
    renderAll();
    undoNote(headStatus, tx("Removed: {text}", { text: titleOf(a) }), () => {
      state.assessments.splice(Math.min(index, state.assessments.length), 0, a);
      state.current = a.id;
      save();
      renderAll();
    });
  });

  // Adding a hazard ----------------------------------------------------------------------------------------------------
  const levelOptions = (select, scale, value) => {
    const none = el("option", null, "–");
    none.value = "";
    select.replaceChildren(none, ...LEVELS.map((n) => { const o = el("option", null, levelText(scale, n)); o.value = String(n); o.title = data[scale][n - 1][1]; return o; }));
    select.value = value ? String(value) : "";
  };
  const chip = (score, key) => {
    const span = el("span", `ra-chip${key ? ` is-${key}` : ""}`, riskText(score, key));
    return span;
  };
  const fillExamples = () => {
    const group = groupOf(add.elements.group.value);
    exampleList.replaceChildren(...(group.examples[state.sector] || []).map((textValue) => { const o = el("option"); o.value = textValue; return o; }));
    root.querySelector("[data-group-factors]").textContent = `${group.factors}${group.ref ? ` (${group.ref})` : ""}`;
  };
  const renderCatalogue = () => {
    sectorSelect.value = state.sector;
    catalogue.replaceChildren(...data.groups.map((group) => {
      const box = el("div", "ra-cat-group");
      box.append(el("h3", null, `${group.no} · ${group.name}`), el("p", "ra-cat-factors", group.factors));
      const list = el("ul", "ra-cat-list");
      (group.examples[state.sector] || []).forEach((example) => {
        const li = el("li");
        const button = el("button", "ra-cat-pick", example);
        button.type = "button";
        button.addEventListener("click", () => {
          add.elements.group.value = group.key;
          add.elements.text.value = example;
          fillExamples();
          add.scrollIntoView?.({ behavior: "smooth", block: "center" });
          add.elements.l.focus({ preventScroll: true });
        });
        li.append(button);
        list.append(li);
      });
      box.append(list);
      return box;
    }));
    fillExamples();
  };
  const showAddRisk = () => {
    const score = M.risk(add.elements.l.value, add.elements.s.value);
    addRisk.replaceChildren(`${tx("Risk")}: `, chip(score, M.band(score, state.bands)));
  };
  add.addEventListener("change", (event) => {
    if (event.target.name === "group") fillExamples();
    showAddRisk();
  });
  sectorSelect.addEventListener("change", () => { state.sector = sectorSelect.value; save(); renderCatalogue(); });
  root.querySelector("[data-add-hazard]").addEventListener("click", () => {
    const textValue = add.elements.text.value.trim();
    if (!textValue) { flash(hazardStatus, tx("Describe the hazard first: what can happen, to whom, where.")); add.elements.text.focus(); return; }
    const a = ensure();
    const hazard = M.cleanHazard({ group: add.elements.group.value, text: textValue, l: add.elements.l.value, s: add.elements.s.value, measures: [] }, data.groups.map((g) => g.key));
    a.hazards.push(hazard);
    own();
    save();
    add.elements.text.value = "";
    add.elements.l.value = "";
    add.elements.s.value = "";
    showAddRisk();
    renderAll();
    flash(hazardStatus, tx("Hazard added. Now plan its measures in the STOP order."));
    hazardBox.querySelector(`[data-id="${hazard.id}"] [data-add-measure]`)?.focus();
  });

  // The hazards of the open assessment ----------------------------------------------------------------------------------
  const warnText = (h) => {
    const e = M.enrich(h, state.bands);
    const lines = [];
    if (e.stop === "only-p") lines.push(tx("Only personal protective equipment is planned for a {band} risk. The STOP order puts P last: look for substitution, a technical or an organisational measure first.", { band: kit.lower(bandName(e.band)) }));
    if (e.stop === "no-measure") lines.push(tx("No measure yet for a {band} risk. Plan one with an owner and a date, or write down why the risk is accepted.", { band: kit.lower(bandName(e.band)) }));
    if (e.higher) lines.push(tx("The residual risk is higher than the risk before the measures. Check both ratings."));
    if (e.residual !== null && M.isHigh(e.band2)) lines.push(tx("The residual risk is still {band}: the measures are not enough. Find a measure higher up the STOP order, and find out why with 5 Whys or an FMEA.", { band: kit.lower(bandName(e.band2)) }));
    if (e.risk !== null && e.band === "very-high") lines.push(data.bands["very-high"].meaning);
    return lines;
  };
  const fieldOf = (id, labelText, input, cls = "") => {
    const box = el("div", `field ra-mini ${cls}`.trim());
    const label = el("label", null, labelText);
    label.htmlFor = id;
    input.id = id;
    box.append(label, input);
    return box;
  };
  const selectOf = (pairs, value) => {
    const select = el("select");
    pairs.forEach(([key, label]) => { const o = el("option", null, label); o.value = key; select.append(o); });
    select.value = value;
    return select;
  };
  const measureRow = (a, h, m, n) => {
    const li = el("li", "ra-measure");
    li.dataset.id = m.id;
    const base = `ra-${h.id}-${m.id}`;
    const update = (name, value) => {
      m[name] = value;
      own();
      save();
      li.classList.toggle("is-done", m.status === "done");
      li.querySelector("[data-check-state]").textContent = checkLabel(m);
      refreshCard(a, h);
      renderSoon();
    };
    const type = selectOf(M.STOP.map((key) => [key, stopName(key)]), m.type);
    type.addEventListener("change", () => update("type", type.value));
    const what = el("input");
    what.type = "text";
    what.autocomplete = "off";
    what.value = m.text;
    what.placeholder = T.measurePlaceholder;
    what.addEventListener("input", () => update("text", what.value.slice(0, 300)));
    const owner = el("input");
    owner.type = "text";
    owner.autocomplete = "off";
    owner.value = m.owner;
    owner.placeholder = T.ownerPlaceholder;
    owner.setAttribute("list", "ra-owner-list");
    owner.addEventListener("input", () => update("owner", owner.value.slice(0, 120)));
    const due = el("input");
    due.type = "date";
    due.value = m.due;
    due.addEventListener("change", () => update("due", /^\d{4}-\d{2}-\d{2}$/.test(due.value) ? due.value : ""));
    const status = selectOf(M.STATUSES.map((key) => [key, data.statuses[key]]), m.status);
    status.addEventListener("change", () => update("status", status.value));
    const checkDate = el("input");
    checkDate.type = "date";
    checkDate.value = m.checkDate;
    checkDate.addEventListener("change", () => update("checkDate", /^\d{4}-\d{2}-\d{2}$/.test(checkDate.value) ? checkDate.value : ""));
    const check = selectOf(M.CHECKS.map((key) => [key, data.checks[key || "none"]]), m.check);
    check.addEventListener("change", () => update("check", check.value));
    const grid = el("div", "ra-measure-grid");
    grid.append(
      fieldOf(`${base}-type`, tx("STOP"), type, "ra-type"),
      fieldOf(`${base}-text`, tx("Measure {n}", { n }), what, "ra-what"),
      fieldOf(`${base}-owner`, tx("Owner"), owner),
      fieldOf(`${base}-due`, tx("Due date"), due),
      fieldOf(`${base}-status`, tx("Status"), status),
      fieldOf(`${base}-check-date`, tx("Effectiveness check on"), checkDate),
      fieldOf(`${base}-check`, tx("Check result"), check),
    );
    const tools = el("div", "ra-measure-tools");
    tools.append(el("span", "ra-check-state", ""));
    tools.lastChild.dataset.checkState = "";
    if (Actions) tools.append(Actions.linkButton(tx("Add to actions"), () => actionOf(a, h, m), "button-ghost ra-small"));
    const remove = el("button", "dl-remove", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", `${tx("Remove")}: ${m.text || tx("Measure {n}", { n })}`);
    remove.addEventListener("click", () => {
      const index = h.measures.indexOf(m);
      if (index < 0) return;
      h.measures.splice(index, 1);
      own();
      save();
      renderHazards();
      renderSoon();
      hazardBox.querySelector(`[data-id="${h.id}"] [data-add-measure]`)?.focus();
      undoNote(hazardStatus, tx("Removed: {text}", { text: m.text || tx("Measure {n}", { n }) }), () => {
        h.measures.splice(Math.min(index, h.measures.length), 0, m);
        save();
        renderHazards();
        renderSoon();
      });
    });
    tools.append(remove);
    li.append(grid, tools);
    li.classList.toggle("is-done", m.status === "done");
    li.querySelector("[data-check-state]").textContent = checkLabel(m);
    return li;
  };
  const checkLabel = (m) => {
    const c = M.checkState(m, today());
    if (c === "check-pending") return m.checkDate ? tx("Check due on {date}", { date: showDate(m.checkDate) }) : tx("Effect not checked yet");
    if (c === "check-overdue") return tx("Check overdue since {date}", { date: showDate(m.checkDate) });
    if (c) return `${tx("Checked")}: ${data.checks[c]}`;
    return m.due && m.due < today() ? tx("Overdue since {date}", { date: showDate(m.due) }) : "";
  };
  const refreshCard = (a, h) => {
    const card = hazardBox.querySelector(`[data-id="${h.id}"]`);
    if (!card) return;
    const e = M.enrich(h, state.bands);
    card.querySelector("[data-risk]").replaceChildren(chip(e.risk, e.band));
    card.querySelector("[data-risk2]").replaceChildren(chip(e.residual, e.band2));
    const warn = card.querySelector("[data-warn]");
    const lines = warnText(h);
    warn.replaceChildren(...lines.map((line) => el("p", "dl-warning", line)));
    warn.hidden = !lines.length;
    const count = M.measuresOf(h).length;
    card.querySelector("[data-measure-count]").textContent = count === 1 ? tx("1 measure") : tx("{n} measures", { n: count });
  };
  const hazardCard = (a, h, n) => {
    const card = el("article", "ra-hazard");
    card.dataset.id = h.id;
    const base = `ra-${h.id}`;
    const change = (name, value) => {
      h[name] = value;
      own();
      save();
      refreshCard(a, h);
      renderSoon();
    };
    const head = el("div", "ra-hazard-head");
    head.append(el("span", "ra-no", String(n)));
    const group = selectOf(data.groups.map((g) => [g.key, `${g.no} · ${g.name}`]), h.group);
    group.addEventListener("change", () => change("group", group.value));
    const what = el("input");
    what.type = "text";
    what.autocomplete = "off";
    what.value = h.text;
    what.setAttribute("list", "ra-examples");
    what.addEventListener("input", () => change("text", what.value.slice(0, 300)));
    const fields = el("div", "ra-hazard-fields");
    fields.append(fieldOf(`${base}-group`, tx("Hazard factor"), group), fieldOf(`${base}-text`, tx("Hazard {n}", { n }), what, "ra-what"));
    const remove = el("button", "dl-remove", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", `${tx("Remove")}: ${h.text || tx("Hazard {n}", { n })}`);
    remove.addEventListener("click", () => {
      const index = a.hazards.indexOf(h);
      if (index < 0) return;
      a.hazards.splice(index, 1);
      own();
      save();
      renderAll();
      undoNote(hazardStatus, tx("Removed: {text}", { text: h.text || tx("Hazard {n}", { n }) }), () => {
        a.hazards.splice(Math.min(index, a.hazards.length), 0, h);
        save();
        renderAll();
      });
    });
    head.append(fields, remove);

    const rating = (prefix, lName, sName, hook, title) => {
      const box = el("div", "ra-rating");
      box.append(el("p", "ra-sub", title));
      const row = el("div", "ra-rating-row");
      const l = el("select");
      levelOptions(l, "likelihood", h[lName]);
      l.addEventListener("change", () => change(lName, M.level(l.value)));
      const s = el("select");
      levelOptions(s, "severity", h[sName]);
      s.addEventListener("change", () => change(sName, M.level(s.value)));
      const out = el("p", "ra-risk-out");
      out.setAttribute("aria-live", "polite");
      out.dataset[hook] = "";
      row.append(fieldOf(`${base}-${prefix}-l`, tx("Likelihood"), l), el("span", "ra-times", "×"), fieldOf(`${base}-${prefix}-s`, tx("Severity of harm"), s), out);
      box.append(row);
      return box;
    };
    const measures = el("div", "ra-measures");
    const mHead = el("div", "ra-measures-head");
    mHead.append(el("p", "ra-sub", tx("Measures in the STOP order")), el("span", "form-note", ""));
    mHead.lastChild.dataset.measureCount = "";
    const list = el("ol", "ra-measure-list");
    [...h.measures].sort(M.byStop).forEach((m, i) => list.append(measureRow(a, h, m, i + 1)));
    const addMeasure = el("button", "button-secondary ra-small", tx("+ Add a measure"));
    addMeasure.type = "button";
    addMeasure.dataset.addMeasure = "";
    addMeasure.addEventListener("click", () => {
      // The next letter of STOP that the hazard has not used yet, so the order suggests itself.
      const used = new Set(h.measures.map((m) => m.type));
      const m = M.cleanMeasure({ type: M.STOP.find((key) => !used.has(key)) || "O", status: "open" });
      h.measures.push(m);
      own();
      save();
      renderHazards();
      hazardBox.querySelector(`[data-id="${h.id}"] [data-id="${m.id}"] input[type=text]`)?.focus();
    });
    measures.append(mHead, list, addMeasure);
    const warn = el("div", "ra-warn");
    warn.dataset.warn = "";
    warn.setAttribute("aria-live", "polite");
    card.append(head, rating("before", "l", "s", "risk", tx("Risk before the measures")), measures, rating("after", "l2", "s2", "risk2", tx("Residual risk after the measures")), warn);
    return card;
  };
  const renderHazards = () => {
    const a = cur();
    const list = a ? a.hazards : [];
    hazardBox.replaceChildren(...list.map((h, i) => hazardCard(a, h, i + 1)));
    list.forEach((h) => refreshCard(a, h));
    hazardEmpty.hidden = list.length > 0;
    hazardCount.textContent = a ? `${titleOf(a)}: ${hazardsText(list.length)}` : "";
    fillAreas();
  };

  // Bands ----------------------------------------------------------------------------------------------------------------
  const rangesText = () => M.bandRanges(state.bands).map((r) => `${bandName(r.key)} ${r.from === null ? "–" : r.from === r.to ? r.from : `${r.from}–${r.to}`}`).join(" · ");
  const showBands = () => {
    ["low", "medium", "high"].forEach((key) => { bandForm.elements[key].value = String(state.bands[key]); });
    bandText.forEach((node) => { node.textContent = rangesText(); });
  };
  bandForm.addEventListener("change", () => {
    const next = { low: bandForm.elements.low.value, medium: bandForm.elements.medium.value, high: bandForm.elements.high.value };
    if (!M.validBands(next)) { flash(bandStatus, tx("The limits must rise: low below medium below high, and high below 25.")); showBands(); return; }
    state.bands = M.cleanBands(next);
    own();
    save();
    showBands();
    renderHazards();
    renderResults();
    flash(bandStatus, tx("Bands changed: {text}", { text: rangesText() }));
  });
  root.querySelector("[data-bands-reset]").addEventListener("click", () => {
    state.bands = { ...M.DEFAULT_BANDS };
    save();
    showBands();
    renderHazards();
    renderResults();
    flash(bandStatus, tx("Bands changed: {text}", { text: rangesText() }));
  });

  // Hand-offs ----------------------------------------------------------------------------------------------------------
  const priorityOf = (key) => (M.isHigh(key) ? "High" : key === "medium" ? "Medium" : "Low");
  const actionOf = (a, h, m) => {
    const e = M.enrich(h, state.bands);
    return {
      title: m.text.trim(), owner: m.owner, due: m.due, example: state.example === true, source: "risk-assessment", area: a.area, priority: priorityOf(e.band),
      detail: [titleOf(a), h.text, `${stopName(m.type)}`, `${tx("Risk")} ${riskText(e.risk, e.band)}${e.residual !== null ? ` → ${riskText(e.residual, e.band2)}` : ""}`].filter(Boolean).join(" · "),
      check: tx("Effectiveness check: does the measure work at the workplace? Record the result in the risk assessment and rate the residual risk again."),
    };
  };
  const addAllActions = (host) => {
    if (!Actions) return;
    const button = el("button", "button-secondary", tx("Add open measures to the Action Tracker"));
    button.type = "button";
    const out = el("p", "form-note ra-actions-status");
    out.setAttribute("role", "status");
    button.addEventListener("click", () => {
      // A measure already open on the tracker goes over once.
      const known = new Set(Actions.list().filter((x) => Actions.isOpen(x) && x.source === "risk-assessment").map((x) => x.title));
      const added = [];
      state.assessments.forEach((a) => a.hazards.forEach((h) => M.measuresOf(h).filter(M.isOpenMeasure).forEach((m) => {
        const action = actionOf(a, h, m);
        if (known.has(action.title)) return;
        known.add(action.title);
        if (Actions.add(action)) added.push(action);
      })));
      const link = el("a", "inline-link", tx("Open the Action Tracker"));
      link.href = Actions.trackerUrl().href;
      out.replaceChildren(added.length ? tx("Added {n} actions.", { n: added.length }) : tx("Every open measure is already on the Action Tracker."), " ", link);
    });
    host.append(button, out);
  };

  // Exports ------------------------------------------------------------------------------------------------------------
  const sheetRows = () => {
    const head = [tx("Area"), tx("Activity"), tx("Date"), tx("Assessor"), tx("Next review"), tx("Hazard factor"), tx("Hazard"), tx("Likelihood"), tx("Severity of harm"), tx("Risk"), tx("Risk band"),
      tx("STOP"), tx("Measure"), tx("Owner"), tx("Due date"), tx("Status"), tx("Effectiveness check on"), tx("Check result"), tx("Likelihood after"), tx("Severity after"), tx("Residual risk"), tx("Residual band")];
    const rows = [head];
    state.assessments.forEach((a) => a.hazards.forEach((h) => {
      const e = M.enrich(h, state.bands);
      const start = [a.area, a.activity, a.date, a.assessor, a.nextReview, groupName(h.group), h.text, h.l ?? "", h.s ?? "", e.risk ?? "", e.band ? bandName(e.band) : ""];
      const end = [h.l2 ?? "", h.s2 ?? "", e.residual ?? "", e.band2 ? bandName(e.band2) : ""];
      const list = [...M.measuresOf(h)].sort(M.byStop);
      if (!list.length) rows.push([...start, "", "", "", "", "", "", "", ...end]);
      list.forEach((m) => rows.push([...start, m.type, m.text, m.owner, m.due, data.statuses[m.status], m.checkDate, data.checks[m.check || "none"], ...end]));
    }));
    return rows;
  };
  const siteName = () => Workplace?.get().site || "";
  const summaryText = (sum) => {
    const day = today();
    const counts = (c) => M.BANDS.slice().reverse().map((key) => `${bandName(key)} ${c[key]}`).join(" · ");
    const lines = [
      `${T.tool}${siteName() ? ` · ${siteName()}` : ""} · ${showDate(day)}`,
      tx("{a} assessments · {h} hazards", { a: sum.assessments, h: sum.hazards }),
      `${tx("Bands")} (${tx("likelihood × severity, 5 × 5")}): ${rangesText()}`,
      "",
      `${tx("Before measures")}: ${counts(sum.before)}`,
      `${tx("After measures")}: ${counts(sum.after)}`,
      `${tx("Open measures")}: ${sum.open}${sum.overdue ? ` (${tx("{n} overdue", { n: sum.overdue })})` : ""} · ${tx("Effectiveness checks open")}: ${sum.checksPending + sum.checksOverdue}`,
    ];
    if (sum.onlyP) lines.push(`${tx("STOP order")}: ${one(sum.onlyP, "1 high risk with only personal protective equipment planned", "{n} high risks with only personal protective equipment planned")}`);
    const due = sum.reviews.filter(M.reviewDue);
    if (due.length) lines.push(`${tx("Reviews due")}: ${due.map((r) => `${titleOf(r.assessment)} (${reviewText(r)})`).join("; ")}`);
    lines.push("", `${tx("Highest risks")}:`);
    sum.ranked.slice(0, 5).forEach((h, i) => {
      lines.push(`${i + 1}. ${h.assessment.area || titleOf(h.assessment)}: ${h.text} · ${riskText(h.risk, h.band)}${h.residual !== null ? ` → ${riskText(h.residual, h.band2)}` : ""}`);
      M.measuresOf(h).sort(M.byStop).forEach((m) => lines.push(`   ${m.type}: ${m.text}${m.owner ? ` (${m.owner}${m.due ? `, ${showDate(m.due)}` : ""})` : ""} · ${data.statuses[m.status]}`));
    });
    lines.push("", T.legalShort);
    return lines.join("\n");
  };

  // Results ------------------------------------------------------------------------------------------------------------
  const table = (heads, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const tbl = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    heads.forEach(([label, cls]) => { const th = el("th", cls, label); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach(([value, cls]) => { const td = el("td", cls); td.append(value); tr.append(td); });
      tbody.append(tr);
    });
    tbl.append(thead, tbody);
    wrap.append(tbl);
    return wrap;
  };
  const reviewText = (r) => ({
    // The first event since the assessment: the review has been due from then.
    event: () => tx("review now: {type} on {date} (Safety Cross)", { type: sxType(r.events[0].type), date: showDate(r.events[0].date) }),
    change: () => tx("review now: something has changed"),
    overdue: () => tx("overdue since {date}", { date: showDate(r.next) }),
    soon: () => (r.days === 0 ? tx("due today") : tx("due in {n} days", { n: r.days })),
    ok: () => tx("next on {date}", { date: showDate(r.next) }),
    none: () => tx("no review date set"),
  }[r.state])();
  const REVIEW_CLASS = { event: "is-due", change: "is-due", overdue: "is-due", soon: "is-soon", ok: "is-ok", none: "is-soon" };
  const openAssessment = (id) => {
    state.current = id;
    save();
    showHeader();
    renderPick();
    renderHazards();
    form.scrollIntoView?.({ behavior: "smooth", block: "start" });
    form.elements.area.focus({ preventScroll: true });
  };
  const openButton = (id, label) => {
    const button = el("button", "button-ghost ra-small", label);
    button.type = "button";
    button.addEventListener("click", () => openAssessment(id));
    return button;
  };
  const heat = (hazards, which, title) => {
    const cells = M.matrix(hazards, which);
    const ls = [5, 4, 3, 2, 1], ss = [1, 2, 3, 4, 5];
    // Short column heads (S 1 … S 5): long rotated names would run into the rows; the caption names the levels.
    const svg = CK.heatmap(ls.map((n) => `L ${n} · ${data.likelihood[n - 1][0]}`), ss.map((n) => `S ${n}`), (r, c) => {
      const l = ls[r], s = ss[c], score = l * s, key = M.band(score, state.bands);
      const list = cells[`${l}-${s}`] || [];
      const tip = `${tx("Likelihood")} ${l} × ${tx("Severity of harm")} ${s} = ${score} · ${bandName(key)}${list.length ? `\n${list.map((h) => `${h.assessment.area || "–"}: ${h.text}`).join("\n")}` : ""}`;
      return list.length
        ? { text: String(list.length), state: BAND_STATE[key], opacity: BAND_OPACITY[key], tip }
        : { text: "", state: BAND_STATE[key], opacity: 0.13, tip };
    }, { title: `${T.tool}: ${title}`, cellSize: 46, labelWidth: 150 });
    return svg;
  };
  const legend = () => {
    const list = CK.legend(M.bandRanges(state.bands).map((r) => ({ label: `${bandName(r.key)} ${r.from === null ? "–" : r.from === r.to ? r.from : `${r.from}–${r.to}`}`, state: BAND_STATE[r.key] })));
    list.querySelectorAll(".ck-swatch").forEach((swatch, i) => { swatch.style.opacity = String(BAND_OPACITY[M.BANDS[i]]); });
    return list;
  };

  const renderResults = () => {
    results.replaceChildren();
    const hazardsTotal = state.assessments.reduce((n, a) => n + a.hazards.length, 0);
    results.hidden = !hazardsTotal;
    renderPrint();
    if (!hazardsTotal) return;
    const day = today();
    const events = sxEvents();
    const sum = M.summarize(state.assessments, day, state.bands, events);

    const head = el("div", "result-head");
    head.append(el("p", "result-label", `${T.tool}${siteName() ? ` · ${siteName()}` : ""}`));
    const h2 = el("h2");
    h2.append(el("span", null, int.format(sum.highBefore)), ` ${tx("high or very high risks")} → ${int.format(sum.highAfter)} ${tx("after the measures")}`);
    head.append(h2);
    head.append(el("p", "ra-meta", `${tx("{a} assessments · {h} hazards", { a: sum.assessments, h: sum.hazards })} · ${rangesText()}`));
    head.append(el("p", null, !sum.rated ? tx("Rate likelihood and severity of a hazard to see its risk.")
      : sum.highAfter ? tx("Some risks stay high after the measures. They need better measures, higher up the STOP order, before the work goes on as usual.")
        : sum.highBefore ? tx("The measures bring every high risk down. Put the open ones in place, then check that they work.")
          : tx("No high risk. Keep the measures in place and review the assessment on its date or after any change.")));

    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Assessments"), int.format(sum.assessments), sum.reviewsDue ? tx("{n} due for review", { n: sum.reviewsDue }) : tx("none due for review")),
      stat(tx("Hazards"), int.format(sum.hazards), sum.rated < sum.hazards ? tx("{n} not rated yet", { n: sum.hazards - sum.rated }) : tx("all rated")),
      stat(tx("High or very high"), `${int.format(sum.highBefore)} → ${int.format(sum.highAfter)}`, tx("before → after the measures")),
      stat(tx("Open measures"), int.format(sum.open), sum.overdue ? tx("{n} overdue", { n: sum.overdue }) : tx("none overdue")),
      stat(tx("Effectiveness checks open"), int.format(sum.checksPending + sum.checksOverdue), sum.checksOverdue ? tx("{n} overdue", { n: sum.checksOverdue }) : sum.partly + sum.notEffective ? one(sum.partly + sum.notEffective, "1 measure only partly or not effective", "{n} measures only partly or not effective") : ""),
      stat(tx("STOP order"), int.format(sum.onlyP + sum.noMeasure), sum.onlyP ? one(sum.onlyP, "1 high risk with PPE only", "{n} high risks with PPE only") : sum.noMeasure ? one(sum.noMeasure, "1 risk without a measure", "{n} risks without a measure") : tx("no warning")),
    );

    const notes = [];
    sum.stopWarnings.forEach((h) => {
      const p = el("p", "dl-warning");
      p.append(el("strong", null, `${h.assessment.area || titleOf(h.assessment)}: ${h.text}. `), h.stop === "only-p"
        ? tx("Only personal protective equipment is planned for a {band} risk. The STOP order puts P last: look for substitution, a technical or an organisational measure first.", { band: kit.lower(bandName(h.band)) })
        : tx("No measure yet for a {band} risk. Plan one with an owner and a date, or write down why the risk is accepted.", { band: kit.lower(bandName(h.band)) }));
      notes.push(p);
    });

    const top = sum.top;
    const highRes = sum.highResidual[0] || null;
    const focus = top ? focusCard({
      title: top.text || "–",
      detail: titleOf(top.assessment),
      lede: `${groupName(top.group)} · ${tx("Risk")} ${top.l ?? "–"} × ${top.s ?? "–"} = ${riskText(top.risk, top.band)}${top.residual !== null ? ` → ${tx("residual")} ${top.l2} × ${top.s2} = ${riskText(top.residual, top.band2)}` : ` · ${tx("residual risk not rated yet")}`}`,
      advice: data.bands[top.bandNow],
      extraLabel: tx("Measures in the STOP order"),
      extra: M.measuresOf(top).length ? M.measuresOf(top).sort(M.byStop).map((m) => `${m.type}: ${m.text}${m.owner ? ` (${m.owner}${m.due ? `, ${showDate(m.due)}` : ""})` : ""} · ${data.statuses[m.status]}`).join(" · ") : tx("No measure yet. Agree one with an owner and a date."),
      warning: top.stop ? warnText(top)[0] : "",
    }) : null;

    // A high residual risk goes on to 5 Whys (why is the hazard there at all?) and to the FMEA of the process.
    const problem = highRes ? `${highRes.text} (${titleOf(highRes.assessment)})` : top ? `${top.text} (${titleOf(top.assessment)})` : "";
    const actions = resultActions(() => summaryText(sum), problem);
    if (highRes) {
      const fmea = el("a", "button-secondary", tx("Analyse it in FMEA"));
      fmea.href = document.querySelector("a[data-fmea]")?.href || new URL("../fmea/", window.location.href).href;
      actions.append(fmea);
    }
    addAllActions(actions);

    const panels = [];
    if (CK) {
      const all = state.assessments.flatMap((a) => a.hazards.map((h) => ({ ...h, assessment: a })));
      const before = panel(tx("Risk matrix before the measures"), tx("Each coloured cell counts the hazards with that likelihood and severity; the faint cells show the band of the score. Point at a cell to see its hazards."));
      const caption = `L = ${tx("Likelihood")} · S = ${tx("Severity of harm")}: ${data.severity.map((item, i) => `${i + 1} ${item[0]}`).join(" · ")}`;
      before.append(CK.figure(heat(all, "before", tx("Risk matrix before the measures")), { fileName: `${T.csv}-matrix-before`, caption }), legend());
      const after = panel(tx("Risk matrix after the measures"), tx("The residual risks. A hazard not rated again stays at its first rating."));
      after.append(CK.figure(heat(all, "after", tx("Risk matrix after the measures")), { fileName: `${T.csv}-matrix-after`, caption }), legend());
      panels.push(before, after);
    }

    const bandsPanel = panel(tx("Risks per band"), tx("Hazards per band before and after the measures, with what each band asks for."));
    bandsPanel.append(table([[tx("Band")], [tx("Scores"), "num"], [tx("Before"), "num"], [tx("After"), "num"], [tx("What it asks for")]], M.bandRanges(state.bands).slice().reverse().map((r) => {
      const name = el("span", `ra-chip is-${r.key}`, bandName(r.key));
      return [[name], [r.from === null ? "–" : r.from === r.to ? String(r.from) : `${r.from}–${r.to}`, "num"], [int.format(sum.before[r.key]), "num"], [int.format(sum.after[r.key]), "num"], [data.bands[r.key].meaning]];
    }), "ra-band-table"));
    panels.push(bandsPanel);

    const open = M.openMeasures(state.assessments, day);
    if (open.length) {
      const owners = panel(tx("Open measures by owner"), tx("Who holds which measures, the overdue ones first."));
      owners.append(kit.barList(M.byOwner(open).map((o) => ({ key: o.owner || tx("No owner yet"), value: o.open, overdue: o.overdue, next: o.next })), {
        label: (item) => [int.format(item.value), `${item.overdue ? ` · ${tx("{n} overdue", { n: item.overdue })}` : ""}${item.next ? ` · ${tx("next due {date}", { date: showDate(item.next) })}` : ""}`],
        highlight: (item) => item.overdue > 0,
      }));
      panels.push(owners);
      const list = panel(tx("Open measures by due date"), tx("Every measure not done yet. Hand them to the Action Tracker one by one or all at once."));
      list.classList.add("ra-wide");
      const findA = (id) => state.assessments.find((a) => a.id === id);
      list.append(table([[tx("Due date")], [tx("Measure")], [tx("Owner")], [tx("Area")], [tx("Risk"), "num"], [""]], open.map((m) => {
        const a = findA(m.assessmentId);
        const h = a.hazards.find((x) => x.id === m.hazardId);
        const due = el("span", m.overdue ? "ra-late" : null, m.due ? `${showDate(m.due)}${m.overdue ? ` · ${tx("overdue")}` : ""}` : "–");
        const what = el("span");
        what.append(el("strong", null, `${m.type} `), m.text, el("span", "ra-cell-note", h.text));
        const link = Actions ? Actions.linkButton(tx("Add to actions"), () => actionOf(a, h, h.measures.find((x) => x.id === m.id) || m), "button-ghost ra-small") : el("span");
        return [[due], [what], [m.owner || "–"], [a.area || "–"], [m.risk === null ? "–" : int.format(m.risk), "num"], [link]];
      }), "ra-open-table"));
      panels.push(list);
    }

    const reviews = panel(tx("Reviews"), T.reviewNote);
    reviews.classList.add("ra-wide");
    const order = { event: 0, change: 1, overdue: 2, none: 3, soon: 4, ok: 5 };
    reviews.append(table([[tx("Assessment")], [tx("Assessed on")], [tx("Next review")], [tx("Status")], [""]], sum.reviews.slice().sort((a, b) => order[a.state] - order[b.state] || (a.next || "").localeCompare(b.next || "")).map((r) => [
      [titleOf(r.assessment)], [r.assessment.date ? showDate(r.assessment.date) : "–"], [r.next ? showDate(r.next) : "–"],
      [el("span", `ra-review ${REVIEW_CLASS[r.state]}`, kit.capital(reviewText(r)))], [openButton(r.assessment.id, tx("Edit"))],
    ]), "ra-review-table"));
    panels.push(reviews);

    // The Safety Cross of this browser, set against the assessments.
    const from = M.addDays(day, -365);
    const cross = M.crossCheck(state.assessments, events, { causeGroups: data.causeGroups, from, to: day });
    const sxPanel = panel(tx("Safety Cross against the assessments"), cross.length ? tx("Safety events of the last 12 months per area, from the Safety Cross in this browser. An area with events but no assessment, or a cause none of its hazards covers, is flagged.") : tx("The Safety Cross in this browser has no events of the last 12 months with an area. Log them there and this check sets them against the assessed hazards."));
    sxPanel.classList.add("ra-cross");
    if (cross.length) {
      sxPanel.append(table([[tx("Area")], [tx("Events"), "num"], [tx("Injuries"), "num"], [tx("Causes")], [tx("Check")]], cross.map((row) => {
        const verdict = el("span", `ra-review ${row.flag ? "is-due" : "is-ok"}`, row.flag === "no-assessment" ? `⚠ ${tx("No assessment for this area")}` : row.flag === "not-covered"
          ? `⚠ ${tx("Not covered: {causes}", { causes: row.uncovered.map((u) => `${u.cause} (${u.n})`).join(", ") })}` : `✓ ${tx("Covered by the assessment")}`);
        return [[row.area], [int.format(row.events), "num"], [int.format(row.accidents), "num"], [row.causes.map((c) => `${c.cause || "–"} (${c.n})`).join(", ")], [verdict]];
      }), "ra-cross-table"));
    }
    const sxLink = el("a", "inline-link", tx("Open the Safety Cross"));
    sxLink.href = document.querySelector("a[data-safety-cross-link]")?.href || new URL("../safety-cross/", window.location.href).href;
    const p = el("p", "form-note");
    p.append(sxLink);
    sxPanel.append(p);
    panels.push(sxPanel);

    const overview = panel(tx("All hazards"), tx("The highest risk now first: the residual risk where it is rated, else the risk before."));
    overview.classList.add("ra-wide");
    overview.append(table([[tx("Area")], [tx("Hazard")], [tx("Risk"), "num"], [tx("STOP")], [tx("Residual risk"), "num"]], sum.ranked.map((h) => [
      [h.assessment.area || "–"], [h.text], [chip(h.risk, h.band), "num"], [M.measuresOf(h).sort(M.byStop).map((m) => m.type).join(" ") || "–"], [chip(h.residual, h.band2), "num"],
    ]), "ra-all-table"));
    panels.push(overview);

    resultLayout(results, { head, stats, notes, focus, actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => state.assessments.reduce((n, a) => n + a.hazards.length, 0), 60);

  // Print: the documentation, one A4 landscape page (or more) per assessment, with the signature lines --------------------
  const renderPrint = () => {
    printBox.replaceChildren();
    const day = today();
    const events = sxEvents();
    state.assessments.forEach((a) => {
      const page = el("article", "ra-print-page");
      page.append(el("p", "kicker", `${T.tool}${siteName() ? ` · ${siteName()}` : ""}`), el("h2", null, titleOf(a)));
      const review = M.reviewState(a, day, { events });
      const meta = el("dl", "ra-print-meta");
      [[tx("Date"), a.date ? showDate(a.date) : "–"], [tx("Assessor"), a.assessor || "–"],
        [tx("Who is exposed"), data.exposed.filter((e) => a.exposed.includes(e.key)).map((e) => e.name).join(", ") || "–"],
        [tx("Special groups"), data.special.filter((e) => a.special.includes(e.key)).map((e) => e.name).join(", ") || "–"],
        [tx("Next review"), `${a.nextReview ? showDate(a.nextReview) : "–"} (${reviewText(review)})`]].forEach(([k, v]) => meta.append(el("dt", null, k), el("dd", null, v)));
      page.append(meta);
      const tbl = el("table", "ra-print-table");
      const head = el("tr");
      ["#", tx("Hazard factor"), tx("Hazard"), "L", "S", tx("Risk"), tx("Measures in the STOP order"), tx("Owner"), tx("Due date"), tx("Status"), tx("Effectiveness check"), "L", "S", tx("Residual risk")]
        .forEach((label) => { const th = el("th", null, label); th.scope = "col"; head.append(th); });
      const thead = el("thead");
      thead.append(head);
      const tbody = el("tbody");
      a.hazards.forEach((h, i) => {
        const e = M.enrich(h, state.bands);
        const list = [...M.measuresOf(h)].sort(M.byStop);
        const rows = Math.max(1, list.length);
        for (let r = 0; r < rows; r++) {
          const tr = el("tr");
          if (r === 0) {
            [[String(i + 1)], [groupName(h.group)], [h.text], [h.l ?? "–", "num"], [h.s ?? "–", "num"], [riskText(e.risk, e.band), "ra-tight"]].forEach(([v, cls]) => { const td = el("td", cls, String(v)); td.rowSpan = rows; tr.append(td); });
          }
          const m = list[r];
          if (m) {
            const c = M.checkState(m, day);
            [[`${m.type} · ${m.text}`], [m.owner || "–"], [m.due ? showDate(m.due) : "–", "ra-tight"], [data.statuses[m.status], "ra-tight"], [[m.checkDate ? showDate(m.checkDate) : "", c && !c.startsWith("check-") ? data.checks[c] : ""].filter(Boolean).join(" · ") || "–"]].forEach(([v, cls]) => tr.append(el("td", cls, v)));
          } else {
            const td = el("td", null, tx("No measure yet"));
            td.colSpan = 5;
            tr.append(td);
          }
          if (r === 0) {
            [[h.l2 ?? "–", "num"], [h.s2 ?? "–", "num"], [riskText(e.residual, e.band2), "ra-tight"]].forEach(([v, cls]) => { const td = el("td", cls, String(v)); td.rowSpan = rows; tr.append(td); });
          }
          tbody.append(tr);
        }
      });
      tbl.append(thead, tbody);
      page.append(tbl);
      if (a.note) page.append(el("p", "ra-print-note", `${tx("Note")}: ${a.note}`));
      page.append(el("p", "ra-print-foot", `${tx("Risk = likelihood × severity (1–5 each).")} ${tx("Bands")}: ${rangesText()}. ${tx("STOP: S substitution, T technical, O organisational, P personal (PPE) — P comes last.")} ${T.legalShort}`));
      const signs = el("div", "ra-print-sign");
      data.signatures.forEach((label) => {
        const box = el("div", "ra-sign");
        box.append(el("span", "ra-sign-line", ""), el("span", null, `${label} · ${tx("Date")} · ${tx("Signature")}`));
        signs.append(box);
      });
      page.append(signs);
      printBox.append(page);
    });
    printBox.classList.toggle("is-ready", state.assessments.some((a) => a.hazards.length));
  };
  window.addEventListener("beforeprint", renderPrint);

  const renderAll = () => {
    note.hidden = !state.example;
    renderPick();
    showHeader();
    renderHazards();
    showBands();
    showAddRisk();
    renderResults();
  };

  // Files ----------------------------------------------------------------------------------------------------------------
  const fileName = () => T.csv;
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.assessments.length) downloadCsv(fileName(), sheetRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.assessments.length) downloadXlsx(fileName(), sheetRows(), { sheet: T.tool.slice(0, 31), title: T.tool }); });
  root.querySelector("[data-print-doc]").addEventListener("click", () => { renderPrint(); window.print(); });
  root.querySelector("[data-example]").addEventListener("click", () => {
    if (state.assessments.length && !state.example && !window.confirm(tx("Replace the assessments in this browser with the example?"))) return;
    loadExample();
    save();
    renderAll();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.assessments.length || !window.confirm(tx("Clear every assessment in this browser?"))) return;
    Object.assign(state, { assessments: [], current: "", example: false });
    save();
    renderAll();
  });
  // The open assessment as a template file (js/template-pack.js): another site opens it here as a new assessment of its
  // own, with today's date and the measures to be planned again.
  if (Pack) {
    Pack.ui(root.querySelector("[data-pack]"), {
      tool: "risk-assessment", kind: "risk-assessment",
      name: () => (cur() ? titleOf(cur()) : ""),
      data: () => (cur() && (cur().hazards.length || cur().area) ? M.toTemplate(cur()) : null),
      validate: (raw) => M.fromTemplate(raw, today(), data),
      onOpen: (result) => {
        if (state.example) Object.assign(state, { assessments: [], example: false });
        const a = result.data;
        state.assessments.push(a);
        state.current = a.id;
        own();
        save();
        renderAll();
        return tx("Opened as a new assessment: {name}. Add the owners and dates of this site.", { name: titleOf(a) });
      },
    });
  } else {
    root.querySelector("[data-pack]").hidden = true;
  }

  // Enter in a field never reloads the page; in the hazard form it adds the hazard.
  [form, bandForm].forEach((node) => node.addEventListener("submit", (event) => event.preventDefault()));
  add.addEventListener("submit", (event) => { event.preventDefault(); root.querySelector("[data-add-hazard]").click(); });
  if (Workplace) window.addEventListener("workplace:changed", fillAreas);
  levelOptions(add.elements.l, "likelihood", null);
  levelOptions(add.elements.s, "severity", null);
  renderCatalogue();
  renderAll();
})();
