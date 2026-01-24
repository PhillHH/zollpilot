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
6. **Database Changes:**
   If you change the Prisma schema:
   ```bash
   pnpm prisma:migrate  # Generates migration file
   pnpm prisma:generate # Updates client
   pnpm prisma:seed     # Updates seed data
   ```
7. **Quality Gates:**
   Ensure all local checks pass:
   ```bash
   pnpm lint           # Check for linting errors
   pnpm typecheck      # Check for type errors
   pnpm format         # Check formatting
   pnpm test:coverage  # Run tests with coverage (>80%)
   ```
8. Create PR with descriptive title and description
9. Address review feedback
10. Merge after approval and passing CI

### PR Requirements (Gates)

All PRs must pass:

- ✅ All tests (unit, integration, E2E)
- ✅ Type checking
- ✅ Linting & Formatting
- ✅ Documentation drift check
- ✅ Code review (min. 1 approval)

## Quality Gates

We enforce high standards using automated tools.

### Commands

| Command              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| `pnpm lint`          | Runs ESLint to catch code errors          |
| `pnpm typecheck`     | Runs TypeScript compiler (strict mode)    |
| `pnpm format`        | Checks code formatting (Prettier)         |
| `pnpm format:write`  | Fixes code formatting (Prettier)          |
| `pnpm test` | Runs unit tests (no DB required) |
| `pnpm test:coverage` | Runs unit tests and enforces 80% coverage |
| `pnpm test:integration` | Runs integration tests (requires DB) |
| `pnpm test:e2e` | Runs E2E tests (Playwright) |

### Test Layers

- **Unit Tests (`*.test.ts`):** Fast, mocked dependencies, no DB. Use for logic verification.
- **Integration Tests (`*.int.test.ts`):** Real DB (via Docker), schema-per-run isolation. Use for data persistence.
- **E2E Tests (`e2e/*.spec.ts`):** Full browser tests via Playwright. Use for critical user flows and smoke tests.

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
