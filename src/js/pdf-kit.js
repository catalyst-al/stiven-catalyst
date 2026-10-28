// A small PDF writer shared by the career tools. A PDF is a list of numbered objects and a table of where each one
// starts; this writes pages, text in the fourteen standard fonts (Helvetica, Times and Courier, which every PDF reader
// has, so nothing is embedded and the file stays a few kilobytes) and lines, and lays text out in a column that runs
// over as many pages as it needs. The page is the same in every browser and on every printer, which the browser's own
// print window cannot promise. No library is needed and nothing leaves the browser.
//
// Text is written in WinAnsi (Windows-1252): English, German, Albanian, French, Italian, Spanish and the Nordic
// languages fit, with the euro sign, bullets, dashes and curly quotes. A letter outside it loses its accent when it
// has one (ő → o), takes a stand-in when it has one (Ł → L, → becomes ->, a narrow space a space) and is otherwise
// written as "?".
window.PdfKit = (() => {
  // ---- Fonts: advance widths per 1000 units of the standard fonts, for the characters 32 to 126 ----
  const W = {
    Helvetica: [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584],
    "Helvetica-Bold": [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584],
    "Times-Roman": [250, 333, 408, 500, 500, 833, 778, 180, 333, 333, 500, 564, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 278, 278, 564, 564, 564, 444, 921, 722, 667, 667, 722, 611, 556, 722, 722, 333, 389, 722, 611, 889, 722, 722, 556, 722, 667, 556, 611, 722, 722, 944, 722, 722, 611, 333, 278, 333, 469, 500, 333, 444, 500, 444, 500, 444, 333, 500, 500, 278, 278, 500, 278, 778, 500, 500, 500, 500, 333, 389, 278, 500, 500, 722, 500, 500, 444, 480, 200, 480, 541],
    "Times-Bold": [250, 333, 555, 500, 500, 1000, 833, 278, 333, 333, 500, 570, 250, 333, 250, 278, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570, 570, 500, 930, 722, 667, 722, 722, 667, 611, 778, 778, 389, 500, 778, 667, 944, 722, 778, 611, 778, 722, 556, 667, 722, 722, 1000, 722, 722, 667, 333, 278, 333, 581, 500, 333, 500, 556, 444, 556, 444, 333, 500, 556, 278, 333, 556, 278, 833, 556, 500, 556, 556, 444, 389, 333, 556, 500, 722, 500, 500, 444, 394, 220, 394, 520],
  };
  // The characters above 127 that WinAnsi has, by code, and their widths in the four proportional fonts.
  const HIGH = {
    "€": [0x80, 556, 556, 500, 500], "‚": [0x82, 222, 278, 333, 333], "ƒ": [0x83, 556, 556, 500, 500], "„": [0x84, 333, 500, 444, 500],
    "…": [0x85, 1000, 1000, 1000, 1000], "†": [0x86, 556, 556, 500, 500], "‡": [0x87, 556, 556, 500, 500], "ˆ": [0x88, 333, 333, 333, 333],
    "‰": [0x89, 1000, 1000, 1000, 1000], "Š": [0x8a, 667, 667, 556, 556], "‹": [0x8b, 333, 333, 333, 333], "Œ": [0x8c, 1000, 1000, 889, 1000],
    "Ž": [0x8e, 611, 611, 611, 667], "‘": [0x91, 222, 278, 333, 333], "’": [0x92, 222, 278, 333, 333], "“": [0x93, 333, 500, 444, 500],
    "”": [0x94, 333, 500, 444, 500], "•": [0x95, 350, 350, 350, 350], "–": [0x96, 556, 556, 500, 500], "—": [0x97, 1000, 1000, 1000, 1000],
    "˜": [0x98, 333, 333, 333, 333], "™": [0x99, 1000, 1000, 980, 1000], "š": [0x9a, 500, 556, 389, 389], "›": [0x9b, 333, 333, 333, 333],
    "œ": [0x9c, 944, 944, 722, 722], "ž": [0x9e, 500, 500, 444, 444], "Ÿ": [0x9f, 667, 667, 722, 722],
    "¡": [0xa1, 333, 333, 333, 333], "¢": [0xa2, 556, 556, 500, 500], "£": [0xa3, 556, 556, 500, 500], "¤": [0xa4, 556, 556, 500, 500],
    "¥": [0xa5, 556, 556, 500, 500], "¦": [0xa6, 260, 280, 200, 220], "§": [0xa7, 556, 556, 500, 500], "¨": [0xa8, 333, 333, 333, 333],
    "©": [0xa9, 737, 737, 760, 747], "ª": [0xaa, 370, 370, 276, 300], "«": [0xab, 556, 556, 500, 500], "¬": [0xac, 584, 584, 564, 570],
    "®": [0xae, 737, 737, 760, 747], "¯": [0xaf, 333, 333, 333, 333], "°": [0xb0, 400, 400, 400, 400], "±": [0xb1, 584, 584, 564, 570],
    "²": [0xb2, 333, 333, 300, 300], "³": [0xb3, 333, 333, 300, 300], "´": [0xb4, 333, 333, 333, 333], "µ": [0xb5, 556, 611, 500, 556],
    "¶": [0xb6, 537, 556, 453, 540], "·": [0xb7, 278, 278, 250, 250], "¸": [0xb8, 333, 333, 333, 333], "¹": [0xb9, 333, 333, 300, 300],
    "º": [0xba, 365, 365, 310, 330], "»": [0xbb, 556, 556, 500, 500], "¼": [0xbc, 834, 834, 750, 750], "½": [0xbd, 834, 834, 750, 750],
    "¾": [0xbe, 834, 834, 750, 750], "¿": [0xbf, 611, 611, 444, 500], "Æ": [0xc6, 1000, 1000, 889, 1000], "Ð": [0xd0, 722, 722, 722, 722],
    "×": [0xd7, 584, 584, 564, 570], "Ø": [0xd8, 778, 778, 722, 778], "Þ": [0xde, 667, 667, 556, 611], "ß": [0xdf, 611, 611, 500, 556],
    "æ": [0xe6, 889, 889, 667, 722], "ð": [0xf0, 556, 611, 500, 500], "÷": [0xf7, 584, 584, 564, 570], "ø": [0xf8, 611, 611, 500, 500],
    "þ": [0xfe, 556, 611, 500, 556],
  };
  const FAMILIES = {
    helvetica: { regular: "Helvetica", bold: "Helvetica-Bold", widths: ["Helvetica", "Helvetica-Bold"] },
    times: { regular: "Times-Roman", bold: "Times-Bold", widths: ["Times-Roman", "Times-Bold"] },
    courier: { regular: "Courier", bold: "Courier-Bold", widths: [null, null] },
  };
  const COLUMN = { Helvetica: 1, "Helvetica-Bold": 2, "Times-Roman": 3, "Times-Bold": 4 };
  const familyOf = (name) => FAMILIES[String(name || "").toLowerCase()] || FAMILIES.helvetica;

  // Characters WinAnsi lacks that have a plain stand-in, by code point: the spaces and hyphens Word and web pages put
  // in text (narrow and thin spaces, the non-breaking hyphen, the minus), zero-width marks (dropped), Latin letters
  // that keep no letter when their accent goes (Ł, đ, ı) and a few arrows and signs.
  const STAND_IN = new Map([
    ...Array.from({ length: 11 }, (_, i) => [0x2000 + i, " "]), [0x202f, " "], [0x205f, " "], [0x3000, " "],
    [0x200b, ""], [0x200c, ""], [0x200d, ""], [0x2060, ""], [0xfeff, ""],
    [0x2010, "-"], [0x2011, "-"], [0x2212, "-"], [0x2012, "–"], [0x2015, "—"], [0x2032, "'"], [0x2033, "\""],
    [0x0141, "L"], [0x0142, "l"], [0x0110, "Ð"], [0x0111, "dj"], [0x0131, "i"], [0x0126, "H"], [0x0127, "h"], [0x0166, "T"], [0x0167, "t"],
    [0x2192, "->"], [0x2190, "<-"], [0x2194, "<->"], [0x21d2, "=>"], [0x2264, "<="], [0x2265, ">="], [0x2260, "!="], [0x2248, "~"],
  ]);
  const standIn = (text) => [...String(text ?? "")].map((ch) => STAND_IN.get(ch.codePointAt(0)) ?? ch).join("");
  // A character as its WinAnsi byte: the letter without its accent when WinAnsi lacks it, "?" when there is no letter.
  const strip = (ch) => ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const byteOf = (ch) => {
    const code = ch.codePointAt(0);
    if (code === 9 || code === 10 || code === 13 || code === 0xa0) return 32;
    if (code >= 32 && code < 127) return code;
    if (code >= 0xa0 && code <= 0xff) return code;
    if (HIGH[ch]) return HIGH[ch][0];
    const plain = strip(ch);
    if (plain && plain !== ch && plain.length === 1) return byteOf(plain);
    return 63;
  };
  const encode = (text) => Uint8Array.from([...standIn(text)].map(byteOf));

  // The width of a text in points, in a font (a standard font name) at a size.
  const width = (text, font, size) => {
    if (font.startsWith("Courier")) return [...standIn(text)].length * 600 * size / 1000;
    const table = W[font] || W.Helvetica;
    const column = COLUMN[font] || 1;
    let total = 0;
    for (const ch of standIn(text)) {
      const code = ch.codePointAt(0);
      if (code >= 32 && code < 127) total += table[code - 32];
      else if (HIGH[ch]) total += HIGH[ch][column];
      else if (code === 9 || code === 10 || code === 13 || code === 0xa0) total += table[0];
      else {
        const plain = strip(ch);
        const base = plain && plain.length === 1 ? plain.codePointAt(0) : 63;
        total += base >= 32 && base < 127 ? table[base - 32] : table[31];
      }
    }
    return total * size / 1000;
  };

  // ---- Lines: runs of text ({ text, bold }) wrapped into a width ----
  // Words keep their style; a word longer than the line is broken where it has to be.
  const wrap = (runs, family, size, maxWidth) => {
    const fam = familyOf(family);
    const fontOf = (bold) => (bold ? fam.bold : fam.regular);
    const words = [];
    runs.forEach((run) => {
      const parts = String(run.text ?? "").split(/(\s+)/);
      parts.forEach((part, i) => {
        if (!part) return;
        if (i % 2) words.push({ space: true, font: fontOf(run.bold), width: width(" ", fontOf(run.bold), size) });
        else words.push({ text: part, font: fontOf(run.bold), bold: Boolean(run.bold), width: width(part, fontOf(run.bold), size) });
      });
    });
    const lines = [];
    let line = [];
    let used = 0;
    const flush = () => {
      while (line.length && line[line.length - 1].space) line.pop();
      lines.push(line);
      line = [];
      used = 0;
    };
    const push = (word) => {
      if (word.space) {
        if (line.length) { line.push(word); used += word.width; }
        return;
      }
      if (used + word.width <= maxWidth || !line.length) {
        if (word.width > maxWidth) {
          // Letter by letter until the line is full, the rest on the next one.
          let piece = "";
          for (const ch of word.text) {
            const w = width(piece + ch, word.font, size);
            if (w > maxWidth - used && piece) {
              line.push({ ...word, text: piece, width: width(piece, word.font, size) });
              flush();
              piece = ch;
            } else piece += ch;
          }
          if (piece) { line.push({ ...word, text: piece, width: width(piece, word.font, size) }); used += width(piece, word.font, size); }
          return;
        }
        line.push(word);
        used += word.width;
      } else {
        flush();
        push(word);
      }
    };
    words.forEach(push);
    if (line.length || !lines.length) flush();
    return lines.map((items) => ({ items, width: items.reduce((sum, item) => sum + item.width, 0), segments: segments(items) }));
  };
  // The items of a line joined into as few strings as the fonts allow (a space takes the font of the word before it),
  // so each is written with one operator and reads back, copies and is searched as text with its spaces.
  const segments = (items) => {
    const out = [];
    items.forEach((item) => {
      const text = item.space ? " " : item.text;
      const last = out[out.length - 1];
      if (last && (item.space || last.font === item.font)) { last.text += text; last.width += item.width; }
      else out.push({ text, font: item.font, width: item.width });
    });
    return out;
  };

  // ---- Colours and numbers ----
  const rgb = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    const n = parseInt(m ? m[1] : "000000", 16);
    return [16, 8, 0].map((shift) => ((n >> shift) & 255) / 255);
  };
  const num = (value) => {
    const fixed = Number(value).toFixed(3);
    return fixed.replace(/\.?0+$/, "") || "0";
  };
  const colourOp = (hex, stroke = false) => `${rgb(hex).map(num).join(" ")} ${stroke ? "RG" : "rg"}`;
  const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

  // ---- The file ----
  // A document: pages of drawing operations, written as one PDF (version 1.4, the fonts as resources of every page).
  const create = ({ title = "", author = "", subject = "", creator = "Stiven Catalyst Tools", lang = "", width: pageW = 595.28, height: pageH = 841.89, date = new Date() } = {}) => {
    const pages = [];
    const fonts = new Map();
    const fontRef = (name) => {
      if (!fonts.has(name)) fonts.set(name, `F${fonts.size + 1}`);
      return fonts.get(name);
    };
    let page = null;
    const addPage = () => { page = []; pages.push(page); };
    // Text at x from the left and y from the top, in points; the baseline sits at y.
    const text = (x, y, string, { font = "Helvetica", size = 10, color = "#000000", spacing = 0 } = {}) => {
      if (!page) addPage();
      const bytes = encode(string);
      if (!bytes.length) return;
      page.push(`BT /${fontRef(font)} ${num(size)} Tf ${colourOp(color)} ${spacing ? `${num(spacing)} Tc ` : ""}${num(x)} ${num(pageH - y)} Td <${hex(bytes)}> Tj ET`);
    };
    const line = (x1, y1, x2, y2, { color = "#000000", width: lineWidth = 1 } = {}) => {
      if (!page) addPage();
      page.push(`${colourOp(color, true)} ${num(lineWidth)} w ${num(x1)} ${num(pageH - y1)} m ${num(x2)} ${num(pageH - y2)} l S`);
    };
    // A text string of the file itself (title, author): UTF-16BE with its byte order mark, so every character reads back.
    const pdfString = (value) => `<feff${[...String(value ?? "")].map((ch) => ch.codePointAt(0)).flatMap((code) => (code > 0xffff ? [0xd800 + ((code - 0x10000) >> 10), 0xdc00 + ((code - 0x10000) & 0x3ff)] : [code])).map((unit) => unit.toString(16).padStart(4, "0")).join("")}>`;
    const stamp = (d) => {
      const pad = (n) => String(n).padStart(2, "0");
      return `D:${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    };
    // The bytes of the file.
    const bytes = () => {
      if (!pages.length) addPage();
      const objects = [];
      const add = (body) => { objects.push(body); return objects.length; };
      const fontIds = new Map();
      fonts.forEach((ref, name) => { fontIds.set(ref, add(`<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`)); });
      const resources = `<< /Font << ${[...fontIds].map(([ref, id]) => `/${ref} ${id} 0 R`).join(" ")} >> /ProcSet [/PDF /Text] >>`;
      const pagesId = objects.length + pages.length * 2 + 1;
      const pageIds = pages.map((ops) => {
        const content = ops.join("\n");
        const contentId = add(`<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`);
        return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${num(pageW)} ${num(pageH)}] /Resources ${resources} /Contents ${contentId} 0 R >>`);
      });
      add(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
      const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R${lang ? ` /Lang ${pdfString(lang)}` : ""} >>`);
      const infoId = add(`<< ${title ? `/Title ${pdfString(title)} ` : ""}${author ? `/Author ${pdfString(author)} ` : ""}${subject ? `/Subject ${pdfString(subject)} ` : ""}/Creator ${pdfString(creator)} /Producer ${pdfString(creator)} /CreationDate (${stamp(date)}) /ModDate (${stamp(date)}) >>`);
      // Every object's offset counted in bytes: the body is ASCII apart from the streams, which are ASCII too (hex strings).
      let out = "%PDF-1.4\n%âãÏÓ\n";
      const offsets = [];
      const length = (s) => new TextEncoder().encode(s).length;
      let at = length(out);
      objects.forEach((body, i) => {
        offsets.push(at);
        const chunk = `${i + 1} 0 obj\n${body}\nendobj\n`;
        out += chunk;
        at += length(chunk);
      });
      const xref = at;
      out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
      out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
      return new TextEncoder().encode(out);
    };
    return { addPage, text, line, bytes, pageCount: () => pages.length, width: pageW, height: pageH };
  };

  // ---- A column of blocks laid out over pages ----
  // A table block: { kind: "table", columns: [{ width, align, bold }], header: [texts], rows: [[cells]], size, leading,
  // color, headerColor, rule, space }. width is a share of the column (the shares are scaled to fill it); a cell wraps
  // inside its column; a row is never split between pages; the header row is drawn again at the top of every page
  // the table runs on to; a hairline (rule, a colour, or null for none) closes each row.
  // Blocks: { kind: "text", runs | text, size, bold, color, leading, space, keep, indent, bullet }
  //         { kind: "row", left, right, size, color, rightColor, space, keep }   a title with a date at the right
  //         { kind: "rule", color, width, space }                                 a line across the column
  // space is the gap above the block in points (not at the top of a page); keep moves the block to the next page when
  // the one after it could not start on this one. A text block longer than the room left runs on to the next page
  // (unless keep), a heading never stands alone at the foot of a page.
  // footer(n, total) gives [left, right] texts for the foot of every page.
  const flow = (blocks, { family = "helvetica", page: pageSize = {}, margins = {}, footer = null, footerSize = 8, footerColor = "#666666", footerAt = 20, ...meta } = {}) => {
    const fam = familyOf(family);
    const doc = create({ ...meta, width: pageSize.width ?? 595.28, height: pageSize.height ?? 841.89 });
    const top = margins.top ?? 45;
    const bottom = margins.bottom ?? 48;
    const left = margins.left ?? 54;
    const right = margins.right ?? 54;
    const colWidth = doc.width - left - right;
    const floor = doc.height - bottom;

    // Each block as lines of { runs, height, ascent, draw(x, y) }.
    const prepare = (block) => {
      const size = block.size ?? 10;
      const leading = block.leading ?? size * 1.4;
      const color = block.color ?? "#000000";
      if (block.kind === "rule") {
        const h = block.width ?? 1;
        return { ...block, lines: [{ height: h, draw: (x, y) => doc.line(x, y + h / 2, x + colWidth, y + h / 2, { color: block.color ?? "#000000", width: h }) }] };
      }
      if (block.kind === "table") {
        const pad = 3;
        const columns = (block.columns && block.columns.length ? block.columns : (block.header || block.rows?.[0] || []).map(() => ({ width: 1 })));
        const total = columns.reduce((sum, c) => sum + (c.width || 1), 0);
        const widths = columns.map((c) => (c.width || 1) / total * colWidth);
        const cellLines = (cells, bold) => cells.map((cell, i) => wrap([{ text: String(cell ?? ""), bold: Boolean(bold || columns[i]?.bold) }], family, size, Math.max(8, widths[i] - 2 * pad)));
        const rowLine = (cells, { bold = false, header = false } = {}) => {
          const wrapped = cellLines(cells, bold);
          const count = Math.max(1, ...wrapped.map((lines) => lines.length));
          const height = count * leading + 2 * pad;
          return {
            height,
            header,
            draw: (x, y) => {
              let at = x;
              wrapped.forEach((lines, i) => {
                lines.forEach((line, n) => {
                  const start = columns[i]?.align === "right" ? at + widths[i] - pad - line.width : at + pad;
                  let cx = start;
                  line.segments.forEach((seg) => { doc.text(cx, y + pad + size + n * leading, seg.text, { font: seg.font, size, color: header ? block.headerColor ?? color : color }); cx += seg.width; });
                });
                at += widths[i];
              });
              const rule = block.rule === undefined ? "#c8c8c8" : block.rule;
              if (rule) doc.line(x, y + height, x + colWidth, y + height, { color: rule, width: header ? 0.9 : 0.4 });
            },
          };
        };
        const headerLine = block.header ? rowLine(block.header, { bold: true, header: true }) : null;
        const lines = [...(headerLine ? [headerLine] : []), ...(block.rows || []).map((cells) => rowLine(cells))];
        return { ...block, lines, repeat: headerLine };
      }
      if (block.kind === "row") {
        const font = fam.bold;
        const rightText = String(block.right ?? "").trim();
        const rightWidth = rightText ? Math.min(width(rightText, font, size), colWidth * 0.42) : 0;
        const gap = rightText ? 12 : 0;
        const lefts = wrap([{ text: String(block.left ?? ""), bold: true }], family, size, colWidth - rightWidth - gap);
        // A date longer than its column wraps there, set right, instead of running into the title.
        const rights = rightText ? wrap([{ text: rightText, bold: true }], family, size, rightWidth) : [];
        return { ...block, lines: Array.from({ length: Math.max(lefts.length, rights.length) }, (_, i) => ({
          height: leading,
          draw: (x, y) => {
            let at = x;
            (lefts[i]?.segments || []).forEach((seg) => { doc.text(at, y + size, seg.text, { font: seg.font, size, color }); at += seg.width; });
            let right = x + colWidth - (rights[i]?.width || 0);
            (rights[i]?.segments || []).forEach((seg) => { doc.text(right, y + size, seg.text, { font: seg.font, size, color: block.rightColor ?? color }); right += seg.width; });
          },
        })) };
      }
      const runs = block.runs ?? [{ text: String(block.text ?? ""), bold: Boolean(block.bold) }];
      const indent = block.indent ?? (block.bullet ? 10.5 : 0);
      const spacing = block.spacing ?? 0;
      const extra = spacing ? (text) => spacing * [...text].length : () => 0;
      const lines = wrap(runs.map((run) => ({ ...run, bold: block.bold || run.bold })), family, size, colWidth - indent - (spacing ? colWidth * 0.1 : 0));
      return { ...block, lines: lines.map((line, i) => ({
        height: leading,
        draw: (x, y) => {
          if (!i && block.bullet) doc.text(x, y + size, block.bullet, { font: fam.regular, size, color });
          let at = x + indent;
          line.segments.forEach((seg) => {
            doc.text(at, y + size, seg.text, { font: seg.font, size, color, spacing });
            at += seg.width + extra(seg.text);
          });
        },
      })) };
    };
    const prepared = blocks.filter(Boolean).map(prepare);
    const heightOf = (lines) => lines.reduce((sum, line) => sum + line.height, 0);

    // Pagination: the lines of each block placed down the column, a new page when they no longer fit.
    const placed = [[]];
    let y = top;
    const newPage = () => { placed.push([]); y = top; };
    prepared.forEach((block, index) => {
      const atTop = !placed[placed.length - 1].length;
      const gap = atTop ? 0 : block.space ?? 0;
      const next = prepared[index + 1];
      // A block that must keep the next one takes the next block's first two lines into account.
      const withNext = block.keep && next ? (next.space ?? 0) + heightOf(next.lines.slice(0, 2)) : 0;
      const whole = gap + heightOf(block.lines) + withNext;
      if (!atTop && y + whole > floor) {
        const room = floor - y - gap;
        // Split a long text block where it still fits, at least two lines on either side; never a kept block.
        const fits = block.lines.filter((_, i) => heightOf(block.lines.slice(0, i + 1)) <= room).length;
        const minimum = block.kind === "table" ? (block.repeat ? 2 : 1) : 2;
        if (!block.keep && (block.kind === "table" || block.lines.length > 3) && fits >= minimum && block.lines.length - fits >= (block.kind === "table" ? 1 : 2)) {
          let yy = y + gap;
          block.lines.slice(0, fits).forEach((line) => { placed[placed.length - 1].push({ line, x: left, y: yy }); yy += line.height; });
          newPage();
          if (block.repeat) { placed[placed.length - 1].push({ line: block.repeat, x: left, y }); y += block.repeat.height; }
          block.lines.slice(fits).forEach((line) => {
            if (y + line.height > floor && placed[placed.length - 1].length) {
              newPage();
              if (block.repeat) { placed[placed.length - 1].push({ line: block.repeat, x: left, y }); y += block.repeat.height; }
            }
            placed[placed.length - 1].push({ line, x: left, y });
            y += line.height;
          });
          return;
        }
        newPage();
      }
      y += placed[placed.length - 1].length ? gap : 0;
      block.lines.forEach((line) => {
        if (y + line.height > floor && placed[placed.length - 1].length) {
          newPage();
          if (block.repeat && line !== block.repeat) { placed[placed.length - 1].push({ line: block.repeat, x: left, y }); y += block.repeat.height; }
        }
        placed[placed.length - 1].push({ line, x: left, y });
        y += line.height;
      });
    });

    placed.forEach((items, n) => {
      doc.addPage();
      items.forEach(({ line, x, y: yy }) => line.draw(x, yy));
      if (footer) {
        const [l, r] = footer(n + 1, placed.length);
        const yFoot = doc.height - footerAt;
        // The left text is cut with "…" where it would reach the right one.
        const room = colWidth - (r ? width(r, fam.regular, footerSize) + 12 : 0);
        const cut = (text) => {
          if (width(text, fam.regular, footerSize) <= room) return text;
          let short = [...text];
          while (short.length && width(`${short.join("")}…`, fam.regular, footerSize) > room) short.pop();
          return `${short.join("").trimEnd()}…`;
        };
        if (l) doc.text(left, yFoot, cut(l), { font: fam.regular, size: footerSize, color: footerColor });
        if (r) doc.text(doc.width - right - width(r, fam.regular, footerSize), yFoot, r, { font: fam.regular, size: footerSize, color: footerColor });
      }
    });
    return { bytes: doc.bytes(), pages: placed.length };
  };

  return { FAMILIES, encode, width, wrap, rgb, create, flow };
})();
