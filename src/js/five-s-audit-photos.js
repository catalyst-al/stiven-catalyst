// Photos for the findings of the 5S Audit (floor-capture.js keeps them on this device). During the walk each question
// gets a photo control; the photos wait under the draft and move to the audit's own id when it is saved (ref
// "auditId|pillar-question"). A saved audit with photos gets a button in the audit log. five-s-audit.js draws the walk
// and the log; this only adds to them, and listens to its buttons after it.
(() => {
  const kit = window.ToolKit;
  const Capture = window.FloorCapture;
  const media = window.MediaStore;
  const dataEl = document.getElementById("five-s-audit-data");
  const root = document.querySelector("[data-five-s-audit]");
  if (!kit || !Capture || !media || !media.supported() || !dataEl || !root) return;
  const questionsBox = root.querySelector("[data-questions]");
  const logBody = root.querySelector("[data-log]");
  const saveButton = root.querySelector("[data-save]");
  const resetButton = root.querySelector("[data-reset]");
  const templateSelect = root.querySelector("#fs-template");
  if (!questionsBox || !logBody || !saveButton || !resetButton) return;
  const { tx, el, int, showDate } = kit;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = String(KEY).replace(/^sc-/, "");
  const pillarName = (key) => (cfg.pillars || []).find((pillar) => pillar.key === key)?.name || key;
  const questionText = (template, qid) => {
    const [key, index] = qid.split("-");
    return cfg.templates?.[template]?.questions?.[key]?.[Number(index)] || "";
  };

  const DRAFT = "draft|";
  const draftRef = (qid) => `${DRAFT}${templateSelect?.value || ""}|${qid}`;
  const savedRows = () => {
    const state = kit.read(KEY, {});
    return Array.isArray(state?.rows) ? state.rows : [];
  };

  // The walk: one control per question, the note on photos once above them.
  const note = el("p", "form-note fc-photo-note fs-photo-note", Capture.NOTE());
  questionsBox.before(note);
  let controls = [];
  const draftCount = () => controls.reduce((sum, control) => sum + control.count(), 0);
  const decorateQuestions = () => {
    // A walk drawn again drops the old controls; their thumbnails are let go.
    controls = controls.filter((control) => control.element.isConnected || (control.destroy(), false));
    questionsBox.querySelectorAll(".fs-q").forEach((row) => {
      const qid = row.querySelector("[data-note]")?.dataset.note;
      if (!qid || row.querySelector(".fc-photos")) return;
      const foot = row.querySelector(".fs-q-foot") || row;
      controls.push(Capture.attach(foot, { tool: TOOL, ref: draftRef(qid), note: false }));
    });
  };
  new MutationObserver(decorateQuestions).observe(questionsBox, { childList: true });
  decorateQuestions();

  // The audit log: a button on each saved audit that has photos.
  let drawing = 0;
  const decorateLog = async () => {
    const mine = ++drawing;
    let counts = {};
    try { counts = await media.counts(TOOL); } catch { return; }
    if (mine !== drawing) return;
    const rows = savedRows();
    logBody.querySelectorAll("tr").forEach((tr) => {
      tr.querySelector(".fc-row-photos")?.remove();
      const id = tr.querySelector("[data-show]")?.dataset.show;
      const audit = rows.find((row) => row.id === id);
      if (!audit) return;
      const refs = Object.keys(counts).filter((ref) => ref.startsWith(`${id}|`));
      const n = refs.reduce((sum, ref) => sum + counts[ref], 0);
      if (!n) return;
      const open = el("button", "fc-row-photos has-photos", tx("Photos · {n}", { n: int.format(n) }));
      open.type = "button";
      open.setAttribute("aria-label", `${open.textContent}, ${audit.area}, ${showDate(audit.date)}`);
      open.addEventListener("click", () => Capture.openPhotos({
        title: `${audit.area} · ${showDate(audit.date)}`,
        tool: TOOL,
        refs: refs.sort().map((ref) => {
          const qid = ref.slice(id.length + 1);
          const [key, index] = qid.split("-");
          return { ref, label: `${pillarName(key)} ${Number(index) + 1} · ${questionText(audit.template, qid)}` };
        }),
        onClose: decorateLog,
      }));
      tr.cells[1]?.append(open);
    });
  };
  new MutationObserver(decorateLog).observe(logBody, { childList: true });
  decorateLog();

  // The draft's photos, by the start of their ref.
  const draftPhotos = async (prefix = DRAFT) => (await media.list(TOOL)).filter((record) => record.ref.startsWith(prefix));
  const refreshAll = () => Promise.all(controls.map((control) => control.refresh()));

  // Saving: five-s-audit.js writes the new audit at once; the photos of the draft follow it under its id.
  let before = new Set();
  let template = "";
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-save]") === saveButton) {
      before = new Set(savedRows().map((row) => row.id));
      template = templateSelect?.value || "";
    }
  }, true);
  saveButton.addEventListener("click", async () => {
    const added = savedRows().find((row) => !before.has(row.id));
    if (!added) return;
    const prefix = `${DRAFT}${template}|`;
    try {
      for (const record of await draftPhotos(prefix)) await media.update(record.id, { ref: `${added.id}|${record.ref.slice(prefix.length)}` });
    } catch { /* the photos stay with the draft and can be added again */ }
    await refreshAll();
    decorateLog();
  });

  // A new audit discards the draft, and with it its photos. Without scores five-s-audit.js does not ask; with photos
  // this asks first.
  const started = () => !!questionsBox.querySelector('input[type="radio"]:checked');
  root.addEventListener("click", (event) => {
    if (event.target.closest("[data-reset]") !== resetButton) return;
    if (!started() && draftCount() && !window.confirm(tx("Start a new audit? Its {n} photos are removed from this device.", { n: draftCount() }))) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, true);
  resetButton.addEventListener("click", async () => {
    // Still scored: the visitor kept the audit.
    if (started()) return;
    try {
      for (const record of await draftPhotos()) await media.remove(record.id);
    } catch { /* nothing to remove */ }
    await refreshAll();
  });
})();
