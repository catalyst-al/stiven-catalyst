// What every volume of the operational treatise shares: its names, the three layers every chapter is built in (the
// living scene, the conceptual and scientific breakdown, the operating protocol for action), and the labels of the
// printed pages and the reader. The volumes are in lib/treatise/volumes (01.js, 02.js …); src/_data/treatise.js puts
// them together. The texts are written once in the three languages with x(en, sq, de) from lib/weekly/common.js,
// and the sources are the Management Review's (lib/weekly/sources.js).
import { x } from "../weekly/common.js";

export { langs, x, pc, resolve } from "../weekly/common.js";

// The three layers of a chapter, in their order. Every page of a chapter belongs to one of them; a layer may take
// more than one page (the breakdown of a chapter with two studies takes two).
export const layers = [
  {
    id: "scene",
    h: x("The living scene", "Skena e gjallë", "Die lebendige Szene"),
    short: x("Scene", "Skena", "Szene"),
    p: x(
      "A shift, a ramp, a desk at 03:00: one piece of work followed as it actually happens, with the hand-off where it breaks. Scenes are constructed from real categories of work and say so.",
      "Një turn, një rampë, një sportel në 03:00: një punë e ndjekur ashtu si ndodh vërtet, me dorëzimin ku prishet. Skenat ndërtohen nga kategori të vërteta pune dhe e thonë këtë.",
      "Eine Schicht, eine Rampe, eine Rezeption um 03:00: ein Stück Arbeit, verfolgt, wie es wirklich geschieht, mit der Übergabe, an der es bricht. Szenen sind aus echten Arbeitskategorien gebaut und als solche gekennzeichnet."),
  },
  {
    id: "concept",
    h: x("The conceptual and scientific breakdown", "Zbërthimi konceptual dhe shkencor", "Die begriffliche und wissenschaftliche Aufschlüsselung"),
    short: x("Breakdown", "Zbërthimi", "Aufschlüsselung"),
    p: x(
      "The mechanism behind the scene, named with the model that explains it, and the research that tests it: the study, its population, its year and its limits, before it is applied anywhere else.",
      "Mekanizmi pas skenës, i emërtuar me modelin që e shpjegon, dhe kërkimi që e provon: studimi, popullata, viti dhe kufijtë e tij, para se të zbatohet diku tjetër.",
      "Der Mechanismus hinter der Szene, benannt mit dem Modell, das ihn erklärt, und die Forschung, die ihn prüft: die Studie, ihre Population, ihr Jahr und ihre Grenzen, bevor sie anderswo angewandt wird."),
  },
  {
    id: "protocol",
    h: x("The operating protocol for action", "Protokolli operativ i veprimit", "Das operative Handlungsprotokoll"),
    short: x("Protocol", "Protokolli", "Protokoll"),
    p: x(
      "What a working team can try on Monday: fields, questions, a cadence and a count, each with an owner, a next step and a return of information to the people who do the work.",
      "Çfarë mund të provojë një ekip të hënën: fusha, pyetje, një ritëm dhe një numërim, secila me një përgjegjës, një hap të radhës dhe kthimin e informacionit te njerëzit që bëjnë punën.",
      "Was ein Team am Montag ausprobieren kann: Felder, Fragen, einen Takt und eine Zählung, jeweils mit Verantwortlichem, nächstem Schritt und Rückmeldung an die Menschen, die die Arbeit tun."),
  },
];
export const layerById = Object.fromEntries(layers.map((layer, index) => [layer.id, { ...layer, n: index + 1 }]));

