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
- **Docker** and **Docker Compose** for local database (Phase 0.3+)

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

# 4. Setup environment variables
cp .env.example .env

# 5. Start the database
pnpm db:up

# 6. Run database migrations
pnpm prisma:migrate

# 7. Seed the database
pnpm prisma:seed

# 8. Verify database connection
pnpm db:smoke

# 9. Run development server
pnpm dev

# 10. Open browser
# Navigate to http://localhost:3000
```

The application will be running at `http://localhost:3000`.

**First time setup:** Steps 4-8 set up your local database. After initial setup, you only need `pnpm db:up` and `pnpm dev`.

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

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

### Required Variables (Phase 0.3+)

```bash
# PostgreSQL Configuration
POSTGRES_USER=zollpilot
POSTGRES_PASSWORD=zollpilot_dev_pass
POSTGRES_DB=zollpilot_dev

# Prisma Database URL
DATABASE_URL="postgresql://zollpilot:zollpilot_dev_pass@localhost:5432/zollpilot_dev?schema=public"
```

**Security Note:** Never commit `.env` files to version control. The `.env` file is already in `.gitignore`.

### Optional Variables

See `.env.example` for additional configuration options that will be added in future phases.

## Database Setup

ZollPilot uses **PostgreSQL** as the database and **Prisma** as the ORM.

### Local Development Database

The project uses Docker Compose to run a PostgreSQL database locally.

#### Start the Database

```bash
pnpm db:up
```

This command:
- Starts a PostgreSQL 16 container
- Creates the database specified in your `.env` file
- Exposes port 5432 on localhost
- Persists data in a named Docker volume

#### Stop the Database

```bash
pnpm db:down
```

#### Reset the Database (DESTRUCTIVE)

```bash
# WARNING: This deletes all data and volumes
pnpm db:reset
```

### Prisma Workflow

#### Generate Prisma Client

After schema changes, regenerate the Prisma client:

```bash
pnpm prisma:generate
```

#### Run Migrations

Apply database migrations:

```bash
pnpm prisma:migrate
```

This command:
- Creates a new migration if schema changed
- Applies pending migrations
- Regenerates Prisma client

**Note:** In development, this is interactive. It will prompt for a migration name.

#### Seed the Database

Populate the database with initial data:

```bash
pnpm prisma:seed
```

Default seed data:
- 1 tenant: "ZollPilot Demo"
- 1 admin user: admin@local.test (role: ADMIN)
- 1 initial audit event

#### Open Prisma Studio

Explore and edit database data via GUI:

```bash
pnpm prisma:studio
```

Prisma Studio will open at `http://localhost:5555`.

### Database Schema

Current models (Phase 0.3):
- **Tenant** - Multi-tenancy support
- **User** - User accounts with role-based access
- **AuditEvent** - Immutable audit trail for all admin actions

See `apps/web/prisma/schema.prisma` for full schema.

### Verify Database Connection

Run the smoke test to verify database connectivity:

```bash
pnpm db:smoke
```

This tests:
- Basic database connectivity
- Prisma client functionality
- Table accessibility

### Troubleshooting Database Issues

**Port 5432 already in use:**
```bash
# Check what's using port 5432
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Stop the local PostgreSQL if running
# Or change the port in docker-compose.dev.yml
```

**Permission denied errors:**
```bash
# Ensure Docker daemon is running
docker info

# On Linux, add your user to docker group
sudo usermod -aG docker $USER
```

**Prisma client not found:**
```bash
# Regenerate the client
pnpm prisma:generate
```

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

### Linting

Check code for linting errors:

```bash
pnpm lint
```

## Testing

The project uses **Vitest** for unit and integration tests.

### Test Layers

ZollPilot has two distinct test layers:

1. **Unit Tests** - Fast, isolated tests for individual components and functions
   - Files: `*.test.{ts,tsx}` (NOT `*.int.test.{ts,tsx}`)
   - Environment: jsdom (browser-like)
   - No database required
   - Located next to source files

2. **Integration Tests** - Tests that use real database connections
   - Files: `*.int.test.{ts,tsx}`
   - Environment: node
   - Requires PostgreSQL
   - Located next to source files or in test directories

### Running Tests

```bash
# Run all tests (unit + integration)
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run tests in watch mode (unit tests)
pnpm --filter @zollpilot/web test:watch

# Run E2E tests (TBD - Playwright in later phases)
pnpm test:e2e
```

### Writing Unit Tests

