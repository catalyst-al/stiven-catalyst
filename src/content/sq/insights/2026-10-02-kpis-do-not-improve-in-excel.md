---
title: KPI-të nuk përmirësohen në Excel
date: 2026-10-02T06:00:00Z
category: Operacione
status: published
featured: true
summary: Në Excel, një porosi e paplotë është një numër. Në rampë është një objekt fizik në vendin e gabuar.
teaser: Dashboard-i thoshte “incomplete delivery”. Terreni të detyronte të pyesje nëse gabimi kishte ndodhur te dera e klientit apo që në magazinë.
deck: 'Eseja e tretë e serisë “Dhjetë vite pranë punës”: pse duhet të shkosh aty ku ndodh procesi, para se të kërkosh rezultat nga një tabelë.'
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Merr një numër të kuq nga raporti i sotëm dhe shko aty ku prodhohet.
  - Për një rast, gjej pikën e fundit ku çanta, karroca ose koha ishin ende në rregull.
  - "Shkruaje rastin në të njëjtën strukturë si të fundit: ngjarja, shkaku, veprimi, ndjekja."
checklist:
  title: Një rast, nga tabela te rampa
  fill: true
  items:
    - label: Cili numër më solli këtu?
      hint: KPI-ja dhe vlera e saj, nga raporti i sotëm.
    - label: Ku ishte gjithçka në rregull për herë të fundit?
      hint: "Çanta, karroca, rruga, skanimi: pika e fundit që ishte në rregull."
    - label: Kush e vuri re problemin dhe kur?
      hint: Shoferi, dispeçeri, klienti, auditi.
    - label: Çfarë tregoi rampa që tabela nuk e tregoi?
      hint: Një karrocë e përzier, një etiketë e gabuar, pritje në ngarkim, një portë e hapur.
    - label: Ku në proces filloi?
      hint: Magazina, ngarkimi, nisja, rruga, dera.
    - label: Çfarë kontrollojmë nesër?
      hint: Një kontroll, një përgjegjës, një orë.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: table-to-ramp
---

Raporti tregonte diçka shumë të thjeshtë: klienti nuk e kishte marrë porosinë të plotë. Incomplete. Po ta shohësh vetëm përmes KPI-së, mendimi i parë vjen vetvetiu: shoferi ka harruar një çantë gjatë dorëzimit.

Por kur kontrollon procesin fizik, tabloja ndryshon.

Në një nga rastet që dokumentuam, mungonte një çantë nga një sektor i magazinës. Në raste të tjera, çantat rezultonin të skanuara, por ishte marrë ose dorëzuar çanta e gabuar. Gjetëm edhe karroca të përziera në magazinë, madje edhe një karrocë të plotë që mungonte nga rrjedha normale e ngarkimit.

Dashboard-i thoshte “incomplete delivery”. Në rampë lindte një pyetje tjetër: a ishte gabim i shoferit te dera e klientit, apo porosia kishte dalë e paplotë që nga magazina? Në këtë pyetje qëndron i gjithë dallimi mes një tabele dhe një operacioni.

{diagram}

Tabela mund të të thotë: incomplete = 1. Nuk mund të të thotë çfarë mund të ketë ndodhur fizikisht: çanta u përgatit, hyri në proces, ndoshta madje u skanua, e pastaj përfundoi në karrocën e gabuar ose në itinerarin e gabuar. Në Excel, gabimi është një numër. Në rampë, ka një adresë, dhe kjo adresë nuk del gjithmonë në panelin e treguesve.

Kur doja ta kuptoja një problem operacional, e lija tabelën mënjanë dhe shkoja aty ku ndodhte procesi, që do të thoshte kryesisht rampa dhe zona e ngarkimit.

Aty shihje atë që në Excel nuk ekziston: nëse karrocat ishin të renditura sipas itinerarit apo të përziera, nëse mungonin çanta, nëse etiketat ishin të sakta dhe nëse shoferët skanonin siç duhej. Shihje nëse mallrat e thata, të ftohura dhe të ngrira ndiqnin procesin e duhur, nëse pajisje ose karroca e bllokonin zonën dhe nëse portat, parkimi dhe zona e ngarkimit ishin të organizuara. Mbi të gjitha, shihje nëse një problem që më vonë do të dilte si KPI kishte nisur pikërisht aty.

Mallrat e ftohura dhe të ngrira kishin rregullat e tyre. Produktet e ftohura duhej të skanoheshin brenda zonës së ftohtë, ato të ngrira brenda zonës së tyre. Nëse mungonte një çantë, problemi duhej raportuar dhe karroca nuk duhej të dilte sikur gjithçka ishte në rregull. Një rregull i tillë duket i vogël në letër. Në rampë është dallimi mes një problemi që kapet në kohë dhe një klienti që e merr porosinë të paplotë.

Kishim edhe auditime të rampës dhe kontrolle të drejtpërdrejta të procesit. Por terreni nuk është vetëm vend ku shikon. Është vend ku rindërton atë që ka ndodhur.

Kur mungonte një çantë, pyetjet ishin të thjeshta. Ku u pa për herë të fundit? Ishte në karrocë? Ishte skanuar? Mungonte diçka para nisjes? Kush e vuri re problemin? Ishin të sakta itinerari dhe karroca? Kishte pasur pritje ose ndonjë problem gjatë ngarkimit?

Me vonesat ishte njësoj. Kontrollonim arsyet që jepnin shoferët: kur një shofer raportonte trafik, parkim ose semafor, duhej parë nëse kjo përputhej me realitetin. Në disa raste kishim foto ose pamje ekrani të situatës në rrugë.

Mësova se një version i vetëm nuk mjafton, as ai i tabelës, as ai i një personi. Duhet ta lidhësh atë që thotë shoferi ose dispeçeri me atë që ka ndodhur realisht në proces.

Dhe ajo që sheh duhet shënuar, përndryshe nesër është vetëm një kujtim. Për operacionin shkruaja raporte ditore të strukturuara, ku çdo rast shtohej me të njëjtën strukturë si i mëparshmi. Rastet e veçanta kalonin në komunikim operacional me shkrim, me përshkrimin e incidentit dhe të shkakut. Fotot dhe pamjet e ekranit i përdornim kur duheshin për të dokumentuar situata reale: trafik ose parkim në rrugë, por edhe probleme fizike në rampë, si karroca të çrregullta, kuti ose karroca në vend të gabuar, porta të hapura ose një zonë ngarkimi e organizuar keq.

Me kalimin e kohës, kontrollet u bënë shumë më të strukturuara: përputhja e çdo karroce me itinerarin e saj, kontrolli i mallrave të thata, të ftohura dhe të ngrira, auditimet e rampës, analiza me Pareto dhe 5 Why. Paraskanimin dhe kontrollet përfundimtare të plotësisë i rekomandova; nuk mund të them se u zbatuan. Më vonë punova edhe me struktura më të organizuara, ku çdo rast kishte incidentin, veprimin, shkakun dhe ndjekjen e KPI-së. Të gjitha këto lindën nga ajo që shihej në rampë.

Tabela gjithsesi ka vlerën e saj: pa të nuk do ta dije as që duhet të shkosh në rampë. Por tabela është pika e nisjes, jo përgjigjja. Po ta trajtosh numrin si përgjigje, e ndëshkon shoferin për një çantë që nuk ka qenë kurrë në karrocën e tij.
