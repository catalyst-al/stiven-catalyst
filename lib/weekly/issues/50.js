// Management Review, No. 50: Just culture: accountability without fear. Block: People.
// Facts and their sources: docs/revista/management-review-nr-50.md.
import { x, pc } from "../common.js";

export default {
  number: 50,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Just culture:", "Kultura e drejtë:", "Just Culture:"), x("accountability without fear", "përgjegjësi pa frikë", "Verantwortung ohne Angst")],
  sub: x(
    "Reason's line between blameless and blameworthy, how many NHS staff think people involved in errors are treated fairly, Marx's three behaviours, a trust that moved from blame to repair, who draws the line, and a card for the decision after an error.",
    "Vija e Reason-it mes të pafajshmes dhe të fajshmes, sa punonjës të NHS-it mendojnë se të përfshirët në gabime trajtohen drejt, tri sjelljet e Marx-it, një spital që kaloi nga faji te riparimi, kush e heq vijën, dhe një kartë për vendimin pas një gabimi.",
    "Reasons Linie zwischen schuldlos und schuldhaft, wie viele NHS-Beschäftigte finden, dass Beteiligte an Fehlern fair behandelt werden, Marx' drei Verhaltensweisen, ein Klinikträger, der von Schuld zu Wiedergutmachung wechselte, wer die Linie zieht, und eine Karte für die Entscheidung nach einem Fehler."),
  seo: x(
    "Just culture: Reason's line, NHS staff on fair treatment after errors, Marx's three behaviours, restorative practice at Mersey Care, and a card.",
    "Kultura e drejtë: vija e Reason-it, stafi i NHS-it për trajtimin pas gabimeve, tri sjelljet e Marx-it, praktika restauruese te Mersey Care, dhe një kartë.",
    "Just Culture: Reasons Linie, NHS-Personal zur fairen Behandlung nach Fehlern, Marx' drei Verhaltensweisen, Mersey Care und eine Karte."),
  feature: x(
    "Issue 50 starts with James Reason's two ways of looking at human error and the line he wanted drawn between blameless and blameworthy acts, asks how many NHS staff in England think people involved in errors are treated fairly, sets out David Marx's human error, at-risk behaviour and recklessness, follows a mental health trust in Liverpool that swapped culpability for repair, asks with Sidney Dekker who gets to draw the line, and ends with a card for the decision after an error.",
    "Numri 50 nis me dy mënyrat e James Reason-it për ta parë gabimin njerëzor dhe me vijën që ai donte të hiqej mes veprimeve të pafajshme dhe të fajshme, pyet sa punonjës të NHS-it në Angli mendojnë se të përfshirët në gabime trajtohen drejt, shtjellon gabimin njerëzor, sjelljen me rrezik dhe pamaturinë te David Marx-i, ndjek një spital të shëndetit mendor në Liverpool që e zëvendësoi fajin me riparimin, pyet me Sidney Dekker-in kush e ka të drejtën ta heqë vijën, dhe mbyllet me një kartë për vendimin pas një gabimi.",
    "Ausgabe 50 beginnt mit James Reasons zwei Sichtweisen auf menschliche Fehler und der Linie, die er zwischen schuldlosen und schuldhaften Handlungen gezogen sehen wollte, fragt, wie viele NHS-Beschäftigte in England finden, dass Beteiligte an Fehlern fair behandelt werden, stellt David Marx' menschlichen Fehler, riskantes Verhalten und Rücksichtslosigkeit vor, folgt einem psychiatrischen Klinikträger in Liverpool, der Schuldfragen durch Wiedergutmachung ersetzte, fragt mit Sidney Dekker, wer die Linie ziehen darf, und endet mit einer Karte für die Entscheidung nach einem Fehler."),
  figure: { n: pc(59), by: "NHS Staff Survey, 2025", t: x(
    "of NHS staff in England say their organisation treats staff involved in an error, near miss or incident fairly.",
    "e punonjësve të NHS-it në Angli thonë se organizata e tyre i trajton drejt punonjësit e përfshirë në një gabim, në një gati-incident ose në një incident.",
    "der NHS-Beschäftigten in England sagen, dass ihre Organisation Beschäftigte, die an einem Fehler, Beinahe-Ereignis oder Vorfall beteiligt sind, fair behandelt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Where the line is drawn", "Ku hiqet vija", "Wo die Linie verläuft") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three behaviours, three answers", "Tri sjellje, tri përgjigje", "Drei Verhaltensweisen, drei Antworten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The card for after an error", "Karta pas një gabimi", "Die Karte nach einem Fehler") },
  ],
  sources: ["justculture-reason-2000", "justculture-reason-1997", "justculture-nhs-nss-2025", "justculture-marx-2001", "justculture-eu-376-2014", "justculture-kaur-2019", "justculture-dekker-2007", "justculture-npsa-idt"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "When something goes wrong, a team quickly learns what is safer: to speak up or to keep quiet. This issue is about drawing the line between an honest mistake and behaviour that deserves a consequence, so that people keep reporting and are still held to account.",
        "Kur diçka shkon keq, ekipi mëson shpejt çfarë është më e sigurt: të flasësh apo të heshtësh. Ky numër flet për vijën mes një gabimi të ndershëm dhe një sjelljeje që meriton pasojë, që njerëzit të vazhdojnë të raportojnë dhe prapë të mbajnë përgjegjësi.",
        "Wenn etwas schiefgeht, lernt ein Team schnell, was sicherer ist: zu sprechen oder zu schweigen. Diese Ausgabe handelt von der Linie zwischen einem ehrlichen Fehler und einem Verhalten, das Folgen verdient, damit Menschen weiter melden und trotzdem Verantwortung tragen."),
      body: x(
        "James Reason saw that blaming a person is more satisfying than fixing a system, and wanted a shared line between blameless and blameworthy acts. In the 2025 NHS Staff Survey, 86% of staff said they were encouraged to report errors, but only 59% that those involved were treated fairly. David Marx separates human error, at-risk behaviour and recklessness. A trust in Liverpool replaced culpability with repair, and Sidney Dekker asks who gets to draw the line.",
        "James Reason-i vuri re se fajësimi i një njeriu të kënaq më shumë se rregullimi i një sistemi, dhe donte një vijë të përbashkët mes veprimeve të pafajshme dhe të fajshme. Në anketën e stafit të NHS-it të 2025, 86% e punonjësve thanë se nxiten të raportojnë gabimet, por vetëm 59% se të përfshirët trajtohen drejt. David Marx-i ndan gabimin njerëzor, sjelljen me rrezik dhe pamaturinë. Një spital në Liverpool e zëvendësoi fajin me riparimin, dhe Sidney Dekker-i pyet kush e ka të drejtën ta heqë vijën.",
        "James Reason sah, dass es befriedigender ist, einen Menschen zu beschuldigen, als ein System zu reparieren, und wollte eine gemeinsame Linie zwischen schuldlosen und schuldhaften Handlungen. In der NHS-Mitarbeiterbefragung 2025 sagten 86 % der Beschäftigten, sie würden ermutigt, Fehler zu melden, aber nur 59 %, dass Beteiligte fair behandelt werden. David Marx unterscheidet menschlichen Fehler, riskantes Verhalten und Rücksichtslosigkeit. Ein Klinikträger in Liverpool ersetzte Schuldfragen durch Wiedergutmachung, und Sidney Dekker fragt, wer die Linie ziehen darf."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Where the line", "Ku hiqet", "Wo die Linie"), x("is drawn", "vija", "verläuft")],
      lead: x(
        "In 2000 the psychologist James Reason described two ways of looking at human error in the BMJ. The person approach looks for the forgetful, inattentive or careless individual. The system approach treats errors as consequences rather than causes, and asks how and why the defences failed.",
        "Në 2000, psikologu James Reason përshkroi te BMJ dy mënyra për ta parë gabimin njerëzor. Qasja te personi kërkon individin harraq, të pavëmendshëm ose të pakujdesshëm. Qasja te sistemi i trajton gabimet si pasoja dhe jo si shkaqe, dhe pyet si dhe pse dështuan mbrojtjet.",
        "2000 beschrieb der Psychologe James Reason im BMJ zwei Sichtweisen auf menschliche Fehler. Der personenbezogene Ansatz sucht den vergesslichen, unaufmerksamen oder nachlässigen Einzelnen. Der Systemansatz sieht Fehler als Folgen, nicht als Ursachen, und fragt, wie und warum die Schutzbarrieren versagten."),
      blocks: [
        { type: "lists", cols: [
          { h: x("The person approach", "Qasja te personi", "Personenansatz"), items: [
            x("Who made the mistake?", "Kush e bëri gabimin?", "Wer hat den Fehler gemacht?"),
            x("Posters, retraining, discipline", "Postera, ritrajnim, disiplinë", "Plakate, Nachschulung, Disziplin"),
            x("Naming, blaming and shaming", "Emërto, fajëso, turpëro", "Benennen, beschuldigen, beschämen"),
          ] },
          { h: x("The system approach", "Qasja te sistemi", "Systemansatz"), accent: true, items: [
            x("How and why did the defences fail?", "Si dhe pse dështuan mbrojtjet?", "Wie und warum versagten die Barrieren?"),
            x("Change the conditions of the work", "Ndrysho kushtet e punës", "Die Bedingungen der Arbeit ändern"),
            x("Find the weak spots before they line up", "Gjej pikat e dobëta para se të rreshtohen", "Schwachstellen finden, bevor sie zusammentreffen"),
          ] },
        ] },
        { type: "p", text: x(
          "Reason knew which one comes easier: “Blaming individuals is emotionally more satisfying than targeting institutions.” Yet learning needs reports, reports need trust, and trust needs a shared understanding of where the line runs between blameless and blameworthy acts. In aviation maintenance, he noted, some 90% of quality lapses were judged blameless.",
          "Reason-i e dinte cila vjen më lehtë: “Fajësimi i individëve të kënaq më shumë emocionalisht sesa goditja e institucioneve.” Megjithatë, të mësuarit kërkon raportime, raportimet kërkojnë besim, dhe besimi kërkon një kuptim të përbashkët se ku kalon vija mes veprimeve të pafajshme dhe të fajshme. Në mirëmbajtjen e avionëve, shënonte ai, rreth 90% e lëshimeve në cilësi u gjykuan të pafajshme.",
          "Reason wusste, was leichter fällt: „Einzelne zu beschuldigen ist emotional befriedigender, als Institutionen ins Visier zu nehmen.“ Doch Lernen braucht Meldungen, Meldungen brauchen Vertrauen, und Vertrauen braucht ein gemeinsames Verständnis, wo die Linie zwischen schuldlosen und schuldhaften Handlungen verläuft. In der Flugzeugwartung, so Reason, wurden etwa 90 % der Qualitätsmängel als schuldlos beurteilt.") },
        { type: "callout", reading: true, text: x(
          "A rule about blame is also a rule about information: whatever gets punished stops being reported.",
          "Një rregull për fajin është edhe një rregull për informacionin: ajo që ndëshkohet, nuk raportohet më.",
          "Eine Regel über Schuld ist auch eine Regel über Information: Was bestraft wird, wird nicht mehr gemeldet.") },
      ],
      note: x(
        "An essay, not a new study; the 90% comes from a 1997 paper by David Marx that we did not see. Reason's book of 1997 already called a just culture an atmosphere of trust with a clear line.",
        "Ese, jo studim i ri; 90% vjen nga një punim i David Marx-it i 1997, që nuk e pamë. Libri i Reason-it i 1997 e quante kulturën e drejtë një atmosferë besimi me një vijë të qartë.",
        "Ein Essay, keine neue Studie; die 90 % stammen aus einem Text von David Marx von 1997, den wir nicht sahen. Reasons Buch von 1997 nannte Just Culture ein Klima des Vertrauens mit klarer Linie."),
      source: ["justculture-reason-2000", "justculture-reason-1997"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Encouraged to report,", "Të nxitur të raportojnë,", "Zum Melden ermutigt,"), x("not sure it is safe", "pa qenë të sigurt", "aber nicht sicher")],
      lead: x(
        "Every year the NHS Staff Survey asks the staff of all trusts in England about errors, near misses and incidents. In autumn 2025, 766,285 people answered, a response rate of 49%. The share who agree:",
        "Çdo vit, anketa e stafit të NHS-it i pyet punonjësit e të gjitha institucioneve (trusts) të NHS-it në Angli për gabimet, gati-incidentet dhe incidentet. Në vjeshtën e 2025 u përgjigjën 766.285 veta, 49% e të ftuarve. Pjesa që pajtohet:",
        "Jedes Jahr fragt die NHS-Mitarbeiterbefragung die Beschäftigten aller Trusts in England nach Fehlern, Beinahe-Ereignissen und Vorfällen. Im Herbst 2025 antworteten 766.285 Menschen, eine Rücklaufquote von 49 %. Der Anteil, der zustimmt:"),
      blocks: [
        { type: "hbars", source: ["justculture-nhs-nss-2025"],
          label: x("NHS staff in England who agree, 2025", "Punonjësit e NHS-it në Angli që pajtohen, 2025", "NHS-Beschäftigte in England, die zustimmen, 2025"),
          items: [
            { k: x("We are encouraged to report errors", "Nxitemi të raportojmë gabimet", "Wir werden ermutigt, Fehler zu melden"), v: 86.2, n: x("86.2%", "86,2%", "86,2 %") },
            { k: x("Action is taken so they do not recur", "Merren masa që të mos përsëriten", "Es wird gehandelt, damit sie sich nicht wiederholen"), v: 67.3, n: x("67.3%", "67,3%", "67,3 %") },
            { k: x("We hear about the changes made", "Na thuhet çfarë ndryshoi", "Wir erfahren, was geändert wurde"), v: 61.0, n: x("61.0%", "61,0%", "61,0 %") },
            { k: x("Those involved are treated fairly", "Të përfshirët trajtohen drejt", "Beteiligte werden fair behandelt"), v: 59.3, n: x("59.3%", "59,3%", "59,3 %"), alert: true },
          ] },
        { type: "p", text: x(
          "A third of staff (33.7%) had seen an error, near miss or incident in the last month that could have hurt staff or patients. The share who say those involved are treated fairly has hardly moved: 58.2% in 2022, 59.3% in 2025.",
          "Një e treta e punonjësve (33,7%) kishin parë në muajin e fundit një gabim, gati-incident ose incident që mund të lëndonte stafin ose pacientët. Pjesa që thotë se të përfshirët trajtohen drejt pothuajse nuk ka lëvizur: 58,2% në 2022, 59,3% në 2025.",
          "Ein Drittel der Beschäftigten (33,7 %) hatte im letzten Monat einen Fehler, ein Beinahe-Ereignis oder einen Vorfall gesehen, der Personal oder Patienten hätte schaden können. Der Anteil, der eine faire Behandlung der Beteiligten sieht, hat sich kaum bewegt: 58,2 % im Jahr 2022, 59,3 % im Jahr 2025.") },
        { type: "callout", reading: true, text: x(
          "Asking for reports is the easy step. Whether people keep reporting depends on what happens next, to the person and to the problem.",
          "Të kërkosh raportime është hapi i lehtë. Nëse njerëzit vazhdojnë të raportojnë varet nga ajo që ndodh më pas, me personin dhe me problemin.",
          "Um Meldungen zu bitten ist der leichte Schritt. Ob Menschen weiter melden, hängt davon ab, was danach geschieht, mit der Person und mit dem Problem.") },
      ],
      note: x(
        "“Agree” or “strongly agree”, weighted results for the 206 NHS trusts. Self-reports from one health system; for Albania and for other sectors we found no comparable figure.",
        "“Pajtohem” ose “pajtohem plotësisht”, rezultate të peshuara për 206 trust-et e NHS-it. Vetëdeklarime nga një sistem shëndetësor i vetëm; për Shqipërinë dhe për sektorë të tjerë nuk gjetëm shifër të krahasueshme.",
        "„Stimme zu“ oder „stimme voll zu“, gewichtete Ergebnisse für die 206 NHS-Trusts. Selbstauskünfte aus einem einzigen Gesundheitssystem; für Albanien und andere Branchen fanden wir keine vergleichbare Zahl."),
      source: ["justculture-nhs-nss-2025"],
    },
    {
      id: "model", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three behaviours,", "Tri sjellje,", "Drei Verhaltensweisen,"), x("three answers", "tri përgjigje", "drei Antworten")],
      lead: x(
        "In 2001 David Marx wrote a primer on just culture for hospital executives, from a lawyer's point of view. Judge the behaviour and the risk it carried, he argues, more than the outcome. In his model, as the American Nurses Association summed it up in 2010, each kind of behaviour calls for a different answer.",
        "Në 2001, David Marx-i shkroi për drejtuesit e spitaleve një udhëzues për kulturën e drejtë, nga këndvështrimi i një juristi. Gjyko sjelljen dhe rrezikun që mbarte, thotë ai, më shumë se rezultatin. Në modelin e tij, siç e përmblodhi Shoqata Amerikane e Infermierëve në 2010, çdo lloj sjelljeje kërkon një përgjigje tjetër.",
        "2001 schrieb David Marx für Klinikleitungen eine Einführung in die Just Culture, aus der Sicht eines Juristen. Zu beurteilen seien das Verhalten und das Risiko, das es barg, mehr als das Ergebnis. In seinem Modell, wie es die American Nurses Association 2010 zusammenfasste, verlangt jede Art von Verhalten eine andere Antwort."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Human error: console", "Gabim njerëzor: ngushëllo", "Menschlicher Fehler: trösten"), p: x("unintentionally doing other than what should have been done; then look at process, training and design", "bëre tjetër gjë nga ç'duhej, pa dashje; pastaj shiko procesin, trajnimin dhe dizajnin", "unabsichtlich anders gehandelt als vorgesehen; dann Prozess, Schulung und Gestaltung prüfen") },
          { h: x("At-risk: coach", "Sjellje me rrezik: udhëzo", "Riskant: coachen"), p: x("a choice whose risk was not seen, or was wrongly thought justified; remove the reward for the shortcut", "një zgjedhje rreziku i së cilës nuk u pa, ose u mendua gabimisht i justifikuar; hiq shpërblimin e rrugës së shkurtër", "eine Wahl, deren Risiko nicht erkannt oder fälschlich für vertretbar gehalten wurde; den Lohn der Abkürzung entfernen") },
          { h: x("Reckless: sanction", "Pamaturi: sanksiono", "Rücksichtslos: sanktionieren"), p: x("conscious disregard of a substantial and unjustifiable risk; remedial or punitive action", "shpërfillje e vetëdijshme e një rreziku të madh dhe të pajustifikueshëm; masa korrigjuese ose ndëshkuese", "bewusste Missachtung eines erheblichen, nicht zu rechtfertigenden Risikos; Abhilfe oder Strafe") },
        ] },
        { type: "p", text: x(
          "EU law draws a similar line for aviation. Regulation 376/2014, applied since November 2015, defines just culture as one where front-line staff are not punished for actions, omissions or decisions in line with their experience and training, but where gross negligence, wilful violations and destructive acts are not tolerated.",
          "Ligji i BE-së heq një vijë të ngjashme për aviacionin. Rregullorja 376/2014, që zbatohet nga nëntori 2015, e përkufizon kulturën e drejtë si atë ku stafi i vijës së parë nuk ndëshkohet për veprime, mosveprime ose vendime në përputhje me përvojën dhe trajnimin e tij, por ku pakujdesia e rëndë, shkeljet e qëllimshme dhe veprimet shkatërruese nuk tolerohen.",
          "Das EU-Recht zieht für die Luftfahrt eine ähnliche Linie. Die seit November 2015 geltende Verordnung 376/2014 definiert Just Culture als Kultur, in der Beschäftigte an der Front nicht für Handlungen, Unterlassungen oder Entscheidungen bestraft werden, die ihrer Erfahrung und Ausbildung entsprechen, grobe Fahrlässigkeit, vorsätzliche Verstöße und zerstörerische Handlungen aber nicht geduldet werden.") },
        { type: "callout", reading: true, text: x(
          "Most hard cases sit in the middle box: the shortcut everyone takes because the official way is slower.",
          "Shumica e rasteve të vështira janë në kutinë e mesme: rruga e shkurtër që e marrin të gjithë, sepse rruga zyrtare është më e ngadaltë.",
          "Die meisten schweren Fälle liegen im mittleren Feld: die Abkürzung, die alle nehmen, weil der offizielle Weg langsamer ist.") },
      ],
      note: x(
        "The three behaviours and answers follow the ANA's summary, which credits them to Marx; we did not see the primer, which AHRQ's summary organises around four concepts. The reading is the editors'.",
        "Tri sjelljet dhe përgjigjet ndjekin përmbledhjen e ANA-s, që ia atribuon Marx-it; udhëzuesin nuk e pamë, dhe përmbledhja e AHRQ-së e ndërton rreth katër koncepteve. Leximi është i redaksisë.",
        "Die drei Verhaltensweisen und Antworten folgen der Zusammenfassung der ANA, die sie Marx zuschreibt; die Einführung selbst haben wir nicht gesehen, die AHRQ-Zusammenfassung ordnet sie um vier Begriffe. Die Deutung stammt von der Redaktion."),
      source: ["justculture-marx-2001", "justculture-eu-376-2014"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Not who is to blame,", "Jo kush ka faj,", "Nicht wer schuld ist,"), x("but who was hurt", "por kush u lëndua", "sondern wer verletzt wurde")],
      lead: x(
        "In 2016 Mersey Care, an NHS mental health and community trust in the Liverpool region with about 8,000 staff, changed how it responds to incidents. Instead of asking how culpable an error was and what consequence fits, it asked: who is hurt, what do they need, and whose obligation is it to meet those needs?",
        "Në 2016, Mersey Care, një trust i NHS-it për shëndetin mendor dhe kujdesin në komunitet në rajonin e Liverpool-it, me rreth 8.000 punonjës, ndryshoi si u përgjigjet incidenteve. Në vend që të pyeste sa i fajshëm ishte gabimi dhe çfarë pasoje i takon, pyeti: kush është lënduar, çfarë i duhet, dhe kush e ka detyrën t'ia plotësojë?",
        "2016 änderte Mersey Care, ein NHS-Trust für psychische Gesundheit und gemeindenahe Versorgung in der Region Liverpool mit rund 8.000 Beschäftigten, seine Antwort auf Vorfälle. Statt zu fragen, wie schuldhaft ein Fehler war und welche Folge passt, fragte er: Wer ist verletzt, was braucht diese Person, und wessen Aufgabe ist es, das zu erfüllen?"),
      blocks: [
        { type: "columns", max: 70, height: 100, source: ["justculture-kaur-2019"],
          label: x("Disciplinary and suspension cases, two operational units", "Rastet disiplinore dhe pezullimet, dy njësi operative", "Disziplinar- und Suspendierungsfälle, zwei operative Bereiche"),
          items: [
            { k: x("Before", "Para", "Vorher"), v: 66, n: "66" },
            { k: x("After", "Pas", "Nachher"), v: 37, n: "37", alert: true },
          ] },
        { type: "p", text: x(
          "Over the same years, reports of adverse events rose by 7% to 18% a year, and requests for face-to-face counselling went from an average of 283 to 378 a year. The authors put the economic benefit at about £2.5 million, around 1% of total costs, after crediting only half of the savings they found to the new culture.",
          "Në të njëjtat vite, raportimet e ngjarjeve të padëshiruara u rritën me 7% deri në 18% në vit, dhe kërkesat për këshillim ballë për ballë shkuan nga mesatarisht 283 në 378 në vit. Autorët e vlerësojnë përfitimin ekonomik rreth 2,5 milionë paund, afërsisht 1% e kostove totale, pasi i atribuojnë kulturës së re vetëm gjysmën e kursimeve që gjetën.",
          "In denselben Jahren stiegen die Meldungen unerwünschter Ereignisse um 7 % bis 18 % pro Jahr, und die Anfragen nach persönlicher Beratung von durchschnittlich 283 auf 378 pro Jahr. Den wirtschaftlichen Nutzen schätzen die Autoren auf rund 2,5 Millionen Pfund, etwa 1 % der Gesamtkosten, nachdem sie nur die Hälfte der gefundenen Einsparungen der neuen Kultur zuschrieben.") },
        { type: "callout", reading: true, text: x(
          "Fewer cases alone proves little. More reports together with fewer suspensions is the pattern worth looking for.",
          "Vetëm më pak raste nuk provojnë shumë. Më shumë raportime bashkë me më pak pezullime është modeli që ia vlen të kërkohet.",
          "Weniger Fälle allein beweisen wenig. Mehr Meldungen bei weniger Suspendierungen ist das Muster, nach dem es sich zu suchen lohnt.") },
      ],
      note: x(
        "One trust, before and after (April 2014 to March 2018): the authors say the changes coincided with the new culture, not that it caused them. Two of the five authors worked at Mersey Care.",
        "Një trust i vetëm, para dhe pas (prill 2014 deri në mars 2018): autorët thonë se ndryshimet përkuan me kulturën e re, jo se ajo i shkaktoi. Dy nga pesë autorët punonin te Mersey Care.",
        "Ein Trust, vorher und nachher (April 2014 bis März 2018): Die Autoren sagen, die Veränderungen fielen mit der neuen Kultur zusammen, nicht, dass sie sie verursachte. Zwei der fünf Autoren arbeiteten bei Mersey Care."),
      source: ["justculture-kaur-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Who draws", "Kush e heq", "Wer die Linie"), x("the line", "vijën", "zieht")],
      lead: x(
        "Sidney Dekker's Just Culture (2007) asks when an honest mistake stops being honest, and then moves the question. In the words of the book's description:",
        "Libri Just Culture (2007) i Sidney Dekker-it pyet kur një gabim i ndershëm pushon së qeni i ndershëm, dhe pastaj e zhvendos pyetjen. Me fjalët e përshkrimit të librit:",
        "Sidney Dekkers Just Culture (2007) fragt, wann ein ehrlicher Fehler aufhört, ehrlich zu sein, und verschiebt dann die Frage. In den Worten der Buchbeschreibung:"),
      blocks: [
        { type: "quote", text: x(
          "What matters is not where the line goes, but who gets to draw it.",
          "Ajo që ka rëndësi nuk është ku kalon vija, por kush e ka të drejtën ta heqë.",
          "Entscheidend ist nicht, wo die Linie verläuft, sondern wer sie ziehen darf.") },
        { type: "steps", items: [
          { h: x("We are encouraged to report", "Nxitemi të raportojmë", "Wir werden zum Melden ermutigt"), p: x("Count reports per month, near misses included.", "Numëro raportimet në muaj, bashkë me gati-incidentet.", "Meldungen pro Monat zählen, Beinahe-Ereignisse eingeschlossen.") },
          { h: x("Those involved are treated fairly", "Të përfshirët trajtohen drejt", "Beteiligte werden fair behandelt"), p: x("Note what happened to the person after each report.", "Shëno çfarë ndodhi me personin pas çdo raportimi.", "Notieren, was nach jeder Meldung mit der Person geschah.") },
          { h: x("Action is taken", "Merren masa", "Es wird gehandelt"), p: x("Count reports closed with a change, not only an answer.", "Numëro raportimet e mbyllura me një ndryshim, jo vetëm me një përgjigje.", "Meldungen zählen, die mit einer Änderung abgeschlossen wurden, nicht nur mit einer Antwort.") },
          { h: x("We hear what changed", "Na thuhet çfarë ndryshoi", "Wir erfahren, was sich änderte"), p: x("Days from the report to feedback for the person who made it.", "Ditët nga raportimi deri te përgjigjja për atë që e bëri.", "Tage von der Meldung bis zur Rückmeldung an die meldende Person.") },
        ] },
        { type: "example", label: x("Hypothetical example, a quarter in a parcel depot", "Shembull hipotetik, një tremujor në një depo pakosh", "Hypothetisches Beispiel, ein Quartal in einem Paketdepot"), rows: [
          { k: x("Reports", "Raportimet", "Meldungen"), v: x("31, of them 12 near misses", "31, nga të cilat 12 gati-incidente", "31, davon 12 Beinahe-Ereignisse") },
          { k: x("Changes", "Ndryshimet", "Änderungen"), v: x("9 closed with a change", "9 të mbyllura me një ndryshim", "9 mit einer Änderung abgeschlossen") },
          { k: x("Feedback", "Përgjigjja", "Rückmeldung"), v: x("on 5 of the 9, after 19 days on average", "për 5 nga 9, pas 19 ditësh mesatarisht", "zu 5 der 9, nach durchschnittlich 19 Tagen") },
        ], text: x("The reports came; the answers were slow. The numbers are invented.", "Raportimet erdhën; përgjigjet vonuan. Numrat janë të shpikur.", "Die Meldungen kamen, die Antworten ließen auf sich warten. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The four statements follow questions 19a–d of the NHS Staff Survey; the counts and the example are the editors'. Dekker's sentence is from the publisher's description; the translations are ours.",
        "Katër pohimet ndjekin pyetjet 19a–d të anketës së stafit të NHS-it; numërimet dhe shembulli janë të redaksisë. Fjalia e Dekker-it është nga përshkrimi i botuesit; përkthimet janë tonat.",
        "Die vier Aussagen folgen den Fragen 19a–d der NHS-Mitarbeiterbefragung; die Zählungen und das Beispiel stammen von der Redaktion. Dekkers Satz stammt aus der Verlagsbeschreibung; die Übersetzungen sind unsere."),
      source: ["justculture-dekker-2007", "justculture-nhs-nss-2025"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The card for", "Karta pas", "Die Karte nach"), x("after an error", "një gabimi", "einem Fehler")],
      lead: x(
        "One card for each person involved, filled in before anyone decides on a consequence. The first lines are about the work and the system; only the last ones are about the person.",
        "Një kartë për çdo person të përfshirë, e plotësuar para se dikush të vendosë për një pasojë. Rreshtat e parë janë për punën dhe sistemin; vetëm të fundit janë për personin.",
        "Eine Karte für jede beteiligte Person, ausgefüllt, bevor jemand über eine Folge entscheidet. Die ersten Zeilen gelten der Arbeit und dem System, erst die letzten der Person."),
      blocks: [
        { type: "form", items: [
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), hint: x("facts, times and places; no labels", "fakte, orë dhe vende; pa etiketa", "Fakten, Zeiten und Orte; keine Etiketten"), lines: 2 },
          { h: x("Intended or impaired?", "Me qëllim apo i penguar?", "Absicht oder Beeinträchtigung?"), hint: x("harm meant, or signs of illness or substances? Then another procedure applies", "dëm i qëllimshëm, shenja sëmundjeje ose substancash? Atëherë vlen tjetër procedurë", "Schaden gewollt, Anzeichen von Krankheit oder Substanzen? Dann gilt ein anderes Verfahren") },
          { h: x("The rule", "Rregulli", "Die Regel"), hint: x("was there a procedure; was it available, workable and in routine use?", "a kishte procedurë të arritshme, të zbatueshme dhe në përdorim të rregullt?", "gab es ein Verfahren; war es verfügbar, praktikabel und im Alltag üblich?") },
          { h: x("A peer in the same place", "Një koleg në të njëjtin vend", "Kollege an derselben Stelle"), hint: x("would someone with the same training and experience have done the same?", "a do të kishte bërë të njëjtën gjë dikush me të njëjtin trajnim dhe përvojë?", "hätte jemand mit gleicher Ausbildung und Erfahrung dasselbe getan?") },
          { h: x("Behaviour and answer", "Sjellja dhe përgjigjja", "Verhalten und Antwort"), hint: x("human error: console · at-risk: coach · reckless: sanction", "gabim njerëzor: ngushëllo · me rrezik: udhëzo · pamaturi: sanksiono", "menschlicher Fehler: trösten · riskant: coachen · rücksichtslos: sanktionieren") },
          { h: x("System change and feedback", "Ndryshimi në sistem dhe përgjigjja", "Systemänderung und Rückmeldung"), hint: x("what changes, who owns it, by when; when the reporter hears", "çfarë ndryshon, kush e ka, deri kur; kur merr vesh ai që raportoi", "was sich ändert, wer verantwortlich ist, bis wann; wann die meldende Person es erfährt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the four tests of the NPSA Incident Decision Tree, based on Reason's culpability model, and Marx's three behaviours. It does not replace an investigation or HR procedures.",
        "Praktikë e propozuar nga redaksia, sipas katër provave të Incident Decision Tree të NPSA-së, mbi modelin e fajësisë të Reason-it, dhe tri sjelljeve të Marx-it. Nuk zëvendëson hetimin ose procedurat e personelit.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den vier Tests des Incident Decision Tree der NPSA, der auf Reasons Schuldmodell beruht, und Marx' drei Verhaltensweisen. Sie ersetzt keine Untersuchung und keine Personalverfahren."),
      source: ["justculture-npsa-idt", "justculture-marx-2001"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
