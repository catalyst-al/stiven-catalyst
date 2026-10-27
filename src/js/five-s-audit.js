// The 5S Audit: a walk through one area with a score of 0 to 4 per question, in 5S, 6S (+ Safety) or 8S (+ Safety,
// Security, Satisfaction). Audits are kept per area and trended; findings become actions in the Action Tracker; the
// red tag register follows the Sort step. The arithmetic lives in window.FiveSMath, so tests can call it.
(() => {
  const SCORE_MAX = 4;
  // A 2 or lower is a finding: the standard is only partly there.
  const FINDING_AT = 2;
  // Verdict bands by overall share: below 50 % no standard yet, 50–74 gaps, 75–89 good, 90 and up world class.
  const BAND_LIMITS = [0.5, 0.75, 0.9];
  const OLD_TAG_DAYS = 30;
  const MAX_TREND_AREAS = 6;

  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return iso;
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const isScore = (value) => Number.isInteger(value) && value >= 0 && value <= SCORE_MAX;
  const pillarsFor = (scope, scopes) => (scopes && Array.isArray(scopes[scope]) ? scopes[scope] : (scopes && scopes["5S"]) || []);
  // Per S: the average of the answered questions (0–4) and its share of the full standard; overall: the mean of the
  // shares of the S that have an answer (each S weighs 1, however many questions it has).
  const score = (scores, keys) => {
    const perS = {};
    let answered = 0;
    let total = 0;
    keys.forEach((key) => {
      const list = Array.isArray(scores?.[key]) ? scores[key] : [];
      const values = list.filter(isScore);
      const avg = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
      perS[key] = { avg, pct: avg / SCORE_MAX, n: values.length, total: list.length, findings: values.filter((v) => v <= FINDING_AT).length };
      answered += values.length;
      total += list.length;
    });
    const rated = keys.filter((key) => perS[key].n > 0);
    const overall = rated.length ? rated.reduce((sum, key) => sum + perS[key].pct, 0) / rated.length : 0;
    return { perS, overall, answered, total, rated: rated.length };
  };
  const bandIndex = (pct) => BAND_LIMITS.filter((limit) => pct >= limit).length;
  const overallOf = (row, scopes) => score(row.scores, pillarsFor(row.scope, scopes)).overall;
  const byDate = (a, b) => String(a.date).localeCompare(String(b.date));
  // One series per area (the given area alone, or the most recently audited areas, up to six), oldest first.
  const trend = (rows, scopes, area = "") => {
    const groups = new Map();
    [...rows].sort(byDate).forEach((row) => {
      if (area && row.area !== area) return;
      if (!groups.has(row.area)) groups.set(row.area, []);
      groups.get(row.area).push({ date: row.date, pct: overallOf(row, scopes), id: row.id });
    });
    return [...groups].map(([name, points]) => ({ area: name, points }))
      .sort((a, b) => String(b.points.at(-1).date).localeCompare(String(a.points.at(-1).date)))
      .slice(0, MAX_TREND_AREAS);
  };
  // The latest audit of each area, best first: the league table.
  const latestByArea = (rows, scopes) => {
    const latest = new Map();
    [...rows].sort(byDate).forEach((row) => latest.set(row.area, row));
    return [...latest.values()].map((row) => ({ area: row.area, date: row.date, pct: overallOf(row, scopes), id: row.id })).sort((a, b) => b.pct - a.pct);
  };
  // The audit of the same area before this one (by date, then by position), for the dashed line of the radar.
  const previous = (rows, audit) => {
    const earlier = rows.filter((row) => row.area === audit.area && row.id !== audit.id && (row.date < audit.date || (row.date === audit.date && rows.indexOf(row) < rows.findIndex((r) => r.id === audit.id))));
    return earlier.sort(byDate).at(-1) || null;
  };
  // Questions at 2 or lower, worst first.
  const weakest = (scores, keys, limit = 8) => keys.flatMap((key) => (Array.isArray(scores?.[key]) ? scores[key] : [])
    .map((value, index) => ({ key, index, score: value })).filter((item) => isScore(item.score) && item.score <= FINDING_AT))
    .sort((a, b) => a.score - b.score || keys.indexOf(a.key) - keys.indexOf(b.key) || a.index - b.index).slice(0, limit);
  const redTagStats = (tags, today) => {
    const limit = addDays(today, -OLD_TAG_DAYS);
    const open = tags.filter((tag) => !tag.done);
    return { total: tags.length, open: open.length, old: open.filter((tag) => tag.date && tag.date <= limit).length, done: tags.length - open.length, overdue: open.filter((tag) => tag.due && tag.due < today).length };
  };

  // The audit plan: per area a cadence and the auditors who take turns. Names and areas compare without case and
  // outer spaces, because they are typed by hand in more than one place.
  const CADENCES = ["weekly", "biweekly", "monthly"];
  const norm = (value) => String(value ?? "").trim().toLowerCase();
  const daysBetween = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 864e5);
  // The same day a month later, or the last day of a shorter month (31 January, then 28 February).
  const addMonths = (iso, months) => {
    const [y, m, d] = String(iso).split("-").map(Number);
    if (!y || !m || !d) return iso;
    const target = new Date(Date.UTC(y, m - 1 + months, 1));
    const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(d, last));
    return target.toISOString().slice(0, 10);
  };
  const stepDate = (iso, cadence) => (cadence === "monthly" ? addMonths(iso, 1) : addDays(iso, cadence === "biweekly" ? 14 : 7));
  // Who audits next: the name after the last auditor in the rotation, so nobody audits the same area twice in a row
  // (a rotation of one name cannot help it). A last auditor who is not in the rotation starts it at its first name.
  const nextAuditor = (auditors, last) => {
    const list = (Array.isArray(auditors) ? auditors : []).filter((name) => norm(name));
    if (!list.length) return "";
    return list[(list.findIndex((name) => norm(name) === norm(last)) + 1) % list.length];
  };
  const rotation = (auditors, last, count = 1) => {
    const out = [];
    let previousName = last;
    for (let i = 0; i < count; i++) {
      previousName = nextAuditor(auditors, previousName);
      if (!previousName) break;
      out.push(previousName);
    }
    return out;
  };
  // The next audit of a planned area: one cadence after its last audit, or today when it has none yet.
  const nextAudit = (entry, rows, day) => {
    const last = [...rows].sort(byDate).filter((row) => norm(row.area) === norm(entry?.area)).at(-1) || null;
    const cadence = CADENCES.includes(entry?.cadence) ? entry.cadence : CADENCES[0];
    const due = last ? stepDate(last.date, cadence) : day;
    const late = due < day ? daysBetween(due, day) : 0;
    return { area: entry?.area || "", cadence, last: last ? last.date : "", lastAuditor: last ? last.auditor || "" : "", due, overdue: late > 0, late, auditor: nextAuditor(entry?.auditors, last ? last.auditor : "") };
  };
  // The planned audits from `from` for `days` days. An overdue audit is planned for `from` (it cannot be done
  // earlier) and says so; the ones after it follow on the cadence, each with the next name of the rotation.
  const schedule = (plan, rows, from, days = 56) => {
    const until = addDays(from, days - 1);
    const out = [];
    (Array.isArray(plan) ? plan : []).filter((entry) => norm(entry?.area)).forEach((entry) => {
      const next = nextAudit(entry, rows, from);
      let date = next.overdue ? from : next.due;
      let auditor = next.auditor;
      for (let i = 0; date <= until && i < 400; i++) {
        out.push({ date, area: entry.area, cadence: next.cadence, auditor, overdue: i === 0 && next.overdue, late: i === 0 ? next.late : 0, due: i === 0 ? next.due : date });
        date = stepDate(date, next.cadence);
        auditor = nextAuditor(entry.auditors, auditor);
      }
    });
    return out.sort((a, b) => a.date.localeCompare(b.date) || Number(b.overdue) - Number(a.overdue) || a.area.localeCompare(b.area));
  };
  // A calendar file (iCalendar): one all-day entry per planned audit. The UID stays the same for the same area and
  // day, so a second import updates the entries instead of doubling them. Long lines are folded at 75 bytes.
  // Escaping and folding (75 octets of UTF-8) are the shared ones of ActionsStore, which the tool page loads first;
  // looked up when a file is written, so a page that only reads this tool's numbers does not need it.
  const icsText = (value) => window.ActionsStore.icsText(value);
  const fold = (line) => window.ActionsStore.icsFold(line);
  const uidOf = (area, date) => {
    let hash = 5381;
    for (const char of norm(area)) hash = ((hash * 33) ^ char.codePointAt(0)) >>> 0;
    return `five-s-audit-${String(date).replace(/-/g, "")}-${hash.toString(36)}@stivencatalyst.com`;
  };
  const ics = (events, stamp = new Date()) => {
    const dt = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stiven Catalyst//5S Audit//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    events.forEach((event) => {
      lines.push("BEGIN:VEVENT", `UID:${event.uid || uidOf(event.area, event.date)}`, `DTSTAMP:${dt}`, `DTSTART;VALUE=DATE:${event.date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${addDays(event.date, 1).replace(/-/g, "")}`, `SUMMARY:${icsText(event.summary)}`);
      if (event.description) lines.push(`DESCRIPTION:${icsText(event.description)}`);
      if (event.location) lines.push(`LOCATION:${icsText(event.location)}`);
      lines.push("TRANSP:TRANSPARENT", "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return `${lines.map(fold).join("\r\n")}\r\n`;
  };

  // Before and after: photos of the same question (template and position) in two audits of the same area. Photo
  // records are { id, ref, created } with ref "auditId|pillar-question". For one audit, each question with photos is
  // paired with the latest earlier audit of the area that has photos of it (this audit is the after), else with the
  // first later one (this audit is the before). The before shows its first photo, the after its last.
  const photoPairs = (rows, records, auditId, onlyQid = "") => {
    const ordered = [...rows].sort(byDate);
    const at = ordered.findIndex((row) => row.id === auditId);
    if (at < 0) return [];
    const audit = ordered[at];
    const byRef = new Map();
    [...records].sort((a, b) => String(a.created).localeCompare(String(b.created))).forEach((record) => {
      if (!byRef.has(record.ref)) byRef.set(record.ref, []);
      byRef.get(record.ref).push(record);
    });
    const photos = (row, qidText) => byRef.get(`${row.id}|${qidText}`) || [];
    const qids = [...new Set(records.map((record) => String(record.ref)).filter((ref) => ref.startsWith(`${auditId}|`)).map((ref) => ref.slice(auditId.length + 1)))]
      .filter((qidText) => /^[a-z]+-\d+$/.test(qidText) && (!onlyQid || qidText === onlyQid)).sort();
    const sameArea = (row) => row.id !== audit.id && norm(row.area) === norm(audit.area) && String(row.template ?? "") === String(audit.template ?? "");
    return qids.map((qidText) => {
      const mine = photos(audit, qidText);
      const earlier = ordered.slice(0, at).filter((row) => sameArea(row) && photos(row, qidText).length).at(-1);
      if (earlier) return { qid: qidText, before: { audit: earlier, photo: photos(earlier, qidText)[0] }, after: { audit, photo: mine.at(-1) } };
      const later = ordered.slice(at + 1).find((row) => sameArea(row) && photos(row, qidText).length);
      if (later) return { qid: qidText, before: { audit, photo: mine[0] }, after: { audit: later, photo: photos(later, qidText).at(-1) } };
      return null;
    }).filter(Boolean);
  };
  // A red tag: its photo is kept under the tag's id, the one taken when it is done under "id|after".
  const TAG_AFTER = "|after";
  const tagPair = (records, tagId) => {
    const sorted = [...records].sort((a, b) => String(a.created).localeCompare(String(b.created)));
    const before = sorted.filter((record) => record.ref === tagId);
    const after = sorted.filter((record) => record.ref === `${tagId}${TAG_AFTER}`);
    return before.length && after.length ? { before: before[0], after: after.at(-1) } : null;
  };
  window.FiveSMath = { SCORE_MAX, FINDING_AT, BAND_LIMITS, OLD_TAG_DAYS, addDays, pillarsFor, score, bandIndex, trend, latestByArea, previous, weakest, redTagStats,
    CADENCES, addMonths, stepDate, nextAuditor, rotation, nextAudit, schedule, uidOf, ics, photoPairs, TAG_AFTER, tagPair };

  const dataEl = document.getElementById("five-s-audit-data");
  const root = document.querySelector("[data-five-s-audit]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, dayMonth, read, write, loadState, isObject, str, el, int, today, recentExample, parseDate, flash, undoNote, panel, stat, barList, focusCard, resultActions, resultLayout, exampleNote, exampleStamp, exampleMatches, firstVisit, downloadCsv, downloadXlsx, monthYear } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Workplace = window.Workplace;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const SCOPES = Object.keys(cfg.scopes);
  const TEMPLATES = Object.keys(cfg.templates);
  const pillarOf = Object.fromEntries(cfg.pillars.map((p) => [p.key, p]));
  const pillarName = (key) => pillarOf[key]?.name || key;
  const pillarTitle = (key) => (pillarOf[key]?.aka ? `${pillarName(key)} (${pillarOf[key].aka})` : pillarName(key));
  const id = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  // State: the scope and template, the audit in progress (draft), the saved audits (rows), the red tags and the team's
  // own question sets (custom, keyed "custom-…", the same shape as cfg.templates), and the audit plan (plan: one entry
  // per area, planExample while it is the example's plan).
  const blankDraft = (keep = {}) => ({ date: keep.date || today(), area: str(keep.area), auditor: str(keep.auditor), shift: str(keep.shift), scores: {}, notes: {}, acts: {} });
  const state = loadState(KEY, { scope: "", template: "", rows: [], tags: [], draft: {}, view: "", example: {}, custom: {}, plan: [], planExample: false });
  // An own template (saved here or opened from a template file): questions per S as text, nothing else.
  const cleanTemplate = (raw) => {
    if (!isObject(raw) || !isObject(raw.questions)) return null;
    const questions = Object.fromEntries(cfg.pillars.map((p) => [p.key, (Array.isArray(raw.questions[p.key]) ? raw.questions[p.key] : []).filter((v) => typeof v === "string").map((v) => v.slice(0, 300)).slice(0, 30)]));
    if (!Object.values(questions).some((list) => list.some((v) => v.trim()))) return null;
    return { name: str(raw.name).trim().slice(0, 80) || tx("Own template"), areas: (Array.isArray(raw.areas) ? raw.areas : []).map(str).filter(Boolean).slice(0, 40), questions };
  };
  state.custom = Object.fromEntries(Object.entries(state.custom).filter(([key]) => key.startsWith("custom-")).map(([key, tpl]) => [key, cleanTemplate(tpl)]).filter(([, tpl]) => tpl));
  const isTemplate = (name) => TEMPLATES.includes(name) || Object.prototype.hasOwnProperty.call(state.custom, name);
  if (!SCOPES.includes(state.scope)) state.scope = SCOPES[0];
  if (!isTemplate(state.template)) state.template = TEMPLATES[0];
  // Saved data can be damaged; keep only what has the expected shape.
  const cleanScores = (scores) => Object.fromEntries(Object.entries(isObject(scores) ? scores : {}).filter(([key]) => pillarOf[key]).map(([key, list]) => [key, (Array.isArray(list) ? list : []).map((v) => (isScore(v) ? v : null))]));
  const cleanText = (map) => Object.fromEntries(Object.entries(isObject(map) ? map : {}).filter(([, v]) => typeof v === "string" && v.trim()).map(([k, v]) => [k, v.trim()]));
  state.rows = state.rows.filter(isObject).map((row) => ({
    id: str(row.id) || id("a"), date: parseDate(row.date) || "", area: str(row.area), auditor: str(row.auditor), shift: str(row.shift),
    scope: SCOPES.includes(row.scope) ? row.scope : SCOPES[0], template: isTemplate(row.template) ? row.template : state.template,
    scores: cleanScores(row.scores), notes: cleanText(row.notes),
  })).filter((row) => row.date && row.area);
  state.tags = state.tags.filter(isObject).map((tag) => ({
    id: str(tag.id) || id("t"), date: parseDate(tag.date) || "", area: str(tag.area), item: str(tag.item), reason: str(tag.reason), decision: str(tag.decision),
    owner: str(tag.owner), due: parseDate(tag.due) || "", done: tag.done === true,
  })).filter((tag) => tag.date && tag.item);
  const names = (value) => [...new Set((Array.isArray(value) ? value : String(value ?? "").split(/[,;\n]/)).map((name) => (typeof name === "string" ? name.trim().slice(0, 60) : "")).filter(Boolean))].slice(0, 12);
  const cleanPlan = (list) => list.filter(isObject).map((entry) => ({ id: str(entry.id) || id("p"), area: str(entry.area).trim().slice(0, 80), cadence: CADENCES.includes(entry.cadence) ? entry.cadence : CADENCES[0], auditors: names(entry.auditors) })).slice(0, 60);
  state.plan = cleanPlan(state.plan);
  state.draft = { ...blankDraft(state.draft), scores: cleanScores(state.draft.scores), notes: cleanText(state.draft.notes), acts: isObject(state.draft.acts) ? state.draft.acts : {} };
  if (!parseDate(state.draft.date)) state.draft.date = today();
  const save = () => write(KEY, state);

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const scopeButtons = [...root.querySelectorAll("[data-scope-value]")];
  const templateSelect = q("#fs-template");
  const areaSelect = q("#fs-area-select");
  const areaInput = q("#fs-area");
  const areaList = q("#fs-area-list");
  const auditorInput = q("#fs-auditor");
  const dateInput = q("#fs-date");
  const shiftSelect = q("#fs-shift");
  const questionsBox = q("[data-questions]");
  const progressNote = q("[data-progress]");
  const saveButton = q("[data-save]");
  const actionsButton = q("[data-add-actions]");
  const trackerLink = q("[data-tracker-link]");
  const resetButton = q("[data-reset]");
  const auditStatus = q("[data-audit-status]");
  const logBody = q("[data-log]");
  const logWrap = q("[data-log-wrap]");
  const logEmpty = q("[data-log-empty]");
  const logCount = q("[data-log-count]");
  const logStatus = q("[data-log-status]");
  const tagForm = q("[data-tag-form]");
  const tagBody = q("[data-tags]");
  const tagWrap = q("[data-tag-wrap]");
  const tagEmpty = q("[data-tag-empty]");
  const tagStats = q("[data-tag-stats]");
  const tagStatus = q("[data-tag-status]");
  const results = document.querySelector("[data-results]");
  const planRows = q("[data-plan-rows]");
  const planEmpty = q("[data-plan-empty]");
  const planView = q("[data-plan-view]");
  const planDue = q("[data-plan-due]");
  const planCalendar = q("[data-plan-calendar]");
  const planCount = q("[data-plan-count]");
  const planStatus = q("[data-plan-status]");
  const monthButtons = [...root.querySelectorAll("[data-plan-month]")];

  const keys = () => pillarsFor(state.scope, cfg.scopes);
  const template = (name = state.template) => cfg.templates[name] || state.custom[name] || cfg.templates[TEMPLATES[0]];
  const questionsOf = (name, key) => template(name).questions?.[key] || [];
  const qid = (key, index) => `${key}-${index}`;
  // The draft keeps one slot per question of the chosen scope and template; a change of either keeps what was scored.
  const fitDraft = () => {
    const scores = {};
    keys().forEach((key) => { scores[key] = questionsOf(state.template, key).map((_, i) => (isScore(state.draft.scores[key]?.[i]) ? state.draft.scores[key][i] : null)); });
    state.draft.scores = scores;
  };
  fitDraft();
  const draftStarted = () => Object.values(state.draft.scores).some((list) => list.some(isScore));
  const findingsChecked = () => keys().flatMap((key) => state.draft.scores[key].map((value, i) => ({ key, i, value })).filter(({ key: k, i, value }) => isScore(value) && state.draft.acts[qid(k, i)] === true));

  // Areas and shifts: the workplace profile when it has them, else the template's areas and what was typed before.
  const wpAreas = () => (Workplace ? Workplace.areas() : []);
  const areaOwner = (name) => wpAreas().find((area) => area.name === name)?.owner || "";
  const knownAreas = () => [...new Set([...template().areas, ...state.rows.map((row) => row.area), ...state.tags.map((tag) => tag.area)])].filter(Boolean);
  const fillList = (list, values) => list.replaceChildren(...values.map((value) => el("option", null, value)));
  let packs = null;
  const renderSetup = () => {
    scopeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.scopeValue === state.scope)));
    if (packs) packs.syncOptions();
    templateSelect.value = state.template;
    const profileAreas = wpAreas().map((area) => area.name);
    const useSelect = profileAreas.length > 0;
    areaSelect.closest(".field").hidden = !useSelect;
    areaInput.closest(".field").hidden = useSelect;
    if (useSelect) {
      if (!state.draft.area) state.draft.area = profileAreas[0];
      Workplace.fillSelect(areaSelect, profileAreas, state.draft.area);
    } else {
      areaInput.value = state.draft.area;
    }
    // The list also serves the red tag form, so it holds the profile's areas too.
    fillList(areaList, [...new Set([...profileAreas, ...knownAreas()])]);
    auditorInput.value = state.draft.auditor;
    dateInput.value = state.draft.date;
    const shifts = (Workplace && Workplace.shifts().length ? Workplace.shifts() : cfg.shifts);
    if (!state.draft.shift) state.draft.shift = shifts[0];
    fillList(shiftSelect, [...new Set([...shifts, state.draft.shift])]);
    shiftSelect.value = state.draft.shift;
    const tagArea = tagForm.elements.tagArea;
    if (tagArea && !tagArea.value) tagArea.value = state.draft.area;
  };

  // The walk: one fieldset per S, one row per question with its five scores, a note and the action tick.
  const levelText = (value) => `${value} · ${cfg.levels[value] || ""}`;
  const pillarProgress = (key) => {
    const s = score(state.draft.scores, [key]).perS[key];
    return s.n ? `${num(s.avg, 1)} / ${SCORE_MAX} · ${pct(s.pct, 0)}` : tx("not scored yet");
  };
  const questionRow = (key, index, text) => {
    const row = el("div", "fs-q");
    const value = state.draft.scores[key][index];
    const name = qid(key, index);
    if (isScore(value) && value <= FINDING_AT) row.classList.add("is-finding");
    const head = el("p", "fs-q-text");
    head.append(el("span", "fs-q-n", String(index + 1)), text);
    const group = el("div", "fs-scores");
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", `${pillarName(key)} ${index + 1}: ${tx("Score")}`);
    for (let v = 0; v <= SCORE_MAX; v++) {
      const label = el("label", "fs-score");
      label.title = levelText(v);
      const input = el("input");
      input.type = "radio";
      input.name = `fs-${name}`;
      input.value = String(v);
      input.checked = value === v;
      input.dataset.key = key;
      input.dataset.index = index;
      label.append(input, el("span", null, String(v)));
      group.append(label);
    }
    const note = el("input", "fs-note");
    note.type = "text";
    note.placeholder = cfg.text.notePlaceholder;
    note.autocomplete = "off";
    note.value = state.draft.notes[name] || "";
    note.setAttribute("aria-label", `${pillarName(key)} ${index + 1}: ${tx("Finding")}`);
    note.dataset.note = name;
    const act = el("label", "fs-act");
    const box = el("input");
    box.type = "checkbox";
    box.checked = state.draft.acts[name] === true;
    box.dataset.act = name;
    act.append(box, el("span", null, tx("Make it an action")));
    const foot = el("div", "fs-q-foot");
    foot.append(note, act);
    row.append(head, group, foot);
    return row;
  };
  const renderQuestions = () => {
    questionsBox.replaceChildren();
    keys().forEach((key) => {
      const set = el("fieldset", "fs-pillar");
      set.dataset.pillar = key;
      const legend = el("legend", "fs-pillar-head");
      const title = el("span", "fs-pillar-name", pillarTitle(key));
      if (pillarOf[key]?.japanese) title.append(el("small", null, ` ${pillarOf[key].japanese}`));
      legend.append(title, el("span", "fs-pillar-progress", pillarProgress(key)));
      set.append(legend);
      questionsOf(state.template, key).forEach((text, index) => set.append(questionRow(key, index, text)));
      questionsBox.append(set);
    });
    renderProgress();
  };
  const renderProgress = () => {
    const total = score(state.draft.scores, keys());
    const n = findingsChecked().length;
    progressNote.textContent = total.answered ? `${tx("{a} of {b} questions scored", { a: int.format(total.answered), b: int.format(total.total) })} · ${tx("Overall")} ${pct(total.overall, 0)}` : tx("Score each question as you see it now: 0 is nothing in place, 4 is the full standard.");
    actionsButton.textContent = n ? tx("Add {n} findings to actions", { n: int.format(n) }) : tx("Add findings to actions");
    actionsButton.disabled = !n || !Actions;
    saveButton.disabled = !total.answered;
    if (trackerLink && Actions) trackerLink.href = Actions.trackerUrl().href;
  };
  const refreshPillar = (key) => {
    const head = questionsBox.querySelector(`[data-pillar="${key}"] .fs-pillar-progress`);
    if (head) head.textContent = pillarProgress(key);
  };

  // The audit shown in the results: the draft while it is being scored, else the audit chosen in the log, else the
  // newest one. The log's rows are the evidence for the trend and the league table.
  const current = () => {
    if (draftStarted()) return { ...state.draft, id: "", scope: state.scope, template: state.template, draft: true };
    const chosen = state.rows.find((row) => row.id === state.view);
    return chosen || [...state.rows].sort(byDate).at(-1) || null;
  };
  const verdict = (overall) => cfg.bands[Math.min(cfg.bands.length - 1, bandIndex(overall))] || cfg.bands.at(-1);
  const stateOf = (overall) => (overall >= BAND_LIMITS[1] ? "ok" : overall >= BAND_LIMITS[0] ? "warn" : "danger");
  const shortDate = dayMonth(false);
  const label = (iso) => shortDate(new Date(`${iso}T00:00:00Z`));
  const metaLine = (audit) => [audit.area, showDate(audit.date), audit.auditor, audit.shift, audit.scope].filter(Boolean).join(" · ");
  const findingsOf = (audit) => {
    const auditKeys = pillarsFor(audit.scope, cfg.scopes);
    return weakest(audit.scores, auditKeys, 12).map((item) => ({ ...item, question: questionsOf(audit.template, item.key)[item.index] || "", note: audit.notes?.[qid(item.key, item.index)] || "" }));
  };
  const summaryText = (audit, total) => {
    const auditKeys = pillarsFor(audit.scope, cfg.scopes);
    const lines = [`${cfg.text.tool} · ${metaLine(audit)}`, `${tx("Overall")} ${pct(total.overall, 0)} · ${verdict(total.overall).name}`, ""];
    auditKeys.forEach((key) => { const s = total.perS[key]; lines.push(`${pillarTitle(key)}: ${s.n ? `${num(s.avg, 1)} / ${SCORE_MAX} (${pct(s.pct, 0)})` : tx("not scored yet")}`); });
    const findings = findingsOf(audit);
    if (findings.length) {
      lines.push("", `${tx("Findings")} (≤ ${FINDING_AT}):`);
      findings.forEach((f) => lines.push(`- ${pillarName(f.key)} ${f.index + 1}: ${f.question}${f.note ? ` — ${f.note}` : ""} (${f.score} / ${SCORE_MAX})`));
    }
    const tags = redTagStats(state.tags, today());
    if (tags.total) lines.push("", tx("Red tags: {open} open, {old} older than {days} days", { open: tags.open, old: tags.old, days: OLD_TAG_DAYS }));
    return lines.join("\n");
  };

  let exampleUi = null;
  const renderResults = () => {
    const audit = current();
    results.replaceChildren();
    if (exampleUi) exampleUi.sync(state);
    if (!audit) { results.hidden = true; return; }
    results.hidden = false;
    const auditKeys = pillarsFor(audit.scope, cfg.scopes);
    const total = score(audit.scores, auditKeys);
    const band = verdict(total.overall);

    const head = el("div", "result-head fs-head");
    head.append(el("p", "kicker", audit.draft ? tx("Audit in progress") : tx("Latest audit")));
    const h2 = el("h2");
    h2.append(pct(total.overall, 0), el("span", null, ` · ${band.name}`));
    head.append(h2, el("p", "fs-meta", metaLine(audit)), el("p", "fs-band-note", band.note));

    const stats = el("div", "dl-stats fs-stats");
    stats.append(stat(tx("Overall"), pct(total.overall, 0), tx("{a} of {b} questions scored", { a: int.format(total.answered), b: int.format(total.total) })));
    auditKeys.forEach((key) => { const s = total.perS[key]; stats.append(stat(pillarName(key), s.n ? `${num(s.avg, 1)} / ${SCORE_MAX}` : "–", s.n ? pct(s.pct, 0) : tx("not scored yet"))); });
    const findings = findingsOf(audit);
    stats.append(stat(tx("Findings"), int.format(findings.length), tx("questions at {n} or below", { n: FINDING_AT })));
    const tagStat = redTagStats(state.tags, today());
    stats.append(stat(tx("Open red tags"), int.format(tagStat.open), tx("{n} older than {days} days", { n: int.format(tagStat.old), days: OLD_TAG_DAYS })));

    // Start here: the weakest S of this audit, with the first moves from the data file.
    const rated = auditKeys.filter((key) => total.perS[key].n > 0).sort((a, b) => total.perS[a].pct - total.perS[b].pct);
    const weakKey = rated[0];
    const focus = weakKey ? focusCard({
      title: pillarTitle(weakKey),
      detail: `${num(total.perS[weakKey].avg, 1)} / ${SCORE_MAX}`,
      lede: tx("The weakest S of this audit: {n} of {total} questions at {limit} or below.", { n: total.perS[weakKey].findings, total: total.perS[weakKey].n, limit: FINDING_AT }),
      advice: pillarOf[weakKey],
    }) : null;

    const problem = tx("5S audit {area}: {pillar} at {score} / 4", { area: audit.area, pillar: weakKey ? pillarName(weakKey) : "5S", score: weakKey ? num(total.perS[weakKey].avg, 1) : "0" });
    const actions = resultActions(() => summaryText(audit, total), problem);
    const printCard = el("button", "button-secondary", tx("Print scorecard"));
    printCard.type = "button";
    printCard.addEventListener("click", () => {
      document.documentElement.classList.add("fs-scorecard");
      const done = () => { document.documentElement.classList.remove("fs-scorecard"); window.removeEventListener("afterprint", done); };
      window.addEventListener("afterprint", done);
      window.print();
      // Browsers without afterprint (some phones) get the class removed a moment later.
      setTimeout(done, 2000);
    });
    actions.append(printCard);
    if (Actions) {
      const tracker = el("a", "button-secondary", tx("Open the Action Tracker"));
      tracker.href = Actions.trackerUrl().href;
      actions.append(tracker);
    }

    const panels = [];
    if (ChartKit) {
      // Radar: this audit against the previous one of the same area (dashed).
      const prev = previous(state.rows, audit.draft ? { ...audit, id: "", date: audit.date || today() } : audit) || (audit.draft ? [...state.rows.filter((row) => row.area === audit.area)].sort(byDate).at(-1) : null);
      const radarPanel = panel(tx("Radar of the S"), prev ? tx("Dashed: the previous audit of this area, {date}.", { date: showDate(prev.date) }) : tx("The next audit of this area draws its predecessor as a dashed line."));
      radarPanel.classList.add("fs-panel-radar");
      const axes = auditKeys.map((key) => ({ label: pillarName(key), value: total.perS[key].avg, max: SCORE_MAX }));
      const compare = prev ? [{ label: `${prev.area} · ${showDate(prev.date)} · ${pct(overallOf(prev, cfg.scopes), 0)}`, values: auditKeys.map((key) => score(prev.scores, [key]).perS[key].avg) }] : [];
      radarPanel.append(ChartKit.figure(ChartKit.radar(axes, { title: tx("Radar of the S"), levels: SCORE_MAX, compare, format: (v) => num(v, 1) }), { fileName: "5s-radar" }));
      panels.push(radarPanel);

      // Trend of the overall share per audit, one line per area.
      const series = trend(state.rows, cfg.scopes).sort((a, b) => (a.area === audit.area ? -1 : b.area === audit.area ? 1 : 0));
      if (series.length && series.some((s) => s.points.length > 1)) {
        const trendPanel = panel(tx("Trend by area"), tx("Overall share of the full standard, audit by audit. {n} areas at most.", { n: MAX_TREND_AREAS }));
        trendPanel.classList.add("fs-panel-trend");
        const lines = series.map((s) => ({ label: s.area, points: s.points.map((p) => ({ x: label(p.date), y: p.pct, tip: `${s.area} · ${showDate(p.date)}: ${pct(p.pct, 0)}`, state: stateOf(p.pct) })) }));
        trendPanel.append(ChartKit.figure(ChartKit.line(lines, { title: tx("Trend by area"), yMin: 0, yMax: 1, target: BAND_LIMITS[2], format: (v) => pct(v, 0) }), { fileName: "5s-trend" }));
        panels.push(trendPanel);
      }

      // League table: the latest share of every area.
      const league = latestByArea(state.rows, cfg.scopes);
      if (league.length > 1) {
        const leaguePanel = panel(tx("League table"), tx("The latest audit of each area. Green from 75 %, amber from 50 %, red below."));
        leaguePanel.classList.add("fs-panel-league");
        leaguePanel.append(ChartKit.figure(ChartKit.bars(league.map((item) => ({ label: item.area, value: item.pct, state: stateOf(item.pct), tip: `${item.area} · ${showDate(item.date)}: ${pct(item.pct, 0)}` })), { title: tx("League table"), yMax: 1, format: (v) => pct(v, 0) }), { fileName: "5s-league" }));
        panels.push(leaguePanel);
      }
    }

    // The weakest questions, with their notes: the findings of this audit.
    const weakPanel = panel(tx("Weakest questions"), findings.length ? tx("The gap to the full standard. A {n} or lower is a finding and wants an owner.", { n: FINDING_AT }) : tx("No question at {n} or below in this audit.", { n: FINDING_AT }));
    weakPanel.classList.add("fs-panel-weak");
    // The audit and the question of each bar, for the before and after photos (five-s-audit-photos.js).
    weakPanel.dataset.audit = audit.draft ? "" : audit.id;
    if (findings.length) {
      const bars = barList(findings.map((f) => ({ key: `${pillarName(f.key)} ${f.index + 1} · ${f.question}`, value: SCORE_MAX - f.score, note: f.note, score: f.score })), {
        label: (item) => [`${item.score} / ${SCORE_MAX}`, item.note ? ` · ${item.note}` : ""],
        highlight: (item) => item.score === 0,
        tag: tx("nothing in place"),
      });
      [...bars.children].forEach((bar, i) => { if (findings[i]) bar.dataset.qid = qid(findings[i].key, findings[i].index); });
      weakPanel.append(bars);
    }
    panels.push(weakPanel);

    // Open red tags, oldest first.
    const openTags = state.tags.filter((tag) => !tag.done).sort(byDate);
    if (openTags.length) {
      const tagPanel = panel(tx("Open red tags"), tx("Oldest first. A tag older than {days} days is a decision nobody took.", { days: OLD_TAG_DAYS }));
      tagPanel.classList.add("fs-panel-tags");
      const list = el("ul", "fs-tag-list");
      openTags.slice(0, 8).forEach((tag) => {
        const item = el("li");
        const age = Math.round((Date.parse(`${today()}T00:00:00Z`) - Date.parse(`${tag.date}T00:00:00Z`)) / 864e5);
        item.append(el("strong", null, tag.item), ` · ${tag.area} · ${tag.decision} · ${tx("{n} days", { n: int.format(Math.max(0, age)) })}${age >= OLD_TAG_DAYS ? ` · ${tx("older than {days} days", { days: OLD_TAG_DAYS })}` : ""}`);
        list.append(item);
      });
      tagPanel.append(list);
      panels.push(tagPanel);
    }

    resultLayout(results, { head, stats, focus, actions, panels });
  };

  // The log of saved audits, newest first.
  const LOG_ROWS = 25;
  const renderLog = () => {
    const rows = [...state.rows].sort((a, b) => byDate(b, a)).slice(0, LOG_ROWS);
    logBody.replaceChildren();
    rows.forEach((row) => {
      const total = score(row.scores, pillarsFor(row.scope, cfg.scopes));
      const tr = el("tr");
      if (row.id === state.view && !draftStarted()) tr.classList.add("is-current");
      const show = el("button", "fs-show", showDate(row.date));
      show.type = "button";
      show.dataset.show = row.id;
      show.title = tx("Show this audit");
      const dateCell = el("td");
      dateCell.append(show);
      const pctCell = el("td", "num");
      pctCell.append(el("strong", null, pct(total.overall, 0)), ` · ${verdict(total.overall).name}`);
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = row.id;
      remove.setAttribute("aria-label", tx("Remove the audit of {area} on {date}", { area: row.area, date: showDate(row.date) }));
      const removeCell = el("td");
      removeCell.append(remove);
      tr.append(dateCell, el("td", null, row.area), el("td", null, row.auditor), el("td", null, row.shift), el("td", null, row.scope), pctCell, removeCell);
      logBody.append(tr);
    });
    logWrap.hidden = !state.rows.length;
    logEmpty.hidden = state.rows.length > 0;
    logCount.textContent = state.rows.length ? `${tx("{n} audits", { n: int.format(state.rows.length) })}${state.rows.length > LOG_ROWS ? tx(" · newest {n} shown, CSV has all", { n: LOG_ROWS }) : ""}` : "";
  };

  // The red tag register.
  const renderTags = () => {
    const tags = [...state.tags].sort((a, b) => Number(a.done) - Number(b.done) || byDate(a, b));
    tagBody.replaceChildren();
    tags.forEach((tag) => {
      const tr = el("tr");
      if (tag.done) tr.classList.add("is-done");
      const doneCell = el("td");
      const box = el("input");
      box.type = "checkbox";
      box.checked = tag.done;
      box.dataset.done = tag.id;
      box.setAttribute("aria-label", `${tx("Done")}: ${tag.item}`);
      doneCell.append(box);
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.removeTag = tag.id;
      remove.setAttribute("aria-label", tx("Remove red tag {item}", { item: tag.item }));
      const removeCell = el("td");
      removeCell.append(remove);
      tr.append(doneCell, el("td", null, showDate(tag.date)), el("td", null, tag.area), el("td", null, tag.item), el("td", null, tag.reason), el("td", null, tag.decision), el("td", null, tag.owner), el("td", null, tag.due ? showDate(tag.due) : ""), removeCell);
      tagBody.append(tr);
    });
    tagWrap.hidden = !state.tags.length;
    tagEmpty.hidden = state.tags.length > 0;
    const stats = redTagStats(state.tags, today());
    tagStats.textContent = state.tags.length ? tx("{open} open · {old} older than {days} days · {done} done", { open: int.format(stats.open), old: int.format(stats.old), days: OLD_TAG_DAYS, done: int.format(stats.done) }) : "";
  };

  // The audit plan: one row per area (area, cadence, the auditors in turn), then what follows from it: the next date
  // and auditor of each area, the audits due this week, the month on a calendar and a calendar file.
  const PLAN_DAYS = 56;
  let planMonth = 0;
  let dueItems = [];
  const cadenceName = (key) => cfg.cadences?.[key] || key;
  // People to choose from: the owners and teams of the workplace profile, and every name typed here before.
  const people = () => [...new Set([
    ...wpAreas().map((area) => area.owner), ...(Workplace ? Workplace.teams() : []),
    ...state.rows.map((row) => row.auditor), ...state.plan.flatMap((entry) => entry.auditors), ...state.tags.map((tag) => tag.owner),
  ].map((name) => str(name).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const weekday = dayMonth(true);
  const dayLabel = (iso) => `${weekday(new Date(`${iso}T00:00:00Z`))} · ${showDate(iso)}`;
  const nextText = (entry) => {
    if (!entry.area) return tx("Name the area to plan it.");
    const next = nextAudit(entry, state.rows, today());
    const parts = [next.last ? tx("Last audit {date}", { date: showDate(next.last) }) + (next.lastAuditor ? ` (${next.lastAuditor})` : "") : tx("Not audited yet")];
    parts.push(next.overdue ? `⚠ ${tx("Overdue by {n} days, due {date}", { n: int.format(next.late), date: showDate(next.due) })}` : next.due === today() ? tx("Due today") : tx("Next due {date}", { date: showDate(next.due) }));
    parts.push(next.auditor ? tx("Next auditor: {name}", { name: next.auditor }) : tx("No auditor named yet"));
    if (entry.auditors.length === 1) parts.push(tx("With one name the same person audits every time."));
    return parts.join(" · ");
  };
  const planField = (entry, name, labelText, input) => {
    const box = el("div", "field");
    const lab = el("label", null, labelText);
    input.id = `fs-plan-${name}-${entry.id}`;
    lab.htmlFor = input.id;
    input.dataset.planField = name;
    box.append(lab, input);
    return box;
  };
  const planRow = (entry) => {
    const row = el("div", "fs-plan-row");
    row.dataset.planId = entry.id;
    const grid = el("div", "fs-plan-grid");
    const area = el("input");
    area.setAttribute("list", "fs-area-list");
    area.autocomplete = "off";
    area.placeholder = cfg.text.areaPlaceholder;
    area.value = entry.area;
    const cadence = el("select");
    CADENCES.forEach((key) => { const option = el("option", null, cadenceName(key)); option.value = key; option.selected = key === entry.cadence; cadence.append(option); });
    const auditors = el("input");
    auditors.autocomplete = "off";
    auditors.placeholder = cfg.text.auditorsPlaceholder;
    auditors.value = entry.auditors.join(", ");
    const auditorsField = planField(entry, "auditors", tx("Auditors, in turn"), auditors);
    grid.append(planField(entry, "area", tx("Area"), area), planField(entry, "cadence", tx("How often"), cadence), auditorsField);
    const pick = el("select", "fs-plan-pick");
    pick.dataset.planPick = entry.id;
    auditorsField.append(pick);
    const remove = el("button", "dl-remove", "×");
    remove.type = "button";
    remove.dataset.planRemove = entry.id;
    grid.append(remove);
    const next = el("p", "form-note fs-plan-next");
    next.dataset.planNext = entry.id;
    row.append(grid, next);
    syncRow(entry, row);
    return row;
  };
  // The parts of a row that follow its fields: the next audit, the people to add, the names in the labels.
  const syncRow = (entry, row) => {
    const name = entry.area || tx("this area");
    const next = row.querySelector("[data-plan-next]");
    next.textContent = nextText(entry);
    next.classList.toggle("is-overdue", Boolean(entry.area) && nextAudit(entry, state.rows, today()).overdue);
    row.querySelector("[data-plan-remove]").setAttribute("aria-label", tx("Remove {area} from the plan", { area: name }));
    const pick = row.querySelector("[data-plan-pick]");
    pick.setAttribute("aria-label", tx("Add a person to the rotation of {area}", { area: name }));
    if (pick === document.activeElement) return;
    const options = people().filter((person) => !entry.auditors.some((n) => n.toLowerCase() === person.toLowerCase()));
    const first = el("option", null, tx("Add a person…"));
    first.value = "";
    pick.replaceChildren(first, ...options.map((person) => el("option", null, person)));
    pick.hidden = !options.length;
  };
  const renderPlanRows = () => {
    planRows.replaceChildren(...state.plan.map(planRow));
    planEmpty.hidden = state.plan.length > 0;
  };
  // What follows from the plan; drawn again while it is typed, without touching the fields.
  const renderPlanView = () => {
    const day = today();
    state.plan.forEach((entry) => {
      const row = planRows.querySelector(`[data-plan-id="${entry.id}"]`);
      if (row) syncRow(entry, row);
    });
    const planned = state.plan.filter((entry) => entry.area);
    planView.hidden = !planned.length;
    const overdue = planned.filter((entry) => nextAudit(entry, state.rows, day).overdue).length;
    planCount.textContent = planned.length ? `${tx("{n} areas planned", { n: int.format(planned.length) })}${overdue ? ` · ${tx("{n} overdue", { n: int.format(overdue) })}` : ""}` : "";
    if (!planned.length) { dueItems = []; planDue.replaceChildren(); planCalendar.replaceChildren(); return; }

    // Due this week: what is overdue and what falls in the next seven days.
    dueItems = schedule(state.plan, state.rows, day, 7);
    planDue.replaceChildren(...(dueItems.length ? dueItems.map((item, index) => {
      const li = el("li", item.overdue ? "is-overdue" : "");
      const text = el("span", "fs-due-text");
      const when = item.overdue ? `⚠ ${tx("Overdue by {n} days, due {date}", { n: int.format(item.late), date: showDate(item.due) })}` : item.date === day ? tx("Due today") : dayLabel(item.date);
      text.append(el("strong", null, item.area), ` · ${item.auditor || tx("No auditor named yet")} · ${when}`);
      const start = el("button", "button-secondary", tx("Start this audit"));
      start.type = "button";
      start.dataset.planStart = String(index);
      start.setAttribute("aria-label", `${tx("Start this audit")}: ${item.area}${item.auditor ? `, ${item.auditor}` : ""}`);
      li.append(text, start);
      return li;
    }) : [el("li", "fs-due-none", tx("Nothing due in the next seven days."))]));

    // The month: audits done (green), overdue ones on today (red) and the planned ones, who and where in the tip.
    monthButtons.forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.planMonth) === planMonth)));
    planCalendar.replaceChildren();
    if (!ChartKit) return;
    const start = addMonths(`${day.slice(0, 7)}-01`, planMonth);
    const [year, month] = start.split("-").map(Number);
    const monthEnd = addDays(addMonths(start, 1), -1);
    const byDay = new Map();
    const put = (iso, item) => { if (!byDay.has(iso)) byDay.set(iso, []); byDay.get(iso).push(item); };
    state.rows.filter((row) => row.date.slice(0, 7) === start.slice(0, 7)).forEach((row) => put(row.date, { done: true, row }));
    if (monthEnd >= day) schedule(state.plan, state.rows, day, daysBetween(day, monthEnd) + 1).filter((item) => item.date >= start).forEach((item) => put(item.date, { plan: item }));
    const svg = ChartKit.calendar(year, month, (iso) => {
      const items = byDay.get(iso);
      if (!items) return null;
      const late = items.some((item) => item.plan?.overdue);
      const open = items.some((item) => item.plan);
      const tip = items.map((item) => (item.done
        ? `✓ ${tx("Audited")}: ${item.row.area}${item.row.auditor ? ` · ${item.row.auditor}` : ""} · ${pct(overallOf(item.row, cfg.scopes), 0)}`
        : `${item.plan.overdue ? `⚠ ${tx("Overdue")}` : `○ ${tx("Planned")}`}: ${item.plan.area} · ${item.plan.auditor || tx("No auditor named yet")}${item.plan.overdue ? ` (${tx("due {date}", { date: showDate(item.plan.due) })})` : ""}`)).join("\n");
      return { state: late ? "danger" : open ? undefined : "ok", text: String(items.length), tip: `${showDate(iso)}\n${tip}` };
    }, { title: `${tx("Audit plan")} · ${monthYear(new Date(`${start}T00:00:00Z`))}` });
    planCalendar.append(ChartKit.figure(svg, { fileName: "5s-audit-plan" }));
  };
  const renderPlan = () => {
    renderPlanRows();
    renderPlanView();
  };

  const render = () => {
    renderSetup();
    if (packs) packs.render();
    renderLog();
    renderTags();
    renderPlan();
    renderResults();
  };
  const changed = () => {
    save();
    render();
  };

  // The example: six weekly walks of three warehouse areas in 6S and five red tags, moved to recent weeks.
  const loadExample = () => {
    const ex = cfg.example;
    const last = ex.audits.map((a) => a.date).sort().at(-1);
    const [moved] = recentExample([last]);
    const shift = Math.round((Date.parse(`${moved}T00:00:00Z`) - Date.parse(`${last}T00:00:00Z`)) / 864e5);
    state.scope = ex.scope;
    state.template = ex.template;
    state.rows = [...ex.audits].sort(byDate).map((a, i) => ({ id: `ex-a${i}`, date: addDays(a.date, shift), area: a.area, auditor: a.auditor, shift: a.shift, scope: ex.scope, template: ex.template, scores: cleanScores(a.scores), notes: cleanText(a.notes) }));
    state.tags = ex.tags.map((t, i) => ({ id: `ex-t${i}`, date: addDays(t.date, shift), area: t.area, item: t.item, reason: t.reason, decision: t.decision, owner: t.owner, due: addDays(t.due, shift), done: t.done === true }));
    state.view = state.rows.at(-1).id;
    state.draft = blankDraft({ area: state.rows.at(-1).area, shift: state.rows.at(-1).shift });
    fitDraft();
    state.example = exampleStamp(state.rows);
    // The example's plan: its three areas and one not audited yet, each with auditors who take turns.
    state.plan = cleanPlan((Array.isArray(ex.plan) ? ex.plan : []).map((entry, i) => ({ ...entry, id: `ex-p${i}` })));
    state.planExample = state.plan.length > 0;
  };
  // The example leaves as a whole: its audits and its red tags, so nothing of it is scored against the visitor's work.
  const dropExample = () => {
    state.rows = [];
    state.tags = [];
    state.view = "";
    state.example = {};
    // A plan the visitor has changed is theirs and stays.
    if (state.planExample) { state.plan = []; state.planExample = false; }
  };
  const ownWork = () => { if (exampleMatches(state)) dropExample(); };
  exampleUi = exampleNote(results, () => { dropExample(); changed(); });

  // Setup events.
  scopeButtons.forEach((button) => button.addEventListener("click", () => {
    state.scope = button.dataset.scopeValue;
    fitDraft();
    renderQuestions();
    changed();
  }));
  const chooseTemplate = (name) => {
    state.template = name;
    fitDraft();
    renderQuestions();
    changed();
  };
  templateSelect.addEventListener("change", () => chooseTemplate(templateSelect.value));
  // The team's own question set: a copy of a built-in one to edit, saved and opened as a template file
  // (js/template-pack.js). Old audits keep their scores by position, so they read the edited questions.
  const packHost = q("[data-template-pack]");
  if (window.TemplatePack && packHost) {
    packs = window.TemplatePack.checklist(packHost, {
      tool: "five-s-audit", kind: "five-s-questions", validate: cleanTemplate,
      select: templateSelect, builtIn: cfg.templates, custom: state.custom,
      current: () => state.template, choose: chooseTemplate,
      groups: () => keys().map((key) => ({ key, title: pillarTitle(key) })),
      fields: [{ key: "text", label: tx("Question") }],
      toEdit: (text) => ({ text: str(text) }), fromEdit: (values) => values.text,
      changed: () => { fitDraft(); renderQuestions(); save(); renderSetup(); renderResults(); },
      inUse: (name) => state.rows.some((row) => row.template === name),
    });
  }
  const setDraft = (name, value) => { state.draft[name] = value; save(); renderResults(); };
  areaSelect.addEventListener("change", () => setDraft("area", areaSelect.value));
  areaInput.addEventListener("input", () => setDraft("area", areaInput.value.trim()));
  auditorInput.addEventListener("input", () => setDraft("auditor", auditorInput.value.trim()));
  dateInput.addEventListener("change", () => setDraft("date", parseDate(dateInput.value) || today()));
  shiftSelect.addEventListener("change", () => setDraft("shift", shiftSelect.value));
  window.addEventListener("workplace:changed", () => { renderSetup(); renderResults(); });

  // Scoring: a radio sets the score and suggests the action tick when it is a finding; the note and the tick are kept
  // as typed. The rows stay in place so the focus does not jump while the auditor walks.
  questionsBox.addEventListener("change", (event) => {
    const input = event.target;
    if (input.type === "radio" && input.dataset.key) {
      const key = input.dataset.key;
      const index = Number(input.dataset.index);
      const value = Number(input.value);
      state.draft.scores[key][index] = value;
      const name = qid(key, index);
      state.draft.acts[name] = value <= FINDING_AT;
      const row = input.closest(".fs-q");
      row.classList.toggle("is-finding", value <= FINDING_AT);
      row.querySelector("[data-act]").checked = value <= FINDING_AT;
      refreshPillar(key);
      renderProgress();
      save();
      renderResults();
    } else if (input.dataset.act !== undefined) {
      state.draft.acts[input.dataset.act] = input.checked;
      renderProgress();
      save();
    }
  });
  questionsBox.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.note === undefined) return;
    const value = input.value.trim();
    if (value) state.draft.notes[input.dataset.note] = value; else delete state.draft.notes[input.dataset.note];
    save();
  });

  saveButton.addEventListener("click", () => {
    if (!draftStarted()) return;
    if (!state.draft.area) {
      flash(auditStatus, tx("Name the area first."));
      (areaSelect.closest(".field").hidden ? areaInput : areaSelect).focus();
      return;
    }
    ownWork();
    const row = { id: id("a"), date: state.draft.date || today(), area: state.draft.area, auditor: state.draft.auditor, shift: state.draft.shift, scope: state.scope, template: state.template, scores: {}, notes: {} };
    keys().forEach((key) => { row.scores[key] = state.draft.scores[key].map((v) => (isScore(v) ? v : null)); });
    Object.entries(state.draft.notes).forEach(([name, note]) => { const [key] = name.split("-"); if (keys().includes(key)) row.notes[name] = note; });
    state.rows.push(row);
    state.view = row.id;
    const open = findingsChecked().length;
    state.draft = blankDraft(state.draft);
    fitDraft();
    renderQuestions();
    changed();
    flash(auditStatus, open ? tx("Audit saved. {n} findings were ticked but not yet added to actions.", { n: open }) : tx("Audit saved."));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  resetButton.addEventListener("click", () => {
    if (draftStarted() && !window.confirm(tx("Start a new audit? The scores of this one are discarded."))) return;
    state.draft = blankDraft(state.draft);
    fitDraft();
    renderQuestions();
    changed();
  });
  // Findings become actions: one per ticked question, owned by the area's owner, due in a week.
  actionsButton.addEventListener("click", () => {
    if (!Actions) return;
    const found = findingsChecked();
    if (!found.length) return;
    const due = addDays(today(), 7);
    const sent = { added: 0, duplicate: 0, unsaved: 0 };
    found.forEach(({ key, i, value }) => {
      const name = qid(key, i);
      const note = state.draft.notes[name] || "";
      const action = Actions.add({
        title: questionsOf(state.template, key)[i],
        detail: [note, tx("Score {a} / {b}", { a: value, b: SCORE_MAX }), `${cfg.text.tool} · ${pillarName(key)} · ${state.draft.area} · ${showDate(state.draft.date)}`].filter(Boolean).join(" · "),
        owner: areaOwner(state.draft.area), due, source: "five-s-audit", check: cfg.text.checkText, area: state.draft.area, priority: value === 0 ? "High" : "Medium",
      });
      // A finding stays ticked when its action could not be saved, so it can be sent again.
      if (!action && Actions.lastAdd === "unsaved") { sent.unsaved++; return; }
      if (action) sent.added++; else sent.duplicate++;
      state.draft.acts[name] = false;
      const box = questionsBox.querySelector(`[data-act="${name}"]`);
      if (box) box.checked = false;
    });
    save();
    renderProgress();
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    auditStatus.replaceChildren(`${window.ToolKit.actionsNote(sent)} `, link);
    clearTimeout(auditStatus.timer);
    auditStatus.timer = setTimeout(() => { auditStatus.textContent = ""; }, 8000);
  });

  // The log: show one audit, remove one (with undo), the example, the exports and clearing.
  logBody.addEventListener("click", (event) => {
    const show = event.target.closest("[data-show]");
    if (show) { state.view = show.dataset.show; changed(); results.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = state.rows.findIndex((row) => row.id === button.dataset.remove);
    if (index < 0) return;
    const [removed] = state.rows.splice(index, 1);
    if (state.view === removed.id) state.view = "";
    changed();
    undoNote(logStatus, tx("Removed the audit of {area} on {date}.", { area: removed.area, date: showDate(removed.date) }), () => {
      state.rows.splice(Math.min(index, state.rows.length), 0, removed);
      changed();
    });
  });
  q("[data-example]").addEventListener("click", () => {
    loadExample();
    renderQuestions();
    changed();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  });
  q("[data-clear]").addEventListener("click", () => {
    if (!state.rows.length || !window.confirm(tx("Clear every saved audit? The red tags stay."))) return;
    if (exampleMatches(state)) dropExample();
    state.rows = [];
    state.view = "";
    changed();
  });
  const auditRows = () => {
    const rows = [[tx("Date"), tx("Area"), tx("Auditor"), tx("Shift"), tx("Scope"), "S", tx("No."), tx("Question"), tx("Score"), tx("Note")]];
    [...state.rows].sort(byDate).forEach((row) => pillarsFor(row.scope, cfg.scopes).forEach((key) => (row.scores[key] || []).forEach((value, i) => {
      rows.push([row.date, row.area, row.auditor, row.shift, row.scope, pillarName(key), i + 1, questionsOf(row.template, key)[i] || "", isScore(value) ? value : "", row.notes[qid(key, i)] || ""]);
    })));
    return rows;
  };
  q("[data-csv]").addEventListener("click", () => { if (state.rows.length) downloadCsv(cfg.text.csvAudits, auditRows()); });
  q("[data-xlsx]").addEventListener("click", () => { if (state.rows.length) downloadXlsx(cfg.text.csvAudits, auditRows()); });

  // Red tags.
  tagForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const f = tagForm.elements;
    const item = f.tagItem.value.trim();
    if (!item) { flash(tagStatus, tx("Name the item first.")); f.tagItem.focus(); return; }
    ownWork();
    state.tags.push({ id: id("t"), date: parseDate(f.tagDate.value) || today(), area: f.tagArea.value.trim() || state.draft.area, item, reason: f.tagReason.value, decision: f.tagDecision.value, owner: f.tagOwner.value.trim(), due: parseDate(f.tagDue.value) || "", done: false });
    f.tagItem.value = "";
    f.tagOwner.value = "";
    f.tagDue.value = "";
    changed();
    flash(tagStatus, tx("Red tag added."));
    f.tagItem.focus();
  });
  tagBody.addEventListener("change", (event) => {
    const box = event.target.closest("[data-done]");
    if (!box) return;
    const tag = state.tags.find((t) => t.id === box.dataset.done);
    if (tag) { tag.done = box.checked; changed(); }
  });
  tagBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-tag]");
    if (!button) return;
    const index = state.tags.findIndex((t) => t.id === button.dataset.removeTag);
    if (index < 0) return;
    const [removed] = state.tags.splice(index, 1);
    changed();
    undoNote(tagStatus, tx("Removed red tag {item}.", { item: removed.item }), () => {
      state.tags.splice(Math.min(index, state.tags.length), 0, removed);
      changed();
    });
  });
  const tagRows = () => [[tx("Date"), tx("Area"), tx("Item"), tx("Reason"), tx("Decision"), tx("Owner"), tx("Due date"), tx("Done")], ...[...state.tags].sort(byDate).map((t) => [t.date, t.area, t.item, t.reason, t.decision, t.owner, t.due, t.done ? tx("yes") : tx("no")])];
  q("[data-tag-csv]").addEventListener("click", () => { if (state.tags.length) downloadCsv(cfg.text.csvTags, tagRows()); });
  q("[data-tag-xlsx]").addEventListener("click", () => { if (state.tags.length) downloadXlsx(cfg.text.csvTags, tagRows()); });
  q("[data-tag-clear]")?.addEventListener("click", () => {
    if (!state.tags.length || !window.confirm(tx("Clear every red tag?"))) return;
    if (exampleMatches(state)) dropExample();
    state.tags = [];
    changed();
  });

  // The plan: typing changes the entry and what follows from it; adding and removing draw the rows again.
  const planEntry = (node) => state.plan.find((entry) => entry.id === node.closest("[data-plan-id]")?.dataset.planId);
  const planChanged = () => { state.planExample = false; save(); renderPlanView(); };
  planRows.addEventListener("input", (event) => {
    const input = event.target;
    const entry = planEntry(input);
    if (!entry || !input.dataset.planField) return;
    if (input.dataset.planField === "area") entry.area = input.value.trim().slice(0, 80);
    else if (input.dataset.planField === "auditors") entry.auditors = names(input.value);
    else return;
    planChanged();
  });
  planRows.addEventListener("change", (event) => {
    const input = event.target;
    const entry = planEntry(input);
    if (!entry) return;
    if (input.dataset.planField === "cadence") {
      entry.cadence = CADENCES.includes(input.value) ? input.value : CADENCES[0];
      planChanged();
    } else if (input.dataset.planPick !== undefined && input.value) {
      entry.auditors = names([...entry.auditors, input.value]);
      state.planExample = false;
      save();
      renderPlan();
      planRows.querySelector(`#fs-plan-auditors-${entry.id}`)?.focus();
    }
  });
  planRows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-plan-remove]");
    if (!button) return;
    const index = state.plan.findIndex((entry) => entry.id === button.dataset.planRemove);
    if (index < 0) return;
    const [removed] = state.plan.splice(index, 1);
    state.planExample = false;
    save();
    renderPlan();
    undoNote(planStatus, tx("Removed from the plan: {area}.", { area: removed.area || tx("an area without a name") }), () => {
      state.plan.splice(Math.min(index, state.plan.length), 0, removed);
      save();
      renderPlan();
    });
  });
  q("[data-plan-add]").addEventListener("click", () => {
    const entry = { id: id("p"), area: "", cadence: CADENCES[0], auditors: [] };
    state.plan.push(entry);
    state.planExample = false;
    save();
    renderPlan();
    planRows.querySelector(`#fs-plan-area-${entry.id}`)?.focus();
  });
  // Every area the page knows (the workplace profile's, else those of the checklist and the log) that is not planned
  // yet: weekly, with the area's owner and the people who audited it before as the rotation.
  q("[data-plan-known]").addEventListener("click", () => {
    const profile = wpAreas();
    const areas = profile.length ? profile.map((area) => area.name) : knownAreas();
    const fresh = areas.filter((name) => !state.plan.some((entry) => entry.area.toLowerCase() === name.toLowerCase()));
    if (!fresh.length) { flash(planStatus, tx("Every known area is in the plan already.")); return; }
    fresh.forEach((name) => {
      const before = [...state.rows].sort((a, b) => byDate(b, a)).filter((row) => row.area === name).map((row) => row.auditor);
      state.plan.push({ id: id("p"), area: name, cadence: CADENCES[0], auditors: names([areaOwner(name), ...before].filter(Boolean)).slice(0, 3) });
    });
    state.planExample = false;
    save();
    renderPlan();
    flash(planStatus, tx("{n} areas added to the plan.", { n: int.format(fresh.length) }));
  });
  monthButtons.forEach((button) => button.addEventListener("click", () => { planMonth = Number(button.dataset.planMonth) || 0; renderPlanView(); }));
  // Start this audit: the walk gets the area and the auditor of the plan; what was scored stays.
  planDue.addEventListener("click", (event) => {
    const button = event.target.closest("[data-plan-start]");
    const item = button && dueItems[Number(button.dataset.planStart)];
    if (!item) return;
    state.draft.area = item.area;
    state.draft.auditor = item.auditor;
    state.draft.date = today();
    save();
    renderSetup();
    renderResults();
    flash(auditStatus, item.auditor ? tx("The walk is set for {area} with {name}.", { area: item.area, name: item.auditor }) : tx("The walk is set for {area}.", { area: item.area }));
    const walk = root.querySelector(".fs-walk");
    walk?.scrollIntoView({ behavior: "smooth", block: "start" });
    questionsBox.querySelector('input[type="radio"]')?.focus({ preventScroll: true });
  });
  // The plan as a calendar file: the next eight weeks, one all-day entry per audit.
  const planEvents = (from = today()) => schedule(state.plan, state.rows, from, PLAN_DAYS).map((item) => ({
    uid: uidOf(item.area, item.date), date: item.date, location: item.area,
    summary: `${tx("5S audit: {area}", { area: item.area })}${item.auditor ? ` · ${item.auditor}` : ""}`,
    description: [cfg.text.tool, `${tx("Area")}: ${item.area}`, item.auditor ? `${tx("Auditor")}: ${item.auditor}` : "", `${tx("How often")}: ${cadenceName(item.cadence)}`, item.overdue ? tx("Overdue by {n} days, due {date}", { n: item.late, date: showDate(item.due) }) : ""].filter(Boolean).join("\n"),
  }));
  q("[data-plan-ics]").addEventListener("click", () => {
    const events = planEvents();
    if (!events.length) { flash(planStatus, tx("Nothing planned in the next eight weeks.")); return; }
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([ics(events)], { type: "text/calendar;charset=utf-8" }));
    link.download = `${cfg.text.icsName}-${today()}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    flash(planStatus, tx("{n} audits in the calendar file.", { n: int.format(events.length) }));
  });

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.rows.length && !state.tags.length && !draftStarted() && firstVisit(KEY)) loadExample();
  if (tagForm.elements.tagDate && !tagForm.elements.tagDate.value) tagForm.elements.tagDate.value = today();
  renderQuestions();
  render();
})();
