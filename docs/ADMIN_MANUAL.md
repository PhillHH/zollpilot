# ZollPilot Administrator-Handbuch

**Status:** In Entwicklung - Wird mit der Implementierung neuer Funktionen erweitert

**Zielgruppe:** Systemadministratoren und Operations-Team

## Inhaltsverzeichnis

- [Einführung](#einführung)
- [Aktueller Status (Phase 0.4)](#aktueller-status-phase-04)
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

**Qualitätssicherung:** Die Plattform unterliegt strengen automatisierten Qualitätskontrollen mit ≥80% Testabdeckung.

**Sicherheit:** Sicherheitsmaßnahmen werden technisch und organisatorisch umgesetzt.

## Aktueller Status (Phase 0.12)

### Verfügbare Admin-Seite

Der Admin-Bereich ist über `/admin` erreichbar und zeigt derzeit eine Platzhalterseite mit folgenden Informationen:

- Übersicht über geplante Admin-Funktionen
- Link zur Startseite
- Status: "Funktionen folgen in Phase 2"

**Zugriff:**
- URL: `http://localhost:3000/admin`
- Keine Authentifizierung erforderlich (wird in Phase 2 hinzugefügt)

### Datenbank-Infrastruktur (Neu in Phase 0.3)

Die Datenbank-Grundlage für alle Admin-Funktionen ist nun implementiert:

**Implementierte Datenmodelle:**
- **Tenant** - Mehrmandantenfähigkeit (Multi-Tenancy)
- **User** - Benutzerkonten mit Rollenverwaltung
- **AuditEvent** - Unveränderlicher Audit-Trail

**Audit-Trail-Infrastruktur:**
Alle zukünftigen Admin-Aktionen werden automatisch als Audit-Events erfasst mit:
- Zeitstempel und Benutzer
- Aktion und betroffene Ressource
- Alte und neue Werte
- IP-Adresse und User-Agent
- Request-ID für Distributed Tracing

**Technische Details:** Siehe `docs/ARCHITECTURE.md` für vollständige Datenbankschema-Dokumentation.

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

### Unveränderlicher Audit-Trail (Neu in Phase 0.12)

**Status:** ✅ Infrastruktur implementiert

**Wichtig:** Die Audit-Trail-Infrastruktur ist vollständig implementiert. Alle zukünftigen Admin-Aktionen werden automatisch als unveränderliche Audit-Events in der Datenbank erfasst.

**Erfasste Informationen pro Audit-Event:**
- **Pflichtfelder:**
  - `tenantId` - Mandanten-ID (Multi-Tenancy-Isolation)
  - `action` - Aktionstyp (z.B. `USER_CREATED`, `PRICING_UPDATED`)
  - `requestId` - Korrelations-ID für Distributed Tracing
  - `createdAt` - Zeitstempel (automatisch, ISO 8601)

- **Optionale Felder:**
  - `actorUserId` - Benutzer-ID (null für System-Aktionen)
  - `entityType` - Typ der betroffenen Ressource (z.B. "User", "Shipment")
  - `entityId` - ID der betroffenen Ressource
  - `ipAddress` - Client-IP-Adresse
  - `userAgent` - Browser/Client-Informationen
  - `metadata` - Zusätzlicher Kontext als JSON (max. 10KB)

**Technische Details:** Audit-Events werden über die Helper-Funktion `logAuditEvent()` in `apps/web/src/server/audit.ts` erstellt. Siehe `docs/OBSERVABILITY.md` für vollständige Dokumentation.

### Anzeige des Audit-Trails

**Status:** Noch nicht implementiert (UI folgt in Phase 2+)

**Aktuell verfügbar:**
- Audit-Events können über Prisma Studio eingesehen werden: `pnpm prisma:studio`
- Datenbankabfragen über SQL oder Prisma Client möglich
- Automatische Erfassung bei System-Aktionen (z.B. Database Seed)

### Implementierte Audit-Event-Typen

**Verfügbar in Phase 0.12:**
- `SYSTEM_SEED` - Datenbank-Initialisierung
- `USER_CREATED` - Benutzer erstellt
- `USER_UPDATED` - Benutzer aktualisiert
- `USER_DELETED` - Benutzer gelöscht
- `PRICING_UPDATED` - Preisänderung
- `PRICING_EXPORTED` - Preisdaten exportiert

**Erweiterbar:** Neue Aktionstypen können in `AUDIT_ACTIONS` Konstante hinzugefügt werden.

### Aufbewahrung von Audit-Logs

**Implementierte Richtlinie (Phase 0.12):**
- ✅ **Unveränderlich** - Append-only, keine Updates oder Löschungen
- ✅ **Datenbankbasiert** - Gespeichert in `audit_events` Tabelle
- ✅ **Verschlüsselt** - Database-level Verschlüsselung im Ruhezustand
- ✅ **Validierung** - Pflichtfelder und Größenlimits werden technisch erzwungen
- 📋 **Aufbewahrung** - Mindestens 2 Jahre empfohlen (organisatorische Richtlinie)
- 📋 **Backups** - Teil der Datenbank-Backup-Strategie

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
