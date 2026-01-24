# ZollPilot Architecture

**Status:** TBD - Will be populated in Phase 0.9

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Application Structure](#application-structure)
- [Data Model](#data-model)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [API Design](#api-design)
- [Audit & Logging](#audit--logging)

## Overview

ZollPilot is a customs data management platform consisting of:
- Public portal (SEO-crawlable)
- Admin backend for pricing configuration, logging, and support

## System Architecture

TBD

## Technology Stack

### Core Stack (defined in Phase 0.1)
- **Package Manager:** pnpm 9.x
- **Node.js:** v20 LTS
- **Language:** TypeScript
- **Monorepo:** pnpm workspaces

### Application Stack (planned)
- **Frontend Framework:** Next.js (Phase 0.2)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **CI/CD:** GitHub Actions

### Frontend Stack (Phase 0.2+)
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Rendering:** Server-Side Rendering (SSR) by default
- **Testing:** Vitest + React Testing Library
- **Routing:** File-based routing (Next.js App Router)

#### Next.js Configuration
- **React Strict Mode:** Enabled
- **X-Powered-By Header:** Disabled for security
- **Path Aliases:** `@/*` maps to `src/*`

#### Directory Structure (apps/web)
```
apps/web/
├── src/
│   ├── app/                  - App Router pages & layouts
│   │   ├── layout.tsx        - Root layout with navigation
│   │   ├── page.tsx          - Home page (/)
│   │   ├── admin/            - Admin area
│   │   │   └── page.tsx      - Admin page (/admin)
│   │   └── api/              - API routes
│   │       └── health/       - Health check endpoint
│   │           └── route.ts
│   └── components/           - Shared components (TBD)
├── public/                   - Static assets
├── vitest.config.ts          - Vitest configuration
├── tsconfig.json             - TypeScript config (strict)
└── next.config.js            - Next.js configuration
```

### Database Stack (Phase 0.3+)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6.x
- **Migration Tool:** Prisma Migrate
- **Local Development:** Docker Compose

#### Database Configuration
- **Development:** PostgreSQL in Docker container
- **Connection Pooling:** Native Prisma connection pooling
- **Query Logging:** Enabled in development, errors only in production

#### Prisma Setup
```
apps/web/
├── prisma/
│   ├── schema.prisma         - Database schema definition
│   └── seed.ts               - Seed script for initial data
└── src/server/
    └── db.ts                 - Prisma client singleton
```

**Singleton Pattern:** The Prisma client uses a singleton pattern to prevent multiple instances during Next.js hot reloading in development.

## Application Structure

```
apps/
  web/          - Next.js application (public + admin)
packages/
  shared/       - Shared types and utilities
  config/       - Shared configuration
```

## Data Model

The database uses PostgreSQL with Prisma as the ORM. Schema is defined in `apps/web/prisma/schema.prisma`.

### Core Models (Phase 0.3)

#### Tenant
Multi-tenancy support for data isolation.

```prisma
model Tenant {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Purpose:** Isolate data between different organizations or environments.

#### User
User accounts with role-based access control.

```prisma
enum UserRole {
  ADMIN          // Full system access
  SUPPORT_ADMIN  // User support, read-only logs
  CONFIG_ADMIN   // Pricing and configuration
  VIEWER         // Read-only access
  USER           // Standard user access
}

model User {
  id        String   @id @default(uuid())
  tenantId  String
  email     String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([tenantId, email]) // Email unique per tenant
  @@index([tenantId])
}
```

**Key Features:**
- Email must be unique per tenant
- Role-based access control (RBAC)
- Indexed for efficient queries

#### AuditEvent
Immutable audit trail for compliance and security.

```prisma
model AuditEvent {
  id          String   @id @default(uuid())
  tenantId    String
  actorUserId String?
  action      String   // e.g., PRICING_UPDATE, USER_ROLE_CHANGE
  entityType  String?  // e.g., "User", "Pricing", "Config"
  entityId    String?
  requestId   String   // Distributed tracing
  ipAddress   String?
  userAgent   String?
  metadata    Json?    // Old/new values, additional context
  createdAt   DateTime @default(now())

  @@index([tenantId, createdAt])
  @@index([requestId])
  @@index([tenantId, action, createdAt])
  @@index([actorUserId])
}
```

**CRITICAL:** All admin actions must generate audit events. This is a hard requirement per POLICIES.md.

**Key Features:**
- Append-only (immutable)
- Distributed tracing via requestId
- Flexible metadata as JSON
- Efficient querying via indexes

### Database Relationships

```
Tenant (1) ──< (many) User
Tenant (1) ──< (many) AuditEvent
User (1) ──< (many) AuditEvent (as actor)
```

### Indexing Strategy

Indexes are optimized for common query patterns:
- **User lookup:** By tenant and email
- **Audit trail:** By tenant, time range, and action type
- **Distributed tracing:** By requestId

### Future Models (Planned)

- **PricingTier** - Pricing configuration
- **CustomsData** - Core customs information
- **SupportTicket** - Support management

## Security Architecture

TBD - See SECURITY.md for current policies

## Deployment Architecture

TBD - Containerized deployment planned

## API Design

TBD - REST/GraphQL decision pending

## Audit & Logging

**Requirement:** Every admin action must generate an immutable audit event.

TBD - Implementation details in later phases
