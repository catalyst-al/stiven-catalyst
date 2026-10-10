// Management Review, No. 49: After Action Review: what did we learn from this. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-49.md.
import { x, pc } from "../common.js";

export default {
  number: 49,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("After Action Review:", "After Action Review:", "After Action Review:"), x("what did we learn from this", "çfarë mësuam nga kjo", "was wir daraus gelernt haben")],
  sub: x(
    "An opponent that almost always wins, a review that is not a critique, what 46 samples of debriefs show, four questions before and after, why to review successes too, and a sheet for your own review.",
    "Një kundërshtar që fiton pothuajse gjithmonë, një rishikim që nuk është kritikë, çfarë tregojnë 46 mostra rishikimesh, katër pyetje para dhe pas, pse rishikohen edhe sukseset, dhe një fletë për rishikimin tënd.",
    "Ein Gegner, der fast immer gewinnt, eine Auswertung, die keine Kritik ist, was 46 Stichproben von Nachbesprechungen zeigen, vier Fragen davor und danach, warum man auch Erfolge auswertet, und ein Blatt für die eigene Auswertung."),
  seo: x(
    "After Action Review: the Army's guide, an opponent that almost always wins, debriefs worth about 25%, why to review successes too, and a sheet.",
    "After Action Review: udhëzuesi i ushtrisë, një kundërshtar që fiton pothuajse gjithmonë, rreth 25% më mirë, pse rishikohen edhe sukseset, dhe një fletë.",
    "After Action Review: der Leitfaden der Armee, ein Gegner, der fast immer gewinnt, rund 25 % besser, warum auch Erfolge zählen, und ein Blatt."),
  feature: x(
    "Issue 49 starts with the US Army's Opposing Force, which almost always beats the brigades sent to train against it, reads the Army's 1993 guide that says an after-action review is not a critique, checks what a meta-analysis of 46 samples found about debriefs, sets out the four questions before and after the action, follows soldiers who also reviewed their successes, asks when a lesson counts as learned, and ends with a sheet for your own review.",
    "Numri 49 nis me Forcën Kundërshtare të ushtrisë amerikane, që pothuajse gjithmonë i mund brigadat që vijnë të stërviten kundër saj, lexon udhëzuesin e ushtrisë të 1993, sipas të cilit rishikimi pas veprimit nuk është kritikë, kontrollon çfarë gjeti një meta-analizë e 46 mostrave për bisedat pas veprimit, shtjellon katër pyetjet para dhe pas veprimit, ndjek ushtarë që rishikuan edhe sukseset e tyre, pyet kur quhet i mësuar një mësim, dhe mbyllet me një fletë për rishikimin tënd.",
    "Ausgabe 49 beginnt mit der Opposing Force der US-Armee, die die Brigaden, die gegen sie üben, fast immer schlägt, liest den Leitfaden der Armee von 1993, nach dem eine After Action Review keine Kritik ist, prüft, was eine Metaanalyse von 46 Stichproben über Nachbesprechungen fand, stellt die vier Fragen vor und nach dem Einsatz vor, begleitet Soldaten, die auch ihre Erfolge auswerteten, fragt, wann eine Lehre als gelernt gilt, und endet mit einem Blatt für die eigene Auswertung."),
  figure: { n: pc(25), by: "Tannenbaum & Cerasoli, 2013", t: x(
    "better performance, on average, for teams and individuals who debriefed than for control groups, across 46 samples.",
    "performancë më e mirë, mesatarisht, për ekipet dhe individët që e rishikuan punën pas veprimit, krahasuar me grupet e kontrollit, në 46 mostra.",
    "bessere Leistung im Schnitt bei Teams und Einzelnen mit Nachbesprechung als bei Kontrollgruppen, über 46 Stichproben.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Not a critique", "Nuk është kritikë", "Keine Kritik") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Review the successes too", "Rishiko edhe sukseset", "Auch Erfolge auswerten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The after-action review sheet", "Fleta e rishikimit pas veprimit", "Das Blatt für die After Action Review") },
  ],
  sources: ["aar-darling-2005", "aar-army-tc2520-1993", "aar-army-guide-2013", "aar-tannenbaum-2013", "aar-keiser-arthur-2021", "aar-ellis-davidi-2005"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most teams finish a job and go straight on to the next one. This issue is about the short meeting in between: what was supposed to happen, what did happen, why, and what changes next time.",
        "Shumica e ekipeve e mbarojnë një punë dhe kalojnë menjëherë te tjetra. Ky numër flet për takimin e shkurtër që duhet të ketë mes tyre: çfarë duhej të ndodhte, çfarë ndodhi, pse, dhe çfarë ndryshon herën tjetër.",
        "Die meisten Teams schließen eine Aufgabe ab und gehen direkt zur nächsten über. Diese Ausgabe handelt von dem kurzen Treffen dazwischen: Was sollte passieren, was ist passiert, warum, und was ändert sich beim nächsten Mal."),
      body: x(
        "The US Army's Opposing Force almost always beats the brigades that come to train against it, and Marilyn Darling and colleagues traced that to its after-action reviews. The Army's 1993 guide defines the review and insists that it is not a critique. A meta-analysis of 46 samples put the average gain from debriefs at about 25%. Soldiers who reviewed their successes as well as their failures improved faster. And a lesson, in the Opposing Force's view, counts as learned only once it has been applied.",
        "Forca Kundërshtare e ushtrisë amerikane pothuajse gjithmonë i mund brigadat që vijnë të stërviten kundër saj, dhe Marilyn Darling me kolegët e lidhin këtë me rishikimet pas veprimit. Udhëzuesi i ushtrisë i 1993 e përkufizon rishikimin dhe ngul këmbë se nuk është kritikë. Një meta-analizë e 46 mostrave e vuri përfitimin mesatar të bisedave pas veprimit në rreth 25%. Ushtarët që rishikuan edhe sukseset, jo vetëm dështimet, u përmirësuan më shpejt. Dhe një mësim, sipas Forcës Kundërshtare, quhet i mësuar vetëm pasi është zbatuar.",
        "Die Opposing Force der US-Armee schlägt die Brigaden, die gegen sie üben, fast immer, und Marilyn Darling und Kollegen führen das auf ihre After Action Reviews zurück. Der Leitfaden der Armee von 1993 definiert die Auswertung und betont, dass sie keine Kritik ist. Eine Metaanalyse von 46 Stichproben bezifferte den durchschnittlichen Gewinn durch Nachbesprechungen auf rund 25 %. Soldaten, die neben ihren Fehlern auch ihre Erfolge auswerteten, verbesserten sich schneller. Und eine Lehre gilt bei der Opposing Force erst dann als gelernt, wenn sie angewandt wurde."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Not a", "Nuk është", "Keine"), x("critique", "kritikë", "Kritik")],
      lead: x(
        "In the California desert, the US Army keeps a standing Opposing Force of 2,500 soldiers. Every month a fresh brigade of more than 4,000 takes it on, with more resources and better data, and it knows the Opposing Force's methods from earlier campaigns. Yet, wrote Marilyn Darling, Charles Parry and Joseph Moore in 2005, the Opposing Force almost always wins.",
        "Në shkretëtirën e Kalifornisë, ushtria amerikane mban një Forcë Kundërshtare të përhershme me 2.500 ushtarë. Çdo muaj i del përballë një brigadë e re me më shumë se 4.000 ushtarë, me më shumë burime e të dhëna më të mira, dhe duke i njohur metodat e saj nga fushatat e mëparshme. E megjithatë, shkruan Marilyn Darling, Charles Parry dhe Joseph Moore në 2005, Forca Kundërshtare fiton pothuajse gjithmonë.",
        "In der kalifornischen Wüste unterhält die US-Armee eine ständige Opposing Force mit 2.500 Soldaten. Jeden Monat tritt eine neue Brigade mit mehr als 4.000 Soldaten gegen sie an, mit mehr Mitteln und besseren Daten, und kennt ihre Methoden aus früheren Durchgängen. Und doch, schrieben Marilyn Darling, Charles Parry und Joseph Moore 2005, gewinnt die Opposing Force fast immer."),
      blocks: [
        { type: "p", text: x(
          "The authors trace the difference to the after-action review. The Army's 1993 guide defines it as a professional discussion of an event, focused on standards, in which soldiers discover for themselves what happened, why, and how to sustain strengths and improve on weaknesses.",
          "Autorët e lidhin ndryshimin me rishikimin pas veprimit (after-action review, AAR). Udhëzuesi i ushtrisë i 1993 e përkufizon si një diskutim profesional për një ngjarje, të përqendruar te standardet, ku ushtarët zbulojnë vetë çfarë ndodhi, pse, dhe si t'i ruajnë pikat e forta e t'i përmirësojnë të dobëtat.",
          "Die Autoren führen den Unterschied auf die After Action Review (AAR) zurück. Der Leitfaden der Armee von 1993 definiert sie als fachliches Gespräch über ein Ereignis, ausgerichtet an Standards, in dem Soldaten selbst herausfinden, was geschah, warum, und wie sie Stärken halten und Schwächen verbessern.") },
        { type: "quote", text: x(
          "An AAR is not a critique.",
          "Një AAR nuk është kritikë.",
          "Eine AAR ist keine Kritik.") },
        { type: "cards", cols: 3, items: [
          { h: x("Everyone speaks", "Flasin të gjithë", "Alle reden"), p: x("no one, whatever their rank, has all the information or the answers", "askush, cilado qoftë grada, nuk i ka të gjitha informacionet ose përgjigjet", "niemand hat, unabhängig vom Rang, alle Informationen oder Antworten") },
          { h: x("Open questions", "Pyetje të hapura", "Offene Fragen"), p: x("“what happened when…?” rather than “why didn't you…?”", "“çfarë ndodhi kur…?” në vend të “pse nuk…?”", "„Was ist passiert, als…?“ statt „Warum haben Sie nicht…?“") },
          { h: x("No grades", "Pa nota", "Keine Noten"), p: x("there are always strengths to sustain and weaknesses to improve", "gjithmonë ka pika të forta për t'u ruajtur dhe të dobëta për t'u përmirësuar", "es gibt immer Stärken zu halten und Schwächen zu verbessern") },
        ] },
        { type: "callout", reading: true, text: x(
          "A critique tells people what they did wrong. A review lets them find it themselves, which is why they remember it.",
          "Kritika u thotë njerëzve çfarë bënë gabim. Rishikimi i lë ta gjejnë vetë, prandaj e mbajnë mend.",
          "Kritik sagt Menschen, was sie falsch gemacht haben. Eine Auswertung lässt sie es selbst finden, deshalb behalten sie es.") },
      ],
      note: x(
        "The Opposing Force's size and record are as the 2005 article's summary gives them. The definition and the three cards follow TC 25-20 (1993), in our words; the Army issued a newer guide in 2013 (page 5).",
        "Madhësia dhe rezultatet e Forcës Kundërshtare janë siç i jep përmbledhja e artikullit të 2005. Përkufizimi dhe tri kartat ndjekin TC 25-20 (1993), me fjalët tona; ushtria nxori një udhëzues më të ri në 2013 (faqja 5).",
        "Größe und Bilanz der Opposing Force wie in der Zusammenfassung des Artikels von 2005. Die Definition und die drei Karten folgen TC 25-20 (1993), in eigenen Worten; die Armee gab 2013 einen neueren Leitfaden heraus (Seite 5)."),
      source: ["aar-darling-2005", "aar-army-tc2520-1993"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("About a quarter", "Rreth një të katërtën", "Rund ein Viertel"), x("better", "më mirë", "besser")],
      lead: x(
        "In 2013 Scott Tannenbaum and Christopher Cerasoli pooled 46 samples with 2,136 participants: teams and individuals, simulations and real work, medicine and other fields. On average, those who debriefed performed about 25% better than those who did not.",
        "Në 2013, Scott Tannenbaum dhe Christopher Cerasoli bashkuan 46 mostra me 2.136 pjesëmarrës: ekipe dhe individë, simulime dhe punë reale, mjekësi dhe fusha të tjera. Mesatarisht, ata që e rishikuan punën pas veprimit dolën rreth 25% më mirë se ata që nuk e bënë.",
        "2013 fassten Scott Tannenbaum und Christopher Cerasoli 46 Stichproben mit 2.136 Teilnehmenden zusammen: Teams und Einzelne, Simulationen und echte Arbeit, Medizin und andere Bereiche. Im Schnitt schnitten diejenigen mit Nachbesprechung rund 25 % besser ab als die ohne."),
      blocks: [
        { type: "hbars", max: 40, source: ["aar-tannenbaum-2013"],
          label: x("Average gain over the control group, by kind of debrief, 2013", "Përfitimi mesatar ndaj grupit të kontrollit, sipas llojit të rishikimit, 2013", "Durchschnittlicher Gewinn gegenüber der Kontrollgruppe, nach Art der Nachbesprechung, 2013"),
          items: [
            { k: x("All 46 samples", "Të 46 mostrat", "Alle 46 Stichproben"), v: 25, n: pc(25) },
            { k: x("Team debrief, team result measured", "Rishikim ekipi, matet rezultati i ekipit", "Team-Nachbesprechung, Teamergebnis gemessen"), v: 38, n: pc(38), alert: true },
            { k: x("Team debrief, individual result measured", "Rishikim ekipi, matet rezultati individual", "Team-Nachbesprechung, Einzelergebnis gemessen"), v: 16, n: pc(16) },
            { k: x("In real work, not simulation", "Në punë reale, jo në simulim", "In echter Arbeit, nicht in Simulation"), v: 21, n: pc(21) },
          ] },
        { type: "p", text: x(
          "The debriefs studied lasted about 18 minutes on average, and longer sessions were not more effective. In 2021 Nathanael Keiser and Winfred Arthur, across 61 studies, found an even larger average effect.",
          "Rishikimet e studiuara zgjatën mesatarisht rreth 18 minuta, dhe seancat më të gjata nuk dolën më efektive. Në 2021, Nathanael Keiser dhe Winfred Arthur, në 61 studime, gjetën një efekt mesatar edhe më të madh.",
          "Die untersuchten Nachbesprechungen dauerten im Schnitt etwa 18 Minuten, und längere Sitzungen wirkten nicht stärker. 2021 fanden Nathanael Keiser und Winfred Arthur über 61 Studien einen noch größeren durchschnittlichen Effekt.") },
        { type: "callout", reading: true, text: x(
          "A review does not need to be long. It needs to measure the same thing it set out to improve.",
          "Rishikimi nuk ka nevojë të jetë i gjatë. Ka nevojë të matë të njëjtën gjë që synon të përmirësojë.",
          "Eine Auswertung muss nicht lang sein. Sie muss messen, was sie verbessern will.") },
      ],
      note: x(
        "The percentages are the authors' conversion of the effect size (d = 0.67 overall; 0.79 in Keiser & Arthur). Only 6 samples came from real work. Many studies were not randomised, so the authors urge care about cause.",
        "Përqindjet janë kthimi që autorët i bëjnë madhësisë së efektit (d = 0,67 gjithsej; 0,79 te Keiser & Arthur). Vetëm 6 mostra vinin nga puna reale. Shumë studime nuk ishin të rastësishme, ndaj autorët këshillojnë kujdes për shkakun.",
        "Die Prozentwerte sind die Umrechnung der Effektstärke durch die Autoren (insgesamt d = 0,67; 0,79 bei Keiser & Arthur). Nur 6 Stichproben stammten aus echter Arbeit. Viele Studien waren nicht randomisiert, daher mahnen die Autoren zur Vorsicht bei Ursachen."),
      source: ["aar-tannenbaum-2013", "aar-keiser-arthur-2021"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Before and", "Para dhe", "Vor und"), x("after the action", "pas veprimit", "nach dem Einsatz")],
      lead: x(
        "The Army's 2013 guide gives every review the same four parts, in training and in operations. The answers to the last one name who is responsible for each change.",
        "Udhëzuesi i ushtrisë i 2013 i jep çdo rishikimi të njëjtat katër pjesë, në stërvitje dhe në operacione. Përgjigjet e pjesës së fundit emërtojnë kush përgjigjet për çdo ndryshim.",
        "Der Leitfaden der Armee von 2013 gibt jeder Auswertung dieselben vier Teile, in der Ausbildung wie im Einsatz. Die Antworten auf den letzten nennen, wer für jede Änderung verantwortlich ist."),
      blocks: [
        { type: "steps", items: [
          { h: x("What was supposed to happen?", "Çfarë duhej të ndodhte?", "Was sollte passieren?"), p: x("The intent, the objectives and the standard, as the plan stated them.", "Qëllimi, objektivat dhe standardi, siç i shkruante plani.", "Absicht, Ziele und Standard, wie der Plan sie festlegte.") },
          { h: x("What happened?", "Çfarë ndodhi?", "Was ist passiert?"), p: x("From as many viewpoints as possible, until everyone shares one picture.", "Nga sa më shumë këndvështrime, derisa të gjithë të kenë të njëjtën pamje.", "Aus möglichst vielen Blickwinkeln, bis alle dasselbe Bild haben.") },
          { h: x("What was right or wrong with it?", "Çfarë ishte mirë e çfarë jo?", "Was war daran richtig, was falsch?"), p: x("Strong and weak points, measured against the intent and the standard.", "Pikat e forta dhe të dobëta, të matura me qëllimin dhe standardin.", "Stärken und Schwächen, gemessen an Absicht und Standard.") },
          { h: x("What will we do differently next time?", "Çfarë do të bëjmë ndryshe herën tjetër?", "Was machen wir beim nächsten Mal anders?"), p: x("The team finds its own solutions and names who makes each change.", "Ekipi i gjen vetë zgjidhjet dhe cakton kush e bën secilin ndryshim.", "Das Team findet eigene Lösungen und legt fest, wer welche Änderung umsetzt.") },
        ] },
        { type: "p", text: x(
          "Darling, Parry and Moore start the cycle earlier, with a before-action review of four questions: What are our intended results and metrics? What challenges do we anticipate? What have we or others learned from similar projects? What will enable us to succeed this time?",
          "Darling, Parry dhe Moore e nisin ciklin më herët, me një rishikim para veprimit me katër pyetje: Cilat janë rezultatet që synojmë dhe si maten? Çfarë vështirësish presim? Çfarë kemi mësuar ne ose të tjerët nga projekte të ngjashme? Çfarë do të na ndihmojë të ia dalim këtë herë?",
          "Darling, Parry und Moore beginnen den Kreislauf früher, mit einer Before Action Review aus vier Fragen: Welche Ergebnisse und Kennzahlen streben wir an? Mit welchen Schwierigkeiten rechnen wir? Was haben wir oder andere aus ähnlichen Projekten gelernt? Was wird uns diesmal zum Erfolg verhelfen?") },
        { type: "callout", reading: true, text: x(
          "The review before the action writes the first answer of the review after it: what was supposed to happen.",
          "Rishikimi para veprimit shkruan përgjigjen e parë të rishikimit pas tij: çfarë duhej të ndodhte.",
          "Die Auswertung vor dem Einsatz schreibt die erste Antwort der Auswertung danach: was passieren sollte.") },
      ],
      note: x(
        "The four parts follow the Army's 2013 guide, in our words; the 1993 circular follows a similar sequence. The before-action questions are quoted from Darling et al. The reading is the editors'.",
        "Katër pjesët ndjekin udhëzuesin e ushtrisë të 2013, me fjalët tona; qarkorja e 1993 ndjek një rend të ngjashëm. Pyetjet para veprimit citohen nga Darling et al. Leximi është i redaksisë.",
        "Die vier Teile folgen dem Leitfaden der Armee von 2013, in eigenen Worten; das Rundschreiben von 1993 folgt einer ähnlichen Reihenfolge. Die Fragen vor dem Einsatz sind aus Darling et al. zitiert. Die Deutung stammt von der Redaktion."),
      source: ["aar-army-guide-2013", "aar-army-tc2520-1993", "aar-darling-2005"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Review the", "Rishiko edhe", "Auch Erfolge"), x("successes too", "sukseset", "auswerten")],
      lead: x(
        "Shmuel Ellis and Inbar Davidi followed 98 soldiers of an Israeli elite unit through a navigation course. After every exercise a commander reviewed each soldier one to one, for about 14 minutes: in one company only what had gone wrong, in the other failures and successes.",
        "Shmuel Ellis dhe Inbar Davidi ndoqën 98 ushtarë të një njësie elitare izraelite gjatë një kursi orientimi në terren. Pas çdo ushtrimi, një komandant e rishikonte çdo ushtar sy më sy, për rreth 14 minuta: në një kompani vetëm atë që kishte shkuar keq, në tjetrën dështimet dhe sukseset.",
        "Shmuel Ellis und Inbar Davidi begleiteten 98 Soldaten einer israelischen Eliteeinheit durch einen Orientierungskurs. Nach jeder Übung sprach ein Vorgesetzter mit jedem Soldaten einzeln, etwa 14 Minuten lang: in einer Kompanie nur über das, was schiefging, in der anderen über Fehler und Erfolge."),
      blocks: [
        { type: "dumbbell", from: x("1st exercise", "Ushtrimi 1", "1. Übung"), to: x("3rd exercise", "Ushtrimi 3", "3. Übung"), min: 0, max: 100, source: ["aar-ellis-davidi-2005"],
          label: x("Mean navigation score, three exercises in the second week, 2005", "Rezultati mesatar i orientimit, tri ushtrime në javën e dytë, 2005", "Mittlere Orientierungswertung, drei Übungen in der zweiten Woche, 2005"),
          rows: [
            { k: x("Successes and failures", "Sukseset dhe dështimet", "Erfolge und Fehler"), a: 46.4, an: x("46.4", "46,4", "46,4"), b: 76.4, bn: x("76.4", "76,4", "76,4"), alert: true },
            { k: x("Failures only", "Vetëm dështimet", "Nur Fehler"), a: 54.4, an: x("54.4", "54,4", "54,4"), b: 71.3, bn: x("71.3", "71,3", "71,3") },
          ] },
        { type: "p", text: x(
          "The company that also reviewed its successes improved significantly faster, though the exercises got harder each day. At first the soldiers explained failures in more detail than successes; where both were reviewed, the gap closed. In a 2021 meta-analysis, team reviews of team results worked best when the team led them.",
          "Kompania që rishikoi edhe sukseset u përmirësua dukshëm më shpejt, ndonëse ushtrimet vështirësoheshin çdo ditë. Në fillim, ushtarët i shpjegonin dështimet më hollësisht se sukseset; aty ku rishikoheshin të dyja, hendeku u mbyll. Në një meta-analizë të 2021, rishikimet e ekipit për rezultatin e ekipit dolën më mirë kur i drejtonte vetë ekipi.",
          "Die Kompanie, die auch ihre Erfolge auswertete, verbesserte sich deutlich schneller, obwohl die Übungen jeden Tag schwerer wurden. Anfangs erklärten die Soldaten Fehler ausführlicher als Erfolge; wo beides ausgewertet wurde, schloss sich diese Lücke. In einer Metaanalyse von 2021 wirkten Team-Auswertungen von Teamergebnissen am besten, wenn das Team sie selbst leitete.") },
        { type: "callout", reading: true, text: x(
          "A success that nobody examines is a success nobody can repeat on purpose.",
          "Një sukses që nuk e shqyrton askush është një sukses që askush nuk e përsërit dot me qëllim.",
          "Einen Erfolg, den niemand untersucht, kann niemand absichtlich wiederholen.") },
      ],
      note: x(
        "A quasi-experiment: whole companies were assigned, not soldiers. The score weights points reached, pace and map use; only the second week was compared. Keiser & Arthur: abstract.",
        "Gjysmë-eksperiment: u caktuan kompani të tëra, jo ushtarë. Rezultati peshon pikat e arritura, ritmin dhe përdorimin e hartës; u krahasua vetëm java e dytë. Keiser & Arthur: abstrakti.",
        "Ein Quasi-Experiment: Zugeteilt wurden ganze Kompanien, nicht Soldaten. Die Wertung gewichtet erreichte Punkte, Tempo und Kartennutzung; verglichen wurde nur die zweite Woche. Keiser & Arthur: Zusammenfassung."),
      source: ["aar-ellis-davidi-2005", "aar-keiser-arthur-2021"],
    },
    {
      id: "measure", more: "when-improvement-fades",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("A lesson counts", "Mësimi vlen", "Gelernt ist,"), x("when it is applied", "kur zbatohet", "was angewandt wird")],
      lead: x(
        "After-action reviews became a popular business tool after Shell began experimenting with them in 1998, Darling and colleagues write, but most corporate reviews are a pro-forma wrap-up: lessons are drawn, and rarely learned. The Opposing Force counts a lesson as learned only once it has been applied and validated.",
        "Rishikimet pas veprimit u bënë mjet i përhapur në biznes pasi Shell nisi t'i provonte në 1998, shkruajnë Darling dhe kolegët, por shumica e rishikimeve në kompani janë një mbyllje formale: mësimet nxirren, por rrallë mësohen. Forca Kundërshtare e quan një mësim të mësuar vetëm pasi është zbatuar dhe është vërtetuar.",
        "After Action Reviews wurden zu einem beliebten Werkzeug in Unternehmen, nachdem Shell 1998 damit zu experimentieren begann, schreiben Darling und Kollegen, doch die meisten Auswertungen dort sind ein formaler Abschluss: Lehren werden gezogen, aber selten gelernt. Die Opposing Force zählt eine Lehre erst als gelernt, wenn sie angewandt und bestätigt wurde."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Changes done on time", "Ndryshimet e bëra në kohë", "Rechtzeitig umgesetzte Änderungen"), p: x("Of the changes agreed in the fourth question, how many were made by the date set.", "Nga ndryshimet e vendosura te pyetja e katërt, sa u bënë brenda datës së caktuar.", "Wie viele der bei der vierten Frage vereinbarten Änderungen bis zum Termin umgesetzt wurden.") },
          { h: x("Repeat findings", "Gjetjet që përsëriten", "Wiederkehrende Befunde"), p: x("Issues that come back in a later review: a lesson drawn, but not yet learned.", "Çështje që rikthehen në një rishikim të mëvonshëm: mësim i nxjerrë, por ende i pamësuar.", "Themen, die in einer späteren Auswertung wiederkehren: eine gezogene, aber noch nicht gelernte Lehre.") },
          { h: x("The result you reviewed", "Rezultati që rishikove", "Das ausgewertete Ergebnis"), p: x("A team review is judged by the team's result, not by one person's.", "Një rishikim ekipi gjykohet nga rezultati i ekipit, jo i një personi.", "Eine Team-Auswertung misst man am Ergebnis des Teams, nicht an dem einer Person.") },
        ] },
        { type: "example", label: x("Hypothetical example, a month of reviews in a warehouse", "Shembull hipotetik, një muaj rishikimesh në një magazinë", "Hypothetisches Beispiel, ein Monat Auswertungen in einem Lager"), rows: [
          { k: x("Reviews", "Rishikimet", "Auswertungen"), v: x("8 planned, 6 held", "8 të planifikuara, 6 u mbajtën", "8 geplant, 6 gehalten") },
          { k: x("Changes", "Ndryshimet", "Änderungen"), v: x("14 agreed, 8 done by the date", "14 të vendosura, 8 u bënë brenda datës", "14 vereinbart, 8 termingerecht umgesetzt") },
          { k: x("Repeats", "Përsëritjet", "Wiederholungen"), v: x("3 issues already raised in an earlier review", "3 çështje të ngritura që në një rishikim më të hershëm", "3 Themen, die schon früher aufkamen") },
        ], text: x("The last line shows lessons drawn but not learned. The numbers are invented.", "Rreshti i fundit tregon mësime të nxjerra, por të pamësuara. Numrat janë të shpikur.", "Die letzte Zeile zeigt gezogene, aber nicht gelernte Lehren. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "Shell and the Opposing Force's rule are from Darling et al. (2005); judging a team review by the team's result follows Tannenbaum & Cerasoli. The three counts and the example are the editors'.",
        "Shell dhe rregulli i Forcës Kundërshtare vijnë nga Darling et al. (2005); gjykimi i rishikimit të ekipit nga rezultati i ekipit ndjek Tannenbaum & Cerasoli. Tri numërimet dhe shembulli janë të redaksisë.",
        "Shell und die Regel der Opposing Force stammen aus Darling et al. (2005); eine Team-Auswertung am Teamergebnis zu messen, folgt Tannenbaum & Cerasoli. Die drei Zählungen und das Beispiel stammen von der Redaktion."),
      source: ["aar-darling-2005", "aar-tannenbaum-2013"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The after-action", "Fleta e rishikimit", "Das Blatt für die"), x("review sheet", "pas veprimit", "After Action Review")],
      lead: x(
        "Fill it in soon after the event, with the people who took part. Write facts, not blame, and leave no line in the last box without a person and a date.",
        "Plotësoje menjëherë pas ngjarjes, me njerëzit që morën pjesë. Shkruaj fakte, jo faje, dhe mos lër asnjë rresht në kutinë e fundit pa një person dhe një datë.",
        "Bald nach dem Ereignis ausfüllen, mit den Menschen, die dabei waren. Fakten notieren, keine Schuldzuweisungen, und im letzten Feld keine Zeile ohne Person und Datum lassen."),
      blocks: [
        { type: "form", items: [
          { h: x("Event and who took part", "Ngjarja dhe kush mori pjesë", "Ereignis und Beteiligte"), hint: x("one event or phase, not a whole month", "një ngjarje ose një fazë, jo një muaj i tërë", "ein Ereignis oder eine Phase, kein ganzer Monat") },
          { h: x("What was supposed to happen", "Çfarë duhej të ndodhte", "Was passieren sollte"), hint: x("the goal, the plan and the standard, as they stood before", "qëllimi, plani dhe standardi, siç ishin më parë", "Ziel, Plan und Standard, wie sie vorher galten") },
          { h: x("What actually happened", "Çfarë ndodhi në të vërtetë", "Was tatsächlich passiert ist"), hint: x("the facts, from more than one point of view", "faktet, nga më shumë se një këndvështrim", "die Fakten, aus mehr als einem Blickwinkel"), lines: 2 },
          { h: x("What went well, and why", "Çfarë shkoi mirë, dhe pse", "Was gut lief, und warum"), hint: x("what we keep, so we can repeat it on purpose", "çfarë mbajmë, që ta përsërisim me qëllim", "was wir behalten, um es absichtlich zu wiederholen") },
          { h: x("What did not, and why", "Çfarë nuk shkoi, dhe pse", "Was nicht lief, und warum"), hint: x("causes, not culprits; ask why until you reach something you can change", "shkaqe, jo fajtorë; pyet pse derisa të arrish te diçka që mund ta ndryshosh", "Ursachen, keine Schuldigen; nach dem Warum fragen, bis man bei etwas Änderbarem ist") },
          { h: x("What we do differently next time", "Çfarë bëjmë ndryshe herën tjetër", "Was wir beim nächsten Mal anders machen"), hint: x("each change with an owner and a date; check it at the next review", "çdo ndryshim me një përgjegjës dhe një datë; kontrollohet në rishikimin e radhës", "jede Änderung mit Verantwortlichem und Datum; bei der nächsten Auswertung prüfen"), lines: 2 },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the Army's four questions, the review of successes and failures in Ellis & Davidi, and Darling et al.",
        "Praktikë e propozuar nga redaksia, sipas katër pyetjeve të ushtrisë, rishikimit të sukseseve dhe dështimeve te Ellis & Davidi, dhe Darling et al.",
        "Eine Praxis, die die Redaktion vorschlägt, nach den vier Fragen der Armee, der Auswertung von Erfolgen und Fehlern bei Ellis & Davidi sowie Darling et al."),
      source: ["aar-army-guide-2013", "aar-ellis-davidi-2005", "aar-darling-2005"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
