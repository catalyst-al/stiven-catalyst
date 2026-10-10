// Management Review, No. 35: Standard work and kaizen. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-35.md.
import { x, pc } from "../common.js";

export default {
  number: 35,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Standard work", "Puna standarde", "Standardarbeit"), x("and kaizen", "dhe kaizen", "und Kaizen")],
  sub: x(
    "A wartime pocket card, what the plants reported, Imai's two parts of management, the three elements of standard work, ten years after the training, Toyota's 55 seconds, and a card for one kaizen.",
    "Një kartë xhepi nga koha e luftës, çfarë raportuan fabrikat, dy pjesët e menaxhimit sipas Imai-t, tri elementet e punës standarde, dhjetë vjet pas trajnimit, 55 sekondat e Toyota-s, dhe një kartë për një kaizen.",
    "Eine Taschenkarte aus Kriegszeiten, was die Betriebe meldeten, Imais zwei Teile der Führung, die drei Elemente der Standardarbeit, zehn Jahre nach dem Training, Toyotas 55 Sekunden und eine Karte für ein Kaizen."),
  seo: x(
    "Standard work and kaizen: TWI's pocket cards, Imai's maintain and improve, takt time, work sequence, standard inventory, Toyota's 55 seconds and a card.",
    "Puna standarde dhe kaizen: kartat e TWI, ruaj dhe përmirëso sipas Imai-t, takt time, radha e punës, stoku standard, 55 sekondat e Toyota-s dhe një kartë.",
    "Standardarbeit und Kaizen: die TWI-Taschenkarten, Imais Erhalten und Verbessern, Taktzeit, Arbeitsfolge, Standardbestand, Toyotas 55 Sekunden, eine Karte."),
  feature: x(
    "Issue 35 starts with a pocket card from the Second World War that told supervisors to use a new method until a better way is found, reads what plants reported to the Training Within Industry service, sets out Masaaki Imai's two parts of management and the three elements of standard work, weighs a study of 11,575 firms over ten years, shows how Toyota makes a gap visible within seconds, and ends with a card for one kaizen.",
    "Numri 35 nis me një kartë xhepi nga Lufta e Dytë Botërore që u thoshte mbikëqyrësve ta përdornin një metodë të re derisa të gjendej një mënyrë më e mirë, lexon çfarë i raportuan fabrikat shërbimit Training Within Industry, shtjellon dy pjesët e menaxhimit sipas Masaaki Imai-t dhe tri elementet e punës standarde, peshon një studim me 11.575 firma gjatë dhjetë vjetëve, tregon si e bën Toyota të dukshme një shmangie brenda sekondave, dhe mbyllet me një kartë për një kaizen.",
    "Ausgabe 35 beginnt mit einer Taschenkarte aus dem Zweiten Weltkrieg, die Vorarbeitern sagte, eine neue Methode zu nutzen, bis es einen besseren Weg gibt, liest, was Betriebe dem Dienst Training Within Industry meldeten, stellt Masaaki Imais zwei Teile der Führung und die drei Elemente der Standardarbeit vor, wägt eine Studie mit 11.575 Firmen über zehn Jahre ab, zeigt, wie Toyota eine Abweichung in Sekunden sichtbar macht, und endet mit einer Karte für ein Kaizen."),
  figure: { n: "55", by: "Spear & Bowen, 1999", t: x(
    "seconds for the seven tasks of fitting a car seat at Toyota: a written standard that shows a gap as it happens.",
    "sekonda për shtatë detyrat e montimit të një ndenjëseje te Toyota: një standard i shkruar që e tregon shmangien në çast.",
    "Sekunden für die sieben Aufgaben beim Einbau eines Autositzes bei Toyota: ein schriftlicher Standard, der eine Abweichung sofort zeigt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Until a better way is found", "Derisa të gjendet një mënyrë më e mirë", "Bis es einen besseren Weg gibt") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Maintain and improve", "Ruaj dhe përmirëso", "Erhalten und verbessern") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The kaizen card", "Karta e kaizen-it", "Die Kaizen-Karte") },
  ],
  sources: ["twi-report-1945", "lei-twi", "imai-1986", "lei-standardized-work", "lei-kaizen", "bianchi-giorcelli-2022", "spear-bowen-1999"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A standard that nobody changes goes stale, and an improvement that nobody writes down is lost by the next shift. This issue is about the link between the two: the written best way to do a job today, and the habit of finding a better one.",
        "Një standard që nuk e ndryshon askush plaket, dhe një përmirësim që nuk e shkruan askush humbet te turni tjetër. Ky numër flet për lidhjen mes të dyve: mënyrës më të mirë të shkruar për ta bërë një punë sot, dhe zakonit për të gjetur një më të mirë.",
        "Ein Standard, den niemand ändert, veraltet, und eine Verbesserung, die niemand aufschreibt, ist mit der nächsten Schicht verloren. Diese Ausgabe handelt von der Verbindung zwischen beiden: der aufgeschriebenen besten Art, eine Arbeit heute zu machen, und der Gewohnheit, eine bessere zu finden."),
      body: x(
        "In the Second World War, the US Training Within Industry service taught supervisors to teach a job the same way and to improve it, with four steps on a pocket card; Toyota later adopted the programmes. In 1986 Masaaki Imai brought the word kaizen to Western managers: improvement involving everyone, built on standards that are kept. A study of 11,575 firms found the wartime training still showing in sales and productivity ten years later, and at Toyota a seat is fitted in a written sequence timed in seconds.",
        "Gjatë Luftës së Dytë Botërore, shërbimi amerikan Training Within Industry i mësoi mbikëqyrësit ta mësonin një punë në të njëjtën mënyrë dhe ta përmirësonin, me katër hapa në një kartë xhepi; më vonë Toyota i përvetësoi këto programe. Në 1986, Masaaki Imai e solli fjalën kaizen te menaxherët perëndimorë: përmirësim që përfshin të gjithë, i ndërtuar mbi standarde që ruhen. Një studim me 11.575 firma gjeti se trajnimi i kohës së luftës dukej ende te shitjet dhe te produktiviteti dhjetë vjet më vonë, dhe te Toyota një ndenjëse montohet sipas një radhe të shkruar, të matur në sekonda.",
        "Im Zweiten Weltkrieg brachte der US-Dienst Training Within Industry Vorarbeitern bei, eine Arbeit einheitlich anzulernen und sie zu verbessern, mit vier Schritten auf einer Taschenkarte; Toyota übernahm die Programme später. 1986 brachte Masaaki Imai das Wort Kaizen zu westlichen Führungskräften: Verbesserung unter Beteiligung aller, gebaut auf Standards, die eingehalten werden. Eine Studie mit 11.575 Firmen fand, dass sich das Training aus Kriegszeiten zehn Jahre später noch in Umsatz und Produktivität zeigte, und bei Toyota wird ein Sitz nach einer schriftlichen, in Sekunden getakteten Folge eingebaut."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Until a better", "Derisa të gjendet", "Bis es einen"), x("way is found", "një mënyrë më e mirë", "besseren Weg gibt")],
      lead: x(
        "From 1940 to 1945, the US government's Training Within Industry service (TWI) trained supervisors in war plants. Each of its methods was so simple that it was printed on a pocket card.",
        "Nga 1940 deri në 1945, shërbimi Training Within Industry (TWI) i qeverisë amerikane trajnoi mbikëqyrësit në fabrikat e luftës. Secila nga metodat e tij ishte aq e thjeshtë sa shtypej në një kartë xhepi.",
        "Von 1940 bis 1945 schulte der Dienst Training Within Industry (TWI) der US-Regierung Vorarbeiter in Rüstungsbetrieben. Jede seiner Methoden war so einfach, dass sie auf eine Taschenkarte gedruckt wurde."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Job Instruction", "Job Instruction", "Job Instruction"), p: x("how to teach a job: important steps and key points, then show, try out, follow up", "si mësohet një punë: hapat e rëndësishëm dhe pikat kyçe, pastaj trego, provo, ndiq", "wie man eine Arbeit anlernt: wichtige Schritte und Kernpunkte, dann zeigen, ausprobieren, nachfassen") },
          { h: x("Job Methods", "Job Methods", "Job Methods"), p: x("how to improve a job: break it down, question every detail, develop and apply the new method", "si përmirësohet një punë: zbërthe, pyet për çdo hollësi, ndërto dhe zbato metodën e re", "wie man eine Arbeit verbessert: zerlegen, jedes Detail hinterfragen, neue Methode entwickeln und anwenden") },
          { h: x("Job Relations", "Job Relations", "Job Relations"), p: x("how to handle a problem with people: get the facts, weigh and decide, act, check the results", "si trajtohet një problem me njerëzit: mblidh faktet, peshoji dhe vendos, vepro, kontrollo rezultatin", "wie man ein Problem mit Menschen löst: Fakten sammeln, abwägen und entscheiden, handeln, Ergebnis prüfen") },
        ] },
        { type: "p", text: x(
          "The Job Methods card ends with one line: put the new method to work and use it until a better way is developed. By September 1945 TWI counted 1,750,650 certificates in 16,511 plants and unions. Toyota later adopted the programmes; Job Instruction is still the main training tool of its team leaders, says the Lean Enterprise Institute.",
          "Karta e Job Methods mbyllet me një rresht: vëre në punë metodën e re dhe përdore derisa të gjendet një mënyrë më e mirë. Deri në shtator 1945, TWI numëroi 1.750.650 certifikata në 16.511 fabrika dhe sindikata. Më vonë Toyota i përvetësoi programet; sipas Lean Enterprise Institute, Job Instruction është ende mjeti kryesor i trajnimit për drejtuesit e ekipeve të saj.",
          "Die Job-Methods-Karte endet mit einer Zeile: die neue Methode einführen und nutzen, bis ein besserer Weg gefunden ist. Bis September 1945 zählte TWI 1.750.650 Zertifikate in 16.511 Betrieben und Gewerkschaften. Toyota übernahm die Programme später; laut Lean Enterprise Institute ist Job Instruction bis heute das wichtigste Schulungswerkzeug seiner Teamleiter.") },
        { type: "callout", reading: true, text: x(
          "Standard work and kaizen fit on one card: the new method becomes the standard, and the standard waits for the next better way.",
          "Puna standarde dhe kaizen-i hyjnë në një kartë: metoda e re bëhet standard, dhe standardi pret mënyrën tjetër më të mirë.",
          "Standardarbeit und Kaizen passen auf eine Karte: Die neue Methode wird zum Standard, und der Standard wartet auf den nächsten besseren Weg.") },
      ],
      note: x(
        "The counts are TWI's own. That Toyota adopted TWI comes from the Lean Enterprise Institute; the sources we checked do not give the year.",
        "Numrat janë të vetë TWI. Se Toyota e përvetësoi TWI vjen nga Lean Enterprise Institute; vitin, burimet që pamë nuk e japin.",
        "Die Zahlen stammen von TWI selbst. Dass Toyota TWI übernahm, stammt vom Lean Enterprise Institute; das Jahr nennen die geprüften Quellen nicht."),
      source: ["twi-report-1945", "lei-twi"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What the plants", "Çfarë raportuan", "Was die Betriebe"), x("reported", "fabrikat", "meldeten")],
      lead: x(
        "Asked by the US House of Representatives in 1943 for its results, TWI tabulated the voluntary reports of plants seven times. The last, September 1945:",
        "Kur Dhoma e Përfaqësuesve e SHBA-së i kërkoi rezultatet në 1943, TWI i përmblodhi shtatë herë raportet vullnetare të fabrikave. E fundit, shtator 1945:",
        "Als das US-Repräsentantenhaus 1943 Ergebnisse verlangte, wertete TWI die freiwilligen Berichte der Betriebe siebenmal aus. Die letzte, September 1945:"),
      blocks: [
        { type: "hbars", source: ["twi-report-1945"],
          label: x("Plants reporting a result of 25% or more, by kind of result, September 1945", "Fabrikat që raportuan një rezultat prej 25% ose më shumë, sipas llojit, shtator 1945", "Betriebe mit einem gemeldeten Ergebnis von 25 % oder mehr, nach Art, September 1945"),
          items: [
            { k: x("Training time reduced", "U ul koha e trajnimit", "Anlernzeit gesenkt"), v: 100, n: pc(100) },
            { k: x("Grievances reduced", "U ulën ankesat formale", "Beschwerden gesenkt"), v: 100, n: pc(100) },
            { k: x("Manpower saved", "U kursye fuqi punëtore", "Arbeitskraft eingespart"), v: 88, n: pc(88) },
            { k: x("Production increased", "U rrit prodhimi", "Produktion gesteigert"), v: 86, n: pc(86) },
            { k: x("Scrap loss reduced", "U ul humbja nga materiali i hedhur", "Ausschuss gesenkt"), v: 55, n: pc(55), alert: true },
          ] },
        { type: "p", text: x(
          "In May 1943 most results were still under 25%. In one aircraft plant, a department where every supervisor held the Job Instruction certificate had a scrap cost of 15 cents per head; the plant average was 61.",
          "Në maj 1943, shumica e rezultateve ishin ende nën 25%. Në një fabrikë avionësh, një repart ku çdo mbikëqyrës kishte certifikatën e Job Instruction kishte kosto materiali të hedhur 15 cent për person; mesatarja e fabrikës ishte 61.",
          "Im Mai 1943 lagen die meisten Ergebnisse noch unter 25 %. In einem Flugzeugwerk hatte eine Abteilung, in der jeder Vorarbeiter das Job-Instruction-Zertifikat besaß, Ausschusskosten von 15 Cent pro Kopf; der Werksdurchschnitt lag bei 61.") },
        { type: "callout", reading: true, text: x(
          "Plants chose whether to report, and TWI used the reports to back its budget requests. They show what managers saw; the comparison is on page 6.",
          "Fabrikat zgjodhën vetë nëse do të raportonin, dhe TWI i përdori raportet për të mbështetur kërkesat për buxhet. Tregojnë çfarë panë drejtuesit; krahasimi është te faqja 6.",
          "Die Betriebe entschieden selbst, ob sie berichten, und TWI stützte mit den Berichten seine Budgetanträge. Sie zeigen, was Führungskräfte sahen; der Vergleich steht auf Seite 6.") },
      ],
      note: x(
        "Each share is of the plants that reported that kind of result; the report does not say how many plants each tabulation counted. The first one used more than 600 plant statements.",
        "Çdo përqindje është nga fabrikat që raportuan atë lloj rezultati; raporti nuk thotë sa fabrika numëroi çdo përmbledhje. E para përdori mbi 600 deklarata fabrikash.",
        "Jeder Anteil bezieht sich auf die Betriebe, die diese Art von Ergebnis meldeten; wie viele Betriebe jede Auswertung zählte, sagt der Bericht nicht. Die erste stützte sich auf über 600 Betriebsberichte."),
      source: ["twi-report-1945"],
    },
    {
      id: "model", more: "a-good-sop-is-not-a-document",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Maintain", "Ruaj", "Erhalten"), x("and improve", "dhe përmirëso", "und verbessern")],
      lead: x(
        "In Kaizen (1986), Masaaki Imai defines kaizen as ongoing improvement involving everyone, managers and workers alike. In his account management has two parts: maintaining the current standards, through training and discipline, and improving them.",
        "Te Kaizen (1986), Masaaki Imai e përkufizon kaizen-in si përmirësim të vazhdueshëm që përfshin të gjithë, menaxherë dhe punëtorë njësoj. Sipas tij, menaxhimi ka dy pjesë: ruajtjen e standardeve të sotme, me trajnim dhe disiplinë, dhe përmirësimin e tyre.",
        "In Kaizen (1986) definiert Masaaki Imai Kaizen als fortlaufende Verbesserung, an der alle beteiligt sind, Führungskräfte wie Beschäftigte. Führung hat bei ihm zwei Teile: die heutigen Standards durch Schulung und Disziplin erhalten und sie verbessern."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Takt time", "Takt time", "Taktzeit"), p: x("the pace at which products must be made to meet customer demand", "ritmi me të cilin duhen bërë produktet për të plotësuar kërkesën e klientit", "das Tempo, in dem Produkte für den Kundenbedarf entstehen müssen") },
          { h: x("Work sequence", "Radha e punës", "Arbeitsfolge"), p: x("the order in which one operator does the tasks within the takt time", "radha me të cilën një operator i bën detyrat brenda takt time", "die Reihenfolge, in der eine Person ihre Aufgaben in der Taktzeit erledigt") },
          { h: x("Standard inventory", "Stoku standard", "Standardbestand"), p: x("the stock inside the process, including units in machines, that keeps it running smoothly", "stoku brenda procesit, përfshirë njësitë në makina, që e mban të rrjedhshëm", "der Bestand im Prozess, auch in den Maschinen, der ihn reibungslos laufen lässt") },
        ] },
        { type: "p", text: x(
          "These are the three elements of standardized work for the Lean Enterprise Institute. Posted at the workstation, it is the baseline for the next kaizen. Its lexicon quotes Taiichi Ohno: there can be no kaizen without a standard.",
          "Këto janë tri elementet e punës standarde sipas Lean Enterprise Institute. E vendosur te vendi i punës, ajo është pika e nisjes për kaizen-in tjetër. Fjalori i tij citon Taiichi Ohno-n: pa standard nuk ka kaizen.",
          "Das sind die drei Elemente der Standardarbeit beim Lean Enterprise Institute. Am Arbeitsplatz ausgehängt, ist sie die Basis für das nächste Kaizen. Sein Lexikon zitiert Taiichi Ohno: Ohne Standard kein Kaizen.") },
        { type: "chain", label: x("The cycle, as the editors draw it", "Cikli, siç e vizaton redaksia", "Der Kreislauf, wie ihn die Redaktion zeichnet"), items: [
          { h: x("Standard", "Standardi", "Standard") },
          { h: x("Train", "Trajno", "Anlernen") },
          { h: x("See the gap", "Shih shmangien", "Abweichung sehen") },
          { h: x("Improve", "Përmirëso", "Verbessern") },
          { h: x("New standard", "Standard i ri", "Neuer Standard") },
        ] },
        { type: "callout", reading: true, text: x(
          "A standard nobody follows is only a document. An improvement that never becomes the standard lasts as long as the person who made it.",
          "Një standard që nuk e ndjek askush është vetëm një dokument. Një përmirësim që nuk bëhet kurrë standard zgjat sa zgjat personi që e bëri.",
          "Ein Standard, dem niemand folgt, ist nur ein Dokument. Eine Verbesserung, die nie zum Standard wird, hält so lange wie die Person, die sie gemacht hat.") },
      ],
      note: x(
        "Imai's definition and his two parts are confirmed in summaries of the book, not in the book itself.",
        "Përkufizimi i Imai-t dhe dy pjesët e tij konfirmohen te përmbledhjet e librit, jo te vetë libri.",
        "Imais Definition und seine zwei Teile sind in Zusammenfassungen des Buchs belegt, nicht im Buch selbst."),
      source: ["imai-1986", "lei-standardized-work", "lei-kaizen"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Ten years", "Dhjetë vjet", "Zehn Jahre"), x("after the training", "pas trajnimit", "nach dem Training")],
      lead: x(
        "Nicola Bianchi and Michela Giorcelli collected data on all 11,575 US firms that applied to TWI. Money and trainers ran short: 48% received no training, and only 7% received all three modules.",
        "Nicola Bianchi dhe Michela Giorcelli mblodhën të dhëna për të 11.575 firmat amerikane që aplikuan për TWI. Parat dhe trajnerët nuk mjaftuan: 48% nuk morën asnjë trajnim, dhe vetëm 7% morën të tri modulet.",
        "Nicola Bianchi und Michela Giorcelli sammelten Daten zu allen 11.575 US-Firmen, die sich für TWI bewarben. Geld und Trainer reichten nicht: 48 % erhielten kein Training, nur 7 % alle drei Module."),
      blocks: [
        { type: "dumbbell", from: x("Year 1", "Viti 1", "Jahr 1"), to: x("Year 10", "Viti 10", "Jahr 10"), min: 0, max: 30, rowH: 26, source: ["bianchi-giorcelli-2022"],
          label: x("Trained against untrained applicants, one and ten years after the training", "Firmat e trajnuara përballë atyre të patrajnuara, një dhe dhjetë vjet pas trajnimit", "Geschulte gegenüber ungeschulten Bewerbern, ein und zehn Jahre nach dem Training"),
          rows: [
            { k: x("Productivity", "Produktiviteti", "Produktivität"), a: 6, an: pc(6), b: 27, bn: pc(27), alert: true },
            { k: x("Sales", "Shitjet", "Umsatz"), a: 5.3, an: x("5.3%", "5,3%", "5,3 %"), b: 16, bn: pc(16) },
          ] },
        { type: "p", text: x(
          "Before the training, both groups followed the same trends. Sales of trained firms peaked in the eighth year, 21.7% above the others. Firms trained in Job Instruction began to set standard procedures for operations, and the gains held even as many top managers left after the war.",
          "Para trajnimit, të dy grupet ndiqnin të njëjtat prirje. Shitjet e firmave të trajnuara arritën kulmin në vitin e tetë, 21,7% mbi të tjerat. Firmat e trajnuara në Job Instruction nisën të vendosnin procedura standarde për operacionet, dhe fitimet u mbajtën edhe kur shumë drejtues të lartë u larguan pas luftës.",
          "Vor dem Training folgten beide Gruppen denselben Trends. Der Umsatz der geschulten Firmen lag im achten Jahr am höchsten, 21,7 % über den anderen. Firmen mit Job Instruction führten Standardverfahren für den Betrieb ein, und die Zuwächse hielten auch, als nach dem Krieg viele Topmanager gingen.") },
        { type: "callout", reading: true, text: x(
          "The training lasted because it changed how the work was organised, not only what one manager knew.",
          "Trajnimi zgjati sepse ndryshoi mënyrën si organizohej puna, jo vetëm atë që dinte një drejtues.",
          "Das Training wirkte fort, weil es die Organisation der Arbeit änderte, nicht nur das Wissen einer Führungskraft.") },
      ],
      note: x(
        "A natural experiment, not a randomised trial. The figures are from the 2021 working paper; the article appeared in the Journal of Political Economy in 2022.",
        "Eksperiment natyror, jo eksperiment me ndarje të rastësishme. Shifrat janë nga versioni paraprak i punimit, 2021; artikulli doli te Journal of Political Economy në 2022.",
        "Ein natürliches Experiment, keine randomisierte Studie. Die Zahlen stammen aus dem Arbeitspapier von 2021; der Artikel erschien 2022 im Journal of Political Economy."),
      source: ["bianchi-giorcelli-2022"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("A gap you see", "Një shmangie", "Eine Abweichung,"), x("in seconds", "që shihet në sekonda", "in Sekunden sichtbar")],
      lead: x(
        "Steven Spear and Kent Bowen studied more than 40 plants over four years. Their first rule of the Toyota Production System: all work is highly specified as to content, sequence, timing and outcome.",
        "Steven Spear dhe Kent Bowen studiuan më shumë se 40 fabrika gjatë katër vjetëve. Rregulli i parë i Sistemit të Prodhimit të Toyota-s sipas tyre: çdo punë përcaktohet me hollësi për përmbajtjen, radhën, kohën dhe rezultatin.",
        "Steven Spear und Kent Bowen untersuchten vier Jahre lang mehr als 40 Werke. Ihre erste Regel des Toyota-Produktionssystems: Jede Arbeit ist genau festgelegt nach Inhalt, Reihenfolge, Zeit und Ergebnis."),
      blocks: [
        { type: "p", text: x(
          "At Toyota's plant in Georgetown, Kentucky, fitting the right-front seat of a Camry was designed as seven tasks in 55 seconds. A worker still on task 4 after 40 seconds, when it should end at 31, is behind; the floor of the zone is marked in tenths, so he and his team leader see it at once.",
          "Në fabrikën e Toyota-s në Georgetown, Kentucky, montimi i ndenjëses së përparme djathtas të një Camry-je ishte projektuar si shtatë detyra në 55 sekonda. Një punëtor që është ende te detyra 4 pas 40 sekondash, kur ajo duhej të mbaronte në 31, ka mbetur prapa; dyshemeja e zonës është ndarë me shenja në dhjetë pjesë, ndaj ai dhe drejtuesi i ekipit e shohin menjëherë.",
          "Im Toyota-Werk in Georgetown, Kentucky, war der Einbau des rechten Vordersitzes eines Camry als sieben Aufgaben in 55 Sekunden ausgelegt. Wer nach 40 Sekunden noch bei Aufgabe 4 ist, die nach 31 enden sollte, liegt zurück; der Boden der Zone ist in Zehntel eingeteilt, also sehen er und sein Teamleiter es sofort.") },
        { type: "rows", compact: true, items: [
          { h: x("Not done as specified", "Nuk bëhet siç është përcaktuar", "Nicht wie festgelegt ausgeführt"), p: x("Find the true skill of the person or capability of the machine; train or modify.", "Gjej aftësinë e vërtetë të personit ose mundësinë e makinës; trajno ose ndrysho.", "Die tatsächliche Fähigkeit der Person oder der Maschine ermitteln; anlernen oder anpassen.") },
          { h: x("Done as specified, still defective", "Bëhet siç duhet, por del me defekt", "Wie festgelegt, trotzdem fehlerhaft"), p: x("Change the design of the work: the standard itself was wrong.", "Ndrysho projektimin e punës: gabim ishte vetë standardi.", "Den Aufbau der Arbeit ändern: Der Standard selbst war falsch.") },
        ] },
        { type: "example", label: x("Hypothetical example, a packing station", "Shembull hipotetik, një vend paketimi", "Hypothetisches Beispiel, ein Packplatz"), rows: [
          { k: x("Standard", "Standardi", "Standard"), v: x("six steps in 90 seconds; the label is checked at step 5", "gjashtë hapa në 90 sekonda; etiketa kontrollohet te hapi 5", "sechs Schritte in 90 Sekunden; das Etikett wird bei Schritt 5 geprüft") },
          { k: x("Observed", "U pa", "Beobachtet"), v: x("step 5 skipped on 4 of 20 orders at the evening peak", "hapi 5 u kapërcye në 4 nga 20 porosi në pikun e mbrëmjes", "Schritt 5 bei 4 von 20 Aufträgen in der Abendspitze ausgelassen") },
          { k: x("Response", "Përgjigjja", "Reaktion"), v: x("the scanner sits too far away: move it, test for a week, rewrite the standard", "skaneri është shumë larg: zhvendose, provo një javë, rishkruaj standardin", "der Scanner liegt zu weit weg: versetzen, eine Woche testen, Standard neu schreiben") },
        ], text: x("A gap in the standard, not in the person. The case is invented.", "Shmangie te standardi, jo te personi. Rasti është i shpikur.", "Eine Lücke im Standard, nicht bei der Person. Der Fall ist erfunden.") },
      ],
      note: x(
        "The Camry example dates from 1999. The two responses follow Spear and Bowen; the packing example is the editors'.",
        "Shembulli i Camry-së është i 1999. Dy përgjigjet ndjekin Spear-in dhe Bowen-in; shembulli i paketimit është i redaksisë.",
        "Das Camry-Beispiel stammt von 1999. Die zwei Reaktionen folgen Spear und Bowen; das Packbeispiel stammt von der Redaktion."),
      source: ["spear-bowen-1999"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The kaizen", "Karta", "Die Kaizen-"), x("card", "e kaizen-it", "Karte")],
      lead: x(
        "One card for one improvement to one standard. Fill it in where the work is done, with the people who do it; when the cause needs digging, the 5 Whys worksheet helps.",
        "Një kartë për një përmirësim të një standardi. Plotësoje aty ku bëhet puna, me njerëzit që e bëjnë; kur shkaku duhet gërmuar, ndihmon fleta e punës 5 Whys.",
        "Eine Karte für eine Verbesserung an einem Standard. Dort ausfüllen, wo die Arbeit gemacht wird, mit den Menschen, die sie machen; wenn die Ursache gesucht werden muss, hilft das 5-Why-Arbeitsblatt."),
      blocks: [
        { type: "form", items: [
          { h: x("The standard", "Standardi", "Der Standard"), hint: x("the job, its important steps and key points, the date of the version", "puna, hapat e rëndësishëm dhe pikat kyçe, data e versionit", "die Arbeit, ihre wichtigen Schritte und Kernpunkte, das Datum der Fassung") },
          { h: x("Time", "Koha", "Zeit"), hint: x("what the standard allows, what it took today", "sa lejon standardi, sa zgjati sot", "was der Standard vorsieht, was es heute dauerte") },
          { h: x("The gap", "Shmangia", "Die Abweichung"), hint: x("what departed from the standard, where, how often", "çfarë u largua nga standardi, ku, sa shpesh", "was vom Standard abwich, wo, wie oft") },
          { h: x("Not followed, or wrong?", "E pandjekur, apo e gabuar?", "Nicht befolgt oder falsch?"), hint: x("train the person, or change the standard", "trajno personin, ose ndrysho standardin", "die Person anlernen oder den Standard ändern") },
          { h: x("One small change", "Një ndryshim i vogël", "Eine kleine Änderung"), hint: x("who tries it, until when, measured the same way as before", "kush e provon, deri kur, i matur njësoj si më parë", "wer es testet, bis wann, gleich gemessen wie vorher") },
          { h: x("New standard", "Standardi i ri", "Neuer Standard"), hint: x("written, posted, taught with the four steps of Job Instruction", "i shkruar, i vendosur te vendi i punës, i mësuar me katër hapat e Job Instruction", "geschrieben, ausgehängt, mit den vier Schritten von Job Instruction angelernt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after TWI's Job Instruction and Job Methods cards (1945), Spear & Bowen (1999) and Imai (1986).",
        "Praktikë e propozuar nga redaksia, sipas kartave Job Instruction dhe Job Methods të TWI (1945), Spear & Bowen (1999) dhe Imai-t (1986).",
        "Eine Praxis, die die Redaktion vorschlägt, nach den Karten Job Instruction und Job Methods von TWI (1945), Spear & Bowen (1999) und Imai (1986)."),
      source: ["twi-report-1945", "spear-bowen-1999", "imai-1986"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
