// The Tools Guide: the text of the printed guide (src/guide-print/print.njk, scripts/tools-guide.mjs) and of its
// reader pages (src/_includes/pages/guide.njk), in English, Albanian and German.
//
// Every fact here comes from the tools themselves: what you enter, what you get, where it is kept.
// Tool names, types and times come from tools.json; roles, scopes, lines and routines from families.json.
// [[Label]] is a button or field of a tool: it is printed in quotes, in the language of the guide (ui.json).
// The page order is the same in every language.
import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), "utf8"));
const families = read("./families.json");
const toolLists = { en: read("./tools.json"), sq: read("./sq/tools.json"), de: read("./de/tools.json") };

const pages = [
  "cover",
  "about",
  "contents",
  "start",
  "system",
  "families",
  "idea",
  "data",
  "family:pulse",
  "tool:/tools/shift-pulse/",
  "tool:/tools/damage-control/",
  "tool:/tools/incomplete-control/",
  "tool:/tools/delay-analyzer/",
  "tool:/tools/shift-handover/",
  "family:zenith",
  "tool:/tools/cx-control-tower/",
  "tool:/tools/kpi-diagnostic/",
  "tool:/tools/pareto/",
  "family:lumen",
  "tool:/tools/sigma-control-chart/",
  "tool:/tools/five-whys/",
  "tool:/tools/six-sigma-dmaic/",
  "family:atlas",
  "tool:/tools/cv-builder/",
  "tool:/tools/ats-cv/",
  "tool:/tools/cover-letter/",
  "coaching",
  "next",
  "back",
];

