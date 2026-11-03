// Management Review, No. 92: Sickness absence, what the rate says and what it hides.
// Block: KPIs. Facts and their sources: docs/revista/management-review-nr-92.md. Destatis's indicator page and its data
// series, the Entgeltfortzahlungsgesetz (§§ 3 and 5) and TK's Gesundheitsreport 2026 (summary and chapter 3 to the
// regional results) were read in full; DAK's Gesundheitsreport 2025 in its summary, chapters 1–2 and the whole of
// chapter 6, the analysis of the rise since 2022. Burnout is in No. 29, mental health at work in No. 75.
import { x } from "../common.js";

// "14.6" in English, "14,6" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));
// A share with one decimal: "45.7%", "45,7%", "45,7 %".
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 92,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Sick leave:", "Mungesat nga sëmundja:", "Der Krankenstand:"), x("what the rate hides", "çfarë fsheh norma", "was die Quote verbirgt")],
  sub: x(
    "Why Germany's sick days jumped in 2022, why three sources give three numbers, why a few long absences make most of the days, what the electronic sick note changed, and the absence the rate does not show.",
    "Pse ditët e sëmundjes në Gjermani u hodhën lart më 2022, pse tri burime japin tri shifra, pse pak mungesa të gjata bëjnë shumicën e ditëve, çfarë ndryshoi raporti elektronik mjekësor, dhe mungesa që norma nuk e tregon.",
    "Warum die Krankheitstage in Deutschland 2022 sprangen, warum drei Quellen drei Zahlen liefern, warum wenige lange Fälle die meisten Tage ausmachen, was die elektronische Krankmeldung änderte, und die Abwesenheit, die die Quote nicht zeigt."),
  seo: x(
    "Sickness absence rate: how Destatis, TK and DAK count it, the 2022 jump and the electronic sick note, long and short cases, presenteeism, and a card.",
    "Norma e mungesave nga sëmundja: si e numërojnë Destatis, TK dhe DAK, kërcimi i 2022-s, rastet e gjata e të shkurtra, puna e sëmurë, një kartë.",
    "Krankenstand: wie Destatis, TK und DAK zählen, der Sprung 2022 und die eAU, kurze und lange Fälle, Präsentismus und eine Karte für die Quote."),
  feature: x(
    "In 2022 German employees were suddenly off sick for 14.8 working days instead of 11.2. Issue 92 asks how much of that was illness and how much was counting. It sets three official and insurer figures side by side, shows that a few long absences make up most of the days, follows DAK's analysis of the jump after the electronic sick note, and looks at what the rate does not show: the people who came to work sick. A card for reading the team's rate closes the issue.",
    "Më 2022, punonjësit në Gjermani papritur munguan për sëmundje 14,8 ditë pune në vend të 11,2. Numri 92 pyet sa prej kësaj ishte sëmundje dhe sa numërim. Vë krah për krah shifrat e statistikës zyrtare dhe të arkave të sigurimit, tregon që pak mungesa të gjata bëjnë pjesën më të madhe të ditëve, ndjek analizën e DAK-ut për kërcimin pas raportit elektronik mjekësor, dhe shikon atë që norma nuk e tregon: njerëzit që erdhën në punë të sëmurë. Një kartë për të lexuar normën e ekipit e mbyll numrin.",
    "2022 fehlten Beschäftigte in Deutschland plötzlich 14,8 statt 11,2 Arbeitstage wegen Krankheit. Ausgabe 92 fragt, wie viel davon Krankheit war und wie viel Zählung. Sie stellt amtliche Zahlen und Zahlen der Krankenkassen nebeneinander, zeigt, dass wenige lange Fälle die meisten Tage ausmachen, folgt der DAK-Analyse des Sprungs nach der elektronischen Krankmeldung und schaut auf das, was die Quote nicht zeigt: Menschen, die krank zur Arbeit kamen. Eine Karte zum Lesen der Teamquote schließt die Ausgabe."),
  figure: { n: x("11.2 → 14.8", "11,2 → 14,8", "11,2 → 14,8"), by: "Destatis, 2026", t: x(
    "working days of sick leave per employee in Germany, 2021 to 2022; the electronic sick note explains part of the jump.",
    "ditë pune me raport mjekësor për punonjës në Gjermani, 2021 me 2022; raporti elektronik shpjegon një pjesë të kërcimit.",
    "Arbeitstage mit Krankmeldung je Arbeitnehmer in Deutschland, 2021 zu 2022; die elektronische Krankmeldung erklärt einen Teil des Sprungs.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The jump of 2022", "Kërcimi i 2022-s", "Der Sprung von 2022") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("What the jump was made of", "Nga se u bë kërcimi", "Woraus der Sprung bestand") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The absence card", "Karta e mungesave", "Die Fehlzeitenkarte") },
  ],
  sources: ["absence-destatis-2026", "absence-entgfg", "absence-tk-2026", "absence-dak-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Sickness absence is one of the few people figures every company has, and it is often read as a sign of morale or discipline. This issue asks what the number actually counts, how Germany counts it, why it jumped in 2022, and what it leaves out.",
        "Mungesat nga sëmundja janë nga të paktat shifra për njerëzit që i ka çdo kompani, dhe shpesh lexohen si shenjë e moralit ose e disiplinës. Ky numër pyet çfarë numëron në të vërtetë kjo shifër, si e numëron Gjermania, pse u hodh lart më 2022, dhe çfarë lë jashtë.",
        "Der Krankenstand ist eine der wenigen Personalkennzahlen, die jedes Unternehmen hat, und er wird oft als Zeichen für Moral oder Disziplin gelesen. Diese Ausgabe fragt, was die Zahl eigentlich zählt, wie Deutschland sie zählt, warum sie 2022 sprang und was sie auslässt."),
      body: x(
        "Destatis puts sick leave at 11.2 working days per employee in 2021 and 14.8 in 2022, the year the sick note began to travel electronically from the doctor to the insurer. The insurers count in other units, so their figures differ. In TK's data, 3.6% of sick notes made 45.7% of the days. DAK's analysis traces much of the jump to more complete counting. And 62.5% of employees surveyed had worked while sick.",
        "Destatis e vë mungesën me raport mjekësor në 11,2 ditë pune për punonjës më 2021 dhe 14,8 më 2022, vitin kur raporti nisi të shkonte elektronikisht nga mjeku te arka e sigurimit. Arkat numërojnë me njësi të tjera, prandaj shifrat e tyre ndryshojnë. Në të dhënat e TK-së, 3,6% e raporteve bënë 45,7% të ditëve. Analiza e DAK-ut e lidh pjesën më të madhe të kërcimit me një numërim më të plotë. Dhe 62,5% e punonjësve të pyetur kishin punuar të sëmurë.",
        "Destatis beziffert die Krankmeldungen 2021 auf 11,2 und 2022 auf 14,8 Arbeitstage je Arbeitnehmer, das Jahr, in dem die Krankmeldung elektronisch von der Praxis zur Kasse zu gehen begann. Die Kassen zählen in anderen Einheiten, daher weichen ihre Zahlen ab. In den TK-Daten machten 3,6 % der Krankmeldungen 45,7 % der Tage aus. Die DAK-Analyse führt einen großen Teil des Sprungs auf vollständigere Erfassung zurück. Und 62,5 % der befragten Beschäftigten hatten krank gearbeitet."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The jump", "Kërcimi", "Der Sprung"), x("of 2022", "i 2022-s", "von 2022")],
      lead: x(
        "For years employees in Germany were off sick for around 10 to 11 working days a year. In 2022 the figure rose to 14.8. That year the paper sick note began to give way: from January, practices switched one by one to sending it to the health insurer electronically.",
        "Për vite me radhë, punonjësit në Gjermani mungonin për sëmundje rreth 10 deri në 11 ditë pune në vit. Më 2022 shifra u ngjit në 14,8. Atë vit raporti mjekësor në letër nisi të linte vendin: nga janari, praktikat mjekësore kaluan një nga një në dërgimin e tij elektronik te arka e sigurimit shëndetësor.",
        "Jahrelang fehlten Arbeitnehmer in Deutschland rund 10 bis 11 Arbeitstage im Jahr krankheitsbedingt. 2022 stieg die Zahl auf 14,8. In diesem Jahr begann der gelbe Schein zu verschwinden: Ab Januar stellten die Praxen nach und nach darauf um, die Krankmeldung elektronisch an die Krankenkasse zu senden."),
      blocks: [
        { type: "line", min: 0, max: 16, height: 110, source: ["absence-destatis-2026"],
          label: x("Working days of sick leave per employee, Germany (Destatis, 2026)", "Ditë pune me raport mjekësor për punonjës, Gjermani (Destatis, 2026)", "Arbeitstage mit Krankmeldung je Arbeitnehmer, Deutschland (Destatis, 2026)"),
          points: [
            { k: "2017", v: 10.6, n: dec("10.6") },
            { k: "2018", v: 10.6, n: dec("10.6") },
            { k: "2019", v: 10.9, n: dec("10.9") },
            { k: "2020", v: 11.2, n: dec("11.2") },
            { k: "2021", v: 11.2, n: dec("11.2") },
            { k: "2022", v: 14.8, n: dec("14.8") },
            { k: "2023", v: 15.2, n: dec("15.2") },
            { k: "2024", v: 14.8, n: dec("14.8") },
            { k: "2025", v: 14.6, n: dec("14.6") },
          ] },
        { type: "p", text: x(
          "Before, employees sent the insurer its copy themselves. Asked in DAK's survey of 2024, 57.5% said they always had, 12.5% sometimes, 16.3% never. Destatis attributes the rise since 2021 partly to the electronic note, which records short absences more fully.",
          "Më parë, punonjësit ia dërgonin vetë arkës kopjen e saj. Të pyetur në anketën e DAK-ut të 2024-s, 57,5% thanë se e kishin dërguar gjithmonë, 12,5% ndonjëherë, 16,3% kurrë. Destatis e lidh rritjen që nga 2021, mes të tjerash, me raportin elektronik, që i regjistron më plotësisht mungesat e shkurtra.",
          "Früher schickten Beschäftigte der Kasse ihre Ausfertigung selbst. In der DAK-Befragung 2024 sagten 57,5 %, sie hätten das immer getan, 12,5 % manchmal, 16,3 % nie. Destatis führt den Anstieg seit 2021 unter anderem auf die eAU zurück, die kurze Fälle vollständiger erfasst.") },
        { type: "callout", reading: true, text: x(
          "When the way of counting changes, the number moves even if nobody is sicker. Compare the years since 2022 with each other.",
          "Kur ndryshon mënyra e numërimit, shifra lëviz edhe nëse askush nuk është më i sëmurë. Krahasoji vitet që nga 2022 me njëri-tjetrin.",
          "Wenn sich die Zählweise ändert, bewegt sich die Zahl, auch wenn niemand kränker ist. Vergleichen Sie die Jahre seit 2022 miteinander.") },
      ],
      note: x(
        "Destatis, days lost per employee, from the IAB's working-time accounts; by its account only absences over three days are counted, so the true figure is likely higher. A note is due after three calendar days, or sooner if the employer asks (§ 5 EntgFG).",
        "Destatis, ditët e humbura për punonjës, nga llogaritë e kohës së punës të IAB-së; sipas tij numërohen vetëm mungesat mbi tri ditë, prandaj shifra e vërtetë ka gjasa të jetë më e lartë. Raporti duhet pas tri ditësh kalendarike, ose më herët nëse e kërkon punëdhënësi (§ 5 EntgFG).",
        "Destatis, Fehltage je Arbeitnehmer, aus der Arbeitszeitrechnung des IAB; erfasst werden nach Destatis nur Krankmeldungen über drei Tage, die tatsächliche Zahl dürfte höher liegen. Ein Attest ist nach drei Kalendertagen fällig, früher auf Verlangen des Arbeitgebers (§ 5 EntgFG)."),
      source: ["absence-destatis-2026", "absence-entgfg", "absence-dak-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Three sources,", "Tri burime,", "Drei Quellen,"), x("three numbers", "tri shifra", "drei Zahlen")],
      lead: x(
        "Each source counts in its own way: working days or calendar days, employees or all insured people, every day of the year or one day a month. The figures cannot be set side by side without saying which.",
        "Çdo burim numëron në mënyrën e vet: ditë pune ose ditë kalendarike, punonjës ose të gjithë të siguruarit, çdo ditë të vitit ose një ditë në muaj. Shifrat nuk mund të vihen krah për krah pa thënë cilën.",
        "Jede Quelle zählt auf ihre Weise: Arbeitstage oder Kalendertage, Arbeitnehmer oder alle Versicherten, jeden Tag des Jahres oder einen Tag im Monat. Die Zahlen lassen sich nicht nebeneinanderstellen, ohne das zu sagen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Destatis: 14.6 days (2025)", "Destatis: 14,6 ditë (2025)", "Destatis: 14,6 Tage (2025)"), p: x("working days lost per employee, from the IAB's working-time accounts", "ditë pune të humbura për punonjës, nga llogaritë e kohës së punës të IAB-së", "Arbeitstage je Arbeitnehmer, aus der Arbeitszeitrechnung des IAB") },
          { h: x("TK: 18.5 days, 5.08% (2025)", "TK: 18,5 ditë, 5,08% (2025)", "TK: 18,5 Tage, 5,08 % (2025)"), p: x("calendar days per insured year; members in work or on unemployment benefit; standardised by age and sex", "ditë kalendarike për vit sigurimi; anëtarë në punë ose me pagesë papunësie; të standardizuara sipas moshës dhe gjinisë", "Kalendertage je Versicherungsjahr; Erwerbstätige und Arbeitslose; nach Alter und Geschlecht standardisiert") },
          { h: x("DAK: 5.4% (2024)", "DAK: 5,4% (2024)", "DAK: 5,4 % (2024)"), p: x("the share off sick on an average calendar day: 1,967.4 days per 100 insured years over 366 days", "pjesa e të sëmurëve në një ditë kalendarike mesatare: 1.967,4 ditë për 100 vjet sigurimi mbi 366 ditë", "Anteil Kranker an einem durchschnittlichen Kalendertag: 1.967,4 Tage je 100 Versichertenjahre durch 366 Tage") },
        ] },
        { type: "columns", max: 6, height: 96, source: ["absence-tk-2026"],
          label: x("TK's rate for 2025, counted two ways (2026)", "Norma e TK-së për 2025, e numëruar në dy mënyra (2026)", "Der TK-Krankenstand 2025, auf zwei Arten gezählt (2026)"),
          items: [
            { k: x("Every day of the year", "Çdo ditë e vitit", "Jeder Tag des Jahres"), v: 5.08, n: x("5.08%", "5,08%", "5,08 %") },
            { k: x("First of each month", "E para e çdo muaji", "Jeder Monatserste"), v: 4.54, n: x("4.54%", "4,54%", "4,54 %"), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "A higher figure from an insurer does not mean more sickness. Often it is another unit.",
          "Një shifër më e lartë nga një arkë nuk do të thotë më shumë sëmundje. Shpesh është një njësi tjetër.",
          "Eine höhere Zahl einer Kasse bedeutet nicht mehr Krankheit. Oft ist es eine andere Einheit.") },
      ],
      note: x(
        "The health ministry's monthly statistic counts on the first of each month. TK recomputed its own data that way; in 2025 many of those days fell on weekends, holidays or days with low sickness, so the method came out low.",
        "Statistika mujore e ministrisë së shëndetësisë numëron në ditën e parë të çdo muaji. TK i rillogariti të dhënat e veta në atë mënyrë; më 2025 shumë nga ato ditë ranë në fundjavë, festa ose ditë me pak të sëmurë, prandaj metoda doli e ulët.",
        "Die Monatsstatistik des Gesundheitsministeriums zählt am Ersten jedes Monats. Die TK rechnete ihre Daten so nach; 2025 fielen viele dieser Tage auf Wochenenden, Feiertage oder Tage mit wenig Krankmeldungen, deshalb fiel die Methode zu niedrig aus."),
      source: ["absence-destatis-2026", "absence-tk-2026", "absence-dak-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Few long cases,", "Pak raste të gjata,", "Wenige lange Fälle,"), x("most of the days", "shumica e ditëve", "die meisten Tage")],
      lead: x(
        "The rate is the number of sick notes times their average length, spread over the days of the year. Two teams can share the same rate, one with many short absences and one with a few long ones.",
        "Norma është numri i raporteve mjekësore herë kohëzgjatjen mesatare të tyre, e shpërndarë mbi ditët e vitit. Dy ekipe mund të kenë të njëjtën normë, njëri me shumë mungesa të shkurtra dhe tjetri me pak mungesa të gjata.",
        "Die Quote ist die Zahl der Krankmeldungen mal ihre durchschnittliche Dauer, verteilt auf die Tage des Jahres. Zwei Teams können dieselbe Quote haben, eines mit vielen kurzen Fällen, eines mit wenigen langen."),
      blocks: [
        { type: "pairs", from: x("Share of sick notes", "Pjesa e raporteve", "Anteil der Fälle"), to: x("Share of days", "Pjesa e ditëve", "Anteil der Tage"), max: 50, source: ["absence-tk-2026"],
          label: x("Sick notes by length, TK members, 2025 (2026)", "Raportet sipas kohëzgjatjes, anëtarët e TK-së, 2025 (2026)", "Krankmeldungen nach Dauer, TK-Versicherte, 2025 (2026)"),
          rows: [
            { k: x("1 to 3 days", "1 deri në 3 ditë", "1 bis 3 Tage"), a: 40.0, an: pcd("40.0"), b: 7.4, bn: pcd("7.4") },
            { k: x("4 to 7 days", "4 deri në 7 ditë", "4 bis 7 Tage"), a: 32.3, an: pcd("32.3"), b: 14.5, bn: pcd("14.5") },
            { k: x("8 to 14 days", "8 deri në 14 ditë", "8 bis 14 Tage"), a: 15.4, an: pcd("15.4"), b: 14.0, bn: pcd("14.0") },
            { k: x("15 to 42 days", "15 deri në 42 ditë", "15 bis 42 Tage"), a: 8.8, an: pcd("8.8"), b: 18.4, bn: pcd("18.4") },
            { k: x("More than 6 weeks", "Më shumë se 6 javë", "Mehr als 6 Wochen"), a: 3.6, an: pcd("3.6"), b: 45.7, bn: pcd("45.7"), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "Short absences disrupt the shift; long ones make the rate. They call for different answers: cover for the first, a way back to work for the second.",
          "Mungesat e shkurtra e prishin turnin; të gjatat bëjnë normën. Kërkojnë përgjigje të ndryshme: zëvendësim për të parat, një rrugë kthimi në punë për të dytat.",
          "Kurze Fälle stören die Schicht, lange machen die Quote. Sie verlangen verschiedene Antworten: Vertretung für die einen, einen Weg zurück in die Arbeit für die anderen.") },
      ],
      note: x(
        "TK raw figures; the editors added 15–28 and 29–42 days into one row. Six weeks is where the employer's sick pay ends and the insurer's sickness benefit begins (§ 3 EntgFG). Notes of up to three days are counted incompletely.",
        "Shifra të papërpunuara të TK-së; redaksia bashkoi 15–28 dhe 29–42 ditët në një rresht. Gjashtë javë është pika ku mbaron pagesa nga punëdhënësi dhe nis pagesa e sëmundjes nga arka (§ 3 EntgFG). Raportet deri në tri ditë numërohen jo plotësisht.",
        "TK-Rohwerte; die Redaktion fasste 15–28 und 29–42 Tage in einer Zeile zusammen. Nach sechs Wochen endet die Entgeltfortzahlung und das Krankengeld der Kasse beginnt (§ 3 EntgFG). Fälle bis drei Tage sind unvollständig erfasst."),
      source: ["absence-tk-2026", "absence-entgfg", "absence-destatis-2026"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What the jump", "Nga se", "Woraus der Sprung"), x("was made of", "u bë kërcimi", "bestand")],
      lead: x(
        "For its 2025 report DAK-Gesundheit had the IGES Institute take the jump apart. Its rate rose from 4.0% in 2021 to 5.5% in 2022. Of the extra sick notes, 94% lasted up to 14 days; they made 80% of the extra days.",
        "Për raportin e 2025-s, DAK-Gesundheit i kërkoi Institutit IGES ta zbërthente kërcimin. Norma e saj u ngjit nga 4,0% më 2021 në 5,5% më 2022. Nga raportet shtesë, 94% zgjatën deri në 14 ditë; ato bënë 80% të ditëve shtesë.",
        "Für ihren Report 2025 ließ die DAK-Gesundheit den Sprung vom IGES Institut zerlegen. Ihr Krankenstand stieg von 4,0 % 2021 auf 5,5 % 2022. Von den zusätzlichen Fällen dauerten 94 % bis zu 14 Tage; sie machten 80 % der zusätzlichen Tage aus."),
      blocks: [
        { type: "pairs", from: "2015", to: "2024", max: 100, source: ["absence-dak-2025"],
          label: x("Employees with at least one sick report in a year: what they say and what the insurer saw (2025)", "Punonjës me të paktën një mungesë nga sëmundja në vit: çfarë thonë dhe çfarë pa arka (2025)", "Beschäftigte mit mindestens einer Krankmeldung im Jahr: was sie sagen und was die Kasse sah (2025)"),
          rows: [
            { k: x("Say they reported sick (survey)", "Thonë se u paraqitën të sëmurë (anketa)", "Sagen, sie waren krankgemeldet (Befragung)"), a: 69.7, an: pcd("69.7"), b: 69.9, bn: pcd("69.9") },
            { k: x("Sick note on file at DAK (insurer data)", "Raport mjekësor në DAK (të dhënat e arkës)", "Krankmeldung bei der DAK (Kassendaten)"), a: 50.4, an: pcd("50.4"), b: 63.6, bn: pcd("63.6"), alert: true },
          ] },
        { type: "p", text: x(
          "Colds (J06) made 35% of the extra days. Doctors did treat more of them: 20.1% of insured employees in late 2023, 9.7% in late 2019. That predicts notes for 8.8%; DAK received them for 13.8%. IGES puts 60% of that rise down to the electronic note, 40% to more treatment.",
          "Ftohjet (J06) bënë 35% të ditëve shtesë. Mjekët trajtuan vërtet më shumë raste: 20,1% të punonjësve të siguruar në fund të 2023-s, 9,7% në fund të 2019-s. Kjo parashikon raporte për 8,8%; DAK-u i mori për 13,8%. IGES ia vë 60% të kësaj rritjeje raportit elektronik, 40% trajtimit më të shpeshtë.",
          "Erkältungen (J06) machten 35 % der zusätzlichen Tage aus. Ärzte behandelten tatsächlich mehr davon: 20,1 % der versicherten Beschäftigten Ende 2023, 9,7 % Ende 2019. Das ließe Krankmeldungen für 8,8 % erwarten; die DAK erhielt sie für 13,8 %. IGES führt 60 % dieses Anstiegs auf die eAU zurück, 40 % auf mehr Behandlungen.") },
        { type: "callout", reading: true, text: x(
          "What employees say barely moved; what the insurer saw rose by 13 points. Much of the new sickness is old sickness, now counted.",
          "Ajo që thonë punonjësit pothuajse nuk lëvizi; ajo që pa arka u rrit me 13 pikë. Shumë nga sëmundja e re është sëmundje e vjetër, tani e numëruar.",
          "Was Beschäftigte sagen, bewegte sich kaum; was die Kasse sah, stieg um 13 Punkte. Viel von der neuen Krankheit ist alte Krankheit, jetzt gezählt.") },
      ],
      note: x(
        "DAK: 2.4 million members. Survey: 7,068 employees asked online by forsa in 2024, weighted to be representative, set beside DAK's survey of 2015. The 60:40 split is IGES's estimate for one diagnosis, J06, averaged over 2023.",
        "DAK: 2,4 milionë anëtarë. Anketa: 7.068 punonjës të pyetur në internet nga forsa më 2024, të peshuar për të qenë përfaqësues, krahasuar me anketën e DAK-ut të 2015-s. Ndarja 60:40 është vlerësimi i IGES-it për një diagnozë, J06, mesatarisht për 2023-n.",
        "DAK: 2,4 Millionen Mitglieder. Befragung: 7.068 Beschäftigte, 2024 online von forsa befragt, repräsentativ gewichtet, neben der DAK-Befragung von 2015. Die Aufteilung 60:40 ist die Schätzung von IGES für eine Diagnose, J06, im Mittel des Jahres 2023."),
      source: ["absence-dak-2025"],
    },
    {
      id: "measure",
      kicker: x("What the rate hides", "Çfarë fsheh norma", "Was die Quote verbirgt"),
      title: [x("Present,", "Në punë,", "Anwesend,"), x("but sick", "por i sëmurë", "aber krank")],
      lead: x(
        "A low rate can also mean that people come in sick. In DAK's 2024 survey, 62.5% of employees had worked at least once in the past year when they should have reported sick, at the workplace or from home; in 2015, 67.5%.",
        "Një normë e ulët mund të thotë edhe që njerëzit vijnë në punë të sëmurë. Në anketën e DAK-ut të 2024-s, 62,5% e punonjësve kishin punuar të paktën një herë gjatë vitit kur duhej të ishin paraqitur të sëmurë, në vendin e punës ose nga shtëpia; më 2015, 67,5%.",
        "Eine niedrige Quote kann auch heißen, dass Menschen krank zur Arbeit kommen. In der DAK-Befragung 2024 hatten 62,5 % der Beschäftigten im vergangenen Jahr mindestens einmal gearbeitet, obwohl sie sich besser krankgemeldet hätten, im Betrieb oder im Homeoffice; 2015 waren es 67,5 %."),
      blocks: [
        { type: "hbars", max: 100, source: ["absence-dak-2025"],
          label: x("Reasons given by those who worked sick, 2024 (2025)", "Arsyet e atyre që punuan të sëmurë, 2024 (2025)", "Gründe derer, die krank arbeiteten, 2024 (2025)"),
          items: [
            { k: x("I did not want to let colleagues down", "Nuk desha t'i lija kolegët në baltë", "Ich wollte die Kollegen nicht hängen lassen"), v: 70.2, n: pcd("70.2"), alert: true },
            { k: x("I had to get my work finished", "Duhej ta mbaroja punën", "Ich musste meine Arbeit fertig kriegen"), v: 48.4, n: pcd("48.4") },
            { k: x("Customers or patients would suffer", "Klientët ose pacientët do të vuanin", "Kunden oder Patienten leiden darunter"), v: 36.5, n: pcd("36.5") },
            { k: x("Working from home made it possible", "Puna nga shtëpia e bëri të mundur", "Im Homeoffice ging es auch krank"), v: 35.5, n: pcd("35.5") },
            { k: x("I feared disadvantages", "Kisha frikë nga pasojat", "Ich fürchtete Nachteile"), v: 14.6, n: pcd("14.6") },
          ] },
        { type: "callout", reading: true, text: x(
          "The most common reason is loyalty to colleagues. Where there is no cover, coming in sick is how people protect the team.",
          "Arsyeja më e shpeshtë është besnikëria ndaj kolegëve. Aty ku nuk ka zëvendësim, të vish i sëmurë është mënyra si njerëzit e mbrojnë ekipin.",
          "Der häufigste Grund ist Loyalität zu den Kollegen. Wo es keine Vertretung gibt, schützen Menschen das Team, indem sie krank kommen.") },
      ],
      note: x(
        "Shares of the 3,950–4,261 who had worked sick; several reasons could apply. A bonus for no sick days moved 1.6%. 92.2% of all respondents never stayed away without good reason. Burnout is in No. 29, mental health in No. 75.",
        "Pjesë të 3.950–4.261 vetave që kishin punuar të sëmurë; mund të vlenin disa arsye. Një shpërblim për zero mungesa lëvizi 1,6%. 92,2% e të gjithë të pyeturve nuk munguan kurrë pa arsye. Burnout-i është te Nr. 29, shëndeti mendor te Nr. 75.",
        "Anteile der 3.950–4.261, die krank gearbeitet hatten; mehrere Gründe möglich. Eine Prämie ohne Krankmeldung bewog 1,6 %. 92,2 % aller Befragten fehlten nie ohne triftigen Grund. Burnout steht in Nr. 29, psychische Gesundheit in Nr. 75."),
      source: ["absence-dak-2025"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/", more: "kpis-the-team-trusts",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The absence", "Karta e", "Die Fehlzeiten-"), x("card", "mungesave", "karte")],
      lead: x(
        "One card for reading the team's absence each month. The Shift Capacity tool takes an absence allowance when it works out the heads each shift needs, so the absence you expect is planned rather than absorbed.",
        "Një kartë për të lexuar çdo muaj mungesat e ekipit. Mjeti Shift Capacity merr parasysh një rezervë për mungesat kur llogarit sa njerëz i duhen çdo turni, që mungesa e pritur të planifikohet e jo të përballohet në çast.",
        "Eine Karte, um jeden Monat die Fehlzeiten des Teams zu lesen. Das Werkzeug Shift Capacity rechnet bei den Köpfen je Schicht einen Abwesenheitszuschlag ein, damit erwartete Fehlzeiten geplant statt aufgefangen werden."),
      blocks: [
        { type: "form", items: [
          { h: x("What is counted", "Çfarë numërohet", "Was gezählt wird"), hint: x("working or calendar days; who is in the base; notes only, or every absence", "ditë pune apo kalendarike; kush është në bazë; vetëm raportet, apo çdo mungesë", "Arbeits- oder Kalendertage; wer in der Basis ist; nur Atteste oder jede Abwesenheit") },
          { h: x("How often, how long", "Sa shpesh, sa gjatë", "Wie oft, wie lange"), hint: x("number of absences and average length, separately", "numri i mungesave dhe kohëzgjatja mesatare, veç e veç", "Zahl der Fälle und mittlere Dauer, getrennt") },
          { h: x("Long cases apart", "Rastet e gjata veç", "Lange Fälle getrennt"), hint: x("over six weeks: who supports the return", "mbi gjashtë javë: kush e mbështet kthimin", "über sechs Wochen: wer die Rückkehr begleitet") },
          { h: x("Same month last year", "I njëjti muaj vjet", "Gleicher Monat im Vorjahr"), hint: x("colds peak in winter; compare like with like, never one day", "ftohjet kulmojnë në dimër; krahaso të njëjtën gjë, kurrë një ditë", "Erkältungen gipfeln im Winter; Gleiches mit Gleichem vergleichen, nie einen Stichtag") },
          { h: x("Worked sick", "Punoi i sëmurë", "Krank gearbeitet"), hint: x("ask the team, anonymously: who came in or logged on ill, and why", "pyet ekipin, pa emër: kush erdhi ose punoi i sëmurë, dhe pse", "das Team anonym fragen: wer krank kam oder sich einloggte, und warum") },
          { h: x("What we change", "Çfarë ndryshojmë", "Was wir ändern"), hint: x("cover, workload, the absence allowance in the plan", "zëvendësimi, ngarkesa, rezerva për mungesat në plan", "Vertretung, Arbeitslast, der Abwesenheitszuschlag im Plan") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the definitions of Destatis, TK and DAK and on DAK's survey; it uses the team's figures, never a person's diagnosis. The essay linked below sets out the author's card for any KPI.",
        "Karta është propozim i redaksisë, e ndërtuar mbi përkufizimet e Destatis-it, TK-së dhe DAK-ut dhe mbi anketën e DAK-ut; përdor shifrat e ekipit, kurrë diagnozën e një personi. Eseja e lidhur më poshtë shtjellon kartën e autorit për çdo KPI.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Definitionen von Destatis, TK und DAK und die DAK-Befragung; sie nutzt die Zahlen des Teams, nie die Diagnose einer Person. Der unten verlinkte Essay zeigt die KPI-Karte des Autors."),
      source: ["absence-destatis-2026", "absence-tk-2026", "absence-dak-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
