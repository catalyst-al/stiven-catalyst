// On a phone the notes beside a tool ("How it works", "A good handover"…) and the field notes under it fold under
// their heading, so the tool and its result come first; a tap on the heading opens them. The privacy note stays in
// view. Wider screens show everything as it is.
(() => {
  if (!window.matchMedia?.("(max-width: 620px)").matches) return;
  document.querySelectorAll(".tool-aside, .tool-essays .essay-notes").forEach((box) => {
    const head = box.querySelector(":scope > .kicker");
    if (!head) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fold-toggle";
    button.setAttribute("aria-expanded", "false");
    button.textContent = head.textContent;
    head.replaceChildren(button);
    box.classList.add("is-folded");
    button.addEventListener("click", () => {
      button.setAttribute("aria-expanded", String(!box.classList.toggle("is-folded")));
    });
  });
})();
