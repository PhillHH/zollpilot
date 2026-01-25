# ZollPilot Integrationen

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Aktive Integrationen](#aktive-integrationen)
- [Geplante Integrationen](#geplante-integrationen)
- [Integration-Details](#integration-details)

## Übersicht

| Integration | Typ | Status | Zweck |
|-------------|-----|--------|-------|
| PostgreSQL | Datenbank | Aktiv | Primäre Datenspeicherung |
| GitHub Actions | CI/CD | Aktiv | Automatisierte Pipelines |
| Dependabot | Security | Aktiv | Dependency-Updates |

**Gesamt:** 3 aktive Integrationen, 0 externe APIs

## Aktive Integrationen

### 1. PostgreSQL

#### Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Typ** | Relationale Datenbank |
| **Version** | 16-alpine |
| **Protokoll** | TCP (PostgreSQL Wire Protocol) |
| **Port** | 5432 |
| **Status** | Aktiv |

#### Konfiguration

**Environment Variables:**

| Variable | Beschreibung | Beispielwert |
|----------|--------------|--------------|
| `DATABASE_URL` | Prisma Connection String | `postgresql://user:pass@host:5432/db?schema=public` |
| `POSTGRES_USER` | DB-Benutzer | `zollpilot` |
| `POSTGRES_PASSWORD` | DB-Passwort | (Secret) |
| `POSTGRES_DB` | Datenbankname | `zollpilot_dev` |

**Connection String Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

#### Retry/Fehlerverhalten

| Aspekt | Verhalten |
|--------|-----------|
| Connection Retry | Prisma Default (keine explizite Config) |
| Query Timeout | Prisma Default |
| Connection Pooling | Prisma internes Pooling |

#### Docker-Konfiguration

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
```

#### Verwendung im Code

```typescript
// apps/web/src/server/db.ts
import { PrismaClient } from '@prisma/client'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})
```

---

### 2. GitHub Actions

#### Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Typ** | CI/CD Platform |
| **Trigger** | Push, Pull Request |
| **Config-Datei** | `.github/workflows/ci.yml` |
| **Status** | Aktiv |

#### Workflow-Jobs

| Job | Runner | Beschreibung |
|-----|--------|--------------|
| `quality` | ubuntu-latest | Formatting, Linting, Typecheck, Unit Tests |
| `integration` | ubuntu-latest | Integration Tests mit PostgreSQL Service |
| `e2e` | ubuntu-latest | E2E Tests mit Playwright |

#### Trigger-Events

```yaml
on:
  pull_request:
  push:
    branches:
      - main
      - 'claude/**'
      - 'feature/**'
      - 'fix/**'
```

#### Service Container (Integration Tests)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: zollpilot_test
    ports:
      - 5432:5432
```

#### Artifacts

| Artifact | Job | Retention |
|----------|-----|-----------|
| `coverage-report` | quality | 7 Tage |
| `playwright-report` | e2e (on failure) | 7 Tage |
| `playwright-traces` | e2e (on failure) | 7 Tage |

---

### 3. Dependabot

#### Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Typ** | Dependency-Management |
| **Config-Datei** | `.github/dependabot.yml` |
| **Status** | Aktiv |

#### Update-Schedule

| Ecosystem | Intervall | Tag | Uhrzeit | Timezone |
|-----------|-----------|-----|---------|----------|
| npm | weekly | Montag | 06:00 | Europe/Berlin |
| github-actions | weekly | Montag | 06:00 | Europe/Berlin |

#### Gruppierung

**Dev-Dependencies:**
- eslint*, prettier*, @typescript-eslint/*, typescript
- vitest*, @vitest/*, playwright*, @playwright/*
- husky, lint-staged, commitlint*, @commitlint/*

**Runtime-Dependencies:**
- next, react, react-dom
- @prisma/*, prisma

#### Limits

| Eigenschaft | Wert |
|-------------|------|
| npm PRs | max. 5 offen |
| github-actions PRs | max. 3 offen |

#### Labels

| Ecosystem | Labels |
|-----------|--------|
| npm | `dependencies`, `automated` |
| github-actions | `dependencies`, `ci`, `automated` |

---

## Geplante Integrationen

### Phase 2 (geplant)

| Integration | Typ | Zweck |
|-------------|-----|-------|
| Auth Provider | Authentication | User-Login (OAuth/OIDC) |
| SMTP/Email | Communication | Transaktionale E-Mails |

### Zukünftige Phasen

| Integration | Typ | Zweck |
|-------------|-----|-------|
| S3/Object Storage | Storage | Datei-Uploads |
| Redis | Cache | Session-Store, Caching |
| Sentry/Monitoring | Observability | Error Tracking |
| Logging Service | Observability | Zentrales Logging |

---

## Integration-Checkliste für neue Integrationen

Bei Hinzufügen neuer Integrationen:

- [ ] Environment Variables dokumentiert
- [ ] Secrets in `.env.example` als Platzhalter
- [ ] Connection-Handling implementiert
- [ ] Retry/Timeout-Verhalten definiert
- [ ] Healthcheck implementiert
- [ ] Tests für Integration geschrieben
- [ ] Dokumentation in INTEGRATIONS.md ergänzt
- [ ] CI/CD-Konfiguration angepasst

---

**Letzte Aktualisierung:** 2026-01-25
