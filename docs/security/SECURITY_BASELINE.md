# ZollPilot Security Baseline

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Inhaltsverzeichnis

- [Security-Status](#security-status)
- [Authentifizierung](#authentifizierung)
- [Autorisierung (RBAC)](#autorisierung-rbac)
- [Secrets Management](#secrets-management)
- [Input Validation](#input-validation)
- [HTTP Security Headers](#http-security-headers)
- [Audit Trail](#audit-trail)
- [Dependency Security](#dependency-security)
- [OWASP Top 10](#owasp-top-10)
- [Security Gaps](#security-gaps)

## Security-Status

| Bereich | Status | Details |
|---------|--------|---------|
| Authentifizierung | **NICHT IMPLEMENTIERT** | Geplant für Phase 2 |
| Autorisierung (RBAC) | Schema vorhanden | Enforcement fehlt |
| Secrets Management | Teilweise | .env-Dateien, keine Rotation |
| Input Validation | Minimal | Nur Prisma-Typen |
| Security Headers | Minimal | X-Powered-By deaktiviert |
| Audit Trail | Infrastruktur | Schema vorhanden, Enforcement fehlt |
| Dependency Scanning | Aktiv | Dependabot konfiguriert |

## Authentifizierung

### Aktueller Status

**NICHT IMPLEMENTIERT**

Die Anwendung hat derzeit keine Authentifizierung. Alle Seiten und API-Endpunkte sind öffentlich zugänglich.

### Geplant (Phase 2)

| Feature | Beschreibung |
|---------|--------------|
| Session-Auth | Cookie-basierte Sessions |
| MFA | Multi-Faktor-Authentifizierung |
| Session-Timeout | Automatische Abmeldung |
| Password Policy | Starke Passwort-Anforderungen |

### Risiko

| Risiko | Schwere | Mitigation |
|--------|---------|------------|
| Unautorisierter Zugriff | **P0** | Keine (außer: keine sensitiven Daten vorhanden) |

## Autorisierung (RBAC)

### Schema-Definition

Rollen sind im Prisma-Schema definiert:

```prisma
enum UserRole {
  ADMIN          // Vollständiger Systemzugriff
  SUPPORT_ADMIN  // Benutzersupport, Read-only Logs
  CONFIG_ADMIN   // Preis- und Konfigurationsverwaltung
  VIEWER         // Nur-Lese-Zugriff
  USER           // Standard-Benutzerzugriff
}
```

### Aktueller Status

**Schema vorhanden, Enforcement NICHT IMPLEMENTIERT**

- Rollen können Users zugewiesen werden
- Kein Middleware/Guard für Berechtigungsprüfung
- Keine API-Endpunkte nutzen Rollen

### Geplante Berechtigungsmatrix

| Aktion | ADMIN | SUPPORT_ADMIN | CONFIG_ADMIN | VIEWER | USER |
|--------|-------|---------------|--------------|--------|------|
| Alle Operationen | ✓ | - | - | - | - |
| Audit-Logs lesen | ✓ | ✓ | - | - | - |
| User-Support | ✓ | ✓ | - | - | - |
| Pricing ändern | ✓ | - | ✓ | - | - |
| Config ändern | ✓ | - | ✓ | - | - |
| Daten lesen | ✓ | ✓ | ✓ | ✓ | ✓ |

## Secrets Management

### Environment Variables

| Variable | Typ | Sensitiv |
|----------|-----|----------|
| `DATABASE_URL` | Connection String | **JA** |
| `POSTGRES_USER` | Benutzername | Ja |
| `POSTGRES_PASSWORD` | Passwort | **JA** |
| `POSTGRES_DB` | Datenbankname | Nein |

### Aktuelle Praxis

- Secrets in `.env` (lokal, nicht committed)
- `.env.example` mit Platzhaltern committed
- `.env` in `.gitignore`

### GAPs

| GAP | Beschreibung | Empfehlung |
|-----|--------------|------------|
| Keine Secret-Rotation | Passwörter werden nicht rotiert | Secret-Rotation implementieren |
| Keine Vault-Integration | Keine zentrale Secret-Verwaltung | HashiCorp Vault o.ä. evaluieren |
| Klartext in Docker Compose | Passwords in docker-compose.dev.yml | Nur für Dev-Umgebung akzeptabel |

## Input Validation

### Aktueller Status

**Minimal**

- Prisma validiert Typen auf DB-Ebene
- Keine explizite Input-Validierung auf API-Ebene
- Keine Schema-Validierung (Zod/Yup)

### Empfehlungen

```typescript
// Beispiel: Zod-Schema für API-Input
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'SUPPORT_ADMIN', 'CONFIG_ADMIN', 'VIEWER', 'USER']),
})
```

## HTTP Security Headers

### Implementiert

| Header | Status | Quelle |
|--------|--------|--------|
| X-Powered-By | Deaktiviert | `next.config.js` |

### Fehlend (empfohlen)

| Header | Empfohlener Wert |
|--------|------------------|
| Content-Security-Policy | `default-src 'self'` |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `DENY` oder `SAMEORIGIN` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| X-XSS-Protection | `1; mode=block` |
| Referrer-Policy | `strict-origin-when-cross-origin` |

### Empfohlene Next.js Config

```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
```

## Audit Trail

### Schema (implementiert)

```prisma
model AuditEvent {
  id           String   @id @default(uuid())
  tenantId     String   // Tenant-Isolation
  actorUserId  String?  // Wer hat gehandelt
  action       String   // Was wurde getan
  entityType   String?  // Welcher Entitätstyp
  entityId     String?  // Welche Entität
  requestId    String   // Distributed Tracing
  ipAddress    String?  // Client-IP
  userAgent    String?  // Client User-Agent
  metadata     Json?    // Alte/neue Werte, Kontext
  createdAt    DateTime @default(now())
}
```

### Enforcement Status

| Aspekt | Status |
|--------|--------|
| Schema definiert | ✓ |
| DB-Immutability | FEHLT (kein TRIGGER) |
| Auto-Logging Middleware | FEHLT |
| PII-Handling | FEHLT |

### Empfohlene Aktionstypen

| Action | Trigger |
|--------|---------|
| `USER_LOGIN` | Erfolgreiche Anmeldung |
| `USER_LOGOUT` | Abmeldung |
| `USER_CREATE` | Neuer User erstellt |
| `USER_UPDATE` | User geändert |
| `USER_DELETE` | User gelöscht |
| `ROLE_CHANGE` | Rolle geändert |
| `PRICING_UPDATE` | Preiskonfiguration geändert |
| `CONFIG_CHANGE` | Systemkonfiguration geändert |

### PII-Handling (geplant)

- Keine PII in Logs ohne Verschlüsselung
- Metadata sollte sensitive Felder maskieren
- Retention Policy erforderlich

## Dependency Security

### Dependabot

**Status:** Aktiv

**Konfiguration:** `.github/dependabot.yml`

| Ecosystem | Schedule | Beschreibung |
|-----------|----------|--------------|
| npm | Weekly (Montag 06:00) | pnpm Workspace |
| github-actions | Weekly (Montag 06:00) | Workflow Actions |

### Audit-Befehle

```bash
# Lokaler Audit
pnpm audit

# Im CI (geplant für Phase 0.9.3)
pnpm audit --audit-level=high
```

### Update-Policy (aus POLICIES.md)

| Update-Typ | Review-SLA | Merge-SLA |
|------------|-----------|-----------|
| Critical Security (CVSS ≥9.0) | 4 Stunden | 8 Stunden |
| High Security (CVSS 7.0-8.9) | 1 Business Day | 2 Business Days |
| Medium/Low Security | 3 Business Days | 5 Business Days |
| Major Updates | 5 Business Days | Sprint Planning |

## OWASP Top 10

### Status-Übersicht

| # | Risiko | Status | Details |
|---|--------|--------|---------|
| A01 | Broken Access Control | **OFFEN** | Keine AuthZ implementiert |
| A02 | Cryptographic Failures | N/A | Keine Krypto-Funktionen |
| A03 | Injection | Teilweise | Prisma ORM schützt vor SQL-Injection |
| A04 | Insecure Design | Teilweise | Security by Design geplant |
| A05 | Security Misconfiguration | Teilweise | Einige Headers fehlen |
| A06 | Vulnerable Components | Aktiv | Dependabot |
| A07 | Auth Failures | **OFFEN** | Keine Auth implementiert |
| A08 | Data Integrity Failures | Teilweise | Keine Signierung |
| A09 | Security Logging | Teilweise | Audit-Schema vorhanden |
| A10 | SSRF | N/A | Keine externen Requests |

## Security Gaps

### P0 - Kritisch

| GAP | Beschreibung | Next Step |
|-----|--------------|-----------|
| Keine Authentifizierung | Alle Endpunkte öffentlich | Phase 2: Auth implementieren |
| Keine Autorisierung | RBAC-Enforcement fehlt | Phase 2: Middleware implementieren |

### P1 - Hoch

| GAP | Beschreibung | Next Step |
|-----|--------------|-----------|
| Fehlende Security Headers | CSP, HSTS etc. fehlen | next.config.js erweitern |
| Keine Input-Validierung | Nur Prisma-Typen | Zod für API-Endpunkte |
| Audit-Enforcement fehlt | Kein Auto-Logging | Middleware implementieren |

### P2 - Mittel

| GAP | Beschreibung | Next Step |
|-----|--------------|-----------|
| Keine Secret-Rotation | Statische Credentials | Rotation-Policy definieren |
| PII in Audit-Logs | Keine Maskierung | PII-Policy implementieren |
| Rate Limiting fehlt | DoS-Risiko | Rate Limiter implementieren |

---

**Letzte Aktualisierung:** 2026-01-25
