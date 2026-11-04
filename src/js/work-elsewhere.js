// Work kept in another language (audit P2B-19). Each language keeps its own copy of a tool's work (sc-fmea, sc-fmea-de,
// sc-fmea-sq), because the names in it are that language's words. A visitor who saved work on the German page and opens
// the English one would find the tool empty and think the work lost. When this language holds no work of the visitor's
// own and another language does, a note under the title says where it is, with a link to that page.
// The tool's English key comes from the page (src/_data/workKeys.js), which leaves out the log tools (tool-kit.js
// logBook): they say the same in their own log. An example counts as no work, in every way the tools mark one: example: true on
// the state or on a row, the id of the example (a string or a list of them), the signature of a whole example (a
// string that is no item's id), or the stamp { on: true }. A form the visitor filled from an example and kept (Shift
// Handover) is the visitor's.
(() => {
  const data = document.getElementById("work-elsewhere-data");
  if (!data) return;
  let key = "";
  try { key = JSON.parse(data.textContent).key || ""; } catch { return; }
  if (!key) return;
  const LANG = ["de", "sq"].includes(document.documentElement.lang) ? document.documentElement.lang : "en";
  const NAMES = { en: "English", de: "Deutsch", sq: "Shqip" };
  const strings = window.UiStrings || {};
  const tx = (text, vars = {}) => (strings[text] ?? text).replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const keyOf = (code) => (code === "en" ? key : `${key}-${code}`);

  // Whether a saved state holds work of the visitor's own.
  const hasText = (value) => (typeof value === "string" ? value.trim() !== ""
    : Array.isArray(value) ? value.some(hasText)
      : isObject(value) ? Object.entries(value).some(([name, inner]) => name !== "example" && hasText(inner)) : false);
  const ownWork = (state) => {
    if (!isObject(state) || state.example === true || (isObject(state.example) && state.example.on === true && !hasOwnRows(state))) return false;
    const exampleIds = new Set([].concat(typeof state.example === "string" || Array.isArray(state.example) ? state.example : []).filter(Boolean));
    const items = Object.values(state).filter(Array.isArray).flat().filter(isObject);
    // A text that is no item's id is the signature of a whole example (Kanban Sizing): the state is that example.
    if (typeof state.example === "string" && state.example && !items.some((item) => item.id === state.example)) return false;
    if (items.length) return items.some((item) => item.example !== true && !exampleIds.has(item.id));
    return hasText(state);
  };
  // A log stamped as an example may already hold rows of the visitor's own beside it.
  const hasOwnRows = (state) => Object.values(state).filter(Array.isArray).flat().some((item) => isObject(item) && item.example !== true);
  const read = (name) => {
    try { return JSON.parse(localStorage.getItem(name)); } catch { return null; }
  };

  if (ownWork(read(keyOf(LANG)))) return;
  const path = window.location.pathname.replace(/^\/(de|sq)(?=\/)/, "");
  const others = Object.keys(NAMES).filter((code) => code !== LANG && ownWork(read(keyOf(code))));
  if (!others.length) return;

  const note = document.createElement("p");
  note.className = "form-note work-elsewhere";
  note.setAttribute("role", "status");
  note.append(`${tx("Your work in this tool is kept on the page in another language: each language keeps its own copy.")} `);
  others.forEach((code, index) => {
    const link = document.createElement("a");
    link.className = "inline-link";
    link.href = code === "en" ? path : `/${code}${path}`;
    link.hreflang = code;
    link.lang = code;
    link.textContent = tx("Open it in {language}", { language: NAMES[code] });
    note.append(index ? " · " : "", link);
  });
  const hero = document.querySelector(".tool-hero");
  if (hero) hero.append(note);
  else document.querySelector("main")?.prepend(note);
})();
