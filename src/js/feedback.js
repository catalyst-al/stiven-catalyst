// The feedback question at the end of a tool page (partials/tool-feedback.njk) and the form for a reader's
// challenge (pages/your-challenge.njk).
// With an action the form posts there and stays on the page; without one "Prepare the email" opens the visitor's
// mail program with the answer, the text stays in the form, and "Copy message" puts it on the clipboard for a visitor
// without a mail program. Nothing leaves the browser until the visitor sends it.
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

  // The body of the mail: one line per filled field, labelled by its data-line (the feedback form's "helped" and
  // "email" keep their labels without it), the message on its own, the page last.
  const LABELS = { helped: "Helped", email: "Reply to" };
  const lines = (data) => {
    const out = [];
    for (const field of form.elements) {
      if (!field.name || field.type === "hidden" || field.type === "submit" || field.name === "website") continue;
      if ((field.type === "radio" || field.type === "checkbox") && !field.checked) continue;
      const value = String(field.value || "").trim();
      if (!value) continue;
      const label = field.dataset.line || LABELS[field.name];
      out.push(label ? `${label}: ${value}` : value);
    }
    out.push(`Page: ${data.get("page")}`);
    return out.join("\n\n");
  };

  // The whole message to copy: the subject, then the body the mail would carry.
  const copy = form.querySelector("[data-feedback-copy]");
  if (copy) {
    copy.addEventListener("click", async () => {
      const text = `${form.dataset.subject || "Feedback"}\n\n${lines(new FormData(form))}`;
      try {
        await navigator.clipboard.writeText(text);
        say(form.dataset.copied, mail);
      } catch {
        say(form.dataset.copyFailed);
      }
    });
  }

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
      // The fields stay as they are: the message is not sent yet, and a visitor without a mail program copies it.
      button.disabled = false;
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
