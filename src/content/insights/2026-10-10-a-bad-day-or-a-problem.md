---
title: 'A bad day or a problem?'
date: 2026-10-10T18:00:00Z
category: Operations
series: improvement
status: published
featured: true
summary: A bad day is a signal to check. It is not automatically proof that the whole process has to change.
teaser: A June 2025 report put Delay at 2.8%. Bad day or problem? The answer decides whether you change the process, and the number alone cannot give it.
description: "A day with bad KPIs: why one number does not show whether the process has changed, the idea behind a control chart, and four questions before you act."
deck: 'The fifth essay in the series “Improvement that holds”: how we followed the KPIs every day, why a single number does not show whether the process has changed, the two opposite mistakes, when to step in straight away, and four questions before you change the process.'
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/sigma-control-chart/
  - /tools/delay-analyzer/
checklist:
  title: Before you change the process
  fill: true
  note: A guide to how I would do it today, not a method I have on record as having used.
  items:
    - label: Is there an immediate safety or service problem?
      hint: If so, step in now. The analysis comes after.
    - label: How does the day compare with the volume, the conditions and the days before?
      hint: How much work there was, what happened that day, what the days before looked like.
    - label: Is it an exception or part of a trend?
      hint: One unusual day, or several days in a row moving the same way?
    - label: Have we found a concrete cause?
      hint: Before we change the process, not after.
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - red-number
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Before you change a rule, put today's number next to the last ten days.
  - Check first whether there is an immediate safety or service problem. If there is, act now.
  - Name a concrete cause before you touch the process.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: three-layers
---

2.8%.

That was the Delay figure in a June 2025 report. A bad day, or a sign that something in the process had changed? The number on its own cannot say.

In last mile we followed Delay, Damage, Incomplete and Loading Time every day. The results were discussed in the daily stand-up, anything off had to be explained, and we also broke the figures down by DSP and by operational problem.

## A number with no history

2.8% on its own says little. Compared with what?

Take a made-up example. Suppose the average of the last few weeks was 2.5%. Is 2.8% a signal?

It depends. Every process varies. No two days come out the same, even when nobody has changed anything: the volume changes, the people change, the routes change. Many days will be worse than the average. What matters is whether today is worse than this process usually varies.

That is the idea behind a control chart. It plots the days one after another, with the average and two limits that show how far the process usually varies. A day inside the limits is most likely ordinary variation. A day outside them, or several days in a row on the same side of the average, suggests that something may have changed.

Whether I used such a chart myself, with control limits, I cannot reconstruct, any more than how we chose between waiting and acting back then: whether we let a result repeat before stepping in, or followed daily or weekly trends in Excel or Power BI. What follows is how I would read a bad day today.

## Two opposite mistakes

In my view, a bad day can be misread in two opposite ways.

The first treats every bad day as a problem. A rule gets changed, a check gets added, a meeting gets called. The next day the number is back to normal, and the measure seems to have worked. But it might have come back by itself, and now the process carries one more rule that nobody knows the reason for.

**If we change the rules after every fluctuation, we risk creating more instability than improvement.**

The second is the opposite. No single day looks bad enough to react to, because each one is only slightly worse than the day before. The number creeps up, and nobody notices, because nobody looks at the days together.

A control chart helps with both. It calms you down when the day sits within the usual variation, and it wakes you up when several days in a row move the same way, even though none of them looks alarming on its own.

## When to step in straight away

None of this means waiting for the statistics every time. A manager has to know when to step in straight away and when to gather more information.

A day with a lot of delays deserves attention, but not every deviation calls for a new procedure. My advice would be not to confuse a bad result with proof that the process has changed, and to check three things.

First: is there an immediate safety or service problem? If so, step in now. A waiting customer or a hazard on the ramp will not wait for five points to build up on a chart.

Second: is the result an exception or part of a trend?

Third: have we found a concrete cause before we change the process?

## Volume, weather and the process

In last mile we tracked operational causes: missing bags, mixed trolleys, delays in preparation, problems during loading. I know of no documented method we used to separate the effect of weather and volume from a problem in the process.

Today, before settling on a cause, I would compare the result with the volume of work, the conditions of the day and the data from the days before. 2.8% delays on a day with exceptional volume does not mean the same as 2.8% on an ordinary day.

{diagram}

## Three layers

**The KPI shows what happened. The trend helps us understand whether something is changing. The analysis of the process helps us decide what to do.**

Many operations jump straight from the first layer to the third: the number comes out bad, and a measure is demanded at once. The middle layer, the one that says whether this day differs from the others, is the one most often missing.

[Sigma & Control Chart](/tools/sigma-control-chart/) draws the middle layer for your days or weeks and explains what counts as a signal and what does not. Before you change a rule, fill in the sheet below and copy it.
