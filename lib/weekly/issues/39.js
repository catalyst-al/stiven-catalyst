// Management Review, No. 39: Automation and the future of roles. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-39.md.
import { x, pc } from "../common.js";

export default {
  number: 39,
  block: "ai",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Automation and", "Automatizimi dhe", "Automatisierung und"), x("the future of roles", "e ardhmja e roleve", "die Zukunft der Rollen")],
  sub: x(
    "Who does the work tasks in 2030, which skills rise, which tasks machines take, who bears the change, how much of a role a computer could do, and a card for the tasks of a role.",
    "Kush i kryen detyrat e punës në 2030, cilat aftësi rriten, cilat detyra marrin makinat, kush e mban barrën e ndryshimit, sa nga një rol mund ta bëjë një kompjuter, dhe një kartë për detyrat e një roli.",
    "Wer 2030 die Arbeitsaufgaben erledigt, welche Fähigkeiten wachsen, welche Aufgaben Maschinen übernehmen, wen der Wandel trifft, wie viel einer Rolle ein Computer erledigen könnte, und eine Karte für die Aufgaben einer Rolle."),
  seo: x(
    "Automation and roles: who does the tasks by 2030, the skills on the rise, routine and non-routine work, who bears the change, and a task card.",
    "Automatizimi dhe rolet: kush i kryen detyrat deri në 2030, aftësitë që rriten, puna rutinë dhe jo rutinë, kush e mban ndryshimin, dhe karta e detyrave.",
    "Automatisierung und Rollen: wer die Aufgaben bis 2030 erledigt, wachsende Fähigkeiten, Routine und Nicht-Routine, wen der Wandel trifft, eine Aufgabenkarte."),
  feature: x(
    "Issue 39 starts with employers' forecast that by 2030 people, machines and both together will each do about a third of work tasks, sets out the skills on the rise, sorts tasks into routine and non-routine, asks who bore the change when robots and AI arrived, measures how much of an occupation a computer could do, and ends with a card for the tasks of a role.",
    "Numri 39 nis me parashikimin e punëdhënësve se deri në 2030 njerëzit, makinat dhe të dyja bashkë do të kryejnë secila rreth një të tretën e detyrave të punës, shtjellon aftësitë që rriten, i ndan detyrat në rutinë dhe jo rutinë, pyet kush e mbajti barrën kur erdhën robotët dhe AI-ja, mat sa nga një profesion mund ta bëjë një kompjuter, dhe mbyllet me një kartë për detyrat e një roli.",
    "Ausgabe 39 beginnt mit der Prognose von Arbeitgebern, dass bis 2030 Menschen, Maschinen und beide gemeinsam je etwa ein Drittel der Arbeitsaufgaben erledigen, stellt die wachsenden Fähigkeiten vor, teilt Aufgaben in Routine und Nicht-Routine, fragt, wen der Wandel traf, als Roboter und KI kamen, misst, wie viel eines Berufs ein Computer erledigen könnte, und endet mit einer Karte für die Aufgaben einer Rolle."),
  figure: { n: pc(22), by: "World Economic Forum, 2025", t: x(
    "of today's formal jobs are expected to be created or displaced between 2025 and 2030, by employers' forecasts.",
    "e vendeve formale të punës së sotme pritet të krijohen ose të zhvendosen mes 2025 dhe 2030, sipas parashikimeve të punëdhënësve.",
    "der heutigen formellen Arbeitsplätze sollen zwischen 2025 und 2030 neu entstehen oder wegfallen, nach den Prognosen der Arbeitgeber.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A third each by 2030", "Nga një e treta deri në 2030", "Je ein Drittel bis 2030") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Which tasks machines take", "Cilat detyra marrin makinat", "Welche Aufgaben Maschinen übernehmen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The task card of a role", "Karta e detyrave të një roli", "Die Aufgabenkarte einer Rolle") },
  ],
  sources: ["wef-jobs-2025", "autor-levy-murnane-2003", "oecd-eo-2023", "dauth-2021", "acemoglu-restrepo-2020", "brynjolfsson-canaries-2026", "iab-substitution-2024"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Automation rarely removes a whole job at once. It takes over tasks, and the role around them changes. This issue asks which tasks move, which skills rise, and what the manager of a warehouse, delivery or hotel team can do.",
        "Automatizimi rrallë e heq një punë të tërë menjëherë. Merr përsipër detyra, dhe roli rreth tyre ndryshon. Ky numër pyet cilat detyra kalojnë te makinat, cilat aftësi rriten, dhe çfarë mund të bëjë drejtuesi i një ekipi magazine, shpërndarjeje ose hoteli.",
        "Automatisierung beseitigt selten eine ganze Stelle auf einmal. Sie übernimmt Aufgaben, und die Rolle darum herum verändert sich. Diese Ausgabe fragt, welche Aufgaben wandern, welche Fähigkeiten wachsen und was die Führung eines Lager-, Zustell- oder Hotelteams tun kann."),
      body: x(
        "Employers surveyed by the World Economic Forum expect people alone to do a third of work tasks by 2030, down from 47%, and count AI, leadership and talent management among the skills on the rise. A 2003 study shows which tasks computers take: those that follow explicit rules. In Germany, robots hit new entrants rather than the workers already in place, and a 2026 US study sees a similar pattern with AI. The IAB finds that a computer could do 61% of the core tasks in transport and logistics.",
        "Punëdhënësit e anketuar nga World Economic Forum presin që deri në 2030 njerëzit vetëm të kryejnë një të tretën e detyrave të punës, nga 47% sot, dhe e vënë AI-në, drejtimin dhe menaxhimin e talenteve mes aftësive që rriten. Një studim i 2003 tregon cilat detyra marrin kompjuterët: ato që ndjekin rregulla të qarta. Në Gjermani, robotët goditën të sapoardhurit, jo ata që punonin tashmë, dhe një studim i 2026 në SHBA sheh një model të ngjashëm me AI-në. IAB gjen se një kompjuter mund të bëjë 61% të detyrave kryesore në transport dhe logjistikë.",
        "Die vom World Economic Forum befragten Arbeitgeber erwarten, dass Menschen allein bis 2030 ein Drittel der Arbeitsaufgaben erledigen, heute 47 %, und zählen KI, Führung und Talentmanagement zu den wachsenden Fähigkeiten. Eine Studie von 2003 zeigt, welche Aufgaben Computer übernehmen: solche, die festen Regeln folgen. In Deutschland trafen Roboter die Neuen, nicht die bereits Beschäftigten, und eine US-Studie von 2026 sieht bei KI ein ähnliches Muster. Laut IAB könnte ein Computer 61 % der Kerntätigkeiten in Verkehr und Logistik erledigen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A third each", "Nga një e treta", "Je ein Drittel"), x("by 2030", "deri në 2030", "bis 2030")],
      lead: x(
        "For its Future of Jobs Report 2025, the World Economic Forum asked more than 1,000 employers, with over 14 million workers in 55 economies, who does the work tasks today and who will do them in 2030: people, technology, or the two together.",
        "Për Future of Jobs Report 2025, World Economic Forum pyeti mbi 1.000 punëdhënës me mbi 14 milionë punonjës në 55 ekonomi kush i kryen detyrat sot dhe kush në 2030: njerëzit, teknologjia, apo të dyja bashkë.",
        "Für seinen Future of Jobs Report 2025 fragte das World Economic Forum über 1.000 Arbeitgeber mit mehr als 14 Millionen Beschäftigten in 55 Volkswirtschaften, wer die Arbeitsaufgaben heute erledigt und wer 2030: Menschen, Technik oder beide gemeinsam."),
      blocks: [
        { type: "pairs", from: x("Now", "Sot", "Heute"), to: x("By 2030", "Deri në 2030", "Bis 2030"), max: 50, source: ["wef-jobs-2025"],
          label: x("Share of work tasks done mainly by…, employers' estimates", "Pjesa e detyrave të punës që i kryejnë kryesisht…, sipas punëdhënësve", "Anteil der Arbeitsaufgaben, die vor allem erledigt werden von …, nach Arbeitgebern"),
          rows: [
            { k: x("People alone", "Njerëzit vetëm", "Menschen allein"), a: 47, an: pc(47), b: 33, bn: pc(33), alert: true },
            { k: x("People and technology together", "Njerëzit dhe teknologjia bashkë", "Menschen und Technik gemeinsam"), a: 30, an: pc(30), b: 33, bn: pc(33) },
            { k: x("Technology", "Teknologjia", "Technik"), a: 22, an: pc(22), b: 34, bn: pc(34) },
          ] },
        { type: "p", text: x(
          "Employers expect 170 million jobs to be created and 92 million displaced by 2030, a churn of 22% of 1.2 billion formal jobs. Delivery drivers and general and operations managers are among the roles growing most in numbers; stock-keeping clerks, cashiers, cleaners and housekeepers among those shrinking most.",
          "Punëdhënësit presin që deri në 2030 të krijohen 170 milionë vende pune dhe të zhvendosen 92 milionë, një qarkullim prej 22% të 1,2 miliardë vendeve formale. Shoferët e shpërndarjes dhe menaxherët e përgjithshëm e të operacioneve janë mes roleve që rriten më shumë në numër; nëpunësit e magazinës, arkëtarët, pastruesit dhe punonjësit e housekeeping-ut mes atyre që tkurren më shumë.",
          "Bis 2030 erwarten die Arbeitgeber 170 Millionen neue und 92 Millionen wegfallende Stellen, ein Umschlag von 22 % der 1,2 Milliarden formellen Arbeitsplätze. Zustellfahrer sowie allgemeine und operative Führungskräfte gehören zu den Rollen, die zahlenmäßig am stärksten wachsen; Lagerbürokräfte, Kassierer, Reinigungs- und Housekeeping-Kräfte zu denen, die am stärksten schrumpfen.") },
        { type: "callout", reading: true, text: x(
          "The forecast is less about jobs that vanish than about the same jobs done with a different mix of tasks.",
          "Parashikimi flet më pak për punë që zhduken e më shumë për të njëjtat punë me një përzierje tjetër detyrash.",
          "Die Prognose handelt weniger von Stellen, die verschwinden, als von denselben Stellen mit einer anderen Mischung von Aufgaben.") },
      ],
      note: x(
        "Employers' expectations, not measurements; shares of tasks, not of the amount of work. The net gain is 78 million jobs. 47 + 30 + 22 = 99 because of rounding.",
        "Pritshmëri të punëdhënësve, jo matje; pjesë të detyrave, jo të sasisë së punës. Shtesa neto është 78 milionë vende pune. 47 + 30 + 22 = 99 nga rrumbullakimi.",
        "Erwartungen der Arbeitgeber, keine Messungen; Anteile an Aufgaben, nicht an der Arbeitsmenge. Netto entstehen 78 Millionen Stellen. 47 + 30 + 22 = 99 wegen Rundung."),
      source: ["wef-jobs-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The skills", "Aftësitë", "Die Fähigkeiten"), x("on the rise", "që rriten", "im Aufwind")],
      lead: x(
        "The same employers said which skills will matter more or less by 2030. The net figure is the share expecting a skill to grow minus the share expecting it to shrink.",
        "Të njëjtët punëdhënës thanë cilat aftësi do të kenë më shumë ose më pak rëndësi deri në 2030. Shifra neto është pjesa që pret rritjen e aftësisë, minus pjesën që pret rënien e saj.",
        "Dieselben Arbeitgeber gaben an, welche Fähigkeiten bis 2030 wichtiger oder unwichtiger werden. Der Nettowert ist der Anteil, der einen Zuwachs erwartet, minus den Anteil, der einen Rückgang erwartet."),
      blocks: [
        { type: "hbars", max: 100, source: ["wef-jobs-2025"],
          label: x("Skills growing in importance, 2025–2030, net share of employers (points)", "Aftësitë që rriten në rëndësi, 2025–2030, pjesa neto e punëdhënësve (pikë)", "Fähigkeiten mit wachsender Bedeutung, 2025–2030, Nettoanteil der Arbeitgeber (Punkte)"),
          items: [
            { k: x("AI and big data", "AI dhe të dhënat e mëdha", "KI und Big Data"), v: 87, n: "87" },
            { k: x("Resilience, flexibility and agility", "Qëndrueshmëria, fleksibiliteti dhe shkathtësia", "Resilienz, Flexibilität und Agilität"), v: 66, n: "66" },
            { k: x("Leadership and social influence", "Drejtimi dhe ndikimi te të tjerët", "Führung und sozialer Einfluss"), v: 58, n: "58", alert: true },
            { k: x("Talent management", "Menaxhimi i talenteve", "Talentmanagement"), v: 58, n: "58", alert: true },
            { k: x("Service orientation and customer service", "Orientimi te shërbimi dhe shërbimi ndaj klientit", "Serviceorientierung und Kundenservice"), v: 41, n: "41" },
            { k: x("Resource management and operations", "Menaxhimi i burimeve dhe operacionet", "Ressourcenmanagement und Betrieb"), v: 24, n: "24" },
          ] },
        { type: "p", text: x(
          "Only two skills fall on balance, most of all manual dexterity, endurance and precision (−24). Of every 100 workers, 59 would need training by 2030: 29 could be upskilled in their role, 19 moved to another role, and 11 would probably not get the training they need.",
          "Vetëm dy aftësi bien në bilanc, më së shumti shkathtësia e duarve, qëndresa dhe saktësia (−24). Nga çdo 100 punonjës, 59 do të kishin nevojë për trajnim deri në 2030: 29 mund të kualifikohen më tej në rolin e tyre, 19 të kalojnë në një rol tjetër, dhe 11 ka gjasa të mos e marrin trajnimin që u duhet.",
          "Nur zwei Fähigkeiten verlieren unter dem Strich, am stärksten Fingerfertigkeit, Ausdauer und Präzision (−24). Von je 100 Beschäftigten bräuchten 59 bis 2030 eine Weiterbildung: 29 könnten in ihrer Rolle weiterqualifiziert, 19 in eine andere Rolle versetzt werden, und 11 bekämen die nötige Schulung wahrscheinlich nicht.") },
        { type: "callout", reading: true, text: x(
          "Next to technology, leadership and talent management rise almost as fast. Someone has to rebuild the team around the new tasks.",
          "Krahas teknologjisë, drejtimi dhe menaxhimi i talenteve rriten pothuajse po aq shpejt. Dikush duhet ta rindërtojë ekipin rreth detyrave të reja.",
          "Neben der Technik wachsen Führung und Talentmanagement fast genauso schnell. Jemand muss das Team um die neuen Aufgaben herum neu aufstellen.") },
      ],
      note: x(
        "Employers' expectations (Future of Jobs Survey 2024), not measurements of skills. The six of 26 skills shown are our choice.",
        "Pritshmëri të punëdhënësve (Future of Jobs Survey 2024), jo matje të aftësive. Gjashtë aftësitë nga 26 i zgjodhëm ne.",
        "Erwartungen der Arbeitgeber (Future of Jobs Survey 2024), keine Messung von Fähigkeiten. Die sechs von 26 Fähigkeiten hat die Redaktion ausgewählt."),
      source: ["wef-jobs-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Which tasks", "Cilat detyra", "Welche Aufgaben"), x("machines take", "marrin makinat", "Maschinen übernehmen")],
      lead: x(
        "In 2003 David Autor, Frank Levy and Richard Murnane argued that computers substitute for people in tasks that can be done by following explicit rules, and complement them in non-routine problem-solving and complex communication.",
        "Në 2003, David Autor, Frank Levy dhe Richard Murnane argumentuan se kompjuterët i zëvendësojnë njerëzit te detyrat që ndjekin rregulla të qarta, dhe i plotësojnë te zgjidhja e problemeve jo rutinë dhe te komunikimi kompleks.",
        "2003 argumentierten David Autor, Frank Levy und Richard Murnane, dass Computer Menschen bei Aufgaben ersetzen, die sich nach festen Regeln erledigen lassen, und sie bei nicht routinemäßiger Problemlösung und komplexer Kommunikation ergänzen."),
      blocks: [
        { type: "matrix", y: x("Follows explicit rules", "Ndjek rregulla të qarta", "Folgt festen Regeln"), x: x("Manual to analytic work", "Nga puna fizike te ajo analitike", "Von manueller zu analytischer Arbeit"), cells: [
          { h: x("Routine manual", "Rutinë fizike", "Routine, manuell"), tone: "red", where: x("rule-based · manual", "me rregulla · fizike", "regelbasiert · manuell"), p: x("Picking or sorting, repetitive assembly. Substantial substitution.", "Mbledhja ose renditja e mallrave, montimi i përsëritur. Zëvendësim i madh.", "Kommissionieren oder Sortieren, wiederholte Montage. Starke Ersetzung.") },
          { h: x("Routine cognitive", "Rutinë mendore", "Routine, kognitiv"), tone: "red", where: x("rule-based · analytic", "me rregulla · analitike", "regelbasiert · analytisch"), p: x("Record-keeping, calculation, repetitive customer service. Substantial substitution.", "Regjistrat, llogaritjet, shërbimi rutinë ndaj klientit. Zëvendësim i madh.", "Buchführung, Rechnen, wiederholter Kundenservice. Starke Ersetzung.") },
          { h: x("Non-routine manual", "Jo rutinë fizike", "Nicht-Routine, manuell"), tone: "dim", where: x("no fixed rule · manual", "pa rregull · fizike", "ohne Regel · manuell"), p: x("Janitorial work, truck driving. Little substitution or support.", "Pastrimi i ndërtesave, drejtimi i kamionit. Pak zëvendësim ose ndihmë.", "Reinigung und Hausmeisterdienste, Lkw fahren. Wenig Ersetzung oder Unterstützung.") },
          { h: x("Non-routine cognitive", "Jo rutinë mendore", "Nicht-Routine, kognitiv"), tone: "blue", where: x("no fixed rule · analytic", "pa rregull · analitike", "ohne Regel · analytisch"), p: x("Testing ideas, selling, managing others. Strong complementarity.", "Provimi i ideve, shitja, drejtimi i të tjerëve. Plotësim i fortë.", "Ideen prüfen, verkaufen, andere führen. Starke Ergänzung.") },
        ] },
        { type: "p", text: x(
          "In US data from 1960 to 1998, computerisation went with less routine work and more non-routine cognitive work, even within occupations of the same name. The OECD saw the same with AI in 2023: employers were about twice as likely to say AI had automated repetitive tasks as created them.",
          "Te të dhënat e SHBA-së nga 1960 deri në 1998, kompjuterizimi solli më pak punë rutinë dhe më shumë punë mendore jo rutinë, edhe brenda profesioneve me të njëjtin emër. OECD pa të njëjtën gjë me AI-në në 2023: punëdhënësit thoshin rreth dy herë më shpesh se AI kishte automatizuar detyra të përsëritura sesa se i kishte krijuar.",
          "In US-Daten von 1960 bis 1998 ging die Computerisierung mit weniger Routinearbeit und mehr nicht routinemäßiger kognitiver Arbeit einher, auch in Berufen mit gleichem Namen. Die OECD sah 2023 dasselbe bei KI: Arbeitgeber sagten etwa doppelt so oft, KI habe repetitive Aufgaben automatisiert, wie dass sie welche geschaffen habe.") },
        { type: "callout", reading: true, text: x(
          "For a team, the useful question is not whether a job disappears but which of its tasks follow a rule a machine can read.",
          "Për një ekip, pyetja e dobishme nuk është nëse zhduket një punë, por cilat nga detyrat e saj ndjekin një rregull që e lexon makina.",
          "Für ein Team zählt nicht, ob eine Stelle verschwindet, sondern welche ihrer Aufgaben einer Regel folgen, die eine Maschine lesen kann.") },
      ],
      note: x(
        "Examples and effects are those of the 2003 study, written for computers before generative AI.",
        "Shembujt dhe efektet janë ato të studimit të 2003, të shkruara për kompjuterët, para AI-së gjeneruese.",
        "Beispiele und Wirkungen stammen aus der Studie von 2003 und galten Computern, noch vor der generativen KI."),
      source: ["autor-levy-murnane-2003", "oecd-eo-2023"],
    },
    {
      id: "research", more: "watch-how-i-do-it-is-not-training",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Who bears", "Kush e mban", "Wen der Wandel"), x("the change", "ndryshimin", "trifft")],
      lead: x(
        "Wolfgang Dauth and colleagues followed German workers from 1994 to 2014, as robots spread through industry. Robots cost manufacturing jobs; new service jobs fully offset them.",
        "Wolfgang Dauth dhe kolegët ndoqën punonjësit gjermanë nga 1994 deri në 2014, ndërsa robotët përhapeshin në industri. Robotët hoqën vende pune në prodhim; vendet e reja në shërbime i kompensuan plotësisht.",
        "Wolfgang Dauth und Kollegen begleiteten deutsche Beschäftigte von 1994 bis 2014, als sich Roboter in der Industrie ausbreiteten. Roboter kosteten Industriejobs; neue Dienstleistungsjobs glichen das vollständig aus."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Germany, robots", "Gjermani, robotët", "Deutschland, Roboter"), p: x("Workers in place mostly stayed and took on new tasks in the same plant. Young entrants bore the loss.", "Të punësuarit kryesisht mbetën dhe morën detyra të reja në të njëjtën uzinë. Humbjen e mbajtën të rinjtë që hynin në punë.", "Die Beschäftigten blieben meist und übernahmen im selben Betrieb neue Aufgaben. Den Verlust trugen junge Berufseinsteiger.") },
          { h: x("US, robots", "SHBA, robotët", "USA, Roboter"), p: x("Each extra robot per 1,000 workers cut the employment-to-population ratio by 0.2 percentage points and wages by 0.42%.", "Çdo robot shtesë për 1.000 punonjës e uli raportin punësim–popullsi me 0,2 pikë dhe pagat me 0,42%.", "Jeder zusätzliche Roboter je 1.000 Beschäftigte senkte die Beschäftigungsquote um 0,2 Punkte und die Löhne um 0,42 %.") },
          { h: x("US, AI, 2026", "SHBA, AI, 2026", "USA, KI, 2026"), p: x("Employment of 22- to 25-year-olds in AI-exposed jobs is 19% behind the path of less exposed peers, mostly through less hiring.", "Punësimi i të rinjve 22–25 vjeç në punët e ekspozuara ndaj AI-së është 19% pas rrugës së moshatarëve më pak të ekspozuar, kryesisht nga më pak punësime.", "Die Beschäftigung 22- bis 25-Jähriger in KI-exponierten Berufen liegt 19 % hinter dem Pfad weniger exponierter Gleichaltriger, vor allem durch weniger Einstellungen.") },
        ] },
        { type: "p", text: x(
          "In the OECD's 2022 surveys and interviews, many early AI adopters adjusted through slower hiring, quits and retirement rather than dismissals. Where firms consulted them, workers were 9 points more likely to say AI had improved their health and safety.",
          "Në anketat dhe intervistat e OECD-së në 2022, shumë nga firmat e para me AI u përshtatën me më pak punësime, largime vullnetare dhe pension, jo me pushime nga puna. Aty ku firmat i pyetën punonjësit, këta kishin 9 pikë më shumë gjasa të thoshin se AI ua kishte përmirësuar shëndetin dhe sigurinë.",
          "In den Umfragen und Interviews der OECD von 2022 passten sich viele frühe KI-Anwender über weniger Einstellungen, Abgänge und Ruhestand an statt über Kündigungen. Wo Firmen die Beschäftigten befragten, sagten diese um 9 Punkte häufiger, KI habe ihre Gesundheit und Sicherheit verbessert.") },
        { type: "callout", reading: true, text: x(
          "The change shows first in the role that is never posted. For the team already there, it shows as new tasks, and someone has to teach them.",
          "Ndryshimi duket së pari te roli që nuk shpallet më. Për ekipin që është aty, duket si detyra të reja, dhe dikush duhet t'ia mësojë.",
          "Der Wandel zeigt sich zuerst in der Stelle, die nie ausgeschrieben wird. Für das Team, das schon da ist, zeigt er sich als neue Aufgaben, und jemand muss sie ihm beibringen.") },
      ],
      note: x(
        "Robots in industry are not AI in services, and the Germany–US gap has several possible causes. The 2026 figures and the OECD link are correlations, not proof of cause.",
        "Robotët në industri nuk janë AI në shërbime, dhe dallimi Gjermani–SHBA ka disa shkaqe të mundshme. Shifrat e 2026 dhe lidhja e OECD-së janë korrelacione, jo prova shkaku.",
        "Roboter in der Industrie sind keine KI in Dienstleistungen, und der Unterschied zwischen Deutschland und den USA hat mehrere mögliche Ursachen. Die Zahlen von 2026 und der OECD-Zusammenhang sind Korrelationen, keine Kausalbelege."),
      source: ["dauth-2021", "acemoglu-restrepo-2020", "brynjolfsson-canaries-2026", "oecd-eo-2023"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("How much of a role", "Sa nga një rol", "Wie viel einer Rolle"), x("a computer could do", "mund ta bëjë një kompjuter", "ein Computer erledigen könnte")],
      lead: x(
        "Since 2013 the IAB, research institute of Germany's Federal Employment Agency, has asked of each core task of every occupation: could a computer or computer-controlled machine do it fully automatically? Their share is the substitution potential.",
        "Që nga 2013, IAB, instituti kërkimor i Agjencisë Federale të Punësimit në Gjermani, pyet për çdo detyrë kryesore të çdo profesioni: a mund ta kryejë plotësisht vetë një kompjuter ose një makinë e drejtuar prej tij? Pjesa e tyre është potenciali i zëvendësimit.",
        "Seit 2013 prüft das IAB, Forschungsinstitut der Bundesagentur für Arbeit, jede Kerntätigkeit jedes Berufs: Könnte ein Computer oder eine computergesteuerte Maschine sie vollautomatisch erledigen? Ihr Anteil ist das Substituierbarkeitspotenzial."),
      blocks: [
        { type: "hbars", max: 100, source: ["iab-substitution-2024"],
          label: x("Core tasks a computer could do, Germany, 2022 (%)", "Detyrat kryesore që mund t'i bëjë një kompjuter, Gjermani, 2022 (%)", "Kerntätigkeiten, die ein Computer erledigen könnte, Deutschland, 2022 (%)"),
          items: [
            { k: x("Manufacturing", "Prodhimi", "Fertigungsberufe"), v: 87.9, n: x("87.9", "87,9", "87,9") },
            { k: x("Management and organisation", "Drejtimi dhe organizimi", "Unternehmensführung, -organisation"), v: 68, n: x("68.0", "68,0", "68,0") },
            { k: x("Transport and logistics", "Transporti dhe logjistika", "Verkehr und Logistik"), v: 61.2, n: x("61.2", "61,2", "61,2"), alert: true },
            { k: x("Food and hospitality", "Ushqimi dhe hotelieria", "Lebensmittel und Gastgewerbe"), v: 49.5, n: x("49.5", "49,5", "49,5"), alert: true },
            { k: x("Health care", "Shëndetësia", "Gesundheitsberufe"), v: 26.5, n: x("26.5", "26,5", "26,5") },
          ] },
        { type: "p", text: x(
          "In 2022, 38% of employees subject to social insurance worked in occupations where over 70% of core tasks could be automated (34% in 2019). For hotel management assistants, the share rose from 50% to 67%.",
          "Në 2022, 38% e të punësuarve me sigurime shoqërore punonin në profesione ku mbi 70% e detyrave kryesore mund të automatizoheshin (34% në 2019). Për asistentët e menaxhimit të hotelit, pjesa u rrit nga 50% në 67%.",
          "2022 arbeiteten 38 % der sozialversicherungspflichtig Beschäftigten in Berufen, in denen über 70 % der Kerntätigkeiten automatisierbar wären (2019: 34 %). Bei Assistenten im Hotelmanagement stieg der Anteil von 50 % auf 67 %.") },
        { type: "example", label: x("Hypothetical example, a delivery-station dispatcher", "Shembull hipotetik, dispeçeri i një stacioni shpërndarjeje", "Hypothetisches Beispiel, Disposition einer Zustellstation"), rows: [
          { k: x("Core tasks", "Detyrat kryesore", "Kerntätigkeiten"), v: x("10; a system could do 4 in full: 40%", "10; një sistem mund të bëjë plotësisht 4: 40%", "10; ein System könnte 4 ganz erledigen: 40 %") },
          { k: x("Hours", "Orët", "Stunden"), v: x("the 4 take 22 of 40 weekly hours: 55%", "këto 4 marrin 22 nga 40 orë në javë: 55%", "die 4 belegen 22 von 40 Wochenstunden: 55 %") },
        ], text: x("The role and the hours are invented.", "Roli dhe orët janë të shpikura.", "Rolle und Stunden sind erfunden.") },
      ],
      note: x(
        "Technical feasibility, not a forecast of job losses. The IAB weights core tasks equally, blind to their hours; the example shows why hours matter.",
        "Mundësi teknike, jo parashikim i humbjes së vendeve të punës. IAB i peshon njësoj detyrat kryesore, pa ua parë orët; shembulli tregon pse orët kanë rëndësi.",
        "Technische Machbarkeit, keine Prognose von Stellenverlusten. Das IAB gewichtet alle Kerntätigkeiten gleich, da es ihre Dauer nicht kennt; das Beispiel zeigt, warum Stunden zählen."),
      source: ["iab-substitution-2024"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The task card", "Karta e detyrave", "Die Aufgabenkarte"), x("of a role", "të një roli", "einer Rolle")],
      lead: x(
        "One card per role, filled in with the people who do it. List the tasks with their hours a week, then sort them: a few tasks usually take most of the time, and that is where to look first.",
        "Një kartë për çdo rol, e plotësuar me njerëzit që e bëjnë. Shkruaj detyrat me orët që marrin në javë, pastaj renditi: zakonisht pak detyra marrin shumicën e kohës, dhe aty duhet parë së pari.",
        "Eine Karte pro Rolle, ausgefüllt mit den Menschen, die sie ausüben. Die Aufgaben mit ihren Wochenstunden auflisten und sortieren: Meist belegen wenige Aufgaben den Großteil der Zeit, und dort schaut man zuerst hin."),
      blocks: [
        { type: "form", items: [
          { h: x("Role", "Roli", "Rolle"), hint: x("the role, how many people do it, who filled in the card", "roli, sa veta e bëjnë, kush e plotësoi kartën", "die Rolle, wie viele sie ausüben, wer die Karte ausgefüllt hat") },
          { h: x("Tasks and hours", "Detyrat dhe orët", "Aufgaben und Stunden"), hint: x("every core task, hours a week, the largest first", "çdo detyrë kryesore, orët në javë, më e madhja e para", "jede Kerntätigkeit, Stunden pro Woche, die größte zuerst") },
          { h: x("Rule or judgement", "Rregull apo gjykim", "Regel oder Urteil"), hint: x("does it follow an explicit rule? manual or analytic?", "a ndjek një rregull të qartë? fizike apo analitike?", "folgt sie einer festen Regel? manuell oder analytisch?") },
          { h: x("What a machine could do", "Çfarë mund të bëjë një makinë", "Was eine Maschine tun könnte"), hint: x("in full, in part or not at all, and with which system", "plotësisht, pjesërisht apo aspak, dhe me cilin sistem", "ganz, teilweise oder gar nicht, und mit welchem System") },
          { h: x("What the person does instead", "Çfarë bën njeriu në vend të saj", "Was die Person stattdessen tut"), hint: x("the new task, or what the freed hours go to", "detyra e re, ose ku shkojnë orët që lirohen", "die neue Aufgabe, oder wofür die frei werdenden Stunden dienen") },
          { h: x("Skill and training", "Aftësia dhe trajnimi", "Fähigkeit und Schulung"), hint: x("what to learn, who teaches it, by when; who on the team was asked", "çfarë duhet mësuar, kush e mëson, deri kur; kë pyete nga ekipi", "was zu lernen ist, wer es beibringt, bis wann; wen im Team man gefragt hat") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the task model of Autor, Levy & Murnane (2003), the IAB method (2024) and the OECD finding that outcomes are better where workers are trained and consulted (2023).",
        "Praktikë e propozuar nga redaksia, sipas modelit të detyrave të Autor-it, Levy-t dhe Murnane-it (2003), metodës së IAB (2024) dhe gjetjes së OECD-së se rezultatet janë më të mira aty ku punonjësit trajnohen dhe pyeten (2023).",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem Aufgabenmodell von Autor, Levy & Murnane (2003), der IAB-Methode (2024) und dem OECD-Befund, dass die Ergebnisse besser sind, wo Beschäftigte geschult und befragt werden (2023)."),
      source: ["autor-levy-murnane-2003", "iab-substitution-2024", "oecd-eo-2023"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
