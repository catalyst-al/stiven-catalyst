// Management Review, No. 80: PDCA, the cycle that does not end. Block: Operations. It closes the second series.
// Facts and their sources: docs/revista/management-review-nr-80.md. The history of the cycle follows Moen & Norman
// (2010), read in full; the counts on the numbers and research pages are from Taylor et al. (2014) and Knudsen et al.
// (2019), read in full at PubMed Central. The books of Ishikawa and Deming were not seen; Shewhart's (1939) was read in full at archive.org.
import { x, pc } from "../common.js";

export default {
  number: 80,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("PDCA:", "PDCA:", "PDCA:"), x("the cycle that does not end", "cikli që nuk mbaron", "der Zyklus, der nicht endet")],
  sub: x(
    "Shewhart's circle of 1939, how a lecture in Japan became PDCA, why Deming wanted study and not check, how few teams run more than one cycle, what reported success hides, and a card for one cycle.",
    "Rrethi i Shewhart-it në 1939, si u bë PDCA një leksion në Japoni, pse Deming donte studim dhe jo kontroll, sa pak ekipe bëjnë më shumë se një cikël, çfarë fsheh suksesi i raportuar, dhe një kartë për një cikël.",
    "Shewharts Kreis von 1939, wie aus einer Vorlesung in Japan PDCA wurde, warum Deming Study statt Check wollte, wie selten Teams mehr als einen Zyklus drehen, was gemeldeter Erfolg verdeckt, und eine Karte."),
  seo: x(
    "PDCA and PDSA: Shewhart's circle of 1939, the Deming wheel in Japan, check or study, two reviews of how teams use the cycle, and a card for one cycle.",
    "PDCA dhe PDSA: rrethi i Shewhart-it (1939), rrota e Deming-ut në Japoni, kontroll apo studim, dy rishikime për përdorimin e ciklit dhe një kartë.",
    "PDCA und PDSA: Shewharts Kreis von 1939, das Deming-Rad in Japan, Check oder Study, zwei Übersichtsarbeiten zur Praxis und eine Karte."),
  feature: x(
    "In 1939 Walter Shewhart drew specification, production and inspection as a circle. Issue 80 follows the cycle to Deming's lectures in Japan and back as PDCA, and sets Deming's Plan-Do-Study-Act beside Ishikawa's six steps. It counts how many published reports ran more than one linked cycle and asks what it means that almost every project reports success. The marks of a cycle that closes and a card for one cycle end the issue, and with it the second series.",
    "Në 1939, Walter Shewhart-i i vizatoi specifikimin, prodhimin dhe inspektimin si rreth. Numri 80 e ndjek ciklin te leksionet e Deming-ut në Japoni dhe në kthimin e tij si PDCA, dhe e vë Plan-Do-Study-Act të Deming-ut pranë gjashtë hapave të Ishikawa-s. Numëron sa raporte të botuara bënë më shumë se një cikël të lidhur, dhe pyet çfarë do të thotë që pothuajse çdo projekt raporton sukses. Shenjat e një cikli që mbyllet dhe një kartë për një cikël e mbyllin numrin, e bashkë me të edhe serinë e dytë.",
    "1939 zeichnete Walter Shewhart Spezifikation, Produktion und Prüfung als Kreis. Ausgabe 80 folgt dem Zyklus zu Demings Vorlesungen in Japan und als PDCA zurück und stellt Demings Plan-Do-Study-Act neben Ishikawas sechs Schritte. Sie zählt, wie viele veröffentlichte Berichte mehr als einen verbundenen Zyklus drehten, und fragt, was es bedeutet, dass fast jedes Projekt Erfolg meldet. Die Merkmale eines Zyklus, der sich schließt, und eine Karte für einen Zyklus beenden die Ausgabe und mit ihr die zweite Serie."),
  figure: { n: pc(4), by: "Knudsen et al., 2019", t: x(
    "of the PDSA projects that could be judged applied all four key features of the method; 98% of all the projects reported improvement.",
    "e projekteve PDSA që mund të gjykoheshin i zbatuan të katër tiparet kryesore të metodës; 98% e të gjitha projekteve raportuan përmirësim.",
    "der beurteilbaren PDSA-Projekte setzten alle vier Kernmerkmale der Methode um; 98 % aller Projekte meldeten eine Verbesserung.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("From a line to a circle", "Nga vija te rrethi", "Von der Linie zum Kreis") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("One cycle, then stop", "Një cikël, pastaj ndalim", "Ein Zyklus, dann Schluss") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The PDSA cycle card", "Karta e ciklit PDSA", "Die PDSA-Zykluskarte") },
  ],
  sources: ["pdca-shewhart-1939", "pdca-moen-norman-2010", "pdca-ishikawa-1985", "pdca-deming-1993", "pdca-taylor-2014", "pdca-knudsen-2019"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "PDCA is on almost every improvement poster, drawn as a circle. In practice it is often run as a line: plan, do, and stop. Following the cycle from Shewhart to Deming, the last issue of the second series asks what it takes to go round more than once.",
        "PDCA është pothuajse në çdo poster përmirësimi, i vizatuar si rreth. Në praktikë shpesh bëhet si vijë: planifiko, bëj, dhe ndalo. Duke e ndjekur ciklin nga Shewhart-i te Deming-u, numri i fundit i serisë së dytë pyet çfarë duhet për të bërë më shumë se një rrotullim.",
        "PDCA hängt auf fast jedem Verbesserungsplakat, als Kreis gezeichnet. In der Praxis läuft es oft als Linie: planen, tun, aufhören. Die letzte Ausgabe der zweiten Serie folgt dem Zyklus von Shewhart zu Deming und fragt, was es braucht, mehr als eine Runde zu drehen."),
      body: x(
        "In 1939 Walter Shewhart drew specification, production and inspection as a circle, not a line. Deming's lectures in Japan in 1950 became the Deming wheel, and then PDCA; Deming later insisted on PDSA, with study in place of check. In a review of 73 healthcare reports, fewer than one in five documented a sequence of linked cycles. In 120 later projects almost all reported improvement, yet only 4% of those that could be judged applied the method fully. Five marks show whether a cycle closes, and a card helps run one.",
        "Në 1939, Walter Shewhart i vizatoi specifikimin, prodhimin dhe inspektimin si rreth, jo si vijë. Leksionet e Deming-ut në Japoni në 1950 u bënë rrota e Deming-ut, e pastaj PDCA; më vonë Deming këmbënguli për PDSA, me studimin në vend të kontrollit. Në një rishikim të 73 raporteve nga shëndetësia, më pak se një në pesë dokumentuan një varg ciklesh të lidhura. Në 120 projekte të mëvonshme pothuajse të gjitha raportuan përmirësim, por vetëm 4% e atyre që mund të gjykoheshin e zbatuan metodën plotësisht. Pesë shenja tregojnë nëse një cikël mbyllet, dhe një kartë ndihmon për ta bërë.",
        "1939 zeichnete Walter Shewhart Spezifikation, Produktion und Prüfung als Kreis, nicht als Linie. Aus Demings Vorlesungen in Japan 1950 wurde das Deming-Rad und dann PDCA; später bestand Deming auf PDSA, mit Study statt Check. In einer Übersichtsarbeit zu 73 Berichten aus dem Gesundheitswesen dokumentierte nicht einmal jeder fünfte eine Folge verbundener Zyklen. In 120 späteren Projekten meldeten fast alle eine Verbesserung, doch nur 4 % der beurteilbaren setzten die Methode voll um. Fünf Merkmale zeigen, ob sich ein Zyklus schließt, und eine Karte hilft dabei."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("From a line", "Nga vija", "Von der Linie"), x("to a circle", "te rrethi", "zum Kreis")],
      lead: x(
        "In 1938 Walter Shewhart of Bell Telephone Laboratories lectured to the US Department of Agriculture's Graduate School; in 1939 the lectures became a book, with W. Edwards Deming as editorial assistant. Quality control, he wrote, has three steps: specification, production, inspection.",
        "Në 1938, Walter Shewhart i Bell Telephone Laboratories mbajti leksione në shkollën pasuniversitare të Departamentit të Bujqësisë së SHBA-së; në 1939 ato u bënë libër, me W. Edwards Deming-un si ndihmës redaktor. Kontrolli i cilësisë, shkroi ai, ka tri hapa: specifikimin, prodhimin, inspektimin.",
        "1938 hielt Walter Shewhart von den Bell Telephone Laboratories Vorlesungen an der Graduate School des US-Landwirtschaftsministeriums; 1939 erschienen sie als Buch, redaktionell betreut von W. Edwards Deming. Qualitätskontrolle, schrieb er, hat drei Schritte: Spezifikation, Produktion, Prüfung."),
      blocks: [
        { type: "p", text: x(
          "Run as a straight line, the steps end at inspection, with a verdict on the product. Shewhart drew them as a circle: what inspection finds goes back into the next specification.",
          "Kur bëhen si vijë e drejtë, hapat mbarojnë te inspektimi, me një vendim për produktin. Shewhart-i i vizatoi si rreth: ajo që gjen inspektimi kthehet te specifikimi i radhës.",
          "Als gerade Linie enden die Schritte bei der Prüfung, mit einem Urteil über das Produkt. Shewhart zeichnete sie als Kreis: Was die Prüfung findet, fließt in die nächste Spezifikation.") },
        { type: "timeline", items: [
          { k: "1939", t: x("Shewhart: specification, production, inspection, as a circle.", "Shewhart-i: specifikimi, prodhimi, inspektimi, si rreth.", "Shewhart: Spezifikation, Produktion, Prüfung, als Kreis.") },
          { k: "1950", t: x("Deming in Japan: design, make, sell, test in service, redesign: the “Deming wheel”.", "Deming-u në Japoni: projekto, prodho, shit, provo në përdorim, riprojekto: “rrota e Deming-ut”.", "Deming in Japan: entwerfen, herstellen, verkaufen, im Einsatz prüfen, neu entwerfen: das „Deming-Rad“.") },
          { k: "1951", t: x("Japanese executives recast the wheel as Plan, Do, Check, Act.", "Drejtues japonezë e rishkruan rrotën si Plan, Do, Check, Act.", "Japanische Führungskräfte fassen das Rad als Plan, Do, Check, Act neu.") },
          { k: "1993", t: x("Deming: Plan, Do, Study, Act, “the Shewhart cycle for learning and improvement”.", "Deming-u: Plan, Do, Study, Act, “cikli i Shewhart-it për të mësuar dhe për të përmirësuar”.", "Deming: Plan, Do, Study, Act, „der Shewhart-Zyklus für Lernen und Verbesserung“.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A line ends with a verdict on the product. A circle ends with a question for the next round.",
          "Vija mbaron me një vendim për produktin. Rrethi mbaron me një pyetje për rrotullimin e radhës.",
          "Eine Linie endet mit einem Urteil über das Produkt. Ein Kreis endet mit einer Frage für die nächste Runde.") },
      ],
      note: x(
        "The history follows Moen & Norman (2010) and Shewhart's book (pp. 1, 44). The 1950 steps are Deming's, shortened, from an eight-day seminar of the JUSE. Who recast them in 1951 is Masaaki Imai's account.",
        "Historia ndjek Moen & Norman (2010) dhe librin e Shewhart-it (f. 1, 44). Hapat e 1950 janë të Deming-ut, të shkurtuar, nga një seminar tetëditor i JUSE-s. Kush i rishkroi në 1951 e tregon Masaaki Imai.",
        "Die Geschichte folgt Moen & Norman (2010) und Shewharts Buch (S. 1, 44). Die Schritte von 1950 sind Demings, gekürzt, aus einem achttägigen Seminar der JUSE. Wer sie 1951 neu fasste, berichtet Masaaki Imai."),
      source: ["pdca-shewhart-1939", "pdca-moen-norman-2010", "pdca-deming-1993"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One cycle,", "Një cikël,", "Ein Zyklus,"), x("then stop", "pastaj ndalim", "dann Schluss")],
      lead: x(
        "Taylor, Reed and colleagues searched the healthcare literature for reports of improvement work that said it used PDSA. Of 409 articles, 73 met their criteria; 47 described their cycles in enough detail to be checked against the method.",
        "Taylor, Reed dhe kolegët kërkuan në literaturën e shëndetësisë raporte pune për përmirësim që thoshin se përdornin PDSA. Nga 409 artikuj, 73 i plotësuan kriteret; 47 i përshkruan ciklet aq hollësisht sa të krahasoheshin me metodën.",
        "Taylor, Reed und Kollegen suchten in der Gesundheitsliteratur nach Berichten über Verbesserungsarbeit, die PDSA nach eigener Angabe nutzte. Von 409 Artikeln erfüllten 73 die Kriterien; 47 beschrieben ihre Zyklen so genau, dass man sie an der Methode messen konnte."),
      blocks: [
        { type: "hbars", max: 47, source: ["pdca-taylor-2014"],
          label: x("The 47 reports that described their cycles (2014)", "47 raportet që i përshkruan ciklet (2014)", "Die 47 Berichte, die ihre Zyklen beschrieben (2014)"),
          items: [
            { k: x("A single cycle", "Një cikël i vetëm", "Ein einziger Zyklus"), v: 29, n: "29" },
            { k: x("Several cycles, not linked", "Disa cikle, të palidhura", "Mehrere Zyklen, unverbunden"), v: 4, n: "4" },
            { k: x("A sequence of linked cycles", "Një varg ciklesh të lidhura", "Eine Folge verbundener Zyklen"), v: 14, n: "14", alert: true },
            { k: x("Data at least monthly to guide them", "Të dhëna të paktën çdo muaj për t'i drejtuar", "Daten mindestens monatlich zur Steuerung"), v: 7, n: "7" },
          ] },
        { type: "p", text: x(
          "Of all 73 reports, fewer than one in five fully documented a sequence of linked cycles. Only two met all five principles of the method; four of the 47 stated a prediction before the test.",
          "Nga të 73 raportet, më pak se një në pesë dokumentuan plotësisht një varg ciklesh të lidhura. Vetëm dy i plotësuan të pesë parimet e metodës; katër nga 47 shprehën një parashikim para provës.",
          "Von allen 73 Berichten dokumentierte nicht einmal jeder fünfte vollständig eine Folge verbundener Zyklen. Nur zwei erfüllten alle fünf Prinzipien der Methode; vier der 47 nannten vor dem Test eine Vorhersage.") },
        { type: "callout", reading: true, text: x(
          "Most teams called it a cycle and ran it once. One round is a trial, not a cycle.",
          "Shumica e ekipeve e quajtën cikël dhe e bënë një herë. Një rrotullim është provë, jo cikël.",
          "Die meisten Teams nannten es Zyklus und drehten ihn einmal. Eine Runde ist ein Versuch, kein Zyklus.") },
      ],
      note: x(
        "Published reports may describe the work less fully than it was done. The bars count reports, not teams. Read in the full text of the review.",
        "Raportet e botuara mund ta përshkruajnë punën më pak plotësisht se si u bë. Shiritat numërojnë raporte, jo ekipe. Lexuar te teksti i plotë i rishikimit.",
        "Veröffentlichte Berichte beschreiben die Arbeit womöglich knapper, als sie getan wurde. Die Balken zählen Berichte, nicht Teams. Gelesen im Volltext der Übersichtsarbeit."),
      source: ["pdca-taylor-2014"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Check", "Kontroll", "Check"), x("or study", "apo studim", "oder Study")],
      lead: x(
        "Deming never fully embraced PDCA. In The New Economics (1993) his cycle is Plan, Do, Study, Act. The Japanese PDCA went another way: Kaoru Ishikawa (1985) made it six steps, with more in plan and do.",
        "Deming-u nuk e pranoi kurrë plotësisht PDCA-në. Te The New Economics (1993), cikli i tij është Plan, Do, Study, Act. PDCA japoneze mori një rrugë tjetër: Kaoru Ishikawa (1985) e bëri me gjashtë hapa, me më shumë te planifikimi dhe te zbatimi.",
        "Deming hat PDCA nie ganz angenommen. In The New Economics (1993) lautet sein Zyklus Plan, Do, Study, Act. Das japanische PDCA ging einen anderen Weg: Kaoru Ishikawa (1985) machte daraus sechs Schritte, mit mehr beim Planen und Tun."),
      blocks: [
        { type: "lists", cols: [
          { h: x("PDCA, Ishikawa (1985)", "PDCA, Ishikawa (1985)", "PDCA, Ishikawa (1985)"), items: [
            x("Set goals and targets", "Cakto qëllimet dhe objektivat", "Ziele und Vorgaben festlegen"),
            x("Decide the methods", "Vendos metodat", "Methoden festlegen"),
            x("Educate and train", "Eduko dhe trajno", "Schulen und ausbilden"),
            x("Do the work", "Kryej punën", "Die Arbeit tun"),
            x("Check the effects", "Kontrollo efektet", "Wirkungen prüfen"),
            x("Take action", "Merr masa", "Maßnahmen ergreifen"),
          ] },
          { h: x("PDSA, Deming (1993)", "PDSA, Deming (1993)", "PDSA, Deming (1993)"), accent: true, items: [
            x("Plan a change or a test", "Planifiko një ndryshim ose një provë", "Eine Änderung oder einen Test planen"),
            x("Do it, preferably small", "Bëje, mundësisht në të vogël", "Durchführen, möglichst klein"),
            x("Study: what did we learn?", "Studio: çfarë mësuam?", "Studieren: Was haben wir gelernt?"),
            x("Act: adopt, abandon, or go again", "Vepro: miratoje, braktise, ose përsërite", "Handeln: übernehmen, verwerfen, wiederholen"),
          ] },
        ] },
        { type: "p", text: x(
          "Check, says the Deming Institute, asks whether a change worked; study compares the results with a prediction and may revise the theory. In 1990 Deming wrote to Ronald Moen:",
          "Kontrolli, thotë Deming Institute, pyet nëse ndryshimi funksionoi; studimi i krahason rezultatet me një parashikim dhe mund ta rishikojë teorinë. Në 1990, Deming-u i shkroi Ronald Moen-it:",
          "Laut Deming Institute fragt Check, ob eine Änderung wirkte; Study vergleicht Ergebnisse mit einer Vorhersage und kann die Theorie ändern. 1990 schrieb Deming an Ronald Moen:") },
        { type: "quote", text: x(
          "Be sure to call it PDSA, not the corruption PDCA.",
          "Sigurohu ta quash PDSA, jo shtrembërimin PDCA.",
          "Nennen Sie es unbedingt PDSA, nicht die Verfälschung PDCA.") },
        { type: "callout", reading: true, text: x(
          "Check asks: did we do it? Study asks: were we right, and what do we believe now?",
          "Kontrolli pyet: a e bëmë? Studimi pyet: a kishim të drejtë, dhe çfarë besojmë tani?",
          "Check fragt: Haben wir es getan? Study fragt: Lagen wir richtig, und was glauben wir jetzt?") },
      ],
      note: x(
        "Ishikawa via the University of Cambridge; Deming's 1993 steps and his letter as Moen & Norman (2010) give them, check and study via the Deming Institute. The Model for Improvement is in No. 69.",
        "Ishikawa përmes Universitetit të Kembrixhit; hapat e Deming-ut të 1993 dhe letra e tij siç i japin Moen & Norman (2010), kontrolli dhe studimi përmes Deming Institute. Modeli i Përmirësimit është te Nr. 69.",
        "Ishikawa über die University of Cambridge; Demings Schritte von 1993 und sein Brief, wie Moen & Norman (2010) sie wiedergeben, Check und Study über das Deming Institute. Das Model for Improvement steht in Nr. 69."),
      source: ["pdca-ishikawa-1985", "pdca-deming-1993", "pdca-moen-norman-2010"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Success reported,", "Sukses i raportuar,", "Erfolg gemeldet,"), x("method missing", "metodë që mungon", "Methode fehlt")],
      lead: x(
        "Knudsen and colleagues at Aalborg University reviewed 120 improvement projects that used PDSA and were published in peer-reviewed journals in 2015 and 2016.",
        "Knudsen dhe kolegët në Universitetin e Aalborgut shqyrtuan 120 projekte përmirësimi që përdorën PDSA dhe u botuan në revista me rishikim nga kolegët në 2015 dhe 2016.",
        "Knudsen und Kollegen an der Universität Aalborg werteten 120 Verbesserungsprojekte aus, die PDSA nutzten und 2015 und 2016 in begutachteten Fachzeitschriften erschienen."),
      blocks: [
        { type: "columns", max: 100, height: 110, source: ["pdca-knudsen-2019"],
          label: x("PDSA projects published in 2015–2016 (2019)", "Projektet PDSA të botuara në 2015–2016 (2019)", "PDSA-Projekte, veröffentlicht 2015–2016 (2019)"),
          items: [
            { k: x("Reported improvement", "Raportuan përmirësim", "Verbesserung gemeldet"), v: 98, n: pc(98) },
            { k: x("Reached a set number", "Arritën një shifër të caktuar", "Zielwert erreicht"), v: 27, n: pc(27) },
            { k: x("All four features", "Të katër tiparet", "Alle vier Merkmale"), v: 4, n: pc(4), alert: true },
          ] },
        { type: "p", text: x(
          "The four features were iterative cycles, data collected over time, testing on a small scale first, and a stated rationale for the change. Only 72 projects described their cycles well enough to be judged; three of them had all four. The authors see a challenge to the legitimacy of PDSA-based improvement.",
          "Katër tiparet ishin ciklet e përsëritura, të dhënat e mbledhura përgjatë kohës, prova fillimisht në shkallë të vogël, dhe një arsyetim i shprehur për ndryshimin. Vetëm 72 projekte i përshkruan ciklet aq mirë sa të gjykoheshin; tri prej tyre i kishin të katërta. Autorët shohin një sfidë për legjitimitetin e përmirësimit me PDSA.",
          "Die vier Merkmale waren wiederholte Zyklen, Daten über die Zeit, zuerst kleine Tests und eine genannte Begründung für die Änderung. Nur 72 Projekte beschrieben ihre Zyklen gut genug für ein Urteil; drei davon hatten alle vier. Die Autoren sehen darin eine Herausforderung für die Legitimität PDSA-basierter Verbesserung.") },
        { type: "callout", reading: true, text: x(
          "When almost every project succeeds on paper, the success says little. How the cycles were run says more.",
          "Kur pothuajse çdo projekt ia del në letër, suksesi thotë pak. Më shumë thotë mënyra si u bënë ciklet.",
          "Wenn fast jedes Projekt auf dem Papier gelingt, sagt der Erfolg wenig. Mehr sagt, wie die Zyklen liefen.") },
      ],
      note: x(
        "Results as the projects reported them; journals favour success. 98% and 27% are of all 120 projects, 4% of the 72 that could be judged. Read in the full text of the review.",
        "Rezultatet siç i raportuan projektet; revistat favorizojnë suksesin. 98% dhe 27% janë nga të 120 projektet, 4% nga 72 që mund të gjykoheshin. Lexuar te teksti i plotë i rishikimit.",
        "Ergebnisse, wie die Projekte sie meldeten; Zeitschriften bevorzugen Erfolge. 98 % und 27 % beziehen sich auf alle 120 Projekte, 4 % auf die 72 beurteilbaren. Gelesen im Volltext der Übersichtsarbeit."),
      source: ["pdca-knudsen-2019"],
    },
    {
      id: "measure", more: "when-improvement-fades",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Did the cycle", "A u mbyll", "Hat sich der"), x("close?", "cikli?", "Zyklus geschlossen?")],
      lead: x(
        "The two reviews judged the reports by a few marks. A team can apply the same marks to its own cycles, before anyone counts the result.",
        "Dy rishikimet i gjykuan raportet me disa shenja. Një ekip mund t'i zbatojë të njëjtat shenja te ciklet e veta, para se ta numërojë dikush rezultatin.",
        "Die zwei Übersichtsarbeiten beurteilten die Berichte an wenigen Merkmalen. Ein Team kann dieselben Merkmale an die eigenen Zyklen anlegen, bevor jemand das Ergebnis zählt."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Prediction written first", "Parashikimi i shkruar më parë", "Vorhersage zuerst notiert"), p: x("What we expect, and why, noted before the test starts.", "Çfarë presim dhe pse, e shënuar para se të nisë prova.", "Was wir erwarten und warum, notiert vor dem Test.") },
          { h: x("Small first, then larger", "Fillimisht në të vogël, pastaj më gjerë", "Erst klein, dann größer"), p: x("One shift or one area before the whole site; scale grows with confidence.", "Një turn ose një zonë para gjithë vendit; shkalla rritet me besimin.", "Eine Schicht oder ein Bereich vor dem ganzen Standort; der Umfang wächst mit dem Vertrauen.") },
          { h: x("Data over time", "Të dhëna përgjatë kohës", "Daten über die Zeit"), p: x("The measure at regular points, not one before and one after.", "Masa në pika të rregullta, jo një para dhe një pas.", "Die Kennzahl in festen Abständen, nicht einmal vorher und einmal nachher.") },
          { h: x("The next cycle linked", "Cikli i radhës i lidhur", "Der nächste Zyklus verknüpft"), p: x("Each cycle starts from what the last one taught.", "Çdo cikël nis nga ajo që mësoi i mëparshmi.", "Jeder Zyklus beginnt mit dem, was der letzte gelehrt hat.") },
          { h: x("Act recorded", "Veprimi i shënuar", "Handeln festgehalten"), p: x("Adopted as the standard, adapted or dropped, and who checks that it holds.", "I miratuar si standard, i përshtatur ose i hequr, dhe kush kontrollon që mban.", "Als Standard übernommen, angepasst oder verworfen, und wer prüft, dass er hält.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A cycle closes when Act changes the standard and someone keeps checking it. Otherwise the gain lasts as long as the attention.",
          "Cikli mbyllet kur veprimi e ndryshon standardin dhe dikush vazhdon ta kontrollojë. Përndryshe fitimi zgjat sa zgjat vëmendja.",
          "Ein Zyklus schließt sich, wenn Handeln den Standard ändert und jemand ihn weiter prüft. Sonst hält der Gewinn so lange wie die Aufmerksamkeit.") },
      ],
      note: x(
        "The first four marks follow Taylor et al. (2014) and Knudsen et al. (2019); the last mark and the selection are the editors'. Standard work and kaizen are in No. 35.",
        "Katër shenjat e para ndjekin Taylor et al. (2014) dhe Knudsen et al. (2019); shenja e fundit dhe përzgjedhja janë të redaksisë. Puna standarde dhe kaizen janë te Nr. 35.",
        "Die ersten vier Merkmale folgen Taylor et al. (2014) und Knudsen et al. (2019); das letzte und die Auswahl stammen von der Redaktion. Standardarbeit und Kaizen stehen in Nr. 35."),
      source: ["pdca-taylor-2014", "pdca-knudsen-2019"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The PDSA", "Karta e ciklit", "Die PDSA-"), x("cycle card", "PDSA", "Zykluskarte")],
      lead: x(
        "One card per cycle, filled in with the people who will run the test. Study needs data over time: a control chart shows whether a change in the numbers is a signal or noise.",
        "Një kartë për çdo cikël, e plotësuar me ata që do ta bëjnë provën. Studimi kërkon të dhëna përgjatë kohës: një kartë kontrolli tregon nëse një ndryshim te shifrat është sinjal apo zhurmë.",
        "Eine Karte pro Zyklus, ausgefüllt mit denen, die den Test durchführen. Study braucht Daten über die Zeit: Eine Regelkarte zeigt, ob eine Veränderung der Zahlen Signal oder Rauschen ist."),
      blocks: [
        { type: "form", items: [
          { h: x("The change", "Ndryshimi", "Die Änderung"), hint: x("one change, and the problem it should solve", "një ndryshim, dhe problemi që duhet të zgjidhë", "eine Änderung, und welches Problem sie lösen soll") },
          { h: x("Prediction", "Parashikimi", "Vorhersage"), hint: x("which measure moves, by about how much, and why", "cila masë lëviz, rreth sa, dhe pse", "welche Kennzahl sich bewegt, etwa wie stark, und warum") },
          { h: x("The test", "Prova", "Der Test"), hint: x("where, who, how long; smaller than the whole area", "ku, kush, sa gjatë; më e vogël se gjithë zona", "wo, wer, wie lange; kleiner als der ganze Bereich") },
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), hint: x("the measure at regular points, and anything unplanned", "masa në pika të rregullta, dhe çdo gjë e paplanifikuar", "die Kennzahl in festen Abständen, und alles Ungeplante") },
          { h: x("Study", "Studimi", "Studieren"), hint: x("results against the prediction: what did we learn?", "rezultatet përballë parashikimit: çfarë mësuam?", "Ergebnisse gegen die Vorhersage: Was haben wir gelernt?") },
          { h: x("Act", "Veprimi", "Handeln"), hint: x("adopt as standard, adapt or abandon; who checks it holds; date of the next cycle", "miratoje si standard, përshtate ose braktise; kush kontrollon që mban; data e ciklit të radhës", "als Standard übernehmen, anpassen oder verwerfen; wer prüft, dass es hält; Termin des nächsten Zyklus"), lines: 2 },
        ] },
      ],
      note: x(
        "The editors propose this card, built on Deming's PDSA steps and the marks used by Taylor et al. (2014) and Knudsen et al. (2019).",
        "Këtë kartë e propozon redaksia, mbi bazën e hapave PDSA të Deming-ut dhe të shenjave që përdorën Taylor et al. (2014) dhe Knudsen et al. (2019).",
        "Diese Karte schlägt die Redaktion vor, gestützt auf Demings PDSA-Schritte und die Merkmale bei Taylor et al. (2014) und Knudsen et al. (2019)."),
      source: ["pdca-deming-1993", "pdca-taylor-2014", "pdca-knudsen-2019"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