export const common = {
  // The publication's name, as the author named it, and a short form for the running heads and the cards.
  name: x(
    "In-depth narrative analysis and theoretical-practical operational treatise",
    "Analizë e thelluar narrative dhe traktat teoriko-praktik operacional",
    "Vertiefte narrative Analyse und theoretisch-praktischer operativer Traktat"),
  short: x("Operational Treatise", "Traktati operacional", "Operativer Traktat"),
  // The two lines in the corner of the cover.
  mastNote: [
    x("In-depth narrative analysis", "Analizë e thelluar narrative", "Vertiefte narrative Analyse"),
    x("Theoretical-practical operational treatise", "Traktat teoriko-praktik operacional", "Theoretisch-praktischer operativer Traktat"),
  ],
  tagline: x("Management without theatre.", "Menaxhim pa teatër.", "Management ohne Theater."),
  // The formula of the treatise, in one line.
  formula: x(
    "The living scene → the conceptual and scientific breakdown → the operating protocol for action",
    "Skena e gjallë → zbërthimi konceptual dhe shkencor → protokolli operativ i veprimit",
    "Die lebendige Szene → die begriffliche und wissenschaftliche Aufschlüsselung → das operative Handlungsprotokoll"),
  cover: { src: "/media/magazine/management-review-2026-09/art/bulb.jpg", width: 350, height: 700 },
  labels: {
    edition: x("Operational treatise", "Traktat operacional", "Operativer Traktat"),
    volume: x("Volume", "Vëllimi", "Band"),
    vol: x("Vol.", "Vëll.", "Bd."),
    chapter: x("Chapter", "Kapitulli", "Kapitel"),
    chapters: x("Chapters", "Kapituj", "Kapitel"),
    layer: x("Layer", "Shtresa", "Ebene"),
    layers: x("The three layers", "Tri shtresat", "Die drei Ebenen"),
    inside: x("Inside", "Brenda", "In diesem Band"),
    page: x("Page", "Faqe", "Seite"),
    pages: x("Pages", "Faqe", "Seiten"),
    contents: x("Contents", "Përmbajtja", "Inhalt"),
    source: x("Source", "Burimi", "Quelle"),
    sources: x("Sources", "Burimet", "Quellen"),
    via: x("via", "përmes", "über"),
    more: x("More in the essay", "Më shumë te eseja", "Mehr im Essay"),
    open: x("Open the tool", "Hape mjetin", "Tool öffnen"),
    reading: x("Our reading", "Leximi ynë", "Unsere Lesart"),
    editor: x("Editor", "Redaktor", "Herausgeber"),
    all: x("All volumes", "Të gjitha vëllimet", "Alle Bände"),
    volumes: x("Volumes", "Vëllime", "Bände"),
    open_volume: x("Open the volume", "Hape vëllimin", "Band öffnen"),
    open_vol: x("Open Volume {n}", "Hape vëllimin {n}", "Band {n} öffnen"),
    read_text: x("Read the volume as text", "Lexoje vëllimin si tekst", "Den Band als Text lesen"),
    page_by_page: x("The volume, page by page", "Vëllimi, faqe pas faqeje", "Der Band, Seite für Seite"),
    glance: x("The figures of the volume", "Shifrat e vëllimit", "Die Zahlen des Bandes"),
    glance_note: x("The charts of the printed pages, with their sources. Invented examples are marked as such.", "Grafikët e faqeve të printuara, me burimet e tyre. Shembujt e shpikur shënohen si të tillë.", "Die Grafiken der gedruckten Seiten, mit ihren Quellen. Erfundene Beispiele sind als solche markiert."),
    hypothetical: x("Invented example by the editors, so the arithmetic can be checked; not a measurement", "Shembull i shpikur nga redaksia, që llogaria të kontrollohet; jo një matje", "Erfundenes Beispiel der Redaktion, damit die Rechnung nachprüfbar ist; keine Messung"),
    previous: x("Previous volume", "Vëllimi i mëparshëm", "Vorheriger Band"),
    next: x("Next volume", "Vëllimi i radhës", "Nächster Band"),
    another: x("Read another volume", "Lexo një vëllim tjetër", "Einen anderen Band lesen"),
    blocks: x("Topic", "Tema", "Thema"),
    scene_flag: x("Constructed scene, not a reported incident", "Skenë e ndërtuar, jo ngjarje e raportuar", "Konstruierte Szene, kein gemeldeter Vorfall"),
  },
  intro: {
    title: x("Editorial", "Editoriali", "Editorial"),
    how: x("How every chapter is built", "Si ndërtohet çdo kapitull", "So ist jedes Kapitel gebaut"),
    contract: x("The reading contract", "Kontrata e leximit", "Der Lesevertrag"),
  },
  contentsPage: {
    kicker: x("Contents", "Përmbajtja", "Inhalt"),
    title: [x("The chapters,", "Kapitujt,", "Die Kapitel,"), x("in three layers", "në tri shtresa", "in drei Ebenen")],
    lead: x(
      "Each chapter follows one piece of work through the same three layers: a scene that makes a problem visible, a breakdown that names its mechanism and tests it against research, and a protocol a team can try and measure.",
      "Çdo kapitull e ndjek një punë përmes tri shtresave të njëjta: një skenë që e bën problemin të dukshëm, një zbërthim që i emërton mekanizmin dhe e provon me kërkimin, dhe një protokoll që një ekip mund ta provojë dhe ta masë.",
      "Jedes Kapitel verfolgt ein Stück Arbeit durch dieselben drei Ebenen: eine Szene, die ein Problem sichtbar macht, eine Aufschlüsselung, die seinen Mechanismus benennt und an der Forschung prüft, und ein Protokoll, das ein Team ausprobieren und messen kann."),
    also: x("Also in this volume", "Gjithashtu në këtë vëllim", "Außerdem in diesem Band"),
  },
  sourcesPage: {
    kicker: x("Sources and method", "Burimet dhe metoda", "Quellen und Methode"),
    title: [x("Where the claims", "Nga vijnë", "Woher die Aussagen"), x("come from", "pohimet", "stammen")],
    lead: x(
      "The figures in this volume come from the sources below, each with its year. The scenes are constructed; the protocols are proposals; what is research is named as research.",
      "Shifrat e këtij vëllimi vijnë nga burimet më poshtë, secila me vitin e vet. Skenat janë të ndërtuara; protokollet janë propozime; ajo që është kërkim quhet kërkim.",
      "Die Zahlen dieses Bandes stammen aus den folgenden Quellen, jede mit ihrem Jahr. Die Szenen sind konstruiert; die Protokolle sind Vorschläge; was Forschung ist, wird Forschung genannt."),
    method: x("Editorial method", "Metoda editoriale", "Redaktionelle Methode"),
    methodText: x(
      "Each figure was checked for its year, its publisher and what exactly it measures, at the full text where it could be opened. Where the publisher's page could not be opened, the figure was checked against independent summaries and is marked “via”. The editors' interpretation is marked “Our reading”. No figure of the author's own workplaces is claimed.",
      "Çdo shifër u kontrollua për vitin, botuesin dhe çfarë mat saktësisht, te teksti i plotë kur u hap. Kur faqja e botuesit nuk hapej, shifra u kontrollua te përmbledhje të pavarura dhe shënohet me “përmes”. Interpretimi i redaksisë shënohet “Leximi ynë”. Nuk pretendohet asnjë shifër nga vendet e punës së autorit.",
      "Jede Zahl wurde auf Jahr, Herausgeber und genaue Bedeutung geprüft, am Volltext, wo er sich öffnen ließ. Wo die Seite des Herausgebers nicht erreichbar war, wurde die Zahl an unabhängigen Zusammenfassungen geprüft und mit „über“ markiert. Die Deutung der Redaktion ist als „Unsere Lesart“ markiert. Zahlen aus den eigenen Arbeitsstellen des Autors werden nicht angeführt."),
  },
  // The list of all volumes (/magazine/operational-treatise.html).
  archive: {
    eyebrow: x("Management Review · the volumes", "Management Review · vëllimet", "Management Review · die Bände"),
    lede: x(
      "Longer than an issue, built on one formula: a living scene from the floor, its conceptual and scientific breakdown, and an operating protocol for action. Each volume follows one operational question through warehouses, last-mile transport and the hotel night shift, with the research named and bounded, and ends with a card to use on Monday.",
      "Më i gjatë se një numër, i ndërtuar mbi një formulë: një skenë e gjallë nga terreni, zbërthimi i saj konceptual dhe shkencor, dhe një protokoll operativ veprimi. Çdo vëllim e ndjek një pyetje operacionale nëpër magazina, transportin e miljes së fundit dhe turnin e natës në hotel, me kërkimin të emërtuar dhe të kufizuar, dhe mbyllet me një kartë për ta përdorur të hënën.",
      "Länger als eine Ausgabe, gebaut auf eine Formel: eine lebendige Szene aus dem Betrieb, ihre begriffliche und wissenschaftliche Aufschlüsselung und ein operatives Handlungsprotokoll. Jeder Band verfolgt eine operative Frage durch Lager, die letzte Meile und die Nachtschicht im Hotel, mit benannter und begrenzter Forschung, und endet mit einem Blatt für den Montag."),
    seo: x(
      "The operational treatise of the Management Review: volumes that follow one question through scene, breakdown and protocol, with research, charts and a card.",
      "Traktati operacional i Management Review: vëllime që ndjekin një pyetje përmes skenës, zbërthimit dhe protokollit, me kërkim, grafikë dhe një kartë.",
      "Der operative Traktat der Management Review: Bände, die eine Frage durch Szene, Analyse und Protokoll verfolgen, mit Forschung, Grafiken und einem Arbeitsblatt."),
    all: x("All topics", "Të gjitha temat", "Alle Themen"),
    // The list shows one month at a time, the newest first, a few volumes at a time (partials/issue-filter.njk).
    months: x("Month of the edition", "Muaji i botimit", "Monat der Ausgabe"),
    shown: x("{shown} of {total} volumes", "{shown} nga {total} vëllime", "{shown} von {total} Bänden"),
    more: x("Show more volumes", "Shfaq më shumë vëllime", "Mehr Bände zeigen"),
    empty: x("No volume on this topic in this month.", "Asnjë vëllim për këtë temë në këtë muaj.", "Kein Band zu diesem Thema in diesem Monat."),
    monthly: x("The monthly issues of the Management Review, ten pages each, are on their own list.", "Numrat mujorë të Management Review, dhjetë faqe secili, janë në listën e tyre.", "Die monatlichen Ausgaben der Management Review, je zehn Seiten, stehen auf ihrer eigenen Liste."),
    monthly_link: x("All issues of the Management Review", "Të gjithë numrat e Management Review", "Alle Ausgaben der Management Review"),
  },
  back: {
    line: x("Every volume, one question about operations, followed from the floor to the protocol and tested against research.", "Çdo vëllim, një pyetje për operacionin, e ndjekur nga terreni te protokolli dhe e provuar me kërkimin.", "Jeder Band eine Frage zum Betrieb, verfolgt vom Betriebsalltag bis zum Protokoll und an der Forschung geprüft."),
    all: x("All volumes", "Të gjitha vëllimet", "Alle Bände"),
  },
};
