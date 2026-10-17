---
title: The system is faster than you
date: 2026-10-12T16:00:00Z
category: Operations
series: the-system
status: published
featured: true
summary: "The system decides first. What is left for the person on shift is the part it was never told, and the name that answers for it."
teaser: The system decides first. The name on the shift is still yours.
description: "What the systems in every shift know and what they were never told, three ways a shift lead can get it wrong, and a card for who decides what."
deck: "The first essay in the series “The system is faster than you”: what the systems in every shift know and what they were never told, three ways a shift lead can get it wrong, and a card for who decides what in your shift."
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
      hint: "The tour, the order of the stops, the planned time, the room status, the alarm. One per card."
    - label: "What does the system know when it takes it?"
      hint: "Addresses, times, stock, the scans so far. Only what someone typed in or scanned."
    - label: "What does it not know?"
      hint: "The shop that opens at ten, the broken gate, yesterday's complaint. What the floor knows and never told it."
    - label: "How do I notice when it is wrong?"
      hint: "A call from the driver, a number that does not fit, a look at the trolley. If there is no answer, there is no control."
    - label: "Who can correct it, who approves, where is it written down?"
      hint: "Three names or roles, and the place where the change leaves a trace. If you do not know them, find out before you need them."
    - label: "Which correction do I make by hand every day?"
      hint: "The same change, in the same place, for weeks: a system fault nobody has reported yet."
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - the-system-says
  - root-cause
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - "Before the shift, write one sentence: which decision the system takes today and which one you take."
  - "Within the first hour, go and look at one decision the system took. Not to change it, but to understand it."
  - "At the end of the shift, write down the one case where the system was wrong, what gave it away, and whom you told."
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: decision-split
---

Every job I have done had a system in it that was faster than me. The till in the shop. The scanner and the route planning in last mile. The hotel system at the front desk and in Night Audit. The dashboard that turns red. In more than thirty essays on this site those systems appear on most pages and are the subject of none. They are there the way the desk is there in a story: everyone works on it, nobody describes it.

In a shift, nobody asks whether we should use technology. It is there when you arrive and it will be there when you leave. The question that does come up, in one form or another, is a different one: the system says one thing, the floor says another, whom do I believe?

And behind it lies a harder one: when the system was wrong and I followed it, who is responsible?

This essay opens a series about that question. The series asks what is left for the person on shift when the system is faster than they are, and leaves aside which systems to buy and what they will do in five years. Its material is a change to the route and time planning system in last mile in August 2025, the daily work with drivers, tours and the problems that arise between the plan and the ramp, and documented complaints from the hotel about water pressure and bathroom cleanliness. As elsewhere on this site, I name no systems or applications and do not describe how they work inside.

## August 2025: the plan that wanted to learn from the floor

In August 2025, in last mile, a change was introduced to the system that planned the tours and the time. One of its aims was to reduce unrealistic plans, planning errors and operational exceptions. Information from the field was also meant to be used to improve the planning.

What changed afterwards I cannot say, because I have not measured it. But the aims themselves say something, and this is my reading of them. A system that has to reduce unrealistic plans has been producing unrealistic plans. And a system that needs information from the field admits, in its own language, what the floor has known for a long time: some things can only be seen out there.

That leaves the question of who brings it the information. The system gets it only if someone on the floor sees it, writes it down and sends it to a place where someone can use it.

## Right, until the moment it is not

The first scene is a picture rather than a memory: I have no documented case of a wrong system decision that I discovered and corrected. Imagine a tour that the system has planned for a new driver. The order of the stops is perfect for the system: the shortest distance, the least time, no doubling back. The driver follows it. The third stop is a shop that opens at ten, and the system has put it at half past eight because it was nearer.

The system did what it was built for: it calculated distances. It did not know that the shop has opening hours, because nobody told it. A driver who knows the area would have seen it in a second. The new driver trusted the screen, because the screen was faster and surer than the driver's own judgement.

