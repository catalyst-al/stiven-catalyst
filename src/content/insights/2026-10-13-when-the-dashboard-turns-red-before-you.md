---
title: When the dashboard turns red before you
date: 2026-10-13T16:00:00Z
category: Operations
series: the-system
status: published
featured: true
summary: "A red number on the screen is a signal to check, not a diagnosis. Ask what it measures and how old it is before you act on it."
teaser: The red on your screen is a signal, not a diagnosis. Ask what it measures and how old it is before you act.
description: "Why a red number on a dashboard has an age, the steps between the floor and the screen, three wrong reactions, and a card for your own red number."
deck: "The second essay in the series “The system is faster than you”: why a red number is a signal and not a diagnosis, the three wrong reactions to a red, four steps between the alarm and the decision, and a card for your own red number."
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/shift-pulse/
  - /tools/delay-analyzer/
  - /tools/cx-control-tower/
checklist:
  title: My red number
  fill: true
  note: "One card for each number you follow on a screen. Fill it in before the shift, not during the red."
  items:
    - label: "Which number is it, what exactly does it measure, and what is its target?"
      hint: "Delay, Loading Time, Incomplete, Damage, open rooms, waiting time. One per card."
    - label: "How old is it when I see it?"
      hint: "The time between the floor and the screen: seconds, minutes, the next morning? If you do not know, find out today."
    - label: "What do I know for sure, and what was reported?"
      hint: "The number is a report. What did someone see with their own eyes? Is the problem still open?"
    - label: "Who has the information closest to the situation?"
      hint: "One name or one role for each area. Written down now, not looked for when the screen is red."
    - label: "Within my role, or escalation? And with what information?"
      hint: "The limit of my decision, and the three facts the next level needs."
    - label: "What does not wait for verification?"
      hint: "Immediate safety risks: reported at once, the analysis comes after."
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - red-number
  - the-system-says
  - escalation
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - "For every number you follow on a screen, find out what exactly it measures and how old it is when you see it, and write that next to it."
  - "Decide before the shift the four steps after a red: what it measures and when it was updated, whether it is still open, whom you ask, within your role or higher."
  - "Once a week, look at the reds that led to no action. If they are the majority, the alarm needs reviewing on the data, not just a higher threshold."
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: dashboard-lag
---

The red on your screen is a signal, not a diagnosis. Ask what it measures and how old it is before you act.

In [The system is faster than you](/insights/the-system-is-faster-than-you/) I wrote that the system decides first and the name on the shift stays yours. This essay is about the moment that happens most often: nothing has been decided yet, but a number on the screen has turned red, and everyone is waiting to see what you will do.

Since 1 January 2026 I have been working part-time as a Last Mile Dispatcher, remotely, coordinating 80+ vehicles and 100+ drivers. What that does to a manager I wrote about in [Leading 80+ vehicles you cannot see](/insights/80-vehicles-you-cannot-see/). From a distance you cannot walk to the ramp to see what is behind a number. You rely on the information that reaches you from the system and from the people in the field. And both always arrive a little after what is happening.

## What I have and what I do not

What I have: the remote role, since January 2026. The earlier experience in last mile, where I worked every day with Delay, Damage, Incomplete and Loading Time. And a demonstration model I built myself, the [CX Control Tower](/tools/cx-control-tower/), with indicators for departures, delays, loading and incidents. It is a demonstration, not the system of any company.

What I do not have: the exact list of indicators shown in the system of my current work. How quickly the data is updated, in seconds, minutes or later: I do not know. A documented case in which a number turned red, I reacted and I know how it ended: I do not have one. Nor a threshold or target I asked to have changed.

So this essay is my analysis and how I would do it today, not a protocol I have followed. The scene in it is a picture, and I mark it as one.

## Four steps between the floor and the red

Imagine a van that should have left the ramp ten minutes ago. On the dashboard the tour is red. What had to happen for it to be red?

Someone had to see that the van is still there, or a scan had to be missing by a certain time. Someone or something had to report it. The system had to calculate it against the target, at its own rhythm. And then your screen had to draw it. Four steps, each with its own delay. How large that delay is differs from one system to the next, and for mine I do not know. That is exactly why it is the first question.

{diagram}

**A red number is not the floor. It is a report about the floor, and a report has an age.**

When you see the red, the van may already have left. Or it may still be there, and the red is the first true thing you have heard today. From the colour you cannot tell the two apart. You can tell them apart only if you know what the number measures and how old it is.

## Red is not always an emergency. And green is not always a guarantee.

The same logic works in both directions. A red can describe a problem that has been solved in the meantime. A green can describe the floor as it was before something started to go wrong, or measure something other than what you think.

So the question is not “what colour is it”. The question is “what does this number measure, when was it updated, and what is really happening now”. The colour tells you where to look. It does not tell you what to decide.

## Three wrong reactions

There are three reactions to a red number that anyone who has sat in front of a dashboard will recognise. They are not cases I have documented. They are patterns.

**Calling at once.** The number turns red, the phone is in your hand before you have thought. The person who takes the call may be in the middle of solving exactly that thing, and now has to stop to explain it to you. You have reacted to a situation that may no longer exist, and for that you have taken a pair of hands off the problem.

**Ignoring it.** “At this hour it is always red.” An alarm that repeats constantly without useful information risks losing its meaning. And on the day the red means something, nobody looks. In [A bad day or a problem?](/insights/a-bad-day-or-a-problem/) I wrote about the layer most operations skip: the one that says whether today is different from the last ten days. A red you ignore out of habit is a red without history.

**Passing it on red.** The number is sent one level up, red and bare. This is the third mistake from [When to solve it yourself and when to take it higher](/insights/solve-it-or-escalate-it/): escalation without information. The problem has not moved towards a solution. It has only moved to someone who now has to ask the questions you could have asked yourself.

## Four steps before the decision

What the three have in common is that the reaction is decided while the screen is red. That is the worst moment to decide anything. The right moment is before the shift.

I do not have the order I follow today documented. But this is the order I would recommend:

1. **I check what the indicator measures and when it was updated.** Without that, I do not know whether I am looking at the present or the past.
2. **I verify whether the problem is real and still open.** The number is a report. Someone has to confirm it.
3. **I contact the person who has the information closest to the situation.** Not the one who comes to mind first, but the one nearest to the fact.
4. **I decide whether it can be solved within my role or needs escalation.** And if it goes up, it goes with the facts, not just the colour.

One exception: for an immediate safety risk I do not wait for the full analysis. I report it at once, and the verification comes after.

When these four steps are decided before the shift, the first minutes after a red are not a decision. They are a routine.

**The red colour is a signal to check. It is not a diagnosis.**

## The alarm, once a week

One more thing, more for the end of the week than for the shift. Look at the reds that led to no action, because when you checked them they had already been solved or were not problems. If they are the majority, the alarm is training everyone to ignore it.

But the answer is not simply to raise the threshold so the screen looks better. A threshold raised without data hides the useless reds together with the ones that mattered. The alarm is reviewed on the data: how many reds, how many of them needed action, and what the ones that needed it had in common. That count is also the best argument you can take to the people who set the alarm. Not “the dashboard is wrong”, but how many reds there were this week and how many of them really asked for something.

## My red number

The card below has one row for each number you follow on a screen: what it measures, how old it is when you see it, what you know for sure, who has the information closest to it, when it goes up, and what does not wait for verification. Fill it in before the shift. [Shift Pulse](/tools/shift-pulse/) shows the week's numbers side by side, so that a red day has ten days of history next to it before you decide what it means.

**A red number tells you where to look. It does not tell you what is there now. The distance between the two is the age of the number, and knowing it is your job.**
