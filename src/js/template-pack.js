// Template packs: a team's own checklist, standard or task list as a file of its own, so another site opens it in the
// same tool. A pack is plain JSON, { format, version, tool, kind, name, lang, created, data }; the tool says what its
// data is (kind) and cleans it on the way in (validate), so a file never reaches the page unchecked. Nothing is sent:
// the file is made and read in this browser. ui() draws the two buttons and the status line; checklist() adds the
// "copy this template and edit it" pattern of the audit tools on top. Loads after tool-kit.js.
window.TemplatePack = (() => {
  const FORMAT = "stiven-catalyst-template";
  const VERSION = 1;
  // A checklist is a few kilobytes; two megabytes is far beyond any template and keeps a wrong file from hanging the page.
  const MAX_BYTES = 2 * 1024 * 1024;
  const kit = window.ToolKit || {};
  const tx = kit.tx || ((text, vars = {}) => text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match)));
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text) => {
    const node = el("button", className, text);
    node.type = "button";
    return node;
  };

  // The file name: <tool>-<name>.json, the name folded to plain letters so every system can store it.
  const slug = (value) => String(value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48).replace(/-+$/, "");
  const fileNameOf = (tool, name, kind) => `${slug(tool) || "tool"}-${slug(name) || slug(kind) || "template"}.json`;
  const sizeOf = (text) => (typeof Blob === "function" ? new Blob([text]).size : text.length);

  const pack = ({ tool, kind, name = "", lang = kit.LANG || "en", data, created = new Date().toISOString() } = {}) => {
    const file = { format: FORMAT, version: VERSION, tool: str(tool), kind: str(kind), name: str(name).trim(), lang: str(lang), created, data };
    const text = `${JSON.stringify(file, null, 2)}\n`;
    return { file, text, fileName: fileNameOf(tool, name, kind), size: sizeOf(text) };
  };

  const MESSAGES = {
    damaged: "This file is damaged or incomplete. Ask for it again.",
    large: "This file is larger than 2 MB, too large for a template.",
    format: "This is not a template file of this site.",
    version: "This template file comes from a newer version of the tool. Reload the page and try again.",
    tool: "This template file belongs to another tool ({tool}). Open it there.",
    kind: "This template file holds something this tool does not open here.",
    content: "This template file holds nothing this tool can use.",
  };
  const fail = (error, vars) => ({ ok: false, error, message: tx(MESSAGES[error], vars) });

  // The data of a pack, or a clear reason why not. legacy() may accept an older file of the tool that has no pack
  // around it (the FMEA saved its sheets that way); it gets the parsed JSON and returns the data or null.
  const read = (text, { tool, kind, validate, legacy } = {}) => {
    if (typeof text !== "string" || !text.trim()) return fail("damaged");
    if (sizeOf(text) > MAX_BYTES) return fail("large");
    let raw;
    try { raw = JSON.parse(text.replace(/^﻿/, "")); } catch { return fail("damaged"); }
    if (!isObject(raw) || raw.format !== FORMAT) {
      const old = legacy && isObject(raw) ? legacy(raw) : null;
      return old ? { ok: true, data: old, legacy: true, tool, kind, name: "", lang: "", created: "" } : fail("format");
    }
    if (!Number.isInteger(raw.version) || raw.version < 1 || !("data" in raw)) return fail("damaged");
    if (raw.version > VERSION) return fail("version");
    if (tool && raw.tool !== tool) return fail("tool", { tool: str(raw.tool).slice(0, 40) || "?" });
    if (kind && raw.kind !== kind) return fail("kind");
    let data;
    try { data = validate ? validate(raw.data) : raw.data; } catch { data = null; }
    if (data === null || data === undefined || data === false) return fail("content");
    return { ok: true, data, tool: raw.tool, kind: raw.kind, name: str(raw.name).slice(0, 120), lang: str(raw.lang).slice(0, 8), created: str(raw.created).slice(0, 40) };
  };

  const download = (packed) => {
    const link = el("a");
    link.href = URL.createObjectURL(new Blob([packed.text], { type: "application/json" }));
    link.download = packed.fileName;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  // Packs and downloads; tests replace api.download to catch the file.
  const save = (options) => {
    const packed = pack(options);
    api.download(packed);
    return packed;
  };
  // A chosen file through read(); a file over the limit is refused before it is read at all.
  const readFile = (file, options, done) => {
    if (!file) return;
    if (file.size > MAX_BYTES) { done(fail("large")); return; }
    const reader = new FileReader();
    reader.onload = () => done(read(String(reader.result), options));
    reader.onerror = () => done(fail("damaged"));
    reader.readAsText(file);
  };

  // The two buttons and the status line. o: { tool, kind, name(), data() (null: nothing to save), validate, legacy,
  // onOpen(result) → the message to show, or false to show nothing }.
  let counter = 0;
  const ui = (host, o) => {
    const box = el("div", "tp-pack");
    const actions = el("div", "tool-actions tp-actions");
    const saveButton = button("button-secondary", tx("Save as template file"));
    const openButton = button("button-secondary", tx("Open a template file"));
    const input = el("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.hidden = true;
    input.id = `tp-file-${++counter}`;
    input.dataset.packOpen = "";
    saveButton.dataset.packSave = "";
    openButton.dataset.packChoose = "";
    const status = el("p", "form-note tp-status");
    status.setAttribute("aria-live", "polite");
    status.dataset.packStatus = "";
    actions.append(saveButton, openButton, input);
    box.append(actions, status);
    host.append(box);
    const say = (message) => {
      status.textContent = message || "";
      clearTimeout(status.timer);
      if (message) status.timer = setTimeout(() => { status.textContent = ""; }, 8000);
    };
    saveButton.addEventListener("click", () => {
      const data = o.data();
      if (data === null || data === undefined) { say(tx("Nothing to save yet.")); return; }
      const packed = save({ tool: o.tool, kind: o.kind, name: o.name ? o.name() : "", lang: o.lang, data: JSON.parse(JSON.stringify(data)) });
      say(tx("Saved as {file}. Another site opens it in this tool with “Open a template file”.", { file: packed.fileName }));
    });
    openButton.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      readFile(file, { tool: o.tool, kind: o.kind, validate: o.validate, legacy: o.legacy }, (result) => {
        input.value = "";
        if (!result.ok) { say(result.message); return; }
        const message = o.onOpen(result);
        if (message !== false) say(message || tx("Opened: {name}", { name: result.name || file.name }));
      });
    });
    return { element: box, actions, status, say };
  };

  // The audit tools: built-in templates from the data file, the team's own ones in the tool's state (custom, keyed
  // "custom-…"). "Copy this template to edit" makes an own copy of the one chosen; an own template is edited in place
  // (name, questions per group: add, edit, remove, reorder) and is chosen in the same select as the built-in ones.
  // o: { select, builtIn, custom, current(), choose(key), groups() → [{ key, title }], fields [{ key, label }],
  // toEdit(item) → { field: text }, fromEdit(values, item) → item, validate, tool, kind, changed(), inUse(key) }.
  const checklist = (host, o) => {
    const toEdit = o.toEdit || ((item) => item);
    const fromEdit = o.fromEdit || ((values, item) => ({ ...item, ...values }));
    const own = (key) => Object.prototype.hasOwnProperty.call(o.custom, key);
    const templateOf = (key) => (own(key) ? o.custom[key] : o.builtIn[key]) || null;
    const firstBuiltIn = Object.keys(o.builtIn)[0];
    const newKey = () => `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const syncOptions = () => {
      o.select.querySelectorAll("option[data-own]").forEach((option) => option.remove());
      Object.entries(o.custom).forEach(([key, tpl]) => {
        const option = el("option", null, tpl.name);
        option.value = key;
        option.dataset.own = "";
        o.select.append(option);
      });
      o.select.value = o.current();
    };
    let openNext = false;
    const add = (tpl) => {
      const key = newKey();
      o.custom[key] = tpl;
      openNext = true;
      syncOptions();
      o.choose(key);
      render();
      return key;
    };

    const pack = ui(host, {
      tool: o.tool, kind: o.kind, validate: o.validate,
      name: () => templateOf(o.current())?.name || "",
      data: () => templateOf(o.current()),
      onOpen: (result) => { add(result.data); return tx("Opened: {name}", { name: result.data.name }); },
    });
    const copyButton = button("button-secondary", tx("Copy this template to edit"));
    copyButton.dataset.packCopy = "";
    pack.actions.prepend(copyButton);
    copyButton.addEventListener("click", () => {
      const tpl = templateOf(o.current());
      if (!tpl) return;
      const copy = JSON.parse(JSON.stringify(tpl));
      copy.name = tx("{name} (own copy)", { name: tpl.name }).slice(0, 80);
      add(copy);
      pack.say(tx("Your own copy is ready: edit its questions below."));
    });

    const editor = el("details", "tp-editor");
    editor.dataset.packEditor = "";
    host.append(editor);
    const field = (labelText, value, data) => {
      const wrap = el("label", "tp-field");
      const input = el("input");
      input.type = "text";
      input.autocomplete = "off";
      input.value = value;
      Object.assign(input.dataset, data);
      wrap.append(el("span", "tp-field-label", labelText), input);
      return wrap;
    };
    const f0 = (values) => str(values[o.fields[0].key]).slice(0, 40);
    const render = () => {
      const key = o.current();
      const tpl = own(key) ? o.custom[key] : null;
      copyButton.textContent = tpl ? tx("Copy this template again") : tx("Copy this template to edit");
      editor.hidden = !tpl;
      editor.replaceChildren();
      if (!tpl) return;
      if (openNext) { editor.open = true; openNext = false; }
      editor.append(el("summary", null, tx("Edit the questions of {name}", { name: tpl.name })));
      editor.append(field(tx("Template name"), tpl.name, { name: "" }));
      o.groups().forEach((group) => {
        const set = el("fieldset", "tp-group");
        set.append(el("legend", "tp-group-name", group.title));
        const list = el("ol", "tp-items");
        const items = Array.isArray(tpl.questions[group.key]) ? tpl.questions[group.key] : [];
        items.forEach((item, index) => {
          const li = el("li", "tp-item");
          const values = toEdit(item);
          const fields = el("div", "tp-item-fields");
          o.fields.forEach((f) => fields.append(field(`${f.label} ${index + 1}`, str(values[f.key]), { group: group.key, index: String(index), field: f.key })));
          const tools = el("div", "tp-item-tools");
          [["up", "↑", tx("Move up")], ["down", "↓", tx("Move down")], ["remove", "×", tx("Remove")]].forEach(([move, mark, text]) => {
            const b = button("button-ghost tp-move", mark);
            b.dataset.move = move;
            b.dataset.group = group.key;
            b.dataset.index = String(index);
            b.setAttribute("aria-label", `${text}: ${f0(values)} (${index + 1})`);
            b.title = text;
            b.disabled = (move === "up" && index === 0) || (move === "down" && index === items.length - 1);
            tools.append(b);
          });
          li.append(fields, tools);
          list.append(li);
        });
        const addButton = button("button-ghost tp-add", tx("Add a question"));
        addButton.dataset.add = group.key;
        set.append(list, addButton);
        editor.append(set);
      });
      const remove = button("button-ghost tp-delete", tx("Delete this template"));
      remove.dataset.deleteTemplate = "";
      const foot = el("div", "tool-actions");
      foot.append(remove);
      editor.append(foot);
    };
    const focusLater = (selector) => { const node = editor.querySelector(selector); if (node) node.focus(); };

    // Typing changes the template in place and leaves the editor alone, so the cursor stays where it is.
    editor.addEventListener("input", (event) => {
      const input = event.target;
      const tpl = o.custom[o.current()];
      if (!tpl || input.tagName !== "INPUT") return;
      if (input.dataset.name !== undefined) {
        tpl.name = input.value.slice(0, 80);
        const option = o.select.querySelector(`option[value="${o.current()}"]`);
        if (option) option.textContent = tpl.name;
      } else if (input.dataset.field) {
        const list = tpl.questions[input.dataset.group];
        const index = Number(input.dataset.index);
        if (!Array.isArray(list) || !(index in list)) return;
        list[index] = fromEdit({ ...toEdit(list[index]), [input.dataset.field]: input.value.slice(0, 300) }, list[index]);
      }
      o.changed();
    });
    editor.addEventListener("click", (event) => {
      const key = o.current();
      const tpl = o.custom[key];
      if (!tpl) return;
      const target = event.target.closest("button");
      if (!target) return;
      if (target.dataset.add) {
        const group = target.dataset.add;
        if (!Array.isArray(tpl.questions[group])) tpl.questions[group] = [];
        tpl.questions[group].push(fromEdit(Object.fromEntries(o.fields.map((f) => [f.key, ""])), undefined));
        o.changed();
        render();
        focusLater(`input[data-group="${group}"][data-index="${tpl.questions[group].length - 1}"]`);
      } else if (target.dataset.move) {
        const group = target.dataset.group;
        const list = tpl.questions[group];
        const index = Number(target.dataset.index);
        if (target.dataset.move === "remove") {
          list.splice(index, 1);
          o.changed();
          render();
          focusLater(`[data-add="${group}"]`);
          return;
        }
        const to = target.dataset.move === "up" ? index - 1 : index + 1;
        if (to < 0 || to >= list.length) return;
        [list[index], list[to]] = [list[to], list[index]];
        o.changed();
        render();
        // The same arrow on the moved question, or its text when that arrow is now at the end of the list.
        const next = editor.querySelector(`[data-move="${target.dataset.move}"][data-group="${group}"][data-index="${to}"]`);
        if (next && !next.disabled) next.focus(); else focusLater(`input[data-group="${group}"][data-index="${to}"]`);
      } else if (target.dataset.deleteTemplate !== undefined) {
        if (o.inUse && o.inUse(key)) { pack.say(tx("Saved work uses this template, so it stays.")); return; }
        if (!window.confirm(tx("Delete the template {name}?", { name: tpl.name }))) return;
        delete o.custom[key];
        o.choose(firstBuiltIn);
        syncOptions();
        render();
        copyButton.focus();
      }
    });

    syncOptions();
    render();
    return { render, syncOptions };
  };

  const api = { FORMAT, VERSION, MAX_BYTES, slug, fileNameOf, pack, read, save, download, readFile, ui, checklist };
  return api;
})();
