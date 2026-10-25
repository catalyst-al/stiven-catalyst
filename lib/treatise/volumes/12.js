// Operational treatise, Volume 12: The interruption tax, how fragmented attention creates hidden operational risk.
// Block: Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the
// interruption and resumption literature: Altmann & Trafton 2002, Trafton et al. 2003, Adamczyk & Bailey 2004,
// Bailey & Konstan 2006, Monk, Trafton & Boehm-Davis 2008, Mark, Gudith & Klocke 2008, Grundgeiger & Sanderson
// 2009, Leroy 2009, Westbrook et al. 2010, Adler & Benbunan-Fich 2012 and Brumby et al. 2013, each checked at its
// DOI. Six chapters in the three layers, as in the author's PDF; Chapter V, which in the PDF ends without a protocol,
// gets one. The site draws the PDF's 8:00 / 4:40 example as a flagged synthetic chart and Westbrook's published
// error rates by number of interruptions as a sourced one; the PDF's conceptual bars (baseline, variable, risk)
// become rows, since they carry no values. Every study count describes published research; nothing is measured in
// the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 12,
  numeral: "XII",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The interruption tax:", "Taksa e ndërprerjes:", "Die Unterbrechungssteuer:"), x("how fragmented attention creates hidden operational risk", "si vëmendja e copëzuar krijon rrezik operacional të fshehur", "wie zersplitterte Aufmerksamkeit verborgenes Betriebsrisiko erzeugt")],
  sub: x(
    "Six chapters on suspended goals, urgency, competing signals, strain and safe recovery.",
    "Gjashtë kapituj për qëllimet e pezulluara, urgjencën, sinjalet që konkurrojnë, ngarkesën dhe rikthimin e sigurt.",
    "Sechs Kapitel über unterbrochene Ziele, Dringlichkeit, konkurrierende Signale, Belastung und sichere Rückkehr."),
  seo: x(
    "The interruption tax, an operational treatise: six chapters on losing your place, from Altmann, Trafton and Mark to the Resume Point Card.",
    "Taksa e ndërprerjes, traktat operacional: gjashtë kapituj për humbjen e vendit në punë, nga Altmann, Trafton e Mark te Karta e pikës së rikthimit.",
    "Die Unterbrechungssteuer, operativer Traktat: sechs Kapitel darüber, wie man den Faden verliert, von Altmann, Trafton und Mark zur Wiedereinstiegskarte."),
  feature: x(
    "Volume 12 asks what an interruption costs after it ends. Its six chapters move from a report paused before completion, a question that stays open, a channel where everything sounds important, a screen with many routes and a busy shift that looks productive, to Altmann and Trafton, Monk, Adamczyk and Bailey, Leroy, Mark, Westbrook and Brumby, and end with a controlled return-to-work cycle, the Resume Point Card and a closing essay on the human cost of seamless service.",
    "Vëllimi 12 pyet sa kushton një ndërprerje pasi mbaron. Gjashtë kapitujt e tij shkojnë nga një raport i ndalur para përfundimit, një pyetje që mbetet e hapur, një kanal ku gjithçka tingëllon e rëndësishme, një ekran me shumë rrugë dhe një turn i ngarkuar që duket produktiv, te Altmann e Trafton, Monk, Adamczyk e Bailey, Leroy, Mark, Westbrook dhe Brumby, dhe mbyllen me një cikël të kontrolluar rikthimi në punë, Kartën e pikës së rikthimit dhe një ese mbyllëse për koston njerëzore të shërbimit pa ndërprerje.",
    "Band 12 fragt, was eine Unterbrechung kostet, nachdem sie vorbei ist. Seine sechs Kapitel führen von einem Bericht, der vor dem Abschluss stockt, einer Frage, die offen bleibt, einem Kanal, in dem alles wichtig klingt, einem Bildschirm mit vielen Touren und einer vollen Schicht, die produktiv aussieht, zu Altmann und Trafton, Monk, Adamczyk und Bailey, Leroy, Mark, Westbrook und Brumby, und enden mit einem kontrollierten Rückkehrzyklus, der Wiedereinstiegskarte und einem Schlussessay über die menschlichen Kosten nahtlosen Service."),
  figure: { n: "3", by: x("Monk, Trafton and Boehm-Davis 2008, experiment count", "Monk, Trafton e Boehm-Davis 2008, numri i eksperimenteve", "Monk, Trafton und Boehm-Davis 2008, Zahl der Experimente"), t: x(
    "controlled experiments tested how interruption duration and cognitive demand affect the time needed to resume a suspended task.",
    "eksperimente të kontrolluara provuan si ndikojnë kohëzgjatja dhe kërkesa mendore e ndërprerjes në kohën që duhet për t'u rikthyer te një detyrë e pezulluar.",
    "kontrollierte Experimente prüften, wie Dauer und geistige Anforderung einer Unterbrechung die Zeit beeinflussen, eine unterbrochene Aufgabe wieder aufzunehmen.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A report paused before completion", "Një raport i ndalur para përfundimit", "Ein Bericht, der vor dem Abschluss stockt") },
    { page: "v-model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("A transparent interruption calculation", "Një llogaritje e hapur e ndërprerjes", "Eine offene Unterbrechungsrechnung") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Resume Point Card", "Karta e pikës së rikthimit", "Die Wiedereinstiegskarte") },
  ],
  contract: [
    { h: x("Notice the break", "Vëre ndërprerjen", "Den Bruch bemerken"), p: x("Identify what must stop and what must continue.", "Dallo çfarë duhet të ndalojë dhe çfarë duhet të vazhdojë.", "Erkennen, was anhalten muss und was weiterlaufen muss.") },
    { h: x("Preserve the state", "Ruaje gjendjen", "Den Stand sichern"), p: x("Make the unfinished step recoverable.", "Bëje hapin e papërfunduar të rikuperueshëm.", "Den unerledigten Schritt wiederauffindbar machen.") },
    { h: x("Verify the return", "Verifiko rikthimin", "Die Rückkehr prüfen"), p: x("Re-enter work by checking, not guessing.", "Rikthehu në punë duke kontrolluar, jo duke hamendësuar.", "Durch Prüfen zurückkehren, nicht durch Raten.") },
  ],
  sources: ["altmann-trafton-2002", "trafton-2003", "adamczyk-bailey-2004", "bailey-konstan-2006", "monk-trafton-boehm-davis-2008", "mark-gudith-klocke-2008", "grundgeiger-sanderson-2009", "leroy-2009", "westbrook-2010", "adler-benbunan-fich-2012", "brumby-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The work left", "Puna e lënë", "Die Arbeit,"), x("half-finished", "përgjysmë", "halb erledigt")],
      why: x(
        "An interruption ends when the new request is handled. Its operational consequences may last longer.",
        "Një ndërprerje mbaron kur trajtohet kërkesa e re. Pasojat e saj operacionale mund të zgjasin më shumë.",
        "Eine Unterbrechung endet, wenn die neue Anfrage erledigt ist. Ihre betrieblichen Folgen können länger dauern."),
      body: x(
        "A shift can look fully staffed and still leave a worker without enough uninterrupted attention to complete a critical task. A call arrives while a record is being prepared. A second issue appears before the first is closed. The employee returns to the original screen and has to reconstruct which part was already verified. Nothing spectacular has happened; the operating design has quietly demanded another mental transition. Attention is not interchangeable with time on a staffing plan. Two tasks may fit into an hour on paper but interact badly when each requires a chain of decisions. The cost may appear as a delay in resuming, an unnecessary recheck, increased effort or a mistake. Yet interruptions can also be vital: a safety warning, an urgent guest concern or an exception that needs a rapid response cannot always wait for a convenient moment. This volume studies the distinction, with cognitive models of suspended goals, experiments on timing and resumption, research on strain and observation from healthcare, each used only for what its method supports. The author's work has included last-mile coordination, multiple operational signals and night-audit procedures; these give realistic settings, not a verified record of each scene, and every composite situation is labelled hypothetical. The purpose is not an interruption-free workplace. It is work that tells urgency from noise, protects the next necessary action and makes a safe return to an unfinished task possible.",
        "Një turn mund të duket me staf të plotë dhe prapë ta lërë një punonjës pa vëmendjen e pandërprerë që i duhet për një detyrë kritike. Vjen një telefonatë ndërsa po përgatitet një regjistrim. Shfaqet një çështje e dytë para se të mbyllet e para. Punonjësi kthehet te ekrani fillestar dhe duhet të rindërtojë cila pjesë ishte verifikuar tashmë. Nuk ka ndodhur asgjë spektakolare; projektimi operativ ka kërkuar në heshtje edhe një kalim mendor. Vëmendja nuk është e njëjta gjë me kohën në një plan stafi. Dy detyra mund të hyjnë në një orë në letër, por të ndikojnë keq te njëra-tjetra kur secila kërkon një zinxhir vendimesh. Kostoja mund të dalë si vonesë në rikthim, rikontroll i panevojshëm, mundim më i madh ose gabim. Megjithatë ndërprerjet mund të jenë edhe jetike: një paralajmërim sigurie, një shqetësim urgjent i një mysafiri ose një përjashtim që kërkon përgjigje të shpejtë nuk presin dot gjithmonë çastin e përshtatshëm. Ky vëllim e studion këtë dallim, me modele konjitive të qëllimeve të pezulluara, eksperimente për kohën e ndërprerjes dhe rikthimin, kërkim për ngarkesën dhe vëzhgime nga shëndetësia, secili i përdorur vetëm për atë që mbështet metoda e tij. Puna e autorit ka përfshirë koordinimin e miljes së fundit, sinjale të shumta operacionale dhe procedurat e auditit të natës; ato japin mjedise realiste, jo një regjistër të verifikuar për çdo skenë, dhe çdo situatë e përbërë shënohet si hipotetike. Qëllimi nuk është një vend pune pa ndërprerje. Është një punë që e dallon urgjencën nga zhurma, e mbron veprimin e radhës të nevojshëm dhe e bën të mundur një rikthim të sigurt te detyra e papërfunduar.",
        "Eine Schicht kann voll besetzt aussehen und einer Person trotzdem nicht genug ungestörte Aufmerksamkeit für eine kritische Aufgabe lassen. Ein Anruf kommt, während ein Datensatz vorbereitet wird. Ein zweites Thema taucht auf, bevor das erste geschlossen ist. Die Person kehrt zum ersten Bildschirm zurück und muss rekonstruieren, welcher Teil schon geprüft war. Nichts Spektakuläres ist geschehen; das Betriebsdesign hat still einen weiteren geistigen Wechsel verlangt. Aufmerksamkeit ist nicht dasselbe wie Zeit im Personalplan. Zwei Aufgaben passen auf dem Papier in eine Stunde, stören sich aber, wenn jede eine Kette von Entscheidungen verlangt. Die Kosten zeigen sich als verzögerte Wiederaufnahme, unnötige Nachprüfung, mehr Anstrengung oder ein Fehler. Doch Unterbrechungen können auch lebenswichtig sein: Eine Sicherheitswarnung, ein dringendes Gästeanliegen oder eine Ausnahme, die schnelle Antwort braucht, können nicht immer auf einen günstigen Moment warten. Dieser Band untersucht den Unterschied, mit kognitiven Modellen unterbrochener Ziele, Experimenten zu Zeitpunkt und Wiederaufnahme, Forschung zur Belastung und Beobachtung aus dem Gesundheitswesen, jedes nur für das genutzt, was seine Methode trägt. Die Arbeit des Autors umfasste Last-Mile-Koordination, viele betriebliche Signale und Nachtaudit-Abläufe; sie liefern realistische Umfelder, keinen geprüften Nachweis jeder Szene, und jede zusammengesetzte Situation ist als hypothetisch gekennzeichnet. Ziel ist kein Arbeitsplatz ohne Unterbrechungen. Ziel ist Arbeit, die Dringlichkeit von Lärm unterscheidet, die nächste nötige Handlung schützt und eine sichere Rückkehr zur unerledigten Aufgabe möglich macht."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research map", "Harta e kërkimit", "Forschungskarte"),
      title: [x("A mechanism,", "Një mekanizëm,", "Ein Mechanismus,"), x("not a universal penalty", "jo një gjobë universale", "keine universelle Strafe")],
      lead: x(
        "A careful study of interruptions cannot begin with a popular claim about lost minutes.",
        "Studimi i kujdesshëm i ndërprerjeve nuk nis me një pohim popullor për minuta të humbura.",
        "Wer Unterbrechungen sorgfältig untersucht, beginnt nicht mit populären Zahlen über verlorene Minuten."),
      blocks: [
        { type: "p", text: x(
          "Research distinguishes the interruption itself from the time and mental effort needed to resume the original activity. Effects depend on duration, demand, complexity, timing, available cues and the consequence of an error: some findings show slower return or more mistakes, others faster completion with higher stress. We use three kinds of evidence. Cognitive experiments test mechanisms under controlled conditions; field observations examine particular workplaces; design proposals turn mechanisms into hypotheses to evaluate locally. A controlled task may justify measuring a similar phenomenon, never supply a ready-made correction factor for night audit or dispatch. Of every figure, ask what was measured, where, with whom, and what remains uncertain. No rule such as interruptions times twenty minutes appears here; the one numerical exercise is invented and labelled.",
              "Kërkimi e dallon vetë ndërprerjen nga koha dhe mundimi mendor që duhen për t'u rikthyer te veprimtaria fillestare. Efektet varen nga kohëzgjatja, kërkesa, ndërlikimi, çasti, shenjat e disponueshme dhe pasoja e një gabimi: disa gjetje tregojnë rikthim më të ngadaltë ose më shumë gabime, të tjera përfundim më të shpejtë me stres më të lartë. Përdorim tri lloje provash. Eksperimentet konjitive provojnë mekanizma në kushte të kontrolluara; vëzhgimet në terren shqyrtojnë vende pune të caktuara; propozimet e projektimit i kthejnë mekanizmat në hipoteza për t'u vlerësuar në vend. Një detyrë e kontrolluar mund të justifikojë matjen e një dukurie të ngjashme, kurrë një faktor korrigjimi të gatshëm për auditin e natës apo dispeçerimin. Për çdo shifër, pyet çfarë u mat, ku, me kë dhe çfarë mbetet e pasigurt. Këtu nuk ka asnjë rregull si ndërprerje herë njëzet minuta; ushtrimi i vetëm numerik është i shpikur dhe i shënuar.",
              "Die Forschung unterscheidet die Unterbrechung selbst von der Zeit und geistigen Mühe, die ursprüngliche Tätigkeit wieder aufzunehmen. Die Wirkungen hängen von Dauer, Anforderung, Komplexität, Zeitpunkt, verfügbaren Hinweisen und Fehlerfolgen ab: Manche Befunde zeigen langsamere Rückkehr oder mehr Fehler, andere schnellere Erledigung bei höherem Stress. Experimente prüfen Mechanismen kontrolliert, Feldbeobachtungen bestimmte Arbeitsplätze, Gestaltungsvorschläge sind örtlich zu prüfende Hypothesen. Ein Laborbefund rechtfertigt Messung, keinen fertigen Korrekturfaktor für Nachtaudit oder Disposition. Bei jeder Zahl fragen: Was wurde gemessen, wo, mit wem, und was bleibt unsicher? Die einzige Zahlenübung hier ist erfunden und gekennzeichnet.") },
        { type: "cards", cols: 3, items: [
          { h: x("Lab · mechanism", "Laborator · mekanizëm", "Labor · Mechanismus"), p: x("Goal retrieval, timing, re-entry delay and accuracy.", "Rikujtimi i qëllimit, çasti, vonesa e rihyrjes dhe saktësia.", "Zielabruf, Zeitpunkt, Wiedereinstiegszeit und Genauigkeit.") },
          { h: x("Field · context", "Terren · kontekst", "Feld · Kontext"), p: x("Observed work, strain and the conditions that change consequences.", "Puna e vëzhguar, ngarkesa dhe kushtet që ndryshojnë pasojat.", "Beobachtete Arbeit, Belastung, Bedingungen der Folgen.") },
          { h: x("Design · hypothesis", "Projektim · hipotezë", "Gestaltung · Hypothese"), p: x("Small process changes evaluated with outcome and safety checks.", "Ndryshime të vogla procesi, të vlerësuara me kontrolle rezultati dhe sigurie.", "Kleine Änderungen, geprüft an Ergebnis und Sicherheit.") },
        ] },
        { type: "rows", compact: true, items: [
          { h: x("Can be tested", "Mund të provohet", "Prüfbar"), p: x("Time to resume, next-step accuracy, unresolved work, reported strain.", "Koha e rikthimit, saktësia e hapit të radhës, puna e pazgjidhur, ngarkesa.", "Wiederaufnahmezeit, Genauigkeit des nächsten Schritts, offene Arbeit, Belastung.") },
          { h: x("Cannot be assumed", "Nuk mund të supozohet", "Nicht annehmbar"), p: x("A universal interruption cost, or a causal effect in the author's workplaces.", "Një kosto universale e ndërprerjes, apo një efekt shkakësor në vendet e punës të autorit.", "Universelle Kosten oder Kausalwirkung an den Arbeitsplätzen des Autors.") },
          { h: x("Must be protected", "Duhet mbrojtur", "Zu schützen"), p: x("Safety obligations, confidentiality, authorised escalation and customer service.", "Detyrimet e sigurisë, konfidencialiteti, eskalimi i autorizuar dhe shërbimi ndaj klientit.", "Sicherheit, Vertraulichkeit, befugte Eskalation, Service.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The most useful unit of analysis is not the notification. It is the interrupted task and the quality of the return.",
          "Njësia më e dobishme e analizës nuk është njoftimi. Është detyra e ndërprerë dhe cilësia e rikthimit.",
          "Die nützlichste Einheit ist nicht die Meldung, sondern die unterbrochene Aufgabe und die Qualität der Rückkehr.") },
      ],
      note: x(
        "Research orientation: Altmann and Trafton (2002); Trafton et al. (2003); Monk et al. (2008); Mark et al. (2008). Applications are editorial.",
        "Orientimi i kërkimit: Altmann e Trafton (2002); Trafton et al. (2003); Monk et al. (2008); Mark et al. (2008). Zbatimet janë editoriale.",
        "Forschungsgrundlage: Altmann und Trafton (2002); Trafton et al. (2003); Monk et al. (2008); Mark et al. (2008). Die Anwendungen sind redaktionell."),
      source: ["altmann-trafton-2002", "trafton-2003", "monk-trafton-boehm-davis-2008", "mark-gudith-klocke-2008"],
    },

    // Chapter I. The task left half-finished
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The task left half-finished", "Detyra e lënë përgjysmë", "Die halb erledigte Aufgabe"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "what-a-night-auditor-learns",
          title: [x("A report paused", "Një raport i ndalur", "Ein Bericht, der"), x("before completion", "para përfundimit", "vor dem Abschluss stockt")],
          lead: x(
            "The desk may be quiet again while the interrupted task remains cognitively unfinished.",
            "Banaku mund të jetë sërish i qetë, ndërsa detyra e ndërprerë mbetet e papërfunduar në mendje.",
            "Der Tresen kann wieder ruhig sein, während die unterbrochene Aufgabe im Kopf unerledigt bleibt."),
          blocks: [
            { type: "flag", text: x("Hypothetical hotel scene, not a documented personal incident", "Skenë hipotetike hoteli, jo ngjarje personale e dokumentuar", "Hypothetische Hotelszene, kein dokumentierter persönlicher Vorfall") },
            { type: "p", text: x(
              "A night employee is compiling a routine report. Several figures have been checked; one comparison still needs attention. Before the next step, a guest asks for help. The employee stops, listens, clarifies the request and handles it within the authorised scope of the role. The interaction ends without drama. Back at the workstation, the report is still open. The screen shows numbers, but not the state of the employee's thinking. Was the last line already verified? Was a discrepancy cleared, or merely noted for follow-up? The cursor cannot answer. The worker re-reads an earlier section to rebuild context; in a rushed environment they might skip the recheck. Neither outcome can be inferred from the final timestamp of the report. The interruption may have been fully justified: a real guest cannot always wait until the next report line. The design question is not whether the employee should have ignored the guest. It is whether the work environment supported a reliable return to the interrupted task afterward.",
              "Një punonjës nate po përpilon një raport rutinë. Disa shifra janë kontrolluar; një krahasim ka ende nevojë për vëmendje. Para hapit tjetër, një mysafir kërkon ndihmë. Punonjësi ndalet, dëgjon, e sqaron kërkesën dhe e trajton brenda kufijve të autorizuar të rolit. Biseda mbaron pa drama. Kur kthehet te vendi i punës, raporti është ende i hapur. Ekrani tregon numra, por jo gjendjen e mendimit të punonjësit. A ishte verifikuar rreshti i fundit? A u sqarua një mospërputhje, apo thjesht u shënua për ndjekje? Kursori nuk përgjigjet dot. Punonjësi e rilexon një pjesë të mëparshme për të rindërtuar kontekstin; në një mjedis me nxitim mund ta kapërcejë rikontrollin. Asnjëri rezultat nuk nxirret dot nga vula përfundimtare e kohës së raportit. Ndërprerja mund të ketë qenë plotësisht e justifikuar: një mysafir i vërtetë nuk pret dot gjithmonë deri te rreshti tjetër i raportit. Pyetja e projektimit nuk është nëse punonjësi duhej ta shpërfillte mysafirin. Është nëse mjedisi i punës e mbështeti pas kësaj një rikthim të besueshëm te detyra e ndërprerë.",
              "Ein Nachtmitarbeiter erstellt einen Routinebericht. Mehrere Zahlen sind geprüft; ein Vergleich braucht noch Aufmerksamkeit. Vor dem nächsten Schritt bittet ein Gast um Hilfe. Der Mitarbeiter hält inne, hört zu, klärt das Anliegen und erledigt es im befugten Rahmen seiner Rolle. Das Gespräch endet ohne Drama. Zurück am Arbeitsplatz ist der Bericht noch offen. Der Bildschirm zeigt Zahlen, aber nicht den Stand seiner Gedanken. War die letzte Zeile schon geprüft? Wurde eine Abweichung geklärt oder nur zur Nachverfolgung notiert? Der Cursor kann es nicht sagen. Er liest einen früheren Abschnitt erneut, um den Zusammenhang aufzubauen; unter Zeitdruck überspringt er die Nachprüfung vielleicht. Keiner der beiden Ausgänge lässt sich aus dem letzten Zeitstempel des Berichts ablesen. Die Unterbrechung kann völlig berechtigt gewesen sein: Ein echter Gast kann nicht immer bis zur nächsten Berichtszeile warten. Die Gestaltungsfrage ist nicht, ob der Mitarbeiter den Gast hätte ignorieren sollen. Sie lautet, ob das Arbeitsumfeld danach eine verlässliche Rückkehr zur unterbrochenen Aufgabe unterstützte.") },
            { type: "p", text: x(
              "This scene is constructed. The author's hotel experience includes night-audit reports, operational handovers and guest-facing work, but no verified event record supports this exact interruption or its outcome. The point is structural: formal systems preserve data more reliably than they preserve a person's place in an unfolding line of reasoning.",
              "Kjo skenë është e ndërtuar. Përvoja e autorit në hotel përfshin raportet e auditit të natës, dorëzimet operacionale dhe punën me mysafirët, por asnjë regjistër i verifikuar ngjarjesh nuk e mbështet këtë ndërprerje të saktë apo rezultatin e saj. Pika është strukturore: sistemet formale i ruajnë të dhënat më mirë se sa e ruajnë vendin e një personi në një arsyetim që po shpaloset.",
              "Diese Szene ist konstruiert. Die Hotelerfahrung des Autors umfasst Nachtauditberichte, betriebliche Übergaben und Gästekontakt, doch kein geprüfter Ereignisnachweis stützt genau diese Unterbrechung oder ihren Ausgang. Der Punkt ist strukturell: Formale Systeme bewahren Daten zuverlässiger als die Stelle, an der ein Mensch in einem laufenden Gedankengang steht.") },
            { type: "callout", reading: true, text: x(
              "The work is not complete merely because the interruption has ended. There is still an unfinished goal to recover.",
              "Puna nuk është e përfunduar vetëm sepse ndërprerja mbaroi. Ka ende një qëllim të papërfunduar për t'u rikuperuar.",
              "Die Arbeit ist nicht erledigt, nur weil die Unterbrechung vorbei ist. Es bleibt ein unerledigtes Ziel zurückzugewinnen.") },
          ],
          note: x(
            "Scene constructed for analysis; source concepts from Altmann and Trafton (2002) and Trafton et al. (2003). No hotel control instructions are disclosed. The essay named below is about what a night auditor learns.",
            "Skenë e ndërtuar për analizë; konceptet nga Altmann e Trafton (2002) dhe Trafton et al. (2003). Nuk zbulohet asnjë udhëzim kontrolli i hotelit. Eseja e emërtuar më poshtë flet për atë që mëson një auditor nate.",
            "Für die Analyse konstruierte Szene; Begriffe nach Altmann und Trafton (2002) und Trafton et al. (2003). Keine Kontrollanweisungen des Hotels werden offengelegt. Der unten genannte Essay handelt davon, was ein Nachtauditor lernt."),
          source: ["altmann-trafton-2002", "trafton-2003"],
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("Four moments", "Katër çaste", "Vier Momente"), x("in one interruption", "në një ndërprerje", "in einer Unterbrechung")],
          lead: x(
            "A single event contains at least two transitions, and both are part of the work.",
            "Një ngjarje e vetme përmban të paktën dy kalime, dhe të dyja janë pjesë e punës.",
            "Ein einzelnes Ereignis enthält mindestens zwei Übergänge, und beide gehören zur Arbeit."),
          blocks: [
            { type: "p", text: x(
              "An interruption can be analysed as a sequence rather than a single distraction. The person works on a primary task with an active goal. An event calls for attention and may create a short warning interval. The person performs the interrupting task. Then they try to reconstruct and resume the suspended activity. These periods differ and need not be equally costly. Trafton and colleagues (2003) investigated whether a brief opportunity to prepare before an interruption could improve later resumption; their laboratory work supports the idea that an unfinished intention can be encoded for return, although the benefit depends on conditions. Altmann and Trafton's (2002) model describes how pending goals remain accessible or become harder to retrieve. In operations the most visible part of the interruption may be the shortest. A quick call can finish promptly while the original task still needs several checks to regain context; if the task was at a natural breakpoint, the return may be straightforward. Managers can make this structure visible without recording private calls or tracking individuals: at process level it may be enough to note the interruption type, whether a task was left incomplete and what verification the return required.",
              "Një ndërprerje mund të analizohet si radhë, jo si një shpërqendrim i vetëm. Personi punon në një detyrë kryesore me një qëllim aktiv. Një ngjarje kërkon vëmendje dhe mund të krijojë një interval të shkurtër paralajmërimi. Personi kryen detyrën që ndërpret. Pastaj përpiqet ta rindërtojë dhe ta rifillojë veprimtarinë e pezulluar. Këto periudha ndryshojnë dhe nuk kanë pse të kushtojnë njësoj. Trafton dhe kolegët (2003) hetuan nëse një mundësi e shkurtër për t'u përgatitur para ndërprerjes mund ta përmirësonte rikthimin e mëvonshëm; puna e tyre laboratorike e mbështet idenë se një synim i papërfunduar mund të kodohet për rikthim, megjithëse përfitimi varet nga kushtet. Modeli i Altmann-it dhe Trafton-it (2002) përshkruan si qëllimet në pritje mbeten të arritshme ose bëhen më të vështira për t'u rikujtuar. Në operacione, pjesa më e dukshme e ndërprerjes mund të jetë më e shkurtra. Një telefonatë e shpejtë mund të mbarojë menjëherë, ndërsa detyra fillestare kërkon ende disa kontrolle për ta rifituar kontekstin; nëse detyra ishte në një pikë natyrore ndalimi, rikthimi mund të jetë i thjeshtë. Menaxherët mund ta bëjnë të dukshme këtë strukturë pa regjistruar telefonata private apo pa ndjekur individë: në nivel procesi mund të mjaftojë të shënohet lloji i ndërprerjes, nëse një detyrë mbeti e papërfunduar dhe çfarë verifikimi kërkoi rikthimi.",
              "Eine Unterbrechung lässt sich als Abfolge analysieren statt als einzelne Ablenkung. Die Person arbeitet an einer Hauptaufgabe mit aktivem Ziel. Ein Ereignis verlangt Aufmerksamkeit und kann ein kurzes Warnintervall schaffen. Die Person erledigt die unterbrechende Aufgabe. Dann versucht sie, die ruhende Tätigkeit zu rekonstruieren und fortzusetzen. Diese Phasen unterscheiden sich und müssen nicht gleich teuer sein. Trafton und Kollegen (2003) untersuchten, ob eine kurze Gelegenheit zur Vorbereitung vor einer Unterbrechung die spätere Wiederaufnahme verbessert; ihre Laborarbeit stützt die Idee, dass eine unerledigte Absicht für die Rückkehr kodiert werden kann, wobei der Nutzen von den Bedingungen abhängt. Das Modell von Altmann und Trafton (2002) beschreibt, wie anstehende Ziele zugänglich bleiben oder schwerer abrufbar werden. Im Betrieb ist der sichtbarste Teil der Unterbrechung womöglich der kürzeste. Ein kurzer Anruf endet schnell, während die ursprüngliche Aufgabe noch mehrere Prüfungen braucht, um den Zusammenhang wiederzugewinnen; lag die Aufgabe an einem natürlichen Haltepunkt, ist die Rückkehr womöglich einfach. Führungskräfte können diese Struktur sichtbar machen, ohne private Anrufe aufzuzeichnen oder Einzelne zu verfolgen: Auf Prozessebene genügt es vielleicht, die Art der Unterbrechung festzuhalten, ob eine Aufgabe offen blieb und welche Prüfung die Rückkehr verlangte.") },
            { type: "chain", items: [
              { h: x("Primary", "Kryesorja", "Hauptaufgabe"), p: x("Working goal.", "Qëllimi i punës.", "Arbeitsziel.") },
              { h: x("Trigger", "Shkaktari", "Auslöser"), p: x("Alert or request.", "Sinjal ose kërkesë.", "Signal oder Anfrage.") },
              { h: x("Secondary", "Dytësorja", "Nebenaufgabe"), p: x("New demand.", "Kërkesë e re.", "Neue Anforderung.") },
              { h: x("Resume", "Rikthimi", "Wiederaufnahme"), p: x("Rebuild context.", "Rindërto kontekstin.", "Zusammenhang aufbauen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Resumption lag is conceptually separate from the time spent handling the interrupting request.",
              "Vonesa e rikthimit është konceptualisht e ndarë nga koha e harxhuar për kërkesën që ndërpret.",
              "Die Wiederaufnahmezeit ist begrifflich getrennt von der Zeit für die unterbrechende Anfrage.") },
          ],
          note: x(
            "Altmann and Trafton (2002), Cognitive Science 26(1); Trafton, Altmann, Brock and Mintz (2003). The diagram is an editorial simplification.",
            "Altmann e Trafton (2002), Cognitive Science 26(1); Trafton, Altmann, Brock e Mintz (2003). Diagrami është thjeshtim editorial.",
            "Altmann und Trafton (2002), Cognitive Science 26(1); Trafton, Altmann, Brock und Mintz (2003). Das Diagramm ist eine redaktionelle Vereinfachung."),
          source: ["altmann-trafton-2002", "trafton-2003"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Protect the return", "Mbro rikthimin", "Die Rückkehr schützen,"), x("without delaying urgency", "pa vonuar urgjencën", "ohne Dringendes aufzuhalten")],
          lead: x(
            "A small design intervention begins before the worker leaves a task, when circumstances allow.",
            "Një ndërhyrje e vogël projektimi nis para se punonjësi ta lërë detyrën, kur rrethanat e lejojnë.",
            "Ein kleiner Gestaltungseingriff beginnt, bevor die Person eine Aufgabe verlässt, wenn die Lage es erlaubt."),
          blocks: [
            { type: "steps", items: [
              { h: x("Classify the new demand", "Klasifiko kërkesën e re", "Die neue Anforderung einordnen"), p: x("Is there immediate safety or service risk? Follow authorised priority rules.", "A ka rrezik të menjëhershëm sigurie apo shërbimi? Ndiq rregullat e autorizuara të përparësisë.", "Besteht sofortiges Sicherheits- oder Servicerisiko? Befugte Prioritätsregeln befolgen.") },
              { h: x("Preserve the task state", "Ruaje gjendjen e detyrës", "Den Aufgabenstand sichern"), p: x("If safe and permitted, mark the current step or checklist state.", "Nëse është e sigurt dhe e lejuar, shëno hapin aktual ose gjendjen e listës së kontrollit.", "Wenn sicher und erlaubt, den aktuellen Schritt oder Checklistenstand markieren.") },
              { h: x("Name the next action", "Emërto veprimin e radhës", "Die nächste Handlung benennen"), p: x("A non-sensitive cue: which comparison or decision remains?", "Një shenjë jo e ndjeshme: cili krahasim apo vendim mbetet?", "Ein unsensibler Hinweis: Welcher Vergleich oder welche Entscheidung bleibt?") },
              { h: x("Handle the interruption", "Trajto ndërprerjen", "Die Unterbrechung erledigen"), p: x("Within the approved role; never through an informal bypass.", "Brenda rolit të miratuar; kurrë përmes një anashkalimi joformal.", "Im genehmigten Rahmen der Rolle; nie über eine informelle Umgehung.") },
              { h: x("Reopen at a known point", "Rihape në një pikë të njohur", "An bekannter Stelle fortsetzen"), p: x("Review the preserved status rather than trusting memory alone.", "Rishiko gjendjen e ruajtur, në vend që t'i besosh vetëm kujtesës.", "Den gesicherten Stand prüfen, statt nur dem Gedächtnis zu trauen.") },
              { h: x("Verify before closure", "Verifiko para mbylljes", "Vor dem Abschluss prüfen"), p: x("Confirm the next required step and who receives any open item.", "Konfirmo hapin e radhës të kërkuar dhe kush merr çdo pikë të hapur.", "Den nächsten nötigen Schritt bestätigen und wer offene Punkte erhält.") },
            ] },
            { type: "p", text: x(
              "A resume cue can be as modest as a stage in an approved checklist, never guest identities, account details or sensitive records in a personal note; when urgency is immediate, safety comes before a perfect bookmark. Test with routine, low-risk work first: can people name the next authorised step, and do omitted follow-ups become rarer? If the cue costs more than it saves or creates a second, conflicting record, revise it.",
              "Një shenjë rikthimi mund të jetë thjesht një fazë në një listë kontrolli të miratuar, kurrë identitete mysafirësh, të dhëna llogarish apo regjistra të ndjeshëm në një shënim personal; kur urgjenca është e menjëhershme, siguria vjen para një shënjuesi të përsosur. Provoje së pari me punë rutinë me rrezik të ulët: a e emërtojnë dot njerëzit hapin e radhës të autorizuar, dhe a bëhen më të rralla ndjekjet e harruara? Nëse shenja kushton më shumë se sa kursen ose krijon një regjistër të dytë që bie ndesh, rishikoje.",
              "Ein Wiedereinstiegshinweis kann so bescheiden sein wie eine Stufe in einer genehmigten Checkliste, nie Gästeidentitäten, Kontodaten oder sensible Daten in einer persönlichen Notiz; ist es sofort dringend, geht Sicherheit vor dem perfekten Lesezeichen. Zuerst mit risikoarmer Routinearbeit testen: Können Menschen den nächsten befugten Schritt benennen, und werden vergessene Nacharbeiten seltener? Kostet der Hinweis mehr, als er spart, oder schafft er einen zweiten, widersprüchlichen Datensatz, überarbeiten.") },
            { type: "callout", reading: true, text: x(
              "Protect the right to interrupt for important reasons. Improve the return, not the appearance of uninterrupted work.",
              "Mbroje të drejtën për të ndërprerë për arsye të rëndësishme. Përmirëso rikthimin, jo pamjen e punës pa ndërprerje.",
              "Das Recht auf wichtige Unterbrechungen schützen. Die Rückkehr verbessern, nicht den Anschein ungestörter Arbeit.") },
          ],
          note: x(
            "Original editorial protocol informed by Trafton et al. (2003) and Altmann and Trafton (2002); not a hotel or logistics SOP.",
            "Protokoll editorial origjinal i mbështetur te Trafton et al. (2003) dhe Altmann e Trafton (2002); jo SOP hoteli apo logjistike.",
            "Eigenes redaktionelles Protokoll nach Trafton et al. (2003) und Altmann und Trafton (2002); kein Hotel- oder Logistik-SOP."),
          source: ["trafton-2003", "altmann-trafton-2002"],
        },
      ],
    },

    // Chapter II. The science of resuming work
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The science of resuming work", "Shkenca e rikthimit në punë", "Die Wissenschaft der Wiederaufnahme"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "the-system-is-faster-than-you",
          title: [x("The question", "Pyetja", "Die Frage,"), x("that remains open", "që mbetet e hapur", "die offen bleibt")],
          lead: x(
            "An incomplete task can continue to occupy attention long after the worker has moved on.",
            "Një detyrë e papërfunduar mund ta zërë vëmendjen shumë kohë pasi punonjësi ka kaluar te tjetra.",
            "Eine unerledigte Aufgabe kann die Aufmerksamkeit binden, lange nachdem die Person weitergegangen ist."),
          blocks: [
            { type: "flag", text: x("Hypothetical office-operations scene, constructed", "Skenë hipotetike operacionesh zyre, e ndërtuar", "Hypothetische Büroszene, konstruiert") },
            { type: "p", text: x(
              "A coordinator is checking a sequence of work items and meets a status that needs clarification. A colleague asks an unrelated question. The coordinator answers but keeps thinking about the uncertain item, then returns to the dashboard. A third request has arrived in the meantime. They feel busy, yet can no longer say with confidence which case needed the next check. The situation contains more than one cost. There may be delay in reconstructing the suspended task. There may be mental residue from the unresolved question while the new request is handled. There may be a decision to review earlier actions again to avoid an error. Each can be sensible, depending on the risks of the process. The theoretical question is why a goal that was clear seconds earlier becomes harder to retrieve. It is not an accusation that the worker lacks attention. It is a question about the design of activities that repeatedly require people to suspend and rebuild goal states.",
              "Një koordinator po kontrollon një radhë njësish pune dhe has një status që kërkon sqarim. Një koleg bën një pyetje që s'ka lidhje. Koordinatori përgjigjet, por vazhdon të mendojë për njësinë e pasigurt, pastaj kthehet te paneli. Ndërkohë ka mbërritur një kërkesë e tretë. Ndihet i zënë, por nuk thotë dot më me siguri cili rast kërkonte kontrollin e radhës. Situata ka më shumë se një kosto. Mund të ketë vonesë në rindërtimin e detyrës së pezulluar. Mund të ketë mbetje mendore nga pyetja e pazgjidhur, ndërsa trajtohet kërkesa e re. Mund të ketë një vendim për t'i rishikuar veprimet e mëparshme që të shmanget një gabim. Secila mund të jetë e arsyeshme, sipas rreziqeve të procesit. Pyetja teorike është pse një qëllim që ishte i qartë pak sekonda më parë bëhet më i vështirë për t'u rikujtuar. Nuk është akuzë se punonjësit i mungon vëmendja. Është pyetje për projektimin e veprimtarive që u kërkojnë njerëzve vazhdimisht t'i pezullojnë dhe t'i rindërtojnë gjendjet e qëllimeve.",
              "Ein Koordinator prüft eine Folge von Vorgängen und stößt auf einen klärungsbedürftigen Status. Eine Kollegin stellt eine Frage, die nichts damit zu tun hat. Er antwortet, denkt aber weiter an den unsicheren Vorgang und kehrt dann zum Dashboard zurück. Inzwischen ist eine dritte Anfrage eingegangen. Er fühlt sich beschäftigt, kann aber nicht mehr sicher sagen, welcher Fall die nächste Prüfung brauchte. Die Lage enthält mehr als eine Art Kosten. Die ruhende Aufgabe zu rekonstruieren kann dauern. Von der ungelösten Frage kann ein geistiger Rest bleiben, während die neue Anfrage bearbeitet wird. Vielleicht wird entschieden, frühere Schritte erneut zu prüfen, um einen Fehler zu vermeiden. Jedes davon kann je nach Risiko des Prozesses sinnvoll sein. Die theoretische Frage ist, warum ein Ziel, das Sekunden zuvor klar war, schwerer abrufbar wird. Sie ist kein Vorwurf mangelnder Aufmerksamkeit. Sie ist eine Frage nach der Gestaltung von Tätigkeiten, die Menschen immer wieder zwingen, Ziele ruhen zu lassen und neu aufzubauen.") },
            { type: "p", text: x(
              "This is an illustration, not an account of a measured shift. Coordinating many vehicles from a distance creates the possibility of competing signals, but it does not establish how many interruptions a particular dispatcher meets or their effect on accuracy. There are no internal data in this scene.",
              "Ky është ilustrim, jo rrëfim i një turni të matur. Koordinimi i shumë automjeteve nga larg krijon mundësinë e sinjaleve që konkurrojnë, por nuk vërteton sa ndërprerje has një dispeçer i caktuar apo efektin e tyre te saktësia. Në këtë skenë nuk ka të dhëna të brendshme.",
              "Das ist eine Illustration, kein Bericht über eine gemessene Schicht. Viele Fahrzeuge aus der Ferne zu koordinieren schafft die Möglichkeit konkurrierender Signale, belegt aber nicht, wie viele Unterbrechungen ein bestimmter Disponent erlebt oder wie sie seine Genauigkeit beeinflussen. Diese Szene enthält keine internen Daten.") },
            { type: "callout", reading: true, text: x(
              "The workplace can be busy while the mental continuity needed for precise action keeps being broken.",
              "Vendi i punës mund të jetë i zënë, ndërsa vazhdimësia mendore që duhet për veprim të saktë thyhet vazhdimisht.",
              "Ein Arbeitsplatz kann voll ausgelastet sein, während die geistige Kontinuität für genaues Handeln immer wieder bricht.") },
          ],
          note: x(
            "Constructed narrative; Altmann and Trafton (2002) and Leroy (2009) provide the theoretical lenses. The essay named below is about what the systems in every shift know and what they were never told.",
            "Rrëfim i ndërtuar; Altmann e Trafton (2002) dhe Leroy (2009) japin lentet teorike. Eseja e emërtuar më poshtë flet për atë që sistemet e çdo turni e dinë dhe atë që nuk iu tha kurrë.",
            "Konstruierte Erzählung; Altmann und Trafton (2002) und Leroy (2009) liefern die theoretischen Linsen. Der unten genannte Essay handelt davon, was die Systeme jeder Schicht wissen und was ihnen nie gesagt wurde."),
          source: ["altmann-trafton-2002", "leroy-2009"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("The architecture", "Arkitektura", "Der Aufbau"), x("of a suspended goal", "e një qëllimi të pezulluar", "eines ruhenden Ziels")],
          lead: x(
            "A person does not resume work by returning to a screen alone; the relevant intention must become available again.",
            "Një person nuk rikthehet në punë vetëm duke u kthyer te ekrani; synimi përkatës duhet të bëhet sërish i arritshëm.",
            "Niemand nimmt die Arbeit allein dadurch wieder auf, dass er zum Bildschirm zurückkehrt; die passende Absicht muss wieder verfügbar werden."),
          blocks: [
            { type: "p", text: x(
              "Altmann and Trafton (2002) proposed an activation-based account of remembering goals. Their model uses memory activation and associative priming to explain how an intended next step becomes more or less accessible; it is a cognitive model tested through simulations of laboratory data, not a formula for minutes lost in a hotel. Two ideas are operationally useful. A suspended goal can weaken while the person attends to another demand. A meaningful cue can help retrieve the intended next action, but it must match the actual state of the work: an outdated or ambiguous marker can be worse than none, because it invites false confidence. Monk, Trafton and Boehm-Davis (2008) then reported three experiments with a hierarchical, interactive task: longer and more demanding interruptions led to longer resumption times, for durations up to a minute. The findings support the importance of both time away and what the competing task requires mentally. The lesson for managers is to stop treating an alert and the recovery after it as one event. If people must constantly switch between demanding tasks, the operating model should give them a safe way to preserve the original task's state. No amount of motivation makes working memory unlimited.",
              "Altmann dhe Trafton (2002) propozuan një shpjegim të kujtimit të qëllimeve të bazuar në aktivizim. Modeli i tyre përdor aktivizimin e kujtesës dhe nxitjen asociative për të shpjeguar si një hap i synuar bëhet më shumë ose më pak i arritshëm; është model konjitiv i provuar me simulime të të dhënave laboratorike, jo formulë për minutat e humbura në një hotel. Dy ide janë të dobishme operacionalisht. Një qëllim i pezulluar mund të dobësohet ndërsa personi merret me një kërkesë tjetër. Një shenjë kuptimplote mund të ndihmojë të rikujtohet veprimi i synuar, por duhet të përputhet me gjendjen e vërtetë të punës: një shënjues i vjetruar ose i paqartë mund të jetë më keq se asnjë, sepse fton siguri të rreme. Monk, Trafton dhe Boehm-Davis (2008) raportuan më pas tri eksperimente me një detyrë hierarkike dhe ndërvepruese: ndërprerjet më të gjata dhe më kërkuese çuan në kohë më të gjata rikthimi, për kohëzgjatje deri në një minutë. Gjetjet e mbështesin rëndësinë si të kohës larg, ashtu edhe të asaj që kërkon mendërisht detyra konkurruese. Mësimi për menaxherët është të mos e trajtojnë më një sinjal dhe rikuperimin pas tij si një ngjarje. Nëse njerëzit duhet të kalojnë vazhdimisht mes detyrash kërkuese, modeli operativ duhet t'u japë një mënyrë të sigurt për ta ruajtur gjendjen e detyrës fillestare. Asnjë motivim nuk e bën kujtesën e punës të pakufishme.",
              "Altmann und Trafton (2002) schlugen eine aktivierungsbasierte Erklärung des Erinnerns an Ziele vor. Ihr Modell erklärt mit Gedächtnisaktivierung und assoziativem Priming, wie ein beabsichtigter nächster Schritt mehr oder weniger zugänglich wird; es ist ein kognitives Modell, geprüft an Simulationen von Labordaten, keine Formel für verlorene Minuten im Hotel. Zwei Gedanken sind betrieblich nützlich. Ein ruhendes Ziel kann schwächer werden, während die Person sich einer anderen Anforderung widmet. Ein sinnvoller Hinweis kann helfen, die beabsichtigte Handlung abzurufen, muss aber dem tatsächlichen Stand der Arbeit entsprechen: Eine veraltete oder mehrdeutige Markierung kann schlechter sein als keine, weil sie falsche Sicherheit weckt. Monk, Trafton und Boehm-Davis (2008) berichteten dann drei Experimente mit einer hierarchischen, interaktiven Aufgabe: Längere und anspruchsvollere Unterbrechungen führten zu längeren Wiederaufnahmezeiten, bei Dauern bis zu einer Minute. Die Befunde stützen die Bedeutung sowohl der Zeit weg als auch dessen, was die konkurrierende Aufgabe geistig verlangt. Die Lehre für Führungskräfte: ein Signal und die Erholung danach nicht als ein Ereignis behandeln. Müssen Menschen ständig zwischen anspruchsvollen Aufgaben wechseln, sollte das Betriebsmodell ihnen einen sicheren Weg geben, den Stand der ursprünglichen Aufgabe zu sichern. Keine Motivation macht das Arbeitsgedächtnis unbegrenzt.") },
            { type: "cards", cols: 3, items: [
              { h: x("Goal · intention", "Qëllimi · synimi", "Ziel · Absicht"), p: x("What was the next step before work stopped?", "Cili ishte hapi i radhës para se të ndalonte puna?", "Was war der nächste Schritt, bevor die Arbeit stockte?") },
              { h: x("Cue · retrieval", "Shenja · rikujtimi", "Hinweis · Abruf"), p: x("What reliable sign helps the worker find that step?", "Cila shenjë e besueshme e ndihmon punonjësin ta gjejë atë hap?", "Welches verlässliche Zeichen hilft, diesen Schritt zu finden?") },
              { h: x("Check · confirm", "Kontrolli · konfirmimi", "Prüfen · bestätigen"), p: x("What must be verified before the work is marked complete?", "Çfarë duhet verifikuar para se puna të shënohet e përfunduar?", "Was muss geprüft sein, bevor die Arbeit als erledigt gilt?") },
            ] },
            { type: "callout", reading: true, text: x(
              "A well-designed cue reduces ambiguity; it does not remove the need for verification.",
              "Një shenjë e projektuar mirë e ul paqartësinë; nuk e heq nevojën për verifikim.",
              "Ein gut gestalteter Hinweis verringert Mehrdeutigkeit; er ersetzt die Prüfung nicht.") },
          ],
          note: x(
            "Altmann and Trafton (2002); Monk, Trafton and Boehm-Davis (2008), Journal of Experimental Psychology: Applied 14(4), three experiments.",
            "Altmann e Trafton (2002); Monk, Trafton e Boehm-Davis (2008), Journal of Experimental Psychology: Applied 14(4), tri eksperimente.",
            "Altmann und Trafton (2002); Monk, Trafton und Boehm-Davis (2008), Journal of Experimental Psychology: Applied 14(4), drei Experimente."),
          source: ["altmann-trafton-2002", "monk-trafton-boehm-davis-2008"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("What the experiments", "Çfarë tregojnë", "Was die Experimente"), x("actually show", "vërtet eksperimentet", "wirklich zeigen")],
          lead: x(
            "Controlled research supplies mechanisms; it cannot supply a universal interruption tax.",
            "Kërkimi i kontrolluar jep mekanizma; nuk jep dot një taksë universale ndërprerjeje.",
            "Kontrollierte Forschung liefert Mechanismen; eine universelle Unterbrechungssteuer liefert sie nicht."),
          blocks: [
            { type: "p", text: x(
              "Trafton and colleagues (2003) compared an 8-second interruption lag, a warning interval before the interruption, with no lag at all. Participants who had the lag prepared more and resumed faster; those interrupted immediately also became faster with practice, which suggests people adapt. That is a reason to test brief, permitted pause points, not a mandate to spend eight seconds writing notes during every operational emergency. Monk and colleagues (2008) showed in three experiments that resumption time depended on interruption length and mental demand: a minute in a demanding secondary task was not equivalent to a minute in a simple one. Brumby and colleagues (2013) exposed a further complexity. In a routine sequential data-entry task, fast resumption went with more errors; in their second experiment a 10-second system lockout after the interruption significantly reduced resumption errors by preventing fast, inaccurate returns. That does not mean systems should impose lockouts indiscriminately. It shows that a rapid return is not automatically a reliable one. Together the experiments give three questions for process design: can the worker remember what was left, can the step be retrieved safely, and is the return checked enough to avoid missed or duplicated work?",
              "Trafton dhe kolegët (2003) krahasuan një vonesë ndërprerjeje prej 8 sekondash, një interval paralajmërimi para ndërprerjes, me mungesën e plotë të saj. Pjesëmarrësit që e kishin vonesën u përgatitën më shumë dhe u rikthyen më shpejt; ata që u ndërprenë menjëherë u bënë gjithashtu më të shpejtë me praktikë, gjë që sugjeron se njerëzit përshtaten. Kjo është arsye për të provuar pika të shkurtra ndalimi të lejuara, jo urdhër për të shpenzuar tetë sekonda duke shkruar shënime gjatë çdo emergjence operacionale. Monk dhe kolegët (2008) treguan në tri eksperimente se koha e rikthimit varej nga gjatësia dhe kërkesa mendore e ndërprerjes: një minutë në një detyrë dytësore kërkuese nuk ishte e barabartë me një minutë në një të thjeshtë. Brumby dhe kolegët (2013) nxorën në pah një ndërlikim tjetër. Në një detyrë rutinë të futjes së të dhënave në radhë, rikthimi i shpejtë shkonte me më shumë gabime; në eksperimentin e tyre të dytë, një bllokim sistemi prej 10 sekondash pas ndërprerjes i uli ndjeshëm gabimet e rikthimit, duke parandaluar rikthimet e shpejta dhe të pasakta. Kjo nuk do të thotë se sistemet duhet të vendosin bllokime pa dallim. Tregon se një rikthim i shpejtë nuk është automatikisht i besueshëm. Bashkë, eksperimentet japin tri pyetje për projektimin e procesit: a e kujton punonjësi çfarë mbeti, a mund të rikuperohet hapi në mënyrë të sigurt, dhe a kontrollohet mjaftueshëm rikthimi që të mos humbasë apo dyfishohet puna?",
              "Trafton und Kollegen (2003) verglichen eine Unterbrechungsverzögerung von 8 Sekunden, ein Warnintervall vor der Unterbrechung, mit gar keiner. Wer die Verzögerung hatte, bereitete sich mehr vor und nahm schneller wieder auf; wer sofort unterbrochen wurde, wurde mit Übung ebenfalls schneller, was auf Anpassung deutet. Das ist ein Grund, kurze, erlaubte Haltepunkte zu testen, kein Auftrag, bei jedem betrieblichen Notfall acht Sekunden Notizen zu schreiben. Monk und Kollegen (2008) zeigten in drei Experimenten, dass die Wiederaufnahmezeit von Länge und geistiger Anforderung der Unterbrechung abhing: Eine Minute in einer anspruchsvollen Nebenaufgabe entsprach nicht einer Minute in einer einfachen. Brumby und Kollegen (2013) legten eine weitere Schwierigkeit offen. Bei einer routinemäßigen, sequenziellen Dateneingabe ging schnelle Wiederaufnahme mit mehr Fehlern einher; in ihrem zweiten Experiment senkte eine Systemsperre von 10 Sekunden nach der Unterbrechung die Wiederaufnahmefehler deutlich, weil sie schnelle, ungenaue Rückkehr verhinderte. Das heißt nicht, Systeme sollten wahllos Sperren einführen. Es zeigt, dass eine schnelle Rückkehr nicht automatisch eine verlässliche ist. Zusammen ergeben die Experimente drei Fragen für die Prozessgestaltung: Weiß die Person noch, was offen blieb, lässt sich der Schritt sicher abrufen, und wird die Rückkehr genug geprüft, damit keine Arbeit fehlt oder doppelt geschieht?") },
            { type: "rows", compact: true, items: [
              { h: x("2003", "2003", "2003"), p: x("Preparation before interruption: an 8-second lag against none.", "Përgatitja para ndërprerjes: një vonesë 8-sekondëshe kundrejt asnjë.", "Vorbereitung vor der Unterbrechung: 8 Sekunden Verzögerung gegen keine.") },
              { h: x("2008", "2008", "2008"), p: x("Three experiments on interruption duration and cognitive demand.", "Tri eksperimente për kohëzgjatjen dhe kërkesën mendore të ndërprerjes.", "Drei Experimente zu Dauer und geistiger Anforderung der Unterbrechung.") },
              { h: x("2013", "2013", "2013"), p: x("Speed and accuracy of resumption in routine data entry; a 10-second lockout.", "Shpejtësia dhe saktësia e rikthimit në futjen rutinë të të dhënave; një bllokim 10-sekondësh.", "Tempo und Genauigkeit der Wiederaufnahme bei Dateneingabe; eine 10-Sekunden-Sperre.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Study durations are conditions of experiments, not recommended policy thresholds.",
              "Kohëzgjatjet e studimeve janë kushte eksperimentesh, jo pragje të rekomanduara politikash.",
              "Dauern aus Studien sind Versuchsbedingungen, keine empfohlenen Schwellen für Regeln.") },
          ],
          note: x(
            "Trafton et al. (2003), International Journal of Human-Computer Studies 58(5); Monk et al. (2008); Brumby et al. (2013), Journal of Experimental Psychology: Applied 19(2). No local trial was conducted for this publication.",
            "Trafton et al. (2003), International Journal of Human-Computer Studies 58(5); Monk et al. (2008); Brumby et al. (2013), Journal of Experimental Psychology: Applied 19(2). Për këtë botim nuk u krye asnjë provë lokale.",
            "Trafton et al. (2003), International Journal of Human-Computer Studies 58(5); Monk et al. (2008); Brumby et al. (2013), Journal of Experimental Psychology: Applied 19(2). Für diese Veröffentlichung wurde kein örtlicher Versuch durchgeführt."),
          source: ["trafton-2003", "monk-trafton-boehm-davis-2008", "brumby-2013"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Make the next step", "Bëje hapin e radhës", "Den nächsten Schritt"), x("recoverable", "të rikuperueshëm", "wiederauffindbar machen")],
          lead: x(
            "The most practical memory aid is specific, authorised and close to the task itself.",
            "Ndihma më praktike për kujtesën është specifike, e autorizuar dhe pranë vetë detyrës.",
            "Die praktischste Gedächtnishilfe ist konkret, befugt und nah an der Aufgabe."),
          blocks: [
            { type: "steps", items: [
              { h: x("Locate natural breakpoints", "Gjej pikat natyrore të ndalimit", "Natürliche Haltepunkte finden"), p: x("Stages where work can pause without losing a critical decision.", "Fazat ku puna mund të ndalet pa humbur një vendim kritik.", "Stufen, an denen die Arbeit ohne Verlust einer kritischen Entscheidung ruhen kann.") },
              { h: x("Use a single source", "Përdor një burim të vetëm", "Eine einzige Quelle nutzen"), p: x("An approved task record rather than separate personal notes.", "Një regjistër detyrash i miratuar, jo shënime personale më vete.", "Ein genehmigter Aufgabendatensatz statt eigener Notizen.") },
              { h: x("Preserve only the next action", "Ruaj vetëm veprimin e radhës", "Nur die nächste Handlung sichern"), p: x("No long free text and no duplicated sensitive data.", "Pa tekst të gjatë të lirë dhe pa të dhëna të ndjeshme të dyfishuara.", "Kein langer Freitext und keine doppelten sensiblen Daten.") },
              { h: x("Give context on return", "Jep kontekst në rikthim", "Bei der Rückkehr Kontext geben"), p: x("Show what is finished, what is open and what changed.", "Trego çfarë është e përfunduar, çfarë është e hapur dhe çfarë ndryshoi.", "Zeigen, was erledigt, was offen und was geändert ist.") },
              { h: x("Require a selective recheck", "Kërko një rikontroll të përzgjedhur", "Gezielt nachprüfen"), p: x("Reconfirm the last critical step and any downstream dependency.", "Rikonfirmo hapin e fundit kritik dhe çdo varësi më poshtë në rrjedhë.", "Den letzten kritischen Schritt und nachgelagerte Abhängigkeiten bestätigen.") },
              { h: x("Test for unintended costs", "Provo për kosto të padëshiruara", "Auf Nebenkosten prüfen"), p: x("Note burden, delayed response and conflicting statuses.", "Barra e shënimeve, përgjigja e vonuar dhe statuset që bien ndesh.", "Notizlast, verzögerte Antwort und widersprüchliche Status.") },
            ] },
            { type: "p", text: x(
              "The point is not to document every thought but to reduce the reconstruction a safe next action needs: a checklist stage, an authorised handover entry or a clear status in software. A pilot records whether the cue is used and whether it helps people resume correctly. If teams abandon it, ask why: hard to enter, not visible, or the answer already lives in another system.",
              "Qëllimi nuk është të dokumentohet çdo mendim, por të ulet rindërtimi që i duhet një veprimi të radhës të sigurt: një fazë në listën e kontrollit, një shënim i autorizuar dorëzimi ose një status i qartë në softuer. Një pilot regjistron nëse shenja përdoret dhe nëse i ndihmon njerëzit të rikthehen saktë. Nëse ekipet e braktisin, pyet pse: e vështirë për t'u futur, e padukshme, apo përgjigja ndodhet tashmë në një sistem tjetër.",
              "Es geht nicht darum, jeden Gedanken zu dokumentieren, sondern die Rekonstruktion zu verringern, die ein sicherer nächster Schritt braucht: eine Checklistenstufe, ein befugter Übergabeeintrag oder ein klarer Status in der Software. Ein Pilot erfasst, ob der Hinweis genutzt wird und ob er hilft, richtig wieder aufzunehmen. Geben Teams ihn auf, nach dem Grund fragen: mühsam einzutragen, nicht sichtbar, oder die Antwort steht schon in einem anderen System.") },
            { type: "callout", reading: true, text: x(
              "Recoverability is a design quality, not a memory test for the employee.",
              "Rikuperueshmëria është cilësi projektimi, jo provë kujtese për punonjësin.",
              "Wiederauffindbarkeit ist eine Gestaltungsqualität, kein Gedächtnistest für die Beschäftigten.") },
          ],
          note: x(
            "Editorial protocol after Altmann and Trafton (2002), Trafton et al. (2003) and Brumby et al. (2013).",
            "Protokoll editorial sipas Altmann e Trafton (2002), Trafton et al. (2003) dhe Brumby et al. (2013).",
            "Redaktionelles Protokoll nach Altmann und Trafton (2002), Trafton et al. (2003) und Brumby et al. (2013)."),
          source: ["altmann-trafton-2002", "trafton-2003", "brumby-2013"],
        },
      ],
    },

    // Chapter III. The urgency illusion
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The urgency illusion", "Iluzioni i urgjencës", "Die Dringlichkeitsillusion"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "solve-it-or-escalate-it",
          title: [x("Everything sounds", "Gjithçka tingëllon", "Alles klingt"), x("important", "e rëndësishme", "wichtig")],
          lead: x(
            "When every message demands immediate attention, the word urgent stops helping people choose.",
            "Kur çdo mesazh kërkon vëmendje të menjëhershme, fjala urgjent pushon së ndihmuari njerëzit të zgjedhin.",
            "Wenn jede Nachricht sofortige Aufmerksamkeit verlangt, hilft das Wort dringend nicht mehr beim Wählen."),
          blocks: [
            { type: "flag", text: x("Hypothetical coordination scene, not a recorded shift", "Skenë hipotetike koordinimi, jo turn i regjistruar", "Hypothetische Koordinationsszene, keine erfasste Schicht") },
            { type: "p", text: x(
              "On a busy shift, a coordinator is reviewing a delayed departure. A routine status request appears. Then a colleague asks a question that a shared guide could answer. Another notification concerns a situation that needs immediate attention. All three may arrive through the same channel, with the same sound and the same visual treatment. The worker cannot solve this by working faster. The questions differ in consequence, authority and urgency: one can safely wait, one can be routed to a different owner, and one requires action under an established escalation procedure. Yet a system that presents them equally forces the worker to triage while already engaged in another decision. Important interruptions are part of good operations; their value is lost when truly urgent signals cannot be told from routine requests. The management question is not how to silence everyone. It is how to keep the right person reachable at once while non-urgent work arrives at a sensible time, never asking anyone to ignore safety-critical communication in the name of productivity.",
              "Në një turn të ngarkuar, një koordinator po shqyrton një nisje të vonuar. Shfaqet një kërkesë rutinë statusi. Pastaj një koleg bën një pyetje që mund t'i përgjigjej një udhëzues i përbashkët. Një njoftim tjetër ka të bëjë me një situatë që kërkon vëmendje të menjëhershme. Të tria mund të vijnë nga i njëjti kanal, me të njëjtin tingull dhe të njëjtën pamje. Punonjësi nuk e zgjidh dot këtë duke punuar më shpejt. Pyetjet ndryshojnë në pasojë, autoritet dhe urgjencë: njëra mund të presë pa rrezik, tjetra mund t'i kalojë një pronari tjetër, dhe e treta kërkon veprim sipas një procedure të vendosur eskalimi. Megjithatë një sistem që i paraqet njësoj e detyron punonjësin të bëjë renditjen e përparësive ndërsa është i zënë me një vendim tjetër. Ndërprerjet e rëndësishme janë pjesë e operacioneve të mira; vlera e tyre humbet kur sinjalet vërtet urgjente nuk dallohen nga kërkesat rutinë. Pyetja menaxheriale nuk është si t'i heshtësh të gjithë. Është si ta mbash personin e duhur të arritshëm menjëherë, ndërsa puna jo urgjente mbërrin në një kohë të arsyeshme, pa i kërkuar askujt kurrë të shpërfillë komunikimin kritik për sigurinë në emër të produktivitetit.",
              "In einer vollen Schicht prüft eine Koordinatorin eine verspätete Abfahrt. Eine routinemäßige Statusanfrage erscheint. Dann stellt ein Kollege eine Frage, die ein gemeinsamer Leitfaden beantworten könnte. Eine weitere Benachrichtigung betrifft eine Lage, die sofortige Aufmerksamkeit braucht. Alle drei können über denselben Kanal kommen, mit demselben Ton und derselben Darstellung. Schneller arbeiten löst das nicht. Die Fragen unterscheiden sich in Folge, Befugnis und Dringlichkeit: Eine kann sicher warten, eine kann an eine andere Verantwortliche gehen, und eine verlangt Handeln nach einem festgelegten Eskalationsverfahren. Doch ein System, das sie gleich darstellt, zwingt die Person zur Triage, während sie schon in einer anderen Entscheidung steckt. Wichtige Unterbrechungen gehören zu gutem Betrieb; ihr Wert geht verloren, wenn wirklich dringende Signale nicht von Routineanfragen zu unterscheiden sind. Die Führungsfrage ist nicht, wie man alle zum Schweigen bringt. Sie lautet, wie die richtige Person sofort erreichbar bleibt, während nicht dringende Arbeit zu einem sinnvollen Zeitpunkt eintrifft, ohne je zu verlangen, sicherheitskritische Kommunikation im Namen der Produktivität zu übergehen.") },
            { type: "p", text: x(
              "The scene is constructed and contains no real dispatch messages, routes or customer details. It illustrates an information-design issue, not a verified failure in any company.",
              "Skena është e ndërtuar dhe nuk përmban mesazhe të vërteta dispeçerimi, rrugë apo të dhëna klientësh. Ilustron një çështje të projektimit të informacionit, jo një dështim të verifikuar në ndonjë kompani.",
              "Die Szene ist konstruiert und enthält keine echten Dispositionsnachrichten, Touren oder Kundendaten. Sie zeigt eine Frage der Informationsgestaltung, kein geprüftes Versagen eines Unternehmens.") },
            { type: "callout", reading: true, text: x(
              "An interruption can be necessary without every interruption deserving the same priority.",
              "Një ndërprerje mund të jetë e nevojshme, pa e merituar çdo ndërprerje të njëjtën përparësi.",
              "Eine Unterbrechung kann nötig sein, ohne dass jede dieselbe Priorität verdient.") },
          ],
          note: x(
            "Hypothetical scene; interruption-timing literature: Adamczyk and Bailey (2004); Bailey and Konstan (2006). The essay named below treats escalation as a system, not a temperament.",
            "Skenë hipotetike; literatura për kohën e ndërprerjes: Adamczyk e Bailey (2004); Bailey e Konstan (2006). Eseja e emërtuar më poshtë e trajton eskalimin si sistem, jo si temperament.",
            "Hypothetische Szene; Literatur zum Unterbrechungszeitpunkt: Adamczyk und Bailey (2004); Bailey und Konstan (2006). Der unten genannte Essay behandelt Eskalation als System, nicht als Temperament."),
          source: ["adamczyk-bailey-2004", "bailey-konstan-2006"],
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Priority is a decision,", "Përparësia është vendim,", "Priorität ist eine Entscheidung,"), x("not a sound", "jo tingull", "kein Ton")],
          lead: x(
            "Urgency depends on consequence, time sensitivity and ownership, not just the volume of the notification.",
            "Urgjenca varet nga pasoja, ndjeshmëria ndaj kohës dhe pronësia, jo vetëm nga zhurma e njoftimit.",
            "Dringlichkeit hängt von Folge, Zeitkritik und Zuständigkeit ab, nicht nur von der Lautstärke der Benachrichtigung."),
          blocks: [
            { type: "p", text: x(
              "A notification's arrival time is a poor substitute for its importance. A manager should separate the seriousness of the event from the convenience of responding at once. A genuinely time-critical risk must reach the responsible person now. A routine request may wait for a natural task boundary, especially when an immediate switch raises the chance of losing an unfinished step. Adamczyk and Bailey (2004) interrupted users at different moments within computer-supported tasks, chosen from models of the task's cognitive load. Different moments had different effects on users' emotional state and on how positively they judged the interrupter. That is not evidence for a minute-by-minute notification schedule in a warehouse; it is evidence that timing itself is a design variable. Bailey and Konstan (2006) measured, in a controlled study, how interruptions at different moments affected task performance, error rate, annoyance and anxiety. Those outcomes show why notification speed alone is the wrong thing to optimise. In practice triage needs three questions: what harm follows if the message waits, who is authorised to act, and how does the recipient know what to do next? A message labelled urgent without consequence and ownership is not operationally complete.",
              "Koha kur mbërrin një njoftim është zëvendësues i dobët i rëndësisë së tij. Një menaxher duhet ta ndajë seriozitetin e ngjarjes nga lehtësia e përgjigjes së menjëhershme. Një rrezik vërtet kritik në kohë duhet ta arrijë personin përgjegjës tani. Një kërkesë rutinë mund të presë deri në një kufi natyror të detyrës, sidomos kur një kalim i menjëhershëm e rrit mundësinë që të humbasë një hap i papërfunduar. Adamczyk dhe Bailey (2004) i ndërprenë përdoruesit në çaste të ndryshme brenda detyrave me kompjuter, të zgjedhura nga modele të ngarkesës mendore të detyrës. Çastet e ndryshme patën efekte të ndryshme te gjendja emocionale e përdoruesve dhe te sa pozitivisht e gjykonin atë që ndërpriste. Kjo nuk është provë për një orar njoftimesh minutë pas minute në një magazinë; është provë se vetë koha është variabël projektimi. Bailey dhe Konstan (2006) matën, në një studim të kontrolluar, si ndikonin ndërprerjet në çaste të ndryshme te performanca, norma e gabimeve, bezdia dhe ankthi. Këto rezultate tregojnë pse shpejtësia e njoftimit më vete është gjëja e gabuar për t'u optimizuar. Në praktikë, renditja e përparësive ka nevojë për tri pyetje: çfarë dëmi vjen nëse mesazhi pret, kush është i autorizuar të veprojë dhe si e di marrësi çfarë të bëjë më pas? Një mesazh i shënuar urgjent pa pasojë dhe pronësi nuk është i plotë operacionalisht.",
              "Der Eingangszeitpunkt einer Benachrichtigung ist ein schlechter Ersatz für ihre Bedeutung. Eine Führungskraft sollte die Schwere des Ereignisses von der Bequemlichkeit sofortiger Antwort trennen. Ein wirklich zeitkritisches Risiko muss die zuständige Person jetzt erreichen. Eine Routineanfrage kann bis zu einer natürlichen Aufgabengrenze warten, besonders wenn ein sofortiger Wechsel die Gefahr erhöht, einen unerledigten Schritt zu verlieren. Adamczyk und Bailey (2004) unterbrachen Nutzer an verschiedenen Stellen computergestützter Aufgaben, ausgewählt nach Modellen der geistigen Last. Verschiedene Momente wirkten unterschiedlich auf den Gefühlszustand und darauf, wie positiv die Nutzer den Unterbrechenden beurteilten. Das belegt keinen minutengenauen Benachrichtigungsplan für ein Lager; es belegt, dass der Zeitpunkt selbst eine Gestaltungsgröße ist. Bailey und Konstan (2006) maßen in einer kontrollierten Studie, wie Unterbrechungen zu verschiedenen Zeitpunkten Leistung, Fehlerrate, Ärger und Angst beeinflussten. Diese Ergebnisse zeigen, warum Benachrichtigungstempo allein das falsche Optimierungsziel ist. In der Praxis braucht Triage drei Fragen: Welcher Schaden folgt, wenn die Nachricht wartet, wer ist befugt zu handeln, und woher weiß die Empfängerin, was als Nächstes zu tun ist? Eine als dringend markierte Nachricht ohne Folge und Zuständigkeit ist betrieblich nicht vollständig.") },
            { type: "rows", compact: true, items: [
              { h: x("Immediate", "E menjëhershme", "Sofort"), p: x("Safety or other time-critical obligations: follow the authorised response path.", "Detyrime sigurie ose të tjera kritike në kohë: ndiq rrugën e autorizuar të përgjigjes.", "Sicherheit oder andere zeitkritische Pflichten: dem befugten Antwortweg folgen.") },
              { h: x("Time-sensitive", "E ndjeshme ndaj kohës", "Zeitkritisch"), p: x("A deadline approaches: assign an owner and a clear decision point.", "Afrohet një afat: cakto një pronar dhe një pikë të qartë vendimi.", "Eine Frist naht: Verantwortliche und klaren Entscheidungspunkt bestimmen.") },
              { h: x("Routine", "Rutinë", "Routine"), p: x("A documented queue, or delivery at a natural task boundary.", "Një radhë e dokumentuar, ose dërgim në një kufi natyror të detyrës.", "Eine dokumentierte Warteschlange oder Zustellung an einer natürlichen Aufgabengrenze.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The three tiers are an editorial design model, not an employer policy or a universal classification.",
              "Tri nivelet janë model editorial projektimi, jo politikë punëdhënësi apo klasifikim universal.",
              "Die drei Stufen sind ein redaktionelles Gestaltungsmodell, keine Arbeitgeberregel und keine universelle Einteilung.") },
          ],
          note: x(
            "Adamczyk and Bailey (2004), CHI 2004; Bailey and Konstan (2006), Computers in Human Behavior 22(4). The three priority tiers are proposed, not experimentally validated.",
            "Adamczyk e Bailey (2004), CHI 2004; Bailey e Konstan (2006), Computers in Human Behavior 22(4). Tri nivelet e përparësisë janë të propozuara, jo të vërtetuara eksperimentalisht.",
            "Adamczyk und Bailey (2004), CHI 2004; Bailey und Konstan (2006), Computers in Human Behavior 22(4). Die drei Prioritätsstufen sind vorgeschlagen, nicht experimentell validiert."),
          source: ["adamczyk-bailey-2004", "bailey-konstan-2006"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("The timing", "Koha", "Der Zeitpunkt"), x("of the request", "e kërkesës", "der Anfrage")],
          lead: x(
            "When an interruption arrives can influence its burden, even when its content stays the same.",
            "Kur mbërrin një ndërprerje mund të ndikojë te barra e saj, edhe kur përmbajtja mbetet e njëjtë.",
            "Wann eine Unterbrechung eintrifft, kann ihre Last beeinflussen, auch wenn ihr Inhalt gleich bleibt."),
          blocks: [
            { type: "p", text: x(
              "A task has a rhythm. At some points a worker is collecting inputs; at others they are comparing alternatives, committing a decision or verifying completion. Interrupting these stages may place different demands on memory. The aim is not a universal perfect moment; it is to recognise that a uniform interrupt-now design can ignore the structure of the work. Adamczyk and Bailey's (2004) laboratory study used models of task execution to choose interruption moments, and found that the moment changed users' emotional state and their social attribution. Their setting was computer tasks and simulated alerts, not hotel guests or safety events. The lesson is about permission to defer, not a guarantee of saved time. Routine administrative notifications may be batched or routed if users and managers approve. Urgent operational signals cannot be withheld because the recipient is deeply focused; an attention-aware design must make critical messages easier to reach, not harder. A pilot can compare identical message categories delivered immediately and at a defined boundary, where deferral is safe and authorised, and judge both the primary task and the new request: response time, missed action, resumption accuracy and strain. If service or safety worsens, the design has not succeeded.",
              "Një detyrë ka një ritëm. Në disa pika punonjësi mbledh të dhëna; në të tjera krahason alternativa, merr një vendim ose verifikon përfundimin. Ndërprerja e këtyre fazave mund t'i vërë kujtesës kërkesa të ndryshme. Qëllimi nuk është një çast universal i përsosur; është të kuptohet se një projektim njëtrajtësh “ndërpre tani” mund ta shpërfillë strukturën e punës. Studimi laboratorik i Adamczyk-ut dhe Bailey-t (2004) përdori modele të kryerjes së detyrës për të zgjedhur çastet e ndërprerjes, dhe gjeti se çasti e ndryshonte gjendjen emocionale të përdoruesve dhe atribuimin e tyre shoqëror. Mjedisi i tyre ishte detyra me kompjuter dhe sinjale të simuluara, jo mysafirë hoteli apo ngjarje sigurie. Mësimi është për lejen për të shtyrë, jo garanci kohe të kursyer. Njoftimet rutinë administrative mund të grupohen ose të ridrejtohen nëse e miratojnë përdoruesit dhe menaxherët. Sinjalet urgjente operacionale nuk mund të mbahen pezull sepse marrësi është thellësisht i përqendruar; një projektim që kujdeset për vëmendjen duhet t'i bëjë mesazhet kritike më të lehta për t'u arritur, jo më të vështira. Një pilot mund të krahasojë të njëjtat kategori mesazhesh të dërguara menjëherë dhe në një kufi të përcaktuar, aty ku shtyrja është e sigurt dhe e autorizuar, dhe të gjykojë edhe detyrën kryesore, edhe kërkesën e re: kohën e përgjigjes, veprimin e humbur, saktësinë e rikthimit dhe ngarkesën. Nëse shërbimi apo siguria keqësohen, projektimi nuk ka pasur sukses.",
              "Eine Aufgabe hat einen Rhythmus. An manchen Stellen sammelt die Person Eingaben, an anderen vergleicht sie Alternativen, legt eine Entscheidung fest oder prüft den Abschluss. Diese Stufen zu unterbrechen kann das Gedächtnis verschieden belasten. Ziel ist kein universeller perfekter Moment; es geht darum zu erkennen, dass ein einheitliches „jetzt unterbrechen“ die Struktur der Arbeit übergehen kann. Die Laborstudie von Adamczyk und Bailey (2004) wählte Unterbrechungsmomente anhand von Modellen der Aufgabenausführung und fand, dass der Moment den Gefühlszustand und die soziale Zuschreibung veränderte. Ihr Umfeld waren Computeraufgaben und simulierte Signale, keine Hotelgäste oder Sicherheitsereignisse. Die Lehre betrifft die Erlaubnis aufzuschieben, keine Garantie gesparter Zeit. Routinemeldungen der Verwaltung können gebündelt oder umgeleitet werden, wenn Nutzer und Führung zustimmen. Dringende betriebliche Signale dürfen nicht zurückgehalten werden, weil jemand tief konzentriert ist; eine aufmerksamkeitsgerechte Gestaltung muss kritische Nachrichten leichter erreichbar machen, nicht schwerer. Ein Pilot kann gleiche Nachrichtenkategorien sofort und an einer festgelegten Grenze zustellen, wo Aufschub sicher und befugt ist, und beide Seiten beurteilen, Hauptaufgabe und neue Anfrage: Antwortzeit, versäumte Handlung, Genauigkeit der Wiederaufnahme und Belastung. Verschlechtern sich Service oder Sicherheit, ist die Gestaltung nicht gelungen.") },
            { type: "cards", cols: 3, items: [
              { h: x("When · boundary", "Kur · kufiri", "Wann · Grenze"), p: x("Can this request wait for a safe transition point?", "A mund të presë kjo kërkesë deri në një pikë të sigurt kalimi?", "Kann diese Anfrage bis zu einem sicheren Übergang warten?") },
              { h: x("Who · ownership", "Kush · pronësia", "Wer · Zuständigkeit"), p: x("Is the recipient the person able to act?", "A është marrësi personi që mund të veprojë?", "Ist die Empfängerin die Person, die handeln kann?") },
              { h: x("What · next step", "Çfarë · hapi tjetër", "Was · nächster Schritt"), p: x("Does the message name the required response?", "A e emërton mesazhi përgjigjen e kërkuar?", "Nennt die Nachricht die erforderliche Antwort?") },
            ] },
            { type: "callout", reading: true, text: x(
              "A quieter interface is not automatically a safer or more effective operating system.",
              "Një ndërfaqe më e qetë nuk është automatikisht sistem operativ më i sigurt apo më efektiv.",
              "Eine ruhigere Oberfläche ist nicht automatisch ein sichereres oder wirksameres Betriebssystem.") },
          ],
          note: x(
            "Adamczyk and Bailey (2004); Bailey and Konstan (2006). The design tests are proposals for local validation.",
            "Adamczyk e Bailey (2004); Bailey e Konstan (2006). Provat e projektimit janë propozime për vërtetim lokal.",
            "Adamczyk und Bailey (2004); Bailey und Konstan (2006). Die Gestaltungstests sind Vorschläge zur örtlichen Prüfung."),
          source: ["adamczyk-bailey-2004", "bailey-konstan-2006"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("Route the demand", "Drejtoje kërkesën", "Die Anforderung leiten,"), x("before it fragments work", "para se ta copëtojë punën", "bevor sie Arbeit zerstückelt")],
          lead: x(
            "The best interruption is sometimes a direct, necessary question. The worst is one sent everywhere without an owner.",
            "Ndërprerja më e mirë ndonjëherë është një pyetje e drejtpërdrejtë dhe e nevojshme. Më e keqja është ajo që dërgohet kudo pa pronar.",
            "Die beste Unterbrechung ist manchmal eine direkte, nötige Frage. Die schlechteste geht an alle, ohne Verantwortliche."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the event family", "Përkufizo familjen e ngjarjes", "Die Ereignisfamilie festlegen"), p: x("Critical response, time-sensitive exceptions and routine inquiries.", "Përgjigje kritike, përjashtime të ndjeshme ndaj kohës dhe pyetje rutinë.", "Kritische Antwort, zeitkritische Ausnahmen und Routinefragen.") },
              { h: x("Match consequence to channel", "Përputh pasojën me kanalin", "Folge und Kanal abstimmen"), p: x("Only approved systems and escalation rules for urgent matters.", "Vetëm sisteme të miratuara dhe rregulla eskalimi për çështjet urgjente.", "Für Dringendes nur genehmigte Systeme und Eskalationsregeln.") },
              { h: x("Name the receiver", "Emërto marrësin", "Die Empfängerin benennen"), p: x("Route requests to the role that can verify or decide.", "Drejtoji kërkesat te roli që mund të verifikojë ose të vendosë.", "Anfragen an die Rolle leiten, die prüfen oder entscheiden kann.") },
              { h: x("Give a clear action", "Jep një veprim të qartë", "Eine klare Handlung nennen"), p: x("No vague messages that force several clarification exchanges.", "Pa mesazhe të paqarta që detyrojnë disa shkëmbime sqarimi.", "Keine vagen Nachrichten, die mehrere Rückfragen erzwingen.") },
              { h: x("Preserve interrupted work", "Ruaj punën e ndërprerë", "Unterbrochene Arbeit sichern"), p: x("A safe resume cue where possible and permitted.", "Një shenjë e sigurt rikthimi aty ku është e mundur dhe e lejuar.", "Ein sicherer Wiedereinstiegshinweis, wo möglich und erlaubt.") },
              { h: x("Audit missed signals", "Audito sinjalet e humbura", "Versäumte Signale prüfen"), p: x("Both over-alerting and delayed or unanswered critical requests.", "Edhe tepricën e sinjaleve, edhe kërkesat kritike të vonuara apo pa përgjigje.", "Sowohl zu viele Signale als auch verspätete oder unbeantwortete kritische Anfragen.") },
            ] },
            { type: "p", text: x(
              "A priority scheme fails if a team labels a critical issue routine to protect its dashboard, and equally if everything escalates to the same person. Review one message category at a time, with frontline users, supervisors and the functions responsible for safety, security and privacy. The manager's own vague, non-urgent messages deserve the same scrutiny as the software.",
              "Një skemë përparësish dështon nëse një ekip e shënon një çështje kritike si rutinë për të mbrojtur panelin e vet, dhe po aq nëse gjithçka eskalohet te i njëjti person. Shqyrto një kategori mesazhesh në një kohë, me përdoruesit e vijës së parë, mbikëqyrësit dhe funksionet përgjegjëse për sigurinë, mbrojtjen dhe privatësinë. Mesazhet e paqarta dhe jo urgjente të vetë menaxherit meritojnë të njëjtin shqyrtim si softueri.",
              "Ein Prioritätsschema scheitert, wenn ein Team ein kritisches Thema als Routine markiert, um sein Dashboard zu schützen, und ebenso, wenn alles an dieselbe Person eskaliert. Eine Nachrichtenkategorie nach der anderen prüfen, mit Nutzern an vorderster Front, Vorgesetzten und den Stellen für Sicherheit, Schutz und Datenschutz. Die eigenen vagen, nicht dringenden Nachrichten der Führungskraft verdienen dieselbe Prüfung wie die Software.") },
            { type: "callout", reading: true, text: x(
              "Protect the essential signal. Reduce avoidable competition for attention.",
              "Mbroje sinjalin thelbësor. Ule konkurrencën e shmangshme për vëmendjen.",
              "Das wesentliche Signal schützen. Vermeidbaren Wettbewerb um Aufmerksamkeit verringern.") },
          ],
          note: x(
            "Original editorial triage protocol drawing on Adamczyk and Bailey (2004) and Bailey and Konstan (2006).",
            "Protokoll editorial origjinal për renditjen e përparësive, i mbështetur te Adamczyk e Bailey (2004) dhe Bailey e Konstan (2006).",
            "Eigenes redaktionelles Triageprotokoll nach Adamczyk und Bailey (2004) und Bailey und Konstan (2006)."),
          source: ["adamczyk-bailey-2004", "bailey-konstan-2006"],
        },
      ],
    },

    // Chapter IV. One dispatcher, many signals
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("One dispatcher, many signals", "Një dispeçer, shumë sinjale", "Ein Disponent, viele Signale"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "80-vehicles-you-cannot-see",
          title: [x("The screen shows", "Ekrani tregon", "Der Bildschirm zeigt"), x("many routes at once", "shumë rrugë njëherësh", "viele Touren zugleich")],
          lead: x(
            "A broad operational view can be valuable while its signals compete for the same person's attention.",
            "Një pamje e gjerë operacionale mund të jetë e vlefshme, ndërsa sinjalet e saj konkurrojnë për vëmendjen e të njëjtit person.",
            "Ein breiter Betriebsblick kann wertvoll sein, während seine Signale um die Aufmerksamkeit derselben Person konkurrieren."),
          blocks: [
            { type: "flag", text: x("Hypothetical remote-dispatch scene, no company events reproduced", "Skenë hipotetike dispeçerimi në distancë, pa ngjarje kompanie të riprodhuara", "Hypothetische Fern-Dispositionsszene, keine Unternehmensereignisse wiedergegeben") },
            { type: "p", text: x(
              "A remote coordinator reviews vehicle statuses. One issue concerns an arrival estimate, another an update from a route, a third an unresolved question from the previous shift. The coordinator begins to verify the first case, switches to the second after a message, then receives confirmation on the third. Each move is understandable in isolation. Across the hour, the sequence becomes hard to reconstruct. Nothing in this scene requires the systems to be inaccurate. It is enough that several legitimate demands arrive before the previous decision cycle ends. The dispatcher may have every relevant fact somewhere on the screen and still need time to recover which action was decided, which is pending and who owns the next step. If management treats this as a purely personal concentration problem, it may prescribe more vigilance while adding more alerts. A better investigation asks whether tasks are clearly owned, whether routine questions can be routed elsewhere and whether unfinished decisions stay visible when the worker changes context.",
              "Një koordinator në distancë shqyrton statuset e automjeteve. Një çështje ka të bëjë me një vlerësim mbërritjeje, një tjetër me një përditësim nga një rrugë, e treta me një pyetje të pazgjidhur nga turni i mëparshëm. Koordinatori nis ta verifikojë rastin e parë, kalon te i dyti pas një mesazhi, pastaj merr konfirmim për të tretin. Çdo lëvizje kuptohet më vete. Gjatë orës, radha bëhet e vështirë për t'u rindërtuar. Asgjë në këtë skenë nuk kërkon që sistemet të jenë të pasakta. Mjafton që disa kërkesa legjitime të mbërrijnë para se të mbarojë cikli i mëparshëm i vendimit. Dispeçeri mund ta ketë çdo fakt përkatës diku në ekran dhe prapë t'i duhet kohë për të rikuperuar cili veprim u vendos, cili është në pritje dhe kush e ka hapin e radhës. Nëse drejtimi e trajton këtë si problem thjesht personal përqendrimi, mund të përshkruajë më shumë vigjilencë ndërsa shton më shumë sinjale. Një hetim më i mirë pyet nëse detyrat kanë pronar të qartë, nëse pyetjet rutinë mund të drejtohen gjetiu dhe nëse vendimet e papërfunduara mbeten të dukshme kur punonjësi ndërron kontekst.",
              "Ein Fern-Koordinator prüft Fahrzeugstatus. Ein Thema betrifft eine Ankunftsschätzung, ein anderes eine Meldung von einer Tour, ein drittes eine offene Frage aus der Vorschicht. Er beginnt, den ersten Fall zu prüfen, wechselt nach einer Nachricht zum zweiten und erhält dann eine Bestätigung zum dritten. Jeder Schritt ist für sich verständlich. Über die Stunde wird die Abfolge schwer zu rekonstruieren. Nichts in dieser Szene verlangt, dass die Systeme ungenau sind. Es genügt, dass mehrere berechtigte Anforderungen eintreffen, bevor der vorige Entscheidungszyklus endet. Der Disponent hat vielleicht jeden nötigen Fakt irgendwo auf dem Bildschirm und braucht trotzdem Zeit, um wiederzufinden, welche Handlung entschieden, welche offen ist und wem der nächste Schritt gehört. Behandelt die Leitung das als rein persönliches Konzentrationsproblem, verordnet sie vielleicht mehr Wachsamkeit und fügt mehr Signale hinzu. Eine bessere Untersuchung fragt, ob Aufgaben klar zugeordnet sind, ob Routinefragen anders geleitet werden können und ob unerledigte Entscheidungen sichtbar bleiben, wenn die Person den Kontext wechselt.") },
            { type: "p", text: x(
              "The author has coordinated large numbers of vehicles and drivers remotely. This scene does not establish the real systems used, their update frequency, a particular call or a documented missed route; those facts are unknown and are not implied.",
              "Autori ka koordinuar në distancë numra të mëdhenj automjetesh dhe shoferësh. Kjo skenë nuk vërteton sistemet e vërteta të përdorura, shpeshtësinë e përditësimit të tyre, një telefonatë të caktuar apo një rrugë të humbur të dokumentuar; ato fakte nuk dihen dhe nuk nënkuptohen.",
              "Der Autor hat große Zahlen von Fahrzeugen und Fahrern aus der Ferne koordiniert. Diese Szene belegt weder die echten Systeme, ihre Aktualisierungsrate, einen bestimmten Anruf noch eine dokumentierte verpasste Tour; diese Fakten sind unbekannt und werden nicht unterstellt.") },
            { type: "callout", reading: true, text: x(
              "More operational visibility does not automatically create more cognitive capacity.",
              "Më shumë dukshmëri operacionale nuk krijon automatikisht më shumë kapacitet mendor.",
              "Mehr betriebliche Sichtbarkeit schafft nicht automatisch mehr geistige Kapazität.") },
          ],
          note: x(
            "Constructed scenario; Leroy (2009) and Adler and Benbunan-Fich (2012) motivate the attention-switching analysis. The essay named below is about coordinating 80 vehicles you cannot see.",
            "Skenar i ndërtuar; Leroy (2009) dhe Adler e Benbunan-Fich (2012) e motivojnë analizën e kalimit të vëmendjes. Eseja e emërtuar më poshtë flet për koordinimin e 80 automjeteve që nuk i sheh.",
            "Konstruiertes Szenario; Leroy (2009) und Adler und Benbunan-Fich (2012) begründen die Analyse des Aufmerksamkeitswechsels. Der unten genannte Essay handelt von 80 Fahrzeugen, die man nicht sieht."),
          source: ["leroy-2009", "adler-benbunan-fich-2012"],
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Attention residue", "Mbetja e vëmendjes", "Aufmerksamkeitsrest"), x("and unfinished work", "dhe puna e papërfunduar", "und unerledigte Arbeit")],
          lead: x(
            "Moving to the next task is not the same as having mentally left the previous one.",
            "Kalimi te detyra tjetër nuk është e njëjta gjë me të qenët larguar mendërisht nga e mëparshmja.",
            "Zur nächsten Aufgabe zu gehen heißt nicht, die vorige geistig verlassen zu haben."),
          blocks: [
            { type: "p", text: x(
              "Sophie Leroy (2009) studied switching between work tasks in experiments. Her account of attention residue describes how thoughts about an unfinished task can stay active and impair performance on the next one. The experiments do not establish that every multitasking operator becomes less accurate, and they should not become a rule against parallel work. A dispatcher often cannot finish each case before responding to the next. The problem is not sequential versus parallel work in the abstract; it is how the operation makes unfinished items, responsibilities and return points visible while new demands are prioritised. A status that has been seen is not a case that has been decided, and a decided case may still await confirmation. Adler and Benbunan-Fich (2012) found in a controlled experiment that the answer depends on what is measured: efficiency followed an inverted U across multitasking intensity, while accuracy declined as multitasking increased. That cautions against judging a busy coordinator by throughput or messages handled alone. Design can reduce unnecessary switching by pairing related information, clarifying ownership and defining task states that persist across transitions, without pretending that every task can be finished before the next request arrives.",
              "Sophie Leroy (2009) studioi kalimin mes detyrave të punës në eksperimente. Shpjegimi i saj për mbetjen e vëmendjes përshkruan si mendimet për një detyrë të papërfunduar mund të mbeten aktive dhe ta dëmtojnë performancën në detyrën tjetër. Eksperimentet nuk vërtetojnë se çdo operator që bën shumë gjëra njëherësh bëhet më pak i saktë, dhe nuk duhen kthyer në rregull kundër punës paralele. Një dispeçer shpesh nuk e mbaron dot çdo rast para se t'i përgjigjet të radhës. Problemi nuk është puna në radhë kundrejt asaj paralele në abstrakt; është si i bën operacioni të dukshme pikat e papërfunduara, përgjegjësitë dhe pikat e rikthimit ndërsa u jepet përparësi kërkesave të reja. Një status i parë nuk është rast i vendosur, dhe një rast i vendosur mund të presë ende konfirmim. Adler dhe Benbunan-Fich (2012) gjetën në një eksperiment të kontrolluar se përgjigjja varet nga ajo që matet: efikasiteti ndoqi një U të përmbysur sipas intensitetit të punës së njëkohshme, ndërsa saktësia ra sa më shumë rritej ajo. Kjo paralajmëron kundër gjykimit të një koordinatori të zënë vetëm sipas rrjedhës apo mesazheve të trajtuara. Projektimi mund ta ulë kalimin e panevojshëm duke çiftuar informacionin e lidhur, duke qartësuar pronësinë dhe duke përkufizuar gjendje detyrash që ruhen gjatë kalimeve, pa pretenduar se çdo detyrë mbaron dot para se të vijë kërkesa tjetër.",
              "Sophie Leroy (2009) untersuchte den Wechsel zwischen Arbeitsaufgaben in Experimenten. Ihr Begriff des Aufmerksamkeitsrests beschreibt, wie Gedanken an eine unerledigte Aufgabe aktiv bleiben und die Leistung bei der nächsten beeinträchtigen können. Die Experimente belegen nicht, dass jede Person beim Multitasking ungenauer wird, und sie sollten keine Regel gegen paralleles Arbeiten werden. Ein Disponent kann oft nicht jeden Fall abschließen, bevor er auf den nächsten reagiert. Das Problem ist nicht sequenziell gegen parallel im Abstrakten; es ist, wie der Betrieb offene Punkte, Zuständigkeiten und Rückkehrpunkte sichtbar macht, während neue Anforderungen priorisiert werden. Ein gesehener Status ist kein entschiedener Fall, und ein entschiedener Fall wartet vielleicht noch auf Bestätigung. Adler und Benbunan-Fich (2012) fanden in einem kontrollierten Experiment, dass die Antwort davon abhängt, was gemessen wird: Die Effizienz folgte einem umgekehrten U über die Multitasking-Intensität, während die Genauigkeit mit mehr Multitasking sank. Das warnt davor, eine ausgelastete Koordinatorin allein nach Durchsatz oder bearbeiteten Nachrichten zu beurteilen. Gestaltung kann unnötige Wechsel verringern, indem sie zusammengehörige Information bündelt, Zuständigkeit klärt und Aufgabenzustände definiert, die Übergänge überdauern, ohne so zu tun, als ließe sich jede Aufgabe vor der nächsten Anfrage abschließen.") },
            { type: "rows", compact: true, items: [
              { h: x("Seen", "E parë", "Gesehen"), p: x("Information reached the user's attention.", "Informacioni arriti te vëmendja e përdoruesit.", "Die Information hat die Aufmerksamkeit erreicht.") },
              { h: x("Owned", "Me pronar", "Zugeordnet"), p: x("A person is responsible for the next action.", "Një person është përgjegjës për veprimin e radhës.", "Eine Person ist für die nächste Handlung zuständig.") },
              { h: x("Resolved", "E zgjidhur", "Gelöst"), p: x("A verified outcome or an authorised transfer has occurred.", "Ka ndodhur një rezultat i verifikuar ose një kalim i autorizuar.", "Ein geprüftes Ergebnis oder eine befugte Übergabe liegt vor.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The three statuses are different managerial commitments; one must not stand in for another.",
              "Tri statuset janë angazhime të ndryshme menaxheriale; njëri nuk duhet të zërë vendin e tjetrit.",
              "Die drei Status sind verschiedene Führungszusagen; keiner darf für einen anderen stehen.") },
          ],
          note: x(
            "Leroy (2009), Organizational Behavior and Human Decision Processes 109(2); Adler and Benbunan-Fich (2012). The three-status framework is editorial, not a software specification.",
            "Leroy (2009), Organizational Behavior and Human Decision Processes 109(2); Adler e Benbunan-Fich (2012). Kuadri me tri statuse është editorial, jo specifikim softueri.",
            "Leroy (2009), Organizational Behavior and Human Decision Processes 109(2); Adler und Benbunan-Fich (2012). Das Drei-Status-Schema ist redaktionell, keine Softwarespezifikation."),
          source: ["leroy-2009", "adler-benbunan-fich-2012"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("When productivity", "Kur produktiviteti", "Wenn Produktivität"), x("hides lost accuracy", "fsheh saktësinë e humbur", "verlorene Genauigkeit verdeckt")],
          lead: x(
            "The metric used to judge multitasking can change the conclusion about whether it helps.",
            "Matja që përdoret për të gjykuar punën e njëkohshme mund ta ndryshojë përfundimin nëse ajo ndihmon.",
            "Die Kennzahl, mit der Multitasking beurteilt wird, kann das Urteil darüber ändern, ob es hilft."),
          blocks: [
            { type: "p", text: x(
              "Adler and Benbunan-Fich (2012) investigated multitasking in a computer-based controlled experiment. They distinguished efficiency, roughly productive output, from effectiveness, correctness. Efficiency rose and then fell across levels of multitasking; accuracy declined at higher levels. The results describe the research task, not real dispatch. The distinction still matters. A team may congratulate itself for answering more messages per hour while leaving more unresolved items to revisit; another may handle fewer immediate requests and achieve better first-time resolution. Without a quality measure, the faster queue looks like the winner even if it creates rework. Attention residue adds a second mechanism: the worker may carry an unfinished question into the next task, and a dashboard that shows many statuses at once cannot show whether the operator has mentally released the earlier goal. The remedies are partly informational: make commitments explicit, show what remains open and avoid duplication across channels. The right metric pairing depends on the process, for example response timeliness with correctly resolved exceptions in last-mile coordination, or report completion with verified open-item continuity in a hotel. These are candidate metrics, not measurements from an employer.",
              "Adler dhe Benbunan-Fich (2012) hetuan punën e njëkohshme në një eksperiment të kontrolluar me kompjuter. Ata e dalluan efikasitetin, përafërsisht rezultatin produktiv, nga efektiviteti, saktësia. Efikasiteti u rrit dhe pastaj ra sipas niveleve të punës së njëkohshme; saktësia ra në nivelet më të larta. Rezultatet përshkruajnë detyrën e kërkimit, jo dispeçerimin e vërtetë. Dallimi ka prapë rëndësi. Një ekip mund ta përgëzojë veten që u përgjigjet më shumë mesazheve në orë, ndërsa lë më shumë pika të pazgjidhura për t'u rishikuar; një tjetër mund të trajtojë më pak kërkesa të menjëhershme dhe të arrijë zgjidhje më të mirë që herën e parë. Pa një matje cilësie, radha më e shpejtë duket fituese edhe kur krijon ripunim. Mbetja e vëmendjes shton një mekanizëm të dytë: punonjësi mund ta bartë një pyetje të papërfunduar te detyra tjetër, dhe një panel që tregon shumë statuse njëherësh nuk tregon dot nëse operatori e ka lëshuar mendërisht qëllimin e mëparshëm. Ilaçet janë pjesërisht informacionale: bëji angazhimet të shprehura, trego çfarë mbetet e hapur dhe shmang dyfishimin nëpër kanale. Çifti i duhur i matjeve varet nga procesi, për shembull koha e përgjigjes me përjashtimet e zgjidhura saktë në koordinimin e miljes së fundit, ose përfundimi i raportit me vazhdimësinë e verifikuar të pikave të hapura në hotel. Këto janë matje kandidate, jo matje nga një punëdhënës.",
              "Adler und Benbunan-Fich (2012) untersuchten Multitasking in einem computergestützten, kontrollierten Experiment. Sie unterschieden Effizienz, grob der produktive Ausstoß, von Wirksamkeit, der Richtigkeit. Die Effizienz stieg und fiel über die Multitasking-Stufen; die Genauigkeit sank auf höheren Stufen. Die Ergebnisse beschreiben die Versuchsaufgabe, nicht echte Disposition. Der Unterschied zählt dennoch. Ein Team mag sich beglückwünschen, mehr Nachrichten pro Stunde zu beantworten, während es mehr offene Punkte zum Nacharbeiten hinterlässt; ein anderes bearbeitet weniger Sofortanfragen und erreicht bessere Erstlösungen. Ohne Qualitätsmaß sieht die schnellere Warteschlange wie der Sieger aus, auch wenn sie Nacharbeit erzeugt. Der Aufmerksamkeitsrest fügt einen zweiten Mechanismus hinzu: Die Person trägt eine unerledigte Frage in die nächste Aufgabe, und ein Dashboard mit vielen Status zeigt nicht, ob sie das frühere Ziel geistig losgelassen hat. Die Abhilfen sind zum Teil informationell: Zusagen ausdrücklich machen, Offenes zeigen und Doppelungen über Kanäle vermeiden. Das passende Kennzahlenpaar hängt vom Prozess ab, etwa Antworttempo mit richtig gelösten Ausnahmen in der Last-Mile-Koordination oder Berichtsabschluss mit geprüfter Fortführung offener Punkte im Hotel. Das sind Kandidaten, keine Messungen bei einem Arbeitgeber.") },
            { type: "rows", compact: true, label: x("Conceptual trade-off, not field data", "Shkëmbim konceptual, jo të dhëna terreni", "Begriffliche Abwägung, keine Felddaten"), items: [
              { h: x("Low switching", "Kalim i pakët", "Wenig Wechsel"), p: x("Baseline: review the output and its quality together.", "Bazë: rishiko bashkë rezultatin dhe cilësinë e tij.", "Ausgangslage: Ausstoß und Qualität zusammen prüfen.") },
              { h: x("Moderate switching", "Kalim i moderuar", "Mäßiger Wechsel"), p: x("Variable: output may rise; check whether accuracy holds.", "E ndryshueshme: rezultati mund të rritet; kontrollo nëse saktësia mbahet.", "Schwankend: Ausstoß kann steigen; prüfen, ob die Genauigkeit hält.") },
              { h: x("High switching", "Kalim i shpeshtë", "Häufiger Wechsel"), p: x("Risk: review open items, rework and missed follow-ups first.", "Rrezik: rishiko së pari pikat e hapura, ripunimin dhe ndjekjet e humbura.", "Risiko: zuerst offene Punkte, Nacharbeit und versäumte Nachfassungen prüfen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Being fast at switching is not proof that the right actions have been completed.",
              "Të qenët i shpejtë në kalime nuk është provë se janë kryer veprimet e duhura.",
              "Schnell zu wechseln beweist nicht, dass die richtigen Handlungen erledigt sind.") },
          ],
          note: x(
            "Adler and Benbunan-Fich (2012), International Journal of Human-Computer Studies 70(2); Leroy (2009). The three rows are an editorial review order, not study results or a universal scale.",
            "Adler e Benbunan-Fich (2012), International Journal of Human-Computer Studies 70(2); Leroy (2009). Tri rreshtat janë radhë editoriale rishikimi, jo rezultate studimi apo shkallë universale.",
            "Adler und Benbunan-Fich (2012), International Journal of Human-Computer Studies 70(2); Leroy (2009). Die drei Zeilen sind eine redaktionelle Prüfreihenfolge, keine Studienergebnisse und keine universelle Skala."),
          source: ["adler-benbunan-fich-2012", "leroy-2009"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Design for several", "Projekto për disa", "Für mehrere offene"), x("open commitments", "angazhime të hapura", "Zusagen gestalten")],
          lead: x(
            "A coordination role needs a trustworthy record of what remains to be decided, not more notifications about the same work.",
            "Një rol koordinimi ka nevojë për një regjistër të besueshëm të asaj që mbetet për t'u vendosur, jo për më shumë njoftime për të njëjtën punë.",
            "Eine Koordinationsrolle braucht einen verlässlichen Nachweis dessen, was noch zu entscheiden ist, nicht mehr Benachrichtigungen über dieselbe Arbeit."),
          blocks: [
            { type: "steps", items: [
              { h: x("Map the signal streams", "Harto rrjedhat e sinjaleve", "Die Signalströme kartieren"), p: x("List message types without copying route or customer data.", "Rendit llojet e mesazheve pa kopjuar të dhëna rrugësh apo klientësh.", "Nachrichtentypen auflisten, ohne Tour- oder Kundendaten zu kopieren.") },
              { h: x("Identify decisions", "Identifiko vendimet", "Entscheidungen erkennen"), p: x("Separate information from requests that change the action.", "Ndaje informacionin nga kërkesat që e ndryshojnë veprimin.", "Information von Anfragen trennen, die das Handeln ändern.") },
              { h: x("Assign clear ownership", "Cakto pronësi të qartë", "Klare Zuständigkeit"), p: x("Who is responsible, and who only needs visibility.", "Kush është përgjegjës, dhe kujt i duhet vetëm të shohë.", "Wer zuständig ist und wer nur sehen muss.") },
              { h: x("Expose unfinished states", "Shfaq gjendjet e papërfunduara", "Offene Zustände zeigen"), p: x("Approved status values for pending, delegated and verified.", "Vlera statusi të miratuara për në pritje, të deleguar dhe të verifikuar.", "Genehmigte Statuswerte für offen, delegiert und geprüft.") },
              { h: x("Consolidate duplicates", "Bashko dublikatat", "Doppelte bündeln"), p: x("Repeated alerts about the same underlying issue.", "Sinjalet e përsëritura për të njëjtën çështje themelore.", "Wiederholte Signale zum selben Grundproblem.") },
              { h: x("Check result quality", "Kontrollo cilësinë e rezultatit", "Ergebnisqualität prüfen"), p: x("Missed follow-ups, rework and response to critical events.", "Ndjekjet e humbura, ripunimi dhe përgjigja ndaj ngjarjeve kritike.", "Versäumte Nachfassungen, Nacharbeit und Antwort auf kritische Ereignisse.") },
            ] },
            { type: "p", text: x(
              "The target is the lowest avoidable burden consistent with reliable service, not the fewest messages: one high-priority message may rightly interrupt everything, while ten routine duplicates may be unnecessary. Start with one safely observable process and prefer an approved interface to new personal trackers.",
              "Objektivi është barra më e ulët e shmangshme që pajtohet me shërbim të besueshëm, jo më pak mesazhe: një mesazh me përparësi të lartë mund ta ndërpresë me të drejtë gjithçka, ndërsa dhjetë dublikata rutinë mund të jenë të panevojshme. Nis me një proces që vëzhgohet pa rrezik dhe parapëlqe një ndërfaqe të miratuar ndaj gjurmuesve të rinj personalë.",
              "Ziel ist die geringste vermeidbare Last bei verlässlichem Service, nicht die wenigsten Nachrichten: Eine Nachricht hoher Priorität darf zu Recht alles unterbrechen, zehn routinemäßige Doppelungen sind vielleicht unnötig. Mit einem sicher beobachtbaren Prozess beginnen und eine genehmigte Oberfläche neuen persönlichen Listen vorziehen.") },
            { type: "callout", reading: true, text: x(
              "A multi-signal role deserves a multi-commitment design, not a demand for impossible memory.",
              "Një rol me shumë sinjale meriton një projektim për shumë angazhime, jo kërkesë për kujtesë të pamundur.",
              "Eine Rolle mit vielen Signalen verdient eine Gestaltung für viele Zusagen, keine Forderung nach unmöglichem Gedächtnis.") },
          ],
          note: x(
            "Editorial process design drawing on Leroy (2009), Adler and Benbunan-Fich (2012) and Trafton et al. (2003).",
            "Projektim editorial procesi i mbështetur te Leroy (2009), Adler e Benbunan-Fich (2012) dhe Trafton et al. (2003).",
            "Redaktionelle Prozessgestaltung nach Leroy (2009), Adler und Benbunan-Fich (2012) und Trafton et al. (2003)."),
          source: ["leroy-2009", "adler-benbunan-fich-2012", "trafton-2003"],
        },
      ],
    },

    // Chapter V. The hidden cost of switching
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("The hidden cost of switching", "Kostoja e fshehur e kalimit", "Die verborgenen Kosten des Wechselns"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "high-volume-days",
          title: [x("The busy shift", "Turni i ngarkuar", "Die volle Schicht,"), x("that looks productive", "që duket produktiv", "die produktiv aussieht")],
          lead: x(
            "A quick response can be genuinely useful and still impose a cost that routine throughput does not reveal.",
            "Një përgjigje e shpejtë mund të jetë vërtet e dobishme dhe prapë të vendosë një kosto që rrjedha rutinë nuk e zbulon.",
            "Eine schnelle Antwort kann wirklich nützen und trotzdem Kosten verursachen, die der übliche Durchsatz nicht zeigt."),
          blocks: [
            { type: "flag", text: x("Hypothetical multi-task scene, not a measured workplace event", "Skenë hipotetike me shumë detyra, jo ngjarje e matur pune", "Hypothetische Mehrfachaufgabe, kein gemessenes Ereignis") },
            { type: "p", text: x(
              "A coordinator clears a queue of short questions before returning to a report. The messages are handled quickly. A manager notices the response count and praises the pace. The worker has also returned to the report four times, rechecked the previous section twice and stayed tense about an unresolved decision. The dashboard records the questions answered, not the repeated mental rebuilding. It would be equally misleading to claim the interruptions necessarily delayed the report. Some may have been related to the same task and helpful; a question can prevent an error or bring information the worker did not have. What matters is the combined cost and benefit: was the new demand necessary, was it routed to the right person, what quality resulted and what effort was needed to recover the original activity? A professionally designed metric should not reward quick messages while ignoring reopened cases, late verification or exhaustion, nor suppress critical communication to make the statistics look good.",
              "Një koordinator e pastron një radhë pyetjesh të shkurtra para se të kthehet te një raport. Mesazhet trajtohen shpejt. Një menaxher e vë re numrin e përgjigjeve dhe e lavdëron ritmin. Punonjësi është kthyer gjithashtu katër herë te raporti, e ka rikontrolluar dy herë pjesën e mëparshme dhe ka mbetur i tensionuar për një vendim të pazgjidhur. Paneli regjistron pyetjet e përgjigjura, jo rindërtimin mendor të përsëritur. Do të ishte po aq mashtruese të pohohej se ndërprerjet e vonuan doemos raportin. Disa mund të kenë qenë të lidhura me të njëjtën detyrë dhe të dobishme; një pyetje mund të parandalojë një gabim ose të sjellë informacion që punonjësi nuk e kishte. Ajo që ka rëndësi është kostoja dhe përfitimi bashkë: a ishte e nevojshme kërkesa e re, a iu drejtua personit të duhur, çfarë cilësie doli dhe çfarë mundimi u desh për ta rikuperuar veprimtarinë fillestare? Një matje e projektuar profesionalisht nuk duhet t'i shpërblejë mesazhet e shpejta duke shpërfillur rastet e rihapura, verifikimin e vonuar apo lodhjen, dhe as ta shtypë komunikimin kritik që statistikat të duken mirë.",
              "Ein Koordinator arbeitet eine Reihe kurzer Fragen ab, bevor er zu einem Bericht zurückkehrt. Die Nachrichten sind schnell erledigt. Eine Vorgesetzte sieht die Zahl der Antworten und lobt das Tempo. Er ist aber auch viermal zum Bericht zurückgekehrt, hat den vorigen Abschnitt zweimal nachgeprüft und blieb wegen einer offenen Entscheidung angespannt. Das Dashboard erfasst die beantworteten Fragen, nicht den wiederholten geistigen Neuaufbau. Ebenso irreführend wäre die Behauptung, die Unterbrechungen hätten den Bericht zwingend verzögert. Manche gehörten vielleicht zur selben Aufgabe und halfen; eine Frage kann einen Fehler verhindern oder Information bringen, die fehlte. Entscheidend ist Kosten und Nutzen zusammen: War die neue Anforderung nötig, ging sie an die richtige Person, welche Qualität entstand und welcher Aufwand war nötig, um die ursprüngliche Tätigkeit wiederzugewinnen? Eine professionell gestaltete Kennzahl sollte schnelle Nachrichten nicht belohnen und dabei wieder geöffnete Fälle, späte Prüfung oder Erschöpfung übersehen, noch kritische Kommunikation unterdrücken, damit die Statistik gut aussieht.") },
            { type: "p", text: x(
              "This illustration has no real call logs, times or error rates; the counts are invented. It describes a plausible tension in work with many requests, and the literature itself does not point in one simple direction: speed and strain may move differently.",
              "Ky ilustrim nuk ka regjistra të vërtetë telefonatash, kohë apo norma gabimesh; numrat janë të shpikur. Përshkruan një tension të besueshëm në punën me shumë kërkesa, dhe vetë literatura nuk tregon një drejtim të thjeshtë: shpejtësia dhe ngarkesa mund të lëvizin ndryshe.",
              "Diese Illustration enthält keine echten Anrufprotokolle, Zeiten oder Fehlerquoten; die Zahlen sind erfunden. Sie beschreibt eine plausible Spannung in Arbeit mit vielen Anfragen, und die Literatur selbst weist nicht in eine einfache Richtung: Tempo und Belastung können sich verschieden bewegen.") },
            { type: "callout", reading: true, text: x(
              "Completed output is a partial description of performance, not the full experience of producing it.",
              "Rezultati i përfunduar është përshkrim i pjesshëm i performancës, jo gjithë përvoja e prodhimit të tij.",
              "Erledigter Ausstoß beschreibt die Leistung nur teilweise, nicht die ganze Erfahrung, ihn zu erzeugen.") },
          ],
          note: x(
            "Constructed scenario; Mark, Gudith and Klocke (2008); Bailey and Konstan (2006). The essay named below is about days when demand outran the forecast.",
            "Skenar i ndërtuar; Mark, Gudith e Klocke (2008); Bailey e Konstan (2006). Eseja e emërtuar më poshtë flet për ditët kur kërkesa e kaloi parashikimin.",
            "Konstruiertes Szenario; Mark, Gudith und Klocke (2008); Bailey und Konstan (2006). Der unten genannte Essay handelt von Tagen, an denen die Nachfrage die Prognose überholte."),
          source: ["mark-gudith-klocke-2008", "bailey-konstan-2006"],
        },
        {
          id: "v-evidence", layer: "concept",
          title: [x("Faster completion,", "Përfundim më i shpejtë,", "Schneller fertig,"), x("higher reported strain", "ngarkesë më e lartë e raportuar", "höhere berichtete Belastung")],
          lead: x(
            "A result that challenges the idea that the only cost of interruptions is elapsed time.",
            "Një rezultat që e sfidon idenë se e vetmja kosto e ndërprerjeve është koha që kalon.",
            "Ein Ergebnis, das die Vorstellung infrage stellt, die einzigen Kosten von Unterbrechungen seien verstrichene Zeit."),
          blocks: [
            { type: "p", text: x(
              "Mark, Gudith and Klocke (2008) reported an empirical study in which people completed interrupted tasks in less time, with no difference in quality. Their data suggest that people compensate by working faster, at a price: more stress, higher frustration, time pressure and effort. The counterintuitive finding deserves to be kept, not edited away to support a simple productivity slogan. It suggests that an output metric may look favourable while the work feels more demanding. It does not mean interruptions make all workers faster, or that compensation is sustainable across long shifts, and it does not show burnout, which the study did not measure. Bailey and Konstan (2006) likewise measured performance together with annoyance and anxiety, a reminder that the human cost of information systems cannot be read from completion time alone. Brumby and colleagues (2013), in turn, showed that faster resumption can create accuracy problems under particular laboratory conditions. A sound operational study therefore needs a balanced view: completion, quality or error, the urgency of incoming requests and a measure of experienced strain. If only speed improves, the evidence for overall improvement is incomplete.",
              "Mark, Gudith dhe Klocke (2008) raportuan një studim empirik në të cilin njerëzit i përfunduan detyrat e ndërprera për më pak kohë, pa dallim në cilësi. Të dhënat e tyre sugjerojnë se njerëzit kompensojnë duke punuar më shpejt, me një çmim: më shumë stres, frustrim më të lartë, presion kohe dhe mundim. Kjo gjetje e papritur meriton të ruhet, jo të fshihet për të mbështetur një slogan të thjeshtë produktiviteti. Sugjeron se një matje rezultati mund të duket e favorshme, ndërsa puna ndihet më kërkuese. Nuk do të thotë se ndërprerjet i bëjnë të gjithë punonjësit më të shpejtë, ose se kompensimi është i qëndrueshëm gjatë turneve të gjata, dhe nuk tregon djegie profesionale, të cilën studimi nuk e mati. Bailey dhe Konstan (2006) matën gjithashtu performancën bashkë me bezdinë dhe ankthin, një kujtesë se kostoja njerëzore e sistemeve të informacionit nuk lexohet dot vetëm nga koha e përfundimit. Brumby dhe kolegët (2013), nga ana e tyre, treguan se rikthimi më i shpejtë mund të krijojë probleme saktësie në kushte të caktuara laboratorike. Një studim operacional i shëndoshë ka nevojë pra për një pamje të balancuar: përfundimin, cilësinë ose gabimin, urgjencën e kërkesave që vijnë dhe një matje të ngarkesës së përjetuar. Nëse përmirësohet vetëm shpejtësia, prova për përmirësim të përgjithshëm është e paplotë.",
              "Mark, Gudith und Klocke (2008) berichteten eine empirische Studie, in der Menschen unterbrochene Aufgaben in kürzerer Zeit erledigten, ohne Unterschied in der Qualität. Ihre Daten deuten darauf, dass Menschen durch schnelleres Arbeiten ausgleichen, zu einem Preis: mehr Stress, höhere Frustration, Zeitdruck und Anstrengung. Der überraschende Befund verdient es, bewahrt zu werden, statt für einen einfachen Produktivitätsslogan weggeschnitten. Er legt nahe, dass eine Ausstoßkennzahl günstig aussehen kann, während die Arbeit sich anstrengender anfühlt. Er heißt nicht, dass Unterbrechungen alle schneller machen oder dass der Ausgleich über lange Schichten trägt, und er zeigt kein Burnout, das die Studie nicht gemessen hat. Bailey und Konstan (2006) maßen ebenfalls Leistung zusammen mit Ärger und Angst, eine Erinnerung daran, dass die menschlichen Kosten von Informationssystemen nicht allein an der Erledigungszeit abzulesen sind. Brumby und Kollegen (2013) wiederum zeigten, dass schnellere Wiederaufnahme unter bestimmten Laborbedingungen Genauigkeitsprobleme erzeugen kann. Eine solide Betriebsstudie braucht daher einen ausgewogenen Blick: Erledigung, Qualität oder Fehler, Dringlichkeit eingehender Anfragen und ein Maß erlebter Belastung. Verbessert sich nur das Tempo, ist der Beleg für eine Gesamtverbesserung unvollständig.") },
            { type: "stat", n: "2008", t: x(
              "a controlled study reported faster completion of interrupted tasks alongside greater reported stress and effort (Mark, Gudith and Klocke, CHI 2008): not an operational KPI.",
              "një studim i kontrolluar raportoi përfundim më të shpejtë të detyrave të ndërprera bashkë me stres e mundim më të madh të raportuar (Mark, Gudith e Klocke, CHI 2008): jo KPI operacional.",
              "eine kontrollierte Studie berichtete schnellere Erledigung unterbrochener Aufgaben bei mehr berichtetem Stress und Aufwand (Mark, Gudith und Klocke, CHI 2008): keine betriebliche KPI.") },
            { type: "callout", reading: true, text: x(
              "An apparent productivity gain may coexist with a human cost not visible in the ordinary report.",
              "Një fitim i dukshëm produktiviteti mund të bashkëjetojë me një kosto njerëzore që nuk duket në raportin e zakonshëm.",
              "Ein scheinbarer Produktivitätsgewinn kann mit menschlichen Kosten einhergehen, die der übliche Bericht nicht zeigt.") },
          ],
          note: x(
            "Mark, Gudith and Klocke (2008), CHI 2008, 107–110; Bailey and Konstan (2006); Brumby et al. (2013).",
            "Mark, Gudith e Klocke (2008), CHI 2008, 107–110; Bailey e Konstan (2006); Brumby et al. (2013).",
            "Mark, Gudith und Klocke (2008), CHI 2008, 107–110; Bailey und Konstan (2006); Brumby et al. (2013)."),
          source: ["mark-gudith-klocke-2008", "bailey-konstan-2006", "brumby-2013"],
        },
        {
          id: "v-model", layer: "concept",
          title: [x("Estimate without", "Vlerëso pa", "Schätzen, ohne"), x("inventing a benchmark", "shpikur një pikë referimi", "einen Richtwert zu erfinden")],
          lead: x(
            "A transparent illustrative calculation is more useful than a viral rule about minutes lost per interruption.",
            "Një llogaritje ilustruese e hapur është më e dobishme se një rregull viral për minutat e humbura në çdo ndërprerje.",
            "Eine offene Beispielrechnung nützt mehr als eine virale Regel über verlorene Minuten je Unterbrechung."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 480, hypothetical: true,
              label: x("Synthetic re-entry time per day, 40 seconds assumed per switch", "Kohë sintetike rihyrjeje në ditë, 40 sekonda të supozuara për kalim", "Synthetische Wiedereinstiegszeit pro Tag, 40 Sekunden je Wechsel angenommen"),
              items: [
                { k: x("Before: 12 switches", "Para: 12 kalime", "Vorher: 12 Wechsel"), v: 480, n: "8:00", alert: true },
                { k: x("After: 7 switches", "Pas: 7 kalime", "Nachher: 7 Wechsel"), v: 280, n: "4:40" },
              ] },
            { type: "p", text: x(
              "Suppose a hypothetical administrative role meets twelve task switches a day that need some resumption effort, and assume, purely for illustration, that each adds forty seconds to regain the right work state: 12 × 40 seconds = 480 seconds, or eight minutes. The time spent handling the incoming requests is not included; neither are mistakes, necessary rechecks or strain. Now imagine an authorised change in the routing of routine messages cuts the switches needing full resumption from twelve to seven, with the same assumed forty seconds: 7 × 40 = 280 seconds, four minutes forty, a difference of 200 seconds, three minutes twenty a day in this toy example. No source cited here establishes forty seconds as an average for a dispatcher, hotel employee or warehouse worker, and both counts are invented. Real re-entry times have distributions, depend on the task and cannot be multiplied naively when interruptions overlap or tasks are deliberately interleaved. The value is methodological: define the denominator, separate response time from resumption time and state what is assumed.",
              "Supozo se një rol hipotetik administrativ has dymbëdhjetë kalime detyrash në ditë që kërkojnë njëfarë mundimi rikthimi, dhe supozo, vetëm për ilustrim, se secili shton dyzet sekonda për ta rifituar gjendjen e duhur të punës: 12 × 40 sekonda = 480 sekonda, pra tetë minuta. Koha e harxhuar për kërkesat që vijnë nuk përfshihet; as gabimet, rikontrollet e nevojshme apo ngarkesa. Tani imagjino se një ndryshim i autorizuar në drejtimin e mesazheve rutinë i ul kalimet që kërkojnë rikthim të plotë nga dymbëdhjetë në shtatë, me të njëjtat dyzet sekonda të supozuara: 7 × 40 = 280 sekonda, katër minuta e dyzet, një diferencë prej 200 sekondash, tri minuta e njëzet në ditë në këtë shembull loje. Asnjë burim i cituar këtu nuk e vendos dyzet sekonda si mesatare për një dispeçer, punonjës hoteli apo magazine, dhe të dy numrat janë të shpikur. Kohët e vërteta të rihyrjes kanë shpërndarje, varen nga detyra dhe nuk shumëzohen dot thjesht kur ndërprerjet mbivendosen ose kur detyrat ndërthuren qëllimisht. Vlera është metodologjike: përkufizo emëruesin, ndaje kohën e përgjigjes nga koha e rikthimit dhe thuaj çfarë supozohet.",
              "Angenommen, eine hypothetische Verwaltungsrolle hat zwölf Aufgabenwechsel am Tag, die etwas Wiederaufnahme verlangen, und rein zur Veranschaulichung kostet jeder vierzig Sekunden, um den richtigen Arbeitsstand wiederzufinden: 12 × 40 Sekunden = 480 Sekunden, also acht Minuten. Die Zeit für die eingehenden Anfragen ist nicht enthalten, ebenso wenig Fehler, nötige Nachprüfungen oder Belastung. Nun senke eine befugte Änderung der Leitung von Routinenachrichten die Wechsel mit voller Wiederaufnahme von zwölf auf sieben, bei denselben angenommenen vierzig Sekunden: 7 × 40 = 280 Sekunden, vier Minuten vierzig, eine Differenz von 200 Sekunden, drei Minuten zwanzig am Tag in diesem Spielbeispiel. Keine hier zitierte Quelle belegt vierzig Sekunden als Durchschnitt für Disposition, Hotel oder Lager, und beide Zahlen sind erfunden. Echte Wiedereinstiegszeiten haben Verteilungen, hängen von der Aufgabe ab und lassen sich nicht naiv multiplizieren, wenn Unterbrechungen sich überlagern oder Aufgaben bewusst verschränkt werden. Der Wert ist methodisch: den Nenner festlegen, Antwortzeit von Wiederaufnahmezeit trennen und Annahmen nennen.") },
            { type: "callout", reading: true, text: x(
              "The calculation teaches how to ask a question; it does not answer how much an actual employer loses.",
              "Llogaritja mëson si të bëhet një pyetje; nuk i përgjigjet sa humbet një punëdhënës i vërtetë.",
              "Die Rechnung lehrt, eine Frage zu stellen; sie beantwortet nicht, wie viel ein echter Arbeitgeber verliert.") },
          ],
          note: x(
            "The whole figure and the arithmetic are hypothetical: 12 × 40 s = 480 s; 7 × 40 s = 280 s; 480 − 280 = 200 s. No empirical average re-entry time is claimed.",
            "E gjithë figura dhe aritmetika janë hipotetike: 12 × 40 s = 480 s; 7 × 40 s = 280 s; 480 − 280 = 200 s. Nuk pretendohet asnjë kohë mesatare empirike rihyrjeje.",
            "Die ganze Abbildung und die Rechnung sind hypothetisch: 12 × 40 s = 480 s; 7 × 40 s = 280 s; 480 − 280 = 200 s. Keine empirische durchschnittliche Wiedereinstiegszeit wird behauptet."),
        },
        {
          id: "v-safety", layer: "concept",
          title: [x("Where errors", "Ku gabimet", "Wo Fehler"), x("change the stakes", "ndryshojnë rrezikun", "den Einsatz ändern")],
          lead: x(
            "In high-consequence work, interruptions demand more careful study than a count of notifications per hour.",
            "Në punën me pasoja të larta, ndërprerjet kërkojnë studim më të kujdesshëm se një numërim njoftimesh në orë.",
            "Bei folgenreicher Arbeit verlangen Unterbrechungen eine sorgfältigere Untersuchung als eine Zählung von Meldungen pro Stunde."),
          blocks: [
            { type: "pairs", from: x("No interruption", "Pa ndërprerje", "Keine Unterbrechung"), to: x("Three interruptions", "Tri ndërprerje", "Drei Unterbrechungen"), max: 100,
              label: x("Share of medication administrations with a failure, by interruptions during the administration", "Pjesa e dhënieve të ilaçeve me një dështim, sipas ndërprerjeve gjatë dhënies", "Anteil der Medikamentengaben mit einem Fehler, nach Unterbrechungen während der Gabe"),
              rows: [
                { k: x("At least one procedural failure", "Të paktën një dështim procedural", "Mindestens ein Verfahrensfehler"), a: 69.6, an: x("69.6%", "69,6%", "69,6 %"), b: 84.6, bn: x("84.6%", "84,6%", "84,6 %") },
                { k: x("At least one clinical error", "Të paktën një gabim klinik", "Mindestens ein klinischer Fehler"), a: 25.3, an: x("25.3%", "25,3%", "25,3 %"), b: 38.9, bn: x("38.9%", "38,9%", "38,9 %"), alert: true },
              ] },
            { type: "p", text: x(
              "Westbrook and colleagues (2010) observed 98 nurses preparing and administering 4,271 medications on six wards of two teaching hospitals in Sydney, over 505 hours. Each interruption was associated with a 12.1% increase in procedural failures and a 12.7% increase in clinical errors, and severity rose with interruption frequency. The study is observational and about medication: it sets no causal percentage for logistics or hotels. Grundgeiger and Sanderson (2009) reviewed theoretical views of interruptions in healthcare: they can distract, but can also carry information safe coordination needs, so a blanket ban creates its own risks. The transferable question is how interruption and resumption interact with the consequence of a missed step. Protection is tiered: keep emergency communication first, make critical steps explicit through authorised controls, and for lower-risk work try pause points, quiet windows and return cues, with a downstream check on safety and service.",
              "Westbrook dhe kolegët (2010) vëzhguan 98 infermiere duke përgatitur dhe dhënë 4.271 ilaçe në gjashtë reparte të dy spitaleve universitare në Sidnei, gjatë 505 orëve. Çdo ndërprerje u shoqërua me 12,1% më shumë dështime procedurale dhe 12,7% më shumë gabime klinike, dhe rëndësia u rrit me shpeshtësinë e ndërprerjeve. Studimi është vëzhgues dhe për ilaçet: nuk vendos asnjë përqindje shkakësore për logjistikën apo hotelet. Grundgeiger dhe Sanderson (2009) shqyrtuan pikëpamjet teorike për ndërprerjet në shëndetësi: mund të shpërqendrojnë, por mund të mbartin edhe informacion që i duhet koordinimit të sigurt, prandaj një ndalim i përgjithshëm krijon rreziqet e veta. Pyetja që bartet është si ndërveprojnë ndërprerja dhe rikthimi me pasojën e një hapi të humbur. Mbrojtja bëhet me nivele: komunikimi i emergjencës i pari, hapat kritikë të shprehur përmes kontrolleve të autorizuara, dhe për punën me rrezik më të ulët pika ndalimi, dritare të qeta dhe shenja rikthimi, me një kontroll më poshtë në rrjedhë për sigurinë dhe shërbimin.",
              "Westbrook und Kollegen (2010) beobachteten 98 Pflegekräfte bei 4.271 Medikamentengaben auf sechs Stationen zweier Lehrkrankenhäuser in Sydney, über 505 Stunden. Jede Unterbrechung war mit 12,1 % mehr Verfahrensfehlern und 12,7 % mehr klinischen Fehlern verbunden, die Schwere stieg mit der Häufigkeit. Die Studie ist beobachtend und betrifft Medikamente: Sie setzt keinen kausalen Prozentsatz für Logistik oder Hotels. Grundgeiger und Sanderson (2009) gaben einen Überblick über theoretische Sichten im Gesundheitswesen: Unterbrechungen lenken ab, tragen aber auch Information für sichere Koordination, sodass ein Pauschalverbot eigene Risiken schafft. Übertragbar ist die Frage, wie Unterbrechung und Wiederaufnahme mit der Folge eines ausgelassenen Schritts zusammenwirken. Der Schutz ist gestuft: Notfallkommunikation zuerst, kritische Schritte über befugte Kontrollen ausdrücklich machen und bei risikoärmerer Arbeit Haltepunkte, ruhige Fenster und Rückkehrhinweise erproben, mit nachgelagerter Prüfung von Sicherheit und Service.") },
            { type: "callout", reading: true, text: x(
              "The cost of an interruption depends partly on what could be lost, not only on how long attention moved away.",
              "Kostoja e një ndërprerjeje varet pjesërisht nga ajo që mund të humbasë, jo vetëm nga sa gjatë u largua vëmendja.",
              "Die Kosten einer Unterbrechung hängen auch davon ab, was verloren gehen kann, nicht nur davon, wie lange die Aufmerksamkeit weg war.") },
          ],
          note: x(
            "Westbrook et al. (2010), Archives of Internal Medicine 170(8): the rates in the chart are those of the abstract, observational associations in one sector; Grundgeiger and Sanderson (2009). The cross-sector application is editorial, not causal evidence.",
            "Westbrook et al. (2010), Archives of Internal Medicine 170(8): normat në grafik janë ato të abstraktit, lidhje vëzhguese në një sektor; Grundgeiger e Sanderson (2009). Zbatimi ndërsektorial është editorial, jo provë shkakësore.",
            "Westbrook et al. (2010), Archives of Internal Medicine 170(8): Die Quoten im Diagramm stammen aus dem Abstract, beobachtete Zusammenhänge in einer Branche; Grundgeiger und Sanderson (2009). Die Übertragung auf andere Branchen ist redaktionell, kein Kausalbeleg."),
          source: ["westbrook-2010", "grundgeiger-sanderson-2009"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Measure the switch,", "Mat kalimin,", "Den Wechsel messen,"), x("not the slogan", "jo sloganin", "nicht den Slogan")],
          lead: x(
            "Before any claim of saved minutes, separate the response from the return and count both sides of the trade.",
            "Para çdo pohimi për minuta të kursyera, ndaje përgjigjen nga rikthimi dhe numëro të dyja anët e shkëmbimit.",
            "Vor jeder Behauptung gesparter Minuten die Antwort von der Rückkehr trennen und beide Seiten zählen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Define the denominator", "Përkufizo emëruesin", "Den Nenner festlegen"), p: x("One task class, one observation window, the switches that need resumption.", "Një klasë detyrash, një dritare vëzhgimi, kalimet që kërkojnë rikthim.", "Eine Aufgabenklasse, ein Beobachtungsfenster, die Wechsel mit Wiederaufnahme.") },
              { h: x("Separate the two times", "Ndaji dy kohët", "Beide Zeiten trennen"), p: x("Time spent on the request apart from time to resume the task.", "Koha për kërkesën veçmas nga koha për t'u rikthyer te detyra.", "Zeit für die Anfrage getrennt von der Zeit bis zur Wiederaufnahme.") },
              { h: x("State the assumptions", "Thuaji supozimet", "Annahmen nennen"), p: x("Any assumed duration is written as an assumption, never as a finding.", "Çdo kohëzgjatje e supozuar shkruhet si supozim, kurrë si gjetje.", "Jede angenommene Dauer steht als Annahme da, nie als Befund.") },
              { h: x("Observe with permission", "Vëzhgo me leje", "Mit Erlaubnis beobachten"), p: x("Aggregated, lawful observations, not individual tracking.", "Vëzhgime të grupuara dhe të ligjshme, jo ndjekje individuale.", "Zusammengefasste, rechtmäßige Beobachtungen, keine Einzelverfolgung.") },
              { h: x("Pair speed with quality", "Çifto shpejtësinë me cilësinë", "Tempo mit Qualität koppeln"), p: x("Errors, reopened cases and reported strain beside elapsed time.", "Gabimet, rastet e rihapura dhe ngarkesa e raportuar pranë kohës që kaloi.", "Fehler, wieder geöffnete Fälle und berichtete Belastung neben der Zeit.") },
              { h: x("Protect the urgent path", "Mbro rrugën urgjente", "Den dringenden Weg schützen"), p: x("A change that saves minutes but delays important cases fails.", "Një ndryshim që kursen minuta, por vonon raste të rëndësishme, dështon.", "Eine Änderung, die Minuten spart, aber wichtige Fälle verzögert, scheitert.") },
            ] },
            { type: "p", text: x(
              "A small sample is enough if its limits are stated; voluntary reports are not every switch, and a busy week is not compared with a quiet one without saying so. Real re-entry times vary, so report the spread, not only an average. Where the work is safety-critical, the measurement itself must not delay a required response.",
              "Një mostër e vogël mjafton nëse kufijtë e saj thuhen; raportimet vullnetare nuk janë çdo kalim, dhe një javë e ngarkuar nuk krahasohet me një të qetë pa e thënë. Kohët e vërteta të rihyrjes ndryshojnë, prandaj raporto shpërndarjen, jo vetëm një mesatare. Kur puna është kritike për sigurinë, vetë matja nuk duhet ta vonojë një përgjigje të kërkuar.",
              "Eine kleine Stichprobe genügt, wenn ihre Grenzen genannt sind; freiwillige Meldungen sind nicht jeder Wechsel, und eine volle Woche wird nicht ohne Hinweis mit einer ruhigen verglichen. Echte Wiedereinstiegszeiten schwanken, also die Streuung berichten, nicht nur einen Durchschnitt. Ist die Arbeit sicherheitskritisch, darf die Messung selbst keine nötige Antwort verzögern.") },
            { type: "callout", reading: true, text: x(
              "A saved minute counts only if the next correct action and the next urgent request are both still served.",
              "Një minutë e kursyer ka vlerë vetëm nëse shërbehen ende edhe veprimi i radhës i saktë, edhe kërkesa e radhës urgjente.",
              "Eine gesparte Minute zählt nur, wenn die nächste richtige Handlung und die nächste dringende Anfrage beide noch bedient werden.") },
          ],
          note: x(
            "Editorial protocol added by the site, built from the method paragraphs of the author's PDF (Chapter V); informed by Mark et al. (2008) and Brumby et al. (2013). Not a validated measurement standard.",
            "Protokoll editorial i shtuar nga faqja, i ndërtuar nga paragrafët e metodës te PDF-ja e autorit (Kapitulli V); i mbështetur te Mark et al. (2008) dhe Brumby et al. (2013). Jo standard matjeje i vërtetuar.",
            "Von der Website ergänztes redaktionelles Protokoll, aus den Methodenabsätzen des PDF des Autors (Kapitel V) gebaut; nach Mark et al. (2008) und Brumby et al. (2013). Kein validierter Messstandard."),
          source: ["mark-gudith-klocke-2008", "brumby-2013"],
        },
      ],
    },

    // Chapter VI. Designing work for attention
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Designing work for attention", "Projektimi i punës për vëmendjen", "Arbeit für Aufmerksamkeit gestalten"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "why-the-handover-is-underrated",
          title: [x("The next shift", "Turni tjetër", "Die nächste Schicht"), x("can find the next step", "e gjen hapin tjetër", "findet den nächsten Schritt")],
          lead: x(
            "A strong workflow protects an unfinished commitment even when the person who began it must move elsewhere.",
            "Një rrjedhë e fortë pune e mbron një angazhim të papërfunduar edhe kur personi që e nisi duhet të shkojë gjetiu.",
            "Ein starker Ablauf schützt eine unerledigte Zusage, auch wenn die Person, die sie begann, woanders hin muss."),
          blocks: [
            { type: "flag", text: x("Hypothetical improvement scene, not a verified implementation", "Skenë hipotetike përmirësimi, jo zbatim i verifikuar", "Hypothetische Verbesserungsszene, keine geprüfte Umsetzung") },
            { type: "p", text: x(
              "A team reviews a recurring source of unfinished work at handovers. The problem is not that employees refuse to help each other. It is that the approved record lists the case but often leaves the next action unclear. People must ask colleagues what was done before the interruption; sometimes the person has already gone home when the question arises. Instead of introducing another personal spreadsheet, the responsible manager and staff identify one authorised place to record the current stage, the next permitted action and the owner. They test the change on a small number of non-sensitive cases. If the new record helps the next shift recover the task without duplicating effort, it may be built into the controlled process. If it creates more typing or slows urgent response, the design is revised. The lesson is not to document everything. It is to preserve enough of the work state to support the next correct action, with a cue workers can use while busy, inside an approved system, without a privacy risk or a conflicting source of truth.",
              "Një ekip shqyrton një burim të përsëritur pune të papërfunduar gjatë dorëzimeve. Problemi nuk është se punonjësit nuk duan ta ndihmojnë njëri-tjetrin. Është se regjistri i miratuar e rendit rastin, por shpesh e lë të paqartë veprimin e radhës. Njerëzit duhet t'i pyesin kolegët çfarë u bë para ndërprerjes; ndonjëherë personi ka ikur tashmë në shtëpi kur lind pyetja. Në vend që të futin edhe një fletë personale, menaxheri përgjegjës dhe stafi caktojnë një vend të autorizuar për të shënuar fazën aktuale, veprimin e radhës të lejuar dhe pronarin. E provojnë ndryshimin në një numër të vogël rastesh jo të ndjeshme. Nëse regjistri i ri e ndihmon turnin tjetër ta rikuperojë detyrën pa e dyfishuar mundimin, mund të futet në procesin e kontrolluar. Nëse krijon më shumë shtypje ose e ngadalëson përgjigjen urgjente, projektimi rishikohet. Mësimi nuk është të dokumentohet gjithçka. Është të ruhet aq nga gjendja e punës sa të mbështetet veprimi i radhës i saktë, me një shenjë që punonjësit e përdorin edhe kur janë të zënë, brenda një sistemi të miratuar, pa rrezik privatësie apo burim të vërtete që bie ndesh.",
              "Ein Team prüft eine wiederkehrende Quelle unerledigter Arbeit bei Übergaben. Das Problem ist nicht, dass Beschäftigte einander nicht helfen wollen. Es ist, dass der genehmigte Datensatz den Fall nennt, die nächste Handlung aber oft offen lässt. Man muss Kolleginnen fragen, was vor der Unterbrechung geschah; manchmal ist die Person schon gegangen, wenn die Frage aufkommt. Statt eine weitere persönliche Tabelle einzuführen, bestimmen die verantwortliche Führungskraft und das Personal einen befugten Ort für die aktuelle Stufe, die nächste erlaubte Handlung und die Verantwortliche. Sie testen die Änderung an wenigen unsensiblen Fällen. Hilft der neue Eintrag der nächsten Schicht, die Aufgabe ohne doppelte Arbeit wieder aufzunehmen, kann er in den kontrollierten Prozess eingehen. Erzeugt er mehr Tipparbeit oder verlangsamt dringende Antworten, wird die Gestaltung überarbeitet. Die Lehre ist nicht, alles zu dokumentieren. Sie lautet, genug vom Arbeitsstand zu bewahren, um die nächste richtige Handlung zu stützen, mit einem Hinweis, den Beschäftigte auch unter Druck nutzen können, in einem genehmigten System, ohne Datenschutzrisiko und ohne widersprüchliche zweite Wahrheit.") },
            { type: "p", text: x(
              "This is a constructed future state. The author has worked on operational handover guidance and Front Desk Control, but there is no verified before-and-after study showing that this intervention reduced errors in a hotel or transport company, and it would be wrong to claim that result on the strength of a plausible story.",
              "Kjo është një gjendje e ardhshme e ndërtuar. Autori ka punuar me udhëzime për dorëzimet operacionale dhe me Front Desk Control, por nuk ka asnjë studim të verifikuar para dhe pas që tregon se kjo ndërhyrje i uli gabimet në një hotel apo kompani transporti, dhe do të ishte gabim të pohohej ai rezultat mbi bazën e një historie të besueshme.",
              "Das ist ein konstruierter Zielzustand. Der Autor hat an betrieblichen Übergabeleitfäden und Front Desk Control gearbeitet, doch keine geprüfte Vorher-Nachher-Studie zeigt, dass dieser Eingriff Fehler in einem Hotel oder Transportunternehmen senkte, und es wäre falsch, dieses Ergebnis auf eine plausible Geschichte zu stützen.") },
            { type: "callout", reading: true, text: x(
              "Attention becomes more reliable when the operating system carries a clear, authorised memory of unfinished work.",
              "Vëmendja bëhet më e besueshme kur sistemi operativ mbart një kujtesë të qartë dhe të autorizuar të punës së papërfunduar.",
              "Aufmerksamkeit wird verlässlicher, wenn das Betriebssystem ein klares, befugtes Gedächtnis unerledigter Arbeit trägt.") },
          ],
          note: x(
            "Constructed scene; principles from Trafton et al. (2003), Brumby et al. (2013) and Leroy (2009). The essay named below says why the handover is underrated.",
            "Skenë e ndërtuar; parimet nga Trafton et al. (2003), Brumby et al. (2013) dhe Leroy (2009). Eseja e emërtuar më poshtë thotë pse dorëzimi nënvlerësohet.",
            "Konstruierte Szene; Grundsätze nach Trafton et al. (2003), Brumby et al. (2013) und Leroy (2009). Der unten genannte Essay sagt, warum die Übergabe unterschätzt wird."),
          source: ["trafton-2003", "brumby-2013", "leroy-2009"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Design the system", "Projekto sistemin", "Das System um"), x("around human limits", "rreth kufijve njerëzorë", "menschliche Grenzen bauen")],
          lead: x(
            "Operational resilience needs both responsive communication and the ability to resume work safely.",
            "Qëndrueshmëria operacionale ka nevojë edhe për komunikim që përgjigjet, edhe për aftësinë për t'u rikthyer në punë në mënyrë të sigurt.",
            "Betriebliche Widerstandskraft braucht reaktionsfähige Kommunikation und die Fähigkeit, sicher weiterzuarbeiten."),
          blocks: [
            { type: "p", text: x(
              "The evidence points to several design levers, each needing judgement. Timing matters: routine messages may disrupt less when they reach someone at a natural transition. Cues matter: a reliable record of the suspended goal can reduce reconstruction. The difficulty of the new task matters: demanding interruptions make returning harder under some experimental conditions. And speed is not everything: enough time to verify a resumed step may protect accuracy. No intervention follows automatically. Protected concentration windows can help low-risk analytical work but must never block urgent operational contact. A task marker can improve continuity but should not copy sensitive data outside official systems. Batching can reduce redundant switching but worsens service if the batch interval exceeds the permitted response time. The improvement owner should therefore map one process, set minimum service and safety conditions and evaluate one change, tracking incoming work as well as the original task. A resumption protocol that leaves critical requests unanswered is not excellent, and an alert system that achieves instant response through unverified follow-ups is not reliable. Experience differs and conditions change; review after workload, software and staffing changes. Attention-aware design is continuous governance, not a one-time feature.",
              "Prova tregon disa leva projektimi, secila me nevojë për gjykim. Koha ka rëndësi: mesazhet rutinë mund të ndërpresin më pak kur e arrijnë dikë në një kalim natyror. Shenjat kanë rëndësi: një regjistër i besueshëm i qëllimit të pezulluar mund ta ulë rindërtimin. Vështirësia e detyrës së re ka rëndësi: ndërprerjet kërkuese e bëjnë rikthimin më të vështirë në disa kushte eksperimentale. Dhe shpejtësia nuk është gjithçka: koha e mjaftueshme për të verifikuar një hap të rifilluar mund ta mbrojë saktësinë. Asnjë ndërhyrje nuk vjen automatikisht. Dritaret e mbrojtura të përqendrimit mund ta ndihmojnë punën analitike me rrezik të ulët, por nuk duhet ta bllokojnë kurrë kontaktin urgjent operacional. Një shënjues detyre mund ta përmirësojë vazhdimësinë, por nuk duhet të kopjojë të dhëna të ndjeshme jashtë sistemeve zyrtare. Grupimi mund ta ulë kalimin e tepërt, por e keqëson shërbimin nëse intervali i grupit e kalon kohën e lejuar të përgjigjes. Pronari i përmirësimit duhet pra të hartojë një proces, të vendosë kushtet minimale të shërbimit dhe sigurisë dhe të vlerësojë një ndryshim, duke ndjekur punën që vjen bashkë me detyrën fillestare. Një protokoll rikthimi që lë kërkesa kritike pa përgjigje nuk është i shkëlqyer, dhe një sistem sinjalesh që arrin përgjigje të menjëhershme përmes ndjekjesh të paverifikuara nuk është i besueshëm. Përvoja ndryshon dhe kushtet ndryshojnë; rishiko pas ndryshimeve të ngarkesës, softuerit dhe stafit. Projektimi që kujdeset për vëmendjen është qeverisje e vazhdueshme, jo veçori e njëhershme.",
              "Die Belege zeigen mehrere Gestaltungshebel, jeder verlangt Urteil. Der Zeitpunkt zählt: Routinenachrichten stören womöglich weniger, wenn sie an einem natürlichen Übergang ankommen. Hinweise zählen: Ein verlässlicher Eintrag des ruhenden Ziels kann Rekonstruktion verringern. Die Schwierigkeit der neuen Aufgabe zählt: Anspruchsvolle Unterbrechungen erschweren die Rückkehr unter manchen Versuchsbedingungen. Und Tempo ist nicht alles: Genug Zeit, einen wieder aufgenommenen Schritt zu prüfen, kann Genauigkeit schützen. Kein Eingriff folgt automatisch. Geschützte Konzentrationsfenster können risikoarmer Analysearbeit helfen, dürfen aber nie dringenden betrieblichen Kontakt blockieren. Eine Aufgabenmarkierung kann Kontinuität verbessern, sollte aber keine sensiblen Daten außerhalb offizieller Systeme kopieren. Bündeln kann überflüssige Wechsel senken, verschlechtert aber den Service, wenn das Intervall die erlaubte Antwortzeit übersteigt. Die Verbesserungsverantwortliche sollte daher einen Prozess kartieren, Mindestbedingungen für Service und Sicherheit setzen und eine Änderung prüfen, dabei die eingehende Arbeit ebenso verfolgen wie die ursprüngliche Aufgabe. Ein Wiederaufnahmeprotokoll, das kritische Anfragen unbeantwortet lässt, ist nicht ausgezeichnet, und ein Signalsystem, das sofortige Antwort durch ungeprüfte Nacharbeiten erreicht, ist nicht verlässlich. Erfahrung unterscheidet sich und Bedingungen ändern sich; nach Änderungen bei Last, Software und Personal erneut prüfen. Aufmerksamkeitsgerechte Gestaltung ist fortlaufende Steuerung, keine einmalige Funktion.") },
            { type: "chain", items: [
              { h: x("Distinguish", "Dallo", "Unterscheiden"), p: x("Urgency.", "Urgjencën.", "Dringlichkeit.") },
              { h: x("Preserve", "Ruaj", "Sichern"), p: x("Task state.", "Gjendjen e detyrës.", "Aufgabenstand.") },
              { h: x("Resume", "Rikthehu", "Fortsetzen"), p: x("Verify the step.", "Verifiko hapin.", "Schritt prüfen.") },
              { h: x("Learn", "Mëso", "Lernen"), p: x("Quality result.", "Rezultati i cilësisë.", "Qualitätsergebnis.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The goal is not to remove interruptions. It is to prevent avoidable loss of context while keeping essential communication open.",
              "Qëllimi nuk është të hiqen ndërprerjet. Është të parandalohet humbja e shmangshme e kontekstit, duke e mbajtur të hapur komunikimin thelbësor.",
              "Ziel ist nicht, Unterbrechungen abzuschaffen. Ziel ist, vermeidbaren Kontextverlust zu verhindern und wesentliche Kommunikation offen zu halten.") },
          ],
          note: x(
            "Synthesis of Adamczyk and Bailey (2004), Trafton et al. (2003), Monk et al. (2008) and Brumby et al. (2013).",
            "Sintezë e Adamczyk e Bailey (2004), Trafton et al. (2003), Monk et al. (2008) dhe Brumby et al. (2013).",
            "Synthese aus Adamczyk und Bailey (2004), Trafton et al. (2003), Monk et al. (2008) und Brumby et al. (2013)."),
          source: ["adamczyk-bailey-2004", "trafton-2003", "monk-trafton-boehm-davis-2008", "brumby-2013"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("A controlled", "Një cikël i kontrolluar", "Ein kontrollierter"), x("return-to-work cycle", "rikthimi në punë", "Rückkehrzyklus")],
          lead: x(
            "One bounded workflow, one owner and two kinds of outcome: task quality and response to the interruption.",
            "Një rrjedhë pune e kufizuar, një pronar dhe dy lloje rezultatesh: cilësia e detyrës dhe përgjigja ndaj ndërprerjes.",
            "Ein begrenzter Ablauf, eine Verantwortliche und zwei Arten Ergebnis: Aufgabenqualität und Antwort auf die Unterbrechung."),
          blocks: [
            { type: "steps", items: [
              { h: x("Observe the current flow", "Vëzhgo rrjedhën aktuale", "Den heutigen Ablauf beobachten"), p: x("Safe, real interruption categories and task stages.", "Kategori të sigurta e të vërteta ndërprerjesh dhe faza detyrash.", "Sichere, echte Unterbrechungsarten und Aufgabenstufen.") },
              { h: x("Protect the urgent path", "Mbro rrugën urgjente", "Den dringenden Weg schützen"), p: x("Confirm mandatory contact, response and escalation rules.", "Konfirmo rregullat e detyrueshme të kontaktit, përgjigjes dhe eskalimit.", "Pflichtregeln für Kontakt, Antwort und Eskalation bestätigen.") },
              { h: x("Preserve the state", "Ruaje gjendjen", "Den Stand sichern"), p: x("One approved place for the next action and its owner.", "Një vend i miratuar për veprimin e radhës dhe pronarin e tij.", "Ein genehmigter Ort für die nächste Handlung und ihre Verantwortliche.") },
              { h: x("Route routine work", "Drejto punën rutinë", "Routinearbeit leiten"), p: x("A safer timing or a better receiver for low-risk requests.", "Një kohë më e sigurt ose një marrës më i duhur për kërkesat me rrezik të ulët.", "Ein sichererer Zeitpunkt oder eine passendere Empfängerin für risikoarme Anfragen.") },
              { h: x("Resume with verification", "Rikthehu me verifikim", "Mit Prüfung fortsetzen"), p: x("Check the last critical step before marking work finished.", "Kontrollo hapin e fundit kritik para se ta shënosh punën të përfunduar.", "Den letzten kritischen Schritt prüfen, bevor die Arbeit als erledigt gilt.") },
              { h: x("Review and adjust", "Rishiko dhe përshtat", "Prüfen und anpassen"), p: x("Response reliability, accuracy, workload and staff feedback.", "Besueshmëria e përgjigjes, saktësia, ngarkesa dhe reagimet e stafit.", "Verlässlichkeit der Antwort, Genauigkeit, Last und Rückmeldung des Personals.") },
            ] },
            { type: "p", text: x(
              "Set a review date suited to the process; these studies establish no universal thirty-day period. Record the task mix so a busy week is not compared blindly with a quiet one, and publish only aggregated, anonymised learning. A quieter dashboard with more open cases is not a success.",
              "Vendos një datë rishikimi që i përshtatet procesit; këto studime nuk vendosin asnjë periudhë universale tridhjetëditore. Regjistro përbërjen e detyrave, që një javë e ngarkuar të mos krahasohet verbërisht me një të qetë, dhe publiko vetëm mësime të grupuara dhe anonime. Një panel më i qetë me më shumë raste të hapura nuk është sukses.",
              "Ein zum Prozess passendes Prüfdatum setzen; diese Studien begründen keinen universellen Zeitraum von dreißig Tagen. Den Aufgabenmix erfassen, damit eine volle Woche nicht blind mit einer ruhigen verglichen wird, und nur zusammengefasste, anonymisierte Erkenntnisse veröffentlichen. Ein ruhigeres Dashboard mit mehr offenen Fällen ist kein Erfolg.") },
            { type: "callout", reading: true, text: x(
              "A good interruption policy protects the next correct action and the next person who needs help.",
              "Një politikë e mirë ndërprerjesh mbron veprimin e radhës të saktë dhe personin e radhës që ka nevojë për ndihmë.",
              "Eine gute Unterbrechungsregel schützt die nächste richtige Handlung und den nächsten Menschen, der Hilfe braucht.") },
          ],
          note: x(
            "Original editorial cycle informed by the cognitive interruption research cited here; not a certified or employer-approved procedure.",
            "Cikël editorial origjinal i mbështetur te kërkimi konjitiv për ndërprerjet i cituar këtu; jo procedurë e certifikuar apo e miratuar nga punëdhënësi.",
            "Eigener redaktioneller Zyklus nach der hier zitierten kognitiven Unterbrechungsforschung; kein zertifiziertes oder vom Arbeitgeber genehmigtes Verfahren."),
          source: ["trafton-2003", "brumby-2013"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Resume", "Karta e pikës", "Die Wieder-"), x("Point Card", "së rikthimit", "einstiegskarte")],
      lead: x(
        "An original one-page worksheet for protecting task continuity without delaying an authorised urgent response. Save a legitimate next action, not sensitive data or an informal substitute for the official record.",
        "Një fletë pune origjinale njëfaqëshe për ta mbrojtur vazhdimësinë e detyrës pa vonuar një përgjigje urgjente të autorizuar. Ruaj një veprim të radhës legjitim, jo të dhëna të ndjeshme apo një zëvendësues joformal të regjistrit zyrtar.",
        "Ein eigenes, einseitiges Arbeitsblatt, um die Kontinuität einer Aufgabe zu schützen, ohne eine befugte dringende Antwort zu verzögern. Eine legitime nächste Handlung sichern, keine sensiblen Daten und keinen informellen Ersatz für den offiziellen Datensatz."),
      blocks: [
        { type: "form", items: [
          { h: x("Task and current state", "Detyra dhe gjendja aktuale", "Aufgabe und aktueller Stand"), hint: x("what work is open? which approved step was last completed?", "cila punë është e hapur? cili hap i miratuar u krye i fundit?", "welche Arbeit ist offen? welcher genehmigte Schritt war der letzte?") },
          { h: x("New request and urgency", "Kërkesa e re dhe urgjenca", "Neue Anfrage und Dringlichkeit"), hint: x("what changed? is immediate response mandatory?", "çfarë ndryshoi? a është e detyrueshme përgjigja e menjëhershme?", "was hat sich geändert? ist sofortige Antwort Pflicht?") },
          { h: x("Permitted pause point", "Pika e lejuar e ndalimit", "Erlaubter Haltepunkt"), hint: x("can the task be safely left? if yes, where is the authorised cue?", "a mund të lihet detyra pa rrezik? nëse po, ku është shenja e autorizuar?", "kann die Aufgabe sicher ruhen? wenn ja, wo ist der befugte Hinweis?") },
          { h: x("Owner and next action", "Pronari dhe veprimi i radhës", "Verantwortliche und nächste Handlung"), hint: x("who handles the interruption? who owns the suspended task?", "kush e trajton ndërprerjen? kush e ka detyrën e pezulluar?", "wer übernimmt die Unterbrechung? wem gehört die ruhende Aufgabe?") },
          { h: x("Return and verification", "Rikthimi dhe verifikimi", "Rückkehr und Prüfung"), hint: x("what must be rechecked before the task resumes or closes?", "çfarë duhet rikontrolluar para se detyra të rifillojë apo të mbyllet?", "was muss vor Fortsetzung oder Abschluss nachgeprüft werden?") },
          { h: x("Learning and review", "Mësimi dhe rishikimi", "Lernen und Prüfung"), hint: x("was a follow-up lost? could the channel, timing or cue improve?", "a humbi një ndjekje? a mund të përmirësohej kanali, koha apo shenja?", "ging eine Nacharbeit verloren? lassen sich Kanal, Zeitpunkt oder Hinweis verbessern?") },
        ] },
      ],
      note: x(
        "Use boundary: never place guest, payment, employee or route-identifying information in an unauthorised tracker. Follow official safety, escalation and system-access procedures. This card is a testable editorial proposal; the Shift Handover tool on this site keeps the same fields from one shift to the next.",
        "Kufiri i përdorimit: mos fut kurrë informacion që identifikon mysafirë, pagesa, punonjës apo rrugë në një gjurmues të paautorizuar. Ndiq procedurat zyrtare të sigurisë, eskalimit dhe aksesit në sistem. Kjo kartë është propozim editorial që mund të provohet; mjeti Shift Handover në këtë faqe i mban të njëjtat fusha nga një turn te tjetri.",
        "Einsatzgrenze: Nie Angaben, die Gäste, Zahlungen, Beschäftigte oder Touren erkennen lassen, in eine unbefugte Liste eintragen. Offizielle Verfahren für Sicherheit, Eskalation und Systemzugang befolgen. Diese Karte ist ein prüfbarer redaktioneller Vorschlag; das Werkzeug Shift Handover auf dieser Website hält dieselben Felder von Schicht zu Schicht fest."),
      source: ["trafton-2003", "altmann-trafton-2002"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("The human cost", "Kostoja njerëzore", "Die menschlichen Kosten"), x("of seamless service", "e shërbimit pa ndërprerje", "nahtlosen Service")],
      lead: x(
        "An apparently continuous operation may rely on people repeatedly rebuilding the work that was interrupted.",
        "Një operacion që duket i pandërprerë mund të mbështetet te njerëz që rindërtojnë vazhdimisht punën që u ndërpre.",
        "Ein scheinbar nahtloser Betrieb kann darauf beruhen, dass Menschen unterbrochene Arbeit immer wieder neu aufbauen."),
      blocks: [
        { type: "p", text: x(
          "From the outside, good operations seem continuous. Deliveries move, guests receive answers, reports appear and shifts hand work to one another. The interruptions that support this continuity rarely appear on the performance chart. A person who answers a critical question has done something useful. A person who returns afterward to an unfinished report has also performed work, whether or not the system records it. This volume has tried to make that second part visible. The literature does not justify a slogan that every interruption destroys productivity. Some requests prevent errors. Some participants in experiments compensated by working faster, although they reported more strain. Other experiments found longer resumption times and greater risk when people rushed back to a task. Those are not contradictions to conceal; they show why a careful manager has to look at the task, the person, the timing and the consequence. For a manager with experience across last-mile coordination and hotel work, the practical question is simple: have we designed reliable ways for people to return to work after they are legitimately called away? Counting alerts cannot answer it. It takes observing handovers, studying the state of unfinished work and verifying what happens after a task is resumed. There is a temptation to turn this into one more target: fewer messages, shorter calls, faster resumes. That would only move the problem. A necessary warning should not compete against an employee's productivity score, and an accurate recheck is not wasted time because it takes longer than immediate clicking. The operating system owes its people clear priorities, usable records, legitimate authority and room to verify. Good leadership does not ask workers to become machines that never lose their place. It builds work that can recover when human attention is pulled elsewhere.",
          "Nga jashtë, operacionet e mira duken të pandërprera. Dorëzimet lëvizin, mysafirët marrin përgjigje, raportet dalin dhe turnet ia kalojnë punën njëri-tjetrit. Ndërprerjet që e mbështesin këtë vazhdimësi rrallë dalin në grafikun e performancës. Një person që i përgjigjet një pyetjeje kritike ka bërë diçka të dobishme. Një person që kthehet pas kësaj te një raport i papërfunduar ka kryer gjithashtu punë, pavarësisht nëse sistemi e regjistron. Ky vëllim është përpjekur ta bëjë të dukshme atë pjesë të dytë. Literatura nuk e justifikon sloganin se çdo ndërprerje e shkatërron produktivitetin. Disa kërkesa parandalojnë gabime. Disa pjesëmarrës në eksperimente kompensuan duke punuar më shpejt, megjithëse raportuan më shumë ngarkesë. Eksperimente të tjera gjetën kohë më të gjata rikthimi dhe rrezik më të madh kur njerëzit nxitonin të ktheheshin te një detyrë. Këto nuk janë kontradikta për t'u fshehur; tregojnë pse një menaxher i kujdesshëm duhet ta shohë detyrën, personin, kohën dhe pasojën. Për një menaxher me përvojë në koordinimin e miljes së fundit dhe në punën e hotelit, pyetja praktike është e thjeshtë: a kemi projektuar mënyra të besueshme që njerëzit të rikthehen në punë pasi thirren me të drejtë diku tjetër? Numërimi i sinjaleve nuk i përgjigjet dot. Duhet vëzhguar dorëzimet, studiuar gjendja e punës së papërfunduar dhe verifikuar çfarë ndodh pasi një detyrë rifillon. Ka një tundim për ta kthyer këtë në edhe një objektiv: më pak mesazhe, telefonata më të shkurtra, rikthime më të shpejta. Kjo vetëm do ta zhvendoste problemin. Një paralajmërim i nevojshëm nuk duhet të konkurrojë me pikët e produktivitetit të një punonjësi, dhe një rikontroll i saktë nuk është kohë e humbur sepse zgjat më shumë se klikimi i menjëhershëm. Sistemi operativ u detyrohet njerëzve të vet përparësi të qarta, regjistra të përdorshëm, autoritet legjitim dhe hapësirë për të verifikuar. Udhëheqja e mirë nuk u kërkon punonjësve të bëhen makina që nuk e humbin kurrë vendin. Ndërton punë që mund të rikuperohet kur vëmendja njerëzore tërhiqet gjetiu.",
          "Von außen wirkt guter Betrieb nahtlos. Lieferungen rollen, Gäste erhalten Antworten, Berichte erscheinen und Schichten geben einander die Arbeit weiter. Die Unterbrechungen, die diese Kontinuität tragen, tauchen selten im Leistungsdiagramm auf. Wer eine kritische Frage beantwortet, hat etwas Nützliches getan. Wer danach zu einem unerledigten Bericht zurückkehrt, hat ebenfalls gearbeitet, ob das System es erfasst oder nicht. Dieser Band hat versucht, diesen zweiten Teil sichtbar zu machen. Die Literatur rechtfertigt nicht den Slogan, jede Unterbrechung zerstöre Produktivität. Manche Anfragen verhindern Fehler. Manche Versuchspersonen glichen durch schnelleres Arbeiten aus, berichteten aber mehr Belastung. Andere Experimente fanden längere Wiederaufnahmezeiten und höheres Risiko, wenn Menschen zur Aufgabe zurückeilten. Das sind keine Widersprüche zum Verbergen; sie zeigen, warum eine sorgfältige Führungskraft Aufgabe, Person, Zeitpunkt und Folge betrachten muss. Für eine Führungskraft mit Erfahrung in Last-Mile-Koordination und Hotelarbeit ist die praktische Frage einfach: Haben wir verlässliche Wege gestaltet, wie Menschen zur Arbeit zurückkehren, nachdem sie berechtigt weggerufen wurden? Signale zu zählen beantwortet sie nicht. Es braucht Beobachtung von Übergaben, den Blick auf den Stand unerledigter Arbeit und die Prüfung, was nach der Wiederaufnahme geschieht. Es lockt, daraus ein weiteres Ziel zu machen: weniger Nachrichten, kürzere Anrufe, schnellere Wiederaufnahme. Das verschöbe das Problem nur. Eine nötige Warnung sollte nicht mit dem Produktivitätswert einer Person konkurrieren, und eine genaue Nachprüfung ist keine verschwendete Zeit, weil sie länger dauert als sofortiges Klicken. Das Betriebssystem schuldet seinen Menschen klare Prioritäten, brauchbare Datensätze, legitime Befugnis und Raum zum Prüfen. Gute Führung verlangt nicht, dass Menschen zu Maschinen werden, die nie den Faden verlieren. Sie baut Arbeit, die sich erholen kann, wenn menschliche Aufmerksamkeit woanders hin gezogen wird.") },
        { type: "callout", reading: true, text: x(
          "The cost of an interruption is not only the time it takes. It is also the work the mind must do to return.",
          "Kostoja e një ndërprerjeje nuk është vetëm koha që merr. Është edhe puna që duhet të bëjë mendja për t'u rikthyer.",
          "Die Kosten einer Unterbrechung sind nicht nur die Zeit, die sie dauert. Sie sind auch die Arbeit, die der Kopf für die Rückkehr leisten muss.") },
      ],
      note: x(
        "Editorial essay. No interruption, missed step or resumption error is attributed to any named employer.",
        "Ese editoriale. Asnjë ndërprerje, hap i humbur apo gabim rikthimi nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktioneller Essay. Keine Unterbrechung, kein ausgelassener Schritt und kein Wiederaufnahmefehler wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Where the evidence", "Nga vjen", "Woher die Belege"), x("comes from", "prova", "stammen")],
      lead: x(
        "An evidence-informed editorial synthesis, not original field research: eleven sources, nine empirical studies, one cognitive model and one review, each with its limits. Scenes, the numerical example and the card are editorial.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim origjinal në terren: njëmbëdhjetë burime, nëntë studime empirike, një model konjitiv dhe një rishikim, secili me kufijtë e vet. Skenat, shembulli numerik dhe karta janë editoriale.",
        "Eine belegbasierte redaktionelle Synthese, keine eigene Feldforschung: elf Quellen, neun empirische Studien, ein kognitives Modell und ein Überblick, jedes mit seinen Grenzen. Szenen, Zahlenbeispiel und Karte sind redaktionell."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Model and review", "Model dhe rishikim", "Modell und Überblick"), p: x("Altmann and Trafton (2002), memory for goals, tested by simulation; Grundgeiger and Sanderson (2009), theoretical views of interruptions in healthcare.", "Altmann e Trafton (2002), kujtesa për qëllimet, e provuar me simulim; Grundgeiger e Sanderson (2009), pikëpamje teorike për ndërprerjet në shëndetësi.", "Altmann und Trafton (2002), Gedächtnis für Ziele, durch Simulation geprüft; Grundgeiger und Sanderson (2009), theoretische Sichten auf Unterbrechungen im Gesundheitswesen.") },
          { h: x("Laboratory", "Laboratori", "Labor"), p: x("An 8-second lag (Trafton et al. 2003); timing (Adamczyk and Bailey 2004; Bailey and Konstan 2006); three experiments on duration and demand (Monk et al. 2008); faster but more strained (Mark et al. 2008); attention residue (Leroy 2009); an inverted U for efficiency (Adler and Benbunan-Fich 2012); a 10-second lockout (Brumby et al. 2013).", "Një vonesë 8-sekondëshe (Trafton et al. 2003); koha (Adamczyk e Bailey 2004; Bailey e Konstan 2006); tri eksperimente për kohëzgjatjen dhe kërkesën (Monk et al. 2008); më shpejt, por me më shumë ngarkesë (Mark et al. 2008); mbetja e vëmendjes (Leroy 2009); një U e përmbysur për efikasitetin (Adler e Benbunan-Fich 2012); një bllokim 10-sekondësh (Brumby et al. 2013).", "8 Sekunden Verzögerung (Trafton et al. 2003); Zeitpunkt (Adamczyk und Bailey 2004; Bailey und Konstan 2006); drei Experimente zu Dauer und Anforderung (Monk et al. 2008); schneller, aber belasteter (Mark et al. 2008); Aufmerksamkeitsrest (Leroy 2009); umgekehrtes U der Effizienz (Adler und Benbunan-Fich 2012); 10 Sekunden Sperre (Brumby et al. 2013).") },
          { h: x("Field observation", "Vëzhgim në terren", "Feldbeobachtung"), p: x("98 nurses, 4,271 medications, 505 hours, two Sydney hospitals: 69.6% → 84.6% procedural failures and 25.3% → 38.9% clinical errors from no to three interruptions (Westbrook et al. 2010). An association in one sector.", "98 infermiere, 4.271 ilaçe, 505 orë, dy spitale në Sidnei: 69,6% → 84,6% dështime procedurale dhe 25,3% → 38,9% gabime klinike nga asnjë te tri ndërprerje (Westbrook et al. 2010). Lidhje në një sektor.", "98 Pflegekräfte, 4.271 Medikamente, 505 Stunden, zwei Krankenhäuser in Sydney: 69,6 % → 84,6 % Verfahrensfehler und 25,3 % → 38,9 % klinische Fehler von keiner bis drei Unterbrechungen (Westbrook et al. 2010). Ein Zusammenhang in einer Branche.") },
          { h: x("Invented counts", "Numrat e shpikur", "Erfundene Zahlen"), p: x("12 and 7 switches at an assumed 40 seconds (480 s = 8:00, 280 s = 4:40, 200 s less), flagged on its page; no average re-entry time is claimed.", "12 dhe 7 kalime me 40 sekonda të supozuara (480 s = 8:00, 280 s = 4:40, 200 s më pak), me flamur në faqen e vet; nuk pretendohet asnjë kohë mesatare rihyrjeje.", "12 und 7 Wechsel bei angenommenen 40 Sekunden (480 s = 8:00, 280 s = 4:40, 200 s weniger), auf ihrer Seite gekennzeichnet; keine durchschnittliche Wiedereinstiegszeit wird behauptet.") },
        ] },
        { type: "p", text: x(
          "The priority tiers, the three statuses, the six-step protocols and the Resume Point Card are editorial proposals for local testing, not validated controls or employer-approved procedures. Publisher records were checked for every source; where only the abstract or a secondary record was read, the list of sources says so. Editorial standard: a model, a laboratory experiment, a field observation and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Nivelet e përparësisë, tri statuset, protokollet me gjashtë hapa dhe Karta e pikës së rikthimit janë propozime editoriale për provë lokale, jo kontrolle të vërtetuara apo procedura të miratuara nga punëdhënësi. Regjistrat e botuesve u kontrolluan për çdo burim; kur u lexua vetëm abstrakti ose një regjistër dytësor, lista e burimeve e thotë. Standardi editorial: një model, një eksperiment laboratorik, një vëzhgim në terren dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die Prioritätsstufen, die drei Status, die sechsstufigen Protokolle und die Wiedereinstiegskarte sind redaktionelle Vorschläge für die örtliche Prüfung, keine validierten Kontrollen und keine vom Arbeitgeber genehmigten Verfahren. Die Verlagsdaten wurden für jede Quelle geprüft; wo nur das Abstract oder ein Sekundäreintrag gelesen wurde, sagt es das Quellenverzeichnis. Redaktioneller Standard: Ein Modell, ein Laborexperiment, eine Feldbeobachtung und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited on the next page; the eleven records, their journals, volumes, pages and years were checked against the publishers' metadata.",
        "Çdo burim citohet në faqen tjetër; njëmbëdhjetë regjistrimet, revistat, vëllimet, faqet dhe vitet e tyre u kontrolluan kundrejt metadata-ve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite zitiert; die elf Einträge, ihre Zeitschriften, Bände, Seiten und Jahre wurden an den Metadaten der Verlage geprüft."),
      source: ["altmann-trafton-2002", "trafton-2003", "adamczyk-bailey-2004", "bailey-konstan-2006", "monk-trafton-boehm-davis-2008", "mark-gudith-klocke-2008", "grundgeiger-sanderson-2009", "leroy-2009", "westbrook-2010", "adler-benbunan-fich-2012", "brumby-2013"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
