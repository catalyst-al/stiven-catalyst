// A short guide shown before the print window of the CV tools, because the
// browser's own "Save as PDF" is easy to miss and "Microsoft Print to PDF"
// opens its save window behind the browser. PrintGuide.open(print, { colours })
// shows it and calls print on "Open the print window"; ticked, it stays away.
window.PrintGuide = (() => {
  const KEY = "sc-print-guide-hidden";
  const hidden = () => {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  };
  const remember = () => {
    try { localStorage.setItem(KEY, "1"); } catch { /* shown again next time */ }
  };

  const open = (print, { colours = false } = {}) => {
    if (hidden() || typeof HTMLDialogElement === "undefined") return print();
    const { tx, el } = window.ToolKit;
    const dialog = el("dialog", "pg-dialog");
    dialog.setAttribute("aria-labelledby", "pg-title");
    const title = el("h2", null, tx("How to save your PDF"));
    title.id = "pg-title";
    const steps = el("ol", "pg-steps");
    const step = (strong, text) => {
      const item = el("li");
      item.append(el("strong", null, strong), " ", text);
      steps.append(item);
    };
    step(tx("Printer:"), tx("choose “Save as PDF” (“Als PDF speichern”), not “Microsoft Print to PDF”."));
    if (colours) step(tx("More settings:"), tx("switch on “Background graphics”, so the colours are kept."));
    step(tx("Save:"), tx("click Save and choose a folder, for example Downloads."));
    const tip = el("p", "pg-tip", tx("Using “Microsoft Print to PDF” anyway? Its save window often opens behind the browser: press Alt+Tab to find it."));
    const check = el("label", "pg-check");
    const box = el("input");
    box.type = "checkbox";
    check.append(box, " ", tx("Don't show this again"));
    const actions = el("div", "tool-actions");
    const go = el("button", "button-primary", tx("Open the print window"));
    go.type = "button";
    const cancel = el("button", "button-secondary", tx("Cancel"));
    cancel.type = "button";
    actions.append(go, cancel);
    dialog.append(title, steps, tip, check, actions);
    document.body.append(dialog);

    let confirmed = false;
    go.addEventListener("click", () => { confirmed = true; dialog.close(); });
    cancel.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => {
      if (box.checked) remember();
      dialog.remove();
      // Let the dialog leave the screen before the print window takes its picture.
      if (confirmed) setTimeout(print, 50);
    });
    dialog.showModal();
    go.focus();
  };
  return { open };
})();
