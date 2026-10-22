// Operational treatise, Volume 6: The KPI trap, when the numbers improve but the work gets worse. Block: Operations.
// Facts and their sources: docs/revista/traktati-operacional.md. The research is the measurement literature the
// Management Review already carries (Campbell 1979, Goodhart 1975, Strathern 1997, Kaplan & Norton 1992, Bevan & Hood
// 2006) plus Holmström & Milgrom 1991, van Thiel & Leeuw 2002, the IHI's Establishing Measures and two sections of the
// NIST/SEMATECH e-Handbook, each checked at its DOI or page. Six chapters in the three layers; Chapter II gets the
// protocol the author's PDF leaves out, and the method has its own page. Every number is a worked example from stated
// assumptions (1,000 orders, a p-chart with p0 = 0.015 and n = 1,000, two periods of mixed work) and is marked
// synthetic; nothing is measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 6,
  numeral: "VI",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The KPI trap:", "Kurthi i KPI-ve:", "Die KPI-Falle:"), x("when the numbers improve but the work gets worse", "kur numrat përmirësohen, por puna keqësohet", "wenn die Zahlen besser werden, aber die Arbeit schlechter")],
  sub: x(
    "Six chapters on targets, distorted incentives, hidden trade-offs, statistical variation and the scorecard that protects the customer.",
    "Gjashtë kapituj për objektivat, stimujt e shtrembëruar, kompromiset e fshehura, luhatjen statistikore dhe tabelën e treguesve që e mbron klientin.",
    "Sechs Kapitel über Ziele, verzerrte Anreize, verborgene Zielkonflikte, statistische Streuung und die Kennzahlentafel, die den Kunden schützt."),
  seo: x(
    "The KPI trap, an operational treatise: six chapters in three layers, from a green score to Goodhart, Campbell, a p-chart and the Honest KPI Card.",
    "Kurthi i KPI-ve, traktat operacional: gjashtë kapituj në tri shtresa, nga një pikë e gjelbër te Goodhart, Campbell, një p-grafik dhe karta e KPI-së.",
    "Die KPI-Falle, ein operativer Traktat: sechs Kapitel in drei Ebenen, von einer grünen Zahl zu Goodhart, Campbell, einer p-Karte und dem KPI-Blatt."),
  feature: x(
    "Volume 6 asks whether we are improving the service or only the indicator used to judge it. Its six chapters move from a green loading score and a missing item, a meeting that rewards one number and a red cell that may be ordinary variation to Goodhart, Campbell, Holmström and Milgrom, Bevan and Hood, the NIST control chart and a worked aggregation reversal, and end with a measurement decision protocol and the Honest KPI Card.",
    "Vëllimi 6 pyet nëse po përmirësojmë shërbimin apo vetëm treguesin që përdoret për ta gjykuar. Gjashtë kapitujt e tij shkojnë nga një pikë e gjelbër ngarkimi dhe një artikull që mungon, një mbledhje që shpërblen një numër të vetëm dhe një qelizë e kuqe që mund të jetë luhatje e zakonshme, te Goodhart, Campbell, Holmström e Milgrom, Bevan e Hood, grafiku i kontrollit i NIST dhe një përmbysje agregimi e llogaritur, dhe mbyllen me një protokoll vendimi për matjen dhe me Kartën e KPI-së së ndershme.",
    "Band 6 fragt, ob wir den Service verbessern oder nur den Indikator, mit dem er beurteilt wird. Seine sechs Kapitel führen von einer grünen Ladezahl und einem fehlenden Artikel, einer Besprechung, die eine einzige Zahl belohnt, und einer roten Zelle, die gewöhnliche Streuung sein kann, zu Goodhart, Campbell, Holmström und Milgrom, Bevan und Hood, der NIST-Regelkarte und einer durchgerechneten Aggregationsumkehr, und enden mit einem Entscheidungsprotokoll für Messung und dem ehrlichen KPI-Blatt."),
  figure: { n: x("2.3%", "2,3%", "2,3 %"), by: x("p-chart model, invented example", "Modeli i p-grafikut, shembull i shpikur", "p-Karten-Modell, erfundenes Beispiel"), t: x(
    "can miss a 1% business target without crossing a hypothetical statistical upper control limit. A signal is not a verdict.",
    "mund ta humbasë një objektiv biznesi prej 1% pa e kaluar një kufi të sipërm hipotetik statistikor të kontrollit. Një sinjal nuk është verdikt.",
    "kann ein Geschäftsziel von 1 % verfehlen, ohne eine hypothetische statistische obere Eingriffsgrenze zu überschreiten. Ein Signal ist kein Urteil.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The green score, the broken promise", "Pika e gjelbër, premtimi i thyer", "Die grüne Zahl, das gebrochene Versprechen") },
    { page: "iv-calc", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Target versus control limit", "Objektivi kundrejt kufirit të kontrollit", "Ziel gegen Eingriffsgrenze") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Honest KPI Card", "Karta e KPI-së së ndershme", "Das ehrliche KPI-Blatt") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real categories of operational work, no invented personal incidents.", "Kategori të vërteta pune operacionale, pa ngjarje personale të shpikura.", "Echte Kategorien betrieblicher Arbeit, keine erfundenen persönlichen Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Research setting, date, method and limits stated together.", "Mjedisi i kërkimit, data, metoda dhe kufijtë, të thënë bashkë.", "Forschungsumfeld, Datum, Methode und Grenzen gemeinsam genannt.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("A KPI decision must survive a customer-and-quality check.", "Një vendim për KPI duhet t'i mbijetojë një kontrolli për klientin dhe cilësinë.", "Eine KPI-Entscheidung muss eine Kunden- und Qualitätsprüfung überstehen.") },
  ],
  sources: ["gl-campbell-1979", "goodhart-1975", "strathern-1997", "holmstrom-milgrom-1991", "kaplan-norton-1992", "gl-bevan-hood-2006", "van-thiel-leeuw-2002", "ihi-establishing-measures", "nist-control-charts", "nist-p-chart"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("A green score", "Një pikë e gjelbër", "Eine grüne Zahl"), x("can hide a bad day", "mund të fshehë një ditë të keqe", "kann einen schlechten Tag verbergen")],
      why: x(
        "Measurement is necessary. The problem begins when the number becomes easier to defend than the purpose it was supposed to serve.",
        "Matja është e nevojshme. Problemi nis kur numri bëhet më i lehtë për t'u mbrojtur se qëllimi të cilit duhej t'i shërbente.",
        "Messung ist notwendig. Das Problem beginnt, wenn die Zahl leichter zu verteidigen ist als der Zweck, dem sie dienen sollte."),
      body: x(
        "Operations managers do not have the luxury of managing only by instinct. A departure must be on time or late. A load must be complete or incomplete. A room must be ready or not. Every shift creates facts that deserve a record. Yet those records become dangerous when an indicator designed to reveal the work is treated as a complete judgment on the people and the service. The author has worked with last-mile measures such as Delay, Damage, Incomplete and Loading Time, and with reporting and handovers in hospitality. These contexts explain why a KPI can be both useful and incomplete. This sixth volume does not claim that any named employer manipulated a target, hid a defect or punished staff on the basis of a misleading dashboard. Its operational scenes are constructed illustrations, clearly marked wherever an event or measurement is invented. We begin with a deceptively positive score. Campbell and Goodhart explain why high-pressure targets can weaken the measures intended to guide management. Holmström and Milgrom show the incentives problem when some tasks are measurable and others less visible. Bevan and Hood provide a documented public-service case of gaming risk. Statistical process control distinguishes a management target from evidence of a changed process. The final chapters put the measures back into a balanced, auditable decision.",
        "Menaxherët e operacioneve nuk e kanë luksin të menaxhojnë vetëm me instinkt. Një nisje duhet të jetë në kohë ose e vonuar. Një ngarkesë duhet të jetë e plotë ose e paplotë. Një dhomë duhet të jetë gati ose jo. Çdo turn krijon fakte që meritojnë një regjistrim. Por këto regjistrime bëhen të rrezikshme kur një tregues i projektuar për ta zbuluar punën trajtohet si gjykim i plotë për njerëzit dhe shërbimin. Autori ka punuar me matje të miljes së fundit si Vonesa, Dëmi, E paplota dhe Koha e ngarkimit, dhe me raportimin dhe dorëzimet në mikpritje. Këto kontekste shpjegojnë pse një KPI mund të jetë njëkohësisht i dobishëm dhe i paplotë. Ky vëllim i gjashtë nuk pretendon se ndonjë punëdhënës i caktuar manipuloi një objektiv, fshehu një defekt apo ndëshkoi staf mbi bazën e një paneli mashtrues. Skenat e tij operacionale janë ilustrime të ndërtuara, të shënuara qartë kudo ku një ngjarje ose matje është e shpikur. Nisim me një pikë mashtruese pozitive. Campbell dhe Goodhart shpjegojnë pse objektivat me presion të lartë mund t'i dobësojnë matjet që duhej ta udhëhiqnin menaxhimin. Holmström dhe Milgrom tregojnë problemin e stimujve kur disa detyra maten dhe të tjera janë më pak të dukshme. Bevan dhe Hood japin një rast të dokumentuar të rrezikut të manipulimit në shërbimin publik. Kontrolli statistikor i procesit e dallon objektivin e menaxhimit nga prova e një procesi të ndryshuar. Kapitujt e fundit i kthejnë matjet në një vendim të balancuar dhe të auditueshëm.",
        "Betriebsleiter haben nicht den Luxus, nur nach Instinkt zu führen. Eine Abfahrt ist pünktlich oder verspätet. Eine Ladung ist vollständig oder nicht. Ein Zimmer ist bereit oder nicht. Jede Schicht erzeugt Fakten, die eine Aufzeichnung verdienen. Doch diese Aufzeichnungen werden gefährlich, wenn ein Indikator, der die Arbeit sichtbar machen soll, als vollständiges Urteil über Menschen und Service behandelt wird. Der Autor hat mit Last-Mile-Kennzahlen wie Verspätung, Schaden, Unvollständigkeit und Ladezeit gearbeitet und mit Berichten und Übergaben in der Hotellerie. Diese Kontexte erklären, warum ein KPI zugleich nützlich und unvollständig sein kann. Dieser sechste Band behauptet nicht, ein bestimmter Arbeitgeber habe ein Ziel manipuliert, einen Mangel verborgen oder Personal wegen eines irreführenden Dashboards bestraft. Seine Betriebsszenen sind konstruierte Illustrationen, klar gekennzeichnet, wo ein Ereignis oder eine Messung erfunden ist. Wir beginnen mit einer trügerisch positiven Zahl. Campbell und Goodhart erklären, warum Ziele unter hohem Druck die Kennzahlen schwächen können, die die Führung leiten sollen. Holmström und Milgrom zeigen das Anreizproblem, wenn manche Aufgaben messbar sind und andere weniger sichtbar. Bevan und Hood liefern einen dokumentierten Fall von Manipulationsrisiko im öffentlichen Dienst. Die statistische Prozesskontrolle unterscheidet ein Managementziel von einem Beleg für einen veränderten Prozess. Die letzten Kapitel fügen die Kennzahlen zu einer ausgewogenen, prüfbaren Entscheidung zusammen."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("What a KPI study", "Çfarë lejohet të thotë", "Was eine KPI-Studie"), x("is allowed to say", "një studim mbi KPI-të", "sagen darf")],
      lead: x(
        "A correlation between a target and a behaviour is not proof that every target causes manipulation.",
        "Një lidhje mes një objektivi dhe një sjelljeje nuk është provë se çdo objektiv shkakton manipulim.",
        "Eine Korrelation zwischen einem Ziel und einem Verhalten beweist nicht, dass jedes Ziel Manipulation verursacht."),
      blocks: [
        { type: "p", text: x(
          "This volume combines several kinds of evidence: theoretical papers on how control pressure or unequal measurement can alter behaviour, observational public-service research on documented risks in one institutional setting, statistical quality-control guidance on telling routine variation from unusual signals, and improvement guidance on practical families of measures. They produce no universal percentage for KPI gaming, establish no falsified result by anyone in the author's work, and do not show that a three-metric dashboard always prevents harmful incentives. They justify a disciplined set of questions for local verification.",
          "Ky vëllim bashkon disa lloje provash: punime teorike për mënyrën si presioni i kontrollit ose matja e pabarabartë mund ta ndryshojnë sjelljen, kërkim vëzhgues në shërbimin publik për rreziqe të dokumentuara në një mjedis institucional, udhëzim statistikor të kontrollit të cilësisë për dallimin e luhatjes rutinë nga sinjalet e pazakonta, dhe udhëzim përmirësimi për familje praktike matjesh. Ato nuk prodhojnë asnjë përqindje universale manipulimi të KPI-ve, nuk vërtetojnë asnjë rezultat të falsifikuar nga dikush në punën e autorit, dhe nuk tregojnë se një panel me tre tregues i parandalon gjithmonë stimujt e dëmshëm. Justifikojnë një tog të disiplinuar pyetjesh për verifikim lokal.",
          "Dieser Band verbindet mehrere Arten von Belegen: theoretische Arbeiten dazu, wie Kontrolldruck oder ungleiche Messung Verhalten verändern können, beobachtende Forschung im öffentlichen Dienst zu dokumentierten Risiken in einem institutionellen Umfeld, statistische Qualitätskontrolle zur Unterscheidung gewöhnlicher Streuung von ungewöhnlichen Signalen und Verbesserungsanleitung zu praktischen Kennzahlenfamilien. Sie liefern keinen universellen Prozentsatz für KPI-Manipulation, belegen kein gefälschtes Ergebnis von irgendjemandem in der Arbeit des Autors und zeigen nicht, dass ein Dashboard mit drei Kennzahlen schädliche Anreize immer verhindert. Sie rechtfertigen einen disziplinierten Satz von Fragen für die lokale Prüfung.") },
        { type: "cards", cols: 3, items: [
          { h: x("Observed", "E vëzhguar", "Beobachtet"), p: x("Publisher-identified finding, population, date and method.", "Gjetje me botues, popullatë, datë dhe metodë.", "Befund mit Herausgeber, Population, Datum und Methode.") },
          { h: x("Modelled", "E modeluar", "Modelliert"), p: x("Mathematical example with assumptions and reproducible inputs.", "Shembull matematik me supozime dhe të dhëna të riprodhueshme.", "Mathematisches Beispiel mit Annahmen und nachvollziehbaren Eingaben.") },
          { h: x("Proposed", "E propozuar", "Vorgeschlagen"), p: x("Editorial control, owner and test, awaiting local evidence.", "Kontroll editorial, përgjegjës dhe provë, që presin prova lokale.", "Redaktionelle Kontrolle, Verantwortlicher und Test, die auf lokale Belege warten.") },
        ] },
        { type: "p", text: x(
          "A green score can be both mathematically correct and operationally inadequate if the definition excludes a relevant customer consequence. Likewise, a red score can be a legitimate warning without proving misconduct or an unusual process shift. The reader should ask what the numerator and denominator mean, who is excluded, when events are counted and what happens outside the visible boundary.",
          "Një pikë e gjelbër mund të jetë njëkohësisht matematikisht e saktë dhe operacionalisht e pamjaftueshme, nëse përkufizimi e përjashton një pasojë përkatëse për klientin. Po ashtu, një pikë e kuqe mund të jetë paralajmërim legjitim pa provuar sjellje të keqe apo ndryshim të pazakontë procesi. Lexuesi duhet të pyesë çfarë kuptimi kanë numëruesi dhe emëruesi, kush përjashtohet, kur numërohen ngjarjet dhe çfarë ndodh jashtë kufirit të dukshëm.",
          "Eine grüne Zahl kann zugleich mathematisch richtig und betrieblich unzureichend sein, wenn die Definition eine relevante Kundenfolge ausschließt. Ebenso kann eine rote Zahl eine berechtigte Warnung sein, ohne Fehlverhalten oder eine ungewöhnliche Prozessverschiebung zu beweisen. Der Leser sollte fragen, was Zähler und Nenner bedeuten, wer ausgeschlossen ist, wann Ereignisse gezählt werden und was außerhalb der sichtbaren Grenze geschieht.") },
        { type: "callout", reading: true, text: x(
          "This is an evidence-informed operational treatise, not a statistical study of the author's workplaces.",
          "Ky është traktat operacional i mbështetur në prova, jo studim statistikor i vendeve të punës së autorit.",
          "Dies ist ein belegbasierter operativer Traktat, keine statistische Studie der Betriebe des Autors.") },
      ],
      note: x(
        "Campbell (1979), Holmström and Milgrom (1991), Bevan and Hood (2006), the NIST/SEMATECH e-Handbook and the IHI; all numerical operational cases are invented.",
        "Campbell (1979), Holmström dhe Milgrom (1991), Bevan dhe Hood (2006), e-Handbook i NIST/SEMATECH dhe IHI; të gjitha rastet numerike operacionale janë të shpikura.",
        "Campbell (1979), Holmström und Milgrom (1991), Bevan und Hood (2006), das NIST/SEMATECH e-Handbook und das IHI; alle numerischen Betriebsfälle sind erfunden."),
      source: ["gl-campbell-1979", "holmstrom-milgrom-1991", "gl-bevan-hood-2006", "nist-control-charts", "ihi-establishing-measures"],
    },

    // Chapter I. The green score, the broken promise
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The green score, the broken promise", "Pika e gjelbër, premtimi i thyer", "Die grüne Zahl, das gebrochene Versprechen"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "the-report-a-machine-wrote",
          title: [x("The green score,", "Pika e gjelbër,", "Die grüne Zahl,"), x("the broken promise", "premtimi i thyer", "das gebrochene Versprechen")],
          lead: x(
            "The dashboard is satisfied. The receiving person is not.",
            "Paneli është i kënaqur. Personi që merr punën, jo.",
            "Das Dashboard ist zufrieden. Die Person, die die Arbeit erhält, nicht."),
          blocks: [
            { type: "flag", text: x("Hypothetical last-mile scene, no documented incident", "Skenë hipotetike e miljes së fundit, pa ngjarje të dokumentuar", "Hypothetische Last-Mile-Szene, kein dokumentierter Vorfall") },
            { type: "p", text: x(
              "At a constructed loading station, a manager sees that departures are occurring faster than last week. The Loading Time indicator is green. The team has earned the result shown on its screen: the recorded interval from the defined start to the defined end is shorter. A delivery issue appears later. One part of an order has not reached the person who expected it. The departure statistic remains unchanged because the defect belongs to a different measure. Nothing in this scene proves that loading speed caused the missing item. The shortfall could have begun in preparation, recording, sorting, loading or a later handover. The managerial temptation is to tell the easy story: one measure improved and another person made a mistake. That is precisely the story that must be tested rather than announced.",
              "Në një stacion ngarkimi të ndërtuar, një menaxher sheh se nisjet po ndodhin më shpejt se javën e kaluar. Treguesi i kohës së ngarkimit është i gjelbër. Ekipi e ka fituar rezultatin që tregon ekrani: intervali i regjistruar nga fillimi i përkufizuar deri te fundi i përkufizuar është më i shkurtër. Më vonë shfaqet një problem dorëzimi. Një pjesë e një porosie nuk ka arritur te personi që e priste. Statistika e nisjeve mbetet e pandryshuar, sepse defekti i takon një matjeje tjetër. Asgjë në këtë skenë nuk provon se shpejtësia e ngarkimit e shkaktoi artikullin që mungon. Mungesa mund të ketë nisur në përgatitje, regjistrim, klasifikim, ngarkim ose në një dorëzim të mëvonshëm. Tundimi i menaxherit është të tregojë historinë e lehtë: një matje u përmirësua dhe një person tjetër bëri gabim. Pikërisht kjo është historia që duhet provuar, jo shpallur.",
              "An einer konstruierten Ladestation sieht eine Führungskraft, dass die Abfahrten schneller erfolgen als in der Vorwoche. Der Indikator Ladezeit ist grün. Das Team hat das Ergebnis auf seinem Bildschirm verdient: Das erfasste Intervall vom definierten Start bis zum definierten Ende ist kürzer. Später taucht ein Zustellproblem auf. Ein Teil eines Auftrags hat die Person, die ihn erwartete, nicht erreicht. Die Abfahrtsstatistik bleibt unverändert, weil der Mangel zu einer anderen Kennzahl gehört. Nichts in dieser Szene beweist, dass die Ladegeschwindigkeit den fehlenden Artikel verursacht hat. Der Fehlbestand kann in Vorbereitung, Erfassung, Sortierung, Beladung oder einer späteren Übergabe begonnen haben. Die Versuchung der Führung ist die einfache Geschichte: Eine Kennzahl wurde besser, und eine andere Person machte einen Fehler. Genau diese Geschichte muss geprüft werden, statt verkündet.") },
            { type: "p", text: x(
              "The author's documented last-mile work included Loading Time, Incomplete, missing bags and mixed trolleys as categories of operational attention. The event, its sequence and its outcome here are fictional. We use them only to ask what a metric can certify, and what it cannot.",
              "Puna e dokumentuar e autorit në miljen e fundit përfshinte Kohën e ngarkimit, Të paplotat, çantat që mungojnë dhe karrocat e përziera si kategori të vëmendjes operacionale. Ngjarja, radha dhe rezultati i saj këtu janë të sajuara. I përdorim vetëm për të pyetur çfarë mund të vërtetojë një matje, dhe çfarë jo.",
              "Die dokumentierte Last-Mile-Arbeit des Autors umfasste Ladezeit, Unvollständigkeit, fehlende Taschen und gemischte Wagen als Kategorien betrieblicher Aufmerksamkeit. Das Ereignis, seine Abfolge und sein Ausgang sind hier erfunden. Wir nutzen sie nur, um zu fragen, was eine Kennzahl bescheinigen kann und was nicht.") },
            { type: "callout", reading: true, text: x(
              "A metric can be accurate within its boundary and still tell too little about the customer's experience.",
              "Një matje mund të jetë e saktë brenda kufirit të vet dhe prapë të thotë tepër pak për përvojën e klientit.",
              "Eine Kennzahl kann innerhalb ihrer Grenze stimmen und trotzdem zu wenig über das Erlebnis des Kunden sagen.") },
          ],
          note: x(
            "Editorial composite of real operational categories; conceptual background in the IHI's outcome, process and balancing measures. The essay named below reads a machine's report the same way.",
            "Kompozim editorial i kategorive të vërteta operacionale; sfondi konceptual te matjet e rezultatit, procesit dhe balancimit të IHI-së. Eseja e emërtuar më poshtë e lexon njësoj raportin e një makine.",
            "Redaktionelle Zusammensetzung echter betrieblicher Kategorien; begrifflicher Hintergrund in den Ergebnis-, Prozess- und Ausgleichskennzahlen des IHI. Der unten genannte Essay liest den Bericht einer Maschine genauso."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("The measure is", "Matja nuk është", "Die Kennzahl ist"), x("not the mission", "misioni", "nicht die Mission")],
          lead: x(
            "Every indicator has a definition; every service has a larger purpose. A loading-time measure concerns one interval in a process. An incomplete-delivery measure concerns a different failure mode, and its denominator may count orders, bags or another unit. Both can be meaningful without being interchangeable. A percentage with an ambiguous denominator is not yet decision-grade evidence.",
            "Çdo tregues ka një përkufizim; çdo shërbim ka një qëllim më të madh. Një matje e kohës së ngarkimit ka të bëjë me një interval të procesit. Një matje e dorëzimeve të paplota ka të bëjë me një mënyrë tjetër dështimi, dhe emëruesi i saj mund të numërojë porosi, çanta ose një njësi tjetër. Të dyja mund të jenë kuptimplota pa qenë të këmbyeshme. Një përqindje me emërues të paqartë nuk është ende provë e nivelit të vendimit.",
            "Jeder Indikator hat eine Definition; jeder Service hat einen größeren Zweck. Eine Ladezeitkennzahl betrifft ein Intervall eines Prozesses. Eine Kennzahl für unvollständige Zustellung betrifft eine andere Fehlerart, und ihr Nenner kann Aufträge, Taschen oder eine andere Einheit zählen. Beide können aussagekräftig sein, ohne austauschbar zu sein. Ein Prozentsatz mit unklarem Nenner ist noch kein entscheidungsreifer Beleg."),
          blocks: [
            { type: "p", text: x(
              "The Institute for Healthcare Improvement distinguishes outcome, process and balancing measures. Outcome asks whether the service produces the intended result. Process asks whether the critical steps are working. Balancing asks whether the intervention creates new trouble elsewhere. This is a useful design lens outside healthcare, but the actual measures and acceptance criteria must be defined within the local operation.",
              "Institute for Healthcare Improvement dallon matjet e rezultatit, të procesit dhe të balancimit. Rezultati pyet nëse shërbimi e prodhon efektin e synuar. Procesi pyet nëse hapat kritikë po funksionojnë. Balancimi pyet nëse ndërhyrja krijon telashe të reja gjetiu. Është një lente e dobishme projektimi edhe jashtë shëndetësisë, por matjet e vërteta dhe kriteret e pranimit duhen përkufizuar brenda operacionit lokal.",
              "Das Institute for Healthcare Improvement unterscheidet Ergebnis-, Prozess- und Ausgleichskennzahlen. Das Ergebnis fragt, ob der Service die beabsichtigte Wirkung erzielt. Der Prozess fragt, ob die kritischen Schritte funktionieren. Der Ausgleich fragt, ob die Maßnahme anderswo neue Probleme schafft. Das ist auch außerhalb des Gesundheitswesens eine nützliche Gestaltungslinse, doch die tatsächlichen Kennzahlen und Annahmekriterien müssen im lokalen Betrieb definiert werden.") },
            { type: "rows", compact: true, items: [
              { h: x("Process", "Procesi", "Prozess"), p: x("Loading interval, scan-completion rate or a defined on-time handover.", "Intervali i ngarkimit, norma e skanimeve të plota ose një dorëzim i përkufizuar në kohë.", "Ladeintervall, Scan-Vollständigkeit oder eine definierte pünktliche Übergabe.") },
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("Complete, correct and timely service for the recipient.", "Shërbim i plotë, i saktë dhe në kohë për marrësin.", "Vollständiger, richtiger und pünktlicher Service für den Empfänger.") },
              { h: x("Balancing", "Balancimi", "Ausgleich"), p: x("Missing items, rework, safety deviations or new downstream waiting.", "Artikuj që mungojnë, ripunim, devijime sigurie ose pritje e re më poshtë në zinxhir.", "Fehlende Artikel, Nacharbeit, Sicherheitsabweichungen oder neues Warten weiter unten.") },
            ] },
            { type: "p", text: x(
              "It is tempting to merge these numbers into a single score. But a weighted average can conceal a severe outcome unless the weights, veto conditions and customer priorities are explicit. Some failures should never be traded away against faster throughput. The definition of an acceptable result comes before the dashboard design.",
              "Është tunduese t'i bashkosh këta numra në një pikë të vetme. Por një mesatare e ponderuar mund ta fshehë një rezultat të rëndë, nëse peshat, kushtet e vetos dhe përparësitë e klientit nuk janë të qarta. Disa dështime nuk duhen shkëmbyer kurrë me rrjedhë më të shpejtë. Përkufizimi i një rezultati të pranueshëm vjen para projektimit të panelit.",
              "Es ist verlockend, diese Zahlen zu einer einzigen Note zu verschmelzen. Doch ein gewichteter Durchschnitt kann ein schweres Ergebnis verbergen, wenn Gewichte, Vetobedingungen und Kundenprioritäten nicht ausdrücklich sind. Manche Fehler dürfen nie gegen schnelleren Durchsatz eingetauscht werden. Die Definition eines annehmbaren Ergebnisses kommt vor dem Entwurf des Dashboards.") },
            { type: "callout", reading: true, text: x(
              "Ask what changed for the customer before declaring that an internal target has been won.",
              "Pyet çfarë ndryshoi për klientin, para se të shpallësh se një objektiv i brendshëm është fituar.",
              "Fragen Sie, was sich für den Kunden geändert hat, bevor Sie ein internes Ziel für gewonnen erklären.") },
          ],
          note: x(
            "IHI, Establishing Measures; the logistics mapping is editorial, not validated at an identified site.",
            "IHI, Establishing Measures; përshtatja për logjistikën është editoriale, e pavërtetuar në ndonjë vend të identifikuar.",
            "IHI, Establishing Measures; die Übertragung auf die Logistik ist redaktionell, an keinem benannten Standort validiert."),
          source: ["ihi-establishing-measures"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Read the green", "Lexoje të gjelbrën", "Das Grün lesen,"), x("before you celebrate", "para se të festosh", "bevor Sie feiern")],
          lead: x(
            "A five-step review that tests a favourable KPI against the end-to-end service.",
            "Një rishikim me pesë hapa që e provon një KPI të favorshëm kundrejt shërbimit nga fillimi në fund.",
            "Eine Prüfung in fünf Schritten, die einen günstigen KPI am Service von Ende zu Ende misst."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the indicator boundary", "Emërto kufirin e treguesit", "Die Grenze des Indikators benennen"), p: x("Operational start, end, exclusions, time window, numerator, denominator and data source.", "Fillimi dhe fundi operacional, përjashtimet, dritarja kohore, numëruesi, emëruesi dhe burimi i të dhënave.", "Betrieblicher Start und Ende, Ausschlüsse, Zeitfenster, Zähler, Nenner und Datenquelle.") },
              { h: x("Check the underlying work", "Kontrollo punën poshtë tij", "Die zugrunde liegende Arbeit prüfen"), p: x("Are the events counted as good complete and usable downstream? Sample anonymised cases where permitted.", "A janë ngjarjet e numëruara si të mira të plota dhe të përdorshme më poshtë? Merr mostra rastesh anonime, ku lejohet.", "Sind die als gut gezählten Ereignisse weiter unten vollständig und nutzbar? Anonymisierte Fälle stichprobenartig prüfen, wo erlaubt.") },
              { h: x("Pair the customer outcome", "Vendos pranë rezultatin për klientin", "Das Kundenergebnis danebenlegen"), p: x("Read the service outcome and a balancing measure next to the improved process KPI.", "Lexo rezultatin e shërbimit dhe një matje balancimi pranë KPI-së së përmirësuar të procesit.", "Das Serviceergebnis und eine Ausgleichskennzahl neben dem verbesserten Prozess-KPI lesen.") },
              { h: x("Test plausible alternatives", "Provo shpjegimet e tjera të mundshme", "Plausible Alternativen prüfen"), p: x("Case mix, volume, cut-off rules, staffing and exceptional days, before assigning a cause.", "Përzierja e rasteve, volumi, rregullat e mbylljes, stafi dhe ditët e jashtëzakonshme, para se të caktosh një shkak.", "Fallmix, Volumen, Stichtagsregeln, Personal und Ausnahmetage, bevor eine Ursache zugewiesen wird.") },
              { h: x("Document the decision", "Dokumento vendimin", "Die Entscheidung dokumentieren"), p: x("What was confirmed, what is still unknown, who will verify it and when the team will hear back.", "Çfarë u konfirmua, çfarë mbetet e panjohur, kush do ta verifikojë dhe kur do të marrë përgjigje ekipi.", "Was bestätigt wurde, was noch unbekannt ist, wer es prüft und wann das Team Rückmeldung erhält.") },
            ] },
            { type: "p", text: x(
              "When Loading Time improves, also read completeness, on-time service and safety records. Two numbers moving together prove no cause; check that they share time windows and units, since a same-day process number and a next-day customer result may need aligning.",
              "Kur përmirësohet Koha e ngarkimit, lexo edhe plotësinë, shërbimin në kohë dhe regjistrat e sigurisë. Dy numra që lëvizin bashkë nuk provojnë shkak; kontrollo që të kenë të njëjtat dritare kohore dhe njësi, se një numër procesi i së njëjtës ditë dhe një rezultat klienti i së nesërmes mund të duan përputhje.",
              "Verbessert sich die Ladezeit, lesen Sie auch Vollständigkeit, pünktlichen Service und Sicherheitsaufzeichnungen. Zwei gemeinsam bewegte Zahlen beweisen keine Ursache; prüfen Sie, ob sie Zeitfenster und Einheiten teilen, denn eine Prozesszahl vom selben Tag und ein Kundenergebnis vom nächsten Tag müssen womöglich abgeglichen werden.") },
            { type: "callout", reading: true, text: x(
              "A green number should begin a short verification, not end the conversation.",
              "Një numër i gjelbër duhet ta nisë një verifikim të shkurtër, jo ta mbyllë bisedën.",
              "Eine grüne Zahl sollte eine kurze Prüfung beginnen, nicht das Gespräch beenden.") },
          ],
          note: x(
            "Editorial operating protocol after the IHI's measurement guidance; no claim of a formal employer-wide implementation.",
            "Protokoll operativ editorial sipas udhëzimit të IHI-së për matjen; asnjë pretendim për zbatim zyrtar te ndonjë punëdhënës.",
            "Redaktionelles Betriebsprotokoll nach der Messanleitung des IHI; keine Behauptung einer förmlichen Umsetzung bei einem Arbeitgeber."),
          source: ["ihi-establishing-measures"],
        },
      ],
    },

    // Chapter II. When a measure becomes a target
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("When a measure becomes a target", "Kur një matje bëhet objektiv", "Wenn eine Kennzahl zum Ziel wird"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "kpis-the-team-trusts",
          title: [x("The target", "Objektivi", "Das Ziel"), x("changes the room", "e ndryshon dhomën", "verändert den Raum")],
          lead: x(
            "A measurement programme can alter the very activity it is intended to observe.",
            "Një program matjeje mund ta ndryshojë pikërisht veprimtarinë që synon të vëzhgojë.",
            "Ein Messprogramm kann genau die Tätigkeit verändern, die es beobachten soll."),
          blocks: [
            { type: "flag", text: x("Constructed team meeting, not a recorded discussion", "Mbledhje ekipi e ndërtuar, jo diskutim i regjistruar", "Konstruierte Teambesprechung, keine aufgezeichnete Diskussion") },
            { type: "p", text: x(
              "In a fictional operations review, a manager announces that the only figure shown at the weekly meeting will be one rate of punctual departure. People naturally begin to focus their attention on the recorded departure event. Questions once asked about preparation accuracy, delayed information and recovery after a late start receive less time. The score remains useful, but the meeting has become narrower. No dishonest action is necessary for this shift to happen. People respond to what receives attention, praise and consequences. Staff may do exactly the work the formal measure encourages while leaving less measured responsibilities unattended. The risk is not a defect in the arithmetic; it is a defect in the design of the incentive system.",
              "Në një rishikim operacional të sajuar, një menaxher njofton se e vetmja shifër që do të tregohet në mbledhjen javore do të jetë një normë e nisjeve në kohë. Njerëzit nisin natyrshëm ta përqendrojnë vëmendjen te ngjarja e regjistruar e nisjes. Pyetjet që dikur bëheshin për saktësinë e përgatitjes, informacionin e vonuar dhe rikuperimin pas një nisjeje të vonuar marrin më pak kohë. Pika mbetet e dobishme, por mbledhja është ngushtuar. Nuk duhet asnjë veprim i pandershëm që ky ndryshim të ndodhë. Njerëzit u përgjigjen atyre që marrin vëmendje, lëvdata dhe pasoja. Stafi mund ta bëjë pikërisht punën që e nxit matja zyrtare, duke i lënë pa vëmendje përgjegjësitë më pak të matura. Rreziku nuk është defekt në aritmetikë; është defekt në projektimin e sistemit të stimujve.",
              "In einer fiktiven Betriebsbesprechung kündigt eine Führungskraft an, dass in der Wochensitzung nur noch eine Zahl gezeigt wird: die Quote pünktlicher Abfahrten. Die Leute richten ihre Aufmerksamkeit natürlich auf das erfasste Abfahrtsereignis. Fragen, die früher zur Genauigkeit der Vorbereitung, zu verspäteter Information und zur Erholung nach einem späten Start gestellt wurden, bekommen weniger Zeit. Die Zahl bleibt nützlich, aber die Sitzung ist enger geworden. Für diese Verschiebung ist keine unehrliche Handlung nötig. Menschen reagieren auf das, was Aufmerksamkeit, Lob und Konsequenzen erhält. Das Personal tut womöglich genau die Arbeit, die die formale Kennzahl fördert, und lässt weniger gemessene Pflichten liegen. Das Risiko ist kein Rechenfehler; es ist ein Fehler im Entwurf des Anreizsystems.") },
            { type: "p", text: x(
              "This is not an allegation about any named employer or person. The point is to introduce a documented theoretical concern: when we convert a diagnostic indicator into a strong control target, its relationship to the work can change.",
              "Ky nuk është akuzë për ndonjë punëdhënës apo person të caktuar. Qëllimi është të paraqitet një shqetësim teorik i dokumentuar: kur e kthejmë një tregues diagnostik në objektiv të fortë kontrolli, lidhja e tij me punën mund të ndryshojë.",
              "Das ist kein Vorwurf gegen einen bestimmten Arbeitgeber oder eine Person. Es geht darum, ein dokumentiertes theoretisches Anliegen einzuführen: Wenn wir einen diagnostischen Indikator in ein starkes Kontrollziel verwandeln, kann sich sein Verhältnis zur Arbeit ändern.") },
            { type: "callout", reading: true, text: x(
              "The stronger the consequence attached to one indicator, the more carefully its blind spots must be examined.",
              "Sa më e fortë pasoja e lidhur me një tregues, aq më me kujdes duhen shqyrtuar pikat e tij të verbra.",
              "Je stärker die Konsequenz an einem Indikator hängt, desto sorgfältiger müssen seine blinden Flecken geprüft werden.") },
          ],
          note: x(
            "Constructed scenario; theory in Goodhart (1975), Campbell (1979) and Holmström and Milgrom (1991). The essay named below asks which KPIs a team trusts.",
            "Skenar i ndërtuar; teoria te Goodhart (1975), Campbell (1979) dhe Holmström e Milgrom (1991). Eseja e emërtuar më poshtë pyet cilëve KPI u beson një ekip.",
            "Konstruiertes Szenario; Theorie bei Goodhart (1975), Campbell (1979) und Holmström und Milgrom (1991). Der unten genannte Essay fragt, welchen KPIs ein Team vertraut."),
        },
        {
          id: "ii-goodhart", layer: "concept",
          title: [x("Goodhart is a warning,", "Goodhart-i është paralajmërim,", "Goodhart ist eine Warnung,"), x("not a law of fate", "jo ligj i fatit", "kein Schicksalsgesetz")],
          lead: x(
            "The familiar slogan is a later generalisation of an earlier observation about statistical regularities.",
            "Slogani i njohur është përgjithësim i mëvonshëm i një vëzhgimi më të hershëm për rregullsitë statistikore.",
            "Der bekannte Slogan ist eine spätere Verallgemeinerung einer früheren Beobachtung über statistische Regelmäßigkeiten."),
          blocks: [
            { type: "p", text: x(
              "Charles Goodhart observed in monetary-policy analysis that a regularity used for control can cease to behave as it did before control. A popular paraphrase, associated with Marilyn Strathern's discussion of audit culture, says that a measure can cease to be a good measure when it becomes a target. These are related formulations, not two quotations from the same original text. Neither means that every target must fail. Their use in this volume is to challenge the assumption that a measure remains neutral after rewards and penalties are attached. Donald Campbell's 1979 treatment of planned social change also reminds evaluators that observed indicators may fail to reveal whether an intervention really caused the intended improvement. In complex systems, changing conditions and other interventions may move the same measure. A good trend can be real, an artefact of changed definitions or an effect of other influences.",
              "Charles Goodhart vuri re, në analizën e politikës monetare, se një rregullsi që përdoret për kontroll mund të pushojë së silluri siç sillej para kontrollit. Një parafrazë e njohur, e lidhur me diskutimin e Marilyn Strathern-it për kulturën e auditimit, thotë se një matje mund të pushojë së qeni matje e mirë kur bëhet objektiv. Këto janë formulime të afërta, jo dy citime nga i njëjti tekst origjinal. Asnjëra nuk do të thotë se çdo objektiv duhet të dështojë. Në këtë vëllim përdoren për ta vënë në pikëpyetje supozimin se një matje mbetet neutrale pasi i lidhen shpërblime dhe ndëshkime. Trajtimi i Donald Campbell-it i vitit 1979 për ndryshimin e planifikuar shoqëror u kujton gjithashtu vlerësuesve se treguesit e vëzhguar mund të mos zbulojnë nëse një ndërhyrje e shkaktoi vërtet përmirësimin e synuar. Në sisteme të ndërlikuara, kushtet që ndryshojnë dhe ndërhyrjet e tjera mund ta lëvizin të njëjtën matje. Një prirje e mirë mund të jetë e vërtetë, artefakt i përkufizimeve të ndryshuara ose efekt i ndikimeve të tjera.",
              "Charles Goodhart beobachtete in der geldpolitischen Analyse, dass eine zur Steuerung genutzte Regelmäßigkeit aufhören kann, sich so zu verhalten wie vor der Steuerung. Eine populäre Paraphrase, verbunden mit Marilyn Stratherns Diskussion der Auditkultur, sagt, eine Kennzahl könne aufhören, eine gute Kennzahl zu sein, wenn sie zum Ziel wird. Das sind verwandte Formulierungen, keine zwei Zitate aus demselben Originaltext. Keine davon bedeutet, dass jedes Ziel scheitern muss. In diesem Band dienen sie dazu, die Annahme zu hinterfragen, eine Kennzahl bleibe neutral, nachdem Belohnungen und Strafen daran hängen. Donald Campbells Arbeit von 1979 zu geplantem sozialem Wandel erinnert Evaluatoren zudem daran, dass beobachtete Indikatoren nicht zeigen müssen, ob eine Intervention die beabsichtigte Verbesserung wirklich verursacht hat. In komplexen Systemen können veränderte Bedingungen und andere Eingriffe dieselbe Kennzahl bewegen. Ein guter Trend kann echt sein, ein Artefakt geänderter Definitionen oder die Wirkung anderer Einflüsse.") },
            { type: "cards", cols: 3, items: [
              { h: x("Proxy", "Zëvendësues", "Stellvertreter"), p: x("The number represents only some qualities of the outcome.", "Numri përfaqëson vetëm disa cilësi të rezultatit.", "Die Zahl steht nur für einige Eigenschaften des Ergebnisses.") },
              { h: x("Pressure", "Presion", "Druck"), p: x("Visibility and consequences change incentives and attention.", "Dukshmëria dhe pasojat i ndryshojnë stimujt dhe vëmendjen.", "Sichtbarkeit und Konsequenzen verändern Anreize und Aufmerksamkeit.") },
              { h: x("Validity", "Vlefshmëri", "Gültigkeit"), p: x("Recheck whether the proxy still describes the outcome.", "Rikontrollo nëse zëvendësuesi e përshkruan ende rezultatin.", "Erneut prüfen, ob der Stellvertreter das Ergebnis noch beschreibt.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The problem is not using a target. It is forgetting that the target changes the context in which the measure is produced.",
              "Problemi nuk është përdorimi i një objektivi. Është harresa se objektivi e ndryshon kontekstin në të cilin prodhohet matja.",
              "Das Problem ist nicht, ein Ziel zu nutzen. Es ist zu vergessen, dass das Ziel den Kontext verändert, in dem die Kennzahl entsteht.") },
          ],
          note: x(
            "Goodhart (1975) as quoted by Bevan and Hood (2006); Strathern (1997) for the paraphrase; Campbell (1979). The three cards are editorial.",
            "Goodhart (1975) siç e citojnë Bevan dhe Hood (2006); Strathern (1997) për parafrazën; Campbell (1979). Tri kartat janë editoriale.",
            "Goodhart (1975), zitiert nach Bevan und Hood (2006); Strathern (1997) für die Paraphrase; Campbell (1979). Die drei Karten sind redaktionell."),
          source: ["goodhart-1975", "strathern-1997", "gl-campbell-1979"],
        },
        {
          id: "ii-effort", layer: "concept",
          title: [x("What gets measured", "Çfarë matet,", "Was gemessen wird,"), x("gets effort", "merr mundimin", "bekommt den Einsatz")],
          lead: x(
            "Multitask incentive theory explains why narrow scores can crowd out responsibilities that are difficult to quantify. Holmström and Milgrom's 1991 multitask principal-agent analysis studies how the design of rewards influences the allocation of effort across duties. In a job with several responsibilities, strong incentives tied to only the measurable ones can divert attention from the others. This is a theoretical mechanism, not an empirical measurement of the author's colleagues.",
            "Teoria e stimujve me shumë detyra shpjegon pse pikët e ngushta mund t'i shtyjnë mënjanë përgjegjësitë që vështirë se maten. Analiza e Holmström dhe Milgrom-it e vitit 1991 për marrëdhënien principal-agjent me shumë detyra studion si ndikon projektimi i shpërblimeve te shpërndarja e mundimit mes detyrave. Në një punë me disa përgjegjësi, stimujt e fortë të lidhur vetëm me ato të matshmet mund ta largojnë vëmendjen nga të tjerat. Ky është mekanizëm teorik, jo matje empirike e kolegëve të autorit.",
            "Die Anreiztheorie mit mehreren Aufgaben erklärt, warum enge Kennzahlen schwer quantifizierbare Pflichten verdrängen können. Holmström und Milgroms Prinzipal-Agent-Analyse von 1991 untersucht, wie die Gestaltung von Belohnungen die Verteilung des Einsatzes auf verschiedene Pflichten beeinflusst. In einem Job mit mehreren Verantwortungen können starke Anreize, die nur an die messbaren geknüpft sind, die Aufmerksamkeit von den anderen ablenken. Das ist ein theoretischer Mechanismus, keine empirische Messung der Kollegen des Autors."),
          blocks: [
            { type: "p", text: x(
              "A dispatcher does more than watch one dashboard: they coordinate, verify exceptions and communicate. A night auditor does more than generate a report: open work must be conveyed accurately to the next shift. A wholesale account manager does more than accept orders: availability and promises must remain credible. In each setting, some valuable activity is harder to capture in a clean daily percentage.",
              "Një dispeçer bën më shumë se të shikojë një panel: koordinon, verifikon përjashtime dhe komunikon. Një auditor nate bën më shumë se të prodhojë një raport: puna e hapur duhet t'i kalojë saktë turnit të radhës. Një menaxher llogarish me shumicë bën më shumë se të pranojë porosi: disponueshmëria dhe premtimet duhet të mbeten të besueshme. Në secilin mjedis, një pjesë e veprimtarisë së vlefshme kapet më vështirë në një përqindje të pastër ditore.",
              "Ein Disponent tut mehr, als ein Dashboard zu beobachten: Er koordiniert, prüft Ausnahmen und kommuniziert. Ein Nachtauditor tut mehr, als einen Bericht zu erzeugen: Offene Arbeit muss der nächsten Schicht richtig übergeben werden. Ein Großhandels-Kundenbetreuer tut mehr, als Aufträge anzunehmen: Verfügbarkeit und Zusagen müssen glaubwürdig bleiben. In jedem Umfeld lässt sich wertvolle Tätigkeit schwerer in einen sauberen Tagesprozentsatz fassen.") },
            { type: "rows", compact: true, items: [
              { h: x("Last-mile: on-time departures are easy to count", "Milja e fundit: nisjet në kohë numërohen lehtë", "Letzte Meile: pünktliche Abfahrten sind leicht zu zählen"), p: x("Downstream completeness is easy to miss.", "Plotësia më poshtë në zinxhir humbet lehtë.", "Nachgelagerte Vollständigkeit ist leicht zu übersehen.") },
              { h: x("Hotel handover: the report was sent", "Dorëzimi në hotel: raporti u dërgua", "Hotelübergabe: der Bericht wurde gesendet"), p: x("Whether the next shift can act is easy to miss.", "Nëse turni i radhës mund të veprojë, humbet lehtë.", "Ob die nächste Schicht handeln kann, ist leicht zu übersehen.") },
              { h: x("Wholesale: orders accepted", "Me shumicë: porositë e pranuara", "Großhandel: angenommene Aufträge"), p: x("Promise fulfilment is easy to miss.", "Përmbushja e premtimit humbet lehtë.", "Die Einlösung des Versprechens ist leicht zu übersehen.") },
            ] },
            { type: "p", text: x(
              "The rows are an editorial illustration of how task definitions can differ, not a claim that any of the three organisations paid incentives on these measures. A reasonable scorecard should include the harder-to-see responsibilities, through sampling or qualitative verification where numerical proxies are inadequate.",
              "Rreshtat janë ilustrim editorial se si mund të ndryshojnë përkufizimet e detyrave, jo pohim se ndonjëra nga tri organizatat pagoi stimuj mbi këto matje. Një tabelë e arsyeshme treguesish duhet t'i përfshijë përgjegjësitë më të vështira për t'u parë, me mostra ose verifikim cilësor aty ku zëvendësuesit numerikë nuk mjaftojnë.",
              "Die Zeilen illustrieren redaktionell, wie Aufgabendefinitionen sich unterscheiden können, und behaupten nicht, eine der drei Organisationen habe Anreize auf diese Kennzahlen gezahlt. Eine vernünftige Kennzahlentafel sollte die schwerer sichtbaren Pflichten einschließen, durch Stichproben oder qualitative Prüfung, wo numerische Stellvertreter nicht ausreichen.") },
            { type: "callout", reading: true, text: x(
              "When effort has several purposes, a single rewarded number rarely describes all of them.",
              "Kur mundimi ka disa qëllime, një numër i vetëm i shpërblyer rrallë i përshkruan të gjithë.",
              "Wenn Einsatz mehreren Zwecken dient, beschreibt eine einzige belohnte Zahl selten alle.") },
          ],
          note: x(
            "Holmström and Milgrom, Journal of Law, Economics, & Organization 7 (special issue), 1991; the work examples are interpretive.",
            "Holmström dhe Milgrom, Journal of Law, Economics, & Organization 7 (numër special), 1991; shembujt e punës janë interpretues.",
            "Holmström und Milgrom, Journal of Law, Economics, & Organization 7 (Sonderheft), 1991; die Arbeitsbeispiele sind deutend."),
          source: ["holmstrom-milgrom-1991"],
        },
        {
          id: "ii-research", layer: "concept",
          title: [x("When measurement", "Kur matja", "Wenn Messung"), x("becomes a game", "bëhet lojë", "zum Spiel wird")],
          lead: x(
            "Published evidence from public services illustrates risks without proving identical behaviour in private operations.",
            "Prova të botuara nga shërbimet publike ilustrojnë rreziqe, pa provuar sjellje të njëjtë në operacione private.",
            "Veröffentlichte Belege aus öffentlichen Diensten zeigen Risiken, ohne identisches Verhalten in privaten Betrieben zu beweisen."),
          blocks: [
            { type: "p", text: x(
              "Gwyn Bevan and Christopher Hood studied target-based governance in the English public healthcare system and described reported success alongside measurement problems and gaming risk. Their 2006 paper examines a particular policy environment, with high-stakes public targets and accountability arrangements. Its context matters: hospital services, political governance and public reporting are not the same as a privately operated loading ramp or hotel shift. Sandra van Thiel and Frans Leeuw described the performance paradox in the public sector: growing quantities of performance information may coexist with declining insight into actual performance, tunnel vision or analysis paralysis. Again, this is not evidence that the author has witnessed gaming. It is a reason to examine what the chosen indicator excludes and how the organisation responds to it.",
              "Gwyn Bevan dhe Christopher Hood studiuan qeverisjen me objektiva në sistemin publik shëndetësor anglez dhe përshkruan suksesin e raportuar bashkë me probleme matjeje dhe rrezik manipulimi. Punimi i tyre i vitit 2006 shqyrton një mjedis të caktuar politikash, me objektiva publike me rrezik të lartë dhe rregullime llogaridhënieje. Konteksti ka rëndësi: shërbimet spitalore, qeverisja politike dhe raportimi publik nuk janë e njëjta gjë me një rampë ngarkimi private apo një turn hoteli. Sandra van Thiel dhe Frans Leeuw e përshkruan paradoksin e performancës në sektorin publik: sasi në rritje informacioni për performancën mund të bashkëjetojnë me kuptim në rënie të performancës së vërtetë, me pamje të ngushtë ose paralizë analize. Sërish, kjo nuk është provë se autori ka parë manipulim. Është arsye për të shqyrtuar çfarë përjashton treguesi i zgjedhur dhe si i përgjigjet organizata.",
              "Gwyn Bevan und Christopher Hood untersuchten die zielbasierte Steuerung im englischen öffentlichen Gesundheitssystem und beschrieben berichteten Erfolg neben Messproblemen und Manipulationsrisiko. Ihre Arbeit von 2006 betrachtet ein bestimmtes politisches Umfeld mit öffentlichen Zielen von hoher Tragweite und Rechenschaftsregeln. Der Kontext zählt: Krankenhausdienste, politische Steuerung und öffentliche Berichterstattung sind nicht dasselbe wie eine privat betriebene Laderampe oder eine Hotelschicht. Sandra van Thiel und Frans Leeuw beschrieben das Leistungsparadox im öffentlichen Sektor: Wachsende Mengen an Leistungsinformation können mit abnehmender Einsicht in die tatsächliche Leistung, Tunnelblick oder Analyselähmung einhergehen. Auch das ist kein Beleg, dass der Autor Manipulation erlebt hätte. Es ist ein Grund zu prüfen, was der gewählte Indikator ausschließt und wie die Organisation darauf reagiert.") },
            { type: "p", text: x(
              "The practical response is not to accuse individuals whenever a score looks unusually good. Investigate the metric definition, any changes in eligibility or timing, the quality of supporting records, the incentives attached to the score and what independent customer outcomes say.",
              "Përgjigjja praktike nuk është të akuzosh individë sa herë një pikë duket e pazakonshme mirë. Heto përkufizimin e matjes, çdo ndryshim në përfshirje ose kohë, cilësinë e regjistrave mbështetës, stimujt e lidhur me pikën dhe çfarë thonë rezultatet e pavarura për klientin.",
              "Die praktische Antwort ist nicht, Einzelne zu beschuldigen, wann immer eine Zahl ungewöhnlich gut aussieht. Prüfen Sie die Definition der Kennzahl, Änderungen an Zulässigkeit oder Zeitpunkt, die Qualität der Belegdaten, die an der Zahl hängenden Anreize und die unabhängigen Kundenergebnisse.") },
            { type: "callout", reading: true, text: x(
              "A surprising score is a question for verification, not an accusation against the team.",
              "Një pikë befasuese është pyetje për verifikim, jo akuzë ndaj ekipit.",
              "Eine überraschende Zahl ist eine Frage für die Prüfung, keine Anklage gegen das Team.") },
          ],
          note: x(
            "Bevan and Hood, Public Administration 84(3), 2006; van Thiel and Leeuw, Public Performance & Management Review 25(3), 2002.",
            "Bevan dhe Hood, Public Administration 84(3), 2006; van Thiel dhe Leeuw, Public Performance & Management Review 25(3), 2002.",
            "Bevan und Hood, Public Administration 84(3), 2006; van Thiel und Leeuw, Public Performance & Management Review 25(3), 2002."),
          source: ["gl-bevan-hood-2006", "van-thiel-leeuw-2002"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Keep the target", "Mbaje objektivin", "Das Ziel"), x("from eating the measure", "pa e gllabëruar matjen", "von der Kennzahl fernhalten")],
          lead: x(
            "Five safeguards before an indicator is attached to praise, ranking or consequences.",
            "Pesë mbrojtje para se një tregues të lidhet me lëvdata, renditje ose pasoja.",
            "Fünf Schutzmaßnahmen, bevor ein Indikator an Lob, Rangfolge oder Konsequenzen geknüpft wird."),
          blocks: [
            { type: "steps", items: [
              { h: x("Keep a diagnostic copy", "Mbaj një kopje diagnostike", "Eine diagnostische Kopie behalten"), p: x("The measure used to learn stays separate from the number used to judge.", "Matja që përdoret për të mësuar mbetet e ndarë nga numri që përdoret për të gjykuar.", "Die Kennzahl zum Lernen bleibt getrennt von der Zahl zum Urteilen.") },
              { h: x("Name what the proxy cannot see", "Emërto çfarë nuk sheh dot zëvendësuesi", "Benennen, was der Stellvertreter nicht sieht"), p: x("The responsibilities that get no number, and how they will be sampled.", "Përgjegjësitë që nuk marrin numër, dhe si do të merren mostra për to.", "Die Pflichten ohne Zahl, und wie sie stichprobenartig geprüft werden.") },
              { h: x("Add a counter-measure", "Shto një matje kundërpeshuese", "Eine Gegenkennzahl hinzufügen"), p: x("A balancing indicator that would worsen if the target were pursued too narrowly.", "Një tregues balancues që do të keqësohej, po të ndiqej objektivi tepër ngushtë.", "Ein Ausgleichsindikator, der sich verschlechtern würde, wenn das Ziel zu eng verfolgt wird.") },
              { h: x("Freeze the definition", "Ngrije përkufizimin", "Die Definition einfrieren"), p: x("Eligibility, timing and exclusions versioned before the first comparison.", "Përfshirja, koha dhe përjashtimet me version, para krahasimit të parë.", "Zulässigkeit, Zeitpunkt und Ausschlüsse versioniert, vor dem ersten Vergleich.") },
              { h: x("Review the incentive, not only the score", "Rishiko stimulin, jo vetëm pikën", "Den Anreiz prüfen, nicht nur die Zahl"), p: x("Ask periodically what the target has started to reward, and what it has stopped noticing.", "Pyet herë pas here çfarë ka nisur të shpërblejë objektivi, dhe çfarë ka pushuar së vëni re.", "Regelmäßig fragen, was das Ziel inzwischen belohnt und was es nicht mehr bemerkt.") },
            ] },
            { type: "p", text: x(
              "An unusually good score deserves the same review as a bad one: the definition, the records behind it, any change in eligibility or timing, and what independent customer outcomes say. None of this presumes misconduct; it keeps the measure worth trusting.",
              "Një pikë e pazakontë e mirë meriton të njëjtin rishikim si një e keqe: përkufizimi, regjistrat pas saj, çdo ndryshim në përfshirje ose kohë, dhe çfarë thonë rezultatet e pavarura për klientin. Asgjë nga këto nuk nënkupton sjellje të keqe; thjesht e mban matjen të denjë për besim.",
              "Eine ungewöhnlich gute Zahl verdient dieselbe Prüfung wie eine schlechte: die Definition, die Aufzeichnungen dahinter, Änderungen an Zulässigkeit oder Zeitpunkt und die unabhängigen Kundenergebnisse. Nichts davon unterstellt Fehlverhalten; es hält die Kennzahl vertrauenswürdig.") },
            { type: "callout", reading: true, text: x(
              "A target is safe to use only while someone still checks what it has stopped measuring.",
              "Një objektiv është i sigurt për t'u përdorur vetëm sa kohë që dikush kontrollon ende çfarë ka pushuar së maturi.",
              "Ein Ziel ist nur so lange sicher, wie noch jemand prüft, was es nicht mehr misst.") },
          ],
          note: x(
            "Editorial protocol after Goodhart, Campbell, Holmström and Milgrom and Bevan and Hood; the author's PDF folds these safeguards into its research page.",
            "Protokoll editorial sipas Goodhart, Campbell, Holmström e Milgrom dhe Bevan e Hood; PDF-ja e autorit i mban këto mbrojtje brenda faqes së kërkimit.",
            "Redaktionelles Protokoll nach Goodhart, Campbell, Holmström und Milgrom sowie Bevan und Hood; das PDF des Autors fasst diese Schutzmaßnahmen in seiner Forschungsseite zusammen."),
          source: ["goodhart-1975", "gl-campbell-1979", "holmstrom-milgrom-1991", "gl-bevan-hood-2006"],
        },
      ],
    },

    // Chapter III. The hidden cost of one KPI
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The hidden cost of one KPI", "Kostoja e fshehur e një KPI-je", "Die verborgenen Kosten eines KPI"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "where-part-of-the-order-goes-missing",
          title: [x("The fast process", "Procesi i shpejtë", "Der schnelle Prozess"), x("and the extra work", "dhe puna shtesë", "und die Mehrarbeit")],
          lead: x(
            "Local speed can improve while an adjacent task inherits additional effort.",
            "Shpejtësia lokale mund të përmirësohet, ndërsa një detyrë fqinje trashëgon mundim shtesë.",
            "Lokale Geschwindigkeit kann sich verbessern, während eine benachbarte Aufgabe zusätzlichen Aufwand erbt."),
          blocks: [
            { type: "flag", text: x("Hypothetical service flow, no measured employer result", "Rrjedhë shërbimi hipotetike, pa rezultat të matur punëdhënësi", "Hypothetischer Serviceablauf, kein gemessenes Arbeitgeberergebnis") },
            { type: "p", text: x(
              "Imagine a team that reduces the time needed to close an incoming request. The dashboard shows more requests marked as processed before the deadline. A downstream colleague finds that some requests now arrive without information necessary to complete the service. The originating team may be doing the measured part faster, while the receiving team spends more time clarifying incomplete handovers. Neither the handover defect nor its cause is established by this short story. A proper inquiry would compare a sample of records before and after the change, verify whether the same type of requests were counted and distinguish a real process-design problem from a coincidence. The team needs a measure of work usable at the next step, not only the date at which the first step was marked finished.",
              "Përfytyro një ekip që e ul kohën që duhet për të mbyllur një kërkesë hyrëse. Paneli tregon më shumë kërkesa të shënuara si të përpunuara para afatit. Një koleg më poshtë në zinxhir zbulon se disa kërkesa tani mbërrijnë pa informacionin e nevojshëm për ta përfunduar shërbimin. Ekipi i parë mund ta bëjë më shpejt pjesën e matur, ndërsa ekipi marrës shpenzon më shumë kohë duke sqaruar dorëzime të paplota. As defekti i dorëzimit, as shkaku i tij nuk vërtetohen nga kjo histori e shkurtër. Një hetim i duhur do të krahasonte një mostër regjistrash para dhe pas ndryshimit, do të verifikonte nëse u numëruan të njëjtat lloje kërkesash dhe do ta dallonte një problem të vërtetë projektimi procesi nga një rastësi. Ekipit i duhet një matje e punës së përdorshme në hapin e radhës, jo vetëm data kur hapi i parë u shënua i mbaruar.",
              "Stellen Sie sich ein Team vor, das die Zeit zum Abschluss einer eingehenden Anfrage verkürzt. Das Dashboard zeigt mehr Anfragen, die vor der Frist als bearbeitet markiert sind. Ein Kollege weiter unten stellt fest, dass manche Anfragen nun ohne die Information ankommen, die zur Erledigung des Service nötig ist. Das erste Team erledigt den gemessenen Teil womöglich schneller, während das empfangende Team mehr Zeit damit verbringt, unvollständige Übergaben zu klären. Weder der Übergabemangel noch seine Ursache sind durch diese kurze Geschichte belegt. Eine ordentliche Untersuchung würde eine Stichprobe von Datensätzen vor und nach der Änderung vergleichen, prüfen, ob dieselben Anfragearten gezählt wurden, und ein echtes Prozessproblem von einem Zufall unterscheiden. Das Team braucht ein Maß für Arbeit, die im nächsten Schritt nutzbar ist, nicht nur das Datum, an dem der erste Schritt als fertig markiert wurde.") },
            { type: "p", text: x(
              "This scenario applies to orders, shift handovers and support requests in principle. It is deliberately not a factual claim about specific guest complaints, transactions, route adjustments or a documented process intervention.",
              "Ky skenar vlen në parim për porositë, dorëzimet e turneve dhe kërkesat për mbështetje. Me qëllim nuk është pohim faktik për ankesa të caktuara mysafirësh, transaksione, ndryshime rrugësh apo një ndërhyrje të dokumentuar procesi.",
              "Dieses Szenario gilt im Prinzip für Aufträge, Schichtübergaben und Supportanfragen. Es ist bewusst keine Tatsachenbehauptung über bestimmte Gästebeschwerden, Transaktionen, Routenanpassungen oder eine dokumentierte Prozessmaßnahme.") },
            { type: "callout", reading: true, text: x(
              "Faster completion at the first desk is not necessarily faster delivery to the customer.",
              "Përfundimi më i shpejtë në sportelin e parë nuk është doemos dorëzim më i shpejtë te klienti.",
              "Schnellerer Abschluss am ersten Schalter ist nicht unbedingt schnellere Lieferung an den Kunden.") },
          ],
          note: x(
            "Hypothetical comparison; conceptual sources the IHI's balancing measures and Kaplan and Norton (1992). The essay named below follows a part of an order that went missing.",
            "Krahasim hipotetik; burime konceptuale matjet balancuese të IHI-së dhe Kaplan e Norton (1992). Eseja e emërtuar më poshtë e ndjek një pjesë porosie që humbi.",
            "Hypothetischer Vergleich; begriffliche Quellen die Ausgleichskennzahlen des IHI und Kaplan und Norton (1992). Der unten genannte Essay verfolgt einen Teil eines Auftrags, der verloren ging."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("A balanced set is not", "Një tog i balancuar nuk është", "Ein ausgewogener Satz ist kein"), x("a crowded dashboard", "panel i mbushur", "überfülltes Dashboard")],
          lead: x(
            "The point is to protect the purpose of the work with complementary measures, not to measure everything. Kaplan and Norton introduced the Balanced Scorecard in 1992 to broaden attention beyond traditional financial measures, combining perspectives on customers, internal processes and organisational capability. It is a strategic management approach, not a rule that every operational dashboard must reproduce four boxes unchanged. A useful front-line scorecard can be simpler.",
            "Qëllimi është ta mbrosh qëllimin e punës me matje plotësuese, jo të masësh gjithçka. Kaplan dhe Norton e paraqitën Balanced Scorecard më 1992 për ta zgjeruar vëmendjen përtej matjeve tradicionale financiare, duke bashkuar këndvështrimet e klientëve, proceseve të brendshme dhe aftësisë organizative. Është qasje e menaxhimit strategjik, jo rregull që çdo panel operacional duhet t'i riprodhojë katër kutitë të pandryshuara. Një tabelë e dobishme treguesish për vijën e parë mund të jetë më e thjeshtë.",
            "Es geht darum, den Zweck der Arbeit mit ergänzenden Kennzahlen zu schützen, nicht darum, alles zu messen. Kaplan und Norton führten 1992 die Balanced Scorecard ein, um den Blick über traditionelle Finanzkennzahlen hinaus zu weiten und die Perspektiven von Kunden, internen Prozessen und organisatorischer Fähigkeit zu verbinden. Sie ist ein Ansatz der strategischen Führung, keine Regel, dass jedes operative Dashboard vier Kästen unverändert nachbilden muss. Eine nützliche Kennzahlentafel an der Front kann einfacher sein."),
          blocks: [
            { type: "p", text: x(
              "The IHI's outcome, process and balancing distinction provides a concrete test. If one team is asked to improve a process indicator, the review should include a result experienced by the customer and a countermeasure that can detect unwanted costs elsewhere. Measurement may also require a qualitative sample, because a tally of completed forms cannot tell whether the receiving colleague understands the open case.",
              "Dallimi i IHI-së mes rezultatit, procesit dhe balancimit jep një provë konkrete. Nëse një ekipi i kërkohet të përmirësojë një tregues procesi, rishikimi duhet të përfshijë një rezultat që e përjeton klienti dhe një kundërmasë që i zbulon kostot e padëshiruara gjetiu. Matja mund të kërkojë edhe një mostër cilësore, sepse numërimi i formularëve të plotësuar nuk tregon nëse kolegu marrës e kupton rastin e hapur.",
              "Die Unterscheidung des IHI zwischen Ergebnis, Prozess und Ausgleich liefert eine konkrete Prüfung. Soll ein Team einen Prozessindikator verbessern, muss die Prüfung ein vom Kunden erlebtes Ergebnis und eine Gegenmaßnahme einschließen, die unerwünschte Kosten anderswo erkennt. Messung kann auch eine qualitative Stichprobe verlangen, denn eine Zählung ausgefüllter Formulare sagt nicht, ob der empfangende Kollege den offenen Fall versteht.") },
            { type: "cards", cols: 3, items: [
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("The result a customer or receiving team actually values.", "Rezultati që vërtet e vlerëson klienti ose ekipi marrës.", "Das Ergebnis, das ein Kunde oder empfangendes Team wirklich schätzt.") },
              { h: x("Process", "Procesi", "Prozess"), p: x("A controllable step plausibly connected to that result.", "Një hap i kontrollueshëm, i lidhur besueshëm me atë rezultat.", "Ein steuerbarer Schritt, plausibel mit diesem Ergebnis verbunden.") },
              { h: x("Balancing", "Balancimi", "Ausgleich"), p: x("What might deteriorate if the process score is pushed.", "Çfarë mund të keqësohet, nëse pika e procesit shtyhet me forcë.", "Was sich verschlechtern könnte, wenn die Prozesszahl forciert wird.") },
            ] },
            { type: "p", text: x(
              "More measures can also create more noise. Choose a small family with different jobs; remove duplicates; define ownership; decide how often to review each. Any safety-critical exception should be visible in its own right rather than averaged away by a more favourable speed figure.",
              "Më shumë matje mund të krijojnë edhe më shumë zhurmë. Zgjidh një familje të vogël me punë të ndryshme; hiq dublikatat; përkufizo pronësinë; vendos sa shpesh rishikohet secila. Çdo përjashtim kritik për sigurinë duhet të jetë i dukshëm më vete, jo i tretur në mesatare nga një shifër më e favorshme shpejtësie.",
              "Mehr Kennzahlen können auch mehr Lärm erzeugen. Wählen Sie eine kleine Familie mit verschiedenen Aufgaben; entfernen Sie Doppelungen; legen Sie Verantwortung fest; entscheiden Sie, wie oft jede geprüft wird. Jede sicherheitskritische Ausnahme sollte für sich sichtbar sein, statt von einer günstigeren Geschwindigkeitszahl weggemittelt zu werden.") },
            { type: "callout", reading: true, text: x(
              "A balanced scorecard is a discipline of looking at the whole result, not an excuse for multiplying targets.",
              "Një tabelë e balancuar treguesish është disiplinë e të parit të rezultatit të plotë, jo justifikim për shumëfishimin e objektivave.",
              "Eine Balanced Scorecard ist die Disziplin, das ganze Ergebnis zu betrachten, keine Ausrede, Ziele zu vervielfachen.") },
          ],
          note: x(
            "Kaplan and Norton, Harvard Business Review, January–February 1992; IHI, Establishing Measures.",
            "Kaplan dhe Norton, Harvard Business Review, janar–shkurt 1992; IHI, Establishing Measures.",
            "Kaplan und Norton, Harvard Business Review, Januar–Februar 1992; IHI, Establishing Measures."),
          source: ["kaplan-norton-1992", "ihi-establishing-measures"],
        },
        {
          id: "iii-model", layer: "concept",
          title: [x("One measure improves.", "Një matje përmirësohet.", "Eine Kennzahl wird besser."), x("Another changes.", "Një tjetër ndryshon.", "Eine andere ändert sich.")],
          lead: x(
            "A completely synthetic numerical example shows why two indicators must be examined together: two periods of 1,000 orders each.",
            "Një shembull numerik krejt sintetik tregon pse dy tregues duhen shqyrtuar bashkë: dy periudha me nga 1.000 porosi.",
            "Ein vollständig synthetisches Zahlenbeispiel zeigt, warum zwei Indikatoren zusammen betrachtet werden müssen: zwei Perioden mit je 1.000 Aufträgen."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 80, hypothetical: true,
              label: x("Frequency per 1,000 orders, invented", "Shpeshtësia për 1.000 porosi, e shpikur", "Häufigkeit je 1.000 Aufträge, erfunden"),
              items: [
                { k: x("Late, period A", "Të vonuara, periudha A", "Verspätet, Periode A"), v: 80, n: x("80 · 8.0%", "80 · 8,0%", "80 · 8,0 %") },
                { k: x("Late, period B", "Të vonuara, periudha B", "Verspätet, Periode B"), v: 60, n: x("60 · 6.0%", "60 · 6,0%", "60 · 6,0 %") },
                { k: x("Incomplete, period A", "Të paplota, periudha A", "Unvollständig, Periode A"), v: 10, n: x("10 · 1.0%", "10 · 1,0%", "10 · 1,0 %") },
                { k: x("Incomplete, period B", "Të paplota, periudha B", "Unvollständig, Periode B"), v: 30, n: x("30 · 3.0%", "30 · 3,0%", "30 · 3,0 %"), alert: true },
              ] },
            { type: "p", text: x(
              "The late-order rate falls by two percentage points while the incomplete-order rate rises by two points. We have described two facts about the artificial table. We have not demonstrated that faster departures caused incomplete orders, nor decided whether one percentage point has the same value in the two outcomes. Also, a late and an incomplete order may be the same order: the counts cannot simply be added to infer a unique number of affected orders. A genuine analysis would need event definitions, overlap handling, confidence considerations, customer severity, comparable volume and evidence about the process change. Without those, the apparent trade-off is only a prompt for investigation.",
              "Norma e porosive të vonuara bie me dy pikë përqindjeje, ndërsa norma e porosive të paplota rritet me dy pikë. Kemi përshkruar dy fakte për tabelën artificiale. Nuk kemi treguar se nisjet më të shpejta i shkaktuan porositë e paplota, as kemi vendosur nëse një pikë përqindjeje ka të njëjtën vlerë në të dy rezultatet. Gjithashtu, një porosi e vonuar dhe një e paplotë mund të jenë e njëjta porosi: numrat nuk mund të mblidhen thjesht për të nxjerrë numrin e porosive të prekura. Një analizë e vërtetë do të kishte nevojë për përkufizime ngjarjesh, trajtim të mbivendosjes, konsiderata besueshmërie, rëndësi për klientin, volum të krahasueshëm dhe prova për ndryshimin e procesit. Pa to, kompromisi në dukje është vetëm nxitje për hetim.",
              "Die Quote verspäteter Aufträge sinkt um zwei Prozentpunkte, während die Quote unvollständiger Aufträge um zwei Punkte steigt. Wir haben zwei Fakten über die künstliche Tabelle beschrieben. Wir haben nicht gezeigt, dass schnellere Abfahrten unvollständige Aufträge verursachten, und nicht entschieden, ob ein Prozentpunkt in beiden Ergebnissen denselben Wert hat. Außerdem können ein verspäteter und ein unvollständiger Auftrag derselbe Auftrag sein: Die Zahlen lassen sich nicht einfach addieren, um die Zahl der betroffenen Aufträge zu erhalten. Eine echte Analyse bräuchte Ereignisdefinitionen, Umgang mit Überschneidungen, Konfidenzüberlegungen, Schwere für den Kunden, vergleichbares Volumen und Belege zur Prozessänderung. Ohne sie ist der scheinbare Zielkonflikt nur ein Anlass zur Untersuchung.") },
            { type: "callout", reading: true, text: x(
              "Do not add percentages with different meanings, and do not infer a cause from two lines on a chart.",
              "Mos mbledh përqindje me kuptime të ndryshme, dhe mos nxirr shkak nga dy vija në një grafik.",
              "Addieren Sie keine Prozentsätze mit verschiedenen Bedeutungen, und folgern Sie keine Ursache aus zwei Linien in einem Diagramm.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; measure taxonomy after the IHI.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; taksonomia e matjeve sipas IHI-së.",
            "Jeder Wert auf dieser Seite ist synthetisch, für diesen Band verfasst; Kennzahlentaxonomie nach dem IHI."),
          source: ["ihi-establishing-measures"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Put a guardrail", "Vendos një parmak", "Eine Leitplanke"), x("beside the goal", "pranë qëllimit", "neben das Ziel")],
          lead: x(
            "A practical protocol for reviewing an improvement without relocating its cost.",
            "Një protokoll praktik për rishikimin e një përmirësimi pa ia zhvendosur koston gjetiu.",
            "Ein praktisches Protokoll, um eine Verbesserung zu prüfen, ohne ihre Kosten zu verlagern."),
          blocks: [
            { type: "steps", items: [
              { h: x("State the primary goal", "Thuaj qëllimin kryesor", "Das Hauptziel festhalten"), p: x("The customer effect and the operational metric intended to lead toward it.", "Efekti për klientin dhe matja operacionale që duhet të çojë drejt tij.", "Die Kundenwirkung und die betriebliche Kennzahl, die dorthin führen soll.") },
              { h: x("Name a possible side effect", "Emërto një efekt anësor të mundshëm", "Eine mögliche Nebenwirkung benennen"), p: x("One or two plausible downstream or safety consequences.", "Një ose dy pasoja të besueshme më poshtë në zinxhir ose për sigurinë.", "Ein oder zwei plausible nachgelagerte oder sicherheitsbezogene Folgen.") },
              { h: x("Align the measurement scope", "Përputh fushën e matjes", "Den Messbereich abgleichen"), p: x("Match population, period and unit of analysis; record known missingness.", "Përputh popullatën, periudhën dhe njësinë e analizës; shëno mungesat e njohura.", "Population, Zeitraum und Analyseeinheit abgleichen; bekannte Lücken festhalten.") },
              { h: x("Decide before the pilot", "Vendos para pilotit", "Vor dem Pilot entscheiden"), p: x("Review triggers and non-negotiable stop conditions where policy warrants them.", "Shkaset e rishikimit dhe kushtet e ndalimit që nuk negociohen, ku e kërkon politika.", "Prüfauslöser und nicht verhandelbare Stoppbedingungen, wo die Regelung sie verlangt.") },
              { h: x("Check both sides", "Kontrollo të dyja anët", "Beide Seiten prüfen"), p: x("The result, the balancing signal and a small sample of actual work.", "Rezultatin, sinjalin balancues dhe një mostër të vogël pune të vërtetë.", "Das Ergebnis, das Ausgleichssignal und eine kleine Stichprobe echter Arbeit.") },
              { h: x("Preserve the distinction", "Ruaje dallimin", "Die Unterscheidung bewahren"), p: x("Worked, partially worked or not yet knowable: record which.", "Funksionoi, funksionoi pjesërisht apo nuk dihet ende: shëno cilën.", "Hat funktioniert, teilweise funktioniert oder noch nicht erkennbar: festhalten, was zutrifft.") },
            ] },
            { type: "p", text: x(
              "For a hotel handover, a timely report is one thing; whether the next shift has enough actionable information is another. For last-mile loading, departure timing and completeness may deserve paired attention. These are design proposals, not already verified combined KPIs for the author's workplaces.",
              "Për një dorëzim hoteli, një raport në kohë është një gjë; nëse turni i radhës ka mjaft informacion të veprueshëm, është tjetër. Për ngarkimin në miljen e fundit, koha e nisjes dhe plotësia mund të meritojnë vëmendje të çiftuar. Këto janë propozime projektimi, jo KPI të kombinuar të verifikuar tashmë për vendet e punës së autorit.",
              "Bei einer Hotelübergabe ist ein pünktlicher Bericht das eine; ob die nächste Schicht genug verwertbare Information hat, das andere. Bei der Last-Mile-Beladung verdienen Abfahrtszeit und Vollständigkeit womöglich gepaarte Aufmerksamkeit. Das sind Gestaltungsvorschläge, keine bereits geprüften kombinierten KPIs für die Betriebe des Autors.") },
            { type: "callout", reading: true, text: x(
              "You do not need a perfect dashboard to avoid celebrating a problem transferred to another team.",
              "Nuk të duhet një panel i përsosur për të mos festuar një problem të kaluar te një ekip tjetër.",
              "Sie brauchen kein perfektes Dashboard, um nicht ein Problem zu feiern, das an ein anderes Team verschoben wurde.") },
          ],
          note: x(
            "Editorial operating protocol from the IHI's measure families and Kaplan and Norton's balanced-performance lens.",
            "Protokoll operativ editorial nga familjet e matjeve të IHI-së dhe lentja e performancës së balancuar e Kaplan e Norton-it.",
            "Redaktionelles Betriebsprotokoll aus den Kennzahlenfamilien des IHI und der Linse der ausgewogenen Leistung von Kaplan und Norton."),
          source: ["ihi-establishing-measures", "kaplan-norton-1992"],
        },
      ],
    },

    // Chapter IV. The red number and the wrong blame
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The red number and the wrong blame", "Numri i kuq dhe faji i gabuar", "Die rote Zahl und die falsche Schuld"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "a-bad-day-or-a-problem",
          title: [x("The day", "Dita kur", "Der Tag, an dem"), x("the dashboard turns red", "paneli bëhet i kuq", "das Dashboard rot wird")],
          lead: x(
            "A worse number may require attention now. It does not always justify changing the process tomorrow.",
            "Një numër më i keq mund të kërkojë vëmendje tani. Jo gjithmonë justifikon ndryshimin e procesit nesër.",
            "Eine schlechtere Zahl kann jetzt Aufmerksamkeit verlangen. Sie rechtfertigt nicht immer, den Prozess morgen zu ändern."),
          blocks: [
            { type: "flag", text: x("Constructed manager review, no claimed event", "Rishikim menaxherial i ndërtuar, pa ngjarje të pretenduar", "Konstruierte Managementprüfung, kein behauptetes Ereignis") },
            { type: "p", text: x(
              "A manager sees a red daily rate on a performance screen. It is above a target. The instinct is to ask who caused it, and then to call an immediate meeting. But one daily proportion contains several questions that the colour cannot answer: How many opportunities were counted? Has the definition changed? Does the process normally fluctuate? Is this a genuine exceptional event or one observation in an already unstable system? The answer also depends on the nature of the defect. A serious safety incident, a compliance breach or a direct risk to customers demands immediate action according to policy even if no statistical alarm has occurred. For ordinary process improvement, however, reacting to every red point as proof of an assignable cause can create needless changes and more variability.",
              "Një menaxher sheh një normë ditore të kuqe në një ekran performance. Është mbi objektivin. Instinkti është të pyesë kush e shkaktoi, dhe pastaj të thërrasë një mbledhje të menjëhershme. Por një përpjesëtim i vetëm ditor përmban disa pyetje që ngjyra nuk i përgjigjet dot: Sa mundësi u numëruan? A ka ndryshuar përkufizimi? A luhatet normalisht procesi? A është kjo një ngjarje vërtet e jashtëzakonshme apo një vëzhgim i vetëm në një sistem tashmë të paqëndrueshëm? Përgjigjja varet edhe nga natyra e defektit. Një incident serioz sigurie, një shkelje pajtueshmërie ose një rrezik i drejtpërdrejtë për klientët kërkon veprim të menjëhershëm sipas politikës, edhe pa asnjë alarm statistikor. Për përmirësimin e zakonshëm të procesit, megjithatë, të reagosh ndaj çdo pike të kuqe si provë e një shkaku të caktueshëm mund të krijojë ndryshime të panevojshme dhe më shumë luhatje.",
              "Eine Führungskraft sieht eine rote Tagesquote auf einem Leistungsbildschirm. Sie liegt über einem Ziel. Der Instinkt ist zu fragen, wer das verursacht hat, und dann sofort eine Besprechung einzuberufen. Doch ein einzelner Tagesanteil enthält mehrere Fragen, die die Farbe nicht beantworten kann: Wie viele Gelegenheiten wurden gezählt? Hat sich die Definition geändert? Schwankt der Prozess normalerweise? Ist das ein echtes Ausnahmeereignis oder eine Beobachtung in einem ohnehin instabilen System? Die Antwort hängt auch von der Art des Mangels ab. Ein ernster Sicherheitsvorfall, ein Compliance-Verstoß oder ein direktes Risiko für Kunden verlangt sofortiges Handeln nach Regelung, auch ohne statistischen Alarm. Bei gewöhnlicher Prozessverbesserung aber kann es unnötige Änderungen und mehr Streuung erzeugen, auf jeden roten Punkt als Beweis einer zuweisbaren Ursache zu reagieren.") },
            { type: "p", text: x(
              "The author has worked with daily performance discussions, loading deviations and hotel reports, but there is no verified personal case in which a particular red cell caused the precise sequence described here.",
              "Autori ka punuar me diskutime ditore performance, devijime ngarkimi dhe raporte hoteli, por nuk ka asnjë rast personal të verifikuar ku një qelizë e kuqe e caktuar të ketë shkaktuar radhën e saktë të përshkruar këtu.",
              "Der Autor hat mit täglichen Leistungsgesprächen, Ladeabweichungen und Hotelberichten gearbeitet, doch es gibt keinen geprüften persönlichen Fall, in dem eine bestimmte rote Zelle genau die hier beschriebene Abfolge auslöste.") },
            { type: "callout", reading: true, text: x(
              "A red colour is an invitation to verify. It is not a complete explanation.",
              "Një ngjyrë e kuqe është ftesë për të verifikuar. Nuk është shpjegim i plotë.",
              "Eine rote Farbe ist eine Einladung zur Prüfung. Sie ist keine vollständige Erklärung.") },
          ],
          note: x(
            "Constructed scene; the statistical distinction follows the NIST/SEMATECH e-Handbook. The essay named below asks whether it was a bad day or a problem.",
            "Skenë e ndërtuar; dallimi statistikor ndjek e-Handbook-un e NIST/SEMATECH. Eseja e emërtuar më poshtë pyet nëse ishte një ditë e keqe apo një problem.",
            "Konstruierte Szene; die statistische Unterscheidung folgt dem NIST/SEMATECH e-Handbook. Der unten genannte Essay fragt, ob es ein schlechter Tag oder ein Problem war."),
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("A business target", "Një objektiv biznesi", "Ein Geschäftsziel"), x("is not a control limit", "nuk është kufi kontrolli", "ist keine Eingriffsgrenze")],
          lead: x(
            "Two horizontal lines can look identical on a chart and answer different questions. A business target expresses a desired service level. A statistical control limit is derived from a model of how a process varies when its underlying mechanism is sufficiently stable. A daily value may fail the target while remaining within expected variation; a sudden signal can occur while the value still meets the target.",
            "Dy vija horizontale mund të duken të njëjta në një grafik dhe t'u përgjigjen pyetjeve të ndryshme. Një objektiv biznesi shpreh një nivel të dëshiruar shërbimi. Një kufi statistikor kontrolli nxirret nga një model se si luhatet një proces kur mekanizmi i tij themelor është mjaft i qëndrueshëm. Një vlerë ditore mund ta humbasë objektivin duke mbetur brenda luhatjes së pritshme; një sinjal i papritur mund të ndodhë ndërsa vlera e plotëson ende objektivin.",
            "Zwei waagerechte Linien können in einem Diagramm gleich aussehen und verschiedene Fragen beantworten. Ein Geschäftsziel drückt ein gewünschtes Serviceniveau aus. Eine statistische Eingriffsgrenze leitet sich aus einem Modell ab, wie ein Prozess streut, wenn sein zugrunde liegender Mechanismus hinreichend stabil ist. Ein Tageswert kann das Ziel verfehlen und innerhalb der erwarteten Streuung bleiben; ein plötzliches Signal kann auftreten, während der Wert das Ziel noch erfüllt."),
          blocks: [
            { type: "p", text: x(
              "NIST describes control charts as measurements plotted over time with a centre line and control limits. The limits are chosen according to statistical assumptions and the chart type. For proportions of nonconforming units, a p-chart may be appropriate if the counted opportunities and dependence assumptions support it. A target set by management is neither the centre line nor the upper control limit.",
              "NIST i përshkruan grafikët e kontrollit si matje të vizatuara në kohë, me një vijë qendrore dhe kufij kontrolli. Kufijtë zgjidhen sipas supozimeve statistikore dhe llojit të grafikut. Për përpjesëtime të njësive jokonforme, një p-grafik mund të jetë i përshtatshëm, nëse mundësitë e numëruara dhe supozimet e varësisë e mbështesin. Një objektiv i vendosur nga menaxhmenti nuk është as vija qendrore, as kufiri i sipërm i kontrollit.",
              "NIST beschreibt Regelkarten als über die Zeit aufgetragene Messungen mit einer Mittellinie und Eingriffsgrenzen. Die Grenzen werden nach statistischen Annahmen und dem Kartentyp gewählt. Für Anteile fehlerhafter Einheiten kann eine p-Karte geeignet sein, wenn die gezählten Gelegenheiten und die Unabhängigkeitsannahmen es tragen. Ein von der Führung gesetztes Ziel ist weder die Mittellinie noch die obere Eingriffsgrenze.") },
            { type: "cards", cols: 3, items: [
              { h: x("Target", "Objektivi", "Ziel"), p: x("What performance we want or require.", "Çfarë performance duam ose kërkojmë.", "Welche Leistung wir wollen oder verlangen.") },
              { h: x("Control limit", "Kufiri i kontrollit", "Eingriffsgrenze"), p: x("What the process model predicts as routine variation.", "Çfarë parashikon modeli i procesit si luhatje rutinë.", "Was das Prozessmodell als gewöhnliche Streuung vorhersagt.") },
              { h: x("Safety trigger", "Shkasi i sigurisë", "Sicherheitsauslöser"), p: x("What policy requires immediate action regardless of the chart.", "Çfarë kërkon politika si veprim të menjëhershëm, pavarësisht grafikut.", "Was die Regelung unabhängig vom Diagramm sofort verlangt.") },
            ] },
            { type: "p", text: x(
              "Some processes do not justify a Shewhart chart without more work. Varying case mix, serial dependence, changing denominators or an unstable baseline can invalidate a simple formula. Control charts are tools for disciplined investigation, not instant verdicts on individuals.",
              "Disa procese nuk e justifikojnë një grafik Shewhart pa punë shtesë. Përzierja e ndryshueshme e rasteve, varësia në seri, emëruesit që ndryshojnë ose një gjendje fillestare e paqëndrueshme mund ta zhvlerësojnë një formulë të thjeshtë. Grafikët e kontrollit janë mjete për hetim të disiplinuar, jo verdikte të çastit për individët.",
              "Manche Prozesse rechtfertigen eine Shewhart-Karte nicht ohne weitere Arbeit. Wechselnder Fallmix, serielle Abhängigkeit, veränderliche Nenner oder eine instabile Ausgangslage können eine einfache Formel entwerten. Regelkarten sind Werkzeuge für disziplinierte Untersuchung, keine sofortigen Urteile über Einzelne.") },
            { type: "callout", reading: true, text: x(
              "Missed target, unusual signal and unsafe condition are three separate management questions.",
              "Objektivi i humbur, sinjali i pazakontë dhe gjendja e pasigurt janë tri pyetje të ndara menaxhimi.",
              "Verfehltes Ziel, ungewöhnliches Signal und unsichere Lage sind drei getrennte Führungsfragen.") },
          ],
          note: x(
            "NIST/SEMATECH e-Handbook, sections 6.3.1 and 6.3.3.2.",
            "e-Handbook i NIST/SEMATECH, seksionet 6.3.1 dhe 6.3.3.2.",
            "NIST/SEMATECH e-Handbook, Abschnitte 6.3.1 und 6.3.3.2."),
          source: ["nist-control-charts", "nist-p-chart"],
        },
        {
          id: "iv-calc", layer: "concept",
          title: [x("The red point", "Pika e kuqe", "Der rote Punkt"), x("inside the expected range", "brenda intervalit të pritshëm", "innerhalb des erwarteten Bereichs")],
          lead: x(
            "An illustrative p-chart calculation with fixed sample size and explicit assumptions: UCL = p₀ + 3√[p₀(1 − p₀)/n], with p₀ = 0.015 and n = 1,000 opportunities per day. The upper 3-sigma limit is about 0.0265 (2.65%); the lower limit is about 0.0035 (0.35%).",
            "Një llogari ilustruese p-grafiku me madhësi të fiksuar mostre dhe supozime të qarta: UCL = p₀ + 3√[p₀(1 − p₀)/n], me p₀ = 0,015 dhe n = 1.000 mundësi në ditë. Kufiri i sipërm 3-sigma është rreth 0,0265 (2,65%); kufiri i poshtëm rreth 0,0035 (0,35%).",
            "Eine illustrative p-Karten-Rechnung mit fester Stichprobengröße und ausdrücklichen Annahmen: UCL = p₀ + 3√[p₀(1 − p₀)/n], mit p₀ = 0,015 und n = 1.000 Gelegenheiten je Tag. Die obere 3-Sigma-Grenze liegt bei etwa 0,0265 (2,65 %); die untere bei etwa 0,0035 (0,35 %)."),
          blocks: [
            { type: "flag", text: x("Synthetic baseline, assuming independent binomial counts", "Gjendje fillestare sintetike, me supozimin e numërimeve binomiale të pavarura", "Synthetische Ausgangslage, unter Annahme unabhängiger Binomialzählungen") },
            { type: "columns", max: 3, height: 105, hypothetical: true,
              label: x("Daily share of incomplete orders, per cent, invented", "Pjesa ditore e porosive të paplota, në përqindje, e shpikur", "Tagesanteil unvollständiger Aufträge, in Prozent, erfunden"),
              items: [
                { k: x("Business target", "Objektivi i biznesit", "Geschäftsziel"), v: 1.0, n: x("1.00%", "1,00%", "1,00 %") },
                { k: x("Baseline p₀", "Gjendja fillestare p₀", "Ausgangswert p₀"), v: 1.5, n: x("1.50%", "1,50%", "1,50 %") },
                { k: x("Observed day", "Dita e vëzhguar", "Beobachteter Tag"), v: 2.3, n: x("23/1,000 = 2.30%", "23/1.000 = 2,30%", "23/1.000 = 2,30 %"), alert: true },
                { k: x("Upper control limit", "Kufiri i sipërm i kontrollit", "Obere Eingriffsgrenze"), v: 2.65, n: x("2.65%", "2,65%", "2,65 %") },
              ] },
            { type: "p", text: x(
              "The day at 2.30% fails the business target but, under this simplified chart, does not cross the upper control limit. That does not certify the day as acceptable: statistical evidence of a changed mechanism is a different question from service adequacy. The calculation assumes a stable historical proportion, independent opportunities and consistent definitions, conditions that real data must be checked for. The UCL is a conventional p-chart calculation, not an employer threshold, and no real baseline is disclosed.",
              "Dita me 2,30% e humbet objektivin e biznesit, por sipas këtij grafiku të thjeshtuar nuk e kalon kufirin e sipërm të kontrollit. Kjo nuk e vërteton ditën si të pranueshme: prova statistikore e një mekanizmi të ndryshuar është pyetje tjetër nga mjaftueshmëria e shërbimit. Llogaria supozon një përpjesëtim historik të qëndrueshëm, mundësi të pavarura dhe përkufizime të njëtrajtshme, kushte që te të dhënat e vërteta duhen kontrolluar. UCL është llogari konvencionale p-grafiku, jo prag punëdhënësi, dhe nuk zbulohet asnjë gjendje fillestare e vërtetë.",
              "Der Tag mit 2,30 % verfehlt das Geschäftsziel, überschreitet unter dieser vereinfachten Karte aber nicht die obere Eingriffsgrenze. Das erklärt den Tag nicht für annehmbar: Der statistische Beleg eines veränderten Mechanismus ist eine andere Frage als die Angemessenheit des Service. Die Rechnung setzt einen stabilen historischen Anteil, unabhängige Gelegenheiten und einheitliche Definitionen voraus, Bedingungen, die reale Daten prüfen müssen. Die UCL ist eine konventionelle p-Karten-Rechnung, keine Arbeitgeberschwelle, und keine echte Ausgangslage wird offengelegt.") },
            { type: "callout", reading: true, text: x(
              "An undesirable rate can be ordinary for a poorly performing process. Routine does not mean good.",
              "Një normë e padëshiruar mund të jetë e zakonshme për një proces që punon dobët. Rutinë nuk do të thotë mirë.",
              "Eine unerwünschte Quote kann für einen schlecht laufenden Prozess gewöhnlich sein. Gewöhnlich heißt nicht gut.") },
          ],
          note: x(
            "Synthetic p-chart example from the NIST proportions-chart formula: 3√(0.015 × 0.985 / 1,000) ≈ 0.0115, so UCL ≈ 2.65% and LCL ≈ 0.35%. No local baseline or test result is claimed.",
            "Shembull sintetik p-grafiku nga formula e NIST për grafikët e përpjesëtimeve: 3√(0,015 × 0,985 / 1.000) ≈ 0,0115, pra UCL ≈ 2,65% dhe LCL ≈ 0,35%. Nuk pretendohet asnjë gjendje fillestare apo rezultat lokal.",
            "Synthetisches p-Karten-Beispiel nach der NIST-Formel für Anteilskarten: 3√(0,015 × 0,985 / 1.000) ≈ 0,0115, also UCL ≈ 2,65 % und LCL ≈ 0,35 %. Keine lokale Ausgangslage und kein Testergebnis wird behauptet."),
          source: ["nist-p-chart"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Investigate the red", "Heto të kuqen", "Das Rot untersuchen,"), x("without inventing a culprit", "pa shpikur një fajtor", "ohne einen Schuldigen zu erfinden")],
          lead: x(
            "A proportionate response to a data signal, a service breach or a safety risk.",
            "Një përgjigje e përpjesëtuar ndaj një sinjali të dhënash, një shkeljeje shërbimi ose një rreziku sigurie.",
            "Eine verhältnismäßige Antwort auf ein Datensignal, einen Serviceverstoß oder ein Sicherheitsrisiko."),
          blocks: [
            { type: "steps", items: [
              { h: x("Check immediate risk", "Kontrollo rrezikun e menjëhershëm", "Akutes Risiko prüfen"), p: x("Safety, guest-protection and compliance rules first, whenever a hazard is active.", "Së pari rregullat e sigurisë, mbrojtjes së mysafirëve dhe pajtueshmërisë, sa herë ka rrezik aktiv.", "Zuerst Sicherheits-, Gästeschutz- und Compliance-Regeln, wenn eine Gefahr akut ist.") },
              { h: x("Validate the entry", "Vërteto shënimin", "Den Eintrag prüfen"), p: x("Source, timestamp, denominator, inclusion rules, pending corrections.", "Burimi, ora, emëruesi, rregullat e përfshirjes, korrigjimet në pritje.", "Quelle, Zeitstempel, Nenner, Einschlussregeln, ausstehende Korrekturen.") },
              { h: x("Locate the question", "Gjej pyetjen", "Die Frage einordnen"), p: x("Target miss, unusual process signal, recurring customer harm, or several?", "Objektiv i humbur, sinjal i pazakontë procesi, dëm i përsëritur për klientin, apo disa?", "Verfehltes Ziel, ungewöhnliches Prozesssignal, wiederkehrender Kundenschaden oder mehrere?") },
              { h: x("Talk to the process owners", "Fol me pronarët e procesit", "Mit den Prozessverantwortlichen sprechen"), p: x("What conditions were present, from senders and receivers; no blame first.", "Cilat kushte ishin të pranishme, nga dërguesit dhe marrësit; pa faj së pari.", "Welche Bedingungen vorlagen, von Sendenden und Empfangenden; keine Schuld zuerst.") },
              { h: x("Test an explanation", "Provo një shpjegim", "Eine Erklärung testen"), p: x("Comparable periods, case mix and direct observation before changing the routine.", "Periudha të krahasueshme, përzierja e rasteve dhe vëzhgim i drejtpërdrejtë, para se të ndryshosh rutinën.", "Vergleichbare Perioden, Fallmix und direkte Beobachtung, bevor die Routine geändert wird.") },
              { h: x("Close the response", "Mbyll përgjigjen", "Die Antwort abschließen"), p: x("Verified, unresolved, next action and who receives feedback.", "E verifikuar, e pazgjidhur, veprimi i radhës dhe kush merr përgjigje.", "Geprüft, offen, nächster Schritt und wer Rückmeldung erhält.") },
            ] },
            { type: "p", text: x(
              "A team should not have to defend itself against a different root-cause story each morning; nor may statistical caution excuse ignoring a dangerous condition or a chronic service failure. The decision fits the risk and the quality of the evidence.",
              "Një ekip nuk duhet të mbrohet çdo mëngjes nga një histori tjetër shkaku; as kujdesi statistikor nuk justifikon shpërfilljen e një gjendjeje të rrezikshme apo një dështimi kronik shërbimi. Vendimi i përshtatet rrezikut dhe cilësisë së provës.",
              "Ein Team sollte sich nicht jeden Morgen gegen eine andere Ursachengeschichte verteidigen müssen; ebenso wenig entschuldigt statistische Vorsicht, einen gefährlichen Zustand oder ein chronisches Serviceversagen zu ignorieren. Die Entscheidung passt zum Risiko und zur Qualität der Belege.") },
            { type: "callout", reading: true, text: x(
              "The right response is not always faster. It is better matched to what the signal actually tells us.",
              "Përgjigjja e duhur nuk është gjithmonë më e shpejtë. Është më e përshtatur me atë që na thotë vërtet sinjali.",
              "Die richtige Antwort ist nicht immer schneller. Sie passt besser zu dem, was das Signal tatsächlich sagt.") },
          ],
          note: x(
            "Editorial protocol informed by NIST control-chart guidance and common operational escalation principles.",
            "Protokoll editorial i mbështetur te udhëzimi i NIST për grafikët e kontrollit dhe parimet e zakonshme operacionale të eskalimit.",
            "Redaktionelles Protokoll nach der NIST-Anleitung zu Regelkarten und üblichen betrieblichen Eskalationsgrundsätzen."),
          source: ["nist-control-charts"],
        },
      ],
    },

    // Chapter V. The scorecard that tells the truth
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("The scorecard that tells the truth", "Tabela e treguesve që thotë të vërtetën", "Die Kennzahlentafel, die die Wahrheit sagt"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "kpis-do-not-improve-in-excel",
          title: [x("One average,", "Një mesatare,", "Ein Durchschnitt,"), x("two different days", "dy ditë të ndryshme", "zwei verschiedene Tage")],
          lead: x(
            "When the mix of work changes, an aggregate KPI can tell the opposite story from its components.",
            "Kur ndryshon përzierja e punës, një KPI i përgjithshëm mund të tregojë historinë e kundërt nga përbërësit e vet.",
            "Ändert sich der Arbeitsmix, kann ein aggregierter KPI das Gegenteil seiner Bestandteile erzählen."),
          blocks: [
            { type: "flag", text: x("Purely numerical illustration, no employer data", "Ilustrim thjesht numerik, pa të dhëna punëdhënësi", "Rein numerische Illustration, keine Arbeitgeberdaten") },
            { type: "p", text: x(
              "A manager reviews two periods of service. In each category of work, performance improves. The simpler requests are completed more reliably; the complex requests are also handled more reliably. Yet the overall on-time percentage falls. No one has falsified a count. The dashboard has changed because the proportion of difficult work has changed dramatically. The manager who reads only the total may conclude that the team has deteriorated. The colleague who reads the categories may conclude that the process has improved. Both can point to correct arithmetic. The missing information is the composition of the denominator. The next page makes the effect visible with synthetic integer counts that anyone can recalculate.",
              "Një menaxher rishikon dy periudha shërbimi. Në çdo kategori pune, performanca përmirësohet. Kërkesat më të thjeshta përfundohen më me besueshmëri; edhe kërkesat e ndërlikuara trajtohen më me besueshmëri. Megjithatë përqindja e përgjithshme në kohë bie. Askush nuk ka falsifikuar ndonjë numërim. Paneli ka ndryshuar, sepse pjesa e punës së vështirë ka ndryshuar në mënyrë dramatike. Menaxheri që lexon vetëm totalin mund të përfundojë se ekipi është keqësuar. Kolegu që lexon kategoritë mund të përfundojë se procesi është përmirësuar. Të dy mund të tregojnë aritmetikë të saktë. Informacioni që mungon është përbërja e emëruesit. Faqja tjetër e bën efektin të dukshëm me numra të plotë sintetikë, që kushdo mund t'i rillogarisë.",
              "Eine Führungskraft prüft zwei Serviceperioden. In jeder Arbeitskategorie verbessert sich die Leistung. Die einfacheren Anfragen werden verlässlicher erledigt; die komplexen ebenfalls. Doch der Gesamtanteil pünktlicher Erledigungen sinkt. Niemand hat eine Zählung gefälscht. Das Dashboard hat sich geändert, weil der Anteil schwieriger Arbeit sich drastisch verschoben hat. Wer nur die Summe liest, mag schließen, das Team habe nachgelassen. Wer die Kategorien liest, mag schließen, der Prozess habe sich verbessert. Beide können auf richtige Arithmetik zeigen. Die fehlende Information ist die Zusammensetzung des Nenners. Die nächste Seite macht den Effekt mit synthetischen ganzen Zahlen sichtbar, die jeder nachrechnen kann.") },
            { type: "p", text: x(
              "The editorial lesson extends across last-mile, hotel occupancy patterns and wholesale orders: different kinds of work do not necessarily require the same effort, create the same risk or occur in the same mix each day. A fair analysis must preserve the definition and case mix of each cohort.",
              "Mësimi editorial shtrihet nëpër miljen e fundit, modelet e zënies së hoteleve dhe porositë me shumicë: lloje të ndryshme pune nuk kërkojnë doemos të njëjtin mundim, nuk krijojnë të njëjtin rrezik dhe nuk ndodhin në të njëjtën përzierje çdo ditë. Një analizë e drejtë duhet ta ruajë përkufizimin dhe përzierjen e rasteve të çdo grupi.",
              "Die redaktionelle Lehre reicht über die letzte Meile, Belegungsmuster im Hotel und Großhandelsaufträge: Verschiedene Arbeitsarten verlangen nicht zwangsläufig denselben Aufwand, schaffen nicht dasselbe Risiko und kommen nicht jeden Tag im selben Mix vor. Eine faire Analyse muss Definition und Fallmix jeder Kohorte bewahren.") },
            { type: "callout", reading: true, text: x(
              "An average can be correct and still fail to describe the operational change that matters.",
              "Një mesatare mund të jetë e saktë dhe prapë të mos e përshkruajë ndryshimin operacional që ka rëndësi.",
              "Ein Durchschnitt kann richtig sein und trotzdem die betriebliche Veränderung verfehlen, auf die es ankommt.") },
          ],
          note: x(
            "Conceptual mathematical illustration of aggregation effects; no implied observation from the author's workplaces. The essay named below explains why KPIs do not improve in Excel.",
            "Ilustrim matematik konceptual i efekteve të agregimit; asnjë vëzhgim i nënkuptuar nga vendet e punës së autorit. Eseja e emërtuar më poshtë shpjegon pse KPI-të nuk përmirësohen në Excel.",
            "Begriffliche mathematische Illustration von Aggregationseffekten; keine implizierte Beobachtung aus den Betrieben des Autors. Der unten genannte Essay erklärt, warum KPIs sich nicht in Excel verbessern."),
        },
        {
          id: "v-model", layer: "concept",
          title: [x("How both groups improve", "Si përmirësohen të dy grupet", "Wie beide Gruppen besser werden,"), x("while the total falls", "ndërsa totali bie", "während die Summe fällt")],
          lead: x(
            "A recomputable example of an aggregation reversal caused by changed case mix. Success means on-time completion.",
            "Një shembull i rillogaritshëm i përmbysjes së agregimit nga ndryshimi i përzierjes së rasteve. Sukses do të thotë përfundim në kohë.",
            "Ein nachrechenbares Beispiel einer Aggregationsumkehr durch veränderten Fallmix. Erfolg heißt pünktliche Erledigung."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "pairs", from: x("Period A", "Periudha A", "Periode A"), to: x("Period B", "Periudha B", "Periode B"), max: 100, hypothetical: true,
              label: x("On-time share by category and in total, invented counts", "Pjesa në kohë sipas kategorisë dhe gjithsej, numra të shpikur", "Pünktlicher Anteil je Kategorie und insgesamt, erfundene Zahlen"),
              rows: [
                { k: x("Standard work", "Puna standarde", "Standardarbeit"), a: 90, an: x("90/100 = 90.0%", "90/100 = 90,0%", "90/100 = 90,0 %"), b: 100, bn: x("20/20 = 100%", "20/20 = 100%", "20/20 = 100 %") },
                { k: x("Complex work", "Puna e ndërlikuar", "Komplexe Arbeit"), a: 40, an: x("4/10 = 40.0%", "4/10 = 40,0%", "4/10 = 40,0 %"), b: 80, bn: x("80/100 = 80.0%", "80/100 = 80,0%", "80/100 = 80,0 %") },
                { k: x("All work", "E gjithë puna", "Alle Arbeit"), a: 85.5, an: x("94/110 = 85.5%", "94/110 = 85,5%", "94/110 = 85,5 %"), b: 83.3, bn: x("100/120 = 83.3%", "100/120 = 83,3%", "100/120 = 83,3 %"), alert: true },
              ] },
            { type: "p", text: x(
              "Both categories improve, yet the overall on-time share falls from about 85.5% to 83.3%, because the demanding category is a far larger share of period B. The totals are not like-for-like comparisons: the reversal is an arithmetic property of the weights, not a real trend. A metric that supports decisions about people should show whether the mix changed and report volumes; segment where risks differ, with sufficient samples and stable definitions, because an arbitrary split creates noise of its own.",
              "Të dyja kategoritë përmirësohen, por pjesa e përgjithshme në kohë bie nga rreth 85,5% në 83,3%, sepse kategoria kërkuese zë një pjesë shumë më të madhe të periudhës B. Totalet nuk janë krahasime njësoj me njësoj: përmbysja është veti aritmetike e peshave, jo prirje e vërtetë. Një matje që mbështet vendime për njerëzit duhet të tregojë nëse ndryshoi përzierja dhe të raportojë volumet; segmento aty ku rreziqet ndryshojnë, me mostra mjaft të mëdha dhe përkufizime të qëndrueshme, sepse një ndarje arbitrare krijon zhurmën e vet.",
              "Beide Kategorien verbessern sich, doch der Gesamtanteil pünktlicher Erledigungen sinkt von etwa 85,5 % auf 83,3 %, weil die anspruchsvolle Kategorie in Periode B einen weit größeren Anteil hat. Die Summen sind keine Vergleiche gleich mit gleich: Die Umkehr ist eine arithmetische Eigenschaft der Gewichte, kein echter Trend. Eine Kennzahl, die Entscheidungen über Menschen stützt, sollte zeigen, ob sich der Mix änderte, und Volumen berichten; segmentieren Sie, wo Risiken sich unterscheiden, mit ausreichenden Stichproben und stabilen Definitionen, denn eine willkürliche Aufteilung erzeugt eigenen Lärm.") },
            { type: "callout", reading: true, text: x(
              "Before comparing two totals, ask whether they contain the same kind of work.",
              "Para se të krahasosh dy totale, pyet nëse përmbajnë të njëjtin lloj pune.",
              "Bevor Sie zwei Summen vergleichen, fragen Sie, ob sie dieselbe Art von Arbeit enthalten.") },
          ],
          note: x(
            "All numbers are invented; the computation was checked from integer numerators and denominators: 94/110 = 85.45%, 100/120 = 83.33%.",
            "Të gjithë numrat janë të shpikur; llogaria u kontrollua nga numërues dhe emërues të plotë: 94/110 = 85,45%, 100/120 = 83,33%.",
            "Alle Zahlen sind erfunden; die Rechnung wurde aus ganzzahligen Zählern und Nennern geprüft: 94/110 = 85,45 %, 100/120 = 83,33 %."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("A scorecard", "Një tabelë treguesish", "Eine Kennzahlentafel"), x("with a conscience", "me ndërgjegje", "mit Gewissen")],
          lead: x(
            "The measure family must connect operational action to the customer and make its exclusions visible. A useful scorecard is not a table in which every indicator has equal status. Some establish service adequacy; some show process health; some warn of side effects; some qualify interpretation by showing volume, case mix and coverage. A threshold can prompt review without becoming a statement of guilt.",
            "Familja e matjeve duhet ta lidhë veprimin operacional me klientin dhe t'i bëjë të dukshme përjashtimet e veta. Një tabelë e dobishme treguesish nuk është tabelë ku çdo tregues ka status të njëjtë. Disa vërtetojnë mjaftueshmërinë e shërbimit; disa tregojnë shëndetin e procesit; disa paralajmërojnë efekte anësore; disa e kushtëzojnë interpretimin duke treguar volumin, përzierjen e rasteve dhe mbulimin. Një prag mund të nxisë rishikim pa u bërë deklaratë faji.",
            "Die Kennzahlenfamilie muss betriebliches Handeln mit dem Kunden verbinden und ihre Ausschlüsse sichtbar machen. Eine nützliche Kennzahlentafel ist keine Tabelle, in der jeder Indikator denselben Rang hat. Manche belegen die Angemessenheit des Service; manche zeigen die Prozessgesundheit; manche warnen vor Nebenwirkungen; manche qualifizieren die Deutung, indem sie Volumen, Fallmix und Abdeckung zeigen. Eine Schwelle kann eine Prüfung anstoßen, ohne zur Schuldfeststellung zu werden."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("Complete and timely service; customer-visible quality.", "Shërbim i plotë dhe në kohë; cilësi e dukshme për klientin.", "Vollständiger, pünktlicher Service; für den Kunden sichtbare Qualität.") },
              { h: x("Process", "Procesi", "Prozess"), p: x("Departure or handover steps that have a causal rationale.", "Hapa nisjeje ose dorëzimi me arsyetim shkakësor.", "Abfahrts- oder Übergabeschritte mit kausaler Begründung.") },
              { h: x("Balancing", "Balancimi", "Ausgleich"), p: x("Incomplete orders, rework, unsafe shortcuts or complaint recurrence.", "Porosi të paplota, ripunim, rrugë të shkurtra të pasigurta ose ankesa të përsëritura.", "Unvollständige Aufträge, Nacharbeit, unsichere Abkürzungen oder wiederkehrende Beschwerden.") },
              { h: x("Context", "Konteksti", "Kontext"), p: x("Volume, case mix, exception exposure and seasonality.", "Volumi, përzierja e rasteve, ekspozimi ndaj përjashtimeve dhe sezonaliteti.", "Volumen, Fallmix, Ausnahmeexposition und Saisonalität.") },
              { h: x("Data quality", "Cilësia e të dhënave", "Datenqualität"), p: x("Coverage, exclusions, delays, corrections and definition changes.", "Mbulimi, përjashtimet, vonesat, korrigjimet dhe ndryshimet e përkufizimit.", "Abdeckung, Ausschlüsse, Verzögerungen, Korrekturen und Definitionsänderungen.") },
            ] },
            { type: "p", text: x(
              "Balanced Scorecard thinking can inform strategy, while IHI measure families help design local improvement. The manager can add a data-quality note: a well-defined rate based on partial records may be precise without being representative. The percentage of records with a valid status is therefore sometimes as important as the reported service rate. Personal identifiers, guest details and confidential operational records should not be placed in a general dashboard; aggregated or demonstrative figures can explain the method without exposing internal information.",
              "Mendimi i Balanced Scorecard mund ta ushqejë strategjinë, ndërsa familjet e matjeve të IHI-së ndihmojnë të projektohet përmirësimi lokal. Menaxheri mund të shtojë një shënim për cilësinë e të dhënave: një normë e përkufizuar mirë, por mbi regjistra të pjesshëm, mund të jetë e saktë pa qenë përfaqësuese. Prandaj përqindja e regjistrave me status të vlefshëm është ndonjëherë po aq e rëndësishme sa norma e raportuar e shërbimit. Identifikuesit personalë, të dhënat e mysafirëve dhe regjistrat konfidencialë operacionalë nuk duhen vendosur në një panel të përgjithshëm; shifra të agreguara ose demonstruese mund ta shpjegojnë metodën pa ekspozuar informacion të brendshëm.",
              "Balanced-Scorecard-Denken kann die Strategie leiten, während die Kennzahlenfamilien des IHI die lokale Verbesserung gestalten helfen. Die Führungskraft kann einen Hinweis zur Datenqualität ergänzen: Eine gut definierte Quote auf Basis unvollständiger Aufzeichnungen kann präzise sein, ohne repräsentativ zu sein. Der Anteil der Datensätze mit gültigem Status ist daher manchmal so wichtig wie die berichtete Servicequote. Persönliche Kennungen, Gästedaten und vertrauliche Betriebsaufzeichnungen gehören nicht in ein allgemeines Dashboard; aggregierte oder demonstrative Zahlen können die Methode erklären, ohne interne Information preiszugeben.") },
            { type: "callout", reading: true, text: x(
              "The scorecard should make a disputed number easier to investigate, not harder to challenge.",
              "Tabela e treguesve duhet ta bëjë një numër të kontestuar më të lehtë për t'u hetuar, jo më të vështirë për t'u kundërshtuar.",
              "Die Kennzahlentafel sollte eine strittige Zahl leichter untersuchbar machen, nicht schwerer anfechtbar.") },
          ],
          note: x(
            "Conceptual synthesis after Kaplan and Norton (1992), the IHI's measurement guidance and NIST's data assumptions.",
            "Sintezë konceptuale sipas Kaplan dhe Norton (1992), udhëzimit të IHI-së për matjen dhe supozimeve të NIST për të dhënat.",
            "Begriffliche Synthese nach Kaplan und Norton (1992), der Messanleitung des IHI und den Datenannahmen von NIST."),
          source: ["kaplan-norton-1992", "ihi-establishing-measures", "nist-control-charts"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Define the KPI", "Përkufizo KPI-në", "Den KPI definieren,"), x("before defining success", "para se të përkufizosh suksesin", "bevor Sie Erfolg definieren")],
          lead: x(
            "A compact metric dictionary protects decisions from silent changes to the denominator.",
            "Një fjalor i ngjeshur matjesh i mbron vendimet nga ndryshimet e heshtura të emëruesit.",
            "Ein kompaktes Kennzahlenwörterbuch schützt Entscheidungen vor stillen Änderungen des Nenners."),
          blocks: [
            { type: "steps", items: [
              { h: x("Purpose and user", "Qëllimi dhe përdoruesi", "Zweck und Nutzer"), p: x("Who needs the number, and which decision could it support?", "Kujt i duhet numri, dhe cilin vendim mund të mbështesë?", "Wer braucht die Zahl, und welche Entscheidung könnte sie stützen?") },
              { h: x("Unit and formula", "Njësia dhe formula", "Einheit und Formel"), p: x("Numerator, denominator, units, event boundary and time window.", "Numëruesi, emëruesi, njësitë, kufiri i ngjarjes dhe dritarja kohore.", "Zähler, Nenner, Einheiten, Ereignisgrenze und Zeitfenster.") },
              { h: x("Source and freshness", "Burimi dhe freskia", "Quelle und Aktualität"), p: x("The authoritative source, refresh schedule, known latency and ownership.", "Burimi autoritar, orari i freskimit, vonesa e njohur dhe pronësia.", "Die maßgebliche Quelle, Aktualisierungsrhythmus, bekannte Verzögerung und Verantwortung.") },
              { h: x("Eligibility and exceptions", "Përfshirja dhe përjashtimet", "Zulässigkeit und Ausnahmen"), p: x("Exclusions, cancellations, repeats, late entries and case-mix segmentation.", "Përjashtimet, anulimet, përsëritjet, shënimet e vonuara dhe segmentimi sipas përzierjes së rasteve.", "Ausschlüsse, Stornierungen, Wiederholungen, späte Einträge und Segmentierung nach Fallmix.") },
              { h: x("Companion measures", "Matjet shoqëruese", "Begleitkennzahlen"), p: x("Pair the process metric with a customer result, balancing guardrail and data-quality check.", "Çiftoje matjen e procesit me një rezultat për klientin, një parmak balancues dhe një kontroll të cilësisë së të dhënave.", "Die Prozesskennzahl mit einem Kundenergebnis, einer Ausgleichs-Leitplanke und einer Datenqualitätsprüfung paaren.") },
              { h: x("Govern the changes", "Qeveris ndryshimet", "Änderungen steuern"), p: x("Version the definition, retain comparable history and announce changes before comparing periods.", "Jepi version përkufizimit, ruaj historinë e krahasueshme dhe njofto ndryshimet para se të krahasosh periudhat.", "Die Definition versionieren, vergleichbare Historie behalten und Änderungen ankündigen, bevor Perioden verglichen werden.") },
            ] },
            { type: "p", text: x(
              "Do not apply an invented definition of Delay or Incomplete to a company whose official metric dictionary has different rules. Nor should the meaning of a hotel report be inferred merely from its title. A professional publication may describe general structures, but a real decision requires the authorised local definition.",
              "Mos zbato një përkufizim të shpikur të Vonesës apo të Të paplotës për një kompani, fjalori zyrtar i matjeve të së cilës ka rregulla të tjera. As kuptimi i një raporti hoteli nuk duhet nxjerrë thjesht nga titulli. Një botim profesional mund të përshkruajë struktura të përgjithshme, por një vendim i vërtetë kërkon përkufizimin lokal të autorizuar.",
              "Wenden Sie keine erfundene Definition von Verspätung oder Unvollständigkeit auf ein Unternehmen an, dessen offizielles Kennzahlenwörterbuch andere Regeln hat. Ebenso wenig darf die Bedeutung eines Hotelberichts bloß aus seinem Titel abgeleitet werden. Eine Fachveröffentlichung kann allgemeine Strukturen beschreiben, doch eine echte Entscheidung verlangt die befugte lokale Definition.") },
            { type: "callout", reading: true, text: x(
              "The most important part of a KPI may be the small print that explains what is missing.",
              "Pjesa më e rëndësishme e një KPI-je mund të jenë shkronjat e vogla që shpjegojnë çfarë mungon.",
              "Der wichtigste Teil eines KPI ist womöglich das Kleingedruckte, das erklärt, was fehlt.") },
          ],
          note: x(
            "Editorial metric-dictionary protocol, not an existing approved data-governance standard of any employer.",
            "Protokoll editorial për fjalorin e matjeve, jo standard i miratuar i qeverisjes së të dhënave i ndonjë punëdhënësi.",
            "Redaktionelles Protokoll für ein Kennzahlenwörterbuch, kein bestehender freigegebener Data-Governance-Standard eines Arbeitgebers."),
          source: ["ihi-establishing-measures"],
        },
      ],
    },

    // Chapter VI. Beyond the target
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Beyond the target", "Përtej objektivit", "Jenseits des Ziels"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "talking-to-someone-who-made-a-mistake",
          title: [x("The meeting that asks", "Mbledhja që bën", "Die Besprechung, die"), x("one more question", "edhe një pyetje", "eine Frage mehr stellt")],
          lead: x(
            "A useful performance review asks for the service result after it sees the number.",
            "Një rishikim i dobishëm i performancës e kërkon rezultatin e shërbimit pasi e sheh numrin.",
            "Eine nützliche Leistungsprüfung fragt nach dem Serviceergebnis, nachdem sie die Zahl gesehen hat."),
          blocks: [
            { type: "flag", text: x("Hypothetical management review, no claim of direct experience", "Rishikim menaxherial hipotetik, pa pretendim përvoje të drejtpërdrejtë", "Hypothetische Managementprüfung, kein Anspruch auf direkte Erfahrung") },
            { type: "p", text: x(
              "A constructed leadership team arrives at a weekly review. One KPI is better than last week. The slides are ready; the celebration is almost immediate. Instead, the chair asks whether the rate is based on comparable work, whether the count is complete and whether any downstream indicator worsened. The analyst can answer two questions but not the third. A small sample is assigned to the process owner, and the outcome is left open until it can be checked. This is not indecision. It is a proportionate refusal to turn an incomplete statistic into a complete claim. The meeting still recognises what is known, and it still honours the people who improved a measured step. It simply avoids attributing a business result that the evidence has not established.",
              "Një ekip drejtues i ndërtuar vjen në një rishikim javor. Një KPI është më mirë se javën e kaluar. Sllajdet janë gati; festimi është pothuajse i menjëhershëm. Në vend të kësaj, kryesuesi pyet nëse norma mbështetet në punë të krahasueshme, nëse numërimi është i plotë dhe nëse ndonjë tregues më poshtë në zinxhir u keqësua. Analisti u përgjigjet dy pyetjeve, por jo të tretës. Pronarit të procesit i caktohet një mostër e vogël, dhe rezultati lihet i hapur derisa të kontrollohet. Kjo nuk është pavendosmëri. Është refuzim i përpjesëtuar për ta kthyer një statistikë të paplotë në pohim të plotë. Mbledhja e njeh prapë atë që dihet, dhe i nderon prapë njerëzit që e përmirësuan një hap të matur. Thjesht nuk i atribuon një rezultat biznesi që prova nuk e ka vërtetuar.",
              "Ein konstruiertes Führungsteam kommt zur Wochenprüfung. Ein KPI ist besser als in der Vorwoche. Die Folien sind fertig; der Jubel ist fast sofort da. Stattdessen fragt der Vorsitz, ob die Quote auf vergleichbarer Arbeit beruht, ob die Zählung vollständig ist und ob sich ein nachgelagerter Indikator verschlechtert hat. Der Analyst kann zwei Fragen beantworten, die dritte nicht. Eine kleine Stichprobe wird dem Prozessverantwortlichen zugewiesen, und das Ergebnis bleibt offen, bis es geprüft werden kann. Das ist keine Unentschlossenheit. Es ist eine verhältnismäßige Weigerung, eine unvollständige Statistik zu einer vollständigen Behauptung zu machen. Die Besprechung erkennt weiterhin an, was bekannt ist, und würdigt weiterhin die Menschen, die einen gemessenen Schritt verbessert haben. Sie vermeidet nur, ein Geschäftsergebnis zuzuschreiben, das die Belege nicht gestützt haben.") },
            { type: "p", text: x(
              "The fictional meeting describes the practice this volume advocates. It is not a reconstructed conversation with supervisors or colleagues from the author's career.",
              "Mbledhja e sajuar përshkruan praktikën që mbron ky vëllim. Nuk është bisedë e rindërtuar me mbikëqyrës apo kolegë nga karriera e autorit.",
              "Die fiktive Besprechung beschreibt die Praxis, für die dieser Band wirbt. Sie ist kein rekonstruiertes Gespräch mit Vorgesetzten oder Kollegen aus der Laufbahn des Autors.") },
            { type: "callout", reading: true, text: x(
              "The strongest dashboard is the one that makes an honest “we do not know yet” possible.",
              "Paneli më i fortë është ai që e bën të mundur një “nuk e dimë ende” të ndershëm.",
              "Das stärkste Dashboard ist das, das ein ehrliches „wir wissen es noch nicht“ möglich macht.") },
          ],
          note: x(
            "Constructed scenario, inspired by statistical process control, balanced measurement and evidence discipline. The essay named below is about talking to someone who made a mistake.",
            "Skenar i ndërtuar, i frymëzuar nga kontrolli statistikor i procesit, matja e balancuar dhe disiplina e provës. Eseja e emërtuar më poshtë flet për bisedën me dikë që bëri gabim.",
            "Konstruiertes Szenario, angeregt von statistischer Prozesskontrolle, ausgewogener Messung und Belegdisziplin. Der unten genannte Essay handelt vom Gespräch mit jemandem, der einen Fehler gemacht hat."),
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Five questions", "Pesë pyetje", "Fünf Fragen"), x("before a verdict", "para një verdikti", "vor einem Urteil")],
          lead: x(
            "A manager can take accountability for a decision without pretending the metric contains the entire explanation.",
            "Një menaxher mund ta marrë përgjegjësinë për një vendim pa shtirur se matja e përmban gjithë shpjegimin.",
            "Eine Führungskraft kann Verantwortung für eine Entscheidung übernehmen, ohne vorzugeben, die Kennzahl enthalte die ganze Erklärung."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Is it defined?", "A është e përkufizuar?", "Ist sie definiert?"), p: x("Can another competent reader reproduce the formula, population and period?", "A mund ta riprodhojë një lexues tjetër kompetent formulën, popullatën dhe periudhën?", "Kann ein anderer kompetenter Leser Formel, Population und Zeitraum nachvollziehen?") },
              { h: x("Is it trustworthy?", "A është e besueshme?", "Ist sie vertrauenswürdig?"), p: x("Are records complete, current and consistent with the physical or service process?", "A janë regjistrat të plotë, të freskët dhe në përputhje me procesin fizik ose të shërbimit?", "Sind die Aufzeichnungen vollständig, aktuell und stimmig mit dem physischen oder Serviceprozess?") },
              { h: x("Is it different?", "A është e ndryshme?", "Ist sie anders?"), p: x("Is the change practically meaningful and, where appropriate, an unusual statistical signal?", "A është ndryshimi kuptimplotë në praktikë dhe, ku duhet, sinjal statistikor i pazakontë?", "Ist die Veränderung praktisch bedeutsam und, wo angebracht, ein ungewöhnliches statistisches Signal?") },
              { h: x("Is it balanced?", "A është e balancuar?", "Ist sie ausgewogen?"), p: x("Did the customer result improve without unacceptable safety, quality or downstream costs?", "A u përmirësua rezultati për klientin pa kosto të papranueshme sigurie, cilësie ose më poshtë në zinxhir?", "Hat sich das Kundenergebnis ohne unannehmbare Sicherheits-, Qualitäts- oder Folgekosten verbessert?") },
              { h: x("Is it actionable?", "A është e veprueshme?", "Ist sie handlungsfähig?"), p: x("Does the responsible team have authority to change the condition causing the result?", "A ka ekipi përgjegjës autoritetin ta ndryshojë kushtin që e shkakton rezultatin?", "Hat das verantwortliche Team die Befugnis, die Bedingung zu ändern, die das Ergebnis verursacht?") },
            ] },
            { type: "p", text: x(
              "The sequence matters. Starting with a new target before validating a denominator creates false urgency. Turning a signal into an accusation before comparing the process creates distrust. Adding ten new metrics without removing stale ones creates work but not insight. Every metric review should have an agreed route for corrections: a corrected number should not quietly replace the old one without an audit trail. If the measure is right but the process is poor, the problem belongs to process improvement; if the indicator is neither reliable nor useful, it may need redesign.",
              "Radha ka rëndësi. Të nisësh me një objektiv të ri para se të vërtetosh emëruesin krijon urgjencë të rreme. Ta kthesh një sinjal në akuzë para se të krahasosh procesin krijon mosbesim. Të shtosh dhjetë matje të reja pa hequr të vjetruarat krijon punë, jo kuptim. Çdo rishikim matjesh duhet të ketë një rrugë të rënë dakord për korrigjimet: një numër i korrigjuar nuk duhet ta zëvendësojë pa zhurmë të vjetrin pa gjurmë auditimi. Nëse matja është e saktë, por procesi është i dobët, problemi i takon përmirësimit të procesit; nëse treguesi nuk është as i besueshëm, as i dobishëm, mund të ketë nevojë për riprojektim.",
              "Die Reihenfolge zählt. Mit einem neuen Ziel zu beginnen, bevor der Nenner geprüft ist, erzeugt falsche Dringlichkeit. Ein Signal in eine Anklage zu verwandeln, bevor der Prozess verglichen ist, erzeugt Misstrauen. Zehn neue Kennzahlen hinzuzufügen, ohne veraltete zu entfernen, erzeugt Arbeit, aber keine Einsicht. Jede Kennzahlenprüfung sollte einen vereinbarten Weg für Korrekturen haben: Eine korrigierte Zahl darf die alte nicht still und ohne Prüfpfad ersetzen. Stimmt die Kennzahl, ist aber der Prozess schlecht, gehört das Problem zur Prozessverbesserung; ist der Indikator weder verlässlich noch nützlich, braucht er womöglich eine Neugestaltung.") },
            { type: "callout", reading: true, text: x(
              "A KPI deserves trust because its meaning and evidence can be inspected, not because it is displayed in colour.",
              "Një KPI meriton besim sepse kuptimi dhe prova e tij mund të kontrollohen, jo sepse shfaqet me ngjyrë.",
              "Ein KPI verdient Vertrauen, weil seine Bedeutung und seine Belege geprüft werden können, nicht weil er in Farbe angezeigt wird.") },
          ],
          note: x(
            "Editorial framework drawn from Campbell (1979), NIST process-control methods and the IHI's measurement guidance.",
            "Kornizë editoriale e nxjerrë nga Campbell (1979), metodat e kontrollit të procesit të NIST dhe udhëzimi i IHI-së për matjen.",
            "Redaktioneller Rahmen nach Campbell (1979), den Prozesskontrollmethoden von NIST und der Messanleitung des IHI."),
          source: ["gl-campbell-1979", "nist-control-charts", "ihi-establishing-measures"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Beyond the target:", "Përtej objektivit:", "Jenseits des Ziels:"), x("an operating review", "një rishikim operativ", "eine Betriebsprüfung")],
          lead: x(
            "A proposed four-week pilot, with no assumption that every problem can be resolved in a month.",
            "Një pilot i propozuar katërjavor, pa supozimin se çdo problem zgjidhet brenda një muaji.",
            "Ein vorgeschlagener vierwöchiger Pilot, ohne die Annahme, dass sich jedes Problem in einem Monat lösen lässt."),
          blocks: [
            { type: "timeline", items: [
              { k: x("Week 1", "Java 1", "Woche 1"), t: x("Define.", "Përkufizo.", "Definieren.") },
              { k: x("Week 2", "Java 2", "Woche 2"), t: x("Validate.", "Vërteto.", "Prüfen.") },
              { k: x("Week 3", "Java 3", "Woche 3"), t: x("Observe.", "Vëzhgo.", "Beobachten.") },
              { k: x("Week 4", "Java 4", "Woche 4"), t: x("Review.", "Rishiko.", "Auswerten.") },
            ] },
            { type: "steps", items: [
              { h: x("Week 1: choose a real decision", "Java 1: zgjidh një vendim të vërtetë", "Woche 1: eine echte Entscheidung wählen"), p: x("One KPI behind a recurring managerial choice, with its official definition.", "Një KPI pas një zgjedhjeje të përsëritur menaxheriale, me përkufizimin e vet zyrtar.", "Ein KPI hinter einer wiederkehrenden Führungsentscheidung, mit seiner offiziellen Definition.") },
              { h: x("Week 2: audit a small sample", "Java 2: audito një mostër të vogël", "Woche 2: eine kleine Stichprobe prüfen"), p: x("Freshness, coverage, duplicates, timing and a companion service measure.", "Freskia, mbulimi, dublikatat, koha dhe një matje shoqëruese shërbimi.", "Aktualität, Abdeckung, Dubletten, Zeitpunkt und eine begleitende Servicekennzahl.") },
              { h: x("Week 3: trace discrepancies", "Java 3: ndiq mospërputhjet", "Woche 3: Abweichungen nachgehen"), p: x("Observe work where a misleading reading may arise; protect staff privacy.", "Vëzhgo punën aty ku mund të lindë një lexim mashtrues; mbro privatësinë e stafit.", "Die Arbeit dort beobachten, wo eine irreführende Lesart entsteht; Privatsphäre schützen.") },
              { h: x("Week 4: agree the decision rule", "Java 4: bini dakord për rregullin e vendimit", "Woche 4: die Entscheidungsregel vereinbaren"), p: x("Owner, escalation conditions, follow-up date, a guardrail against side effects.", "Përgjegjësi, kushtet e eskalimit, data e ndjekjes, një parmak kundër efekteve anësore.", "Verantwortlicher, Eskalationsbedingungen, Folgetermin, eine Leitplanke gegen Nebenwirkungen.") },
              { h: x("After the pilot: compare and explain", "Pas pilotit: krahaso dhe shpjego", "Nach dem Pilot: vergleichen und erklären"), p: x("Findings, unknowns, changes; the definition revised only with documented governance.", "Gjetjet, të panjohurat, ndryshimet; përkufizimi i ndryshuar vetëm me qeverisje të dokumentuar.", "Befunde, Unbekanntes, Änderungen; die Definition nur mit dokumentierter Steuerung geändert.") },
            ] },
            { type: "p", text: x(
              "Four weeks are an editorial test cadence, not a proven duration or an employer procedure: a safety-critical finding is escalated at once, a structural redesign may take longer. The output is a more defensible choice and a team that knows what the number means.",
              "Katër javë janë ritëm editorial prove, jo kohëzgjatje e provuar apo procedurë punëdhënësi: një gjetje kritike për sigurinë eskalohet menjëherë, një riprojektim strukturor mund të zgjasë më shumë. Rezultati është një zgjedhje më e mbrojtshme dhe një ekip që e di çfarë do të thotë numri.",
              "Vier Wochen sind ein redaktioneller Testtakt, keine belegte Dauer und kein Arbeitgeberverfahren: Ein sicherheitskritischer Befund wird sofort eskaliert, eine strukturelle Neugestaltung kann länger dauern. Das Ergebnis ist eine besser begründbare Entscheidung und ein Team, das weiß, was die Zahl bedeutet.") },
            { type: "callout", reading: true, text: x(
              "Measurement serves management only when management remains responsible for judgment.",
              "Matja i shërben menaxhimit vetëm kur menaxhimi mbetet përgjegjës për gjykimin.",
              "Messung dient der Führung nur, solange die Führung für das Urteil verantwortlich bleibt.") },
          ],
          note: x(
            "Original editorial pilot after IHI and NIST guidance; not a certified or validated intervention.",
            "Pilot origjinal editorial sipas udhëzimeve të IHI-së dhe NIST; jo ndërhyrje e certifikuar apo e vërtetuar.",
            "Eigener redaktioneller Pilot nach IHI- und NIST-Anleitung; keine zertifizierte oder validierte Intervention."),
          source: ["ihi-establishing-measures", "nist-control-charts"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Honest", "Karta e KPI-së", "Das ehrliche"), x("KPI Card", "së ndershme", "KPI-Blatt")],
      lead: x(
        "One indicator, one decision and an explicit check on what the measure cannot see. Use blank or synthetic data in public examples.",
        "Një tregues, një vendim dhe një kontroll i qartë i asaj që matja nuk e sheh dot. Në shembuj publikë përdor të dhëna bosh ose sintetike.",
        "Ein Indikator, eine Entscheidung und eine ausdrückliche Prüfung dessen, was die Kennzahl nicht sieht. In öffentlichen Beispielen leere oder synthetische Daten verwenden."),
      blocks: [
        { type: "form", items: [
          { h: x("Purpose and decision", "Qëllimi dhe vendimi", "Zweck und Entscheidung"), hint: x("who uses it, and what choice is it meant to support?", "kush e përdor, dhe cilën zgjedhje duhet të mbështesë?", "wer nutzt sie, und welche Wahl soll sie stützen?") },
          { h: x("Exact definition", "Përkufizimi i saktë", "Genaue Definition"), hint: x("numerator, denominator, time window, exclusions and metric owner", "numëruesi, emëruesi, dritarja kohore, përjashtimet dhe pronari i matjes", "Zähler, Nenner, Zeitfenster, Ausschlüsse und Verantwortlicher der Kennzahl") },
          { h: x("Source and freshness", "Burimi dhe freskia", "Quelle und Aktualität"), hint: x("authoritative dataset, update lag and known gaps", "togu autoritar i të dhënave, vonesa e përditësimit dhe boshllëqet e njohura", "maßgeblicher Datensatz, Aktualisierungsverzug und bekannte Lücken") },
          { h: x("Signal or target?", "Sinjal apo objektiv?", "Signal oder Ziel?"), hint: x("business threshold, control-chart assumptions or urgent risk trigger", "prag biznesi, supozime të grafikut të kontrollit apo shkas rreziku urgjent", "Geschäftsschwelle, Regelkartenannahmen oder dringender Risikoauslöser") },
          { h: x("Balance and customer impact", "Balanca dhe ndikimi te klienti", "Ausgleich und Kundenwirkung"), hint: x("what downstream quality, safety or service measure could worsen?", "cila matje cilësie, sigurie ose shërbimi më poshtë në zinxhir mund të keqësohet?", "welche nachgelagerte Qualitäts-, Sicherheits- oder Servicekennzahl könnte sich verschlechtern?") },
          { h: x("Action and feedback", "Veprimi dhe përgjigjja", "Handlung und Rückmeldung"), hint: x("next verification, named owner, checkpoint and report-back", "verifikimi i radhës, përgjegjësi i emërtuar, pika e kontrollit dhe raportimi", "nächste Prüfung, benannter Verantwortlicher, Prüfpunkt und Rückmeldung") },
        ] },
      ],
      note: x(
        "Do not add employee, guest or payment identifiers. If a question has no valid answer, record “not measured” or “not yet verified” rather than fabricating a precise result. One page is enough to expose the difference between a number and a decision.",
        "Mos shto identifikues punonjësish, mysafirësh apo pagesash. Nëse një pyetje nuk ka përgjigje të vlefshme, shëno “nuk është matur” ose “ende e paverifikuar”, në vend që të sajosh një rezultat të saktë. Një faqe mjafton për ta nxjerrë në pah dallimin mes një numri dhe një vendimi.",
        "Keine Mitarbeiter-, Gast- oder Zahlungskennungen eintragen. Hat eine Frage keine gültige Antwort, „nicht gemessen“ oder „noch nicht geprüft“ festhalten, statt ein genaues Ergebnis zu erfinden. Eine Seite genügt, um den Unterschied zwischen einer Zahl und einer Entscheidung sichtbar zu machen."),
      source: ["ihi-establishing-measures", "nist-control-charts", "kaplan-norton-1992"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("Responsible for", "Përgjegjës për", "Verantwortlich für"), x("the purpose", "qëllimin", "den Zweck")],
      lead: x(
        "The purpose of a metric is to improve the work, not to replace the work with an attractive description.",
        "Qëllimi i një matjeje është ta përmirësojë punën, jo ta zëvendësojë punën me një përshkrim tërheqës.",
        "Der Zweck einer Kennzahl ist, die Arbeit zu verbessern, nicht, die Arbeit durch eine ansprechende Beschreibung zu ersetzen."),
      blocks: [
        { type: "p", text: x(
          "A manager needs numbers. Without them, recurring failures can remain anecdotal, improvement becomes difficult to test and the quieter parts of the organisation may never be seen. But measurement also creates a temptation. Once a target is placed on a wall, people begin to talk about it as though it were the purpose of the operation. A green cell offers relief. A red cell invites an explanation. Both feelings arrive before the evidence is necessarily complete. What matters is whether the number still connects to the service it was invented to describe. In the last-mile setting, that means remembering that loading, departure, completeness and customer outcome are linked but not interchangeable. In a hotel, the report and the handover must support work that continues across shifts. In wholesale, an accepted order and a reliable promise are separate accomplishments. The relevant measures differ, but the responsibility to check their meaning is shared.",
          "Një menaxher ka nevojë për numra. Pa to, dështimet e përsëritura mund të mbeten anekdotike, përmirësimi bëhet i vështirë për t'u provuar dhe pjesët më të qeta të organizatës mund të mos shihen kurrë. Por matja krijon edhe një tundim. Sapo një objektiv vendoset në mur, njerëzit nisin të flasin për të sikur të ishte qëllimi i operacionit. Një qelizë e gjelbër sjell lehtësim. Një qelizë e kuqe kërkon shpjegim. Të dyja ndjenjat vijnë para se prova të jetë doemos e plotë. Ajo që ka rëndësi është nëse numri lidhet ende me shërbimin që u shpik për ta përshkruar. Në miljen e fundit, kjo do të thotë të mbash mend se ngarkimi, nisja, plotësia dhe rezultati për klientin janë të lidhura, por jo të këmbyeshme. Në një hotel, raporti dhe dorëzimi duhet ta mbështesin punën që vazhdon nëpër turne. Në shitjen me shumicë, një porosi e pranuar dhe një premtim i besueshëm janë arritje të ndara. Matjet përkatëse ndryshojnë, por përgjegjësia për t'ua kontrolluar kuptimin është e përbashkët.",
          "Eine Führungskraft braucht Zahlen. Ohne sie bleiben wiederkehrende Fehler anekdotisch, Verbesserung lässt sich schwer prüfen, und die leiseren Teile der Organisation werden womöglich nie gesehen. Doch Messung schafft auch eine Versuchung. Sobald ein Ziel an der Wand hängt, sprechen die Leute darüber, als wäre es der Zweck des Betriebs. Eine grüne Zelle bringt Erleichterung. Eine rote Zelle verlangt eine Erklärung. Beide Gefühle kommen, bevor die Belege vollständig sind. Es zählt, ob die Zahl noch mit dem Service verbunden ist, den sie beschreiben sollte. Auf der letzten Meile heißt das, sich zu erinnern, dass Beladung, Abfahrt, Vollständigkeit und Kundenergebnis verknüpft, aber nicht austauschbar sind. Im Hotel müssen Bericht und Übergabe die Arbeit stützen, die über Schichten hinweg weitergeht. Im Großhandel sind ein angenommener Auftrag und ein verlässliches Versprechen getrennte Leistungen. Die passenden Kennzahlen unterscheiden sich, doch die Pflicht, ihre Bedeutung zu prüfen, ist dieselbe.") },
        { type: "p", text: x(
          "Campbell reminds us that planned improvement is difficult to evaluate. Goodhart warns that applying pressure can alter the usefulness of a regularity. Holmström and Milgrom explain why disproportionate incentives on measured tasks can distort attention. Bevan and Hood describe risks in a documented public-service setting. IHI and NIST offer tools for building a more balanced and statistically honest review. None of these removes the manager's duty to listen to people, inspect the process and protect the customer. A metric need not be perfect to be useful. It needs a defined scope, a trustworthy source, a companion signal and a person willing to say what is not yet known. When it stops guiding a better decision, its colour becomes a decoration.",
          "Campbell na kujton se përmirësimi i planifikuar është i vështirë për t'u vlerësuar. Goodhart paralajmëron se ushtrimi i presionit mund ta ndryshojë dobinë e një rregullsie. Holmström dhe Milgrom shpjegojnë pse stimujt e papërpjesëtuar mbi detyrat e matura mund ta shtrembërojnë vëmendjen. Bevan dhe Hood përshkruajnë rreziqe në një mjedis të dokumentuar të shërbimit publik. IHI dhe NIST ofrojnë mjete për të ndërtuar një rishikim më të balancuar dhe statistikisht më të ndershëm. Asnjëri nuk e heq detyrën e menaxherit për t'i dëgjuar njerëzit, për ta kontrolluar procesin dhe për ta mbrojtur klientin. Një matje nuk ka pse të jetë e përsosur për të qenë e dobishme. I duhet një fushë e përkufizuar, një burim i besueshëm, një sinjal shoqërues dhe një person i gatshëm të thotë çfarë nuk dihet ende. Kur pushon së udhëhequri një vendim më të mirë, ngjyra e saj bëhet zbukurim.",
          "Campbell erinnert daran, dass geplante Verbesserung schwer zu bewerten ist. Goodhart warnt, dass Druck die Nützlichkeit einer Regelmäßigkeit verändern kann. Holmström und Milgrom erklären, warum unverhältnismäßige Anreize auf gemessene Aufgaben die Aufmerksamkeit verzerren können. Bevan und Hood beschreiben Risiken in einem dokumentierten öffentlichen Umfeld. IHI und NIST bieten Werkzeuge für eine ausgewogenere und statistisch ehrlichere Prüfung. Nichts davon nimmt der Führungskraft die Pflicht, den Menschen zuzuhören, den Prozess zu prüfen und den Kunden zu schützen. Eine Kennzahl muss nicht perfekt sein, um nützlich zu sein. Sie braucht einen definierten Geltungsbereich, eine vertrauenswürdige Quelle, ein Begleitsignal und eine Person, die bereit ist zu sagen, was noch nicht bekannt ist. Wenn sie aufhört, eine bessere Entscheidung zu leiten, wird ihre Farbe zur Dekoration.") },
        { type: "callout", reading: true, text: x(
          "A target can be achieved while the purpose of the work is lost. The manager is responsible for noticing the difference.",
          "Një objektiv mund të arrihet, ndërsa qëllimi i punës humbet. Menaxheri është përgjegjës për ta vënë re dallimin.",
          "Ein Ziel kann erreicht werden, während der Zweck der Arbeit verloren geht. Die Führungskraft ist dafür verantwortlich, den Unterschied zu bemerken.") },
      ],
      note: x(
        "Editorial conclusion. No manipulation, hidden defect or sanction is attributed to any named employer.",
        "Përfundim editorial. Asnjë manipulim, defekt i fshehur apo ndëshkim nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktionelles Fazit. Kein Manipulation, versteckter Mangel oder Sanktion wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Studies, models", "Studime, modele", "Studien, Modelle"), x("and methods", "dhe metoda", "und Methoden")],
      lead: x(
        "An evidence-informed synthesis, not a field experiment. The last-mile and hotel contexts reflect categories of work described by the author; every stated meeting, individual event and numerical operational dataset is explicitly synthetic.",
        "Një sintezë e mbështetur në prova, jo eksperiment në terren. Kontekstet e miljes së fundit dhe të hotelit pasqyrojnë kategori pune të përshkruara nga autori; çdo mbledhje, ngjarje individuale dhe tog të dhënash numerike operacionale është shprehimisht sintetike.",
        "Eine belegbasierte Synthese, kein Feldexperiment. Die Kontexte der letzten Meile und des Hotels spiegeln vom Autor beschriebene Arbeitskategorien; jede genannte Besprechung, jedes Einzelereignis und jeder numerische Betriebsdatensatz ist ausdrücklich synthetisch."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Theory", "Teoria", "Theorie"), p: x("Goodhart (1975, via Bevan and Hood), Strathern (1997), Campbell (1979) and Holmström and Milgrom (1991) describe mechanisms, not measured rates.", "Goodhart (1975, përmes Bevan e Hood), Strathern (1997), Campbell (1979) dhe Holmström e Milgrom (1991) përshkruajnë mekanizma, jo norma të matura.", "Goodhart (1975, über Bevan und Hood), Strathern (1997), Campbell (1979) und Holmström und Milgrom (1991) beschreiben Mechanismen, keine gemessenen Quoten.") },
          { h: x("Observation", "Vëzhgimi", "Beobachtung"), p: x("Bevan and Hood (2006) and van Thiel and Leeuw (2002) concern public services; their findings are not transferred as outcomes of logistics or hospitality.", "Bevan e Hood (2006) dhe van Thiel e Leeuw (2002) kanë të bëjnë me shërbimet publike; gjetjet e tyre nuk barten si rezultate të logjistikës apo mikpritjes.", "Bevan und Hood (2006) sowie van Thiel und Leeuw (2002) betreffen öffentliche Dienste; ihre Befunde werden nicht als Ergebnisse der Logistik oder Hotellerie übertragen.") },
          { h: x("Method", "Metoda", "Methode"), p: x("Kaplan and Norton (1992), the IHI's measure families and NIST's control-chart sections are design guidance; the p-chart is calculated under its stated assumptions.", "Kaplan e Norton (1992), familjet e matjeve të IHI-së dhe seksionet e NIST për grafikët e kontrollit janë udhëzim projektimi; p-grafiku llogaritet me supozimet e tij të deklaruara.", "Kaplan und Norton (1992), die Kennzahlenfamilien des IHI und die Regelkartenabschnitte von NIST sind Gestaltungsanleitung; die p-Karte ist unter ihren genannten Annahmen berechnet.") },
          { h: x("Arithmetic", "Aritmetika", "Arithmetik"), p: x("80, 60, 10 and 30 per 1,000; UCL ≈ 2.65% and LCL ≈ 0.35% for p₀ = 0.015 and n = 1,000; 94/110 = 85.5% and 100/120 = 83.3%: all re-checked.", "80, 60, 10 dhe 30 për 1.000; UCL ≈ 2,65% dhe LCL ≈ 0,35% për p₀ = 0,015 dhe n = 1.000; 94/110 = 85,5% dhe 100/120 = 83,3%: të gjitha të rikontrolluara.", "80, 60, 10 und 30 je 1.000; UCL ≈ 2,65 % und LCL ≈ 0,35 % für p₀ = 0,015 und n = 1.000; 94/110 = 85,5 % und 100/120 = 83,3 %: alles nachgerechnet.") },
        ] },
        { type: "p", text: x(
          "The Honest KPI Card and the four-week cycle are editorial proposals for local testing, not certified interventions. Editorial standard: a theory, an observation, a model and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Karta e KPI-së së ndershme dhe cikli katërjavor janë propozime editoriale për provë lokale, jo ndërhyrje të certifikuara. Standardi editorial: një teori, një vëzhgim, një model dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Das ehrliche KPI-Blatt und der vierwöchige Zyklus sind redaktionelle Vorschläge für lokale Tests, keine zertifizierten Interventionen. Redaktioneller Standard: Eine Theorie, eine Beobachtung, ein Modell und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited at its DOI or page on the next page; the author's PDF gives the p-chart's lower limit as clipping to zero, which the site corrects to about 0.35%.",
        "Çdo burim citohet me DOI-n ose faqen e vet në faqen tjetër; PDF-ja e autorit e jep kufirin e poshtëm të p-grafikut si të prerë në zero, që faqja e korrigjon në rreth 0,35%.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI oder Seite zitiert; das PDF des Autors gibt die untere Grenze der p-Karte als auf null gekappt an, was die Website auf etwa 0,35 % korrigiert."),
      source: ["goodhart-1975", "strathern-1997", "gl-campbell-1979", "holmstrom-milgrom-1991", "gl-bevan-hood-2006", "van-thiel-leeuw-2002", "kaplan-norton-1992", "ihi-establishing-measures", "nist-control-charts", "nist-p-chart"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
