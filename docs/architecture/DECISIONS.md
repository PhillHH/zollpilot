# Architecture Decision Records (ADR) - Index

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Übersicht

Dieses Dokument enthält einen Index aller Architekturentscheidungen im ZollPilot-Projekt. Formelle ADRs sind geplant, aber noch nicht erstellt. Die folgenden Entscheidungen wurden aus dem Code, der Konfiguration und der bestehenden Dokumentation abgeleitet.

## Abgeleitete Entscheidungen (aus Code/Config)

### ADR-001: Monorepo mit pnpm Workspaces

**Status:** Accepted (Phase 0.1)

**Kontext:**
Das Projekt benötigt eine skalierbare Struktur für mehrere Pakete und Apps.

**Entscheidung:**
Verwendung von pnpm Workspaces als Monorepo-Lösung.

**Belege:**
- `pnpm-workspace.yaml`: Definiert `apps/*` und `packages/*`
- `package.json`: `packageManager: pnpm@9.15.2`

**Konsequenzen:**
- Einheitliche Dependency-Verwaltung
- Shared Packages möglich (aktuell leer)
- Workspace-Protokoll für interne Abhängigkeiten

---

### ADR-002: Next.js mit App Router

**Status:** Accepted (Phase 0.2)

**Kontext:**
Auswahl eines Frontend-Frameworks für SSR und SEO-Optimierung.

**Entscheidung:**
Next.js 14 mit App Router (nicht Pages Router).

**Belege:**
- `apps/web/src/app/` Verzeichnisstruktur
- `apps/web/next.config.js`: Konfiguration

**Konsequenzen:**
- Server-Side Rendering by default
- File-based Routing mit Layouts
- React Server Components nutzbar (noch nicht genutzt)

---

### ADR-003: PostgreSQL als primäre Datenbank

**Status:** Accepted (Phase 0.3)

**Kontext:**
Auswahl einer Datenbank für Multi-Tenancy und komplexe Queries.

**Entscheidung:**
PostgreSQL 16 mit Prisma ORM.

**Belege:**
- `docker-compose.dev.yml`: `postgres:16-alpine`
- `apps/web/prisma/schema.prisma`: `provider = "postgresql"`

**Konsequenzen:**
- Robuste relationale Datenbank
- UUID als Primary Keys
- Schema-per-Run für Test-Isolation

---

### ADR-004: Multi-Tenancy auf Datenbankebene

**Status:** Accepted (Phase 0.3)

**Kontext:**
Datenisolierung zwischen verschiedenen Organisationen/Mandanten.

**Entscheidung:**
Tenant-ID als Foreign Key in allen relevanten Modellen.

**Belege:**
- `schema.prisma`: `Tenant` Model, `tenantId` in `User` und `AuditEvent`
- Unique Constraint: `@@unique([tenantId, email])` für User

**Konsequenzen:**
- Strenge Datenisolierung
- Query-Filter erforderlich für alle Tenant-bezogenen Abfragen
- Cross-Tenant-Operationen explizit verhindert

---

### ADR-005: Immutable Audit Trail

**Status:** Accepted (Phase 0.3)

**Kontext:**
Compliance-Anforderung für Nachvollziehbarkeit aller Admin-Aktionen.

**Entscheidung:**
Append-only `AuditEvent`-Tabelle mit strukturiertem Metadaten-JSON.

**Belege:**
- `schema.prisma`: `AuditEvent` Model
- `POLICIES.md`: "MANDATORY: Every admin action must generate an audit event"

**Konsequenzen:**
- Keine DELETE/UPDATE auf AuditEvent erlaubt (per Policy, nicht DB-Constraint)
- Metadata als JSON für Flexibilität
- Indexes für effiziente Queries nach Tenant, Action, Zeit

**GAP:** DB-Level-Constraint für Immutability fehlt noch.

---

### ADR-006: Test-Driven Development (TDD) mit Coverage-Enforcement

**Status:** Accepted (Phase 0.4)

**Kontext:**
Sicherstellung von Codequalität durch automatisierte Tests.

**Entscheidung:**
≥80% Coverage-Threshold für alle Metriken (Lines, Functions, Branches, Statements).

**Belege:**
- `vitest.config.ts`: `thresholds: { lines: 80, ... }`
- `POLICIES.md`: "MANDATORY: Write tests BEFORE implementation"

**Konsequenzen:**
- `pnpm test:coverage` schlägt bei Coverage <80% fehl
- TDD-Prozess in Entwicklerworkflow integriert
- Drei Test-Ebenen: Unit, Integration, E2E

---

### ADR-007: Git Hooks für lokale Qualitätssicherung

**Status:** Accepted (Phase 0.7)

**Kontext:**
Frühzeitiges Erkennen von Problemen vor Push zu Remote.

**Entscheidung:**
Husky + lint-staged + commitlint.

**Belege:**
- `.husky/` Verzeichnis
- `.lintstagedrc.cjs`: Konfiguration
- `commitlint.config.cjs`: Conventional Commits

**Konsequenzen:**
- Pre-commit: ESLint, Prettier auf staged files
- Commit-msg: Conventional Commit Format
- Pre-push: Unit Tests

---

### ADR-008: CI Pipeline mit drei parallelen Jobs

**Status:** Accepted (Phase 0.8)

**Kontext:**
Automatisierte Qualitätssicherung auf GitHub.

**Entscheidung:**
Drei Jobs: `quality`, `integration`, `e2e`.

**Belege:**
- `.github/workflows/ci.yml`

**Konsequenzen:**
- Parallele Ausführung für schnelleres Feedback
- Separate PostgreSQL-Service für Integration-Tests
- Playwright mit Chromium für E2E

---

## Offene Entscheidungen / Gaps

### Pending: Authentifizierung/Autorisierung

**Status:** Pending (Phase 2)

**Optionen diskutiert (aus Docs abgeleitet):**
- NextAuth.js
- Custom Auth mit Sessions
- OAuth/OIDC Provider

**Keine Entscheidung getroffen** - wird in Phase 2 adressiert.

---

### Pending: API-Design (REST vs GraphQL)

**Status:** Pending

**Beleg:** `ARCHITECTURE.md`: "TBD - REST/GraphQL decision pending"

---

### Pending: Production Deployment

**Status:** Pending

**Beleg:** `ARCHITECTURE.md`: "TBD - Containerized deployment planned"

**GAP:** Kein Dockerfile, keine Kubernetes/Helm Manifeste.

---

## ADR-Template für neue Entscheidungen

```markdown
# ADR-XXX: [Titel]

**Status:** Proposed | Accepted | Deprecated | Superseded

**Datum:** YYYY-MM-DD

## Kontext

[Beschreibung des Problems oder der Anforderung]

## Entscheidung

[Was wurde entschieden]

## Optionen betrachtet

1. **Option A:** ...
2. **Option B:** ...
3. **Option C:** ...

## Konsequenzen

### Vorteile
- ...

### Nachteile
- ...

## Referenzen

- [Link zu Issues, Dokumentation, etc.]
```

---

**Letzte Aktualisierung:** 2026-01-25
