(() => {
  const root = document.documentElement;

  const readTheme = () => {
    try { return localStorage.getItem("sc-theme"); } catch { return null; }
  };
  const saveTheme = (theme) => {
    try { localStorage.setItem("sc-theme", theme); } catch { /* storage unavailable */ }
  };

  // The inline script in <head> sets the theme before first paint; this is a fallback.
  root.dataset.theme = root.dataset.theme || readTheme() || "dark";

  const themeButton = document.querySelector("[data-theme-toggle]");
  const setThemeLabel = () => {
    if (!themeButton) return;
    const isDark = root.dataset.theme === "dark";
    themeButton.setAttribute("aria-label", isDark ? themeButton.dataset.lightLabel : themeButton.dataset.darkLabel);
  };
  setThemeLabel();

  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    saveTheme(root.dataset.theme);
    setThemeLabel();
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");

  const setMenu = (open) => {
    if (panel) panel.dataset.open = String(open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? menuButton.dataset.closeLabel : menuButton.getAttribute("data-menu-label"));
  };

  menuButton?.addEventListener("click", () => {
    setMenu(panel?.dataset.open !== "true");
  });

  panel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel?.dataset.open === "true") {
      setMenu(false);
      menuButton?.focus();
    }
  });

  // A tap on the dimmed page closes the open menu and does nothing else; the header's buttons keep working. The menu
  // closes as the finger goes down (before the focus moves), and the click that follows is swallowed.
  let closedAt = 0;
  document.addEventListener("pointerdown", (event) => {
    if (panel?.dataset.open !== "true" || event.target.closest?.(".site-header")) return;
    closedAt = event.timeStamp;
    setMenu(false);
  }, true);
  document.addEventListener("click", (event) => {
    if (!closedAt || event.timeStamp - closedAt > 1000) return;
    closedAt = 0;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  // Focus that leaves the open menu (Tab past its last link, Shift+Tab before the button) closes it, so nothing the
  // keyboard reaches is hidden behind the panel.
  document.addEventListener("focusin", (event) => {
    if (panel?.dataset.open !== "true" || panel.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
