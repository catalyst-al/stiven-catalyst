---
title: 'DMAIC ohne Black Belt'
date: 2026-10-10T19:00:00Z
category: Betrieb
series: improvement
status: published
featured: true
summary: Man braucht kein Black-Belt-Zertifikat, um gute Fragen zu stellen. Aber wer nur den Namen einer Methode kennt, kann nicht behaupten, sie angewendet zu haben.
teaser: Der Wert von DMAIC liegt nicht im Zertifikat. Er liegt in der Disziplin, nicht sofort vom Problem zur Lösung zu springen.
description: "DMAIC ohne Zertifikat: fünf Phasen, wie ich sie auf der letzten Meile erlebte, warum Control am schwersten ist, und fünf Fragen für die Schichtleitung."
deck: 'Der sechste Essay der Reihe „Verbesserung, die hält“: was DMAIC ist, welche Phasen ich in meiner Arbeit hatte und welche nicht, warum Control die schwierigste Phase ist, und fünf Fragen für eine Schichtleitung, die kein Black Belt ist.'
relatedTools:
  - /tools/six-sigma-dmaic/
  - /tools/five-whys/
checklist:
  title: DMAIC in fünf Fragen
  fill: true
  note: Eine Orientierung, wie ich heute vorgehen würde, kein formales Six-Sigma-Projekt, das ich geleitet habe.
  items:
    - label: Was ist das konkrete Problem?
      hint: Ein Problem, ein Ort, ein Zeitraum. Nicht „die Qualität ist schlecht“.
    - label: Wie messen wir es?
      hint: Welche Zahl, aus welcher Quelle und wie hoch sie war, bevor wir angefangen haben.
    - label: Was verursacht es?
      hint: Die Ursache, die wir geprüft haben, nicht die erste, die uns einfällt.
    - label: Was können wir ändern?
      hint: Eine Änderung, die wir ausprobieren können, kein neues Verfahren für alles.
    - label: Wie prüfen wir, dass die Verbesserung hält?
      hint: Wer sie verfolgt, wie oft und was wir tun, wenn das Problem zurückkommt.
# Three moves for tomorrow's shift, shown before the text.
firstMove:
  - Schreiben Sie das heutige Problem als ein Problem, einen Ort, einen Zeitraum.
  - Legen Sie fest, wie Sie es messen und wo es stand, bevor Sie begonnen haben.
  - Planen Sie jetzt, wer nächsten Monat prüft, ob es gehalten hat, nicht erst, wenn das Problem verschwunden scheint.
# The picture of the system in this essay (lib/diagrams.js); the "{diagram}" paragraph in the text marks its place.
diagram: dmaic-loop
---

Um gute Fragen zu stellen, braucht man kein Black-Belt-Zertifikat. Wer behaupten will, eine Methode angewendet zu haben, muss aber mehr kennen als ihren Namen.

Zwischen diesen beiden Sätzen bewegt sich dieser Essay.

DMAIC ist der Six-Sigma-Zyklus zur Verbesserung eines Prozesses: Define, Measure, Analyze, Improve, Control. Man legt das Problem fest, misst es, analysiert die Ursachen, verbessert und prüft, ob die Verbesserung hält. In Büchern sieht das nach einem großen Projekt aus, mit Team, Frist und jemandem mit farbigem Gürtel.

Was ich mitbringe, ist Erfahrung mit echten operativen Problemen auf der letzten Meile: Damage, Incomplete, Delay und Loading Time. Six Sigma, Pareto und 5 Why sind Methoden, die ich kenne und die in mein Verständnis von Führung eingegangen sind. Ein bestätigtes Zertifikat habe ich nicht, weder Yellow noch Green noch Black Belt. Ich habe kein Projekt, in dem ich alle fünf Phasen von DMAIC angewendet und dokumentiert hätte, und nicht einmal ein Pareto oder ein 5 Why, das ich als von mir selbst von Anfang bis Ende durchgeführt vorweisen kann. In [Pareto und 5 Why in der Praxis](/de/insights/pareto-and-5-why-in-practice/) habe ich über ein 5 Why mit nur zwei dokumentierten „Warum“ geschrieben und darüber, warum ich die übrigen nicht ergänzt habe.

