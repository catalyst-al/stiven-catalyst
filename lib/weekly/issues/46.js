// Management Review, No. 46: Poka-yoke: the mistake that is not allowed to happen. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-46.md.
import { x } from "../common.js";

export default {
  number: 46,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Poka-yoke:", "Poka-yoke:", "Poka-yoke:"), x("the mistake not allowed to happen", "gabimi që nuk lejohet të ndodhë", "der Fehler, der nicht passieren darf")],
  sub: x(
    "Two springs on a dish, 112 devices and what they cost, three kinds of inspection, why warnings go unheard, shape, count and sequence, and a card for one poka-yoke.",
    "Dy susta në një pjatë, 112 pajisje dhe sa kushtuan, tri llojet e inspektimit, pse paralajmërimet nuk dëgjohen, forma, numri dhe radha, dhe një kartë për një poka-yoke.",
    "Zwei Federn auf einem Teller, 112 Vorrichtungen und was sie kosteten, drei Arten der Prüfung, warum Warnungen überhört werden, Form, Anzahl und Reihenfolge und eine Karte für ein Poka-Yoke."),
  seo: x(
    "Poka-yoke: Shingo's two springs on a dish, 112 devices and their cost, three kinds of inspection, stop or warn, contact, count and sequence, and a card.",
    "Poka-yoke: dy sustat e Shingo-s, 112 pajisje dhe kostoja, tri llojet e inspektimit, ndalo apo paralajmëro, kontakti, numri dhe radha, dhe një kartë.",
    "Poka-Yoke: Shingos zwei Federn, 112 Vorrichtungen und ihre Kosten, drei Prüfarten, stoppen oder warnen, Kontakt, Anzahl, Reihenfolge und eine Karte."),
  feature: x(
    "Issue 46 starts with the switch whose spring kept going missing at a small Japanese plant in 1961, counts the 112 devices in Shigeo Shingo's Zero Quality Control and what they cost, separates inspections that find, reduce and eliminate defects, looks at hospital alarms to see why a warning is weaker than a stop, sets out the three ways a device detects an error, and ends with a card for one poka-yoke.",
    "Numri 46 nis me çelësin elektrik që i mungonte herë pas here susta në një fabrikë të vogël japoneze në 1961, numëron 112 pajisjet te Zero Quality Control e Shigeo Shingo-s dhe sa kushtuan, ndan inspektimet që i gjejnë, i ulin dhe i zhdukin defektet, shikon alarmet e spitaleve për të kuptuar pse një paralajmërim është më i dobët se një ndalim, shtjellon tri mënyrat si një pajisje e kap gabimin, dhe mbyllet me një kartë për një poka-yoke.",
    "Ausgabe 46 beginnt mit dem Schalter, dem in einem kleinen japanischen Werk 1961 immer wieder eine Feder fehlte, zählt die 112 Vorrichtungen in Shigeo Shingos Zero Quality Control und was sie kosteten, trennt Prüfungen, die Fehler finden, verringern und beseitigen, zeigt an Klinikalarmen, warum eine Warnung schwächer ist als ein Stopp, stellt die drei Wege vor, auf denen eine Vorrichtung einen Fehler erkennt, und endet mit einer Karte für ein Poka-Yoke."),
  figure: { n: "112", by: "Shingo, 1986", t: x(
    "poka-yoke devices from Japanese plants in Shigeo Shingo's book, each one with its cost.",
    "pajisje poka-yoke nga fabrika japoneze në librin e Shigeo Shingo-s, secila me koston e vet.",
    "Poka-Yoke-Vorrichtungen aus japanischen Werken in Shigeo Shingos Buch, jede mit ihren Kosten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two springs on a dish", "Dy susta në një pjatë", "Zwei Federn auf einem Teller") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Find, reduce, eliminate", "Gjej, ul, zhduk", "Finden, verringern, beseitigen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The poka-yoke card", "Karta e poka-yoke", "Die Poka-Yoke-Karte") },
  ],
  sources: ["pokayoke-shingo-1986", "pokayoke-grout-2007", "pokayoke-lei", "pokayoke-tjc-2013", "pokayoke-sendelbach-2013", "pokayoke-ismp-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Telling people to be more careful works for a while. This issue is about the other way: building the check into the work, so that a slip is caught before it becomes a defect, or cannot be made at all.",
        "T'u thuash njerëzve të jenë më të kujdesshëm funksionon për pak kohë. Ky numër flet për rrugën tjetër: ta ndërtosh kontrollin brenda punës, që një lëshim të kapet para se të bëhet defekt, ose të mos bëhet dot fare.",
        "Menschen zu sagen, sie sollen besser aufpassen, wirkt eine Weile. Diese Ausgabe handelt vom anderen Weg: die Prüfung in die Arbeit einzubauen, damit ein Versehen erkannt wird, bevor es zum Fehler wird, oder gar nicht erst passieren kann."),
      body: x(
        "In 1961 Shigeo Shingo watched a worker leave a spring out of a switch and solved it with a small dish. His book of 1986 describes 112 such devices; more than half cost $100 or less, in 1986 dollars. Shingo separates inspections that find defects, reduce them and eliminate them, and he prefers a device that stops the work to one that only warns. Hospital alarms show why: in 98 events reported to the Joint Commission, the factor named most often among those listed was an alarm turned off.",
        "Në 1961, Shigeo Shingo pa një punëtor që harroi një sustë në një çelës elektrik, dhe problemin e zgjidhi me një pjatë të vogël. Libri i tij i 1986 përshkruan 112 pajisje të tilla; më shumë se gjysma kushtuan 100 dollarë ose më pak, me dollarët e 1986. Shingo i ndan inspektimet në ato që i gjejnë defektet, i ulin dhe i zhdukin, dhe një pajisjen që e ndalon punën e quan më të mirë se atë që vetëm paralajmëron. Alarmet e spitaleve tregojnë pse: në 98 ngjarje të raportuara te Joint Commission, nga faktorët e renditur, më shpesh përmendej një alarm i fikur.",
        "1961 sah Shigeo Shingo, wie ein Arbeiter eine Feder in einem Schalter vergaß, und löste das Problem mit einem kleinen Teller. Sein Buch von 1986 beschreibt 112 solche Vorrichtungen; mehr als die Hälfte kostete 100 Dollar oder weniger, in Dollar von 1986. Shingo trennt Prüfungen, die Fehler finden, verringern und beseitigen, und zieht eine Vorrichtung, die die Arbeit stoppt, einer vor, die nur warnt. Klinikalarme zeigen, warum: In 98 Ereignissen, die der Joint Commission gemeldet wurden, war unter den aufgeführten Faktoren ein abgeschalteter Alarm der häufigste."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two springs", "Dy susta", "Zwei Federn"), x("on a dish", "në një pjatë", "auf einem Teller")],
      lead: x(
        "In 1961 Shigeo Shingo visited Yamada Electric in Nagoya. The plant made a simple switch with two buttons for its parent company, Matsushita Electric, with a small spring under each button. Now and then a worker left a spring out, and each time Yamada had to send an inspector to Kyushu to check every switch delivered.",
        "Në 1961, Shigeo Shingo vizitoi Yamada Electric në Nagoya. Fabrika bënte një çelës të thjeshtë me dy butona për kompaninë mëmë, Matsushita Electric, me një sustë të vogël nën çdo buton. Herë pas here një punëtor e harronte sustën, dhe çdo herë Yamada duhej të dërgonte një inspektor deri në Kyushu për të kontrolluar çdo çelës të dorëzuar.",
        "1961 besuchte Shigeo Shingo Yamada Electric in Nagoya. Das Werk baute für die Muttergesellschaft Matsushita Electric einen einfachen Schalter mit zwei Tasten, unter jeder eine kleine Feder. Ab und zu vergaß jemand eine Feder, und jedes Mal musste Yamada einen Prüfer nach Kyushu schicken, um jeden gelieferten Schalter zu kontrollieren."),
      blocks: [
        { type: "p", text: x(
          "Telling workers to be careful helped for a while, then it happened again. On the floor Shingo saw a worker skip a spring, and asked the department chief:",
          "Kur u thuhej punëtorëve të ishin të kujdesshëm, gjërat përmirësoheshin për pak kohë, pastaj ndodhte përsëri. Në repart, Shingo pa një punëtor që kapërceu një sustë, dhe e pyeti shefin e departamentit:",
          "Die Mahnung zur Sorgfalt half eine Weile, dann passierte es wieder. In der Halle sah Shingo, wie ein Arbeiter eine Feder ausließ, und fragte den Abteilungsleiter:") },
        { type: "quote", text: x(
          "What does it mean for a human being to 'forget' something?",
          "Çfarë do të thotë për një qenie njerëzore të 'harrojë' diçka?",
          "Was bedeutet es für einen Menschen, etwas zu ‚vergessen‘?") },
        { type: "p", text: x(
          "The answer was a dish. At the start, the worker took two springs from a box of hundreds and put them on it; a spring left on the dish showed that one had been left out. No more springs went missing, Shingo writes. Around 1963 he renamed such devices: “foolproofing” made a worker cry, so he chose poka-yoke, proofing against inadvertent mistakes.",
          "Përgjigjja ishte një pjatë. Në fillim, punëtori merrte dy susta nga një kuti me qindra dhe i vinte në pjatë; një sustë që mbetej aty tregonte se mungonte një. Sustat nuk munguan më, shkruan Shingo. Rreth 1963 i ndryshoi emrin pajisjeve të tilla: “mbrojtje nga budallenjtë” e bëri një punëtore të qante, ndaj zgjodhi poka-yoke, mbrojtje nga gabimet e pavullnetshme.",
          "Die Antwort war ein Teller. Zu Beginn nahm der Arbeiter zwei Federn aus einer Kiste mit Hunderten und legte sie darauf; eine Feder, die liegen blieb, zeigte, dass eine vergessen worden war. Es fehlten keine Federn mehr, schreibt Shingo. Um 1963 benannte er solche Vorrichtungen um: „Narrensicherung“ hatte eine Arbeiterin zum Weinen gebracht, also wählte er Poka-Yoke, Schutz vor unbeabsichtigten Fehlern.") },
        { type: "callout", reading: true, text: x(
          "The dish does not ask anyone to remember better. It shows the forgetting before the switch leaves the bench.",
          "Pjata nuk i kërkon askujt të mbajë mend më mirë. E tregon harresën para se çelësi të largohet nga tavolina.",
          "Der Teller verlangt von niemandem, sich besser zu erinnern. Er zeigt das Vergessen, bevor der Schalter den Arbeitsplatz verlässt.") },
      ],
      note: x(
        "Shingo's own account, in Zero Quality Control (Japanese 1985, English 1986); we found no independent record. It is the first device he describes, not the first ever: foolproofing for safety came earlier.",
        "Rrëfimi i vetë Shingo-s, te Zero Quality Control (japonisht 1985, anglisht 1986); nuk gjetëm dëshmi të pavarur. Është pajisja e parë që përshkruan ai, jo e para në botë: mbrojtjet për sigurinë ekzistonin më herët.",
        "Shingos eigener Bericht in Zero Quality Control (japanisch 1985, englisch 1986); einen unabhängigen Beleg fanden wir nicht. Es ist die erste Vorrichtung, die er beschreibt, nicht die erste überhaupt: Sicherungen für den Arbeitsschutz gab es früher."),
      source: ["pokayoke-shingo-1986"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("112 devices,", "112 pajisje,", "112 Vorrichtungen,"), x("most of them cheap", "shumica të lira", "die meisten billig")],
      lead: x(
        "Shingo's book ends with 112 poka-yoke examples from Japanese plants, each with its cost. In 2007 John Grout sorted the costs in a report for the US Agency for Healthcare Research and Quality:",
        "Libri i Shingo-s mbyllet me 112 shembuj poka-yoke nga fabrika japoneze, secili me koston e vet. Në 2007, John Grout i renditi kostot në një raport për Agjencinë amerikane për Kërkimin dhe Cilësinë në Shëndetësi (AHRQ):",
        "Shingos Buch endet mit 112 Poka-Yoke-Beispielen aus japanischen Werken, jedes mit seinen Kosten. 2007 ordnete John Grout die Kosten in einem Bericht für die US-Agentur für Forschung und Qualität im Gesundheitswesen (AHRQ):"),
      blocks: [
        { type: "columns", max: 30, height: 120, source: ["pokayoke-grout-2007"],
          label: x("Shingo's examples by cost, in US dollars of 1986", "Shembujt e Shingo-s sipas kostos, në dollarë amerikanë të 1986", "Shingos Beispiele nach Kosten, in US-Dollar von 1986"),
          items: [
            { k: x("< $25", "< 25 $", "< 25 $"), v: 25.5, n: x("25.5%", "25,5%", "25,5 %") },
            { k: x("$25–100", "25–100 $", "25–100 $"), v: 29.1, n: x("29.1%", "29,1%", "29,1 %") },
            { k: x("$100–250", "100–250 $", "100–250 $"), v: 23.6, n: x("23.6%", "23,6%", "23,6 %") },
            { k: x("$250–1000", "250–1000 $", "250–1000 $"), v: 13.6, n: x("13.6%", "13,6%", "13,6 %") },
            { k: x("> $1000", "> 1000 $", "> 1000 $"), v: 8.2, n: x("8.2%", "8,2%", "8,2 %"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("83 of 112", "83 nga 112", "83 von 112"), t: x("stop the work when an error occurs; the other 29 only warn", "e ndalojnë punën kur ndodh gabimi; 29 të tjerat vetëm paralajmërojnë", "stoppen die Arbeit bei einem Fehler; die übrigen 29 warnen nur") },
          { n: x("3.5% → 0.01%", "3,5% → 0,01%", "3,5 % → 0,01 %"), t: x("defect rate at Arakawa Auto Body within two years, mainly through poka-yoke", "norma e defekteve te Arakawa Auto Body brenda dy vjetëve, kryesisht me poka-yoke", "Fehlerquote bei Arakawa Auto Body binnen zwei Jahren, vor allem durch Poka-Yoke") },
        ] },
        { type: "callout", reading: true, text: x(
          "When a device costs less than the hour spent arguing about it, the question is no longer money. It is whether anyone goes looking for the error.",
          "Kur një pajisje kushton më pak se ora që shkon në diskutim për të, pyetja nuk është më paraja. Është nëse dikush shkon ta kërkojë gabimin.",
          "Wenn eine Vorrichtung weniger kostet als die Stunde, in der man darüber streitet, geht es nicht mehr ums Geld, sondern darum, ob jemand nach dem Fehler sucht.") },
      ],
      note: x(
        "Shares of the examples, as tabulated by Grout; the median is about $100. The count of 83 is the sum of Shingo's own grouping. Arakawa is his account, with no year given.",
        "Pjesët e shembujve, siç i përmblodhi Grout; mesorja është rreth 100 dollarë. Numri 83 është shuma e grupimit të vetë Shingo-s. Arakawa është rrëfimi i tij, pa vit.",
        "Anteile der Beispiele, wie Grout sie auswertete; der Median liegt bei etwa 100 Dollar. Die 83 sind die Summe aus Shingos eigener Einteilung. Arakawa ist sein Bericht, ohne Jahresangabe."),
      source: ["pokayoke-grout-2007", "pokayoke-shingo-1986"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Find, reduce,", "Gjej, ul,", "Finden, verringern,"), x("eliminate", "zhduk", "beseitigen")],
      lead: x(
        "Shingo sorts inspections by what they do to defects. Errors, he argues, cannot be removed from human work. But an error becomes a defect only if nothing happens at the stage where it is made.",
        "Shingo i rendit inspektimet sipas asaj që u bëjnë defekteve. Gabimet, thotë ai, nuk hiqen dot nga puna e njeriut. Por një gabim bëhet defekt vetëm nëse nuk ndodh asgjë në fazën kur bëhet.",
        "Shingo ordnet Prüfungen danach, was sie mit Fehlern machen. Irrtümer, sagt er, lassen sich aus menschlicher Arbeit nicht entfernen. Aber ein Irrtum wird nur dann zum Fehler, wenn an der Stelle, an der er passiert, nichts geschieht."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Judgment inspection", "Inspektimi gjykues", "Urteilende Prüfung"), p: x("sorts finished products into good and bad: it protects the customer, but does not lower the defect rate", "i ndan produktet e gatshme në të mira dhe të këqija: e mbron klientin, por nuk e ul normën e defekteve", "sortiert fertige Produkte in gut und schlecht: schützt den Kunden, senkt aber die Fehlerquote nicht") },
          { h: x("Informative inspection", "Inspektimi informues", "Informierende Prüfung"), p: x("uses the defects found to correct the process: statistical control, checks at the next step, self-checks", "i përdor defektet e gjetura për ta korrigjuar procesin: kontroll statistikor, kontroll te hapi tjetër, vetëkontroll", "nutzt gefundene Fehler, um den Prozess zu korrigieren: statistische Kontrolle, Prüfung am nächsten Schritt, Selbstprüfung") },
          { h: x("Source inspection", "Inspektimi në burim", "Prüfung an der Quelle"), p: x("checks the conditions that give rise to defects and acts at the error, before it becomes a defect", "kontrollon kushtet që shkaktojnë defektet dhe vepron te gabimi, para se të bëhet defekt", "prüft die Bedingungen, aus denen Fehler entstehen, und handelt beim Irrtum, bevor er zum Fehler wird") },
        ] },
        { type: "p", text: x(
          "At Matsushita's Moriguchi television plant in 1963, statistical control had cut a 15% defect rate to 6.5%, where it stuck. Three months after checks at the next step began, it was 0.65%. Around 1967 Shingo arrived at source inspection. His Zero QC adds: check every item, not a sample, and act at once.",
          "Në fabrikën e televizorëve të Matsushita-s në Moriguchi, në 1963, kontrolli statistikor e kishte ulur normën e defekteve nga 15% në 6,5%, dhe aty kishte ngecur. Tre muaj pasi nisën kontrollet te hapi tjetër, ishte 0,65%. Rreth 1967, Shingo arriti te inspektimi në burim. Zero QC e tij shton: kontrollo çdo copë, jo një mostër, dhe vepro menjëherë.",
          "Im Fernsehwerk von Matsushita in Moriguchi hatte die statistische Kontrolle 1963 eine Fehlerquote von 15 % auf 6,5 % gesenkt, dort blieb sie stehen. Drei Monate nach Beginn der Prüfung am nächsten Schritt lag sie bei 0,65 %. Um 1967 kam Shingo zur Prüfung an der Quelle. Sein Zero QC ergänzt: jedes Stück prüfen, keine Stichprobe, und sofort handeln.") },
        { type: "callout", reading: true, text: x(
          "A defect found at the end is a report on yesterday. An error caught at the source is a defect that never existed.",
          "Një defekt i gjetur në fund është raport për të djeshmen. Një gabim i kapur në burim është një defekt që nuk ekzistoi kurrë.",
          "Ein Fehler, der am Ende gefunden wird, ist ein Bericht über gestern. Ein Irrtum, der an der Quelle erkannt wird, ist ein Fehler, den es nie gab.") },
      ],
      note: x(
        "The three inspections and the Moriguchi rates are Shingo's account (1986). The reading is the editors'.",
        "Tri inspektimet dhe normat e Moriguchi-t janë rrëfimi i Shingo-s (1986). Leximi është i redaksisë.",
        "Die drei Prüfarten und die Quoten aus Moriguchi sind Shingos Bericht (1986). Die Deutung stammt von der Redaktion."),
      source: ["pokayoke-shingo-1986"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When the warning", "Kur paralajmërimi", "Wenn die Warnung"), x("goes unheard", "nuk dëgjohet", "überhört wird")],
      lead: x(
        "Shingo ranks devices that stop the work above those that only light a lamp or sound a buzzer: a warning works only if someone notices. In 2013 the Joint Commission counted 98 alarm-related events reported to it from 2009 to mid-2012; 80 ended in death.",
        "Shingo i vë pajisjet që e ndalojnë punën mbi ato që vetëm ndezin një llambë ose bien një zile: paralajmërimi funksionon vetëm nëse e vë re dikush. Në 2013, Joint Commission numëroi 98 ngjarje të lidhura me alarmet, të raportuara te ajo nga 2009 deri në mes të 2012; 80 përfunduan me vdekje.",
        "Shingo stellt Vorrichtungen, die die Arbeit stoppen, über solche, die nur eine Lampe oder einen Summer auslösen: Eine Warnung wirkt nur, wenn jemand sie bemerkt. 2013 zählte die Joint Commission 98 alarmbezogene Ereignisse, die ihr von 2009 bis Mitte 2012 gemeldet wurden; 80 endeten tödlich."),
      blocks: [
        { type: "hbars", max: 40, source: ["pokayoke-tjc-2013"],
          label: x("Contributing factors in the 98 events, number of events", "Faktorët që kontribuuan në 98 ngjarjet, numri i ngjarjeve", "Mitursachen in den 98 Ereignissen, Zahl der Ereignisse"),
          items: [
            { k: x("Alarm turned off inappropriately", "Alarmi u fik kur nuk duhej", "Alarm unangemessen abgeschaltet"), v: 36, n: "36", alert: true },
            { k: x("Alarm system absent or inadequate", "Sistemi i alarmit mungonte ose s'mjaftonte", "Alarmsystem fehlte oder unzureichend"), v: 30, n: "30" },
            { k: x("Not audible in all areas", "Nuk dëgjohej në të gjitha zonat", "Nicht überall hörbar"), v: 25, n: "25" },
            { k: x("Improper alarm settings", "Cilësime të gabuara të alarmit", "Falsche Alarmeinstellungen"), v: 21, n: "21" },
          ] },
        { type: "p", text: x(
          "The alert estimates that 85 to 99% of alarm signals need no clinical action; a 2013 review puts false alarms at 72 to 99%. In 2026 the Institute for Safe Medication Practices ranked forcing functions highest, warnings and checklists in the middle, and reminders to “be more careful” among the lowest.",
          "Njoftimi vlerëson se 85 deri në 99% e sinjaleve të alarmit nuk kërkojnë ndërhyrje klinike; një përmbledhje e 2013 i vë alarmet e rreme në 72 deri në 99%. Në 2026, Institute for Safe Medication Practices i renditi funksionet detyruese më lart, paralajmërimet dhe listat e kontrollit në mes, dhe thirrjet “ki më shumë kujdes” ndër më të dobëtat.",
          "Die Meldung schätzt, dass 85 bis 99 % der Alarmsignale kein klinisches Eingreifen erfordern; eine Übersicht von 2013 beziffert Fehlalarme auf 72 bis 99 %. 2026 stellte das Institute for Safe Medication Practices Zwangsfunktionen an die Spitze, Warnungen und Checklisten in die Mitte und Appelle, „vorsichtiger zu sein“, zu den schwächsten.") },
        { type: "callout", reading: true, text: x(
          "An alarm that sounds all day becomes noise. Before adding one, ask whether the step could be stopped.",
          "Një alarm që bie gjithë ditën bëhet zhurmë. Para se të shtosh një, pyet nëse hapi mund të ndalohet.",
          "Ein Alarm, der den ganzen Tag ertönt, wird zu Lärm. Vor jedem neuen fragen: Ließe sich der Schritt stoppen?") },
      ],
      note: x(
        "Reporting is voluntary and covers a small share of events; one event can have several factors. The counts show kinds of failure, not frequency.",
        "Raportimi është vullnetar dhe mbulon një pjesë të vogël të ngjarjeve; një ngjarje mund të ketë disa faktorë. Numrat tregojnë llojet e dështimit, jo shpeshtësinë.",
        "Meldungen sind freiwillig und erfassen nur einen kleinen Teil der Ereignisse; ein Ereignis kann mehrere Ursachen haben. Die Zahlen zeigen Arten des Versagens, nicht die Häufigkeit."),
      source: ["pokayoke-shingo-1986", "pokayoke-tjc-2013", "pokayoke-sendelbach-2013", "pokayoke-ismp-2026"],
    },
    {
      id: "measure", more: "where-part-of-the-order-goes-missing",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Shape, count,", "Forma, numri,", "Form, Anzahl,"), x("sequence", "radha", "Reihenfolge")],
      lead: x(
        "Shingo names three ways for a device to detect an error. Then it either stops the work, the stronger response, or warns with a light or a sound.",
        "Shingo përmend tri mënyra si një pajisje e kap gabimin. Pastaj ose e ndalon punën, përgjigjja më e fortë, ose paralajmëron me dritë a me zë.",
        "Shingo nennt drei Wege, auf denen eine Vorrichtung einen Fehler erkennt. Dann stoppt sie entweder die Arbeit, die stärkere Reaktion, oder warnt mit Licht oder Ton."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Contact", "Kontakti", "Kontakt"), p: x("checks shape or size: the part fits the guide or touches the sensor, or it does not", "kontrollon formën ose madhësinë: pjesa hyn në udhëzues ose prek sensorin, ose jo", "prüft Form oder Maß: Das Teil passt in die Führung oder berührt den Sensor, oder eben nicht") },
          { h: x("Fixed value", "Vlera fikse", "Festwert"), p: x("checks that a step was repeated the set number of times, like six nuts welded on one part", "kontrollon që një hap u përsërit aq herë sa duhet, si gjashtë dado të salduara në një pjesë", "prüft, ob ein Schritt so oft wie vorgegeben wiederholt wurde, etwa sechs Muttern an einem Teil") },
          { h: x("Motion step", "Hapat e lëvizjes", "Bewegungsschritt"), p: x("checks that the standard motions were done, in their order", "kontrollon që lëvizjet standarde u bënë, sipas radhës", "prüft, ob die Standardbewegungen ausgeführt wurden, in ihrer Reihenfolge") },
        ] },
        { type: "example", label: x("Hypothetical example, a loading ramp for home deliveries", "Shembull hipotetik, një rampë ngarkimi për dërgesat në shtëpi", "Hypothetisches Beispiel, eine Laderampe für Hauslieferungen"), rows: [
          { k: x("Fixed value", "Vlera fikse", "Festwert"), v: x("bags scanned against the order; the trolley is not released until the count matches", "qeset skanohen kundrejt porosisë; karroca nuk lëshohet derisa numri të përputhet", "Taschen gegen den Auftrag gescannt; der Wagen wird erst freigegeben, wenn die Zahl stimmt") },
          { k: x("Test", "Prova", "Test"), v: x("once a shift, a trolley with one bag missing: does the block hold?", "një herë në turn, një karrocë me një qese më pak: a e mban bllokimi?", "einmal pro Schicht ein Wagen mit einer Tasche zu wenig: Hält die Sperre?") },
        ], text: x("A device nobody tests can fail unseen. The case is invented.", "Një pajisje që nuk e provon askush mund të dështojë pa u vënë re. Rasti është i shpikur.", "Eine Vorrichtung, die niemand testet, kann unbemerkt versagen. Der Fall ist erfunden.") },
      ],
      note: x(
        "The three methods and the six nuts are Shingo's. The Lean Enterprise Institute calls the stopping kind shutdown devices, the most powerful. Grout's advice: mistake-proof the mistake-proofing.",
        "Tri metodat dhe gjashtë dadot janë të Shingo-s. Lean Enterprise Institute i quan ato që ndalojnë pajisje fikëse, më të fuqishmet. Këshilla e Grout-it: mbroje nga gabimi edhe vetë mbrojtjen.",
        "Die drei Methoden und die sechs Muttern stammen von Shingo. Das Lean Enterprise Institute nennt die stoppende Art Abschaltvorrichtungen, die wirksamsten. Grouts Rat: auch die Fehlersicherung gegen Fehler sichern."),
      source: ["pokayoke-shingo-1986", "pokayoke-lei", "pokayoke-grout-2007"],
    },
    {
      id: "tool", tool: "/tools/incomplete-control/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The poka-yoke", "Karta", "Die Poka-Yoke-"), x("card", "e poka-yoke", "Karte")],
      lead: x(
        "One card for one recurring error. Start where the error is made, not where the defect is found, and ask what in the work makes the slip possible before you ask for more attention. Incomplete Control shows where orders go out short.",
        "Një kartë për një gabim që përsëritet. Nis aty ku bëhet gabimi, jo aty ku gjendet defekti, dhe pyet çfarë në punë e bën të mundur lëshimin, para se të kërkosh më shumë vëmendje. Incomplete Control tregon ku dalin porositë të mangëta.",
        "Eine Karte für einen wiederkehrenden Fehler. Dort beginnen, wo der Irrtum passiert, nicht wo der Fehler gefunden wird, und fragen, was in der Arbeit das Versehen möglich macht, bevor man mehr Aufmerksamkeit verlangt. Incomplete Control zeigt, wo Aufträge unvollständig hinausgehen."),
      blocks: [
        { type: "form", items: [
          { h: x("The error", "Gabimi", "Der Irrtum"), hint: x("what is left out, swapped or done backwards; how often", "çfarë harrohet, ngatërrohet ose bëhet së prapthi; sa shpesh", "was fehlt, vertauscht oder verkehrt herum gemacht wird; wie oft") },
          { h: x("Where it starts", "Ku nis", "Wo er entsteht"), hint: x("the step where it is made, not where it is found", "hapi ku bëhet, jo ku gjendet", "der Schritt, in dem er passiert, nicht wo er gefunden wird") },
          { h: x("Inspection today", "Inspektimi sot", "Prüfung heute"), hint: x("judgment, informative or at the source", "gjykues, informues apo në burim", "urteilend, informierend oder an der Quelle") },
          { h: x("Method", "Metoda", "Methode"), hint: x("contact, fixed value or motion step", "kontakti, vlera fikse apo hapat e lëvizjes", "Kontakt, Festwert oder Bewegungsschritt") },
          { h: x("Stop or warn", "Ndalo apo paralajmëro", "Stoppen oder warnen"), hint: x("if it only warns: who reacts, and how fast", "nëse vetëm paralajmëron: kush reagon, dhe sa shpejt", "wenn es nur warnt: wer reagiert, und wie schnell") },
          { h: x("Test and owner", "Prova dhe përgjegjësi", "Test und Verantwortung"), hint: x("how often the device is tested, by whom, what happens when it fails", "sa shpesh provohet pajisja, nga kush, çfarë ndodh kur dështon", "wie oft die Vorrichtung getestet wird, von wem, was passiert, wenn sie versagt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Shingo (1986) and Grout (2007).",
        "Praktikë e propozuar nga redaksia, sipas Shingo-s (1986) dhe Grout-it (2007).",
        "Eine Praxis, die die Redaktion vorschlägt, nach Shingo (1986) und Grout (2007)."),
      source: ["pokayoke-shingo-1986", "pokayoke-grout-2007"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
