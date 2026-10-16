---
title: 'Ein schlechter Tag oder ein Problem?'
date: 2026-10-10T18:00:00Z
category: Betrieb
series: improvement
status: published
featured: true
summary: Ein schlechter Tag ist ein Signal zum Prüfen. Er ist nicht automatisch der Beweis, dass der ganze Prozess geändert werden muss.
teaser: Ein Bericht vom Juni 2025 wies für Delay 2,8 % aus. Schlechter Tag oder Problem? Davon hängt ab, ob Sie den Prozess ändern, und die Zahl allein gibt die Antwort nicht her.
description: "Ein Tag mit schlechten Kennzahlen: warum eine Zahl allein nicht zeigt, ob sich der Prozess geändert hat, die Regelkarte und vier Fragen, bevor Sie handeln."
deck: 'Der fünfte Essay der Reihe „Verbesserung, die hält“: wie wir die Kennzahlen täglich verfolgten, warum eine einzelne Zahl nicht zeigt, ob sich der Prozess verändert hat, die zwei entgegengesetzten Fehler, wann man sofort eingreift, und vier Fragen, bevor Sie den Prozess ändern.'
relatedTools:
  - /tools/sigma-control-chart/
  - /tools/delay-analyzer/
checklist:
  title: Bevor Sie den Prozess ändern
  fill: true
  note: Eine Orientierung, wie ich heute vorgehen würde, keine Methode, deren Einsatz ich belegen kann.
  items:
    - label: Gibt es ein akutes Sicherheits- oder Serviceproblem?
      hint: Wenn ja, greifen Sie jetzt ein. Die Analyse kommt danach.
    - label: Wie verhält sich der Tag zur Menge, zu den Bedingungen und zu den Vortagen?
      hint: Wie viel Arbeit anfiel, was an dem Tag passiert ist, wie die Tage davor aussahen.
    - label: Ist es eine Ausnahme oder Teil eines Trends?
      hint: Ein ungewöhnlicher Tag oder mehrere Tage hintereinander in dieselbe Richtung?
    - label: Haben wir eine konkrete Ursache gefunden?
      hint: Bevor wir den Prozess ändern, nicht danach.
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Bevor Sie eine Regel ändern, legen Sie die heutige Zahl neben die letzten zehn Tage.
  - Prüfen Sie zuerst, ob ein akutes Sicherheits- oder Serviceproblem besteht. Wenn ja, handeln Sie sofort.
  - Benennen Sie eine konkrete Ursache, bevor Sie den Prozess anfassen.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: three-layers
---

2,8 %.

So hoch lag Delay in einem Bericht vom Juni 2025. War das ein schlechter Tag, oder hatte sich im Prozess etwas verändert? Die Zahl allein verrät es nicht.

Auf der letzten Meile verfolgten wir Delay, Damage, Incomplete und Loading Time täglich. Die Ergebnisse kamen im Daily Stand-up auf den Tisch, jede Abweichung musste erklärt werden, und wir werteten die Zahlen auch nach DSP und nach operativen Problemen aus. Auf dieser Routine beruht der Essay. Wie wir damals zwischen Abwarten und Eingreifen entschieden, kann ich dagegen nicht mehr rekonstruieren: ob wir warteten, bis sich ein Ergebnis wiederholte, ob wir tägliche oder wöchentliche Trends in Excel oder Power BI verfolgten, ob ich selbst eine statistische Regelkarte mit Eingriffsgrenzen verwendet habe. Die Methode, die folgt, beschreibt, wie ich einen schlechten Tag heute lesen würde.

## Eine Zahl ohne Geschichte

2,8 % allein sagt wenig. Verglichen womit?

Nehmen wir ein erfundenes Beispiel: Der Durchschnitt der letzten Wochen lag bei 2,5 %. Sind 2,8 % dann ein Signal?

Das kommt darauf an. Jeder Prozess schwankt. Kein Tag fällt aus wie der andere, auch wenn niemand etwas verändert hat: Die Menge ändert sich, die Leute wechseln, die Touren auch. Die Frage ist nicht, ob heute schlechter ist als der Durchschnitt. Das trifft auf viele Tage zu. Die Frage ist, ob heute schlechter ist, als dieser Prozess normalerweise schwankt.

