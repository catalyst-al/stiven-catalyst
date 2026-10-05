// The Search page (pages/search.njk): reads this language's index once and searches it in the browser as the
// reader types. Words are matched without case or accents ("eshte" finds "është", "fuhrung" finds "Führung"), every
// word must appear, and titles count more than summaries, summaries more than the text. The question is kept in
// the address (?q=), so a search can be shared or reloaded. Nothing is sent anywhere.
(() => {
  const root = document.querySelector("[data-search]");
  if (!root) return;
  const input = root.querySelector("[data-search-input]");
  const list = root.querySelector("[data-search-results]");
  const count = root.querySelector("[data-search-count]");
  let kinds = {};
  try { kinds = JSON.parse(root.dataset.kinds || "{}"); } catch { /* the kind stays unnamed */ }

  // Lower case without accents, character by character, with where each character came from in the original,
  // so a match in the folded text can be marked in the original one.
  const fold = (text) => {
    let out = "";
    const from = [];
    for (let i = 0; i < text.length; i++) {
      const folded = text[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace("ß", "ss");
      for (const ch of folded) { out += ch; from.push(i); }
    }
    return { text: out, from };
  };
  const words = (query) => fold(query).text.split(/[^\p{L}\p{N}]+/u).filter((word) => word.length > 1);

  let index = null;
  const load = () => index || (index = fetch(root.dataset.index)
    .then((response) => response.json())
    .then((items) => items.map((item) => ({ ...item, ft: fold(item.t).text, fs: fold(item.s).text, fb: fold(item.b).text })))
    .catch(() => []));

  const score = (item, terms) => {
    let total = 0;
    for (const term of terms) {
      const inTitle = item.ft.includes(term);
      const inSummary = item.fs.includes(term);
      const inBody = item.fb.includes(term);
      if (!inTitle && !inSummary && !inBody) return 0;
      total += (inTitle ? 10 : 0) + (inSummary ? 4 : 0) + (inBody ? 1 : 0);
    }
    return total;
  };

  // A piece of the original text around the first match, with the matched words marked.
  const snippet = (text, terms, length = 180) => {
    const { text: folded, from } = fold(text);
    let start = 0;
    const first = Math.min(...terms.map((term) => folded.indexOf(term)).filter((at) => at >= 0));
    if (Number.isFinite(first) && from[first] > length / 2) start = text.lastIndexOf(" ", from[first] - length / 3) + 1;
    const end = Math.min(text.length, start + length);
    const marks = [];
    for (const term of terms) {
      for (let at = folded.indexOf(term); at >= 0; at = folded.indexOf(term, at + term.length)) {
        const a = from[at];
        const b = from[at + term.length - 1] + 1;
        if (a >= start && b <= end) marks.push([a, b]);
      }
    }
    marks.sort((x, y) => x[0] - y[0]);
    const fragment = document.createDocumentFragment();
    if (start > 0) fragment.append("… ");
    let at = start;
    for (const [a, b] of marks) {
      if (a < at) continue;
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

  const say = (n) => {
    count.textContent = n === 0 ? root.dataset.noneLabel : n === 1 ? root.dataset.oneLabel : root.dataset.countLabel.replace("{n}", n);
  };

  const render = async () => {
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query); else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    list.replaceChildren();
    const terms = words(query);
    if (!terms.length) { count.textContent = ""; return; }
    const items = await load();
    if (input.value.trim() !== query) return;
    const found = items
      .map((item) => ({ item, points: score(item, terms) }))
      .filter((hit) => hit.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 30);
    say(found.length);
    for (const { item } of found) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.u;
      const kind = document.createElement("span");
      kind.className = "search-kind";
      kind.textContent = kinds[item.k] || item.k;
      const title = document.createElement("strong");
      title.append(snippet(item.t, terms, 400));
      link.append(kind, title);
      const text = item.fs && terms.some((term) => item.fs.includes(term)) ? item.s : item.fb && terms.some((term) => item.fb.includes(term)) ? item.b : item.s;
      if (text) {
        const p = document.createElement("p");
        p.append(snippet(text, terms));
        link.append(p);
      }
      li.append(link);
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