Checking every decision by hand would make the shift slower without making it any safer. The job is to recognise, without fighting the system, the cases in which it is wrong, when they come. How often that is I cannot say, because I have never measured how often the system is right. But the cases often have the same shape: the system did not know something the floor knew. The opening hours. That the second gate is broken. That the guest in that room is the one who complained yesterday. That the bag with that code was on the wrong trolley, even though the scan said yes.

**The system is faster than you in everything it was told. It knows nothing of what it was not told. And most of what the floor knows has never been told to anyone.**

{diagram}

## Three ways to get it wrong

A shift lead can get this wrong in three ways. They are patterns, not cases I have documented, and anyone who has worked next to a planning system will recognise them.

**Full trust.** The system said it, so it is so. When it goes badly, the answer is “the system assigned it”. It is the most comfortable answer and the most dangerous, because it hands responsibility to something that cannot carry it. The customer standing in front of the closed shop does not ask the system.

**Full distrust.** The experienced driver who changes the tour every day without a word. They may be right. But their knowledge stays in their head: the system does not learn, the new driver does not learn, and on the day they are absent, the tour goes back to the first mistake.

**The silent correction.** The shift lead who corrects the system by hand every morning, in the same places, for weeks. They have solved the problem for themselves and left it for everyone else. This is the very information from the field that a system like the one from August 2025 needed, and it never reaches it. A correction that repeats is not a correction. It is a fault in the system that nobody has reported.

## At the front desk: the status and the history

In the hotel, the system knows the reservations, the room statuses, the arrivals, the departures and the transactions. The front desk also knows what the guest says at the counter and what comes in from the other departments.

From Night Audit I have documented complaints about the water pressure in a shower and about a bathroom that had not been cleaned properly. Neither was solved at the front desk: the first belonged to Maintenance, the second to Housekeeping, as I wrote in [Mistakes get lost between departments](/insights/mistakes-get-lost-between-departments/). And when they stayed open, the next shift had to know.

The lesson I draw from them does not need a wrong status on the screen: the status in the system and the full history of a problem are not the same thing. A room can be “free” on the screen and have a complaint behind it that nobody has closed. Only the [handover](/insights/why-the-handover-is-underrated/) keeps that history, and only if someone writes it down.

## Three questions for every decision

For every decision the system takes in my shift, today I would want to know three things: what the system knows when it takes it, what it does not know, and how I, from the floor, notice when it is wrong.

The first two questions are answered once and written down. The third is the work. In last mile the answer can be a call from the driver, a trolley that does not match its tour, or a number in the stand-up that does not match the day. From a distance, as I wrote in [Leading 80+ vehicles you cannot see](/insights/80-vehicles-you-cannot-see/), the answer is thinner: the problem reaches you only if someone sees it, understands it and reports it.

If I cannot answer the third question for a decision, then in that part of the operation I am only following.

After the questions comes the rule. A decision suggested by the system does not remove the human responsibility to check it, especially when there are signs that something is not right. But that only holds if it is clear who can correct the decision, who approves the change and how the problem is recorded. Without those three, “check it” means “correct it in silence”.

## The rule that remains

The system may have been wrong, and the name on the shift is still yours. That comes with the job, and there is nothing unfair about it.

The system and experience belong in the same process: one in which the system helps you work faster and people have a way to notice, report and correct what it does not understand. The system gives you speed, memory and numbers you would never have on your own. In exchange you give it what it lacks: eyes on the floor, a question when something does not make sense, and a name that answers.

**The system decides first. What is left for you is the part it was never told, and the name that answers for all of it.**

The essays still to come in this series are about that exchange: the tour the driver does not understand, the scanner that is a witness and not a judge, the dashboard that turns red before you, the report a machine wrote, the night the system went down and we saw what the team really knew, the new system that arrives, and the small list you build yourself beside it.

## Who decides what

The card below has one row for each decision the system takes in your shift. For each one, it asks the three questions above and names who corrects, who approves and where it is written down. [KPI Diagnostic](/tools/kpi-diagnostic/) helps with the numbers the system shows you: what a red number tells you before you act on it. The last row of the card is for the correction you make by hand every day, the one that should have been reported long ago.
