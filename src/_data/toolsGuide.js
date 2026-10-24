// The Tools Guide: the text of the printed guide (src/guide-print/print.njk, scripts/tools-guide.mjs) and of its
// reader pages (src/_includes/pages/guide.njk), in English, Albanian and German.
//
// Every fact here comes from the tools themselves: what you enter, what you get, where it is kept.
// Tool names, types and times come from tools.json; roles, scopes, lines and routines from families.json.
// [[Label]] is a button or field of a tool: it is printed in quotes, in the language of the guide (ui.json).
// The page order is the same in every language: the roles and their tools in the order of families.json, the tools of
// a role first and then its course. A role with a long routine (families.json) gives it a page of its own after the
// role's opening page ("routine:<id>"); the routine of a role without one stays on its opening page.
import fs from "node:fs";

const read = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url), "utf8"));

// The edition: a tool that changes gives the guide a new one (the page "What comes next" says so). Its number is shown
// on the cover, on the reader and on every tool page that shows its page of the guide; the day it came out dates it in
// the site's feeds. Every earlier edition stays on the site as it was printed (editions below, and
// src/media/guides/tools-guide/editions/).
const EDITION = 4;
const EDITION_DATE = "2026-10-24";
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
  "machine",
  "data",
  "family:pulse",
  "routine:pulse",
  "tool:/tools/shift-pulse/",
  "tool:/tools/damage-control/",
  "tool:/tools/incomplete-control/",
  "tool:/tools/delay-analyzer/",
  "tool:/tools/night-audit/",
  "tool:/tools/shift-handover/",
  "tool:/tools/action-tracker/",
  "tool:/tools/daily-board/",
  "tool:/tools/five-s-audit/",
  "tool:/tools/safety-cross/",
  "tool:/tools/lost-found/",
  "family:zenith",
  "routine:zenith",
  "tool:/tools/cx-control-tower/",
  "tool:/tools/kpi-diagnostic/",
  "tool:/tools/pareto/",
  "tool:/tools/a3-report/",
  "tool:/tools/kaizen-board/",
  "tool:/tools/skills-matrix/",
  "tool:/tools/oee/",
  "tool:/tools/hotel-kpis/",
  "tool:/tools/gemba-walk/",
  "tool:/tools/ops-report/",
  "tool:/tools/room-inspection/",
  "tool:/tools/maintenance-planner/",
  "family:lumen",
  "routine:lumen",
  "tool:/tools/sigma-control-chart/",
  "tool:/tools/five-whys/",
  "tool:/tools/fishbone/",
  "tool:/tools/fmea/",
  "tool:/tools/process-lab/",
  "tool:/tools/time-study/",
  "tool:/tools/value-stream-map/",
  "tool:/tools/standard-work/",
  "tool:/tools/spaghetti-diagram/",
  "tool:/tools/project-portfolio/",
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
  subtitle: "Thirty-six free tools and a course for the people who run the work: what they are for, how to use them, and why they look the way they do.",
  edition: `Edition ${EDITION} · October 2026`,
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
    routineNote: "Where each tool fits into the work of this role, step by step.",
    learn: "Course",
    page: "Page",
    planet: "The planet",
    moons: "moons",
    family: "Family",
  },
  sections: {
    about: {
      kicker: "About this guide",
      title: "Thirty-six tools, four planets, one idea",
      body: [
        "Stiven Catalyst has thirty-six free tools and a course for the people who run the work: shift leads, area managers, process managers, and anyone carrying their experience into the next role.",
        "This guide explains how the tools are organised, why the site looks the way it does, and how to use each tool, step by step. You do not need to read it in order: find your planet and start there.",
        { cards: [
          { title: "Free", text: "Every tool is free to use." },
          { title: "No account", text: "You open a tool and start. There is nothing to sign up for." },
          { title: "On your device", text: "Your work is kept in your browser, not on a server. No cookies, no analytics." },
        ] },
        { note: "Two exceptions, stated in the tools: when you type a company's website in the CV Builder, that address goes to Google's icon service to fetch the logo; and [[Team sync]], if you turn it on, sends the tools you choose, encrypted on your device, to your team's copy." },
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
          "The Damage, Incomplete and Delay logs feed Shift Pulse and the Daily Board, and the Shift Handover takes their numbers with [[Fill in from the logs]].",
          "Any log result goes on with one button: [[Take it to 5 Whys]], [[Open in Pareto 80/20]], [[Open as control chart]] or [[Add to actions]].",
          "5 Whys sends its countermeasure to the Action Tracker or puts it on the Shift Handover.",
          "The CX Control Tower and the Fishbone send their causes to Pareto 80/20; the A3 Report takes the Pareto result and the 5 Whys worksheet.",
          "The Cover Letter takes your details from the CV Builder or the ATS CV.",
          "The Operations Report reads them all and writes the report of the week or the month.",
        ] },
        "And on each role page, a coaching workspace turns the tools into a practice: a project with a goal, a measurement and a review date. More on the last pages.",
      ],
    },
    machine: {
      kicker: "The idea, 4",
      title: "One list, one workplace",
      body: [
        "Sixteen of the tools were made as one daily system for the floor, from the huddle to the standard. Three things hold them together, all in your browser:",
        { list: [
          "One list of actions. A countermeasure from 5 Whys, a finding of the 5S Audit, a signal of Process Lab: each becomes an action in the Action Tracker, with an owner, a due date, a status and a way to check it. A tool hands it over once, never twice.",
          "One workplace profile. The site, its shifts, its areas with their owners, its teams and the targets are typed once, on the Daily Board, in the 5S Audit, the Gemba Walk or the Skills Matrix, and every tool that needs them offers them. Without a profile, each tool works with what you type into it.",
          "One kind of chart. Point at or tap a chart to read its values, tap a cause to filter by it, mark a change on the timeline to see it on every trend, and download any chart as SVG or PNG in print colours.",
        ] },
        "A day with them: the logs and the Safety Cross through the shift, the Daily Board at the huddle, a Gemba Walk or a 5S Audit on the floor, and once a week ten minutes with the Action Tracker: overdue first, then this week, then what was verified.",
        { note: "The list of actions and the workplace profile are the same in every language of the site; everything else is kept per language." },
      ],
    },
    data: {
      kicker: "Before you start",
      title: "Your work stays with you",
      body: [
        "Every tool keeps your work only in the browser you use. It is not sent anywhere unless you turn on team sync, so what you did on your laptop is not on your phone.",
        "To keep everything, or to move it to another device, use [[Save all my work]] at the end of any tool page: one file with the work of every tool. [[Open a saved file]] brings it back and replaces only the tools in that file.",
        { list: [
          "Most tools print or save as PDF, and the logs download as CSV and as Excel.",
          "Each tool keeps its work separately for each language of the site, except the list of actions and the workplace profile.",
          "A tool you have opened once opens again without a connection, and the site can be installed as an app.",
          "The browser keeps a restore point of all your work once a day and before a file replaces anything; [[Restore points]] in the same box brings one back.",
          "[[Team sync]] shares the tools you tick with your team's devices. A code of six words makes the key, and the work is encrypted on the device, so the server cannot read it. Write the code down: it is shown once.",
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
        { note: "Here too there is no server and no account. The coaching workspace is yours alone: team sync never shares it." },
      ],
    },
    next: {
      kicker: "Edition 4",
      title: "What could come next",
      body: [
        "Ideas under consideration, not promises with dates. Tell me which one would help you most.",
        { list: [
          "Shift Pulse and the Daily Board reading Room Inspection and the Maintenance Planner.",
          "The Delay Analyzer for routes without a recorded departure time.",
          "Team sync with a code for each person, so that one member can leave without a new code for everyone.",
        ] },
        "When a tool changes, this guide gets a new edition. The newest one is always on the site, and the earlier ones stay there as they were printed.",
      ],
    },
    back: {
      motto: "See clearly. Think differently. Act deliberately.",
      text: "All the tools, free, in English, German and Albanian:",
    },
  },
  families: {
    pulse: "Eleven tools for one shift: log what goes wrong where it happens, keep the floor safe and in order, run the huddle, see the shift in one picture, keep the guests' lost items, and hand it over cleanly, with every action on one list.",
    zenith: "Twelve tools for one area: read the week, find where a red number really comes from, start with the causes that matter most, put a problem on one sheet, grow the team's ideas and skills, inspect the rooms, plan the maintenance and report the week.",
    lumen: "Ten tools and a course for the whole system: tell a real change from noise, reach a root cause you can change, rate the risks, time, map and walk the flow, write the standard, and run improvements as a portfolio of projects.",
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
      get: "One look at what the Damage, Incomplete, Delay and Handover logs in this browser hold, and the Safety Cross, OEE, the open actions and the latest 5S audit once they have data: cards and a trend for each number, flagged [[Above usual]] only beyond the control-chart limit of its usual level, to copy, print or save as PDF.",
      data: "It keeps only your settings. It reads the other tools and changes nothing in them.",
    },
    "/tools/damage-control/": {
      when: "Every time a unit is damaged, at the stage where it happens.",
      how: [
        "Log each damaged unit: date, stage, cause and units, with a cost and a note if you have them. Rows from Excel can be pasted with [[Import rows]].",
        "Set the period: the units handled and your target.",
        "Review the log. To try the tool first, load an example week.",
        "Walk the [[Floor check]].",
      ],
      get: "Damage rate, DPMO and sigma level, the few causes behind most of the damage, the stages where it happens, a trend, and where to start. Download it as CSV or Excel, or take it on to 5 Whys, Pareto 80/20, a control chart or the Action Tracker.",
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
      get: "On-time rate, every late minute split into dock and road, the reasons, the departure hours and shifts behind the delays, and a trend, with the same exports and next steps as Damage Control.",
      data: "The log stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/night-audit/": {
      when: "Every night, for each no-show, declined card, posting error or open balance the audit finds.",
      how: [
        "Log each exception: date, shift, the stage of the stay where it was found, its type and cause, and the reservations affected, with a cost and a note if you have them. Rows from the PMS or Excel can be pasted with [[Import rows]].",
        "Set the period: the reservations handled and your target.",
        "Review the log. To try the tool first, load an example week.",
        "Walk the [[Floor check]] of the audit standard.",
      ],
      get: "Exception rate and clean reservations, DPMO and sigma level, the few causes behind most exceptions and the stage of the stay where they start, with the same exports and next steps as Damage Control. The hotel handover takes its no-shows from here.",
      data: "The log stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/shift-handover/": {
      when: "At the end of every shift. Most problems are not lost on the shift; they are lost between shifts.",
      how: [
        "Choose a template: warehouse, hotel front office or delivery station. Fill in date, shift, area and both names.",
        "Add the numbers. [[Fill in from the logs]] takes them from Damage, Incomplete and Delay; the hotel template takes its no-shows from the Night Audit Log.",
        "List the open issues, each with an owner and a time. Add heads-ups, safety and people.",
        "Run the handover check.",
      ],
      get: "A [[Ready to hand over]] view to copy, print or save as PDF, and send through your own channel. [[Close shift, start the next]] carries the open issues forward and counts how often they were carried; an open issue goes on to 5 Whys or the Action Tracker. Earlier handovers stay in a history.",
      data: "The handover stays in this browser. Nothing is sent.",
    },
    "/tools/action-tracker/": {
      when: "Whenever a tool gives you something to do, and once a week to close the loop: one list for every countermeasure, finding and signal.",
      how: [
        "Write the action as a verb, with an owner, a due date and how you will know it worked. Or send it from another tool: it arrives with its source.",
        "Move it from open to in progress, done and verified. Done says the change was made; verified says the number moved and stayed.",
        "Filter by status, by owner or by the tool it came from.",
        "Hold the weekly review: overdue first, then due this week, then what was verified. [[Copy the review]] for the meeting.",
      ],
      get: "The week in actions: what is overdue and who carries it, the actions closed per week, the due dates on a month calendar, and the review to copy or print. The list downloads as CSV, as Excel or as a [[Calendar file (.ics)]] with every open due date.",
      data: "The list stays in this browser, the same in every language. An action sent from a tool is added once, never twice.",
    },
    "/tools/daily-board/": {
      when: "At the start of every shift, for a huddle of ten minutes, standing.",
      how: [
        "Fill in the [[Workplace profile]] once: the site, its shifts, its areas with their owners, and the targets that colour the board.",
        "Let the logs in this browser colour Safety, Quality and Delivery: the Safety Cross, the 5S Audit, Damage Control, Incomplete Control, the Night Audit Log and the Delay Analyzer.",
        "Mark Cost and People by hand with [[Add to the board]]. An entry by hand overrules the logs for that day.",
        "Read the [[Huddle agenda]] out: yesterday's board, the actions overdue or due today, the carried handover issues and the safety message of the day.",
      ],
      get: "Safety, Quality, Delivery, Cost and People as five month calendars of green, amber and red days, the red days per letter against last month, and the agenda to copy or print. A red day goes on with [[Add to actions]] or [[Take it to 5 Whys]].",
      data: "Your entries by hand stay in this browser and download as CSV or Excel. The board reads the other logs and changes nothing in them.",
    },
    "/tools/five-s-audit/": {
      when: "On a fixed weekday, in the same areas and in the same order, to see whether order on the floor holds.",
      how: [
        "Choose 5S, 6S or 8S, a checklist for warehouse, hotel or delivery station, the area and the date.",
        "Walk the area and score each question as you see it now, from 0, nothing in place, to 4, the full standard. Note what you see at 2 or below, with a photo.",
        "[[Save audit]], then [[Add findings to actions]] to give each finding an owner in the Action Tracker.",
        "Tag what may not belong there in the [[Red tag register]], with a reason, a decision and an owner.",
      ],
      get: "A radar of each S against the last walk of the area, the trend and a league table of the areas, the weakest questions, the open red tags by age, and the photos before and after, side by side. The [[Audit plan]] shares the areas among the auditors in turn and downloads as a calendar file. [[Print scorecard]], or download as CSV or Excel.",
      data: "The audits, the red tags and the photos stay in this browser. Nothing is sent or uploaded.",
    },
    "/tools/safety-cross/": {
      when: "The day it happens: every accident, first aid, near miss, unsafe condition or act, and the positive observations too.",
      how: [
        "Log each event: date, shift, type, area, what happened, the cause and its severity as the potential, not the outcome, with an action and an owner. Rows can be imported.",
        "Enter the hours worked in the month for LTIFR and TRIR and, if you like, a target of near-miss reports and a goal of days without an accident.",
        "Read the cross of the month, then the cause to tackle first.",
        "Give the talk of the day at the briefing, then [[Mark as held]].",
      ],
      get: "The month as a green cross with a red or amber day for each event, the days since the last accident, LTIFR, TRIR, the Bird pyramid and where the events happen. [[Send open actions to the Action Tracker]], or take the top cause to 5 Whys or Pareto 80/20.",
      data: "The log stays in this browser and downloads as CSV or Excel. Nothing is sent or uploaded.",
    },
    "/tools/lost-found/": {
      when: "The moment a found item reaches reception, and once a day for the items due for a decision.",
      how: [
        "Log the item: date, time, where it was found, the category, its value class, who found it, where it is stored and a tag number on the item, scanned or typed. A photo stays on this device.",
        "High-value items, phones, documents, wallets and jewellery, go into the safe the same hour. Write a guest's name only when the item clearly belongs to one.",
        "Record each next step: guest contacted, returned in person or by post with its tracking number, handed to the police, given to charity or destroyed. [[Copy the reply]] gives a polite text for the guest in the page's language.",
        "Under [[Settings]], set how long each value class is kept; the list of items due for a decision shows what has passed its date.",
      ],
      get: "The open items by age, the items due for a decision, where things are left most and how many go back to their owner, a [[Print tag label]] for the item, and the register as CSV or Excel. [[Remove guest names of closed items]] clears the personal data of the cases that are done.",
      data: "The register and the photos stay in this browser. Nothing is sent. The keep-until dates are defaults: your house rules and local law decide.",
    },
    "/tools/cx-control-tower/": {
      when: "Every week, to go from the customer's outcome to the operational driver, the root cause and an action that is checked.",
      how: [
        "Load your files: deliveries, routes, incidents and actions, as CSV or Excel, or one workbook. Or [[Load the example]].",
        "Enter only the targets you have approved.",
        "Filter by dates, partner, shift and zone.",
        "Read the tabs, from the overview to the [[Weekly review]].",
        "In the [[Deep dive]], pick one failure, see where it concentrates and which incidents record it, write the investigation and [[Create the linked action]].",
      ],
      get: "Perfect Delivery for every order, scorecards, route risk, a Pareto of root causes, a deep dive per failure with its case register, and an action tracker. Copy the review, print it, or export tables as CSV.",
      data: "Your files are read in the browser. Nothing is uploaded.",
    },
    "/tools/kpi-diagnostic/": {
      when: "A number turned red. Before you push harder on it, find out where the cause sits.",
      how: [
        "Name the KPI, if you like.",
        "Rate ten statements.",
        "Press [[See the result]].",
      ],
      get: "The cause that fits best (clarity, skill, capacity, process design or ownership), with three first moves and a [[Question for the floor]]; when no single cause stands out, the advice to go and see the work. A score for each cause either way, to take on to 5 Whys or the Action Tracker.",
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
    "/tools/a3-report/": {
      when: "When one problem deserves one sheet: the facts, the target, the cause and the follow-up, agreed before anyone starts.",
      how: [
        "Start a [[New A3]] with a title, an owner and a date.",
        "Fill the seven boxes in order: the background, the current condition with its key number, the target and its date, the root cause, the countermeasures with an owner each, the plan, and how you will check.",
        "Bring in what you already have: [[Read the Pareto result]] for the current condition, [[Take from 5 Whys]] for the root cause.",
        "Read the [[Quality check]], then [[Send countermeasures to the Action Tracker]].",
      ],
      get: "One sheet with the gap between the baseline, the target and the latest value, and an eight-point check of the sheet itself. Print it on A3 or A4, copy it as text or [[Download Word]].",
      data: "Every A3 is saved in this browser as you type, in a list where you can open, duplicate or delete it.",
    },
    "/tools/kaizen-board/": {
      when: "Every week, to collect the team's ideas and give each one an answer within the week.",
      how: [
        "Write the idea, what it removes, the area and who proposed it, rate its effort and impact from 1 to 5, add a saving if you know it, and [[Add to the board]].",
        "Move each card through Plan, Do and Check to Adopted, or drop it with a reason the person can read.",
        "Start with the quick wins: low effort and high impact, top left on the matrix.",
        "A big idea goes on with [[Take to A3]]; the next step of a card goes to the Action Tracker with [[Add to actions]].",
      ],
      get: "The board with the days each card has waited, the open ideas ranked by priority, the adoption rate, the days from idea to adopted, the savings per month and per year, and the idea of the month. Download it as CSV or Excel.",
      data: "The board stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/skills-matrix/": {
      when: "Before you plan the rota or the training, to see which tasks hang on one person.",
      how: [
        "Name the team and [[Load the tasks]] of a template, warehouse, hotel front office or delivery station, each with its criticality, minimum level and target.",
        "Add the people, with their shift.",
        "Rate each person on each task, together with them, from 0, not trained, to 4, can train. A click raises the level by one.",
        "[[Suggest a plan]]: it pairs each trainee with a level 4 on the same task, the most critical gaps first. Then [[Send plan to the Action Tracker]].",
      ],
      get: "The cover against target of every task and shift, the single points of failure, who is below a minimum and the flexibility index, and with [[Take a snapshot]] each month, whether the training works. The matrix and the plan download as CSV or Excel.",
      data: "The matrix stays in this browser. [[Anonymise names]] shows each person as a number, on the page and in the exports.",
    },
    "/tools/oee/": {
      when: "Every shift, for the machine or the line that sets the pace.",
      how: [
        "Add each machine with its ideal rate from the machine plate, or its ideal cycle, and [[Save machine]].",
        "Log a shift: the planned minutes, the stops with their reasons and minutes, the pieces made and the rejects. Rows can be imported.",
        "Planned stops, such as breaks, meetings or no orders, are taken out of the planned time.",
        "Choose a machine or all of them, and the period.",
      ],
      get: "Availability, performance, quality and OEE per machine, the six big losses day by day, the top stop reasons and the loss to attack first, with a [[Question for the floor]]. Copy or print it, or take it on to 5 Whys, Pareto 80/20 or the Action Tracker.",
      data: "The machines and the log stay in this browser and download as CSV or Excel.",
    },
    "/tools/hotel-kpis/": {
      when: "Every morning, with last night's figures from the night audit or the PMS.",
      how: [
        "Enter the total rooms and the budget of the month: occupancy and ADR, and RevPAR if it is not simply the two multiplied.",
        "Log each night: rooms available and sold, room revenue, arrivals, departures, no-shows, walk-ins, rooms out of order, breakfast covers and complaints. Or paste the PMS export with [[Import rows]].",
        "Read the month to date against the budget, and where to start.",
        "[[Copy the morning report]] for the meeting.",
      ],
      get: "Occupancy, ADR and RevPAR against the budget, the forecast for the month, the weekday pattern, the best and the worst night, and the revenue that leaked through no-shows and rooms out of order. The weakest KPI goes on to 5 Whys or the Action Tracker.",
      data: "The log stays in this browser and downloads as CSV or Excel. A night logged twice keeps its latest figures.",
    },
    "/tools/gemba-walk/": {
      when: "Where the work is done: the team lead every day, the area manager every week, the site lead every month.",
      how: [
        "Choose a layered process audit or a waste walk, the layer, a checklist for warehouse, hotel or delivery station, and the area.",
        "On the floor, answer each question yes, no or n.a., or tap + for every waste you see. [[Start the timer]] to know how long the walk took.",
        "[[Save walk]], then [[Add findings to actions]] for every no you could not fix on the spot.",
        "Set how often each layer walks: the results flag a layer that is late.",
      ],
      get: "Compliance per week and layer, the questions that fail most and the areas where the no answers sit, the wastes by area with the vital few, and the next walk of each layer. [[Print the walk sheet]] to walk with paper.",
      data: "The walks stay in this browser and download as CSV or Excel.",
    },
    "/tools/ops-report/": {
      when: "At the end of the week or the month, before the meeting with your manager.",
      how: [
        "Choose the period: this or last week, this or last month, or two dates.",
        "See what the report reads: each section appears only when its tool holds data for the period, from Damage Control, the Delay Analyzer, OEE and the 5S Audit to the Safety Cross, Hotel KPIs, the Kaizen Board and the Action Tracker.",
        "Type the site name and the targets once, in the workplace profile; a target typed into a log wins.",
        "Read the summary: the biggest risk, the decision it needs and three priorities for next week, which go to the Action Tracker with one tap.",
      ],
      get: "Safety, quality, delivery, equipment, workplace, hotel, improvement and actions, each against the period before and its target, as a number, a chart and a sentence. [[Copy as text]] for an email, [[Print or save as PDF]] on A4, or [[Download Word]].",
      data: "The report has no data of its own: it reads the other tools in this browser and changes nothing in them.",
    },
    "/tools/room-inspection/": {
      when: "After a room is cleaned and before reception sells it, and once a week to see where to coach.",
      how: [
        "Set up the rooms once: [[Generate rooms]] from the floors and room numbers, or paste a list, with the room types and the team.",
        "Scan the code on the door or type the room, choose the checklist, standard, suite, public area or your own, and mark each item pass, fail or n.a., zone by zone. A failed critical item fails the room on its own.",
        "Mark the faults, then [[Mark the rest as pass]]. Add a photo of a fault and say whether it needs a re-clean or maintenance.",
        "[[Save inspection]]: maintenance items go to the Action Tracker, re-cleans back to the room attendant.",
      ],
      get: "The first-time pass rate by attendant, floor and room type, the weekly trend, the faults that fail most and a heat map of zones by floor, to coach rather than blame. [[Print inspection sheet]] or [[Print daily summary]], and download the inspections as CSV or Excel.",
      data: "The inspections and photos stay in this browser. A checklist of your own can be saved as a template file for the other hotels of the group.",
    },
    "/tools/maintenance-planner/": {
      when: "Once a week to plan the work, and on the day a task is done or postponed, or a machine breaks down.",
      how: [
        "[[Add an asset]] with its tag, area, type and criticality A, B or C, and take the typical tasks of its type. Set when each task was last done.",
        "Give each task its interval in days, weeks, months or years, or in operating hours, whichever comes first. Statutory checks carry a label: check your local rules.",
        "[[Log work]] the day it happens: done, postponed with a reason, a breakdown with its downtime and cause, or a meter reading. Scan the tag to pick the asset.",
        "[[Print the work list]] of the week for the team, or download the plan as a [[Calendar file (.ics)]].",
      ],
      get: "What is due and what is overdue, the PM compliance over 90 days, a month calendar, compliance by area and type, a Pareto of downtime by asset, MTBF and MTTR. Overdue tasks on A assets and repeated breakdowns go to the Action Tracker, the causes to Pareto 80/20, one breakdown to 5 Whys.",
      data: "The plan, the log and the photos stay in this browser and download as CSV or Excel.",
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
      get: "A worksheet to print, save as PDF or copy as text. The log tools can send their problem straight into it, and the countermeasure goes on with [[Put the countermeasure on the handover]] or [[Add the countermeasure to the Action Tracker]].",
      data: "The worksheet stays in this browser.",
    },
    "/tools/fishbone/": {
      when: "When the team needs to see every possible cause of one effect before it chooses which to check.",
      how: [
        "Write the effect at the head of the fish, as a fact, with the number if you have it.",
        "Choose the bones: 6M for production, warehouse and delivery, 4P for a service, or the five bones of a hotel.",
        "Fill each bone with the team, up to 12 causes, each with its why.",
        "Count the votes and mark the likely causes, then [[Send likely causes to actions]] to have each one verified on the floor.",
      ],
      get: "The fish as one picture, the causes ranked by votes, and the top cause ready for 5 Whys or all of them for Pareto 80/20. [[Copy as outline]], print it on one page, or download it as CSV or Excel.",
      data: "Your diagrams stay in this browser, in a list where you can open, duplicate or delete them.",
    },
    "/tools/fmea/": {
      when: "Before a process starts or changes, or after a failure that must not come back: rate the risks while they are still cheap.",
      how: [
        "Name the process, the owner, the date and the revision, and [[Fill the steps]] from a template, or [[+ Add a failure mode]].",
        "For each step, write how it can fail, the effect, the cause and the controls you have today.",
        "Rate severity, occurrence and detection from 1 to 10. Read the action priority first, the RPN second.",
        "Give each high or medium row an action with an owner, and rate the row again when the action is done.",
      ],
      get: "The action priority (AIAG-VDA) and the RPN of every row, a heat map of severity against occurrence, the top ten risks, and the RPN before and after the actions. [[Add open actions to the Action Tracker]], print on A3 or A4, or download as CSV or Excel.",
      data: "The sheet stays in this browser. [[Save the sheet (.json)]] keeps a copy you can open again on another device.",
    },
    "/tools/process-lab/": {
      when: "When you measure a process, minutes, weights or defects, and need to know whether it is stable, whether it is capable, or whether it really changed.",
      how: [
        "Paste the measurements, a date and a value per line, or groups, and say what is measured. The tool picks the chart: I-MR, Xbar-R, Xbar-S, p, np, c or u.",
        "Add the specification limits and a target, and the date a change started, to split the limits before and after it.",
        "Under [[Before / after]], compare two rates or two sets of measurements; under [[How many to measure]], find the sample you need.",
        "For the causes and the gauge: [[Chi-square]] of a table of counts, [[Regression]] of x and y, and the [[Measurement system]]: attribute agreement and Gage R&R.",
      ],
      get: "The control chart with the Nelson rules, the histogram against the specification, Cp, Cpk and PPM, a scatter with its fitted line, Fleiss' kappa and the share of variation the gauge takes, every number with a sentence that says what it means. [[Add the signal to actions]], or download as CSV or Excel.",
      data: "Your numbers stay in this browser. Nothing is sent or uploaded.",
    },
    "/tools/time-study/": {
      when: "At the line, with a stopwatch, before you balance the work again or write the standard.",
      how: [
        "Enter the demand and the available minutes per shift: the tool gives the takt.",
        "Add the stations in the order of the flow, each with its elements, marked VA, NVA or W.",
        "[[Start timing]] and press [[Lap]], or the space bar, at the end of each element. Time at least three cycles per station; five is better.",
        "Read the Yamazumi against the takt, and the balance moves.",
      ],
      get: "The standard time of each element with its spread, a Yamazumi of every station against the takt, how much of the time is waste, the bottleneck and the first element to move. [[Add the balance moves as actions]], or download the standard times as CSV or Excel.",
      data: "The stations and the timings stay in this browser. Timings can also be typed or pasted.",
    },
    "/tools/value-stream-map/": {
      when: "When the lead time is long and you need to see where it goes, from the supplier to the customer.",
      how: [
        "Name the product or service family, the customer demand per day and the working minutes.",
        "[[Fill the steps]] from a template, or add them: cycle time, changeover, uptime, yield and operators.",
        "Walk the stream and count the pieces waiting before each step: the tool turns them into time.",
        "Switch to the [[Future state]], change what the improvements change, and write each change as a kaizen burst.",
      ],
      get: "The map with its lead-time ladder, the share of the lead time that is work, the takt and the steps above it, the current and the future state. [[Send kaizen bursts to the Action Tracker]], or download as CSV or Excel.",
      data: "The map stays in this browser. Nothing is sent or uploaded.",
    },
    "/tools/standard-work/": {
      when: "When one job must be done the same way on every shift, and a new person must be able to learn it.",
      how: [
        "Start from a template with [[Use this template]], or describe the job: title, process, area, owner, takt or target time, PPE and tools.",
        "Write the major steps in order, each in a few words, with its time.",
        "Add the key points that make or break each step, marked Safety, Quality, Technique or Cost, each with its reason.",
        "Read the [[Quality check]]. When the job changes, start a [[New version]] and write what changed.",
      ],
      get: "A job breakdown sheet with the time per step against the takt and its change history, to print, copy as text or [[Download Word]]. [[Train the team on it]] puts the training in the Action Tracker; [[Audit this standard]] opens the 5S Audit.",
      data: "Every standard is saved in this browser as you type, in a list where you can open, duplicate or delete it.",
    },
    "/tools/spaghetti-diagram/": {
      when: "When a job takes too much walking, picking, packing or turning a room, and before and after you change the layout.",
      how: [
        "Name the job, then load a photo of the floor plan or use the plain grid. [[Set the scale]] by tapping two points whose real distance you know.",
        "Follow the job, not the person: [[+ New walk]], then tap every turn of the path. Name a stop before you tap it; a tap near a stop counts as another visit. [[Finish the walk]].",
        "Draw three to six cycles of the same job, and give the cycles per shift and the walking speed.",
        "Make the change, then walk the job again under [[After the change]].",
      ],
      get: "The metres per cycle and per shift, the minutes walked, the stops visited most, the longest repeated leg, a heat grid and the saving after the change. [[Take to the Kaizen Board]], [[Time it with the Time Study]] or [[Add the change to the actions]], and download the points as CSV or Excel.",
      data: "The plan image and the walks stay on this device. Nothing is uploaded.",
    },
    "/tools/project-portfolio/": {
      when: "Once a week for every improvement that runs as a DMAIC project, and at each tollgate with the sponsor.",
      how: [
        "[[+ New project]] with its charter: the problem as a number, the goal, the scope, the lead, the sponsor and the dates.",
        "Fill in the worksheets of its phase: SIPOC, CTQ tree, RACI and Kano in Define; defects, units, opportunities, RTY and COPQ in Measure and Analyze; the control plan in Control.",
        "At the end of each phase, tick the tollgate's checklist and [[Close this tollgate]] with the sponsor's name and date, or close it with a written reason.",
        "Write down the hard savings by month as finance confirms them; soft savings stay an estimate.",
      ],
      get: "Every project on one page: its phase, status, days in the phase, the next tollgate, sigma before and after, and savings planned against realised. [[Control plan to the Action Tracker]] gives each control to its owner; [[Print this project]] or [[Download Word]].",
      data: "The portfolio stays in this browser and downloads as CSV or Excel.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "When an improvement is a project, not a quick fix.",
      how: [
        "Work through Define, Measure, Analyse, Improve and Control. Each step has its output, key ideas, common mistakes, a real case, the tools that belong to it and [[Check yourself]].",
        "Read the eight wastes and the glossary.",
        "Fill in the project charter, or [[Fill with the course case]] to see an example.",
      ],
      get: "A DMAIC project charter to print, save as PDF or copy as text. Once every answer is right, the course gives a certificate of completion with your name: [[Print the certificate]].",
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
  subtitle: "Tridhjetë e gjashtë mjete falas dhe një kurs për ata që e drejtojnë punën: për çfarë shërbejnë, si përdoren dhe pse duken ashtu siç duken.",
  edition: `Botimi ${EDITION} · tetor 2026`,
  author: "Stiven Janaqi",
  labels: {
    contents: "Përmbajtja",
    when: "Kur e përdor",
    how: "Si e përdor",
    get: "Çfarë merr",
    data: "Të dhënat e tua",
    open: "Hape mjetin",
    tools: "Mjetet",
    routine: "Një rutinë",
    routineNote: "Ku hyn secili mjet në punën e këtij roli, hap pas hapi.",
    learn: "Kurs",
    page: "Faqe",
    planet: "Planeti",
    moons: "hëna",
    family: "Familja",
  },
  sections: {
    about: {
      kicker: "Për këtë udhëzues",
      title: "Tridhjetë e gjashtë mjete, katër planete, një ide",
      body: [
        "Stiven Catalyst ka tridhjetë e gjashtë mjete falas dhe një kurs për ata që e drejtojnë punën: shefat e turnit, area manager-ët, process manager-ët dhe këdo që po e çon përvojën e vet te roli i ardhshëm.",
        "Ky udhëzues shpjegon si janë organizuar mjetet, pse faqja duket ashtu siç duket dhe si përdoret çdo mjet, hap pas hapi. Nuk ke nevojë ta lexosh me radhë: gjej planetin tënd dhe nis nga aty.",
        { cards: [
          { title: "Falas", text: "Çdo mjet përdoret falas." },
          { title: "Pa llogari", text: "Hap mjetin dhe nis. Nuk ka asgjë për t'u regjistruar." },
          { title: "Në pajisjen tënde", text: "Puna jote ruhet në shfletuesin tënd, jo në një server. Pa cookies, pa matje të trafikut." },
        ] },
        { note: "Dy përjashtime, të thëna në vetë mjetet: kur shkruan faqen e internetit të një kompanie te Krijuesi i CV-së, ajo adresë shkon te shërbimi i ikonave i Google-it për të marrë logon; dhe [[Team sync]], nëse e ndez, i dërgon mjetet që zgjedh, të kriptuara në pajisjen tënde, te kopja e ekipit." },
      ],
    },
    start: {
      kicker: "Fillo këtu",
      title: "Cili është planeti yt?",
      body: [
        "Mjetet janë grupuar sipas punës që bën, jo sipas metodës. Nis me planetin që i përshtatet ditës sate.",
        { routes: [
          { family: "pulse", text: "Drejton punën në terren për një turn." },
          { family: "zenith", text: "Drejton një zonë dhe lexon shifrat e saj javë pas jave." },
          { family: "lumen", text: "Kujdesesh për të gjithë sistemin dhe për mënyrën si ndryshon." },
          { family: "atlas", text: "Po e çon përvojën tënde te roli i ardhshëm." },
        ] },
        "Nuk je i sigurt? Nis nga problemi që ke përpara: përmbajtja i rendit të gjitha mjetet me emër.",
      ],
    },
    system: {
      kicker: "Ideja, 1",
      title: "Pse një sistem diellor",
      body: [
        { diagram: "system" },
        "Në faqen kryesore mjetet janë një sistem i vogël diellor. Në qendër është drita, llamba e Catalyst. Në identitetin e markës ajo simbolizon qartësinë: çastin kur një problem i ndërlikuar bëhet i kuptueshëm.",
        "Planetet janë role. Çdo orbitë zgjerohet ashtu si zgjerohet pamja e rolit: Pulse, shefi i turnit, sheh një turn; Zenith, area manager-i, një zonë javë pas jave; Lumen, process manager-i, të gjithë sistemin; Atlas është karriera që e mbart çdo rol.",
        "Hënat janë mjetet, një për çdo mjet ose kurs. Prek një planet dhe hapen mjetet e tij; prek një hënë dhe je brenda mjetit. Si në një sistem diellor të vërtetë, planetet më afër dritës lëvizin më shpejt.",
      ],
    },
    families: {
      kicker: "Ideja, 2",
      title: "Katër familje, katër ngjyra",
      body: [
        "Çdo rol është një familje me ngjyrën e vet: Pulse vjollcë, Zenith blu, Lumen ari, Atlas argjend. Asnjëra nuk është e kuqe apo e gjelbër, që një familje të mos ngatërrohet kurrë me një gabim apo me një sukses: në këtë faqe, e kuqja dhe e gjelbra tregojnë vetëm rezultatin brenda një mjeti.",
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
        "Ideja e mjeteve është e thjeshtë: mjete të lindura nga puna në terren, që nuk kërkojnë asgjë tjetër veç një shfletuesi. Pa instalim, pa llogari, pa server që mban të dhënat e tua.",
        "Më shumë se kalkulatorë të veçantë i bën fakti që ia kalojnë punën njëri-tjetrit, brenda shfletuesit tënd:",
        { list: [
          "Regjistrat e dëmeve, të plotësisë dhe të vonesave ushqejnë Shift Pulse dhe Tabelën e ditës, dhe Dorëzimi i turnit i merr shifrat e tyre me [[Fill in from the logs]].",
          "Çdo rezultat i një regjistri vazhdon me një buton: [[Take it to 5 Whys]], [[Open in Pareto 80/20]], [[Open as control chart]] ose [[Add to actions]].",
          "5 Whys e dërgon kundërmasën e vet te Lista e veprimeve ose e vendos në Dorëzimin e turnit.",
          "CX Control Tower dhe Kurrizi i peshkut ia dërgojnë shkaqet e tyre Pareto 80/20; Raporti A3 merr rezultatin e Pareto-s dhe fletën e 5 Whys.",
          "Letra e motivimit i merr të dhënat e tua nga Krijuesi i CV-së ose nga CV për ATS.",
          "Raporti i operacioneve i lexon të gjitha dhe shkruan raportin e javës ose të muajit.",
        ] },
        "Dhe në faqen e çdo roli, një hapësirë coaching-u i kthen mjetet në praktikë: një projekt me qëllim, matje dhe datë rishikimi. Më shumë në faqet e fundit.",
      ],
    },
    machine: {
      kicker: "Ideja, 4",
      title: "Një listë, një vend pune",
      body: [
        "Gjashtëmbëdhjetë nga mjetet u ndërtuan si një sistem i vetëm për punën e përditshme në terren, nga takimi i turnit deri te standardi. Tri gjëra i mbajnë bashkë, të gjitha në shfletuesin tënd:",
        { list: [
          "Një listë e vetme veprimesh. Një kundërmasë nga 5 Whys, një gjetje e Auditit 5S, një sinjal i Laboratorit të procesit: secila bëhet veprim te Lista e veprimeve, me përgjegjës, afat, status dhe mënyrën si verifikohet. Një mjet e dorëzon një herë, kurrë dy herë.",
          "Një profil i vetëm i vendit të punës. Objekti, turnet, zonat me përgjegjësit e tyre, ekipet dhe objektivat shkruhen një herë, te Tabela e ditës, në Auditin 5S, në Gemba Walk ose te Matrica e aftësive, dhe çdo mjet që ka nevojë për to t'i ofron. Pa profil, çdo mjet punon me atë që shkruan në të.",
          "Një lloj i vetëm grafiku. Kalo treguesin mbi një grafik ose preke për të lexuar vlerat, prek një shkak për të filtruar sipas tij, shëno një ndryshim në vijën e kohës që ta shohësh në çdo trend, dhe shkarko çdo grafik si SVG ose PNG me ngjyrat e printimit.",
        ] },
        "Një ditë me to: regjistrat dhe Kryqi i sigurisë gjatë turnit, Tabela e ditës në takimin e turnit, një Gemba Walk ose një Audit 5S në terren, dhe një herë në javë dhjetë minuta me Listën e veprimeve: në fillim ato me afat të kaluar, pastaj ato të kësaj jave, pastaj ato që u verifikuan.",
        { note: "Lista e veprimeve dhe profili i vendit të punës janë të njëjta në çdo gjuhë të faqes; gjithçka tjetër ruhet veçmas për çdo gjuhë." },
      ],
    },
    data: {
      kicker: "Para se të nisësh",
      title: "Puna jote mbetet te ti",
      body: [
        "Çdo mjet e ruan punën tënde vetëm në shfletuesin që përdor. Nuk dërgohet askund, përveç kur ndez sinkronizimin e ekipit; prandaj, nëse ke punuar në laptop, nuk do ta gjesh në telefon.",
        "Për t'i ruajtur të gjitha, ose për t'i kaluar në një pajisje tjetër, përdor [[Save all my work]] në fund të çdo faqeje mjeti: një skedar me punën e të gjitha mjeteve. [[Open a saved file]] e kthen përsëri dhe zëvendëson vetëm mjetet që janë në atë skedar.",
        { list: [
          "Shumica e mjeteve printohen ose ruhen si PDF, dhe regjistrat shkarkohen si CSV dhe si Excel.",
          "Çdo mjet e ruan punën veçmas për çdo gjuhë të faqes, përveç listës së veprimeve dhe profilit të vendit të punës.",
          "Një mjet që e ke hapur një herë hapet përsëri edhe pa lidhje, dhe faqja mund të instalohet si aplikacion.",
          "Shfletuesi mban një pikë rikthimi të gjithë punës një herë në ditë dhe para se një skedar të zëvendësojë diçka; [[Restore points]] në të njëjtën kuti e kthen një të tillë.",
          "[[Team sync]] i ndan mjetet që shënon me pajisjet e ekipit. Një kod me gjashtë fjalë krijon çelësin dhe puna kriptohet në pajisje, kështu që serveri nuk mund ta lexojë. Shënoje kodin diku: tregohet vetëm një herë.",
          "Fshirja e të dhënave të shfletuesit fshin edhe punën tënde. Ruaj një skedar më parë.",
        ] },
      ],
    },
    coaching: {
      kicker: "Nga mjeti te praktika",
      title: "Hapësira e coaching-ut",
      body: [
        "Faqja e çdo roli hap një hapësirë coaching-u mbi mjetet. Ajo e kthen një rezultat të mirë në një zakon që mund ta tregosh.",
        { steps: [
          "Zgjidh kontekstin: logjistikë ose magazinë, hotel ose shërbim; i ri në rol ose me përvojë. Emri nuk është i detyrueshëm.",
          "Krijo një projekt me qëllim, matje dhe datë rishikimi.",
          "Ndiq rrugën e të mësuarit të rolit tënd: module me metodë, rast, vendim me koment, detyrë dhe reflektim.",
          "Ruaj dëshmi nga puna reale. Një rishikim me datë në vendin e punës vlen; vetëm një kuiz nuk vlen.",
          "Reflekto me GROW. Çdo reflektim mbyllet me një veprim me përgjegjës dhe afat.",
          "Printo një raport për një mentor të vërtetë, ose eksporto një kopje rezervë të gjithë hapësirës.",
        ] },
        "Një mjet i hapur nga projekti yt të lejon ta ruash rezultatin dhe një veprim në atë projekt. Në një vizitë të zakonshme, asgjë nga kjo nuk ngarkohet.",
        { note: "Edhe këtu nuk ka server dhe llogari. Hapësira e coaching-ut është vetëm e jotja: sinkronizimi i ekipit nuk e ndan kurrë." },
      ],
    },
    next: {
      kicker: "Botimi 4",
      title: "Çfarë mund të vijë më pas",
      body: [
        "Ide në shqyrtim, jo premtime me data. Më thuaj cila do të të ndihmonte më shumë.",
        { list: [
          "Shift Pulse dhe Tabela e ditës që lexojnë Inspektimin e dhomës dhe Planifikuesin e mirëmbajtjes.",
          "Analiza e vonesave për linja pa orë nisjeje të regjistruar.",
          "Sinkronizimi i ekipit me një kod për çdo person, që një anëtar të largohet pa një kod të ri për të gjithë.",
        ] },
        "Kur ndryshon një mjet, ky udhëzues merr një botim të ri. Botimi më i fundit është gjithmonë në faqe, dhe të mëparshmit mbeten aty siç u printuan.",
      ],
    },
    back: {
      motto: "Shiko qartë. Mendo ndryshe. Vepro me qëllim.",
      text: "Të gjitha mjetet, falas, në shqip, anglisht dhe gjermanisht:",
    },
  },
  families: {
    pulse: "Njëmbëdhjetë mjete për një turn: regjistro atë që shkon keq aty ku ndodh, mbaje terrenin të sigurt dhe në rregull, drejto takimin e turnit, shih turnin në një pamje, ruaj sendet që harrojnë mysafirët dhe dorëzoje të pastër, me çdo veprim në një listë.",
    zenith: "Dymbëdhjetë mjete për një zonë: lexo javën, gjej nga vjen realisht një shifër e kuqe, nis me shkaqet që peshojnë më shumë, vëre një problem në një fletë, rrit idetë dhe aftësitë e ekipit, inspekto dhomat, planifiko mirëmbajtjen dhe raporto javën.",
    lumen: "Dhjetë mjete dhe një kurs për të gjithë sistemin: dallo një ndryshim të vërtetë nga zhurma, arri te një shkak që mund ta ndryshosh, vlerëso rreziqet, mat, harto dhe ec rrjedhën, shkruaj standardin dhe drejto përmirësimet si një portofol projektesh.",
    atlas: "Tri mjete për rolin e ardhshëm: një CV e dizajnuar, një CV që softueri i përzgjedhjes e lexon saktë dhe një letër që përputhet me to.",
  },
  tools: {
    "/tools/shift-pulse/": {
      when: "Në fund të një turni ose të një jave, kur do pamjen e plotë para se të shkruash dorëzimin.",
      how: [
        "Zgjidh periudhën: 7, 14 ose 30 ditë, ose 8 ose 12 javë.",
        "Zgjidh turnin.",
        "Lexo kartat dhe sinjalet.",
        "Hap grafikun e trendit të çdo shifre.",
      ],
      get: "Një pamje e asaj që mbajnë në këtë shfletues regjistrat e dëmeve, të plotësisë, të vonesave dhe të dorëzimit, si dhe Kryqi i sigurisë, OEE, veprimet e hapura dhe auditi i fundit 5S sapo kanë të dhëna: karta dhe një trend për çdo shifër, me sinjalin [[Above usual]] vetëm përtej kufirit të kartës së kontrollit për nivelin e saj të zakonshëm, për ta kopjuar, printuar ose ruajtur si PDF.",
      data: "Ruan vetëm cilësimet e tua. I lexon mjetet e tjera dhe nuk ndryshon asgjë në to.",
    },
    "/tools/damage-control/": {
      when: "Sa herë dëmtohet një njësi, në hapin e procesit ku ndodh.",
      how: [
        "Regjistro çdo njësi të dëmtuar: datën, hapin, shkakun dhe njësitë, me koston dhe një shënim nëse i ke. Rreshtat nga Excel-i ngjiten me [[Import rows]].",
        "Vendos periudhën: njësitë e trajtuara dhe objektivin tënd.",
        "Rishiko regjistrin. Për ta provuar mjetin, ngarko një javë shembull.",
        "Bëj [[Floor check]].",
      ],
      get: "Shkalla e dëmeve, DPMO dhe niveli sigma, ato pak shkaqe që sjellin shumicën e dëmeve, hapat ku ndodhin, një trend dhe ku të fillosh. Shkarkoje si CSV ose Excel, ose vazhdo me 5 Whys, Pareto 80/20, një kartë kontrolli ose Listën e veprimeve.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/incomplete-control/": {
      when: "Sa herë një porosi del pa të gjithë artikujt ose pakot.",
      how: [
        "Regjistro çdo porosi të paplotë sipas datës, hapit dhe shkakut, ose importo rreshta.",
        "Vendos periudhën: porositë e trajtuara dhe objektivin tënd.",
        "Rishiko regjistrin.",
        "Bëj [[Floor check]].",
      ],
      get: "Shkalla e porosive të paplota dhe porositë e plota, DPMO dhe niveli sigma, shkaqet që sjellin shumicën e gabimeve dhe hapat ku nisin, me të njëjtat eksporte dhe hapa të mëtejshëm si Kontrolli i dëmeve.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/delay-analyzer/": {
      when: "Kur linjat mbërrijnë me vonesë dhe duhet të dish nëse vonesa nisi në rampë apo në rrugë.",
      how: [
        "Regjistro një linjë: datën, turnin, linjën, nisjen e planifikuar dhe reale, mbërritjen e planifikuar dhe reale, dhe arsyen nëse u vonua. Rreshtat mund të importohen.",
        "Vendos minutat e tolerancës për nisjen dhe mbërritjen, dhe objektivin e përpikërisë.",
        "Rishiko regjistrin.",
        "Bëj [[Floor check]].",
      ],
      get: "Shkalla e përpikërisë, çdo minutë vonese e ndarë mes rampës dhe rrugës, arsyet, orët e nisjes dhe turnet ku përqendrohen vonesat, dhe një trend, me të njëjtat eksporte dhe hapa të mëtejshëm si Kontrolli i dëmeve.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/night-audit/": {
      when: "Çdo natë, për çdo no-show, kartë të refuzuar, gabim postimi ose bilanc të hapur që gjen auditi.",
      how: [
        "Regjistro çdo përjashtim: datën, turnin, fazën e qëndrimit ku u gjet, llojin, shkakun dhe rezervimet e prekura, me koston dhe një shënim nëse i ke. Rreshtat nga PMS-ja ose Excel-i ngjiten me [[Import rows]].",
        "Vendos periudhën: rezervimet e trajtuara dhe objektivin tënd.",
        "Rishiko regjistrin. Për ta provuar mjetin, ngarko një javë shembull.",
        "Bëj [[Floor check]] për standardin e auditit.",
      ],
      get: "Shkalla e përjashtimeve dhe rezervimet e pastra, DPMO dhe niveli sigma, ato pak shkaqe që sjellin shumicën e përjashtimeve dhe faza e qëndrimit ku nisin, me të njëjtat eksporte dhe hapa të mëtejshëm si Kontrolli i dëmeve. Dorëzimi i hotelit i merr rastet no-show nga këtu.",
      data: "Regjistri mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/shift-handover/": {
      when: "Në fund të çdo turni. Shumica e problemeve nuk humbasin gjatë turnit, humbasin mes turneve.",
      how: [
        "Zgjidh një model: magazinë, recepsion hoteli ose stacion shpërndarjeje. Plotëso datën, turnin, zonën dhe të dy emrat.",
        "Shto shifrat. [[Fill in from the logs]] i merr nga regjistrat e dëmeve, të plotësisë dhe të vonesave; modeli i hotelit i merr rastet no-show nga Regjistri i Night Audit.",
        "Rendit çështjet e hapura, secilën me përgjegjës dhe orë. Shto paralajmërimet, sigurinë dhe njerëzit.",
        "Bëj kontrollin e dorëzimit.",
      ],
      get: "Një pamje [[Ready to hand over]] për ta kopjuar, printuar ose ruajtur si PDF dhe për ta dërguar në kanalin tënd. [[Close shift, start the next]] i kalon çështjet e hapura më tej dhe numëron sa herë janë kaluar; një çështje e hapur vazhdon te 5 Whys ose te Lista e veprimeve. Dorëzimet e mëparshme mbeten në një histori.",
      data: "Dorëzimi mbetet në këtë shfletues. Asgjë nuk dërgohet.",
    },
    "/tools/action-tracker/": {
      when: "Sa herë që një mjet të jep diçka për të bërë, dhe një herë në javë për ta mbyllur ciklin: një listë e vetme për çdo kundërmasë, gjetje dhe sinjal.",
      how: [
        "Shkruaje veprimin me një folje, me përgjegjës, afat dhe si do ta kuptosh që funksionoi. Ose dërgoje nga një mjet tjetër: mbërrin bashkë me burimin e vet.",
        "Kaloje nga i hapur te në punë, i kryer dhe i verifikuar. I kryer do të thotë që ndryshimi u bë; i verifikuar, që shifra lëvizi dhe mbeti aty.",
        "Filtro sipas statusit, përgjegjësit ose mjetit nga erdhi.",
        "Bëj rishikimin javor: në fillim ato me afat të kaluar, pastaj ato me afat këtë javë, pastaj ato që u verifikuan. [[Copy the review]] për takimin.",
      ],
      get: "Java në veprime: çfarë e ka kaluar afatin dhe kush e mban, veprimet e mbyllura çdo javë, afatet në një kalendar mujor dhe rishikimi për ta kopjuar ose printuar. Lista shkarkohet si CSV, si Excel ose si [[Calendar file (.ics)]] me çdo afat të hapur.",
      data: "Lista mbetet në këtë shfletues, e njëjtë në çdo gjuhë. Një veprim i dërguar nga një mjet shtohet një herë, kurrë dy herë.",
    },
    "/tools/daily-board/": {
      when: "Në fillim të çdo turni, për një takim dhjetëminutësh në këmbë.",
      how: [
        "Plotëso një herë [[Workplace profile]]: objektin, turnet, zonat me përgjegjësit e tyre dhe objektivat që i japin ngjyrë tabelës.",
        "Lëri regjistrat në këtë shfletues t'u japin ngjyrë Sigurisë, Cilësisë dhe Dorëzimit: Kryqi i sigurisë, Auditi 5S, Kontrolli i dëmeve, Kontrolli i plotësisë, Regjistri i Night Audit dhe Analiza e vonesave.",
        "Shëno me dorë Koston dhe Njerëzit me [[Add to the board]]. Një shënim me dorë ka përparësi mbi regjistrat për atë ditë.",
        "Lexo me zë [[Huddle agenda]]: tabelën e djeshme, veprimet me afat të kaluar ose me afat sot, çështjet e mbartura të dorëzimit dhe mesazhin e sigurisë të ditës.",
      ],
      get: "Siguria, Cilësia, Dorëzimi, Kostoja dhe Njerëzit si pesë kalendarë mujorë me ditë të gjelbra, të verdha dhe të kuqe, ditët e kuqe për çdo shkronjë kundrejt muajit të kaluar, dhe rendi i ditës për ta kopjuar ose printuar. Një ditë e kuqe vazhdon me [[Add to actions]] ose [[Take it to 5 Whys]].",
      data: "Shënimet me dorë mbeten në këtë shfletues dhe shkarkohen si CSV ose Excel. Tabela i lexon regjistrat e tjerë dhe nuk ndryshon asgjë në to.",
    },
    "/tools/five-s-audit/": {
      when: "Në një ditë të caktuar të javës, në të njëjtat zona dhe me të njëjtën radhë, për të parë nëse rregulli në terren mbahet.",
      how: [
        "Zgjidh 5S, 6S ose 8S, një listë kontrolli për magazinë, hotel ose stacion shpërndarjeje, zonën dhe datën.",
        "Ec nëpër zonë dhe vlerëso çdo pyetje ashtu siç e sheh tani, nga 0, asgjë në vend, deri në 4, standardi i plotë. Shëno atë që sheh kudo ku vlerësimi është 2 ose më pak, me një foto.",
        "[[Save audit]], pastaj [[Add findings to actions]] që çdo gjetje të ketë një përgjegjës te Lista e veprimeve.",
        "Shëno te [[Red tag register]] çdo send që mund të mos i përkasë zonës, me arsye, vendim dhe përgjegjës.",
      ],
      get: "Një radar i çdo S-je kundrejt auditit të fundit të zonës, trendi dhe renditja e zonave, pyetjet më të dobëta, etiketat e kuqe të hapura sipas vjetërsisë dhe fotot para e pas, krah për krah. [[Audit plan]] i ndan zonat mes audituesve me radhë dhe shkarkohet si skedar kalendari. [[Print scorecard]], ose shkarko si CSV ose Excel.",
      data: "Auditet, etiketat e kuqe dhe fotot mbeten në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/safety-cross/": {
      when: "Ditën që ndodh: çdo aksident, ndihmë e parë, rrezik i shmangur, kusht ose veprim i pasigurt, por edhe vëzhgimet pozitive.",
      how: [
        "Regjistro çdo ngjarje: datën, turnin, llojin, zonën, çfarë ndodhi, shkakun dhe rëndësinë sipas asaj që mund të ndodhte, jo sipas pasojës, me një veprim dhe një përgjegjës. Rreshtat mund të importohen.",
        "Shkruaj orët e punuara në muaj për LTIFR dhe TRIR dhe, nëse do, një objektiv për raportimet e rreziqeve të shmangura dhe një synim për ditët pa aksident.",
        "Lexo kryqin e muajit, pastaj shkakun me të cilin duhet nisur.",
        "Mbaj temën e ditës në takim, pastaj shtyp [[Mark as held]].",
      ],
      get: "Muaji si një kryq i gjelbër me një ditë të kuqe ose të verdhë për çdo ngjarje, ditët që nga aksidenti i fundit, LTIFR, TRIR, piramida e Bird-it dhe zonat ku ndodhin ngjarjet. [[Send open actions to the Action Tracker]], ose çoje shkakun kryesor te 5 Whys ose Pareto 80/20.",
      data: "Regjistri mbetet në këtë shfletues dhe shkarkohet si CSV ose Excel. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/lost-found/": {
      when: "Sapo një send i gjetur arrin në recepsion, dhe një herë në ditë për sendet që presin një vendim.",
      how: [
        "Regjistro sendin: datën, orën, ku u gjet, kategorinë, klasën e vlerës, kush e gjeti, ku ruhet dhe një numër etikete mbi send, të skanuar ose të shkruar. Një foto mbetet në këtë pajisje.",
        "Sendet me vlerë të lartë, telefonat, dokumentet, portofolat dhe bizhuteritë, futen në kasafortë brenda orës. Shkruaj emrin e mysafirit vetëm kur sendi qartë i përket atij.",
        "Shëno çdo hap: mysafiri u kontaktua, sendi u kthye në dorë ose me postë me numrin e gjurmimit, iu dorëzua policisë, iu dha bamirësisë ose u asgjësua. [[Copy the reply]] jep një tekst të sjellshëm për mysafirin në gjuhën e faqes.",
        "Te [[Settings]], cakto sa kohë ruhet çdo klasë vlere; lista e sendeve që presin vendim tregon çfarë e ka kaluar afatin.",
      ],
      get: "Sendet e hapura sipas vjetërsisë, ato që presin vendim, ku harrohen më shumë sende dhe sa kthehen te i zoti, [[Print tag label]] për sendin, dhe regjistri si CSV ose Excel. [[Remove guest names of closed items]] fshin të dhënat personale të rasteve të mbyllura.",
      data: "Regjistri dhe fotot mbeten në këtë shfletues. Asgjë nuk dërgohet. Afatet e ruajtjes janë vlera fillestare: vendosin rregullat e hotelit dhe ligji vendor.",
    },
    "/tools/cx-control-tower/": {
      when: "Çdo javë, për të shkuar nga rezultati që merr klienti te shkaktari operacional, te shkaku rrënjësor dhe te një veprim i verifikuar.",
      how: [
        "Ngarko skedarët: dorëzimet, linjat, incidentet dhe veprimet, si CSV ose Excel, ose një libër pune të vetëm. Ose shtyp [[Load the example]].",
        "Vendos vetëm objektivat që ke miratuar.",
        "Filtro sipas datave, partnerit, turnit dhe zonës.",
        "Lexo skedat, nga pamja e përgjithshme deri te [[Weekly review]].",
        "Te [[Deep dive]], zgjidh një dështim, shih ku përqendrohet dhe cilat incidente e regjistrojnë, shkruaj hetimin dhe shtyp [[Create the linked action]].",
      ],
      get: "Perfect Delivery për çdo porosi, karta rezultatesh, rreziku i linjave, një Pareto e shkaqeve rrënjësore, një analizë e thelluar për çdo dështim me regjistrin e rasteve, dhe një regjistër për ndjekjen e veprimeve. Kopjo rishikimin, printoje ose eksporto tabelat si CSV.",
      data: "Skedarët lexohen në shfletues. Asgjë nuk ngarkohet.",
    },
    "/tools/kpi-diagnostic/": {
      when: "Një shifër u bë e kuqe. Para se të shtosh presionin, gjej ku është shkaku.",
      how: [
        "Shkruaj KPI-në, nëse do.",
        "Vlerëso dhjetë pohime.",
        "Shtyp [[See the result]].",
      ],
      get: "Shkaku që përputhet më mirë (qartësia, aftësia, kapaciteti, procesi apo përgjegjësia), me tre hapa të parë dhe një [[Question for the floor]]; kur asnjë shkak i vetëm nuk del në pah, këshilla për të shkuar e për të parë punën. Në çdo rast, një pikë për çdo shkak, për ta çuar më tej te 5 Whys ose te Lista e veprimeve.",
      data: "Asgjë që shkruan nuk ruhet e nuk dërgohet.",
    },
    "/tools/pareto/": {
      when: "Kur disa shkaqe sjellin pjesën më të madhe të problemeve dhe duhet të dish cilin ta rregullosh të parin.",
      how: [
        "Zgjidh një model: shpërndarje, magazinë ose hotel. Ose shtyp [[Load the example]].",
        "Sill të dhënat: një skedar CSV ose Excel, ose qeliza të ngjitura nga një tabelë.",
        "Kontrollo kolonat: shkaku, numri, vlera, data.",
        "Rendit shkaqet sipas shpeshtësisë ose kostos. Nëse do, krahaso para dhe pas.",
      ],
      get: "Një grafik Pareto i kontrolluar, ku asnjë rresht nuk mbetet jashtë llogarisë, [[Where to start]], dhe eksporte si PNG, SVG dhe CSV.",
      data: "Skedarët lexohen në shfletues, edhe Excel-i. Ruhen deri në 20.000 rreshta.",
    },
    "/tools/a3-report/": {
      when: "Kur një problem meriton një fletë: faktet, objektivi, shkaku dhe ndjekja, të rëna dakord para se të nisë kushdo.",
      how: [
        "Nis një [[New A3]] me titull, përgjegjës dhe datë.",
        "Plotëso me radhë shtatë kutitë: kontekstin, gjendjen aktuale me shifrën e saj kyçe, objektivin dhe afatin, shkakun rrënjësor, kundërmasat me një përgjegjës secila, zbatimin dhe si do ta verifikosh.",
        "Sill atë që ke tashmë: [[Read the Pareto result]] për gjendjen aktuale, [[Take from 5 Whys]] për shkakun rrënjësor.",
        "Lexo [[Quality check]], pastaj [[Send countermeasures to the Action Tracker]].",
      ],
      get: "Një fletë me diferencën mes bazës, objektivit dhe vlerës së fundit, dhe një kontroll me tetë pika të vetë fletës. Printoje në A3 ose A4, kopjoje si tekst ose [[Download Word]].",
      data: "Çdo A3 ruhet në këtë shfletues ndërsa shkruan, në një listë ku mund ta hapësh, ta kopjosh ose ta fshish.",
    },
    "/tools/kaizen-board/": {
      when: "Çdo javë, për të mbledhur idetë e ekipit dhe për t'i dhënë secilës një përgjigje brenda javës.",
      how: [
        "Shkruaj idenë, çfarë heq, zonën dhe kush e propozoi, vlerëso përpjekjen dhe ndikimin nga 1 në 5, shto kursimin nëse e di, dhe shtyp [[Add to the board]].",
        "Kaloje çdo kartë nëpër Plan, Zbatim dhe Kontroll deri te E miratuar, ose lëre mënjanë me një arsye që personi mund ta lexojë.",
        "Nis me fitoret e shpejta: përpjekje e vogël dhe ndikim i madh, lart majtas në matricë.",
        "Një ide e madhe vazhdon me [[Take to A3]]; hapi i ardhshëm i një karte shkon te Lista e veprimeve me [[Add to actions]].",
      ],
      get: "Tabela me ditët që ka pritur çdo kartë, idetë e hapura të renditura sipas përparësisë, shkalla e miratimit, ditët nga ideja te miratimi, kursimet në muaj dhe në vit, dhe ideja e muajit. Shkarkoje si CSV ose Excel.",
      data: "Tabela mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/skills-matrix/": {
      when: "Para se të planifikosh turnet ose trajnimin, për të parë cilat detyra varen nga një person i vetëm.",
      how: [
        "Emërto ekipin dhe shtyp [[Load the tasks]] për një model, magazinë, recepsion hoteli ose stacion shpërndarjeje, secila detyrë me rëndësinë, nivelin minimal dhe objektivin e saj.",
        "Shto njerëzit, me turnin e tyre.",
        "Vlerëso çdo person për çdo detyrë, bashkë me të, nga 0, pa trajnim, deri në 4, mund të trajnojë. Një klik e ngre nivelin me një.",
        "[[Suggest a plan]]: çdo i trajnuar çiftohet me një person të nivelit 4 në të njëjtën detyrë, me boshllëqet më kritike në fillim. Pastaj [[Send plan to the Action Tracker]].",
      ],
      get: "Mbulimi kundrejt objektivit për çdo detyrë dhe turn, pikat e vetme të dështimit, kush është nën minimum dhe indeksi i fleksibilitetit, dhe me [[Take a snapshot]] çdo muaj, nëse trajnimi po funksionon. Matrica dhe plani shkarkohen si CSV ose Excel.",
      data: "Matrica mbetet në këtë shfletues. [[Anonymise names]] e tregon çdo person me një numër, në faqe dhe në eksporte.",
    },
    "/tools/oee/": {
      when: "Çdo turn, për makinën ose linjën që cakton ritmin.",
      how: [
        "Shto çdo makinë me ritmin ideal nga tabela e makinës, ose me ciklin ideal, dhe shtyp [[Save machine]].",
        "Regjistro një turn: minutat e planifikuara, ndalesat me arsyet dhe minutat e tyre, copat e prodhuara dhe skartet. Rreshtat mund të importohen.",
        "Ndalesat e planifikuara, si pushimet, takimet ose mungesa e porosive, hiqen nga koha e planifikuar.",
        "Zgjidh një makinë ose të gjitha, dhe periudhën.",
      ],
      get: "Disponueshmëria, performanca, cilësia dhe OEE për çdo makinë, gjashtë humbjet e mëdha ditë pas dite, arsyet kryesore të ndalesave dhe humbja me të cilën duhet nisur, me një [[Question for the floor]]. Kopjoje ose printoje, ose çoje te 5 Whys, Pareto 80/20 ose te Lista e veprimeve.",
      data: "Makinat dhe regjistri mbeten në këtë shfletues dhe shkarkohen si CSV ose Excel.",
    },
    "/tools/hotel-kpis/": {
      when: "Çdo mëngjes, me shifrat e natës së kaluar nga night audit ose nga PMS-ja.",
      how: [
        "Shkruaj numrin e dhomave dhe buxhetin e muajit: zënien dhe ADR-në, dhe RevPAR-in nëse nuk është thjesht prodhimi i të dyjave.",
        "Regjistro çdo natë: dhomat në dispozicion dhe të shitura, të ardhurat nga dhomat, mbërritjet, largimet, rastet no-show, walk-in, dhomat jashtë përdorimit, mëngjeset dhe ankesat. Ose ngjit eksportin e PMS-së me [[Import rows]].",
        "Lexo muajin deri sot kundrejt buxhetit, dhe ku të fillosh.",
        "[[Copy the morning report]] për takimin.",
      ],
      get: "Zënia, ADR dhe RevPAR kundrejt buxhetit, parashikimi për muajin, modeli sipas ditëve të javës, nata më e mirë dhe më e dobët, dhe të ardhurat e humbura nga rastet no-show dhe dhomat jashtë përdorimit. KPI-ja më e dobët vazhdon te 5 Whys ose te Lista e veprimeve.",
      data: "Regjistri mbetet në këtë shfletues dhe shkarkohet si CSV ose Excel. Një natë e regjistruar dy herë mban shifrat e fundit.",
    },
    "/tools/gemba-walk/": {
      when: "Aty ku bëhet puna: drejtuesi i ekipit çdo ditë, menaxheri i zonës çdo javë, drejtuesi i objektit çdo muaj.",
      how: [
        "Zgjidh një audit të procesit me nivele ose një ecje për humbjet, nivelin, një listë kontrolli për magazinë, hotel ose stacion shpërndarjeje, dhe zonën.",
        "Në terren, përgjigju çdo pyetjeje me po, jo ose s'zbatohet, ose prek + për çdo humbje që sheh. [[Start the timer]] për të ditur sa zgjati ecja.",
        "[[Save walk]], pastaj [[Add findings to actions]] për çdo jo që nuk e rregullove në vend.",
        "Cakto sa shpesh ecën çdo nivel: rezultatet shënojnë nivelin që ka mbetur pas.",
      ],
      get: "Përputhshmëria për javë dhe nivel, pyetjet që dështojnë më shpesh dhe zonat ku janë përgjigjet jo, humbjet sipas zonës me ato pak thelbësoret, dhe ecja e ardhshme e çdo niveli. [[Print the walk sheet]] për të ecur me letër në dorë.",
      data: "Ecjet mbeten në këtë shfletues dhe shkarkohen si CSV ose Excel.",
    },
    "/tools/ops-report/": {
      when: "Në fund të javës ose të muajit, para takimit me menaxherin tënd.",
      how: [
        "Zgjidh periudhën: këtë javë ose javën e kaluar, këtë muaj ose muajin e kaluar, ose dy data.",
        "Shiko çfarë lexon raporti: çdo pjesë shfaqet vetëm kur mjeti i saj ka të dhëna për periudhën, nga Kontrolli i dëmeve, Analiza e vonesave, OEE dhe Auditi 5S te Kryqi i sigurisë, KPI-të e hotelit, Tabela Kaizen dhe Lista e veprimeve.",
        "Shkruaj një herë emrin e objektit dhe objektivat, te profili i vendit të punës; një objektiv i shkruar në një regjistër ka përparësi.",
        "Lexo përmbledhjen: rreziku më i madh, vendimi që kërkon dhe tri përparësitë e javës që vjen, që shkojnë te Lista e veprimeve me një prekje.",
      ],
      get: "Siguria, cilësia, dorëzimi, pajisjet, vendi i punës, hoteli, përmirësimi dhe veprimet, secila kundrejt periudhës së mëparshme dhe objektivit të saj, si shifër, grafik dhe fjali. [[Copy as text]] për një email, [[Print or save as PDF]] në A4, ose [[Download Word]].",
      data: "Raporti nuk ka të dhëna të vetat: lexon mjetet e tjera në këtë shfletues dhe nuk ndryshon asgjë në to.",
    },
    "/tools/room-inspection/": {
      when: "Pasi dhoma pastrohet dhe para se recepsioni ta shesë, dhe një herë në javë për të parë ku duhet coaching.",
      how: [
        "Përgatit dhomat një herë: [[Generate rooms]] nga katet dhe numrat e dhomave, ose ngjit një listë, me llojet e dhomave dhe ekipin.",
        "Skano kodin në derë ose shkruaj dhomën, zgjidh listën e kontrollit, standarde, suitë, ambient i përbashkët ose e jotja, dhe shëno çdo pikë në rregull, defekt ose s'aplikohet, zonë pas zone. Një pikë kritike me defekt e rrëzon dhomën më vete.",
        "Shëno defektet, pastaj [[Mark the rest as pass]]. Shto një foto të defektit dhe thuaj nëse do ripastrim apo mirëmbajtje.",
        "[[Save inspection]]: pikat e mirëmbajtjes shkojnë te Lista e veprimeve, ripastrimet kthehen te personi që e pastroi dhomën.",
      ],
      get: "Sa dhoma kalojnë herën e parë sipas personit të pastrimit, katit dhe llojit të dhomës, trendi i javës, defektet që rrëzojnë më shpesh dhe një hartë nxehtësie e zonave sipas katit, për coaching, jo për faj. [[Print inspection sheet]] ose [[Print daily summary]], dhe shkarko inspektimet si CSV ose Excel.",
      data: "Inspektimet dhe fotot mbeten në këtë shfletues. Një listë kontrolli e jotja ruhet si skedar modeli për hotelet e tjera të grupit.",
    },
    "/tools/maintenance-planner/": {
      when: "Një herë në javë për të planifikuar punën, dhe ditën kur një detyrë kryhet ose shtyhet, ose kur prishet një makinë.",
      how: [
        "[[Add an asset]] me etiketën, zonën, llojin dhe kritikalitetin A, B ose C, dhe merr detyrat tipike të llojit të saj. Shëno kur u krye për herë të fundit çdo detyrë.",
        "Jepi çdo detyre intervalin në ditë, javë, muaj ose vite, ose në orë pune, cilido vjen i pari. Kontrollet ligjore kanë një shenjë: verifiko rregullat vendore.",
        "[[Log work]] ditën që ndodh: e kryer, e shtyrë me arsye, një defekt me kohën e ndalesës dhe shkakun, ose një lexim i matësit të orëve. Skano etiketën për të zgjedhur pajisjen.",
        "[[Print the work list]] e javës për ekipin, ose shkarko planin si [[Calendar file (.ics)]].",
      ],
      get: "Çfarë ka afat dhe çfarë është me vonesë, përputhshmëria e mirëmbajtjes parandaluese në 90 ditë, një kalendar mujor, përputhshmëria sipas zonës dhe llojit, një Pareto i kohës së ndalesës sipas pajisjes, MTBF dhe MTTR. Detyrat me vonesë te pajisjet A dhe defektet që përsëriten shkojnë te Lista e veprimeve, shkaqet te Pareto 80/20, një defekt i vetëm te 5 Whys.",
      data: "Plani, regjistri dhe fotot mbeten në këtë shfletues dhe shkarkohen si CSV ose Excel.",
    },
    "/tools/sigma-control-chart/": {
      when: "Kur duhet të dish sa i mirë është një proces, dhe nëse një ditë e keqe është ndryshim i vërtetë apo zhurmë e zakonshme.",
      how: [
        "Për nivelin sigma: njësitë, defektet dhe mundësitë për njësi.",
        "Për dorëzimin e përsosur: në kohë, pa dëme dhe i plotë, në përqindje.",
        "Për kartën e kontrollit: çfarë numëron, sipas ditës ose javës, dhe një bazë krahasimi.",
        "Shto ditët një nga një me [[Add a day]], ose importo rreshta.",
      ],
      get: "Niveli sigma, dorëzimi i përsosur dhe një kartë kontrolli që rendit [[Signals to investigate]]. Shkarkoje si CSV, kopjoje ose printoje.",
      data: "Gjithçka mbetet në këtë shfletues.",
    },
    "/tools/five-whys/": {
      when: "Kur një problem kthehet. Nis nga ajo që ndodhi, jo nga kush e bëri.",
      how: [
        "Shkruaj problemin.",
        "Pyet pse, pesë herë ose sa herë duhet.",
        "Emërto shkakun rrënjësor: diçka që mund ta ndryshosh.",
        "Cakto me të tjerët një kundërmasë, një përgjegjës, një afat dhe si do ta kuptosh që funksionoi.",
      ],
      get: "Një fletë pune për ta printuar, ruajtur si PDF ose kopjuar si tekst. Mjetet e regjistrave mund t'ia dërgojnë problemin drejtpërdrejt, dhe kundërmasa vazhdon me [[Put the countermeasure on the handover]] ose [[Add the countermeasure to the Action Tracker]].",
      data: "Fleta e punës mbetet në këtë shfletues.",
    },
    "/tools/fishbone/": {
      when: "Kur ekipi duhet të shohë çdo shkak të mundshëm të një efekti para se të zgjedhë cilin të kontrollojë.",
      how: [
        "Shkruaj efektin te koka e peshkut, si fakt, me shifrën nëse e ke.",
        "Zgjidh kockat: 6M për prodhim, magazinë dhe shpërndarje, 4P për një shërbim, ose pesë kockat e një hoteli.",
        "Plotëso çdo kockë me ekipin, deri në 12 shkaqe, secili me pse-në e vet.",
        "Numëro votat dhe shëno shkaqet e mundshme, pastaj [[Send likely causes to actions]] që secili të verifikohet në terren.",
      ],
      get: "Peshku në një pamje, shkaqet të renditura sipas votave, dhe shkaku kryesor gati për 5 Whys ose të gjithë për Pareto 80/20. [[Copy as outline]], printoje në një faqe ose shkarkoje si CSV ose Excel.",
      data: "Diagramet e tua mbeten në këtë shfletues, në një listë ku mund t'i hapësh, t'i kopjosh ose t'i fshish.",
    },
    "/tools/fmea/": {
      when: "Para se një proces të nisë ose të ndryshojë, ose pas një dështimi që nuk duhet të përsëritet: vlerëso rreziqet sa kushtojnë ende pak.",
      how: [
        "Shkruaj procesin, përgjegjësin, datën dhe rishikimin, dhe shtyp [[Fill the steps]] nga një model, ose [[+ Add a failure mode]].",
        "Për çdo hap, shkruaj si mund të dështojë, efektin, shkakun dhe kontrollet që ke sot.",
        "Vlerëso rëndësinë, shpeshtësinë dhe zbulimin nga 1 në 10. Lexo në fillim prioritetin e veprimit, pastaj RPN-në.",
        "Jepi çdo rreshti me prioritet të lartë ose mesatar një veprim me përgjegjës, dhe vlerësoje rreshtin përsëri kur veprimi të jetë kryer.",
      ],
      get: "Prioriteti i veprimit (AIAG-VDA) dhe RPN-ja e çdo rreshti, një hartë nxehtësie e rëndësisë kundrejt shpeshtësisë, dhjetë rreziqet kryesore, dhe RPN-ja para dhe pas veprimeve. [[Add open actions to the Action Tracker]], printoje në A3 ose A4, ose shkarkoje si CSV ose Excel.",
      data: "Fleta mbetet në këtë shfletues. [[Save the sheet (.json)]] ruan një kopje që mund ta hapësh përsëri në një pajisje tjetër.",
    },
    "/tools/process-lab/": {
      when: "Kur mat një proces, minuta, pesha ose defekte, dhe duhet të dish nëse është i qëndrueshëm, nëse është i aftë, apo nëse ndryshoi vërtet.",
      how: [
        "Ngjit matjet, një datë dhe një vlerë për rresht, ose grupe, dhe thuaj çfarë matet. Mjeti zgjedh kartën: I-MR, Xbar-R, Xbar-S, p, np, c ose u.",
        "Shto kufijtë e specifikimit dhe një objektiv, dhe datën kur nisi një ndryshim, që kufijtë të ndahen para dhe pas tij.",
        "Te [[Before / after]], krahaso dy shkallë ose dy grupe matjesh; te [[How many to measure]], gjej sa matje të duhen.",
        "Për shkaqet dhe instrumentin matës: [[Chi-square]] i një tabele me numërime, [[Regression]] e x-it dhe y-it, dhe [[Measurement system]]: përputhja e vlerësimeve dhe Gage R&R.",
      ],
      get: "Karta e kontrollit me rregullat e Nelson-it, histogrami kundrejt specifikimit, Cp, Cpk dhe PPM, një grafik pikash me vijën e përshtatur, kappa e Fleiss-it dhe pjesa e ndryshueshmërisë që vjen nga instrumenti, çdo shifër me një fjali që thotë çfarë do të thotë. [[Add the signal to actions]], ose shkarkoje si CSV ose Excel.",
      data: "Shifrat e tua mbeten në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/time-study/": {
      when: "Te linja, me kronometër, para se ta balancosh punën përsëri ose ta shkruash standardin.",
      how: [
        "Shkruaj kërkesën dhe minutat në dispozicion për turn: mjeti jep taktin.",
        "Shto stacionet sipas rrjedhës, secilin me elementet e veta, të shënuara VA, NVA ose W.",
        "Shtyp [[Start timing]] dhe [[Lap]], ose tastin e hapësirës, në fund të çdo elementi. Mat të paktën tre cikle për stacion; pesë është më mirë.",
        "Lexo Yamazumi-n kundrejt taktit dhe lëvizjet për balancim.",
      ],
      get: "Koha standarde e çdo elementi me shpërndarjen e saj, një Yamazumi i çdo stacioni kundrejt taktit, sa nga koha është humbje, pengesa dhe elementi i parë për t'u zhvendosur. [[Add the balance moves as actions]], ose shkarko kohët standarde si CSV ose Excel.",
      data: "Stacionet dhe matjet mbeten në këtë shfletues. Matjet mund edhe të shkruhen ose të ngjiten.",
    },
    "/tools/value-stream-map/": {
      when: "Kur koha e kalimit është e gjatë dhe duhet të shohësh ku shkon, nga furnitori te klienti.",
      how: [
        "Emërto familjen e produktit ose të shërbimit, kërkesën e klientit në ditë dhe minutat e punës.",
        "Shtyp [[Fill the steps]] nga një model, ose shtoji hapat vetë: koha e ciklit, ndërrimi, disponueshmëria, rendimenti dhe operatorët.",
        "Ec përgjatë rrjedhës dhe numëro copat që presin para çdo hapi: mjeti i kthen në kohë.",
        "Kalo te [[Future state]], ndrysho atë që ndryshojnë përmirësimet dhe shkruaje çdo ndryshim si një shpërthim kaizen.",
      ],
      get: "Harta me shkallën e kohës së kalimit, pjesa e kohës së kalimit që është punë, takti dhe hapat mbi të, gjendja aktuale dhe ajo e ardhshme. [[Send kaizen bursts to the Action Tracker]], ose shkarkoje si CSV ose Excel.",
      data: "Harta mbetet në këtë shfletues. Asgjë nuk dërgohet e nuk ngarkohet.",
    },
    "/tools/standard-work/": {
      when: "Kur një punë duhet bërë njësoj në çdo turn, dhe një person i ri duhet të mund ta mësojë.",
      how: [
        "Nis nga një model me [[Use this template]], ose përshkruaj punën: titullin, procesin, zonën, përgjegjësin, taktin ose kohën e synuar, mjetet mbrojtëse dhe veglat.",
        "Shkruaj me radhë hapat kryesorë, secilin me pak fjalë, me kohën e vet.",
        "Shto pikat kyçe që e bëjnë ose e prishin çdo hap, të shënuara Siguria, Cilësia, Teknika ose Kostoja, secilën me arsyen e vet.",
        "Lexo [[Quality check]]. Kur puna ndryshon, nis një [[New version]] dhe shkruaj çfarë ndryshoi.",
      ],
      get: "Një fletë e ndarjes së punës me kohën e çdo hapi kundrejt taktit dhe historikun e ndryshimeve, për ta printuar, kopjuar si tekst ose [[Download Word]]. [[Train the team on it]] e vendos trajnimin te Lista e veprimeve; [[Audit this standard]] hap Auditin 5S.",
      data: "Çdo standard ruhet në këtë shfletues ndërsa shkruan, në një listë ku mund ta hapësh, ta kopjosh ose ta fshish.",
    },
    "/tools/spaghetti-diagram/": {
      when: "Kur një punë kërkon shumë ecje, mbledhja e porosive, paketimi ose përgatitja e një dhome, dhe para e pas ndryshimit të paraqitjes.",
      how: [
        "Emërto punën, pastaj ngarko një foto të planit të katit ose përdor rrjetën e thjeshtë. [[Set the scale]] duke prekur dy pika që e di sa larg janë.",
        "Ndiq punën, jo personin: [[+ New walk]], pastaj prek çdo kthesë të rrugës. Emërto një ndalesë para se ta prekësh; një prekje pranë një ndalese numërohet si vizitë tjetër. [[Finish the walk]].",
        "Vizato tre deri në gjashtë cikle të së njëjtës punë, dhe jep ciklet për turn dhe shpejtësinë e ecjes.",
        "Bëj ndryshimin, pastaj ec përsëri punën te [[After the change]].",
      ],
      get: "Metrat për cikël dhe për turn, minutat e ecjes, ndalesat më të vizituara, pjesa më e gjatë që përsëritet, një rrjetë nxehtësie dhe kursimi pas ndryshimit. [[Take to the Kaizen Board]], [[Time it with the Time Study]] ose [[Add the change to the actions]], dhe shkarko pikat si CSV ose Excel.",
      data: "Imazhi i planit dhe ecjet mbeten në këtë pajisje. Asgjë nuk ngarkohet.",
    },
    "/tools/project-portfolio/": {
      when: "Një herë në javë për çdo përmirësim që ecën si projekt DMAIC, dhe në çdo pikë kalimi me sponsorin.",
      how: [
        "[[+ New project]] me kartën e tij: problemi si shifër, qëllimi, fusha, drejtuesi, sponsori dhe datat.",
        "Plotëso fletët e fazës: SIPOC, pemën CTQ, RACI dhe Kano në Define; defektet, njësitë, mundësitë, RTY dhe COPQ në Measure dhe Analyze; planin e kontrollit në Control.",
        "Në fund të çdo faze, shëno listën e pikës së kalimit dhe [[Close this tollgate]] me emrin e sponsorit dhe datën, ose mbylle me një arsye të shkruar.",
        "Shëno kursimet e forta sipas muajit, kur i konfirmon financa; kursimet e buta mbeten vlerësim.",
      ],
      get: "Çdo projekt në një faqe: faza, gjendja, ditët në fazë, pika e radhës e kalimit, sigma para dhe pas, dhe kursimet e planifikuara kundrejt atyre të realizuara. [[Control plan to the Action Tracker]] ia jep çdo kontroll përgjegjësit të tij; [[Print this project]] ose [[Download Word]].",
      data: "Portofoli mbetet në këtë shfletues dhe shkarkohet si CSV ose Excel.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "Kur një përmirësim është projekt, jo rregullim i shpejtë.",
      how: [
        "Kalo nëpër Define, Measure, Analyse, Improve dhe Control. Çdo hap ka rezultatin e vet, idetë kryesore, gabimet e zakonshme, një rast real, mjetet që i përkasin dhe [[Check yourself]].",
        "Lexo tetë llojet e humbjeve dhe fjalorthin.",
        "Plotëso kartën e projektit, ose shtyp [[Fill with the course case]] për të parë një shembull.",
      ],
      get: "Një kartë projekti DMAIC për ta printuar, ruajtur si PDF ose kopjuar si tekst. Kur çdo përgjigje është e saktë, kursi jep një certifikatë përfundimi me emrin tënd: [[Print the certificate]].",
      data: "Përgjigjet dhe karta jote ruhen vetëm në këtë shfletues.",
    },
    "/tools/cv-builder/": {
      when: "Kur CV-ja jote duhet të duket e dizajnuar, jo e shtypur.",
      how: [
        "Zgjidh gjuhën e CV-së, anglisht, gjermanisht ose shqip, hapësirat dhe ngjyrat.",
        "Shto foto, kontaktet, deri në katër shifra kyçe, një profil dhe arritjet kryesore.",
        "Shto përvojën. Faqja e internetit e një kompanie sjell logon e saj.",
        "Shto arsimimin, aftësitë dhe gjuhët, pastaj lexo kontrollin e CV-së.",
      ],
      get: "Një CV që e sheh të ndryshojë në faqe të vërteta A4, e shkarkuar si PDF, dhe një kopje rezervë që e hap përsëri me [[Open a backup file]].",
      data: "Ruhet në këtë shfletues, bashkë me fotot dhe logot. Vetëm faqet e internetit të kompanive që shkruan shkojnë te shërbimi i ikonave i Google-it, për të marrë logot.",
    },
    "/tools/ats-cv/": {
      when: "Kur një softuer e lexon CV-në tënde para një njeriu.",
      how: [
        "Nis nga një skedar PDF ose Word, nga Krijuesi i CV-së ose nga tekst i ngjitur, dhe shtyp [[Sort it into the fields]].",
        "Zgjidh gjuhën, shkronjat dhe ngjyrën e titujve.",
        "Kontrollo kontaktin, përmbledhjen, përvojën dhe seksionet e tjera.",
        "[[Match a job ad]]: ngjit njoftimin dhe lexo kontrollin ATS.",
      ],
      get: "CV-ja jote si PDF, Word (.docx) dhe tekst i thjeshtë.",
      data: "Ruhet në këtë shfletues. Lexuesi i PDF-ve ngarkohet nga kjo faqe, vetëm kur hap një PDF.",
    },
    "/tools/cover-letter/": {
      when: "Kur letra duhet të shkojë me CV-në tënde, në të njëjtin dizajn.",
      how: [
        "Merr të dhënat [[From the CV Builder]] ose [[From the ATS CV]].",
        "Zgjidh Modern ose Classic, ngjyrat, shkronjat dhe foton.",
        "Shto kompaninë dhe personin të cilit i shkruan.",
        "Përgjigju disa pyetjeve, nga pozicioni deri te data e fillimit, dhe shtyp [[Write the first draft]]. Pastaj redaktoje, nënshkruaje dhe lexo kontrollin e letrës.",
      ],
      get: "Letra si PDF, Word (.docx) dhe tekst i thjeshtë.",
      data: "Ruhet në këtë shfletues, bashkë me foton dhe nënshkrimin. Asgjë nuk ngarkohet.",
    },
  },
};

const de = {
  title: "Der Werkzeug-Leitfaden",
  subtitle: "Sechsunddreißig kostenlose Tools und ein Kurs für alle, die Teams und Abläufe führen: wofür sie da sind, wie Sie sie nutzen und warum sie so aussehen, wie sie aussehen.",
  edition: `Ausgabe ${EDITION} · Oktober 2026`,
  author: "Stiven Janaqi",
  labels: {
    contents: "Inhalt",
    when: "Wann Sie es nutzen",
    how: "So geht's",
    get: "Was Sie bekommen",
    data: "Ihre Daten",
    open: "Öffnen",
    tools: "Die Tools",
    routine: "Eine Routine",
    routineNote: "Wo jedes Tool in die Arbeit dieser Rolle passt, Schritt für Schritt.",
    learn: "Kurs",
    page: "Seite",
    planet: "Der Planet",
    moons: "Monde",
    family: "Familie",
  },
  sections: {
    about: {
      kicker: "Über diesen Leitfaden",
      title: "Sechsunddreißig Tools, vier Planeten, eine Idee",
      body: [
        "Stiven Catalyst hat sechsunddreißig kostenlose Tools und einen Kurs für alle, die Teams und Abläufe führen: Schichtleiter, Area Manager, Prozessmanager und alle, die ihre Erfahrung in die nächste Rolle mitnehmen.",
        "Dieser Leitfaden erklärt, wie die Tools geordnet sind, warum die Website so aussieht, wie sie aussieht, und wie Sie jedes Tool Schritt für Schritt nutzen. Sie müssen ihn nicht der Reihe nach lesen: Suchen Sie Ihren Planeten und fangen Sie dort an.",
        { cards: [
          { title: "Kostenlos", text: "Jedes Tool ist kostenlos." },
          { title: "Kein Konto", text: "Sie öffnen ein Tool und fangen an. Es gibt nichts, wofür Sie sich anmelden müssten." },
          { title: "Auf Ihrem Gerät", text: "Ihre Arbeit bleibt in Ihrem Browser, nicht auf einem Server. Keine Cookies, keine Webanalyse." },
        ] },
        { note: "Zwei Ausnahmen, die in den Tools selbst stehen: Wenn Sie im Lebenslauf-Generator die Website einer Firma eingeben, geht diese Adresse an den Icon-Dienst von Google, um das Logo zu holen; und die [[Team sync]] schickt, wenn Sie sie einschalten, die gewählten Tools verschlüsselt von Ihrem Gerät an die Kopie Ihres Teams." },
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
          "Die Protokolle für Schäden, Vollständigkeit und Verspätungen speisen Shift Pulse und das Tagesboard, und die Schichtübergabe holt ihre Zahlen mit [[Fill in from the logs]].",
          "Jedes Ergebnis eines Protokolls geben Sie mit einem Klick weiter: [[Take it to 5 Whys]], [[Open in Pareto 80/20]], [[Open as control chart]] oder [[Add to actions]].",
          "5 Whys gibt seine Gegenmaßnahme an die Maßnahmenliste weiter oder nimmt sie in die Schichtübergabe auf.",
          "Der CX Control Tower und die Fischgräte geben ihre Ursachen an Pareto 80/20 weiter; der A3-Report übernimmt das Pareto-Ergebnis und das Arbeitsblatt von 5 Whys.",
          "Das Anschreiben übernimmt Ihre Angaben aus dem Lebenslauf-Generator oder dem ATS-Lebenslauf.",
          "Der Betriebsbericht liest sie alle und schreibt den Bericht der Woche oder des Monats.",
        ] },
        "Und auf jeder Rollenseite macht ein Coaching-Bereich aus den Tools eine Praxis: ein Projekt mit Ziel, Messung und Termin für die Überprüfung. Mehr dazu auf den letzten Seiten.",
      ],
    },
    machine: {
      kicker: "Die Idee, 4",
      title: "Eine Liste, ein Arbeitsplatz",
      body: [
        "Sechzehn der Tools sind als ein System für den Alltag vor Ort gebaut, vom Huddle bis zum Standard. Drei Dinge halten sie zusammen, alle in Ihrem Browser:",
        { list: [
          "Eine Liste für alle Maßnahmen. Eine Gegenmaßnahme aus 5 Whys, ein Befund des 5S-Audits, ein Signal des Prozesslabors: Jedes wird eine Maßnahme in der Maßnahmenliste, mit Verantwortlichem, Termin, Status und der Art, wie sie geprüft wird. Ein Tool übergibt sie einmal, nie doppelt.",
          "Ein Arbeitsplatzprofil. Standort, Schichten, Bereiche mit ihren Verantwortlichen, Teams und Ziele tragen Sie einmal ein, im Tagesboard, im 5S-Audit, im Gemba Walk oder in der Qualifikationsmatrix, und jedes Tool, das sie braucht, bietet sie an. Ohne Profil arbeitet jedes Tool mit dem, was Sie dort eingeben.",
          "Eine Art von Diagramm. Zeigen oder tippen Sie auf ein Diagramm, um seine Werte zu lesen, tippen Sie auf eine Ursache, um danach zu filtern, markieren Sie eine Änderung auf der Zeitachse, um sie in jedem Trend zu sehen, und laden Sie jedes Diagramm als SVG oder PNG in Druckfarben herunter.",
        ] },
        "Ein Tag mit ihnen: die Protokolle und das Sicherheitskreuz während der Schicht, das Tagesboard beim Huddle, ein Gemba Walk oder ein 5S-Audit vor Ort und einmal pro Woche zehn Minuten mit der Maßnahmenliste: zuerst das Überfällige, dann diese Woche, dann das Bestätigte.",
        { note: "Die Maßnahmenliste und das Arbeitsplatzprofil sind in jeder Sprache der Website dieselben; alles andere wird je Sprache getrennt gespeichert." },
      ],
    },
    data: {
      kicker: "Bevor Sie anfangen",
      title: "Ihre Arbeit bleibt bei Ihnen",
      body: [
        "Jedes Tool speichert Ihre Arbeit nur in dem Browser, den Sie benutzen. Sie wird nirgendwohin geschickt, außer Sie schalten die Team-Synchronisierung ein; was Sie am Laptop gemacht haben, ist also nicht auf Ihrem Handy.",
        "Um alles zu sichern oder auf ein anderes Gerät zu bringen, nutzen Sie [[Save all my work]] am Ende jeder Tool-Seite: eine Datei mit der Arbeit aller Tools. [[Open a saved file]] holt sie zurück und ersetzt nur die Tools, die in dieser Datei stehen.",
        { list: [
          "Die meisten Tools lassen sich drucken oder als PDF speichern, und die Protokolle als CSV und als Excel herunterladen.",
          "Jedes Tool speichert seine Arbeit für jede Sprache der Website getrennt, außer der Maßnahmenliste und dem Arbeitsplatzprofil.",
          "Ein Tool, das Sie einmal geöffnet haben, öffnet sich auch ohne Verbindung wieder, und die Website lässt sich als App installieren.",
          "Der Browser legt einmal am Tag und bevor eine Datei etwas ersetzt einen Wiederherstellungspunkt Ihrer ganzen Arbeit an; [[Restore points]] im selben Bereich holt einen zurück.",
          "[[Team sync]] teilt die Tools, die Sie ankreuzen, mit den Geräten Ihres Teams. Ein Code aus sechs Wörtern ergibt den Schlüssel, und die Arbeit wird auf dem Gerät verschlüsselt, sodass der Server sie nicht lesen kann. Schreiben Sie den Code auf: Er wird nur einmal gezeigt.",
          "Wenn Sie die Browserdaten löschen, löschen Sie auch Ihre Arbeit. Sichern Sie vorher eine Datei.",
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
        { note: "Auch hier gibt es keinen Server und kein Konto. Der Coaching-Bereich gehört nur Ihnen: Die Team-Synchronisierung teilt ihn nie." },
      ],
    },
    next: {
      kicker: "Ausgabe 4",
      title: "Was als Nächstes kommen könnte",
      body: [
        "Ideen, über die ich nachdenke, keine Versprechen mit Datum. Sagen Sie mir, welche Ihnen am meisten helfen würde.",
        { list: [
          "Shift Pulse und das Tagesboard, die die Zimmerkontrolle und den Wartungsplaner lesen.",
          "Die Verspätungsanalyse für Touren ohne erfasste Abfahrtszeit.",
          "Die Team-Synchronisierung mit einem Code pro Person, damit ein Mitglied gehen kann, ohne dass alle einen neuen Code brauchen.",
        ] },
        "Wenn sich ein Tool ändert, bekommt dieser Leitfaden eine neue Ausgabe. Die neueste ist immer auf der Website, die früheren bleiben dort, wie sie gedruckt wurden.",
      ],
    },
    back: {
      motto: "Sieh klar. Denk anders. Handle bewusst.",
      text: "Alle Tools, kostenlos, auf Deutsch, Englisch und Albanisch:",
    },
  },
  families: {
    pulse: "Elf Tools für eine Schicht: erfassen, was schiefgeht, dort, wo es passiert, den Bereich sicher und in Ordnung halten, das Huddle führen, die Schicht in einem Bild sehen, die Fundsachen der Gäste verwalten und sauber übergeben, mit jeder Maßnahme auf einer Liste.",
    zenith: "Zwölf Tools für einen Bereich: die Woche lesen, herausfinden, woher eine rote Zahl wirklich kommt, mit den Ursachen anfangen, die am meisten wiegen, ein Problem auf ein Blatt bringen, die Ideen und Fähigkeiten des Teams wachsen lassen, die Zimmer prüfen, die Wartung planen und über die Woche berichten.",
    lumen: "Zehn Tools und ein Kurs für das ganze System: eine echte Veränderung vom Rauschen unterscheiden, eine Grundursache finden, die Sie ändern können, Risiken bewerten, den Fluss messen, abbilden und ablaufen, den Standard schreiben und Verbesserungen als Portfolio von Projekten führen.",
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
      get: "Ein Blick auf das, was die Protokolle für Schäden, Vollständigkeit, Verspätungen und Übergaben in diesem Browser enthalten, dazu das Sicherheitskreuz, die OEE, die offenen Maßnahmen und das letzte 5S-Audit, sobald sie Daten haben: Karten und ein Trend für jede Zahl, mit dem Hinweis [[Above usual]] nur jenseits der Grenze der Regelkarte für ihr übliches Niveau, zum Kopieren, Drucken oder als PDF.",
      data: "Es speichert nur Ihre Einstellungen. Die anderen Tools liest es und ändert nichts daran.",
    },
    "/tools/damage-control/": {
      when: "Jedes Mal, wenn eine Einheit beschädigt wird, an der Stelle im Prozess, an der es passiert.",
      how: [
        "Erfassen Sie jede beschädigte Einheit: Datum, Prozessschritt, Ursache und Einheiten, dazu Kosten und eine Notiz, wenn Sie sie haben. Zeilen aus Excel fügen Sie mit [[Import rows]] ein.",
        "Legen Sie den Zeitraum fest: die bearbeiteten Einheiten und Ihr Ziel.",
        "Prüfen Sie das Protokoll. Um das Tool erst auszuprobieren, laden Sie eine Beispielwoche.",
        "Gehen Sie den [[Floor check]] durch.",
      ],
      get: "Schadensquote, DPMO und Sigma-Niveau, die wenigen Ursachen hinter den meisten Schäden, die Prozessschritte, an denen sie entstehen, ein Trend und wo Sie anfangen. Als CSV oder Excel herunterladen oder weiter zu 5 Whys, Pareto 80/20, einer Regelkarte oder der Maßnahmenliste.",
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
      get: "Pünktlichkeitsquote, jede verspätete Minute aufgeteilt in Rampe und Straße, die Gründe, die Abfahrtszeiten und Schichten hinter den Verspätungen, und ein Trend, mit denselben Exporten und nächsten Schritten wie die Schadenskontrolle.",
      data: "Das Protokoll bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/night-audit/": {
      when: "Jede Nacht, für jeden No-Show, jede abgelehnte Karte, jeden Buchungsfehler und jeden offenen Saldo, den das Audit findet.",
      how: [
        "Erfassen Sie jede Abweichung: Datum, Schicht, die Phase des Aufenthalts, in der sie gefunden wurde, Art, Ursache und betroffene Reservierungen, dazu Kosten und eine Notiz, wenn Sie sie haben. Zeilen aus dem PMS oder aus Excel fügen Sie mit [[Import rows]] ein.",
        "Legen Sie den Zeitraum fest: die bearbeiteten Reservierungen und Ihr Ziel.",
        "Prüfen Sie das Protokoll. Um das Tool erst auszuprobieren, laden Sie eine Beispielwoche.",
        "Gehen Sie den [[Floor check]] des Audit-Standards durch.",
      ],
      get: "Abweichungsquote und saubere Reservierungen, DPMO und Sigma-Niveau, die wenigen Ursachen hinter den meisten Abweichungen und die Phase des Aufenthalts, in der sie beginnen, mit denselben Exporten und nächsten Schritten wie die Schadenskontrolle. Die Hotel-Übergabe übernimmt die No-Shows von hier.",
      data: "Das Protokoll bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/shift-handover/": {
      when: "Am Ende jeder Schicht. Die meisten Probleme gehen nicht in der Schicht verloren, sondern zwischen den Schichten.",
      how: [
        "Wählen Sie eine Vorlage: Lager, Hotel-Rezeption oder Zustellstation. Tragen Sie Datum, Schicht, Bereich und beide Namen ein.",
        "Tragen Sie die Zahlen ein. [[Fill in from the logs]] übernimmt sie aus Schäden, Vollständigkeit und Verspätungen; die Hotel-Vorlage übernimmt die No-Shows aus dem Night-Audit-Protokoll.",
        "Listen Sie die offenen Punkte auf, jeden mit Verantwortlichem und Uhrzeit. Ergänzen Sie Hinweise, Sicherheit und Personal.",
        "Machen Sie den Übergabe-Check.",
      ],
      get: "Eine Ansicht [[Ready to hand over]] zum Kopieren, Drucken oder als PDF, die Sie über Ihren eigenen Kanal verschicken. [[Close shift, start the next]] nimmt die offenen Punkte mit und zählt, wie oft sie übergeben wurden; ein offener Punkt geht weiter an 5 Whys oder die Maßnahmenliste. Frühere Übergaben bleiben in einem Verlauf.",
      data: "Die Übergabe bleibt in diesem Browser. Nichts wird gesendet.",
    },
    "/tools/action-tracker/": {
      when: "Wenn ein Tool Ihnen etwas zu tun gibt, und einmal pro Woche: eine Liste für jede Gegenmaßnahme, jeden Befund und jedes Signal.",
      how: [
        "Schreiben Sie die Maßnahme mit einem Verb, mit Verantwortlichem, Termin und woran Sie merken, dass sie gewirkt hat. Oder schicken Sie sie aus einem anderen Tool: Sie kommt mit ihrer Quelle an.",
        "Führen Sie sie von offen über in Arbeit und erledigt bis bestätigt: wenn die Zahl sich bewegt hat und geblieben ist.",
        "Filtern Sie nach Status, nach Verantwortlichem oder nach dem Tool, aus dem sie kommt.",
        "Halten Sie das Wochenreview: Überfälliges zuerst, dann diese Woche, dann das Bestätigte. [[Copy the review]] für die Besprechung.",
      ],
      get: "Die Woche in Maßnahmen: was überfällig ist und wer es trägt, die Abschlüsse pro Woche, die Termine im Monatskalender und das Review zum Kopieren oder Drucken. Die Liste gibt es als CSV, als Excel oder als [[Calendar file (.ics)]] mit jedem offenen Termin.",
      data: "Die Liste bleibt in diesem Browser, in jeder Sprache dieselbe. Eine Maßnahme aus einem Tool wird einmal übernommen, nie doppelt.",
    },
    "/tools/daily-board/": {
      when: "Zu Beginn jeder Schicht, für ein Huddle von zehn Minuten im Stehen.",
      how: [
        "Füllen Sie einmal das [[Workplace profile]] aus: Standort, Schichten, Bereiche mit ihren Verantwortlichen und die Ziele, nach denen sich das Board färbt.",
        "Lassen Sie die Protokolle in diesem Browser Sicherheit, Qualität und Lieferung färben: das Sicherheitskreuz, das 5S-Audit, die Schadenskontrolle, die Vollständigkeitskontrolle, das Night-Audit-Protokoll und die Verspätungsanalyse.",
        "Markieren Sie Kosten und Menschen von Hand mit [[Add to the board]]. Ein Eintrag von Hand geht für diesen Tag den Protokollen vor.",
        "Lesen Sie die [[Huddle agenda]] vor: das Board von gestern, die überfälligen und heute fälligen Maßnahmen, die weitergegebenen Übergabepunkte und die Sicherheitsbotschaft des Tages.",
      ],
      get: "Sicherheit, Qualität, Lieferung, Kosten und Menschen als fünf Monatskalender mit grünen, gelben und roten Tagen, die roten Tage je Buchstabe gegenüber dem Vormonat und die Tagesordnung zum Kopieren oder Drucken. Ein roter Tag geht mit [[Add to actions]] oder [[Take it to 5 Whys]] weiter.",
      data: "Ihre Einträge von Hand bleiben in diesem Browser und lassen sich als CSV oder Excel herunterladen. Das Board liest die anderen Protokolle und ändert nichts daran.",
    },
    "/tools/five-s-audit/": {
      when: "An einem festen Wochentag, in denselben Bereichen und in derselben Reihenfolge, um zu sehen, ob die Ordnung vor Ort hält.",
      how: [
        "Wählen Sie 5S, 6S oder 8S, eine Checkliste für Lager, Hotel oder Zustellstation, den Bereich und das Datum.",
        "Gehen Sie durch den Bereich und bewerten Sie jede Frage so, wie Sie es jetzt sehen, von 0, nichts vorhanden, bis 4, voller Standard. Notieren Sie, was Sie bei 2 oder weniger sehen, mit einem Foto.",
        "Klicken Sie auf [[Save audit]] und geben Sie dann mit [[Add findings to actions]] jedem Befund einen Verantwortlichen in der Maßnahmenliste.",
        "Erfassen Sie im [[Red tag register]], was dort vielleicht nicht hingehört, mit Grund, Entscheidung und Verantwortlichem.",
      ],
      get: "Ein Radar jedes S gegenüber dem letzten Audit des Bereichs, der Trend und eine Rangliste der Bereiche, die schwächsten Fragen, die offenen Roten Karten nach Alter und die Fotos vorher und nachher nebeneinander. Der [[Audit plan]] verteilt die Bereiche reihum auf die Auditoren und lässt sich als Kalenderdatei herunterladen. Drucken Sie mit [[Print scorecard]], oder laden Sie alles als CSV oder Excel herunter.",
      data: "Die Audits, die Roten Karten und die Fotos bleiben in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/safety-cross/": {
      when: "Am Tag, an dem es passiert: jeder Unfall, jede Erste Hilfe, jeder Beinahe-Unfall, jeder unsichere Zustand und jede unsichere Handlung, auch die positiven Beobachtungen.",
      how: [
        "Erfassen Sie jedes Ereignis: Datum, Schicht, Art, Bereich, was passiert ist, die Ursache und den Schweregrad als Potenzial, nicht als Folge, mit einer Maßnahme und einem Verantwortlichen. Zeilen lassen sich importieren.",
        "Tragen Sie die Arbeitsstunden des Monats für LTIFR und TRIR ein und, wenn Sie möchten, ein Ziel für gemeldete Beinahe-Unfälle und für Tage ohne Unfall.",
        "Lesen Sie das Kreuz des Monats, dann die Ursache, mit der Sie anfangen.",
        "Sprechen Sie das Thema des Tages in der Besprechung an und klicken Sie dann auf [[Mark as held]].",
      ],
      get: "Der Monat als grünes Kreuz mit einem roten oder gelben Tag für jedes Ereignis, die Tage seit dem letzten Unfall, LTIFR, TRIR, die Bird-Pyramide und die Bereiche, in denen die Ereignisse passieren. [[Send open actions to the Action Tracker]], oder geben Sie die wichtigste Ursache an 5 Whys oder Pareto 80/20 weiter.",
      data: "Das Protokoll bleibt in diesem Browser und lässt sich als CSV oder Excel herunterladen. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/lost-found/": {
      when: "Sobald eine Fundsache an der Rezeption ankommt, und einmal am Tag für die Fundsachen, über die zu entscheiden ist.",
      how: [
        "Erfassen Sie die Fundsache: Datum, Uhrzeit, Fundort, Kategorie, Wertklasse, Finder, Lagerort und eine Etikettennummer, gescannt oder eingetippt. Ein Foto bleibt auf diesem Gerät.",
        "Wertvolles, Handys, Ausweise, Geldbörsen und Schmuck, kommt in derselben Stunde in den Safe. Schreiben Sie einen Gästenamen nur, wenn die Sache eindeutig einem Gast gehört.",
        "Halten Sie jeden Schritt fest: Gast kontaktiert, zurückgegeben (persönlich oder per Post), an die Polizei übergeben, gespendet oder vernichtet. [[Copy the reply]] liefert einen höflichen Text für den Gast.",
        "Unter [[Settings]] legen Sie fest, wie lange jede Wertklasse aufbewahrt wird; die Liste der fälligen Entscheidungen zeigt, was seine Frist überschritten hat.",
      ],
      get: "Die offenen Fundsachen nach Alter, die fälligen Entscheidungen, wo am meisten liegen bleibt und wie viel zurückgeht, [[Print tag label]] und das Register als CSV oder Excel. [[Remove guest names of closed items]] löscht die Gästedaten abgeschlossener Fälle.",
      data: "Register und Fotos bleiben in diesem Browser; nichts wird gesendet. Die Fristen sind Vorgaben: Es entscheiden Ihre Hausregeln und das örtliche Recht.",
    },
    "/tools/cx-control-tower/": {
      when: "Jede Woche, um vom Ergebnis beim Kunden zum operativen Treiber, zur Grundursache und zu einer geprüften Maßnahme zu kommen.",
      how: [
        "Laden Sie Ihre Dateien: Zustellungen, Touren, Vorfälle und Maßnahmen, als CSV oder Excel, oder eine einzige Arbeitsmappe. Oder klicken Sie auf [[Load the example]].",
        "Tragen Sie nur Ziele ein, die Sie freigegeben haben.",
        "Filtern Sie nach Datum, Partner, Schicht und Zone.",
        "Lesen Sie die Reiter, von der Übersicht bis zum [[Weekly review]].",
        "Im [[Deep dive]] wählen Sie einen Fehler, sehen, wo er sich häuft und welche Vorfälle ihn erfassen, schreiben die Untersuchung und klicken auf [[Create the linked action]].",
      ],
      get: "Perfect Delivery für jeden Auftrag, Scorecards, Tourrisiko, ein Pareto der Grundursachen, eine Detailanalyse pro Fehler mit ihrem Fallregister und eine Maßnahmenverfolgung. Die Auswertung können Sie kopieren und drucken, die Tabellen als CSV exportieren.",
      data: "Ihre Dateien werden im Browser gelesen. Nichts wird hochgeladen.",
    },
    "/tools/kpi-diagnostic/": {
      when: "Eine Zahl ist rot geworden. Bevor Sie mehr Druck machen, finden Sie heraus, wo die Ursache liegt.",
      how: [
        "Nennen Sie die Kennzahl, wenn Sie möchten.",
        "Bewerten Sie zehn Aussagen.",
        "Klicken Sie auf [[See the result]].",
      ],
      get: "Die Ursache, die am besten passt (Klarheit, Können, Kapazität, Prozessgestaltung oder Verantwortung), mit drei ersten Schritten und einer [[Question for the floor]]; wenn keine einzelne Ursache heraussticht, der Rat, sich die Arbeit vor Ort anzusehen. In jedem Fall ein Wert für jede Ursache, den Sie an 5 Whys oder die Maßnahmenliste weitergeben können.",
      data: "Nichts, was Sie eingeben, wird gespeichert oder gesendet.",
    },
    "/tools/pareto/": {
      when: "Wenn wenige Ursachen den größten Teil der Probleme verursachen und Sie wissen müssen, welche Sie zuerst angehen.",
      how: [
        "Wählen Sie eine Vorlage: Zustellung, Lager oder Hotel. Oder klicken Sie auf [[Load the example]].",
        "Bringen Sie Ihre Daten mit: eine CSV- oder Excel-Datei oder aus einer Tabelle eingefügte Zellen.",
        "Prüfen Sie die Spalten: Ursache, Anzahl, Wert, Datum.",
        "Ordnen Sie die Ursachen nach Häufigkeit oder nach Kosten. Wenn Sie möchten, vergleichen Sie vorher und nachher.",
      ],
      get: "Ein geprüftes Pareto-Diagramm, in dem jede Zeile mitgezählt ist, [[Where to start]], und Exporte als PNG, SVG und CSV.",
      data: "Dateien werden im Browser gelesen, auch Excel. Bis zu 20.000 Zeilen werden gespeichert.",
    },
    "/tools/a3-report/": {
      when: "Wenn ein Problem ein Blatt verdient: die Fakten, das Ziel, die Ursache und die Nachverfolgung, vereinbart, bevor jemand anfängt.",
      how: [
        "Klicken Sie auf [[New A3]] und tragen Sie Titel, Verantwortlichen und Datum ein.",
        "Füllen Sie die sieben Felder der Reihe nach: Hintergrund, Ist-Zustand mit seiner Kennzahl, Soll-Zustand mit Termin, Ursachenanalyse, Maßnahmen mit je einem Verantwortlichen, Umsetzung und Wirksamkeitsprüfung.",
        "Übernehmen Sie, was Sie schon haben: [[Read the Pareto result]] für den Ist-Zustand, [[Take from 5 Whys]] für die Grundursache.",
        "Lesen Sie die [[Quality check]] und klicken Sie dann auf [[Send countermeasures to the Action Tracker]].",
      ],
      get: "Ein Blatt mit der Lücke zwischen Ausgangswert, Ziel und letztem Wert und einer Prüfung des Blatts selbst in acht Punkten. Drucken Sie es auf A3 oder A4, kopieren Sie es als Text, oder nutzen Sie [[Download Word]].",
      data: "Jeder A3-Report wird beim Tippen in diesem Browser gespeichert, in einer Liste, in der Sie ihn öffnen, duplizieren oder löschen können.",
    },
    "/tools/kaizen-board/": {
      when: "Jede Woche, um die Ideen des Teams zu sammeln und jeder innerhalb der Woche eine Antwort zu geben.",
      how: [
        "Schreiben Sie die Idee auf, was sie beseitigt, den Bereich und wer sie vorgeschlagen hat, bewerten Sie Aufwand und Nutzen von 1 bis 5, ergänzen Sie eine Einsparung, wenn Sie sie kennen, und klicken Sie auf [[Add to the board]].",
        "Führen Sie jede Karte über Planen, Umsetzen und Prüfen bis Eingeführt, oder verwerfen Sie sie mit einem Grund, den die Person lesen kann.",
        "Fangen Sie mit den schnellen Erfolgen an: wenig Aufwand, viel Nutzen, oben links in der Matrix.",
        "Eine große Idee geht mit [[Take to A3]] weiter; den nächsten Schritt einer Karte übernimmt [[Add to actions]] in die Maßnahmenliste.",
      ],
      get: "Das Board mit den Tagen, die jede Karte gewartet hat, die offenen Ideen nach Priorität, die Einführungsquote, die Tage von der Idee bis zur Einführung, die Einsparungen pro Monat und pro Jahr und die Idee des Monats. Als CSV oder Excel herunterladen.",
      data: "Das Board bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/skills-matrix/": {
      when: "Bevor Sie Dienstplan oder Schulung planen, um zu sehen, welche Aufgaben an einer einzigen Person hängen.",
      how: [
        "Benennen Sie das Team und klicken Sie auf [[Load the tasks]] einer Vorlage, Lager, Hotel-Rezeption oder Zustellstation, jede Aufgabe mit Kritikalität, Mindeststufe und Ziel.",
        "Fügen Sie die Personen mit ihrer Schicht hinzu.",
        "Bewerten Sie jede Person für jede Aufgabe, gemeinsam mit ihr, von 0, nicht geschult, bis 4, kann schulen. Ein Klick hebt die Stufe um eins.",
        "Mit [[Suggest a plan]] bekommt jede Person in Einarbeitung eine Stufe 4 derselben Aufgabe zur Seite, die kritischsten Lücken zuerst. Dann klicken Sie auf [[Send plan to the Action Tracker]].",
      ],
      get: "Die Abdeckung gegenüber dem Ziel für jede Aufgabe und Schicht, die Einzelabhängigkeiten, wer unter einer Mindeststufe liegt, der Flexibilitätsindex und, mit [[Take a snapshot]] jeden Monat, ob die Schulung wirkt. Matrix und Plan lassen sich als CSV oder Excel herunterladen.",
      data: "Die Matrix bleibt in diesem Browser. [[Anonymise names]] zeigt jede Person als Nummer, auf der Seite und in den Exporten.",
    },
    "/tools/oee/": {
      when: "In jeder Schicht, für die Anlage oder die Linie, die den Takt vorgibt.",
      how: [
        "Legen Sie jede Anlage mit ihrer idealen Leistung laut Typenschild an, oder mit ihrer idealen Taktzeit, und klicken Sie auf [[Save machine]].",
        "Erfassen Sie eine Schicht: die geplanten Minuten, die Stopps mit Grund und Minuten, die gefertigten Teile und den Ausschuss. Zeilen lassen sich importieren.",
        "Geplante Stopps wie Pausen, Besprechungen oder fehlende Aufträge werden von der geplanten Zeit abgezogen.",
        "Wählen Sie eine Anlage oder alle, und den Zeitraum.",
      ],
      get: "Verfügbarkeit, Leistung, Qualität und OEE je Anlage, die sechs großen Verluste Tag für Tag, die häufigsten Stoppgründe und der Verlust, den Sie zuerst angehen, mit einer [[Question for the floor]]. Kopieren oder drucken, oder weiter zu 5 Whys, Pareto 80/20 oder der Maßnahmenliste.",
      data: "Die Anlagen und das Protokoll bleiben in diesem Browser und lassen sich als CSV oder Excel herunterladen.",
    },
    "/tools/hotel-kpis/": {
      when: "Jeden Morgen, mit den Zahlen der letzten Nacht aus dem Night Audit oder dem PMS.",
      how: [
        "Tragen Sie die Zimmerzahl und das Budget des Monats ein: Auslastung und ADR, und RevPAR, wenn er nicht einfach das Produkt der beiden ist.",
        "Erfassen Sie jede Nacht: verfügbare und verkaufte Zimmer, Logisumsatz, Anreisen, Abreisen, No-Shows, Walk-ins, Zimmer außer Betrieb, Frühstücksgäste und Beschwerden. Oder fügen Sie den PMS-Export mit [[Import rows]] ein.",
        "Lesen Sie den Monat bis heute gegenüber dem Budget und wo Sie anfangen.",
        "Mit [[Copy the morning report]] nehmen Sie den Bericht in die Besprechung mit.",
      ],
      get: "Auslastung, ADR und RevPAR gegenüber dem Budget, die Prognose für den Monat, das Muster der Wochentage, die beste und die schwächste Nacht und der Umsatz, der durch No-Shows und Zimmer außer Betrieb verloren ging. Die schwächste Kennzahl geht weiter an 5 Whys oder die Maßnahmenliste.",
      data: "Das Protokoll bleibt in diesem Browser und lässt sich als CSV oder Excel herunterladen. Eine doppelt erfasste Nacht behält ihre letzten Zahlen.",
    },
    "/tools/gemba-walk/": {
      when: "Dort, wo die Arbeit gemacht wird: die Teamleitung jeden Tag, die Bereichsleitung jede Woche, die Standortleitung jeden Monat.",
      how: [
        "Wählen Sie ein Layered Process Audit oder einen Verschwendungsrundgang, die Ebene, eine Checkliste für Lager, Hotel oder Zustellstation und den Bereich.",
        "Beantworten Sie vor Ort jede Frage mit Ja, Nein oder n. z., oder tippen Sie für jede Verschwendung, die Sie sehen, auf +. Mit [[Start the timer]] wissen Sie, wie lange der Rundgang gedauert hat.",
        "Klicken Sie auf [[Save walk]] und dann auf [[Add findings to actions]] für jedes Nein, das Sie nicht sofort beheben konnten.",
        "Legen Sie fest, wie oft jede Ebene geht: Die Ergebnisse markieren eine Ebene, die im Verzug ist.",
      ],
      get: "Der Erfüllungsgrad je Woche und Ebene, die am häufigsten verfehlten Fragen und die Bereiche, in denen die Neins liegen, die Verschwendung nach Bereich mit den wenigen wichtigsten, und der nächste Rundgang jeder Ebene. Mit [[Print the walk sheet]] gehen Sie mit Papier.",
      data: "Die Rundgänge bleiben in diesem Browser und lassen sich als CSV oder Excel herunterladen.",
    },
    "/tools/ops-report/": {
      when: "Am Ende der Woche oder des Monats, vor dem Termin mit Ihrer Führungskraft.",
      how: [
        "Wählen Sie den Zeitraum: diese oder letzte Woche, dieser oder letzter Monat, oder zwei Daten.",
        "Prüfen Sie, was der Bericht liest: Jeder Abschnitt erscheint nur, wenn sein Tool Daten für den Zeitraum hat, von Schadenskontrolle, Verspätungsanalyse, OEE und 5S-Audit bis zu Sicherheitskreuz, Hotel-Kennzahlen, Kaizen-Board und Maßnahmenliste.",
        "Tragen Sie Standortnamen und Ziele einmal im Arbeitsplatzprofil ein; ein Ziel, das in einem Protokoll steht, hat Vorrang.",
        "Lesen Sie die Zusammenfassung: das größte Risiko, die Entscheidung, die es braucht, und drei Prioritäten für die nächste Woche, die mit einem Tippen in die Maßnahmenliste gehen.",
      ],
      get: "Sicherheit, Qualität, Lieferung, Anlagen, Arbeitsplatz, Hotel, Verbesserung und Maßnahmen, jeweils gegenüber dem Zeitraum davor und seinem Ziel, als Zahl, Diagramm und Satz. [[Copy as text]] für eine E-Mail, [[Print or save as PDF]] auf A4 oder [[Download Word]].",
      data: "Der Bericht hat keine eigenen Daten: Er liest die anderen Tools in diesem Browser und ändert nichts an ihnen.",
    },
    "/tools/room-inspection/": {
      when: "Nachdem ein Zimmer gereinigt ist und bevor die Rezeption es verkauft, und einmal pro Woche, um zu sehen, wo Coaching nötig ist.",
      how: [
        "Legen Sie die Zimmer einmal an: [[Generate rooms]] aus Etagen und Zimmernummern, oder fügen Sie eine Liste ein, mit Zimmertypen und Team.",
        "Scannen Sie den Code an der Tür oder geben Sie das Zimmer ein, wählen Sie die Checkliste, Standard, Suite, öffentlicher Bereich oder Ihre eigene, und bewerten Sie jeden Punkt Zone für Zone als bestanden, Mangel oder entfällt. Ein kritischer Mangel lässt das Zimmer allein durchfallen.",
        "Markieren Sie die Mängel, dann [[Mark the rest as pass]]. Fügen Sie ein Foto des Mangels hinzu und sagen Sie, ob er eine Nachreinigung oder die Technik braucht.",
        "[[Save inspection]]: Technik-Punkte gehen in die Maßnahmenliste, Nachreinigungen zurück an die Reinigungskraft.",
      ],
      get: "Die Quote der Zimmer, die beim ersten Mal bestehen, je Reinigungskraft, Etage und Zimmertyp, der Wochentrend, die häufigsten Mängel und eine Heatmap der Zonen nach Etage, zum Coachen, nicht zum Beschuldigen. [[Print inspection sheet]] oder [[Print daily summary]], und die Kontrollen als CSV oder Excel herunterladen.",
      data: "Die Kontrollen und Fotos bleiben in diesem Browser. Eine eigene Checkliste lässt sich als Vorlagendatei für die anderen Hotels der Gruppe speichern.",
    },
    "/tools/maintenance-planner/": {
      when: "Einmal pro Woche, um die Arbeit zu planen, und an dem Tag, an dem eine Aufgabe erledigt oder verschoben wird oder eine Anlage ausfällt.",
      how: [
        "[[Add an asset]] mit Kennzeichen, Bereich, Typ und Kritikalität A, B oder C, und übernehmen Sie die typischen Aufgaben ihres Typs. Tragen Sie ein, wann jede Aufgabe zuletzt erledigt wurde.",
        "Geben Sie jeder Aufgabe ihr Intervall in Tagen, Wochen, Monaten oder Jahren oder in Betriebsstunden, je nachdem, was zuerst eintritt. Gesetzliche Prüfungen sind gekennzeichnet: Prüfen Sie die örtlichen Vorschriften.",
        "[[Log work]] am selben Tag: erledigt, verschoben mit Grund, ein Ausfall mit Stillstandszeit und Ursache, oder ein Zählerstand. Scannen Sie das Etikett, um die Anlage zu wählen.",
        "[[Print the work list]] der Woche für das Team, oder laden Sie den Plan als [[Calendar file (.ics)]] herunter.",
      ],
      get: "Was fällig und was überfällig ist, die Erfüllungsquote der vorbeugenden Wartung über 90 Tage, ein Monatskalender, die Quote nach Bereich und Typ, ein Pareto der Stillstandszeit je Anlage, MTBF und MTTR. Überfällige Aufgaben an A-Anlagen und wiederholte Ausfälle gehen in die Maßnahmenliste, die Ursachen an Pareto 80/20, ein einzelner Ausfall an 5 Whys.",
      data: "Plan, Protokoll und Fotos bleiben in diesem Browser und lassen sich als CSV oder Excel herunterladen.",
    },
    "/tools/sigma-control-chart/": {
      when: "Wenn Sie wissen müssen, wie gut ein Prozess ist, und ob ein schlechter Tag eine echte Veränderung oder normales Rauschen ist.",
      how: [
        "Für das Sigma-Niveau: Einheiten, Fehler und Fehlermöglichkeiten pro Einheit.",
        "Für die perfekte Zustellung: pünktlich, unbeschädigt und vollständig, in Prozent.",
        "Für die Regelkarte: was Sie zählen, pro Tag oder pro Woche, und ein Referenzzeitraum.",
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
      get: "Ein Arbeitsblatt, das Sie drucken, als PDF speichern oder als Text kopieren können. Die Protokoll-Tools können ihr Problem direkt hineinschicken, und die Gegenmaßnahme geht mit [[Put the countermeasure on the handover]] oder [[Add the countermeasure to the Action Tracker]] weiter.",
      data: "Das Arbeitsblatt bleibt in diesem Browser.",
    },
    "/tools/fishbone/": {
      when: "Wenn das Team jede mögliche Ursache einer Wirkung sehen muss, bevor es entscheidet, welche es prüft.",
      how: [
        "Schreiben Sie die Wirkung an den Kopf des Fisches, als Tatsache, mit der Zahl, wenn Sie sie haben.",
        "Wählen Sie die Gräten: 6M für Produktion, Lager und Zustellung, 4P für eine Dienstleistung oder die fünf Gräten eines Hotels.",
        "Füllen Sie jede Gräte mit dem Team, bis zu 12 Ursachen, jede mit ihrem Warum.",
        "Zählen Sie die Stimmen und markieren Sie die wahrscheinlichen Ursachen, dann lassen Sie sie mit [[Send likely causes to actions]] vor Ort prüfen.",
      ],
      get: "Der Fisch in einem Bild, die Ursachen nach Stimmen geordnet, und die wichtigste Ursache bereit für 5 Whys oder alle für Pareto 80/20. [[Copy as outline]], auf einer Seite drucken oder als CSV oder Excel herunterladen.",
      data: "Ihre Diagramme bleiben in diesem Browser, in einer Liste, in der Sie sie öffnen, duplizieren oder löschen können.",
    },
    "/tools/fmea/": {
      when: "Bevor ein Prozess anläuft oder sich ändert, oder nach einem Fehler, der nicht wiederkommen darf: Bewerten Sie die Risiken, solange sie noch wenig kosten.",
      how: [
        "Tragen Sie Prozess, Verantwortlichen, Datum und Revision ein und klicken Sie auf [[Fill the steps]] aus einer Vorlage, oder auf [[+ Add a failure mode]].",
        "Schreiben Sie für jeden Schritt, wie er versagen kann, die Folge, die Ursache und die Maßnahmen, die Sie heute haben, um es zu vermeiden und zu entdecken.",
        "Bewerten Sie Bedeutung, Auftreten und Entdeckung von 1 bis 10. Lesen Sie zuerst die Aufgabenpriorität, dann die RPZ.",
        "Geben Sie jeder Zeile mit hoher oder mittlerer Priorität eine Maßnahme mit Verantwortlichem, und bewerten Sie die Zeile neu, wenn die Maßnahme erledigt ist.",
      ],
      get: "Die Aufgabenpriorität (AIAG-VDA) und die RPZ jeder Zeile, eine Heatmap von Bedeutung gegen Auftreten, die zehn größten Risiken und die RPZ vor und nach den Maßnahmen. [[Add open actions to the Action Tracker]], auf A3 oder A4 drucken oder als CSV oder Excel herunterladen.",
      data: "Das Blatt bleibt in diesem Browser. [[Save the sheet (.json)]] sichert eine Kopie, die Sie auf einem anderen Gerät wieder öffnen können.",
    },
    "/tools/process-lab/": {
      when: "Wenn Sie einen Prozess messen, Minuten, Gewichte oder Fehler, und wissen müssen, ob er stabil ist, ob er fähig ist oder ob er sich wirklich verändert hat.",
      how: [
        "Fügen Sie die Messwerte ein, ein Datum und einen Wert pro Zeile oder Gruppen, und sagen Sie, was gemessen wird. Das Tool wählt die Karte: I-MR, Xbar-R, Xbar-S, p, np, c oder u.",
        "Ergänzen Sie die Spezifikationsgrenzen und ein Ziel, und das Datum, an dem eine Änderung begann, damit die Grenzen davor und danach getrennt werden.",
        "Unter [[Before / after]] vergleichen Sie zwei Quoten oder zwei Messreihen; unter [[How many to measure]] finden Sie den nötigen Stichprobenumfang.",
        "Für Ursachen und Messmittel: [[Chi-square]] einer Tabelle von Zählungen, [[Regression]] von x und y, und das [[Measurement system]]: Prüferübereinstimmung und Gage R&R.",
      ],
      get: "Die Regelkarte mit den Nelson-Regeln, das Histogramm gegen die Spezifikation, Cp, Cpk und PPM, ein Streudiagramm mit Ausgleichsgerade, Fleiss' Kappa und der Anteil der Streuung, der vom Messmittel kommt, jede Zahl mit einem Satz, der sagt, was sie bedeutet. [[Add the signal to actions]], oder als CSV oder Excel herunterladen.",
      data: "Ihre Zahlen bleiben in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/time-study/": {
      when: "An der Linie, mit der Stoppuhr, bevor Sie die Arbeit neu austakten oder den Standard schreiben.",
      how: [
        "Tragen Sie den Bedarf und die verfügbaren Minuten pro Schicht ein: Das Tool errechnet den Takt.",
        "Legen Sie die Stationen in der Reihenfolge des Flusses an, jede mit ihren Elementen, markiert als VA, NVA oder W.",
        "Klicken Sie auf [[Start timing]] und am Ende jedes Elements auf [[Lap]] oder die Leertaste. Messen Sie mindestens drei Zyklen pro Station, besser fünf.",
        "Lesen Sie den Yamazumi gegen den Takt und die Verlagerungen zur Austaktung.",
      ],
      get: "Die Standardzeit jedes Elements mit ihrer Streuung, ein Yamazumi jeder Station gegen den Takt, wie viel der Zeit Verschwendung ist, der Engpass und das erste Element, das Sie verlagern. [[Add the balance moves as actions]], oder die Standardzeiten als CSV oder Excel herunterladen.",
      data: "Die Stationen und die Zeiten bleiben in diesem Browser. Zeiten lassen sich auch eintippen oder einfügen.",
    },
    "/tools/value-stream-map/": {
      when: "Wenn die Durchlaufzeit lang ist und Sie sehen müssen, wo sie bleibt, vom Lieferanten bis zum Kunden.",
      how: [
        "Benennen Sie die Produkt- oder Dienstleistungsfamilie, den Kundenbedarf pro Tag und die Arbeitsminuten.",
        "Klicken Sie auf [[Fill the steps]] aus einer Vorlage, oder legen Sie die Schritte selbst an: Zykluszeit, Rüstzeit, Verfügbarkeit, Ausbeute und Mitarbeitende.",
        "Gehen Sie den Strom ab und zählen Sie die Teile, die vor jedem Schritt warten: Das Tool rechnet sie in Zeit um.",
        "Wechseln Sie zum [[Future state]], ändern Sie, was die Verbesserungen ändern, und schreiben Sie jede Änderung als Kaizen-Blitz.",
      ],
      get: "Die Karte mit der Zeitleiter der Durchlaufzeit, dem Anteil der Durchlaufzeit, der Arbeit ist, dem Takt und den Schritten darüber, im Ist- und im Soll-Zustand. [[Send kaizen bursts to the Action Tracker]], oder als CSV oder Excel herunterladen.",
      data: "Die Karte bleibt in diesem Browser. Nichts wird gesendet oder hochgeladen.",
    },
    "/tools/standard-work/": {
      when: "Wenn eine Arbeit in jeder Schicht gleich gemacht werden muss und eine neue Person sie lernen können soll.",
      how: [
        "Beginnen Sie mit einer Vorlage über [[Use this template]], oder beschreiben Sie die Arbeit: Titel, Prozess, Bereich, Verantwortlicher, Takt oder Zielzeit, PSA und Arbeitsmittel.",
        "Schreiben Sie die Hauptschritte der Reihe nach auf, jeden in wenigen Worten, mit seiner Zeit.",
        "Ergänzen Sie die Kernpunkte, an denen jeder Schritt gelingt oder scheitert, markiert als Sicherheit, Qualität, Technik oder Kosten, jeden mit seinem Grund.",
        "Lesen Sie die [[Quality check]]. Wenn sich die Arbeit ändert, beginnen Sie eine [[New version]] und schreiben auf, was sich geändert hat.",
      ],
      get: "Eine Arbeitszerlegung mit der Zeit je Schritt gegen den Takt und dem Änderungsverlauf, zum Drucken, zum Kopieren als Text oder über [[Download Word]]. [[Train the team on it]] nimmt die Schulung in die Maßnahmenliste auf; [[Audit this standard]] öffnet das 5S-Audit.",
      data: "Jeder Standard wird beim Tippen in diesem Browser gespeichert, in einer Liste, in der Sie ihn öffnen, duplizieren oder löschen können.",
    },
    "/tools/spaghetti-diagram/": {
      when: "Wenn eine Arbeit zu viel Laufen kostet, Kommissionieren, Packen oder ein Zimmer herrichten, und vor und nach einer Änderung des Layouts.",
      how: [
        "Benennen Sie die Arbeit, laden Sie dann ein Foto des Grundrisses oder nehmen Sie das einfache Raster. [[Set the scale]], indem Sie zwei Punkte antippen, deren echten Abstand Sie kennen.",
        "Folgen Sie der Arbeit, nicht der Person: [[+ New walk]], dann tippen Sie jede Richtungsänderung an. Benennen Sie einen Halt, bevor Sie ihn antippen; ein Tippen nahe einem Halt zählt als weiterer Besuch. [[Finish the walk]].",
        "Zeichnen Sie drei bis sechs Zyklen derselben Arbeit und geben Sie die Zyklen pro Schicht und die Gehgeschwindigkeit an.",
        "Setzen Sie die Änderung um und gehen Sie die Arbeit unter [[After the change]] noch einmal ab.",
      ],
      get: "Die Meter pro Zyklus und pro Schicht, die Gehminuten, die meistbesuchten Halte, die längste wiederholte Strecke, ein Wärmeraster und die Ersparnis nach der Änderung. [[Take to the Kaizen Board]], [[Time it with the Time Study]] oder [[Add the change to the actions]], und die Punkte als CSV oder Excel herunterladen.",
      data: "Das Bild des Grundrisses und die Wege bleiben auf diesem Gerät. Nichts wird hochgeladen.",
    },
    "/tools/project-portfolio/": {
      when: "Einmal pro Woche für jede Verbesserung, die als DMAIC-Projekt läuft, und bei jedem Tollgate mit dem Sponsor.",
      how: [
        "[[+ New project]] mit seinem Projektauftrag: das Problem als Zahl, das Ziel, der Umfang, die Leitung, der Sponsor und die Termine.",
        "Füllen Sie die Arbeitsblätter seiner Phase aus: SIPOC, CTQ-Baum, RACI und Kano in Define; Fehler, Einheiten, Fehlermöglichkeiten, RTY und COPQ in Measure und Analyze; den Kontrollplan in Control.",
        "Haken Sie am Ende jeder Phase die Checkliste des Tollgates ab und [[Close this tollgate]] mit Namen und Datum des Sponsors, oder schließen Sie es mit einer schriftlichen Begründung.",
        "Tragen Sie die harten Einsparungen nach Monat ein, sobald das Controlling sie bestätigt; weiche Einsparungen bleiben eine Schätzung.",
      ],
      get: "Jedes Projekt auf einer Seite: Phase, Status, Tage in der Phase, das nächste Tollgate, Sigma vorher und nachher und geplante gegenüber realisierten Einsparungen. [[Control plan to the Action Tracker]] gibt jede Kontrolle an ihren Verantwortlichen; [[Print this project]] oder [[Download Word]].",
      data: "Das Portfolio bleibt in diesem Browser und lässt sich als CSV oder Excel herunterladen.",
    },
    "/tools/six-sigma-dmaic/": {
      when: "Wenn eine Verbesserung ein Projekt ist und keine schnelle Lösung.",
      how: [
        "Gehen Sie durch Define, Measure, Analyse, Improve und Control. Jeder Schritt hat sein Ergebnis, Kernideen, häufige Fehler, einen echten Fall, die Tools, die dazugehören, und [[Check yourself]].",
        "Lesen Sie die acht Verschwendungsarten und das Glossar.",
        "Füllen Sie den Projektauftrag aus, oder klicken Sie auf [[Fill with the course case]], um ein Beispiel zu sehen.",
      ],
      get: "Ein DMAIC-Projektauftrag, den Sie drucken, als PDF speichern oder als Text kopieren können. Sind alle Antworten richtig, stellt der Kurs ein Abschlusszertifikat mit Ihrem Namen aus: [[Print the certificate]].",
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
        "Beginnen Sie mit einer PDF- oder Word-Datei, mit dem Lebenslauf-Generator oder mit eingefügtem Text, und klicken Sie auf [[Sort it into the fields]].",
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
        "Beantworten Sie ein paar Fragen, von der Stelle bis zum Eintrittsdatum, und klicken Sie auf [[Write the first draft]]. Danach bearbeiten und unterschreiben Sie es und lesen den Anschreiben-Check.",
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

// What changed in each edition, newest first; an earlier edition is kept as its printed PDF.
const editions = [
  {
    number: 4,
    date: { en: "24 October 2026", sq: "24 tetor 2026", de: "24. Oktober 2026" },
    changes: {
      en: [
        "Six new tools, each with its page in this guide: Lost & Found, Operations Report, Room Inspection, Maintenance Planner, Spaghetti Diagram and Project Portfolio.",
        "Charts you work with: tap a cause to filter a log, read its trend by day, week or month against the period before, and mark a change on the timeline: it shows on every trend, and the control chart splits its limits there.",
        "Process Lab picks the control chart from what you measure (I-MR, Xbar-R, Xbar-S, p, np, c, u) and adds chi-square, regression, attribute agreement and Gage R&R.",
        "The 5S Audit keeps photos before and after, and its audit plan shares the areas among the auditors in turn, with a calendar file; the Safety Cross keeps photos as evidence, on the device only.",
        "The 5S Audit, Gemba Walk, Standard Work, Skills Matrix and FMEA save a checklist or a standard as a template file that another site opens.",
        "A paste from another export is matched to the log's columns once and remembered, and a code can be scanned into a field with the camera.",
        "Restore points: the browser keeps your work once a day and before a file replaces it. Team sync, if you turn it on, shares the tools you choose with your team, encrypted on the device.",
        "Six Sigma in the Warehouse gives a certificate of completion once every answer is right.",
      ],
      sq: [
        "Gjashtë mjete të reja, secili me faqen e vet në këtë udhëzues: Sendet e gjetura, Raporti i operacioneve, Inspektimi i dhomës, Planifikuesi i mirëmbajtjes, Diagrami spageti dhe Portofoli i projekteve.",
        "Grafikë me të cilët punon: prek një shkak për të filtruar një regjistër, lexo trendin sipas ditës, javës ose muajit kundrejt periudhës së mëparshme, dhe shëno një ndryshim në vijën e kohës: shfaqet në çdo trend, dhe karta e kontrollit i ndan kufijtë aty.",
        "Laboratori i procesit e zgjedh kartën e kontrollit sipas asaj që mat (I-MR, Xbar-R, Xbar-S, p, np, c, u) dhe shton chi-katrorin, regresionin, përputhjen e vlerësimeve dhe Gage R&R.",
        "Auditi 5S mban foto para dhe pas, dhe plani i auditeve i ndan zonat mes audituesve me radhë, me një skedar kalendari; Kryqi i sigurisë mban foto si dëshmi, vetëm në pajisje.",
        "Auditi 5S, Gemba Walk, Puna standarde, Matrica e aftësive dhe FMEA e ruajnë një listë kontrolli ose një standard si skedar modeli që e hap një objekt tjetër.",
        "Të dhënat e ngjitura nga një eksport tjetër përputhen një herë me kolonat e regjistrit dhe kjo mbahet mend, dhe një kod mund të skanohet në një fushë me kamerën.",
        "Pikat e rikthimit: shfletuesi e ruan punën një herë në ditë dhe para se një skedar ta zëvendësojë. Sinkronizimi i ekipit, nëse e ndez, i ndan mjetet që zgjedh me ekipin, të kriptuara në pajisje.",
        "Six Sigma në magazinë jep një certifikatë përfundimi sapo çdo përgjigje është e saktë.",
      ],
      de: [
        "Sechs neue Tools, jedes mit seiner Seite in diesem Leitfaden: Fundsachen, Betriebsbericht, Zimmerkontrolle, Wartungsplaner, Spaghetti-Diagramm und Projektportfolio.",
        "Diagramme, mit denen Sie arbeiten: Tippen Sie auf eine Ursache, um ein Protokoll zu filtern, lesen Sie den Trend nach Tag, Woche oder Monat gegenüber dem Zeitraum davor, und markieren Sie eine Änderung auf der Zeitachse: Sie erscheint in jedem Trend, und die Regelkarte trennt dort ihre Grenzen.",
        "Das Prozesslabor wählt die Regelkarte nach dem, was Sie messen (I-MR, Xbar-R, Xbar-S, p, np, c, u), und ergänzt Chi-Quadrat, Regression, Prüferübereinstimmung und Gage R&R.",
        "Das 5S-Audit hält Fotos vorher und nachher fest, und sein Auditplan verteilt die Bereiche reihum auf die Auditoren, mit Kalenderdatei; das Sicherheitskreuz hält Fotos als Nachweis fest, nur auf dem Gerät.",
        "5S-Audit, Gemba Walk, Standardarbeit, Qualifikationsmatrix und FMEA speichern eine Checkliste oder einen Standard als Vorlagendatei, die ein anderer Standort öffnet.",
        "Eingefügte Daten aus einem anderen Export werden einmal den Spalten des Protokolls zugeordnet, und die Zuordnung bleibt gespeichert; ein Code lässt sich mit der Kamera in ein Feld scannen.",
        "Wiederherstellungspunkte: Der Browser sichert Ihre Arbeit einmal am Tag und bevor eine Datei sie ersetzt. Die Team-Synchronisierung teilt, wenn Sie sie einschalten, die gewählten Tools mit Ihrem Team, verschlüsselt auf dem Gerät.",
        "Six Sigma im Lager stellt ein Abschlusszertifikat aus, sobald jede Antwort richtig ist.",
      ],
    },
  },
  {
    number: 3,
    date: { en: "24 October 2026", sq: "24 tetor 2026", de: "24. Oktober 2026" },
    pdf: (lang) => `/media/guides/tools-guide/editions/tools-guide-3-${lang}.pdf`,
    changes: {
      en: [
        "Seventeen new tools, each with its page in this guide: the Night Audit Log, and sixteen tools made as one daily system: Action Tracker, Daily Board, 5S Audit, Safety Cross, A3 Report, Kaizen Board, Skills Matrix, OEE, Hotel KPIs, Gemba Walk, Fishbone, FMEA, Process Lab, Time Study, Value Stream Map and Standard Work.",
        "One list of actions: the logs, the control chart, Pareto 80/20, 5 Whys, the Shift Handover, the KPI Diagnostic and the CX Control Tower send what is to be done to the Action Tracker.",
        "One workplace profile: Damage Control, Incomplete Control, the Night Audit Log and the Delay Analyzer offer its shifts and use its target when their own box is empty.",
        "Shift Pulse also shows the Safety Cross, OEE, the open actions and the latest 5S audit, once those tools hold data in this browser.",
        "5 Whys puts its countermeasure on the Shift Handover, an issue carried three shifts leads to 5 Whys, the KPI Diagnostic takes its result to 5 Whys, and the hotel handover takes its no-shows from the Night Audit Log.",
        "Every log that downloads a CSV also downloads an Excel file.",
        "A tool opened once opens again without a connection, and the site can be installed as an app.",
        "Six Sigma in the Warehouse names, in each step, the tools that belong to it.",
      ],
      sq: [
        "Shtatëmbëdhjetë mjete të reja, secili me faqen e vet në këtë udhëzues: Regjistri i Night Audit dhe gjashtëmbëdhjetë mjete të ndërtuara si një sistem i vetëm për çdo ditë: Lista e veprimeve, Tabela e ditës, Auditi 5S, Kryqi i sigurisë, Raporti A3, Tabela Kaizen, Matrica e aftësive, OEE, KPI-të e hotelit, Gemba Walk, Kurrizi i peshkut, FMEA, Laboratori i procesit, Studimi i kohës, Harta e rrjedhës së vlerës dhe Puna standarde.",
        "Një listë e vetme veprimesh: regjistrat, karta e kontrollit, Pareto 80/20, 5 Whys, Dorëzimi i turnit, Diagnostikimi i KPI-së dhe CX Control Tower e dërgojnë atë që duhet bërë te Lista e veprimeve.",
        "Një profil i vetëm i vendit të punës: Kontrolli i dëmeve, Kontrolli i plotësisë, Regjistri i Night Audit dhe Analiza e vonesave ofrojnë turnet e tij dhe përdorin objektivin e tij kur fusha e tyre është bosh.",
        "Shift Pulse tregon edhe Kryqin e sigurisë, OEE-në, veprimet e hapura dhe auditin e fundit 5S, sapo këto mjete kanë të dhëna në këtë shfletues.",
        "5 Whys e vendos kundërmasën e vet në Dorëzimin e turnit, një çështje e mbartur tre turne të çon te 5 Whys, Diagnostikimi i KPI-së e çon rezultatin te 5 Whys, dhe dorëzimi i hotelit i merr rastet no-show nga Regjistri i Night Audit.",
        "Çdo regjistër që shkarkohet si CSV shkarkohet edhe si skedar Excel.",
        "Një mjet i hapur një herë hapet përsëri edhe pa lidhje, dhe faqja mund të instalohet si aplikacion.",
        "Six Sigma në magazinë emërton, në çdo hap, mjetet që i përkasin.",
      ],
      de: [
        "Siebzehn neue Tools, jedes mit seiner Seite in diesem Leitfaden: das Night-Audit-Protokoll und sechzehn Tools, die als ein System für den Alltag gebaut sind: Maßnahmenliste, Tagesboard, 5S-Audit, Sicherheitskreuz, A3-Report, Kaizen-Board, Qualifikationsmatrix, OEE, Hotel-Kennzahlen, Gemba Walk, Fischgräte, FMEA, Prozesslabor, Zeitstudie, Wertstromanalyse und Standardarbeit.",
        "Eine Liste für alle Maßnahmen: Die Protokolle, die Regelkarte, Pareto 80/20, 5 Whys, die Schichtübergabe, die KPI-Diagnose und der CX Control Tower geben, was zu tun ist, an die Maßnahmenliste weiter.",
        "Ein Arbeitsplatzprofil: Schadenskontrolle, Vollständigkeitskontrolle, das Night-Audit-Protokoll und die Verspätungsanalyse bieten seine Schichten an und nutzen sein Ziel, wenn ihr eigenes Feld leer ist.",
        "Shift Pulse zeigt auch das Sicherheitskreuz, die OEE, die offenen Maßnahmen und das letzte 5S-Audit, sobald diese Tools Daten in diesem Browser haben.",
        "5 Whys nimmt seine Gegenmaßnahme in die Schichtübergabe auf, ein Punkt, der drei Schichten lang weitergegeben wurde, führt zu 5 Whys, die KPI-Diagnose gibt ihr Ergebnis an 5 Whys weiter, und die Hotel-Übergabe übernimmt die No-Shows aus dem Night-Audit-Protokoll.",
        "Jedes Protokoll, das sich als CSV herunterladen lässt, lässt sich auch als Excel-Datei herunterladen.",
        "Ein Tool, das Sie einmal geöffnet haben, öffnet sich auch ohne Verbindung wieder, und die Website lässt sich als App installieren.",
        "Six Sigma im Lager nennt in jedem Schritt die Tools, die dazugehören.",
      ],
    },
  },
  {
    number: 2,
    date: { en: "14 October 2026", sq: "14 tetor 2026", de: "14. Oktober 2026" },
    pdf: (lang) => `/media/guides/tools-guide/editions/tools-guide-2-${lang}.pdf`,
    changes: {
      en: [
        "Sigma & Control Chart: an example is shown, never saved, and days sent from another tool replace an example still on the chart instead of joining it.",
        "Shift Pulse and Shift Handover: a route log that holds only some routes of the period gives the count of late routes, not a share; Shift Pulse flags a number only beyond the control-chart limit of its usual level.",
        "Damage Control and Incomplete Control: a typed total counts only for the period it was typed for, so another period is no longer divided by it.",
        "CX Control Tower: no target is set until you enter it.",
        "KPI Diagnostic: when the answers are too even, it names no cause and sends you to see the work.",
        "ATS CV: a keyword counts only where its word starts, and a short one only where it ends too: “lean” is no longer found in “cleaning”, nor “Excel” in “excellent”. A long word may still run on, as German compounds do.",
        "5 Whys and Six Sigma DMAIC: the print shows the whole text of every field.",
      ],
      sq: [
        "Sigma dhe karta e kontrollit: një shembull shfaqet, por nuk ruhet kurrë, dhe ditët e dërguara nga një mjet tjetër zëvendësojnë shembullin që është ende në kartë, në vend që t'i bashkohen.",
        "Shift Pulse dhe Dorëzimi i turnit: një regjistër që mban vetëm disa nga linjat e periudhës jep numrin e linjave me vonesë, jo një përqindje; Shift Pulse e shënon një shifër vetëm përtej kufirit të kartës së kontrollit për nivelin e saj të zakonshëm.",
        "Kontrolli i dëmeve dhe Kontrolli i plotësisë: një total i shkruar vlen vetëm për periudhën për të cilën u shkrua, kështu që një periudhë tjetër nuk pjesëtohet më me të.",
        "CX Control Tower: asnjë objektiv nuk vendoset derisa ta shkruash ti.",
        "Diagnostikimi i KPI-së: kur përgjigjet janë shumë të barabarta, nuk emërton asnjë shkak dhe të dërgon të shohësh punën.",
        "CV për ATS: një fjalë kyçe numërohet vetëm aty ku nis fjala e saj, dhe një e shkurtër vetëm aty ku edhe mbaron: “lean” nuk gjendet më te “cleaning”, as “Excel” te “excellent”. Një fjalë e gjatë mund të vazhdojë, si fjalët e përbëra gjermane.",
        "5 Whys dhe Six Sigma në magazinë: printimi tregon tekstin e plotë të çdo fushe.",
      ],
      de: [
        "Sigma & Regelkarte: Ein Beispiel wird gezeigt, aber nie gespeichert, und Tage aus einem anderen Tool ersetzen ein Beispiel, das noch auf der Regelkarte steht, statt zu ihm hinzugefügt zu werden.",
        "Shift Pulse und Schichtübergabe: Ein Tourenprotokoll, das nur einen Teil der Touren des Zeitraums enthält, ergibt die Zahl der verspäteten Touren, keinen Anteil; Shift Pulse markiert eine Zahl nur jenseits der Grenze der Regelkarte für ihr übliches Niveau.",
        "Schadenskontrolle und Vollständigkeitskontrolle: Eine eingetragene Gesamtzahl gilt nur für den Zeitraum, für den sie eingetragen wurde; ein anderer Zeitraum wird nicht mehr durch sie geteilt.",
        "CX Control Tower: Ein Ziel ist erst gesetzt, wenn Sie es eintragen.",
        "KPI-Diagnose: Sind die Antworten zu gleichmäßig, nennt sie keine Ursache und rät Ihnen, sich die Arbeit vor Ort anzusehen.",
        "ATS-Lebenslauf: Ein Schlüsselwort zählt nur dort, wo sein Wort beginnt, ein kurzes nur, wo es auch endet: „lean“ steckt nicht mehr in „cleaning“, „Excel“ nicht in „excellent“. Ein langes Wort darf weiterlaufen, wie deutsche Komposita.",
        "5 Whys und Six Sigma im Lager: Der Ausdruck zeigt den vollständigen Text jedes Felds.",
      ],
    },
  },
  { number: 1, date: { en: "October 2026", sq: "tetor 2026", de: "Oktober 2026" }, pdf: (lang) => `/media/guides/tools-guide/editions/tools-guide-1-${lang}.pdf` },
];

export default {
  slug: "tools-guide",
  edition: EDITION,
  editionDate: EDITION_DATE,
  editions: editions.map(({ pdf, ...edition }) => ({ ...edition, ...(pdf ? { pdf: Object.fromEntries(["en", "sq", "de"].map((lang) => [lang, pdf(lang)])) } : {}) })),
  langs: ["en", "sq", "de"],
  pages,
  family,
  familyOfTool,
  tool,
  // The tools of every role, without the course: thirty-six, as the cover says.
  toolCount: families.reduce((count, item) => count + item.tools.length, 0),
  pageOf: Object.fromEntries(pages.map((id) => [id, pageOf(id)])),
  system,
  en,
  sq,
  de,
};
