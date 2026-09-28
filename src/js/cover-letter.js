// Cover letter: a letter in the same design as the CV Builder (modern) or the
// ATS CV (classic), so CV and letter look like one application. It takes the
// name, photo and colours from either CV on this device, writes a first draft
// from a few answers, and saves as PDF, Word or text. Nothing leaves the browser.
(() => {
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const str = (value) => (typeof value === "string" ? value : "");

  const SHAPE = {
    docLang: "", design: "modern", theme: "", font: "", accent: "",
    photo: "", photoShape: "circle", photoY: 50,
    person: { name: "", headline: "", location: "", phone: "", email: "", website: "", address: "" },
    recipient: { company: "", department: "", contact: "", gender: "", street: "", city: "" },
    place: "", date: "", subject: "", salutation: "", body: "", closing: "", enclosures: "", signature: "",
    draft: { role: "", source: "", current: "", years: "", strength: "", achievement: "", why: "", start: "" },
  };
  const fit = (value, shape) => {
    if (isObject(shape)) {
      const source = isObject(value) ? value : {};
      return Object.fromEntries(Object.keys(shape).map((key) => [key, fit(source[key], shape[key])]));
    }
    if (typeof shape === "number") return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : shape;
    return typeof value === "string" ? value : shape;
  };
  const image = (src) => (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(src) ? src : "");
  const clean = (saved, data, lang) => {
    const letter = fit(saved, SHAPE);
    if (!data.letter.docLangs[letter.docLang]) letter.docLang = data.letter.docLangs[lang] ? lang : "en";
    if (!["modern", "classic"].includes(letter.design)) letter.design = "modern";
    if (!data.themes.some((theme) => theme.id === letter.theme)) letter.theme = data.themes[0].id;
    if (!data.fonts.some((font) => font.id === letter.font)) letter.font = data.fonts[0].id;
    if (!data.accents.some((accent) => accent.id === letter.accent)) letter.accent = data.accents[0].id;
    if (!["circle", "rounded", "none"].includes(letter.photoShape)) letter.photoShape = "circle";
    if (!["f", "m", ""].includes(letter.recipient.gender)) letter.recipient.gender = "";
    letter.photo = image(letter.photo);
    letter.signature = image(letter.signature);
    return letter;
  };
  const hasText = (value) => (typeof value === "string" ? value.trim() !== "" && !value.startsWith("data:")
    : isObject(value) ? Object.values(value).some(hasText) : false);

  // "Anna Weber" is addressed by her last name.
  const lastName = (name) => name.trim().split(/\s+/).pop() || "";
  const salutationOf = (letter, doc) => {
    const r = letter.recipient;
    const name = lastName(r.contact);
    return name && r.gender ? doc.dear[r.gender].replace("{name}", name) : doc.dear[""];
  };
  // The address block: "Frau Anna Weber" in German, "Ms Anna Weber" in English.
  const addressLines = (letter, doc) => {
    const r = letter.recipient;
    const contact = r.contact.trim() ? [doc.courtesy?.[r.gender], r.contact.trim()].filter(Boolean).join(" ") : "";
    return [r.company, r.department, contact, r.street, r.city].map((line) => line.trim()).filter(Boolean);
  };
  const subjectOf = (letter, doc) => letter.subject.trim()
    || (letter.draft.role.trim() ? doc.subject.replace("{role}", letter.draft.role.trim()) : doc.subjectPlain);

  const dateText = (letter, doc, months, now = new Date()) => {
    if (letter.date.trim()) return letter.date.trim();
    if (months[letter.docLang]) return `${now.getDate()} ${months[letter.docLang][now.getMonth()]} ${now.getFullYear()}`;
    return now.toLocaleDateString(doc.locale, { day: "numeric", month: "long", year: "numeric" });
  };

  // The first draft: each sentence is used only when every answer it needs is given.
  const draftBody = (letter, doc) => {
    const d = letter.draft;
    const values = {
      role: d.role.trim(),
      company: letter.recipient.company.trim() || doc.noCompany,
      source: d.source.trim() ? doc.source.replace("{source}", d.source.trim()) : "",
      current: d.current.trim(),
      years: d.years.trim(),
      strength: d.strength.trim().replace(/[.]$/, ""),
      achievement: d.achievement.trim(),
      why: d.why.trim(),
      start: d.start.trim(),
    };
    const optional = new Set(["source", "company"]);
    return doc.draft.map((sentences) => sentences
      .filter((sentence) => [...sentence.matchAll(/\{(\w+)\}/g)].every(([, key]) => optional.has(key) || values[key]))
      .map((sentence) => sentence.replace(/\{(\w+)\}/g, (m, key) => values[key]))
      .join(" "))
      .filter((para) => para.trim())
      .join("\n\n");
  };

  const paragraphs = (text) => text.trim() ? text.trim().split(/\n\s*\n/).map((para) => para.replace(/\s*\n\s*/g, " ").trim()) : [];
  const words = (text) => (text.match(/[\p{L}\p{N}]+/gu) || []).length;

  const plainText = (letter, data, now) => {
    const doc = data.letter.docLangs[letter.docLang];
    const p = letter.person;
    const out = [];
    out.push(p.name.trim(), [p.address.trim() || p.location.trim(), p.phone.trim(), p.email.trim(), p.website.trim()].filter(Boolean).join(" | "), "");
    addressLines(letter, doc).forEach((line) => out.push(line));
    out.push("", [letter.place.trim() || p.location.trim(), dateText(letter, doc, data.letter.months, now)].filter(Boolean).join(", "), "");
    out.push(subjectOf(letter, doc), "", letter.salutation.trim() || salutationOf(letter, doc), "");
    paragraphs(letter.body).forEach((para) => out.push(para, ""));
    out.push(letter.closing.trim() || doc.closing, "", p.name.trim());
    if (letter.enclosures.trim()) out.push("", `${doc.enclosures}: ${letter.enclosures.trim()}`);
    return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
  };

  const docx = (letter, data, now) => {
    const { run, para, wordFile } = window.DocxKit;
    const doc = data.letter.docLangs[letter.docLang];
    const accentColor = letter.design === "modern"
      ? (data.themes.find((theme) => theme.id === letter.theme) || data.themes[0]).dark
      : (data.accents.find((accent) => accent.id === letter.accent) || data.accents[0]).color;
    const font = letter.design === "classic" ? (data.fonts.find((item) => item.id === letter.font) || data.fonts[0]).word : "Arial";
    const p = letter.person;
    const body = [];
    const empty = () => body.push(para(""));
    body.push(para(run(p.name.trim(), `<w:b/><w:color w:val="${accentColor.slice(1)}"/><w:sz w:val="36"/>`)));
    if (p.headline.trim()) body.push(para(run(p.headline.trim(), '<w:sz w:val="22"/>')));
    const contact = [p.address.trim() || p.location.trim(), p.phone.trim(), p.email.trim(), p.website.trim()].filter(Boolean);
    if (contact.length) body.push(para(run(contact.join("  |  "), '<w:color w:val="555555"/>'), '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="4" w:color="BBBBBB"/></w:pBdr>'));
    empty();
    addressLines(letter, doc)
      .forEach((line, i) => body.push(para(run(line, i ? "" : "<w:b/>"), '<w:spacing w:after="0"/>')));
    empty();
    body.push(para(run([letter.place.trim() || p.location.trim(), dateText(letter, doc, data.letter.months, now)].filter(Boolean).join(", ")), '<w:jc w:val="right"/>'));
    empty();
    body.push(para(run(subjectOf(letter, doc), "<w:b/>")));
    empty();
    body.push(para(run(letter.salutation.trim() || salutationOf(letter, doc)), '<w:spacing w:after="120"/>'));
    paragraphs(letter.body).forEach((text) => body.push(para(run(text), '<w:spacing w:after="120"/><w:jc w:val="both"/>')));
    body.push(para(run(letter.closing.trim() || doc.closing), '<w:spacing w:before="120"/>'));
    empty();
    empty();
    body.push(para(run(p.name.trim())));
    if (letter.enclosures.trim()) {
      empty();
      body.push(para(`${run(`${doc.enclosures}: `, "<w:b/>")}${run(letter.enclosures.trim())}`));
    }
    return wordFile({ body, font, accent: accentColor.slice(1), lang: letter.docLang, title: [p.name.trim(), doc.doc].filter(Boolean).join(" – "), creator: p.name.trim() });
  };

  // Details from the CV Builder or the ATS CV on this device.
  const fromCv = (saved, source) => {
    if (!isObject(saved) || !isObject(saved.person)) return null;
    const person = Object.fromEntries(Object.keys(SHAPE.person).map((key) => [key, str(saved.person[key])]));
    const out = { person, docLang: str(saved.docLang) };
    if (source === "builder") Object.assign(out, { design: "modern", theme: str(saved.theme), photo: image(str(saved.photo)), photoShape: str(saved.photoShape), photoY: Number.isFinite(saved.photoY) ? saved.photoY : 50 });
    else Object.assign(out, { design: "classic", font: str(saved.font), accent: str(saved.accent) });
    return out;
  };

  window.CoverLetter = { fit, clean, addressLines, salutationOf, subjectOf, draftBody, plainText, docx, fromCv, dateText, SHAPE };

  // ======================================================================
  const app = document.querySelector("[data-letter]");
  const dataEl = document.getElementById("cover-letter-data");
  if (!app || !dataEl || !window.ToolKit) return;
  const { LANG, tx, el, read } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const L = data.letter;
  const KEY = L.storageKey;
  const form = app.querySelector("[data-cv-form]");
  const stage = app.querySelector("[data-stage]");
  const scaler = app.querySelector("[data-scale]");
  const status = app.querySelector("[data-status]");
  const checkBox = app.querySelector("[data-check]");
  const checkBadge = app.querySelector("[data-check-badge]");
  const sourceNote = app.querySelector("[data-source-note]");
  const PAGE_H = 1123;
  const TOP = 56;
  const BOTTOM = 56;

  const readJson = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return isObject(value) && isObject(value.person) && hasText(value.person) ? value : null;
    } catch {
      return null;
    }
  };
  let letter = (() => {
    const saved = read(KEY, null);
    if (isObject(saved)) return clean(saved, data, LANG);
    const start = clean({}, data, LANG);
    const found = fromCv(readJson(L.cvBuilderKey), "builder") || fromCv(readJson(L.atsKey), "ats");
    if (found) {
      Object.assign(start, clean({ ...start, ...found }, data, LANG));
      setTimeout(() => { sourceNote.textContent = tx("Your name and contact details are taken from your CV on this device."); });
    }
    return start;
  })();
  const doc = () => L.docLangs[letter.docLang];

  const keys = (path) => path.split(".");
  const getPath = (path) => keys(path).reduce((node, key) => (node == null ? undefined : node[key]), letter);
  const setPath = (path, value) => {
    const parts = keys(path);
    const last = parts.pop();
    const parent = parts.reduce((node, key) => (node == null ? undefined : node[key]), letter);
    if (parent == null || !Object.prototype.hasOwnProperty.call(parent, last)) return;
    parent[last] = value;
  };

  let sayTimer;
  const say = (text) => {
    status.textContent = text;
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => { status.textContent = ""; }, 5000);
  };
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(letter));
    } catch {
      say(tx("This browser could not save your letter (storage is full, blocked or private). Download it as a Word file to keep it."));
    }
  };

  // ---------- The letter ----------
  const joined = (parts, className = "cv-sep") => {
    const frag = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (i) frag.append(el("span", className, "|"));
      frag.append(el("span", null, part));
    });
    return frag;
  };
  const header = () => {
    const p = letter.person;
    const contact = [p.address.trim() || p.location.trim(), p.phone.trim(), p.email.trim(), p.website.trim()].filter(Boolean);
    const name = p.name.trim() || (letter.docLang === "de" ? "Ihr Name" : letter.docLang === "sq" ? "Emri juaj" : "Your Name");
    if (letter.design === "modern") {
      const band = el("header", "cv-head");
      if (letter.photo && letter.photoShape !== "none") {
        const frame = el("div", `cv-photo is-${letter.photoShape}`);
        const img = new Image();
        img.alt = "";
        img.src = letter.photo;
        img.style.objectPosition = `50% ${letter.photoY}%`;
        frame.append(img);
        band.append(frame);
      }
      const text = el("div", "cv-head-text");
      const title = el("h1", "cv-name", name);
      title.classList.toggle("is-placeholder", !p.name.trim());
      text.append(title);
      if (p.headline.trim()) {
        const line = el("p", "cv-headline");
        line.append(joined(p.headline.split("|").map((part) => part.trim()).filter(Boolean), "cv-sep-gold"));
        text.append(line);
      }
      if (contact.length) {
        const line = el("p", "cv-contact");
        line.append(joined(contact));
        text.append(line);
      }
      band.append(text);
      return band;
    }
    const head = el("header", "cl-head");
    const title = el("h1", "cl-name", name);
    title.classList.toggle("is-placeholder", !p.name.trim());
    head.append(title);
    if (p.headline.trim()) head.append(el("p", "cl-headline", p.headline.trim()));
    if (contact.length) head.append(el("p", "cl-contact", contact.join("  |  ")));
    return head;
  };

  const blocks = () => {
    const out = [];
    const add = (node, space) => out.push({ node, space });
    const p = letter.person;
    add(header(), 0);
    const meta = el("div", "cl-meta");
    const address = el("div", "cl-address");
    addressLines(letter, doc())
      .forEach((line, i) => address.append(el("p", i ? null : "cl-company", line)));
    meta.append(address, el("p", "cl-date", [letter.place.trim() || p.location.trim(), dateText(letter, doc(), L.months)].filter(Boolean).join(", ")));
    add(meta, 40);
    add(el("h2", "cl-subject", subjectOf(letter, doc())), 34);
    add(el("p", "cl-salutation", letter.salutation.trim() || salutationOf(letter, doc())), 20);
    const paras = paragraphs(letter.body);
    (paras.length ? paras : [tx("Write your letter here, or answer the questions under “First draft” and let the page write it.")]).forEach((text, i) => {
      const node = el("p", "cl-para", text);
      node.classList.toggle("is-placeholder", !paras.length);
      add(node, i ? 10 : 12);
    });
    const sign = el("div", "cl-sign");
    sign.append(el("p", null, letter.closing.trim() || doc().closing));
    if (letter.signature) {
      const img = new Image();
      img.alt = "";
      img.src = letter.signature;
      img.className = "cl-signature";
      sign.append(img);
    } else sign.append(el("div", "cl-signature-space"));
    sign.append(el("p", "cl-signed", p.name.trim()));
    add(sign, 18);
    if (letter.enclosures.trim()) {
      const line = el("p", "cl-enclosures");
      line.append(el("strong", null, `${doc().enclosures}: `), letter.enclosures.trim());
      add(line, 26);
    }
    return out;
  };

  const measure = el("div", "cv-page cl-page cv-measure");
  let pageCount = 1;
  const renderLetter = () => {
    const theme = data.themes.find((item) => item.id === letter.theme) || data.themes[0];
    const accent = data.accents.find((item) => item.id === letter.accent) || data.accents[0];
    const font = data.fonts.find((item) => item.id === letter.font) || data.fonts[0];
    scaler.style.setProperty("--cv-dark", theme.dark);
    scaler.style.setProperty("--cv-accent", theme.accent);
    scaler.style.setProperty("--cv-gold", theme.gold);
    scaler.style.setProperty("--cv-soft", theme.soft);
    scaler.style.setProperty("--cl-accent", letter.design === "modern" ? theme.dark : accent.color);
    scaler.style.setProperty("--cl-font", letter.design === "modern" ? "" : font.css);
    scaler.classList.toggle("is-classic", letter.design === "classic");
    scaler.lang = letter.docLang;
    const list = blocks();
    measure.classList.toggle("is-first", true);
    measure.replaceChildren(...list.map((block) => block.node));
    scaler.append(measure);
    list.forEach((block) => { block.height = block.node.offsetHeight; });
    measure.remove();
    // Pages: the letter flows paragraph by paragraph.
    const pages = [[]];
    let used = 0;
    const firstTop = letter.design === "modern" ? 0 : TOP;
    list.forEach((block, i) => {
      const limit = PAGE_H - BOTTOM - (pages.length === 1 ? firstTop : TOP);
      const gap = pages[pages.length - 1].length ? block.space : 0;
      if (pages[pages.length - 1].length && used + gap + block.height > limit) {
        pages.push([i]);
        used = block.height;
      } else {
        pages[pages.length - 1].push(i);
        used += gap + block.height;
      }
    });
    pageCount = pages.length;
    scaler.replaceChildren(...pages.map((indices, n) => {
      const page = el("div", `cv-page cl-page${n === 0 && letter.design === "modern" ? " is-first" : ""}`);
      indices.forEach((index, i) => {
        list[index].node.style.marginTop = i ? `${list[index].space}px` : "";
        page.append(list[index].node);
      });
      return page;
    }));
    fitStage();
    renderChecks();
  };
  const fitStage = () => {
    const width = stage.clientWidth;
    if (!width) return;
    const scale = Math.min(1, width / 794);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.marginLeft = `${Math.max(0, (width - 794 * scale) / 2)}px`;
    stage.style.height = `${Math.ceil(scaler.offsetHeight * scale)}px`;
  };
  if ("ResizeObserver" in window) new ResizeObserver(fitStage).observe(stage);
  else window.addEventListener("resize", fitStage);

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(renderLetter);
  };
  let saveTimer;
  const changed = () => {
    schedule();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 300);
  };
  window.addEventListener("pagehide", () => { clearTimeout(saveTimer); save(); });

  const renderChecks = () => {
    const bodyWords = words(letter.body);
    const company = letter.recipient.company.trim();
    const checks = [
      [letter.person.name.trim() && letter.person.email.trim() && letter.person.phone.trim(), tx("Your name, phone and email are at the top.")],
      [company && letter.recipient.street.trim() && letter.recipient.city.trim(), tx("The company's full address is there.")],
      [letter.recipient.contact.trim() && letter.recipient.gender, tx("You write to a person by name, not “Dear Sir or Madam”.")],
      [letter.subject.trim() || letter.draft.role.trim(), tx("The subject names the position.")],
      [company && letter.body.toLowerCase().includes(company.toLowerCase()), tx("The letter names the company at least once.")],
      [bodyWords >= 150 && bodyWords <= 400, tx("150–400 words (now {n}).", { n: bodyWords })],
      [pageCount === 1, tx("It fits on one page.")],
    ];
    const passed = checks.filter(([ok]) => ok).length;
    const listEl = el("ul", "cv-checks");
    checks.forEach(([ok, text]) => {
      const item = el("li", ok ? "is-ok" : "is-open");
      item.append(el("span", "cv-check-mark", ok ? "✓" : "!"), el("span", null, text));
      listEl.append(item);
    });
    checkBox.replaceChildren(listEl);
    checkBadge.textContent = tx("Letter check: {a} of {b}", { a: passed, b: checks.length });
    checkBadge.classList.toggle("is-done", passed === checks.length);
  };

  // ---------- Editor ----------
  const syncForm = () => {
    form.querySelectorAll("[data-path]").forEach((node) => {
      const value = getPath(node.dataset.path);
      if (node.type === "radio") node.checked = node.value === String(value);
      else node.value = value ?? "";
    });
    const d = doc();
    form.querySelector('[data-path="salutation"]').placeholder = salutationOf(letter, d);
    form.querySelector('[data-path="subject"]').placeholder = subjectOf(letter, d);
    form.querySelector('[data-path="closing"]').placeholder = d.closing;
    form.querySelector('[data-path="enclosures"]').placeholder = d.enclosuresDefault;
    form.querySelector('[data-path="date"]').placeholder = dateText({ ...letter, date: "" }, d, L.months);
    form.querySelector('[data-path="place"]').placeholder = letter.person.location;
    app.querySelectorAll("[data-design-only]").forEach((node) => { node.hidden = node.dataset.designOnly !== letter.design; });
    renderThumbs();
  };
  const renderThumbs = () => {
    [["photo", "[data-photo-thumb]"], ["signature", "[data-signature-thumb]"]].forEach(([key, selector]) => {
      const thumb = form.querySelector(selector);
      thumb.replaceChildren();
      if (letter[key]) {
        const img = new Image();
        img.alt = "";
        img.src = letter[key];
        thumb.append(img);
      }
      thumb.classList.toggle("has-photo", Boolean(letter[key]));
      form.querySelector(`[data-act="clear"][data-path="${key}"]`).hidden = !letter[key];
    });
  };

  form.addEventListener("input", (event) => {
    const target = event.target;
    const path = target.dataset.path;
    if (!path || target.type === "file") return;
    setPath(path, target.type === "range" ? Number(target.value) : target.value);
    if (path === "docLang" || path === "design" || path.startsWith("recipient") || path.startsWith("draft.role") || path === "person.location") {
      const d = doc();
      form.querySelector('[data-path="salutation"]').placeholder = salutationOf(letter, d);
      form.querySelector('[data-path="subject"]').placeholder = subjectOf(letter, d);
      if (path === "docLang" || path === "design") syncForm();
    }
    changed();
  });

  const readImage = (file, max, type) => new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type) || file.size > 20e6) return reject(new Error("type"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.naturalWidth || max, img.naturalHeight || max));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round((img.naturalWidth || max) * scale));
      canvas.height = Math.max(1, Math.round((img.naturalHeight || max) * scale));
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("read")); };
    img.src = url;
  });
  form.addEventListener("change", async (event) => {
    const path = event.target.dataset.upload;
    if (!path || !event.target.files?.[0]) return;
    try {
      letter[path] = await readImage(event.target.files[0], path === "photo" ? 640 : 600, path === "photo" ? "image/jpeg" : "image/png");
      renderThumbs();
      changed();
    } catch {
      say(tx("This file could not be read as a picture. Use a JPG, PNG or WebP."));
    }
    event.target.value = "";
  });

  const download = (name, content, type) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = el("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileName = () => ([letter.person.name.trim(), doc().doc].filter(Boolean).join(" ") || "letter")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();

  const take = (source) => {
    const found = source === "builder" ? fromCv(readJson(L.cvBuilderKey), "builder") : fromCv(readJson(L.atsKey), "ats");
    if (!found) {
      sourceNote.textContent = source === "builder"
        ? tx("No CV from the CV Builder was found on this device. Fill it in there first, or type your details here.")
        : tx("No ATS CV was found on this device. Fill it in there first, or type your details here.");
      return;
    }
    letter = clean({ ...letter, ...found }, data, LANG);
    syncForm();
    changed();
    sourceNote.textContent = source === "builder"
      ? tx("Name, contact, photo and colours are taken from the CV Builder: letter and CV now match.")
      : tx("Name, contact, font and colour are taken from the ATS CV: letter and CV now match.");
  };
  const actions = {
    "from-builder": () => take("builder"),
    "from-ats": () => take("ats"),
    draft: () => {
      const text = draftBody(letter, doc());
      if (!text) { say(tx("Answer at least the position and one more question first.")); return; }
      if (letter.body.trim() && !window.confirm(tx("Replace the text of your letter with the new draft?"))) return;
      letter.body = text;
      syncForm();
      changed();
      say(tx("Draft written. Now make it yours: every sentence should sound like you."));
    },
    example: () => {
      if (hasText({ ...letter, docLang: "", design: "", theme: "", font: "", accent: "", photoShape: "" }) && !window.confirm(tx("Replace your letter with the example?"))) return;
      const example = L.example[letter.docLang] || L.example.en;
      letter = clean({ ...letter, ...JSON.parse(JSON.stringify(example)), body: "", subject: "", salutation: "", date: "", place: "" }, data, LANG);
      letter.body = draftBody(letter, doc());
      syncForm();
      changed();
      say(tx("Example loaded. Change anything; it updates as you type."));
    },
    clear: (path) => {
      letter[path] = "";
      renderThumbs();
      changed();
    },
    reset: () => {
      if (!window.confirm(tx("Delete this letter from this browser and start again?"))) return;
      const next = clean({ docLang: letter.docLang, design: letter.design, theme: letter.theme, font: letter.font, accent: letter.accent, person: letter.person, photo: letter.photo, photoShape: letter.photoShape, photoY: letter.photoY, signature: letter.signature }, data, LANG);
      letter = next;
      syncForm();
      changed();
      say(tx("Cleared. Your own details are kept."));
    },
    word: () => {
      download(`${fileName()}.docx`, docx(letter, data), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    },
    copy: async () => {
      const text = plainText(letter, data);
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const area = el("textarea");
        area.value = text;
        document.body.append(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      say(tx("Copied as plain text, ready for an email or a portal."));
    },
    print: () => {
      const print = () => {
        cancelAnimationFrame(frame);
        renderLetter();
        const title = document.title;
        document.title = [letter.person.name.trim(), doc().doc].filter(Boolean).join(" – ") || title;
        window.addEventListener("afterprint", () => { document.title = title; }, { once: true });
        window.print();
      };
      // First a short guide to saving the PDF (print-guide.js).
      if (window.PrintGuide) window.PrintGuide.open(print, { colours: letter.design === "modern" });
      else print();
    },
  };
  app.addEventListener("click", (event) => {
    const node = event.target.closest("[data-act]");
    if (!node || !actions[node.dataset.act]) return;
    node.closest("details.cv-more")?.removeAttribute("open");
    actions[node.dataset.act](node.dataset.path, node);
  });

  syncForm();
  renderLetter();
  document.fonts?.ready.then(schedule);
})();
