// The field note of the day on the home page (partials/note-of-the-day.njk): the reader's own date picks
// one note from the fixed list, the same for everyone that day, and the two cards further down show the two
// notes after it. Runs before js/share.js reads the copy and share buttons (both are deferred, this one first).
(() => {
  const box = document.querySelector("[data-note-of-day]");
  if (!box) return;
  let notes = [];
  try { notes = JSON.parse(box.dataset.notes || "[]"); } catch { return; }
  if (!notes.length) return;

  // Whole days since 1 January 1970 by the reader's calendar, so the note changes at the reader's midnight.
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 864e5);
  const at = (offset) => notes[(day + offset) % notes.length];
  const today = at(0);
  const url = `${box.dataset.page}#${today.id}`;

  box.querySelector("[data-note-quote]").textContent = `“${today.q}”`;
  box.querySelector("[data-note-link]").setAttribute("href", `${new URL(box.dataset.page).pathname}#${today.id}`);
  box.querySelector("[data-note-copy]").dataset.copyText = `“${today.q}” (Stiven Janaqi, Stiven Catalyst) ${url}`;
  const share = box.querySelector("[data-note-share]");
  share.dataset.shareUrl = url;
  share.dataset.shareText = `“${today.q}”`;

  document.querySelectorAll("[data-note-slot]").forEach((card) => {
    const note = at(Number(card.dataset.noteSlot));
    if (notes.length < 3 || !note) return;
    card.querySelector("blockquote").textContent = `“${note.q}”`;
    const time = card.querySelector("time");
    time.textContent = note.d;
    time.setAttribute("datetime", note.iso);
  });
})();
