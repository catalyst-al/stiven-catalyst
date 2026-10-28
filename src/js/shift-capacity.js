// Shift Capacity: how many people each process needs per shift for the forecast volume, against the people planned,
// before the shift starts. Each process has its driver (units, lines, orders, parcels, pallets), its engineered labour
// standard in units per productive hour (UPH) and, when the forecast comes in another unit, a conversion (2.4 lines
// per order). The shift gives the productive hours per person; the forecast gives the volume per day and shift. Out
// come the labour hours, the heads, the heads incl. absence, the gap against the plan in heads and in hours, the ways
// to close it (moves of qualified people, overtime, agency), the capacity of the planned team and its bottleneck, and
// the takt. The arithmetic lives in window.ShiftCapacityMath, so tests can call it.
(() => {
  const kit = window.ToolKit || {};
  const parseNumber = kit.parseNumber || ((value) => Number(String(value ?? "").replace(",", ".")));
  const parseDate = kit.parseDate || ((value) => (/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? "").trim()) ? String(value).trim() : ""));
  const parseRows = kit.parseRows || ((text) => String(text ?? "").split(/\r?\n/).filter(Boolean).map((line) => line.split(/\t|;|,/).map((cell) => cell.trim())));
  const EPS = 1e-9;
  // Level 3 in the Skills Matrix: the person does the task alone, to the standard, on any shift.
  const COVER_AT = 3;
  const MODES = ["rostered", "confirmed"];
  const isNum = (value) => typeof value === "number" && Number.isFinite(value);
  const isObj = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const text = (value) => (typeof value === "string" ? value : "");
  // Whole people: 3.0000000001 heads (a sum of decimals) is 3, not 4.
  const up = (value) => Math.ceil(value - EPS);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const mondayOf = (iso) => addDays(iso, -((new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7));
  // The week a planner works on: the coming Monday to Sunday (this week on a Monday).
  const weekStart = (today) => mondayOf(addDays(today, 6));
  // A forecast unit is the same unit however it is typed: "Orders " and "orders" are one column.
  const unitKey = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  // Names compared across tools: case, accents, spaces and dashes do not count ("Put-away" is "putaway").
  const fold = (value) => String(value ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

  // Arithmetic -------------------------------------------------------------------------------------------------------
  // Net working time of a shift = length − unpaid breaks − paid breaks, briefing and clean-up (hours; breaks in minutes).
  const netHours = (shift) => Math.max(0, (Number(shift?.length) || 0) - (Number(shift?.unpaid) || 0) / 60 - (Number(shift?.paid) || 0) / 60);
  // Productive hours per person = (length − unpaid breaks − paid non-productive time) × utilisation.
  const productiveHours = (shift, utilisation) => netHours(shift) * Math.max(0, Math.min(1, Number(utilisation) || 0));
  // Labour hours = volume ÷ units per productive hour.
  const hoursNeeded = (volume, uph) => (uph > 0 && volume > 0 ? volume / uph : 0);
  // Heads = labour hours ÷ productive hours per person, rounded up to whole people.
  const headsNeeded = (hours, ph) => (hours > EPS && ph > 0 ? up(hours / ph) : 0);
  // Heads incl. absence = heads ÷ (1 − absenteeism), rounded up: with 8 % absence, 92 of 100 rostered people come.
  const grossHeads = (heads, absenteeism) => (heads > 0 ? up(heads / (1 - Math.max(0, Math.min(0.95, Number(absenteeism) || 0)))) : 0);
  // Capacity in units = present heads × productive hours per person × UPH.
  const capacity = (present, ph, uph) => (present > 0 && ph > 0 && uph > 0 ? present * ph * uph : 0);
  // Takt = available (net) seconds of the shift ÷ units: one unit must be done every takt seconds.
  const takt = (netSeconds, units) => (netSeconds > 0 && units > 0 ? netSeconds / units : null);
  // A rate from a time study: UPH = 3600 ÷ (cycle seconds × (1 + PF&D allowance)) × units per cycle. The allowance
  // (personal needs, fatigue, unavoidable delay) turns the observed time into a standard time.
  const uphFromCycle = (cycleSeconds, allowance = 0, unitsPerCycle = 1) => (cycleSeconds > 0 && unitsPerCycle > 0 && allowance >= 0 && Number.isFinite(allowance)
    ? (3600 * unitsPerCycle) / (cycleSeconds * (1 + allowance)) : null);
  // The volume of a process: the forecast of its unit × its conversion (lines per order); no conversion is 1.
  const factorOf = (process) => (Number(process?.factor) > 0 ? Number(process.factor) : 1);
  const sourceOf = (process) => unitKey(process?.source || process?.driver);
  const volumeOf = (process, volumes) => {
    const value = volumes?.[sourceOf(process)];
    return isNum(value) && value > 0 ? value * factorOf(process) : 0;
  };
  // The planned heads of a shift: per process when any process has a number (the others then count 0), otherwise the
  // total, for a team that works across processes; otherwise nothing is planned yet.
  const planOf = (planned, processes) => {
    const byProcess = isObj(planned?.p) ? planned.p : {};
    const heads = {};
    let any = false;
    processes.forEach((p) => {
      const n = byProcess[p.id];
      if (isNum(n) && n >= 0) { heads[p.id] = n; any = true; }
    });
    if (any) {
      processes.forEach((p) => { if (!(p.id in heads)) heads[p.id] = 0; });
      return { mode: "process", heads, total: Object.values(heads).reduce((a, b) => a + b, 0) };
    }
    if (isNum(planned?.total) && planned.total >= 0) return { mode: "total", heads: {}, total: planned.total };
    return { mode: "none", heads: {}, total: null };
  };

  // Skills Matrix (js/skills-matrix.js keeps { people: [{ id, name, shift }], tasks: [{ id, name }], levels: { personId:
  // { taskId: 0–4 } } }). A process finds its task by the task name given for it, or by its own name.
  const skillsModel = (saved) => {
    if (!isObj(saved) || !Array.isArray(saved.people) || !Array.isArray(saved.tasks)) return null;
    const people = saved.people.filter((p) => isObj(p) && text(p.id) && text(p.name).trim());
    const tasks = saved.tasks.filter((t) => isObj(t) && text(t.id) && text(t.name).trim());
    if (!people.length || !tasks.length) return null;
    return { people, tasks, levels: isObj(saved.levels) ? saved.levels : {}, anon: saved.anon === true };
  };
  const levelOf = (model, personId, taskId) => {
    const value = model.levels?.[personId]?.[taskId];
    return Number.isInteger(value) && value >= 0 && value <= 4 ? value : 0;
  };
  const taskFor = (model, process) => {
    if (!model) return null;
    for (const wanted of [fold(process?.skill), fold(process?.name)]) {
      if (!wanted) continue;
      const hit = model.tasks.find((t) => fold(t.name) === wanted);
      if (hit) return hit;
    }
    return null;
  };
  // Who can move from one process to another: people at level 3 or above on both (they work the process with spare
  // hours today, and do the short one alone), on this shift when the matrix records shifts, and not moved already.
  const qualified = (model, donor, receiver, shiftName = "", used = new Set()) => {
    if (!model) return { status: "missing", missing: "matrix", people: [] };
    const to = taskFor(model, receiver);
    const from = taskFor(model, donor);
    if (!to || !from) return { status: "missing", missing: !to ? receiver?.name || "" : donor?.name || "", people: [] };
    const crew = model.people.filter((p) => fold(p.shift) && fold(p.shift) === fold(shiftName));
    const pool = crew.length ? crew : model.people;
    const people = pool.filter((p) => !used.has(p.id) && levelOf(model, p.id, to.id) >= COVER_AT && levelOf(model, p.id, from.id) >= COVER_AT);
    return { status: people.length ? "ok" : "few", people: people.map((p) => p.id), names: people.map((p) => p.name), byShift: crew.length > 0, task: to.name, donorTask: from.name };
  };

  // Ways to close a gap, process by process, the largest shortfall first: hours from processes with spare hours (only
  // qualified people, whole people for part or all of the shift), then the rest as overtime (an extra hour at work is
  // utilisation × one productive hour) or as agency heads (whole people, with the same absence allowance as the plan).
  const gapOptions = (rows, { processes, ph, utilisation, presence, overtime, skills, shiftName }) => {
    const procOf = (id) => processes.find((p) => p.id === id) || { id, name: "" };
    const spare = new Map(rows.filter((r) => r.gapHours > EPS).map((r) => [r.id, r.gapHours]));
    const used = new Set();
    const maxOvertime = overtime > 0 ? overtime : 2;
    return rows.filter((r) => r.gapHours < -EPS).sort((a, b) => a.gapHours - b.gapHours).map((r) => {
      let rest = -r.gapHours;
      const moves = [];
      const blocked = [];
      const donors = rows.filter((d) => spare.get(d.id) > EPS).sort((a, b) => spare.get(b.id) - spare.get(a.id));
      for (const d of donors) {
        if (rest <= EPS) break;
        const free = spare.get(d.id);
        const check = qualified(skills, procOf(d.id), procOf(r.id), shiftName, used);
        if (check.status !== "ok") {
          blocked.push({ from: d.id, name: d.name, hours: free, status: check.status, missing: check.missing || "" });
          continue;
        }
        const hours = Math.min(free, rest, check.people.length * ph);
        const people = up(hours / ph);
        const ids = check.people.slice(0, people);
        ids.forEach((id) => used.add(id));
        moves.push({ from: d.id, name: d.name, hours, people, ids, names: check.names.slice(0, people), byShift: check.byShift, limited: hours < Math.min(free, rest) - EPS });
        spare.set(d.id, free - hours);
        rest -= hours;
      }
      rest = rest > EPS ? rest : 0;
      const overtimeHours = rest > 0 && utilisation > 0 ? rest / utilisation : 0;
      return {
        id: r.id, name: r.name, short: -r.gapHours, moves, blocked, rest,
        overtime: overtimeHours, overtimePeople: overtimeHours > 0 ? up(overtimeHours / maxOvertime) : 0,
        agency: rest > 0 && ph > 0 && presence > 0 ? up(rest / (ph * presence)) : 0, planned: r.planned,
      };
    });
  };

  // One shift: every process, the totals, the bottleneck, the flow of each forecast unit and the options.
  // shift { length (h), unpaid (min), paid (min) }, utilisation and absenteeism as shares (0.85, 0.08), mode "rostered"
  // (planned heads are the roster: absence still to come) or "confirmed" (the people who will be there), overtime in
  // hours per person, volumes { unit: number }, planned { p: { processId: heads }, total }, skills from skillsModel().
  const analyseShift = ({ processes, shift, utilisation, absenteeism, mode = "rostered", overtime = 2, volumes = {}, planned = null, skills = null, shiftName = "" }) => {
    const ph = productiveHours(shift, utilisation);
    const net = netHours(shift);
    const confirmed = mode === "confirmed";
    const presence = confirmed ? 1 : 1 - Math.max(0, Math.min(0.95, absenteeism));
    const plan = planOf(planned, processes);
    const rows = processes.map((p) => {
      const volume = volumeOf(p, volumes);
      const rated = Number(p.uph) > 0;
      const hours = rated ? hoursNeeded(volume, Number(p.uph)) : 0;
      const heads = headsNeeded(hours, ph);
      const gross = grossHeads(heads, absenteeism);
      const row = {
        id: p.id, name: p.name, driver: p.driver, source: sourceOf(p), factor: factorOf(p), uph: rated ? Number(p.uph) : null, rated, volume, hours, heads, gross,
        need: confirmed ? heads : gross, takt: takt(net * 3600, volume), planned: null, present: null, available: null, gapHeads: null, gapHours: null, capacity: null, coverage: null,
      };
      if (plan.mode === "process" && rated) {
        row.planned = plan.heads[p.id];
        row.present = row.planned * presence;
        row.available = row.present * ph;
        row.gapHeads = row.planned - row.need;
        row.gapHours = row.available - hours;
        row.capacity = capacity(row.present, ph, row.uph);
        row.coverage = volume > 0 ? row.capacity / volume : null;
      }
      return row;
    });
    const rated = rows.filter((r) => r.rated);
    const sum = (list, key) => list.reduce((total, r) => total + (r[key] || 0), 0);
    const hours = sum(rated, "hours");
    // A team that works across processes needs only the hours in whole people once (the pooled heads); rounding each
    // process on its own is the safe number when people stay at one process.
    const pooled = headsNeeded(hours, ph);
    const pooledGross = grossHeads(pooled, absenteeism);
    const totals = {
      volume: sum(rated, "volume"), hours, heads: sum(rated, "heads"), gross: sum(rated, "gross"), need: sum(rated, "need"),
      pooled, pooledGross, pooledNeed: confirmed ? pooled : pooledGross, planned: plan.total, present: null, available: null, gapHeads: null, gapHours: null, coverage: null,
    };
    let bottleneck = null;
    const flows = {};
    if (plan.mode === "process") {
      totals.present = sum(rated, "present");
      totals.available = sum(rated, "available");
      totals.gapHeads = plan.total - totals.need;
      totals.gapHours = totals.available - hours;
      // The bottleneck: the process with the lowest capacity against its volume.
      rated.filter((r) => r.coverage !== null).forEach((r) => {
        if (!bottleneck || r.coverage < bottleneck.coverage - EPS) bottleneck = r;
        if (!(r.source in flows) || r.coverage < flows[r.source]) flows[r.source] = r.coverage;
      });
    } else if (plan.mode === "total") {
      totals.present = plan.total * presence;
      totals.available = totals.present * ph;
      totals.gapHeads = plan.total - totals.pooledNeed;
      totals.gapHours = totals.available - hours;
      totals.coverage = hours > EPS ? totals.available / hours : null;
      // People spread over the processes in proportion to their hours: every process gets the same share of its volume.
      rated.forEach((r) => {
        if (totals.coverage === null || !(r.volume > 0)) return;
        r.coverage = totals.coverage;
        r.capacity = r.volume * totals.coverage;
        flows[r.source] = totals.coverage;
      });
    }
    const options = plan.mode === "process"
      ? gapOptions(rated, { processes, ph, utilisation, presence, overtime, skills, shiftName })
      : plan.mode === "total" && totals.gapHours < -EPS
        ? [(() => {
          const rest = -totals.gapHours;
          const ot = utilisation > 0 ? rest / utilisation : 0;
          return { id: "", name: "", short: rest, moves: [], blocked: [], rest, overtime: ot, overtimePeople: ot > 0 ? up(ot / (overtime > 0 ? overtime : 2)) : 0, agency: ph > 0 && presence > 0 ? up(rest / (ph * presence)) : 0, planned: plan.total };
        })()] : [];
    const shortHours = plan.mode === "process" ? rated.some((r) => r.gapHours < -EPS) : plan.mode === "total" ? totals.gapHours < -EPS : false;
    const shortHeads = plan.mode === "process" ? rated.some((r) => r.gapHeads < 0) : plan.mode === "total" ? totals.gapHeads < 0 : false;
    const status = plan.mode === "none" ? "none" : shortHours ? "short" : shortHeads ? "rounding" : "ok";
    return { ph, net, presence, mode: plan.mode, rows, totals, bottleneck, flows, options, status, unrated: rows.filter((r) => !r.rated && r.volume > 0).map((r) => r.name) };
  };

  // The Time Study (js/time-study.js keeps { process, rating, allowance, stations: [{ name, elements }], rows: [{ s, e,
  // c, t }] }): the observed cycle of each station is the sum of the medians of its timed elements.
  const median = (values) => {
    const s = values.filter(isNum).sort((a, b) => a - b);
    if (!s.length) return null;
    const mid = (s.length - 1) / 2;
    return (s[Math.floor(mid)] + s[Math.ceil(mid)]) / 2;
  };
  const studyCycles = (saved) => {
    if (!isObj(saved) || !Array.isArray(saved.stations) || !Array.isArray(saved.rows)) return [];
    const rows = saved.rows.filter((r) => isObj(r) && Number.isInteger(r.s) && Number.isInteger(r.e) && isNum(r.t) && r.t > 0);
    return saved.stations.map((station, s) => {
      const elements = (Array.isArray(station?.elements) ? station.elements : []).map((_, e) => median(rows.filter((r) => r.s === s && r.e === e).map((r) => r.t)));
      const timed = elements.filter(isNum);
      const seconds = Math.round(timed.reduce((a, b) => a + b, 0) * 1000) / 1000;
      return { index: s, name: text(station?.name).trim(), seconds, timed: timed.length, elements: elements.length, process: text(saved.process).trim() };
    }).filter((station) => station.timed > 0 && station.seconds > 0);
  };

  // The Time Study's performance rating as a share: its rating in % (1 to 300, a decimal comma allowed), else 100 %, as
  // in studies saved before it existed. The rate here uses the rated (normal) time, the observed cycle × rating, and
  // adds this tool's own PF&D allowance; the Time Study's allowance is not added a second time.
  const studyRating = (saved) => {
    const raw = isObj(saved) && typeof saved.rating === "string" ? saved.rating.trim().replace(",", ".") : "";
    const r = raw ? Number(raw) : NaN;
    return Number.isFinite(r) && r >= 1 && r <= 300 ? r / 100 : 1;
  };

  // Rows typed or pasted from a spreadsheet: date, shift, then one volume per forecast unit in the order of the table,
  // then the planned heads of the shift (a total, optional). A shift that is not in the list yet is added.
  const parseForecast = (input, units, shiftNames) => {
    const added = [];
    const newShifts = [];
    let skipped = 0;
    const known = [...shiftNames];
    const match = (value) => {
      const wanted = String(value ?? "").trim();
      if (!wanted) return "";
      const lower = wanted.toLowerCase();
      return known.find((name) => name.toLowerCase() === lower) || (lower.length >= 3 && known.find((name) => name.toLowerCase().startsWith(lower))) || "";
    };
    parseRows(input).forEach((cells, index) => {
      const date = parseDate(cells[0]);
      let shift = match(cells[1]);
      const values = units.map((_, i) => parseNumber(cells[2 + i]));
      const volumes = {};
      units.forEach((unit, i) => { if (Number.isFinite(values[i]) && values[i] >= 0) volumes[unit] = Math.round(values[i] * 100) / 100; });
      const total = parseNumber(cells[2 + units.length]);
      if (!date || !String(cells[1] ?? "").trim() || !Object.keys(volumes).length) {
        // A first row with words where the date and the numbers belong is a header.
        if (index > 0 || date) skipped++;
        return;
      }
      if (!shift) {
        shift = String(cells[1]).trim().slice(0, 40);
        known.push(shift);
        newShifts.push(shift);
      }
      added.push({ date, shift, v: volumes, ...(Number.isFinite(total) && total >= 0 ? { total: Math.round(total) } : {}) });
    });
    return { added, skipped, newShifts };
  };

  // The example of the data file as a state: the template's processes, the shifts, the week's forecast (day of the
  // week|shift|volume per unit) from the coming Monday, and the planned crew per process (a standard crew per shift,
  // with the reduced Saturday crew as overrides).
  const exampleState = (cfg, today) => {
    const ex = cfg.example;
    const template = cfg.templates.find((t) => t.key === ex.template) || cfg.templates[0];
    const processes = template.processes.map((p, i) => ({ id: `ex-p${i + 1}`, name: p.name, driver: p.driver, uph: String(p.uph), source: p.source, factor: String(p.factor), skill: p.skill || "" }));
    const units = [...new Set(processes.map(sourceOf))];
    const start = weekStart(today);
    const shifts = ex.shifts.map((s) => ({ name: s.name, length: String(s.length), unpaid: String(s.unpaid), paid: String(s.paid) }));
    const planned = {};
    const rows = ex.rows.map((line) => {
      const [day, s, ...values] = line.split("|").map(Number);
      const row = { date: addDays(start, day), shift: shifts[s].name, v: Object.fromEntries(units.map((unit, i) => [unit, values[i]])) };
      planned[`${row.date}|${row.shift}`] = { p: Object.fromEntries(processes.map((p, i) => [p.id, ex.crew[s][i]])) };
      return row;
    });
    (ex.crewOverrides || []).forEach((line) => {
      const [day, s, ...heads] = line.split("|").map(Number);
      planned[`${addDays(start, day)}|${shifts[s].name}`] = { p: Object.fromEntries(processes.map((p, i) => [p.id, heads[i]])) };
    });
    return {
      template: template.key, site: ex.site || "", processes, shifts, utilisation: String(ex.utilisation), absenteeism: String(ex.absenteeism),
      overtime: String(ex.overtime), mode: MODES.includes(ex.mode) ? ex.mode : "rostered", rows, planned,
    };
  };

  window.ShiftCapacityMath = {
    EPS, COVER_AT, MODES, up, addDays, mondayOf, weekStart, unitKey, fold, netHours, productiveHours, hoursNeeded, headsNeeded, grossHeads, capacity, takt, uphFromCycle,
    factorOf, sourceOf, volumeOf, planOf, skillsModel, levelOf, taskFor, qualified, gapOptions, analyseShift, median, studyCycles, studyRating, parseForecast, exampleState,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("shift-capacity-data");
  const root = document.querySelector("[data-shift-capacity]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results || !window.ToolKit) return;
  const { tx, num, pct, int, el, read, write, loadState, str, today, dayMonth, showDate, flash, undoNote, panel, stat, focusCard, resultActions, resultLayout, firstVisit, keepFocus, downloadCsv, downloadXlsx } = window.ToolKit;
  const CK = window.ChartKit;
  const Actions = window.ActionsStore;
  const Workplace = window.Workplace || null;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = "shift-capacity";
  const D = cfg.defaults;
  const links = (() => { try { return JSON.parse(document.getElementById("shift-capacity-links")?.textContent || "{}") || {}; } catch { return {}; } })();
  const suffix = KEY.slice("sc-shift-capacity".length);
  const SKILLS_KEY = typeof links.skills === "string" && links.skills.startsWith("sc-") ? links.skills : `sc-skills-matrix${suffix}`;
  const STUDY_KEY = typeof links.study === "string" && links.study.startsWith("sc-") ? links.study : `sc-time-study${suffix}`;
  let counter = 0;
  const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const asText = (value, max = 40) => (typeof value === "number" && Number.isFinite(value) ? String(value) : str(value)).slice(0, max);

  // State: the processes and their rates, the shifts, the settings (as typed), the forecast rows, the planned heads per
  // "date|shift", the shift shown and the example flag. Saved data is rebuilt field by field.
  const defaults = {
    template: "", site: "", processes: [], shifts: [], utilisation: "", absenteeism: "", overtime: "", mode: D.mode, allowance: "", rows: [], planned: {}, view: "", example: false,
  };
  const state = loadState(KEY, defaults);
  const cleanProcess = (p) => (isObj(p) ? {
    id: str(p.id) || newId("p"), name: str(p.name).slice(0, 80), driver: str(p.driver).slice(0, 40), uph: asText(p.uph), source: str(p.source).slice(0, 40), factor: asText(p.factor), skill: str(p.skill).slice(0, 80),
  } : null);
  const cleanShift = (s) => (isObj(s) && str(s.name).trim() ? { name: str(s.name).trim().slice(0, 40), length: asText(s.length), unpaid: asText(s.unpaid), paid: asText(s.paid) } : null);
  const cleanRow = (r) => {
    if (!isObj(r)) return null;
    const v = {};
    if (isObj(r.v)) Object.entries(r.v).forEach(([unit, value]) => { if (isNum(value) && value >= 0) v[unitKey(unit)] = value; });
    return { date: parseDate(r.date) || "", shift: str(r.shift).trim().slice(0, 40), v };
  };
  const cleanPlan = (plan) => {
    if (!isObj(plan)) return null;
    const p = {};
    if (isObj(plan.p)) Object.entries(plan.p).forEach(([id, n]) => { if (Number.isInteger(n) && n >= 0 && n <= 9999) p[id] = n; });
    const out = { p };
    if (Number.isInteger(plan.total) && plan.total >= 0 && plan.total <= 99999) out.total = plan.total;
    return out;
  };
  const cleanAll = () => {
    const seen = new Set();
    state.processes = state.processes.map(cleanProcess).filter((p) => p && !seen.has(p.id) && seen.add(p.id)).slice(0, 30);
    const names = new Set();
    state.shifts = state.shifts.map(cleanShift).filter((s) => s && !names.has(s.name) && names.add(s.name)).slice(0, 8);
    state.rows = state.rows.map(cleanRow).filter(Boolean).slice(0, 500);
    state.planned = Object.fromEntries(Object.entries(isObj(state.planned) ? state.planned : {}).map(([key, plan]) => [key, cleanPlan(plan)]).filter(([key, plan]) => plan && /^\d{4}-\d{2}-\d{2}\|/.test(key)));
    ["utilisation", "absenteeism", "overtime", "allowance", "site", "template", "view"].forEach((name) => { state[name] = asText(state[name], 80); });
    if (!MODES.includes(state.mode)) state.mode = D.mode;
    if (!cfg.templates.some((t) => t.key === state.template)) state.template = cfg.templates[0].key;
    state.example = state.example === true;
  };
  cleanAll();
  const save = () => write(KEY, state);
  // The visitor's own first change ends the example: the data stays, the note goes.
  const own = () => { state.example = false; };

  const templateOf = (key) => cfg.templates.find((t) => t.key === key) || cfg.templates[0];
  const fromTemplate = (key) => templateOf(key).processes.map((p) => cleanProcess({ ...p, id: newId("p"), uph: String(p.uph), factor: String(p.factor) }));
  const defaultShifts = () => {
    const names = Workplace && Workplace.shifts().length ? Workplace.shifts() : cfg.shifts;
    return names.slice(0, 8).map((name) => ({ name, length: "", unpaid: "", paid: "" }));
  };
  const loadExample = () => {
    Object.assign(state, exampleState(cfg, today()), { view: "", example: true });
  };
  // A first visit opens on the example, so the result is visible at once; nothing is saved until the visitor acts.
  if (!state.rows.length && !state.processes.length && firstVisit(KEY)) loadExample();
  if (!state.processes.length) state.processes = fromTemplate(state.template);
  if (!state.shifts.length) state.shifts = defaultShifts();

  // Settings as numbers: an empty box takes the default its placeholder shows.
  const value = (typed, fallback) => { const n = parseNumber(typed); return Number.isFinite(n) ? n : fallback; };
  const share = (typed, fallback, max = 100) => Math.max(0, Math.min(max, value(typed, fallback))) / 100;
  const settings = () => ({
    utilisation: share(state.utilisation, D.utilisation),
    absenteeism: share(state.absenteeism, D.absenteeism, 95),
    overtime: Math.max(0, value(state.overtime, D.overtime)),
    mode: state.mode,
  });
  const shiftValues = (shift) => ({
    length: Math.max(0, value(shift.length, D.length)), unpaid: Math.max(0, value(shift.unpaid, D.unpaid)), paid: Math.max(0, value(shift.paid, D.paid)),
  });
  const processName = (p, i) => p.name.trim() || tx("Process {n}", { n: i + 1 });
  const processList = () => state.processes.map((p, i) => ({
    id: p.id, name: processName(p, i), driver: p.driver.trim() || p.source.trim() || cfg.drivers[0], source: p.source.trim() || p.driver.trim() || cfg.drivers[0],
    uph: value(p.uph, NaN), factor: value(p.factor, 1) > 0 ? value(p.factor, 1) : 1, skill: p.skill.trim(),
  }));
  // The forecast columns: one per unit the processes are counted from, in the order of the processes.
  const units = () => {
    const out = [];
    processList().forEach((p) => { const key = unitKey(p.source); if (key && !out.some((u) => u.key === key)) out.push({ key, label: p.source }); });
    return out;
  };
  const skills = () => skillsModel(read(SKILLS_KEY, null));
  const keyOf = (row) => `${row.date}|${row.shift}`;

  // Words and numbers.
  const shortDay = dayMonth(true);
  // The weekday alone, for the narrow labels of a chart ("Mon", "Mo", "Hën").
  const SQ_DAYS = ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"];
  const weekdayFormat = new Intl.DateTimeFormat(window.ToolKit.LOCALE, { weekday: "short", timeZone: "UTC" });
  const weekday = (iso) => { const date = new Date(`${iso}T00:00:00Z`); return window.ToolKit.LANG === "sq" ? SQ_DAYS[date.getUTCDay()] : weekdayFormat.format(date); };
  // The site: the example's own, else the workplace profile's.
  const siteText = () => (state.example ? state.site : Workplace?.get().site || "");
  const dayText = (iso) => (iso ? shortDay(new Date(`${iso}T00:00:00Z`)) : "–");
  const shiftLabel = (key) => { const [date, ...rest] = key.split("|"); return `${dayText(date)} · ${rest.join("|")}`; };
  const hoursText = (h) => tx("{n} h", { n: num(h, 1) });
  const signed = (n, digits = 0) => (Math.abs(n) < 0.05 && digits ? `±${num(0, digits)}` : n > 0 ? `+${num(n, digits)}` : n < 0 ? `−${num(-n, digits)}` : "±0");
  const signedHours = (h) => tx("{n} h", { n: signed(h, 1) });
  const amount = (v) => num(v, v > 0 && v < 100 && !Number.isInteger(Math.round(v * 10) / 10) ? 1 : 0);
  const rateText = (uph) => num(uph, Number.isInteger(uph) || uph >= 100 ? 0 : 1);
  const taktText = (t) => (t === null ? "–" : tx("{n} s", { n: num(t, t < 10 ? 2 : 1) }));
  const covText = (c) => (c === null ? "–" : pct(c, 0));
  const shareText = (s) => pct(s, Number.isInteger(Math.round(s * 1000) / 10) ? 0 : 1);
  const unitLabel = (key) => units().find((u) => u.key === key)?.label || key;
  const peopleText = (n) => tx(n === 1 ? "{n} person" : "{n} people", { n: int.format(n) });
  const agencyText = (n) => (n === 1 ? tx("1 agency head") : tx("{n} agency heads", { n: int.format(n) }));
  const maxText = () => { const max = settings().overtime; return tx("{n} h", { n: num(max, Number.isInteger(max) ? 0 : 1) }); };

  // Elements.
  const q = (selector, scope = root) => scope.querySelector(selector);
  const templateSelect = q("#cp-template");
  const processBody = q("[data-processes]");
  const processWrap = q("[data-processes-wrap]");
  const processStatus = q("[data-process-status]");
  const skillsHead = q("[data-skill-head]");
  const skillsList = q("#cp-skill-list");
  const driverList = q("#cp-driver-list");
  const studyBox = q("[data-study]");
  const studyList = q("[data-study-list]");
  const studyStatus = q("[data-study-status]");
  const allowanceInput = q("#cp-allowance");
  const shiftBody = q("[data-shifts]");
  const shiftStatus = q("[data-shift-status]");
  const settingInputs = [...root.querySelectorAll("[data-setting]")];
  const modeSelect = q("#cp-mode");
  const forecastHead = q("[data-forecast-head]");
  const forecastBody = q("[data-forecast]");
  const forecastWrap = q("[data-forecast-wrap]");
  const forecastEmpty = q("[data-forecast-empty]");
  const forecastCount = q("[data-forecast-count]");
  const forecastStatus = q("[data-forecast-status]");
  const pasteBox = q("#cp-paste");
  const pasteColumns = q("[data-paste-columns]");
  const importStatus = q("[data-import-status]");
  const planSelect = q("#cp-plan-shift");
  const planFields = q("[data-plan-fields]");
  const planTotal = q("#cp-plan-total");
  const planNote = q("[data-plan-note]");
  const planStatus = q("[data-plan-status]");
  const copyPlan = q("[data-copy-plan]");
  const printBox = document.querySelector("[data-print]");
  const fill = (select, options, current) => {
    select.replaceChildren(...options.map(([val, label]) => { const o = el("option", null, label); o.value = val; return o; }));
    if (options.some(([val]) => val === current)) select.value = current;
  };
  const cellInput = (attrs, label) => {
    const input = el("input");
    Object.entries(attrs).forEach(([name, val]) => { if (val !== undefined && val !== null) input.setAttribute(name, val); });
    input.setAttribute("aria-label", label);
    input.autocomplete = "off";
    return input;
  };
  const removeButton = (label, attrs) => {
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.setAttribute("aria-label", label);
    Object.assign(button.dataset, attrs);
    return button;
  };

  // The analysis of every shift in the forecast, in date and shift order.
  const analyse = () => {
    const procs = processList();
    const set = settings();
    const model = skills();
    const order = new Map(state.shifts.map((s, i) => [s.name, i]));
    const seen = new Set();
    const dupes = [];
    const undated = state.rows.filter((r) => !r.date || !order.has(r.shift)).length;
    const list = state.rows.filter((r) => r.date && order.has(r.shift))
      .slice().sort((a, b) => a.date.localeCompare(b.date) || order.get(a.shift) - order.get(b.shift))
      .filter((r) => { const key = keyOf(r); if (seen.has(key)) { dupes.push(key); return false; } seen.add(key); return true; })
      .map((r) => {
        const shift = state.shifts[order.get(r.shift)];
        const key = keyOf(r);
        const result = analyseShift({ processes: procs, shift: shiftValues(shift), ...set, volumes: r.v, planned: state.planned[key] || null, skills: model, shiftName: r.shift });
        return { key, date: r.date, shift: r.shift, row: r, result };
      });
    return { list, procs, set, model, dupes, undated, units: units() };
  };
  const pickView = (a) => {
    if (a.list.some((s) => s.key === state.view)) return a.list.find((s) => s.key === state.view);
    return a.list.find((s) => s.result.status === "short") || a.list[0] || null;
  };

  // Setup: the template and the processes ---------------------------------------------------------------------------
  const renderTemplates = () => fill(templateSelect, cfg.templates.map((t) => [t.key, t.name]), state.template);
  const renderProcesses = () => {
    const model = skills();
    skillsHead.hidden = !model;
    skillsList.replaceChildren(...(model ? model.tasks.map((t) => { const o = el("option"); o.value = t.name; return o; }) : []));
    driverList.replaceChildren(...cfg.drivers.map((d) => { const o = el("option"); o.value = d; return o; }));
    processBody.replaceChildren(...state.processes.map((p, i) => {
      const tr = el("tr");
      const name = processName(p, i);
      const cell = (node, className) => { const td = el("td", className); td.append(node); return td; };
      tr.append(
        cell(cellInput({ type: "text", value: p.name, placeholder: cfg.text.processPlaceholder, "data-field": "name", "data-index": i, maxlength: 80, class: "cp-text" }, `${tx("Process")} ${i + 1}`)),
        cell(cellInput({ type: "text", value: p.driver, placeholder: cfg.text.driverPlaceholder, list: "cp-driver-list", "data-field": "driver", "data-index": i, maxlength: 40, class: "cp-unit" }, `${tx("Counted in")}: ${name}`)),
        cell(cellInput({ type: "text", inputmode: "decimal", value: p.uph, "data-field": "uph", "data-index": i, class: "cp-num" }, `${tx("Units per productive hour")}: ${name}`), "num"),
        cell(cellInput({ type: "text", value: p.source, placeholder: cfg.text.sourcePlaceholder, list: "cp-driver-list", "data-field": "source", "data-index": i, maxlength: 40, class: "cp-unit" }, `${tx("Forecast in")}: ${name}`)),
        cell(cellInput({ type: "text", inputmode: "decimal", value: p.factor, placeholder: "1", "data-field": "factor", "data-index": i, class: "cp-num" }, `${tx("Conversion")}: ${name}`), "num"),
      );
      if (model) tr.append(cell(cellInput({ type: "text", value: p.skill, list: "cp-skill-list", placeholder: name, "data-field": "skill", "data-index": i, maxlength: 80, class: "cp-text" }, `${tx("Task in the Skills Matrix")}: ${name}`)));
      tr.append(cell(removeButton(tx("Remove {name}", { name }), { removeProcess: i })));
      return tr;
    }));
    processWrap.hidden = !state.processes.length;
    renderConversions();
  };
  // Under the table, each conversion in words: "Picking: 2.4 lines per order".
  const renderConversions = () => {
    const box = q("[data-conversions]");
    const lines = processList().filter((p) => unitKey(p.source) !== unitKey(p.driver) || p.factor !== 1)
      .map((p) => {
        const factor = Math.round(p.factor * 1000) / 1000;
        return tx("{process}: {driver} = {source} × {factor}", { process: p.name, factor: num(factor, (String(factor).split(".")[1] || "").length), driver: p.driver, source: p.source });
      });
    const unrated = processList().filter((p) => !(p.uph > 0)).map((p) => p.name);
    box.textContent = [lines.length ? `${tx("Conversions")}: ${lines.join(" · ")}.` : "", unrated.length ? tx("No rate yet: {names}. They are left out until they have one.", { names: unrated.join(", ") }) : ""].filter(Boolean).join(" ");
  };
  processBody.addEventListener("input", (event) => {
    const input = event.target.closest("[data-field]");
    if (!input) return;
    const p = state.processes[Number(input.dataset.index)];
    if (!p) return;
    p[input.dataset.field] = input.value;
    own();
    save();
    if (input.dataset.field === "source") { renderForecast(); renderPaste(); }
    if (input.dataset.field === "name") renderStudy();
    renderConversions();
    renderPlanned();
    renderResults();
  });
  processBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-process]");
    if (!button) return;
    const index = Number(button.dataset.removeProcess);
    const [removed] = state.processes.splice(index, 1);
    if (!removed) return;
    own();
    save();
    renderAll();
    (processBody.querySelector("[data-remove-process]") || q("[data-add-process]")).focus();
    undoNote(processStatus, tx("Removed {name}.", { name: removed.name || tx("Process {n}", { n: index + 1 }) }), () => {
      state.processes.splice(Math.min(index, state.processes.length), 0, removed);
      save();
      renderAll();
    });
  });
  q("[data-add-process]").addEventListener("click", () => {
    if (state.processes.length >= 30) return;
    const last = state.processes.at(-1);
    state.processes.push(cleanProcess({ id: newId("p"), name: "", driver: last?.driver || cfg.drivers[0], uph: "", source: last?.source || last?.driver || cfg.drivers[0], factor: "1", skill: "" }));
    own();
    save();
    renderAll();
    processBody.querySelector("tr:last-child input")?.focus();
  });
  q("[data-load-template]").addEventListener("click", () => {
    const key = templateSelect.value;
    const template = templateOf(key);
    if (state.processes.some((p) => p.name.trim() || p.uph.trim()) && !window.confirm(tx("Replace the processes with the template {name}? The forecast and the planned heads per process are cleared too.", { name: template.name }))) return;
    state.template = template.key;
    state.processes = fromTemplate(template.key);
    state.rows = [];
    state.planned = {};
    state.example = false;
    save();
    renderAll();
    flash(processStatus, tx("Loaded {n} processes: {name}. Check each rate against your own standards.", { n: int.format(state.processes.length), name: template.name }));
  });

  // A rate from the Time Study in this browser, offered per station; it is used only when the visitor says so.
  const renderStudy = () => {
    const study = read(STUDY_KEY, null);
    const stations = studyCycles(study);
    const rating = studyRating(study);
    studyBox.hidden = !stations.length;
    if (!stations.length) return;
    allowanceInput.value = state.allowance;
    allowanceInput.placeholder = String(D.allowance);
    const allowance = share(state.allowance, D.allowance, 200);
    const procs = processList();
    studyList.replaceChildren(...stations.map((station) => {
      const li = el("li", "cp-study-item");
      const name = station.name || cfg.text.station.replace("{n}", station.index + 1);
      // The rated (normal) cycle: observed × the Time Study's rating; this tool's allowance goes on top.
      const seconds = station.seconds * rating;
      const uph = uphFromCycle(seconds, allowance, 1);
      const what = el("p", "cp-study-what");
      const rated = rating !== 1 ? ` · ${tx("rated {r}, observed {s}", { r: shareText(rating), s: tx("{n} s", { n: num(station.seconds, 1) }) })}` : "";
      what.append(el("strong", null, `${station.process ? `${station.process} · ` : ""}${name}`), ` · ${tx("cycle {s}", { s: tx("{n} s", { n: num(seconds, 1) }) })}${rated}${station.timed < station.elements ? ` · ${tx("{a} of {b} elements timed", { a: station.timed, b: station.elements })}` : ""}`);
      const formula = el("p", "form-note cp-formula", tx("UPH = 3600 ÷ ({s} s × (1 + {a})) = {uph}", { s: num(seconds, 1), a: shareText(allowance), uph: num(uph, 1) }));
      const pick = el("div", "cp-study-pick");
      const id = `cp-study-${station.index}`;
      const label = el("label", "visually-hidden", tx("Use the rate of {station} for", { station: name }));
      label.htmlFor = id;
      const select = el("select");
      select.id = id;
      fill(select, procs.map((p) => [p.id, p.name]), procs.find((p) => fold(p.name) === fold(station.process) || fold(p.name) === fold(name))?.id || procs[0]?.id);
      const unitsId = `cp-study-units-${station.index}`;
      const unitsLabel = el("label", "cp-study-units-label", tx("units per cycle"));
      unitsLabel.htmlFor = unitsId;
      const unitsInput = cellInput({ type: "text", inputmode: "decimal", id: unitsId, value: "1", class: "cp-num" }, tx("units per cycle"));
      unitsInput.removeAttribute("aria-label");
      const button = el("button", "button-secondary cp-small", tx("Use this rate"));
      button.type = "button";
      button.addEventListener("click", () => {
        const index = state.processes.findIndex((p) => p.id === select.value);
        const per = value(unitsInput.value, 1);
        const rate = uphFromCycle(seconds, allowance, per > 0 ? per : 1);
        if (index < 0 || !rate) return;
        const before = state.processes[index].uph;
        const rounded = String(Math.round(rate * (rate >= 100 ? 1 : 10)) / (rate >= 100 ? 1 : 10));
        state.processes[index].uph = rounded;
        own();
        save();
        renderAll();
        const pname = processList()[index].name;
        undoNote(studyStatus, tx("{process} now uses {uph} per hour from the Time Study (was {before}).", { process: pname, uph: num(Number(rounded), rate >= 100 ? 0 : 1), before: before.trim() || "–" }), () => {
          if (state.processes[index]) state.processes[index].uph = before;
          save();
          renderAll();
        });
      });
      pick.append(label, select, unitsLabel, unitsInput, button);
      li.append(what, formula, pick);
      return li;
    }));
  };
  allowanceInput.addEventListener("input", () => { state.allowance = allowanceInput.value; save(); renderStudy(); });

  // Setup: the shifts and the settings ------------------------------------------------------------------------------
  const phText = (shift) => {
    const s = shiftValues(shift);
    const ph = productiveHours(s, settings().utilisation);
    return tx("({length} h − {unpaid} min − {paid} min) × {u} = {ph}", { length: num(s.length, Number.isInteger(s.length) ? 0 : 2), unpaid: int.format(s.unpaid), paid: int.format(s.paid), u: shareText(settings().utilisation), ph: tx("{n} h", { n: num(ph, 2) }) });
  };
  const renderShifts = () => {
    shiftBody.replaceChildren(...state.shifts.map((s, i) => {
      const tr = el("tr");
      const cell = (node, className) => { const td = el("td", className); td.append(node); return td; };
      tr.append(
        cell(cellInput({ type: "text", value: s.name, placeholder: cfg.text.shiftPlaceholder, "data-field": "name", "data-index": i, maxlength: 40, class: "cp-text" }, `${tx("Shift")} ${i + 1}`)),
        cell(cellInput({ type: "text", inputmode: "decimal", value: s.length, placeholder: String(D.length), "data-field": "length", "data-index": i, class: "cp-num" }, `${tx("Length (h)")}: ${s.name}`), "num"),
        cell(cellInput({ type: "text", inputmode: "numeric", value: s.unpaid, placeholder: String(D.unpaid), "data-field": "unpaid", "data-index": i, class: "cp-num" }, `${tx("Unpaid breaks (min)")}: ${s.name}`), "num"),
        cell(cellInput({ type: "text", inputmode: "numeric", value: s.paid, placeholder: String(D.paid), "data-field": "paid", "data-index": i, class: "cp-num" }, `${tx("Paid breaks and briefing (min)")}: ${s.name}`), "num"),
      );
      const out = el("td", "cp-ph");
      out.dataset.ph = i;
      out.textContent = phText(s);
      tr.append(out, cell(removeButton(tx("Remove {name}", { name: s.name }), { removeShift: i })));
      return tr;
    }));
  };
  const renderPh = () => state.shifts.forEach((s, i) => { const cell = shiftBody.querySelector(`[data-ph="${i}"]`); if (cell) cell.textContent = phText(s); });
  shiftBody.addEventListener("input", (event) => {
    const input = event.target.closest("[data-field]");
    if (!input) return;
    const index = Number(input.dataset.index);
    const shift = state.shifts[index];
    if (!shift) return;
    if (input.dataset.field === "name") {
      const name = input.value.trim().slice(0, 40);
      // The forecast and the plan follow a renamed shift; two shifts of one name would merge, so that waits.
      if (!name || state.shifts.some((s, i) => i !== index && s.name === name)) { flash(shiftStatus, tx("Each shift needs its own name.")); return; }
      const old = shift.name;
      state.rows.forEach((r) => { if (r.shift === old) r.shift = name; });
      state.planned = Object.fromEntries(Object.entries(state.planned).map(([key, plan]) => { const [date, ...rest] = key.split("|"); return [rest.join("|") === old ? `${date}|${name}` : key, plan]; }));
      if (state.view.endsWith(`|${old}`)) state.view = `${state.view.slice(0, 10)}|${name}`;
      shift.name = name;
      renderForecast();
    } else shift[input.dataset.field] = input.value;
    own();
    save();
    renderPh();
    renderPlanned();
    renderResults();
  });
  shiftBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-shift]");
    if (!button) return;
    const index = Number(button.dataset.removeShift);
    const shift = state.shifts[index];
    if (!shift || state.shifts.length <= 1) { flash(shiftStatus, tx("Keep at least one shift.")); return; }
    const used = state.rows.filter((r) => r.shift === shift.name).length;
    if (used && !window.confirm(tx("Remove the shift {name} and its {n} forecast rows?", { name: shift.name, n: int.format(used) }))) return;
    state.shifts.splice(index, 1);
    state.rows = state.rows.filter((r) => r.shift !== shift.name);
    state.planned = Object.fromEntries(Object.entries(state.planned).filter(([key]) => !key.endsWith(`|${shift.name}`)));
    own();
    save();
    renderAll();
    flash(shiftStatus, tx("Removed {name}.", { name: shift.name }));
  });
  q("[data-add-shift]").addEventListener("click", () => {
    if (state.shifts.length >= 8) return;
    let n = state.shifts.length + 1;
    while (state.shifts.some((s) => s.name === tx("Shift {n}", { n }))) n++;
    const last = state.shifts.at(-1);
    state.shifts.push({ name: tx("Shift {n}", { n }), length: last?.length || "", unpaid: last?.unpaid || "", paid: last?.paid || "" });
    own();
    save();
    renderAll();
    shiftBody.querySelector("tr:last-child input")?.focus();
  });
  const renderSettings = () => {
    settingInputs.forEach((input) => { input.value = state[input.name] ?? ""; input.placeholder = String(D[input.name]); });
    modeSelect.value = state.mode;
  };
  settingInputs.forEach((input) => input.addEventListener("input", () => {
    state[input.name] = input.value;
    own();
    save();
    renderPh();
    renderPlanned();
    renderResults();
  }));
  modeSelect.addEventListener("change", () => {
    state.mode = MODES.includes(modeSelect.value) ? modeSelect.value : D.mode;
    own();
    save();
    renderPlanned();
    renderResults();
  });

  // The forecast: one row per day and shift, one volume per unit -----------------------------------------------------
  const renderPaste = () => {
    pasteColumns.textContent = [tx("date"), tx("shift"), ...units().map((u) => u.label), `${tx("planned heads")} (${tx("optional")})`].join(", ");
  };
  const renderForecast = () => {
    const cols = units();
    const htr = el("tr");
    [tx("Date"), tx("Shift"), ...cols.map((u) => u.label)].forEach((label, i) => { const th = el("th", i > 1 ? "num" : null, label); th.scope = "col"; htr.append(th); });
    const last = el("th");
    last.scope = "col";
    last.append(el("span", "visually-hidden", tx("Remove")));
    htr.append(last);
    forecastHead.replaceChildren(htr);
    const names = state.shifts.map((s) => s.name);
    forecastBody.replaceChildren(...state.rows.map((r, i) => {
      const tr = el("tr");
      const cell = (node, className) => { const td = el("td", className); td.append(node); return td; };
      const date = cellInput({ type: "date", value: r.date, "data-field": "date", "data-index": i }, `${tx("Date")} ${i + 1}`);
      const shift = el("select");
      shift.dataset.field = "shift";
      shift.dataset.index = i;
      shift.setAttribute("aria-label", `${tx("Shift")}: ${dayText(r.date)}`);
      fill(shift, [...new Set([...names, ...(r.shift && !names.includes(r.shift) ? [r.shift] : [])])].map((n) => [n, n]), r.shift);
      tr.append(cell(date), cell(shift));
      cols.forEach((u) => tr.append(cell(cellInput({ type: "text", inputmode: "numeric", value: isNum(r.v[u.key]) ? String(r.v[u.key]) : "", "data-field": "v", "data-unit": u.key, "data-index": i, class: "cp-num cp-vol" }, `${u.label}: ${dayText(r.date)} · ${r.shift}`), "num")));
      tr.append(cell(removeButton(tx("Remove {name}", { name: `${dayText(r.date)} · ${r.shift}` }), { removeRow: i })));
      return tr;
    }));
    forecastWrap.hidden = !state.rows.length;
    forecastEmpty.hidden = state.rows.length > 0;
    const days = new Set(state.rows.map((r) => r.date).filter(Boolean)).size;
    forecastCount.textContent = state.rows.length ? tx("{n} shifts on {d} days", { n: int.format(state.rows.length), d: int.format(days) }) : "";
  };
  forecastBody.addEventListener("input", (event) => {
    const input = event.target.closest("[data-field]");
    if (!input) return;
    const row = state.rows[Number(input.dataset.index)];
    if (!row) return;
    const oldKey = keyOf(row);
    if (input.dataset.field === "date") row.date = parseDate(input.value) || "";
    else if (input.dataset.field === "shift") row.shift = input.value;
    else {
      const n = parseNumber(input.value);
      if (Number.isFinite(n) && n >= 0) row.v[input.dataset.unit] = Math.round(n * 100) / 100;
      else delete row.v[input.dataset.unit];
    }
    // The planned heads move with their row when its date or shift changes, unless the new place has its own.
    const newKey = keyOf(row);
    if (newKey !== oldKey && state.planned[oldKey] && !state.planned[newKey] && !state.rows.some((r) => r !== row && keyOf(r) === oldKey)) {
      state.planned[newKey] = state.planned[oldKey];
      delete state.planned[oldKey];
    }
    if (state.view === oldKey) state.view = newKey;
    own();
    save();
    if (input.dataset.field !== "v") renderPlanned();
    renderResults();
  });
  forecastBody.addEventListener("change", (event) => { if (event.target.closest("[data-field=shift]")) renderPlanned(); });
  forecastBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-row]");
    if (!button) return;
    const index = Number(button.dataset.removeRow);
    const [removed] = state.rows.splice(index, 1);
    if (!removed) return;
    own();
    save();
    renderForecast();
    renderPlanned();
    renderResults();
    (forecastBody.querySelector("[data-remove-row]") || q("[data-add-day]")).focus();
    undoNote(forecastStatus, tx("Removed {name}.", { name: `${dayText(removed.date)} · ${removed.shift}` }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      save();
      renderForecast();
      renderPlanned();
      renderResults();
    });
  });
  // The next day after the last one in the forecast (or the coming Monday), with a row for each shift.
  q("[data-add-day]").addEventListener("click", () => {
    const dates = state.rows.map((r) => r.date).filter(Boolean).sort();
    const date = dates.length ? addDays(dates.at(-1), 1) : weekStart(today());
    state.shifts.forEach((s) => state.rows.push({ date, shift: s.name, v: {} }));
    own();
    save();
    renderForecast();
    renderPlanned();
    renderResults();
    forecastBody.querySelector(`tr:nth-last-child(${state.shifts.length}) .cp-vol`)?.focus();
  });
  q("[data-import]").addEventListener("click", () => {
    const cols = units().map((u) => u.key);
    const { added, skipped, newShifts } = parseForecast(pasteBox.value, cols, state.shifts.map((s) => s.name));
    if (!added.length) { flash(importStatus, tx("No rows found. Check the order: date, shift, then one volume per unit.")); return; }
    if (state.example) { state.rows = []; state.planned = {}; state.example = false; }
    newShifts.forEach((name) => { if (state.shifts.length < 8) state.shifts.push({ name, length: "", unpaid: "", paid: "" }); });
    let replaced = 0;
    added.forEach((item) => {
      const twin = state.rows.find((r) => keyOf(r) === keyOf(item));
      if (twin) { twin.v = { ...twin.v, ...item.v }; replaced++; } else state.rows.push({ date: item.date, shift: item.shift, v: item.v });
      if ("total" in item) state.planned[keyOf(item)] = { ...(state.planned[keyOf(item)] || { p: {} }), total: item.total };
    });
    state.rows.sort((a, b) => a.date.localeCompare(b.date) || state.shifts.findIndex((s) => s.name === a.shift) - state.shifts.findIndex((s) => s.name === b.shift));
    pasteBox.value = "";
    save();
    renderAll();
    flash(importStatus, `${tx("Imported {n} rows", { n: int.format(added.length - replaced) })}${replaced ? tx(", updated {n}", { n: int.format(replaced) }) : ""}${skipped ? tx(", skipped {n}", { n: int.format(skipped) }) : ""}.`);
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear the forecast and the planned heads?"))) return;
    state.rows = [];
    state.planned = {};
    state.view = "";
    state.example = false;
    save();
    renderAll();
  });
  root.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  }));

  // The planned heads of one shift: per process, or only the total -----------------------------------------------------
  const renderPlanned = () => {
    const a = analyse();
    const view = pickView(a);
    fill(planSelect, a.list.map((s) => [s.key, shiftLabel(s.key)]), view?.key || "");
    planSelect.disabled = !a.list.length;
    const plan = view ? state.planned[view.key] || { p: {} } : { p: {} };
    const rowOf = (id) => view?.result.rows.find((r) => r.id === id);
    const needWord = state.mode === "confirmed" ? tx("needed") : tx("needed incl. absence");
    planFields.replaceChildren(...a.procs.map((p) => {
      const box = el("div", "field cp-plan-field");
      const id = `cp-plan-${p.id}`;
      const label = el("label", null, p.name);
      label.htmlFor = id;
      const input = cellInput({ type: "number", min: "0", max: "9999", step: "1", inputmode: "numeric", id, value: isNum(plan.p?.[p.id]) ? String(plan.p[p.id]) : "", "data-plan": p.id, disabled: view ? null : "" }, p.name);
      input.removeAttribute("aria-label");
      const r = rowOf(p.id);
      box.append(label, input, el("span", "form-note", r && r.rated ? `${needWord}: ${int.format(r.need)}` : r ? tx("no rate") : ""));
      return box;
    }));
    planTotal.value = isNum(plan.total) ? String(plan.total) : "";
    planTotal.disabled = !view;
    copyPlan.disabled = !view;
    copyPlan.textContent = view ? tx("Copy to every {shift} shift", { shift: view.shift }) : tx("Copy to every shift of this name");
    const mode = view ? planOf(plan, a.procs).mode : "none";
    planNote.textContent = !view ? tx("Add the forecast first: the planned heads belong to a day and a shift.")
      : mode === "process" ? (isNum(plan.total) ? tx("Counted per process; the total is not used while a process has a number.") : tx("Counted per process: a process left empty counts 0."))
        : mode === "total" ? tx("Only the total: the people are counted as one team that works across the processes.")
          : tx("Nothing planned yet for this shift.");
  };
  planSelect.addEventListener("change", () => { state.view = planSelect.value; save(); renderPlanned(); renderResults(); });
  planFields.addEventListener("input", (event) => {
    const input = event.target.closest("[data-plan]");
    if (!input || !planSelect.value) return;
    const key = planSelect.value;
    const plan = state.planned[key] || { p: {} };
    const n = Math.round(parseNumber(input.value));
    if (Number.isFinite(n) && n >= 0 && n <= 9999) plan.p[input.dataset.plan] = n; else delete plan.p[input.dataset.plan];
    state.planned[key] = plan;
    state.view = key;
    own();
    save();
    renderPlanNote();
    renderResults();
  });
  const renderPlanNote = () => {
    const key = planSelect.value;
    const plan = state.planned[key] || { p: {} };
    const mode = planOf(plan, processList()).mode;
    planNote.textContent = mode === "process" ? (isNum(plan.total) ? tx("Counted per process; the total is not used while a process has a number.") : tx("Counted per process: a process left empty counts 0."))
      : mode === "total" ? tx("Only the total: the people are counted as one team that works across the processes.") : tx("Nothing planned yet for this shift.");
  };
  planTotal.addEventListener("input", () => {
    const key = planSelect.value;
    if (!key) return;
    const plan = state.planned[key] || { p: {} };
    const n = Math.round(parseNumber(planTotal.value));
    if (Number.isFinite(n) && n >= 0 && n <= 99999) plan.total = n; else delete plan.total;
    state.planned[key] = plan;
    state.view = key;
    own();
    save();
    renderPlanNote();
    renderResults();
  });
  copyPlan.addEventListener("click", () => {
    const key = planSelect.value;
    if (!key) return;
    const shift = key.split("|").slice(1).join("|");
    const plan = state.planned[key] || { p: {} };
    const targets = state.rows.filter((r) => r.shift === shift && r.date && keyOf(r) !== key);
    targets.forEach((r) => { state.planned[keyOf(r)] = JSON.parse(JSON.stringify(plan)); });
    own();
    save();
    renderResults();
    flash(planStatus, tx("Copied to {n} more {shift} shifts.", { n: int.format(new Set(targets.map(keyOf)).size), shift }));
  });

  // Hand-offs: a gap becomes an action for the shift lead, due the day before the shift (today when that has passed).
  const optionLines = (s) => s.result.options.map((o) => {
    const parts = [];
    o.moves.forEach((m) => parts.push(tx("move {people} from {process} for {hours}", { people: peopleText(m.people), process: m.name, hours: hoursText(m.hours) })));
    if (o.rest > 0) parts.push(tx("{ot} of overtime ({people}, up to {max} each) or {agency}", { ot: hoursText(o.overtime), people: peopleText(o.overtimePeople), max: maxText(), agency: agencyText(o.agency) }));
    return `${o.name || tx("Whole team")} ${tx("{hours} short", { hours: hoursText(o.short) })}: ${parts.join("; ")}`;
  });
  const gapAction = (s) => {
    const r = s.result;
    const names = r.options.map((o) => o.name).filter(Boolean);
    const before = addDays(s.date, -1);
    return {
      title: tx("Close the gap on {shift}: {hours} short", { shift: shiftLabel(s.key), hours: hoursText(r.options.reduce((t, o) => t + o.short, 0)) }),
      detail: [names.length ? names.join(", ") : "", ...optionLines(s), r.bottleneck ? tx("Bottleneck: {process}, {pct} of its volume", { process: r.bottleneck.name, pct: covText(r.bottleneck.coverage) }) : "", cfg.text.tool].filter(Boolean).join(" · "),
      owner: cfg.text.owner, due: before < today() ? today() : before, source: TOOL, check: cfg.text.check, area: names[0] || "", priority: s.date <= addDays(today(), 2) ? "High" : "Medium",
    };
  };

  // Results -----------------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    state.rows = [];
    state.planned = {};
    state.site = "";
    state.view = "";
    state.example = false;
    save();
    renderAll();
    q("[data-add-day]").focus();
  });
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(exampleNote);

  const table = (head, rows, { foot = null, className = "" } = {}) => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const htr = el("tr");
    head.forEach(([label, numeric]) => { const th = el("th", numeric ? "num" : null, label); th.scope = "col"; htr.append(th); });
    thead.append(htr);
    const tbody = el("tbody");
    rows.forEach((cells) => tbody.append(cells));
    t.append(thead, tbody);
    if (foot) { const tfoot = el("tfoot"); tfoot.append(foot); t.append(tfoot); }
    wrap.append(t);
    return wrap;
  };
  const td = (content, className) => { const cell = el("td", className || null); cell.append(content ?? ""); return cell; };
  const gapCell = (n, digits = 0, hours = false) => {
    if (n === null) return td("–", "num");
    const cell = td(hours ? signedHours(n) : signed(n, digits), "num cp-gap");
    if (n < -EPS) cell.classList.add("is-short");
    return cell;
  };
  const needLabel = () => (state.mode === "confirmed" ? tx("Heads needed") : tx("Heads incl. absence"));
  const shiftTable = (s) => {
    const r = s.result;
    const head = [[tx("Process"), false], [tx("Volume"), true], [tx("Rate (UPH)"), true], [tx("Hours needed"), true], [tx("Heads"), true], [tx("Incl. absence"), true], [tx("Planned"), true], [tx("Gap (heads)"), true], [tx("Gap (hours)"), true], [tx("Capacity"), true], [tx("Coverage"), true], [tx("Takt"), true]];
    const rows = r.rows.map((row) => {
      const tr = el("tr");
      if (r.bottleneck && r.bottleneck.id === row.id) tr.classList.add("is-bottleneck");
      const name = el("span");
      name.append(row.name);
      if (r.bottleneck && r.bottleneck.id === row.id) name.append(" ", el("span", "dl-tag", cfg.text.bottleneck));
      tr.append(td(name), td(`${amount(row.volume)} ${row.driver}`, "num"), td(row.rated ? rateText(row.uph) : tx("no rate"), "num"), td(row.rated ? num(row.hours, 1) : "–", "num"),
        td(int.format(row.heads), "num"), td(int.format(row.gross), "num"), td(row.planned === null ? "–" : int.format(row.planned), "num"),
        gapCell(row.gapHeads), gapCell(row.gapHours, 1, true), td(row.capacity === null ? "–" : `${amount(row.capacity)} ${row.driver}`, "num"), td(covText(row.coverage), "num"), td(taktText(row.takt), "num"));
      return tr;
    });
    const t = r.totals;
    const foot = el("tr");
    foot.append(td(tx("Total")), td(""), td(""), td(num(t.hours, 1), "num"), td(int.format(t.heads), "num"), td(int.format(t.gross), "num"), td(t.planned === null ? "–" : int.format(t.planned), "num"),
      gapCell(t.gapHeads), gapCell(t.gapHours, 1, true), td(""), td(r.mode === "total" ? covText(t.coverage) : "", "num"), td(""));
    return table(head, rows, { foot, className: "cp-shift-table" });
  };
  // Needed against planned per process: two columns side by side, the planned one in the alert colour when it is short.
  const pairBars = (s) => {
    const r = s.result;
    const items = r.rows.filter((row) => row.rated);
    const W = 640, H = 300, left = 44, right = 14, top = 30, bottom = 52;
    const plotW = W - left - right, plotH = H - top - bottom;
    const max = CK.niceMax(Math.max(1, ...items.map((row) => Math.max(row.need, row.planned || 0))));
    const y = (v) => top + plotH - (v / max) * plotH;
    const svg = CK.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": tx("Heads needed and planned per process"), class: "ck-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.append(CK.svgEl("title", {}, tx("Heads needed and planned per process")));
    CK.ticks(0, max, 4).filter(Number.isInteger).forEach((v) => {
      svg.append(CK.svgEl("line", { x1: left, x2: W - right, y1: y(v), y2: y(v), stroke: CK.C.grid }));
      svg.append(CK.svgEl("text", { x: left - 8, y: y(v) + 4, "text-anchor": "end", "font-size": 12, fill: CK.C.muted }, int.format(v)));
    });
    const band = plotW / (items.length || 1);
    const barW = Math.max(6, Math.min(30, band * 0.32));
    items.forEach((row, i) => {
      const cx = left + band * i + band / 2;
      const g = CK.svgEl("g");
      const tip = `${row.name}\n${needLabel()}: ${int.format(row.need)}\n${tx("Planned")}: ${row.planned === null ? "–" : int.format(row.planned)}${row.gapHours !== null ? `\n${tx("Gap (hours)")}: ${signedHours(row.gapHours)}` : ""}`;
      g.setAttribute("data-tip", tip);
      g.classList.add("ck-hit");
      g.append(CK.svgEl("rect", { x: cx - band / 2, y: top, width: band, height: plotH, fill: "transparent" }));
      const bar = (x, v, fill) => {
        if (!(v > 0)) return;
        g.append(CK.svgEl("rect", { x, y: y(v), width: barW, height: Math.max(1, y(0) - y(v)), rx: 2, fill }));
        g.append(CK.svgEl("text", { x: x + barW / 2, y: y(v) - 5, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: CK.C.text }, int.format(v)));
      };
      bar(cx - barW - 2, row.need, CK.C.muted);
      if (row.planned !== null) bar(cx + 2, row.planned, row.planned < row.need ? CK.C.danger : CK.C.blue);
      svg.append(g);
      svg.append(CK.svgEl("text", { x: cx, y: top + plotH + 18, "text-anchor": "middle", "font-size": 12, fill: CK.C.text }, row.name.length > Math.max(6, Math.floor(band / 7)) ? `${row.name.slice(0, Math.max(5, Math.floor(band / 7)) - 1)}…` : row.name));
    });
    svg.append(CK.svgEl("text", { x: left, y: 16, "font-size": 12, fill: CK.C.muted }, tx("people")));
    return svg;
  };
  const optionsList = (s) => {
    const r = s.result;
    const list = el("ul", "cp-options");
    r.options.forEach((o) => {
      const li = el("li");
      const head = el("p", "cp-option-head");
      head.append(el("strong", null, o.name || tx("Whole team")), ` · ${tx("{hours} short", { hours: hoursText(o.short) })}`);
      li.append(head);
      const steps = el("ul", "cp-option-steps");
      o.moves.forEach((m) => {
        const who = m.names.length && !(r.skillsAnon) ? ` (${m.names.join(", ")})` : "";
        steps.append(el("li", null, `${tx("Move {people} from {process} for {hours}", { people: peopleText(m.people), process: m.name, hours: hoursText(m.hours) })}${who} · ${tx("level 3 or above on both processes")}${m.byShift ? "" : ` · ${tx("the Skills Matrix has no one on this shift, so the whole team is counted")}`}.`));
      });
      // Spare hours that cannot be counted as a move: no matrix at all (one line), a process not rated, nobody qualified.
      const spareText = (list) => list.map((b) => `${b.name} ${hoursText(b.hours)}`).join(", ");
      const noMatrix = o.blocked.filter((b) => b.missing === "matrix");
      if (noMatrix.length) steps.append(el("li", "cp-blocked", tx("Spare hours elsewhere ({list}), but there is no Skills Matrix in this browser: the skills data is missing, so no move is counted.", { list: spareText(noMatrix) })));
      const unrated = new Map();
      o.blocked.filter((b) => b.status === "missing" && b.missing !== "matrix").forEach((b) => { if (!unrated.has(b.missing)) unrated.set(b.missing, []); unrated.get(b.missing).push(b); });
      unrated.forEach((list, task) => steps.append(el("li", "cp-blocked", tx("Spare hours elsewhere ({list}), but {task} is not a task in the Skills Matrix: the skills data is missing, so no move is counted.", { list: spareText(list), task }))));
      const few = o.blocked.filter((b) => b.status === "few");
      if (few.length) steps.append(el("li", "cp-blocked", tx("Spare hours elsewhere ({list}), but nobody free on this shift is at level 3 or above on both processes.", { list: spareText(few) })));
      if (o.rest > 0) {
        const tooMany = o.planned !== null && o.overtimePeople > o.planned;
        const vars = { hours: hoursText(o.rest), ot: hoursText(o.overtime), people: peopleText(o.overtimePeople), max: maxText(), agency: agencyText(o.agency) };
        steps.append(el("li", null, o.moves.length ? tx("Then the remaining {hours}: {ot} of overtime ({people}, up to {max} each) or {agency}.", vars) : tx("Close it with {ot} of overtime ({people}, up to {max} each) or {agency}.", vars)));
        if (tooMany) steps.append(el("li", "cp-blocked", tx("Overtime alone needs more people than are planned on {process}.", { process: o.name || tx("the whole team") })));
      } else steps.append(el("li", null, tx("Closed by the moves.")));
      li.append(steps);
      list.append(li);
    });
    return list;
  };
  const summaryText = (a, s) => {
    const r = s.result;
    const shift = state.shifts.find((x) => x.name === s.shift);
    const lines = [`${cfg.text.tool} · ${shiftLabel(s.key)} (${showDate(s.date)})`, `${tx("Productive hours per person")}: ${phText(shift)}`];
    lines.push(`${tx("Forecast")}: ${a.units.map((u) => `${amount(s.row.v[u.key] || 0)} ${u.label}`).join(", ")}`);
    lines.push("", `${tx("Process")}: ${tx("volume ÷ rate = hours → heads (incl. absence) · planned · gap")}`);
    r.rows.forEach((row) => {
      if (!row.rated) { lines.push(`- ${row.name}: ${tx("no rate")}`); return; }
      lines.push(`- ${row.name}: ${amount(row.volume)} ÷ ${rateText(row.uph)} = ${hoursText(row.hours)} → ${int.format(row.heads)} (${int.format(row.gross)})${row.planned === null ? "" : ` · ${tx("planned")} ${int.format(row.planned)} · ${signed(row.gapHeads)} (${signedHours(row.gapHours)})`}`);
    });
    const t = r.totals;
    lines.push(`${tx("Total")}: ${hoursText(t.hours)} → ${int.format(t.heads)} (${int.format(t.gross)})${t.planned === null ? "" : ` · ${tx("planned")} ${int.format(t.planned)} · ${signed(t.gapHeads)} (${signedHours(t.gapHours)})`}`);
    if (r.bottleneck) lines.push(tx("Bottleneck: {process}, {pct} of its volume", { process: r.bottleneck.name, pct: covText(r.bottleneck.coverage) }));
    const first = r.rows.find((row) => row.rated && row.volume > 0);
    if (first) lines.push(`${tx("Takt")}: ${tx("one {unit} every {t} ({net} net ÷ {n})", { unit: first.driver, t: taktText(first.takt), net: hoursText(r.net), n: amount(first.volume) })}`);
    if (r.options.length) {
      lines.push("", `${tx("To close the gap")}:`);
      optionLines(s).forEach((line) => lines.push(`- ${line}`));
    }
    return lines.join("\n");
  };
  const csvRows = (a) => {
    const rows = [[tx("Date"), tx("Shift"), tx("Process"), tx("Unit"), tx("Volume"), tx("Rate (UPH)"), tx("Hours needed"), tx("Productive hours per person"), tx("Heads"), tx("Incl. absence"), tx("Planned"), tx("Gap (heads)"), tx("Gap (hours)"), tx("Capacity"), tx("Coverage"), tx("Takt (s)")]];
    const r2 = (v) => (v === null ? "" : Math.round(v * 100) / 100);
    a.list.forEach((s) => s.result.rows.forEach((row) => rows.push([s.date, s.shift, row.name, row.driver, r2(row.volume), row.uph === null ? "" : row.uph, r2(row.hours), r2(s.result.ph), row.heads, row.gross,
      row.planned === null ? "" : row.planned, row.gapHeads === null ? "" : row.gapHeads, r2(row.gapHours), r2(row.capacity), row.coverage === null ? "" : Math.round(row.coverage * 1000) / 1000, row.takt === null ? "" : Math.round(row.takt * 100) / 100])));
    return rows;
  };
  const exportPlan = (kind) => {
    const a = analyse();
    if (!a.list.length) { flash(forecastStatus, tx("Add the forecast first: the planned heads belong to a day and a shift.")); return; }
    (kind === "xlsx" ? downloadXlsx : downloadCsv)(cfg.text.csvName, csvRows(a));
  };
  q("[data-csv]").addEventListener("click", () => exportPlan("csv"));
  q("[data-xlsx]").addEventListener("click", () => exportPlan("xlsx"));

  // The printed plan of one day (A4): every shift with its processes, the options to close a gap and a signature.
  const printSheet = (a, date) => {
    const out = [];
    const head = el("div", "cp-print-head");
    head.append(el("p", "kicker", `${cfg.text.tool}${siteText() ? ` · ${siteText()}` : ""}`), el("h2", null, `${tx("Shift plan")} · ${dayText(date)} ${showDate(date)}`));
    head.append(el("p", "cp-print-meta", `${tx("Productive hours per person = (length − unpaid breaks − paid breaks and briefing) × utilisation")} · ${tx("absence allowance")} ${shareText(settings().absenteeism)} · ${state.mode === "confirmed" ? tx("planned heads are confirmed") : tx("planned heads are rostered")}`));
    out.push(head);
    a.list.filter((s) => s.date === date).forEach((s) => {
      const r = s.result;
      const shift = state.shifts.find((x) => x.name === s.shift);
      out.push(el("h3", null, `${s.shift} · ${a.units.map((u) => `${amount(s.row.v[u.key] || 0)} ${u.label}`).join(", ")}`));
      out.push(el("p", "cp-print-meta", `${tx("Productive hours per person")}: ${phText(shift)}${r.bottleneck ? ` · ${tx("Bottleneck: {process}, {pct} of its volume", { process: r.bottleneck.name, pct: covText(r.bottleneck.coverage) })}` : ""}`));
      const t = el("table", "cp-print-table");
      const thead = el("thead");
      const htr = el("tr");
      [tx("Process"), tx("Volume"), tx("Rate (UPH)"), tx("Hours needed"), tx("Heads"), tx("Incl. absence"), tx("Planned"), tx("Gap (heads)"), tx("Gap (hours)"), tx("Actual")].forEach((label, i) => htr.append(el("th", i ? "num" : null, label)));
      thead.append(htr);
      const tbody = el("tbody");
      r.rows.forEach((row) => {
        const tr = el("tr");
        tr.append(el("td", null, row.name), el("td", "num", `${amount(row.volume)} ${row.driver}`), el("td", "num", row.rated ? rateText(row.uph) : "–"), el("td", "num", row.rated ? num(row.hours, 1) : "–"),
          el("td", "num", int.format(row.heads)), el("td", "num", int.format(row.gross)), el("td", "num", row.planned === null ? "" : int.format(row.planned)),
          el("td", "num", row.gapHeads === null ? "" : signed(row.gapHeads)), el("td", "num", row.gapHours === null ? "" : signedHours(row.gapHours)), el("td", "cp-print-blank", ""));
        tbody.append(tr);
      });
      const tr = el("tr", "cp-print-total");
      tr.append(el("td", null, tx("Total")), el("td"), el("td"), el("td", "num", num(r.totals.hours, 1)), el("td", "num", int.format(r.totals.heads)), el("td", "num", int.format(r.totals.gross)),
        el("td", "num", r.totals.planned === null ? "" : int.format(r.totals.planned)), el("td", "num", r.totals.gapHeads === null ? "" : signed(r.totals.gapHeads)), el("td", "num", r.totals.gapHours === null ? "" : signedHours(r.totals.gapHours)), el("td", "cp-print-blank", ""));
      tbody.append(tr);
      t.append(thead, tbody);
      out.push(t);
      if (r.options.length) {
        const ul = el("ul", "cp-print-options");
        optionLines(s).forEach((line) => ul.append(el("li", null, `☐ ${line}`)));
        out.push(ul);
      }
    });
    out.push(el("p", "cp-print-sign", `${cfg.text.owner}: ____________________   ${tx("Date")}: __________`));
    return out;
  };
  let printing = false;
  window.addEventListener("beforeprint", () => {
    const a = analyse();
    const view = pickView(a);
    if (!view || !printBox) return;
    printBox.replaceChildren(...printSheet(a, view.date));
    printBox.hidden = false;
    document.documentElement.classList.add("cp-printing");
    printing = true;
  });
  window.addEventListener("afterprint", () => {
    if (!printing) return;
    printing = false;
    document.documentElement.classList.remove("cp-printing");
    printBox.hidden = true;
    printBox.replaceChildren();
  });

  const renderResults = () => {
    exampleNote.hidden = !state.example;
    results.replaceChildren();
    const a = analyse();
    const view = pickView(a);
    if (!view) { results.hidden = true; return; }
    results.hidden = false;
    const r = view.result;
    r.skillsAnon = Boolean(a.model?.anon);
    const planned = a.list.filter((s) => s.result.mode !== "none");
    const shortShifts = a.list.filter((s) => s.result.status === "short");
    const sum = (list, fn) => list.reduce((t, s) => t + fn(s), 0);
    const needOf = (s) => (s.result.mode === "total" ? s.result.totals.pooledNeed : s.result.totals.need);

    const head = el("div", "result-head cp-head");
    const dates = [...new Set(a.list.map((s) => s.date))];
    head.append(el("p", "kicker", `${cfg.text.tool}${siteText() ? ` · ${siteText()}` : ""} · ${dates.length > 1 ? `${showDate(dates[0])} – ${showDate(dates.at(-1))}` : showDate(dates[0])}`));
    const h2 = el("h2");
    if (!planned.length) h2.append(tx("{n} person-shifts needed", { n: int.format(sum(a.list, needOf)) }), el("span", null, ` · ${tx("nothing planned yet")}`));
    else if (shortShifts.length) h2.append(tx("{a} of {b} shifts", { a: int.format(shortShifts.length), b: int.format(planned.length) }), el("span", null, ` · ${tx("short of hours")}`));
    else h2.append(tx("{a} of {b} shifts", { a: int.format(planned.length), b: int.format(planned.length) }), el("span", null, ` · ${tx("covered")}`));
    head.append(h2, el("p", "cp-meta", [a.procs.length === 1 ? tx("1 process") : tx("{n} processes", { n: int.format(a.procs.length) }), tx("utilisation {p}", { p: shareText(a.set.utilisation) }), tx("absence allowance {p}", { p: shareText(a.set.absenteeism) }), state.mode === "confirmed" ? tx("planned heads are confirmed") : tx("planned heads are rostered")].join(" · ")));

    // The week in numbers: the person-shifts needed and planned, the hours and the peak day.
    const byDay = new Map();
    a.list.forEach((s) => byDay.set(s.date, (byDay.get(s.date) || 0) + needOf(s)));
    const peak = [...byDay].sort((x, y) => y[1] - x[1])[0];
    const plannedHeads = sum(planned, (s) => s.result.totals.planned);
    const neededPlanned = sum(planned, needOf);
    const gapHours = sum(planned, (s) => s.result.totals.gapHours);
    const stats = el("div", "dl-stats cp-stats");
    stats.append(
      stat(tx("Hours needed"), num(sum(a.list, (s) => s.result.totals.hours), 0), tx("labour hours over {n} shifts", { n: int.format(a.list.length) })),
      stat(needLabel(), int.format(sum(a.list, needOf)), tx("person-shifts, rounded per process")),
      stat(tx("Planned"), planned.length ? int.format(plannedHeads) : "–", planned.length ? tx("person-shifts on {n} shifts", { n: int.format(planned.length) }) : tx("nothing planned yet")),
      stat(tx("Gap"), planned.length ? signed(plannedHeads - neededPlanned) : "–", planned.length ? tx("heads; in hours {h}", { h: signedHours(gapHours) }) : tx("type the planned heads")),
      stat(tx("Peak day"), peak ? dayText(peak[0]) : "–", peak ? tx("{n} person-shifts", { n: int.format(peak[1]) }) : ""),
    );

    // The shift shown: its picker, its table and the chart of needed against planned.
    const pick = el("div", "field cp-pick");
    const pickLabel = el("label", null, tx("Show results for"));
    pickLabel.htmlFor = "cp-view";
    const select = el("select");
    select.id = "cp-view";
    select.dataset.focusKey = "cp-view";
    fill(select, a.list.map((s) => [s.key, `${shiftLabel(s.key)}${s.result.status === "short" ? ` · ${tx("short")}` : ""}`]), view.key);
    select.addEventListener("change", () => { state.view = select.value; save(); renderPlanned(); keepFocus(renderResults); });
    pick.append(pickLabel, select);
    const shiftPanel = el("article", "dl-panel cp-shift-panel");
    const shift = state.shifts.find((x) => x.name === view.shift);
    shiftPanel.append(el("h3", "result-label", shiftLabel(view.key)));
    shiftPanel.append(el("p", "dl-panel-note", `${tx("Productive hours per person")}: ${phText(shift)}`), el("p", "dl-panel-note", tx("Hours needed = volume ÷ rate; heads = hours ÷ productive hours, rounded up; incl. absence = heads ÷ (1 − {a}), rounded up.", { a: shareText(a.set.absenteeism) })));
    shiftPanel.append(shiftTable(view));
    const notes = [];
    if (r.mode === "total") notes.push(tx("Planned as a total of {n}: the team counts as one pool across the processes, against {need} pooled heads ({h} ÷ {ph}, rounded up, then for absence).", { n: int.format(r.totals.planned), need: int.format(r.totals.pooledNeed), h: hoursText(r.totals.hours), ph: hoursText(r.ph) }));
    if (r.mode === "process" && r.status === "rounding") notes.push(tx("Short in heads, not in hours: the rounding up per process and for absence. One person who works two processes covers it."));
    if (r.mode !== "total" && r.totals.pooled < r.totals.heads) notes.push(tx("With people who move between processes, {n} heads would do instead of {m} ({g} instead of {h} incl. absence): the fractions of each process are pooled.", { n: int.format(r.totals.pooled), m: int.format(r.totals.heads), g: int.format(r.totals.pooledGross), h: int.format(r.totals.gross) }));
    if (r.unrated.length) notes.push(tx("No rate yet: {names}. They are left out until they have one.", { names: r.unrated.join(", ") }));
    if (a.dupes.length) notes.push(tx("Twice in the forecast, only the first row counts: {list}.", { list: [...new Set(a.dupes)].map(shiftLabel).join(", ") }));
    if (a.undated) notes.push(tx("{n} forecast rows without a date or a known shift are left out.", { n: int.format(a.undated) }));
    notes.forEach((line) => shiftPanel.append(el("p", "form-note cp-note", line)));
    if (CK && r.rows.some((row) => row.rated)) {
      shiftPanel.append(CK.figure(pairBars(view), { fileName: `shift-capacity-${view.date}` }));
      shiftPanel.append(CK.legend([{ label: needLabel(), color: CK.C.muted }, { label: tx("Planned"), color: CK.C.blue }, { label: tx("Planned, short"), color: CK.C.danger }]));
    }

    // Start here: the shift shown, its gap and the ways to close it.
    const t = r.totals;
    const shortNames = r.options.map((o) => o.name).filter(Boolean);
    const advice = cfg.advice[r.status === "short" ? "short" : r.status === "rounding" ? "rounding" : r.status === "ok" ? "ok" : "none"];
    const lede = r.status === "none"
      ? tx("The forecast needs {hours} of work: {heads} heads, {need} to plan with the absence allowance.", { hours: hoursText(t.hours), heads: int.format(t.heads), need: int.format(t.need) })
      : r.status === "short"
        ? `${tx("{hours} short on {names}.", { hours: hoursText(r.options.reduce((x, o) => x + o.short, 0)), names: shortNames.length ? shortNames.join(", ") : tx("the whole team") })}${r.bottleneck ? ` ${tx("The bottleneck is {process}: the planned team covers {pct} of its volume.", { process: r.bottleneck.name, pct: covText(r.bottleneck.coverage) })}` : ""}`
        : `${tx("The planned team brings {available} for {hours} of work.", { available: hoursText(t.available), hours: hoursText(t.hours) })}${r.bottleneck ? ` ${tx("The tightest process is {process} at {pct} of its volume.", { process: r.bottleneck.name, pct: covText(r.bottleneck.coverage) })}` : ""}`;
    const focus = focusCard({
      title: shiftLabel(view.key),
      detail: r.mode === "none" ? tx("nothing planned yet") : t.gapHeads < 0 ? (t.gapHeads === -1 ? tx("1 head short") : tx("{n} heads short", { n: int.format(-t.gapHeads) })) : t.gapHeads > 0 ? (t.gapHeads === 1 ? tx("1 head spare") : tx("{n} heads spare", { n: int.format(t.gapHeads) })) : tx("planned as needed"),
      lede, advice,
    });
    if (r.options.length) {
      const label = el("p", "result-label", tx("To close the gap"));
      const list = optionsList(view);
      const question = focus.querySelector("blockquote")?.previousElementSibling;
      if (question) question.before(label, list); else focus.append(label, list);
    }
    const problem = r.status === "short" ? tx("{shift}: {hours} short on {names}", { shift: shiftLabel(view.key), hours: hoursText(r.options.reduce((x, o) => x + o.short, 0)), names: shortNames.join(", ") || tx("the whole team") }) : "";
    const actions = resultActions(() => summaryText(a, view), problem);
    const target = r.status === "short" ? view : shortShifts[0] || null;
    if (Actions && target) {
      const link = Actions.linkButton(target === view ? tx("Add to actions") : tx("Add {shift} to actions", { shift: shiftLabel(target.key) }), () => gapAction(target));
      actions.append(link);
    }
    const skillsLink = el("a", "button-ghost", cfg.text.skillsName);
    skillsLink.href = new URL("../skills-matrix/", window.location.href).href;
    actions.append(skillsLink);

    // The details: the week by shift, the heads per day by process, capacity against volume, the formulas.
    const panels = [];
    const weekPanel = panel(tx("The week, shift by shift"), tx("Pick a shift to see its processes. The gap in hours is exact; the gap in heads is in whole people."));
    weekPanel.classList.add("cp-panel-week");
    const primary = a.units[0];
    weekPanel.append(table([[tx("Shift"), false], [primary ? primary.label : tx("Volume"), true], [tx("Hours needed"), true], [needLabel(), true], [tx("Planned"), true], [tx("Gap (heads)"), true], [tx("Gap (hours)"), true], [cfg.text.bottleneck, false], ["", false]],
      a.list.map((s) => {
        const tr = el("tr");
        if (s.key === view.key) tr.classList.add("is-current");
        const st = s.result.totals;
        const show = el("button", "button-ghost cp-small", s.key === view.key ? tx("Shown") : tx("Show"));
        show.type = "button";
        show.dataset.focusKey = `cp-show:${s.key}`;
        show.setAttribute("aria-pressed", String(s.key === view.key));
        show.setAttribute("aria-label", `${tx("Show")} ${shiftLabel(s.key)}`);
        show.addEventListener("click", () => { state.view = s.key; save(); renderPlanned(); keepFocus(renderResults); });
        tr.append(td(shiftLabel(s.key)), td(primary ? amount(s.row.v[primary.key] || 0) : "", "num"), td(num(st.hours, 1), "num"), td(int.format(needOf(s)), "num"), td(st.planned === null ? "–" : int.format(st.planned), "num"),
          gapCell(st.gapHeads), gapCell(st.gapHours, 1, true), td(s.result.bottleneck ? `${s.result.bottleneck.name} · ${covText(s.result.bottleneck.coverage)}` : s.result.mode === "total" ? `${tx("pooled")} · ${covText(st.coverage)}` : "–"), td(show));
        return tr;
      }), { className: "cp-week-table" }));
    panels.push(weekPanel);
    if (CK) {
      const procNames = a.procs.filter((p) => p.uph > 0).map((p) => p.name);
      const groups = dates.map((date) => ({
        label: dayText(date),
        parts: a.procs.filter((p) => p.uph > 0).map((p) => ({ key: p.name, value: a.list.filter((s) => s.date === date).reduce((x, s) => x + (s.result.rows.find((row) => row.id === p.id)?.need || 0), 0) })),
      }));
      const dayPanel = panel(tx("Heads needed per day, by process"), tx("Every shift of the day added up, {what}: the peak day shows where the roster must grow.", { what: state.mode === "confirmed" ? tx("without the absence allowance") : tx("incl. the absence allowance") }));
      dayPanel.append(CK.figure(CK.stacked(groups, { keys: procNames, title: tx("Heads needed per day, by process"), unit: tx("people") }), { fileName: "shift-capacity-week" }));
      panels.push(dayPanel);
      if (primary && planned.length) {
        const points = (fn) => a.list.map((s) => ({ x: `${weekday(s.date)} ${s.shift.slice(0, 3)}`, ...fn(s) }));
        const vol = points((s) => ({ y: s.row.v[primary.key] || 0, tip: `${shiftLabel(s.key)}: ${amount(s.row.v[primary.key] || 0)} ${primary.label}` }));
        const cap = points((s) => {
          const flow = s.result.flows[primary.key];
          const volume = s.row.v[primary.key] || 0;
          if (!isNum(flow) || s.result.mode === "none") return { y: NaN };
          return { y: flow * volume, state: flow < 1 - EPS ? "danger" : "ok", tip: `${shiftLabel(s.key)}: ${tx("capacity {n}", { n: `${amount(flow * volume)} ${primary.label}` })} · ${covText(flow)}` };
        });
        const capPanel = panel(tx("Capacity against volume"), tx("What the planned team can handle in {unit}, limited by its tightest process, against the forecast. A large red point is a shift that cannot clear its volume as planned; its tip gives the share.", { unit: primary.label }));
        capPanel.append(CK.figure(CK.line([{ label: tx("Forecast"), points: vol, color: CK.C.muted }, { label: tx("Capacity"), points: cap, color: CK.C.blue }], { title: tx("Capacity against volume"), unit: primary.label, format: (v) => amount(v) }), { fileName: "shift-capacity-vs-volume" }));
        panels.push(capPanel);
      }
    }
    const formula = panel(tx("How it is worked out"));
    formula.classList.add("cp-panel-formula");
    const fl = el("ul", "cp-formulas");
    [
      tx("Productive hours per person = (length − unpaid breaks − paid breaks and briefing) × utilisation"),
      tx("Hours needed = volume ÷ units per productive hour (UPH); the volume is the forecast × the conversion"),
      tx("Heads = hours needed ÷ productive hours per person, rounded up"),
      tx("Heads incl. absence = heads ÷ (1 − absence allowance), rounded up"),
      tx("Capacity = planned heads × productive hours × UPH (rostered heads after the absence allowance)"),
      tx("Bottleneck = the process with the lowest capacity against its volume"),
      tx("Takt = net shift time ÷ volume"),
      tx("Overtime hours = hours short ÷ utilisation; agency heads = hours short ÷ productive hours, rounded up"),
    ].forEach((line) => fl.append(el("li", null, line)));
    formula.append(fl);
    panels.push(formula);
    resultLayout(results, { head, stats, notes: [pick, shiftPanel], focus, actions, panels });
  };

  const renderAll = () => {
    renderTemplates();
    renderProcesses();
    renderStudy();
    renderShifts();
    renderSettings();
    renderForecast();
    renderPaste();
    renderPlanned();
    renderResults();
  };
  renderAll();
  // The Skills Matrix or the Time Study may change in another tab.
  window.addEventListener("storage", (event) => {
    if (event.key === SKILLS_KEY) { renderProcesses(); renderResults(); }
    if (event.key === STUDY_KEY) renderStudy();
  });
})();
