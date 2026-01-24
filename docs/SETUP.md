# Development Setup

**Status:** Partial - Will be completed as features are implemented

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- **Node.js:** v20 LTS or higher
- **pnpm:** v9.0.0 or higher
- **Git:** Latest stable version

### Recommended
- **nvm** or **fnm** for Node version management
- **Docker** (for local database, planned)

### Editor
- VS Code with recommended extensions (see `.vscode/extensions.json` - TBD)

## Quickstart

```bash
# 1. Clone the repository
git clone <repository-url>
cd zollpilot

# 2. Use correct Node version
nvm use

# 3. Install dependencies (Phase 0.2+)
pnpm install

# 4. Setup environment variables (TBD)
cp .env.example .env.local

# 5. Setup database (TBD)
# pnpm db:setup

# 6. Run development server (TBD in Phase 0.2)
# pnpm dev
```

## Project Structure

```
zollpilot/
├── apps/
│   └── web/              - Next.js application
├── packages/
│   ├── shared/           - Shared utilities and types
│   └── config/           - Shared configuration
├── docs/                 - Documentation
├── scripts/              - Build and utility scripts
└── .github/workflows/    - CI/CD pipelines
```

## Environment Variables

TBD - Template will be provided with `.env.example`

## Database Setup

TBD - Prisma migrations and seeding

## Running the Application

TBD - Available in Phase 0.2

### Development Mode
```bash
# TBD
pnpm dev
```

### Production Build
```bash
# TBD
pnpm build
pnpm start
```

## Testing

TBD - Testing setup in later phases

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# All tests
pnpm test
```

## Troubleshooting

TBD - Common issues and solutions