## Die fünf Phasen, so wie ich sie hatte

Legt man diese Erfahrung ungeschönt neben DMAIC, sieht es so aus:

**Define.** Wir arbeiteten mit Problemen, die über die Kennzahlen festgelegt waren.

**Measure.** Wir verfolgten die operativen Ergebnisse, die Ziele und die Abweichungen.

**Analyze.** Wir untersuchten die Gründe für Verspätungen, fehlende Taschen und Probleme bei der Organisation der Ladungen.

**Improve.** Welche Maßnahmen ich selbst eingeführt habe und was sie gebracht haben, kann ich nicht genau sagen.

**Control.** Ob es nach einer Verbesserung ein dokumentiertes Kontrollsystem gab, weiß ich nicht.

Diese Liste ist aufschlussreich. Die ersten drei Phasen erledigt ein Betrieb fast von selbst, weil der Bericht sie jeden Tag verlangt: Es gibt ein Problem, es gibt eine Zahl, es gibt ein „Warum“. Die letzten beiden brauchen jemanden, der sie hält, und gerade für sie habe ich die wenigsten Belege.

{diagram}

## Die Disziplin, nicht zu springen

**Der Wert von DMAIC liegt in der Disziplin, nicht sofort vom Problem zur Lösung zu springen.**

Diese Disziplin liefert weder der Name noch ein Zertifikat. Zuerst verstehen Sie das Problem, dann messen Sie es, analysieren die Ursachen, probieren die Verbesserung aus und prüfen, ob sie weiter wirkt.

Im Betrieb ist die Versuchung immer dieselbe: der Sprung. Die Kennzahl ist schlecht, und jemand hat sofort eine Lösung. In [Ein schlechter Tag oder ein Problem?](/de/insights/a-bad-day-or-a-problem/) habe ich über das Risiko geschrieben, die Regeln nach jeder Schwankung zu ändern. DMAIC ist der strukturierte Weg, das zu vermeiden: Zwischen Problem und Lösung liegen drei Schritte, und keiner davon wird übersprungen.

## Control, die schwierigste Phase

Von den fünf Phasen würde ich heute Control hervorheben: das Halten der Verbesserung.

Ein Problem lässt sich eine Zeit lang lösen. Wird aber der Standard nicht dokumentiert, werden die Leute nicht geschult und prüft niemand das Ergebnis, droht das Problem zurückzukommen.

Deshalb heißt diese Reihe „Verbesserung, die hält“. Die Verbesserung muss weiterlaufen, auch wenn die Führungskraft, die sie angestoßen hat, nicht mehr da ist. Hält sie nur, solange diese Person da ist, dann war es die Anwesenheit eines Menschen, die gehalten hat.

**Ein Problem ist nicht gelöst, nur weil es heute nicht wieder aufgetreten ist.**

## Für die Schichtleitung

Einer Schichtleitung würde ich sagen, dass sie kein Black Belt sein muss, um systematisch zu denken. Für den Anfang genügen fünf Fragen, eine für jede Phase:

1. **Was ist das konkrete Problem?**
2. **Wie messen wir es?**
3. **Was verursacht es?**
4. **Was können wir ändern?**
5. **Wie prüfen wir, dass die Verbesserung hält?**

Nicht jedes Problem der Schicht muss ein komplexes Projekt werden. Verfahren zu ändern, nur weil eine Kennzahl schlecht war, sollte sie aber vermeiden.

Das Blatt unten können Sie für ein einzelnes Problem ausfüllen und kopieren. Wenn Sie den ganzen Zyklus an einem vollständigen Fall sehen möchten: [Six Sigma im Lager](/de/tools/six-sigma-dmaic/) geht Schritt für Schritt einen Übungsfall durch. Es ist ein Lehrbeispiel und stammt nicht aus meiner Arbeit.

Fünf Fragen reichen, um den Sprung vom Problem direkt zur Lösung zu verhindern, und in einer gewöhnlichen Schicht ist das die halbe Arbeit.