Genau darauf beruht die Regelkarte. Sie trägt die Tage nacheinander ein, dazu den Durchschnitt und zwei Grenzen, die zeigen, wie weit der Prozess üblicherweise schwankt. Ein Tag innerhalb der Grenzen ist sehr wahrscheinlich gewöhnliche Schwankung. Liegt ein Tag außerhalb, oder liegen mehrere Tage hintereinander auf derselben Seite des Durchschnitts, hat sich womöglich etwas verändert.

## Zwei entgegengesetzte Fehler

Einen schlechten Tag kann man auf zwei entgegengesetzte Arten falsch lesen. Was folgt, ist meine Einschätzung, keine Sammlung belegter Fälle.

Der erste Fehler behandelt jeden schlechten Tag als Problem. Man ändert eine Regel, führt eine Kontrolle ein, setzt eine Besprechung an. Am nächsten Tag ist die Zahl wieder normal, und die Maßnahme scheint gewirkt zu haben. Vielleicht wäre sie aber auch von selbst zurückgegangen, und nun hat der Prozess eine Regel mehr, deren Grund niemand kennt.

**Wenn wir die Regeln nach jeder Schwankung ändern, riskieren wir mehr Instabilität als Verbesserung.**

Der zweite Fehler ist das Gegenteil. Kein einzelner Tag sieht schlimm genug aus, um zu reagieren, weil jeder nur ein wenig schlechter ist als der vorige. Die Zahl steigt schleichend, und niemand bemerkt es, weil niemand die Tage nebeneinanderlegt.

Gegen beides hilft eine Regelkarte. Sie beruhigt, wenn der Tag innerhalb der üblichen Schwankung liegt, und sie schlägt an, wenn mehrere Tage hintereinander in dieselbe Richtung laufen, auch wenn keiner davon für sich alarmierend aussieht.

## Wann man sofort eingreift

Das heißt nicht, jedes Mal auf die Statistik zu warten. Eine Führungskraft muss wissen, wann sie sofort eingreift und wann sie erst mehr Informationen sammelt.

Ein Tag mit vielen Verspätungen verdient Aufmerksamkeit, aber nicht jede Abweichung verlangt ein neues Verfahren. Ich würde raten, ein schlechtes Ergebnis nicht mit dem Beweis zu verwechseln, dass sich der Prozess verändert hat, und drei Dinge zu prüfen.

Erstens: Gibt es ein akutes Sicherheits- oder Serviceproblem? Dann greifen Sie sofort ein. Ein wartender Kunde oder eine Gefahr an der Rampe wartet nicht, bis sich fünf Punkte auf einer Karte angesammelt haben.

Zweitens: Ist das Ergebnis eine Ausnahme oder Teil eines Trends?

Drittens: Haben wir eine konkrete Ursache gefunden, bevor wir den Prozess ändern?

## Menge, Wetter und Prozess

Auf der letzten Meile verfolgten wir operative Ursachen: fehlende Taschen, vermischte Trolleys, Verzögerungen bei der Vorbereitung, Probleme beim Verladen. Eine dokumentierte Methode, mit der wir den Einfluss von Wetter und Menge von einem Prozessproblem getrennt hätten, ist mir nicht bekannt.

Heute würde ich das Ergebnis, bevor ich mich auf eine Ursache festlege, mit der Arbeitsmenge, den Bedingungen des Tages und den Daten der Vortage vergleichen. 2,8 % Verspätungen an einem Tag mit außergewöhnlich hoher Menge bedeuten etwas anderes als 2,8 % an einem gewöhnlichen Tag.

{diagram}

## Drei Ebenen

**Die Kennzahl zeigt, was passiert ist. Der Trend hilft zu verstehen, ob sich etwas verändert. Die Analyse des Prozesses hilft zu entscheiden, was zu tun ist.**

Viele Betriebe springen von der ersten Ebene direkt zur dritten: Die Zahl ist schlecht, also wird sofort eine Maßnahme verlangt. Die mittlere Ebene, die zeigt, ob sich dieser Tag von den anderen unterscheidet, fehlt am häufigsten.

[Sigma & Regelkarte](/de/tools/sigma-control-chart/) zeichnet die mittlere Ebene für Ihre Tage oder Wochen und erklärt, was ein Signal ist und was nicht. Bevor Sie eine Regel ändern, füllen Sie das Blatt unten aus und kopieren es.
