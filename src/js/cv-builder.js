// CV Builder: the editor on the left fills a CV on the right, laid out on A4
// pages exactly as it prints. The CV stays in this browser. The one thing that
// leaves it is a company website typed in for a logo: that address is looked
// up on Google's icon service.
(() => {
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const copy = (value) => JSON.parse(JSON.stringify(value));

  // The shape of a CV. Saved or imported data is rebuilt to fit it, field by
  // field, so an old or damaged file cannot break the page. An array holds the
  // template for its items; a new item starts as a copy of that template.
  const ROLE = { title: "", from: "", to: "", bullets: "" };
  const ENTRY = { company: "", website: "", logo: "", note: "", location: "", roles: [ROLE] };
  const SHAPE = {
    docLang: "",
    theme: "",
    photoShape: "circle",
    density: "normal",
    photo: "",
    photoY: 50,
    person: { name: "", headline: "", location: "", phone: "", email: "", website: "", extra: "" },
    stats: [{ value: "", label: "" }],
    profile: "",
    highlights: "",
    headings: { profile: "", highlights: "", side: "", education: "", skills: "", languages: "" },
    groups: [{ title: "", entries: [ENTRY] }],
    side: [{ title: "", website: "", logo: "", meta: "", text: "" }],
    education: [{ title: "", school: "", date: "", detail: "" }],
    skills: [{ title: "", text: "" }],
    languages: [{ name: "", level: "" }],
  };
  const PHOTO_SHAPES = ["circle", "rounded", "none"];
  const DENSITIES = ["normal", "compact"];
  const MAX_ITEMS = 60;

  const fit = (value, shape) => {
    if (Array.isArray(shape)) return Array.isArray(value) ? value.filter(isObject).slice(0, MAX_ITEMS).map((item) => fit(item, shape[0])) : [];
    if (isObject(shape)) {
      const source = isObject(value) ? value : {};
      return Object.fromEntries(Object.keys(shape).map((key) => [key, fit(source[key], shape[key])]));
    }
    if (typeof shape === "number") return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : shape;
    return typeof value === "string" ? value : shape;
  };

  // Pictures are kept only as the data the page made from an upload.
  const image = (src) => (/^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(src) ? src : "");

  // A saved, imported or example CV, made safe to use.
  const clean = (saved, data, lang) => {
    const cv = fit(saved, SHAPE);
    if (!data.docLangs[cv.docLang]) cv.docLang = data.docLangs[lang] ? lang : "en";
    if (!data.themes.some((theme) => theme.id === cv.theme)) cv.theme = data.themes[0].id;
    if (!PHOTO_SHAPES.includes(cv.photoShape)) cv.photoShape = PHOTO_SHAPES[0];
    if (!DENSITIES.includes(cv.density)) cv.density = DENSITIES[0];
    cv.photo = image(cv.photo);
    cv.groups.forEach((group) => group.entries.forEach((entry) => {
      entry.logo = image(entry.logo);
      if (!entry.roles.length) entry.roles.push(copy(ROLE));
    }));
    cv.side.forEach((item) => { item.logo = image(item.logo); });
    return cv;
  };

  // "https://www.hotel.com/en/" and "hotel.com" both give "hotel.com"; anything
  // that is not a public web address gives "".
  const domainOf = (text) => {
    const value = String(text ?? "").trim();
    if (!value || /\s/.test(value)) return "";
    try {
      const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`);
      if (!/^https?:$/.test(url.protocol)) return "";
      const host = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
      return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[a-z]{2,}|xn--[a-z0-9-]+)$/.test(host) ? host : "";
    } catch {
      return "";
    }
  };

  // Initials for a company without a logo: "Northgate Hotel Group" gives "NH",
  // "Drita Sh.p.k" gives "D". Legal forms and small words are skipped.
  const SKIP = /^(?:gmbh|mbh|ug|ag|kg|co|ohg|ev|e\.v|ltd|llc|inc|plc|corp|shpk|sh\.p\.k|sha|sh\.a|srl|s\.r\.l|spa|s\.p\.a|bv|nv|sa|sas|und|and|the|der|die|das|of|i|e|&)\.?$/i;
  const initials = (name) => String(name ?? "")
    .split(/[\s/,|()–-]+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word) && !SKIP.test(word))
    .slice(0, 2)
    .map((word) => word.match(/[\p{L}\p{N}]/u)[0])
    .join("")
    .toUpperCase();
  // The same company always gets the same colour.
  const hue = (name) => [...String(name)].reduce((sum, ch) => (sum * 31 + ch.codePointAt(0)) % 360, 7);

  // One bullet point per line; typed bullet signs are dropped. **Text** is bold.
  const lines = (text) => String(text ?? "").split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-•–·▪●]|\*(?!\*))\s*/, "").trim())
    .filter(Boolean);
  const splitBold = (text) => String(text).split(/\*\*(.+?)\*\*/g)
    .map((part, index) => ({ text: part, bold: index % 2 === 1 }))
    .filter((part) => part.text);

  // Blocks fill a page until the next one no longer fits; a heading moves to
  // the next page together with the block under it. Returns the block numbers
  // on each page.
  const paginate = (blocks, firstLimit, limit) => {
    const pages = [[]];
    let used = 0;
    blocks.forEach((block, index) => {
      const page = pages[pages.length - 1];
      const gap = page.length ? block.space : 0;
      const next = blocks[index + 1];
      const need = gap + block.height + (block.keep && next ? next.space + next.height : 0);
      if (page.length && used + need > (pages.length === 1 ? firstLimit : limit)) {
        pages.push([index]);
        used = block.height;
      } else {
        page.push(index);
        used += gap + block.height;
      }
    });
    return pages;
  };

  window.CvBuilder = { fit, clean, domainOf, initials, lines, splitBold, paginate, SHAPE };

  const app = document.querySelector("[data-cv]");
  const dataEl = document.getElementById("cv-builder-data");
  if (!app || !dataEl || !window.ToolKit) return;

  const { LANG, tx, el, read } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const KEY = data.storageKey;
  const form = app.querySelector("[data-cv-form]");
  const stage = app.querySelector("[data-stage]");
  const scaler = app.querySelector("[data-scale]");
  const status = app.querySelector("[data-status]");
  const checkBox = app.querySelector("[data-check]");
  const checkBadge = app.querySelector("[data-check-badge]");
  const emptyNote = app.querySelector("[data-empty]");
  const lists = Object.fromEntries([...app.querySelectorAll("[data-list]")].map((box) => [box.dataset.list, box]));

  // Page geometry in CSS pixels (A4 at 96 dpi).
  const PAGE_W = 794;
  const PAGE_H = 1123;
  const TOP = 44;
  const BOTTOM = 60;

  const blank = () => {
    const cv = clean({}, data, LANG);
    cv.stats = Array.from({ length: 4 }, () => copy(SHAPE.stats[0]));
    cv.groups = [copy(SHAPE.groups[0])];
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
  const heading = (key) => cv.headings[key]?.trim() || doc().headings[key];
  const themeOf = () => data.themes.find((theme) => theme.id === cv.theme) || data.themes[0];
  const hasText = (value) => (typeof value === "string" ? value.trim() !== "" && !value.startsWith("data:")
    : Array.isArray(value) ? value.some(hasText)
    : isObject(value) ? Object.values(value).some(hasText) : false);

  // Paths such as "groups.0.entries.1.company" point into the CV.
  const keys = (path) => path.split(".").map((key) => (/^\d+$/.test(key) ? Number(key) : key));
  const getPath = (path) => keys(path).reduce((node, key) => (node == null ? undefined : node[key]), cv);
  const setPath = (path, value) => {
    const parts = keys(path);
    const last = parts.pop();
    const parent = parts.reduce((node, key) => (node == null ? undefined : node[key]), cv);
    if (parent == null || !Object.prototype.hasOwnProperty.call(parent, last)) return;
    parent[last] = value;
  };

  // Saving.
  let saveFailed = false;
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cv));
      dirty = false;
      if (saveFailed) { saveFailed = false; say(tx("Saved in this browser.")); }
    } catch {
      saveFailed = true;
      say(tx("This browser could not save your CV (storage is full, blocked or private). Save a backup file to keep it."));
    }
  };
  let sayTimer;
  const say = (text, sticky) => {
    status.textContent = text;
    clearTimeout(sayTimer);
    if (!sticky && !saveFailed) sayTimer = setTimeout(() => { status.textContent = ""; }, 4000);
  };

  // ---------- Logos ----------
  // Looked-up logos: domain -> "ok" or "none". Google answers an unknown
  // domain with a 16-pixel globe, which counts as no logo.
  const logoState = new Map();
  const logoUrl = (domain) => data.logoService + encodeURIComponent(domain);

  const monogram = (name) => {
    const letters = initials(name);
    const box = el("span", "cv-mono", letters);
    box.style.setProperty("--mono", `hsl(${hue(name)} 42% 36%)`);
    box.classList.toggle("is-long", letters.length > 1);
    return box;
  };

  // The logo of a company: the uploaded one, else the one found on the web,
  // else its initials (or nothing, when fallback is false).
  const logo = (className, { name, website, upload }, fallback = true) => {
    const box = el("div", className);
    const img = (src) => {
      const node = new Image();
      node.alt = "";
      node.decoding = "sync";
      node.src = src;
      return node;
    };
    const fallbackNode = () => (fallback && initials(name) ? monogram(name) : null);
    if (upload) {
      box.append(img(upload));
      return box;
    }
    const domain = domainOf(website);
    if (!domain || logoState.get(domain) === "none") {
      const mono = fallbackNode();
      if (mono) box.append(mono);
      else box.classList.add("is-empty");
      return box;
    }
    const node = img(logoUrl(domain));
    node.referrerPolicy = "no-referrer";
    const fail = () => {
      const first = !logoState.has(domain);
      logoState.set(domain, "none");
      const mono = fallbackNode();
      if (mono) node.replaceWith(mono);
      else { node.remove(); box.classList.add("is-empty"); }
      if (first) refreshLogoNotes();
    };
    node.addEventListener("error", fail);
    node.addEventListener("load", () => {
      if (node.naturalWidth <= 16) return fail();
      if (!logoState.has(domain)) { logoState.set(domain, "ok"); refreshLogoNotes(); }
    });
    box.append(node);
    return box;
  };

  // ---------- The CV ----------
  const rich = (tag, className, text) => {
    const node = el(tag, className);
    splitBold(text).forEach((part) => node.append(part.bold ? el("strong", null, part.text) : part.text));
    return node;
  };
  const bulletList = (text) => {
    const items = lines(text);
    if (!items.length) return null;
    const list = el("ul", "cv-bullets");
    items.forEach((item) => list.append(rich("li", null, item)));
    return list;
  };
  const joined = (parts, className = "cv-sep") => {
    const frag = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (index) frag.append(el("span", className, "|"));
      frag.append(part);
    });
    return frag;
  };
  const period = (from, to) => {
    const start = from.trim();
    const end = to.trim();
    if (start && end) return `${start} – ${end}`;
    return start ? `${start} – ${doc().present}` : end;
  };
  // "Store Manager (before: Assistant)" shows the brackets in grey.
  const roleTitle = (text) => {
    const title = el("h3", "cv-role");
    const match = text.match(/^(.*?)\s*(\([^()]*\))$/);
    if (match && match[1]) title.append(match[1], " ", el("span", "cv-muted", match[2]));
    else title.textContent = text;
    return title;
  };
  const contactItem = (text, kind) => {
    const value = text.trim();
    if (kind === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return Object.assign(el("a", null, value), { href: `mailto:${value}` });
    if (kind === "phone" && /^\+?[\d\s()./-]{6,}$/.test(value)) return Object.assign(el("a", null, value), { href: `tel:${value.replace(/[^\d+]/g, "")}` });
    if (kind === "website" && domainOf(value)) {
      const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      return Object.assign(el("a", null, value.replace(/^https?:\/\/(?:www\.)?/i, "").replace(/\/$/, "")), { href });
    }
    return el("span", null, value);
  };

  const headerBlock = () => {
    const band = el("header", "cv-head");
    const person = cv.person;
    if (cv.photo && cv.photoShape !== "none") {
      const frame = el("div", `cv-photo is-${cv.photoShape}`);
      const img = new Image();
      img.alt = "";
      img.decoding = "sync";
      img.src = cv.photo;
      img.style.objectPosition = `50% ${cv.photoY}%`;
      frame.append(img);
      band.append(frame);
    }
    const text = el("div", "cv-head-text");
    const name = el("h1", "cv-name", person.name.trim() || doc().yourName);
    name.classList.toggle("is-placeholder", !person.name.trim());
    const headlineText = person.headline.trim() || doc().yourHeadline;
    const headline = el("p", "cv-headline");
    headline.classList.toggle("is-placeholder", !person.headline.trim());
    headline.append(joined(headlineText.split("|").map((part) => part.trim()).filter(Boolean).map((part) => el("span", null, part)), "cv-sep-gold"));
    text.append(name, headline);
    const contact = [["location"], ["phone", "phone"], ["email", "email"], ["website", "website"], ["extra"]]
      .filter(([key]) => person[key].trim())
      .map(([key, kind]) => contactItem(person[key], kind));
    if (contact.length) {
      const line = el("p", "cv-contact");
      line.append(joined(contact));
      text.append(line);
    }
    band.append(text);
    return band;
  };

  const statsBlock = () => {
    const stats = cv.stats.filter((stat) => stat.value.trim() || stat.label.trim());
    if (!stats.length) return null;
    const row = el("div", "cv-stats");
    row.style.setProperty("--cols", stats.length);
    stats.forEach((stat) => {
      const tile = el("div", "cv-stat");
      tile.append(el("strong", null, stat.value), el("span", null, stat.label));
      row.append(tile);
    });
    return row;
  };

  const profileBlock = () => {
    const profile = cv.profile.trim();
    const highlights = lines(cv.highlights);
    if (!profile && !highlights.length) return null;
    const box = el("div", "cv-profile");
    if (profile) {
      const text = el("div", "cv-profile-text");
      profile.split(/\n\s*\n/).forEach((para) => text.append(rich("p", null, para.trim())));
      box.append(text);
    }
    if (highlights.length) {
      const aside = el("aside", "cv-highlights");
      aside.append(el("h3", null, heading("highlights")), bulletList(cv.highlights));
      box.append(aside);
    }
    box.classList.toggle("is-split", Boolean(profile && highlights.length));
    return box;
  };

  const entryBlock = (entry) => {
    const box = el("article", "cv-entry");
    box.append(logo("cv-logo", { name: entry.company, website: entry.website, upload: entry.logo }));
    const body = el("div", "cv-entry-body");
    const extra = [entry.note, entry.location].map((part) => part.trim()).filter(Boolean);
    const company = entry.company.trim();
    const companyLine = () => {
      if (!company && !extra.length) return;
      const line = el("p", "cv-company");
      if (company) line.append(el("span", "cv-accent", company));
      extra.forEach((part, i) => {
        if (i || company) line.append(el("span", "cv-sep", "|"));
        line.append(el("span", "cv-muted", part));
      });
      body.append(line);
    };
    const roles = entry.roles.filter(hasText);
    if (!roles.length) companyLine();
    roles.forEach((role, index) => {
      const row = el("div", "cv-role-row");
      row.append(roleTitle(role.title.trim()));
      const when = period(role.from, role.to);
      if (when) row.append(el("span", "cv-dates", when));
      body.append(row);
      if (index === 0) companyLine();
      const bullets = bulletList(role.bullets);
      if (bullets) body.append(bullets);
    });
    box.append(body);
    return box;
  };

  const sideCard = (item) => {
    const card = el("article", "cv-card");
    const hasLogo = item.logo || domainOf(item.website);
    if (hasLogo) card.append(logo("cv-logo is-small", { name: item.title, website: item.website, upload: item.logo }, false));
    const body = el("div");
    if (item.title.trim()) body.append(el("h3", "cv-card-title", item.title.trim()));
    if (item.meta.trim()) body.append(el("p", "cv-muted", item.meta.trim()));
    if (item.text.trim()) body.append(rich("p", null, item.text.trim()));
    card.append(body);
    card.classList.toggle("has-logo", Boolean(hasLogo));
    return card;
  };

  const educationCard = (item) => {
    const card = el("article", "cv-card");
    const body = el("div");
    if (item.title.trim()) body.append(el("h3", "cv-card-title", item.title.trim()));
    const meta = [item.school, item.date].map((part) => part.trim()).filter(Boolean);
    if (meta.length) {
      const line = el("p", "cv-muted");
      line.append(joined(meta.map((part) => el("span", null, part))));
      body.append(line);
    }
    if (item.detail.trim()) body.append(rich("p", null, item.detail.trim()));
    card.append(body);
    return card;
  };

  const skillCard = (item) => {
    const card = el("article", "cv-skill");
    if (item.title.trim()) card.append(el("h3", null, item.title.trim()));
    if (item.text.trim()) card.append(rich("p", null, item.text.trim()));
    return card;
  };

  const languagesBlock = () => {
    const items = cv.languages.filter(hasText);
    if (!items.length) return null;
    const bar = el("div", "cv-languages");
    bar.append(el("strong", null, heading("languages")));
    const list = el("p");
    list.append(joined(items.map((item) => el("span", null, [item.name.trim(), item.level.trim()].filter(Boolean).join(" – ")))));
    bar.append(list);
    return bar;
  };

  const row = (className, cards, columns) => {
    const box = el("div", `cv-row ${className}`);
    box.style.setProperty("--cols", columns);
    box.append(...cards);
    return box;
  };

  // Every block of the CV, in order, with the space above it and whether it
  // must stay on the same page as the next one (headings).
  const blocks = () => {
    const out = [];
    const add = (node, space, keep = false) => { if (node) out.push({ node, space, keep }); };
    const section = (title) => add(el("h2", "cv-h2", title), 26, true);

    add(headerBlock(), 0);
    add(statsBlock(), 22);
    const profile = profileBlock();
    if (profile) {
      section(heading("profile"));
      add(profile, 12);
    }
    cv.groups.forEach((group) => {
      const entries = group.entries.filter(hasText);
      if (!entries.length) return;
      section(group.title.trim() || doc().headings.experience);
      entries.forEach((entry, index) => add(entryBlock(entry), index ? 0 : 6));
    });
    const cards = (items, make, title, className, columns) => {
      const filled = items.filter(hasText);
      if (!filled.length) return;
      section(title);
      for (let i = 0; i < filled.length; i += columns) add(row(className, filled.slice(i, i + columns).map(make), columns), i ? 10 : 12);
    };
    cards(cv.side, sideCard, heading("side"), "is-cards", 2);
    cards(cv.education, educationCard, heading("education"), "is-cards", 2);
    cards(cv.skills, skillCard, heading("skills"), "is-skills", 4);
    add(languagesBlock(), 18);
    return out;
  };

  const measure = el("div", "cv-page cv-measure");
  measure.setAttribute("aria-hidden", "true");
  let pageCount = 0;
  let overflow = false;

  const renderCv = () => {
    const theme = themeOf();
    scaler.style.setProperty("--cv-dark", theme.dark);
    scaler.style.setProperty("--cv-accent", theme.accent);
    scaler.style.setProperty("--cv-gold", theme.gold);
    scaler.style.setProperty("--cv-soft", theme.soft);
    scaler.classList.toggle("is-compact", cv.density === "compact");
    scaler.lang = cv.docLang;

    const list = blocks();
    const scale = cv.density === "compact" ? 0.8 : 1;
    measure.replaceChildren(...list.map((block) => block.node));
    scaler.append(measure);
    list.forEach((block) => {
      block.height = block.node.offsetHeight;
      block.space = Math.round(block.space * scale);
    });
    const pages = paginate(list, PAGE_H - BOTTOM, PAGE_H - TOP - BOTTOM);
    measure.remove();

    pageCount = pages.length;
    overflow = false;
    const footerName = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" · ");
    const pageEls = pages.map((indices, n) => {
      const page = el("div", `cv-page${n ? "" : " is-first"}`);
      let used = 0;
      indices.forEach((index, i) => {
        const block = list[index];
        block.node.style.marginTop = i ? `${block.space}px` : "";
        used += (i ? block.space : 0) + block.height;
        page.append(block.node);
      });
      if (used > (n ? PAGE_H - TOP - BOTTOM : PAGE_H - BOTTOM)) {
        overflow = true;
        page.classList.add("is-over");
      }
      const foot = el("footer", "cv-foot");
      foot.append(el("span", null, footerName), el("span", null, doc().page.replace("{n}", n + 1).replace("{total}", pages.length)));
      page.append(foot);
      return page;
    });
    scaler.replaceChildren(...pageEls);
    fitStage();
    renderChecks();
    emptyNote.hidden = hasText(cv.person) || cv.groups.some((group) => group.entries.some(hasText));
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
  // Only unsaved changes are written when the page closes, so a reload never
  // overwrites what another tab saved; that tab's changes show up here too.
  let dirty = false;
  const changed = () => {
    dirty = true;
    schedule();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 300);
  };
  window.addEventListener("pagehide", () => {
    if (!dirty) return;
    clearTimeout(saveTimer);
    save();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY || !event.newValue || dirty) return;
    try {
      cv = clean(JSON.parse(event.newValue), data, LANG);
    } catch {
      return;
    }
    syncStatic();
      buildEditor();
    schedule();
  });

  // ---------- CV check ----------
  const renderChecks = () => {
    const person = cv.person;
    const bullets = cv.groups.flatMap((group) => group.entries.flatMap((entry) => entry.roles.flatMap((role) => lines(role.bullets))));
    const withNumber = bullets.filter((line) => /\d/.test(line)).length;
    const roles = cv.groups.flatMap((group) => group.entries.filter(hasText).flatMap((entry) => entry.roles.filter(hasText)));
    const undated = roles.filter((role) => !role.from.trim() && !role.to.trim()).length;
    const long = bullets.filter((line) => line.length > 220).length;
    const profileLength = cv.profile.trim().length;
    const figures = cv.stats.filter((stat) => stat.value.trim() && stat.label.trim()).length;
    const checks = [
      [person.name.trim() && person.headline.trim() && person.email.trim() && person.phone.trim(),
        tx("Name, role, phone and email are filled in.")],
      [profileLength >= 250 && profileLength <= 750,
        tx("The profile has 3–5 sentences (250–750 characters; now {n}).", { n: profileLength })],
      [figures >= 3, tx("At least three key figures at the top (now {n}).", { n: figures })],
      [bullets.length > 0 && withNumber * 2 >= bullets.length,
        tx("At least half of the bullet points show a number or result ({a} of {b}).", { a: withNumber, b: bullets.length })],
      [roles.length > 0 && undated === 0, tx("Every role has its dates.")],
      [long === 0, tx("Every bullet point fits on one or two lines.")],
      [pageCount <= 2 && !overflow, overflow
        ? tx("One block is longer than a page. Shorten it so nothing is cut off.")
        : tx("{n} pages. One or two pages read best.", { n: pageCount })],
    ];
    const passed = checks.filter(([ok]) => ok).length;
    const listEl = el("ul", "cv-checks");
    checks.forEach(([ok, text]) => {
      const item = el("li", ok ? "is-ok" : "is-open");
      item.append(el("span", "cv-check-mark", ok ? "✓" : "!"), el("span", null, text));
      listEl.append(item);
    });
    checkBox.replaceChildren(listEl);
    checkBadge.textContent = tx("CV check: {a} of {b}", { a: passed, b: checks.length });
    checkBadge.classList.toggle("is-done", passed === checks.length);
  };

  // ---------- The editor ----------
  const LIMITS = { stats: 4 };
  const KINDS = {
    stats: { template: SHAPE.stats[0], title: (item, n) => [item.value, item.label].filter((part) => part.trim()).join(" ") || tx("Key figure {n}", { n }) },
    groups: { template: SHAPE.groups[0], title: (item, n) => item.title.trim() || (n === 1 ? doc().headings.experience : tx("Experience section {n}", { n })) },
    entries: {
      template: ENTRY,
      title: (item, n) => [item.roles[0]?.title, item.company].map((part) => (part || "").trim()).filter(Boolean).join(" · ") || tx("Position {n}", { n }),
    },
    roles: { template: ROLE, title: (item, n) => item.title.trim() || tx("Role {n}", { n }) },
    side: { template: SHAPE.side[0], title: (item, n) => item.title.trim() || tx("Activity {n}", { n }) },
    education: { template: SHAPE.education[0], title: (item, n) => item.title.trim() || tx("Education {n}", { n }) },
    skills: { template: SHAPE.skills[0], title: (item, n) => item.title.trim() || tx("Skill group {n}", { n }) },
    languages: { template: SHAPE.languages[0], title: (item, n) => item.name.trim() || tx("Language {n}", { n }) },
  };
  const kindOf = (path) => keys(path).filter((key) => typeof key === "string").pop();

  const input = (path, { area, rows, placeholder, type } = {}) => {
    const node = el(area ? "textarea" : "input");
    node.id = `cv-${path.replace(/\./g, "-")}`;
    node.dataset.path = path;
    node.value = getPath(path) ?? "";
    if (area) node.rows = rows || 3;
    else node.type = type || "text";
    if (placeholder) node.placeholder = placeholder;
    node.autocomplete = "off";
    return node;
  };
  const field = (label, path, options = {}) => {
    const box = el("div", `field${options.wide ? " cv-wide" : ""}`);
    const tag = el("label", null, label);
    tag.htmlFor = `cv-${path.replace(/\./g, "-")}`;
    box.append(tag, input(path, options));
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
  const uploadButton = (text, path, className = "button-ghost") => {
    const label = el("label", `cv-file ${className}`);
    const file = el("input");
    file.type = "file";
    file.accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";
    file.dataset.upload = path;
    label.append(text, file);
    return label;
  };

  // A card in a list, with its title and move and remove buttons.
  const card = (path, index, count, body, className = "") => {
    const kind = kindOf(path);
    const box = el("div", `cv-item ${className}`);
    box.dataset.item = path;
    const head = el("div", "cv-item-head");
    const title = el("p", "cv-item-title", KINDS[kind].title(getPath(path), index + 1));
    const tools = el("div", "cv-item-tools");
    tools.append(
      button("↑", "move", path, { className: "cv-icon", label: tx("Move up"), data: { dir: "-1" }, disabled: index === 0 }),
      button("↓", "move", path, { className: "cv-icon", label: tx("Move down"), data: { dir: "1" }, disabled: index === count - 1 }),
      button("×", "remove", path, { className: "cv-icon", label: tx("Remove") }),
    );
    head.append(title, tools);
    box.append(head, body);
    return box;
  };
  const grid = (...children) => {
    const box = el("div", "cv-grid");
    box.append(...children.filter(Boolean));
    return box;
  };

  // The logo row of a company: preview, website, upload and a note on what was found.
  const logoEditor = (path, nameKey) => {
    const box = el("div", "cv-logo-edit");
    box.dataset.logoFor = path;
    box.dataset.nameKey = nameKey;
    const thumb = el("div", "cv-logo-thumb");
    const fields = el("div", "cv-logo-fields");
    fields.append(field(tx("Website (for the logo)"), `${path}.website`, { placeholder: tx("e.g. company.com") }));
    const actions = el("div", "cv-logo-actions");
    actions.append(uploadButton(tx("Upload a logo"), `${path}.logo`));
    if (getPath(`${path}.logo`)) actions.append(button(tx("Remove the logo"), "clear", `${path}.logo`));
    fields.append(actions, el("p", "cv-hint", ""));
    box.append(thumb, fields);
    updateLogoEditor(box);
    return box;
  };
  const logoNote = (item, fallback) => {
    if (item.logo) return tx("Your uploaded logo is used.");
    const domain = domainOf(item.website);
    if (!item.website.trim()) return fallback ? tx("Type the company's website and its logo is found automatically. Without one, its initials are shown.") : tx("Type a website to show a logo, or upload one.");
    if (!domain) return tx("Type a web address such as company.com.");
    const state = logoState.get(domain);
    if (state === "ok") return tx("Logo found for {domain}.", { domain });
    if (state === "none") return fallback ? tx("No logo found for {domain}; the initials are shown. You can upload one.", { domain }) : tx("No logo found for {domain}. You can upload one.", { domain });
    return tx("Looking for the logo of {domain}…", { domain });
  };
  function updateLogoEditor(box) {
    const path = box.dataset.logoFor;
    const item = getPath(path);
    if (!item) return;
    const fallback = box.dataset.nameKey === "company";
    const preview = logo("cv-logo-thumb", { name: item[box.dataset.nameKey], website: item.website, upload: item.logo }, fallback);
    box.querySelector(".cv-logo-thumb").replaceWith(preview);
    box.querySelector(".cv-logo-fields > .cv-hint").textContent = logoNote(item, fallback);
  }
  function refreshLogoNotes() {
    form.querySelectorAll("[data-logo-for]").forEach(updateLogoEditor);
    schedule();
  }

  // At the limit the button goes away instead of doing nothing.
  const addButton = (text, path, disabled) => {
    const node = button(text, "add", path);
    const list = getPath(path);
    if (disabled || (Array.isArray(list) && list.length >= (LIMITS[kindOf(path)] || MAX_ITEMS))) node.hidden = true;
    return node;
  };

  const editors = {
    stats: () => {
      const box = el("div", "cv-items");
      cv.stats.forEach((item, i) => {
        const path = `stats.${i}`;
        box.append(card(path, i, cv.stats.length, grid(
          field(tx("Number"), `${path}.value`, { placeholder: tx("e.g. 10+") }),
          field(tx("What it counts"), `${path}.label`, { placeholder: tx("e.g. Years in leadership") }),
        ), "is-compact"));
      });
      box.append(addButton(tx("+ Add a key figure"), "stats", cv.stats.length >= LIMITS.stats));
      return box;
    },
    groups: () => {
      const box = el("div", "cv-items");
      cv.groups.forEach((group, g) => {
        const gPath = `groups.${g}`;
        const body = el("div", "cv-item-body");
        body.append(field(tx("Section title"), `${gPath}.title`, { placeholder: doc().headings.experience, hint: tx("e.g. Professional experience – Germany") }));
        const entries = el("div", "cv-items");
        group.entries.forEach((entry, e) => {
          const ePath = `${gPath}.entries.${e}`;
          const entryBody = el("div", "cv-item-body");
          entryBody.append(
            grid(
              field(tx("Company or organisation"), `${ePath}.company`),
              field(tx("Location"), `${ePath}.location`, { placeholder: tx("e.g. Frankfurt am Main") }),
              field(tx("Detail next to the company"), `${ePath}.note`, { wide: true, placeholder: tx("e.g. Deployed at an airport hotel") }),
            ),
            logoEditor(ePath, "company"),
          );
          const roles = el("div", "cv-items");
          entry.roles.forEach((role, r) => {
            const rPath = `${ePath}.roles.${r}`;
            roles.append(card(rPath, r, entry.roles.length, grid(
              field(tx("Role"), `${rPath}.title`, { wide: true, placeholder: tx("e.g. Night Manager") }),
              field(tx("From"), `${rPath}.from`, { placeholder: tx("MM.YYYY") }),
              field(tx("To"), `${rPath}.to`, { placeholder: tx("empty = today") }),
              field(tx("What you did and achieved"), `${rPath}.bullets`, { wide: true, area: true, rows: 5, hint: tx("One bullet point per line. Start with a verb, add a number. **Bold** for a short label.") }),
            ), "is-role"));
          });
          roles.append(addButton(tx("+ Add another role at this company"), `${ePath}.roles`));
          entryBody.append(roles);
          entries.append(card(ePath, e, group.entries.length, entryBody, "is-entry"));
        });
        entries.append(addButton(tx("+ Add a position"), `${gPath}.entries`));
        body.append(entries);
        box.append(card(gPath, g, cv.groups.length, body, "is-group"));
      });
      box.append(addButton(tx("+ Add an experience section"), "groups"));
      return box;
    },
    side: () => {
      const box = el("div", "cv-items");
      cv.side.forEach((item, i) => {
        const path = `side.${i}`;
        const body = el("div", "cv-item-body");
        body.append(grid(
          field(tx("Title"), `${path}.title`, { wide: true, placeholder: tx("e.g. Founder – Catalyst Coaching") }),
          field(tx("Place, type and dates"), `${path}.meta`, { wide: true, placeholder: tx("e.g. Remote | part-time | 2021 – 2025") }),
          field(tx("One or two sentences"), `${path}.text`, { wide: true, area: true, rows: 2 }),
        ), logoEditor(path, "title"));
        box.append(card(path, i, cv.side.length, body));
      });
      box.append(addButton(tx("+ Add an activity"), "side"));
      return box;
    },
    education: () => {
      const box = el("div", "cv-items");
      cv.education.forEach((item, i) => {
        const path = `education.${i}`;
        box.append(card(path, i, cv.education.length, grid(
          field(tx("Degree or certificate"), `${path}.title`, { wide: true }),
          field(tx("School and place"), `${path}.school`),
          field(tx("Dates"), `${path}.date`, { placeholder: tx("e.g. 2012 – 2015") }),
          field(tx("Grade or detail"), `${path}.detail`, { wide: true }),
        )));
      });
      box.append(addButton(tx("+ Add education or a certificate"), "education"));
      return box;
    },
    skills: () => {
      const box = el("div", "cv-items");
      cv.skills.forEach((item, i) => {
        const path = `skills.${i}`;
        box.append(card(path, i, cv.skills.length, grid(
          field(tx("Group"), `${path}.title`, { wide: true, placeholder: tx("e.g. Systems & tools") }),
          field(tx("Skills, separated by commas"), `${path}.text`, { wide: true, area: true, rows: 2 }),
        )));
      });
      box.append(addButton(tx("+ Add a skill group"), "skills"));
      return box;
    },
    languages: () => {
      const box = el("div", "cv-items");
      cv.languages.forEach((item, i) => {
        const path = `languages.${i}`;
        box.append(card(path, i, cv.languages.length, grid(
          field(tx("Language"), `${path}.name`),
          field(tx("Level"), `${path}.level`, { placeholder: tx("e.g. C1 or Native") }),
        ), "is-compact"));
      });
      box.append(addButton(tx("+ Add a language"), "languages"));
      return box;
    },
  };

  const buildList = (name) => lists[name]?.replaceChildren(editors[name]());
  const buildEditor = () => Object.keys(editors).forEach(buildList);

  // Fields written in the page itself (design, person, profile).
  const syncStatic = () => {
    form.querySelectorAll("[data-path]").forEach((node) => {
      if (node.closest("[data-list]")) return;
      const value = getPath(node.dataset.path);
      if (node.type === "radio") node.checked = node.value === value;
      else node.value = value ?? "";
    });
    form.querySelectorAll("[data-heading]").forEach((node) => { node.placeholder = doc().headings[node.dataset.heading]; });
    renderPhoto();
  };

  const renderPhoto = () => {
    const thumb = form.querySelector("[data-photo-thumb]");
    thumb.replaceChildren();
    if (cv.photo) {
      const img = new Image();
      img.alt = "";
      img.src = cv.photo;
      img.style.objectPosition = `50% ${cv.photoY}%`;
      thumb.append(img);
    }
    thumb.classList.toggle("has-photo", Boolean(cv.photo));
    form.querySelector("[data-photo-remove]").hidden = !cv.photo;
    form.querySelector("[data-photo-position]").hidden = !cv.photo;
  };

  const refreshTitles = (node) => {
    for (let item = node.closest("[data-item]"); item; item = item.parentElement.closest("[data-item]")) {
      const path = item.dataset.item;
      const index = keys(path).pop();
      const title = item.querySelector(":scope > .cv-item-head > .cv-item-title");
      if (title) title.textContent = KINDS[kindOf(path)].title(getPath(path), index + 1);
    }
  };

  let logoTimer;
  form.addEventListener("input", (event) => {
    const target = event.target;
    const path = target.dataset.path;
    if (!path || target.type === "file") return;
    setPath(path, target.type === "range" ? Number(target.value) : target.value);
    if (path === "docLang") {
      form.querySelectorAll("[data-heading]").forEach((node) => { node.placeholder = doc().headings[node.dataset.heading]; });
      buildList("groups");
    }
    if (path === "photoY") renderPhoto();
    if (path.endsWith(".website") || path.endsWith(".company") || path.endsWith(".title")) {
      const box = target.closest("[data-item]")?.querySelector(":scope > .cv-item-body > .cv-logo-edit");
      clearTimeout(logoTimer);
      if (box) logoTimer = setTimeout(() => updateLogoEditor(box), path.endsWith(".website") ? 500 : 150);
    }
    refreshTitles(target);
    changed();
  });

  // Pictures: the photo is kept at up to 640 pixels, logos at up to 256.
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
      if (type === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL(type, 0.88));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("read"));
    };
    img.src = url;
  });

  form.addEventListener("change", async (event) => {
    const target = event.target;
    const path = target.dataset.upload;
    if (!path || !target.files?.[0]) return;
    const isPhoto = path === "photo";
    try {
      const src = await readImage(target.files[0], isPhoto ? 640 : 256, isPhoto ? "image/jpeg" : "image/png");
      setPath(path, src);
      if (isPhoto) renderPhoto();
      else {
        const box = target.closest("[data-logo-for]");
        if (box) buildList(box.closest("[data-list]").dataset.list);
      }
      changed();
      say(isPhoto ? tx("Photo added.") : tx("Logo added."));
    } catch {
      say(tx("This file could not be read as a picture. Use a JPG, PNG or WebP."));
    }
    target.value = "";
  });

  // Replace the whole CV (example, backup, clear).
  const replaceCv = (next, message) => {
    cv = next;
    syncStatic();
    buildEditor();
    changed();
    if (message) say(message);
  };

  const download = (name, text, type) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = el("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const fileName = () => (cv.person.name.trim() || "cv").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "cv";

  const actions = {
    add: (path) => {
      const list = getPath(path);
      const kind = kindOf(path);
      if (!Array.isArray(list) || list.length >= (LIMITS[kind] || MAX_ITEMS)) return;
      list.push(copy(KINDS[kind].template));
      const top = keys(path)[0];
      buildList(top);
      const added = form.querySelector(`[data-item="${path}.${list.length - 1}"] input, [data-item="${path}.${list.length - 1}"] textarea`);
      added?.focus();
      changed();
    },
    remove: (path) => {
      const parts = keys(path);
      const index = parts.pop();
      const listPath = parts.join(".");
      const list = getPath(listPath);
      if (!Array.isArray(list)) return;
      if (hasText(list[index]) && !window.confirm(tx("Remove “{name}”?", { name: KINDS[kindOf(listPath)].title(list[index], index + 1) }))) return;
      list.splice(index, 1);
      if (!list.length && (kindOf(listPath) === "roles" || kindOf(listPath) === "entries")) list.push(copy(KINDS[kindOf(listPath)].template));
      buildList(parts[0]);
      form.querySelector(`[data-list="${parts[0]}"] [data-act="add"][data-path="${listPath}"]`)?.focus();
      changed();
    },
    move: (path, node) => {
      const parts = keys(path);
      const index = parts.pop();
      const list = getPath(parts.join("."));
      const to = index + Number(node.dataset.dir);
      if (!Array.isArray(list) || to < 0 || to >= list.length) return;
      [list[index], list[to]] = [list[to], list[index]];
      buildList(parts[0]);
      form.querySelector(`[data-item="${[...parts, to].join(".")}"] [data-act="move"][data-dir="${node.dataset.dir}"]:not(:disabled)`)?.focus();
      changed();
    },
    clear: (path) => {
      setPath(path, "");
      if (path === "photo") renderPhoto();
      else buildList(keys(path)[0]);
      changed();
    },
    example: () => {
      if (hasText({ ...cv, docLang: "", theme: "", photoShape: "", density: "" }) && !window.confirm(tx("Replace your CV with the example? Save a backup first if you want to keep it."))) return;
      const example = clean({ ...copy(data.examples[cv.docLang] || data.examples.en), docLang: cv.docLang, theme: cv.theme, photoShape: cv.photoShape, density: cv.density }, data, LANG);
      replaceCv(example, tx("Example loaded. Change anything; it updates as you type."));
    },
    reset: () => {
      if (!window.confirm(tx("Delete this CV from this browser and start again?"))) return;
      const next = blank();
      next.docLang = cv.docLang;
      next.theme = cv.theme;
      replaceCv(next, tx("Cleared."));
    },
    export: () => {
      download(`${fileName()}.cv.json`, JSON.stringify({ app: "stiven-catalyst-cv", version: 1, cv }, null, 2), "application/json");
      say(tx("Backup saved. Open it here later, on any device, to keep working."));
    },
    print: () => {
      const print = () => {
        cancelAnimationFrame(frame);
        renderCv();
        const title = document.title;
        document.title = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" – ") || title;
        window.addEventListener("afterprint", () => { document.title = title; }, { once: true });
        window.print();
      };
      // First a short guide to saving the PDF (print-guide.js).
      if (window.PrintGuide) window.PrintGuide.open(print, { colours: true });
      else print();
    },
  };

  app.addEventListener("click", (event) => {
    const node = event.target.closest("[data-act]");
    if (!node || !actions[node.dataset.act]) return;
    node.closest("details.cv-more")?.removeAttribute("open");
    actions[node.dataset.act](node.dataset.path, node);
  });

  app.querySelector("[data-import]").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const saved = isObject(parsed) && isObject(parsed.cv) ? parsed.cv : parsed;
      if (!isObject(saved) || !isObject(saved.person)) throw new Error("shape");
      if (hasText(cv.person) && !window.confirm(tx("Replace your CV with the one in this file?"))) return;
      replaceCv(clean(saved, data, LANG), tx("Backup opened."));
    } catch {
      say(tx("This file is not a CV backup from this page."));
    }
  });

  syncStatic();
  buildEditor();
  renderCv();
  // Fonts can change line breaks after the first layout.
  document.fonts?.ready.then(schedule);
})();
