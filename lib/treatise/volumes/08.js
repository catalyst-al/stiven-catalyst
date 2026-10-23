// Operational treatise, Volume 8: The training illusion, why watching the work is not the same as being ready to do
// it. Block: Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the training
// and transfer literature: Baldwin & Ford 1988, Arthur et al. 2003, Taylor, Russ-Eft & Chan 2005, Burke & Hutchins
// 2007, Keith & Frese 2008, Aguinis & Kraiger 2009, Blume et al. 2010, Grossman & Salas 2011, Salas et al. 2012 and
// Sitzmann & Weinhardt 2018, each checked at its DOI. Six chapters in the three layers, as in the author's PDF, and
// the method has its own page. Both charts carry published effect sizes (Keith & Frese; Arthur et al.), which are
// pooled estimates from different sets of studies, never readiness rates; nothing is measured in the author's
// workplaces.
import { x } from "../common.js";

export default {
  number: 8,
  numeral: "VIII",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The training illusion:", "Iluzioni i trajnimit:", "Die Trainingsillusion:"), x("why watching the work is not being ready to do it", "pse të shohësh punën nuk do të thotë të jesh gati ta bësh", "warum Zusehen nicht heißt, bereit zu sein")],
  sub: x(
    "Six chapters on practice, transfer, expert knowledge, competence under pressure and proof of readiness.",
    "Gjashtë kapituj për praktikën, transferimin, dijen e ekspertit, kompetencën nën presion dhe provën e gatishmërisë.",
    "Sechs Kapitel über Übung, Transfer, Expertenwissen, Kompetenz unter Druck und den Nachweis der Bereitschaft."),
  seo: x(
    "The training illusion, an operational treatise: six chapters in three layers, from the first shift alone to Baldwin, Keith and Frese and the Readiness Card.",
    "Iluzioni i trajnimit, traktat operacional: gjashtë kapituj në tri shtresa, nga turni i parë vetëm te Baldwin e Ford, Keith e Frese dhe Karta e gatishmërisë.",
    "Die Trainingsillusion, operativer Traktat: sechs Kapitel in drei Ebenen, von der ersten Schicht allein zu Baldwin, Keith und Frese und der Bereitschaftskarte."),
  feature: x(
    "Volume 8 asks what a completed training proves. Its six chapters move from the first independent shift, a demonstration that could not happen, the expert who is the manual, the standard on a busy day and the course that never reached the shift, to Baldwin and Ford, Taylor, Russ-Eft and Chan, Keith and Frese, Blume, Grossman and Salas and Arthur's four outcomes, and end with five kinds of readiness evidence and the Operational Readiness Card.",
    "Vëllimi 8 pyet çfarë provon një trajnim i përfunduar. Gjashtë kapitujt e tij shkojnë nga turni i parë i pavarur, një demonstrim që nuk mundi të ndodhte, eksperti që është vetë manuali, standardi në një ditë të ngarkuar dhe kursi që nuk arriti kurrë te turni, te Baldwin e Ford, Taylor, Russ-Eft e Chan, Keith e Frese, Blume, Grossman e Salas dhe katër rezultatet e Arthur-it, dhe mbyllen me pesë lloje provash gatishmërie dhe me Kartën e gatishmërisë operacionale.",
    "Band 8 fragt, was ein abgeschlossenes Training beweist. Seine sechs Kapitel führen von der ersten eigenständigen Schicht, einer Vorführung, die nicht stattfinden konnte, dem Experten, der das Handbuch ist, dem Standard an einem vollen Tag und dem Kurs, der die Schicht nie erreichte, zu Baldwin und Ford, Taylor, Russ-Eft und Chan, Keith und Frese, Blume, Grossman und Salas und Arthurs vier Ergebnissen, und enden mit fünf Arten von Bereitschaftsbelegen und der Bereitschaftskarte."),
  figure: { n: "117", by: x("Taylor, Russ-Eft and Chan 2005, not a readiness rate", "Taylor, Russ-Eft e Chan 2005, jo normë gatishmërie", "Taylor, Russ-Eft und Chan 2005, keine Bereitschaftsquote"), t: x(
    "studies in a meta-analysis of behaviour-modelling training, distinguishing learning from later job behaviour.",
    "studime në një meta-analizë të trajnimit me modelim sjelljeje, që e dallon të mësuarit nga sjellja e mëvonshme në punë.",
    "Studien in einer Metaanalyse zum Verhaltensmodellierungstraining, die Lernen vom späteren Arbeitsverhalten unterscheidet.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The first shift alone", "Turni i parë vetëm", "Die erste Schicht allein") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("What error learning shows", "Çfarë tregon të mësuarit nga gabimet", "Was Lernen aus Fehlern zeigt") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Operational Readiness Card", "Karta e gatishmërisë operacionale", "Die Bereitschaftskarte") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real categories of operational work, no invented personal incidents.", "Kategori të vërteta pune operacionale, pa ngjarje personale të shpikura.", "Echte Kategorien betrieblicher Arbeit, keine erfundenen persönlichen Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Research setting, sample, outcome and limits stated together.", "Mjedisi i kërkimit, mostra, rezultati dhe kufijtë, të thënë bashkë.", "Forschungsumfeld, Stichprobe, Ergebnis und Grenzen gemeinsam genannt.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("Readiness is claimed for a task, from observed work, never for a person.", "Gatishmëria pretendohet për një detyrë, nga puna e vëzhguar, kurrë për një person.", "Bereitschaft wird für eine Aufgabe behauptet, aus beobachteter Arbeit, nie für eine Person.") },
  ],
  sources: ["baldwin-ford-1988", "arthur-2003", "taylor-russ-eft-chan-2005", "burke-hutchins-2007", "keith-frese-2008", "aguinis-kraiger-2009", "blume-2010", "grossman-salas-2011", "salas-2012", "sitzmann-weinhardt-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The badge", "Dëshmia", "Das Zertifikat"), x("and the work", "dhe puna", "und die Arbeit")],
      why: x(
        "An organisation can prove that training happened without proving that its people are ready to work independently.",
        "Një organizatë mund të provojë se trajnimi ndodhi, pa provuar se njerëzit e saj janë gati të punojnë të pavarur.",
        "Eine Organisation kann beweisen, dass ein Training stattfand, ohne zu beweisen, dass ihre Leute bereit sind, eigenständig zu arbeiten."),
      body: x(
        "The attendance list is complete. The slides have been shown. The new colleague has watched an experienced person execute a procedure and has received a document to read. A manager may now be tempted to classify the training as complete. Yet the real work does not unfold like the demonstration. Instructions are interrupted. Priorities compete. A condition appears that the slide deck never described. The colleague must decide whether to continue, pause or ask for help. This volume studies that gap. Training activity is not the same as retained learning; learning is not the same as transfer to work; a good first performance is not proof of competence across conditions. The science is more useful than a slogan: it describes the trainee, the design of practice, the support of the workplace and the measurement required to know what changed. The author has worked with last-mile ramp-up teams and with Front Office and Night Audit training materials. During an early hotel training night a system update limited practical learning. He later organised SOP guidance, images and checklists in Front Desk Control. Those verified categories do not establish that any particular training programme failed or that the tool improved measurable outcomes; every composite scene below is labelled. The editorial test is simple: what could the trainee demonstrate, in an authorised setting, without being prompted; what exception could they recognise; and what support would be available when the real shift begins?",
        "Lista e pjesëmarrjes është e plotë. Sllajdet janë shfaqur. Kolegu i ri e ka parë një person me përvojë duke e kryer një procedurë dhe ka marrë një dokument për ta lexuar. Një menaxher mund të tundohet tani ta klasifikojë trajnimin si të përfunduar. Por puna e vërtetë nuk shpaloset si demonstrimi. Udhëzimet ndërpriten. Përparësitë konkurrojnë. Shfaqet një kusht që sllajdet nuk e përshkruan kurrë. Kolegu duhet të vendosë nëse do të vazhdojë, do të ndalet apo do të kërkojë ndihmë. Ky vëllim e studion atë hendek. Veprimtaria e trajnimit nuk është njësoj si të mësuarit e ruajtur; të mësuarit nuk është njësoj si transferimi në punë; një performancë e parë e mirë nuk është provë kompetence në të gjitha kushtet. Shkenca është më e dobishme se një slogan: përshkruan të trajnuarin, projektimin e praktikës, mbështetjen e vendit të punës dhe matjen që duhet për të ditur çfarë ndryshoi. Autori ka punuar me ekipe fillimi në miljen e fundit dhe me materiale trajnimi të Front Office-it dhe të Night Audit-it. Gjatë një nate të hershme trajnimi në hotel, një përditësim sistemi e kufizoi të mësuarit praktik. Më vonë ai organizoi udhëzime SOP, imazhe dhe lista kontrolli në Front Desk Control. Këto kategori të verifikuara nuk vërtetojnë se ndonjë program i caktuar trajnimi dështoi apo se mjeti përmirësoi rezultate të matshme; çdo skenë e përbërë më poshtë është e etiketuar. Prova editoriale është e thjeshtë: çfarë mund të demonstronte i trajnuari, në një mjedis të autorizuar, pa iu sugjeruar; cilin përjashtim mund ta njihte; dhe çfarë mbështetjeje do të ishte në dispozicion kur të niste turni i vërtetë?",
        "Die Anwesenheitsliste ist vollständig. Die Folien wurden gezeigt. Die neue Kollegin hat einer erfahrenen Person beim Ausführen eines Verfahrens zugesehen und ein Dokument zum Lesen erhalten. Eine Führungskraft mag nun versucht sein, das Training als abgeschlossen einzustufen. Doch die echte Arbeit läuft nicht wie die Vorführung ab. Anweisungen werden unterbrochen. Prioritäten konkurrieren. Eine Bedingung taucht auf, die die Folien nie beschrieben haben. Die Kollegin muss entscheiden, ob sie weitermacht, innehält oder um Hilfe bittet. Dieser Band untersucht diese Lücke. Trainingsaktivität ist nicht dasselbe wie behaltenes Lernen; Lernen ist nicht dasselbe wie Transfer in die Arbeit; eine gute erste Leistung ist kein Beweis für Kompetenz unter allen Bedingungen. Die Wissenschaft ist nützlicher als ein Slogan: Sie beschreibt die Lernende, die Gestaltung der Übung, die Unterstützung am Arbeitsplatz und die Messung, die nötig ist, um zu wissen, was sich änderte. Der Autor hat mit Anlaufteams der letzten Meile und mit Schulungsmaterial für Front Office und Night Audit gearbeitet. In einer frühen Trainingsnacht im Hotel begrenzte ein Systemupdate das praktische Lernen. Später ordnete er SOP-Anleitungen, Bilder und Checklisten in Front Desk Control. Diese geprüften Kategorien belegen nicht, dass ein bestimmtes Trainingsprogramm scheiterte oder dass das Werkzeug messbare Ergebnisse verbesserte; jede zusammengesetzte Szene unten ist gekennzeichnet. Der redaktionelle Test ist einfach: Was könnte die Lernende in einem autorisierten Rahmen ohne Aufforderung zeigen; welche Ausnahme könnte sie erkennen; und welche Unterstützung wäre da, wenn die echte Schicht beginnt?"),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("Training evidence", "Prova e trajnimit", "Trainingsbelege"), x("needs a denominator", "ka nevojë për emërues", "brauchen einen Nenner")],
      lead: x(
        "The studies in this volume were conducted in different settings and evaluated different outcomes. They do not provide a universal readiness percentage.",
        "Studimet e këtij vëllimi u kryen në mjedise të ndryshme dhe vlerësuan rezultate të ndryshme. Nuk japin një përqindje universale gatishmërie.",
        "Die Studien dieses Bandes stammen aus verschiedenen Umfeldern und bewerteten verschiedene Ergebnisse. Sie liefern keinen universellen Bereitschaftsprozentsatz."),
      blocks: [
        { type: "p", text: x(
          "Baldwin and Ford (1988) framed transfer as both the generalisation of learned material to a job and its maintenance over time; their review is a synthesis, not an experiment proving one optimum method. Arthur and colleagues (2003) reported separate effect sizes for reaction, learning, behaviour and results, from different collections of evaluations, not one cohort. Taylor, Russ-Eft and Chan (2005) reviewed 117 studies of behaviour-modelling training. Keith and Frese (2008) analysed 24 studies with 2,183 participants of error-management training. Blume and colleagues (2010) synthesised 89 empirical studies of transfer. Aguinis and Kraiger (2009) review the benefits of training for individuals, teams, organisations and society: one more reason not to mistake a completion count for an organisational outcome.",
          "Baldwin dhe Ford (1988) e përkufizuan transferimin si përgjithësim i materialit të mësuar në punë dhe si ruajtje e tij në kohë; rishikimi i tyre është sintezë, jo eksperiment që provon një metodë optimale. Arthur dhe kolegët (2003) raportuan efekte të ndara për reagimin, të mësuarit, sjelljen dhe rezultatet, nga përmbledhje të ndryshme vlerësimesh, jo nga një grup i vetëm. Taylor, Russ-Eft dhe Chan (2005) rishikuan 117 studime të trajnimit me modelim sjelljeje. Keith dhe Frese (2008) analizuan 24 studime me 2.183 pjesëmarrës të trajnimit për menaxhimin e gabimeve. Blume dhe kolegët (2010) sintetizuan 89 studime empirike të transferimit. Aguinis dhe Kraiger (2009) rishikojnë dobitë e trajnimit për individët, ekipet, organizatat dhe shoqërinë: edhe një arsye për të mos e ngatërruar numrin e përfundimeve me një rezultat organizativ.",
          "Baldwin und Ford (1988) fassten Transfer als Verallgemeinerung des Gelernten auf die Arbeit und als Erhalt über die Zeit; ihre Übersicht ist eine Synthese, kein Experiment, das eine optimale Methode beweist. Arthur und Kollegen (2003) berichteten getrennte Effektstärken für Reaktion, Lernen, Verhalten und Ergebnisse, aus verschiedenen Sammlungen von Evaluationen, nicht aus einer Kohorte. Taylor, Russ-Eft und Chan (2005) werteten 117 Studien zum Verhaltensmodellierungstraining aus. Keith und Frese (2008) analysierten 24 Studien mit 2.183 Teilnehmenden zum Fehlermanagementtraining. Blume und Kollegen (2010) fassten 89 empirische Transferstudien zusammen. Aguinis und Kraiger (2009) sichten den Nutzen von Training für Einzelne, Teams, Organisationen und Gesellschaft: ein Grund mehr, Abschlusszahl und Organisationsergebnis nicht zu verwechseln.") },
        { type: "cards", cols: 3, items: [
          { h: x("Reported", "E raportuar", "Berichtet"), p: x("Publication, population, outcome, effect size and design.", "Botimi, popullata, rezultati, madhësia e efektit dhe projektimi.", "Veröffentlichung, Population, Ergebnis, Effektstärke und Design.") },
          { h: x("Interpreted", "E interpretuar", "Gedeutet"), p: x("An operational hypothesis cautiously transferred to other settings.", "Një hipotezë operacionale e bartur me kujdes në mjedise të tjera.", "Eine betriebliche Hypothese, vorsichtig auf andere Umfelder übertragen.") },
          { h: x("Not claimed", "E papretenduar", "Nicht behauptet"), p: x("A measured improvement in the author's workplaces without evidence.", "Një përmirësim i matur në vendet e punës së autorit pa prova.", "Eine gemessene Verbesserung an den Arbeitsplätzen des Autors ohne Belege.") },
        ] },
        { type: "p", text: x(
          "The numbers identify reviewed studies or participants. They do not establish how many new drivers were ready after a course, how often hotel trainees made mistakes, or whether a private training tool reduced incidents. The business examples illustrate mechanisms and generate local questions; they do not launder research findings into unsupported employer claims.",
          "Numrat identifikojnë studime të rishikuara ose pjesëmarrës. Nuk vërtetojnë sa shoferë të rinj ishin gati pas një kursi, sa shpesh bënin gabime të trajnuarit në hotel, apo nëse një mjet privat trajnimi i uli incidentet. Shembujt e biznesit ilustrojnë mekanizma dhe ngrenë pyetje lokale; nuk i shndërrojnë gjetjet kërkimore në pretendime të pambështetura për punëdhënësit.",
          "Die Zahlen benennen ausgewertete Studien oder Teilnehmende. Sie belegen nicht, wie viele neue Fahrer nach einem Kurs bereit waren, wie oft Hotelauszubildende Fehler machten oder ob ein privates Werkzeug Vorfälle verringerte. Die Beispiele illustrieren Mechanismen und werfen örtliche Fragen auf; sie machen aus Forschung keine unbelegten Behauptungen über Arbeitgeber.") },
        { type: "callout", reading: true, text: x(
          "The decisive question is not whether the training was delivered. It is whether the work can be done safely, accurately and with appropriate support.",
          "Pyetja vendimtare nuk është nëse trajnimi u dha. Është nëse puna mund të bëhet në mënyrë të sigurt, të saktë dhe me mbështetjen e duhur.",
          "Die entscheidende Frage ist nicht, ob das Training stattfand. Sie ist, ob die Arbeit sicher, genau und mit angemessener Unterstützung getan werden kann.") },
      ],
      note: x(
        "Baldwin and Ford (1988); Arthur et al. (2003); Taylor et al. (2005); Keith and Frese (2008); Aguinis and Kraiger (2009); Blume et al. (2010).",
        "Baldwin e Ford (1988); Arthur et al. (2003); Taylor et al. (2005); Keith e Frese (2008); Aguinis e Kraiger (2009); Blume et al. (2010).",
        "Baldwin und Ford (1988); Arthur et al. (2003); Taylor et al. (2005); Keith und Frese (2008); Aguinis und Kraiger (2009); Blume et al. (2010)."),
      source: ["baldwin-ford-1988", "arthur-2003", "taylor-russ-eft-chan-2005", "keith-frese-2008", "aguinis-kraiger-2009", "blume-2010"],
    },

    // Chapter I. The first shift alone
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The first shift alone", "Turni i parë vetëm", "Die erste Schicht allein"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "watch-how-i-do-it-is-not-training",
          title: [x("The first shift", "Turni i parë", "Die erste Schicht"), x("alone", "vetëm", "allein")],
          lead: x(
            "A trainee can repeat a procedure beside an experienced colleague and still be unprepared to judge an unfamiliar exception.",
            "Një i trajnuar mund ta përsërisë një procedurë pranë një kolegu me përvojë dhe prapë të mos jetë gati të gjykojë një përjashtim të panjohur.",
            "Eine Lernende kann ein Verfahren neben einer erfahrenen Kollegin wiederholen und trotzdem nicht bereit sein, eine unbekannte Ausnahme zu beurteilen."),
          blocks: [
            { type: "flag", text: x("Constructed last-mile scene, not a personal incident", "Skenë e ndërtuar e miljes së fundit, jo ngjarje personale", "Konstruierte Last-Mile-Szene, kein persönlicher Vorfall") },
            { type: "p", text: x(
              "The loading area is preparing for departures. A newly trained colleague knows the planned sequence: check the assigned work, confirm the expected load and move to the next step. During practice, a trainer stood nearby and answered questions before uncertainty became visible. Today, on an independent shift, the colleague sees an item whose status does not match what the work area seems to show. There are at least three possible responses. The worker could guess and proceed. The worker could stop everything without identifying the correct owner. Or the worker could recognise a defined exception, contain only the affected task and contact the authorised role. The appropriate response depends on the real procedure, which this illustrative scene deliberately does not reproduce.",
              "Zona e ngarkimit po përgatitet për nisjet. Një koleg i sapotrajnuar e di radhën e planifikuar: kontrollo punën e caktuar, konfirmo ngarkesën e pritur dhe kalo te hapi tjetër. Gjatë praktikës, një trajner qëndronte aty pranë dhe u përgjigjej pyetjeve para se pasiguria të bëhej e dukshme. Sot, në një turn të pavarur, kolegu sheh një artikull statusi i të cilit nuk përputhet me atë që duket se tregon zona e punës. Ka të paktën tri përgjigje të mundshme. Punonjësi mund të hamendësojë dhe të vazhdojë. Mund të ndalë gjithçka pa e identifikuar përgjegjësin e duhur. Ose mund ta njohë një përjashtim të përkufizuar, ta kufizojë vetëm detyrën e prekur dhe të kontaktojë rolin e autorizuar. Përgjigjja e duhur varet nga procedura e vërtetë, të cilën kjo skenë ilustruese qëllimisht nuk e riprodhon.",
              "Der Ladebereich bereitet die Abfahrten vor. Eine frisch geschulte Kollegin kennt die geplante Abfolge: zugewiesene Arbeit prüfen, erwartete Ladung bestätigen, zum nächsten Schritt gehen. In der Übung stand ein Trainer daneben und beantwortete Fragen, bevor Unsicherheit sichtbar wurde. Heute, in einer eigenständigen Schicht, sieht die Kollegin einen Artikel, dessen Status nicht zu dem passt, was der Arbeitsbereich zu zeigen scheint. Es gibt mindestens drei mögliche Reaktionen. Sie könnte raten und weitermachen. Sie könnte alles anhalten, ohne die richtige Verantwortliche zu finden. Oder sie könnte eine definierte Ausnahme erkennen, nur die betroffene Aufgabe eingrenzen und die befugte Rolle kontaktieren. Die angemessene Reaktion hängt vom echten Verfahren ab, das diese Szene bewusst nicht wiedergibt.") },
            { type: "p", text: x(
              "This is not proof of a mistake at an employer. The author has documented last-mile loading, missing bags, new-driver ramp-up and standard-work challenges. The specific worker, clock time, discrepancy and outcome here are invented. The scene isolates one training question: did anyone ask the new colleague to demonstrate the response to an exception, not just the ideal sequence?",
              "Kjo nuk është provë e një gabimi te një punëdhënës. Autori ka dokumentuar ngarkimin në miljen e fundit, çantat që mungojnë, fillimin e shoferëve të rinj dhe sfidat e punës standarde. Punonjësi, ora, mospërputhja dhe rezultati këtu janë të shpikura. Skena izolon një pyetje trajnimi: a i kërkoi dikush kolegut të ri ta demonstronte përgjigjen ndaj një përjashtimi, jo vetëm radhën ideale?",
              "Das ist kein Beweis für einen Fehler bei einem Arbeitgeber. Der Autor hat Beladung der letzten Meile, fehlende Taschen, Anlauf neuer Fahrer und Herausforderungen der Standardarbeit dokumentiert. Arbeitskraft, Uhrzeit, Abweichung und Ausgang sind hier erfunden. Die Szene isoliert eine Trainingsfrage: Hat jemand die neue Kollegin gebeten, die Reaktion auf eine Ausnahme zu zeigen, nicht nur die ideale Abfolge?") },
            { type: "callout", reading: true, text: x(
              "The first moment of uncertainty is where a certificate and a capability may part company.",
              "Çasti i parë i pasigurisë është aty ku një certifikatë dhe një aftësi mund të ndahen.",
              "Der erste Moment der Unsicherheit ist der Ort, an dem sich Zertifikat und Fähigkeit trennen können.") },
          ],
          note: x(
            "Constructed illustration anchored only in documented last-mile work categories; no internal operational procedure is disclosed. The essay named below says why “watch how I do it” is not training.",
            "Ilustrim i ndërtuar, i mbështetur vetëm në kategori të dokumentuara pune të miljes së fundit; nuk zbulohet asnjë procedurë e brendshme. Eseja e emërtuar më poshtë thotë pse “shiko si e bëj unë” nuk është trajnim.",
            "Konstruierte Illustration, nur in dokumentierten Last-Mile-Arbeitskategorien verankert; kein internes Verfahren wird offengelegt. Der unten genannte Essay sagt, warum „schau, wie ich es mache“ kein Training ist."),
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Attendance is", "Pjesëmarrja nuk është", "Anwesenheit ist"), x("not competence", "kompetencë", "keine Kompetenz")],
          lead: x(
            "A training record answers who attended. A readiness decision must answer what the person can do and under what conditions.",
            "Një regjistër trajnimi përgjigjet kush mori pjesë. Një vendim gatishmërie duhet të përgjigjet çfarë mund të bëjë personi dhe në çfarë kushtesh.",
            "Ein Trainingsnachweis beantwortet, wer anwesend war. Eine Bereitschaftsentscheidung muss beantworten, was die Person kann und unter welchen Bedingungen."),
          blocks: [
            { type: "p", text: x(
              "The gap starts with a confusion of evidence. Attendance shows exposure to an activity. Recall shows whether a person can explain a step. Guided performance shows execution with prompts and protection. Independent demonstration gives stronger evidence for a bounded task. Transfer asks whether the skill survives when the original trainer, setting and script are gone. Baldwin and Ford identify generalisation and maintenance as the central conditions of transfer. The implications are practical: define the task before training, demonstrate it in a relevant environment, and observe what the worker does once ordinary support replaces the trainer. A single flawless practice run is narrow evidence when the role contains different kinds of exceptions.",
              "Hendeku nis me një ngatërrim provash. Pjesëmarrja tregon ekspozim ndaj një veprimtarie. Kujtesa tregon nëse personi mund ta shpjegojë një hap. Performanca e udhëhequr tregon ekzekutim me sugjerime dhe mbrojtje. Demonstrimi i pavarur jep provë më të fortë për një detyrë të kufizuar. Transferimi pyet nëse aftësia mbijeton kur trajneri, mjedisi dhe skenari fillestar nuk janë më. Baldwin dhe Ford e identifikojnë përgjithësimin dhe ruajtjen si kushtet qendrore të transferimit. Pasojat janë praktike: përkufizoje detyrën para trajnimit, demonstroje në një mjedis përkatës dhe vëzhgo çfarë bën punonjësi kur mbështetja e zakonshme e zëvendëson trajnerin. Një provë e vetme e përsosur është provë e ngushtë kur roli përmban lloje të ndryshme përjashtimesh.",
              "Die Lücke beginnt mit einer Verwechslung von Belegen. Anwesenheit zeigt Kontakt mit einer Aktivität. Erinnerung zeigt, ob jemand einen Schritt erklären kann. Angeleitete Ausführung zeigt Arbeit mit Hinweisen und Absicherung. Eigenständige Vorführung ist ein stärkerer Beleg für eine abgegrenzte Aufgabe. Transfer fragt, ob die Fähigkeit überlebt, wenn Trainer, Umfeld und Skript fort sind. Baldwin und Ford nennen Verallgemeinerung und Erhalt als zentrale Bedingungen des Transfers. Die Folgen sind praktisch: die Aufgabe vor dem Training definieren, in einem passenden Umfeld vorführen und beobachten, was die Arbeitskraft tut, sobald gewöhnliche Unterstützung den Trainer ersetzt. Ein einziger fehlerfreier Übungslauf ist ein schmaler Beleg, wenn die Rolle verschiedene Arten von Ausnahmen enthält.") },
            { type: "cards", cols: 3, items: [
              { h: x("Seen", "E parë", "Gesehen"), p: x("The trainee watched or attended the instruction.", "I trajnuari e pa ose mori pjesë në udhëzim.", "Die Lernende sah zu oder nahm an der Unterweisung teil.") },
              { h: x("Shown", "E treguar", "Gezeigt"), p: x("The trainee performed a defined task to a standard.", "I trajnuari e kreu një detyrë të përkufizuar sipas standardit.", "Die Lernende führte eine definierte Aufgabe nach Standard aus.") },
              { h: x("Retained", "E ruajtur", "Behalten"), p: x("The capability was checked again in real or controlled conditions.", "Aftësia u kontrollua sërish në kushte reale ose të kontrolluara.", "Die Fähigkeit wurde unter realen oder kontrollierten Bedingungen erneut geprüft.") },
            ] },
            { type: "p", text: x(
              "Readiness also depends on task risk. For a low-consequence lookup, supported practice may be enough to proceed with supervision. For safety-sensitive work, access controls or formally governed hotel procedures, only the employer can authorise the required competence checks. An editorial card cannot certify a person or bypass the organisation's standards.",
              "Gatishmëria varet edhe nga rreziku i detyrës. Për një kërkim me pasoja të ulëta, praktika e mbështetur mund të mjaftojë për të vazhduar me mbikëqyrje. Për punë të ndjeshme për sigurinë, kontrolle qasjeje ose procedura hoteli të rregulluara formalisht, vetëm punëdhënësi mund t'i autorizojë kontrollet e kërkuara të kompetencës. Një kartë editoriale nuk e certifikon dot një person dhe nuk i anashkalon standardet e organizatës.",
              "Bereitschaft hängt auch vom Aufgabenrisiko ab. Für eine folgenarme Abfrage kann begleitete Übung reichen, um unter Aufsicht weiterzumachen. Für sicherheitsrelevante Arbeit, Zugangskontrollen oder förmlich geregelte Hotelverfahren kann nur der Arbeitgeber die nötigen Kompetenzprüfungen autorisieren. Eine redaktionelle Karte kann keine Person zertifizieren und keine Standards der Organisation umgehen.") },
            { type: "callout", reading: true, text: x(
              "A completed training session is evidence of delivery. It is not automatically evidence of readiness.",
              "Një seancë e përfunduar trajnimi është provë e dhënies. Nuk është automatikisht provë gatishmërie.",
              "Eine abgeschlossene Trainingseinheit belegt die Durchführung. Sie belegt nicht automatisch Bereitschaft.") },
          ],
          note: x(
            "Research frame: Baldwin and Ford, Personnel Psychology (1988). The readiness categories are an editorial operational synthesis.",
            "Kuadri kërkimor: Baldwin e Ford, Personnel Psychology (1988). Kategoritë e gatishmërisë janë sintezë operacionale editoriale.",
            "Forschungsrahmen: Baldwin und Ford, Personnel Psychology (1988). Die Bereitschaftskategorien sind eine redaktionelle betriebliche Synthese."),
          source: ["baldwin-ford-1988"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Before the", "Para turnit të parë", "Vor der ersten"), x("first independent shift", "të pavarur", "eigenständigen Schicht")],
          lead: x(
            "A release-to-work decision should be proportional to task risk, based on observation and owned by an authorised role.",
            "Një vendim lëshimi në punë duhet të jetë në përpjesëtim me rrezikun e detyrës, i mbështetur në vëzhgim dhe në pronësi të një roli të autorizuar.",
            "Eine Freigabe zur Arbeit sollte dem Aufgabenrisiko entsprechen, auf Beobachtung beruhen und einer befugten Rolle gehören."),
          blocks: [
            { type: "steps", items: [
              { h: x("Name one critical task", "Emërto një detyrë kritike", "Eine kritische Aufgabe benennen"), p: x("Observable completion criteria and the applicable current procedure.", "Kritere të vëzhgueshme përfundimi dhe procedura aktuale në fuqi.", "Beobachtbare Abschlusskriterien und das geltende aktuelle Verfahren.") },
              { h: x("Observe an assisted execution", "Vëzhgo një ekzekutim të ndihmuar", "Eine begleitete Ausführung beobachten"), p: x("Separate what the trainee did from what the trainer supplied.", "Ndaje çfarë bëri i trajnuari nga çfarë dha trajneri.", "Trennen, was die Lernende tat, von dem, was der Trainer beisteuerte.") },
              { h: x("Introduce a safe exception", "Fut një përjashtim të sigurt", "Eine sichere Ausnahme einführen"), p: x("A simulation or approved training situation, never a live unsafe shortcut.", "Një simulim ose situatë e miratuar trajnimi, kurrë një shkurtore e pasigurt në punë të vërtetë.", "Eine Simulation oder genehmigte Übungssituation, nie eine unsichere Abkürzung im Betrieb.") },
              { h: x("Ask for a teach-back", "Kërko një shpjegim mbrapsht", "Um eine Rückerklärung bitten"), p: x("What is the expected result? Which condition requires stopping or escalation?", "Cili është rezultati i pritur? Cili kusht kërkon ndalim ose eskalim?", "Was ist das erwartete Ergebnis? Welche Bedingung verlangt Anhalten oder Eskalation?") },
              { h: x("Record authorised supervision", "Shëno mbikëqyrjen e autorizuar", "Autorisierte Aufsicht festhalten"), p: x("The level of assistance and the person who can approve progression.", "Niveli i ndihmës dhe personi që mund ta miratojë kalimin më tej.", "Das Maß der Hilfe und die Person, die den nächsten Schritt freigeben kann.") },
              { h: x("Schedule a follow-up observation", "Planifiko një vëzhgim ndjekës", "Eine Folgebeobachtung ansetzen"), p: x("Does performance still meet the standard after the initial demonstration?", "A e plotëson performanca ende standardin pas demonstrimit të parë?", "Erfüllt die Leistung den Standard auch nach der ersten Vorführung?") },
            ] },
            { type: "p", text: x(
              "These categories are no substitute for local qualifications. A fair assessor records not only pass or fail but what was observed, the limits of the observation and the next practice opportunity. A trainee who correctly recognises a condition that requires help may be showing competence, not weakness; one who performs the normal task quickly while ignoring an exception should not be declared ready because the stopwatch looks good.",
              "Këto kategori nuk i zëvendësojnë kualifikimet lokale. Një vlerësues i drejtë shënon jo vetëm kaloi apo dështoi, por çfarë u vëzhgua, kufijtë e vëzhgimit dhe mundësinë e radhës për praktikë. Një i trajnuar që e njeh saktë një kusht që kërkon ndihmë mund të po tregojë kompetencë, jo dobësi; ai që e kryen shpejt detyrën normale duke e shpërfillur një përjashtim nuk duhet shpallur gati se kronometri duket mirë.",
              "Diese Kategorien ersetzen keine örtlichen Qualifikationen. Eine faire Prüferin hält nicht nur bestanden oder nicht fest, sondern was beobachtet wurde, die Grenzen der Beobachtung und die nächste Übungsgelegenheit. Wer eine Bedingung, die Hilfe verlangt, richtig erkennt, zeigt womöglich Kompetenz, nicht Schwäche; wer die normale Aufgabe schnell erledigt und eine Ausnahme übergeht, ist nicht bereit, nur weil die Stoppuhr gut aussieht.") },
            { type: "callout", reading: true, text: x(
              "Do not mark a person independent because the calendar says the training period has ended.",
              "Mos e shëno dikë të pavarur se kalendari thotë që periudha e trajnimit ka mbaruar.",
              "Erklären Sie niemanden für eigenständig, nur weil der Kalender sagt, die Trainingszeit sei vorbei.") },
          ],
          note: x(
            "Original editorial protocol informed by Baldwin and Ford (1988) and Salas et al. (2012); not an employer-approved certification.",
            "Protokoll editorial origjinal i mbështetur te Baldwin e Ford (1988) dhe Salas et al. (2012); jo certifikim i miratuar nga punëdhënësi.",
            "Eigenes redaktionelles Protokoll nach Baldwin und Ford (1988) und Salas et al. (2012); keine vom Arbeitgeber genehmigte Zertifizierung."),
          source: ["baldwin-ford-1988", "salas-2012"],
        },
      ],
    },

    // Chapter II. Watch me is not a training method
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("“Watch me” is not a training method", "“Më shiko” nuk është metodë trajnimi", "„Schau mir zu“ ist keine Trainingsmethode"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "the-night-the-system-went-down",
          title: [x("When the demonstration", "Kur demonstrimi", "Wenn die Vorführung"), x("cannot happen", "nuk mund të ndodhë", "nicht stattfinden kann")],
          lead: x(
            "The gap between watching and performing becomes visible when a learner cannot practise in the system they need to master.",
            "Hendeku mes të parit dhe të bërit bëhet i dukshëm kur nxënësi nuk mund të praktikojë në sistemin që duhet të zotërojë.",
            "Die Lücke zwischen Zusehen und Ausführen wird sichtbar, wenn eine Lernende nicht in dem System üben kann, das sie beherrschen muss."),
          blocks: [
            { type: "flag", text: x("Documented context and constructed reflection, no guest details", "Kontekst i dokumentuar dhe reflektim i ndërtuar, pa detaje mysafirësh", "Dokumentierter Kontext und konstruierte Reflexion, keine Gästedetails") },
            { type: "p", text: x(
              "During an early hotel training night in 2026, a system update made normal hands-on learning unavailable for several hours. The colleague could explain parts of the process, but the trainee could not practise them in the usual way during that interval. This is a documented limitation of that training night; it is not evidence of a sudden unplanned outage or of unsafe hotel operations. A useful question remains once access returns. Was the missed demonstration later converted into supervised practice? Was a person asked to perform the step, describe an exception and explain where the approved guidance lived? The records available for this volume do not establish a measured before-and-after skill level, so no invented final outcome is supplied.",
              "Gjatë një nate të hershme trajnimi në hotel, në vitin 2026, një përditësim sistemi e bëri të padisponueshëm të mësuarit normal praktik për disa orë. Kolegu mund të shpjegonte pjesë të procesit, por i trajnuari nuk mund t'i praktikonte në mënyrën e zakonshme gjatë atij intervali. Ky është kufizim i dokumentuar i asaj nate trajnimi; nuk është provë e një ndërprerjeje të papritur apo e operacioneve të pasigurta hoteli. Një pyetje e dobishme mbetet kur qasja kthehet. A u kthye demonstrimi i humbur më vonë në praktikë të mbikëqyrur? A iu kërkua dikujt ta kryente hapin, të përshkruante një përjashtim dhe të shpjegonte ku gjendej udhëzimi i miratuar? Regjistrat në dispozicion për këtë vëllim nuk vërtetojnë një nivel aftësie të matur para dhe pas, prandaj nuk jepet asnjë rezultat i shpikur.",
              "In einer frühen Trainingsnacht im Hotel 2026 machte ein Systemupdate das normale praktische Lernen für mehrere Stunden unmöglich. Die Kollegin konnte Teile des Prozesses erklären, doch die Lernende konnte sie in dieser Zeit nicht wie üblich üben. Das ist eine dokumentierte Einschränkung dieser Trainingsnacht; sie ist kein Beleg für einen plötzlichen ungeplanten Ausfall oder unsicheren Hotelbetrieb. Eine nützliche Frage bleibt, sobald der Zugang zurück ist. Wurde die verpasste Vorführung später in begleitete Übung umgewandelt? Wurde jemand gebeten, den Schritt auszuführen, eine Ausnahme zu beschreiben und zu erklären, wo die genehmigte Anleitung liegt? Die für diesen Band verfügbaren Aufzeichnungen belegen kein gemessenes Vorher-Nachher-Niveau, daher wird kein erfundenes Ergebnis geliefert.") },
            { type: "p", text: x(
              "The author later worked with SOP documents, annotated images, checklists and Front Desk Control to make training information easier to locate. The tool is not claimed to be a hotel-approved replacement for the official system, and no measured reduction in training time is asserted. A clear reference helps preparation; reading it is not the same as making a correct decision inside the real workflow.",
              "Autori punoi më vonë me dokumente SOP, imazhe të shënuara, lista kontrolli dhe Front Desk Control, që informacioni i trajnimit të gjendej më lehtë. Mjeti nuk pretendohet si zëvendësim i miratuar nga hoteli për sistemin zyrtar, dhe nuk pohohet asnjë ulje e matur e kohës së trajnimit. Një referencë e qartë ndihmon përgatitjen; ta lexosh nuk është njësoj si të marrësh një vendim të saktë brenda rrjedhës së vërtetë të punës.",
              "Der Autor arbeitete später mit SOP-Dokumenten, beschrifteten Bildern, Checklisten und Front Desk Control, damit Trainingsinformation leichter zu finden ist. Das Werkzeug wird nicht als hotelgenehmigter Ersatz des offiziellen Systems beansprucht, und keine gemessene Verkürzung der Trainingszeit wird behauptet. Eine klare Referenz hilft der Vorbereitung; sie zu lesen ist nicht dasselbe wie eine richtige Entscheidung im echten Arbeitsablauf.") },
            { type: "callout", reading: true, text: x(
              "If practice is missing, the training gap must be named rather than disguised by a completed attendance sheet.",
              "Nëse mungon praktika, hendeku i trajnimit duhet emërtuar, jo maskuar nga një listë pjesëmarrjeje e plotësuar.",
              "Fehlt die Übung, muss die Trainingslücke benannt werden, statt sie hinter einer vollständigen Anwesenheitsliste zu verstecken.") },
          ],
          note: x(
            "Documented context: early hotel training interrupted by a system update; the interpretive questions and remedies are editorial. The essay named below tells that night.",
            "Kontekst i dokumentuar: trajnim i hershëm hoteli i ndërprerë nga një përditësim sistemi; pyetjet interpretuese dhe ilaçet janë editoriale. Eseja e emërtuar më poshtë e tregon atë natë.",
            "Dokumentierter Kontext: frühes Hoteltraining, unterbrochen von einem Systemupdate; die Deutungsfragen und Abhilfen sind redaktionell. Der unten genannte Essay erzählt diese Nacht."),
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Four moves", "Katër lëvizje", "Vier Schritte"), x("after the demonstration", "pas demonstrimit", "nach der Vorführung")],
          lead: x(
            "Behaviour modelling can help learning. The mistake is treating observation alone as the entire training design.",
            "Modelimi i sjelljes mund ta ndihmojë të mësuarit. Gabimi është ta trajtosh vetëm vëzhgimin si gjithë projektimin e trajnimit.",
            "Verhaltensmodellierung kann dem Lernen helfen. Der Fehler ist, Zusehen allein für das ganze Trainingsdesign zu halten."),
          blocks: [
            { type: "p", text: x(
              "Showing an experienced person doing the job is useful because it gives the beginner an example of sequence, language and visible standards. The learner still has to form an explanation, try the behaviour and receive information about the difference between the attempt and the standard. When the task changes, the learner may need a principle rather than a memorised click path. Taylor, Russ-Eft and Chan analysed behaviour-modelling training across 117 studies. Their meta-analysis examined differences in learning, job behaviour and organisational results and identified design features associated with better transfer. The researchers did not argue that watching alone creates competence: the type of modelling, the practice conditions, support and performance criteria mattered.",
              "Të tregosh një person me përvojë duke bërë punën është e dobishme, sepse i jep fillestarit një shembull radhe, gjuhe dhe standardesh të dukshme. Nxënësi duhet prapë të formojë një shpjegim, ta provojë sjelljen dhe të marrë informacion për dallimin mes përpjekjes dhe standardit. Kur detyra ndryshon, nxënësit mund t'i duhet një parim, jo një rrugë klikimesh e mësuar përmendësh. Taylor, Russ-Eft dhe Chan e analizuan trajnimin me modelim sjelljeje në 117 studime. Meta-analiza e tyre shqyrtoi dallimet në të mësuar, sjellje në punë dhe rezultate organizative dhe identifikoi veçori projektimi të lidhura me transferim më të mirë. Kërkuesit nuk argumentuan se vetëm të parit krijon kompetencë: kishin rëndësi lloji i modelimit, kushtet e praktikës, mbështetja dhe kriteret e performancës.",
              "Eine erfahrene Person bei der Arbeit zu zeigen ist nützlich, weil es Anfängern ein Beispiel für Abfolge, Sprache und sichtbare Standards gibt. Die Lernende muss trotzdem eine Erklärung bilden, das Verhalten versuchen und Information über den Unterschied zwischen Versuch und Standard erhalten. Ändert sich die Aufgabe, braucht sie womöglich ein Prinzip statt eines auswendig gelernten Klickpfads. Taylor, Russ-Eft und Chan analysierten Verhaltensmodellierungstraining in 117 Studien. Ihre Metaanalyse untersuchte Unterschiede in Lernen, Arbeitsverhalten und Organisationsergebnissen und fand Gestaltungsmerkmale, die mit besserem Transfer zusammenhingen. Die Forschenden behaupteten nicht, Zusehen allein erzeuge Kompetenz: Art der Modellierung, Übungsbedingungen, Unterstützung und Leistungskriterien zählten.") },
            { type: "chain", items: [
              { h: x("Show", "Trego", "Zeigen"), p: x("Make the reference performance visible.", "Bëje të dukshme performancën referencë.", "Die Referenzleistung sichtbar machen.") },
              { h: x("Explain", "Shpjego", "Erklären"), p: x("State why each decision is required.", "Thuaj pse kërkohet çdo vendim.", "Sagen, warum jede Entscheidung nötig ist.") },
              { h: x("Rehearse", "Ushtro", "Üben"), p: x("Let the learner perform safely.", "Lëre nxënësin ta kryejë në mënyrë të sigurt.", "Die Lernende sicher ausführen lassen.") },
              { h: x("Review", "Rishiko", "Prüfen"), p: x("Correct, repeat and test transfer.", "Korrigjo, përsërit dhe provo transferimin.", "Korrigieren, wiederholen, Transfer testen.") },
            ] },
            { type: "p", text: x(
              "A manual can make the sequence repeatable, but it cannot observe how a learner reasons about an exception. A trainer can supply that judgement, yet may make the practice easier by prompting every step. The design task is to reduce prompting deliberately without removing safety supervision; only authorised staff decide which steps may be rehearsed and which remain restricted.",
              "Një manual mund ta bëjë radhën të përsëritshme, por nuk e vëzhgon dot si arsyeton nxënësi për një përjashtim. Një trajner mund ta japë atë gjykim, por mund ta lehtësojë praktikën duke sugjeruar çdo hap. Detyra e projektimit është ta ulë sugjerimin qëllimisht pa hequr mbikëqyrjen e sigurisë; vetëm stafi i autorizuar vendos cilët hapa mund të ushtrohen dhe cilët mbeten të kufizuar.",
              "Ein Handbuch kann die Abfolge wiederholbar machen, aber nicht beobachten, wie eine Lernende über eine Ausnahme nachdenkt. Ein Trainer kann dieses Urteil liefern, macht die Übung aber womöglich leichter, indem er jeden Schritt vorsagt. Die Gestaltungsaufgabe ist, das Vorsagen bewusst zu verringern, ohne die Sicherheitsaufsicht zu entfernen; nur befugtes Personal entscheidet, welche Schritte geübt werden dürfen und welche gesperrt bleiben.") },
            { type: "callout", reading: true, text: x(
              "The strength of modelling is the visible example. The test of training is what the learner can later do with it.",
              "Forca e modelimit është shembulli i dukshëm. Prova e trajnimit është çfarë mund të bëjë më vonë nxënësi me të.",
              "Die Stärke der Modellierung ist das sichtbare Beispiel. Der Test des Trainings ist, was die Lernende später damit tun kann.") },
          ],
          note: x(
            "Taylor, Russ-Eft and Chan, Journal of Applied Psychology (2005), a 117-study meta-analysis; the four-step cycle is editorial.",
            "Taylor, Russ-Eft e Chan, Journal of Applied Psychology (2005), meta-analizë me 117 studime; cikli me katër hapa është editorial.",
            "Taylor, Russ-Eft und Chan, Journal of Applied Psychology (2005), Metaanalyse mit 117 Studien; der Vier-Schritte-Zyklus ist redaktionell."),
          source: ["taylor-russ-eft-chan-2005"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("What 117 studies", "Çfarë mund dhe nuk mund", "Was 117 Studien"), x("can and cannot say", "të thonë 117 studime", "sagen können und was nicht")],
          lead: x(
            "A meta-analysis of behaviour-modelling training differentiates learning from later performance rather than treating them as identical.",
            "Një meta-analizë e trajnimit me modelim sjelljeje e dallon të mësuarit nga performanca e mëvonshme, në vend që t'i trajtojë si të njëjta.",
            "Eine Metaanalyse zum Verhaltensmodellierungstraining unterscheidet Lernen von späterer Leistung, statt beides gleichzusetzen."),
          blocks: [
            { type: "stat", n: "117", t: x("studies reviewed by Taylor, Russ-Eft and Chan (2005), examining behaviour-modelling training across six kinds of outcome", "studime të rishikuara nga Taylor, Russ-Eft e Chan (2005), që e shqyrtojnë trajnimin me modelim sjelljeje në gjashtë lloje rezultatesh", "Studien, ausgewertet von Taylor, Russ-Eft und Chan (2005), zum Verhaltensmodellierungstraining über sechs Arten von Ergebnissen") },
            { type: "p", text: x(
              "Effects were largest on learning measures, smaller for job behaviour and smaller still for results. This does not mean all training decays in that order; it means different outcome measures do not automatically move together. Design features such as learning points presented as rules, trainee-generated practice scenarios and support in the job environment were associated with stronger outcomes. The original studies used different tasks, populations and designs. A pooled analysis cannot say that a hotel worker needs a given number of practice nights or that a transport employee will perform to standard after a set number of demonstrations. It supports stronger design and more careful measurement, not a universal timetable.",
              "Efektet ishin më të mëdha te matjet e të mësuarit, më të vogla te sjellja në punë dhe edhe më të vogla te rezultatet. Kjo nuk do të thotë se çdo trajnim zbehet në atë radhë; do të thotë se matje të ndryshme rezultati nuk lëvizin automatikisht bashkë. Veçori projektimi si pikat e të mësuarit të paraqitura si rregulla, skenarë praktike të krijuar nga vetë të trajnuarit dhe mbështetje në mjedisin e punës lidheshin me rezultate më të forta. Studimet origjinale përdorën detyra, popullata dhe projektime të ndryshme. Një analizë e bashkuar nuk thotë dot se një punonjësi hoteli i duhet një numër i caktuar netësh praktike apo se një punonjës transporti do të performojë sipas standardit pas një numri të caktuar demonstrimesh. Mbështet projektim më të fortë dhe matje më të kujdesshme, jo një orar universal.",
              "Die Effekte waren bei Lernmaßen am größten, kleiner beim Arbeitsverhalten und noch kleiner bei Ergebnissen. Das heißt nicht, dass jedes Training in dieser Reihenfolge verfällt; es heißt, dass verschiedene Ergebnismaße sich nicht automatisch gemeinsam bewegen. Gestaltungsmerkmale wie als Regeln präsentierte Lernpunkte, von Lernenden erzeugte Übungsszenarien und Unterstützung im Arbeitsumfeld hingen mit stärkeren Ergebnissen zusammen. Die Originalstudien nutzten verschiedene Aufgaben, Populationen und Designs. Eine gepoolte Analyse kann nicht sagen, dass eine Hotelkraft eine bestimmte Zahl von Übungsnächten braucht oder ein Transportmitarbeiter nach einer festen Zahl von Vorführungen den Standard erreicht. Sie stützt bessere Gestaltung und sorgfältigere Messung, keinen universellen Zeitplan.") },
            { type: "rows", compact: true, label: x("What was measured, and what the manager must still verify", "Çfarë u mat, dhe çfarë duhet të verifikojë ende menaxheri", "Was gemessen wurde, und was die Führung noch prüfen muss"), items: [
              { h: x("Learning outcome", "Rezultati i të mësuarit", "Lernergebnis"), p: x("Can the learner explain or demonstrate the target skill?", "A mund ta shpjegojë ose demonstrojë nxënësi aftësinë e synuar?", "Kann die Lernende die Zielfähigkeit erklären oder zeigen?") },
              { h: x("Job behaviour", "Sjellja në punë", "Arbeitsverhalten"), p: x("Does the skill appear without training-room prompting?", "A shfaqet aftësia pa sugjerimet e sallës së trajnimit?", "Zeigt sich die Fähigkeit ohne Vorsagen aus dem Schulungsraum?") },
              { h: x("Business results", "Rezultatet e biznesit", "Geschäftsergebnisse"), p: x("Has service quality actually improved, without unwanted costs?", "A është përmirësuar vërtet cilësia e shërbimit, pa kosto të padëshiruara?", "Hat sich die Servicequalität wirklich verbessert, ohne unerwünschte Kosten?") },
            ] },
            { type: "callout", reading: true, text: x(
              "No training effect size here should be translated into the probability that one person is ready.",
              "Asnjë madhësi efekti trajnimi këtu nuk duhet përkthyer në probabilitetin që një person është gati.",
              "Keine Effektstärke hier darf in die Wahrscheinlichkeit übersetzt werden, dass eine Person bereit ist.") },
          ],
          note: x(
            "Taylor et al., Journal of Applied Psychology 90(4), 692–709 (2005). The verification column is editorial.",
            "Taylor et al., Journal of Applied Psychology 90(4), 692–709 (2005). Kolona e verifikimit është editoriale.",
            "Taylor et al., Journal of Applied Psychology 90(4), 692–709 (2005). Die Prüfspalte ist redaktionell."),
          source: ["taylor-russ-eft-chan-2005"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Teach the reason,", "Mëso arsyen,", "Den Grund lehren,"), x("then ask for proof", "pastaj kërko provë", "dann Beweis verlangen")],
          lead: x(
            "A demonstration earns its value when the trainee can practise, receive specific feedback and explain a safe exception.",
            "Një demonstrim e fiton vlerën kur i trajnuari mund të praktikojë, të marrë reagim konkret dhe të shpjegojë një përjashtim të sigurt.",
            "Eine Vorführung verdient ihren Wert, wenn die Lernende üben, konkrete Rückmeldung erhalten und eine sichere Ausnahme erklären kann."),
          blocks: [
            { type: "steps", items: [
              { h: x("Start with a target behaviour", "Nis me një sjellje të synuar", "Mit einem Zielverhalten beginnen"), p: x("One well-bounded, approved process rather than an entire shift checklist.", "Një proces i kufizuar mirë dhe i miratuar, jo gjithë lista e kontrollit të turnit.", "Ein klar abgegrenzter, genehmigter Prozess statt der ganzen Schichtcheckliste.") },
              { h: x("Model one normal execution", "Modelo një ekzekutim normal", "Eine normale Ausführung vorführen"), p: x("Show the finished work and narrate the important decisions, not private data.", "Trego punën e mbaruar dhe rrëfe vendimet e rëndësishme, jo të dhëna private.", "Die fertige Arbeit zeigen und die wichtigen Entscheidungen erzählen, keine privaten Daten.") },
              { h: x("Give a learner-led attempt", "Jep një përpjekje të udhëhequr nga nxënësi", "Einen Versuch unter Führung der Lernenden geben"), p: x("The trainee controls the sequence; the trainer observes without unnecessary prompting.", "I trajnuari e kontrollon radhën; trajneri vëzhgon pa sugjerime të panevojshme.", "Die Lernende steuert die Abfolge; der Trainer beobachtet ohne unnötiges Vorsagen.") },
              { h: x("Offer corrective feedback", "Jep reagim korrigjues", "Korrigierende Rückmeldung geben"), p: x("The observable gap between behaviour and standard, not a judgement about personality.", "Hendeku i vëzhgueshëm mes sjelljes dhe standardit, jo gjykim për personalitetin.", "Die beobachtbare Lücke zwischen Verhalten und Standard, kein Urteil über die Persönlichkeit.") },
              { h: x("Introduce a controlled variation", "Fut një variacion të kontrolluar", "Eine kontrollierte Variation einführen"), p: x("Practise recognising an exception and knowing when to stop or seek help.", "Ushtro njohjen e një përjashtimi dhe të diturit kur të ndalesh ose të kërkosh ndihmë.", "Üben, eine Ausnahme zu erkennen und zu wissen, wann anhalten oder Hilfe holen.") },
              { h: x("Retest later in context", "Riprovo më vonë në kontekst", "Später im Kontext erneut prüfen"), p: x("Another observed attempt, with the amount of assistance recorded.", "Një përpjekje tjetër e vëzhguar, me sasinë e ndihmës të shënuar.", "Ein weiterer beobachteter Versuch, mit dem Maß der Hilfe festgehalten.") },
            ] },
            { type: "p", text: x(
              "For an operational guide or a Front Desk Control-style reference, each step should point to the approved procedure, its owner and revision date. No side guide may contradict the official system or store private guest or payment information. Where a task cannot be practised safely, use approved simulation and hold the authorisation boundary.",
              "Për një udhëzues operacional ose një referencë në stilin e Front Desk Control, çdo hap duhet të tregojë procedurën e miratuar, pronarin dhe datën e rishikimit. Asnjë udhëzues anësor nuk mund ta kundërshtojë sistemin zyrtar apo të ruajë informacion privat mysafirësh ose pagesash. Kur një detyrë nuk praktikohet dot në mënyrë të sigurt, përdor simulim të miratuar dhe ruaje kufirin e autorizimit.",
              "Bei einem Betriebsleitfaden oder einer Referenz im Stil von Front Desk Control sollte jeder Schritt auf das genehmigte Verfahren, dessen Verantwortliche und das Revisionsdatum verweisen. Kein Nebenleitfaden darf dem offiziellen System widersprechen oder private Gäste- oder Zahlungsdaten speichern. Wo eine Aufgabe nicht sicher geübt werden kann, genehmigte Simulation nutzen und die Autorisierungsgrenze halten.") },
            { type: "callout", reading: true, text: x(
              "Show, try, correct and retest. A trainee should own the performance, not merely watch the trainer own it.",
              "Trego, provo, korrigjo dhe riprovo. I trajnuari duhet ta zotërojë performancën, jo vetëm të shohë trajnerin duke e zotëruar.",
              "Zeigen, versuchen, korrigieren, erneut prüfen. Die Lernende soll die Leistung besitzen, nicht nur zusehen, wie der Trainer sie besitzt.") },
          ],
          note: x(
            "Editorial training protocol after Taylor et al. (2005), Keith and Frese (2008) and Salas et al. (2012).",
            "Protokoll editorial trajnimi sipas Taylor et al. (2005), Keith e Frese (2008) dhe Salas et al. (2012).",
            "Redaktionelles Trainingsprotokoll nach Taylor et al. (2005), Keith und Frese (2008) und Salas et al. (2012)."),
          source: ["taylor-russ-eft-chan-2005", "keith-frese-2008", "salas-2012"],
        },
      ],
    },

    // Chapter III. The knowledge nobody wrote down
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The knowledge nobody wrote down", "Dija që askush nuk e shkroi", "Das Wissen, das niemand aufschrieb"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "how-i-built-front-desk-control",
          title: [x("The expert", "Eksperti", "Der Experte,"), x("who is the manual", "që është vetë manuali", "der das Handbuch ist")],
          lead: x(
            "A process can appear documented while the decisive judgement remains in the head of one experienced colleague.",
            "Një proces mund të duket i dokumentuar, ndërsa gjykimi vendimtar mbetet në kokën e një kolegu me përvojë.",
            "Ein Prozess kann dokumentiert wirken, während das entscheidende Urteil im Kopf einer erfahrenen Kollegin bleibt."),
          blocks: [
            { type: "flag", text: x("Constructed cross-shift scene, not a named incident", "Skenë e ndërtuar ndërmjet turneve, jo ngjarje e emërtuar", "Konstruierte Szene über Schichten hinweg, kein benannter Vorfall") },
            { type: "p", text: x(
              "An experienced team member answers a recurring question without hesitation. The person knows which version of a guide applies, why one status needs verification and which uncertainty must be passed to the next shift. A new colleague has access to the written procedure but has not learned how to interpret the edge case. The expert supplies the missing knowledge in a sentence. The work continues, and the hidden dependency remains. The problem becomes visible when the expert is absent. The document still exists, but it assumes background knowledge the beginner does not possess. A team may call this a training issue. It may be a documentation problem, a design problem or both. The correct response is not to demand that the expert remember more. It is to make the part of their judgement that can safely be documented usable by others.",
              "Një anëtar me përvojë i ekipit i përgjigjet pa hezitim një pyetjeje që përsëritet. Personi e di cili version i udhëzuesit zbatohet, pse një status ka nevojë për verifikim dhe cila pasiguri duhet t'i kalohet turnit tjetër. Një koleg i ri ka qasje te procedura e shkruar, por nuk ka mësuar si ta interpretojë rastin kufitar. Eksperti e jep dijen që mungon me një fjali. Puna vazhdon, dhe varësia e fshehur mbetet. Problemi bëhet i dukshëm kur eksperti mungon. Dokumenti ekziston ende, por supozon njohuri sfondi që fillestari nuk i ka. Një ekip mund ta quajë çështje trajnimi. Mund të jetë problem dokumentimi, problem projektimi ose të dyja. Përgjigjja e duhur nuk është t'i kërkosh ekspertit të mbajë mend më shumë. Është ta bësh të përdorshme për të tjerët atë pjesë të gjykimit të tij që mund të dokumentohet në mënyrë të sigurt.",
              "Ein erfahrenes Teammitglied beantwortet eine wiederkehrende Frage ohne Zögern. Die Person weiß, welche Version eines Leitfadens gilt, warum ein Status geprüft werden muss und welche Unsicherheit an die nächste Schicht weitergegeben gehört. Eine neue Kollegin hat Zugang zum schriftlichen Verfahren, hat aber nicht gelernt, den Grenzfall zu deuten. Die Expertin liefert das fehlende Wissen in einem Satz. Die Arbeit geht weiter, und die verborgene Abhängigkeit bleibt. Das Problem wird sichtbar, wenn die Expertin fehlt. Das Dokument existiert noch, setzt aber Hintergrundwissen voraus, das die Anfängerin nicht hat. Ein Team nennt das vielleicht ein Trainingsproblem. Es kann ein Dokumentations-, ein Gestaltungsproblem oder beides sein. Die richtige Antwort ist nicht, von der Expertin mehr Erinnerung zu verlangen. Sie ist, den sicher dokumentierbaren Teil ihres Urteils für andere nutzbar zu machen.") },
            { type: "p", text: x(
              "The author has worked with dispersed hotel SOPs, visual training notes and handovers, and has organised a personal reference tool. No specific colleague, question, shift failure or quantified dependency is documented here. The scene is an explanatory composite, not a report of a real person's conduct.",
              "Autori ka punuar me SOP hoteli të shpërndara, shënime vizuale trajnimi dhe dorëzime, dhe ka organizuar një mjet personal reference. Këtu nuk dokumentohet asnjë koleg, pyetje, dështim turni apo varësi e matur. Skena është kompozim shpjegues, jo raport për sjelljen e një personi të vërtetë.",
              "Der Autor hat mit verstreuten Hotel-SOPs, visuellen Trainingsnotizen und Übergaben gearbeitet und ein persönliches Nachschlagewerkzeug geordnet. Keine bestimmte Kollegin, Frage, Schichtpanne oder bezifferte Abhängigkeit wird hier dokumentiert. Die Szene ist eine erklärende Zusammensetzung, kein Bericht über das Verhalten einer echten Person.") },
            { type: "callout", reading: true, text: x(
              "A document that cannot be interpreted without its author is only partly a procedure.",
              "Një dokument që nuk interpretohet dot pa autorin e vet është vetëm pjesërisht procedurë.",
              "Ein Dokument, das sich ohne seinen Autor nicht deuten lässt, ist nur zum Teil ein Verfahren.") },
          ],
          note: x(
            "Editorial scenario informed by documented kinds of SOP and handover work; no confidential steps or identities are reproduced. The essay named below describes how Front Desk Control was built.",
            "Skenar editorial i mbështetur në lloje të dokumentuara pune me SOP dhe dorëzime; nuk riprodhohen hapa konfidencialë apo identitete. Eseja e emërtuar më poshtë përshkruan si u ndërtua Front Desk Control.",
            "Redaktionelles Szenario nach dokumentierten Arten von SOP- und Übergabearbeit; keine vertraulichen Schritte oder Identitäten werden wiedergegeben. Der unten genannte Essay beschreibt, wie Front Desk Control entstand."),
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Tacit knowledge", "Dija e heshtur", "Stilles Wissen"), x("must meet a standard", "duhet të takojë një standard", "muss einem Standard begegnen")],
          lead: x(
            "A working team holds more knowledge than its forms. The goal is to capture usable judgement without pretending everything can be written down.",
            "Një ekip në punë mban më shumë dije se formularët e vet. Qëllimi është të kapet gjykimi i përdorshëm, pa pretenduar se gjithçka mund të shkruhet.",
            "Ein arbeitendes Team hält mehr Wissen als seine Formulare. Das Ziel ist, nutzbares Urteil einzufangen, ohne vorzugeben, alles ließe sich aufschreiben."),
          blocks: [
            { type: "p", text: x(
              "A standard operating procedure defines agreed action. Workers develop additional practical knowledge by recognising familiar patterns, anticipating recurring confusion and seeing which details another person will need. Some of this knowledge is useful and legitimate. Some is merely an unapproved shortcut or an old procedure that no longer matches the current system. A manager must not preserve both indiscriminately. The training design should ask experienced workers which evidence changes a decision. The answer is checked against the approved standard, not copied directly into a public guide. Examples can show a routine case and a boundary case. Revision records identify the owner and version. New staff need a route to clarify uncertainty, rather than relying on the personality or availability of one expert.",
              "Një procedurë standarde operative përkufizon veprimin e rënë dakord. Punonjësit zhvillojnë dije praktike shtesë duke njohur modele të njohura, duke parashikuar ngatërresa të përsëritura dhe duke parë cilat detaje do t'i duhen një personi tjetër. Një pjesë e kësaj dijeje është e dobishme dhe legjitime. Një pjesë është thjesht shkurtore e pamiratuar ose procedurë e vjetër që nuk përputhet më me sistemin aktual. Menaxheri nuk duhet t'i ruajë të dyja pa dallim. Projektimi i trajnimit duhet t'u kërkojë punonjësve me përvojë cila provë e ndryshon një vendim. Përgjigjja kontrollohet kundrejt standardit të miratuar, jo kopjohet drejtpërdrejt në një udhëzues publik. Shembujt mund të tregojnë një rast rutinë dhe një rast kufitar. Regjistrat e rishikimit identifikojnë pronarin dhe versionin. Stafi i ri ka nevojë për një rrugë për të sqaruar pasigurinë, jo të mbështetet te personaliteti apo disponueshmëria e një eksperti.",
              "Eine Standardarbeitsanweisung definiert vereinbartes Handeln. Beschäftigte entwickeln zusätzliches praktisches Wissen, indem sie vertraute Muster erkennen, wiederkehrende Verwirrung vorhersehen und sehen, welche Details eine andere Person braucht. Ein Teil dieses Wissens ist nützlich und legitim. Ein Teil ist nur eine ungenehmigte Abkürzung oder ein altes Verfahren, das nicht mehr zum aktuellen System passt. Eine Führungskraft darf nicht beides wahllos bewahren. Das Trainingsdesign sollte erfahrene Beschäftigte fragen, welcher Beleg eine Entscheidung ändert. Die Antwort wird am genehmigten Standard geprüft, nicht direkt in einen öffentlichen Leitfaden kopiert. Beispiele können einen Routinefall und einen Grenzfall zeigen. Revisionsvermerke nennen Verantwortliche und Version. Neues Personal braucht einen Weg, Unsicherheit zu klären, statt auf Persönlichkeit oder Verfügbarkeit einer Expertin angewiesen zu sein.") },
            { type: "cards", cols: 3, items: [
              { h: x("Extract", "Nxirr", "Herausziehen"), p: x("What distinguishes the normal case from an exception?", "Çfarë e dallon rastin normal nga një përjashtim?", "Was unterscheidet den Normalfall von einer Ausnahme?") },
              { h: x("Validate", "Vërteto", "Prüfen"), p: x("Does the explanation match approved current practice?", "A përputhet shpjegimi me praktikën aktuale të miratuar?", "Passt die Erklärung zur genehmigten aktuellen Praxis?") },
              { h: x("Transfer", "Transfero", "Übertragen"), p: x("Can a new colleague use it with the allowed support?", "A mund ta përdorë një koleg i ri me mbështetjen e lejuar?", "Kann eine neue Kollegin es mit der erlaubten Unterstützung nutzen?") },
            ] },
            { type: "p", text: x(
              "The limits matter as much as the benefits. Some knowledge is restricted for privacy, safety or compliance and stays in controlled systems. Public educational material may explain the managerial principle while omitting guest data, credentials and operational security details. An internal guide is never a replacement for authorisation or supervision.",
              "Kufijtë kanë po aq rëndësi sa dobitë. Një pjesë e dijes është e kufizuar për privatësi, siguri ose përputhshmëri dhe mbetet në sisteme të kontrolluara. Materiali edukativ publik mund ta shpjegojë parimin menaxherial duke lënë jashtë të dhënat e mysafirëve, kredencialet dhe detajet e sigurisë operacionale. Një udhëzues i brendshëm nuk e zëvendëson kurrë autorizimin apo mbikëqyrjen.",
              "Die Grenzen zählen ebenso wie der Nutzen. Manches Wissen ist aus Gründen der Vertraulichkeit, Sicherheit oder Compliance beschränkt und bleibt in kontrollierten Systemen. Öffentliches Lehrmaterial kann das Führungsprinzip erklären und dabei Gästedaten, Zugangsdaten und betriebliche Sicherheitsdetails weglassen. Ein interner Leitfaden ersetzt nie Autorisierung oder Aufsicht.") },
            { type: "callout", reading: true, text: x(
              "Write down what can be shared, verify what must be approved and preserve the boundary between them.",
              "Shkruaj çfarë mund të ndahet, verifiko çfarë duhet miratuar dhe ruaje kufirin mes tyre.",
              "Aufschreiben, was geteilt werden darf, prüfen, was genehmigt werden muss, und die Grenze dazwischen wahren.") },
          ],
          note: x(
            "Editorial synthesis using the transfer factors described by Baldwin and Ford (1988), Burke and Hutchins (2007) and Grossman and Salas (2011).",
            "Sintezë editoriale me faktorët e transferimit të përshkruar nga Baldwin e Ford (1988), Burke e Hutchins (2007) dhe Grossman e Salas (2011).",
            "Redaktionelle Synthese mit den Transferfaktoren nach Baldwin und Ford (1988), Burke und Hutchins (2007) und Grossman und Salas (2011)."),
          source: ["baldwin-ford-1988", "burke-hutchins-2007", "grossman-salas-2011"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("Why training", "Pse trajnimi", "Warum Training"), x("fails to travel", "nuk udhëton", "nicht reist")],
          lead: x(
            "Transfer research repeatedly identifies more than the quality of the course itself.",
            "Kërkimi i transferimit identifikon vazhdimisht më shumë se cilësinë e vetë kursit.",
            "Die Transferforschung findet immer wieder mehr als die Qualität des Kurses selbst."),
          blocks: [
            { type: "p", text: x(
              "Baldwin and Ford (1988) grouped the antecedents of transfer around trainee characteristics, training design and the work environment. Grossman and Salas (2011) later reviewed variables with more consistent relationships to transfer, including motivation, utility, behavioural modelling, realistic practice, supervisor support, opportunity to perform and follow-up. Burke and Hutchins (2007) organised the literature along similar lines while discussing limits in the evidence base. Blume and colleagues (2010) meta-analysed 89 empirical studies and reported positive associations between transfer and predictors such as motivation and a supportive work environment. That does not let a manager calculate an individual's readiness from a questionnaire score: the reviewed studies varied in how transfer was measured.",
              "Baldwin dhe Ford (1988) i grupuan paraardhësit e transferimit rreth karakteristikave të të trajnuarit, projektimit të trajnimit dhe mjedisit të punës. Grossman dhe Salas (2011) rishikuan më vonë variablat me lidhje më të qëndrueshme me transferimin, përfshirë motivimin, dobinë, modelimin e sjelljes, praktikën realiste, mbështetjen e mbikëqyrësit, mundësinë për të performuar dhe ndjekjen. Burke dhe Hutchins (2007) e organizuan literaturën në vija të ngjashme duke diskutuar kufijtë e bazës së provave. Blume dhe kolegët (2010) meta-analizuan 89 studime empirike dhe raportuan lidhje pozitive mes transferimit dhe parashikuesve si motivimi dhe një mjedis mbështetës pune. Kjo nuk e lejon menaxherin ta llogarisë gatishmërinë e një individi nga një pikë pyetësori: studimet e rishikuara ndryshonin në mënyrën si u mat transferimi.",
              "Baldwin und Ford (1988) ordneten die Vorläufer des Transfers um Merkmale der Lernenden, Trainingsdesign und Arbeitsumfeld. Grossman und Salas (2011) sichteten später Variablen mit beständigeren Beziehungen zum Transfer, darunter Motivation, Nutzen, Verhaltensmodellierung, realistische Übung, Unterstützung durch Vorgesetzte, Gelegenheit zur Anwendung und Nachverfolgung. Burke und Hutchins (2007) ordneten die Literatur ähnlich und besprachen Grenzen der Beleglage. Blume und Kollegen (2010) metaanalysierten 89 empirische Studien und berichteten positive Zusammenhänge zwischen Transfer und Prädiktoren wie Motivation und einem unterstützenden Arbeitsumfeld. Das erlaubt keiner Führungskraft, die Bereitschaft einer Person aus einem Fragebogenwert zu berechnen: Die Studien maßen Transfer unterschiedlich.") },
            { type: "rows", compact: true, label: x("Transfer barrier, and the practical question", "Pengesa e transferimit, dhe pyetja praktike", "Transferhürde, und die praktische Frage"), items: [
              { h: x("No opportunity to practise", "Pa mundësi për të praktikuar", "Keine Gelegenheit zu üben"), p: x("When will this competence actually be used?", "Kur do të përdoret vërtet kjo kompetencë?", "Wann wird diese Kompetenz tatsächlich gebraucht?") },
              { h: x("No access to support", "Pa qasje te mbështetja", "Kein Zugang zu Unterstützung"), p: x("Who can clarify an exception on a live shift?", "Kush mund ta sqarojë një përjashtim në një turn të vërtetë?", "Wer kann in einer laufenden Schicht eine Ausnahme klären?") },
              { h: x("Outdated guidance", "Udhëzim i vjetruar", "Veraltete Anleitung"), p: x("Who owns the current approved version?", "Kush e zotëron versionin aktual të miratuar?", "Wer verantwortet die aktuelle genehmigte Version?") },
            ] },
            { type: "callout", reading: true, text: x(
              "Even an excellent training module cannot transfer a behaviour into a workplace that never permits its use.",
              "Edhe një modul i shkëlqyer trajnimi nuk e transferon dot një sjellje në një vend pune që nuk e lejon kurrë përdorimin e saj.",
              "Selbst ein ausgezeichnetes Trainingsmodul kann ein Verhalten nicht in einen Arbeitsplatz übertragen, der seine Anwendung nie zulässt.") },
          ],
          note: x(
            "Baldwin and Ford (1988); Burke and Hutchins (2007); Blume et al. (2010); Grossman and Salas (2011). For a reference like Front Desk Control, the research is a reason to test whether users can find and apply a procedure, not permission to claim that an application makes people competent.",
            "Baldwin e Ford (1988); Burke e Hutchins (2007); Blume et al. (2010); Grossman e Salas (2011). Për një referencë si Front Desk Control, kërkimi është arsye për të provuar nëse përdoruesit mund ta gjejnë dhe zbatojnë një procedurë, jo leje për të pretenduar se një aplikacion i bën njerëzit kompetentë.",
            "Baldwin und Ford (1988); Burke und Hutchins (2007); Blume et al. (2010); Grossman und Salas (2011). Für eine Referenz wie Front Desk Control ist die Forschung ein Grund zu prüfen, ob Nutzer ein Verfahren finden und anwenden können, keine Erlaubnis zu behaupten, eine Anwendung mache Menschen kompetent."),
          source: ["baldwin-ford-1988", "burke-hutchins-2007", "blume-2010", "grossman-salas-2011"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Turn experience", "Ktheje përvojën", "Erfahrung in übertragbare"), x("into transferable guidance", "në udhëzim të transferueshëm", "Anleitung verwandeln")],
          lead: x(
            "A method for converting expert context into approved, maintainable learning materials.",
            "Një metodë për ta kthyer kontekstin e ekspertit në materiale mësimore të miratuara dhe të mirëmbajtshme.",
            "Eine Methode, Expertenkontext in genehmigtes, pflegbares Lernmaterial zu verwandeln."),
          blocks: [
            { type: "steps", items: [
              { h: x("Locate a repeated question", "Gjej një pyetje që përsëritet", "Eine wiederkehrende Frage finden"), p: x("Which part of a process do new colleagues repeatedly need explained twice?", "Cila pjesë e procesit u duhet kolegëve të rinj vazhdimisht e shpjeguar dy herë?", "Welcher Teil eines Prozesses muss neuen Kolleginnen immer wieder zweimal erklärt werden?") },
              { h: x("Ask the expert for observable cues", "Kërkoji ekspertit shenja të vëzhgueshme", "Die Expertin nach beobachtbaren Hinweisen fragen"), p: x("What would you look for before deciding the next approved step?", "Çfarë do të kërkoje para se të vendosësh hapin tjetër të miratuar?", "Worauf würden Sie achten, bevor Sie den nächsten genehmigten Schritt entscheiden?") },
              { h: x("Compare against the owner-approved SOP", "Krahaso me SOP-in e miratuar nga pronari", "Mit der freigegebenen SOP vergleichen"), p: x("Reject informal workarounds that contradict a controlled requirement.", "Refuzo zgjidhjet joformale që kundërshtojnë një kërkesë të kontrolluar.", "Informelle Umwege ablehnen, die einer kontrollierten Anforderung widersprechen.") },
              { h: x("Write a minimal case example", "Shkruaj një shembull minimal rasti", "Ein minimales Fallbeispiel schreiben"), p: x("Separate the normal state, the exception and the authorised next decision.", "Ndaje gjendjen normale, përjashtimin dhe vendimin e radhës të autorizuar.", "Normalzustand, Ausnahme und autorisierte nächste Entscheidung trennen.") },
              { h: x("Test with a newcomer", "Provo me një të ri", "Mit einer Neuen testen"), p: x("Can the learner explain the case without the expert translating every line?", "A mund ta shpjegojë nxënësi rastin pa i përkthyer eksperti çdo rresht?", "Kann die Lernende den Fall erklären, ohne dass die Expertin jede Zeile übersetzt?") },
              { h: x("Assign revision responsibility", "Cakto përgjegjësinë e rishikimit", "Revisionsverantwortung zuweisen"), p: x("Record the source, version, approver and next review trigger.", "Shëno burimin, versionin, miratuesin dhe shkasin e rishikimit të radhës.", "Quelle, Version, Freigebende und Auslöser der nächsten Prüfung festhalten.") },
            ] },
            { type: "p", text: x(
              "The tool should preserve provenance: an old screenshot of a superseded interface can be more dangerous than none if it convinces the beginner that an outdated process is current. Use privacy-safe, anonymised images; never place operational secrets or live records in a public repository. Ask too what cannot be codified reliably: judgement develops from practice under supervision, and a checklist supports but cannot replace that process.",
              "Mjeti duhet ta ruajë prejardhjen: një pamje e vjetër e një ndërfaqeje të zëvendësuar mund të jetë më e rrezikshme se asnjë, nëse e bind fillestarin se një proces i vjetruar është aktual. Përdor imazhe anonime dhe të sigurta për privatësinë; mos vendos kurrë sekrete operacionale apo regjistra të gjallë në një depo publike. Pyet edhe çfarë nuk kodifikohet dot me besueshmëri: gjykimi zhvillohet nga praktika nën mbikëqyrje, dhe një listë kontrolli e mbështet, por nuk e zëvendëson atë proces.",
              "Das Werkzeug sollte die Herkunft wahren: Ein altes Bildschirmfoto einer abgelösten Oberfläche kann gefährlicher sein als keines, wenn es Anfängern einredet, ein veralteter Prozess sei aktuell. Anonymisierte, datenschutzsichere Bilder verwenden; nie betriebliche Geheimnisse oder Live-Aufzeichnungen in ein öffentliches Ablagesystem legen. Fragen Sie auch, was sich nicht verlässlich kodifizieren lässt: Urteil entsteht aus Übung unter Aufsicht, und eine Checkliste stützt diesen Prozess, ersetzt ihn aber nicht.") },
            { type: "callout", reading: true, text: x(
              "Make knowledge accessible without turning an informal note into unapproved authority.",
              "Bëje dijen të arritshme pa e kthyer një shënim joformal në autoritet të pamiratuar.",
              "Wissen zugänglich machen, ohne eine informelle Notiz zu ungenehmigter Autorität zu machen.") },
          ],
          note: x(
            "Original editorial guidance; research context from Grossman and Salas (2011) and Salas et al. (2012).",
            "Udhëzim editorial origjinal; konteksti kërkimor nga Grossman e Salas (2011) dhe Salas et al. (2012).",
            "Eigene redaktionelle Anleitung; Forschungskontext aus Grossman und Salas (2011) und Salas et al. (2012)."),
          source: ["grossman-salas-2011", "salas-2012"],
        },
      ],
    },

    // Chapter IV. Competence under pressure
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("Competence under pressure", "Kompetenca nën presion", "Kompetenz unter Druck"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "high-volume-days",
          title: [x("The standard", "Standardi", "Der Standard"), x("on a busy day", "në një ditë të ngarkuar", "an einem vollen Tag")],
          lead: x(
            "A person may understand a standard in quiet training and struggle to apply it when interruptions and volume compete for attention.",
            "Një person mund ta kuptojë një standard në trajnimin e qetë dhe të vuajë ta zbatojë kur ndërprerjet dhe volumi konkurrojnë për vëmendje.",
            "Jemand kann einen Standard im ruhigen Training verstehen und ihn kaum anwenden, wenn Unterbrechungen und Volumen um Aufmerksamkeit konkurrieren."),
          blocks: [
            { type: "flag", text: x("Constructed peak-volume scene, not a documented case", "Skenë e ndërtuar e volumit të lartë, jo rast i dokumentuar", "Konstruierte Spitzenlast-Szene, kein dokumentierter Fall") },
            { type: "p", text: x(
              "It is a high-volume operating period. A new colleague knows the approved sequence and has completed the training activities. The team is moving quickly. Several tasks demand attention at once, and a routine exception appears. The training environment allowed time to ask the trainer what the exception meant; the real shift demands a decision before the next step can proceed. The temptation is to treat hesitation as proof that the worker is weak. Another temptation is to excuse any skipped standard because the operation is under pressure. Neither is enough. The more useful question is whether the training included task variation, whether the workload exceeded the safe operating design, and whether the employee had access to timely help. A capable person can be placed in a process that makes good performance unnecessarily difficult.",
              "Është periudhë operacionale me volum të lartë. Një koleg i ri e di radhën e miratuar dhe i ka përfunduar veprimtaritë e trajnimit. Ekipi po lëviz shpejt. Disa detyra kërkojnë vëmendje njëherësh, dhe shfaqet një përjashtim rutinë. Mjedisi i trajnimit linte kohë për ta pyetur trajnerin çfarë do të thoshte përjashtimi; turni i vërtetë kërkon një vendim para se hapi tjetër të vazhdojë. Tundimi është ta trajtosh hezitimin si provë se punonjësi është i dobët. Një tundim tjetër është ta justifikosh çdo standard të anashkaluar, sepse operacioni është nën presion. Asnjëri nuk mjafton. Pyetja më e dobishme është nëse trajnimi përfshinte variacion detyrash, nëse ngarkesa e punës e kaloi projektimin e sigurt të operimit dhe nëse punonjësi kishte qasje te ndihma në kohë. Një person i aftë mund të vendoset në një proces që e bën performancën e mirë pa nevojë të vështirë.",
              "Es ist eine Betriebsphase mit hohem Volumen. Eine neue Kollegin kennt die genehmigte Abfolge und hat die Trainingsaktivitäten abgeschlossen. Das Team bewegt sich schnell. Mehrere Aufgaben verlangen zugleich Aufmerksamkeit, und eine gewöhnliche Ausnahme taucht auf. Das Trainingsumfeld ließ Zeit, den Trainer zu fragen, was die Ausnahme bedeutet; die echte Schicht verlangt eine Entscheidung, bevor der nächste Schritt weitergehen kann. Die Versuchung ist, Zögern als Beweis für Schwäche zu lesen. Eine andere Versuchung ist, jeden übersprungenen Standard mit dem Druck zu entschuldigen. Keines reicht. Die nützlichere Frage ist, ob das Training Aufgabenvariation enthielt, ob die Arbeitslast das sichere Betriebsdesign überstieg und ob die Beschäftigte rechtzeitig Hilfe bekam. Eine fähige Person kann in einen Prozess gestellt werden, der gute Leistung unnötig schwer macht.") },
            { type: "p", text: x(
              "The author has documented high-volume periods, short-notice driver requirements and ramp-up challenges in last-mile operations. The particular trainee, workload sequence and result are invented for illustration. No operator performance statistic or incident is attributed to a real employer.",
              "Autori ka dokumentuar periudha me volum të lartë, kërkesa shoferësh me njoftim të shkurtër dhe sfida fillimi në operacionet e miljes së fundit. I trajnuari, radha e ngarkesës dhe rezultati janë të shpikura për ilustrim. Asnjë statistikë performance apo incident nuk i atribuohet një punëdhënësi të vërtetë.",
              "Der Autor hat Phasen hohen Volumens, kurzfristigen Fahrerbedarf und Anlaufprobleme in Last-Mile-Betrieben dokumentiert. Die konkrete Lernende, die Lastabfolge und das Ergebnis sind zur Illustration erfunden. Keine Leistungsstatistik und kein Vorfall wird einem echten Arbeitgeber zugeschrieben.") },
            { type: "callout", reading: true, text: x(
              "Training should prepare the person for expected variation, while the operation remains responsible for conditions in which the standard can be followed.",
              "Trajnimi duhet ta përgatisë personin për variacionin e pritur, ndërsa operacioni mbetet përgjegjës për kushtet në të cilat standardi mund të ndiqet.",
              "Training soll die Person auf erwartbare Variation vorbereiten, während der Betrieb für Bedingungen verantwortlich bleibt, unter denen der Standard einhaltbar ist.") },
          ],
          note: x(
            "Constructed illustration based on documented operational categories, not an account of a specific trainee failing. The essay named below describes the standard under pressure on high-volume days.",
            "Ilustrim i ndërtuar mbi kategori të dokumentuara operacionale, jo rrëfim për dështimin e një të trajnuari të caktuar. Eseja e emërtuar më poshtë e përshkruan standardin nën presion në ditët me volum të lartë.",
            "Konstruierte Illustration auf Basis dokumentierter Betriebskategorien, kein Bericht über das Scheitern einer bestimmten Lernenden. Der unten genannte Essay beschreibt den Standard unter Druck an Tagen mit hohem Volumen."),
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Transfer under", "Transferimi në", "Transfer unter"), x("changing conditions", "kushte që ndryshojnë", "wechselnden Bedingungen")],
          lead: x(
            "The real test of competence includes deciding which action not to take.",
            "Prova e vërtetë e kompetencës përfshin vendimin se cilin veprim të mos e marrësh.",
            "Der echte Kompetenztest schließt die Entscheidung ein, welche Handlung man nicht ausführt."),
          blocks: [
            { type: "p", text: x(
              "A procedure rehearsed only in its ideal sequence tests reproduction. A real role may require adaptive transfer: recognising when the environment has changed enough that the approved exception pathway applies. Performance under pressure therefore has at least three dimensions: executing routine steps accurately, recognising the boundaries of the routine, and using the right support when the boundary is crossed. Training conditions and operating conditions should be related, but not identical in risk. A new worker can learn through controlled variations and realistic simulations rather than unsupervised exposure to hazards. The manager also has to manage work design: more practice will not compensate for impossible staffing, conflicting instructions, unavailable equipment or missing authority to decide.",
              "Një procedurë e ushtruar vetëm në radhën e saj ideale provon riprodhimin. Një rol i vërtetë mund të kërkojë transferim adaptiv: të njohësh kur mjedisi ka ndryshuar aq sa zbatohet rruga e miratuar e përjashtimit. Performanca nën presion ka pra të paktën tri dimensione: ekzekutimin e saktë të hapave rutinë, njohjen e kufijve të rutinës dhe përdorimin e mbështetjes së duhur kur kufiri kalohet. Kushtet e trajnimit dhe kushtet e operimit duhet të lidhen, por jo të jenë të njëjta në rrezik. Një punonjës i ri mund të mësojë përmes variacioneve të kontrolluara dhe simulimeve realiste, jo përmes ekspozimit të pambikëqyrur ndaj rreziqeve. Menaxheri duhet të menaxhojë edhe projektimin e punës: më shumë praktikë nuk e kompenson stafin e pamundur, udhëzimet kundërthënëse, pajisjet e padisponueshme apo mungesën e autoritetit për të vendosur.",
              "Ein nur in seiner idealen Abfolge geübtes Verfahren prüft die Wiedergabe. Eine echte Rolle kann adaptiven Transfer verlangen: zu erkennen, wann sich das Umfeld so weit geändert hat, dass der genehmigte Ausnahmeweg gilt. Leistung unter Druck hat daher mindestens drei Dimensionen: Routineschritte genau ausführen, die Grenzen der Routine erkennen und die richtige Unterstützung nutzen, wenn die Grenze überschritten wird. Trainings- und Betriebsbedingungen sollten verwandt, aber im Risiko nicht identisch sein. Eine neue Arbeitskraft kann durch kontrollierte Variationen und realistische Simulationen lernen statt durch unbeaufsichtigten Kontakt mit Gefahren. Die Führung muss auch die Arbeitsgestaltung führen: Mehr Übung gleicht unmögliche Besetzung, widersprüchliche Anweisungen, fehlende Ausrüstung oder fehlende Entscheidungsbefugnis nicht aus.") },
            { type: "cards", cols: 3, items: [
              { h: x("Execute", "Ekzekuto", "Ausführen"), p: x("Apply the normal process without an extra prompt.", "Zbatoje procesin normal pa sugjerim shtesë.", "Den normalen Prozess ohne zusätzlichen Hinweis anwenden.") },
              { h: x("Recognise", "Njih", "Erkennen"), p: x("Identify exceptions, uncertainty and stop criteria.", "Identifiko përjashtimet, pasigurinë dhe kriteret e ndalimit.", "Ausnahmen, Unsicherheit und Stoppkriterien erkennen.") },
              { h: x("Escalate", "Eskalo", "Eskalieren"), p: x("Use the correct role and channel before risk grows.", "Përdor rolin dhe kanalin e duhur para se rreziku të rritet.", "Die richtige Rolle und den richtigen Kanal nutzen, bevor das Risiko wächst.") },
            ] },
            { type: "p", text: x(
              "This matters in cold-chain handling, transport safety and hotel operations. The point is not to reveal employer-specific controls; it is that a trainee who safely stops an unauthorised action may have shown better judgement than one who completes the task quickly by guessing. A balanced assessment never rewards speed at the expense of compliance or service quality.",
              "Kjo ka rëndësi në trajtimin e zinxhirit të ftohtë, sigurinë e transportit dhe operacionet e hotelit. Qëllimi nuk është të zbulohen kontrolle të veçanta të punëdhënësit; është se një i trajnuar që e ndal në mënyrë të sigurt një veprim të paautorizuar mund të ketë treguar gjykim më të mirë se ai që e përfundon detyrën shpejt duke hamendësuar. Një vlerësim i balancuar nuk e shpërblen kurrë shpejtësinë në kurriz të përputhshmërisë apo cilësisë së shërbimit.",
              "Das zählt in der Kühlkette, in der Transportsicherheit und im Hotelbetrieb. Es geht nicht darum, arbeitgeberspezifische Kontrollen offenzulegen; es geht darum, dass eine Lernende, die eine nicht autorisierte Handlung sicher stoppt, womöglich besseres Urteil gezeigt hat als eine, die die Aufgabe schnell durch Raten erledigt. Eine ausgewogene Bewertung belohnt nie Tempo auf Kosten von Compliance oder Servicequalität.") },
            { type: "callout", reading: true, text: x(
              "Competence includes knowing when to pause, not only how to move quickly.",
              "Kompetenca përfshin të diturit kur të ndalesh, jo vetëm si të lëvizësh shpejt.",
              "Kompetenz schließt ein zu wissen, wann man innehält, nicht nur, wie man sich schnell bewegt.") },
          ],
          note: x(
            "Research lens: Keith and Frese (2008), Grossman and Salas (2011); the task-risk application is editorial.",
            "Lentja kërkimore: Keith e Frese (2008), Grossman e Salas (2011); zbatimi sipas rrezikut të detyrës është editorial.",
            "Forschungslinse: Keith und Frese (2008), Grossman und Salas (2011); die Anwendung nach Aufgabenrisiko ist redaktionell."),
          source: ["keith-frese-2008", "grossman-salas-2011"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("What learning", "Çfarë mund të thotë", "Was Lernen aus Fehlern"), x("from errors can mean", "të mësuarit nga gabimet", "bedeuten kann")],
          lead: x(
            "Error-management training has research support, but it must not be confused with permission for uncontrolled errors in live operations.",
            "Trajnimi për menaxhimin e gabimeve ka mbështetje kërkimore, por nuk duhet ngatërruar me leje për gabime të pakontrolluara në operacione të vërteta.",
            "Fehlermanagementtraining hat Forschungsrückhalt, darf aber nicht mit einer Erlaubnis für unkontrollierte Fehler im laufenden Betrieb verwechselt werden."),
          blocks: [
            { type: "stat", n: "24", t: x("studies, with 2,183 participants, in Keith and Frese's 2008 meta-analysis of error-management training", "studime, me 2.183 pjesëmarrës, në meta-analizën e Keith e Frese të vitit 2008 për trajnimin e menaxhimit të gabimeve", "Studien mit 2.183 Teilnehmenden in Keith und Freses Metaanalyse von 2008 zum Fehlermanagementtraining") },
            { type: "hbars", max: 0.8,
              label: x("Standardised mean effects reported in the meta-analysis, scaled to d = 0.80", "Efektet mesatare të standardizuara të raportuara në meta-analizë, të shkallëzuara në d = 0,80", "Standardisierte mittlere Effekte der Metaanalyse, skaliert auf d = 0,80"),
              items: [
                { k: x("Overall mean", "Mesatarja e përgjithshme", "Gesamtmittel"), v: 0.44, n: "d = 0.44" },
                { k: x("Post-training transfer", "Transferimi pas trajnimit", "Transfer nach dem Training"), v: 0.56, n: "d = 0.56" },
                { k: x("Adaptive transfer", "Transferimi adaptiv", "Adaptiver Transfer"), v: 0.8, n: "d = 0.80", alert: true },
              ] },
            { type: "p", text: x(
              "These estimates refer to different outcome subsets and comparisons; they are not percentages, success rates or a comparison of three programmes. The researchers found a positive mean effect across the included studies and larger effects for post-training and adaptive-transfer outcomes in moderator analyses. The evidence concerns active exploration and explicit learning from mistakes in designed training activities. In a hotel or loading operation, the responsible translation is supervised practice with realistic but safe variations. Hazardous live procedures cannot be used as an informal experiment, and the meta-analysis guarantees neither improvement in a particular shift nor an equal benefit for every novice.",
              "Këto vlerësime u referohen nëngrupeve dhe krahasimeve të ndryshme rezultatesh; nuk janë përqindje, norma suksesi apo krahasim i tre programeve. Kërkuesit gjetën një efekt mesatar pozitiv në studimet e përfshira dhe efekte më të mëdha për rezultatet pas trajnimit dhe të transferimit adaptiv në analizat e moderatorëve. Prova ka të bëjë me eksplorimin aktiv dhe të mësuarit e shprehur nga gabimet në veprimtari trajnimi të projektuara. Në një hotel ose operacion ngarkimi, përkthimi i përgjegjshëm është praktikë e mbikëqyrur me variacione realiste, por të sigurta. Procedurat e rrezikshme të vërteta nuk përdoren dot si eksperiment joformal, dhe meta-analiza nuk garanton as përmirësim në një turn të caktuar, as dobi të barabartë për çdo fillestar.",
              "Diese Schätzungen beziehen sich auf verschiedene Ergebnisuntergruppen und Vergleiche; sie sind keine Prozentsätze, Erfolgsquoten oder ein Vergleich dreier Programme. Die Forschenden fanden einen positiven mittleren Effekt über die Studien und größere Effekte für Transfer nach dem Training und adaptiven Transfer in Moderatoranalysen. Die Belege betreffen aktives Erkunden und ausdrückliches Lernen aus Fehlern in gestalteten Trainingsaktivitäten. Im Hotel oder Ladebetrieb ist die verantwortliche Übersetzung begleitete Übung mit realistischen, aber sicheren Variationen. Gefährliche Live-Verfahren taugen nicht als informelles Experiment, und die Metaanalyse garantiert weder Verbesserung in einer bestimmten Schicht noch gleichen Nutzen für jede Anfängerin.") },
            { type: "callout", reading: true, text: x(
              "An error can be a teaching signal in a controlled exercise. In live operations, safety and authorisation still govern action.",
              "Një gabim mund të jetë sinjal mësimi në një ushtrim të kontrolluar. Në operacione të vërteta, siguria dhe autorizimi e qeverisin ende veprimin.",
              "Ein Fehler kann in einer kontrollierten Übung ein Lehrsignal sein. Im laufenden Betrieb bestimmen weiterhin Sicherheit und Autorisierung das Handeln.") },
          ],
          note: x(
            "Keith and Frese, Journal of Applied Psychology 93(1), 59–69 (2008). The three values are pooled estimates from the paper, drawn to scale.",
            "Keith e Frese, Journal of Applied Psychology 93(1), 59–69 (2008). Tri vlerat janë vlerësime të bashkuara nga punimi, të vizatuara në shkallë.",
            "Keith und Frese, Journal of Applied Psychology 93(1), 59–69 (2008). Die drei Werte sind gepoolte Schätzungen aus dem Aufsatz, maßstäblich gezeichnet."),
          source: ["keith-frese-2008"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Rehearse variation", "Ushtro variacionin", "Variation üben,"), x("without adding risk", "pa shtuar rrezik", "ohne Risiko hinzuzufügen")],
          lead: x(
            "A progressive practice ladder that challenges judgement in conditions approved for training.",
            "Një shkallë praktike progresive që e sfidon gjykimin në kushte të miratuara për trajnim.",
            "Eine aufsteigende Übungsleiter, die das Urteil unter für Training genehmigten Bedingungen fordert."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the routine task", "Përkufizo detyrën rutinë", "Die Routineaufgabe definieren"), p: x("Its observable acceptance criteria and its safety boundaries.", "Kriteret e saj të vëzhgueshme të pranimit dhe kufijtë e sigurisë.", "Ihre beobachtbaren Abnahmekriterien und ihre Sicherheitsgrenzen.") },
              { h: x("Run a normal rehearsal", "Bëj një ushtrim normal", "Eine normale Probe durchführen"), p: x("Completion with minimal prompting in a permitted training environment.", "Përfundim me sugjerim minimal në një mjedis trajnimi të lejuar.", "Abschluss mit minimalem Vorsagen in einem erlaubten Trainingsumfeld.") },
              { h: x("Change one condition", "Ndrysho një kusht", "Eine Bedingung ändern"), p: x("A simulated exception, interruption or ambiguous status.", "Një përjashtim i simuluar, një ndërprerje ose një status i paqartë.", "Eine simulierte Ausnahme, Unterbrechung oder ein mehrdeutiger Status.") },
              { h: x("Ask for the reason", "Kërko arsyen", "Nach dem Grund fragen"), p: x("What changed, what does the standard require and what remains unknown?", "Çfarë ndryshoi, çfarë kërkon standardi dhe çfarë mbetet e panjohur?", "Was änderte sich, was verlangt der Standard und was bleibt unbekannt?") },
              { h: x("Practise the safe boundary", "Ushtro kufirin e sigurt", "Die sichere Grenze üben"), p: x("Stopping, seeking help or escalating instead of inventing a shortcut.", "Të ndalurit, kërkimi i ndihmës ose eskalimi, në vend të shpikjes së një shkurtoreje.", "Anhalten, Hilfe holen oder eskalieren statt eine Abkürzung zu erfinden.") },
              { h: x("Review both person and system", "Rishiko personin dhe sistemin", "Person und System prüfen"), p: x("Was the miss a learning gap, an unclear instruction or a condition the operating design must repair?", "A ishte mangësia hendek mësimi, udhëzim i paqartë apo kusht që projektimi i operimit duhet ta ndreqë?", "War der Fehler eine Lernlücke, eine unklare Anweisung oder eine Bedingung, die das Betriebsdesign beheben muss?") },
            ] },
            { type: "p", text: x(
              "Document the practice task and the kind of assistance provided. Do not score a simulated scenario as a measured workplace outcome. Repeated rehearsals serve learning; readiness for an actual role still requires employer-approved checks. Where a person fails to demonstrate a high-risk task, continued supervision is a control, not a punishment.",
              "Dokumento detyrën e praktikës dhe llojin e ndihmës së dhënë. Mos e vlerëso një skenar të simuluar si rezultat të matur të vendit të punës. Ushtrimet e përsëritura i shërbejnë të mësuarit; gatishmëria për një rol të vërtetë kërkon prapë kontrolle të miratuara nga punëdhënësi. Kur një person nuk e demonstron dot një detyrë me rrezik të lartë, mbikëqyrja e vazhduar është kontroll, jo ndëshkim.",
              "Die Übungsaufgabe und die Art der Hilfe dokumentieren. Ein simuliertes Szenario nicht als gemessenes Arbeitsergebnis werten. Wiederholte Proben dienen dem Lernen; Bereitschaft für eine echte Rolle verlangt weiterhin vom Arbeitgeber genehmigte Prüfungen. Zeigt jemand eine Hochrisikoaufgabe nicht, ist fortgesetzte Aufsicht eine Kontrolle, keine Strafe.") },
            { type: "callout", reading: true, text: x(
              "Make mistakes safe to examine during learning; do not make unsafe exceptions normal during service.",
              "Bëji gabimet të sigurta për t'u shqyrtuar gjatë mësimit; mos i bëj përjashtimet e pasigurta normale gjatë shërbimit.",
              "Fehler beim Lernen sicher untersuchbar machen; unsichere Ausnahmen im Service nicht zur Normalität machen.") },
          ],
          note: x(
            "Editorial practice protocol informed by Keith and Frese (2008), Salas et al. (2012) and local-authority safeguards. The site's 5 Whys worksheet serves the last step.",
            "Protokoll editorial praktike i mbështetur te Keith e Frese (2008), Salas et al. (2012) dhe mbrojtjet e autoritetit lokal. Fleta e 5 Pse-ve e faqes i shërben hapit të fundit.",
            "Redaktionelles Übungsprotokoll nach Keith und Frese (2008), Salas et al. (2012) und örtlichen Schutzvorgaben. Das 5-Warum-Arbeitsblatt der Website dient dem letzten Schritt."),
          source: ["keith-frese-2008", "salas-2012"],
        },
      ],
    },

    // Chapter V. From training room to real work
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("From training room to real work", "Nga salla e trajnimit te puna e vërtetë", "Vom Schulungsraum zur echten Arbeit"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "when-a-new-system-arrives",
          title: [x("The course that", "Kursi që nuk arriti", "Der Kurs, der"), x("never reached the shift", "kurrë te turni", "die Schicht nie erreichte")],
          lead: x(
            "The programme can be well delivered while the workplace quietly prevents people from using what they learned.",
            "Programi mund të jepet mirë, ndërsa vendi i punës i pengon në heshtje njerëzit të përdorin atë që mësuan.",
            "Das Programm kann gut durchgeführt sein, während der Arbeitsplatz die Leute still daran hindert, das Gelernte zu nutzen."),
          blocks: [
            { type: "flag", text: x("Hypothetical training-transfer scene, not a measured programme", "Skenë hipotetike transferimi trajnimi, jo program i matur", "Hypothetische Transferszene, kein gemessenes Programm") },
            { type: "p", text: x(
              "A new employee returns from an approved training session. The exercise went well: the person can explain the standard and demonstrates the expected sequence in practice. Back on the shift, the colleague meets a different pattern of work. The person who could answer questions is assigned elsewhere, and the task is immediately handled through a long-established local habit. Several weeks later, the team still uses the old pattern. A superficial evaluation could conclude that the trainee forgot the lesson. Other explanations are possible: no opportunity to practise the target behaviour, no protected time to learn, an outdated system, or a leader who never clarified that the new standard had actually been adopted. A class cannot transfer itself into an unsupportive process.",
              "Një punonjës i ri kthehet nga një seancë trajnimi e miratuar. Ushtrimi shkoi mirë: personi mund ta shpjegojë standardin dhe e demonstron radhën e pritur në praktikë. Në turn, kolegu has një model tjetër pune. Personi që mund t'u përgjigjej pyetjeve është caktuar gjetiu, dhe detyra trajtohet menjëherë përmes një zakoni lokal të rrënjosur prej kohësh. Disa javë më vonë, ekipi e përdor ende modelin e vjetër. Një vlerësim sipërfaqësor mund të nxirrte se i trajnuari e harroi mësimin. Janë të mundshme shpjegime të tjera: pa mundësi për ta praktikuar sjelljen e synuar, pa kohë të mbrojtur për të mësuar, një sistem i vjetruar, ose një drejtues që nuk e sqaroi kurrë se standardi i ri ishte vërtet miratuar. Një kurs nuk e transferon dot veten në një proces jombështetës.",
              "Eine neue Beschäftigte kehrt aus einer genehmigten Schulung zurück. Die Übung lief gut: Sie kann den Standard erklären und zeigt die erwartete Abfolge in der Praxis. Zurück in der Schicht trifft sie ein anderes Arbeitsmuster. Die Person, die Fragen beantworten könnte, ist anderswo eingeteilt, und die Aufgabe wird sofort nach einer lang eingespielten örtlichen Gewohnheit erledigt. Wochen später nutzt das Team noch das alte Muster. Eine oberflächliche Bewertung könnte schließen, die Lernende habe die Lektion vergessen. Andere Erklärungen sind möglich: keine Gelegenheit, das Zielverhalten zu üben, keine geschützte Lernzeit, ein veraltetes System oder eine Führungskraft, die nie klarstellte, dass der neue Standard tatsächlich gilt. Ein Kurs kann sich nicht selbst in einen nicht unterstützenden Prozess übertragen.") },
            { type: "p", text: x(
              "This scene is constructed to isolate the environmental component of transfer. It does not assert that the author introduced a programme that failed or that a particular hotel or distribution partner discouraged new methods. The research question is whether the learning outcome was measured separately from workplace behaviour.",
              "Kjo skenë është ndërtuar për ta izoluar përbërësin mjedisor të transferimit. Nuk pohon se autori futi një program që dështoi, as se një hotel apo partner shpërndarjeje i caktuar i shkurajoi metodat e reja. Pyetja kërkimore është nëse rezultati i të mësuarit u mat veçmas nga sjellja në vendin e punës.",
              "Diese Szene ist konstruiert, um die Umfeldkomponente des Transfers zu isolieren. Sie behauptet nicht, der Autor habe ein gescheitertes Programm eingeführt oder ein bestimmtes Hotel oder ein Vertriebspartner habe neue Methoden entmutigt. Die Forschungsfrage ist, ob das Lernergebnis getrennt vom Arbeitsverhalten gemessen wurde.") },
            { type: "callout", reading: true, text: x(
              "If the environment prevents a learned behaviour from being used, repeated classroom instruction may not solve the problem.",
              "Nëse mjedisi e pengon përdorimin e një sjelljeje të mësuar, udhëzimi i përsëritur në klasë mund të mos e zgjidhë problemin.",
              "Verhindert das Umfeld die Anwendung eines gelernten Verhaltens, löst wiederholter Unterricht das Problem womöglich nicht.") },
          ],
          note: x(
            "Editorial illustration linked to Baldwin and Ford (1988) and Grossman and Salas (2011). The essay named below follows a new system into the work.",
            "Ilustrim editorial i lidhur me Baldwin e Ford (1988) dhe Grossman e Salas (2011). Eseja e emërtuar më poshtë e ndjek një sistem të ri deri në punë.",
            "Redaktionelle Illustration nach Baldwin und Ford (1988) und Grossman und Salas (2011). Der unten genannte Essay folgt einem neuen System in die Arbeit."),
          source: ["baldwin-ford-1988", "grossman-salas-2011"],
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("The workplace", "Vendi i punës", "Der Arbeitsplatz"), x("is part of the course", "është pjesë e kursit", "ist Teil des Kurses")],
          lead: x(
            "The supervisor, the tools and the opportunity to practise determine whether learning can become everyday performance.",
            "Mbikëqyrësi, mjetet dhe mundësia për të praktikuar përcaktojnë nëse të mësuarit mund të bëhet performancë e përditshme.",
            "Vorgesetzte, Werkzeuge und die Gelegenheit zu üben bestimmen, ob Lernen zur alltäglichen Leistung werden kann."),
          blocks: [
            { type: "p", text: x(
              "Transfer begins before the session and continues after it. A manager who sponsors training has to explain why the competence matters, reserve relevant practice opportunities, provide feedback and remove contradictions between the new instruction and the workflow. Training professionals can design a good learning activity, but they cannot independently create the conditions in which the shift will use that skill. Grossman and Salas (2011) identify support, opportunity to perform and follow-up among the factors consistently associated with transfer. Burke and Hutchins (2007) treat the work environment as a distinct source of transfer conditions. Salas and colleagues (2012) organise training across what happens before, during and after a programme. Sitzmann and Weinhardt (2018) describe training engagement across people, workgroups and organisations, and across time.",
              "Transferimi nis para seancës dhe vazhdon pas saj. Një menaxher që e sponsorizon trajnimin duhet të shpjegojë pse ka rëndësi kompetenca, të rezervojë mundësi praktike përkatëse, të japë reagim dhe të heqë kundërthëniet mes udhëzimit të ri dhe rrjedhës së punës. Profesionistët e trajnimit mund të projektojnë një veprimtari të mirë mësimi, por nuk i krijojnë dot vetë kushtet në të cilat turni do ta përdorë atë aftësi. Grossman dhe Salas (2011) identifikojnë mbështetjen, mundësinë për të performuar dhe ndjekjen mes faktorëve të lidhur vazhdimisht me transferimin. Burke dhe Hutchins (2007) e trajtojnë mjedisin e punës si burim më vete kushtesh transferimi. Salas dhe kolegët (2012) e organizojnë trajnimin sipas asaj që ndodh para, gjatë dhe pas një programi. Sitzmann dhe Weinhardt (2018) e përshkruajnë angazhimin në trajnim nëpër njerëz, grupe pune dhe organizata, dhe në kohë.",
              "Transfer beginnt vor der Schulung und geht danach weiter. Eine Führungskraft, die Training veranlasst, muss erklären, warum die Kompetenz zählt, passende Übungsgelegenheiten reservieren, Rückmeldung geben und Widersprüche zwischen neuer Anweisung und Arbeitsablauf beseitigen. Trainingsfachleute können eine gute Lernaktivität gestalten, aber nicht allein die Bedingungen schaffen, unter denen die Schicht die Fähigkeit nutzt. Grossman und Salas (2011) nennen Unterstützung, Gelegenheit zur Anwendung und Nachverfolgung unter den Faktoren, die beständig mit Transfer zusammenhängen. Burke und Hutchins (2007) behandeln das Arbeitsumfeld als eigene Quelle von Transferbedingungen. Salas und Kollegen (2012) ordnen Training nach dem, was vor, während und nach einem Programm geschieht. Sitzmann und Weinhardt (2018) beschreiben Trainingsengagement über Personen, Arbeitsgruppen und Organisationen hinweg, und über die Zeit.") },
            { type: "cards", cols: 3, items: [
              { h: x("Before", "Para", "Vorher"), p: x("Define need, support and criteria.", "Përkufizo nevojën, mbështetjen dhe kriteret.", "Bedarf, Unterstützung und Kriterien definieren.") },
              { h: x("During", "Gjatë", "Währenddessen"), p: x("Practise with feedback.", "Praktiko me reagim.", "Mit Rückmeldung üben.") },
              { h: x("After", "Pas", "Danach"), p: x("Observe use, reinforce and adapt.", "Vëzhgo përdorimin, përforco dhe përshtat.", "Anwendung beobachten, verstärken, anpassen.") },
            ] },
            { type: "p", text: x(
              "At the level of one team this is concrete. Was the new employee scheduled to use the learned task? Did a qualified person review the first independent attempts? Was uncertainty recorded and resolved? Do the SOP versions used in class and in the workplace match? If the answers are not known, the evaluation is incomplete.",
              "Në nivelin e një ekipi kjo është konkrete. A u planifikua punonjësi i ri ta përdorte detyrën e mësuar? A i rishikoi një person i kualifikuar përpjekjet e para të pavarura? A u shënua dhe u zgjidh pasiguria? A përputhen versionet e SOP-it të përdorura në klasë dhe në vendin e punës? Nëse përgjigjet nuk dihen, vlerësimi është i paplotë.",
              "Auf der Ebene eines Teams ist das konkret. War die neue Beschäftigte eingeplant, die gelernte Aufgabe zu nutzen? Prüfte eine qualifizierte Person die ersten eigenständigen Versuche? Wurde Unsicherheit festgehalten und geklärt? Stimmen die SOP-Versionen aus Schulung und Arbeitsplatz überein? Sind die Antworten unbekannt, ist die Bewertung unvollständig.") },
            { type: "callout", reading: true, text: x(
              "Transfer is a joint property of the training and the conditions in which the trained person is expected to work.",
              "Transferimi është veti e përbashkët e trajnimit dhe e kushteve në të cilat pritet të punojë personi i trajnuar.",
              "Transfer ist eine gemeinsame Eigenschaft des Trainings und der Bedingungen, unter denen die geschulte Person arbeiten soll.") },
          ],
          note: x(
            "Burke and Hutchins (2007); Grossman and Salas (2011); Salas et al. (2012); Sitzmann and Weinhardt (2018).",
            "Burke e Hutchins (2007); Grossman e Salas (2011); Salas et al. (2012); Sitzmann e Weinhardt (2018).",
            "Burke und Hutchins (2007); Grossman und Salas (2011); Salas et al. (2012); Sitzmann und Weinhardt (2018)."),
          source: ["burke-hutchins-2007", "grossman-salas-2011", "salas-2012", "sitzmann-weinhardt-2018"],
        },
        {
          id: "v-evidence", layer: "concept",
          title: [x("Four outcomes,", "Katër rezultate,", "Vier Ergebnisse,"), x("four different questions", "katër pyetje të ndryshme", "vier verschiedene Fragen")],
          lead: x(
            "Training-effectiveness research does not license managers to treat satisfaction scores as evidence of customer results.",
            "Kërkimi i efektshmërisë së trajnimit nuk u jep leje menaxherëve t'i trajtojnë pikët e kënaqësisë si provë të rezultateve për klientin.",
            "Forschung zur Trainingswirksamkeit erlaubt Führungskräften nicht, Zufriedenheitswerte als Beleg für Kundenergebnisse zu behandeln."),
          blocks: [
            { type: "hbars", max: 0.63,
              label: x("Published sample-weighted mean effect sizes (d), scaled to d = 0.63", "Madhësitë mesatare të efektit (d) të botuara, të ponderuara sipas mostrës, të shkallëzuara në d = 0,63", "Veröffentlichte stichprobengewichtete mittlere Effektstärken (d), skaliert auf d = 0,63"),
              items: [
                { k: x("Reaction (k = 15)", "Reagimi (k = 15)", "Reaktion (k = 15)"), v: 0.60, n: "0.60" },
                { k: x("Learning (k = 234)", "Të mësuarit (k = 234)", "Lernen (k = 234)"), v: 0.63, n: "0.63" },
                { k: x("Behaviour (k = 122)", "Sjellja (k = 122)", "Verhalten (k = 122)"), v: 0.62, n: "0.62" },
                { k: x("Results (k = 26)", "Rezultatet (k = 26)", "Ergebnisse (k = 26)"), v: 0.62, n: "0.62" },
              ] },
            { type: "p", text: x(
              "Arthur, Bennett, Edens and Bell (2003) meta-analysed studies of organisational training and reported separate sample-weighted effect sizes for reaction, learning, behaviour and results. The pooled estimates were positive, but the criteria were assessed in different sets of studies: these are distinct estimates, not a percentage trained or one group followed through four stages. The authors also found that training method, task characteristics and the choice of outcome criterion were related to measured effectiveness. A pleased trainee may have learned little; a skilled trainee may have no chance to perform; a change in individual behaviour may be too small or too loosely connected to a wider customer outcome. The four measures ask different questions and cannot be substituted for one another, nor do they qualify anyone for a regulated or safety-critical task. The contribution for a practical manager is measurement humility: define the outcome first, then choose the evidence that answers that question.",
              "Arthur, Bennett, Edens dhe Bell (2003) meta-analizuan studime të trajnimit organizativ dhe raportuan madhësi të ndara efekti, të ponderuara sipas mostrës, për reagimin, të mësuarit, sjelljen dhe rezultatet. Vlerësimet e bashkuara ishin pozitive, por kriteret u vlerësuan në grupe të ndryshme studimesh: janë vlerësime të dallueshme, jo përqindje e të trajnuarve dhe as një grup i ndjekur nëpër katër faza. Autorët gjetën gjithashtu se metoda e trajnimit, karakteristikat e detyrës dhe zgjedhja e kriterit të rezultatit lidheshin me efektshmërinë e matur. Një i trajnuar i kënaqur mund të ketë mësuar pak; një i trajnuar i aftë mund të mos ketë rast të performojë; një ndryshim në sjelljen individuale mund të jetë tepër i vogël ose tepër i lidhur dobët me një rezultat më të gjerë për klientin. Katër matjet bëjnë pyetje të ndryshme dhe nuk zëvendësohen me njëra-tjetrën, as nuk e kualifikojnë dikë për një detyrë të rregulluar apo kritike për sigurinë. Kontributi për një menaxher praktik është përulësia e matjes: përkufizo rezultatin së pari, pastaj zgjidh provën që i përgjigjet asaj pyetjeje.",
              "Arthur, Bennett, Edens und Bell (2003) metaanalysierten Studien zum Training in Organisationen und berichteten getrennte stichprobengewichtete Effektstärken für Reaktion, Lernen, Verhalten und Ergebnisse. Die gepoolten Schätzungen waren positiv, doch die Kriterien stammten aus verschiedenen Studiensätzen: Es sind getrennte Schätzungen, kein Prozentsatz Geschulter und keine Gruppe, die durch vier Stufen verfolgt wurde. Die Autoren fanden auch, dass Trainingsmethode, Aufgabenmerkmale und Wahl des Ergebniskriteriums mit der gemessenen Wirksamkeit zusammenhingen. Eine zufriedene Lernende hat vielleicht wenig gelernt; eine fähige hat vielleicht keine Gelegenheit zur Anwendung; eine Verhaltensänderung kann zu klein oder zu lose mit einem Kundenergebnis verbunden sein. Die vier Maße stellen verschiedene Fragen, sind nicht austauschbar und qualifizieren niemanden für eine regulierte oder sicherheitskritische Aufgabe. Der Beitrag für die Praxis ist Messdemut: erst das Ergebnis definieren, dann den Beleg wählen, der diese Frage beantwortet.") },
            { type: "callout", reading: true, text: x(
              "A training survey cannot certify workplace behaviour, and a classroom test cannot certify the organisation's results.",
              "Një anketë trajnimi nuk e certifikon dot sjelljen në vendin e punës, dhe një test klase nuk i certifikon dot rezultatet e organizatës.",
              "Eine Trainingsumfrage kann kein Arbeitsverhalten bescheinigen, und ein Klassentest keine Ergebnisse der Organisation.") },
          ],
          note: x(
            "Arthur et al., Journal of Applied Psychology 88(2), 234–245 (2003). The four values and their k are the paper's pooled estimates, drawn to scale.",
            "Arthur et al., Journal of Applied Psychology 88(2), 234–245 (2003). Katër vlerat dhe k-të e tyre janë vlerësimet e bashkuara të punimit, të vizatuara në shkallë.",
            "Arthur et al., Journal of Applied Psychology 88(2), 234–245 (2003). Die vier Werte und ihre k sind die gepoolten Schätzungen des Aufsatzes, maßstäblich gezeichnet."),
          source: ["arthur-2003"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Make transfer", "Bëje transferimin", "Transfer nach dem Kurs"), x("visible after class", "të dukshëm pas kursit", "sichtbar machen")],
          lead: x(
            "A short set of observations can separate delivery, learning and use without turning a trainee into a surveillance target.",
            "Një tog i shkurtër vëzhgimesh mund ta ndajë dhënien, të mësuarit dhe përdorimin, pa e kthyer të trajnuarin në objekt mbikëqyrjeje.",
            "Wenige Beobachtungen können Durchführung, Lernen und Anwendung trennen, ohne eine Lernende zum Überwachungsziel zu machen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Before training", "Para trajnimit", "Vor dem Training"), p: x("Task, approved standard, risk level and expected observable behaviour.", "Detyra, standardi i miratuar, niveli i rrezikut dhe sjellja e pritur.", "Aufgabe, genehmigter Standard, Risikoniveau und erwartetes Verhalten.") },
              { h: x("At completion", "Në përfundim", "Beim Abschluss"), p: x("Explanation and guided demonstration, with the support required recorded.", "Shpjegimi dhe demonstrimi i udhëhequr, me mbështetjen e kërkuar të shënuar.", "Erklärung und angeleitete Vorführung, nötige Unterstützung festgehalten.") },
              { h: x("At first application", "Në zbatimin e parë", "Bei der ersten Anwendung"), p: x("An authorised real or simulated task, with where help was needed classified.", "Një detyrë e autorizuar reale ose e simuluar, me klasifikim se ku u desh ndihmë.", "Eine autorisierte echte oder simulierte Aufgabe, Hilfebedarf eingeordnet.") },
              { h: x("After an agreed interval", "Pas një intervali të rënë dakord", "Nach einem vereinbarten Abstand"), p: x("The same ability under relevant conditions, not only memory of the guide.", "E njëjta aftësi në kushte përkatëse, jo vetëm kujtesa e udhëzuesit.", "Dieselbe Fähigkeit unter passenden Bedingungen, nicht nur Erinnerung an den Leitfaden.") },
              { h: x("Review barriers", "Rishiko pengesat", "Hürden prüfen"), p: x("Equipment, time, workload, unclear SOPs or supervisor practices.", "Pajisjet, koha, ngarkesa, SOP-të e paqarta ose praktikat e mbikëqyrësit.", "Ausrüstung, Zeit, Arbeitslast, unklare SOPs oder Vorgesetztenpraxis.") },
              { h: x("Report at the correct level", "Raporto në nivelin e duhur", "Auf der richtigen Ebene berichten"), p: x("Capability gaps and process defects, no individual performance data published.", "Hendeqet e aftësisë dhe defektet e procesit, pa publikuar të dhëna individuale.", "Fähigkeitslücken und Prozessmängel, keine individuellen Leistungsdaten veröffentlicht.") },
            ] },
            { type: "p", text: x(
              "An interval of a week or a month is a local choice, not a universal requirement. Keep the same task definition, track quality and unintended consequences (faster completion that creates downstream rework is not transfer), and ask the people who receive the work.",
              "Një interval prej një jave ose një muaji është zgjedhje lokale, jo kërkesë universale. Mbaj të njëjtin përkufizim detyre, ndiq cilësinë dhe pasojat e paqëllimshme (përfundimi më i shpejtë që krijon ripunim më poshtë nuk është transferim) dhe pyet njerëzit që e marrin punën.",
              "Ein Abstand von einer Woche oder einem Monat ist eine örtliche Wahl, keine universelle Vorgabe. Dieselbe Aufgabendefinition behalten, Qualität und unbeabsichtigte Folgen verfolgen (schnellerer Abschluss mit nachgelagerter Nacharbeit ist kein Transfer) und die fragen, die die Arbeit erhalten.") },
            { type: "callout", reading: true, text: x(
              "The key outcome is not that a session took place. It is that a useful behaviour appeared when the work required it.",
              "Rezultati kryesor nuk është se u mbajt një seancë. Është se një sjellje e dobishme u shfaq kur puna e kërkoi.",
              "Das entscheidende Ergebnis ist nicht, dass eine Einheit stattfand. Es ist, dass ein nützliches Verhalten auftrat, als die Arbeit es verlangte.") },
          ],
          note: x(
            "Editorial method synthesised from Arthur et al. (2003), Grossman and Salas (2011) and Salas et al. (2012).",
            "Metodë editoriale e sintetizuar nga Arthur et al. (2003), Grossman e Salas (2011) dhe Salas et al. (2012).",
            "Redaktionelle Methode, zusammengeführt aus Arthur et al. (2003), Grossman und Salas (2011) und Salas et al. (2012)."),
          source: ["arthur-2003", "grossman-salas-2011", "salas-2012"],
        },
      ],
    },

    // Chapter VI. Proving readiness
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Proving readiness", "Prova e gatishmërisë", "Bereitschaft nachweisen"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "a-good-sop-is-not-a-document",
          title: [x("Two certificates,", "Dy certifikata,", "Zwei Zertifikate,"), x("different evidence", "prova të ndryshme", "verschiedene Belege")],
          lead: x(
            "The same training completion status can conceal two very different levels of independence.",
            "I njëjti status i përfundimit të trajnimit mund të fshehë dy nivele krejt të ndryshme pavarësie.",
            "Derselbe Trainingsabschluss kann zwei sehr verschiedene Grade von Eigenständigkeit verbergen."),
          blocks: [
            { type: "flag", text: x("Constructed assessment scene, not a real personnel decision", "Skenë e ndërtuar vlerësimi, jo vendim i vërtetë personeli", "Konstruierte Bewertungsszene, keine echte Personalentscheidung") },
            { type: "p", text: x(
              "Two new colleagues finish the same induction. Both attend all sessions, acknowledge the procedures and complete the supervised demonstration. A manager could mark both as ready. Instead, the assessor asks each person to run an approved task and explain what would make the next action inappropriate. One trainee describes the boundary and demonstrates how to seek the correct help. The other completes the normal task but needs prompting when the variation appears. This comparison is deliberately fictional. It does not establish that one worker has greater potential, that the other is unmotivated or that an organisation used such a test. It shows why a readiness decision should describe the task and the evidence. The second colleague may need a clearer example, more rehearsal or more protected practice. The response should be developmental and proportionate to risk, not a public label attached to a person.",
              "Dy kolegë të rinj e mbarojnë të njëjtin orientim. Të dy marrin pjesë në të gjitha seancat, i pranojnë procedurat dhe e përfundojnë demonstrimin e mbikëqyrur. Një menaxher mund t'i shënonte të dy si gati. Në vend të kësaj, vlerësuesi i kërkon secilit të kryejë një detyrë të miratuar dhe të shpjegojë çfarë do ta bënte veprimin e radhës të papërshtatshëm. Njëri i trajnuar e përshkruan kufirin dhe demonstron si të kërkojë ndihmën e duhur. Tjetri e përfundon detyrën normale, por ka nevojë për sugjerim kur shfaqet variacioni. Ky krahasim është qëllimisht i sajuar. Nuk vërteton se njëri punonjës ka më shumë potencial, se tjetri është i pamotivuar apo se një organizatë e përdori një provë të tillë. Tregon pse një vendim gatishmërie duhet ta përshkruajë detyrën dhe provën. Kolegu i dytë mund të ketë nevojë për një shembull më të qartë, më shumë ushtrim ose më shumë praktikë të mbrojtur. Përgjigjja duhet të jetë zhvilluese dhe në përpjesëtim me rrezikun, jo etiketë publike e ngjitur mbi një person.",
              "Zwei neue Kolleginnen beenden dieselbe Einarbeitung. Beide besuchen alle Einheiten, bestätigen die Verfahren und schließen die begleitete Vorführung ab. Eine Führungskraft könnte beide als bereit markieren. Stattdessen bittet die Prüferin jede, eine genehmigte Aufgabe auszuführen und zu erklären, was die nächste Handlung unangemessen machen würde. Eine beschreibt die Grenze und zeigt, wie sie die richtige Hilfe holt. Die andere erledigt die normale Aufgabe, braucht aber Hinweise, als die Variation auftaucht. Dieser Vergleich ist bewusst fiktiv. Er belegt nicht, dass eine mehr Potenzial hat, die andere unmotiviert ist oder eine Organisation einen solchen Test nutzte. Er zeigt, warum eine Bereitschaftsentscheidung Aufgabe und Beleg beschreiben sollte. Die zweite Kollegin braucht vielleicht ein klareres Beispiel, mehr Probe oder mehr geschützte Übung. Die Antwort sollte entwickelnd und dem Risiko angemessen sein, kein öffentliches Etikett an einer Person.") },
            { type: "p", text: x(
              "The authorised supervisor decides the scope of independent work, and some roles require formal approvals outside any local training checklist. This volume creates no credentials and reproduces no confidential operating steps. Its concern is the quality of evidence behind a decision that training is finished.",
              "Mbikëqyrësi i autorizuar vendos fushën e punës së pavarur, dhe disa role kërkojnë miratime formale jashtë çdo liste kontrolli lokale trajnimi. Ky vëllim nuk krijon kredenciale dhe nuk riprodhon hapa operativë konfidencialë. Shqetësimi i tij është cilësia e provës pas vendimit se trajnimi ka mbaruar.",
              "Die befugte Vorgesetzte entscheidet den Umfang eigenständiger Arbeit, und manche Rollen verlangen förmliche Freigaben außerhalb jeder örtlichen Trainingscheckliste. Dieser Band schafft keine Befähigungsnachweise und gibt keine vertraulichen Betriebsschritte wieder. Sein Anliegen ist die Qualität des Belegs hinter der Entscheidung, dass ein Training beendet ist.") },
            { type: "callout", reading: true, text: x(
              "A fair readiness decision describes demonstrated capability and the support still required, not a judgement of personal worth.",
              "Një vendim i drejtë gatishmërie përshkruan aftësinë e demonstruar dhe mbështetjen që duhet ende, jo një gjykim për vlerën personale.",
              "Eine faire Bereitschaftsentscheidung beschreibt gezeigte Fähigkeit und noch nötige Unterstützung, kein Urteil über den persönlichen Wert.") },
          ],
          note: x(
            "Constructed illustration informed by Baldwin and Ford (1988), Arthur et al. (2003) and Salas et al. (2012). The essay named below tests an SOP in the shift, not in the folder.",
            "Ilustrim i ndërtuar i mbështetur te Baldwin e Ford (1988), Arthur et al. (2003) dhe Salas et al. (2012). Eseja e emërtuar më poshtë e provon një SOP në turn, jo në dosje.",
            "Konstruierte Illustration nach Baldwin und Ford (1988), Arthur et al. (2003) und Salas et al. (2012). Der unten genannte Essay prüft eine SOP in der Schicht, nicht im Ordner."),
          source: ["baldwin-ford-1988", "arthur-2003", "salas-2012"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Five kinds", "Pesë lloje", "Fünf Arten"), x("of readiness evidence", "provash gatishmërie", "von Bereitschaftsbelegen")],
          lead: x(
            "A progression of observable evidence, without pretending that every role has one universal qualification pathway.",
            "Një progresion provash të vëzhgueshme, pa pretenduar se çdo rol ka një rrugë universale kualifikimi.",
            "Eine Abfolge beobachtbarer Belege, ohne vorzugeben, jede Rolle habe einen universellen Qualifikationsweg."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Exposure", "Ekspozimi", "Kontakt"), p: x("The employee was shown the current approved process; attendance and version recorded.", "Punonjësit iu tregua procesi aktual i miratuar; pjesëmarrja dhe versioni të shënuara.", "Der aktuelle genehmigte Prozess wurde gezeigt; Anwesenheit und Version festgehalten.") },
              { h: x("Understanding", "Kuptimi", "Verständnis"), p: x("The employee can explain the purpose, expected result and relevant limits.", "Punonjësi mund të shpjegojë qëllimin, rezultatin e pritur dhe kufijtë përkatës.", "Die Beschäftigte kann Zweck, erwartetes Ergebnis und Grenzen erklären.") },
              { h: x("Supported practice", "Praktika e mbështetur", "Begleitete Übung"), p: x("The employee performs in a permitted setting with assistance made explicit.", "Punonjësi performon në një mjedis të lejuar, me ndihmën të bërë të qartë.", "Sie führt in einem erlaubten Rahmen aus, mit ausdrücklich benannter Hilfe.") },
              { h: x("Independent evidence", "Prova e pavarur", "Eigenständiger Beleg"), p: x("A bounded task without inappropriate prompting, with exceptions recognised.", "Një detyrë e kufizuar pa sugjerim të papërshtatshëm, me përjashtimet të njohura.", "Eine abgegrenzte Aufgabe ohne unangemessenes Vorsagen, mit erkannten Ausnahmen.") },
              { h: x("Maintained transfer", "Transferimi i ruajtur", "Erhaltener Transfer"), p: x("Later observation finds the capability usable in relevant working conditions.", "Vëzhgimi i mëvonshëm e gjen aftësinë të përdorshme në kushte përkatëse pune.", "Spätere Beobachtung findet die Fähigkeit unter passenden Arbeitsbedingungen nutzbar.") },
            ] },
            { type: "p", text: x(
              "These are editorial evidence categories, not a validated psychometric scale. A role may require parallel assessments, formal external certification or mandatory supervision regardless of one demonstration. A correct stop-and-escalate decision can count positively where that is the approved standard; performing a normal sequence once does not establish unlimited authority for unusual cases. A readiness record names the assessed process, SOP version, task risk, date, assessor, observed evidence, remaining gaps and next review. Avoid aggregate pass rates across incomparable roles, and never use the card to make sensitive employee data public.",
              "Këto janë kategori editoriale provash, jo shkallë psikometrike e vërtetuar. Një rol mund të kërkojë vlerësime paralele, certifikim formal të jashtëm ose mbikëqyrje të detyrueshme, pavarësisht nga një demonstrim. Një vendim i saktë ndalo-dhe-eskalo mund të llogaritet pozitivisht aty ku ai është standardi i miratuar; kryerja e një radhe normale një herë nuk vërteton autoritet të pakufizuar për raste të pazakonta. Një regjistër gatishmërie emërton procesin e vlerësuar, versionin e SOP-it, rrezikun e detyrës, datën, vlerësuesin, provën e vëzhguar, hendeqet që mbeten dhe rishikimin e radhës. Shmang normat e përmbledhura të kalimit nëpër role të pakrahasueshme, dhe mos e përdor kurrë kartën për t'i bërë publike të dhëna të ndjeshme punonjësish.",
              "Das sind redaktionelle Belegkategorien, keine validierte psychometrische Skala. Eine Rolle kann parallele Bewertungen, förmliche externe Zertifizierung oder Pflichtaufsicht verlangen, unabhängig von einer Vorführung. Eine richtige Stopp-und-Eskalations-Entscheidung kann positiv zählen, wo das der genehmigte Standard ist; eine normale Abfolge einmal auszuführen begründet keine unbegrenzte Befugnis für ungewöhnliche Fälle. Ein Bereitschaftsnachweis nennt den bewerteten Prozess, die SOP-Version, das Aufgabenrisiko, Datum, Prüferin, beobachteten Beleg, verbleibende Lücken und nächste Prüfung. Keine aggregierten Bestehensquoten über unvergleichbare Rollen, und nie die Karte nutzen, um sensible Beschäftigtendaten öffentlich zu machen.") },
            { type: "callout", reading: true, text: x(
              "Readiness is a bounded claim supported by observed work, not a permanent personal label.",
              "Gatishmëria është pretendim i kufizuar, i mbështetur nga puna e vëzhguar, jo etiketë e përhershme personale.",
              "Bereitschaft ist eine begrenzte Behauptung, gestützt auf beobachtete Arbeit, kein dauerhaftes persönliches Etikett.") },
          ],
          note: x(
            "Original operating framework informed by the transfer and evaluation literature (Baldwin and Ford 1988; Arthur et al. 2003; Blume et al. 2010; Salas et al. 2012); not a validated readiness score or employer certification.",
            "Kuadër operativ origjinal i mbështetur në literaturën e transferimit dhe të vlerësimit (Baldwin e Ford 1988; Arthur et al. 2003; Blume et al. 2010; Salas et al. 2012); jo pikë e vërtetuar gatishmërie apo certifikim punëdhënësi.",
            "Eigener Betriebsrahmen nach der Transfer- und Evaluationsliteratur (Baldwin und Ford 1988; Arthur et al. 2003; Blume et al. 2010; Salas et al. 2012); kein validierter Bereitschaftswert und keine Arbeitgeberzertifizierung."),
          source: ["baldwin-ford-1988", "arthur-2003", "blume-2010", "salas-2012"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("A controlled", "Një pilot i kontrolluar", "Ein kontrollierter"), x("readiness pilot", "gatishmërie", "Bereitschaftspilot")],
          lead: x(
            "Test the assessment design before scaling it: safe, fair and useful for the receiving team.",
            "Provoje projektimin e vlerësimit para se ta shkallëzosh: i sigurt, i drejtë dhe i dobishëm për ekipin që e merr.",
            "Das Bewertungsdesign testen, bevor es ausgeweitet wird: sicher, fair und nützlich für das empfangende Team."),
          blocks: [
            { type: "steps", items: [
              { h: x("Select one task family", "Zgjidh një familje detyrash", "Eine Aufgabenfamilie wählen"), p: x("A common, authorised task with observable quality criteria.", "Një detyrë e zakonshme dhe e autorizuar, me kritere cilësie të vëzhgueshme.", "Eine häufige, autorisierte Aufgabe mit beobachtbaren Qualitätskriterien.") },
              { h: x("Confirm the rule owner", "Konfirmo pronarin e rregullit", "Die Regelverantwortliche bestätigen"), p: x("The responsible department validates the instruction and stop conditions.", "Departamenti përgjegjës e vërteton udhëzimin dhe kushtet e ndalimit.", "Die zuständige Abteilung bestätigt Anweisung und Stoppbedingungen.") },
              { h: x("Pilot with supervision", "Pilotoje me mbikëqyrje", "Mit Aufsicht pilotieren"), p: x("Task-level observations, no uncontrolled risk for trainees.", "Vëzhgime në nivel detyre, pa rrezik të pakontrolluar për të trajnuarit.", "Beobachtungen auf Aufgabenebene, kein unkontrolliertes Risiko für Lernende.") },
              { h: x("Measure assistance separately", "Mat ndihmën veçmas", "Hilfe getrennt messen"), p: x("Complete, accurate and supported performance, not simply speed.", "Performancë e plotë, e saktë dhe e mbështetur, jo thjesht shpejtësi.", "Vollständige, genaue und unterstützte Leistung, nicht bloß Tempo.") },
              { h: x("Check for transfer", "Kontrollo transferimin", "Auf Transfer prüfen"), p: x("A repeat observation after an agreed interval, with changed conditions noted.", "Një vëzhgim i përsëritur pas një intervali të rënë dakord, me kushtet e ndryshuara të shënuara.", "Eine Wiederholung nach vereinbartem Abstand, veränderte Bedingungen notiert.") },
              { h: x("Review the system as well", "Rishiko edhe sistemin", "Auch das System prüfen"), p: x("Obstacles, trainer prompts, SOP clarity and downstream rework.", "Pengesat, sugjerimet e trajnerit, qartësia e SOP-it dhe ripunimi.", "Hindernisse, Trainerhinweise, SOP-Klarheit und Nacharbeit.") },
            ] },
            { type: "p", text: x(
              "Ten anonymised observations are an editorial illustration, not a validated sample size. A local owner agrees in advance what counts as success; the trainee needs a safe route to ask, and the programme a way to revise confusing materials. A workshop that finds an unclear procedure has found information about the process, not a person to blame. If the capability is not demonstrated, supervision and more practice are concrete actions; a certificate without evidence for its scope is not.",
              "Dhjetë vëzhgime anonime janë ilustrim editorial, jo madhësi mostre e vërtetuar. Një pronar lokal bie dakord paraprakisht çfarë llogaritet sukses; i trajnuari ka nevojë për një rrugë të sigurt për të pyetur, dhe programi për një mënyrë për t'i rishikuar materialet e paqarta. Një punëtori që gjen një procedurë të paqartë ka gjetur informacion për procesin, jo një person për ta fajësuar. Nëse aftësia nuk demonstrohet, mbikëqyrja dhe më shumë praktikë janë veprime konkrete; një certifikatë pa prova për fushën e vet nuk është.",
              "Zehn anonymisierte Beobachtungen sind eine redaktionelle Illustration, keine validierte Stichprobengröße. Eine örtliche Verantwortliche vereinbart vorab, was als Erfolg zählt; die Lernende braucht einen sicheren Weg für Rückfragen, das Programm einen Weg, unklares Material zu überarbeiten. Ein unklares Verfahren zu finden ist Information über den Prozess, keine Person zum Beschuldigen. Fehlt der Nachweis, sind Aufsicht und mehr Übung konkrete Schritte; ein Zertifikat ohne Beleg für seinen Umfang ist es nicht.") },
            { type: "callout", reading: true, text: x(
              "Do not certify the course. Verify the task, the conditions and the limits of the competence claim.",
              "Mos e certifiko kursin. Verifiko detyrën, kushtet dhe kufijtë e pretendimit për kompetencë.",
              "Zertifizieren Sie nicht den Kurs. Prüfen Sie die Aufgabe, die Bedingungen und die Grenzen der Kompetenzbehauptung.") },
          ],
          note: x(
            "Editorial pilot after Baldwin and Ford (1988) and Salas et al. (2012); not a ready-made regulatory scheme.",
            "Pilot editorial sipas Baldwin e Ford (1988) dhe Salas et al. (2012); jo skemë rregullatore e gatshme.",
            "Redaktioneller Pilot nach Baldwin und Ford (1988) und Salas et al. (2012); kein fertiges Regelwerk."),
          source: ["baldwin-ford-1988", "salas-2012"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Operational", "Karta e gatishmërisë", "Die Bereitschaftskarte"), x("Readiness Card", "operacionale", "für den Betrieb")],
      lead: x(
        "One role, one bounded task. Complete only with anonymised or properly authorised records, and write “not observed” where evidence is missing.",
        "Një rol, një detyrë e kufizuar. Plotësoje vetëm me regjistra anonime ose të autorizuara siç duhet, dhe shkruaj “e pavëzhguar” aty ku mungon prova.",
        "Eine Rolle, eine abgegrenzte Aufgabe. Nur mit anonymisierten oder ordentlich autorisierten Aufzeichnungen ausfüllen, und „nicht beobachtet“ schreiben, wo der Beleg fehlt."),
      blocks: [
        { type: "form", items: [
          { h: x("Task and standard", "Detyra dhe standardi", "Aufgabe und Standard"), hint: x("which approved task, SOP version and expected result are being assessed?", "cila detyrë e miratuar, version SOP-i dhe rezultat i pritur po vlerësohen?", "welche genehmigte Aufgabe, SOP-Version und welches erwartete Ergebnis werden bewertet?") },
          { h: x("Demonstration", "Demonstrimi", "Vorführung"), hint: x("what did the trainee perform without prompting, and what help was given?", "çfarë kreu i trajnuari pa sugjerim, dhe çfarë ndihme iu dha?", "was führte die Lernende ohne Vorsagen aus, und welche Hilfe gab es?") },
          { h: x("Exception recognition", "Njohja e përjashtimit", "Ausnahmeerkennung"), hint: x("what boundary or stop-and-escalate condition did the trainee identify?", "cilin kufi ose kusht ndalo-dhe-eskalo e identifikoi i trajnuari?", "welche Grenze oder Stopp-und-Eskalations-Bedingung erkannte die Lernende?") },
          { h: x("Quality and transfer", "Cilësia dhe transferimi", "Qualität und Transfer"), hint: x("what evidence shows the task is accurate and usable downstream?", "cila provë tregon se detyra është e saktë dhe e përdorshme më poshtë në zinxhir?", "welcher Beleg zeigt, dass die Aufgabe genau und nachgelagert nutzbar ist?") },
          { h: x("Support and ownership", "Mbështetja dhe pronësia", "Unterstützung und Verantwortung"), hint: x("what further practice is required, and who can authorise the next step?", "çfarë praktike të mëtejshme duhet, dhe kush mund ta autorizojë hapin e radhës?", "welche weitere Übung ist nötig, und wer kann den nächsten Schritt freigeben?") },
          { h: x("Follow-up", "Ndjekja", "Nachverfolgung"), hint: x("when is the next observation, and how will the result return to the trainee?", "kur është vëzhgimi i radhës, dhe si do t'i kthehet rezultati të trajnuarit?", "wann ist die nächste Beobachtung, und wie kehrt das Ergebnis zur Lernenden zurück?") },
        ] },
      ],
      note: x(
        "A proposed educational aid, not a validated test or employer-issued certification. A live assessment follows the employer's training, privacy, safety and approval requirements; never store customer data, guest details, protected personnel records or credentials in an informal tool, and never read speed alone as competence.",
        "Mjet edukativ i propozuar, jo test i vërtetuar apo certifikim i lëshuar nga punëdhënësi. Një vlerësim i vërtetë ndjek kërkesat e punëdhënësit për trajnimin, privatësinë, sigurinë dhe miratimin; mos ruaj kurrë të dhëna klientësh, detaje mysafirësh, regjistra të mbrojtur personeli apo kredenciale në një mjet joformal, dhe mos e lexo kurrë vetëm shpejtësinë si kompetencë.",
        "Ein vorgeschlagenes Lernhilfsmittel, kein validierter Test und keine vom Arbeitgeber ausgestellte Zertifizierung. Eine echte Bewertung folgt den Trainings-, Datenschutz-, Sicherheits- und Freigabevorgaben des Arbeitgebers; nie Kundendaten, Gästedetails, geschützte Personalakten oder Zugangsdaten in einem informellen Werkzeug speichern, und Tempo allein nie als Kompetenz lesen."),
      source: ["baldwin-ford-1988", "salas-2012"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The day", "Dita kur", "Der Tag,"), x("the trainer leaves", "largohet trajneri", "an dem der Trainer geht")],
      lead: x(
        "Every training programme eventually arrives at a moment that the classroom cannot control.",
        "Çdo program trajnimi arrin në fund te një çast që klasa nuk e kontrollon dot.",
        "Jedes Trainingsprogramm kommt irgendwann an einen Moment, den der Schulungsraum nicht kontrollieren kann."),
      blocks: [
        { type: "p", text: x(
          "An experienced colleague finishes a demonstration and turns back to the ordinary work of the day. The new employee now faces the job without the same prompts, patience and predictable sequence. In one sense the programme has ended. In another, the important part is only beginning: whether knowledge can travel from the protected practice setting into decisions made under real conditions. Managers need training records. They also need competent people, responsible limits and a way to repair the process when someone cannot perform what the organisation demands. The mistake is not counting completion. It is treating that count as the entire result. A signature, a quiz or a successful guided task answers a narrow question. Neither the person nor the organisation benefits when that narrow answer is inflated into a claim of total readiness.",
          "Një koleg me përvojë e mbaron një demonstrim dhe kthehet te puna e zakonshme e ditës. Punonjësi i ri e përballon tani punën pa të njëjtat sugjerime, durim dhe radhë të parashikueshme. Në një kuptim programi ka mbaruar. Në një tjetër, pjesa e rëndësishme sapo nis: nëse dija mund të udhëtojë nga mjedisi i mbrojtur i praktikës te vendimet e marra në kushte të vërteta. Menaxherët kanë nevojë për regjistra trajnimi. Kanë nevojë edhe për njerëz kompetentë, kufij të përgjegjshëm dhe një mënyrë për ta ndrequr procesin kur dikush nuk e kryen dot atë që kërkon organizata. Gabimi nuk është numërimi i përfundimeve. Është trajtimi i atij numri si gjithë rezultati. Një nënshkrim, një kuiz ose një detyrë e udhëhequr me sukses i përgjigjet një pyetjeje të ngushtë. As personi, as organizata nuk përfitojnë kur ajo përgjigje e ngushtë fryhet në pretendim gatishmërie të plotë.",
          "Eine erfahrene Kollegin beendet eine Vorführung und wendet sich wieder der gewöhnlichen Arbeit des Tages zu. Die neue Beschäftigte steht der Arbeit nun ohne dieselben Hinweise, dieselbe Geduld und vorhersehbare Abfolge gegenüber. In einem Sinn ist das Programm beendet. In einem anderen beginnt der wichtige Teil erst: ob Wissen aus dem geschützten Übungsrahmen in Entscheidungen unter echten Bedingungen gelangen kann. Führungskräfte brauchen Trainingsnachweise. Sie brauchen auch kompetente Menschen, verantwortliche Grenzen und einen Weg, den Prozess zu reparieren, wenn jemand nicht leisten kann, was die Organisation verlangt. Der Fehler ist nicht, Abschlüsse zu zählen. Er ist, diese Zahl für das ganze Ergebnis zu halten. Eine Unterschrift, ein Quiz oder eine gelungene angeleitete Aufgabe beantwortet eine enge Frage. Weder Person noch Organisation profitieren, wenn diese enge Antwort zur Behauptung voller Bereitschaft aufgeblasen wird.") },
        { type: "p", text: x(
          "The research offers discipline rather than a magic technique. Behaviour-modelling studies say that watching and learning are not identical to later job performance. Transfer reviews point to practice opportunity, workplace support and follow-up. Error-management research suggests that safely exploring mistakes in training can help prepare for unfamiliar situations. None of this licenses managers to weaken real safety boundaries or to claim that every novice should perform independently after the same number of hours. The author's experience spans new-driver ramp-up, last-mile coordination and the search for reliable hotel SOP guidance while learning a new role. Those experiences make the question concrete, but this volume does not measure failures or successes in any named workplace. Its practical value lies in asking a more demanding question before writing “training completed”: what did the learner actually demonstrate, what remains uncertain, and who will help if the real situation differs from rehearsal? An organisation earns trust when it can answer that question without blaming the beginner for an incomplete training system. The trainer leaves. The work continues. Readiness is the evidence that the employee is not being sent into that gap alone.",
          "Kërkimi ofron disiplinë, jo teknikë magjike. Studimet e modelimit të sjelljes thonë se të parit dhe të mësuarit nuk janë të njëjta me performancën e mëvonshme në punë. Rishikimet e transferimit tregojnë mundësinë për praktikë, mbështetjen në vendin e punës dhe ndjekjen. Kërkimi i menaxhimit të gabimeve sugjeron se eksplorimi i sigurt i gabimeve në trajnim mund të ndihmojë përgatitjen për situata të panjohura. Asgjë nga këto nuk u jep leje menaxherëve t'i dobësojnë kufijtë e vërtetë të sigurisë apo të pretendojnë se çdo fillestar duhet të performojë i pavarur pas të njëjtit numër orësh. Përvoja e autorit përfshin fillimin e shoferëve të rinj, koordinimin e miljes së fundit dhe kërkimin e udhëzimeve të besueshme SOP të hotelit gjatë mësimit të një roli të ri. Ato përvoja e bëjnë pyetjen konkrete, por ky vëllim nuk mat dështime apo suksese në ndonjë vend pune të emërtuar. Vlera e tij praktike qëndron në bërjen e një pyetjeje më kërkuese para se të shkruhet “trajnimi i përfunduar”: çfarë demonstroi vërtet nxënësi, çfarë mbetet e pasigurt, dhe kush do të ndihmojë nëse situata e vërtetë ndryshon nga ushtrimi? Një organizatë e fiton besimin kur mund t'i përgjigjet asaj pyetjeje pa e fajësuar fillestarin për një sistem trajnimi të paplotë. Trajneri largohet. Puna vazhdon. Gatishmëria është prova se punonjësi nuk po dërgohet vetëm në atë hendek.",
          "Die Forschung bietet Disziplin, keine Zaubertechnik. Studien zur Verhaltensmodellierung sagen, dass Zusehen und Lernen nicht dasselbe sind wie spätere Arbeitsleistung. Transferübersichten weisen auf Übungsgelegenheit, Unterstützung am Arbeitsplatz und Nachverfolgung. Forschung zum Fehlermanagement legt nahe, dass das sichere Erkunden von Fehlern im Training auf unbekannte Situationen vorbereiten kann. Nichts davon erlaubt Führungskräften, echte Sicherheitsgrenzen zu schwächen oder zu behaupten, jede Anfängerin müsse nach derselben Stundenzahl eigenständig arbeiten. Die Erfahrung des Autors umfasst den Anlauf neuer Fahrer, Koordination der letzten Meile und die Suche nach verlässlicher Hotel-SOP-Anleitung beim Erlernen einer neuen Rolle. Diese Erfahrungen machen die Frage konkret, doch dieser Band misst keine Fehlschläge oder Erfolge an einem benannten Arbeitsplatz. Sein praktischer Wert liegt in einer anspruchsvolleren Frage, bevor „Training abgeschlossen“ geschrieben wird: Was hat die Lernende wirklich gezeigt, was bleibt unsicher, und wer hilft, wenn die echte Lage von der Probe abweicht? Eine Organisation verdient Vertrauen, wenn sie diese Frage beantworten kann, ohne die Anfängerin für ein unvollständiges Trainingssystem zu beschuldigen. Der Trainer geht. Die Arbeit geht weiter. Bereitschaft ist der Beleg, dass die Beschäftigte nicht allein in diese Lücke geschickt wird.") },
        { type: "callout", reading: true, text: x(
          "Training is not complete when someone has watched the work. It is complete for a defined task when performance, limits and support are demonstrated.",
          "Trajnimi nuk është i plotë kur dikush e ka parë punën. Është i plotë për një detyrë të përkufizuar kur demonstrohen performanca, kufijtë dhe mbështetja.",
          "Training ist nicht abgeschlossen, wenn jemand der Arbeit zugesehen hat. Es ist für eine definierte Aufgabe abgeschlossen, wenn Leistung, Grenzen und Unterstützung gezeigt sind.") },
      ],
      note: x(
        "Editorial conclusion. No failed programme, unready employee or unsafe practice is attributed to any named employer.",
        "Përfundim editorial. Asnjë program i dështuar, punonjës i pagatshëm apo praktikë e pasigurt nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktionelles Fazit. Kein gescheitertes Programm, keine unvorbereitete Beschäftigte und keine unsichere Praxis wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Evidence before", "Prova para", "Belege vor der"), x("the readiness claim", "pretendimit të gatishmërisë", "Bereitschaftsbehauptung")],
      lead: x(
        "An evidence-informed editorial synthesis, not original field research: documented categories of last-mile ramp-up and hotel training work, labelled constructed scenes and proposed operating protocols. Every numeric sample and effect refers to published research, never to the author's workplaces.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim origjinal në terren: kategori të dokumentuara të fillimit në miljen e fundit dhe të trajnimit në hotel, skena të ndërtuara të etiketuara dhe protokolle operative të propozuara. Çdo mostër dhe efekt numerik i referohet kërkimit të botuar, kurrë vendeve të punës së autorit.",
        "Eine belegbasierte redaktionelle Synthese, keine eigene Feldforschung: dokumentierte Kategorien von Last-Mile-Anlauf und Hoteltraining, gekennzeichnete konstruierte Szenen und vorgeschlagene Betriebsprotokolle. Jede Zahl zu Stichproben und Effekten bezieht sich auf veröffentlichte Forschung, nie auf die Arbeitsplätze des Autors."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Reviews", "Rishikimet", "Übersichten"), p: x("Baldwin and Ford (1988), Burke and Hutchins (2007), Aguinis and Kraiger (2009), Grossman and Salas (2011), Salas et al. (2012) and Sitzmann and Weinhardt (2018) organise the literature; they measure no local readiness.", "Baldwin e Ford (1988), Burke e Hutchins (2007), Aguinis e Kraiger (2009), Grossman e Salas (2011), Salas et al. (2012) dhe Sitzmann e Weinhardt (2018) e organizojnë literaturën; nuk masin asnjë gatishmëri lokale.", "Baldwin und Ford (1988), Burke und Hutchins (2007), Aguinis und Kraiger (2009), Grossman und Salas (2011), Salas et al. (2012) und Sitzmann und Weinhardt (2018) ordnen die Literatur; sie messen keine örtliche Bereitschaft.") },
          { h: x("Meta-analyses", "Meta-analizat", "Metaanalysen"), p: x("Arthur et al. (2003): d = 0.60, 0.63, 0.62, 0.62 for reaction, learning, behaviour, results (k = 15, 234, 122, 26). Taylor et al. (2005): 117 studies. Keith and Frese (2008): 24 studies, 2,183 participants, d = 0.44, 0.56, 0.80. Blume et al. (2010): 89 studies.", "Arthur et al. (2003): d = 0,60, 0,63, 0,62, 0,62 për reagimin, të mësuarit, sjelljen, rezultatet (k = 15, 234, 122, 26). Taylor et al. (2005): 117 studime. Keith e Frese (2008): 24 studime, 2.183 pjesëmarrës, d = 0,44, 0,56, 0,80. Blume et al. (2010): 89 studime.", "Arthur et al. (2003): d = 0,60, 0,63, 0,62, 0,62 für Reaktion, Lernen, Verhalten, Ergebnisse (k = 15, 234, 122, 26). Taylor et al. (2005): 117 Studien. Keith und Frese (2008): 24 Studien, 2.183 Teilnehmende, d = 0,44, 0,56, 0,80. Blume et al. (2010): 89 Studien.") },
          { h: x("Charts", "Grafikët", "Diagramme"), p: x("Both charts draw published pooled estimates to scale; each value comes from a different outcome subset, so none is a readiness rate or a comparison of programmes.", "Të dy grafikët i vizatojnë në shkallë vlerësimet e bashkuara të botuara; çdo vlerë vjen nga një nëngrup tjetër rezultatesh, prandaj asnjëra nuk është normë gatishmërie apo krahasim programesh.", "Beide Diagramme zeichnen veröffentlichte gepoolte Schätzungen maßstäblich; jeder Wert stammt aus einer anderen Ergebnisuntergruppe, keiner ist eine Bereitschaftsquote oder ein Programmvergleich.") },
          { h: x("Documented context", "Konteksti i dokumentuar", "Dokumentierter Kontext"), p: x("One early hotel training night limited by a system update, and the author's Front Desk Control reference; no before-and-after skill level and no measured effect of the tool.", "Një natë e hershme trajnimi në hotel e kufizuar nga një përditësim sistemi, dhe referenca Front Desk Control e autorit; asnjë nivel aftësie para dhe pas dhe asnjë efekt i matur i mjetit.", "Eine frühe Hoteltrainingsnacht, durch ein Systemupdate begrenzt, und die Front-Desk-Control-Referenz des Autors; kein Vorher-Nachher-Niveau und keine gemessene Wirkung des Werkzeugs.") },
        ] },
        { type: "p", text: x(
          "The Operational Readiness Card, the practice ladder and the readiness pilot are editorial proposals for local assessment; they are not validated tests or employer-issued certifications and must not bypass training authority. No personnel, guest, payment or confidential system details are published. Editorial standard: a review, a meta-analysis, a documented context and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Karta e gatishmërisë operacionale, shkalla e praktikës dhe piloti i gatishmërisë janë propozime editoriale për vlerësim lokal; nuk janë teste të vërtetuara apo certifikime të lëshuara nga punëdhënësi dhe nuk duhet ta anashkalojnë autoritetin e trajnimit. Nuk publikohet asnjë detaj personeli, mysafiri, pagese apo sistemi konfidencial. Standardi editorial: një rishikim, një meta-analizë, një kontekst i dokumentuar dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die Bereitschaftskarte, die Übungsleiter und der Bereitschaftspilot sind redaktionelle Vorschläge für die örtliche Prüfung; sie sind keine validierten Tests und keine vom Arbeitgeber ausgestellten Zertifizierungen und dürfen die Trainingsautorität nicht umgehen. Keine Personal-, Gäste-, Zahlungs- oder vertraulichen Systemdetails werden veröffentlicht. Redaktioneller Standard: Eine Übersicht, eine Metaanalyse, ein dokumentierter Kontext und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited at its DOI on the next page; the ten records, their journals, volumes and years were checked against the publishers' metadata.",
        "Çdo burim citohet me DOI-n e vet në faqen tjetër; dhjetë regjistrimet, revistat, vëllimet dhe vitet e tyre u kontrolluan kundrejt metadata-ve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI zitiert; die zehn Einträge, ihre Zeitschriften, Bände und Jahre wurden an den Metadaten der Verlage geprüft."),
      source: ["baldwin-ford-1988", "arthur-2003", "taylor-russ-eft-chan-2005", "burke-hutchins-2007", "keith-frese-2008", "aguinis-kraiger-2009", "blume-2010", "grossman-salas-2011", "salas-2012", "sitzmann-weinhardt-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
