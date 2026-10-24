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
  window.FiveSMath = { SCORE_MAX, FINDING_AT, BAND_LIMITS, OLD_TAG_DAYS, addDays, pillarsFor, score, bandIndex, trend, latestByArea, previous, weakest, redTagStats };

  const dataEl = document.getElementById("five-s-audit-data");
  const root = document.querySelector("[data-five-s-audit]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, num, pct, showDate, dayMonth, read, write, loadState, isObject, str, el, int, today, recentExample, parseDate, flash, undoNote, panel, stat, barList, focusCard, resultActions, resultLayout, exampleNote, exampleStamp, exampleMatches, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
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

  // State: the scope and template, the audit in progress (draft), the saved audits (rows) and the red tags.
  const blankDraft = (keep = {}) => ({ date: keep.date || today(), area: str(keep.area), auditor: str(keep.auditor), shift: str(keep.shift), scores: {}, notes: {}, acts: {} });
  const state = loadState(KEY, { scope: "", template: "", rows: [], tags: [], draft: {}, view: "", example: {} });
  if (!SCOPES.includes(state.scope)) state.scope = SCOPES[0];
  if (!TEMPLATES.includes(state.template)) state.template = TEMPLATES[0];
  // Saved data can be damaged; keep only what has the expected shape.
  const cleanScores = (scores) => Object.fromEntries(Object.entries(isObject(scores) ? scores : {}).filter(([key]) => pillarOf[key]).map(([key, list]) => [key, (Array.isArray(list) ? list : []).map((v) => (isScore(v) ? v : null))]));
  const cleanText = (map) => Object.fromEntries(Object.entries(isObject(map) ? map : {}).filter(([, v]) => typeof v === "string" && v.trim()).map(([k, v]) => [k, v.trim()]));
  state.rows = state.rows.filter(isObject).map((row) => ({
    id: str(row.id) || id("a"), date: parseDate(row.date) || "", area: str(row.area), auditor: str(row.auditor), shift: str(row.shift),
    scope: SCOPES.includes(row.scope) ? row.scope : SCOPES[0], template: TEMPLATES.includes(row.template) ? row.template : state.template,
    scores: cleanScores(row.scores), notes: cleanText(row.notes),
  })).filter((row) => row.date && row.area);
  state.tags = state.tags.filter(isObject).map((tag) => ({
    id: str(tag.id) || id("t"), date: parseDate(tag.date) || "", area: str(tag.area), item: str(tag.item), reason: str(tag.reason), decision: str(tag.decision),
    owner: str(tag.owner), due: parseDate(tag.due) || "", done: tag.done === true,
  })).filter((tag) => tag.date && tag.item);
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

  const keys = () => pillarsFor(state.scope, cfg.scopes);
  const template = (name = state.template) => cfg.templates[name] || cfg.templates[TEMPLATES[0]];
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
  const renderSetup = () => {
    scopeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.scopeValue === state.scope)));
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
    if (findings.length) weakPanel.append(barList(findings.map((f) => ({ key: `${pillarName(f.key)} ${f.index + 1} · ${f.question}`, value: SCORE_MAX - f.score, note: f.note, score: f.score })), {
      label: (item) => [`${item.score} / ${SCORE_MAX}`, item.note ? ` · ${item.note}` : ""],
      highlight: (item) => item.score === 0,
      tag: tx("nothing in place"),
    }));
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

  const render = () => {
    renderSetup();
    renderLog();
    renderTags();
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
  };
  // The example leaves as a whole: its audits and its red tags, so nothing of it is scored against the visitor's work.
  const dropExample = () => {
    state.rows = [];
    state.tags = [];
    state.view = "";
    state.example = {};
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
  templateSelect.addEventListener("change", () => {
    state.template = templateSelect.value;
    fitDraft();
    renderQuestions();
    changed();
  });
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
    found.forEach(({ key, i, value }) => {
      const name = qid(key, i);
      const note = state.draft.notes[name] || "";
      Actions.add({
        title: questionsOf(state.template, key)[i],
        detail: [note, tx("Score {a} / {b}", { a: value, b: SCORE_MAX }), `${cfg.text.tool} · ${pillarName(key)} · ${state.draft.area} · ${showDate(state.draft.date)}`].filter(Boolean).join(" · "),
        owner: areaOwner(state.draft.area), due, source: "five-s-audit", check: cfg.text.checkText, area: state.draft.area, priority: value === 0 ? "High" : "Medium",
      });
      state.draft.acts[name] = false;
      const box = questionsBox.querySelector(`[data-act="${name}"]`);
      if (box) box.checked = false;
    });
    save();
    renderProgress();
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    auditStatus.replaceChildren(`${tx("Added {n} actions.", { n: found.length })} `, link);
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

  // A first visit opens on the example, so the result is visible at once; nothing is written until the visitor acts.
  if (!state.rows.length && !state.tags.length && !draftStarted() && firstVisit(KEY)) loadExample();
  if (tagForm.elements.tagDate && !tagForm.elements.tagDate.value) tagForm.elements.tagDate.value = today();
  renderQuestions();
  render();
})();
