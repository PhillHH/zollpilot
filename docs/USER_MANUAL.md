# ZollPilot Benutzerhandbuch

**Status:** In Entwicklung (Sprint 1 MVP)

**Zielgruppe:** Endnutzer des öffentlichen ZollPilot-Portals

## Inhaltsverzeichnis

- [Einführung](#einführung)
- [Internetausfuhranmeldung (IAA)](#internetausfuhranmeldung-iaa)
- [Erste Schritte](#erste-schritte)
- [Verfügbare Seiten](#verfügbare-seiten)
- [Funktionen](#funktionen)
- [Häufig gestellte Fragen (FAQ)](#häufig-gestellte-fragen-faq)
- [Support](#support)

## Einführung

ZollPilot hilft Ihnen, Zolldaten strukturiert zu erfassen und zu verwalten.

**Aktueller Stand:** Phase 1 (MVP) - IAA Export Assistent ist verfügbar.

## Internetausfuhranmeldung (IAA)

Der IAA-Assistent führt Sie Schritt für Schritt durch die Erstellung einer Ausfuhranmeldung.

### Funktionsweise
1. **Start:** Klicken Sie auf "Neue Anmeldung" im Dashboard.
2. **Beteiligte:** Geben Sie Versender und Empfänger an.
3. **Transport:** Wählen Sie den Verkehrszweig und geben Sie Kennzeichen ein.
4. **Waren:** Erfassen Sie Ihre Warenpositionen (Beschreibung, Gewicht, Wert).
5. **Abschluss:** Prüfen Sie die Daten und laden Sie das PDF herunter.

### Wichtige Hinweise
- Sie können den Prozess jederzeit unterbrechen und später fortsetzen ("Entwurf").
- Alle Pflichtfelder müssen ausgefüllt sein, bevor Sie die Anmeldung abschließen können.
- Es erfolgt **keine** Übermittlung an den Zoll (Demo-Modus).

## Erste Schritte

### Zugriff auf die Anwendung

Die ZollPilot-Webanwendung ist über Ihren Browser erreichbar. Öffnen Sie einfach die bereitgestellte URL in einem modernen Browser.

**Unterstützte Browser:**
- Google Chrome (empfohlen)
- Mozilla Firefox
- Safari
- Microsoft Edge

### Navigation

Die Hauptnavigation befindet sich am oberen Rand jeder Seite und ermöglicht Ihnen den schnellen Zugriff auf:
- **Home:** Startseite mit Übersicht
- **Meine Anmeldungen:** Dashboard für Ihre IAA-Vorgänge
- **Admin:** Administrationsbereich (nur für autorisierte Benutzer)

## Verfügbare Seiten

### Startseite (/)

Die Startseite bietet einen Überblick über ZollPilot und seine Funktionen.

### Dashboard (/declarations)

Hier sehen Sie alle Ihre angelegten Ausfuhranmeldungen (Entwürfe und abgeschlossene).

### IAA Wizard (/declarations/[id]/wizard/...)

Der Assistent zur Datenerfassung.

## Funktionen

### Aktuelle Funktionen (Phase 1 MVP)

**IAA Wizard:**
- Schritt-für-Schritt Datenerfassung
- Automatische Speicherung
- PDF-Export
- Validierung der Eingaben

**Datenpersistenz:**
- PostgreSQL-Datenbank für dauerhafte Datenspeicherung
- Mehrmandantenfähigkeit (Multi-Tenancy) vorbereitet

### Geplante Funktionen (zukünftige Phasen)

- Echte Zoll-Anbindung (ATLAS)
- Benutzerverwaltung
- Import-Verfahren

## Häufig gestellte Fragen (FAQ)

### Allgemeine Fragen

**F: Was ist ZollPilot?**
A: ZollPilot ist eine Plattform zur strukturierten Erfassung und Verwaltung von Zolldaten.

**F: Werden meine Daten an den Zoll gesendet?**
A: Nein, im aktuellen MVP-Status werden keine Daten übermittelt. Das PDF dient nur zu Demonstrationszwecken.

**F: Benötige ich ein Konto?**
A: Nein, derzeit wird ein Demo-Benutzer automatisch verwendet.

## Support

### Hilfe erhalten

Wenn Sie Unterstützung benötigen:

- **Dokumentation:** Siehe dieses Handbuch und SETUP.md für technische Details
- **Fehlerberichte:** Issues können über das GitHub-Repository gemeldet werden

### Bekannte Einschränkungen (MVP)

- Keine Benutzerauthentifizierung
- Keine Abgabenberechnung
- PDF ist ein Mockup
- Keine Validierung gegen echte Codelisten (Länder, Währungen)
