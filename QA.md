# Qualitätssicherung

Stand: 13.11.2026

- 48 reguläre Aufgaben: 12 × AFB I, 24 × AFB II, 12 × AFB III
- 8 Bonusaufgaben, ausschließlich AFB II/III
- 37 SQL-Aufgaben mit ausführbaren Musterlösungen
- alle 37 SQL-Musterlösungen automatisch gegen `public/seed.sql` ausgeführt
- alle angekündigten Ergebnis-/Änderungszahlen mit dem Datenbestand abgeglichen
- keine zusammengesetzten Schlüssel in der Kursdatenbank
- keine Supabase-Laufzeitabhängigkeit
- keine Zeitangaben im sichtbaren Kurs
- JavaScript-Syntax von Frontend, Netlify Function und Build-Script geprüft
- HTML-Grundstruktur geparst

Hinweis: Die Netlify-Blobs-Funktionen benötigen für einen Live-Test einen Netlify-Kontext bzw. `netlify dev`. Die API ist nach der aktuellen Fetch-Handler-Struktur für Netlify Functions aufgebaut.
