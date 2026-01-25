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

# 3. Install dependencies (also installs git hooks automatically)
pnpm install

# 4. Setup environment variables
cp .env.example .env

# 5. Start the database
pnpm db:up

# 6. Push database schema (Phase 1.2 Strategy)
pnpm db:push

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

**Git Hooks (Phase 0.7+):** Git hooks are automatically installed during `pnpm install`. These hooks:
- Format and lint code on commit (pre-commit)
- Validate commit messages (commit-msg)
- Run unit tests before push (pre-push)

See [CONTRIBUTING.md](./CONTRIBUTING.md#local-hooks-phase-07) for details on bypassing hooks in emergencies.

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

# Auth.js Configuration (Phase 2.1)
AUTH_SECRET="your_generated_secret"
AUTH_URL="http://localhost:3000"
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

#### Run Migrations (Planned Phase 2+)

*Currently using `db:push` for rapid prototyping.*

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

# Regenerate the client
pnpm prisma:generate
```

## Running with Docker (Full Stack)

To run the entire application (Database + Next.js + Migrations) in Docker, use the production `docker-compose.yml`. This simulates a production environment locally.

### Start Full Stack

```bash
docker compose up --build
```

### Windows / WSL2 Notes

If you are running on Windows:
1. Ensure **Docker Desktop** is running.
2. Use **WSL 2** backend.
3. If you encounter file permission issues or "module not found" errors inside the container, it's likely due to mixing Windows and Linux filesystems.
   - We use **anonymous volumes** in `docker-compose.yml` to prevent local `node_modules` (Windows binaries) from mounting into the Linux container.
   - If you add new packages, you may need to rebuild the container: `docker compose up --build`.

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

### Creating a User (Local Development)
1. Navigate to `http://localhost:3000/signup`.
2. Register a new account. A Tenant will be automatically created.
3. You will be redirected to the declarations dashboard.

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

ZollPilot has three distinct test layers:

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

3. **E2E Tests** - End-to-end tests using Playwright (Phase 0.6+)
   - Files: `*.e2e.spec.{ts,tsx}`
   - Environment: Chromium browser
   - No database required in Phase 0
   - Located in `apps/web/e2e/` directory

### Running Tests

```bash
# Run all tests (unit + integration)
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run E2E tests (local dev mode - fast)
pnpm test:e2e

# Run E2E tests (CI mode - build + start, stable)
pnpm test:e2e:ci

# Run E2E tests with UI mode (interactive)
pnpm test:e2e:ui

# View E2E test report
pnpm test:e2e:report

# Run tests in watch mode (unit tests)
pnpm --filter @zollpilot/web test:watch
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

### Writing E2E Tests

E2E (End-to-End) tests use Playwright to test the application from a user's perspective in a real browser.

#### E2E Test Structure

E2E tests are located in `apps/web/e2e/` directory with `.e2e.spec.ts` extension:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')

    // Use role-based selectors for resilience
    const heading = page.getByRole('heading', { name: /zollpilot/i })
    await expect(heading).toBeVisible()
  })
})
```

#### E2E Test Modes

**Local Mode (fast):**
- Uses `next dev` server
- Fast hot reload
- Best for development

```bash
pnpm test:e2e
```

**CI Mode (stable):**
- Uses `next build` + `next start`
- Production-like environment
- More reliable, but slower
- Required for CI/CD

```bash
pnpm test:e2e:ci
```

#### E2E Test Best Practices

**Use resilient selectors:**
```typescript
// Good - role-based queries
page.getByRole('heading', { name: /zollpilot/i })
page.getByRole('link', { name: /admin/i })

// Good - text content
page.getByText(/structured customs data/i)

// Avoid - fragile CSS selectors
page.locator('.css-class-12345')
```

**Test API endpoints directly:**
```typescript
test('should check API health', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toHaveProperty('status', 'ok')
})
```

#### E2E Test Coverage (Phase 0.6)

Current E2E tests cover:
- **Home Page** - Content visibility and navigation
- **Admin Page** - Placeholder content and back navigation
- **Health Check API** - Endpoint availability and response format

**Note:** E2E tests in Phase 0 do NOT require database setup.

#### Playwright UI Mode

For interactive test development:

```bash
pnpm test:e2e:ui
```

This opens Playwright UI where you can:
- Run tests interactively
- See browser actions in real-time
- Time-travel through test steps
- Inspect selectors

#### Prerequisites

**First-time setup:**
```bash
# Install Playwright browsers
npx playwright install chromium
```

**Browser Installation:**
Playwright requires Chromium browser to be installed. This is done automatically in CI but must be run manually on first local setup.

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

## Observability Verification (Phase 0.12)

ZollPilot implements observability through request IDs, structured logging, and audit trails.

### Verify Request ID Propagation

Check that the `x-request-id` header is present on all responses:

```bash
# Test health endpoint
curl -i http://localhost:3000/api/health

# Expected response header:
# x-request-id: 550e8400-e29b-41d4-a716-446655440000
```

**What to verify:**
- Response includes `x-request-id` header
- Value is a UUID v4 (format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`)
- Same request ID returned if you provide one:
  ```bash
  curl -H "x-request-id: my-custom-id" http://localhost:3000/api/health
  # Should return: x-request-id: my-custom-id
  ```

### View Structured Logs

All server-side logs are emitted to stdout in JSON format.

**Start development server:**
```bash
pnpm dev
```

**Make a request to trigger logs:**
```bash
curl http://localhost:3000/api/health
```

**Expected log output:**
```json
{"ts":"2026-01-24T15:30:45.123Z","level":"info","msg":"health_check","scope":"api.health","requestId":"550e8400-e29b-41d4-a716-446655440000"}
```

**Log schema:**
- `ts` - ISO 8601 timestamp in UTC
- `level` - Log level (info, warn, error, debug)
- `msg` - Event message (snake_case)
- `scope` - Scope identifier (dot-separated)
- `requestId` - Request correlation ID (optional)
- `meta` - Additional metadata (optional)
- `error` - Error details (optional)

### Query Audit Events

Audit events are stored in the database and can be viewed using Prisma Studio.

**Open Prisma Studio:**
```bash
pnpm prisma:studio
```

**Navigate to:** `AuditEvent` model

**Verify:**
- Audit events exist (created during `pnpm prisma:seed`)
- All events have `tenantId`, `action`, `requestId`, and `createdAt`
- Events are immutable (no update/delete operations)

**Query via SQL:**
```sql
-- View recent audit events
SELECT id, "tenantId", action, "requestId", "createdAt"
FROM audit_events
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Test Observability Stack

Run integration tests for audit logging:

```bash
pnpm test apps/web/src/server/audit.integration.test.ts
```

Run E2E tests for request ID propagation:

```bash
pnpm test:e2e apps/web/e2e/health.e2e.spec.ts
```

**What is tested:**
- Request ID middleware generates valid UUIDs
- Health endpoint returns `x-request-id` header
- Audit helper validates required fields
- Audit events are stored in database
- Metadata size limits are enforced

### Troubleshooting Observability

**Request ID not appearing:**
- Check middleware is running: `apps/web/middleware.ts` should be present
- Verify route matches middleware config (excludes `_next/static`, etc.)
- Check Next.js dev server logs for errors

**Logs not appearing:**
- Ensure you're using `logger.info/warn/error` from `@/server/logger`
- Check `NODE_ENV` is set (defaults to 'development')
- Verify stdout is not redirected or filtered

**Audit events not saving:**
- Check database connection: `pnpm db:smoke`
- Verify migrations are applied: `pnpm prisma:migrate`
- Check for validation errors in server logs
- Ensure `tenantId`, `action`, and `requestId` are provided

**See also:**
- [OBSERVABILITY.md](./OBSERVABILITY.md) - Full observability documentation
- [POLICIES.md](./POLICIES.md) - Observability requirements and policies

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

## CI Parity (Phase 0.8+)

The GitHub Actions CI pipeline runs the same quality gates on every pull request. Run these commands locally to ensure your PR will pass CI.

### CI Jobs and Local Equivalents

**Quality Gates Job:**
```bash
# Exactly what CI runs
pnpm format        # Check formatting (no --write)
pnpm lint          # ESLint
pnpm typecheck     # TypeScript strict mode
pnpm test:coverage # Unit tests with ≥80% coverage
```

**Integration Tests Job:**
```bash
# Prerequisites: PostgreSQL running
pnpm db:up                   # Start PostgreSQL
pnpm prisma:generate         # Generate Prisma client
pnpm prisma:migrate:deploy   # Apply migrations (CI-safe)
pnpm test:integration        # Run integration tests
```

**E2E Tests Job:**
```bash
# Prerequisites: Chromium installed
npx playwright install chromium  # First time only
pnpm test:e2e:ci                 # E2E in CI mode (build + start)
```

### Run All CI Checks Locally

To ensure your PR will pass CI, run all checks in sequence:

```bash
# Quality gates
pnpm format && pnpm lint && pnpm typecheck && pnpm test:coverage

# Integration tests (requires PostgreSQL)
pnpm db:up && pnpm test:integration

# E2E tests (requires Chromium)
pnpm test:e2e:ci
```

**Note:** Git hooks (Phase 0.7+) automatically run a subset of these checks on commit and push, but CI runs the full suite.

### CI Status

Check CI status on your PR:
1. Open your pull request on GitHub
2. Scroll to the bottom to see status checks
3. All three jobs must pass: `quality`, `integration`, `e2e`

**Failed checks:**
- Click "Details" to view logs
- Download artifacts (coverage reports, Playwright reports) if available
- See [CONTRIBUTING.md CI Pipeline section](./CONTRIBUTING.md#ci-pipeline-phase-08) for debugging tips

## Troubleshooting

### Startup Failures

**"Critical Error: Missing required environment variables"**
- The application (Next.js) enforces strict environment variable checks at startup.
- Ensure your `.env` file contains `DATABASE_URL`.
- Copy `.env.example` to `.env` if you haven't already.

**"Connection refused" (Database)**
- The database container might not be running or healthy.
- Run `pnpm db:smoke` to verify connectivity.
- Check docker logs: `docker logs zollpilot-postgres`.

### Test Failures

**E2E Tests failing (Timeout)**
- Ensure the database is running (`pnpm db:up`).
- Ensure dependencies are installed (`pnpm install`).
- If running locally, ensure `chromium` is installed (`npx playwright install chromium`).

**Integration Tests failing**
- These tests require a running DB instance separate from your dev data (schema isolation).
- Run `pnpm db:up` before running integration tests.
