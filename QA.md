# Qualitätssicherung

Stand: 13.11.2026

- 76 reguläre Aufgaben: 19 × AFB I, 38 × AFB II, 19 × AFB III
- 12 Aufgaben im Abschlusstest
- 8 Bonusaufgaben, ausschließlich AFB II/III
- 63 ausführbare SQL-Aufgaben insgesamt
- alle SQL-Musterlösungen gegen `public/seed.sql` ausgeführt
- alle angekündigten Ergebnis-/Änderungszahlen mit dem Datenbestand abgeglichen
- drei Detektiv-Filterfälle gegen die erwarteten Trefferlisten geprüft
- spätere SQL-Aufgaben ohne vorgegebenes Befehlsgerüst vorhanden
- Fehlerkorrektur-Aufgaben für SELECT/WHERE/ORDER BY/AND-OR/UPDATE/DELETE enthalten
- Aufgaben mit vorgegebenen Ausgabetabellen enthalten; automatische Prüfung vergleicht Ergebniswerte statt SQL-Wortlaut
- ER-Modell als Chen-Notation: Rechtecke = Entitätstypen, Rauten = Beziehungen, Ovale = Attribute, Primärschlüssel unterstrichen
- keine zusammengesetzten Schlüssel in der Kursdatenbank
- keine Supabase-Laufzeitabhängigkeit
- keine Zeitangaben im sichtbaren Kurs
- JavaScript-Syntax von Frontend, Netlify Function und Build-Script geprüft
- Klassen-/Lehrerlogik aus Netlify Functions + Netlify Blobs beibehalten

Hinweis: Für einen vollständigen Live-Test der Login-/Blobs-Funktionen ist ein Netlify-Kontext (`netlify dev` oder Deployment) erforderlich.

- Kapitel 3 bis 6 erweitert: jeweils vier zusätzliche Aufgaben (1 × AFB I, 2 × AFB II, 1 × AFB III)
