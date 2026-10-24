// Project Portfolio: several DMAIC improvement projects at once. Each project moves through Define, Measure, Analyze,
// Improve and Control with a tollgate at the end of each phase, and carries the worksheets its phases need: the charter,
// SIPOC, CTQ tree, RACI and Kano, the baseline with DPMO, sigma, RTY and COPQ, the savings and the control plan. The
// portfolio shows where every project stands. The arithmetic lives in window.PortfolioMath so the tests can call it.
(() => {
  // Arithmetic -------------------------------------------------------------------------------------------------------
  const PHASES = ["define", "measure", "analyze", "improve", "control"];
  const STATUSES = ["on-track", "at-risk", "late", "on-hold", "closed"];
  const BELTS = ["yellow", "green", "black", "mbb", "lead"];
  const RACI_LETTERS = ["", "R", "A", "C", "I", "AR"];
  const KANO = ["M", "O", "A", "I", "R", "Q"];
  const SIPOC = ["s", "i", "p", "o", "c"];
  const COPQ = ["internal", "external", "appraisal", "prevention"];
  const DAY = 864e5;

  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const text = (value, max = 600) => (typeof value === "string" ? value.slice(0, max) : typeof value === "number" && Number.isFinite(value) ? String(value) : "");
  const isoDate = (value) => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "");
  const isoMonth = (value) => (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : "");
  // A number typed or saved: a blank box is no number, not a zero.
  const numberOr = (value) => {
    const n = typeof value === "string" ? (value.trim() === "" ? NaN : Number(value.replace(",", "."))) : value;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  };
  const shiftDay = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const addMonths = (month, n) => {
    const [y, m] = month.split("-").map(Number);
    const index = y * 12 + (m - 1) + n;
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
  };
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY);

  // Defects per million opportunities. Fewer than zero defects, or more defects than opportunities, is a typing error.
  const dpmo = (defects, units, opps = 1) => {
    const d = numberOr(defects), u = numberOr(units), o = numberOr(opps) ?? 1;
    if (d === null || !(u > 0) || !(o > 0) || d < 0 || d > u * o) return null;
    return (d / (u * o)) * 1e6;
  };
  // The short-term sigma level of ToolKit (with the usual 1.5 shift), from a DPMO.
  const sigma = (value) => (value === null || value === undefined || !window.ToolKit ? null : window.ToolKit.sigma(value / 1e6));
  // RTY: the first-pass yields of the steps multiplied. A step without a yield is left out, not counted as 100%.
  const fpy = (value) => { const n = numberOr(value); return n !== null && n >= 0 && n <= 100 ? n / 100 : null; };
  const rty = (steps) => {
    const list = (Array.isArray(steps) ? steps : []).map((s) => ({ step: text(s?.step), fpy: fpy(s?.fpy) })).filter((s) => s.fpy !== null);
    if (!list.length) return null;
    const value = list.reduce((product, s) => product * s.fpy, 1);
    const weakest = list.reduce((low, s) => (s.fpy < low.fpy ? s : low));
    return { value, loss: 1 - value, steps: list.length, weakest };
  };
  // COPQ in euros a month: the failures (internal and external) are the waste, appraisal and prevention its price.
  const copq = (costs = {}) => {
    const v = Object.fromEntries(COPQ.map((key) => [key, Math.max(0, numberOr(costs?.[key]) ?? 0)]));
    const failure = v.internal + v.external;
    const month = failure + v.appraisal + v.prevention;
    return { ...v, failure, month, year: month * 12, failureShare: month ? failure / month : null };
  };
  const copqTotals = (projects) => (projects || []).reduce((sum, p) => {
    const c = copq(p.copq);
    ["internal", "external", "appraisal", "prevention", "failure", "month", "year"].forEach((key) => { sum[key] += c[key]; });
    return sum;
  }, { internal: 0, external: 0, appraisal: 0, prevention: 0, failure: 0, month: 0, year: 0 });

  // RACI: every activity needs exactly one A and at least one R. "AR" is one person who is both.
  const hasA = (letter) => letter === "A" || letter === "AR";
  const hasR = (letter) => letter === "R" || letter === "AR";
  const raciCheck = (raci = {}) => {
    const people = Array.isArray(raci.people) ? raci.people : [];
    const rows = (Array.isArray(raci.rows) ? raci.rows : []).filter((row) => text(row?.activity).trim() || (row?.cells || []).some(Boolean));
    const checked = rows.map((row) => {
      const cells = people.map((_, i) => (RACI_LETTERS.includes(row.cells?.[i]) ? row.cells[i] : ""));
      const a = cells.filter(hasA).length;
      const r = cells.filter(hasR).length;
      const problems = [...(a === 0 ? ["noA"] : a > 1 ? ["manyA"] : []), ...(r === 0 ? ["noR"] : [])];
      return { activity: text(row.activity), a, r, problems, ok: !problems.length };
    });
    const load = people.map((person, i) => ({ person, a: rows.filter((row) => hasA(row.cells?.[i])).length, r: rows.filter((row) => hasR(row.cells?.[i])).length }));
    return { rows: checked, ok: checked.every((row) => row.ok), problems: checked.filter((row) => !row.ok).length, load };
  };

  // Kano: the standard evaluation table. Rows are the answer to the functional question (the feature is there),
  // columns the answer to the dysfunctional one (it is not); both in the order like, expect, neutral, live with,
  // dislike. A attractive, O one-dimensional, M must-be, I indifferent, R reverse, Q questionable.
  const KANO_TABLE = ["QAAAO", "RIIIM", "RIIIM", "RIIIM", "RRRRQ"];
  const answer = (value) => { const n = numberOr(value); return Number.isInteger(n) && n >= 0 && n <= 4 ? n : null; };
  const kanoClass = (functional, dysfunctional) => {
    const f = answer(functional), d = answer(dysfunctional);
    return f === null || d === null ? null : KANO_TABLE[f][d];
  };
  const kanoOf = (row) => (KANO.includes(row?.set) ? row.set : kanoClass(row?.functional, row?.dysfunctional));
  const kanoCounts = (rows) => {
    const counts = Object.fromEntries(KANO.map((key) => [key, 0]));
    (rows || []).forEach((row) => { const k = kanoOf(row); if (k) counts[k] += 1; });
    return counts;
  };

  // Tollgates: a phase closes when the sponsor has signed (name and date) and its checklist is complete, or with a
  // written reason why it closes with open points.
  const REASON_MIN = 10;
  const readiness = (gate = {}, total = 0) => {
    const checks = Array.isArray(gate.checks) ? gate.checks : [];
    const done = Array.from({ length: total }, (_, i) => checks[i] === true).filter(Boolean).length;
    const complete = total > 0 && done === total;
    const sponsor = text(gate.sponsor).trim() !== "";
    const date = isoDate(gate.date) !== "";
    const reason = text(gate.reason).trim().length >= REASON_MIN;
    const missing = [...(!complete && !reason ? ["checks"] : []), ...(!sponsor ? ["sponsor"] : []), ...(!date ? ["date"] : [])];
    return { done, total, complete, share: total ? done / total : 0, signed: sponsor && date, reason, canClose: !missing.length, missing, closed: gate.closed === true };
  };
  // The gate at the end of the phase the project is in; none once Control has closed.
  const nextGate = (project) => {
    if (!project || project.status === "closed") return null;
    const phase = PHASES.includes(project.phase) ? project.phase : "define";
    return project.gates?.[phase]?.closed ? null : phase;
  };
  // Closing a gate: the earlier gates must be closed, the gate must be ready. The project moves to the next phase on
  // the day of the sign-off; closing Control closes the project. Returns a new project, or the reason it cannot close.
  const closeGate = (project, phase, total) => {
    const index = PHASES.indexOf(phase);
    if (index < 0) return { ok: false, why: "phase" };
    if (PHASES.slice(0, index).some((p) => !project.gates?.[p]?.closed)) return { ok: false, why: "order" };
    const ready = readiness(project.gates?.[phase], total);
    if (!ready.canClose) return { ok: false, why: "missing", missing: ready.missing };
    const next = JSON.parse(JSON.stringify(project));
    next.gates[phase].closed = true;
    const signed = next.gates[phase].date;
    if (phase === "control") {
      next.status = "closed";
      next.phase = "control";
    } else {
      const following = PHASES[index + 1];
      next.phase = following;
      next.phaseDates = { ...next.phaseDates, [following]: signed };
    }
    return { ok: true, project: next };
  };
  const daysInPhase = (project, day) => {
    const since = isoDate(project?.phaseDates?.[project.phase]) || isoDate(project?.start);
    return since && day ? Math.max(0, daysBetween(since, day)) : null;
  };

  // Savings: the hard savings a year are planned in twelve equal months from the month they start; what was realised
  // is entered month by month.
  const plannedMonths = (project) => {
    const hard = numberOr(project?.savings?.hard);
    const from = isoDate(project?.savings?.from);
    if (!(hard > 0) || !from) return [];
    return Array.from({ length: 12 }, (_, i) => ({ month: addMonths(from.slice(0, 7), i), amount: hard / 12 }));
  };
  const savingsByMonth = (projects, year) => {
    const months = Array.from({ length: 12 }, (_, i) => ({ month: `${year}-${String(i + 1).padStart(2, "0")}`, planned: 0, realised: 0 }));
    const at = new Map(months.map((m) => [m.month, m]));
    (projects || []).forEach((project) => {
      plannedMonths(project).forEach(({ month, amount }) => { if (at.has(month)) at.get(month).planned += amount; });
      (project?.savings?.realised || []).forEach((row) => {
        const amount = numberOr(row?.amount);
        if (at.has(row?.month) && amount !== null) at.get(row.month).realised += amount;
      });
    });
    return months;
  };
  const savingsYear = (projects, year) => {
    const months = savingsByMonth(projects, year);
    return { planned: months.reduce((s, m) => s + m.planned, 0), realised: months.reduce((s, m) => s + m.realised, 0), months };
  };

  // The numbers of one project, before and after.
  const numbers = (project) => {
    const before = dpmo(project?.base?.defects, project?.base?.units, project?.base?.opps);
    const after = dpmo(project?.after?.defects, project?.after?.units, project?.after?.opps);
    return { dpmoBefore: before, dpmoAfter: after, sigmaBefore: sigma(before), sigmaAfter: sigma(after), rty: rty(project?.rty), copq: copq(project?.copq) };
  };

  // The portfolio in numbers.
  const summary = (projects, day, { limit = 45, counts = {} } = {}) => {
    const list = projects || [];
    const open = list.filter((p) => p.status !== "closed");
    const byPhase = Object.fromEntries(PHASES.map((phase) => [phase, open.filter((p) => p.phase === phase).length]));
    const atRisk = open.filter((p) => p.status === "at-risk" || p.status === "late");
    const long = open.filter((p) => (daysInPhase(p, day) ?? 0) > limit);
    const overdue = open.filter((p) => { const gate = nextGate(p); const planned = gate && isoDate(p.gates?.[gate]?.planned); return planned && planned < day; });
    const year = Number(String(day).slice(0, 4));
    const savings = savingsYear(list, year);
    const ready = open.map((p) => { const gate = nextGate(p); return gate ? readiness(p.gates?.[gate], counts[gate] || 0) : null; }).filter(Boolean);
    return { projects: list.length, open: open.length, closed: list.length - open.length, byPhase, atRisk: atRisk.length, late: open.filter((p) => p.status === "late").length, long: long.length, overdue: overdue.length, year, savings, copq: copqTotals(open), readyToClose: ready.filter((r) => r.canClose).length };
  };

  // Projects from anywhere (saved, the example) are rebuilt field by field.
  let counter = 0;
  const newId = () => `p${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const lines = (value, max = 20) => (Array.isArray(value) ? value.map((item) => text(item, 200).trim()).filter(Boolean).slice(0, max) : []);
  const cleanGate = (raw) => ({
    checks: Array.isArray(raw?.checks) ? raw.checks.slice(0, 12).map((c) => c === true) : [],
    planned: isoDate(raw?.planned), sponsor: text(raw?.sponsor, 120), date: isoDate(raw?.date), reason: text(raw?.reason, 600), closed: raw?.closed === true,
  });
  const rowsOf = (raw, fields, max = 40) => (Array.isArray(raw) ? raw.slice(0, max).filter(isObject).map((row) => Object.fromEntries(Object.entries(fields).map(([key, kind]) => [key,
    kind === "number" ? numberOr(row[key]) : kind === "answer" ? answer(row[key]) : kind === "kano" ? (KANO.includes(row[key]) ? row[key] : "") : kind === "month" ? isoMonth(row[key]) : text(row[key], 400)]))) : []);
  const cleanProject = (raw) => {
    if (!isObject(raw)) return null;
    const people = lines(raw.raci?.people, 12);
    return {
      id: typeof raw.id === "string" && raw.id ? raw.id.slice(0, 40) : newId(),
      title: text(raw.title, 200), lead: text(raw.lead, 120), belt: BELTS.includes(raw.belt) ? raw.belt : "green", sponsor: text(raw.sponsor, 120), area: text(raw.area, 120),
      start: isoDate(raw.start), end: isoDate(raw.end),
      phase: PHASES.includes(raw.phase) ? raw.phase : "define", status: STATUSES.includes(raw.status) ? raw.status : "on-track",
      phaseDates: Object.fromEntries(PHASES.map((p) => [p, isoDate(raw.phaseDates?.[p])]).filter(([, d]) => d)),
      charter: Object.fromEntries(["problem", "goal", "scopeIn", "scopeOut", "team"].map((key) => [key, text(raw.charter?.[key], 1000)])),
      sipoc: Object.fromEntries(SIPOC.map((key) => [key, lines(raw.sipoc?.[key])])),
      ctq: rowsOf(raw.ctq, { need: "text", driver: "text", ctq: "text", spec: "text" }),
      raci: { people, rows: (Array.isArray(raw.raci?.rows) ? raw.raci.rows : []).slice(0, 40).filter(isObject).map((row) => ({ activity: text(row.activity, 200), cells: people.map((_, i) => (RACI_LETTERS.includes(row.cells?.[i]) ? row.cells[i] : "")) })) },
      kano: rowsOf(raw.kano, { feature: "text", functional: "answer", dysfunctional: "answer", set: "kano" }),
      base: { defects: numberOr(raw.base?.defects), units: numberOr(raw.base?.units), opps: numberOr(raw.base?.opps) ?? 1 },
      after: { defects: numberOr(raw.after?.defects), units: numberOr(raw.after?.units), opps: numberOr(raw.after?.opps) ?? 1 },
      rty: rowsOf(raw.rty, { step: "text", fpy: "number" }),
      copq: Object.fromEntries(COPQ.map((key) => [key, numberOr(raw.copq?.[key])])),
      savings: { hard: numberOr(raw.savings?.hard), from: isoDate(raw.savings?.from), soft: text(raw.savings?.soft, 400), softValue: numberOr(raw.savings?.softValue), realised: rowsOf(raw.savings?.realised, { month: "month", amount: "number" }, 60) },
      control: rowsOf(raw.control, { what: "text", spec: "text", method: "text", frequency: "text", owner: "text", reaction: "text" }),
      gates: Object.fromEntries(PHASES.map((p) => [p, cleanGate(raw.gates?.[p])])),
    };
  };
  const blankProject = (day, title = "") => cleanProject({ title, start: day, phase: "define", status: "on-track", phaseDates: { define: day } });
  // The example of the data file as projects, its dates counted in days (and months) from the given day.
  const fromExample = (example, day, counts = {}) => (example?.projects || []).map((raw) => {
    const at = (value) => (Number.isInteger(value) ? shiftDay(day, value) : isoDate(value));
    const month = day.slice(0, 7);
    return cleanProject({
      ...raw, id: undefined, start: at(raw.start), end: at(raw.end),
      phaseDates: Object.fromEntries(Object.entries(raw.phaseDates || {}).map(([p, v]) => [p, at(v)])),
      savings: { ...raw.savings, from: at(raw.savings?.from), realised: (raw.savings?.realised || []).map((r) => ({ month: Number.isInteger(r.month) ? addMonths(month, r.month) : r.month, amount: r.amount })) },
      gates: Object.fromEntries(Object.entries(raw.gates || {}).map(([p, g]) => [p, { ...g, planned: at(g.planned), date: at(g.date), checks: Number.isInteger(g.checks) ? Array.from({ length: counts[p] || 0 }, (_, i) => i < g.checks) : g.checks }])),
    });
  });

  window.PortfolioMath = {
    PHASES, STATUSES, KANO, KANO_TABLE, RACI_LETTERS, numberOr, addMonths, daysBetween, dpmo, sigma, fpy, rty, copq, copqTotals, raciCheck, kanoClass, kanoOf, kanoCounts,
    readiness, nextGate, closeGate, daysInPhase, plannedMonths, savingsByMonth, savingsYear, numbers, summary, cleanProject, blankProject, fromExample,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-project-portfolio]");
  const dataEl = document.getElementById("project-portfolio-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { tx, int, pct, num, el, read, write, firstVisit, today, showDate, panel, stat, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx, LOCALE, LANG, monthYear } = kit;
  const CK = window.ChartKit;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const COL = cfg.columns;
  const counts = Object.fromEntries(PHASES.map((p) => [p, (cfg.tollgates[p] || []).length]));
  const LIMIT = cfg.limits?.daysInPhase || 45;
  const euro0 = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const money = (value) => euro0.format(Math.round(value || 0));
  const phaseName = (phase) => cfg.phases[phase]?.name || phase;
  const phaseLabel = (phase) => `${cfg.phases[phase]?.letter || ""} · ${phaseName(phase)}`;
  const statusState = { "on-track": "ok", "at-risk": "warn", late: "danger", "on-hold": "muted", closed: "muted" };
  const kanoName = (key) => cfg.kano.categories[key]?.[0] || key;
  const raciLabel = (letter) => (letter === "AR" ? "A/R" : letter);
  const sigmaShow = (value) => (value === null ? "–" : num(value, 2));
  const dpmoShow = (value) => (value === null ? "–" : int.format(Math.round(value)));

  const results = document.querySelector("[data-results]");
  const tabs = root.querySelector("[data-tabs]");
  const empty = root.querySelector("[data-empty]");
  const countNote = root.querySelector("[data-count]");
  const status = root.querySelector("[data-status]");
  const editor = root.querySelector("[data-editor]");
  const fields = [...root.querySelectorAll("[data-f]")];
  const areaList = root.querySelector("[data-area-list]");

  // State: the projects, the one open in the editor, and whether the example is loaded.
  const state = { projects: [], current: "", example: false };
  const saved = read(KEY, null);
  if (isObject(saved)) {
    state.projects = (Array.isArray(saved.projects) ? saved.projects : []).slice(0, 60).map(cleanProject).filter(Boolean);
    state.current = typeof saved.current === "string" ? saved.current : "";
    state.example = saved.example === true;
  }
  const save = () => write(KEY, state);
  const current = () => state.projects.find((p) => p.id === state.current) || state.projects[0] || null;
  const loadExample = () => {
    state.projects = fromExample(cfg.example, today(), counts);
    state.current = state.projects[0]?.id || "";
    state.example = true;
  };
  // A first visit opens on the example, so the portfolio is visible at once; the note above it says so.
  if (!state.projects.length && firstVisit(KEY)) loadExample();

  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    Object.assign(state, { projects: [], current: "", example: false });
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);
  // The visitor's own first change ends the example: the projects stay, the note goes.
  const own = () => { if (state.example) { state.example = false; note.hidden = true; } };

  // Paths into a project ("charter.problem", "gates.define.sponsor").
  const getPath = (obj, path) => path.split(".").reduce((o, key) => (o === null || o === undefined ? undefined : o[key]), obj);
  const setPath = (obj, path, value) => {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((o, key) => { if (!isObject(o[key])) o[key] = {}; return o[key]; }, obj);
    target[last] = value;
  };

  // The project tabs -------------------------------------------------------------------------------------------------
  const renderTabs = () => {
    const p = current();
    tabs.replaceChildren(...state.projects.map((project, i) => {
      const button = el("button", "pp-tab");
      button.type = "button";
      button.setAttribute("aria-pressed", String(project.id === p?.id));
      button.append(el("span", "pp-tab-phase", cfg.phases[project.phase]?.letter || ""), el("span", "pp-tab-name", project.title || tx("Project {n}", { n: i + 1 })));
      button.title = `${phaseName(project.phase)} · ${cfg.statuses[project.status]}`;
      button.addEventListener("click", () => select(project.id));
      return button;
    }));
    empty.hidden = state.projects.length > 0;
    editor.hidden = !p;
    root.querySelector("[data-remove-project]").hidden = !p;
    countNote.textContent = state.projects.length ? tx("{n} projects", { n: int.format(state.projects.length) }) : "";
  };
  const select = (id) => {
    state.current = id;
    save();
    renderAll();
  };

  // Fields -----------------------------------------------------------------------------------------------------------
  const readField = (input) => {
    const kind = input.dataset.kind;
    if (kind === "lines") return input.value.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 20);
    if (kind === "list") return input.value.split(/[,;]/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
    if (kind === "number") return numberOr(input.value);
    if (kind === "date") return isoDate(input.value);
    return input.value.slice(0, 1000);
  };
  const showField = (input, value) => {
    const kind = input.dataset.kind;
    input.value = kind === "lines" ? (value || []).join("\n") : kind === "list" ? (value || []).join(", ") : value === null || value === undefined ? "" : String(value);
  };
  const fillFields = () => {
    const p = current();
    if (!p) return;
    fields.forEach((input) => showField(input, getPath(p, input.dataset.f)));
    // The areas: the workplace profile first, then the data file's, then those already used.
    const profile = window.Workplace ? window.Workplace.areas().map((a) => a.name) : [];
    areaList.replaceChildren(...[...new Set([...profile, ...cfg.areas, ...state.projects.map((x) => x.area)])].filter(Boolean).map((name) => { const o = el("option"); o.value = name; return o; }));
  };
  fields.forEach((input) => {
    const event = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";
    input.addEventListener(event, () => {
      const p = current();
      if (!p) return;
      const path = input.dataset.f;
      const value = readField(input);
      // The people of a RACI are its columns: the letters stay with their place.
      if (path === "raci.people") {
        p.raci.people = value;
        p.raci.rows.forEach((row) => { row.cells = value.map((_, i) => row.cells[i] || ""); });
        raciEditor.render();
      } else setPath(p, path, value);
      if (path === "phase" && !p.phaseDates[value]) p.phaseDates[value] = today();
      own();
      save();
      if (path === "title" || path === "phase" || path === "status") renderTabs();
      if (path.startsWith("gates.")) renderGates();
      renderOutputs();
      renderSoon();
    });
  });

  // Row tables (CTQ, Kano, RTY, realised savings, control plan) --------------------------------------------------------
  const answerOptions = () => [["", "–"], ...cfg.kano.answers.map((label, i) => [String(i), `${i + 1} · ${label}`])];
  const tableEditor = (name, path, columns, blank) => {
    const box = root.querySelector(`[data-table="${name}"]`);
    const wrap = el("div", "dl-table-wrap pp-edit-wrap");
    wrap.tabIndex = 0;
    const table = el("table", "dl-table pp-edit");
    const head = el("tr");
    columns.forEach((c) => { const th = el("th", c.type === "out" ? "pp-out-col" : null, c.label); th.scope = "col"; head.append(th); });
    const thTools = el("th");
    thTools.scope = "col";
    thTools.append(el("span", "visually-hidden", tx("Row tools")));
    head.append(thTools);
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    table.append(thead, body);
    wrap.append(table);
    const add = el("button", "button-secondary pp-add", tx("+ Add a row"));
    add.type = "button";
    const note = el("p", "form-note");
    note.setAttribute("aria-live", "polite");
    box.append(wrap, add, note);
    const rows = () => getPath(current(), path);
    const updateOut = (tr, row) => columns.forEach((c, i) => { if (c.type === "out") tr.children[i].textContent = c.value(row); });
    const render = () => {
      const list = rows() || [];
      body.replaceChildren(...list.map((row, index) => {
        const tr = el("tr");
        columns.forEach((c) => {
          const td = el("td", c.type === "out" ? "pp-out-col" : null);
          if (c.type === "out") { td.textContent = c.value(row); tr.append(td); return; }
          const input = el(c.type === "select" ? "select" : c.type === "area" ? "textarea" : "input", `pp-in${c.wide ? " pp-wide" : ""}`);
          if (c.type === "select") {
            c.options().forEach(([value, label]) => { const o = el("option", null, label); o.value = value; input.append(o); });
            input.value = row[c.key] === null || row[c.key] === undefined ? "" : String(row[c.key]);
          } else {
            if (c.type === "area") input.rows = 2;
            if (c.type === "number") { input.type = "number"; input.step = "any"; input.inputMode = "decimal"; }
            if (c.type === "month") { input.type = "month"; input.placeholder = "YYYY-MM"; }
            if (!c.type || c.type === "text") input.autocomplete = "off";
            input.value = row[c.key] === null || row[c.key] === undefined ? "" : String(row[c.key]);
          }
          input.setAttribute("aria-label", `${c.label} · ${tx("row {n}", { n: index + 1 })}`);
          input.addEventListener(c.type === "select" || c.type === "month" ? "change" : "input", () => {
            const v = input.value;
            row[c.key] = c.type === "number" ? numberOr(v) : c.type === "month" ? isoMonth(v) : c.key === "functional" || c.key === "dysfunctional" ? answer(v) : v.slice(0, 400);
            updateOut(tr, row);
            own();
            save();
            renderOutputs();
            renderSoon();
          });
          td.append(input);
          tr.append(td);
        });
        const tools = el("td", "pp-row-tools");
        const remove = el("button", "dl-remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${tx("Remove")} · ${tx("row {n}", { n: index + 1 })}`);
        remove.addEventListener("click", () => {
          const list2 = rows();
          const [gone] = list2.splice(index, 1);
          own();
          save();
          render();
          renderOutputs();
          renderSoon();
          (body.querySelector(".dl-remove") || add).focus();
          undoNote(note, tx("Row {n} removed.", { n: index + 1 }), () => {
            rows().splice(Math.min(index, rows().length), 0, gone);
            save();
            render();
            renderOutputs();
            renderSoon();
          });
        });
        tools.append(remove);
        tr.append(tools);
        return tr;
      }));
      wrap.hidden = !list.length;
    };
    add.addEventListener("click", () => {
      const list = rows();
      if (!list) return;
      list.push(blank());
      own();
      save();
      render();
      renderSoon();
      body.lastElementChild?.querySelector("input, select, textarea")?.focus();
    });
    return { render };
  };
  const C = COL;
  const editors = [
    tableEditor("ctq", "ctq", [
      { key: "need", label: C.ctq.need, type: "area" }, { key: "driver", label: C.ctq.driver, type: "area" },
      { key: "ctq", label: C.ctq.ctq, type: "area", wide: true }, { key: "spec", label: C.ctq.spec },
    ], () => ({ need: current()?.ctq.at(-1)?.need || "", driver: "", ctq: "", spec: "" })),
    tableEditor("kano", "kano", [
      { key: "feature", label: C.kano.feature, type: "area", wide: true },
      { key: "functional", label: `1 · ${C.kano.functional}`, type: "select", options: answerOptions },
      { key: "dysfunctional", label: `2 · ${C.kano.dysfunctional}`, type: "select", options: answerOptions },
      { key: "set", label: C.kano.set, type: "select", options: () => [["", cfg.kano.auto], ...KANO.filter((k) => k !== "Q").map((k) => [k, kanoName(k)])] },
      { key: "category", label: C.kano.category, type: "out", value: (row) => { const k = kanoOf(row); return k ? kanoName(k) : "–"; } },
    ], () => ({ feature: "", functional: null, dysfunctional: null, set: "" })),
    tableEditor("rty", "rty", [
      { key: "step", label: C.rty.step, wide: true }, { key: "fpy", label: C.rty.fpy, type: "number" },
    ], () => ({ step: "", fpy: null })),
    tableEditor("realised", "savings.realised", [
      { key: "month", label: C.realised.month, type: "month" }, { key: "amount", label: C.realised.amount, type: "number" },
    ], () => { const last = current()?.savings.realised.at(-1)?.month; return { month: last ? addMonths(last, 1) : today().slice(0, 7), amount: null }; }),
    tableEditor("control", "control", [
      { key: "what", label: C.control.what, type: "area", wide: true }, { key: "spec", label: C.control.spec, type: "area" },
      { key: "method", label: C.control.method, type: "area" }, { key: "frequency", label: C.control.frequency },
      { key: "owner", label: C.control.owner }, { key: "reaction", label: C.control.reaction, type: "area", wide: true },
    ], () => ({ what: "", spec: "", method: "", frequency: "", owner: "", reaction: "" })),
  ];

  // RACI: one row per activity, one column per person, one letter per cell, and the check at the end of the row.
  const raciProblem = (key) => ({ noA: tx("no A"), manyA: tx("more than one A"), noR: tx("no R") }[key]);
  const raciEditor = (() => {
    const box = root.querySelector("[data-raci]");
    const wrap = el("div", "dl-table-wrap pp-edit-wrap");
    wrap.tabIndex = 0;
    const add = el("button", "button-secondary pp-add", tx("+ Add an activity"));
    add.type = "button";
    const note = el("p", "form-note");
    note.setAttribute("aria-live", "polite");
    box.append(wrap, add, note);
    const checkCell = (td, row, people) => {
      const result = raciCheck({ people, rows: [row] }).rows[0];
      td.replaceChildren(result ? el("span", `pp-check ${result.ok ? "is-ok" : "is-bad"}`, result.ok ? `✓ ${tx("OK")}` : `! ${result.problems.map(raciProblem).join(", ")}`) : "");
    };
    const render = () => {
      const p = current();
      if (!p) return;
      const people = p.raci.people;
      add.disabled = !people.length;
      if (!people.length) { wrap.replaceChildren(el("p", "form-note", tx("Add the people or roles first."))); return; }
      const table = el("table", "dl-table pp-edit pp-raci");
      const head = el("tr");
      [C.raci.activity, ...people, C.raci.check].forEach((label) => { const th = el("th", null, label); th.scope = "col"; head.append(th); });
      const thTools = el("th");
      thTools.append(el("span", "visually-hidden", tx("Row tools")));
      head.append(thTools);
      const thead = el("thead");
      thead.append(head);
      const body = el("tbody");
      p.raci.rows.forEach((row, index) => {
        const tr = el("tr");
        const activity = el("textarea", "pp-in pp-wide");
        activity.rows = 2;
        activity.value = row.activity;
        activity.setAttribute("aria-label", `${C.raci.activity} · ${tx("row {n}", { n: index + 1 })}`);
        const tdActivity = el("td");
        tdActivity.append(activity);
        tr.append(tdActivity);
        const check = el("td", "pp-out-col");
        const changed = () => { checkCell(check, row, people); own(); save(); renderOutputs(); renderSoon(); };
        activity.addEventListener("input", () => { row.activity = activity.value.slice(0, 200); changed(); });
        people.forEach((person, i) => {
          const td = el("td");
          const pick = el("select", "pp-in pp-letter-select");
          RACI_LETTERS.forEach((letter) => { const o = el("option", null, letter ? raciLabel(letter) : "–"); o.value = letter; pick.append(o); });
          pick.value = row.cells[i] || "";
          pick.setAttribute("aria-label", `${person} · ${row.activity || tx("row {n}", { n: index + 1 })}`);
          pick.addEventListener("change", () => { row.cells[i] = pick.value; changed(); });
          td.append(pick);
          tr.append(td);
        });
        checkCell(check, row, people);
        tr.append(check);
        const tools = el("td", "pp-row-tools");
        const remove = el("button", "dl-remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${tx("Remove")} · ${tx("row {n}", { n: index + 1 })}`);
        remove.addEventListener("click", () => {
          const [gone] = p.raci.rows.splice(index, 1);
          own();
          save();
          render();
          renderOutputs();
          renderSoon();
          undoNote(note, tx("Row {n} removed.", { n: index + 1 }), () => {
            p.raci.rows.splice(Math.min(index, p.raci.rows.length), 0, gone);
            save();
            render();
            renderOutputs();
            renderSoon();
          });
        });
        tools.append(remove);
        tr.append(tools);
        body.append(tr);
      });
      table.append(thead, body);
      wrap.replaceChildren(table);
    };
    add.addEventListener("click", () => {
      const p = current();
      if (!p || !p.raci.people.length) return;
      p.raci.rows.push({ activity: "", cells: p.raci.people.map(() => "") });
      own();
      save();
      render();
      renderSoon();
      wrap.querySelector("tbody tr:last-child textarea")?.focus();
    });
    return { render };
  })();

  // Tollgates --------------------------------------------------------------------------------------------------------
  const gateBoxes = [...root.querySelectorAll("[data-gate]")];
  const missingText = (missing) => missing.map((key) => ({ checks: tx("tick every point or write a reason"), sponsor: tx("the sponsor's name"), date: tx("the date of the sign-off") }[key])).join(", ");
  const renderGates = () => {
    const p = current();
    if (!p) return;
    const next = nextGate(p);
    gateBoxes.forEach((box) => {
      const phase = box.dataset.gate;
      const gate = p.gates[phase];
      const ready = readiness(gate, counts[phase]);
      box.querySelectorAll("[data-gate-check]").forEach((input) => { input.checked = gate.checks[Number(input.dataset.index)] === true; });
      box.classList.toggle("is-closed", gate.closed);
      box.classList.toggle("is-next", phase === next);
      const sum = box.querySelector("[data-gate-sum]");
      sum.textContent = gate.closed ? `· ${tx("closed")}${gate.date ? ` ${showDate(gate.date)}` : ""}` : `· ${tx("{a} of {b}", { a: ready.done, b: ready.total })}${phase === next ? ` · ${tx("next")}` : ""}`;
      box.querySelector("[data-close-gate]").hidden = gate.closed;
      box.querySelector("[data-reopen-gate]").hidden = !gate.closed;
      const line = box.querySelector("[data-gate-status]");
      line.textContent = gate.closed
        ? tx("Closed: signed by {name} on {date}.", { name: gate.sponsor || "–", date: gate.date ? showDate(gate.date) : "–" }) + (ready.complete ? "" : ` ${tx("Closed with open points:")} ${gate.reason}`)
        : ready.canClose ? tx("Ready to close.") : tx("To close it: {missing}.", { missing: missingText(ready.missing) });
    });
  };
  root.addEventListener("change", (event) => {
    const box = event.target.closest?.("[data-gate-check]");
    if (!box) return;
    const p = current();
    if (!p) return;
    const phase = box.dataset.gateCheck;
    const checks = p.gates[phase].checks;
    while (checks.length < counts[phase]) checks.push(false);
    checks[Number(box.dataset.index)] = box.checked;
    own();
    save();
    renderGates();
    renderSoon();
  });
  root.querySelectorAll("[data-close-gate]").forEach((button) => button.addEventListener("click", () => {
    const p = current();
    if (!p) return;
    const phase = button.dataset.closeGate;
    const line = root.querySelector(`[data-gate-status="${phase}"]`);
    const result = closeGate(p, phase, counts[phase]);
    if (!result.ok) {
      line.textContent = result.why === "order" ? tx("Close the earlier tollgates first.") : tx("Not yet. To close it: {missing}.", { missing: missingText(result.missing || []) });
      return;
    }
    Object.assign(p, result.project);
    own();
    save();
    renderAll();
    const next = PHASES[PHASES.indexOf(phase) + 1];
    flash(status, next ? tx("Tollgate closed. The project is now in {phase}.", { phase: phaseName(next) }) : tx("Control closed: the project is closed."));
    if (next) root.querySelector(`[data-gate="${next}"]`)?.setAttribute("open", "");
  }));
  root.querySelectorAll("[data-reopen-gate]").forEach((button) => button.addEventListener("click", () => {
    const p = current();
    if (!p) return;
    const phase = button.dataset.reopenGate;
    // Reopening a gate reopens the ones after it: a later phase cannot stand on an open one.
    PHASES.slice(PHASES.indexOf(phase)).forEach((later) => { p.gates[later].closed = false; });
    p.phase = phase;
    if (p.status === "closed") p.status = "on-track";
    own();
    save();
    renderAll();
  }));

  // Inline results under the worksheets -------------------------------------------------------------------------------
  const outputs = Object.fromEntries([...root.querySelectorAll("[data-out]")].map((node) => [node.dataset.out, node]));
  const sipocText = (p) => {
    const steps = p.sipoc.p.length;
    const missing = SIPOC.filter((key) => !p.sipoc[key].length).map((key) => cfg.sipoc.find((part) => part[0] === key)[1]);
    const parts = [steps >= 5 && steps <= 7 ? tx("Process: {n} steps.", { n: steps }) : tx("Process: {n} steps. A SIPOC has 5 to 7: group the small ones or split the large ones.", { n: steps })];
    if (missing.length) parts.push(tx("Still empty: {list}.", { list: missing.join(", ") }));
    return parts.join(" ");
  };
  const charterText = (p) => {
    const c = p.charter;
    const gaps = [];
    if (c.problem.trim() && !/\d/.test(c.problem)) gaps.push(tx("the problem has no number yet"));
    if (!c.goal.trim()) gaps.push(tx("no goal yet"));
    if (!c.scopeOut.trim()) gaps.push(tx("nothing is out of scope yet"));
    return gaps.length ? `${tx("Check")}: ${gaps.join(", ")}.` : c.problem.trim() ? tx("The charter has a problem with a number, a goal and a scope.") : "";
  };
  const numbersText = (p) => {
    const n = numbers(p);
    if (n.dpmoBefore === null) return tx("Enter the defects and the units of the baseline to get the DPMO and the sigma level.");
    const before = tx("Before: DPMO {dpmo} · sigma {sigma}", { dpmo: dpmoShow(n.dpmoBefore), sigma: sigmaShow(n.sigmaBefore) });
    return n.dpmoAfter === null ? before : `${before} → ${tx("after: DPMO {dpmo} · sigma {sigma}", { dpmo: dpmoShow(n.dpmoAfter), sigma: sigmaShow(n.sigmaAfter) })}`;
  };
  const rtyText = (p) => {
    const r = rty(p.rty);
    return r ? tx("RTY {rty}: of 100 units, {good} pass every step right the first time. Weakest step: {step} ({fpy}).", { rty: pct(r.value, 1), good: num(r.value * 100, 1), step: r.weakest.step || "–", fpy: pct(r.weakest.fpy, 1) }) : "";
  };
  const copqText = (p) => {
    const c = copq(p.copq);
    return c.month ? tx("COPQ {month} a month, {year} a year; {share} of it is failure.", { month: money(c.month), year: money(c.year), share: pct(c.failureShare, 0) }) : "";
  };
  const savingsText = (p) => {
    const y = savingsYear([p], Number(today().slice(0, 4)));
    return y.planned || y.realised ? tx("This year: {realised} realised of {planned} planned.", { realised: money(y.realised), planned: money(y.planned) }) : "";
  };
  const raciText = (p) => {
    const check = raciCheck(p.raci);
    if (!check.rows.length) return "";
    return check.ok ? tx("Every activity has one A and at least one R.") : tx("{n} of {total} activities need a fix: exactly one A and at least one R each.", { n: check.problems, total: check.rows.length });
  };
  const renderOutputs = () => {
    const p = current();
    if (!p) return;
    outputs.charter.textContent = charterText(p);
    outputs.sipoc.textContent = sipocText(p);
    outputs.numbers.textContent = numbersText(p);
    outputs.rty.textContent = rtyText(p);
    outputs.copq.textContent = copqText(p);
    outputs.savings.textContent = savingsText(p);
    outputs.raci.textContent = raciText(p);
  };

  // Exports ----------------------------------------------------------------------------------------------------------
  const P = COL.portfolio;
  const projectRow = (p, day) => {
    const n = numbers(p);
    const gate = nextGate(p);
    const ready = gate ? readiness(p.gates[gate], counts[gate]) : null;
    const y = savingsYear([p], Number(day.slice(0, 4)));
    const round = (v, d) => (v === null ? "" : Number(v.toFixed(d)));
    return [p.title, p.lead, cfg.belts[p.belt], p.sponsor, p.area, p.start, p.end, phaseName(p.phase), cfg.statuses[p.status],
      gate ? phaseName(gate) : "", gate ? p.gates[gate].planned : "", ready ? `${ready.done}/${ready.total}` : "", daysInPhase(p, day) ?? "",
      round(n.dpmoBefore, 0), round(n.sigmaBefore, 2), round(n.dpmoAfter, 0), round(n.sigmaAfter, 2), n.rty ? round(n.rty.value * 100, 1) : "",
      Math.round(n.copq.month), p.savings.hard ?? "", p.savings.soft, p.savings.softValue ?? "", Math.round(y.planned), Math.round(y.realised)];
  };
  const sheetRows = () => {
    const day = today();
    return [[P.project, P.lead, P.belt, P.sponsor, P.area, P.start, P.end, P.phase, P.status, P.gate, P.gateDate, P.ready, P.days,
      P.dpmoBefore, P.sigmaBefore, P.dpmoAfter, P.sigmaAfter, `${P.rty} %`, P.copq, P.hard, P.soft, P.softValue, P.planned, P.realised], ...state.projects.map((p) => projectRow(p, day))];
  };
  const problemOf = (p) => (p ? (p.charter.problem.trim() || p.title).slice(0, 600) : "");
  const projectText = (p) => {
    const n = numbers(p);
    const gate = nextGate(p);
    const ready = gate ? readiness(p.gates[gate], counts[gate]) : null;
    const lines2 = [
      `${p.title || tx("Project")} · ${phaseName(p.phase)} · ${cfg.statuses[p.status]}`,
      [p.lead && `${tx("Project lead")}: ${p.lead} (${cfg.belts[p.belt]})`, p.sponsor && `${tx("Sponsor")}: ${p.sponsor}`, p.area].filter(Boolean).join(" · "),
    ];
    if (p.charter.problem) lines2.push(`${tx("Problem")}: ${p.charter.problem}`);
    if (p.charter.goal) lines2.push(`${tx("Goal")}: ${p.charter.goal}`);
    if (n.dpmoBefore !== null) lines2.push(numbersText(p));
    if (n.rty) lines2.push(`RTY ${pct(n.rty.value, 1)}`);
    if (n.copq.month) lines2.push(copqText(p));
    if (gate) lines2.push(`${COL.portfolio.gate}: ${phaseName(gate)}${p.gates[gate].planned ? ` (${showDate(p.gates[gate].planned)})` : ""} · ${tx("{a} of {b}", { a: ready.done, b: ready.total })}`);
    return lines2.filter(Boolean).join("\n");
  };
  const summaryText = (sum) => {
    const day = today();
    const head = [
      `${cfg.text.tool} · ${showDate(day)}`,
      `${tx("Open projects")}: ${sum.open} · ${PHASES.map((ph) => `${cfg.phases[ph].letter} ${sum.byPhase[ph]}`).join(" · ")}`,
      `${tx("At risk or late")}: ${sum.atRisk}${sum.long ? ` · ${tx("{n} over {d} days in one phase", { n: sum.long, d: LIMIT })}` : ""}`,
      `${tx("Savings {year}", { year: sum.year })}: ${money(sum.savings.realised)} ${tx("realised of {planned} planned", { planned: money(sum.savings.planned) })}`,
    ];
    return [...head, "", ...state.projects.map((p, i) => `${i + 1}. ${projectText(p).split("\n").join("\n   ")}`)].join("\n");
  };
  const fileSlug = (p) => (p.title || "project").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "project";

  // Word: the one page of a project as a document (DocxKit).
  const wordFile = (p) => {
    const D = window.DocxKit;
    if (!D || !p) return null;
    const { run, para, TEXT_WIDTH } = D;
    const GREY = '<w:color w:val="555555"/>';
    const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
    const body = [];
    const heading = (value) => body.push(para(run(value), '<w:pStyle w:val="Heading1"/>'));
    const pair = (label, value) => { if (value) body.push(para(run(`${label}: `, "<w:b/>") + run(value))); };
    const edge = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BBBBBB"/>`;
    const tableXml = (rows) => {
      const width = Math.floor(TEXT_WIDTH / rows[0].length);
      const cell = (value, header) => {
        const parts = (Array.isArray(value) ? value : [value]).map((v) => String(v ?? "")).filter((v) => v !== "");
        return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${header ? '<w:shd w:val="clear" w:color="auto" w:fill="EEF2F7"/>' : ""}</w:tcPr>${(parts.length ? parts : ["–"]).map((v) => para(run(v, header ? "<w:b/>" : ""), '<w:spacing w:before="20" w:after="20"/>')).join("")}</w:tc>`;
      };
      return `<w:tbl><w:tblPr><w:tblW w:w="${TEXT_WIDTH}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(edge).join("")}</w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${rows[0].map(() => `<w:gridCol w:w="${width}"/>`).join("")}</w:tblGrid>${rows.map((row, i) => `<w:tr>${i === 0 ? "<w:trPr><w:tblHeader/></w:trPr>" : ""}${row.map((value) => cell(value, i === 0)).join("")}</w:tr>`).join("")}</w:tbl>`;
    };
    const n = numbers(p);
    body.push(para(run(p.title || cfg.text.tool), '<w:pStyle w:val="Title"/>'));
    body.push(para(run(metaLine(p), GREY + SMALL), '<w:spacing w:after="200"/>'));
    heading(cfg.sheets.charter);
    pair(tx("Problem statement"), p.charter.problem);
    pair(tx("Goal"), p.charter.goal);
    pair(tx("In scope"), p.charter.scopeIn);
    pair(tx("Out of scope"), p.charter.scopeOut);
    pair(tx("Team"), p.charter.team);
    if (SIPOC.some((key) => p.sipoc[key].length)) {
      heading(cfg.sheets.sipoc);
      body.push(tableXml([cfg.sipoc.map((part) => part[1]), SIPOC.map((key) => p.sipoc[key])]));
    }
    if (p.ctq.length) {
      heading(cfg.sheets.ctq);
      body.push(tableXml([[C.ctq.need, C.ctq.driver, C.ctq.ctq, C.ctq.spec], ...p.ctq.map((r) => [r.need, r.driver, r.ctq, r.spec])]));
    }
    heading(tx("Numbers"));
    pair(tx("Baseline"), n.dpmoBefore === null ? "" : `DPMO ${dpmoShow(n.dpmoBefore)} · ${tx("sigma level")} ${sigmaShow(n.sigmaBefore)}`);
    pair(tx("After the change"), n.dpmoAfter === null ? "" : `DPMO ${dpmoShow(n.dpmoAfter)} · ${tx("sigma level")} ${sigmaShow(n.sigmaAfter)}`);
    pair("RTY", n.rty ? pct(n.rty.value, 1) : "");
    pair("COPQ", n.copq.month ? `${money(n.copq.month)} / ${tx("month")} · ${money(n.copq.year)} / ${tx("year")}` : "");
    pair(tx("Hard savings"), p.savings.hard ? `${money(p.savings.hard)} / ${tx("year")}` : "");
    pair(tx("Soft savings"), [p.savings.soft, p.savings.softValue ? `≈ ${money(p.savings.softValue)} / ${tx("year")}` : ""].filter(Boolean).join(" · "));
    const raci = raciCheck(p.raci);
    if (raci.rows.length) {
      heading(cfg.sheets.raci);
      body.push(tableXml([[C.raci.activity, ...p.raci.people], ...p.raci.rows.map((r) => [r.activity, ...r.cells.map((c) => raciLabel(c))])]));
    }
    if (p.kano.length) {
      heading(cfg.sheets.kano);
      body.push(tableXml([[C.kano.feature, C.kano.category], ...p.kano.map((r) => [r.feature, kanoOf(r) ? kanoName(kanoOf(r)) : "–"])]));
    }
    if (p.control.length) {
      heading(tx("Control plan"));
      body.push(tableXml([[C.control.what, C.control.spec, C.control.method, C.control.frequency, C.control.owner, C.control.reaction], ...p.control.map((r) => [r.what, r.spec, r.method, r.frequency, r.owner, r.reaction])]));
    }
    heading(tx("Tollgates"));
    PHASES.forEach((phase) => body.push(para(run(`${phaseName(phase)}: `, "<w:b/>") + run(gateText(p, phase)))));
    return D.wordFile({ body, font: "Arial", accent: "0a6ab0", lang: LANG, title: p.title || cfg.text.tool, creator: p.lead });
  };
  const downloadWord = (p) => {
    const bytes = wordFile(p);
    if (!bytes) return;
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    link.download = `${fileSlug(p)}-${today()}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  window.PortfolioMath.wordFile = (id) => wordFile(state.projects.find((p) => p.id === id) || current());

  // Results ----------------------------------------------------------------------------------------------------------
  const metaLine = (p) => [p.lead && `${p.lead} (${cfg.belts[p.belt]})`, p.sponsor && `${tx("Sponsor")}: ${p.sponsor}`, p.area, (p.start || p.end) && `${p.start ? showDate(p.start) : "…"} → ${p.end ? showDate(p.end) : "…"}`, phaseName(p.phase), cfg.statuses[p.status]].filter(Boolean).join(" · ");
  const gateText = (p, phase) => {
    const gate = p.gates[phase];
    const ready = readiness(gate, counts[phase]);
    if (gate.closed) return `${tx("closed")} ${gate.date ? showDate(gate.date) : ""}${gate.sponsor ? ` · ${gate.sponsor}` : ""}${ready.complete ? "" : ` · ${tx("Closed with open points:")} ${gate.reason}`}`.trim();
    return `${tx("{a} of {b}", { a: ready.done, b: ready.total })}${gate.planned ? ` · ${tx("planned for {date}", { date: showDate(gate.planned) })}` : ""}`;
  };
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
      cells.forEach(([value, cls]) => { const td = el("td", cls); td.append(value ?? ""); tr.append(td); });
      tbody.append(tr);
    });
    tbl.append(thead, tbody);
    wrap.append(tbl);
    return wrap;
  };
  const chip = (statusKey) => el("span", `pp-status pp-status-${statusState[statusKey] || "muted"}`, cfg.statuses[statusKey]);
  const shortMonth = (month) => monthYear(new Date(`${month}-01T00:00:00Z`)).split(" ")[0];

  // What needs attention, most urgent first: late, a tollgate past its date, stuck in a phase, at risk, a RACI to fix.
  const attention = (day) => state.projects.filter((p) => p.status !== "closed" && p.status !== "on-hold").flatMap((p) => {
    const issues = [];
    const gate = nextGate(p);
    const planned = gate && p.gates[gate].planned;
    const days = daysInPhase(p, day);
    if (p.status === "late") issues.push([4, tx("late")]);
    if (planned && planned < day) issues.push([3, tx("the {phase} tollgate was planned for {date}", { phase: phaseName(gate), date: showDate(planned) })]);
    if (days !== null && days > LIMIT) issues.push([2, tx("{n} days in {phase}", { n: days, phase: phaseName(p.phase) })]);
    if (p.status === "at-risk") issues.push([2, tx("at risk")]);
    const raci = raciCheck(p.raci);
    if (raci.problems) issues.push([1, tx("{n} RACI rows to fix", { n: raci.problems })]);
    return issues.length ? [{ project: p, score: Math.max(...issues.map((i) => i[0])) * 10 + issues.length, issues: issues.sort((a, b) => b[0] - a[0]).map((i) => i[1]) }] : [];
  }).sort((a, b) => b.score - a.score);

  const focusCard = (day) => {
    const list = attention(day);
    const card = el("article", "result-card dl-focus pp-focus");
    card.append(el("p", "result-label", tx("Start here")));
    if (!list.length) {
      card.append(el("h3", null, tx("Every open project is on track.")), el("p", "dl-focus-lede", tx("Keep the tollgates on their dates and enter the realised savings each month.")));
      return card;
    }
    const top = list[0];
    const h3 = el("h3");
    h3.append(top.project.title || tx("Project"), el("span", null, ` · ${phaseName(top.project.phase)}`));
    card.append(h3, el("p", "dl-focus-lede", `${kit.capital(top.issues.join(", "))}.`));
    const gate = nextGate(top.project);
    if (gate) {
      const ready = readiness(top.project.gates[gate], counts[gate]);
      const open = cfg.tollgates[gate].filter((_, i) => top.project.gates[gate].checks[i] !== true);
      if (open.length) {
        card.append(el("p", "result-label", tx("Open on the {phase} tollgate ({a} of {b} done)", { phase: phaseName(gate), a: ready.done, b: ready.total })));
        const ol = el("ol", "moves");
        open.slice(0, 4).forEach((item) => ol.append(el("li", null, item)));
        card.append(ol);
      }
    }
    const goto = el("button", "button-secondary", tx("Open this project"));
    goto.type = "button";
    goto.addEventListener("click", () => { select(top.project.id); root.scrollIntoView?.({ behavior: "smooth", block: "start" }); });
    card.append(goto);
    if (list.length > 1) {
      card.append(el("p", "result-label", tx("Also needs attention")));
      const ul = el("ul", "pp-also");
      list.slice(1, 4).forEach((item) => ul.append(el("li", null, `${item.project.title || tx("Project")}: ${item.issues.join(", ")}`)));
      card.append(ul);
    }
    return card;
  };

  const portfolioTable = (day) => {
    const box = el("div", "pp-table-box");
    box.append(el("p", "result-label", tx("The portfolio")));
    box.append(table([[P.project], [P.phase], [P.status], [P.gate], [P.days, "num"], [tx("Sigma before → after"), "num"], [tx("Savings this year"), "num"]], state.projects.map((p) => {
      const n = numbers(p);
      const gate = nextGate(p);
      const ready = gate ? readiness(p.gates[gate], counts[gate]) : null;
      const planned = gate && p.gates[gate].planned;
      const days = daysInPhase(p, day);
      const y = savingsYear([p], Number(day.slice(0, 4)));
      const name = el("button", "pp-link", p.title || tx("Project"));
      name.type = "button";
      name.setAttribute("aria-pressed", String(p.id === current()?.id));
      name.addEventListener("click", () => select(p.id));
      const nameCell = el("span");
      nameCell.append(name, el("small", "pp-sub-line", [p.lead, p.area].filter(Boolean).join(" · ")));
      const gateCell = el("span");
      if (gate) {
        gateCell.append(`${phaseName(gate)} · ${tx("{a} of {b}", { a: ready.done, b: ready.total })}`);
        if (planned) gateCell.append(el("small", planned < day ? "pp-sub-line pp-late" : "pp-sub-line", `${showDate(planned)}${planned < day ? ` · ${tx("overdue")}` : ""}`));
      } else gateCell.append(tx("all closed"));
      const daysCell = el("span", days !== null && days > LIMIT ? "pp-flag" : null, days === null ? "–" : int.format(days));
      if (days !== null && days > LIMIT) daysCell.append(el("small", "pp-sub-line", `! ${tx("over {d}", { d: LIMIT })}`));
      const sigmaCell = `${sigmaShow(n.sigmaBefore)} → ${sigmaShow(n.sigmaAfter)}`;
      const savingCell = el("span", null, money(y.realised));
      savingCell.append(el("small", "pp-sub-line", tx("of {planned}", { planned: money(y.planned) })));
      return [[nameCell], [phaseLabel(p.phase)], [chip(p.status)], [gateCell], [daysCell, "num"], [sigmaCell, "num"], [savingCell, "num"]];
    }), "pp-portfolio"));
    return box;
  };

  // The one page of a project: charter, SIPOC, numbers, control plan, tollgates. It is what "Print this project" prints.
  const onePage = (p) => {
    const box = panel(tx("One page: {title}", { title: p.title || tx("Project") }), metaLine(p));
    box.classList.add("pp-onepage");
    const block = (title, ...content) => { const sec = el("section", "pp-op-block"); sec.append(el("h4", "pp-op-title", title), ...content); return sec; };
    const dl = (pairs) => { const list = el("dl", "pp-op-dl"); pairs.filter(([, v]) => v).forEach(([k, v]) => { const row = el("div"); row.append(el("dt", null, k), el("dd", null, v)); list.append(row); }); return list; };
    box.append(block(cfg.sheets.charter, dl([[tx("Problem statement"), p.charter.problem], [tx("Goal"), p.charter.goal], [tx("In scope"), p.charter.scopeIn], [tx("Out of scope"), p.charter.scopeOut], [tx("Team"), p.charter.team]])));
    if (SIPOC.some((key) => p.sipoc[key].length)) {
      const grid = el("div", "pp-op-sipoc");
      cfg.sipoc.forEach(([key, label]) => {
        const col = el("div", "pp-op-col");
        col.append(el("strong", null, `${key.toUpperCase()} · ${label}`));
        const ul = el("ul");
        p.sipoc[key].forEach((item) => ul.append(el("li", null, item)));
        col.append(ul);
        grid.append(col);
      });
      box.append(block(cfg.sheets.sipoc, grid));
    }
    const n = numbers(p);
    const y = savingsYear([p], Number(today().slice(0, 4)));
    const figures = el("div", "dl-stats pp-op-stats");
    figures.append(
      stat(tx("Sigma before → after"), `${sigmaShow(n.sigmaBefore)} → ${sigmaShow(n.sigmaAfter)}`, `DPMO ${dpmoShow(n.dpmoBefore)} → ${dpmoShow(n.dpmoAfter)}`),
      stat("RTY", n.rty ? pct(n.rty.value, 1) : "–", n.rty ? `${tx("weakest step")}: ${n.rty.weakest.step}` : ""),
      stat("COPQ", n.copq.month ? money(n.copq.month) : "–", n.copq.month ? tx("a month · {year} a year", { year: money(n.copq.year) }) : ""),
      stat(tx("Hard savings"), p.savings.hard ? money(p.savings.hard) : "–", tx("a year · {realised} realised this year", { realised: money(y.realised) })),
    );
    const numbersBlock = block(tx("Numbers"), figures);
    if (p.savings.soft) numbersBlock.append(el("p", "pp-op-note", `${tx("Soft savings")}: ${p.savings.soft}${p.savings.softValue ? ` (≈ ${money(p.savings.softValue)} / ${tx("year")})` : ""}`));
    box.append(numbersBlock);
    if (p.control.length) {
      box.append(block(tx("Control plan"), table([[C.control.what], [C.control.spec], [C.control.method], [C.control.frequency], [C.control.owner], [C.control.reaction]], p.control.map((r) => [[r.what], [r.spec], [r.method], [r.frequency], [r.owner], [r.reaction]]), "pp-op-table")));
    }
    const gates = el("ol", "pp-op-gates");
    PHASES.forEach((phase) => {
      const li = el("li", p.gates[phase].closed ? "is-closed" : null);
      li.append(el("strong", null, `${p.gates[phase].closed ? "✓" : "○"} ${phaseName(phase)}`), " ", el("span", null, gateText(p, phase)));
      gates.append(li);
    });
    box.append(block(tx("Tollgates"), gates));
    return box;
  };

  const ctqTree = (p) => {
    const box = panel(cfg.sheets.ctq, tx("Need → drivers → measurable CTQ with its specification."));
    const tree = el("ul", "pp-tree");
    const needs = new Map();
    p.ctq.forEach((row) => {
      const need = row.need.trim() || "–";
      if (!needs.has(need)) needs.set(need, new Map());
      const drivers = needs.get(need);
      const driver = row.driver.trim() || "–";
      if (!drivers.has(driver)) drivers.set(driver, []);
      drivers.get(driver).push(row);
    });
    needs.forEach((drivers, need) => {
      const li = el("li");
      li.append(el("strong", "pp-tree-need", need));
      const ul = el("ul");
      drivers.forEach((rows, driver) => {
        const d = el("li");
        d.append(el("span", "pp-tree-driver", driver));
        const leaves = el("ul");
        rows.forEach((row) => { const leaf = el("li", "pp-tree-ctq"); leaf.append(el("span", null, row.ctq || "–"), row.spec ? el("small", null, ` · ${row.spec}`) : ""); leaves.append(leaf); });
        d.append(leaves);
        ul.append(d);
      });
      li.append(ul);
      tree.append(li);
    });
    box.append(tree);
    return box;
  };

  const raciPanel = (p) => {
    const check = raciCheck(p.raci);
    const box = panel(cfg.sheets.raci, check.ok ? tx("Every activity has one A and at least one R.") : tx("{n} of {total} activities need a fix: exactly one A and at least one R each.", { n: check.problems, total: check.rows.length }));
    box.append(table([[C.raci.activity], ...p.raci.people.map((person) => [person, "pp-c"]), [C.raci.check]], p.raci.rows.filter((row) => row.activity.trim() || row.cells.some(Boolean)).map((row, i) => {
      const result = check.rows[i];
      return [[row.activity], ...row.cells.map((c) => [c ? raciLabel(c) : "", "pp-c"]), [el("span", `pp-check ${result.ok ? "is-ok" : "is-bad"}`, result.ok ? `✓ ${tx("OK")}` : `! ${result.problems.map(raciProblem).join(", ")}`)]];
    }), "pp-raci-table"));
    const load = el("p", "dl-panel-note", `${tx("Load per person")}: ${check.load.map((l) => `${l.person} ${l.a}A/${l.r}R`).join(" · ")}`);
    box.append(load);
    return box;
  };

  // The classic Kano chart: how fulfilled the feature is (left to right) against how the customer feels (bottom to
  // top), the five curves, and each feature as a numbered dot on the curve of its category.
  const kanoChart = (rows) => {
    const { svgEl, C: K } = CK;
    const W = 560, H = 380, left = 40, right = 150, top = 24, bottom = 40;
    const plotW = W - left - right, plotH = H - top - bottom;
    const x = (v) => left + ((v + 1) / 2) * plotW;
    const y = (v) => top + ((1 - v) / 2) * plotH;
    const title = `${cfg.sheets.kano}: ${rows.length}`;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": title, class: "ck-chart", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.append(svgEl("title", {}, title));
    svg.append(svgEl("line", { x1: x(-1), x2: x(1), y1: y(0), y2: y(0), stroke: K.grid, "stroke-width": 1.5 }));
    svg.append(svgEl("line", { x1: x(0), x2: x(0), y1: y(1), y2: y(-1), stroke: K.grid, "stroke-width": 1.5 }));
    // Attractive starts just above the axis and climbs late; must-be is its mirror below; one-dimensional is the
    // straight line; indifferent stays on the axis; reverse falls the other way.
    const k = 3;
    const rise = (v) => (Math.exp((k * (v + 1)) / 2) - 1) / (Math.exp(k) - 1);
    const curves = {
      A: (v) => 0.12 + 0.8 * rise(v),
      M: (v) => -(0.12 + 0.8 * rise(-v)),
      O: (v) => 0.7 * v,
      I: () => 0,
      R: (v) => -0.55 * v,
    };
    const dash = { A: "", M: "", O: "", I: "2 4", R: "6 4" };
    Object.entries(curves).forEach(([key, f]) => {
      const pts = Array.from({ length: 41 }, (_, i) => { const v = -1 + i / 20; return `${x(v).toFixed(1)},${y(f(v)).toFixed(1)}`; }).join(" ");
      svg.append(svgEl("polyline", { points: pts, fill: "none", stroke: key === "I" || key === "R" ? K.muted : K.line, "stroke-width": 1.6, "stroke-dasharray": dash[key] }));
      svg.append(svgEl("text", { x: x(1) + 8, y: y(f(1)) + 4, "font-size": 12, "font-weight": 700, fill: K.text }, kanoName(key)));
    });
    svg.append(svgEl("text", { x: x(-1), y: H - 12, "font-size": 11, fill: K.muted }, `← ${cfg.kano.axisX[0]}`));
    svg.append(svgEl("text", { x: x(1), y: H - 12, "text-anchor": "end", "font-size": 11, fill: K.muted }, `${cfg.kano.axisX[1]} →`));
    svg.append(svgEl("text", { x: x(0) + 6, y: top + 4, "font-size": 11, fill: K.muted }, `↑ ${cfg.kano.axisY[1]}`));
    svg.append(svgEl("text", { x: x(0) + 6, y: y(-1), "font-size": 11, fill: K.muted }, `↓ ${cfg.kano.axisY[0]}`));
    // The dots of one category spread along its curve, where that curve reads best.
    const spots = { A: [0.55, 0.95], M: [-0.95, -0.55], O: [0.05, 0.4], I: [-0.8, -0.3], R: [-0.85, -0.45] };
    const groups = {};
    rows.forEach((row, i) => { const cat = kanoOf(row); if (cat && cat !== "Q") (groups[cat] ||= []).push({ row, n: i + 1 }); });
    Object.entries(groups).forEach(([cat, items]) => {
      const [a, b] = spots[cat];
      items.forEach((item, j) => {
        const v = items.length === 1 ? (a + b) / 2 : a + ((b - a) * j) / (items.length - 1);
        const g = svgEl("g", { class: "ck-hit", "data-tip": `${item.n}. ${item.row.feature || "–"}\n${kanoName(cat)}` });
        g.append(svgEl("circle", { cx: x(v), cy: y(curves[cat](v)), r: 10, fill: K.blue, stroke: K.paper, "stroke-width": 2 }));
        g.append(svgEl("text", { x: x(v), y: y(curves[cat](v)) + 4, "text-anchor": "middle", "font-size": 11, "font-weight": 800, fill: "#ffffff" }, String(item.n)));
        g.append(svgEl("title", {}, `${item.n}. ${item.row.feature} · ${kanoName(cat)}`));
        svg.append(g);
      });
    });
    return svg;
  };
  const kanoPanel = (p) => {
    const counted = kanoCounts(p.kano);
    const box = panel(cfg.sheets.kano, KANO.filter((key) => counted[key]).map((key) => `${kanoName(key)} ${counted[key]}`).join(" · "));
    box.classList.add("pp-kano");
    const body = el("div", "pp-kano-body");
    if (CK) body.append(CK.figure(kanoChart(p.kano), { fileName: `${cfg.text.csv}-kano` }));
    const key = el("ol", "pp-kano-key");
    p.kano.forEach((row) => {
      const cat = kanoOf(row);
      const li = el("li");
      li.append(el("strong", null, row.feature || "–"), " ", el("span", null, cat ? `${kanoName(cat)}: ${cfg.kano.categories[cat][1]}` : tx("answer both questions")));
      key.append(li);
    });
    body.append(key);
    box.append(body);
    return box;
  };

  const addControlPlan = (actions, p) => {
    if (!window.ActionsStore || !p?.control.length) return;
    const S = window.ActionsStore;
    const button = el("button", "button-secondary", tx("Control plan to the Action Tracker"));
    button.type = "button";
    const out = el("p", "form-note pp-actions-status");
    out.setAttribute("role", "status");
    button.addEventListener("click", () => {
      // A line already open on the tracker goes over once.
      const known = new Set(S.list().filter((a) => S.isOpen(a) && a.source === "project-portfolio").map((a) => a.title));
      const added = p.control.filter((r) => r.what.trim()).map((r) => {
        const title = tx("Control plan: {what} ({frequency})", { what: r.what.trim(), frequency: r.frequency || "–" }).slice(0, 300);
        if (known.has(title)) return null;
        known.add(title);
        return S.add({
          title, owner: r.owner, source: "project-portfolio", area: p.area, priority: "Medium",
          detail: [p.title, r.spec && `${C.control.spec}: ${r.spec}`, r.method && `${C.control.method}: ${r.method}`].filter(Boolean).join(" · "),
          check: r.reaction ? `${C.control.reaction}: ${r.reaction}` : "",
        });
      }).filter(Boolean);
      const link = el("a", "inline-link", tx("Open the Action Tracker"));
      link.href = S.trackerUrl().href;
      out.replaceChildren(added.length ? tx("Added {n} actions.", { n: added.length }) : tx("Every line is already on the Action Tracker."), " ", link);
    });
    actions.append(button, out);
  };

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = !state.projects.length;
    if (!state.projects.length) return;
    const day = today();
    const sum = summary(state.projects, day, { limit: LIMIT, counts });
    const p = current();

    const head = el("div", "result-head");
    head.append(el("p", "result-label", cfg.text.tool));
    const h2 = el("h2");
    h2.append(el("span", null, int.format(sum.open)), ` ${tx("open projects")} · ${tx("{n} at risk or late", { n: sum.atRisk })}`);
    head.append(h2);
    head.append(el("p", null, sum.atRisk || sum.long || sum.overdue
      ? tx("Start with the project at the top of the list below: it is late, stuck in a phase or past its tollgate date.")
      : tx("Every open project is on track. Keep the tollgates on their dates.")));

    const stats = el("div", "dl-stats");
    // Five small counts under their letters read better than one long line of them.
    const phases = stat(tx("By phase"), "", PHASES.map((ph) => phaseName(ph)).join(" · "));
    const row = phases.querySelector(".dl-stat-value");
    row.className = "dl-stat-value pp-phase-row";
    PHASES.forEach((ph) => { const cell = el("span", "pp-phase-count"); cell.append(el("b", null, int.format(sum.byPhase[ph])), el("small", null, cfg.phases[ph].letter)); cell.title = `${phaseName(ph)}: ${sum.byPhase[ph]}`; row.append(cell); });
    stats.append(
      stat(tx("Open projects"), int.format(sum.open), sum.closed ? tx("{n} closed", { n: sum.closed }) : tx("none closed yet")),
      phases,
      stat(tx("At risk or late"), int.format(sum.atRisk), sum.long ? tx("{n} over {d} days in one phase", { n: sum.long, d: LIMIT }) : tx("none stuck in a phase")),
      stat(tx("Savings {year}", { year: sum.year }), money(sum.savings.realised), tx("realised of {planned} planned", { planned: money(sum.savings.planned) })),
      stat("COPQ", money(sum.copq.month), tx("a month in the open projects")),
    );

    const actions = resultActions(() => summaryText(sum), problemOf(p));
    if (p) {
      const a3 = el("a", "button-secondary", tx("Open the A3"));
      const a3Url = new URL("../a3-report/", window.location.href);
      a3Url.searchParams.set("problem", problemOf(p));
      a3.href = a3Url.href;
      const lab = el("a", "button-secondary", tx("Open in Process Lab"));
      lab.href = new URL("../process-lab/", window.location.href).href;
      const printOne = el("button", "button-secondary", tx("Print this project"));
      printOne.type = "button";
      printOne.addEventListener("click", () => {
        document.body.classList.add("pp-print-one");
        window.print();
      });
      actions.append(a3, lab, printOne);
      if (window.DocxKit) {
        const word = el("button", "button-secondary", tx("Download Word"));
        word.type = "button";
        word.addEventListener("click", () => downloadWord(current()));
        actions.append(word);
      }
      addControlPlan(actions, p);
    }

    const panels = [];
    if (CK) {
      const bars = panel(tx("Projects per phase"), tx("Open projects only. A crowd in one phase is where the tollgates wait."));
      bars.append(CK.figure(CK.bars(PHASES.map((ph) => ({ label: `${cfg.phases[ph].letter} · ${phaseName(ph)}`, value: sum.byPhase[ph], tip: `${phaseName(ph)}: ${sum.byPhase[ph]}` })), { title: `${cfg.text.tool}: ${tx("Projects per phase")}`, format: (v) => int.format(Math.round(v)) }), { fileName: `${cfg.text.csv}-phases` }));
      panels.push(bars);
      const realisedKey = tx("Realised");
      const plannedKey = tx("Still planned");
      const money2 = (v) => (v >= 1000 ? `${num(v / 1000, v >= 10000 ? 0 : 1)}k` : int.format(Math.round(v)));
      const saving = panel(tx("Savings by month, {year}", { year: sum.year }), tx("Hard savings: realised, and what is still planned on top. A month with only the light part has not been entered yet."));
      saving.append(CK.figure(CK.stacked(sum.savings.months.map((m) => ({ label: shortMonth(m.month), parts: [{ key: realisedKey, value: m.realised }, { key: plannedKey, value: Math.max(0, m.planned - m.realised) }] })), { keys: [realisedKey, plannedKey], colors: { [realisedKey]: CK.C.blue, [plannedKey]: CK.C.soft }, title: `${cfg.text.tool}: ${tx("Savings by month, {year}", { year: sum.year })}`, unit: "€", format: money2 }), { fileName: `${cfg.text.csv}-savings` }));
      panels.push(saving);
    }
    if (p) {
      panels.push(onePage(p));
      if (p.ctq.length) panels.push(ctqTree(p));
      if (raciCheck(p.raci).rows.length) panels.push(raciPanel(p));
      if (p.kano.length) panels.push(kanoPanel(p));
    }
    resultLayout(results, { head, stats, notes: [portfolioTable(day)], focus: focusCard(day), actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => state.projects.length * 20, 100);
  window.addEventListener("afterprint", () => document.body.classList.remove("pp-print-one"));

  const renderAll = () => {
    note.hidden = !state.example;
    if (!state.projects.some((p) => p.id === state.current)) state.current = state.projects[0]?.id || "";
    renderTabs();
    fillFields();
    editors.forEach((e) => e.render());
    raciEditor.render();
    renderGates();
    renderOutputs();
    renderResults();
  };

  // Events -----------------------------------------------------------------------------------------------------------
  root.querySelector("[data-new]").addEventListener("click", () => {
    if (state.example) Object.assign(state, { projects: [], example: false });
    const p = blankProject(today());
    state.projects.push(p);
    state.current = p.id;
    save();
    renderAll();
    root.querySelector("#pp-title")?.focus();
  });
  root.querySelector("[data-remove-project]").addEventListener("click", () => {
    const p = current();
    if (!p) return;
    const index = state.projects.indexOf(p);
    state.projects.splice(index, 1);
    state.current = state.projects[Math.max(0, index - 1)]?.id || "";
    own();
    save();
    renderAll();
    undoNote(status, tx("Removed: {text}", { text: p.title || tx("Project") }), () => {
      state.projects.splice(Math.min(index, state.projects.length), 0, p);
      state.current = p.id;
      save();
      renderAll();
    });
  });
  root.querySelector("[data-example]").addEventListener("click", () => {
    loadExample();
    save();
    renderAll();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (!state.projects.length || !window.confirm(tx("Clear every project in this browser?"))) return;
    Object.assign(state, { projects: [], current: "", example: false });
    save();
    renderAll();
  });
  const fileName = () => cfg.text.csv;
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.projects.length) downloadCsv(fileName(), sheetRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.projects.length) downloadXlsx(fileName(), sheetRows(), { sheet: cfg.text.tool, title: cfg.text.tool }); });
  window.addEventListener("workplace:changed", fillFields);
  // For the tests: the summary as "Copy summary" gives it, and the rows of the CSV.
  window.PortfolioMath.summaryText = () => summaryText(summary(state.projects, today(), { limit: LIMIT, counts }));
  window.PortfolioMath.sheetRows = sheetRows;

  renderAll();
})();
