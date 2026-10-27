// Fishbone (Ishikawa): the effect at the head, one bone per category of a set (6M, 4P, Service 5), up to twelve causes
// per bone, each with its own whys (one level), a "likely" mark and the votes of the team. Several diagrams are kept,
// the drawing is one SVG, and the causes go on to 5 Whys, Pareto and the Action Tracker. The arithmetic and the
// geometry live in window.FishboneMath, so tests can call them without a page.
(() => {
  const MAX_CAUSES = 12;
  const MAX_SUBS = 5;
  const MAX_VOTES = 99;
  // The drawing: 960 wide, at least 560 high; a bone grows when its causes need more rows.
  const W = 960;
  const BASE_H = 560;
  const PAD = 64;
  const SLOT = 21;
  const SLANT = 96;
  const HEAD_W = 168;
  // Average width of a glyph per pixel of font size (Inter, Segoe UI): enough to keep a text off the next bone.
  const GLYPH = 0.53;

  const str = (value) => (typeof value === "string" ? value : "");
  const squash = (text) => str(text).replace(/\s+/g, " ").trim();
  // A text cut to max characters with an ellipsis; the full text stays in the tooltip.
  const clip = (text, max) => {
    const value = squash(text);
    if (value.length <= max) return value;
    return `${value.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
  };
  // Words in lines of at most width characters, at most `lines` lines; the last line is cut if more is left.
  const wrap = (text, width, lines) => {
    const out = [];
    let line = "";
    const words = squash(text).split(" ").filter(Boolean);
    words.forEach((word) => {
      const next = line ? `${line} ${word}` : word;
      if (next.length <= width) { line = next; return; }
      if (line) out.push(line);
      line = word.length > width ? clip(word, width) : word;
    });
    if (line) out.push(line);
    if (out.length <= lines) return out;
    const kept = out.slice(0, lines);
    kept[lines - 1] = clip(`${kept[lines - 1]} ${out.slice(lines).join(" ")}`, width);
    if (!kept[lines - 1].endsWith("…")) kept[lines - 1] = `${clip(kept[lines - 1], width - 1)}…`;
    return kept;
  };

  const subsOf = (cause) => (Array.isArray(cause?.subs) ? cause.subs.map(squash).filter(Boolean).slice(0, MAX_SUBS) : []);
  const votesOf = (cause) => (Number.isInteger(cause?.votes) && cause.votes > 0 ? Math.min(MAX_VOTES, cause.votes) : 0);
  // The causes of one category that have a text (an empty row in the editor is not a cause yet).
  const causesOf = (diagram, index) => (Array.isArray(diagram?.causes?.[index]) ? diagram.causes[index] : [])
    .filter((cause) => squash(cause?.text)).slice(0, MAX_CAUSES);

  // Every cause of the categories shown, most votes first; on a tie a likely cause first, then the order of the bones.
  const rank = (diagram, categories) => categories.flatMap((category, ci) => causesOf(diagram, ci).map((cause, index) => ({
    id: str(cause.id), text: squash(cause.text), category, ci, index, votes: votesOf(cause), likely: cause.likely === true, subs: subsOf(cause),
  }))).sort((a, b) => b.votes - a.votes || Number(b.likely) - Number(a.likely) || a.ci - b.ci || a.index - b.index);

  const stats = (diagram, categories) => {
    const perCategory = categories.map((name, ci) => {
      const list = causesOf(diagram, ci);
      return { name, count: list.length, likely: list.filter((c) => c.likely === true).length, votes: list.reduce((sum, c) => sum + votesOf(c), 0) };
    });
    return {
      total: perCategory.reduce((sum, c) => sum + c.count, 0),
      likely: perCategory.reduce((sum, c) => sum + c.likely, 0),
      votes: perCategory.reduce((sum, c) => sum + c.votes, 0),
      subs: categories.reduce((sum, _, ci) => sum + causesOf(diagram, ci).reduce((n, c) => n + subsOf(c).length, 0), 0),
      touched: perCategory.filter((c) => c.count > 0).length,
      categories: categories.length,
      empty: perCategory.filter((c) => !c.count).map((c) => c.name),
      perCategory,
    };
  };
  // Causes kept in categories the chosen set does not have (6M has six, 4P four): they come back with a set that has them.
  const hidden = (diagram, categories) => (Array.isArray(diagram?.causes) ? diagram.causes : [])
    .slice(categories.length).reduce((sum, list) => sum + (Array.isArray(list) ? list.filter((c) => squash(c?.text)).length : 0), 0);

  // The diagram as an indented outline, for an e-mail or a shift note.
  const outline = (diagram, categories, labels = {}) => {
    const likely = labels.likely || "likely";
    const votes = labels.votes || ((n) => `${n} ${n === 1 ? "vote" : "votes"}`);
    const lines = [`${labels.title ? `${labels.title}: ` : ""}${squash(diagram?.effect) || labels.untitled || ""}`];
    categories.forEach((category, ci) => {
      lines.push("", category);
      const list = causesOf(diagram, ci);
      if (!list.length) lines.push("  –");
      list.forEach((cause) => {
        const marks = [cause.likely === true ? likely : "", votesOf(cause) ? votes(votesOf(cause)) : ""].filter(Boolean);
        lines.push(`  - ${squash(cause.text)}${marks.length ? ` (${marks.join(", ")})` : ""}`);
        subsOf(cause).forEach((sub) => lines.push(`      - ${sub}`));
      });
    });
    return lines.join("\n");
  };

  // The table for the Pareto tool: one row per cause with votes, the votes as the count.
  const paretoTable = (ranked, labels = {}) => ({
    source: labels.source || "Fishbone",
    headers: [labels.cause || "Cause", labels.category || "Category", labels.votes || "Votes"],
    rows: ranked.filter((c) => c.votes > 0).map((c) => [c.text, c.category, String(c.votes)]),
    map: { category: 0, count: 2, value: -1, date: -1, filter: 1 },
    measure: "count",
  });

  // Geometry. The spine runs from the left to the head; the first half of the categories hang above it, the rest
  // below, each bone slanting back from the spine like the bones of a fish. Causes sit on horizontal lines that end
  // on their bone, their whys on small branches under them. Each cause takes one row, each why one more.
  const layout = (diagram, categories) => {
    const n = Math.max(1, categories.length);
    const lists = categories.map((_, i) => causesOf(diagram, i));
    const top = Math.ceil(n / 2);
    const bottom = categories.length - top;
    const cols = top;
    const rowsOf = (list) => list.reduce((sum, cause) => sum + 1 + subsOf(cause).length, 0);
    const most = Math.max(0, ...lists.map(rowsOf));
    const half = Math.max((BASE_H - 2 * PAD) / 2, (most + 1) * SLOT);
    const H = Math.ceil(Math.max(BASE_H, 2 * half + 2 * PAD));
    const spineY = H / 2;
    const headX = W - HEAD_W - 10;
    const lines = wrap(diagram?.effect, 18, 5);
    const headH = Math.max(84, lines.length * 18 + 30);
    const head = {
      x: headX, y: spineY - headH / 2, w: HEAD_W, h: headH, text: squash(diagram?.effect),
      lines: lines.map((text, i) => ({ text, x: headX + HEAD_W / 2, y: spineY - ((lines.length - 1) * 18) / 2 + i * 18 + 5 })),
    };
    const left = 16;
    const right = headX - 14;
    // The bones are parallel, colW apart; the first one leaves a full column on its left too.
    const colW = (right - left + 8 - SLANT) / cols;
    const bones = categories.map((name, i) => {
      const isTop = i < top;
      const col = isTop ? i : i - top + (cols - bottom);
      const leftmost = isTop ? col === 0 : col === cols - bottom;
      const joint = left - 8 + SLANT + colW * (col + 1);
      const tipX = joint - SLANT;
      const tipY = isTop ? spineY - half : spineY + half;
      const xAt = (y) => joint - (SLANT * Math.abs(y - spineY)) / half;
      // Room for a text on the left of the bone: up to the bone before it, or the edge for the first.
      const room = (y) => (leftmost ? xAt(y) - left - 6 : colW - 16);
      const list = lists[i];
      const rows = rowsOf(list);
      const step = (half - 12) / (rows + 1);
      const rowY = (k) => (isTop ? tipY + (k + 1) * step : spineY + (k + 1) * step);
      let k = 0;
      const causes = list.map((cause) => {
        const y = rowY(k++);
        const x2 = xAt(y);
        const votes = votesOf(cause);
        const suffix = votes ? ` (${votes})` : "";
        const max = Math.max(4, Math.floor((room(y) - 10) / (12 * GLYPH)) - suffix.length);
        const label = clip(cause.text, max);
        const width = Math.min(room(y), (label.length + suffix.length) * 12 * GLYPH + 14);
        const subs = subsOf(cause).map((sub) => {
          const ys = rowY(k++);
          const xs = xAt(ys);
          const subMax = Math.max(4, Math.floor((room(ys) - 40) / (11 * GLYPH)));
          const subLabel = clip(sub, subMax);
          // A short line of its own under the why, joined to the line of its cause by a branch.
          const lineX1 = xs - 26 - Math.min(room(ys) - 26, subLabel.length * 11 * GLYPH + 10);
          return { text: sub, label: subLabel, x1: x2 - 16, y1: y, x2: xs - 26, y2: ys, lineX1, textX: xs - 30, textY: ys - 4 };
        });
        return { id: str(cause.id), text: squash(cause.text), label, votes, suffix, likely: cause.likely === true, x1: x2 - width, x2, y, textX: x2 - 8, textY: y - 4, subs };
      });
      const labelText = clip(name, Math.max(6, Math.floor((colW - 20) / 8)));
      const labelW = labelText.length * 13 * 0.62 + 20;
      return {
        index: i, name, side: isTop ? "top" : "bottom", count: list.length,
        joint: { x: joint, y: spineY }, tip: { x: tipX, y: tipY },
        label: { text: labelText, x: tipX, y: isTop ? tipY - 14 : tipY + 26, box: { x: tipX - labelW / 2, y: isTop ? tipY - 32 : tipY + 8, w: labelW, h: 26 } },
        causes,
      };
    });
    return { W, H, spine: { x1: left, x2: headX, y: spineY }, head, bones, colW };
  };

  // Saved data can be damaged; keep only what has the expected shape.
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const cleanCause = (cause) => (isObject(cause) ? {
    id: str(cause.id) || newId("c"),
    text: str(cause.text).slice(0, 200),
    likely: cause.likely === true,
    votes: votesOf(cause),
    subs: (Array.isArray(cause.subs) ? cause.subs : []).filter((s) => typeof s === "string").map((s) => s.slice(0, 160)).slice(0, MAX_SUBS),
  } : null);
  const cleanDiagram = (diagram, setKeys, width = 6) => {
    if (!isObject(diagram)) return null;
    const causes = Array.from({ length: width }, (_, i) => (Array.isArray(diagram.causes?.[i]) ? diagram.causes[i] : []).map(cleanCause).filter(Boolean).slice(0, MAX_CAUSES));
    return {
      id: str(diagram.id) || newId("d"),
      effect: str(diagram.effect).slice(0, 300),
      set: setKeys.includes(diagram.set) ? diagram.set : setKeys[0],
      causes,
      updated: /^\d{4}-\d{2}-\d{2}$/.test(str(diagram.updated)) ? diagram.updated : "",
    };
  };

  window.FishboneMath = { MAX_CAUSES, MAX_SUBS, MAX_VOTES, W, BASE_H, clip, wrap, causesOf, rank, stats, hidden, outline, paretoTable, layout, cleanCause, cleanDiagram };

  const dataEl = document.getElementById("fishbone-data");
  const root = document.querySelector("[data-fishbone]");
  if (!dataEl || !root || !window.ToolKit) return;
  const { tx, read, write, el, int, plural, showDate, today, addDays, panel, stat, barList, focusCard, resultActions, resultLayout, undoNote, flash, firstVisit, downloadCsv, downloadXlsx } = window.ToolKit;
  const ChartKit = window.ChartKit;
  const Actions = window.ActionsStore;
  const cfg = JSON.parse(dataEl.textContent);
  const KEY = cfg.storageKey;
  const SETS = cfg.sets.map((set) => set.key);
  const WIDTH = Math.max(...cfg.sets.map((set) => set.categories.length));
  const setOf = (key) => cfg.sets.find((set) => set.key === key) || cfg.sets[0];

  // State: the saved diagrams, the one open, and which one is the example (until the visitor makes it their own).
  const saved = read(KEY, {});
  const state = {
    diagrams: (isObject(saved) && Array.isArray(saved.diagrams) ? saved.diagrams : []).map((d) => cleanDiagram(d, SETS, WIDTH)).filter(Boolean),
    current: isObject(saved) ? str(saved.current) : "",
    example: isObject(saved) ? str(saved.example) : "",
  };
  const save = () => write(KEY, state);
  const blank = (set = SETS[0]) => ({ id: newId("d"), effect: "", set, causes: Array.from({ length: WIDTH }, () => []), updated: today() });
  const isBlank = (d) => !squash(d.effect) && !d.causes.some((list) => list.some((c) => squash(c.text)));
  const current = () => state.diagrams.find((d) => d.id === state.current) || null;
  const ensure = () => {
    if (!state.diagrams.length) state.diagrams.push(blank());
    if (!current()) state.current = state.diagrams[0].id;
    if (!state.diagrams.some((d) => d.id === state.example)) state.example = "";
  };
  const categories = (d = current()) => setOf(d.set).categories;
  const voteText = (n) => plural(n, tx("vote"), tx("votes"));

  // Elements.
  const q = (selector) => root.querySelector(selector);
  const listBox = q("[data-list]");
  const listCount = q("[data-list-count]");
  const listStatus = q("[data-list-status]");
  const effectInput = q("#fb-effect");
  const setSelect = q("#fb-set");
  const setNote = q("[data-set-note]");
  const catsBox = q("[data-categories]");
  const causeCount = q("[data-cause-count]");
  const causeStatus = q("[data-cause-status]");
  const results = document.querySelector("[data-results]");

  // The example note above the result, while the open diagram is the example.
  const exampleBox = el("div", "dl-example-note");
  exampleBox.setAttribute("role", "status");
  const clearExample = el("button", "button-ghost", tx("Clear the example"));
  clearExample.type = "button";
  exampleBox.append(el("strong", null, tx("Example")), " ", el("span", null, tx("This is an example, so you can see what the tool shows. Change it to make it yours, start a new diagram, or clear it now.")), " ", clearExample);
  exampleBox.hidden = true;
  results.before(exampleBox);

  // Any edit of the example makes it the visitor's own diagram.
  const touched = () => {
    const d = current();
    if (d && state.example === d.id) state.example = "";
    if (d) d.updated = today();
  };

  // The list of saved diagrams: open one, duplicate it, delete it (with undo).
  const renderList = () => {
    listBox.replaceChildren();
    state.diagrams.forEach((d) => {
      const s = stats(d, setOf(d.set).categories);
      const item = el("li", "fb-item");
      if (d.id === state.current) item.setAttribute("aria-current", "true");
      const open = el("button", "fb-open");
      open.type = "button";
      open.dataset.open = d.id;
      open.append(el("strong", null, squash(d.effect) || cfg.text.untitled), el("span", "fb-item-meta", [setOf(d.set).name.split(" · ")[0], plural(s.total, tx("cause"), tx("causes")), s.likely ? tx("{n} likely", { n: int.format(s.likely) }) : "", d.id === state.example ? tx("Example") : "", d.updated ? showDate(d.updated) : ""].filter(Boolean).join(" · ")));
      const dup = el("button", "button-ghost fb-dup", tx("Duplicate"));
      dup.type = "button";
      dup.dataset.duplicate = d.id;
      dup.setAttribute("aria-label", `${tx("Duplicate")}: ${squash(d.effect) || cfg.text.untitled}`);
      const remove = el("button", "dl-remove", "×");
      remove.type = "button";
      remove.dataset.remove = d.id;
      remove.setAttribute("aria-label", `${tx("Delete")}: ${squash(d.effect) || cfg.text.untitled}`);
      item.append(open, dup, remove);
      listBox.append(item);
    });
    listCount.textContent = plural(state.diagrams.length, tx("diagram"), tx("diagrams"));
  };

  // The editor: the effect, the set, one fieldset per category with its causes.
  const visuallyHidden = (text, forId) => {
    const label = el("label", "visually-hidden", text);
    label.htmlFor = forId;
    return label;
  };
  const causeRow = (cause, ci, index, category) => {
    const item = el("li", "fb-cause");
    item.dataset.id = cause.id;
    if (cause.likely) item.classList.add("is-likely");
    const main = el("div", "fb-cause-main");
    const inputId = `fb-c-${cause.id}`;
    const input = el("input", "fb-text");
    input.id = inputId;
    input.value = cause.text;
    input.autocomplete = "off";
    input.maxLength = 200;
    input.dataset.field = "text";
    const likely = el("button", "fb-likely");
    likely.type = "button";
    likely.dataset.act = "likely";
    likely.setAttribute("aria-pressed", String(cause.likely));
    likely.append(el("span", "fb-likely-dot"), tx("Likely"));
    const votes = el("div", "fb-votes");
    votes.setAttribute("role", "group");
    votes.setAttribute("aria-label", `${tx("Votes")}: ${squash(cause.text) || tx("Cause {n}", { n: index + 1 })}`);
    const down = el("button", "fb-vote", "−");
    down.type = "button";
    down.dataset.act = "down";
    down.setAttribute("aria-label", tx("One vote less"));
    down.disabled = cause.votes <= 0;
    const count = el("output", "fb-vote-count", int.format(cause.votes));
    count.setAttribute("aria-live", "polite");
    const up = el("button", "fb-vote", "+");
    up.type = "button";
    up.dataset.act = "up";
    up.setAttribute("aria-label", tx("One vote more"));
    up.disabled = cause.votes >= MAX_VOTES;
    votes.append(down, count, up);
    const remove = el("button", "dl-remove", "×");
    remove.type = "button";
    remove.dataset.act = "remove";
    remove.setAttribute("aria-label", tx("Remove cause {n} in {category}", { n: index + 1, category }));
    main.append(visuallyHidden(tx("Cause {n} in {category}", { n: index + 1, category }), inputId), input, likely, votes, remove);
    item.append(main);
    const subs = el("ul", "fb-subs");
    cause.subs.forEach((sub, j) => {
      const li = el("li", "fb-sub");
      const subId = `fb-s-${cause.id}-${j}`;
      const field = el("input", "fb-sub-text");
      field.id = subId;
      field.value = sub;
      field.autocomplete = "off";
      field.maxLength = 160;
      field.placeholder = cfg.text.subPlaceholder;
      field.dataset.sub = String(j);
      const drop = el("button", "dl-remove", "×");
      drop.type = "button";
      drop.dataset.act = "remove-sub";
      drop.dataset.sub = String(j);
      drop.setAttribute("aria-label", tx("Remove why {j} of cause {n}", { j: j + 1, n: index + 1 }));
      li.append(visuallyHidden(tx("Why {j} of cause {n} in {category}", { j: j + 1, n: index + 1, category }), subId), field, drop);
      subs.append(li);
    });
    item.append(subs);
    if (cause.subs.length < MAX_SUBS) {
      const add = el("button", "button-ghost fb-add-sub", tx("Add a why"));
      add.type = "button";
      add.dataset.act = "add-sub";
      item.append(add);
    }
    return item;
  };
  const renderEditor = () => {
    const d = current();
    effectInput.value = d.effect;
    setSelect.value = d.set;
    const cats = categories(d);
    const away = hidden(d, cats);
    setNote.textContent = away ? tx("{n} causes sit in categories this set does not have. They are kept and come back when you choose a set with more categories.", { n: int.format(away) }) : "";
    catsBox.replaceChildren();
    cats.forEach((category, ci) => {
      const list = d.causes[ci];
      const set = el("fieldset", "fb-cat");
      set.dataset.cat = String(ci);
      const legend = el("legend", "fb-cat-head");
      legend.append(el("span", "fb-cat-name", category), el("span", "fb-cat-count", `${int.format(list.length)} / ${MAX_CAUSES}`));
      set.append(legend);
      const ol = el("ol", "fb-causes");
      list.forEach((cause, index) => ol.append(causeRow(cause, ci, index, category)));
      set.append(ol);
      const add = el("div", "fb-add");
      const addId = `fb-new-${ci}`;
      const input = el("input", "fb-new");
      input.id = addId;
      input.autocomplete = "off";
      input.maxLength = 200;
      input.placeholder = cfg.text.causePlaceholder;
      input.dataset.new = String(ci);
      const button = el("button", "button-secondary", tx("Add cause"));
      button.type = "button";
      button.dataset.act = "add";
      const full = list.length >= MAX_CAUSES;
      input.disabled = full;
      button.disabled = full;
      add.append(visuallyHidden(tx("New cause in {category}", { category }), addId), input, button);
      set.append(add);
      if (full) set.append(el("p", "form-note", tx("12 causes is the most for one category. Merge the ones that say the same.")));
      catsBox.append(set);
    });
    const s = stats(d, cats);
    causeCount.textContent = s.total ? `${plural(s.total, tx("cause"), tx("causes"))} · ${tx("{n} likely", { n: int.format(s.likely) })} · ${voteText(s.votes)}` : "";
  };

  // The drawing, from the layout.
  const FONT = "Inter, Segoe UI, Roboto, Arial, sans-serif";
  const draw = (L, d, cats) => {
    const { svgEl, C } = ChartKit;
    const title = `${cfg.text.tool}: ${squash(d.effect) || cfg.text.untitled}`;
    const svg = svgEl("svg", { viewBox: `0 0 ${L.W} ${L.H}`, role: "img", "aria-label": title, class: "ck-chart fb-chart", "font-family": FONT });
    svg.append(svgEl("title", {}, title));
    svg.append(svgEl("line", { x1: L.spine.x1, y1: L.spine.y, x2: L.spine.x2, y2: L.spine.y, stroke: C.text, "stroke-width": 3, "stroke-linecap": "round" }));
    L.bones.forEach((bone) => {
      const g = svgEl("g", { class: "fb-bone" });
      g.append(svgEl("line", { x1: bone.tip.x, y1: bone.tip.y, x2: bone.joint.x, y2: bone.joint.y, stroke: C.muted, "stroke-width": 2, "stroke-linecap": "round" }));
      const label = svgEl("g", { "data-tip": `${bone.name}\n${plural(bone.count, tx("cause"), tx("causes"))}`, class: "ck-hit" });
      label.append(svgEl("rect", { x: bone.label.box.x, y: bone.label.box.y, width: bone.label.box.w, height: bone.label.box.h, rx: 13, fill: C.paper, stroke: C.muted, "stroke-width": 1 }));
      label.append(svgEl("text", { x: bone.label.x, y: bone.label.y, "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: C.text }, bone.label.text));
      g.append(label);
      bone.causes.forEach((cause) => {
        const tip = [cause.text, [bone.name, cause.likely ? tx("likely") : "", voteText(cause.votes)].filter(Boolean).join(" · "), ...cause.subs.map((sub) => `– ${sub.text}`)].join("\n");
        const cg = svgEl("g", { class: `ck-hit fb-mark${cause.likely ? " is-likely" : ""}`, "data-tip": tip });
        cg.append(svgEl("line", { x1: cause.x1, y1: cause.y, x2: cause.x2, y2: cause.y, stroke: cause.likely ? C.blue : C.grid, "stroke-width": cause.likely ? 2 : 1.5 }));
        const text = svgEl("text", { x: cause.textX, y: cause.textY, "text-anchor": "end", "font-size": 12, "font-weight": cause.likely ? 700 : 500, fill: cause.likely ? C.blue : C.text });
        text.append(svgEl("tspan", {}, cause.label));
        if (cause.suffix) text.append(svgEl("tspan", { "font-weight": 800, fill: C.muted }, cause.suffix));
        cg.append(text);
        cause.subs.forEach((sub) => {
          cg.append(svgEl("line", { x1: sub.x1, y1: sub.y1, x2: sub.x2, y2: sub.y2, stroke: C.muted, "stroke-width": 1, "stroke-opacity": 0.6 }));
          cg.append(svgEl("line", { x1: sub.lineX1, y1: sub.y2, x2: sub.x2, y2: sub.y2, stroke: C.grid, "stroke-width": 1 }));
          cg.append(svgEl("text", { x: sub.textX, y: sub.textY, "text-anchor": "end", "font-size": 11, fill: C.muted }, sub.label));
        });
        if (cause.likely) cg.append(svgEl("circle", { cx: cause.x2, cy: cause.y, r: 5, fill: C.blue, stroke: C.paper, "stroke-width": 1.5 }));
        g.append(cg);
      });
      svg.append(g);
    });
    const head = svgEl("g", { class: "ck-hit fb-head", "data-tip": squash(d.effect) || cfg.text.untitled });
    head.append(svgEl("rect", { x: L.head.x, y: L.head.y, width: L.head.w, height: L.head.h, rx: 10, fill: C.paper, stroke: C.blue, "stroke-width": 2.5 }));
    L.head.lines.forEach((line) => head.append(svgEl("text", { x: line.x, y: line.y, "text-anchor": "middle", "font-size": 14, "font-weight": 800, fill: C.text }, line.text)));
    if (!L.head.lines.length) head.append(svgEl("text", { x: L.head.x + L.head.w / 2, y: L.spine.y + 5, "text-anchor": "middle", "font-size": 13, fill: C.muted }, tx("The effect")));
    svg.append(head);
    return svg;
  };

  const summary = (d, cats) => outline(d, cats, { title: cfg.text.tool, untitled: cfg.text.untitled, likely: tx("likely"), votes: voteText });
  const csvRows = (d, cats) => [
    [tx("Effect"), tx("Category"), tx("Cause"), tx("Whys"), tx("Likely"), tx("Votes")],
    ...rank(d, cats).map((c) => [squash(d.effect), c.category, c.text, c.subs.join("; "), c.likely ? tx("yes") : tx("no"), c.votes]),
  ];

  // Likely causes become actions to verify, once each (an open action of the same title is not added again).
  const addActions = (d, cats, status) => {
    if (!Actions) return;
    const likely = rank(d, cats).filter((c) => c.likely);
    const open = new Set(Actions.list().filter((a) => Actions.isOpen(a) && a.source === "fishbone").map((a) => a.title));
    let added = 0, unsaved = 0;
    likely.forEach((cause, i) => {
      const title = tx("Verify: {cause}", { cause: cause.text });
      if (open.has(title)) return;
      const action = Actions.add({
        title,
        detail: [`${cfg.text.tool}: ${squash(d.effect) || cfg.text.untitled}`, cause.category, cause.subs.join("; "), cause.votes ? voteText(cause.votes) : ""].filter(Boolean).join(" · "),
        due: addDays(today(), 7), example: d.id === state.example, source: "fishbone", check: cfg.text.checkText, priority: i === 0 ? "High" : "Medium",
      });
      // Counted only when saved (ActionsStore.add gives null for an action it could not save).
      if (action) added++;
      else if (Actions.lastAdd === "unsaved") unsaved++;
    });
    const link = el("a", "inline-link", tx("Open the Action Tracker"));
    link.href = Actions.trackerUrl().href;
    status.replaceChildren(`${added || unsaved ? window.ToolKit.actionsNote({ added, unsaved }) : tx("These causes are already open in the Action Tracker.")} `, link);
  };

  const renderResults = () => {
    const d = current();
    exampleBox.hidden = !(d && d.id === state.example);
    results.replaceChildren();
    if (!d || isBlank(d)) { results.hidden = true; return; }
    results.hidden = false;
    const cats = categories(d);
    const ranked = rank(d, cats);
    const s = stats(d, cats);
    const set = setOf(d.set);

    const head = el("div", "result-head fb-head-text");
    head.append(el("p", "kicker", tx("Fishbone diagram")));
    head.append(el("h2", null, squash(d.effect) || cfg.text.untitled));
    head.append(el("p", "fb-meta", [set.name, plural(s.total, tx("cause"), tx("causes")), voteText(s.votes)].join(" · ")));

    const verify = s.likely === 1 ? tx("1 likely cause to verify on the floor") : tx("{n} likely causes to verify on the floor", { n: int.format(s.likely) });
    const statsBox = el("div", "dl-stats fb-stats");
    statsBox.append(
      stat(tx("Causes"), int.format(s.total), s.subs ? plural(s.subs, tx("why"), tx("whys")) : tx("no whys yet")),
      stat(tx("Likely causes"), int.format(s.likely), s.likely ? verify : tx("Mark the causes the team believes most")),
      stat(tx("Categories touched"), tx("{a} of {b}", { a: int.format(s.touched), b: int.format(s.categories) }), s.empty.length ? `${tx("Nothing yet in")}: ${s.empty.join(", ")}` : tx("Every bone has a cause.")),
      stat(tx("Votes"), int.format(s.votes), ranked[0]?.votes ? tx("Most: {n}", { n: voteText(ranked[0].votes) }) : tx("No votes yet")),
    );

    const notes = [];
    if (s.likely) {
      const line = el("p", "fb-verify");
      const words = el("span");
      words.append(el("strong", null, verify), `. ${tx("A likely cause is a guess until someone has seen it where the work happens.")}`);
      line.append(el("span", "fb-likely-dot"), words);
      notes.push(line);
    }
    if (ChartKit) {
      const fig = ChartKit.figure(draw(layout(d, cats), d, cats), { fileName: "fishbone", caption: tx("Blue with a dot: a likely cause. In brackets: its votes. Point at a cause to read it in full.") });
      fig.classList.add("fb-figure");
      notes.push(fig);
    }

    const top = ranked[0];
    const focus = top ? focusCard({
      title: top.text,
      detail: top.category,
      lede: top.votes ? tx("The cause with the most votes. Check it first: go and see, count, compare a good day with a bad one.") : tx("No votes yet. Let the team vote, then check the cause with the most votes first."),
      extraLabel: top.subs.length ? tx("Whys") : "",
      extra: top.subs.join(" · "),
      warning: !s.likely && s.total >= 3 ? tx("No cause is marked likely yet. Agree on the two or three the team believes most, so they can be verified.") : "",
    }) : null;

    const problem = top ? `${squash(d.effect) || cfg.text.untitled}: ${top.text}` : squash(d.effect);
    const pareto = s.votes ? () => paretoTable(ranked, { source: `${cfg.text.tool}: ${squash(d.effect) || cfg.text.untitled}`, cause: tx("Cause"), category: tx("Category"), votes: tx("Votes") }) : null;
    const actions = resultActions(() => summary(d, cats), problem, pareto);
    const copyButton = actions.querySelector("button");
    copyButton.textContent = tx("Copy as outline");
    const status = el("p", "form-note fb-action-status");
    status.setAttribute("aria-live", "polite");
    if (Actions) {
      const send = el("button", "button-secondary", `${tx("Send likely causes to actions")} (${int.format(s.likely)})`);
      send.type = "button";
      send.disabled = !s.likely;
      send.addEventListener("click", () => addActions(d, cats, status));
      actions.append(send);
    }
    const csv = el("button", "button-secondary", tx("Download CSV"));
    csv.type = "button";
    csv.addEventListener("click", () => downloadCsv(cfg.text.csvName, csvRows(d, cats)));
    const xlsx = el("button", "button-secondary", tx("Download Excel"));
    xlsx.type = "button";
    xlsx.addEventListener("click", () => downloadXlsx(cfg.text.csvName, csvRows(d, cats)));
    actions.append(csv, xlsx);
    const actionBox = el("div", "fb-actions");
    actionBox.append(actions, status);

    const panels = [];
    if (ranked.length) {
      const rankPanel = panel(tx("Ranked causes"), s.votes ? tx("By votes; on a tie the likely cause first.") : tx("No votes yet: the causes in the order of the bones."));
      rankPanel.classList.add("fb-panel-rank");
      rankPanel.append(barList(ranked.slice(0, 12).map((c) => ({ key: c.text, value: c.votes, category: c.category, likely: c.likely })), {
        ranked: true,
        label: (item) => [voteText(item.value), ` · ${item.category}`],
        highlight: (item) => item.likely,
        tag: tx("likely"),
        title: (item) => `${item.key} · ${item.category}`,
      }));
      if (ranked.length > 12) rankPanel.append(el("p", "dl-panel-note", tx("{n} more in the CSV.", { n: int.format(ranked.length - 12) })));
      panels.push(rankPanel);
    }
    const catPanel = panel(tx("Causes per category"), s.empty.length ? tx("An empty bone is a question to ask the team, not proof that nothing is there.") : tx("Every bone has a cause."));
    catPanel.classList.add("fb-panel-cats");
    catPanel.append(barList(s.perCategory.map((c) => ({ key: c.name, value: c.count, likely: c.likely, votes: c.votes })), {
      label: (item) => [int.format(item.value), ` · ${tx("{n} likely", { n: int.format(item.likely) })} · ${voteText(item.votes)}`],
      highlight: (item) => item.likely > 0,
      tag: tx("likely"),
    }));
    panels.push(catPanel);

    resultLayout(results, { head, stats: statsBox, notes, focus, actions: actionBox, panels });
  };

  const render = () => {
    ensure();
    renderList();
    renderEditor();
    renderResults();
  };
  // Typing changes no structure: the editor keeps its focus, only the list and the result follow.
  const typed = () => {
    touched();
    save();
    renderList();
    renderResults();
  };
  const changed = () => {
    touched();
    save();
    render();
  };

  // The example: one diagram, moved in as a new one (an example already open is shown again, not copied).
  const loadExample = () => {
    const there = state.diagrams.find((d) => d.id === state.example);
    if (there) { state.current = there.id; return; }
    const ex = cfg.example;
    const d = cleanDiagram({ effect: ex.effect, set: ex.set, causes: ex.causes, updated: today() }, SETS, WIDTH);
    // A blank diagram the visitor never typed in makes room for the example.
    state.diagrams = state.diagrams.filter((x) => !isBlank(x));
    state.diagrams.unshift(d);
    state.current = d.id;
    state.example = d.id;
  };

  // Events: the list.
  listBox.addEventListener("click", (event) => {
    const open = event.target.closest("[data-open]");
    if (open) {
      state.current = open.dataset.open;
      save();
      render();
      return;
    }
    const dup = event.target.closest("[data-duplicate]");
    if (dup) {
      const from = state.diagrams.find((d) => d.id === dup.dataset.duplicate);
      if (!from) return;
      const copyOf = cleanDiagram(JSON.parse(JSON.stringify(from)), SETS, WIDTH);
      copyOf.id = newId("d");
      copyOf.causes.forEach((list) => list.forEach((c) => { c.id = newId("c"); }));
      copyOf.effect = `${squash(from.effect) || cfg.text.untitled} (${cfg.text.copySuffix})`.slice(0, 300);
      copyOf.updated = today();
      state.diagrams.splice(state.diagrams.indexOf(from) + 1, 0, copyOf);
      state.current = copyOf.id;
      save();
      render();
      flash(listStatus, tx("Duplicated. You are now working on the copy."));
      effectInput.focus();
      return;
    }
    const remove = event.target.closest("[data-remove]");
    if (!remove) return;
    const index = state.diagrams.findIndex((d) => d.id === remove.dataset.remove);
    if (index < 0) return;
    const [gone] = state.diagrams.splice(index, 1);
    const wasCurrent = state.current === gone.id;
    const wasExample = state.example === gone.id;
    if (wasExample) state.example = "";
    if (wasCurrent) state.current = state.diagrams[Math.min(index, state.diagrams.length - 1)]?.id || "";
    ensure();
    save();
    render();
    undoNote(listStatus, tx("Deleted {name}.", { name: squash(gone.effect) || cfg.text.untitled }), () => {
      // The blank diagram made for an empty list leaves when the deleted one comes back.
      state.diagrams = state.diagrams.filter((d) => !isBlank(d) || d.id === gone.id);
      state.diagrams.splice(Math.min(index, state.diagrams.length), 0, gone);
      if (wasCurrent || !current()) state.current = gone.id;
      if (wasExample) state.example = gone.id;
      save();
      render();
    });
  });
  q("[data-new]").addEventListener("click", () => {
    const d = current();
    if (d && isBlank(d)) { effectInput.focus(); return; }
    // The example leaves when the visitor starts their own diagram.
    if (state.example) {
      state.diagrams = state.diagrams.filter((x) => x.id !== state.example);
      state.example = "";
    }
    const fresh = blank(d ? d.set : SETS[0]);
    state.diagrams.unshift(fresh);
    state.current = fresh.id;
    save();
    render();
    effectInput.focus();
  });
  root.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => {
    loadExample();
    save();
    render();
    results.scrollIntoView({ behavior: "smooth", block: "start" });
    results.focus({ preventScroll: true });
  }));
  clearExample.addEventListener("click", () => {
    state.diagrams = state.diagrams.filter((d) => d.id !== state.example);
    state.example = "";
    state.current = state.diagrams[0]?.id || "";
    ensure();
    save();
    render();
  });

  // Events: the effect and the set. A new set keeps the causes by position: the first bone stays the first.
  effectInput.addEventListener("input", () => {
    current().effect = effectInput.value.slice(0, 300);
    typed();
  });
  setSelect.addEventListener("change", () => {
    current().set = SETS.includes(setSelect.value) ? setSelect.value : SETS[0];
    changed();
  });

  // Events: the causes.
  const causeAt = (node) => {
    const ci = Number(node.closest("[data-cat]")?.dataset.cat);
    const id = node.closest("[data-id]")?.dataset.id;
    const list = current().causes[ci];
    const index = list ? list.findIndex((c) => c.id === id) : -1;
    return { ci, list, index, cause: index >= 0 ? list[index] : null };
  };
  const addCause = (ci) => {
    const input = catsBox.querySelector(`[data-new="${ci}"]`);
    const text = squash(input?.value);
    const list = current().causes[ci];
    if (!text) { flash(causeStatus, tx("Write the cause first.")); input?.focus(); return; }
    if (list.length >= MAX_CAUSES) return;
    list.push({ id: newId("c"), text, likely: false, votes: 0, subs: [] });
    changed();
    catsBox.querySelector(`[data-new="${ci}"]`)?.focus();
  };
  catsBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-act]");
    if (!button) return;
    const act = button.dataset.act;
    const ci = Number(button.closest("[data-cat]").dataset.cat);
    if (act === "add") { addCause(ci); return; }
    const { list, index, cause } = causeAt(button);
    if (!cause) return;
    const item = button.closest(".fb-cause");
    if (act === "likely") {
      cause.likely = !cause.likely;
      button.setAttribute("aria-pressed", String(cause.likely));
      item.classList.toggle("is-likely", cause.likely);
      typed();
      renderCount();
    } else if (act === "up" || act === "down") {
      cause.votes = Math.max(0, Math.min(MAX_VOTES, cause.votes + (act === "up" ? 1 : -1)));
      item.querySelector(".fb-vote-count").textContent = int.format(cause.votes);
      item.querySelector('[data-act="down"]').disabled = cause.votes <= 0;
      item.querySelector('[data-act="up"]').disabled = cause.votes >= MAX_VOTES;
      typed();
      renderCount();
    } else if (act === "remove") {
      const [gone] = list.splice(index, 1);
      const diagramId = current().id;
      changed();
      catsBox.querySelector(`[data-new="${ci}"]`)?.focus();
      undoNote(causeStatus, tx("Removed {cause}.", { cause: squash(gone.text) || tx("Cause {n}", { n: index + 1 }) }), () => {
        const d = state.diagrams.find((x) => x.id === diagramId);
        if (!d || d.causes[ci].length >= MAX_CAUSES) return;
        d.causes[ci].splice(Math.min(index, d.causes[ci].length), 0, gone);
        state.current = d.id;
        changed();
      });
    } else if (act === "add-sub") {
      if (cause.subs.length >= MAX_SUBS) return;
      cause.subs.push("");
      changed();
      catsBox.querySelector(`#fb-s-${cause.id}-${cause.subs.length - 1}`)?.focus();
    } else if (act === "remove-sub") {
      cause.subs.splice(Number(button.dataset.sub), 1);
      changed();
      catsBox.querySelector(`#fb-c-${cause.id}`)?.focus();
    }
  });
  const renderCount = () => {
    const s = stats(current(), categories());
    causeCount.textContent = s.total ? `${plural(s.total, tx("cause"), tx("causes"))} · ${tx("{n} likely", { n: int.format(s.likely) })} · ${voteText(s.votes)}` : "";
  };
  catsBox.addEventListener("input", (event) => {
    const input = event.target;
    if (input.dataset.field === "text") {
      const { cause } = causeAt(input);
      if (!cause) return;
      cause.text = input.value.slice(0, 200);
      typed();
      renderCount();
    } else if (input.dataset.sub !== undefined && input.tagName === "INPUT") {
      const { cause } = causeAt(input);
      if (!cause) return;
      cause.subs[Number(input.dataset.sub)] = input.value.slice(0, 160);
      typed();
    }
  });
  catsBox.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target.dataset.new === undefined) return;
    event.preventDefault();
    addCause(Number(event.target.dataset.new));
  });

  // Printing: only the result, on one A4 page in landscape (see 16-fishbone.css).
  window.addEventListener("beforeprint", () => document.documentElement.classList.add("fb-print"));
  window.addEventListener("afterprint", () => document.documentElement.classList.remove("fb-print"));

  // A first visit opens on the example; nothing is written until the visitor acts. Another tool can start a diagram
  // with ?problem=: the effect is filled in once, and the address is cleaned.
  const params = new URLSearchParams(location.search);
  const incoming = squash(params.get("problem")).slice(0, 300);
  if (incoming) {
    const same = state.diagrams.find((d) => squash(d.effect) === incoming);
    const open = current();
    if (same) state.current = same.id;
    else if (open && isBlank(open)) open.effect = incoming;
    else {
      const fresh = blank(open ? open.set : SETS[0]);
      fresh.effect = incoming;
      state.diagrams.unshift(fresh);
      state.current = fresh.id;
    }
    ensure();
    save();
    params.delete("problem");
    const rest = params.toString();
    history.replaceState(null, "", `${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`);
  } else if (!state.diagrams.some((d) => !isBlank(d)) && firstVisit(KEY)) {
    loadExample();
  }
  render();
})();
