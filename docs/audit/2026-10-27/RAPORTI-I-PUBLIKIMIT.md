# Raport i shkurtër për publikimin: mbyllja e auditimit teknik të 27 tetorit 2026

Dega `claude/gifted-pasteur-v7n2dw`, Draft PR catalyst-al/stiven-catalyst#363. **Asgjë nuk është bashkuar në `main`,
asgjë nuk është publikuar, Team Sync Worker dhe Cloudflare të paprekura.** Bashkimi dhe publikimi presin vetëm
miratimin tënd përfundimtar.

## 1. Çfarë hyn në publikim

- Fazat 1–3 të auditimit (mjetet, publikimet, shfletuesi), siç i përshkruan `RAPORTI-I-KONSOLIDUAR.md`.
- Tre ndryshimet e miratuara më 27 tetor: radari i Zenith-it, rrota natyrale e mausit (lëvizjet e tjera të buta
  mbeten), kontrasti i arit të Lumen-it në temën e çelët.
- Teksti i privatësisë, shtesë faktike nga kodi në tri gjuhët (`f5701ab4`, `53cf44bc`, `e9184e06`, `7a011db1`; i
  miratuar nga ana editoriale dhe teknike më 28 tetor, jo certifikim ligjor i GDPR-së): kyçja me PIN, pikat e
  rikthimit, fotot, emrat në katër mjete, shenjat "e re" të menysë, service worker-i; baza ligjore vetëm për
  ruajtjen që nis lexuesi; analytics sipas qëllimit, pa pretenduar matje.
- Tre korrigjimet e rollback-ut: skedari i faqes së vjetër hapet; puna e shkruar gjatë kyçjes ruhet si pikë rikthimi
  para hapjes; shembulli i Action Tracker mbetet shembull mes versioneve.

**Nuk hyn:** asnjë ndryshim i planetëve në celular (as 1.5, as adaptiv: mprehtësia dhe identiteti si sot); SEO-02;
asnjë fakt karriere, origjinal shqip, tekst libri apo vendim editorial që pret ty; Team Sync Worker.

## 2. Kontrollet e kryera

| Kontroll | Rezultati |
| --- | --- |
| Build | pa gabim |
| Testet unit (lokalisht dhe në CI) | 1337 / 1337, 0 të anashkaluara |
| Coaching | 54 faqe, 9 udhëtime |
| CI e GitHub-it në PR, Chrome 156.0.8078.4 | `152bd4f5` (kodi përfundimtar): unit 1336 / 1336, shfletuesi 176 / 176, 0 të anashkaluara. Commit-i i dokumenteve pas tij kontrollohet edhe ai në PR |
| Rollback në shfletues real (version i ri → i vjetër → i ri, me ruajtje dhe rikthim) | 90 kontrolle, 2 dështime që janë kufizime të faqes live (shih §3), 0 gabime faqeje |
| Testet e reja të rollback-ut | PIN-i: puna e shkruar gjatë kyçjes ruhet dhe rikthehet nga pika; Action Tracker: i ri → live → i ri, pa prekur dhe me veprim të vetin |
| PDF ↔ HTML | 294 PDF, 0 mospërputhje |
| `main` | `f34b1c4b`, i bashkuar në degë; asnjë commit i ri; bashkim provë pa konflikt |
| Datat (`online-dates.mjs`, provë) | 48 ese/reflektime dhe 54 botime marrin ditën e bashkimit; asnjë datë e parë publikimi nuk lëviz |

## 3. Rreziqet që mbeten (të pranuara nga ti më 27 tetor)

1. **Gjatë një rollback-u, faqja live:**
   - nuk lexon fotot brenda një skedari të ruajtur nga versioni i ri (fotot mbeten në skedar);
   - nuk ka kyçje me PIN: një shfletues i kyçur i tregon mjetet bosh atje, por puna mbetet e sigurt dhe kthehet me
     PIN-in;
   - Pause-n nuk e ruan, dhe një inspektim i paplotë dhomash del "Pass" (sjellja e saj e vjetër).
   Këto nuk ndreqen nga versioni i ri.
2. **Pika "Para hapjes"** ruhet si pikat e tjera: pesë të fundit të këtij lloji (manual, para hapjes së skedarit, para
   rikthimit, para hapjes).
3. **Team Sync:** pas publikimit të faqes, ekipet kalojnë në adresat e reja. Kodet vetëm për lexim, të bëra më parë,
   duhen bërë sërish. Worker-i i ri pret planin e vet (`docs/SYNC-WORKER-MIGRATION.md`).
4. **Pa verifikim:** Firefox, Safari, telefona realë me GPU.
5. **Testi axe i Field Notes në CI:** në runner-in e GitHub-it rrjeti i faqes nuk qetësohet gjithmonë, edhe pse asnjë
   kërkesë e faqes nuk mbetet e hapur (log-u i CI-së te `152bd4f5`). Shkaku nuk u gjet (këtu nuk ndodhi në 72 prova).
   Testi tani pret ngarkimin dhe fontet, që janë ato që mat axe, dhe e shkruan rastin në log.
6. **Klasifikimi ligjor i ruajtjes automatike** (`sc-seen-*`, progresi i leximit, kopjet e service worker-it) nuk u
   verifikua; faqja e privatësisë nuk pretendon bazë ligjore për të. Kërkon verifikim më vete (`VENDIMET-E-HAPURA.md`
   B.5). Analytics nuk mbledh ende asgjë (A-01).
7. **Dy hapa pas bashkimit, me dorë:** `online-dates.mjs` menjëherë pas merge-it, dhe kontrollet në faqen live
   (`docs/RELEASE.md` §3–4). Midis dy publikimeve (disa minuta) datat "redaktuar" tregojnë ditët e mëparshme.

## 4. Hapat e publikimit, kur t'i miratosh

1. PR #363 nga Draft në "Ready", pastaj **"Create a merge commit"**, jo squash e as rebase.
2. Menjëherë pas tij: `node scripts/online-dates.mjs` në `main`, commit i dy skedarëve të datave.
3. Kontrollet në faqen live dhe, nëse duhet, kthimi mbrapsht: `docs/RELEASE.md` §4–5.

Vendimet që presin faktet ose miratimin tënd janë në `VENDIMET-E-HAPURA.md`.
