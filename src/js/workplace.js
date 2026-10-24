// The workplace profile (window.Workplace): one site, its shifts, its areas with their owners, its teams and the
// targets of its KPIs, kept once in this browser (sc-workplace, the same in every language) and read by the tools
// that need them: the 5S audit offers the areas, the daily board draws the targets, the skills matrix knows the
// teams. Nothing here is required: a tool without a profile works as before, with what is typed into it.
// renderSetup(container, options) draws the small form that edits the profile wherever a tool wants it.
window.Workplace = (() => {
  const kit = window.ToolKit || {};
  const tx = kit.tx || ((text) => text);
  const KEY = "sc-workplace";
  const DEFAULTS = { site: "", shifts: [], areas: [], teams: [], targets: {} };
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const list = (value) => (Array.isArray(value) ? value.map(str).filter(Boolean) : []);
  const clean = (saved) => {
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return { ...DEFAULTS, areas: [], shifts: [], teams: [], targets: {} };
    const areas = Array.isArray(saved.areas) ? saved.areas.map((area) => (typeof area === "string" ? { name: str(area), owner: "" } : { name: str(area?.name), owner: str(area?.owner) })).filter((area) => area.name) : [];
    const targets = {};
    if (saved.targets && typeof saved.targets === "object") Object.entries(saved.targets).forEach(([key, value]) => { const n = Number(String(value).replace(",", ".")); if (/^[a-z0-9-]+$/i.test(key) && Number.isFinite(n)) targets[key] = n; });
    return { site: str(saved.site), shifts: list(saved.shifts), areas, teams: list(saved.teams), targets };
  };
  const get = () => {
    try { return clean(JSON.parse(localStorage.getItem(KEY))); } catch { return clean(null); }
  };
  const set = (patch) => {
    const next = clean({ ...get(), ...patch });
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable: the page keeps working */ }
    window.dispatchEvent(new CustomEvent("workplace:changed", { detail: next }));
    return next;
  };
  const areas = () => get().areas;
  const shifts = () => get().shifts;
  const teams = () => get().teams;
  const target = (key, fallback = null) => { const value = get().targets[key]; return Number.isFinite(value) ? value : fallback; };
  const isEmpty = (profile = get()) => !profile.site && !profile.shifts.length && !profile.areas.length && !profile.teams.length && !Object.keys(profile.targets).length;

  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const field = (id, label, input, note) => {
    const box = el("div", "field");
    const lab = el("label", null, label);
    lab.htmlFor = id;
    input.id = id;
    box.append(lab, input);
    if (note) box.append(el("span", "form-note", note));
    return box;
  };
  // The form: site, shifts (comma separated), areas (one per line, "Area · Owner"), teams, and the targets the tool asks
  // for (options.targets: [{ key, label, unit, placeholder }]). options.show limits the parts: ["site", "shifts", "areas", "teams", "targets"].
  const renderSetup = (container, options = {}) => {
    if (!container) return () => {};
    const show = new Set(options.show || ["site", "shifts", "areas", "teams", "targets"]);
    const prefix = options.prefix || "wp";
    container.replaceChildren();
    const box = el("div", "wp-setup");
    const grid = el("div", "wp-grid");
    const profile = get();
    const inputs = {};
    const text = (name, value, placeholder, rows) => {
      const input = el(rows ? "textarea" : "input");
      if (rows) input.rows = rows; else input.type = "text";
      input.value = value;
      input.placeholder = placeholder || "";
      input.autocomplete = "off";
      inputs[name] = input;
      return input;
    };
    if (show.has("site")) grid.append(field(`${prefix}-site`, tx("Site or department"), text("site", profile.site, tx("e.g. Frankfurt hub, outbound"))));
    if (show.has("shifts")) grid.append(field(`${prefix}-shifts`, tx("Shifts"), text("shifts", profile.shifts.join(", "), tx("e.g. Early, Late, Night")), tx("Comma separated.")));
    if (show.has("teams")) grid.append(field(`${prefix}-teams`, tx("Teams"), text("teams", profile.teams.join(", "), tx("e.g. Inbound, Picking, Loading")), tx("Comma separated.")));
    if (show.has("areas")) {
      const area = field(`${prefix}-areas`, tx("Areas and their owners"), text("areas", profile.areas.map((a) => (a.owner ? `${a.name} · ${a.owner}` : a.name)).join("\n"), tx("One per line: Dock 1 · Anna"), 4), tx("One area per line; the owner after a middle dot or a dash."));
      area.classList.add("wp-wide");
      grid.append(area);
    }
    box.append(grid);
    if (show.has("targets") && options.targets?.length) {
      box.append(el("p", "kicker", tx("Targets")));
      const tgrid = el("div", "wp-grid wp-targets");
      options.targets.forEach((item) => {
        const input = el("input");
        input.type = "number";
        input.step = "any";
        input.inputMode = "decimal";
        input.placeholder = item.placeholder || "";
        input.value = Number.isFinite(profile.targets[item.key]) ? String(profile.targets[item.key]) : "";
        inputs[`target:${item.key}`] = input;
        tgrid.append(field(`${prefix}-target-${item.key}`, item.unit ? `${item.label} (${item.unit})` : item.label, input));
      });
      box.append(tgrid);
    }
    const status = el("p", "form-note", "");
    status.setAttribute("aria-live", "polite");
    box.append(status);
    container.append(box);
    const splitList = (value) => value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
    const read = () => {
      const patch = {};
      if (inputs.site) patch.site = inputs.site.value;
      if (inputs.shifts) patch.shifts = splitList(inputs.shifts.value);
      if (inputs.teams) patch.teams = splitList(inputs.teams.value);
      if (inputs.areas) patch.areas = inputs.areas.value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [name, owner = ""] = line.split(/\s[·–-]\s|\s·\s|·/).map((s) => s.trim()); return { name, owner }; });
      const targets = { ...get().targets };
      Object.entries(inputs).filter(([name]) => name.startsWith("target:")).forEach(([name, input]) => {
        const key = name.slice(7);
        const n = Number(String(input.value).replace(",", "."));
        if (input.value.trim() === "" || !Number.isFinite(n)) delete targets[key]; else targets[key] = n;
      });
      patch.targets = targets;
      return patch;
    };
    let timer;
    Object.values(inputs).forEach((input) => input.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        set(read());
        status.textContent = tx("Saved in this browser.");
        clearTimeout(status.timer);
        status.timer = setTimeout(() => { status.textContent = ""; }, 1800);
        options.onChange?.(get());
      }, 250);
    }));
    return () => get();
  };
  // <option>s for a <select>, from the profile's areas or shifts, keeping a current value that is not in the list.
  const fillSelect = (select, values, current) => {
    if (!select) return;
    const list = [...new Set([...values, ...(current ? [current] : [])])];
    select.replaceChildren(...list.map((value) => { const option = document.createElement("option"); option.value = value; option.textContent = value; option.selected = value === current; return option; }));
  };

  return { KEY, get, set, areas, shifts, teams, target, isEmpty, renderSetup, fillSelect };
})();
