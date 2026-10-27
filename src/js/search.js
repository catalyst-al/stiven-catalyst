// The Search page (pages/search.njk): reads this language's index once and searches it in the browser as the
// reader types. Words are matched without case or accents ("eshte" finds "është", "ceshtje" finds "çështje"), and
// "ä", "ö", "ü" as the ATS CV matcher reads them: "fuehrung" and "fuhrung" both find "Führung". Every word must
// appear, and titles count more than summaries, summaries more than the text. A word of one letter, or one written
// with signs ("C#", "C++"), is looked for as a whole word, as written. The count says how many pages were found; the
// first 30 are listed. The question is kept in the address (?q=), so a search can be shared or reloaded. Nothing is
// sent anywhere.
(() => {
  const root = document.querySelector("[data-search]");
  if (!root) return;
  const input = root.querySelector("[data-search-input]");
  const list = root.querySelector("[data-search-results]");
  const count = root.querySelector("[data-search-count]");
  let kinds = {};
  try { kinds = JSON.parse(root.dataset.kinds || "{}"); } catch { /* the kind stays unnamed */ }
  const SHOWN = 30;

  // Lower case without accents, character by character, with where each character came from in the original,
  // so a match in the folded text can be marked in the original one. Two ways, as people write German without its
  // letters: "ä", "ö", "ü" as "ae", "oe", "ue" (way 0) or as "a", "o", "u" (way 1). "ß" is "ss" both ways, and
  // "ë", "ç", "é" and the rest lose their marks. Texts are first put in one form (NFC), so a "ü" typed as "u" and
  // two dots is one letter.
  const UMLAUT = { ä: ["ae", "a"], ö: ["oe", "o"], ü: ["ue", "u"] };
  const fold = (text, way) => {
    let out = "";
    const from = [];
    for (let i = 0; i < text.length; i++) {
      const lower = text[i].toLowerCase();
      const folded = UMLAUT[lower]?.[way] ?? lower.normalize("NFD").replace(/\p{M}/gu, "").replace("ß", "ss");
      for (const ch of folded) { out += ch; from.push(i); }
    }
    return { text: out, from };
  };
  const both = (text) => [fold(text, 0).text, fold(text, 1).text];

  // The terms of a question: { forms: [way 0, way 1], whole }. A word of two letters or more is found anywhere
  // ("führung" in "Personalführung"); a token with no such word ("C#", "R", "C++") is found as a whole word.
  const SIGNS = /^[^\p{L}\p{N}#+]+|[^\p{L}\p{N}#+]+$/gu;
  const termsOf = (query) => {
    const out = [];
    for (const token of query.normalize("NFC").split(/\s+/).filter(Boolean)) {
      const [a, b] = both(token);
      const partsB = b.split(/[^\p{L}\p{N}]+/u);
      const words = a.split(/[^\p{L}\p{N}]+/u).map((part, i) => [part, partsB[i]]).filter(([part]) => part.length > 1);
      if (words.length) words.forEach((forms) => out.push({ forms, whole: false }));
      else {
        const forms = [a.replace(SIGNS, ""), b.replace(SIGNS, "")];
        if (forms[0]) out.push({ forms, whole: true });
      }
    }
    return out;
  };
  const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Where a term stands in a text folded one way, as [start, end) pairs; only the first one when first is set.
  const places = (folded, term, way, first = false) => {
    const form = term.forms[way];
    const out = [];
    if (!term.whole) {
      for (let at = folded.indexOf(form); at >= 0; at = folded.indexOf(form, at + form.length)) {
        out.push([at, at + form.length]);
        if (first) break;
      }
      return out;
    }
    term.patterns ||= term.forms.map((f) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(f)}(?![\\p{L}\\p{N}])`, "gu"));
    const re = term.patterns[way];
    re.lastIndex = 0;
    for (let m = re.exec(folded); m; m = re.exec(folded)) {
      out.push([m.index, m.index + m[0].length]);
      if (first) break;
    }
    return out;
  };
  // Whether a text, folded both ways, holds the term either way.
  const has = (folded, term) => [0, 1].some((way) => places(folded[way], term, way, true).length > 0);

  let index = null;
  const load = () => index || (index = fetch(root.dataset.index)
    .then((response) => response.json())
    .then((items) => items.map((item) => ({ ...item, ft: both((item.t || "").normalize("NFC")), fs: both((item.s || "").normalize("NFC")), fb: both((item.b || "").normalize("NFC")) })))
    .catch(() => []));

  const score = (item, terms) => {
    let total = 0;
    for (const term of terms) {
      const inTitle = has(item.ft, term);
      const inSummary = has(item.fs, term);
      const inBody = has(item.fb, term);
      if (!inTitle && !inSummary && !inBody) return 0;
      total += (inTitle ? 10 : 0) + (inSummary ? 4 : 0) + (inBody ? 1 : 0);
    }
    return total;
  };

  // A piece of the original text around the first match, with the matched words marked.
  const snippet = (raw, terms, length = 180) => {
    const text = raw.normalize("NFC");
    const ways = [fold(text, 0), fold(text, 1)];
    const marks = terms.flatMap((term) => [0, 1].flatMap((way) => places(ways[way].text, term, way)
      .map(([a, b]) => [ways[way].from[a], ways[way].from[b - 1] + 1])));
    let start = 0;
    const first = Math.min(...marks.map(([a]) => a));
    if (Number.isFinite(first) && first > length / 2) start = text.lastIndexOf(" ", first - length / 3) + 1;
    const end = Math.min(text.length, start + length);
    marks.sort((x, y) => x[0] - y[0]);
    const fragment = document.createDocumentFragment();
    if (start > 0) fragment.append("… ");
    let at = start;
    for (const [a, b] of marks) {
      if (a < at || b > end) continue;
      fragment.append(text.slice(at, a));
      const mark = document.createElement("mark");
      mark.textContent = text.slice(a, b);
      fragment.append(mark);
      at = b;
    }
    fragment.append(text.slice(at, end));
    if (end < text.length) fragment.append(" …");
    return fragment;
  };

  // More pages than are listed: "The first 30 of 136 results".
  const say = (n) => {
    const some = root.dataset.someLabel;
    count.textContent = n === 0 ? root.dataset.noneLabel : n === 1 ? root.dataset.oneLabel
      : n > SHOWN && some ? some.replace("{shown}", SHOWN).replace("{n}", n) : root.dataset.countLabel.replace("{n}", n);
  };

  const render = async () => {
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    list.replaceChildren();
    if (!query) { count.textContent = ""; return; }
    // Only signs ("?!"): there is nothing to look for, and the page says so.
    const terms = termsOf(query);
    if (!terms.length) { say(0); return; }
    const items = await load();
    if (input.value.trim() !== query) return;
    const found = items
      .map((item) => ({ item, points: score(item, terms) }))
      .filter((hit) => hit.points > 0)
      .sort((a, b) => b.points - a.points);
    say(found.length);
    for (const { item } of found.slice(0, SHOWN)) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.u;
      const kind = document.createElement("span");
      kind.className = "search-kind";
      kind.textContent = kinds[item.k] || item.k;
      const title = document.createElement("strong");
      title.append(snippet(item.t, terms, 400));
      link.append(kind, title);
      const text = item.s && terms.some((term) => has(item.fs, term)) ? item.s : item.b && terms.some((term) => has(item.fb, term)) ? item.b : item.s;
      if (text) {
        const p = document.createElement("p");
        p.append(snippet(text, terms));
        link.append(p);
      }
      li.append(link);
      // The results come in one after another (styles.css: .is-entering).
      li.className = "is-entering";
      li.style.setProperty("--i", Math.min(list.children.length, 12));
      list.append(li);
    }
  };

  let timer;
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(render, 120); });
  root.querySelector("form").addEventListener("submit", (event) => { event.preventDefault(); render(); });
  const asked = new URL(location.href).searchParams.get("q");
  if (asked) { input.value = asked; render(); }
  input.focus({ preventScroll: true });
})();
