// Lean Assessment: a self-assessment of how mature an area's lean system is, repeated every quarter. Ten dimensions
// (cfg.dimensions), each with a few statements scored 1–5 against level descriptors, by one to five assessors who
// score apart. Per statement the tool shows the mean and the spread (max − min) of the assessors; a spread of 2 or
// more is flagged for discussion. The dimension score is the mean of its statement means, the overall score the mean
// of the dimension means (the usual unweighted maturity index). Statements marked N/A are left out of every mean.
// Every assessment is kept with its date and area (cfg.storageKey); the latest is compared with the previous one of
// the same area. The arithmetic is in window.LeanAssessmentMath, so tests can call it.
(() => {
  if (!window.ToolKit) return;
  const { tx, el, read, write, isObject, str, num, int, showDate, today, addDays, copy, flash, undoNote, stat, panel, resultLayout, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;

  // Arithmetic --------------------------------------------------------------------------------------------------------
  const NA = "na";
  const MAX_ASSESSORS = 5;
  // Two assessors two levels apart saw different things: that is worth a conversation before the score is agreed.
  const DISAGREE = 2;
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const newId = () => `l${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const sid = (dimKey, index) => `${dimKey}.${index}`;
  // A score is a whole number 1–5, "na" (not applicable) or null (not scored yet).
  const cleanValue = (value) => {
    if (value === NA) return NA;
    if (typeof value !== "number" && typeof value !== "string") return null;
    const n = Number(value);
    return value !== "" && Number.isInteger(n) && n >= 1 && n <= 5 ? n : null;
  };
  const mean = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : null);
  // One decimal, half away from zero (2.25 → 2.3, −0.25 → −0.3), so shown scores and level names agree.
  const round1 = (value) => (value === null || !Number.isFinite(value) ? null : Math.sign(value) * Math.round(Math.abs(value) * 10 + 1e-7) / 10);

  // One statement across the assessors: mean and spread of the numeric scores. N/A and blank scores are left out;
  // the spread needs two scores (one score has nothing to disagree with).
  const statementStats = (values) => {
    const list = (Array.isArray(values) ? values : []).map(cleanValue);
    const scores = list.filter((v) => typeof v === "number");
    const na = list.filter((v) => v === NA).length;
    const spread = scores.length >= 2 ? Math.max(...scores) - Math.min(...scores) : 0;
    return {
      scores, n: scores.length, na, blank: list.length - scores.length - na,
      mean: mean(scores), spread, applicable: scores.length > 0, notApplicable: !scores.length && na > 0, disagree: spread >= DISAGREE,
    };
  };
  // Level of a score, read from the score as shown (one decimal): below 1.5 is 1, below 2.5 is 2, and so on.
  const levelOf = (score) => {
    const r = round1(score);
    if (r === null) return 0;
    return r < 1.5 ? 1 : r < 2.5 ? 2 : r < 3.5 ? 3 : r < 4.5 ? 4 : 5;
  };
  // The whole assessment: dimension mean = mean of its applicable statement means; overall = mean of the dimension
  // means that have one. dims are [{ key, name, statements: [text] }] in the order of the data file.
  const assess = (a, dims) => {
    const scores = isObject(a?.scores) ? a.scores : {};
    const rows = dims.map((d, order) => {
      const statements = d.statements.map((text, index) => ({ id: sid(d.key, index), dim: d.key, index, text, ...statementStats(scores[sid(d.key, index)]) }));
      const means = statements.filter((s) => s.applicable).map((s) => s.mean);
      return { key: d.key, order, name: d.name, mean: mean(means), scored: means.length, total: statements.length, na: statements.filter((s) => s.notApplicable).length, statements };
    });
    const overall = mean(rows.filter((r) => r.mean !== null).map((r) => r.mean));
    const all = rows.flatMap((r) => r.statements);
    return {
      dims: rows, overall, level: levelOf(overall),
      disagreements: all.filter((s) => s.disagree),
      scored: all.filter((s) => s.applicable).length, na: all.filter((s) => s.notApplicable).length, total: all.length,
    };
  };
  // How far one assessor has come: statements with a score or N/A from that assessor.
  const progressOf = (a, dims, rater) => {
    const total = dims.reduce((sum, d) => sum + d.statements.length, 0);
    let done = 0;
    dims.forEach((d) => d.statements.forEach((_, i) => { if (cleanValue((a.scores[sid(d.key, i)] || [])[rater]) !== null) done += 1; }));
    return { done, total };
  };
  // Change per dimension and overall: current − previous, on the unrounded means; null when either is missing.
  const diff = (now, before) => (now === null || before === null || before === undefined ? null : now - before);
  const compare = (current, previous) => ({
    overall: previous ? diff(current.overall, previous.overall) : null,
    dims: current.dims.map((d) => {
      const before = previous ? previous.dims.find((p) => p.key === d.key)?.mean ?? null : null;
      return { key: d.key, current: d.mean, previous: before, change: diff(d.mean, before) };
    }),
  });
  // The weakest dimensions, lowest mean first; equal means keep the order of the data file, so the pick is stable.
  const weakest = (rows, n = 3) => rows.filter((r) => r.mean !== null).slice()
    .sort((a, b) => (Math.abs(a.mean - b.mean) < 1e-9 ? a.order - b.order : a.mean - b.mean)).slice(0, n);
  const areaKey = (area) => str(area).trim().toLowerCase();
  // The assessment before this one: the same area, the latest date before this one's date.
  const previousOf = (list, current) => {
    if (!current || !isDate(current.date)) return null;
    return list.filter((a) => a.id !== current.id && areaKey(a.area) === areaKey(current.area) && isDate(a.date) && a.date < current.date)
      .reduce((best, a) => (!best || a.date > best.date ? a : best), null);
  };

  const cleanAssessment = (item) => {
    const a = isObject(item) ? item : {};
    const assessors = (Array.isArray(a.assessors) ? a.assessors : []).slice(0, MAX_ASSESSORS).map((name) => str(name).slice(0, 80));
    if (!assessors.length) assessors.push("");
    const scores = {};
    if (isObject(a.scores)) Object.entries(a.scores).forEach(([key, values]) => {
      if (!/^[A-Za-z0-9]+\.\d+$/.test(key) || !Array.isArray(values)) return;
      scores[key] = assessors.map((_, i) => cleanValue(values[i]));
    });
    return { id: str(a.id) || newId(), area: str(a.area).slice(0, 120), date: isDate(str(a.date)) ? str(a.date) : today(), assessors, scores, note: str(a.note).slice(0, 2000) };
  };
  // The example of the data file: scores per dimension, one array per statement with one score per assessor. The
  // current assessment is daysAgo days old, the previous one daysBefore days older (a quarter).
  const exampleAssessments = (cfg, day) => {
    const ex = cfg.example;
    const build = (part, date) => {
      const scores = {};
      Object.entries(part.scores).forEach(([key, rows]) => rows.forEach((values, i) => { scores[sid(key, i)] = values; }));
      return cleanAssessment({ area: ex.area, assessors: ex.assessors, date, note: part.note, scores });
    };
    const date = addDays(day, -ex.daysAgo);
    return { previous: build(ex.previous, addDays(date, -ex.previous.daysBefore)), current: build(ex, date) };
  };
  // To the Action Tracker: one action per weak dimension, to be checked at the next assessment a quarter later.
  const actionPayload = (dim, row, a, rank) => ({
    title: str(dim.action).replace("{area}", a.area.trim() || "–"),
    detail: `${dim.name}: ${row.mean === null ? "–" : round1(row.mean).toFixed(1)} / 5`,
    owner: "",
    due: isDate(a.date) ? addDays(a.date, 91) : "",
    source: "lean-assessment",
    check: str(dim.check),
    area: a.area.trim(),
    priority: rank === 0 ? "High" : "Medium",
  });

  window.LeanAssessmentMath = {
    NA, DISAGREE, MAX_ASSESSORS, sid, cleanValue, mean, round1, statementStats, levelOf, assess, progressOf, compare, weakest, previousOf,
    cleanAssessment, exampleAssessments, actionPayload,
  };

  // The page ----------------------------------------------------------------------------------------------------------
  const dataEl = document.getElementById("lean-assessment-data");
  const root = document.querySelector("[data-lean-assessment]");
  const results = document.querySelector("[data-results]");
  if (!dataEl || !root || !results) return;
  const cfg = JSON.parse(dataEl.textContent);
  const DIMS = cfg.dimensions;
  const CK = window.ChartKit;
  const S = window.ActionsStore;
  const WP = window.Workplace || null;
  const $ = (selector) => root.querySelector(selector);
  const areaInput = $("#la-area");
  const dateInput = $("#la-date");
  const noteInput = $("#la-note");
  const assessorBox = $("[data-assessors]");
  const addAssessor = $("[data-add-assessor]");
  const raterBox = $("[data-rater]");
  const progress = $("[data-progress]");
  const saveStatus = $("[data-save-status]");
  const historyBody = $("[data-history]");
  const historyWrap = $("[data-history-wrap]");
  const historyEmpty = $("[data-history-empty]");
  const historyCount = $("[data-history-count]");
  const historyStatus = $("[data-history-status]");
  const exampleAgain = $("[data-example-again]");

  const saved = read(cfg.storageKey, null);
  const state = {
    assessments: isObject(saved) && Array.isArray(saved.assessments) ? saved.assessments.filter(isObject).map(cleanAssessment) : [],
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) && Array.isArray(saved.example) ? saved.example.map(str) : [],
    rater: isObject(saved) && Number.isInteger(saved.rater) ? saved.rater : 0,
  };
  const current = () => state.assessments.find((a) => a.id === state.current) || null;
  const isExample = (a) => Boolean(a) && state.example.includes(a.id);
  const save = () => {
    saveStatus.textContent = write(cfg.storageKey, state) ? tx("Saved in this browser.") : tx("Not saved: this browser blocks storage. Copy the summary or download the CSV to keep it.");
  };
  const blank = (from) => cleanAssessment({ area: from && !isExample(from) ? from.area : "", assessors: from && !isExample(from) ? from.assessors : [""], date: today() });
  const ensureCurrent = () => {
    if (current()) return current();
    const a = state.assessments.slice().sort((x, y) => (x.date < y.date ? 1 : -1))[0] || null;
    if (a) { state.current = a.id; return a; }
    const fresh = blank(null);
    state.assessments.push(fresh);
    state.current = fresh.id;
    return fresh;
  };

  // Words -------------------------------------------------------------------------------------------------------------
  const score = (value) => (value === null ? "–" : num(round1(value), 1));
  const signed = (value) => {
    if (value === null) return "–";
    const r = round1(value);
    return `${r > 0 ? "+" : r < 0 ? "−" : "±"}${num(Math.abs(r), 1)}`;
  };
  const levelName = (level) => cfg.levels[level - 1]?.name || "–";
  const nameOf = (a, i) => a.assessors[i]?.trim() || tx("Assessor {n}", { n: i + 1 });
  const titleOf = (a) => `${a.area.trim() || tx("Area not named")} · ${showDate(a.date)}`;
  const dimOf = (key) => DIMS.find((d) => d.key === key);
  const toolUrl = (slug) => new URL(`../${slug}/`, location.href).href;
  const fileSlug = (a) => (a.area.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "area");

  // Example note ------------------------------------------------------------------------------------------------------
  const exampleNote = el("div", "dl-example-note");
  exampleNote.setAttribute("role", "status");
  exampleNote.hidden = true;
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleNote.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Start a new assessment to make it yours, or clear it now.")), " ", clearExample);
  root.prepend(exampleNote);

  // Areas from the workplace profile, the data file and earlier assessments.
  const fillAreas = () => {
    const list = $("#la-area-list");
    const names = [...new Set([...(WP?.areas().map((a) => a.name) || []), ...cfg.areas, ...state.assessments.map((a) => a.area.trim()).filter(Boolean)])];
    list.replaceChildren(...names.map((name) => { const o = el("option"); o.value = name; return o; }));
  };

  // Form --------------------------------------------------------------------------------------------------------------
  const renderAssessors = (a) => {
    assessorBox.replaceChildren();
    a.assessors.forEach((name, i) => {
      const row = el("div", "la-assessor");
      const id = `la-assessor-${i}`;
      const label = el("label", null, tx("Assessor {n}", { n: i + 1 }));
      label.htmlFor = id;
      const input = el("input");
      input.id = id;
      input.value = name;
      input.autocomplete = "off";
      input.placeholder = cfg.text.assessorPlaceholder;
      input.addEventListener("input", () => {
        a.assessors[i] = input.value.slice(0, 80);
        edited(false);
        renderRater(a);
      });
      row.append(label, input);
      if (a.assessors.length > 1) {
        const remove = el("button", "button-ghost la-remove", tx("Remove"));
        remove.type = "button";
        remove.setAttribute("aria-label", tx("Remove {name}", { name: nameOf(a, i) }));
        remove.addEventListener("click", () => {
          a.assessors.splice(i, 1);
          Object.values(a.scores).forEach((values) => values.splice(i, 1));
          if (state.rater >= a.assessors.length) state.rater = a.assessors.length - 1;
          fillForm();
          edited(true);
        });
        row.append(remove);
      }
      assessorBox.append(row);
    });
    addAssessor.hidden = a.assessors.length >= MAX_ASSESSORS;
  };
  const renderRater = (a) => {
    raterBox.replaceChildren(...a.assessors.map((_, i) => {
      const button = el("button", null, nameOf(a, i));
      button.type = "button";
      button.setAttribute("aria-pressed", String(i === state.rater));
      button.addEventListener("click", () => { state.rater = i; save(); renderScores(a); renderRater(a); });
      return button;
    }));
  };
  // The score buttons show the active assessor's score; the line under each statement shows everyone's.
  const renderScores = (a) => {
    const r = Math.min(state.rater, a.assessors.length - 1);
    root.querySelectorAll("[data-statement]").forEach((item) => {
      const values = a.scores[item.dataset.statement] || [];
      const mine = cleanValue(values[r]);
      item.querySelectorAll("[data-score]").forEach((button) => {
        const value = button.dataset.score === NA ? NA : Number(button.dataset.score);
        button.setAttribute("aria-pressed", String(mine === value));
      });
      const s = statementStats(values);
      const meta = item.querySelector("[data-meta]");
      const parts = a.assessors.map((_, i) => { const v = cleanValue(values[i]); return `${nameOf(a, i)} ${v === null ? "–" : v === NA ? tx("N/A") : v}`; });
      if (s.n) parts.push(`${tx("mean")} ${score(s.mean)}`);
      if (s.n >= 2) parts.push(`${tx("spread")} ${int.format(s.spread)}`);
      meta.replaceChildren(parts.join(" · "));
      if (s.disagree) meta.append(" ", el("strong", "la-flag", `! ${tx("Discuss: assessors disagree")}`));
      item.classList.toggle("is-disagree", s.disagree);
    });
    const result = assess(a, DIMS);
    root.querySelectorAll("[data-dim-score]").forEach((node) => {
      const d = result.dims.find((x) => x.key === node.dataset.dimScore);
      node.textContent = d.mean === null ? tx("Not scored yet") : tx("Mean {score} of 5 · {a} of {b} statements", { score: score(d.mean), a: int.format(d.scored), b: int.format(d.total) });
    });
    const p = progressOf(a, DIMS, r);
    progress.textContent = tx("{name}: {a} of {b} statements scored or marked N/A.", { name: nameOf(a, r), a: int.format(p.done), b: int.format(p.total) });
  };
  const fillForm = () => {
    const a = ensureCurrent();
    areaInput.value = a.area;
    dateInput.value = a.date;
    noteInput.value = a.note;
    if (state.rater >= a.assessors.length || state.rater < 0) state.rater = 0;
    renderAssessors(a);
    renderRater(a);
    renderScores(a);
  };
  // Every change is saved at once; the results follow.
  const edited = (full = true) => {
    save();
    if (full) renderScores(current());
    renderHistory();
    renderResults();
    exampleNote.hidden = !isExample(current());
  };

  areaInput.addEventListener("input", () => { current().area = areaInput.value.slice(0, 120); edited(); });
  areaInput.addEventListener("change", fillAreas);
  dateInput.addEventListener("change", () => { if (isDate(dateInput.value)) { current().date = dateInput.value; edited(); } });
  noteInput.addEventListener("input", () => { current().note = noteInput.value.slice(0, 2000); edited(false); });
  addAssessor.addEventListener("click", () => {
    const a = current();
    if (a.assessors.length >= MAX_ASSESSORS) return;
    a.assessors.push("");
    Object.values(a.scores).forEach((values) => values.push(null));
    state.rater = a.assessors.length - 1;
    fillForm();
    edited(false);
    assessorBox.querySelector(`#la-assessor-${a.assessors.length - 1}`)?.focus();
  });
  root.querySelectorAll("[data-statement]").forEach((item) => item.addEventListener("click", (event) => {
    const button = event.target.closest("[data-score]");
    if (!button) return;
    const a = current();
    const r = Math.min(state.rater, a.assessors.length - 1);
    const values = a.scores[item.dataset.statement] || a.assessors.map(() => null);
    while (values.length < a.assessors.length) values.push(null);
    const value = button.dataset.score === NA ? NA : Number(button.dataset.score);
    // A second tap on the same score takes it back.
    values[r] = cleanValue(values[r]) === value ? null : value;
    a.scores[item.dataset.statement] = values;
    edited();
  }));

  // History -----------------------------------------------------------------------------------------------------------
  const renderHistory = () => {
    const list = state.assessments.slice().sort((x, y) => (x.date === y.date ? 0 : x.date < y.date ? 1 : -1));
    historyBody.replaceChildren();
    list.forEach((a) => {
      const result = assess(a, DIMS);
      const prev = previousOf(state.assessments, a);
      const change = prev ? compare(result, assess(prev, DIMS)).overall : null;
      const row = el("tr");
      if (a.id === state.current) row.setAttribute("aria-current", "true");
      const open = el("button", "button-ghost", a.id === state.current ? tx("Shown") : tx("Open assessment"));
      open.type = "button";
      open.disabled = a.id === state.current;
      open.addEventListener("click", () => { state.current = a.id; save(); fillForm(); edited(false); results.scrollIntoView?.({ behavior: "smooth", block: "start" }); });
      const remove = el("button", "button-ghost", tx("Remove"));
      remove.type = "button";
      remove.setAttribute("aria-label", tx("Remove {name}", { name: titleOf(a) }));
      remove.addEventListener("click", () => {
        const at = state.assessments.indexOf(a);
        const wasCurrent = state.current === a.id;
        state.assessments.splice(at, 1);
        if (wasCurrent) state.current = "";
        fillForm();
        edited(false);
        undoNote(historyStatus, tx("Assessment removed."), () => {
          state.assessments.splice(at, 0, a);
          if (wasCurrent) state.current = a.id;
          fillForm();
          edited(false);
        });
      });
      const cells = [showDate(a.date), a.area.trim() || "–", a.assessors.map((_, i) => nameOf(a, i)).join(", "), score(result.overall), result.level ? levelName(result.level) : "–", signed(change)];
      cells.forEach((text, i) => { const td = el("td", i >= 3 && i !== 4 ? "num" : null, text); row.append(td); });
      const tools = el("td", "la-row-tools");
      tools.append(open, remove);
      row.append(tools);
      historyBody.append(row);
    });
    const any = state.assessments.some((a) => assess(a, DIMS).scored > 0);
    historyWrap.hidden = !state.assessments.length;
    historyEmpty.hidden = any;
    historyCount.textContent = state.assessments.length === 1 ? tx("1 assessment") : tx("{n} assessments", { n: int.format(state.assessments.length) });
    exampleAgain.hidden = !any || state.example.length > 0;
  };

  // Results -----------------------------------------------------------------------------------------------------------
  const scoreBars = (rows, changes, weak) => {
    const list = el("div", "dl-bars la-bars");
    rows.forEach((d) => {
      const row = el("div", "dl-bar");
      if (weak.has(d.key)) row.classList.add("is-top");
      const label = el("div", "dl-bar-label");
      const name = el("span", "dl-bar-name", d.name);
      if (weak.has(d.key)) name.append(el("span", "dl-tag", tx("weakest")));
      const value = el("span", "dl-bar-value");
      const c = changes.find((x) => x.key === d.key)?.change ?? null;
      value.append(el("strong", null, score(d.mean)), ` / 5${c === null ? "" : ` · ${signed(c)}`}`);
      label.append(name, value);
      const track = el("div", "bar-track");
      const fill = el("div", "bar-fill");
      fill.style.width = `${d.mean === null ? 0 : (d.mean / 5) * 100}%`;
      track.append(fill);
      row.append(label, track);
      list.append(row);
    });
    return list;
  };
  const table = (head, rows, className = "") => {
    const wrap = el("div", "dl-table-wrap");
    wrap.tabIndex = 0;
    const t = el("table", `dl-table ${className}`.trim());
    const thead = el("thead");
    const hr = el("tr");
    head.forEach((h, i) => { const th = el("th", i > 1 ? "num" : null, h); th.scope = "col"; hr.append(th); });
    thead.append(hr);
    const body = el("tbody");
    rows.forEach((cells) => {
      const tr = el("tr");
      cells.forEach((c, i) => tr.append(el("td", i > 1 ? "num" : null, c)));
      body.append(tr);
    });
    t.append(thead, body);
    wrap.append(t);
    return wrap;
  };
  const weakCard = (row, rank, a, change) => {
    const dim = dimOf(row.key);
    const card = el("article", "la-weak-card");
    const head = el("h4");
    head.append(el("span", "dl-rank", String(rank + 1)), ` ${dim.name}`);
    card.append(head, el("p", "la-weak-score", `${score(row.mean)} / 5 · ${levelName(levelOf(row.mean))}${change === null ? "" : ` · ${signed(change)} ${tx("since the last assessment")}`}`));
    card.append(el("p", null, dim.advice));
    const links = el("p", "la-tools");
    links.append(el("span", "result-label", tx("Tools for this")), " ");
    dim.tools.forEach((t, i) => {
      if (i) links.append(" · ");
      const link = el("a", "inline-link", t.name);
      link.href = toolUrl(t.slug);
      links.append(link);
    });
    card.append(links);
    if (S) {
      const actions = el("div", "tool-actions");
      actions.append(S.linkButton(tx("Add to actions"), () => actionPayload(dim, row, a, rank)));
      card.append(actions);
    }
    return card;
  };
  const asText = (a, result, prev, cmp, weak) => {
    const lines = [`${tx("Lean Assessment")}: ${titleOf(a)}`, `${tx("Assessors")}: ${a.assessors.map((_, i) => nameOf(a, i)).join(", ")}`,
      `${tx("Overall score")}: ${score(result.overall)} / 5 · ${levelName(result.level)}${prev ? ` (${signed(cmp.overall)} ${tx("since {date}", { date: showDate(prev.date) })})` : ""}`, ""];
    result.dims.forEach((d) => {
      const c = cmp.dims.find((x) => x.key === d.key).change;
      lines.push(`- ${d.name}: ${score(d.mean)}${c === null ? "" : ` (${signed(c)})`}`);
    });
    lines.push("", `${tx("Weakest three")}:`);
    weak.forEach((d, i) => lines.push(`${i + 1}. ${d.name} (${score(d.mean)}): ${dimOf(d.key).advice}`));
    if (result.disagreements.length) {
      lines.push("", `${tx("Discuss: assessors disagree")}:`);
      result.disagreements.forEach((s) => lines.push(`- ${dimOf(s.dim).name}: ${s.text} (${s.scores.join(" / ")})`));
    }
    if (a.note.trim()) lines.push("", a.note.trim());
    return lines.join("\n");
  };
  const exportRows = (a, result, cmp) => {
    const head = [tx("Date"), tx("Area"), tx("Dimension"), tx("Statement"), ...a.assessors.map((_, i) => nameOf(a, i)), tx("Mean"), tx("Spread"), tx("Discuss"), tx("Dimension mean"), tx("Previous assessment"), tx("Change")];
    const rows = [head];
    result.dims.forEach((d) => {
      const c = cmp.dims.find((x) => x.key === d.key);
      d.statements.forEach((s) => {
        const values = a.scores[s.id] || [];
        rows.push([a.date, a.area, d.name, s.text, ...a.assessors.map((_, i) => { const v = cleanValue(values[i]); return v === null ? "" : v === NA ? tx("N/A") : v; }),
          s.mean === null ? "" : round1(s.mean), s.n >= 2 ? s.spread : "", s.disagree ? tx("yes") : "",
          d.mean === null ? "" : round1(d.mean), c.previous === null ? "" : round1(c.previous), c.change === null ? "" : round1(c.change)]);
      });
    });
    return rows;
  };

  const renderResults = () => {
    const a = current();
    results.replaceChildren();
    const result = a ? assess(a, DIMS) : null;
    results.hidden = !result || !result.scored;
    if (results.hidden) return;
    const prev = previousOf(state.assessments, a);
    const prevResult = prev ? assess(prev, DIMS) : null;
    const cmp = compare(result, prevResult);
    const weak = weakest(result.dims);
    const weakKeys = new Set(weak.map((d) => d.key));

    const head = el("div", "result-head");
    const h2 = el("h2");
    h2.append(`${score(result.overall)} / 5 `, el("span", null, levelName(result.level)));
    head.append(el("p", "result-label", `${tx("Lean maturity")} · ${titleOf(a)}`), h2,
      el("p", null, `${cfg.levels[result.level - 1]?.short || ""} ${prev ? tx("Change since the assessment of {date}: {change}.", { date: showDate(prev.date), change: signed(cmp.overall) }) : tx("No earlier assessment of this area yet: the next one will show the change.")}`));
    const stats = el("div", "dl-stats");
    stats.append(
      stat(tx("Overall score"), `${score(result.overall)} / 5`, levelName(result.level)),
      stat(tx("Change"), prev ? signed(cmp.overall) : "–", prev ? tx("since {date}", { date: showDate(prev.date) }) : tx("No earlier assessment")),
      stat(tx("Weakest"), weak[0] ? score(weak[0].mean) : "–", weak[0]?.name || ""),
      stat(tx("Disagreements"), int.format(result.disagreements.length), tx("statements with a spread of 2 or more")),
      stat(tx("Statements scored"), tx("{a} of {b}", { a: int.format(result.scored), b: int.format(result.total) }), result.na ? tx("N/A: {n}", { n: int.format(result.na) }) : tx("none marked N/A")),
    );

    // The picture first: the radar against last time and the dimensions weakest first.
    const main = el("div", "la-main");
    const pictures = el("div", "la-pictures");
    const radarBox = el("div", "la-radar");
    radarBox.append(el("h3", "result-label", tx("Maturity by dimension")));
    if (CK) {
      const axes = result.dims.map((d) => ({ label: dimOf(d.key).short || d.name, value: d.mean ?? 0, max: 5 }));
      const compareSets = prevResult ? [{ label: `${tx("Previous assessment")} · ${showDate(prev.date)}`, values: prevResult.dims.map((d) => d.mean ?? 0) }] : [];
      radarBox.append(CK.figure(CK.radar(axes, { title: tx("Lean maturity by dimension"), levels: 5, compare: compareSets, format: (v) => num(round1(v), 1) }), { fileName: `lean-assessment-${fileSlug(a)}` }));
      const legend = [{ label: `${tx("This assessment")} · ${showDate(a.date)}`, color: CK.C.blue }];
      if (prev) legend.push({ label: `${tx("Previous assessment")} · ${showDate(prev.date)}`, color: CK.SERIES[1] });
      radarBox.append(CK.legend(legend));
    }
    const barsBox = el("div", "la-ranking");
    barsBox.append(el("h3", "result-label", tx("Weakest first")));
    const ranked = result.dims.slice().sort((x, y) => {
      if (x.mean === null || y.mean === null) return (x.mean === null) - (y.mean === null) || x.order - y.order;
      return Math.abs(x.mean - y.mean) < 1e-9 ? x.order - y.order : x.mean - y.mean;
    });
    barsBox.append(scoreBars(ranked, cmp.dims, weakKeys));
    pictures.append(radarBox, barsBox);
    main.append(pictures);

    const weakBox = el("section", "la-weak");
    weakBox.append(el("h3", "result-label", tx("Next steps: the three weakest dimensions")));
    const cards = el("div", "la-weak-grid");
    weak.forEach((d, i) => cards.append(weakCard(d, i, a, cmp.dims.find((x) => x.key === d.key).change)));
    weakBox.append(cards);
    main.append(weakBox);

    const talk = el("section", "la-disagree");
    talk.append(el("h3", "result-label", tx("Discuss: assessors disagree")));
    if (result.disagreements.length) {
      const list = el("ul", "la-disagree-list");
      result.disagreements.forEach((s) => {
        const li = el("li");
        const values = a.scores[s.id] || [];
        li.append(el("strong", null, `! ${dimOf(s.dim).name}`), ` · ${s.text} `, el("span", "la-scores", a.assessors.map((_, i) => { const v = cleanValue(values[i]); return `${nameOf(a, i)} ${v === null ? "–" : v === NA ? tx("N/A") : v}`; }).join(" · ") + ` · ${tx("spread")} ${int.format(s.spread)}`));
        list.append(li);
      });
      talk.append(el("p", "form-note", tx("A spread of 2 or more means the assessors saw different things. Talk it through on the floor before the score is agreed.")), list);
    } else {
      talk.append(el("p", "form-note", a.assessors.length > 1 ? tx("No statement with a spread of 2 or more: the assessors agree.") : tx("One assessor: add a second one to see where views differ.")));
    }
    main.append(talk);

    const actions = el("div", "tool-actions result-actions");
    const copyButton = el("button", "button-primary", tx("Copy summary"));
    copyButton.type = "button";
    copyButton.addEventListener("click", () => copy(asText(a, result, prev, cmp, weak), copyButton));
    const printButton = el("button", "button-secondary", tx("Print or save as PDF"));
    printButton.type = "button";
    printButton.addEventListener("click", () => window.print());
    const csvButton = el("button", "button-secondary", tx("Download CSV"));
    csvButton.type = "button";
    csvButton.addEventListener("click", () => downloadCsv(`lean-assessment-${fileSlug(a)}`, exportRows(a, result, cmp)));
    const xlsxButton = el("button", "button-secondary", tx("Download Excel"));
    xlsxButton.type = "button";
    xlsxButton.addEventListener("click", () => downloadXlsx(`lean-assessment-${fileSlug(a)}`, exportRows(a, result, cmp), { sheet: "Lean assessment" }));
    const tracker = el("a", "button-ghost", tx("Open the Action Tracker"));
    tracker.href = toolUrl("action-tracker");
    actions.append(copyButton, printButton, csvButton, xlsxButton, tracker);

    const changePanel = panel(tx("Change per dimension"), prev ? tx("This assessment against the one of {date}.", { date: showDate(prev.date) }) : tx("No earlier assessment of this area yet: the next one will show the change."));
    changePanel.append(table([tx("Dimension"), tx("Maturity level"), tx("Previous assessment"), tx("Now"), tx("Change")], result.dims.map((d) => {
      const c = cmp.dims.find((x) => x.key === d.key);
      return [d.name, d.mean === null ? "–" : levelName(levelOf(d.mean)), score(c.previous), score(d.mean), signed(c.change)];
    })));
    const detailPanel = panel(tx("Every statement"), tx("Scores per assessor, the mean and the spread (highest minus lowest). N/A is left out of every mean."));
    detailPanel.append(table([tx("Dimension"), tx("Statement"), ...a.assessors.map((_, i) => nameOf(a, i)), tx("Mean"), tx("Spread")], result.dims.flatMap((d) => d.statements.map((s) => {
      const values = a.scores[s.id] || [];
      return [d.name, `${s.disagree ? "! " : ""}${s.text}`, ...a.assessors.map((_, i) => { const v = cleanValue(values[i]); return v === null ? "–" : v === NA ? tx("N/A") : String(v); }), score(s.mean), s.n >= 2 ? int.format(s.spread) : "–"];
    })), "la-detail"));
    const levelPanel = panel(tx("The levels"), tx("What each score means, for every dimension."));
    const levels = el("ol", "la-level-key");
    cfg.levels.forEach((l, i) => { const li = el("li"); li.append(el("strong", null, `${i + 1} · ${l.name}`), ` ${l.short}`); levels.append(li); });
    levelPanel.append(levels);
    const panels = [changePanel, detailPanel, levelPanel];
    if (a.note.trim()) { const notePanel = panel(tx("Note")); notePanel.append(el("p", null, a.note.trim())); panels.push(notePanel); }

    resultLayout(results, { head, stats, focus: main, actions, panels });
  };

  // Buttons -----------------------------------------------------------------------------------------------------------
  const loadExample = () => {
    const known = state.assessments.find((a) => state.example.includes(a.id) && assess(a, DIMS).scored);
    if (!known) {
      const { previous, current: now } = exampleAssessments(cfg, today());
      state.assessments.push(previous, now);
      state.example = [previous.id, now.id];
      state.current = now.id;
    } else {
      state.current = state.example.at(-1);
    }
    // An untouched blank assessment is not kept next to the example.
    state.assessments = state.assessments.filter((a) => state.example.includes(a.id) || assess(a, DIMS).scored || a.area.trim());
    fillAreas();
    fillForm();
    edited(false);
  };
  root.querySelectorAll("[data-example], [data-example-again]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    results.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }));
  clearExample.addEventListener("click", () => {
    state.assessments = state.assessments.filter((a) => !state.example.includes(a.id));
    if (state.example.includes(state.current)) state.current = "";
    state.example = [];
    fillAreas();
    fillForm();
    edited(false);
  });
  $("[data-new]").addEventListener("click", () => {
    const fresh = blank(current());
    state.assessments.push(fresh);
    state.current = fresh.id;
    state.rater = 0;
    fillForm();
    edited(false);
    flash(saveStatus, tx("New assessment started. The earlier ones stay in the history."));
    areaInput.focus();
  });

  // Another tab changed the saved assessments.
  window.addEventListener("storage", (event) => {
    if (event.key !== cfg.storageKey) return;
    const next = read(cfg.storageKey, null);
    if (!isObject(next) || !Array.isArray(next.assessments)) return;
    state.assessments = next.assessments.filter(isObject).map(cleanAssessment);
    state.current = str(next.current);
    state.example = Array.isArray(next.example) ? next.example.map(str) : [];
    fillAreas();
    fillForm();
    renderHistory();
    renderResults();
  });
  if (WP) window.addEventListener("workplace:changed", fillAreas);

  // Start: a first visit opens on the example, with the note.
  if (firstVisit(cfg.storageKey)) {
    const { previous, current: now } = exampleAssessments(cfg, today());
    state.assessments.push(previous, now);
    state.example = [previous.id, now.id];
    state.current = now.id;
    save();
  }
  state.example = state.example.filter((id) => state.assessments.some((a) => a.id === id));
  fillAreas();
  fillForm();
  renderHistory();
  renderResults();
  exampleNote.hidden = !isExample(current());
})();
