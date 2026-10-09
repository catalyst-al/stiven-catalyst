// Management Review, No. 11: The manager as coach. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-11.md.
import { x, pc } from "../common.js";

export default {
  number: 11,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The manager", "Menaxheri", "Die Führungskraft"), x("as coach", "si coach", "als Coach")],
  sub: x(
    "What coaching by a manager is and is not, what the research can and cannot show, and how a short weekly conversation can carry it.",
    "Çfarë është dhe çfarë nuk është coaching-u nga menaxheri, çfarë mund të tregojë kërkimi dhe çfarë jo, dhe si e mban atë një bisedë e shkurtër javore.",
    "Was Coaching durch die Führungskraft ist und was nicht, was die Forschung zeigen kann und was nicht, und wie ein kurzes wöchentliches Gespräch es trägt."),
  seo: x(
    "The manager as coach: Google's best managers, Gallup on the weekly conversation, the GROW model, what meta-analyses show and a card for one conversation.",
    "Menaxheri si coach: menaxherët më të mirë të Google, Gallup për bisedën javore, modeli GROW, çfarë tregojnë meta-analizat dhe një kartë për një bisedë.",
    "Die Führungskraft als Coach: Googles beste Manager, Gallup zum Wochengespräch, das GROW-Modell, was Metaanalysen zeigen und eine Karte für ein Gespräch."),
  feature: x(
    "Issue 11 starts with the first behaviour on Google's list of its best managers, follows Gallup into the conversation that counts, walks through the four GROW questions and asks honestly what the research shows about the manager who coaches.",
    "Numri 11 nis me sjelljen e parë te lista e menaxherëve më të mirë të Google, ndjek Gallup te biseda që ka vlerë, kalon nëpër katër pyetjet e GROW dhe pyet me ndershmëri çfarë tregon kërkimi për menaxherin që bën coaching.",
    "Ausgabe 11 beginnt mit dem ersten Verhalten auf Googles Liste seiner besten Manager, folgt Gallup in das Gespräch, das zählt, geht die vier GROW-Fragen durch und fragt ehrlich, was die Forschung über die coachende Führungskraft zeigt."),
  figure: { n: pc(16), by: "Gallup, 2023", t: x(
    "of nearly 15,000 employees said the last conversation with their manager was extremely meaningful.",
    "e afro 15.000 punonjësve thanë se biseda e fundit me menaxherin ishte jashtëzakonisht kuptimplote.",
    "von fast 15.000 Beschäftigten sagten, das letzte Gespräch mit ihrer Führungskraft sei äußerst bedeutsam gewesen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("From boss to coach", "Nga shefi te coach-i", "Vom Chef zum Coach") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("What coaching changes", "Çfarë ndryshon coaching-u", "Was Coaching verändert") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The GROW card", "Karta GROW", "Die GROW-Karte") },
  ],
  sources: ["rework-managers", "rework-grow", "whitmore-1992", "clifton-harter-2019", "gallup-habit", "jones-2016", "theeboom-2014", "gallup-conversations-2020"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Being a good coach comes first on Google's list of what its best managers do, and Gallup calls the change every manager has to make “from boss to coach”. This issue is about what that means in a normal week.",
        "Të qenit coach i mirë është e para te lista e Google për atë që bëjnë menaxherët e saj më të mirë, dhe Gallup e quan ndryshimin që duhet të bëjë çdo menaxher “nga shefi te coach-i”. Ky numër flet për atë që do të thotë kjo në një javë të zakonshme.",
        "Ein guter Coach zu sein steht an erster Stelle auf Googles Liste dessen, was seine besten Manager tun, und Gallup nennt den Wandel, den jede Führungskraft vollziehen muss, „vom Chef zum Coach“. Diese Ausgabe handelt davon, was das in einer normalen Woche bedeutet."),
      body: x(
        "Gallup finds that few conversations with a manager feel meaningful, and that short weekly ones count more than long rare ones. Google teaches its managers four questions, known as GROW. Two meta-analyses show that coaching at work has clear effects, but they leave out the manager who coaches their own team. That part of the evidence is still to be written, and every manager can add a line to it.",
        "Gallup gjen se pak biseda me menaxherin duken kuptimplote, dhe se bisedat e shkurtra javore vlejnë më shumë se ato të gjata e të rralla. Google u mëson menaxherëve të vet katër pyetje, të njohura si GROW. Dy meta-analiza tregojnë se coaching-u në punë ka efekte të qarta, por e lënë jashtë menaxherin që bën coaching me ekipin e vet. Ajo pjesë e provave është ende për t'u shkruar, dhe çdo menaxher mund t'i shtojë një rresht.",
        "Gallup findet, dass sich wenige Gespräche mit der Führungskraft bedeutsam anfühlen und dass kurze wöchentliche mehr zählen als lange seltene. Google bringt seinen Managern vier Fragen bei, bekannt als GROW. Zwei Metaanalysen zeigen, dass Coaching bei der Arbeit klare Wirkungen hat, lassen aber die Führungskraft aus, die ihr eigenes Team coacht. Dieser Teil der Belege ist noch zu schreiben, und jede Führungskraft kann eine Zeile beitragen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("From boss", "Nga shefi", "Vom Chef"), x("to coach", "te coach-i", "zum Coach")],
      lead: x(
        "When Google studied what its best managers do, being a good coach came first on the list. Google writes that it was one of the most important behaviours of its highest-scoring managers.",
        "Kur Google studioi çfarë bëjnë menaxherët e saj më të mirë, të qenit coach i mirë doli e para në listë. Google shkruan se ishte një nga sjelljet më të rëndësishme të menaxherëve me notat më të larta.",
        "Als Google untersuchte, was seine besten Manager tun, stand ein guter Coach zu sein an erster Stelle. Google schreibt, es sei eine der wichtigsten Verhaltensweisen seiner am besten bewerteten Manager gewesen."),
      blocks: [
        { type: "p", text: x(
          "In 2019 Gallup's Jim Clifton and Jim Harter called the change “from boss to coach”. In Google's and Gallup's guidance, coaching is not a second job as trainer or therapist. It is a short, regular conversation in which the manager asks more than they tell, and the person chooses the next step.",
          "Në 2019, Jim Clifton dhe Jim Harter nga Gallup e quajtën ndryshimin “nga shefi te coach-i”. Te udhëzimet e Google dhe të Gallup, coaching-u nuk është punë e dytë si trajner ose terapist. Është një bisedë e shkurtër dhe e rregullt, ku menaxheri pyet më shumë se sa thotë, dhe personi zgjedh hapin tjetër.",
          "2019 nannten Jim Clifton und Jim Harter von Gallup den Wandel „vom Chef zum Coach“. In den Empfehlungen von Google und Gallup ist Coaching kein zweiter Beruf als Trainer oder Therapeut. Es ist ein kurzes, regelmäßiges Gespräch, in dem die Führungskraft mehr fragt als sagt und die Person den nächsten Schritt wählt.") },
        { type: "lists", cols: [
          { h: x("The boss", "Shefi", "Der Chef"), items: [
            x("Gives the answer", "Jep përgjigjen", "Gibt die Antwort"),
            x("Checks the result at the end", "Kontrollon rezultatin në fund", "Prüft das Ergebnis am Ende"),
            x("Talks about what went wrong", "Flet për atë që shkoi keq", "Spricht über das, was schiefging"),
          ] },
          { h: x("The coach", "Coach-i", "Der Coach"), accent: true, items: [
            x("Asks the question", "Bën pyetjen", "Stellt die Frage"),
            x("Talks briefly, every week", "Flet shkurt, çdo javë", "Spricht kurz, jede Woche"),
            x("Starts from recent work and strengths", "Nis nga puna e fundit dhe pikat e forta", "Beginnt bei der jüngsten Arbeit und den Stärken"),
          ] },
        ] },
        { type: "timeline", items: [
          { k: "1992", t: x("Coaching for Performance makes the GROW model known.", "Coaching for Performance e bën të njohur modelin GROW.", "Coaching for Performance macht das GROW-Modell bekannt.") },
          { k: "2016", t: x("Meta-analysis: coaching at work has clear effects.", "Meta-analizë: coaching-u në punë ka efekte të qarta.", "Metaanalyse: Coaching bei der Arbeit wirkt deutlich.") },
          { k: "2019", t: x("Gallup: the manager moves from boss to coach.", "Gallup: menaxheri kalon nga shefi te coach-i.", "Gallup: Die Führungskraft wird vom Chef zum Coach.") },
          { k: "2023", t: x("Gallup: one meaningful conversation a week.", "Gallup: një bisedë kuptimplote në javë.", "Gallup: ein bedeutsames Gespräch pro Woche.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A boss gives the answer. A coach asks the question that lets the person find it, and then holds them to it.",
          "Shefi jep përgjigjen. Coach-i bën pyetjen që e ndihmon personin ta gjejë vetë, dhe pastaj e mban përgjegjës për të.",
          "Ein Chef gibt die Antwort. Ein Coach stellt die Frage, mit der die Person sie selbst findet, und nimmt sie dann beim Wort.") },
      ],
      note: x(
        "The comparison is our summary of Google's and Gallup's guidance.",
        "Krahasimi është përmbledhja jonë e udhëzimeve të Google dhe të Gallup.",
        "Der Vergleich ist unsere Zusammenfassung der Empfehlungen von Google und Gallup."),
      source: ["rework-managers", "rework-grow", "clifton-harter-2019", "whitmore-1992", "jones-2016", "gallup-habit"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The conversation", "Biseda", "Das Gespräch,"), x("that counts", "që ka vlerë", "das zählt")],
      lead: x(
        "Gallup asked nearly 15,000 employees about the last conversation with their manager. Only 16% called it extremely meaningful.",
        "Gallup pyeti afro 15.000 punonjës për bisedën e fundit me menaxherin. Vetëm 16% e quajtën jashtëzakonisht kuptimplote.",
        "Gallup fragte fast 15.000 Beschäftigte nach dem letzten Gespräch mit ihrer Führungskraft. Nur 16 % nannten es äußerst bedeutsam."),
      blocks: [
        { type: "donut", v: 80, n: pc(80), t: x(
          "of employees who received meaningful feedback in the past week are fully engaged.",
          "e punonjësve që morën feedback kuptimplotë javën e fundit janë plotësisht të angazhuar.",
          "der Beschäftigten, die in der letzten Woche bedeutsames Feedback bekamen, sind voll engagiert.") },
        { type: "p", text: x(
          "In Gallup's findings, conversations of 15 to 30 minutes have more impact than conversations of 30 to 60, if they happen every week. A manager who skips weeks needs longer conversations to catch up.",
          "Sipas gjetjeve të Gallup, bisedat 15 deri në 30 minuta kanë më shumë ndikim se ato 30 deri në 60, nëse bëhen çdo javë. Menaxheri që kapërcen javë ka nevojë për biseda më të gjata që të arrijë.",
          "Nach Gallups Ergebnissen wirken Gespräche von 15 bis 30 Minuten stärker als solche von 30 bis 60, wenn sie jede Woche stattfinden. Wer Wochen auslässt, braucht längere Gespräche, um aufzuholen.") },
        { type: "rows", compact: true, label: x("What makes a conversation meaningful: Gallup's first two", "Çfarë e bën bisedën kuptimplote: dy të parat te Gallup", "Was ein Gespräch bedeutsam macht: Gallups erste zwei"), items: [
          { h: x("Recognition", "Njohja", "Anerkennung"), p: x("for recent work", "për punën e fundit", "für die jüngste Arbeit") },
          { h: x("Collaboration", "Bashkëpunimi", "Zusammenarbeit"), p: x("and relationships in the team", "dhe marrëdhëniet në ekip", "und Beziehungen im Team") },
        ] },
        { type: "p", text: x(
          "Goals and priorities, and the person's strengths, are also on the list. Weaknesses are the least meaningful topic, perhaps because in many conversations they are the only one.",
          "Te lista janë edhe qëllimet dhe prioritetet, si dhe pikat e forta të personit. Dobësitë janë tema më pak kuptimplote, ndoshta sepse në shumë biseda janë e vetmja.",
          "Auch Ziele und Prioritäten sowie die Stärken der Person stehen auf der Liste. Schwächen sind das am wenigsten bedeutsame Thema, vielleicht weil sie in vielen Gesprächen das einzige sind.") },
        { type: "callout", reading: true, text: x(
          "Short and every week beats long and rare. The conversation does not need a meeting room; it needs a fixed place in the week.",
          "E shkurtër dhe çdo javë vlen më shumë se e gjatë dhe e rrallë. Biseda nuk ka nevojë për sallë takimesh; ka nevojë për një vend të caktuar në javë.",
          "Kurz und jede Woche schlägt lang und selten. Das Gespräch braucht keinen Besprechungsraum, sondern einen festen Platz in der Woche.") },
      ],
      source: ["gallup-habit"],
    },
    {
      id: "model", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four", "Katër", "Vier"), x("questions", "pyetje", "Fragen")],
      lead: x(
        "GROW became known through John Whitmore's Coaching for Performance in 1992. Google uses it to teach its managers coaching conversations and calls it a simple framework developed in the United Kingdom.",
        "GROW u bë i njohur me librin e John Whitmore, Coaching for Performance, në 1992. Google e përdor për t'u mësuar menaxherëve bisedat e coaching-ut dhe e quan një kornizë të thjeshtë të zhvilluar në Mbretërinë e Bashkuar.",
        "GROW wurde durch John Whitmores Coaching for Performance von 1992 bekannt. Google nutzt es, um seinen Managern Coaching-Gespräche beizubringen, und nennt es einen einfachen, im Vereinigten Königreich entwickelten Rahmen."),
      blocks: [
        { type: "chain", items: [
          { h: x("Goal", "Goal · Qëllimi", "Goal · Ziel"), p: x("What do you want?", "Çfarë do?", "Was willst du?") },
          { h: x("Reality", "Reality · Realiteti", "Reality · Realität"), p: x("What is happening now?", "Çfarë po ndodh tani?", "Was passiert gerade?") },
          { h: x("Options", "Options · Mundësitë", "Options · Optionen"), p: x("What could you do?", "Çfarë mund të bësh?", "Was könntest du tun?") },
          { h: x("Will", "Will · Vendimi", "Will · Wille"), p: x("What will you do?", "Çfarë do të bësh?", "Was wirst du tun?") },
        ] },
        { type: "p", text: x(
          "Google's guide says GROW works best when the person wants coaching and chooses the topic. The manager asks open questions, listens, and stops giving advice so that the person chooses the next step: less the one who fixes, more the one who makes it easier.",
          "Guida e Google thotë se GROW funksionon më mirë kur personi do coaching dhe e zgjedh vetë temën. Menaxheri bën pyetje të hapura, dëgjon dhe ndalon këshillat, që personi të zgjedhë vetë hapin tjetër: më pak ai që rregullon, më shumë ai që e lehtëson.",
          "Googles Leitfaden sagt, GROW wirke am besten, wenn die Person Coaching will und das Thema selbst wählt. Die Führungskraft fragt offen, hört zu und verzichtet auf Ratschläge, damit die Person den nächsten Schritt wählt: weniger reparieren, mehr erleichtern.") },
        { type: "example", label: x("Hypothetical example, a shift lead and a new team member", "Shembull hipotetik, një shef turni dhe një anëtar i ri i ekipit", "Hypothetisches Beispiel, eine Schichtleitung und ein neues Teammitglied"), rows: [
          { k: x("Goal", "Qëllimi", "Ziel"), v: x("To close the shift on time", "Ta mbyllë turnin në kohë", "Die Schicht pünktlich abschließen") },
          { k: x("Reality", "Realiteti", "Realität"), v: x("Two of the last five shifts ran 40 minutes over", "Dy nga pesë turnet e fundit zgjatën 40 minuta më shumë", "Zwei der letzten fünf Schichten dauerten 40 Minuten länger") },
          { k: x("Options", "Mundësitë", "Optionen"), v: x("Start the handover earlier, ask for help sooner, prepare the counts in the quiet hour", "Ta nisë dorëzimin më herët, të kërkojë ndihmë më shpejt, t'i përgatisë numërimet në orën e qetë", "Übergabe früher beginnen, früher um Hilfe bitten, Zählungen in der ruhigen Stunde vorbereiten") },
          { k: x("Will", "Vendimi", "Wille"), v: x("Counts at 20:00, for two weeks", "Numërimet në 20:00, për dy javë", "Zählungen um 20:00 Uhr, zwei Wochen lang") },
        ], text: x("The manager asked; the person chose. The example is invented.", "Menaxheri pyeti; personi zgjodhi. Shembulli është i shpikur.", "Die Führungskraft fragte; die Person wählte. Das Beispiel ist erfunden.") },
        { type: "callout", reading: true, text: x(
          "The hardest question for a manager is not one of the four. It is the silence after the third one, when the answer is on the tip of your tongue.",
          "Pyetja më e vështirë për menaxherin nuk është asnjë nga të katërta. Është heshtja pas së tretës, kur përgjigjen e ke në majë të gjuhës.",
          "Die schwierigste Frage für eine Führungskraft ist keine der vier. Es ist das Schweigen nach der dritten, wenn einem die Antwort auf der Zunge liegt.") },
      ],
      note: x(
        "The questions are Google's (re:Work); the translation is ours.",
        "Pyetjet janë të Google (re:Work); përkthimi është yni.",
        "Die Fragen stammen von Google (re:Work); die Übersetzung ist unsere."),
      source: ["whitmore-1992", "rework-grow"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What coaching", "Çfarë ndryshon", "Was Coaching"), x("changes", "coaching-u", "verändert")],
      lead: x(
        "Two meta-analyses bring together the controlled studies of coaching at work. Both find clear positive effects, and both leave out the manager who coaches their own team.",
        "Dy meta-analiza bashkojnë studimet e kontrolluara për coaching-un në punë. Të dyja gjejnë efekte të qarta pozitive, dhe të dyja e lënë jashtë menaxherin që bën coaching me ekipin e vet.",
        "Zwei Metaanalysen fassen die kontrollierten Studien zu Coaching bei der Arbeit zusammen. Beide finden deutliche positive Wirkungen, und beide lassen die Führungskraft aus, die ihr eigenes Team coacht."),
      blocks: [
        { type: "hbars", max: 1.4, source: ["jones-2016"],
          label: x("Effect of workplace coaching, 17 studies (δ)", "Efekti i coaching-ut në punë, 17 studime (δ)", "Wirkung von Coaching bei der Arbeit, 17 Studien (δ)"),
          items: [
            { k: x("Overall", "Gjithsej", "Insgesamt"), v: 0.36, n: x("0.36", "0,36", "0,36") },
            { k: x("Skills", "Aftësitë", "Fähigkeiten"), v: 0.28, n: x("0.28", "0,28", "0,28") },
            { k: x("Attitudes and feelings", "Qëndrimet dhe ndjenjat", "Einstellungen und Gefühle"), v: 0.51, n: x("0.51", "0,51", "0,51") },
            { k: x("Individual results", "Rezultatet individuale", "Individuelle Ergebnisse"), v: 1.24, n: x("1.24", "1,24", "1,24") },
          ] },
        { type: "p", text: x(
          "Jones, Woods and Guillaume (2016) left out coaching by the manager and by peers, and found stronger effects with internal than with external coaches. Theeboom, Beersma and van Vianen (2014, 18 studies) found effects from g = 0.43 to 0.74, with trained coaches who had no formal authority over the person.",
          "Jones, Woods dhe Guillaume (2016) e lanë jashtë coaching-un nga menaxheri dhe nga kolegët, dhe gjetën efekte më të forta me coach të brendshëm se me coach të jashtëm. Theeboom, Beersma dhe van Vianen (2014, 18 studime) gjetën efekte nga g = 0,43 deri në 0,74, me coach të trajnuar që nuk kishin autoritet formal mbi personin.",
          "Jones, Woods und Guillaume (2016) ließen Coaching durch die Führungskraft und durch Kollegen aus und fanden stärkere Wirkungen mit internen als mit externen Coaches. Theeboom, Beersma und van Vianen (2014, 18 Studien) fanden Wirkungen von g = 0,43 bis 0,74, mit ausgebildeten Coaches ohne formale Macht über die Person.") },
        { type: "callout", reading: true, text: x(
          "For the manager as coach, the best evidence is still correlation: Gallup's surveys and Google's own data. That is a reason to measure your own team, not a reason to stop.",
          "Për menaxherin si coach, provat më të mira janë ende lidhje: anketat e Gallup dhe të dhënat e vetë Google. Kjo është arsye për të matur ekipin tënd, jo për të ndaluar.",
          "Für die Führungskraft als Coach sind die besten Belege noch Zusammenhänge: Gallups Umfragen und Googles eigene Daten. Das ist ein Grund, das eigene Team zu messen, kein Grund aufzuhören.") },
      ],
      note: x(
        "δ and g are effect sizes; by the usual convention 0.2 is small, 0.5 medium and 0.8 large.",
        "δ dhe g janë madhësi efekti; sipas konventës së zakonshme, 0,2 është i vogël, 0,5 mesatar dhe 0,8 i madh.",
        "δ und g sind Effektstärken; nach der üblichen Konvention ist 0,2 klein, 0,5 mittel und 0,8 groß."),
      source: ["jones-2016", "theeboom-2014"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Fifteen minutes", "Pesëmbëdhjetë minuta", "Fünfzehn Minuten"), x("a week", "në javë", "pro Woche")],
      lead: x(
        "Gallup describes five coaching conversations, from a few minutes to a review that looks back and ahead. The weekly one decides whether the others work.",
        "Gallup përshkruan pesë biseda coaching-u, nga disa minuta deri te një rishikim që shikon pas dhe përpara. Ajo javore vendos nëse funksionojnë të tjerat.",
        "Gallup beschreibt fünf Coaching-Gespräche, von wenigen Minuten bis zu einem Rückblick mit Ausblick. Das wöchentliche entscheidet, ob die anderen funktionieren."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Role and relationship", "Roli dhe marrëdhënia", "Rolle und Beziehung"), p: x("expectations and how you work together, at the start and when the role changes", "pritjet dhe si punoni bashkë, në fillim dhe kur ndryshon roli", "Erwartungen und Zusammenarbeit, am Anfang und wenn sich die Rolle ändert") },
          { h: x("Quick connect", "Lidhja e shpejtë", "Kurzer Kontakt"), p: x("a few minutes, every week", "disa minuta, çdo javë", "ein paar Minuten, jede Woche") },
          { h: x("Check-in", "Kontrolli", "Check-in"), p: x("a longer look at progress and obstacles", "një vështrim më i gjatë te ecuria dhe pengesat", "ein längerer Blick auf Fortschritt und Hindernisse") },
          { h: x("Developmental coaching", "Coaching për zhvillim", "Entwicklungscoaching"), p: x("around a project or a skill", "rreth një projekti ose një aftësie", "rund um ein Projekt oder eine Fähigkeit") },
          { h: x("Progress review", "Rishikimi i progresit", "Fortschrittsgespräch"), p: x("looking back and ahead, a few times a year", "shikim pas dhe përpara, disa herë në vit", "Rückblick und Ausblick, einige Male im Jahr") },
        ] },
        { type: "example", label: x("Hypothetical example, a team of eight", "Shembull hipotetik, një ekip me tetë veta", "Hypothetisches Beispiel, ein Team von acht Personen"), rows: [
          { k: x("Team", "Ekipi", "Team"), v: x("8 people", "8 veta", "8 Personen") },
          { k: x("Weekly conversation", "Biseda javore", "Wochengespräch"), v: x("20 minutes per person", "20 minuta për person", "20 Minuten pro Person") },
          { k: x("Total", "Gjithsej", "Insgesamt"), v: x("2 h 40 min a week", "2 orë e 40 minuta në javë", "2 Std. 40 Min. pro Woche") },
        ], text: x("About the length of one long meeting. The numbers are invented.", "Sa gjatësia e një takimi të gjatë. Numrat janë të shpikur.", "Etwa so lang wie eine lange Besprechung. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "Fifteen minutes is not much time. Fifty weeks of fifteen minutes is a working relationship.",
          "Pesëmbëdhjetë minuta nuk janë shumë kohë. Pesëdhjetë javë me nga pesëmbëdhjetë minuta janë një marrëdhënie pune.",
          "Fünfzehn Minuten sind nicht viel Zeit. Fünfzig Wochen mit je fünfzehn Minuten sind eine Arbeitsbeziehung.") },
      ],
      note: x(
        "The names of the five conversations are Gallup's; the descriptions are our summary. The example is the editors'.",
        "Emrat e pesë bisedave janë të Gallup; përshkrimet janë përmbledhja jonë. Shembulli është i redaksisë.",
        "Die Namen der fünf Gespräche stammen von Gallup; die Beschreibungen sind unsere Zusammenfassung. Das Beispiel stammt von der Redaktion."),
      source: ["gallup-conversations-2020", "gallup-habit"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("GROW card", "GROW", "GROW-Karte")],
      lead: x(
        "One card for one conversation. The person chooses the topic; you ask the four questions and write down only what they decide.",
        "Një kartë për një bisedë. Personi zgjedh temën; ti bën katër pyetjet dhe shkruan vetëm atë që vendos ai.",
        "Eine Karte für ein Gespräch. Die Person wählt das Thema; Sie stellen die vier Fragen und notieren nur, was sie entscheidet."),
      blocks: [
        { type: "form", items: [
          { h: x("Topic", "Tema", "Thema"), hint: x("chosen by the person", "e zgjedhur nga personi", "von der Person gewählt") },
          { h: x("Goal", "Qëllimi", "Ziel"), hint: x("what do you want?", "çfarë do?", "was willst du?") },
          { h: x("Reality", "Realiteti", "Realität"), hint: x("what is happening now?", "çfarë po ndodh tani?", "was passiert gerade?") },
          { h: x("Options", "Mundësitë", "Optionen"), hint: x("what could you do?", "çfarë mund të bësh?", "was könntest du tun?"), lines: 2 },
          { h: x("Will", "Vendimi", "Wille"), hint: x("what will you do, and by when?", "çfarë do të bësh, dhe deri kur?", "was wirst du tun, und bis wann?") },
          { h: x("Next conversation", "Biseda tjetër", "Nächstes Gespräch"), hint: x("date", "data", "Datum") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, with Google's GROW questions. The card belongs to the person, not to a file.",
        "Praktikë e propozuar nga redaksia, me pyetjet GROW të Google. Karta i përket personit, jo një dosjeje.",
        "Eine Praxis, die die Redaktion vorschlägt, mit Googles GROW-Fragen. Die Karte gehört der Person, nicht einer Akte."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
