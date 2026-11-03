// Management Review, No. 95: The second check, when a double check catches errors and what scanning changed.
// Block: Operations. Facts and their sources: docs/revista/management-review-nr-95.md. Koyama et al. (2020, PubMed
// Central), the ISMP article (2019) and Koppel et al. (2008, PubMed Central) were read in full; the simulation of
// Douglass et al. (2018) enters only as the review reports it. The NEJM study of Poon et al. (2010) did not open: its
// figures are from the abstract and carry "via". Checklists are No. 85, poka-yoke and alarms No. 46; not repeated here.
import { x, pc } from "../common.js";

// "10.3%" in English, "10,3%" in Albanian and "10,3 %" in German.
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 95,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The second check:", "Kontrolli i dytë:", "Die zweite Prüfung:"), x("what it catches", "çfarë kap", "was sie findet")],
  sub: x(
    "Two nurses and a planted error, thirteen studies of the double check, the errors a second person catches and those they repeat, what bedside scanning changed, the overrides that show where it is bypassed, and a card.",
    "Dy infermierë dhe një gabim i mbjellë, trembëdhjetë studime të kontrollit të dyfishtë, gabimet që kap një person i dytë dhe ato që i përsërit, çfarë ndryshoi skanimi te shtrati, anashkalimet që tregojnë ku shmanget, dhe një kartë.",
    "Zwei Pflegekräfte und ein eingebauter Fehler, dreizehn Studien zur Doppelkontrolle, Fehler, die eine zweite Person findet, und solche, die sie wiederholt, was das Scannen am Bett änderte, die Overrides, die zeigen, wo es umgangen wird, und eine Karte."),
  seo: x(
    "The double check: what a review of 13 studies found, independent versus primed checks, what bar-code scanning changed, its workarounds, and a card.",
    "Kontrolli i dyfishtë: çfarë gjeti një rishikim i 13 studimeve, kontrolli i pavarur dhe ai i sugjeruar, çfarë ndryshoi skanimi, anashkalimet dhe një kartë.",
    "Die Doppelkontrolle: was eine Übersicht von 13 Studien fand, unabhängige und gelenkte Prüfung, was das Scannen änderte, seine Umgehungen und eine Karte."),
  feature: x(
    "In a simulation, two nurses caught every wrong vial and still missed two dose errors in three. Issue 95 reads a review of 13 hospital studies of the double check, which found little proof that it lowers errors, and the advice of the Institute for Safe Medication Practices on when a second person helps. It then looks at what bar-code scanning at the bedside changed, at the override logs that show where scanning is bypassed, and ends with a card for each check a team relies on.",
    "Në një simulim, dy infermierë kapën çdo shishe të gabuar dhe prapë humbën dy nga tri gabimet e dozës. Numri 95 lexon një rishikim të 13 studimeve spitalore për kontrollin e dyfishtë, që gjeti pak prova se ai ul gabimet, dhe këshillën e Institute for Safe Medication Practices për kur ndihmon një person i dytë. Pastaj shikon çfarë ndryshoi skanimi me barkod te shtrati, regjistrat e anashkalimeve që tregojnë ku shmanget skanimi, dhe mbyllet me një kartë për çdo kontroll mbi të cilin mbështetet një ekip.",
    "In einer Simulation fanden zwei Pflegekräfte jede falsche Ampulle und übersahen trotzdem zwei von drei Dosisfehlern. Ausgabe 95 liest eine Übersicht von 13 Klinikstudien zur Doppelkontrolle, die kaum Belege für weniger Fehler fand, und den Rat des Institute for Safe Medication Practices, wann eine zweite Person hilft. Dann geht es um das, was das Barcode-Scannen am Bett änderte, um die Override-Protokolle, die zeigen, wo das Scannen umgangen wird, und am Ende um eine Karte für jede Prüfung, auf die sich ein Team verlässt."),
  figure: { n: pc(33), by: "Koyama et al., 2020", t: x(
    "of nurses caught a planted dose error when a second nurse checked, in a simulation; 9% when one checked alone.",
    "e infermierëve e kapën një gabim të mbjellë doze kur kontrolloi një infermier i dytë, në një simulim; 9% kur kontrolloi vetëm një.",
    "der Pflegekräfte fanden in einer Simulation einen eingebauten Dosisfehler, wenn eine zweite prüfte; 9 % bei alleiniger Prüfung.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two nurses, one planted error", "Dy infermierë, një gabim i mbjellë", "Zwei Pflegekräfte, ein eingebauter Fehler") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("What the scanner changed", "Çfarë ndryshoi skaneri", "Was der Scanner änderte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The second check card", "Karta e kontrollit të dytë", "Die Karte der zweiten Prüfung") },
  ],
  sources: ["dcheck-koyama-2020", "dcheck-ismp-2019", "dcheck-poon-2010", "dcheck-koppel-2008"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Wherever a mistake is costly, a second person is asked to check: the dose, the load, the payment, the release. The rule feels safe and costs a second person's time. This issue asks when the second check catches errors, when it only feels safe, and what changed where a device took over part of it.",
        "Kudo ku një gabim kushton, i kërkohet një personi të dytë të kontrollojë: dozën, ngarkesën, pagesën, lëshimin. Rregulli të jep siguri dhe kushton kohën e një personi të dytë. Ky numër pyet kur e kap kontrolli i dytë gabimin, kur vetëm të jep ndjesinë e sigurisë, dhe çfarë ndryshoi aty ku një pajisje mori përsipër një pjesë të tij.",
        "Wo ein Fehler teuer ist, soll eine zweite Person prüfen: die Dosis, die Ladung, die Zahlung, die Freigabe. Die Regel fühlt sich sicher an und kostet die Zeit einer zweiten Person. Diese Ausgabe fragt, wann die zweite Prüfung Fehler findet, wann sie nur Sicherheit vermittelt und was sich änderte, wo ein Gerät einen Teil davon übernahm."),
      body: x(
        "In a simulation, a second nurse lifted the catch of a wrong vial from 54% to 100%, and of a dose error only from 9% to 33%. A review of 13 hospital studies found too little evidence that double checks lower errors, and none that they lower harm. ISMP explains which errors a second person catches. Scanning at the bedside went with 41% fewer administration errors, and its override logs show where it is bypassed. A card closes the issue.",
        "Në një simulim, një infermier i dytë e ngriti kapjen e një shisheje të gabuar nga 54% në 100%, dhe të një gabimi doze vetëm nga 9% në 33%. Një rishikim i 13 studimeve spitalore gjeti shumë pak prova se kontrolli i dyfishtë ul gabimet, dhe asnjë se ul dëmin. ISMP shpjegon cilat gabime i kap një person i dytë. Skanimi te shtrati shkoi bashkë me 41% më pak gabime në dhënien e ilaçeve, dhe regjistrat e anashkalimeve tregojnë ku shmanget. Një kartë e mbyll numrin.",
        "In einer Simulation hob eine zweite Pflegekraft das Erkennen einer falschen Ampulle von 54 % auf 100 %, das eines Dosisfehlers nur von 9 % auf 33 %. Eine Übersicht von 13 Klinikstudien fand zu wenig Belege, dass Doppelkontrollen Fehler senken, und keine, dass sie Schäden senken. Das ISMP erklärt, welche Fehler eine zweite Person findet. Scannen am Bett ging mit 41 % weniger Verabreichungsfehlern einher, und seine Override-Protokolle zeigen, wo es umgangen wird. Eine Karte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two nurses,", "Dy infermierë,", "Zwei Pflegekräfte,"), x("one planted error", "një gabim i mbjellë", "ein eingebauter Fehler")],
      lead: x(
        "In a trial in a medical education centre, 43 pairs of emergency and intensive care nurses cared for a simulated patient. Two errors were planted: a wrong vial and a wrong weight-based dose. One group gave a drug that policy said needed a second check, insulin; the other a drug that needed one, midazolam.",
        "Në një provë në një qendër të arsimit mjekësor, 43 çifte infermierësh të urgjencës dhe të kujdesit intensiv kujdesën për një pacient të simuluar. U mbollën dy gabime: një shishe e gabuar dhe një dozë e gabuar sipas peshës. Një grup dha një ilaç për të cilin rregulli kërkonte kontroll të dytë, insulinën; tjetri një ilaç që kërkonte një kontroll, midazolamin.",
        "In einem Versuch in einem medizinischen Ausbildungszentrum versorgten 43 Paare von Notfall- und Intensivpflegekräften einen simulierten Patienten. Zwei Fehler waren eingebaut: eine falsche Ampulle und eine falsche gewichtsbezogene Dosis. Eine Gruppe gab ein Mittel, das laut Regel eine zweite Prüfung brauchte, Insulin; die andere eines mit einer Prüfung, Midazolam."),
      blocks: [
        { type: "pairs", from: x("One check", "Një kontroll", "Eine Prüfung"), to: x("Two checks", "Dy kontrolle", "Zwei Prüfungen"), max: 100, source: ["dcheck-koyama-2020"],
          label: x("Nurses who caught the planted error, by kind of check (simulation, 2018)", "Infermierët që e kapën gabimin e mbjellë, sipas llojit të kontrollit (simulim, 2018)", "Pflegekräfte, die den eingebauten Fehler fanden, nach Art der Prüfung (Simulation, 2018)"),
          rows: [
            { k: x("Wrong vial", "Shishja e gabuar", "Falsche Ampulle"), a: 54, an: pc(54), b: 100, bn: pc(100) },
            { k: x("Wrong dose", "Doza e gabuar", "Falsche Dosis"), a: 9, an: pc(9), b: 33, bn: pc(33), alert: true },
          ] },
        { type: "p", text: x(
          "With two, every wrong vial was found, and two dose errors in three still went through. Both errors were found more often when the checker worked independently than when told what to expect, and the review notes that deference to a more senior nurse was seen in this trial.",
          "Me dy veta, u gjet çdo shishe e gabuar, dhe prapë dy nga tri gabimet e dozës kaluan. Të dy gabimet u gjetën më shpesh kur kontrolluesi punoi i pavarur se sa kur iu tha çfarë të priste, dhe rishikimi shënon se në këtë provë u pa nënshtrimi ndaj një infermieri më të vjetër.",
          "Zu zweit wurde jede falsche Ampulle gefunden, und doch gingen zwei von drei Dosisfehlern durch. Beide Fehler wurden häufiger gefunden, wenn die zweite Person unabhängig prüfte, als wenn man ihr sagte, was sie erwarten sollte, und die Übersicht vermerkt, dass in diesem Versuch Rücksicht auf eine ranghöhere Pflegekraft beobachtet wurde.") },
        { type: "callout", reading: true, text: x(
          "A second look reads the label. It does not redo the arithmetic unless the check asks for it.",
          "Një vështrim i dytë e lexon etiketën. Llogarinë nuk e bën përsëri, po s'e kërkoi kontrolli.",
          "Ein zweiter Blick liest das Etikett. Die Rechnung macht er nur neu, wenn die Prüfung es verlangt.") },
      ],
      note: x(
        "Douglass et al. (2018) as reported in the review by Koyama et al. (2020). Small groups, wide confidence intervals; the two groups gave different drugs, and nurses may check insulin more closely anyway.",
        "Douglass et al. (2018) siç e raporton rishikimi i Koyama-s et al. (2020). Grupe të vogla, intervale besueshmërie të gjera; dy grupet dhanë ilaçe të ndryshme, dhe infermierët mund ta kontrollojnë insulinën më me kujdes gjithsesi.",
        "Douglass et al. (2018), wie die Übersicht von Koyama et al. (2020) berichtet. Kleine Gruppen, breite Konfidenzintervalle; die Gruppen gaben verschiedene Mittel, und Insulin wird womöglich ohnehin genauer geprüft."),
      source: ["dcheck-koyama-2020"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Thirteen studies,", "Trembëdhjetë studime,", "Dreizehn Studien,"), x("three good ones", "tri të mira", "drei gute")],
      lead: x(
        "Alain Koyama and colleagues searched five databases up to October 2018 for hospital studies of double checks when medicines are given. They found 13. Of the three of good quality, one linked double checks with fewer errors, one found no clear link, and one counted only whether the steps were followed.",
        "Alain Koyama dhe kolegët kërkuan në pesë baza të dhënash deri në tetor 2018 studime spitalore për kontrollin e dyfishtë kur jepen ilaçet. Gjetën 13. Nga tri me cilësi të mirë, njëri e lidhi kontrollin e dyfishtë me më pak gabime, tjetri nuk gjeti lidhje të qartë, dhe i treti numëroi vetëm nëse u ndoqën hapat.",
        "Alain Koyama und Kollegen durchsuchten fünf Datenbanken bis Oktober 2018 nach Klinikstudien zur Doppelkontrolle bei der Gabe von Arzneimitteln. Sie fanden 13. Von den drei guten verband eine die Doppelkontrolle mit weniger Fehlern, eine fand keinen klaren Zusammenhang, eine zählte nur, ob die Schritte befolgt wurden."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "0 / 13", t: x("studies measured harm to patients", "studime e matën dëmin te pacientët", "Studien maßen Schäden bei Patienten") },
          { n: x("52–97%", "52–97%", "52–97 %"), t: x("of doses were double-checked, where studies of adults counted it", "e dozave u kontrolluan dy herë, aty ku studimet me të rritur e numëruan", "der Gaben wurden doppelt geprüft, wo Studien mit Erwachsenen es zählten") },
        ] },
        { type: "hbars", max: 100, source: ["dcheck-koyama-2020"],
          label: x("Steps of the double check followed, one children's hospital, 2,000 observed doses (2014)", "Hapat e kontrollit të dyfishtë të ndjekur, një spital fëmijësh, 2.000 doza të vëzhguara (2014)", "Befolgte Schritte der Doppelkontrolle, eine Kinderklinik, 2.000 beobachtete Gaben (2014)"),
          items: [
            { k: x("Giving the dose to the patient", "Dhënia e dozës te pacienti", "Gabe an den Patienten"), v: 83, n: pc(83) },
            { k: x("Rate of an IV bolus", "Shpejtësia e një bolusi IV", "Geschwindigkeit eines IV-Bolus"), v: 71, n: pc(71) },
            { k: x("Labelling flush syringes", "Etiketimi i shiringave të shpëlarjes", "Beschriftung von Spülspritzen"), v: 67, n: pc(67) },
            { k: x("Dose calculation", "Llogaritja e dozës", "Dosisberechnung"), v: 30, n: pc(30), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "The step followed least was the calculation, the kind of error the checkers in the simulation missed most.",
          "Hapi i ndjekur më pak ishte llogaritja, ai lloj gabimi që kontrolluesit në simulim e humbën më shumë.",
          "Am seltensten befolgt wurde die Rechnung, die Art Fehler, die die Prüfenden in der Simulation am häufigsten übersahen.") },
      ],
      note: x(
        "The bars are the four weakest of 15 steps (Alsulami et al., 2014, as the review lists them); the other 11 were followed in 90% or more. Five of the 13 studies counted errors from self-reports or incident reports, which undercount them.",
        "Shiritat janë katër hapat më të dobët nga 15 (Alsulami et al., 2014, siç i rendit rishikimi); 11 të tjerët u ndoqën në 90% ose më shumë. Pesë nga 13 studimet i numëruan gabimet nga vetëraportimi ose raportet e incidenteve, që i nënvlerësojnë.",
        "Die Balken sind die vier schwächsten von 15 Schritten (Alsulami et al., 2014, wie die Übersicht sie aufführt); die übrigen 11 wurden zu 90 % oder mehr befolgt. Fünf der 13 Studien zählten Fehler aus Selbstberichten oder Ereignismeldungen, die sie unterschätzen."),
      source: ["dcheck-koyama-2020"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What a second", "Çfarë kap", "Was eine zweite"), x("person catches", "një person i dytë", "Person findet")],
      lead: x(
        "The Institute for Safe Medication Practices (ISMP, 2019) still backs the manual independent double check, but for a few high-risk tasks only, and only when done properly. It separates the errors a second person tends to catch from those they tend to repeat.",
        "Institute for Safe Medication Practices (ISMP, 2019) e mbështet ende kontrollin e dyfishtë të pavarur me dorë, por vetëm për pak detyra me rrezik të lartë, dhe vetëm kur bëhet si duhet. I ndan gabimet që një person i dytë zakonisht i kap nga ato që zakonisht i përsërit.",
        "Das Institute for Safe Medication Practices (ISMP, 2019) hält an der manuellen unabhängigen Doppelkontrolle fest, aber nur für wenige Hochrisikoaufgaben und nur richtig ausgeführt. Es trennt Fehler, die eine zweite Person meist findet, von solchen, die sie meist wiederholt."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Usually caught: slips of one person", "Zakonisht kapen: lëshimet e një personi", "Meist gefunden: Ausrutscher einer Person"), items: [
            x("A miscalculated dose", "Një dozë e llogaritur gabim", "Eine falsch berechnete Dosis"),
            x("Another person rarely makes the same slip", "Një tjetër rrallë bën të njëjtin lëshim", "Eine andere Person macht selten denselben Fehler"),
            x("If the checker works alone, from the source", "Nëse kontrolluesi punon vetëm, nga burimi", "Wenn die zweite Person allein prüft, von der Quelle aus"),
          ] },
          { h: x("Often repeated: errors from the setting", "Shpesh përsëriten: gabimet nga mjedisi", "Oft wiederholt: Fehler aus dem Umfeld"), accent: true, items: [
            x("Look-alike packages and labels", "Paketime dhe etiketa që ngjajnë", "Verwechselbare Packungen und Etiketten"),
            x("A complex task, unclear information", "Një detyrë e ndërlikuar, informacion i paqartë", "Eine komplexe Aufgabe, unklare Angaben"),
            x("The checker works in the same conditions", "Kontrolluesi punon në të njëjtat kushte", "Die zweite Person arbeitet unter denselben Bedingungen"),
          ] },
        ] },
        { type: "p", text: x(
          "Holding up a syringe and saying “This is 5 units of insulin, can you check it?” is ISMP's example of a check that is not independent. Failed checks come back to four habits: checking by routine, stopping once the first details look right, deferring to rank, and trusting that the other will catch it.",
          "Të ngresh një shiringë e të thuash “Kjo është 5 njësi insulinë, a mund ta kontrollosh?” është shembulli i ISMP-së për një kontroll që nuk është i pavarur. Kontrollet që dështojnë kthehen te katër zakone: kontrolli nga rutina, ndalimi sapo detajet e para duken në rregull, nënshtrimi ndaj gradës, dhe besimi se do ta kapë tjetri.",
          "Eine Spritze hochzuhalten und zu sagen: „Das sind 5 Einheiten Insulin, kannst du das prüfen?“, ist das Beispiel des ISMP für eine Prüfung, die nicht unabhängig ist. Gescheiterte Prüfungen führen auf vier Gewohnheiten zurück: Prüfen aus Routine, Aufhören, sobald die ersten Angaben stimmen, Rücksicht auf den Rang und das Vertrauen, dass der andere es findet.") },
        { type: "callout", reading: true, text: x(
          "A check that is told the answer confirms it. Give the checker the source, not the result.",
          "Një kontroll të cilit i thuhet përgjigjja, e konfirmon atë. Jepi kontrolluesit burimin, jo rezultatin.",
          "Eine Prüfung, der man die Antwort sagt, bestätigt sie. Geben Sie der zweiten Person die Quelle, nicht das Ergebnis.") },
      ],
      note: x(
        "ISMP (2019), read in full; the columns follow its distinction between errors from within a person and from outside, the wording is the editors'. ISMP cites studies, mostly in pharmacies and simulations, in which such checks found up to 95% of errors; the 2020 review found little evidence of that at the bedside.",
        "ISMP (2019), lexuar i plotë; kolonat ndjekin dallimin e tij mes gabimeve që lindin brenda personit dhe jashtë tij, fjalët janë të redaksisë. ISMP citon studime, kryesisht në farmaci dhe simulime, ku këto kontrolle gjetën deri në 95% të gabimeve; rishikimi i 2020-s gjeti pak prova për këtë te shtrati.",
        "ISMP (2019), vollständig gelesen; die Spalten folgen seiner Unterscheidung zwischen Fehlern aus der Person und von außen, die Formulierung stammt von der Redaktion. Das ISMP zitiert Studien, meist in Apotheken und Simulationen, in denen solche Prüfungen bis zu 95 % der Fehler fanden; die Übersicht von 2020 fand dafür am Bett wenig Belege."),
      source: ["dcheck-ismp-2019", "dcheck-koyama-2020"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What the scanner", "Çfarë ndryshoi", "Was der Scanner"), x("changed", "skaneri", "änderte")],
      lead: x(
        "In 2010 Eric Poon and colleagues compared units of an academic medical centre before and after a bar-code system that checks each medicine against an electronic administration record. Observers watched 14,041 administrations and reviewed 3,082 transcribed orders.",
        "Më 2010, Eric Poon dhe kolegët krahasuan repartet e një qendre mjekësore akademike para dhe pas një sistemi barkodi që e kontrollon çdo ilaç me një regjistër elektronik të dhënies së ilaçeve. Vëzhguesit ndoqën 14.041 dhënie ilaçesh dhe rishikuan 3.082 urdhra të rishkruar.",
        "2010 verglichen Eric Poon und Kollegen Stationen eines akademischen Klinikums vor und nach einem Barcode-System, das jedes Arzneimittel gegen eine elektronische Verabreichungsdokumentation prüft. Beobachter verfolgten 14.041 Gaben und prüften 3.082 übertragene Verordnungen."),
      blocks: [
        { type: "dumbbell", from: x("Without scanning", "Pa skanim", "Ohne Scannen"), to: x("With scanning", "Me skanim", "Mit Scannen"), min: 0, max: 12, rowH: 26, source: ["dcheck-poon-2010"],
          label: x("Rates per 100 observed administrations; transcription per 100 orders (2010)", "Norma për 100 dhënie të vëzhguara; rishkrimi për 100 urdhra (2010)", "Raten je 100 beobachtete Gaben; Übertragung je 100 Verordnungen (2010)"),
          rows: [
            { k: x("Administration errors", "Gabime në dhënie", "Gabefehler"), a: 11.5, an: pcd("11.5"), b: 6.8, bn: pcd("6.8"), alert: true },
            { k: x("Transcription errors", "Gabime në rishkrim", "Übertragungsfehler"), a: 6.1, an: pcd("6.1"), b: 0, bn: pc(0) },
            { k: x("Potential harm", "Dëm i mundshëm", "Möglicher Schaden"), a: 3.1, an: pcd("3.1"), b: 1.6, bn: pcd("1.6") },
          ] },
        { type: "p", text: x(
          "Timing errors fell by 27.3%, but potential harm from them did not change significantly. The authors' verdict: fewer errors, not none. ISMP calls scanning more reliable than a second nurse for confirming drug, dose and patient, and sees the second nurse as the better check for pump settings and mixed-up lines.",
          "Gabimet e kohës ranë me 27,3%, por dëmi i mundshëm prej tyre nuk ndryshoi në mënyrë të rëndësishme. Përfundimi i autorëve: më pak gabime, jo zero. ISMP e quan skanimin më të besueshëm se një infermier i dytë për të konfirmuar ilaçin, dozën dhe pacientin, dhe infermierin e dytë e sheh si kontrollin më të mirë për cilësimet e pompës dhe linjat e ngatërruara.",
          "Zeitfehler sanken um 27,3 %, möglicher Schaden durch sie änderte sich aber nicht signifikant. Das Urteil der Autoren: weniger Fehler, nicht keine. Das ISMP hält Scannen für verlässlicher als eine zweite Pflegekraft, um Mittel, Dosis und Patient zu bestätigen, und sieht die zweite Person als bessere Prüfung für Pumpeneinstellungen und vertauschte Leitungen.") },
        { type: "callout", reading: true, text: x(
          "A scanner makes the comparison every time, tired or not. It cannot check what is never scanned.",
          "Skaneri e bën krahasimin çdo herë, i lodhur a jo. Nuk mund të kontrollojë atë që nuk skanohet kurrë.",
          "Ein Scanner vergleicht jedes Mal, müde oder nicht. Was nie gescannt wird, kann er nicht prüfen.") },
      ],
      note: x(
        "Before-and-after study in one centre, not a randomised trial; figures from the abstract only (the NEJM full text did not open), hence “via”. Errors and harm leave out timing errors; transcription is per order reviewed.",
        "Studim para dhe pas në një qendër, jo provë e rastësishme; shifrat vetëm nga abstrakti (teksti i plotë në NEJM nuk u hap), prandaj “përmes”. Gabimet dhe dëmi nuk përfshijnë gabimet e kohës; rishkrimi është për urdhër të rishikuar.",
        "Vorher-nachher-Studie in einem Klinikum, kein randomisierter Versuch; Zahlen nur aus dem Abstract (der Volltext im NEJM öffnete sich nicht), daher „über“. Fehler und Schaden ohne Zeitfehler; Übertragung je geprüfter Verordnung."),
      source: ["dcheck-poon-2010", "dcheck-ismp-2019"],
    },
    {
      id: "measure", more: "the-scanner-is-a-witness",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count the", "Numëro", "Die Overrides"), x("overrides", "anashkalimet", "zählen")],
      lead: x(
        "Ross Koppel and colleagues studied bar-code systems in five hospitals (2003–2006), watching nurses in two, and read a month of override logs from four. A dose charted without a confirming scan is an override: 10.3% on the medicine side, 4.2% on the patient side.",
        "Ross Koppel dhe kolegët studiuan sistemet e barkodit në pesë spitale (2003–2006), vëzhguan infermierët në dy, dhe lexuan regjistrat e anashkalimeve për një muaj në katër. Një dozë e shënuar pa skanim konfirmues është anashkalim: 10,3% nga ana e ilaçit, 4,2% nga ana e pacientit.",
        "Ross Koppel und Kollegen untersuchten Barcode-Systeme in fünf Kliniken (2003–2006), beobachteten Pflegekräfte in zwei und lasen einen Monat Override-Protokolle aus vier. Eine Gabe, dokumentiert ohne bestätigenden Scan, ist ein Override: 10,3 % auf Seiten des Arzneimittels, 4,2 % auf Seiten des Patienten."),
      blocks: [
        { type: "hbars", max: 25000, source: ["dcheck-koppel-2008"],
          label: x("Medicine overrides by stated reason, one month, four hospitals (2005)", "Anashkalimet e ilaçeve sipas arsyes së dhënë, një muaj, katër spitale (2005)", "Arzneimittel-Overrides nach angegebenem Grund, ein Monat, vier Kliniken (2005)"),
          items: [
            { k: x("Scan failed, cause not given", "Skanimi dështoi, pa shkak", "Scan fehlgeschlagen, ohne Ursache"), v: 24620, n: x("24,620", "24.620", "24.620") },
            { k: x("Bar code missing or unreadable", "Barkodi mungon ose s'lexohet", "Barcode fehlt oder unlesbar"), v: 5062, n: x("5,062", "5.062", "5.062"), alert: true },
            { k: x("Unusual case, e.g. own medicine", "Rast i pazakontë, p.sh. ilaç i vetë pacientit", "Sonderfall, z. B. eigenes Medikament"), v: 1385, n: x("1,385", "1.385", "1.385") },
            { k: x("Partial dose or other form", "Dozë e pjesshme ose formë tjetër", "Teildosis oder andere Form"), v: 1098, n: x("1,098", "1.098", "1.098") },
          ] },
        { type: "p", text: x(
          "Among the 15 workarounds: copies of wristband codes stuck to carts, doorframes or belt rings; one package scanned twice for a full dose; alarms muted; a second nurse signing without looking.",
          "Mes 15 anashkalimeve: kopje të kodeve të byzylykut të ngjitura në karroca, kasa dyersh ose rripa; një paketë e skanuar dy herë për një dozë të plotë; alarme të heshtura; një infermier i dytë që nënshkruan pa parë.",
          "Unter den 15 Umgehungen: Kopien von Armbandcodes an Wagen, Türrahmen oder Gürtelringen; eine Packung zweimal gescannt für eine volle Dosis; stummgeschaltete Alarme; eine zweite Pflegekraft, die abzeichnet, ohne hinzusehen.") },
        { type: "callout", reading: true, text: x(
          "An override log lists where the system and the work do not fit. Read it as that before reading it for names.",
          "Regjistri i anashkalimeve tregon ku sistemi dhe puna nuk përputhen. Lexoje si të tillë para se ta lexosh për emra.",
          "Ein Override-Protokoll zeigt, wo System und Arbeit nicht zusammenpassen. Lesen Sie es so, bevor Sie darin Namen suchen.") },
      ],
      note: x(
        "Koppel et al. (2008). The reasons are the nurses' own entries; they show which causes exist, not how often each occurs. The authors found no workaround malicious. The linked essay is the author's view of what a scan proves. Checklists are in No. 85, mistake-proofing in No. 46.",
        "Koppel et al. (2008). Arsyet janë shënimet e vetë infermierëve; tregojnë cilat shkaqe ekzistojnë, jo sa shpesh ndodh secili. Autorët nuk gjetën asnjë anashkalim me qëllim të keq. Eseja e lidhur është pikëpamja e autorit për atë që provon një skanim. Listat e kontrollit janë te Nr. 85, poka-yoke te Nr. 46.",
        "Koppel et al. (2008). Die Gründe sind Einträge der Pflegekräfte selbst; sie zeigen, welche Ursachen vorkommen, nicht wie oft. Böswillig war keine Umgehung. Der verlinkte Essay gibt die Sicht des Autors wieder, was ein Scan beweist. Checklisten stehen in Nr. 85, Poka-Yoke in Nr. 46."),
      source: ["dcheck-koppel-2008"],
    },
    {
      id: "tool", tool: "/tools/poka-yoke/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The second", "Karta e kontrollit", "Die Karte der"), x("check card", "të dytë", "zweiten Prüfung")],
      lead: x(
        "One card for each check a team relies on, by a person or a device. The Poka-Yoke Register keeps devices such as a blocking scan on a test schedule: plant a deliberate error and see whether the check stops it.",
        "Një kartë për çdo kontroll mbi të cilin mbështetet një ekip, nga një person ose një pajisje. Regjistri Poka-Yoke i mban pajisjet, si një skanim që bllokon, në një plan testimi: mbill një gabim me qëllim dhe shiko nëse kontrolli e ndalon.",
        "Eine Karte für jede Prüfung, auf die sich ein Team verlässt, durch eine Person oder ein Gerät. Das Poka-Yoke-Register führt Vorrichtungen wie einen sperrenden Scan nach einem Prüfplan: einen Fehler absichtlich einbauen und sehen, ob die Prüfung ihn stoppt."),
      blocks: [
        { type: "form", items: [
          { h: x("The error it must catch", "Gabimi që duhet të kapë", "Der Fehler, den sie finden muss"), hint: x("one named error, such as wrong dose or wrong patient, not “mistakes”", "një gabim me emër, si doza ose pacienti i gabuar, jo “gabimet”", "ein benannter Fehler wie falsche Dosis oder falscher Patient, nicht „Fehler“") },
          { h: x("From a person or the setting?", "Nga personi apo nga mjedisi?", "Aus der Person oder dem Umfeld?"), hint: x("a slip is caught by a second person; look-alike labels may fool both", "një lëshim e kap një person i dytë; etiketat që ngjajnë mund t'i mashtrojnë të dy", "einen Ausrutscher findet eine zweite Person; ähnliche Etiketten täuschen oft beide") },
          { h: x("Could a device do it?", "A mund ta bëjë një pajisje?", "Könnte ein Gerät es tun?"), hint: x("a scan, a hard stop, a fixed setting; keep people for what devices cannot check", "një skanim, një bllokim, një cilësim i fiksuar; njerëzit për atë që pajisjet s'e kontrollojnë", "ein Scan, eine harte Sperre, eine feste Einstellung; Menschen für das, was Geräte nicht prüfen") },
          { h: x("Independent?", "E pavarur?", "Unabhängig?"), hint: x("the checker works from the source, not from what the first person says", "kontrolluesi punon nga burimi, jo nga ajo që thotë personi i parë", "die zweite Person arbeitet von der Quelle aus, nicht nach dem, was die erste sagt") },
          { h: x("Last planted error", "Gabimi i fundit i mbjellë", "Letzter eingebauter Fehler"), hint: x("date, and whether the check stopped it", "data, dhe nëse kontrolli e ndaloi", "Datum, und ob die Prüfung ihn stoppte") },
          { h: x("Skipped or overridden this month", "Anashkaluar këtë muaj", "Diesen Monat übergangen"), hint: x("how many times, and the reasons given", "sa herë, dhe arsyet e dhëna", "wie oft, und die angegebenen Gründe") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on ISMP's advice, the review and the override study; it is not a tested instrument. Testing with a planted error is how the simulation measured detection.",
        "Karta është propozim i redaksisë, i ndërtuar mbi këshillën e ISMP-së, rishikimin dhe studimin e anashkalimeve; nuk është instrument i testuar. Testimi me një gabim të mbjellë është mënyra si simulimi e mati kapjen.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf den Rat des ISMP, die Übersicht und die Override-Studie; sie ist kein geprüftes Instrument. Ein eingebauter Fehler ist auch das, womit die Simulation das Finden maß."),
      source: ["dcheck-ismp-2019", "dcheck-koyama-2020", "dcheck-koppel-2008"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
