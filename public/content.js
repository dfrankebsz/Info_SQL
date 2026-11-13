window.SQL_COURSE = {
  "meta": {
    "title": "SQL Quest Leipzig",
    "subtitle": "EventHub-Datenbank · SQL Schritt für Schritt",
    "version": "2.1",
    "created": "13.11.2026"
  },
  "chapters": [
    {
      "id": "detective",
      "icon": "🕵️",
      "title": "1 · Der EventHub-Detektivfall",
      "subtitle": "Filtern, bevor SQL überhaupt auftaucht",
      "intro": "<p>Sie arbeiten zunächst wie ein Daten-Detektiv. EventHub Leipzig erhält konkrete Anfragen aus dem Betrieb. Die Daten stehen bereits in Tabellen – Ihre Aufgabe ist es, sie mit mehreren Filtern so einzugrenzen, dass nur die passenden Datensätze übrig bleiben.</p><p>Genau diese Denkweise brauchen Sie später für SQL: <strong>Welche Tabelle?</strong> · <strong>Welche Spalten?</strong> · <strong>Welche Bedingungen?</strong> · <strong>Wie sollen die Treffer sortiert werden?</strong></p><div class=\"warning\"><strong>Wichtig:</strong> In diesem Kapitel schreiben Sie noch keine SQL-Befehle. Sie lösen die Fälle mit Tabellenfiltern und formulieren die Logik in Alltagssprache.</div>",
      "videos": []
    },
    {
      "id": "model",
      "icon": "🧭",
      "title": "2 · Die EventHub-Datenbank",
      "subtitle": "ER-Modell, Tabellen, Schlüssel und feste Kursdatenbank",
      "intro": "<p>Jetzt sehen Sie die Datenbank, mit der Sie im gesamten Kurs arbeiten. Das <strong>ER-Modell</strong> zeigt Entitätstypen als <strong>Rechtecke</strong>, Beziehungen als <strong>Rauten</strong> und Attribute als <strong>Ovale</strong>. Primärschlüsselattribute sind unterstrichen.</p><p>Beim Übergang in das Relationenmodell werden aus Entitätstypen <strong>Tabellen</strong>, aus Attributen <strong>Spalten</strong> und aus n:m-Beziehungen eigene Beziehungstabellen. Aus <em>bucht</em> entsteht <strong>buchungen</strong>; aus <em>wird betreut von</em> entsteht <strong>einsaetze</strong>.</p>",
      "videos": [
        [
          "W3Schools · SQL Introduction",
          "https://www.youtube.com/watch?v=zpnHsWOy0RY&list=PLP9IO4UYNF0UQkBXlTMSw0CYsxv-GDkkI&index=1"
        ],
        [
          "W3Schools · SQL Tutorial",
          "https://www.w3schools.com/sql/default.asp"
        ]
      ]
    },
    {
      "id": "select",
      "icon": "🔎",
      "title": "3 · SELECT und FROM",
      "subtitle": "Aus Tabellen gezielt Ausgabespalten erzeugen",
      "intro": "<p><strong>SELECT</strong> legt fest, welche Spalten im Ergebnis erscheinen. <strong>FROM</strong> legt fest, aus welcher Tabelle gelesen wird. Mit <code>*</code> werden alle Spalten ausgegeben.</p><div class=\"syntax\"><code>SELECT Titel, Preis<br>FROM veranstaltungen;</code></div><p>Ein SQL-Befehl wird auch <strong>Statement</strong> genannt. Ab jetzt werden die Hilfen schrittweise reduziert, bis Sie komplette Statements selbstständig formulieren.</p>",
      "videos": [
        [
          "W3Schools · SELECT",
          "https://www.w3schools.com/sql/sql_select.asp"
        ],
        [
          "W3Schools · SQL-Videos",
          "https://www.w3schools.com/sql/sql_videos.asp"
        ]
      ]
    },
    {
      "id": "where",
      "icon": "🎯",
      "title": "4 · WHERE und Vergleiche",
      "subtitle": "Die Filterlogik des Einstiegs als SQL formulieren",
      "intro": "<p><strong>WHERE</strong> übernimmt in SQL die Rolle des Tabellenfilters. Nur Datensätze, deren Bedingung erfüllt ist, gelangen in die Ergebnismenge.</p><div class=\"syntax\"><code>SELECT *<br>FROM veranstaltungen<br>WHERE Kategorie = 'Tech';</code></div><p>Textwerte stehen in <strong>einfachen Anführungszeichen</strong>. Für Zahlen verwenden Sie unter anderem <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code> und <code>&lt;=</code>.</p>",
      "videos": [
        [
          "W3Schools · SELECT / WHERE",
          "https://www.w3schools.com/sql/sql_select.asp"
        ],
        [
          "W3Schools · TrySQL",
          "https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all"
        ]
      ]
    },
    {
      "id": "order",
      "icon": "↕️",
      "title": "5 · ORDER BY und NOT",
      "subtitle": "Ergebnisse sortieren und Bedingungen umkehren",
      "intro": "<p><strong>ORDER BY</strong> sortiert eine Ergebnismenge. Ohne Zusatz wird aufsteigend sortiert; <strong>DESC</strong> kehrt die Sortierung um. <strong>NOT</strong> verneint eine Bedingung.</p><div class=\"syntax\"><code>SELECT Titel, Preis<br>FROM veranstaltungen<br>WHERE NOT Kategorie = 'Tech'<br>ORDER BY Preis DESC;</code></div>",
      "videos": [
        [
          "W3Schools · ORDER BY Video",
          "https://www.youtube.com/watch?v=uUO-ynRJKo0&list=PLP9IO4UYNF0UQkBXlTMSw0CYsxv-GDkkI&index=5"
        ],
        [
          "W3Schools · ORDER BY",
          "https://www.w3schools.com/sql/sql_orderby.asp"
        ]
      ]
    },
    {
      "id": "logic",
      "icon": "🧩",
      "title": "6 · LIKE, AND und OR",
      "subtitle": "Muster und mehrere Filterbedingungen kombinieren",
      "intro": "<p><strong>LIKE</strong> sucht nach Textmustern; das Prozentzeichen <strong>%</strong> steht für beliebig viele Zeichen. Mit <strong>AND</strong> müssen beide Bedingungen stimmen, mit <strong>OR</strong> mindestens eine.</p><div class=\"syntax\"><code>SELECT *<br>FROM veranstaltungen<br>WHERE (Kategorie = 'Gaming' OR Kategorie = 'Sport')<br>&nbsp;&nbsp;AND Preis &lt; 15;</code></div><p>Bei gemischten AND-/OR-Ausdrücken sind <strong>Klammern</strong> wichtig, damit die gewünschte Logik eindeutig ist.</p>",
      "videos": [
        [
          "W3Schools · LIKE / AND / OR Video",
          "https://www.youtube.com/watch?v=r1V39Iia4j0&list=PLP9IO4UYNF0UQkBXlTMSw0CYsxv-GDkkI&index=10"
        ],
        [
          "W3Schools · LIKE",
          "https://www.w3schools.com/sql/sql_like.asp"
        ],
        [
          "W3Schools · AND / OR",
          "https://www.w3schools.com/sql/sql_and_or.asp"
        ]
      ]
    },
    {
      "id": "change",
      "icon": "🛠️",
      "title": "7 · UPDATE und DELETE",
      "subtitle": "Daten gezielt verändern und sicher löschen",
      "intro": "<p><strong>UPDATE</strong> verändert bestehende Datensätze. Mit <strong>SET</strong> legen Sie neue Werte fest. <strong>DELETE</strong> entfernt Datensätze.</p><div class=\"syntax\"><code>UPDATE veranstaltungen<br>SET Preis = Preis + 2<br>WHERE EventID = 12;</code></div><div class=\"warning\"><strong>Sicherheitsregel:</strong> Prüfen Sie vor UPDATE oder DELETE mit einer SELECT-Abfrage, welche Datensätze Ihre WHERE-Bedingung tatsächlich trifft.</div>",
      "videos": [
        [
          "W3Schools · UPDATE / DELETE Video",
          "https://www.youtube.com/watch?v=i5aGjhTluxo&list=PLP9IO4UYNF0UQkBXlTMSw0CYsxv-GDkkI&index=9"
        ],
        [
          "W3Schools · UPDATE",
          "https://www.w3schools.com/sql/sql_update.asp"
        ],
        [
          "W3Schools · DELETE",
          "https://www.w3schools.com/sql/sql_delete.asp"
        ]
      ]
    }
  ],
  "tasks": [
    {
      "id": "d1",
      "chapter": "detective",
      "title": "Fall 1 · Günstiger Tech-Support",
      "afb": "II",
      "type": "filter",
      "rowHint": "2 Treffer",
      "prompt": "Für eine interne Schulkooperation werden nur <strong>Tech-Veranstaltungen mit einem Preis von höchstens 10 €</strong> gesucht. Filtern Sie die Veranstaltungstabelle passend.",
      "solution": "Filter: Kategorie = Tech UND Preis ≤ 10. Treffer: EventID 5 „Code & Coffee“ und EventID 12 „Tech Repair Café“.",
      "filterSpec": {
        "table": "veranstaltungen",
        "idField": "EventID",
        "columns": [
          "EventID",
          "Titel",
          "Kategorie",
          "Preis",
          "Datum"
        ],
        "expectedIds": [
          5,
          12
        ],
        "controls": [
          {
            "key": "Kategorie",
            "label": "Kategorie",
            "type": "select",
            "column": "Kategorie",
            "op": "=",
            "options": [
              "",
              "Tech",
              "Gaming",
              "Sport",
              "Karriere",
              "Musik",
              "Business",
              "Food",
              "Nachhaltigkeit",
              "Kultur",
              "Medien"
            ]
          },
          {
            "key": "maxPreis",
            "label": "Preis höchstens",
            "type": "number",
            "column": "Preis",
            "op": "<="
          }
        ]
      }
    },
    {
      "id": "d2",
      "chapter": "detective",
      "title": "Fall 2 · Jugendkampagne",
      "afb": "II",
      "type": "filter",
      "rowHint": "3 Treffer",
      "prompt": "Für eine Social-Media-Kampagne werden Veranstaltungen aus <strong>Gaming ODER Sport</strong> gesucht. Zusätzlich soll der Preis <strong>unter 15 €</strong> liegen.",
      "solution": "Filter: Kategorie = Gaming ODER Sport; zusätzlich Preis < 15. Treffer: EventID 10, 17 und 20.",
      "filterSpec": {
        "table": "veranstaltungen",
        "idField": "EventID",
        "columns": [
          "EventID",
          "Titel",
          "Kategorie",
          "Preis"
        ],
        "expectedIds": [
          10,
          17,
          20
        ],
        "controls": [
          {
            "key": "Kategorien",
            "label": "Kategorien",
            "type": "multiselect",
            "column": "Kategorie",
            "op": "in",
            "options": [
              "Gaming",
              "Sport",
              "Tech",
              "Musik",
              "Business"
            ]
          },
          {
            "key": "maxPreis",
            "label": "Preis kleiner als",
            "type": "number",
            "column": "Preis",
            "op": "<"
          }
        ]
      }
    },
    {
      "id": "d3",
      "chapter": "detective",
      "title": "Fall 3 · Auffällige Großbuchungen",
      "afb": "III",
      "type": "filter",
      "rowHint": "3 Treffer",
      "prompt": "Die Buchhaltung prüft <strong>bezahlte Buchungen mit mindestens 8 Tickets</strong>, die <strong>ab dem 10.11.2026</strong> eingegangen sind. Kombinieren Sie alle drei Filter.",
      "solution": "Filter: Status = bezahlt UND AnzahlTickets ≥ 8 UND Buchungsdatum ≥ 2026-11-10. Treffer: BuchungID 15, 28 und 30.",
      "filterSpec": {
        "table": "buchungen",
        "idField": "BuchungID",
        "columns": [
          "BuchungID",
          "KundenID",
          "EventID",
          "AnzahlTickets",
          "Buchungsdatum",
          "Status"
        ],
        "expectedIds": [
          15,
          28,
          30
        ],
        "controls": [
          {
            "key": "Status",
            "label": "Status",
            "type": "select",
            "column": "Status",
            "op": "=",
            "options": [
              "",
              "bezahlt",
              "reserviert",
              "storniert"
            ]
          },
          {
            "key": "minTickets",
            "label": "Tickets mindestens",
            "type": "number",
            "column": "AnzahlTickets",
            "op": ">="
          },
          {
            "key": "datumAb",
            "label": "Buchungsdatum ab",
            "type": "date",
            "column": "Buchungsdatum",
            "op": ">="
          }
        ]
      }
    },
    {
      "id": "d4",
      "chapter": "detective",
      "title": "Vom Tabellenfilter zu SQL",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche SQL-Klausel übernimmt später im Wesentlichen die Aufgabe eines Tabellenfilters?",
      "options": [
        [
          "A",
          "WHERE"
        ],
        [
          "B",
          "FROM"
        ],
        [
          "C",
          "SELECT"
        ],
        [
          "D",
          "DELETE"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "<strong>WHERE</strong> filtert Datensätze anhand einer oder mehrerer Bedingungen."
    },
    {
      "id": "d5",
      "chapter": "detective",
      "title": "Filterlogik beschreiben",
      "afb": "II",
      "type": "free",
      "rowHint": "0 – Reflexionsaufgabe",
      "prompt": "Erklären Sie anhand eines der drei Fälle, warum eine einzige Filterbedingung häufig nicht ausreicht und weshalb die Bedingungen eindeutig miteinander verknüpft werden müssen.",
      "solution": "Bei realen Anfragen gelten oft mehrere Merkmale gleichzeitig. Beispielsweise reichen bei den Großbuchungen weder „bezahlt“ noch „mindestens 8 Tickets“ allein aus. Erst die Kombination aller Bedingungen liefert die gesuchten Datensätze. SQL bildet diese Logik später mit WHERE sowie AND/OR ab."
    },
    {
      "id": "d6",
      "chapter": "detective",
      "title": "Filterplan für die Geschäftsleitung",
      "afb": "III",
      "type": "free",
      "rowHint": "3 erwartete Treffer",
      "prompt": "Die Geschäftsleitung sucht <strong>Business- oder Karriereveranstaltungen</strong>, die <strong>höchstens 10 €</strong> kosten und <strong>ab dem 01.01.2027</strong> stattfinden. Formulieren Sie einen präzisen Filterplan in Alltagssprache. Noch kein SQL.",
      "solution": "Filterplan: Kategorie ist Business ODER Karriere; UND Preis ≤ 10; UND Datum ≥ 2027-01-01. Damit bleiben EventID 9, 13 und 18 übrig."
    },
    {
      "id": "m1",
      "chapter": "model",
      "title": "Vom ER-Modell zur Tabelle",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Zuordnung ist korrekt?",
      "options": [
        [
          "A",
          "Entitätstyp → Tabelle"
        ],
        [
          "B",
          "Beziehung → einzelne Zelle"
        ],
        [
          "C",
          "Attribut → Datensatz"
        ],
        [
          "D",
          "Entität → Tabellenname"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "Ein <strong>Entitätstyp</strong> wird im Relationenmodell als <strong>Tabelle</strong> umgesetzt."
    },
    {
      "id": "m2",
      "chapter": "model",
      "title": "Grundbegriffe zuordnen",
      "afb": "I",
      "type": "drag",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Ordnen Sie die Begriffe zu.",
      "pairs": [
        [
          "Entitätstyp",
          "Tabelle"
        ],
        [
          "Entität",
          "Datensatz / Zeile"
        ],
        [
          "Attribut",
          "Spalte / Feld"
        ]
      ],
      "solution": "Entitätstyp → Tabelle; Entität → Datensatz/Zeile; Attribut → Spalte/Feld."
    },
    {
      "id": "m3",
      "chapter": "model",
      "title": "Schlüssel in BUCHUNGEN",
      "afb": "II",
      "type": "multi",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Aussagen zur Tabelle <code>buchungen</code> sind korrekt?",
      "options": [
        [
          "A",
          "BuchungID ist Primärschlüssel."
        ],
        [
          "B",
          "KundenID ist Fremdschlüssel."
        ],
        [
          "C",
          "EventID ist Fremdschlüssel."
        ],
        [
          "D",
          "AnzahlTickets ist Fremdschlüssel."
        ]
      ],
      "correct": [
        "A",
        "B",
        "C"
      ],
      "solution": "BuchungID ist der Primärschlüssel. KundenID und EventID sind Fremdschlüssel. AnzahlTickets ist ein normales Attribut der Buchung."
    },
    {
      "id": "m4",
      "chapter": "model",
      "title": "Warum entstehen BUCHUNGEN und EINSÄTZE?",
      "afb": "II",
      "type": "free",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Beschreiben Sie, warum aus den n:m-Beziehungen <em>bucht</em> und <em>wird betreut von</em> im Relationenmodell eigene Tabellen entstehen.",
      "solution": "n:m-Beziehungen können nicht durch einen einzelnen Fremdschlüssel in nur einer der beteiligten Tabellen vollständig abgebildet werden. Deshalb entstehen Beziehungstabellen mit Fremdschlüsseln zu beiden Seiten. Dort können außerdem Beziehungsattribute gespeichert werden."
    },
    {
      "id": "m5",
      "chapter": "model",
      "title": "Beziehungsattribute erkennen",
      "afb": "II",
      "type": "multi",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Attribute gehören fachlich zur konkreten Beziehung <em>bucht</em> zwischen Kunde und Veranstaltung?",
      "options": [
        [
          "A",
          "AnzahlTickets"
        ],
        [
          "B",
          "Buchungsdatum"
        ],
        [
          "C",
          "Buchungsstatus"
        ],
        [
          "D",
          "Stadt des Kunden"
        ]
      ],
      "correct": [
        "A",
        "B",
        "C"
      ],
      "solution": "AnzahlTickets, Buchungsdatum und Status beschreiben die konkrete Buchung und sind damit Beziehungsattribute. Die Stadt gehört zum Kunden."
    },
    {
      "id": "m6",
      "chapter": "model",
      "title": "Modell und SQL zusammendenken",
      "afb": "III",
      "type": "free",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Beurteilen Sie, weshalb es für spätere SQL-Abfragen wichtig ist, Primär- und Fremdschlüssel sowie die Beziehungen zwischen den Tabellen zu verstehen, auch wenn zunächst nur Abfragen innerhalb einer Tabelle geschrieben werden.",
      "solution": "Das Datenmodell zeigt, wo Informationen gespeichert sind und wie Tabellen zusammenhängen. Schon bei einfachen Abfragen muss die richtige Tabelle ausgewählt werden. Für spätere komplexere Auswertungen ist zusätzlich entscheidend, welche Schlüssel die Beziehungen zwischen Tabellen herstellen."
    },
    {
      "id": "s1",
      "chapter": "select",
      "title": "Aufgabe von SELECT",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Aufgabe hat <code>SELECT</code>?",
      "options": [
        [
          "A",
          "Es legt die auszugebenden Spalten fest."
        ],
        [
          "B",
          "Es löscht Datensätze."
        ],
        [
          "C",
          "Es sortiert automatisch."
        ],
        [
          "D",
          "Es legt einen Fremdschlüssel an."
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "SELECT bestimmt die Spalten der Ergebnistabelle."
    },
    {
      "id": "s2",
      "chapter": "select",
      "title": "Grundsyntax ordnen",
      "afb": "I",
      "type": "sequence",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Bringen Sie die Bestandteile einer einfachen Abfrage in die richtige Reihenfolge.",
      "items": [
        "SELECT Titel, Preis",
        "FROM veranstaltungen",
        ";"
      ],
      "correctOrder": [
        "SELECT Titel, Preis",
        "FROM veranstaltungen",
        ";"
      ],
      "solution": "<code>SELECT Titel, Preis FROM veranstaltungen;</code>"
    },
    {
      "id": "s3",
      "chapter": "select",
      "title": "Alle Veranstaltungen",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Informationen zu allen Veranstaltungen aus.",
      "starter": "SELECT *\nFROM ;",
      "expectedSql": "SELECT * FROM veranstaltungen;",
      "solution": "SELECT * FROM veranstaltungen;",
      "rowHint": "20 Ergebniszeilen"
    },
    {
      "id": "s4",
      "chapter": "select",
      "title": "Nur benötigte Spalten",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie für alle Veranstaltungen ausschließlich <strong>Titel</strong> und <strong>Preis</strong> aus.",
      "starter": "SELECT \nFROM veranstaltungen;",
      "expectedSql": "SELECT Titel, Preis FROM veranstaltungen;",
      "solution": "SELECT Titel, Preis FROM veranstaltungen;",
      "rowHint": "20 Ergebniszeilen"
    },
    {
      "id": "s5",
      "chapter": "select",
      "title": "SQL aus einer Ausgabetabelle ableiten",
      "afb": "II",
      "type": "sql",
      "prompt": "Schreiben Sie einen SQL-Befehl, der exakt die folgende Ausgabetabelle erzeugt. Unterschiedliche SQL-Schreibweisen sind zulässig, sofern das Ergebnis fachlich identisch ist.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>Bezeichnung</th><th>Stadt</th></tr></thead><tbody><tr><td>Werk 2</td><td>Leipzig</td></tr><tr><td>Westbad</td><td>Leipzig</td></tr><tr><td>Kongresshalle</td><td>Leipzig</td></tr><tr><td>Täubchenthal</td><td>Leipzig</td></tr><tr><td>Messehalle 5</td><td>Leipzig</td></tr><tr><td>Kulturpalast</td><td>Dresden</td></tr><tr><td>Volkspark Halle</td><td>Halle</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT Bezeichnung, Stadt FROM orte;",
      "solution": "SELECT Bezeichnung, Stadt FROM orte;",
      "rowHint": "7 Ergebniszeilen"
    },
    {
      "id": "s6",
      "chapter": "select",
      "title": "Fehlerhaften SELECT-Befehl reparieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Der folgende Befehl enthält einen Syntaxfehler. Korrigieren Sie ihn so, dass Titel und Preis aller Veranstaltungen ausgegeben werden.",
      "starter": "SELECT Titel Preis\nFROM veranstaltungen;",
      "expectedSql": "SELECT Titel, Preis FROM veranstaltungen;",
      "solution": "SELECT Titel, Preis FROM veranstaltungen;",
      "rowHint": "20 Ergebniszeilen"
    },
    {
      "id": "s7",
      "chapter": "select",
      "title": "Kontaktliste selbstständig erzeugen",
      "afb": "III",
      "type": "sql",
      "prompt": "Erzeugen Sie ohne vorgegebenes SQL-Gerüst eine Ausgabetabelle mit <strong>Name, Stadt und Kundentyp</strong> für alle Kundendatensätze.",
      "starter": "",
      "expectedSql": "SELECT Name, Stadt, Kundentyp FROM kunden;",
      "solution": "SELECT Name, Stadt, Kundentyp FROM kunden;",
      "rowHint": "24 Ergebniszeilen"
    },
    {
      "id": "s8",
      "chapter": "select",
      "title": "Ausgabeanforderung präzise umsetzen",
      "afb": "III",
      "type": "sql",
      "prompt": "Die Projektleitung benötigt aus der Mitarbeitendentabelle ausschließlich <strong>MitarbeiterID, Vorname, Nachname und Bereich</strong>. Schreiben Sie den vollständigen SQL-Befehl selbstständig.",
      "starter": "",
      "expectedSql": "SELECT MitarbeiterID, Vorname, Nachname, Bereich FROM mitarbeitende;",
      "solution": "SELECT MitarbeiterID, Vorname, Nachname, Bereich FROM mitarbeitende;",
      "rowHint": "12 Ergebniszeilen"
    },
    {
      "id": "s9",
      "chapter": "select",
      "title": "SELECT-Spalten präzise erkennen",
      "afb": "I",
      "type": "single",
      "rowHint": "Theorieaufgabe",
      "prompt": "Welcher SQL-Befehl gibt ausschließlich die Spalten <strong>OrtID</strong> und <strong>Bezeichnung</strong> aus der Tabelle <strong>orte</strong> aus?",
      "options": [
        [
          "A",
          "SELECT OrtID, Bezeichnung FROM orte;"
        ],
        [
          "B",
          "SELECT * FROM OrtID, Bezeichnung;"
        ],
        [
          "C",
          "FROM orte SELECT OrtID, Bezeichnung;"
        ],
        [
          "D",
          "SELECT orte FROM OrtID, Bezeichnung;"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "SELECT OrtID, Bezeichnung FROM orte;"
    },
    {
      "id": "s10",
      "chapter": "select",
      "title": "Ausgabetabelle der Veranstaltungsorte rekonstruieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "7 Ergebniszeilen",
      "prompt": "Schreiben Sie einen vollständigen SQL-Befehl, der exakt diese Ausgabetabelle erzeugt. Es sollen nur die drei sichtbaren Spalten ausgegeben werden.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>OrtID</th><th>Bezeichnung</th><th>Kapazitaet</th></tr></thead><tbody><tr><td>1</td><td>Werk 2</td><td>700</td></tr><tr><td>2</td><td>Westbad</td><td>450</td></tr><tr><td>3</td><td>Kongresshalle</td><td>1200</td></tr><tr><td>4</td><td>Täubchenthal</td><td>1000</td></tr><tr><td>5</td><td>Messehalle 5</td><td>5000</td></tr><tr><td>6</td><td>Kulturpalast</td><td>1800</td></tr><tr><td>7</td><td>Volkspark Halle</td><td>2500</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT OrtID, Bezeichnung, Kapazitaet FROM orte;",
      "solution": "SELECT OrtID, Bezeichnung, Kapazitaet FROM orte;"
    },
    {
      "id": "s11",
      "chapter": "select",
      "title": "Kommafehler im SELECT korrigieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "24 Ergebniszeilen",
      "prompt": "Der folgende Befehl soll <strong>Name</strong> und <strong>Stadt</strong> aller Kundendatensätze ausgeben. Korrigieren Sie den Fehler.",
      "starter": "SELECT Name Stadt\nFROM kunden;",
      "expectedSql": "SELECT Name, Stadt FROM kunden;",
      "solution": "SELECT Name, Stadt FROM kunden;"
    },
    {
      "id": "s12",
      "chapter": "select",
      "title": "Buchungsexport vollständig selbst formulieren",
      "afb": "III",
      "type": "sql",
      "rowHint": "32 Ergebniszeilen",
      "prompt": "Die Buchhaltung benötigt einen Export mit genau diesen Spalten in dieser Reihenfolge: <strong>BuchungID, KundenID, EventID, AnzahlTickets, Status</strong>. Schreiben Sie den vollständigen SQL-Befehl ohne Gerüst. Es dürfen keine zusätzlichen Spalten ausgegeben werden.",
      "starter": "",
      "expectedSql": "SELECT BuchungID, KundenID, EventID, AnzahlTickets, Status FROM buchungen;",
      "solution": "SELECT BuchungID, KundenID, EventID, AnzahlTickets, Status FROM buchungen;"
    },
    {
      "id": "w1",
      "chapter": "where",
      "title": "Aufgabe von WHERE",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Was bewirkt die WHERE-Klausel?",
      "options": [
        [
          "A",
          "Sie filtert Datensätze anhand einer Bedingung."
        ],
        [
          "B",
          "Sie wählt die Datenbankdatei aus."
        ],
        [
          "C",
          "Sie sortiert immer alphabetisch."
        ],
        [
          "D",
          "Sie benennt eine Tabelle um."
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "WHERE filtert Zeilen anhand einer Bedingung."
    },
    {
      "id": "w2",
      "chapter": "where",
      "title": "Textwerte korrekt notieren",
      "afb": "I",
      "type": "tf",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Die Bedingung <code>WHERE Kategorie = 'Tech'</code> verwendet für einen Textwert korrekt einfache Anführungszeichen.",
      "correct": [
        "true"
      ],
      "solution": "Richtig. Textwerte werden in den hier verwendeten SQL-Abfragen in einfachen Anführungszeichen notiert."
    },
    {
      "id": "w3",
      "chapter": "where",
      "title": "Tech-Veranstaltungen",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Kategorie <strong>Tech</strong> ist.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE ;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Kategorie='Tech';",
      "solution": "SELECT * FROM veranstaltungen WHERE Kategorie='Tech';",
      "rowHint": "3 Ergebniszeilen"
    },
    {
      "id": "w4",
      "chapter": "where",
      "title": "Preisgrenze anwenden",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Preis <strong>größer als 15</strong> ist.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE ;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Preis > 15;",
      "solution": "SELECT * FROM veranstaltungen WHERE Preis > 15;",
      "rowHint": "5 Ergebniszeilen"
    },
    {
      "id": "w5",
      "chapter": "where",
      "title": "Leipziger Kundschaft",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Kundendatensätze aus <strong>Leipzig</strong> aus.",
      "starter": "SELECT *\nFROM kunden\nWHERE ;",
      "expectedSql": "SELECT * FROM kunden WHERE Stadt='Leipzig';",
      "solution": "SELECT * FROM kunden WHERE Stadt='Leipzig';",
      "rowHint": "10 Ergebniszeilen"
    },
    {
      "id": "w6",
      "chapter": "where",
      "title": "Fehler: Text ohne Anführungszeichen",
      "afb": "II",
      "type": "sql",
      "prompt": "Korrigieren Sie den fehlerhaften Befehl. Er soll alle Tech-Veranstaltungen ausgeben.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE Kategorie = Tech;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Kategorie='Tech';",
      "solution": "SELECT * FROM veranstaltungen WHERE Kategorie='Tech';",
      "rowHint": "3 Ergebniszeilen"
    },
    {
      "id": "w7",
      "chapter": "where",
      "title": "SQL zur vorgegebenen Ergebnistabelle",
      "afb": "II",
      "type": "sql",
      "prompt": "Schreiben Sie einen vollständigen SQL-Befehl, der diese Ergebnistabelle erzeugt. Es kann mehr als eine korrekte Formulierung geben.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>EventID</th><th>Titel</th><th>Preis</th></tr></thead><tbody><tr><td>1</td><td>Azubi Connect</td><td>0.0</td></tr><tr><td>13</td><td>Job Dating Wirtschaft</td><td>0.0</td></tr><tr><td>19</td><td>Climate Hackday</td><td>0.0</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis=0 ORDER BY EventID;",
      "solution": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis=0 ORDER BY EventID;",
      "rowHint": "3 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "w8",
      "chapter": "where",
      "title": "Firmenkunden selbstständig filtern",
      "afb": "III",
      "type": "sql",
      "prompt": "Geben Sie ohne SQL-Gerüst ausschließlich <strong>KundenID, Name und Stadt</strong> für alle Datensätze mit Kundentyp <strong>Firma</strong> aus.",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt FROM kunden WHERE Kundentyp='Firma';",
      "solution": "SELECT KundenID, Name, Stadt FROM kunden WHERE Kundentyp='Firma';",
      "rowHint": "5 Ergebniszeilen"
    },
    {
      "id": "w9",
      "chapter": "where",
      "title": "Fehlerhafte Preisbedingung korrigieren",
      "afb": "III",
      "type": "sql",
      "prompt": "Der folgende Befehl soll Veranstaltungen mit einem Preis über 15 € finden, behandelt den Vergleich aber als Text. Korrigieren Sie den vollständigen Befehl.",
      "starter": "SELECT EventID, Titel, Preis\nFROM veranstaltungen\nWHERE Preis = '>15';",
      "expectedSql": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis > 15;",
      "solution": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis > 15;",
      "rowHint": "5 Ergebniszeilen"
    },
    {
      "id": "w10",
      "chapter": "where",
      "title": "Datumsfilter ohne Gerüst",
      "afb": "III",
      "type": "sql",
      "prompt": "Geben Sie <strong>EventID, Titel und Datum</strong> aller Veranstaltungen aus, die <strong>ab dem 01.04.2027</strong> stattfinden.",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Datum FROM veranstaltungen WHERE Datum >= '2027-04-01';",
      "solution": "SELECT EventID, Titel, Datum FROM veranstaltungen WHERE Datum >= '2027-04-01';",
      "rowHint": "5 Ergebniszeilen"
    },
    {
      "id": "w11",
      "chapter": "where",
      "title": "Vergleichsoperator sicher auswählen",
      "afb": "I",
      "type": "single",
      "rowHint": "Theorieaufgabe",
      "prompt": "Welche WHERE-Bedingung beschreibt fachlich eindeutig: <strong>„Der Preis beträgt höchstens 5 €“</strong>?",
      "options": [
        [
          "A",
          "WHERE Preis < 5"
        ],
        [
          "B",
          "WHERE Preis <= 5"
        ],
        [
          "C",
          "WHERE Preis > 5"
        ],
        [
          "D",
          "WHERE Preis = 5"
        ]
      ],
      "correct": [
        "B"
      ],
      "solution": "WHERE Preis <= 5"
    },
    {
      "id": "w12",
      "chapter": "where",
      "title": "Nur aktive Mitarbeitende auswählen",
      "afb": "II",
      "type": "sql",
      "rowHint": "11 Ergebniszeilen",
      "prompt": "Geben Sie <strong>MitarbeiterID, Vorname, Nachname und Bereich</strong> aller aktiven Mitarbeitenden aus. In der Tabelle kennzeichnet <strong>Aktiv = 1</strong> einen aktiven Datensatz. Schreiben Sie den vollständigen SQL-Befehl.",
      "starter": "",
      "expectedSql": "SELECT MitarbeiterID, Vorname, Nachname, Bereich FROM mitarbeitende WHERE Aktiv = 1;",
      "solution": "SELECT MitarbeiterID, Vorname, Nachname, Bereich FROM mitarbeitende WHERE Aktiv = 1;"
    },
    {
      "id": "w13",
      "chapter": "where",
      "title": "SQL zur Preis-Ausgabetabelle entwickeln",
      "afb": "II",
      "type": "sql",
      "rowHint": "6 Ergebniszeilen",
      "prompt": "Leiten Sie einen vollständigen SQL-Befehl aus der folgenden Ausgabetabelle ab. Unterschiedliche fachlich gleichwertige Befehle sind zulässig.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>EventID</th><th>Titel</th><th>Preis</th></tr></thead><tbody><tr><td>1</td><td>Azubi Connect</td><td>0.0</td></tr><tr><td>12</td><td>Tech Repair Café</td><td>4.0</td></tr><tr><td>13</td><td>Job Dating Wirtschaft</td><td>0.0</td></tr><tr><td>17</td><td>Skate &amp; Street Art</td><td>5.0</td></tr><tr><td>18</td><td>Local Brands Pop-up</td><td>3.5</td></tr><tr><td>19</td><td>Climate Hackday</td><td>0.0</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis <= 5;",
      "solution": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Preis <= 5;"
    },
    {
      "id": "w14",
      "chapter": "where",
      "title": "Großbuchungen ohne Gerüst filtern",
      "afb": "III",
      "type": "sql",
      "rowHint": "5 Ergebniszeilen",
      "prompt": "Die Buchhaltung möchte alle Buchungen mit <strong>mindestens 10 Tickets</strong> kontrollieren. Geben Sie ausschließlich <strong>BuchungID, KundenID, EventID und AnzahlTickets</strong> aus. Formulieren Sie den vollständigen SQL-Befehl selbstständig.",
      "starter": "",
      "expectedSql": "SELECT BuchungID, KundenID, EventID, AnzahlTickets FROM buchungen WHERE AnzahlTickets >= 10;",
      "solution": "SELECT BuchungID, KundenID, EventID, AnzahlTickets FROM buchungen WHERE AnzahlTickets >= 10;"
    },
    {
      "id": "o1",
      "chapter": "order",
      "title": "Standard-Sortierung",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Wie sortiert <code>ORDER BY Preis</code> ohne weiteren Zusatz?",
      "options": [
        [
          "A",
          "Aufsteigend"
        ],
        [
          "B",
          "Absteigend"
        ],
        [
          "C",
          "Zufällig"
        ],
        [
          "D",
          "Nach EventID"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "Ohne DESC wird aufsteigend sortiert; ASC kann ausdrücklich ergänzt werden."
    },
    {
      "id": "o2",
      "chapter": "order",
      "title": "Klauseln in richtige Reihenfolge bringen",
      "afb": "I",
      "type": "sequence",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Ordnen Sie die Klauseln korrekt.",
      "items": [
        "SELECT *",
        "FROM veranstaltungen",
        "WHERE Preis > 10",
        "ORDER BY Preis DESC",
        ";"
      ],
      "correctOrder": [
        "SELECT *",
        "FROM veranstaltungen",
        "WHERE Preis > 10",
        "ORDER BY Preis DESC",
        ";"
      ],
      "solution": "SELECT → FROM → WHERE → ORDER BY → ;"
    },
    {
      "id": "o3",
      "chapter": "order",
      "title": "Nach Preis sortieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus und sortieren Sie sie <strong>aufsteigend nach Preis</strong>.",
      "starter": "SELECT *\nFROM veranstaltungen\nORDER BY ;",
      "expectedSql": "SELECT * FROM veranstaltungen ORDER BY Preis ASC;",
      "solution": "SELECT * FROM veranstaltungen ORDER BY Preis ASC;",
      "rowHint": "20 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "o4",
      "chapter": "order",
      "title": "Kategorie ausschließen",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, die <strong>nicht</strong> zur Kategorie Tech gehören.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE NOT ;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE NOT Kategorie='Tech';",
      "solution": "SELECT * FROM veranstaltungen WHERE NOT Kategorie='Tech';",
      "rowHint": "17 Ergebniszeilen"
    },
    {
      "id": "o5",
      "chapter": "order",
      "title": "Fehler in ORDER BY beheben",
      "afb": "II",
      "type": "sql",
      "prompt": "Reparieren Sie den fehlerhaften Sortierbefehl so, dass alle Veranstaltungen absteigend nach Preis ausgegeben werden.",
      "starter": "SELECT *\nFROM veranstaltungen\nORDER Preis DESC BY;",
      "expectedSql": "SELECT * FROM veranstaltungen ORDER BY Preis DESC;",
      "solution": "SELECT * FROM veranstaltungen ORDER BY Preis DESC;",
      "rowHint": "20 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "o6",
      "chapter": "order",
      "title": "Mehrstufig sortieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Kunden aus, deren Stadt <strong>nicht Leipzig</strong> ist. Sortieren Sie zuerst nach Stadt und danach nach Name.",
      "starter": "",
      "expectedSql": "SELECT * FROM kunden WHERE NOT Stadt='Leipzig' ORDER BY Stadt, Name;",
      "solution": "SELECT * FROM kunden WHERE NOT Stadt='Leipzig' ORDER BY Stadt, Name;",
      "rowHint": "14 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "o7",
      "chapter": "order",
      "title": "Ausgabetabelle rekonstruieren",
      "afb": "III",
      "type": "sql",
      "prompt": "Rekonstruieren Sie einen vollständigen SQL-Befehl, der diese Tabelle erzeugt. Der Kurs prüft das Ergebnis, nicht den exakten Wortlaut.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>KundenID</th><th>Name</th><th>Kundentyp</th></tr></thead><tbody><tr><td>13</td><td>CampusFit e.V.</td><td>Verein</td></tr><tr><td>16</td><td>FutureLab GmbH</td><td>Firma</td></tr><tr><td>14</td><td>GreenStep UG</td><td>Firma</td></tr><tr><td>15</td><td>Kulturraum e.V.</td><td>Verein</td></tr><tr><td>11</td><td>Nova Media GmbH</td><td>Firma</td></tr><tr><td>12</td><td>Pixelwerk AG</td><td>Firma</td></tr><tr><td>24</td><td>UrbanSports GmbH</td><td>Firma</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Kundentyp FROM kunden WHERE NOT Kundentyp='Privat' ORDER BY Name;",
      "solution": "SELECT KundenID, Name, Kundentyp FROM kunden WHERE NOT Kundentyp='Privat' ORDER BY Name;",
      "rowHint": "7 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "o8",
      "chapter": "order",
      "title": "Zwei Fehler gleichzeitig finden",
      "afb": "III",
      "type": "sql",
      "prompt": "Korrigieren Sie den folgenden Befehl. Gesucht sind alle Nicht-Tech-Veranstaltungen, absteigend nach Preis sortiert.",
      "starter": "SELECT Titel, Kategorie, Preis\nFROM veranstaltungen\nORDER BY Preis DESC\nWHERE NOT Kategorie = 'Tech';",
      "expectedSql": "SELECT Titel, Kategorie, Preis FROM veranstaltungen WHERE NOT Kategorie='Tech' ORDER BY Preis DESC;",
      "solution": "SELECT Titel, Kategorie, Preis FROM veranstaltungen WHERE NOT Kategorie='Tech' ORDER BY Preis DESC;",
      "rowHint": "17 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "o9",
      "chapter": "order",
      "title": "DESC richtig deuten",
      "afb": "I",
      "type": "single",
      "rowHint": "Theorieaufgabe",
      "prompt": "Was bewirkt <strong>DESC</strong> in einer ORDER-BY-Klausel?",
      "options": [
        [
          "A",
          "Die Ausgabe wird absteigend sortiert."
        ],
        [
          "B",
          "Die Ausgabe wird aufsteigend sortiert."
        ],
        [
          "C",
          "Datensätze werden gelöscht."
        ],
        [
          "D",
          "Doppelte Datensätze werden ausgeblendet."
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "DESC sortiert die angegebenen Werte absteigend."
    },
    {
      "id": "o10",
      "chapter": "order",
      "title": "Kundenliste zweistufig sortieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "24 Ergebniszeilen",
      "prompt": "Geben Sie <strong>KundenID, Name und Stadt</strong> aller Kunden aus. Sortieren Sie zuerst alphabetisch nach <strong>Stadt</strong> und innerhalb derselben Stadt zusätzlich nach <strong>Name</strong>. Schreiben Sie den vollständigen Befehl.",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt FROM kunden ORDER BY Stadt, Name;",
      "solution": "SELECT KundenID, Name, Stadt FROM kunden ORDER BY Stadt, Name;",
      "orderSensitive": true
    },
    {
      "id": "o11",
      "chapter": "order",
      "title": "Sortierte Ausgabetabelle rekonstruieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "7 Ergebniszeilen",
      "prompt": "Rekonstruieren Sie einen vollständigen SQL-Befehl, der exakt diese Reihenfolge erzeugt. Es sollen alle <strong>nicht privaten</strong> Kundendatensätze ausgegeben und nach Stadt sowie Name sortiert werden.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>KundenID</th><th>Name</th><th>Stadt</th><th>Kundentyp</th></tr></thead><tbody><tr><td>12</td><td>Pixelwerk AG</td><td>Berlin</td><td>Firma</td></tr><tr><td>14</td><td>GreenStep UG</td><td>Dresden</td><td>Firma</td></tr><tr><td>15</td><td>Kulturraum e.V.</td><td>Halle</td><td>Verein</td></tr><tr><td>13</td><td>CampusFit e.V.</td><td>Leipzig</td><td>Verein</td></tr><tr><td>16</td><td>FutureLab GmbH</td><td>Leipzig</td><td>Firma</td></tr><tr><td>11</td><td>Nova Media GmbH</td><td>Leipzig</td><td>Firma</td></tr><tr><td>24</td><td>UrbanSports GmbH</td><td>Leipzig</td><td>Firma</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt, Kundentyp FROM kunden WHERE NOT Kundentyp='Privat' ORDER BY Stadt, Name;",
      "solution": "SELECT KundenID, Name, Stadt, Kundentyp FROM kunden WHERE NOT Kundentyp='Privat' ORDER BY Stadt, Name;",
      "orderSensitive": true
    },
    {
      "id": "o12",
      "chapter": "order",
      "title": "NOT und mehrstufiges Sortieren selbstständig kombinieren",
      "afb": "III",
      "type": "sql",
      "rowHint": "17 Ergebniszeilen",
      "prompt": "Geben Sie <strong>EventID, Titel, Kategorie und Preis</strong> aller Veranstaltungen aus, die <strong>nicht</strong> zur Kategorie Gaming gehören. Sortieren Sie zuerst alphabetisch nach <strong>Kategorie</strong> und innerhalb derselben Kategorie <strong>absteigend nach Preis</strong>. Schreiben Sie den vollständigen SQL-Befehl ohne Gerüst.",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE NOT Kategorie='Gaming' ORDER BY Kategorie, Preis DESC;",
      "solution": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE NOT Kategorie='Gaming' ORDER BY Kategorie, Preis DESC;",
      "orderSensitive": true
    },
    {
      "id": "l1",
      "chapter": "logic",
      "title": "Wildcard verstehen",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Wofür steht <code>%</code> in einem LIKE-Muster?",
      "options": [
        [
          "A",
          "Für beliebig viele Zeichen"
        ],
        [
          "B",
          "Nur für genau eine Ziffer"
        ],
        [
          "C",
          "Für einen Primärschlüssel"
        ],
        [
          "D",
          "Für eine Sortierung"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "% steht in LIKE-Mustern für beliebig viele Zeichen."
    },
    {
      "id": "l2",
      "chapter": "logic",
      "title": "AND oder OR?",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Verknüpfung verwenden Sie, wenn <strong>beide</strong> Bedingungen erfüllt sein müssen?",
      "options": [
        [
          "A",
          "AND"
        ],
        [
          "B",
          "OR"
        ],
        [
          "C",
          "NOT"
        ],
        [
          "D",
          "ORDER BY"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "AND verlangt, dass beide Bedingungen wahr sind."
    },
    {
      "id": "l3",
      "chapter": "logic",
      "title": "Klammern bei gemischter Logik",
      "afb": "I",
      "type": "tf",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Bei gemischten AND-/OR-Bedingungen können Klammern nötig sein, um die gewünschte Logik eindeutig festzulegen.",
      "correct": [
        "true"
      ],
      "solution": "Richtig. Klammern steuern, welche Bedingungen gemeinsam ausgewertet werden."
    },
    {
      "id": "l4",
      "chapter": "logic",
      "title": "Titel beginnt mit C",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Titel mit dem Buchstaben <strong>C</strong> beginnt.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE Titel LIKE ;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Titel LIKE 'C%';",
      "solution": "SELECT * FROM veranstaltungen WHERE Titel LIKE 'C%';",
      "rowHint": "3 Ergebniszeilen"
    },
    {
      "id": "l5",
      "chapter": "logic",
      "title": "Leipziger Firmenkunden",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Kunden aus, die in <strong>Leipzig</strong> wohnen <strong>UND</strong> Kundentyp <strong>Firma</strong> haben.",
      "starter": "SELECT *\nFROM kunden\nWHERE Stadt = 'Leipzig' AND ;",
      "expectedSql": "SELECT * FROM kunden WHERE Stadt='Leipzig' AND Kundentyp='Firma';",
      "solution": "SELECT * FROM kunden WHERE Stadt='Leipzig' AND Kundentyp='Firma';",
      "rowHint": "3 Ergebniszeilen"
    },
    {
      "id": "l6",
      "chapter": "logic",
      "title": "Gaming oder Sport",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Kategorie <strong>Gaming ODER Sport</strong> ist.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE ;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Kategorie='Gaming' OR Kategorie='Sport';",
      "solution": "SELECT * FROM veranstaltungen WHERE Kategorie='Gaming' OR Kategorie='Sport';",
      "rowHint": "5 Ergebniszeilen"
    },
    {
      "id": "l7",
      "chapter": "logic",
      "title": "Fehlerhafte Logik korrigieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Der Befehl soll nur Gaming- oder Sportveranstaltungen unter 15 € liefern. Korrigieren Sie die Logik so, dass die Preisgrenze für <strong>beide</strong> Kategorien gilt.",
      "starter": "SELECT *\nFROM veranstaltungen\nWHERE Kategorie = 'Gaming' OR Kategorie = 'Sport' AND Preis < 15;",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15;",
      "solution": "SELECT * FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15;",
      "rowHint": "3 Ergebniszeilen"
    },
    {
      "id": "l8",
      "chapter": "logic",
      "title": "Ausgabetabelle mit AND/OR erzeugen",
      "afb": "II",
      "type": "sql",
      "prompt": "Schreiben Sie einen SQL-Befehl für die vorgegebene Ergebnistabelle. Verschiedene fachlich gleichwertige Befehle sind zulässig.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>KundenID</th><th>Name</th><th>Stadt</th><th>Kundentyp</th></tr></thead><tbody><tr><td>14</td><td>GreenStep UG</td><td>Dresden</td><td>Firma</td></tr><tr><td>16</td><td>FutureLab GmbH</td><td>Leipzig</td><td>Firma</td></tr><tr><td>11</td><td>Nova Media GmbH</td><td>Leipzig</td><td>Firma</td></tr><tr><td>24</td><td>UrbanSports GmbH</td><td>Leipzig</td><td>Firma</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt, Kundentyp FROM kunden WHERE (Stadt='Leipzig' OR Stadt='Dresden') AND Kundentyp='Firma' ORDER BY Stadt, Name;",
      "solution": "SELECT KundenID, Name, Stadt, Kundentyp FROM kunden WHERE (Stadt='Leipzig' OR Stadt='Dresden') AND Kundentyp='Firma' ORDER BY Stadt, Name;",
      "rowHint": "4 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "l9",
      "chapter": "logic",
      "title": "Titel enthält a, aber nicht Gaming",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Titel den Buchstaben <strong>a</strong> enthält und deren Kategorie <strong>nicht Gaming</strong> ist.",
      "starter": "",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Titel LIKE '%a%' AND NOT Kategorie='Gaming';",
      "solution": "SELECT * FROM veranstaltungen WHERE Titel LIKE '%a%' AND NOT Kategorie='Gaming';",
      "rowHint": "15 Ergebniszeilen"
    },
    {
      "id": "l10",
      "chapter": "logic",
      "title": "Komplexe Kampagnenliste",
      "afb": "III",
      "type": "sql",
      "prompt": "Geben Sie <strong>Titel, Kategorie und Preis</strong> für Veranstaltungen aus, die zur Kategorie <strong>Gaming oder Sport</strong> gehören und <strong>unter 15 €</strong> kosten. Sortieren Sie aufsteigend nach Preis. Schreiben Sie den kompletten Befehl ohne Gerüst.",
      "starter": "",
      "expectedSql": "SELECT Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15 ORDER BY Preis;",
      "solution": "SELECT Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15 ORDER BY Preis;",
      "rowHint": "3 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "l11",
      "chapter": "logic",
      "title": "SQL aus komplexer Ausgabetabelle",
      "afb": "III",
      "type": "sql",
      "prompt": "Leiten Sie aus dieser Ausgabetabelle einen vollständigen SQL-Befehl ab. Es sind mehrere unterschiedliche korrekte SQL-Befehle möglich; entscheidend ist die gleiche Ausgabetabelle.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>EventID</th><th>Titel</th><th>Kategorie</th><th>Preis</th></tr></thead><tbody><tr><td>17</td><td>Skate &amp; Street Art</td><td>Sport</td><td>5.0</td></tr><tr><td>20</td><td>Summer Gaming Open</td><td>Gaming</td><td>12.5</td></tr><tr><td>10</td><td>Urban Dance Session</td><td>Sport</td><td>14.0</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15 ORDER BY Preis;",
      "solution": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Gaming' OR Kategorie='Sport') AND Preis < 15 ORDER BY Preis;",
      "rowHint": "3 Ergebniszeilen",
      "orderSensitive": true
    },
    {
      "id": "l12",
      "chapter": "logic",
      "title": "Prioritätsfehler analysieren und korrigieren",
      "afb": "III",
      "type": "sql",
      "prompt": "Korrigieren Sie den Befehl so, dass nur <strong>Leipziger oder Dresdner Firmenkunden</strong> ausgegeben werden. Die Bedingung „Firma“ muss für beide Städte gelten.",
      "starter": "SELECT *\nFROM kunden\nWHERE Stadt = 'Leipzig' OR Stadt = 'Dresden' AND Kundentyp = 'Firma';",
      "expectedSql": "SELECT * FROM kunden WHERE (Stadt='Leipzig' OR Stadt='Dresden') AND Kundentyp='Firma';",
      "solution": "SELECT * FROM kunden WHERE (Stadt='Leipzig' OR Stadt='Dresden') AND Kundentyp='Firma';",
      "rowHint": "4 Ergebniszeilen"
    },
    {
      "id": "l13",
      "chapter": "logic",
      "title": "LIKE-Muster für ein Namensende erkennen",
      "afb": "I",
      "type": "single",
      "rowHint": "Theorieaufgabe",
      "prompt": "Welches LIKE-Muster findet Textwerte, die auf <strong>GmbH</strong> enden?",
      "options": [
        [
          "A",
          "LIKE 'GmbH%'"
        ],
        [
          "B",
          "LIKE '%GmbH'"
        ],
        [
          "C",
          "LIKE '%GmbH%'"
        ],
        [
          "D",
          "LIKE 'GmbH'"
        ]
      ],
      "correct": [
        "B"
      ],
      "solution": "LIKE '%GmbH' – das Prozentzeichen erlaubt beliebige Zeichen vor dem festen Textende."
    },
    {
      "id": "l14",
      "chapter": "logic",
      "title": "Zwei Stadtmuster mit OR kombinieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "5 Ergebniszeilen",
      "prompt": "Geben Sie <strong>KundenID, Name und Stadt</strong> aller Kunden aus, deren Stadt mit <strong>B</strong> oder mit <strong>D</strong> beginnt. Verwenden Sie LIKE und OR und schreiben Sie den vollständigen Befehl.",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt FROM kunden WHERE Stadt LIKE 'B%' OR Stadt LIKE 'D%';",
      "solution": "SELECT KundenID, Name, Stadt FROM kunden WHERE Stadt LIKE 'B%' OR Stadt LIKE 'D%';"
    },
    {
      "id": "l15",
      "chapter": "logic",
      "title": "Logikfehler bei OR und AND korrigieren",
      "afb": "II",
      "type": "sql",
      "rowHint": "4 Ergebniszeilen",
      "prompt": "Der folgende Befehl soll nur <strong>Tech- oder Business-Veranstaltungen unter 10 €</strong> liefern. Korrigieren Sie die Bedingungslogik so, dass die Preisgrenze für beide Kategorien gilt.",
      "starter": "SELECT EventID, Titel, Kategorie, Preis\nFROM veranstaltungen\nWHERE Kategorie = 'Tech' OR Kategorie = 'Business' AND Preis < 10;",
      "expectedSql": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Tech' OR Kategorie='Business') AND Preis < 10;",
      "solution": "SELECT EventID, Titel, Kategorie, Preis FROM veranstaltungen WHERE (Kategorie='Tech' OR Kategorie='Business') AND Preis < 10;"
    },
    {
      "id": "l16",
      "chapter": "logic",
      "title": "Komplexe Ausgabetabelle vollständig rekonstruieren",
      "afb": "III",
      "type": "sql",
      "rowHint": "3 Ergebniszeilen",
      "prompt": "Leiten Sie aus der Ausgabetabelle einen vollständigen SQL-Befehl ab. Gesucht sind Leipziger Unternehmen, deren Name auf <strong>GmbH</strong> oder <strong>AG</strong> endet. Die Ausgabe ist nach Name sortiert. Mehrere fachlich gleichwertige SQL-Formulierungen sind möglich.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>KundenID</th><th>Name</th><th>Stadt</th></tr></thead><tbody><tr><td>16</td><td>FutureLab GmbH</td><td>Leipzig</td></tr><tr><td>11</td><td>Nova Media GmbH</td><td>Leipzig</td></tr><tr><td>24</td><td>UrbanSports GmbH</td><td>Leipzig</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT KundenID, Name, Stadt FROM kunden WHERE (Name LIKE '%GmbH' OR Name LIKE '%AG') AND Stadt='Leipzig' ORDER BY Name;",
      "solution": "SELECT KundenID, Name, Stadt FROM kunden WHERE (Name LIKE '%GmbH' OR Name LIKE '%AG') AND Stadt='Leipzig' ORDER BY Name;",
      "orderSensitive": true
    },
    {
      "id": "c1",
      "chapter": "change",
      "title": "UPDATE erkennen",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welcher Befehl verändert Werte bestehender Datensätze?",
      "options": [
        [
          "A",
          "UPDATE"
        ],
        [
          "B",
          "SELECT"
        ],
        [
          "C",
          "ORDER BY"
        ],
        [
          "D",
          "FROM"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "UPDATE verändert vorhandene Datensätze."
    },
    {
      "id": "c2",
      "chapter": "change",
      "title": "Sicherheitsregel",
      "afb": "I",
      "type": "tf",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Ohne WHERE kann ein UPDATE mehr Datensätze verändern als beabsichtigt.",
      "correct": [
        "true"
      ],
      "solution": "Richtig. Ohne WHERE wirkt UPDATE grundsätzlich auf alle Zeilen der Tabelle."
    },
    {
      "id": "c3",
      "chapter": "change",
      "title": "DELETE erkennen",
      "afb": "I",
      "type": "single",
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welcher Befehl entfernt vollständige Datensätze aus einer Tabelle?",
      "options": [
        [
          "A",
          "DELETE"
        ],
        [
          "B",
          "SET"
        ],
        [
          "C",
          "LIKE"
        ],
        [
          "D",
          "SELECT"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "DELETE entfernt Datensätze."
    },
    {
      "id": "c4",
      "chapter": "change",
      "title": "Preis eines Events erhöhen",
      "afb": "II",
      "type": "sql",
      "prompt": "Erhöhen Sie den Preis der Veranstaltung mit EventID 12 um <strong>2 €</strong>.",
      "starter": "UPDATE veranstaltungen\nSET Preis = Preis + 2\nWHERE ;",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis + 2 WHERE EventID = 12;",
      "solution": "UPDATE veranstaltungen SET Preis = Preis + 2 WHERE EventID = 12;",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "1 Datensatz/Datensätze werden geändert"
    },
    {
      "id": "c5",
      "chapter": "change",
      "title": "Kundenstadt aktualisieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Ändern Sie die Stadt des Kunden mit KundenID 10 auf <strong>Berlin</strong>.",
      "starter": "UPDATE kunden\nSET Stadt = 'Berlin'\nWHERE ;",
      "expectedSql": "UPDATE kunden SET Stadt='Berlin' WHERE KundenID=10;",
      "solution": "UPDATE kunden SET Stadt='Berlin' WHERE KundenID=10;",
      "mode": "mutation",
      "verifySql": "SELECT KundenID,Stadt FROM kunden ORDER BY KundenID;",
      "rowHint": "1 Datensatz/Datensätze werden geändert"
    },
    {
      "id": "c6",
      "chapter": "change",
      "title": "Inaktiven Mitarbeiter löschen",
      "afb": "II",
      "type": "sql",
      "prompt": "Löschen Sie alle Datensätze aus <strong>mitarbeitende</strong>, bei denen <strong>Aktiv = 0</strong> gilt.",
      "starter": "DELETE FROM mitarbeitende\nWHERE ;",
      "expectedSql": "DELETE FROM mitarbeitende WHERE Aktiv = 0;",
      "solution": "DELETE FROM mitarbeitende WHERE Aktiv = 0;",
      "mode": "mutation",
      "verifySql": "SELECT MitarbeiterID,Vorname,Nachname,Aktiv FROM mitarbeitende ORDER BY MitarbeiterID;",
      "rowHint": "1 Datensatz/Datensätze werden gelöscht"
    },
    {
      "id": "c7",
      "chapter": "change",
      "title": "Gefährliches UPDATE reparieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Der Befehl soll nur EventID 5 um 1 € verteuern. In der vorliegenden Form würde er alle Veranstaltungen verändern. Ergänzen Sie die notwendige Einschränkung.",
      "starter": "UPDATE veranstaltungen\nSET Preis = Preis + 1;",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis + 1 WHERE EventID=5;",
      "solution": "UPDATE veranstaltungen SET Preis = Preis + 1 WHERE EventID=5;",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "1 Datensatz/Datensätze werden geändert"
    },
    {
      "id": "c8",
      "chapter": "change",
      "title": "DELETE-Syntax korrigieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Korrigieren Sie den Befehl so, dass nur die Veranstaltung mit EventID 20 gelöscht wird.",
      "starter": "DELETE * FROM veranstaltungen\nWHERE EventID = 20;",
      "expectedSql": "DELETE FROM veranstaltungen WHERE EventID=20;",
      "solution": "DELETE FROM veranstaltungen WHERE EventID=20;",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Titel FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "1 Datensatz/Datensätze werden gelöscht"
    },
    {
      "id": "c9",
      "chapter": "change",
      "title": "Preise einer Kategorie selbstständig ändern",
      "afb": "III",
      "type": "sql",
      "prompt": "Erhöhen Sie ohne SQL-Gerüst die Preise aller <strong>Tech-Veranstaltungen um 10 %</strong>.",
      "starter": "",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis * 1.10 WHERE Kategorie='Tech';",
      "solution": "UPDATE veranstaltungen SET Preis = Preis * 1.10 WHERE Kategorie='Tech';",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Kategorie,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "3 Datensatz/Datensätze werden geändert"
    },
    {
      "id": "c10",
      "chapter": "change",
      "title": "Mehrere Kategorien gemeinsam ändern",
      "afb": "III",
      "type": "sql",
      "prompt": "Reduzieren Sie die Preise aller Veranstaltungen aus <strong>Gaming oder Sport</strong> um <strong>10 %</strong>. Formulieren Sie den vollständigen Befehl selbstständig.",
      "starter": "",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis * 0.90 WHERE Kategorie='Gaming' OR Kategorie='Sport';",
      "solution": "UPDATE veranstaltungen SET Preis = Preis * 0.90 WHERE Kategorie='Gaming' OR Kategorie='Sport';",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Kategorie,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "5 Datensatz/Datensätze werden geändert"
    },
    {
      "id": "t1",
      "chapter": "test",
      "title": "Test · SELECT und FROM",
      "afb": "I",
      "type": "single",
      "isTest": true,
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welche Klausel legt die Quelltabelle fest?",
      "options": [
        [
          "A",
          "FROM"
        ],
        [
          "B",
          "WHERE"
        ],
        [
          "C",
          "ORDER BY"
        ],
        [
          "D",
          "SET"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "FROM legt die Tabelle fest."
    },
    {
      "id": "t2",
      "chapter": "test",
      "title": "Test · LIKE-Wildcard",
      "afb": "I",
      "type": "single",
      "isTest": true,
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Welches Muster findet Titel, die mit „Tech“ beginnen?",
      "options": [
        [
          "A",
          "'Tech%'"
        ],
        [
          "B",
          "'%Tech'"
        ],
        [
          "C",
          "'%Tech%'"
        ],
        [
          "D",
          "'Tech'"
        ]
      ],
      "correct": [
        "A"
      ],
      "solution": "<code>LIKE 'Tech%'</code> findet Texte, die mit Tech beginnen."
    },
    {
      "id": "t3",
      "chapter": "test",
      "title": "Test · UPDATE-Sicherheit",
      "afb": "I",
      "type": "tf",
      "isTest": true,
      "rowHint": "0 – Theorieaufgabe",
      "prompt": "Vor einem gezielten UPDATE ist eine SELECT-Abfrage mit derselben WHERE-Bedingung eine sinnvolle Kontrolle.",
      "correct": [
        "true"
      ],
      "solution": "Richtig. So lässt sich vor der Änderung prüfen, welche Datensätze betroffen wären."
    },
    {
      "id": "t4",
      "chapter": "test",
      "title": "Test · Spalten auswählen",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie Titel und Datum aller Veranstaltungen aus.",
      "starter": "",
      "expectedSql": "SELECT Titel, Datum FROM veranstaltungen;",
      "solution": "SELECT Titel, Datum FROM veranstaltungen;",
      "rowHint": "20 Ergebniszeilen",
      "isTest": true
    },
    {
      "id": "t5",
      "chapter": "test",
      "title": "Test · WHERE",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen mit Preis ≤ 8 € aus.",
      "starter": "",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Preis <= 8;",
      "solution": "SELECT * FROM veranstaltungen WHERE Preis <= 8;",
      "rowHint": "9 Ergebniszeilen",
      "isTest": true
    },
    {
      "id": "t6",
      "chapter": "test",
      "title": "Test · Sortieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie EventID, Titel und Preis aller Veranstaltungen absteigend nach Preis sortiert aus.",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Preis FROM veranstaltungen ORDER BY Preis DESC;",
      "solution": "SELECT EventID, Titel, Preis FROM veranstaltungen ORDER BY Preis DESC;",
      "rowHint": "20 Ergebniszeilen",
      "orderSensitive": true,
      "isTest": true
    },
    {
      "id": "t7",
      "chapter": "test",
      "title": "Test · LIKE",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, deren Titel das Wort <strong>Food</strong> enthält.",
      "starter": "",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Titel LIKE '%Food%';",
      "solution": "SELECT * FROM veranstaltungen WHERE Titel LIKE '%Food%';",
      "rowHint": "2 Ergebniszeilen",
      "isTest": true
    },
    {
      "id": "t8",
      "chapter": "test",
      "title": "Test · AND/OR",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, die Tech oder Gaming sind und höchstens 12,5 € kosten.",
      "starter": "",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE (Kategorie='Tech' OR Kategorie='Gaming') AND Preis <= 12.5;",
      "solution": "SELECT * FROM veranstaltungen WHERE (Kategorie='Tech' OR Kategorie='Gaming') AND Preis <= 12.5;",
      "rowHint": "4 Ergebniszeilen",
      "isTest": true
    },
    {
      "id": "t9",
      "chapter": "test",
      "title": "Test · Fehler korrigieren",
      "afb": "II",
      "type": "sql",
      "prompt": "Korrigieren Sie den Befehl, sodass Leipziger Kunden nach Name sortiert ausgegeben werden.",
      "starter": "SELECT * FROM kunden\nORDER BY Name\nWHERE Stadt = Leipzig;",
      "expectedSql": "SELECT * FROM kunden WHERE Stadt='Leipzig' ORDER BY Name;",
      "solution": "SELECT * FROM kunden WHERE Stadt='Leipzig' ORDER BY Name;",
      "rowHint": "10 Ergebniszeilen",
      "orderSensitive": true,
      "isTest": true
    },
    {
      "id": "t10",
      "chapter": "test",
      "title": "Test · Vollständiges Statement",
      "afb": "III",
      "type": "sql",
      "prompt": "Erzeugen Sie ohne Gerüst eine Liste mit Name, Stadt und Kundentyp für Firmen oder Vereine, die nicht in Leipzig sitzen. Sortieren Sie nach Stadt und Name.",
      "starter": "",
      "expectedSql": "SELECT Name, Stadt, Kundentyp FROM kunden WHERE (Kundentyp='Firma' OR Kundentyp='Verein') AND NOT Stadt='Leipzig' ORDER BY Stadt, Name;",
      "solution": "SELECT Name, Stadt, Kundentyp FROM kunden WHERE (Kundentyp='Firma' OR Kundentyp='Verein') AND NOT Stadt='Leipzig' ORDER BY Stadt, Name;",
      "rowHint": "3 Ergebniszeilen",
      "orderSensitive": true,
      "isTest": true
    },
    {
      "id": "t11",
      "chapter": "test",
      "title": "Test · SQL aus Ausgabetabelle",
      "afb": "III",
      "type": "sql",
      "prompt": "Schreiben Sie einen SQL-Befehl, der genau diese Ausgabetabelle erzeugt. Es können mehrere Lösungen korrekt sein.<div class=\"target-output\"><p><strong>Vorgegebene Ausgabetabelle:</strong></p><div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>EventID</th><th>Titel</th><th>Preis</th></tr></thead><tbody><tr><td>12</td><td>Tech Repair Café</td><td>4.0</td></tr><tr><td>5</td><td>Code &amp; Coffee</td><td>6.5</td></tr><tr><td>16</td><td>AI Basics Workshop</td><td>11.0</td></tr></tbody></table></div></div>",
      "starter": "",
      "expectedSql": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Kategorie='Tech' ORDER BY Preis;",
      "solution": "SELECT EventID, Titel, Preis FROM veranstaltungen WHERE Kategorie='Tech' ORDER BY Preis;",
      "rowHint": "3 Ergebniszeilen",
      "orderSensitive": true,
      "isTest": true
    },
    {
      "id": "t12",
      "chapter": "test",
      "title": "Test · Daten ändern",
      "afb": "III",
      "type": "sql",
      "prompt": "Erhöhen Sie die Preise aller Food-Veranstaltungen um 5 %. Schreiben Sie den vollständigen Befehl.",
      "starter": "",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis * 1.05 WHERE Kategorie='Food';",
      "solution": "UPDATE veranstaltungen SET Preis = Preis * 1.05 WHERE Kategorie='Food';",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Kategorie,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "2 Datensatz/Datensätze werden geändert",
      "isTest": true
    }
  ],
  "bonusTasks": [
    {
      "id": "b1",
      "chapter": "bonus",
      "title": "Bonus · Medien oder Kultur",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie alle Veranstaltungen aus, die zur Kategorie Medien oder Kultur gehören. Sortieren Sie nach Datum.",
      "starter": "",
      "expectedSql": "SELECT * FROM veranstaltungen WHERE Kategorie='Medien' OR Kategorie='Kultur' ORDER BY Datum;",
      "solution": "SELECT * FROM veranstaltungen WHERE Kategorie='Medien' OR Kategorie='Kultur' ORDER BY Datum;",
      "rowHint": "2 Ergebniszeilen",
      "orderSensitive": true,
      "bonus": true
    },
    {
      "id": "b2",
      "chapter": "bonus",
      "title": "Bonus · Titel ohne a",
      "afb": "II",
      "type": "sql",
      "prompt": "Geben Sie Titel und Kategorie aller Veranstaltungen aus, deren Titel kein „a“ enthält.",
      "starter": "",
      "expectedSql": "SELECT Titel, Kategorie FROM veranstaltungen WHERE NOT Titel LIKE '%a%';",
      "solution": "SELECT Titel, Kategorie FROM veranstaltungen WHERE NOT Titel LIKE '%a%';",
      "rowHint": "3 Ergebniszeilen",
      "bonus": true
    },
    {
      "id": "b3",
      "chapter": "bonus",
      "title": "Bonus · Komplexe Kundenliste",
      "afb": "III",
      "type": "sql",
      "prompt": "Geben Sie Name, Stadt und Kundentyp aller Firmen oder Vereine aus Dresden oder Halle aus. Sortieren Sie nach Stadt und Name.",
      "starter": "",
      "expectedSql": "SELECT Name, Stadt, Kundentyp FROM kunden WHERE (Kundentyp='Firma' OR Kundentyp='Verein') AND (Stadt='Dresden' OR Stadt='Halle') ORDER BY Stadt, Name;",
      "solution": "SELECT Name, Stadt, Kundentyp FROM kunden WHERE (Kundentyp='Firma' OR Kundentyp='Verein') AND (Stadt='Dresden' OR Stadt='Halle') ORDER BY Stadt, Name;",
      "rowHint": "2 Ergebniszeilen",
      "orderSensitive": true,
      "bonus": true
    },
    {
      "id": "b4",
      "chapter": "bonus",
      "title": "Bonus · Fehlerjagd",
      "afb": "II",
      "type": "sql",
      "prompt": "Reparieren Sie den Befehl, sodass alle Veranstaltungstitel mit „Open“ am Ende gefunden werden.",
      "starter": "SELECT Titel\nFROM veranstaltungen\nWHERE Titel LIKE 'Open%';",
      "expectedSql": "SELECT Titel FROM veranstaltungen WHERE Titel LIKE '%Open';",
      "solution": "SELECT Titel FROM veranstaltungen WHERE Titel LIKE '%Open';",
      "rowHint": "1 Ergebniszeile",
      "bonus": true
    },
    {
      "id": "b5",
      "chapter": "bonus",
      "title": "Bonus · Preisstaffel",
      "afb": "III",
      "type": "sql",
      "prompt": "Erhöhen Sie die Preise aller Veranstaltungen unter 10 € um 1,50 €.",
      "starter": "",
      "expectedSql": "UPDATE veranstaltungen SET Preis = Preis + 1.5 WHERE Preis < 10;",
      "solution": "UPDATE veranstaltungen SET Preis = Preis + 1.5 WHERE Preis < 10;",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Preis FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "10 Datensatz/Datensätze werden geändert",
      "bonus": true
    },
    {
      "id": "b6",
      "chapter": "bonus",
      "title": "Bonus · Gezieltes Löschen",
      "afb": "III",
      "type": "sql",
      "prompt": "Löschen Sie die Veranstaltung „Summer Gaming Open“.",
      "starter": "",
      "expectedSql": "DELETE FROM veranstaltungen WHERE Titel='Summer Gaming Open';",
      "solution": "DELETE FROM veranstaltungen WHERE Titel='Summer Gaming Open';",
      "mode": "mutation",
      "verifySql": "SELECT EventID,Titel FROM veranstaltungen ORDER BY EventID;",
      "rowHint": "1 Datensatz/Datensätze werden gelöscht",
      "bonus": true
    },
    {
      "id": "b7",
      "chapter": "bonus",
      "title": "Bonus · SQL Island",
      "afb": "II",
      "type": "free",
      "bonus": true,
      "rowHint": "0 – Reflexionsaufgabe",
      "external": "https://sql-island.informatik.uni-kl.de/",
      "prompt": "Öffnen Sie SQL Island und notieren Sie zwei SQL-Ideen oder Vorgehensweisen, die Ihnen dort geholfen haben.",
      "solution": "Individuelle Reflexion; sinnvoll sind z. B. schrittweises Filtern, das Testen einzelner Bedingungen oder das gezielte Auswählen von Spalten."
    },
    {
      "id": "b8",
      "chapter": "bonus",
      "title": "Bonus · Query Review",
      "afb": "III",
      "type": "free",
      "bonus": true,
      "rowHint": "0 – Reflexionsaufgabe",
      "prompt": "Beschreiben Sie ein systematisches Vorgehen, mit dem Sie einen komplexen SQL-Befehl vor dem Ausführen fachlich prüfen.",
      "solution": "Sinnvoll: Tabelle und Ausgabespalten prüfen; Bedingungen einzeln kontrollieren; AND/OR mit Klammern strukturieren; LIKE-Muster prüfen; Sortierung zuletzt ergänzen; angekündigte Zeilenzahl als Plausibilitätskontrolle nutzen."
    }
  ],
  "glossary": [
    [
      "SQL",
      "Structured Query Language; Sprache zum Abfragen und Verändern relationaler Daten."
    ],
    [
      "Statement",
      "Ein vollständiger SQL-Befehl."
    ],
    [
      "Ergebnismenge",
      "Die Datensätze, die eine SELECT-Abfrage zurückgibt."
    ],
    [
      "SELECT",
      "Legt die auszugebenden Spalten fest."
    ],
    [
      "FROM",
      "Legt die Quelltabelle fest."
    ],
    [
      "WHERE",
      "Filtert Datensätze anhand einer Bedingung."
    ],
    [
      "ORDER BY",
      "Sortiert die Ergebnismenge."
    ],
    [
      "ASC",
      "Aufsteigende Sortierung."
    ],
    [
      "DESC",
      "Absteigende Sortierung."
    ],
    [
      "NOT",
      "Verneint eine Bedingung."
    ],
    [
      "LIKE",
      "Vergleicht Text mit einem Suchmuster."
    ],
    [
      "Wildcard %",
      "Steht in LIKE-Mustern für beliebig viele Zeichen."
    ],
    [
      "AND",
      "Alle verbundenen Bedingungen müssen erfüllt sein."
    ],
    [
      "OR",
      "Mindestens eine verbundene Bedingung muss erfüllt sein."
    ],
    [
      "UPDATE",
      "Ändert Werte vorhandener Datensätze."
    ],
    [
      "SET",
      "Legt bei UPDATE neue Werte fest."
    ],
    [
      "DELETE",
      "Löscht Datensätze."
    ],
    [
      "Primärschlüssel",
      "Attribut, das einen Datensatz eindeutig identifiziert."
    ],
    [
      "Fremdschlüssel",
      "Attribut, das auf den Primärschlüssel einer anderen Tabelle verweist."
    ],
    [
      "Entitätstyp",
      "Art gleichartiger Objekte; wird im Relationenmodell zur Tabelle."
    ],
    [
      "Beziehung",
      "Verknüpfung zwischen Entitätstypen; in Chen-Notation als Raute dargestellt."
    ],
    [
      "Attribut",
      "Eigenschaft; im ER-Modell als Oval und im Relationenmodell als Spalte dargestellt."
    ]
  ],
  "shop": [
    {
      "id": "theme-sky",
      "type": "theme",
      "name": "Sky Theme",
      "xp": 180,
      "icon": "🌤️",
      "value": "sky"
    },
    {
      "id": "avatar-fox",
      "type": "avatar",
      "name": "Query-Fuchs",
      "xp": 260,
      "icon": "🦊",
      "value": "🦊"
    },
    {
      "id": "theme-night",
      "type": "theme",
      "name": "Terminal Night",
      "xp": 420,
      "icon": "🌙",
      "value": "night"
    },
    {
      "id": "avatar-robot",
      "type": "avatar",
      "name": "SQL-Roboter",
      "xp": 560,
      "icon": "🤖",
      "value": "🤖"
    },
    {
      "id": "pet-bee",
      "type": "pet",
      "name": "Binary Bee",
      "xp": 720,
      "icon": "🐝",
      "value": "🐝"
    },
    {
      "id": "outfit-hoodie",
      "type": "outfit",
      "name": "Coder-Hoodie",
      "xp": 850,
      "icon": "🧥",
      "value": "🧥"
    },
    {
      "id": "theme-mint",
      "type": "theme",
      "name": "Mint Data",
      "xp": 980,
      "icon": "🍃",
      "value": "mint"
    },
    {
      "id": "avatar-owl",
      "type": "avatar",
      "name": "Daten-Eule",
      "xp": 1120,
      "icon": "🦉",
      "value": "🦉"
    },
    {
      "id": "pet-cat",
      "type": "pet",
      "name": "Query-Katze",
      "xp": 1280,
      "icon": "🐈",
      "value": "🐈"
    },
    {
      "id": "outfit-suit",
      "type": "outfit",
      "name": "DB-Admin Outfit",
      "xp": 1450,
      "icon": "🕴️",
      "value": "🕴️"
    },
    {
      "id": "avatar-dragon",
      "type": "avatar",
      "name": "SQL-Drache",
      "xp": 1650,
      "icon": "🐉",
      "value": "🐉"
    }
  ],
  "checklist": [
    "Ich kann das ER-Modell der EventHub-Datenbank lesen und Tabellen, Attribute sowie Beziehungen zuordnen.",
    "Ich kann mit SELECT und FROM selbstständig passende Ausgabetabellen erzeugen.",
    "Ich kann mit WHERE Zahlen-, Text- und Datumsbedingungen formulieren.",
    "Ich kann Ergebnisse mit ORDER BY auf- und absteigend sortieren.",
    "Ich kann Bedingungen mit NOT verneinen.",
    "Ich kann mit LIKE und % Textmuster suchen.",
    "Ich kann mehrere Bedingungen mit AND, OR und Klammern korrekt kombinieren.",
    "Ich kann fehlerhafte SQL-Befehle analysieren und korrigieren.",
    "Ich kann aus einer vorgegebenen Ausgabetabelle einen passenden SQL-Befehl entwickeln.",
    "Ich kann UPDATE und DELETE gezielt und sicher mit WHERE einsetzen."
  ]
};
