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

// A title written in two parts for the two lines of a page heading, as one line (contents, page title, lists). A
// part that ends in a hyphen was broken for the line: German joins "Die Anerkennungs-" and "karte" into
// "Die Anerkennungskarte" and keeps the hyphen before a capital ("Die KI-Aufgabenkarte"); English keeps it
// ("voice-of-the-customer card").
export const joinTitle = (parts, lang) =>
  parts.reduce((line, part) => {
    if (!line) return part;
    if (!line.endsWith("-")) return `${line} ${part}`;
    return lang === "de" && /^\p{Ll}/u.test(part) ? `${line.slice(0, -1)}${part}` : `${line}${part}`;
  }, "");

export const blocks = {
  role: x("Role", "Roli", "Rolle"),
  kpi: x("KPIs", "KPI", "KPIs"),
  strategy: x("Strategy", "Strategjia", "Strategie"),
  people: x("People", "Njerëzit", "Menschen"),
  operations: x("Operations", "Operacioni", "Betrieb"),
  ai: x("AI", "AI", "KI"),
};

// The Management Review comes in series of 40 issues: issues 1–40 are the first series, 41–80 the second (both online
// between 8 and 11 October 2026), 81–120 the third. Each issue carries the month it went online as its date
// (lib/weekly/issues/NN.js), never a later one (tests/publication-dates.test.cjs), and the name of its series as its
// label; the day it went online is in src/_data/online.json (scripts/online-dates.mjs). Until 27 October 2026 issues
// 41–80 carried "November 2026", the month of the edition they had been planned for (archive.datesNote).
export const SERIES_SIZE = 40;
export const seriesOf = (number) => Math.ceil(number / SERIES_SIZE);

