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

## Application Structure

```
apps/
  web/          - Next.js application (public + admin)
packages/
  shared/       - Shared types and utilities
  config/       - Shared configuration
```

## Data Model

TBD - Prisma schema will be defined in later phases

## Security Architecture

TBD - See SECURITY.md for current policies

## Deployment Architecture

TBD - Containerized deployment planned

## API Design

TBD - REST/GraphQL decision pending

## Audit & Logging

**Requirement:** Every admin action must generate an immutable audit event.

TBD - Implementation details in later phases
