// Management Review, No. 90: The shift handover, what gets lost between shifts and what a structured handover changed.
// Block: Operations. Facts and their sources: docs/revista/management-review-nr-90.md. The Cullen report was read in
// chapters 1 and 11 of HSE's scan; the HSE page, Lardner's refinery paper and Starmer et al. (2023, PubMed Central) were
// read in full. The NEJM trial of 2014 could not be opened: its figures are from the abstract and carry "via".
// The treatise chapter "The handover that survives the morning" (volume 1) is not repeated; the essay and the tool are linked.
import { x, pc } from "../common.js";

// "24.5" in English, "24,5" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 90,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The shift handover:", "Dorëzimi i turnit:", "Die Schichtübergabe:"), x("what gets lost", "çfarë humbet", "was verloren geht")],
  sub: x(
    "A valve that was not mentioned at Piper Alpha, fifteen handovers watched in a refinery, what a structured log changed, the I-PASS programme in 9 and then 32 hospitals, and a card for the handover.",
    "Një valvul që nuk u përmend në Piper Alpha, pesëmbëdhjetë dorëzime të vëzhguara në një rafineri, çfarë ndryshoi një regjistër i strukturuar, programi I-PASS në 9 e pastaj në 32 spitale, dhe një kartë për dorëzimin.",
    "Ein Ventil, das bei Piper Alpha niemand erwähnte, fünfzehn beobachtete Übergaben in einer Raffinerie, was ein strukturiertes Schichtbuch änderte, das I-PASS-Programm in 9 und dann 32 Kliniken, und eine Karte."),
  seo: x(
    "Shift handover: the Piper Alpha inquiry, a refinery's structured logs, the I-PASS handoff programme, HSE's principles, and a handover card.",
    "Dorëzimi i turnit: hetimi i Piper Alpha-s, regjistrat e strukturuar të një rafinerie, programi I-PASS, parimet e HSE-së dhe një kartë.",
    "Schichtübergabe: die Piper-Alpha-Untersuchung, strukturierte Schichtbücher einer Raffinerie, das I-PASS-Programm, die Grundsätze der HSE und eine Karte."),
  feature: x(
    "On 6 July 1988 the night shift on Piper Alpha restarted a pump whose safety valve had been removed; the evening handover had not passed that on. Issue 90 reads the inquiry's chapter on handovers, then watches fifteen handovers in a refinery and follows what a structured log changed there. It sets the five parts of I-PASS beside the refinery's log, gives the results of the programme in 9 and then 32 hospitals, and ends with the marks of a handover that works and a card.",
    "Më 6 korrik 1988, turni i natës në Piper Alpha ndezi një pompë që i ishte hequr valvula e sigurisë; dorëzimi i mbrëmjes nuk e kishte përcjellë këtë. Numri 90 lexon kapitullin e hetimit për dorëzimet, pastaj shikon pesëmbëdhjetë dorëzime në një rafineri dhe ndjek çfarë ndryshoi atje një regjistër i strukturuar. I vë pesë pjesët e I-PASS pranë regjistrit të rafinerisë, jep rezultatet e programit në 9 e pastaj në 32 spitale, dhe mbyllet me shenjat e një dorëzimi që funksionon dhe me një kartë.",
    "Am 6. Juli 1988 startete die Nachtschicht auf Piper Alpha eine Pumpe, deren Sicherheitsventil ausgebaut war; die Übergabe am Abend hatte das nicht weitergegeben. Ausgabe 90 liest das Kapitel der Untersuchung über Übergaben, beobachtet dann fünfzehn Übergaben in einer Raffinerie und verfolgt, was ein strukturiertes Schichtbuch dort änderte. Sie stellt die fünf Teile von I-PASS neben das Schichtbuch, zeigt die Ergebnisse in 9 und dann 32 Kliniken und endet mit den Merkmalen einer guten Übergabe und einer Karte."),
  figure: { n: pc(66), by: "Starmer et al., 2023", t: x(
    "of observed spoken handovers included all five I-PASS elements after the programme, from 20% before; 32 hospitals.",
    "e dorëzimeve me gojë të vëzhguara i përfshinin të pesë elementet e I-PASS pas programit, nga 20% më parë; 32 spitale.",
    "der beobachteten mündlichen Übergaben enthielten nach dem Programm alle fünf I-PASS-Elemente, vorher 20 %; 32 Kliniken.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The valve nobody mentioned", "Valvula që nuk e përmendi askush", "Das Ventil, das niemand erwähnte") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Five letters, two studies", "Pesë shkronja, dy studime", "Fünf Buchstaben, zwei Studien") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The handover card", "Karta e dorëzimit", "Die Übergabekarte") },
  ],
  sources: ["handover-cullen-1990", "handover-hse-guidance", "handover-lardner-1999", "handover-starmer-2014", "handover-starmer-2023"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Two good shifts can still lose what lies between them. The handover is the few minutes in which one shift's knowledge becomes the next shift's work, or does not. This issue asks what gets lost there, and what changed where the handover was given a structure.",
        "Dy turne të mira mund ta humbasin prapë atë që qëndron mes tyre. Dorëzimi janë ato pak minuta ku dija e një turni bëhet puna e turnit tjetër, ose nuk bëhet. Ky numër pyet çfarë humbet aty, dhe çfarë ndryshoi aty ku dorëzimit iu dha një strukturë.",
        "Zwei gute Schichten können trotzdem verlieren, was zwischen ihnen liegt. Die Übergabe sind die wenigen Minuten, in denen das Wissen einer Schicht zur Arbeit der nächsten wird, oder nicht. Diese Ausgabe fragt, was dort verloren geht und was sich änderte, wo die Übergabe eine Struktur bekam."),
      body: x(
        "Lord Cullen found that the night shift on Piper Alpha did not know a safety valve was missing, because the handover had not said so. In a refinery, none of fifteen observed handovers showed all the safe behaviours; after structured logs, 71% of those asked saw better logbooks. In nine hospitals, the I-PASS handover went with 23% fewer medical errors; in a later study of 32, complete spoken handovers rose from 20% to 66%. Six marks and a card close the issue.",
        "Lord Cullen gjeti se turni i natës në Piper Alpha nuk e dinte që mungonte një valvul sigurie, sepse dorëzimi nuk e kishte thënë. Në një rafineri, asnjë nga pesëmbëdhjetë dorëzimet e vëzhguara nuk i kishte të gjitha sjelljet e sigurta; pas regjistrave të strukturuar, 71% e të pyeturve panë regjistra më të mirë. Në nëntë spitale, dorëzimi I-PASS shkoi bashkë me 23% më pak gabime mjekësore; në një studim të mëvonshëm me 32, dorëzimet e plota me gojë u rritën nga 20% në 66%. Gjashtë shenja dhe një kartë e mbyllin numrin.",
        "Lord Cullen stellte fest, dass die Nachtschicht auf Piper Alpha nicht wusste, dass ein Sicherheitsventil fehlte, weil die Übergabe es nicht gesagt hatte. In einer Raffinerie zeigte keine von fünfzehn beobachteten Übergaben alle sicheren Verhaltensweisen; nach strukturierten Schichtbüchern sahen 71 % der Befragten bessere Einträge. In neun Kliniken ging die I-PASS-Übergabe mit 23 % weniger Behandlungsfehlern einher; in einer späteren Studie mit 32 stiegen vollständige mündliche Übergaben von 20 % auf 66 %. Sechs Merkmale und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The valve nobody", "Valvula që nuk", "Das Ventil, das"), x("mentioned", "e përmendi askush", "niemand erwähnte")],
      lead: x(
        "On the evening of 6 July 1988 a pressure safety valve on the Piper Alpha platform was off for overhaul; a blank flange sat in its place. When a condensate pump tripped, the night shift set out to restart the other pump, the one under maintenance.",
        "Në mbrëmjen e 6 korrikut 1988, një valvul sigurie e presionit në platformën Piper Alpha ishte hequr për riparim; në vend të saj ishte vënë një fllanxhë e verbër. Kur ra një pompë kondensati, turni i natës u nis ta ndezë pompën tjetër, atë që ishte në mirëmbajtje.",
        "Am Abend des 6. Juli 1988 war auf der Plattform Piper Alpha ein Druckbegrenzungsventil zur Überholung ausgebaut; an seiner Stelle saß ein Blindflansch. Als eine Kondensatpumpe ausfiel, wollte die Nachtschicht die andere Pumpe starten, die in der Wartung war."),
      blocks: [
        { type: "timeline", items: [
          { k: "1987", t: x("A fatal accident on the platform; the company pleads guilty, among other things, to poor communication from the day to the night shift.", "Një aksident vdekjeprurës në platformë; kompania pranon fajin, mes të tjerash, për komunikim të dobët nga turni i ditës te ai i natës.", "Ein tödlicher Unfall auf der Plattform; das Unternehmen bekennt sich unter anderem schuldig, die Tag- an die Nachtschicht schlecht informiert zu haben.") },
          { k: "1988", t: x("6 July, evening: handovers between operators and maintenance do not say that safety valve 504 is out.", "6 korrik, mbrëmja: dorëzimet mes operatorëve dhe mirëmbajtjes nuk thonë që valvula e sigurisë 504 mungon.", "6. Juli, abends: Die Übergaben zwischen Betrieb und Instandhaltung sagen nicht, dass Sicherheitsventil 504 fehlt.") },
          { k: "21:45", t: x("One condensate injection pump trips; the night shift turns to the other.", "Një pompë injektimi kondensati ndalon; turni i natës i drejtohet tjetrës.", "Eine Kondensat-Einspritzpumpe fällt aus; die Nachtschicht wendet sich der anderen zu.") },
          { k: "22:00", t: x("First explosion. Of 226 men on the platform, 165 die; 61 survive.", "Shpërthimi i parë. Nga 226 burra në platformë, 165 vdesin; 61 mbijetojnë.", "Erste Explosion. Von 226 Männern auf der Plattform sterben 165; 61 überleben.") },
        ] },
        { type: "p", text: x(
          "Lord Cullen traced the night shift's ignorance to failures in passing on information at shift handover and in the permit to work. There were no written procedures for handovers, and maintenance was not always set out in the operators' logs.",
          "Lord Cullen e gjeti burimin e mosdijes së turnit të natës te dështimet në përcjelljen e informacionit në dorëzimin e turnit dhe te leja e punës. Nuk kishte procedura të shkruara për dorëzimet, dhe mirëmbajtja nuk shënohej gjithmonë në regjistrat e operatorëve.",
          "Lord Cullen führte das Unwissen der Nachtschicht auf Versäumnisse bei der Weitergabe von Informationen in der Schichtübergabe und im Erlaubnisscheinsystem zurück. Es gab keine schriftlichen Verfahren für Übergaben, und Instandhaltung stand nicht immer in den Schichtbüchern.") },
        { type: "callout", reading: true, text: x(
          "The warning came the year before, with a death and a guilty plea. The handover practice did not change.",
          "Paralajmërimi erdhi një vit më parë, me një vdekje dhe një pranim faji. Mënyra e dorëzimit nuk ndryshoi.",
          "Die Warnung kam im Jahr davor, mit einem Todesfall und einem Schuldeingeständnis. Die Übergabepraxis änderte sich nicht.") },
      ],
      note: x(
        "From the Cullen report (1990), paragraphs 1.4–1.11, 11.13 and 11.16; times are the report's approximations. The causes were many; this page follows the handover. Witnesses told the inquiry handover practice had not changed after 1987.",
        "Nga raporti Cullen (1990), paragrafët 1.4–1.11, 11.13 dhe 11.16; orët janë përafrime të raportit. Shkaqet ishin shumë; kjo faqe ndjek dorëzimin. Dëshmitarët i thanë hetimit se mënyra e dorëzimit nuk kishte ndryshuar pas 1987-s.",
        "Aus dem Cullen-Bericht (1990), Absätze 1.4–1.11, 11.13 und 11.16; Uhrzeiten sind Näherungen des Berichts. Die Ursachen waren viele; diese Seite folgt der Übergabe. Zeugen sagten aus, die Übergabepraxis habe sich nach 1987 nicht geändert."),
      source: ["handover-cullen-1990"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Fifteen handovers,", "Pesëmbëdhjetë dorëzime,", "Fünfzehn Übergaben,"), x("one refinery", "një rafineri", "eine Raffinerie")],
      lead: x(
        "In 1994–95 the psychologist Ronald Lardner worked with a large UK oil refinery that had had no handover incident but saw room to improve. He watched fifteen operator handovers against a list of safe behaviours, then helped the staff design structured logs for about 55 posts.",
        "Më 1994–95, psikologu Ronald Lardner punoi me një rafineri të madhe nafte në Britani që nuk kishte pasur incident nga dorëzimi, por shihte vend për përmirësim. Vëzhgoi pesëmbëdhjetë dorëzime operatorësh me një listë sjelljesh të sigurta, pastaj ndihmoi stafin të hartonte regjistra të strukturuar për rreth 55 poste.",
        "1994–95 arbeitete der Psychologe Ronald Lardner mit einer großen britischen Ölraffinerie, die keinen Übergabevorfall gehabt hatte, aber Verbesserungsbedarf sah. Er beobachtete fünfzehn Übergaben anhand einer Liste sicherer Verhaltensweisen und half dann dem Personal, strukturierte Schichtbücher für rund 55 Stellen zu gestalten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "0 / 15", t: x("observed handovers had all the safe behaviours; only one receiver took notes", "dorëzime të vëzhguara i kishin të gjitha sjelljet e sigurta; vetëm një marrës mbajti shënime", "beobachtete Übergaben zeigten alle sicheren Verhaltensweisen; nur ein Übernehmender schrieb mit") },
          { n: pc(20), t: x("showed no sign of preparing; handovers lasted 1 to 11 minutes", "nuk treguan asnjë shenjë përgatitjeje; dorëzimet zgjatën 1 deri në 11 minuta", "zeigten keine Vorbereitung; Übergaben dauerten 1 bis 11 Minuten") },
        ] },
        { type: "hbars", max: 100, source: ["handover-lardner-1999"],
          label: x("38 staff asked about 3 months after the structured logs (1999)", "38 punonjës të pyetur rreth 3 muaj pas regjistrave të strukturuar (1999)", "38 Beschäftigte, rund 3 Monate nach den strukturierten Schichtbüchern befragt (1999)"),
          items: [
            { k: x("There had been a need to improve", "Kishte nevojë për përmirësim", "Es gab Verbesserungsbedarf"), v: 66, n: pc(66) },
            { k: x("Logbooks are filled in better", "Regjistrat plotësohen më mirë", "Schichtbücher werden besser geführt"), v: 71, n: pc(71), alert: true },
            { k: x("Handovers are conducted better", "Dorëzimet bëhen më mirë", "Übergaben laufen besser"), v: 66, n: pc(66) },
          ] },
        { type: "callout", reading: true, text: x(
          "Every handover was face to face, and still none had everything. Talking is not yet a handover.",
          "Çdo dorëzim u bë sy më sy, dhe prapë asnjë nuk i kishte të gjitha. Të flasësh nuk do të thotë ende të dorëzosh.",
          "Jede Übergabe fand von Angesicht zu Angesicht statt, und doch hatte keine alles. Reden ist noch keine Übergabe.") },
      ],
      note: x(
        "One refinery, one observed shift, opinions not error counts; the bars are shares of 38 people asked. The paper is dated 1999. Read in full on HSE's site.",
        "Një rafineri, një turn i vëzhguar, mendime e jo numërime gabimesh; shiritat janë pjesë të 38 të pyeturve. Artikulli mban datën 1999. Lexuar i plotë në faqen e HSE-së.",
        "Eine Raffinerie, eine beobachtete Schicht, Meinungen statt Fehlerzahlen; die Balken sind Anteile der 38 Befragten. Der Beitrag ist auf 1999 datiert. Vollständig auf der Website der HSE gelesen."),
      source: ["handover-lardner-1999"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What the handover", "Çfarë mbart", "Was die Übergabe"), x("carries", "dorëzimi", "trägt")],
      lead: x(
        "HSE describes an effective handover in three parts: the outgoing person prepares, both sides talk it through, and the incoming person cross-checks before taking over. Two structures fill the middle part: one from a refinery, one from hospitals.",
        "HSE e përshkruan një dorëzim të mirë në tri pjesë: ai që largohet përgatitet, të dy palët e kalojnë së bashku, dhe ai që vjen kontrollon para se të marrë përgjegjësinë. Dy struktura e mbushin pjesën e mesit: njëra nga një rafineri, tjetra nga spitalet.",
        "Die HSE beschreibt eine wirksame Übergabe in drei Teilen: Die abgebende Person bereitet vor, beide gehen es gemeinsam durch, und die übernehmende Person gleicht ab, bevor sie übernimmt. Zwei Strukturen füllen den mittleren Teil: eine aus einer Raffinerie, eine aus Kliniken."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Refinery log, always", "Regjistri i rafinerisë, gjithmonë", "Schichtbuch der Raffinerie, immer"), items: [
            x("Safety", "Siguria", "Sicherheit"),
            x("Maintenance and technical problems", "Mirëmbajtja dhe problemet teknike", "Instandhaltung und technische Probleme"),
            x("Work outstanding", "Puna e mbetur", "Offene Arbeiten"),
            x("Comments", "Komentet", "Bemerkungen"),
            x("Signatures of the authors", "Nënshkrimet e autorëve", "Unterschriften der Verfasser"),
          ] },
          { h: x("I-PASS, hospitals", "I-PASS, spitalet", "I-PASS, Kliniken"), accent: true, items: [
            x("Illness severity", "Rëndesa e gjendjes", "Schweregrad"),
            x("Patient summary", "Përmbledhja e pacientit", "Patientenzusammenfassung"),
            x("Action list", "Lista e veprimeve", "Aufgabenliste"),
            x("Situational awareness and contingency planning", "Vetëdija për situatën dhe planet rezervë", "Situationsbewusstsein und Notfallplanung"),
            x("Synthesis by the receiver", "Përmbledhja nga marrësi", "Zusammenfassung durch den Übernehmenden"),
          ] },
        ] },
        { type: "p", text: x(
          "Both lists put the critical point first, safety or illness severity, and keep what is still to be done apart from what happened. I-PASS ends with the receiver saying back what was understood: HSE's cross-check, made part of the handover itself.",
          "Të dyja listat e vënë të parën pikën kritike, sigurinë ose rëndesën e gjendjes, dhe e mbajnë atë që mbetet për t'u bërë veç asaj që ndodhi. I-PASS mbyllet me marrësin që thotë çfarë kuptoi: kontrolli i HSE-së, i bërë pjesë e vetë dorëzimit.",
          "Beide Listen stellen das Kritische an den Anfang, Sicherheit oder Schweregrad, und trennen das, was noch zu tun ist, von dem, was geschah. I-PASS endet damit, dass der Übernehmende wiedergibt, was er verstanden hat: der Abgleich der HSE als Teil der Übergabe selbst.") },
        { type: "callout", reading: true, text: x(
          "A list decides what is said every time, whoever is tired or new. The read-back shows whether it was heard.",
          "Një listë vendos çfarë thuhet çdo herë, kushdo qoftë i lodhur ose i ri. Përsëritja nga marrësi tregon nëse u dëgjua.",
          "Eine Liste legt fest, was jedes Mal gesagt wird, wer auch immer müde oder neu ist. Die Wiedergabe zeigt, ob es gehört wurde.") },
      ],
      note: x(
        "The refinery's five mandatory categories as Lardner lists them; posts added others where needed. I-PASS as Starmer et al. (2023) spell it. The comparison is the editors'.",
        "Pesë kategoritë e detyrueshme të rafinerisë siç i rendit Lardner; postet shtuan të tjera kur duheshin. I-PASS siç e shpjegojnë Starmer et al. (2023). Krahasimi është i redaksisë.",
        "Die fünf Pflichtkategorien der Raffinerie, wie Lardner sie aufzählt; einzelne Stellen ergänzten weitere. I-PASS, wie Starmer et al. (2023) es ausschreiben. Der Vergleich stammt von der Redaktion."),
      source: ["handover-hse-guidance", "handover-lardner-1999", "handover-starmer-2023"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Five letters,", "Pesë shkronja,", "Fünf Buchstaben,"), x("two studies", "dy studime", "zwei Studien")],
      lead: x(
        "In paediatric residency programmes at nine hospitals, a handover programme built on I-PASS went with medical errors falling from 24.5 to 18.8 per 100 admissions (2014). Amy Starmer and colleagues then took it to 32 hospitals, 12 of them community hospitals, with 18 months of coaching.",
        "Në programet e specializimit në pediatri në nëntë spitale, një program dorëzimi i ndërtuar mbi I-PASS shkoi bashkë me rënien e gabimeve mjekësore nga 24,5 në 18,8 për 100 shtrime (2014). Amy Starmer dhe kolegët e çuan pastaj në 32 spitale, 12 prej tyre spitale komunitare, me 18 muaj mbështetje nga trajnues.",
        "In pädiatrischen Weiterbildungsprogrammen an neun Kliniken ging ein Übergabeprogramm auf Basis von I-PASS mit weniger Behandlungsfehlern einher: 18,8 statt 24,5 je 100 Aufnahmen (2014). Amy Starmer und Kollegen brachten es dann in 32 Kliniken, 12 davon kommunale Häuser, mit 18 Monaten Begleitung durch Coaches."),
      blocks: [
        { type: "pairs", from: x("Before", "Para", "Vorher"), to: x("After", "Pas", "Nachher"), max: 100, source: ["handover-starmer-2023"],
          label: x("Observed handovers in 32 hospitals, before and after (2023)", "Dorëzime të vëzhguara në 32 spitale, para dhe pas (2023)", "Beobachtete Übergaben in 32 Kliniken, vorher und nachher (2023)"),
          rows: [
            { k: x("Spoken, all five elements", "Me gojë, të pesë elementet", "Mündlich, alle fünf Elemente"), a: 20.0, an: pc(20), b: 66.3, bn: pc(66), alert: true },
            { k: x("Written, all five elements", "Me shkrim, të pesë elementet", "Schriftlich, alle fünf Elemente"), a: 10.4, an: pc(10), b: 73.5, bn: pc(74) },
            { k: x("Receiver's synthesis very good or better", "Përmbledhja e marrësit shumë e mirë a më mirë", "Zusammenfassung des Übernehmenden sehr gut oder besser"), a: 31.4, an: pc(31), b: 83.1, bn: pc(83) },
          ] },
        { type: "p", text: x(
          "Harm linked to handovers, as residents reported it, fell by 47% per person-year. In the nine hospitals, spoken handovers took 2.4 minutes per patient before and 2.5 after: the structure did not make them longer.",
          "Dëmi i lidhur me dorëzimet, siç e raportuan mjekët specializantë, ra me 47% për person në vit. Në nëntë spitalet, dorëzimet me gojë zgjatën 2,4 minuta për pacient para dhe 2,5 pas: struktura nuk i zgjati.",
          "Schäden im Zusammenhang mit Übergaben, wie Assistenzärzte sie meldeten, sanken um 47 % pro Personenjahr. In den neun Kliniken dauerten mündliche Übergaben vorher 2,4 und nachher 2,5 Minuten pro Patient: Die Struktur verlängerte sie nicht.") },
        { type: "callout", reading: true, text: x(
          "The programme was more than a mnemonic: training, watching live handovers and coaching came with it.",
          "Programi ishte më shumë se një shkurtesë: me të erdhën trajnimi, vëzhgimi i dorëzimeve të vërteta dhe mbështetja.",
          "Das Programm war mehr als eine Eselsbrücke: Schulung, Beobachtung echter Übergaben und Coaching gehörten dazu.") },
      ],
      note: x(
        "Before-and-after comparisons; observers knew the phase, and harm was self-reported (58.6% answered). 2023 read in full; 2014 from its abstract, 10,740 admissions.",
        "Krahasime para dhe pas; vëzhguesit e dinin fazën, dhe dëmi u vetëraportua (u përgjigjën 58,6%). Studimi i 2023-s u lexua i plotë; ai i 2014-s nga abstrakti, 10.740 shtrime.",
        "Vorher-nachher-Vergleiche; Beobachter kannten die Phase, Schäden waren selbst gemeldet (58,6 % antworteten). 2023 im Volltext gelesen; 2014 nach dem Abstract, 10.740 Aufnahmen."),
      source: ["handover-starmer-2023", "handover-starmer-2014"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Watch one", "Shiko një", "Eine Übergabe"), x("handover", "dorëzim", "beobachten")],
      lead: x(
        "Both studies watched handovers rather than asking about them. A manager can do the same: sit in on one handover a week and mark what is there, without stepping in.",
        "Të dy studimet i shikuan dorëzimet në vend që të pyesnin për to. Një menaxher mund të bëjë të njëjtën gjë: të ndjekë një dorëzim në javë dhe të shënojë çfarë ka, pa ndërhyrë.",
        "Beide Studien beobachteten Übergaben, statt danach zu fragen. Eine Führungskraft kann es genauso machen: einmal pro Woche bei einer Übergabe dabei sein und notieren, was vorkommt, ohne einzugreifen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Prepared", "E përgatitur", "Vorbereitet"), p: x("notes or a log ready before the incoming person arrives", "shënime ose regjistër gati para se të vijë ai që merr turnin", "Notizen oder Schichtbuch bereit, bevor die Ablösung kommt") },
          { h: x("Face to face, no distractions", "Sy më sy, pa ndërprerje", "Persönlich, ohne Störung"), p: x("spoken and written together, away from other handovers", "me gojë dhe me shkrim bashkë, larg dorëzimeve të tjera", "mündlich und schriftlich zugleich, abseits anderer Übergaben") },
          { h: x("Safety stated first", "Siguria e thënë e para", "Sicherheit zuerst genannt"), p: x("equipment out of service, work in progress across the change", "pajisjet jashtë punës, puna në vazhdim mes dy turneve", "Geräte außer Betrieb, Arbeiten über den Wechsel hinweg") },
          { h: x("Open apart from done", "E hapura veç të mbyllurës", "Offenes getrennt von Erledigtem"), p: x("each open item with a name and a time", "çdo çështje e hapur me një emër dhe një orë", "jeder offene Punkt mit Namen und Uhrzeit") },
          { h: x("Read back", "E përsëritur nga marrësi", "Wiedergegeben"), p: x("the receiver sums up and asks; the giver corrects", "marrësi përmbledh dhe pyet; dorëzuesi korrigjon", "der Übernehmende fasst zusammen und fragt; der Abgebende korrigiert") },
          { h: x("High risk flagged", "Rreziku i lartë i shënuar", "Hohes Risiko markiert"), p: x("after a long absence, to someone new, in an upset", "pas një mungese të gjatë, te dikush i ri, në një gjendje jo normale", "nach langer Abwesenheit, an jemand Neuen, bei einer Störung") },
        ] },
        { type: "callout", reading: true, text: x(
          "Count the marks, not the minutes. A short handover that has all six beats a long one that has three.",
          "Numëro shenjat, jo minutat. Një dorëzim i shkurtër me të gjashtat është më i mirë se një i gjatë me tri.",
          "Zählen Sie die Merkmale, nicht die Minuten. Eine kurze Übergabe mit allen sechs schlägt eine lange mit dreien.") },
      ],
      note: x(
        "The marks draw on HSE's principles, Lardner's list of safe behaviours and I-PASS; the selection and the weekly sitting-in are the editors'. Fatigue at the end of a shift is in No. 89, rosters in No. 45.",
        "Shenjat mbështeten te parimet e HSE-së, te lista e sjelljeve të sigurta e Lardner-it dhe te I-PASS; përzgjedhja dhe pjesëmarrja javore janë të redaksisë. Lodhja në fund të turnit është te Nr. 89, turnet te Nr. 45.",
        "Die Merkmale stützen sich auf die Grundsätze der HSE, Lardners Liste sicherer Verhaltensweisen und I-PASS; Auswahl und wöchentliches Dabeisein sind Vorschlag der Redaktion. Müdigkeit am Schichtende steht in Nr. 89, Dienstpläne in Nr. 45."),
      source: ["handover-hse-guidance", "handover-lardner-1999", "handover-starmer-2023"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/", more: "why-the-handover-is-underrated",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The handover", "Karta e", "Die Übergabe-"), x("card", "dorëzimit", "karte")],
      lead: x(
        "One card per handover, written before the shift ends and read together face to face. The Shift Handover tool keeps the open items with an owner and carries the unresolved ones into the next shift.",
        "Një kartë për çdo dorëzim, e shkruar para se të mbarojë turni dhe e lexuar bashkë sy më sy. Mjeti Shift Handover i mban çështjet e hapura me një përgjegjës dhe i çon ato të pazgjidhurat te turni tjetër.",
        "Eine Karte pro Übergabe, vor Schichtende geschrieben und gemeinsam von Angesicht zu Angesicht gelesen. Das Werkzeug Shift Handover führt offene Punkte mit einer verantwortlichen Person und trägt die ungelösten in die nächste Schicht."),
      blocks: [
        { type: "form", items: [
          { h: x("State now", "Gjendja tani", "Lage jetzt"), hint: x("how serious things are: normal, watch, or upset", "sa serioze janë gjërat: normale, për t'u ndjekur, ose jo normale", "wie ernst die Lage ist: normal, beobachten oder gestört") },
          { h: x("Safety and work in progress", "Siguria dhe puna në vazhdim", "Sicherheit und laufende Arbeiten"), hint: x("equipment out of service, permits, jobs that cross the change", "pajisjet jashtë punës, lejet, punët që kalojnë mes turneve", "Geräte außer Betrieb, Erlaubnisscheine, Arbeiten über den Wechsel") },
          { h: x("Open items", "Çështjet e hapura", "Offene Punkte"), hint: x("each with its state, an owner and a time; resolved ones apart", "secila me gjendjen, një përgjegjës dhe një orë; të zgjidhurat veç", "jeder mit Stand, verantwortlicher Person und Uhrzeit; Erledigtes getrennt") },
          { h: x("If … then", "Nëse … atëherë", "Wenn … dann"), hint: x("what may happen on the next shift, and what to do if it does", "çfarë mund të ndodhë në turnin tjetër, dhe çfarë bëhet nëse ndodh", "was in der nächsten Schicht passieren kann, und was dann zu tun ist") },
          { h: x("Receiver's read-back", "Përsëritja e marrësit", "Wiedergabe des Übernehmenden"), hint: x("in the receiver's words; questions asked and answered", "me fjalët e marrësit; pyetjet e bëra dhe përgjigjet", "in eigenen Worten; Fragen gestellt und beantwortet") },
          { h: x("Handed over", "Dorëzuar", "Übergeben"), hint: x("time and both names", "ora dhe të dy emrat", "Uhrzeit und beide Namen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the refinery log, I-PASS and HSE's principles; the essay linked below tells the author's own handover practice.",
        "Karta është propozim i redaksisë, i ndërtuar mbi regjistrin e rafinerisë, I-PASS dhe parimet e HSE-së; eseja e lidhur më poshtë tregon praktikën e vetë autorit në dorëzim.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf das Schichtbuch der Raffinerie, I-PASS und die Grundsätze der HSE; der unten verlinkte Essay schildert die eigene Übergabepraxis des Autors."),
      source: ["handover-lardner-1999", "handover-starmer-2023", "handover-hse-guidance"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
