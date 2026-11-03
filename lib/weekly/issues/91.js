// Management Review, No. 91: Asking for advice, why the person asked sees the asker as more able, and how to ask well.
// Block: Role. Facts and their sources: docs/revista/management-review-nr-91.md. Both papers were read in full:
// Brooks, Gino & Schweitzer (2015) in the published version on HBS's site, Flynn & Lake (2008) in the authors'
// accepted version in Cornell's repository. The coach is in No. 11, self-awareness in No. 31, managing up in No. 52.
import { x } from "../common.js";

// "3.57" in English, "3,57" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));
// A share with one decimal: "73.5%", "73,5%", "73,5 %".
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 91,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Asking for advice:", "Të kërkosh këshillë:", "Um Rat fragen:"), x("the fear that misleads", "frika që gënjen", "die Angst, die täuscht")],
  sub: x(
    "Why people avoid asking, what the person asked actually thinks, when a question makes you look more able and when less, why more people say yes than we expect, and a card for asking well.",
    "Pse njerëzit shmangin pyetjen, çfarë mendon në të vërtetë ai që pyetet, kur një pyetje të bën të dukesh më i aftë e kur më pak, pse më shumë njerëz thonë po nga sa presim, dhe një kartë për të pyetur mirë.",
    "Warum Menschen das Fragen meiden, was die gefragte Person tatsächlich denkt, wann eine Frage fähiger wirken lässt und wann weniger, warum mehr Menschen Ja sagen als erwartet, und eine Karte, um gut zu fragen."),
  seo: x(
    "Asking for advice: the studies of Brooks, Gino and Schweitzer on competence, Flynn and Lake on how often people say yes, and a card for asking well.",
    "Të kërkosh këshillë: studimet e Brooks, Gino dhe Schweitzer për aftësinë, të Flynn dhe Lake për sa shpesh thonë po njerëzit, dhe një kartë.",
    "Um Rat fragen: die Studien von Brooks, Gino und Schweitzer zur Kompetenz, von Flynn und Lake dazu, wie oft Menschen Ja sagen, und eine Karte."),
  feature: x(
    "People hold back a question because they fear it will make them look less able. Issue 91 reads two research papers that tested this fear. In eight studies the person asked rated the asker as more capable, not less, as long as the task was hard, the request came to them and they knew the subject. In six more, people asking strangers for help needed far fewer of them than they had predicted. The issue ends with a card for asking well.",
    "Njerëzit e mbajnë pyetjen për vete, sepse kanë frikë se do të duken më pak të aftë. Numri 91 lexon dy punime kërkimore që e vunë në provë këtë frikë. Në tetë studime, ai që u pyet e vlerësoi atë që pyeti si më të aftë, jo më pak, me kusht që detyra të ishte e vështirë, kërkesa t'i drejtohej atij dhe ai ta njihte temën. Në gjashtë të tjera, ata që u kërkuan ndihmë të panjohurve patën nevojë për shumë më pak njerëz nga sa kishin parashikuar. Numri mbyllet me një kartë për të pyetur mirë.",
    "Menschen behalten eine Frage für sich, weil sie fürchten, weniger fähig zu wirken. Ausgabe 91 liest zwei Forschungsarbeiten, die diese Angst geprüft haben. In acht Studien hielt die gefragte Person den Fragenden für fähiger, nicht für weniger fähig, sofern die Aufgabe schwer war, die Bitte an sie selbst ging und sie sich im Thema auskannte. In sechs weiteren mussten Menschen, die Fremde um Hilfe baten, weit weniger von ihnen ansprechen als vorhergesagt. Die Ausgabe endet mit einer Karte, um gut zu fragen."),
  figure: { n: pcd("73.5"), by: "Brooks, Gino & Schweitzer, 2015", t: x(
    "of students asked a partner for advice when paid for their score; 32.7% when paid for how able they seemed.",
    "e studentëve i kërkuan këshillë partnerit kur paguheshin për rezultatin; 32,7% kur paguheshin për sa të aftë dukeshin.",
    "der Studierenden baten einen Partner um Rat, wenn sie nach Ergebnis bezahlt wurden; 32,7 %, wenn nach dem Eindruck von Fähigkeit.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Why people do not ask", "Pse njerëzit nuk pyesin", "Warum Menschen nicht fragen") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("When asking helps", "Kur pyetja ndihmon", "Wann Fragen hilft") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The advice card", "Karta e këshillës", "Die Ratkarte") },
  ],
  sources: ["advice-brooks-2015", "advice-flynn-lake-2008"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many managers treat a question as an admission of a gap, and keep it to themselves. A team that never sees its manager ask learns that it should not ask either. This issue reads two research papers that tested the fear behind the silence: what people expect when they ask, and what the person asked actually thinks.",
        "Shumë menaxherë e shohin pyetjen si pranim të një mangësie dhe e mbajnë për vete. Një ekip që nuk e sheh kurrë menaxherin të pyesë mëson se as ai nuk duhet të pyesë. Ky numër lexon dy punime kërkimore që e vunë në provë frikën pas heshtjes: çfarë presin njerëzit kur pyesin, dhe çfarë mendon në të vërtetë ai që pyetet.",
        "Viele Führungskräfte halten eine Frage für das Eingeständnis einer Lücke und behalten sie für sich. Ein Team, das seine Führungskraft nie fragen sieht, lernt, dass es selbst auch nicht fragen sollte. Diese Ausgabe liest zwei Forschungsarbeiten, die die Angst hinter dem Schweigen geprüft haben: was Menschen erwarten, wenn sie fragen, und was die gefragte Person tatsächlich denkt."),
      body: x(
        "Adults imagining a problem at work expected a coworker to rate them less able if they asked for advice. Students paid for the impression they made asked less than half as often as students paid for their score. Yet the people asked rated askers as more capable, as long as the task was hard, the request came to them and they knew the subject. And strangers said yes far more often than askers predicted. Three conditions and a card close the issue.",
        "Të rriturit që imagjinonin një problem në punë prisnin që një koleg t'i vlerësonte më pak të aftë nëse kërkonin këshillë. Studentët e paguar për përshtypjen që linin pyetën më pak se gjysmën e herëve të studentëve të paguar për rezultatin. E megjithatë, ata që u pyetën i vlerësuan si më të aftë ata që pyetën, me kusht që detyra të ishte e vështirë, kërkesa t'u drejtohej atyre dhe ata ta njihnin temën. Dhe të panjohurit thanë po shumë më shpesh nga sa e parashikuan ata që kërkonin. Tri kushte dhe një kartë e mbyllin numrin.",
        "Erwachsene, die sich ein Problem bei der Arbeit vorstellten, erwarteten, dass ein Kollege sie für weniger fähig hält, wenn sie um Rat fragen. Studierende, die nach ihrem Eindruck bezahlt wurden, fragten weniger als halb so oft wie solche, die nach ihrem Ergebnis bezahlt wurden. Doch die Gefragten hielten Fragende für fähiger, sofern die Aufgabe schwer war, die Bitte an sie selbst ging und sie sich im Thema auskannten. Und Fremde sagten weit öfter Ja, als die Fragenden vorhersagten. Drei Bedingungen und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Why people", "Pse njerëzit", "Warum Menschen"), x("do not ask", "nuk pyesin", "nicht fragen")],
      lead: x(
        "Alison Wood Brooks, Francesca Gino and Maurice Schweitzer began with the fear itself. They asked 302 adults to imagine a problem on an important project. Those who pictured asking a coworker for advice expected to be rated less capable: 4.50 against 5.69 on a scale of 1 to 7.",
        "Alison Wood Brooks, Francesca Gino dhe Maurice Schweitzer nisën nga vetë frika. U kërkuan 302 të rriturve të imagjinonin një problem në një projekt të rëndësishëm. Ata që e përfytyruan veten duke i kërkuar këshillë një kolegu prisnin të vlerësoheshin më pak të aftë: 4,50 kundrejt 5,69 në një shkallë nga 1 në 7.",
        "Alison Wood Brooks, Francesca Gino und Maurice Schweitzer begannen mit der Angst selbst. Sie baten 302 Erwachsene, sich ein Problem in einem wichtigen Projekt vorzustellen. Wer sich vorstellte, einen Kollegen um Rat zu fragen, erwartete eine geringere Einschätzung der eigenen Fähigkeit: 4,50 gegenüber 5,69 auf einer Skala von 1 bis 7."),
      blocks: [
        { type: "pairs", from: x("Paid for the score", "Paguar për rezultatin", "Nach Ergebnis bezahlt"), to: x("Paid for the impression", "Paguar për përshtypjen", "Nach Eindruck bezahlt"), max: 100, source: ["advice-brooks-2015"],
          label: x("199 students before a hard puzzle: the message they chose to send (2015)", "199 studentë para një gjëegjëze të vështirë: mesazhi që zgjodhën të dërgonin (2015)", "199 Studierende vor einer schweren Denkaufgabe: die Nachricht, die sie wählten (2015)"),
          rows: [
            { k: x("“Can you give me any advice?”", "“A mund të më japësh ndonjë këshillë?”", "„Kannst du mir einen Rat geben?“"), a: 73.5, an: pcd("73.5"), b: 32.7, bn: pcd("32.7"), alert: true },
            { k: x("“I hope you did well”", "“Shpresoj të të ketë shkuar mirë”", "„Ich hoffe, es lief gut für dich“"), a: 13.3, an: pcd("13.3"), b: 49.5, bn: pcd("49.5") },
            { k: x("No message", "Asnjë mesazh", "Keine Nachricht"), a: 13.3, an: pcd("13.3"), b: 17.8, bn: pcd("17.8") },
          ] },
        { type: "p", text: x(
          "The partner had already done the puzzle. Students paid a dollar per right answer mostly asked for advice. Students paid by how able the partner would rate them mostly sent a friendly greeting instead.",
          "Partneri e kishte bërë tashmë gjëegjëzën. Studentët e paguar një dollar për çdo përgjigje të saktë kërkuan kryesisht këshillë. Studentët e paguar sipas sa të aftë do t'i vlerësonte partneri dërguan kryesisht një përshëndetje miqësore.",
          "Der Partner hatte die Aufgabe schon hinter sich. Studierende, die einen Dollar je richtige Antwort bekamen, fragten meist um Rat. Studierende, die danach bezahlt wurden, wie fähig der Partner sie einschätzte, schickten meist einen freundlichen Gruß.") },
        { type: "callout", reading: true, text: x(
          "Worrying about looking able did not make anyone know more. It only made them ask less.",
          "Shqetësimi për t'u dukur i aftë nuk e bëri askënd të dinte më shumë. Vetëm i bëri të pyesnin më pak.",
          "Die Sorge, fähig zu wirken, ließ niemanden mehr wissen. Sie ließ nur weniger fragen.") },
      ],
      note: x(
        "Pilot studies A and B of Brooks, Gino & Schweitzer (2015): A, adults online, a scenario; B, students in a laboratory, with a partner simulated by computer. The bars are shares of each payment group.",
        "Studimet paraprake A dhe B të Brooks, Gino & Schweitzer (2015): A, të rritur në internet, një skenar; B, studentë në laborator, me një partner të simuluar nga kompjuteri. Shiritat janë pjesë të secilit grup pagese.",
        "Pilotstudien A und B von Brooks, Gino & Schweitzer (2015): A, Erwachsene online, ein Szenario; B, Studierende im Labor, mit einem vom Computer simulierten Partner. Die Balken sind Anteile je Bezahlgruppe."),
      source: ["advice-brooks-2015"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What the asked", "Çfarë mendon", "Was die Gefragten"), x("actually think", "ai që pyetet", "wirklich denken")],
      lead: x(
        "In the next studies the authors turned to the person asked. After a task, a partner simulated by computer sent one short message. When it asked for advice, the person who received it rated the partner as more capable.",
        "Në studimet e mëpasshme, autorët iu drejtuan atij që pyetet. Pas një detyre, një partner i simuluar nga kompjuteri dërgonte një mesazh të shkurtër. Kur mesazhi kërkonte këshillë, ai që e merrte e vlerësonte partnerin si më të aftë.",
        "In den folgenden Studien wandten sich die Autoren der gefragten Person zu. Nach einer Aufgabe schickte ein vom Computer simulierter Partner eine kurze Nachricht. Bat sie um Rat, hielt der Empfänger den Partner für fähiger."),
      blocks: [
        { type: "columns", max: 7, height: 112, source: ["advice-brooks-2015"],
          label: x("How capable the partner seemed, 1 to 7, by the message received (Study 2a, 2015)", "Sa i aftë dukej partneri, nga 1 në 7, sipas mesazhit të marrë (Studimi 2a, 2015)", "Wie fähig der Partner wirkte, 1 bis 7, nach erhaltener Nachricht (Studie 2a, 2015)"),
          items: [
            { k: x("Asked for advice", "Kërkoi këshillë", "Bat um Rat"), v: 5.40, n: dec("5.40"), alert: true },
            { k: x("Greeting", "Përshëndetje", "Gruß"), v: 4.67, n: dec("4.67") },
            { k: x("Other question", "Pyetje tjetër", "Andere Frage"), v: 4.47, n: dec("4.47") },
            { k: x("“In this together”", "“Jemi bashkë”", "„Wir sitzen im selben Boot“"), v: 4.34, n: dec("4.34") },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("3.62 vs 3.40", "3,62 kundrejt 3,40", "3,62 vs. 3,40"), t: x("competence of a partner who asked, and one who did not; 170 students (Study 1)", "aftësia e një partneri që pyeti dhe e një që nuk pyeti; 170 studentë (Studimi 1)", "Kompetenz eines Partners, der fragte, und eines, der nicht fragte; 170 Studierende (Studie 1)") },
          { n: x("4.82 vs 4.49", "4,82 kundrejt 4,49", "4,82 vs. 4,49"), t: x("score out of 10 expected next round for the one who asked, and the one who did not (Study 2b)", "rezultati nga 10 i pritur në raundin tjetër për atë që pyeti dhe atë që nuk pyeti (Studimi 2b)", "erwartete Punktzahl von 10 in der nächsten Runde für den, der fragte, und den, der nicht fragte (Studie 2b)") },
        ] },
        { type: "callout", reading: true, text: x(
          "Asking did not make the partner seem warmer or more likeable. It made them seem more able.",
          "Pyetja nuk e bëri partnerin të dukej më i ngrohtë ose më i pëlqyeshëm. E bëri të dukej më i aftë.",
          "Die Frage ließ den Partner nicht wärmer oder sympathischer wirken. Sie ließ ihn fähiger wirken."),
        },
      ],
      note: x(
        "Means of three statements such as “My partner is well qualified”, from 1 to 7. Study 2a: 191 students; the partner had scored 6 of 10 in the first round. Study 2b: 226 students; no effect on warmth or liking.",
        "Mesatare të tri pohimeve si “Partneri im është i kualifikuar mirë”, nga 1 në 7. Studimi 2a: 191 studentë; partneri kishte marrë 6 nga 10 në raundin e parë. Studimi 2b: 226 studentë; asnjë efekt te ngrohtësia ose pëlqimi.",
        "Mittelwerte aus drei Aussagen wie „Mein Partner ist gut qualifiziert“, von 1 bis 7. Studie 2a: 191 Studierende; der Partner hatte in der ersten Runde 6 von 10 erreicht. Studie 2b: 226 Studierende; kein Effekt auf Wärme oder Sympathie."),
      source: ["advice-brooks-2015"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("When asking", "Kur pyetja", "Wann Fragen"), x("helps", "ndihmon", "hilft")],
      lead: x(
        "Asking did not help in every case. Three studies looked for the limits: how hard the task was, who was asked, and whether the person asked knew the subject.",
        "Pyetja nuk ndihmoi në çdo rast. Tri studime kërkuan kufijtë: sa e vështirë ishte detyra, kush u pyet, dhe nëse ai që u pyet e njihte temën.",
        "Fragen half nicht in jedem Fall. Drei Studien suchten die Grenzen: wie schwer die Aufgabe war, wer gefragt wurde und ob die gefragte Person sich im Thema auskannte."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The task is hard", "Detyra është e vështirë", "Die Aufgabe ist schwer"), p: x("Hard number grids: 3.57 against 3.28 for those not asked. Simple sums: no difference, and no harm (Study 3).", "Rrjeta të vështira numrash: 3,57 kundrejt 3,28 për ata që nuk u pyetën. Mbledhje të thjeshta: asnjë ndryshim, dhe asnjë dëm (Studimi 3).", "Schwere Zahlengitter: 3,57 gegenüber 3,28 ohne Frage. Einfache Additionen: kein Unterschied und kein Schaden (Studie 3).") },
          { h: x("The request comes to you", "Kërkesa të vjen ty", "Die Bitte geht an Sie"), p: x("Asked themselves: 4.83. Saw the partner ask someone else: 4.08. No request: 4.18 (Study 4).", "Të pyetur vetë: 4,83. Panë partnerin të pyeste dikë tjetër: 4,08. Pa kërkesë: 4,18 (Studimi 4).", "Selbst gefragt: 4,83. Sahen den Partner jemand anderen fragen: 4,08. Ohne Bitte: 4,18 (Studie 4).") },
          { h: x("You know the subject", "E njeh temën", "Sie kennen das Thema"), p: x("Asked on their strongest subject, people rated the asker higher; on their weakest, lower (Study 5).", "Të pyetur në temën e tyre më të fortë, njerëzit e vlerësuan më lart atë që pyeti; në më të dobëtën, më poshtë (Studimi 5).", "Im stärksten eigenen Thema gefragt, bewerteten Menschen den Fragenden höher; im schwächsten niedriger (Studie 5).") },
        ] },
        { type: "columns", max: 7, height: 100, source: ["advice-brooks-2015"],
          label: x("How capable the asker seemed, 1 to 7 (Study 5, 2015)", "Sa i aftë dukej ai që pyeti, nga 1 në 7 (Studimi 5, 2015)", "Wie fähig der Fragende wirkte, 1 bis 7 (Studie 5, 2015)"),
          items: [
            { k: x("Asked on a strength", "Pyetur në pikën e fortë", "Zur Stärke gefragt"), v: 5.32, n: dec("5.32"), alert: true },
            { k: x("Not asked", "Pa u pyetur", "Nicht gefragt"), v: 4.97, n: dec("4.97") },
            { k: x("Asked on a weakness", "Pyetur në pikën e dobët", "Zur Schwäche gefragt"), v: 4.53, n: dec("4.53") },
          ] },
        { type: "callout", reading: true, text: x(
          "A request for advice flatters the person asked. It works only if they believe they can answer it.",
          "Kërkesa për këshillë e lavdëron atë që pyetet. Funksionon vetëm nëse ai beson se mund t'i përgjigjet.",
          "Eine Bitte um Rat schmeichelt der gefragten Person. Sie wirkt nur, wenn diese glaubt, antworten zu können.") },
      ],
      note: x(
        "Means on the same scale. Study 3: 213 students; Study 4: 114 students and staff, where the asked person's own self-confidence carried part of the effect; Study 5: 250 adults online. Feedback on past work is in No. 19.",
        "Mesatare në të njëjtën shkallë. Studimi 3: 213 studentë; Studimi 4: 114 studentë dhe punonjës, ku vetëbesimi i atij që u pyet mbarti një pjesë të efektit; Studimi 5: 250 të rritur në internet. Feedback-u për punën e kaluar është te Nr. 19.",
        "Mittelwerte auf derselben Skala. Studie 3: 213 Studierende; Studie 4: 114 Studierende und Beschäftigte, wobei das Selbstvertrauen der Gefragten einen Teil des Effekts trug; Studie 5: 250 Erwachsene online. Feedback zu vergangener Arbeit steht in Nr. 19."),
      source: ["advice-brooks-2015"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("More say yes", "Më shumë thonë po", "Mehr sagen Ja,"), x("than we expect", "nga sa presim", "als wir denken")],
      lead: x(
        "A second fear stops the question: the answer will be no. In 2008 Francis Flynn and Vanessa Lake, now Bohns, had people predict how many strangers they would need to ask, then sent them out to ask.",
        "Një frikë e dytë e ndal pyetjen: përgjigjja do të jetë jo. Më 2008, Francis Flynn dhe Vanessa Lake, sot Bohns, u kërkuan njerëzve të parashikonin sa të panjohur do t'u duhej të pyesnin, pastaj i dërguan të pyesnin.",
        "Eine zweite Angst hält die Frage zurück: Die Antwort wird Nein sein. 2008 ließen Francis Flynn und Vanessa Lake, heute Bohns, Menschen vorhersagen, wie viele Fremde sie fragen müssten, und schickten sie dann los."),
      blocks: [
        { type: "pairs", from: x("Predicted", "Parashikuar", "Vorhergesagt"), to: x("Actually asked", "Pyetur në fakt", "Tatsächlich gefragt"), max: 25, source: ["advice-flynn-lake-2008"],
          label: x("Strangers approached to get the yeses needed (2008)", "Të panjohur të pyetur për të marrë sa po duheshin (2008)", "Angesprochene Fremde, bis die nötigen Zusagen da waren (2008)"),
          rows: [
            { k: x("Fill in a questionnaire, 5 yeses", "Plotëso një pyetësor, 5 po", "Fragebogen ausfüllen, 5 Zusagen"), a: 20.5, an: dec("20.5"), b: 10.5, bn: dec("10.5") },
            { k: x("Lend a phone for a call, 3 yeses", "Jep telefonin për një thirrje, 3 po", "Handy für einen Anruf leihen, 3 Zusagen"), a: 10.1, an: dec("10.1"), b: 6.2, bn: dec("6.2") },
            { k: x("Walk me to the gym, 1 yes", "Më shoqëro te palestra, 1 po", "Mich zur Sporthalle bringen, 1 Zusage"), a: 7.2, an: dec("7.2"), b: 2.3, bn: dec("2.3"), alert: true },
          ] },
        { type: "p", text: x(
          "Charity volunteers expected to approach 210 people; they needed 122. Asking face to face took 2.3 people per yes, handing out a flyer 15.3. The askers' predictions followed the size of the favour, which made no difference to the answers.",
          "Vullnetarët e një bamirësie prisnin të pyesnin 210 njerëz; u desh të pyesnin 122. Kërkesa sy më sy kërkoi 2,3 njerëz për çdo po, shpërndarja e një fletushke 15,3. Parashikimet ndoqën madhësinë e nderit, që nuk ndryshoi asgjë te përgjigjet.",
          "Freiwillige einer Spendenaktion erwarteten, 210 Menschen anzusprechen; sie brauchten 122. Persönlich zu fragen brauchte 2,3 Personen je Zusage, ein Flugblatt 15,3. Die Vorhersagen folgten der Größe des Gefallens, die für die Antworten keine Rolle spielte.") },
        { type: "callout", reading: true, text: x(
          "Saying no to someone's face is hard. That is why direct requests work, and why a request from a manager is rarely a free one.",
          "Të thuash jo në sy është e vështirë. Prandaj kërkesat e drejtpërdrejta funksionojnë, dhe prandaj kërkesa e një menaxheri rrallë është krejt e lirë.",
          "Jemandem ins Gesicht Nein zu sagen ist schwer. Deshalb wirken direkte Bitten, und deshalb ist die Bitte einer Führungskraft selten ganz frei.") },
      ],
      note: x(
        "Means of people approached. Studies 1, 2 and 6: 42, 29 and 79 students asking strangers on a New York campus; Study 3: 127 charity volunteers, who also asked people they knew. Read in the authors' accepted version.",
        "Mesatare të njerëzve të pyetur. Studimet 1, 2 dhe 6: 42, 29 dhe 79 studentë që pyetën të panjohur në një kampus në Nju Jork; Studimi 3: 127 vullnetarë bamirësie, që pyetën edhe njerëz që i njihnin. Lexuar në versionin e pranuar të autorëve.",
        "Mittelwerte der angesprochenen Personen. Studien 1, 2 und 6: 42, 29 und 79 Studierende, die Fremde auf einem Campus in New York fragten; Studie 3: 127 Freiwillige einer Spendenaktion, die auch Bekannte fragten. Gelesen in der angenommenen Fassung der Autoren."),
      source: ["advice-flynn-lake-2008"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Able,", "I aftë,", "Fähig,"), x("in whose eyes?", "në sytë e kujt?", "in wessen Augen?")],
      lead: x(
        "In every study the person asked rated the asker on the same three statements, from 1, strongly disagree, to 7, strongly agree. Their average is the competence score in the charts of this issue.",
        "Në çdo studim, ai që u pyet e vlerësoi atë që pyeti me të njëjtat tri pohime, nga 1, aspak dakord, te 7, plotësisht dakord. Mesatarja e tyre është pikëzimi i aftësisë në grafikët e këtij numri.",
        "In jeder Studie bewertete die gefragte Person den Fragenden anhand derselben drei Aussagen, von 1, stimme gar nicht zu, bis 7, stimme völlig zu. Ihr Mittelwert ist der Kompetenzwert in den Grafiken dieser Ausgabe."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Solves problems", "Zgjidh probleme", "Löst Probleme"), p: x("“My partner is very capable of solving problems.”", "“Partneri im është shumë i aftë të zgjidhë probleme.”", "„Mein Partner kann Probleme sehr gut lösen.“") },
          { h: x("Skills", "Aftësitë", "Fähigkeiten"), p: x("“I feel very confident about my partner's skills.”", "“Kam shumë besim te aftësitë e partnerit tim.”", "„Ich habe großes Vertrauen in die Fähigkeiten meines Partners.“") },
          { h: x("Qualified", "I kualifikuar", "Qualifiziert"), p: x("“My partner is well qualified.”", "“Partneri im është i kualifikuar mirë.”", "„Mein Partner ist gut qualifiziert.“") },
        ] },
        { type: "lists", cols: [
          { h: x("What was tested", "Çfarë u provua", "Was geprüft wurde"), items: [
            x("Eight studies, 1,665 people", "Tetë studime, 1.665 veta", "Acht Studien, 1.665 Personen"),
            x("Students, staff and adults online", "Studentë, punonjës dhe të rritur në internet", "Studierende, Beschäftigte, Erwachsene online"),
            x("One typed message after one task", "Një mesazh i shkruar pas një detyre", "Eine getippte Nachricht nach einer Aufgabe"),
          ] },
          { h: x("What was not", "Çfarë nuk u provua", "Was nicht geprüft wurde"), accent: true, items: [
            x("Asking face to face", "Pyetja sy më sy", "Fragen von Angesicht zu Angesicht"),
            x("Boss and team, power between them", "Shefi dhe ekipi, pushteti mes tyre", "Chef und Team, Macht dazwischen"),
            x("Asking again and again", "Pyetja përsëri e përsëri", "Immer wieder fragen"),
          ] },
        ] },
        { type: "callout", reading: true, text: x(
          "The evidence is clean but narrow. Whether it holds between a manager and a team has not been measured.",
          "Prova është e pastër, por e ngushtë. Nëse vlen mes një menaxheri dhe një ekipi, nuk është matur.",
          "Der Befund ist sauber, aber schmal. Ob er zwischen Führungskraft und Team gilt, wurde nicht gemessen.") },
      ],
      note: x(
        "Statements adapted by the authors from Mayer and Davis (1999). The right-hand list follows the authors' own section on limits and further research. The total of participants is the editors' sum of the eight studies.",
        "Pohimet u përshtatën nga autorët prej Mayer dhe Davis (1999). Lista djathtas ndjek vetë seksionin e autorëve për kufijtë dhe kërkimin e mëtejshëm. Totali i pjesëmarrësve është shuma e redaksisë për tetë studimet.",
        "Aussagen von den Autoren nach Mayer und Davis (1999) angepasst. Die rechte Liste folgt dem Abschnitt der Autoren zu Grenzen und weiterer Forschung. Die Gesamtzahl ist die Summe der acht Studien durch die Redaktion."),
      source: ["advice-brooks-2015"],
    },
    {
      id: "tool", tool: "/tools/skills-matrix/", more: "solve-it-or-escalate-it",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The advice", "Karta e", "Die Rat-"), x("card", "këshillës", "karte")],
      lead: x(
        "One card before a question that matters. The Skills Matrix shows who on the team is rated able to train others in a task: often the right person to ask.",
        "Një kartë para një pyetjeje që ka rëndësi. Matrica e aftësive tregon kush në ekip është vlerësuar i aftë t'i trajnojë të tjerët në një detyrë: shpesh personi i duhur për t'u pyetur.",
        "Eine Karte vor einer Frage, die zählt. Die Skills Matrix zeigt, wer im Team eine Aufgabe so beherrscht, dass er andere darin anlernen kann: oft die richtige Person zum Fragen."),
      blocks: [
        { type: "form", items: [
          { h: x("The question", "Pyetja", "Die Frage"), hint: x("one sentence; hard enough that a good answer changes what you do", "një fjali; mjaft e vështirë që një përgjigje e mirë të ndryshojë atë që bën", "ein Satz; schwer genug, dass eine gute Antwort ändert, was Sie tun") },
          { h: x("What I have tried", "Çfarë kam provuar", "Was ich versucht habe"), hint: x("what I know, what I did, where I am stuck", "çfarë di, çfarë bëra, ku kam ngecur", "was ich weiß, was ich getan habe, wo ich feststecke") },
          { h: x("Who knows this", "Kush e di këtë", "Wer das weiß"), hint: x("someone strong in exactly this, not only someone senior", "dikush i fortë pikërisht në këtë, jo thjesht dikush më i lartë", "jemand, der genau darin stark ist, nicht nur jemand Ranghöheres") },
          { h: x("How I ask", "Si pyes", "Wie ich frage"), hint: x("directly, in my own words, and with room to say no", "drejtpërdrejt, me fjalët e mia, dhe me vend për të thënë jo", "direkt, in eigenen Worten und mit Raum für ein Nein") },
          { h: x("What I will decide", "Çfarë do të vendos", "Was ich entscheide"), hint: x("the decision stays mine; by when", "vendimi mbetet imi; deri kur", "die Entscheidung bleibt meine; bis wann") },
          { h: x("Back to them", "Kthim tek ai", "Rückmeldung"), hint: x("what I did with the advice, and thanks", "çfarë bëra me këshillën, dhe faleminderit", "was ich mit dem Rat gemacht habe, und Dank") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the three conditions and on the direct request; telling the advisor what you did is the editors' addition. The coach is in No. 11, self-awareness in No. 31, managing up in No. 52.",
        "Karta është propozim i redaksisë, e ndërtuar mbi tri kushtet dhe mbi kërkesën e drejtpërdrejtë; t'i tregosh këshilluesit çfarë bëre është shtesë e redaksisë. Coach-i është te Nr. 11, vetënjohja te Nr. 31, menaxhimi lart te Nr. 52.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die drei Bedingungen und die direkte Bitte; dem Ratgeber zu sagen, was man getan hat, ergänzt die Redaktion. Coaching steht in Nr. 11, Selbstwahrnehmung in Nr. 31, Führen nach oben in Nr. 52."),
      source: ["advice-brooks-2015", "advice-flynn-lake-2008"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