const en = {
  title: "The Tools Guide",
  subtitle: "Fourteen free tools for the people who run the work: what they are for, how to use them, and why they look the way they do.",
  edition: "Edition 1 · October 2026",
  author: "Stiven Janaqi",
  labels: {
    contents: "Contents",
    when: "When to use it",
    how: "How to use it",
    get: "What you get",
    data: "Your data",
    open: "Open it",
    tools: "Its tools",
    routine: "A routine",
    learn: "Course",
    page: "Page",
    planet: "The planet",
    moons: "moons",
    family: "Family",
  },
  sections: {
    about: {
      kicker: "About this guide",
      title: "Fourteen tools, four planets, one idea",
      body: [
        "Stiven Catalyst has fourteen free tools for the people who run the work: shift leads, area managers, process managers, and anyone carrying their experience into the next role.",
        "This guide explains how the tools are organised, why the site looks the way it does, and how to use each tool, step by step. You do not need to read it in order: find your planet and start there.",
        { cards: [
          { title: "Free", text: "Every tool is free to use." },
          { title: "No account", text: "You open a tool and start. There is nothing to sign up for." },
          { title: "On your device", text: "Your work is kept in your browser, not on a server. No cookies, no analytics." },
        ] },
        { note: "One exception, stated in the tool: when you type a company's website in the CV Builder, that address goes to Google's icon service to fetch the logo." },
      ],
    },
    start: {
      kicker: "Start here",
      title: "Which planet is yours?",
      body: [
        "The tools are grouped by the work you do, not by method. Start with the planet that matches your day.",
        { routes: [
          { family: "pulse", text: "You run the floor for one shift." },
          { family: "zenith", text: "You lead an area and read its numbers week by week." },
          { family: "lumen", text: "You look after the whole system and the way it changes." },
          { family: "atlas", text: "You are carrying your experience into your next role." },
        ] },
        "Not sure? Start with the problem in front of you: the contents list every tool by name.",
      ],
    },
    system: {
      kicker: "The idea, 1",
      title: "Why a solar system",
      body: [
        { diagram: "system" },
        "On the homepage the tools are a small solar system. At the centre is the light, the Catalyst bulb. In the brand it stands for clarity: the moment a complex problem becomes understandable.",
        "The planets are roles. Each orbit widens as the role's view does: Pulse, the Shift Lead, sees one shift; Zenith, the Area Manager, one area week by week; Lumen, the Process Manager, the whole system; Atlas is the career that every role carries.",
        "The moons are the tools, one for each tool or course. Tap a planet and its tools open; tap a moon and you are in the tool. As in a real solar system, the planets closest to the light move fastest.",
      ],
    },
    families: {
      kicker: "The idea, 2",
      title: "Four families, four colours",
      body: [
        "Each role is a family with its own colour: Pulse violet, Zenith blue, Lumen gold, Atlas silver. None of them is red or green, so a family never reads as an error or a success: on this site, red and green only report a result inside a tool.",
        "On a family's pages its colour takes the place of the site's blue, so a page still has a single accent.",
        { planets: [
          { family: "pulse", text: "Cracks beating inside a heartbeat ring: the pulse of one shift." },
          { family: "zenith", text: "A contour map under a radar: an area seen from above, week by week." },
          { family: "lumen", text: "It shines by itself, inside a ring of dust in five parts: the five steps of DMAIC." },
          { family: "atlas", text: "A globe with the path of a career drawn as a constellation." },
        ] },
      ],
    },
    idea: {
      kicker: "The idea, 3",
      title: "Small tools that work together",
      body: [
        "The idea behind the tools is simple: tools made from the work on the floor, that need nothing but a browser. No installation, no account, no server that keeps your data.",
        "What makes them more than separate calculators is that they pass work to each other, inside your browser:",
        { list: [
          "The Damage, Incomplete and Delay logs feed Shift Pulse, and the Shift Handover takes their numbers with [[Fill in from the logs]].",
          "Any log result goes on with one button: [[Take it to 5 Whys]], [[Open in Pareto 80/20]] or [[Open as control chart]].",
          "The CX Control Tower sends its root causes to Pareto 80/20.",
          "The Cover Letter takes your details from the CV Builder or the ATS CV.",
        ] },
        "And on each role page, a coaching workspace turns the tools into a practice: a project with a goal, a measurement and a review date. More on the last pages.",
      ],
    },
    data: {
      kicker: "Before you start",
      title: "Your work stays with you",
      body: [
        "Every tool keeps your work only in the browser you use. It is not sent anywhere, which also means it is not on your phone if you worked on your laptop.",
        "To keep everything, or to move it to another device, use [[Save all my work]] at the end of any tool page: one file with the work of every tool. [[Open a saved file]] brings it back and replaces only the tools in that file.",
        { list: [
          "Most tools print or save as PDF, and the logs download as CSV for Excel.",
          "The log tools keep a separate log for each language of the site.",
          "If the browser cannot save, the tool says so: download the CSV or copy the summary to keep your work.",
          "Clearing the browser's data clears your work too. Save a file first.",
        ] },
      ],
    },
    coaching: {
      kicker: "From a tool to a practice",
      title: "The coaching workspace",
      body: [
        "Each role page opens a coaching workspace above the tools. It turns one good result into a habit you can show.",
        { steps: [
          "Choose your context: logistics or warehouse, hotel or service; new to the role or experienced. A name is optional.",
          "Create a project with a goal, a measurement and a review date.",
          "Follow your role's learning path: modules with a method, a case, a decision with feedback, an assignment and a reflection.",
          "Save evidence from real work. A dated review at your workplace counts; a quiz alone does not.",
          "Reflect with GROW. Every reflection ends in an action with an owner and a due date.",
          "Print a report for a human coach, or export a backup of the whole workspace.",
        ] },
        "A tool opened from your project lets you save its result and an action into that project. On a normal visit, none of this loads.",
        { note: "Here too there is no server and no account: no shared team database, and no automatic sync between devices." },
      ],
    },
    next: {
      kicker: "Edition 2",
      title: "What could come next",
      body: [
        "Ideas under consideration, not promises with dates. Tell me which one would help you most.",
        { list: [
          "Faster tool pages: smaller scripts, so the tools open more quickly on a phone.",
          "The Delay Analyzer for routes without a recorded departure time.",
          "A shared space for a coach and a team, but only with real accounts and access control, because the promise of these tools is that your data stays yours.",
        ] },
        "When a tool changes, this guide gets a new edition. The newest one is always on the site.",
      ],
    },
    back: {
      motto: "See clearly. Think differently. Act deliberately.",
      text: "All the tools, free, in English, German and Albanian:",
    },
  },
  families: {
    pulse: "Five tools for one shift: log what goes wrong where it happens, see the shift in one picture, and hand it over cleanly.",
    zenith: "Three tools for one area: read the week, find where a red number really comes from, and start with the causes that matter most.",
    lumen: "Three tools for the whole system: tell a real change from noise, reach a root cause you can change, and run an improvement as a project.",
    atlas: "Three tools for the next role: a designed CV, a CV that screening software reads correctly, and a letter that matches.",
  },
  tools: {
    "/tools/shift-pulse/": {
      when: "At the end of a shift or a week, when you want the whole picture before you write the handover.",
      how: [
        "Choose a period: 7, 14 or 30 days, or 8 or 12 weeks.",
        "Choose the shift.",
        "Read the cards and the flags.",
        "Open the trend chart of any number.",
      ],
      get: "One look at what the Damage, Incomplete, Delay and Handover logs in this browser hold: cards, flags and a trend for each number, to copy, print or save as PDF.",
      data: "It keeps only your settings. It reads the other logs and changes nothing in them.",
    },
    "/tools/damage-control/": {
      when: "Every time a unit is damaged, at the stage where it happens.",
      how: [
        "Log each damaged unit: date, stage, cause and units, with a cost and a note if you have them. Rows from Excel can be pasted with [[Import rows]].",
        "Set the period: the units handled and your target.",
        "Review the log. To try the tool first, load an example week.",
        "Walk the [[Floor check]].",
      ],
      get: "Damage rate, DPMO and sigma level, the few causes behind most of the damage, the stages where it happens, a trend, and where to start. Download it as CSV, or take it on to 5 Whys, Pareto 80/20 or a control chart.",
      data: "The log stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/incomplete-control/": {
      when: "Every time an order leaves without all its items or parcels.",
      how: [
        "Log each incomplete order by date, stage and cause, or import rows.",
        "Set the period: the orders handled and your target.",
        "Review the log.",
        "Walk the [[Floor check]].",
      ],
      get: "Incomplete rate and complete orders, DPMO and sigma level, the causes behind most of the errors and the stages where they start, with the same exports and next steps as Damage Control.",
      data: "The log stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/delay-analyzer/": {
      when: "When routes arrive late and you need to know whether the delay began at the dock or on the road.",
      how: [
        "Log a route: date, shift, route, planned and actual departure, planned and actual arrival, and the reason if it was late. Rows can be imported.",
        "Set the grace minutes for departure and arrival, and your on-time target.",
        "Review the log.",
        "Walk the [[Floor check]].",
      ],
      get: "On-time rate, every late minute split into dock and road, the reasons, the departure hours and shifts behind the delays, and a trend.",
      data: "The log stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/shift-handover/": {
      when: "At the end of every shift. Most problems are not lost on the shift; they are lost between shifts.",
      how: [
        "Choose a template: warehouse, hotel front office or delivery station. Fill in date, shift, area and both names.",
        "Add the numbers. [[Fill in from the logs]] takes them from Damage, Incomplete and Delay.",
        "List the open issues, each with an owner and a time. Add heads-ups, safety and people.",
        "Run the handover check.",
      ],
      get: "A [[Ready to hand over]] view to copy, print or save as PDF, and send through your own channel. [[Close shift, start the next]] carries the open issues forward and counts how often they were carried. Earlier handovers stay in a history.",
      data: "The handover stays in this browser. Nothing is sent.",
    },
    "/tools/cx-control-tower/": {
      when: "Every week, to go from the customer's outcome to the operational driver, the root cause and an action that is checked.",
      how: [
        "Load your files: deliveries, routes, incidents and actions, as CSV or Excel, or one workbook. Or [[Load the example]].",
        "Enter only the targets you have approved.",
        "Filter by dates, partner, shift and zone.",
        "Read the tabs, from the overview to the [[Weekly review]].",
      ],
      get: "Perfect Delivery for every order, scorecards, route risk, a Pareto of root causes and an action tracker. Copy the review, print it, or export tables as CSV.",
      data: "Your files are read in the browser. Nothing is uploaded.",
    },
    "/tools/kpi-diagnostic/": {
      when: "A number turned red. Before you push harder on it, find out where the cause sits.",
      how: [
        "Name the KPI, if you like.",
        "Rate ten statements.",
        "Press [[See the result]].",
      ],
      get: "The cause that fits best (clarity, skill, capacity, process design or ownership), with a score for each, three first moves and a [[Question for the floor]].",
      data: "Nothing you enter is stored or sent.",
    },
    "/tools/pareto/": {
      when: "When a few causes make most of the trouble and you need to know which to fix first.",
      how: [
        "Choose a template: delivery, warehouse or hotel. Or [[Load the example]].",
        "Bring your data: a CSV or Excel file, or cells pasted from a sheet.",
        "Check the columns: cause, count, value, date.",
        "Rank the causes by how often they happen or by what they cost. If you like, compare before and after.",
      ],
      get: "A checked Pareto chart with every row accounted for, [[Where to start]], and exports as PNG, SVG and CSV.",
      data: "Files are read in the browser, Excel included. Up to 20,000 rows are kept.",
    },
    "/tools/sigma-control-chart/": {
      when: "When you need to know how good a process is, and whether a bad day is a real change or normal noise.",
      how: [
        "For the sigma level: units, defects and chances per unit.",
        "For perfect delivery: on time, undamaged and complete, in percent.",
        "For the control chart: what you count, by day or by week, and a baseline.",
        "Add the days one by one with [[Add a day]], or import rows.",
      ],
      get: "The sigma level, perfect delivery, and a control chart that lists the [[Signals to investigate]]. Download as CSV, copy or print.",
      data: "Everything stays in this browser.",
    },
    "/tools/five-whys/": {
      when: "When a problem comes back. Start from what happened, not from who did it.",
      how: [
        "Write the problem.",
        "Ask why, five times or as often as it takes.",
        "Name the root cause: something you can change.",
        "Agree a countermeasure, an owner, a due date and how you will know it worked.",
      ],
      get: "A worksheet to print, save as PDF or copy as text. The log tools can send their problem straight into it.",
      data: "The worksheet stays in this browser.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "When an improvement is a project, not a quick fix.",
      how: [
        "Work through Define, Measure, Analyse, Improve and Control. Each step has its output, key ideas, common mistakes, a real case and [[Check yourself]].",
        "Read the eight wastes and the glossary.",
        "Fill in the project charter, or [[Fill with the course case]] to see an example.",
      ],
      get: "A DMAIC project charter to print, save as PDF or copy as text.",
      data: "Your answers and your charter are kept only in this browser.",
    },
    "/tools/cv-builder/": {
      when: "When your CV should look designed, not typed.",
      how: [
        "Choose the CV's language, English, German or Albanian, its spacing and colours.",
        "Add a photo, your contact details, up to four key figures, a profile and your key achievements.",
        "Add your experience. A company's website brings in its logo.",
        "Add education, skills and languages, then read the CV check.",
      ],
      get: "A CV you watch change on real A4 pages, downloaded as PDF, and a backup file you can open again with [[Open a backup file]].",
      data: "Kept in this browser, photos and logos included. Only the company websites you type go to Google's icon service, to fetch the logos.",
    },
    "/tools/ats-cv/": {
      when: "When software reads your CV before a person does.",
      how: [
        "Start from a PDF or Word file, from the CV Builder, or from pasted text, and [[Sort it into the fields]].",
        "Choose the language, font and heading colour.",
        "Check contact, summary, experience and the other sections.",
        "[[Match a job ad]]: paste the ad and read the ATS check.",
      ],
      get: "Your CV as PDF, Word (.docx) and plain text.",
      data: "Kept in this browser. The PDF reader loads from this site, only when you open a PDF.",
    },
    "/tools/cover-letter/": {
      when: "When the letter should go with your CV, in the same design.",
      how: [
        "Take your details [[From the CV Builder]] or [[From the ATS CV]].",
        "Choose Modern or Classic, the colours, the font and the photo.",
        "Add the company and the person to write to.",
        "Answer a few questions, from the position to your start date, and [[Write the first draft]]. Then edit it, sign it and read the letter check.",
      ],
      get: "The letter as PDF, Word (.docx) and plain text.",
      data: "Kept in this browser, photo and signature included. Nothing is uploaded.",
    },
  },
};

const sq = {
  title: "Udhëzuesi i mjeteve",
  subtitle: "Katërmbëdhjetë mjete falas për ata që e drejtojnë punën: për çfarë shërbejnë, si përdoren dhe pse duken ashtu siç duken.",
  edition: "Botimi 1 · Tetor 2026",
  author: "Stiven Janaqi",
  labels: {
    contents: "Përmbajtja",
    when: "Kur e përdorni",
    how: "Si e përdorni",
    get: "Çfarë merrni",
    data: "Të dhënat tuaja",
    open: "Hapeni",
    tools: "Mjetet e tij",
    routine: "Një rutinë",
    learn: "Kurs",
    page: "Faqe",
    planet: "Planeti",
    moons: "hëna",
    family: "Familja",
  },
  sections: {
    about: {
      kicker: "Për këtë udhëzues",
      title: "Katërmbëdhjetë mjete, katër planete, një ide",
      body: [
        "Stiven Catalyst ka katërmbëdhjetë mjete falas për ata që e drejtojnë punën: drejtuesit e turnit, area manager-ët, process manager-ët dhe këdo që po e çon përvojën e vet te roli i ardhshëm.",
        "Ky udhëzues shpjegon si janë organizuar mjetet, pse faqja duket ashtu siç duket dhe si përdoret çdo mjet, hap pas hapi. Nuk keni nevojë ta lexoni me radhë: gjeni planetin tuaj dhe nisni nga aty.",
        { cards: [
          { title: "Falas", text: "Çdo mjet përdoret falas." },
          { title: "Pa llogari", text: "Hapni mjetin dhe nisni. Nuk ka asgjë për t'u regjistruar." },
          { title: "Në pajisjen tuaj", text: "Puna juaj ruhet në shfletuesin tuaj, jo në një server. Pa cookies, pa analytics." },
        ] },
        { note: "Një përjashtim, i thënë në vetë mjetin: kur shkruani faqen e internetit të një kompanie te Krijuesi i CV-së, ajo adresë shkon te shërbimi i ikonave i Google-it për të marrë logon." },
      ],
    },
    start: {
      kicker: "Fillo këtu",
      title: "Cili është planeti juaj?",
      body: [
        "Mjetet janë grupuar sipas punës që bëni, jo sipas metodës. Nisni me planetin që i përngjan ditës suaj.",
        { routes: [
          { family: "pulse", text: "Drejtoni punën në terren për një turn." },
          { family: "zenith", text: "Drejtoni një zonë dhe lexoni shifrat e saj javë pas jave." },
          { family: "lumen", text: "Kujdeseni për të gjithë sistemin dhe për mënyrën si ndryshon." },
          { family: "atlas", text: "Po e çoni përvojën tuaj te roli i ardhshëm." },
        ] },
        "Nuk jeni të sigurt? Nisni nga problemi që keni përpara: përmbajtja i rendit të gjitha mjetet me emër.",
      ],
    },
    system: {
      kicker: "Ideja, 1",
      title: "Pse një sistem diellor",
      body: [
        { diagram: "system" },
        "Në faqen kryesore mjetet janë një sistem i vogël diellor. Në qendër është drita, llamba e Catalyst. Në markë ajo do të thotë qartësi: momenti kur një problem i ndërlikuar bëhet i kuptueshëm.",
        "Planetet janë role. Çdo orbitë zgjerohet ashtu si zgjerohet pamja e rolit: Pulse, drejtuesi i turnit, sheh një turn; Zenith, area manager-i, një zonë javë pas jave; Lumen, process manager-i, të gjithë sistemin; Atlas është karriera që e mbart çdo rol.",
        "Hënat janë mjetet, një për çdo mjet ose kurs. Prekni një planet dhe hapen mjetet e tij; prekni një hënë dhe jeni brenda mjetit. Si në një sistem diellor të vërtetë, planetet më afër dritës lëvizin më shpejt.",
      ],
    },
    families: {
      kicker: "Ideja, 2",
      title: "Katër familje, katër ngjyra",
      body: [
        "Çdo rol është një familje me ngjyrën e vet: Pulse vjollcë, Zenith blu, Lumen ari, Atlas argjend. Asnjëra nuk është e kuqe apo e gjelbër, që një familje të mos lexohet kurrë si gabim apo si sukses: në këtë faqe, e kuqja dhe e gjelbra tregojnë vetëm rezultatin brenda një mjeti.",
        "Në faqet e një familjeje, ngjyra e saj zë vendin e blusë së faqes, kështu që çdo faqe ka përsëri vetëm një theks.",
        { planets: [
          { family: "pulse", text: "Plasaritje që rrahin brenda një unaze zemre: pulsi i një turni." },
          { family: "zenith", text: "Një hartë me izoipse nën një radar: një zonë e parë nga lart, javë pas jave." },
          { family: "lumen", text: "Shkëlqen vetë, brenda një unaze pluhuri në pesë pjesë: pesë hapat e DMAIC." },
          { family: "atlas", text: "Një glob me rrugën e një karriere të vizatuar si yjësi." },
        ] },
      ],
    },
    idea: {
      kicker: "Ideja, 3",
      title: "Mjete të vogla që punojnë bashkë",
      body: [
        "Ideja pas mjeteve është e thjeshtë: mjete të lindura nga puna në terren, që nuk kërkojnë asgjë tjetër veç një shfletuesi. Pa instalim, pa llogari, pa server që mban të dhënat tuaja.",
        "Ajo që i bën më shumë se kalkulatorë të veçantë është se ia kalojnë punën njëri-tjetrit, brenda shfletuesit tuaj:",
        { list: [
          "Regjistrat e dëmeve, të plotësisë dhe të vonesave ushqejnë Shift Pulse, dhe Dorëzimi i turnit i merr shifrat e tyre me [[Fill in from the logs]].",
          "Çdo rezultat i një regjistri vazhdon me një buton: [[Take it to 5 Whys]], [[Open in Pareto 80/20]] ose [[Open as control chart]].",
          "CX Control Tower ia dërgon shkaqet rrënjësore Pareto 80/20.",
          "Letra e motivimit i merr të dhënat tuaja nga Krijuesi i CV-së ose nga CV për ATS.",
        ] },
        "Dhe në faqen e çdo roli, një hapësirë coaching-u i kthen mjetet në praktikë: një projekt me qëllim, matje dhe datë rishikimi. Më shumë në faqet e fundit.",
      ],
    },
    data: {
      kicker: "Para se të nisni",
      title: "Puna juaj mbetet te ju",
      body: [
        "Çdo mjet e ruan punën tuaj vetëm në shfletuesin që përdorni. Nuk dërgohet askund, që do të thotë edhe se nuk është në telefon nëse keni punuar në laptop.",
        "Për t'i ruajtur të gjitha, ose për t'i kaluar në një pajisje tjetër, përdorni [[Save all my work]] në fund të çdo faqeje mjeti: një skedar me punën e të gjitha mjeteve. [[Open a saved file]] e kthen përsëri dhe zëvendëson vetëm mjetet që janë në atë skedar.",
        { list: [
          "Shumica e mjeteve printohen ose ruhen si PDF, dhe regjistrat shkarkohen si CSV për Excel.",
          "Mjetet e regjistrave mbajnë një regjistër të veçantë për çdo gjuhë të faqes.",
          "Nëse shfletuesi nuk mund të ruajë, mjeti jua thotë: shkarkoni CSV-në ose kopjoni përmbledhjen që ta ruani punën.",
          "Fshirja e të dhënave të shfletuesit fshin edhe punën tuaj. Ruani një skedar më parë.",
        ] },
      ],
    },
    coaching: {
      kicker: "Nga mjeti te praktika",
      title: "Hapësira e coaching-ut",
      body: [
        "Faqja e çdo roli hap një hapësirë coaching-u mbi mjetet. Ajo e kthen një rezultat të mirë në një zakon që mund ta tregoni.",
        { steps: [
          "Zgjidhni kontekstin: logjistikë ose magazinë, hotel ose shërbim; i ri në rol ose me përvojë. Emri nuk është i detyrueshëm.",
          "Krijoni një projekt me qëllim, matje dhe datë rishikimi.",
          "Ndiqni rrugën e të mësuarit të rolit tuaj: module me metodë, rast, vendim me koment, detyrë dhe reflektim.",
          "Ruani dëshmi nga puna reale. Një rishikim me datë në vendin e punës vlen; vetëm një kuiz nuk vlen.",
          "Reflektoni me GROW. Çdo reflektim mbyllet me një veprim me përgjegjës dhe afat.",
          "Printoni një raport për një coach njerëzor, ose eksportoni një kopje rezervë të gjithë hapësirës.",
        ] },
        "Një mjet i hapur nga projekti juaj ju lejon ta ruani rezultatin dhe një veprim në atë projekt. Në një vizitë të zakonshme, asgjë nga kjo nuk ngarkohet.",
        { note: "Edhe këtu nuk ka server dhe llogari: nuk ka bazë të përbashkët të dhënash për ekipin dhe nuk ka sinkronizim automatik mes pajisjeve." },
      ],
    },
    next: {
      kicker: "Botimi 2",
      title: "Çfarë mund të vijë më pas",
      body: [
        "Ide në shqyrtim, jo premtime me data. Më tregoni cila do t'ju ndihmonte më shumë.",
        { list: [
          "Faqe mjetesh më të shpejta: skripte më të vogla, që mjetet të hapen më shpejt në telefon.",
          "Analiza e vonesave për itinerare pa orë nisjeje të regjistruar.",
          "Një hapësirë e përbashkët për një coach dhe një ekip, por vetëm me llogari të vërteta dhe kontroll aksesi, sepse premtimi i këtyre mjeteve është që të dhënat tuaja mbeten tuajat.",
        ] },
        "Kur ndryshon një mjet, ky udhëzues merr një botim të ri. Botimi më i fundit është gjithmonë në faqe.",
      ],
    },
    back: {
      motto: "Shiko qartë. Mendo ndryshe. Vepro me qëllim.",
      text: "Të gjitha mjetet, falas, në shqip, anglisht dhe gjermanisht:",
    },
  },
  families: {
    pulse: "Pesë mjete për një turn: regjistroni atë që shkon keq aty ku ndodh, shihni turnin në një pamje dhe dorëzojeni të pastër.",
    zenith: "Tri mjete për një zonë: lexoni javën, gjeni nga vjen realisht një shifër e kuqe dhe nisni me shkaqet që peshojnë më shumë.",
    lumen: "Tri mjete për të gjithë sistemin: dalloni një ndryshim të vërtetë nga zhurma, arrini te një shkak që mund ta ndryshoni dhe drejtoni një përmirësim si projekt.",
    atlas: "Tri mjete për rolin e ardhshëm: një CV e dizajnuar, një CV që softueri i përzgjedhjes e lexon saktë dhe një letër që i shkon.",
  },
  tools: {
    "/tools/shift-pulse/": {
      when: "Në fund të një turni ose të një jave, kur doni pamjen e plotë para se të shkruani dorëzimin.",
      how: [
        "Zgjidhni periudhën: 7, 14 ose 30 ditë, ose 8 ose 12 javë.",
        "Zgjidhni turnin.",
        "Lexoni kartat dhe sinjalet.",
        "Hapni grafikun e trendit të çdo shifre.",
      ],
      get: "Një pamje e asaj që mbajnë në këtë shfletues regjistrat e dëmeve, të plotësisë, të vonesave dhe të dorëzimit: karta, sinjale dhe një trend për çdo shifër, për ta kopjuar, printuar ose ruajtur si PDF.",
      data: "Ruan vetëm cilësimet tuaja. I lexon regjistrat e tjerë dhe nuk ndryshon asgjë në to.",
    },
    "/tools/damage-control/": {
      when: "Sa herë dëmtohet një njësi, në hapin e procesit ku ndodh.",
      how: [
        "Regjistroni çdo njësi të dëmtuar: datën, hapin, shkakun dhe njësitë, me koston dhe një shënim nëse i keni. Rreshtat nga Excel-i ngjiten me [[Import rows]].",
        "Vendosni periudhën: njësitë e trajtuara dhe objektivin tuaj.",
        "Rishikoni regjistrin. Për ta provuar mjetin, ngarkoni një javë shembull.",
        "Bëni [[Floor check]].",
      ],
      get: "Shkalla e dëmeve, DPMO dhe niveli sigma, shkaqet e pakta pas shumicës së dëmeve, hapat ku ndodhin, një trend dhe ku të filloni. Shkarkojeni si CSV, ose vazhdoni me 5 Whys, Pareto 80/20 ose një kartë kontrolli.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/incomplete-control/": {
      when: "Sa herë një porosi del pa të gjithë artikujt ose pakot.",
      how: [
        "Regjistroni çdo porosi të paplotë sipas datës, hapit dhe shkakut, ose importoni rreshta.",
        "Vendosni periudhën: porositë e trajtuara dhe objektivin tuaj.",
        "Rishikoni regjistrin.",
        "Bëni [[Floor check]].",
      ],
      get: "Shkalla e porosive të paplota dhe porositë e plota, DPMO dhe niveli sigma, shkaqet pas shumicës së gabimeve dhe hapat ku nisin, me të njëjtat eksporte dhe hapa të mëtejshëm si Kontrolli i dëmeve.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/delay-analyzer/": {
      when: "Kur itineraret mbërrijnë me vonesë dhe duhet të dini nëse vonesa nisi në rampë apo në rrugë.",
      how: [
        "Regjistroni një itinerar: datën, turnin, itinerarin, nisjen e planifikuar dhe reale, mbërritjen e planifikuar dhe reale, dhe arsyen nëse u vonua. Rreshtat mund të importohen.",
        "Vendosni minutat e tolerancës për nisjen dhe mbërritjen, dhe objektivin e përpikërisë.",
        "Rishikoni regjistrin.",
        "Bëni [[Floor check]].",
      ],
      get: "Shkalla e përpikërisë, çdo minutë vonese e ndarë mes rampës dhe rrugës, arsyet, orët e nisjes dhe turnet pas vonesave, dhe një trend.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/shift-handover/": {
      when: "Në fund të çdo turni. Shumica e problemeve nuk humbasin gjatë turnit, humbasin mes turneve.",
      how: [
        "Zgjidhni një model: magazinë, recepsion hoteli ose stacion shpërndarjeje. Plotësoni datën, turnin, zonën dhe të dy emrat.",
        "Shtoni shifrat. [[Fill in from the logs]] i merr nga regjistrat e dëmeve, të plotësisë dhe të vonesave.",
        "Rendisni çështjet e hapura, secilën me përgjegjës dhe orë. Shtoni paralajmërimet, sigurinë dhe njerëzit.",
        "Bëni kontrollin e dorëzimit.",
      ],
      get: "Një pamje [[Ready to hand over]] për ta kopjuar, printuar ose ruajtur si PDF dhe për ta dërguar në kanalin tuaj. [[Close shift, start the next]] i kalon çështjet e hapura më tej dhe numëron sa herë janë kaluar. Dorëzimet e mëparshme mbeten në një histori.",
      data: "Dorëzimi mbetet në këtë shfletues. Asgjë nuk dërgohet.",
    },
    "/tools/cx-control-tower/": {
      when: "Çdo javë, për të shkuar nga rezultati te klienti te shkaktari operacional, te shkaku rrënjësor dhe te një veprim i verifikuar.",
      how: [
        "Ngarkoni skedarët: dorëzimet, itineraret, incidentet dhe veprimet, si CSV ose Excel, ose një libër pune të vetëm. Ose [[Load the example]].",
        "Vendosni vetëm objektivat që keni miratuar.",
        "Filtroni sipas datave, partnerit, turnit dhe zonës.",
        "Lexoni skedat, nga pamja e përgjithshme deri te [[Weekly review]].",
      ],
      get: "Perfect Delivery për çdo porosi, karta rezultatesh, rreziku i itinerareve, një Pareto e shkaqeve rrënjësore dhe një ndjekës veprimesh. Kopjoni rishikimin, printojeni ose eksportoni tabelat si CSV.",
      data: "Skedarët lexohen në shfletues. Asgjë nuk ngarkohet.",
    },
    "/tools/kpi-diagnostic/": {
      when: "Një shifër u bë e kuqe. Para se të shtyni më fort, gjeni ku është shkaku.",
      how: [
        "Shkruani KPI-në, nëse doni.",
        "Vlerësoni dhjetë pohime.",
        "Shtypni [[See the result]].",
      ],
      get: "Shkaku që përputhet më mirë, qartësia, aftësia, kapaciteti, procesi apo përgjegjësia, me një pikë për secilin, tre hapa të parë dhe një [[Question for the floor]].",
      data: "Asgjë që shkruani nuk ruhet e nuk dërgohet.",
    },
    "/tools/pareto/": {
      when: "Kur disa shkaqe bëjnë pjesën më të madhe të problemeve dhe duhet të dini cilin ta rregulloni të parin.",
      how: [
        "Zgjidhni një model: shpërndarje, magazinë ose hotel. Ose [[Load the example]].",
        "Sillni të dhënat: një skedar CSV ose Excel, ose qeliza të ngjitura nga një tabelë.",
        "Kontrolloni kolonat: shkaku, numri, vlera, data.",
        "Renditni shkaqet sipas shpeshtësisë ose kostos. Nëse doni, krahasoni para dhe pas.",
      ],
      get: "Një grafik Pareto i kontrolluar, ku çdo rresht është llogaritur, [[Where to start]], dhe eksporte si PNG, SVG dhe CSV.",
      data: "Skedarët lexohen në shfletues, edhe Excel-i. Ruhen deri në 20.000 rreshta.",
    },
    "/tools/sigma-control-chart/": {
      when: "Kur duhet të dini sa i mirë është një proces, dhe nëse një ditë e keqe është ndryshim i vërtetë apo zhurmë e zakonshme.",
      how: [
        "Për nivelin sigma: njësitë, defektet dhe mundësitë për njësi.",
        "Për dorëzimin perfekt: në kohë, pa dëme dhe e plotë, në përqindje.",
        "Për kartën e kontrollit: çfarë numëroni, sipas ditës ose javës, dhe një bazë krahasimi.",
        "Shtoni ditët një nga një me [[Add a day]], ose importoni rreshta.",
      ],
      get: "Niveli sigma, dorëzimi perfekt dhe një kartë kontrolli që rendit [[Signals to investigate]]. Shkarkojeni si CSV, kopjojeni ose printojeni.",
      data: "Gjithçka mbetet në këtë shfletues.",
    },
    "/tools/five-whys/": {
      when: "Kur një problem kthehet. Nisni nga ajo që ndodhi, jo nga kush e bëri.",
      how: [
        "Shkruani problemin.",
        "Pyesni pse, pesë herë ose sa herë duhet.",
        "Emërtoni shkakun rrënjësor: diçka që mund ta ndryshoni.",
        "Bini dakord për një kundërmasë, një përgjegjës, një afat dhe si do ta dini që funksionoi.",
      ],
      get: "Një fletë pune për ta printuar, ruajtur si PDF ose kopjuar si tekst. Mjetet e regjistrave mund t'ia dërgojnë problemin drejtpërdrejt.",
      data: "Fleta e punës mbetet në këtë shfletues.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "Kur një përmirësim është projekt, jo rregullim i shpejtë.",
      how: [
        "Kaloni nëpër Define, Measure, Analyse, Improve dhe Control. Çdo hap ka rezultatin e vet, idetë kryesore, gabimet e zakonshme, një rast real dhe [[Check yourself]].",
        "Lexoni tetë llojet e humbjeve dhe fjalorthin.",
        "Plotësoni kartën e projektit, ose [[Fill with the course case]] për të parë një shembull.",
      ],
      get: "Një kartë projekti DMAIC për ta printuar, ruajtur si PDF ose kopjuar si tekst.",
      data: "Përgjigjet dhe karta juaj ruhen vetëm në këtë shfletues.",
    },
    "/tools/cv-builder/": {
      when: "Kur CV-ja juaj duhet të duket e dizajnuar, jo e shtypur.",
      how: [
        "Zgjidhni gjuhën e CV-së, anglisht, gjermanisht ose shqip, hapësirat dhe ngjyrat.",
        "Shtoni foto, kontaktet, deri në katër shifra kyçe, një profil dhe arritjet kryesore.",
        "Shtoni përvojën. Faqja e internetit e një kompanie sjell logon e saj.",
        "Shtoni arsimimin, aftësitë dhe gjuhët, pastaj lexoni kontrollin e CV-së.",
      ],
      get: "Një CV që e shihni të ndryshojë në faqe të vërteta A4, e shkarkuar si PDF, dhe një kopje rezervë që e hapni përsëri me [[Open a backup file]].",
      data: "Ruhet në këtë shfletues, bashkë me fotot dhe logot. Vetëm faqet e internetit të kompanive që shkruani shkojnë te shërbimi i ikonave i Google-it, për të marrë logot.",
    },
    "/tools/ats-cv/": {
      when: "Kur një softuer e lexon CV-në tuaj para një njeriu.",
      how: [
        "Nisni nga një skedar PDF ose Word, nga Krijuesi i CV-së ose nga tekst i ngjitur, dhe [[Sort it into the fields]].",
        "Zgjidhni gjuhën, shkronjat dhe ngjyrën e titujve.",
        "Kontrolloni kontaktin, përmbledhjen, përvojën dhe seksionet e tjera.",
        "[[Match a job ad]]: ngjitni njoftimin dhe lexoni kontrollin ATS.",
      ],
      get: "CV-ja juaj si PDF, Word (.docx) dhe tekst i thjeshtë.",
      data: "Ruhet në këtë shfletues. Lexuesi i PDF-ve ngarkohet nga kjo faqe, vetëm kur hapni një PDF.",
    },
    "/tools/cover-letter/": {
      when: "Kur letra duhet të shkojë me CV-në tuaj, në të njëjtin dizajn.",
      how: [
        "Merrni të dhënat [[From the CV Builder]] ose [[From the ATS CV]].",
        "Zgjidhni Modern ose Classic, ngjyrat, shkronjat dhe foton.",
        "Shtoni kompaninë dhe personin të cilit i shkruani.",
        "Përgjigjuni disa pyetjeve, nga pozicioni deri te data e fillimit, dhe [[Write the first draft]]. Pastaj redaktojeni, nënshkruajeni dhe lexoni kontrollin e letrës.",
      ],
      get: "Letra si PDF, Word (.docx) dhe tekst i thjeshtë.",
      data: "Ruhet në këtë shfletues, bashkë me foton dhe nënshkrimin. Asgjë nuk ngarkohet.",
    },
  },
};

const de = {
  title: "Der Werkzeug-Leitfaden",
  subtitle: "Vierzehn kostenlose Tools für die, die die Arbeit führen: wofür sie da sind, wie man sie nutzt und warum sie so aussehen, wie sie aussehen.",
  edition: "Ausgabe 1 · Oktober 2026",
  author: "Stiven Janaqi",
  labels: {
    contents: "Inhalt",
    when: "Wann Sie es nutzen",
    how: "So geht's",
    get: "Was Sie bekommen",
    data: "Ihre Daten",
    open: "Öffnen",
    tools: "Seine Tools",
    routine: "Eine Routine",
    learn: "Kurs",
    page: "Seite",
    planet: "Der Planet",
    moons: "Monde",
    family: "Familie",
  },
  sections: {
    about: {
      kicker: "Über diesen Leitfaden",
      title: "Vierzehn Tools, vier Planeten, eine Idee",
      body: [
        "Stiven Catalyst hat vierzehn kostenlose Tools für die, die die Arbeit führen: Schichtleiter, Area Manager, Prozessmanager und alle, die ihre Erfahrung in die nächste Rolle mitnehmen.",
        "Dieser Leitfaden erklärt, wie die Tools geordnet sind, warum die Website so aussieht, wie sie aussieht, und wie man jedes Tool Schritt für Schritt nutzt. Sie müssen ihn nicht der Reihe nach lesen: Suchen Sie Ihren Planeten und fangen Sie dort an.",
        { cards: [
          { title: "Kostenlos", text: "Jedes Tool ist kostenlos." },
          { title: "Kein Konto", text: "Sie öffnen ein Tool und fangen an. Es gibt nichts, wofür Sie sich anmelden müssten." },
          { title: "Auf Ihrem Gerät", text: "Ihre Arbeit bleibt in Ihrem Browser, nicht auf einem Server. Keine Cookies, keine Analyse." },
        ] },
        { note: "Eine Ausnahme, die im Tool selbst steht: Wenn Sie im Lebenslauf-Generator die Website einer Firma eingeben, geht diese Adresse an den Icon-Dienst von Google, um das Logo zu holen." },
      ],
    },
    start: {
      kicker: "Hier anfangen",
      title: "Welcher Planet ist Ihrer?",
      body: [
        "Die Tools sind nach der Arbeit geordnet, die Sie machen, nicht nach Methode. Fangen Sie mit dem Planeten an, der zu Ihrem Tag passt.",
        { routes: [
          { family: "pulse", text: "Sie führen den Betrieb vor Ort für eine Schicht." },
          { family: "zenith", text: "Sie führen einen Bereich und lesen seine Zahlen Woche für Woche." },
          { family: "lumen", text: "Sie kümmern sich um das ganze System und darum, wie es sich verändert." },
          { family: "atlas", text: "Sie nehmen Ihre Erfahrung in Ihre nächste Rolle mit." },
        ] },
        "Nicht sicher? Fangen Sie mit dem Problem an, das vor Ihnen liegt: Das Inhaltsverzeichnis nennt jedes Tool beim Namen.",
      ],
    },
    system: {
      kicker: "Die Idee, 1",
      title: "Warum ein Sonnensystem",
      body: [
        { diagram: "system" },
        "Auf der Startseite sind die Tools ein kleines Sonnensystem. In der Mitte ist das Licht, die Glühbirne von Catalyst. In der Marke steht sie für Klarheit: den Moment, in dem ein komplexes Problem verständlich wird.",
        "Die Planeten sind Rollen. Jede Umlaufbahn wird so weit, wie der Blick der Rolle reicht: Pulse, der Schichtleiter, sieht eine Schicht; Zenith, der Area Manager, einen Bereich Woche für Woche; Lumen, der Prozessmanager, das ganze System; Atlas ist die Karriere, die jede Rolle mitträgt.",
        "Die Monde sind die Tools, einer für jedes Tool oder jeden Kurs. Tippen Sie auf einen Planeten, öffnen sich seine Tools; tippen Sie auf einen Mond, sind Sie im Tool. Wie in einem echten Sonnensystem bewegen sich die Planeten nahe am Licht am schnellsten.",
      ],
    },
    families: {
      kicker: "Die Idee, 2",
      title: "Vier Familien, vier Farben",
      body: [
        "Jede Rolle ist eine Familie mit eigener Farbe: Pulse violett, Zenith blau, Lumen gold, Atlas silber. Keine davon ist rot oder grün, damit eine Familie nie wie ein Fehler oder ein Erfolg wirkt: Auf dieser Website melden Rot und Grün nur ein Ergebnis in einem Tool.",
        "Auf den Seiten einer Familie tritt ihre Farbe an die Stelle des Blaus der Website, sodass jede Seite nur einen Akzent hat.",
        { planets: [
          { family: "pulse", text: "Risse, die in einem Herzschlag-Ring pulsieren: der Puls einer Schicht." },
          { family: "zenith", text: "Eine Höhenlinienkarte unter einem Radar: ein Bereich von oben, Woche für Woche." },
          { family: "lumen", text: "Er leuchtet von selbst, in einem Staubring aus fünf Teilen: den fünf Schritten von DMAIC." },
          { family: "atlas", text: "Ein Globus mit dem Weg einer Karriere als Sternbild." },
        ] },
      ],
    },
    idea: {
      kicker: "Die Idee, 3",
      title: "Kleine Tools, die zusammenarbeiten",
      body: [
        "Die Idee hinter den Tools ist einfach: Tools aus der Arbeit vor Ort, die nichts brauchen außer einem Browser. Keine Installation, kein Konto, kein Server, der Ihre Daten aufbewahrt.",
        "Mehr als einzelne Rechner sind sie, weil sie sich die Arbeit gegenseitig weitergeben, in Ihrem Browser:",
        { list: [
          "Die Protokolle für Schäden, Vollständigkeit und Verspätungen speisen Shift Pulse, und die Schichtübergabe holt ihre Zahlen mit [[Fill in from the logs]].",
          "Jedes Ergebnis eines Protokolls geht mit einem Knopf weiter: [[Take it to 5 Whys]], [[Open in Pareto 80/20]] oder [[Open as control chart]].",
          "Der CX Control Tower gibt seine Grundursachen an Pareto 80/20 weiter.",
          "Das Anschreiben übernimmt Ihre Angaben aus dem Lebenslauf-Generator oder dem ATS-Lebenslauf.",
        ] },
        "Und auf jeder Rollenseite macht ein Coaching-Bereich aus den Tools eine Praxis: ein Projekt mit Ziel, Messung und Termin für die Überprüfung. Mehr dazu auf den letzten Seiten.",
      ],
    },
    data: {
      kicker: "Bevor Sie anfangen",
      title: "Ihre Arbeit bleibt bei Ihnen",
      body: [
        "Jedes Tool speichert Ihre Arbeit nur in dem Browser, den Sie benutzen. Sie wird nirgendwohin geschickt, und das heißt auch: Sie ist nicht auf Ihrem Handy, wenn Sie am Laptop gearbeitet haben.",
        "Um alles zu sichern oder auf ein anderes Gerät zu bringen, nutzen Sie [[Save all my work]] am Ende jeder Tool-Seite: eine Datei mit der Arbeit aller Tools. [[Open a saved file]] holt sie zurück und ersetzt nur die Tools, die in dieser Datei stehen.",
        { list: [
          "Die meisten Tools lassen sich drucken oder als PDF speichern, und die Protokolle als CSV für Excel herunterladen.",
          "Die Protokoll-Tools führen für jede Sprache der Website ein eigenes Protokoll.",
          "Wenn der Browser nicht speichern kann, sagt das Tool es: Laden Sie die CSV herunter oder kopieren Sie die Zusammenfassung, um Ihre Arbeit zu behalten.",
          "Wer die Browserdaten löscht, löscht auch seine Arbeit. Sichern Sie vorher eine Datei.",
        ] },
      ],
    },
    coaching: {
      kicker: "Vom Tool zur Praxis",
      title: "Der Coaching-Bereich",
      body: [
        "Jede Rollenseite öffnet über den Tools einen Coaching-Bereich. Er macht aus einem guten Ergebnis eine Gewohnheit, die Sie zeigen können.",
        { steps: [
          "Wählen Sie Ihren Kontext: Logistik oder Lager, Hotel oder Service; neu in der Rolle oder erfahren. Ein Name ist freiwillig.",
          "Legen Sie ein Projekt an, mit Ziel, Messung und Termin für die Überprüfung.",
          "Folgen Sie dem Lernpfad Ihrer Rolle: Module mit Methode, Fall, Entscheidung mit Rückmeldung, Aufgabe und Reflexion.",
          "Sichern Sie Nachweise aus der echten Arbeit. Eine datierte Überprüfung am Arbeitsplatz zählt, ein Quiz allein nicht.",
          "Reflektieren Sie mit GROW. Jede Reflexion endet mit einer Maßnahme mit Verantwortlichem und Termin.",
          "Drucken Sie einen Bericht für einen menschlichen Coach, oder exportieren Sie eine Sicherung des ganzen Bereichs.",
        ] },
        "Ein Tool, das aus Ihrem Projekt geöffnet wird, lässt Sie sein Ergebnis und eine Maßnahme in dieses Projekt übernehmen. Bei einem normalen Besuch wird davon nichts geladen.",
        { note: "Auch hier gibt es keinen Server und kein Konto: keine gemeinsame Teamdatenbank und keine automatische Synchronisierung zwischen Geräten." },
      ],
    },
    next: {
      kicker: "Ausgabe 2",
      title: "Was als Nächstes kommen könnte",
      body: [
        "Ideen in Prüfung, keine Versprechen mit Datum. Sagen Sie mir, welche Ihnen am meisten helfen würde.",
        { list: [
          "Schnellere Tool-Seiten: kleinere Skripte, damit die Tools auf dem Handy schneller öffnen.",
          "Die Verspätungsanalyse für Touren ohne erfasste Abfahrtszeit.",
          "Ein gemeinsamer Bereich für einen Coach und ein Team, aber nur mit echten Konten und Zugriffskontrolle, denn das Versprechen dieser Tools ist, dass Ihre Daten Ihre bleiben.",
        ] },
        "Wenn sich ein Tool ändert, bekommt dieser Leitfaden eine neue Ausgabe. Die neueste ist immer auf der Website.",
      ],
    },
    back: {
      motto: "Sieh klar. Denk anders. Handle bewusst.",
      text: "Alle Tools, kostenlos, auf Deutsch, Englisch und Albanisch:",
    },
  },
  families: {
    pulse: "Fünf Tools für eine Schicht: erfassen, was schiefgeht, dort, wo es passiert, die Schicht in einem Bild sehen und sauber übergeben.",
    zenith: "Drei Tools für einen Bereich: die Woche lesen, herausfinden, woher eine rote Zahl wirklich kommt, und mit den Ursachen anfangen, die am meisten wiegen.",
    lumen: "Drei Tools für das ganze System: eine echte Veränderung vom Rauschen unterscheiden, eine Grundursache finden, die man ändern kann, und eine Verbesserung als Projekt führen.",
    atlas: "Drei Tools für die nächste Rolle: ein gestalteter Lebenslauf, ein Lebenslauf, den Bewerbungssoftware richtig liest, und ein Anschreiben, das dazu passt.",
  },
  tools: {
    "/tools/shift-pulse/": {
      when: "Am Ende einer Schicht oder einer Woche, wenn Sie das ganze Bild sehen wollen, bevor Sie die Übergabe schreiben.",
      how: [
        "Wählen Sie einen Zeitraum: 7, 14 oder 30 Tage, oder 8 oder 12 Wochen.",
        "Wählen Sie die Schicht.",
        "Lesen Sie die Karten und die Hinweise.",
        "Öffnen Sie den Trend jeder Zahl.",
      ],
      get: "Ein Blick auf das, was die Protokolle für Schäden, Vollständigkeit, Verspätungen und Übergaben in diesem Browser enthalten: Karten, Hinweise und ein Trend für jede Zahl, zum Kopieren, Drucken oder als PDF.",
      data: "Es speichert nur Ihre Einstellungen. Die anderen Protokolle liest es und ändert nichts daran.",
    },
    "/tools/damage-control/": {
      when: "Jedes Mal, wenn eine Einheit beschädigt wird, an der Stelle im Prozess, an der es passiert.",
      how: [
        "Erfassen Sie jede beschädigte Einheit: Datum, Prozessschritt, Ursache und Einheiten, dazu Kosten und eine Notiz, wenn Sie sie haben. Zeilen aus Excel fügen Sie mit [[Import rows]] ein.",
        "Legen Sie den Zeitraum fest: die bearbeiteten Einheiten und Ihr Ziel.",
        "Prüfen Sie das Protokoll. Um das Tool erst auszuprobieren, laden Sie eine Beispielwoche.",
        "Gehen Sie den [[Floor check]] durch.",
      ],
      get: "Schadensquote, DPMO und Sigma-Niveau, die wenigen Ursachen hinter den meisten Schäden, die Prozessschritte, an denen sie entstehen, ein Trend und wo Sie anfangen. Als CSV herunterladen oder weiter zu 5 Whys, Pareto 80/20 oder einer Regelkarte.",
      data: "Das Protokoll bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/incomplete-control/": {
      when: "Jedes Mal, wenn ein Auftrag ohne alle Artikel oder Pakete hinausgeht.",
      how: [
        "Erfassen Sie jeden unvollständigen Auftrag nach Datum, Prozessschritt und Ursache, oder importieren Sie Zeilen.",
        "Legen Sie den Zeitraum fest: die bearbeiteten Aufträge und Ihr Ziel.",
        "Prüfen Sie das Protokoll.",
        "Gehen Sie den [[Floor check]] durch.",
      ],
      get: "Quote der unvollständigen und Zahl der vollständigen Aufträge, DPMO und Sigma-Niveau, die Ursachen hinter den meisten Fehlern und die Schritte, an denen sie beginnen, mit denselben Exporten und nächsten Schritten wie die Schadenskontrolle.",
      data: "Das Protokoll bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/delay-analyzer/": {
      when: "Wenn Touren zu spät ankommen und Sie wissen müssen, ob die Verspätung an der Rampe oder auf der Straße begann.",
      how: [
        "Erfassen Sie eine Tour: Datum, Schicht, Tour, geplante und tatsächliche Abfahrt, geplante und tatsächliche Ankunft und den Grund, wenn sie zu spät war. Zeilen lassen sich importieren.",
        "Legen Sie die Toleranz in Minuten für Abfahrt und Ankunft fest und Ihr Ziel für Pünktlichkeit.",
        "Prüfen Sie das Protokoll.",
        "Gehen Sie den [[Floor check]] durch.",
      ],
      get: "Pünktlichkeitsquote, jede verspätete Minute aufgeteilt in Rampe und Straße, die Gründe, die Abfahrtszeiten und Schichten hinter den Verspätungen, und ein Trend.",
      data: "Das Protokoll bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/shift-handover/": {
      when: "Am Ende jeder Schicht. Die meisten Probleme gehen nicht in der Schicht verloren, sondern zwischen den Schichten.",
      how: [
        "Wählen Sie eine Vorlage: Lager, Hotel-Rezeption oder Zustellstation. Tragen Sie Datum, Schicht, Bereich und beide Namen ein.",
        "Tragen Sie die Zahlen ein. [[Fill in from the logs]] übernimmt sie aus Schäden, Vollständigkeit und Verspätungen.",
        "Listen Sie die offenen Punkte auf, jeden mit Verantwortlichem und Uhrzeit. Ergänzen Sie Hinweise, Sicherheit und Personal.",
        "Machen Sie den Übergabe-Check.",
      ],
      get: "Eine Ansicht [[Ready to hand over]] zum Kopieren, Drucken oder als PDF, die Sie über Ihren eigenen Kanal verschicken. [[Close shift, start the next]] nimmt die offenen Punkte mit und zählt, wie oft sie übergeben wurden. Frühere Übergaben bleiben in einem Verlauf.",
      data: "Die Übergabe bleibt in diesem Browser. Nichts wird gesendet.",
    },
    "/tools/cx-control-tower/": {
      when: "Jede Woche, um vom Ergebnis beim Kunden zum operativen Treiber, zur Grundursache und zu einer geprüften Maßnahme zu kommen.",
      how: [
        "Laden Sie Ihre Dateien: Zustellungen, Touren, Vorfälle und Maßnahmen, als CSV oder Excel, oder eine einzige Arbeitsmappe. Oder [[Load the example]].",
        "Tragen Sie nur Ziele ein, die Sie freigegeben haben.",
        "Filtern Sie nach Datum, Partner, Schicht und Zone.",
        "Lesen Sie die Reiter, von der Übersicht bis zum [[Weekly review]].",
      ],
      get: "Perfect Delivery für jeden Auftrag, Scorecards, Tourrisiko, ein Pareto der Grundursachen und ein Maßnahmen-Tracker. Review kopieren, drucken oder Tabellen als CSV exportieren.",
      data: "Ihre Dateien werden im Browser gelesen. Nichts wird hochgeladen.",
    },
    "/tools/kpi-diagnostic/": {
      when: "Eine Zahl ist rot geworden. Bevor Sie stärker drücken, finden Sie heraus, wo die Ursache liegt.",
      how: [
        "Nennen Sie den KPI, wenn Sie möchten.",
        "Bewerten Sie zehn Aussagen.",
        "Drücken Sie [[See the result]].",
      ],
      get: "Die Ursache, die am besten passt, Klarheit, Können, Kapazität, Prozessgestaltung oder Verantwortung, mit einem Wert für jede, drei ersten Schritten und einer [[Question for the floor]].",
      data: "Nichts, was Sie eingeben, wird gespeichert oder gesendet.",
    },
    "/tools/pareto/": {
      when: "Wenn wenige Ursachen den größten Teil der Probleme machen und Sie wissen müssen, welche Sie zuerst angehen.",
      how: [
        "Wählen Sie eine Vorlage: Zustellung, Lager oder Hotel. Oder [[Load the example]].",
        "Bringen Sie Ihre Daten mit: eine CSV- oder Excel-Datei oder Zellen aus einer Tabelle.",
        "Prüfen Sie die Spalten: Ursache, Anzahl, Wert, Datum.",
        "Ordnen Sie die Ursachen nach Häufigkeit oder nach Kosten. Wenn Sie möchten, vergleichen Sie vorher und nachher.",
      ],
      get: "Ein geprüftes Pareto-Diagramm, in dem jede Zeile mitgezählt ist, [[Where to start]], und Exporte als PNG, SVG und CSV.",
      data: "Dateien werden im Browser gelesen, auch Excel. Bis zu 20.000 Zeilen werden gespeichert.",
    },
    "/tools/sigma-control-chart/": {
      when: "Wenn Sie wissen müssen, wie gut ein Prozess ist, und ob ein schlechter Tag eine echte Veränderung oder normales Rauschen ist.",
      how: [
        "Für das Sigma-Niveau: Einheiten, Fehler und Fehlermöglichkeiten pro Einheit.",
        "Für die perfekte Zustellung: pünktlich, unbeschädigt und vollständig, in Prozent.",
        "Für die Regelkarte: was Sie zählen, pro Tag oder pro Woche, und eine Basis.",
        "Fügen Sie die Tage einzeln mit [[Add a day]] hinzu, oder importieren Sie Zeilen.",
      ],
      get: "Das Sigma-Niveau, die perfekte Zustellung und eine Regelkarte, die die [[Signals to investigate]] auflistet. Als CSV herunterladen, kopieren oder drucken.",
      data: "Alles bleibt in diesem Browser.",
    },
    "/tools/five-whys/": {
      when: "Wenn ein Problem zurückkommt. Fangen Sie bei dem an, was passiert ist, nicht bei der Frage, wer es getan hat.",
      how: [
        "Schreiben Sie das Problem auf.",
        "Fragen Sie warum, fünfmal oder so oft wie nötig.",
        "Benennen Sie die Grundursache: etwas, das Sie ändern können.",
        "Vereinbaren Sie eine Gegenmaßnahme, einen Verantwortlichen, einen Termin und woran Sie merken, dass es gewirkt hat.",
      ],
      get: "Ein Arbeitsblatt zum Drucken, als PDF oder als Text. Die Protokoll-Tools können ihr Problem direkt hineinschicken.",
      data: "Das Arbeitsblatt bleibt in diesem Browser.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "Wenn eine Verbesserung ein Projekt ist und keine schnelle Lösung.",
      how: [
        "Gehen Sie durch Define, Measure, Analyse, Improve und Control. Jeder Schritt hat sein Ergebnis, Kernideen, häufige Fehler, einen echten Fall und [[Check yourself]].",
        "Lesen Sie die acht Verschwendungsarten und das Glossar.",
        "Füllen Sie den Projektauftrag aus, oder [[Fill with the course case]], um ein Beispiel zu sehen.",
      ],
      get: "Ein DMAIC-Projektauftrag zum Drucken, als PDF oder als Text.",
      data: "Ihre Antworten und Ihr Projektauftrag bleiben nur in diesem Browser.",
    },
    "/tools/cv-builder/": {
      when: "Wenn Ihr Lebenslauf gestaltet aussehen soll und nicht getippt.",
      how: [
        "Wählen Sie die Sprache des Lebenslaufs, Englisch, Deutsch oder Albanisch, die Abstände und die Farben.",
        "Fügen Sie Foto, Kontakt, bis zu vier Kennzahlen, ein Profil und Ihre wichtigsten Erfolge hinzu.",
        "Fügen Sie Ihre Erfahrung hinzu. Die Website einer Firma bringt ihr Logo mit.",
        "Ergänzen Sie Ausbildung, Fähigkeiten und Sprachen, dann lesen Sie den Lebenslauf-Check.",
      ],
      get: "Ein Lebenslauf, den Sie auf echten A4-Seiten entstehen sehen, als PDF heruntergeladen, und eine Sicherungsdatei, die Sie mit [[Open a backup file]] wieder öffnen.",
      data: "Gespeichert in diesem Browser, mit Fotos und Logos. Nur die Firmen-Websites, die Sie eingeben, gehen an den Icon-Dienst von Google, um die Logos zu holen.",
    },
    "/tools/ats-cv/": {
      when: "Wenn eine Software Ihren Lebenslauf vor einem Menschen liest.",
      how: [
        "Beginnen Sie mit einer PDF- oder Word-Datei, mit dem Lebenslauf-Generator oder mit eingefügtem Text, und [[Sort it into the fields]].",
        "Wählen Sie Sprache, Schrift und Farbe der Überschriften.",
        "Prüfen Sie Kontakt, Zusammenfassung, Erfahrung und die übrigen Abschnitte.",
        "[[Match a job ad]]: Fügen Sie die Anzeige ein und lesen Sie den ATS-Check.",
      ],
      get: "Ihr Lebenslauf als PDF, Word (.docx) und reiner Text.",
      data: "Gespeichert in diesem Browser. Der PDF-Leser wird von dieser Website geladen, nur wenn Sie ein PDF öffnen.",
    },
    "/tools/cover-letter/": {
      when: "Wenn das Anschreiben zu Ihrem Lebenslauf passen soll, im selben Design.",
      how: [
        "Übernehmen Sie Ihre Angaben [[From the CV Builder]] oder [[From the ATS CV]].",
        "Wählen Sie Modern oder Classic, die Farben, die Schrift und das Foto.",
        "Tragen Sie die Firma und die Ansprechperson ein.",
        "Beantworten Sie ein paar Fragen, von der Stelle bis zum Eintrittsdatum, und [[Write the first draft]]. Dann bearbeiten, unterschreiben und den Anschreiben-Check lesen.",
      ],
      get: "Das Anschreiben als PDF, Word (.docx) und reiner Text.",
      data: "Gespeichert in diesem Browser, mit Foto und Unterschrift. Nichts wird hochgeladen.",
    },
  },
};

// Lookups for the templates: a family by id, the family of a tool, a tool by its English address in each language.
const family = Object.fromEntries(families.map((item) => [item.id, item]));
const familyOfTool = {};
for (const item of families) for (const url of [...item.tools, ...item.learn]) familyOfTool[url] = item.id;
const tool = Object.fromEntries(Object.entries(toolLists).map(([lang, list]) => [
  lang,
  Object.fromEntries(list.map((item) => [item.url.replace(/^\/(de|sq)(?=\/)/, ""), item])),
]));
const pageOf = (id) => pages.indexOf(id) + 1;

// The solar system of the homepage, drawn flat for print: the light in the middle, each role on its orbit
// (families.json "orbit"), a moon for every tool and course. The angles only spread the planets around the light.
const ANGLES = { pulse: 25, zenith: 205, lumen: 118, atlas: 305 };
const r1 = (value) => Math.round(value * 10) / 10;
const system = families.map((item) => {
  const rx = item.orbit * 150;
  const ry = rx * 0.4;
  const angle = (ANGLES[item.id] * Math.PI) / 180;
  const x = 200 + rx * Math.cos(angle);
  const y = 150 + ry * Math.sin(angle);
  const count = item.tools.length + item.learn.length;
  const moons = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 - 1.2;
    return { x: r1(x + 13 * Math.cos(a)), y: r1(y + 9 * Math.sin(a)) };
  });
  return { id: item.id, name: item.name, role: item.role, color: item.color, rx: r1(rx), ry: r1(ry), x: r1(x), y: r1(y), below: y > 150, moons };
});

export default {
  slug: "tools-guide",
  langs: ["en", "sq", "de"],
  pages,
  family,
  familyOfTool,
  tool,
  toolCount: toolLists.en.length,
  pageOf: Object.fromEntries(pages.map((id) => [id, pageOf(id)])),
  system,
  en,
  sq,
  de,
};
