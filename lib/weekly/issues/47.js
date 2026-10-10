// Management Review, No. 47: Where the manager's week goes. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-47.md.
import { x, pc } from "../common.js";

export default {
  number: 47,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Where the manager's", "Ku shkon java", "Wohin die Woche"), x("week goes", "e menaxherit", "der Führungskraft geht")],
  sub: x(
    "A foreman's 48 seconds, the weekends and the time alone of 27 CEOs, Drucker's time log, an experiment with quiet time, the two-minute conversation, and a card for logging one week.",
    "48 sekondat e një kryepunëtori, fundjavat dhe koha vetëm e 27 CEO-ve, regjistri i kohës te Drucker-i, një eksperiment me kohën e qetë, biseda dyminutëshe, dhe një kartë për të regjistruar një javë.",
    "Die 48 Sekunden eines Vorarbeiters, Wochenenden und Zeit allein von 27 CEOs, Druckers Zeitprotokoll, ein Experiment mit ruhiger Zeit, das Zwei-Minuten-Gespräch und eine Karte, um eine Woche festzuhalten."),
  seo: x(
    "Where the manager's week goes: a foreman's 48 seconds, the hours of 27 CEOs, Drucker's time log, Perlow's quiet time and a card for logging a week.",
    "Ku shkon java e menaxherit: 48 sekondat e kryepunëtorit, orët e 27 CEO-ve, regjistri i Drucker-it, koha e qetë e Perlow-it dhe një kartë për një javë.",
    "Wohin die Woche der Führung geht: 48 Sekunden eines Vorarbeiters, die Stunden von 27 CEOs, Druckers Zeitprotokoll, Perlows ruhige Zeit und eine Karte."),
  feature: x(
    "Issue 47 starts with the studies Henry Mintzberg gathered, from a foreman with a new task every 48 seconds to managers who seldom had half an hour in one piece, follows 27 CEOs into their weekends and their time alone, sets out Peter Drucker's three steps for knowing your time, looks at an experiment with quiet time and at John Kotter's two-minute conversations, shows how the large studies measured the week, and ends with a card for logging your own.",
    "Numri 47 nis me studimet që mblodhi Henry Mintzberg, nga kryepunëtori me një punë të re çdo 48 sekonda te menaxherët që rrallë kishin gjysmë ore pa ndërprerje, ndjek 27 CEO në fundjavat dhe në kohën e tyre vetëm, shtjellon tri hapat e Peter Drucker-it për ta njohur kohën tënde, shikon një eksperiment me kohën e qetë dhe bisedat dyminutëshe të John Kotter-it, tregon si e matën javën studimet e mëdha, dhe mbyllet me një kartë për të regjistruar javën tënde.",
    "Ausgabe 47 beginnt mit den Studien, die Henry Mintzberg zusammentrug, vom Vorarbeiter mit einer neuen Tätigkeit alle 48 Sekunden bis zu Führungskräften, die selten eine halbe Stunde am Stück hatten, begleitet 27 CEOs in ihre Wochenenden und ihre Zeit allein, stellt Peter Druckers drei Schritte vor, die eigene Zeit zu kennen, betrachtet ein Experiment mit ruhiger Zeit und John Kotters Zwei-Minuten-Gespräche, zeigt, wie die großen Studien die Woche gemessen haben, und endet mit einer Karte für das eigene Protokoll."),
  figure: { n: x("48 sec", "48 sek.", "48 Sek."), by: "Guest, 1956", t: x(
    "was the average pace of 56 US foremen: 583 activities in one eight-hour shift.",
    "ishte ritmi mesatar i 56 kryepunëtorëve në SHBA: 583 veprimtari në një turn tetëorësh.",
    "betrug der Durchschnittstakt von 56 US-Vorarbeitern: 583 Tätigkeiten in einer Achtstundenschicht.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One every 48 seconds", "Një çdo 48 sekonda", "Eine alle 48 Sekunden") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Record, prune, consolidate", "Regjistro, krasit, bashko", "Erfassen, kürzen, bündeln") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The one-week time log", "Regjistri i kohës për një javë", "Das Zeitprotokoll für eine Woche") },
  ],
  sources: ["mintzberg-1975", "porter-nohria-2018", "mtime-drucker-1967", "mtime-perlow-1999", "mtime-kotter-1982", "mtime-bandiera-2020"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most managers can say where their week should go. Few can say where it went. This issue is about the difference: what the studies of managers' time have found, from the shop floor to the head office, and how to measure your own week before trying to change it.",
        "Shumica e menaxherëve e dinë ku duhet të shkojë java e tyre. Pak e dinë ku shkoi. Ky numër flet për këtë diferencë: çfarë kanë gjetur studimet për kohën e menaxherëve, nga reparti deri te zyra qendrore, dhe si ta masësh javën tënde para se të përpiqesh ta ndryshosh.",
        "Die meisten Führungskräfte können sagen, wohin ihre Woche gehen sollte. Wenige können sagen, wohin sie gegangen ist. Diese Ausgabe handelt von diesem Unterschied: was die Studien zur Zeit von Führungskräften gefunden haben, von der Werkhalle bis zur Zentrale, und wie man die eigene Woche misst, bevor man sie ändert."),
      body: x(
        "In 1956, 56 US foremen averaged one activity every 48 seconds. Decades later, 27 CEOs worked on most weekends and spent 28% of their working time alone, mostly in pieces of an hour or less. Peter Drucker's advice from 1967 still stands: record the time, prune it, then consolidate it. An experiment with quiet time was credited with a team of engineers launching on time, and John Kotter shows why some short conversations are not lost time at all.",
        "Në 1956, 56 kryepunëtorë në SHBA kishin mesatarisht një veprimtari çdo 48 sekonda. Dekada më vonë, 27 CEO punuan në shumicën e fundjavave dhe e kaluan vetëm 28% të kohës së punës, kryesisht në copa prej një ore ose më pak. Këshilla e Peter Drucker-it nga 1967 vlen ende: regjistroje kohën, krasite, pastaj bashkoje. Një eksperimenti me kohën e qetë iu atribua nxjerrja në afat e produktit të një ekipi inxhinierësh, dhe John Kotter tregon pse disa biseda të shkurtra nuk janë aspak kohë e humbur.",
        "1956 hatten 56 US-Vorarbeiter im Schnitt alle 48 Sekunden eine neue Tätigkeit. Jahrzehnte später arbeiteten 27 CEOs an den meisten Wochenenden und verbrachten 28 % ihrer Arbeitszeit allein, meist in Stücken von einer Stunde oder weniger. Peter Druckers Rat von 1967 gilt noch: die Zeit erfassen, kürzen, dann bündeln. Einem Experiment mit ruhiger Zeit wurde zugeschrieben, dass ein Team von Ingenieuren pünktlich lieferte, und John Kotter zeigt, warum manche kurzen Gespräche gar keine verlorene Zeit sind."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One every", "Një çdo", "Eine alle"), x("48 seconds", "48 sekonda", "48 Sekunden")],
      lead: x(
        "In 1975 Henry Mintzberg brought together the studies that had followed managers at work, from foremen to company presidents, in the United States, Canada, Sweden and Britain. On the shop floor and at the top, the pace was the same: unrelenting.",
        "Në 1975, Henry Mintzberg mblodhi bashkë studimet që kishin ndjekur menaxherët në punë, nga kryepunëtorët te presidentët e kompanive, në SHBA, Kanada, Suedi dhe Britani. Në repart dhe në krye, ritmi ishte i njëjtë: pa pushim.",
        "1975 trug Henry Mintzberg die Studien zusammen, die Führungskräfte bei der Arbeit begleitet hatten, vom Vorarbeiter bis zum Firmenpräsidenten, in den USA, Kanada, Schweden und Großbritannien. In der Werkhalle wie an der Spitze war das Tempo dasselbe: unablässig."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "583", t: x("activities in one eight-hour shift, for 56 US foremen (Guest, 1956)", "veprimtari në një turn tetëorësh, për 56 kryepunëtorë në SHBA (Guest, 1956)", "Tätigkeiten in einer Achtstundenschicht, bei 56 US-Vorarbeitern (Guest, 1956)") },
          { n: x("30 min", "30 min", "30 Min."), t: x("without interruption only about once every two days, for 160 British managers (Stewart, 1967)", "pa ndërprerje vetëm rreth një herë në dy ditë, për 160 menaxherë britanikë (Stewart, 1967)", "ohne Unterbrechung nur etwa jeden zweiten Tag, bei 160 britischen Führungskräften (Stewart, 1967)") },
          { n: pc(93), t: x("of the meetings and calls of Mintzberg's five chief executives were arranged ad hoc", "e takimeve dhe telefonatave të pesë drejtuesve të lartë të Mintzberg-ut u rregulluan aty për aty", "der Treffen und Telefonate von Mintzbergs fünf Vorstandschefs wurden kurzfristig vereinbart") },
        ] },
        { type: "p", text: x(
          "His chief executives started only 32% of their own contacts. Yet the effective ones still steered their time, Mintzberg found: they used their obligations for their own ends, and turned what they wanted to do into obligations, a project others had to report on, a visit announced in public.",
          "Drejtuesit e tij e nisën vetë vetëm 32% të kontakteve. Megjithatë, gjeti Mintzberg, ata më të efektshmit e drejtonin përsëri kohën: i përdornin detyrimet për qëllimet e veta, dhe atë që donin ta bënin e kthenin në detyrim, një projekt për të cilin të tjerët duhej të raportonin, një vizitë e njoftuar publikisht.",
          "Seine Vorstandschefs gingen nur 32 % ihrer Kontakte selbst an. Trotzdem steuerten die wirksamen unter ihnen ihre Zeit, fand Mintzberg: Sie nutzten ihre Pflichten für eigene Ziele und machten das, was sie tun wollten, zur Pflicht, ein Projekt, über das andere berichten mussten, ein öffentlich angekündigter Besuch.") },
        { type: "quote", text: x(
          "Free time is made, not found.",
          "Koha e lirë bëhet, nuk gjendet.",
          "Freie Zeit wird gemacht, nicht gefunden.") },
        { type: "callout", reading: true, text: x(
          "A week is rarely lost in the large blocks on the calendar. It goes in the small pieces between them.",
          "Java rrallë humbet te blloqet e mëdha në kalendar. Shkon te copat e vogla mes tyre.",
          "Eine Woche geht selten in den großen Blöcken im Kalender verloren, sondern in den kleinen Stücken dazwischen.") },
      ],
      note: x(
        "Old studies, each with its year: Guest observed one shift per foreman, Stewart's managers kept diaries, Mintzberg observed five chief executives for a week each. All figures as Mintzberg reports them.",
        "Studime të vjetra, secili me vitin e vet: Guest vëzhgoi një turn për çdo kryepunëtor, menaxherët e Stewart-it mbajtën ditarë, Mintzberg vëzhgoi pesë drejtues të lartë për një javë secilin. Të gjitha shifrat siç i jep Mintzberg.",
        "Alte Studien, jede mit ihrem Jahr: Guest beobachtete eine Schicht je Vorarbeiter, Stewarts Führungskräfte führten Tagebuch, Mintzberg beobachtete fünf Vorstandschefs je eine Woche. Alle Zahlen so, wie Mintzberg sie wiedergibt."),
      source: ["mintzberg-1975"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Weekends,", "Fundjava,", "Wochenende,"), x("and time alone", "dhe koha vetëm", "und Zeit allein")],
      lead: x(
        "Michael Porter and Nitin Nohria had the assistants of 27 CEOs of large companies code their time in 15-minute blocks, around the clock, for a quarter each, and check it with the CEO. Beyond the 62.5-hour week, the data show when the work happened and how much of it was the CEO's own.",
        "Michael Porter dhe Nitin Nohria u kërkuan asistentëve të 27 CEO-ve të kompanive të mëdha ta kodonin kohën e tyre në blloqe 15-minutëshe, ditë e natë, për një tremujor secilin, dhe ta verifikonin me CEO-n. Përtej javës prej 62,5 orësh, të dhënat tregojnë kur u bë puna dhe sa prej saj ishte e vetë CEO-s.",
        "Michael Porter und Nitin Nohria ließen die Assistenzen von 27 CEOs großer Unternehmen deren Zeit in 15-Minuten-Blöcken erfassen, rund um die Uhr, je ein Quartal lang, und mit dem CEO abgleichen. Über die 62,5-Stunden-Woche hinaus zeigen die Daten, wann gearbeitet wurde und wie viel davon dem CEO selbst gehörte."),
      blocks: [
        { type: "columns", max: 10, height: 100, source: ["porter-nohria-2018"],
          label: x("Average hours of work per day, 27 CEOs", "Orë pune mesatarisht në ditë, 27 CEO", "Durchschnittliche Arbeitsstunden pro Tag, 27 CEOs"),
          items: [
            { k: x("Weekday", "Ditë pune", "Werktag"), v: 9.7, n: x("9.7", "9,7", "9,7") },
            { k: x("Weekend day", "Ditë fundjave", "Wochenendtag"), v: 3.9, n: x("3.9", "3,9", "3,9"), alert: true },
            { k: x("Vacation day", "Ditë pushimi", "Urlaubstag"), v: 2.4, n: x("2.4", "2,4", "2,4"), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(79), t: x("of weekend days included work", "e ditëve të fundjavës kishin punë", "der Wochenendtage enthielten Arbeit") },
          { n: pc(70), t: x("of vacation days included work", "e ditëve të pushimit kishin punë", "der Urlaubstage enthielten Arbeit") },
          { n: pc(28), t: x("of working time alone; 59% of it in blocks of an hour or less, 18% in blocks of two hours or more", "e kohës së punës vetëm; 59% e saj në blloqe prej një ore ose më pak, 18% në blloqe prej dy orësh ose më shumë", "der Arbeitszeit allein; davon 59 % in Blöcken von einer Stunde oder weniger, 18 % in Blöcken von zwei Stunden oder mehr") },
        ] },
        { type: "callout", reading: true, text: x(
          "The scarce resource is not hours. It is hours in one piece.",
          "Burimi i rrallë nuk janë orët. Janë orët në një copë.",
          "Knapp sind nicht die Stunden, sondern die Stunden am Stück.") },
      ],
      note: x(
        "Time alone ranged from 10% to 48% between CEOs. The article does not say whether the weekend and vacation averages count only the days with work. Large, mostly public companies; the study began in 2006.",
        "Koha vetëm shkonte nga 10% në 48% nga një CEO te tjetri. Artikulli nuk thotë nëse mesataret e fundjavës dhe të pushimeve numërojnë vetëm ditët me punë. Kompani të mëdha, kryesisht publike; studimi nisi në 2006.",
        "Die Zeit allein reichte je nach CEO von 10 % bis 48 %. Der Artikel sagt nicht, ob die Durchschnitte für Wochenenden und Urlaub nur Tage mit Arbeit zählen. Große, meist börsennotierte Unternehmen; die Studie begann 2006."),
      source: ["porter-nohria-2018"],
    },
    {
      id: "model", more: "the-operations-manager-i-want-to-be",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Record, prune,", "Regjistro, krasit,", "Erfassen, kürzen,"), x("consolidate", "bashko", "bündeln")],
      lead: x(
        "In The Effective Executive (1967), Peter Drucker writes that effective executives do not start with their tasks; they start with their time, and first find out where it actually goes. He sets out three steps.",
        "Te The Effective Executive (1967), Peter Drucker shkruan se drejtuesit e efektshëm nuk nisin nga detyrat; nisin nga koha, dhe në fillim zbulojnë ku shkon ajo në të vërtetë. Ai përshkruan tre hapa.",
        "In The Effective Executive (1967) schreibt Peter Drucker, wirksame Führungskräfte begännen nicht mit ihren Aufgaben, sondern mit ihrer Zeit, und fänden zuerst heraus, wohin sie tatsächlich geht. Er beschreibt drei Schritte."),
      blocks: [
        { type: "chain", items: [
          { h: x("Record", "Regjistro", "Erfassen"), p: x("Write down where the time goes as it happens, not afterwards from memory.", "Shëno ku shkon koha në çastin kur ndodh, jo më pas nga kujtesa.", "Festhalten, wohin die Zeit geht, während es geschieht, nicht hinterher aus dem Gedächtnis.") },
          { h: x("Prune", "Krasit", "Kürzen"), p: x("Cut what brings nothing; hand over what others can do.", "Hiq atë që nuk sjell asgjë; jepu të tjerëve atë që mund ta bëjnë.", "Streichen, was nichts bringt; abgeben, was andere tun können.") },
          { h: x("Consolidate", "Bashko", "Bündeln"), p: x("Gather the time you control into the largest possible blocks.", "Mblidhe kohën që kontrollon në blloqet më të mëdha të mundshme.", "Die Zeit, über die man verfügt, zu möglichst großen Blöcken zusammenfassen.") },
        ] },
        { type: "box", title: x("Three questions for the log", "Tri pyetje për regjistrin", "Drei Fragen an das Protokoll"), items: [
          x("What would happen if this were not done at all?", "Çfarë do të ndodhte nëse kjo nuk bëhej fare?", "Was würde passieren, wenn das gar nicht getan würde?"),
          x("Which of these could someone else do just as well, if not better?", "Cilën prej tyre mund ta bënte dikush tjetër po aq mirë, ose më mirë?", "Was davon könnte jemand anderes genauso gut oder besser tun?"),
          x("What do I do that wastes your time? This one is for the team.", "Çfarë bëj unë që ju merr kohë pa dobi? Kjo pyetje i bëhet ekipit.", "Was tue ich, was Ihre Zeit verschwendet? Diese Frage geht an das Team."),
        ] },
        { type: "callout", reading: true, text: x(
          "The log comes first because memory flatters. It remembers the week we planned, not the one we had.",
          "Regjistri vjen i pari sepse kujtesa na lajkaton. Mban mend javën që planifikuam, jo atë që patëm.",
          "Das Protokoll kommt zuerst, weil das Gedächtnis schmeichelt. Es erinnert sich an die geplante Woche, nicht an die tatsächliche.") },
      ],
      note: x(
        "The steps and questions follow Drucker; we did not see the book itself and confirmed them in independent summaries. The reading is the editors'.",
        "Hapat dhe pyetjet ndjekin Drucker-in; vetë librin s'e kemi parë dhe i konfirmuam te përmbledhje të pavarura. Leximi është i redaksisë.",
        "Schritte und Fragen folgen Drucker; das Buch selbst haben wir nicht gesehen und sie in unabhängigen Zusammenfassungen bestätigt. Die Deutung stammt von der Redaktion."),
      source: ["mtime-drucker-1967"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Quiet time, and", "Koha e qetë dhe", "Ruhige Zeit und"), x("the two-minute talk", "biseda dyminutëshe", "das Zwei-Minuten-Gespräch")],
      lead: x(
        "Leslie Perlow spent nine months with software engineers under deadline. Of their exchanges with colleagues, they judged 96% helpful but only 10% urgent. So she set quiet time: three mornings a week without interruptions (phases 1 and 3), and a phase with fixed hours for talking (phase 2).",
        "Leslie Perlow kaloi nëntë muaj me një ekip inxhinierësh softueri nën afat. Nga bisedat me kolegët, ata i gjykuan të dobishme 96%, por urgjente vetëm 10%. Ndaj ajo caktoi kohë të qetë: tri mëngjese në javë pa ndërprerje (fazat 1 dhe 3), dhe një fazë me orë të caktuara për bisedat (faza 2).",
        "Leslie Perlow verbrachte neun Monate mit Softwareingenieuren unter Termindruck. 96 % ihrer Kontakte mit Kollegen hielten sie für hilfreich, nur 10 % für dringend. Also führte sie ruhige Zeit ein: drei Vormittage pro Woche ohne Unterbrechung (Phasen 1 und 3) und eine Phase mit festen Zeiten für Gespräche (Phase 2)."),
      blocks: [
        { type: "columns", max: 100, height: 100, source: ["mtime-perlow-1999"],
          label: x("Engineers rating their productivity above average", "Inxhinierë që e vlerësuan produktivitetin mbi mesataren", "Ingenieure, die ihre Produktivität überdurchschnittlich einschätzten"),
          items: [
            { k: x("Phase 1", "Faza 1", "Phase 1"), v: 59, n: pc(59) },
            { k: x("Phase 2", "Faza 2", "Phase 2"), v: 41, n: pc(41), alert: true },
            { k: x("Phase 3", "Faza 3", "Phase 3"), v: 65, n: pc(65) },
            { k: x("A month on", "Pas një muaji", "Monat danach"), v: 47, n: pc(47) },
          ] },
        { type: "p", text: x(
          "The vice president credited the experiment with the product's on-time launch, the second in the division's history. Nine months after it ended, little was left, yet even two years on, managers checked up on the engineers less often. John Kotter's study of 15 general managers (1976–1981) adds the other side: a two-minute talk in the corridor can do the work of a 15–30 minute meeting, when the manager has a clear agenda and a network of relationships.",
          "Zëvendëspresidenti ia atribuoi eksperimentit nxjerrjen e produktit në afat, të dytën në historinë e divizionit. Nëntë muaj pasi mbaroi, kishte mbetur pak prej tij, por edhe dy vjet më pas menaxherët i kontrollonin inxhinierët më rrallë. Studimi i John Kotter-it me 15 drejtues të përgjithshëm (1976–1981) shton anën tjetër: një bisedë dy minutash në korridor mund të bëjë punën e një takimi 15–30 minutësh, kur menaxheri ka një axhendë të qartë dhe një rrjet marrëdhëniesh.",
          "Der Vizepräsident schrieb dem Experiment den pünktlichen Produktstart zu, den zweiten in der Geschichte der Sparte. Neun Monate nach dem Ende war wenig übrig, doch noch zwei Jahre danach kontrollierten die Vorgesetzten seltener. John Kotters Studie mit 15 Geschäftsführern (1976–1981) ergänzt die andere Seite: Ein Zwei-Minuten-Gespräch im Flur kann ein Meeting von 15 bis 30 Minuten ersetzen, wenn die Führungskraft eine klare Agenda und ein Netz von Beziehungen hat.") },
        { type: "callout", reading: true, text: x(
          "Not every interruption is waste. The ones to move are those that could have waited.",
          "Jo çdo ndërprerje është humbje. Ato që duhen zhvendosur janë ato që mund të prisnin.",
          "Nicht jede Unterbrechung ist Verschwendung. Verschieben sollte man die, die hätten warten können.") },
      ],
      note: x(
        "One team, self-ratings on a 1–5 scale, no control group. The phase-2 mornings were quiet by default too.",
        "Një ekip i vetëm, vetëvlerësime në një shkallë 1–5, pa grup kontrolli. Në fazën 2 edhe mëngjeset mbetën të qeta.",
        "Ein einziges Team, Selbsteinschätzungen auf einer Skala von 1 bis 5, keine Kontrollgruppe. In Phase 2 blieben auch die Vormittage ruhig."),
      source: ["mtime-perlow-1999", "mtime-kotter-1982"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Fifteen-minute", "Blloqe prej", "Blöcke von"), x("blocks", "15 minutash", "fünfzehn Minuten")],
      lead: x(
        "Oriana Bandiera and colleagues also cut the week of 1,114 manufacturing CEOs in six countries, Germany among them, into 15-minute blocks. Each morning they asked for the day's plan, each evening for what had happened: 50 hours a week on average.",
        "Oriana Bandiera dhe kolegët e prenë edhe ata në blloqe 15-minutëshe javën e 1.114 CEO-ve të firmave prodhuese në gjashtë vende, mes tyre Gjermania. Çdo mëngjes pyetën për planin e ditës, çdo mbrëmje për atë që kishte ndodhur: mesatarisht 50 orë në javë.",
        "Auch Oriana Bandiera und Kollegen teilten die Woche von 1.114 CEOs aus der Industrie in sechs Ländern, darunter Deutschland, in 15-Minuten-Blöcke. Jeden Morgen fragten sie nach dem Plan des Tages, jeden Abend nach dem, was geschehen war: im Schnitt 50 Stunden pro Woche."),
      blocks: [
        { type: "steps", items: [
          { h: x("Log as it happens", "Regjistro në çast", "Sofort festhalten"), p: x("In 15-minute blocks, from the first call to the last email.", "Në blloqe 15-minutëshe, nga telefonata e parë te email-i i fundit.", "In 15-Minuten-Blöcken, vom ersten Anruf bis zur letzten E-Mail.") },
          { h: x("Fix the categories first", "Cakto kategoritë që në fillim", "Erst die Kategorien festlegen"), p: x("Planned or not, alone or with whom, and on what.", "I planifikuar apo jo, vetëm apo me kë, dhe për çfarë.", "Geplant oder nicht, allein oder mit wem, und woran.") },
          { h: x("Compare morning and evening", "Krahaso mëngjesin me mbrëmjen", "Morgen und Abend vergleichen"), p: x("What was planned, what was done, what took its place.", "Çfarë u planifikua, çfarë u bë, çfarë zuri vendin e saj.", "Was geplant war, was getan wurde, was an seine Stelle trat.") },
          { h: x("Count the blocks in one piece", "Numëro blloqet në një copë", "Die Blöcke am Stück zählen"), p: x("An hour or more alone, without interruption.", "Një orë ose më shumë vetëm, pa ndërprerje.", "Eine Stunde oder mehr allein, ohne Unterbrechung.") },
        ] },
        { type: "p", text: x(
          "Definitions decide the result. In Bandiera's study, emergencies took 4% of CEO time and just under 10% of planned activities were cancelled; Porter and Nohria counted 36% of time as reacting to unfolding issues. The questions were different.",
          "Përkufizimet e vendosin rezultatin. Te studimi i Bandiera-s, emergjencat zunë 4% të kohës së CEO-ve dhe pak më pak se 10% e veprimtarive të planifikuara u anuluan; Porter dhe Nohria numëruan 36% të kohës si reagim ndaj çështjeve që lindnin. Pyetjet ishin të ndryshme.",
          "Die Definitionen bestimmen das Ergebnis. In Bandieras Studie nahmen Notfälle 4 % der CEO-Zeit ein, und knapp 10 % der geplanten Tätigkeiten fielen aus; Porter und Nohria zählten 36 % der Zeit als Reaktion auf aufkommende Themen. Die Fragen waren verschieden.") },
        { type: "example", label: x("Hypothetical example, a shift manager's week", "Shembull hipotetik, java e një menaxheri turni", "Hypothetisches Beispiel, die Woche einer Schichtleitung"), rows: [
          { k: x("Logged", "Të regjistruara", "Erfasst"), v: x("47 hours, 188 blocks", "47 orë, 188 blloqe", "47 Stunden, 188 Blöcke") },
          { k: x("Unplanned", "Pa plan", "Ungeplant"), v: x("71 blocks, 52 of which could have waited", "71 blloqe, 52 prej tyre mund të prisnin", "71 Blöcke, 52 davon hätten warten können") },
          { k: x("In one piece", "Në një copë", "Am Stück"), v: x("two blocks of an hour alone", "dy blloqe prej një ore vetëm", "zwei Blöcke von einer Stunde allein") },
        ], text: x("The 52 blocks that could have waited are where next week's quiet morning comes from. The numbers are invented.", "52 blloqet që mund të prisnin janë vendi nga vjen mëngjesi i qetë i javës tjetër. Numrat janë të shpikur.", "Aus den 52 Blöcken, die hätten warten können, kommt der ruhige Vormittag der nächsten Woche. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Bandiera's data come from one week per CEO, collected by phone with the CEO or an assistant. The steps and the example are the editors'.",
        "Të dhënat e Bandiera-s vijnë nga një javë për çdo CEO, të mbledhura me telefon me CEO-n ose me një asistent. Hapat dhe shembulli janë të redaksisë.",
        "Bandieras Daten stammen aus einer Woche je CEO, telefonisch erhoben beim CEO oder einer Assistenz. Schritte und Beispiel stammen von der Redaktion."),
      source: ["mtime-bandiera-2020", "porter-nohria-2018", "mtime-drucker-1967"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The one-week", "Regjistri i kohës", "Das Zeitprotokoll"), x("time log", "për një javë", "für eine Woche")],
      lead: x(
        "One card a day, for one ordinary week. Write as you go, not in the evening. On Friday, add up the blocks by category and sort them with the Pareto tool: start with the two or three that take the most time.",
        "Një kartë në ditë, për një javë të zakonshme. Shkruaj ndërsa punon, jo në mbrëmje. Të premten, mblidh blloqet sipas kategorive dhe renditi me mjetin Pareto: nis me dy ose tri që marrin më shumë kohë.",
        "Eine Karte pro Tag, eine gewöhnliche Woche lang. Mitschreiben, nicht erst am Abend. Am Freitag die Blöcke nach Kategorien zusammenzählen und mit dem Pareto-Werkzeug ordnen: mit den zwei oder drei beginnen, die am meisten Zeit kosten."),
      blocks: [
        { type: "form", items: [
          { h: x("This morning's plan", "Plani i mëngjesit", "Der Plan des Morgens"), hint: x("the three things that must happen today", "tri gjërat që duhet të ndodhin sot", "die drei Dinge, die heute geschehen müssen") },
          { h: x("The log", "Regjistri", "Das Protokoll"), hint: x("15-minute blocks: what, with whom, planned or not", "blloqe 15-minutëshe: çfarë, me kë, i planifikuar apo jo", "15-Minuten-Blöcke: was, mit wem, geplant oder nicht"), lines: 3 },
          { h: x("In one piece", "Në një copë", "Am Stück"), hint: x("blocks of an hour or more alone, without interruption", "blloqe prej një ore ose më shumë vetëm, pa ndërprerje", "Blöcke von einer Stunde oder mehr allein, ohne Unterbrechung") },
          { h: x("Could have waited", "Mund të priste", "Hätte warten können"), hint: x("interruptions that were not urgent: who, about what", "ndërprerje që nuk ishin urgjente: kush, për çfarë", "Unterbrechungen, die nicht dringend waren: wer, worüber") },
          { h: x("Drop or hand over", "Hiqe ose jepe", "Streichen oder abgeben"), hint: x("what would happen if it were not done; who else could do it", "çfarë do të ndodhte po të mos bëhej; kush tjetër mund ta bënte", "was passierte, wenn es nicht getan würde; wer es sonst tun könnte") },
          { h: x("Next week's block", "Blloku i javës tjetër", "Der Block der nächsten Woche"), hint: x("one protected block: day, hours, purpose, who knows about it", "një bllok i mbrojtur: dita, orët, qëllimi, kush e di", "ein geschützter Block: Tag, Uhrzeit, Zweck, wer davon weiß") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Drucker's three steps, the 15-minute blocks of the CEO studies and Perlow's quiet time.",
        "Praktikë e propozuar nga redaksia, sipas tri hapave të Drucker-it, blloqeve 15-minutëshe të studimeve për CEO-të dhe kohës së qetë të Perlow-it.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Druckers drei Schritten, den 15-Minuten-Blöcken der CEO-Studien und Perlows ruhiger Zeit."),
      source: ["mtime-drucker-1967", "porter-nohria-2018", "mtime-perlow-1999"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
