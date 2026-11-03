// Management Review, No. 98: Output per hour, how the number is made. Block: KPI.
// Facts and their sources: docs/revista/management-review-nr-98.md. The definitions and country figures are the OECD's
// Compendium of Productivity Indicators 2025 (executive summary and chapters 1, 2 and 4, with the data files of Figures
// 4.5 and 4.6); what counts as an hour worked is the ILO's resolution of 2008; the German figures are Destatis's press
// release of 15 January 2026. All read in full. Injury rates per hour worked are No. 87, OEE No. 48, takt No. 53,
// Little's law No. 58, the cost of a minute No. 73: not repeated.
import { x } from "../common.js";

// A whole number with a thousands separator: "1,335", "1.335", "1.335".
const th = (s) => x(s, s.replace(",", "."), s.replace(",", "."));
// A signed change in per cent: "+0.5%", "+0,5%", "+0,5 %".
const ch = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 98,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Output per hour:", "Prodhimi për orë:", "Leistung je Stunde:"), x("how the number is made", "si bëhet shifra", "wie die Zahl entsteht")],
  sub: x(
    "What goes above the line and below it, output per hour across the OECD, which hours count as worked, one economy with two denominators, how to count a site's hours, and a card.",
    "Çfarë shkon sipër vijës dhe poshtë saj, prodhimi për orë në OECD, cilat orë numërohen si të punuara, një ekonomi me dy emërues, si numërohen orët e një vendi pune, dhe një kartë.",
    "Was über und was unter den Strich gehört, Leistung je Stunde in der OECD, welche Stunden als gearbeitet zählen, eine Volkswirtschaft mit zwei Nennern, wie man die Stunden eines Standorts zählt, und eine Karte."),
  seo: x(
    "Labour productivity per hour: what the OECD divides by what, which hours the ILO counts as worked, per person or per hour, and a card for a site.",
    "Produktiviteti i punës për orë: çfarë pjesëton OECD-ja me çfarë, cilat orë i numëron ILO si të punuara, për person apo për orë, dhe një kartë.",
    "Arbeitsproduktivität je Stunde: was die OECD wodurch teilt, welche Stunden die ILO als gearbeitet zählt, je Person oder je Stunde, und eine Karte."),
  feature: x(
    "Productivity per hour is a fraction: output above the line, hours actually worked below it. Issue 98 takes it apart. It follows the OECD's choices for both lines, sets output per hour in five economies and the OECD average beside the hours each worker puts in, and reads the ILO's rule for what counts as an hour worked, waiting at a stopped machine included. Germany's figures for 2022 to 2025 show one economy giving two answers per person and per hour. It ends with a way to count a site's hours, and a card.",
    "Produktiviteti për orë është një thyesë: prodhimi sipër vijës, orët e punuara vërtet poshtë saj. Numri 98 e zbërthen. Ndjek zgjedhjet e OECD-së për të dyja vijat, vë prodhimin për orë në pesë ekonomi dhe mesataren e OECD-së pranë orëve që punon çdo i punësuar, dhe lexon rregullin e ILO-s për atë që numërohet si orë pune, përfshirë pritjen para një makine të ndalur. Shifrat e Gjermanisë për 2022 deri 2025 tregojnë një ekonomi që jep dy përgjigje, për person dhe për orë. Mbyllet me një mënyrë për të numëruar orët e një vendi pune, dhe me një kartë.",
    "Produktivität je Stunde ist ein Bruch: oben die Leistung, unten die tatsächlich gearbeiteten Stunden. Ausgabe 98 nimmt ihn auseinander. Sie folgt den Entscheidungen der OECD für beide Linien, stellt die Leistung je Stunde in fünf Volkswirtschaften und im OECD-Schnitt neben die Stunden je Erwerbstätigen und liest die Regel der ILO, was als gearbeitete Stunde zählt, Warten an einer stehenden Maschine eingeschlossen. Deutschlands Zahlen für 2022 bis 2025 zeigen eine Volkswirtschaft mit zwei Antworten, je Person und je Stunde. Am Ende stehen ein Weg, die Stunden eines Standorts zu zählen, und eine Karte."),
  figure: { n: th("1,335"), by: "OECD, 2025", t: x(
    "hours worked per worker in Germany in 2023, the fewest in the OECD; output per hour was USD 94, against an OECD average of 71.",
    "orë pune për çdo të punësuar në Gjermani më 2023, më pak se kudo në OECD; prodhimi për orë ishte 94 dollarë, kundrejt mesatares 71 të OECD-së.",
    "Arbeitsstunden je Erwerbstätigen in Deutschland 2023, die wenigsten in der OECD; die Leistung je Stunde lag bei 94 US-Dollar, im OECD-Schnitt bei 71.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A fraction with two lines", "Një thyesë me dy vija", "Ein Bruch mit zwei Linien") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("What counts as an hour worked", "Çfarë numërohet si orë pune", "Was als Arbeitsstunde zählt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The output-per-hour card", "Karta e prodhimit për orë", "Die Karte zur Leistung je Stunde") },
  ],
  sources: ["prod-oecd-2025", "prod-ilo-2008", "prod-destatis-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Output per hour is quoted for countries, sectors and sites, often as proof that people work hard or do not. It measures neither effort nor how busy anyone looked. This issue asks what the number divides by what, and how a site can make it honestly.",
        "Prodhimi për orë citohet për vende, sektorë dhe vende pune, shpesh si provë se njerëzit punojnë shumë ose jo. Nuk mat as mundin, as sa i zënë dukej dikush. Ky numër pyet çfarë pjesëton kjo shifër me çfarë, dhe si mund ta bëjë një vend pune me ndershmëri.",
        "Leistung je Stunde wird für Länder, Branchen und Standorte zitiert, oft als Beweis, dass Menschen viel arbeiten oder nicht. Sie misst weder Mühe noch, wie beschäftigt jemand wirkte. Diese Ausgabe fragt, was die Zahl wodurch teilt und wie ein Standort sie ehrlich bildet."),
      body: x(
        "For the OECD, labour productivity is GDP divided by hours actually worked, not hours paid or contracted. In 2023 the OECD average was about USD 70 an hour; Germany, with the fewest hours per worker, produced 94. The ILO counts waiting at a broken machine as hours worked, and notes that working time does not reflect the intensity of work. In Germany output per person and per hour moved differently in each year from 2022 to 2025. A way to count a site's hours and a card close the issue.",
        "Për OECD-në, produktiviteti i punës është PBB-ja e pjesëtuar me orët e punuara vërtet, jo me orët e paguara ose të kontraktuara. Më 2023 mesatarja e OECD-së ishte rreth 70 dollarë në orë; Gjermania, me më pak orë për të punësuar, prodhoi 94. ILO e numëron pritjen para një makine të prishur si orë pune, dhe shënon se koha e punës nuk pasqyron intensitetin e punës. Në Gjermani, prodhimi për person dhe për orë lëvizën ndryshe në çdo vit nga 2022 deri 2025. Një mënyrë për të numëruar orët e një vendi pune dhe një kartë e mbyllin numrin.",
        "Für die OECD ist Arbeitsproduktivität das BIP geteilt durch die tatsächlich gearbeiteten Stunden, nicht durch bezahlte oder vereinbarte. 2023 lag der OECD-Schnitt bei rund 70 US-Dollar je Stunde; Deutschland, mit den wenigsten Stunden je Erwerbstätigen, kam auf 94. Die ILO zählt Warten an einer defekten Maschine als Arbeitszeit und hält fest, dass Arbeitszeit die Intensität der Arbeit nicht abbildet. In Deutschland entwickelten sich die Leistung je Person und je Stunde von 2022 bis 2025 in jedem Jahr anders. Ein Weg, die Stunden eines Standorts zu zählen, und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A fraction", "Një thyesë", "Ein Bruch"), x("with two lines", "me dy vija", "mit zwei Linien")],
      lead: x(
        "The OECD calls labour productivity the most frequently computed productivity indicator: the volume of output per unit of labour input. In its Compendium the output is GDP and the labour input is hours worked, or the number employed where hours are not known.",
        "OECD-ja e quan produktivitetin e punës treguesin e produktivitetit që llogaritet më shpesh: vëllimi i prodhimit për njësi të punës së përdorur. Në Përmbledhjen e saj prodhimi është PBB-ja dhe puna e përdorur janë orët e punuara, ose numri i të punësuarve kur orët nuk dihen.",
        "Die OECD nennt die Arbeitsproduktivität den am häufigsten berechneten Produktivitätsindikator: das Produktionsvolumen je Einheit Arbeitseinsatz. In ihrem Kompendium ist die Leistung das BIP und der Arbeitseinsatz die gearbeiteten Stunden, oder die Zahl der Erwerbstätigen, wo die Stunden unbekannt sind."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Above the line: output", "Sipër vijës: prodhimi", "Über dem Strich: Leistung"), items: [
            x("Value added: production minus what was bought in to make it", "Vlera e shtuar: prodhimi minus ajo që u ble për ta bërë", "Wertschöpfung: Produktion minus zugekaufte Vorleistungen"),
            x("In volume, without the effect of prices", "Në vëllim, pa efektin e çmimeve", "Als Volumen, ohne Preiseffekt"),
            x("Across countries, converted at purchasing power parities", "Mes vendeve, e kthyer me paritetet e fuqisë blerëse", "Zwischen Ländern zu Kaufkraftparitäten umgerechnet"),
          ] },
          { h: x("Below the line: labour", "Poshtë vijës: puna", "Unter dem Strich: Arbeit"), accent: true, items: [
            x("Hours actually worked, paid or not", "Orët e punuara vërtet, të paguara ose jo", "Tatsächlich gearbeitete Stunden, bezahlt oder nicht"),
            x("Not hours paid, contracted or usual", "Jo orët e paguara, të kontraktuara ose të zakonshme", "Nicht bezahlte, vereinbarte oder übliche Stunden"),
            x("Each hour the same: skills and experience are not counted", "Çdo orë njësoj: aftësitë dhe përvoja nuk numërohen", "Jede Stunde gleich: Können und Erfahrung zählen nicht"),
          ] },
        ] },
        { type: "p", text: x(
          "Leave, public holidays, sickness and strikes are taken out of the hours. Where the number employed stands in for hours, part-time work and shorter working weeks make countries and years hard to compare.",
          "Pushimet, festat zyrtare, sëmundjet dhe grevat hiqen nga orët. Kur numri i të punësuarve zë vendin e orëve, puna me kohë të pjesshme dhe javët më të shkurtra e bëjnë të vështirë krahasimin mes vendeve dhe viteve.",
          "Urlaub, Feiertage, Krankheit und Streiks werden aus den Stunden herausgerechnet. Wo die Zahl der Erwerbstätigen die Stunden ersetzt, erschweren Teilzeit und kürzere Arbeitswochen den Vergleich zwischen Ländern und Jahren.") },
        { type: "callout", reading: true, text: x(
          "The number moves when output changes, and also when the hours do. Read both lines before reading the ratio.",
          "Shifra lëviz kur ndryshon prodhimi, por edhe kur ndryshojnë orët. Lexo të dyja vijat para se të lexosh raportin.",
          "Die Zahl bewegt sich, wenn sich die Leistung ändert, und auch, wenn sich die Stunden ändern. Lesen Sie beide Linien, bevor Sie den Quotienten lesen.") },
      ],
      note: x(
        "Definitions as the OECD Compendium of Productivity Indicators 2025 gives them, chapter 4. The OECD notes that hours worked ignore the quality of the workforce and so likely understate labour's effective contribution.",
        "Përkufizimet siç i jep OECD Compendium of Productivity Indicators 2025, kapitulli 4. OECD-ja shënon se orët e punuara nuk e marrin parasysh cilësinë e fuqisë punëtore, prandaj ka të ngjarë ta nënvlerësojnë kontributin e vërtetë të punës.",
        "Begriffe, wie das OECD Compendium of Productivity Indicators 2025 sie in Kapitel 4 bestimmt. Die OECD merkt an, dass gearbeitete Stunden die Qualität der Arbeitskräfte nicht erfassen und den Beitrag der Arbeit daher wohl unterschätzen."),
      source: ["prod-oecd-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Fewer hours,", "Më pak orë,", "Weniger Stunden,"), x("more per hour", "më shumë për orë", "mehr je Stunde")],
      lead: x(
        "In 2023 an average hour worked in the OECD produced about USD 70 of GDP, at purchasing power parities. The economies where each worker puts in the most hours are not those that produce most in each hour.",
        "Më 2023, një orë pune mesatare në OECD prodhoi rreth 70 dollarë PBB, me paritetet e fuqisë blerëse. Ekonomitë ku çdo i punësuar punon më shumë orë nuk janë ato që prodhojnë më shumë në çdo orë.",
        "2023 erzeugte eine durchschnittliche Arbeitsstunde in der OECD rund 70 US-Dollar BIP, zu Kaufkraftparitäten. Die Volkswirtschaften, in denen jeder Erwerbstätige die meisten Stunden leistet, sind nicht die, die je Stunde am meisten erzeugen."),
      blocks: [
        { type: "hbars", max: 160, source: ["prod-oecd-2025"],
          label: x("GDP per hour worked, USD at current PPPs, 2023", "PBB për orë pune, dollarë me PPP aktuale, 2023", "BIP je Arbeitsstunde, US-Dollar zu aktuellen KKP, 2023"),
          items: [
            { k: x("Ireland", "Irlanda", "Irland"), v: 151, n: x("151", "151", "151") },
            { k: x("United States", "SHBA", "USA"), v: 97, n: x("97", "97", "97") },
            { k: x("Germany", "Gjermania", "Deutschland"), v: 94, n: x("94", "94", "94"), alert: true },
            { k: x("OECD average", "Mesatarja e OECD-së", "OECD-Schnitt"), v: 71, n: x("71", "71", "71") },
            { k: x("Japan", "Japonia", "Japan"), v: 56, n: x("56", "56", "56") },
            { k: x("Mexico", "Meksika", "Mexiko"), v: 25, n: x("25", "25", "25") },
          ] },
        { type: "p", text: x(
          "Hours per worker in 2023: Mexico 2,207, the United States 1,751, Japan 1,611, Germany 1,335. Multiplied out, a US worker produced about 170,000 dollars a year and a German one about 125,000: per person a third apart, per hour 97 against 94.",
          "Orët për të punësuar më 2023: Meksika 2.207, SHBA 1.751, Japonia 1.611, Gjermania 1.335. Të shumëzuara, një i punësuar amerikan prodhoi rreth 170.000 dollarë në vit dhe një gjerman rreth 125.000: për person një e treta diferencë, për orë 97 kundrejt 94.",
          "Stunden je Erwerbstätigen 2023: Mexiko 2.207, USA 1.751, Japan 1.611, Deutschland 1.335. Ausmultipliziert erzeugte ein US-Erwerbstätiger rund 170.000 Dollar im Jahr, ein deutscher rund 125.000: je Person ein Drittel Abstand, je Stunde 97 gegen 94.") },
        { type: "callout", reading: true, text: x(
          "Ireland's lead sits partly in the numerator: output of multinationals recorded there. For such cases the OECD finds income-based measures more accurate.",
          "Përparësia e Irlandës qëndron pjesërisht te numëruesi: prodhim i shumëkombëshave i regjistruar atje. Për raste të tilla OECD-ja i gjen më të sakta matjet sipas të ardhurave.",
          "Irlands Vorsprung liegt zum Teil im Zähler: dort verbuchte Leistung multinationaler Konzerne. Für solche Fälle hält die OECD einkommensbasierte Maße für genauer.") },
      ],
      note: x(
        "OECD Productivity Database, from the data files of the Compendium's Figures 4.5 and 4.6, rounded; the OECD average is 70.5. Output per worker is the editors' product of the two OECD figures. Hours for some countries are OECD estimates.",
        "OECD Productivity Database, nga skedarët e të dhënave të figurave 4.5 dhe 4.6 të Përmbledhjes, të rrumbullakuara; mesatarja e OECD-së është 70,5. Prodhimi për të punësuar është prodhimi i dy shifrave të OECD-së, i llogaritur nga redaksia. Orët e disa vendeve janë vlerësime të OECD-së.",
        "OECD Productivity Database, aus den Datendateien der Abbildungen 4.5 und 4.6 des Kompendiums, gerundet; der OECD-Schnitt beträgt 70,5. Die Leistung je Erwerbstätigen ist das von der Redaktion berechnete Produkt beider OECD-Werte. Die Stunden einiger Länder sind OECD-Schätzungen."),
      source: ["prod-oecd-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What counts as", "Çfarë numërohet", "Was als Arbeits-"), x("an hour worked", "si orë pune", "stunde zählt")],
      lead: x(
        "In 2008 the International Conference of Labour Statisticians set out what goes into hours actually worked, the figure productivity divides by. It is the time spent in a job on activities that contribute to producing goods or services.",
        "Më 2008, Konferenca Ndërkombëtare e Statisticienëve të Punës përcaktoi çfarë hyn te orët e punuara vërtet, shifra me të cilën pjesëtohet produktiviteti. Ato janë koha e kaluar në një punë me veprimtari që kontribuojnë në prodhimin e mallrave ose shërbimeve.",
        "2008 legte die Internationale Konferenz der Arbeitsstatistiker fest, was in die tatsächlich gearbeiteten Stunden eingeht, durch die die Produktivität geteilt wird: die Zeit in einer Tätigkeit, die zur Herstellung von Waren oder Dienstleistungen beiträgt."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Counted as worked", "Numërohen si të punuara", "Zählt als gearbeitet"), accent: true, items: [
            x("Direct hours: the tasks of the job", "Orët e drejtpërdrejta: detyrat e punës", "Direkte Stunden: die Aufgaben der Tätigkeit"),
            x("Related hours: cleaning, preparing tools, changing clothes, required training", "Orët e lidhura: pastrimi, përgatitja e veglave, ndërrimi i rrobave, trajnimi i detyrueshëm", "Zugehörige Stunden: Reinigen, Werkzeug vorbereiten, Umkleiden, nötige Schulung"),
            x("Down time: a breakdown, no supplies, no power, still available", "Koha e ndalur: prishje, mungesë materiali, pa rrymë, por gati për punë", "Ausfallzeit: Störung, kein Material, kein Strom, aber verfügbar"),
            x("Short rest: a tea or coffee break", "Pushimi i shkurtër: një pushim për çaj ose kafe", "Kurze Pausen: Tee- oder Kaffeepause"),
          ] },
          { h: x("Not counted", "Nuk numërohen", "Zählt nicht"), items: [
            x("Annual leave, public holidays, sick leave", "Pushimi vjetor, festat zyrtare, leja mjekësore", "Urlaub, Feiertage, Krankheit"),
            x("Commuting between home and work", "Rruga mes shtëpisë dhe punës", "Arbeitsweg"),
            x("Longer meal breaks, even when paid", "Pushimet më të gjata për ngrënie, edhe kur paguhen", "Längere Essenspausen, auch wenn bezahlt"),
          ] },
        ] },
        { type: "p", text: x(
          "The resolution adds one sentence that matters for any manager reading the ratio: working time “does not reflect the quality, intensity or efficiency of work”.",
          "Rezoluta shton një fjali që ka rëndësi për çdo menaxher që lexon raportin: koha e punës “nuk pasqyron cilësinë, intensitetin ose efikasitetin e punës”.",
          "Die Entschließung fügt einen Satz hinzu, der für jede Führungskraft zählt, die den Quotienten liest: Arbeitszeit spiegle „nicht die Qualität, Intensität oder Effizienz der Arbeit“.") },
        { type: "callout", reading: true, text: x(
          "An hour standing at a stopped machine weighs as much below the line as a hard-working one. Busy is not in the formula; waiting lowers the result.",
          "Një orë në këmbë para një makine të ndalur peshon poshtë vijës sa një orë pune e rëndë. “I zënë” nuk është në formulë; pritja e ul rezultatin.",
          "Eine Stunde an einer stehenden Maschine wiegt unter dem Strich so viel wie eine harte Arbeitsstunde. „Beschäftigt“ steht nicht in der Formel; Warten senkt das Ergebnis.") },
      ],
      note: x(
        "ILO, Resolution concerning the measurement of working time (2008), paragraphs 9 and 11, for work within the national accounts' production boundary; the lists are shortened by the editors.",
        "ILO, Rezoluta për matjen e kohës së punës (2008), paragrafët 9 dhe 11, për punën brenda kufirit të prodhimit të llogarive kombëtare; listat janë shkurtuar nga redaksia.",
        "ILO, Entschließung zur Messung der Arbeitszeit (2008), Absätze 9 und 11, für Arbeit innerhalb der Produktionsgrenze der Volkswirtschaftlichen Gesamtrechnungen; die Listen hat die Redaktion gekürzt."),
      source: ["prod-ilo-2008"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("One economy,", "Një ekonomi,", "Eine Volkswirtschaft,"), x("two denominators", "dy emërues", "zwei Nenner")],
      lead: x(
        "Destatis publishes German output both per person employed and per hour worked, each price-adjusted. In 2025, 46.0 million people worked in Germany, about as many as a year before. The two measures did not agree once from 2022 to 2025.",
        "Destatis e boton prodhimin e Gjermanisë si për person të punësuar ashtu edhe për orë pune, secilin pa efektin e çmimeve. Më 2025 në Gjermani punonin 46,0 milionë njerëz, pothuajse sa një vit më parë. Nga 2022 deri 2025, dy matjet nuk u përputhën asnjëherë.",
        "Destatis veröffentlicht die deutsche Leistung je Erwerbstätigen und je Erwerbstätigenstunde, jeweils preisbereinigt. 2025 waren in Deutschland 46,0 Millionen Menschen erwerbstätig, etwa so viele wie im Vorjahr. Von 2022 bis 2025 stimmten die beiden Maße kein einziges Mal überein."),
      blocks: [
        { type: "dumbbell", from: x("Per person", "Për person", "Je Erwerbstätigen"), to: x("Per hour", "Për orë", "Je Stunde"), min: -2, max: 1, rowH: 26, source: ["prod-destatis-2026"],
          label: x("Price-adjusted GDP, change on the year before, Germany", "PBB pa efektin e çmimeve, ndryshimi nga viti i kaluar, Gjermania", "Preisbereinigtes BIP, Veränderung zum Vorjahr, Deutschland"),
          rows: [
            { k: "2022", a: 0.5, an: ch("+0.5"), b: 0.3, bn: ch("+0.3") },
            { k: "2023", a: -1.5, an: ch("−1.5"), b: -1.2, bn: ch("−1.2"), alert: true },
            { k: "2024", a: -0.6, an: ch("−0.6"), b: -0.3, bn: ch("−0.3") },
            { k: "2025", a: 0.2, an: ch("+0.2"), b: 0.4, bn: ch("+0.4") },
          ] },
        { type: "p", text: x(
          "Countries count hours in two ways, the OECD explains: by asking workers in surveys, or by starting from paid or contractual hours and adjusting for absence and overtime. Self-reported hours tend to come out higher, so levels compare less well across countries than growth does.",
          "Vendet i numërojnë orët në dy mënyra, shpjegon OECD-ja: duke pyetur të punësuarit në anketa, ose duke nisur nga orët e paguara ose të kontraktuara dhe duke i korrigjuar për mungesat dhe orët shtesë. Orët e vetëdeklaruara priren të dalin më të larta, ndaj nivelet krahasohen më keq mes vendeve se rritja.",
          "Länder zählen Stunden auf zwei Wegen, erklärt die OECD: durch Befragung der Erwerbstätigen oder ausgehend von bezahlten oder vereinbarten Stunden, bereinigt um Abwesenheit und Überstunden. Selbst angegebene Stunden fallen eher höher aus, deshalb lassen sich Niveaus zwischen Ländern schlechter vergleichen als Wachstum.") },
        { type: "callout", reading: true, text: x(
          "When hours per person fall, output per person looks worse than output per hour. Ask which denominator a figure uses before you call it a trend.",
          "Kur orët për person bien, prodhimi për person duket më keq se prodhimi për orë. Pyet cilin emërues përdor një shifër para se ta quash prirje.",
          "Wenn die Stunden je Person sinken, sieht die Leistung je Person schlechter aus als die je Stunde. Fragen Sie nach dem Nenner einer Zahl, bevor Sie sie einen Trend nennen.") },
      ],
      note: x(
        "Destatis, first annual results, press release of 15 January 2026; earlier years are revised figures and may change again. The differences are small in absolute terms. Methods of counting hours: OECD Compendium 2025, chapter 4.",
        "Destatis, rezultatet e para vjetore, njoftimi për shtyp i 15 janarit 2026; vitet e mëparshme janë shifra të rishikuara dhe mund të ndryshojnë sërish. Diferencat janë të vogla në vlerë absolute. Mënyrat e numërimit të orëve: OECD Compendium 2025, kapitulli 4.",
        "Destatis, erste Jahresergebnisse, Pressemitteilung vom 15. Januar 2026; frühere Jahre sind revidiert und können sich erneut ändern. Die Unterschiede sind absolut gering. Methoden der Stundenzählung: OECD-Kompendium 2025, Kapitel 4."),
      source: ["prod-destatis-2026", "prod-oecd-2025"],
    },
    {
      id: "measure", more: "what-last-mile-taught-me",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Output per hour", "Prodhimi për orë", "Leistung je Stunde"), x("on a site", "në një vend pune", "am Standort")],
      lead: x(
        "The ILO gives a site the arithmetic for the denominator: hours actually worked are hours paid for, plus unpaid overtime, minus paid absence. Above the line goes what left the site to standard in the same period, counted by the same people.",
        "ILO i jep një vendi pune aritmetikën për emëruesin: orët e punuara vërtet janë orët e paguara, plus orët shtesë të papaguara, minus mungesat e paguara. Sipër vijës shkon ajo që doli nga vendi sipas standardit në të njëjtën periudhë, e numëruar për të njëjtët njerëz.",
        "Die ILO liefert einem Standort die Rechnung für den Nenner: Tatsächlich gearbeitete Stunden sind bezahlte Stunden plus unbezahlte Überstunden minus bezahlte Abwesenheit. Über den Strich gehört, was im selben Zeitraum nach Standard den Standort verließ, für dieselben Menschen gezählt."),
      blocks: [
        { type: "example", label: x("Invented example, one week on a site", "Shembull i sajuar, një javë në një vend pune", "Erfundenes Beispiel, eine Woche an einem Standort"), rows: [
          { k: x("Hours", "Orët", "Stunden"), v: x("1,000 paid + 20 unpaid overtime − 80 paid leave and sickness = 940 worked", "1.000 të paguara + 20 shtesë të papaguara − 80 pushime dhe sëmundje të paguara = 940 të punuara", "1.000 bezahlt + 20 unbezahlte Überstunden − 80 bezahlter Urlaub und Krankheit = 940 gearbeitet") },
          { k: x("Output", "Prodhimi", "Leistung"), v: x("12,000 units to standard: 12.8 per hour worked, 12.0 per hour paid", "12.000 njësi sipas standardit: 12,8 për orë të punuar, 12,0 për orë të paguar", "12.000 Einheiten nach Standard: 12,8 je gearbeitete, 12,0 je bezahlte Stunde") },
        ], text: x("Site and figures are invented by the editors. If 60 of the 940 hours were spent waiting for trucks, they stay below the line.", "Vendi dhe shifrat janë sajuar nga redaksia. Nëse 60 nga 940 orët u kaluan duke pritur kamionët, ato mbeten poshtë vijës.", "Standort und Zahlen sind von der Redaktion erfunden. Wurden 60 der 940 Stunden mit Warten auf Lkw verbracht, bleiben sie unter dem Strich.") },
        { type: "rows", compact: true, items: [
          { h: x("One unit, one definition", "Një njësi, një përkufizim", "Eine Einheit, eine Definition"), p: x("what counts as done, and rework counted once", "çfarë quhet e mbaruar, dhe ripunimi i numëruar një herë", "was als fertig gilt, Nacharbeit nur einmal gezählt") },
          { h: x("Same period, same people", "E njëjta periudhë, të njëjtët njerëz", "Gleicher Zeitraum, gleiche Menschen"), p: x("agency and borrowed staff in the hours if their output is in", "punonjësit e agjencisë dhe të huazuarit te orët, nëse prodhimi i tyre është brenda", "Leih- und ausgeliehenes Personal in den Stunden, wenn ihre Leistung drin ist") },
          { h: x("Down time noted, not removed", "Koha e ndalur e shënuar, jo e hequr", "Ausfallzeit notiert, nicht abgezogen"), p: x("it explains a low week; taking it out hides it", "ajo shpjegon një javë të dobët; heqja e saj e fsheh", "sie erklärt eine schwache Woche; Abziehen versteckt sie") },
        ] },
      ],
      note: x(
        "The formula is the ILO's (2008, paragraph 26); the checks are the editors' proposal. Machine losses are in No. 48 (OEE), the cost of a minute in No. 73, rates per 200,000 hours in No. 87.",
        "Formula është e ILO-s (2008, paragrafi 26); kontrollet janë propozim i redaksisë. Humbjet e makinave janë te Nr. 48 (OEE), kostoja e një minute te Nr. 73, normat për 200.000 orë te Nr. 87.",
        "Die Formel stammt von der ILO (2008, Absatz 26); die Prüfpunkte sind Vorschlag der Redaktion. Maschinenverluste stehen in Nr. 48 (OEE), die Kosten einer Minute in Nr. 73, Quoten je 200.000 Stunden in Nr. 87."),
      source: ["prod-ilo-2008"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The output-per-hour", "Karta e prodhimit", "Die Karte zur Leistung"), x("card", "për orë", "je Stunde")],
      lead: x(
        "One card per process and week, filled from the time records and the output count. The Shift Capacity tool takes the result as a rate in units per productive hour and turns the next forecast volume into heads per shift.",
        "Një kartë për proces dhe javë, e plotësuar nga regjistrat e orëve dhe numërimi i prodhimit. Mjeti Shift Capacity e merr rezultatin si normë në njësi për orë produktive dhe e kthen volumin e parashikuar në njerëz për turn.",
        "Eine Karte je Prozess und Woche, ausgefüllt aus der Zeiterfassung und der Leistungszählung. Das Werkzeug Shift Capacity übernimmt das Ergebnis als Rate in Einheiten je produktive Stunde und macht aus dem nächsten Prognosevolumen Köpfe je Schicht."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and week", "Procesi dhe java", "Prozess und Woche"), hint: x("and who is in it: own staff, agency, borrowed", "dhe kush është brenda: stafi i vet, agjencia, të huazuarit", "und wer dazugehört: eigenes, Leih-, ausgeliehenes Personal") },
          { h: x("Output", "Prodhimi", "Leistung"), hint: x("units done to standard; the definition of done", "njësitë e mbaruara sipas standardit; përkufizimi i “mbaruar”", "Einheiten nach Standard; was als fertig gilt") },
          { h: x("Hours paid", "Orët e paguara", "Bezahlte Stunden"), hint: x("from the time records", "nga regjistrat e orëve", "aus der Zeiterfassung") },
          { h: x("+ unpaid overtime − paid absence", "+ orë shtesë të papaguara − mungesa të paguara", "+ unbezahlte Überstunden − bezahlte Abwesenheit"), hint: x("leave, holidays, sickness out", "pushimet, festat, sëmundjet jashtë", "Urlaub, Feiertage, Krankheit heraus") },
          { h: x("= Hours worked, and output per hour", "= Orët e punuara, dhe prodhimi për orë", "= Gearbeitete Stunden, und Leistung je Stunde"), hint: x("and the same for last week", "dhe e njëjta për javën e kaluar", "und dasselbe für die Vorwoche") },
          { h: x("Down time inside the hours", "Koha e ndalur brenda orëve", "Ausfallzeit in den Stunden"), hint: x("hours and causes: waiting, breakdowns, no material", "orët dhe shkaqet: pritja, prishjet, mungesa e materialit", "Stunden und Ursachen: Warten, Störungen, kein Material") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the ILO's definition of hours worked and the OECD's ratio; the essay linked on page 7 tells why pressure should not turn into people trying to look busy.",
        "Karta është propozim i redaksisë, e ndërtuar mbi përkufizimin e ILO-s për orët e punuara dhe raportin e OECD-së; eseja e lidhur në faqen 7 tregon pse presioni nuk duhet të kthehet në njerëz që përpiqen të duken të zënë.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die ILO-Definition gearbeiteter Stunden und den Quotienten der OECD; der auf Seite 7 verlinkte Essay erzählt, warum Druck nicht zu Menschen führen soll, die beschäftigt wirken wollen."),
      source: ["prod-ilo-2008", "prod-oecd-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
