// "My shelf": what a reader keeps in this browser, with no account (localStorage, nothing is sent):
// - the essays, tools and pages saved for later (the bookmark in the header of an essay and in the share planet
//   of every page; "sc-shelf");
// - the state of the checklist at the end of an essay, ticked off or filled in, so the reader can come back to it
//   ("sc-checklists"; restored when the essay opens again);
// - what was read, which article.js keeps already ("sc-reading").
// The Shelf page (pages/shelf.njk, [data-shelf-page]) draws the three from the browser and the page's catalogue
// of essays and tools. "Save all my work" (work-backup.js) takes every "sc-" key to another device, these too.
window.Shelf = (() => {
  const KEY = "sc-shelf";
  const CARDS = "sc-checklists";
  const storage = (() => { try { const s = window.localStorage; s.length; return s; } catch { return null; } })();
  const read = (key, fallback) => { try { return JSON.parse(storage?.getItem(key) || "null") ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { storage?.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };

  // The saved items, newest first. Only pages of this site: an address from a file opened in "All your work in one
  // file" that leads elsewhere (another site, a script) is not shown.
  const ownPage = (url) => /^\/(?!\/)/.test(url);
  const items = () => {
    const data = read(KEY, { v: 1, items: [] });
    return Array.isArray(data.items) ? data.items.filter((i) => i && typeof i.u === "string" && ownPage(i.u)) : [];
  };
  const saveItems = (list) => write(KEY, { v: 1, items: list });
  const has = (url) => items().some((i) => i.u === url);
  const kindOf = (url) => {
    const path = String(url).replace(/^\/(de|sq)(?=\/)/, "");
    if (path.startsWith("/insights/")) return "essay";
    if (path.startsWith("/reflections/")) return "reflection";
    if (path.startsWith("/tools/")) return "tool";
    if (path.startsWith("/roles/")) return "role";
    if (path.startsWith("/magazine/")) return "publication";
    return "page";
  };
  const add = (entry) => {
    const list = items().filter((i) => i.u !== entry.u);
    list.unshift({ u: entry.u, t: entry.t || entry.u, k: entry.k || kindOf(entry.u), l: entry.l || document.documentElement.lang || "en", at: Date.now() });
    return saveItems(list);
  };
  const remove = (url) => saveItems(items().filter((i) => i.u !== url));
  const count = () => items().length;

  // The header badge on every page.
  const badge = () => {
    document.querySelectorAll("[data-shelf-count]").forEach((el) => {
      const n = count();
      el.textContent = String(n);
      el.hidden = n === 0;
    });
  };

  // The bookmark buttons of this page: the essay's and the one in the share planet.
  const pageUrl = () => location.pathname;
  const pageTitle = () => document.querySelector("[data-share-orbit]")?.dataset.title || document.querySelector("[data-article]")?.dataset.essayTitle || document.title.replace(/\s*\|.*$/, "");
  const paint = () => {
    const saved = has(pageUrl());
    document.querySelectorAll("[data-shelf-save]").forEach((button) => {
      button.setAttribute("aria-pressed", String(saved));
      button.classList.toggle("is-saved", saved);
      const label = button.querySelector("[data-shelf-label]") || button;
      label.textContent = saved ? (button.dataset.savedLabel || "Saved") : (button.dataset.saveLabel || "Save");
    });
  };
  const toggle = () => {
    const url = pageUrl();
    if (has(url)) remove(url); else add({ u: url, t: pageTitle(), k: kindOf(url) });
    paint();
    badge();
  };
  const bind = () => {
    const buttons = document.querySelectorAll("[data-shelf-save]");
    if (!buttons.length) return;
    if (!storage) { buttons.forEach((b) => { b.disabled = true; }); return; }
    buttons.forEach((b) => b.addEventListener("click", toggle));
    paint();
  };

  // The checklist of an essay keeps its state: ticks and answers, with what the Shelf page needs to list it.
  const cards = () => read(CARDS, {});
  const cardKey = (box) => `${document.querySelector("[data-article]")?.dataset.essayId || "essay"}@${box.dataset.lang || document.documentElement.lang || "en"}`;
  const persistChecklist = (box) => {
    if (!storage) return;
    const fields = [...box.querySelectorAll("[data-checklist-item]")];
    if (!fields.length) return;
    const key = cardKey(box);
    const all = cards();
    const kept = all[key];
    if (kept && Array.isArray(kept.v)) {
      fields.forEach((field, i) => {
        if (kept.v[i] === undefined) return;
        if (field.type === "checkbox") field.checked = Boolean(kept.v[i]);
        else field.value = String(kept.v[i]);
        field.dispatchEvent(new Event(field.type === "checkbox" ? "change" : "input", { bubbles: true }));
      });
    }
    const store = () => {
      const v = fields.map((f) => (f.type === "checkbox" ? f.checked : f.value));
      const done = v.filter((x) => (typeof x === "boolean" ? x : String(x).trim() !== "")).length;
      const next = cards();
      if (!done) delete next[key];
      else next[key] = { u: location.pathname, t: pageTitle(), c: box.querySelector(".kicker")?.textContent.trim() || "", v, n: fields.length, d: done, at: Date.now() };
      write(CARDS, next);
    };
    fields.forEach((f) => f.addEventListener(f.type === "checkbox" ? "change" : "input", store));
    box.querySelector("[data-checklist-clear]")?.addEventListener("click", () => setTimeout(store, 0));
  };

  // The Shelf page.
  const render = (root) => {
    const labels = JSON.parse(root.dataset.labels || "{}");
    const lang = root.dataset.lang || "en";
    const catalogue = (() => { try { return JSON.parse(root.querySelector("[data-shelf-catalogue]")?.textContent || "[]"); } catch { return []; } })();
    const bySlug = Object.fromEntries(catalogue.map((c) => [c.s, c]));
    const fill = (t, vars) => String(t || "").replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
    const kindLabel = (k) => labels.kinds?.[k] || k;
    const row = ({ url, title, meta, action, progress }) => {
      const li = el("li", "shelf-row");
      const link = el("a", "shelf-row-link"); link.href = url;
      link.append(el("strong", "", title));
      if (meta) link.append(el("span", "shelf-row-meta", meta));
      // How far an essay was read, as a thin line under it that fills up (styles.css: .has-progress).
      if (progress !== undefined) { link.classList.add("has-progress"); link.style.setProperty("--p", Math.min(Math.max(progress, 0), 1)); }
      li.append(link);
      if (action) li.append(action);
      return li;
    };
    const section = (name, list, empty) => {
      const box = root.querySelector(`[data-shelf-${name}]`);
      if (!box) return;
      const ul = box.querySelector("ul");
      const note = box.querySelector(".shelf-empty");
      ul.replaceChildren(...list);
      // The first time the shelf is drawn its rows come in one after another (styles.css: .is-entering).
      if (!drawn) list.forEach((li, i) => { li.classList.add("is-entering"); li.style.setProperty("--i", Math.min(i, 12)); });
      if (note) note.hidden = list.length > 0;
      if (note && !list.length) note.textContent = empty;
    };
    let drawn = false;
    const draw = () => {
      // Saved for later, this language's pages first.
      const saved = items().sort((a, b) => (a.l === lang ? 0 : 1) - (b.l === lang ? 0 : 1) || b.at - a.at).map((item) => {
        const button = el("button", "shelf-remove", labels.remove || "Remove");
        button.type = "button";
        button.addEventListener("click", () => {
          remove(item.u); badge();
          // The row slides away first, then the shelf is drawn again; at once when motion is reduced.
          const li = button.closest("li");
          if (!li || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { draw(); return; }
          li.classList.add("is-leaving");
          setTimeout(draw, 320);
        });
        return row({ url: item.u, title: item.t, meta: [kindLabel(item.k), item.l !== lang ? item.l.toUpperCase() : ""].filter(Boolean).join(" · "), action: button });
      });
      section("saved", saved, labels.noSaved);
      // Cards in progress.
      const inProgress = Object.values(cards()).filter((c) => c && typeof c.u === "string" && ownPage(c.u)).sort((a, b) => b.at - a.at).map((c) =>
        row({ url: `${c.u}#essay-checklist-title`, title: c.c || c.t, meta: `${c.t} · ${fill(labels.done, { a: c.d, b: c.n })}` }));
      section("cards", inProgress, labels.noCards);
      // Reading: begun and not finished, with how far, then finished.
      const reading = read("sc-reading", {});
      const entries = Object.entries(reading).filter(([slug]) => bySlug[slug]).sort((a, b) => (b[1].t || 0) - (a[1].t || 0));
      const started = entries.filter(([, r]) => !r.done).map(([slug, r]) => row({ url: bySlug[slug].u, title: bySlug[slug].t, meta: `${kindLabel(bySlug[slug].k)} · ${fill(labels.percent, { p: Math.round((r.p || 0) * 100) })}`, progress: r.p || 0 }));
      const finished = entries.filter(([, r]) => r.done).map(([slug]) => row({ url: bySlug[slug].u, title: bySlug[slug].t, meta: kindLabel(bySlug[slug].k) }));
      section("started", started, labels.noReading);
      section("finished", finished, labels.noReading);
      const total = saved.length + inProgress.length + entries.length;
      root.querySelectorAll("[data-shelf-clear]").forEach((b) => { b.hidden = total === 0; });
      drawn = true;
    };
    root.querySelectorAll("[data-shelf-clear]").forEach((b) => b.addEventListener("click", () => {
      if (!window.confirm(labels.confirmClear || "Clear the shelf?")) return;
      saveItems([]); write(CARDS, {});
      badge(); draw();
    }));
    if (!storage) { root.querySelectorAll("[data-shelf-blocked]").forEach((n) => { n.hidden = false; }); }
    draw();
  };

  badge();
  bind();
  document.querySelectorAll("[data-essay-checklist]").forEach(persistChecklist);
  const page = document.querySelector("[data-shelf-page]");
  if (page) render(page);

  return { KEY, CARDS, items, has, add, remove, count, kindOf, toggle, cards, render };
})();
