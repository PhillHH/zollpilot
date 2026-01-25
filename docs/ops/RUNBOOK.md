# ZollPilot Operations Runbook

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Inhaltsverzeichnis

- [Lokales Setup](#lokales-setup)
- [Tägliche Operationen](#tägliche-operationen)
- [Datenbank-Operationen](#datenbank-operationen)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Healthchecks](#healthchecks)

## Lokales Setup

### Voraussetzungen

| Tool | Version | Prüfbefehl |
|------|---------|------------|
| Node.js | v20 LTS | `node --version` |
| pnpm | ≥9.0.0 | `pnpm --version` |
| Docker | Latest | `docker --version` |
| Docker Compose | Latest | `docker compose version` |
| Git | Latest | `git --version` |

### Erstinstallation

```bash
# 1. Repository klonen
git clone <repository-url>
cd zollpilot

# 2. Node-Version aktivieren (nvm)
nvm use

# 3. Dependencies installieren (inkl. Git Hooks)
pnpm install

# 4. Environment-Datei erstellen
cp .env.example .env

# 5. Datenbank starten
pnpm db:up

# 6. Auf Datenbank warten (ca. 10s)
sleep 10

# 7. Prisma Client generieren
pnpm prisma:generate

# 8. Migrationen ausführen
pnpm prisma:migrate

# 9. Seed-Daten einspielen
pnpm prisma:seed

# 10. Smoke-Test
pnpm db:smoke

# 11. Development Server starten
pnpm dev
```

**Erwartetes Ergebnis:** App läuft auf http://localhost:3000

### Täglicher Start

```bash
# Datenbank starten (falls nicht läuft)
pnpm db:up

# Development Server starten
pnpm dev
```

## Tägliche Operationen

### Development Server

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm dev` | Dev-Server starten (:3000) |
| `pnpm build` | Production-Build erstellen |
| `pnpm start` | Production-Server starten |

### Code-Qualität

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm lint` | ESLint ausführen |
| `pnpm format` | Formatting prüfen |
| `pnpm format:write` | Formatting anwenden |
| `pnpm typecheck` | TypeScript prüfen |

### Alle Quality Gates

```bash
pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm format
```

## Datenbank-Operationen

### Container-Management

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm db:up` | PostgreSQL starten |
| `pnpm db:down` | PostgreSQL stoppen (Daten bleiben) |
| `pnpm db:reset` | PostgreSQL + Volumes löschen (DESTRUCTIVE) |

### Prisma-Befehle

| Befehl | Beschreibung |
|--------|--------------|
| `pnpm prisma:generate` | Prisma Client generieren |
| `pnpm prisma:migrate` | Migration erstellen und anwenden (Dev) |
| `pnpm prisma:migrate:deploy` | Migrationen anwenden (Prod/CI) |
| `pnpm prisma:seed` | Seed-Daten einspielen |
| `pnpm prisma:studio` | Prisma Studio öffnen (:5555) |
| `pnpm db:smoke` | DB-Verbindung testen |

### Migration erstellen

```bash
# Schema ändern in apps/web/prisma/schema.prisma

# Migration erstellen
pnpm prisma:migrate
# Prompt: Migration-Name eingeben, z.B. "add-pricing-model"

# Client regenerieren (automatisch bei migrate)
pnpm prisma:generate
```

### Datenbank zurücksetzen

```bash
# WARNUNG: Löscht alle Daten!
pnpm db:reset

# Neu aufsetzen
pnpm db:up
sleep 10
pnpm prisma:migrate
pnpm prisma:seed
```

### Prisma Studio (GUI)

```bash
pnpm prisma:studio
# Öffnet http://localhost:5555
```

## Testing

### Test-Befehle

| Befehl | Beschreibung | Voraussetzung |
|--------|--------------|---------------|
| `pnpm test` | Unit + Integration Tests | DB muss laufen |
| `pnpm test:unit` | Nur Unit Tests | Keine |
| `pnpm test:integration` | Nur Integration Tests | DB muss laufen |
| `pnpm test:coverage` | Unit Tests + Coverage | Keine |
| `pnpm test:e2e` | E2E Tests (Dev-Mode) | Keine |
| `pnpm test:e2e:ci` | E2E Tests (Build-Mode) | Keine |
| `pnpm test:e2e:ui` | E2E Interactive Mode | Keine |

### E2E-Tests erstmalig

```bash
# Playwright-Browser installieren
npx playwright install chromium
```

### Coverage-Report anzeigen

```bash
pnpm test:coverage
# Report öffnen
open apps/web/coverage/index.html
```

## CI/CD

### CI-Jobs lokal reproduzieren

**Quality Gates:**
```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test:coverage
```

**Integration Tests:**
```bash
pnpm db:up
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm test:integration
```

**E2E Tests:**
```bash
pnpm test:e2e:ci
```

### Git Hooks

| Hook | Aktionen |
|------|----------|
| pre-commit | lint-staged (ESLint, Prettier) |
| commit-msg | commitlint (Conventional Commits) |
| pre-push | Unit Tests |

**Hook umgehen (Notfall):**
```bash
git commit --no-verify -m "emergency fix"
git push --no-verify
```

## Troubleshooting

### Port 5432 belegt

```bash
# Prozess finden
lsof -i :5432

# Docker-Container prüfen
docker ps | grep postgres

# Alle Docker-Container stoppen
docker stop $(docker ps -q)
```

### Port 3000 belegt

```bash
# Prozess finden
lsof -i :3000

# Prozess beenden
kill -9 <PID>
```

### Prisma Client nicht gefunden

```bash
# Client regenerieren
pnpm prisma:generate

# Wenn immer noch Fehler: node_modules löschen
rm -rf node_modules apps/web/node_modules
pnpm install
pnpm prisma:generate
```

### Migrationen fehlgeschlagen

```bash
# Status prüfen
npx prisma migrate status

# Bei Drift: DB zurücksetzen (Dev only!)
pnpm db:reset
pnpm db:up
sleep 10
pnpm prisma:migrate

# Alternativ: Force-Reset der Migration
npx prisma migrate reset --force
```

### Docker-Probleme

```bash
# Docker-Status prüfen
docker info

# Container-Logs anzeigen
docker logs zollpilot-postgres-dev

# Alle Container und Volumes bereinigen
docker compose -f docker-compose.dev.yml down -v
docker system prune -f
```

### Git Hooks funktionieren nicht

```bash
# Hooks neu installieren
pnpm install
# oder
npx husky install
```

### E2E-Tests schlagen fehl

```bash
# Browser neu installieren
npx playwright install chromium

# Mit Debug-Output
DEBUG=pw:api pnpm test:e2e

# UI-Mode für Debugging
pnpm test:e2e:ui
```

## Healthchecks

### Application Health

```bash
# Dev-Server muss laufen
curl http://localhost:3000/api/health
# Erwartung: {"status":"ok"}
```

### Database Health

```bash
# Smoke-Test
pnpm db:smoke
# Erwartung: "All smoke tests passed!"
```

### Docker Health

```bash
# Container-Status
docker compose -f docker-compose.dev.yml ps

# PostgreSQL-spezifisch
docker exec zollpilot-postgres-dev pg_isready -U zollpilot -d zollpilot_dev
```

### Vollständiger Health-Check

```bash
#!/bin/bash
echo "=== ZollPilot Health Check ==="

echo -n "Docker: "
docker info > /dev/null 2>&1 && echo "OK" || echo "FAIL"

echo -n "PostgreSQL Container: "
docker ps | grep -q zollpilot-postgres-dev && echo "OK" || echo "NOT RUNNING"

echo -n "DB Connection: "
pnpm db:smoke > /dev/null 2>&1 && echo "OK" || echo "FAIL"

echo -n "Dev Server: "
curl -s http://localhost:3000/api/health | grep -q "ok" && echo "OK" || echo "NOT RUNNING"

echo "=== Done ==="
```

---

## Notfall-Kontakte

**Status:** TBD - Wird in späteren Phasen ergänzt

---

**Letzte Aktualisierung:** 2026-01-25
