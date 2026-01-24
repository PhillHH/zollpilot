# ZollPilot Administrator-Handbuch

**Status:** In Entwicklung - Wird mit der Implementierung neuer Funktionen erweitert

**Zielgruppe:** Systemadministratoren und Operations-Team

## Inhaltsverzeichnis

- [Einführung](#einführung)
- [Aktueller Status (Phase 0.2)](#aktueller-status-phase-02)
- [Admin-Zugang](#admin-zugang)
- [Preiskonfiguration](#preiskonfiguration)
- [Logging & Monitoring](#logging--monitoring)
- [Audit-Protokolle](#audit-protokolle)
- [Support-Tools](#support-tools)
- [Benutzerverwaltung](#benutzerverwaltung)
- [Fehlerbehebung](#fehlerbehebung)

## Einführung

Das ZollPilot Admin-Backend bietet Werkzeuge für:
- Preiskonfiguration
- System-Monitoring und Logging
- Benutzersupport
- Überprüfung von Audit-Trails

**KRITISCH:** Alle Admin-Aktionen erzeugen unveränderliche Audit-Events.

## Aktueller Status (Phase 0.3)

*Hinweis: Die Datenbank-Infrastruktur für die Speicherung von Konfigurationen und Logs wird derzeit vorbereitet.*

### Verfügbare Admin-Seite

Der Admin-Bereich ist über `/admin` erreichbar und zeigt derzeit eine Platzhalterseite mit folgenden Informationen:

- Übersicht über geplante Admin-Funktionen
- Link zur Startseite
- Status: "Funktionen folgen in Phase 2"

**Zugriff:**
- URL: `http://localhost:3000/admin`
- Keine Authentifizierung erforderlich (wird in Phase 2 hinzugefügt)

### Geplante Funktionen (Phase 2+)

Die folgenden Admin-Funktionen werden in zukünftigen Phasen implementiert:

1. **Preiskonfiguration** - Verwaltung von Preisstufen und Tarifmodellen
2. **System-Logging** - Zugriff auf Anwendungs- und Fehlerprotokolle
3. **Audit-Trail-Viewer** - Übersicht aller Admin-Aktionen
4. **Support-Tools** - Werkzeuge zur Benutzerverwaltung und -unterstützung
5. **Benutzerverwaltung** - Rollen, Berechtigungen und Konten verwalten

## Admin-Zugang

### Authentifizierung

**Aktueller Status (Phase 0.2):** Noch nicht implementiert

**Geplant für Phase 2:**
- Sichere Admin-Authentifizierung
- Multi-Faktor-Authentifizierung (MFA)
- Session-Management mit automatischem Timeout

### Rollenbasierte Zugriffskontrolle (RBAC)

**Aktueller Status:** Noch nicht implementiert

**Geplante Rollen:**
```
- Super Admin    - Vollständiger Systemzugriff
- Support Admin  - Benutzersupport, Nur-Lese-Zugriff auf Logs
- Config Admin   - Preis- und Konfigurationsverwaltung
- Viewer         - Nur-Lese-Zugriff
```

## Preiskonfiguration

### Verwaltung von Preisstufen

**Status:** Noch nicht implementiert (Phase 2+)

### Preisaktualisierungen

**Status:** Noch nicht implementiert

**Wichtig:** Alle Preisänderungen werden auditiert und versioniert.

**Geplante Funktionen:**
- Versionierung von Preisänderungen
- Historische Preisübersicht
- Automatische Audit-Trail-Erstellung bei jeder Änderung
- Gültigkeitszeiträume für Preismodelle

## Logging & Monitoring

### System-Logs

**Status:** Noch nicht implementiert (Phase 0.3+)

**Geplante Funktionen:**
- Zugriff auf Anwendungsprotokolle
- Filterung nach Log-Level (ERROR, WARN, INFO, DEBUG)
- Volltextsuche in Logs
- Export-Funktion für Logs

### Performance-Monitoring

**Status:** Noch nicht implementiert

**Geplante Metriken:**
- Response-Zeiten
- Fehlerquoten
- Datenbankabfrage-Performance
- Ressourcenauslastung

### Fehler-Tracking

**Status:** Noch nicht implementiert

**Geplante Funktionen:**
- Automatische Fehlererfassung
- Stack-Trace-Anzeige
- Benachrichtigungen bei kritischen Fehlern

## Audit-Protokolle

### Anzeige des Audit-Trails

**Status:** Noch nicht implementiert (Phase 0.5+)

**Wichtig:** Jede Admin-Aktion erzeugt ein Audit-Event mit:
- Zeitstempel (ISO 8601)
- Benutzer-ID und Benutzername
- Aktionstyp
- Betroffene Ressource
- Alte und neue Werte (falls zutreffend)
- IP-Adresse
- User-Agent

### Audit-Event-Typen

**Geplante Event-Typen:**
- `PRICING_UPDATE` - Preisänderung
- `USER_ROLE_CHANGE` - Rollenänderung
- `CONFIG_CHANGE` - Konfigurationsänderung
- `SUPPORT_TICKET_VIEW` - Support-Ticket-Zugriff
- `USER_DELETE` - Benutzer gelöscht
- `USER_CREATE` - Benutzer erstellt

### Aufbewahrung von Audit-Logs

**Geplante Richtlinie:**
- Mindestaufbewahrung: 2 Jahre
- Unveränderlich (append-only)
- Verschlüsselt im Ruhezustand
- Regelmäßige Backups

## Support-Tools

### Benutzersuche

**Status:** Noch nicht implementiert (Phase 2+)

**Geplante Funktionen:**
- Suche nach E-Mail, ID oder Name
- Kontodetails anzeigen
- Aktivitätsverlauf

### Kontoverwaltung

**Status:** Noch nicht implementiert

**Geplante Funktionen:**
- Passwort-Zurücksetzung
- Konto aktivieren/deaktivieren
- Berechtigungen ändern

### Support-Ticket-System

**Status:** Noch nicht implementiert

## Benutzerverwaltung

### Benutzer erstellen

**Status:** Noch nicht implementiert (Phase 2+)

**Geplante Funktionen:**
- Manuelle Benutzererstellung
- Rollenauswahl
- Automatische Benachrichtigung

### Rollen verwalten

**Status:** Noch nicht implementiert

**Wichtig:** Alle Benutzerverwaltungsaktionen werden vollständig auditiert.

### Konten deaktivieren

**Status:** Noch nicht implementiert

**Geplante Optionen:**
- Temporäre Deaktivierung
- Permanente Löschung (mit Audit-Trail)

## Fehlerbehebung

### Häufige Probleme

**Aktuell (Phase 0.2):**

**Problem:** Admin-Seite zeigt nur Platzhalter
**Lösung:** Dies ist das erwartete Verhalten in Phase 0.2. Admin-Funktionen werden in Phase 2 implementiert.

**Problem:** Keine Authentifizierung erforderlich
**Lösung:** Authentifizierung wird in Phase 2 hinzugefügt.

### Notfallkontakte

**Status:** Wird in späteren Phasen bereitgestellt

### Runbook-Links

**Status:** Operationelle Runbooks werden in Phase 0.8+ erstellt
