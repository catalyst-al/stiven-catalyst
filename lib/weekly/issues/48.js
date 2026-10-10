// Management Review, No. 48: OEE: how much of the capacity is really used. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-48.md.
import { x, pc } from "../common.js";

export default {
  number: 48,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("OEE:", "OEE:", "OEE:"), x("how much of the capacity is really used", "sa nga kapaciteti përdoret vërtet", "wie viel Kapazität wirklich genutzt wird")],
  sub: x(
    "Nakajima's six big losses, where the world-class 85% comes from, what measured plants reach, three rates in one shift, OEE on a loading dock, what the logs hide, and a card for one asset.",
    "Gjashtë humbjet e mëdha të Nakajima-s, nga vjen shifra 85% “e klasit botëror”, ku arrijnë fabrikat e matura, tri normat në një turn, OEE në një rampë ngarkimi, çfarë fshehin regjistrat, dhe një kartë për një pajisje.",
    "Nakajimas sechs große Verluste, woher die Weltklasse-85 % stammen, was gemessene Werke erreichen, drei Raten in einer Schicht, OEE an der Laderampe, was die Daten verbergen, und eine Karte für eine Anlage."),
  seo: x(
    "OEE: Nakajima's six big losses, where the world-class 85% comes from, what measured plants reach, OEE on a loading dock, and a card for one asset.",
    "OEE: gjashtë humbjet e mëdha të Nakajima-s, nga vjen 85% “i klasit botëror”, ku arrijnë fabrikat e matura, OEE në rampë dhe një kartë.",
    "OEE: Nakajimas sechs große Verluste, woher die Weltklasse-85 % stammen, was gemessene Werke erreichen, OEE an der Rampe und eine Karte."),
  feature: x(
    "Issue 48 follows overall equipment effectiveness from Japan's maintenance prize and Seiichi Nakajima's TPM to the six big losses, traces the world-class 85% back to a set of ideal conditions, sets it against what studies of real machines measured, works through one invented shift, carries the idea carefully to vehicles and loading docks, shows what automatic logs can hide, and ends with a card for one asset.",
    "Numri 48 ndjek efektivitetin e përgjithshëm të pajisjeve nga çmimi japonez i mirëmbajtjes dhe TPM-ja e Seiichi Nakajima-s te gjashtë humbjet e mëdha, e kthen shifrën 85% “të klasit botëror” te një grup kushtesh ideale, e vë përballë asaj që matën studimet në makina të vërteta, llogarit një turn të shpikur, e bart me kujdes idenë te automjetet dhe rampat e ngarkimit, tregon çfarë mund të fshehin regjistrat automatikë, dhe mbyllet me një kartë për një pajisje.",
    "Ausgabe 48 verfolgt die Gesamtanlageneffektivität von Japans Instandhaltungspreis und Seiichi Nakajimas TPM bis zu den sechs großen Verlusten, führt die Weltklasse-85 % auf eine Reihe idealer Bedingungen zurück, stellt sie dem gegenüber, was Studien an echten Maschinen gemessen haben, rechnet eine erfundene Schicht durch, überträgt die Idee vorsichtig auf Fahrzeuge und Laderampen, zeigt, was automatische Daten verbergen können, und endet mit einer Karte für eine Anlage."),
  figure: { n: pc(65), by: "Hedman et al., 2016", t: x(
    "was the average OEE of 884 machines in 23 Swedish companies in 2013–14, well below the 85% often called world class.",
    "ishte OEE mesatare e 884 makinave në 23 kompani suedeze në 2013–14, shumë poshtë 85%-it që shpesh quhet i klasit botëror.",
    "betrug die durchschnittliche OEE von 884 Maschinen in 23 schwedischen Unternehmen 2013–14, weit unter den 85 %, die oft Weltklasse heißen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Where the capacity goes", "Ku shkon kapaciteti", "Wohin die Kapazität geht") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("World class and real plants", "Klasi botëror dhe fabrikat e vërteta", "Weltklasse und echte Werke") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The OEE card", "Karta e OEE-së", "Die OEE-Karte") },
  ],
  sources: ["oee-jipm-tpm", "oee-nakajima-1988", "oee-ljungberg-1998", "oee-ylipaa-2017", "oee-hedman-2016", "oee-bengtsson-2022", "oee-muchiri-pintelon-2008", "oee-simons-2004"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A plant, a dock or a fleet can be busy all day and still deliver only part of what it could. This issue looks at the measure built to show how much: overall equipment effectiveness, where its famous target comes from, and how far it carries outside the factory.",
        "Një fabrikë, një rampë ose një flotë mund të jetë e zënë gjithë ditën dhe prapë të japë vetëm një pjesë të asaj që mundet. Ky numër shikon masën që u ndërtua për ta treguar sa: efektivitetin e përgjithshëm të pajisjeve (OEE), nga vjen objektivi i saj i famshëm, dhe sa larg shkon jashtë fabrikës.",
        "Ein Werk, eine Rampe oder eine Flotte kann den ganzen Tag beschäftigt sein und trotzdem nur einen Teil dessen liefern, was möglich wäre. Diese Ausgabe betrachtet die Kennzahl, die zeigen soll, wie viel: die Gesamtanlageneffektivität (OEE), woher ihr berühmter Zielwert kommt und wie weit sie über die Fabrik hinaus trägt."),
      body: x(
        "In Seiichi Nakajima's total productive maintenance, OEE multiplies three rates: availability, performance and quality. His ideal conditions give 85%, the figure later called world class. Studies of real machines found about 55%, 60% and 65%. A study of road freight measured 54% for vehicles. And the data can mislead: in 884 Swedish machines, most performance and quality rates sat at the system's default of 100%.",
        "Në mirëmbajtjen produktive totale (TPM) të Seiichi Nakajima-s, OEE shumëzon tri norma: disponueshmërinë, performancën dhe cilësinë. Kushtet e tij ideale japin 85%, shifrën që më vonë u quajt e klasit botëror. Studimet në makina të vërteta gjetën rreth 55%, 60% dhe 65%. Një studim për transportin rrugor të mallrave mati 54% për automjetet. Dhe të dhënat mund të mashtrojnë: te 884 makina suedeze, shumica e normave të performancës dhe të cilësisë kishin mbetur te vlera e paracaktuar e sistemit, 100%.",
        "In Seiichi Nakajimas Total Productive Maintenance (TPM) multipliziert die OEE drei Raten: Verfügbarkeit, Leistung und Qualität. Seine idealen Bedingungen ergeben 85 %, die Zahl, die später Weltklasse genannt wurde. Studien an echten Maschinen fanden etwa 55 %, 60 % und 65 %. Eine Studie zum Straßengüterverkehr maß 54 % für Fahrzeuge. Und die Daten können täuschen: Bei 884 schwedischen Maschinen standen die meisten Leistungs- und Qualitätsraten auf dem Standardwert des Systems, 100 %."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Where the", "Ku shkon", "Wohin die"), x("capacity goes", "kapaciteti", "Kapazität geht")],
      lead: x(
        "OEE grew out of total productive maintenance (TPM), which the Japan Institute of Plant Maintenance proposed in 1971. Its aim is zero losses; OEE shows how many remain.",
        "OEE lindi nga mirëmbajtja produktive totale (TPM), që Japan Institute of Plant Maintenance (JIPM) e propozoi në 1971. Synimi i saj është zero humbje; OEE tregon sa mbeten.",
        "Die OEE entstand aus der Total Productive Maintenance (TPM), die das Japan Institute of Plant Maintenance 1971 vorschlug. Ihr Ziel sind null Verluste; die OEE zeigt, wie viele bleiben."),
      blocks: [
        { type: "timeline", items: [
          { k: "1964", t: x("A maintenance group in Japan creates the PM Prize for plant maintenance.", "Një grup mirëmbajtjeje në Japoni krijon çmimin PM për mirëmbajtjen e impianteve.", "Eine Instandhaltungsgruppe in Japan schafft den PM-Preis für Anlageninstandhaltung.") },
          { k: "1971", t: x("The body that became JIPM proposes TPM.", "Organizata që u bë JIPM propozon TPM-në.", "Die Vorläuferin des JIPM schlägt TPM vor.") },
          { k: "1988", t: x("Nakajima's Introduction to TPM appears in English.", "Introduction to TPM e Nakajima-s del në anglisht.", "Nakajimas Introduction to TPM erscheint auf Englisch.") },
          { k: "1994", t: x("The prize becomes the TPM Award; by JIPM's count, over 3,500 sites have won it.", "Çmimi bëhet Çmimi TPM; sipas JIPM-it, e kanë fituar mbi 3.500 vende pune.", "Der Preis wird zum TPM-Preis; laut JIPM haben ihn über 3.500 Standorte erhalten.") },
        ] },
        { type: "p", text: x(
          "In about 20 cases, Örjan Ljungberg found that performance losses dominated, while many companies watched the big breakdowns rather than small losses of speed and time. In data from 98 Swedish companies (2006–2012), Ylipää and colleagues found the same order: operational efficiency first, then availability.",
          "Në rreth 20 raste, Örjan Ljungberg gjeti se mbizotëronin humbjet e performancës, ndërsa shumë kompani ndiqnin prishjet e mëdha dhe jo humbjet e vogla të shpejtësisë e të kohës. Te të dhënat e 98 kompanive suedeze (2006–2012), Ylipää dhe kolegët gjetën të njëjtën radhë: së pari efikasitetin operacional, pastaj disponueshmërinë.",
          "In etwa 20 Fällen fand Örjan Ljungberg, dass Leistungsverluste überwogen, während viele Unternehmen auf große Ausfälle achteten statt auf kleine Verluste an Tempo und Zeit. In Daten aus 98 schwedischen Unternehmen (2006–2012) fanden Ylipää und Kollegen dieselbe Reihenfolge: zuerst operative Effizienz, dann Verfügbarkeit.") },
        { type: "callout", reading: true, text: x(
          "A breakdown is loud and gets a meeting. A line running a little slow all week is silent, and costs more.",
          "Një prishje bën zhurmë dhe merr një mbledhje. Një linjë që punon pak më ngadalë gjithë javën hesht, dhe kushton më shumë.",
          "Ein Ausfall ist laut und bekommt eine Besprechung. Eine Linie, die die ganze Woche etwas zu langsam läuft, ist still und kostet mehr.") },
      ],
      note: x(
        "TPM and prize facts follow JIPM's own pages, in Japanese. Nakajima's book was not seen; its content is confirmed through journal articles that cite it.",
        "Faktet për TPM-në dhe çmimin ndjekin faqet e vetë JIPM-it, në japonisht. Libri i Nakajima-s nuk u pa; përmbajtja e tij konfirmohet përmes artikujve shkencorë që e citojnë.",
        "Die Angaben zu TPM und Preis folgen den eigenen Seiten des JIPM auf Japanisch. Nakajimas Buch lag uns nicht vor; sein Inhalt ist über Fachartikel belegt, die es zitieren."),
      source: ["oee-jipm-tpm", "oee-nakajima-1988", "oee-ljungberg-1998", "oee-ylipaa-2017"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("World class", "Klasi botëror", "Weltklasse"), x("and real plants", "dhe fabrikat e vërteta", "und echte Werke")],
      lead: x(
        "Nakajima set out ideal conditions: availability above 90%, performance above 95%, quality above 99%. Multiplied, they give 85%, the level later authors call world class. Studies that measured real machines found less.",
        "Nakajima përcaktoi kushte ideale: disponueshmëri mbi 90%, performancë mbi 95%, cilësi mbi 99%. Të shumëzuara, japin 85%, nivelin që autorët e mëvonshëm e quajnë të klasit botëror. Studimet që matën makina të vërteta gjetën më pak.",
        "Nakajima nannte ideale Bedingungen: Verfügbarkeit über 90 %, Leistung über 95 %, Qualität über 99 %. Multipliziert ergeben sie 85 %, das Niveau, das spätere Autoren Weltklasse nennen. Studien, die echte Maschinen gemessen haben, fanden weniger."),
      blocks: [
        { type: "hbars", source: ["oee-nakajima-1988", "oee-hedman-2016", "oee-bengtsson-2022", "oee-ljungberg-1998"],
          label: x("OEE: the ideal against measured averages", "OEE: ideali përballë mesatareve të matura", "OEE: das Ideal gegen gemessene Durchschnitte"),
          items: [
            { k: x("Ideal conditions, Nakajima (1988)", "Kushtet ideale, Nakajima (1988)", "Ideale Bedingungen, Nakajima (1988)"), v: 85, n: pc(85) },
            { k: x("884 machines, Sweden, 2013–14", "884 makina, Suedi, 2013–14", "884 Maschinen, Schweden, 2013–14"), v: 65, n: pc(65) },
            { k: x("50 machines, an automotive plant, 2018", "50 makina, një fabrikë makinash, 2018", "50 Maschinen, ein Autowerk, 2018"), v: 60, n: pc(60) },
            { k: x("About 20 cases, Ljungberg (1998)", "Rreth 20 raste, Ljungberg (1998)", "Etwa 20 Fälle, Ljungberg (1998)"), v: 55, n: x("~55%", "~55%", "~55 %"), alert: true },
          ] },
        { type: "p", text: x(
          "The 85% is a set of ideal conditions multiplied, not the average of a sample; we could not find who first called it world class. In the Swedish data the median was 70%: food and beverage plants averaged 74%, other automated discrete production 59%.",
          "85% është produkt kushtesh ideale, jo mesatare e një mostre; nuk gjetëm kush e quajti i pari të klasit botëror. Te të dhënat suedeze mediana ishte 70%: fabrikat e ushqimeve dhe pijeve kishin mesatarisht 74%, prodhimi tjetër i automatizuar me njësi 59%.",
          "Die 85 % sind ein Produkt idealer Bedingungen, kein Durchschnitt einer Stichprobe; wer sie zuerst Weltklasse nannte, fanden wir nicht. In den schwedischen Daten lag der Median bei 70 %: Lebensmittel- und Getränkewerke kamen im Schnitt auf 74 %, die übrige automatisierte Stückfertigung auf 59 %.") },
        { type: "callout", reading: true, text: x(
          "Against 85%, almost everyone looks bad and the number stops helping. Against last month, it shows whether the losses are shrinking.",
          "Përballë 85%-it, pothuajse të gjithë duken keq dhe shifra nuk ndihmon më. Përballë muajit të kaluar, tregon nëse humbjet po zvogëlohen.",
          "Gegen 85 % sehen fast alle schlecht aus, und die Zahl hilft nicht mehr. Gegen den Vormonat zeigt sie, ob die Verluste kleiner werden.") },
      ],
      note: x(
        "Different samples, years and definitions: the bars show orders of magnitude, not a ranking. Nakajima's ideal as cited by Bengtsson et al. (2022).",
        "Mostra, vite dhe përkufizime të ndryshme: shiritat tregojnë rende madhësie, jo renditje. Ideali i Nakajima-s sipas citimit te Bengtsson et al. (2022).",
        "Verschiedene Stichproben, Jahre und Definitionen: Die Balken zeigen Größenordnungen, keine Rangliste. Nakajimas Ideal nach dem Zitat bei Bengtsson et al. (2022)."),
      source: ["oee-nakajima-1988", "oee-hedman-2016", "oee-bengtsson-2022", "oee-ljungberg-1998"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three rates,", "Tri norma,", "Drei Raten,"), x("six losses", "gjashtë humbje", "sechs Verluste")],
      lead: x(
        "OEE multiplies three rates; together they set good output against the planned time. Each rate collects two of Nakajima's six big losses.",
        "OEE shumëzon tri norma; bashkë ato vënë prodhimin e mirë përballë kohës së planifikuar. Secila normë mbledh dy nga gjashtë humbjet e mëdha të Nakajima-s.",
        "Die OEE multipliziert drei Raten; zusammen setzen sie die gute Ausbringung ins Verhältnis zur geplanten Zeit. Jede Rate sammelt zwei von Nakajimas sechs großen Verlusten."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Availability", "Disponueshmëria", "Verfügbarkeit"), p: x("running time against planned time; losses: breakdowns, setup and adjustment", "koha e punës përballë kohës së planifikuar; humbjet: prishjet, përgatitja dhe rregullimi", "Laufzeit gegen geplante Zeit; Verluste: Ausfälle, Rüsten und Einstellen") },
          { h: x("Performance", "Performanca", "Leistung"), p: x("output at ideal speed against running time; losses: idling and minor stops, reduced speed", "prodhimi me shpejtësinë ideale përballë kohës së punës; humbjet: pritjet dhe ndalesat e vogla, shpejtësia e ulët", "Ausbringung bei Idealtempo gegen Laufzeit; Verluste: Leerlauf und Kurzstopps, verringertes Tempo") },
          { h: x("Quality", "Cilësia", "Qualität"), p: x("good units against all units; losses: defects and rework, lower yield at start-up", "njësitë e mira përballë të gjitha njësive; humbjet: defektet dhe ripunimi, rendimenti i ulët në nisje", "gute Einheiten gegen alle Einheiten; Verluste: Fehler und Nacharbeit, Anlaufverluste") },
        ] },
        { type: "example", label: x("Invented example, one shift on a packing line", "Shembull i shpikur, një turn në një linjë paketimi", "Erfundenes Beispiel, eine Schicht an einer Verpackungslinie"), rows: [
          { k: x("Availability", "Disponueshmëria", "Verfügbarkeit"), v: x("480 planned minutes, 48 lost to stops: 90%", "480 minuta të planifikuara, 48 të humbura në ndalesa: 90%", "480 geplante Minuten, 48 durch Stopps verloren: 90 %") },
          { k: x("Performance", "Performanca", "Leistung"), v: x("380 units at an ideal 1 minute each, in 432 minutes: 88%", "380 njësi me 1 minutë ideale secila, në 432 minuta: 88%", "380 Einheiten zu ideal 1 Minute, in 432 Minuten: 88 %") },
          { k: x("Quality", "Cilësia", "Qualität"), v: x("370 of 380 good the first time: 97.4%", "370 nga 380 të mira herën e parë: 97,4%", "370 von 380 beim ersten Mal gut: 97,4 %") },
          { k: "OEE", v: x("0.90 × 0.88 × 0.974 = 77.1%, or 370 good minutes of 480", "0,90 × 0,88 × 0,974 = 77,1%, ose 370 minuta të mira nga 480", "0,90 × 0,88 × 0,974 = 77,1 %, also 370 gute Minuten von 480") },
        ], text: x("No rate looks bad, yet almost a quarter of the shift is lost. The numbers are invented.", "Asnjë normë nuk duket keq, por gati një e katërta e turnit humbet. Numrat janë të shpikur.", "Keine Rate sieht schlecht aus, und doch geht fast ein Viertel der Schicht verloren. Die Zahlen sind erfunden.") },
        { type: "p", text: x(
          "A related measure, TEEP, divides by all calendar time instead of the planned time. A line that stands still every weekend can have a high OEE and a low TEEP.",
          "Një masë e afërt, TEEP, pjesëton me gjithë kohën e kalendarit në vend të kohës së planifikuar. Një linjë që qëndron çdo fundjavë mund të ketë OEE të lartë dhe TEEP të ulët.",
          "Eine verwandte Kennzahl, TEEP, teilt durch die gesamte Kalenderzeit statt durch die geplante Zeit. Eine Linie, die jedes Wochenende stillsteht, kann eine hohe OEE und eine niedrige TEEP haben.") },
      ],
      note: x(
        "Rates and losses follow Nakajima as Muchiri and Pintelon (2008) give them; the example is the editors'.",
        "Normat dhe humbjet ndjekin Nakajima-n siç i japin Muchiri dhe Pintelon (2008); shembulli është i redaksisë.",
        "Raten und Verluste folgen Nakajima nach Muchiri und Pintelon (2008); das Beispiel stammt von der Redaktion."),
      source: ["oee-nakajima-1988", "oee-muchiri-pintelon-2008"],
    },
    {
      id: "apply", more: "high-volume-days",
      kicker: x("How it transfers", "Si bartet", "Wie es sich überträgt"),
      title: [x("From the machine", "Nga makina", "Von der Maschine"), x("to the dock", "te rampa", "zur Rampe")],
      lead: x(
        "In 2004 David Simons, Robert Mason and Bernard Gardner carried OEE over to road freight as overall vehicle effectiveness (OVE), with five losses of its own. Their case study measured 54%; they put a target for the company at 70%.",
        "Në 2004, David Simons, Robert Mason dhe Bernard Gardner e bartën OEE-në te transporti rrugor i mallrave si efektivitet i përgjithshëm i automjetit (OVE), me pesë humbje të vetat. Rasti i tyre studimor mati 54%; si objektiv për kompaninë vunë 70%.",
        "2004 übertrugen David Simons, Robert Mason und Bernard Gardner die OEE als Overall Vehicle Effectiveness (OVE) auf den Straßengüterverkehr, mit fünf eigenen Verlusten. Ihre Fallstudie maß 54 %; als Ziel für das Unternehmen setzten sie 70 % an."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Availability", "Disponueshmëria", "Verfügbarkeit"), p: x("the hours a dock door and its crew are ready, against the planned hours", "orët kur porta e rampës dhe ekipi janë gati, përballë orëve të planifikuara", "die Stunden, in denen ein Rampentor und sein Team bereit sind, gegen die geplanten Stunden") },
          { h: x("Performance", "Performanca", "Leistung"), p: x("pallets per hour against an agreed standard, not against the best day", "paleta në orë përballë një standardi të rënë dakord, jo përballë ditës më të mirë", "Paletten pro Stunde gegen einen vereinbarten Standard, nicht gegen den besten Tag") },
          { h: x("Quality", "Cilësia", "Qualität"), p: x("loads right the first time: nothing reloaded, damaged or missing", "ngarkesa të sakta herën e parë: asgjë e ringarkuar, e dëmtuar ose që mungon", "beim ersten Mal richtige Ladungen: nichts umgeladen, beschädigt oder fehlend") },
        ] },
        { type: "p", text: x(
          "In the Swedish plant data, about 90% of the stop time with a known cause was tied to support work done by operators, such as changeovers, adjustments and repairs, not to the automatic process itself.",
          "Te të dhënat e fabrikave suedeze, rreth 90% e kohës së ndalesave me shkak të njohur lidhej me punë mbështetëse që bënin operatorët, si ndërrimet, rregullimet dhe riparimet, jo me vetë procesin automatik.",
          "In den schwedischen Werksdaten hing rund 90 % der Stillstandszeit mit bekannter Ursache an unterstützender Arbeit der Bediener, etwa Umrüsten, Einstellen und Reparieren, nicht am automatischen Prozess selbst.") },
        { type: "callout", reading: true, text: x(
          "A dock is more people, trucks and material than machine. A door waiting for a late truck is not broken: log arrival losses on their own line, or the dock takes the blame for the yard.",
          "Një rampë është më shumë njerëz, kamionë dhe mallra sesa makinë. Një portë që pret një kamion të vonuar nuk është e prishur: shëno humbjet nga mbërritjet në një rresht më vete, përndryshe rampa merr fajin e oborrit.",
          "Eine Rampe besteht mehr aus Menschen, Lkw und Ware als aus Maschine. Ein Tor, das auf einen verspäteten Lkw wartet, ist nicht kaputt: Ankunftsverluste in einer eigenen Zeile erfassen, sonst trägt die Rampe die Schuld des Hofs.") },
      ],
      note: x(
        "Only the abstract of Simons et al. was seen, so we do not list their five losses. The dock version of the three rates is the editors' and has no published benchmark.",
        "U pa vetëm abstrakti i Simons et al., ndaj nuk i rendisim pesë humbjet e tyre. Versioni i tri normave për rampën është i redaksisë dhe nuk ka pikë krahasimi të publikuar.",
        "Von Simons et al. lag nur die Zusammenfassung vor, deshalb nennen wir ihre fünf Verluste nicht. Die Fassung der drei Raten für die Rampe stammt von der Redaktion und hat keinen veröffentlichten Vergleichswert."),
      source: ["oee-simons-2004", "oee-hedman-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count before", "Numëro para se", "Erst zählen,"), x("you compare", "të krahasosh", "dann vergleichen")],
      lead: x(
        "An OEE is only as good as what is logged. Richard Hedman and colleagues examined the raw data behind automatic OEE measurement: 884 machines in 23 Swedish companies, over six months from October 2013.",
        "Një OEE është aq e mirë sa ajo që regjistrohet. Richard Hedman dhe kolegët shqyrtuan të dhënat e papërpunuara pas matjes automatike të OEE-së: 884 makina në 23 kompani suedeze, për gjashtë muaj nga tetori i 2013.",
        "Eine OEE ist nur so gut wie das, was erfasst wird. Richard Hedman und Kollegen untersuchten die Rohdaten hinter automatischer OEE-Messung: 884 Maschinen in 23 schwedischen Unternehmen, sechs Monate ab Oktober 2013."),
      blocks: [
        { type: "hbars", source: ["oee-hedman-2016"],
          label: x("Machines whose logged rate was exactly 100%, 2013–14", "Makinat me normë të regjistruar saktësisht 100%, 2013–14", "Maschinen mit genau 100 % erfasster Rate, 2013–14"),
          items: [
            { k: x("Performance at 100% (702 of 884)", "Performanca 100% (702 nga 884)", "Leistung bei 100 % (702 von 884)"), v: 79.4, n: pc(79) },
            { k: x("Quality at 100% (796 of 884)", "Cilësia 100% (796 nga 884)", "Qualität bei 100 % (796 von 884)"), v: 90, n: pc(90), alert: true },
          ] },
        { type: "p", text: x(
          "100% was the system's default. About half of the loss time had no usable cause: “unclassified” took 19% of the scheduled time. The authors ask whether such firms measure OEE or only availability.",
          "100% ishte vlera e paracaktuar e sistemit. Rreth gjysma e kohës së humbur nuk kishte shkak të përdorshëm: “të paklasifikuarat” zinin 19% të kohës së planifikuar. Autorët pyesin nëse këto firma matin OEE apo vetëm disponueshmërinë.",
          "100 % war der Standardwert des Systems. Rund die Hälfte der Verlustzeit hatte keine brauchbare Ursache: „Nicht klassifiziert“ machte 19 % der geplanten Zeit aus. Die Autoren fragen, ob solche Firmen die OEE messen oder nur die Verfügbarkeit.") },
        { type: "p", text: x(
          "In one automotive plant, 25 managers estimated the average OEE of early 2018: 55% on average, from 40% to 66%. The logs said 60%. Four in five thought lack of material was logged more often than tool changes and quality checks; it was not.",
          "Në një fabrikë automobilistike, 25 drejtues vlerësuan OEE-në mesatare të gjysmës së parë të 2018: mesatarisht 55%, nga 40% deri në 66%. Regjistrat thoshin 60%. Katër në pesë menduan se mungesa e materialit regjistrohej më shpesh se ndërrimi i veglave dhe kontrollet e cilësisë; nuk ishte kështu.",
          "In einem Automobilwerk schätzten 25 Führungskräfte die durchschnittliche OEE des ersten Halbjahrs 2018: im Schnitt 55 %, von 40 % bis 66 %. Die Daten sagten 60 %. Vier von fünf glaubten, Materialmangel werde häufiger erfasst als Werkzeugwechsel und Qualitätsprüfungen; das stimmte nicht.") },
      ],
      note: x(
        "Hedman et al. write “almost half” in the abstract and “more than half” in the results for the unclassified loss time; we write “about half”. The managers' survey covers a single plant.",
        "Hedman et al. shkruajnë “gati gjysma” në abstrakt dhe “më shumë se gjysma” te rezultatet për kohën e humbur të paklasifikuar; ne shkruajmë “rreth gjysma”. Anketa e drejtuesve mbulon një fabrikë të vetme.",
        "Hedman et al. schreiben zur nicht klassifizierten Verlustzeit in der Zusammenfassung „fast die Hälfte“, in den Ergebnissen „mehr als die Hälfte“; wir schreiben „rund die Hälfte“. Die Befragung der Führungskräfte betrifft ein einziges Werk."),
      source: ["oee-hedman-2016", "oee-bengtsson-2022"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The OEE card", "Karta e OEE-së", "Die OEE-Karte"), x("for one asset", "për një pajisje", "für eine Anlage")],
      lead: x(
        "One machine, door or vehicle, one week. Count against the planned time, give every stop a cause, and compare the result with last week, not with 85%.",
        "Një makinë, portë ose automjet, një javë. Numëro përballë kohës së planifikuar, jepi çdo ndalese një shkak, dhe krahasoje rezultatin me javën e kaluar, jo me 85%.",
        "Eine Maschine, ein Tor oder ein Fahrzeug, eine Woche. Gegen die geplante Zeit zählen, jedem Stopp eine Ursache geben und das Ergebnis mit der Vorwoche vergleichen, nicht mit 85 %."),
      blocks: [
        { type: "form", items: [
          { h: x("Asset and planned time", "Pajisja dhe koha e planifikuar", "Anlage und geplante Zeit"), hint: x("which one; planned minutes, not calendar minutes", "cila; minutat e planifikuara, jo të kalendarit", "welche; geplante Minuten, keine Kalenderminuten") },
          { h: x("Availability", "Disponueshmëria", "Verfügbarkeit"), hint: x("running minutes ÷ planned minutes; each stop with its cause", "minutat e punës ÷ minutat e planifikuara; çdo ndalesë me shkakun e saj", "Laufminuten ÷ geplante Minuten; jeder Stopp mit Ursache"), lines: 2 },
          { h: x("Performance", "Performanca", "Leistung"), hint: x("units × ideal time per unit ÷ running minutes", "njësitë × koha ideale për njësi ÷ minutat e punës", "Einheiten × Idealzeit je Einheit ÷ Laufminuten") },
          { h: x("Quality", "Cilësia", "Qualität"), hint: x("good the first time ÷ all units", "të mira herën e parë ÷ të gjitha njësitë", "beim ersten Mal gut ÷ alle Einheiten") },
          { h: x("OEE and the largest loss", "OEE dhe humbja më e madhe", "OEE und größter Verlust"), hint: x("the three rates multiplied; which of the six losses took most", "tri normat të shumëzuara; cila nga gjashtë humbjet mori më shumë", "die drei Raten multipliziert; welcher der sechs Verluste am meisten nahm") },
          { h: x("Unclassified and one change", "Të paklasifikuarat dhe një ndryshim", "Nicht klassifiziert und eine Änderung"), hint: x("minutes without a cause; what we change, when we count again", "minutat pa shkak; çfarë ndryshojmë, kur numërojmë sërish", "Minuten ohne Ursache; was wir ändern, wann wir wieder zählen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, on Nakajima's rates and losses and the pitfalls found by Hedman et al.",
        "Praktikë e propozuar nga redaksia, mbi normat dhe humbjet e Nakajima-s dhe kurthet që gjetën Hedman et al.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Nakajimas Raten und Verlusten und den Fallstricken, die Hedman et al. fanden."),
      source: ["oee-muchiri-pintelon-2008", "oee-hedman-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
