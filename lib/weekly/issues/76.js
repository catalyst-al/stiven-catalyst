// Management Review, No. 76: The Ishikawa diagram. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-76.md. Five sources were read in full; Ishikawa's guide was
// not seen, and its three types are given as Doggett (2005) summarises them, as the fact table says.
import { x, pc } from "../common.js";

// A decimal written for each language: "19.6%", "19,6%", "19,6 %".
const dpc = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 76,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The Ishikawa", "Diagrama", "Das Ishikawa-"), x("diagram", "Ishikawa", "Diagramm")],
  sub: x(
    "Where the fishbone came from, how far quality professionals trust the seven basic tools, how to draw one, Ishikawa's three types, what hospital investigations ended up proposing, and a card for one diagram.",
    "Nga erdhi kurrizi i peshkut, sa u besojnë profesionistët e cilësisë shtatë mjeteve bazë, si vizatohet, tri llojet e Ishikawa-s, çfarë propozuan në fund hetimet në një spital, dhe një kartë për një diagramë.",
    "Woher die Fischgräte kommt, wie sehr Qualitätsfachleute den sieben Basiswerkzeugen trauen, wie sie gezeichnet wird, Ishikawas drei Typen, was Klinikuntersuchungen am Ende vorschlugen, und eine Karte."),
  seo: x(
    "The Ishikawa diagram: its origin, the 6M categories, Ishikawa's three types, a survey of 456 quality professionals, 302 hospital analyses and a card.",
    "Diagrama Ishikawa: origjina, kategoritë 6M, tri llojet e Ishikawa-s, një anketë me 456 profesionistë të cilësisë, 302 analiza në spital dhe një kartë.",
    "Das Ishikawa-Diagramm: Herkunft, die 6M-Kategorien, Ishikawas drei Typen, eine Umfrage unter 456 Qualitätsfachleuten, 302 Klinikanalysen, eine Karte."),
  feature: x(
    "Kaoru Ishikawa is credited with drawing the first fishbone for engineers at Kawasaki Steel in 1943. Issue 76 asks how far 456 quality professionals share his faith in the seven basic tools, shows how to draw the diagram with the 6M categories, and sets out his three types beside the warning that a “root cause” is rarely single. Eight years of hospital root cause analyses lead to the fixes they proposed, and a card closes the issue.",
    "Kaoru Ishikawa-s i atribuohet kurrizi i parë i peshkut, i vizatuar për inxhinierët e Kawasaki Steel më 1943. Numri 76 pyet sa e ndajnë 456 profesionistë të cilësisë besimin e tij te shtatë mjetet bazë, tregon si vizatohet diagrama me kategoritë 6M, dhe shtjellon tri llojet e tij pranë paralajmërimit se “shkaku rrënjë” rrallë është një i vetëm. Tetë vjet analiza të shkaqeve rrënjë në një spital të çojnë te zgjidhjet që propozuan, dhe një kartë e mbyll numrin.",
    "Kaoru Ishikawa soll 1943 die erste Fischgräte für Ingenieure von Kawasaki Steel gezeichnet haben. Ausgabe 76 fragt, wie weit 456 Qualitätsfachleute seinen Glauben an die sieben Basiswerkzeuge teilen, zeigt, wie das Diagramm mit den 6M-Kategorien entsteht, und stellt seine drei Typen neben die Warnung, dass eine „Grundursache“ selten allein kommt. Acht Jahre Ursachenanalysen in einer Klinik führen zu den vorgeschlagenen Lösungen; eine Karte schließt die Ausgabe."),
  figure: { n: x("< 25%", "< 25%", "< 25 %"), by: "Antony, McDermott & Sony, 2021", t: x(
    "of 397 senior quality professionals trained in the seven basic tools thought they could solve more than 95% of quality problems.",
    "e 397 profesionistëve të lartë të cilësisë, të trajnuar për shtatë mjetet bazë, mendonin se ato zgjidhin më shumë se 95% të problemeve të cilësisë.",
    "von 397 leitenden Qualitätsfachleuten mit Schulung in den sieben Basiswerkzeugen meinten, diese lösten mehr als 95 % der Qualitätsprobleme.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Sorting the causes", "Renditja e shkaqeve", "Ursachen ordnen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("How to draw one", "Si vizatohet", "So wird es gezeichnet") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The fishbone card", "Karta e kurrizit të peshkut", "Die Fischgrätenkarte") },
  ],
  sources: ["ishikawa-guide-1968", "ishikawa-doggett-2005", "ishikawa-asq-fishbone", "ishikawa-antony-2021", "ishikawa-peerally-2017", "ishikawa-kellogg-2017"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "When something goes wrong, the first explanation offered is usually a single cause, often a person. The Ishikawa diagram makes a team write down every cause it can think of, sorted into groups, before it chooses one. Where did the diagram come from, how is it drawn, and what can it prove and what not?",
        "Kur diçka shkon keq, shpjegimi i parë që jepet zakonisht është një shkak i vetëm, shpesh një njeri. Diagrama Ishikawa e detyron ekipin të shkruajë çdo shkak që i vjen ndër mend, të ndarë në grupe, para se të zgjedhë një. Nga erdhi diagrama, si vizatohet, dhe çfarë mund e çfarë nuk mund të provojë?",
        "Wenn etwas schiefgeht, lautet die erste Erklärung meist: eine einzige Ursache, oft ein Mensch. Das Ishikawa-Diagramm zwingt ein Team, jede denkbare Ursache nach Gruppen geordnet aufzuschreiben, bevor es eine auswählt. Woher kommt das Diagramm, wie wird es gezeichnet, und was kann es beweisen und was nicht?"),
      body: x(
        "Kaoru Ishikawa is credited with the first diagram, in 1943, and counted it among seven basic tools he said could solve 95% of problems at work; in a survey published in 2021, fewer than a quarter of 397 quality professionals trained in them went that far. ASQ's procedure starts from one effect and generic categories such as the 6Ms. Patient-safety researchers warn that “root cause” suggests a single one. At one medical centre, eight years of analyses ended most often in training, process change and policy.",
        "Kaoru Ishikawa-s i atribuohet diagrama e parë, më 1943, dhe ai e numëroi mes shtatë mjeteve bazë që, sipas tij, zgjidhnin 95% të problemeve në punë; në një anketë të botuar më 2021, më pak se një e katërta e 397 profesionistëve të cilësisë të trajnuar për to shkuan aq larg. Procedura e ASQ nis nga një pasojë dhe nga kategori të përgjithshme si 6M. Studiuesit e sigurisë së pacientit paralajmërojnë se “shkaku rrënjë” të bën të mendosh për një të vetëm. Në një qendër mjekësore, tetë vjet analiza përfunduan më shpesh me trajnime, ndryshime procesi dhe rregullore.",
        "Kaoru Ishikawa gilt als Urheber des ersten Diagramms (1943) und zählte es zu sieben Basiswerkzeugen, die 95 % der Probleme bei der Arbeit lösen sollten; in einer 2021 veröffentlichten Umfrage ging weniger als ein Viertel von 397 darin geschulten Qualitätsfachleuten so weit. Das Vorgehen der ASQ beginnt mit einer Wirkung und allgemeinen Kategorien wie den 6M. Forscher zur Patientensicherheit warnen, dass „Grundursache“ eine einzige nahelegt. In einem Klinikum endeten acht Jahre Analysen am häufigsten mit Schulung, Prozessänderung und Richtlinien."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Sorting", "Renditja", "Ursachen"), x("the causes", "e shkaqeve", "ordnen")],
      lead: x(
        "Kaoru Ishikawa is credited with drawing the first cause-and-effect diagram in 1943, to show engineers at Kawasaki Steel how the many factors behind a result could be sorted and related to one another.",
        "Kaoru Ishikawa-s i atribuohet diagrama e parë shkak-pasojë, e vizatuar më 1943 për t'u treguar inxhinierëve të Kawasaki Steel si mund të renditen dhe të lidhen me njëri-tjetrin faktorët e shumtë pas një rezultati.",
        "Kaoru Ishikawa soll 1943 das erste Ursache-Wirkungs-Diagramm gezeichnet haben, um Ingenieuren von Kawasaki Steel zu zeigen, wie sich die vielen Faktoren hinter einem Ergebnis ordnen und miteinander verbinden lassen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("The head", "Koka", "Der Kopf"), p: x("the effect: one problem, written in a box on the right", "pasoja: një problem, i shkruar në një kuti në të djathtë", "die Wirkung: ein Problem, rechts in einem Kasten") },
          { h: x("The bones", "Kockat", "Die Gräten"), p: x("the main categories of causes, branching off the spine", "kategoritë kryesore të shkaqeve, që dalin nga shtylla", "die Hauptkategorien der Ursachen, die von der Mittelgräte abgehen") },
          { h: x("The small bones", "Kockat e vogla", "Die kleinen Gräten"), p: x("causes and sub-causes, found by asking why it happens", "shkaqet dhe nënshkaqet, të gjetura duke pyetur pse ndodh", "Ursachen und Unterursachen, gefunden mit der Frage, warum es passiert") },
        ] },
        { type: "p", text: x(
          "The shape gave it its other name, the fishbone. Ishikawa counted it among seven basic quality tools, with the check sheet, the Pareto chart, the histogram, the scatter diagram, stratification and the control chart.",
          "Forma i dha emrin tjetër, kurrizi i peshkut. Ishikawa e numëroi mes shtatë mjeteve bazë të cilësisë, bashkë me fletën e kontrollit, diagramin Pareto, histogramin, diagramin e shpërndarjes, shtresëzimin dhe kartën e kontrollit.",
          "Die Form gab ihm seinen zweiten Namen, Fischgräte. Ishikawa zählte es zu sieben Basiswerkzeugen der Qualität, neben Strichliste, Pareto-Diagramm, Histogramm, Streudiagramm, Schichtung und Regelkarte.") },
        { type: "callout", reading: true, text: x(
          "The diagram does not find the cause. It stops a team from settling on the first one that comes to mind.",
          "Diagrama nuk e gjen shkakun. E pengon ekipin të ndalet te i pari që i vjen ndër mend.",
          "Das Diagramm findet die Ursache nicht. Es hält ein Team davon ab, sich mit der ersten zufriedenzugeben, die ihm einfällt.") },
      ],
      note: x(
        "The 1943 story as Doggett (2005) tells it; Ishikawa's own account was not available to us, and other accounts give other dates and places. ASQ lists the names fishbone, cause-and-effect and Ishikawa diagram.",
        "Historia e vitit 1943 siç e tregon Doggett (2005); rrëfimin e vetë Ishikawa-s nuk e pamë, dhe rrëfime të tjera japin data dhe vende të tjera. ASQ i rendit emrat kurriz peshku, diagramë shkak-pasojë dhe diagramë Ishikawa.",
        "Die Geschichte von 1943, wie Doggett (2005) sie erzählt; Ishikawas eigenen Bericht konnten wir nicht einsehen, andere Darstellungen nennen andere Jahre und Orte. Die ASQ führt die Namen Fischgräte, Ursache-Wirkungs- und Ishikawa-Diagramm."),
      source: ["ishikawa-doggett-2005", "ishikawa-guide-1968", "ishikawa-asq-fishbone"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Widely used,", "I përdorur gjerë,", "Viel genutzt,"), x("modestly trusted", "i besuar me masë", "maßvoll vertraut")],
      lead: x(
        "Ishikawa held that seven basic tools, used skilfully, could solve 95% of problems at work. In a study published in 2021, Jiju Antony, Olivia McDermott and Michael Sony put the claim to 456 senior quality professionals on five continents.",
        "Ishikawa mbante se shtatë mjete bazë, të përdorura me mjeshtëri, mund të zgjidhnin 95% të problemeve në punë. Në një studim të botuar më 2021, Jiju Antony, Olivia McDermott dhe Michael Sony ua vunë këtë pohim përpara 456 profesionistëve të lartë të cilësisë në pesë kontinente.",
        "Ishikawa meinte, mit sieben Basiswerkzeugen ließen sich, geschickt eingesetzt, 95 % der Probleme bei der Arbeit lösen. In einer 2021 veröffentlichten Studie legten Jiju Antony, Olivia McDermott und Michael Sony diese Aussage 456 leitenden Qualitätsfachleuten auf fünf Kontinenten vor."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "456", t: x("senior quality professionals answered the online survey", "profesionistë të lartë të cilësisë iu përgjigjën anketës në internet", "leitende Qualitätsfachleute beantworteten die Online-Umfrage") },
          { n: x("< 25%", "< 25%", "< 25 %"), t: x("of the 397 trained in the tools thought they could solve over 95% of quality problems", "e 397 të trajnuarve për mjetet mendonin se ato zgjidhin mbi 95% të problemeve të cilësisë", "der 397 darin Geschulten meinten, die Werkzeuge lösten über 95 % der Qualitätsprobleme") },
        ] },
        { type: "p", text: x(
          "The Pareto chart was the most widely used of the seven, scatter diagrams and stratification the least; the tools were used most in production and least in IT and finance.",
          "Diagrami Pareto ishte më i përdoruri nga të shtatë, diagramet e shpërndarjes dhe shtresëzimi më pak të përdorurit; mjetet përdoreshin më shumë në prodhim dhe më pak në IT dhe financë.",
          "Das Pareto-Diagramm war das meistgenutzte der sieben, Streudiagramm und Schichtung die am wenigsten genutzten; eingesetzt wurden die Werkzeuge vor allem in der Produktion, am seltensten in IT und Finanzen.") },
        { type: "callout", reading: true, text: x(
          "Professionals use the tools widely and expect less of them than their author did. That is the right frame of mind for the diagram.",
          "Profesionistët i përdorin mjetet gjerësisht dhe presin prej tyre më pak se autori i tyre. Kjo është mendësia e duhur për diagramën.",
          "Fachleute nutzen die Werkzeuge breit und erwarten weniger von ihnen als ihr Urheber. Das ist die richtige Haltung für das Diagramm.") },
      ],
      note: x(
        "Self-reports in an online survey. Those not trained in the tools stopped after the first questions; the 25% is of the 397 who went on (90 of 397). Ishikawa's 95% as the authors quote it.",
        "Vetëdeklarime në një anketë në internet. Ata që nuk ishin trajnuar për mjetet ndaluan pas pyetjeve të para; 25% është nga 397 që vazhduan (90 nga 397). 95% e Ishikawa-s siç e citojnë autorët.",
        "Selbstauskünfte in einer Online-Umfrage. Wer nicht in den Werkzeugen geschult war, hörte nach den ersten Fragen auf; die 25 % beziehen sich auf die 397, die weitermachten (90 von 397). Ishikawas 95 % nach den Autoren."),
      source: ["ishikawa-antony-2021"],
    },
    {
      id: "model", more: "pareto-and-5-why-in-practice",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("How to", "Si", "So wird es"), x("draw one", "vizatohet", "gezeichnet")],
      lead: x(
        "ASQ's procedure, which cites Nancy Tague's Quality Toolbox, starts with the team agreeing on one problem statement, the effect, and writing it in a box on the right, at the end of a horizontal spine.",
        "Procedura e ASQ, që citon Quality Toolbox të Nancy Tague-s, nis me ekipin që bie dakord për një formulim të problemit, pasojën, dhe e shkruan në një kuti në të djathtë, në fund të një shtylle horizontale.",
        "Das Vorgehen der ASQ, das sich auf Nancy Tagues Quality Toolbox stützt, beginnt damit, dass sich das Team auf eine Problemaussage einigt, die Wirkung, und sie rechts in einen Kasten am Ende einer waagrechten Mittelgräte schreibt."),
      blocks: [
        { type: "chain", label: x("The four steps (ASQ)", "Katër hapat (ASQ)", "Die vier Schritte (ASQ)"), items: [
          { h: x("Name the effect", "Emërto pasojën", "Wirkung benennen"), p: x("one problem, agreed", "një problem, i rënë dakord", "ein Problem, vereinbart") },
          { h: x("Choose the bones", "Zgjidh kockat", "Gräten wählen"), p: x("the main categories", "kategoritë kryesore", "die Hauptkategorien") },
          { h: x("Ask why", "Pyet pse", "Warum fragen"), p: x("each answer is a cause", "çdo përgjigje është shkak", "jede Antwort eine Ursache") },
          { h: x("Ask again", "Pyet sërish", "Erneut fragen"), p: x("sub-causes off each cause", "nënshkaqe nga çdo shkak", "Unterursachen je Ursache") },
        ] },
        { type: "lists", cols: [
          { h: x("Manufacturing: the 6Ms", "Prodhimi: 6M", "Fertigung: die 6M"), accent: true, items: [
            x("Methods", "Metodat", "Methode"),
            x("Machinery", "Makineritë", "Maschine"),
            x("Materials", "Materialet", "Material"),
            x("Measurement", "Matja", "Messung"),
            x("Manpower", "Njerëzit", "Mensch"),
            x("Mother Nature", "Mjedisi", "Mitwelt"),
          ] },
          { h: x("What they cover (ASQ)", "Çfarë përfshijnë (ASQ)", "Was dazu gehört (ASQ)"), items: [
            x("Machinery: equipment, software", "Makineritë: pajisjet, softueri", "Maschine: Anlagen, Software"),
            x("Methods: procedures, regulations", "Metodat: procedurat, rregulloret", "Methode: Abläufe, Vorschriften"),
            x("Manpower: training, skills", "Njerëzit: trajnimi, aftësitë", "Mensch: Ausbildung, Fähigkeiten"),
            x("Mother Nature: the environment", "Mjedisi: rrethina, faktorët e jashtëm", "Mitwelt: Umfeld, äußere Einflüsse"),
            x("Sometimes a seventh M: money", "Ndonjëherë një M e shtatë: paraja", "Manchmal ein siebtes M: Geld"),
          ] },
        ] },
        { type: "callout", reading: true, text: x(
          "The people bone is the easy one. “Careless operator” ends the search; why the process let the slip through is the next question.",
          "Kocka e njerëzve është më e lehta. “Operator i pakujdesshëm” e mbyll kërkimin; pse procesi e la gabimin të kalonte është pyetja e radhës.",
          "Die Mensch-Gräte ist die bequemste. „Unachtsamer Bediener“ beendet die Suche; warum der Prozess den Fehler durchließ, ist die nächste Frage.") },
      ],
      note: x(
        "Ishikawa introduced the 6Ms as generic labels but encouraged teams to name their own (ASQ). The right column shortens ASQ's notes on the categories.",
        "Ishikawa i solli 6M-të si etiketa të përgjithshme, por i nxiti ekipet t'i emërtojnë vetë (ASQ). Kolona e djathtë shkurton shënimet e ASQ-së për kategoritë.",
        "Ishikawa führte die 6M als allgemeine Etiketten ein, ermutigte Teams aber zu eigenen Namen (ASQ). Die rechte Spalte kürzt die Hinweise der ASQ zu den Kategorien."),
      source: ["ishikawa-asq-fishbone"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Three types,", "Tri lloje,", "Drei Typen,"), x("one warning", "një paralajmërim", "eine Warnung")],
      lead: x(
        "Ishikawa described three ways to build the diagram. They differ in what forms the bones: the sources of variation, the steps of the process, or a free list of causes sorted afterwards.",
        "Ishikawa përshkroi tri mënyra për ta ndërtuar diagramën. Ndryshojnë te ajo që formon kockat: burimet e variacionit, hapat e procesit, ose një listë e lirë shkaqesh e renditur më pas.",
        "Ishikawa beschrieb drei Wege, das Diagramm aufzubauen. Sie unterscheiden sich darin, was die Gräten bildet: die Quellen der Streuung, die Schritte des Prozesses oder eine freie Liste von Ursachen, die man danach ordnet."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Dispersion analysis", "Analiza e shpërndarjes", "Streuungsanalyse"), p: x("the bones are sources of variation, such as the 6Ms", "kockat janë burimet e variacionit, si 6M", "die Gräten sind Quellen der Streuung, etwa die 6M") },
          { h: x("Process classification", "Sipas procesit", "Prozessgliederung"), p: x("the spine follows the steps; causes branch off each one", "shtylla ndjek hapat; shkaqet dalin nga secili", "die Mittelgräte folgt den Schritten; Ursachen gehen von jedem ab") },
          { h: x("Cause enumeration", "Numërimi i shkaqeve", "Ursachenaufzählung"), p: x("all possible causes listed first, then grouped and related", "së pari listohen të gjitha shkaqet, pastaj grupohen dhe lidhen", "erst alle möglichen Ursachen auflisten, dann gruppieren und verbinden") },
        ] },
        { type: "p", text: x(
          "Writing on root cause analysis in patient safety, Mohammad Farhad Peerally, Susan Carr, Justin Waring and Mary Dixon-Woods (2017) argue that the method spread with too little attention to what made it work where it came from, and that the term “root cause” suggests a single cause and invites stories that are too simple.",
          "Duke shkruar për analizën e shkaqeve rrënjë në sigurinë e pacientit, Mohammad Farhad Peerally, Susan Carr, Justin Waring dhe Mary Dixon-Woods (2017) argumentojnë se metoda u përhap me shumë pak vëmendje për atë që e bënte të funksiononte aty ku lindi, dhe se termi “shkak rrënjë” sugjeron një shkak të vetëm dhe fton rrëfime tepër të thjeshta.",
          "Mohammad Farhad Peerally, Susan Carr, Justin Waring und Mary Dixon-Woods (2017) schreiben über Ursachenanalysen in der Patientensicherheit, die Methode habe sich mit zu wenig Blick darauf verbreitet, was sie in ihren Ursprungsbereichen wirksam machte, und der Begriff „Grundursache“ lege eine einzige Ursache nahe und lade zu allzu einfachen Erzählungen ein.") },
        { type: "callout", reading: true, text: x(
          "Most problems have several causes acting together. A circled bone marks where the checking starts, and nothing more.",
          "Shumica e problemeve kanë disa shkaqe që veprojnë së bashku. Një kockë e rrethuar shënon vendin ku nis kontrolli, dhe asgjë më shumë.",
          "Die meisten Probleme haben mehrere Ursachen, die zusammenwirken. Eine eingekreiste Gräte markiert, wo die Prüfung beginnt, mehr nicht.") },
      ],
      note: x(
        "The three types as Doggett (2005) summarises Ishikawa's guide; we did not see the book. On blame after errors, see No. 50.",
        "Tri llojet siç i përmbledh Doggett-i (2005) nga udhëzuesi i Ishikawa-s; librin nuk e pamë. Për fajin pas gabimeve, shih Nr. 50.",
        "Die drei Typen, wie Doggett (2005) Ishikawas Leitfaden zusammenfasst; das Buch lag uns nicht vor. Zur Schuldfrage nach Fehlern siehe Nr. 50."),
      source: ["ishikawa-guide-1968", "ishikawa-peerally-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("What the analyses", "Çfarë propozuan", "Was die Analysen"), x("proposed", "analizat", "vorschlugen")],
      lead: x(
        "One way to judge a cause analysis is by what it changes. Kellogg and colleagues reviewed 302 root cause analyses done at a large academic medical centre over eight years; 106 proposed solutions, 499 in all.",
        "Një mënyrë për ta gjykuar një analizë shkaqesh është nga ajo që ndryshon. Kellogg dhe kolegët shqyrtuan 302 analiza të shkaqeve rrënjë të bëra në një qendër të madhe mjekësore universitare gjatë tetë vjetëve; 106 propozuan zgjidhje, 499 gjithsej.",
        "Eine Ursachenanalyse lässt sich daran messen, was sie ändert. Kellogg und Kollegen prüften 302 Ursachenanalysen eines großen Universitätsklinikums aus acht Jahren; 106 schlugen Lösungen vor, insgesamt 499."),
      blocks: [
        { type: "hbars", max: 25, source: ["ishikawa-kellogg-2017"],
          label: x("The commonest types among 499 proposed solutions (2017)", "Llojet më të shpeshta mes 499 zgjidhjeve të propozuara (2017)", "Die häufigsten Arten unter 499 vorgeschlagenen Lösungen (2017)"),
          items: [
            { k: x("Training", "Trajnimi", "Schulung"), v: 20, n: pc(20), alert: true },
            { k: x("Process change", "Ndryshimi i procesit", "Prozessänderung"), v: 19.6, n: dpc("19.6") },
            { k: x("Policy reinforcement", "Përforcimi i rregullores", "Richtlinie bekräftigen"), v: 15.2, n: dpc("15.2") },
          ] },
        { type: "p", text: x(
          "The commonest events were complications of procedures, cardiopulmonary arrests, neurological deficits and retained foreign bodies. Several types of event recurred in the eight years despite repeated analyses. The authors conclude that the solutions proposed most often were weak ones, less likely to prevent a recurrence.",
          "Ngjarjet më të shpeshta ishin komplikimet e procedurave, arrestet kardiopulmonare, dëmtimet neurologjike dhe trupat e huaj të harruar në trup. Disa lloje ngjarjesh u përsëritën gjatë tetë vjetëve, pavarësisht analizave të përsëritura. Autorët përfundojnë se zgjidhjet e propozuara më shpesh ishin të dobëta, me më pak gjasa të parandalojnë përsëritjen.",
          "Die häufigsten Ereignisse waren Komplikationen bei Eingriffen, Herz-Kreislauf-Stillstände, neurologische Ausfälle und zurückgelassene Fremdkörper. Mehrere Ereignisarten wiederholten sich in den acht Jahren trotz wiederholter Analysen. Die Autoren folgern, die häufigsten Lösungen seien schwache gewesen, die eine Wiederholung seltener verhindern.") },
        { type: "callout", reading: true, text: x(
          "Judge the analysis by its last line: was the cause checked with data, and does the fix change the process itself? A reminder to be careful does not count.",
          "Gjykoje analizën nga rreshti i fundit: a u kontrollua shkaku me të dhëna, dhe a e ndryshon zgjidhja vetë procesin? Një kujtesë për të qenë të kujdesshëm nuk llogaritet.",
          "Messen Sie die Analyse an ihrer letzten Zeile: Wurde die Ursache mit Daten geprüft, und ändert die Lösung den Prozess selbst? Eine Ermahnung zur Sorgfalt zählt nicht.") },
      ],
      note: x(
        "One medical centre. The abstract says 731 solutions; the paper's text and table count 499, the base of the shares. These were root cause analyses in general, not only fishbone diagrams. On stronger and weaker actions, see No. 46.",
        "Një qendër mjekësore. Abstrakti thotë 731 zgjidhje; teksti dhe tabela e artikullit numërojnë 499, bazën e pjesëve. Ishin analiza të shkaqeve rrënjë në përgjithësi, jo vetëm diagrama kurriz peshku. Për veprimet më të forta dhe më të dobëta, shih Nr. 46.",
        "Ein Klinikum. Das Abstract nennt 731 Lösungen; Text und Tabelle des Artikels zählen 499, die Basis der Anteile. Es waren Ursachenanalysen allgemein, nicht nur Fischgräten. Zu stärkeren und schwächeren Maßnahmen siehe Nr. 46."),
      source: ["ishikawa-kellogg-2017"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The fishbone", "Karta e kurrizit", "Die"), x("card", "të peshkut", "Fischgrätenkarte")],
      lead: x(
        "One card per problem. Write the effect so it can be measured, fill every bone before choosing, then check the likeliest causes with data. Take the one that holds into a 5 Whys.",
        "Një kartë për çdo problem. Shkruaje pasojën që të mund të matet, mbush çdo kockë para se të zgjedhësh, pastaj kontrollo me të dhëna shkaqet më të mundshme. Atë që qëndron, çoje te një 5 Whys.",
        "Eine Karte pro Problem. Formulieren Sie die Wirkung messbar, füllen Sie jede Gräte, bevor Sie wählen, und prüfen Sie dann die wahrscheinlichsten Ursachen mit Daten. Was standhält, geht in ein 5 Why."),
      blocks: [
        { type: "form", items: [
          { h: x("The effect", "Pasoja", "Die Wirkung"), hint: x("what, where, since when, how much: one sentence", "çfarë, ku, që kur, sa: një fjali", "was, wo, seit wann, wie viel: ein Satz") },
          { h: x("The bones", "Kockat", "Die Gräten"), hint: x("the 6Ms or your own; no more than six", "6M ose të tuat; jo më shumë se gjashtë", "die 6M oder eigene; höchstens sechs") },
          { h: x("Causes on each bone", "Shkaqet në çdo kockë", "Ursachen an jeder Gräte"), hint: x("why does it happen? one cause per line", "pse ndodh? një shkak për rresht", "Warum passiert es? Eine Ursache pro Zeile"), lines: 2 },
          { h: x("The three likeliest", "Tri më të mundshmet", "Die drei wahrscheinlichsten"), hint: x("chosen by the team and circled on the diagram", "të zgjedhura nga ekipi dhe të rrethuara në diagramë", "vom Team gewählt und im Diagramm eingekreist") },
          { h: x("Check with data", "Kontrollo me të dhëna", "Mit Daten prüfen"), hint: x("what will confirm or rule out each one, who checks, by when", "çfarë e konfirmon ose e përjashton secilin, kush kontrollon, deri kur", "was jede bestätigt oder ausschließt, wer prüft, bis wann") },
          { h: x("Action and review", "Veprimi dhe rishikimi", "Maßnahme und Prüftermin"), hint: x("what changes in the process, and when you look again", "çfarë ndryshon në proces, dhe kur e shikon sërish", "was sich im Prozess ändert, und wann Sie wieder hinsehen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, drawn from ASQ's procedure and Ishikawa's types. A Pareto chart (No. 15) counts how often each checked cause occurs; the 5 Whys tool takes one branch further.",
        "Karta është propozim i redaksisë, nxjerrë nga procedura e ASQ-së dhe llojet e Ishikawa-s. Një diagram Pareto (Nr. 15) numëron sa shpesh ndodh secili shkak i kontrolluar; mjeti 5 Whys e çon një degë më tej.",
        "Die Karte ist ein Vorschlag der Redaktion, abgeleitet aus dem ASQ-Vorgehen und Ishikawas Typen. Ein Pareto-Diagramm (Nr. 15) zählt, wie oft jede geprüfte Ursache auftritt; das 5-Why-Werkzeug führt einen Ast weiter."),
      source: ["ishikawa-asq-fishbone", "ishikawa-guide-1968"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
