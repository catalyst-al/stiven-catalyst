// Management Review, No. 44: The pre-mortem: failure before it happens. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-44.md.
import { x } from "../common.js";

export default {
  number: 44,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The pre-mortem:", "Pre-mortem:", "Das Pre-Mortem:"), x("failure before it happens", "dështimi para se të ndodhë", "Scheitern, bevor es geschieht")],
  sub: x(
    "Why doubts go unsaid, a thesis that took longer than the worst case, Klein's five steps, what the 30% really measured, what to count afterwards, and a pre-mortem sheet.",
    "Pse dyshimet mbeten pa u thënë, një temë diplome që zgjati më shumë se rasti më i keq, pesë hapat e Klein-it, çfarë mati vërtet shifra 30%, çfarë numërohet pas takimit, dhe një fletë për pre-mortem-in.",
    "Warum Zweifel ungesagt bleiben, eine Abschlussarbeit, die länger dauerte als im schlimmsten Fall, Kleins fünf Schritte, was die 30 % wirklich maßen, was man danach zählt, und ein Pre-Mortem-Blatt."),
  seo: x(
    "The pre-mortem: Klein's method, Kahneman on doubt, a forecast that missed even its worst case, what the 30% measured, and a sheet to run one.",
    "Pre-mortem-i: metoda e Klein-it, Kahneman-i për dyshimin, një parashikim që gaboi edhe rastin më të keq, çfarë mati shifra 30% dhe një fletë pune.",
    "Das Pre-Mortem: Kleins Methode, Kahneman über Zweifel, eine Prognose, die selbst den schlimmsten Fall verfehlte, was die 30 % maßen, und ein Blatt."),
  feature: x(
    "Issue 44 starts with the doubts a team keeps to itself once a plan seems settled, follows students whose thesis took longer than even their worst-case forecast, sets out Gary Klein's pre-mortem step by step, checks what the often-quoted 30% actually measured, shows what to count after a session, and ends with a sheet for your own pre-mortem.",
    "Numri 44 nis me dyshimet që një ekip i mban për vete kur plani duket i vendosur, ndjek studentë që e mbaruan temën e diplomës më vonë se edhe parashikimi i tyre për rastin më të keq, shtjellon hap pas hapi pre-mortem-in e Gary Klein-it, kontrollon çfarë mati vërtet shifra 30% që citohet aq shpesh, tregon çfarë numërohet pas takimit, dhe mbyllet me një fletë për pre-mortem-in tënd.",
    "Ausgabe 44 beginnt mit den Zweifeln, die ein Team für sich behält, sobald ein Plan beschlossen scheint, begleitet Studierende, deren Abschlussarbeit länger dauerte als selbst ihre Prognose für den schlimmsten Fall, stellt Gary Kleins Pre-Mortem Schritt für Schritt vor, prüft, was die oft zitierten 30 % tatsächlich maßen, zeigt, was man nach einer Sitzung zählt, und endet mit einem Blatt für das eigene Pre-Mortem."),
  figure: { n: x("48.7%", "48,7%", "48,7 %"), by: "Buehler, Griffin & Ross, 1994", t: x(
    "of the students finished their thesis by the date they had given for the case in which everything went as poorly as it possibly could.",
    "e studentëve e mbaruan temën e diplomës brenda datës që kishin dhënë për rastin kur gjithçka shkon sa më keq të jetë e mundur.",
    "der Studierenden schlossen ihre Abschlussarbeit bis zu dem Datum ab, das sie für den Fall genannt hatten, dass alles so schlecht wie nur möglich läuft.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Permission to doubt", "Leje për të dyshuar", "Erlaubnis zum Zweifel") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("What the 30% really measured", "Çfarë mati vërtet shifra 30%", "Was die 30 % wirklich maßen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The pre-mortem sheet", "Fleta e pre-mortem-it", "Das Pre-Mortem-Blatt") },
  ],
  sources: ["premortem-klein-2007", "premortem-kahneman-2011", "premortem-buehler-1994", "premortem-klein-2021", "premortem-mitchell-1989", "premortem-veinott-2010", "premortem-gallop-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most plans are reviewed by the people who wrote them, at the moment they most want them to work. This issue is about a short meeting that starts from the opposite assumption: the plan has already failed, and the team explains why.",
        "Shumica e planeve i shqyrtojnë ata që i kanë shkruar, pikërisht kur duan më shumë që të funksionojnë. Ky numër flet për një takim të shkurtër që nis nga supozimi i kundërt: plani ka dështuar tashmë, dhe ekipi shpjegon pse.",
        "Die meisten Pläne prüfen diejenigen, die sie geschrieben haben, genau dann, wenn sie am meisten wollen, dass sie funktionieren. Diese Ausgabe handelt von einer kurzen Sitzung, die von der umgekehrten Annahme ausgeht: Der Plan ist bereits gescheitert, und das Team erklärt, warum."),
      body: x(
        "Gary Klein described the pre-mortem in Harvard Business Review in 2007. Daniel Kahneman wrote that its main virtue is to make doubts legitimate. In a 1994 study, students finished their thesis later than even their worst-case forecast. The figure most often quoted for the method, 30%, goes back to a 1989 study whose abstract describes something else: how people explain an outcome they take as certain. A 2010 experiment found that the pre-mortem lowered confidence in a plan more than other kinds of critique.",
        "Gary Klein-i e përshkroi pre-mortem-in te Harvard Business Review në 2007. Daniel Kahneman-i shkroi se vlera e tij kryesore është se i bën dyshimet të ligjshme. Në një studim të 1994, studentët e mbaruan temën e diplomës më vonë se edhe parashikimi i tyre për rastin më të keq. Shifra që citohet më shpesh për metodën, 30%, të çon te një studim i 1989, abstrakti i të cilit përshkruan diçka tjetër: si e shpjegojnë njerëzit një rezultat që e marrin si të sigurt. Një eksperiment i 2010 gjeti se pre-mortem-i e uli besimin te një plan më shumë se mënyrat e tjera të kritikës.",
        "Gary Klein beschrieb das Pre-Mortem 2007 in der Harvard Business Review. Daniel Kahneman schrieb, sein größter Vorzug sei, dass es Zweifel legitimiert. In einer Studie von 1994 schlossen Studierende ihre Abschlussarbeit später ab als selbst im schlimmsten Fall vorhergesagt. Die Zahl, die zur Methode am häufigsten zitiert wird, 30 %, führt zu einer Studie von 1989, deren Zusammenfassung etwas anderes beschreibt: wie Menschen ein Ergebnis erklären, das sie für sicher halten. Ein Experiment von 2010 fand, dass das Pre-Mortem das Vertrauen in einen Plan stärker senkte als andere Formen der Kritik."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Permission", "Leje", "Erlaubnis"), x("to doubt", "për të dyshuar", "zum Zweifel")],
      lead: x(
        "Projects fail at a spectacular rate, Gary Klein wrote in 2007, and one reason is that too many people keep their reservations to themselves while the plan is being made. His remedy turns the usual question around: not what might go wrong, but what did go wrong.",
        "Projektet dështojnë në një masë të jashtëzakonshme, shkroi Gary Klein-i në 2007, dhe një arsye është se shumë njerëz i mbajnë rezervat për vete ndërsa plani bëhet. Ilaçi i tij e kthen përmbys pyetjen e zakonshme: jo çfarë mund të shkojë keq, por çfarë shkoi keq.",
        "Projekte scheitern in spektakulärem Ausmaß, schrieb Gary Klein 2007, und ein Grund ist, dass zu viele Menschen ihre Bedenken für sich behalten, während der Plan entsteht. Sein Gegenmittel dreht die übliche Frage um: nicht, was schiefgehen könnte, sondern was schiefgegangen ist."),
      blocks: [
        { type: "quote", text: x(
          "The main virtue of the premortem is that it legitimizes doubts.",
          "Vlera kryesore e pre-mortem-it është se i bën dyshimet të ligjshme.",
          "Der Hauptvorzug des Pre-Mortems ist, dass es Zweifel legitimiert.") },
        { type: "p", text: x(
          "As a team converges on a decision, Daniel Kahneman wrote, public doubts are gradually suppressed and in the end treated as a sign of flawed loyalty; only supporters keep a voice, and confidence grows. In one of Klein's sessions, a team member who had said nothing in a long kickoff pointed out that an algorithm would not run quickly on the laptops used in the field. The developers had a shortcut they had been reluctant to mention, and it went into the plan.",
          "Kur një ekip i afrohet një vendimi, shkroi Daniel Kahneman-i, dyshimet publike shtypen pak nga pak dhe në fund trajtohen si shenjë besnikërie të mangët; zë mbajnë vetëm përkrahësit, dhe besimi rritet. Në një nga seancat e Klein-it, një anëtar që nuk kishte folur gjatë gjithë takimit të gjatë të nisjes vuri re se një algoritëm nuk do të punonte shpejt në laptopët që përdoreshin në terren. Zhvilluesit kishin një rrugë më të shkurtër që ngurronin ta përmendnin, dhe ajo hyri në plan.",
          "Wenn ein Team sich auf eine Entscheidung zubewegt, schrieb Daniel Kahneman, werden öffentliche Zweifel nach und nach unterdrückt und am Ende als Zeichen mangelnder Loyalität gewertet; nur Befürworter behalten eine Stimme, und das Vertrauen wächst. In einer von Kleins Sitzungen wies ein Teammitglied, das in einer langen Auftaktbesprechung geschwiegen hatte, darauf hin, dass ein Algorithmus auf den Laptops im Feldeinsatz nicht schnell laufen würde. Die Entwickler hatten eine Abkürzung, die sie nicht hatten erwähnen wollen, und sie kam in den Plan.") },
        { type: "callout", reading: true, text: x(
          "Teams rarely lack the knowledge of what could fail. They lack a moment in which saying it counts as a contribution, not as disloyalty.",
          "Ekipeve rrallë u mungon dija për atë që mund të dështojë. U mungon një moment kur ta thuash vlerësohet si kontribut, jo si mungesë besnikërie.",
          "Teams fehlt selten das Wissen, was scheitern könnte. Ihnen fehlt ein Moment, in dem es als Beitrag gilt, das auszusprechen, und nicht als Illoyalität.") },
      ],
      note: x(
        "Kahneman's words are quoted from an excerpt of Thinking, Fast and Slow that Bloomberg published in 2011. The laptop case is Klein's own account; we could not check it independently.",
        "Fjalët e Kahneman-it citohen nga një pjesë e librit Thinking, Fast and Slow që botoi Bloomberg në 2011. Rasti i laptopëve është rrëfimi i vetë Klein-it; nuk mundëm ta kontrollonim në mënyrë të pavarur.",
        "Kahnemans Worte stammen aus einem Auszug aus Thinking, Fast and Slow, den Bloomberg 2011 veröffentlichte. Der Laptop-Fall ist Kleins eigene Darstellung; unabhängig prüfen konnten wir ihn nicht."),
      source: ["premortem-klein-2007", "premortem-kahneman-2011"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Later than", "Më vonë se", "Später als"), x("the worst case", "rasti më i keq", "der schlimmste Fall")],
      lead: x(
        "In 1994 Roger Buehler, Dale Griffin and Michael Ross asked 37 psychology students at the University of Waterloo, in the last term of their honours thesis, when they would hand it in: their best estimate, and the dates if everything went as well, or as badly, as possible.",
        "Në 1994, Roger Buehler, Dale Griffin dhe Michael Ross pyetën 37 studentë të psikologjisë në University of Waterloo, në semestrin e fundit të temës së diplomës, kur do ta dorëzonin: vlerësimin e tyre më të mirë, dhe datat nëse gjithçka shkonte sa më mirë, ose sa më keq.",
        "1994 fragten Roger Buehler, Dale Griffin und Michael Ross 37 Psychologiestudierende an der University of Waterloo im letzten Semester ihrer Abschlussarbeit, wann sie sie abgeben würden: ihre beste Schätzung und die Termine, falls alles bestmöglich oder schlechtestmöglich liefe."),
      blocks: [
        { type: "columns", max: 60, height: 110, source: ["premortem-buehler-1994"],
          label: x("Days to finish the thesis, average of 33 students, 1994", "Ditët deri në mbarimin e temës, mesatarja e 33 studentëve, 1994", "Tage bis zur fertigen Arbeit, Mittel von 33 Studierenden, 1994"),
          items: [
            { k: x("Best case", "Rasti më i mirë", "Bester Fall"), v: 27.4, n: x("27.4", "27,4", "27,4") },
            { k: x("Best estimate", "Vlerësimi", "Schätzung"), v: 33.9, n: x("33.9", "33,9", "33,9") },
            { k: x("Worst case", "Rasti më i keq", "Schlimmster Fall"), v: 48.6, n: x("48.6", "48,6", "48,6") },
            { k: x("Actual", "Në fakt", "Tatsächlich"), v: 55.5, n: x("55.5", "55,5", "55,5"), alert: true },
          ] },
        { type: "p", text: x(
          "Only 29.7% finished by their best estimate, 10.8% by the best-case date, 48.7% by the worst-case date. The worst-case forecasts were less biased but no more accurate: they missed by 23.2 days on average, the best estimates by 22.6.",
          "Vetëm 29,7% e mbaruan brenda vlerësimit të tyre më të mirë, 10,8% brenda datës së rastit më të mirë, 48,7% brenda datës së rastit më të keq. Parashikimet për rastin më të keq ishin më pak të njëanshme, por jo më të sakta: gabuan mesatarisht me 23,2 ditë, vlerësimet më të mira me 22,6.",
          "Nur 29,7 % wurden bis zu ihrer besten Schätzung fertig, 10,8 % bis zum Termin für den besten Fall, 48,7 % bis zu dem für den schlimmsten Fall. Die Prognosen für den schlimmsten Fall waren weniger verzerrt, aber nicht genauer: Sie lagen im Schnitt 23,2 Tage daneben, die besten Schätzungen 22,6.") },
        { type: "callout", reading: true, text: x(
          "Imagining the worst case still starts from the plan. The pre-mortem starts from the failure and asks how it came about.",
          "Edhe kur imagjinon rastin më të keq, nis nga plani. Pre-mortem-i nis nga dështimi dhe pyet si ndodhi.",
          "Wer sich den schlimmsten Fall ausmalt, geht noch immer vom Plan aus. Das Pre-Mortem geht vom Scheitern aus und fragt, wie es dazu kam.") },
      ],
      note: x(
        "Averages of the 33 students who had finished when the records closed. The gap between the worst case and the actual time was not statistically significant. One group, one task.",
        "Mesatare të 33 studentëve që e kishin mbaruar kur u mbyll regjistrimi. Diferenca mes rastit më të keq dhe kohës së vërtetë nuk ishte statistikisht domethënëse. Një grup, një detyrë.",
        "Mittelwerte der 33 Studierenden, die fertig waren, als die Erfassung endete. Der Abstand zwischen schlimmstem Fall und tatsächlicher Dauer war statistisch nicht signifikant. Eine Gruppe, eine Aufgabe."),
      source: ["premortem-buehler-1994"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five steps,", "Pesë hapa,", "Fünf Schritte,"), x("half an hour", "gjysmë ore", "eine halbe Stunde")],
      lead: x(
        "Klein's pre-mortem comes at the start of a project, once the team knows the plan. In 2021 he wrote that it can take as little as 20 to 30 minutes.",
        "Pre-mortem-i i Klein-it bëhet në nisje të projektit, pasi ekipi e njeh planin. Në 2021 ai shkroi se mund të zgjasë vetëm 20 deri në 30 minuta.",
        "Kleins Pre-Mortem findet zu Beginn eines Projekts statt, sobald das Team den Plan kennt. 2021 schrieb er, es könne nur 20 bis 30 Minuten dauern."),
      blocks: [
        { type: "chain", items: [
          { h: x("Brief", "Plani", "Plan"), p: x("The team goes through the plan.", "Ekipi e shqyrton planin.", "Das Team geht den Plan durch.") },
          { h: x("Failure", "Dështimi", "Scheitern"), p: x("The leader declares it has failed: a fiasco, and that much is certain.", "Drejtuesi shpall se ka dështuar: një fiasko, dhe kjo është e sigurt.", "Die Leitung erklärt ihn für gescheitert: ein Fiasko, und das steht fest.") },
          { h: x("Alone", "Vetëm", "Allein"), p: x("Two minutes each to write every reason why.", "Dy minuta secili për të shkruar çdo arsye pse.", "Je zwei Minuten, um jeden Grund aufzuschreiben.") },
          { h: x("In turn", "Me radhë", "Reihum"), p: x("One different reason each, the leader first, all on the board.", "Një arsye e re secili, drejtuesi i pari, të gjitha në tabelë.", "Jeder einen neuen Grund, die Leitung zuerst, alles an die Tafel.") },
          { h: x("Strengthen", "Përforcimi", "Stärken"), p: x("The leader reviews the list and strengthens the plan.", "Drejtuesi e shqyrton listën dhe e përforcon planin.", "Die Leitung sichtet die Liste und stärkt den Plan.") },
        ] },
        { type: "p", text: x(
          "Klein later added two minutes in which each person writes actions they can take, and a rating of each problem for likelihood, impact and ease of prevention. Kahneman places the session where an organisation has almost reached an important decision but has not yet committed itself.",
          "Më vonë Klein-i shtoi dy minuta ku secili shkruan veprime që mund të ndërmarrë vetë, dhe një vlerësim të çdo problemi për gjasat, ndikimin dhe sa lehtë parandalohet. Kahneman-i e vendos seancën aty ku organizata gati e ka marrë një vendim të rëndësishëm, por ende nuk është angazhuar.",
          "Später ergänzte Klein zwei Minuten, in denen jede Person Schritte aufschreibt, die sie selbst tun kann, und eine Bewertung jedes Problems nach Wahrscheinlichkeit, Wirkung und wie leicht es sich verhindern lässt. Kahneman setzt die Sitzung dort an, wo eine Organisation eine wichtige Entscheidung fast getroffen, sich aber noch nicht festgelegt hat.") },
        { type: "callout", reading: true, text: x(
          "Timing matters as much as method: before the decision, a doubt is input; after it, the same doubt sounds like opposition.",
          "Koha ka po aq rëndësi sa metoda: para vendimit, dyshimi është kontribut; pas tij, i njëjti dyshim tingëllon si kundërshtim.",
          "Der Zeitpunkt zählt so viel wie die Methode: Vor der Entscheidung ist ein Zweifel ein Beitrag, danach klingt derselbe Zweifel nach Widerstand.") },
      ],
      note: x(
        "The steps follow Klein (2007; 2021); in 2007 the round began with the project manager, in 2021 with the team leader. The grouping into five is the editors'.",
        "Hapat ndjekin Klein-in (2007; 2021); në 2007 radha nisej me menaxherin e projektit, në 2021 me drejtuesin e ekipit. Ndarja në pesë është e redaksisë.",
        "Die Schritte folgen Klein (2007; 2021); 2007 begann die Runde mit der Projektleitung, 2021 mit der Teamleitung. Die Einteilung in fünf stammt von der Redaktion."),
      source: ["premortem-klein-2007", "premortem-klein-2021", "premortem-kahneman-2011"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What the 30%", "Çfarë mati vërtet", "Was die 30 %"), x("really measured", "shifra 30%", "wirklich maßen")],
      lead: x(
        "Klein cites a 1989 study by Deborah Mitchell, Jay Russo and Nancy Pennington: imagining that an event has already occurred, he wrote, raises the ability to correctly identify reasons for future outcomes by 30%. The study's abstract describes something narrower.",
        "Klein-i citon një studim të 1989 nga Deborah Mitchell, Jay Russo dhe Nancy Pennington: të imagjinosh se një ngjarje ka ndodhur tashmë, shkroi ai, e rrit me 30% aftësinë për të gjetur saktë arsyet e rezultateve të ardhshme. Abstrakti i studimit përshkruan diçka më të ngushtë.",
        "Klein zitiert eine Studie von 1989 von Deborah Mitchell, Jay Russo und Nancy Pennington: Sich vorzustellen, ein Ereignis sei schon eingetreten, steigere die Fähigkeit, Gründe für künftige Ergebnisse richtig zu erkennen, um 30 %, schrieb er. Die Zusammenfassung der Studie beschreibt etwas Engeres."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Mitchell et al., 1989", "Mitchell et al., 1989", "Mitchell et al., 1989"), p: x("Varied whether an event lay in the future or the past, and whether it was certain. Time had little effect; certainty mattered: explanations of sure events were longer, with more episodic reasons. No measure of correct reasons is reported.", "Ndryshoi nëse ngjarja ishte në të ardhmen apo në të shkuarën, dhe nëse ishte e sigurt. Koha pati pak efekt; rëndësi pati siguria: shpjegimet për ngjarje të sigurta ishin më të gjata, me më shumë arsye episodike. Nuk jepet matje e arsyeve të sakta.", "Variierte, ob ein Ereignis in Zukunft oder Vergangenheit lag und ob es sicher war. Die Zeit wirkte kaum, die Sicherheit schon: Erklärungen sicherer Ereignisse waren länger, mit mehr episodischen Gründen. Ein Maß für richtige Gründe fehlt.") },
          { h: x("Veinott, Klein & Wiggins, 2010", "Veinott, Klein & Wiggins, 2010", "Veinott, Klein & Wiggins, 2010"), p: x("178 students reviewed a university's plan for an H1N1 outbreak. Pros and cons, cons only and the pre-mortem all lowered confidence more than the baseline; the pre-mortem most.", "178 studentë shqyrtuan planin e një universiteti për gripin H1N1. Pro dhe kundër, vetëm kundër dhe pre-mortem-i e ulën besimin te plani më shumë se grupi bazë; pre-mortem-i më shumë se të gjitha.", "178 Studierende prüften den Plan einer Universität für einen H1N1-Ausbruch. Pro und Contra, nur Contra und das Pre-Mortem senkten das Vertrauen stärker als die Ausgangsgruppe, das Pre-Mortem am stärksten.") },
          { h: x("Gallop, Willy & Bischoff, 2016", "Gallop, Willy & Bischoff, 2016", "Gallop, Willy & Bischoff, 2016"), p: x("Teams of experienced programme managers and engineers had 45 minutes on one torpedo case. As judged by an expert panel, pre-mortem teams found more quality risks and plan changes than brainstorming teams.", "Ekipe menaxherësh programesh dhe inxhinierësh me përvojë patën 45 minuta për një rast me një silur. Sipas një paneli ekspertësh, ekipet me pre-mortem gjetën më shumë rreziqe dhe ndryshime cilësore se ekipet me brainstorming.", "Teams erfahrener Programmmanager und Ingenieure hatten 45 Minuten für einen Torpedo-Fall. Nach dem Urteil eines Fachgremiums fanden Pre-Mortem-Teams mehr hochwertige Risiken und Planänderungen als Brainstorming-Teams.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The studies share a frame, not a number: the failure is taken as certain. That is the part a team can keep.",
          "Studimet i bashkon korniza, jo shifra: dështimi merret si i sigurt. Këtë pjesë një ekip mund ta mbajë.",
          "Die Studien teilen einen Rahmen, keine Zahl: Das Scheitern gilt als sicher. Diesen Teil kann ein Team behalten.") },
      ],
      note: x(
        "We could not read the full 1989 paper and give no figure from it. The later studies used one scenario each; lower confidence is not yet a better plan, and we found no study of real project results.",
        "Nuk mundëm ta lexonim të plotë artikullin e 1989 dhe nuk japim shifër prej tij. Dy studimet e tjera përdorën një skenar secili; besimi më i ulët nuk është ende plan më i mirë, dhe nuk gjetëm studim për rezultatet e projekteve të vërteta.",
        "Den Artikel von 1989 konnten wir nicht vollständig lesen und nennen keine Zahl daraus. Die beiden anderen Studien nutzten je ein Szenario; weniger Vertrauen ist noch kein besserer Plan, und eine Studie zu echten Projektergebnissen fanden wir nicht."),
      source: ["premortem-klein-2007", "premortem-mitchell-1989", "premortem-veinott-2010", "premortem-gallop-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Did the plan", "A ndryshoi", "Hat sich der Plan"), x("change?", "plani?", "geändert?")],
      lead: x(
        "A pre-mortem is not judged by the length of its list. In Klein's account, it pays off as a stronger plan and as a team that picks up early signs of trouble once the work is under way. Four counts show whether that happened.",
        "Një pre-mortem nuk gjykohet nga gjatësia e listës. Sipas Klein-it, ai shpërblen me një plan më të fortë dhe me një ekip që i kap herët shenjat e problemeve kur puna ka nisur. Katër numërime tregojnë nëse ndodhi kjo.",
        "Ein Pre-Mortem misst man nicht an der Länge seiner Liste. Nach Klein zahlt es sich aus in einem stärkeren Plan und in einem Team, das frühe Anzeichen von Ärger bemerkt, sobald die Arbeit läuft. Vier Zählungen zeigen, ob das geschehen ist."),
      blocks: [
        { type: "steps", items: [
          { h: x("Voices", "Zërat", "Stimmen"), p: x("How many people gave at least one reason? A list written by two people is theirs, not the team's.", "Sa veta dhanë të paktën një arsye? Një listë e shkruar nga dy veta është e tyre, jo e ekipit.", "Wie viele nannten mindestens einen Grund? Eine Liste von zwei Personen ist ihre, nicht die des Teams.") },
          { h: x("New reasons", "Arsyet e reja", "Neue Gründe"), p: x("How many had not come up in the kickoff or the risk list?", "Sa prej tyre nuk ishin dëgjuar në takimin e nisjes ose në listën e rreziqeve?", "Wie viele waren im Auftakt oder in der Risikoliste nicht vorgekommen?") },
          { h: x("Changes", "Ndryshimet", "Änderungen"), p: x("How many led to a change in the plan, with an owner and a date?", "Sa prej tyre çuan në një ndryshim të planit, me përgjegjës dhe datë?", "Wie viele führten zu einer Planänderung, mit verantwortlicher Person und Datum?") },
          { h: x("Early signs", "Shenjat e hershme", "Frühe Zeichen"), p: x("For the top reasons: which signal shows early that it is happening, and who watches it?", "Për arsyet kryesore: cili sinjal tregon herët që po ndodh, dhe kush e ndjek?", "Für die wichtigsten Gründe: Welches Signal zeigt früh, dass es eintritt, und wer achtet darauf?") },
        ] },
        { type: "example", label: x("Hypothetical example, a pre-mortem before a peak week in a warehouse", "Shembull hipotetik, një pre-mortem para një jave piku në një magazinë", "Hypothetisches Beispiel, ein Pre-Mortem vor einer Spitzenwoche im Lager"), rows: [
          { k: x("Voices", "Zërat", "Stimmen"), v: x("9 in the room, 8 gave a reason", "9 në sallë, 8 dhanë një arsye", "9 im Raum, 8 nannten einen Grund") },
          { k: x("Reasons", "Arsyet", "Gründe"), v: x("23 on the board, 7 never raised before", "23 në tabelë, 7 të pathëna më parë", "23 an der Tafel, 7 vorher nie genannt") },
          { k: x("Changes", "Ndryshimet", "Änderungen"), v: x("4 to the plan, 2 warning signs with an owner", "4 në plan, 2 shenja paralajmëruese me përgjegjës", "4 im Plan, 2 Warnzeichen mit Zuständigen") },
        ], text: x("The line that counts is the last one: what the session changed. The numbers are invented.", "Rreshti që ka rëndësi është i fundit: çfarë ndryshoi seanca. Numrat janë të shpikur.", "Entscheidend ist die letzte Zeile: was die Sitzung verändert hat. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The counts and the example are the editors', drawn from the benefits Klein lists. Kahneman warns that the pre-mortem is no panacea and gives no complete protection against nasty surprises.",
        "Numërimet dhe shembulli janë të redaksisë, sipas përfitimeve që rendit Klein-i. Kahneman-i paralajmëron se pre-mortem-i nuk është ilaç për gjithçka dhe nuk të mbron plotësisht nga surprizat e këqija.",
        "Zählungen und Beispiel stammen von der Redaktion, nach den Vorteilen, die Klein nennt. Kahneman warnt, das Pre-Mortem sei kein Allheilmittel und schütze nicht vollständig vor bösen Überraschungen."),
      source: ["premortem-klein-2007", "premortem-kahneman-2011"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The pre-mortem", "Fleta e", "Das Pre-Mortem-"), x("sheet", "pre-mortem-it", "Blatt")],
      lead: x(
        "Run it before the plan is approved, not after. Read the second line aloud, give everyone two minutes alone, and take the top reasons to the 5 Whys sheet to reach a cause you can change.",
        "Bëje para se plani të miratohet, jo pas. Lexoje me zë rreshtin e dytë, jepi secilit dy minuta vetëm, dhe çoji arsyet kryesore te fleta 5 Whys për të arritur te një shkak që mund ta ndryshosh.",
        "Vor der Freigabe des Plans, nicht danach. Die zweite Zeile laut vorlesen, allen zwei Minuten allein geben und die wichtigsten Gründe mit dem Blatt 5 Whys bis zu einer Ursache verfolgen, die sich ändern lässt."),
      blocks: [
        { type: "form", items: [
          { h: x("Plan and decision", "Plani dhe vendimi", "Plan und Entscheidung"), hint: x("what we are about to commit to, and by when", "për çfarë po angazhohemi, dhe deri kur", "worauf wir uns festlegen wollen, und bis wann") },
          { h: x("The failure", "Dështimi", "Das Scheitern"), hint: x("“It is [date]. We carried out the plan as written. It failed.”", "“Është [data]. E zbatuam planin siç ishte shkruar. Dështoi.”", "„Es ist [Datum]. Wir haben den Plan wie geschrieben umgesetzt. Er ist gescheitert.“") },
          { h: x("Why it failed", "Pse dështoi", "Warum er scheiterte"), hint: x("two minutes alone, then one reason each, in turn", "dy minuta vetëm, pastaj një arsye secili, me radhë", "zwei Minuten allein, dann reihum je ein Grund"), lines: 2 },
          { h: x("Top three reasons", "Tri arsyet kryesore", "Die drei wichtigsten Gründe"), hint: x("likelihood, impact, how easy to prevent", "gjasat, ndikimi, sa lehtë parandalohet", "Wahrscheinlichkeit, Wirkung, wie leicht vermeidbar") },
          { h: x("Changes to the plan", "Ndryshimet në plan", "Änderungen am Plan"), hint: x("what changes, who owns it, by when", "çfarë ndryshon, kush e ka, deri kur", "was sich ändert, wer verantwortlich ist, bis wann") },
          { h: x("Early warning signs", "Shenjat e hershme", "Frühe Warnzeichen"), hint: x("what we will see first, and who watches for it", "çfarë do të shohim të parën, dhe kush e ndjek", "was wir zuerst sehen werden, und wer darauf achtet") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Klein (2007; 2021) and Kahneman (2011).",
        "Praktikë e propozuar nga redaksia, sipas Klein-it (2007; 2021) dhe Kahneman-it (2011).",
        "Eine Praxis, die die Redaktion vorschlägt, nach Klein (2007; 2021) und Kahneman (2011)."),
      source: ["premortem-klein-2007", "premortem-klein-2021", "premortem-kahneman-2011"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
