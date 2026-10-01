(() => {
  const form = document.querySelector("[data-handover]");
  const dataEl = document.getElementById("shift-handover-data");
  if (!form || !dataEl || !window.ToolKit) return;

  const { LOCALE, tx, dayMonth, lower, pct, read, write, isObject, str, el, today, parseDate, renderOnPause } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const HISTORY_MAX = 30;
  const PRIORITY_ORDER = Object.fromEntries(data.priorities.map((p, i) => [p, i]));
  // Priorities are listed high to low; the colour follows the position, not the word.
  const priorityClass = (p) => ["high", "medium", "low"][PRIORITY_ORDER[p]] || "medium";
  const MEDIUM = data.priorities[1];

  const metricsBox = form.querySelector("[data-metrics]");
  const issuesBox = form.querySelector("[data-issues]");
  const checklistBox = form.querySelector("[data-checklist]");
  const emptyNote = form.querySelector("[data-empty]");
  const output = document.querySelector("[data-output]");
  const outputTitle = output.querySelector("[data-output-title]");
  const sheet = output.querySelector("[data-sheet]");
  const quality = output.querySelector("[data-quality]");
  const ackText = output.querySelector("[data-ack-text]");
  const status = output.querySelector("[data-status]");
  const historySection = document.querySelector("[data-history-section]");
  const historyBox = document.querySelector("[data-history]");

  const template = (key) => data.templates[key] || data.templates[Object.keys(data.templates)[0]];

  const blank = (key, date = today(), shift = data.shifts[0]) => ({
    template: key,
    date,
    shift,
    area: "",
    from: "",
    to: "",
    metrics: template(key).metrics.map((label) => [label, "", ""]),
    issues: [],
    headsUp: "",
    safety: "",
    checks: template(key).checklist.map(() => false),
    ackAt: "",
  });

  // Rebuild a saved handover field by field, so damaged data cannot break the page.
  const clean = (h) => {
    const key = data.templates[h.template] ? h.template : Object.keys(data.templates)[0];
    const base = blank(key, parseDate(str(h.date)) || today(), data.shifts.includes(h.shift) ? h.shift : data.shifts[0]);
    const metrics = Array.isArray(h.metrics) ? h.metrics.filter(Array.isArray).map((m) => [str(m[0]), str(m[1]), str(m[2])]) : base.metrics;
    const issues = Array.isArray(h.issues) ? h.issues.filter(isObject).map((issue) => ({
      text: str(issue.text),
      priority: data.priorities.includes(issue.priority) ? issue.priority : MEDIUM,
      owner: str(issue.owner),
      due: str(issue.due),
      done: issue.done === true,
      carried: Number.isInteger(issue.carried) && issue.carried > 0 ? issue.carried : 0,
    })) : [];
    const checks = base.checks.map((_, i) => Array.isArray(h.checks) && h.checks[i] === true);
    return { ...base, area: str(h.area), from: str(h.from), to: str(h.to), headsUp: str(h.headsUp), safety: str(h.safety), ackAt: str(h.ackAt), metrics, issues, checks };
  };
  const saved = read(KEY, {});
  const state = {
    current: isObject(saved) && isObject(saved.current) ? clean(saved.current) : blank(Object.keys(data.templates)[0]),
    history: isObject(saved) && Array.isArray(saved.history)
      ? saved.history.filter((entry) => isObject(entry) && isObject(entry.handover) && typeof entry.text === "string")
        .map((entry) => ({ ...entry, handover: clean(entry.handover) }))
      : [],
  };
  const save = () => write(KEY, state);
  const cur = () => state.current;

  const hasContent = (h) => Boolean(h.area || h.from || h.to || h.headsUp || h.safety
    || h.issues.length || h.metrics.some(([, value]) => value));

  const nextShift = (h) => {
    const index = data.shifts.indexOf(h.shift);
    const shift = data.shifts[(index + 1) % data.shifts.length];
    let date = h.date;
    const next = new Date(`${date}T00:00:00Z`);
    if (index === data.shifts.length - 1 && date && !Number.isNaN(next.getTime())) {
      next.setUTCDate(next.getUTCDate() + 1);
      date = next.toISOString().slice(0, 10);
    }
    return { shift, date };
  };

  // One formatter each: building them per call is slow with a long history.
  const dateFormat = dayMonth(true);
  const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const longDate = (iso) => {
    const date = new Date(`${iso}T00:00:00Z`);
    return iso && !Number.isNaN(date.getTime()) ? dateFormat(date) : tx("No date");
  };
  const clock = (iso) => {
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? "?" : timeFormat.format(date);
  };
  const shiftLine = (h) => `${longDate(h.date)} · ${tx("{shift} shift → {next}", { shift: h.shift, next: nextShift(h).shift })}`;
  const people = (h) => tx("From {from} to {to}", { from: h.from || "?", to: h.to || "?" });
  const openIssues = (h) => h.issues.filter((issue) => !issue.done && issue.text.trim())
    .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9) || b.carried - a.carried);
  const solvedIssues = (h) => h.issues.filter((issue) => issue.done && issue.text.trim());

  // Editor --------------------------------------------------------------------
  const input = ({ ariaLabel, ...props }) => {
    const node = el("input");
    Object.assign(node, props);
    if (ariaLabel) node.setAttribute("aria-label", ariaLabel);
    node.autocomplete = "off";
    return node;
  };
  const removeButton = (label, kind, index) => {
    const button = el("button", "dl-remove", "×");
    button.type = "button";
    button.dataset.remove = kind;
    button.dataset.index = index;
    button.setAttribute("aria-label", label);
    return button;
  };

  const renderMetrics = () => {
    metricsBox.replaceChildren();
    cur().metrics.forEach(([label, value, note], i) => {
      const row = el("div", "sh-metric");
      row.append(
        input({ value: label, placeholder: tx("Number"), ariaLabel: tx("Name of number {n}", { n: i + 1 }), className: "sh-in" }),
        input({ value, placeholder: tx("Value"), ariaLabel: `${label || tx("Number")}: ${tx("value")}`, className: "sh-in" }),
        input({ value: note, placeholder: tx("Note or target"), ariaLabel: `${label || tx("Number")}: ${tx("note")}`, className: "sh-in" }),
        removeButton(tx("Remove {name}", { name: label || tx("this number") }), "metric", i),
      );
      ["label", "value", "note"].forEach((field, j) => {
        row.children[j].dataset.metric = field;
        row.children[j].dataset.index = i;
      });
      metricsBox.append(row);
    });
  };

  // One issue row. Its number lives in data-index and the labels, so rows can
  // be renumbered in place when one above them is removed.
  const numberIssue = (row, i) => {
    const issue = cur().issues[i];
    const name = tx("Issue {n}", { n: i + 1 });
    row.querySelectorAll("[data-index]").forEach((node) => { node.dataset.index = i; });
    row.querySelector('[data-issue="done"]').setAttribute("aria-label", `${tx("Solved")}: ${issue.text || tx("issue {n}", { n: i + 1 })}`);
    row.querySelector('[data-issue="text"]').setAttribute("aria-label", name);
    row.querySelector('[data-issue="priority"]').setAttribute("aria-label", `${name}: ${tx("priority")}`);
    row.querySelector('[data-issue="owner"]').setAttribute("aria-label", `${name}: ${tx("owner")}`);
    row.querySelector('[data-issue="due"]').setAttribute("aria-label", `${name}: ${tx("by when")}`);
    row.querySelector("[data-remove]").setAttribute("aria-label", tx("Remove issue {n}", { n: i + 1 }));
  };

  const issueRow = (issue, i) => {
    const row = el("div", "sh-issue");
    if (issue.done) row.classList.add("is-done");
    const done = input({ type: "checkbox", checked: issue.done });
    done.dataset.issue = "done";
    const text = input({ value: issue.text, placeholder: tx("What is open, and what is the risk?"), className: "sh-in sh-issue-text" });
    text.dataset.issue = "text";
    const priority = el("select", "sh-in");
    data.priorities.forEach((p) => {
      const option = el("option", null, p);
      option.selected = p === issue.priority;
      priority.append(option);
    });
    priority.dataset.issue = "priority";
    const owner = input({ value: issue.owner, placeholder: tx("Owner"), className: "sh-in" });
    owner.dataset.issue = "owner";
    const due = input({ value: issue.due, placeholder: tx("By when"), className: "sh-in" });
    due.dataset.issue = "due";
    [done, text, priority, owner, due].forEach((node) => { node.dataset.index = i; });
    const meta = el("div", "sh-issue-meta");
    meta.append(priority, owner, due);
    if (issue.carried) meta.append(el("span", `dl-tag${issue.carried >= 2 ? " is-warn" : ""}`, tx("Carried {n}×", { n: issue.carried })));
    meta.append(removeButton("", "issue", i));
    const main = el("div", "sh-issue-main");
    main.append(text, meta);
    row.append(done, main);
    numberIssue(row, i);
    return row;
  };

  const noIssues = () => el("p", "form-note sh-help", tx("No open issues yet."));

  const renderIssues = () => {
    issuesBox.replaceChildren(...(cur().issues.length ? cur().issues.map(issueRow) : [noIssues()]));
  };

  const renderChecklist = () => {
    checklistBox.replaceChildren();
    template(cur().template).checklist.forEach((item, i) => {
      const li = el("li");
      const label = el("label", "dl-check-item");
      const box = input({ type: "checkbox", checked: Boolean(cur().checks[i]) });
      box.dataset.check = i;
      label.append(box, el("span", null, item));
      li.append(label);
      checklistBox.append(li);
    });
  };

  const renderFields = () => {
    ["template", "date", "shift", "area", "from", "to", "headsUp", "safety"].forEach((name) => {
      form.elements[name].value = cur()[name] ?? "";
    });
    form.elements.headsUp.placeholder = template(cur().template).headsUp;
  };

  const renderEditor = () => {
    renderFields();
    renderMetrics();
    renderIssues();
    renderChecklist();
  };

  // Numbers from the logs ------------------------------------------------------
  // Damage Control, Incomplete Control and Delay Analyzer keep their logs in this browser, one per
  // language, with the same shift names as this page. Their numbers for this handover's date and
  // shift fill the matching empty numbers of the template; anything typed stays as it is.
  const logRows = (tool) => {
    const saved = read(KEY.replace("shift-handover", tool), {});
    return isObject(saved) && Array.isArray(saved.rows) ? { settings: saved, rows: saved.rows.filter(isObject) } : { settings: {}, rows: [] };
  };
  const clockMinutes = (time) => (/^\d{2}:\d{2}$/.test(str(time)) ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)) : null);
  const late = (planned, actual) => {
    const a = clockMinutes(planned);
    const b = clockMinutes(actual);
    if (a === null || b === null) return null;
    let value = b - a;
    if (value < -720) value += 1440;
    if (value > 720) value -= 1440;
    return value;
  };
  const gracePart = (value, fallback) => {
    const number = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  };
  const shiftTotals = (h) => {
    const mine = (row) => row.date === h.date && row.shift === h.shift;
    const units = (rows) => rows.reduce((sum, row) => sum + (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1), 0);
    const damage = logRows("damage-control").rows.filter(mine);
    const incomplete = logRows("incomplete-control").rows.filter(mine);
    const delay = logRows("delay-analyzer");
    const depGrace = gracePart(delay.settings.departureGrace, 10);
    const arrGrace = gracePart(delay.settings.arrivalGrace, 15);
    const routes = delay.rows.filter(mine).map((row) => ({ dep: late(row.planDep, row.actDep), arr: late(row.planArr, row.actArr) })).filter((row) => row.arr !== null);
    const departed = routes.filter((row) => row.dep !== null);
    return {
      damage: damage.length ? units(damage) : null,
      incomplete: incomplete.length ? units(incomplete) : null,
      departures: departed.length ? { onTime: departed.filter((row) => row.dep <= depGrace).length, total: departed.length } : null,
      arrivals: routes.length ? { onTime: routes.filter((row) => row.arr <= arrGrace).length, total: routes.length } : null,
    };
  };
  const handledNumber = (h) => {
    const label = template(h.template).metrics[0];
    const value = Number(String(h.metrics.find(([name]) => name === label)?.[1] ?? "").replace(/[.\s](?=\d{3}\b)/g, "").replace(",", "."));
    return value > 0 ? value : null;
  };
  // What each source writes, for the metric it belongs to.
  const fillValue = (source, totals, h) => {
    const fromLog = tx("from the log");
    if (source === "damage" || source === "incomplete") {
      const count = totals[source];
      if (count === null) return null;
      const noun = source === "damage" ? tx("damaged units") : tx("incomplete orders");
      const handled = source === "damage" ? handledNumber(h) : null;
      return handled
        ? [pct(count / handled, 2), `${tx("{a} of {b}", { a: count, b: handled })} · ${fromLog}`]
        : [String(count), [noun, fromLog, source === "damage" ? tx("add the units handled for the rate") : ""].filter(Boolean).join(" · ")];
    }
    const part = totals[source];
    if (!part) return null;
    return [pct(part.onTime / part.total, 1), `${tx("{a} of {b} routes", { a: part.onTime, b: part.total })} · ${fromLog}`];
  };

  // Output --------------------------------------------------------------------
  const problems = (h) => {
    const open = openIssues(h);
    const list = [];
    const noOwner = open.filter((issue) => !issue.owner.trim()).length;
    const noTime = open.filter((issue) => !issue.due.trim()).length;
    if (noOwner) list.push(tx(noOwner === 1 ? "{n} open issue has no owner." : "{n} open issues have no owner.", { n: noOwner }));
    if (noTime) list.push(tx(noTime === 1 ? "{n} open issue has no time." : "{n} open issues have no time.", { n: noTime }));
    open.filter((issue) => issue.carried >= 2).forEach((issue) => list.push(tx("\"{text}\" has been carried {n} times. It is not a shift problem any more: take it through 5 Whys.", { text: issue.text, n: issue.carried })));
    if (!h.to.trim()) list.push(tx("Nobody is named to take over."));
    const unticked = h.checks.filter((c) => !c).length;
    if (unticked === h.checks.length) list.push(tx("No handover checks ticked yet."));
    else if (unticked) list.push(tx("{a} of {b} handover checks are not ticked.", { a: unticked, b: h.checks.length }));
    return list;
  };

  const asText = (h) => {
    const t = template(h.template);
    const lines = [`${tx("Shift handover")}${h.area ? ` | ${h.area}` : ""}`, shiftLine(h)];
    if (h.from || h.to) lines.push(people(h));
    const numbers = h.metrics.filter(([label, value]) => label && value);
    if (numbers.length) {
      lines.push("", tx("NUMBERS"));
      numbers.forEach(([label, value, note]) => lines.push(`- ${label}: ${value}${note ? ` (${note})` : ""}`));
    }
    const open = openIssues(h);
    lines.push("", `${tx("OPEN ISSUES")} (${open.length})`);
    if (!open.length) lines.push(`- ${tx("None")}`);
    open.forEach((issue, i) => lines.push(`${i + 1}. [${issue.priority}] ${issue.text} · ${tx("owner")}: ${issue.owner || "-"} · ${tx("by")}: ${issue.due || "-"}${issue.carried ? ` · ${tx("carried {n}×", { n: issue.carried })}` : ""}`));
    const solved = solvedIssues(h);
    if (solved.length) {
      lines.push("", tx("SOLVED THIS SHIFT"));
      solved.forEach((issue) => lines.push(`- ${issue.text}`));
    }
    const heads = h.headsUp.split("\n").map((line) => line.trim()).filter(Boolean);
    if (heads.length) {
      lines.push("", tx("HEADS-UP"));
      heads.forEach((line) => lines.push(`- ${line}`));
    }
    const safety = h.safety.split("\n").map((line) => line.trim()).filter(Boolean);
    if (safety.length) {
      lines.push("", tx("SAFETY AND PEOPLE"));
      safety.forEach((line) => lines.push(`- ${line}`));
    }
    lines.push("", `${tx("Handover check")}: ${tx("{a} of {b}", { a: h.checks.filter(Boolean).length, b: t.checklist.length })}`);
    if (h.ackAt) lines.push(tx("Taken over by {name} at {time}", { name: h.to, time: clock(h.ackAt) }));
    return lines.join("\n");
  };

  const block = (title, children) => {
    const section = el("section", "sh-block");
    section.append(el("h4", "result-label", title), ...children);
    return section;
  };
  const lines = (text) => {
    const list = el("ul", "sh-lines");
    text.split("\n").map((line) => line.trim()).filter(Boolean).forEach((line) => list.append(el("li", null, line)));
    return list;
  };

  const renderSheet = () => {
    const h = cur();
    sheet.replaceChildren();
    const head = el("header", "sh-sheet-head");
    head.append(el("p", "result-label", shiftLine(h)));
    head.append(el("h3", null, h.area || tx("Shift handover")));
    head.append(el("p", "sh-people", people(h)));
    sheet.append(head);

    const numbers = h.metrics.filter(([label, value]) => label && value);
    if (numbers.length) {
      const grid = el("dl", "sh-numbers");
      numbers.forEach(([label, value, note]) => {
        const item = el("div");
        item.append(el("dt", null, label), el("dd", null, value));
        if (note) item.append(el("dd", "sh-note", note));
        grid.append(item);
      });
      sheet.append(block(tx("Numbers"), [grid]));
    }

    const open = openIssues(h);
    const list = el("ol", "sh-open");
    if (!open.length) list.append(el("li", "sh-none", tx("No open issues.")));
    open.forEach((issue) => {
      const li = el("li");
      li.append(el("span", `sh-priority is-${priorityClass(issue.priority)}`, issue.priority));
      const body = el("div");
      body.append(el("strong", null, issue.text));
      const meta = [`${tx("Owner")}: ${issue.owner || tx("none")}`, `${tx("By")}: ${issue.due || tx("no time")}`];
      if (issue.carried) meta.push(tx("Carried {n}×", { n: issue.carried }));
      body.append(el("span", "sh-issue-info", meta.join(" · ")));
      li.append(body);
      list.append(li);
    });
    sheet.append(block(`${tx("Open issues")} (${open.length})`, [list]));

    const solved = solvedIssues(h);
    if (solved.length) sheet.append(block(tx("Solved this shift"), [lines(solved.map((issue) => issue.text).join("\n"))]));
    if (h.headsUp.trim()) sheet.append(block(tx("Heads-up"), [lines(h.headsUp)]));
    if (h.safety.trim()) sheet.append(block(tx("Safety and people"), [lines(h.safety)]));

    const foot = el("p", "sh-foot", `${tx("Handover check")}: ${tx("{a} of {b}", { a: h.checks.filter(Boolean).length, b: h.checks.length })} · ${h.ackAt ? tx("Taken over by {name} at {time}", { name: h.to, time: clock(h.ackAt) }) : tx("Not yet confirmed")}`);
    sheet.append(foot);
  };

  const renderQuality = () => {
    const list = problems(cur());
    quality.replaceChildren(el("p", "kicker", tx("Before you hand over")));
    if (!hasContent(cur())) {
      quality.append(el("p", "sh-ok", tx("Fill in the shift, the numbers and the open issues. This panel then shows what is still missing.")));
      return;
    }
    if (!list.length) {
      quality.append(el("p", "sh-ok", tx("Complete: every open issue has an owner and a time, and the checks are done.")));
      return;
    }
    const ul = el("ul", "sh-problems");
    list.forEach((text) => ul.append(el("li", null, text)));
    quality.append(ul);
  };

  const renderOutput = () => {
    const h = cur();
    outputTitle.textContent = !hasContent(h) ? tx("Start with the numbers") : h.ackAt ? tx("Taken over by {name}", { name: h.to }) : problems(h).length ? tx("Almost ready") : tx("Ready to hand over");
    ackText.textContent = h.ackAt
      ? tx("Confirmed by {name} at {time}. Close the shift to start the next handover with the open issues carried over.", { name: h.to, time: clock(h.ackAt) })
      : tx("The person taking over confirms they have read it and asked their questions.");
    emptyNote.hidden = hasContent(h);
    renderSheet();
    renderQuality();
  };

  const renderHistory = () => {
    historyBox.replaceChildren();
    historySection.hidden = !state.history.length;
    state.history.forEach((entry, index) => {
      const h = entry.handover;
      const details = el("details", "dl-box sh-past");
      const summary = el("summary");
      summary.append(el("strong", null, `${longDate(h.date)} · ${h.shift}`), ` ${h.area ? `· ${h.area} ` : ""}· ${h.from || "?"} → ${h.to || "?"} · ${tx("{n} open", { n: openIssues(h).length })}`);
      details.append(summary);
      details.append(el("pre", "sh-pre", entry.text));
      const copyButton = el("button", "button-secondary", tx("Copy as text"));
      copyButton.type = "button";
      copyButton.dataset.copyHistory = index;
      const actions = el("div", "tool-actions");
      actions.append(copyButton);
      details.append(actions);
      historyBox.append(details);
    });
  };

  const renderAll = () => {
    renderEditor();
    renderOutput();
    renderHistory();
  };

  const note = (message) => {
    status.textContent = message;
    clearTimeout(note.timer);
    note.timer = setTimeout(() => { status.textContent = ""; }, 2600);
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = el("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  };

  // Events --------------------------------------------------------------------
  const commit = () => {
    save();
    renderOutput();
  };
  // Typing waits for a pause when the handover is long (many issues or a full history).
  const commitSoon = renderOnPause(commit, () => cur().issues.length + state.history.length, 40);

  form.addEventListener("input", (event) => {
    const target = event.target;
    const h = cur();
    if (target.dataset.metric) {
      h.metrics[target.dataset.index][["label", "value", "note"].indexOf(target.dataset.metric)] = target.value;
    } else if (target.dataset.issue && target.type !== "checkbox") {
      h.issues[target.dataset.index][target.dataset.issue] = target.value;
    } else if (["date", "shift", "area", "from", "to", "headsUp", "safety"].includes(target.name)) {
      h[target.name] = target.value;
      if (target.name === "to") h.ackAt = "";
    } else {
      return;
    }
    commitSoon();
  });

  form.addEventListener("change", (event) => {
    const target = event.target;
    const h = cur();
    if (target.dataset.issue === "done") {
      h.issues[target.dataset.index].done = target.checked;
      target.closest(".sh-issue").classList.toggle("is-done", target.checked);
      commit();
    } else if (target.dataset.check !== undefined) {
      h.checks[target.dataset.check] = target.checked;
      commit();
    } else if (target.dataset.issue === "priority") {
      h.issues[target.dataset.index].priority = target.value;
      commit();
    } else if (target.name === "template") {
      const next = template(target.value);
      const filled = h.metrics.some(([, value]) => value);
      if (filled && !window.confirm(tx("Switch the numbers and checks to {name}? Values you typed in the numbers are cleared.", { name: next.name }))) {
        target.value = h.template;
        return;
      }
      h.template = target.value;
      h.metrics = next.metrics.map((label) => [label, "", ""]);
      h.checks = next.checklist.map(() => false);
      save();
      renderAll();
    }
  });

  form.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (button.dataset.remove === "metric") {
      cur().metrics.splice(index, 1);
      renderMetrics();
    } else {
      // Remove the one row and renumber the rows below it; rebuilding a long
      // list on every click is slow on phones.
      cur().issues.splice(index, 1);
      const rows = [...issuesBox.querySelectorAll(".sh-issue")];
      rows[index].remove();
      rows.slice(index + 1).forEach((row, k) => numberIssue(row, index + k));
      if (!cur().issues.length) issuesBox.append(noIssues());
      (issuesBox.querySelectorAll("[data-remove]")[Math.min(index, cur().issues.length - 1)] || form.querySelector("[data-add-issue]")).focus();
    }
    save();
    renderOutput();
  });

  form.querySelector("[data-add-metric]").addEventListener("click", () => {
    cur().metrics.push(["", "", ""]);
    save();
    renderMetrics();
    metricsBox.lastElementChild.querySelector("input").focus();
  });

  const fillStatus = form.querySelector("[data-fill-status]");
  form.querySelector("[data-fill-logs]").addEventListener("click", () => {
    const h = cur();
    const sources = template(h.template).sources || [];
    const totals = shiftTotals(h);
    let filled = 0;
    let kept = 0;
    let found = 0;
    template(h.template).metrics.forEach((label, i) => {
      const source = sources[i];
      if (!source) return;
      const value = fillValue(source, totals, h);
      if (!value) return;
      found++;
      let row = h.metrics.find(([name]) => name === label);
      if (!row) {
        row = [label, "", ""];
        h.metrics.push(row);
      }
      if (row[1].trim()) {
        kept++;
        return;
      }
      row[1] = value[0];
      row[2] = value[1];
      filled++;
    });
    if (!sources.some(Boolean)) {
      flashFill(tx("This template has no numbers that the logs can fill."));
      return;
    }
    if (!found) {
      flashFill(tx("No entries in the logs for {date}, {shift} shift. Damage Control, Incomplete Control and Delay Analyzer fill these numbers when they log this shift.", { date: longDate(h.date), shift: lower(h.shift) }));
      return;
    }
    save();
    renderMetrics();
    renderOutput();
    flashFill(filled
      ? `${tx(filled === 1 ? "Filled {n} number from the logs." : "Filled {n} numbers from the logs.", { n: filled })}${kept ? ` ${tx("{n} already typed stayed as they were.", { n: kept })}` : ""}`
      : tx("These numbers are already filled in. What you typed stays as it is."));
  });
  const flashFill = (message) => {
    fillStatus.textContent = message;
    clearTimeout(flashFill.timer);
    flashFill.timer = setTimeout(() => { fillStatus.textContent = ""; }, 6000);
  };

  form.querySelector("[data-add-issue]").addEventListener("click", () => {
    const issues = cur().issues;
    issues.push({ text: "", priority: MEDIUM, owner: "", due: "", done: false, carried: 0 });
    save();
    // Add just the new row; the ones above it stay as they are.
    if (issues.length === 1) issuesBox.replaceChildren();
    const row = issueRow(issues.at(-1), issues.length - 1);
    issuesBox.append(row);
    renderOutput();
    row.querySelector(".sh-issue-text").focus();
  });

  form.querySelector("[data-example]").addEventListener("click", () => {
    const ex = data.example;
    state.current = {
      ...blank(ex.template, ex.date, ex.shift),
      area: ex.area,
      from: ex.from,
      to: ex.to,
      metrics: ex.metrics.map((row) => [...row]),
      issues: ex.issues.map((issue) => ({ ...issue })),
      headsUp: ex.headsUp,
      safety: ex.safety,
      checks: [...ex.checks],
    };
    save();
    renderAll();
    output.scrollIntoView({ behavior: "smooth", block: "start" });
    output.focus({ preventScroll: true });
  });

  output.querySelector("[data-ack]").addEventListener("click", () => {
    const h = cur();
    if (!h.to.trim()) {
      note(tx("Name who takes over first."));
      form.elements.to.focus();
      return;
    }
    h.ackAt = new Date().toISOString();
    commit();
    note(tx("Confirmed by {name}.", { name: h.to }));
  });

  output.querySelector("[data-copy]").addEventListener("click", async () => {
    await copyText(asText(cur()));
    note(tx("Copied. Paste it into your team chat or email."));
  });

  output.querySelector("[data-print]").addEventListener("click", () => window.print());

  output.querySelector("[data-close]").addEventListener("click", () => {
    const h = cur();
    if (!hasContent(h)) {
      note(tx("There is nothing to close yet."));
      return;
    }
    const open = openIssues(h);
    if (!window.confirm(tx(open.length === 1 ? "Close the {shift} shift? It moves to the history, and {n} open issue carries over to the next handover." : "Close the {shift} shift? It moves to the history, and {n} open issues carry over to the next handover.", { shift: lower(h.shift), n: open.length }))) return;
    state.history.unshift({ closedAt: new Date().toISOString(), handover: JSON.parse(JSON.stringify(h)), text: asText(h) });
    state.history = state.history.slice(0, HISTORY_MAX);
    const next = nextShift(h);
    state.current = {
      ...blank(h.template, next.date, next.shift),
      area: h.area,
      from: h.to,
      metrics: h.metrics.map(([label]) => [label, "", ""]),
      issues: open.map((issue) => ({ ...issue, carried: (issue.carried || 0) + 1 })),
    };
    save();
    renderAll();
    note(tx(open.length === 1 ? "Started the {shift} shift handover with {n} carried issue." : "Started the {shift} shift handover with {n} carried issues.", { shift: lower(next.shift), n: open.length }));
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  output.querySelector("[data-clear]").addEventListener("click", () => {
    if (!window.confirm(tx("Clear this handover? The history stays."))) return;
    state.current = blank(cur().template, cur().date, cur().shift);
    save();
    renderAll();
  });

  historyBox.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-history]");
    if (!button) return;
    await copyText(state.history[Number(button.dataset.copyHistory)].text);
    button.textContent = tx("Copied");
    setTimeout(() => { button.textContent = tx("Copy as text"); }, 1600);
  });

  document.querySelector("[data-clear-history]").addEventListener("click", () => {
    if (!window.confirm(tx("Delete all earlier handovers on this device?"))) return;
    state.history = [];
    save();
    renderHistory();
  });

  if (!cur().date) cur().date = today();
  renderAll();
})();
