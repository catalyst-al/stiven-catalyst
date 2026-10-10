---
title: 'Ein schlechter Tag oder ein Problem?'
date: 2026-10-10T18:00:00Z
category: Betrieb
series: improvement
status: published
featured: true
summary: Ein schlechter Tag ist ein Signal zum Prüfen. Er ist nicht automatisch der Beweis, dass der ganze Prozess geändert werden muss.
teaser: 2,8 %. So hoch war Delay in einem Bericht vom Juni 2025. War das ein schlechter Tag oder ein Problem? Aus dieser Zahl allein kann ich es nicht sagen.
description: "Ein Tag mit schlechten Kennzahlen: was ich belegen kann und was nicht, warum eine einzelne Zahl nicht zeigt, ob sich der Prozess verändert hat, die Idee der Regelkarte, die zwei entgegengesetzten Fehler, und vier Fragen, bevor Sie den Prozess ändern."
deck: 'Der fünfte Essay der Reihe „Verbesserung, die hält“: wie wir die Kennzahlen täglich verfolgten, warum eine einzelne Zahl nicht zeigt, ob sich der Prozess verändert hat, die zwei entgegengesetzten Fehler, wann man sofort eingreift, und vier Fragen, bevor Sie den Prozess ändern.'
relatedTools:
  - /tools/sigma-control-chart/
  - /tools/delay-analyzer/
checklist:
  title: Bevor Sie den Prozess ändern
  fill: true
  note: Eine Orientierung, wie ich es heute machen würde. Es ist keine Methode, deren Einsatz ich belegen kann.
  items:
    - label: Gibt es ein akutes Sicherheits- oder Serviceproblem?
      hint: Wenn ja, greifen Sie jetzt ein. Die Analyse kommt danach.
    - label: Wie verhält sich der Tag zur Menge, zu den Bedingungen und zu den Tagen davor?
      hint: Wie viel Arbeit es gab, was an dem Tag passiert ist, wie die Tage davor aussahen.
    - label: Ist es eine Ausnahme oder Teil eines Trends?
      hint: Ein ungewöhnlicher Tag, oder mehrere Tage hintereinander in dieselbe Richtung?
    - label: Haben wir eine konkrete Ursache gefunden?
      hint: Bevor wir den Prozess ändern, nicht danach.
---

2,8 %.

So hoch war Delay in einem Bericht vom Juni 2025.

War das ein schlechter Tag oder ein Problem? Aus dieser Zahl allein kann ich es nicht sagen. Und genau hier beginnt dieser Essay.

## Was ich habe und was nicht

Auf der letzten Meile verfolgten wir Delay, Damage, Incomplete und Loading Time jeden Tag. Die Ergebnisse wurden im Daily Stand-up besprochen, und für Abweichungen wurden Erklärungen verlangt. Wir analysierten sie auch nach DSP und nach operativen Problemen.

Ich weiß nicht, ob wir abwarteten, ob sich ein Ergebnis wiederholte, bevor wir Maßnahmen ergriffen, oder ob wir immer sofort eingriffen. Ich weiß nicht, ob ich selbst eine statistische Regelkarte mit Eingriffsgrenzen verwendet habe. Bei täglichen oder wöchentlichen Trends in Excel oder Power BI bin ich mir nicht sicher. Und ich möchte meine Kenntnis von Six Sigma nicht als Beweis darstellen, dass ich die Methode in dieser Arbeit eingesetzt habe.

Ich habe auch keinen dokumentierten Fall, in dem ein schlechter Tag als Krise behandelt wurde und am nächsten Tag alles wieder normal war. Und auch nicht das Gegenteil: eine langsame Verschlechterung, die zu spät erkannt wurde.

Deshalb ist dieser Essay keine Geschichte. Es ist eine Frage, die sich jeder Führungskraft jeden Tag stellt, und die Art, wie ich sie heute beantworten würde.

## Eine Zahl ohne Geschichte

2,8 % allein sagt nicht viel. Verglichen womit?

Nehmen wir ein erfundenes Beispiel, nur um den Gedanken klar zu machen. Angenommen, der Durchschnitt der letzten Wochen lag bei 2,5 %. Ist 2,8 % ein Signal?

Es kommt darauf an. Jeder Prozess schwankt. Kein Tag fällt genauso aus wie der nächste, auch wenn niemand etwas verändert hat. Die Menge ändert sich, die Menschen ändern sich, die Touren ändern sich. Die Frage ist nicht, ob heute schlechter ist als der Durchschnitt. Das werden viele Tage sein. Die Frage ist, ob heute schlechter ist, als dieser Prozess normalerweise schwankt.

