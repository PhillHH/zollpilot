# Contributing Guidelines

## Core Principles

### 1. Test-Driven Development (TDD)

**MANDATORY:** Write tests BEFORE implementation.

```
Process:
1. Write failing test
2. Write minimal code to pass test
3. Refactor
4. Repeat
```

No implementation will be accepted without corresponding tests.

### 2. Nothing Undocumented

**MANDATORY:** Every feature must be documented.

- Public features → `USER_MANUAL.md`
- Admin features → `ADMIN_MANUAL.md`
- Technical decisions → `ARCHITECTURE.md`
- Setup changes → `SETUP.md`

**Doc-drift checks are enforced in CI** (implemented in Phase 0.10).

### 3. Code Quality

- TypeScript strict mode enabled
- No `any` types without explicit justification
- ESLint and Prettier enforced
- 100% type coverage for public APIs

## Development Workflow

### Branch Strategy

```
main              - Production-ready code
├── feature/*     - New features
├── fix/*         - Bug fixes
├── docs/*        - Documentation updates
└── chore/*       - Maintenance tasks
```

### Commit Conventions

Follow conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
test: add unit tests for user service
chore: update dependencies
```

**Enforced Locally:** Commit messages are validated automatically via git hooks (Phase 0.7+).

### Local Hooks (Phase 0.7+)

Git hooks are automatically installed on `pnpm install` and enforce quality standards before commits and pushes.

#### What Runs When

**On Commit (pre-commit):**
- `lint-staged` runs on staged files only
  - TypeScript files: ESLint --fix + Prettier --write
  - Markdown, JSON, YAML: Prettier --write
- **Fast** - only checks files you're committing

**On Commit Message (commit-msg):**
- `commitlint` validates conventional commit format
- Rejects invalid commit messages
- Ensures: `type(scope): subject` format

**On Push (pre-push):**
- Unit tests run (`pnpm test:unit`)
- **Fast** - integration/E2E tests NOT included
- Blocks push if tests fail

#### Running Manually

You can run the same checks manually:

```bash
# Lint staged files (same as pre-commit hook)
pnpm lint-staged

# Validate commit message (replace with your message)
echo "feat: add new feature" | npx commitlint

# Run unit tests (same as pre-push hook)
pnpm test:unit

# Run all quality gates
pnpm lint && pnpm typecheck && pnpm test:unit
```

#### Bypassing Hooks (Emergency Only)

**WARNING:** Only bypass hooks in emergencies. Your PR will fail in CI if quality gates don't pass.

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Skip pre-push hook
git push --no-verify
```

**Best Practice:** Fix the issues instead of bypassing. Use `--no-verify` only for:
- Emergency hotfixes that will be immediately fixed in a follow-up commit
- Reverting broken commits
- Work-in-progress commits in personal feature branches (discouraged)

#### Troubleshooting Hooks

**Hooks not running:**
```bash
# Reinstall hooks
pnpm install
# Or manually
npx husky install
```

**Commit message rejected:**
```bash
# Bad - will be rejected
git commit -m "fixed bug"
git commit -m "WIP"

# Good - will pass
git commit -m "fix: resolve authentication bug"
git commit -m "chore: update dependencies"
```

**lint-staged issues:**
```bash
# Run manually to see errors
pnpm lint-staged

# Fix formatting issues
pnpm format:write

# Fix linting issues
pnpm lint --fix
```

### Pull Request Process

1. Create feature branch from `main`
2. Write tests first (TDD)
3. Implement feature
4. Update documentation
5. Run all checks locally:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm docs:check
   ```
6. Create PR with descriptive title and description
7. Address review feedback
8. Merge after approval and passing CI

### Database Workflow (Phase 0.3+)

When working with database changes:

#### 1. Start the Database

```bash
pnpm db:up
```

#### 2. Make Schema Changes

Edit `apps/web/prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(uuid())
  // ... fields
}
```

#### 3. Create and Apply Migration

```bash
pnpm prisma:migrate
```

This will:
- Prompt for a migration name (use descriptive names: `add-new-model`)
- Generate a migration file in `prisma/migrations/`
- Apply the migration to your local database
- Regenerate Prisma client

#### 4. Update Seed Script (if needed)

If your changes require seed data updates, modify `prisma/seed.ts`.

#### 5. Test Database Changes

```bash
# Verify database connectivity
pnpm db:smoke

