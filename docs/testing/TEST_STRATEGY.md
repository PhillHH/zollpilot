# ZollPilot Test-Strategie

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Test-Pyramide](#test-pyramide)
- [Test-Ebenen](#test-ebenen)
- [Coverage-Ziele](#coverage-ziele)
- [Test-Ausführung](#test-ausführung)
- [Test-Infrastruktur](#test-infrastruktur)
- [Bekannte Lücken](#bekannte-lücken)

## Übersicht

| Aspekt | Wert |
|--------|------|
| **Testing Framework** | Vitest 4.0.18 |
| **E2E Framework** | Playwright 1.58.0 |
| **Coverage Tool** | @vitest/coverage-v8 |
| **Coverage Threshold** | ≥80% (alle Metriken) |

### Test-Inventar

| Typ | Anzahl Dateien | Beschreibung |
|-----|----------------|--------------|
| Unit Tests | 3 | `*.test.{ts,tsx}` |
| Integration Tests | 1 | `*.int.test.{ts,tsx}` |
| E2E Tests | 3 | `*.e2e.spec.ts` |

## Test-Pyramide

```
         /\
        /  \        E2E Tests (3)
       /    \       - Browser-basiert
      /------\      - Vollständige User Journeys
     /        \
    /          \    Integration Tests (1)
   /            \   - Echte Datenbank
  /--------------\  - Schema-per-Run Isolation
 /                \
/==================\  Unit Tests (3)
                      - Schnell, isoliert
                      - Mocking wo nötig
                      - jsdom Environment
```

## Test-Ebenen

### 1. Unit Tests

**Charakteristiken:**
- Dateinamenskonvention: `*.test.{ts,tsx}`
- Environment: jsdom (Browser-Simulation)
- Keine externe Dependencies
- Schnelle Ausführung

**Konfiguration:** `apps/web/vitest.config.ts`

**Aktuelle Unit-Test-Dateien:**

| Datei | Testet |
|-------|--------|
| `src/app/page.test.tsx` | Home Page Rendering |
| `src/app/admin/page.test.tsx` | Admin Page Rendering |
| `src/app/api/health/route.test.ts` | Health API Response |

**Beispiel:**
```typescript
// src/app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('ZollPilot')
  })
})
```

---

### 2. Integration Tests

**Charakteristiken:**
- Dateinamenskonvention: `*.int.test.{ts,tsx}`
- Environment: node
- Echte PostgreSQL-Datenbank
- Schema-per-Run Isolation

**Konfiguration:** `apps/web/vitest.integration.config.ts`

**Aktuelle Integration-Test-Dateien:**

| Datei | Testet |
|-------|--------|
| `src/server/db.int.test.ts` | Prisma Client, alle Models |

**Test-Utilities:**

| Utility | Datei | Zweck |
|---------|-------|-------|
| `truncateAll()` | `test/db-utils.ts` | Tabellen leeren |
| `createTenant()` | `test/factories.ts` | Test-Tenant erstellen |
| `createUser()` | `test/factories.ts` | Test-User erstellen |
| `createAuditEvent()` | `test/factories.ts` | Test-AuditEvent erstellen |

**Schema-per-Run Isolation:**
```
test_1706180400000_abc12
     └─ timestamp    └─ random
```

- Global Setup: Schema erstellen, Migrations anwenden
- Tests: Isoliert im eigenen Schema
- Global Teardown: Schema löschen

**Beispiel:**
```typescript
// src/server/db.int.test.ts
import { prisma } from './db'
import { truncateAll } from '../../test/db-utils'
import { createTenant } from '../../test/factories'

describe('Tenant Model', () => {
  afterEach(async () => {
    await truncateAll(prisma)
  })

  it('should create and query tenant', async () => {
    const tenant = await createTenant(prisma, { name: 'Test' })
    expect(tenant.name).toBe('Test')
  })
})
```

---

### 3. E2E Tests

**Charakteristiken:**
- Dateinamenskonvention: `*.e2e.spec.ts`
- Verzeichnis: `apps/web/e2e/`
- Browser: Chromium
- Vollständige User Journeys

**Konfiguration:** `apps/web/playwright.config.ts`

**Aktuelle E2E-Test-Dateien:**

| Datei | Testet |
|-------|--------|
| `e2e/home.e2e.spec.ts` | Home Page, Navigation |
| `e2e/admin.e2e.spec.ts` | Admin Page |
| `e2e/health.e2e.spec.ts` | Health API |

**Test-Modi:**

| Modus | Befehl | Beschreibung |
|-------|--------|--------------|
| Local | `pnpm test:e2e` | Mit `next dev`, schnell |
| CI | `pnpm test:e2e:ci` | Mit `next build`, stabil |
| UI | `pnpm test:e2e:ui` | Interaktiv/Debugging |

**Beispiel:**
```typescript
// e2e/home.e2e.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to admin', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /admin/i }).click()
  await expect(page).toHaveURL('/admin')
})
```

## Coverage-Ziele

### Thresholds (Enforced)

| Metrik | Minimum | Quelle |
|--------|---------|--------|
| Lines | 80% | `vitest.config.ts` |
| Functions | 80% | `vitest.config.ts` |
| Branches | 80% | `vitest.config.ts` |
| Statements | 80% | `vitest.config.ts` |

**Enforcement:** `pnpm test:coverage` schlägt fehl bei Coverage < 80%

### Coverage-Ausschlüsse

Folgende Dateien sind von Coverage ausgeschlossen:

```typescript
// vitest.config.ts
coverage: {
  exclude: [
    'node_modules/',
    'vitest.config.ts',
    'vitest.integration.config.ts',
    'vitest.setup.ts',
    'playwright.config.ts',
    'next.config.js',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/*.int.test.{ts,tsx}',
    '**/*.e2e.spec.{ts,tsx}',
    'prisma/',
    'scripts/',
    'test/',
    'e2e/',
    '.next/',
  ]
}
```

### Coverage-Report

**Generierung:**
```bash
pnpm test:coverage
```

**Report-Formate:**
- `text` - Terminal-Output
- `html` - `apps/web/coverage/index.html`
- `json-summary` - Für CI-Integration

## Test-Ausführung

### Lokale Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm test` | Unit + Integration Tests |
| `pnpm test:unit` | Nur Unit Tests |
| `pnpm test:integration` | Nur Integration Tests |
| `pnpm test:coverage` | Unit Tests mit Coverage |
| `pnpm test:e2e` | E2E Tests (Local Mode) |
| `pnpm test:e2e:ci` | E2E Tests (CI Mode) |
| `pnpm test:e2e:ui` | E2E Interactive |

### CI-Pipeline

**Quality Gates Job:**
```bash
pnpm test:coverage  # Unit Tests + Coverage Enforcement
```

**Integration Tests Job:**
```bash
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm test:integration
```

**E2E Tests Job:**
```bash
npx playwright install chromium
pnpm test:e2e:ci
```

### Voraussetzungen

| Test-Typ | Voraussetzung |
|----------|---------------|
| Unit | Keine |
| Integration | PostgreSQL muss laufen |
| E2E | Chromium muss installiert sein |

## Test-Infrastruktur

### Vitest Setup

**Datei:** `apps/web/vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
```

### Integration Test Setup

| Datei | Zweck |
|-------|-------|
| `test/setup.ts` | Vitest Setup für Integration |
| `test/global-setup.ts` | Schema erstellen, Migrations |
| `test/global-teardown.ts` | Schema löschen |
| `test/db-utils.ts` | Datenbank-Utilities |
| `test/factories.ts` | Test-Daten-Factories |

### Playwright Setup

**Datei:** `apps/web/playwright.config.ts`

| Einstellung | Wert |
|-------------|------|
| testDir | `./e2e` |
| baseURL | `http://localhost:3100` |
| browser | chromium |
| retries (CI) | 2 |
| workers (CI) | 1 |

**Web Server:**
```typescript
webServer: {
  command: isCI ? 'pnpm build && pnpm start -p 3100' : 'pnpm dev -p 3100',
  port: 3100,
  timeout: 120000,
}
```

## Bekannte Lücken

### Test-Coverage Gaps

| Bereich | Status | Beschreibung |
|---------|--------|--------------|
| API Error Handling | FEHLT | Keine Error-Response-Tests |
| Edge Cases | TEILWEISE | Nur Happy Path getestet |
| Performance Tests | FEHLT | Keine Last-/Performance-Tests |
| Security Tests | FEHLT | Keine Security-fokussierten Tests |

### Empfohlene Ergänzungen

| Priorität | Test | Beschreibung |
|-----------|------|--------------|
| P1 | API Error Cases | 400, 401, 403, 404, 500 Responses |
| P1 | Validation Tests | Input-Validierung testen |
| P2 | Auth Flow E2E | Login/Logout (Phase 2) |
| P2 | RBAC Tests | Berechtigungstests |
| P3 | Load Tests | k6 oder Artillery |

### Contract Testing

**Status:** NICHT IMPLEMENTIERT

**Empfehlung:**
- Pact oder ähnliches für API-Consumer-Contracts
- Prisma-Schema als DB-Contract

---

**Letzte Aktualisierung:** 2026-01-25
