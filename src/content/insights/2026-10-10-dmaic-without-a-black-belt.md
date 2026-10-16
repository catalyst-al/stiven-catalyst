---
title: 'DMAIC without a black belt'
date: 2026-10-10T19:00:00Z
category: Operations
series: improvement
status: published
featured: true
summary: You do not need a Black Belt certificate to ask good questions. But knowing the name of a method is not enough to claim you have applied it.
teaser: The value of DMAIC is not in the certificate. It is in the discipline not to jump straight from the problem to the solution.
description: "DMAIC without a certificate: the five phases as I actually had them in last mile, why Control is the hardest, and five questions for a shift manager."
deck: 'The sixth essay in the series “Improvement that holds”: what DMAIC is, which phases I had in my work and which I did not, why Control is the hardest phase, and five questions for a shift manager who is not a black belt.'
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/six-sigma-dmaic/
  - /tools/five-whys/
checklist:
  title: DMAIC in five questions
  fill: true
  note: A guide to how I would do it today, not a formal Six Sigma project I have led.
  items:
    - label: What is the concrete problem?
      hint: One problem, one place, one period. Not “quality is poor”.
    - label: How do we measure it?
      hint: Which number, from which source, and what it was before we started.
    - label: What is causing it?
      hint: The cause we have tested, not the first one that comes to mind.
    - label: What can we change?
      hint: A change we can try, not a new procedure for everything.
    - label: How will we check that the improvement lasts?
      hint: Who follows it, how often, and what we do if the problem comes back.
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - root-cause
  - standards
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Write today's problem as one problem, one place, one period.
  - Decide how you will measure it, and what it was before you started.
  - Plan now who checks next month whether it held, not after the problem seems gone.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: dmaic-loop
---

You do not need a Black Belt certificate to ask good questions.

But knowing the name of a method is not enough to claim you have applied it.

This essay sits between those two sentences.

DMAIC is the Six Sigma cycle for improving a process: Define, Measure, Analyze, Improve, Control. You define the problem, measure it, analyse the causes, improve, and check that the improvement holds. In books it looks like a big project, with a team, a deadline and someone wearing a coloured belt.

What I bring to it is experience with real operational problems in last mile: Damage, Incomplete, Delay and Loading Time. Six Sigma, Pareto and 5 Why are methods I know and have made part of how I think about management. I have no confirmed certificate, Yellow, Green or Black Belt, and no project in which I applied and documented all five phases of DMAIC. Even for Pareto and 5 Why, I cannot show a case I carried through myself from start to finish. In [Pareto and 5 Why in practice](/insights/pareto-and-5-why-in-practice/) I wrote about a 5 Why with only two documented “whys”, and why I did not fill in the rest.

## The five phases, as I actually had them

Set against DMAIC, without dressing it up, that experience looks like this:

**Define.** We worked with problems defined through the KPIs.

**Measure.** We followed the operational results, the targets and the deviations.

**Analyze.** We looked into the reasons for delays, missing bags and problems with how loads were organised.

**Improve.** Which measures I put in place myself, and what they achieved, I cannot say precisely.

**Control.** Whether there was a documented system of control after an improvement, I do not know.

The list is revealing. The first three phases are the ones an operation almost does by itself, because the report demands them every day: there is a problem, there is a number, there is a “why”. The last two need someone to hold them, and they are the ones I have the least proof for.

{diagram}

## The discipline not to jump

**The value of DMAIC lies in the discipline not to jump straight from the problem to the solution.**

Neither the name nor a certificate gives you that. You first understand the problem, then measure it, analyse the causes, try the improvement and check whether it keeps working.

In operations, the temptation is always the jump. The KPI comes out bad, and someone has a solution straight away. In [A bad day or a problem?](/insights/a-bad-day-or-a-problem/) I wrote about the risk of changing the rules after every fluctuation. DMAIC is the structured way to avoid it: between the problem and the solution lie three steps, and you skip none of them.

## Control, the hardest phase

Of the five phases, today I would single out Control: keeping the improvement.

A problem can be solved for a while. But if the standard is not documented, people are not trained and nobody checks the result, the problem risks coming back.

That is why this series is called “Improvement that holds”. The improvement has to continue after the manager who started it has gone. If it only holds as long as that person is there, it was not an improvement of the process. It was one person's presence.

**A problem is not solved just because it did not happen again today.**

## For the shift manager

I would tell a shift manager that they do not need to be a Black Belt to start thinking systematically. Five questions are enough to begin with, one for each phase:

1. **What is the concrete problem?**
2. **How do we measure it?**
3. **What is causing it?**
4. **What can we change?**
5. **How will we check that the improvement lasts?**

Not every problem on the shift has to become a complex project. But they should avoid changing procedures just because a KPI came out bad.

You can fill in the sheet below for a single problem and copy it. If you want to see the whole cycle on a complete case, [Six Sigma in the Warehouse](/tools/six-sigma-dmaic/) follows a teaching case step by step. It is an example to learn from, not a story from my work.

Five questions will not make you a black belt. They do stop you jumping from the problem to the solution, and on an ordinary shift that is half the work.
