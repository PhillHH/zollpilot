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

### Coverage Requirements

- **Minimum:** 80% overall coverage
- **Critical paths:** 100% coverage
- **Public APIs:** 100% coverage

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