Das ist die Idee der Regelkarte. Sie trägt die Tage nacheinander ein, mit dem Durchschnitt und zwei Grenzen, die zeigen, wie weit der Prozess normalerweise schwankt. Ein Tag innerhalb der Grenzen ist sehr wahrscheinlich gewöhnliche Schwankung. Ein Tag außerhalb, oder mehrere Tage hintereinander auf derselben Seite des Durchschnitts, deuten darauf hin, dass sich etwas verändert haben könnte.

Ich sage nicht, dass ich sie so eingesetzt habe. Ich sage, dass ich es heute so machen würde.

## Zwei entgegengesetzte Fehler

Es gibt zwei Arten, einen schlechten Tag falsch zu lesen. Ich beschreibe sie als Meinung, nicht als Fälle aus meiner Erfahrung.

Die erste: Jeder schlechte Tag wird als Problem behandelt. Eine Regel wird geändert, eine Kontrolle hinzugefügt, eine Besprechung angesetzt. Am nächsten Tag ist die Zahl wieder normal, und es sieht so aus, als hätte die Maßnahme gewirkt. Aber vielleicht wäre sie von selbst zurückgekommen. Und jetzt hat der Prozess eine Regel mehr, von der niemand weiß, warum es sie gibt.

**Wenn wir die Regeln nach jeder Schwankung ändern, riskieren wir mehr Instabilität als Verbesserung.**

Die zweite ist das Gegenteil: Kein einzelner Tag sieht schlecht genug aus, um zu reagieren, weil jeder Tag nur ein wenig schlechter ist als gestern. Die Zahl steigt langsam, und niemand sieht es, weil niemand die Tage zusammen betrachtet.

Eine Regelkarte hilft bei beidem. Sie beruhigt Sie, wenn der Tag innerhalb der normalen Schwankung liegt. Und sie weckt Sie, wenn mehrere Tage hintereinander in dieselbe Richtung gehen, auch wenn keiner davon allein alarmierend aussieht.

## Wann man sofort eingreift

Das heißt nicht, jedes Mal auf die Statistik zu warten.

Ein Tag mit vielen Verspätungen verdient Aufmerksamkeit. Aber nicht jede Abweichung verlangt ein neues Verfahren. Ich würde einer Führungskraft sagen, ein schlechtes Ergebnis nicht mit dem Beweis zu verwechseln, dass sich der Prozess verändert hat. Und ich würde drei Dinge prüfen.

Erstens: Haben wir ein akutes Sicherheits- oder Serviceproblem? Wenn ja, greift man jetzt ein. Ein Kunde, der wartet, oder eine Gefahr an der Rampe wartet nicht, bis sich fünf Punkte in einem Diagramm gesammelt haben.

Zweitens: Ist das Ergebnis eine Ausnahme oder Teil eines Trends?

Drittens: Haben wir eine konkrete Ursache gefunden, bevor wir den Prozess ändern?

**Eine Führungskraft muss wissen, wann sie sofort eingreift und wann sie mehr Informationen sammelt.**

## Menge, Wetter und Prozess

Auf der letzten Meile verfolgten wir operative Ursachen: fehlende Taschen, vermischte Trolleys, Verzögerungen bei der Vorbereitung, Probleme beim Verladen. Eine dokumentierte Methode, mit der wir den Einfluss von Wetter und Menge von einem Prozessproblem getrennt hätten, kenne ich nicht.

Heute würde ich das Ergebnis, bevor ich eine Ursache festlege, mit der Arbeitsmenge, den Bedingungen des Tages und den Daten der Tage davor vergleichen. 2,8 % Verspätungen an einem Tag mit außergewöhnlicher Menge bedeuten nicht dasselbe wie 2,8 % an einem gewöhnlichen Tag.

## Drei Ebenen

**Die Kennzahl zeigt, was passiert ist. Der Trend hilft zu verstehen, ob sich etwas verändert. Die Analyse des Prozesses hilft zu entscheiden, was zu tun ist.**

Viele Betriebe springen direkt von der ersten Ebene zur dritten. Die Zahl ist schlecht, und sofort wird eine Maßnahme verlangt. Die mittlere Ebene, die sagt, ob dieser Tag anders ist als die anderen, ist die, die am häufigsten fehlt.

[Sigma & Regelkarte](/de/tools/sigma-control-chart/) zeichnet diese Ebene für Ihre Tage oder Wochen, mit einer Erklärung, was ein Signal ist und was nicht. Das Blatt unten können Sie hier ausfüllen, bevor Sie eine Regel ändern, und kopieren.

**Ein schlechter Tag ist ein Signal zum Prüfen. Er ist nicht automatisch der Beweis, dass der ganze Prozess geändert werden muss.**
