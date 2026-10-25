// Floor mode: the tools as they are needed on the floor, with gloves, one hand, a cold dock or a bright day: larger
// tap targets and text, full contrast, the main button of a form kept in reach (css/52-floor-mode.css). The inline
// script in layouts/base.njk sets data-floor="on" on the root before the first paint; this file only switches it
// and remembers the choice in this browser. The key ends in "-ui", a setting of the page and not work of a tool, so
// team sync never shares it.
(() => {
  const KEY = "sc-floor-mode-ui";
  const root = document.documentElement;
  const button = document.querySelector("[data-floor-toggle]");
  if (!button) return;
  const isOn = () => root.dataset.floor === "on";
  const sync = () => button.setAttribute("aria-pressed", String(isOn()));
  button.addEventListener("click", () => {
    const on = !isOn();
    if (on) root.dataset.floor = "on";
    else delete root.dataset.floor;
    // Off leaves nothing behind; a browser that cannot store keeps the mode for this page only.
    try {
      if (on) localStorage.setItem(KEY, "on");
      else localStorage.removeItem(KEY);
    } catch { /* storage unavailable */ }
    sync();
    // Charts and lists that size themselves can listen and draw again.
    window.dispatchEvent(new CustomEvent("floormode:change", { detail: { on } }));
  });
  sync();
})();