# Run your tests
pnpm test
```

#### 6. Include Migration in PR

Commit the generated migration files:
```bash
git add apps/web/prisma/migrations/
git add apps/web/prisma/schema.prisma
git commit -m "feat: add new model to database schema"
```

#### Common Database Commands

```bash
# Start database
pnpm db:up

# Stop database (keeps data)
pnpm db:down

# Reset database (DESTRUCTIVE - deletes all data)
pnpm db:reset

# Generate Prisma client
pnpm prisma:generate

# Create and apply migration
pnpm prisma:migrate

# Seed database
pnpm prisma:seed

# Open Prisma Studio GUI
pnpm prisma:studio

# Run smoke test
pnpm db:smoke
```

#### Database Testing Best Practices

- Always test migrations locally before committing
- Never modify existing migration files (create new ones)
- Update seed data to match schema changes
- Run `pnpm db:smoke` to verify changes

### PR Requirements (Gates)

All PRs must pass:
- ✅ All tests (unit, integration, E2E)
- ✅ Type checking
- ✅ Linting
- ✅ Code formatting
- ✅ Coverage thresholds (≥80%)
- ✅ Documentation drift check
- ✅ Code review (min. 1 approval)

## CI Pipeline (Phase 0.8+)

The CI pipeline runs automatically on pull requests and pushes to main/feature branches. It enforces all quality gates and must pass before merging.

### CI Jobs

The pipeline consists of three parallel jobs:

#### 1. Quality Gates Job

**What it does:**
- Checks code formatting with Prettier
- Runs ESLint for code quality
- Runs TypeScript type checking
- Runs unit tests with coverage enforcement (≥80%)

**Local equivalent:**
```bash
pnpm format        # Check formatting
pnpm lint          # Run ESLint
pnpm typecheck     # Type check
pnpm test:coverage # Unit tests with coverage
```

**Common failures:**
- **Format check fails:** Run `pnpm format:write` to auto-fix
- **Lint fails:** Run `pnpm lint --fix` or fix manually
- **Type errors:** Fix TypeScript errors in reported files
- **Coverage below 80%:** Add tests to increase coverage

#### 2. Integration Tests Job

**What it does:**
- Spins up PostgreSQL service container
- Generates Prisma client
- Runs database migrations
- Executes integration tests with schema-per-run isolation

**Local equivalent:**
```bash
pnpm db:up                   # Start PostgreSQL
pnpm prisma:generate         # Generate Prisma client
pnpm prisma:migrate:deploy   # Run migrations
pnpm test:integration        # Run integration tests
```

**Common failures:**
- **Migration fails:** Check migration files in `apps/web/prisma/migrations/`
- **Connection errors:** Verify DATABASE_URL is set correctly
- **Schema conflicts:** Ensure schema-per-run creates unique schemas
- **Test failures:** Check test logs for specific failures

#### 3. E2E Tests Job

**What it does:**
- Installs Playwright browsers (Chromium)
- Runs E2E tests in CI mode (next build + next start)
- Uploads test reports and traces on failure

**Local equivalent:**
```bash
npx playwright install chromium  # Install browser (first time only)
pnpm test:e2e:ci                 # Run E2E tests in CI mode
```

**Common failures:**
- **Browser not found:** Playwright cache issue, will reinstall on retry
- **Server timeout:** Build step taking too long, check Next.js build
- **Test failures:** Check Playwright report artifact for screenshots/traces
- **Selector errors:** UI changed, update selectors in E2E tests

### Debugging CI Failures

**View detailed logs:**
1. Click on the failing job in GitHub Actions
2. Expand the failed step to see full output
3. Check uploaded artifacts for reports (coverage, Playwright)

**Reproduce locally:**
Run the exact commands from the failed job (see "Local equivalent" above).

**Playwright failures:**
1. Download the `playwright-report` artifact from the failed run
2. Extract and open `index.html` to see interactive report
3. View screenshots, traces, and video recordings of failures

**Integration test failures:**
1. Check if migrations are up to date: `pnpm prisma:migrate:deploy`
2. Verify PostgreSQL is running: `pnpm db:up`
3. Check DATABASE_URL matches expected format
4. Run tests locally with same DATABASE_URL as CI

### CI Status Checks

All three jobs must pass before a PR can be merged:
- ✅ Quality Gates
- ✅ Integration Tests
- ✅ E2E Tests

**Branch Protection:**
Main branch requires:
- All status checks to pass
- At least 1 approving review
- Up-to-date with base branch

To configure branch protection in GitHub:
1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Check "Require status checks to pass before merging"
4. Select required checks: `quality`, `integration`, `e2e`
5. Check "Require branches to be up to date before merging"
6. Check "Require a pull request before merging"
7. Set "Require approvals" to 1

### Quality Gates (Phase 0.4+)

**ENFORCED:** These checks must pass before merging. Run them locally before creating a PR.

#### Run All Quality Gates

```bash
# Check all gates at once
pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm format
```

#### Individual Quality Gates

**1. Linting (ESLint)**

Checks code for style issues and potential bugs.

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors (when possible)
pnpm --filter @zollpilot/web lint --fix
```

