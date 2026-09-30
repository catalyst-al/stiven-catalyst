(() => {
  const form = document.querySelector("[data-worksheet]");
  if (!form) return;

  const tx = window.ToolKit?.tx || ((text) => text);
  const KEY = form.dataset.key || "sc-five-whys";
  const MAX_WHYS = 9;
  const list = form.querySelector("[data-whys]");
  const addButton = form.querySelector("[data-add-why]");
  const status = form.querySelector("[data-status]");
  const causeField = form.elements.cause;
  // An explicit, read-only result provider. The coaching bridge never changes the worksheet.
  window.CoachingToolResult = { tool: 'five-whys', get: () => {
    const value = name => form.elements[name]?.value.trim() || '';
    const payload = { problem: value('problem'), whys: whyInputs().map(i => i.value.trim()).filter(Boolean), hypothesis: value('cause'), action: value('action'), owner: value('owner'), due: value('due'), check: value('check') };
    return payload.problem && payload.hypothesis && payload.whys.length ? { version: 1, tool: 'five-whys', captured: new Date().toISOString(), payload } : null;
  } };
  const changed = () => window.dispatchEvent(new CustomEvent('coaching:result'));

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  };
  const write = (value) => {
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* storage unavailable */ }
  };
  const forget = () => {
    try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
  };

  const whyInputs = () => [...list.querySelectorAll("input")];

  const addWhy = () => {
    const number = whyInputs().length + 1;
    if (number > MAX_WHYS) return null;
    const item = document.createElement("li");
    item.className = "field why";
    const label = document.createElement("label");
    label.htmlFor = `ws-why-${number}`;
    label.textContent = tx("Why {n}?", { n: number });
    const input = document.createElement("input");
    input.id = `ws-why-${number}`;
    input.name = `why${number}`;
    input.autocomplete = "off";
    input.dataset.store = "";
    item.append(label, input);
    list.append(item);
    addButton.hidden = number >= MAX_WHYS;
    return input;
  };

  // Suggest the deepest answer so far as the root cause.
  const suggestCause = () => {
    const last = whyInputs().map((input) => input.value.trim()).filter(Boolean).pop();
    causeField.placeholder = last ? tx("Suggested: {text}", { text: last }) : tx("The last answer that you can act on");
  };

  const save = () => {
    const values = {};
    form.querySelectorAll("[data-store]").forEach((field) => { values[field.name] = field.value; });
    write(values);
    suggestCause();
    changed();
  };

  const restore = () => {
    const values = read();
    Object.keys(values).forEach((name) => {
      if (!form.elements[name] && /^why\d+$/.test(name)) {
        while (whyInputs().length < Number(name.slice(3)) && addWhy());
      }
    });
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements[name];
      if (field) field.value = value;
    });
    suggestCause();
  };

  const asText = () => {
    const value = (name) => form.elements[name]?.value.trim() || "-";
    const due = window.ToolKit ? window.ToolKit.showDate(value("due")) : value("due");
    const lines = ["5 Whys | Stiven Catalyst", "", `${tx("Problem")}: ${value("problem")}`, ""];
    whyInputs().forEach((input, index) => {
      if (input.value.trim()) lines.push(`${tx("Why {n}", { n: index + 1 })}: ${input.value.trim()}`);
    });
    lines.push(
      "",
      `${tx("Root cause")}: ${value("cause")}`,
      `${tx("Countermeasure")}: ${value("action")}`,
      `${tx("Owner")}: ${value("owner")}`,
      `${tx("Due")}: ${due}`,
      `${tx("Check")}: ${value("check")}`
    );
    return lines.join("\n");
  };

  const flash = (message) => {
    status.textContent = message;
    clearTimeout(flash.timer);
    flash.timer = setTimeout(() => { status.textContent = tx("Your draft is kept only in this browser."); }, 2200);
  };

  form.addEventListener("input", save);

  addButton.addEventListener("click", () => {
    const input = addWhy();
    input?.focus();
    save();
  });

  form.querySelector("[data-print]").addEventListener("click", () => window.print());

  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const text = asText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    flash(tx("Copied to the clipboard."));
  });

  form.querySelector("[data-clear]").addEventListener("click", () => {
    if (!window.confirm(tx("Clear the whole worksheet?"))) return;
    form.reset();
    whyInputs().slice(5).forEach((input) => input.closest("li").remove());
    addButton.hidden = false;
    forget();
    suggestCause();
    changed();
    flash(tx("Worksheet cleared."));
    form.elements.problem.focus();
  });

  restore();

  // Other tools link here with ?problem=... to start a worksheet from their result.
  const incoming = new URLSearchParams(location.search).get("problem")?.trim();
  if (incoming) {
    const current = form.elements.problem.value.trim();
    if (current !== incoming && (!current || window.confirm(`${tx("Start a new worksheet with this problem?")}\n\n${incoming}`))) {
      form.reset();
      whyInputs().slice(5).forEach((input) => input.closest("li").remove());
      addButton.hidden = false;
      form.elements.problem.value = incoming;
      save();
      form.elements.why1.focus();
    }
    const query = new URLSearchParams(location.search); query.delete('problem');
    history.replaceState(null, "", location.pathname + (query.size ? `?${query}` : '') + location.hash);
  }
})();
