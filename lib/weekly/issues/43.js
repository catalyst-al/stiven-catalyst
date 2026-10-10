// Management Review, No. 43: When a measure becomes a target: Goodhart's law. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-43.md.
import { x, pc } from "../common.js";

export default {
  number: 43,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("When a measure", "Kur matja", "Wenn die Kennzahl"), x("becomes a target", "bëhet objektiv", "zum Ziel wird")],
  sub: x(
    "Goodhart, Campbell and Strathern on one idea, official waiting times against what patients said, three ways to hit a number, sales targets behind unauthorised accounts, and a card to check a target before it is set.",
    "Goodhart-i, Campbell-i dhe Strathern për një ide, kohët zyrtare të pritjes përballë asaj që thanë pacientët, tri mënyra për ta arritur numrin, objektiva shitjesh pas llogarive të paautorizuara, dhe një kartë për ta kontrolluar një objektiv para se të vendoset.",
    "Goodhart, Campbell und Strathern zu einer Idee, amtliche Wartezeiten neben dem, was Patienten sagten, drei Wege, eine Zahl zu treffen, Verkaufsziele hinter nicht genehmigten Konten, und eine Karte, um ein Ziel vor dem Festlegen zu prüfen."),
  seo: x(
    "Goodhart's law: its three authors, A&E targets against patient surveys, three kinds of gaming, sales targets at Wells Fargo, Muller's metric fixation, a card.",
    "Ligji i Goodhart-it: tre autorët, objektivat e urgjencës përballë anketave të pacientëve, tri lloje lojërash me numrat, Wells Fargo dhe një kartë.",
    "Goodharts Gesetz: drei Urheber, Notaufnahme-Ziele neben Patientenumfragen, drei Arten des Austricksens, Verkaufsziele bei Wells Fargo und eine Karte."),
  feature: x(
    "Issue 43 follows one idea from Charles Goodhart's monetary paper of 1975 through Donald Campbell and Marilyn Strathern, sets the official waiting times of English emergency departments against what patients reported, names three ways a number gets hit without the work improving, looks at sales targets behind accounts customers had not authorised, turns to Jerry Muller's metric fixation, and ends with a card to check a target before it is set.",
    "Numri 43 ndjek një ide nga punimi monetar i Charles Goodhart-it në 1975, përmes Donald Campbell-it dhe Marilyn Strathern, vë kohët zyrtare të pritjes në urgjencat angleze përballë asaj që raportuan pacientët, emërton tri mënyra si arrihet një numër pa u përmirësuar puna, shikon objektiva shitjesh pas llogarive që klientët nuk i kishin autorizuar, kalon te fiksimi pas metrikave i Jerry Muller-it, dhe mbyllet me një kartë për ta kontrolluar një objektiv para se të vendoset.",
    "Ausgabe 43 verfolgt eine Idee von Charles Goodharts geldpolitischem Aufsatz von 1975 über Donald Campbell bis Marilyn Strathern, stellt die amtlichen Wartezeiten englischer Notaufnahmen neben das, was Patienten berichteten, benennt drei Wege, wie eine Zahl erreicht wird, ohne dass die Arbeit besser wird, betrachtet Verkaufsziele hinter Konten, die Kunden nicht genehmigt hatten, wendet sich Jerry Mullers Kennzahlenfixierung zu und endet mit einer Karte, um ein Ziel vor dem Festlegen zu prüfen."),
  figure: { n: pc(77), by: "Bevan & Hood, 2006", t: x(
    "of patients in a 2004/05 survey said they were seen within four hours in English emergency departments. The official figure was 96%.",
    "e pacientëve në një anketë të 2004/05 thanë se u panë brenda katër orëve në urgjencat angleze. Shifra zyrtare ishte 96%.",
    "der Patienten gaben 2004/05 in einer Umfrage an, in englischen Notaufnahmen binnen vier Stunden behandelt worden zu sein. Die amtliche Zahl lag bei 96 %.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One law, three authors", "Një ligj, tre autorë", "Ein Gesetz, drei Urheber") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three ways to hit a number", "Tri mënyra për ta arritur numrin", "Drei Wege, eine Zahl zu treffen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The target check card", "Karta e kontrollit të objektivit", "Die Karte zur Zielprüfung") },
  ],
  sources: ["goodhart-1975", "gl-campbell-1979", "strathern-1997", "gl-bevan-hood-2006", "gl-cfpb-wells-fargo-2016", "gl-wells-fargo-2020", "ordonez-2009", "gl-muller-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A number on a board is a signal. Once pay, rankings or blame depend on it, it also becomes something people steer. This issue is about what happens to a measure when it is made a target, and how a manager can tell a number that improved from work that improved.",
        "Një numër në tabelë është sinjal. Sapo paga, renditja ose faji varen prej tij, ai bëhet edhe diçka që njerëzit e drejtojnë. Ky numër flet për atë që i ndodh një mase kur kthehet në objektiv, dhe si e dallon një menaxher një numër që u përmirësua nga një punë që u përmirësua.",
        "Eine Zahl an der Tafel ist ein Signal. Sobald Lohn, Rangfolge oder Schuld von ihr abhängen, wird sie auch zu etwas, das Menschen steuern. Diese Ausgabe handelt davon, was mit einer Kennzahl geschieht, wenn sie zum Ziel wird, und wie eine Führungskraft eine Zahl, die besser wurde, von Arbeit unterscheidet, die besser wurde."),
      body: x(
        "Charles Goodhart stated the rule for money in 1975, Donald Campbell for social indicators a year later, and Marilyn Strathern gave it the short form in 1997. In English emergency departments, the official share of patients seen within four hours was 96% in 2004/05; patients in a survey put it at 77%. Gwyn Bevan and Christopher Hood name three kinds of gaming, Wells Fargo shows what sales targets can pay for, and Jerry Muller warns against metric fixation.",
        "Charles Goodhart e formuloi rregullin për paranë në 1975, Donald Campbell për treguesit socialë një vit më vonë, dhe Marilyn Strathern i dha formën e shkurtër në 1997. Në urgjencat angleze, pjesa zyrtare e pacientëve të parë brenda katër orëve ishte 96% në 2004/05; pacientët në një anketë e vunë në 77%. Gwyn Bevan dhe Christopher Hood emërtojnë tri lloje lojërash me numrat, Wells Fargo tregon çfarë mund të shpërblejnë objektivat e shitjeve, dhe Jerry Muller paralajmëron kundër fiksimit pas metrikave.",
        "Charles Goodhart formulierte die Regel 1975 für das Geld, Donald Campbell ein Jahr später für soziale Indikatoren, und Marilyn Strathern gab ihr 1997 die kurze Form. In englischen Notaufnahmen lag der amtliche Anteil der binnen vier Stunden behandelten Patienten 2004/05 bei 96 %; Patienten in einer Umfrage nannten 77 %. Gwyn Bevan und Christopher Hood benennen drei Arten des Austricksens, Wells Fargo zeigt, was Verkaufsziele belohnen können, und Jerry Muller warnt vor der Kennzahlenfixierung."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One law,", "Një ligj,", "Ein Gesetz,"), x("three authors", "tre autorë", "drei Urheber")],
      lead: x(
        "In July 1975, at a Reserve Bank of Australia conference in Sydney, Charles Goodhart of the Bank of England presented a paper on monetary management in the UK. It holds the first statement of what became Goodhart's law:",
        "Në korrik 1975, në një konferencë të Bankës Qendrore të Australisë në Sidnej, Charles Goodhart nga Banka e Anglisë paraqiti një punim për menaxhimin monetar në Mbretërinë e Bashkuar. Aty gjendet formulimi i parë i asaj që u bë ligji i Goodhart-it:",
        "Im Juli 1975 stellte Charles Goodhart von der Bank of England auf einer Konferenz der Reserve Bank of Australia in Sydney einen Aufsatz über die Geldpolitik im Vereinigten Königreich vor. Er enthält die erste Fassung dessen, was Goodharts Gesetz wurde:"),
      blocks: [
        { type: "quote", text: x(
          "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.",
          "Çdo rregullsi statistikore e vëzhguar priret të shembet sapo ushtrohet presion mbi të për qëllime kontrolli.",
          "Jede beobachtete statistische Regelmäßigkeit neigt dazu zusammenzubrechen, sobald zu Kontrollzwecken Druck auf sie ausgeübt wird.") },
        { type: "timeline", items: [
          { k: "1975", t: x("Goodhart: a regularity used for control breaks down.", "Goodhart: një rregullsi e përdorur për kontroll prishet.", "Goodhart: Eine Regelmäßigkeit, mit der man steuert, bricht zusammen.") },
          { k: "1976", t: x("Campbell: an indicator used for decisions distorts the work it monitors.", "Campbell: një tregues i përdorur për vendime shtrembëron punën që ndjek.", "Campbell: Ein Indikator für Entscheidungen verzerrt die Arbeit, die er beobachtet.") },
          { k: "1996", t: x("Keith Hoskin calls the idea Goodhart's law.", "Keith Hoskin e quan idenë ligji i Goodhart-it.", "Keith Hoskin nennt die Idee Goodharts Gesetz.") },
          { k: "1997", t: x("Strathern gives the idea its short form.", "Strathern i jep idesë formën e shkurtër.", "Strathern gibt der Idee ihre kurze Form.") },
        ] },
        { type: "p", text: x(
          "“When a measure becomes a target, it ceases to be a good measure,” wrote Strathern about audit in British universities: the more a good grade is expected, the worse it tells students apart.",
          "“Kur një masë bëhet objektiv, ajo pushon së qeni një masë e mirë”, shkroi Strathern për auditimin në universitetet britanike: sa më shumë pritet një notë e mirë, aq më keq i dallon ajo studentët.",
          "„Wenn eine Kennzahl zum Ziel wird, hört sie auf, eine gute Kennzahl zu sein“, schrieb Strathern über Audits an britischen Universitäten: Je mehr eine gute Note erwartet wird, desto schlechter unterscheidet sie die Studierenden.") },
        { type: "callout", reading: true, text: x(
          "Goodhart says the number stops telling the truth. Campbell adds that the work changes too. A manager has to watch both.",
          "Goodhart-i thotë se numri pushon së thëni të vërtetën. Campbell-i shton se ndryshon edhe puna. Një menaxher duhet t'i ndjekë të dyja.",
          "Goodhart sagt, die Zahl hört auf, die Wahrheit zu sagen. Campbell fügt hinzu, dass sich auch die Arbeit verändert. Eine Führungskraft muss beides im Blick haben.") },
      ],
      note: x(
        "The volume is dated 1976, the paper usually cited as 1975; a 1984 reprint is quoted with \"on\" for \"upon\". Campbell's journal version is from 1979. Translations are ours.",
        "Vëllimi mban datën 1976, punimi zakonisht citohet si i 1975; një ribotim i 1984 citohet me \"on\" në vend të \"upon\". Versioni i Campbell-it në revistë është i 1979. Përkthimet janë tonat.",
        "Der Band trägt das Datum 1976, der Aufsatz wird meist mit 1975 zitiert; ein Nachdruck von 1984 wird mit „on“ statt „upon“ zitiert. Campbells Zeitschriftenfassung ist von 1979. Die Übersetzungen sind unsere."),
      source: ["goodhart-1975", "gl-campbell-1979", "strathern-1997"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Reported", "E raportuar", "Gemeldet"), x("and experienced", "dhe e përjetuar", "und erlebt")],
      lead: x(
        "In the early 2000s England rated its hospitals with stars, and four hours in accident and emergency (A&E) was a key target. Gwyn Bevan and Christopher Hood set the official figures next to independent surveys of patients.",
        "Në fillim të viteve 2000, Anglia i vlerësonte spitalet me yje, dhe katër orët në urgjencë ishin një objektiv kyç. Gwyn Bevan dhe Christopher Hood i vunë shifrat zyrtare pranë anketave të pavarura të pacientëve.",
        "Anfang der 2000er-Jahre bewertete England seine Kliniken mit Sternen, und vier Stunden in der Notaufnahme waren ein Schlüsselziel. Gwyn Bevan und Christopher Hood stellten die amtlichen Zahlen neben unabhängige Patientenumfragen."),
      blocks: [
        { type: "hbars", source: ["gl-bevan-hood-2006"],
          label: x("Patients in English A&E seen within four hours", "Pacientë në urgjencat angleze të parë brenda katër orëve", "Patienten in englischen Notaufnahmen, binnen vier Stunden behandelt"),
          items: [
            { k: x("Official figure, 2004/05", "Shifra zyrtare, 2004/05", "Amtliche Zahl, 2004/05"), v: 96, n: pc(96) },
            { k: x("Patient survey, 2004/05", "Anketa e pacientëve, 2004/05", "Patientenumfrage, 2004/05"), v: 77, n: pc(77), alert: true },
            { k: x("Patient survey, 2002/03", "Anketa e pacientëve, 2002/03", "Patientenumfrage, 2002/03"), v: 69, n: pc(69) },
          ] },
        { type: "p", text: x(
          "In 2002/03 the official returns showed 139 of 158 acute trusts seeing 90% of patients within four hours. Ambulances had to reach 75% of life-threatening calls within eight minutes; in a third of ambulance trusts, inspectors found times “corrected” to under eight, with a spike at the eight-minute mark.",
          "Në 2002/03, të dhënat zyrtare tregonin 139 nga 158 spitale akute që i shihnin 90% të pacientëve brenda katër orëve. Ambulancat duhej të arrinin 75% të thirrjeve për raste që rrezikojnë jetën brenda tetë minutave; në një të tretën e shërbimeve të ambulancës, inspektorët gjetën kohë të “korrigjuara” nën tetë minuta, me një majë te shenja e tetë minutave.",
          "2002/03 wiesen die amtlichen Meldungen 139 von 158 Akutkliniken aus, die 90 % der Patienten binnen vier Stunden behandelten. Rettungswagen mussten 75 % der lebensbedrohlichen Notrufe in acht Minuten erreichen; in einem Drittel der Rettungsdienste fanden Prüfer auf unter acht Minuten „korrigierte“ Zeiten, mit einer Spitze genau bei acht Minuten.") },
        { type: "callout", reading: true, text: x(
          "A target that only the measured report on checks their reporting, not their work.",
          "Një objektiv për të cilin raportojnë vetëm ata që maten kontrollon raportimin e tyre, jo punën.",
          "Ein Ziel, über das nur die Gemessenen berichten, prüft ihr Berichten, nicht ihre Arbeit.") },
      ],
      note: x(
        "Hospitals reported the official figures, patients answered the surveys: the gap is a warning, not a measure of gaming. Bevan & Hood cite the National Audit Office, the Healthcare Commission and the Commission for Health Improvement.",
        "Shifrat zyrtare i raportuan spitalet, anketat i plotësuan pacientët: diferenca është paralajmërim, jo matje e lojës me numrat. Bevan & Hood citojnë Zyrën Kombëtare të Auditimit, Healthcare Commission dhe Commission for Health Improvement.",
        "Die amtlichen Zahlen meldeten die Kliniken, die Umfragen beantworteten Patienten: Die Lücke ist eine Warnung, kein Maß für Manipulation. Bevan & Hood stützen sich auf das National Audit Office, die Healthcare Commission und die Commission for Health Improvement."),
      source: ["gl-bevan-hood-2006"],
    },
    {
      id: "model", more: "how-we-worked-with-damage",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three ways", "Tri mënyra", "Drei Wege,"), x("to hit a number", "për ta arritur numrin", "eine Zahl zu treffen")],
      lead: x(
        "Bevan and Hood describe gaming as “hitting the target and missing the point”. From studies of Soviet production targets they take three kinds, each with its own warning sign.",
        "Bevan dhe Hood e përshkruajnë lojën me numrat si “ta godasësh objektivin dhe ta humbasësh thelbin”. Nga studimet për objektivat e prodhimit sovjetik marrin tri lloje, secili me shenjën e vet paralajmëruese.",
        "Bevan und Hood beschreiben das Austricksen als „das Ziel treffen und den Sinn verfehlen“. Aus Studien zu sowjetischen Produktionszielen übernehmen sie drei Arten, jede mit eigenem Warnzeichen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Ratchet", "Rritja pa kthim", "Ratscheneffekt"), p: x("next year's target is built on this year's result, so it pays not to beat it by much", "objektivi i vitit tjetër ndërtohet mbi rezultatin e këtij viti, ndaj nuk ia vlen ta kalosh shumë", "das Ziel des nächsten Jahres baut auf dem Ergebnis dieses Jahres auf, also lohnt es nicht, es weit zu übertreffen") },
          { h: x("Threshold", "Pragu", "Schwelle"), p: x("results crowd at the line, and those above it may slip back to it", "rezultatet grumbullohen te vija, dhe ata sipër saj mund të rrëshqasin deri te ajo", "Ergebnisse drängen sich an der Linie, und wer darüber liegt, rutscht womöglich auf sie zurück") },
          { h: x("Distortion", "Shtrembërimi", "Verzerrung"), p: x("the target is met at the cost of what nobody measures", "objektivi arrihet në kurriz të asaj që nuk e mat askush", "das Ziel wird auf Kosten dessen erreicht, was niemand misst") },
        ] },
        { type: "p", text: x(
          "“A wise director fulfils the plan 105 per cent, but never 125 per cent,” Alec Nove wrote of Soviet managers in 1958. In an employment office Campbell cites, staff counted by placements took the easiest cases. In one large English hospital, the target for new eye appointments was met by cancelling and delaying follow-ups, which no target counted; a parliamentary committee reported that 25 patients lost their sight over two years as a result.",
          "“Një drejtor i mençur e realizon planin 105 për qind, por kurrë 125 për qind”, shkroi Alec Nove për drejtuesit sovjetikë në 1958. Në një zyrë punësimi që citon Campbell-i, punonjësit e matur me numrin e punësimeve merrnin rastet më të lehta. Në një spital të madh anglez, objektivi për takimet e reja te okulisti u arrit duke anuluar e shtyrë kontrollet pasuese, që nuk i numëronte asnjë objektiv; një komision parlamentar raportoi se si pasojë 25 pacientë humbën shikimin brenda dy vjetëve.",
          "„Ein kluger Direktor erfüllt den Plan zu 105 Prozent, aber nie zu 125 Prozent“, schrieb Alec Nove 1958 über sowjetische Manager. In einem Arbeitsamt, das Campbell nennt, nahmen Beschäftigte, die nach Vermittlungen gezählt wurden, die leichtesten Fälle. In einer großen englischen Klinik wurde das Ziel für neue Augentermine erreicht, indem Nachuntersuchungen abgesagt und verschoben wurden, die kein Ziel zählte; ein Parlamentsausschuss berichtete, dass dadurch 25 Patienten binnen zwei Jahren ihr Augenlicht verloren.") },
        { type: "callout", reading: true, text: x(
          "Every target has a shadow: the work next to it that nobody counts. Name it before you set the target.",
          "Çdo objektiv ka një hije: punën pranë tij që nuk e numëron askush. Emërtoje para se ta vendosësh objektivin.",
          "Jedes Ziel hat einen Schatten: die Arbeit daneben, die niemand zählt. Ihn benennen, bevor man das Ziel setzt.") },
      ],
      note: x(
        "The three kinds and Nove's line follow Bevan & Hood (2006); the eye clinic case is from a 2003 select committee report they cite, the employment office from Campbell. The reading is the editors'.",
        "Tri llojet dhe fjalia e Nove-s ndjekin Bevan & Hood (2006); rasti i okulistit vjen nga një raport i një komisioni parlamentar të 2003 që ata citojnë, zyra e punësimit nga Campbell-i. Leximi është i redaksisë.",
        "Die drei Arten und Noves Satz folgen Bevan & Hood (2006); der Fall der Augenklinik stammt aus einem von ihnen zitierten Ausschussbericht von 2003, das Arbeitsamt von Campbell. Die Deutung stammt von der Redaktion."),
      source: ["gl-bevan-hood-2006", "gl-campbell-1979"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When pay follows", "Kur paga", "Wenn der Lohn"), x("the number", "ndjek numrin", "der Zahl folgt")],
      lead: x(
        "In September 2016 the US Consumer Financial Protection Bureau fined Wells Fargo. Spurred by sales targets and compensation incentives, thousands of employees had secretly opened accounts customers had not authorised. By the bank's own analysis:",
        "Në shtator 2016, Byroja amerikane për Mbrojtjen Financiare të Konsumatorit e gjobiti Wells Fargo-n. Të shtyrë nga objektivat e shitjeve dhe nga shpërblimet, mijëra punonjës kishin hapur fshehurazi llogari që klientët nuk i kishin autorizuar. Sipas analizës së vetë bankës:",
        "Im September 2016 verhängte die US-Verbraucherschutzbehörde für Finanzen (CFPB) eine Strafe gegen Wells Fargo. Angetrieben von Verkaufszielen und Vergütungsanreizen hatten Tausende Beschäftigte heimlich Konten eröffnet, die Kunden nicht genehmigt hatten. Nach der Analyse der Bank selbst:"),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("1.5 million", "1,5 milionë", "1,5 Mio."), t: x("deposit accounts that may not have been authorised", "llogari depozitash që mund të mos ishin autorizuar", "Einlagenkonten, die womöglich nicht genehmigt waren") },
          { n: x("565,000", "565.000", "565.000"), t: x("credit card accounts applied for without authorisation", "llogari kartash krediti të kërkuara pa autorizim", "Kreditkartenkonten, ohne Genehmigung beantragt") },
          { n: x("$185m", "185 mln $", "185 Mio. $"), t: x("in fines from the CFPB, the OCC and the City and County of Los Angeles", "gjoba nga CFPB, OCC dhe Qyteti e Qarku i Los Angeles", "Strafen von CFPB, OCC sowie Stadt und County Los Angeles") },
        ] },
        { type: "p", text: x(
          "In 2020 the bank agreed to pay $3 billion to settle the federal investigations into its sales practices from 2002 to 2016. The pattern is older: in the early 1990s Sears set its auto repair staff a goal of $147 an hour, and staff overcharged and did repairs no one needed. In a laboratory study, Schweitzer, Ordóñez and Douma found people more likely to overstate their results with a specific, challenging goal than without one, above all when they had just fallen short.",
          "Në 2020, banka pranoi të paguante 3 miliardë dollarë për të mbyllur hetimet federale për praktikat e shitjes nga 2002 deri në 2016. Modeli është më i vjetër: në fillim të viteve 1990, Sears u vuri punonjësve të riparimit të makinave objektivin 147 dollarë në orë, dhe ata faturuan më shumë e bënë riparime që s'i duheshin askujt. Në një studim laboratorik, Schweitzer, Ordóñez dhe Douma gjetën se njerëzit i fryjnë më shpesh rezultatet kur kanë një objektiv të qartë e të vështirë sesa kur s'kanë, sidomos kur sapo kanë mbetur pak poshtë tij.",
          "2020 willigte die Bank ein, 3 Milliarden Dollar zu zahlen, um die Bundesermittlungen zu ihren Verkaufspraktiken von 2002 bis 2016 beizulegen. Das Muster ist älter: Anfang der 1990er-Jahre gab Sears den Beschäftigten seiner Kfz-Werkstätten ein Ziel von 147 Dollar pro Stunde vor, und die Beschäftigten berechneten zu viel und machten unnötige Reparaturen. In einer Laborstudie fanden Schweitzer, Ordóñez und Douma, dass Menschen mit einem konkreten, schweren Ziel ihre Ergebnisse eher übertreiben als ohne Ziel, vor allem, wenn sie es knapp verfehlt haben.") },
        { type: "callout", reading: true, text: x(
          "The risk is highest just below the line. That is where a target needs a check, not more pressure.",
          "Rreziku është më i madh pak poshtë vijës. Aty një objektiv ka nevojë për kontroll, jo për më shumë presion.",
          "Das Risiko ist knapp unter der Linie am größten. Dort braucht ein Ziel eine Prüfung, keinen zusätzlichen Druck.") },
      ],
      note: x(
        "Account numbers: the bank's estimate, as reported by the CFPB; 2020: the bank's announcement. Sears and the laboratory study as cited by Ordóñez et al. (2009).",
        "Numrat e llogarive: vlerësim i bankës, siç i raportoi CFPB; 2020: njoftimi i bankës. Sears dhe studimi laboratorik sipas Ordóñez et al. (2009).",
        "Kontozahlen: Schätzung der Bank, wie die CFPB sie meldete; 2020: Mitteilung der Bank. Sears und die Laborstudie nach Ordóñez et al. (2009)."),
      source: ["gl-cfpb-wells-fargo-2016", "gl-wells-fargo-2020", "ordonez-2009"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Measure", "Mat edhe", "Die Kennzahl"), x("the measure", "masën", "messen")],
      lead: x(
        "Jerry Muller calls the problem metric fixation: the belief that numbers can replace judgement, that publishing them ensures accountability, and that rewards tied to them motivate best. He is not against measuring, and Bevan and Hood suggest ways to make a target harder to game.",
        "Jerry Muller-i e quan problemin fiksim pas metrikave: besimi se numrat mund të zëvendësojnë gjykimin, se publikimi i tyre siguron llogaridhënien, dhe se shpërblimet e lidhura me to motivojnë më mirë. Ai nuk është kundër matjes, dhe Bevan e Hood sugjerojnë si bëhet më e vështirë loja me një objektiv.",
        "Jerry Muller nennt das Problem Kennzahlenfixierung: den Glauben, Zahlen könnten Urteilskraft ersetzen, ihre Veröffentlichung sichere Rechenschaft, und daran geknüpfte Belohnungen motivierten am besten. Er ist nicht gegen das Messen, und Bevan und Hood zeigen, wie ein Ziel schwerer auszutricksen ist."),
      blocks: [
        { type: "steps", items: [
          { h: x("Compare with a second source", "Krahasoje me një burim të dytë", "Mit einer zweiten Quelle vergleichen"), p: x("The patient surveys showed a gap the official returns did not.", "Anketat e pacientëve treguan një diferencë që të dhënat zyrtare nuk e tregonin.", "Die Patientenumfragen zeigten eine Lücke, die die amtlichen Meldungen nicht zeigten.") },
          { h: x("Look at the spread, not only the share", "Shiko shpërndarjen, jo vetëm përqindjen", "Die Verteilung ansehen, nicht nur den Anteil"), p: x("A spike just under the line, like the one at eight minutes, is a sign.", "Një majë pak nën vijë, si ajo te tetë minutat, është shenjë.", "Eine Spitze knapp unter der Linie, wie die bei acht Minuten, ist ein Zeichen.") },
          { h: x("Check where no one expects it", "Kontrollo aty ku s'e pret njeri", "Prüfen, wo niemand damit rechnet"), p: x("Open afterwards, uncertain in real time: random checks and visits.", "E hapur më pas, e pasigurt në çast: kontrolle dhe vizita të rastësishme.", "Im Nachhinein offen, im Moment ungewiss: Stichproben und Besuche.") },
        ] },
        { type: "example", label: x("Hypothetical example, a dispatch target", "Shembull hipotetik, një objektiv nisjeje", "Hypothetisches Beispiel, ein Abfahrtsziel"), rows: [
          { k: x("Target", "Objektivi", "Ziel"), v: x("95% of vans out by 07:00", "95% e furgonëve nisen deri në 07:00", "95 % der Transporter bis 7:00 Uhr unterwegs") },
          { k: x("Reported", "E raportuar", "Gemeldet"), v: x("96%, and a third of departures logged at 06:59", "96%, dhe një e treta e nisjeve e regjistruar në 06:59", "96 %, und ein Drittel der Abfahrten um 6:59 Uhr erfasst") },
          { k: x("Second source", "Burimi i dytë", "Zweite Quelle"), v: x("late-delivery complaints unchanged", "ankesat për vonesa të pandryshuara", "Beschwerden über Verspätungen unverändert") },
        ], text: x("The share rose; the spread and the complaints say why. The numbers are invented.", "Përqindja u rrit; shpërndarja dhe ankesat tregojnë pse. Numrat janë të shpikur.", "Der Anteil stieg; Verteilung und Beschwerden zeigen, warum. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Muller's three beliefs are from his book and a 2018 essay; the steps are the editors' reading of Bevan & Hood (2006), not a tested method.",
        "Tri besimet e Muller-it vijnë nga libri i tij dhe një ese e 2018; hapat janë leximi i redaksisë për Bevan & Hood (2006), jo metodë e provuar.",
        "Mullers drei Annahmen stammen aus seinem Buch und einem Essay von 2018; die Schritte sind die Lesart der Redaktion zu Bevan & Hood (2006), keine geprüfte Methode."),
      source: ["gl-muller-2018", "gl-bevan-hood-2006"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The target", "Karta e kontrollit", "Die Karte zur"), x("check card", "të objektivit", "Zielprüfung")],
      lead: x(
        "Fill it in with the team before a number becomes a target. The people who do the work usually know the fourth line best: ask them.",
        "Plotësoje me ekipin para se një numër të bëhet objektiv. Rreshtin e katërt zakonisht e dinë më mirë njerëzit që bëjnë punën: pyeti ata.",
        "Mit dem Team ausfüllen, bevor eine Zahl zum Ziel wird. Die vierte Zeile kennen meist die Menschen am besten, die die Arbeit machen: sie fragen."),
      blocks: [
        { type: "form", items: [
          { h: x("The number and the target", "Numri dhe objektivi", "Zahl und Ziel"), hint: x("definition, source of the data, the line", "përkufizimi, burimi i të dhënave, vija", "Definition, Datenquelle, die Linie") },
          { h: x("What it is meant to show", "Çfarë duhet të tregojë", "Was sie zeigen soll"), hint: x("the purpose behind it, in one sentence", "qëllimi pas tij, në një fjali", "der Zweck dahinter, in einem Satz") },
          { h: x("What depends on it", "Çfarë varet prej tij", "Was von ihr abhängt"), hint: x("pay, ranking, praise or blame, and for whom", "paga, renditja, lavdërimi ose faji, dhe për kë", "Lohn, Rangfolge, Lob oder Schuld, und für wen") },
          { h: x("How it could be hit without the work improving", "Si mund të arrihet pa u përmirësuar puna", "Wie man sie erreicht, ohne dass die Arbeit besser wird"), hint: x("ratchet, threshold, distortion, recording", "rritja pa kthim, pragu, shtrembërimi, regjistrimi", "Ratscheneffekt, Schwelle, Verzerrung, Erfassung"), lines: 2 },
          { h: x("Its shadow", "Hija e tij", "Ihr Schatten"), hint: x("the work next to it that nobody counts, and a second number for it", "puna pranë tij që nuk e numëron askush, dhe një numër i dytë për të", "die Arbeit daneben, die niemand zählt, und eine zweite Zahl dafür") },
          { h: x("The independent check", "Kontrolli i pavarur", "Die unabhängige Prüfung"), hint: x("a survey, a sample or a visit; who, how often", "një anketë, një mostër ose një vizitë; kush, sa shpesh", "eine Umfrage, eine Stichprobe oder ein Besuch; wer, wie oft") },
          { h: x("Review date", "Data e rishikimit", "Prüftermin"), hint: x("when we ask whether it still means what it meant", "kur pyesim nëse ende tregon atë që tregonte", "wann wir fragen, ob sie noch bedeutet, was sie bedeutete") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Bevan & Hood (2006), Campbell (1979) and Muller (2018).",
        "Praktikë e propozuar nga redaksia, sipas Bevan & Hood (2006), Campbell-it (1979) dhe Muller-it (2018).",
        "Eine Praxis, die die Redaktion vorschlägt, nach Bevan & Hood (2006), Campbell (1979) und Muller (2018)."),
      source: ["gl-bevan-hood-2006", "gl-campbell-1979", "gl-muller-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
