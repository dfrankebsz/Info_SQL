# SQL Quest Leipzig

Interaktiver SQL-Lernkurs für Netlify mit der festen Übungsdatenbank **EventHub Leipzig**.

## Architektur

- **Frontend:** statisches HTML/CSS/JavaScript in `public/`
- **SQL-Übungsdatenbank:** SQLite über `sql.js`/WebAssembly direkt im Browser
- **Konten, Klassen, Fortschritt, XP:** Netlify Functions + Netlify Blobs
- **Kein Supabase und kein Supabase-SQL-Editor erforderlich**
- **Kein allgemeiner AUTH-Schlüssel erforderlich**

Die relationale SQL-Übungsdatenbank läuft absichtlich isoliert pro Browser. Dadurch können Schülerinnen und Schüler SELECT, UPDATE und DELETE real ausführen, ohne eine gemeinsame Datenbank zu beschädigen. Mit „Datenbank zurücksetzen“ wird jederzeit der Ausgangszustand hergestellt.

## Deployment über GitHub + Netlify

1. Inhalt des ZIP-Ordners als GitHub-Repository hochladen.
2. In Netlify **Add new project → Import an existing project** und das Repository auswählen.
3. Build- und Publish-Einstellungen werden aus `netlify.toml` übernommen.
4. Unter **Project configuration → Environment variables** setzen:
   - `TEACHER_SETUP_CODE` = eigener langer Einrichtungs-Code für Lehrkräfte.
   - optional `BLOBS_REGION` = `eu-central-1`.
5. Deploy starten.
6. Im Kurs auf **Anmelden → Lehrerzugang anlegen** gehen und Klasse, Nickname, Passwort sowie den Setup-Code eingeben.
7. Schülerkonten können anschließend nur für bereits eingerichtete Klassen angelegt werden.

## Didaktischer Aufbau

1. **EventHub-Detektivfall:** drei echte Tabellenfilter-Aufgaben ohne SQL. Mehrere Filter müssen kombiniert werden.
2. **EventHub-Datenbank:** ER-Modell in Chen-Notation mit Rechtecken, Rauten und Ovalen; anschließend Relationenmodell.
3. **SELECT und FROM:** zunächst mit Gerüsten, später vollständige Statements ohne Vorgaben.
4. **WHERE und Vergleiche:** Übertragung der Filterlogik in SQL.
5. **ORDER BY und NOT**
6. **LIKE, AND, OR und Klammern**
7. **UPDATE und DELETE**
8. **Abschlusstest**

Innerhalb der Kapitel steigt die Schwierigkeit. Spätere Aufgaben geben keine Teile des SQL-Befehls mehr vor.

## Aufgabenformate

- 60 reguläre Aufgaben
- 15 × AFB I, 30 × AFB II, 15 × AFB III
- 12 Aufgaben im Abschlusstest
- 8 Bonusmissionen in AFB II/III
- echte SQL-Abfragen mit Ergebnistabellen
- Tabellenfilter im Detektivfall
- Fehler in SQL-Befehlen finden und korrigieren
- SQL-Befehle aus vorgegebenen Ausgabetabellen entwickeln
- Multiple Choice, Mehrfachauswahl, Richtig/Falsch, Drag & Drop, Reihenfolge, Freitext

Vor jeder SQL-Aufgabe wird die erwartete Zahl der Ergebnis- bzw. Änderungsdatensätze genannt. Die automatische Kontrolle bewertet bei SELECT-Aufgaben die **erzeugte Ergebnistabelle**, nicht den exakten Wortlaut. Dadurch werden unterschiedliche fachlich korrekte SQL-Befehle akzeptiert, wenn sie dieselbe Ausgabe erzeugen.

## Weitere Funktionen

- Gastmodus sowie Konten mit Klasse + Nickname + Passwort
- Klassenbasierter Lehrerzugang
- Nutzer löschen, Passwörter zurücksetzen, Fortschritt einzeln oder klassenweit zurücksetzen
- SQL-Labor mit Tabellenbrowser und Reset-Funktion
- W3Schools-Videos und Tutorialseiten aus dem Unterrichtsmaterial verlinkt
- XP, Kapitel-Badges, Themes, Avatare, Haustiere und Outfits
- 10-Punkte-Selbstcheck auf Skala 1–5 mit reversiblem Erledigt-Status
- Lernjournal mit allen abgeschlossenen Aufgaben und eigenen Antworten als druckoptimierte PDF-Ansicht
- Glossar

## SQL-Engine

Beim Netlify-Build wird `sql.js` aus `node_modules` nach `public/vendor/` kopiert. Die Engine wird danach vom eigenen Netlify-Projekt ausgeliefert.

## Lokale Entwicklung

```bash
npm install
npm run build
npx netlify dev
```

Für Anmeldung und Netlify Blobs ist `netlify dev` oder ein echtes Netlify-Deployment erforderlich.
