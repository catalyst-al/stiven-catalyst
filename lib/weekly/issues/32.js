// Management Review, No. 32: NPS, CSAT, CES: what they really measure. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-32.md.
import { x, pc } from "../common.js";

export default {
  number: 32,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("NPS, CSAT, CES:", "NPS, CSAT, CES:", "NPS, CSAT, CES:"), x("what they really measure", "çfarë matin vërtet", "was sie wirklich messen")],
  sub: x(
    "Why a 6 counts as a detractor, what customer effort does to loyalty, three metrics and three questions, whether NPS predicts growth, one set of answers with three scores, and a card.",
    "Pse 6 numërohet si kritik, çfarë i bën përpjekja e klientit besnikërisë, tre matës dhe tri pyetje, nëse NPS e parashikon rritjen, të njëjtat përgjigje me tri rezultate, dhe një kartë.",
    "Warum eine 6 als Kritiker zählt, was Kundenaufwand mit Loyalität macht, drei Kennzahlen und drei Fragen, ob der NPS Wachstum vorhersagt, dieselben Antworten mit drei Werten und eine Karte."),
  seo: x(
    "NPS, CSAT and CES: why a 6 is a detractor, effort and loyalty (96% against 9%), what predicts growth and retention, three ways to score CSAT, and a card.",
    "NPS, CSAT dhe CES: pse 6 është kritik, përpjekja dhe besnikëria (96% kundrejt 9%), çfarë parashikon rritjen, tri mënyra për CSAT-in dhe një kartë.",
    "NPS, CSAT und CES: warum eine 6 Kritiker ist, Aufwand und Loyalität (96 % gegen 9 %), was Wachstum und Bindung vorhersagt, drei Wege zum CSAT und eine Karte."),
  feature: x(
    "Issue 32 starts with the Net Promoter question and why a 6 counts as a detractor, follows CEB's research on customer effort, compares the questions behind NPS, CSAT and CES, weighs the studies on which metric predicts growth and retention, shows one set of answers giving three scores, and ends with a card for the voice of the customer.",
    "Numri 32 nis me pyetjen e Net Promoter dhe pse 6 numërohet si kritik, ndjek kërkimin e CEB për përpjekjen e klientit, krahason pyetjet pas NPS-së, CSAT-it dhe CES-së, peshon studimet për matësin që parashikon rritjen dhe mbajtjen e klientëve, tregon si të njëjtat përgjigje japin tri rezultate, dhe mbyllet me një kartë për zërin e klientit.",
    "Ausgabe 32 beginnt mit der Net-Promoter-Frage und damit, warum eine 6 als Kritiker zählt, verfolgt die Forschung von CEB zum Kundenaufwand, vergleicht die Fragen hinter NPS, CSAT und CES, wägt die Studien dazu ab, welche Kennzahl Wachstum und Kundenbindung vorhersagt, zeigt, wie dieselben Antworten drei Werte ergeben, und endet mit einer Karte für die Stimme der Kunden."),
  figure: { n: "6", by: "Reichheld, 2003", t: x(
    "out of 10 counts as a detractor in the Net Promoter Score, just like a 0.",
    "nga 10 numërohet si kritik te Net Promoter Score, njësoj si 0.",
    "von 10 zählt beim Net Promoter Score als Kritiker, genau wie eine 0.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A 6 is a detractor", "6 është kritik", "Eine 6 ist ein Kritiker") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three metrics, three questions", "Tre matës, tri pyetje", "Drei Kennzahlen, drei Fragen") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The voice-of-the-customer card", "Karta e zërit të klientit", "Die Karte für die Stimme der Kunden") },
  ],
  sources: ["reichheld-2003", "dixon-2010", "dixon-2013", "fornell-1996", "morgan-rego-2006", "keiningham-2007", "de-haan-2015", "reichheld-2021"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most companies ask their customers for a number. This issue asks what NPS, CSAT and CES each measure, how well they predict what matters, and how to read a score without fooling yourself.",
        "Shumica e kompanive u kërkojnë klientëve një notë. Ky numër pyet çfarë mat secili nga NPS, CSAT dhe CES, sa mirë e parashikojnë atë që ka rëndësi, dhe si lexohet një rezultat pa e mashtruar veten.",
        "Die meisten Unternehmen bitten ihre Kunden um eine Zahl. Diese Ausgabe fragt, was NPS, CSAT und CES jeweils messen, wie gut sie vorhersagen, worauf es ankommt, und wie man einen Wert liest, ohne sich zu täuschen."),
      body: x(
        "Fred Reichheld's Net Promoter Score counts a 6 out of 10 as a detractor, just like a 0, and very different teams can end up with the same score. Studies from Norway and the US could not confirm that NPS predicts growth better than satisfaction measures, and across 93 firms satisfaction measured as top-2-box predicted retention best. In CEB's research, 96% of customers who had to work hard to get help became more disloyal, against 9% when it was easy.",
        "Net Promoter Score i Fred Reichheld-it e numëron 6 nga 10 si kritik, njësoj si 0, dhe ekipe shumë të ndryshme mund të dalin me të njëjtin rezultat. Studime nga Norvegjia dhe SHBA-ja nuk e konfirmuan se NPS e parashikon rritjen më mirë se matësit e kënaqësisë, dhe në 93 kompani kënaqësia e matur si top-2-box e parashikoi më mirë mbajtjen e klientëve. Te kërkimi i CEB, 96% e klientëve që iu desh të mundoheshin për të marrë ndihmë u bënë më pak besnikë, kundrejt 9% kur ishte e lehtë.",
        "Fred Reichhelds Net Promoter Score zählt eine 6 von 10 als Kritiker, genau wie eine 0, und sehr verschiedene Teams können beim selben Wert landen. Studien aus Norwegen und den USA konnten nicht bestätigen, dass der NPS Wachstum besser vorhersagt als Zufriedenheitsmaße, und in 93 Unternehmen sagte Zufriedenheit als Top-2-Box die Kundenbindung am besten voraus. In der Forschung von CEB wurden 96 % der Kunden, die sich für Hilfe anstrengen mussten, illoyaler, gegenüber 9 %, wenn es leicht war."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A 6 is", "6 është", "Eine 6 ist"), x("a detractor", "kritik", "ein Kritiker")],
      lead: x(
        "In December 2003 Fred Reichheld proposed in Harvard Business Review that one question could replace long satisfaction surveys: how likely is it that you would recommend the company to a friend or colleague, from 0 to 10?",
        "Në dhjetor 2003, Fred Reichheld propozoi te Harvard Business Review që një pyetje e vetme të zërë vendin e anketave të gjata të kënaqësisë: sa gjasa ka që t'ia rekomandoni kompaninë një miku ose kolegu, nga 0 deri në 10?",
        "Im Dezember 2003 schlug Fred Reichheld in der Harvard Business Review vor, lange Zufriedenheitsumfragen durch eine Frage zu ersetzen: Wie wahrscheinlich ist es, dass Sie das Unternehmen Freunden oder Kollegen empfehlen, von 0 bis 10?"),
      blocks: [
        { type: "cards", cols: 3, items: [
          { n: "0–6", h: x("Detractors", "Kritikët", "Kritiker"), p: x("count against the score", "numërohen kundër rezultatit", "zählen gegen den Wert") },
          { n: "7–8", h: x("Passives", "Pasivët", "Passive"), p: x("count in the total, not in the score", "hyjnë te totali, jo te rezultati", "zählen in der Summe, nicht im Wert") },
          { n: "9–10", h: x("Promoters", "Promotorët", "Promotoren"), p: x("count for the score", "numërohen për rezultatin", "zählen für den Wert") },
        ] },
        { type: "p", text: x(
          "NPS is the share of promoters minus the share of detractors, from −100 to +100. Two teams can reach the same score in very different ways:",
          "NPS është përqindja e promotorëve minus përqindja e kritikëve, nga −100 deri në +100. Dy ekipe mund ta arrijnë të njëjtin rezultat në mënyra shumë të ndryshme:",
          "Der NPS ist der Anteil der Promotoren minus der Anteil der Kritiker, von −100 bis +100. Zwei Teams können denselben Wert auf sehr verschiedenen Wegen erreichen:") },
        { type: "pairs", from: x("Team A", "Ekipi A", "Team A"), to: x("Team B", "Ekipi B", "Team B"), max: 70, source: ["reichheld-2003"],
          label: x("Two hypothetical teams, both with an NPS of +25 (% of answers)", "Dy ekipe hipotetike, të dyja me NPS +25 (% e përgjigjeve)", "Zwei hypothetische Teams, beide mit NPS +25 (% der Antworten)"),
          rows: [
            { k: x("Promoters", "Promotorët", "Promotoren"), a: 45, an: pc(45), b: 60, bn: pc(60) },
            { k: x("Passives", "Pasivët", "Passive"), a: 35, an: pc(35), b: 5, bn: pc(5) },
            { k: x("Detractors", "Kritikët", "Kritiker"), a: 20, an: pc(20), b: 35, bn: pc(35), alert: true },
          ] },
      ],
      note: x(
        "The teams and numbers are invented; the method follows Reichheld (2003). Net Promoter and NPS are registered trademarks of Bain & Company, NICE Systems and Fred Reichheld.",
        "Ekipet dhe numrat janë të shpikur; metoda ndjek Reichheld-in (2003). Net Promoter dhe NPS janë marka të regjistruara të Bain & Company, NICE Systems dhe Fred Reichheld-it.",
        "Teams und Zahlen sind erfunden; die Methode folgt Reichheld (2003). Net Promoter und NPS sind eingetragene Marken von Bain & Company, NICE Systems und Fred Reichheld."),
      source: ["reichheld-2003"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Effort costs", "Përpjekja", "Aufwand kostet"), x("loyalty", "të kushton besnikërinë", "Loyalität")],
      lead: x(
        "In 2010 Matthew Dixon, Karen Freeman and Nicholas Toman reported a study of more than 75,000 customers who had contacted service by phone, web, chat or e-mail. Delighting customers, they concluded, does not build loyalty; reducing their effort does.",
        "Në 2010, Matthew Dixon, Karen Freeman dhe Nicholas Toman raportuan një studim me më shumë se 75.000 klientë që kishin kontaktuar shërbimin me telefon, në web, me chat ose me email. Përfundimi: t'i kënaqësh klientët tej pritjeve nuk ndërton besnikëri; e ndërton ulja e përpjekjes së tyre.",
        "2010 berichteten Matthew Dixon, Karen Freeman und Nicholas Toman über eine Studie mit mehr als 75.000 Kunden, die den Service per Telefon, Web, Chat oder E-Mail kontaktiert hatten. Ihr Fazit: Kunden zu begeistern schafft keine Loyalität; ihren Aufwand zu senken schon."),
      blocks: [
        { type: "columns", max: 100, height: 100, source: ["dixon-2013"],
          label: x("Customers who became more disloyal after a service interaction (CEB research, self-reported)", "Klientë që u bënë më pak besnikë pas një ndërveprimi shërbimi (kërkimi i CEB, vetëdeklarim)", "Kunden, die nach einem Servicekontakt illoyaler wurden (CEB-Forschung, Selbstauskunft)"),
          items: [
            { k: x("High effort", "Përpjekje e lartë", "Hoher Aufwand"), v: 96, n: pc(96), alert: true },
            { k: x("Low effort", "Përpjekje e ulët", "Geringer Aufwand"), v: 9, n: pc(9) },
          ] },
        { type: "p", text: x(
          "In CEB's research, service interactions were about four times more likely to drive disloyalty than loyalty. The 2010 article introduced the Customer Effort Score; in 2013 CEB replaced the first question with a statement rated from 1 to 7: the company made it easy for me to handle my issue.",
          "Te kërkimi i CEB, ndërveprimet e shërbimit kishin rreth katër herë më shumë gjasa ta ulnin besnikërinë sesa ta rrisnin. Artikulli i 2010 prezantoi Customer Effort Score; në 2013, CEB e zëvendësoi pyetjen e parë me një pohim të vlerësuar nga 1 në 7: kompania ma bëri të lehtë zgjidhjen e çështjes sime.",
          "In der Forschung von CEB führten Servicekontakte etwa viermal so oft zu weniger Loyalität wie zu mehr. Der Artikel von 2010 führte den Customer Effort Score ein; 2013 ersetzte CEB die erste Frage durch eine Aussage, bewertet von 1 bis 7: Das Unternehmen hat es mir leicht gemacht, mein Anliegen zu erledigen.") },
        { type: "callout", reading: true, text: x(
          "Customers rarely leave because service was not dazzling. They leave because it was hard work.",
          "Klientët rrallë ikin sepse shërbimi nuk ishte mahnitës. Ikin sepse u desh shumë mund.",
          "Kunden gehen selten, weil der Service nicht glänzend war. Sie gehen, weil er Mühe gemacht hat.") },
      ],
      note: x(
        "Research by CEB, a firm that sold the method; it rests on intentions that customers reported, not on measured behaviour.",
        "Kërkim i CEB, firmë që e shiste metodën; mbështetet te qëllimet që deklaruan klientët, jo te sjellja e matur.",
        "Forschung von CEB, einer Firma, die die Methode verkaufte; sie beruht auf Absichten, die Kunden angaben, nicht auf gemessenem Verhalten."),
      source: ["dixon-2010", "dixon-2013"],
    },
    {
      id: "model", more: "61-resellers",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three metrics,", "Tre matës,", "Drei Kennzahlen,"), x("three questions", "tri pyetje", "drei Fragen")],
      lead: x(
        "The three best-known customer metrics ask different questions, so they measure different things. None of them is a standard, and CSAT has no owner at all.",
        "Tre matësit më të njohur të klientit bëjnë pyetje të ndryshme, ndaj matin gjëra të ndryshme. Asnjëri nuk është standard, dhe CSAT nuk ka fare pronar.",
        "Die drei bekanntesten Kundenkennzahlen stellen verschiedene Fragen und messen deshalb Verschiedenes. Keine ist ein Standard, und der CSAT hat gar keinen Eigentümer."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { n: "NPS", h: x("Would you recommend us?", "A do të na rekomandonit?", "Würden Sie uns empfehlen?"), p: x("0 to 10; share of 9–10 minus share of 0–6", "0 deri në 10; pjesa e 9–10 minus pjesa e 0–6", "0 bis 10; Anteil 9–10 minus Anteil 0–6") },
          { n: "CSAT", h: x("How satisfied were you?", "Sa të kënaqur ishit?", "Wie zufrieden waren Sie?"), p: x("often 1 to 5; often the share of the two highest answers", "shpesh 1 deri në 5; shpesh pjesa e dy përgjigjeve më të larta", "oft 1 bis 5; oft der Anteil der zwei besten Antworten") },
          { n: "CES", h: x("Was it easy?", "A ishte e lehtë?", "War es einfach?"), p: x("since 2013, agreement from 1 to 7 with a statement", "që nga 2013, pajtim nga 1 në 7 me një pohim", "seit 2013 Zustimmung von 1 bis 7 zu einer Aussage") },
        ] },
        { type: "chain", label: x("The model behind the American Customer Satisfaction Index (ACSI), 1994", "Modeli pas Indeksit Amerikan të Kënaqësisë së Klientit (ACSI), 1994", "Das Modell hinter dem American Customer Satisfaction Index (ACSI), 1994"), items: [
          { h: x("Expectations", "Pritjet", "Erwartungen"), p: x("what customers expect", "çfarë presin klientët", "was Kunden erwarten") },
          { h: x("Quality and value", "Cilësia dhe vlera", "Qualität und Wert"), p: x("as customers perceive them", "si i perceptojnë klientët", "wie Kunden sie wahrnehmen") },
          { h: x("Satisfaction", "Kënaqësia", "Zufriedenheit"), p: x("scored from 0 to 100", "me rezultat nga 0 deri në 100", "gemessen von 0 bis 100") },
          { h: x("Complaints, loyalty", "Ankesat, besnikëria", "Beschwerden, Loyalität"), p: x("the consequences", "pasojat", "die Folgen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Recommendation, satisfaction and effort are different things. Pick the question that fits the decision you have to make.",
          "Rekomandimi, kënaqësia dhe përpjekja janë gjëra të ndryshme. Zgjidh pyetjen që i përshtatet vendimit që duhet të marrësh.",
          "Empfehlung, Zufriedenheit und Aufwand sind verschiedene Dinge. Die Frage wählen, die zur anstehenden Entscheidung passt.") },
      ],
      note: x(
        "The CSAT practice is common usage, not a standard. The ACSI has been published since October 1994; its satisfaction score is a weighted average of three questions.",
        "Praktika e CSAT-it është përdorim i zakonshëm, jo standard. ACSI botohet që nga tetori 1994; rezultati i kënaqësisë është mesatare e peshuar e tri pyetjeve.",
        "Die CSAT-Praxis ist üblicher Gebrauch, kein Standard. Der ACSI erscheint seit Oktober 1994; sein Zufriedenheitswert ist ein gewichteter Durchschnitt dreier Fragen."),
      source: ["reichheld-2003", "morgan-rego-2006", "dixon-2013", "fornell-1996"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Does it predict", "A e parashikon", "Sagt sie Wachstum"), x("growth?", "rritjen?", "voraus?")],
      lead: x(
        "Reichheld wrote that the recommend question predicts loyalty and growth better than satisfaction surveys. Independent studies tested the claim.",
        "Reichheld shkroi se pyetja e rekomandimit e parashikon besnikërinë dhe rritjen më mirë se anketat e kënaqësisë. Studime të pavarura e testuan këtë pohim.",
        "Reichheld schrieb, die Empfehlungsfrage sage Loyalität und Wachstum besser voraus als Zufriedenheitsumfragen. Unabhängige Studien prüften die Behauptung."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Keiningham et al., 2007", "Keiningham et al., 2007", "Keiningham et al., 2007"), p: x("21 firms and over 15,500 interviews in Norway, compared with the ACSI: no clear superiority of Net Promoter over other measures.", "21 kompani dhe mbi 15.500 intervista në Norvegji, krahasuar me ACSI-n: asnjë epërsi e qartë e Net Promoter ndaj matësve të tjerë.", "21 Firmen und über 15.500 Interviews in Norwegen, verglichen mit dem ACSI: keine klare Überlegenheit von Net Promoter gegenüber anderen Maßen.") },
          { h: x("Morgan & Rego, 2006", "Morgan & Rego, 2006", "Morgan & Rego, 2006"), p: x("ACSI data for 1994–2000: average satisfaction predicted business performance best; recommendation measures had little or no value.", "të dhëna të ACSI-t për 1994–2000: kënaqësia mesatare e parashikoi më mirë performancën; matësit e rekomandimit kishin pak ose aspak vlerë.", "ACSI-Daten 1994–2000: Die durchschnittliche Zufriedenheit sagte den Geschäftserfolg am besten voraus; Empfehlungsmaße kaum oder gar nicht.") },
          { h: x("de Haan et al., 2015", "de Haan et al., 2015", "de Haan et al., 2015"), p: x("Customers of 93 firms in 18 industries: top-2-box satisfaction predicted retention best; the best metric varied by industry, and combining helped.", "klientë të 93 kompanive në 18 industri: kënaqësia top-2-box e parashikoi më mirë mbajtjen; matësi më i mirë ndryshonte sipas industrisë, dhe kombinimi ndihmonte.", "Kunden von 93 Firmen in 18 Branchen: Top-2-Box-Zufriedenheit sagte die Bindung am besten voraus; die beste Kennzahl variierte je Branche, Kombinationen halfen.") },
        ] },
        { type: "callout", reading: true, text: x(
          "No single number wins everywhere. Which one predicts best depends on the business, so test it on your own customers.",
          "Asnjë numër i vetëm nuk fiton kudo. Cili parashikon më mirë varet nga biznesi, ndaj provoje me klientët e tu.",
          "Keine einzelne Zahl gewinnt überall. Welche am besten vorhersagt, hängt vom Geschäft ab, also an den eigenen Kunden prüfen.") },
      ],
      note: x(
        "Associations, not proof of cause. Morgan and Rego did not use the 0–10 question. Each camp has an interest: Bain advises on NPS, CEB sold CES research, and Ipsos announced the 2007 critique.",
        "Lidhje, jo provë shkaku. Morgan dhe Rego nuk e përdorën pyetjen 0–10. Çdo palë ka interes: Bain jep këshillim për NPS-në, CEB shiste kërkime për CES-në, dhe kritikën e 2007 e njoftoi Ipsos.",
        "Zusammenhänge, kein Beweis einer Ursache. Morgan und Rego nutzten nicht die Frage von 0 bis 10. Jede Seite hat Interessen: Bain berät zum NPS, CEB verkaufte CES-Forschung, und Ipsos verkündete die Kritik von 2007."),
      source: ["keiningham-2007", "morgan-rego-2006", "de-haan-2015"],
    },
    {
      id: "measure", tool: "/tools/cx-control-tower/",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("One set of answers,", "Të njëjtat përgjigje,", "Dieselben Antworten,"), x("three scores", "tri rezultate", "drei Werte")],
      lead: x(
        "CSAT is often reported as top-2-box: the share of answers in the two highest points of the scale. Change the rule and the same answers give a different number.",
        "CSAT raportohet shpesh si top-2-box: pjesa e përgjigjeve në dy pikat më të larta të shkallës. Ndrysho rregullin dhe të njëjtat përgjigje japin një numër tjetër.",
        "Der CSAT wird oft als Top-2-Box berichtet: der Anteil der Antworten in den zwei höchsten Stufen der Skala. Ändert man die Regel, ergeben dieselben Antworten eine andere Zahl."),
      blocks: [
        { type: "example", label: x("Hypothetical example, 100 answers on a 1–5 scale", "Shembull hipotetik, 100 përgjigje në shkallë 1–5", "Hypothetisches Beispiel, 100 Antworten auf einer Skala von 1 bis 5"), rows: [
          { k: x("Answers", "Përgjigjet", "Antworten"), v: x("5: 30 · 4: 40 · 3: 15 · 2: 10 · 1: 5", "5: 30 · 4: 40 · 3: 15 · 2: 10 · 1: 5", "5: 30 · 4: 40 · 3: 15 · 2: 10 · 1: 5") },
          { k: "Top-2-box", v: x("4s and 5s of all answers: 70%", "4-at dhe 5-at nga të gjitha përgjigjet: 70%", "4er und 5er aller Antworten: 70 %") },
          { k: x("No neutrals", "Pa neutralët", "Ohne Neutrale"), v: x("the 3s left out of the count: 70 of 85 = 82%", "3-at jashtë numërimit: 70 nga 85 = 82%", "die 3er nicht mitgezählt: 70 von 85 = 82 %") },
          { k: x("Top box", "Vetëm 5-at", "Top-Box"), v: x("only the 5s: 30%", "vetëm 5-at: 30%", "nur die 5er: 30 %") },
        ], text: x("Say which rule you use, and keep it. The answers are invented.", "Thuaj cilin rregull përdor dhe mbaje. Përgjigjet janë të shpikura.", "Sagen, welche Regel gilt, und dabei bleiben. Die Antworten sind erfunden.") },
        { type: "steps", items: [
          { h: x("Fix the question, the scale and the rule", "Fikso pyetjen, shkallën dhe rregullin", "Frage, Skala und Regel festlegen"), p: x("Otherwise a change in the score may only be a change in the method.", "Përndryshe, një ndryshim i rezultatit mund të jetë vetëm ndryshim i metodës.", "Sonst ist eine Änderung des Werts vielleicht nur eine Änderung der Methode.") },
          { h: x("Report the spread, not only the score", "Raporto shpërndarjen, jo vetëm rezultatin", "Die Verteilung zeigen, nicht nur den Wert"), p: x("The same score can hide very different customers.", "I njëjti rezultat mund të fshehë klientë shumë të ndryshëm.", "Derselbe Wert kann sehr verschiedene Kunden verbergen.") },
          { h: x("Keep the score out of bonuses", "Mbaje rezultatin jashtë bonuseve", "Den Wert aus Boni heraushalten"), p: x("NPS's own authors say tying it to frontline bonuses made people chase the score.", "Vetë autorët e NPS-së thonë se lidhja me bonuset e punonjësve në kontakt bëri që njerëzit të ndjekin notën.", "Die NPS-Autoren selbst sagen, die Kopplung an Boni habe Beschäftigte dem Wert hinterherjagen lassen.") },
        ] },
      ],
      note: x(
        "The steps and the example are the editors'. Top-2-box follows the studies of Morgan & Rego and de Haan et al.; on bonuses, Reichheld, Darnell & Burns (2021).",
        "Hapat dhe shembulli janë të redaksisë. Top-2-box ndjek studimet e Morgan & Rego dhe de Haan et al.; për bonuset, Reichheld, Darnell & Burns (2021).",
        "Schritte und Beispiel stammen von der Redaktion. Top-2-Box folgt den Studien von Morgan & Rego und de Haan et al.; zu Boni Reichheld, Darnell & Burns (2021)."),
      source: ["de-haan-2015", "reichheld-2021"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The voice-of-the-", "Karta e zërit", "Die Karte für die"), x("customer card", "të klientit", "Stimme der Kunden")],
      lead: x(
        "One card per month. The score is the start of the conversation: the spread, the reasons and the effort tell you what to fix.",
        "Një kartë në muaj. Rezultati është fillimi i bisedës: shpërndarja, arsyet dhe përpjekja të tregojnë çfarë duhet ndrequr.",
        "Eine Karte pro Monat. Der Wert ist der Anfang des Gesprächs: Verteilung, Gründe und Aufwand zeigen, was zu beheben ist."),
      blocks: [
        { type: "form", items: [
          { h: x("Question and scale", "Pyetja dhe shkalla", "Frage und Skala"), hint: x("word for word, and the rule for the score", "fjalë për fjalë, dhe rregulli i rezultatit", "wörtlich, und die Regel für den Wert") },
          { h: x("Answers", "Përgjigjet", "Antworten"), hint: x("how many, and how many customers did not answer", "sa, dhe sa klientë nuk u përgjigjën", "wie viele, und wie viele Kunden nicht antworteten") },
          { h: x("Score and spread", "Rezultati dhe shpërndarja", "Wert und Verteilung"), hint: x("the score, and the share in each group", "rezultati, dhe pjesa në secilin grup", "der Wert und der Anteil jeder Gruppe") },
          { h: x("Top three reasons", "Tri arsyet kryesore", "Die drei häufigsten Gründe"), hint: x("from the comments of the lowest scores", "nga komentet e notave më të ulëta", "aus den Kommentaren der niedrigsten Werte") },
          { h: x("Where customers worked hard", "Ku u munduan klientët", "Wo Kunden Mühe hatten"), hint: x("repeat contacts, switching channels, waiting", "kontakte të përsëritura, ndërrim kanalesh, pritje", "wiederholte Kontakte, Kanalwechsel, Warten") },
          { h: x("One fix", "Një ndreqje", "Eine Verbesserung"), hint: x("what, who, by when; check it next month", "çfarë, kush, deri kur; kontrolloje muajin tjetër", "was, wer, bis wann; im nächsten Monat prüfen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Reichheld (2003) and Dixon, Freeman & Toman (2010).",
        "Praktikë e propozuar nga redaksia, sipas Reichheld-it (2003) dhe Dixon, Freeman & Toman (2010).",
        "Eine Praxis, die die Redaktion vorschlägt, nach Reichheld (2003) und Dixon, Freeman & Toman (2010)."),
      source: ["reichheld-2003", "dixon-2010"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
