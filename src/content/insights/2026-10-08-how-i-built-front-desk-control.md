---
title: 'How I built Front Desk Control'
date: 2026-10-08T23:30:00Z
category: Operations
series: without-you
status: published
featured: true
summary: An SOP becomes truly useful when the person who needs it can find it, understand it and apply it at the right moment.
description: "The series' concrete case: how I turned scattered checklists, documents, screenshots and notes into a browser work page for Front Office and Night Audit, what I left out, what I cannot claim, and what I would do differently today."
teaser: I did not build it because documents were missing. I started it because the documents existed, but the information I needed during work was scattered.
deck: 'The ninth essay in the series “The operation that runs without you”: a real project, developed step by step, presented as work in progress rather than a measured success, with the card for turning a folder of SOPs into a working tool.'
relatedTools:
  - /tools/shift-handover/
checklist:
  title: The SOP organisation card
  fill: true
  note: Write only general descriptions. Do not enter confidential data, guest information or credentials.
  items:
    - label: Identify the work
      hint: Which process will you make easier?
    - label: Gather the sources
      hint: Where is the information today?
    - label: Build a clear path
      hint: How can someone find and follow the procedure?
    - label: Verify and protect the information
      hint: What is confirmed, and what has to be anonymised?
    - label: Test it in practice
      hint: Does someone else understand it without your explanation?
---

I did not build Front Desk Control because documents were missing.

I started it because the documents existed, but the information I needed during work was scattered.

In the earlier essays of this series I have often written “I do not have” and “I will not invent it”. This essay is different. Here I have a real project, which I developed step by step and which can be checked. But here too I will separate what I can show from what I cannot claim.

## What it is

Front Desk Control is a work tool in the browser that I built to have the information and processes of Front Office and Night Audit in one place.

I did not want just another folder of documents. I wanted a page where I could quickly find what I had to do, in what order, and where to look for help if I was not sure.

In the project I used HTML pages, step-by-step instructions, checklists and screenshots to explain the processes visually. The public version is [open here](https://catalyst-al.github.io/frontdesk-control-web/), with anonymised content.

At first the need was personal. I was learning new processes and wanted to organise the information I needed during the shift.

## Why I started it

I developed the project during September 2026, in the period when I was working through training and Night Audit processes. I do not have the exact date of the first version.

The problem was very concrete. The information I needed existed, but it was scattered across checklists, documents, screenshots, videos and notes. The checklist told me what had to be done, while another document or a colleague showed me how. To understand one procedure, I sometimes had to move from one material to the next.

This follows directly from the first essay of the series, [The first 30 days](/insights/the-first-30-days/). At first I was trying to understand the operation. Then I began to build a way for the information not to stay scattered. In [A good SOP is not a document](/insights/a-good-sop-is-not-a-document/) I wrote about why. Here I want to show how.

**The problem was not a lack of information. The problem was how quickly I could find it and use it.**

I did not want to remember where every document was. I wanted to know where to go for the right answer.

## How I organised it

I chose not to organise it as a long manual to be read from start to finish. I organised it around the work that had to be done.

I created dedicated parts for Front Office and Night Audit, with instructions, search, checklists and images that explain the steps.

One of the most important decisions was that the user should not need to remember the name of the original document to find an answer. If you are carrying out a procedure, you should be able to search for the procedure, not search through folders until you find the right PDF.

**Search for the procedure, not the document.**

The screenshots had a special role. They were not decoration. They had to show the same step the text explained, be readable, and not expose personal data. During the improvements I also checked the quality of the images. I did not want to replace a screenshot just because another one looked nicer, if the new image did not show exactly the same action.

## What I left out

The public version could not include real guest data, reservations, payment information, credentials, confidential documents, or material that could expose the internal operation.

To me that separation is essential.

**You can show the method of organising information without publishing the sensitive information the work relies on.**

## What I cannot claim

I do not have a reliable number of hours. I know the project was developed in several phases during September 2026, with continuous additions and improvements. It was not a page I built once and never touched again: as I learned more about the processes, I also revised the way the instructions were presented. But I will not write “it took me a week” or “40 hours” without evidence.

My own use during development is confirmed. For the number of colleagues who use it, a formal test with a team, specific feedback, or measured improvements in working time, I have nothing.

So I will not write that Front Desk Control shortened training time, reduced mistakes, or was adopted by the department. Those would be claims about results we have not measured.

What I can say is that the project helped me organise the information into a clearer structure, and develop it while I was learning. It may also be useful for someone in training. But that is a possibility, not a result.

## What I would do differently today

Today I would start even earlier with the structure of the information, before working on the look of the page. I would first define which questions come up most often during a shift and which procedures matter most. Then I would build the answers around those needs.

I would also separate three categories more clearly:

- **Confirmed:** the procedure has been checked and documented.
- **Being verified:** the material exists, but has to be checked in practice.
- **Unfinished:** the instruction is not yet enough to carry out the process safely.

I present this as an improvement I would recommend today, not as a feature I claim to have fully implemented in the project.

And I would focus on testing with other users before calling the tool ready for wider use. Because the fact that I understand an instruction does not mean someone seeing it for the first time will understand it the same way. It is the same principle as in [“Watch how I do it” is not training](/insights/watch-how-i-do-it-is-not-training/), applied to the tool instead of the person.

## How to turn a folder of SOPs into a working tool

You do not have to build an application. The method works just as well for a single document, an intranet page or a spreadsheet. Five steps:

1. **Identify the work.** Which process will you make easier? Start with one, not all of them.
2. **Gather the sources.** Where is the information today? Checklists, documents, videos, notes, colleagues.
3. **Build a clear path.** How can someone find and follow the procedure without knowing the name of the original document?
4. **Verify and protect the information.** What is confirmed, what is still being verified, and what has to be anonymised?
5. **Test it in practice.** Does someone else understand it without your explanation?

While building it I understood that the most important challenge was not making a nice page. It was organising the information so that it could be used, checked and improved.

An SOP becomes truly useful when the person who needs it can find it, understand it and apply it at the right moment.
