// Hoshin Kanri: the site's strategy on one page and deployed. The X-matrix (as in Thomas Jackson, "Hoshin Kanri for
// the Lean Enterprise") ties breakthrough objectives (south, three to five years) to annual objectives (west), the
// top-level improvement priorities that reach them (north), the metrics to improve (east) and the people who own them
// (far east); its four corners say how strongly two lists hang together. Catchball notes record how each priority was
// agreed with the level below, the bowling chart shows each metric month by month against its target, and two misses
// in a row ask for a countermeasure. The arithmetic lives in window.HoshinKanriMath so the tests can call it.
(() => {
  // Arithmetic -------------------------------------------------------------------------------------------------------
  const LISTS = ["breakthroughs", "annual", "priorities", "metrics", "owners"];
  // Codes stay the same in every language, so a matrix file reads the same at every site.
  const CODES = { breakthroughs: "B", annual: "A", priorities: "P", metrics: "M", owners: "R" };
  // The four corners: rows × columns. ba: annual ↔ breakthrough (south-west), pa: priority ↔ annual (north-west),
  // pm: priority ↔ metric (north-east), po: priority ↔ owner (the resources on the far east).
  const MATRICES = { ba: ["annual", "breakthroughs"], pa: ["priorities", "annual"], pm: ["priorities", "metrics"], po: ["priorities", "owners"] };
  const STRENGTHS = ["strong", "weak"];
  const ROLES = ["primary", "secondary"];
  const KINDS = ["proposal", "feedback", "agreed"];
  const PHASES = ["define", "measure", "analyze", "improve", "control"];
  const STATUSES = ["on-track", "at-risk", "late", "on-hold", "closed"];
  const MAX_ITEMS = 15;
  const EXAMPLE_PROJECT = /^hx-example-/;

  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const text = (value, max = 300) => (typeof value === "string" ? value.slice(0, max) : typeof value === "number" && Number.isFinite(value) ? String(value) : "");
  const isoDate = (value) => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "");
  const isoMonth = (value) => (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : "");
  // A number saved or typed: a blank box is no number, not a zero.
  const numberOr = (value) => {
    const n = typeof value === "string" ? (value.trim() === "" ? NaN : Number(value.trim().replace(",", "."))) : value;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  };
  const addMonths = (month, n) => {
    const [y, m] = month.split("-").map(Number);
    const index = y * 12 + (m - 1) + n;
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
  };
  const monthsBetween = (from, to) => {
    const [y1, m1] = from.split("-").map(Number);
    const [y2, m2] = to.split("-").map(Number);
    return (y2 * 12 + m2) - (y1 * 12 + m1);
  };
  const shiftDay = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  // The twelve months of the plan year, from its first month (a fiscal year may start in any month).
  const planMonths = (start) => Array.from({ length: 12 }, (_, i) => addMonths(start, i));
  const twelve = (values) => Array.from({ length: 12 }, (_, i) => numberOr(Array.isArray(values) ? values[i] : null));

  // A plan from anywhere (saved, a template file, the example) is rebuilt field by field.
  let counter = 0;
  const newId = (prefix) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const idText = (value) => (typeof value === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(value) ? value : "");
  const cleanItem = (list, raw) => {
    if (!isObject(raw)) return null;
    const item = { id: idText(raw.id), text: text(raw.text, 300) };
    if (list === "annual") item.savingsTarget = numberOr(raw.savingsTarget);
    if (list === "priorities") Object.assign(item, { project: idText(raw.project), projectTitle: text(raw.projectTitle, 200) });
    if (list === "metrics") Object.assign(item, { unit: text(raw.unit, 24), better: raw.better === "lower" ? "lower" : "higher", baseline: numberOr(raw.baseline), target: numberOr(raw.target), targets: twelve(raw.targets), actuals: twelve(raw.actuals) });
    if (list === "owners") item.role = text(raw.role, 120);
    return item;
  };
  const emptyPlan = (start) => ({
    title: "", start, reviewMonth: "",
    ...Object.fromEntries(LISTS.map((list) => [list, []])),
    links: Object.fromEntries(Object.keys(MATRICES).map((key) => [key, {}])),
    catchball: [], review: {}, example: false,
  });
  const cleanPlan = (raw, start) => {
    const plan = emptyPlan(isoMonth(raw?.start) || start);
    if (!isObject(raw)) return plan;
    plan.title = text(raw.title, 120);
    plan.reviewMonth = isoMonth(raw.reviewMonth);
    plan.example = raw.example === true;
    const seen = new Set();
    LISTS.forEach((list) => {
      plan[list] = (Array.isArray(raw[list]) ? raw[list] : []).slice(0, MAX_ITEMS).map((item) => cleanItem(list, item)).filter(Boolean).map((item) => {
        // Every id once: a copied row or a damaged file must not tie two items to the same cells.
        if (!item.id || seen.has(item.id)) item.id = newId(CODES[list].toLowerCase());
        seen.add(item.id);
        return item;
      });
    });
    const ids = Object.fromEntries(LISTS.map((list) => [list, new Set(plan[list].map((item) => item.id))]));
    Object.entries(MATRICES).forEach(([key, [rows, cols]]) => {
      const valid = key === "po" ? ROLES : STRENGTHS;
      const saved = isObject(raw.links?.[key]) ? raw.links[key] : {};
      Object.entries(saved).forEach(([pair, value]) => {
        const [row, col] = pair.split("|");
        if (ids[rows].has(row) && ids[cols].has(col) && valid.includes(value)) plan.links[key][pair] = value;
      });
    });
    plan.catchball = (Array.isArray(raw.catchball) ? raw.catchball : []).slice(0, 300).filter(isObject)
      .map((note) => ({ id: idText(note.id) || newId("c"), priority: idText(note.priority), date: isoDate(note.date), kind: KINDS.includes(note.kind) ? note.kind : "proposal", from: text(note.from, 120), text: text(note.text, 1000) }))
      .filter((note) => ids.priorities.has(note.priority) && (note.text.trim() || note.from.trim()));
    if (isObject(raw.review)) {
      Object.entries(raw.review).forEach(([metric, value]) => {
        if (ids.metrics.has(metric) && isObject(value)) plan.review[metric] = { countermeasure: text(value.countermeasure, 600), owner: text(value.owner, 120), due: isoDate(value.due) };
      });
    }
    return plan;
  };
  const isEmpty = (plan) => LISTS.every((list) => !plan[list].length);

  // Correlations. A pair is "row|column"; a cell holds strong or weak (●, ○), and in the resources matrix primary or
  // secondary (●, ○). An empty cell is no relation.
  const cell = (plan, matrix, row, col) => plan.links?.[matrix]?.[`${row}|${col}`] || "";
  const linkedTo = (plan, matrix, row) => plan[MATRICES[matrix][1]].filter((col) => cell(plan, matrix, row, col.id));
  const linkedFrom = (plan, matrix, col) => plan[MATRICES[matrix][0]].filter((row) => cell(plan, matrix, row.id, col));
  const codeOf = (plan, list, id) => { const i = plan[list].findIndex((item) => item.id === id); return i < 0 ? "" : `${CODES[list]}${i + 1}`; };
  // The owner rule: every priority has exactly one primary owner; secondaries help, they do not answer for it.
  const primaries = (plan, priority) => plan.owners.filter((owner) => cell(plan, "po", priority, owner.id) === "primary");
  const ownerCheck = (plan, priority) => {
    const n = primaries(plan, priority).length;
    return n === 1 ? "ok" : n === 0 ? "none" : "many";
  };
  // The gaps of a matrix, in the order of deployment. The X-matrix is read as a chain: a breakthrough needs an annual
  // objective this year, an annual objective serves a breakthrough and is pursued by a priority, a priority serves an
  // annual objective, moves a metric and has one primary owner, and a metric is moved by a priority. A row or column
  // without any mark is a link the deployment is missing.
  const gaps = (plan) => {
    const out = [];
    const add = (kind, list, item, extra = {}) => out.push({ kind, list, id: item.id, code: codeOf(plan, list, item.id), text: item.text, ...extra });
    plan.breakthroughs.forEach((b) => { if (!linkedFrom(plan, "ba", b.id).length) add("breakthrough-no-annual", "breakthroughs", b); });
    plan.annual.forEach((a) => {
      if (!linkedTo(plan, "ba", a.id).length) add("annual-no-breakthrough", "annual", a);
      if (!linkedFrom(plan, "pa", a.id).length) add("annual-no-priority", "annual", a);
    });
    plan.priorities.forEach((p) => {
      if (!linkedTo(plan, "pa", p.id).length) add("priority-no-annual", "priorities", p);
      if (!linkedTo(plan, "pm", p.id).length) add("priority-no-metric", "priorities", p);
      const owners = ownerCheck(plan, p.id);
      if (owners === "none") add("priority-no-primary", "priorities", p);
      if (owners === "many") add("priority-many-primary", "priorities", p, { count: primaries(plan, p.id).length });
    });
    plan.metrics.forEach((m) => { if (!linkedFrom(plan, "pm", m.id).length) add("metric-no-priority", "metrics", m); });
    return out;
  };

  // The bowling chart. A month is met when its actual is at or better than that month's target: at or above it when
  // higher is better, at or below it when lower is better. Without an actual the month is still open; without a target
  // it cannot be judged.
  const EPS = 1e-9;
  const monthStatus = (metric, i) => {
    const actual = numberOr(metric?.actuals?.[i]);
    const target = numberOr(metric?.targets?.[i]);
    if (actual === null) return "open";
    if (target === null) return "no-target";
    const met = metric.better === "lower" ? actual <= target + EPS : actual >= target - EPS;
    return met ? "met" : "missed";
  };
  // Misses in a row up to month i (0 when month i is not a miss).
  const missedInARow = (metric, i) => {
    let n = 0;
    for (let k = i; k >= 0 && monthStatus(metric, k) === "missed"; k--) n++;
    return n;
  };
  // The review rule: a metric that missed the review month and the month before needs a countermeasure. The first
  // month of a plan year has no month before it in this plan.
  const missedTwice = (metric, i) => i >= 1 && monthStatus(metric, i) === "missed" && monthStatus(metric, i - 1) === "missed";
  const reviewFlags = (plan, i) => plan.metrics.filter((metric) => missedTwice(metric, i));
  // The review month by default: the last full month, as a place in the plan year (-1 before the year has a full
  // month, 11 once the year is over).
  const reviewIndex = (start, day) => {
    const i = monthsBetween(start, day.slice(0, 7)) - 1;
    return i < 0 ? -1 : Math.min(11, i);
  };
  // Decimals a metric is kept in: as many as its numbers show, at most three.
  const decimals = (value) => {
    if (!Number.isFinite(value)) return 0;
    const s = String(value);
    if (/e/i.test(s)) return 3;
    const dot = s.indexOf(".");
    return dot < 0 ? 0 : Math.min(3, s.length - dot - 1);
  };
  const digitsOf = (metric) => Math.max(0, ...[metric.baseline, metric.target, ...metric.targets, ...metric.actuals].filter((v) => v !== null).map(decimals));
  // Half up, without the binary noise of 3.225 * 100 = 322.49999…
  const round = (value, digits) => Math.round(Number((value * 10 ** digits).toPrecision(12))) / 10 ** digits;
  // The target path: twelve equal steps from the baseline to the annual target, the last month on the target itself.
  const spreadTargets = (baseline, target, digits = 1) => {
    const b = numberOr(baseline), t = numberOr(target);
    if (b === null || t === null) return null;
    return Array.from({ length: 12 }, (_, i) => (i === 11 ? t : round(b + ((t - b) * (i + 1)) / 12, digits)));
  };
  // The trend of the actuals so far: the least-squares slope per month (b = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)²). It counts as
  // steady while it moves less than a tenth of the planned monthly step, (target − baseline) / 12.
  const trend = (metric, upTo = 11) => {
    const points = [];
    for (let i = 0; i <= upTo; i++) { const y = numberOr(metric.actuals[i]); if (y !== null) points.push([i, y]); }
    if (points.length < 2) return { slope: null, direction: null, points: points.length };
    const mx = points.reduce((s, [x]) => s + x, 0) / points.length;
    const my = points.reduce((s, [, y]) => s + y, 0) / points.length;
    const sxx = points.reduce((s, [x]) => s + (x - mx) ** 2, 0);
    const slope = points.reduce((s, [x, y]) => s + (x - mx) * (y - my), 0) / sxx;
    const planned = metric.baseline !== null && metric.target !== null ? Math.abs(metric.target - metric.baseline) / 12 : 0;
    const step = planned > 0 ? planned : Math.abs(my) * 0.01;
    const good = metric.better === "lower" ? -slope : slope;
    const direction = Math.abs(slope) < 0.1 * step || Math.abs(slope) < EPS ? "steady" : good > 0 ? "improving" : "worsening";
    return { slope, direction, points: points.length };
  };
  const bowling = (metric, upTo = 11) => {
    const months = Array.from({ length: 12 }, (_, i) => ({ target: metric.targets[i], actual: metric.actuals[i], status: i <= upTo ? monthStatus(metric, i) : "open" }));
    const judged = months.filter((m) => m.status === "met" || m.status === "missed");
    return { months, met: judged.filter((m) => m.status === "met").length, missed: judged.filter((m) => m.status === "missed").length, reported: judged.length, trend: trend(metric, upTo) };
  };
  const yearScore = (plan, upTo) => plan.metrics.reduce((sum, metric) => {
    const b = bowling(metric, upTo);
    return { met: sum.met + b.met, reported: sum.reported + b.reported };
  }, { met: 0, reported: 0 });
  const monthScore = (plan, i) => {
    const statuses = plan.metrics.map((metric) => (i < 0 ? "open" : monthStatus(metric, i)));
    return { met: statuses.filter((s) => s === "met").length, missed: statuses.filter((s) => s === "missed").length, reported: statuses.filter((s) => s === "met" || s === "missed").length };
  };

  // The Project Portfolio of this browser (js/project-portfolio.js, sc-project-portfolio and -de / -sq), read only:
  // { projects: [{ id, title, lead, area, phase, status, savings: { hard, from, realised: [{ month, amount }] } }] }.
  const portfolioProjects = (saved) => (isObject(saved) && Array.isArray(saved.projects) ? saved.projects : []).filter((p) => isObject(p) && idText(p.id)).slice(0, 60).map((p) => ({
    id: p.id, title: text(p.title, 200), lead: text(p.lead, 120), area: text(p.area, 120),
    phase: PHASES.includes(p.phase) ? p.phase : "define", status: STATUSES.includes(p.status) ? p.status : "on-track",
    savings: {
      hard: numberOr(p.savings?.hard), from: isoDate(p.savings?.from),
      realised: (Array.isArray(p.savings?.realised) ? p.savings.realised : []).filter(isObject).map((r) => ({ month: isoMonth(r.month), amount: numberOr(r.amount) })).filter((r) => r.month && r.amount !== null),
    },
  }));
  // The savings of a project inside the plan year: planned as the portfolio plans them (the hard savings a year in
  // twelve equal months from the month they start), realised as entered month by month.
  const projectSavings = (project, start) => {
    const months = new Set(planMonths(start));
    const hard = project?.savings?.hard;
    const from = project?.savings?.from ? project.savings.from.slice(0, 7) : "";
    const planned = hard > 0 && from ? planMonths(from).filter((m) => months.has(m)).length * (hard / 12) : 0;
    const realised = (project?.savings?.realised || []).filter((r) => months.has(r.month)).reduce((s, r) => s + r.amount, 0);
    return { hard: hard ?? null, planned, realised };
  };
  const findProject = (projects, priority) => (priority?.project ? projects.find((p) => p.id === priority.project) || null : null);
  // What the linked projects bring to each annual objective: every project once, through the priorities that serve it.
  const objectiveSavings = (plan, projects, start) => plan.annual.map((a) => {
    const linked = [...new Map(linkedFrom(plan, "pa", a.id).map((p) => findProject(projects, p)).filter(Boolean).map((p) => [p.id, p])).values()];
    const sums = linked.reduce((s, p) => { const v = projectSavings(p, start); return { planned: s.planned + v.planned, realised: s.realised + v.realised }; }, { planned: 0, realised: 0 });
    return { id: a.id, target: a.savingsTarget, projects: linked, ...sums, share: a.savingsTarget > 0 ? sums.realised / a.savingsTarget : null };
  });
  // Catchball: the latest step per priority (proposal, feedback, agreed), by date and then by the order entered.
  const catchState = (plan, priority) => {
    const notes = plan.catchball.map((note, i) => ({ note, i })).filter(({ note }) => note.priority === priority)
      .sort((a, b) => (a.note.date || "").localeCompare(b.note.date || "") || a.i - b.i).map(({ note }) => note);
    return { notes, last: notes.at(-1)?.kind || "", agreed: notes.some((n) => n.kind === "agreed") && notes.at(-1)?.kind === "agreed" };
  };

  // The example of the data file: its plan year ends nine months in on the last full month, so the bowling chart
  // always holds nine months of actuals; its dates are counted in days back from today.
  const exampleStart = (example, day) => addMonths(day.slice(0, 7), -1 - (Number(example?.reported) || 9) + 1);
  const fromExample = (example, day) => {
    const start = exampleStart(example, day);
    const upTo = (Number(example?.reported) || 9) - 1;
    const raw = JSON.parse(JSON.stringify(example?.plan || {}));
    (raw.metrics || []).forEach((m) => { m.actuals = twelve(m.actuals).map((v, i) => (i <= upTo ? v : null)); });
    (raw.catchball || []).forEach((n) => { n.date = Number.isInteger(n.date) ? shiftDay(day, n.date) : n.date; });
    Object.values(raw.review || {}).forEach((r) => { if (Number.isInteger(r.due)) r.due = shiftDay(day, r.due); });
    return cleanPlan({ ...raw, start, example: true }, start);
  };
  // The example's two projects, in the portfolio's own shape; they live on this page only and are never written to
  // the portfolio's key. Months count from the first month of the example's plan year.
  const exampleProjects = (example, day) => {
    const start = exampleStart(example, day);
    return portfolioProjects({ projects: (example?.projects || []).map((p) => ({
      ...p, savings: { ...p.savings, from: `${addMonths(start, p.savings?.from || 0)}-01`, realised: (p.savings?.realised || []).map((r) => ({ month: addMonths(start, r.month), amount: r.amount })) },
    })) });
  };

  window.HoshinKanriMath = {
    LISTS, CODES, MATRICES, STRENGTHS, ROLES, KINDS, PHASES, STATUSES, numberOr, addMonths, monthsBetween, planMonths,
    emptyPlan, cleanPlan, isEmpty, cell, linkedTo, linkedFrom, codeOf, primaries, ownerCheck, gaps,
    monthStatus, missedInARow, missedTwice, reviewFlags, reviewIndex, digitsOf, round, spreadTargets, trend, bowling, yearScore, monthScore,
    portfolioProjects, projectSavings, findProject, objectiveSavings, catchState, exampleStart, fromExample, exampleProjects,
  };

  // The page ---------------------------------------------------------------------------------------------------------
  const root = document.querySelector("[data-hoshin-kanri]");
  const dataEl = document.getElementById("hoshin-kanri-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { tx, int, pct, num, el, read, write, firstVisit, today, showDate, panel, stat, resultActions, resultLayout, renderOnPause, flash, undoNote, downloadCsv, downloadXlsx, LOCALE, DECIMAL_COMMA, monthYear, parseNumber } = kit;
  const CK = window.ChartKit;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const Q = cfg.quadrants;
  const euro0 = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const money = (value) => euro0.format(Math.round(value || 0));
  const monthName = (month) => monthYear(new Date(`${month}-01T00:00:00Z`));
  const shortMonth = (month) => monthName(month).split(" ")[0];
  const defaultStart = () => `${today().slice(0, 4)}-01`;

  const results = document.querySelector("[data-results]");
  const status = root.querySelector("[data-status]");
  const empty = root.querySelector("[data-empty]");
  const titleInput = root.querySelector("#hx-title");
  const startInput = root.querySelector("#hx-start");
  const reviewSelect = root.querySelector("#hx-review");
  const listsBox = root.querySelector("[data-lists]");
  const matricesBox = root.querySelector("[data-matrices]");
  const metricPick = root.querySelector("[data-metric-pick]");
  const monthsBox = root.querySelector("[data-months]");
  const monthsStatus = root.querySelector("[data-months-status]");
  const projectsBox = root.querySelector("[data-projects]");
  const portfolioNote = root.querySelector("[data-portfolio-note]");
  const catchPriority = root.querySelector("#hx-cb-priority");
  const catchDate = root.querySelector("#hx-cb-date");
  const catchKind = root.querySelector("#hx-cb-kind");
  const catchFrom = root.querySelector("#hx-cb-from");
  const catchText = root.querySelector("#hx-cb-text");
  const catchStatus = root.querySelector("[data-catch-status]");
  const catchList = root.querySelector("[data-catch-list]");
  const a3Base = document.querySelector("a[data-a3]")?.href || new URL("../a3-report/", window.location.href).href;
  const whysBase = document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href).href;

  // State: the whole plan under one key, so the Work Backup and Team sync carry it as one piece.
  let state = cleanPlan(read(KEY, null), defaultStart());
  let pickedMetric = "";
  const save = () => write(KEY, state);
  if (isEmpty(state) && firstVisit(KEY)) state = fromExample(cfg.example, today());

  const note = el("div", "dl-example-note");
  note.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  clearExample.addEventListener("click", () => {
    state = emptyPlan(defaultStart());
    save();
    renderAll();
  });
  note.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Add your own entries and it disappears, or clear it now.")), " ", clearExample);
  results.before(note);
  // The visitor's first own change ends the example: the plan stays, the note goes.
  const own = () => { if (state.example) { state.example = false; note.hidden = true; } };
  const changed = () => { own(); save(); };

  // Names -------------------------------------------------------------------------------------------------------------
  const code = (list, id) => codeOf(state, list, id);
  const itemName = (list, item) => `${code(list, item.id)} ${item.text || "–"}`;
  const fmt = (metric, value) => (value === null || value === undefined ? "–" : num(value, digitsOf(metric)));
  const inputNumber = (value) => (value === null || value === undefined ? "" : DECIMAL_COMMA ? String(value).replace(".", ",") : String(value));
  const readNumber = (value) => { const n = parseNumber(value); return Number.isFinite(n) ? n : null; };
  const goal = (metric) => (metric.target === null ? "" : `${metric.better === "lower" ? "≤" : "≥"} ${fmt(metric, metric.target)}${metric.unit ? ` ${metric.unit}` : ""}`);
  const statusWord = (s) => ({ met: tx("met"), missed: tx("missed"), open: "", "no-target": tx("no target") }[s] || "");
  const trendWord = (direction) => ({ improving: `↗ ${tx("improving")}`, worsening: `↘ ${tx("worsening")}`, steady: `→ ${tx("no clear trend")}` }[direction] || "–");
  const strengthMark = (value) => (value === "strong" || value === "primary" ? "●" : value === "weak" || value === "secondary" ? "○" : "");
  const strengthName = (matrix, value) => (matrix === "po" ? cfg.roles[value] : cfg.strengths[value]) || tx("no link");
  const gapText = (gap) => {
    const vars = { code: gap.code, n: gap.count || 0 };
    return {
      "breakthrough-no-annual": tx("{code} has no annual objective this year.", vars),
      "annual-no-breakthrough": tx("{code} serves no breakthrough objective.", vars),
      "annual-no-priority": tx("{code} has no improvement priority that pursues it.", vars),
      "priority-no-annual": tx("{code} serves no annual objective.", vars),
      "priority-no-metric": tx("{code} moves no metric.", vars),
      "priority-no-primary": tx("{code} has no primary owner.", vars),
      "priority-many-primary": tx("{code} has {n} primary owners; one answers for it.", vars),
      "metric-no-priority": tx("{code} is moved by no improvement priority.", vars),
    }[gap.kind];
  };

  // Projects: the portfolio of this browser in this language, and the example's two projects in memory.
  const portfolioState = () => read(cfg.portfolioKey, null);
  const allProjects = () => [...portfolioProjects(portfolioState()), ...exampleProjects(cfg.example, today())];
  const projectLine = (project) => {
    const s = projectSavings(project, state.start);
    return [cfg.portfolio.phases[project.phase], cfg.portfolio.statuses[project.status],
      s.planned || s.realised ? tx("{realised} realised of {planned} planned this plan year", { realised: money(s.realised), planned: money(s.planned) }) : ""].filter(Boolean).join(" · ");
  };
  const isExampleProject = (id) => EXAMPLE_PROJECT.test(id || "");

  // 1 · The plan -------------------------------------------------------------------------------------------------------
  const reviewIdx = () => (state.reviewMonth ? Math.max(-1, Math.min(11, monthsBetween(state.start, state.reviewMonth))) : reviewIndex(state.start, today()));
  const renderPlan = () => {
    titleInput.value = state.title;
    startInput.value = state.start;
    const months = planMonths(state.start);
    const auto = reviewIndex(state.start, today());
    const options = [["", auto >= 0 ? tx("Automatic: the last full month ({month})", { month: monthName(months[auto]) }) : tx("Automatic: the last full month")], ...months.map((m) => [m, monthName(m)])];
    reviewSelect.replaceChildren(...options.map(([value, label]) => { const o = el("option", null, label); o.value = value; return o; }));
    reviewSelect.value = months.includes(state.reviewMonth) ? state.reviewMonth : "";
    empty.hidden = !isEmpty(state);
  };
  titleInput.addEventListener("input", () => { state.title = titleInput.value.slice(0, 120); changed(); renderSoon(); });
  startInput.addEventListener("change", () => {
    const month = isoMonth(startInput.value);
    if (!month) return;
    state.start = month;
    if (state.reviewMonth && !planMonths(month).includes(state.reviewMonth)) state.reviewMonth = "";
    changed();
    renderAll();
  });
  reviewSelect.addEventListener("change", () => { state.reviewMonth = isoMonth(reviewSelect.value); changed(); renderMonths(); renderResults(); });

  // 2 · The five lists -------------------------------------------------------------------------------------------------
  const ADD_LABEL = { breakthroughs: "+ Add a breakthrough objective", annual: "+ Add an annual objective", priorities: "+ Add an improvement priority", metrics: "+ Add a metric", owners: "+ Add a person" };
  const field = (labelText, input, className = "field") => {
    const box = el("div", className);
    const label = el("label", null, labelText);
    label.htmlFor = input.id;
    box.append(label, input);
    return box;
  };
  const textInput = (id, value, placeholder) => {
    const input = el("input", "hx-in");
    input.id = id;
    input.autocomplete = "off";
    input.value = value ?? "";
    if (placeholder) input.placeholder = placeholder;
    return input;
  };
  const numberInput = (id, value) => {
    const input = textInput(id, inputNumber(value));
    input.inputMode = "decimal";
    return input;
  };
  const listNotes = { breakthroughs: "breakthroughPlaceholder", annual: "annualPlaceholder", priorities: "priorityPlaceholder", metrics: "metricPlaceholder", owners: "ownerPlaceholder" };
  const removeItem = (list, index, box) => {
    const [gone] = state[list].splice(index, 1);
    const links = JSON.parse(JSON.stringify(state.links));
    const catchball = state.catchball.slice();
    const review = { ...state.review };
    state = cleanPlan(state, state.start);
    changed();
    renderAll();
    const statusLine = listsBox.querySelector(`[data-list-status="${list}"]`);
    listsBox.querySelector(`[data-add="${list}"]`)?.focus();
    undoNote(statusLine || status, tx("Removed: {text}", { text: `${CODES[list]}${index + 1} ${gone.text || ""}`.trim() }), () => {
      state[list].splice(Math.min(index, state[list].length), 0, gone);
      state.links = links;
      state.catchball = catchball;
      state.review = review;
      save();
      renderAll();
    });
    return box;
  };
  const renderLists = () => {
    const open = new Set([...listsBox.querySelectorAll("details[open]")].map((d) => d.dataset.list));
    const first = !listsBox.children.length;
    listsBox.replaceChildren(...LISTS.map((list) => {
      const box = el("details", "hx-list");
      box.dataset.list = list;
      box.open = first ? list === "breakthroughs" || !isEmpty(state) && list === "priorities" : open.has(list);
      const summary = el("summary");
      summary.append(el("span", "hx-code", CODES[list]), ` ${Q[list][0]} `, el("small", "hx-count", `(${int.format(state[list].length)})`));
      box.append(summary, el("p", "form-note", Q[list][1]));
      const ol = el("ol", "hx-items");
      state[list].forEach((item, index) => {
        const li = el("li", `hx-item hx-item-${list}`);
        const head = el("span", "hx-code", `${CODES[list]}${index + 1}`);
        head.setAttribute("aria-hidden", "true");
        const fields = el("div", "hx-item-fields");
        const base = `hx-${list}-${index}`;
        const name = textInput(`${base}-text`, item.text, cfg.text[listNotes[list]]);
        name.classList.add("hx-wide");
        name.addEventListener("input", () => { item.text = name.value.slice(0, 300); changed(); renderMatrices(); renderProjects(); renderCatchSelect(); renderMetricPick(); renderSoon(); });
        fields.append(field(list === "owners" ? tx("Name") : `${CODES[list]}${index + 1} · ${Q[list][0]}`, name, "field hx-wide"));
        if (list === "annual") {
          const money2 = numberInput(`${base}-savings`, item.savingsTarget);
          money2.addEventListener("input", () => { item.savingsTarget = readNumber(money2.value); changed(); renderSoon(); });
          fields.append(field(tx("Savings target this year (€, optional)"), money2));
        }
        if (list === "owners") {
          const role = textInput(`${base}-role`, item.role, cfg.text.rolePlaceholder);
          role.addEventListener("input", () => { item.role = role.value.slice(0, 120); changed(); renderMatrices(); renderSoon(); });
          fields.append(field(tx("Role"), role));
        }
        if (list === "metrics") {
          const unit = textInput(`${base}-unit`, item.unit, cfg.text.unitPlaceholder);
          unit.addEventListener("input", () => { item.unit = unit.value.slice(0, 24); changed(); renderSoon(); });
          const better = el("select", "hx-in");
          better.id = `${base}-better`;
          ["higher", "lower"].forEach((key) => { const o = el("option", null, cfg.better[key]); o.value = key; better.append(o); });
          better.value = item.better;
          better.addEventListener("change", () => { item.better = better.value === "lower" ? "lower" : "higher"; changed(); renderMonths(); renderResults(); });
          const baseline = numberInput(`${base}-baseline`, item.baseline);
          baseline.addEventListener("input", () => { item.baseline = readNumber(baseline.value); changed(); renderSoon(); });
          const target = numberInput(`${base}-target`, item.target);
          target.addEventListener("input", () => { item.target = readNumber(target.value); changed(); renderSoon(); });
          fields.append(field(tx("Unit"), unit), field(tx("Better is"), better), field(tx("Baseline"), baseline), field(tx("Target at year end"), target));
        }
        const remove = el("button", "dl-remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${tx("Remove")} · ${CODES[list]}${index + 1}`);
        remove.addEventListener("click", () => removeItem(list, index, box));
        li.append(head, fields, remove);
        ol.append(li);
      });
      const add = el("button", "button-secondary hx-add", tx(ADD_LABEL[list]));
      add.type = "button";
      add.dataset.add = list;
      add.disabled = state[list].length >= MAX_ITEMS;
      add.addEventListener("click", () => {
        const item = cleanItem(list, { text: "" });
        item.id = newId(CODES[list].toLowerCase());
        state[list].push(item);
        changed();
        renderAll();
        listsBox.querySelector(`[data-list="${list}"]`).open = true;
        document.getElementById(`hx-${list}-${state[list].length - 1}-text`)?.focus();
      });
      const statusLine = el("p", "form-note");
      statusLine.dataset.listStatus = list;
      statusLine.setAttribute("aria-live", "polite");
      box.append(ol, add, statusLine);
      return box;
    }));
  };

  // 3 · The four corners -----------------------------------------------------------------------------------------------
  const CYCLE = { po: ["", "primary", "secondary"], other: ["", "strong", "weak"] };
  const renderMatrices = () => {
    const openOnes = new Set([...matricesBox.querySelectorAll("details[open]")].map((d) => d.dataset.matrix));
    const first = !matricesBox.children.length;
    matricesBox.replaceChildren(...Object.entries(MATRICES).map(([key, [rows, cols]]) => {
      const box = el("details", "hx-matrix");
      box.dataset.matrix = key;
      box.open = first ? key === "pa" : openOnes.has(key);
      const summary = el("summary", null, cfg.matrices[key]);
      box.append(summary);
      if (!state[rows].length || !state[cols].length) {
        box.append(el("p", "form-note", tx("Add items to both lists first.")));
        return box;
      }
      const wrap = el("div", "dl-table-wrap hx-matrix-wrap");
      wrap.tabIndex = 0;
      const table = el("table", "dl-table hx-grid");
      const head = el("tr");
      const corner = el("th", "hx-grid-corner", `${CODES[rows]} \\ ${CODES[cols]}`);
      corner.scope = "col";
      head.append(corner);
      state[cols].forEach((col, c) => {
        const th = el("th", "hx-grid-col");
        th.scope = "col";
        th.title = col.text;
        th.append(el("abbr", null, `${CODES[cols]}${c + 1}`));
        th.querySelector("abbr").title = col.text;
        head.append(th);
      });
      const thead = el("thead");
      thead.append(head);
      const body = el("tbody");
      state[rows].forEach((row, r) => {
        const tr = el("tr");
        const th = el("th", "hx-grid-row");
        th.scope = "row";
        th.append(el("span", "hx-code", `${CODES[rows]}${r + 1}`), " ", el("span", "hx-grid-name", row.text || "–"));
        tr.append(th);
        state[cols].forEach((col, c) => {
          const td = el("td", "hx-grid-cell");
          const value = cell(state, key, row.id, col.id);
          const button = el("button", `hx-cell${value ? ` is-${value}` : ""}`, strengthMark(value) || "·");
          button.type = "button";
          button.dataset.focusKey = `cell:${key}:${row.id}:${col.id}`;
          button.setAttribute("aria-label", `${CODES[rows]}${r + 1} ${row.text} · ${CODES[cols]}${c + 1} ${col.text}: ${strengthName(key, value)}`);
          button.addEventListener("click", () => {
            const cycle = key === "po" ? CYCLE.po : CYCLE.other;
            const next = cycle[(cycle.indexOf(value) + 1) % cycle.length];
            const pair = `${row.id}|${col.id}`;
            if (next) state.links[key][pair] = next; else delete state.links[key][pair];
            changed();
            kit.keepFocus(() => { renderMatrices(); renderResults(); });
          });
          td.append(button);
          tr.append(td);
        });
        if (key === "po") {
          const check = ownerCheck(state, row.id);
          const td = el("td", `hx-grid-check ${check === "ok" ? "is-ok" : "is-bad"}`, check === "ok" ? `✓ ${tx("one primary owner")}` : check === "none" ? `! ${tx("no primary owner")}` : `! ${tx("{n} primary owners", { n: primaries(state, row.id).length })}`);
          tr.append(td);
        }
        body.append(tr);
      });
      if (key === "po") {
        const th = el("th", null, tx("Check"));
        th.scope = "col";
        head.append(th);
      }
      table.append(thead, body);
      wrap.append(table);
      box.append(wrap);
      return box;
    }));
  };

  // 4 · Monthly targets and actuals --------------------------------------------------------------------------------------
  const currentMetric = () => state.metrics.find((m) => m.id === pickedMetric) || state.metrics[0] || null;
  const renderMetricPick = () => {
    const m = currentMetric();
    metricPick.replaceChildren(...state.metrics.map((metric) => { const o = el("option", null, itemName("metrics", metric)); o.value = metric.id; return o; }));
    metricPick.value = m?.id || "";
    metricPick.disabled = !m;
  };
  metricPick.addEventListener("change", () => { pickedMetric = metricPick.value; renderMonths(); });
  const statusCell = (td, metric, i) => {
    const s = monthStatus(metric, i);
    td.className = `hx-month-status${s === "met" ? " is-met" : s === "missed" ? " is-missed" : ""}`;
    td.textContent = s === "met" ? `✓ ${tx("met")}` : s === "missed" ? `✗ ${tx("missed")}` : statusWord(s);
  };
  const renderMonths = () => {
    const m = currentMetric();
    monthsBox.replaceChildren();
    root.querySelector("[data-spread]").disabled = !m;
    if (!m) { monthsBox.append(el("p", "form-note", tx("Add a metric in step 2 first."))); return; }
    monthsBox.append(el("p", "form-note", [m.better === "lower" ? cfg.better.lower : cfg.better.higher, m.baseline !== null ? `${tx("Baseline")} ${fmt(m, m.baseline)}` : "", m.target !== null ? `${tx("Target at year end")} ${goal(m)}` : ""].filter(Boolean).join(" · ")));
    const wrap = el("div", "dl-table-wrap");
    const table = el("table", "dl-table hx-months");
    const head = el("tr");
    [tx("Month"), tx("Target"), tx("Actual value"), tx("Status")].forEach((label) => { const th = el("th", null, label); th.scope = "col"; head.append(th); });
    const thead = el("thead");
    thead.append(head);
    const body = el("tbody");
    planMonths(state.start).forEach((month, i) => {
      const tr = el("tr");
      const th = el("th", null, monthName(month));
      th.scope = "row";
      const s = el("td");
      const inputs = ["targets", "actuals"].map((kind) => {
        const td = el("td");
        const input = numberInput(`hx-${kind}-${i}`, m[kind][i]);
        input.classList.add("hx-num");
        input.setAttribute("aria-label", `${kind === "targets" ? tx("Target") : tx("Actual value")} · ${monthName(month)}`);
        input.addEventListener("input", () => { m[kind][i] = readNumber(input.value); changed(); statusCell(s, m, i); renderSoon(); });
        td.append(input);
        return td;
      });
      statusCell(s, m, i);
      tr.append(th, ...inputs, s);
      body.append(tr);
    });
    table.append(thead, body);
    wrap.append(table);
    monthsBox.append(wrap);
  };
  root.querySelector("[data-spread]").addEventListener("click", () => {
    const m = currentMetric();
    if (!m) return;
    const path = spreadTargets(m.baseline, m.target, Math.max(1, digitsOf(m)));
    if (!path) { flash(monthsStatus, tx("Enter the baseline and the target at year end first.")); return; }
    const before = m.targets.slice();
    m.targets = path;
    changed();
    renderMonths();
    renderResults();
    undoNote(monthsStatus, tx("Twelve monthly targets from {from} to {to}.", { from: fmt(m, m.baseline), to: fmt(m, m.target) }), () => { m.targets = before; save(); renderMonths(); renderResults(); });
  });

  // 5 · Projects and catchball ---------------------------------------------------------------------------------------------
  const renderProjects = () => {
    const saved = portfolioState();
    const real = portfolioProjects(saved);
    const examples = exampleProjects(cfg.example, today());
    const usedExample = state.priorities.some((p) => isExampleProject(p.project));
    portfolioNote.textContent = real.length
      ? (real.length === 1 ? tx("1 project in the Project Portfolio of this browser. It is read here, never changed.") : tx("{n} projects in the Project Portfolio of this browser. They are read here, never changed.", { n: int.format(real.length) })) + (saved?.example === true ? ` ${tx("The portfolio still shows its example.")}` : "")
      : tx("The Project Portfolio of this browser has no projects yet. Keep a priority standalone, or start its project in the portfolio.");
    projectsBox.replaceChildren();
    if (!state.priorities.length) { projectsBox.append(el("p", "form-note", tx("Add an improvement priority in step 2 first."))); return; }
    const list = el("ul", "hx-project-list");
    state.priorities.forEach((p, index) => {
      const li = el("li", "hx-project");
      const select = el("select", "hx-in");
      select.id = `hx-project-${index}`;
      const options = [["", tx("Standalone, no project")], ...real.map((x) => [x.id, x.title || tx("Project")]), ...(usedExample ? examples.map((x) => [x.id, `${x.title} (${tx("example")})`]) : [])];
      const found = findProject([...real, ...examples], p);
      if (p.project && !found) options.push([p.project, `${p.projectTitle || tx("Project")} (${tx("not in this browser")})`]);
      options.forEach(([value, label]) => { const o = el("option", null, label); o.value = value; select.append(o); });
      select.value = p.project;
      select.addEventListener("change", () => {
        p.project = idText(select.value);
        p.projectTitle = findProject([...real, ...examples], p)?.title || "";
        changed();
        renderProjects();
        renderResults();
      });
      li.append(field(itemName("priorities", p), select, "field hx-wide"));
      const info = el("p", "form-note hx-project-info", found ? `${projectLine(found)}${isExampleProject(found.id) ? ` · ${tx("example project, held on this page only")}` : ""}` : p.project ? tx("This project is not in the portfolio of this browser any more.") : "");
      li.append(info);
      list.append(li);
    });
    projectsBox.append(list);
  };
  const renderCatchSelect = () => {
    const value = catchPriority.value;
    catchPriority.replaceChildren(...state.priorities.map((p) => { const o = el("option", null, itemName("priorities", p)); o.value = p.id; return o; }));
    if (state.priorities.some((p) => p.id === value)) catchPriority.value = value;
    catchKind.replaceChildren(...KINDS.map((key) => { const o = el("option", null, cfg.catchball[key]); o.value = key; return o; }));
    if (!catchDate.value) catchDate.value = today();
  };
  const renderCatchList = () => {
    catchList.replaceChildren();
    const withNotes = state.priorities.filter((p) => catchState(state, p.id).notes.length);
    if (!withNotes.length) { catchList.append(el("p", "form-note", tx("No catchball notes yet."))); return; }
    withNotes.forEach((p) => {
      const box = el("div", "hx-catch");
      const c = catchState(state, p.id);
      const h = el("p", "hx-catch-head");
      h.append(el("strong", null, itemName("priorities", p)), " ", el("span", `hx-step${c.agreed ? " is-agreed" : ""}`, c.agreed ? `✓ ${cfg.catchball.agreed}` : `… ${cfg.catchball[c.last]}`));
      const ol = el("ol", "hx-catch-notes");
      c.notes.forEach((n) => {
        const li = el("li");
        li.append(el("span", "hx-catch-meta", `${n.date ? showDate(n.date) : "–"} · ${cfg.catchball[n.kind]}${n.from ? ` · ${n.from}` : ""}`), " ", el("span", null, n.text));
        const remove = el("button", "dl-remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `${tx("Remove")} · ${cfg.catchball[n.kind]} ${n.date ? showDate(n.date) : ""}`.trim());
        remove.addEventListener("click", () => {
          const index = state.catchball.indexOf(n);
          state.catchball.splice(index, 1);
          changed();
          renderCatchList();
          renderResults();
          catchText.focus();
          undoNote(catchStatus, tx("Note removed."), () => { state.catchball.splice(Math.min(index, state.catchball.length), 0, n); save(); renderCatchList(); renderResults(); });
        });
        li.append(remove);
        ol.append(li);
      });
      box.append(h, ol);
      catchList.append(box);
    });
  };
  root.querySelector("[data-catch-add]").addEventListener("click", () => {
    const priority = catchPriority.value;
    const words = catchText.value.trim();
    if (!priority) { flash(catchStatus, tx("Add an improvement priority in step 2 first.")); return; }
    if (!words) { flash(catchStatus, tx("Write the note first.")); catchText.focus(); return; }
    state.catchball.push({ id: newId("c"), priority, date: kit.parseDate(catchDate.value) || today(), kind: KINDS.includes(catchKind.value) ? catchKind.value : "proposal", from: catchFrom.value.trim().slice(0, 120), text: words.slice(0, 1000) });
    changed();
    catchText.value = "";
    renderCatchList();
    renderResults();
    flash(catchStatus, tx("Note added."));
  });

  // The X-matrix as on paper -----------------------------------------------------------------------------------------------
  // A line of text broken into at most `lines` lines of about `width` characters; the rest becomes "…".
  const wrap = (value, width, lines) => {
    const words = String(value || "").split(/\s+/).filter(Boolean);
    const out = [];
    let line = "";
    for (const word of words) {
      if (line && (line + " " + word).length > width) { out.push(line); line = word; } else line = line ? `${line} ${word}` : word;
    }
    if (line) out.push(line);
    if (out.length <= lines) return out.length ? out : [""];
    const kept = out.slice(0, lines);
    kept[lines - 1] = `${kept[lines - 1].slice(0, Math.max(1, width - 1))}…`;
    return kept;
  };
  const xMatrix = (plan, gapList) => {
    const { svgEl, C } = CK;
    const cellSize = 28, S = 380, pad = 14, top = 44, gapR = 8;
    const n = Object.fromEntries(LISTS.map((list) => [list, Math.max(plan[list].length, 2)]));
    const xW = pad, xC = xW + n.annual * cellSize, xE = xC + S, xR = xE + n.metrics * cellSize + gapR;
    const yN = top, yC = yN + n.priorities * cellSize, yS = yC + S;
    const W = xR + n.owners * cellSize + pad;
    const H = yS + n.breakthroughs * cellSize + 40;
    const title = `${cfg.text.tool}: ${plan.title || tx("X-matrix")} · ${monthName(plan.start)} – ${monthName(addMonths(plan.start, 11))}`;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": title, class: "ck-chart hx-xm", "font-family": "Inter, Segoe UI, Roboto, Arial, sans-serif" });
    svg.append(svgEl("title", {}, title));
    svg.append(svgEl("text", { x: pad, y: 20, "font-size": 15, "font-weight": 800, fill: C.text }, plan.title || cfg.text.tool));
    svg.append(svgEl("text", { x: pad, y: 36, "font-size": 11, fill: C.muted }, `${monthName(plan.start)} – ${monthName(addMonths(plan.start, 11))} · ${tx("● strong ○ weak · resources: ● primary owner ○ secondary")}`));
    const gapIds = new Set(gapList.map((g) => g.id));
    const line = (x1, y1, x2, y2, stroke = C.grid, width = 1) => svg.append(svgEl("line", { x1, y1, x2, y2, stroke, "stroke-width": width }));
    // A grid of cells: columns from x0, rows from y0.
    const grid = (x0, y0, cols, rows) => {
      for (let c = 0; c <= cols; c++) line(x0 + c * cellSize, y0, x0 + c * cellSize, y0 + rows * cellSize);
      for (let r = 0; r <= rows; r++) line(x0, y0 + r * cellSize, x0 + cols * cellSize, y0 + r * cellSize);
    };
    const mark = (cx, cy, value, tipText) => {
      const g = svgEl("g", { class: "ck-hit", "data-tip": tipText });
      g.append(svgEl("rect", { x: cx - cellSize / 2, y: cy - cellSize / 2, width: cellSize, height: cellSize, fill: "transparent" }));
      if (value === "strong" || value === "primary") g.append(svgEl("circle", { cx, cy, r: 6.5, fill: value === "primary" ? C.blue : C.text }));
      else if (value === "weak" || value === "secondary") g.append(svgEl("circle", { cx, cy, r: 6, fill: "none", stroke: value === "secondary" ? C.blue : C.text, "stroke-width": 1.8 }));
      g.append(svgEl("title", {}, tipText));
      svg.append(g);
    };
    // A label of one item: horizontal in the north and south bands, turned to read upwards in the west and east.
    const label = (x, y, value, { vertical = false, bad = false, width = 60, lines = 2, size = 10.5, tipText } = {}) => {
      const parts = wrap(value, width, lines);
      const g = svgEl("g", { class: "ck-hit", "data-tip": tipText || value });
      parts.forEach((part, i) => {
        const offset = (i - (parts.length - 1) / 2) * (size + 1.5);
        // Turned a quarter to the left about its start, a column's text reads upwards and its lines stand side by side.
        const attrs = { x, y: y + offset + size * 0.35, ...(vertical && { transform: `rotate(-90 ${x} ${y})` }) };
        g.append(svgEl("text", { ...attrs, "font-size": size, fill: bad ? C.danger : C.text, "font-weight": i === 0 ? 600 : 400 }, part));
      });
      g.append(svgEl("title", {}, tipText || value));
      svg.append(g);
    };
    const charsIn = (length, size = 10.5) => Math.floor(length / (size * 0.52));
    // The corners.
    grid(xW, yN, n.annual, n.priorities);
    grid(xE, yN, n.metrics, n.priorities);
    grid(xR, yN, n.owners, n.priorities);
    grid(xW, yS, n.annual, n.breakthroughs);
    // The list bands: north and south rows, west and east columns, and the resources' names.
    for (let r = 0; r <= n.priorities; r++) line(xC, yN + r * cellSize, xE, yN + r * cellSize);
    for (let r = 0; r <= n.breakthroughs; r++) line(xC, yS + r * cellSize, xE, yS + r * cellSize);
    for (let c = 0; c <= n.annual; c++) line(xW + c * cellSize, yC, xW + c * cellSize, yS);
    for (let c = 0; c <= n.metrics; c++) line(xE + c * cellSize, yC, xE + c * cellSize, yS);
    for (let c = 0; c <= n.owners; c++) line(xR + c * cellSize, yC, xR + c * cellSize, yS);
    line(xW, yC, xC, yC); line(xW, yS, xC, yS); line(xE, yC, xE + n.metrics * cellSize, yC); line(xE, yS, xE + n.metrics * cellSize, yS);
    line(xR, yC, xR + n.owners * cellSize, yC); line(xR, yS, xR + n.owners * cellSize, yS);
    line(xC, yN, xC, yS + n.breakthroughs * cellSize); line(xE, yN, xE, yS + n.breakthroughs * cellSize);
    // The centre: a square cut by its two diagonals into the four directions.
    svg.append(svgEl("rect", { x: xC, y: yC, width: S, height: S, fill: "none", stroke: C.line, "stroke-width": 1.5 }));
    line(xC, yC, xE, yS, C.line, 1.5);
    line(xE, yC, xC, yS, C.line, 1.5);
    const centre = (x, y, value, rotate = 0) => {
      const parts = wrap(value, 26, 2);
      parts.forEach((part, i) => svg.append(svgEl("text", { x, y: y + (i - (parts.length - 1) / 2) * 14 + 4, "text-anchor": "middle", "font-size": 12, "font-weight": 800, fill: C.muted, transform: rotate ? `rotate(${rotate} ${x} ${y})` : undefined, "letter-spacing": ".02em" }, part)));
    };
    centre(xC + S / 2, yC + S * 0.17, Q.priorities[0]);
    centre(xC + S / 2, yC + S * 0.83, Q.breakthroughs[0]);
    centre(xC + S * 0.15, yC + S / 2, Q.annual[0], -90);
    centre(xC + S * 0.85, yC + S / 2, Q.metrics[0], 90);
    // North: the improvement priorities, a row each.
    plan.priorities.forEach((p, r) => {
      const y = yN + r * cellSize + cellSize / 2;
      label(xC + 6, y, `P${r + 1} ${p.text}`, { width: charsIn(S - 12), bad: gapIds.has(p.id) });
      plan.annual.forEach((a, c) => { const v = cell(plan, "pa", p.id, a.id); if (v) mark(xW + c * cellSize + cellSize / 2, y, v, `P${r + 1} · A${c + 1}: ${cfg.strengths[v]}`); });
      plan.metrics.forEach((m, c) => { const v = cell(plan, "pm", p.id, m.id); if (v) mark(xE + c * cellSize + cellSize / 2, y, v, `P${r + 1} · M${c + 1}: ${cfg.strengths[v]}`); });
      plan.owners.forEach((o, c) => { const v = cell(plan, "po", p.id, o.id); if (v) mark(xR + c * cellSize + cellSize / 2, y, v, `P${r + 1} · R${c + 1} ${o.text}: ${cfg.roles[v]}`); });
    });
    // South: the breakthrough objectives, a row each, tied to the annual objectives on their left.
    plan.breakthroughs.forEach((b, r) => {
      const y = yS + r * cellSize + cellSize / 2;
      label(xC + 6, y, `B${r + 1} ${b.text}`, { width: charsIn(S - 12), bad: gapIds.has(b.id) });
      plan.annual.forEach((a, c) => { const v = cell(plan, "ba", a.id, b.id); if (v) mark(xW + c * cellSize + cellSize / 2, y, v, `A${c + 1} · B${r + 1}: ${cfg.strengths[v]}`); });
    });
    // West, east and the resources: columns whose text reads upwards from the bottom of the centre band.
    plan.annual.forEach((a, c) => label(xW + c * cellSize + cellSize / 2, yS - 6, `A${c + 1} ${a.text}`, { vertical: true, width: charsIn(S - 12), bad: gapIds.has(a.id) }));
    plan.metrics.forEach((m, c) => label(xE + c * cellSize + cellSize / 2, yS - 6, `M${c + 1} ${m.text}${m.target !== null ? ` (${goal(m)})` : ""}`, { vertical: true, width: charsIn(S - 12), bad: gapIds.has(m.id) }));
    plan.owners.forEach((o, c) => label(xR + c * cellSize + cellSize / 2, yS - 6, `R${c + 1} ${o.text}${o.role ? ` · ${o.role}` : ""}`, { vertical: true, width: charsIn(S - 12) }));
    // Under the resources: who carries how many priorities, primary and secondary.
    plan.owners.forEach((o, c) => {
      const p = plan.priorities.filter((x) => cell(plan, "po", x.id, o.id) === "primary").length;
      const s = plan.priorities.filter((x) => cell(plan, "po", x.id, o.id) === "secondary").length;
      const g = svgEl("g", { class: "ck-hit", "data-tip": `R${c + 1} ${o.text}: ${p} ● ${cfg.roles.primary}, ${s} ○ ${cfg.roles.secondary}` });
      g.append(svgEl("text", { x: xR + c * cellSize + cellSize / 2, y: yS + 14, "text-anchor": "middle", "font-size": 10, fill: C.muted }, `${p}●`));
      g.append(svgEl("text", { x: xR + c * cellSize + cellSize / 2, y: yS + 27, "text-anchor": "middle", "font-size": 10, fill: C.muted }, `${s}○`));
      svg.append(g);
    });
    svg.append(svgEl("text", { x: pad, y: H - 10, "font-size": 10.5, fill: C.muted }, tx("South: breakthrough objectives · west: annual objectives · north: improvement priorities · east: metrics to improve · far east: resources")));
    return svg;
  };
  // The same matrix as lists, for a phone: each item with the marks of its row or column.
  const chips = (pairs) => {
    const ul = el("ul", "hx-chips");
    pairs.forEach(([codeText, value, matrix]) => { const li = el("li", `hx-chip is-${value}`, `${codeText} ${strengthMark(value)}`); li.title = strengthName(matrix, value); ul.append(li); });
    return ul;
  };
  const listView = (plan, gapList) => {
    const box = el("div", "hx-xm-list");
    const gapIds = new Set(gapList.map((g) => g.id));
    const section = (list, rowsOf) => {
      const sec = el("section", "hx-xm-sec");
      sec.append(el("h4", "hx-xm-sec-title", `${CODES[list]} · ${Q[list][0]}`));
      const ol = el("ol", "hx-xm-items");
      plan[list].forEach((item, i) => {
        const li = el("li", gapIds.has(item.id) ? "is-gap" : null);
        li.append(el("strong", null, `${CODES[list]}${i + 1} ${item.text || "–"}`), gapIds.has(item.id) ? el("span", "hx-gap-flag", ` ! ${tx("gap")}`) : "");
        rowsOf(item).forEach(([labelText, pairs]) => {
          if (!pairs.length) return;
          const p = el("div", "hx-xm-links");
          p.append(el("span", "hx-xm-link-label", labelText), chips(pairs));
          li.append(p);
        });
        ol.append(li);
      });
      sec.append(ol);
      return sec;
    };
    const pairs = (matrix, list, item, asRow) => (asRow ? linkedTo(plan, matrix, item.id) : linkedFrom(plan, matrix, item.id)).map((other) => [codeOf(plan, list, other.id), asRow ? cell(plan, matrix, item.id, other.id) : cell(plan, matrix, other.id, item.id), matrix]);
    box.append(
      section("breakthroughs", (b) => [[Q.annual[0], pairs("ba", "annual", b, false)]]),
      section("annual", (a) => [[Q.breakthroughs[0], pairs("ba", "breakthroughs", a, true)], [Q.priorities[0], pairs("pa", "priorities", a, false)]]),
      section("priorities", (p) => [[Q.annual[0], pairs("pa", "annual", p, true)], [Q.metrics[0], pairs("pm", "metrics", p, true)], [Q.owners[0], pairs("po", "owners", p, true)]]),
      section("metrics", (m) => [[Q.priorities[0], pairs("pm", "priorities", m, false)]]),
      section("owners", (o) => [[Q.priorities[0], pairs("po", "priorities", o, false)]]),
    );
    return box;
  };

  // Results ------------------------------------------------------------------------------------------------------------
  const table = (heads, rows, className = "") => {
    const box = el("div", "dl-table-wrap");
    box.tabIndex = 0;
    const tbl = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    heads.forEach(([labelText, cls]) => { const th = el("th", cls, labelText); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach(([value, cls]) => { const td = el("td", cls); td.append(value ?? ""); tr.append(td); });
      tbody.append(tr);
    });
    tbl.append(thead, tbody);
    box.append(tbl);
    return box;
  };
  const xMatrixPanel = (gapList) => {
    const box = el("article", "dl-panel hx-xm-panel");
    box.append(el("h3", "result-label", tx("The X-matrix")));
    box.append(el("p", "dl-panel-note", gapList.length === 1 ? tx("1 gap: the item in red misses a link or an owner. The list is under the matrix.") : gapList.length ? tx("{n} gaps: the items in red miss a link or an owner. The list is under the matrix.", { n: gapList.length }) : tx("Every objective is deployed: each priority serves an annual objective, moves a metric and has one primary owner.")));
    const details = el("details", "hx-xm-paper");
    details.open = window.matchMedia ? window.matchMedia("(min-width: 761px)").matches : true;
    details.append(el("summary", null, tx("The X-matrix as on paper (scrolls sideways)")));
    if (CK) details.append(CK.figure(xMatrix(state, gapList), { fileName: `${cfg.text.csv}-x-matrix` }));
    box.append(details, listView(state, gapList));
    const gapsBox = el("div", "hx-gaps");
    gapsBox.append(el("p", "result-label", gapList.length ? tx("Gaps in the matrix") : tx("No gaps")));
    if (gapList.length) {
      const ul = el("ul", "hx-gap-list");
      gapList.forEach((g) => { const li = el("li"); li.append(el("strong", null, `! ${gapText(g)}`), " ", el("span", "hx-sub", `${g.code} ${g.text || "–"}`)); ul.append(li); });
      gapsBox.append(ul);
    }
    box.append(gapsBox);
    return box;
  };
  const bowlingPanel = (idx) => {
    const months = planMonths(state.start);
    const box = el("article", "dl-panel hx-bowling");
    box.append(el("h3", "result-label", tx("Bowling chart")));
    box.append(el("p", "dl-panel-note", tx("Each metric with its target and actual per month. A month is met when the actual is at or better than its target; the review month is marked.")));
    const wrapBox = el("div", "dl-table-wrap hx-bowl-wrap");
    wrapBox.tabIndex = 0;
    const tbl = el("table", "dl-table hx-bowl");
    const thead = el("thead");
    const hr = el("tr");
    const first = el("th", "hx-bowl-name", tx("Metric"));
    first.scope = "col";
    const kindHead = el("th", null, "");
    kindHead.scope = "col";
    kindHead.append(el("span", "visually-hidden", tx("Row")));
    hr.append(first, kindHead);
    months.forEach((m, i) => { const th = el("th", `num${i === idx ? " is-review" : ""}`, shortMonth(m)); th.scope = "col"; th.title = monthName(m); hr.append(th); });
    [tx("Met"), tx("Trend")].forEach((t) => { const th = el("th", null, t); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const tbody = el("tbody");
    state.metrics.forEach((m, mi) => {
      const b = bowling(m);
      const t1 = el("tr", "hx-bowl-target");
      const name = el("th", "hx-bowl-name");
      name.scope = "rowgroup";
      name.rowSpan = 2;
      name.append(el("strong", null, `M${mi + 1} ${m.text || "–"}`), el("small", null, [goal(m), m.better === "lower" ? `↓ ${cfg.better.lower}` : `↑ ${cfg.better.higher}`].filter(Boolean).join(" · ")));
      t1.append(name, el("td", "hx-bowl-kind", tx("Target")));
      const t2 = el("tr", "hx-bowl-actual");
      t2.append(el("td", "hx-bowl-kind", tx("Actual value")));
      b.months.forEach((month, i) => {
        t1.append(el("td", `num${i === idx ? " is-review" : ""}`, fmt(m, month.target)));
        const s = monthStatus(m, i);
        const td = el("td", `num hx-bowl-cell${s === "met" ? " is-met" : s === "missed" ? " is-missed" : ""}${i === idx ? " is-review" : ""}`);
        td.append(el("span", "hx-bowl-value", fmt(m, month.actual)));
        if (s === "met" || s === "missed") td.append(el("span", "hx-bowl-word", s === "met" ? `✓ ${tx("met")}` : `✗ ${tx("missed")}`));
        td.title = `${monthName(months[i])}: ${fmt(m, month.actual)} / ${fmt(m, month.target)}${statusWord(s) ? ` · ${statusWord(s)}` : ""}`;
        t2.append(td);
      });
      const score = el("td", "hx-bowl-score", b.reported ? tx("{a} of {b}", { a: b.met, b: b.reported }) : "–");
      score.rowSpan = 2;
      const tr = el("td", `hx-bowl-trend is-${b.trend.direction || "none"}`, trendWord(b.trend.direction));
      tr.rowSpan = 2;
      t1.append(score, tr);
      tbody.append(t1, t2);
    });
    tbl.append(thead, tbody);
    wrapBox.append(tbl);
    box.append(wrapBox);
    return box;
  };
  const trendsPanel = (idx) => {
    const box = panel(tx("Metric trends"), tx("Actual against the target path, month by month. A red dot is a missed month."));
    box.classList.add("hx-trends");
    const months = planMonths(state.start);
    const grid = el("div", "hx-trend-grid");
    state.metrics.forEach((m, mi) => {
      const points = (kind) => months.map((month, i) => ({ x: shortMonth(month), y: m[kind][i] ?? NaN, state: kind === "actuals" ? (monthStatus(m, i) === "missed" ? "danger" : monthStatus(m, i) === "met" ? "ok" : undefined) : undefined, tip: `${monthName(month)}: ${fmt(m, m[kind][i])}${m.unit ? ` ${m.unit}` : ""}${kind === "actuals" && statusWord(monthStatus(m, i)) ? ` · ${statusWord(monthStatus(m, i))}` : ""}` }));
      // The axis spans the metric's own values, so a change of a tenth of a percent is visible.
      const values = [...m.targets, ...m.actuals, m.baseline, m.target].filter((v) => v !== null);
      const lo = Math.min(...values), hi = Math.max(...values), pad = (hi - lo || Math.abs(hi) || 1) * 0.15;
      const svg = CK.line([{ label: tx("Target"), points: points("targets"), color: CK.C.muted }, { label: tx("Actual value"), points: points("actuals"), color: CK.C.blue }], { title: `M${mi + 1} ${m.text}`, unit: m.unit, format: (v) => num(v, digitsOf(m)), ...(values.length && { yMin: lo - pad, yMax: hi + pad }) });
      const fig = el("div", "hx-trend");
      fig.append(el("p", "hx-trend-title", `M${mi + 1} ${m.text || "–"} · ${trendWord(trend(m).direction)}`), CK.figure(svg, { fileName: `${cfg.text.csv}-m${mi + 1}` }));
      grid.append(fig);
    });
    box.append(grid);
    return box;
  };
  const projectsPanel = () => {
    const projects = allProjects();
    const box = panel(tx("Projects behind the priorities"), tx("Phase, status and savings of the linked projects of the Project Portfolio, in this plan year."));
    box.append(table([[tx("Priority")], [tx("Project")], [tx("Phase")], [tx("Status")], [tx("Savings this plan year"), "num"]], state.priorities.map((p, i) => {
      const project = findProject(projects, p);
      if (!project) return [[`P${i + 1} ${p.text}`], [p.project ? `${p.projectTitle || tx("Project")} (${tx("not in this browser")})` : tx("standalone")], ["–"], ["–"], ["–", "num"]];
      const s = projectSavings(project, state.start);
      const save2 = el("span", null, money(s.realised));
      save2.append(el("small", "hx-sub", tx("of {planned} planned", { planned: money(s.planned) })));
      return [[`P${i + 1} ${p.text}`], [`${project.title}${isExampleProject(project.id) ? ` (${tx("example")})` : ""}`], [cfg.portfolio.phases[project.phase]], [el("span", `hx-pstatus is-${project.status}`, cfg.portfolio.statuses[project.status])], [save2, "num"]];
    }), "hx-projects"));
    const goals = objectiveSavings(state, projects, state.start).filter((g) => g.target > 0 || g.projects.length);
    if (goals.length) {
      box.append(el("p", "result-label", tx("Savings against the annual objectives")));
      const ul = el("ul", "hx-goal-list");
      goals.forEach((g) => {
        const a = state.annual.find((x) => x.id === g.id);
        const li = el("li");
        li.append(el("strong", null, `${code("annual", g.id)} ${a.text}`));
        const vars = { realised: money(g.realised), planned: money(g.planned), n: g.projects.length, target: money(g.target), share: pct(g.share || 0, 0) };
        const one = g.projects.length === 1;
        li.append(el("span", null, g.target > 0
          ? (one ? tx("{realised} realised and {planned} planned by 1 linked project, against a target of {target} ({share}).", vars) : tx("{realised} realised and {planned} planned by {n} linked projects, against a target of {target} ({share}).", vars))
          : (one ? tx("{realised} realised and {planned} planned by 1 linked project.", vars) : tx("{realised} realised and {planned} planned by {n} linked projects.", vars))));
        if (g.target > 0) {
          const track = el("span", "bar-track hx-goal-bar");
          const fill = el("span", "bar-fill");
          fill.style.width = `${Math.min(100, (g.share || 0) * 100)}%`;
          track.append(fill);
          li.append(track);
        }
        ul.append(li);
      });
      box.append(ul);
    }
    return box;
  };
  const catchPanel = () => {
    const agreed = state.priorities.filter((p) => catchState(state, p.id).agreed).length;
    const box = panel(tx("Catchball"), tx("{a} of {b} priorities agreed with the level below.", { a: agreed, b: state.priorities.length }));
    const ul = el("ul", "hx-catch-sum");
    state.priorities.forEach((p, i) => {
      const c = catchState(state, p.id);
      const li = el("li");
      li.append(el("strong", null, `P${i + 1} ${p.text || "–"}`), " ", el("span", `hx-step${c.agreed ? " is-agreed" : ""}`, c.agreed ? `✓ ${cfg.catchball.agreed}` : c.last ? `… ${cfg.catchball[c.last]}` : tx("no catchball yet")));
      if (c.notes.length) li.append(el("small", "hx-sub", `${showDate(c.notes.at(-1).date)} · ${c.notes.at(-1).from ? `${c.notes.at(-1).from}: ` : ""}${c.notes.at(-1).text}`));
      ul.append(li);
    });
    box.append(ul);
    return box;
  };

  // The monthly review: what missed twice in a row gets a countermeasure, an owner and a date, and goes to the Action
  // Tracker; an A3 when the cause is not clear.
  const reviewCard = (idx) => {
    const months = planMonths(state.start);
    const card = el("article", "result-card dl-focus hx-review");
    card.append(el("p", "result-label", tx("Start here")));
    if (idx < 1) {
      card.append(el("h3", null, tx("The monthly review starts after the second month of the plan year.")), el("p", "dl-focus-lede", tx("Enter the actuals each month; a metric that misses two months in a row asks for a countermeasure.")));
      return card;
    }
    const flagged = reviewFlags(state, idx);
    const watch = state.metrics.filter((m) => monthStatus(m, idx) === "missed" && !missedTwice(m, idx));
    const vars = { month: monthName(months[idx]), before: monthName(months[idx - 1]) };
    const h3 = el("h3");
    h3.append(tx("Review of {month}", vars), el("span", null, ` · ${flagged.length === 1 ? tx("1 metric missed two months in a row") : flagged.length ? tx("{n} metrics missed two months in a row", { n: flagged.length }) : tx("no metric missed two months in a row")}`));
    card.append(h3);
    card.append(el("p", "dl-focus-lede", flagged.length ? tx("Agree a countermeasure for each, with an owner and a date. If the cause is not clear, open an A3.") : tx("Keep the countermeasures that work, and enter next month's actuals.")));
    const statusLine = el("p", "form-note hx-review-status");
    statusLine.setAttribute("role", "status");
    flagged.forEach((m) => {
      const mi = state.metrics.indexOf(m);
      const r = state.review[m.id] || (state.review[m.id] = { countermeasure: "", owner: "", due: "" });
      const owner = state.priorities.filter((p) => cell(state, "pm", p.id, m.id) === "strong").map((p) => primaries(state, p.id)[0]?.text).find(Boolean) || "";
      const box = el("div", "hx-flag");
      box.append(el("p", "hx-flag-name", `M${mi + 1} ${m.text}`));
      box.append(el("p", "hx-flag-why", tx("{before}: {a} against {ta} · {month}: {b} against {tb} · missed {n} months in a row", { ...vars, a: fmt(m, m.actuals[idx - 1]), ta: fmt(m, m.targets[idx - 1]), b: fmt(m, m.actuals[idx]), tb: fmt(m, m.targets[idx]), n: missedInARow(m, idx) })));
      const grid = el("div", "dl-grid");
      const cm = el("textarea", "hx-in");
      cm.id = `hx-cm-${m.id}`;
      cm.rows = 2;
      cm.value = r.countermeasure;
      cm.placeholder = cfg.text.countermeasurePlaceholder;
      cm.addEventListener("input", () => { r.countermeasure = cm.value.slice(0, 600); changed(); });
      const who = textInput(`hx-cm-owner-${m.id}`, r.owner || owner, "");
      who.addEventListener("input", () => { r.owner = who.value.slice(0, 120); changed(); });
      const due = el("input", "hx-in");
      due.type = "date";
      due.id = `hx-cm-due-${m.id}`;
      due.value = r.due;
      due.addEventListener("change", () => { r.due = kit.parseDate(due.value); changed(); });
      grid.append(field(tx("Countermeasure"), cm, "field dl-wide"), field(tx("Owner"), who), field(tx("Due date"), due));
      box.append(grid);
      const actions = el("div", "tool-actions");
      const problem = tx("{metric} missed its target in {before} and {month}", { ...vars, metric: m.text });
      const add = el("button", "button-primary", tx("Add to actions"));
      add.type = "button";
      add.addEventListener("click", () => {
        const S = window.ActionsStore;
        if (!S) return;
        const title = (r.countermeasure.trim() || tx("Countermeasure for: {problem}", { problem })).slice(0, 300);
        const twin = S.list().find((a) => S.isOpen(a) && a.source === "hoshin-kanri" && a.title === title);
        const link = el("a", "inline-link", tx("Open the Action Tracker"));
        link.href = S.trackerUrl().href;
        if (twin) { statusLine.replaceChildren(tx("This countermeasure is already on the Action Tracker."), " ", link); return; }
        S.add({ title, owner: who.value.trim() || owner, due: r.due, source: "hoshin-kanri", priority: "High",
          detail: `${problem}: ${fmt(m, m.actuals[idx - 1])} / ${fmt(m, m.targets[idx - 1])}, ${fmt(m, m.actuals[idx])} / ${fmt(m, m.targets[idx])}${m.unit ? ` ${m.unit}` : ""}`,
          check: tx("Met in the next monthly review: {goal}", { goal: `${m.better === "lower" ? "≤" : "≥"} ${fmt(m, m.targets[Math.min(11, idx + 1)] ?? m.target)}${m.unit ? ` ${m.unit}` : ""}` }) });
        statusLine.replaceChildren(tx("Added to the Action Tracker."), " ", link);
      });
      const a3 = el("a", "button-secondary", tx("Open the A3"));
      const a3Url = new URL(a3Base);
      a3Url.searchParams.set("problem", problem.slice(0, 300));
      a3.href = a3Url.href;
      const whys = el("a", "button-secondary", tx("Take it to 5 Whys"));
      const whysUrl = new URL(whysBase);
      whysUrl.searchParams.set("problem", problem.slice(0, 300));
      whys.href = whysUrl.href;
      actions.append(add, a3, whys);
      box.append(actions);
      card.append(box);
    });
    card.append(statusLine);
    if (watch.length) {
      card.append(el("p", "result-label", tx("Missed once: watch next month")));
      const ul = el("ul", "hx-watch");
      watch.forEach((m) => ul.append(el("li", null, `M${state.metrics.indexOf(m) + 1} ${m.text}: ${fmt(m, m.actuals[idx])} / ${fmt(m, m.targets[idx])}`)));
      card.append(ul);
    }
    const open = state.metrics.filter((m) => monthStatus(m, idx) === "open");
    if (open.length) card.append(el("p", "dl-warning", tx("No actual yet for {month}: {list}.", { month: monthName(months[idx]), list: open.map((m) => `M${state.metrics.indexOf(m) + 1}`).join(", ") })));
    return card;
  };

  // Exports ------------------------------------------------------------------------------------------------------------------
  const sheetRows = () => {
    const months = planMonths(state.start);
    const head = [tx("ID"), tx("Metric"), tx("Unit"), tx("Better is"), tx("Baseline"), tx("Target at year end"), tx("Month"), tx("Monthly target"), tx("Actual value"), tx("Status")];
    const rows = state.metrics.flatMap((m, mi) => months.map((month, i) => {
      const s = monthStatus(m, i);
      return [`M${mi + 1}`, m.text, m.unit, cfg.better[m.better], m.baseline ?? "", m.target ?? "", month, m.targets[i] ?? "", m.actuals[i] ?? "", statusWord(s)];
    }));
    return [head, ...rows];
  };
  const summaryText = () => {
    const idx = reviewIdx();
    const months = planMonths(state.start);
    const projects = allProjects();
    const g = gaps(state);
    const out = [`${cfg.text.tool} · ${state.title || tx("X-matrix")} · ${monthName(months[0])} – ${monthName(months[11])}`, ""];
    out.push(`${Q.breakthroughs[0]}:`, ...state.breakthroughs.map((b, i) => `  B${i + 1} ${b.text}`));
    out.push(`${Q.annual[0]}:`, ...state.annual.map((a, i) => `  A${i + 1} ${a.text} → ${linkedTo(state, "ba", a.id).map((b) => codeOf(state, "breakthroughs", b.id)).join(", ") || "–"}`));
    out.push(`${Q.priorities[0]}:`, ...state.priorities.map((p, i) => {
      const owner = primaries(state, p.id).map((o) => o.text).join(", ") || tx("no primary owner");
      const project = findProject(projects, p);
      return `  P${i + 1} ${p.text} → ${linkedTo(state, "pa", p.id).map((a) => codeOf(state, "annual", a.id)).join(", ") || "–"} · ${linkedTo(state, "pm", p.id).map((m) => codeOf(state, "metrics", m.id)).join(", ") || "–"} · ${owner}${project ? ` · ${project.title} (${projectLine(project)})` : ""}`;
    }));
    out.push(`${Q.metrics[0]}:`, ...state.metrics.map((m, i) => {
      const b = bowling(m);
      const last = idx >= 0 ? `${shortMonth(months[idx])} ${fmt(m, m.actuals[idx])} / ${fmt(m, m.targets[idx])}${statusWord(monthStatus(m, idx)) ? ` ${statusWord(monthStatus(m, idx))}` : ""}` : "";
      return `  M${i + 1} ${m.text} ${goal(m)} · ${last} · ${tx("{a} of {b}", { a: b.met, b: b.reported })} ${tx("met")} · ${trendWord(b.trend.direction)}`;
    }));
    out.push(`${Q.owners[0]}: ${state.owners.map((o, i) => `R${i + 1} ${o.text}${o.role ? ` (${o.role})` : ""}`).join(" · ")}`, "");
    out.push(g.length ? `${tx("Gaps in the matrix")}: ${g.map(gapText).join(" ")}` : tx("No gaps"));
    if (idx >= 1) {
      const flagged = reviewFlags(state, idx);
      out.push(`${tx("Review of {month}", { month: monthName(months[idx]) })}: ${flagged.length ? flagged.map((m) => `M${state.metrics.indexOf(m) + 1} ${m.text}${state.review[m.id]?.countermeasure ? ` → ${state.review[m.id].countermeasure}${state.review[m.id].owner ? ` (${state.review[m.id].owner}${state.review[m.id].due ? `, ${showDate(state.review[m.id].due)}` : ""})` : ""}` : ""}`).join("; ") : tx("no metric missed two months in a row")}`);
    }
    return out.join("\n");
  };
  const printAs = (mode) => {
    document.body.classList.add(mode);
    results.querySelectorAll(".hx-xm-paper").forEach((d) => { d.open = true; });
    window.print();
  };
  window.addEventListener("afterprint", () => document.body.classList.remove("hx-print-matrix", "hx-print-bowling"));
  window.addEventListener("beforeprint", () => results.querySelectorAll(".hx-xm-paper").forEach((d) => { d.open = true; }));

  const renderResults = () => {
    results.replaceChildren();
    results.hidden = isEmpty(state);
    note.hidden = !state.example;
    if (results.hidden) return;
    const idx = reviewIdx();
    const months = planMonths(state.start);
    const g = gaps(state);
    const flagged = idx >= 1 ? reviewFlags(state, idx) : [];
    const score = monthScore(state, idx);
    const year = yearScore(state, 11);
    const projects = allProjects();
    const linked = [...new Map(state.priorities.map((p) => findProject(projects, p)).filter(Boolean).map((p) => [p.id, p])).values()];
    const savings = linked.reduce((s, p) => { const v = projectSavings(p, state.start); return { planned: s.planned + v.planned, realised: s.realised + v.realised }; }, { planned: 0, realised: 0 });

    const head = el("div", "result-head");
    head.append(el("p", "result-label", `${cfg.text.tool}${state.title ? ` · ${state.title}` : ""}`));
    const h2 = el("h2");
    h2.append(el("span", null, int.format(state.priorities.length)), ` ${tx("priorities deployed")} · ${g.length === 1 ? tx("1 gap") : tx("{n} gaps", { n: g.length })} · ${tx("{n} missed twice", { n: flagged.length })}`);
    head.append(h2);
    head.append(el("p", null, tx("{b} breakthrough objectives, {a} annual objectives, {m} metrics and {r} people on one page, {from} to {to}.", { b: state.breakthroughs.length, a: state.annual.length, m: state.metrics.length, r: state.owners.length, from: monthName(months[0]), to: monthName(months[11]) })));

    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Gaps in the matrix"), int.format(g.length), g.length ? tx("links or owners missing") : tx("every link and owner in place")),
      stat(idx >= 0 ? tx("Met in {month}", { month: monthName(months[idx]) }) : tx("Met last month"), score.reported ? tx("{a} of {b}", { a: score.met, b: score.reported }) : "–", score.missed ? tx("{n} missed the target", { n: score.missed }) : tx("no metric missed")),
      stat(tx("Months met this year"), year.reported ? pct(year.met / year.reported, 0) : "–", tx("{a} of {b} metric-months", { a: year.met, b: year.reported })),
      stat(tx("Missed twice in a row"), int.format(flagged.length), flagged.length ? flagged.map((m) => `M${state.metrics.indexOf(m) + 1}`).join(", ") : tx("no metric")),
      stat(tx("Savings of linked projects"), money(savings.realised), tx("realised of {planned} planned", { planned: money(savings.planned) })),
    );
    const actions = resultActions(summaryText, flagged[0] ? tx("{metric} missed its target in {before} and {month}", { metric: flagged[0].text, before: monthName(months[idx - 1]), month: monthName(months[idx]) }) : "");
    const printMatrix = el("button", "button-secondary", tx("Print the X-matrix"));
    printMatrix.type = "button";
    printMatrix.addEventListener("click", () => printAs("hx-print-matrix"));
    const printBowling = el("button", "button-secondary", tx("Print the bowling chart"));
    printBowling.type = "button";
    printBowling.addEventListener("click", () => printAs("hx-print-bowling"));
    // The bowling chart as CSV or Excel is offered once, under the plan ([data-csv], [data-xlsx]): the results used to
    // repeat the same two buttons for the same table.
    actions.append(printMatrix, printBowling);

    const panels = [];
    if (CK && state.metrics.length) panels.push(trendsPanel(idx));
    if (state.priorities.length) panels.push(projectsPanel(), catchPanel());
    resultLayout(results, { head, stats, notes: [xMatrixPanel(g), ...(state.metrics.length ? [bowlingPanel(idx)] : [])], focus: reviewCard(idx), actions, panels });
  };
  const renderSoon = renderOnPause(renderResults, () => 400, 100);

  const renderAll = () => {
    renderPlan();
    renderLists();
    renderMatrices();
    renderMetricPick();
    renderMonths();
    renderProjects();
    renderCatchSelect();
    renderCatchList();
    renderResults();
  };

  // Events -------------------------------------------------------------------------------------------------------------------
  root.querySelector("[data-example]").addEventListener("click", () => {
    state = fromExample(cfg.example, today());
    pickedMetric = "";
    save();
    renderAll();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  });
  root.querySelector("[data-clear]").addEventListener("click", () => {
    if (isEmpty(state) || !window.confirm(tx("Clear the whole matrix in this browser?"))) return;
    state = emptyPlan(state.start);
    save();
    renderAll();
  });
  const fileName = () => cfg.text.csv;
  root.querySelector("[data-csv]").addEventListener("click", () => { if (state.metrics.length) downloadCsv(fileName(), sheetRows()); });
  root.querySelector("[data-xlsx]").addEventListener("click", () => { if (state.metrics.length) downloadXlsx(fileName(), sheetRows(), { sheet: tx("Bowling chart"), title: cfg.text.tool }); });
  // A matrix as a file: the next level opens it here and builds its own matrix under it.
  const packHost = root.querySelector("[data-pack]");
  if (window.TemplatePack && packHost) {
    window.TemplatePack.ui(packHost, {
      tool: "hoshin-kanri", kind: "x-matrix",
      name: () => state.title || cfg.text.tool,
      data: () => (isEmpty(state) ? null : { ...state, example: false }),
      validate: (data) => { const plan = cleanPlan(data, defaultStart()); return isEmpty(plan) ? null : plan; },
      onOpen: (result) => {
        if (!isEmpty(state) && !state.example && !window.confirm(tx("Replace the matrix in this browser with the one in the file?"))) return false;
        state = { ...result.data, example: false };
        pickedMetric = "";
        save();
        renderAll();
        return tx("Opened: {name}", { name: result.name || state.title || cfg.text.tool });
      },
    });
  }
  // The portfolio may change in another tab; its projects are read again when this page comes back.
  window.addEventListener("storage", (event) => { if (event.key === cfg.portfolioKey) { renderProjects(); renderResults(); } });
  // For the tests: the summary as "Copy summary" gives it, and the rows of the CSV.
  window.HoshinKanriMath.summaryText = summaryText;
  window.HoshinKanriMath.sheetRows = sheetRows;
  window.HoshinKanriMath.state = () => state;

  renderAll();
})();
