// The feedback question at the end of a tool page (partials/tool-feedback.njk).
// With an action the form posts there and stays on the page; without one it opens the visitor's
// mail program with the answer. Nothing leaves the browser until "Send" is pressed.
(() => {
  const form = document.querySelector("[data-tool-feedback]");
  if (!form) return;
  const status = form.querySelector("[data-tool-feedback-status]");
  const mail = form.dataset.mail || "";
  const action = form.getAttribute("action") || "";

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

  const finish = (text) => {
    form.querySelectorAll("fieldset, .tf-field, .tf-actions").forEach((node) => { node.hidden = true; });
    say(text);
  };

  const lines = (data) => {
    const helped = data.get("helped") === "yes" ? "yes" : "no";
    const message = String(data.get("message") || "").trim();
    const email = String(data.get("email") || "").trim();
    return [`Helped: ${helped}`, message && `\n${message}`, email && `\nReply to: ${email}`, `\nPage: ${data.get("page")}`].filter(Boolean).join("\n");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    // A filled hidden field means a bot, which gets the thank-you and nothing is sent.
    if (String(data.get("website") || "").trim()) { finish(form.dataset.sent); return; }
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    if (!action) {
      const subject = encodeURIComponent(form.dataset.subject || "Feedback");
      const body = encodeURIComponent(lines(data));
      finish(form.dataset.sent);
      say(form.dataset.opened, mail);
      // A clicked link, not location.href, so the page stays where it is in every browser.
      const link = document.createElement("a");
      link.href = `mailto:${mail}?subject=${subject}&body=${body}`;
      link.hidden = true;
      document.body.append(link);
      link.click();
      link.remove();
      return;
    }
    try {
      const response = await fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(String(response.status));
      finish(form.dataset.sent);
    } catch {
      button.disabled = false;
      say(form.dataset.failed, mail || "");
    }
  });
})();