**2. Type Checking (TypeScript)**

Validates TypeScript types in strict mode.

```bash
# Run type checking
pnpm typecheck
```

**3. Testing with Coverage**

Runs all tests and enforces ≥80% coverage on lines, functions, branches, and statements.

```bash
# Run tests without coverage (fast)
pnpm test

# Run tests with coverage (enforces thresholds)
pnpm test:coverage

# Watch mode for development
pnpm --filter @zollpilot/web test:watch
```

**Coverage Thresholds (ENFORCED):**
- Lines: ≥80%
- Functions: ≥80%
- Branches: ≥80%
- Statements: ≥80%

**Note:** `test:coverage` will FAIL if any threshold is not met. This is intentional.

**4. Code Formatting (Prettier)**

Ensures consistent code formatting across the codebase.

```bash
# Check formatting (CI-safe)
pnpm format

# Apply formatting (fix)
pnpm format:write
```

#### Pre-Commit Checklist

Before committing, ensure:
1. ✅ `pnpm lint` passes
2. ✅ `pnpm typecheck` passes
3. ✅ `pnpm test:coverage` passes (all tests + coverage ≥80%)
4. ✅ `pnpm format` passes

#### TDD Reminder

**MANDATORY:** Write tests BEFORE implementation.

1. Write failing test
2. Run `pnpm test:watch` (watch mode)
3. Implement minimal code to pass
4. Verify coverage with `pnpm test:coverage`
5. Refactor if needed
6. Commit

#### Nothing Undocumented Reminder

Every feature must be documented:
- Public features → `docs/USER_MANUAL.md`
- Admin features → `docs/ADMIN_MANUAL.md`
- Technical changes → `docs/SETUP.md` or `docs/ARCHITECTURE.md`
- Breaking changes → Update `CONTRIBUTING.md`

## Code Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for public APIs
- Use type inference where possible
- Document complex types

### File Organization

```typescript
// 1. Imports (external, then internal)
import { useState } from 'react'
import { Button } from '@/components'

// 2. Types and interfaces
interface Props { ... }

// 3. Constants
const MAX_RETRIES = 3

// 4. Implementation
export function Component() { ... }
```

### Naming Conventions

