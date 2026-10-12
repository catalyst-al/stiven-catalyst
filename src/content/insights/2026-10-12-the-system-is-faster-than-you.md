---
title: The system is faster than you
date: 2026-10-12T16:00:00Z
category: Operations
series: the-system
status: published
featured: true
summary: "The system decides first. The scan confirms the bag, the plan assigns the tour, the dashboard turns red, all before the person on shift has seen anything. What is left for that person is the part the system was never told, and the name that answers for it."
teaser: The system decides first. The name on the shift is still yours.
description: "Why the systems in every shift, the scanner, the planning, the PMS, the dashboard, are faster than the people next to them and still need them: what the system knows and what it was never told, three ways a shift lead gets it wrong, three questions for every decision the system takes, and a card for who decides what."
deck: "The first essay in the series “The system is faster than you”: what the systems in every shift know and what they were never told, three ways a shift lead gets it wrong, three questions for every decision the system takes, and a card for who decides what in your shift."
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/kpi-diagnostic/
  - /tools/shift-pulse/
checklist:
  title: Who decides what
  fill: true
  note: "One row for each decision the system takes in your shift. Fill it in once, then correct it on the day the system is wrong."
  items:
    - label: "Which decision does the system take in my shift?"
      hint: "The tour, the order of the stops, the room, the priority, the alarm. One per card."
    - label: "What does the system know when it takes it?"
      hint: "Addresses, times, stock, the scans so far. Only what someone typed or scanned."
    - label: "What does it not know?"
      hint: "The shop that opens at ten, the broken gate, yesterday's complaint. What the floor knows and never told it."
    - label: "How do I notice when it is wrong?"
      hint: "A call from the driver, a number that does not fit, a look at the trolley. If there is no answer, there is no control."
    - label: "Which correction do I make by hand every day?"
      hint: "The same change, in the same place, for weeks: a system fault nobody has reported yet."
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - the-system-says
  - root-cause
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - "Before the shift, one sentence: which decision the system takes today and which one you take."
  - "Within the first hour, go and look at one decision the system took. Not to change it, to understand it."
  - "At the end of the shift, write down the one case where the system was wrong and what gave it away."
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: decision-split
---

The system decides first. The name on the shift is still yours.

Every shift I have worked had a system in it that was faster than me. The till in the shop. The scanner and the planning in last mile. The property management system at the front desk. The dashboard that turns red. In more than thirty essays on this site those systems appear on most pages and are the subject of none. They are there the way the desk is there in a story: everyone works on it, nobody describes it.

That is not an accident. Nobody has ever asked me, in a shift, whether we should use technology. It was there when I arrived and it will be there when I leave. The question I have been asked every day, in other words, is this one: the system says one thing, the floor says another, whom do I believe?

And behind it a harder one: when the system was wrong and I followed it, who is responsible?

This essay opens a series about that question. Not about which systems to buy, and not about what they will do in five years. About what is left for the person on shift when the system is faster than them.

## What I have and what I do not

As in the rest of this site, I will not name applications or systems, and I will not describe exactly what a system shows, because in some cases I am not sure and in others it is internal.

I do not have a documented case, from start to resolution, in which a system decided wrongly and I followed it to the end. What I have is smaller and more useful: the work on Loading Time in last mile, where the answer was not a new system but [scanners closer to the ramp, pre-scanning and a last check for completeness](/insights/what-last-mile-taught-me/); the rule that a trolley with a problem [stays in its zone until the problem is solved](/insights/where-part-of-the-order-goes-missing/), whatever the scan says; and the question I ask myself every day as a remote dispatcher, [how old is this information](/insights/80-vehicles-you-cannot-see/).

The scene I open the next section with is not one of those cases. It is one that anyone who has worked next to a planning system will recognise, and I use it as a picture, not as evidence.

## Ninety-eight out of a hundred

Imagine a tour planned by the system for a new driver. The order of the stops is perfect for the system: the shortest distance, the least time, no going back. The driver follows it. The third stop is a shop that opens at ten, and the system has put it at half past eight because it was nearer.

The system has not failed. It did exactly what it was built to do: it calculated distances. It did not know that shops have opening hours, because nobody told it. An experienced driver would have seen it in a second and moved the stop without asking anyone. The new driver trusted the screen, because the screen was faster and more certain than he was.

Here is the part that matters. In a normal week the system is right in almost every case. The scanner reads almost every bag correctly. The property management system shows the right room almost every time. If I had overruled the system every time I had a feeling, I would have been slower than it and wrong more often.

So the job is not to fight the system. The job is to know which are the two cases in a hundred where it is wrong, and to recognise them when they come. Those two cases almost always have the same shape: the system did not know something the floor knew. The opening hours. That the second gate is broken. That the guest in that room is the one who complained yesterday. That the bag with that code was in the wrong trolley, even though the scan said yes.

**The system is faster than you in everything it was told. It knows nothing of what it was not told. And most of what the floor knows has never been told to anyone.**

{diagram}

## Three ways to get it wrong

I have seen three ways shift leads handle this, and I have done all three myself.

**Full trust.** The system said so, therefore it is so. When it goes wrong, the answer is “the system assigned it”. It is the most comfortable answer and the most dangerous, because it hands responsibility to something that cannot carry it. The customer in front of the closed shop does not ask the system.

**Full distrust.** The experienced driver who changes the tour every day without saying a word. He is usually right. But his knowledge stays in his head: the system does not learn, the new driver does not learn, and on the day he is absent the tour goes back to the first mistake.

**Silent correction.** The shift lead who corrects the system by hand every morning, in the same three places, for months. He has solved the problem for himself and left it for everyone else. A correction that repeats is not a correction. It is a fault in the system that nobody has reported.

## Three questions for every decision

What I learned, and what I would have wanted on the first day, is this. For every decision the system takes in my shift I need to know three things. What the system knows when it takes it. What it does not know. And how I notice, from the floor, when it has been wrong.

The first two questions are answered once and written down. The third one is the work. In last mile the answer was a call from the driver, a trolley that did not match its route, a number in the stand-up that did not fit the day. From a distance, as I wrote in [Leading 80+ vehicles you cannot see](/insights/80-vehicles-you-cannot-see/), the answer is thinner: the problem only reaches you if someone sees it, understands it and reports it. That is why the question about the age of the information comes before any decision taken on it.

If I cannot answer the third question for a decision, I am not running that part of the operation. I am following it.

## The rule that stays

The system may have been wrong. The name on the shift is yours. That is not unfair. It is the job. The system gives you speed, memory and numbers you would never have on your own. In return you give it what it does not have: eyes on the floor, a question when something does not make sense, and a name that answers.

The essays that follow in this series are about that exchange: the tour the driver does not understand, the scanner that is a witness and not a judge, the dashboard that turns red before you do, the report that was written by a machine, and the night the system went down and we saw what the team really knew.

## Who decides what

The card below has one row for each decision the system takes in your shift. For each one: what the system knows, what it does not, and how you notice when it is wrong. The last row is for the correction you make by hand every day, the one that should have been reported long ago. The [KPI Diagnostic](/tools/kpi-diagnostic/) helps with the numbers the system shows you: what a red number is telling you before you act on it.

**The system decides first. What is left for you is the part it was never told, and the name that answers for all of it.**
