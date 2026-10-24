// Events on the timeline (window.Annotations): "new stacking standard from 12 Oct", "second loader on the night shift".
// One list for every tool and every language, like the actions (sc-actions), stored as { rows: [...] } in
// "sc-annotations". An event belongs to some tools (tools: their slugs) or to all of them (tools: []). The trend charts
// draw each event as a line on its day, and the Sigma & Control Chart can split its limits there.
// Nothing leaves the browser.
window.Annotations = (() => {
  const KEY = "sc-annotations";
  const kit = window.ToolKit || {};
  const tx = kit.tx || ((text, vars = {}) => text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match)));
  const isDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
  const MAX_TEXT = 160;

  // Only rows of the expected shape are kept: a damaged entry must not break a chart.
  const clean = (row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const date = typeof row.date === "string" ? row.date.trim() : "";
    const text = typeof row.text === "string" ? row.text.trim().slice(0, MAX_TEXT) : "";
    if (!isDate(date) || !text) return null;
    const tools = Array.isArray(row.tools) ? [...new Set(row.tools.filter((slug) => typeof slug === "string" && /^[a-z0-9-]{1,64}$/.test(slug)))] : [];
    const id = typeof row.id === "string" && row.id ? row.id.slice(0, 40) : `${date}-${text.length}`;
    return { id, date, text, tools };
  };
  const all = () => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { saved = null; }
    const rows = saved && Array.isArray(saved.rows) ? saved.rows.map(clean).filter(Boolean) : [];
    return rows.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  };
  // Saving must never throw (a private window, a full storage); the change then lasts until the page closes.
  let memory = null;
  const store = (rows) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ rows }));
      memory = null;
      return true;
    } catch {
      memory = rows;
      return false;
    }
  };
  const rowsNow = () => memory || all();
  const changed = () => window.dispatchEvent(new CustomEvent("annotations:changed"));

  // The events between from and to (either may be empty: open) that belong to the tool `slug`, or to every tool.
  const list = (from = "", to = "", slug = "") => rowsNow().filter((row) => (!from || row.date >= from) && (!to || row.date <= to)
    && (!slug || !row.tools.length || row.tools.includes(slug)));
  let counter = 0;
  const add = ({ date, text, tools = [] } = {}) => {
    const id = `${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const row = clean({ id, date, text, tools });
    if (!row) return null;
    store([...rowsNow(), row]);
    changed();
    return row;
  };
  const remove = (id) => {
    const rows = rowsNow();
    const left = rows.filter((row) => row.id !== id);
    if (left.length === rows.length) return false;
    store(left);
    changed();
    return true;
  };
  // Another tab added or removed an event.
  window.addEventListener?.("storage", (event) => { if (event.key === KEY || event.key === null) changed(); });

  // The form "Mark a change on the timeline" (partials/annotations-form.njk) in a tool: it adds events for this tool
  // (or for all, with the box ticked) and lists the ones this tool shows, each with a remove button.
  const mount = (box, slug) => {
    if (!box || !kit.el) return;
    const { el, showDate, parseDate, today, flash } = kit;
    const form = box.querySelector("[data-annotation-form]");
    const listNode = box.querySelector("[data-annotation-list]");
    const status = box.querySelector("[data-annotation-status]");
    const render = () => {
      const rows = list("", "", slug);
      listNode.replaceChildren();
      listNode.hidden = !rows.length;
      [...rows].reverse().forEach((row) => {
        const item = el("li", "an-item");
        item.append(el("strong", "nowrap", showDate(row.date)), " ", el("span", null, row.text));
        if (!row.tools.length) item.append(" ", el("span", "dl-tag", tx("All tools")));
        const button = el("button", "dl-remove", "×");
        button.type = "button";
        button.dataset.removeAnnotation = row.id;
        button.setAttribute("aria-label", tx("Remove {name}", { name: `${showDate(row.date)} ${row.text}` }));
        item.append(" ", button);
        listNode.append(item);
      });
    };
    form.elements.andate.value = today();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const date = parseDate(form.elements.andate.value);
      const text = form.elements.antext.value.trim();
      if (!date || !text) {
        flash(status, tx("Enter the date and what changed."));
        (date ? form.elements.antext : form.elements.andate).focus();
        return;
      }
      add({ date, text, tools: form.elements.anall.checked ? [] : [slug] });
      form.elements.antext.value = "";
      flash(status, tx("Marked {date}: {text}.", { date: showDate(date), text }));
      form.elements.antext.focus();
    });
    listNode.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-annotation]");
      if (!button) return;
      remove(button.dataset.removeAnnotation);
      (listNode.querySelector("[data-remove-annotation]") || form.elements.antext).focus();
    });
    window.addEventListener("annotations:changed", render);
    render();
  };

  // The address of the tool, as the event lists it: /de/tools/damage-control/ is "damage-control".
  const slugHere = () => window.location.pathname.split("/").filter(Boolean).pop() || "";

  return { KEY, clean, all, list, add, remove, mount, slugHere };
})();
