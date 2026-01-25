# ZollPilot Datenmodell

**Stand:** 2026-01-25 | **Phase:** 0.9.2

## Inhaltsverzeichnis

- [Übersicht](#übersicht)
- [Entity-Relationship-Diagramm](#entity-relationship-diagramm)
- [Datenbank-Konfiguration](#datenbank-konfiguration)
- [Modelle](#modelle)
- [Enums](#enums)
- [Indexing-Strategie](#indexing-strategie)
- [Migrations](#migrations)
- [Seed-Daten](#seed-daten)

## Übersicht

| Eigenschaft | Wert |
|-------------|------|
| **Datenbank** | PostgreSQL 16 |
| **ORM** | Prisma 6.1.0 |
| **Schema-Datei** | `apps/web/prisma/schema.prisma` |
| **Migration-Tool** | Prisma Migrate |

### Modell-Inventar

| Modell | Tabelle | Beschreibung | Status |
|--------|---------|--------------|--------|
| `Tenant` | `tenants` | Multi-Tenancy Container | Aktiv |
| `User` | `users` | Benutzerkonten mit RBAC | Aktiv |
| `AuditEvent` | `audit_events` | Immutable Audit Trail | Aktiv |

**Gesamt:** 3 Modelle, 1 Enum

## Entity-Relationship-Diagramm

```mermaid
erDiagram
    TENANT ||--o{ USER : "has many"
    TENANT ||--o{ AUDIT_EVENT : "has many"
    USER ||--o{ AUDIT_EVENT : "actor in"

    TENANT {
        uuid id PK
        string name
        datetime createdAt
        datetime updatedAt
    }

    USER {
        uuid id PK
        uuid tenantId FK
        string email
        enum role
        datetime createdAt
        datetime updatedAt
    }

    AUDIT_EVENT {
        uuid id PK
        uuid tenantId FK
        uuid actorUserId FK "nullable"
        string action
        string entityType "nullable"
        string entityId "nullable"
        string requestId
        string ipAddress "nullable"
        string userAgent "nullable"
        json metadata "nullable"
        datetime createdAt
    }
```

## Datenbank-Konfiguration

### Connection String

**Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Development (.env):**
```
DATABASE_URL="postgresql://zollpilot:zollpilot_dev_pass@localhost:5432/zollpilot_dev?schema=public"
```

**CI (GitHub Actions):**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zollpilot_test?schema=public"
```

**Integration Tests:**
```
DATABASE_URL="postgresql://...?schema=test_<timestamp>_<random>"
```

### Docker Compose (Development)

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: zollpilot-postgres-dev
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: zollpilot
      POSTGRES_PASSWORD: zollpilot_dev_pass
      POSTGRES_DB: zollpilot_dev
    volumes:
      - zollpilot-postgres-data:/var/lib/postgresql/data
```

## Modelle

### Tenant

Multi-Tenancy Container für Datenisolierung.

**Tabelle:** `tenants`

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PK, DEFAULT uuid() | Eindeutige Tenant-ID |
| `name` | VARCHAR | NOT NULL | Tenant-Name |
| `createdAt` | TIMESTAMP | DEFAULT now() | Erstellungszeitpunkt |
| `updatedAt` | TIMESTAMP | @updatedAt | Letzte Änderung |

**Prisma Schema:**
```prisma
model Tenant {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users       User[]
  auditEvents AuditEvent[]

  @@map("tenants")
}
```

**Beziehungen:**
- 1:N → User
- 1:N → AuditEvent

---

### User

Benutzerkonten mit rollenbasierter Zugriffskontrolle.

**Tabelle:** `users`

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PK | Eindeutige User-ID |
| `tenantId` | UUID | FK → tenants.id, ON DELETE CASCADE | Zugehöriger Tenant |
| `email` | VARCHAR | NOT NULL | E-Mail-Adresse |
| `role` | ENUM | DEFAULT 'USER' | Benutzerrolle |
| `createdAt` | TIMESTAMP | DEFAULT now() | Erstellungszeitpunkt |
| `updatedAt` | TIMESTAMP | @updatedAt | Letzte Änderung |

**Unique Constraints:**
- `(tenantId, email)` - E-Mail muss pro Tenant eindeutig sein

**Indexes:**
- `idx_users_tenantId` → `tenantId`

**Prisma Schema:**
```prisma
model User {
  id        String   @id @default(uuid()) @db.Uuid
  tenantId  String   @db.Uuid
  email     String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tenant      Tenant       @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  auditEvents AuditEvent[]

  @@unique([tenantId, email])
  @@index([tenantId])
  @@map("users")
}
```

**Beziehungen:**
- N:1 → Tenant
- 1:N → AuditEvent (als Actor)

---

### AuditEvent

Immutable Audit Trail für alle Admin-Aktionen.

**Tabelle:** `audit_events`

| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | UUID | PK | Eindeutige Event-ID |
| `tenantId` | UUID | FK → tenants.id, ON DELETE CASCADE | Zugehöriger Tenant |
| `actorUserId` | UUID | FK → users.id, ON DELETE SET NULL, NULLABLE | Ausführender User |
| `action` | VARCHAR | NOT NULL | Aktionstyp (z.B. PRICING_UPDATE) |
| `entityType` | VARCHAR | NULLABLE | Betroffener Entitätstyp |
| `entityId` | VARCHAR | NULLABLE | ID der betroffenen Entität |
| `requestId` | VARCHAR | NOT NULL | Distributed Tracing ID |
| `ipAddress` | VARCHAR | NULLABLE | Client-IP |
| `userAgent` | VARCHAR | NULLABLE | Client User-Agent |
| `metadata` | JSONB | NULLABLE | Zusätzliche Kontextdaten |
| `createdAt` | TIMESTAMP | DEFAULT now() | Erstellungszeitpunkt |

**Indexes:**
- `idx_audit_tenantId_createdAt` → `(tenantId, createdAt)`
- `idx_audit_requestId` → `requestId`
- `idx_audit_tenantId_action_createdAt` → `(tenantId, action, createdAt)`
- `idx_audit_actorUserId` → `actorUserId`

**Prisma Schema:**
```prisma
model AuditEvent {
  id           String   @id @default(uuid()) @db.Uuid
  tenantId     String   @db.Uuid
  actorUserId  String?  @db.Uuid
  action       String
  entityType   String?
  entityId     String?
  requestId    String
  ipAddress    String?
  userAgent    String?
  metadata     Json?
  createdAt    DateTime @default(now())

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  actor  User?  @relation(fields: [actorUserId], references: [id], onDelete: SetNull)

  @@index([tenantId, createdAt])
  @@index([requestId])
  @@index([tenantId, action, createdAt])
  @@index([actorUserId])
  @@map("audit_events")
}
```

**Beziehungen:**
- N:1 → Tenant
- N:1 → User (optional)

**Immutability:**
- **Policy:** Keine UPDATE/DELETE-Operationen erlaubt
- **GAP:** Kein Database-Level Constraint implementiert

---

## Enums

### UserRole

```prisma
enum UserRole {
  ADMIN          // Vollständiger Systemzugriff
  SUPPORT_ADMIN  // Benutzersupport, Read-only Logs
  CONFIG_ADMIN   // Preis- und Konfigurationsverwaltung
  VIEWER         // Nur-Lese-Zugriff
  USER           // Standard-Benutzerzugriff (Default)
}
```

| Wert | Beschreibung | Berechtigungen (geplant) |
|------|--------------|--------------------------|
| `ADMIN` | Super-Admin | Alle Operationen |
| `SUPPORT_ADMIN` | Support-Team | User-Support, Logs lesen |
| `CONFIG_ADMIN` | Konfiguration | Preise, Settings ändern |
| `VIEWER` | Read-Only | Nur Lesezugriff |
| `USER` | Standarduser | Basisfunktionen |

---

## Indexing-Strategie

### Performance-Optimierungen

| Index | Modell | Spalten | Zweck |
|-------|--------|---------|-------|
| PK | Alle | `id` | Primary Key Lookup |
| `users_tenantId_email_key` | User | `(tenantId, email)` | Unique Constraint + Lookup |
| `idx_users_tenantId` | User | `tenantId` | Tenant-Filter |
| `idx_audit_tenantId_createdAt` | AuditEvent | `(tenantId, createdAt)` | Timeline-Queries |
| `idx_audit_requestId` | AuditEvent | `requestId` | Tracing-Lookup |
| `idx_audit_tenantId_action_createdAt` | AuditEvent | `(tenantId, action, createdAt)` | Action-Filter |
| `idx_audit_actorUserId` | AuditEvent | `actorUserId` | User-Activity |

### Query-Patterns

**Häufige Queries (optimiert):**
1. User nach E-Mail im Tenant: `WHERE tenantId = ? AND email = ?`
2. Audit-Events nach Zeit: `WHERE tenantId = ? ORDER BY createdAt DESC`
3. Audit-Events nach Aktion: `WHERE tenantId = ? AND action = ?`
4. Request-Tracing: `WHERE requestId = ?`

---

## Migrations

### Aktueller Status

| Aspekt | Status |
|--------|--------|
| Migrationen im Repo | **KEINE** |
| Schema definiert | Ja |
| Migrationen generiert | Muss manuell erfolgen |

**GAP:** Es existieren keine Migration-Dateien im Repository. `prisma migrate dev` muss initial ausgeführt werden.

### Migration-Workflow

**Neue Migration erstellen:**
```bash
pnpm prisma:migrate
# Prompt für Migration-Name: z.B. "init" oder "add-user-table"
```

**Migration in CI/Production anwenden:**
```bash
pnpm prisma:migrate:deploy
```

**Prisma Client regenerieren:**
```bash
pnpm prisma:generate
```

### Migration-Verzeichnis (erwartet)

```
apps/web/prisma/migrations/
├── 20260101000000_init/
│   └── migration.sql
├── migration_lock.toml
```

---

## Seed-Daten

### Seed-Script

**Datei:** `apps/web/prisma/seed.ts`

**Ausführung:**
```bash
pnpm prisma:seed
```

### Default Seed-Daten

| Modell | Daten |
|--------|-------|
| Tenant | ID: `00000000-0000-0000-0000-000000000001`, Name: "ZollPilot Demo" |
| User | Email: `admin@local.test`, Role: `ADMIN` |
| AuditEvent | Action: `SYSTEM_SEED`, Metadata: Initial Seed Info |

### Seed-Logik

```typescript
// Upsert Tenant (idempotent)
const tenant = await prisma.tenant.upsert({
  where: { id: '00000000-0000-0000-0000-000000000001' },
  create: { id: '...', name: 'ZollPilot Demo' },
  update: {},
})

// Upsert Admin User (unique by tenantId + email)
const adminUser = await prisma.user.upsert({
  where: { tenantId_email: { tenantId: tenant.id, email: 'admin@local.test' } },
  create: { tenantId: tenant.id, email: 'admin@local.test', role: 'ADMIN' },
  update: {},
})

// Create Audit Event (always new)
await prisma.auditEvent.create({
  data: { tenantId: tenant.id, actorUserId: adminUser.id, action: 'SYSTEM_SEED', ... }
})
```

---

## Test-Datenbank

### Schema-per-Run Isolation

Integration-Tests verwenden isolierte Schemas:

```
Schema-Name: test_<timestamp>_<random>
Beispiel: test_1706180400000_abc12
```

**Lifecycle:**
1. Global Setup: Schema erstellen, Migrations anwenden
2. Tests: In isoliertem Schema ausführen
3. Global Teardown: Schema löschen

### Test-Utilities

**Datei:** `apps/web/test/db-utils.ts`

```typescript
// Alle Tabellen leeren (zwischen Tests)
export async function truncateAll(prisma: PrismaClient) {
  await prisma.$executeRaw`TRUNCATE TABLE audit_events, users, tenants CASCADE`
}
```

**Datei:** `apps/web/test/factories.ts`

```typescript
// Test-Daten-Factories
export async function createTenant(prisma, overrides = {})
export async function createUser(prisma, overrides = {})
export async function createAuditEvent(prisma, overrides = {})
```

---

**Letzte Aktualisierung:** 2026-01-25
