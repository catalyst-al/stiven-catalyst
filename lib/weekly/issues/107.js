// Management Review, No. 107: Decision fatigue, the hungry judges and what is left of them. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-107.md. Danziger, Levav & Avnaim-Pesso (2011) were read
// in full at PubMed Central; Glöckner (2016) in full in the open PDF of Judgment and Decision Making. The letter of
// Weinshall-Margel & Shapard and the authors' reply (both PNAS, 2011) were read in full at PubMed Central through a
// fetch tool, as the pages could not be downloaded directly. The multi-lab replication of ego depletion is given as
// Glöckner reports it. Decisions under pressure are No. 62, hours awake No. 89, defaults No. 93, overconfidence
// No. 97, noise between judges No. 20: not repeated.
import { x } from "../common.js";

// "64.2%" in English, "64,2%" in Albanian, "64,2 %" in German.
const pcd = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 107,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Decision fatigue:", "Lodhja nga vendimet:", "Entscheidungsmüdigkeit:"), x("the hungry judges", "gjyqtarët e uritur", "die hungrigen Richter")],
  sub: x(
    "The parole study everyone quotes, the order of the cases it overlooked, a rational judge in a simulation, three explanations for one curve, how to count your own decisions, and a card for the last hour of the shift.",
    "Studimi i lirimeve me kusht që e citojnë të gjithë, rendi i rasteve që i shpëtoi, një gjyqtar racional në simulim, tri shpjegime për një kurbë, si numërohen vendimet e tua, dhe një kartë për orën e fundit të turnit.",
    "Die Bewährungsstudie, die alle zitieren, die Reihenfolge der Fälle, die sie übersah, ein rationaler Richter in der Simulation, drei Erklärungen für eine Kurve, wie man eigene Entscheidungen zählt, und eine Karte für die letzte Stunde der Schicht."),
  seo: x(
    "Decision fatigue and the hungry judge study: what Danziger et al. found, what the critics showed, and when a manager should decide.",
    "Lodhja nga vendimet dhe studimi i gjyqtarëve të uritur: çfarë gjeti, çfarë treguan kritikët dhe kur duhet të vendosë menaxheri.",
    "Entscheidungsmüdigkeit und die Studie der hungrigen Richter: was sie fand, was die Kritiker zeigten und wann eine Führungskraft entscheiden sollte."),
  feature: x(
    "Few studies are quoted as often as the hungry judges: Israeli parole boards granted about 65% of requests at the start of a session and almost none at its end, until a food break reset them. Issue 107 reads the study, the letter that found the cases were not in random order, and a simulation in which a perfectly rational judge draws a similar curve. What remains is smaller, and still useful: a card for the decisions that come at the end of a shift.",
    "Pak studime citohen aq shpesh sa gjyqtarët e uritur: komisionet izraelite të lirimit me kusht pranonin rreth 65% të kërkesave në fillim të seancës dhe pothuajse asnjë në fund të saj, derisa një pushim për të ngrënë i kthente në pikën e nisjes. Numri 107 lexon studimin, letrën që gjeti se rastet nuk vinin në rend të rastësishëm, dhe një simulim ku një gjyqtar krejt racional vizaton një kurbë të ngjashme. Ajo që mbetet është më e vogël, por ende e dobishme: një kartë për vendimet që vijnë në fund të turnit.",
    "Kaum eine Studie wird so oft zitiert wie die der hungrigen Richter: Israelische Bewährungsausschüsse gaben zu Beginn einer Sitzung rund 65 % der Anträge statt und am Ende fast keinem, bis eine Essenspause sie zurücksetzte. Ausgabe 107 liest die Studie, den Leserbrief, der fand, dass die Fälle nicht zufällig geordnet waren, und eine Simulation, in der ein vollkommen rationaler Richter eine ähnliche Kurve zeichnet. Was bleibt, ist kleiner und trotzdem nützlich: eine Karte für die Entscheidungen am Ende einer Schicht."),
  figure: { n: x("≈65%", "≈65%", "≈65 %"), by: "Danziger et al., 2011", t: x(
    "of rulings favoured the prisoner at the start of each session; by its end, nearly none. Israel, 1,112 rulings.",
    "e vendimeve ishin në favor të të burgosurit në fillim të çdo seance; në fund të saj, gati asnjë. Izrael, 1.112 vendime.",
    "der Entscheidungen fielen zu Beginn jeder Sitzung zugunsten des Gefangenen aus; an ihrem Ende fast keine. Israel, 1.112 Entscheidungen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Eight judges, two breaks", "Tetë gjyqtarë, dy pushime", "Acht Richter, zwei Pausen") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("A rational judge draws the same curve", "Një gjyqtar racional vizaton të njëjtën kurbë", "Ein rationaler Richter zeichnet dieselbe Kurve") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The last-hour decision card", "Karta e vendimeve të orës së fundit", "Die Karte für die letzte Stunde") },
  ],
  sources: ["fatigue-danziger-2011", "fatigue-weinshall-2011", "fatigue-danziger-reply-2011", "fatigue-gloeckner-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Managers make their hardest calls late: the last request of the day, the complaint at the end of the night, the approval before handover. A famous study says that tired people then fall back on no. This issue asks how much of that claim survived its critics, and what a manager can still do with what survived.",
        "Menaxherët i marrin vendimet më të vështira vonë: kërkesa e fundit e ditës, ankesa në fund të natës, miratimi para dorëzimit. Një studim i famshëm thotë se njerëzit e lodhur atëherë kthehen te jo-ja. Ky numër pyet sa nga ky pohim i mbijetoi kritikëve, dhe çfarë mund të bëjë ende menaxheri me atë që mbijetoi.",
        "Führungskräfte treffen ihre schwersten Entscheidungen spät: der letzte Antrag des Tages, die Beschwerde am Ende der Nacht, die Freigabe vor der Übergabe. Eine berühmte Studie sagt, dass Müde dann auf Nein zurückfallen. Diese Ausgabe fragt, wie viel davon die Kritik überstand und was eine Führungskraft mit dem Rest anfangen kann."),
      body: x(
        "In 2011 a study of 1,112 parole rulings found favourable decisions falling from about 65% to nearly zero within each session. A letter showed that prisoners without a lawyer usually came last; the authors replied that the pattern held. In 2016 a simulation showed that a rational judge who avoids starting long cases before a break produces much of the drop. Three explanations, one way to count your own decisions, and a card for the last hour close the issue.",
        "Më 2011 një studim i 1.112 vendimeve për lirim me kusht gjeti se vendimet në favor binin nga rreth 65% në gati zero brenda çdo seance. Një letër tregoi se të burgosurit pa avokat vinin zakonisht të fundit; autorët u përgjigjën se modeli qëndronte. Më 2016 një simulim tregoi se një gjyqtar racional që nuk nis raste të gjata para pushimit e prodhon një pjesë të madhe të rënies. Tri shpjegime, një mënyrë për të numëruar vendimet e tua dhe një kartë për orën e fundit e mbyllin numrin.",
        "2011 fand eine Studie von 1.112 Bewährungsentscheidungen, dass günstige Entscheidungen in jeder Sitzung von rund 65 % auf fast null fielen. Ein Leserbrief zeigte, dass Gefangene ohne Anwalt meist zuletzt kamen; die Autoren antworteten, das Muster bleibe. 2016 zeigte eine Simulation, dass ein rationaler Richter, der vor der Pause keine langen Fälle mehr beginnt, einen großen Teil des Abfalls erzeugt. Drei Erklärungen, eine Art, eigene Entscheidungen zu zählen, und eine Karte für die letzte Stunde schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Eight judges,", "Tetë gjyqtarë,", "Acht Richter,"), x("two breaks", "dy pushime", "zwei Pausen")],
      lead: x(
        "Shai Danziger, Jonathan Levav and Liora Avnaim-Pesso coded 1,112 rulings by eight Israeli judges on two parole boards, over 50 days in ten months. A late-morning snack and lunch cut each day into three sessions. Within each, favourable rulings fell from about 65% to nearly zero, then jumped back after the break.",
        "Shai Danziger, Jonathan Levav dhe Liora Avnaim-Pesso koduan 1.112 vendime të tetë gjyqtarëve izraelitë në dy komisione lirimi me kusht, gjatë 50 ditëve në dhjetë muaj. Një zemër mëngjesi dhe dreka e ndanin çdo ditë në tri seanca. Brenda secilës, vendimet në favor binin nga rreth 65% në gati zero, pastaj kërcenin sërish pas pushimit.",
        "Shai Danziger, Jonathan Levav und Liora Avnaim-Pesso werteten 1.112 Entscheidungen von acht israelischen Richtern in zwei Bewährungsausschüssen aus, an 50 Tagen in zehn Monaten. Ein Imbiss am späten Vormittag und das Mittagessen teilten jeden Tag in drei Sitzungen. In jeder fielen günstige Entscheidungen von rund 65 % auf fast null und sprangen nach der Pause zurück."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: pcd("64.2"), t: x("of requests were rejected; 48.4% of these rejections were deferrals to a later hearing", "e kërkesave u refuzuan; 48,4% e këtyre refuzimeve ishin shtyrje për një seancë të mëvonshme", "der Anträge wurden abgelehnt; 48,4 % dieser Ablehnungen waren Vertagungen auf eine spätere Anhörung") },
          { n: x("22.5", "22,5", "22,5"), t: x("years on the bench, the judges' average experience", "vjet në gjykatë, përvoja mesatare e gjyqtarëve", "Jahre im Amt, die mittlere Erfahrung der Richter") },
        ] },
        { type: "p", text: x(
          "The drop held after controls for the crime, months served, earlier prison terms, a rehabilitation programme, sex and nationality, and it held for every judge. The authors read it as depletion: after many rulings, a judge falls back on the status quo, which here means no.",
          "Rënia qëndroi pas kontrollit për krimin, muajt e vuajtur, dënimet e mëparshme, programin e rehabilitimit, gjininë dhe kombësinë, dhe qëndroi për çdo gjyqtar. Autorët e lexuan si shterim: pas shumë vendimeve, gjyqtari kthehet te status quo-ja, që këtu do të thotë jo.",
          "Der Abfall blieb nach Kontrolle für Delikt, verbüßte Monate, frühere Haftstrafen, ein Resozialisierungsprogramm, Geschlecht und Nationalität bestehen, und er galt für jeden Richter. Die Autoren deuteten ihn als Erschöpfung: Nach vielen Entscheidungen fällt ein Richter auf den Status quo zurück, und der heißt hier Nein.") },
        { type: "callout", reading: true, text: x(
          "The surprise was never that judges are human. It was the size: from two in three to almost none, within one session.",
          "Habia nuk ishte kurrë që gjyqtarët janë njerëz. Ishte madhësia: nga dy në tre te gati asnjë, brenda një seance.",
          "Überraschend war nie, dass Richter Menschen sind. Überraschend war die Größe: von zwei aus drei auf fast keine, in einer Sitzung.") },
      ],
      note: x(
        "Danziger et al. (2011): 78.2% of the requests were for parole, the rest for changed terms. A deferral counts as a rejection. The curve is the paper's Figure 1 and is not redrawn: the data were never released. Noise between judges is in No. 20.",
        "Danziger et al. (2011): 78,2% e kërkesave ishin për lirim me kusht, të tjerat për ndryshim kushtesh. Shtyrja numërohet si refuzim. Kurba është Figura 1 e artikullit dhe nuk rivizatohet: të dhënat nuk u publikuan kurrë. Zhurma mes gjyqtarëve është te Nr. 20.",
        "Danziger et al. (2011): 78,2 % der Anträge betrafen die Bewährung, der Rest geänderte Auflagen. Eine Vertagung zählt als Ablehnung. Die Kurve ist Abbildung 1 des Artikels und wird nicht nachgezeichnet: Die Daten wurden nie freigegeben. Streuung zwischen Richtern steht in Nr. 20."),
      source: ["fatigue-danziger-2011", "fatigue-gloeckner-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("A yes takes", "Një po merr", "Ein Ja dauert"), x("longer", "më shumë kohë", "länger")],
      lead: x(
        "The paper itself held a detail that matters later. Granting a request took longer and needed more words than refusing it. The breaks were set by the judge, at times that varied from day to day.",
        "Vetë artikulli kishte një hollësi që ka rëndësi më vonë. Pranimi i një kërkese zgjaste më shumë dhe kërkonte më shumë fjalë se refuzimi. Pushimet i caktonte gjyqtari, në orë që ndryshonin nga dita në ditë.",
        "Der Artikel selbst enthielt ein Detail, das später zählt. Einem Antrag stattzugeben dauerte länger und brauchte mehr Worte, als ihn abzulehnen. Die Pausen legte der Richter fest, zu Zeiten, die von Tag zu Tag schwankten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("7.37 : 5.21", "7,37 : 5,21", "7,37 : 5,21"), t: x("minutes per case, granted against refused", "minuta për rast, të pranuarat kundrejt të refuzuarave", "Minuten pro Fall, Stattgabe gegen Ablehnung") },
          { n: x("90 : 47", "90 : 47", "90 : 47"), t: x("words in the written verdict, granted against refused", "fjalë në vendimin e shkruar, të pranuarat kundrejt të refuzuarave", "Wörter in der schriftlichen Entscheidung, Stattgabe gegen Ablehnung") },
        ] },
        { type: "timeline", items: [
          { k: x("Session 1", "Seanca 1", "Sitzung 1"), t: x("start of the day", "fillimi i ditës", "Beginn des Tages") },
          { k: x("Snack", "Zemra", "Imbiss"), t: x("starts 9:49–10:27, after 7.8 cases on average; 38 min", "nis 9:49–10:27, pas 7,8 rasteve mesatarisht; 38 min", "Beginn 9:49–10:27, nach durchschnittlich 7,8 Fällen; 38 Min.") },
          { k: x("Session 2", "Seanca 2", "Sitzung 2"), t: x("11.4 cases on average", "11,4 raste mesatarisht", "durchschnittlich 11,4 Fälle") },
          { k: x("Lunch", "Dreka", "Mittag"), t: x("starts 12:46–14:10; 57 min on average", "nis 12:46–14:10; 57 min mesatarisht", "Beginn 12:46–14:10; im Mittel 57 Min.") },
          { k: x("Session 3", "Seanca 3", "Sitzung 3"), t: x("afternoon", "pasdite", "Nachmittag") },
        ] },
      ],
      note: x(
        "Danziger et al. (2011), means over all rulings (89.61 and 47.36 words). The authors took the shorter refusals as a sign that no is the easier choice; Glöckner (2016) used the same two means for his simulation.",
        "Danziger et al. (2011), mesatare mbi të gjitha vendimet (89,61 dhe 47,36 fjalë). Autorët i morën refuzimet më të shkurtra si shenjë se jo-ja është zgjedhja më e lehtë; Glöckner (2016) përdori të njëjtat dy mesatare për simulimin e tij.",
        "Danziger et al. (2011), Mittelwerte über alle Entscheidungen (89,61 und 47,36 Wörter). Die Autoren sahen die kürzeren Ablehnungen als Zeichen, dass Nein die leichtere Wahl ist; Glöckner (2016) nutzte dieselben Mittelwerte für seine Simulation."),
      source: ["fatigue-danziger-2011"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three explanations", "Tri shpjegime", "Drei Erklärungen"), x("for one curve", "për një kurbë", "für eine Kurve")],
      lead: x(
        "Six months after the study, Keren Weinshall-Margel of the Israeli courts' research division and John Shapard wrote that the order of cases was not random. Within each session, prisoners without a lawyer usually went last; the board also tried to finish one prison's cases before a break.",
        "Gjashtë muaj pas studimit, Keren Weinshall-Margel nga njësia e kërkimit e gjykatave izraelite dhe John Shapard shkruan se rendi i rasteve nuk ishte i rastësishëm. Brenda çdo seance, të burgosurit pa avokat vinin zakonisht të fundit; komisioni përpiqej gjithashtu të mbaronte rastet e një burgu para pushimit.",
        "Ein halbes Jahr nach der Studie schrieben Keren Weinshall-Margel von der Forschungsabteilung der israelischen Gerichte und John Shapard, die Reihenfolge der Fälle sei nicht zufällig. In jeder Sitzung kamen Gefangene ohne Anwalt meist zuletzt; der Ausschuss versuchte zudem, die Fälle eines Gefängnisses vor der Pause abzuschließen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Depletion", "Shterimi", "Erschöpfung"), p: x("Many rulings tire the judge, who falls back on no; a meal restores. Danziger et al.", "Shumë vendime e lodhin gjyqtarin, që kthehet te jo-ja; ushqimi e rikthen. Danziger et al.", "Viele Entscheidungen ermüden, der Richter fällt auf Nein zurück; Essen stellt wieder her. Danziger et al.") },
          { h: x("Order", "Rendi", "Reihenfolge"), p: x("The weaker cases, without counsel, come last in a session. Weinshall-Margel and Shapard", "Rastet më të dobëta, pa avokat, vijnë të fundit në seancë. Weinshall-Margel dhe Shapard", "Die schwächeren Fälle ohne Anwalt kommen zuletzt. Weinshall-Margel und Shapard") },
          { h: x("Time", "Koha", "Zeit"), p: x("Grants take longer, so they are the cases left for after the break. Glöckner", "Pranimet zgjasin më shumë, ndaj janë rastet që lihen për pas pushimit. Glöckner", "Stattgaben dauern länger und bleiben deshalb für nach der Pause. Glöckner") },
        ] },
        { type: "pairs", from: x("Deferral counted as no", "Shtyrja si jo", "Vertagung als Nein"), to: x("Deferrals left out", "Pa shtyrjet", "Ohne Vertagungen"), max: 100, source: ["fatigue-weinshall-2011"],
          label: x("Share of requests granted, by legal counsel, the letter's data", "Pjesa e kërkesave të pranuara, sipas avokatit, të dhënat e letrës", "Anteil stattgegebener Anträge nach Rechtsbeistand, Daten des Briefs"),
          rows: [
            { k: x("With counsel", "Me avokat", "Mit Anwalt"), a: 35, an: x("35%", "35%", "35 %"), b: 67, bn: x("67%", "67%", "67 %") },
            { k: x("Without, about one case in three", "Pa avokat, rreth një rast në tre", "Ohne, etwa jeder dritte Fall"), a: 15, an: x("15%", "15%", "15 %"), b: 39, bn: x("39%", "39%", "39 %"), alert: true },
          ] },
        { type: "p", text: x(
          "The authors replied that the drop and the break stayed robust predictors once representation was added, and that lawyers took clients first come, first served, which rules out ordering by prison.",
          "Autorët u përgjigjën se rënia dhe pushimi mbetën parashikues të qëndrueshëm pasi u shtua përfaqësimi, dhe se avokatët i merrnin klientët sipas radhës së ardhjes, gjë që përjashton renditjen sipas burgut.",
          "Die Autoren antworteten, Abfall und Pause blieben robuste Prädiktoren, wenn die Vertretung hinzukommt, und Anwälte nähmen Mandanten in der Reihenfolge ihres Eintreffens, was eine Ordnung nach Gefängnis ausschließe.") },
      ],
      note: x(
        "Weinshall-Margel & Shapard (2011): the authors' data plus 12 hearing days of their own (227 decisions), same decision rules. The reply (2011) does not say how large the drop remains with counsel controlled, as Glöckner (2016) notes. Cards: the editors' summary.",
        "Weinshall-Margel & Shapard (2011): të dhënat e autorëve plus 12 ditë seancash të tyre (227 vendime), me të njëjtat rregulla. Përgjigjja (2011) nuk thotë sa e madhe mbetet rënia kur kontrollohet avokati, siç vëren Glöckner (2016). Kartat: përmbledhje e redaksisë.",
        "Weinshall-Margel & Shapard (2011): die Daten der Autoren plus 12 eigene Sitzungstage (227 Entscheidungen), gleiche Regeln. Die Antwort (2011) sagt nicht, wie groß der Abfall mit Anwalt als Kontrolle bleibt, wie Glöckner (2016) anmerkt. Karten: Zusammenfassung der Redaktion."),
      source: ["fatigue-weinshall-2011", "fatigue-danziger-reply-2011", "fatigue-gloeckner-2016"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("A rational judge", "Një gjyqtar racional", "Ein rationaler Richter"), x("draws the same curve", "vizaton të njëjtën kurbë", "zeichnet dieselbe Kurve")],
      lead: x(
        "In 2016 Andreas Glöckner simulated a judge without any bias: 10,000 cases in random order, 36% deserving a yes, grants taking 7.37 minutes and refusals 5.21 on average, as in the study. The judge only avoids starting a case that would run past the session's time limit.",
        "Më 2016 Andreas Glöckner simuloi një gjyqtar pa asnjë paragjykim: 10.000 raste në rend të rastësishëm, 36% që meritonin po, pranimet që zgjasin 7,37 minuta dhe refuzimet 5,21 mesatarisht, si te studimi. Gjyqtari vetëm shmang nisjen e një rasti që do të kalonte kufirin e kohës së seancës.",
        "2016 simulierte Andreas Glöckner einen Richter ohne jede Verzerrung: 10.000 Fälle in zufälliger Reihenfolge, 36 % verdienen ein Ja, Stattgaben dauern im Mittel 7,37 Minuten, Ablehnungen 5,21, wie in der Studie. Der Richter vermeidet nur, einen Fall zu beginnen, der über das Zeitlimit der Sitzung liefe."),
      blocks: [
        { type: "hbars", max: 50, source: ["fatigue-gloeckner-2016"],
          label: x("Share of cases that still fit with 5 minutes left, simulation", "Pjesa e rasteve që hyjnë ende kur mbeten 5 minuta, simulim", "Anteil der Fälle, die bei 5 Minuten Rest noch passen, Simulation"),
          items: [
            { k: x("Cases that end in a refusal", "Raste që mbarojnë me refuzim", "Fälle, die mit Ablehnung enden"), v: 46, n: x("46%", "46%", "46 %") },
            { k: x("Cases that end in a grant", "Raste që mbarojnë me pranim", "Fälle, die mit Stattgabe enden"), v: 12, n: x("12%", "12%", "12 %"), alert: true },
          ] },
        { type: "p", text: x(
          "So the last cases of a session are mostly quick refusals, and the long grants open the next one. The rational judge's curve fell from 36% towards zero. Cutting the last 5% of each session, as the study did, made the drop larger; with a slight link between rulings it gave a drop of about 15% even with no foresight.",
          "Kështu rastet e fundit të një seance janë kryesisht refuzime të shpejta, dhe pranimet e gjata hapin seancën tjetër. Kurba e gjyqtarit racional ra nga 36% drejt zeros. Heqja e 5% të fundit të çdo seance, si te studimi, e zmadhoi rënien; me një lidhje të lehtë mes vendimeve dha një rënie rreth 15% edhe pa parashikim.",
          "Die letzten Fälle einer Sitzung sind also meist schnelle Ablehnungen, und die langen Stattgaben eröffnen die nächste. Die Kurve des rationalen Richters fiel von 36 % gegen null. Die letzten 5 % jeder Sitzung wegzulassen, wie die Studie es tat, vergrößerte den Abfall; mit leichter Abhängigkeit zwischen Entscheidungen ergab sich selbst ohne Vorausschau ein Abfall von rund 15 %.") },
        { type: "callout", reading: true, text: x(
          "Glöckner does not say the judges were fine. He says the curve does not prove they were not.",
          "Glöckner nuk thotë se gjyqtarët ishin në rregull. Thotë se kurba nuk provon që nuk ishin.",
          "Glöckner sagt nicht, die Richter seien in Ordnung gewesen. Er sagt, die Kurve beweise nicht das Gegenteil.") },
      ],
      note: x(
        "Glöckner (2016), normal decision times, 60-minute limit. His caveats: the simulated start, about 45%, stays below the observed 65%, and time management explains a drop of only 15% to 45%. He calls the effect overestimated and does not rule it out.",
        "Glöckner (2016), kohë vendimi të shpërndara normalisht, kufi 60 minuta. Kujdeset e tij: fillimi i simuluar, rreth 45%, mbetet nën 65% e vëzhguar, dhe menaxhimi i kohës shpjegon vetëm një rënie prej 15% deri 45%. Ai e quan efektin të mbivlerësuar dhe nuk e përjashton.",
        "Glöckner (2016), normalverteilte Entscheidungszeiten, 60-Minuten-Limit. Seine Einschränkungen: Der simulierte Beginn, rund 45 %, bleibt unter den beobachteten 65 %, und Zeitplanung erklärt nur einen Abfall von 15 % bis 45 %. Er nennt den Effekt überschätzt und schließt ihn nicht aus."),
      source: ["fatigue-gloeckner-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Before you blame", "Para se të fajësosh", "Bevor man die Müdigkeit"), x("fatigue, count", "lodhjen, numëro", "beschuldigt, zählen")],
      lead: x(
        "Glöckner also points to the lab: a registered replication in 23 labs with 2,142 people found a depletion effect of d = 0.04, not different from zero. A manager who wants to know whether late decisions differ has to count them, and the critics show how not to.",
        "Glöckner tregon edhe laboratorin: një replikim i regjistruar në 23 laboratorë me 2.142 vetë gjeti një efekt shterimi d = 0,04, jo të ndryshëm nga zero. Menaxheri që do të dijë nëse vendimet e vona ndryshojnë duhet t'i numërojë, dhe kritikët tregojnë si të mos e bëjë.",
        "Glöckner verweist auch auf das Labor: Eine registrierte Replikation in 23 Laboren mit 2.142 Personen fand einen Erschöpfungseffekt von d = 0,04, nicht von null verschieden. Wer wissen will, ob späte Entscheidungen anders ausfallen, muss sie zählen, und die Kritiker zeigen, wie nicht."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Time and place in the queue", "Ora dhe vendi në radhë", "Uhrzeit und Platz in der Reihe"), p: x("when it was decided, and how many decisions came before it that day", "kur u vendos, dhe sa vendime e paraprinë atë ditë", "wann entschieden, und wie viele Entscheidungen an dem Tag davor lagen") },
          { h: x("Who set the order", "Kush e caktoi rendin", "Wer die Reihenfolge bestimmte"), p: x("arrival, urgency, a person; the order is a cause until shown otherwise", "ardhja, urgjenca, një person; rendi është shkak derisa të provohet e kundërta", "Eingang, Dringlichkeit, eine Person; die Reihenfolge ist Ursache, bis anderes gezeigt ist") },
          { h: x("Yes, no, and later", "Po, jo, dhe më vonë", "Ja, Nein und Später"), p: x("keep deferrals apart; counted as no, 67% for prisoners with counsel became 35%", "mbaji shtyrjet veç; të numëruara si jo, 67% e të burgosurve me avokat u bë 35%", "Vertagungen getrennt halten; als Nein gezählt, wurden bei Gefangenen mit Anwalt aus 67 % 35 %") },
          { h: x("How long it took", "Sa zgjati", "Wie lange es dauerte"), p: x("long cases get pushed to the next slot; that alone bends the curve", "rastet e gjata shtyhen te radha tjetër; vetëm kjo e përkul kurbën", "lange Fälle rutschen in den nächsten Block; das allein biegt die Kurve") },
          { h: x("All of them", "Të gjitha", "Alle"), p: x("do not drop the last ones of a session; the simulation shows what that does", "mos i hiq të fundit e seancës; simulimi tregon çfarë bën kjo", "die letzten einer Sitzung nicht weglassen; die Simulation zeigt, was das bewirkt") },
        ] },
      ],
      note: x(
        "The fields are the editors' proposal, built on the three papers' points of dispute. The replication (Hagger & Chatzisarantis, 2016) was not read; its result as Glöckner (2016) gives it. Hours awake and real fatigue are in No. 89.",
        "Fushat janë propozim i redaksisë, të ndërtuara mbi pikat e mosmarrëveshjes së tri artikujve. Replikimi (Hagger & Chatzisarantis, 2016) nuk u lexua; rezultati siç e jep Glöckner (2016). Orët pa gjumë dhe lodhja e vërtetë janë te Nr. 89.",
        "Die Felder sind ein Vorschlag der Redaktion, gestützt auf die Streitpunkte der drei Arbeiten. Die Replikation (Hagger & Chatzisarantis, 2016) wurde nicht gelesen; ihr Ergebnis nach Glöckner (2016). Wachstunden und echte Müdigkeit stehen in Nr. 89."),
      source: ["fatigue-gloeckner-2016", "fatigue-weinshall-2011"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "solve-it-or-escalate-it",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The last-hour", "Karta e vendimeve", "Die Karte für"), x("decision card", "të orës së fundit", "die letzte Stunde")],
      lead: x(
        "What survives the critics is modest: a no is often the faster answer, and late in a session the quick answers pile up. For a decision that comes in the last hour and can wait, write down what happens if nobody decides, then hand it over instead of saying no by default.",
        "Ajo që u mbijeton kritikëve është e thjeshtë: jo-ja është shpesh përgjigjja më e shpejtë, dhe vonë në seancë përgjigjet e shpejta grumbullohen. Për një vendim që vjen në orën e fundit dhe mund të presë, shkruaj çfarë ndodh nëse askush nuk vendos, pastaj dorëzoje në vend që të thuash jo sipas zakonit.",
        "Was die Kritik übersteht, ist bescheiden: Ein Nein ist oft die schnellere Antwort, und spät in einer Sitzung häufen sich die schnellen Antworten. Für eine Entscheidung in der letzten Stunde, die warten kann: aufschreiben, was geschieht, wenn niemand entscheidet, und sie übergeben, statt aus Gewohnheit Nein zu sagen."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision, the time", "Vendimi, ora", "Die Entscheidung, die Uhrzeit"), hint: x("what is asked, by whom; how many decisions came before it today", "çfarë kërkohet, nga kush; sa vendime e paraprinë sot", "was gefragt ist, von wem; wie viele Entscheidungen heute davor lagen") },
          { h: x("If nobody decides", "Nëse askush nuk vendos", "Wenn niemand entscheidet"), hint: x("the default outcome; is it really neutral?", "rezultati i paracaktuar; a është vërtet neutral?", "das Ergebnis ohne Entscheidung; ist es wirklich neutral?") },
          { h: x("Can it wait, can it be undone", "A pret dot, a kthehet dot", "Kann es warten, ist es umkehrbar"), hint: x("what waiting costs, and until when", "çfarë kushton pritja, dhe deri kur", "was Warten kostet, und bis wann") },
          { h: x("What a yes would need", "Çfarë do të duhej për një po", "Was ein Ja bräuchte"), hint: x("the facts or the time missing now", "faktet ose koha që mungojnë tani", "die Fakten oder die Zeit, die jetzt fehlen") },
          { h: x("Handed over to", "Dorëzuar te", "Übergeben an"), hint: x("name, by when; the person asking is told", "emri, deri kur; personit që kërkoi i thuhet", "Name, bis wann; der Fragende wird informiert") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, not a tested method. It rests on the study's reading of no as the status quo and on the critics' point that long cases slip to the next slot. Defaults are in No. 93. The essay linked below gives the author's questions on reversibility and waiting.",
        "Karta është propozim i redaksisë, jo metodë e provuar. Mbështetet te leximi i studimit për jo-në si status quo dhe te pika e kritikëve se rastet e gjata rrëshqasin te radha tjetër. Opsioni i paracaktuar është te Nr. 93. Eseja e lidhur më poshtë jep pyetjet e autorit për kthyeshmërinë dhe pritjen.",
        "Die Karte ist ein Vorschlag der Redaktion, keine erprobte Methode. Sie stützt sich auf die Deutung des Neins als Status quo und auf den Einwand, dass lange Fälle in den nächsten Block rutschen. Voreinstellungen stehen in Nr. 93. Der unten verlinkte Essay gibt die Fragen des Autors zu Umkehrbarkeit und Warten."),
      source: ["fatigue-danziger-2011", "fatigue-gloeckner-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
