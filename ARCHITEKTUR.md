# Architekturhinweise

## Warum zwei Speicherarten?

**sql.js / SQLite im Browser** ist die echte relationale Datenbank für SQL-Übungen. Jede Browserinstanz erhält ihren eigenen Ausgangsdatenbestand. Dadurch sind SELECT, UPDATE und DELETE vollständig ausführbar, ohne andere Lernende zu beeinflussen.

**Netlify Blobs** speichert dagegen nur nicht-relationale Kursdaten wie Konten, Sessions, Fortschritt, XP, Einstellungen und Checklisten. Der Browser greift nie direkt auf Blobs zu; alle Zugriffe laufen über `netlify/functions/api.mjs`.

## Datenspeicher in Blobs

- `sqlq-classes`: eingerichtete Klassen
- `sqlq-users`: Nutzerkonten mit Passwort-Hash und Rolle
- `sqlq-progress`: Fortschritt pro Klasse/Nutzer-ID
- `sqlq-sessions`: gehashte Session-Tokens

## Sicherheit

- Passwörter werden mit `scrypt` + individuellem Salt gespeichert.
- Session-Tokens werden nur gehasht als Blob-Key gespeichert.
- Lehrkräfte können ausschließlich Schülerkonten der eigenen Klasse verwalten.
- Der Lehrer-Setup-Code steht ausschließlich als Netlify-Environment-Variable zur Verfügung.
- SQL der Lernenden wird nur in einer lokalen SQLite/WASM-Instanz ausgeführt, nicht auf dem Server.
