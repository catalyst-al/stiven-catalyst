# Phase 2: the author's professional timeline — statements and contradictions (for the author's decision)

**Status: list only. No fact was changed.** On the author's instruction of 27 October 2026 ("a list of contradictions in the author's professional timeline, without changing facts until he approves"), nothing in the site, the magazines or the drafts was edited. Once the author answers the questions at the end of section 2, the places listed there are corrected with a dated note, in the three languages.

Read only, 27 October 2026.
Scope searched: `src/content/{,de/,sq/}{insights,reflections,notes,projects}`, `src/_includes/pages/about.njk`, `start.njk`, `home.njk`, `src/_data/*` (site.json, review.js, homeEssays.json, edited.json, projectPortfolio, cvBuilder, ui.json DE/SQ), `src/_includes/partials/structured-data.njk`, `lib/floor/*.js` (magazine "From the Floor" / "Nga terreni"), `README.md`, `docs/` (excluding `docs/audit/`).

Method: every quote below was checked against its file and line with a script (`sed -n Np | grep -F`). Quotes are verbatim fragments; "…" marks a cut.

Dates: "Dated" is the front-matter `date`. Every essay cited here is listed in `src/_data/edited.json` as last edited **2026-10-17** (EN, DE and SQ alike), so that column is not repeated. The About page and the interface strings carry no date. Magazine items carry their issue month. `docs/` items are drafts or scheduled LinkedIn posts (not on the site, but meant to be published under the author's name).

Things that hold no timeline facts (checked):
- **Structured data:** `src/_includes/partials/structured-data.njk:8-16` builds a schema.org Person with only name, url, image, email and sameAs. There is no jobTitle, worksFor or alumniOf, so it cannot conflict with the prose.
- **Data files:** `site.json`, `projectPortfolio.json` and `cvBuilder.json` hold none either. The CV examples belong to a fictional "Elena Marku", including a "Night Manager 01.2020–02.2022" role at `cvBuilder.json:100`, which is not the author's.
- **Other content:** reflections, field notes, projects, README and the book hold no author career facts.

---

## 1. Statements

### 1.1 Career sequence in Germany (the only full chronology)

| file:line | lang | exact quote | dated |
|---|---|---|---|
| src/content/insights/2026-10-01-starting-from-zero.md:46 | EN | "In November 2021 I joined a last-mile delivery company, first behind the wheel as a parcel courier and later in dispatch, and stayed until June 2022." | 2026-10-01 |
| same :46 | EN | "I worked as a steward from July 2022 until April 2023, and in May 2023 I started as night auditor at a hotel in Frankfurt." | 2026-10-01 |
| same :46 | EN | "From December 2023 to October 2024 I was delivering parcels again alongside the night audit." | 2026-10-01 |
| same :46 | EN | "Care followed, from October 2024 to January 2025, as a care assistant (Pflegehelfer)." | 2026-10-01 |
| same :46 | EN | "In January 2025 I went back to last mile as Team Leader On Road, and in June 2025 I became Area Manager." (the chronology ends here) | 2026-10-01 |
| same :66 | EN | "… then to night audit, to Team Leader and to Area Manager." | 2026-10-01 |
| src/content/de/insights/2026-10-01-starting-from-zero.md:39 | DE | same dates; ends "im Juni 2025 wurde ich Area Manager." | 2026-10-01 |
| src/content/sq/insights/2026-10-01-starting-from-zero.md:39 | SQ | same dates; ends "në qershor 2025 u bëra Area Manager." | 2026-10-01 |
| src/content/insights/2026-10-08-teams-with-many-languages.md:42 | EN | "I came to Germany in November 2021" (DE :36, SQ :36 same) | 2026-10-08 |
| src/_includes/pages/about.njk:57-58 | EN | "2021 – 2024" · "Started again as a parcel courier, then dispatch for 70+ drivers a shift at a delivery station; night audit and front office at hotels in Frankfurt, for a time alongside parcel delivery." (DE/SQ `ui.json:647-648`) | – |
| src/_includes/pages/about.njk:14 | EN | "In Germany he started again from the ground up, as a parcel courier and a night auditor, and worked his way back into leadership." (DE/SQ `ui.json:2161`) | – |
| src/_data/homeEssays.json:5 | – | `starting-from-zero` is the first of the three homepage picks ("Chosen and confirmed by the author on 17 October 2026") | – |

### 1.2 Last-mile dispatch, 2021–2022

| file:line | lang | exact quote | dated |
|---|---|---|---|
| src/content/insights/2026-10-02-what-last-mile-taught-me.md:35 | EN | "as a dispatcher with more than 70 drivers on a shift, and then as Team Leader and Area Manager, with four Shift Leaders, eight dispatchers and around 250 drivers" (DE :26, SQ :26 same) | 2026-10-02 |
| src/content/insights/2026-10-03-the-industry-changes-management-problems-do-not.md:53 | EN | "As a dispatcher I coordinated more than 70 drivers in a shift" (DE :46, SQ :46 same) | 2026-10-03 |

### 1.3 Night audit: start, end, which hotel(s)

| file:line | lang | exact quote | dated |
|---|---|---|---|
| starting-from-zero.md:46 | EN | "in May 2023 I started as night auditor at a hotel in Frankfurt" (no end date anywhere) | 2026-10-01 |
| about.njk:57-58 | EN | "2021 – 2024" … "night audit and front office at hotels in Frankfurt" | – |
| src/content/insights/2026-10-03-what-a-night-auditor-learns.md:40 | EN | "I learned this as a Night Auditor in a hotel in Germany." (DE :33, SQ :33) | 2026-10-03 |
| same :44 | EN | "At the start I take the handover from the previous shift" (present tense) | 2026-10-03 |
| same :76 | EN | "In the first weeks my attention was, naturally, on the list" (DE :69, SQ :69) | 2026-10-03 |
| src/content/insights/2026-10-03-the-industry-changes-management-problems-do-not.md:55 | EN | "During the night I check reservations, no-shows, payments, credit and financial m[atters]" (present tense) | 2026-10-03 |
| src/content/insights/2026-10-10-the-angry-guest-at-2am.md:45 | EN | "As Night Auditor I dealt with the problems" (DE :40, SQ :40) | 2026-10-10 |
| src/content/insights/2026-10-13-the-night-the-system-went-down.md:45 (17 Oct note) | EN | "I had already worked in hotel night operations for years" | 2026-10-13 |

### 1.4 Team Leader On Road and promotion to Area Manager

| file:line | lang | exact quote | dated |
|---|---|---|---|
| starting-from-zero.md:46 | EN | "In January 2025 I went back to last mile as Team Leader On Road, and in June 2025 I became Area Manager." | 2026-10-01 |
| src/content/insights/2026-10-02-leading-people-without-losing-the-person.md:65 | EN | "After about five months I moved from Team Leader to Area Manager." (DE :57 "Nach etwa fünf Monaten", SQ :57 "Pas rreth pesë muajsh") | 2026-10-02 |
| src/content/insights/2026-10-08-talking-to-someone-who-made-a-mistake.md:83 | EN | "In January 2025 I started as a Team Leader On Road, and a few months later I became an Area Manager." (DE :80, SQ :80) | 2026-10-08 |
| about.njk:53-54 | EN | "2025" · "Promoted after five months." (DE/SQ `ui.json:646`) | – |
| src/_data/review.js:306 | EN | "When I moved from Team Leader On Road to Area Manager after about five months" (SQ :307, DE :308) | Sept 2026 special edition |
| lib/floor/01.js:209 | EN/SQ/DE (one line) | answer: "When I moved from a role closer to the operation to Area Manager, after about five months" | Oct 2026 issue |

### 1.5 Area Manager team size

| file:line | lang | exact quote | dated |
|---|---|---|---|
| leading-people…:65 | EN | "four Shift Leaders and eight dispatchers, with indirect responsibility for around 250 drivers" | 2026-10-02 |
| src/content/insights/2026-10-10-high-volume-days.md:42 | EN | "As Area Manager I had four Shift Leaders and eight dispatchers." (DE :38, SQ :38) | 2026-10-10 |
| about.njk:15 | EN | "As Area Manager for last-mile operations in 2025 he led four shift leads and eight dispatchers, with about 250 drivers on the road." (DE/SQ `ui.json:2156`) | – |
| about.njk:20-21 | EN | stats "12" shift leads and dispatchers led; "~250" drivers | – |
| docs/shperndarja-linkedin.md:211 · docs/kalendari-linkedin.md:1225 (DE) / :1241 (SQ) | DE/SQ | "… später als Area Manager eine ganze Station." / "… më vonë si Area Manager një stacion të tërë." | LinkedIn post scheduled Thu 10 Dec |

All figures (4 / 8 / ~250 / 12) agree everywhere.

### 1.6 Area Manager: end of the role

| file:line | lang | exact quote | dated |
|---|---|---|---|
| about.njk:15 | EN | "As Area Manager for last-mile operations in 2025 …" | – |
| about.njk:53 | EN | timeline block dated "2025" (no end month) | – |
| src/content/insights/2026-10-10-when-improvement-fades.md:51 | EN | "In 2025 I worked as a Team Leader and then as an Area Manager in last mile. Later I moved to remote coordination." (DE :47, SQ :47) | 2026-10-10 |
| src/content/insights/2026-10-10-80-vehicles-you-cannot-see.md:45 | EN | "In 2025, as a Team Leader and then as an Area Manager, I was in the operation" (DE :39, SQ :39) | 2026-10-10 |
| docs/shperndarja-linkedin.md:263 | DE | LinkedIn headline draft: "Last-Mile-Operations (Area Manager) & Hotel Night Management" (followed at :265 by "Titullin e parë e përshtat me rolin aktual") | draft |

No text gives an end month for Area Manager.

### 1.7 Night Manager since November 2025

| file:line | lang | exact quote | dated |
|---|---|---|---|
| about.njk:15 | EN | "Since November 2025 he has been Night Manager at a Radisson Group hotel in Frankfurt, and since January 2026 he has also coordinated more than 80 vehicles from home" | – |
| about.njk:49-50 | EN | "2025 – today" · "Night Manager at a Radisson Group hotel in Frankfurt since November 2025: the night shift and the front office." | – |
| src/_data/de/ui.json:2156, :2158 | DE | "Seit November 2025 ist er Night Manager in einem Hotel der Radisson-Gruppe in Frankfurt" | – |
| src/_data/sq/ui.json:2156, :2158 | SQ | "Që nga nëntori 2025 është Night Manager në një hotel të grupit Radisson në Frankfurt" | – |
| src/content/insights/2026-10-13-the-tools-you-build-yourself.md:45 (15 Oct note) | EN | "I have been the hotel’s Night Manager since November 2025, so the date is removed." | 2026-10-13 |
| src/content/de/insights/2026-10-13-the-tools-you-build-yourself.md:39 | DE | "Ich bin seit November 2025 Night Manager des Hotels, daher ist das Datum entfernt." | 2026-10-13 |
| src/content/sq/insights/2026-10-13-the-tools-you-build-yourself.md:39 | SQ | "Jam Night Manager i hotelit që nga nëntori 2025, prandaj data u hoq." | 2026-10-13 |
| src/content/insights/2026-10-13-the-night-the-system-went-down.md:43 (15 Oct note) | EN | "I have been the hotel’s Night Manager since November 2025, so the date is removed." (DE :37, SQ :37) | 2026-10-13 |
| same :45 (17 Oct note) | EN | "with my Night Manager role on record from November 2025" (DE :39, SQ :39) | 2026-10-13 |
| src/content/insights/2026-10-13-when-a-new-system-arrives.md:46 (15 Oct note) | EN | "I have been the hotel’s Night Manager since November 2025, so both are removed." (DE :40, SQ :40) | 2026-10-13 |
| same :48 (17 Oct note) | EN | "my Night Manager role is on record from November 2025" (DE :42, SQ :42) | 2026-10-13 |
| docs/AUDIT-2026-10-17.md:24-25 | SQ | "rolin e / Night Manager të dokumentuar që nga nëntori 2025" | 17 Oct record |

"Night Manager" appears **only** on the About page and in correction notes. No essay body names it.

### 1.8 Current hotel role described as Night Auditor

| file:line | lang | exact quote | dated |
|---|---|---|---|
| lib/floor/01.js:205 | EN | "Stiven Janaqi has been a Team Leader and an Area Manager in last-mile logistics and works today as a Night Auditor in hospitality." | issue 1, "October 2026" (:15) |
| lib/floor/01.js:205 | SQ / DE | "… dhe sot punon si Night Auditor në hoteleri." / "… und arbeitet heute als Night Auditor in der Hotellerie." | October 2026 |
| lib/floor/02.js:209 / :210 / :211 | EN / SQ / DE | same sentence in all three | issue 2, "November 2026" (:14) |
| docs/revista/numri-01.md:44, docs/revista/numri-02.md:38 | SQ | "sot punon si Night Auditor në hoteleri" (drafts of the above) | draft |
| docs/kalendari-linkedin.md:244 (DE) / :266 (SQ) | DE/SQ | "Als Night Auditor finde ich selten spektakuläre Fehler." / "Si Night Auditor rrallë gjej gabime spektakolare." | LinkedIn post scheduled Tue 20 Oct |
| docs/shperndarja-linkedin.md:269 | DE | "Nachts habe ich als Night Auditor gelernt" | draft |
| src/content/insights/2026-10-03-leadership-without-a-title.md:43 | EN | "In the hotel it has happened differently. My role is operational" (DE :36, SQ :36) | 2026-10-03 |

### 1.9 Part-time remote last-mile dispatcher since 1 January 2026

| file:line | lang | exact quote | dated |
|---|---|---|---|
| 80-vehicles-you-cannot-see.md:45 | EN | "Since 1 January 2026 I have worked part-time as a Last Mile Dispatcher, remotely, from home." … "80+ vehicles and 100+ drivers" (DE :39, SQ :39) | 2026-10-10 |
| src/content/insights/2026-10-13-when-the-dashboard-turns-red-before-you.md:50 | EN | "Since 1 January 2026 I have been working part-time as a Last Mile Dispatcher, remotely, coordinating 80+ vehicles and 100+ drivers." (DE :44, SQ :44) | 2026-10-13 |
| src/content/insights/2026-10-13-the-tour-the-driver-does-not-understand.md:45 | EN | "today as a remote dispatcher" (DE :39 "heute als Disponent aus der Ferne", SQ :39) | 2026-10-13 |
| when-improvement-fades.md:51 | EN | "Later I moved to remote coordination." | 2026-10-10 |
| about.njk:15, :45-46 | EN | "since January 2026 he has also coordinated more than 80 vehicles from home" · "2026 – today" · "Coordination of 80+ vehicles and 100+ drivers from home" | – |
| docs/shperndarja-linkedin.md:211, docs/kalendari-linkedin.md:1225 / :1241 | DE/SQ | "Als Dispatcher habe ich 80+ Fahrzeuge und 100+ Fahrer koordiniert, später als Area Manager eine ganze Station." / "Si dispeçer koordinova 80+ automjete dhe 100+ shoferë, më vonë si Area Manager një stacion të tërë." | scheduled 10 Dec |

(Audit P4-02 says this role "appears in two other essays". It appears in **four** essays plus the About page.)

### 1.10 September 2026: training at "another hotel" / "first weeks at the hotel"

| file:line | lang | exact quote | dated |
|---|---|---|---|
| night-the-system-went-down.md:8 (summary) | EN | "My first night of training at another hotel" (DE :8, SQ :8) | 2026-10-13 |
| same :45 (17 Oct note) | EN | "The night was my first night of training at another hotel in Frankfurt, in September 2026." … "the exact date is not on record" | 2026-10-13 |
| same :48 | EN | "In September 2026 I began training at another hotel in Frankfurt." | 2026-10-13 |
| src/content/de/…/2026-10-13-the-night-the-system-went-down.md:42 | DE | "Im September 2026 begann ich meine Einarbeitung in einem anderen Hotel in Frankfurt." | 2026-10-13 |
| src/content/sq/…/2026-10-13-the-night-the-system-went-down.md:42 | SQ | "Në shtator 2026 nisa trajnimin në një hotel tjetër në Frankfurt." | 2026-10-13 |
| when-a-new-system-arrives.md:11 (deck) | EN | "the first weeks of training at another hotel" (DE :11, SQ :11) | 2026-10-13 |
| same :46 (15 Oct note) | EN | "An earlier version dated the first weeks of training at the hotel to September 2026 and called it a new hotel." | 2026-10-13 |
| same :48 (17 Oct note) | EN | "The weeks of training were at another hotel in Frankfurt, in September 2026" (DE :42, SQ :42) | 2026-10-13 |
| same :53 | EN | "At that hotel, in September 2026, there were my first weeks of training" (DE :47, SQ :47) | 2026-10-13 |
| same :59 | EN | "at the hotel I was the newcomer who had to learn a system that was already there" | 2026-10-13 |
| the-tools-you-build-yourself.md:45 (15 Oct note, the only note) | EN | "An earlier version dated the first weeks at the hotel to September 2026." | 2026-10-13 |
| same :50 | EN | "The scene is a picture, drawn from my first weeks at the hotel" (DE :44 "aus meinen ersten Wochen im Hotel", SQ :44 "nga javët e mia të para në hotel") | 2026-10-13 |
| docs/AUDIT-2026-10-17.md:23 | SQ | "nata pa sistem ishte nata e parë e trajnimit në një hotel tjetër në Frankfurt, në shtator 2026," | 17 Oct record |
| docs/seria-sistemi/07-kur-vjen-nje-sistem-i-ri.md:8, :107 | SQ | "javët e para të trajnimit në një hotel të ri në shtator 2026"; "Shtator 2026, hotel i ri; nata e parë me përditësimin" | draft (pre-correction) |
| docs/seria-sistemi/08-mjetet-qe-i-ndertoni-vete.md:38 | SQ | "Është përvoja ime e javëve të para në hotel, në shtator 2026, e shkruar si figurë." | draft (pre-correction) |

### 1.11 Front Desk Control: when and where it was built

| file:line | lang | exact quote | dated |
|---|---|---|---|
| src/content/insights/2026-10-08-how-i-built-front-desk-control.md:41 | EN | `when: "September 2026, hotel Front Office and Night Audit"` (DE :34, SQ :34) | 2026-10-08 |
| same :63 | EN | "I developed the project in several phases during September 2026, while I was working through training and Night Audit processes." (DE :56, SQ :56) | 2026-10-08 |
| same :67 | EN | "This follows directly from the first essay of the series, [The first 30 days]" (DE :60, SQ :60) | 2026-10-08 |
| same :89 | EN | "The only use I can confirm is my own" | 2026-10-08 |
| the-tools-you-build-yourself.md:52 | EN | "which I developed in September 2026" (DE :46 "Ich habe es im September 2026 entwickelt", SQ :46 "që e zhvillova në shtator 2026") | 2026-10-13 |
| when-a-new-system-arrives.md:53 | EN | "Front Desk Control grew out of that period." | 2026-10-13 |
| night-the-system-went-down.md:60 | EN | "That night belongs to the same September of training that I describe in [How I built Front Desk Control]" (DE :54, SQ :54) | 2026-10-13 |
| leadership-without-a-title.md:43 | EN | "My role is operational, but I have gone beyond running the shift by structuring checklists, SOPs, training materials and, later, a digital system for Front Office and Night Audit." | 2026-10-03 |
| leadership-without-a-title.md:47 | EN | "That tells me my contribution has been used." | 2026-10-03 |
| src/_data/homeEssays.json:21 | – | `the-tools-you-build-yourself` is the third homepage pick | – |

### 1.12 The night the system was down (the same event told three times)

| file:line | lang | exact quote | dated |
|---|---|---|---|
| src/content/insights/2026-10-05-the-first-30-days.md:9 | EN | "my first nights as a Night Auditor in a new hotel" (DE :9, SQ :9) | 2026-10-05 |
| same :11 | EN | "the first nights in a new hotel" (DE :11, SQ :11) | 2026-10-05 |
| same :43 | EN | "On my first night at the new hotel, I could not work as a Night Auditor." | 2026-10-05 |
| src/content/de/insights/2026-10-05-the-first-30-days.md:36 | DE | "In meiner ersten Nacht im neuen Hotel konnte ich nicht als Night Auditor arbeiten." | 2026-10-05 |
| src/content/sq/insights/2026-10-05-the-first-30-days.md:36 | SQ | "Natën e parë në hotelin e ri nuk punova dot si Night Auditor." | 2026-10-05 |
| the-first-30-days.md:45 | EN | "The system was running an update, and for several hours normal work was practically impossible." (DE :38, SQ :38) | 2026-10-05 |
| same :49 | EN | "My material is the first weeks in that hotel" (DE :42, SQ :42) | 2026-10-05 |
| src/content/insights/2026-10-08-watch-how-i-do-it-is-not-training.md:9 | EN | "my three nights as a new Night Auditor" (DE :9, SQ :9) | 2026-10-08 |
| same :11 | EN | "three nights of training in a new hotel" (DE :11, SQ :11) | 2026-10-08 |
| same :45 | EN | "At the hotel where I started as a Night Auditor, I had three nights of training, from Tuesday to Thursday." | 2026-10-08 |
| src/content/de/…/watch-how-i-do-it-is-not-training.md:40 | DE | "In dem Hotel, in dem ich als Night Auditor angefangen habe, hatte ich drei Nächte Einarbeitung, von Dienstag bis Donnerstag." | 2026-10-08 |
| src/content/sq/…/watch-how-i-do-it-is-not-training.md:40 | SQ | "Në hotelin ku fillova si Night Auditor pata tri net trajnimi, nga e marta deri të enjten." | 2026-10-08 |
| watch-how…:49 | EN | "Because of an update the system was unavailable for several hours" … "I wrote about it in [The first 30 days]" (DE :44, SQ :44) | 2026-10-08 |
| night-the-system-went-down.md:48 | EN | "On my first night of training at that hotel, the hotel system was unavailable from around one in the morning until around six, about five hours, because of an update." (DE :42, SQ :42 same hours) | 2026-10-13 |
| same :50 | EN | "This is the only scene in this series that is not a picture." … "the practical part would continue on the following shift" (DE :44, SQ :44) | 2026-10-13 |
| same :56 | EN | "I stayed in the back office for most of those hours" | 2026-10-13 |
| same :70 | EN | "new to that hotel on my first night there" (DE :64, SQ :64) | 2026-10-13 |
| when-a-new-system-arrives.md:51 | EN | "my first night of training at another hotel, in September 2026" (DE :45, SQ :45) | 2026-10-13 |
| docs/kalendari-linkedin.md:1052 / :1074 | DE / SQ | "In meiner ersten Nacht im neuen Hotel konnte ich nicht als Night Auditor arbeiten." / "Natën e parë në hotelin e ri nuk punova dot si Night Auditor." | LinkedIn post scheduled Tue 1 Dec |
| docs/kalendari-linkedin.md:1292 / :1313 | DE / SQ | "Als Night Auditor hatte ich drei Nächte Einarbeitung." / "Si Night Auditor pata tri net trajnim." | LinkedIn post scheduled Tue 15 Dec |
| docs/seria-sistemi/06-nata-kur-ra-sistemi.md:34 | SQ | "Pak pas mesnatës, sistemi i hotelit u bë i padisponueshëm" | draft |

### 1.13 Years of experience, leading, Albania

| file:line | lang | exact quote | dated |
|---|---|---|---|
| about.njk:14 | EN | "Stiven has worked in operations for more than ten years, about eight of them leading teams" (DE/SQ `ui.json:2161`) | – |
| about.njk:19 | EN | stat "10+" years in operations | – |
| about.njk:39 | EN | "Ten years close to the work." (also the series name; DE/SQ `ui.json:638`) | – |
| about.njk:61-62 | EN | "2015 – 2021" · "Teams of up to 16 people; a national network of 61 active resellers that he built, a channel linked to revenue growth of around 30–40%." | – |
| about.njk:65 | EN | "2012 – 2015" (Bachelor, "alongside work in a telecom company's shops") | – |
| src/_includes/pages/start.njk:20 | EN | "I have led teams in retail, last-mile logistics and hotels" (DE/SQ `ui.json:1778`) | – |
| starting-from-zero.md:38 | EN | "In Albania, my last role was Cluster Manager" | 2026-10-01 |
| src/content/insights/2026-10-08-61-resellers.md:43 | EN | "how many there were when I took it on, and how long it took to reach 61, I do not have in figures" … "though I cannot prove that one caused the other" | 2026-10-08 |
| industry-changes….md:65 | EN | "I built and managed a national network of 61 active resellers" | 2026-10-03 |
| docs/shperndarja-linkedin.md:245 | DE | "Wie bringt man zehn Jahre Verantwortung auf zwei Seiten" | draft |

---

## 2. Contradictions

**C1. The tools you build yourself: its one note, its body and its sister essays disagree.**
- The essay's only note is the 15 Oct one, `the-tools-you-build-yourself.md:45`: "An earlier version dated the first weeks at the hotel to September 2026. I have been the hotel’s Night Manager since November 2025, so the date is removed." (DE :39, SQ :39). It says the "first weeks" were at the hotel where he is Night Manager, so before September 2026.
- The body still reads ":50 'drawn from my first weeks at the hotel'" and ":52 'which I developed in September 2026'" (DE :44/:46, SQ :44/:46). So the note says a date was removed, yet "September 2026" is still in the text.
- The 17 Oct notes in the two sister essays (`night-the-system-went-down.md:45`, `when-a-new-system-arrives.md:48`) say the first weeks were at **another** hotel in **September 2026**. That puts the 15 Oct note here in conflict with them. `how-i-built-front-desk-control.md:63` also dates the build to September 2026, during training.
- Why it matters: the essay is a homepage pick (`homeEssays.json:21`). Its byline date (edited.json 2026-10-17) suggests it already carries the 17 Oct correction, but it does not.
- **Question:** Were the "first weeks at the hotel" that the scene is drawn from the September 2026 weeks of training at another hotel, or your first weeks at the hotel where you are Night Manager? Which correction note should this essay carry?
- Once answered, 9 places change: EN :45/:50/:52, DE :39/:44/:46, SQ :39/:44/:46.

**C2. The outage night is told three ways: year, hotel, role and length of training differ.**
- (a) **September 2026, another hotel in Frankfurt, as a trainee, while the Night Manager role was on record:** `night-the-system-went-down.md:45, :48, :70`; `when-a-new-system-arrives.md:48, :51`; DE/SQ same lines; `docs/AUDIT-2026-10-17.md:23`.
- (b) **First night "at the new hotel", where he "could not work as a Night Auditor":** `the-first-30-days.md:9, :11, :43, :45` (DE :9/:11/:36/:38, SQ same). It is also in the LinkedIn post scheduled for 1 Dec (`docs/kalendari-linkedin.md:1052, :1074`).
- (c) **First of "three nights of training, from Tuesday to Thursday" "at the hotel where I started as a Night Auditor":** `watch-how-i-do-it-is-not-training.md:45, :49` (DE :40/:44, SQ :40/:44). It links to *The first 30 days* as the same night. It is also in the LinkedIn post scheduled for 15 Dec (`kalendari-linkedin.md:1292, :1313`). Read with `starting-from-zero.md:46` ("in May 2023 I started as night auditor at a hotel in Frankfurt"), (c) points to May 2023.
- Further conflicts:
  - Role: "Night Auditor" in (b) and (c) against a trainee with the Night Manager role on record in (a).
  - Length of training: "three nights of training" in (c) against "my first weeks of training" in (a) (`when-a-new-system-arrives.md:53`).
  - Duration: "several hours" (`the-first-30-days.md:45`, `watch-how…:49`) against "about five hours", "around one … until around six" (`night-the-system…:48`). The draft says "Pak pas mesnatës" (`docs/seria-sistemi/06…:34`).
- **Questions:**
  - In which month and year, and at which hotel, was the night the system was down?
  - In what role were you being trained that night: as a new Night Auditor, or as an experienced night manager learning another workplace?
  - Was that hotel's training three nights (Tue–Thu) or several weeks?
  - Is "the hotel where I started as a Night Auditor" the May 2023 hotel?
- Once answered: about 12 places per language in *The first 30 days* (:9, :11, :43, :49), *"Watch how I do it"* (:9, :11, :45, :49) and the notes and body of *The night the system went down* and *When a new system arrives*, plus 4 scheduled LinkedIn texts (kalendari :1052, :1074, :1292, :1313).

**C3. Current hotel title: Night Manager or Night Auditor.**
- Night Manager: about.njk:15 and :49-50 ("2025 – today", "since November 2025"); DE/SQ `ui.json:2156, :2158`; all the correction notes in 1.7.
- Night Auditor: lib/floor/01.js:205 (October 2026 issue) and lib/floor/02.js:209-211 (November 2026 issue), in EN, SQ and DE: "works today as a Night Auditor in hospitality". The LinkedIn post scheduled 20 Oct, kalendari:244/:266, uses the present tense: "Als Night Auditor finde ich selten spektakuläre Fehler."
- Also: `the-first-30-days.md:43` (the night that, per C2(a), was in September 2026): "I could not work as a Night Auditor".
- Why they conflict: both describe the author's role "today", in October/November 2026.
- **Question:** What is your hotel title today, and since when?
- Once answered: 6 strings in lib/floor (2 issues × 3 languages), 2 docs drafts (numri-01:44, numri-02:38), 2 LinkedIn texts, or the About page (EN :15, :50 and DE/SQ ui.json :2156, :2158).

**C4. Which hotel: the Night Manager hotel "2025 – today" or "another hotel" in September 2026.**
- About: Night Manager "at a Radisson Group hotel in Frankfurt since November 2025", dated "2025 – today" (about.njk:49-50).
- Essays: in September 2026 he "began training at another hotel in Frankfurt" (`night-the-system…:48`), for "first weeks of training" (`when-a-new-system…:53`). Front Desk Control "grew out of that period" (:53), and the night and the tool "belong to the same September" (`night-the-system…:60`).
- Why they conflict: if he is still Night Manager at the first hotel, the essays never say why he was training at another one. If he moved, "2025 – today" and "since November 2025" on the About page no longer describe the current hotel.
- **Questions:** Did you change hotels (or employers) in September 2026? Is the Radisson Group hotel the current one? At which of the two hotels was Front Desk Control built?

**C5. Where Front Desk Control came from, and whether others used it.**
- `how-i-built-front-desk-control.md:67` ties the tool directly to *The first 30 days*, whose hotel is "the new hotel" where he was a Night Auditor.
- `night-the-system…:60` and `when-a-new-system…:53` tie it to September 2026 training at another hotel.
- The `the-tools-you-build-yourself.md:45` note ties "the first weeks at the hotel" to the Night Manager hotel (see C1).
- `leadership-without-a-title.md:43, :47` (dated 3 Oct) present it as work done in "the hotel" in his own operational role, and say "That tells me my contribution has been used". `how-i-built…:89` says "The only use I can confirm is my own" and `the-tools-you-build-yourself.md:74` says "no formal test with colleagues".
- **Questions:** In which hotel, and in which role, did you build Front Desk Control? Has anyone other than you used it?

**C6. Is Area Manager past or current, and which came first: dispatcher or Area Manager?**
- Site: Area Manager "in 2025", then "Later I moved to remote coordination" (`when-improvement-fades.md:51`). The remote dispatcher role with 80+ vehicles starts "Since 1 January 2026" (`80-vehicles…:45`, `when-the-dashboard…:50`, about.njk:15/:45).
- Drafts and scheduled posts:
  - `docs/shperndarja-linkedin.md:211` and `docs/kalendari-linkedin.md:1225/:1241` (scheduled 10 Dec): "Als Dispatcher habe ich 80+ Fahrzeuge und 100+ Fahrer koordiniert, später als Area Manager eine ganze Station." This reverses the order. The 2021–22 dispatcher role was "70+ drivers", not 80+ vehicles.
  - `docs/shperndarja-linkedin.md:263`: the headline "Last-Mile-Operations (Area Manager) & Hotel Night Management" presents Area Manager as current.
- **Questions:** Did the 80+ vehicle coordination come before or after the Area Manager role? In which month did the Area Manager role end?
- Once answered: 3 LinkedIn texts and 1 headline draft change.

**C7. The full chronology stops in June 2025.**
- `starting-from-zero.md:46` (DE :39, SQ :39) is the only month-by-month chronology and a homepage pick. It stops at "in June 2025 I became Area Manager". Its :66 lists the road as "night audit, to Team Leader and to Area Manager".
- The About page adds Night Manager (Nov 2025) and dispatcher (Jan 2026). The essays add training at another hotel (Sept 2026).
- Why it conflicts: the essay is not wrong, but a reader comparing it with the About page sees two different "latest" roles.
- **Question:** Should the career line after June 2025 be stated, and with which roles and months: Area Manager end, Night Manager start, dispatcher start, September 2026 hotel?

---

## 3. Language mismatches

No date, month, place or number differs between EN, DE and SQ for any statement above. All 15 Oct and 17 Oct notes, the "about five hours, from around one until around six", 4 / 8 / ~250 / 70+ / 80+ / 100+, November 2021, May 2023 and June 2025 are the same in all three languages. The mismatches are naming and tense only:

1. **Remote role name.**
   - DE: "Last-Mile-Dispatcher" (`de/…/80-vehicles-you-cannot-see.md:39`, `de/…/when-the-dashboard-turns-red-before-you.md:44`) against "Disponent" (`de/…/the-tour-the-driver-does-not-understand.md:39`, :82) and the About page "Last-Mile-Disponent, remote und in Teilzeit" (`src/_data/de/ui.json:642`).
   - SQ: "Last Mile Dispatcher" (80-vehicles :39, dashboard :44) against "dispeçer" (tour-driver :39; `sq/ui.json:642`).
2. **The eight dispatchers.** DE essays say "acht Disponenten" (`de/…/high-volume-days.md:38`, `leading-people…:57`, `talking…:80`), while `src/_data/review.js:302/:308` says "Dispatcher" and the drafts say "acht Dispatcher". SQ essays write "dispeçerë", `review.js:302/:307` writes "dispecerë".
3. **Shift leaders.** The About page uses "shift leads" (EN) and "shefa turni" (SQ `ui.json:2156`). Essays use "Shift Leaders" (EN) and "drejtues turni" (SQ).
4. **Tense of the hotel role.** `de/…/leadership-without-a-title.md:36` says "Im Hotel lief es anders" (past), against EN :43 "it has happened differently" and SQ :36 "ka ndodhur ndryshe" (present perfect, ongoing).

---

## 4. Not contradictions, but unclear

1. **Two notes on one page.** *The night the system went down* (:43, :45) and *When a new system arrives* (:46, :48) show both the 15 Oct note and the 17 Oct note that retracts it. A reader first meets "so the date is removed" on a page whose body states the date.
2. **"the hotel’s Night Manager".** The notes never say which hotel "the hotel" is. Only the About page says "a Radisson Group hotel in Frankfurt".
3. **Possible overlap of Area Manager and Night Manager.** About places Area Manager "in 2025" and Night Manager "since November 2025". No end month is given for Area Manager, so a reader can take it that both were held in Nov–Dec 2025. `when-improvement-fades.md:51` goes from Area Manager straight to "remote coordination" and does not mention the hotel.
4. **End of night audit.**
   - `starting-from-zero.md:46` gives a start (May 2023, "a hotel in Frankfurt") and no end. The About page puts night audit in the "2021 – 2024" block, at "hotels in Frankfurt" (plural).
   - It is unclear whether hotel work continued during care work (Oct 2024–Jan 2025) or during 2025. The 17 Oct note's "for years" in hotel night operations depends on that.
5. **Present-tense Night Auditor narration.** Examples: `what-a-night-auditor-learns.md:44` "At the start I take the handover"; `industry-changes…:55` "During the night I check reservations"; `leadership-without-a-title.md:43` "My role is operational". These essays are dated October 2026, when the About page says Night Manager. Readers may take them as the current role (links to C3).
6. **"In those weeks in last mile".** At `when-a-new-system-arrives.md:55` (DE :49, SQ :49) the phrase means the weeks after August 2025. It follows directly after a sentence about September 2026, and the author was a remote dispatcher in 2026, so it can be read as September 2026.
7. **"the only scene in this series that is not a picture".** `night-the-system…:50` is true within its series. But the same night was already told as fact in two essays of another series (`the-first-30-days.md:43`, `watch-how…:49`), and this essay does not link to them.
8. **Promotion wording.** "Promoted after five months" (about.njk:54) sits beside "After about five months" (`leading-people…:65`), "a few months later" (`talking…:83`) and January→June 2025 (`starting-from-zero.md:46`). These are consistent but not identical.
9. **Years counted.**
   - "more than ten years, about eight of them leading teams" (about.njk:14), "10+" (:19) and "Ten years close to the work" (:39 and the series name) depend on the start year. The About page shows 2015 for management and 2012–2015 for telecom shop work.
   - "about eight" years leading adds up only if 2015–2021 in Albania, 2025, and the Night Manager role are all counted as leading teams. "I have led teams in … hotels" (start.njk:20) likewise depends on the Night Manager title (see C3).
10. **The 61 resellers.**
    - The About page says "a national network of 61 active resellers that he built, a channel linked to revenue growth of around 30–40%" (about.njk:62).
    - The essay says "how many there were when I took it on, and how long it took to reach 61, I do not have in figures" and "I cannot prove that one caused the other" (`61-resellers.md:43`).
    - "Built" and "took it on" read differently. This is not a timeline item but is About-vs-essay.
11. **Byline date versus notes.** `edited.json` dates *The tools you build yourself* to 2026-10-17 in all three languages, but its only note is from 15 Oct. A reader may assume the 17 Oct correction was applied (see C1).
12. **Drafts in `docs/` that keep pre-correction wording.** If these are reused, they would bring the retracted wording back:
    - `docs/seria-sistemi/07-kur-vjen-nje-sistem-i-ri.md:8` "në një hotel të ri në shtator 2026" and :107 "hotel i ri"
    - `docs/seria-sistemi/08-mjetet-qe-i-ndertoni-vete.md:38` "javëve të para në hotel, në shtator 2026"
    - `docs/seria-sistemi/06-nata-kur-ra-sistemi.md:34` "Pak pas mesnatës"
13. **The audit undercounts the dispatcher role.** Audit P4-02 says the remote dispatcher role "appears in two other essays". It is stated in four: `80-vehicles…:45`, `when-the-dashboard…:50`, `the-tour-the-driver…:45` and `when-improvement-fades.md:51`. It is also on the About page.

---

### Counts
- Statement rows: 119 across 13 fact groups (about 200 file:line locations counting the DE/SQ parallels given in brackets).
- Contradictions: 7. The ones that need the author's answer before any wording changes are C1–C4 and C6.
- Language mismatches: 4, all naming or tense. No factual differences between languages.
- Unclear items: 13.
