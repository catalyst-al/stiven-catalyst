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
    // Locked with a PIN (js/work-lock.js): nothing of the visitor's work is written in plain text.
    if (window.WorkLock?.locked) return;
    // Storage full, blocked or private: the worksheet stays on the page only, and ToolKit says so once, as in the
    // other tools.
    try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { window.ToolKit?.warnNotSaved?.(); }
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

  // The countermeasure as an open issue of the Shift Handover, with its owner and due date (shift-handover.js reads
  // ?issue=, ?owner= and ?due=). The link carries what is typed; empty, it says to write the countermeasure first.
  const handoverLink = form.querySelector("[data-handover]");
  const handoverBase = handoverLink?.getAttribute("href") || "../shift-handover/";
  const syncHandover = () => {
    if (!handoverLink) return;
    const value = (name) => form.elements[name]?.value.trim() || "";
    const url = new URL(handoverBase, location.href);
    const action = value("action");
    if (action) {
      url.searchParams.set("issue", action);
      if (value("owner")) url.searchParams.set("owner", value("owner"));
      if (value("due")) url.searchParams.set("due", value("due"));
    }
    handoverLink.href = url.href;
    handoverLink.dataset.ready = action ? "" : "no";
  };
  // The same countermeasure as an action of the Action Tracker, with its owner, due date and the check that closes it.
  const trackerLink = form.querySelector("[data-tracker]");
  const syncTracker = () => {
    if (!trackerLink || !window.ToolKit?.trackerUrl) return;
    const value = (name) => form.elements[name]?.value.trim() || "";
    trackerLink.href = window.ToolKit.trackerUrl(value("action") ? { title: value("action"), detail: value("cause") ? `${tx("Root cause")}: ${value("cause")}` : "", owner: value("owner"), due: value("due"), check: value("check"), source: "five-whys", priority: "High" } : {});
    trackerLink.dataset.ready = value("action") ? "" : "no";
  };
  // The investigation of the CX Control Tower this worksheet belongs to (?case=INV-…): named on the page, and the
  // whys and the cause go back to it through its address (cx-tower.js reads ?case=, ?why1=… and ?root=).
  const caseBox = form.querySelector("[data-case]");
  const caseBack = form.querySelector("[data-case-back]");
  const caseBase = caseBack?.getAttribute("href") || "../cx-control-tower/";
  const syncCase = () => {
    if (!caseBox) return;
    const id = form.elements.case?.value.trim() || "";
    caseBox.hidden = !id;
    if (!id) return;
    caseBox.querySelector("[data-case-text]").textContent = tx("Investigation {id} of the CX Control Tower.", { id });
    const url = new URL(caseBase, location.href);
    url.searchParams.set("case", id);
    const value = (name) => form.elements[name]?.value.trim() || "";
    if (value("problem")) url.searchParams.set("problem", value("problem"));
    whyInputs().forEach((input, index) => { if (input.value.trim() && index < 5) url.searchParams.set(`why${index + 1}`, input.value.trim()); });
    if (value("cause")) url.searchParams.set("root", value("cause"));
    caseBack.href = url.href;
  };
  trackerLink?.addEventListener("click", (event) => {
    if (form.elements.action.value.trim()) return;
    event.preventDefault();
    flash(tx("Write the countermeasure first, then add it to the actions."));
    form.elements.action.focus();
  });
  handoverLink?.addEventListener("click", (event) => {
    if (form.elements.action.value.trim()) return;
    event.preventDefault();
    flash(tx("Write the countermeasure first, then put it on the handover."));
    form.elements.action.focus();
  });

  const save = () => {
    const values = {};
    form.querySelectorAll("[data-store]").forEach((field) => { values[field.name] = field.value; });
    write(values);
    suggestCause();
    syncHandover();
    syncTracker();
    syncCase();
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
    syncHandover();
    syncTracker();
    syncCase();
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
    // A hidden field is not reset by the form: the case goes with the worksheet.
    if (form.elements.case) form.elements.case.value = "";
    whyInputs().slice(5).forEach((input) => input.closest("li").remove());
    addButton.hidden = false;
    forget();
    suggestCause();
    syncHandover();
    syncTracker();
    syncCase();
    changed();
    flash(tx("Worksheet cleared."));
    form.elements.problem.focus();
  });

  restore();

  // Other tools link here with ?problem=... to start a worksheet from their result; the CX Control Tower adds
  // ?case=INV-… so the whys go back to that investigation.
  const address = new URLSearchParams(location.search);
  const incoming = address.get("problem")?.trim();
  const incomingCase = (address.get("case") || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
  if (incoming || incomingCase) {
    const current = form.elements.problem.value.trim();
    if (incoming && current !== incoming && (!current || window.confirm(`${tx("Start a new worksheet with this problem?")}\n\n${incoming}`))) {
      form.reset();
      whyInputs().slice(5).forEach((input) => input.closest("li").remove());
      addButton.hidden = false;
      form.elements.problem.value = incoming;
      if (form.elements.case) form.elements.case.value = incomingCase;
      save();
      form.elements.why1.focus();
    } else if (incomingCase && form.elements.case && (!current || current === incoming) && !form.elements.case.value) {
      form.elements.case.value = incomingCase;
      save();
    }
    const query = new URLSearchParams(location.search); query.delete('problem'); query.delete('case');
    history.replaceState(null, "", location.pathname + (query.size ? `?${query}` : '') + location.hash);
  }
})();
