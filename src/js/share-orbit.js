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
