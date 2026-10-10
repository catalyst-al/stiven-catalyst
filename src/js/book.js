// The book reader: pages that turn like paper. On a wide screen it shows one
// large page at a time, at a size the small print can be read at, and the
// reader can lay the book open on two pages instead; on a phone it shows one
// page at a time. Without this script the pages simply follow each other down
// the page. A page is a picture (the book, the magazine, the Tools Guide) or,
// in the Management Review, the page itself as HTML (.book-page.is-live): laid
// out at its printed size and scaled to its place in the book, so its text
// stays sharp at any size. The scale, --pg-scale, follows the width of a page.
(() => {
  const reader = document.querySelector("[data-book]");
  const book = reader?.querySelector("[data-book-pages]");
  if (!reader || !book) return;

  const $ = (selector) => reader.querySelector(selector);
  const labels = JSON.parse(reader.dataset.labels || "{}");
  const pages = [...book.querySelectorAll(".book-page")];
  const total = pages.length;
  const storageKey = `sc-book-${reader.dataset.slug}`;
  const wide = window.matchMedia("(min-width: 900px)");
  const viewKey = "sc-book-view";
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const TURN = 900; // ms for one page
  const FAST = 520; // ms for each page when leafing through many
  const STAGGER = 55;

  const fill = (text, values) => String(text || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  const numberOf = (page) => Number(page?.dataset.page) || 0;
  // Live pages: the printed width of a page (148 mm) as the browser lays it out, for the scale.
  const live = pages[0]?.classList.contains("is-live") || false;
  const pageWidth = () => pages[0]?.querySelector(".pg")?.offsetWidth || 559.37;
  const fit = (el, width) => { if (live) el.style.setProperty("--pg-scale", String(width / pageWidth())); };

  // In the open book the back cover sits alone on the left. With an odd number of pages an empty
  // endpaper goes before it, as in a printed book; with an even number it lands there by itself.
  const endpaper = document.createElement("div");
  endpaper.className = "book-page is-blank";
  endpaper.setAttribute("aria-hidden", "true");

  let sheets = []; // { el, index, turned, shown, busy }
  let turned = 0;  // sheets already turned to the left
  let spread = false;
  let large = false; // one large page on a wide screen
  // On a wide screen the reader chooses: one large page (the default) or two pages side by side.
  let two = false;
  try { two = localStorage.getItem(viewKey) === "two"; } catch { /* storage unavailable */ }

  const faceList = () => (spread && total % 2 === 1 ? [...pages.slice(0, -1), endpaper, pages[total - 1]] : pages);

  // The pages in view: [left, right] when open, [page] on a phone.
  const inView = () => {
    if (!spread) return [pages[turned]];
    const list = faceList();
    return [list[turned * 2 - 1], list[turned * 2]].filter((page) => page && page !== endpaper);
  };

  const currentPage = () => {
    const [first] = inView();
    return numberOf(first) || 1;
  };

  // How many sheets to turn to have this page in view.
  const turnsFor = (number) => {
    const index = Math.max(0, faceList().indexOf(pages[Math.min(Math.max(number, 1), total) - 1]));
    return spread ? Math.ceil(index / 2) : index;
  };

  const build = () => {
    const keep = sheets.length ? currentPage() : 1;
    spread = wide.matches && two;
    large = wide.matches && !two;
    book.replaceChildren();
    const list = faceList();
    const perSheet = spread ? 2 : 1;
    sheets = [];
    for (let i = 0; i < list.length; i += perSheet) {
      const el = document.createElement("div");
      el.className = "book-sheet";
      const front = document.createElement("div");
      front.className = "book-face is-front";
      front.append(list[i]);
      const back = document.createElement("div");
      back.className = "book-face is-back";
      if (spread && list[i + 1]) back.append(list[i + 1]);
      el.append(front, back);
      book.append(el);
      sheets.push({ el, index: sheets.length, turned: false, shown: false, busy: 0 });
    }
    if (spread) {
      book.append(edge("is-left"), edge("is-right"));
    }
    reader.classList.toggle("is-spread", spread);
    reader.classList.toggle("is-single", !spread);
    reader.classList.toggle("is-large", large);
    const viewButton = $("[data-book-view]");
    if (viewButton) {
      viewButton.hidden = !wide.matches;
      viewButton.textContent = two ? viewButton.dataset.one : viewButton.dataset.two;
    }
    turned = turnsFor(keep);
    sheets.forEach((sheet) => { sheet.turned = sheet.shown = sheet.index < turned; });
    scale();
    render();
  };

  // A live page is as wide as its face: the whole book on a phone or as one large page, half of it when open.
  const scale = () => fit(book, book.clientWidth / (spread ? 2 : 1));
  if (live && "ResizeObserver" in window) new ResizeObserver(scale).observe(book);

  function edge(side) {
    const el = document.createElement("div");
    el.className = `book-edge ${side}`;
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  // Stacking: unturned sheets lie with the first on top, turned ones with the
  // last on top. A sheet in motion stays above both until it lands.
  const render = () => {
    const count = sheets.length;
    for (const sheet of sheets) {
      const near = sheet.index >= turned - 3 && sheet.index <= turned + 2;
      sheet.el.classList.toggle("is-turned", sheet.turned);
      sheet.el.classList.toggle("is-moving", sheet.busy > 0);
      sheet.el.hidden = !(near || sheet.busy);
      sheet.el.style.zIndex = (sheet.shown ? sheet.index + 1 : count - sheet.index) + (sheet.busy ? count * 2 : 0);
      sheet.el.classList.toggle("is-left", spread && sheet.index === turned - 1);
      sheet.el.classList.toggle("is-right", sheet.index === turned);
    }
    // At rest the book is flat (styles.css): no page sits in a 3D scene while it is read.
    book.classList.toggle("is-still", !sheets.some((sheet) => sheet.busy > 0));
    book.classList.toggle("is-closed-front", spread && turned === 0);
    book.classList.toggle("is-closed-back", spread && turned === count);
    book.style.setProperty("--left-stack", Math.min(turned, 12));
    book.style.setProperty("--right-stack", Math.min(count - turned - 1, 12));
    status();
  };

  const status = () => {
    const shown = inView().map(numberOf).filter(Boolean);
    const first = shown[0] || 1;
    const last = shown[shown.length - 1] || first;
    let where;
    if (first === 1 && last === 1) where = labels.cover;
    else if (first === total && last === total) where = labels.back;
    else if (first === last) where = fill(labels.page, { n: first });
    else where = fill(labels.pages, { a: first, b: last });
    $("[data-book-where]").textContent = where;
    $("[data-book-total]").textContent = fill(labels.of, { total });
    $("[data-book-scrub]").value = first;
    $("[data-book-scrub]").style.setProperty("--progress", `${((first - 1) / (total - 1)) * 100}%`);
    const chapter = [...reader.querySelectorAll("[data-book-goto]")].filter((button) => Number(button.dataset.bookGoto) <= last).pop();
    $("[data-book-chapter]").textContent = chapter
      ? `${chapter.querySelector(".book-contents-label").textContent} · ${chapter.querySelector(".book-contents-title").textContent}`
      : "";
    reader.querySelectorAll("[data-book-goto]").forEach((button) => {
      button.toggleAttribute("aria-current", button === chapter);
    });
    $("[data-book-prev]").disabled = turned === 0;
    $("[data-book-next]").disabled = turned >= sheets.length - (spread ? 0 : 1);
    // On the back cover, the way on to another issue (the magazine).
    const end = $("[data-book-end]");
    if (end) end.hidden = last !== total;
  };

  const remember = () => {
    const page = currentPage();
    try { localStorage.setItem(storageKey, String(page)); } catch { /* storage unavailable */ }
    history.replaceState(null, "", page > 1 ? `#faqe-${page}` : "#reader");
    $("[data-book-resume]").hidden = true;
  };

  // Turn to a number of turned sheets, one sheet after another.
  const turnTo = (target) => {
    target = Math.max(0, Math.min(target, sheets.length - (spread ? 0 : 1)));
    if (target === turned) return;
    const forward = target > turned;
    const moving = forward ? sheets.slice(turned, target) : sheets.slice(target, turned).reverse();
    const quick = moving.length > 1;
    const duration = calm.matches ? 0 : quick ? FAST : TURN;
    turned = target;
    moving.forEach((sheet, step) => {
      const start = () => {
        sheet.busy += 1;
        sheet.turned = forward;
        sheet.el.style.setProperty("--turn", `${duration}ms`);
        render();
        // Halfway over, the sheet joins the pile it is falling onto.
        setTimeout(() => { sheet.shown = forward; render(); }, duration / 2);
        setTimeout(() => { sheet.busy -= 1; render(); }, duration + 30);
      };
      if (step === 0 || calm.matches) start();
      else setTimeout(start, step * STAGGER);
    });
    remember();
    toTop();
  };

  // A large page is taller than the window: after a turn the new page starts at its top.
  const toTop = () => {
    if (large && book.getBoundingClientRect().top < 0) book.scrollIntoView({ behavior: calm.matches ? "auto" : "smooth", block: "start" });
  };

  const goToPage = (number) => turnTo(turnsFor(number));
  const next = () => turnTo(turned + 1);
  const prev = () => turnTo(turned - 1);

  // Clicks and swipes on the pages.
  let pointer = null;
  book.addEventListener("pointerdown", (event) => {
    pointer = event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
  });
  book.addEventListener("pointerup", (event) => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
      return;
    }
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) return;
    const box = book.getBoundingClientRect();
    const side = (event.clientX - box.left) / box.width;
    if (spread && turned === 0) next();
    else if (spread && turned === sheets.length) prev();
    else if (side > (spread ? 0.5 : 0.35)) next();
    else prev();
  });
  book.addEventListener("pointercancel", () => { pointer = null; });

  $("[data-book-next]").addEventListener("click", next);
  $("[data-book-prev]").addEventListener("click", prev);

  const scrub = $("[data-book-scrub]");
  scrub.addEventListener("input", () => {
    scrub.style.setProperty("--progress", `${((scrub.value - 1) / (total - 1)) * 100}%`);
  });
  scrub.addEventListener("change", () => goToPage(Number(scrub.value)));

  // Table of contents.
  const tocButton = $("[data-book-toc]");
  const contents = $("[data-book-contents]");
  const setContents = (open) => {
    contents.hidden = !open;
    tocButton.setAttribute("aria-expanded", String(open));
  };
  tocButton.addEventListener("click", () => setContents(contents.hidden));
  document.addEventListener("click", (event) => {
    if (!contents.hidden && !contents.contains(event.target) && !tocButton.contains(event.target)) setContents(false);
  });
  reader.querySelectorAll("[data-book-goto]").forEach((button) => {
    button.addEventListener("click", () => {
      setContents(false);
      goToPage(Number(button.dataset.bookGoto));
    });
  });

  // One large page or two pages side by side, on a wide screen.
  $("[data-book-view]")?.addEventListener("click", () => {
    two = !two;
    try { localStorage.setItem(viewKey, two ? "two" : "one"); } catch { /* storage unavailable */ }
    build();
    // The book changes size: bring it back into view, the large page from its top.
    const box = book.getBoundingClientRect();
    if (box.top < 0 || box.bottom > innerHeight) book.scrollIntoView({ behavior: calm.matches ? "auto" : "smooth", block: large ? "start" : "center" });
  });

  // Full screen, where the browser allows it.
  const fullButton = $("[data-book-fullscreen]");
  if (document.fullscreenEnabled && reader.requestFullscreen) {
    fullButton.hidden = false;
    fullButton.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else reader.requestFullscreen().catch(() => {});
    });
    document.addEventListener("fullscreenchange", () => {
      reader.classList.toggle("is-fullscreen", document.fullscreenElement === reader);
    });
  }

  // Zoom: the pages in view, as wide as the screen allows, for the small print. The large page
  // images (srcset) keep the letters sharp at this size; a live page is scaled up, and its text can be selected.
  const zoomButton = $("[data-book-zoom]");
  let zoom = null;
  if (zoomButton && typeof HTMLDialogElement === "function") {
    zoom = document.createElement("dialog");
    zoom.className = "book-zoom";
    zoom.setAttribute("aria-label", zoomButton.dataset.label || zoomButton.textContent.trim());
    const close = document.createElement("button");
    close.type = "button";
    close.className = "book-zoom-close";
    close.setAttribute("aria-label", zoomButton.dataset.close || "Close");
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const list = document.createElement("div");
    list.className = live ? "book-zoom-pages mr" : "book-zoom-pages";
    zoom.append(close, list);
    if (live && "ResizeObserver" in window) new ResizeObserver(() => { const first = list.firstElementChild; if (first) fit(list, first.clientWidth); }).observe(list);
    reader.append(zoom);
    close.addEventListener("click", () => zoom.close());
    // A click beside the pages closes the view as well.
    zoom.addEventListener("click", (event) => {
      if (event.target === zoom || event.target === list) zoom.close();
    });
    zoom.addEventListener("close", () => {
      list.replaceChildren();
      zoomButton.focus();
    });
    zoomButton.hidden = false;
    zoomButton.addEventListener("click", () => {
      list.replaceChildren(...inView().map((page) => {
        if (live) {
          const copy = document.createElement("div");
          copy.className = "book-zoom-page";
          copy.append(page.querySelector(".pg").cloneNode(true));
          return copy;
        }
        const image = page.querySelector("img");
        if (!image) return null;
        const copy = image.cloneNode();
        copy.sizes = "min(calc(100vw - 32px), 1100px)";
        copy.loading = "eager";
        return copy;
      }).filter(Boolean));
      zoom.showModal();
      if (live && list.firstElementChild) fit(list, list.firstElementChild.clientWidth);
      zoom.scrollTop = 0;
    });
  }

  // The arrow keys turn pages while the book is on screen.
  let onScreen = false;
  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.15 }).observe(book);
  document.addEventListener("keydown", (event) => {
    if (!onScreen || zoom?.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;
    // A large page is read by scrolling, so there Page Up, Page Down, Home and End keep scrolling.
    const keys = large
      ? { ArrowRight: next, ArrowLeft: prev }
      : { ArrowRight: next, PageDown: next, ArrowLeft: prev, PageUp: prev, Home: () => turnTo(0), End: () => turnTo(sheets.length) };
    if (event.key === "Escape" && !contents.hidden) { setContents(false); tocButton.focus(); return; }
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  });

  // "Open the book": bring the book into view, then lift the cover.
  document.querySelectorAll("[data-book-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      reader.closest("#reader")?.scrollIntoView({ behavior: calm.matches ? "auto" : "smooth" });
      if (turned === 0) setTimeout(next, calm.matches ? 0 : 650);
    });
  });
  document.querySelectorAll("[data-book-text]").forEach((link) => {
    link.addEventListener("click", () => { document.querySelector("[data-book-details]")?.setAttribute("open", ""); });
  });

  // Start where the link points (#faqe-12), else on the cover, offering to
  // continue where the reader stopped last time.
  const linked = Number(location.hash.match(/^#faqe-(\d+)$/)?.[1]);
  let saved = 0;
  try { saved = Number(localStorage.getItem(storageKey)) || 0; } catch { /* storage unavailable */ }

  build();
  reader.classList.add("is-ready");
  $("[data-book-controls]").hidden = false;
  $("[data-book-hint]").hidden = false;
  if (linked) {
    turned = turnsFor(linked);
    sheets.forEach((sheet) => { sheet.turned = sheet.shown = sheet.index < turned; });
    render();
    requestAnimationFrame(() => reader.closest("#reader")?.scrollIntoView());
  } else if (saved > 2 && saved <= total) {
    const resume = $("[data-book-resume]");
    resume.textContent = fill(labels.resume, { n: saved });
    resume.hidden = false;
    resume.addEventListener("click", () => goToPage(saved), { once: true });
  }
  wide.addEventListener("change", build);
})();