Following TDD (Test-Driven Development):
1. Write failing test first
2. Implement minimal code to pass
3. Refactor if needed
4. Commit

Unit tests are located next to the files they test:
- `src/app/page.tsx` → `src/app/page.test.tsx`
- `src/app/admin/page.tsx` → `src/app/admin/page.test.tsx`
- `src/app/api/health/route.ts` → `src/app/api/health/route.test.ts`

### Writing Integration Tests

Integration tests use real PostgreSQL database with **schema-per-run isolation**.

#### Schema-Per-Run Isolation

Each test run creates a unique schema (e.g., `test_1234567890_abc12`) to ensure:
- Tests don't interfere with development data
- Tests are isolated from each other across runs
- Parallel test runs don't conflict
- Clean state for every test execution

**How it works:**
1. Global setup creates unique schema and runs migrations
2. Tests execute in that isolated schema
3. Global teardown drops the schema (cleanup)

#### Integration Test Structure

```typescript
import { describe, it, expect, afterEach } from 'vitest'
import { prisma } from '@/server/db'
import { truncateAll } from '../../test/db-utils'
import { createTenant, createUser } from '../../test/factories'

describe('Feature Integration Tests', () => {
  // Clean between tests within same run
  afterEach(async () => {
    await truncateAll(prisma)
  })

  it('should do something with database', async () => {
    const tenant = await createTenant(prisma)
    const user = await createUser(prisma, { tenantId: tenant.id })

    // Your assertions here
    expect(user.tenantId).toBe(tenant.id)
  })
})
```

#### Test Utilities

**Database Cleanup:**
```typescript
import { truncateAll } from '../../test/db-utils'
await truncateAll(prisma) // Clears all tables
```

**Data Factories:**
```typescript
import { createTenant, createUser, createAuditEvent } from '../../test/factories'

// Create with defaults
const tenant = await createTenant(prisma)

// Create with overrides
const admin = await createUser(prisma, {
  tenantId: tenant.id,
  email: 'admin@test.local',
  role: 'ADMIN'
})

// Factories auto-create dependencies if not provided
const user = await createUser(prisma) // Creates tenant automatically
```

#### Prerequisites for Integration Tests

Integration tests require a running PostgreSQL database:

```bash
# 1. Start database
pnpm db:up

# 2. Run migrations (dev database)
pnpm prisma:migrate

# 3. Run integration tests
pnpm test:integration
```

**Note:** Integration tests create their own schema and don't touch your dev data.

### Test Coverage

Coverage thresholds are ENFORCED (Phase 0.4+):
- Lines: ≥80%
- Functions: ≥80%
- Branches: ≥80%
- Statements: ≥80%

Run tests with coverage:
```bash
pnpm test:coverage
```

**Important:** The `test:coverage` command will FAIL if any threshold is not met.

## Code Quality

ZollPilot enforces strict quality gates to ensure code reliability and maintainability.

### Quality Gate Commands

Run these commands before committing:

```bash
# 1. Linting (ESLint)
pnpm lint

# 2. Type checking (TypeScript strict mode)
pnpm typecheck

# 3. Testing with coverage (≥80% required)
pnpm test:coverage

# 4. Code formatting (Prettier)
pnpm format

# Run all gates at once
pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm format
```

### Linting

Check and fix code style issues:

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors (when possible)
pnpm --filter @zollpilot/web lint --fix
```

### Type Checking

Validate TypeScript types:

```bash
# Run type checking
pnpm typecheck
```

All code must pass TypeScript strict mode checks.

### Code Formatting

Ensure consistent code formatting:

```bash
# Check formatting (CI-safe, does not modify files)
pnpm format

# Apply formatting (modifies files)
pnpm format:write
```

**Configuration:** See `.prettierrc` for formatting rules.

### Coverage Enforcement

Test coverage is enforced at ≥80% for all metrics:

```bash
# Run tests with coverage and threshold enforcement
pnpm test:coverage
```

If coverage drops below 80%, the command will fail. This is intentional and ensures code quality.

**View Coverage Report:**
After running `pnpm test:coverage`, open `apps/web/coverage/index.html` in a browser to see detailed coverage report.

### Pre-Commit Checklist

Before committing code:
- ✅ All tests pass (`pnpm test`)
- ✅ Coverage ≥80% (`pnpm test:coverage`)
- ✅ No linting errors (`pnpm lint`)
- ✅ No type errors (`pnpm typecheck`)
- ✅ Code is formatted (`pnpm format`)

## Troubleshooting

TBD - Common issues and solutions
