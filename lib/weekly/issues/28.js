// Management Review, No. 28: Operational risk: FMEA and the risk matrix. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-28.md.
import { x } from "../common.js";

export default {
  number: 28,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Operational risk:", "Rreziku operacional:", "Operatives Risiko:"), x("FMEA and the risk matrix", "FMEA dhe matrica e rrezikut", "FMEA und die Risikomatrix")],
  sub: x(
    "Why the RPN takes only 120 values, two teams and one process, the Action Priority of 2019, what is wrong with risk matrices, and a card for failure modes.",
    "Pse RPN-ja merr vetëm 120 vlera, dy ekipe dhe një proces, Prioriteti i Veprimit i 2019, çfarë nuk shkon te matricat e rrezikut, dhe një kartë për mënyrat e dështimit.",
    "Warum die RPZ nur 120 Werte annimmt, zwei Teams und ein Prozess, die Aufgabenpriorität von 2019, was an Risikomatrizen falsch ist, und eine Karte für Fehlerarten."),
  seo: x(
    "Operational risk: why the RPN of FMEA takes only 120 values, two teams and one process, the Action Priority, Cox on risk matrices, and a card.",
    "Rreziku operacional: pse RPN-ja e FMEA merr vetëm 120 vlera, dy ekipe dhe një proces, Prioriteti i Veprimit, Cox për matricat e rrezikut, dhe një kartë.",
    "Operatives Risiko: warum die RPZ der FMEA nur 120 Werte annimmt, zwei Teams, ein Prozess, die Aufgabenpriorität, Cox zu Risikomatrizen und eine Karte."),
  feature: x(
    "Issue 28 starts with a number that looks like a scale from 1 to 1,000 but takes only 120 values, follows two hospital teams who analysed the same process and found mostly different failures, explains why the 2019 FMEA handbook replaced the RPN with an Action Priority, weighs the case against risk matrices, and ends with a card for failure modes.",
    "Numri 28 nis me një numër që duket si shkallë nga 1 në 1.000, por merr vetëm 120 vlera, ndjek dy ekipe spitalore që analizuan të njëjtin proces dhe gjetën kryesisht dështime të ndryshme, shpjegon pse manuali i FMEA i 2019 e zëvendësoi RPN-në me Prioritetin e Veprimit, peshon argumentet kundër matricave të rrezikut, dhe mbyllet me një kartë për mënyrat e dështimit.",
    "Ausgabe 28 beginnt mit einer Zahl, die wie eine Skala von 1 bis 1.000 aussieht, aber nur 120 Werte annimmt, begleitet zwei Klinikteams, die denselben Prozess analysierten und überwiegend verschiedene Fehler fanden, erklärt, warum das FMEA-Handbuch von 2019 die RPZ durch eine Aufgabenpriorität ersetzte, wägt die Einwände gegen Risikomatrizen ab und endet mit einer Karte für Fehlerarten."),
  figure: { n: "120", by: "Bowles, 2003", t: x(
    "different values are all the RPN can take, out of 1,000 combinations of severity, occurrence and detection.",
    "vlera të ndryshme është gjithçka që mund të marrë RPN-ja, nga 1.000 kombinime të ashpërsisë, ndodhjes dhe zbulimit.",
    "verschiedene Werte kann die RPZ annehmen, aus 1.000 Kombinationen von Bedeutung, Auftreten und Entdeckung.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("120 out of 1,000", "120 nga 1.000", "120 von 1.000") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("From RPN to Action Priority", "Nga RPN te Prioriteti i Veprimit", "Von der RPZ zur Aufgabenpriorität") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The failure-mode card", "Karta e mënyrave të dështimit", "Die Fehlerarten-Karte") },
  ],
  sources: ["mil-p-1629-1949", "bowles-2003", "shebl-2009", "ball-watt-2013", "aiag-vda-fmea-2019", "cox-2008", "thomas-bratvold-bickel-2013", "iso-31000-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every operation keeps a list of what could go wrong. This issue asks how that list gets scored, why the most common scores mislead, and what to use instead to decide which risk to act on first.",
        "Çdo operacion mban një listë të asaj që mund të shkojë keq. Ky numër pyet si pikëzohet kjo listë, pse pikët më të zakonshme të çojnë në rrugë të gabuar, dhe çfarë të përdorësh në vend të tyre për të vendosur për cilin rrezik të veprosh së pari.",
        "Jeder Betrieb führt eine Liste dessen, was schiefgehen kann. Diese Ausgabe fragt, wie diese Liste bewertet wird, warum die gängigsten Bewertungen in die Irre führen und was man stattdessen nutzt, um zu entscheiden, gegen welches Risiko man zuerst vorgeht."),
      body: x(
        "FMEA began in the US military in 1949. Its Risk Priority Number multiplies three scores from 1 to 10, yet its 1,000 combinations give only 120 different values, and a severe failure can rank below a mild one. When two hospital teams analysed the same process, only 17 of their 50 failures each were the same. The 2019 AIAG & VDA handbook replaced the number with an Action Priority, and Tony Cox showed that risk matrices can rank smaller risks above larger ones.",
        "FMEA nisi te ushtria amerikane në 1949. Numri i saj i prioritetit të rrezikut (RPN) shumëzon tri pikë nga 1 në 10, por 1.000 kombinimet e tij japin vetëm 120 vlera të ndryshme, dhe një dështim i rëndë mund të renditet poshtë një të lehti. Kur dy ekipe spitalore analizuan të njëjtin proces, vetëm 17 nga 50 dështimet e secilit ishin të njëjta. Manuali AIAG & VDA i 2019 e zëvendësoi numrin me Prioritetin e Veprimit, dhe Tony Cox tregoi se matricat e rrezikut mund t'i rendisin rreziqet më të vogla mbi më të mëdhatë.",
        "Die FMEA begann 1949 beim US-Militär. Ihre Risikoprioritätszahl (RPZ) multipliziert drei Bewertungen von 1 bis 10, doch ihre 1.000 Kombinationen ergeben nur 120 verschiedene Werte, und ein schwerer Fehler kann hinter einem leichten landen. Als zwei Klinikteams denselben Prozess analysierten, stimmten nur 17 ihrer je 50 Fehler überein. Das AIAG-&-VDA-Handbuch von 2019 ersetzte die Zahl durch eine Aufgabenpriorität, und Tony Cox zeigte, dass Risikomatrizen kleinere Risiken über größere stellen können."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("120 out", "120 nga", "120 von"), x("of 1,000", "1.000", "1.000")],
      lead: x(
        "Failure Mode and Effects Analysis began in the US military, with procedure MIL-P-1629 of 1949. Its best-known number is the Risk Priority Number: severity × occurrence × detection, each scored from 1 to 10.",
        "Analiza e mënyrave dhe e pasojave të dështimit (FMEA) nisi te ushtria amerikane, me procedurën MIL-P-1629 të 1949. Numri i saj më i njohur është RPN-ja: ashpërsia × ndodhja × zbulimi, secila e pikëzuar nga 1 në 10.",
        "Die Fehlermöglichkeits- und Einflussanalyse (FMEA) begann beim US-Militär, mit dem Verfahren MIL-P-1629 von 1949. Ihre bekannteste Zahl ist die Risikoprioritätszahl: Bedeutung × Auftreten × Entdeckung, jeweils von 1 bis 10 bewertet."),
      blocks: [
        { type: "columns", height: 110, source: ["bowles-2003"],
          label: x("How the 1,000 combinations of the three scores spread over the RPN (editors' calculation)", "Si shpërndahen 1.000 kombinimet e tri pikëve mbi RPN-në (llogari e redaksisë)", "Wie sich die 1.000 Kombinationen der drei Bewertungen über die RPZ verteilen (Rechnung der Redaktion)"),
          items: [
            { k: "1–200", v: 710, n: "710", alert: true },
            { k: "201–400", v: 188, n: "188" },
            { k: "401–600", v: 70, n: "70" },
            { k: "601–800", v: 25, n: "25" },
            { k: x("801–1,000", "801–1.000", "801–1.000"), v: 7, n: "7" },
          ] },
        { type: "p", text: x(
          "The RPN looks like a scale from 1 to 1,000, but John Bowles showed that only 120 different values can occur: none lies between 901 and 999, and 120 itself comes from 24 different combinations. A severe failure can rank low: severity 10 with occurrence 1 and detection 1 gives 10, while 4 × 4 × 4 gives 64.",
          "RPN-ja duket si shkallë nga 1 në 1.000, por John Bowles tregoi se mund të dalin vetëm 120 vlera të ndryshme: asnjë nuk bie mes 901 dhe 999, dhe vetë 120 del nga 24 kombinime të ndryshme. Një dështim i rëndë mund të renditet poshtë: ashpërsia 10 me ndodhje 1 dhe zbulim 1 jep 10, ndërsa 4 × 4 × 4 jep 64.",
          "Die RPZ wirkt wie eine Skala von 1 bis 1.000, doch John Bowles zeigte, dass nur 120 verschiedene Werte vorkommen können: Keiner liegt zwischen 901 und 999, und 120 selbst entsteht aus 24 verschiedenen Kombinationen. Ein schwerer Fehler kann weit unten landen: Bedeutung 10 mit Auftreten 1 und Entdeckung 1 ergibt 10, während 4 × 4 × 4 64 ergibt.") },
        { type: "callout", reading: true, text: x(
          "Multiplying three ordinal scores produces a number that looks precise and is not. The three scores say more when read one by one.",
          "Shumëzimi i tri pikëve rendore jep një numër që duket i saktë dhe nuk është. Tri pikët thonë më shumë kur lexohen një nga një.",
          "Wer drei Rangbewertungen multipliziert, erhält eine Zahl, die genau aussieht und es nicht ist. Die drei Bewertungen sagen mehr, wenn man sie einzeln liest.") },
      ],
      note: x(
        "The chart is the editors' calculation over all 1,000 combinations; the 120 values and the 24 ways to reach 120 follow Bowles.",
        "Grafiku është llogari e redaksisë mbi të 1.000 kombinimet; 120 vlerat dhe 24 mënyrat për të arritur 120 ndjekin Bowles.",
        "Die Grafik ist eine Rechnung der Redaktion über alle 1.000 Kombinationen; die 120 Werte und die 24 Wege zur 120 folgen Bowles."),
      source: ["mil-p-1629-1949", "bowles-2003"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Two teams,", "Dy ekipe,", "Zwei Teams,"), x("one process", "një proces", "ein Prozess")],
      lead: x(
        "In two hospitals of the same NHS trust, two teams ran an FMEA of the same process at the same time: the use of the antibiotics vancomycin and gentamicin.",
        "Në dy spitale të të njëjtit Trust të shërbimit shëndetësor britanik (NHS), dy ekipe bënë njëkohësisht FMEA për të njëjtin proces: përdorimin e antibiotikëve vankomicinë dhe gentamicinë.",
        "In zwei Kliniken desselben NHS-Trusts führten zwei Teams gleichzeitig eine FMEA desselben Prozesses durch: der Anwendung der Antibiotika Vancomycin und Gentamicin."),
      blocks: [
        { type: "columns", max: 50, height: 100, source: ["shebl-2009"],
          label: x("Failures found by each team, and by both", "Dështimet që gjeti secili ekip, dhe të dy bashkë", "Gefundene Fehler je Team und von beiden"),
          items: [
            { k: x("Team 1", "Ekipi 1", "Team 1"), v: 50, n: "50" },
            { k: x("Team 2", "Ekipi 2", "Team 2"), v: 50, n: "50" },
            { k: x("Found by both", "Nga të dy", "Von beiden"), v: 17, n: "17", alert: true },
          ] },
        { type: "p", text: x(
          "Their scores for severity and detectability, and their RPNs, differed markedly, so the failures were ranked differently. In a study of hazards in public leisure activities, David Ball and John Watt found that different assessors placed the same hazard very differently on a risk matrix, and the spread stayed large even after long reflection.",
          "Pikët e tyre për ashpërsinë dhe zbulueshmërinë, dhe RPN-të, ndryshonin dukshëm, ndaj dështimet u renditën ndryshe. Në një studim për rreziqet në aktivitete publike të kohës së lirë, David Ball dhe John Watt gjetën se vlerësues të ndryshëm e vendosën të njëjtin rrezik shumë ndryshe në matricë, dhe shpërndarja mbeti e madhe edhe pas reflektimit të gjatë.",
          "Ihre Bewertungen von Bedeutung und Entdeckbarkeit sowie ihre RPZ unterschieden sich deutlich, die Fehler wurden also verschieden gereiht. In einer Studie zu Gefahren bei öffentlichen Freizeitaktivitäten fanden David Ball und John Watt, dass verschiedene Bewertende dieselbe Gefahr sehr unterschiedlich in eine Risikomatrix einordneten, und die Streuung blieb selbst nach langem Nachdenken groß.") },
        { type: "callout", reading: true, text: x(
          "An FMEA says as much about the team as about the process. A second team, or a second look, finds what one team misses.",
          "Një FMEA flet aq për ekipin sa për procesin. Një ekip i dytë, ose një vështrim i dytë, gjen atë që i shpëton një ekipi.",
          "Eine FMEA sagt so viel über das Team wie über den Prozess. Ein zweites Team oder ein zweiter Blick findet, was einem Team entgeht.") },
      ],
      note: x(
        "17 of 50 is 34% for each team; the study's 17% is counted over all 100 failures. One process in one trust.",
        "17 nga 50 janë 34% për secilin ekip; 17% e studimit llogaritet mbi të 100 dështimet. Një proces në një Trust.",
        "17 von 50 sind 34 % je Team; die 17 % der Studie beziehen sich auf alle 100 Fehler. Ein Prozess in einem Trust."),
      source: ["shebl-2009", "ball-watt-2013"],
    },
    {
      id: "model", more: "why-the-handover-is-underrated",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("From RPN to", "Nga RPN te", "Von der RPZ zur"), x("Action Priority", "Prioriteti i Veprimit", "Aufgabenpriorität")],
      lead: x(
        "In June 2019 AIAG and VDA, the US and German automotive bodies, published a joint FMEA handbook. It sets out seven steps and replaces the RPN with an Action Priority, read from a table that gives severity the most weight, then occurrence, then detection.",
        "Në qershor 2019, AIAG dhe VDA, organizatat amerikane dhe gjermane të industrisë së automobilave, botuan një manual të përbashkët për FMEA. Përcakton shtatë hapa dhe e zëvendëson RPN-në me Prioritetin e Veprimit, që lexohet nga një tabelë ku ashpërsia ka peshën më të madhe, pastaj ndodhja, pastaj zbulimi.",
        "Im Juni 2019 veröffentlichten AIAG und VDA, die Verbände der Autoindustrie in den USA und in Deutschland, ein gemeinsames FMEA-Handbuch. Es legt sieben Schritte fest und ersetzt die RPZ durch eine Aufgabenpriorität aus einer Tabelle: erst die Bedeutung, dann das Auftreten, dann die Entdeckung."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Analysis", "Analiza", "Analyse"), items: [
            x("1 Planning and preparation", "1 Planifikimi dhe përgatitja", "1 Planung und Vorbereitung"),
            x("2 Structure analysis", "2 Analiza e strukturës", "2 Strukturanalyse"),
            x("3 Function analysis", "3 Analiza e funksioneve", "3 Funktionsanalyse"),
            x("4 Failure analysis", "4 Analiza e dështimeve", "4 Fehleranalyse"),
          ] },
          { h: x("Risk and action", "Rreziku dhe veprimi", "Risiko und Maßnahmen"), accent: true, items: [
            x("5 Risk analysis", "5 Analiza e rrezikut", "5 Risikoanalyse"),
            x("6 Optimisation", "6 Optimizimi", "6 Optimierung"),
            x("7 Documenting the results (new)", "7 Dokumentimi i rezultateve (i ri)", "7 Ergebnisdokumentation (neu)"),
          ] },
        ] },
        { type: "rows", compact: true, items: [
          { h: x("High", "E lartë", "Hoch"), p: x("Highest priority: improve prevention or detection, or document why the current controls are enough.", "Prioriteti më i lartë: përmirëso parandalimin ose zbulimin, ose dokumento pse mjaftojnë kontrollet aktuale.", "Höchste Priorität: Vermeidung oder Entdeckung verbessern oder begründen, warum die bestehenden Maßnahmen genügen.") },
          { h: x("Medium", "E mesme", "Mittel"), p: x("Find actions or, if the company decides so, document why the controls are enough.", "Gjej veprime ose, nëse kompania vendos kështu, dokumento pse mjaftojnë kontrollet.", "Maßnahmen finden oder, wenn das Unternehmen so entscheidet, begründen, warum sie genügen.") },
          { h: x("Low", "E ulët", "Niedrig"), p: x("Actions may be found.", "Mund të gjenden veprime.", "Maßnahmen können gefunden werden.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The question changes from “how big is the number?” to “what must we do?”. That is the question a team can act on.",
          "Pyetja ndryshon nga “sa i madh është numri?” te “çfarë duhet të bëjmë?”. Kjo është pyetja mbi të cilën një ekip mund të veprojë.",
          "Die Frage ändert sich von „Wie groß ist die Zahl?“ zu „Was müssen wir tun?“. Auf diese Frage kann ein Team handeln.") },
      ],
      note: x(
        "The grouping of the steps is the editors'. Some customers still accept the RPN alongside the Action Priority.",
        "Grupimi i hapave është i redaksisë. Disa klientë e pranojnë ende RPN-në bashkë me Prioritetin e Veprimit.",
        "Die Gruppierung der Schritte stammt von der Redaktion. Manche Kunden akzeptieren die RPZ weiterhin neben der Aufgabenpriorität."),
      source: ["aiag-vda-fmea-2019"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What is wrong with", "Çfarë nuk shkon", "Was an Risikomatrizen"), x("risk matrices", "te matricat e rrezikut", "falsch ist")],
      lead: x(
        "In 2008 Tony Cox analysed risk matrices mathematically in the journal Risk Analysis. He found three kinds of problem.",
        "Në 2008, Tony Cox i analizoi matematikisht matricat e rrezikut te revista Risk Analysis. Gjeti tri lloje problemesh.",
        "2008 analysierte Tony Cox Risikomatrizen mathematisch in der Zeitschrift Risk Analysis. Er fand drei Arten von Problemen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Poor resolution", "Rezolucion i dobët", "Geringe Auflösung"), p: x("Typical matrices compare correctly only a small share of pairs of risks, in his example less than 10%, and give the same rating to very different risks.", "Matricat tipike krahasojnë saktë vetëm një pjesë të vogël të çifteve të rreziqeve, në shembullin e tij më pak se 10%, dhe u japin të njëjtin vlerësim rreziqeve shumë të ndryshme.", "Typische Matrizen vergleichen nur einen kleinen Teil der Risikopaare richtig, in seinem Beispiel weniger als 10 %, und geben sehr verschiedenen Risiken dieselbe Einstufung.") },
          { h: x("Errors", "Gabime", "Fehler"), p: x("They can rate smaller risks above larger ones; when frequency and severity are negatively related, they can be worse than useless.", "Mund t'i vlerësojnë rreziqet më të vogla mbi më të mëdhatë; kur shpeshtësia dhe ashpërsia lidhen negativisht, mund të jenë më keq se të padobishme.", "Sie können kleinere Risiken über größere stellen; hängen Häufigkeit und Schwere negativ zusammen, können sie schlimmer als nutzlos sein.") },
          { h: x("Judgment", "Gjykimi", "Urteil"), p: x("Inputs and outputs need subjective interpretation; different users can rate the same risks in opposite ways.", "Hyrjet dhe daljet kërkojnë interpretim subjektiv; përdorues të ndryshëm mund t'i vlerësojnë të njëjtat rreziqe në mënyra të kundërta.", "Ein- und Ausgaben verlangen subjektive Deutung; verschiedene Nutzer können dieselben Risiken gegensätzlich einstufen.") },
        ] },
        { type: "p", text: x(
          "In 2013 Philip Thomas, Reidar Bratvold and Eric Bickel found no published scientific study showing that risk matrices improve risk decisions. In one drilling example, reversing the scoring scale reversed the order of priorities.",
          "Në 2013, Philip Thomas, Reidar Bratvold dhe Eric Bickel nuk gjetën asnjë studim shkencor të botuar që të tregonte se matricat e rrezikut i përmirësojnë vendimet. Në një shembull shpimi, përmbysja e shkallës së pikëzimit e përmbysi rendin e prioriteteve.",
          "2013 fanden Philip Thomas, Reidar Bratvold und Eric Bickel keine veröffentlichte wissenschaftliche Studie, die zeigt, dass Risikomatrizen Risikoentscheidungen verbessern. In einem Bohrbeispiel kehrte das Umdrehen der Bewertungsskala die Reihenfolge der Prioritäten um.") },
        { type: "callout", reading: true, text: x(
          "A matrix is a picture of judgments, not a measurement. It can open a conversation; it should not close one.",
          "Matrica është pamje e gjykimeve, jo matje. Mund të hapë një bisedë; nuk duhet ta mbyllë.",
          "Eine Matrix ist ein Bild von Urteilen, keine Messung. Sie kann ein Gespräch eröffnen, sollte es aber nicht beenden.") },
      ],
      note: x(
        "Cox's results are mathematical, not measurements in organisations; the 10% is his example.",
        "Rezultatet e Cox-it janë matematikore, jo matje në organizata; 10% është shembulli i tij.",
        "Cox' Ergebnisse sind mathematisch, keine Messungen in Organisationen; die 10 % sind sein Beispiel."),
      source: ["cox-2008", "thomas-bratvold-bickel-2013"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Scoring risk", "Si pikëzohet rreziku", "Risiko bewerten,"), x("without fooling yourself", "pa e mashtruar veten", "ohne sich zu täuschen")],
      lead: x(
        "ISO 31000 defines risk as the effect of uncertainty on objectives, positive or negative, and treats managing it as a process: identify, analyse, evaluate, treat, and keep monitoring and communicating.",
        "ISO 31000 e përkufizon rrezikun si efekt të pasigurisë mbi objektivat, pozitiv ose negativ, dhe menaxhimin e tij e trajton si proces: identifiko, analizo, vlerëso, trajto, dhe vazhdo të monitorosh e të komunikosh.",
        "ISO 31000 definiert Risiko als Auswirkung von Unsicherheit auf Ziele, positiv oder negativ, und behandelt das Risikomanagement als Prozess: identifizieren, analysieren, bewerten, behandeln und dabei laufend überwachen und kommunizieren."),
      blocks: [
        { type: "steps", items: [
          { h: x("List failures with the people who do the work", "Rendit dështimet me njerëzit që e bëjnë punën", "Fehler mit den Menschen sammeln, die die Arbeit tun"), p: x("Two groups, or two sessions, find more than one.", "Dy grupe, ose dy seanca, gjejnë më shumë se një.", "Zwei Gruppen oder zwei Runden finden mehr als eine.") },
          { h: x("Keep the three scores apart", "Mbaji tri pikët veç e veç", "Die drei Bewertungen getrennt halten"), p: x("Write down severity, occurrence and detection, not only their product.", "Shkruaj ashpërsinë, ndodhjen dhe zbulimin, jo vetëm prodhimin e tyre.", "Bedeutung, Auftreten und Entdeckung notieren, nicht nur ihr Produkt.") },
          { h: x("Look at severity first", "Shiko së pari ashpërsinë", "Zuerst auf die Bedeutung schauen"), p: x("A failure with severity 9 or 10 gets an action or a written reason, whatever its RPN.", "Një dështim me ashpërsi 9 ose 10 merr një veprim ose një arsye të shkruar, cilado qoftë RPN-ja.", "Ein Fehler mit Bedeutung 9 oder 10 bekommt eine Maßnahme oder eine schriftliche Begründung, gleich welche RPZ er hat.") },
          { h: x("Score again after the action", "Pikëzo sërish pas veprimit", "Nach der Maßnahme neu bewerten"), p: x("If nothing was done, the risk has not changed.", "Nëse nuk u bë asgjë, rreziku nuk ka ndryshuar.", "Wurde nichts getan, hat sich das Risiko nicht geändert.") },
        ] },
        { type: "example", label: x("Hypothetical example, two failures in a warehouse", "Shembull hipotetik, dy dështime në një magazinë", "Hypothetisches Beispiel, zwei Fehler in einem Lager"), rows: [
          { k: x("Label", "Etiketa", "Etikett"), v: x("Wrong label on a pallet: 4 × 6 × 3 = RPN 72", "Etiketë e gabuar në një paletë: 4 × 6 × 3 = RPN 72", "Falsches Etikett auf einer Palette: 4 × 6 × 3 = RPZ 72") },
          { k: x("Cold chain", "Ftohja", "Kühlkette"), v: x("A medicine order left unrefrigerated: 10 × 2 × 3 = RPN 60", "Një porosi me ilaçe mbetet pa ftohje: 10 × 2 × 3 = RPN 60", "Ein Medikamentenauftrag bleibt ungekühlt: 10 × 2 × 3 = RPZ 60") },
        ], text: x("The RPN puts the label first; severity puts the cold chain first. The failures and scores are invented.", "RPN-ja e vendos etiketën të parën; ashpërsia vendos ftohjen të parën. Dështimet dhe pikët janë të shpikura.", "Die RPZ stellt das Etikett nach vorn, die Bedeutung die Kühlkette. Fehler und Bewertungen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors'; the scores are severity × occurrence × detection.",
        "Hapat dhe shembulli janë të redaksisë; pikët janë ashpërsia × ndodhja × zbulimi.",
        "Schritte und Beispiel stammen von der Redaktion; die Bewertungen sind Bedeutung × Auftreten × Entdeckung."),
      source: ["iso-31000-2018"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The failure-mode", "Karta e mënyrave", "Die Fehlerarten-"), x("card", "të dështimit", "Karte")],
      lead: x(
        "One card per process step. Fill it in with the people who do the work, and keep the three scores side by side.",
        "Një kartë për çdo hap të procesit. Plotësoje me njerëzit që e bëjnë punën, dhe mbaji tri pikët krah njëra-tjetrës.",
        "Eine Karte pro Prozessschritt. Mit den Menschen ausfüllen, die die Arbeit tun, und die drei Bewertungen nebeneinander halten."),
      blocks: [
        { type: "form", items: [
          { h: x("Process step", "Hapi i procesit", "Prozessschritt"), hint: x("where in the process, and who does it", "ku në proces, dhe kush e bën", "wo im Prozess, und wer ihn ausführt") },
          { h: x("What can go wrong", "Çfarë mund të shkojë keq", "Was schiefgehen kann"), hint: x("the failure mode, in the words of the people who see it", "mënyra e dështimit, me fjalët e njerëzve që e shohin", "die Fehlerart, in den Worten derer, die sie sehen") },
          { h: x("Effect", "Pasoja", "Folge"), hint: x("on the customer, the next step or safety", "te klienti, te hapi tjetër ose te siguria", "für Kunden, den nächsten Schritt oder die Sicherheit") },
          { h: x("Severity · occurrence · detection", "Ashpërsia · ndodhja · zbulimi", "Bedeutung · Auftreten · Entdeckung"), hint: x("three scores from 1 to 10, written separately", "tri pikë nga 1 në 10, të shkruara veç e veç", "drei Bewertungen von 1 bis 10, getrennt notiert") },
          { h: x("Priority", "Prioriteti", "Priorität"), hint: x("high, medium or low, and the reason", "e lartë, e mesme ose e ulët, dhe arsyeja", "hoch, mittel oder niedrig, und der Grund") },
          { h: x("Action and check", "Veprimi dhe kontrolli", "Maßnahme und Prüfung"), hint: x("what we do, who, by when, and the scores afterwards", "çfarë bëjmë, kush, deri kur, dhe pikët pas", "was wir tun, wer, bis wann, und die Bewertungen danach") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the AIAG & VDA handbook (2019).",
        "Praktikë e propozuar nga redaksia, sipas manualit AIAG & VDA (2019).",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem AIAG-&-VDA-Handbuch (2019)."),
      source: ["aiag-vda-fmea-2019"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
