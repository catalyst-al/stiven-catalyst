// Management Review, No. 72: Mentor and sponsor. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-72.md. The correlations on the research page are the
// weighted mean r of Allen et al. (2004), tables 2 and 3.
import { x, pc } from "../common.js";

// A decimal written for each language: "0.37", "0,37", "0,37".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 72,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Mentor", "Mentori", "Mentor"), x("and sponsor", "dhe sponsori", "und Sponsor")],
  sub: x(
    "Kram's two kinds of help, high potentials who were mentored but not promoted, what a sponsor does that a mentor does not, what the meta-analyses find, assigned or chosen mentors, and a card for one relationship.",
    "Dy llojet e ndihmës te Kram-i, potenciale të larta të mentoruara por jo të promovuara, çfarë bën një sponsor që s'e bën mentori, çfarë gjejnë meta-analizat, mentorë të caktuar apo të zgjedhur, dhe një kartë për një marrëdhënie.",
    "Krams zwei Arten von Hilfe, Talente mit Mentor, aber ohne Beförderung, was ein Sponsor tut und ein Mentor nicht, was Metaanalysen finden, zugeteilte oder selbst gewählte Mentoren und eine Karte."),
  seo: x(
    "Mentor and sponsor: Kram's career and psychosocial functions, the Catalyst data on mentoring and promotion, two meta-analyses, formal mentoring and a card.",
    "Mentori dhe sponsori: funksionet e karrierës dhe psikosociale te Kram-i, të dhënat e Catalyst për mentorimin dhe promovimin, dy meta-analiza dhe një kartë.",
    "Mentor und Sponsor: Krams Karriere- und psychosoziale Funktionen, Catalyst-Daten zu Mentoring und Beförderung, zwei Metaanalysen, formales Mentoring, Karte."),
  feature: x(
    "Issue 72 starts with the two kinds of help Kathy Kram found in mentoring relationships, follows a Catalyst survey in which more women than men had mentors but fewer of the mentored women were promoted, sets the mentor beside the sponsor who speaks for you where decisions are made, weighs what two meta-analyses find mentoring is worth, compares assigned and self-found mentors, and ends with a card for one mentoring or sponsorship relationship.",
    "Numri 72 nis me dy llojet e ndihmës që Kathy Kram gjeti te marrëdhëniet e mentorimit, ndjek një anketë të Catalyst ku më shumë gra se burra kishin mentor, por më pak nga gratë e mentoruara u promovuan, e vë mentorin pranë sponsorit që flet për ty aty ku merren vendimet, peshon çfarë gjejnë dy meta-analiza për vlerën e mentorimit, krahason mentorët e caktuar me ata që i gjen vetë, dhe mbyllet me një kartë për një marrëdhënie mentorimi ose sponsorizimi.",
    "Ausgabe 72 beginnt mit den zwei Arten von Hilfe, die Kathy Kram in Mentoring-Beziehungen fand, folgt einer Catalyst-Umfrage, in der mehr Frauen als Männer einen Mentor hatten, aber weniger der betreuten Frauen befördert wurden, stellt den Mentor neben den Sponsor, der dort für einen spricht, wo entschieden wird, wägt ab, was zwei Metaanalysen über den Wert von Mentoring finden, vergleicht zugeteilte mit selbst gefundenen Mentoren und endet mit einer Karte für eine Mentoring- oder Sponsoring-Beziehung."),
  figure: { n: pc(72), by: "Ibarra, Carter & Silva, 2010", t: x(
    "of the men with an active mentor in 2008 had been promoted at least once by 2010; of the women, 65%.",
    "e burrave me një mentor aktiv në 2008 ishin promovuar të paktën një herë deri në 2010; nga gratë, 65%.",
    "der Männer mit aktivem Mentor im Jahr 2008 waren bis 2010 mindestens einmal befördert worden, von den Frauen 65 %.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two kinds of help", "Dy lloje ndihme", "Zwei Arten von Hilfe") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Mentored, not promoted", "Të mentoruara, jo të promovuara", "Betreut, nicht befördert") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The mentor and sponsor card", "Karta e mentorit dhe sponsorit", "Die Mentor- und Sponsorkarte") },
  ],
  sources: ["mentor-kram-1985", "mentor-kram-isabella-1985", "mentor-ibarra-2010", "mentor-allen-2004", "mentor-eby-2008", "mentor-ragins-cotton-1999", "mentor-allen-eby-lentz-2006"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most people who move up can name someone who helped them. Two kinds of help are often mixed up: a mentor talks with you about your work, a sponsor talks about you where decisions are made. This issue separates the two and asks what each is worth.",
        "Shumica e njerëzve që ngjiten në karrierë mund të përmendin dikë që i ndihmoi. Dy lloje ndihme ngatërrohen shpesh: mentori flet me ty për punën tënde, sponsori flet për ty aty ku merren vendimet. Ky numër i ndan të dyja dhe pyet sa vlen secila.",
        "Wer aufsteigt, kann meist jemanden nennen, der geholfen hat. Zwei Arten von Hilfe werden oft verwechselt: Ein Mentor spricht mit einem über die Arbeit, ein Sponsor spricht über einen, wo entschieden wird. Diese Ausgabe trennt beides und fragt, was es jeweils wert ist."),
      body: x(
        "Kathy Kram described what mentors give: career help, sponsorship among it, and personal support. In a Catalyst survey of more than 4,000 high potentials, more women than men had mentors, yet fewer of the mentored women were promoted. Two meta-analyses find mentoring linked with better careers, but with small effects on pay and promotion. People who found their mentors themselves did better than those who were assigned one, and in formal programmes a say in the process and good training made a difference.",
        "Kathy Kram përshkroi çfarë japin mentorët: ndihmë për karrierën, ku hyn edhe sponsorizimi, dhe mbështetje personale. Në një anketë të Catalyst me më shumë se 4.000 potenciale të larta, më shumë gra se burra kishin mentor, por më pak nga gratë e mentoruara u promovuan. Dy meta-analiza e lidhin mentorimin me karriera më të mira, por me efekte të vogla te paga dhe promovimi. Ata që e gjetën vetë mentorin ecën më mirë se ata që e morën të caktuar, dhe te programet formale bënë diferencë fjala në proces dhe një trajnim i mirë.",
        "Kathy Kram beschrieb, was Mentoren geben: Hilfe für die Laufbahn, darunter Sponsoring, und persönliche Unterstützung. In einer Catalyst-Umfrage unter mehr als 4.000 Nachwuchstalenten hatten mehr Frauen als Männer einen Mentor, doch weniger der betreuten Frauen wurden befördert. Zwei Metaanalysen verbinden Mentoring mit besseren Laufbahnen, aber mit kleinen Effekten auf Gehalt und Beförderung. Wer den Mentor selbst fand, kam weiter als wer einen zugeteilt bekam, und in formalen Programmen machten Mitsprache und gute Schulung einen Unterschied."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two kinds", "Dy lloje", "Zwei Arten"), x("of help", "ndihme", "von Hilfe")],
      lead: x(
        "Kathy Kram studied 18 pairs of junior and senior managers in mentoring relationships, and in Mentoring at Work (1985) she sorted what mentors do into two groups: help with the career, and help with the person.",
        "Kathy Kram studioi 18 çifte menaxherësh të rinj dhe me përvojë në marrëdhënie mentorimi, dhe te Mentoring at Work (1985) i ndau në dy grupe ato që bëjnë mentorët: ndihmë për karrierën dhe ndihmë për njeriun.",
        "Kathy Kram untersuchte 18 Paare junger und erfahrener Führungskräfte in Mentoring-Beziehungen und ordnete in Mentoring at Work (1985), was Mentoren tun, in zwei Gruppen: Hilfe für die Laufbahn und Hilfe für den Menschen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Career functions", "Funksionet e karrierës", "Karrierefunktionen"), accent: true, items: [
            x("Sponsorship", "Sponsorizimi", "Sponsoring"),
            x("Exposure and visibility", "Ekspozimi dhe dukshmëria", "Sichtbarkeit"),
            x("Coaching", "Coaching-u", "Coaching"),
            x("Protection", "Mbrojtja", "Schutz"),
            x("Challenging assignments", "Detyrat sfiduese", "Herausfordernde Aufgaben"),
          ] },
          { h: x("Psychosocial functions", "Funksionet psikosociale", "Psychosoziale Funktionen"), items: [
            x("Role modelling", "Shembulli", "Vorbild"),
            x("Acceptance and confirmation", "Pranimi dhe konfirmimi", "Akzeptanz und Bestätigung"),
            x("Counselling", "Këshillimi", "Beratung"),
            x("Friendship", "Miqësia", "Freundschaft"),
          ] },
        ] },
        { type: "p", text: x(
          "Twenty-five years later, Herminia Ibarra, Nancy Carter and Christine Silva met a senior marketing manager who had been matched with a high-level mentor and invited to a programme for high potentials:",
          "Njëzet e pesë vjet më vonë, Herminia Ibarra, Nancy Carter dhe Christine Silva takuan një menaxhere të lartë marketingu, së cilës i ishte caktuar një mentor i nivelit të lartë dhe që ishte ftuar në një program për potencialet e larta:",
          "25 Jahre später trafen Herminia Ibarra, Nancy Carter und Christine Silva eine leitende Marketingmanagerin, der ein hochrangiger Mentor zugeteilt worden war und die zu einem Programm für Nachwuchstalente eingeladen war:") },
        { type: "quote", text: x(
          "I'd been here for 12 years, and nothing happened. Now I am being mentored to death.",
          "Kisha 12 vjet këtu dhe s'kishte ndodhur asgjë. Tani po më mbysin me mentorim.",
          "Ich war 12 Jahre hier, und nichts ist passiert. Jetzt werde ich zu Tode gementort.") },
        { type: "callout", reading: true, text: x(
          "A mentor talks with you. A sponsor talks about you, in rooms you are not in.",
          "Mentori flet me ty. Sponsori flet për ty, në dhoma ku ti nuk je.",
          "Ein Mentor spricht mit einem. Ein Sponsor spricht über einen, in Räumen, in denen man nicht ist.") },
      ],
      note: x(
        "The functions as Kram and Isabella list them (1985); the 18 pairs are Kram's earlier interview study. We could not see the book itself. The authors disguised the manager's name.",
        "Funksionet siç i rendisin Kram dhe Isabella (1985); 18 çiftet janë studimi i mëparshëm me intervista i Kram-it. Vetë librin nuk e pamë. Autoret e ndryshuan emrin e menaxheres.",
        "Die Funktionen, wie Kram und Isabella sie aufzählen (1985); die 18 Paare stammen aus Krams früherer Interviewstudie. Das Buch selbst lag uns nicht vor. Die Autorinnen haben den Namen der Managerin verändert."),
      source: ["mentor-kram-1985", "mentor-kram-isabella-1985", "mentor-ibarra-2010"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Mentored,", "Të mentoruara,", "Betreut,"), x("not promoted", "jo të promovuara", "nicht befördert")],
      lead: x(
        "In 2008 Catalyst surveyed more than 4,000 high potentials who had graduated from top MBA programmes worldwide between 1996 and 2007. In 2010 it asked the same group about promotions since.",
        "Në 2008, Catalyst anketoi më shumë se 4.000 potenciale të larta që kishin mbaruar programe MBA të njohura në botë mes 1996 dhe 2007. Në 2010 e pyeti të njëjtin grup për promovimet që nga ajo kohë.",
        "2008 befragte Catalyst mehr als 4.000 Nachwuchstalente, die zwischen 1996 und 2007 führende MBA-Programme weltweit abgeschlossen hatten. 2010 fragte es dieselbe Gruppe nach Beförderungen seither."),
      blocks: [
        { type: "pairs", from: x("Men", "Burrat", "Männer"), to: x("Women", "Gratë", "Frauen"), max: 100, source: ["mentor-ibarra-2010"],
          label: x("High potentials in the Catalyst surveys, 2008 and 2010", "Potencialet e larta në anketat e Catalyst, 2008 dhe 2010", "Nachwuchstalente in den Catalyst-Umfragen, 2008 und 2010"),
          rows: [
            { k: x("Had at least one mentor in their career", "Kishin pasur të paktën një mentor", "Hatten mindestens einmal einen Mentor"), a: 76, an: pc(76), b: 83, bn: pc(83) },
            { k: x("Mentor was the CEO or a senior executive", "Mentori ishte CEO ose drejtues i lartë", "Mentor war CEO oder Topmanager"), a: 78, an: pc(78), b: 69, bn: pc(69) },
            { k: x("Mentored in 2008, promoted by 2010", "Me mentor në 2008, të promovuar deri në 2010", "2008 mit Mentor, bis 2010 befördert"), a: 72, an: pc(72), b: 65, bn: pc(65), alert: true },
          ] },
        { type: "p", text: x(
          "The women's mentors were less senior, even allowing for their lower starting posts, and the more senior the mentor, the faster the advancement. Both made as many lateral moves, but the men were promoted after them. By 2010 the men had 15% more promotions.",
          "Mentorët e grave ishin të nivelit më të ulët, edhe duke llogaritur se gratë nisnin nga poste më të ulëta, dhe sa më i lartë mentori, aq më e shpejtë ngritja. Të dy grupet bënë po aq lëvizje horizontale, por burrat promovoheshin pas tyre. Deri në 2010, burrat kishin 15% më shumë promovime.",
          "Die Mentoren der Frauen standen weniger hoch, auch bei Berücksichtigung ihrer niedrigeren Einstiegsstellen, und je höher der Mentor, desto schneller der Aufstieg. Seitliche Wechsel gab es bei beiden gleich oft, doch die Männer wurden danach befördert. Bis 2010 hatten die Männer 15 % mehr Beförderungen.") },
        { type: "callout", reading: true, text: x(
          "More advice did not close the gap. What was missing was someone senior to vouch for them.",
          "Më shumë këshilla nuk e mbyllën diferencën. Mungonte dikush i lartë që të garantonte për to.",
          "Mehr Rat schloss die Lücke nicht. Es fehlte jemand Ranghohes, der für sie bürgte.") },
      ],
      note: x(
        "Self-reports; rows two and three cover those with an active mentor in 2008. A survey shows links, not causes; mentoring predicted promotion for the men, not for the women.",
        "Vetëdeklarime; rreshti i dytë dhe i tretë vlejnë për ata me mentor aktiv në 2008. Anketa tregon lidhje, jo shkaqe; mentorimi parashikonte promovimin për burrat, jo për gratë.",
        "Selbstauskünfte; Zeile zwei und drei gelten für alle mit aktivem Mentor 2008. Eine Umfrage zeigt Zusammenhänge, keine Ursachen; Mentoring sagte Beförderung bei Männern voraus, bei Frauen nicht."),
      source: ["mentor-ibarra-2010"],
    },
    {
      id: "model", more: "starting-from-zero",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Mentor", "Mentori", "Mentor"), x("and sponsor", "dhe sponsori", "und Sponsor")],
      lead: x(
        "Ibarra and her co-authors define sponsorship as a relationship in which the mentor goes beyond feedback and advice and uses influence with senior executives to advocate for the person. In Kram's terms it is one of five career functions; the authors found it was what the women lacked.",
        "Ibarra dhe bashkautoret e përkufizojnë sponsorizimin si marrëdhënie ku mentori shkon përtej feedback-ut dhe këshillave dhe e përdor ndikimin te drejtuesit e lartë për ta mbrojtur personin. Me termat e Kram-it, është një nga pesë funksionet e karrierës; autoret gjetën se ishte ai që u mungonte grave.",
        "Ibarra und ihre Mitautorinnen definieren Sponsoring als Beziehung, in der der Mentor über Feedback und Rat hinausgeht und seinen Einfluss bei der obersten Leitung nutzt, um sich für die Person einzusetzen. In Krams Begriffen ist es eine von fünf Karrierefunktionen; die Autorinnen fanden, dass genau sie den Frauen fehlte."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Mentors", "Mentorët", "Mentoren"), items: [
            x("can sit at any level", "mund të jenë në çdo nivel", "können auf jeder Ebene sitzen"),
            x("give support, feedback and advice", "japin mbështetje, feedback dhe këshilla", "geben Halt, Feedback und Rat"),
            x("serve as role models", "shërbejnë si shembull", "sind Vorbilder"),
            x("help read company politics", "ndihmojnë të lexosh politikat e kompanisë", "helfen, die Firmenpolitik zu lesen"),
          ] },
          { h: x("Sponsors", "Sponsorët", "Sponsoren"), accent: true, items: [
            x("are senior and have influence", "janë të lartë dhe kanë ndikim", "sind ranghoch und einflussreich"),
            x("introduce you to other executives", "të njohin me drejtues të tjerë", "stellen einen anderen Topleuten vor"),
            x("put your name forward for openings", "e çojnë emrin tënd përpara për vende të lira", "bringen den Namen für Stellen ins Spiel"),
            x("fight for your promotion", "luftojnë për promovimin tënd", "kämpfen für die Beförderung"),
          ] },
        ] },
        { type: "chain", label: x("The four phases of a mentoring relationship (Kram)", "Katër fazat e një marrëdhënieje mentorimi (Kram)", "Die vier Phasen einer Mentoring-Beziehung (Kram)"), items: [
          { h: x("Initiation", "Fillimi", "Beginn") },
          { h: x("Cultivation", "Kultivimi", "Entfaltung") },
          { h: x("Separation", "Ndarja", "Trennung") },
          { h: x("Redefinition", "Ripërcaktimi", "Neubestimmung") },
        ] },
        { type: "callout", reading: true, text: x(
          "A sponsor lends you a reputation. It is earned with what they have seen you do, not with a title you once held.",
          "Sponsori të jep hua reputacionin e vet. Ai fitohet me atë që të ka parë të bësh, jo me një titull që ke pasur dikur.",
          "Ein Sponsor leiht einem seinen Ruf. Den verdient man mit dem, was er einen tun sah, nicht mit einem früheren Titel.") },
      ],
      note: x(
        "The two lists shorten the table in Ibarra et al. (2010). The phases follow Kram (1983) as Kram and Isabella summarise them: in cultivation the help is at its widest; after separation, much of it stops.",
        "Dy listat shkurtojnë tabelën te Ibarra et al. (2010). Fazat ndjekin Kram-in (1983) siç i përmbledhin Kram dhe Isabella: te kultivimi ndihma është më e gjerë; pas ndarjes, shumë prej saj ndalon.",
        "Die zwei Listen kürzen die Tabelle bei Ibarra et al. (2010). Die Phasen folgen Kram (1983), wie Kram und Isabella sie zusammenfassen: In der Entfaltung ist die Hilfe am breitesten, nach der Trennung endet vieles davon."),
      source: ["mentor-ibarra-2010", "mentor-kram-isabella-1985"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What mentoring", "Sa vlen", "Was Mentoring"), x("is worth", "mentorimi", "wert ist")],
      lead: x(
        "Tammy Allen and colleagues pooled the studies on what mentoring brings the person mentored. The benefits held up, but effects on pay and promotion were small.",
        "Tammy Allen dhe kolegët bashkuan studimet për atë që i sjell mentorimi personit që mentorohet. Përfitimet u konfirmuan, por efektet te paga dhe promovimi ishin të vogla.",
        "Tammy Allen und Kollegen fassten die Studien zusammen, was Mentoring der betreuten Person bringt. Die Vorteile bestätigten sich, doch die Effekte auf Gehalt und Beförderung waren klein."),
      blocks: [
        { type: "pairs", from: x("Career mentoring", "Mentorimi i karrierës", "Karriere-Mentoring"), to: x("Psychosocial", "Psikosocial", "Psychosozial"), max: 0.7, source: ["mentor-allen-2004"],
          label: x("Correlation with each outcome, weighted mean r", "Korrelacioni me secilin rezultat, r mesatar i peshuar", "Korrelation mit jedem Ergebnis, gewichtetes mittleres r"),
          rows: [
            { k: x("Promotions", "Promovimet", "Beförderungen"), a: 0.10, an: dec("0.10"), b: 0.06, bn: dec("0.06") },
            { k: x("Pay", "Paga", "Gehalt"), a: 0.08, an: dec("0.08"), b: 0.04, bn: dec("0.04") },
            { k: x("Career satisfaction", "Kënaqësia me karrierën", "Zufriedenheit mit Laufbahn"), a: 0.29, an: dec("0.29"), b: 0.25, bn: dec("0.25") },
            { k: x("Satisfaction with the mentor", "Kënaqësia me mentorin", "Zufriedenheit mit dem Mentor"), a: 0.37, an: dec("0.37"), b: 0.62, bn: dec("0.62"), alert: true },
          ] },
        { type: "p", text: x(
          "In 2008 Lillian Eby and colleagues pooled 116 samples from youth, school and workplace mentoring: many outcomes were better, but the effects were generally small.",
          "Në 2008, Lillian Eby dhe kolegët bashkuan 116 mostra nga mentorimi i të rinjve, në shkollë dhe në punë: shumë rezultate ishin më të mira, por efektet përgjithësisht të vogla.",
          "2008 fassten Lillian Eby und Kollegen 116 Stichproben aus Jugend-, Hochschul- und Arbeitsplatz-Mentoring zusammen: Viele Ergebnisse waren besser, die Effekte meist klein.") },
        { type: "callout", reading: true, text: x(
          "Support makes people like their mentor. Pay and promotion move, a little, with the career help.",
          "Mbështetja i bën njerëzit ta duan mentorin. Paga dhe promovimi lëvizin, pak, me ndihmën për karrierën.",
          "Zuwendung macht den Mentor beliebt. Gehalt und Beförderung bewegen sich, ein wenig, mit der Karrierehilfe.") },
      ],
      note: x(
        "r runs from −1 to 1, with 0 for no link; Eby et al. count 0.10 to 0.23 as small. Mostly surveys at one point in time: they show links, not causes.",
        "r shkon nga −1 te 1, 0 = pa lidhje; Eby et al. i quajnë të vogla vlerat 0,10 deri 0,23. Kryesisht anketa në një moment: tregojnë lidhje, jo shkaqe.",
        "r reicht von −1 bis 1, 0 = kein Zusammenhang; Eby et al. werten 0,10 bis 0,23 als klein. Meist Befragungen zu einem Zeitpunkt: Sie zeigen Zusammenhänge, keine Ursachen."),
      source: ["mentor-allen-2004", "mentor-eby-2008"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Assigned", "I caktuar", "Zugeteilt"), x("or chosen", "apo i zgjedhur", "oder gewählt")],
      lead: x(
        "Belle Rose Ragins and John Cotton asked US engineers, social workers and journalists about their mentors and counted promotions over ten years. Of 1,162 respondents, 44% had an informal mentor, 9% a formal one and 47% none.",
        "Belle Rose Ragins dhe John Cotton pyetën inxhinierë, punonjës socialë dhe gazetarë në SHBA për mentorët e tyre dhe numëruan promovimet në dhjetë vjet. Nga 1.162 të anketuar, 44% kishin mentor joformal, 9% mentor formal dhe 47% asnjë.",
        "Belle Rose Ragins und John Cotton befragten Ingenieure, Sozialarbeiter und Journalisten in den USA zu ihren Mentoren und zählten Beförderungen über zehn Jahre. Von 1.162 Befragten hatten 44 % einen informellen Mentor, 9 % einen formellen und 47 % keinen."),
      blocks: [
        { type: "columns", max: 3, height: 110, source: ["mentor-ragins-cotton-1999"],
          label: x("Promotions in ten years, on average (1999)", "Promovimet në dhjetë vjet, mesatarisht (1999)", "Beförderungen in zehn Jahren, im Schnitt (1999)"),
          items: [
            { k: x("No mentor", "Pa mentor", "Kein Mentor"), v: 1.78, n: dec("1.78") },
            { k: x("Assigned mentor", "Mentor i caktuar", "Zugeteilt"), v: 2.04, n: dec("2.04") },
            { k: x("Self-found mentor", "Mentor i gjetur vetë", "Selbst gefunden"), v: 2.55, n: dec("2.55"), alert: true },
          ] },
        { type: "p", text: x(
          "Only those with informal mentors were promoted significantly more, and earned more, than people without one; those with assigned mentors did not differ from them. In formal programmes, Allen, Eby and Lentz (2006) found two features linked with better mentoring: a say in the process, and training judged good.",
          "Vetëm ata me mentor joformal u promovuan dukshëm më shumë, dhe fitonin më shumë, se njerëzit pa mentor; ata me mentor të caktuar nuk ndryshonin prej tyre. Te programet formale, Allen, Eby dhe Lentz (2006) gjetën dy tipare të lidhura me mentorim më të mirë: të kesh fjalë në proces, dhe trajnim që vlerësohet i mirë.",
          "Nur wer einen informellen Mentor hatte, wurde deutlich öfter befördert und verdiente mehr als Menschen ohne Mentor; wer einen zugeteilten hatte, unterschied sich nicht von ihnen. In formalen Programmen fanden Allen, Eby und Lentz (2006) zwei Merkmale, die mit besserem Mentoring einhergingen: Mitsprache im Ablauf und eine als gut erlebte Schulung.") },
        { type: "callout", reading: true, text: x(
          "A programme can arrange the meeting. It cannot arrange the sponsor's interest in you; that has to be earned.",
          "Një program mund ta organizojë takimin. Nuk mund ta organizojë interesin e sponsorit për ty; ai duhet fituar.",
          "Ein Programm kann das Treffen arrangieren, nicht aber das Interesse des Sponsors; das muss man sich verdienen.") },
      ],
      note: x(
        "A promotion counted with at least two of: a significant raise, wider responsibility, a higher level, eligibility for bonuses. The authors warn of selection: people who find mentors themselves may be stronger to begin with.",
        "Një promovim numërohej me të paktën dy nga këto: rritje e ndjeshme page, përgjegjësi më e gjerë, nivel më i lartë, e drejtë për bonuse. Autorët paralajmërojnë për përzgjedhje: ata që e gjejnë vetë mentorin mund të jenë më të fortë që në fillim.",
        "Als Beförderung zählte, was mindestens zwei Kriterien erfüllte: deutlich mehr Gehalt, mehr Verantwortung, höhere Ebene, Anspruch auf Boni. Die Autoren warnen vor Selektion: Wer selbst einen Mentor findet, ist womöglich schon vorher stärker."),
      source: ["mentor-ragins-cotton-1999", "mentor-allen-eby-lentz-2006"],
    },
    {
      id: "tool", tool: "/tools/cv-builder/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The mentor and", "Karta e mentorit", "Die Mentor- und"), x("sponsor card", "dhe sponsorit", "Sponsorkarte")],
      lead: x(
        "One card per relationship. Write down which help you are asking for, advice or a word in the right room, and when you will check that it came. When a name is put forward, the CV has to be ready.",
        "Një kartë për çdo marrëdhënie. Shëno cilën ndihmë po kërkon, këshillë apo një fjalë në dhomën e duhur, dhe kur do të kontrollosh nëse erdhi. Kur një emër çohet përpara, CV-ja duhet të jetë gati.",
        "Eine Karte pro Beziehung. Notieren, welche Hilfe man sucht, Rat oder ein Wort im richtigen Raum, und wann man prüft, ob sie kam. Wird ein Name genannt, muss der Lebenslauf bereit sein."),
      blocks: [
        { type: "form", items: [
          { h: x("The goal", "Qëllimi", "Das Ziel"), hint: x("one: a skill, a role, a move within a year", "një: një aftësi, një rol, një lëvizje brenda vitit", "eines: eine Fähigkeit, eine Rolle, ein Schritt binnen eines Jahres") },
          { h: x("What the mentor gives", "Çfarë jep mentori", "Was der Mentor gibt"), hint: x("advice, feedback, an example: which, and on what", "këshilla, feedback, shembull: cilin, dhe për çfarë", "Rat, Feedback, Vorbild: was, und wozu") },
          { h: x("What the sponsor risks", "Çfarë rrezikon sponsori", "Was der Sponsor riskiert"), hint: x("whose name, in front of whom, and what they have seen you do", "emri i kujt, para kujt, dhe çfarë të ka parë të bësh", "wessen Ruf, vor wem, und was er einen tun sah") },
          { h: x("The next opportunity", "Mundësia e radhës", "Die nächste Gelegenheit"), hint: x("a role, a project or a meeting, and who decides it", "një rol, një projekt ose një takim, dhe kush vendos", "eine Rolle, ein Projekt oder ein Termin, und wer entscheidet") },
          { h: x("How often", "Sa shpesh", "Wie oft"), hint: x("when you meet, and who asks for the meeting", "kur takoheni, dhe kush e kërkon takimin", "wann man sich trifft, und wer darum bittet") },
          { h: x("Review date", "Data e rishikimit", "Prüftermin"), hint: x("what has opened, and whether to go on, change or end", "çfarë u hap, dhe a vazhdoni, ndryshoni apo e mbyllni", "was sich geöffnet hat, und ob weiter, anders oder Schluss") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the mentor and sponsor roles in Ibarra et al. (2010), Kram's phases and the say in the process that Allen, Eby and Lentz (2006) found mattered.",
        "Praktikë e propozuar nga redaksia, sipas roleve të mentorit dhe sponsorit te Ibarra et al. (2010), fazave të Kram-it dhe fjalës në proces që Allen, Eby dhe Lentz (2006) gjetën se kishte rëndësi.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den Rollen von Mentor und Sponsor bei Ibarra et al. (2010), Krams Phasen und der Mitsprache, die bei Allen, Eby und Lentz (2006) zählte."),
      source: ["mentor-ibarra-2010", "mentor-kram-isabella-1985", "mentor-allen-eby-lentz-2006"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
