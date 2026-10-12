// "Listen": an essay or reflection read aloud by a voice of the reader's own browser (the Web Speech API,
// speechSynthesis), from the bar at the top of the text (layouts/article.njk, [data-listen]).
// - The title, the intro and the text are read block by block (headings, paragraphs, list items, quotes), each
//   block split into sentences, so a long paragraph is never one utterance (some browsers stop after ~15 seconds).
// - The block being read is marked, and followed on screen while the reader is near it.
// - Pause is a stop that remembers the sentence; resume starts again from that sentence. (speechSynthesis.pause
//   is unreliable on several browsers.)
// - The bar shows only when the browser has a voice for the page's language; without one it says so.
// - The speed is kept in this browser only (localStorage "sc-listen-rate"). Nothing is recorded or sent.
(() => {
  const box = document.querySelector("[data-listen]");
  const article = document.querySelector("[data-article]");
  if (!box || !article || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;

  const synth = window.speechSynthesis;
  const code = (box.dataset.lang || document.documentElement.lang || "en").toLowerCase().slice(0, 2);
  const toggle = box.querySelector("[data-listen-toggle]");
  const label = box.querySelector("[data-listen-label]");
  const stopButton = box.querySelector("[data-listen-stop]");
  const rateSelect = box.querySelector("[data-listen-rate]");
  const status = box.querySelector("[data-listen-status]");
  const bar = box.querySelector("[data-listen-bar]");
  const note = box.querySelector("[data-listen-note]");
  const KEY = "sc-listen-rate";

  // The text to read: the title and intro of the hero, then the blocks of the text, without the boxes around it.
  const SKIP = ".essay-moves, .essay-checklist, .essay-tools, .essay-notes, .essay-series, .share-row, .article-toc-fold, .visually-hidden, [data-listen]";
  const blocks = () => {
    const found = [];
    const title = document.querySelector(".article-hero h1");
    const deck = document.querySelector(".article-deck");
    if (title) found.push(title);
    if (deck) found.push(deck);
    article.querySelectorAll("h2, h3, p, li, blockquote").forEach((el) => {
      if (el.closest(SKIP)) return;
      if (el.querySelector("p, li, h2, h3")) return; // a quote or an item whose paragraphs are read on their own
      if (!el.textContent.trim()) return;
      found.push(el);
    });
    return found;
  };

  // One block becomes sentences; a very long sentence is cut at a comma or semicolon near its middle.
  const sentences = (text) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) return [];
    const parts = clean.split(/(?<=[.!?…][”")\]]?)\s+(?=[^a-zà-ÿ])/u).map((s) => s.trim()).filter(Boolean);
    const out = [];
    for (const part of parts) {
      if (part.length <= 260) { out.push(part); continue; }
      const middle = Math.floor(part.length / 2);
      let cut = -1;
      for (const mark of ["; ", ", "]) {
        const left = part.lastIndexOf(mark, middle);
        const right = part.indexOf(mark, middle);
        const best = right > -1 && (left < 0 || right - middle < middle - left) ? right : left;
        if (best > 40 && best < part.length - 40) { cut = best + mark.length; break; }
      }
      if (cut < 0) { out.push(part); continue; }
      out.push(part.slice(0, cut).trim(), part.slice(cut).trim());
    }
    return out;
  };

  let queue = [];        // { block, text }
  let index = 0;         // the sentence to speak next
  let playing = false;
  let stopping = false;  // a cancel of our own, whose "interrupted" error is not a failure
  let current = null;    // the block marked on screen
  let voice = null;

  const build = () => {
    queue = [];
    for (const block of blocks()) for (const text of sentences(block.textContent)) queue.push({ block, text });
  };

  const rate = () => {
    const value = parseFloat(rateSelect?.value || "1");
    return Number.isFinite(value) && value > 0 ? value : 1;
  };
  try {
    const kept = localStorage.getItem(KEY);
    if (kept && rateSelect && [...rateSelect.options].some((o) => o.value === kept)) rateSelect.value = kept;
  } catch { /* storage unavailable */ }

  const say = (text) => { if (status) status.textContent = text; };
  const fill = (template, a, b) => template.replace("{a}", a).replace("{b}", b);

  const mark = (block) => {
    if (block === current) return;
    const follow = current && isNear(current);
    current?.classList.remove("is-speaking");
    current = block;
    if (!current) return;
    current.classList.add("is-speaking");
    if (follow && !isNear(current)) current.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const isNear = (el) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || 0);
  };

  const progress = () => {
    const total = new Set(queue.map((q) => q.block)).size;
    const done = new Set(queue.slice(0, Math.min(index + 1, queue.length)).map((q) => q.block)).size;
    if (bar) bar.style.width = `${total ? Math.round((done / total) * 100) : 0}%`;
    say(fill(box.dataset.progressLabel || "{a} / {b}", done, total));
  };

  const setLabel = (text) => { if (label) label.textContent = text; };

  const finish = () => {
    playing = false;
    index = 0;
    mark(null);
    toggle.setAttribute("aria-pressed", "false");
    setLabel(box.dataset.playLabel || "Listen");
    if (stopButton) stopButton.hidden = true;
    if (bar) bar.style.width = "100%";
    say(box.dataset.doneLabel || "");
  };

  const speak = () => {
    if (!playing) return;
    if (index >= queue.length) { finish(); return; }
    const item = queue[index];
    const u = new SpeechSynthesisUtterance(item.text);
    u.lang = voice?.lang || code;
    if (voice) u.voice = voice;
    u.rate = rate();
    u.onstart = () => { mark(item.block); progress(); };
    u.onend = () => { if (!playing || stopping) return; index += 1; speak(); };
    u.onerror = (event) => {
      if (stopping || event.error === "interrupted" || event.error === "canceled") return;
      playing = false;
      toggle.setAttribute("aria-pressed", "false");
      setLabel(box.dataset.resumeLabel || "Resume");
      say(box.dataset.failedLabel || "");
    };
    synth.speak(u);
  };

  const halt = () => {
    stopping = true;
    synth.cancel();
    // The "interrupted" errors of the cancelled utterance arrive after this turn.
    setTimeout(() => { stopping = false; }, 0);
  };

  const play = () => {
    if (!queue.length) build();
    playing = true;
    toggle.setAttribute("aria-pressed", "true");
    setLabel(box.dataset.pauseLabel || "Pause");
    if (stopButton) stopButton.hidden = false;
    speak();
  };

  const pause = () => {
    playing = false;
    halt();
    toggle.setAttribute("aria-pressed", "false");
    setLabel(box.dataset.resumeLabel || "Resume");
  };

  toggle.addEventListener("click", () => { if (playing) pause(); else play(); });
  stopButton?.addEventListener("click", () => {
    const was = playing;
    playing = false;
    halt();
    index = 0;
    mark(null);
    if (bar) bar.style.width = "0%";
    if (was) play(); else { setLabel(box.dataset.playLabel || "Listen"); toggle.setAttribute("aria-pressed", "false"); stopButton.hidden = true; say(""); }
  });
  rateSelect?.addEventListener("change", () => {
    try { localStorage.setItem(KEY, rateSelect.value); } catch { /* storage unavailable */ }
    // A new speed applies from the sentence being read.
    if (playing) { halt(); speak(); }
  });
  window.addEventListener("pagehide", () => { if (playing) halt(); });

  // The voice: one for the page's language, a local one before an online one, the browser's default first.
  const pick = () => {
    const voices = synth.getVoices ? synth.getVoices() : [];
    const match = voices.filter((v) => String(v.lang || "").toLowerCase().replace("_", "-").startsWith(code));
    match.sort((a, b) => (b.localService === true) - (a.localService === true) || (b.default === true) - (a.default === true));
    return match[0] || null;
  };
  let settled = false;
  const settle = () => {
    if (settled) return;
    voice = pick();
    const any = synth.getVoices ? synth.getVoices().length : 0;
    if (!voice && !any) return; // the list is not loaded yet
    settled = true;
    box.hidden = false;
    if (voice) return;
    // No voice for this language: the bar says so instead of offering a button that would speak another language.
    toggle.disabled = true;
    if (rateSelect) rateSelect.disabled = true;
    if (note) note.textContent = box.dataset.noVoice || "";
  };
  settle();
  if (!settled) {
    if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", settle);
    // Some browsers never fire the event; after a moment, decide with what there is (and show the note if nothing).
    setTimeout(() => { if (!settled) { settled = true; voice = pick(); box.hidden = false; if (!voice) { toggle.disabled = true; if (rateSelect) rateSelect.disabled = true; if (note) note.textContent = box.dataset.noVoice || ""; } } }, 2000);
  }
})();
