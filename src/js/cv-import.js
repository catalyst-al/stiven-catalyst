// Reads an existing CV (PDF, Word .docx or pasted text) and sorts it into the
// fields of the ATS CV. Everything runs in this browser; the file is never sent.
//
// A PDF has no reading order, only text at positions, so the page is first cut
// into bands and columns (an "XY cut") and read band by band. Word files are
// read from their XML. Both give plain lines, which one parser sorts into
// name, contact, profile, experience, education, skills and languages.
window.CvImport = (() => {
  // ---------- Words that mark sections, in English, German and Albanian ----------
  const fold = (text) => String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ß/g, "ss")
    .replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const SECTIONS = {
    profile: ["profile", "profil", "kurzprofil", "summary", "professional summary", "about me", "uber mich", "profili", "permbledhje", "objective", "zusammenfassung", "personal profile", "career summary", "berufsprofil", "profil personal"],
    highlights: ["key achievements", "achievements", "ausgewahlte erfolge", "erfolge", "arritjet", "highlights", "key facts", "accomplishments"],
    experience: ["experience", "work experience", "professional experience", "employment", "work history", "career history", "berufserfahrung", "berufliche erfahrung", "berufspraxis", "werdegang", "beruflicher werdegang", "praxiserfahrung", "berufliche stationen", "pervoja", "pervoja profesionale", "pervoja e punes", "eksperienca"],
    education: ["education", "ausbildung", "bildung", "bildungsweg", "schulbildung", "studium", "arsimi", "arsim", "edukimi", "certificates", "certifications", "zertifikate", "certifikatat", "certifikata", "weiterbildung", "fortbildung", "qualifications", "qualifikationen", "trainings", "kurse", "trajnime", "kualifikime"],
    skills: ["skills", "kenntnisse", "fahigkeiten", "kompetenzen", "kernkompetenzen", "aftesite", "aftesi", "it skills", "edv kenntnisse", "technical skills", "core skills", "key skills", "competencies", "competences", "fachkenntnisse", "kompetencat"],
    languages: ["languages", "sprachen", "sprachkenntnisse", "gjuhet", "gjuhe", "gjuhet e huaja", "language skills"],
    extra: ["karriereprofil", "karriereweg", "laufbahn", "career path", "rruga profesionale", "side activities", "nebenberufliche", "nebentatigkeit", "ehrenamt", "volunteer", "volunteering", "projects", "projekte", "projektet", "interests", "hobbys", "hobbies", "interessen", "interesa", "aktivitete", "activities", "references", "referenzen", "referenca", "awards", "auszeichnungen", "cmime", "publications", "publikationen", "memberships", "mitgliedschaften", "sonstiges", "other", "te tjera"],
  };
  const sectionOf = (text) => {
    const folded = fold(text);
    if (!folded || folded.length > 60 || folded.split(" ").length > 7) return null;
    for (const [kind, words] of Object.entries(SECTIONS)) {
      const hit = words.some((word) => folded.length <= word.length + 18 && (folded === word || folded.startsWith(`${word} `)
        || folded.endsWith(` ${word}`) || folded.includes(` ${word} `) || (word.length >= 7 && folded.includes(word))));
      if (hit) return kind;
    }
    return null;
  };

  // ---------- Dates ----------
  const MON = "(?:jan|feb|m[aä]r|apr|ma[iy]|jun|jul|aug|sep|o[ck]t|nov|de[cz]|shk|pri|qer|korr?|gush|sht|tet|n[eë]n|dhj)\\p{L}*\\.?";
  const D = `(?:\\d{1,2}[./]\\d{4}|\\d{1,2}[./]\\d{2}(?![\\d.])|${MON}\\s+\\d{4}|(?:19|20)\\d{2})`;
  const NOW = "heute|present|today|now|current(?:ly)?|aktuell|laufend|dato|sot|n[eë] vazhdim|ongoing|jetzt|bis heute";
  const RANGE = new RegExp(`(${D})\\s*(?:[-–—]|\\bbis\\b|\\bto\\b|\\buntil\\b|\\bderi(?: n[eë])?\\b)\\s*(${D}|${NOW})`, "iu");
  const SINCE = new RegExp(`(?:\\bseit\\b|\\bsince\\b|\\bab\\b|q[eë] nga|\\bnga\\b)\\s+(${D})`, "iu");
  const YEAR = /\b(?:19|20)\d{2}\b/;
  const isNow = (text) => new RegExp(`^(?:${NOW})$`, "iu").test(text.trim());
  const findDates = (text) => {
    let match = text.match(RANGE);
    if (match) return { from: match[1], to: isNow(match[2]) ? "" : match[2], index: match.index, length: match[0].length };
    match = text.match(SINCE);
    if (match) return { from: match[1], to: "", index: match.index, length: match[0].length };
    return null;
  };
  // A date that marks an entry stands at the start or the end of its line
  // ("Night Manager  07/2023 – 09/2026"), not inside a sentence ("… seit 2012, mit …").
  const entryDates = (text) => {
    const dates = findDates(text);
    if (!dates) return null;
    const before = text.slice(0, dates.index);
    const after = text.slice(dates.index + dates.length);
    return /^[\s.,;:)|–-]*$/.test(after) || /^[\s(|•–-]*$/.test(before) || /[|]\s*$|\s{2,}$/.test(before) ? dates : null;
  };
  const entryYear = (text) => {
    const match = text.match(YEAR);
    if (!match) return false;
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match[0].length);
    return /^[\s.,;:)|–-]*$/.test(after) || /^[\s(|•–-]*$/.test(before) || /[|,]\s*$|\s{2,}$/.test(before);
  };
  const withoutDates = (text, dates) => (text.slice(0, dates.index) + " " + text.slice(dates.index + dates.length)).replace(/\s*[|•·,–-]\s*$/, "").replace(/^\s*[|•·,–-]\s*/, "").replace(/\s{2,}/g, " ").replace(/\s*\|\s*\|\s*/g, " | ").trim();

  // ---------- Contact details ----------
  const EMAIL = /[^\s|,;:<>()]+@[^\s|,;:<>()]+\.[a-z]{2,}/i;
  const PHONE = /(?:\+|00)?\d[\d\s/().-]{6,}\d/;
  const URL = /(?:https?:\/\/|www\.)[^\s|,;]+|(?:linkedin|xing|github)\.[a-z]{2,}\/[^\s|,;]*/i;
  const LICENCE = /licen[cs]e|f[üu]hrerschein|patent[eë]|driving|pkw|klasse\s+b\b/i;

  // ---------- Bullets and joining lines ----------
  const BULLET = /^\s*(?:[•●▪■◦○‣∙·*►➢➤✓✔-]|–(?=\s)|•|[])\s*/u;
  const stripBullet = (text) => text.replace(BULLET, "").trim();
  const ENDS_SENTENCE = /[.!?…]["”)]?$/;
  const ARROW = /[→➔➜⇒»]/;
  const ARROW_END = /[→➔➜⇒»]\s*$/;
  // Join a wrapped line to the one before it: "Fehler zu" + "reduzieren." A word
  // broken at a hyphen keeps it ("No-" + "Show" gives "No-Show"); a soft hyphen goes.
  const join = (a, b) => (/\u00ad$/.test(a) ? a.slice(0, -1) + b : /-$/.test(a) ? a + b : `${a} ${b}`);

  // ---------- Lines from a PDF ----------
  // items: [{ str, x, base, w, h }] with base = baseline measured from the top.
  const box = (item) => ({ top: item.base - item.h * 0.85, bottom: item.base + item.h * 0.2, left: item.x, right: item.x + item.w });

  // Bands of text one below the other. Only the widest gaps cut at this step;
  // the narrower ones are cut later, inside each band, after columns had a chance.
  const splitRows = (items) => {
    const sorted = [...items].sort((a, b) => a.base - b.base || a.x - b.x);
    const bands = [[sorted[0]]];
    const gaps = [];
    let bottom = box(sorted[0]).bottom;
    let height = sorted[0].h;
    for (const item of sorted.slice(1)) {
      const b = box(item);
      if (b.top - bottom > Math.max(3, 0.5 * Math.min(height, item.h))) {
        gaps.push(b.top - bottom);
        bands.push([item]);
        height = item.h;
      } else {
        bands[bands.length - 1].push(item);
        height = Math.max(height, item.h);
      }
      bottom = Math.max(bottom, b.bottom);
    }
    const widest = Math.max(0, ...gaps);
    const rows = [bands[0]];
    gaps.forEach((gap, i) => {
      if (gap >= widest * 0.6) rows.push(bands[i + 1]);
      else rows[rows.length - 1].push(...bands[i + 1]);
    });
    rows.gap = widest;
    return rows;
  };

  const DATE_ONLY = new RegExp(`^\\s*(?:${RANGE.source}|${SINCE.source}|${D})\\s*$`, "iu");
  const splitColumns = (items) => {
    const sorted = [...items].sort((a, b) => a.x - b.x);
    const cols = [[sorted[0]]];
    const gaps = [];
    let right = box(sorted[0]).right;
    for (const item of sorted.slice(1)) {
      if (item.x - right > Math.max(10, item.h * 1.2)) {
        gaps.push(item.x - right);
        cols.push([item]);
      } else cols[cols.length - 1].push(item);
      right = Math.max(right, box(item).right);
    }
    // A column holding only dates (the dates of jobs, set to the right) stays
    // with the text beside it.
    for (let i = cols.length - 1; i > 0; i--) {
      if (leafLines(cols[i]).every((line) => DATE_ONLY.test(line.text) || line.text.length <= 3)) {
        cols[i - 1].push(...cols[i]);
        cols.splice(i, 1);
        gaps.splice(i - 1, 1);
      }
    }
    cols.gap = Math.max(0, ...gaps);
    return cols;
  };

  const leafLines = (items) => {
    const sorted = [...items].sort((a, b) => a.base - b.base || a.x - b.x);
    const lines = [];
    for (const item of sorted) {
      const last = lines[lines.length - 1];
      if (last && Math.abs(item.base - last.base) < 0.5 * Math.min(item.h, last.h)) last.items.push(item);
      else lines.push({ base: item.base, h: item.h, items: [item] });
    }
    return lines.map((line, index) => {
      const parts = line.items.sort((a, b) => a.x - b.x);
      let text = "";
      let end = null;
      for (const part of parts) {
        const gap = end === null ? 0 : part.x - end;
        if (end !== null && gap > part.h * 0.15 && !/\s$/.test(text) && !/^\s/.test(part.str)) text += gap > part.h * 2.5 ? "  " : " ";
        text += part.str;
        end = part.x + part.w;
      }
      return {
        text: text.replace(/[ \t]+/g, (space) => (space.length > 1 ? "  " : " ")).trim(),
        size: Math.max(...parts.map((part) => part.h)),
        x: parts[0].x,
        right: end,
        top: line.base - line.h,
        leafStart: index === 0,
      };
    });
  };

  // Cut the page into bands and columns until nothing splits further.
  const pageLines = (items) => {
    const words = items.filter((item) => item.str && item.str.trim() && item.h > 0);
    if (!words.length) return [];
    const out = [];
    // At each step the widest gap wins: cards side by side are read one card
    // at a time, sections one below the other.
    const walk = (group, depth) => {
      if (depth < 40) {
        const rows = splitRows(group);
        const cols = splitColumns(group);
        // A clear break between sections always cuts first.
        const line = median(group.map((item) => item.h));
        const split = rows.length > 1 && (cols.length < 2 || rows.gap >= cols.gap || rows.gap >= line * 1.5) ? rows : cols.length > 1 ? cols : null;
        if (split) return split.forEach((part) => walk(part, depth + 1));
      }
      const lines = leafLines(group);
      // Initials standing alone are the letters of a logo, not text.
      if (!(lines.length === 1 && /^\p{Lu}{1,3}$/u.test(lines[0].text))) out.push(...lines);
    };
    walk(words, 0);
    return out;
  };

  // Lines of every page, without running headers, footers and page numbers.
  const pdfLines = (pages) => {
    const pageNumber = /^(?:seite|page|faqja|pagina|s\.)?\s*\d+\s*(?:von|of|nga|\/|di)\s*\d+$/i;
    const perPage = pages.map((page) => ({ height: page.height, lines: pageLines(page.items) }));
    const key = (text) => text.replace(/\d+/g, "#");
    const seen = new Map();
    perPage.forEach(({ lines, height }) => lines.forEach((line) => {
      if (line.top < 70 || line.top > height - 70) seen.set(key(line.text), (seen.get(key(line.text)) || 0) + 1);
    }));
    const repeated = (line, height) => (line.top < 70 || line.top > height - 70) && perPage.length > 1 && seen.get(key(line.text)) >= perPage.length;
    // A sentence that runs on in the same column, close below, stays one paragraph
    // even when the cut put its lines in separate pieces.
    perPage.forEach(({ lines }) => lines.forEach((line, i) => {
      const prev = lines[i - 1];
      if (line.leafStart && prev && Math.abs(line.x - prev.x) < 2 && Math.abs(line.size - prev.size) < 0.3
        && line.top > prev.top && line.top - prev.top < prev.size * 1.9 && !ENDS_SENTENCE.test(prev.text)) line.leafStart = false;
    }));
    return perPage.flatMap(({ lines, height }) => lines
      .map((line) => ({ ...line, text: line.text.replace(/\s*(?:seite|page|faqja)\s+\d+\s*(?:von|of|nga)\s*\d+\s*$/i, "").trim() }))
      .filter((line) => line.text && !pageNumber.test(line.text) && !repeated(line, height)));
  };

  // ---------- Lines from a Word file ----------
  // A .docx file is a zip; word/document.xml holds the text.
  const unzip = async (buffer, wanted) => {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let end = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i--) {
      if (view.getUint32(i, true) === 0x06054b50) { end = i; break; }
    }
    if (end < 0) throw new Error("zip");
    let at = view.getUint32(end + 16, true);
    const count = view.getUint16(end + 10, true);
    for (let n = 0; n < count; n++) {
      if (view.getUint32(at, true) !== 0x02014b50) break;
      const method = view.getUint16(at + 10, true);
      const size = view.getUint32(at + 20, true);
      const nameLength = view.getUint16(at + 28, true);
      const extra = view.getUint16(at + 30, true);
      const comment = view.getUint16(at + 32, true);
      const local = view.getUint32(at + 42, true);
      const name = new TextDecoder().decode(bytes.subarray(at + 46, at + 46 + nameLength));
      if (name === wanted) {
        const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
        const data = bytes.subarray(start, start + size);
        if (method === 0) return new TextDecoder().decode(data);
        if (method !== 8) throw new Error("zip");
        const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Response(stream).text();
      }
      at += 46 + nameLength + extra + comment;
    }
    throw new Error("docx");
  };

  const decode = (text) => text.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(Number(dec))).replace(/&amp;/g, "&");

  // Paragraphs of document.xml, with their bullet, heading and size. Text boxes
  // hold paragraphs inside paragraphs, so a stack keeps them apart.
  const docxLines = (xml) => {
    const body = xml.replace(/<mc:Fallback>[\s\S]*?<\/mc:Fallback>/g, "").replace(/<w:instrText[\s\S]*?<\/w:instrText>/g, "");
    const out = [];
    const stack = [];
    let inText = false;
    let bold = false;
    const token = /<(\/?)w:(p|t|tab|br|cr|numPr|pStyle|b|sz|rPr|r|tc)\b([^>]*?)(\/?)>|([^<]+)/g;
    let m;
    while ((m = token.exec(body))) {
      const [, close, tag, attrs, selfClose, text] = m;
      const para = stack[stack.length - 1];
      if (text !== undefined) {
        if (inText && para) para.text += decode(text);
        continue;
      }
      if (tag === "p") {
        if (close) {
          const done = stack.pop();
          if (done) out.push(done);
        } else if (!selfClose) stack.push({ text: "", bullet: false, heading: "", size: 0, boldChars: 0 });
      } else if (tag === "t") {
        inText = !close && !selfClose;
      } else if (!para) {
        continue;
      } else if ((tag === "tab" || tag === "br" || tag === "cr") && !close) {
        para.text += tag === "tab" ? "  " : "\n";
      } else if (tag === "numPr" && !close) {
        para.bullet = true;
      } else if (tag === "pStyle") {
        para.heading = (attrs.match(/w:val="([^"]*)"/) || [])[1] || "";
      } else if (tag === "b" && !close) {
        bold = !/w:val="(?:0|false)"/.test(attrs);
      } else if (tag === "r" && !close) {
        bold = false;
      } else if (tag === "sz" && !close) {
        para.size = Math.max(para.size, Number((attrs.match(/w:val="(\d+)"/) || [])[1] || 0) / 2);
      } else if (tag === "t" || tag === "r") {
        // handled above
      }
      if (tag === "t" && close && para && bold) para.boldChars += 1;
    }
    return out.flatMap((para) => para.text.split("\n").map((text, i) => ({
      text: text.replace(/\s+$/, ""),
      bullet: para.bullet && i === 0,
      bold: para.boldChars > 0,
      size: para.size || null,
      style: /^(?:title|titel)/i.test(para.heading) ? "title" : /heading|berschrift|titull/i.test(para.heading) ? "heading" : "",
      leafStart: i === 0,
    }))).filter((line) => line.text.trim());
  };

  // ---------- Lines from pasted text ----------
  const textLines = (text) => {
    let leafStart = true;
    const out = [];
    String(text ?? "").slice(0, 300000).replace(/\r/g, "").split("\n").forEach((raw) => {
      if (!raw.trim()) { leafStart = true; return; }
      out.push({ text: raw.trim(), leafStart });
      leafStart = false;
    });
    return out;
  };

  // ---------- Sorting the lines into a CV ----------
  const clean = (text) => text.replace(/\s{2,}/g, "  ").trim();
  const words = (text) => text.trim().split(/\s+/).filter(Boolean).length;
  const upperRatio = (text) => {
    const letters = text.replace(/[^\p{L}]/gu, "");
    return letters ? letters.replace(/[^\p{Lu}]/gu, "").length / letters.length : 0;
  };
  const median = (values) => {
    const sorted = values.filter((value) => value > 0).sort((a, b) => a - b);
    return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  };

  // Title case for headings typed in capitals: "BERUFSERFAHRUNG" gives "Berufserfahrung".
  const tidyTitle = (text) => (upperRatio(text) > 0.8 ? text.toLowerCase().replace(/(^|[\s&/(–-])(\p{L})/gu, (m, sep, ch) => sep + ch.toUpperCase()) : text);

  // "SPRACHEN Deutsch – B1" or "Skills: Excel, SAP" carry their heading in front.
  const inlineHeading = (text) => {
    const colon = text.match(/^([\p{L}&/ ]{3,40}?)\s*:\s+(.+)$/u);
    if (colon && sectionOf(colon[1])) return [colon[1], colon[2]];
    const caps = text.match(/^((?:[\p{Lu}&]{2,}\s?){1,3})\s+(?=\S)(.+)$/u);
    if (caps && sectionOf(caps[1]) && upperRatio(caps[2]) < 0.6) return [caps[1].trim(), caps[2]];
    return null;
  };

  const guessLanguage = (text) => {
    const count = (list) => list.reduce((sum, word) => sum + (text.match(new RegExp(`\\b${word}\\b`, "gi")) || []).length, 0);
    const scores = {
      de: count(["und", "der", "die", "mit", "für", "von", "zur", "bei", "des"]),
      sq: count(["dhe", "në", "për", "të", "me", "nga", "një", "është"]),
      en: count(["and", "the", "with", "for", "of", "to", "in", "at"]),
    };
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  };

  // Split "Company | City" into its parts.
  const companyParts = (text) => {
    const parts = text.split(/\s*[|•·]\s*|\s{2,}|\t/).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) return { company: parts[0], location: parts.slice(1).join(" | ") };
    const comma = text.match(/^(.+),\s*(\p{Lu}[\p{L}.-]*(?:\s+\p{Lu}[\p{L}.-]*){0,2})$/u);
    if (comma) return { company: comma[1].trim(), location: comma[2] };
    return { company: text.trim(), location: "" };
  };

  // "Shift Lead, DHL, Frankfurt", "Shift Lead | DHL | Frankfurt", "Shift Lead – DHL – Frankfurt" or
  // "Shift Lead at DHL, Frankfurt": title, company and place; null when the line has only a title.
  const headingParts = (text) => {
    const parts = text.split(/\s*\|\s*|\s+[–—]\s+/).map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) return { title: parts[0], company: parts[1], location: parts.slice(2).join(" | ") };
    const inline = text.match(/^(.+?)(?:,\s+|\s+(?:at|@|bei|tek|pranë)\s+)(.+)$/iu);
    return inline ? { title: inline[1].trim(), ...companyParts(inline[2]) } : null;
  };

  // Bullet points from wrapped lines: a line continues the one before unless
  // it starts with a bullet, the one before ended a sentence, or was short.
  const bulletsFrom = (lines) => {
    const out = [];
    const width = Math.max(0, ...lines.map((line) => (line.right && line.x !== undefined ? line.right - line.x : 0)));
    lines.forEach((line, index) => {
      const text = stripBullet(line.text);
      if (!text) return;
      const prev = lines[index - 1];
      const explicit = line.bullet || BULLET.test(line.text);
      const prevFull = prev && prev.right && width ? (prev.right - prev.x) > width * 0.7 : !prev?.bullet;
      // "Guest Service → Night Audit →" + "Senior Night Audit" is one career path.
      const last = out[out.length - 1] || "";
      const chain = ARROW.test(last) && (ARROW.test(text) || ARROW_END.test(last));
      const continues = out.length && prev && !explicit && !ENDS_SENTENCE.test(last)
        && (chain || (!line.leafStart && !ARROW.test(last) && (/^[\p{Ll}(0-9%]/u.test(text) || prevFull)));
      if (continues) out[out.length - 1] = join(out[out.length - 1], text);
      else out.push(text);
    });
    return out;
  };

  const paragraphs = (lines) => {
    const out = [];
    lines.forEach((line, index) => {
      const text = stripBullet(line.text);
      const last = out[out.length - 1] || "";
      const chain = ARROW.test(last) && (ARROW.test(text) || ARROW_END.test(last));
      if (out.length && (chain || (!line.leafStart && !ARROW.test(last))) && !(line.bullet && index)) out[out.length - 1] = join(out[out.length - 1], text);
      else out.push(text);
    });
    return out;
  };

  const experienceFrom = (lines) => {
    const entries = [];
    const anchors = lines.map((line, i) => (entryDates(line.text) ? i : -1)).filter((i) => i >= 0);
    const indented = (line, ref) => line.bullet || BULLET.test(line.text) || (line.x !== undefined && ref.x !== undefined && line.x > ref.x + 3);
    const titleLike = (line, ref) => line && !indented(line, ref) && !entryDates(line.text) && line.text.length <= 100 && !ENDS_SENTENCE.test(line.text);
    const starts = [];
    anchors.forEach((a, k) => {
      const floor = k ? anchors[k - 1] + 1 : 0;
      const before = lines[a - 1];
      const rest = withoutDates(lines[a].text, entryDates(lines[a].text));
      // The title stands on the line above when the date line reads like "Company | 2019 – 2020".
      const titleAbove = a - 1 >= floor && titleLike(before, lines[a]) && (!rest || (before.size || 0) >= (lines[a].size || 0)) && !(k && starts[k - 1].companyAt === a - 1);
      const start = { anchor: a, begin: titleAbove ? a - 1 : a, companyAt: -1 };
      if (!titleAbove) {
        const next = lines[a + 1];
        if (next && titleLike(next, lines[a]) && (anchors[k + 1] ?? Infinity) > a + 1) start.companyAt = a + 1;
      }
      starts.push(start);
    });
    starts.forEach((start, k) => {
      const line = lines[start.anchor];
      const dates = entryDates(line.text);
      const rest = withoutDates(line.text, dates);
      const entry = { title: "", company: "", location: "", from: dates.from, to: dates.to, bullets: "" };
      if (start.begin < start.anchor) {
        entry.title = clean(lines[start.begin].text);
        Object.assign(entry, companyParts(rest));
        // The dates stand alone and the line above holds it all: "Shift Lead, DHL, Frankfurt".
        if (!rest) Object.assign(entry, headingParts(entry.title) || {});
      } else {
        entry.title = rest.replace(/\s{2,}.*$/, "").trim() || rest;
        // "Team Leader, Zalando – Milan" or "Team Leader at Zalando" on one line.
        const inline = entry.title.match(/^(.+?)(?:,\s+|\s+(?:at|@|bei|tek|pranë)\s+)(.+)$/iu);
        if (start.companyAt >= 0) Object.assign(entry, companyParts(lines[start.companyAt].text));
        else if (inline) {
          entry.title = inline[1].trim();
          const [company, ...place] = inline[2].split(/\s+[–—-]\s+|\s*\|\s*/);
          Object.assign(entry, { company: company.trim(), location: place.join(" | ").trim() });
        } else if (entries.length) {
          entry.company = entries[entries.length - 1].company;
          entry.location = entries[entries.length - 1].location;
        }
      }
      const from = Math.max(start.anchor, start.companyAt) + 1;
      const to = k + 1 < starts.length ? starts[k + 1].begin : lines.length;
      entry.bullets = bulletsFrom(lines.slice(from, to)).join("\n");
      entries.push(entry);
    });
    return entries;
  };

  const educationFrom = (lines) => {
    const anchors = lines.map((line, i) => (entryDates(line.text) || entryYear(line.text) ? i : -1)).filter((i) => i >= 0);
    if (!anchors.length) {
      return paragraphs(lines).map((text) => ({ title: text, school: "", date: "", detail: "" }));
    }
    // "Degree      2012 – 2015" keeps its title on the date line; the school follows.
    const sameLine = (i) => {
      const text = lines[i].text;
      const dates = findDates(text);
      const at = dates ? dates.index : text.search(YEAR);
      return at > 0 && /\S\s{2,}$/.test(text.slice(0, at));
    };
    const starts = anchors.map((a, k) => {
      const floor = k ? anchors[k - 1] + 1 : 0;
      let begin = a;
      if (!sameLine(a) && a - 1 >= floor && !YEAR.test(lines[a - 1].text) && lines[a - 1].text.length <= 110 && !ENDS_SENTENCE.test(lines[a - 1].text)) {
        begin = a - 1;
        // A title wrapped over two lines has the same, larger size on both.
        const size = lines[begin].size || 0;
        while (begin - 1 >= floor && size > (lines[a].size || 0) + 0.3 && !lines[begin].leafStart
          && Math.abs((lines[begin - 1].size || 0) - size) < 0.3) begin -= 1;
      }
      const next = lines[a + 1];
      const school = sameLine(a) && next && !YEAR.test(next.text) && !findDates(next.text) && next.text.length <= 100 && (anchors[k + 1] ?? Infinity) > a + 1 ? a + 1 : -1;
      return { anchor: a, begin, school };
    });
    return starts.map((start, k) => {
      const line = lines[start.anchor].text;
      const dates = findDates(line);
      const year = dates ? null : line.match(new RegExp(`(?:${MON}\\s+)?(?:19|20)\\d{2}`, "iu"));
      const found = dates ? line.substr(dates.index, dates.length) : year[0];
      const rest = clean(line.replace(found, " ").replace(/\s*[|•·,–-]\s*$/, "").replace(/^\s*[|•·,–-]\s*/, "").replace(/\s*\|\s*\|\s*/g, " | "));
      const item = { title: "", school: "", date: found.trim(), detail: "" };
      if (start.begin < start.anchor) {
        item.title = lines.slice(start.begin, start.anchor).map((l) => l.text).reduce(join);
        item.school = rest;
      } else {
        item.title = rest;
        if (start.school >= 0) item.school = clean(lines[start.school].text);
        // "Laurea in Economics, University of Bologna" on one line.
        const school = !item.school && rest.match(/^(.+?),\s*(.*\b(?:univ|schule|school|college|institut|academ|akadem|hochschul|fakult|gymnas|lice|shkoll|kolegj)\p{L}*.*)$/iu);
        if (school) Object.assign(item, { title: school[1].trim(), school: school[2].trim() });
      }
      const end = k + 1 < starts.length ? starts[k + 1].begin : lines.length;
      item.detail = paragraphs(lines.slice(Math.max(start.anchor, start.school) + 1, end)).join(" · ");
      return item;
    });
  };

  const skillsFrom = (lines) => {
    const groups = [];
    lines.forEach((line) => {
      const text = stripBullet(line.text);
      const colon = text.match(/^([^:]{2,40}):\s*(.+)$/);
      const isTitle = upperRatio(text) > 0.8 && words(text) <= 5 && !/,$/.test(text);
      if (colon) groups.push({ title: colon[1].trim(), text: colon[2].trim() });
      else if (isTitle) {
        const last = groups[groups.length - 1];
        if (last && !last.text && !line.leafStart) last.title = `${last.title} ${text}`;
        else groups.push({ title: text, text: "" });
      } else if (groups.length && (!groups[groups.length - 1].text || !line.leafStart || !groups[groups.length - 1].title)) {
        const last = groups[groups.length - 1];
        last.text = last.text ? join(last.text.replace(/,$/, ","), text) : text;
      } else groups.push({ title: "", text });
    });
    return groups.map((group) => ({
      title: tidyTitle(group.title),
      text: group.text.replace(/\s*,\s*/g, ", ").replace(/,\s*$/, ""),
    }));
  };

  const languagesFrom = (lines) => lines.map((line) => stripBullet(line.text)).join(" | ")
    .split(/\s*[|•·;]\s*|\s*,\s*(?=\p{Lu})/u)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const split = part.split(/\s+[–—-]\s+|\s*:\s*/);
      if (split.length > 1) return { name: split[0].trim(), level: split.slice(1).join(" – ").trim() };
      const paren = part.match(/^(.+?)\s*\((.+)\)$/);
      if (paren) return { name: paren[1].trim(), level: paren[2].trim() };
      // "German B2" or "Englisch C1 (fließend)": a CEFR level after the name.
      const cefr = part.match(/^(.+?)\s+([ABC][12](?:\s*\(.+\))?|[ABC][12]\+?)$/u);
      if (cefr) return { name: cefr[1].trim(), level: cefr[2].trim() };
      return { name: part, level: "" };
    });


  // A CV has a few hundred lines; anything far beyond that is not a CV and is cut,
  // so a huge file cannot freeze the page.
  const MAX_LINES = 3000;
  const parse = (input) => {
    const lines = input.slice(0, MAX_LINES).map((line) => ({ ...line, text: line.text.replace(/ /g, " ").replace(/[​﻿]/g, "").trim() })).filter((line) => line.text);
    const body = median(lines.map((line) => line.size || 0));
    const cv = {
      person: { name: "", headline: "", location: "", phone: "", email: "", website: "", extra: "" },
      summary: "", highlights: "", experience: [], education: [], skills: [], languages: [], extras: [],
      docLang: guessLanguage(lines.map((line) => line.text).join(" ")),
    };

    // Sections, in reading order.
    const heading = (line) => {
      if (line.bullet || BULLET.test(line.text) || /^[\d+]/.test(line.text) || /[|@]/.test(line.text)) return null;
      if (line.style === "heading" || line.style === "title") return sectionOf(line.text) || (line.style === "heading" ? "other" : null);
      const kind = sectionOf(line.text);
      if (kind && (words(line.text) <= 5 || upperRatio(line.text) > 0.8)) return kind;
      const big = body && line.size && line.size >= body * 1.18;
      const loud = upperRatio(line.text) > 0.85 || (line.bold && !body);
      if ((big || (!body && loud)) && loud && words(line.text) <= 6 && !/\d{3}/.test(line.text) && !EMAIL.test(line.text) && line.text.length <= 60) return "other";
      return null;
    };
    // Key figures ("10+" over "Years in leadership") come in pairs; the label is never a heading.
    const FIGURE = /^[\d.,+%/ ]{1,9}$/;
    lines.forEach((line, index) => {
      const next = lines[index + 1];
      if (FIGURE.test(line.text) && next && !FIGURE.test(next.text) && words(next.text) <= 6) {
        line.figure = true;
        next.figureLabel = true;
      }
    });
    const header = [];
    const sections = [];
    lines.forEach((line, index) => {
      const inline = line.figureLabel ? null : inlineHeading(line.text);
      const kind = line.figureLabel ? null : inline ? sectionOf(inline[0]) : heading(line);
      if (kind && index > 0) {
        sections.push({ kind, title: inline ? inline[0] : line.text, lines: inline ? [{ ...line, text: inline[1], leafStart: true }] : [] });
      } else if (sections.length) sections[sections.length - 1].lines.push(line);
      else header.push(line);
    });

    // Header: name, headline, contact, key figures.
    const biggest = Math.max(0, ...header.map((line) => line.size || 0));
    const nameLine = header.find((line) => line.style === "title")
      || (biggest > body * 1.3 ? header.find((line) => line.size === biggest) : null)
      || header.find((line) => words(line.text) >= 2 && words(line.text) <= 5 && !/\d|@/.test(line.text));
    if (nameLine) cv.person.name = tidyTitle(nameLine.text.replace(/\s{2,}/g, " "));
    const leftovers = [];
    const figures = [];
    header.filter((line) => line !== nameLine).forEach((line, index, rest) => {
      const text = line.text;
      if (line.figure) return;
      if (line.figureLabel) {
        figures.push(`${rest[index - 1]?.figure ? `${rest[index - 1].text} ` : ""}${text}`);
        return;
      }
      const tokens = text.split(/\s*[|•·▪]\s*|\s{2,}|\t/).map((token) => token.trim()).filter(Boolean);
      const contactish = tokens.some((token) => EMAIL.test(token) || (PHONE.test(token) && token.replace(/\D/g, "").length >= 7) || URL.test(token));
      if (contactish) {
        tokens.forEach((token) => {
          if (EMAIL.test(token) && !cv.person.email) cv.person.email = token.match(EMAIL)[0];
          else if (PHONE.test(token) && token.replace(/\D/g, "").length >= 7 && !cv.person.phone && !/@/.test(token)) cv.person.phone = token.replace(/^(?:tel(?:efon)?|phone|mobil|mob|cel)\.?:?\s*/i, "");
          else if (URL.test(token) && !cv.person.website) cv.person.website = token.match(URL)[0];
          else if (LICENCE.test(token)) cv.person.extra = [cv.person.extra, token].filter(Boolean).join(" | ");
          else if (!cv.person.location && words(token) <= 5 && !/\d{5,}/.test(token)) cv.person.location = token;
          else cv.person.extra = [cv.person.extra, token].filter(Boolean).join(" | ");
        });
      } else if (!cv.person.headline && text.length <= 120 && !ENDS_SENTENCE.test(text)) {
        cv.person.headline = tidyTitle(text).replace(/\s*\|\s*/g, " | ");
      } else leftovers.push(line);
    });
    if (leftovers.length) cv.summary = paragraphs(leftovers).join("\n\n");
    cv.highlights = figures.join("\n");

    // Sections.
    sections.forEach((section) => {
      const title = tidyTitle(section.title.replace(/[:：]\s*$/, ""));
      const kind = section.kind === "other" && section.lines.some((line) => entryDates(line.text)) ? "experience" : section.kind;
      const content = section.lines;
      if (!content.length) return;
      if (kind === "profile") cv.summary = [cv.summary, ...paragraphs(content)].filter(Boolean).join("\n\n");
      else if (kind === "highlights") cv.highlights = [cv.highlights, ...bulletsFrom(content)].filter(Boolean).join("\n");
      else if (kind === "experience") {
        const found = experienceFrom(content);
        if (found.length) cv.experience.push(...found);
        else cv.extras.push({ title, text: bulletsFrom(content).join("\n") });
      } else if (kind === "education") cv.education.push(...educationFrom(content));
      else if (kind === "skills") cv.skills.push(...skillsFrom(content));
      else if (kind === "languages") cv.languages.push(...languagesFrom(content));
      else if (content.some((line) => entryDates(line.text))) {
        // Dated items (projects, volunteering): one line with title, place and dates, then the text.
        const text = educationFrom(content).map((item) => [[item.title, item.school, item.date].filter(Boolean).join(" | "), item.detail].filter(Boolean).join("\n")).join("\n");
        cv.extras.push({ title, text });
      } else cv.extras.push({ title, text: bulletsFrom(content).join("\n") });
    });
    return cv;
  };

  // ---------- Reading files ----------
  const readPdf = async (file, pdfjsUrl, workerUrl) => {
    const pdfjs = await import(pdfjsUrl);
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
    const pages = [];
    try {
    for (let n = 1; n <= Math.min(doc.numPages, 10); n++) {
      const page = await doc.getPage(n);
      const { height } = page.getViewport({ scale: 1 });
      const content = await page.getTextContent();
      pages.push({
        height,
        items: content.items.filter((item) => "str" in item).map((item) => ({
          str: item.str,
          x: item.transform[4],
          base: height - item.transform[5],
          w: item.width,
          h: item.height || Math.hypot(item.transform[2], item.transform[3]),
        })),
      });
    }
    } finally {
      // The parsed document is released; otherwise every import keeps one alive in the worker.
      await doc.destroy().catch(() => {});
    }
    return pdfLines(pages);
  };
  const readDocx = async (file) => docxLines(await unzip(await file.arrayBuffer(), "word/document.xml"));

  return { parse, pdfLines, pageLines, docxLines, textLines, unzip, readPdf, readDocx, sectionOf, findDates, companyParts };
})();
