// The share planet at the bottom right: opens and closes the ways to share, copies the link,
// and offers the phone's own share sheet where there is one.
(() => {
  const root = document.querySelector("[data-share-orbit]");
  if (!root) return;
  const toggle = root.querySelector("[data-share-toggle]");
  const panel = root.querySelector(".share-orbit-panel");
  const copyButton = root.querySelector("[data-share-copy]");
  const nativeButton = root.querySelector("[data-share-native]");
  const { url, title } = root.dataset;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    root.classList.toggle("is-open", open);
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-shown"));
      panel.querySelector("a, button")?.focus({ preventScroll: true });
    } else {
      panel.classList.remove("is-shown");
      setTimeout(() => { if (!root.classList.contains("is-open")) panel.hidden = true; }, 260);
    }
  };

  // On a phone the planet rests out of sight until the reader has scrolled half a screen, so it does not cover the
  // opening lines; a page too short to scroll keeps it in view.
  const phone = matchMedia("(max-width: 620px)");
  const rest = () => {
    const scrollable = document.documentElement.scrollHeight > innerHeight * 1.5;
    root.classList.toggle("is-resting", phone.matches && scrollable && scrollY < innerHeight / 2 && !root.classList.contains("is-open"));
  };
  addEventListener("scroll", rest, { passive: true });
  addEventListener("resize", rest);
  phone.addEventListener("change", rest);
  rest();

  // On a phone a control reached with Tab stops above the planet: the stylesheet asks for it (scroll-padding-bottom,
  // 11-reading-and-motion.css), and Chromium and Firefox follow. Safari's engine brings a focused control into view
  // without that margin, so a field could come to rest under the planet. Where that happened, the page moves by the
  // few pixels that are missing; where the browser already left the room, nothing moves.
  document.addEventListener("focusin", (event) => {
    const target = event.target;
    if (!phone.matches || !(target instanceof Element) || root.contains(target)) return;
    const clear = () => {
      if (document.activeElement !== target || root.classList.contains("is-resting") || !target.matches(":focus-visible")) return;
      const box = target.getBoundingClientRect();
      const planet = toggle.getBoundingClientRect();
      // A tall control (a text area, a table that scrolls) may run behind the planet while its top is clear of it.
      const bottom = box.height > 64 ? box.top + 24 : box.bottom;
      const under = box.width > 0 && box.right + 2 > planet.left && box.left - 2 < planet.right && bottom + 2 > planet.top && box.top - 2 < planet.bottom;
      if (under) scrollBy({ top: bottom + 4 - planet.top, behavior: "instant" });
    };
    // Looked at twice: after the next frame, and once the browser's own move to the control has ended (Safari's engine
    // makes that move after the frame).
    requestAnimationFrame(clear);
    setTimeout(clear, 250);
  });

  toggle.addEventListener("click", () => setOpen(!root.classList.contains("is-open")));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (root.classList.contains("is-open") && !root.contains(event.target)) setOpen(false);
  });
  panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setTimeout(() => setOpen(false), 150)));

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement("textarea");
      area.value = url;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const label = copyButton.querySelector("small");
    const original = label.dataset.label || (label.dataset.label = label.textContent);
    label.textContent = copyButton.dataset.done;
    copyButton.classList.add("is-done");
    clearTimeout(copyButton.timer);
    copyButton.timer = setTimeout(() => {
      label.textContent = original;
      copyButton.classList.remove("is-done");
    }, 1800);
  });

  // On Android a web link cannot choose between WhatsApp and WhatsApp Business; the phone opens its default.
  // There each planet names its app, and the Business planet appears next to the ordinary one.
  if (/Android/i.test(navigator.userAgent)) {
    const text = `${title} ${url}`;
    root.querySelectorAll("[data-whatsapp]").forEach((link) => {
      const fallback = encodeURIComponent(link.href);
      link.href = `intent://send?text=${encodeURIComponent(text)}#Intent;scheme=whatsapp;package=${link.dataset.whatsapp};S.browser_fallback_url=${fallback};end`;
      link.removeAttribute("target");
    });
    const business = root.querySelector("[data-whatsapp-business]");
    if (business) {
      business.hidden = false;
      root.querySelector(".share-orbit-planets").classList.add("has-business");
    }
  }

  if (nativeButton && navigator.share) {
    nativeButton.hidden = false;
    nativeButton.addEventListener("click", async () => {
      try { await navigator.share({ title, url }); } catch { /* dismissed */ }
    });
  }
})();
