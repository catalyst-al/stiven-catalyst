// Management Review, No. 22: Quality: First Pass Yield and the cost of quality. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-22.md.
import { x, pc } from "../common.js";

export default {
  number: 22,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Quality:", "Cilësia:", "Qualität:"), x("First Pass Yield and the cost of quality", "First Pass Yield dhe kostoja e cilësisë", "First Pass Yield und Qualitätskosten")],
  sub: x(
    "Where the idea of a cost of quality came from, how much poor quality costs, the four groups of cost, whether quality is still free, and a card for First Pass Yield.",
    "Nga erdhi ideja e kostos së cilësisë, sa kushton cilësia e dobët, katër grupet e kostos, nëse cilësia është ende falas, dhe një kartë për First Pass Yield.",
    "Woher die Idee der Qualitätskosten kommt, was schlechte Qualität kostet, die vier Kostengruppen, ob Qualität noch kostenlos ist, und eine Karte für First Pass Yield."),
  seo: x(
    "Quality: the cost of quality from Juran to Crosby, ASQ's 15–20% of sales, the four groups of cost, First Pass Yield and a card to measure it.",
    "Cilësia: kostoja e cilësisë nga Juran te Crosby, 15–20% e shitjeve sipas ASQ, katër grupet e kostos, First Pass Yield dhe një kartë për ta matur.",
    "Qualität: Qualitätskosten von Juran bis Crosby, 15–20 % des Umsatzes laut ASQ, die vier Kostengruppen, First Pass Yield und eine Karte zum Messen."),
  feature: x(
    "Issue 22 follows the cost of quality from Juran's handbook of 1951 to Crosby's Quality Is Free, shows how far the reported cost can fall below the real one, sets out the four groups of cost, asks whether quality is still free in modern manufacturing, and ends with a card for First Pass Yield.",
    "Numri 22 ndjek koston e cilësisë nga manuali i Juranit i 1951 te Quality Is Free e Crosby-t, tregon sa poshtë kostos së vërtetë mund të bjerë ajo që raportohet, shtjellon katër grupet e kostos, pyet nëse cilësia është ende falas në prodhimin e sotëm, dhe mbyllet me një kartë për First Pass Yield.",
    "Ausgabe 22 folgt den Qualitätskosten von Jurans Handbuch von 1951 bis zu Crosbys Quality Is Free, zeigt, wie weit die gemeldeten Kosten unter den tatsächlichen liegen können, stellt die vier Kostengruppen vor, fragt, ob Qualität in der heutigen Fertigung noch kostenlos ist, und endet mit einer Karte für First Pass Yield."),
  figure: { n: x("15–20%", "15–20%", "15–20 %"), by: "ASQ", t: x(
    "of sales revenue is what quality-related costs reach in many organisations, by ASQ's estimate; in some, as much as 40% of operations.",
    "e të ardhurave nga shitjet: aq arrijnë kostot e lidhura me cilësinë te shumë organizata, sipas vlerësimit të ASQ; te disa, deri në 40% të operacioneve.",
    "des Umsatzes erreichen qualitätsbezogene Kosten in vielen Organisationen, schätzt die ASQ; in manchen bis zu 40 % des gesamten Betriebs.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Gold in the mine", "Ar në minierë", "Gold in der Mine") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Four groups of cost", "Katër grupet e kostos", "Vier Kostengruppen") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The First Pass Yield card", "Karta e First Pass Yield", "Die First-Pass-Yield-Karte") },
  ],
  sources: ["juran-1951", "feigenbaum-1956", "crosby-1979", "asq-coq", "oecd-patient-safety-2017", "schiffauerova-thomson-2006", "plewa-2016", "isixsigma-rty"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every operation pays for its mistakes: the order packed twice, the delivery made again, the complaint answered. This issue asks how much of that cost an operation can see, and which measure shows it earliest.",
        "Çdo operacion paguan për gabimet e veta: porosia e paketuar dy herë, dorëzimi i bërë sërish, ankesa që merr përgjigje. Ky numër pyet sa nga kjo kosto e sheh një operacion, dhe cila masë e tregon më herët.",
        "Jeder Betrieb bezahlt für seine Fehler: den doppelt gepackten Auftrag, die wiederholte Lieferung, die beantwortete Beschwerde. Diese Ausgabe fragt, wie viel dieser Kosten ein Betrieb sehen kann und welche Kennzahl sie am frühesten zeigt."),
      body: x(
        "Joseph Juran's handbook of 1951 first treated quality costs and called the cost of failures gold in the mine. Armand Feigenbaum split them into four groups in 1956; Philip Crosby argued in 1979 that quality is free and that what costs money is not doing a job right the first time. ASQ estimates that in many organisations these costs reach 15–20% of sales. First Pass Yield shows, step by step, how much work goes right the first time.",
        "Manuali i Juranit i 1951 i trajtoi i pari kostot e cilësisë dhe koston e dështimeve e quajti ar në minierë. Armand Feigenbaum i ndau në katër grupe në 1956; Philip Crosby argumentoi në 1979 se cilësia është falas dhe se para kushton puna që nuk bëhet mirë herën e parë. ASQ vlerëson se te shumë organizata këto kosto arrijnë 15–20% të shitjeve. First Pass Yield tregon, hap pas hapi, sa punë bëhet mirë herën e parë.",
        "Joseph Jurans Handbuch von 1951 behandelte erstmals Qualitätskosten und nannte die Fehlerkosten Gold in der Mine. Armand Feigenbaum teilte sie 1956 in vier Gruppen ein; Philip Crosby argumentierte 1979, Qualität sei kostenlos und Geld koste, was beim ersten Mal nicht richtig gemacht wird. Die ASQ schätzt, dass diese Kosten in vielen Organisationen 15–20 % des Umsatzes erreichen. First Pass Yield zeigt Schritt für Schritt, wie viel Arbeit beim ersten Mal gelingt."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Gold in", "Ar në", "Gold in"), x("the mine", "minierë", "der Mine")],
      lead: x(
        "The idea that quality has a cost that can be counted is older than most quality programmes. It took shape between 1951 and 1979, in a handbook, an article and a book.",
        "Ideja se cilësia ka një kosto që mund të numërohet është më e vjetër se shumica e programeve të cilësisë. Mori formë mes 1951 dhe 1979, në një manual, një artikull dhe një libër.",
        "Die Idee, dass Qualität Kosten hat, die man zählen kann, ist älter als die meisten Qualitätsprogramme. Sie nahm zwischen 1951 und 1979 Gestalt an, in einem Handbuch, einem Artikel und einem Buch."),
      blocks: [
        { type: "timeline", items: [
          { k: "1951", t: x("Juran's Quality-Control Handbook first treats quality costs and calls the cost of failures gold in the mine.", "Quality-Control Handbook i Juranit trajton i pari kostot e cilësisë dhe koston e dështimeve e quan ar në minierë.", "Jurans Quality-Control Handbook behandelt erstmals Qualitätskosten und nennt die Fehlerkosten Gold in der Mine.") },
          { k: "1956", t: x("Feigenbaum, in Harvard Business Review, splits them into four groups: prevention, appraisal, internal and external failure.", "Feigenbaum, te Harvard Business Review, i ndan në katër grupe: parandalim, kontroll, dështime të brendshme dhe të jashtme.", "Feigenbaum teilt sie in der Harvard Business Review in vier Gruppen ein: Verhütung, Prüfung, interne und externe Fehler.") },
          { k: "1979", t: x("Crosby, Quality Is Free: quality is conformance to requirements, measured by the price of nonconformance.", "Crosby, Quality Is Free: cilësia është përputhje me kërkesat dhe matet me çmimin e mospërputhjes.", "Crosby, Quality Is Free: Qualität ist Erfüllung der Anforderungen, gemessen am Preis der Abweichung.") },
        ] },
        { type: "quote", text: x(
          "What costs money are the unquality things — all the actions that involve not doing jobs right the first time.",
          "Para kushtojnë gjërat pa cilësi: të gjitha veprimet ku puna nuk bëhet mirë herën e parë.",
          "Geld kosten die Dinge ohne Qualität: alle Handlungen, bei denen Arbeit nicht beim ersten Mal richtig gemacht wird.") },
        { type: "p", text: x(
          "Juran's point was that failure costs can be cut sharply by investing in improvement, so they are a source of money, not only a loss. Crosby went further: the money is in the price of not conforming.",
          "Ideja e Juranit ishte se kostot e dështimeve mund të ulen shumë po të investosh në përmirësim, prandaj janë burim parash, jo vetëm humbje. Crosby shkoi më tej: paraja është te çmimi i mospërputhjes.",
          "Juran meinte, dass sich Fehlerkosten durch Investitionen in Verbesserung stark senken ließen, sie also eine Geldquelle seien, nicht nur ein Verlust. Crosby ging noch weiter: Das Geld steckt im Preis der Abweichung.") },
        { type: "callout", reading: true, text: x(
          "The cost of poor quality is not one line in the accounts. It is spread across rework, extra checks, returns and the time of the people who put things right.",
          "Kostoja e cilësisë së dobët nuk është një rresht në llogari. Është e shpërndarë te ripunimi, kontrollet shtesë, kthimet dhe koha e njerëzve që i ndreqin gjërat.",
          "Die Kosten schlechter Qualität sind kein einzelner Posten in der Buchhaltung. Sie verteilen sich auf Nacharbeit, zusätzliche Prüfungen, Rücksendungen und die Zeit der Menschen, die Dinge richten.") },
      ],
      source: ["juran-1951", "feigenbaum-1956", "crosby-1979"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What poor quality", "Sa kushton", "Was schlechte"), x("costs", "cilësia e dobët", "Qualität kostet")],
      lead: x(
        "ASQ estimates that in many organisations the true quality-related costs reach 15–20% of sales revenue, and in some as much as 40% of total operations. It gives no method: the figure is an estimate, not a measurement.",
        "ASQ vlerëson se te shumë organizata kostot e vërteta të lidhura me cilësinë arrijnë 15–20% të të ardhurave nga shitjet, dhe te disa deri në 40% të operacioneve. Nuk jep metodë: shifra është vlerësim, jo matje.",
        "Die ASQ schätzt die tatsächlichen Qualitätskosten in vielen Organisationen auf 15–20 % des Umsatzes, in manchen auf bis zu 40 % des gesamten Betriebs. Eine Methode nennt sie nicht: Es ist eine Schätzung, keine Messung."),
      blocks: [
        { type: "dumbbell", from: x("Reported", "E raportuar", "Gemeldet"), to: x("Real", "E vërtetë", "Tatsächlich"), min: 0, max: 20, source: ["crosby-1979"],
          label: x("Cost of quality as a share of sales in Crosby's maturity grid, by stage", "Kostoja e cilësisë si pjesë e shitjeve te tabela e pjekurisë e Crosby-t, sipas fazës", "Qualitätskosten in % des Umsatzes nach Crosbys Reifegradstufen"),
          rows: [
            { k: x("Awakening", "Zgjimi", "Erwachen"), a: 3, an: pc(3), b: 18, bn: pc(18), alert: true },
            { k: x("Enlightenment", "Ndriçimi", "Erleuchtung"), a: 8, an: pc(8), b: 12, bn: pc(12) },
            { k: x("Wisdom", "Mençuria", "Weisheit"), a: 6.5, an: x("6.5%", "6,5%", "6,5 %"), b: 8, bn: pc(8) },
          ] },
        { type: "p", text: x(
          "In his maturity grid of 1979, Crosby set the cost of quality that companies report against what he estimated it really is. In the first stage, uncertainty, the cost is not known; he put it at 20% of sales. In the last, certainty, at 2.5%.",
          "Te tabela e pjekurisë e 1979, Crosby e vuri koston e cilësisë që raportojnë kompanitë përballë asaj që ai vlerësonte se ishte vërtet. Në fazën e parë, pasigurinë, kostoja nuk dihet; ai e çmoi në 20% të shitjeve. Në të fundit, sigurinë, në 2,5%.",
          "In seinem Reifegradgitter von 1979 stellte Crosby die Qualitätskosten, die Unternehmen melden, dem gegenüber, was sie seiner Schätzung nach wirklich betragen. In der ersten Stufe, der Ungewissheit, sind die Kosten unbekannt; er setzte sie mit 20 % des Umsatzes an. In der letzten, der Gewissheit, mit 2,5 %.") },
        { type: "p", text: x(
          "Outside the factory the cost shows too: an OECD review of the evidence found that 15% of hospital spending and activity goes to treating failures of patient safety.",
          "Kostoja duket edhe jashtë fabrikës: një rishikim i provave nga OECD gjeti se 15% e shpenzimeve dhe e aktivitetit të spitaleve shkon për trajtimin e dështimeve të sigurisë së pacientit.",
          "Auch außerhalb der Fabrik zeigen sich die Kosten: Laut einer Auswertung der Studienlage durch die OECD fließen 15 % der Ausgaben und Leistungen von Krankenhäusern in die Behandlung von Fehlern bei der Patientensicherheit.") },
        { type: "callout", reading: true, text: x(
          "The reported cost of quality is what someone has counted. Most of the real cost sits where nobody counts: in rework and in the time spent fixing.",
          "Kostoja e raportuar e cilësisë është ajo që ka numëruar dikush. Pjesa më e madhe e kostos së vërtetë rri aty ku s'numëron askush: te ripunimi dhe te koha që shkon për të ndrequr.",
          "Die gemeldeten Qualitätskosten sind das, was jemand gezählt hat. Der größte Teil der tatsächlichen Kosten liegt dort, wo niemand nachzählt: in Nacharbeit und in der Zeit für Korrekturen.") },
      ],
      note: x(
        "Crosby's figures are illustrative estimates from 1979, not measured data.",
        "Shifrat e Crosby-t janë vlerësime ilustruese të vitit 1979, jo të dhëna të matura.",
        "Crosbys Zahlen sind veranschaulichende Schätzungen von 1979, keine gemessenen Daten."),
      source: ["asq-coq", "crosby-1979", "oecd-patient-safety-2017"],
    },
    {
      id: "model", more: "kpis-the-team-trusts",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four groups", "Katër grupet", "Vier Gruppen"), x("of cost", "e kostos", "von Kosten")],
      lead: x(
        "The model Feigenbaum described in 1956 is still the most used: two groups of cost are spent to get quality right, two are paid when it goes wrong.",
        "Modeli që përshkroi Feigenbaum në 1956 është ende më i përdoruri: dy grupe kostosh shpenzohen që cilësia të dalë mirë, dy paguhen kur del keq.",
        "Das Modell, das Feigenbaum 1956 beschrieb, ist bis heute das meistgenutzte: Zwei Kostengruppen gibt man aus, damit Qualität gelingt, zwei bezahlt man, wenn sie misslingt."),
      blocks: [
        { type: "lists", cols: [
          { h: x("The cost of good quality", "Kostoja e cilësisë së mirë", "Kosten guter Qualität"), items: [
            x("Prevention: training, process design, keeping the quality system", "Parandalimi: trajnimi, hartimi i procesit, mbajtja e sistemit të cilësisë", "Verhütung: Schulung, Prozessgestaltung, Pflege des Qualitätssystems"),
            x("Appraisal: measuring, inspecting, testing, auditing", "Kontrolli: matja, inspektimi, testimi, auditimi", "Prüfung: Messen, Inspizieren, Testen, Auditieren"),
          ] },
          { h: x("The cost of poor quality", "Kostoja e cilësisë së dobët", "Kosten schlechter Qualität"), accent: true, items: [
            x("Internal failure, found before the customer: scrap, rework, failure analysis", "Dështimet e brendshme, para klientit: hedhje, ripunim, analiza e dështimit", "Interne Fehler, vor den Kunden entdeckt: Ausschuss, Nacharbeit, Fehleranalyse"),
            x("External failure, found by the customer: returns, warranty, complaints", "Dështimet e jashtme, te klienti: kthime, garanci, ankesa", "Externe Fehler, bei den Kunden entdeckt: Rücksendungen, Garantie, Beschwerden"),
          ] },
        ] },
        { type: "example", label: x("Hypothetical example, a warehouse", "Shembull hipotetik, një magazinë", "Hypothetisches Beispiel, ein Lager"), rows: [
          { k: x("Prevention", "Parandalimi", "Verhütung"), v: x("Training on the new labels", "Trajnimi për etiketat e reja", "Schulung zu den neuen Etiketten") },
          { k: x("Appraisal", "Kontrolli", "Prüfung"), v: x("Scanning every pallet before loading", "Skanimi i çdo palete para ngarkimit", "Scannen jeder Palette vor dem Verladen") },
          { k: x("Internal", "E brendshme", "Intern"), v: x("Repacking a wrong order before it leaves", "Ripaketimi i një porosie të gabuar para se të dalë", "Umpacken eines falschen Auftrags vor dem Versand") },
          { k: x("External", "E jashtme", "Extern"), v: x("A second delivery after a complaint", "Një dorëzim i dytë pas një ankese", "Eine zweite Lieferung nach einer Beschwerde") },
        ], text: x("The later a mistake is found, the more steps and people it has already passed. The examples are invented.", "Sa më vonë gjendet një gabim, aq më shumë hapa dhe njerëz ka kaluar tashmë. Shembujt janë të shpikur.", "Je später ein Fehler entdeckt wird, desto mehr Schritte und Menschen hat er schon durchlaufen. Die Beispiele sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A team that counts only failures sees half of the model. The other half is where the money for fewer failures is spent.",
          "Një ekip që numëron vetëm dështimet sheh gjysmën e modelit. Gjysma tjetër është aty ku shpenzohen paratë për më pak dështime.",
          "Ein Team, das nur Fehler zählt, sieht die Hälfte des Modells. Die andere Hälfte ist dort, wo das Geld für weniger Fehler ausgegeben wird.") },
      ],
      note: x(
        "The four groups are Feigenbaum's, as ASQ describes them today; the examples are the editors'.",
        "Katër grupet janë të Feigenbaum-it, ashtu siç i përshkruan sot ASQ; shembujt janë të redaksisë.",
        "Die vier Gruppen stammen von Feigenbaum, wie die ASQ sie heute beschreibt; die Beispiele stammen von der Redaktion."),
      source: ["feigenbaum-1956", "asq-coq"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Is quality", "A është ende", "Ist Qualität"), x("still free?", "falas cilësia?", "noch kostenlos?")],
      lead: x(
        "Two studies in the International Journal of Quality & Reliability Management look at how the cost of quality is used, and at what happens to it as quality improves.",
        "Dy studime te International Journal of Quality & Reliability Management shikojnë si përdoret kostoja e cilësisë, dhe çfarë ndodh me të kur cilësia përmirësohet.",
        "Zwei Studien im International Journal of Quality & Reliability Management untersuchen, wie Qualitätskosten genutzt werden und was mit ihnen geschieht, wenn die Qualität besser wird."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Most programmes do not use it", "Shumica e programeve nuk e përdorin", "Die meisten Programme nutzen sie nicht"), p: x("Reviewing the research on cost-of-quality models, Schiffauerova and Thomson found that most quality programmes do not use the cost of quality. Prevention–appraisal–failure is the most used model, and companies that use one report lower quality costs and better quality for their customers.", "Duke rishikuar kërkimet për modelet e kostos së cilësisë, Schiffauerova dhe Thomson gjetën se shumica e programeve të cilësisë nuk e përdorin koston e cilësisë. Modeli parandalim–kontroll–dështim është më i përdoruri, dhe kompanitë që përdorin një model raportojnë kosto më të ulëta të cilësisë dhe cilësi më të mirë për klientët.", "Bei der Durchsicht der Forschung zu Qualitätskostenmodellen fanden Schiffauerova und Thomson, dass die meisten Qualitätsprogramme die Qualitätskosten nicht nutzen. Verhütung–Prüfung–Fehler ist das meistgenutzte Modell, und Unternehmen, die eines nutzen, berichten von geringeren Qualitätskosten und besserer Qualität für ihre Kunden.") },
          { h: x("As quality rises, total cost falls", "Kur cilësia rritet, kostoja totale bie", "Steigt die Qualität, sinken die Gesamtkosten"), p: x("With data from manufacturing, Plewa, Kaiser and Hartmann found that as quality performance rises, the total cost of quality and the cost of failures fall, while spending on prevention and appraisal does not rise significantly.", "Me të dhëna nga prodhimi, Plewa, Kaiser dhe Hartmann gjetën se kur performanca e cilësisë rritet, kostoja totale e cilësisë dhe kostoja e dështimeve bien, ndërsa shpenzimet për parandalimin dhe kontrollin nuk rriten në mënyrë domethënëse.", "Mit Daten aus der Fertigung fanden Plewa, Kaiser und Hartmann, dass bei steigender Qualitätsleistung die gesamten Qualitätskosten und die Fehlerkosten sinken, während die Ausgaben für Verhütung und Prüfung nicht signifikant steigen.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The research supports Crosby more than it contradicts him: better quality went with lower total cost. It shows a link, not a recipe.",
          "Kërkimi e mbështet Crosby-n më shumë se e kundërshton: cilësia më e mirë shkoi bashkë me kosto totale më të ulët. Tregon një lidhje, jo një recetë.",
          "Die Forschung stützt Crosby eher, als dass sie ihm widerspricht: Bessere Qualität ging mit niedrigeren Gesamtkosten einher. Sie zeigt einen Zusammenhang, kein Rezept.") },
      ],
      note: x(
        "Both rest on reported cases or correlations; we could not see the sample size of the 2016 study.",
        "Të dyja mbështeten te raste të raportuara ose te korrelacione; madhësinë e mostrës së studimit të 2016 s'e kam parë dot.",
        "Beide beruhen auf berichteten Fällen oder Korrelationen; die Stichprobengröße der Studie von 2016 konnten wir nicht einsehen."),
      source: ["schiffauerova-thomson-2006", "plewa-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("First Pass Yield,", "First Pass Yield,", "First Pass Yield,"), x("step by step", "hap pas hapi", "Schritt für Schritt")],
      lead: x(
        "First Pass Yield is the share of units that pass a step the first time, without rework or scrap. Multiplied across all the steps, it gives the Rolled Throughput Yield: the chance that a unit passes the whole process without a defect.",
        "First Pass Yield është pjesa e njësive që e kalojnë një hap herën e parë, pa ripunim dhe pa u hedhur. E shumëzuar për të gjithë hapat, jep Rolled Throughput Yield: mundësinë që një njësi ta kalojë gjithë procesin pa defekt.",
        "First Pass Yield ist der Anteil der Einheiten, die einen Schritt beim ersten Mal ohne Nacharbeit oder Ausschuss durchlaufen. Über alle Schritte multipliziert ergibt er den Rolled Throughput Yield: die Wahrscheinlichkeit, dass eine Einheit den ganzen Prozess ohne Fehler durchläuft."),
      blocks: [
        { type: "steps", items: [
          { h: x("List the steps", "Rendit hapat", "Die Schritte auflisten"), p: x("From order to delivery, in the order the work happens.", "Nga porosia te dorëzimi, sipas radhës së punës.", "Vom Auftrag bis zur Lieferung, in der Reihenfolge der Arbeit.") },
          { h: x("Count the first-time passes", "Numëro kalimet herën e parë", "Zählen, was beim ersten Mal gelingt"), p: x("A unit that was reworked does not count as good.", "Një njësi e ripunuar nuk llogaritet e mirë.", "Eine nachgearbeitete Einheit zählt nicht als gut.") },
          { h: x("Multiply", "Shumëzo", "Multiplizieren"), p: x("Four steps at 85% each give 52.2%: about half the units pass every step the first time.", "Katër hapa me 85% secili japin 52,2%: rreth gjysma e njësive i kalojnë të gjithë hapat herën e parë.", "Vier Schritte mit je 85 % ergeben 52,2 %: Etwa die Hälfte der Einheiten durchläuft alle Schritte beim ersten Mal.") },
          { h: x("Start with the lowest step", "Nis nga hapi më i dobët", "Beim schwächsten Schritt beginnen"), p: x("Improve the step with the lowest yield first.", "Përmirëso së pari hapin me rendimentin më të ulët.", "Zuerst den Schritt mit der niedrigsten Ausbeute verbessern.") },
        ] },
        { type: "example", label: x("Hypothetical example, an order through a warehouse", "Shembull hipotetik, një porosi nëpër magazinë", "Hypothetisches Beispiel, ein Auftrag durch ein Lager"), rows: [
          { k: x("Picking", "Mbledhja", "Kommissionieren"), v: x("97 of 100 right the first time", "97 nga 100 mirë herën e parë", "97 von 100 beim ersten Mal richtig") },
          { k: x("Packing", "Paketimi", "Verpacken"), v: x("99 of 100", "99 nga 100", "99 von 100") },
          { k: x("Loading", "Ngarkimi", "Verladen"), v: x("98 of 100", "98 nga 100", "98 von 100") },
          { k: x("Delivery", "Dorëzimi", "Zustellung"), v: x("96 of 100", "96 nga 100", "96 von 100") },
        ], text: x("Each step looks good, yet only 90.3% of orders pass all four the first time. The numbers are invented.", "Çdo hap duket mirë, por vetëm 90,3% e porosive i kalojnë të katër herën e parë. Numrat janë të shpikur.", "Jeder Schritt sieht gut aus, doch nur 90,3 % der Aufträge durchlaufen alle vier beim ersten Mal. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors'; the formula follows iSixSigma.",
        "Hapat dhe shembulli janë të redaksisë; formula ndjek iSixSigma.",
        "Schritte und Beispiel stammen von der Redaktion; die Formel folgt iSixSigma."),
      source: ["isixsigma-rty"],
    },
    {
      id: "tool", tool: "/tools/damage-control/",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The First Pass", "Karta e", "Die First-Pass-"), x("Yield card", "First Pass Yield", "Yield-Karte")],
      lead: x(
        "One card for one process. Fill in a week of counts, multiply, and choose the step to improve first.",
        "Një kartë për një proces. Plotëso numërimet e një jave, shumëzo, dhe zgjidh hapin që përmirësohet i pari.",
        "Eine Karte für einen Prozess. Die Zählungen einer Woche eintragen, multiplizieren und den Schritt wählen, der zuerst verbessert wird."),
      blocks: [
        { type: "form", items: [
          { h: x("Process", "Procesi", "Prozess"), hint: x("from where to where, and which unit is counted", "nga ku deri ku, dhe cila njësi numërohet", "von wo bis wo, und welche Einheit gezählt wird") },
          { h: x("Steps and First Pass Yield", "Hapat dhe First Pass Yield", "Schritte und First Pass Yield"), hint: x("step · units in · right the first time · share", "hapi · njësi që hynë · mirë herën e parë · pjesa", "Schritt · Einheiten hinein · beim ersten Mal richtig · Anteil"), lines: 3 },
          { h: x("Rolled Throughput Yield", "Rolled Throughput Yield", "Rolled Throughput Yield"), hint: x("the shares of all the steps, multiplied", "pjesët e të gjithë hapave, të shumëzuara", "die Anteile aller Schritte, multipliziert") },
          { h: x("Weakest step", "Hapi më i dobët", "Schwächster Schritt"), hint: x("the lowest share, and its most frequent failure", "pjesa më e ulët, dhe dështimi i saj më i shpeshtë", "der niedrigste Anteil und sein häufigster Fehler") },
          { h: x("Where it is paid", "Ku paguhet", "Wo es bezahlt wird"), hint: x("internal failure or external failure", "dështim i brendshëm apo i jashtëm", "interner oder externer Fehler") },
          { h: x("One change", "Një ndryshim", "Eine Änderung"), hint: x("what we change this week, and when we count again", "çfarë ndryshojmë këtë javë, dhe kur numërojmë sërish", "was wir diese Woche ändern und wann wir wieder zählen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, on Feigenbaum's groups of cost and the yields as iSixSigma defines them.",
        "Praktikë e propozuar nga redaksia, mbi grupet e kostos të Feigenbaum-it dhe rendimentet siç i përkufizon iSixSigma.",
        "Eine Praxis, die die Redaktion vorschlägt, auf Grundlage von Feigenbaums Kostengruppen und den Ausbeuten, wie iSixSigma sie definiert."),
      source: ["feigenbaum-1956", "isixsigma-rty"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
