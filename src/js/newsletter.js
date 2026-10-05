// The newsletter form (partials/newsletter.njk). The address goes straight to the newsletter provider
// (site.newsletter.action) and the page stays where it is: the form gives way to a note to confirm the
// subscription from the email that follows. The provider's answer cannot be read across sites ("no-cors"),
// so a request that arrives counts as sent; the browser has already checked the address. Without
// JavaScript the form posts in a new tab, as built.
(() => {
  const form = document.querySelector("[data-newsletter]");
  if (!form) return;
  const status = form.querySelector("[data-newsletter-status]");
  const row = form.querySelector(".newsletter-row");
  const note = form.querySelector(".form-note");

  const say = (text, address) => {
    status.textContent = text;
    if (address) {
      const link = document.createElement("a");
      link.href = `mailto:${address}`;
      link.textContent = address;
      status.append(" ", link, ".");
    }
    status.hidden = false;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    // A filled hidden field means a bot, which gets the note and nothing is sent.
    if (String(data.get("website") || "").trim()) { row.hidden = true; say(form.dataset.sent); return; }
    data.delete("website");
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      await fetch(form.getAttribute("action"), { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
      row.hidden = true;
      if (note) note.hidden = true;
      say(form.dataset.sent);
    } catch {
      button.disabled = false;
      say(form.dataset.failed, form.dataset.mail || "");
    }
  });
})();
