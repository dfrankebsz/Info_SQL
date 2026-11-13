# SQL Quest Leipzig

Interaktiver SQL-Lernkurs für Netlify mit einer festen Übungsdatenbank **EventHub Leipzig**.

## Architektur

- **Frontend:** statisches HTML/CSS/JavaScript in `public/`
- **SQL-Übungsdatenbank:** SQLite über `sql.js`/WebAssembly direkt im Browser
- **Konten, Klassen, Fortschritt, XP:** Netlify Functions + Netlify Blobs
- **Kein Supabase und kein SQL-Editor bei Supabase erforderlich**
- **Kein allgemeiner AUTH-Schlüssel erforderlich**

Die SQL-Datenbank für Übungen liegt absichtlich **nicht** in Netlify Blobs: Blobs speichert Konten/Fortschritt als Key-Value-Daten; die relationale Übungsdatenbank läuft isoliert pro Browser. Dadurch kann jede Person UPDATE und DELETE gefahrlos ausprobieren und die Datenbank jederzeit auf den Ausgangszustand zurücksetzen.

## Deployment über GitHub + Netlify

1. Den Inhalt dieses ZIP-Ordners als GitHub-Repository hochladen.
2. In Netlify **Add new project → Import an existing project** und das Repository auswählen.
3. Build- und Publish-Einstellungen werden aus `netlify.toml` übernommen.
4. Unter **Project configuration → Environment variables** setzen:
   - `TEACHER_SETUP_CODE` = ein eigener langer Einrichtungs-Code für Lehrkräfte.
   - optional `BLOBS_REGION` = `eu-central-1` (ist bereits der Standard im Projekt).
5. Deploy starten.
6. Im Kurs auf **Anmelden → Lehrerzugang anlegen** gehen und Klasse, Nickname, Passwort sowie den Setup-Code eingeben.
7. Anschließend können Schülerkonten nur für bereits eingerichtete Klassen angelegt werden.

`TEACHER_SETUP_CODE` wird nur zum Anlegen neuer Lehrerzugänge benötigt. Bereits bestehende Konten können sich auch anmelden, wenn der Code später aus den Environment Variables entfernt wird.

## Funktionen

- Bearbeitung als Gast oder mit Konto
- Klassenbasierte Schüler- und Lehrerzuordnung
- Passwort-Hashing mit Node.js `scrypt`
- 30-Tage-Sessions
- Lehrerübersicht nur für die eigene Klasse
- Nutzer löschen, Passwort zurücksetzen, einzelnen oder gesamten Klassenfortschritt zurücksetzen
- 48 reguläre Aufgaben + 8 Bonusaufgaben
- AFB-Kennzeichnung an jeder Aufgabe
- interaktives ER-Modell, WHERE-Regler und LIKE-Muster-Visualisierung
- SQL-Labor mit echten Ergebnistabellen
- automatische SQL-Kontrolle anhand des Resultats statt anhand des exakten Wortlauts
- UPDATE/DELETE werden gegen eine frische, isolierte Datenbankinstanz geprüft
- erwartete Ergebnis-/Änderungszahl vor jeder SQL-Aufgabe
- XP, Badges, Themes, Avatare, Haustiere und Outfits
- Abschluss-Test und 10-Punkte-Selbstcheck
- Lernjournal als druckoptimierte Ansicht zum Speichern als PDF

## SQL-Engine

Beim Netlify-Build wird `sql.js` aus `node_modules` nach `public/vendor/` kopiert. Dadurch wird die SQL-Engine nach dem Deployment vom eigenen Netlify-Projekt ausgeliefert und nicht erst zur Laufzeit von einem CDN geladen.

## Fachlicher Umfang

Der Kurs baut schrittweise auf:

1. Datenbank, ER-Modell, Relationenmodell und Schlüssel
2. SELECT und FROM
3. WHERE und Vergleichsoperatoren
4. ORDER BY und NOT
5. LIKE, AND, OR und Klammern
6. UPDATE und DELETE
7. Abschlusstest

Die Aufgaben orientieren sich an den bereitgestellten Übungsformaten, verwenden aber eine eigene Datenbank und neue Kontexte. Die im Ausgangsmaterial verlinkten W3Schools-Videos und -Seiten sind im Kurs als weiterführende Ressourcen integriert.

## Lokale Entwicklung

```bash
npm install
npm run build
npx netlify dev
```

Für die vollständige Anmeldung/Blobs-Funktionalität ist Netlify Dev oder ein Netlify-Deploy erforderlich. Das Frontend selbst bleibt statisch deploybar.
