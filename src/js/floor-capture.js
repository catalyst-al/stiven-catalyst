// Capture on the floor: scan a code into a field, and keep photos as evidence of an entry.
// Scan: an input or select marked data-scan gets a "Scan" button that opens the rear camera in a dialog and reads QR
// codes and barcodes with the browser's BarcodeDetector; the value goes into the field with input and change events,
// as if typed. Where the browser has no BarcodeDetector, there is no button. The camera stops when the dialog closes.
// Photos: attach(container, { tool, ref }) adds an "Add photo" control with thumbnails (remove, open full size),
// kept by MediaStore (media-store.js) on this device only; an element marked data-photo-ref (with data-photo-tool)
// gets one by itself. Nothing is sent; the photos are not in the Work Backup file, and the control says so.
window.FloorCapture = (() => {
  const kit = window.ToolKit;
  const fill = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const tx = kit?.tx || fill;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text) => {
    const node = el("button", className, text);
    node.type = "button";
    return node;
  };
  const say = (node, message) => (kit?.flash ? kit.flash(node, message) : (node.textContent = message));
  const store = () => window.MediaStore || null;
  let uid = 0;

  // A dialog of this module: a heading, a body and a close button; closing it runs onClose once per opening.
  const dialog = (className) => {
    const box = el("dialog", `fc-dialog ${className}`);
    const id = `fc-dialog-${++uid}`;
    box.setAttribute("aria-labelledby", id);
    const head = el("div", "fc-dialog-head");
    const title = el("h2", null, "");
    title.id = id;
    const close = button("button-secondary fc-close", tx("Close"));
    close.addEventListener("click", () => box.close());
    head.append(title, close);
    const body = el("div", "fc-dialog-body");
    box.append(head, body);
    // A tap on the dimmed page around the dialog closes it too.
    box.addEventListener("click", (event) => { if (event.target === box) box.close(); });
    document.body.append(box);
    return { box, title, body };
  };
  const show = (box) => {
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  };

  // ---- Scan -------------------------------------------------------------------------------------------------
  const canScan = () => typeof window.BarcodeDetector === "function" && typeof navigator.mediaDevices?.getUserMedia === "function";
  let formatList = null;
  const formats = () => {
    if (!formatList) {
      formatList = !canScan() ? Promise.resolve([])
        : Promise.resolve().then(() => window.BarcodeDetector.getSupportedFormats?.() ?? ["qr_code"]).then((list) => (Array.isArray(list) ? list : [])).catch(() => []);
    }
    return formatList;
  };

  // A scanned value into a field. A select takes the option of that name (or one that starts with it), else the
  // value joins the list, so a code that names a new area is still kept.
  const setValue = (field, value) => {
    const text = String(value ?? "").trim();
    if (field.tagName === "SELECT") {
      const wanted = text.toLowerCase();
      const options = [...field.options];
      const hit = options.find((option) => option.value.toLowerCase() === wanted || option.text.toLowerCase() === wanted)
        || (wanted.length >= 3 && options.find((option) => option.text.toLowerCase().startsWith(wanted)));
      if (hit) field.value = hit.value;
      else {
        const option = el("option", null, text);
        field.append(option);
        field.value = option.value;
      }
    } else field.value = text;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    field.dispatchEvent(new Event("change", { bubbles: true }));
  };

  let scanner = null;
  const scanDialog = () => {
    if (scanner) return scanner;
    const parts = dialog("fc-scan-dialog");
    parts.title.textContent = tx("Scan a code");
    const frame = el("div", "fc-video");
    const video = el("video");
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");
    frame.append(video, el("span", "fc-aim"));
    const status = el("p", "form-note fc-scan-status");
    status.setAttribute("aria-live", "polite");
    parts.body.append(frame, status);
    scanner = { ...parts, video, status, stream: null, run: 0, field: null };
    // Closing the dialog, by the button, Escape or a tap outside, always turns the camera off.
    parts.box.addEventListener("close", () => {
      scanner.run++;
      scanner.stream?.getTracks().forEach((track) => track.stop());
      scanner.stream = null;
      video.pause();
      video.srcObject = null;
      if (scanner.field?.isConnected) scanner.field.focus();
    });
    return scanner;
  };
  const scan = async (field) => {
    const s = scanDialog();
    const run = ++s.run;
    s.field = field;
    s.status.textContent = tx("Starting the camera…");
    show(s.box);
    let detector;
    try {
      detector = new window.BarcodeDetector({ formats: await formats() });
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      if (run !== s.run) { stream.getTracks().forEach((track) => track.stop()); return; }
      s.stream = stream;
      s.video.srcObject = stream;
      await s.video.play();
    } catch {
      if (run === s.run) s.status.textContent = tx("The camera could not be opened. Allow the camera for this site, or type the value.");
      return;
    }
    s.status.textContent = tx("Point the camera at a QR code or a barcode.");
    const look = async () => {
      if (run !== s.run) return;
      let codes = [];
      try { if (s.video.readyState >= 2) codes = await detector.detect(s.video); } catch { /* a frame that cannot be read: try the next */ }
      if (run !== s.run) return;
      const code = codes.find((item) => String(item.rawValue || "").trim());
      if (code) {
        setValue(field, code.rawValue);
        s.box.close();
        const live = announcers.get(field);
        if (live) say(live, tx("Read: {value}", { value: String(code.rawValue).trim() }));
        return;
      }
      setTimeout(look, 180);
    };
    look();
  };

  const labelOf = (field) => {
    const label = field.labels?.[0] || null;
    const text = label ? [...label.childNodes].filter((node) => node.nodeType === 3).map((node) => node.textContent).join(" ").trim() : "";
    return text || field.getAttribute("aria-label") || field.name || "";
  };
  // Each scan field says what was read, for a screen reader (the dialog that showed it is gone by then).
  const announcers = new WeakMap();
  const addScan = (field) => {
    if (field.dataset.scanReady) return;
    field.dataset.scanReady = "1";
    const wrap = el("div", "fc-scan-field");
    field.before(wrap);
    wrap.append(field);
    const live = el("span", "visually-hidden");
    live.setAttribute("aria-live", "polite");
    announcers.set(field, live);
    const scanButton = button("button-secondary fc-scan", tx("Scan"));
    const name = labelOf(field);
    if (name) scanButton.setAttribute("aria-label", tx("Scan a code into {field}", { field: name }));
    scanButton.addEventListener("click", () => scan(field));
    wrap.append(scanButton, live);
  };
  const initScan = async (root = document) => {
    const fields = [...root.querySelectorAll("[data-scan]")].filter((field) => /^(INPUT|SELECT|TEXTAREA)$/.test(field.tagName));
    if (!fields.length || !(await formats()).length) return [];
    fields.forEach(addScan);
    return fields;
  };

  // ---- Photos ----------------------------------------------------------------------------------------------
  let viewer = null;
  const openFull = (record, label) => {
    if (!viewer) {
      viewer = dialog("fc-viewer");
      viewer.image = el("img", "fc-full");
      viewer.caption = el("p", "form-note");
      viewer.body.append(viewer.image, viewer.caption);
      viewer.box.addEventListener("close", () => {
        if (viewer.url) URL.revokeObjectURL(viewer.url);
        viewer.url = "";
        viewer.image.removeAttribute("src");
      });
    }
    if (viewer.url) URL.revokeObjectURL(viewer.url);
    viewer.url = URL.createObjectURL(record.blob);
    viewer.title.textContent = label;
    viewer.image.src = viewer.url;
    viewer.image.alt = label;
    viewer.image.width = record.width || 0;
    viewer.image.height = record.height || 0;
    const when = new Date(record.created);
    viewer.caption.textContent = Number.isNaN(when.getTime()) ? "" : tx("Taken {date}", { date: when.toLocaleString(document.documentElement.lang || undefined, { dateStyle: "medium", timeStyle: "short" }) });
    show(viewer.box);
  };

  const NOTE = () => tx("Photos stay on this device. The file with all your work takes them along, up to 20 MB.");
  // The photo control of one entry. Options: tool and ref (which entry), note (false when the page shows the note
  // once for many controls), onChange(count) after every change.
  const attach = (container, { tool, ref, note = true, onChange } = {}) => {
    const media = store();
    const box = el("div", "fc-photos");
    container.append(box);
    let current = String(ref ?? "");
    let records = [];
    let urls = [];
    const status = el("p", "form-note fc-photo-status");
    status.setAttribute("aria-live", "polite");
    if (!media || !media.supported()) {
      box.append(el("p", "form-note", tx("This browser cannot keep photos.")));
      return { element: box, refresh: async () => 0, setRef() {}, count: () => 0, destroy() { box.remove(); }, get ref() { return current; } };
    }
    const actions = el("div", "fc-photo-actions");
    const picker = (label, capture, className) => {
      const wrap = el("label", className);
      const input = el("input", "fc-file");
      input.type = "file";
      input.accept = "image/*";
      if (capture) input.setAttribute("capture", "environment");
      else input.multiple = true;
      wrap.append(input, el("span", null, label));
      input.addEventListener("change", async () => {
        const files = [...input.files].filter((file) => /^image\//.test(file.type) || !file.type);
        input.value = "";
        if (!files.length) return;
        say(status, tx("Saving the photo…"));
        let saved = 0, failed = 0;
        for (const file of files) {
          try { await media.add(file, { tool, ref: current }); saved++; } catch { failed++; }
        }
        await refresh();
        say(status, failed ? tx("{n} photos could not be saved. The device may be out of space, or the file is not a picture.", { n: failed })
          : saved === 1 ? tx("Photo saved on this device.") : tx("{n} photos saved on this device.", { n: saved }));
      });
      return wrap;
    };
    actions.append(picker(tx("Add photo"), true, "button-secondary fc-add"));
    // On a phone the camera opens at once; the gallery is a second way in. Elsewhere both are the same file picker.
    if (window.matchMedia?.("(pointer: coarse)").matches) actions.append(picker(tx("From the gallery"), false, "button-ghost fc-add fc-add-gallery"));
    const thumbs = el("ul", "fc-thumbs");
    thumbs.hidden = true;
    box.append(actions, thumbs, status);
    if (note) box.append(el("p", "form-note fc-photo-note", NOTE()));

    const label = (index) => tx("Photo {n}", { n: index + 1 });
    const draw = () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls = [];
      thumbs.replaceChildren();
      records.forEach((record, index) => {
        const item = el("li", "fc-thumb");
        const open = button("fc-thumb-open");
        open.setAttribute("aria-label", tx("Open photo {n} full size", { n: index + 1 }));
        const image = el("img");
        const url = URL.createObjectURL(record.blob);
        urls.push(url);
        image.src = url;
        image.alt = "";
        image.width = 72;
        image.height = 72;
        image.decoding = "async";
        open.append(image);
        open.addEventListener("click", () => openFull(record, label(index)));
        const remove = button("fc-thumb-remove", "×");
        remove.setAttribute("aria-label", tx("Remove photo {n}", { n: index + 1 }));
        remove.addEventListener("click", async () => {
          try { await media.remove(record.id); } catch { say(status, tx("The photo could not be removed.")); return; }
          await refresh();
          const undo = () => media.restore(record).then(refresh).catch(() => {});
          if (kit?.undoNote) kit.undoNote(status, tx("Photo removed."), undo);
          else say(status, tx("Photo removed."));
          (thumbs.querySelector(".fc-thumb-open") || actions.querySelector("input"))?.focus();
        });
        item.append(open, remove);
        thumbs.append(item);
      });
      thumbs.hidden = !records.length;
    };
    let asked = 0;
    const refresh = async () => {
      const mine = ++asked;
      const ask = current;
      let found = [];
      try { found = await media.list(tool, ask); } catch { found = []; }
      if (mine !== asked) return records.length;
      records = found;
      draw();
      onChange?.(records.length);
      return records.length;
    };
    const control = {
      element: box,
      refresh,
      // The entry changes (a draft saved under its id): the same control shows that entry's photos.
      setRef(next) { current = String(next ?? ""); return refresh(); },
      count: () => records.length,
      destroy() { urls.forEach((url) => URL.revokeObjectURL(url)); urls = []; box.remove(); },
      get ref() { return current; },
    };
    refresh();
    return control;
  };

  // The photos of one or more entries in a dialog: [{ ref, label }]. onClose runs when it is closed.
  let gallery = null;
  const openPhotos = ({ title, tool, refs = [], onClose } = {}) => {
    if (!gallery) {
      gallery = dialog("fc-gallery");
      gallery.box.addEventListener("close", () => {
        gallery.controls.forEach((control) => control.destroy());
        gallery.controls = [];
        const after = gallery.onClose;
        gallery.onClose = null;
        after?.();
      });
      gallery.controls = [];
    }
    gallery.controls.forEach((control) => control.destroy());
    gallery.body.replaceChildren();
    gallery.title.textContent = title || tx("Photos");
    gallery.onClose = onClose || null;
    gallery.controls = refs.map((item) => {
      const section = el("section", "fc-gallery-entry");
      if (refs.length > 1 && item.label) section.append(el("h3", null, item.label));
      gallery.body.append(section);
      return attach(section, { tool, ref: item.ref, note: false });
    });
    gallery.body.append(el("p", "form-note fc-photo-note", NOTE()));
    show(gallery.box);
    return gallery.box;
  };

  const initPhotos = (root = document) => [...root.querySelectorAll("[data-photo-ref]")]
    .filter((node) => !node.dataset.photoReady && node.dataset.photoTool)
    .map((node) => {
      node.dataset.photoReady = "1";
      return attach(node, { tool: node.dataset.photoTool, ref: node.dataset.photoRef });
    });

  const init = (root = document) => {
    initScan(root);
    initPhotos(root);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();

  return { canScan, formats, setValue, scan, initScan, attach, openPhotos, openFull, initPhotos, init, NOTE };
})();
