---
title: 'How I built Front Desk Control'
date: 2026-10-08T23:30:00Z
category: Operations
series: without-you
status: published
featured: true
summary: An SOP becomes useful when the person who needs it can find it, understand it and apply it at the right moment.
description: "The series' concrete case: how scattered checklists and notes became one work page for Front Office and Night Audit, and what I would do differently."
teaser: I did not build it because documents were missing. The documents existed, but the information I needed during work was scattered.
deck: 'The ninth essay in the series “The operation that runs without you”: a real project, developed step by step and still in progress, with the card for turning a folder of SOPs into a working tool.'
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
# The challenges this essay answers (src/_data/challenges.json); the German and Albanian pages follow this list.
problems:
  - standards
  - handover
  - training
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Choose one procedure and count how many places someone has to open to carry it out.
  - Put that procedure where it can be found by what it does, not by the name of the document.
  - Ask a colleague to follow it without your explanation, and note where they stopped.
# The case behind the essay, as the record shows it (layouts/article.njk): what can and cannot be confirmed.
caseRecord:
  when: "September 2026, hotel Front Office and Night Audit"
  problem: "The information for Front Office and Night Audit was spread across SOPs, checklists, videos, screenshots and notes."
  knew: "Finding and understanding the right procedure meant moving between several sources."
  did: "I began building a browser-based tool organised around the tasks of the shift, with search, checklists and visual explanations."
  happened: "A working personal project, developed in several stages. An anonymised public version can be inspected."
  unconfirmed: "Time saved, use by the team, or any official approval: it is not a system run by the hotel."
---

When I started Front Desk Control, no document was missing. The trouble was finding what I needed in them during a shift.

This is the most concrete case in the series: a real project, developed step by step, that anyone can open and check. What it shows is a way of organising information.

## What it is

Front Desk Control is a work tool in the browser that I built to have the information and processes of Front Office and Night Audit in one place. Instead of another folder of documents, I wanted a page where I could quickly find what I had to do, in what order, and where to look for help if I was not sure.

It uses HTML pages, step-by-step instructions, checklists and screenshots to explain the processes visually. The public version is [open here](https://catalyst-al.github.io/frontdesk-control-web/), with anonymised content.

At first the need was personal: I was learning new processes and wanted to organise the information I needed during the shift.

## Why I started it

I developed the project in several phases during September 2026, while I was working through training and Night Audit processes. It was never finished in one go: as I learned more about the processes, I kept adding, improving and revising the way the instructions were presented.

The problem was practical. The information I needed existed, but it was spread across checklists, documents, screenshots, videos and notes. The checklist told me what had to be done; another document or a colleague showed me how. To understand one procedure, I sometimes had to move from one source to the next. What cost time was finding the information and using it.

This follows directly from the first essay of the series, [The first 30 days](/insights/the-first-30-days/). At first I was trying to understand the operation; then I began to build a way to stop the information staying scattered. [A good SOP is not a document](/insights/a-good-sop-is-not-a-document/) explains why. This essay shows how.

I did not want to remember where every document was. I wanted to know where to go for the right answer.

## How I organised it

Instead of writing a long manual to be read from start to finish, I organised the tool around the work that had to be done, with dedicated parts for Front Office and Night Audit: instructions, search, checklists and images that explain the steps.

One of the most important decisions was that the user should not need to remember the name of the original document to find an answer. If you are carrying out a procedure, you should be able to search for the procedure itself, without digging through folders for the right PDF.

**Search for the procedure, not the document.**

The screenshots had a job of their own. They had to show the same step the text explained, be readable and expose no personal data. During the improvements I also checked the quality of the images. I did not want to replace a screenshot just because another one looked nicer if the new image did not show exactly the same action.

## What I left out

The public version could not include real guest data, reservations, payment information, credentials, confidential documents, or material that could expose the internal operation. That separation is essential.

**You can show the method of organising information without publishing the sensitive information the work relies on.**

## What I would do differently today

The only use I can confirm is my own, while I was building the tool and learning. It helped me bring the information into a clearer structure. It may also help someone in training; for now that is a possibility. Front Desk Control is a personal project, still in development: it is not a system approved or run by a hotel, and I have no measurement of the time it saves.

Today I would start even earlier with the structure of the information, before working on the look of the page. I would first define which questions come up most often during a shift and which procedures matter most, and then build the answers around those needs.

I would also separate three categories more clearly:

- **Confirmed:** the procedure has been checked and documented.
- **Being verified:** the material exists, but has to be checked in practice.
- **Unfinished:** the instruction is not yet enough to carry out the process safely.

And I would test it with other users before calling the tool ready for wider use. The fact that I understand an instruction does not mean someone seeing it for the first time will understand it the same way. It is the principle of [“Watch how I do it” is not training](/insights/watch-how-i-do-it-is-not-training/), applied to the tool instead of the person.

## How to turn a folder of SOPs into a working tool

While building it I understood that the most important challenge was organising the information so that it could be used, checked and improved; making a nice page came second. An SOP becomes useful when the person who needs it can find it, understand it and apply it at the right moment.

You do not have to build an application for that. The method works just as well for a single document, an intranet page or a spreadsheet. Five steps:

1. **Identify the work.** Which process will you make easier? Start with one.
2. **Gather the sources.** Where is the information today? Checklists, documents, videos, notes, colleagues.
3. **Build a clear path.** How can someone find and follow the procedure without knowing the name of the original document?
4. **Verify and protect the information.** What is confirmed, what is still being verified, and what has to be anonymised?
5. **Test it in practice.** Does someone else understand it without your explanation?
