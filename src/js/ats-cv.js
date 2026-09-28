// ATS CV: a plain, one-column CV that application software reads without
// mistakes. It can start from an existing CV (PDF, Word or pasted text, read by
// cv-import.js), from the CV Builder on this device, or from scratch, and it
// saves as PDF, as a Word file and as plain text. Nothing leaves the browser.
(() => {
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const copy = (value) => JSON.parse(JSON.stringify(value));

  // ---------- The shape of an ATS CV ----------
  const JOB = { title: "", company: "", location: "", from: "", to: "", bullets: "" };
  const SHAPE = {
    docLang: "",
    font: "",
    accent: "",
    person: { name: "", headline: "", location: "", phone: "", email: "", website: "", extra: "" },
    summary: "",
    highlights: "",
    experience: [JOB],
    education: [{ title: "", school: "", date: "", detail: "" }],
    skills: [{ title: "", text: "" }],
    languages: [{ name: "", level: "" }],
    extras: [{ title: "", text: "" }],
    headings: { summary: "", highlights: "", experience: "", education: "", skills: "", languages: "" },
    jobAd: "",
  };
  const MAX_ITEMS = 60;
  const fit = (value, shape) => {
    if (Array.isArray(shape)) return Array.isArray(value) ? value.filter(isObject).slice(0, MAX_ITEMS).map((item) => fit(item, shape[0])) : [];
    if (isObject(shape)) {
      const source = isObject(value) ? value : {};
      return Object.fromEntries(Object.keys(shape).map((key) => [key, fit(source[key], shape[key])]));
    }
    return typeof value === "string" ? value : shape;
  };
  const clean = (saved, data, lang) => {
    const cv = fit(saved, SHAPE);
    if (!data.docLangs[cv.docLang]) cv.docLang = data.docLangs[lang] ? lang : "en";
    if (!data.fonts.some((font) => font.id === cv.font)) cv.font = data.fonts[0].id;
    if (!data.accents.some((accent) => accent.id === cv.accent)) cv.accent = data.accents[0].id;
    return cv;
  };
  const hasText = (value) => (typeof value === "string" ? value.trim() !== ""
    : Array.isArray(value) ? value.some(hasText)
    : isObject(value) ? Object.values(value).some(hasText) : false);
  const lines = (text) => String(text ?? "").split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-•–·▪●]|\*(?!\*))\s*/, "").trim())
    .filter(Boolean);
  const unbold = (text) => String(text).replace(/\*\*(.+?)\*\*/g, "$1");

  // A CV from the CV Builder (saved on this device, or one of its examples).
  const fromBuilder = (b, sideTitles = {}) => {
    const person = isObject(b.person) ? b.person : {};
    const str = (value) => (typeof value === "string" ? value : "");
    const list = (value) => (Array.isArray(value) ? value.filter(isObject) : []);
    const figures = list(b.stats).filter((stat) => str(stat.value).trim() && str(stat.label).trim()).map((stat) => `${stat.value.trim()} ${stat.label.trim()}`);
    const lang = str(b.docLang) || "en";
    const side = list(b.side).filter(hasText);
    return {
      docLang: lang,
      person: Object.fromEntries(Object.keys(SHAPE.person).map((key) => [key, str(person[key])])),
      summary: str(b.profile),
      highlights: [...figures, ...lines(str(b.highlights))].join("\n"),
      experience: list(b.groups).flatMap((group) => list(group.entries).flatMap((entry) => list(entry.roles).filter(hasText).map((role) => ({
        title: str(role.title),
        company: str(entry.company),
        location: [str(entry.note), str(entry.location)].map((part) => part.trim()).filter(Boolean).join(" | "),
        from: str(role.from),
        to: str(role.to),
        bullets: str(role.bullets),
      })))),
      education: list(b.education).map((item) => ({ title: str(item.title), school: str(item.school), date: str(item.date), detail: str(item.detail) })),
      skills: list(b.skills).map((item) => ({ title: str(item.title), text: str(item.text) })),
      languages: list(b.languages).map((item) => ({ name: str(item.name), level: str(item.level) })),
      extras: side.length ? [{
        title: str(b.headings?.side).trim() || sideTitles[lang] || "",
        text: side.map((item) => [[str(item.title), str(item.meta)].filter((part) => part.trim()).join(" | "), str(item.text)].filter((part) => part.trim()).join("\n")).join("\n"),
      }] : [],
    };
  };

  // ---------- Job ad keywords ----------
  const tokens = (text) => String(text ?? "").toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}+#&./-]*[\p{L}\p{N}+#]|[\p{L}]/gu) || [];
  const keywords = (ad, stopwords, limit = 24) => {
    const stop = new Set(stopwords);
    const seq = tokens(ad);
    const useful = (word) => word.length >= 3 && !stop.has(word) && !/^\d+$/.test(word) && !/^\d/.test(word);
    const uni = new Map();
    const bi = new Map();
    seq.forEach((word, i) => {
      if (!useful(word)) return;
      uni.set(word, (uni.get(word) || 0) + 1);
      const next = seq[i + 1];
      if (next && useful(next)) bi.set(`${word} ${next}`, (bi.get(`${word} ${next}`) || 0) + 1);
    });
    const pairs = [...bi].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, 8).map(([term]) => term);
    const inPair = new Set(pairs.flatMap((pair) => pair.split(" ")));
    const singles = [...uni].filter(([word]) => !inPair.has(word)).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).map(([word]) => word);
    return [...pairs, ...singles].slice(0, limit);
  };
  // "kommunikation" also counts when the CV says "kommunikativ".
  const hasTerm = (text, term) => text.includes(term) || (term.length >= 8 && !term.includes(" ") && text.includes(term.slice(0, -3)));

  // ---------- Plain text ----------
  const period = (from, to, present) => {
    const start = from.trim();
    const end = to.trim();
    if (start && end) return `${start} – ${end}`;
    return start ? `${start} – ${present}` : end;
  };
  const headingOf = (cv, doc, key) => cv.headings[key]?.trim() || doc.headings[key];
  const plainText = (cv, doc) => {
    const out = [];
    const p = cv.person;
    const section = (title, body) => { if (body.length) out.push("", title.toUpperCase(), ...body); };
    if (p.name.trim()) out.push(p.name.trim());
    if (p.headline.trim()) out.push(p.headline.trim());
    const contact = [p.location, p.phone, p.email, p.website, p.extra].map((part) => part.trim()).filter(Boolean);
    if (contact.length) out.push(contact.join(" | "));
    section(headingOf(cv, doc, "summary"), cv.summary.trim() ? cv.summary.trim().split(/\n\s*\n/).map((para) => unbold(para.replace(/\s*\n\s*/g, " "))) : []);
    section(headingOf(cv, doc, "highlights"), lines(cv.highlights).map((line) => `- ${unbold(line)}`));
    // Entries are separated by an empty line.
    const entries = (items) => items.flatMap((item, i) => [...(i ? [""] : []), ...item.filter(Boolean)]);
    section(headingOf(cv, doc, "experience"), entries(cv.experience.filter(hasText).map((job) => [
      job.title.trim(),
      [job.company, job.location, period(job.from, job.to, doc.present)].map((part) => part.trim()).filter(Boolean).join(" | "),
      ...lines(job.bullets).map((line) => `- ${unbold(line)}`),
    ])));
    section(headingOf(cv, doc, "education"), entries(cv.education.filter(hasText).map((item) => [
      item.title.trim(),
      [item.school, item.date].map((part) => part.trim()).filter(Boolean).join(" | "),
      item.detail.trim(),
    ])));
    section(headingOf(cv, doc, "skills"), cv.skills.filter(hasText).map((item) => [item.title.trim(), item.text.trim()].filter(Boolean).join(": ")));
    section(headingOf(cv, doc, "languages"), cv.languages.filter(hasText).length ? [cv.languages.filter(hasText).map((item) => item.level.trim() ? `${item.name.trim()} (${item.level.trim()})` : item.name.trim()).join(", ")] : []);
    cv.extras.filter(hasText).forEach((extra) => section(extra.title.trim() || "—", lines(extra.text).map(unbold)));
    return `${out.join("\n").trim()}\n`;
  };

  // ---------- Word file (docx-kit.js writes the file) ----------
  const docx = (cv, data) => {
    const doc = data.docLangs[cv.docLang];
    const font = (data.fonts.find((item) => item.id === cv.font) || data.fonts[0]).word;
    const accent = (data.accents.find((item) => item.id === cv.accent) || data.accents[0]).color.slice(1);
    const { run, rich, para, TEXT_WIDTH: W } = window.DocxKit;
    const body = [];
    const p = cv.person;
    body.push(para(run(p.name.trim() || doc.yourName), '<w:pStyle w:val="Title"/>'));
    if (p.headline.trim()) body.push(para(run(p.headline.trim(), '<w:sz w:val="23"/>'), '<w:spacing w:after="40"/>'));
    const contact = [p.location, p.phone, p.email, p.website, p.extra].map((part) => part.trim()).filter(Boolean);
    if (contact.length) body.push(para(run(contact.join("  |  "), '<w:color w:val="444444"/>')));
    const heading = (text) => body.push(para(run(text), '<w:pStyle w:val="Heading1"/>'));
    const bullet = (text) => body.push(para(`<w:r><w:t xml:space="preserve">•</w:t></w:r><w:r><w:tab/></w:r>${rich(text)}`, '<w:tabs><w:tab w:val="left" w:pos="284"/></w:tabs><w:ind w:left="284" w:hanging="284"/><w:spacing w:after="20"/>'));
    const titleRow = (title, when, first) => body.push(para(`${run(title, "<w:b/>")}${when ? `<w:r><w:tab/></w:r>${run(when, '<w:b/><w:color w:val="444444"/>')}` : ""}`,
      `<w:keepNext/><w:tabs><w:tab w:val="right" w:pos="${W}"/></w:tabs><w:spacing w:before="${first ? 0 : 140}" w:after="0"/>`));
    const subRow = (text) => body.push(para(run(text, '<w:color w:val="444444"/>'), '<w:keepNext/><w:spacing w:after="40"/>'));

    if (cv.summary.trim()) {
      heading(headingOf(cv, doc, "summary"));
      cv.summary.trim().split(/\n\s*\n/).forEach((text) => body.push(para(rich(text.replace(/\s*\n\s*/g, " ")))));
    }
    if (lines(cv.highlights).length) {
      heading(headingOf(cv, doc, "highlights"));
      lines(cv.highlights).forEach(bullet);
    }
    const jobs = cv.experience.filter(hasText);
    if (jobs.length) {
      heading(headingOf(cv, doc, "experience"));
      jobs.forEach((job, i) => {
        titleRow(job.title.trim(), period(job.from, job.to, doc.present), !i);
        const sub = [job.company, job.location].map((part) => part.trim()).filter(Boolean).join(" | ");
        if (sub) subRow(sub);
        lines(job.bullets).forEach(bullet);
      });
    }
    const schools = cv.education.filter(hasText);
    if (schools.length) {
      heading(headingOf(cv, doc, "education"));
      schools.forEach((item, i) => {
        titleRow(item.title.trim(), item.date.trim(), !i);
        if (item.school.trim()) subRow(item.school.trim());
        if (item.detail.trim()) body.push(para(rich(item.detail.trim())));
      });
    }
    const skills = cv.skills.filter(hasText);
    if (skills.length) {
      heading(headingOf(cv, doc, "skills"));
      skills.forEach((item) => body.push(para(`${item.title.trim() ? run(`${item.title.trim()}: `, "<w:b/>") : ""}${run(item.text.trim())}`)));
    }
    const langs = cv.languages.filter(hasText);
    if (langs.length) {
      heading(headingOf(cv, doc, "languages"));
      body.push(para(run(langs.map((item) => item.level.trim() ? `${item.name.trim()} (${item.level.trim()})` : item.name.trim()).join(", "))));
    }
    cv.extras.filter(hasText).forEach((extra) => {
      heading(extra.title.trim() || "—");
      lines(extra.text).forEach((line) => body.push(para(rich(line))));
    });

    return window.DocxKit.wordFile({ body, font, accent, lang: cv.docLang, title: [p.name.trim(), doc.doc].filter(Boolean).join(" – "), creator: p.name.trim() });
  };

  // Pages: blocks fill a page until the next one no longer fits; a heading moves with the block under it.
  const paginate = (blocks, limit) => {
    const pages = [[]];
    let used = 0;
    blocks.forEach((block, index) => {
      const page = pages[pages.length - 1];
      const gap = page.length ? block.space : 0;
      const next = blocks[index + 1];
      const need = gap + block.height + (block.keep && next ? next.space + next.height : 0);
      if (page.length && used + need > limit) {
        pages.push([index]);
        used = block.height;
      } else {
        page.push(index);
        used += gap + block.height;
      }
    });
    return pages;
  };

  window.AtsCv = { fit, clean, fromBuilder, keywords, hasTerm, plainText, docx, paginate, SHAPE };

  // ======================================================================
  const app = document.querySelector("[data-ats]");
  const dataEl = document.getElementById("ats-cv-data");
  if (!app || !dataEl || !window.ToolKit) return;

  const { LANG, tx, el, read } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const builder = JSON.parse(document.getElementById("ats-builder-data")?.textContent || "{}");
  const sideTitles = Object.fromEntries(Object.entries(builder.docLangs || {}).map(([code, lang]) => [code, lang.headings?.side || ""]));
  const STOP = data.stopwords.split(/\s+/);
  const KEY = data.storageKey;
  const scriptUrl = document.currentScript?.src || window.location.href;
  const PDFJS = new URL("vendor/pdfjs/pdf.min.mjs", scriptUrl).href;
  const PDFJS_WORKER = new URL("vendor/pdfjs/pdf.worker.min.mjs", scriptUrl).href;

  const form = app.querySelector("[data-cv-form]");
  const stage = app.querySelector("[data-stage]");
  const scaler = app.querySelector("[data-scale]");
  const status = app.querySelector("[data-status]");
  const checkBox = app.querySelector("[data-check]");
  const checkBadge = app.querySelector("[data-check-badge]");
  const matchBox = app.querySelector("[data-match]");
  const importNote = app.querySelector("[data-import-note]");
  const dropZone = app.querySelector("[data-drop]");
  const builderButton = app.querySelector('[data-act="from-builder"]');
  const lists = Object.fromEntries([...app.querySelectorAll("[data-list]")].map((box) => [box.dataset.list, box]));

  const PAGE_W = 794;
  const PAGE_H = 1123;
  const TOP = 60;
  const BOTTOM = 64;

  const blank = () => {
    const cv = clean({}, data, LANG);
    cv.experience = [copy(JOB)];
    cv.education = [copy(SHAPE.education[0])];
    cv.skills = [copy(SHAPE.skills[0])];
    cv.languages = [copy(SHAPE.languages[0])];
    return cv;
  };
  let cv = (() => {
    const saved = read(KEY, null);
    return isObject(saved) ? clean(saved, data, LANG) : blank();
  })();
  const doc = () => data.docLangs[cv.docLang];
  const heading = (key) => headingOf(cv, doc(), key);

  const keys = (path) => path.split(".").map((key) => (/^\d+$/.test(key) ? Number(key) : key));
  const getPath = (path) => keys(path).reduce((node, key) => (node == null ? undefined : node[key]), cv);
  const setPath = (path, value) => {
    const parts = keys(path);
    const last = parts.pop();
    const parent = parts.reduce((node, key) => (node == null ? undefined : node[key]), cv);
    if (parent == null || !Object.prototype.hasOwnProperty.call(parent, last)) return;
    parent[last] = value;
  };

  let saveFailed = false;
  let sayTimer;
  const say = (text) => {
    status.textContent = text;
    clearTimeout(sayTimer);
    if (!saveFailed) sayTimer = setTimeout(() => { status.textContent = ""; }, 5000);
  };
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cv));
      if (saveFailed) { saveFailed = false; say(tx("Saved in this browser.")); }
    } catch {
      saveFailed = true;
      say(tx("This browser could not save your CV (storage is full, blocked or private). Download it as a Word file to keep it."));
    }
  };

  // ---------- The CV ----------
  const rich = (tag, className, text) => {
    const node = el(tag, className);
    String(text).split(/\*\*(.+?)\*\*/g).forEach((part, i) => { if (part) node.append(i % 2 ? el("strong", null, part) : part); });
    return node;
  };
  const bulletList = (text) => {
    const items = lines(text);
    if (!items.length) return null;
    const list = el("div", "ats-bullets");
    items.forEach((item) => {
      const row = el("p", "ats-bullet");
      row.append(el("span", "ats-dot", "•"), rich("span", null, item));
      list.append(row);
    });
    return list;
  };
  const row = (title, when) => {
    const line = el("div", "ats-row");
    line.append(el("h3", "ats-title", title));
    if (when) line.append(el("span", "ats-when", when));
    return line;
  };

  const blocks = () => {
    const out = [];
    const add = (node, space, keep = false) => { if (node) out.push({ node, space, keep }); };
    const section = (title) => add(el("h2", "ats-h2", title), 18, true);
    const p = cv.person;

    const head = el("header", "ats-head");
    const name = el("h1", "ats-name", p.name.trim() || doc().yourName);
    name.classList.toggle("is-placeholder", !p.name.trim());
    head.append(name);
    if (p.headline.trim()) head.append(el("p", "ats-headline", p.headline.trim()));
    const contact = [p.location, p.phone, p.email, p.website, p.extra].map((part) => part.trim()).filter(Boolean);
    if (contact.length) head.append(el("p", "ats-contact", contact.join("  |  ")));
    add(head, 0);

    if (cv.summary.trim()) {
      section(heading("summary"));
      const box = el("div", "ats-text");
      cv.summary.trim().split(/\n\s*\n/).forEach((para) => box.append(rich("p", null, para.replace(/\s*\n\s*/g, " "))));
      add(box, 6);
    }
    if (lines(cv.highlights).length) {
      section(heading("highlights"));
      add(bulletList(cv.highlights), 6);
    }
    const jobs = cv.experience.filter(hasText);
    if (jobs.length) {
      section(heading("experience"));
      jobs.forEach((job, i) => {
        const box = el("article", "ats-entry");
        box.append(row(job.title.trim(), period(job.from, job.to, doc().present)));
        const sub = [job.company, job.location].map((part) => part.trim()).filter(Boolean).join(" | ");
        if (sub) box.append(el("p", "ats-sub", sub));
        const bullets = bulletList(job.bullets);
        if (bullets) box.append(bullets);
        add(box, i ? 12 : 6);
      });
    }
    const schools = cv.education.filter(hasText);
    if (schools.length) {
      section(heading("education"));
      schools.forEach((item, i) => {
        const box = el("article", "ats-entry");
        box.append(row(item.title.trim(), item.date.trim()));
        if (item.school.trim()) box.append(el("p", "ats-sub", item.school.trim()));
        if (item.detail.trim()) box.append(rich("p", null, item.detail.trim()));
        add(box, i ? 10 : 6);
      });
    }
    const skills = cv.skills.filter(hasText);
    if (skills.length) {
      section(heading("skills"));
      const box = el("div", "ats-text");
      skills.forEach((item) => {
        const line = el("p");
        if (item.title.trim()) line.append(el("strong", null, `${item.title.trim()}: `));
        line.append(item.text.trim());
        box.append(line);
      });
      add(box, 6);
    }
    const langs = cv.languages.filter(hasText);
    if (langs.length) {
      section(heading("languages"));
      add(el("p", "ats-text", langs.map((item) => item.level.trim() ? `${item.name.trim()} (${item.level.trim()})` : item.name.trim()).join(", ")), 6);
    }
    cv.extras.filter(hasText).forEach((extra) => {
      section(extra.title.trim() || "—");
      const box = el("div", "ats-text");
      lines(extra.text).forEach((line) => box.append(rich("p", null, line)));
      add(box, 6);
    });
    return out;
  };

  const measure = el("div", "ats-page ats-measure");
  measure.setAttribute("aria-hidden", "true");
  let pageCount = 0;

  const renderCv = () => {
    const font = data.fonts.find((item) => item.id === cv.font) || data.fonts[0];
    const accent = data.accents.find((item) => item.id === cv.accent) || data.accents[0];
    scaler.style.setProperty("--ats-font", font.css);
    scaler.style.setProperty("--ats-accent", accent.color);
    scaler.lang = cv.docLang;
    const list = blocks();
    measure.replaceChildren(...list.map((block) => block.node));
    scaler.append(measure);
    list.forEach((block) => { block.height = block.node.offsetHeight; });
    const pages = paginate(list, PAGE_H - TOP - BOTTOM);
    measure.remove();
    pageCount = pages.length;
    const footerName = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" · ");
    scaler.replaceChildren(...pages.map((indices, n) => {
      const page = el("div", "ats-page");
      indices.forEach((index, i) => {
        list[index].node.style.marginTop = i ? `${list[index].space}px` : "";
        page.append(list[index].node);
      });
      const foot = el("footer", "ats-foot");
      foot.append(el("span", null, footerName), el("span", null, doc().page.replace("{n}", n + 1).replace("{total}", pages.length)));
      page.append(foot);
      return page;
    }));
    fitStage();
    renderChecks();
    renderMatch();
  };

  const fitStage = () => {
    const width = stage.clientWidth;
    if (!width) return;
    const scale = Math.min(1, width / PAGE_W);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.marginLeft = `${Math.max(0, (width - PAGE_W * scale) / 2)}px`;
    stage.style.height = `${Math.ceil(scaler.offsetHeight * scale)}px`;
  };
  if ("ResizeObserver" in window) new ResizeObserver(fitStage).observe(stage);
  else window.addEventListener("resize", fitStage);

  let frame = 0;
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(renderCv);
  };
  let saveTimer;
  const changed = () => {
    schedule();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 300);
  };
  window.addEventListener("pagehide", () => { clearTimeout(saveTimer); save(); });

  // ---------- Job ad and checks ----------
  const cvText = () => plainText(cv, doc()).toLowerCase();
  let matchScore = null;
  const renderMatch = () => {
    const terms = keywords(cv.jobAd, STOP);
    matchBox.replaceChildren();
    matchScore = null;
    if (!terms.length) {
      matchBox.append(el("p", "cv-hint", tx("Paste a job ad to see which of its words your CV already uses.")));
      return;
    }
    const text = cvText();
    const found = terms.filter((term) => hasTerm(text, term));
    const missing = terms.filter((term) => !found.includes(term));
    matchScore = found.length / terms.length;
    const meter = el("div", "ats-meter");
    const bar = el("span");
    bar.style.width = `${Math.round(matchScore * 100)}%`;
    meter.append(bar);
    meter.classList.toggle("is-good", matchScore >= 0.6);
    matchBox.append(
      el("p", "ats-score", tx("{a} of {b} key words from the ad are in your CV ({p}%).", { a: found.length, b: terms.length, p: Math.round(matchScore * 100) })),
      meter,
    );
    const chips = (title, items, className) => {
      if (!items.length) return;
      matchBox.append(el("p", "ats-chips-title", title));
      const box = el("div", "ats-chips");
      items.forEach((item) => box.append(el("span", `ats-chip ${className}`, item)));
      matchBox.append(box);
    };
    chips(tx("Missing: add the ones that are true for you"), missing, "is-missing");
    chips(tx("Already in your CV"), found, "is-found");
  };

  const renderChecks = () => {
    const p = cv.person;
    const jobs = cv.experience.filter(hasText);
    const bullets = jobs.flatMap((job) => lines(job.bullets));
    const withNumber = bullets.filter((line) => /\d/.test(line)).length;
    const dateKinds = new Set(jobs.flatMap((job) => [job.from, job.to]).map((d) => d.trim()).filter(Boolean)
      .map((d) => (/^\d{1,2}[./]\d{4}$/.test(d) ? "mm.yyyy" : /^\d{4}$/.test(d) ? "yyyy" : "other")));
    const summary = cv.summary.trim().length;
    const checks = [
      [p.name.trim() && p.email.trim() && p.phone.trim(), tx("Name, phone and email are at the top, as plain text.")],
      [summary >= 250 && summary <= 750, tx("The summary has 3–5 sentences (250–750 characters; now {n}).", { n: summary })],
      [jobs.length > 0 && jobs.every((job) => job.title.trim() && job.company.trim() && (job.from.trim() || job.to.trim())), tx("Every job has a title, a company and dates.")],
      [dateKinds.size <= 1 || (dateKinds.size === 2 && !dateKinds.has("other")), tx("Dates use one format, for example 03.2022.")],
      [bullets.length > 0 && withNumber * 2 >= bullets.length, tx("At least half of the bullet points show a number or result ({a} of {b}).", { a: withNumber, b: bullets.length })],
      [cv.skills.some((item) => item.text.trim()), tx("Skills are listed as words the software can find.")],
      [pageCount <= 2, tx("{n} pages. One or two pages read best.", { n: pageCount })],
    ];
    if (matchScore !== null) checks.push([matchScore >= 0.6, tx("At least 60% of the job ad's key words are in the CV.")]);
    const passed = checks.filter(([ok]) => ok).length;
    const listEl = el("ul", "cv-checks");
    checks.forEach(([ok, text]) => {
      const item = el("li", ok ? "is-ok" : "is-open");
      item.append(el("span", "cv-check-mark", ok ? "✓" : "!"), el("span", null, text));
      listEl.append(item);
    });
    checkBox.replaceChildren(listEl);
    checkBadge.textContent = tx("ATS check: {a} of {b}", { a: passed, b: checks.length });
    checkBadge.classList.toggle("is-done", passed === checks.length);
  };

  // ---------- Editor ----------
  const KINDS = {
    experience: { template: JOB, title: (item, n) => [item.title, item.company].map((part) => part.trim()).filter(Boolean).join(" · ") || tx("Job {n}", { n }) },
    education: { template: SHAPE.education[0], title: (item, n) => item.title.trim() || tx("Education {n}", { n }) },
    skills: { template: SHAPE.skills[0], title: (item, n) => item.title.trim() || tx("Skill group {n}", { n }) },
    languages: { template: SHAPE.languages[0], title: (item, n) => item.name.trim() || tx("Language {n}", { n }) },
    extras: { template: SHAPE.extras[0], title: (item, n) => item.title.trim() || tx("Section {n}", { n }) },
  };
  const kindOf = (path) => keys(path).filter((key) => typeof key === "string").pop();
  const inputEl = (path, { area, rows, placeholder } = {}) => {
    const node = el(area ? "textarea" : "input");
    node.id = `ats-${path.replace(/\./g, "-")}`;
    node.dataset.path = path;
    node.value = getPath(path) ?? "";
    if (area) node.rows = rows || 3;
    else node.type = "text";
    if (placeholder) node.placeholder = placeholder;
    node.autocomplete = "off";
    return node;
  };
  const field = (label, path, options = {}) => {
    const box = el("div", `field${options.wide ? " cv-wide" : ""}`);
    const tag = el("label", null, label);
    tag.htmlFor = `ats-${path.replace(/\./g, "-")}`;
    box.append(tag, inputEl(path, options));
    if (options.hint) box.append(el("p", "cv-hint", options.hint));
    return box;
  };
  const button = (text, act, path, extra = {}) => {
    const node = el("button", extra.className || "button-ghost", text);
    node.type = "button";
    node.dataset.act = act;
    if (path) node.dataset.path = path;
    Object.entries(extra.data || {}).forEach(([key, value]) => { node.dataset[key] = value; });
    if (extra.label) node.setAttribute("aria-label", extra.label);
    if (extra.disabled) node.disabled = true;
    return node;
  };
  const grid = (...children) => {
    const box = el("div", "cv-grid");
    box.append(...children);
    return box;
  };
  const card = (path, index, count, body) => {
    const box = el("div", "cv-item");
    box.dataset.item = path;
    const head = el("div", "cv-item-head");
    const tools = el("div", "cv-item-tools");
    tools.append(
      button("↑", "move", path, { className: "cv-icon", label: tx("Move up"), data: { dir: "-1" }, disabled: index === 0 }),
      button("↓", "move", path, { className: "cv-icon", label: tx("Move down"), data: { dir: "1" }, disabled: index === count - 1 }),
      button("×", "remove", path, { className: "cv-icon", label: tx("Remove") }),
    );
    head.append(el("p", "cv-item-title", KINDS[kindOf(path)].title(getPath(path), index + 1)), tools);
    box.append(head, body);
    return box;
  };
  const listEditor = (name, make, addLabel) => {
    const box = el("div", "cv-items");
    cv[name].forEach((item, i) => box.append(card(`${name}.${i}`, i, cv[name].length, make(`${name}.${i}`))));
    box.append(button(addLabel, "add", name));
    return box;
  };
  const editors = {
    experience: () => listEditor("experience", (path) => grid(
      field(tx("Job title"), `${path}.title`, { wide: true, placeholder: tx("e.g. Night Manager") }),
      field(tx("Company"), `${path}.company`),
      field(tx("Place"), `${path}.location`, { placeholder: tx("e.g. Frankfurt am Main") }),
      field(tx("From"), `${path}.from`, { placeholder: tx("MM.YYYY") }),
      field(tx("To"), `${path}.to`, { placeholder: tx("empty = today") }),
      field(tx("What you did and achieved"), `${path}.bullets`, { wide: true, area: true, rows: 5, hint: tx("One bullet point per line. Start with a verb, add a number.") }),
    ), tx("+ Add a job")),
    education: () => listEditor("education", (path) => grid(
      field(tx("Degree or certificate"), `${path}.title`, { wide: true }),
      field(tx("School and place"), `${path}.school`),
      field(tx("Dates"), `${path}.date`, { placeholder: tx("e.g. 2012 – 2015") }),
      field(tx("Grade or detail"), `${path}.detail`, { wide: true }),
    ), tx("+ Add education or a certificate")),
    skills: () => listEditor("skills", (path) => grid(
      field(tx("Group"), `${path}.title`, { wide: true, placeholder: tx("e.g. Systems & tools") }),
      field(tx("Skills, separated by commas"), `${path}.text`, { wide: true, area: true, rows: 2 }),
    ), tx("+ Add a skill group")),
    languages: () => listEditor("languages", (path) => grid(
      field(tx("Language"), `${path}.name`),
      field(tx("Level"), `${path}.level`, { placeholder: tx("e.g. C1 or Native") }),
    ), tx("+ Add a language")),
    extras: () => listEditor("extras", (path) => grid(
      field(tx("Section title"), `${path}.title`, { wide: true, placeholder: tx("e.g. Volunteering") }),
      field(tx("Lines"), `${path}.text`, { wide: true, area: true, rows: 4, hint: tx("One line each.") }),
    ), tx("+ Add a section")),
  };
  const buildList = (name) => lists[name]?.replaceChildren(editors[name]());
  const buildEditor = () => Object.keys(editors).forEach(buildList);
  const syncStatic = () => {
    form.querySelectorAll("[data-path]").forEach((node) => {
      if (node.closest("[data-list]")) return;
      const value = getPath(node.dataset.path);
      if (node.type === "radio") node.checked = node.value === value;
      else node.value = value ?? "";
    });
    form.querySelectorAll("[data-heading]").forEach((node) => { node.placeholder = doc().headings[node.dataset.heading]; });
  };
  const refreshTitles = (node) => {
    const item = node.closest("[data-item]");
    if (!item) return;
    const path = item.dataset.item;
    item.querySelector(":scope > .cv-item-head > .cv-item-title").textContent = KINDS[kindOf(path)].title(getPath(path), keys(path).pop() + 1);
  };

  form.addEventListener("input", (event) => {
    const target = event.target;
    const path = target.dataset.path;
    if (!path) return;
    setPath(path, target.value);
    if (path === "docLang") syncStatic();
    refreshTitles(target);
    changed();
  });

  // ---------- Import ----------
  const replaceCv = (next, message) => {
    cv = next;
    syncStatic();
    buildEditor();
    changed();
    if (message) importNote.textContent = message;
  };
  const summaryOf = (next) => {
    const parts = [];
    if (next.person.name) parts.push(tx("name and contact"));
    if (next.summary) parts.push(tx("summary"));
    const count = (n, one, many) => { if (n) parts.push(n === 1 ? one : tx(many, { n })); };
    count(next.experience.length, tx("1 job"), "{n} jobs");
    count(next.education.length, tx("1 education entry"), "{n} education entries");
    count(next.skills.length, tx("1 skill group"), "{n} skill groups");
    count(next.languages.length, tx("1 language"), "{n} languages");
    count(next.extras.length, tx("1 more section"), "{n} more sections");
    return parts.length
      ? tx("Found: {list}. Check every field before you send it; the layout of the old file can mix things up.", { list: parts.join(", ") })
      : tx("No CV content was found in this file.");
  };
  const confirmReplace = () => !hasText({ ...cv, docLang: "", font: "", accent: "", jobAd: "" }) || window.confirm(tx("Replace the CV in this tool? What you typed here will be overwritten."));
  const useImported = (parsed) => {
    const next = clean({ ...parsed, font: cv.font, accent: cv.accent, jobAd: cv.jobAd }, data, LANG);
    if (!next.experience.length) next.experience = [copy(JOB)];
    replaceCv(next, summaryOf(parsed));
  };

  const importFile = async (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    importNote.textContent = tx("Reading {name}…", { name: file.name });
    dropZone.classList.add("is-busy");
    try {
      let parsedLines;
      if (name.endsWith(".pdf") || file.type === "application/pdf") parsedLines = await window.CvImport.readPdf(file, PDFJS, PDFJS_WORKER);
      else if (name.endsWith(".docx")) parsedLines = await window.CvImport.readDocx(file);
      else if (name.endsWith(".doc")) throw new Error("doc");
      else if (name.endsWith(".txt") || file.type.startsWith("text/")) parsedLines = window.CvImport.textLines(await file.text());
      else throw new Error("type");
      if (!parsedLines.length) throw new Error("empty");
      if (!confirmReplace()) { importNote.textContent = ""; return; }
      useImported(window.CvImport.parse(parsedLines));
    } catch (error) {
      importNote.textContent = error.message === "doc"
        ? tx("Old Word files (.doc) cannot be read here. In Word, choose Save as and pick .docx or PDF.")
        : error.message === "empty"
          ? tx("This file has no readable text; it is probably a scan or a photo. Use the Word file, or paste the text below.")
          : error.message === "type"
            ? tx("Use a PDF, a Word file (.docx) or a text file.")
            : tx("This file could not be read. Try the other format (PDF or Word), or paste the text below.");
    } finally {
      dropZone.classList.remove("is-busy");
    }
  };

  app.querySelector("[data-import-file]").addEventListener("change", (event) => {
    importFile(event.target.files?.[0]);
    event.target.value = "";
  });
  ["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-over");
  }));
  ["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, () => dropZone.classList.remove("is-over")));
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    importFile(event.dataTransfer?.files?.[0]);
  });

  const builderCv = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(data.cvBuilderKey));
      return isObject(saved) && hasText(saved.person) ? saved : null;
    } catch {
      return null;
    }
  };
  builderButton.hidden = !builderCv();

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
  const fileName = () => ([cv.person.name.trim(), doc().doc].filter(Boolean).join(" ") || "cv")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "cv";

  const actions = {
    add: (path) => {
      const list = getPath(path);
      if (!Array.isArray(list) || list.length >= MAX_ITEMS) return;
      list.push(copy(KINDS[path].template));
      buildList(path);
      form.querySelector(`[data-item="${path}.${list.length - 1}"] input, [data-item="${path}.${list.length - 1}"] textarea`)?.focus();
      changed();
    },
    remove: (path) => {
      const [name, index] = keys(path);
      const list = cv[name];
      if (hasText(list[index]) && !window.confirm(tx("Remove “{name}”?", { name: KINDS[name].title(list[index], index + 1) }))) return;
      list.splice(index, 1);
      buildList(name);
      form.querySelector(`[data-list="${name}"] [data-act="add"]`)?.focus();
      changed();
    },
    move: (path, node) => {
      const [name, index] = keys(path);
      const list = cv[name];
      const to = index + Number(node.dataset.dir);
      if (to < 0 || to >= list.length) return;
      [list[index], list[to]] = [list[to], list[index]];
      buildList(name);
      form.querySelector(`[data-item="${name}.${to}"] [data-act="move"][data-dir="${node.dataset.dir}"]:not(:disabled)`)?.focus();
      changed();
    },
    "from-builder": () => {
      const saved = builderCv();
      if (!saved || !confirmReplace()) return;
      const next = clean({ ...fromBuilder(saved, sideTitles), font: cv.font, accent: cv.accent, jobAd: cv.jobAd }, data, LANG);
      replaceCv(next, tx("Your CV from the CV Builder is in. The CV Builder itself stays as it was."));
    },
    "paste-import": () => {
      const text = app.querySelector("[data-paste]").value;
      const parsed = window.CvImport.textLines(text);
      if (!parsed.length) { importNote.textContent = tx("Paste the text of your CV first."); return; }
      if (!confirmReplace()) return;
      useImported(window.CvImport.parse(parsed));
    },
    example: () => {
      const example = builder.examples?.[cv.docLang] || builder.examples?.en;
      if (!example || !confirmReplace()) return;
      replaceCv(clean({ ...fromBuilder({ ...example, docLang: cv.docLang }, sideTitles), font: cv.font, accent: cv.accent, jobAd: cv.jobAd }, data, LANG),
        tx("Example loaded. Change anything; it updates as you type."));
    },
    reset: () => {
      if (!window.confirm(tx("Delete this CV from this browser and start again?"))) return;
      const next = blank();
      next.docLang = cv.docLang;
      next.font = cv.font;
      next.accent = cv.accent;
      replaceCv(next, "");
      say(tx("Cleared."));
    },
    word: () => {
      download(`${fileName()}.docx`, docx(cv, data), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      say(tx("Word file saved. You can also open it here again later to keep working."));
    },
    text: () => {
      download(`${fileName()}.txt`, plainText(cv, doc()), "text/plain;charset=utf-8");
    },
    copy: async (path, node) => {
      const text = plainText(cv, doc());
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
      say(tx("Copied as plain text, ready for the text boxes of job portals."));
    },
    print: () => {
      cancelAnimationFrame(frame);
      renderCv();
      const title = document.title;
      document.title = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" – ") || title;
      window.addEventListener("afterprint", () => { document.title = title; }, { once: true });
      window.print();
    },
  };
  app.addEventListener("click", (event) => {
    const node = event.target.closest("[data-act]");
    if (!node || !actions[node.dataset.act]) return;
    node.closest("details.cv-more")?.removeAttribute("open");
    actions[node.dataset.act](node.dataset.path, node);
  });

  syncStatic();
  buildEditor();
  renderCv();
  document.fonts?.ready.then(schedule);
})();
