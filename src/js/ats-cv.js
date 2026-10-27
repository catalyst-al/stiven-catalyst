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
  // A language of the document is one of its own keys: "constructor" or "__proto__" (from a file or a backup) is in
  // every object and is none.
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const clean = (saved, data, lang) => {
    const cv = fit(saved, SHAPE);
    if (!own(data.docLangs, cv.docLang)) cv.docLang = own(data.docLangs, lang) ? lang : "en";
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
  // Text for matching only: one form of every letter (NFC, so a "ü" typed as "u" and a dot above is one letter), lower
  // case, and the letters people write two ways folded. "ä", "ö", "ü" become "ae", "oe", "ue" (Fuehrung), or with strip
  // "a", "o", "u" (Fuhrung), "ß" becomes "ss", and "ë", "ç", "é" and the rest lose their marks (pergjegjes). A term is
  // found when either way finds it. What the visitor sees keeps the text as written.
  const UMLAUT = { ä: ["ae", "a"], ö: ["oe", "o"], ü: ["ue", "u"] };
  const fold = (text, strip = false) => String(text ?? "").normalize("NFC").toLowerCase()
    .replace(/ß/g, "ss").replace(/[äöü]/g, (ch) => UMLAUT[ch][strip ? 1 : 0])
    .normalize("NFD").replace(/\p{M}+/gu, "").normalize("NFC");
  const tokens = (text) => String(text ?? "").normalize("NFC").toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}+#&./-]*[\p{L}\p{N}+#]|[\p{L}]/gu) || [];
  // Hyphens and slashes count as spaces, so "Front-Office" in the ad is found in a CV that writes
  // "Front Office" (and the other way round), and "Check-in" in "Checkin".
  const simple = (text, strip = false) => fold(text, strip).replace(/[-‐‑–/]+/g, " ").replace(/\s+/g, " ");
  const escapeTerm = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // A term counts where a word starts: "lean" is not in "cleaning", "sap" not in "disappear". A short term, or one of
  // several words, must also end with its word, where an ending may follow: a plural ("audits", "Kennzahlen") and, after
  // five letters or more, the endings of Albanian ("piruni", "ankesat", "sigurinë"). "excel" is not in "excellent",
  // "java" not in "javascript". One long word may run on, as German compounds do, and "kommunikation" also counts when
  // the CV says "kommunikativ". "front office" also matches "frontoffice", and "email" matches "e-mail".
  const ENDINGS = "s|es|e|en|n";
  const ENDINGS_LONG = `${ENDINGS}|a|ja|ne|te|se|ve|it|in|i|u|t`;
  const ending = (word) => (word.length >= 5 ? ENDINGS_LONG : ENDINGS);
  // The patterns of a term in a folded text; the term itself is group 1. stems: false leaves out the shortened stem
  // ("kommunikativ" for "kommunikation"), which the ad side does not use: there "report" is not "reporting".
  const patternCache = new Map();
  const patterns = (term, strip, { stems = true, flags = "u" } = {}) => {
    const key = `${strip ? 1 : 0}${stems ? 1 : 0}${flags}${term}`;
    if (!patternCache.has(key)) {
      if (patternCache.size > 5000) patternCache.clear();
      patternCache.set(key, buildPatterns(term, strip, stems, flags));
    }
    return patternCache.get(key);
  };
  const buildPatterns = (term, strip, stems, flags) => {
    const k = simple(term, strip).trim();
    if (!k) return [];
    const words = k.split(" ");
    const longWord = k.length >= 8 && words.length === 1;
    const pattern = (body, runOn) => new RegExp(`(?:^|[^\\p{L}\\p{N}])(${body}${runOn ? "" : `(?:${ending(words[words.length - 1])})?(?![\\p{L}\\p{N}])`})`, flags);
    // An Albanian joining word changes with the case of the words around it: "zinxhiri i furnizimit" is also
    // "zinxhirin e furnizimit".
    const word = (text, n) => (words.length > 1 && /^(?:i|e|te|se)$/.test(text) ? "(?:i|e|te|se)"
      : escapeTerm(text) + (n < words.length - 1 && text.length >= 5 ? `(?:${ENDINGS_LONG})?` : ""));
    const out = [pattern(words.map(word).join(" ?"), longWord)];
    if (stems && longWord && /^\p{L}+$/u.test(k)) out.push(pattern(escapeTerm(k.slice(0, -3)), true));
    // Every place a pattern matches holds the first four letters of the term: a quick look for them comes first.
    out.head = words[0].slice(0, 4);
    return out;
  };
  // finder(text) folds the text once and gives a test for terms; hasTerm(text, term) is the same for one term.
  const finder = (text, options = {}) => {
    const forms = [false, true].map((strip) => [simple(text, strip), simple(fold(text, strip).replace(/(\p{L})[-‐‑](?=\p{L})/gu, "$1"), strip)]);
    return (term) => [false, true].some((strip, i) => {
      const tests = patterns(term, strip, options);
      return forms[i].some((t) => t.includes(tests.head) && tests.some((re) => re.test(t)));
    });
  };
  const hasTerm = (text, term) => finder(text)(term);
  // Where a term stands in a text as typed ("SQL", "Power BI", "KPI" for "kpis"): each place, in the text's own letters.
  const spellings = (text, term) => {
    const words = String(term).normalize("NFC").split(/[\s‐‑–/-]+/).filter(Boolean);
    if (!words.length || !String(text ?? "").normalize("NFC").toLowerCase().includes(words[0].toLowerCase())) return [];
    const re = new RegExp(`(?<![\\p{L}\\p{N}])(${words.map(escapeTerm).join("[\\s‐‑–/-]*")})(?:s|es|e|en|n)?(?![\\p{L}\\p{N}])`, "giu");
    return [...String(text ?? "").normalize("NFC").matchAll(re)].map((m) => m[1]);
  };
  // A short abbreviation the ad writes in capitals ("IT", "HR", "MS") is also a common word in lower case ("it", "ms"),
  // so it counts in the CV only in capitals too.
  const capitals = (label) => /^[\p{Lu}\p{N}&+#]+$/u.test(label) && label.replace(/[^\p{L}]/gu, "").length <= 3;
  // Words that mean the same skill (src/_data/atsSkills.json: "Staplerschein", "forklift licence" and "pirun" are one
  // group). A key word of the ad counts as found when the CV has it, or any other word of its group; the match says
  // which word it found, so the visitor can decide whether to write it as the ad does.
  const groupIndex = new WeakMap();
  const groupOf = (term, groups = []) => {
    let index = groupIndex.get(groups);
    if (!index) {
      index = new Map();
      groups.forEach((group) => group.forEach((word) => { if (!index.has(simple(word).trim())) index.set(simple(word).trim(), group); }));
      groupIndex.set(groups, index);
    }
    return index.get(simple(term).trim()) || null;
  };
  const findTerm = (text, term, groups = [], has = finder(text), label = "") => {
    const own = capitals(label)
      ? new RegExp(`(?<![\\p{L}\\p{N}])${escapeTerm(label)}s?(?![\\p{L}\\p{N}])`, "u").test(String(text ?? "").normalize("NFC"))
      : has(term);
    if (own) return { found: true, via: null };
    const via = (groupOf(term, groups) || []).find((word) => simple(word).trim() !== simple(term).trim() && has(word));
    return { found: Boolean(via), via: via || null };
  };
  // The parts of an ad: a short line that reads like "Ihr Profil" or "Requirements" opens what is required, one like
  // "Nice to have" what is only welcome, and one like "Ihre Aufgaben" or "We offer" closes them; the text before any
  // such line (the company, the tasks) is neither. A key word found in the required part weighs double in the score.
  // What the company offers, who it is and how to apply (offerHeadings) is also kept apart as offer: no key words come
  // from there. job is the ad without it.
  const adParts = (ad, skills = {}) => {
    const headingLike = (line, list) => {
      const plain = simple(line).replace(/[:.!?()\-–—*#]+/g, " ").replace(/\s+/g, " ").trim();
      return plain.split(" ").length <= 7 && (list || []).some((heading) => plain === simple(heading).trim() || plain.startsWith(`${simple(heading).trim()} `) || plain.endsWith(` ${simple(heading).trim()}`));
    };
    const parts = { required: [], optional: [], other: [], offer: [], job: [] };
    const kindOf = (text) => (headingLike(text, skills.requirementHeadings) ? "required" : headingLike(text, skills.optionalHeadings) ? "optional"
      : headingLike(text, skills.otherHeadings) ? "other" : headingLike(text, skills.offerHeadings) ? "offer" : null);
    let current = "other";
    let offer = false;
    String(ad ?? "").split(/\r?\n/).forEach((line) => {
      if (!line.trim()) return;
      // "Requirements: SQL and Excel" opens the part and is its first line.
      const colon = /^([^:]{2,60}):\s*(\S.*)$/.exec(line);
      const kind = kindOf(colon ? colon[1] : line);
      if (kind) {
        current = kind === "offer" ? "other" : kind;
        offer = kind === "offer";
        if (!colon) return;
      }
      const text = kind ? colon[2] : line;
      parts[current].push(text);
      parts[offer ? "offer" : "job"].push(text);
    });
    return Object.fromEntries(Object.entries(parts).map(([key, list]) => [key, list.join("\n")]));
  };

  // The key words of an ad, most telling first:
  // 1. skills: a word of a skills group the ad uses (each group once), an abbreviation the ad writes in capitals
  //    ("SQL", "WMS", "IT", "B2B", "KPIs", "5S", "C#"), and a name of capitalised words with one ("Power BI",
  //    "SAP EWM", "MS Office"). The longest group word is looked for first and a shorter one does not count inside it:
  //    "audit" in "night audit", "leje drejtimi" in "leje drejtimi për pirun". A word of three letters or less, or one
  //    that is also a common word (names: "Word", "Excel", "Opera"), counts only where the ad writes it with a capital;
  // 2. two words the ad uses together twice or more ("night audit");
  // 3. other words the ad uses twice, or once in its required part.
  // Filler, legal and application words are stop words; abbreviations such as "GDPR" or "CV" are notKeywords. Only
  // a short ad, with fewer than MIN_TERMS such terms, is filled up with its other words in the order they come; how
  // long a word is, or a single use, no longer makes it a key word.
  const MIN_TERMS = 10;
  const ACRONYM = /(?<![\p{L}\p{N}&+#])(\p{Lu}[\p{Lu}\p{N}&]*[\p{Lu}\p{N}]|\p{N}+\p{Lu}[\p{Lu}\p{N}]*|\p{Lu}(?:#|\+\+))(?:s)?(?![\p{L}\p{N}#+])/gu;
  const ACRONYM_WORD = new RegExp(`^${ACRONYM.source}$`, "u");
  const NAME = /(?<![\p{L}\p{N}])(?:\p{Lu}[\p{L}\p{N}&]*)(?: \p{Lu}[\p{L}\p{N}&]*){1,2}(?![\p{L}\p{N}])/gu;
  const keywords = (ad, stopwords, skills = {}, limit = 24) => {
    const stop = new Set(stopwords.map((word) => fold(word)));
    const notKeywords = new Set((skills.notKeywords || []).map((word) => fold(word)));
    const names = new Set((skills.names || []).map((word) => fold(word)));
    const groups = skills.groups || [];
    const parts = adParts(ad, skills);
    const job = String(parts.job).normalize("NFC");
    const has = finder(job, { stems: false });
    const required = finder(parts.required, { stems: false });
    const plain = simple(job);
    const at = (term) => { const i = plain.indexOf(simple(term).trim()); return i < 0 ? Infinity : i; };
    const terms = new Map();
    const add = (term, key, kind, count) => {
      const old = terms.get(key);
      if (old) { old.count += count; return; }
      terms.set(key, { term: term.normalize("NFC").toLowerCase(), kind, count, at: at(term), required: required(term) });
    };
    const keyOf = (term) => { const group = groupOf(term, groups); return group ? `group:${groups.indexOf(group)}` : `term:${simple(term).trim()}`; };
    // The words of the skills found, without a plural ending, so "scanners" is not a key word next to "handheld scanner".
    const base = (word) => (word.length > 4 ? word.replace(/(?:es|s|en|n|e)$/, "") : word);
    const skillWords = new Set();
    const mark = (term) => simple(term).trim().split(" ").forEach((word) => skillWords.add(base(word)));
    const inSkill = (word) => skillWords.has(base(simple(word).trim()));

    // 1. Skills. The group words, longest first, each where no longer one stands already.
    let masked = plain;
    const hits = new Map();
    groups.flatMap((group, g) => group.map((word) => ({ word, g, length: simple(word).trim().length })))
      .sort((a, b) => b.length - a.length)
      .forEach(({ word, g }) => {
        if (!has(word)) return;
        const seen = spellings(job, word);
        const named = seen.some((spelling) => /\p{Lu}/u.test(spelling));
        if (!named && (fold(word).replace(/[^\p{L}\p{N}]/gu, "").length <= 3 || names.has(fold(word)))) return;
        const [re] = patterns(word, false, { stems: false, flags: "gu" });
        const free = [...masked.matchAll(re)];
        if (!free.length && patterns(word, false, { stems: false })[0].test(plain)) return;
        free.forEach((m) => { const from = m.index + m[0].length - m[1].length; masked = masked.slice(0, from) + " ".repeat(m[1].length) + masked.slice(from + m[1].length); });
        const capital = seen.some((spelling) => spelling.split(/[\s‐‑–/-]+/).some((part) => ACRONYM_WORD.test(part)));
        hits.set(g, [...(hits.get(g) || []), { word, capital, named, at: at(word), count: Math.max(1, seen.length) }]);
        mark(word);
      });
    hits.forEach((list, g) => {
      // The ad's own product or abbreviation first ("Power BI", not "dashboards"), then the first used, then the longest.
      const best = [...list].sort((a, b) => b.capital - a.capital || b.named - a.named || a.at - b.at || b.word.length - a.word.length)[0];
      add(best.word, `group:${g}`, "skill", list.reduce((sum, hit) => sum + hit.count, 0));
    });
    // Names and abbreviations, in the lines that are not all capitals. A capital at the start of a sentence makes no
    // name ("Write SQL queries"); stop words at either end are not part of one ("mit SAP").
    job.split("\n").forEach((line) => {
      const letters = line.replace(/[^\p{L}]/gu, "");
      if (letters.length > 8 && letters.replace(/[^\p{Lu}]/gu, "").length / letters.length > 0.6) return;
      const taken = [];
      for (const m of line.matchAll(NAME)) {
        const words = m[0].split(" ");
        if (/^[\s\-–•*·(]*$|[.!?:;]\s*$/.test(line.slice(0, m.index)) && !ACRONYM_WORD.test(words[0])) words.shift();
        while (words.length && stop.has(fold(words[0])) && !ACRONYM_WORD.test(words[0])) words.shift();
        while (words.length && stop.has(fold(words[words.length - 1])) && !ACRONYM_WORD.test(words[words.length - 1])) words.pop();
        if (words.length < 2 || !words.some((word) => ACRONYM_WORD.test(word))) continue;
        const name = words.join(" ");
        taken.push([m.index, m.index + m[0].length]);
        if (words.every(inSkill)) continue;
        add(name, keyOf(name), "skill", 1);
        mark(name);
      }
      for (const m of line.matchAll(ACRONYM)) {
        if (taken.some(([from, to]) => m.index >= from && m.index < to) || notKeywords.has(fold(m[1]))) continue;
        if (inSkill(m[1]) && !groupOf(m[1], groups)) continue;
        add(m[1], keyOf(m[1]), "skill", 1);
        mark(m[1]);
      }
    });

    // 2. and 3. Pairs and words, leaving out the words of a skill found ("it-systemen" for "IT").
    const address = (word) => /@/.test(word) || /^(?:www\.|https?[:/])/.test(word) || /\.(?:de|at|ch|com|net|org|eu|al|it|fr|uk|io|info|biz|co)(?:\/|$)/.test(word) || /^\p{L}\.\p{L}\.?$/u.test(word);
    const useful = (word) => word.length >= 3 && !stop.has(fold(word)) && !notKeywords.has(fold(word)) && !/^\d/.test(word) && !address(word)
      && !simple(word).trim().split(" ").some(inSkill) && !terms.has(keyOf(word));
    const seq = tokens(job);
    const uni = new Map();
    const bi = new Map();
    seq.forEach((word, i) => {
      if (!useful(word)) return;
      uni.set(word, (uni.get(word) || 0) + 1);
      const next = seq[i + 1];
      if (next && useful(next)) bi.set(`${word} ${next}`, (bi.get(`${word} ${next}`) || 0) + 1);
    });
    [...bi].filter(([, n]) => n >= 2).forEach(([pair, n]) => add(pair, keyOf(pair), "pair", n));
    const inPair = new Set([...terms.values()].filter((item) => item.kind === "pair").flatMap((item) => item.term.split(" ")));
    const words = [...uni].filter(([word]) => !inPair.has(word));
    words.forEach(([word, n]) => { if (n + (required(word) ? 1 : 0) >= 2) add(word, keyOf(word), "word", n); });
    if (terms.size < MIN_TERMS) words.forEach(([word, n]) => { if (terms.size < MIN_TERMS) add(word, keyOf(word), "fill", n); });

    const rank = { skill: 0, pair: 1, word: 2, fill: 3 };
    return [...terms.values()]
      .sort((a, b) => rank[a.kind] - rank[b.kind] || (a.kind === "fill" ? 0 : b.required - a.required || b.count - a.count) || a.at - b.at)
      .slice(0, limit).map((item) => item.term);
  };
  // A term's weight in the score: 2 when the ad requires it, 1 otherwise (also when the ad has no such part).
  const weightOf = (term, parts) => (parts.required && hasTerm(parts.required, term) ? 2 : 1);
  // The match of a CV text to the key words of an ad: each term with its label (as the ad writes it), found, via (the
  // group word that counted) and weight, and the score as the weighted share found. The score says how many of the
  // ad's terms the CV uses; it does not say how any software or recruiter will rank the CV.
  const match = (text, terms, skills = {}, ad = "") => {
    const parts = adParts(ad, skills);
    const has = finder(text);
    const items = terms.map((term) => {
      const label = spellings(ad, term)[0] || term;
      return { term, label, ...findTerm(text, term, skills.groups, has, label), weight: weightOf(term, parts) };
    });
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    const got = items.filter((item) => item.found).reduce((sum, item) => sum + item.weight, 0);
    return { items, score: total ? got / total : 0, required: items.filter((item) => item.weight > 1).length };
  };

  // ---------- Plain text ----------
  const period = (from, to, present) => {
    const start = from.trim();
    const end = to.trim();
    if (start && end) return `${start} – ${end}`;
    return start ? `${start} – ${present}` : end;
  };
  const headingOf = (cv, doc, key) => cv.headings[key]?.trim() || doc.headings[key];
  // The CV as plain text; without headings for the job ad match, so that "Ausbildung" in the
  // ad is not found in the heading "Ausbildung" of a CV that has no education entry.
  const plainText = (cv, doc, { headings = true } = {}) => {
    const out = [];
    const p = cv.person;
    const section = (title, body) => { if (body.length) out.push("", ...(headings ? [title.toUpperCase()] : []), ...body); };
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

  // ---------- JSON Resume (jsonresume.org, schema 1.0.0) ----------
  // The open CV format other CV tools read and write. The sections of this CV map onto basics, work, education,
  // skills and languages; what the standard has no place for (key achievements, extra sections, the headings, the
  // language of the document) travels under meta.stivenCatalyst, so a file saved here opens here again whole.
  const JSON_RESUME_SCHEMA = "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json";
  const looksJsonResume = (value) => isObject(value) && (isObject(value.basics) || Array.isArray(value.work));
  // "2022-03" or "2022-03-15" in a file becomes "03.2022" in the CV; a year stays a year; anything else as it is.
  const dateIn = (value) => {
    const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(String(value ?? "").trim());
    return m ? `${m[2]}.${m[1]}` : String(value ?? "").trim();
  };
  // "03.2022" in the CV becomes "2022-03" in the file; a year stays a year; other spellings are left as typed.
  const dateOut = (value) => {
    const m = /^(\d{1,2})[./](\d{4})$/.exec(String(value ?? "").trim());
    return m ? `${m[2]}-${m[1].padStart(2, "0")}` : String(value ?? "").trim();
  };
  const toJsonResume = (cv) => {
    const p = cv.person;
    const str = (value) => String(value ?? "").trim();
    return {
      $schema: JSON_RESUME_SCHEMA,
      basics: {
        name: str(p.name), label: str(p.headline), email: str(p.email), phone: str(p.phone), url: str(p.website),
        summary: unbold(str(cv.summary)),
        location: { city: str(p.location) },
      },
      work: cv.experience.filter(hasText).map((job) => ({
        name: str(job.company), position: str(job.title), location: str(job.location),
        startDate: dateOut(job.from), endDate: dateOut(job.to), highlights: lines(job.bullets).map(unbold),
      })),
      education: cv.education.filter(hasText).map((item) => {
        // "09.2012 – 06.2016 (part-time)" splits at its spaced dash only; "2019-2021" and "2019–2021" at theirs.
        const date = str(item.date);
        const [, start = date, end = ""] = /^(.+?)\s+[–—-]\s+(.+)$/.exec(date) || /^(\d{4})-(\d{4})$/.exec(date) || /^([^–—]+)[–—]([^–—]+)$/.exec(date) || [];
        return { institution: str(item.school), area: str(item.title), startDate: dateOut(start), endDate: dateOut(end), score: str(item.detail) };
      }),
      skills: cv.skills.filter(hasText).map((item) => ({ name: str(item.title), keywords: str(item.text).split(/\s*[,;]\s*/).filter(Boolean) })),
      languages: cv.languages.filter(hasText).map((item) => ({ language: str(item.name), fluency: str(item.level) })),
      meta: { stivenCatalyst: { docLang: cv.docLang, extra: str(p.extra), highlights: str(cv.highlights), extras: cv.extras.filter(hasText).map((e) => ({ title: str(e.title), text: str(e.text) })), headings: cv.headings } },
    };
  };
  // A CV from a JSON Resume file (any tool's), in the shape of fromBuilder; null when it is not one.
  const fromJsonResume = (file) => {
    if (!looksJsonResume(file)) return null;
    const str = (value) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");
    const list = (value) => (Array.isArray(value) ? value.filter(isObject) : []);
    const b = isObject(file.basics) ? file.basics : {};
    const own = isObject(file.meta) && isObject(file.meta.stivenCatalyst) ? file.meta.stivenCatalyst : {};
    const place = isObject(b.location) ? [str(b.location.city), str(b.location.region)].filter(Boolean).join(", ") || str(b.location.address) : "";
    const span = (item) => [dateIn(item.startDate), dateIn(item.endDate)].filter(Boolean).join(" – ");
    const education = [
      ...list(file.education).map((item) => ({ title: [str(item.studyType), str(item.area)].filter(Boolean).join(" "), school: str(item.institution), date: span(item), detail: str(item.score) })),
      ...list(file.certificates).map((item) => ({ title: str(item.name), school: str(item.issuer), date: dateIn(item.date), detail: str(item.url) })),
    ];
    const extras = Array.isArray(own.extras) ? own.extras.filter(isObject).map((e) => ({ title: str(e.title), text: str(e.text) })) : [];
    const section = (items, title, line) => { if (items.length) extras.push({ title, text: items.map(line).filter(Boolean).join("\n") }); };
    if (!Array.isArray(own.extras)) {
      section(list(file.volunteer), "Volunteering", (item) => [[str(item.position), str(item.organization)].filter(Boolean).join(", "), span(item)].filter(Boolean).join(" | ") + (str(item.summary) ? `: ${str(item.summary)}` : ""));
      section(list(file.projects), "Projects", (item) => [str(item.name), str(item.description)].filter(Boolean).join(": "));
      section(list(file.awards), "Awards", (item) => [str(item.title), str(item.awarder), dateIn(item.date)].filter(Boolean).join(", "));
    }
    return {
      docLang: str(own.docLang),
      person: { name: str(b.name), headline: str(b.label), location: place, phone: str(b.phone), email: str(b.email), website: str(b.url), extra: str(own.extra) },
      summary: str(b.summary),
      highlights: str(own.highlights),
      experience: list(file.work).map((job) => ({
        title: str(job.position), company: str(job.name) || str(job.company), location: str(job.location), from: dateIn(job.startDate), to: dateIn(job.endDate),
        bullets: [...(Array.isArray(job.highlights) ? job.highlights.map(str) : []), ...(!Array.isArray(job.highlights) || !job.highlights.length ? [str(job.summary)] : [])].filter(Boolean).join("\n"),
      })),
      education,
      skills: list(file.skills).map((item) => ({ title: str(item.name), text: Array.isArray(item.keywords) ? item.keywords.map(str).filter(Boolean).join(", ") : str(item.level) })),
      languages: list(file.languages).map((item) => ({ name: str(item.language), level: str(item.fluency) })),
      extras,
      headings: isObject(own.headings) ? own.headings : undefined,
    };
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

  // ---------- PDF file (pdf-kit.js writes the file) ----------
  // The page of the preview in points (a pixel of the preview is 0.75 pt): A4, 45 pt above, 54 pt at the sides, 48 pt
  // below, the same sizes and gaps. Arial and Calibri become Helvetica, Georgia becomes Times: the standard fonts every
  // PDF reader has, so the file is a few kilobytes and lays out the same on every screen and printer.
  const pdf = (cv, data, now = new Date()) => {
    const doc = data.docLangs[cv.docLang];
    const font = data.fonts.find((item) => item.id === cv.font) || data.fonts[0];
    const accent = (data.accents.find((item) => item.id === cv.accent) || data.accents[0]).color;
    const PT = 0.75;
    const INK = "#1a1a1a";
    const MUTED = "#4a4a4a";
    const body = 13 * PT;
    const leading = body * 1.42;
    const runs = (text) => String(text).split(/\*\*(.+?)\*\*/g).map((part, i) => ({ text: part, bold: i % 2 === 1 })).filter((run) => run.text);
    const blocks = [];
    const add = (block) => blocks.push(block);
    const text = (value, space, extra = {}) => add({ kind: "text", runs: runs(value), size: body, leading, color: INK, space, ...extra });
    const section = (title) => {
      add({ kind: "text", text: title.toUpperCase(), size: 13.5 * PT, bold: true, color: accent, leading: 13.5 * PT * 1.42, space: 18 * PT, keep: true, spacing: 0.55 });
      add({ kind: "rule", color: accent, width: 0.9, space: 3 * PT, keep: true });
    };
    const bullets = (value, first) => lines(value).forEach((line, i) => text(line, i ? 2 * PT : first, { bullet: "•", indent: 14 * PT }));
    const p = cv.person;
    add({ kind: "text", text: p.name.trim() || doc.yourName, size: 27 * PT, bold: true, color: accent, leading: 27 * PT * 1.15, space: 0 });
    if (p.headline.trim()) add({ kind: "text", text: p.headline.trim(), size: 14.5 * PT, bold: true, color: INK, leading: 14.5 * PT * 1.42, space: 4 * PT });
    const contact = [p.location, p.phone, p.email, p.website, p.extra].map((part) => part.trim()).filter(Boolean);
    if (contact.length) add({ kind: "text", text: contact.join("  |  "), size: 12.5 * PT, color: MUTED, leading: 12.5 * PT * 1.42, space: 4 * PT });

    if (cv.summary.trim()) {
      section(headingOf(cv, doc, "summary"));
      cv.summary.trim().split(/\n\s*\n/).forEach((para, i) => text(para.replace(/\s*\n\s*/g, " "), i ? 4 * PT : 6 * PT));
    }
    if (lines(cv.highlights).length) {
      section(headingOf(cv, doc, "highlights"));
      bullets(cv.highlights, 6 * PT);
    }
    const jobs = cv.experience.filter(hasText);
    if (jobs.length) {
      section(headingOf(cv, doc, "experience"));
      jobs.forEach((job, i) => {
        add({ kind: "row", left: job.title.trim(), right: period(job.from, job.to, doc.present), size: 13.5 * PT, leading: 13.5 * PT * 1.42, color: INK, rightColor: MUTED, space: i ? 12 * PT : 6 * PT, keep: true });
        const sub = [job.company, job.location].map((part) => part.trim()).filter(Boolean).join(" | ");
        if (sub) text(sub, 2 * PT, { color: MUTED, keep: Boolean(lines(job.bullets).length) });
        bullets(job.bullets, 3 * PT);
      });
    }
    const schools = cv.education.filter(hasText);
    if (schools.length) {
      section(headingOf(cv, doc, "education"));
      schools.forEach((item, i) => {
        add({ kind: "row", left: item.title.trim(), right: item.date.trim(), size: 13.5 * PT, leading: 13.5 * PT * 1.42, color: INK, rightColor: MUTED, space: i ? 10 * PT : 6 * PT, keep: true });
        if (item.school.trim()) text(item.school.trim(), 2 * PT, { color: MUTED });
        if (item.detail.trim()) text(item.detail.trim(), 2 * PT);
      });
    }
    const skills = cv.skills.filter(hasText);
    if (skills.length) {
      section(headingOf(cv, doc, "skills"));
      skills.forEach((item, i) => add({ kind: "text", runs: [...(item.title.trim() ? [{ text: `${item.title.trim()}: `, bold: true }] : []), ...runs(item.text.trim())], size: body, leading, color: INK, space: i ? 4 * PT : 6 * PT }));
    }
    const langs = cv.languages.filter(hasText);
    if (langs.length) {
      section(headingOf(cv, doc, "languages"));
      text(langs.map((item) => item.level.trim() ? `${item.name.trim()} (${item.level.trim()})` : item.name.trim()).join(", "), 6 * PT);
    }
    cv.extras.filter(hasText).forEach((extra) => {
      section(extra.title.trim() || "—");
      lines(extra.text).forEach((line, i) => text(line, i ? 4 * PT : 6 * PT));
    });

    const footerName = [p.name.trim(), doc.doc].filter(Boolean).join(" · ");
    return window.PdfKit.flow(blocks, {
      family: font.pdf || "helvetica",
      margins: { top: 60 * PT, bottom: 64 * PT, left: 72 * PT, right: 72 * PT },
      footer: (n, total) => [footerName, doc.page.replace("{n}", n).replace("{total}", total)],
      footerSize: 10.5 * PT,
      footerColor: "#666666",
      footerAt: 26 * PT,
      title: [p.name.trim(), doc.doc].filter(Boolean).join(" – "),
      author: p.name.trim(),
      subject: p.headline.trim(),
      lang: cv.docLang,
      date: now,
    });
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
      // The block under a heading that opened this page stays with it, even when it is taller
      // than the page (the page is then marked), so no page ever holds a heading alone.
      const underHeading = page.length === 1 && blocks[page[0]].keep;
      if (page.length && !underHeading && used + need > limit) {
        pages.push([index]);
        used = block.height;
      } else {
        page.push(index);
        used += gap + block.height;
      }
    });
    return pages;
  };

  window.AtsCv = { fit, clean, fromBuilder, fold, keywords, hasTerm, finder, groupOf, findTerm, adParts, match, plainText, docx, pdf, paginate, toJsonResume, fromJsonResume, looksJsonResume, SHAPE };

  // ======================================================================
  const app = document.querySelector("[data-ats]");
  const dataEl = document.getElementById("ats-cv-data");
  if (!app || !dataEl || !window.ToolKit) return;

  const { LANG, tx, el, read } = window.ToolKit;
  const data = JSON.parse(dataEl.textContent);
  const builder = JSON.parse(document.getElementById("ats-builder-data")?.textContent || "{}");
  const sideTitles = Object.fromEntries(Object.entries(builder.docLangs || {}).map(([code, lang]) => [code, lang.headings?.side || ""]));
  const STOP = data.stopwords.split(/\s+/);
  // Words that mean the same skill, and the headings that open the required part of an ad (src/_data/atsSkills.json).
  const SKILLS = JSON.parse(document.getElementById("ats-skills-data")?.textContent || "{}");
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
    // Locked with a PIN (js/work-lock.js): nothing of the visitor's work is written in plain text.
    if (window.WorkLock?.locked) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cv));
      dirty = false;
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
    const name = el("h2", "ats-name", p.name.trim() || doc().yourName);
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
  // A block taller than a page is cut off by the page; the page is marked and the checks say so.
  let overflow = false;

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
    overflow = false;
    const footerName = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" · ");
    scaler.replaceChildren(...pages.map((indices, n) => {
      const page = el("div", "ats-page");
      let used = 0;
      indices.forEach((index, i) => {
        list[index].node.style.marginTop = i ? `${list[index].space}px` : "";
        used += (i ? list[index].space : 0) + list[index].height;
        page.append(list[index].node);
      });
      if (used > PAGE_H - TOP - BOTTOM) {
        overflow = true;
        page.classList.add("is-over");
      }
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

  // ---------- Job ad and checks ----------
  // The CV as it is written: the match folds case and letters itself, and needs the capitals of "IT" or "MS".
  const cvText = () => plainText(cv, doc(), { headings: false });
  // The key words change only with the ad, not with every letter typed in the CV.
  let adTerms = { ad: null, terms: [] };
  const termsOf = (ad) => {
    if (adTerms.ad !== ad) adTerms = { ad, terms: keywords(ad, STOP, SKILLS) };
    return adTerms.terms;
  };
  const renderMatch = () => {
    const terms = termsOf(cv.jobAd);
    matchBox.replaceChildren();
    if (!terms.length) {
      matchBox.append(el("p", "cv-hint", tx("Paste a job ad to see which of its words your CV already uses.")));
      return;
    }
    const text = cvText();
    const result = match(text, terms, SKILLS, cv.jobAd);
    const found = result.items.filter((item) => item.found);
    const missing = result.items.filter((item) => !item.found);
    const meter = el("div", "ats-meter");
    const bar = el("span");
    bar.style.width = `${Math.round(result.score * 100)}%`;
    meter.append(bar);
    // A share of the ad's words, not a pass mark: no threshold is known that software or recruiters use.
    matchBox.append(
      el("p", "ats-score", tx("{a} of {b} key words from the ad are in your CV ({p}%).", { a: found.length, b: terms.length, p: Math.round(result.score * 100) })),
      meter,
      el("p", "cv-hint", tx("A guide to how many of the ad's skills and terms your CV uses, not a prediction of what application software or a recruiter will decide.")),
    );
    const notes = [];
    if (result.required) notes.push(tx(result.required === 1 ? "{n} word comes from the part of the ad that lists what is required; it weighs double." : "{n} words come from the part of the ad that lists what is required; they weigh double.", { n: result.required }));
    const viaCount = found.filter((item) => item.via).length;
    if (viaCount) notes.push(tx(viaCount === 1 ? "{n} word was found as another word for the same skill (marked ≈); write it as the ad does if that is true for you." : "{n} words were found as other words for the same skill (marked ≈); write them as the ad does if that is true for you.", { n: viaCount }));
    if (notes.length) matchBox.append(el("p", "cv-hint", notes.join(" ")));
    const chips = (title, items, className) => {
      if (!items.length) return;
      matchBox.append(el("p", "ats-chips-title", title));
      const box = el("div", "ats-chips");
      items.forEach((item) => {
        const chip = el("span", `ats-chip ${className}${item.weight > 1 ? " is-required" : ""}`, item.via ? `${item.label} ≈ ${item.via}` : item.label);
        if (item.weight > 1) chip.title = tx("Required by the ad");
        if (item.via) chip.title = [chip.title, tx("Found in your CV as “{word}”", { word: item.via })].filter(Boolean).join(" · ");
        box.append(chip);
      });
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
    const add = button(addLabel, "add", name);
    add.hidden = cv[name].length >= MAX_ITEMS;
    box.append(add);
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
      else if (name.endsWith(".json") || file.type === "application/json") {
        let parsed = null;
        try { parsed = JSON.parse(await file.text()); } catch { throw new Error("json"); }
        const resume = fromJsonResume(parsed);
        if (!resume) throw new Error("json");
        if (!confirmReplace()) { importNote.textContent = ""; return; }
        useImported(resume);
        return;
      } else if (name.endsWith(".txt") || file.type.startsWith("text/")) parsedLines = window.CvImport.textLines(await file.text());
      else throw new Error("type");
      if (!parsedLines.length) throw new Error("empty");
      if (!confirmReplace()) { importNote.textContent = ""; return; }
      useImported(window.CvImport.parse(parsedLines));
    } catch (error) {
      importNote.textContent = error.message === "doc"
        ? tx("Old Word files (.doc) cannot be read here. In Word, choose Save as and pick .docx or PDF.")
        : error.message === "json"
          ? tx("This file is not a JSON Resume (jsonresume.org). Nothing was changed.")
        : error.message === "empty"
          ? tx("This file has no readable text; it is probably a scan or a photo. Use the Word file, or paste the text below.")
          : error.message === "type"
            ? tx("Use a PDF, a Word file (.docx), a text file or a JSON Resume file.")
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
    pdf: () => {
      if (!window.PdfKit) return actions.print();
      const file = pdf(cv, data);
      download(`${fileName()}.pdf`, file.bytes, "application/pdf");
      say(tx(file.pages === 1 ? "PDF saved: one page, laid out the same in every reader and on every printer." : "PDF saved: {n} pages, laid out the same in every reader and on every printer.", { n: file.pages }));
    },
    word: () => {
      download(`${fileName()}.docx`, docx(cv, data), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      say(tx("Word file saved. You can also open it here again later to keep working."));
    },
    text: () => {
      download(`${fileName()}.txt`, plainText(cv, doc()), "text/plain;charset=utf-8");
    },
    jsonResume: () => {
      download(`${fileName()}.json`, `${JSON.stringify(toJsonResume(cv), null, 2)}\n`, "application/json");
      say(tx("JSON Resume file saved: the open CV format that other CV tools read, and this one opens again."));
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
      const print = () => {
        cancelAnimationFrame(frame);
        renderCv();
        const title = document.title;
        document.title = [cv.person.name.trim(), doc().doc].filter(Boolean).join(" – ") || title;
        window.addEventListener("afterprint", () => { document.title = title; }, { once: true });
        window.print();
      };
      // First a short guide to saving the PDF (print-guide.js).
      if (window.PrintGuide) window.PrintGuide.open(print, {});
      else print();
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
