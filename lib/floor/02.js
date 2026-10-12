// Nga terreni (From the Floor, Aus der Praxis), issue 2, November 2026: When the load rises. Written in the format
// of the Management Review (lib/weekly/issues), drawn by the same pages under the name of the magazine
// (src/_data/magazine.js). The trend and the research are the editors', from the sources below; "From the floor" is
// Stiven Janaqi's own answers, edited only for spelling. The Albanian draft and its fact check: docs/revista/numri-02*.md.
import { x, pc } from "../weekly/common.js";

export default {
  number: 2,
  slug: "nga-terreni-02",
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("When the load", "Kur ngarkesa", "Wenn die Last"), x("rises", "rritet", "steigt")],
  sub: x(
    "Pressure does not always create the problems. It makes them visible: the peak season in figures, new people and long shifts in the research, answers from the floor, and a handover for five fields.",
    "Presioni nuk i krijon gjithmonë problemet. I bën të dukshme: sezoni i pikut në shifra, njerëzit e rinj dhe turnet e gjata në kërkime, përgjigje nga terreni, dhe një dorëzim me pesë fusha.",
    "Druck schafft die Probleme nicht immer. Er macht sie sichtbar: die Hochsaison in Zahlen, neue Leute und lange Schichten in der Forschung, Antworten aus der Praxis und eine Übergabe mit fünf Feldern."),
  // For Publications and the lists of issues.
  lead: x(
    "November opens the busiest season in logistics. For many teams it means more volume, less time and more new people, all at once.",
    "Nëntori hap sezonin më të ngarkuar në logjistikë. Për shumë ekipe, kjo do të thotë më shumë vëllim, më pak kohë dhe më shumë njerëz të rinj në të njëjtën kohë.",
    "Der November eröffnet die arbeitsreichste Zeit in der Logistik. Für viele Teams heißt das: mehr Menge, weniger Zeit und mehr neue Leute, alles gleichzeitig."),
  seo: x(
    "Peak season in logistics: the figures for Germany, the research on new workers and long shifts, answers from the floor and a shift handover.",
    "Sezoni i pikut në logjistikë: shifrat për Gjermaninë, kërkimet për punonjësit e rinj dhe turnet e gjata, përgjigje nga terreni dhe dorëzimi i turnit.",
    "Hochsaison in der Logistik: die Zahlen für Deutschland, die Forschung zu neuen Beschäftigten und langen Schichten, Antworten aus der Praxis, Schichtübergabe."),
  feature: x(
    "Issue 2 follows the peak season in German parcel logistics, counts the extra people and vehicles it needs, asks what the research says about new people and long shifts under pressure, lets Stiven Janaqi answer from the floor, and ends with a shift handover for five fields.",
    "Numri 2 ndjek sezonin e pikut në logjistikën e pakove në Gjermani, numëron njerëzit dhe automjetet shtesë që kërkon, pyet çfarë thonë kërkimet për njerëzit e rinj dhe turnet e gjata nën presion, i lë Stiven Janaqit fjalën nga terreni, dhe mbyllet me një dorëzim turni me pesë fusha.",
    "Ausgabe 2 folgt der Hochsaison der Paketlogistik in Deutschland, zählt die zusätzlichen Menschen und Fahrzeuge, fragt, was die Forschung über neue Leute und lange Schichten unter Druck sagt, lässt Stiven Janaqi aus der Praxis antworten und endet mit einer Schichtübergabe mit fünf Feldern."),
  figure: { n: x("750 m", "750 mln", "750 Mio."), by: "BPEX, 2025", t: x(
    "parcel and express shipments were expected in Germany in November and December 2025 alone.",
    "dërgesa korrier dhe pako priteshin në Gjermani vetëm në nëntor dhe dhjetor 2025.",
    "KEP-Sendungen wurden allein im November und Dezember 2025 in Deutschland erwartet.") },
  teasers: [
    { page: "trend", kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: x("Peak season", "Sezoni i pikut", "Die Hochsaison") },
    { page: "floor", kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: x("Days above forecast", "Ditët mbi parashikim", "Tage über Prognose") },
    { page: "tool", kicker: x("Tool of the month", "Mjeti i muajit", "Tool des Monats"),
      title: x("The shift handover", "Dorëzimi i turnit", "Die Schichtübergabe") },
  ],
  sources: [
    { id: "bpex-kep-2026", by: "BPEX", year: 2026, title: "KEP-Studie 2026, Zahlen und Fakten", url: "https://bpex-ev.de/kep-branche/zahlen-und-fakten.html" },
    { id: "bpex-xmas-2025", by: "BPEX", year: 2025, title: "Ausblick Weihnachtsgeschäft 2025", url: "https://www.bpex-ev.de/presse/meldung/ausblick-weihnachtsgeschaeft-2025.html" },
    { id: "ba-engpass-2025", by: "Bundesagentur für Arbeit", year: 2025, title: "Fachkräfteengpassanalyse 2025", url: "https://statistik.arbeitsagentur.de/DE/Statischer-Content/Statistiken/Themen-im-Fokus/Fachkraeftebedarf/Fachkraefteengpassanalyse/Fachkraefteengpassanalyse.html" },
    { id: "gallup-onboarding-2018", by: "Gallup", year: 2018, title: "Why the Onboarding Experience Is Key for Retention", url: "https://www.gallup.com/workplace/235121/why-onboarding-experience-key-retention.aspx" },
  ],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "November opens the busiest season in logistics: more volume, less time and more new people, all at once. This issue asks what happens to a standard when the load rises, and what a manager can do before it does.",
        "Nëntori hap sezonin më të ngarkuar në logjistikë: më shumë vëllim, më pak kohë dhe më shumë njerëz të rinj, të gjitha njëherësh. Ky numër pyet çfarë ndodh me një standard kur ngarkesa rritet, dhe çfarë mund të bëjë një menaxher para se të rritet.",
        "Der November eröffnet die arbeitsreichste Zeit in der Logistik: mehr Menge, weniger Zeit und mehr neue Leute, alles gleichzeitig. Diese Ausgabe fragt, was mit einem Standard geschieht, wenn die Last steigt, und was eine Führungskraft vorher tun kann."),
      body: x(
        "In 2025 about 4.37 billion parcel and express shipments were moved in Germany; for November and December alone the industry expected about 750 million, up to 21 million on the busiest days. The extra capacity is mostly new people, and people are hard to find. Stiven Janaqi answers from the floor: the peak does not always create the problems, it makes them visible. A shift handover with five fields closes the issue.",
        "Në 2025, në Gjermani u transportuan rreth 4,37 miliardë dërgesa korrier dhe pako; vetëm për nëntorin dhe dhjetorin, branshi priste rreth 750 milionë, deri në 21 milionë në ditët më të ngarkuara. Kapaciteti shtesë është kryesisht njerëz të rinj, dhe njerëzit nuk gjenden lehtë. Stiven Janaqi përgjigjet nga terreni: piku nuk i krijon gjithmonë problemet, i bën të dukshme. Numri mbyllet me një dorëzim turni me pesë fusha.",
        "2025 wurden in Deutschland rund 4,37 Milliarden KEP-Sendungen befördert; allein für November und Dezember erwartete die Branche rund 750 Millionen, an Spitzentagen bis zu 21 Millionen. Die zusätzliche Kapazität sind vor allem neue Menschen, und Menschen sind schwer zu finden. Stiven Janaqi antwortet aus der Praxis: Die Spitze schafft die Probleme nicht immer, sie macht sie sichtbar. Eine Schichtübergabe mit fünf Feldern schließt die Ausgabe."),
    },
    {
      id: "trend",
      kicker: x("Trend of the month", "Trendi i muajit", "Trend des Monats"),
      title: [x("Peak", "Sezoni", "Die"), x("season", "i pikut", "Hochsaison")],
      lead: x(
        "In 2025 about 4.37 billion courier, express and parcel shipments were moved in Germany, about 2% more than a year earlier. Growth continues, but more slowly than expected.",
        "Në 2025, në Gjermani u transportuan rreth 4,37 miliardë dërgesa korrier, ekspres dhe pako, rreth 2% më shumë se një vit më parë. Rritja vazhdon, por më ngadalë nga sa pritej.",
        "2025 wurden in Deutschland rund 4,37 Milliarden Kurier-, Express- und Paketsendungen befördert, etwa 2 % mehr als im Vorjahr. Das Wachstum geht weiter, aber langsamer als erwartet."),
      blocks: [
        { type: "columns", max: 21, height: 120, source: ["bpex-xmas-2025"],
          label: x("Shipments a day in Germany at the 2025 peak, millions", "Dërgesa në ditë në Gjermani në pikun e 2025, milionë", "Sendungen pro Tag in Deutschland in der Spitze 2025, Millionen"),
          items: [
            { k: x("Average at the peak", "Mesatarja në pik", "Schnitt in der Spitze"), v: 15, n: x("~15", "~15", "~15") },
            { k: x("Busiest days", "Ditët më të ngarkuara", "Spitzentage"), v: 21, n: x("up to 21", "deri 21", "bis 21"), alert: true },
          ] },
        { type: "p", text: x(
          "For November and December 2025, the industry association BPEX expected about 750 million shipments, 1 to 2% more than a year earlier.",
          "Për nëntorin dhe dhjetorin e 2025, shoqata e branshit BPEX priste rreth 750 milionë dërgesa, 1 deri në 2% më shumë se një vit më parë.",
          "Für November und Dezember 2025 erwartete der Branchenverband BPEX rund 750 Millionen Sendungen, 1 bis 2 % mehr als im Vorjahr.") },
        { type: "callout", reading: true, text: x(
          "At the peak, an operation has no time to learn. What is not clear before the volume rises shows up during it.",
          "Në pik, një operacion nuk ka kohë të mësojë. Ajo që nuk është e qartë para se të rritet vëllimi, shfaqet gjatë tij.",
          "In der Spitze hat ein Betrieb keine Zeit zu lernen. Was vor dem Anstieg der Menge nicht klar ist, zeigt sich währenddessen.") },
      ],
      source: ["bpex-kep-2026", "bpex-xmas-2025"],
    },
    {
      id: "people",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Extra capacity", "Kapaciteti shtesë", "Zusätzliche Kapazität"), x("is new people", "janë njerëz të rinj", "sind neue Menschen")],
      lead: x(
        "To handle the season, companies in the industry were adding up to 20,000 workers and 17,000 vehicles. People are hard to find, and new people need to be brought in.",
        "Për të përballuar sezonin, kompanitë e branshit shtonin deri në 20.000 punonjës dhe 17.000 automjete. Njerëzit nuk gjenden lehtë, dhe të rinjtë duhen futur në punë.",
        "Für die Saison setzten die Unternehmen der Branche bis zu 20.000 zusätzliche Beschäftigte und 17.000 Fahrzeuge ein. Menschen sind schwer zu finden, und neue Leute müssen eingearbeitet werden."),
      blocks: [
        { type: "stats", cols: 3, items: [
          { n: x("20,000", "20.000", "20.000"), t: x("extra workers for the season", "punonjës shtesë për sezonin", "zusätzliche Beschäftigte für die Saison"), by: "BPEX, 2025" },
          { n: x("17,000", "17.000", "17.000"), t: x("extra vehicles", "automjete shtesë", "zusätzliche Fahrzeuge"), by: "BPEX, 2025" },
          { n: "157", t: x("occupations with a shortage of skilled workers in Germany", "profesione me mungesë fuqie punëtore në Gjermani", "Berufe mit Fachkräfteengpass in Deutschland"), by: "BA, 2025" },
        ] },
        { type: "donut", v: 12, n: pc(12), source: ["gallup-onboarding-2018"], t: x(
          "of employees strongly agreed that their organisation does a great job of onboarding new employees.",
          "e punonjësve pajtoheshin fort se organizata e tyre e bën shumë mirë integrimin e të rinjve.",
          "der Beschäftigten stimmten voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet.") },
        { type: "callout", reading: true, text: x(
          "Capacity is not only a number of people. It is the number of people who can carry out the process to standard.",
          "Kapaciteti nuk është vetëm numër njerëzish. Është numri i njerëzve që mund ta ekzekutojnë procesin në standard.",
          "Kapazität ist nicht nur eine Zahl von Menschen. Es ist die Zahl der Menschen, die den Prozess im Standard ausführen können.") },
      ],
      note: x(
        "Professional drivers are among the occupations where demand remains high. The Gallup figure was first reported in 2017; it is not a measurement from this year.",
        "Shoferët profesionistë janë ndër profesionet ku kërkesa mbetet e lartë. Shifra e Gallup u raportua fillimisht në 2017; nuk është matje e këtij viti.",
        "Berufskraftfahrer gehören zu den Berufen, in denen die Nachfrage hoch bleibt. Die Gallup-Zahl wurde zuerst 2017 veröffentlicht; sie ist keine Messung aus diesem Jahr."),
      source: ["bpex-xmas-2025", "ba-engpass-2025", "gallup-onboarding-2018"],
    },
    {
      id: "floor",
      kicker: x("From the floor", "Si e shoh nga terreni", "Aus der Praxis"),
      title: [x("Days above", "Ditët mbi", "Tage über"), x("forecast", "parashikim", "Prognose")],
      lead: x(
        "Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality.",
        "Stiven Janaqi ka qenë Team Leader dhe Area Manager në logjistikën e miljes së fundit, dhe sot punon si Night Auditor në hoteleri.",
        "Stiven Janaqi war Team Leader und Area Manager in der Last-Mile-Logistik und arbeitet heute als Night Auditor in der Hotellerie."),
      blocks: [
        { type: "qa", sign: "Stiven Janaqi", items: [
          { q: x("What happens to an operation when the load rises?", "Çfarë ndodh me një operacion kur ngarkesa rritet?", "Was passiert mit einem Betrieb, wenn die Last steigt?"), a: [
            x("The peak does not always create the problems. Often it only makes them visible.", "Piku nuk krijon gjithmonë problemet. Shpesh vetëm i bën të dukshme.", "Die Spitze schafft die Probleme nicht immer. Oft macht sie sie nur sichtbar."),
            x("When volume rises, an unclear SOP becomes a mistake. Incomplete training becomes a delay or a quality problem. Weak communication becomes the next shift's problem. Capacity that looked enough on a normal day starts to show its limits.", "Kur volumi rritet, SOP-ja e paqartë bëhet gabim. Trajnimi i paplotë bëhet vonesë ose problem cilësie. Komunikimi i dobët bëhet problem i turnit tjetër. Kapaciteti që dukej i mjaftueshëm në një ditë normale fillon të tregojë kufijtë e tij.", "Wenn die Menge steigt, wird eine unklare SOP zum Fehler. Unvollständiges Training wird zur Verspätung oder zum Qualitätsproblem. Schwache Kommunikation wird zum Problem der nächsten Schicht. Kapazität, die an einem normalen Tag ausreichend aussah, zeigt ihre Grenzen."),
          ] },
          { q: x("What have you seen on days when demand ran above forecast?", "Çfarë ke parë në ditët kur kërkesa doli mbi parashikim?", "Was haben Sie an Tagen gesehen, an denen die Nachfrage über der Prognose lag?"), a: [
            x("I have had days when demand ran above forecast. Drivers had to be brought in at short notice, and there were drivers in ramp-up who were not yet fully aligned with the SOPs.", "Kam pasur ditë kur kërkesa doli mbi forecast. U deshën shoferë me njoftim të shkurtër, dhe kishte shoferë në fazën e ramp-up që nuk ishin ende plotësisht të përafruar me SOP-të.", "Ich hatte Tage, an denen die Nachfrage über dem Forecast lag. Fahrer mussten kurzfristig geholt werden, und es gab Fahrer in der Ramp-up-Phase, die noch nicht vollständig mit den SOPs vertraut waren."),
            x("On such a day the damage rate went above target, with several concrete cases of damage during the operation. For me that is the clearest proof that operational pressure shows up directly in quality. New people under pressure expose the weakness of the standard straight away.", "Në një ditë të tillë, damage rate doli mbi target, me disa raste konkrete dëmtimesh gjatë operacionit. Për mua kjo është prova më e qartë se presioni operacional shfaqet direkt te cilësia. Njerëzit e rinj nën presion e ekspozojnë menjëherë dobësinë e standardizimit.", "An einem solchen Tag lag die Schadensquote über dem Ziel, mit mehreren konkreten Schadensfällen während des Betriebs. Für mich ist das der klarste Beweis, dass sich operativer Druck direkt in der Qualität zeigt. Neue Leute unter Druck legen die Schwäche der Standardisierung sofort offen."),
          ] },
          { q: x("What would you do differently today?", "Çfarë do të bëje ndryshe sot?", "Was würden Sie heute anders machen?"), a: [
            x("Today I would invest more before the load than during it. Once the pressure has started, the time to learn the process becomes much more expensive.", "Sot do të investoja më shumë përpara ngarkesës sesa gjatë saj. Kur presioni ka filluar, koha për të mësuar procesin bëhet shumë më e shtrenjtë.", "Heute würde ich mehr vor der Last investieren als während der Last. Wenn der Druck einmal begonnen hat, wird die Zeit, den Prozess zu lernen, viel teurer."),
            x("Capacity is not only a number of people. It is the number of people who can carry out the process to standard.", "Kapaciteti nuk është vetëm numër njerëzish. Është numër njerëzish që mund ta ekzekutojnë procesin në standard.", "Kapazität ist nicht nur eine Zahl von Menschen. Es ist die Zahl der Menschen, die den Prozess im Standard ausführen können."),
          ] },
        ] },
      ],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "why-the-handover-is-underrated",
      kicker: x("Tool of the month", "Mjeti i muajit", "Tool des Monats"),
      title: [x("The shift", "Dorëzimi", "Die Schicht-"), x("handover", "i turnit", "übergabe")],
      lead: x(
        "When volume rises, personal memory becomes less reliable. The handover becomes the memory of the operation: five fields, filled in before the shift ends.",
        "Kur volumi rritet, kujtesa personale bëhet më pak e besueshme. Dorëzimi bëhet memoria e operacionit: pesë fusha, të plotësuara para se të mbarojë turni.",
        "Wenn die Menge steigt, wird das persönliche Gedächtnis weniger verlässlich. Die Übergabe wird zum Gedächtnis des Betriebs: fünf Felder, ausgefüllt vor dem Ende der Schicht."),
      blocks: [
        { type: "form", items: [
          { h: x("What changed", "Çfarë ndryshoi", "Was hat sich geändert"), hint: x("volume, people, equipment, against the plan", "vëllimi, njerëzit, pajisjet, përballë planit", "Menge, Leute, Ausrüstung, gegen den Plan") },
          { h: x("What remains open", "Çfarë mbetet e hapur", "Was ist noch offen"), hint: x("each issue in one line", "çdo çështje në një rresht", "jeder Punkt in einer Zeile") },
          { h: x("Who owns it", "Kush e mban", "Wem gehört es"), hint: x("one name per issue", "një emër për çdo çështje", "ein Name pro Punkt") },
          { h: x("By when", "Deri kur", "Bis wann"), hint: x("a time, not “soon”", "një orë, jo “shpejt”", "eine Uhrzeit, nicht „bald“") },
          { h: x("What the next shift must know", "Çfarë duhet të dijë turni tjetër", "Was die nächste Schicht wissen muss"), hint: x("heads-ups, safety, new people on the team", "paralajmërime, siguria, njerëz të rinj në ekip", "Hinweise, Sicherheit, neue Leute im Team"), lines: 2 },
        ] },
        { type: "callout", label: x("A question for you", "Pyetja për ju", "Eine Frage an Sie"), text: x(
          "If your volume rose by a third tomorrow, which standard would break first?",
          "Nëse nesër vëllimi juaj do të rritej me një të tretën, cili standard do të prishej i pari?",
          "Wenn Ihre Menge morgen um ein Drittel stiege, welcher Standard würde zuerst brechen?") },
      ],
      note: x(
        "A practice proposed by the editors. The Shift Handover builds it in a few minutes and takes the numbers from the damage, incomplete and delay logs; everything stays in your browser.",
        "Praktikë e propozuar nga redaksia. Dorëzimi i turnit e ndërton në pak minuta dhe i merr shifrat nga regjistrat e dëmeve, të plotësisë dhe të vonesave; gjithçka mbetet në shfletuesin tuaj.",
        "Eine Praxis, die die Redaktion vorschlägt. Die Schichtübergabe baut sie in wenigen Minuten und holt die Zahlen aus den Protokollen für Schäden, Vollständigkeit und Verspätungen; alles bleibt in Ihrem Browser."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
