# Management Review Nr. 92 · Mungesat nga sëmundja: çfarë fsheh norma

Blloku: KPI. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/92.js`.

Çfarë u lexua dhe si (3 nëntor 2026):

- **Destatis, "Indikatoren zur Qualität der Arbeit: Krankenstand"** (faqja mban datën 23 korrik 2026), lexuar e plotë,
  bashkë me seritë e të dhënave të grafikut të saj (CSV `2-4-krankenstand.csv`, 1991–2025). Burimi i Destatis-it është
  llogaria e kohës së punës e IAB-së. Pa `via`.
- **Entgeltfortzahlungsgesetz (EntgFG), § 3 dhe § 5**, në gesetze-im-internet.de: lexuar të plota. Pa `via`.
- **Techniker Krankenkasse, Gesundheitsreport 2026 – Arbeitsunfähigkeiten** (83 faqe, autorë Thomas Grobe dhe Sven
  Bessel, aQua-Institut): u lexuan faqet 1–18, pra përmbledhja, kapitulli 2 (popullata) dhe kapitulli 3 deri te
  "Arbeitsunfähigkeit nach Geschlecht und Alter", me figurat 4–8 (figura 8 u pa si imazh). Kapitujt për diagnozat,
  profesionet, aksidentet dhe tabelat e shtojcës nuk u lexuan; asnjë shifër e numrit nuk vjen prej tyre. Pa `via`.
- **DAK-Gesundheit, Gesundheitsreport 2025** (Band 55, IGES Institut; 205 faqe): u lexuan parathënia, përmbledhja e
  rezultateve, hyrja, kapitulli 1 (të dhënat, metoda, anketa), kapitulli 2.1–2.3 deri te rastet sipas kohëzgjatjes, dhe
  i gjithë kapitulli 6 "Vertiefende Analyse zum gestiegenen Krankenstandsniveau" (f. 49–85), me figurat 53 dhe 54 të
  para si imazh (vlerat e tyre nuk janë në tekst). Kapitujt 3–5 dhe 7 (Gen Z) nuk u lexuan; asnjë shifër e numrit nuk
  vjen prej tyre. Pa `via`.

Burime që u provuan e nuk hynë: Aronsson, Gustafsson & Dallner (2000), "Sick but yet at work", JECH, në PubMed Central
(faqja jep vetëm abstraktin, PDF-ja nuk u hap); asnjë shifër e tyre nuk është në numër. Eurostat/OECD nuk u përdorën:
DAK-u vetë shkruan se krahasimi i mungesave të regjistruara mes vendeve vështirësohet nga rregulla të ndryshme.

Nuk përsëritet: burnout-i (Nr. 29) dhe shëndeti mendor në punë (Nr. 75) përmenden në shënimin e faqes 7; norma e
lëndimeve (Nr. 87) trajton një tjetër shifër që varet nga mënyra e numërimit.

Lidhjet: mjeti `/tools/shift-capacity/` (merr "absence allowance" kur llogarit njerëzit për turn) dhe eseja
"kpis-the-team-trusts" (karta e autorit për çdo KPI: çfarë matim, si llogaritet, kush ndikon, standardi, konteksti, çfarë
bëjmë kur devijon; i përgjigjet kartës së mungesave).

Pohime që u hoqën ose u ndryshuan gjatë kontrollit: "nga 1 janari praktikat kaluan te raporti elektronik" u bë "nga
janari, një nga një", sepse DAK-u shkruan njëherë "seit dem 01.07.2022 verpflichtend" (f. 54) e njëherë "Ab 1.10.2022 ...
die technisch dazu in der Lage waren ... Im Laufe des Jahres 2022 ... sukzessive" (f. 2); data e detyrimit nuk hyri.
"Ca. 4,4 Prozent zu rund 5,5 Prozent" (DAK f. 84) nuk hyri, sepse kapitulli 6 dhe figura 5 japin 4,0% për 2021. Ndarja
60:40 fillimisht u shënua "në tremujorin e fundit të 2023-s"; teksti thotë "im Durchschnitt über alle vier Quartale in
2023", dhe u ndreq. Madhësia e anketës së 2015-s (5.209 në figurën 45, 5.175 në kapitullin 1.2) nuk hyri, sepse dy
shifrat ndryshojnë. Raporti 90% i metodës së ditës së parë të muajit (TK f. 14) nuk hyri, sepse 4,54/5,08 jep 89%;
numri jep vetëm dy shifrat dhe arsyen.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Ditë pune me raport mjekësor për punonjës: 2017 10,6; 2018 10,6; 2019 10,9; 2020 11,2; 2021 11,2; 2022 14,8; 2023 15,2; 2024 14,8; 2025 14,6 (kopertina, hyrja, faqja 3, grafiku) | Destatis, seria CSV | U konfirmua te seria: "2017;10.6", "2018;10.6", "2019;10.9", "2020;11.2", "2021;11.2", "2022;14.8", "2023;15.2", "2024;14.8", "2025;14.6"; faqja: "2025 waren Arbeitnehmerinnen und Arbeitnehmer in Deutschland durchschnittlich 14,6 Arbeitstage krankgemeldet" |
| Rritja nga 2021 lidhet, mes të tjerash, me raportin elektronik nga 1.1.2022, që regjistron më plotësisht mungesat e shkurtra (faqja 3, kopertina) | Destatis | U konfirmua: "Der Anstieg gegenüber 2021 (+3,4 Krankheitstage) dürfte unter anderem auf die Einführung der elektronischen Arbeitsunfähigkeitsbescheinigung seit 1.1.2022 zurückzuführen sein. Diese führt zu einer vollständigeren Erfassung der Arbeitsunfähigkeit, da vor allem kurze Arbeitsunfähigkeiten häufiger an die Krankenkasse gemeldet wurden." |
| Destatis numëron vetëm mungesat mbi tri ditë; shifra e vërtetë ka gjasa të jetë më e lartë; burimi IAB (shënimi i faqes 3, faqja 4) | Destatis | U konfirmua: "Bei der Berechnung werden nur Krankmeldungen erfasst, die eine Abwesenheitsdauer von drei Tagen überschreiten. Die Zahl der Krankheitstage dürfte also faktisch höher liegen."; "Quelle: Arbeitszeitrechnung (IAB)"; "durchschnittliche Zahl der Fehltage wegen Arbeitsunfähigkeit je Arbeitnehmerinnen oder Arbeitnehmer" |
| Raporti mjekësor duhet kur paaftësia zgjat më shumë se tri ditë kalendarike, më herët nëse e kërkon punëdhënësi (shënimi i faqes 3) | EntgFG § 5(1) | U konfirmua: "Dauert die Arbeitsunfähigkeit länger als drei Kalendertage, hat der Arbeitnehmer eine ärztliche Bescheinigung ... spätestens an dem darauffolgenden Arbeitstag vorzulegen. Der Arbeitgeber ist berechtigt, die Vorlage der ärztlichen Bescheinigung früher zu verlangen." (Për të siguruarit në arkat publike, § 5(1a): duhet ta bëjnë të vërtetohet dhe ta marrin raportin, jo ta dorëzojnë.) |
| Pagesa nga punëdhënësi deri në gjashtë javë; pastaj Krankengeld nga arka (shënimi i faqes 5) | EntgFG § 3(1); Destatis | U konfirmua: "Anspruch auf Entgeltfortzahlung im Krankheitsfall durch den Arbeitgeber für die Zeit der Arbeitsunfähigkeit bis zur Dauer von sechs Wochen"; Destatis: "Dieser Anspruch besteht in der Regel für maximal sechs Wochen pro Jahr. Danach zahlen die Krankenkassen Krankengeld." |
| Para 2022 punonjësi ia dërgonte vetë arkës kopjen; në anketën e 2024-s 57,5% gjithmonë, 12,5% ndonjëherë, 16,3% kurrë (faqja 3) | DAK (2025), f. 54 dhe 64 | U konfirmua: "Vor der Einführung der eAU wurden die ärztlichen Krankschreibungen von den Versicherten an die Krankenkassen übermittelt."; "etwas mehr als die Hälfte der Beschäftigten (57,5 Prozent) angeben auch vor Einführung der eAU die ärztliche Bescheinigung immer bei der verantwortlichen Krankenkasse eingereicht zu haben, 12,5 Prozent hat das nur manchmal getan. 16,3 Prozent geben an, die Bescheinigungen nie eingereicht zu haben." (baza n = 6.668) |
| eAU u fut më 1.1.2022; praktikat kaluan gjatë 2022-s (faqja 3) | DAK (2025), f. 2 dhe 54; Destatis | U konfirmua: "Die Einführung wurde auf den 01.01.2022 verschoben"; "Im Laufe des Jahres 2022 sind alle Arztpraxen sukzessive auf diese Verfahren umgestiegen." |
| TK 2025: 18,5 ditë për vit sigurimi, normë 5,08%; ditë kalendarike; Erwerbspersonen (në punë dhe me Arbeitslosengeld); të standardizuara sipas moshës dhe gjinisë; 6,2 milionë (faqja 4) | TK (2026), f. 3, 6, 10 | U konfirmua: "durchschnittlich 18,5 Fehltage je Versicherungsjahr, was einem Krankenstand von 5,08 Prozent entspricht"; "Erwerbspersonen, zu denen neben den Berufstätigen auch Beziehende von Arbeitslosengeld zählen"; "geschlechts- und altersstandardisierte Ergebnisse"; "aktuell 6,2 Millionen". Ditët kalendarike: 18,5/365 = 5,07% |
| DAK 2024: normë 5,4% = 1.967,4 ditë për 100 vjet sigurimi mbi 366 ditë; pjesa e të sëmurëve në një ditë kalendarike mesatare (faqja 4) | DAK (2025), f. 11 dhe 17 | U konfirmua: "Der Krankenstand gibt an, wie viel Prozent der Erwerbstätigen an einem Kalendertag durchschnittlich arbeitsunfähig erkrankt waren."; "Verteilt man die im Jahr 2024 je 100 Versicherte angefallenen 1.967,4 Arbeitsunfähigkeitstage auf die 366 Kalendertage des Jahres 2024, so waren an jedem Tag 5,4 Prozent ... arbeitsunfähig erkrankt." |
| Statistika e BMG-së mbështetet në ditën e parë të muajit; TK e rillogariti: 4,54% kundrejt 5,08% (2025); 2 ditë bien gjithmonë në festë, 4 të tjera më 2025 dolën me mungesa nën mesatare (faqja 4, grafiku) | TK (2026), f. 12 dhe 14 | U konfirmua: "Statistik des Bundesministeriums für Gesundheit (BMG) ... lediglich auf Stichtagswerten zu Krankenständen jeweils am Monatsersten"; seria 2011–2025 mbaron me "4,72 Prozent und 4,54 Prozent"; "Im Jahr 2025 gingen, neben den zwei Stichtagen, die ... in jedem Jahr auf einen Feiertag fallen, vier weitere Stichtage ... als Werte mit unterdurchschnittlichen Fehlzeiten in die Berechnungen ein"; "Je mehr Monatserste auf Wochenenden und Feiertage fallen ..., umso mehr unterschätzt die Stichtagsstatistik den realen Krankenstand." |
| TK 2025 sipas kohëzgjatjes (raste/ditë): 1–3 ditë 40,0/7,4; 4–7 32,3/14,5; 8–14 15,4/14,0; 15–28 6,5/11,4; 29–42 2,3/7,0; mbi 42 3,6/45,7; shifra të papërpunuara (hyrja, faqja 5, grafiku; redaksia bashkoi 15–42: 8,8/18,4) | TK (2026), f. 16, figura 8 | U konfirmua te teksti: "40,0 Prozent aller AU-Meldungen dauerten weniger als vier Tage. Mit 72,3 Prozent ... über maximal eine Woche. Diesen Fällen sind allerdings lediglich 21,9 Prozent der gesamten gemeldeten Fehlzeiten zuzuordnen. Demgegenüber entfallen auf die 3,6 Prozent der Krankmeldungen mit einer Dauer von mehr als sechs Wochen mit 45,7 Prozent"; figura 8 ("Rohwerte") u pa si imazh me të gjitha vlerat |
| Raportet deri në tri ditë numërohen jo plotësisht (shënimi i faqes 5) | TK (2026), f. 16 | U konfirmua: "können AU-Meldungen mit einer Dauer von bis zu drei Tagen in Daten von Krankenkassen nur lückenhaft erfasst sein" |
| Norma = raste × kohëzgjatje mesatare / 365 (faqja 5, hyrja) | DAK (2025), f. 16 | U konfirmua te formula: "KS in % = Anzahl der AU-Fälle je 100 Vj × Dauer einer Erkrankung / 365" (për vitet e brishta 366) |
| DAK: norma 4,0% (2021) → 5,5% (2022); 94% e rasteve shtesë deri në 14 ditë, 80% e ditëve shtesë (faqja 6) | DAK (2025), f. 49 dhe 52 | U konfirmua: "Von 2021 auf 2022 stieg der Krankenstand dann sprunghaft von 4,0 Prozent auf 5,5 Prozent"; "die Zunahme der AU-Fälle zu 94 Prozent durch mehr Krankschreibungen mit einer Dauer von bis zu 14 Tagen, diese Fälle sind ursächlich für 80 Prozent des Fehltageanstiegs" |
| J06 (infeksionet e rrugëve të sipërme të frymëmarrjes) = 35% e ditëve shtesë (faqja 6) | DAK (2025), f. 52 | U konfirmua: "Den akuten Infektionen der oberen Atemwege (J06) sind rund 35 Prozent des Fehltageanstiegs zuzuschreiben" |
| J06: të trajtuar 9,7% (TM4 2019) → 20,1% (TM4 2023); raporte të pritura 8,8%, të marra 13,8%; 60% e rritjes nga eAU, 40% nga trajtimi, mesatarisht për 2023 (faqja 6) | DAK (2025), f. 57–59 | U konfirmua: "im vierten Quartal 2019 9,7 Prozent"; "Im vierten Quartal 2023 wurden 20,1 Prozent"; "für 8,8 Prozent der DAK-versicherten Beschäftigten Krankschreibungen ... übermittelt werden"; "sogar für einen Anteil von 13,8 ... übermittelt"; "geht im Durchschnitt über alle vier Quartale in 2023 zu 60 Prozent auf neue elektronische Meldeverfahren zurück und zu 40 Prozent auf eine höhere Behandlungsquote" |
| Të krankgemeldet në 12 muaj sipas anketës: 69,7% (2015), 69,9% (2024); Betroffenenquote në të dhënat e DAK-ut: 50,4% (2015), 63,6% (2024) (faqja 6, grafiku) | DAK (2025), f. 18, 60–61 | U konfirmua: "In der Beschäftigtenbefragung 2024 geben 69,9 Prozent der Beschäftigten an sich innerhalb der letzten zwölf Monate krankgemeldet zu haben"; "2015 lag der Anteil krankgemeldeter Beschäftigter bei 69,7 Prozent"; "die berichtete Betroffenenquote auf Basis der AU-Daten der DAK-Gesundheit 2015 mit 50,4 Prozent"; "2024 hatten 63,6 Prozent der Mitglieder der DAK-Gesundheit mindestens eine Arbeitsunfähigkeit". Ndryshimi 13,2 pikë është llogaritje e redaksisë (thirrja: "13 pikë") |
| DAK: 2,4 milionë anëtarë; anketa 2024: 7.068 punonjës 18–65, online nga forsa, 31 tetor–15 nëntor 2024, e peshuar sipas Mikrozensus-it (shënimi i faqes 6) | DAK (2025), f. 1 dhe 6 | U konfirmua: "rund 2,4 Mio. Mitglieder"; "Beschäftigtenbefragung 2024 von 7.068 Erwerbstätigen"; "durch die forsa Politik- und Sozialforschung GmbH als Online-Befragung realisiert"; "gewichtet, sodass der Datensatz repräsentativ für die abhängig beschäftigte Bevölkerung im Alter von 18 bis 65 Jahren" |
| Punuan të sëmurë në 12 muaj: 62,5% (2024), 67,5% (2015); përfshirë punën nga shtëpia (hyrja, faqja 7) | DAK (2025), f. 68, figura 53 | U konfirmua te figura 53 (si imazh): 2015 "ja 67,5%", 2024 "ja 62,5%"; teksti: "Fast zweidrittel ... Dabei war die Situation krank im Homeoffice gearbeitet zu haben explizit in der vorgelegten Frage eingeschlossen"; "um fünf Prozentpunkte gefallen" |
| Arsyet 2024: kolegët 70,2%; duhej ta mbaroja punën 48,4%; klientët/pacientët 36,5%; Homeoffice 35,5%; frikë nga pasojat 14,6%; shpërblim 1,6%; baza 3.950–4.261 (faqja 7, grafiku dhe shënimi) | DAK (2025), f. 68–69, figura 54 | U konfirmua te teksti ("70,2 Prozent ... ihre Kolleginnen und Kollegen nicht hängen lassen wollten"; "48,4 Prozent ... ihre Arbeit fertigbekommen mussten"; "1,6 Prozent") dhe te figura 54 (si imazh): 36,5%, 35,5%, 14,6%; "Basis: ... 2024 (n = 3.950–4.261)" |
| 92,2% nuk munguan kurrë pa arsye të fortë (shënimi i faqes 7) | DAK (2025), f. 72 | U konfirmua: "92,2 Prozent der Befragten hat in den letzten zwölf Monaten nie ohne triftigen Grund gefehlt" |
| Karta (faqja 8) | Redaksia | Propozim i redaksisë mbi përkufizimet e Destatis-it, TK-së dhe DAK-ut dhe anketën e DAK-ut; shënimi e thotë |
