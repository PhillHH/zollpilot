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

## Application Structure

```
apps/
  web/          - Next.js application (public + admin)
packages/
  shared/       - Shared types and utilities
  config/       - Shared configuration
```

## Data Model

The application uses **Postgres** with **Prisma ORM**.

### Core Models

- **Tenant:** Represents a customer or organization.
- **User:** A user belonging to a specific tenant.
- **AuditEvent:** Immutable record of actions for compliance and security.

### Why Prisma?

- Type-safe database queries.
- Automated migrations.
- Simple developer workflow.

## Security Architecture

TBD - See SECURITY.md for current policies

## Deployment Architecture

TBD - Containerized deployment planned

## API Design

TBD - REST/GraphQL decision pending

## Audit & Logging

**Requirement:** Every admin action must generate an immutable audit event.

TBD - Implementation details in later phases
