// Photos for the entries of the Safety Cross log (floor-capture.js keeps them on this device). Each row of the log
// gets a photo button; its photos belong to the entry's date and what happened (ref "date|what"). The rows are
// drawn by safety-cross.js; this only adds to them, after the log has been written, so the row it reads is the
// one on the screen.
(() => {
  const kit = window.ToolKit;
  const Capture = window.FloorCapture;
  const media = window.MediaStore;
  const dataEl = document.getElementById("safety-cross-data");
  const root = document.querySelector("[data-safety-cross]");
  if (!kit || !Capture || !media || !media.supported() || !dataEl || !root) return;
  const body = root.querySelector("[data-log]");
  if (!body) return;
  const { tx, showDate, int } = kit;
  const KEY = JSON.parse(dataEl.textContent).storageKey;
  const TOOL = String(KEY).replace(/^sc-/, "");
  const refOf = (row) => `${row.date}|${row.what || ""}`;
  // The text of a cell without the button added to it.
  const ownText = (cell) => [...cell.childNodes].filter((node) => node.nodeType === 3).map((node) => node.nodeValue).join("");

  let drawing = 0;
  const decorate = async () => {
    const mine = ++drawing;
    const state = kit.read(KEY, {});
    const rows = Array.isArray(state?.rows) ? state.rows : [];
    let counts = {};
    try { counts = await media.counts(TOOL); } catch { return; }
    if (mine !== drawing) return;
    body.querySelectorAll("tr").forEach((tr) => {
      const index = Number(tr.querySelector("[data-remove]")?.dataset.remove);
      const row = rows[index];
      const cell = tr.cells[4];
      tr.querySelector(".fc-row-photos")?.remove();
      // Only a row that is the saved entry it shows: same date, same words.
      if (!row || !cell || tr.cells[0].textContent !== showDate(row.date) || ownText(cell) !== String(row.what || "")) return;
      const ref = refOf(row);
      const n = counts[ref] || 0;
      const open = el("button", `fc-row-photos${n ? " has-photos" : ""}`, n ? tx("Photos · {n}", { n: int.format(n) }) : tx("Add photo"));
      open.type = "button";
      // The visible words first, then which entry: the name a screen reader gives the button.
      open.setAttribute("aria-label", `${open.textContent}, ${showDate(row.date)}${row.what ? `, ${row.what}` : ""}`);
      open.addEventListener("click", () => Capture.openPhotos({
        title: `${showDate(row.date)}${row.what ? ` · ${row.what}` : ""}`,
        tool: TOOL,
        refs: [{ ref }],
        onClose: decorate,
      }));
      cell.append(open);
    });
  };
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  // The log is written a frame and a tick after it is drawn; read it after that.
  const soon = () => requestAnimationFrame(() => setTimeout(decorate, 30));
  new MutationObserver((changes) => {
    if (changes.some((change) => [...change.addedNodes].some((node) => node.nodeName === "TR"))) soon();
  }).observe(body, { childList: true });
  soon();
})();
