// A small Word (.docx) writer shared by the ATS CV and the cover letter. A .docx
// file is a zip of XML parts; the zip is stored without compression, so no
// library is needed.
window.DocxKit = (() => {
  const CRC = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();
  const crc32 = (bytes) => {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) crc = CRC[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };

  const zip = (files) => {
    const encoder = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    files.forEach(({ name, text }) => {
      const nameBytes = encoder.encode(name);
      const data = encoder.encode(text);
      const crc = crc32(data);
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true);
      local.setUint16(12, 0x21, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, data.length, true);
      local.setUint32(22, data.length, true);
      local.setUint16(26, nameBytes.length, true);
      parts.push(new Uint8Array(local.buffer), nameBytes, data);
      const entry = new DataView(new ArrayBuffer(46));
      entry.setUint32(0, 0x02014b50, true);
      entry.setUint16(4, 20, true);
      entry.setUint16(6, 20, true);
      entry.setUint16(8, 0x0800, true);
      entry.setUint16(14, 0x21, true);
      entry.setUint32(16, crc, true);
      entry.setUint32(20, data.length, true);
      entry.setUint32(24, data.length, true);
      entry.setUint16(28, nameBytes.length, true);
      entry.setUint32(42, offset, true);
      central.push(new Uint8Array(entry.buffer), nameBytes);
      offset += 30 + nameBytes.length + data.length;
    });
    const size = central.reduce((sum, part) => sum + part.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, size, true);
    end.setUint32(16, offset, true);
    const all = [...parts, ...central, new Uint8Array(end.buffer)];
    const out = new Uint8Array(all.reduce((sum, part) => sum + part.length, 0));
    let at = 0;
    all.forEach((part) => { out.set(part, at); at += part.length; });
    return out;
  };

  const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");
  const run = (text, props = "") => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ""}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
  // **Text** is bold.
  const rich = (text) => String(text).split(/\*\*(.+?)\*\*/g).map((part, i) => (part ? run(part, i % 2 ? "<w:b/>" : "") : "")).join("");
  const para = (content, props = "") => `<w:p>${props ? `<w:pPr>${props}</w:pPr>` : ""}${content}</w:p>`;
  const LANG_TAGS = { en: "en-GB", de: "de-DE", sq: "sq-AL" };
  const TEXT_WIDTH = 9638;

  // A complete .docx: A4 with 2 cm margins, a default font, and Title and Heading1 styles.
  const wordFile = ({ body, font = "Arial", accent = "111111", lang = "en", title = "", creator = "" }) => {
    const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
    const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
    const document = `${head}<w:document ${NS}><w:body>${body.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    const styles = `${head}<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}" w:eastAsia="${font}"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:val="${LANG_TAGS[lang] || "en-GB"}"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="40" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>`
      + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
      + `<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="40"/></w:pPr><w:rPr><w:b/><w:color w:val="${accent}"/><w:sz w:val="40"/><w:szCs w:val="40"/></w:rPr></w:style>`
      + `<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="${accent}"/></w:pBdr><w:spacing w:before="260" w:after="100"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:caps/><w:color w:val="${accent}"/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>`
      + "</w:styles>";
    const core = `${head}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${esc(title)}</dc:title><dc:creator>${esc(creator)}</dc:creator></cp:coreProperties>`;
    const rels = "http://schemas.openxmlformats.org";
    return zip([
      { name: "[Content_Types].xml", text: `${head}<Types xmlns="${rels}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>` },
      { name: "_rels/.rels", text: `${head}<Relationships xmlns="${rels}/package/2006/relationships"><Relationship Id="rId1" Type="${rels}/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="${rels}/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>` },
      { name: "word/_rels/document.xml.rels", text: `${head}<Relationships xmlns="${rels}/package/2006/relationships"><Relationship Id="rId1" Type="${rels}/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
      { name: "word/document.xml", text: document },
      { name: "word/styles.xml", text: styles },
      { name: "docProps/core.xml", text: core },
    ]);
  };

  return { crc32, zip, esc, run, rich, para, wordFile, TEXT_WIDTH };
})();
