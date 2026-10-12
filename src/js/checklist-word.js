// "Download as Word": the checklist at the end of an essay as a .docx the reader can take into the shift folder or
// the next team meeting (layouts/article.njk, [data-checklist-word]; the file is written by js/docx-kit.js, which
// the page loads first). The document carries the checklist's title, its questions (a box to tick, or the label,
// its hint and a line to write on; an answer typed on the page goes in), its note, the three moves for tomorrow's
// shift, and where it comes from. Everything happens in the browser; nothing is sent.
window.ChecklistWord = (() => {
  const GREY = '<w:color w:val="666666"/>';
  const SMALL = '<w:sz w:val="18"/><w:szCs w:val="18"/>';
  const LINE = '<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr><w:spacing w:before="240" w:after="60"/>';

  // The checklist as the page shows it: title, note, items (text, hint, answer), the essay's moves.
  const read = (box) => {
    const article = document.querySelector("[data-article]");
    const items = [...box.querySelectorAll("[data-checklist-item]")].map((item) => {
      const label = item.closest("label");
      const span = label?.querySelector("span");
      const text = span ? [...span.childNodes].filter((n) => n.nodeName !== "B").map((n) => n.textContent).join("").trim() : "";
      return { text, hint: label?.querySelector("small")?.textContent.trim() || "", answer: item.type === "checkbox" ? "" : item.value.trim(), fill: item.type !== "checkbox" };
    });
    return {
      title: box.querySelector(".kicker")?.textContent.trim() || "",
      note: box.querySelector(".essay-checklist-note")?.textContent.trim() || "",
      items,
      moves: [...document.querySelectorAll(".essay-moves li span")].map((el) => el.textContent.trim()).filter(Boolean),
      essay: article?.dataset.essayTitle || document.title,
      slug: article?.dataset.essayId || "checklist",
      url: box.dataset.essayUrl || location.href,
      lang: box.dataset.lang || document.documentElement.lang || "en",
      labels: { from: box.dataset.wordFrom || "From the essay", moves: box.dataset.wordMoves || "Tomorrow on shift", answer: box.dataset.wordAnswer || "Your answer", site: box.dataset.site || "", author: box.dataset.author || "" },
    };
  };

  // The .docx bytes for a checklist.
  const build = (box) => {
    const kit = window.DocxKit;
    if (!kit) return null;
    const { run, para } = kit;
    const c = read(box);
    const body = [];
    body.push(para(run(c.title), '<w:pStyle w:val="Title"/>'));
    body.push(para(run(`${c.labels.from} “${c.essay}” · ${c.labels.site}`.trim(), GREY + SMALL), '<w:spacing w:after="240"/>'));
    c.items.forEach((item, i) => {
      if (!item.fill) {
        body.push(para(run("☐  ", "") + run(item.text), '<w:spacing w:before="80" w:after="80"/><w:ind w:left="284" w:hanging="284"/>'));
        return;
      }
      body.push(para(run(`${String(i + 1).padStart(2, "0")}  ${item.text}`, "<w:b/>"), '<w:keepNext/><w:spacing w:before="240" w:after="40"/>'));
      if (item.hint) body.push(para(run(item.hint, "<w:i/>" + GREY + SMALL), '<w:keepNext/><w:spacing w:after="40"/>'));
      if (item.answer) {
        item.answer.split(/\n+/).forEach((line) => body.push(para(run(line))));
      } else {
        body.push(para(run(c.labels.answer, GREY + SMALL), '<w:keepNext/><w:spacing w:before="80" w:after="0"/>'));
        body.push(para(run(" "), LINE));
        body.push(para(run(" "), LINE));
      }
    });
    if (c.note) body.push(para(run(c.note, "<w:i/>" + GREY + SMALL), '<w:spacing w:before="240" w:after="120"/>'));
    if (c.moves.length) {
      body.push(para(run(c.labels.moves), '<w:pStyle w:val="Heading1"/>'));
      c.moves.forEach((move, i) => body.push(para(run(`${String(i + 1).padStart(2, "0")}  `, "<w:b/>") + run(move), '<w:spacing w:after="80"/><w:ind w:left="284" w:hanging="284"/>')));
    }
    body.push(para(run(`${c.labels.from} “${c.essay}”: ${c.url}`, GREY + SMALL), '<w:spacing w:before="360"/>'));
    return kit.wordFile({ body, font: "Arial", accent: "1d4ed8", lang: c.lang, title: `${c.title} – ${c.essay}`, creator: c.labels.author });
  };

  const fileName = (box) => {
    const c = read(box);
    return `${c.slug}-${c.lang}-checklist.docx`;
  };

  const download = (box) => {
    const bytes = build(box);
    if (!bytes) return false;
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName(box);
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  };

  document.querySelectorAll("[data-essay-checklist]").forEach((box) => {
    const button = box.querySelector("[data-checklist-word]");
    if (!button) return;
    button.addEventListener("click", () => { download(box); });
  });

  return { read, build, fileName, download };
})();
