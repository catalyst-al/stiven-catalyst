// Photos for the findings of the 5S Audit (floor-capture.js keeps them on this device). During the walk each question
// gets a photo control; the photos wait under the draft and move to the audit's own id when it is saved (ref
// "auditId|pillar-question"). A saved audit with photos gets a button in the audit log. A question photographed in two
// audits of the same area offers "Before / after" (in the log and in the weakest questions), a side-by-side view that
// prints on A4 for the team board. A red tag keeps its photo under its id and the one taken when it is done under
// "id|after". Removing an audit or a red tag offers to remove its photos too. five-s-audit.js draws the walk, the
// log and the register; this only adds to them, and listens to its buttons after it.
(() => {
  const kit = window.ToolKit;
  const Capture = window.FloorCapture;
  const media = window.MediaStore;
  const M = window.FiveSMath;
  const dataEl = document.getElementById("five-s-audit-data");
  const root = document.querySelector("[data-five-s-audit]");
  if (!kit || !Capture || !media || !media.supported() || !dataEl || !root) return;
  const questionsBox = root.querySelector("[data-questions]");
  const logBody = root.querySelector("[data-log]");
  const logStatus = root.querySelector("[data-log-status]");
  const tagBody = root.querySelector("[data-tags]");
  const tagStatus = root.querySelector("[data-tag-status]");
  const saveButton = root.querySelector("[data-save]");
  const resetButton = root.querySelector("[data-reset]");
  const templateSelect = root.querySelector("#fs-template");
  const results = document.querySelector("[data-results]");
  if (!questionsBox || !logBody || !saveButton || !resetButton) return;
  const { tx, el, int, showDate } = kit;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const TOOL = String(KEY).replace(/^sc-/, "");
  const SCORE_MAX = M?.SCORE_MAX || 4;
  const AFTER = M?.TAG_AFTER || "|after";
  const pillarName = (key) => (cfg.pillars || []).find((pillar) => pillar.key === key)?.name || key;
  const questionText = (template, qid) => {
    const [key, index] = qid.split("-");
    return cfg.templates?.[template]?.questions?.[key]?.[Number(index)] || "";
  };
  const questionLabel = (template, qid) => {
    const [key, index] = qid.split("-");
    return `${pillarName(key)} ${Number(index) + 1} · ${questionText(template, qid)}`;
  };
  const button = (className, text) => {
    const node = el("button", className, text);
    node.type = "button";
    return node;
  };

  const DRAFT = "draft|";
  const draftRef = (qid) => `${DRAFT}${templateSelect?.value || ""}|${qid}`;
  const savedState = () => kit.read(KEY, {}) || {};
  const savedRows = () => {
    const state = savedState();
    return Array.isArray(state?.rows) ? state.rows : [];
  };
  const allPhotos = async () => {
    try { return await media.list(TOOL); } catch { return null; }
  };
  const countsOf = (records) => {
    const out = {};
    records.forEach((record) => { out[record.ref] = (out[record.ref] || 0) + 1; });
    return out;
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

  // ---- Before and after: the side-by-side view and its A4 sheet ------------------------------------------------
  // A pair to show: { title, sides: [{ label, record, date, score, who }, …], change }.
  let viewer = null;
  let urls = [];
  const release = () => { urls.forEach((url) => URL.revokeObjectURL(url)); urls = []; };
  const imageOf = (record, alt) => {
    const image = el("img", "fs-ba-image");
    try {
      const url = URL.createObjectURL(record.blob);
      urls.push(url);
      image.src = url;
    } catch { /* a photo that cannot be shown keeps its caption */ }
    image.alt = alt;
    if (record.width) image.width = record.width;
    if (record.height) image.height = record.height;
    image.decoding = "async";
    return image;
  };
  const sideOf = (side) => {
    const figure = el("figure", "fs-ba-side");
    const caption = el("figcaption");
    caption.append(el("strong", null, side.label), [side.date, side.score, side.who].filter(Boolean).map((part) => ` · ${part}`).join(""));
    figure.append(imageOf(side.record, [side.label, side.date].filter(Boolean).join(" · ")), caption);
    return figure;
  };
  const pairOf = (pair) => {
    const section = el("section", "fs-ba-pair");
    if (pair.title) section.append(el("h3", null, pair.title));
    const grid = el("div", "fs-ba-grid");
    grid.append(...pair.sides.map(sideOf));
    section.append(grid);
    if (pair.change) section.append(el("p", "form-note fs-ba-change", pair.change));
    return section;
  };
  // The sheet for the team board: only the pairs, on A4, with the area in the heading.
  const printSheet = async (heading, pairs) => {
    document.querySelector(".fs-ba-sheet")?.remove();
    const sheet = el("div", "fs-ba-sheet");
    sheet.append(el("p", "kicker", `${cfg.text.tool} · ${tx("Before / after")}`), el("h1", null, heading), ...pairs.map(pairOf), el("p", "fs-ba-foot", tx("Printed {date}", { date: showDate(kit.today()) })));
    document.body.append(sheet);
    // The photos must be ready before the print dialog takes its picture of the page.
    await Promise.all([...sheet.querySelectorAll("img")].map((image) => (typeof image.decode === "function" ? image.decode().catch(() => {}) : null)));
    const html = document.documentElement;
    html.classList.add("fs-ba-print");
    const done = () => { html.classList.remove("fs-ba-print"); sheet.remove(); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint (some phones) get the class removed a moment later.
    setTimeout(done, 2000);
  };
  const openCompare = (heading, pairs) => {
    if (!viewer) {
      const box = el("dialog", "fc-dialog fs-ba-dialog");
      box.setAttribute("aria-labelledby", "fs-ba-title");
      const head = el("div", "fc-dialog-head");
      const title = el("h2", null, "");
      title.id = "fs-ba-title";
      const actions = el("div", "fs-ba-actions");
      const print = button("button-secondary", tx("Print for the team board"));
      const close = button("button-secondary fc-close", tx("Close"));
      close.addEventListener("click", () => box.close());
      actions.append(print, close);
      head.append(title, actions);
      const body = el("div", "fc-dialog-body");
      box.append(head, body);
      box.addEventListener("click", (event) => { if (event.target === box) box.close(); });
      box.addEventListener("close", () => { body.replaceChildren(); release(); });
      document.body.append(box);
      viewer = { box, title, body, print };
      print.addEventListener("click", () => printSheet(viewer.heading, viewer.pairs));
    }
    release();
    viewer.heading = heading;
    viewer.pairs = pairs;
    viewer.title.textContent = heading;
    viewer.body.replaceChildren(...pairs.map(pairOf), el("p", "form-note fc-photo-note", Capture.NOTE()));
    if (typeof viewer.box.showModal === "function") viewer.box.showModal();
    else viewer.box.setAttribute("open", "");
    return viewer.box;
  };

  // An audit pair as the view shows it: the date of each audit, the score of the question and the auditor.
  const scoreOf = (audit, qid) => {
    const [key, index] = qid.split("-");
    const value = audit.scores?.[key]?.[Number(index)];
    return Number.isInteger(value) ? value : null;
  };
  const auditPair = (pair) => {
    const side = (label, part) => {
      const value = scoreOf(part.audit, pair.qid);
      return { label, record: part.photo, date: showDate(part.audit.date), score: value === null ? "" : `${tx("Score")} ${value} / ${SCORE_MAX}`, who: part.audit.auditor || "" };
    };
    const a = scoreOf(pair.before.audit, pair.qid);
    const b = scoreOf(pair.after.audit, pair.qid);
    return {
      title: questionLabel(pair.before.audit.template, pair.qid),
      sides: [side(tx("Before"), pair.before), side(tx("After"), pair.after)],
      change: a !== null && b !== null ? tx("Score {a} → {b} of {max}", { a, b, max: SCORE_MAX }) : "",
    };
  };
  const compareButton = (n, onClick, context) => {
    const open = button("fc-row-photos fs-ba-button", n > 1 ? tx("Before / after · {n}", { n: int.format(n) }) : tx("Before / after"));
    open.setAttribute("aria-label", `${open.textContent}, ${context}`);
    open.addEventListener("click", onClick);
    return open;
  };
  const auditHeading = (audit) => `${audit.area} · ${tx("Before / after")}`;

  // ---- The audit log: the photos of each audit, and its before and after ------------------------------------
  let drawing = 0;
  const decorateLog = async () => {
    const mine = ++drawing;
    const records = await allPhotos();
    if (!records || mine !== drawing) return;
    const counts = countsOf(records);
    const rows = savedRows();
    logBody.querySelectorAll("tr").forEach((tr) => {
      tr.querySelector(".fc-row-photos:not(.fs-ba-button)")?.remove();
      tr.querySelector(".fs-ba-button")?.remove();
      const id = tr.querySelector("[data-show]")?.dataset.show;
      const audit = rows.find((row) => row.id === id);
      if (!audit) return;
      const refs = Object.keys(counts).filter((ref) => ref.startsWith(`${id}|`));
      const n = refs.reduce((sum, ref) => sum + counts[ref], 0);
      if (!n) return;
      const open = button("fc-row-photos has-photos", tx("Photos · {n}", { n: int.format(n) }));
      open.setAttribute("aria-label", `${open.textContent}, ${audit.area}, ${showDate(audit.date)}`);
      open.addEventListener("click", () => Capture.openPhotos({
        title: `${audit.area} · ${showDate(audit.date)}`,
        tool: TOOL,
        refs: refs.sort().map((ref) => ({ ref, label: questionLabel(audit.template, ref.slice(id.length + 1)) })),
        onClose: refreshAll,
      }));
      tr.cells[1]?.append(open);
      const pairs = M ? M.photoPairs(rows, records, id) : [];
      if (pairs.length) tr.cells[1]?.append(compareButton(pairs.length, () => openCompare(auditHeading(audit), pairs.map(auditPair)), `${audit.area}, ${showDate(audit.date)}`));
    });
  };
  new MutationObserver(decorateLog).observe(logBody, { childList: true });

  // ---- The weakest questions of the audit shown: a finding with photos in two audits gets its pair ----------
  let weakDrawing = 0;
  const decorateWeak = async () => {
    const mine = ++weakDrawing;
    const panel = results?.querySelector(".fs-panel-weak[data-audit]");
    if (!panel || !panel.dataset.audit || !M) return;
    const records = await allPhotos();
    if (!records || mine !== weakDrawing || !panel.isConnected) return;
    const rows = savedRows();
    const audit = rows.find((row) => row.id === panel.dataset.audit);
    if (!audit) return;
    panel.querySelectorAll(".dl-bar[data-qid]").forEach((bar) => {
      bar.querySelector(".fs-ba-button")?.remove();
      const [pair] = M.photoPairs(rows, records, audit.id, bar.dataset.qid);
      if (!pair) return;
      const open = compareButton(1, () => openCompare(auditHeading(audit), [auditPair(pair)]), questionLabel(audit.template, pair.qid));
      bar.append(open);
    });
  };
  if (results) new MutationObserver(decorateWeak).observe(results, { childList: true });

  // ---- Red tags: a photo under the tag's id, and the "after" once it is done --------------------------------
  let tagDrawing = 0;
  const tagOf = (tr) => {
    const box = tr.querySelector("[data-done]");
    return box ? { id: box.dataset.done, done: box.checked, item: tr.cells[3]?.firstChild?.nodeValue || tr.cells[3]?.textContent || "", area: tr.cells[2]?.textContent || "" } : null;
  };
  const tagRefs = (tag, after) => [{ ref: tag.id, label: tx("Before") }, ...(after ? [{ ref: `${tag.id}${AFTER}`, label: tx("After, when done") }] : [])];
  const openTagPhotos = (tag, counts = {}) => Capture.openPhotos({
    title: `${tag.item}${tag.area ? ` · ${tag.area}` : ""}`,
    tool: TOOL,
    refs: tagRefs(tag, tag.done || counts[`${tag.id}${AFTER}`] > 0),
    onClose: refreshAll,
  });
  const tagSide = (label, record) => {
    const when = new Date(record.created);
    const iso = Number.isNaN(when.getTime()) ? "" : `${when.getFullYear()}-${String(when.getMonth() + 1).padStart(2, "0")}-${String(when.getDate()).padStart(2, "0")}`;
    return { label, record, date: iso ? showDate(iso) : "", score: "", who: "" };
  };
  const decorateTags = async () => {
    if (!tagBody) return;
    const mine = ++tagDrawing;
    const records = await allPhotos();
    if (!records || mine !== tagDrawing) return;
    const counts = countsOf(records);
    tagBody.querySelectorAll("tr").forEach((tr) => {
      tr.querySelectorAll(".fc-row-photos").forEach((node) => node.remove());
      const tag = tagOf(tr);
      if (!tag || !tr.cells[3]) return;
      const n = (counts[tag.id] || 0) + (counts[`${tag.id}${AFTER}`] || 0);
      const open = button(`fc-row-photos${n ? " has-photos" : ""}`, n ? tx("Photos · {n}", { n: int.format(n) }) : tx("Add photo"));
      open.setAttribute("aria-label", `${open.textContent}, ${tag.item}`);
      open.addEventListener("click", () => openTagPhotos(tag, counts));
      tr.cells[3].append(open);
      const pair = M ? M.tagPair(records, tag.id) : null;
      if (pair) tr.cells[3].append(compareButton(1, () => openCompare(`${tag.item} · ${tx("Before / after")}`, [{ title: [tag.area, tag.item].filter(Boolean).join(" · "), sides: [tagSide(tx("Before"), pair.before), tagSide(tx("After"), pair.after)], change: "" }]), tag.item));
    });
  };
  if (tagBody) new MutationObserver(decorateTags).observe(tagBody, { childList: true });
  // A tag marked done: the after photo is one tap away.
  tagBody?.addEventListener("change", (event) => {
    const box = event.target.closest("[data-done]");
    if (!box || !box.checked || !tagStatus) return;
    const tr = [...tagBody.querySelectorAll("[data-done]")].find((node) => node.dataset.done === box.dataset.done)?.closest("tr");
    const tag = tr ? tagOf(tr) : null;
    if (!tag) return;
    const take = button("fs-photo-offer", tx("Take the after photo"));
    take.addEventListener("click", () => { tagStatus.textContent = ""; openTagPhotos({ ...tag, done: true }); });
    tagStatus.replaceChildren(`${tx("Red tag {item} is done.", { item: tag.item })} `, take);
    clearTimeout(tagStatus.timer);
    tagStatus.timer = setTimeout(() => { tagStatus.textContent = ""; }, 12000);
  });

  const refreshAll = () => { decorateLog(); decorateWeak(); decorateTags(); };
  refreshAll();

  // ---- Removing an audit or a red tag offers to remove its photos too ----------------------------------------
  // five-s-audit.js removes the entry and offers its undo first; this adds the offer next to that undo. Photos
  // removed this way come back when the entry is put back.
  const offers = new Map();
  const offerRemoval = async (status, matches, gone, entryId) => {
    if (!status) return;
    const records = ((await allPhotos()) || []).filter((record) => matches(String(record.ref)));
    if (!records.length || !gone() || !status.querySelector(".dl-undo")) return;
    const offer = { entryId, records, removed: false };
    offers.set(status, offer);
    const remove = button("fs-photo-offer", tx("Also remove its {n} photos", { n: int.format(records.length) }));
    remove.addEventListener("click", async () => {
      for (const record of records) {
        try { await media.remove(record.id); } catch { /* one that cannot be removed stays */ }
      }
      offer.removed = true;
      remove.replaceWith(tx("{n} photos removed.", { n: int.format(records.length) }));
      refreshAll();
    });
    status.append(" ", remove);
  };
  const putBack = async (status) => {
    const offer = offers.get(status);
    offers.delete(status);
    if (!offer?.removed) return;
    for (const record of offer.records) {
      try { await media.restore(record); } catch { /* the entry is back, the photo is not */ }
    }
    refreshAll();
  };
  logBody.addEventListener("click", (event) => {
    const id = event.target.closest("[data-remove]")?.dataset.remove;
    // A new removal: an earlier offer no longer belongs to the undo shown.
    if (id) offers.delete(logStatus);
    if (id) offerRemoval(logStatus, (ref) => ref.startsWith(`${id}|`), () => !savedRows().some((row) => row.id === id), id);
  });
  tagBody?.addEventListener("click", (event) => {
    const id = event.target.closest("[data-remove-tag]")?.dataset.removeTag;
    const gone = () => { const tags = savedState().tags; return !Array.isArray(tags) || !tags.some((tag) => tag.id === id); };
    if (id) offers.delete(tagStatus);
    if (id) offerRemoval(tagStatus, (ref) => ref === id || ref === `${id}${AFTER}`, gone, id);
  });
  [logStatus, tagStatus].filter(Boolean).forEach((status) => status.addEventListener("click", (event) => {
    if (event.target.closest(".dl-undo")) putBack(status);
  }, true));

  // The draft's photos, by the start of their ref.
  const draftPhotos = async (prefix = DRAFT) => (await media.list(TOOL)).filter((record) => record.ref.startsWith(prefix));
  const refreshControls = () => Promise.all(controls.map((control) => control.refresh()));

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
    await refreshControls();
    refreshAll();
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
    await refreshControls();
  });
})();
