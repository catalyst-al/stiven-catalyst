// "Today": the pilot's work page (docs/plan-sot-2026-11-11/PLANI.md, step 6). It shows where the shift stands and
// leads on; it keeps nothing of its own.
//
// The shift is started and closed by the Shift Handover's own code, not by a copy of it: this page carries the
// handover (partials/shift-handover.njk, js/shift-handover.js) with its form and its sheet not shown. With no shift
// open, the panel in which the visitor chooses the shift and its date is the handover's own start panel; "Close the
// shift" here presses the handover's own button, with its question. So what is closed here is found closed on the
// Handover page, and the other way round.
//
// Opening the page only reads. It turns no pilot on, starts no shift, makes no shift active and moves no draft:
// drafts are listed with the shift they belong to and what can be said of them, by the rules of the pages that own
// them (js/shift-context.js, js/shift-close.js, js/defect-work.js), and are settled on Damage Control. The one thing
// the page writes itself is the active shift, when the visitor says to work in the shift the handover already has
// open. Where the pilot is off, or the workplace profile has shifts of its own, the page says so and shows nothing
// else. The operative date is the active shift's: after midnight it stays, and the page says so.
(() => {
  const root = document.querySelector("[data-today]");
  const dataEl = document.getElementById("today-data");
  if (!root || !dataEl || !window.ToolKit) return;
  const kit = window.ToolKit;
  const { tx, el, int, plural, showDate, today, lower } = kit;
  const data = JSON.parse(dataEl.textContent);
  const LIST = ["de", "sq"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
  const shifts = data.shifts;
  const NOT_RECORDED = tx("Not recorded");
  const PHASE_KEY = "sc-today-phase";

  const start = () => {
    const Close = window.ShiftClose;
    const Context = window.ShiftContext;
    const Store = window.ActionsStore;
    const Work = window.DefectWork;
    const offBox = root.querySelector("[data-today-off]");
    const cards = root.querySelector("[data-today-cards]");
    const status = root.querySelector("[data-today-status]");
    const handover = document.querySelector("[data-today-handover]");
    const box = (name) => root.querySelector(`[data-today-${name}]`);
    const url = (slug) => new URL(`../${slug}/`, window.location.href).href;
    const link = (label, slug, className = "button-secondary") => { const node = el("a", className, label); node.href = url(slug); return node; };
    const read = (key) => { try { return JSON.parse(window.localStorage.getItem(key)); } catch { return null; } };
    const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

    // Where the page works at all: the pilot on, and the page's shifts the only ones.
    const profileFits = () => { const own = window.Workplace ? window.Workplace.shifts() : []; return !own.length || (own.length === shifts.length && own.every((word, index) => word === shifts[index])); };
    const mode = () => (!Close || !Context || !Close.enabled() ? "off" : !profileFits() ? "profile" : "on");

    // The damage log of this page's language, the visitor's own rows.
    const damageRows = () => { const saved = read(data.damageKey); return isObject(saved) && Array.isArray(saved.rows) ? saved.rows.filter((row) => isObject(row) && row.example !== true) : []; };
    const units = (rows) => rows.reduce((sum, row) => sum + (Number(row.units) > 0 ? Math.round(Number(row.units)) : 1), 0);
    const entries = (n) => plural(n, tx("entry"), tx("entries"));
    const shiftText = (item) => `${item.label || item.shift} · ${showDate(item.date)}`;

    // Where the shift stands: the active shift of the device against the shift the handover has open.
    const standing = () => {
      const found = Context.activeOn(shifts, LIST);
      const { open, last } = Close.overview(LIST);
      const active = found.ok ? { date: found.active.date, label: found.label, index: found.index } : null;
      const working = active && open && open.date === active.date && open.shift === active.label;
      return { found, open, last, active, working: Boolean(working) };
    };
    const phaseOf = (active) => { let saved = null; try { saved = JSON.parse(window.sessionStorage.getItem(PHASE_KEY)); } catch { saved = null; } return isObject(saved) && saved.shift === `${active.date}|${active.label}` && ["start", "during", "end"].includes(saved.phase) ? saved.phase : "during"; };
    const setPhase = (active, phase) => { try { window.sessionStorage.setItem(PHASE_KEY, JSON.stringify({ shift: `${active.date}|${active.label}`, phase })); } catch { /* the choice lasts for this view */ } render(); };

    // ---- Now ----
    const renderNow = (now) => {
      const node = box("now");
      const { found, open, last, active, working } = now;
      if (working) {
        const phase = phaseOf(active);
        const head = el("div", "td-head");
        const group = el("div", "td-phase");
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", tx("Where the shift is"));
        [["start", "Start"], ["during", "During"], ["end", "End"]].forEach(([value, label]) => {
          const button = el("button", null, tx(label));
          button.type = "button";
          button.dataset.todayPhase = value;
          button.setAttribute("aria-pressed", String(value === phase));
          button.addEventListener("click", () => { setPhase(active, value); box("now").querySelector(`[data-today-phase="${value}"]`).focus(); });
          group.append(button);
        });
        head.append(el("p", "kicker", `${tx("Now")} · ${shiftText(active)}`), group);
        const parts = [head];
        // After midnight the operative date stays the shift's own.
        if (today() > active.date) {
          const note = el("p", "dl-warning td-midnight", tx("The calendar says {today}. The operative date stays {date} and the shift {shift} until you close the shift yourself; new entries get the operative date.", { today: showDate(today()), date: showDate(active.date), shift: active.label }));
          note.dataset.todayMidnight = "";
          parts.push(note);
        }
        const actions = el("div", "tool-actions");
        if (phase === "start") {
          parts.push(el("h2", null, tx("Read the last handover before the briefing.")), el("p", "form-note", tx("Then log the first damage where it happens.")));
          actions.append(link(tx("Open the Shift Handover"), "shift-handover", "button-primary"), link(tx("Log a damage"), "damage-control"));
        } else if (phase === "during") {
          parts.push(el("h2", null, tx("Log every damage where it happens.")), el("p", "form-note", tx("With its stage and its cause. When the shift ends, go to “End”.")));
          actions.append(link(tx("Log a damage"), "damage-control", "button-primary"));
        } else {
          const noOwner = Store ? Store.open().filter((action) => !action.owner).length : 0;
          const steps = el("ol", "td-steps");
          const step = (text, to) => { const item = el("li"); item.append(el("span", null, text), " ", to); steps.append(item); };
          step(tx("See the shift in one view"), link("Shift Pulse", "shift-pulse", "inline-link"));
          step(tx(noOwner === 1 ? "Every open action with an owner: {n} has none" : "Every open action with an owner: {n} have none", { n: int.format(noOwner) }), link(tx("Actions"), "action-tracker", "inline-link"));
          step(tx("Write the handover, or check it"), link(tx("Handover"), "shift-handover", "inline-link"));
          parts.push(el("h2", null, tx("Close the shift in three steps.")), steps);
          const close = el("button", "button-primary", tx("Close the {shift} shift", { shift: lower(active.label) }));
          close.type = "button";
          close.dataset.todayClose = "";
          // The handover's own button, with its own question: one way of closing.
          close.addEventListener("click", () => document.querySelector("[data-today-handover] [data-close]").click());
          actions.append(close);
        }
        parts.push(actions);
        node.replaceChildren(...parts);
        return;
      }
      const parts = [];
      if (open) {
        // The handover has a shift open that is not the active one of this device: the visitor says which they work in.
        parts.push(el("p", "kicker", tx("Before you start")), el("h2", null, tx("The Shift Handover has {shift} open.", { shift: shiftText(open) })));
        parts.push(el("p", "form-note", found.reason === "shift-unclear"
          ? tx("The shift this device was working in ({shift}) is not surely one of this page's shifts. Nothing is assumed: say that you work in the open shift, or close it on the Shift Handover page.", { shift: shiftText(found.active) })
          : found.ok ? tx("This device is set to another shift ({shift}). Nothing is assumed: say that you work in the open shift, or close it on the Shift Handover page.", { shift: shiftText(active) })
            : tx("No shift is active on this device. Nothing is assumed from the clock: say that you work in the open shift, or close it on the Shift Handover page.")));
        const actions = el("div", "tool-actions");
        const index = shifts.indexOf(open.shift);
        if (index >= 0) {
          const use = el("button", "button-primary", tx("Work in {shift}", { shift: shiftText(open) }));
          use.type = "button";
          use.dataset.todayUse = "";
          use.addEventListener("click", () => {
            const result = Context.setActive({ date: open.date, index, of: shifts.length, label: open.shift, list: LIST });
            if (!result.ok) status.textContent = tx("Not saved: the browser's storage did not take it. Nothing was changed.");
            render();
          });
          actions.append(use);
        }
        actions.append(link(tx("Open the Shift Handover"), "shift-handover"));
        parts.push(actions);
      } else {
        parts.push(el("p", "kicker", last ? tx("The shift is closed") : tx("Before you start")));
        parts.push(el("h2", null, last ? tx("{shift} is closed.", { shift: shiftText(last) }) : tx("Choose the shift and its operative date.")));
        parts.push(el("p", "form-note", tx("Every entry, number and handover belongs to a shift. The page does not guess it from the clock: start the shift in the panel below, with its date.")));
      }
      node.replaceChildren(...parts);
    };

    // ---- Needs attention ----
    const renderAttention = (now, drafts) => {
      const node = box("attention");
      const items = [];
      const item = (text, slug, tone = "warn") => { const line = el("li", `td-${tone}`); const to = el("a", "inline-link", text); to.href = url(slug); line.append(to); items.push(line); };
      if (Store) {
        const late = Store.overdue().length;
        const noOwner = Store.open().filter((action) => !action.owner).length;
        if (late) item(tx(late === 1 ? "{n} action is overdue" : "{n} actions are overdue", { n: int.format(late) }), "action-tracker", "bad");
        if (noOwner) item(tx(noOwner === 1 ? "{n} open action has no owner" : "{n} open actions have no owner", { n: int.format(noOwner) }), "action-tracker");
      }
      const unsure = drafts.filter((draft) => draft.state === "unconfirmed").length;
      if (unsure) item(tx(unsure === 1 ? "{n} form cannot be confirmed as stored: decide on Damage Control" : "{n} forms cannot be confirmed as stored: decide on Damage Control", { n: int.format(unsure) }), "damage-control", "bad");
      const list = el("ul", "td-list");
      list.append(...items);
      const more = el("p", "form-note");
      more.append(link(tx("All signals"), "signals", "inline-link"));
      node.replaceChildren(el("p", "kicker", tx("Needs attention")), items.length ? list : el("p", "form-note", tx("Nothing asks for attention in the action list or the unfinished forms.")), more);
    };

    // ---- The shift so far ----
    const renderSoFar = (now) => {
      const node = box("sofar");
      const parts = [el("p", "kicker", tx("The shift so far"))];
      if (!now.working) parts.push(el("p", "form-note", tx("Start a shift to see its numbers.")));
      else {
        const mine = damageRows().filter((row) => row.date === now.active.date && row.shift === now.active.label);
        const stat = el("p", "td-stat");
        stat.dataset.todayDamage = "";
        stat.append(el("strong", null, int.format(units(mine))), ` ${units(mine) === 1 ? data.one : data.many} · ${entries(mine.length)}`);
        parts.push(stat, el("p", "form-note", tx("Counted from the damage log for {shift}. The other numbers fill themselves in on the handover.", { shift: shiftText(now.active) })));
      }
      node.replaceChildren(...parts);
    };

    // ---- Continue: the tools with work in them, and the unfinished forms by shift ----
    // Each draft of the damage form with the shift it belongs to and what can be said of it. Nothing is moved here.
    const draftList = (now) => {
      const rows = damageRows();
      return Context.drafts().filter((draft) => draft.tool === data.damageKey && draft.form === "entry").sort((a, b) => b.updated - a.updated).map((draft) => {
        const place = Context.place(draft, shifts, LIST);
        const mine = now.working && place.state === "same" && draft.date === now.active.date && draft.label === now.active.label;
        const entry = Work && Work.entryState ? Work.entryState(draft, rows, kit, NOT_RECORDED) : "waiting";
        const shift = place.state !== "same" ? "unclear" : mine ? "this" : Close.shiftStatus(draft.list, draft.date, draft.label);
        return { draft, state: entry, shift };
      });
    };
    const renderContinue = (now, drafts) => {
      const node = box("continue");
      const list = el("ul", "td-list");
      const count = damageRows().length;
      const tool = el("li");
      const toolLink = link(`${data.tool} · ${entries(count)}`, "damage-control", "inline-link");
      tool.append(toolLink);
      list.append(tool);
      const SHIFT = {
        this: "of this shift",
        open: "its shift is open on the Shift Handover page",
        closed: "its shift is closed: there is no going back to it",
        none: "its shift is not open on the Shift Handover page",
        unclear: "its shift is not surely one of this page's shifts",
      };
      const ENTRY = {
        waiting: "unfinished form",
        entered: "already in the log; a copy of the form is still kept",
        unconfirmed: "it cannot be confirmed that this form was stored",
      };
      drafts.forEach(({ draft, state, shift }) => {
        const line = el("li", state === "unconfirmed" ? "td-bad" : "td-warn");
        line.dataset.todayDraft = `${draft.date}|${draft.label}`;
        line.dataset.todayDraftState = `${state}:${shift}`;
        const to = link(`${tx("Form from {shift}", { shift: shiftText(draft) })}`, "damage-control", "inline-link");
        line.append(to, ` · ${tx(ENTRY[state])} · ${tx(SHIFT[shift])}`);
        list.append(line);
      });
      const note = drafts.length ? tx("Unfinished forms are brought, entered or discarded on Damage Control; nothing is moved from here.") : tx("Tools with work in them show here.");
      node.replaceChildren(el("p", "kicker", tx("Continue")), list, el("p", "form-note", note));
    };

    const render = () => {
      const how = mode();
      offBox.hidden = how === "on";
      cards.hidden = how !== "on";
      if (handover) handover.hidden = how !== "on";
      if (how !== "on") {
        const parts = [el("p", "kicker", tx("Today")), el("h2", null, tx("This page is part of the pilot."))];
        parts.push(el("p", null, how === "off"
          ? tx("The pilot is not on, on this device, so there is nothing to show here. Nothing was turned on and nothing was changed.")
          : tx("The workplace profile has shifts of its own ({own}), and the pilot works with the shifts of this page ({page}). Nothing was changed.", { own: window.Workplace.shifts().join(", "), page: shifts.join(", ") })));
        const actions = el("div", "tool-actions");
        actions.append(link(tx("Open the Shift Handover"), "shift-handover"), link(data.tool, "damage-control"), link(tx("Actions"), "action-tracker"));
        parts.push(actions);
        offBox.replaceChildren(...parts);
        return;
      }
      const now = standing();
      const drafts = draftList(now);
      renderNow(now);
      renderAttention(now, drafts);
      renderSoFar(now);
      renderContinue(now, drafts);
    };

    // What the handover says while it closes or starts (its own status line is with its sheet, not shown here).
    const said = document.querySelector("[data-today-handover] [data-status]");
    if (said && typeof MutationObserver === "function") new MutationObserver(() => { if (said.textContent) status.textContent = said.textContent; }).observe(said, { childList: true, characterData: true, subtree: true });
    window.addEventListener("shift-context:changed", render);
    window.addEventListener("storage", render);
    window.addEventListener("pageshow", render);
    // Starting and closing happen in the handover's own code; the page follows.
    document.addEventListener("click", (event) => { if (event.target.closest("[data-today-handover], [data-today-close]")) window.setTimeout(render, 0); });
    render();
  };
  // The modules the page reads are loaded further down (js/shift-context.js): it starts once they are there.
  if (window.ShiftContext) start(); else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
