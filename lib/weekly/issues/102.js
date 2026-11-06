// Management Review, No. 102: Overtime, the number that borrows from tomorrow: how overtime is counted, how much there
// is in Germany, and what long days and weeks do to safety. Block: KPI. Facts and their sources:
// docs/revista/management-review-nr-102.md. Read in full: the IAB's time series of working time and its components
// (Stand August 2026) with the IAB's FAQ on its working-time accounts and its report on overtime of 2014; Destatis's
// indicator on very long working hours (July 2026); §§ 3, 5 and 16 of the Arbeitszeitgesetz; Matre et al. (2021,
// SJWEH) and Pega et al. (2021, Environment International), both at Europe PMC. Dembe et al. (2005) could not be
// opened in full and is not used. Shift and night work are No. 45, injury rates No. 87, hours awake No. 89, output per
// hour and the ILO's hours No. 98: not repeated.
import { x, pc } from "../common.js";

// "13.1" in English, "13,1" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));
// A share with one decimal: "7.1%", "7,1%", "7,1 %".
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 102,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Overtime:", "Orët shtesë:", "Überstunden:"), x("the number that borrows from tomorrow", "shifra që merr hua nga e nesërmja", "die Zahl, die von morgen borgt")],
  sub: x(
    "Three kinds of overtime and why only two lengthen the year, how much is worked in Germany, who works it unpaid, what long days and weeks do to safety, and a weekly overtime card.",
    "Tri llojet e orëve shtesë dhe pse vetëm dy e zgjatin vitin, sa punohet në Gjermani, kush i punon pa pagesë, çfarë u bëjnë sigurisë ditët dhe javët e gjata, dhe një kartë javore e orëve shtesë.",
    "Drei Arten von Überstunden und warum nur zwei das Jahr verlängern, wie viel in Deutschland geleistet wird, wer sie unbezahlt leistet, was lange Tage und Wochen für die Sicherheit bedeuten, und eine wöchentliche Überstundenkarte."),
  seo: x(
    "Overtime as a KPI: paid, unpaid and banked hours in the IAB's figures, long hours and safety in a meta-analysis, the German law, and a weekly card.",
    "Orët shtesë si KPI: të paguara, të papaguara dhe në llogari sipas IAB-së, orët e gjata dhe siguria, ligji gjerman dhe një kartë javore.",
    "Überstunden als Kennzahl: bezahlt, unbezahlt und auf dem Konto laut IAB, lange Arbeitszeiten und Sicherheit, das Arbeitszeitgesetz und eine Wochenkarte."),
  feature: x(
    "Overtime is the cheapest way to cover a gap this week, and so it often becomes the plan. Issue 102 shows how the IAB counts it: paid, unpaid, and hours banked on a time account. In 2025 each employee in Germany worked 13.1 paid and 17.8 unpaid overtime hours on average. It then reads what a meta-analysis found about long days and weeks and safety incidents, what the law asks a site to record, and ends with a weekly overtime card.",
    "Orët shtesë janë mënyra më e lirë për të mbuluar një boshllëk këtë javë, prandaj shpesh bëhen vetë plani. Numri 102 tregon si i numëron IAB: të paguara, të papaguara dhe orë të depozituara në një llogari kohe. Më 2025 çdo punonjës në Gjermani punoi mesatarisht 13,1 orë shtesë të paguara dhe 17,8 të papaguara. Pastaj lexon çfarë gjeti një meta-analizë për ditët dhe javët e gjata dhe incidentet e sigurisë, çfarë kërkon ligji të regjistrohet, dhe mbyllet me një kartë javore të orëve shtesë.",
    "Überstunden sind der billigste Weg, eine Lücke in dieser Woche zu schließen, und werden deshalb oft zum Plan. Ausgabe 102 zeigt, wie das IAB sie zählt: bezahlt, unbezahlt und als Guthaben auf einem Arbeitszeitkonto. 2025 leistete jeder Arbeitnehmer in Deutschland im Schnitt 13,1 bezahlte und 17,8 unbezahlte Überstunden. Dann liest sie, was eine Metaanalyse zu langen Tagen, langen Wochen und Sicherheitsvorfällen fand, was das Gesetz aufzuzeichnen verlangt, und endet mit einer wöchentlichen Überstundenkarte."),
  figure: { n: x("17.8 h", "17,8 orë", "17,8 Std."), by: "IAB, 2026", t: x(
    "of unpaid overtime per employee in Germany in 2025, more than the 13.1 hours that were paid.",
    "orë shtesë të papaguara për punonjës në Gjermani më 2025, më shumë se 13,1 orët që u paguan.",
    "unbezahlte Überstunden je Arbeitnehmer in Deutschland 2025, mehr als die 13,1 bezahlten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Three kinds of overtime", "Tri llojet e orëve shtesë", "Drei Arten von Überstunden") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("When the long day costs", "Kur dita e gjatë kushton", "Wann der lange Tag kostet") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The weekly overtime card", "Karta javore e orëve shtesë", "Die wöchentliche Überstundenkarte") },
  ],
  sources: ["overtime-iab-azr-2026", "overtime-iab-2014", "overtime-destatis-2026", "overtime-matre-2021", "overtime-pega-2021", "overtime-arbzg"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "When someone is off sick or the volume rises, the quickest answer is to ask the team to stay longer. It works this week. If it becomes the plan, the hours are borrowed from the people's rest, from next month and from the safety margin. This issue treats overtime as a number to be read, not only paid.",
        "Kur dikush mungon nga sëmundja ose vëllimi rritet, përgjigjja më e shpejtë është t'i kërkosh ekipit të qëndrojë më gjatë. Funksionon këtë javë. Nëse bëhet plan, orët merren hua nga pushimi i njerëzve, nga muaji tjetër dhe nga marzhi i sigurisë. Ky numër i trajton orët shtesë si një shifër që lexohet, jo vetëm që paguhet.",
        "Wenn jemand krank ist oder das Volumen steigt, ist die schnellste Antwort, das Team länger bleiben zu lassen. Diese Woche funktioniert das. Wird es zum Plan, sind die Stunden geborgt: von der Erholung der Menschen, vom nächsten Monat und vom Sicherheitspuffer. Diese Ausgabe behandelt Überstunden als Zahl, die man liest, nicht nur bezahlt."),
      body: x(
        "The IAB counts paid and unpaid overtime, which lengthen working time, and hours banked on time accounts, which only move it. Paid overtime per employee fell from 46.3 hours in 1991 to 13.1 in 2025; unpaid, at 17.8, has been higher every year since 2002. Managers work the most unpaid hours. A meta-analysis links days over 12 hours with more safety incidents, but found little for overtime as such. A weekly card closes the issue.",
        "IAB numëron orët shtesë të paguara dhe të papaguara, që e zgjatin kohën e punës, dhe orët e depozituara në llogari kohe, që vetëm e zhvendosin. Orët e paguara për punonjës ranë nga 46,3 më 1991 në 13,1 më 2025; të papaguarat, me 17,8, kanë qenë më të larta çdo vit që nga 2002. Drejtuesit punojnë më shumë orë pa pagesë. Një meta-analizë i lidh ditët mbi 12 orë me më shumë incidente sigurie, por gjeti pak për orët shtesë si të tilla. Një kartë javore e mbyll numrin.",
        "Das IAB zählt bezahlte und unbezahlte Überstunden, die die Arbeitszeit verlängern, und Stunden auf Arbeitszeitkonten, die sie nur verschieben. Bezahlte Überstunden je Arbeitnehmer sanken von 46,3 Stunden 1991 auf 13,1 im Jahr 2025; unbezahlte liegen mit 17,8 seit 2002 jedes Jahr höher. Führungskräfte leisten die meisten unbezahlten Stunden. Eine Metaanalyse verbindet Tage über 12 Stunden mit mehr Sicherheitsvorfällen, fand aber wenig für Überstunden als solche. Eine Wochenkarte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Three kinds", "Tri llojet", "Drei Arten"), x("of overtime", "e orëve shtesë", "von Überstunden")],
      lead: x(
        "The IAB's working-time accounts, which feed Germany's national accounts, separate overtime by what happens to it afterwards. Two kinds really lengthen the year. The third only moves hours from one week to another, through a time account.",
        "Llogaritja e kohës së punës e IAB-së, mbi të cilën mbështeten llogaritë kombëtare të Gjermanisë, i ndan orët shtesë sipas asaj që ndodh me to më pas. Dy lloje e zgjatin vërtet vitin. I treti vetëm i zhvendos orët nga një javë në tjetrën, përmes një llogarie kohe.",
        "Die Arbeitszeitrechnung des IAB, die in die Volkswirtschaftlichen Gesamtrechnungen eingeht, trennt Überstunden danach, was später mit ihnen geschieht. Zwei Arten verlängern das Jahr wirklich. Die dritte verschiebt Stunden nur von einer Woche in eine andere, über ein Arbeitszeitkonto."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Paid", "Të paguara", "Bezahlt"), p: x("Compensated in money, sometimes with a premium. Lengthens working time.", "Kompensohen me para, ndonjëherë me shtesë. E zgjatin kohën e punës.", "In Geld abgegolten, teils mit Zuschlag. Verlängern die Arbeitszeit.") },
          { h: x("Unpaid", "Të papaguara", "Unbezahlt"), p: x("Neither money nor time off later. Lengthens working time.", "As para, as kohë e lirë më vonë. E zgjatin kohën e punës.", "Weder Geld noch später Freizeit. Verlängern die Arbeitszeit.") },
          { h: x("Banked", "Në llogari", "Auf dem Konto"), p: x("Taken back as time off later. Moves hours, does not add them.", "Merren prapë si kohë e lirë më vonë. I zhvendos orët, nuk i shton.", "Später als Freizeit ausgeglichen. Verschiebt Stunden, fügt keine hinzu.") },
        ] },
        { type: "p", text: x(
          "In the IAB's analysis of the household panel for 2012, banked hours came to 4.3 a month per employee, about as many as paid and unpaid together (4.4). The IAB sees the long fall of paid overtime mainly in the spread of such accounts.",
          "Në analizën e IAB-së të panelit të familjeve për 2012, orët në llogari arritën 4,3 në muaj për punonjës, afërsisht sa të paguarat dhe të papaguarat bashkë (4,4). IAB e sheh rënien e gjatë të orëve të paguara kryesisht te përhapja e këtyre llogarive.",
          "In der IAB-Auswertung des Sozio-oekonomischen Panels für 2012 kamen Kontostunden auf 4,3 im Monat je Beschäftigten, etwa so viel wie bezahlte und unbezahlte zusammen (4,4). Den langen Rückgang bezahlter Überstunden führt das IAB vor allem auf die Verbreitung solcher Konten zurück.") },
        { type: "callout", reading: true, text: x(
          "Payroll shows only the first kind. The second is invisible there, and the third is a debt the site owes its people.",
          "Lista e pagave tregon vetëm llojin e parë. I dyti nuk shihet aty, dhe i treti është një borxh që vendi i punës ua ka njerëzve.",
          "Die Lohnabrechnung zeigt nur die erste Art. Die zweite ist dort unsichtbar, und die dritte ist eine Schuld des Betriebs bei seinen Leuten.") },
      ],
      note: x(
        "IAB, FAQ on the working-time accounts (2026), and Weber, Wanger, Weigand and Zapf (IAB, 2014), Socio-Economic Panel 2012, hours per employee and month. The IAB calls the first two definitive, the third transitory overtime.",
        "IAB, pyetjet e shpeshta për llogaritjen e kohës së punës (2026), dhe Weber, Wanger, Weigand dhe Zapf (IAB, 2014), Paneli Socio-Ekonomik 2012, orë për punonjës në muaj. IAB-ja i quan dy të parat orë shtesë definitive, të tretën tranzitore.",
        "IAB, FAQ zur Arbeitszeitrechnung (2026), und Weber, Wanger, Weigand und Zapf (IAB, 2014), Sozio-oekonomisches Panel 2012, Stunden je Beschäftigten und Monat. Das IAB nennt die ersten beiden definitive, die dritte transitorische Überstunden."),
      source: ["overtime-iab-azr-2026", "overtime-iab-2014"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Overtime in Germany,", "Orët shtesë në Gjermani,", "Überstunden in Deutschland,"), x("1991 and 2025", "1991 dhe 2025", "1991 und 2025")],
      lead: x(
        "The IAB spreads the overtime worked over all 42.2 million employees, part-timers and those who never stay late included. In 2025 that made 13.1 paid and 17.8 unpaid hours each: about 553 million paid and 753 million unpaid hours in the year.",
        "IAB i shpërndan orët shtesë të punuara mbi të gjithë 42,2 milionë punonjësit, përfshirë ata me kohë të pjesshme dhe ata që nuk qëndrojnë kurrë më gjatë. Më 2025 kjo dha 13,1 orë të paguara dhe 17,8 të papaguara për secilin: rreth 553 milionë orë të paguara dhe 753 milionë të papaguara në vit.",
        "Das IAB verteilt die geleisteten Überstunden auf alle 42,2 Millionen Arbeitnehmer, Teilzeitkräfte und jene, die nie länger bleiben, eingeschlossen. 2025 ergab das je 13,1 bezahlte und 17,8 unbezahlte Stunden: rund 553 Millionen bezahlte und 753 Millionen unbezahlte Stunden im Jahr."),
      blocks: [
        { type: "dumbbell", from: "1991", to: "2025", min: 0, max: 50, rowH: 28, source: ["overtime-iab-azr-2026"],
          label: x("Overtime hours per employee and year, Germany (IAB, 2026)", "Orë shtesë për punonjës në vit, Gjermani (IAB, 2026)", "Überstunden je Arbeitnehmer und Jahr, Deutschland (IAB, 2026)"),
          rows: [
            { k: x("Paid", "Të paguara", "Bezahlt"), a: 46.3, an: dec("46.3"), b: 13.1, bn: dec("13.1") },
            { k: x("Unpaid", "Të papaguara", "Unbezahlt"), a: 25.9, an: dec("25.9"), b: 17.8, bn: dec("17.8"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pcd("2.4"), t: x("of all hours employees worked in 2025 were paid or unpaid overtime", "e të gjitha orëve që punuan punonjësit më 2025 ishin orë shtesë të paguara ose jo", "aller Arbeitsstunden der Arbeitnehmer 2025 waren bezahlte oder unbezahlte Überstunden") },
          { n: x("−1.4 h", "−1,4 orë", "−1,4 Std."), t: x("change in time-account balances per employee in 2025: more taken off than banked", "ndryshimi i bilancit të llogarive të kohës për punonjës më 2025: më shumë u mor se u depozitua", "Veränderung der Kontensalden je Arbeitnehmer 2025: mehr abgebaut als aufgebaut") },
        ] },
        { type: "callout", reading: true, text: x(
          "An average spread over everyone hides the shape. On a real site a few people carry most of the hours.",
          "Një mesatare e shpërndarë mbi të gjithë e fsheh formën. Në një vend pune të vërtetë, pak njerëz mbajnë shumicën e orëve.",
          "Ein Durchschnitt über alle verdeckt die Form. In einem echten Betrieb tragen wenige Menschen die meisten Stunden.") },
      ],
      note: x(
        "IAB, Arbeitszeitrechnung, time series as of August 2026, annual figures; mainly from household surveys, modelled, revised each summer. Unpaid hours peaked at 35.1 in 2007. The 2.4% is the editors' sum: 1,306 million of 53,624 million hours.",
        "IAB, Arbeitszeitrechnung, seria kohore sipas gjendjes së gushtit 2026, shifra vjetore; kryesisht nga anketat e familjeve, të modeluara, të rishikuara çdo verë. Orët e papaguara arritën kulmin 35,1 më 2007. 2,4% është shuma e redaksisë: 1.306 milionë nga 53.624 milionë orë.",
        "IAB-Arbeitszeitrechnung, Zeitreihe Stand August 2026, Jahreswerte; vor allem aus Haushaltsbefragungen, modelliert, jeden Sommer revidiert. Unbezahlte Stunden erreichten 2007 mit 35,1 ihren Höchstwert. Die 2,4 % sind die Summe der Redaktion: 1.306 von 53.624 Millionen Stunden."),
      source: ["overtime-iab-azr-2026"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Who works", "Kush i punon", "Wer welche"), x("which overtime", "cilat orë shtesë", "Überstunden leistet")],
      lead: x(
        "Paid overtime belongs to the shop floor, unpaid overtime to the office and the manager's desk. The higher the position, the more of the extra hours go unpaid.",
        "Orët e paguara i përkasin repartit, të papaguarat zyrës dhe tavolinës së menaxherit. Sa më e lartë pozita, aq më shumë nga orët shtesë mbeten pa pagesë.",
        "Bezahlte Überstunden gehören in die Werkhalle, unbezahlte ins Büro und an den Schreibtisch der Führungskraft. Je höher die Stellung, desto mehr der zusätzlichen Stunden bleiben unbezahlt."),
      blocks: [
        { type: "pairs", from: x("Paid", "Të paguara", "Bezahlt"), to: x("Unpaid", "Të papaguara", "Unbezahlt"), max: 15, source: ["overtime-iab-2014"],
          label: x("Overtime hours per employee and month by position, Germany, 2012 (IAB, 2014)", "Orë shtesë për punonjës në muaj sipas pozitës, Gjermani, 2012 (IAB, 2014)", "Überstunden je Beschäftigten und Monat nach Stellung, Deutschland, 2012 (IAB, 2014)"),
          rows: [
            { k: x("Skilled workers", "Punëtorë të kualifikuar", "Facharbeiter"), a: 4.4, an: dec("4.4"), b: 0.5, bn: dec("0.5") },
            { k: x("Qualified office work", "Punë zyre e kualifikuar", "Qualifizierte Angestellte"), a: 1.4, an: dec("1.4"), b: 1.6, bn: dec("1.6") },
            { k: x("Highly qualified, leading", "Shumë të kualifikuar, drejtues", "Hochqualifiziert, leitend"), a: 2.3, an: dec("2.3"), b: 7.3, bn: dec("7.3") },
            { k: x("Broad leadership duties", "Detyra të gjera drejtimi", "Umfassende Führungsaufgaben"), a: 0.4, an: dec("0.4"), b: 14.6, bn: dec("14.6"), alert: true },
          ] },
        { type: "p", text: x(
          "The same holds for very long weeks. In 2025, 7.1% of full-time workers usually worked 49 hours or more, Destatis reports; in leadership positions nearly a quarter, against 6.1% of the others.",
          "E njëjta vlen për javët shumë të gjata. Më 2025, 7,1% e të punësuarve me kohë të plotë punonin zakonisht 49 orë ose më shumë, raporton Destatis; në pozita drejtuese gati një e katërta, kundrejt 6,1% të të tjerëve.",
          "Das gilt auch für sehr lange Wochen. 2025 arbeiteten laut Destatis 7,1 % der Vollzeiterwerbstätigen gewöhnlich 49 Stunden oder mehr; in Führungspositionen knapp ein Viertel, gegenüber 6,1 % der übrigen.") },
        { type: "callout", reading: true, text: x(
          "A manager's own unpaid evening is a signal the team reads. It tells them what a normal week looks like here.",
          "Mbrëmja e papaguar e vetë menaxherit është një sinjal që ekipi e lexon. U tregon si duket këtu një javë normale.",
          "Der unbezahlte Abend der Führungskraft ist ein Signal, das das Team liest. Es zeigt, wie hier eine normale Woche aussieht.") },
      ],
      note: x(
        "IAB (2014), table 2: Socio-Economic Panel 2012, averages over all employees in each group, part-timers included; four of fourteen groups shown. Destatis (2026): labour force survey, self-reported usual hours, full-time only.",
        "IAB (2014), tabela 2: Paneli Socio-Ekonomik 2012, mesatare mbi të gjithë punonjësit e çdo grupi, përfshirë ata me kohë të pjesshme; katër nga katërmbëdhjetë grupe. Destatis (2026): anketa e forcave të punës, orët e zakonshme të deklaruara vetë, vetëm kohë e plotë.",
        "IAB (2014), Tabelle 2: Sozio-oekonomisches Panel 2012, Durchschnitte über alle Beschäftigten der Gruppe, Teilzeit eingeschlossen; vier von vierzehn Gruppen. Destatis (2026): Arbeitskräfteerhebung, selbst angegebene gewöhnliche Stunden, nur Vollzeit."),
      source: ["overtime-iab-2014", "overtime-destatis-2026"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When the long day", "Kur dita e gjatë", "Wann der lange Tag"), x("costs", "kushton", "kostet")],
      lead: x(
        "Dagfinn Matre and colleagues at Norway's National Institute of Occupational Health screened 10,072 studies and kept 22 on long hours and accidents, near misses and injuries. They based their conclusions on the studies with a moderate risk of bias and rated the certainty of each result.",
        "Dagfinn Matre dhe kolegët në Institutin Kombëtar të Shëndetit në Punë të Norvegjisë shqyrtuan 10.072 studime dhe mbajtën 22 për orët e gjata dhe aksidentet, ngjarjet që gati ndodhën dhe lëndimet. Përfundimet i mbështetën te studimet me rrezik mesatar paragjykimi dhe vlerësuan sigurinë e çdo rezultati.",
        "Dagfinn Matre und Kollegen vom norwegischen Nationalen Institut für Arbeitsmedizin sichteten 10.072 Studien und behielten 22 zu langen Arbeitszeiten und Unfällen, Beinahe-Unfällen und Verletzungen. Ihre Schlüsse stützten sie auf die Studien mit mittlerem Verzerrungsrisiko und bewerteten die Vertrauenswürdigkeit jedes Ergebnisses."),
      blocks: [
        { type: "columns", max: 1.4, height: 104, source: ["overtime-matre-2021"],
          label: x("Relative risk of a safety incident, studies with moderate risk of bias (2021)", "Rreziku relativ i një incidenti sigurie, studime me rrezik mesatar paragjykimi (2021)", "Relatives Risiko eines Sicherheitsvorfalls, Studien mit mittlerem Verzerrungsrisiko (2021)"),
          items: [
            { k: x("Day >8 h", "Ditë >8 orë", "Tag >8 Std."), v: 0.93, n: dec("0.93") },
            { k: x("Day ≥12 h", "Ditë ≥12 orë", "Tag ≥12 Std."), v: 1.24, n: dec("1.24"), alert: true },
            { k: x("Overtime", "Orë shtesë", "Überstunden"), v: 1.08, n: dec("1.08") },
            { k: x("Week 49–54 h", "Javë 49–54 orë", "Woche 49–54 Std."), v: 1.02, n: dec("1.02") },
            { k: x("Week >55 h", "Javë >55 orë", "Woche >55 Std."), v: 1.24, n: dec("1.24") },
          ] },
        { type: "p", text: x(
          "Only the 12-hour day was clearly significant; the 55-hour week was significant in all studies but not in the moderate set. Overtime as such rested on one such study with a poor definition, and the review could not confirm a rise after the eighth or ninth hour.",
          "Vetëm dita 12-orëshe ishte qartësisht e rëndësishme; java 55-orëshe ishte e rëndësishme në të gjitha studimet, por jo në grupin me rrezik mesatar. Orët shtesë si të tilla mbështeteshin te një studim i vetëm i tillë me përkufizim të dobët, dhe rishikimi nuk mundi të konfirmonte një rritje pas orës së tetë ose të nëntë.",
          "Nur der 12-Stunden-Tag war klar signifikant; die 55-Stunden-Woche war über alle Studien signifikant, im mittleren Satz aber nicht. Überstunden als solche stützten sich auf eine einzige solche Studie mit unscharfer Definition, und einen Anstieg nach der achten oder neunten Stunde konnte der Review nicht bestätigen.") },
        { type: "callout", reading: true, text: x(
          "“Overtime” is too loose a word for risk. What matters is how long the day and the week become, and for whom.",
          "“Orë shtesë” është fjalë shumë e gjerë për rrezikun. Rëndësi ka sa e gjatë bëhet dita dhe java, dhe për kë.",
          "„Überstunden“ ist ein zu loses Wort für Risiko. Entscheidend ist, wie lang Tag und Woche werden, und für wen.") },
      ],
      note: x(
        "Matre et al. (2021), random-effects meta-analysis; certainty low for all contrasts. 1.0 means no difference; days against ≤8 h, weeks against 35–40 h. 15 of the 22 studies included night work; the studies of errors, by nurses and interns, had a high risk of bias. Night shifts are in No. 45, hours awake in No. 89.",
        "Matre et al. (2021), meta-analizë me efekte të rastësishme; siguria e ulët për të gjitha krahasimet. 1,0 do të thotë pa ndryshim; ditët kundrejt ≤8 orë, javët kundrejt 35–40 orë. 15 nga 22 studimet përfshinin punë nate; studimet për gabimet, me infermierë dhe mjekë stazhierë, kishin rrezik të lartë paragjykimi. Turnet e natës janë te Nr. 45, orët zgjuar te Nr. 89.",
        "Matre et al. (2021), Metaanalyse mit zufälligen Effekten; Vertrauenswürdigkeit bei allen Vergleichen niedrig. 1,0 heißt kein Unterschied; Tage gegen ≤8 Std., Wochen gegen 35–40 Std. 15 der 22 Studien schlossen Nachtarbeit ein; die Studien zu Fehlern, mit Pflegekräften und Assistenzärzten, hatten ein hohes Verzerrungsrisiko. Nachtschichten stehen in Nr. 45, Wachstunden in Nr. 89."),
      source: ["overtime-matre-2021"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count the hours,", "Numëro orët,", "Die Stunden zählen,"), x("not only the pay", "jo vetëm pagesën", "nicht nur das Geld")],
      lead: x(
        "German law sets the frame: eight hours a working day, up to ten if eight is the average over six months or 24 weeks, and eleven hours' rest. The employer must record the time worked beyond eight hours and keep it for two years.",
        "Ligji gjerman vendos kornizën: tetë orë në ditë pune, deri në dhjetë nëse tetë është mesatarja në gjashtë muaj ose 24 javë, dhe njëmbëdhjetë orë pushim. Punëdhënësi duhet të regjistrojë kohën e punuar përtej tetë orëve dhe ta ruajë për dy vjet.",
        "Das Arbeitszeitgesetz setzt den Rahmen: acht Stunden je Werktag, bis zu zehn, wenn im Schnitt von sechs Monaten oder 24 Wochen acht nicht überschritten werden, und elf Stunden Ruhezeit. Der Arbeitgeber muss die Zeit über acht Stunden aufzeichnen und zwei Jahre aufbewahren."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Paid hours", "Orët e paguara", "Bezahlte Stunden"), p: x("from payroll, per person, not only the team total", "nga lista e pagave, për person, jo vetëm totali i ekipit", "aus der Abrechnung, je Person, nicht nur die Teamsumme") },
          { h: x("Unpaid hours", "Orët e papaguara", "Unbezahlte Stunden"), p: x("clock-out against the end of the shift; the work done after logging off", "dalja nga sistemi kundrejt fundit të turnit; puna e bërë pas daljes", "Ausstempeln gegen Schichtende; Arbeit nach dem Abmelden") },
          { h: x("Account balance", "Bilanci i llogarisë", "Kontostand"), p: x("hours banked and not yet taken back, and since when", "orët e depozituara që s'janë marrë ende prapë, dhe që kur", "aufgebaute, noch nicht ausgeglichene Stunden, und seit wann") },
          { h: x("Long days and short rests", "Ditë të gjata dhe pushime të shkurtra", "Lange Tage, kurze Ruhezeiten"), p: x("days over ten hours; fewer than eleven hours between two shifts", "ditë mbi dhjetë orë; më pak se njëmbëdhjetë orë mes dy turneve", "Tage über zehn Stunden; weniger als elf Stunden zwischen zwei Schichten") },
          { h: x("Very long weeks", "Javë shumë të gjata", "Sehr lange Wochen"), p: x("weeks of 55 hours or more, the threshold WHO and ILO use", "javë me 55 orë ose më shumë, pragu që përdorin OBSH dhe ILO", "Wochen ab 55 Stunden, die Schwelle von WHO und ILO") },
        ] },
        { type: "p", text: x(
          "WHO and ILO estimate that 488 million people, 8.9% of the world's population, worked 55 hours a week or more in 2016, and attribute 745,194 deaths from heart disease and stroke to it. In Europe the share was 3.5%, the lowest of any region.",
          "OBSH dhe ILO vlerësojnë se 488 milionë njerëz, 8,9% e popullsisë së botës, punuan 55 orë në javë ose më shumë më 2016, dhe i atribuojnë kësaj 745.194 vdekje nga sëmundjet e zemrës dhe goditjet në tru. Në Evropë pjesa ishte 3,5%, më e ulëta e të gjitha rajoneve.",
          "WHO und ILO schätzen, dass 2016 488 Millionen Menschen, 8,9 % der Weltbevölkerung, 55 Stunden oder mehr pro Woche arbeiteten, und schreiben dem 745.194 Todesfälle durch Herzkrankheit und Schlaganfall zu. In Europa lag der Anteil bei 3,5 %, dem niedrigsten aller Regionen.") },
      ],
      note: x(
        "Arbeitszeitgesetz §§ 3, 5 and 16(2), as amended in 2024; exceptions by collective agreement are not shown. The rows are the editors' proposal. Pega et al. (2021): modelled estimates against 35–40 hours, evidence rated moderate, causation not certain.",
        "Arbeitszeitgesetz §§ 3, 5 dhe 16(2), sipas ndryshimit të 2024-s; përjashtimet me kontratë kolektive nuk tregohen. Rreshtat janë propozim i redaksisë. Pega et al. (2021): vlerësime të modeluara kundrejt 35–40 orëve, prova të vlerësuara mesatare, shkaku jo i sigurt.",
        "Arbeitszeitgesetz §§ 3, 5 und 16 Abs. 2, Stand der Änderung 2024; Ausnahmen per Tarifvertrag sind nicht dargestellt. Die Zeilen sind ein Vorschlag der Redaktion. Pega et al. (2021): modellierte Schätzungen gegen 35–40 Stunden, Evidenz als mittel bewertet, Kausalität nicht sicher."),
      source: ["overtime-arbzg", "overtime-pega-2021"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/", more: "high-volume-days",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The weekly", "Karta javore", "Die wöchentliche"), x("overtime card", "e orëve shtesë", "Überstundenkarte")],
      lead: x(
        "One card per team and week, filled in by the shift lead before the weekly review. It turns overtime from a cost line into a question: what gap did it cover, and when is it paid back? Shift Capacity shows the gap and the planned overtime before the week begins.",
        "Një kartë për ekip dhe javë, e plotësuar nga drejtuesi i turnit para rishikimit javor. I kthen orët shtesë nga një rresht kostoje në një pyetje: çfarë boshllëku mbuluan, dhe kur kthehen? Shift Capacity e tregon boshllëkun dhe orët shtesë të planifikuara para se të nisë java.",
        "Eine Karte pro Team und Woche, von der Schichtleitung vor der Wochenbesprechung ausgefüllt. Sie macht aus Überstunden statt einer Kostenzeile eine Frage: Welche Lücke haben sie geschlossen, und wann werden sie zurückgegeben? Shift Capacity zeigt die Lücke und die geplanten Überstunden, bevor die Woche beginnt."),
      blocks: [
        { type: "form", items: [
          { h: x("Team, week, planned hours", "Ekipi, java, orët e planifikuara", "Team, Woche, geplante Stunden"), hint: x("from the plan, before the week", "nga plani, para javës", "aus dem Plan, vor der Woche") },
          { h: x("Overtime: paid, unpaid, banked", "Orë shtesë: të paguara, të papaguara, në llogari", "Überstunden: bezahlt, unbezahlt, Konto"), hint: x("three numbers, not one", "tri shifra, jo një", "drei Zahlen, nicht eine") },
          { h: x("Who carried it", "Kush i mbajti", "Wer sie getragen hat"), hint: x("the three people with the most hours", "tre njerëzit me më shumë orë", "die drei Personen mit den meisten Stunden") },
          { h: x("Limits touched", "Kufijtë e prekur", "Berührte Grenzen"), hint: x("days over ten hours, rests under eleven, weeks of 55 or more", "ditë mbi dhjetë orë, pushime nën njëmbëdhjetë, javë me 55 ose më shumë", "Tage über zehn Stunden, Ruhe unter elf, Wochen ab 55") },
          { h: x("The gap it covered", "Boshllëku që mbuloi", "Die geschlossene Lücke"), hint: x("absence, volume above forecast, a vacancy, rework", "mungesë, vëllim mbi parashikimin, një vend i lirë, ripunim", "Ausfall, Volumen über Prognose, offene Stelle, Nacharbeit") },
          { h: x("Paid back by", "Kthehet deri më", "Zurückgegeben bis"), hint: x("time off planned, or the fix to the plan, with a name", "kohë e lirë e planifikuar, ose ndreqja e planit, me emër", "geplanter Freizeitausgleich oder die Korrektur des Plans, mit Namen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the IAB's three kinds, the limits of the Arbeitszeitgesetz and the thresholds in Matre et al. (2021) and Pega et al. (2021); it is not legal advice. The essay linked below gives the author's checks before a day when the plan is not enough.",
        "Karta është propozim i redaksisë, i ndërtuar mbi tri llojet e IAB-së, kufijtë e Arbeitszeitgesetz dhe pragjet te Matre et al. (2021) dhe Pega et al. (2021); nuk është këshillë ligjore. Eseja e lidhur më poshtë jep kontrollet e autorit para një dite kur plani nuk mjafton.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die drei Arten des IAB, die Grenzen des Arbeitszeitgesetzes und die Schwellen bei Matre et al. (2021) und Pega et al. (2021); sie ist keine Rechtsberatung. Der unten verlinkte Essay gibt die Prüfungen des Autors vor einem Tag, an dem der Plan nicht reicht."),
      source: ["overtime-iab-azr-2026", "overtime-arbzg", "overtime-matre-2021"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
