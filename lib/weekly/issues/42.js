// Management Review, No. 42: The manager as trainer: TWI Job Instruction. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-42.md.
import { x, pc } from "../common.js";

export default {
  number: 42,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The manager as trainer:", "Menaxheri si trajner:", "Die Führungskraft als Trainer:"), x("TWI Job Instruction", "Job Instruction e TWI-së", "TWI Job Instruction")],
  sub: x(
    "How key points cut lens grinding from five years to months, a pocket card with four steps, what experts leave out when they teach, the timetable that measures training, and a job breakdown sheet.",
    "Si e shkurtuan pikat kyçe mësimin e lustrimit të lenteve nga pesë vjet në disa muaj, karta e xhepit me katër hapa, çfarë lënë jashtë ekspertët kur u mësojnë të tjerëve, plani kohor që e mat trajnimin, dhe një fletë për zbërthimin e punës.",
    "Wie Kernpunkte das Linsenschleifen von fünf Jahren auf Monate verkürzten, eine Taschenkarte mit vier Schritten, was Fachleute beim Anlernen weglassen, der Zeitplan, der das Anlernen misst, und ein Arbeitszerlegungsblatt."),
  seo: x(
    "TWI Job Instruction: key points, the four steps on the pocket card, what experts leave out when they teach, the training timetable and a job breakdown sheet.",
    "Job Instruction e TWI-së: pikat kyçe, katër hapat e kartës, çfarë lënë jashtë ekspertët kur japin mësim, plani kohor dhe fleta e zbërthimit të punës.",
    "TWI Job Instruction: Kernpunkte, die vier Schritte der Taschenkarte, was Fachleute beim Anlernen weglassen, der Anlernplan und ein Zerlegungsblatt."),
  feature: x(
    "In 1940 the United States needed lens grinders, and a handful of key points cut their training from years to months: Issue 42 begins there. It follows Job Instruction from Charles Allen's shipyards to more than a million certificates and sets out the pocket card with its four steps. Expert surgeons show how much is left out when a procedure is taught, TWI's timetable measures training, and a job breakdown sheet waits to be filled in.",
    "Numri 42 nis më 1940, kur SHBA-së i duheshin lustrues lentesh dhe disa pika kyçe e shkurtuan trajnimin e tyre nga vite në muaj. Pastaj ndjek Job Instruction nga kantieret detare të Charles Allen-it deri te më shumë se një milion certifikata dhe shtjellon kartën e xhepit me katër hapat e saj. Kirurgët ekspertë tregojnë sa lënë jashtë kur shpjegojnë një procedurë, plani kohor i TWI-së e mat trajnimin, dhe në fund të pret një fletë për zbërthimin e punës.",
    "1940 brauchten die USA Linsenschleifer, und einige Kernpunkte verkürzten deren Ausbildung von Jahren auf Monate: Hier setzt Ausgabe 42 ein. Sie verfolgt Job Instruction von Charles Allens Werften bis zu über einer Million Zertifikaten und stellt die Taschenkarte mit ihren vier Schritten vor. Erfahrene Chirurgen zeigen, wie viel beim Lehren eines Eingriffs weggelassen wird, der Zeitplan von TWI misst das Anlernen, und am Ende steht ein Arbeitszerlegungsblatt zum Ausfüllen."),
  figure: { n: x("1,005,170", "1.005.170", "1.005.170"), by: "TWI Report, 1945", t: x(
    "Job Instruction certificates by September 1945: more than half of all those the Training Within Industry service issued.",
    "certifikata Job Instruction deri në shtator 1945: më shumë se gjysma e të gjitha atyre që lëshoi shërbimi Training Within Industry.",
    "Job-Instruction-Zertifikate bis September 1945: mehr als die Hälfte aller, die der Dienst Training Within Industry ausstellte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("From five years to months", "Nga pesë vjet në disa muaj", "Von fünf Jahren auf Monate") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Get ready, then four steps", "Përgatitu, pastaj katër hapa", "Vorbereiten, dann vier Schritte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The job breakdown sheet", "Fleta e zbërthimit të punës", "Das Arbeitszerlegungsblatt") },
  ],
  sources: ["twi-report-1945", "lei-twi", "twi-ji-lei-cards-2023", "twi-ji-institute-2026", "twi-ji-sullivan-2014", "bianchi-giorcelli-2022"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most managers were never taught how to teach. They learned the job, became good at it, and were then asked to pass it on. Job Instruction, written in the Second World War and still in use, treats teaching a job as a skill of its own.",
        "Shumicës së menaxherëve nuk ua ka mësuar kush si t'ua mësojnë një punë të tjerëve. E mësuan punën, u bënë të mirë në të, dhe pastaj iu kërkua ta përcillnin. Job Instruction, e shkruar gjatë Luftës së Dytë Botërore dhe ende në përdorim, e trajton mësimin e një pune si aftësi më vete.",
        "Den meisten Führungskräften hat nie jemand das Anlernen beigebracht. Sie lernten die Arbeit, wurden gut darin und sollten sie dann weitergeben. Job Instruction, im Zweiten Weltkrieg entstanden und bis heute im Einsatz, behandelt das Anlernen als eigene Fähigkeit."),
      body: x(
        "In 1940 the United States needed 350 lens grinders and thought the craft took five years to learn. Breaking the work into steps and key points cut that to months, and by 1945 more than a million Job Instruction certificates had been issued. The pocket card puts the burden on the teacher. A study of expert surgeons shows why: teaching a procedure, they left out half or more of each kind of step. TWI's timetable shows how to measure training, and the sheet on page 8 is where it starts.",
        "Më 1940, SHBA-së i duheshin 350 lustrues lentesh, dhe mendohej se zanati mësohej për pesë vjet. Zbërthimi i punës në hapa dhe pika kyçe e uli këtë në disa muaj, dhe deri më 1945 u lëshuan më shumë se një milion certifikata Job Instruction. Karta e xhepit ia ngarkon përgjegjësinë atij që jep mësim. Një studim me kirurgë ekspertë tregon pse: kur shpjegonin një procedurë, lanë jashtë gjysmën ose më shumë të çdo lloji hapash. Plani kohor i TWI-së tregon si matet trajnimi, dhe gjithçka nis me fletën te faqja 8.",
        "1940 brauchten die USA 350 Linsenschleifer und glaubten, das Handwerk zu lernen dauere fünf Jahre. Die Zerlegung der Arbeit in Schritte und Kernpunkte verkürzte das auf Monate, und bis 1945 wurden über eine Million Job-Instruction-Zertifikate ausgestellt. Die Taschenkarte legt die Verantwortung auf die Person, die anlernt. Eine Studie mit erfahrenen Chirurgen zeigt, warum: Beim Lehren eines Eingriffs ließen sie von jeder Art Schritt die Hälfte oder mehr weg. Der Zeitplan von TWI zeigt, wie sich Anlernen messen lässt, und mit dem Blatt auf Seite 8 fängt es an."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("From five years", "Nga pesë vjet", "Von fünf Jahren"), x("to months", "në disa muaj", "auf Monate")],
      lead: x(
        "In August 1940, in its first week, the Training Within Industry service (TWI) got its first task: to help US arsenals and navy yards find 350 qualified lens grinders. A learner was thought to do well to master the craft in five years.",
        "Në gusht 1940, në javën e tij të parë, shërbimi Training Within Industry (TWI) mori detyrën e parë: t'i ndihmonte arsenalet dhe kantieret e marinës amerikane të gjenin 350 lustrues lentesh të kualifikuar. Mendohej se një nxënës e kishte bërë mirë nëse e zotëronte zanatin për pesë vjet.",
        "Im August 1940, in seiner ersten Woche, bekam der Dienst Training Within Industry (TWI) seinen ersten Auftrag: US-Arsenalen und Marinewerften zu 350 ausgebildeten Linsenschleifern zu verhelfen. Wer das Handwerk in fünf Jahren beherrschte, galt als guter Lernender."),
      blocks: [
        { type: "p", text: x(
          "Lens grinding turned out to be 20 jobs. New people were broken in on one simple job, and each part was studied for the few critical points that decided whether the whole operation succeeded. TWI called them key points. Training for the separate jobs fell from about five years to a matter of months.",
          "Doli se lustrimi i lenteve përbëhej nga 20 punë. Të ardhurit e rinj u stërvitën fillimisht në një punë të thjeshtë, dhe çdo pjesë u studiua për të gjetur ato pak pika kritike që vendosnin nëse i gjithë operacioni dilte mirë. TWI-ja i quajti pika kyçe. Trajnimi për punët e veçanta ra nga rreth pesë vjet në disa muaj.",
          "Das Linsenschleifen erwies sich als 20 Tätigkeiten. Neue Leute wurden an einer einfachen Tätigkeit angelernt, und jeder Teil wurde auf die wenigen kritischen Punkte untersucht, die über den Erfolg des ganzen Vorgangs entschieden. TWI nannte sie Kernpunkte. Die Ausbildung für die einzelnen Tätigkeiten sank von etwa fünf Jahren auf wenige Monate.") },
        { type: "timeline", items: [
          { k: "1917–19", t: x("Charles R. Allen trains shipyard instructors in four steps: show, tell, do, check.", "Charles R. Allen trajnon instruktorët e kantiereve detare me katër hapa: trego, shpjego, bëj, kontrollo.", "Charles R. Allen schult Werftausbilder in vier Schritten: zeigen, erklären, machen, prüfen.") },
          { k: "1940", t: x("Lens grinding: the key points are found.", "Lustrimi i lenteve: gjenden pikat kyçe.", "Linsenschleifen: Die Kernpunkte werden gefunden.") },
          { k: "1941", t: x("The method fits into ten hours; a national programme from August.", "Metoda futet në dhjetë orë; program kombëtar nga gushti.", "Die Methode passt in zehn Stunden; ab August landesweit.") },
          { k: "1945", t: x("1,005,170 Job Instruction certificates in all.", "Gjithsej 1.005.170 certifikata Job Instruction.", "Insgesamt 1.005.170 Job-Instruction-Zertifikate.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Key points are what the expert no longer notices. Once written down, they stop depending on who happens to do the teaching.",
          "Pikat kyçe janë ato që eksperti nuk i vë më re. Kur shkruhen, nuk varen më nga ai që rastis të japë mësim.",
          "Kernpunkte sind das, was Fachleute nicht mehr bemerken. Einmal aufgeschrieben, hängen sie nicht mehr davon ab, wer gerade anlernt.") },
      ],
      note: x(
        "From TWI's own final report (1945). “Months” is the report's word; it gives no exact figure. The count is of certificates, and one supervisor could hold several.",
        "Nga raporti përfundimtar i vetë TWI-së (1945). “Disa muaj” është fjala e raportit; shifër të saktë nuk jep. Numërohen certifikatat, dhe një mbikëqyrës mund të kishte disa.",
        "Aus dem Abschlussbericht von TWI selbst (1945). „Monate“ ist das Wort des Berichts; eine genaue Zahl nennt er nicht. Gezählt sind Zertifikate, und ein Vorarbeiter konnte mehrere haben."),
      source: ["twi-report-1945"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Training time,", "Koha e trajnimit,", "Anlernzeit,"), x("seven counts", "shtatë numërime", "sieben Zählungen")],
      lead: x(
        "Seven times between May 1943 and September 1945, TWI tabulated the results that plants reported. Of the plants that reported a change in training time, the share with a reduction of 25% or more:",
        "Nga maji 1943 deri në shtator 1945, TWI-ja i përmblodhi shtatë herë rezultatet që i raportonin fabrikat. Nga fabrikat që raportuan ndryshim në kohën e trajnimit, pjesa me ulje prej 25% ose më shumë:",
        "Zwischen Mai 1943 und September 1945 wertete TWI siebenmal die Ergebnisse aus, die Betriebe meldeten. Von den Betrieben, die eine Veränderung der Anlernzeit meldeten, der Anteil mit einer Senkung um 25 % oder mehr:"),
      blocks: [
        { type: "line", alert: true, min: 0, max: 100, height: 104, source: ["twi-report-1945"],
          label: x("Plants reporting training time cut by 25% or more, by tabulation (month/year)", "Fabrikat që raportuan ulje të kohës së trajnimit me 25% ose më shumë, sipas përmbledhjes (muaji/viti)", "Betriebe mit um 25 % oder mehr gesenkter Anlernzeit, je Auswertung (Monat/Jahr)"),
          points: [
            { k: "5/43", v: 48, n: pc(48) },
            { k: "9/43", v: 69, n: pc(69) },
            { k: "2/44", v: 79, n: pc(79) },
            { k: "11/44", v: 92, n: pc(92) },
            { k: "4/45", v: 96, n: pc(96) },
            { k: "7/45", v: 95, n: pc(95) },
            { k: "9/45", v: 100, n: pc(100) },
          ] },
        { type: "p", text: x(
          "Job Instruction was the largest of TWI's programmes: 1,005,170 of the 1,750,650 certificates issued by 30 September 1945. A group of ten supervisors took it in five two-hour sessions. Some single plants reported training time cut by 90%.",
          "Job Instruction ishte programi më i madh i TWI-së: 1.005.170 nga 1.750.650 certifikatat e lëshuara deri më 30 shtator 1945. Një grup me dhjetë mbikëqyrës e merrte në pesë takime nga dy orë. Disa fabrika raportuan se koha e trajnimit ra me 90%.",
          "Job Instruction war das größte Programm von TWI: 1.005.170 der 1.750.650 Zertifikate, die bis 30. September 1945 ausgestellt wurden. Eine Gruppe von zehn Vorarbeitern absolvierte es in fünf Sitzungen zu je zwei Stunden. Einzelne Betriebe meldeten eine um 90 % kürzere Anlernzeit.") },
        { type: "callout", reading: true, text: x(
          "Plants chose whether to report, and TWI used the counts to defend its budget. The curve records conviction, not a controlled test; page 6 looks for a comparison.",
          "Fabrikat zgjodhën vetë nëse do të raportonin, dhe TWI-ja i përdori numërimet për të mbrojtur buxhetin. Kurba tregon bindje, jo një provë të kontrolluar; faqja 6 kërkon një krahasim.",
          "Die Betriebe entschieden selbst, ob sie berichten, und TWI verteidigte mit den Zählungen sein Budget. Die Kurve zeigt Überzeugung, keinen kontrollierten Test; Seite 6 sucht einen Vergleich.") },
      ],
      note: x(
        "Each share is of the plants that reported a training-time result in that tabulation; the report does not say how many plants each one counted. The first used more than 600 voluntary plant statements.",
        "Çdo përqindje është nga fabrikat që raportuan rezultat për kohën e trajnimit në atë përmbledhje; sa fabrika numëroi secila, raporti nuk e thotë. E para përdori mbi 600 deklarata vullnetare fabrikash.",
        "Jeder Anteil bezieht sich auf die Betriebe, die in dieser Auswertung ein Ergebnis zur Anlernzeit meldeten; wie viele Betriebe jede zählte, sagt der Bericht nicht. Die erste stützte sich auf über 600 freiwillige Betriebsberichte."),
      source: ["twi-report-1945"],
    },
    {
      id: "model", more: "watch-how-i-do-it-is-not-training",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Get ready,", "Përgatitu,", "Vorbereiten,"), x("then four steps", "pastaj katër hapa", "dann vier Schritte")],
      lead: x(
        "Before teaching, the card says: have a timetable, break down the job into important steps and key points (safety is always a key point), have everything ready, and arrange the workplace as the worker will be expected to keep it. Then:",
        "Para se të japësh mësim, thotë karta: ki një plan kohor, zbërthe punën në hapa të rëndësishëm dhe pika kyçe (siguria është gjithmonë pikë kyçe), ki gjithçka gati, dhe rregulloje vendin e punës ashtu siç pritet ta mbajë punonjësi. Pastaj:",
        "Vor dem Anlernen, sagt die Karte: einen Zeitplan haben, die Arbeit in wichtige Schritte und Kernpunkte zerlegen (Sicherheit ist immer ein Kernpunkt), alles bereithalten und den Arbeitsplatz so einrichten, wie die Person ihn halten soll. Dann:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Prepare the worker", "Përgatit punonjësin", "Die Person vorbereiten"), p: x("Put them at ease, find out what they already know, get them interested.", "Qetësoje, mëso çfarë di tashmë, zgjoji interesin.", "Die Anspannung nehmen, herausfinden, was sie schon weiß, Interesse wecken.") },
          { h: x("Present the operation", "Paraqit operacionin", "Den Ablauf vorführen"), p: x("Tell, show and illustrate one important step at a time; stress each key point.", "Thuaj, trego dhe ilustro hapat e rëndësishëm një nga një; thekso çdo pikë kyçe.", "Einen wichtigen Schritt nach dem anderen erklären, zeigen, veranschaulichen; jeden Kernpunkt betonen.") },
          { h: x("Try out performance", "Provo zbatimin", "Ausführen lassen"), p: x("They do the job and explain each key point; continue until you know they know.", "Lëre ta bëjë punën vetë dhe të shpjegojë çdo pikë kyçe; vazhdo derisa ta dish që e di.", "Sie macht die Arbeit und erklärt jeden Kernpunkt; weiter, bis Sie wissen, dass sie es weiß.") },
          { h: x("Follow up", "Ndiqe", "Nachfassen"), p: x("Put them on their own, name who helps, check often, taper off.", "Lëre të punojë vetë, cakto kush e ndihmon, kontrollo shpesh, pakëso gradualisht ndjekjen.", "Selbstständig arbeiten lassen, Ansprechperson nennen, oft prüfen, Begleitung zurücknehmen.") },
        ] },
        { type: "quote", text: x(
          "If the worker hasn't learned, the instructor hasn't taught.",
          "Nëse punonjësi nuk ka mësuar, instruktori nuk ka dhënë mësim.",
          "Hat der Arbeiter nicht gelernt, hat der Ausbilder nicht gelehrt.") },
        { type: "p", text: x(
          "The TWI Institute still teaches the method in 10 hours to groups of up to 10. One stated aim: to replace job shadowing and “buddy” training. According to the Lean Enterprise Institute, Job Instruction is still the primary training tool of Toyota's team leaders worldwide.",
          "TWI Institute e mëson ende metodën në 10 orë, me grupe deri në 10 veta. Një nga qëllimet e shpallura: të zëvendësojë të mësuarit vetëm duke parë një koleg dhe trajnimin “me shok”. Sipas Lean Enterprise Institute, Job Instruction është ende mjeti kryesor i trajnimit për drejtuesit e ekipeve të Toyota-s në gjithë botën.",
          "Das TWI Institute lehrt die Methode heute in 10 Stunden für Gruppen bis 10 Personen. Ein erklärtes Ziel: Mitlaufen und „Buddy“-Anlernen zu ersetzen. Laut Lean Enterprise Institute bleibt Job Instruction das wichtigste Schulungswerkzeug der Teamleiter von Toyota weltweit.") },
      ],
      note: x(
        "Card wording after the TWI report (1945) and the Lean Enterprise Institute's reprint (2023), which writes “them” where the original wrote “him”. Translations are ours.",
        "Fjalët e kartës sipas raportit të TWI-së (1945) dhe ribotimit të Lean Enterprise Institute (2023), që shkruan “ata” aty ku origjinali shkruante “ai”. Përkthimet janë tonat.",
        "Wortlaut der Karte nach dem TWI-Bericht (1945) und dem Nachdruck des Lean Enterprise Institute (2023), der „sie“ schreibt, wo das Original „er“ schrieb. Übersetzungen von uns."),
      source: ["twi-report-1945", "twi-ji-lei-cards-2023", "twi-ji-institute-2026", "lei-twi"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What experts", "Çfarë lënë jashtë", "Was Fachleute"), x("leave out", "ekspertët", "weglassen")],
      lead: x(
        "The 1945 report warned that a competent worker's familiarity with the work often makes him overlook the difficulties he had at the start. In 2014, Maura Sullivan and colleagues filmed three expert surgeons teaching an emergency airway procedure and compared what they said with a full task list.",
        "Raporti i vitit 1945 paralajmëronte se punonjësi i aftë, pikërisht sepse e njeh mirë punën, shpesh harron vështirësitë që pati në fillim. Më 2014, Maura Sullivan dhe kolegët filmuan tre kirurgë ekspertë teksa shpjegonin një procedurë urgjente për rrugët e frymëmarrjes, dhe e krahasuan atë që thanë me një listë të plotë detyrash.",
        "Der Bericht von 1945 warnte, dass ein fähiger Arbeiter die Arbeit so gut kennt, dass er die Schwierigkeiten seiner Anfänge oft übersieht. 2014 filmten Maura Sullivan und Kollegen drei erfahrene Chirurgen beim Lehren eines Notfalleingriffs an den Atemwegen und verglichen das Gesagte mit einer vollständigen Aufgabenliste."),
      blocks: [
        { type: "hbars", source: ["twi-ji-sullivan-2014"],
          label: x("Steps left out while teaching, average of three experts, 2014", "Hapat e lënë jashtë gjatë mësimit, mesatarja e tre ekspertëve, 2014", "Beim Lehren weggelassene Schritte, Mittel von drei Fachleuten, 2014"),
          items: [
            { k: x("Clinical knowledge steps", "Hapa të njohurive klinike", "Schritte klinischen Wissens"), v: 71, n: pc(71) },
            { k: x("Action steps", "Hapa veprimi", "Handlungsschritte"), v: 51, n: pc(51) },
            { k: x("Decision steps", "Hapa vendimi", "Entscheidungsschritte"), v: 73, n: pc(73), alert: true },
          ] },
        { type: "p", text: x(
          "For action steps, the experts said how to do them only 13% of the time. Across 11,575 US firms, Nicola Bianchi and Michela Giorcelli found that Job Instruction raised sales and productivity for good, though less than Job Relations; trained firms then spent more on regular maintenance and less on machine repairs and injuries.",
          "Për hapat e veprimit, ekspertët thanë si bëhen vetëm në 13% të rasteve. Nicola Bianchi dhe Michela Giorcelli studiuan 11.575 firma amerikane dhe gjetën se Job Instruction i rriti përgjithmonë shitjet dhe produktivitetin, ndonëse më pak se Job Relations; firmat e trajnuara shpenzuan më pas më shumë për mirëmbajtjen e rregullt dhe më pak për riparime makinash dhe lëndime.",
          "Bei Handlungsschritten sagten die Fachleute nur in 13 % der Fälle, wie sie auszuführen sind. Bei 11.575 US-Firmen fanden Nicola Bianchi und Michela Giorcelli, dass Job Instruction Umsatz und Produktivität dauerhaft steigerte, wenn auch weniger als Job Relations; geschulte Firmen gaben danach mehr für regelmäßige Wartung und weniger für Maschinenreparaturen und Verletzungen aus.") },
        { type: "callout", reading: true, text: x(
          "Which step in your team's work does your best person do without thinking? That is where the key-point column earns its place: asking what makes or breaks the job brings back what practice has made invisible.",
          "Cilin hap të punës në ekipin tënd e bën më i miri pa menduar? Pikërisht aty duhet kolona e pikave kyçe: pyetja se çfarë e bën ose e prish punën nxjerr sërish atë që praktika e ka bërë të padukshme.",
          "Welchen Schritt in Ihrem Team erledigt Ihre beste Kraft, ohne nachzudenken? Dort verdient sich die Spalte der Kernpunkte ihren Platz: Die Frage, was die Arbeit gelingen oder scheitern lässt, holt zurück, was die Übung unsichtbar gemacht hat.") },
      ],
      note: x(
        "Sullivan et al.: three experts, one procedure, figures from the abstract. Bianchi and Giorcelli: a natural experiment, figures from the article (JPE, 2022).",
        "Sullivan et al.: tre ekspertë, një procedurë, shifrat nga abstrakti. Bianchi dhe Giorcelli: eksperiment natyror, shifrat nga artikulli (JPE, 2022).",
        "Sullivan et al.: drei Fachleute, ein Eingriff, Zahlen aus der Zusammenfassung. Bianchi und Giorcelli: ein natürliches Experiment, Zahlen aus dem Artikel (JPE, 2022)."),
      source: ["twi-report-1945", "twi-ji-sullivan-2014", "bianchi-giorcelli-2022"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Until you know", "Derisa ta dish", "Bis Sie wissen,"), x("they know", "që e di", "dass sie es weiß")],
      lead: x(
        "TWI found that workers often just copied motions without understanding them. From January 1943 the manual required the learner in step 3 to give back what he was doing and why. Training is measured in three places:",
        "TWI-ja vuri re se punonjësit shpesh thjesht kopjonin lëvizjet pa i kuptuar. Nga janari 1943, manuali kërkonte që në hapin 3 nxënësi të tregonte çfarë po bënte dhe pse. Trajnimi matet në tri vende:",
        "TWI stellte fest, dass Arbeiter oft nur Bewegungen nachahmten, ohne sie zu verstehen. Ab Januar 1943 verlangte das Handbuch, dass die lernende Person in Schritt 3 wiedergibt, was sie tut und warum. Gemessen wird das Anlernen an drei Stellen:"),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Timetable", "Plani kohor", "Zeitplan"), p: x("Workers down the side, jobs across the top; tick what each can already do, set a date for every gap.", "Punonjësit në rreshta, punët në kolona; shëno çfarë di të bëjë secili, cakto një datë për çdo mungesë.", "Beschäftigte untereinander, Tätigkeiten oben quer; abhaken, was jede Person schon kann, für jede Lücke ein Datum.") },
          { h: x("Give-back", "Kthimi i pikave kyçe", "Wiedergabe"), p: x("In the try-out, every key point and its reason, in the learner's own words.", "Gjatë provës, çdo pikë kyçe dhe arsyeja e saj, me fjalët e nxënësit.", "Beim Ausführen jeder Kernpunkt und sein Grund, in eigenen Worten.") },
          { h: x("Follow-up", "Ndjekja", "Nachfassen"), p: x("Who they go to for help, when you check, when extra coaching ends.", "Te kush shkon për ndihmë, kur kontrollon, kur mbaron ndjekja e shtuar.", "An wen sie sich wendet, wann Sie prüfen, wann die Extrabegleitung endet.") },
        ] },
        { type: "example", label: x("Hypothetical example, the timetable of a returns desk", "Shembull hipotetik, plani kohor i një sporteli kthimesh", "Hypothetisches Beispiel, der Zeitplan einer Retourenannahme"), rows: [
          { k: x("Team", "Ekipi", "Team"), v: x("6 people, 4 jobs: 24 boxes", "6 veta, 4 punë: 24 kuti", "6 Personen, 4 Tätigkeiten: 24 Felder") },
          { k: x("Can do it", "E dinë ta bëjnë", "Können es"), v: x("15 boxes ticked", "15 kuti të shënuara", "15 Felder abgehakt") },
          { k: x("Gaps", "Mungesat", "Lücken"), v: x("9: 6 with a date and a trainer, 3 with neither", "9: 6 me datë dhe trajner, 3 pa asnjërin", "9: 6 mit Datum und Trainer, 3 ohne beides") },
        ], text: x("The three gaps without a date are where “watch how I do it” fills in. All figures here are invented.", "Tri mungesat pa datë i mbush “shiko si e bëj unë”. Të gjitha shifrat këtu janë të sajuara.", "Die drei Lücken ohne Datum füllt „schau, wie ich es mache“. Alle Zahlen hier sind erfunden.") },
      ],
      note: x(
        "The timetable and the give-back are from the 1945 report; the example is the editors'.",
        "Plani kohor dhe kthimi janë nga raporti i vitit 1945; shembulli është i redaksisë.",
        "Zeitplan und Wiedergabe stammen aus dem Bericht von 1945; das Beispiel stammt von der Redaktion."),
      source: ["twi-report-1945"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The job breakdown", "Fleta e zbërthimit", "Das Arbeits-"), x("sheet", "të punës", "zerlegungsblatt")],
      lead: x(
        "One job per sheet, written where the work is done. If a KPI has turned red, first check that the cause is a matter of skill at all; the KPI diagnostic helps.",
        "Çdo punë në fletën e vet, e shkruar aty ku bëhet. Nëse një KPI është bërë e kuqe, kontrollo së pari nëse shkaku është vërtet çështje aftësie; të ndihmon Diagnostikimi i KPI-së.",
        "Eine Tätigkeit pro Blatt, geschrieben dort, wo gearbeitet wird. Ist eine Kennzahl rot geworden, prüfen Sie zuerst, ob die Ursache überhaupt im Können liegt; dabei hilft die KPI-Diagnose."),
      blocks: [
        { type: "form", items: [
          { h: x("The job", "Puna", "Die Tätigkeit"), hint: x("what is done, and what done well looks like", "çfarë bëhet, dhe si duket kur bëhet mirë", "was gemacht wird, und wie es gut gemacht aussieht") },
          { h: x("Important steps (what)", "Hapat e rëndësishëm (çfarë)", "Wichtige Schritte (was)"), hint: x("each a segment where the work moves forward", "secili një pjesë ku puna ecën përpara", "jeder ein Abschnitt, in dem die Arbeit vorankommt"), lines: 2 },
          { h: x("Key points (how)", "Pikat kyçe (si)", "Kernpunkte (wie)"), hint: x("what makes or breaks the job, could injure, or makes it easier", "çfarë e bën ose e prish punën, mund të lëndojë, ose e lehtëson", "was die Arbeit gelingen oder scheitern lässt, verletzen kann oder sie erleichtert"), lines: 2 },
          { h: x("Reasons (why)", "Arsyet (pse)", "Gründe (warum)"), hint: x("why each key point matters", "pse ka rëndësi çdo pikë kyçe", "warum jeder Kernpunkt zählt") },
          { h: x("Timetable", "Plani kohor", "Zeitplan"), hint: x("who should do it, how well, by what date", "kush duhet ta bëjë, sa mirë, deri kur", "wer es können soll, wie gut, bis wann") },
          { h: x("Try-out and follow-up", "Prova dhe ndjekja", "Ausführen und Nachfassen"), hint: x("key points given back; who helps; check dates", "pikat kyçe të shpjeguara nga nxënësi; kush ndihmon; datat e kontrollit", "Kernpunkte wiedergegeben; wer hilft; Prüftermine") },
        ] },
      ],
      note: x(
        "Proposed by the editors, after the Job Instruction card (1945) and the three-column sheet reprinted by the Lean Enterprise Institute (2023).",
        "Propozim i redaksisë, sipas kartës Job Instruction (1945) dhe fletës me tri kolona që ribotoi Lean Enterprise Institute (2023).",
        "Ein Vorschlag der Redaktion, nach der Job-Instruction-Karte (1945) und dem dreispaltigen Blatt im Nachdruck des Lean Enterprise Institute (2023)."),
      source: ["twi-report-1945", "twi-ji-lei-cards-2023"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
