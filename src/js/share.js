(() => {
  const copy = async (text) => {
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
  };

  // The button says it is done and, while it does, carries .is-done (styles.css: a short green glow).
  const confirm = (button, label) => {
    const original = button.dataset.label || (button.dataset.label = button.textContent);
    button.textContent = label;
    button.classList.add("is-done");
    clearTimeout(button.timer);
    button.timer = setTimeout(() => {
      button.textContent = original;
      button.classList.remove("is-done");
    }, 1600);
  };

  document.querySelectorAll("[data-note-actions]").forEach((node) => { node.hidden = false; });

  // A field note's card (pages/field-notes.njk) carries its quote once: the text to copy is the quote, the author and
  // the card's address, and the text to share is the quote; an empty data-copy-text or data-share-text asks for them.
  const quoteOf = (button) => button.closest(".note-card")?.querySelector("blockquote")?.textContent.trim() || "";
  const copyText = (button) => button.dataset.copyText || `${quoteOf(button)} (Stiven Janaqi, Stiven Catalyst) ${button.closest("[data-note-actions]")?.querySelector("[data-share-url]")?.dataset.shareUrl || location.href}`;
  const shareText = (button) => button.dataset.shareText || quoteOf(button);

  document.querySelectorAll("[data-copy-text]").forEach((button) => {
    button.addEventListener("click", async () => {
      await copy(copyText(button));
      confirm(button, button.dataset.copiedLabel || "Copied");
    });
  });

  // Native share sheet on phones; LinkedIn elsewhere. No third-party scripts.
  document.querySelectorAll("[data-share-url]").forEach((button) => {
    if (button.hasAttribute("data-native-only")) {
      if (!navigator.share) return;
      button.hidden = false;
    }
    button.addEventListener("click", async () => {
      const url = button.dataset.shareUrl;
      const text = shareText(button);
      if (navigator.share) {
        try { await navigator.share({ title: document.title, text, url }); } catch { /* dismissed */ }
        return;
      }
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
    });
  });
})();
