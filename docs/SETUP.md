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
- **Docker** (required for local database)

### Editor

- VS Code with recommended extensions (see `.vscode/extensions.json` - TBD)

## Quickstart

```bash
# 1. Clone the repository
git clone <repository-url>
cd zollpilot

# 2. Use correct Node version
nvm use

# 3. Install dependencies
pnpm install

# 4. Run development server
pnpm dev

# 5. Open browser
# Navigate to http://localhost:3000
```

The application will be running at `http://localhost:3000`.

**Note:** Database setup and environment variables will be required starting in Phase 0.3.

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

Copy the example environment file:

```bash
cp .env.example .env
cp .env.example apps/web/.env
```

The defaults in `.env.example` are configured to work with the Docker-based Postgres setup.

## Database Setup

The project uses Postgres (via Docker) and Prisma.

1. **Start the database:**

   ```bash
   pnpm db:up
   ```

2. **Run migrations:**

   ```bash
   pnpm prisma:migrate
   ```

3. **Seed the database:**

   ```bash
   pnpm prisma:seed
   ```

4. **Verify connection (Optional):**
   ```bash
   # Runs a simple SELECT 1
   pnpm --filter @zollpilot/web ts-node --compiler-options '{"module":"CommonJS"}' scripts/db-check.ts
   ```

### Integration Tests (DB)

Integration tests require the Docker database to be running.

```bash
# 1. Start database
pnpm db:up

# 2. Run integration tests
pnpm test:integration
```

These tests run in isolation (one schema per test run) and clean up automatically.

### E2E Tests

End-to-End tests verify the running application.

```bash
# Run locally (uses dev server)
pnpm test:e2e

# Run in CI mode (builds and runs production server)
pnpm test:e2e:ci
```

**Note:** In Phase 0, E2E tests do not require a database connection as they only test static pages and health checks.

## Running the Application

### Development Mode

Start the Next.js development server with hot reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

Available routes:

- `/` - Home page (public portal)
- `/admin` - Admin area (placeholder, features coming in Phase 2)
- `/api/health` - Health check endpoint

### Production Build

Build and run in production mode:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Type Checking

Run TypeScript type checking without building:

```bash
pnpm typecheck
```

### Code Quality

We enforce strict quality gates.

```bash
# Check everything (lint, typecheck, format, tests)
pnpm lint
pnpm typecheck
pnpm format
pnpm test:coverage
```

### Formatting

Fix formatting issues automatically:

```bash
pnpm format:write
```

## Testing

The project uses **Vitest** for unit and integration tests.

### Running Tests

```bash
# Run all tests (CI mode)
pnpm test

# Run tests in watch mode
pnpm --filter @zollpilot/web test:watch

# Run unit tests
pnpm test:unit

# Run integration tests (TBD)
pnpm test:integration

# Run E2E tests (TBD - Playwright in later phases)
pnpm test:e2e
```

### Writing Tests

Following TDD (Test-Driven Development):

1. Write failing test first
2. Implement minimal code to pass
3. Refactor if needed
4. Commit

Tests are located next to the files they test:

- `src/app/page.tsx` → `src/app/page.test.tsx`
- `src/app/admin/page.tsx` → `src/app/admin/page.test.tsx`
- `src/app/api/health/route.ts` → `src/app/api/health/route.test.ts`

### Test Coverage

Minimum coverage requirements (enforced in CI later):

- Overall: 80%
- Critical paths: 100%

## Troubleshooting

TBD - Common issues and solutions
