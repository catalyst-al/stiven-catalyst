// Management Review, No. 53: Takt time and cycle time: the beat of demand. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-53.md.
import { x, pc } from "../common.js";

export default {
  number: 53,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Takt time and cycle time:", "Takt time dhe koha e ciklit:", "Taktzeit und Zykluszeit:"), x("the beat of demand", "ritmi i kërkesës", "der Takt der Nachfrage")],
  sub: x(
    "Available time over demand, where takt came from, a line balanced from 64% to 93%, takt, cycle time and pitch, takt on building sites, how to time a process, and a worksheet.",
    "Koha në dispozicion e pjesëtuar me kërkesën, nga erdhi takt-i, një linjë e balancuar nga 64% në 93%, takt time, koha e ciklit dhe pitch-i, takt-i në kantier, si matet një proces, dhe një fletë pune.",
    "Verfügbare Zeit durch Bedarf, woher der Takt kommt, eine Linie von 64 % auf 93 % ausgetaktet, Taktzeit, Zykluszeit und Pitch, Takt auf der Baustelle, Zeitmessung und ein Arbeitsblatt."),
  seo: x(
    "Takt time and cycle time: where takt came from, a line balanced from 64% to 93%, pitch, takt on building sites, how to time a process, and a worksheet.",
    "Takt time dhe koha e ciklit: nga erdhi takt-i, një linjë nga 64% në 93%, pitch-i, takt-i në kantier, si matet një proces dhe një fletë pune.",
    "Taktzeit und Zykluszeit: woher der Takt kommt, eine Linie von 64 % auf 93 %, Pitch, Takt auf der Baustelle, Zeitmessung und ein Arbeitsblatt."),
  feature: x(
    "Issue 53 starts with the Lean Enterprise Institute's definition of takt time and its path from the arsenal of Venice and German aircraft plants to Toyota, follows one line where eight unevenly loaded operators became two balanced lines, sets takt against cycle time and pitch, carries takt to building sites in Sacramento and Helsinki, shows how to time a process before balancing it, and ends with a takt worksheet.",
    "Numri 53 nis me përkufizimin e takt time te Lean Enterprise Institute dhe me rrugën e tij nga arsenali i Venecias dhe fabrikat gjermane të avionëve te Toyota, ndjek një linjë ku tetë operatorë të ngarkuar në mënyrë të pabarabartë u bënë dy linja të balancuara, vë takt-in përballë kohës së ciklit dhe pitch-it, e çon takt-in në kantieret e Sacramentos dhe të Helsinkit, tregon si matet një proces para se të balancohet, dhe mbyllet me një fletë pune për takt-in.",
    "Ausgabe 53 beginnt mit der Definition der Taktzeit beim Lean Enterprise Institute und ihrem Weg vom Arsenal in Venedig und deutschen Flugzeugwerken zu Toyota, folgt einer Linie, in der aus acht ungleich ausgelasteten Personen zwei ausgetaktete Linien wurden, stellt Takt neben Zykluszeit und Pitch, bringt den Takt auf Baustellen in Sacramento und Helsinki, zeigt, wie man einen Prozess vor dem Austakten misst, und endet mit einem Arbeitsblatt zur Taktzeit."),
  figure: { n: x("5.5", "5,5", "5,5"), by: "Frandson et al., 2013", t: x(
    "months instead of the 11 planned for the exterior of a hospital in Sacramento, once the trades worked to a four-day takt.",
    "muaj në vend të 11 të planifikuarve për pjesën e jashtme të një spitali në Sacramento, kur zanatet punuan me një takt prej katër ditësh.",
    "Monate statt der geplanten 11 für die Fassade eines Krankenhauses in Sacramento, als die Gewerke in einem Viertagestakt arbeiteten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The beat of demand", "Ritmi i kërkesës", "Der Takt der Nachfrage") },
    { page: "apply", kicker: x("Outside the factory", "Jashtë fabrikës", "Außerhalb der Fabrik"),
      title: x("Takt on a building site", "Takt-i në kantier", "Takt auf der Baustelle") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The takt worksheet", "Fleta e punës për takt-in", "Das Takt-Arbeitsblatt") },
  ],
  sources: ["takt-lei-takt-time", "takt-haghsheno-2016", "takt-knoll-2016", "takt-lei-cycle-time", "takt-lei-pitch", "takt-frandson-2013", "takt-lehtovaara-2019", "takt-lei-operator-balance"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every operation runs on two clocks. The customer sets one: how often a unit has to be finished to keep up with demand. The process sets the other: how long each step really takes. This issue is about the two, and about what a manager does when they do not match.",
        "Çdo operacion punon me dy ora. Njërën e vendos klienti: sa shpesh duhet mbaruar një njësi për të mbajtur ritmin e kërkesës. Tjetrën e vendos procesi: sa zgjat vërtet çdo hap. Ky numër flet për të dyja, dhe për atë që bën një menaxher kur ato nuk përputhen.",
        "Jeder Betrieb läuft nach zwei Uhren. Die eine stellt der Kunde: wie oft eine Einheit fertig sein muss, um mit der Nachfrage Schritt zu halten. Die andere stellt der Prozess: wie lange jeder Schritt wirklich dauert. Diese Ausgabe handelt von beiden und davon, was eine Führungskraft tut, wenn sie nicht zusammenpassen."),
      body: x(
        "The Lean Enterprise Institute defines takt time as the available time divided by customer demand. The idea came from German aircraft plants in the 1930s and spread through Toyota in the 1950s. On one line, eight unevenly loaded operators became two lines of three, and the balance rose from 64% to 93%. On a hospital in Sacramento, a four-day takt brought 11 planned months of exterior work down to 5.5. And measuring cycle time takes a stopwatch, a team that knows why, and at least ten timings per step.",
        "Lean Enterprise Institute e përkufizon takt time si kohën në dispozicion të pjesëtuar me kërkesën e klientit. Ideja erdhi nga fabrikat gjermane të avionëve në vitet 1930 dhe u përhap në Toyota në vitet 1950. Në një linjë, tetë operatorë të ngarkuar në mënyrë të pabarabartë u bënë dy linja me nga tre, dhe balancimi u ngrit nga 64% në 93%. Në një spital në Sacramento, një takt prej katër ditësh i zbriti 11 muajt e planifikuar të punës së jashtme në 5,5. Dhe për të matur kohën e ciklit duhen një kronometër, një ekip që e di pse, dhe të paktën dhjetë matje për çdo hap.",
        "Das Lean Enterprise Institute definiert die Taktzeit als verfügbare Zeit geteilt durch den Kundenbedarf. Die Idee stammt aus deutschen Flugzeugwerken der 1930er-Jahre und verbreitete sich in den 1950er-Jahren bei Toyota. An einer Linie wurden aus acht ungleich ausgelasteten Personen zwei Linien mit je drei, und der Abstimmungsgrad stieg von 64 % auf 93 %. An einem Krankenhaus in Sacramento verkürzte ein Viertagestakt elf geplante Monate Fassadenarbeit auf 5,5. Und wer Zykluszeiten messen will, braucht eine Stoppuhr, ein Team, das weiß, warum, und mindestens zehn Messungen je Schritt."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The beat", "Ritmi", "Der Takt"), x("of demand", "i kërkesës", "der Nachfrage")],
      lead: x(
        "For the Lean Enterprise Institute, takt time is the available production time divided by customer demand. A plant that works 480 minutes a day for 240 units a day has a takt of two minutes. Takt, German for a precise interval such as a musical meter, is the heartbeat of a lean system.",
        "Për Lean Enterprise Institute, takt time është koha e prodhimit në dispozicion e pjesëtuar me kërkesën e klientit. Një fabrikë që punon 480 minuta në ditë për 240 njësi në ditë ka një takt prej dy minutash. Takt, në gjermanisht një interval i saktë si masa në muzikë, është rrahja e zemrës së një sistemi lean.",
        "Für das Lean Enterprise Institute ist die Taktzeit die verfügbare Produktionszeit geteilt durch den Kundenbedarf. Ein Werk, das täglich 480 Minuten für 240 Einheiten am Tag arbeitet, hat einen Takt von zwei Minuten. Der Takt, ein genaues Zeitmaß wie in der Musik, ist der Herzschlag eines Lean-Systems."),
      blocks: [
        { type: "timeline", items: [
          { k: x("1500s", "Shek. XVI", "16. Jh."), t: x("Records of the arsenal of Venice describe a steady, takted output of merchant ships and warships.", "Dokumentet e arsenalit të Venecias përshkruajnë prodhim të rregullt me takt të anijeve tregtare e luftarake.", "Aufzeichnungen des Arsenals von Venedig beschreiben eine stetige, getaktete Fertigung von Handels- und Kriegsschiffen.") },
          { k: "1913", t: x("In Detroit, Ford brings the production line to the mass production of cars.", "Në Detroit, Ford-i e sjell linjën e prodhimit në prodhimin masiv të makinave.", "In Detroit führt Ford die Fließlinie in die Massenfertigung von Autos ein.") },
          { k: x("1930s", "Vitet 1930", "1930er"), t: x("In the German aircraft industry, airframes move to the next station at a fixed interval: the takt.", "Në industrinë gjermane të avionëve, trupat e avionëve kalojnë te stacioni tjetër në një interval të caktuar: takt-i.", "In der deutschen Flugzeugindustrie rücken die Zellen in festem Abstand zur nächsten Station vor: im Takt.") },
          { k: x("1950s", "Vitet 1950", "1950er"), t: x("Takt is widely used at Toyota; by the late 1960s, across its suppliers.", "Takt-i përdoret gjerësisht te Toyota; nga fundi i viteve 1960, edhe te furnitorët.", "Der Takt ist bei Toyota weit verbreitet, Ende der 1960er-Jahre auch bei den Zulieferern.") },
        ] },
        { type: "p", text: x(
          "The interval is set by demand, not by the machines. According to the institute, Toyota typically reviews the takt of a process every month, with a smaller review every ten days.",
          "Intervalin e cakton kërkesa, jo makinat. Sipas institutit, Toyota zakonisht e rishikon takt-in e një procesi çdo muaj, me një rishikim më të vogël çdo dhjetë ditë.",
          "Den Abstand bestimmt die Nachfrage, nicht die Maschine. Nach Angaben des Instituts überprüft Toyota den Takt eines Prozesses in der Regel monatlich, mit einer Feinabstimmung alle zehn Tage.") },
        { type: "callout", reading: true, text: x(
          "Takt is not a speed you demand of people. It is the rate at which customers take what you make; every step is measured against it.",
          "Takt-i nuk është shpejtësi që ua kërkon njerëzve. Është ritmi me të cilin klientët marrin atë që prodhon; çdo hap matet me të.",
          "Der Takt ist kein Tempo, das man von Menschen verlangt. Er ist die Rate, mit der Kunden abnehmen, was man herstellt, und jeder Schritt wird an ihm gemessen.") },
      ],
      note: x(
        "Definition, aircraft and Toyota follow the LEI lexicon; Venice and Ford follow a review by Haghsheno et al. (2016). Accounts of how takt reached Japan through Mitsubishi rest on secondary sources, so we leave that step out.",
        "Përkufizimi, avionët dhe Toyota ndjekin fjalorin e LEI; Venecia dhe Ford-i ndjekin një përmbledhje të Haghsheno et al. (2016). Rruga e takt-it për në Japoni përmes Mitsubishi-t njihet vetëm nga burime dytësore, ndaj e lëmë jashtë.",
        "Definition, Flugzeugbau und Toyota folgen dem LEI-Lexikon, Venedig und Ford einem Überblick von Haghsheno et al. (2016). Wie der Takt über Mitsubishi nach Japan kam, ist nur aus Sekundärquellen bekannt; diesen Schritt lassen wir weg."),
      source: ["takt-lei-takt-time", "takt-haghsheno-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Eight people,", "Tetë veta,", "Acht Personen,"), x("two lines", "dy linja", "zwei Linien")],
      lead: x(
        "In 2016 Curt Knoll, a former continuous-improvement manager, described a line from a recent project in IndustryWeek. Eight operators worked to a takt of 5.2 minutes; between the least and the most loaded there were exactly four minutes of work. The line balance was 64%.",
        "Në 2016, Curt Knoll, ish-menaxher i përmirësimit të vazhdueshëm, përshkroi te IndustryWeek një linjë nga një projekt i kohëve të fundit. Tetë operatorë punonin me një takt prej 5,2 minutash; mes më pak të ngarkuarit dhe më të ngarkuarit kishte saktësisht katër minuta punë. Balancimi i linjës ishte 64%.",
        "2016 beschrieb Curt Knoll, ehemaliger Leiter für kontinuierliche Verbesserung, in IndustryWeek eine Linie aus einem aktuellen Projekt. Acht Personen arbeiteten in einem Takt von 5,2 Minuten; zwischen der am wenigsten und der am stärksten ausgelasteten lagen genau vier Minuten Arbeit. Der Abstimmungsgrad lag bei 64 %."),
      blocks: [
        { type: "columns", max: 100, height: 120, source: ["takt-knoll-2016"],
          label: x("Line balance, one project, 2016", "Balancimi i linjës, një projekt, 2016", "Abstimmungsgrad der Linie, ein Projekt, 2016"),
          items: [
            { k: x("One line of eight", "Një linjë me tetë", "Eine Linie mit acht"), v: 64, n: pc(64), alert: true },
            { k: x("Two lines of three", "Dy linja me tre", "Zwei Linien mit drei"), v: 93, n: pc(93) },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("16 → <2 min", "16 → <2 min", "16 → <2 Min."), t: x("operators' total waiting time, as the author adds it up: 87% less", "koha e përgjithshme e pritjes së operatorëve, siç e mbledh autori: 87% më pak", "gesamte Wartezeit der Bedienenden, wie der Autor sie aufsummiert: 87 % weniger") },
          { n: x("+38%", "+38%", "+38 %"), t: x("output after the change", "prodhimi pas ndryshimit", "Ausbringung nach der Umstellung") },
        ] },
        { type: "p", text: x(
          "With some training and process kaizen, the team ran two lines at a takt of 10.5 minutes each and spread the work so that every operator came in under it. Work in process between operations fell from several units to one.",
          "Me pak trajnim dhe kaizen në proces, ekipi vuri në punë dy linja, secila me takt prej 10,5 minutash, dhe e ndau punën që çdo operator të mbetej nën të. Puna në proces mes operacioneve ra nga disa njësi në një.",
          "Mit gezielter Schulung und Prozess-Kaizen ließ das Team zwei Linien mit je 10,5 Minuten Takt laufen und verteilte die Arbeit so, dass alle darunter blieben. Der Bestand zwischen den Arbeitsgängen sank von mehreren Einheiten auf eine.") },
        { type: "callout", reading: true, text: x(
          "Waiting on a line rarely shows up in a report. It shows up in the balance chart, as the gap between the tallest bar and the shortest.",
          "Pritja në një linjë rrallë del në raport. Del te grafiku i balancimit, si diferenca mes shtyllës më të lartë dhe asaj më të ulët.",
          "Warten an einer Linie taucht selten in einem Bericht auf. Es zeigt sich im Auslastungsdiagramm, als Abstand zwischen dem höchsten und dem niedrigsten Balken.") },
      ],
      note: x(
        "One unnamed project, reported by the person who led it; the article does not say how the balance rate or the output were calculated. The figures are his.",
        "Një projekt pa emër, i raportuar nga personi që e drejtoi; artikulli nuk thotë si u llogaritën balancimi dhe prodhimi. Shifrat janë të tijat.",
        "Ein ungenanntes Projekt, berichtet von dem, der es leitete; der Artikel sagt nicht, wie Abstimmungsgrad und Ausbringung berechnet wurden. Die Zahlen sind seine."),
      source: ["takt-knoll-2016"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Takt, cycle", "Takt-i, cikli", "Takt, Zyklus"), x("and pitch", "dhe pitch-i", "und Pitch")],
      lead: x(
        "Takt comes from demand, cycle time from the process. The institute defines cycle time as the time it takes to make a part or complete a process, as timed by actual measurement. A process keeps pace when every step sits at or just under the takt.",
        "Takt-i vjen nga kërkesa, koha e ciklit nga procesi. Instituti e përkufizon kohën e ciklit si kohën që duhet për të bërë një pjesë ose për të mbaruar një proces, e matur në të vërtetë. Një proces e mban ritmin kur çdo hap është te takt-i ose pak nën të.",
        "Der Takt kommt aus der Nachfrage, die Zykluszeit aus dem Prozess. Das Institut definiert die Zykluszeit als die Zeit, die ein Teil oder ein Prozess tatsächlich braucht, ermittelt durch Messung. Ein Prozess hält Schritt, wenn jeder Schritt auf oder knapp unter dem Takt liegt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Takt time", "Takt time", "Taktzeit"), p: x("available time ÷ demand; set by the customer, the same for every step", "koha në dispozicion ÷ kërkesa; e cakton klienti, e njëjtë për çdo hap", "verfügbare Zeit ÷ Bedarf; vom Kunden gesetzt, für jeden Schritt gleich") },
          { h: x("Cycle time", "Koha e ciklit", "Zykluszeit"), p: x("measured at each step: an operator's full round of work, or a machine's work on one piece", "matet në çdo hap: një rreth i plotë pune i operatorit, ose puna e makinës për një copë", "an jedem Schritt gemessen: eine volle Arbeitsrunde einer Person oder die Arbeit einer Maschine an einem Teil") },
          { h: x("Pitch", "Pitch-i", "Pitch"), p: x("takt × pack-out quantity: a one-minute takt and boxes of 20 give a pitch of 20 minutes", "takt × sasia në paketim: një takt prej një minute dhe kuti me 20 copë japin pitch prej 20 minutash", "Takt × Packmenge: ein Takt von einer Minute und Kisten zu 20 Stück ergeben 20 Minuten Pitch") },
        ] },
        { type: "example", label: x("Hypothetical example, parcel packing in one shift", "Shembull hipotetik, paketimi i kolive në një turn", "Hypothetisches Beispiel, Paketpacken in einer Schicht"), rows: [
          { k: x("Takt", "Takt-i", "Takt"), v: x("450 minutes available, 900 parcels: 30 seconds", "450 minuta në dispozicion, 900 koli: 30 sekonda", "450 Minuten verfügbar, 900 Pakete: 30 Sekunden") },
          { k: x("Cycle times", "Kohët e ciklit", "Zykluszeiten"), v: x("pick 26 s, check 11 s, pack 34 s, label 9 s", "marrja 26 s, kontrolli 11 s, paketimi 34 s, etiketa 9 s", "Kommissionieren 26 s, Prüfen 11 s, Packen 34 s, Etikett 9 s") },
          { k: x("The gap", "Mungesa", "Die Lücke"), v: x("packing runs 4 s over takt: 900 parcels need an hour more than the shift has", "paketimi kalon takt-in me 4 s: 900 koli duan një orë më shumë se sa ka turni", "Packen liegt 4 s über dem Takt: 900 Pakete brauchen eine Stunde mehr, als die Schicht hat") },
          { k: x("People", "Njerëzit", "Personen"), v: x("80 s of work ÷ 30 s takt = 2.7: at least three, if the work is shared evenly", "80 s punë ÷ 30 s takt = 2,7: të paktën tre, nëse puna ndahet njësoj", "80 s Arbeit ÷ 30 s Takt = 2,7: mindestens drei, wenn die Arbeit gleich verteilt ist") },
        ], text: x("The bottleneck is visible before anyone is asked to work faster. The numbers are invented.", "Gryka e ngushtë duket para se t'i kërkohet kujt të punojë më shpejt. Numrat janë të shpikur.", "Der Engpass ist sichtbar, bevor jemand schneller arbeiten soll. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "On a day when demand runs above forecast, the takt gets shorter. The steps that sat just under it are the first to fall behind.",
          "Në një ditë kur kërkesa kalon parashikimin, takt-i shkurtohet. Hapat që ishin pak nën të janë të parët që mbeten pas.",
          "An einem Tag, an dem die Nachfrage über der Prognose liegt, wird der Takt kürzer. Die Schritte, die knapp darunter lagen, fallen als Erste zurück.") },
      ],
      note: x(
        "Definitions follow the LEI lexicon; the example and the count of people are the editors' arithmetic.",
        "Përkufizimet ndjekin fjalorin e LEI; shembulli dhe numri i njerëzve janë llogari të redaksisë.",
        "Die Definitionen folgen dem LEI-Lexikon; Beispiel und Personenzahl sind Rechnungen der Redaktion."),
      source: ["takt-lei-takt-time", "takt-lei-cycle-time", "takt-lei-pitch"],
    },
    {
      id: "apply",
      kicker: x("Outside the factory", "Jashtë fabrikës", "Außerhalb der Fabrik"),
      title: [x("Takt on a", "Takt-i", "Takt auf der"), x("building site", "në kantier", "Baustelle")],
      lead: x(
        "Builders use takt too; a review by Haghsheno and colleagues names the Empire State Building (1930) as its first recorded use in building construction. In 2013 Adam Frandson, Klas Berghede and Iris Tommelein described the exterior of an eight-storey hospital in Sacramento, divided into zones that each trade had four days to finish.",
        "Edhe ndërtuesit e përdorin takt-in; një përmbledhje e Haghsheno-s dhe kolegëve e quan ndërtesën Empire State (1930) përdorimin e parë të regjistruar në ndërtimin e godinave. Në 2013, Adam Frandson, Klas Berghede dhe Iris Tommelein përshkruan pjesën e jashtme të një spitali tetëkatësh në Sacramento, të ndarë në zona që çdo zanat duhej t'i mbaronte për katër ditë.",
        "Auch am Bau wird getaktet; ein Überblick von Haghsheno und Kollegen nennt das Empire State Building (1930) als ersten belegten Einsatz im Hochbau. 2013 beschrieben Adam Frandson, Klas Berghede und Iris Tommelein die Fassade eines achtgeschossigen Krankenhauses in Sacramento, aufgeteilt in Zonen, die jedes Gewerk in vier Tagen fertigstellen musste."),
      blocks: [
        { type: "columns", height: 120, source: ["takt-frandson-2013"],
          label: x("Exterior work on a hospital in Sacramento, months", "Puna e jashtme në një spital në Sacramento, muaj", "Fassadenarbeiten an einem Krankenhaus in Sacramento, Monate"),
          items: [
            { k: x("Original schedule", "Plani fillestar", "Ursprünglicher Plan"), v: 11, n: "11" },
            { k: x("With a four-day takt", "Me takt 4-ditor", "Mit Viertagestakt"), v: 5.5, n: x("5.5", "5,5", "5,5"), alert: true },
          ] },
        { type: "p", text: x(
          "Framing was far slower than the other trades, so it got a second crew. The first three production plans were missed; every one after that was met. In Helsinki, a one-day takt per apartment cut the interior phase of a 42-apartment block by two months, nearly 30%, after a chaotic start and a partial restart.",
          "Puna e karkasës ishte shumë më e ngadaltë se zanatet e tjera, ndaj mori një ekip të dytë. Tri planet e para të prodhimit nuk u mbajtën; çdo plan pas tyre u mbajt. Në Helsinki, një takt prej një dite për apartament e shkurtoi me dy muaj, gati 30%, fazën e brendshme të një pallati me 42 apartamente, pas një fillimi kaotik dhe një rinisjeje të pjesshme.",
          "Das Ständerwerk ging viel langsamer voran als die übrigen Gewerke, also kam dafür eine zweite Kolonne hinzu. Die ersten drei Produktionspläne wurden verfehlt, alle weiteren eingehalten. In Helsinki verkürzte ein Eintagestakt je Wohnung den Innenausbau eines Hauses mit 42 Wohnungen um zwei Monate, fast 30 %, nach chaotischem Start und teilweisem Neubeginn.") },
        { type: "quote", text: x(
          "If the building process is not well-understood, then all the Takt time adds is stress.",
          "Nëse procesi i ndërtimit nuk kuptohet mirë, e vetmja gjë që shton takt-i është stresi.",
          "Wenn der Bauprozess nicht gut verstanden ist, bringt die Taktzeit nur zusätzlichen Stress.") },
      ],
      note: x(
        "Two single cases, reported by their authors. The Sacramento paper gives 5.5 months in its abstract and 5 in its results; we chart 5.5. The quote is the Sacramento team's lesson: at first they added time to the takt.",
        "Dy raste të vetme, të raportuara nga autorët e tyre. Artikulli për Sacramenton jep 5,5 muaj në abstrakt dhe 5 te rezultatet; ne vizatojmë 5,5. Citimi është mësimi i ekipit të Sacramentos: në fillim i shtuan kohë takt-it.",
        "Zwei Einzelfälle, berichtet von ihren Autoren. Der Beitrag zu Sacramento nennt in der Zusammenfassung 5,5 Monate, in den Ergebnissen 5; wir zeigen 5,5. Das Zitat ist die Lehre des Teams in Sacramento: Anfangs gaben sie dem Takt mehr Zeit."),
      source: ["takt-haghsheno-2016", "takt-frandson-2013", "takt-lehtovaara-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Time it before", "Mate para se", "Erst messen,"), x("you balance", "të balancosh", "dann austakten")],
      lead: x(
        "Cycle time is measured, not estimated: the institute times an operator's cycle by direct observation. In IndustryWeek, Curt Knoll sets out how he prepares a time study before building the balance chart.",
        "Koha e ciklit matet, nuk vlerësohet me sy: instituti e mat ciklin e operatorit me vëzhgim të drejtpërdrejtë. Te IndustryWeek, Curt Knoll shpjegon si e përgatit matjen e kohës para se të ndërtojë grafikun e balancimit.",
        "Zykluszeit wird gemessen, nicht geschätzt: Das Institut misst den Zyklus einer Person durch direkte Beobachtung. In IndustryWeek beschreibt Curt Knoll, wie er eine Zeitstudie vorbereitet, bevor er das Auslastungsdiagramm erstellt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Takt first", "Së pari takt-i", "Zuerst der Takt"), p: x("Work it out before you pick up a stopwatch.", "Llogarite para se të marrësh kronometrin.", "Ihn berechnen, bevor man die Stoppuhr nimmt.") },
          { h: x("Walk the line both ways", "Ec linjën në të dy drejtimet", "Die Linie in beide Richtungen gehen"), p: x("Write every step on a time observation form.", "Shëno çdo hap në një fletë vëzhgimi të kohës.", "Jeden Schritt in ein Zeitaufnahmeblatt eintragen.") },
          { h: x("Tell the team why", "Thuaji ekipit pse", "Dem Team sagen, warum"), p: x("You are not timing them to go faster; they work at their normal pace.", "Nuk i mat që të shpejtojnë; ata punojnë me ritmin e tyre të zakonshëm.", "Es geht nicht darum, sie anzutreiben; sie arbeiten im normalen Tempo.") },
          { h: x("Agree start and stop", "Bini dakord për nisjen dhe ndalimin", "Start und Stopp festlegen"), p: x("In Knoll's own check, observers started and stopped the clock at different points.", "Në kontrollin e vetë Knoll-it, vëzhguesit e nisnin dhe e ndalnin orën në pika të ndryshme.", "In Knolls eigener Prüfung starteten und stoppten Beobachter die Uhr an verschiedenen Punkten.") },
          { h: x("At least ten timings", "Të paktën dhjetë matje", "Mindestens zehn Messungen"), p: x("Per step; twenty give an average you can trust more.", "Për çdo hap; njëzet japin një mesatare më të besueshme.", "Je Schritt; zwanzig ergeben einen verlässlicheren Mittelwert.") },
        ] },
        { type: "p", text: x(
          "The institute's aim for the balance chart: each operator's work very nearly equal to, but slightly less than, takt. For a machine, count what comes with every piece: a 20-second cycle, 30 seconds to load and unload, and a 30-second changeover every 30 pieces give an effective cycle of 51 seconds.",
          "Synimi i institutit për grafikun e balancimit: puna e çdo operatori shumë afër takt-it, por pak nën të. Për një makinë, numëro atë që vjen me çdo copë: një cikël 20 sekondash, 30 sekonda për ngarkim e shkarkim, dhe një ndërrim 30 sekondash çdo 30 copë japin një cikël efektiv prej 51 sekondash.",
          "Das Ziel des Instituts für das Auslastungsdiagramm: die Arbeit jeder Person sehr nahe am Takt, aber knapp darunter. Bei einer Maschine zählt alles, was zu jedem Teil gehört: 20 Sekunden Zyklus, 30 Sekunden Be- und Entladen und 30 Sekunden Rüsten alle 30 Teile ergeben einen effektiven Zyklus von 51 Sekunden.") },
      ],
      note: x(
        "The steps follow Knoll (2016); the definitions and the machine example are the LEI lexicon's.",
        "Hapat ndjekin Knoll-in (2016); përkufizimet dhe shembulli i makinës janë të fjalorit të LEI.",
        "Die Schritte folgen Knoll (2016); Definitionen und Maschinenbeispiel stammen aus dem LEI-Lexikon."),
      source: ["takt-lei-cycle-time", "takt-lei-operator-balance", "takt-knoll-2016"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The takt", "Fleta e punës", "Das Takt-"), x("worksheet", "për takt-in", "Arbeitsblatt")],
      lead: x(
        "One process, one shift. Work out the takt from demand, time each step, and see which steps sit above the line before you add people or overtime.",
        "Një proces, një turn. Llogarite takt-in nga kërkesa, mat çdo hap, dhe shiko cilët hapa janë mbi vijë para se të shtosh njerëz ose orë shtesë.",
        "Ein Prozess, eine Schicht. Den Takt aus der Nachfrage berechnen, jeden Schritt messen und sehen, welche Schritte über der Linie liegen, bevor man Personal oder Überstunden aufstockt."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and period", "Procesi dhe periudha", "Prozess und Zeitraum"), hint: x("which process; one shift, day or week", "cili proces; një turn, një ditë ose një javë", "welcher Prozess; eine Schicht, ein Tag oder eine Woche") },
          { h: x("Available time", "Koha në dispozicion", "Verfügbare Zeit"), hint: x("minutes in the period, minus breaks and planned stops", "minutat e periudhës, pa pushimet dhe ndalesat e planifikuara", "Minuten im Zeitraum, ohne Pausen und geplante Stopps") },
          { h: x("Demand", "Kërkesa", "Bedarf"), hint: x("units the customer takes in the same period", "njësitë që merr klienti në të njëjtën periudhë", "Einheiten, die der Kunde im selben Zeitraum abnimmt") },
          { h: x("Takt", "Takt-i", "Takt"), hint: x("available time ÷ demand, in seconds", "koha në dispozicion ÷ kërkesa, në sekonda", "verfügbare Zeit ÷ Bedarf, in Sekunden") },
          { h: x("Cycle time per step", "Koha e ciklit për çdo hap", "Zykluszeit je Schritt"), hint: x("at least ten timings each; note the spread, not only the average", "të paktën dhjetë matje secili; shëno shpërndarjen, jo vetëm mesataren", "je mindestens zehn Messungen; die Streuung notieren, nicht nur den Mittelwert"), lines: 2 },
          { h: x("Over takt and one change", "Mbi takt dhe një ndryshim", "Über dem Takt und eine Änderung"), hint: x("steps above takt; total work ÷ takt = people needed; what we move or improve first", "hapat mbi takt; puna gjithsej ÷ takt = njerëzit që duhen; çfarë zhvendosim ose përmirësojmë së pari", "Schritte über dem Takt; Gesamtarbeit ÷ Takt = benötigte Personen; was wir zuerst verschieben oder verbessern") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, on the LEI definitions and Knoll's time study. The tool charts the timings and shows their spread.",
        "Praktikë e propozuar nga redaksia, mbi përkufizimet e LEI dhe matjen e kohës te Knoll-i. Mjeti i vizaton matjet dhe tregon shpërndarjen e tyre.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den LEI-Definitionen und Knolls Zeitstudie. Das Werkzeug stellt die Messungen dar und zeigt ihre Streuung."),
      source: ["takt-lei-takt-time", "takt-lei-operator-balance", "takt-knoll-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
