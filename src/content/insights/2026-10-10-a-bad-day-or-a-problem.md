---
title: 'A bad day or a problem?'
date: 2026-10-10T18:00:00Z
category: Operations
series: improvement
status: published
featured: true
summary: A bad day is a signal to check. It is not automatically proof that the whole process has to change.
teaser: 2.8%. That was Delay in a June 2025 report. Was it a bad day or a problem? From that number alone, I cannot say.
description: "A day with bad KPIs: what I have on record and what I do not, why a single number does not show whether the process has changed, the idea behind a control chart, the two opposite mistakes, and four questions before you change the process."
deck: 'The fifth essay in the series “Improvement that holds”: how we followed the KPIs every day, why a single number does not show whether the process has changed, the two opposite mistakes, when to step in straight away, and four questions before you change the process.'
# The tools this essay is about (English addresses; the German and Albanian pages follow this list).
relatedTools:
  - /tools/sigma-control-chart/
  - /tools/delay-analyzer/
checklist:
  title: Before you change the process
  fill: true
  note: A guide to how I would do it today. It is not a method I have on record as having used.
  items:
    - label: Is there an immediate safety or service problem?
      hint: If so, step in now. The analysis comes after.
    - label: How does the day compare with the volume, the conditions and the days before?
      hint: How much work there was, what happened that day, what the days before looked like.
    - label: Is it an exception or part of a trend?
      hint: One unusual day, or several days in a row going the same way?
    - label: Have we found a concrete cause?
      hint: Before we change the process, not after.
---

2.8%.

That was Delay in a June 2025 report.

Was it a bad day or a problem? From that number alone, I cannot say. And that is exactly where this essay starts.

## What I have and what I do not

In last mile we followed Delay, Damage, Incomplete and Loading Time every day. The results were discussed in the daily stand-up, and explanations were asked for whenever something was off. We also analysed them by DSP and by operational problem.

I do not know whether we waited to see if a result repeated before acting, or always stepped in straight away. I do not know whether I used a statistical control chart myself, with control limits. For daily or weekly trends in Excel or Power BI, I do not know for sure. And I do not want to present knowing the Six Sigma method as proof that I used it in that job.

I also do not have a documented case where a bad day was treated as a crisis and everything was back to normal the next day. Nor the opposite: a slow decline that was spotted late.

So this essay is not a story. It is a question every manager faces every day, and how I would answer it today.

## A number with no history

2.8% on its own does not say much. Compared with what?

Let us take a made-up example, only to make the idea clear. Suppose the average of the last few weeks was 2.5%. Is 2.8% a signal?

It depends. Every process varies. No day comes out the same as the next, even when nobody has changed anything. The volume changes, the people change, the routes change. The question is not whether today is worse than the average. Many days will be. The question is whether today is worse than this process usually varies.

That is the idea behind a control chart. It plots the days one after another, with the average and two limits that show how far the process usually varies. A day inside the limits is most likely ordinary variation. A day outside them, or several days in a row on the same side of the average, suggests that something may have changed.

I am not saying I used it this way. I am saying that is how I would do it today.

## Two opposite mistakes

There are two ways to misread a bad day. I describe them as an opinion, not as cases from my own experience.

The first: every bad day is treated as a problem. A rule gets changed, a check gets added, a meeting gets called. The next day the number is back to normal, and it looks as if the measure worked. But maybe it would have come back by itself. And now the process has one more rule that nobody knows the reason for.

**If we change the rules after every fluctuation, we risk creating more instability than improvement.**

The second is the opposite: no single day looks bad enough to react to, because each day is only slightly worse than yesterday. The number creeps up, and nobody sees it because nobody looks at the days together.

A control chart helps with both. It calms you down when the day is within the usual variation. And it wakes you up when several days in a row go the same way, even though none of them looks alarming on its own.

## When to step in straight away

That does not mean waiting for the statistics every time.

A day with a lot of delays deserves attention. But not every deviation calls for a new procedure. I would tell a manager not to confuse a bad result with proof that the process has changed. And I would check three things.

First: do we have an immediate safety or service problem? If so, you step in now. A customer who is waiting, or a hazard on the ramp, will not wait for five points to build up on a chart.

Second: is the result an exception or part of a trend?

Third: have we found a concrete cause before we change the process?

**A manager has to know when to step in straight away and when to gather more information.**

## Volume, weather and the process

In last mile we followed operational causes: missing bags, mixed trolleys, delays in preparation, problems during loading. I do not know of a documented method we used to separate the effect of the weather and the volume from a problem in the process.

Today, before deciding on a cause, I would compare the result with the volume of work, the conditions of the day and the data from the days before. 2.8% delays on a day with exceptional volume does not mean the same thing as 2.8% on an ordinary day.

## Three layers

**The KPI shows what happened. The trend helps us understand whether something is changing. The analysis of the process helps us decide what to do.**

Many operations go straight from the first layer to the third. The number comes out bad, and a measure is demanded at once. The middle layer, the one that says whether this day is different from the others, is the one most often missing.

[Sigma & Control Chart](/tools/sigma-control-chart/) draws that layer for your days or weeks, with an explanation of what is a signal and what is not. You can fill in the sheet below here before you change a rule, and copy it.

**A bad day is a signal to check. It is not automatically proof that the whole process has to change.**