- **Files:** kebab-case (`user-service.ts`)
- **Components:** PascalCase (`UserProfile.tsx`)
- **Functions:** camelCase (`getUserData()`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Types/Interfaces:** PascalCase (`UserData`)

## Testing Standards

### Test Layers (Phase 0.5+)

ZollPilot has **three distinct test layers**:

#### 1. Unit Tests

**Purpose:** Fast, isolated tests for individual components and functions

**Characteristics:**
- File naming: `*.test.{ts,tsx}` (NOT `*.int.test.{ts,tsx}`)
- Environment: jsdom (browser-like for React components)
- No database required
- No external dependencies
- Mocked where necessary

**Example:**
```typescript
// src/app/page.test.tsx
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Home Page', () => {
  it('should render welcome message', () => {
    render(<Page />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })
})
```

**Run unit tests:**
```bash
pnpm test:unit
```

#### 2. Integration Tests

**Purpose:** Tests that verify database interactions and multi-module integration

**Characteristics:**
- File naming: `*.int.test.{ts,tsx}` (MUST include `.int.`)
- Environment: node
- Requires PostgreSQL database
- Uses real Prisma client
- Schema-per-run isolation (each test run uses unique schema)

**Example:**
```typescript
// src/server/db.int.test.ts
import { describe, it, expect, afterEach } from 'vitest'
import { prisma } from '@/server/db'
import { truncateAll } from '../../test/db-utils'
import { createTenant, createUser } from '../../test/factories'

describe('Database Integration', () => {
  afterEach(async () => {
    await truncateAll(prisma)
  })

  it('should create and query tenant', async () => {
    const tenant = await createTenant(prisma, {
      name: 'Test Tenant'
    })

    const found = await prisma.tenant.findUnique({
      where: { id: tenant.id }
    })

    expect(found).toEqual(tenant)
  })
})
```

**Prerequisites:**
```bash
# Start database
pnpm db:up

# Run integration tests
pnpm test:integration
```

**Schema-Per-Run Isolation:**
- Each test run creates a unique schema (e.g., `test_1234567890_abc12`)
- Tests never touch development data
- Global setup creates schema and runs migrations
- Global teardown drops schema
- Use `truncateAll()` in `afterEach` to clean between tests

**Test Utilities:**

```typescript
// Database cleanup
import { truncateAll } from '../../test/db-utils'
await truncateAll(prisma) // Clears all tables in test schema

// Data factories (auto-create dependencies)
import { createTenant, createUser, createAuditEvent } from '../../test/factories'

const tenant = await createTenant(prisma)
const admin = await createUser(prisma, {
  tenantId: tenant.id,
  email: 'admin@test.local',
  role: 'ADMIN'
})
```

**Run integration tests:**
```bash
pnpm test:integration
```

#### 3. E2E Tests (Phase 0.6+)

**Purpose:** End-to-end user flows tested in real browser with Playwright

**Characteristics:**
- File naming: `*.e2e.spec.{ts,tsx}` (MUST include `.e2e.`)
- Environment: Chromium browser (real browser automation)
- No database required in Phase 0
- Located in `apps/web/e2e/` directory
- Tests full user workflows and UI interactions

**Example:**
```typescript
// e2e/home.e2e.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should navigate to admin', async ({ page }) => {
    await page.goto('/')

    // Use role-based selectors for resilience
    const adminLink = page.getByRole('link', { name: /admin/i })
    await adminLink.click()

    await expect(page).toHaveURL('/admin')
    await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible()
  })
})
```

**Run E2E tests:**
```bash
# Local dev mode (fast)
pnpm test:e2e

# CI mode (build + start, stable)
pnpm test:e2e:ci

# Interactive UI mode
pnpm test:e2e:ui
```

**Prerequisites:**
```bash
# First-time setup: install browsers
npx playwright install chromium
```

### Test Structure

```typescript
describe('Feature', () => {
  describe('Scenario', () => {
    it('should do something specific', () => {
      // Arrange
      const input = ...

      // Act
      const result = ...

      // Assert
      expect(result).toBe(...)
    })
  })
})
```

### Choosing the Right Test Layer

**Use Unit Tests for:**
- React component rendering and props
- Pure functions and utilities
- Business logic without database
- Anything that can be tested in isolation

**Use Integration Tests for:**
- Database queries and mutations
- Prisma model interactions
- Multi-tenancy isolation
- Audit trail generation
- API routes that use database

**Use E2E Tests for:**
- Full user workflows (navigation, forms, multi-step processes)
- Browser-specific behavior (rendering, responsive design)
- Authentication flows (login, logout, session management)
- Cross-page interactions and navigation
- Critical user journeys (smoke tests)
- UI interactions that can't be tested with unit/integration tests

### Coverage Requirements

- **Minimum:** 80% overall coverage (unit tests)
- **Critical paths:** 100% coverage
- **Public APIs:** 100% coverage
- **Integration tests:** Must cover all database models and interactions

## Documentation Standards

### Code Comments

- Explain **why**, not **what**
- Document assumptions and edge cases
- Use JSDoc for public APIs

### Architecture Decision Records (ADR)

Significant technical decisions must be documented in `docs/adr/`.

Format:
```markdown
# ADR-001: Decision Title

## Status
Accepted / Rejected / Superseded

## Context
Background and problem

## Decision
What we decided

## Consequences
Impact and tradeoffs
```

## Audit & Logging Policy

**CRITICAL:** Every admin action must generate an audit event.

Requirements:
- Immutable audit logs
- Include: timestamp, user, action, resource, old/new values
- No PII in logs without encryption
- Retention policy: TBD

## Security Guidelines

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user input
- Sanitize all output
- Follow OWASP guidelines
- Security review required for auth/authz changes

## Getting Help

- Review existing documentation
- Check GitHub issues
- Ask in team chat
- Create issue for bugs or feature requests

## License

All contributions must comply with the project license (UNLICENSED).
