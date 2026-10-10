// Management Review, No. 54: The bottleneck: theory of constraints. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-54.md.
import { x, pc } from "../common.js";

export default {
  number: 54,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The bottleneck:", "Pika e ngushtë:", "Der Engpass:"), x("theory of constraints", "teoria e kufizimeve", "die Theory of Constraints")],
  sub: x(
    "Herbie on the scout hike, what published TOC cases reported, the five focusing steps, what 42 hospital projects found, three measures instead of efficiency, and a card for your own bottleneck.",
    "Herbie në ecjen e skautëve, çfarë raportuan rastet e botuara të TOC, pesë hapat e përqendrimit, çfarë gjetën 42 projekte në spitale, tri masa në vend të efikasitetit, dhe një kartë për pikën tënde të ngushtë.",
    "Herbie auf der Pfadfinderwanderung, was veröffentlichte TOC-Fälle berichteten, die fünf Fokussierungsschritte, was 42 Klinikprojekte fanden, drei Kennzahlen statt Effizienz und eine Karte für den eigenen Engpass."),
  seo: x(
    "Theory of constraints: Herbie in The Goal, what published cases reported, the five focusing steps, 42 hospital projects, three measures and a card.",
    "Teoria e kufizimeve: Herbie te The Goal, çfarë raportuan rastet e botuara, pesë hapat e përqendrimit, 42 projekte në spitale, tri masa dhe një kartë.",
    "Theory of Constraints: Herbie in The Goal, was veröffentlichte Fälle berichten, die fünf Fokussierungsschritte, 42 Klinikprojekte, drei Kennzahlen, eine Karte."),
  feature: x(
    "Issue 54 starts with the slowest boy on a scout hike in Eliyahu Goldratt's novel The Goal, looks at what published applications of the theory of constraints reported and what they leave out, sets out the five focusing steps, follows 42 projects in hospitals, including one where the queue moved to the next ward, replaces local efficiency with three measures, and ends with a card for finding and working your own bottleneck.",
    "Numri 54 nis me djalin më të ngadaltë në një ecje skautësh te romani The Goal i Eliyahu Goldratt-it, shikon çfarë raportuan zbatimet e botuara të teorisë së kufizimeve dhe çfarë lënë jashtë, shtjellon pesë hapat e përqendrimit, ndjek 42 projekte në spitale, mes tyre një ku radha kaloi te reparti tjetër, e zëvendëson efikasitetin lokal me tri masa, dhe mbyllet me një kartë për ta gjetur dhe për ta punuar pikën tënde të ngushtë.",
    "Ausgabe 54 beginnt mit dem langsamsten Jungen auf einer Pfadfinderwanderung in Eliyahu Goldratts Roman The Goal, prüft, was veröffentlichte Anwendungen der Theory of Constraints berichteten und was sie auslassen, stellt die fünf Fokussierungsschritte vor, folgt 42 Projekten in Kliniken, darunter einem, in dem die Warteschlange auf die nächste Station wanderte, ersetzt lokale Effizienz durch drei Kennzahlen und endet mit einer Karte, um den eigenen Engpass zu finden und zu bearbeiten."),
  figure: { n: pc(69), by: "Balderstone & Mabin, 1998", t: x(
    "was the average cut in lead time in 32 published applications of the theory of constraints. None of the reports the authors found described a failure.",
    "ishte shkurtimi mesatar i kohës së dorëzimit në 32 zbatime të botuara të teorisë së kufizimeve. Asnjë nga raportet që gjetën autorët nuk përshkruante dështim.",
    "betrug die durchschnittliche Verkürzung der Lieferzeit in 32 veröffentlichten Anwendungen der Theory of Constraints. Keiner der Berichte, die die Autoren fanden, beschrieb einen Fehlschlag.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Herbie sets the pace", "Herbie e cakton ritmin", "Herbie gibt das Tempo vor") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Five focusing steps", "Pesë hapat e përqendrimit", "Fünf Fokussierungsschritte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The bottleneck card", "Karta e pikës së ngushtë", "Die Engpass-Karte") },
  ],
  sources: ["toc-goldratt-cox-1984", "toc-watson-2007", "toc-balderstone-mabin-1998", "toc-mabin-balderstone-2003", "toc-panizzolo-2016", "toc-institute-5fs", "toc-bacelar-silva-2020"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every operation has one step that sets the pace for all the others. Improve anything else and the output stays the same. This issue is about finding that step, working it to the full, and noticing when it moves.",
        "Çdo operacion ka një hap që ua cakton ritmin të gjithë të tjerëve. Përmirëso çdo gjë tjetër dhe rezultati mbetet i njëjtë. Ky numër flet për ta gjetur atë hap, për ta shfrytëzuar plotësisht, dhe për ta vënë re kur zhvendoset.",
        "Jeder Betrieb hat einen Schritt, der allen anderen das Tempo vorgibt. Wer etwas anderes verbessert, erhöht die Leistung nicht. Diese Ausgabe handelt davon, diesen Schritt zu finden, ihn voll zu nutzen und zu merken, wenn er wandert."),
      body: x(
        "In 1984 Eliyahu Goldratt and Jeff Cox told the theory of constraints as a novel, The Goal. Published applications reported average cuts in lead time of around 70%, though not one report of a failure turned up. The five focusing steps show the order of the work. In 42 hospital projects, most reported gains, and in one the queue moved to the next ward. Three measures replace local efficiency.",
        "Në 1984, Eliyahu Goldratt dhe Jeff Cox e treguan teorinë e kufizimeve si roman, The Goal. Zbatimet e botuara raportuan shkurtime mesatare të kohës së dorëzimit rreth 70%, por nuk doli asnjë raport për dështim. Pesë hapat e përqendrimit tregojnë rendin e punës. Në 42 projekte në spitale, shumica raportuan përmirësime, dhe në njërin radha kaloi te reparti tjetër. Tri masa zënë vendin e efikasitetit lokal.",
        "1984 erzählten Eliyahu Goldratt und Jeff Cox die Theory of Constraints als Roman, The Goal. Veröffentlichte Anwendungen berichteten im Schnitt von rund 70 % kürzeren Lieferzeiten, doch einen Bericht über einen Fehlschlag fand man nicht. Die fünf Fokussierungsschritte zeigen die Reihenfolge der Arbeit. In 42 Klinikprojekten berichteten die meisten von Verbesserungen, in einem wanderte die Warteschlange auf die nächste Station. Drei Kennzahlen ersetzen lokale Effizienz."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Herbie sets", "Herbie e cakton", "Herbie gibt"), x("the pace", "ritmin", "das Tempo vor")],
      lead: x(
        "In The Goal (1984), plant manager Alex Rogo leads his son's scout troop on a hike. The line stretches out. The boys cannot overtake the one in front, and the slowest of them, Herbie, decides how fast the whole troop moves.",
        "Te The Goal (1984), drejtori i fabrikës Alex Rogo e çon në ecje grupin e skautëve të të birit. Rreshti zgjatet. Djemtë nuk mund ta kalojnë atë që kanë përpara, dhe më i ngadalti, Herbie, vendos sa shpejt ecën i gjithë grupi.",
        "In The Goal (1984) führt Werksleiter Alex Rogo die Pfadfindergruppe seines Sohnes auf eine Wanderung. Die Reihe zieht sich auseinander. Die Jungen können den Vordermann nicht überholen, und der langsamste, Herbie, bestimmt, wie schnell die ganze Gruppe vorankommt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Dependent events", "Ngjarje të varura", "Abhängige Ereignisse"), p: x("each hiker can go only as fast as the one ahead allows", "çdo ecës shkon vetëm aq shpejt sa e lejon ai përpara", "jeder ist nur so schnell, wie der Vordermann zulässt") },
          { h: x("Fluctuations", "Luhatjet", "Schwankungen"), p: x("the delays add up along the line; the gains do not make up for them", "vonesat mblidhen përgjatë rreshtit; fitimet nuk i kompensojnë", "Verzögerungen addieren sich; Zeitgewinne gleichen sie nicht aus") },
          { h: x("Bottleneck", "Pika e ngushtë", "Engpass"), p: x("in Goldratt's terms, any resource with less capacity than the demand on it", "sipas Goldratt-it, çdo burim me kapacitet më të vogël se kërkesa ndaj tij", "nach Goldratt jede Ressource mit weniger Kapazität als Nachfrage") },
        ] },
        { type: "p", text: x(
          "Alex puts Herbie at the front, and the boys share out his heavy pack. The troop stays together and walks faster. Goldratt wrote the novel for workers in plants using his scheduling software, OPT. Its schedules left some stations idle; measured on their own efficiency, workers kept busy and built stock.",
          "Alex e vë Herbie-n në krye, dhe djemtë ndajnë mes tyre çantën e tij të rëndë. Grupi qëndron bashkë dhe ecën më shpejt. Goldratt-i e shkroi romanin për punëtorët e fabrikave që përdornin programin e tij të planifikimit, OPT. Planet e tij linin disa stacione pa punë; të matur me efikasitetin e tyre, punëtorët rrinin të zënë dhe shtonin stokun.",
          "Alex stellt Herbie an die Spitze, und die Jungen teilen seinen schweren Rucksack unter sich auf. Die Gruppe bleibt zusammen und geht schneller. Goldratt schrieb den Roman für Beschäftigte in Werken, die seine Planungssoftware OPT nutzten. Deren Pläne ließen manche Stationen stillstehen; an der eigenen Effizienz gemessen, blieben die Leute beschäftigt und produzierten auf Lager.") },
        { type: "callout", reading: true, text: x(
          "Everyone busy is not the same as everything moving. The line goes at Herbie's pace, however fast the others walk.",
          "Të gjithë të zënë nuk do të thotë se gjithçka lëviz. Rreshti ecën me ritmin e Herbie-t, sado shpejt të ecin të tjerët.",
          "Alle beschäftigt heißt nicht, dass alles fließt. Die Reihe geht in Herbies Tempo, egal wie schnell die anderen laufen.") },
      ],
      note: x(
        "The hike is fiction from the novel; we know it from summaries, not from the book itself. Why the book was written follows Watson, Blackstone and Gardiner (2007).",
        "Ecja është trillim i romanit; e njohim nga përmbledhjet, jo nga vetë libri. Pse u shkrua libri ndjek Watson-in, Blackstone-in dhe Gardiner-in (2007).",
        "Die Wanderung ist Fiktion aus dem Roman; wir kennen sie aus Zusammenfassungen, nicht aus dem Buch. Warum es entstand, folgt Watson, Blackstone und Gardiner (2007)."),
      source: ["toc-goldratt-cox-1984", "toc-watson-2007"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What the cases", "Çfarë raportuan", "Was die Fälle"), x("reported", "rastet", "berichteten")],
      lead: x(
        "Steven Balderstone and Victoria Mabin, at Victoria University of Wellington, searched the literature on the theory of constraints. Of over 100 case reports, 77 companies gave figures. The averages, with the number of cases behind each:",
        "Steven Balderstone dhe Victoria Mabin, në Victoria University of Wellington, kërkuan literaturën për teorinë e kufizimeve. Nga mbi 100 raporte rastesh, 77 kompani dhanë shifra. Mesataret, me numrin e rasteve pas secilës:",
        "Steven Balderstone und Victoria Mabin (Victoria University of Wellington) durchsuchten die Literatur zur Theory of Constraints. Aus über 100 Fallberichten lieferten 77 Unternehmen Zahlen. Die Mittelwerte, mit der Zahl der Fälle:"),
      blocks: [
        { type: "hbars", source: ["toc-balderstone-mabin-1998"],
          label: x("Mean change reported in published TOC applications, 1998", "Ndryshimi mesatar i raportuar në zbatimet e botuara të TOC, 1998", "Mittlere berichtete Veränderung in veröffentlichten TOC-Anwendungen, 1998"),
          items: [
            { k: x("Lead time, shorter (32 cases)", "Koha e dorëzimit, më e shkurtër (32 raste)", "Lieferzeit, kürzer (32 Fälle)"), v: 69, n: pc(69) },
            { k: x("Cycle time, shorter (14)", "Koha e ciklit, më e shkurtër (14)", "Durchlaufzeit, kürzer (14)"), v: 66, n: pc(66) },
            { k: x("Revenue or throughput, higher (18)", "Të ardhurat ose throughput-i, më lart (18)", "Umsatz oder Durchsatz, höher (18)"), v: 68, n: pc(68) },
            { k: x("Inventory, lower (28)", "Stoku, më poshtë (28)", "Bestand, niedriger (28)"), v: 50, n: pc(50) },
          ] },
        { type: "p", text: x(
          "In their 2003 article, with over 80 applications, the means were close: lead time 70% shorter, cycle time 65% shorter, inventory 49% lower. In both searches the authors found no report of a failure.",
          "Te artikulli i tyre i 2003, me mbi 80 zbatime, mesataret ishin të afërta: koha e dorëzimit 70% më e shkurtër, koha e ciklit 65% më e shkurtër, stoku 49% më i ulët. Në të dyja kërkimet autorët nuk gjetën asnjë raport për dështim.",
          "In ihrem Artikel von 2003, mit über 80 Anwendungen, lagen die Mittelwerte nahe: Lieferzeit 70 % kürzer, Durchlaufzeit 65 % kürzer, Bestand 49 % niedriger. In beiden Recherchen fanden die Autoren keinen Bericht über einen Fehlschlag.") },
        { type: "callout", reading: true, text: x(
          "An average of published successes is not an average of attempts. It shows what is possible, not what to expect.",
          "Mesatarja e sukseseve të botuara nuk është mesatare e përpjekjeve. Tregon çfarë është e mundur, jo çfarë të presësh.",
          "Ein Mittelwert veröffentlichter Erfolge ist kein Mittelwert aller Versuche. Er zeigt, was möglich ist, nicht, was zu erwarten ist.") },
      ],
      note: x(
        "Reports by the companies or their authors, mostly from manufacturing in North America; the revenue mean leaves out one rise of 600%. The 2003 means as a later study cites them.",
        "Raporte të kompanive ose të autorëve të tyre, kryesisht nga prodhimi në Amerikën e Veriut; mesatarja e të ardhurave lë jashtë një rritje prej 600%. Mesataret e 2003 siç i citon një studim i mëvonshëm.",
        "Berichte der Unternehmen oder ihrer Autoren, meist aus der Fertigung in Nordamerika; der Umsatzmittelwert lässt einen Anstieg um 600 % weg. Die Mittelwerte von 2003 so, wie eine spätere Studie sie zitiert."),
      source: ["toc-balderstone-mabin-1998", "toc-mabin-balderstone-2003", "toc-panizzolo-2016"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five focusing", "Pesë hapat", "Fünf Fokussierungs-"), x("steps", "e përqendrimit", "schritte")],
      lead: x(
        "The Goal sets out the order in which the theory of constraints is put to work. Later accounts add two things to do first: define the system and its purpose, and choose measures that tie it to that purpose.",
        "The Goal e shtjellon rendin me të cilin vihet në punë teoria e kufizimeve. Përshkrimet e mëvonshme shtojnë dy gjëra për t'u bërë më parë: përcakto sistemin dhe qëllimin e tij, dhe zgjidh masat që e lidhin me atë qëllim.",
        "The Goal legt die Reihenfolge fest, in der die Theory of Constraints angewendet wird. Spätere Darstellungen setzen zwei Dinge davor: das System und seinen Zweck bestimmen und Kennzahlen wählen, die es an diesen Zweck binden."),
      blocks: [
        { type: "steps", items: [
          { h: x("Identify the constraint", "Gjej kufizimin", "Den Engpass finden"), p: x("the one step that limits the output of the whole", "hapin që kufizon rezultatin e të gjithë sistemit", "den Schritt, der die Leistung des Ganzen begrenzt") },
          { h: x("Exploit it", "Shfrytëzoje", "Ihn ausschöpfen"), p: x("get the most from it with the resources you already have", "nxirr prej tij sa më shumë me burimet që ke tashmë", "das Meiste aus ihm holen, mit den Mitteln, die schon da sind") },
          { h: x("Subordinate everything else", "Vëri gjithçka tjetër në shërbim të tij", "Alles andere unterordnen"), p: x("the other steps work at its pace, not at their own", "hapat e tjerë punojnë me ritmin e tij, jo me të tyrin", "die übrigen Schritte arbeiten in seinem Tempo, nicht im eigenen") },
          { h: x("Elevate it", "Zgjeroje", "Ihn erweitern"), p: x("add capacity there, only if more output is still needed", "shto kapacitet aty, vetëm nëse ende duhet më shumë rezultat", "dort Kapazität hinzufügen, nur wenn noch mehr Leistung nötig ist") },
          { h: x("Do not let inertia set in", "Mos lejo që të zërë vend inercia", "Keine Trägheit einkehren lassen"), p: x("if the constraint has moved, start again", "nëse kufizimi është zhvendosur, nis nga e para", "wenn der Engpass gewandert ist, von vorn beginnen") },
        ] },
        { type: "p", text: x(
          "A constraint can be physical, when capacity is below demand; the market, when demand is below capacity; or a policy, a written or unwritten rule that holds the system back.",
          "Kufizimi mund të jetë fizik, kur kapaciteti është nën kërkesën; tregu, kur kërkesa është nën kapacitetin; ose një politikë, një rregull i shkruar ose i pashkruar që e frenon sistemin.",
          "Ein Engpass kann physisch sein, wenn die Kapazität unter der Nachfrage liegt; der Markt, wenn die Nachfrage unter der Kapazität liegt; oder eine Regel, geschrieben oder ungeschrieben, die das System bremst.") },
        { type: "callout", reading: true, text: x(
          "Exploit comes before elevate. The cheapest hour of capacity is the one the bottleneck loses today, waiting.",
          "Shfrytëzimi vjen para zgjerimit. Ora më e lirë e kapacitetit është ajo që pika e ngushtë e humb sot duke pritur.",
          "Ausschöpfen kommt vor Erweitern. Die billigste Stunde Kapazität ist die, die der Engpass heute mit Warten verliert.") },
      ],
      note: x(
        "Steps after the Theory of Constraints Institute; the prerequisites and the three kinds of constraint after Watson et al. (2007), who cite the APICS Dictionary. The reading is the editors'.",
        "Hapat sipas Theory of Constraints Institute; parakushtet dhe tri llojet e kufizimit sipas Watson et al. (2007), që citojnë fjalorin e APICS. Leximi është i redaksisë.",
        "Die Schritte nach dem Theory of Constraints Institute; die Voraussetzungen und die drei Arten von Engpässen nach Watson et al. (2007), die das APICS Dictionary zitieren. Die Deutung stammt von der Redaktion."),
      source: ["toc-goldratt-cox-1984", "toc-institute-5fs", "toc-watson-2007"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When the queue", "Kur radha", "Wenn die Schlange"), x("moves on", "zhvendoset", "weiterzieht")],
      lead: x(
        "Gabriel Bacelar-Silva, James Cox and Pedro Rodrigues reviewed 42 uses of the theory of constraints in healthcare, from journals, theses and conference talks, up to 2020. The five focusing steps were the method used most, in 76%. Share of projects that reported a gain:",
        "Gabriel Bacelar-Silva, James Cox dhe Pedro Rodrigues shqyrtuan 42 zbatime të teorisë së kufizimeve në shëndetësi, nga revista, teza dhe ligjërata konferencash, deri në 2020. Pesë hapat e përqendrimit ishin metoda më e përdorur, në 76%. Pjesa e projekteve që raportuan përmirësim:",
        "Gabriel Bacelar-Silva, James Cox und Pedro Rodrigues prüften 42 Anwendungen der Theory of Constraints im Gesundheitswesen, aus Zeitschriften, Abschlussarbeiten und Konferenzvorträgen, bis 2020. Die fünf Fokussierungsschritte waren die meistgenutzte Methode, in 76 %. Anteil der Projekte, die eine Verbesserung meldeten:"),
      blocks: [
        { type: "hbars", source: ["toc-bacelar-silva-2020"],
          label: x("42 TOC projects in healthcare, 2020", "42 projekte TOC në shëndetësi, 2020", "42 TOC-Projekte im Gesundheitswesen, 2020"),
          items: [
            { k: x("Productivity", "Produktiviteti", "Produktivität"), v: 98, n: pc(98) },
            { k: x("Timeliness of care", "Kujdesi në kohë", "Rechtzeitige Versorgung"), v: 83, n: pc(83) },
            { k: x("Quality of care", "Cilësia e kujdesit", "Qualität der Versorgung"), v: 48, n: pc(48) },
            { k: x("Finances", "Financat", "Finanzen"), v: 29, n: pc(29), alert: true },
          ] },
        { type: "p", text: x(
          "Where they were measured, waiting times fell by half on average. Three projects reported no change. In one, more patients got through, and the ward and the follow-up care after it became congested.",
          "Aty ku u matën, kohët e pritjes ranë mesatarisht përgjysmë. Tre projekte nuk raportuan ndryshim. Në njërin, kaluan më shumë pacientë, dhe reparti e kujdesi pas tij u mbingarkuan.",
          "Wo sie gemessen wurden, sanken die Wartezeiten im Schnitt um die Hälfte. Drei Projekte meldeten keine Veränderung. In einem kamen mehr Patienten durch, und die Station und die Weiterbehandlung danach waren überlastet.") },
        { type: "callout", reading: true, text: x(
          "Lift one bottleneck and the queue moves to the next. That is why the fifth step exists.",
          "Hiq një pikë të ngushtë dhe radha kalon te tjetra. Për këtë ekziston hapi i pestë.",
          "Wer einen Engpass löst, schickt die Schlange zum nächsten. Dafür gibt es den fünften Schritt.") },
      ],
      note: x(
        "The authors call their review exploratory: few projects, data often incomplete, no statistical tests, and most applied only parts of the method.",
        "Autorët e quajnë shqyrtimin e tyre eksplorues: pak projekte, të dhëna shpesh jo të plota, pa prova statistikore, dhe shumica zbatuan vetëm pjesë të metodës.",
        "Die Autoren nennen ihre Übersicht explorativ: wenige Projekte, oft lückenhafte Daten, keine statistischen Tests, und die meisten wendeten nur Teile der Methode an."),
      source: ["toc-bacelar-silva-2020"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Three measures,", "Tri masa,", "Drei Kennzahlen,"), x("one pace", "një ritëm", "ein Takt")],
      lead: x(
        "In place of the efficiency of each station, The Goal measures the plant as a whole with three numbers. Its aim: raise throughput while cutting inventory and operating expense.",
        "Në vend të efikasitetit të çdo stacioni, The Goal e mat fabrikën si një të tërë me tre numra. Synimi: rrit throughput-in duke ulur stokun dhe shpenzimet operative.",
        "Statt der Effizienz jeder Station misst The Goal das Werk als Ganzes mit drei Zahlen. Das Ziel: den Durchsatz steigern und zugleich Bestand und Betriebskosten senken."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Throughput", "Throughput-i", "Durchsatz"), p: x("the rate at which the system makes money through sales", "ritmi me të cilin sistemi fiton para nga shitjet", "die Rate, mit der das System durch Verkäufe Geld erwirtschaftet") },
          { h: x("Inventory", "Stoku", "Bestand"), p: x("the money tied up in things it intends to sell", "paratë e investuara në gjëra që synon t'i shesë", "das Geld, das in Dingen steckt, die es verkaufen will") },
          { h: x("Operating expense", "Shpenzimet operative", "Betriebskosten"), p: x("the money spent to turn inventory into throughput", "paratë që shpenzohen për ta kthyer stokun në throughput", "das Geld, das ausgegeben wird, um Bestand in Durchsatz zu verwandeln") },
        ] },
        { type: "p", text: x(
          "Keeping to the schedule is a fair measure at the constraint. Elsewhere, running at full output only builds stock.",
          "Mbajtja e planit është masë e drejtë te kufizimi. Gjetkë, puna me kapacitet të plotë vetëm shton stokun.",
          "Am Engpass ist Plantreue eine faire Kennzahl. Anderswo baut volle Auslastung nur Bestand auf.") },
        { type: "example", label: x("Hypothetical example, an evening shift in a dispatch area", "Shembull hipotetik, një turn mbrëmjeje në një zonë nisjeje", "Hypothetisches Beispiel, eine Spätschicht im Versand"), rows: [
          { k: x("Constraint", "Kufizimi", "Engpass"), v: x("the loading ramp: 4 doors, 16 door-hours", "rampa e ngarkimit: 4 dyer, 16 orë-derë", "die Laderampe: 4 Tore, 16 Torstunden") },
          { k: x("Lost there", "Humbur aty", "Dort verloren"), v: x("2.5 door-hours waiting for trolleys", "2,5 orë-derë në pritje të karrocave", "2,5 Torstunden Warten auf Rollwagen") },
          { k: x("Elsewhere", "Gjetkë", "Anderswo"), v: x("picking at 105% of plan, 30 trolleys queuing", "mbledhja në 105% të planit, 30 karroca në radhë", "Kommissionierung bei 105 % des Plans, 30 Rollwagen in der Schlange") },
        ], text: x("Picking looks best and the ramp loses the most. The numbers are invented.", "Mbledhja duket më mirë se gjithçka, dhe rampa humbet më shumë. Numrat janë të shpikur.", "Die Kommissionierung sieht am besten aus, die Rampe verliert am meisten. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The three measures and their definitions are Goldratt's, as Watson et al. (2007) and a textbook glossary give them. The example is the editors'.",
        "Tri masat dhe përkufizimet e tyre janë të Goldratt-it, siç i japin Watson et al. (2007) dhe fjalori i një teksti universitar. Shembulli është i redaksisë.",
        "Die drei Kennzahlen und ihre Definitionen stammen von Goldratt, wie Watson et al. (2007) und das Glossar eines Lehrbuchs sie wiedergeben. Das Beispiel stammt von der Redaktion."),
      source: ["toc-goldratt-cox-1984", "toc-watson-2007"],
    },
    {
      id: "tool", tool: "/tools/delay-analyzer/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The bottleneck", "Karta e pikës", "Die Engpass-"), x("card", "së ngushtë", "Karte")],
      lead: x(
        "One process, one constraint. Look for where the work waits, not where people look busiest, and write down the date when you will check whether it has moved.",
        "Një proces, një kufizim. Kërko ku pret puna, jo ku duken njerëzit më të zënë, dhe shëno datën kur do të kontrollosh nëse është zhvendosur.",
        "Ein Prozess, ein Engpass. Dort suchen, wo die Arbeit wartet, nicht dort, wo Menschen am beschäftigtsten wirken, und das Datum notieren, an dem man prüft, ob er gewandert ist."),
      blocks: [
        { type: "form", items: [
          { h: x("Process and goal", "Procesi dhe qëllimi", "Prozess und Ziel"), hint: x("where it starts and ends; what output counts", "ku nis dhe ku mbaron; cili rezultat numërohet", "wo er beginnt und endet; welche Leistung zählt") },
          { h: x("1. The constraint", "1. Kufizimi", "1. Der Engpass"), hint: x("where work queues; physical, market or a rule", "ku krijohet radha; fizik, tregu apo një rregull", "wo sich Arbeit staut; physisch, Markt oder eine Regel") },
          { h: x("2. Hours it loses", "2. Orët që humb", "2. Verlorene Stunden"), hint: x("waiting, breaks, rework; what changes at no cost", "pritje, pushime, ripunim; çfarë ndryshon pa kosto", "Warten, Pausen, Nacharbeit; was sich ohne Kosten ändern lässt"), lines: 2 },
          { h: x("3. What the others change", "3. Çfarë ndryshojnë të tjerët", "3. Was die anderen ändern"), hint: x("release, pace and priorities set by the constraint", "lëshimi, ritmi dhe përparësitë sipas kufizimit", "Freigabe, Tempo und Vorrang nach dem Engpass") },
          { h: x("4. Added capacity", "4. Kapacitet shtesë", "4. Zusätzliche Kapazität"), hint: x("only if still short after step 2; what it costs", "vetëm nëse mungon ende pas hapit 2; sa kushton", "nur wenn nach Schritt 2 noch nötig; was es kostet") },
          { h: x("5. Check again", "5. Kontrollo përsëri", "5. Erneut prüfen"), hint: x("date; where the queue is now", "data; ku është radha tani", "Datum; wo die Schlange jetzt steht") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the five focusing steps and the findings above.",
        "Praktikë e propozuar nga redaksia, sipas pesë hapave të përqendrimit dhe gjetjeve më sipër.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den fünf Fokussierungsschritten und den Befunden oben."),
      source: ["toc-institute-5fs", "toc-bacelar-silva-2020"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
