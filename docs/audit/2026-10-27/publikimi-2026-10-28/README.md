# Publikimi i 28 tetorit 2026: hapat dhe kontrollet live

Me miratimin përfundimtar të autorit, sipas `docs/RELEASE.md`. Team Sync Worker dhe konfigurimi i Cloudflare nuk u
prekën.

## Hapat

| Hapi | Rezultati |
| --- | --- |
| PR catalyst-al/stiven-catalyst#363 nga Draft në Ready, merge me "Create a merge commit" | merge commit `5371dec8` mbi `f34b1c4b` |
| Publikimi i merge-it (run 773) | build, `npm test`, coaching, testet e shfletuesit dhe deploy: të gjitha me sukses; live në 07:26 UTC |
| `node scripts/online-dates.mjs` në `main` (`RELEASE.md` §3) | commit `669b34d3`; build OK, `npm test` 1337 / 1337 |
| Publikimi i datave (run 774) | me sukses; live në 07:39 UTC |

Datat:
- `online.json`: 54 publikime marrin `modified` = 2026-10-28; asnjë `published` nuk lëviz.
- `edited.json`: 76 ese dhe reflektime në anglisht dhe gjermanisht, të ndryshuara nga merge-i, marrin 2026-10-28.
  Të tjerat marrin ditët e tyre nga historia first-parent e `main`. Asnjë datë nuk shkon më herët dhe asnjë origjinal
  shqip nuk merr ditën e merge-it. Prova "në thatë" e 27 tetorit kishte numëruar 48. Të 76 janë skedarë që merge-i i
  ndryshoi. Dallimi duket të vijë nga disa ese gjermane të ndryshuara edhe në `main` më 27 tetor (#362): në provë, kur
  merge-i kishte po atë ditë, ato u numëruan si të `main`-it. Kjo nuk u verifikua.

## Kontrollet live (Chrome 156, https://stivencatalyst.com)

`live-check.mjs` është skripti; `search-check.mjs` kontrollon kërkimin në DE dhe SQ me fjalët e gjuhës. Skripti nuk
ngarkon beacon-in e Cloudflare, që kontrollet të mos numërohen si vizita.

| Run | Skedarët | Rezultati |
| --- | --- | --- |
| Pas merge-it, para datave | `merge.log`, `results-merge.json` | 112 / 115 |
| Pas datave, versioni përfundimtar | `final.log`, `results-final.json` | 113 / 115 |
| Kërkimi DE ("Übergabe") dhe SQ ("dorëzim") | `search.log` | 2 / 2 |

Dështimet nuk janë probleme të faqes:
- `merge.log`: 3 kontrolle kërkimi. Versioni i parë i skriptit priste ArrowDown dhe e mori ndryshimin e `?q=` në adresë
  si lëvizje te rezultati. Skripti i arkivuar është versioni i ndrequr, që ndjek rrugën e testit të CI-së: shkruaj,
  Tab te rezultati i parë, Enter.
- `final.log`: kërkimi DE dhe SQ me fjalën angleze "handover" nuk jep rezultate, siç pritet. Me fjalët e gjuhës
  (`search.log`) kërkimi hap rezultatin.

Me këtë, të gjitha kontrollet kalojnë:
- 81 faqe në EN/DE/SQ (kryefaqja, një ese, një reflektim, Management Review nr. 80 dhe arkivi, Field Notes, mjetet,
  "How this is made", Tools Guide, libri, privatësia, kërkimi, botimet dhe 14 mjete): 200, versionet e CSS/JS njësoj
  si build-i i bashkuar, asnjë gabim në konsolë ose në skript.
- Planetët vizatohen dhe lëvizin në tri gjuhët; Pause i ndal dhe mbahet mend pas rifreskimit; me "reduce motion"
  faqja nis e ndalur.
- Kërkimi me tastierë hap një rezultat në tri gjuhët.
- Management Review: nr. 41 "October 2026", shënimi i korrigjimit te nr. 6, regjistri i korrigjimeve në arkiv; "How
  this is made" përmend origjinalet shqip; Tools Guide, botimi 8.
- 6 PDF (nr. 80 dhe Tools Guide, EN/DE/SQ): 200, `%PDF-`, madhësia e build-it.
- Printimi i Andon-it dhe i nr. 80: asnjë tabelë ose grafik jashtë faqes, asnjë grafik bosh.
- Leximi me zë: lexuesi dhe shënimi i zërit janë në faqe. Leximi deri në fund të tekstit nuk u testua live.
- Privatësia: teksti i miratuar në tri gjuhët.
- Sitemap-i: `lastmod` i nr. 80 = 2026-10-28.

Me dorë, me `curl`, pas datave: reflektimi gjerman *Architects of smoke* ka `dateModified` 2026-10-28 dhe origjinali
shqip 2026-10-20; *Management Review 2026-09* ka `datePublished` 2026-10-04 dhe `dateModified` 2026-10-28.

## Shënim për `RELEASE.md` §4

Hapi i kërkimit thotë "type, arrow down, Enter". Faqja nuk e ka trajtuar kurrë ArrowDown, as para merge-it
(`src/js/search.js`). Rruga me tastierë është Tab te rezultati, pastaj Enter, siç e teston CI-ja
(`tests/browser/journeys.spec.mjs`). Kjo është pasaktësi e dokumentit, jo regresion; dokumenti nuk u ndryshua.

## Rikthimi

`git revert 669b34d3` (datat), pastaj `git revert -m 1 5371dec8`, push në `main`: GitHub Pages publikon faqen e
mëparshme brenda pak minutash (`RELEASE.md` §5).
