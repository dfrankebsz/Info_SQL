# Architektur

Browser
→ statischer Netlify-Kurs
→ sql.js / SQLite-WASM für die persönliche Übungsdatenbank

Browser
→ Netlify Functions
→ Netlify Blobs für Nutzer, Klassen, Sessions und Fortschritt

## Trennung der Verantwortlichkeiten

**SQLite/sql.js**
- EventHub-Tabellen und Seed-Datensätze
- echte SELECT-/UPDATE-/DELETE-Ausführung
- Ergebnistabellen und automatische Ergebnisprüfung
- pro Browser isoliert und jederzeit zurücksetzbar

**Netlify Blobs**
- Nutzerkonten und Passwort-Hashes
- Klasse und Rolle
- Sessions
- Aufgabenfortschritt, XP, Badges und Freischaltungen
- Lehrerübersicht

Es gibt keine Supabase-Abhängigkeit und keinen allgemeinen AUTH-Schlüssel. Der erste Lehrerzugang wird mit `TEACHER_SETUP_CODE` angelegt.
