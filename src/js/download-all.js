// "Download all" (the Downloads page, and beside "Download PDF" on the publications, essays and reflections): one
// ZIP with every file of the site in the page's language and the file with all the writing, put together in the
// reader's browser. The list comes from /downloads/all-<lang>.json (src/downloads-manifest.njk); the files are
// fetched one after another from this site and stored as they are (PDF and MP3 are compressed already), so the
// archive needs no library and the phone does no compressing. A button with data-section takes one section only.
// Nothing is sent anywhere; a file that cannot be fetched is left out and said so.
(() => {
  // The partial that draws a button also names this script, so a page with several buttons loads it more than once.
  if (window.scDownloadAll) return;
  window.scDownloadAll = true;
  const buttons = [...document.querySelectorAll("[data-download-all]")];
  if (!buttons.length) return;
  // Without the script the button would do nothing, so it is drawn only now.
  buttons.forEach((button) => { button.hidden = false; });

  // CRC-32 of the bytes, as every ZIP reader checks it.
  const table = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (bytes) => {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = table[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };

  // The ZIP itself: for each file a local header and its bytes, then the central directory and its end. Names in
  // UTF-8 (flag 0x0800), the files stored (method 0). Plain ZIP, so up to 4 GB, which a language stays well under.
  const zip = (entries) => {
    const encoder = new TextEncoder();
    const now = new Date();
    const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    const parts = [];
    const central = [];
    let offset = 0;
    for (const entry of entries) {
      const name = encoder.encode(entry.name);
      const head = new DataView(new ArrayBuffer(30));
      head.setUint32(0, 0x04034b50, true);
      head.setUint16(4, 20, true);
      head.setUint16(6, 0x0800, true);
      head.setUint16(8, 0, true);
      head.setUint16(10, time, true);
      head.setUint16(12, date, true);
      head.setUint32(14, entry.crc, true);
      head.setUint32(18, entry.size, true);
      head.setUint32(22, entry.size, true);
      head.setUint16(26, name.length, true);
      head.setUint16(28, 0, true);
      parts.push(head.buffer, name, entry.blob);
      const dir = new DataView(new ArrayBuffer(46));
      dir.setUint32(0, 0x02014b50, true);
      dir.setUint16(4, 20, true);
      dir.setUint16(6, 20, true);
      dir.setUint16(8, 0x0800, true);
      dir.setUint16(10, 0, true);
      dir.setUint16(12, time, true);
      dir.setUint16(14, date, true);
      dir.setUint32(16, entry.crc, true);
      dir.setUint32(20, entry.size, true);
      dir.setUint32(24, entry.size, true);
      dir.setUint16(28, name.length, true);
      dir.setUint32(42, offset, true);
      central.push(dir.buffer, name);
      offset += 30 + name.length + entry.size;
    }
    const centralSize = central.reduce((n, part) => n + part.byteLength, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, entries.length, true);
    end.setUint16(10, entries.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end.buffer], { type: "application/zip" });
  };

  const fill = (text, values) => String(text || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  let busy = false;

  buttons.forEach((button) => button.addEventListener("click", async () => {
    if (busy) return;
    const status = document.getElementById(button.dataset.status || "") || null;
    const say = (text) => { if (status) status.textContent = text; };
    const text = button.querySelector("span") || button;
    const label = text.textContent;
    busy = true;
    buttons.forEach((b) => { b.disabled = true; });
    try {
      const manifest = await (await fetch(button.dataset.download)).json();
      const sections = button.dataset.section ? manifest.sections.filter((s) => s.id === button.dataset.section) : manifest.sections;
      const files = sections.flatMap((s) => s.files);
      if (!button.dataset.section && manifest.writing) files.push(manifest.writing);
      const folder = manifest.archive;
      const entries = [];
      let failed = 0;
      for (const [i, file] of files.entries()) {
        const progress = fill(button.dataset.busy, { a: i + 1, b: files.length });
        text.textContent = progress;
        say(progress);
        try {
          const response = await fetch(file.href);
          if (!response.ok) throw new Error(String(response.status));
          const blob = await response.blob();
          const bytes = new Uint8Array(await blob.arrayBuffer());
          entries.push({ name: `${folder}/${file.name}`, blob, size: bytes.length, crc: crc32(bytes) });
        } catch {
          failed += 1;
        }
      }
      if (!entries.length) throw new Error("nothing fetched");
      const section = button.dataset.section ? `-${button.dataset.section}` : "";
      const name = `${folder}${section}-${new Date().toISOString().slice(0, 10)}.zip`;
      const url = URL.createObjectURL(zip(entries));
      const link = Object.assign(document.createElement("a"), { href: url, download: name });
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      say([fill(button.dataset.done, { name }), failed ? fill(button.dataset.failed, { n: failed }) : ""].filter(Boolean).join(" "));
    } catch {
      say(button.dataset.error || "");
    } finally {
      text.textContent = label;
      buttons.forEach((b) => { b.disabled = false; });
      busy = false;
    }
  }));
})();
