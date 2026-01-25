# ZollPilot Benutzerhandbuch

**Status:** In Entwicklung - Wird mit der Implementierung neuer Funktionen erweitert

**Zielgruppe:** Endnutzer des öffentlichen ZollPilot-Portals

## Inhaltsverzeichnis

- [Einführung](#einführung)
- [Erste Schritte](#erste-schritte)
- [Verfügbare Seiten](#verfügbare-seiten)
- [Funktionen](#funktionen)
- [Häufig gestellte Fragen (FAQ)](#häufig-gestellte-fragen-faq)
- [Support](#support)

## Einführung

ZollPilot hilft Ihnen, Zolldaten strukturiert zu erfassen und zu verwalten.

**Aktueller Stand:** Die Anwendung befindet sich in aktiver Entwicklung (Phase 0.12). Datenpersistenz über PostgreSQL-Datenbank ist implementiert.

**Qualitätssicherung:** Die Zuverlässigkeit der Plattform ist durch automatisierte Tests und strenge Qualitätskontrollen gewährleistet.

**Sicherheit:** Sicherheitsmaßnahmen werden technisch und organisatorisch umgesetzt.

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
- **Admin:** Administrationsbereich (nur für autorisierte Benutzer)

## Verfügbare Seiten

### Startseite (/)

Die Startseite bietet einen Überblick über ZollPilot und seine Funktionen.

**Was Sie hier finden:**
- Willkommensnachricht und Plattformübersicht
- Links zu wichtigen Bereichen
- Schnellzugriff auf häufig verwendete Funktionen (wird in zukünftigen Phasen erweitert)

### Öffentliches Portal

Das öffentliche Portal ermöglicht den Zugriff auf Zolldaten und -verfahren ohne Anmeldung.

**Geplante Funktionen (kommende Phasen):**
- Suche nach Zollverfahren
- Durchsuchen von Zolldaten
- SEO-optimierte Inhalte für bessere Auffindbarkeit
- Filterung und Kategorisierung

### Health Check (/api/health)

Ein technischer Endpunkt zur Überprüfung des Systemstatus. Dieser wird hauptsächlich für Monitoring-Zwecke verwendet.

## Funktionen

### Aktuelle Funktionen (Phase 0.3)

**Öffentliches Portal:**
- Zugriff auf die Startseite mit Plattformübersicht
- Navigation zwischen öffentlichen und Admin-Bereichen
- Health-Check-Endpunkt für Systemüberwachung

**Datenpersistenz:**
- PostgreSQL-Datenbank für dauerhafte Datenspeicherung
- Mehrmandantenfähigkeit (Multi-Tenancy) vorbereitet
- Audit-Trail für Nachvollziehbarkeit aller Änderungen

### Geplante Funktionen (zukünftige Phasen)

Die folgenden Funktionen werden in kommenden Entwicklungsphasen hinzugefügt:

**Datensuche und -navigation:**
- Volltextsuche in Zolldaten
- Erweiterte Filteroptionen
- Kategoriebasierte Navigation
- Detailansichten für Zollverfahren

**Benutzerverwaltung:**
- Kontoerstellung und -verwaltung
- Personalisiertes Dashboard
- Gespeicherte Suchen und Favoriten

## Häufig gestellte Fragen (FAQ)

### Allgemeine Fragen

**F: Was ist ZollPilot?**
A: ZollPilot ist eine Plattform zur strukturierten Erfassung und Verwaltung von Zolldaten. Sie bietet ein öffentliches Portal für den Zugriff auf Zollinformationen sowie einen Administrationsbereich für die Systemverwaltung.

**F: Benötige ich ein Konto, um ZollPilot zu nutzen?**
A: Für den Zugriff auf das öffentliche Portal ist derzeit kein Konto erforderlich. Die Benutzerverwaltung wird in einer späteren Phase implementiert.

**F: In welcher Phase befindet sich die Entwicklung?**
A: Derzeit in Phase 0.3 - Die grundlegende Anwendungsstruktur mit Next.js und Datenpersistenz über PostgreSQL ist implementiert. Weitere Funktionen folgen in zukünftigen Phasen.

### Technische Fragen

**F: Welche Browser werden unterstützt?**
A: Alle modernen Browser werden unterstützt, einschließlich Google Chrome, Mozilla Firefox, Safari und Microsoft Edge. Wir empfehlen die Verwendung der neuesten Versionen für die beste Erfahrung.

**F: Sind meine Daten sicher?**
A: Ja. Detaillierte Informationen zu unseren Sicherheitsmaßnahmen finden Sie in SECURITY.md.

**F: Ist die Plattform für mobile Geräte optimiert?**
A: Die mobile Optimierung wird in zukünftigen Phasen implementiert.

## Support

### Hilfe erhalten

Wenn Sie Unterstützung benötigen:

- **Dokumentation:** Siehe dieses Handbuch und SETUP.md für technische Details
- **Fehlerberichte:** Issues können über das GitHub-Repository gemeldet werden
- **E-Mail-Support:** [Wird in späteren Phasen bereitgestellt]

### Bekannte Einschränkungen (Phase 0.6)

- Keine Benutzerauthentifizierung (geplant für Phase 2)
- Begrenzte Funktionalität im Admin-Bereich
- Keine Suchfunktion für Zolldaten
- Keine öffentlich verfügbaren Daten (kommt in späteren Phasen)

**Neu in Phase 0.5-0.6:**
- ✅ Datenbankintegration implementiert (PostgreSQL + Prisma)
- ✅ Mehrmandantenfähigkeit vorbereitet
- ✅ Audit-Trail-Infrastruktur bereitgestellt
- ✅ Umfangreiche automatisierte Tests (Unit, Integration, E2E)

Diese Einschränkungen werden in den kommenden Entwicklungsphasen behoben.
