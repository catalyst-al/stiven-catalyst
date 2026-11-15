// The work view of Damage Control, for the pilot (window.DefectWork; docs/plan-sot-2026-11-11/PLANI.md, step 4). It is
// a view over the page that js/defect-log.js runs: the same log, the same rows, the same results. It adds no storage
// of its own and no way of its own to choose a shift, keep a draft or close a shift: the shift is the active shift of
// the device and the unfinished form is its draft (js/shift-context.js), and whether a shift is open or closed is what
// the handover says (js/shift-close.js).
//
// It is on only when all of this holds, and the page is otherwise exactly as it always was:
//   - the page asks for it (workUi in its data file: Damage Control alone, not Incomplete Control or the Night Audit
//     Log, which share the template);
//   - the device has the pilot on (ShiftClose.enabled(), the setting "sc-shift-close-ui");
//   - the shifts fit: the workplace profile has no shifts of its own, or the very shifts of this page in the same
//     order. With other shifts the view stays off and a note says why: the handover, the active shift and the drafts
//     work with the page's shifts.
//
// What it changes on the page. The form comes first and belongs to the active shift: the date and the shift are not
// asked, an entry gets the operative date and the shift of the active shift. With no active shift, or one that is
// not surely a shift of this page, there is no form: the page says so and points to the Shift Handover, where shifts
// are started. What is typed is kept as the draft of that shift at once, and comes back after a reload. An entry that
// is stored clears the draft; one that could not be stored leaves the form and the draft as they are, to try again.
// Drafts of other shifts are listed above the form with "Back to", "Bring here" and "Discard": going back is offered
// only for the shift the handover has open; bringing a draft here is refused while this form has work (both stay),
// and the draft is moved in one write, so it is never lost on the way. "Start here" follows the filter, the strip
// "Next step" has six ways on, none of them required, and each row of the log can become an action. An action carries
// where it comes from (origin: the period, the filter or the row; a row without an id as a copy of its fields with the
// number of rows that look the same). Three tabs sort the page: Work, Learn, Data.
window.DefectWork = (() => {
  const mount = (api) => {
    const { root, data, KEY, state, field, t, kit, entry, entryStatus, results, Workplace, UNKNOWN, NOT_RECORDED } = api;
    const { tx, el, int, pct, plural, lower, showDate, str, flash, parseNumber, dateSpan, trackerLink } = kit;
    const Close = window.ShiftClose;
    const Context = window.ShiftContext;
    const head = document.querySelector("[data-work-head]");
    const offNote = document.querySelector("[data-work-off]");
    if (!data.workUi || !Close || !Context || !head || !Close.enabled()) return null;

    const LIST = ["de", "sq"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
    const pageShifts = field.shift.options;
    const sameList = (a, b) => a.length === b.length && a.every((word, index) => word === b[index]);
    const profileFits = () => { const own = Workplace ? Workplace.shifts() : []; return !own.length || sameList(own, pageShifts); };
    if (!profileFits()) {
      if (offNote) {
        offNote.textContent = tx("The work view of the pilot is not shown here: the workplace profile has shifts of its own ({own}), and the pilot works with the shifts of this page ({page}). The page works as it always did.", { own: Workplace.shifts().join(", "), page: pageShifts.join(", ") });
        offNote.hidden = false;
      }
      return null;
    }
    // The profile's shifts changed while the page is open: the page is loaded again, on or off as they now say.
    if (Workplace) window.addEventListener("workplace:changed", () => { if (!profileFits()) window.location.reload(); });

    const form = entry.elements;
    const fieldOf = (input) => input.closest(".field");
    const units = (rows) => rows.reduce((sum, row) => sum + row.units, 0);
    const entriesText = (n) => plural(n, tx("entry"), tx("entries"));
    const handoverUrl = () => new URL("../shift-handover/", window.location.href).href;

    // ---- The page, sorted for work ----
    document.body.classList.add("dw-on");
    root.closest(".tool-layout").classList.add("dw-layout");
    head.hidden = false;
    document.querySelectorAll("[data-work-col]").forEach((node) => { node.hidden = false; });
    const draftsBox = el("div", "dw-drafts");
    const noShift = el("div", "dl-box dw-noshift");
    const mine = el("div", "dl-box dw-mine");
    const focus = el("div", "dl-box dw-focus");
    const next = el("div", "dl-box dw-next");
    entry.before(draftsBox, noShift);
    entry.after(mine, focus, next);

    // The form: no date and no shift (they are the active shift's); the type and the cost open on request.
    fieldOf(form.date).hidden = true;
    fieldOf(form.shift).hidden = true;
    const moreFields = [fieldOf(form.type), fieldOf(form.cost)];
    const submitButton = entry.querySelector('[type="submit"]');
    const moreButton = el("button", "button-secondary", tx("Type and cost"));
    moreButton.type = "button";
    moreButton.dataset.workMore = "";
    const clearButton = el("button", "button-secondary", tx("Clear the form"));
    clearButton.type = "button";
    clearButton.dataset.workClear = "";
    submitButton.after(moreButton, clearButton);
    const savedWith = el("p", "form-note dw-saved-with");
    savedWith.dataset.workSavedWith = "";
    entry.querySelector("fieldset").append(savedWith);
    const setMore = (open) => {
      moreFields.forEach((node) => { node.hidden = !open; });
      moreButton.setAttribute("aria-expanded", String(open));
    };
    const moreOpen = () => moreButton.getAttribute("aria-expanded") === "true";
    setMore(false);

    // ---- The unfinished form of the active shift ----
    let ctx = null; // where the form's draft belongs: the tool, the form and the active shift
    let ctxId = "";
    let rev = ""; // the rev of the stored draft this form was loaded from or last saved as
    let dirty = false; // something was typed since the form was last clean
    let conflict = null; // the stored draft changed under this form: { draft } until the visitor chooses
    let writing = false;
    const readForm = () => ({ stage: form.stage.value, cause: form.cause.value, units: form.units.value, note: form.note.value, ...(moreOpen() ? { more: "1", type: form.type.value, cost: form.cost.value } : {}) });
    const pick = (select, value) => { if ([...select.options].some((option) => option.value === value)) select.value = value; };
    const fillForm = (values) => {
      pick(form.stage, str(values.stage));
      pick(form.cause, str(values.cause));
      form.units.value = values.units === undefined || values.units === "" ? 1 : values.units;
      form.note.value = str(values.note);
      setMore(values.more === "1");
      if (values.more === "1") { pick(form.type, str(values.type)); form.cost.value = values.cost === undefined ? "" : values.cost; }
    };
    // Clean, as after an entry: the stage and the cause stay, the next entry is usually from the same place.
    const resetForm = () => { form.units.value = 1; form.note.value = ""; form.cost.value = ""; setMore(false); };
    const formText = (values) => [str(values.stage), str(values.cause), plural(Math.max(1, Math.round(parseNumber(String(values.units ?? 1))) || 1), t.one, t.many), str(values.note).trim()].filter(Boolean).join(" · ");
    const shiftText = (item) => `${item.label} · ${showDate(item.date)}`;
    const WHY = {
      locked: "The tools are locked with a PIN: nothing is kept until they are opened.",
      unsaved: "The browser's storage did not take it.",
      full: "Too many unfinished forms are kept already: discard one first.",
      invalid: "It could not be kept as it is.",
    };
    const why = (reason) => tx(WHY[reason] || WHY.unsaved);
    const say = (message) => { entryStatus.textContent = message; clearTimeout(entryStatus.timer); };

    const saveDraft = () => {
      if (!ctx || !dirty || conflict) return true;
      writing = true;
      const result = Context.save(ctx, readForm(), { base: rev });
      writing = false;
      if (result.ok) { rev = result.draft ? result.draft.rev : ""; return true; }
      if (result.reason === "changed") { conflict = { draft: result.draft || null }; renderDrafts(); return false; }
      say(tx("What you typed is still here, but it could not be kept as an unfinished form: {why}", { why: why(result.reason) }));
      return false;
    };
    const syncForm = () => {
      clearButton.hidden = !dirty;
      savedWith.textContent = ctx ? `${dirty ? `${tx("Unfinished form of this shift: what you typed stays here when you go to another page.")} ` : ""}${tx("Saved with {shift} (the operative date, not the calendar's).", { shift: shiftText(ctx) })}` : "";
    };
    const touched = () => {
      const was = dirty;
      dirty = true;
      saveDraft();
      syncForm();
      if (!was) renderDrafts();
    };
    entry.addEventListener("input", touched);
    entry.addEventListener("change", touched);
    moreButton.addEventListener("click", () => { setMore(!moreOpen()); touched(); (moreOpen() ? form.type : moreButton).focus(); });
    clearButton.addEventListener("click", () => {
      if (!ctx) return;
      writing = true;
      let result = Context.drop(ctx, { base: rev });
      if (!result.ok && result.reason === "changed") result = Context.drop(ctx, { base: result.draft ? result.draft.rev : "" });
      writing = false;
      if (!result.ok) { say(tx("The form could not be cleared: {why}", { why: why(result.reason) })); return; }
      rev = "";
      dirty = false;
      conflict = null;
      resetForm();
      syncForm();
      renderDrafts();
      form.stage.focus();
    });

    // ---- The drafts of other shifts ----
    const others = () => Context.drafts().filter((draft) => draft.tool === KEY && draft.form === "entry" && Context.identity(draft) !== ctxId).sort((a, b) => b.updated - a.updated);
    const contextOf = (draft) => ({ tool: draft.tool, form: draft.form, scope: draft.scope, date: draft.date, index: draft.index, of: draft.of, label: draft.label, list: draft.list });
    const button = (label, name, value) => { const node = el("button", "button-secondary", label); node.type = "button"; node.dataset[name] = value; return node; };
    const renderDrafts = () => {
      const notes = [];
      if (conflict) {
        const note = el("div", "dl-box dw-draft dw-conflict");
        note.append(el("p", null, tx("The unfinished form of this shift was changed somewhere else (another tab, or a file put back) while you typed here. Nothing was written over.")));
        const row = el("div", "tool-actions");
        if (conflict.draft) row.append(button(tx("Show the stored one"), "workConflict", "theirs"));
        row.append(button(tx("Keep what is typed here"), "workConflict", "mine"));
        note.append(row);
        notes.push(note);
      }
      others().forEach((draft) => {
        const id = Context.identity(draft);
        const status = Close.shiftStatus(draft.list, draft.date, draft.label);
        const note = el("div", "dl-box dw-draft");
        note.dataset.workDraft = `${draft.date}|${draft.label}`;
        const line = el("p");
        line.append(el("strong", null, tx("Unfinished form from {shift}:", { shift: shiftText(draft) })), ` ${formText(draft.values)}. ${tx("It was not brought to this shift.")}`);
        note.append(line);
        const row = el("div", "tool-actions");
        if (status === "open") row.append(button(tx("Back to {shift}", { shift: shiftText(draft) }), "workBack", id));
        if (ctx && !dirty) row.append(button(tx("Bring it to {shift}", { shift: shiftText(ctx) }), "workBring", id));
        row.append(button(tx("Discard"), "workDrop", id));
        note.append(row);
        if (status === "closed") note.append(el("p", "form-note", tx("That shift is closed: there is no going back to it.")));
        else if (status !== "open") note.append(el("p", "form-note", tx("That shift is not open on the Shift Handover page, so there is no going back to it from here.")));
        if (ctx && dirty) {
          const blocked = el("p", "form-note dw-blocked", tx("It cannot be brought here: {shift} has an unfinished form of its own ({form}). Both stay kept; finish or clear this form, then bring it.", { shift: shiftText(ctx), form: formText(readForm()) }));
          blocked.dataset.workBlocked = "";
          note.append(blocked);
        }
        notes.push(note);
      });
      draftsBox.replaceChildren(...notes);
    };
    draftsBox.addEventListener("click", (event) => {
      const node = event.target.closest("button");
      if (!node) return;
      if (node.dataset.workConflict) {
        const stored = conflict ? conflict.draft : null;
        if (node.dataset.workConflict === "theirs" && stored) fillForm(stored.values);
        rev = stored ? stored.rev : "";
        conflict = null;
        if (node.dataset.workConflict === "mine") saveDraft();
        syncForm();
        renderDrafts();
        form.stage.focus();
        return;
      }
      const id = node.dataset.workBack || node.dataset.workBring || node.dataset.workDrop;
      const draft = others().find((item) => Context.identity(item) === id);
      if (!draft) { renderDrafts(); return; }
      if (node.dataset.workBack) {
        // Only for the shift the handover has open: it becomes the active shift again, and the form shows its draft.
        if (Close.shiftStatus(draft.list, draft.date, draft.label) !== "open") { renderDrafts(); return; }
        const result = Context.setActive({ date: draft.date, index: draft.index, of: draft.of, label: draft.label, list: draft.list });
        if (!result.ok) say(tx("Not done: {why}", { why: why(result.reason) }));
        bind();
        if (!entry.hidden) form.stage.focus();
      } else if (node.dataset.workBring) {
        // One write moves the draft: it is under the other shift until it is under this one, never under neither. A
        // form with work here refuses it, and both stay.
        writing = true;
        const result = Context.move(contextOf(draft), ctx, { base: draft.rev, targetHasWork: dirty });
        writing = false;
        if (result.ok) {
          fillForm(result.draft.values);
          rev = result.draft.rev;
          dirty = true;
          say(tx("Brought here from {shift}.", { shift: shiftText(draft) }));
        } else {
          say(result.reason === "target-has-work" ? tx("Not brought: this shift has an unfinished form of its own. Both stay kept.")
            : result.reason === "changed" || result.reason === "missing" ? tx("Not brought: that form was changed somewhere else. Look at it again.")
              : tx("Not brought, and nothing was lost: {why}", { why: why(result.reason) }));
        }
        syncForm();
        renderDrafts();
        if (result.ok) form.stage.focus();
      } else {
        if (!window.confirm(tx("Discard the unfinished form from {shift}? What was typed in it is gone.", { shift: shiftText(draft) }))) return;
        writing = true;
        const result = Context.drop(contextOf(draft), { base: draft.rev });
        writing = false;
        if (!result.ok) say(tx("Not discarded: {why}", { why: result.reason === "changed" ? tx("that form was changed somewhere else. Look at it again.") : why(result.reason) }));
        renderDrafts();
        (draftsBox.querySelector("button") || (entry.hidden ? noShift.querySelector("a") : form.stage))?.focus();
      }
    });

    // ---- The active shift, and the form bound to it ----
    const renderMine = () => {
      mine.hidden = !ctx;
      if (!ctx) return;
      const rows = state.rows.filter((row) => row.date === ctx.date && row.shift === ctx.label);
      const list = el("ul", "sh-lines");
      rows.slice(-3).reverse().forEach((row) => list.append(el("li", null, `${row.stage} · ${row.cause}${row.note ? ` · ${row.note}` : ""} · ${int.format(row.units)}`)));
      mine.replaceChildren(el("p", "kicker", tx("In this shift: {units} in {entries}", { units: plural(units(rows), t.one, t.many), entries: entriesText(rows.length) })), rows.length ? list : el("p", "form-note", tx("None yet.")));
    };
    const bind = () => {
      const found = Context.activeOn(pageShifts, LIST);
      const wanted = found.ok ? { tool: KEY, form: "entry", scope: "", date: found.active.date, index: found.index, of: pageShifts.length, label: found.label, list: LIST } : null;
      const id = wanted ? Context.identity(wanted) : "";
      if (id !== ctxId) {
        // Another shift, or none: what was typed is the draft of the shift it was typed in (kept at each keystroke) and
        // does not come along. The form shows the draft of the shift it now belongs to, or starts clean.
        ctx = wanted;
        ctxId = id;
        conflict = null;
        const stored = ctx ? Context.find(ctx) : null;
        if (stored) { fillForm(stored.values); rev = stored.rev; dirty = true; } else { resetForm(); rev = ""; dirty = false; }
      } else if (ctx && !dirty) {
        const stored = Context.find(ctx);
        if (stored) { fillForm(stored.values); rev = stored.rev; dirty = true; }
      }
      entry.hidden = !ctx;
      noShift.hidden = Boolean(ctx);
      if (ctx) form.date.value = ctx.date;
      else {
        const link = el("a", "button-primary", tx("Open the Shift Handover"));
        link.href = handoverUrl();
        noShift.replaceChildren(
          el("p", "kicker", t.entryLegend),
          el("p", null, found.reason === "shift-unclear"
            ? tx("The shift this device is working in ({shift}) is not surely one of this page's shifts ({page}), so an entry has nowhere to go. Close that shift, or start one, on the Shift Handover page.", { shift: shiftText(found.active), page: pageShifts.join(", ") })
            : tx("No shift is active on this device, so an entry has nowhere to go. A shift is started on the Shift Handover page, with its date.")),
          link,
        );
      }
      syncForm();
      renderDrafts();
      renderMine();
    };
    window.addEventListener("shift-context:changed", () => { if (!writing) bind(); });
    window.addEventListener("storage", (event) => { if (event.key === null || [Context.ACTIVE_KEY, Context.DRAFTS_KEY].includes(event.key) || /^sc-shift-handover/.test(event.key)) bind(); });

    // ---- An entry ----
    // Stored first, then the draft goes. When the entry could not be stored the form and its draft stay as they are.
    const submit = () => {
      if (!ctx) return;
      const count = Math.round(parseNumber(form.units.value));
      if (!(count > 0)) { form.units.focus(); flash(entryStatus, tx("Enter at least one {one}.", { one: t.one })); return; }
      const open = moreOpen();
      const cost = open ? parseNumber(form.cost.value) : NaN;
      const row = { date: ctx.date, shift: ctx.label, stage: form.stage.value, type: open ? form.type.value : NOT_RECORDED, cause: form.cause.value, units: count, cost: cost >= 0 ? cost : null, note: form.note.value.trim() };
      if (!api.addNow(row)) {
        dirty = true;
        saveDraft();
        syncForm();
        say(tx("Not added: the browser's storage did not take the entry. What you typed is still in the form; try again."));
        submitButton.focus();
        return;
      }
      let cleared = { ok: true };
      if (dirty || rev) {
        writing = true;
        cleared = Context.drop(ctx, { base: rev });
        if (!cleared.ok && cleared.reason === "changed") cleared = Context.drop(ctx, { base: cleared.draft ? cleared.draft.rev : "" });
        writing = false;
      }
      rev = "";
      dirty = false;
      conflict = null;
      resetForm();
      syncForm();
      renderDrafts();
      const added = tx("Added {count} at {stage}.", { count: plural(count, t.one, t.many), stage: row.stage });
      if (cleared.ok) flash(entryStatus, added);
      else say(`${added} ${tx("The unfinished form could not be cleared; discard it by hand if it shows again.")}`);
      form.stage.focus();
    };

    // ---- Where an action comes from ----
    const range = () => {
      const span = dateSpan(api.periodRows());
      const from = state.from || (span ? span.from : "");
      return { from, to: state.to || (span ? span.to : "") || from };
    };
    const origin = (kind, extra = {}) => {
      const { from, to } = range();
      return from && to ? { v: 1, tool: "damage-control", lang: LIST, kind, from, to, ...extra } : null;
    };
    // How many rows of the log look the same as this one, field for field (an id aside): 1 when it is the only one.
    const twinsOf = (row) => state.rows.filter((other) => kit.rowKey(other, ["id"]) === kit.rowKey(row, ["id"])).length;
    const rowAction = (row) => {
      const from = row.date || "";
      const source = from ? { v: 1, tool: "damage-control", lang: LIST, kind: "row", from: state.from && state.from <= from ? state.from : from, to: state.to && state.to >= from ? state.to : from, row: { id: str(row.id), date: row.date, shift: row.shift, stage: row.stage, cause: row.cause, units: row.units, twins: twinsOf(row) } } : null;
      return {
        title: tx("Countermeasure for: {problem}", { problem: `${[showDate(row.date), row.shift, row.stage, row.cause].filter(Boolean).join(" · ")}: ${plural(row.units, t.one, t.many)}` }),
        priority: "High",
        ...(row.note ? { detail: row.note } : {}),
        ...(source ? { origin: source } : {}),
      };
    };
    const rowCell = (row) => {
      const cell = el("td");
      const link = trackerLink(tx("Action"), () => rowAction(row), "dw-row-action");
      // The name starts with the word the link shows, then says which entry it is for.
      link.setAttribute("aria-label", `${tx("Action")}: ${[showDate(row.date), row.stage, row.cause].filter(Boolean).join(", ")}`);
      cell.append(link);
      return cell;
    };

    // ---- The head, "Start here" and "Next step" ----
    const chips = head.querySelector("[data-work-chips]");
    const sentence = (result, picked) => {
      const rows = picked ? result.rows.filter((row) => (row[picked.field] || NOT_RECORDED) === picked.value) : result.rows;
      const part = units(rows);
      if (!part) return "";
      const stage = api.top(rows, "stage")[0];
      const cause = api.top(rows, "cause")[0];
      const parts = [];
      if (!picked || picked.field !== "stage") parts.push(tx("most at {stage} ({a} of {b})", { stage: stage.key, a: int.format(stage.value), b: int.format(part) }));
      if (!picked || picked.field !== "cause") parts.push(tx("mostly {cause} ({a} of {b})", { cause: lower(cause.key), a: int.format(cause.value), b: int.format(part) }));
      const name = api.periodName(result.rows);
      const what = picked
        ? tx("{field} {value}: {a} of {b} {many} ({pct})", { field: field[picked.field].label, value: picked.value, a: int.format(part), b: int.format(result.total), many: t.many, pct: pct(part / result.total, 0) })
        : plural(result.total, t.one, t.many);
      return `${name ? `${name} · ` : ""}${what}; ${parts.join(", ")}.`;
    };
    const scope = (result, picked) => {
      const rows = picked ? result.rows.filter((row) => (row[picked.field] || NOT_RECORDED) === picked.value) : result.rows;
      const all = tx("all");
      const of = (name) => (picked && picked.field === name ? picked.value : all);
      return [
        `${tx("Period")}: ${api.periodName(result.rows) || all}`,
        `${field.shift.label}: ${of("shift")}`,
        `${field.stage.label}: ${of("stage")}`,
        `${field.cause.label}: ${of("cause")}`,
        tx("{a} of {b}", { a: int.format(rows.length), b: entriesText(result.rows.length) }),
        tx("{a} of {b} units", { a: int.format(units(rows)), b: int.format(result.total) }),
      ];
    };
    const floorCheck = document.querySelector("[data-floor-check]");
    const render = () => {
      renderMine();
      const picked = api.picked();
      const rows = state.rows.length ? api.periodRows() : [];
      const result = rows.length ? api.analyse() : null;

      // The head: the period, the rate against the target, the filter.
      const parts = [];
      if (result) {
        parts.push(el("span", "dw-chip", api.periodName(result.rows) || tx("All entries")));
        if (result.rate !== null) {
          const gap = result.target ? result.total - Math.floor(result.target * result.volume) : 0;
          const rate = el("span", "dw-rate");
          rate.append(el("strong", null, pct(result.rate, 2)), `${picked ? ` ${tx("of the whole period")}` : ""}${result.target ? ` · ${tx("target {pct}", { pct: pct(result.target, 2) })} · ` : ""}`);
          if (result.target) rate.append(el("span", gap > 0 ? "dw-over" : "dw-in", gap > 0 ? tx("{n} over", { n: int.format(gap) }) : tx("inside")));
          parts.push(rate);
        }
        if (picked) {
          const part = units(result.rows.filter((row) => (row[picked.field] || NOT_RECORDED) === picked.value));
          const chip = el("button", "ci-chip");
          chip.type = "button";
          chip.dataset.focusKey = "work-filter";
          chip.dataset.workFilter = "";
          const text = `${field[picked.field].label} = ${picked.value} · ${tx("{a} of {b} units", { a: int.format(part), b: int.format(result.total) })}`;
          chip.setAttribute("aria-label", `${text}. ${tx("Clear the filter: {value}", { value: picked.value })}`);
          const x = el("span", "ci-chip-x", "×");
          x.setAttribute("aria-hidden", "true");
          chip.append(el("span", null, text), x);
          chip.addEventListener("click", api.clearPick);
          parts.push(chip);
        }
      }
      chips.replaceChildren(...parts);

      // "Start here": the sentence follows the filter; the lists filter.
      focus.replaceChildren(el("p", "kicker", tx("Start here")));
      if (!state.rows.length) {
        const example = el("button", "button-secondary", tx("Load an example week"));
        example.type = "button";
        example.addEventListener("click", () => root.querySelector("[data-example]").click());
        focus.append(el("h2", null, t.empty), el("p", "form-note", tx("After the first entry this shows the rate, the main causes and the stage to start at.")), example);
      } else if (!result) {
        focus.append(el("p", null, tx("No entries in this period. Choose another period or All.")));
      } else {
        const line = el("p", "dw-problem");
        line.dataset.workProblem = "";
        line.append(el("strong", null, sentence(result, picked)));
        focus.append(line);
        if (result.unknownShare > 0.15) focus.append(el("p", "dl-warning", `${tx("{pct} of {many} have no known cause.", { pct: pct(result.unknownShare, 0), many: t.many })} ${tx("Check on the floor before the analysis.")}`));
        const list = (title, items, name) => { focus.append(el("p", "result-label", title), api.bars(items, result.total, api.pickOptions(name))); };
        list(tx("{label} · choose one to filter", { label: field.cause.label }), result.causes.slice(0, 5), "cause");
        list(field.stage.label, api.top(result.rows, "stage").slice(0, 4), "stage");
        list(field.shift.label, result.shifts, "shift");
        focus.append(el("p", "form-note", tx("Shares are of the whole period. One filter at a time.")));
      }

      // "Next step": six ways on, none required, each saying what it carries.
      next.hidden = !result;
      if (!result) return;
      const problem = sentence(result, picked);
      const suggested = picked && picked.field === "cause" && (picked.value === UNKNOWN || picked.value === NOT_RECORDED) ? "floor" : picked && picked.field === "cause" ? "action" : picked ? "whys" : "";
      const way = (kind, node) => {
        node.dataset.workExit = kind;
        if (kind === suggested) { node.classList.add("dw-rec"); node.append(` · ${tx("suggested")}`); }
        return node;
      };
      const action = trackerLink(picked ? tx("Action for {value}", { value: picked.value }) : tx("Action for the period"), () => {
        const now = api.picked();
        const source = now ? origin("filter", { filter: { field: now.field, value: now.value } }) : origin("period");
        return { title: tx("Countermeasure for: {problem}", { problem }), priority: "High", ...(source ? { origin: source } : {}) };
      });
      const whys = el("a", "button-secondary", tx("Why? (5 Whys)"));
      const whysUrl = new URL(document.querySelector("a[data-five-whys]")?.href || new URL("../five-whys/", window.location.href));
      whysUrl.searchParams.set("problem", problem);
      whys.href = whysUrl.href;
      const floor = el("button", "button-secondary", tx("Check on the floor"));
      floor.type = "button";
      floor.addEventListener("click", () => { show("work"); floorCheck.scrollIntoView({ behavior: "smooth", block: "start" }); floorCheck.querySelector("input")?.focus({ preventScroll: true }); });
      const chartData = api.controlChart(result);
      const chart = el("a", "button-secondary", tx("Noise or change?"));
      chart.href = new URL("../sigma-control-chart/", window.location.href).href;
      chart.addEventListener("click", () => { if (chartData) { try { sessionStorage.setItem("sc-sigma-handoff", JSON.stringify(chartData)); } catch { /* the chart opens as it was */ } } });
      const pareto = el("a", "button-secondary", tx("For the meeting (Pareto)"));
      pareto.href = new URL("../pareto/", window.location.href).href;
      pareto.addEventListener("click", () => { try { sessionStorage.setItem("sc-pareto-handoff", JSON.stringify(api.paretoTable())); } catch { /* the page opens empty */ } });
      const handover = el("a", "button-secondary", tx("To the handover"));
      handover.href = handoverUrl();
      const row = el("div", "tool-actions");
      row.append(way("action", action), way("whys", whys), way("floor", floor), way("chart", chart), way("pareto", pareto), way("handover", handover));
      const carry = el("p", "form-note dw-carry");
      carry.dataset.workCarry = "";
      carry.append(`${tx("Carries")}: `);
      scope(result, picked).forEach((text, index) => carry.append(index ? " · " : "", el("strong", null, text)));
      const notes = [tx("The action carries the period and the filter; 5 Whys the sentence above; Pareto and the control chart the entries of the period. The handover carries nothing: its numbers come from this log by themselves.")];
      if (!chartData) notes.push(tx("The control chart needs the volume of at least two days (Data)."));
      next.replaceChildren(el("p", "kicker", tx("Next step, as the situation asks")), row, carry, el("p", "form-note", notes.join(" ")));
      // With a filter on, the ways on come before the form, as the reason the filter was chosen.
      if (picked) draftsBox.before(next); else focus.after(next);
    };

    // ---- Work · Learn · Data ----
    const tabs = [...head.querySelectorAll("[data-work-tab]")];
    const dataBox = el("div", "dl-box dw-data");
    const backup = el("a", "inline-link", tx("One file of all your work, the restore points and the PIN lock"));
    backup.href = "#work-backup-title";
    const backupLine = el("p", "form-note");
    backupLine.append(backup, ` ${tx("are further down this page.")}`);
    const exportActions = root.querySelector("[data-csv]").closest(".tool-actions");
    dataBox.append(el("p", "kicker", tx("Export and clear")), exportActions, backupLine);
    root.append(dataBox);
    const panes = {
      work: [draftsBox, noShift, entry, mine, focus, next, root.querySelector("[data-log]").closest(".dl-box"), results, floorCheck],
      learn: [root.closest(".tool-layout").querySelector(".tool-aside")],
      data: [root.querySelector(".dl-paste"), root.querySelector("[data-range]").closest(".dl-box"), root.querySelector("[data-volumes]"), root.querySelector("[data-annotations]"), dataBox],
    };
    function show(name) {
      Object.entries(panes).forEach(([pane, nodes]) => nodes.forEach((node) => node && node.classList.toggle("dw-off", pane !== name)));
      tabs.forEach((tab) => { const on = tab.dataset.workTab === name; tab.setAttribute("aria-selected", String(on)); tab.tabIndex = on ? 0 : -1; });
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => show(tab.dataset.workTab));
      tab.addEventListener("keydown", (event) => {
        const to = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
        if (to === null) return;
        event.preventDefault();
        const target = tabs[(to + tabs.length) % tabs.length];
        show(target.dataset.workTab);
        target.focus();
      });
    });
    show("work");
    bind();
    // What was typed is kept before the page goes, whatever else happens.
    window.addEventListener("pagehide", saveDraft);
    return { render, submit, rowCell };
  };
  // The modules the view stands on are on the page (the one for the active shift is loaded after the tool's own).
  const ready = () => Boolean(window.ShiftContext && window.ShiftClose);
  return { mount, ready };
})();
