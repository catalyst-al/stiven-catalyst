// What every issue of the monthly Management Review shares: the languages, the way a text is written once in all
// three of them, x(en, sq, de), the six blocks the topics belong to, and the labels of the printed pages and the
// reader. src/_data/weekly.js puts the issues together; docs/revista/management-review-javor.md has the plan.
export const langs = ["en", "sq", "de"];
export const x = (en, sq, de) => ({ en, sq, de });
// "31%" in English and Albanian, "31 %" in German.
export const pc = (n) => x(`${n}%`, `${n}%`, `${n} %`);

const isText = (value) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 3 && langs.every((lang) => lang in value);
export const resolve = (value, lang) => {
  if (isText(value)) return value[lang];
  if (Array.isArray(value)) return value.map((item) => resolve(item, lang));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, lang)]));
  return value;
};

export const blocks = {
  role: x("Role", "Roli", "Rolle"),
  kpi: x("KPIs", "KPI", "KPIs"),
  strategy: x("Strategy", "Strategjia", "Strategie"),
  people: x("People", "Njerëzit", "Menschen"),
  operations: x("Operations", "Operacioni", "Betrieb"),
  ai: x("AI", "AI", "KI"),
};

export const common = {
  name: "Management Review",
  tagline: x("Management without theatre.", "Menaxhim pa teatër.", "Management ohne Theater."),
  cover: { src: "/media/magazine/management-review-2026-09/art/bulb.jpg", width: 350, height: 700 },
  labels: {
    edition: x("Monthly edition", "Botimi mujor", "Monatsausgabe"),
    no: x("No.", "Nr.", "Nr."),
    inside: x("Inside", "Brenda", "In dieser Ausgabe"),
    page: x("Page", "Faqe", "Seite"),
    source: x("Source", "Burimi", "Quelle"),
    sources: x("Sources", "Burimet", "Quellen"),
    via: x("via", "përmes", "über"),
    more: x("More in the essay", "Më shumë te eseja", "Mehr im Essay"),
    open: x("Open the tool", "Hape mjetin", "Tool öffnen"),
    reading: x("Our reading", "Leximi ynë", "Unsere Lesart"),
    editor: x("Editor", "Redaktor", "Herausgeber"),
    all: x("All issues", "Të gjithë numrat", "Alle Ausgaben"),
    open_issue: x("Open the issue", "Hape numrin", "Ausgabe öffnen"),
    open_no: x("Open No. {n}", "Hape numrin {n}", "Nr. {n} öffnen"),
    read_text: x("Read the issue as text", "Lexoje numrin si tekst", "Die Ausgabe als Text lesen"),
    page_by_page: x("The issue, page by page", "Numri, faqe pas faqeje", "Die Ausgabe, Seite für Seite"),
    glance: x("The figures of the issue", "Shifrat e numrit", "Die Zahlen der Ausgabe"),
    glance_note: x("The charts of the printed pages, with their sources.", "Grafikët e faqeve të printuara, me burimet e tyre.", "Die Grafiken der gedruckten Seiten, mit ihren Quellen."),
    special: x("Special edition", "Botim special", "Sonderausgabe"),
    issues: x("Issues", "Numra", "Ausgaben"),
    blocks: x("Topics", "Tema", "Themen"),
  },
  // On the contents page: how the issue keeps figures, interpretation and practice apart.
  legend: [
    { h: x("Figure", "Shifra", "Zahl"), p: x("Every figure has its source and year at the foot of its page.", "Çdo shifër ka burimin dhe vitin poshtë faqes së vet.", "Jede Zahl hat Quelle und Jahr unten auf ihrer Seite.") },
    { h: x("Our reading", "Leximi ynë", "Unsere Lesart"), p: x("Where the editors interpret rather than the research, it says so.", "Ku flet redaksia dhe jo kërkimi, shkruhet qartë.", "Wo die Redaktion deutet und nicht die Forschung, steht es dabei.") },
    { h: x("Practice", "Praktika", "Praxis"), p: x("The steps and the card are proposals to try, not research results.", "Hapat dhe karta janë propozime për t'u provuar, jo rezultate kërkimi.", "Schritte und Karte sind Vorschläge zum Ausprobieren, keine Forschungsergebnisse.") },
  ],
  intro: {
    title: x("In this issue", "Në këtë numër", "In dieser Ausgabe"),
    how: x("How to read this issue", "Si lexohet ky numër", "So lesen Sie diese Ausgabe"),
  },
  sourcesPage: {
    kicker: x("Sources and method", "Burimet dhe metoda", "Quellen und Methode"),
    title: [x("Every figure", "Çdo shifër", "Jede Zahl"), x("has a source.", "ka një burim.", "hat eine Quelle.")],
    lead: x("The figures in this issue come from the sources below. The year shows how recent each one is.", "Shifrat e këtij numri vijnë nga burimet më poshtë. Viti tregon sa e re është secila.", "Die Zahlen dieser Ausgabe stammen aus den folgenden Quellen. Das Jahr zeigt, wie aktuell jede ist."),
    method: x("Editorial method", "Metoda editoriale", "Redaktionelle Methode"),
    methodText: x(
      "Each figure was checked for its year, its publisher and what exactly it measures. Where the publisher's page could not be opened, the figure was checked against independent summaries and is marked “via”. The editors' interpretation is marked “Our reading”. Figures that could not be confirmed are not in the issue.",
      "Çdo shifër u kontrollua për vitin, botuesin dhe çfarë mat saktësisht. Kur faqja e botuesit nuk hapej, shifra u kontrollua te përmbledhje të pavarura dhe shënohet me “përmes”. Interpretimi i redaksisë shënohet “Leximi ynë”. Shifrat që nuk u konfirmuan nuk janë në numër.",
      "Jede Zahl wurde auf Jahr, Herausgeber und genaue Bedeutung geprüft. Wo die Seite des Herausgebers nicht erreichbar war, wurde sie an unabhängigen Zusammenfassungen geprüft und mit „über“ markiert. Die Deutung der Redaktion ist als „Unsere Lesart“ markiert. Zahlen, die sich nicht bestätigen ließen, stehen nicht in der Ausgabe."),
  },
  // The list of all issues (/magazine/management-review.html).
  archive: {
    eyebrow: x("The monthly edition", "Botimi mujor", "Die Monatsausgabe"),
    lede: x(
      "The monthly edition, in numbered issues: each one a management question checked against the best research, on the role, KPIs, strategy, people, operations and AI. Ten pages, with the sources, the charts and a tool to use on Monday.",
      "Botimi mujor, në numra: secili një pyetje e menaxhimit e kontrolluar me kërkimet më të mira, për rolin, KPI-të, strategjinë, njerëzit, operacionin dhe AI-në. Dhjetë faqe, me burimet, grafikët dhe një mjet për ta përdorur të hënën.",
      "Die Monatsausgabe, in nummerierten Heften: jedes eine Führungsfrage, geprüft an der besten Forschung, zur Rolle, zu KPIs, Strategie, Menschen, Betrieb und KI. Zehn Seiten, mit den Quellen, den Grafiken und einem Werkzeug für den Montag."),
    seo: x(
      "Management Review, the monthly edition: numbered issues, each one management question checked against the best research, with charts, sources and a tool.",
      "Management Review, botimi mujor: numra të veçantë, secili një pyetje e menaxhimit e kontrolluar me kërkimet më të mira, me grafikë, burime dhe një mjet.",
      "Management Review, die Monatsausgabe: nummerierte Hefte, jedes eine Führungsfrage, geprüft an der besten Forschung, mit Grafiken, Quellen und einem Werkzeug."),
    all: x("All topics", "Të gjitha temat", "Alle Themen"),
    special: x("Before the monthly edition, one special edition on the manager in the age of AI.", "Para botimit mujor, një botim special për menaxherin në epokën e AI-së.", "Vor der Monatsausgabe: eine Sonderausgabe über die Führungskraft im Zeitalter der KI."),
  },
  back: {
    line: x("Every issue, one management question, checked against the best research.", "Çdo numër, një pyetje e menaxhimit, e kontrolluar me kërkimet më të mira.", "Jede Ausgabe eine Führungsfrage, geprüft an der besten Forschung."),
    all: x("All issues", "Të gjithë numrat", "Alle Ausgaben"),
  },
};
