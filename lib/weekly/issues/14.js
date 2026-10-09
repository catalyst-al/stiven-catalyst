// Management Review, No. 14: Why people leave and what keeps them. Block: People.
// Facts and their sources: docs/revista/management-review-nr-14.md.
import { x, pc } from "../common.js";

export default {
  number: 14,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Why people leave", "Pse njerëzit ikin", "Warum Menschen gehen"), x("and what keeps them", "dhe çfarë i mban", "und was sie hält")],
  sub: x(
    "What people who left say could have kept them, why they name other reasons than their employers expect, what research says about staying, and a card for the conversation before the resignation.",
    "Çfarë thonë ata që ikën se mund t'i kishte mbajtur, pse përmendin arsye të tjera nga ato që pret punëdhënësi, çfarë thotë kërkimi për qëndrimin, dhe një kartë për bisedën para dorëheqjes.",
    "Was Menschen, die gegangen sind, sagen, was sie hätte halten können, warum sie andere Gründe nennen, als ihre Arbeitgeber erwarten, was die Forschung über das Bleiben weiß, und eine Karte für das Gespräch vor der Kündigung."),
  seo: x(
    "Why people leave and what keeps them: Gallup on preventable turnover, what leavers told McKinsey, job embeddedness, the cost of a departure and a stay card.",
    "Pse njerëzit ikin dhe çfarë i mban: Gallup për largimet që parandalohen, McKinsey, lidhja me vendin e punës, kostoja e largimit dhe karta e bisedës.",
    "Warum Menschen gehen und was sie hält: Gallup zu vermeidbarer Fluktuation, was McKinsey hörte, Job Embeddedness, die Kosten eines Abgangs und eine Karte."),
  feature: x(
    "Issue 14 starts with 717 people who left their jobs and the conversations that did not happen, compares what employers think with what leavers say, explains why people stay with the idea of job embeddedness, counts what a departure costs, and ends with a card for the conversation before the resignation.",
    "Numri 14 nis me 717 njerëz që ikën nga puna dhe me bisedat që nuk u bënë, krahason çfarë mendojnë punëdhënësit me çfarë thonë ata që ikën, shpjegon pse njerëzit qëndrojnë me idenë e lidhjes me vendin e punës, numëron sa kushton një largim, dhe mbyllet me një kartë për bisedën para dorëheqjes.",
    "Ausgabe 14 beginnt mit 717 Menschen, die gekündigt haben, und den Gesprächen, die nicht stattfanden, vergleicht, was Arbeitgeber denken, mit dem, was Gehende sagen, erklärt mit der Idee der Job Embeddedness, warum Menschen bleiben, rechnet vor, was ein Abgang kostet, und endet mit einer Karte für das Gespräch vor der Kündigung."),
  figure: { n: pc(42), by: "Gallup, 2024", t: x(
    "of people who left voluntarily said their manager or organisation could have done something to keep them.",
    "e atyre që ikën vullnetarisht thanë se menaxheri ose organizata mund të kishte bërë diçka për t'i mbajtur.",
    "derer, die freiwillig gingen, sagten, Führungskraft oder Organisation hätten etwas tun können, um sie zu halten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Four in ten could have stayed", "Katër në dhjetë mund të kishin qëndruar", "Vier von zehn hätten bleiben können") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Why people stay", "Pse njerëzit qëndrojnë", "Warum Menschen bleiben") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The stay conversation card", "Karta e bisedës për të qëndruar", "Die Karte für das Bleibegespräch") },
  ],
  sources: ["gallup-turnover-2024", "gallup-turnover-2019", "mckinsey-attrition-2021", "mckinsey-attrition-2022", "mitchell-2001", "lee-1999", "boushey-glynn-2012", "bls-jolts-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every manager knows the moment: a good person asks for five minutes and hands in their notice. This issue is about the months before that meeting, when the departure could still have been a conversation.",
        "Çdo menaxher e njeh këtë çast: një njeri i mirë kërkon pesë minuta dhe dorëzon dorëheqjen. Ky numër flet për muajt para atij takimi, kur largimi mund të ishte ende një bisedë.",
        "Jede Führungskraft kennt den Moment: Ein guter Mensch bittet um fünf Minuten und reicht die Kündigung ein. Diese Ausgabe handelt von den Monaten davor, als der Abgang noch ein Gespräch hätte sein können."),
      body: x(
        "Gallup asked 717 people in the US who had left a job, and four in ten said it could have been prevented. McKinsey found that leavers name other reasons than their employers expect. Research on why people stay points to three things: the ties a person has, how well they fit, and what they would lose by leaving. Most of the data are from the US and other English-speaking countries; for Albania and Germany we have no comparable survey.",
        "Gallup pyeti 717 njerëz në SHBA që kishin ikur nga një punë, dhe katër në dhjetë thanë se largimi mund të ishte parandaluar. McKinsey gjeti se ata që ikin përmendin arsye të tjera nga ato që pret punëdhënësi. Kërkimi për arsyet pse njerëzit qëndrojnë tregon tri gjëra: lidhjet që ka njeriu, sa i përshtatet vendi, dhe çfarë do të humbiste po të ikte. Shumica e të dhënave janë nga SHBA dhe vende të tjera anglishtfolëse; për Shqipërinë dhe Gjermaninë s'kam anketë të krahasueshme.",
        "Gallup befragte 717 Menschen in den USA, die eine Stelle verlassen hatten, und vier von zehn sagten, der Abgang wäre vermeidbar gewesen. McKinsey fand, dass Gehende andere Gründe nennen, als ihre Arbeitgeber erwarten. Die Forschung zum Bleiben zeigt auf drei Dinge: die Bindungen eines Menschen, wie gut er passt und was er beim Gehen verlieren würde. Die meisten Daten stammen aus den USA und anderen englischsprachigen Ländern; für Albanien und Deutschland liegt uns keine vergleichbare Umfrage vor."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Four in ten", "Katër në dhjetë", "Vier von zehn"), x("could have stayed", "mund të kishin qëndruar", "hätten bleiben können")],
      lead: x(
        "In 2024 Gallup surveyed 717 people in the US who had left an employer of their own choice in the previous twelve months. The sample was chosen to represent the country.",
        "Në 2024, Gallup anketoi 717 njerëz në SHBA që kishin ikur me dëshirën e tyre nga një punëdhënës gjatë dymbëdhjetë muajve të fundit. Mostra u zgjodh që të përfaqësonte vendin.",
        "2024 befragte Gallup 717 Menschen in den USA, die in den vorangegangenen zwölf Monaten freiwillig einen Arbeitgeber verlassen hatten. Die Stichprobe wurde so gewählt, dass sie das Land abbildet."),
      blocks: [
        { type: "donut", v: 42, n: pc(42), t: x(
          "said their manager or organisation could have done something to keep them.",
          "thanë se menaxheri ose organizata mund të kishte bërë diçka për t'i mbajtur.",
          "sagten, Führungskraft oder Organisation hätten etwas tun können, um sie zu halten.") },
        { type: "figures", compact: true, items: [
          { n: pc(45), t: x(
            "had no conversation with a manager or any other leader about their satisfaction, performance or future in the three months before they left",
            "nuk patën asnjë bisedë me menaxherin ose me ndonjë drejtues tjetër për kënaqësinë, punën ose të ardhmen e tyre në tre muajt para largimit",
            "hatten in den drei Monaten vor dem Abgang kein Gespräch mit einer Führungskraft über ihre Zufriedenheit, ihre Leistung oder ihre Zukunft") },
          { n: x("½–2×", "½–2×", "½–2×"), t: x(
            "a year's salary: what Gallup estimated in 2019 it costs to replace an employee",
            "e pagës vjetore: sa kushton zëvendësimi i një punonjësi sipas vlerësimit të Gallup në 2019",
            "eines Jahresgehalts: was es laut Gallups Schätzung von 2019 kostet, eine Arbeitskraft zu ersetzen") },
        ] },
        { type: "p", text: x(
          "Gallup called that estimate conservative, and put the cost of voluntary turnover to businesses in the US at about a trillion dollars a year.",
          "Gallup e quajti këtë vlerësim të kujdesshëm, dhe e çmoi koston e largimeve vullnetare për bizneset në SHBA në rreth një trilion dollarë në vit.",
          "Gallup nannte diese Schätzung vorsichtig und bezifferte die Kosten freiwilliger Kündigungen für Unternehmen in den USA auf rund eine Billion Dollar im Jahr.") },
        { type: "callout", reading: true, text: x(
          "Four in ten does not mean that every departure can be stopped. It means that many people leave without anyone having asked what would make them stay.",
          "Katër në dhjetë nuk do të thotë se çdo largim mund të ndalet. Do të thotë se shumë njerëz ikin pa i pyetur askush çfarë do t'i mbante.",
          "Vier von zehn heißt nicht, dass sich jeder Abgang verhindern lässt. Es heißt, dass viele gehen, ohne dass jemand gefragt hat, was sie halten würde.") },
      ],
      source: ["gallup-turnover-2024", "gallup-turnover-2019"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What employers think,", "Çfarë mendojnë punëdhënësit,", "Was Arbeitgeber denken,"), x("what leavers say", "çfarë thonë ata që ikin", "was Gehende sagen")],
      lead: x(
        "In 2021 McKinsey asked 5,774 employees and 250 employers in Australia, Canada, Singapore, the UK and the US why people were quitting. Employers pointed to pay, work–life balance and health. People who had left in the previous six months named something else.",
        "Në 2021, McKinsey pyeti 5.774 punonjës dhe 250 punëdhënës në Australi, Kanada, Singapor, Mbretërinë e Bashkuar dhe SHBA pse po largoheshin njerëzit. Punëdhënësit përmendën pagën, ekuilibrin punë–jetë dhe shëndetin. Ata që kishin ikur në gjashtë muajt e fundit përmendën diçka tjetër.",
        "2021 fragte McKinsey 5.774 Beschäftigte und 250 Arbeitgeber in Australien, Kanada, Singapur, Großbritannien und den USA, warum Menschen kündigen. Die Arbeitgeber nannten Gehalt, Vereinbarkeit und Gesundheit. Wer in den sechs Monaten davor gegangen war, nannte etwas anderes."),
      blocks: [
        { type: "hbars", max: 100, source: ["mckinsey-attrition-2021"],
          label: x("Of those who had left, the share who…", "Nga ata që kishin ikur, pjesa që…", "Von denen, die gegangen waren, der Anteil, der…"),
          items: [
            { k: x("did not feel valued by the organisation", "nuk ndihej i vlerësuar nga organizata", "sich von der Organisation nicht geschätzt fühlte"), v: 54, n: pc(54), alert: true },
            { k: x("did not feel valued by the manager", "nuk ndihej i vlerësuar nga menaxheri", "sich von der Führungskraft nicht geschätzt fühlte"), v: 52, n: pc(52), alert: true },
            { k: x("did not feel they belonged at work", "nuk ndihej pjesë e vendit të punës", "sich bei der Arbeit nicht zugehörig fühlte"), v: 51, n: pc(51) },
          ] },
        { type: "figures", compact: true, source: ["mckinsey-attrition-2022"], items: [
          { n: pc(41), t: x(
            "named a lack of career development and advancement, the first reason on the list in 2022",
            "përmendën mungesën e zhvillimit dhe të ngritjes në karrierë, arsyen e parë në listën e 2022",
            "nannten fehlende Entwicklung und fehlenden Aufstieg, 2022 der erste Grund auf der Liste") },
          { n: pc(40), t: x(
            "were thinking of leaving their job in 2022, as many as a year earlier",
            "po mendonin të iknin nga puna në 2022, po aq sa një vit më parë",
            "dachten 2022 daran, ihre Stelle zu verlassen, so viele wie ein Jahr zuvor") },
        ] },
        { type: "callout", reading: true, text: x(
          "Employers looked for the reason in the contract. Many of the people who left found it in their relationships at work.",
          "Punëdhënësit e kërkuan arsyen te kontrata. Shumë nga ata që ikën e gjetën te marrëdhëniet në punë.",
          "Die Arbeitgeber suchten den Grund im Vertrag. Viele, die gingen, fanden ihn in den Beziehungen bei der Arbeit.") },
      ],
      note: x(
        "Each person could name several reasons, so the shares add up to more than 100%. The 2022 survey had 13,382 employees in six countries, India among them.",
        "Secili mund të përmendte disa arsye, prandaj pjesët mblidhen mbi 100%. Anketa e 2022 kishte 13.382 punonjës në gjashtë vende, mes tyre India.",
        "Jede Person konnte mehrere Gründe nennen, daher ergeben die Anteile zusammen mehr als 100 %. Die Umfrage 2022 umfasste 13.382 Beschäftigte in sechs Ländern, darunter Indien."),
      source: ["mckinsey-attrition-2021", "mckinsey-attrition-2022"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Why people", "Pse njerëzit", "Warum Menschen"), x("stay", "qëndrojnë", "bleiben")],
      lead: x(
        "In 2001 Terence Mitchell and colleagues asked the opposite question: not why people leave, but what holds them. They called it job embeddedness and described three parts, each at work and outside it.",
        "Në 2001, Terence Mitchell dhe kolegët e tij bënë pyetjen e kundërt: jo pse ikin njerëzit, por çfarë i mban. E quajtën lidhje me vendin e punës (job embeddedness) dhe përshkruan tri pjesë, secila në punë dhe jashtë saj.",
        "2001 stellten Terence Mitchell und Kollegen die umgekehrte Frage: nicht, warum Menschen gehen, sondern was sie hält. Sie nannten es Job Embeddedness und beschrieben drei Teile, jeweils bei der Arbeit und außerhalb."),
      blocks: [
        { type: "tiles", groups: [
          { h: x("Links", "Lidhjet", "Bindungen"), tone: "red", items: [
            { n: "01", t: x("At work: colleagues, a team, someone to learn from", "Në punë: kolegët, ekipi, dikush nga i cili mëson", "Bei der Arbeit: Kollegen, ein Team, jemand, von dem man lernt") },
            { n: "02", t: x("Outside: family and friends nearby", "Jashtë: familja dhe miqtë afër", "Außerhalb: Familie und Freunde in der Nähe") },
          ] },
          { h: x("Fit", "Përputhja", "Passung"), tone: "blue", items: [
            { n: "01", t: x("At work: the job uses what the person can do", "Në punë: puna përdor atë që di të bëjë njeriu", "Bei der Arbeit: Die Stelle nutzt, was die Person kann") },
            { n: "02", t: x("Outside: the town and the commute suit them", "Jashtë: qyteti dhe rruga për në punë i përshtaten", "Außerhalb: Ort und Arbeitsweg passen") },
          ] },
          { h: x("Sacrifice", "Sakrifica", "Opfer"), tone: "ink", items: [
            { n: "01", t: x("At work: a schedule, a project, the years built up", "Në punë: orari, një projekt, vitet e grumbulluara", "Bei der Arbeit: ein Dienstplan, ein Projekt, aufgebaute Jahre") },
            { n: "02", t: x("Outside: a home, a school, a routine", "Jashtë: shtëpia, shkolla, rutina", "Außerhalb: ein Zuhause, eine Schule, ein Alltag") },
          ] },
        ] },
        { type: "p", text: x(
          "In their study, embeddedness predicted who would leave, beyond job satisfaction, commitment to the organisation, the alternatives people had and whether they were looking.",
          "Në studimin e tyre, kjo lidhje parashikoi kush do të ikte, përtej kënaqësisë në punë, angazhimit ndaj organizatës, alternativave që kishin njerëzit dhe nëse po kërkonin punë.",
          "In ihrer Studie sagte die Einbettung voraus, wer gehen würde, über Arbeitszufriedenheit, Bindung an die Organisation, vorhandene Alternativen und eine laufende Suche hinaus.") },
        { type: "p", text: x(
          "Thomas Lee and Terence Mitchell had already proposed that many departures do not grow slowly out of dissatisfaction. They start with an event that makes a person think about leaving, which the authors call a shock. It can be good or bad, at work or at home.",
          "Thomas Lee dhe Terence Mitchell kishin propozuar më parë se shumë largime nuk rriten ngadalë nga pakënaqësia. Nisin me një ngjarje që e bën njeriun të mendojë për ikjen, të cilën autorët e quajnë tronditje. Mund të jetë e mirë ose e keqe, në punë ose në shtëpi.",
          "Thomas Lee und Terence Mitchell hatten schon vorgeschlagen, dass viele Abgänge nicht langsam aus Unzufriedenheit wachsen. Sie beginnen mit einem Ereignis, das einen Menschen ans Gehen denken lässt; die Autoren nennen es Schock. Es kann gut oder schlecht sein, bei der Arbeit oder zu Hause.") },
        { type: "callout", reading: true, text: x(
          "Keeping people is not only removing reasons to leave. It is adding reasons to stay: a tie, a fit, something worth keeping.",
          "Mbajtja e njerëzve nuk është vetëm heqja e arsyeve për të ikur. Është shtimi i arsyeve për të qëndruar: një lidhje, një përputhje, diçka që ia vlen ta ruash.",
          "Menschen zu halten heißt nicht nur, Gründe zum Gehen zu beseitigen. Es heißt, Gründe zum Bleiben zu schaffen: eine Bindung, eine Passung, etwas, das man behalten will.") },
      ],
      note: x(
        "The three parts are Mitchell's; the examples in them are the editors'.",
        "Tri pjesët janë të Mitchell; shembujt brenda tyre janë të redaksisë.",
        "Die drei Teile stammen von Mitchell; die Beispiele darin von der Redaktion."),
      source: ["mitchell-2001", "lee-1999"],
    },
    {
      id: "manager", more: "leading-people-without-losing-the-person",
      kicker: x("What the manager can do", "Çfarë mund të bëjë menaxheri", "Was die Führungskraft tun kann"),
      title: [x("The conversation", "Biseda", "Das Gespräch,"), x("that did not happen", "që nuk u bë", "das nicht stattfand")],
      lead: x(
        "Almost half of Gallup's leavers had no conversation about their satisfaction, performance or future in their last three months. That conversation costs less than any other way of keeping people.",
        "Pothuajse gjysma e atyre që ikën te anketa e Gallup nuk pati asnjë bisedë për kënaqësinë, punën ose të ardhmen në tre muajt e fundit. Kjo bisedë kushton më pak se çdo mënyrë tjetër për t'i mbajtur njerëzit.",
        "Fast die Hälfte der Gehenden in Gallups Umfrage hatte in den letzten drei Monaten kein Gespräch über Zufriedenheit, Leistung oder Zukunft. Dieses Gespräch kostet weniger als jeder andere Weg, Menschen zu halten."),
      blocks: [
        { type: "steps", items: [
          { h: x("Ask before they decide", "Pyet para se të vendosin", "Fragen, bevor sie entscheiden"), p: x("A short conversation about staying every quarter, not only the exit interview.", "Një bisedë e shkurtër për qëndrimin çdo tremujor, jo vetëm intervista në dalje.", "Ein kurzes Gespräch übers Bleiben jedes Quartal, nicht nur das Austrittsgespräch.") },
          { h: x("Ask about ties, fit and loss", "Pyet për lidhjet, përputhjen dhe humbjen", "Nach Bindung, Passung und Verlust fragen"), p: x("The three parts of embeddedness, in plain words.", "Tri pjesët e lidhjes me vendin e punës, me fjalë të thjeshta.", "Die drei Teile der Einbettung, in einfachen Worten.") },
          { h: x("Listen for a shock", "Dëgjo për një tronditje", "Auf einen Schock achten"), p: x("An offer, a change at home, a reorganisation: talk in the same week.", "Një ofertë, një ndryshim në shtëpi, një riorganizim: fol në të njëjtën javë.", "Ein Angebot, eine Veränderung zu Hause, eine Umstrukturierung: in derselben Woche reden.") },
          { h: x("Do one thing, and say when", "Bëj një gjë dhe thuaj kur", "Eine Sache tun und sagen, wann"), p: x("A conversation without a follow-up teaches people not to answer next time.", "Një bisedë pa vazhdim i mëson njerëzit të mos përgjigjen herën tjetër.", "Ein Gespräch ohne Folge lehrt, beim nächsten Mal nicht zu antworten.") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift lead", "Shembull hipotetik, një drejtues turni", "Hypothetisches Beispiel, eine Schichtleitung"), rows: [
          { k: x("Signal", "Sinjali", "Signal"), v: x("A good team member asks twice about the night shift", "Një anëtar i mirë i ekipit pyet dy herë për turnin e natës", "Ein gutes Teammitglied fragt zweimal nach der Nachtschicht") },
          { k: x("Conversation", "Biseda", "Gespräch"), v: x("Ten minutes: what keeps you, what would make you look elsewhere", "Dhjetë minuta: çfarë të mban, çfarë do të të bënte të kërkoje gjetkë", "Zehn Minuten: Was hält dich, was ließe dich woanders suchen") },
          { k: x("Follow-up", "Vazhdimi", "Folge"), v: x("Schedule checked with planning by Friday", "Orari kontrollohet me planifikimin deri të premten", "Dienstplan bis Freitag mit der Planung geklärt") },
        ], text: x("The talk happens in the week of the signal, not at the exit interview. The case is invented.", "Biseda bëhet në javën e sinjalit, jo në intervistën e daljes. Rasti është i shpikur.", "Das Gespräch findet in der Woche des Signals statt, nicht beim Austrittsgespräch. Der Fall ist erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
      source: ["gallup-turnover-2024"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("What a departure", "Sa kushton", "Was ein Abgang"), x("costs", "një largim", "kostet")],
      lead: x(
        "The US Bureau of Labor Statistics counts quits as separations the employee starts, and the quits rate as the quits of a month as a share of employment. In August 2026 it was 1.9%; at its peak, in November 2021, it was 3.0%.",
        "Byroja amerikane e Statistikave të Punës i numëron largimet vullnetare si largime që i nis vetë punonjësi, dhe shkallën e tyre si largimet e një muaji në raport me të punësuarit. Në gusht 2026 ishte 1,9%; në kulm, në nëntor 2021, ishte 3,0%.",
        "Das US Bureau of Labor Statistics zählt Kündigungen als Abgänge, die von den Beschäftigten ausgehen, und die Kündigungsrate als die Kündigungen eines Monats im Verhältnis zur Beschäftigung. Im August 2026 lag sie bei 1,9 %; auf dem Höhepunkt im November 2021 bei 3,0 %."),
      blocks: [
        { type: "figures", compact: true, source: ["boushey-glynn-2012"], items: [
          { n: pc(21), t: x("of a year's salary: the typical cost of replacing an employee in US case studies", "e pagës vjetore: kostoja tipike e zëvendësimit të një punonjësi në rastet e studiuara në SHBA", "eines Jahresgehalts: die typischen Kosten, eine Arbeitskraft zu ersetzen, in US-Fallstudien") },
          { n: pc(16), t: x("for jobs paying under $30,000 a year", "për punë që paguhen nën 30.000 dollarë në vit", "bei Stellen unter 30.000 Dollar im Jahr") },
          { n: pc(213), t: x("the highest, for a top executive", "më e larta, për një drejtues të lartë", "der höchste Wert, bei einer Top-Führungskraft") },
        ] },
        { type: "p", text: x(
          "Heather Boushey and Sarah Jane Glynn reviewed US studies published between 1992 and 2007. Gallup's estimate is higher: one-half to two times the salary. Count your own costs: hiring, training, the weeks until the new person is up to speed, and the overtime while the place is empty.",
          "Heather Boushey dhe Sarah Jane Glynn shqyrtuan studime amerikane të botuara mes 1992 dhe 2007. Vlerësimi i Gallup është më i lartë: nga gjysma deri në dyfishin e pagës. Numëro kostot e tua: punësimin, trajnimin, javët derisa i riu të ecë me ritmin e duhur, dhe orët shtesë kur vendi është bosh.",
          "Heather Boushey und Sarah Jane Glynn werteten US-Studien aus den Jahren 1992 bis 2007 aus. Gallups Schätzung liegt höher: das Halbe bis Doppelte des Gehalts. Die eigenen Kosten zählen: Einstellung, Einarbeitung, die Wochen bis zum vollen Tempo und die Überstunden, solange die Stelle leer ist.") },
        { type: "example", label: x("Hypothetical example, a team of 40", "Shembull hipotetik, një ekip me 40 veta", "Hypothetisches Beispiel, ein Team mit 40 Personen"), rows: [
          { k: x("Leavers", "Largime", "Abgänge"), v: x("6 voluntary, in one year", "6 vullnetare, në një vit", "6 freiwillige, in einem Jahr") },
          { k: x("Rate", "Shkalla", "Quote"), v: x("6 ÷ 40 = 15%", "6 ÷ 40 = 15%", "6 ÷ 40 = 15 %") },
          { k: x("Cost", "Kostoja", "Kosten"), v: x("6 × 21% of €30,000 = €37,800", "6 × 21% e 30.000 € = 37.800 €", "6 × 21 % von 30.000 € = 37.800 €") },
        ], text: x("The median of the case studies, as a first estimate. The numbers are invented.", "Mediana e rasteve të studiuara, si vlerësim i parë. Numrat janë të shpikur.", "Der Median der Fallstudien, als erste Schätzung. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "The rate says how many people left. The exit interview says why, when it is too late. Only the conversation before it can still change the answer.",
          "Shkalla thotë sa njerëz ikën. Intervista në dalje thotë pse, kur është tepër vonë. Vetëm biseda para saj mund ta ndryshojë ende përgjigjen.",
          "Die Quote sagt, wie viele gegangen sind. Das Austrittsgespräch sagt, warum, wenn es zu spät ist. Nur das Gespräch davor kann die Antwort noch ändern.") },
      ],
      note: x(
        "The 21% excludes executives and physicians. The example is the editors'.",
        "21% nuk përfshin drejtuesit e lartë dhe mjekët. Shembulli është i redaksisë.",
        "Die 21 % schließen Top-Führungskräfte und Ärzte aus. Das Beispiel stammt von der Redaktion."),
      source: ["bls-jolts-2026", "boushey-glynn-2012", "gallup-turnover-2019"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The stay", "Karta e bisedës", "Die Karte für das"), x("conversation card", "për të qëndruar", "Bleibegespräch")],
      lead: x(
        "One card for a conversation with each person in the team every quarter, before anyone has decided anything. Fifteen minutes, one note, one action.",
        "Një kartë për një bisedë me secilin në ekip çdo tremujor, para se dikush të ketë vendosur diçka. Pesëmbëdhjetë minuta, një shënim, një veprim.",
        "Eine Karte für ein Gespräch mit jeder Person im Team pro Quartal, bevor jemand etwas entschieden hat. Fünfzehn Minuten, eine Notiz, eine Handlung."),
      blocks: [
        { type: "form", items: [
          { h: x("What keeps you here", "Çfarë të mban këtu", "Was dich hier hält"), hint: x("people, work, place: the ties that matter", "njerëzit, puna, vendi: lidhjet që kanë rëndësi", "Menschen, Arbeit, Ort: die Bindungen, die zählen") },
          { h: x("What fits, and what does not", "Çfarë përputhet dhe çfarë jo", "Was passt und was nicht"), hint: x("the job, the schedule, the way to work", "puna, orari, rruga për në punë", "die Aufgabe, der Dienstplan, der Arbeitsweg") },
          { h: x("What would make you look elsewhere", "Çfarë do të të bënte të kërkoje gjetkë", "Was dich woanders suchen ließe"), hint: x("an honest answer is worth more than a polite one", "një përgjigje e ndershme vlen më shumë se një e sjellshme", "eine ehrliche Antwort zählt mehr als eine höfliche"), lines: 2 },
          { h: x("What you want to be able to do in a year", "Çfarë do të doje të dije të bëje pas një viti", "Was du in einem Jahr können willst"), hint: x("a skill, a task, a role", "një aftësi, një detyrë, një rol", "eine Fähigkeit, eine Aufgabe, eine Rolle") },
          { h: x("One thing I will do", "Një gjë që do të bëj unë", "Eine Sache, die ich tue"), hint: x("with a date", "me datë", "mit Datum"), lines: 2 },
          { h: x("When we talk again", "Kur flasim sërish", "Wann wir wieder sprechen"), hint: x("in three months, or sooner if something changes", "pas tre muajsh, ose më shpejt nëse ndryshon diçka", "in drei Monaten oder früher, wenn sich etwas ändert") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, built on the three parts of job embeddedness (Mitchell et al., 2001).",
        "Praktikë e propozuar nga redaksia, mbi tri pjesët e lidhjes me vendin e punës (Mitchell et al., 2001).",
        "Eine Praxis, die die Redaktion vorschlägt, aufgebaut auf den drei Teilen der Job Embeddedness (Mitchell et al., 2001)."),
      source: ["mitchell-2001"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