export const common = {
  name: "Management Review",
  tagline: x("Management without theatre.", "Menaxhim pa teatër.", "Management ohne Theater."),
  cover: { src: "/media/magazine/management-review-2026-09/art/bulb.jpg", width: 350, height: 700 },
  // The masthead of the cover and the back, its second word in red, and the list of all issues.
  mast: ["Management", "Review"],
  archiveUrl: "/magazine/management-review.html",
  labels: {
    edition: x("Monthly edition", "Botimi mujor", "Monatsausgabe"),
    // The name of each series, in order: series(1) is the first.
    series: [
      x("First series", "Seria e parë", "Erste Serie"),
      x("Second series", "Seria e dytë", "Zweite Serie"),
      x("Third series", "Seria e tretë", "Dritte Serie"),
      x("Fourth series", "Seria e katërt", "Vierte Serie"),
      x("Fifth series", "Seria e pestë", "Fünfte Serie"),
      x("Sixth series", "Seria e gjashtë", "Sechste Serie"),
    ],
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
    { h: x("Our reading", "Leximi ynë", "Unsere Lesart"), p: x("Where the editor interprets rather than the research, it says so.", "Ku flet redaktori dhe jo kërkimi, shkruhet qartë.", "Wo der Herausgeber deutet und nicht die Forschung, steht es dabei.") },
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
      "Each figure was checked for its year, its publisher and what it measures, in the full text where it could be opened. A source read only in a summary, an abstract or excerpts is marked “via”. A figure not confirmed in what was read is marked so on its page, or left out. The editor's interpretation is marked “Our reading”.",
      "Çdo shifër u kontrollua për vitin, botuesin dhe çfarë mat, te teksti i plotë kur u hap. Burimi i lexuar vetëm te një përmbledhje, një abstrakt ose copa shënohet me “përmes”. Shifra që nuk u konfirmua te ajo që u lexua shënohet si e tillë në faqen e vet, ose lihet jashtë. Interpretimi i redaktorit shënohet “Leximi ynë”.",
      "Jede Zahl wurde auf Jahr, Herausgeber und Bedeutung geprüft, am Volltext, wo er sich öffnen ließ. Eine nur in einer Zusammenfassung, einem Abstract oder Auszügen gelesene Quelle ist mit „über“ markiert. Eine Zahl, die sich im Gelesenen nicht bestätigen ließ, ist auf ihrer Seite so markiert oder fehlt. Die Deutung des Herausgebers ist als „Unsere Lesart“ markiert."),
  },
  // Who makes the publication and how: on the back cover of every Management Review issue, the special edition, From
  // the Floor and the treatise volumes (so in their PDFs and readers), and at the end of their text. The facts are
  // those of How this is made (/how-this-is-made.html), which also says that "the editors" of a publication means
  // its editor. url is the address of that page in each language, without https:// for the print.
  colophon: {
    text: x(
      "Edited by Stiven Janaqi, who answers for it; “the editors” in this publication means him. Its texts, translations, layout and the checking of figures against their sources are done in working sessions with Claude, an AI model by Anthropic.",
      "Redaktuar nga Stiven Janaqi, që përgjigjet për të; “redaksia” në këtë botim është ai. Tekstet, përkthimet, faqosja dhe kontrolli i shifrave te burimet e tyre bëhen në seanca pune me Claude, një model AI i Anthropic.",
      "Herausgegeben von Stiven Janaqi, der sie verantwortet; „die Redaktion“ ist in dieser Publikation er. Texte, Übersetzungen, Layout und die Prüfung der Zahlen an ihren Quellen entstehen in Arbeitssitzungen mit Claude, einem KI-Modell von Anthropic."),
    more: x("How this is made", "Si bëhet kjo faqe", "Wie diese Seite entsteht"),
    url: x("stivencatalyst.com/how-this-is-made.html", "stivencatalyst.com/sq/how-this-is-made.html", "stivencatalyst.com/de/how-this-is-made.html"),
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
    // How the series works, above the list. The facts are those of How this is made ("What the dates mean",
    // /how-this-is-made.html#dates), where the line links, and of src/_data/online.json.
    model: x("How the series works", "Si funksionon seria", "Wie die Reihe funktioniert"),
    modelText: x(
      "Numbered issues in series of 40, each dated by the month it went online. Issues 1 to 80, the first two series, went online between 8 and 11 October 2026; the page of each issue gives the day.",
      "Numra me radhë, në seri me nga 40, secili me datën e muajit kur doli online. Numrat 1 deri në 80, dy seritë e para, dolën online nga 8 deri më 11 tetor 2026; faqja e çdo numri jep ditën.",
      "Nummerierte Hefte in Reihen zu 40, jedes datiert mit dem Monat, in dem es online ging. Die Hefte 1 bis 80, die ersten beiden Reihen, gingen zwischen dem 8. und 11. Oktober 2026 online; die Seite jedes Hefts nennt den Tag."),
    // The dates corrected on 27 October 2026: what issues 41–80, From the Floor No. 2 and the special edition said
    // before, and when they went online (src/_data/online.json, from the history of main). Shown with the second
    // check under the lede and in the register.
    datesNote: {
      date: x("27 October 2026", "27 tetor 2026", "27. Oktober 2026"),
      t: x(
        "Until this date, issues 41 to 80 and From the Floor No. 2 were dated November 2026, the month of the edition they had been planned for, and the special edition was dated September 2026. They went online on 10 and 11 October, on 12 October and on 4 October 2026, and are now dated October 2026, the month they went online.",
        "Deri në këtë datë, numrat 41 deri në 80 dhe Nga terreni Nr. 2 mbanin datën nëntor 2026, muajin e botimit për të cilin ishin planifikuar, dhe botimi special mbante datën shtator 2026. Dolën online më 10 dhe 11 tetor, më 12 tetor dhe më 4 tetor 2026, dhe tani mbajnë datën tetor 2026, muajin kur dolën online.",
        "Bis zu diesem Datum trugen die Hefte 41 bis 80 und Aus der Praxis Nr. 2 das Datum November 2026, den Monat der Ausgabe, für die sie geplant waren, und die Sonderausgabe das Datum September 2026. Sie gingen am 10. und 11. Oktober, am 12. Oktober und am 4. Oktober 2026 online und tragen jetzt das Datum Oktober 2026, den Monat, in dem sie online gingen."),
    },
    // The corrections register at the foot of the list (#corrections): every correction to an issue or to the special
    // edition after it went online, the newest first (register in src/_data/weekly.js).
    register: {
      title: x("Corrections", "Korrigjimet", "Korrekturen"),
      lede: x(
        "Every correction made after publication, the newest first: its date, the issue and what changed. Each is also on the issue's page and, for a correction to one issue, on the sources page of its PDF.",
        "Çdo korrigjim i bërë pas botimit, më i riu i pari: data, numri dhe çfarë ndryshoi. Secili është edhe në faqen e numrit dhe, kur korrigjohet një numër i vetëm, në faqen e burimeve të PDF-së së tij.",
        "Jede Korrektur nach der Veröffentlichung, die neueste zuerst: Datum, Heft und was sich geändert hat. Jede steht auch auf der Seite des Hefts und, bei der Korrektur eines einzelnen Hefts, auf der Quellenseite seines PDFs."),
      checked: x("The second check changed these {count} issues:", "Kontrolli i dytë ndryshoi këta {count} numra:", "Die zweite Prüfung hat diese {count} Hefte geändert:"),
      dates: x("Dates", "Datat", "Daten"),
    },
    modelLink: x("What the dates mean", "Çfarë tregojnë datat", "Was die Daten bedeuten"),
    all: x("All topics", "Të gjitha temat", "Alle Themen"),
    // The list shows one month at a time, the newest first, a few issues at a time (js/weekly.js).
    months: x("Month of the edition", "Muaji i botimit", "Monat der Ausgabe"),
    shown: x("{shown} of {total} issues", "{shown} nga {total} numra", "{shown} von {total} Ausgaben"),
    more: x("Show more issues", "Shfaq më shumë numra", "Mehr Ausgaben zeigen"),
    empty: x("No issue on this topic in this month.", "Asnjë numër për këtë temë në këtë muaj.", "Keine Ausgabe zu diesem Thema in diesem Monat."),
    special: x("Before the monthly edition, one special edition on the manager in the age of AI.", "Para botimit mujor, një botim special për menaxherin në epokën e AI-së.", "Vor der Monatsausgabe: eine Sonderausgabe über die Führungskraft im Zeitalter der KI."),
  },
  // The second check of every figure (11 and 12 October 2026, online on 12 October), up to four days after the issues
  // went online. issues is the one place that names the issues it changed once they were online: the files of
  // lib/weekly/issues that commit de0466bb ("Management Review 1-80: figures checked against the full texts", on main on
  // 12 October) changed. The count in the texts is its length ({count}, filled in by src/_data/weekly.js), and each
  // issue in it says so under its summary. Issues 73–80 had their first full-text check on 11 October, before they
  // went online (merged into main that evening, #177): what it changed in 74–77 and 79 was never online, so they are not
  // in the list, and their records in docs/revista say so (tests/corrections-register.test.cjs). Where the check
  // changed a figure, a year or a base, the issue also carries a dated correction that names the change.
  checked: {
    date: x("12 October 2026", "12 tetor 2026", "12. Oktober 2026"),
    issues: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 47, 48, 49, 50, 51, 53, 54, 55, 57, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 70, 72, 73, 78, 80],
    archive: x(
      "Within four days of going online, every figure in issues 1 to 80 was checked a second time, now against the full text of its source wherever that could be opened; issues 73 to 80 had their first such check on 11 October, before they went online. {count} issues changed after going online. In most, the wording now follows the source more closely, or a source first checked through a summary was read in full. In some, a figure, a year or what a figure measures was corrected: Issue 6, for example, now gives 6.1% from the published study, where it gave 7.5% from an earlier working paper. Each changed issue says so under its summary, and where a figure, a year or a base changed, a dated note names the change; a later correction to a single issue is dated on its page. All are listed in the corrections register at the foot of this page.",
      "Brenda katër ditësh nga dalja online, çdo shifër në numrat 1 deri në 80 u kontrollua për herë të dytë, tani te teksti i plotë i burimit, kudo ku ai mund të hapej; numrat 73 deri në 80 e patën kontrollin e parë të tillë më 11 tetor, para se të dilnin online. Pasi kishin dalë online ndryshuan {count} numra. Te shumica, formulimi e ndjek tani burimin më nga afër, ose një burim i kontrolluar fillimisht te një përmbledhje u lexua i plotë. Te disa u korrigjua një shifër, një vit ose çfarë mat një shifër: Nr. 6, për shembull, jep tani 6,1% nga studimi i botuar, aty ku jepte 7,5% nga një working paper i mëparshëm. Çdo numër që ndryshoi e thotë nën përmbledhjen e vet, dhe kur ndryshoi një shifër, një vit ose një bazë, një shënim me datë e emërton ndryshimin; një korrigjim i mëvonshëm i një numri të vetëm ka datën e vet në faqen e numrit. Të gjitha janë te regjistri i korrigjimeve në fund të kësaj faqeje.",
      "Innerhalb von vier Tagen nach dem Erscheinen wurde jede Zahl in den Heften 1 bis 80 ein zweites Mal geprüft, nun am vollständigen Text ihrer Quelle, wo immer er sich öffnen ließ; die Hefte 73 bis 80 hatten ihre erste solche Prüfung am 11. Oktober, bevor sie online gingen. {count} Hefte haben sich nach dem Erscheinen geändert. In den meisten folgt die Formulierung jetzt enger der Quelle, oder eine zuerst an einer Zusammenfassung geprüfte Quelle wurde vollständig gelesen. In einigen wurde eine Zahl, ein Jahr oder die Bedeutung einer Zahl korrigiert: Heft 6 nennt jetzt zum Beispiel 6,1 % aus der veröffentlichten Studie, wo es 7,5 % aus einem früheren Working Paper nannte. Jedes geänderte Heft sagt es unter seiner Zusammenfassung, und wo sich eine Zahl, ein Jahr oder eine Basis geändert hat, nennt ein datierter Hinweis die Änderung; eine spätere Korrektur eines einzelnen Hefts steht datiert auf seiner Seite. Alle stehen im Korrekturverzeichnis am Fuß dieser Seite."),
    issue: x(
      "After this issue went online, every figure in the Management Review was checked a second time against the full text of its source, and this issue changed with it.",
      "Pasi ky numër doli online, çdo shifër e Management Review u kontrollua për herë të dytë te teksti i plotë i burimit, dhe ky numër ndryshoi bashkë me të.",
      "Nachdem dieses Heft erschienen war, wurde jede Zahl der Management Review ein zweites Mal am vollständigen Text ihrer Quelle geprüft, und dieses Heft hat sich dabei geändert."),
    link: x("What that check changed", "Çfarë ndryshoi ai kontroll", "Was diese Prüfung geändert hat"),
  },
  back: {
    line: x("Every issue, one management question, checked against the best research.", "Çdo numër, një pyetje e menaxhimit, e kontrolluar me kërkimet më të mira.", "Jede Ausgabe eine Führungsfrage, geprüft an der besten Forschung."),
    all: x("All issues", "Të gjithë numrat", "Alle Ausgaben"),
  },
};
