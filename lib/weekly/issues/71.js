// Management Review, No. 71: Employee monitoring and personal data. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-71.md. The AI Act is in No. 41 and algorithmic management
// in No. 61; this issue keeps to the monitoring of employees under the GDPR, the ECHR and German law. Not legal advice.
import { x, pc } from "../common.js";

export default {
  number: 71,
  block: "ai",
  // Page 2 is too full in German for the reading legend under the contents; it is left out there.
  tight: ["de"],
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Employee monitoring", "Monitorimi i punonjësve", "Überwachung am Arbeitsplatz"), x("and personal data", "dhe të dhënat personale", "und Beschäftigtendaten")],
  sub: x(
    "Forty-five pages of private messages and the Court's six questions, how many workplaces report monitoring systems, what Article 88 asks of national law, when an impact assessment is due, and a card for one measure.",
    "Dyzet e pesë faqe mesazhesh private dhe gjashtë pyetjet e Gjykatës, sa vende pune raportojnë sisteme monitorimi, çfarë i kërkon neni 88 ligjit kombëtar, kur duhet një vlerësim ndikimi, dhe një kartë për një masë.",
    "45 Seiten privater Nachrichten und die sechs Fragen des Gerichtshofs, wie viele Betriebe Überwachungssysteme melden, was Artikel 88 vom nationalen Recht verlangt, wann eine Folgenabschätzung fällig ist, und eine Karte für eine Maßnahme."),
  seo: x(
    "Employee monitoring: the six Bărbulescu questions, 7% of EU workplaces, GDPR Article 88 and § 26 BDSG, when a DPIA is due, and a card for one measure.",
    "Monitorimi i punonjësve: gjashtë pyetjet e Bărbulescu, 7% e vendeve të punës në BE, neni 88 i GDPR dhe § 26 BDSG, kur duhet DPIA, dhe një kartë.",
    "Überwachung am Arbeitsplatz: die sechs Bărbulescu-Fragen, 7 % der Betriebe in der EU, Art. 88 DSGVO und § 26 BDSG, wann eine DSFA nötig ist, eine Karte."),
  feature: x(
    "An engineer in Bucharest was shown 45 pages of his own private messages, printed by his employer. From his case the European Court of Human Rights drew six questions for any such monitoring, and Issue 71 starts there. It then counts the EU workplaces that report systems monitoring their staff, follows Article 88 of the GDPR from the EU Court to Germany's Federal Labour Court, and shows when a data protection impact assessment is due. A card checks one measure before it starts. The issue describes the law and does not give legal advice.",
    "Një inxhinieri në Bukuresht i treguan 45 faqe me mesazhet e tij private, të printuara nga punëdhënësi. Nga çështja e tij, Gjykata Evropiane e të Drejtave të Njeriut nxori gjashtë pyetje për çdo monitorim të tillë, dhe Numri 71 nis pikërisht aty. Pastaj numëron vendet e punës në BE që raportojnë sisteme monitorimi të stafit, ndjek nenin 88 të GDPR-së nga Gjykata e BE-së te Gjykata Federale e Punës në Gjermani, dhe tregon kur duhet një vlerësim i ndikimit në mbrojtjen e të dhënave. Një kartë e kontrollon një masë para se të nisë. Numri përshkruan ligjin dhe nuk jep këshillë ligjore.",
    "Ein Ingenieur in Bukarest bekam 45 Seiten seiner privaten Nachrichten vorgelegt, ausgedruckt von seinem Arbeitgeber. Aus seinem Fall leitete der Europäische Gerichtshof für Menschenrechte sechs Fragen an jede solche Überwachung ab; hier setzt Ausgabe 71 an. Danach zählt sie die Betriebe in der EU, die Systeme zur Überwachung ihrer Beschäftigten melden, verfolgt Artikel 88 DSGVO vom EuGH bis zum Bundesarbeitsgericht und zeigt, wann eine Datenschutz-Folgenabschätzung fällig ist. Eine Karte prüft eine Maßnahme vor dem Start. Die Ausgabe beschreibt das Recht und ersetzt keine Rechtsberatung."),
  figure: { n: "11–6", by: "ECtHR, Bărbulescu v. Romania, 2017", t: x(
    "votes: the Grand Chamber found that Romania's courts had failed to protect an engineer whose employer had read his private messages.",
    "vota: Dhoma e Madhe gjeti se gjykatat e Rumanisë nuk e kishin mbrojtur një inxhinier, të cilit punëdhënësi i kishte lexuar mesazhet private.",
    "Stimmen: Die Große Kammer befand, dass Rumäniens Gerichte einen Ingenieur nicht geschützt hatten, dessen private Nachrichten sein Arbeitgeber gelesen hatte.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Forty-five pages", "Dyzet e pesë faqe", "Fünfundvierzig Seiten") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Six questions before you watch", "Gjashtë pyetje para se të vëzhgosh", "Sechs Fragen vor dem Überwachen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The card for one monitoring measure", "Karta për një masë monitorimi", "Karte für eine Überwachungsmaßnahme") },
  ],
  sources: ["mon-echr-barbulescu-2017", "mon-esener-2024", "mon-gdpr-2016", "mon-cjeu-c34-2023", "mon-bag-2025", "mon-wp29-work-2017", "mon-wp29-dpia-2017", "mon-betrvg-87"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "E-mail, internet use, location, screens: an employer can now record them for a fraction of what it cost a few years ago. Whether a manager may do so depends less on the tool than on the questions asked before it starts. Here are those questions as European courts and regulators put them: a description of the law, not legal advice.",
        "Email-et, përdorimi i internetit, vendndodhja, ekranet: një punëdhënës sot mund t'i regjistrojë me një pjesë të vogël të kostos së disa viteve më parë. Nëse një menaxher mund ta bëjë këtë varet më pak nga mjeti dhe më shumë nga pyetjet që bëhen para se të nisë. Këtu i gjen këto pyetje ashtu si i shtrojnë gjykatat dhe autoritetet evropiane: një përshkrim i ligjit, jo këshillë ligjore.",
        "E-Mails, Internetnutzung, Standort, Bildschirme: Ein Arbeitgeber kann sie heute für einen Bruchteil der Kosten von vor einigen Jahren erfassen. Ob eine Führungskraft das darf, hängt weniger vom Werkzeug ab als von den Fragen, die vor dem Start gestellt werden. Hier stehen diese Fragen so, wie europäische Gerichte und Aufsichtsbehörden sie stellen: eine Darstellung des Rechts, keine Rechtsberatung."),
      body: x(
        "In 2017 the European Court of Human Rights found, by eleven votes to six, that Romania's courts had not protected an engineer whose employer had read his messages; its six factors are a test for any monitoring. In 2024, 7% of EU workplaces reported systems that monitor workers' performance or behaviour. In Germany, the EU Court's reading of Article 88 of the GDPR led the Federal Labour Court in 2025 to leave the general rule on employee data unapplied. An impact assessment and a one-page card close the issue.",
        "Më 2017, Gjykata Evropiane e të Drejtave të Njeriut gjeti, me njëmbëdhjetë vota kundër gjashtë, se gjykatat e Rumanisë nuk e kishin mbrojtur një inxhinier, të cilit punëdhënësi i kishte lexuar mesazhet; gjashtë faktorët e saj janë provë për çdo monitorim. Më 2024, 7% e vendeve të punës në BE raportuan sisteme që monitorojnë performancën ose sjelljen e punonjësve. Në Gjermani, leximi që Gjykata e BE-së i bëri nenit 88 të GDPR-së e çoi Gjykatën Federale të Punës më 2025 ta linte pa zbatim rregullin e përgjithshëm për të dhënat e punonjësve. Numri mbyllet me vlerësimin e ndikimit dhe një kartë në një faqe.",
        "2017 stellte der Europäische Gerichtshof für Menschenrechte mit elf zu sechs Stimmen fest, dass Rumäniens Gerichte einen Ingenieur nicht geschützt hatten, dessen Nachrichten sein Arbeitgeber gelesen hatte; seine sechs Faktoren sind ein Test für jede Überwachung. 2024 meldeten 7 % der Betriebe in der EU Systeme, die Leistung oder Verhalten der Beschäftigten überwachen. In Deutschland führte die Auslegung von Artikel 88 DSGVO durch den EuGH dazu, dass das Bundesarbeitsgericht 2025 die allgemeine Regel zu Beschäftigtendaten unangewendet ließ. Eine Folgenabschätzung und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Forty-five", "Dyzet e pesë", "Fünfundvierzig"), x("pages", "faqe", "Seiten")],
      lead: x(
        "In July 2007 a private company in Bucharest recorded, in real time, the Yahoo Messenger account that a sales engineer had opened at its request to answer customers. When he said he had used it only for work, he was shown 45 pages of his messages with his brother and his fiancée. On 1 August he was dismissed.",
        "Në korrik 2007, një kompani private në Bukuresht regjistroi në kohë reale llogarinë Yahoo Messenger që një inxhinier shitjesh e kishte hapur me kërkesë të saj, për klientët. Kur ai tha se e kishte përdorur vetëm për punë, i treguan 45 faqe me mesazhet e tij me vëllain dhe me të fejuarën. Më 1 gusht u pushua nga puna.",
        "Im Juli 2007 zeichnete ein Privatunternehmen in Bukarest in Echtzeit das Yahoo-Messenger-Konto auf, das ein Vertriebsingenieur auf Wunsch der Firma für Kundenanfragen eingerichtet hatte. Als er sagte, er habe es nur dienstlich genutzt, legte man ihm 45 Seiten seiner Nachrichten mit Bruder und Verlobter vor. Am 1. August wurde ihm gekündigt."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("The rules", "Rregullat", "Die Regeln"), p: x("banned personal use of company computers; said nothing about monitoring", "ndalonin përdorimin personal të kompjuterëve të kompanisë; nuk thoshin asgjë për monitorimin", "verboten private Nutzung der Firmenrechner; zur Überwachung sagten sie nichts") },
          { h: x("Romanian courts", "Gjykatat rumune", "Rumänische Gerichte"), p: x("upheld the dismissal: he had been warned not to use company resources", "e mbajtën në fuqi pushimin: ishte paralajmëruar të mos përdorte mjetet e kompanisë", "bestätigten die Kündigung: Er sei vor privater Nutzung gewarnt worden") },
          { h: x("Chamber, 2016", "Dhoma, 2016", "Kammer, 2016"), p: x("no violation of Article 8, by six votes to one", "asnjë shkelje e nenit 8, me gjashtë vota kundër një", "keine Verletzung von Artikel 8, mit sechs zu einer Stimme") },
        ] },
        { type: "p", text: x(
          "On 5 September 2017 the Grand Chamber found, by eleven votes to six, a violation of the right to respect for private life and correspondence. The courts had not established whether he had been told in advance that he might be monitored, or of its nature and extent, nor the reasons, whether lighter means would have served, or whether content had been read without his knowledge.",
          "Më 5 shtator 2017, Dhoma e Madhe gjeti, me njëmbëdhjetë vota kundër gjashtë, shkelje të së drejtës për respektimin e jetës private dhe të korrespondencës. Gjykatat nuk kishin përcaktuar nëse ai ishte njoftuar paraprakisht se mund të monitorohej, as për natyrën dhe shtrirjen e monitorimit, as arsyet, nëse do të mjaftonin mjete më të lehta, apo nëse përmbajtja ishte lexuar pa dijeninë e tij.",
          "Am 5. September 2017 stellte die Große Kammer mit elf zu sechs Stimmen eine Verletzung des Rechts auf Achtung des Privatlebens und der Korrespondenz fest. Die Gerichte hatten nicht geklärt, ob er vorab über eine mögliche Überwachung, ihre Art und ihren Umfang informiert war, welche Gründe es gab, ob mildere Mittel gereicht hätten und ob Inhalte ohne sein Wissen gelesen wurden.") },
        { type: "callout", reading: true, text: x(
          "A ban on private use does not count as notice of monitoring. People have to know beforehand that they may be watched, and how.",
          "Ndalimi i përdorimit personal nuk vlen si njoftim për monitorimin. Njerëzit duhet ta dinë që më parë se mund të vëzhgohen, dhe si.",
          "Ein Verbot privater Nutzung kündigt noch keine Überwachung an. Die Beschäftigten müssen vorher wissen, dass und wie sie überwacht werden können.") },
      ],
      note: x(
        "Bărbulescu v. Romania [GC], no. 61496/08, 5 September 2017. The case was brought against the Romanian state, not the employer, and the Court did not decide whether the dismissal was justified: it found that the courts had not weighed the interests at stake.",
        "Bărbulescu kundër Rumanisë [DhM], nr. 61496/08, 5 shtator 2017. Çështja ishte kundër shtetit rumun, jo kundër punëdhënësit, dhe Gjykata nuk vendosi nëse pushimi ishte i justifikuar: gjeti se gjykatat nuk i kishin peshuar interesat në lojë.",
        "Bărbulescu gegen Rumänien [GK], Nr. 61496/08, 5. September 2017. Beklagt war der rumänische Staat, nicht der Arbeitgeber, und der Gerichtshof entschied nicht, ob die Kündigung gerechtfertigt war: Er stellte fest, dass die Gerichte die Interessen nicht abgewogen hatten."),
      source: ["mon-echr-barbulescu-2017"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One workplace", "Një vend pune", "Ein Betrieb"), x("in fourteen", "në katërmbëdhjetë", "von vierzehn")],
      lead: x(
        "ESENER 2024, EU-OSHA's survey of 41,458 workplaces with at least five employees in the EU, Iceland, Norway and Switzerland, asked which digital technologies they use. At each workplace, the person who knows best about health and safety answered.",
        "ESENER 2024, anketa e EU-OSHA në 41.458 vende pune me të paktën pesë punonjës në BE, Islandë, Norvegji dhe Zvicër, pyeti cilat teknologji digjitale përdorin. Në çdo vend pune u përgjigj personi që njeh më mirë shëndetin dhe sigurinë në punë.",
        "ESENER 2024, die Erhebung der EU-OSHA in 41.458 Betrieben mit mindestens fünf Beschäftigten in der EU, Island, Norwegen und der Schweiz, fragte, welche digitalen Technologien sie nutzen. Geantwortet hat jeweils die Person, die sich mit Sicherheit und Gesundheit im Betrieb am besten auskennt."),
      blocks: [
        { type: "hbars", source: ["mon-esener-2024"],
          label: x("Workplaces using each technology, EU-27, 2024", "Vendet e punës që përdorin secilën teknologji, BE-27, 2024", "Betriebe, die die Technik nutzen, EU-27, 2024"),
          items: [
            { k: x("Computers at fixed workplaces", "Kompjuterë në vende fikse pune", "Rechner an festen Arbeitsplätzen"), v: 87, n: pc(87) },
            { k: x("Laptops, tablets, smartphones", "Laptopë, tableta, telefona", "Laptops, Tablets, Smartphones"), v: 83, n: pc(83) },
            { k: x("AI that performs work tasks", "AI që kryen detyra pune", "KI, die Arbeitsaufgaben erledigt"), v: 7, n: pc(7) },
            { k: x("Monitoring performance or behaviour", "Monitorim i performancës ose sjelljes", "Überwachung von Leistung oder Verhalten"), v: 7, n: pc(7), alert: true },
            { k: x("The same, transport and storage", "Po ashtu, transporti dhe magazinimi", "Dasselbe, Verkehr und Lagerei"), v: 15, n: pc(15), alert: true },
          ] },
        { type: "p", text: x(
          "Of the workplaces that use at least one such technology, 35% had consulted employees about its possible effects on their health and safety, up from 24% in 2019.",
          "Nga vendet e punës që përdorin të paktën një teknologji të tillë, 35% i kishin konsultuar punonjësit për ndikimin e mundshëm të saj në shëndetin dhe sigurinë e tyre, nga 24% më 2019.",
          "Von den Betrieben, die mindestens eine dieser Technologien nutzen, hatten 35 % die Beschäftigten zu möglichen Folgen für Sicherheit und Gesundheit befragt, nach 24 % im Jahr 2019.") },
        { type: "callout", reading: true, text: x(
          "One workplace in fourteen is more than a fringe. And where digital tools are in use, about two in three did not say they had asked their staff.",
          "Një vend pune në katërmbëdhjetë është më shumë se një rast i rrallë. Dhe aty ku përdoren mjete digjitale, rreth dy në tre nuk thanë se i kishin pyetur punonjësit.",
          "Ein Betrieb von vierzehn ist mehr als ein Randfall. Und wo digitale Werkzeuge im Einsatz sind, gaben etwa zwei von drei Betrieben nicht an, die Beschäftigten gefragt zu haben.") },
      ],
      note: x(
        "Shares of workplaces, not of workers, as reported by one person per workplace. 87%, 83% and both 7% are EU-27 averages; 15% is transport and storage. The report shows the other technologies only as bars, so we leave them out.",
        "Pjesë të vendeve të punës, jo të punonjësve, sipas një personi për çdo vend pune. 87%, 83% dhe të dyja 7% janë mesatare të BE-27; 15% është transporti dhe magazinimi. Raporti i tregon teknologjitë e tjera vetëm si shirita, ndaj i lëmë jashtë.",
        "Anteile der Betriebe, nicht der Beschäftigten, nach Angabe einer Person je Betrieb. 87 %, 83 % und beide 7 % sind Werte der EU-27; 15 % gilt für Verkehr und Lagerei. Die übrigen Technologien zeigt der Bericht nur als Balken, daher fehlen sie hier."),
      source: ["mon-esener-2024"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Six questions", "Gjashtë pyetje", "Sechs Fragen"), x("before you watch", "para se të vëzhgosh", "vor dem Überwachen")],
      lead: x(
        "In Bărbulescu the Grand Chamber listed six factors that courts must weigh when an employer monitors communications (§ 121). Asked before a measure starts, they also work as a test for the manager:",
        "Te Bărbulescu, Dhoma e Madhe renditi gjashtë faktorë që gjykatat duhet t'i peshojnë kur një punëdhënës monitoron komunikimet (§ 121). Po t'i bësh para se të nisë një masë, ato i shërbejnë si provë edhe menaxherit:",
        "Im Fall Bărbulescu nannte die Große Kammer sechs Faktoren, die Gerichte abwägen müssen, wenn ein Arbeitgeber Kommunikation überwacht (§ 121). Vor dem Start einer Maßnahme gestellt, sind sie auch für Führungskräfte ein Test:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Were people told in advance?", "A u njoftuan njerëzit paraprakisht?", "Wurden die Beschäftigten vorab informiert?"), p: x("Clearly, about the nature of the monitoring, before it begins.", "Qartë, për natyrën e monitorimit, para se të nisë.", "Klar, über die Art der Überwachung, bevor sie beginnt.") },
          { h: x("How far does it go?", "Sa larg shkon?", "Wie weit geht sie?"), p: x("Flow or content, all or part, how long, where, and who sees the results.", "Rrjedha apo përmbajtja, gjithçka apo një pjesë, sa gjatë, ku, dhe kush i sheh rezultatet.", "Verbindungen oder Inhalte, alles oder ein Teil, wie lange, wo und wer die Ergebnisse sieht.") },
          { h: x("What is the legitimate reason?", "Cila është arsyeja e ligjshme?", "Welcher legitime Grund besteht?"), p: x("Reading content needs a weightier reason.", "Leximi i përmbajtjes kërkon një arsye më të fortë.", "Inhalte zu lesen braucht einen gewichtigeren Grund.") },
          { h: x("Is there a less intrusive way?", "A ka një rrugë më pak ndërhyrëse?", "Gibt es ein milderes Mittel?"), p: x("Could the aim be reached without opening the content?", "A mund të arrihet qëllimi pa hapur përmbajtjen?", "Lässt sich das Ziel erreichen, ohne Inhalte zu öffnen?") },
          { h: x("What are the consequences?", "Cilat janë pasojat?", "Welche Folgen hat sie?"), p: x("For the person; and are results used only for the stated aim?", "Për personin; dhe a përdoren rezultatet vetëm për qëllimin e deklaruar?", "Für die Person; und dienen die Ergebnisse nur dem genannten Zweck?") },
          { h: x("What safeguards are there?", "Çfarë garancish ka?", "Welche Schutzvorkehrungen gibt es?"), p: x("Above all, no access to content without prior notice.", "Mbi të gjitha, asnjë qasje te përmbajtja pa njoftim paraprak.", "Vor allem: kein Zugriff auf Inhalte ohne vorherige Ankündigung.") },
        ] },
        { type: "p", text: x(
          "One more guarantee: an employee who was monitored must be able to have a court review all of this (§ 122).",
          "Edhe një garanci: punonjësi i monitoruar duhet të mund ta çojë gjithë këtë para një gjykate (§ 122).",
          "Dazu kommt: Wer überwacht wurde, muss all das gerichtlich prüfen lassen können (§ 122).") },
      ],
      note: x(
        "The factors are the Court's, written for communications; using them as questions for any measure is the editors' reading.",
        "Faktorët janë të Gjykatës, të shkruar për komunikimet; përdorimi i tyre si pyetje për çdo masë është leximi i redaksisë.",
        "Die Faktoren stammen vom Gerichtshof und gelten der Kommunikation; sie als Fragen für jede Maßnahme zu lesen, ist die Deutung der Redaktion."),
      source: ["mon-echr-barbulescu-2017"],
    },
    {
      id: "research",
      kicker: x("What the rules say", "Çfarë thonë rregullat", "Was die Regeln sagen"),
      title: [x("A rule that", "Një rregull që", "Eine Regel, die"), x("said too little", "thoshte shumë pak", "zu wenig sagte")],
      lead: x(
        "Article 88 of the GDPR lets Member States set more specific rules for employee data. Under paragraph 2 they must include suitable and specific measures to safeguard dignity, legitimate interests and fundamental rights, with particular regard to transparency and monitoring systems at work.",
        "Neni 88 i GDPR-së i lejon shtetet anëtare të vendosin rregulla më specifike për të dhënat e punonjësve. Sipas paragrafit 2, ato duhet të përfshijnë masa të përshtatshme dhe specifike për të mbrojtur dinjitetin, interesat e ligjshme dhe të drejtat themelore, veçanërisht për transparencën dhe sistemet e monitorimit në punë.",
        "Artikel 88 DSGVO erlaubt den Mitgliedstaaten spezifischere Vorschriften für Beschäftigtendaten. Nach Absatz 2 müssen sie geeignete und besondere Maßnahmen zur Wahrung von Würde, berechtigten Interessen und Grundrechten enthalten, besonders zu Transparenz und Überwachungssystemen am Arbeitsplatz."),
      blocks: [
        { type: "timeline", items: [
          { k: "2018", t: x("§ 26(1) BDSG: employee data may be processed where necessary for the employment relationship.", "§ 26(1) BDSG: të dhënat e punonjësve mund të përpunohen kur është e nevojshme për marrëdhënien e punës.", "§ 26 Abs. 1 BDSG: Beschäftigtendaten dürfen verarbeitet werden, wenn es für das Beschäftigungsverhältnis erforderlich ist.") },
          { k: "2023", t: x("EU Court, C-34/21: a near-identical Hessian rule appears only to repeat the GDPR; such rules are set aside unless they are a valid legal basis.", "Gjykata e BE-së, C-34/21: një rregull pothuajse i njëjtë në Hesen duket se vetëm përsërit GDPR-në; rregulla të tilla lihen pa zbatim, përveç kur janë bazë ligjore e vlefshme.", "EuGH, C-34/21: Eine fast gleichlautende hessische Regel scheint die DSGVO nur zu wiederholen; solche Regeln bleiben unangewendet, außer sie sind eine gültige Rechtsgrundlage.") },
          { k: "2025", t: x("Federal Labour Court, 8 AZR 209/21: § 26(1) sentence 1 BDSG lacks the measures of Article 88(2) and remains unapplied.", "Gjykata Federale e Punës, 8 AZR 209/21: § 26(1), fjalia 1, BDSG nuk ka masat e nenit 88(2) dhe mbetet pa zbatim.", "BAG, 8 AZR 209/21: § 26 Abs. 1 Satz 1 BDSG fehlen die Maßnahmen nach Art. 88 Abs. 2; er bleibt unangewendet.") },
        ] },
        { type: "p", text: x(
          "What applies instead is the GDPR itself: a legal basis under Article 6 and the principles of Article 5. In the same case, testing new HR software with real staff data could rest on the employer's legitimate interests, but only if dummy data would not do. Consent rarely helps: employees are seldom free to give or refuse it (Article 29 Working Party).",
          "Në vend të tij zbatohet vetë GDPR-ja: një bazë ligjore sipas nenit 6 dhe parimet e nenit 5. Në të njëjtën çështje, testimi i një softueri të ri për personelin me të dhëna të vërteta mund të mbështetet në interesat e ligjshme të punëdhënësit, por vetëm nëse të dhënat fiktive nuk mjaftojnë. Pëlqimi rrallë ndihmon: punonjësit rrallë janë të lirë ta japin ose ta refuzojnë (Grupi i Punës i Nenit 29).",
          "Stattdessen gilt die DSGVO selbst: eine Rechtsgrundlage nach Artikel 6 und die Grundsätze aus Artikel 5. Im selben Fall können laut BAG Tests neuer Personalsoftware mit echten Daten auf dem berechtigten Interesse des Arbeitgebers beruhen, aber nur, wenn Dummy-Daten nicht reichen. Einwilligung hilft selten: Beschäftigte können sie kaum frei geben oder verweigern (Artikel-29-Gruppe).") },
        { type: "callout", reading: true, text: x(
          "Without a specific law, the general test applies: a clear purpose, real necessity, the lighter option first.",
          "Pa një ligj specifik, vlen prova e përgjithshme: qëllim i qartë, nevojë e vërtetë, së pari rruga më e lehtë.",
          "Ohne Spezialgesetz greift der allgemeine Test: klarer Zweck, echte Erforderlichkeit, zuerst das mildere Mittel.") },
      ],
      note: x(
        "§ 26 BDSG is still in the statute book. The 2025 case concerned an HR system, not monitoring. This page describes the law; it gives no legal advice.",
        "§ 26 BDSG është ende në tekstin e ligjit. Çështja e vitit 2025 kishte të bënte me një sistem personeli, jo me monitorimin. Kjo faqe përshkruan ligjin; nuk jep këshillë ligjore.",
        "§ 26 BDSG steht weiter im Gesetz. Der Fall von 2025 betraf ein Personalsystem, keine Überwachung. Diese Seite beschreibt das Recht und ersetzt keine Rechtsberatung."),
      source: ["mon-gdpr-2016", "mon-cjeu-c34-2023", "mon-bag-2025", "mon-wp29-work-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Two criteria,", "Dy kritere,", "Zwei Kriterien,"), x("one assessment", "një vlerësim", "eine Prüfung")],
      lead: x(
        "Article 35 of the GDPR requires a data protection impact assessment (DPIA) before processing likely to result in a high risk. The Article 29 Working Party's guidelines list nine criteria; in most cases two are enough. Their own example, a company systematically monitoring its employees' work stations and internet use, meets two: systematic monitoring and vulnerable data subjects.",
        "Neni 35 i GDPR-së kërkon një vlerësim të ndikimit në mbrojtjen e të dhënave (DPIA) para një përpunimi që ka gjasa të sjellë rrezik të lartë. Udhëzimet e Grupit të Punës të Nenit 29 rendisin nëntë kritere; në shumicën e rasteve mjaftojnë dy. Shembulli i tyre, një kompani që monitoron sistematikisht kompjuterët dhe internetin e punonjësve, plotëson dy: monitorimin sistematik dhe subjektet e cenueshme.",
        "Artikel 35 DSGVO verlangt eine Datenschutz-Folgenabschätzung (DSFA) vor einer Verarbeitung mit voraussichtlich hohem Risiko. Die Leitlinien der Artikel-29-Gruppe nennen neun Kriterien; meist genügen zwei. Ihr eigenes Beispiel, ein Unternehmen, das Arbeitsplatzrechner und Internetnutzung systematisch überwacht, erfüllt zwei: systematische Überwachung und schutzbedürftige Betroffene."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Description", "Përshkrimi", "Beschreibung"), p: x("what is processed, why, and the interest pursued", "çfarë përpunohet, pse, dhe interesi që ndiqet", "was verarbeitet wird, wozu und mit welchem Interesse") },
          { h: x("Necessity", "Nevoja", "Erforderlichkeit"), p: x("necessity and proportionality in relation to the purpose", "nevoja dhe proporcionaliteti në raport me qëllimin", "Notwendigkeit und Verhältnismäßigkeit gemessen am Zweck") },
          { h: x("Risks", "Rreziqet", "Risiken"), p: x("to the rights and freedoms of the people concerned", "për të drejtat dhe liritë e personave të prekur", "für Rechte und Freiheiten der Betroffenen") },
          { h: x("Measures", "Masat", "Maßnahmen"), p: x("safeguards and security that address those risks", "garancitë dhe siguria që i trajtojnë këto rreziqe", "Garantien und Sicherheit gegen diese Risiken") },
        ] },
        { type: "example", label: x("Hypothetical example, a support team working from home", "Shembull hipotetik, një ekip mbështetjeje që punon nga shtëpia", "Hypothetisches Beispiel, ein Support-Team im Homeoffice"), rows: [
          { k: x("Proposal", "Propozimi", "Vorschlag"), v: x("a screenshot every ten minutes", "një pamje ekrani çdo dhjetë minuta", "alle zehn Minuten ein Screenshot") },
          { k: x("Criteria", "Kriteret", "Kriterien"), v: x("systematic monitoring, employees: DPIA", "monitorim sistematik, punonjës: DPIA", "systematische Überwachung, Beschäftigte: DSFA") },
          { k: x("Lighter option", "Rruga më e lehtë", "Milderes Mittel"), v: x("ticket counts the system already keeps", "numri i kërkesave që sistemi i mban tashmë", "Ticketzahlen, die das System schon führt") },
        ], text: x("The DPIA is where the lighter option is written down before the heavier one starts. An invented case.", "Te DPIA shkruhet rruga më e lehtë, para se të nisë më e rënda. Rast i sajuar.", "In der DSFA wird das mildere Mittel festgehalten, bevor das schwerere beginnt. Ein erfundener Fall.") },
      ],
      note: x(
        "The four cards are the minimum content set by Article 35(7). The WP29 guidelines of 2017 were endorsed by the EDPB in 2018.",
        "Katër kartat janë përmbajtja minimale që cakton neni 35(7). Udhëzimet e WP29 të vitit 2017 i miratoi EDPB më 2018.",
        "Die vier Karten sind der Mindestinhalt nach Artikel 35 Abs. 7. Die WP29-Leitlinien von 2017 hat der EDSA 2018 bestätigt."),
      source: ["mon-gdpr-2016", "mon-wp29-dpia-2017"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The card for one", "Karta për një", "Die Karte für eine"), x("monitoring measure", "masë monitorimi", "Überwachungsmaßnahme")],
      lead: x(
        "One card per measure, filled in before it starts and kept with the records. If a line stays empty, the measure is not ready.",
        "Një kartë për çdo masë, e plotësuar para se të nisë dhe e ruajtur me dokumentet. Nëse një rresht mbetet bosh, masa nuk është gati.",
        "Eine Karte je Maßnahme, ausgefüllt vor dem Start und bei den Unterlagen abgelegt. Bleibt eine Zeile leer, ist die Maßnahme nicht bereit."),
      blocks: [
        { type: "form", items: [
          { h: x("Measure and purpose", "Masa dhe qëllimi", "Maßnahme und Zweck"), hint: x("what is recorded, about whom, and the problem it solves", "çfarë regjistrohet, për kë, dhe çfarë problemi zgjidh", "was erfasst wird, über wen, welches Problem es löst") },
          { h: x("Legal basis", "Baza ligjore", "Rechtsgrundlage"), hint: x("Article 6 GDPR; consent only if people can freely refuse", "neni 6 i GDPR; pëlqimi vetëm nëse njerëzit mund ta refuzojnë lirisht", "Art. 6 DSGVO; Einwilligung nur, wenn die Betroffenen frei ablehnen können") },
          { h: x("Necessity and the lighter option", "Nevoja dhe rruga më e lehtë", "Erforderlichkeit und milderes Mittel"), hint: x("what would prevent the problem without watching anyone", "çfarë do ta parandalonte problemin pa vëzhguar askënd", "was das Problem verhindern würde, ohne jemanden zu überwachen") },
          { h: x("Who was told, and how", "Kush u njoftua dhe si", "Wer informiert wurde und wie"), hint: x("in advance and in writing; in Germany, the works council (§ 87 BetrVG)", "paraprakisht dhe me shkrim; në Gjermani, këshilli i punonjësve (§ 87 BetrVG)", "vorab und schriftlich; in Deutschland der Betriebsrat (§ 87 BetrVG)") },
          { h: x("Access and retention", "Qasja dhe ruajtja", "Zugriff und Speicherdauer"), hint: x("who sees the results; when they are deleted", "kush i sheh rezultatet; kur fshihen", "wer die Ergebnisse sieht; wann sie gelöscht werden") },
          { h: x("DPIA needed?", "Duhet DPIA?", "DSFA nötig?"), hint: x("two of the nine criteria? Systematic monitoring of staff usually means yes", "dy nga nëntë kriteret? Monitorimi sistematik i stafit zakonisht do të thotë po", "zwei der neun Kriterien? Systematische Überwachung von Beschäftigten heißt meist ja") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, drawn from Bărbulescu, GDPR Articles 5, 6 and 35, the WP29 texts and § 87(1) no. 6 BetrVG. The diagnostic asks why a number turned red before anyone asks whom to watch. Not legal advice.",
        "Karta është propozim i redaksisë, e nxjerrë nga Bărbulescu, nenet 5, 6 dhe 35 të GDPR-së, tekstet e WP29 dhe § 87(1) nr. 6 BetrVG. Diagnostikimi pyet pse një shifër u bë e kuqe para se dikush të pyesë kë të vëzhgojë. Nuk është këshillë ligjore.",
        "Die Karte ist ein Vorschlag der Redaktion, abgeleitet aus Bărbulescu, den Artikeln 5, 6 und 35 DSGVO, den WP29-Texten und § 87 Abs. 1 Nr. 6 BetrVG. Die Diagnose fragt, warum eine Zahl rot wurde, bevor jemand fragt, wen es zu überwachen gilt. Keine Rechtsberatung."),
      source: ["mon-echr-barbulescu-2017", "mon-gdpr-2016", "mon-wp29-work-2017", "mon-wp29-dpia-2017", "mon-betrvg-87"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
