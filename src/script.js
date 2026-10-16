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

  // Writing and Publications pulse in the menu when something came out there since the reader last opened them. Each
  // menu item carries a stamp of what its part of the site holds (data-stamp, made when the site is built); the
  // browser keeps the stamp it last saw (nothing leaves it). A first visit only notes the stamps; opening the part
  // notes its new stamp, and the pulse stops.
  const nav = document.querySelector(".main-nav");
  const fresh = new Set();
  nav?.querySelectorAll("[data-news]").forEach((link) => {
    const key = `sc-seen-${link.dataset.news}`;
    let seen = null;
    try { seen = localStorage.getItem(key); } catch { return; }
    if (seen === null || link.getAttribute("aria-current") === "page") {
      try { localStorage.setItem(key, link.dataset.stamp); } catch { /* storage unavailable */ }
    } else if (seen !== link.dataset.stamp) fresh.add(link.dataset.news);
  });
  document.querySelectorAll("a[data-news]").forEach((link) => {
    if (!fresh.has(link.dataset.news)) return;
    link.classList.add("has-news");
    const note = document.createElement("span");
    note.className = "visually-hidden";
    note.textContent = ` (${nav.dataset.newLabel || "New"})`;
    link.append(note);
  });
  if (fresh.size) menuButton?.classList.add("has-news");

  // The light on a card or a row follows the pointer (styles.css: --mx, --my); a magazine cover also tilts towards it
  // (--px, --py: where the pointer is on the cover, from 0 to 1).
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const card = event.target.closest?.(".article-card, .note-card, .project-card, .mini-card, .tool-card, .book-feature, .contact-card, .feature-card, .meta-strip > div, .series-panel, .challenge-essays li a, .family-more-list a, .tool-essays-list li a, .essay-tools li a, a.essay-series-next, .issue-more-card, .search-results a, .podcast-app, .podcast-episode, .treatise-layer, .weekly-card, .weekly-chart, .role-borrowed a, .role-reading a, .role-next-card, .pillar, .about-timeline li, a.list-row");
    if (!card) return;
    const box = (card.querySelector(".weekly-card-cover") || card).getBoundingClientRect();
    card.style.setProperty("--mx", `${Math.round(event.clientX - box.left)}px`);
    card.style.setProperty("--my", `${Math.round(event.clientY - box.top)}px`);
    if (card.classList.contains("weekly-card")) {
      card.style.setProperty("--px", Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1).toFixed(2));
      card.style.setProperty("--py", Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1).toFixed(2));
    }
  }, { passive: true });

  // About: the figures (10+, ~250, …) count up once when they come into view, keeping their own way of writing the
  // number; screen readers get the figure itself. With reduced motion they are simply shown.
  const figures = [...document.querySelectorAll(".about-stats dd")];
  if (figures.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const countUp = (el) => {
      const text = el.textContent;
      const match = text.match(/\d+/);
      if (!match) return;
      const target = Number(match[0]);
      el.setAttribute("aria-label", text);
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 1200);
        el.textContent = text.replace(match[0], String(Math.round(target * (1 - (1 - t) ** 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        watch.unobserve(entry.target);
        countUp(entry.target);
      }
    }, { threshold: 0.6 });
    figures.forEach((figure) => watch.observe(figure));
  }

  // The month buttons of the lists (Insights, Reflections, Field Notes, Publications, the magazines): the blue of the
  // chosen month is one pill that slides to the month chosen next. filter.js and weekly.js only set aria-pressed.
  document.querySelectorAll(".weekly-months").forEach((group) => {
    const pill = document.createElement("span");
    pill.className = "month-pill";
    pill.setAttribute("aria-hidden", "true");
    group.prepend(pill);
    const place = () => {
      const button = group.querySelector('button[aria-pressed="true"]');
      pill.hidden = !button?.offsetWidth;
      if (pill.hidden) return;
      pill.style.width = `${button.offsetWidth}px`;
      pill.style.height = `${button.offsetHeight}px`;
      pill.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`;
    };
    place();
    group.classList.add("has-pill");
    requestAnimationFrame(() => group.classList.add("is-ready"));
    new MutationObserver(place).observe(group, { subtree: true, attributeFilter: ["aria-pressed"] });
    if ("ResizeObserver" in window) new ResizeObserver(place).observe(group);
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
