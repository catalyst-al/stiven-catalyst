// Operational treatise, Volume 4: When improvement fades, why good standards disappear. Block: Operations.
// Facts and their sources: docs/revista/traktati-operacional.md. The research is the sustainment literature (Wiltsey
// Stirman et al. 2012, Doyle et al. 2013), Normalization Process Theory (May et al. 2009, May & Finch 2009), the
// Institute for Healthcare Improvement (Scoville et al. 2016, Williams 2018) and two sources the Management Review
// already carries (Spear & Bowen 1999, Tucker & Edmondson 2003, checked at the full text for No. 15). Six chapters,
// each in the three layers: the living scene, the conceptual and scientific breakdown, the operating protocol for
// action. The scenes are constructed from the categories of work the author knows (last-mile loading, driver ramp-up,
// hotel training and night-audit handovers) and say so; no decay rate or training effect is invented.
import { x } from "../common.js";

export default {
  number: 4,
  numeral: "IV",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("When improvement fades:", "Kur përmirësimi zbehet:", "Wenn Verbesserung verblasst:"), x("why good standards disappear", "pse zhduken standardet e mira", "warum gute Standards verschwinden")],
  sub: x(
    "Why fixes lose their force, how ordinary work preserves change, and what operational managers should measure after launch: six chapters from the day after the fix to the standard that survives.",
    "Pse rregullimet e humbasin forcën, si e ruan puna e zakonshme ndryshimin dhe çfarë duhet të masin menaxherët operacionalë pas nisjes: gjashtë kapituj nga dita pas rregullimit te standardi që mbijeton.",
    "Warum Korrekturen ihre Kraft verlieren, wie gewöhnliche Arbeit Veränderung bewahrt und was operative Führungskräfte nach dem Start messen sollten: sechs Kapitel vom Tag nach der Korrektur bis zum Standard, der überlebt."),
  seo: x(
    "When improvement fades, an operational treatise: six chapters in three layers, from the day after the fix to Spear and Bowen, 125 studies and a 30/60/90 test.",
    "Kur përmirësimi zbehet, traktat operacional: gjashtë kapituj në tri shtresa, nga dita pas rregullimit te Spear e Bowen, 125 studime dhe testi 30/60/90.",
    "Wenn Verbesserung verblasst, ein operativer Traktat: sechs Kapitel in drei Ebenen, vom Tag nach der Korrektur bis Spear und Bowen, 125 Studien und 30/60/90."),
  feature: x(
    "Volume 4 follows the distinction between winning an improvement and keeping the capability. Its six chapters move from a loading point the week after a fix, a checklist on a wall and a colleague who holds the shift together to Spear and Bowen's Toyota rules, Tucker and Edmondson's first-order fixes, Normalization Process Theory and the sustainment reviews, and end with a 30/60/90-day field test and the Standard Survival Card.",
    "Vëllimi 4 e ndjek dallimin mes fitimit të një përmirësimi dhe ruajtjes së aftësisë. Gjashtë kapitujt e tij shkojnë nga një pikë ngarkimi një javë pas rregullimit, një listë kontrolli në mur dhe një koleg që e mban turnin bashkë, te rregullat e Toyota-s sipas Spear e Bowen, rregullimet e rendit të parë të Tucker e Edmondson, Teoria e Procesit të Normalizimit dhe rishikimet e qëndrueshmërisë, dhe mbyllen me një test terreni 30/60/90-ditor dhe Kartën e mbijetesës së standardit.",
    "Band 4 folgt der Unterscheidung zwischen dem Gewinnen einer Verbesserung und dem Bewahren der Fähigkeit. Seine sechs Kapitel führen von einem Ladepunkt eine Woche nach der Korrektur, einer Checkliste an der Wand und einem Kollegen, der die Schicht zusammenhält, zu den Toyota-Regeln von Spear und Bowen, den Korrekturen erster Ordnung von Tucker und Edmondson, der Normalization Process Theory und den Übersichten zur Nachhaltigkeit, und enden mit einem 30/60/90-Tage-Feldtest und dem Blatt zum Überleben des Standards."),
  figure: { n: "125", by: "Wiltsey Stirman et al., 2012", t: x(
    "studies met the inclusion criteria of a review of the sustainability of new programmes and practices. A literature count, not a success or failure rate.",
    "studime i plotësuan kriteret e një rishikimi mbi qëndrueshmërinë e programeve dhe praktikave të reja. Numër i literaturës, jo normë suksesi apo dështimi.",
    "Studien erfüllten die Einschlusskriterien einer Übersicht zur Nachhaltigkeit neuer Programme und Praktiken. Eine Literaturzahl, keine Erfolgs- oder Misserfolgsquote.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The day after the fix", "Dita pas rregullimit", "Der Tag nach der Korrektur") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("What the research can actually prove", "Çfarë mund të provojë vërtet kërkimi", "Was die Forschung wirklich belegen kann") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Standard Survival Card", "Karta e mbijetesës së standardit", "Das Blatt zum Überleben des Standards") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real work domains, never invented first-person cases.", "Fusha të vërteta pune, kurrë raste të shpikura në vetën e parë.", "Echte Arbeitsfelder, nie erfundene Fälle in der ersten Person.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Study designs, limits and populations remain attached to findings.", "Dizajni i studimit, kufijtë dhe popullatat mbeten të lidhura me gjetjet.", "Studiendesign, Grenzen und Populationen bleiben an die Befunde gebunden.") },
    { h: x("Practice", "Praktika", "Praxis"), p: x("Proposals must be tested; a template is not an achieved result.", "Propozimet duhen provuar; një model nuk është rezultat i arritur.", "Vorschläge müssen getestet werden; eine Vorlage ist kein erreichtes Ergebnis.") },
  ],
  sources: ["spear-bowen-1999", "tucker-edmondson-2003", "may-2009", "may-finch-2009", "wiltsey-stirman-2012", "ihi-sustaining-2016", "doyle-2013", "ihi-williams-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The day after", "Dita pas", "Der Tag nach"), x("the fix", "rregullimit", "der Korrektur")],
      why: x(
        "A better number is encouraging. A better system is one that can keep producing the result when attention moves elsewhere.",
        "Një numër më i mirë të jep zemër. Një sistem më i mirë është ai që vazhdon ta prodhojë rezultatin kur vëmendja shkon gjetiu.",
        "Eine bessere Zahl macht Mut. Ein besseres System ist eines, das das Ergebnis weiter hervorbringt, wenn die Aufmerksamkeit woanders hingeht."),
      body: x(
        "Operations often celebrate the moment a backlog clears, a check becomes faster or a handover becomes cleaner. There is a meeting, a new instruction and the relief of a measurable improvement. A week later the manager is occupied with something else. New people arrive, demand changes and the old conditions quietly return. If the benefit was real, why did it not last? This fourth volume follows the distinction between winning the improvement and keeping the capability. Its settings are recognisable from the author's experience: last-mile loading and driver ramp-up, shift work in hotels, and organising operational instructions. These are documented categories of work, not proof that a specific initiative later failed; the scenes are constructed and labelled as such. The argument brings together four kinds of knowledge: operational design from Spear and Bowen, learning failures studied by Tucker and Edmondson, Normalization Process Theory from May and colleagues, and research on sustaining interventions. It ends with an editable, low-risk operational test. It does not claim that one universal checklist or a 90-day calendar guarantees lasting change.",
        "Operacionet e festojnë shpesh çastin kur pastrohet një grumbull punësh, kur një kontroll bëhet më i shpejtë ose një dorëzim më i pastër. Ka një mbledhje, një udhëzim të ri dhe lehtësimin e një përmirësimi të matshëm. Një javë më vonë menaxheri është i zënë me diçka tjetër. Vijnë njerëz të rinj, kërkesa ndryshon dhe kushtet e vjetra kthehen pa zhurmë. Nëse përfitimi ishte i vërtetë, pse nuk zgjati? Ky vëllim i katërt e ndjek dallimin mes fitimit të përmirësimit dhe ruajtjes së aftësisë. Mjediset e tij njihen nga përvoja e autorit: ngarkimi në miljen e fundit dhe hyrja e shoferëve të rinj në punë, puna me turne në hotele dhe organizimi i udhëzimeve operacionale. Këto janë kategori pune të dokumentuara, jo provë se një nismë e caktuar dështoi më vonë; skenat janë të ndërtuara dhe etiketohen si të tilla. Argumenti bashkon katër lloje njohurish: projektimin operacional sipas Spear e Bowen, dështimet e të mësuarit të studiuara nga Tucker e Edmondson, Teorinë e Procesit të Normalizimit të May-t dhe kolegëve, dhe kërkimin për qëndrueshmërinë e ndërhyrjeve. Mbyllet me një test operacional të ndryshueshëm dhe me rrezik të ulët. Nuk pretendon se një listë kontrolli universale ose një kalendar 90-ditor e garanton ndryshimin e qëndrueshëm.",
        "Betriebe feiern oft den Moment, in dem ein Rückstand abgebaut ist, eine Prüfung schneller oder eine Übergabe sauberer wird. Es gibt eine Besprechung, eine neue Anweisung und die Erleichterung einer messbaren Verbesserung. Eine Woche später ist die Führungskraft mit etwas anderem beschäftigt. Neue Leute kommen, die Nachfrage ändert sich, und die alten Bedingungen kehren still zurück. Wenn der Nutzen echt war, warum hielt er nicht? Dieser vierte Band folgt der Unterscheidung zwischen dem Gewinnen der Verbesserung und dem Bewahren der Fähigkeit. Seine Schauplätze sind aus der Erfahrung des Autors vertraut: Beladung auf der letzten Meile und Einarbeitung von Fahrern, Schichtarbeit im Hotel, das Ordnen betrieblicher Anweisungen. Das sind dokumentierte Arbeitskategorien, kein Beweis, dass eine bestimmte Initiative später scheiterte; die Szenen sind konstruiert und so gekennzeichnet. Das Argument verbindet vier Arten von Wissen: betriebliche Gestaltung nach Spear und Bowen, die von Tucker und Edmondson untersuchten Lernversäumnisse, die Normalization Process Theory von May und Kollegen und die Forschung zum Erhalt von Interventionen. Es endet mit einem anpassbaren, risikoarmen Betriebstest. Es behauptet nicht, dass eine universelle Checkliste oder ein 90-Tage-Kalender dauerhafte Veränderung garantiert."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("What counts", "Çfarë quhet", "Was zählt"), x("as sustainment?", "qëndrueshmëri?", "als Fortbestand?")],
      lead: x(
        "The question is not whether a change once worked. It is whether the useful result, not merely the ritual, continues.",
        "Pyetja nuk është nëse një ndryshim funksionoi dikur. Është nëse vazhdon rezultati i dobishëm, jo thjesht rituali.",
        "Die Frage ist nicht, ob eine Veränderung einmal gewirkt hat. Sie ist, ob das nützliche Ergebnis fortbesteht, nicht bloß das Ritual."),
      blocks: [
        { type: "p", text: x(
          "Sustainability has several meanings in the research. A practice may exist on paper while actual use declines; staff may follow the steps while the customer benefit disappears; or a team may responsibly adapt the method, preserving the outcome without copying every original gesture. These are different results and should be measured separately.",
          "Qëndrueshmëria ka disa kuptime në kërkim. Një praktikë mund të ekzistojë në letër ndërsa përdorimi i vërtetë bie; stafi mund t'i ndjekë hapat ndërsa përfitimi për klientin zhduket; ose një ekip mund ta përshtatë me përgjegjësi metodën, duke e ruajtur rezultatin pa kopjuar çdo gjest fillestar. Këto janë rezultate të ndryshme dhe duhen matur veçmas.",
          "Nachhaltigkeit hat in der Forschung mehrere Bedeutungen. Eine Praxis kann auf dem Papier fortbestehen, während die Nutzung abnimmt; das Personal kann die Schritte befolgen, während der Kundennutzen verschwindet; oder ein Team passt die Methode verantwortungsvoll an und bewahrt das Ergebnis, ohne jede Geste zu kopieren. Das sind verschiedene Ergebnisse und sollten getrennt gemessen werden.") },
        { type: "figures", items: [
          { n: "125", t: x("studies included in a 2012 review", "studime të përfshira në një rishikim të 2012-s", "Studien in einer Übersicht von 2012") },
          { n: x("N/A", "S'ka", "k. A."), t: x("local decay rates measured in the author's workplaces", "norma zbehjeje të matura në vendet e punës së autorit", "lokale Verfallsraten, gemessen in den Betrieben des Autors") },
        ] },
        { type: "p", text: x(
          "Wiltsey Stirman and colleagues reviewed 125 studies of programme sustainment. Most designs were retrospective, about half relied on self-reports, and not all studies defined the term. The review does not produce one transferable failure percentage for warehouses or hotels. It shows why a claim such as “most changes fade” needs a population, a definition and a period of observation before it can be treated as evidence.",
          "Wiltsey Stirman dhe kolegët rishikuan 125 studime mbi qëndrueshmërinë e programeve. Shumica e dizajneve ishin retrospektive, rreth gjysma mbështeteshin në vetëraportime dhe jo të gjitha studimet e përkufizonin termin. Rishikimi nuk prodhon një përqindje të vetme dështimi të transferueshme për magazina apo hotele. Ai tregon pse një pohim si “shumica e ndryshimeve zbehen” ka nevojë për një popullatë, një përkufizim dhe një periudhë vëzhgimi para se të trajtohet si provë.",
          "Wiltsey Stirman und Kollegen sichteten 125 Studien zum Fortbestand von Programmen. Die meisten Designs waren retrospektiv, etwa die Hälfte stützte sich auf Selbstauskünfte, und nicht alle Studien definierten den Begriff. Die Übersicht liefert keinen übertragbaren Misserfolgsprozentsatz für Lager oder Hotels. Sie zeigt, warum eine Aussage wie „die meisten Veränderungen verblassen“ eine Population, eine Definition und einen Beobachtungszeitraum braucht, bevor sie als Beleg gelten kann.") },
        { type: "cards", cols: 3, items: [
          { h: x("Result", "Rezultati", "Ergebnis"), p: x("Has the intended outcome persisted?", "A ka vazhduar rezultati i synuar?", "Besteht das beabsichtigte Ergebnis fort?") },
          { h: x("Practice", "Praktika", "Praxis"), p: x("Is the approved method in use at the point of work?", "A përdoret metoda e miratuar në pikën e punës?", "Ist die freigegebene Methode am Ort der Arbeit in Gebrauch?") },
          { h: x("Capability", "Aftësia", "Fähigkeit"), p: x("Can a new person perform and improve it without the original champion?", "A mund ta kryejë dhe ta përmirësojë një person i ri pa nismëtarin e parë?", "Kann eine neue Person sie ohne den ursprünglichen Vorkämpfer ausführen und verbessern?") },
        ] },
        { type: "callout", reading: true, text: x(
          "A standard can remain on a wall while its operational effect has already vanished.",
          "Një standard mund të mbetet në mur, ndërsa efekti i tij operacional është zhdukur tashmë.",
          "Ein Standard kann an der Wand hängen bleiben, während seine betriebliche Wirkung längst verschwunden ist.") },
      ],
      note: x(
        "“Two coders identified 125 studies on sustainability that met eligibility criteria” (Implementation Science 7:17, 2012). The three questions are editorial, after Normalization Process Theory.",
        "“Two coders identified 125 studies on sustainability that met eligibility criteria” (Implementation Science 7:17, 2012). Tri pyetjet janë editoriale, sipas Teorisë së Procesit të Normalizimit.",
        "„Two coders identified 125 studies on sustainability that met eligibility criteria“ (Implementation Science 7:17, 2012). Die drei Fragen sind redaktionell, nach der Normalization Process Theory."),
      source: ["wiltsey-stirman-2012", "may-finch-2009"],
    },

    // Chapter I. The day after the fix
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The day after the fix", "Dita pas rregullimit", "Der Tag nach der Korrektur"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "when-improvement-fades",
          title: [x("The day after", "Dita pas", "Der Tag nach"), x("the fix", "rregullimit", "der Korrektur")],
          lead: x(
            "A loading point is orderly after a focused improvement week. What happens when the focus goes elsewhere?",
            "Një pikë ngarkimi është në rregull pas një jave përmirësimi të përqendruar. Çfarë ndodh kur përqendrimi shkon gjetiu?",
            "Ein Ladepunkt ist nach einer konzentrierten Verbesserungswoche in Ordnung. Was geschieht, wenn die Konzentration woanders hingeht?"),
          blocks: [
            { type: "flag", text: x("Constructed scene, not a reported personal incident", "Skenë e ndërtuar, jo ngjarje personale e raportuar", "Konstruierte Szene, kein gemeldeter persönlicher Vorfall") },
            { type: "p", text: x(
              "Consider a loading team that has recently reorganised its trolley checks. A visible reminder has been added, the handover is tidier and fewer questions interrupt departures. Then the person who introduced the change moves to another priority. Two new colleagues arrive. On a busy morning one part of the check is abbreviated to save time, and nobody can agree whether that exception is allowed. By the third week, different shifts believe they are following the same rule while actually doing different things.",
              "Merr një ekip ngarkimi që kohët e fundit i ka riorganizuar kontrollet e karrocave. Është shtuar një kujtesë e dukshme, dorëzimi është më i rregullt dhe më pak pyetje i ndërpresin nisjet. Pastaj personi që e futi ndryshimin kalon te një prioritet tjetër. Vijnë dy kolegë të rinj. Një mëngjes të ngarkuar, një pjesë e kontrollit shkurtohet për të kursyer kohë, dhe askush nuk bie dakord nëse ai përjashtim lejohet. Në javën e tretë, turne të ndryshme besojnë se po ndjekin të njëjtin rregull, ndërsa në fakt bëjnë gjëra të ndryshme.",
              "Stellen Sie sich ein Ladeteam vor, das kürzlich seine Wagenkontrollen neu geordnet hat. Eine sichtbare Erinnerung wurde angebracht, die Übergabe ist ordentlicher, weniger Fragen unterbrechen die Abfahrten. Dann wechselt die Person, die die Änderung eingeführt hat, zu einer anderen Priorität. Zwei neue Kollegen kommen. An einem vollen Morgen wird ein Teil der Kontrolle verkürzt, um Zeit zu sparen, und niemand ist sich einig, ob diese Ausnahme erlaubt ist. In der dritten Woche glauben verschiedene Schichten, derselben Regel zu folgen, während sie tatsächlich Verschiedenes tun.") },
            { type: "p", text: x(
              "This is not an account of a measured decline in the author's workplace. Missing bags, mixed trolleys, loading discipline and the difficulties of ramp-up were real areas of operational attention. The sequence, timing, improvement programme and resulting erosion here are invented to expose a mechanism. One manager may see a flattering chart and assume that the new standard has been adopted. One worker may see a procedure that needs a certain colleague standing nearby to function. Neither view is enough. To understand whether the change will survive, we need to know whether it has become routine work, whether failures are visible and whether the team knows what to do when the conditions of the original trial are absent.",
              "Ky nuk është rrëfim i një rënieje të matur në vendin e punës së autorit. Çantat që mungojnë, karrocat e përziera, disiplina e ngarkimit dhe vështirësitë e hyrjes në punë ishin fusha të vërteta të vëmendjes operacionale. Radha, koha, programi i përmirësimit dhe zbehja që vjen pas janë shpikur për ta nxjerrë në pah një mekanizëm. Një menaxher mund të shohë një grafik lajkatar dhe të supozojë se standardi i ri është përvetësuar. Një punonjës mund të shohë një procedurë që funksionon vetëm kur një koleg i caktuar qëndron aty pranë. Asnjëra pamje nuk mjafton. Për të kuptuar nëse ndryshimi do të mbijetojë, duhet të dimë nëse është bërë punë rutinë, nëse dështimet janë të dukshme dhe nëse ekipi di çfarë të bëjë kur kushtet e provës fillestare mungojnë.",
              "Dies ist kein Bericht über einen gemessenen Rückgang im Betrieb des Autors. Fehlende Taschen, gemischte Wagen, Ladedisziplin und die Schwierigkeiten der Einarbeitung waren echte Felder betrieblicher Aufmerksamkeit. Abfolge, Zeitpunkt, Verbesserungsprogramm und die folgende Erosion sind hier erfunden, um einen Mechanismus sichtbar zu machen. Eine Führungskraft mag ein schmeichelhaftes Diagramm sehen und annehmen, der neue Standard sei übernommen. Ein Mitarbeiter mag ein Verfahren sehen, das nur funktioniert, wenn ein bestimmter Kollege danebensteht. Keine der beiden Sichten reicht. Um zu verstehen, ob die Veränderung überlebt, müssen wir wissen, ob sie Routinearbeit geworden ist, ob Fehler sichtbar sind und ob das Team weiß, was zu tun ist, wenn die Bedingungen des ursprünglichen Versuchs fehlen.") },
            { type: "callout", reading: true, text: x(
              "The day of implementation is the beginning of the sustainability test, not the end of it.",
              "Dita e zbatimit është fillimi i provës së qëndrueshmërisë, jo fundi i saj.",
              "Der Tag der Einführung ist der Anfang der Nachhaltigkeitsprüfung, nicht ihr Ende.") },
          ],
          note: x(
            "Constructed from the author's last-mile categories; the essay named below tells the same shape from the dispatch desk.",
            "E ndërtuar nga kategoritë e miljes së fundit të autorit; eseja e emërtuar më poshtë e tregon të njëjtën formë nga tavolina e dispeçerisë.",
            "Konstruiert aus den Last-Mile-Kategorien des Autors; der unten genannte Essay erzählt dieselbe Form vom Dispositionsschreibtisch aus."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Three ways a", "Tri mënyra si", "Drei Wege, wie"), x("fix can disappear", "zhduket një rregullim", "eine Korrektur verschwindet")],
          lead: x(
            "A lost outcome, a lost practice and a lost capability are not interchangeable. The first failure is performance decay: the measure drifts back towards the former level. The second is practice decay: the written process remains, but daily steps are shortened, misunderstood or skipped. The third is capability decay: the process works only when a particularly experienced employee is present to correct exceptions.",
            "Një rezultat i humbur, një praktikë e humbur dhe një aftësi e humbur nuk janë e njëjta gjë. Dështimi i parë është zbehja e performancës: matja rrëshqet drejt nivelit të mëparshëm. I dyti është zbehja e praktikës: procesi i shkruar mbetet, por hapat e përditshëm shkurtohen, keqkuptohen ose kapërcehen. I treti është zbehja e aftësisë: procesi funksionon vetëm kur është i pranishëm një punonjës veçanërisht me përvojë që i korrigjon përjashtimet.",
            "Ein verlorenes Ergebnis, eine verlorene Praxis und eine verlorene Fähigkeit sind nicht austauschbar. Der erste Fehler ist der Leistungsverfall: Die Kennzahl driftet zum früheren Niveau zurück. Der zweite ist der Praxisverfall: Der schriftliche Prozess bleibt, aber tägliche Schritte werden verkürzt, missverstanden oder übersprungen. Der dritte ist der Fähigkeitsverfall: Der Prozess funktioniert nur, wenn ein besonders erfahrener Mitarbeiter da ist, um Ausnahmen zu korrigieren."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Outcome", "Rezultati", "Ergebnis"), p: x("The customer or downstream team still gets the intended result.", "Klienti ose ekipi më poshtë në zinxhir e merr ende rezultatin e synuar.", "Der Kunde oder das nachgelagerte Team erhält weiterhin das beabsichtigte Ergebnis.") },
              { h: x("Fidelity", "Besnikëria", "Treue"), p: x("The agreed critical steps are being performed, or an approved adaptation is documented.", "Hapat kritikë të rënë dakord kryhen, ose një përshtatje e miratuar është e dokumentuar.", "Die vereinbarten kritischen Schritte werden ausgeführt, oder eine freigegebene Anpassung ist dokumentiert.") },
              { h: x("Transfer", "Transferimi", "Übertragung"), p: x("A trained substitute can do the work and find authorised help when it fails.", "Një zëvendësues i trajnuar e bën dot punën dhe gjen ndihmë të autorizuar kur ajo dështon.", "Ein geschulter Ersatz kann die Arbeit tun und befugte Hilfe finden, wenn sie scheitert.") },
            ] },
            { type: "p", text: x(
              "An attractive performance chart cannot show these three conditions by itself. Conversely, an audit that checks only whether every box was ticked may penalise a safe and necessary adaptation. Sustainment research treats continued delivery and the evolution of a practice as more complicated than permanent repetition of the original script, and warns that apparently positive reports may rely on staff recollection rather than direct observation. For an operational manager the practical distinction is simple: verify what the process produces, verify what people actually do, and verify whether the result depends on one individual. Those checks must use the same definition across shifts and over time, or comparison becomes cosmetic.",
              "Një grafik tërheqës i performancës nuk i tregon dot vetë këto tri kushte. Anasjelltas, një auditim që kontrollon vetëm nëse çdo kuti është shënuar mund ta ndëshkojë një përshtatje të sigurt dhe të nevojshme. Kërkimi për qëndrueshmërinë e trajton vazhdimin e shërbimit dhe evolucionin e një praktike si më të ndërlikuara se përsëritja e përhershme e skenarit fillestar, dhe paralajmëron se raportet në dukje pozitive mund të mbështeten në kujtesën e stafit, jo në vëzhgim të drejtpërdrejtë. Për një menaxher operacional dallimi praktik është i thjeshtë: verifiko çfarë prodhon procesi, verifiko çfarë bëjnë vërtet njerëzit, dhe verifiko nëse rezultati varet nga një individ i vetëm. Këto kontrolle duhet të përdorin të njëjtin përkufizim nëpër turne dhe në kohë, përndryshe krahasimi bëhet kozmetik.",
              "Ein ansprechendes Leistungsdiagramm kann diese drei Bedingungen allein nicht zeigen. Umgekehrt kann ein Audit, das nur prüft, ob jedes Kästchen angekreuzt wurde, eine sichere und nötige Anpassung bestrafen. Die Forschung zum Fortbestand behandelt die fortgesetzte Leistung und die Weiterentwicklung einer Praxis als komplizierter als die ewige Wiederholung des ursprünglichen Skripts und warnt, dass scheinbar positive Berichte auf der Erinnerung des Personals statt auf direkter Beobachtung beruhen können. Für eine operative Führungskraft ist die praktische Unterscheidung einfach: prüfen, was der Prozess hervorbringt, prüfen, was die Leute tatsächlich tun, und prüfen, ob das Ergebnis von einer einzelnen Person abhängt. Diese Prüfungen müssen über Schichten und über die Zeit dieselbe Definition verwenden, sonst wird der Vergleich kosmetisch.") },
            { type: "callout", reading: true, text: x(
              "Keep the purpose stable; inspect whether the method still serves it.",
              "Mbaje qëllimin të qëndrueshëm; kontrollo nëse metoda i shërben ende.",
              "Halten Sie den Zweck stabil; prüfen Sie, ob die Methode ihm noch dient.") },
          ],
          note: x(
            "The three decays and the three rows are editorial; the warnings about definitions and self-reports are Wiltsey Stirman et al. (2012), the work design Spear and Bowen (1999).",
            "Tri zbehjet dhe tri rreshtat janë editoriale; paralajmërimet për përkufizimet dhe vetëraportimet janë të Wiltsey Stirman et al. (2012), projektimi i punës i Spear dhe Bowen (1999).",
            "Die drei Verfallsarten und die drei Zeilen sind redaktionell; die Warnungen zu Definitionen und Selbstauskünften stammen von Wiltsey Stirman et al. (2012), die Arbeitsgestaltung von Spear und Bowen (1999)."),
          source: ["wiltsey-stirman-2012", "spear-bowen-1999"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Define the benefit", "Përkufizo përfitimin", "Den Nutzen definieren,"), x("before defending it", "para se ta mbrosh", "bevor Sie ihn verteidigen")],
          lead: x(
            "The first sustainability control is a clear statement of what should remain true.",
            "Kontrolli i parë i qëndrueshmërisë është një pohim i qartë i asaj që duhet të mbetet e vërtetë.",
            "Die erste Nachhaltigkeitskontrolle ist eine klare Aussage darüber, was wahr bleiben soll."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name the customer result", "Emërto rezultatin për klientin", "Das Kundenergebnis benennen"), p: x("The specific downstream outcome, not “people followed the new process” as the sole result.", "Rezultati i caktuar më poshtë në zinxhir, jo “njerëzit ndoqën procesin e ri” si rezultat i vetëm.", "Das konkrete nachgelagerte Ergebnis, nicht „die Leute folgten dem neuen Prozess“ als einziges Ergebnis.") },
              { h: x("State the critical condition", "Thuaj kushtin kritik", "Die kritische Bedingung festhalten"), p: x("The few requirements that protect quality, service or safety.", "Të paktat kërkesa që mbrojnë cilësinë, shërbimin ose sigurinë.", "Die wenigen Anforderungen, die Qualität, Service oder Sicherheit schützen.") },
              { h: x("Record the baseline", "Shëno gjendjen fillestare", "Die Ausgangslage festhalten"), p: x("The previous state and how it was measured, including exclusions.", "Gjendja e mëparshme dhe si u mat, përfshirë përjashtimet.", "Der frühere Zustand und wie er gemessen wurde, einschließlich Ausschlüssen.") },
              { h: x("Separate success measures", "Ndaj matjet e suksesit", "Erfolgsmaße trennen"), p: x("Outcome, adherence and handover quality rather than one green status.", "Rezultati, zbatimi dhe cilësia e dorëzimit, jo një status i vetëm i gjelbër.", "Ergebnis, Einhaltung und Übergabequalität statt eines einzigen grünen Status.") },
              { h: x("Check substitution", "Kontrollo zëvendësimin", "Die Vertretung prüfen"), p: x("A trained person who did not design the change explains and performs the method.", "Një person i trajnuar që nuk e projektoi ndryshimin e shpjegon dhe e kryen metodën.", "Eine geschulte Person, die die Änderung nicht entworfen hat, erklärt und führt die Methode aus.") },
              { h: x("Choose a review owner", "Zgjidh përgjegjësin e rishikimit", "Einen Prüfverantwortlichen wählen"), p: x("A role, a review date and a route to revise the process when evidence changes.", "Një rol, një datë rishikimi dhe një rrugë për ta ndryshuar procesin kur ndryshon prova.", "Eine Rolle, ein Prüfdatum und ein Weg, den Prozess zu ändern, wenn sich die Belege ändern.") },
            ] },
            { type: "p", text: x(
              "A workplace follows its authorised procedures: this template is a proposal for process review, not permission to bypass a scan, a quality control or a compliance rule. An immediate risk takes the approved safety path before any scheduled review.",
              "Një vend pune ndjek procedurat e veta të autorizuara: ky model është propozim për rishikimin e procesit, jo leje për të anashkaluar një skanim, një kontroll cilësie apo një rregull pajtueshmërie. Një rrezik i menjëhershëm ndjek rrugën e miratuar të sigurisë para çdo rishikimi të planifikuar.",
              "Ein Betrieb folgt seinen freigegebenen Verfahren: Diese Vorlage ist ein Vorschlag für die Prozessprüfung, keine Erlaubnis, einen Scan, eine Qualitätskontrolle oder eine Compliance-Regel zu umgehen. Ein unmittelbares Risiko nimmt den freigegebenen Sicherheitsweg, vor jeder geplanten Prüfung.") },
            { type: "callout", reading: true, text: x(
              "If no one can say what success means after the launch meeting, the organisation has not defined what it wants to sustain.",
              "Nëse askush nuk e thotë dot çfarë do të thotë sukses pas mbledhjes së nisjes, organizata nuk e ka përkufizuar çfarë do të ruajë.",
              "Wenn nach der Startbesprechung niemand sagen kann, was Erfolg bedeutet, hat die Organisation nicht definiert, was sie erhalten will.") },
          ],
          note: x(
            "Editorial protocol after the IHI's Sustaining Improvement (2016) and Wiltsey Stirman et al. (2012); not a procedure certified for a named employer.",
            "Protokoll editorial sipas Sustaining Improvement të IHI-së (2016) dhe Wiltsey Stirman et al. (2012); jo procedurë e certifikuar për një punëdhënës të caktuar.",
            "Redaktionelles Protokoll nach Sustaining Improvement des IHI (2016) und Wiltsey Stirman et al. (2012); kein für einen bestimmten Arbeitgeber zertifiziertes Verfahren."),
          source: ["ihi-sustaining-2016", "wiltsey-stirman-2012"],
        },
      ],
    },

    // Chapter II. A standard is not a poster
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("A standard is not a poster", "Një standard nuk është poster", "Ein Standard ist kein Plakat"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "a-good-sop-is-not-a-document",
          title: [x("A standard is", "Një standard", "Ein Standard ist"), x("not a poster", "nuk është poster", "kein Plakat")],
          lead: x(
            "The same rule can be displayed in three places and still be interpreted differently at the work point.",
            "I njëjti rregull mund të shfaqet në tri vende dhe prapë të interpretohet ndryshe në pikën e punës.",
            "Dieselbe Regel kann an drei Stellen hängen und am Arbeitsplatz trotzdem verschieden verstanden werden."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, documented types of work", "Skenë hipotetike, lloje pune të dokumentuara", "Hypothetische Szene, dokumentierte Arbeitsarten") },
            { type: "p", text: x(
              "A new driver reaches the loading area during a demanding shift. The wall shows a short checklist. A colleague offers one explanation, another demonstrates a faster variation, and the supervisor is occupied with a departure. The new person follows the last instruction heard. The checklist has been distributed, but the method has not truly been transferred. The author's last-mile experience included clear expectations for trolley order, loading discipline, temperature-controlled handling and reporting missing items, and the challenge of bringing new drivers into the work. The particular conversation and behaviour in this scene were not documented and must not be read as a personal incident.",
              "Një shofer i ri mbërrin në zonën e ngarkimit gjatë një turni të ngarkuar. Muri tregon një listë të shkurtër kontrolli. Një koleg jep një shpjegim, një tjetër tregon një variant më të shpejtë, dhe mbikëqyrësi është i zënë me një nisje. I riu ndjek udhëzimin e fundit që dëgjoi. Lista e kontrollit është shpërndarë, por metoda nuk është transferuar vërtet. Përvoja e autorit në miljen e fundit përfshinte pritshmëri të qarta për renditjen e karrocave, disiplinën e ngarkimit, trajtimin e mallrave me temperaturë të kontrolluar dhe raportimin e artikujve që mungojnë, si dhe sfidën e futjes së shoferëve të rinj në punë. Biseda dhe sjellja e caktuar në këtë skenë nuk janë dokumentuar dhe nuk duhen lexuar si ngjarje personale.",
              "Ein neuer Fahrer erreicht den Ladebereich während einer fordernden Schicht. An der Wand hängt eine kurze Checkliste. Ein Kollege gibt eine Erklärung, ein anderer zeigt eine schnellere Variante, und der Vorgesetzte ist mit einer Abfahrt beschäftigt. Der Neue folgt der zuletzt gehörten Anweisung. Die Checkliste wurde verteilt, aber die Methode wurde nicht wirklich übertragen. Die Last-Mile-Erfahrung des Autors umfasste klare Erwartungen an Wagenordnung, Ladedisziplin, temperaturgeführte Handhabung und das Melden fehlender Artikel sowie die Herausforderung, neue Fahrer in die Arbeit zu bringen. Das konkrete Gespräch und Verhalten in dieser Szene sind nicht dokumentiert und dürfen nicht als persönlicher Vorfall gelesen werden.") },
            { type: "p", text: x(
              "A poster is an information surface. A standard is a working agreement on what result should be achieved, under which conditions and how the team can detect a departure from the agreed method. It must be understandable at the moment of execution and usable by someone who is not already an expert. Otherwise the posted instruction and the working instruction become separate systems, leaving the employee to guess which one management will judge later.",
              "Një poster është një sipërfaqe informacioni. Një standard është një marrëveshje pune për rezultatin që duhet arritur, në cilat kushte dhe si mund ta dallojë ekipi një largim nga metoda e rënë dakord. Duhet të jetë i kuptueshëm në çastin e zbatimit dhe i përdorshëm nga dikush që nuk është ende ekspert. Përndryshe udhëzimi i varur në mur dhe udhëzimi i punës bëhen dy sisteme të ndara, dhe punonjësi duhet të hamendësojë cilin do të gjykojë më vonë menaxhmenti.",
              "Ein Plakat ist eine Informationsfläche. Ein Standard ist eine Arbeitsvereinbarung darüber, welches Ergebnis erreicht werden soll, unter welchen Bedingungen und wie das Team eine Abweichung von der vereinbarten Methode erkennen kann. Er muss im Moment der Ausführung verständlich und für jemanden nutzbar sein, der noch kein Experte ist. Sonst werden die ausgehängte und die gelebte Anweisung zu getrennten Systemen, und der Mitarbeiter muss raten, nach welcher die Führung später urteilt.") },
            { type: "callout", reading: true, text: x(
              "The instruction on the wall is the start of a standard. The observable work is the test.",
              "Udhëzimi në mur është fillimi i një standardi. Puna e vëzhgueshme është prova.",
              "Die Anweisung an der Wand ist der Anfang eines Standards. Die beobachtbare Arbeit ist die Prüfung.") },
          ],
          note: x(
            "Constructed scene; the essay named below makes the same argument for the SOP.",
            "Skenë e ndërtuar; eseja e emërtuar më poshtë e bën të njëjtin argument për SOP-in.",
            "Konstruierte Szene; der unten genannte Essay führt dasselbe Argument für die SOP."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("The Toyota rules", "Rregullat e Toyota-s", "Die Toyota-Regeln"), x("behind the standard", "pas standardit", "hinter dem Standard")],
          lead: x(
            "In Spear and Bowen's account, precise work design and learning through experiments are not opposites. They described Toyota's operating system in terms of four design and improvement rules, from observation rather than a randomised trial showing that a checklist mechanically improves any company. The idea is more demanding than “write a procedure”: activities, connections and pathways should be specified clearly enough that departures become detectable, and improvements should be tested with scientific discipline.",
            "Sipas rrëfimit të Spear dhe Bowen, projektimi i saktë i punës dhe të mësuarit përmes eksperimenteve nuk janë të kundërta. Ata e përshkruan sistemin e punës së Toyota-s me katër rregulla projektimi dhe përmirësimi, nga vëzhgimi, jo nga një provë e rastësishme që tregon se një listë kontrolli e përmirëson mekanikisht çdo kompani. Ideja është më kërkuese se “shkruaj një procedurë”: veprimtaritë, lidhjet dhe rrugët duhen përcaktuar aq qartë sa largimet të bëhen të dallueshme, dhe përmirësimet duhen provuar me disiplinë shkencore.",
            "In der Darstellung von Spear und Bowen sind präzise Arbeitsgestaltung und Lernen durch Experimente keine Gegensätze. Sie beschrieben das Betriebssystem von Toyota mit vier Gestaltungs- und Verbesserungsregeln, aus Beobachtung, nicht aus einem randomisierten Versuch, der zeigt, dass eine Checkliste jedes Unternehmen mechanisch verbessert. Die Idee ist anspruchsvoller als „schreib ein Verfahren“: Tätigkeiten, Verbindungen und Wege sollen so klar festgelegt sein, dass Abweichungen erkennbar werden, und Verbesserungen sollen mit wissenschaftlicher Disziplin getestet werden."),
          blocks: [
            { type: "chain", items: [
              { h: x("Specify the work", "Përcakto punën", "Die Arbeit festlegen"), p: x("Content, sequence, timing, outcome.", "Përmbajtja, radha, koha, rezultati.", "Inhalt, Abfolge, Zeit, Ergebnis.") },
              { h: x("Clear connections", "Lidhje të qarta", "Klare Verbindungen"), p: x("Who asks whom, for what, by when.", "Kush i kërkon kujt, çfarë, deri kur.", "Wer fragt wen, wonach, bis wann.") },
              { h: x("Direct pathways", "Rrugë të drejtpërdrejta", "Direkte Wege"), p: x("One simple route for each product or service.", "Një rrugë e thjeshtë për çdo produkt ose shërbim.", "Ein einfacher Weg für jedes Produkt oder jede Leistung.") },
              { h: x("Test changes", "Provo ndryshimet", "Änderungen testen"), p: x("Improve by experiment, under guidance.", "Përmirëso me eksperiment, nën udhëheqje.", "Durch Experimente verbessern, unter Anleitung.") },
            ] },
            { type: "p", text: x(
              "Consider a shift handover. “Inform the next shift” is too vague to test. A usable standard names which open issue must be passed, which facts were verified, who accepts the next action and how the receiver knows the transfer is complete. Specificity makes the gap visible without requiring the manager to read minds. But standardisation must not become rigid theatre. When the environment changes, staff need a legitimate way to expose the mismatch and propose a controlled revision. Otherwise the paper remains stable while the real work quietly adapts. The valuable unit is not the poster; it is the repeating loop between a clear expectation, the evidence from work and a response to the mismatch.",
              "Merr një dorëzim turni. “Njofto turnin e radhës” është tepër i vagullt për t'u provuar. Një standard i përdorshëm thotë cila çështje e hapur duhet kaluar, cilat fakte u verifikuan, kush e pranon veprimin e radhës dhe si e di marrësi se kalimi është i plotë. Saktësia e bën boshllëkun të dukshëm pa i kërkuar menaxherit të lexojë mendjet. Por standardizimi nuk duhet të bëhet teatër i ngurtë. Kur mjedisi ndryshon, stafit i duhet një mënyrë legjitime për ta nxjerrë në pah mospërputhjen dhe për të propozuar një rishikim të kontrolluar. Përndryshe letra mbetet e qëndrueshme, ndërsa puna e vërtetë përshtatet pa zhurmë. Njësia e vlefshme nuk është posteri; është cikli që përsëritet mes një pritshmërie të qartë, provës nga puna dhe një përgjigjeje ndaj mospërputhjes.",
              "Nehmen Sie eine Schichtübergabe. „Die nächste Schicht informieren“ ist zu vage, um geprüft zu werden. Ein brauchbarer Standard benennt, welcher offene Punkt weiterzugeben ist, welche Fakten geprüft wurden, wer die nächste Handlung übernimmt und woran der Empfänger erkennt, dass die Übergabe vollständig ist. Genauigkeit macht die Lücke sichtbar, ohne dass die Führungskraft Gedanken lesen muss. Doch Standardisierung darf kein starres Theater werden. Ändert sich das Umfeld, braucht das Personal einen legitimen Weg, die Abweichung offenzulegen und eine kontrollierte Überarbeitung vorzuschlagen. Sonst bleibt das Papier stabil, während die reale Arbeit sich still anpasst. Die wertvolle Einheit ist nicht das Plakat; es ist die wiederkehrende Schleife zwischen klarer Erwartung, Belegen aus der Arbeit und einer Antwort auf die Abweichung.") },
            { type: "callout", reading: true, text: x(
              "A good standard helps reveal that the process has changed; it does not pretend the change never happened.",
              "Një standard i mirë ndihmon të zbulohet se procesi ka ndryshuar; nuk shtiret sikur ndryshimi nuk ndodhi kurrë.",
              "Ein guter Standard hilft zu erkennen, dass sich der Prozess geändert hat; er tut nicht so, als wäre die Änderung nie geschehen.") },
          ],
          note: x(
            "Spear and Bowen, Harvard Business Review, September–October 1999, an observational study of Toyota and its suppliers; the four short labels are editorial. The learning failures that follow are Tucker and Edmondson (2003).",
            "Spear dhe Bowen, Harvard Business Review, shtator–tetor 1999, studim vëzhgues i Toyota-s dhe furnitorëve të saj; katër etiketat e shkurtra janë editoriale. Dështimet e të mësuarit që vijnë më pas janë të Tucker dhe Edmondson (2003).",
            "Spear und Bowen, Harvard Business Review, September–Oktober 1999, eine Beobachtungsstudie zu Toyota und seinen Zulieferern; die vier kurzen Etiketten sind redaktionell. Die folgenden Lernversäumnisse stammen von Tucker und Edmondson (2003)."),
          source: ["spear-bowen-1999", "tucker-edmondson-2003"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Make the standard", "Bëje standardin", "Den Standard"), x("demonstrable", "të demonstrueshëm", "vorführbar machen")],
          lead: x(
            "Test whether the next person can use it, not whether the document looks complete.",
            "Provo nëse personi i radhës e përdor dot, jo nëse dokumenti duket i plotë.",
            "Prüfen Sie, ob die nächste Person ihn nutzen kann, nicht, ob das Dokument vollständig aussieht."),
          blocks: [
            { type: "steps", items: [
              { h: x("Watch an ordinary cycle", "Vëzhgo një cikël të zakonshëm", "Einen gewöhnlichen Zyklus beobachten"), p: x("A trained worker shows the real sequence; the observer does not lead.", "Një punonjës i trajnuar tregon radhën e vërtetë; vëzhguesi nuk udhëheq.", "Ein geschulter Mitarbeiter zeigt die reale Abfolge; der Beobachter lenkt nicht.") },
              { h: x("Compare the reference", "Krahaso me referencën", "Mit der Referenz vergleichen"), p: x("What the approved SOP requires, and where the work differs.", "Çfarë kërkon SOP-i i miratuar, dhe ku ndryshon puna.", "Was die freigegebene SOP verlangt und wo die Arbeit abweicht.") },
              { h: x("Ask about exceptions", "Pyet për përjashtimet", "Nach Ausnahmen fragen"), p: x("What the worker does when an item, fact or approval is missing.", "Çfarë bën punonjësi kur mungon një artikull, fakt ose miratim.", "Was der Mitarbeiter tut, wenn Artikel, Fakt oder Freigabe fehlen.") },
              { h: x("Test comprehension", "Provo kuptimin", "Verständnis prüfen"), p: x("A newly trained colleague explains the purpose and the stopping rule.", "Një koleg i sapotrajnuar shpjegon qëllimin dhe rregullin e ndalimit.", "Ein frisch geschulter Kollege erklärt Zweck und Stoppregel.") },
              { h: x("Record the mismatch", "Shëno mospërputhjen", "Die Abweichung festhalten"), p: x("Unclear wording, inadequate training or an impossible condition: three different findings.", "Formulim i paqartë, trajnim i pamjaftueshëm ose kusht i pamundur: tri gjetje të ndryshme.", "Unklare Formulierung, zu wenig Schulung oder eine unmögliche Bedingung: drei Befunde.") },
              { h: x("Correct through authority", "Korrigjo përmes autoritetit", "Über die Befugnis korrigieren"), p: x("Update only through the approval path; communicate the active version.", "Përditëso vetëm përmes rrugës së miratimit; komuniko versionin në fuqi.", "Nur über den Freigabeweg aktualisieren; die gültige Version mitteilen.") },
            ] },
            { type: "p", text: x(
              "A standard succeeds when a normally trained person can follow it and recognise when it no longer applies. A manager who silently does every hard step for the team shows expertise, not transferability. Use brief samples across roles and shifts, never secret personal performance files.",
              "Një standard ka sukses kur një person me trajnim normal e ndjek dot dhe e dallon kur nuk vlen më. Një menaxher që i bën në heshtje hapat e vështirë për ekipin tregon ekspertizë, jo transferueshmëri. Përdor mostra të shkurtra nëpër role dhe turne, kurrë dosje të fshehta performance.",
              "Ein Standard gelingt, wenn eine normal geschulte Person ihm folgen und erkennen kann, wann er nicht mehr gilt. Eine Führungskraft, die jeden schweren Schritt still für das Team erledigt, zeigt Fachwissen, nicht Übertragbarkeit. Kurze Stichproben über Rollen und Schichten, nie heimliche Leistungsakten.") },
            { type: "callout", reading: true, text: x(
              "If the work cannot be taught, observed and safely questioned, the standard has not yet become a system.",
              "Nëse puna nuk mund të mësohet, të vëzhgohet dhe të vihet në pikëpyetje pa rrezik, standardi nuk është bërë ende sistem.",
              "Wenn die Arbeit nicht gelehrt, beobachtet und gefahrlos hinterfragt werden kann, ist der Standard noch kein System geworden.") },
          ],
          note: x(
            "Editorial protocol after Spear and Bowen (1999) and the IHI's standard work guidance (2016); not an audit procedure of any employer.",
            "Protokoll editorial sipas Spear dhe Bowen (1999) dhe udhëzimit të IHI-së për punën standarde (2016); jo procedurë auditimi e ndonjë punëdhënësi.",
            "Redaktionelles Protokoll nach Spear und Bowen (1999) und der IHI-Anleitung zur Standardarbeit (2016); kein Auditverfahren eines Arbeitgebers."),
          source: ["spear-bowen-1999", "ihi-sustaining-2016"],
        },
      ],
    },

    // Chapter III. The person who holds it together
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The person who holds it together", "Personi që e mban gjithçka bashkë", "Die Person, die alles zusammenhält"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "how-i-built-front-desk-control",
          title: [x("The person who", "Personi që", "Die Person, die"), x("holds it together", "e mban gjithçka bashkë", "alles zusammenhält")],
          lead: x(
            "An operation can appear stable because one experienced colleague is supplying the missing process.",
            "Një operacion mund të duket i qëndrueshëm, sepse një koleg me përvojë e plotëson procesin që mungon.",
            "Ein Betrieb kann stabil wirken, weil ein erfahrener Kollege den fehlenden Prozess liefert."),
          blocks: [
            { type: "flag", text: x("Constructed illustration, not a claim about a named hotel", "Ilustrim i ndërtuar, jo pohim për një hotel të caktuar", "Konstruierte Illustration, keine Behauptung über ein bestimmtes Hotel") },
            { type: "p", text: x(
              "Picture a night-shift colleague who knows where every instruction is buried, which report is relevant and which open task requires a different team the next day. Questions arrive, and the colleague answers them instantly. The shift goes smoothly. Later a replacement joins and discovers that many decisions live in conversations rather than an accessible, approved guide. In the author's documented hotel work, training material did come from several sources, including SOP documents, explanations and visual references. That experience contributed to Front Desk Control, an information-organising project. There is no verified evidence that a particular hotel lost performance because one expert departed, or that the project was formally adopted by colleagues.",
              "Përfytyro një koleg të turnit të natës që e di ku është fshehur çdo udhëzim, cili raport ka rëndësi dhe cila detyrë e hapur kërkon një ekip tjetër të nesërmen. Vijnë pyetje, dhe kolegu u përgjigjet menjëherë. Turni shkon rrjedhshëm. Më vonë vjen një zëvendësues dhe zbulon se shumë vendime jetojnë në biseda, jo në një udhëzues të miratuar dhe të arritshëm. Në punën e dokumentuar të autorit në hotel, materiali i trajnimit vinte vërtet nga disa burime, përfshirë dokumente SOP, shpjegime dhe referenca vizuale. Ajo përvojë kontribuoi te Front Desk Control, një projekt për organizimin e informacionit. Nuk ka prova të verifikuara se një hotel i caktuar humbi performancë sepse u largua një ekspert, as se projekti u përvetësua zyrtarisht nga kolegët.",
              "Stellen Sie sich einen Kollegen der Nachtschicht vor, der weiß, wo jede Anweisung vergraben ist, welcher Bericht zählt und welche offene Aufgabe am nächsten Tag ein anderes Team braucht. Fragen kommen, und der Kollege beantwortet sie sofort. Die Schicht läuft glatt. Später kommt ein Ersatz und entdeckt, dass viele Entscheidungen in Gesprächen leben statt in einer zugänglichen, freigegebenen Anleitung. In der dokumentierten Hotelarbeit des Autors stammte Schulungsmaterial tatsächlich aus mehreren Quellen, darunter SOP-Dokumente, Erklärungen und visuelle Referenzen. Diese Erfahrung floss in Front Desk Control ein, ein Projekt zum Ordnen von Information. Es gibt keinen geprüften Beleg, dass ein bestimmtes Hotel Leistung verlor, weil ein Experte ging, oder dass das Projekt von Kollegen förmlich übernommen wurde.") },
            { type: "p", text: x(
              "The fictional scene illustrates a common organisational dependency: a helpful person becomes the unofficial connection between procedures, systems and teams. The operation appears resilient while that person is present. The fragility becomes visible only when somebody else must perform the same task. This is why the ability to substitute and train is not an administrative afterthought; it is part of the quality of a process.",
              "Skena e sajuar ilustron një varësi të zakonshme organizative: një person i gatshëm bëhet lidhja jozyrtare mes procedurave, sistemeve dhe ekipeve. Operacioni duket i qëndrueshëm sa kohë që ai person është aty. Brishtësia bëhet e dukshme vetëm kur dikush tjetër duhet ta kryejë të njëjtën detyrë. Prandaj aftësia për të zëvendësuar dhe për të trajnuar nuk është një shtojcë administrative; është pjesë e cilësisë së një procesi.",
              "Die fiktive Szene zeigt eine verbreitete organisatorische Abhängigkeit: Eine hilfsbereite Person wird zur inoffiziellen Verbindung zwischen Verfahren, Systemen und Teams. Der Betrieb wirkt widerstandsfähig, solange diese Person da ist. Die Zerbrechlichkeit zeigt sich erst, wenn jemand anderes dieselbe Aufgabe ausführen muss. Deshalb ist die Fähigkeit zu vertreten und zu schulen kein verwaltungstechnisches Nachspiel; sie ist Teil der Qualität eines Prozesses.") },
            { type: "callout", reading: true, text: x(
              "If one person is the only bridge, the bridge is a risk even when it works perfectly today.",
              "Nëse një person i vetëm është ura e vetme, ura është rrezik edhe kur sot funksionon në mënyrë të përsosur.",
              "Wenn eine Person die einzige Brücke ist, ist die Brücke ein Risiko, auch wenn sie heute perfekt trägt.") },
          ],
          note: x(
            "Constructed scene; the author's Front Desk Control project is on the site's Projects page, and the essay named below tells how it was built.",
            "Skenë e ndërtuar; projekti Front Desk Control i autorit është te faqja Projekte, dhe eseja e emërtuar më poshtë tregon si u ndërtua.",
            "Konstruierte Szene; das Projekt Front Desk Control des Autors steht auf der Projektseite, und der unten genannte Essay erzählt, wie es entstand."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Tacit knowledge", "Njohuria e heshtur", "Stilles Wissen"), x("needs a route", "ka nevojë për një rrugë", "braucht einen Weg")],
          lead: x(
            "Transfer should preserve judgment and boundaries, not turn experience into a pile of screenshots. Some knowledge is written: the official sequence, definitions, escalation conditions and a checklist. Other knowledge is tacit: the cues that experienced staff notice, the questions they ask and the way they recognise an unusual situation. A process loses resilience when its written part is too thin to let a trained substitute act, or when every exception requires the original designer.",
            "Transferimi duhet ta ruajë gjykimin dhe kufijtë, jo ta shndërrojë përvojën në një grumbull pamjesh ekrani. Disa njohuri janë të shkruara: radha zyrtare, përkufizimet, kushtet e eskalimit dhe një listë kontrolli. Njohuri të tjera janë të heshtura: shenjat që vëren stafi me përvojë, pyetjet që bën dhe mënyra si e dallon një situatë të pazakontë. Një proces e humb qëndrueshmërinë kur pjesa e shkruar është tepër e hollë që një zëvendësues i trajnuar të veprojë, ose kur çdo përjashtim kërkon projektuesin e parë.",
            "Die Übertragung soll Urteil und Grenzen bewahren, nicht Erfahrung in einen Stapel Bildschirmfotos verwandeln. Manches Wissen ist geschrieben: die offizielle Abfolge, Definitionen, Eskalationsbedingungen und eine Checkliste. Anderes Wissen ist still: die Hinweise, die erfahrenes Personal bemerkt, die Fragen, die es stellt, und die Art, wie es eine ungewöhnliche Lage erkennt. Ein Prozess verliert Widerstandsfähigkeit, wenn sein schriftlicher Teil zu dünn ist, um einen geschulten Ersatz handeln zu lassen, oder wenn jede Ausnahme den ursprünglichen Gestalter braucht."),
          blocks: [
            { type: "cards", cols: 2, items: [
              { h: x("Person dependence", "Varësi nga personi", "Personenabhängigkeit"), p: x("“Ask Alex; Alex knows.” Work continues, but the next person cannot reconstruct the decision.", "“Pyete Aleksin; Aleksi e di.” Puna vazhdon, por personi i radhës nuk e rindërton dot vendimin.", "„Frag Alex; Alex weiß es.“ Die Arbeit geht weiter, aber die nächste Person kann die Entscheidung nicht rekonstruieren.") },
              { h: x("Process capability", "Aftësi e procesit", "Prozessfähigkeit"), p: x("“Use the approved guide; here is the owner when the guide no longer fits.”", "“Përdor udhëzuesin e miratuar; ja përgjegjësi kur udhëzuesi nuk përshtatet më.”", "„Nutze die freigegebene Anleitung; hier ist der Verantwortliche, wenn sie nicht mehr passt.“") },
            ] },
            { type: "p", text: x(
              "A useful guide therefore has to separate an instruction from an interpretation. Record the source and version of the authorised SOP. Explain the expected input and output. Keep examples generic and anonymised. Put exceptional cases behind appropriate authority, rather than teaching colleagues an unofficial bypass. The guide should help a new user find the next responsible role, not pretend that a public web page can replace an employer's operational system. Normalization Process Theory later helps explain this transition: sustained work requires people to understand the practice, engage with it, do it and examine its results. A personal tool can support some of that work, but does not itself demonstrate institutional adoption.",
              "Një udhëzues i dobishëm duhet pra ta ndajë udhëzimin nga interpretimi. Shëno burimin dhe versionin e SOP-it të autorizuar. Shpjego hyrjen dhe daljen e pritshme. Mbaji shembujt të përgjithshëm dhe anonimë. Vendosi rastet e jashtëzakonshme pas autoritetit përkatës, në vend që t'u mësosh kolegëve një anashkalim jozyrtar. Udhëzuesi duhet ta ndihmojë përdoruesin e ri të gjejë rolin e radhës përgjegjës, jo të shtiret se një faqe publike interneti mund ta zëvendësojë sistemin operacional të një punëdhënësi. Teoria e Procesit të Normalizimit, më vonë, ndihmon ta shpjegojë këtë kalim: puna e qëndrueshme kërkon që njerëzit ta kuptojnë praktikën, të angazhohen me të, ta bëjnë dhe t'i shqyrtojnë rezultatet e saj. Një mjet personal mund ta mbështesë një pjesë të kësaj pune, por nuk e dëshmon vetë përvetësimin institucional.",
              "Eine brauchbare Anleitung muss daher Anweisung von Deutung trennen. Quelle und Version der freigegebenen SOP festhalten. Erwartete Eingabe und Ausgabe erklären. Beispiele allgemein und anonymisiert halten. Ausnahmefälle hinter die zuständige Befugnis stellen, statt Kollegen einen inoffiziellen Umweg beizubringen. Die Anleitung soll einem neuen Nutzer helfen, die nächste zuständige Rolle zu finden, nicht vorgeben, eine öffentliche Webseite könne das Betriebssystem eines Arbeitgebers ersetzen. Die Normalization Process Theory hilft später, diesen Übergang zu erklären: Dauerhafte Arbeit verlangt, dass Menschen die Praxis verstehen, sich auf sie einlassen, sie ausführen und ihre Ergebnisse prüfen. Ein persönliches Werkzeug kann einen Teil dieser Arbeit stützen, belegt aber selbst keine institutionelle Übernahme.") },
            { type: "callout", reading: true, text: x(
              "Document enough to transfer the decision boundary; train enough to preserve judgment.",
              "Dokumento aq sa të transferohet kufiri i vendimit; trajno aq sa të ruhet gjykimi.",
              "Dokumentieren Sie genug, um die Entscheidungsgrenze zu übertragen; schulen Sie genug, um das Urteil zu bewahren.") },
          ],
          note: x(
            "Written and tacit knowledge is an editorial distinction; the four kinds of implementation work are May et al. (2009) and May and Finch (2009).",
            "Njohuria e shkruar dhe e heshtur është dallim editorial; katër llojet e punës së zbatimit janë të May et al. (2009) dhe May e Finch (2009).",
            "Geschriebenes und stilles Wissen ist eine redaktionelle Unterscheidung; die vier Arten der Umsetzungsarbeit stammen von May et al. (2009) und May und Finch (2009)."),
          source: ["may-2009", "may-finch-2009"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Test the process", "Provo procesin", "Den Prozess"), x("without its champion", "pa nismëtarin e tij", "ohne seinen Vorkämpfer testen")],
          lead: x(
            "A respectful handover rehearsal reveals single-person dependencies before they become incidents.",
            "Një provë dorëzimi, e bërë me respekt, i nxjerr në pah varësitë nga një person i vetëm para se të bëhen ngjarje.",
            "Eine respektvolle Übergabeprobe deckt Abhängigkeiten von einer Person auf, bevor sie zu Vorfällen werden."),
          blocks: [
            { type: "steps", items: [
              { h: x("Select a low-risk workflow", "Zgjidh një rrjedhë pune me rrezik të ulët", "Einen risikoarmen Ablauf wählen"), p: x("A permitted task with an authorised reference and no sensitive personal examples.", "Një detyrë e lejuar, me referencë të autorizuar dhe pa shembuj personalë të ndjeshëm.", "Eine zulässige Aufgabe mit freigegebener Referenz und ohne sensible persönliche Beispiele.") },
              { h: x("Ask for a substitute", "Kërko një zëvendësues", "Um einen Ersatz bitten"), p: x("A trained colleague other than the creator performs the task using available instructions.", "Një koleg i trajnuar, jo krijuesi, e kryen detyrën me udhëzimet në dispozicion.", "Ein geschulter Kollege, nicht der Urheber, führt die Aufgabe mit den vorhandenen Anweisungen aus.") },
              { h: x("Observe the interruptions", "Vëzhgo ndërprerjet", "Die Unterbrechungen beobachten"), p: x("Where they must ask for undocumented information or personal permission.", "Ku duhet të kërkojnë informacion të padokumentuar ose leje personale.", "Wo sie nach undokumentierter Information oder persönlicher Erlaubnis fragen müssen.") },
              { h: x("Check the authorised source", "Kontrollo burimin e autorizuar", "Die befugte Quelle prüfen"), p: x("Conflicting versions, and the role allowed to resolve them.", "Versionet kontradiktore, dhe roli që ka të drejtë t'i zgjidhë.", "Widersprüchliche Versionen und die Rolle, die sie klären darf.") },
              { h: x("Improve the transfer", "Përmirëso transferimin", "Die Übertragung verbessern"), p: x("Clarify one missing decision, example or escalation boundary.", "Qartëso një vendim, shembull ose kufi eskalimi që mungon.", "Eine fehlende Entscheidung, ein Beispiel oder eine Eskalationsgrenze klären.") },
              { h: x("Re-test after an interval", "Riprovo pas një kohe", "Nach einer Weile erneut testen"), p: x("Another trained person, and only process-level learning documented.", "Një person tjetër i trajnuar, dhe dokumentohet vetëm mësimi në nivel procesi.", "Eine weitere geschulte Person, und nur Lernen auf Prozessebene dokumentiert.") },
            ] },
            { type: "p", text: x(
              "No informal webpage replaces a hotel PMS, a security procedure or an employer-approved record, and the rehearsal is agreed with management where required. Success means the team works safely within its authority and finds help quickly when it cannot, not that every expert judgment has become a formula.",
              "Asnjë faqe interneti jozyrtare nuk e zëvendëson sistemin e hotelit, një procedurë sigurie apo një regjistër të miratuar nga punëdhënësi, dhe prova bihet dakord me menaxhmentin aty ku kërkohet. Sukses do të thotë që ekipi punon i sigurt brenda autoritetit të vet dhe gjen shpejt ndihmë kur nuk mundet, jo që çdo gjykim ekspert është bërë formulë.",
              "Keine inoffizielle Webseite ersetzt ein Hotel-PMS, ein Sicherheitsverfahren oder einen vom Arbeitgeber freigegebenen Datensatz, und die Probe wird, wo nötig, mit der Führung abgestimmt. Erfolg heißt, dass das Team innerhalb seiner Befugnis sicher arbeitet und schnell Hilfe findet, wenn es das nicht kann, nicht, dass jedes Expertenurteil zur Formel wurde.") },
            { type: "callout", reading: true, text: x(
              "A truly reliable process is teachable without requiring the person who invented it to remain in the room.",
              "Një proces vërtet i besueshëm mësohet pa pasur nevojë që personi që e shpiku të mbetet në dhomë.",
              "Ein wirklich verlässlicher Prozess lässt sich lehren, ohne dass die Person, die ihn erfand, im Raum bleiben muss.") },
          ],
          note: x(
            "Editorial rehearsal after the IHI's standard work (2016) and May et al. (2009); not a procedure of any hotel.",
            "Provë editoriale sipas punës standarde të IHI-së (2016) dhe May et al. (2009); jo procedurë e ndonjë hoteli.",
            "Redaktionelle Probe nach der Standardarbeit des IHI (2016) und May et al. (2009); kein Verfahren eines Hotels."),
          source: ["ihi-sustaining-2016", "may-2009"],
        },
      ],
    },

    // Chapter IV. The return of old habits
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The return of old habits", "Kthimi i zakoneve të vjetra", "Die Rückkehr alter Gewohnheiten"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "solve-it-or-escalate-it",
          title: [x("The return of", "Kthimi i", "Die Rückkehr"), x("old habits", "zakoneve të vjetra", "alter Gewohnheiten")],
          lead: x(
            "A shortcut can become normal because it works once under pressure, not because anyone approved it.",
            "Një rrugë e shkurtër mund të bëhet normale sepse funksionoi një herë nën presion, jo sepse dikush e miratoi.",
            "Eine Abkürzung kann normal werden, weil sie einmal unter Druck funktionierte, nicht weil jemand sie freigab."),
          blocks: [
            { type: "flag", text: x("Hypothetical scene, no employer incident attributed", "Skenë hipotetike, pa ngjarje që i atribuohet ndonjë punëdhënësi", "Hypothetische Szene, kein Vorfall einem Arbeitgeber zugeschrieben") },
            { type: "p", text: x(
              "Imagine a shift in which an item is delayed, the work queue is growing and a more experienced colleague offers an improvised route around a difficult verification step. The team completes the urgent task. No one notes why the approved process failed to serve the situation. When the same pressure returns, the shortcut feels familiar and practical. Soon it is taught to new colleagues as the way the job is done. This account is deliberately constructed. The author has dealt with operational pressure, missing bags, incomplete orders and training issues, but no documented case proves that a particular unauthorised workaround became normal in those workplaces.",
              "Përfytyro një turn ku një artikull vonohet, radha e punës rritet dhe një koleg më me përvojë ofron një rrugë të improvizuar rreth një hapi të vështirë verifikimi. Ekipi e përfundon detyrën urgjente. Askush nuk shënon pse procesi i miratuar nuk i shërbeu situatës. Kur i njëjti presion kthehet, rruga e shkurtër duket e njohur dhe praktike. Së shpejti u mësohet kolegëve të rinj si mënyra se si bëhet puna. Ky rrëfim është ndërtuar me qëllim. Autori është marrë me presion operacional, çanta që mungojnë, porosi të paplota dhe çështje trajnimi, por asnjë rast i dokumentuar nuk provon se një anashkalim i caktuar i paautorizuar u bë normal në ato vende pune.",
              "Stellen Sie sich eine Schicht vor, in der ein Artikel sich verspätet, die Arbeitsschlange wächst und ein erfahrenerer Kollege einen improvisierten Weg um einen schwierigen Prüfschritt anbietet. Das Team erledigt die dringende Aufgabe. Niemand hält fest, warum das freigegebene Verfahren der Lage nicht gerecht wurde. Kehrt derselbe Druck zurück, fühlt sich die Abkürzung vertraut und praktisch an. Bald wird sie neuen Kollegen als die Art beigebracht, wie die Arbeit gemacht wird. Dieser Bericht ist bewusst konstruiert. Der Autor hatte mit betrieblichem Druck, fehlenden Taschen, unvollständigen Aufträgen und Schulungsfragen zu tun, aber kein dokumentierter Fall belegt, dass in diesen Betrieben ein bestimmter unbefugter Umweg normal wurde.") },
            { type: "p", text: x(
              "The general risk is nevertheless worth examining: a quick local solution may spare the current shift while making the underlying obstacle invisible to the organisation. The corrective question is not automatically “who broke the rule?” It is “what condition made the approved work hard to complete, and did someone knowingly cross a clear boundary?” Process design and individual accountability both matter. Necessary safety and compliance controls are not optional, however much pressure a team feels.",
              "Rreziku i përgjithshëm megjithatë ia vlen të shqyrtohet: një zgjidhje e shpejtë lokale mund ta shpëtojë turnin e tanishëm, duke e bërë pengesën themelore të padukshme për organizatën. Pyetja korrigjuese nuk është automatikisht “kush e theu rregullin?” Është “cili kusht e bëri të vështirë kryerjen e punës së miratuar, dhe a e kaloi dikush me vetëdije një kufi të qartë?” Kanë rëndësi si projektimi i procesit, ashtu edhe llogaridhënia individuale. Kontrollet e nevojshme të sigurisë dhe të pajtueshmërisë nuk janë fakultative, sado presion të ndiejë një ekip.",
              "Das allgemeine Risiko lohnt dennoch die Betrachtung: Eine schnelle lokale Lösung kann die laufende Schicht retten und zugleich das zugrunde liegende Hindernis für die Organisation unsichtbar machen. Die korrigierende Frage lautet nicht automatisch „Wer hat die Regel gebrochen?“, sondern „Welche Bedingung machte die freigegebene Arbeit schwer, und hat jemand wissentlich eine klare Grenze überschritten?“ Prozessgestaltung und persönliche Verantwortung zählen beide. Notwendige Sicherheits- und Compliance-Kontrollen sind nicht optional, wie groß der Druck auf ein Team auch ist.") },
            { type: "callout", reading: true, text: x(
              "A shortcut can remove the pain of a problem while preserving the cause that created it.",
              "Një rrugë e shkurtër mund ta heqë dhimbjen e një problemi, duke e ruajtur shkakun që e krijoi.",
              "Eine Abkürzung kann den Schmerz eines Problems nehmen und die Ursache, die es schuf, bewahren.") },
          ],
          note: x(
            "Constructed scene; the essay named below draws the line between solving and escalating.",
            "Skenë e ndërtuar; eseja e emërtuar më poshtë e vë vijën mes zgjidhjes dhe eskalimit.",
            "Konstruierte Szene; der unten genannte Essay zieht die Linie zwischen Lösen und Eskalieren."),
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("First-order fixes,", "Rregullime të rendit të parë,", "Korrekturen erster Ordnung,"), x("second-order learning", "të mësuar i rendit të dytë", "Lernen zweiter Ordnung")],
          lead: x(
            "Tucker and Edmondson help explain why competent, hardworking people keep a defective system running. They observed 26 nurses for 239 hours at nine hospitals. Staff were not careless: the work environment rewarded immediate recovery from a problem and discouraged the harder work of removing its cause.",
            "Tucker dhe Edmondson ndihmojnë të shpjegohet pse njerëz të aftë dhe punëtorë e mbajnë në punë një sistem me defekt. Ata vëzhguan 26 infermiere për 239 orë në nëntë spitale. Stafi nuk ishte i pakujdesshëm: mjedisi i punës e shpërblente rikuperimin e menjëhershëm nga një problem dhe e dekurajonte punën më të vështirë për t'ia hequr shkakun.",
            "Tucker und Edmondson helfen zu erklären, warum fähige, fleißige Menschen ein fehlerhaftes System am Laufen halten. Sie beobachteten 26 Pflegekräfte 239 Stunden lang in neun Kliniken. Das Personal war nicht nachlässig: Die Arbeitsumgebung belohnte die sofortige Erholung von einem Problem und entmutigte die schwerere Arbeit, seine Ursache zu beseitigen."),
          blocks: [
            { type: "hbars", source: ["tucker-edmondson-2003"],
              label: x("How the observed nurses responded to process failures", "Si u përgjigjeshin infermieret e vëzhguara dështimeve të procesit", "Wie die beobachteten Pflegekräfte auf Prozessfehler reagierten"),
              items: [
                { k: x("First-order: work around it, carry on", "Rendi i parë: anashkaloje, vazhdo", "Erste Ordnung: umgehen, weitermachen"), v: 93, n: x("93%", "93%", "93 %"), alert: true },
                { k: x("Second-order: also report or address the cause", "Rendi i dytë: raporto ose trajto edhe shkakun", "Zweite Ordnung: auch die Ursache melden oder angehen"), v: 7, n: x("7%", "7%", "7 %") },
              ] },
            { type: "cards", cols: 2, items: [
              { h: x("First-order response", "Përgjigje e rendit të parë", "Reaktion erster Ordnung"), p: x("Get the task done now; bridge a missing resource, seek an answer or absorb extra effort.", "Kryeje detyrën tani; plotëso burimin që mungon, kërko një përgjigje ose përballo mundim shtesë.", "Die Aufgabe jetzt erledigen; eine fehlende Ressource überbrücken, eine Antwort suchen oder Mehraufwand schlucken.") },
              { h: x("Second-order response", "Përgjigje e rendit të dytë", "Reaktion zweiter Ordnung"), p: x("Preserve the recovery, but investigate what made that recovery necessary and change the system.", "Ruaje rikuperimin, por heto çfarë e bëri të nevojshëm dhe ndryshoje sistemin.", "Die Erholung bewahren, aber untersuchen, was sie nötig machte, und das System ändern.") },
            ] },
            { type: "p", text: x(
              "Managers need both modes. A frontline colleague cannot suspend service until an improvement project is complete. But when a team repeatedly clears the same obstacle by unofficial personal effort, management may mistake adaptability for process health. A system that depends on hidden heroics is vulnerable to fatigue and staffing changes. The study does not measure last-mile loading or hotel night audits.",
              "Menaxherëve u duhen të dyja mënyrat. Një koleg i vijës së parë nuk mund ta pezullojë shërbimin derisa të përfundojë një projekt përmirësimi. Por kur një ekip e kapërcen përsëri e përsëri të njëjtën pengesë me mundim personal jozyrtar, menaxhmenti mund ta ngatërrojë përshtatshmërinë me shëndetin e procesit. Një sistem që varet nga heroizma të fshehura është i brishtë ndaj lodhjes dhe ndryshimeve të stafit. Studimi nuk mat ngarkimin në miljen e fundit apo auditimin e natës në hotel.",
              "Führungskräfte brauchen beide Modi. Ein Kollege an der Front kann den Service nicht aussetzen, bis ein Verbesserungsprojekt abgeschlossen ist. Doch wenn ein Team dasselbe Hindernis wiederholt durch inoffiziellen Einsatz beseitigt, kann die Führung Anpassungsfähigkeit mit Prozessgesundheit verwechseln. Ein System aus verborgenem Heldentum ist anfällig für Ermüdung und Personalwechsel. Die Studie misst weder Last-Mile-Beladung noch Nachtaudits im Hotel.") },
            { type: "callout", reading: true, text: x(
              "The organisation learns only when today's workaround becomes evidence for tomorrow's redesign.",
              "Organizata mëson vetëm kur anashkalimi i sotëm bëhet provë për riprojektimin e nesërm.",
              "Die Organisation lernt nur, wenn der heutige Umweg zum Beleg für die morgige Neugestaltung wird.") },
          ],
          note: x(
            "Tucker and Edmondson, California Management Review 45(2), 2003, pp. 55–72: 239 hours, 26 nurses, nine hospitals; 93% first-order and 7% second-order responses, read at the full text for Management Review No. 15.",
            "Tucker dhe Edmondson, California Management Review 45(2), 2003, f. 55–72: 239 orë, 26 infermiere, nëntë spitale; 93% përgjigje të rendit të parë dhe 7% të rendit të dytë, të lexuara te teksti i plotë për Management Review Nr. 15.",
            "Tucker und Edmondson, California Management Review 45(2), 2003, S. 55–72: 239 Stunden, 26 Pflegekräfte, neun Kliniken; 93 % Reaktionen erster und 7 % zweiter Ordnung, im Volltext für Management Review Nr. 15 gelesen."),
          source: ["tucker-edmondson-2003"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("What the research", "Çfarë mund të provojë", "Was die Forschung"), x("can actually prove", "vërtet kërkimi", "wirklich belegen kann")],
          lead: x(
            "A literature review is evidence about published studies, not a universal percentage of improvement projects that collapse.",
            "Një rishikim literature është provë për studimet e botuara, jo përqindje universale e projekteve të përmirësimit që dështojnë.",
            "Eine Literaturübersicht ist ein Beleg über veröffentlichte Studien, kein universeller Prozentsatz scheiternder Verbesserungsprojekte."),
          blocks: [
            { type: "figures", items: [
              { n: "125", t: x("studies included in a systematic review", "studime të përfshira në një rishikim sistematik", "Studien in einer systematischen Übersicht") },
              { n: "2012", t: x("publication year of the review", "viti i botimit të rishikimit", "Erscheinungsjahr der Übersicht") },
            ] },
            { type: "p", text: x(
              "Wiltsey Stirman and colleagues (2012) examined a varied set of interventions and programmes after their initial implementation. They found substantial variation in definitions and study design. Most studies were retrospective; about half used self-reported measures. Few assessed both continued use and the quality with which a practice was delivered. As a result, the review could not produce a reliable single rate of sustainment transferable across all organisations.",
              "Wiltsey Stirman dhe kolegët (2012) shqyrtuan një grup të larmishëm ndërhyrjesh dhe programesh pas zbatimit të tyre fillestar. Gjetën ndryshime të mëdha në përkufizime dhe në dizajnin e studimeve. Shumica e studimeve ishin retrospektive; rreth gjysma përdornin matje të vetëraportuara. Pak prej tyre vlerësonin si përdorimin e vazhduar, ashtu edhe cilësinë me të cilën ofrohej praktika. Si rrjedhim, rishikimi nuk prodhoi dot një normë të vetme të besueshme qëndrueshmërie të transferueshme për të gjitha organizatat.",
              "Wiltsey Stirman und Kollegen (2012) untersuchten eine vielfältige Reihe von Interventionen und Programmen nach ihrer ersten Einführung. Sie fanden erhebliche Unterschiede in Definitionen und Studiendesign. Die meisten Studien waren retrospektiv; etwa die Hälfte nutzte Selbstauskünfte. Wenige bewerteten sowohl die fortgesetzte Nutzung als auch die Qualität, mit der eine Praxis erbracht wurde. Daher konnte die Übersicht keine verlässliche einzelne Fortbestandsquote liefern, die auf alle Organisationen übertragbar wäre.") },
            { type: "p", text: x(
              "What the evidence supports: sustainment is shaped by interacting factors such as organisational context, capacity, implementation processes and features of the intervention. It is also dynamic: some changes are adapted productively; others erode. The fact that an original step is no longer performed is not, by itself, proof that the customer outcome worsened. What it does not support: claims that a fixed share of logistics initiatives disappear after ninety days; that one standard automatically prevents burnout; or that this author's employers experienced measurable decline. Each would need local records and an agreed outcome measure. The 125 studies are not 125 success cases or 125 failures.",
              "Çfarë mbështet prova: qëndrueshmëria formohet nga faktorë që ndërveprojnë, si konteksti organizativ, kapaciteti, proceset e zbatimit dhe tiparet e ndërhyrjes. Ajo është edhe dinamike: disa ndryshime përshtaten në mënyrë të frytshme; të tjera zbehen. Fakti që një hap fillestar nuk kryhet më nuk është, më vete, provë se rezultati për klientin u keqësua. Çfarë nuk mbështet: pohime se një pjesë e caktuar e nismave logjistike zhduken pas nëntëdhjetë ditësh; se një standard e parandalon vetvetiu lodhjen e stafit; ose se punëdhënësit e këtij autori pësuan rënie të matshme. Secili do të kërkonte regjistra lokalë dhe një matje rezultati të rënë dakord. 125 studimet nuk janë 125 raste suksesi, as 125 dështime.",
              "Was die Belege stützen: Fortbestand wird von zusammenwirkenden Faktoren geprägt, etwa organisatorischem Kontext, Kapazität, Umsetzungsprozessen und Merkmalen der Intervention. Er ist auch dynamisch: Manche Veränderungen werden produktiv angepasst, andere erodieren. Dass ein ursprünglicher Schritt nicht mehr ausgeführt wird, beweist für sich nicht, dass das Kundenergebnis schlechter wurde. Was sie nicht stützen: Behauptungen, ein fester Anteil logistischer Initiativen verschwinde nach neunzig Tagen; ein Standard verhindere von selbst Erschöpfung; oder die Arbeitgeber dieses Autors hätten einen messbaren Rückgang erlebt. Jede davon bräuchte lokale Aufzeichnungen und ein vereinbartes Ergebnismaß. Die 125 Studien sind weder 125 Erfolgsfälle noch 125 Misserfolge.") },
            { type: "callout", reading: true, text: x(
              "The most dangerous sustainability metric is a confident number with no agreed meaning.",
              "Matja më e rrezikshme e qëndrueshmërisë është një numër i sigurt pa kuptim të rënë dakord.",
              "Die gefährlichste Nachhaltigkeitskennzahl ist eine selbstsichere Zahl ohne vereinbarte Bedeutung.") },
          ],
          note: x(
            "Implementation Science 7:17, 2012; the design and self-report findings are from the abstract and the results section.",
            "Implementation Science 7:17, 2012; gjetjet për dizajnin dhe vetëraportimet janë nga abstrakti dhe pjesa e rezultateve.",
            "Implementation Science 7:17, 2012; die Befunde zu Design und Selbstauskünften stammen aus Abstract und Ergebnisteil."),
          source: ["wiltsey-stirman-2012"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Treat the", "Trajtoje anashkalimin", "Den Umweg"), x("workaround as evidence", "si provë", "als Beleg behandeln")],
          lead: x(
            "The responsible manager separates a safety breach from a signal that the process is hard to use.",
            "Menaxheri me përgjegjësi e ndan shkeljen e sigurisë nga sinjali se procesi është i vështirë për t'u përdorur.",
            "Die verantwortliche Führungskraft trennt einen Sicherheitsverstoß von dem Signal, dass der Prozess schwer anzuwenden ist."),
          blocks: [
            { type: "steps", items: [
              { h: x("Protect the immediate outcome", "Mbro rezultatin e menjëhershëm", "Das unmittelbare Ergebnis schützen"), p: x("Approved safety and service controls first; contain any urgent risk without delay.", "Së pari kontrollet e miratuara të sigurisë dhe shërbimit; frenoje pa vonesë çdo rrezik urgjent.", "Zuerst die freigegebenen Sicherheits- und Servicekontrollen; jedes akute Risiko ohne Verzug eindämmen.") },
              { h: x("Describe the deviation", "Përshkruaj devijimin", "Die Abweichung beschreiben"), p: x("What differed from the agreed method, without inventing motives.", "Çfarë ndryshoi nga metoda e rënë dakord, pa shpikur motive.", "Was von der vereinbarten Methode abwich, ohne Motive zu erfinden.") },
              { h: x("Understand the constraint", "Kupto kufizimin", "Die Einschränkung verstehen"), p: x("What time, resource, training or information was missing.", "Cila kohë, burim, trajnim ose informacion mungonte.", "Welche Zeit, Ressource, Schulung oder Information fehlte.") },
              { h: x("Sort accountability fairly", "Ndaje përgjegjësinë drejt", "Verantwortung fair zuordnen"), p: x("An unclear system condition is not a conscious violation of a clear rule.", "Një kusht i paqartë sistemi nuk është shkelje e vetëdijshme e një rregulli të qartë.", "Eine unklare Systembedingung ist kein bewusster Verstoß gegen eine klare Regel.") },
              { h: x("Test one approved change", "Provo një ndryshim të miratuar", "Eine freigegebene Änderung testen"), p: x("Remove an obstacle within the proper authority and monitor the downstream result.", "Hiqe një pengesë brenda autoritetit të duhur dhe ndiq rezultatin më poshtë në zinxhir.", "Ein Hindernis innerhalb der zuständigen Befugnis beseitigen und das nachgelagerte Ergebnis beobachten.") },
              { h: x("Return the decision", "Kthe vendimin", "Die Entscheidung zurückgeben"), p: x("What changed, what remains prohibited and who owns the open issue.", "Çfarë ndryshoi, çfarë mbetet e ndaluar dhe kush e ka çështjen e hapur.", "Was sich änderte, was verboten bleibt und wer den offenen Punkt verantwortet.") },
            ] },
            { type: "p", text: x(
              "Some deviation warns that the process design is obsolete; some is a serious violation. A useful review finds out which, instead of treating every deviation as innovation or as misconduct, and makes the difference explicit in training and escalation.",
              "Disa devijime paralajmërojnë se projektimi i procesit është vjetruar; disa janë shkelje serioze. Një rishikim i dobishëm e zbulon cili, në vend që çdo devijim ta quajë risi ose sjellje të keqe, dhe e bën dallimin të qartë në trajnim dhe eskalim.",
              "Manche Abweichung warnt, dass die Prozessgestaltung veraltet ist; manche ist ein ernster Verstoß. Eine nützliche Prüfung findet heraus, welche, statt jede Abweichung als Innovation oder als Fehlverhalten zu behandeln, und macht den Unterschied in Schulung und Eskalation ausdrücklich.") },
            { type: "callout", reading: true, text: x(
              "An exception becomes useful learning only when the organisation records the cause, not just the rescue.",
              "Një përjashtim bëhet mësim i dobishëm vetëm kur organizata shënon shkakun, jo vetëm shpëtimin.",
              "Eine Ausnahme wird nur dann nützliches Lernen, wenn die Organisation die Ursache festhält, nicht nur die Rettung.") },
          ],
          note: x(
            "Editorial protocol after Tucker and Edmondson (2003) and the IHI (2016); the site's 5 Whys tool carries the cause question.",
            "Protokoll editorial sipas Tucker dhe Edmondson (2003) dhe IHI-së (2016); mjeti 5 Whys i faqes e mban pyetjen e shkakut.",
            "Redaktionelles Protokoll nach Tucker und Edmondson (2003) und dem IHI (2016); das Tool 5 Whys der Seite trägt die Ursachenfrage."),
          source: ["tucker-edmondson-2003", "ihi-sustaining-2016"],
        },
      ],
    },

    // Chapter V. How change becomes routine
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("How change becomes routine", "Si bëhet rutinë ndryshimi", "Wie Veränderung zur Routine wird"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "watch-how-i-do-it-is-not-training",
          title: [x("How change", "Si bëhet", "Wie Veränderung"), x("becomes routine", "rutinë ndryshimi", "zur Routine wird")],
          lead: x(
            "The hard part of a new process is not announcing it. It is getting the next shift to make sense of it.",
            "Pjesa e vështirë e një procesi të ri nuk është shpallja. Është që turni i radhës t'i japë kuptim.",
            "Das Schwere an einem neuen Prozess ist nicht, ihn anzukündigen. Es ist, dass die nächste Schicht ihn versteht."),
          blocks: [
            { type: "flag", text: x("Constructed scene, inspired by a verified training context", "Skenë e ndërtuar, e frymëzuar nga një kontekst trajnimi i verifikuar", "Konstruierte Szene, angeregt von einem geprüften Schulungskontext") },
            { type: "p", text: x(
              "A new team member receives a revised instruction. It is clear to the person who wrote it. The new employee is uncertain which old steps still apply, where to find an example and when a different department must approve the next move. The trainer demonstrates the procedure once, then the operation becomes busy. By the end of the week the new colleague knows where the file is but still asks the same question before acting. The author's hotel training involved multiple SOPs, visual materials and help from colleagues. That is documented. The conversation, revised rule and sequence above are hypothetical, not a claim about a particular hotel's practice or training outcome.",
              "Një anëtar i ri i ekipit merr një udhëzim të rishikuar. Për atë që e shkroi është i qartë. Punonjësi i ri nuk e di cilët hapa të vjetër vlejnë ende, ku të gjejë një shembull dhe kur duhet ta miratojë hapin e radhës një departament tjetër. Trajnuesi e demonstron procedurën një herë, pastaj operacioni ngarkohet. Në fund të javës kolegu i ri e di ku është skedari, por ende e bën të njëjtën pyetje para se të veprojë. Trajnimi i autorit në hotel përfshinte disa SOP, materiale vizuale dhe ndihmë nga kolegët. Kjo është e dokumentuar. Biseda, rregulli i rishikuar dhe radha më sipër janë hipotetike, jo pohim për praktikën apo rezultatin e trajnimit të një hoteli të caktuar.",
              "Ein neues Teammitglied erhält eine überarbeitete Anweisung. Für die Person, die sie schrieb, ist sie klar. Der neue Mitarbeiter ist unsicher, welche alten Schritte noch gelten, wo ein Beispiel zu finden ist und wann eine andere Abteilung den nächsten Zug freigeben muss. Der Ausbilder führt das Verfahren einmal vor, dann wird der Betrieb hektisch. Am Ende der Woche weiß der neue Kollege, wo die Datei liegt, stellt aber vor dem Handeln immer noch dieselbe Frage. Die Hotelschulung des Autors umfasste mehrere SOPs, visuelles Material und Hilfe von Kollegen. Das ist dokumentiert. Gespräch, überarbeitete Regel und Abfolge oben sind hypothetisch, keine Behauptung über die Praxis oder das Schulungsergebnis eines bestimmten Hotels.") },
            { type: "p", text: x(
              "The failure mode is more subtle than resistance. A colleague can want to learn, read the document and still have no reliable opportunity to integrate the new method into daily work. When managers judge only whether a document was sent or acknowledged, they confuse dissemination with adoption. The real question is whether staff can make sense of the change, do the work and assess whether it helps.",
              "Mënyra e dështimit është më e hollë se rezistenca. Një koleg mund të dojë të mësojë, ta lexojë dokumentin dhe prapë të mos ketë asnjë mundësi të besueshme për ta integruar metodën e re në punën e përditshme. Kur menaxherët gjykojnë vetëm nëse një dokument u dërgua ose u konfirmua, e ngatërrojnë shpërndarjen me përvetësimin. Pyetja e vërtetë është nëse stafi mund t'i japë kuptim ndryshimit, ta bëjë punën dhe të vlerësojë nëse ndihmon.",
              "Der Fehlermodus ist feiner als Widerstand. Ein Kollege kann lernen wollen, das Dokument lesen und trotzdem keine verlässliche Gelegenheit haben, die neue Methode in die tägliche Arbeit einzubauen. Wenn Führungskräfte nur beurteilen, ob ein Dokument gesendet oder bestätigt wurde, verwechseln sie Verbreitung mit Übernahme. Die eigentliche Frage ist, ob das Personal die Veränderung versteht, die Arbeit tut und beurteilen kann, ob sie hilft.") },
            { type: "callout", reading: true, text: x(
              "A procedure becomes routine through repeated, supported work, not because its publication date has arrived.",
              "Një procedurë bëhet rutinë përmes punës së përsëritur dhe të mbështetur, jo sepse ka ardhur data e botimit të saj.",
              "Ein Verfahren wird durch wiederholte, unterstützte Arbeit zur Routine, nicht weil sein Veröffentlichungsdatum gekommen ist.") },
          ],
          note: x(
            "Constructed scene; the essay named below says why a demonstration is not training.",
            "Skenë e ndërtuar; eseja e emërtuar më poshtë thotë pse një demonstrim nuk është trajnim.",
            "Konstruierte Szene; der unten genannte Essay sagt, warum eine Vorführung keine Schulung ist."),
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("The four forms of", "Katër format e", "Die vier Formen der"), x("implementation work", "punës së zbatimit", "Umsetzungsarbeit")],
          lead: x(
            "Normalization Process Theory describes the effort it takes to make a new practice part of everyday life. May and colleagues built it to explain implementation and integration: a conceptual framework, not a guarantee that a rollout will succeed. Four interacting constructs show why a procedure can be distributed yet never become habitual.",
            "Teoria e Procesit të Normalizimit e përshkruan mundimin që duhet që një praktikë e re të bëhet pjesë e jetës së përditshme. May dhe kolegët e ndërtuan për të shpjeguar zbatimin dhe integrimin: një kornizë konceptuale, jo garanci se një nisje do të ketë sukses. Katër ndërtime që ndërveprojnë tregojnë pse një procedurë mund të shpërndahet dhe prapë të mos bëhet kurrë zakon.",
            "Die Normalization Process Theory beschreibt den Aufwand, der nötig ist, damit eine neue Praxis Teil des Alltags wird. May und Kollegen entwickelten sie, um Umsetzung und Integration zu erklären: ein begrifflicher Rahmen, keine Garantie, dass eine Einführung gelingt. Vier zusammenwirkende Konstrukte zeigen, warum ein Verfahren verteilt werden kann und doch nie zur Gewohnheit wird."),
          blocks: [
            { type: "cards", cols: 2, items: [
              { h: x("Coherence", "Koherenca", "Kohärenz"), p: x("Do people understand what is changing and why?", "A e kuptojnë njerëzit çfarë po ndryshon dhe pse?", "Verstehen die Leute, was sich ändert und warum?") },
              { h: x("Participation", "Pjesëmarrja", "Beteiligung"), p: x("Who commits to the work, and who is left outside it?", "Kush angazhohet për punën, dhe kush mbetet jashtë saj?", "Wer verpflichtet sich zur Arbeit, und wer bleibt außen vor?") },
              { h: x("Collective action", "Veprimi i përbashkët", "Gemeinsames Handeln"), p: x("Can people carry out the method with available roles and resources?", "A mund ta kryejnë njerëzit metodën me rolet dhe burimet në dispozicion?", "Können die Leute die Methode mit den vorhandenen Rollen und Ressourcen ausführen?") },
              { h: x("Reflexive monitoring", "Vëzhgimi reflektues", "Reflexives Beobachten"), p: x("Do users examine whether the new practice is worthwhile and adapt it responsibly?", "A e shqyrtojnë përdoruesit nëse praktika e re ia vlen dhe a e përshtatin me përgjegjësi?", "Prüfen die Nutzer, ob die neue Praxis sich lohnt, und passen sie sie verantwortungsvoll an?") },
            ] },
            { type: "p", text: x(
              "These are not a linear certification test: understanding does not produce willingness, willingness does not supply missing equipment, and doing a step once is not valuing it after repeated use. Ask the four questions together, with the people who do the work on a hard shift. The practical transfer: a new SOP should be understandable, accepted, workable at the point of use and reviewable from results. An editorial application, not a test of the theory.",
              "Këto nuk janë test certifikimi linear: kuptimi nuk prodhon gatishmëri, gatishmëria nuk e siguron pajisjen që mungon, dhe të bësh një hap një herë nuk do të thotë ta vlerësosh pas përdorimit të përsëritur. Bëji katër pyetjet bashkë, me njerëzit që e bëjnë punën në një turn të vështirë. Transferimi praktik: një SOP i ri duhet të jetë i kuptueshëm, i pranuar, i zbatueshëm në pikën e përdorimit dhe i rishikueshëm nga rezultatet. Zbatim editorial, jo provë e teorisë.",
              "Das ist kein linearer Zertifizierungstest: Verstehen erzeugt keine Bereitschaft, Bereitschaft beschafft keine Ausrüstung, und einen Schritt einmal zu tun heißt nicht, ihn nach wiederholtem Gebrauch zu schätzen. Stellen Sie die vier Fragen zusammen, mit den Menschen, die die Arbeit in einer schweren Schicht tun. Die praktische Übertragung: Eine neue SOP soll verständlich, akzeptiert, am Ort der Anwendung machbar und anhand der Ergebnisse überprüfbar sein. Eine redaktionelle Anwendung, kein Test der Theorie.") },
            { type: "callout", reading: true, text: x(
              "The best written procedure can still fail if the work required to use it has not been designed.",
              "Edhe procedura më e mirë e shkruar mund të dështojë, nëse puna që duhet për ta përdorur nuk është projektuar.",
              "Das bestgeschriebene Verfahren kann scheitern, wenn die Arbeit, die es zu nutzen braucht, nicht gestaltet wurde.") },
          ],
          note: x(
            "May and Finch, Sociology 43(3), 2009; May et al., Implementation Science 4:29, 2009. The four names are the theory's; the questions beside them are editorial.",
            "May dhe Finch, Sociology 43(3), 2009; May et al., Implementation Science 4:29, 2009. Katër emrat janë të teorisë; pyetjet pranë tyre janë editoriale.",
            "May und Finch, Sociology 43(3), 2009; May et al., Implementation Science 4:29, 2009. Die vier Namen gehören der Theorie; die Fragen daneben sind redaktionell."),
          source: ["may-finch-2009", "may-2009"],
        },
        {
          id: "v-evidence", layer: "concept",
          title: [x("Ten factors,", "Dhjetë faktorë,", "Zehn Faktoren,"), x("not a magic score", "jo një pikë magjike", "kein Zauberwert")],
          lead: x(
            "The NHS Sustainability Model is a structured conversation about what helps a new practice last: a self-assessment around ten factors in three domains. Doyle and colleagues (2013) evaluated it with 19 project teams in north-west London. A health-service tool, not a validated prediction of success in a warehouse or a hotel.",
            "Modeli i Qëndrueshmërisë i NHS-së është një bisedë e strukturuar për atë që e ndihmon një praktikë të re të zgjasë: një vetëvlerësim rreth dhjetë faktorëve në tri fusha. Doyle dhe kolegët (2013) e vlerësuan me 19 ekipe projektesh në Londrën veriperëndimore. Mjet i shërbimit shëndetësor, jo parashikim i vërtetuar suksesi në një magazinë apo hotel.",
            "Das NHS Sustainability Model ist ein strukturiertes Gespräch darüber, was einer neuen Praxis hilft, Bestand zu haben: eine Selbsteinschätzung rund um zehn Faktoren in drei Bereichen. Doyle und Kollegen (2013) bewerteten es mit 19 Projektteams im Nordwesten Londons. Ein Werkzeug des Gesundheitswesens, keine validierte Erfolgsvorhersage für ein Lager oder Hotel."),
          blocks: [
            { type: "columns", max: 10, height: 100, source: ["doyle-2013"],
              label: x("19 project teams and the Sustainability Model, north-west London", "19 ekipe projektesh dhe Modeli i Qëndrueshmërisë, Londra veriperëndimore", "19 Projektteams und das Sustainability Model, Nordwest-London"),
              items: [
                { k: x("Engaged", "Të angazhuara", "Engagiert"), v: 6, n: "6" },
                { k: x("Partially engaged", "Pjesërisht", "Teilweise"), v: 6, n: "6" },
                { k: x("Non-engaged", "Të paangazhuara", "Nicht engagiert"), v: 7, n: "7", alert: true },
              ] },
            { type: "rows", compact: true, items: [
              { h: x("Process · 4", "Procesi · 4", "Prozess · 4"), p: x("Benefits beyond the first recipient; credibility; adaptability; monitoring.", "Përfitime përtej marrësit të parë; besueshmëria; përshtatshmëria; ndjekja.", "Nutzen über den ersten Empfänger hinaus; Glaubwürdigkeit; Anpassbarkeit; Kontrolle.") },
              { h: x("Staff · 4", "Stafi · 4", "Personal · 4"), p: x("Involvement and training; attitudes; senior leadership; clinical or local leadership.", "Përfshirja dhe trajnimi; qëndrimet; drejtuesit e lartë; udhëheqja klinike ose lokale.", "Beteiligung und Schulung; Einstellungen; obere Führung; klinische oder lokale Führung.") },
              { h: x("Organisation · 2", "Organizata · 2", "Organisation · 2"), p: x("Fit with strategy and culture; infrastructure and resources.", "Përputhja me strategjinë dhe kulturën; infrastruktura dhe burimet.", "Passung zu Strategie und Kultur; Infrastruktur und Ressourcen.") },
            ] },
            { type: "p", text: x(
              "The model asks uncomfortable questions before a rollout is declared complete: are benefits visible to the people doing the work, can the process adapt when its champion leaves, do leaders keep paying attention? These are conditions, not an effect size. “Clinical leadership” must be translated cautiously into a local role structure; an NHS score does not predict logistics performance.",
              "Modeli bën pyetje të pakëndshme para se një nisje të shpallet e përfunduar: a janë përfitimet të dukshme për ata që bëjnë punën, a përshtatet procesi kur largohet nismëtari, a vazhdojnë drejtuesit të kushtojnë vëmendje? Këto janë kushte, jo madhësi efekti. “Udhëheqja klinike” duhet përkthyer me kujdes në një strukturë lokale rolesh; një pikë e NHS-së nuk e parashikon performancën logjistike.",
              "Das Modell stellt unbequeme Fragen, bevor eine Einführung für abgeschlossen erklärt wird: Ist der Nutzen für die Arbeitenden sichtbar, kann der Prozess sich anpassen, wenn sein Vorkämpfer geht, bleiben die Führungskräfte aufmerksam? Das sind Bedingungen, keine Effektgröße. „Klinische Führung“ ist vorsichtig in eine lokale Rollenstruktur zu übersetzen; ein NHS-Wert sagt keine Logistikleistung voraus.") },
          ],
          note: x(
            "Doyle et al., Implementation Science 8:127, 2013: a formative evaluation of 19 teams, “six engaged, six partially engaged, seven non-engaged”, from the abstract. The ten factors are the NHS Institute's model.",
            "Doyle et al., Implementation Science 8:127, 2013: vlerësim formues i 19 ekipeve, “six engaged, six partially engaged, seven non-engaged”, nga abstrakti. Dhjetë faktorët janë të modelit të NHS Institute.",
            "Doyle et al., Implementation Science 8:127, 2013: eine formative Evaluation von 19 Teams, „six engaged, six partially engaged, seven non-engaged“, aus dem Abstract. Die zehn Faktoren sind das Modell des NHS Institute."),
          source: ["doyle-2013"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Make adoption", "Bëje përvetësimin", "Übernahme sichtbar"), x("visible and revisable", "të dukshëm dhe të rishikueshëm", "und revidierbar machen")],
          lead: x(
            "One training record is not enough. Test whether a normal shift can carry the approved method.",
            "Një regjistër trajnimi nuk mjafton. Provo nëse një turn i zakonshëm e mban dot metodën e miratuar.",
            "Ein Schulungsnachweis reicht nicht. Prüfen Sie, ob eine normale Schicht die freigegebene Methode tragen kann."),
          blocks: [
            { type: "steps", items: [
              { h: x("Explain the difference", "Shpjego ndryshimin", "Den Unterschied erklären"), p: x("Staff describe, in their own words, what changes and why.", "Stafi përshkruan, me fjalët e veta, çfarë ndryshon dhe pse.", "Das Personal beschreibt mit eigenen Worten, was sich ändert und warum.") },
              { h: x("Include the next shift", "Përfshi turnin e radhës", "Die nächste Schicht einbeziehen"), p: x("Check the workflow with the people who receive the output or inherit open work.", "Kontrolloje rrjedhën e punës me ata që marrin rezultatin ose trashëgojnë punën e hapur.", "Den Ablauf mit denen prüfen, die das Ergebnis erhalten oder offene Arbeit übernehmen.") },
              { h: x("Provide an authorised reference", "Siguro një referencë të autorizuar", "Eine befugte Referenz bereitstellen"), p: x("One identifiable version, owner and review date; no sensitive case files.", "Një version i identifikueshëm, përgjegjës dhe datë rishikimi; pa dosje rastesh të ndjeshme.", "Eine erkennbare Version, ein Verantwortlicher und ein Prüfdatum; keine sensiblen Fallakten.") },
              { h: x("Make practice possible", "Bëje praktikën të mundur", "Die Praxis ermöglichen"), p: x("Access, staffing, equipment, training and time, before demanding adherence.", "Aksesi, stafi, pajisjet, trajnimi dhe koha, para se të kërkohet zbatimi.", "Zugang, Personal, Ausrüstung, Schulung und Zeit, bevor Einhaltung verlangt wird.") },
              { h: x("Observe ordinary use", "Vëzhgo përdorimin e zakonshëm", "Den gewöhnlichen Gebrauch beobachten"), p: x("Sample the method during routine work, including periods of pressure.", "Merr mostra të metodës gjatë punës rutinë, përfshirë periudhat e presionit.", "Die Methode in der Routinearbeit stichprobenartig prüfen, auch unter Druck.") },
              { h: x("Review and adapt deliberately", "Rishiko dhe përshtat me vetëdije", "Bewusst prüfen und anpassen"), p: x("Did outcomes improve? Revise only through the relevant owner and approval.", "A u përmirësuan rezultatet? Ndrysho vetëm përmes përgjegjësit dhe miratimit përkatës.", "Haben sich die Ergebnisse verbessert? Nur über den zuständigen Verantwortlichen und die Freigabe ändern.") },
            ] },
            { type: "p", text: x(
              "Do not reward only the number of people who clicked “read”; the stronger signal is whether trained users can run the process and spot exceptions safely. A change may need to stop, evolve or be withdrawn if it does not bring the intended benefit.",
              "Mos shpërble vetëm numrin e njerëzve që klikuan “e lexova”; sinjali më i fortë është nëse përdoruesit e trajnuar e kryejnë dot procesin dhe i dallojnë përjashtimet pa rrezik. Një ndryshim mund të duhet të ndalet, të evoluojë ose të tërhiqet, nëse nuk e sjell përfitimin e synuar.",
              "Belohnen Sie nicht nur die Zahl derer, die „gelesen“ angeklickt haben; das stärkere Signal ist, ob geschulte Nutzer den Prozess ausführen und Ausnahmen sicher erkennen. Eine Änderung muss womöglich gestoppt, weiterentwickelt oder zurückgenommen werden, wenn sie den Nutzen nicht bringt.") },
            { type: "callout", reading: true, text: x(
              "Adoption is not obedience to the announcement. It is the ability to make a new way of working function responsibly.",
              "Përvetësimi nuk është bindje ndaj shpalljes. Është aftësia për ta bërë një mënyrë të re pune të funksionojë me përgjegjësi.",
              "Übernahme ist kein Gehorsam gegenüber der Ankündigung. Sie ist die Fähigkeit, eine neue Arbeitsweise verantwortungsvoll zum Funktionieren zu bringen.") },
          ],
          note: x(
            "Editorial protocol after May et al. (2009) and Doyle et al. (2013); proposed, not tested in the author's workplaces.",
            "Protokoll editorial sipas May et al. (2009) dhe Doyle et al. (2013); i propozuar, jo i provuar në vendet e punës së autorit.",
            "Redaktionelles Protokoll nach May et al. (2009) und Doyle et al. (2013); vorgeschlagen, nicht in den Betrieben des Autors getestet."),
          source: ["may-2009", "doyle-2013"],
        },
      ],
    },

    // Chapter VI. The standard that survives
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("The standard that survives", "Standardi që mbijeton", "Der Standard, der überlebt"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "why-the-handover-is-underrated",
          title: [x("The standard", "Standardi", "Der Standard,"), x("that survives", "që mbijeton", "der überlebt")],
          lead: x(
            "A handover still works even after the person who designed it is no longer on the shift.",
            "Një dorëzim funksionon ende edhe pasi personi që e projektoi nuk është më në turn.",
            "Eine Übergabe funktioniert auch dann noch, wenn die Person, die sie entwarf, nicht mehr in der Schicht ist."),
          blocks: [
            { type: "flag", text: x("Hypothetical test, no measured result attributed", "Test hipotetik, pa rezultat të matur që i atribuohet dikujt", "Hypothetischer Test, kein gemessenes Ergebnis zugeschrieben") },
            { type: "p", text: x(
              "Consider a team that has redesigned its shift handover. The first month looks promising. Instead of ending with a congratulatory message, the manager arranges a small test: a trained replacement receives an ordinary open issue, finds the current approved instruction and knows where the next decision belongs. If the receiver still needs to telephone the previous shift for basic facts, the handover has not yet passed the test. This scene is constructed. In the author's night-audit experience, handover and clear SOPs mattered, but no before-and-after evaluation of a personally introduced handover redesign has been documented.",
              "Merr një ekip që e ka riprojektuar dorëzimin e turnit. Muaji i parë duket premtues. Në vend që ta mbyllë me një mesazh urimi, menaxheri organizon një provë të vogël: një zëvendësues i trajnuar merr një çështje të zakonshme të hapur, gjen udhëzimin e miratuar në fuqi dhe e di ku i takon vendimi i radhës. Nëse marrësi ka ende nevojë t'i telefonojë turnit të mëparshëm për fakte bazë, dorëzimi nuk e ka kaluar ende provën. Kjo skenë është e ndërtuar. Në përvojën e autorit në auditimin e natës, dorëzimi dhe SOP-të e qarta kishin rëndësi, por nuk është dokumentuar asnjë vlerësim para-dhe-pas i një riprojektimi dorëzimi të futur personalisht.",
              "Stellen Sie sich ein Team vor, das seine Schichtübergabe neu gestaltet hat. Der erste Monat sieht vielversprechend aus. Statt mit einer Glückwunschnachricht zu enden, setzt die Führungskraft einen kleinen Test an: Ein geschulter Ersatz erhält einen gewöhnlichen offenen Punkt, findet die aktuell freigegebene Anweisung und weiß, wohin die nächste Entscheidung gehört. Muss der Empfänger für Grundtatsachen noch die vorige Schicht anrufen, hat die Übergabe den Test noch nicht bestanden. Diese Szene ist konstruiert. In der Nachtaudit-Erfahrung des Autors zählten Übergabe und klare SOPs, aber eine Vorher-nachher-Bewertung einer persönlich eingeführten Übergabe ist nicht dokumentiert.") },
            { type: "p", text: x(
              "The decisive observation is ordinary. No expert hero is called in, no temporary rescue is hidden in the figures and no one confuses an issue marked “reported” with an issue solved. The work is still allowed to be complex. What has improved is the organisation's capacity to carry that complexity between people and shifts.",
              "Vëzhgimi vendimtar është i zakonshëm. Nuk thirret asnjë hero ekspert, asnjë shpëtim i përkohshëm nuk fshihet në shifra dhe askush nuk e ngatërron një çështje të shënuar “e raportuar” me një çështje të zgjidhur. Punës i lejohet ende të jetë e ndërlikuar. Ajo që është përmirësuar është aftësia e organizatës për ta bartur atë ndërlikim mes njerëzve dhe turneve.",
              "Die entscheidende Beobachtung ist gewöhnlich. Kein Expertenheld wird gerufen, keine vorübergehende Rettung versteckt sich in den Zahlen, und niemand verwechselt einen als „gemeldet“ markierten Punkt mit einem gelösten. Die Arbeit darf weiterhin komplex sein. Verbessert hat sich die Fähigkeit der Organisation, diese Komplexität zwischen Menschen und Schichten zu tragen.") },
            { type: "callout", reading: true, text: x(
              "The durable improvement is a capability that stays available when the original designer is absent.",
              "Përmirësimi i qëndrueshëm është një aftësi që mbetet në dispozicion kur projektuesi i parë mungon.",
              "Die dauerhafte Verbesserung ist eine Fähigkeit, die verfügbar bleibt, wenn der ursprüngliche Gestalter fehlt.") },
          ],
          note: x(
            "Constructed scene; the essay named below and the Shift Handover tool carry the same fields.",
            "Skenë e ndërtuar; eseja e emërtuar më poshtë dhe mjeti Shift Handover i mbajnë të njëjtat fusha.",
            "Konstruierte Szene; der unten genannte Essay und das Tool Shift Handover tragen dieselben Felder."),
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Improve, control,", "Përmirëso, kontrollo,", "Verbessern, steuern,"), x("improve again", "përmirëso sërish", "wieder verbessern")],
          lead: x(
            "A lasting standard needs both a working daily management system and the freedom to discover a better method. The Institute for Healthcare Improvement's 2016 white paper Sustaining Improvement describes management standard work for maintaining gains, informed by Juran's distinction between planning, quality control and quality improvement. Its recommendations come from healthcare practice and selected literature: guidance, not a controlled comparison proving a universal effect in other sectors.",
            "Një standard i qëndrueshëm ka nevojë si për një sistem të përditshëm menaxhimi që funksionon, ashtu edhe për lirinë për të zbuluar një metodë më të mirë. Dokumenti i vitit 2016 i Institute for Healthcare Improvement, Sustaining Improvement, përshkruan punën standarde të menaxhimit për ruajtjen e fitimeve, i mbështetur te dallimi i Juran-it mes planifikimit, kontrollit të cilësisë dhe përmirësimit të cilësisë. Rekomandimet e tij vijnë nga praktika shëndetësore dhe literatura e përzgjedhur: udhëzim, jo krahasim i kontrolluar që provon një efekt universal në sektorë të tjerë.",
            "Ein dauerhafter Standard braucht sowohl ein funktionierendes tägliches Managementsystem als auch die Freiheit, eine bessere Methode zu entdecken. Das White Paper Sustaining Improvement des Institute for Healthcare Improvement von 2016 beschreibt Standardarbeit der Führung zur Sicherung von Gewinnen, gestützt auf Jurans Unterscheidung zwischen Planung, Qualitätskontrolle und Qualitätsverbesserung. Seine Empfehlungen stammen aus der Gesundheitspraxis und ausgewählter Literatur: Anleitung, kein kontrollierter Vergleich, der eine universelle Wirkung in anderen Sektoren beweist."),
          blocks: [
            { type: "chain", items: [
              { h: x("Plan", "Planifiko", "Planen"), p: x("Define the customer need.", "Përkufizo nevojën e klientit.", "Den Kundenbedarf definieren.") },
              { h: x("Improve", "Përmirëso", "Verbessern"), p: x("Test a better condition.", "Provo një kusht më të mirë.", "Eine bessere Bedingung testen.") },
              { h: x("Control", "Kontrollo", "Steuern"), p: x("Monitor the new level.", "Ndiq nivelin e ri.", "Das neue Niveau überwachen.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("Revise when facts change.", "Rishiko kur ndryshojnë faktet.", "Überarbeiten, wenn sich die Fakten ändern.") },
            ] },
            { type: "p", text: x(
              "Quality control is not surveillance of individuals. It is the regular management work needed to notice when the process no longer behaves as designed, protect the result and distinguish immediate recovery from deeper redesign. If the outcome deteriorates, the manager should investigate whether the operating conditions changed or the original improvement never became part of routine work. The difficult balance is between consistency and evolution. An approved standard should protect essential quality and safety requirements. But staff must also have a trustworthy route to report why it no longer fits reality. Without control, improvements fade unnoticed. Without learning, control becomes ceremonial compliance.",
              "Kontrolli i cilësisë nuk është mbikëqyrje e individëve. Është puna e rregullt e menaxhimit që duhet për të vënë re kur procesi nuk sillet më siç u projektua, për ta mbrojtur rezultatin dhe për ta dalluar rikuperimin e menjëhershëm nga riprojektimi më i thellë. Nëse rezultati keqësohet, menaxheri duhet të hetojë nëse ndryshuan kushtet e punës apo përmirësimi i parë nuk u bë kurrë pjesë e punës rutinë. Ekuilibri i vështirë është mes qëndrueshmërisë dhe evolucionit. Një standard i miratuar duhet t'i mbrojë kërkesat thelbësore të cilësisë dhe sigurisë. Por stafit i duhet edhe një rrugë e besueshme për të raportuar pse ai nuk i përshtatet më realitetit. Pa kontroll, përmirësimet zbehen pa u vënë re. Pa të mësuar, kontrolli bëhet pajtueshmëri ceremoniale.",
              "Qualitätskontrolle ist keine Überwachung von Einzelnen. Sie ist die regelmäßige Führungsarbeit, die nötig ist, um zu bemerken, wenn der Prozess sich nicht mehr wie gestaltet verhält, das Ergebnis zu schützen und sofortige Erholung von tieferer Neugestaltung zu unterscheiden. Verschlechtert sich das Ergebnis, sollte die Führungskraft prüfen, ob sich die Betriebsbedingungen änderten oder die ursprüngliche Verbesserung nie Teil der Routine wurde. Die schwierige Balance liegt zwischen Beständigkeit und Weiterentwicklung. Ein freigegebener Standard soll wesentliche Qualitäts- und Sicherheitsanforderungen schützen. Doch das Personal braucht auch einen vertrauenswürdigen Weg, zu melden, warum er nicht mehr zur Wirklichkeit passt. Ohne Steuerung verblassen Verbesserungen unbemerkt. Ohne Lernen wird Steuerung zu zeremonieller Befolgung.") },
            { type: "callout", reading: true, text: x(
              "Improvement changes the process. Daily management makes the change observable and correctable.",
              "Përmirësimi e ndryshon procesin. Menaxhimi i përditshëm e bën ndryshimin të vëzhgueshëm dhe të korrigjueshëm.",
              "Verbesserung verändert den Prozess. Tägliches Management macht die Veränderung beobachtbar und korrigierbar.") },
          ],
          note: x(
            "Scoville, Little, Rakover, Luther and Mate, IHI white paper, 2016; the four-step chain is an editorial compression; the work design is Spear and Bowen (1999).",
            "Scoville, Little, Rakover, Luther dhe Mate, dokument i IHI-së, 2016; zinxhiri me katër hapa është ngjeshje editoriale; projektimi i punës është i Spear dhe Bowen (1999).",
            "Scoville, Little, Rakover, Luther und Mate, IHI-White-Paper, 2016; die Kette mit vier Schritten ist eine redaktionelle Verdichtung; die Arbeitsgestaltung stammt von Spear und Bowen (1999)."),
          source: ["ihi-sustaining-2016", "spear-bowen-1999"],
        },
        {
          id: "vi-measure", layer: "concept",
          title: [x("Measure persistence,", "Mat qëndresën,", "Beständigkeit messen,"), x("not enthusiasm", "jo entuziazmin", "nicht Begeisterung")],
          lead: x(
            "A launch presentation is an event. Sustained performance is a time series: does an agreed result persist across repeated opportunities, shifts and people, with a defined numerator, denominator and process boundary? A handful of good days may be ordinary variation; the IHI recommends run charts and properly built control charts to tell common-cause variation from real change.",
            "Një prezantim nisjeje është një ngjarje. Performanca e qëndrueshme është një seri kohore: a vazhdon një rezultat i rënë dakord nëpër mundësi, turne dhe njerëz të përsëritur, me numërues, emërues dhe kufi procesi të përkufizuar? Disa ditë të mira mund të jenë luhatje e zakonshme; IHI-ja rekomandon grafikë ecurie dhe grafikë kontrolli të ndërtuar siç duhet për ta dalluar luhatjen e zakonshme nga ndryshimi i vërtetë.",
            "Eine Startpräsentation ist ein Ereignis. Dauerhafte Leistung ist eine Zeitreihe: Besteht ein vereinbartes Ergebnis über wiederholte Gelegenheiten, Schichten und Menschen fort, mit definiertem Zähler, Nenner und Prozessgrenze? Eine Handvoll guter Tage kann gewöhnliche Streuung sein; das IHI empfiehlt Verlaufsdiagramme und richtig gebaute Regelkarten, um gewöhnliche Streuung von echter Veränderung zu trennen."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Result", "Rezultati", "Ergebnis"), p: x("Acceptable completed outputs / relevant opportunities, over time.", "Rezultate të pranueshme të kryera / mundësi përkatëse, në kohë.", "Annehmbar erledigte Ergebnisse / relevante Gelegenheiten, über die Zeit.") },
              { h: x("Standard use", "Përdorimi i standardit", "Standardnutzung"), p: x("Cases following the approved critical steps / cases reviewed.", "Raste që ndjekin hapat kritikë të miratuar / raste të rishikuara.", "Fälle, die den freigegebenen kritischen Schritten folgen / geprüfte Fälle.") },
              { h: x("Transferability", "Transferueshmëria", "Übertragbarkeit"), p: x("Substitutes completing the workflow without undocumented rescue / substitute trials.", "Zëvendësues që e kryejnë rrjedhën pa shpëtim të padokumentuar / prova zëvendësimi.", "Vertretungen, die den Ablauf ohne undokumentierte Rettung abschließen / Vertretungsversuche.") },
              { h: x("Exception learning", "Mësimi nga përjashtimet", "Lernen aus Ausnahmen"), p: x("Recurring constraints assigned and reviewed / verified constraints found.", "Kufizime të përsëritura me përgjegjës dhe të rishikuara / kufizime të verifikuara.", "Wiederkehrende Einschränkungen, zugewiesen und geprüft / geprüfte Einschränkungen.") },
            ] },
            { type: "p", text: x(
              "These are editorial suggestions, not validated benchmarks or outcomes from the author's workplaces. Beware a flattering success rate: exclude unresolved cases and almost any percentage looks good. Stratify where the work differs, protect employee and guest information, and with few observations start with a dated run chart rather than an invented baseline or sigma. Test the measurement itself before judging the team from it.",
              "Këto janë sugjerime editoriale, jo standarde të vërtetuara apo rezultate nga vendet e punës së autorit. Ki kujdes nga një normë suksesi lajkatare: përjashto rastet e pazgjidhura, dhe pothuajse çdo përqindje duket mirë. Ndaji rezultatet aty ku puna ndryshon, mbro informacionin e punonjësve dhe mysafirëve, dhe me pak vëzhgime nis me një grafik ecurie me data, jo me një gjendje fillestare apo sigma të shpikur. Provoje vetë matjen para se ta gjykosh ekipin prej saj.",
              "Das sind redaktionelle Vorschläge, keine validierten Richtwerte und keine Ergebnisse aus den Betrieben des Autors. Hüten Sie sich vor einer schmeichelhaften Erfolgsquote: Ungelöste Fälle ausschließen, und fast jeder Prozentsatz sieht gut aus. Schichten Sie, wo die Arbeit sich unterscheidet, schützen Sie Mitarbeiter- und Gastdaten, und beginnen Sie bei wenigen Beobachtungen mit einem datierten Verlaufsdiagramm statt einer erfundenen Ausgangslage oder Sigma. Prüfen Sie die Messung selbst, bevor Sie das Team danach beurteilen.") },
            { type: "callout", reading: true, text: x(
              "One good day is news. A reliable sequence of days is evidence worth investigating.",
              "Një ditë e mirë është lajm. Një varg i besueshëm ditësh është provë që ia vlen të hetohet.",
              "Ein guter Tag ist eine Nachricht. Eine verlässliche Folge von Tagen ist ein Beleg, der die Untersuchung lohnt.") },
          ],
          note: x(
            "Run and Shewhart charts after Williams (IHI, 2018) and the IHI white paper (2016); the four ratios are editorial. The site's Sigma & Control Chart tool draws such a chart.",
            "Grafikët e ecurisë dhe të Shewhart-it sipas Williams (IHI, 2018) dhe dokumentit të IHI-së (2016); katër raportet janë editoriale. Mjeti Sigma & Control Chart i faqes e vizaton një grafik të tillë.",
            "Verlaufs- und Shewhart-Diagramme nach Williams (IHI, 2018) und dem IHI-White-Paper (2016); die vier Verhältnisse sind redaktionell. Das Tool Sigma & Control Chart der Seite zeichnet ein solches Diagramm."),
          source: ["ihi-williams-2018", "ihi-sustaining-2016"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("A 30 / 60 / 90", "Një test terreni", "Ein 30/60/90-Tage-"), x("day field test", "30 / 60 / 90-ditor", "Feldtest")],
          lead: x(
            "Three review points for a non-urgent change; the cadence is proposed, not established by the cited studies.",
            "Tri pika rishikimi për një ndryshim jourgjent; ritmi është propozim, jo i vërtetuar nga studimet e cituara.",
            "Drei Prüfpunkte für eine nicht dringende Änderung; der Takt ist ein Vorschlag, kein Studienergebnis."),
          blocks: [
            { type: "timeline", items: [
              { k: x("Day 0", "Dita 0", "Tag 0"), t: x("Define result and owner.", "Përkufizo rezultatin dhe përgjegjësin.", "Ergebnis und Verantwortlichen definieren.") },
              { k: x("Day 30", "Dita 30", "Tag 30"), t: x("Observe live use.", "Vëzhgo përdorimin e vërtetë.", "Den echten Gebrauch beobachten.") },
              { k: x("Day 60", "Dita 60", "Tag 60"), t: x("Test transfer.", "Provo transferimin.", "Die Übertragung testen.") },
              { k: x("Day 90", "Dita 90", "Tag 90"), t: x("Judge continuation.", "Vendos për vazhdimin.", "Über die Fortführung entscheiden.") },
            ] },
            { type: "steps", items: [
              { h: x("Before launch", "Para nisjes", "Vor dem Start"), p: x("Baseline, customer result, authorised SOP.", "Gjendja fillestare, rezultati për klientin, SOP-i i autorizuar.", "Ausgangslage, Kundenergebnis, SOP.") },
              { h: x("At day 30", "Në ditën 30", "Am Tag 30"), p: x("Ordinary use, exceptions, downstream quality.", "Përdorimi i zakonshëm, përjashtimet, cilësia më poshtë në zinxhir.", "Gebrauch, Ausnahmen, nachgelagerte Qualität.") },
              { h: x("At day 60", "Në ditën 60", "Am Tag 60"), p: x("Can a newly trained or substitute colleague use the method?", "A e përdor dot metodën një koleg i sapotrajnuar ose zëvendësues?", "Kann ein neu geschulter oder vertretender Kollege die Methode nutzen?") },
              { h: x("At day 90", "Në ditën 90", "Am Tag 90"), p: x("Outcomes against baseline, adaptations noted; retain, revise or withdraw.", "Rezultatet kundrejt gjendjes fillestare, përshtatjet e shënuara; mbaj, ndrysho apo tërhiq.", "Ergebnisse gegen die Ausgangslage; behalten, ändern oder zurücknehmen.") },
              { h: x("At every checkpoint", "Në çdo pikë kontrolli", "An jedem Prüfpunkt"), p: x("An accountable owner, the decision shared with the team, unresolved problems recorded.", "Një përgjegjës, vendimi i ndarë me ekipin, problemet e pazgjidhura të shënuara.", "Ein Verantwortlicher, die Entscheidung mit dem Team geteilt, offene Probleme notiert.") },
            ] },
            { type: "p", text: x(
              "A safety, legal, privacy or serious service issue is never deferred to day 30: use the approved immediate procedure. Structural changes may need far longer than 90 days; the timetable is modest on purpose, a start to learning, not proof of long-term sustainability.",
              "Një çështje sigurie, ligjore, privatësie apo shërbimi serioz nuk shtyhet kurrë deri në ditën 30: përdor procedurën e miratuar të menjëhershme. Ndryshimet strukturore mund të duan shumë më gjatë se 90 ditë; kalendari është modest me qëllim, një fillim për të mësuar, jo provë e qëndrueshmërisë afatgjatë.",
              "Ein Sicherheits-, Rechts-, Datenschutz- oder ernstes Serviceproblem wartet nie bis Tag 30: Es nimmt das freigegebene Sofortverfahren. Strukturelle Änderungen brauchen oft weit mehr als 90 Tage; der Plan ist bewusst bescheiden, ein Anfang des Lernens, kein Beweis von Nachhaltigkeit.") },
            { type: "callout", reading: true, text: x(
              "The calendar is a reminder to ask. Only the observed work and outcomes can answer.",
              "Kalendari është kujtesë për të pyetur. Vetëm puna dhe rezultatet e vëzhguara mund të përgjigjen.",
              "Der Kalender ist eine Erinnerung zu fragen. Antworten können nur die beobachtete Arbeit und die Ergebnisse.") },
          ],
          note: x(
            "Editorial cadence after Wiltsey Stirman et al. (2012), the IHI (2016) and Doyle et al. (2013); no study establishes 30, 60 and 90 days as the right interval.",
            "Ritëm editorial sipas Wiltsey Stirman et al. (2012), IHI-së (2016) dhe Doyle et al. (2013); asnjë studim nuk i vërteton 30, 60 dhe 90 ditët si intervalin e duhur.",
            "Redaktioneller Takt nach Wiltsey Stirman et al. (2012), dem IHI (2016) und Doyle et al. (2013); keine Studie belegt 30, 60 und 90 Tage als richtigen Abstand."),
          source: ["wiltsey-stirman-2012", "ihi-sustaining-2016", "doyle-2013"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Standard", "Karta e mbijetesës", "Das Blatt zum Überleben"), x("Survival Card", "së standardit", "des Standards")],
      lead: x(
        "One standard, one outcome, one safe and reviewable test. Print a blank copy; keep internal records in authorised locations. If there is no reliable result measure, write “not measured”.",
        "Një standard, një rezultat, një provë e sigurt dhe e rishikueshme. Printo një kopje bosh; regjistrat e brendshëm mbaji në vende të autorizuara. Nëse nuk ka matje të besueshme të rezultatit, shkruaj “nuk është matur”.",
        "Ein Standard, ein Ergebnis, ein sicherer, überprüfbarer Test. Drucken Sie eine leere Kopie; interne Aufzeichnungen bleiben an befugten Orten. Gibt es kein verlässliches Ergebnismaß, schreiben Sie „nicht gemessen“."),
      blocks: [
        { type: "form", items: [
          { h: x("Purpose and result", "Qëllimi dhe rezultati", "Zweck und Ergebnis"), hint: x("what specific customer or downstream outcome must continue?", "cili rezultat i caktuar për klientin ose më poshtë në zinxhir duhet të vazhdojë?", "welches konkrete Kunden- oder nachgelagerte Ergebnis muss fortbestehen?") },
          { h: x("Current standard", "Standardi në fuqi", "Aktueller Standard"), hint: x("which approved version, critical steps and stopping rule apply?", "cili version i miratuar, cilët hapa kritikë dhe cili rregull ndalimi vlejnë?", "welche freigegebene Version, welche kritischen Schritte und welche Stoppregel gelten?") },
          { h: x("People and substitute", "Njerëzit dhe zëvendësuesi", "Menschen und Vertretung"), hint: x("who owns it? can another trained person do the work?", "kush e ka në dorë? a e bën dot punën një person tjetër i trajnuar?", "wer verantwortet ihn? kann eine andere geschulte Person die Arbeit tun?") },
          { h: x("Work at the point", "Puna në pikën e saj", "Arbeit am Ort"), hint: x("what was observed, not simply reported or ticked?", "çfarë u vëzhgua, jo thjesht u raportua ose u shënua?", "was wurde beobachtet, nicht bloß gemeldet oder angekreuzt?") },
          { h: x("Measurement and change", "Matja dhe ndryshimi", "Messung und Änderung"), hint: x("baseline, repeat sample, exceptions, approved adaptations", "gjendja fillestare, mostra e përsëritur, përjashtimet, përshtatjet e miratuara", "Ausgangslage, Wiederholungsstichprobe, Ausnahmen, freigegebene Anpassungen") },
          { h: x("Decision / tell back", "Vendimi / trego", "Entscheidung / Rückmeldung"), hint: x("keep, revise or stop? owner, next date, and feedback to staff", "mbaj, ndrysho apo ndalo? përgjegjësi, data e radhës dhe përgjigjja për stafin", "behalten, ändern oder stoppen? Verantwortlicher, nächster Termin und Rückmeldung ans Personal") },
        ] },
      ],
      note: x(
        "Original editorial tool, synthesising Spear and Bowen, May et al., Wiltsey Stirman et al. and the IHI. Review horizon proposed by the editors: days 30, 60 and 90. If a case is sensitive, record only a sanitised description in any public example.",
        "Mjet origjinal editorial, që sintetizon Spear e Bowen, May et al., Wiltsey Stirman et al. dhe IHI-në. Horizont rishikimi i propozuar nga redaksia: ditët 30, 60 dhe 90. Nëse një rast është i ndjeshëm, në çdo shembull publik shëno vetëm një përshkrim të pastruar.",
        "Eigenes redaktionelles Werkzeug, das Spear und Bowen, May et al., Wiltsey Stirman et al. und das IHI zusammenführt. Von der Redaktion vorgeschlagener Prüfhorizont: Tag 30, 60 und 90. Ist ein Fall sensibel, in jedem öffentlichen Beispiel nur eine bereinigte Beschreibung festhalten."),
      source: ["spear-bowen-1999", "may-2009", "wiltsey-stirman-2012", "ihi-sustaining-2016"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("Build the capability,", "Ndërto aftësinë,", "Die Fähigkeit bauen,"), x("not the hero", "jo heroin", "nicht den Helden")],
      lead: x(
        "What survives after the manager, trainer or project owner has moved on?",
        "Çfarë mbijeton pasi menaxheri, trajnuesi ose pronari i projektit ka shkuar më tej?",
        "Was überlebt, wenn Führungskraft, Ausbilder oder Projektverantwortlicher weitergezogen sind?"),
      blocks: [
        { type: "p", text: x(
          "A manager can have a genuinely good week. An overdue task gets completed; the trolley area is clearer; the incoming shift finally receives the information it needs. These achievements matter. The danger is turning them into a story about the remarkable individual who “made it happen”, while leaving the next team with no reliable way to repeat the result. Operational improvement does not belong to a trophy cabinet. It belongs to the work. A standard has to fit the conditions under which it will be used, withstand an ordinary busy day and remain intelligible when a new person arrives. Those conditions do not eliminate the need for leadership. They change its purpose. Instead of being the permanent rescuer, the manager helps build the capability to see, report, correct and learn.",
          "Një menaxher mund të ketë një javë vërtet të mirë. Një detyrë e vonuar përfundon; zona e karrocave është më e qartë; turni që vjen më në fund e merr informacionin që i duhet. Këto arritje kanë rëndësi. Rreziku është t'i kthesh në një histori për individin e jashtëzakonshëm që “e bëri të ndodhë”, duke e lënë ekipin e radhës pa asnjë mënyrë të besueshme për ta përsëritur rezultatin. Përmirësimi operacional nuk i takon një vitrine trofesh. I takon punës. Një standard duhet t'u përshtatet kushteve në të cilat do të përdoret, t'i bëjë ballë një dite të zakonshme të ngarkuar dhe të mbetet i kuptueshëm kur vjen një person i ri. Këto kushte nuk e heqin nevojën për udhëheqje. Ia ndryshojnë qëllimin. Në vend që të jetë shpëtimtari i përhershëm, menaxheri ndihmon të ndërtohet aftësia për të parë, raportuar, korrigjuar dhe mësuar.",
          "Eine Führungskraft kann eine wirklich gute Woche haben. Eine überfällige Aufgabe wird erledigt; der Wagenbereich ist übersichtlicher; die kommende Schicht erhält endlich die Information, die sie braucht. Diese Erfolge zählen. Die Gefahr ist, sie zu einer Geschichte über die bemerkenswerte Person zu machen, die es „möglich gemacht hat“, und dem nächsten Team keinen verlässlichen Weg zu lassen, das Ergebnis zu wiederholen. Betriebliche Verbesserung gehört nicht in eine Trophäenvitrine. Sie gehört zur Arbeit. Ein Standard muss zu den Bedingungen passen, unter denen er genutzt wird, einen gewöhnlichen vollen Tag aushalten und verständlich bleiben, wenn eine neue Person kommt. Diese Bedingungen beseitigen den Bedarf an Führung nicht. Sie ändern ihren Zweck. Statt der ständige Retter zu sein, hilft die Führungskraft, die Fähigkeit aufzubauen, zu sehen, zu melden, zu korrigieren und zu lernen.") },
        { type: "p", text: x(
          "The research in this volume does not offer a magic number for the lifespan of a good idea. Spear and Bowen remind us that specification and experimentation must work together. Tucker and Edmondson show why repeated first-order recovery can obstruct organisational learning. May and colleagues give language to the work of normalising a practice. Sustainment reviews reveal how incomplete the evidence often is. The IHI guidance asks management to make ongoing quality control part of its own standard work. These ideas travel from hospitals and manufacturing into last-mile and hospitality only as questions to test, never as measured findings about the author's former employers. The most useful legacy a manager can leave is therefore neither a perfect report nor a set of instructions bearing their name. It is a way of working where the next person can understand the purpose, notice when reality differs, find the owner of the decision and improve the process without pretending the old method was flawless.",
          "Kërkimi në këtë vëllim nuk ofron një numër magjik për jetëgjatësinë e një ideje të mirë. Spear dhe Bowen na kujtojnë se përcaktimi dhe eksperimentimi duhet të punojnë bashkë. Tucker dhe Edmondson tregojnë pse rikuperimi i përsëritur i rendit të parë mund ta pengojë të mësuarit organizativ. May dhe kolegët i japin gjuhë punës për normalizimin e një praktike. Rishikimet e qëndrueshmërisë zbulojnë sa e paplotë është shpesh prova. Udhëzimi i IHI-së i kërkon menaxhmentit ta bëjë kontrollin e vazhdueshëm të cilësisë pjesë të punës së vet standarde. Këto ide udhëtojnë nga spitalet dhe prodhimi në miljen e fundit dhe në mikpritje vetëm si pyetje për t'u provuar, kurrë si gjetje të matura për punëdhënësit e mëparshëm të autorit. Trashëgimia më e dobishme që mund të lërë një menaxher nuk është pra as një raport i përsosur, as një tog udhëzimesh me emrin e tij. Është një mënyrë pune ku personi i radhës e kupton qëllimin, e vëren kur realiteti ndryshon, e gjen pronarin e vendimit dhe e përmirëson procesin pa shtirur se metoda e vjetër ishte e përsosur.",
          "Die Forschung in diesem Band bietet keine Zauberzahl für die Lebensdauer einer guten Idee. Spear und Bowen erinnern daran, dass Festlegung und Experiment zusammenwirken müssen. Tucker und Edmondson zeigen, warum wiederholte Erholung erster Ordnung organisatorisches Lernen behindern kann. May und Kollegen geben der Arbeit des Normalisierens einer Praxis eine Sprache. Übersichten zum Fortbestand zeigen, wie lückenhaft die Belege oft sind. Die IHI-Anleitung verlangt von der Führung, laufende Qualitätskontrolle zu ihrer eigenen Standardarbeit zu machen. Diese Ideen wandern aus Kliniken und Fertigung in die letzte Meile und die Gastlichkeit nur als Fragen zum Prüfen, nie als gemessene Befunde über die früheren Arbeitgeber des Autors. Das nützlichste Vermächtnis einer Führungskraft ist daher weder ein perfekter Bericht noch ein Satz Anweisungen mit ihrem Namen. Es ist eine Arbeitsweise, in der die nächste Person den Zweck versteht, bemerkt, wenn die Wirklichkeit abweicht, den Verantwortlichen der Entscheidung findet und den Prozess verbessert, ohne so zu tun, als wäre die alte Methode makellos gewesen.") },
        { type: "callout", reading: true, text: x(
          "The test of an improvement is not the applause on launch day. It is the quality of work that remains when the launch team has gone.",
          "Prova e një përmirësimi nuk janë duartrokitjet ditën e nisjes. Është cilësia e punës që mbetet kur ekipi i nisjes ka ikur.",
          "Die Prüfung einer Verbesserung ist nicht der Applaus am Starttag. Sie ist die Qualität der Arbeit, die bleibt, wenn das Startteam gegangen ist.") },
      ],
      note: x(
        "Editorial conclusion. Whether any personal improvement lasted after a role change is not known from verified follow-up data.",
        "Përfundim editorial. Nëse ndonjë përmirësim personal zgjati pas ndërrimit të rolit, nuk dihet nga të dhëna ndjekjeje të verifikuara.",
        "Redaktionelles Fazit. Ob eine persönliche Verbesserung nach einem Rollenwechsel Bestand hatte, ist aus geprüften Folgedaten nicht bekannt."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Evidence, adaptation,", "Prova, përshtatja", "Belege, Anpassung"), x("and limits", "dhe kufijtë", "und Grenzen")],
      lead: x(
        "An evidence-informed editorial treatise. Not a new field experiment, management audit or verified intervention outcome.",
        "Një traktat editorial i mbështetur në prova. Jo eksperiment i ri në terren, auditim menaxhimi apo rezultat i verifikuar ndërhyrjeje.",
        "Ein belegbasierter redaktioneller Traktat. Kein neues Feldexperiment, kein Managementaudit und kein geprüftes Interventionsergebnis."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Verified field", "Terren i verifikuar", "Geprüftes Feld"), p: x("Work categories from last-mile loading, driver ramp-up, hotel training, shift handovers and the author's documentation project.", "Kategori pune nga ngarkimi në miljen e fundit, hyrja e shoferëve në punë, trajnimi në hotel, dorëzimet e turneve dhe projekti i dokumentimit i autorit.", "Arbeitskategorien aus Last-Mile-Beladung, Fahrereinarbeitung, Hotelschulung, Schichtübergaben und dem Dokumentationsprojekt des Autors.") },
          { h: x("Published research", "Kërkim i botuar", "Veröffentlichte Forschung"), p: x("Peer-reviewed research, a systematic review, a model application study and IHI guidance, each named by design and setting.", "Kërkim i recensuar, një rishikim sistematik, një studim zbatimi modeli dhe udhëzim i IHI-së, secili i emërtuar sipas dizajnit dhe mjedisit.", "Begutachtete Forschung, eine systematische Übersicht, eine Studie zur Modellanwendung und IHI-Anleitung, je nach Design und Umfeld benannt.") },
          { h: x("Constructed scenes", "Skena të ndërtuara", "Konstruierte Szenen"), p: x("Every invented driver, colleague, timetable and handover is labelled hypothetical. No result is attributed to an employer.", "Çdo shofer, koleg, orar dhe dorëzim i shpikur etiketohet si hipotetik. Asnjë rezultat nuk i atribuohet një punëdhënësi.", "Jeder erfundene Fahrer, Kollege, Zeitplan und jede Übergabe ist als hypothetisch gekennzeichnet. Kein Ergebnis wird einem Arbeitgeber zugeschrieben.") },
          { h: x("Operational tools", "Mjetet operacionale", "Betriebliche Werkzeuge"), p: x("The Standard Survival Card and the 30/60/90 review are proposed, not validated instruments or approved procedures.", "Karta e mbijetesës së standardit dhe rishikimi 30/60/90 janë propozime, jo instrumente të vërtetuara apo procedura të miratuara.", "Das Blatt zum Überleben des Standards und die 30/60/90-Prüfung sind Vorschläge, keine validierten Instrumente oder freigegebenen Verfahren.") },
        ] },
        { type: "p", text: x(
          "Evidence boundaries. Spear and Bowen (1999) describe organisational design from Toyota research, not a trial in logistics. Tucker and Edmondson (2003) observed nurses in nine hospitals. The NPT papers of 2009 are explanatory theory. Wiltsey Stirman et al. (2012) reviewed 125 studies, many with limited sustainment measures. The NHS model application and the IHI papers are health-care guidance; their factors predict nothing for the author's workplaces. Measurement boundaries. No benefit, decay rate or training effect is invented; 125, 93% and 19 teams belong to the cited studies, not to company performance. The review interval is not claimed as optimal. Actions are subject to authorised SOPs. Editorial standard: source, interpretation and proposal stay distinguishable, and a conclusion stops claiming when the evidence stops.",
          "Kufijtë e provës. Spear dhe Bowen (1999) përshkruajnë projektim organizativ nga kërkimi mbi Toyota-n, jo një provë në logjistikë. Tucker dhe Edmondson (2003) vëzhguan infermiere në nëntë spitale. Punimet e NPT-së të vitit 2009 janë teori shpjeguese. Wiltsey Stirman et al. (2012) rishikuan 125 studime, shumë me matje të kufizuara qëndrueshmërie. Zbatimi i modelit të NHS-së dhe dokumentet e IHI-së janë udhëzime nga shëndetësia; faktorët e tyre nuk parashikojnë asgjë për vendet e punës së autorit. Kufijtë e matjes. Nuk shpiket asnjë përfitim, normë zbehjeje apo efekt trajnimi; 125, 93% dhe 19 ekipe u takojnë studimeve të cituara, jo performancës së ndonjë kompanie. Intervali i rishikimit nuk pretendohet si optimal. Veprimet u nënshtrohen SOP-ve të autorizuara. Standardi editorial: burimi, interpretimi dhe propozimi mbeten të dallueshëm, dhe një përfundim pushon së pohuari kur mbaron prova.",
          "Grenzen der Belege. Spear und Bowen (1999) beschreiben organisatorische Gestaltung aus der Toyota-Forschung, keinen Versuch in der Logistik. Tucker und Edmondson (2003) beobachteten Pflegekräfte in neun Kliniken. Die NPT-Arbeiten von 2009 sind erklärende Theorie. Wiltsey Stirman et al. (2012) sichteten 125 Studien, viele mit begrenzten Fortbestandsmaßen. Die NHS-Modellanwendung und die IHI-Papiere sind Anleitung aus dem Gesundheitswesen; ihre Faktoren sagen nichts für die Betriebe des Autors voraus. Grenzen der Messung. Kein Nutzen, keine Verfallsrate und kein Schulungseffekt wird erfunden; 125, 93 % und 19 Teams gehören zu den zitierten Studien, nicht zur Unternehmensleistung. Das Prüfintervall wird nicht als optimal behauptet. Handlungen unterliegen freigegebenen SOPs. Redaktioneller Standard: Quelle, Deutung und Vorschlag bleiben unterscheidbar, und ein Fazit hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited on the next page; the three counts (125 studies, 93% first-order responses, 19 teams) were read in the abstracts or, for Tucker and Edmondson, in the full text.",
        "Çdo burim citohet në faqen tjetër; tre numrat (125 studime, 93% përgjigje të rendit të parë, 19 ekipe) u lexuan në abstraktet ose, për Tucker dhe Edmondson, në tekstin e plotë.",
        "Jede Quelle ist auf der nächsten Seite zitiert; die drei Zahlen (125 Studien, 93 % Reaktionen erster Ordnung, 19 Teams) wurden in den Abstracts oder, bei Tucker und Edmondson, im Volltext gelesen."),
      source: ["spear-bowen-1999", "tucker-edmondson-2003", "may-2009", "may-finch-2009", "wiltsey-stirman-2012", "ihi-sustaining-2016", "doyle-2013", "ihi-williams-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
