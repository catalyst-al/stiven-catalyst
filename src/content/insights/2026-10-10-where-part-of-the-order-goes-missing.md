---
title: 'Where part of the order goes missing'
date: 2026-10-10T15:00:00Z
category: Operations
series: improvement
status: published
featured: true
summary: An order can reach the customer incomplete, but the problem may have started long before the delivery.
teaser: 'When a bag was missing, the rule was clear: the driver told the Team Leader, and the trolley did not leave its zone until the problem was solved.'
description: "Incomplete as a last-mile KPI: the rule when a bag was missing, why an incomplete order has a history before the door, and a check before departure."
deck: 'The second essay in the series “Improvement that holds”: Incomplete as a last-mile KPI, the rule when a bag was missing, why an incomplete order has a history before the customer''s door, and a five-point check before departure.'
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/incomplete-control/
  - /tools/pareto/
checklist:
  title: The check before departure
  copy: Copy the checklist
  note: What I would recommend today.
  items:
    - Every bag can be identified and is linked to its order.
    - The number of bags matches what has to be loaded.
    - The trolley has been checked for mixed loads.
    - If a bag is missing, the process stops for that problem and the Team Leader is told.
    - Every shortage found before departure is recorded with its cause, when it is known.
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - defects
  - root-cause
  - the-system-says
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Before departure, check that the number of bags matches and that no trolley is mixed.
  - When a bag is missing, stop that trolley and tell the Team Leader. Do not let it leave as if everything were fine.
  - Record every shortage found at the ramp with its cause. That is where Incomplete starts.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: check-before-departure
---

The rule for a missing bag had three parts. The driver had to tell the Team Leader. The trolley had to stay inside its designated zone until the problem was solved. And chilled and frozen products had to be scanned inside their temperature-controlled zones.

That rule says something the report does not: a missing bag is often found at the ramp, during loading, long before the order reaches the customer.

In [How we worked with damage](/insights/how-we-worked-with-damage/) I wrote that a percentage has no address. The same is true of Incomplete, with one important difference: here there is a moment when the problem can still be stopped.

I understood Incomplete as an order that did not reach the customer complete; the official formula I never knew. The reports give me these figures: in April 2025, Incomplete was 1.18% against a 0.8% target, and in a June 2025 report it was 0.63%, with 13 cases. They do not say which measures brought the change, so I do not claim it as the result of my work.

## What we found in the warehouse

I can confirm two problems: bags that were missing, and trolleys that were mixed or wrongly organised, though I have no case on record traced from the driver back to the warehouse. We did have trouble with how loads were prepared and organised.

Neither problem starts at the customer's door. A missing bag went missing somewhere earlier: in preparation, on the trolley or during loading. A mixed trolley was organised badly before it reached the driver. Yet if nobody stops them, both end up on the same line of the report: an order that reached the customer incomplete.

## Why the rule made sense

As I see it today, each part of the rule protects something.

Telling the Team Leader turns the shortage into a problem of the operation. The driver is the one who sees it, but finding the bag, or deciding what happens to the order, does not depend on the driver alone.

A trolley that stays in its zone keeps the trace. If it starts moving while the bag is being looked for, things can get more mixed up than they were, and the question “where did it go missing?” becomes harder to answer.

And the rule for chilled and frozen shows that a standard says not only what is done, but also where. When a problem is solved in a hurry, the place is the first thing people forget.

{diagram}

## Not just a number, not just the driver

We followed Incomplete as a KPI in the operational reports. Like any KPI, it can be read in two ways.

The first reading treats it as a negative number to bring down, with a driver's name next to every case. That reading is quick, but it leaves the most important question unanswered.

The second:

**Incomplete should not be seen only as a negative number or a driver's mistake. It should help us understand where the product or the information went missing, and how we can stop it happening again.**

This is where Incomplete differs from damage. Damage has already happened by the time it is found. A missing bag found at the ramp is still only a shortage; it has not yet become an incomplete order at the customer's door. That makes the time before departure the moment when a check is worth most.

## The check before departure

Today I would recommend a clear check before the van leaves. Five points:

1. **Every bag can be identified** and is linked to its order.
2. **The number of bags matches** what has to be loaded.
3. **The trolley has been checked** for mixed loads.
4. **If a bag is missing, the process stops** for that problem and the Team Leader is told.
5. **Every shortage found before departure is recorded** with its cause, when it is known.

The fifth point is the easiest to forget. A shortage found and fixed before departure never appears in the Incomplete report. That is good for the customer. But if it is not written down anywhere, the process learns nothing from it, and tomorrow someone else will find the same shortage again, with a bit of luck.

[Incomplete Control](/tools/incomplete-control/) records each case with the stage of the process where it started and the reason, and shows where cases start most often. You can tick off the list below and copy it for the shift.

**The best check is not the one that counts incomplete orders. It is the one that stops them before they leave.**

At the customer's door, a missing bag is a complaint. At the ramp, it is still a question.
