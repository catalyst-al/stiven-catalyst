---
title: KPIs do not improve in Excel
date: 2026-10-02T06:00:00Z
category: Operations
status: published
featured: true
summary: In Excel, an incomplete order is a number. On the ramp it is a physical object in the wrong place.
teaser: The dashboard said “incomplete delivery”. The floor made you ask whether the mistake happened at the customer's door or already in the warehouse.
deck: 'The third essay in the series “Ten years close to the work”: why you have to go where the process happens before you demand a result from a table.'
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/damage-control/
  - /tools/incomplete-control/
  - /tools/shift-pulse/
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - red-number
  - defects
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Take one red number from today's report and go to the place where it is made.
  - For one case, find the last point where the bag, the trolley or the time was still right.
  - "Write the case down in the same structure as the last one: incident, cause, action, follow-up."
checklist:
  title: One case, from the table to the ramp
  fill: true
  items:
    - label: Which number brought me here?
      hint: The KPI and its value, from today's report.
    - label: Where was everything last in order?
      hint: "The bag, the trolley, the route, the scan: the last point that was right."
    - label: Who noticed the problem, and when?
      hint: The driver, the dispatcher, the customer, the audit.
    - label: What did the floor show that the table did not?
      hint: A mixed trolley, a wrong label, a wait at loading, an open gate.
    - label: Where in the process did it start?
      hint: Warehouse, loading, departure, road, door.
    - label: What do we check tomorrow?
      hint: One check, one owner, one time.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: table-to-ramp
---

The report showed something simple: the customer had not received the full order. Incomplete. Look only at the KPI, and the first thought comes by itself: the driver forgot a bag during delivery.

Check the physical process, though, and the picture changes.

In one of the cases we documented, a bag from one section of the warehouse was missing. In others, the bags showed as scanned, but the wrong bag had been picked up or delivered. We also found mixed trolleys in the warehouse, and even a full trolley missing from the normal loading flow.

The dashboard said “incomplete delivery”. The floor raised a different question: was it the driver's mistake at the customer's door, or had the order left the warehouse incomplete? That question is the whole difference between a table and an operation.

{diagram}

The table can tell you: incomplete = 1. It cannot tell you what may have happened physically: the bag was prepared and entered the process, was perhaps even scanned, and then went into the wrong trolley or onto the wrong route. In Excel, a mistake is a number. On the ramp, it has an address, and that address does not always make it onto the dashboard.

When I wanted to understand an operational problem, I left the table and went where the process was happening, which mostly meant the ramp and the loading area.

There you saw what does not exist in Excel: whether the trolleys were organised by route or mixed, whether bags were missing, whether the labels were correct and the drivers were scanning as they should. You saw whether dry, chilled and frozen followed the right process, whether equipment or trolleys were blocking the area, and whether the gates, the parking and the loading area were organised. Above all, you saw whether a problem that would later show up as a KPI had started right there.

Chilled and frozen had their own rules. Chilled products had to be scanned inside the cold area, frozen inside theirs. If a bag was missing, the problem had to be reported, and the trolley was not to go out as if everything was fine. A rule like that looks small on paper. On the ramp it is the difference between a problem caught in time and a customer who receives an incomplete order.

We also had ramp audits and direct checks of the process. But the floor is not only a place to look. It is a place to reconstruct what happened.

When a bag was missing, the questions were simple. Where was it last seen? Was it in the trolley? Had it been scanned? Was anything missing before departure? Who noticed the problem? Were the route and the trolley right? Had there been a wait or a problem during loading?

Delays worked the same way. We checked the reasons drivers gave: when a driver reported traffic, parking or a traffic light, we had to see whether that matched reality. In some cases we had photos or screenshots of the situation on the road.

What I learned is that a single version is not enough, neither the table's nor one person's. You have to connect what the driver or the dispatcher says with what actually happened in the process.

And what you see has to be written down, otherwise tomorrow it is only a memory. I wrote structured daily reports for the operation, adding each case in the same structure as the one before. Specific cases went into written operational communication, with a description of the incident and its cause. Photos and screenshots documented real situations when they were needed: traffic or parking on the road, and physical problems on the ramp such as disorganised trolleys, boxes or trolleys in the wrong place, open gates or a badly organised loading area.

Over time the checks became much more structured: each trolley matched to its route, checks of dry, chilled and frozen, ramp audits, analysis with Pareto and 5 Why. Pre-scanning and final completeness checks I recommended; I cannot say they were put in place. Later I also worked with more organised structures, in which every case carried the incident, the action, the cause and the KPI follow-up. All of it grew out of what could be seen on the ramp.

The table still has its value: without it you would not even know you had to go to the ramp. But the table is the starting point, not the answer. Treat the number as the answer, and you punish the driver for a bag that was never in his trolley.
