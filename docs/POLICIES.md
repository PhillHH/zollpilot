# ZollPilot Development Policies

**Enforcement:** These policies are enforced through CI gates (Phase 0.8+) and code review.

## 1. Test-Driven Development (TDD)

### Policy

All code must be written test-first.

### Requirements

- Write failing test before implementation
- No implementation without corresponding tests
- **ENFORCED:** Minimum 80% code coverage (blocked by CI/local scripts)
- Critical paths require 100% coverage

### Process

```
1. Write test (red)
2. Write minimal code to pass (green)
3. Refactor (refactor)
4. Commit
```

### Exceptions

None. TDD is mandatory.

## 2. Nothing Undocumented

### Policy

Every feature, API, and configuration must be documented before or during implementation.

### Requirements

- User-facing features → `docs/USER_MANUAL.md`
- Admin features → `docs/ADMIN_MANUAL.md`
- Architecture decisions → `docs/ARCHITECTURE.md` or ADRs
- Setup/deployment changes → `docs/SETUP.md`
- Code-level documentation via JSDoc for public APIs

### Doc-Drift Checks

- Automated checks in CI (Phase 0.10)
- PRs blocked if documentation is missing or outdated
- Enforce via `pnpm docs:check`

### Exceptions

Internal implementation details and private functions may be documented inline only.

## 3. Commit & PR Standards

### Commit Messages

Follow Conventional Commits:

```
<type>: <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `perf`

Examples:

```
feat: add user authentication
fix: resolve null pointer in pricing calculator
docs: update setup guide for Docker
test: add E2E tests for admin dashboard
```

### Pull Request Requirements

- Descriptive title and description
- Link to issue/ticket (if applicable)
- Tests included and passing
- Documentation updated
- CI checks passing
- Min. 1 code review approval

## 4. Branch Conventions

### Branch Naming

```
<type>/<short-description>

Examples:
- feature/user-authentication
- fix/pricing-calculation-bug
- docs/api-documentation
- chore/dependency-updates
```

### Protected Branches

- `main`: Production-ready code only
- Requires PR and passing CI
- Direct commits forbidden

## 5. Code Quality Standards

### TypeScript

- Strict mode enabled
- No `any` without justification comment
- Prefer interfaces for public APIs
- Use type inference where reasonable

### Linting & Formatting

- ESLint enforced
- Prettier enforced
- Pre-commit hooks (Phase 0.8)
- CI blocks non-compliant code

### Code Review

- All PRs require review
- Security-sensitive changes require 2+ reviews
- Use inline comments for questions
- Resolve all comments before merge

## 6. Logging & Audit Policy

### Admin Action Audit

**MANDATORY:** Every admin action must generate an immutable audit event.

### Audit Event Requirements

- Timestamp (ISO 8601)
- User ID and username
- Action type
- Resource ID and type
- Previous and new values (where applicable)
- IP address
- User agent
- Request ID (for tracing)

### Audit Event Types (examples)

- `PRICING_UPDATE`
- `USER_ROLE_CHANGE`
- `CONFIG_UPDATE`
- `USER_DELETE`
- `SUPPORT_ACCESS`

### Audit Log Storage

- Immutable (append-only)
- Encrypted at rest
- Retention: TBD (minimum 2 years recommended)
- Regular backups

### Implementation

TBD - Will be enforced via Prisma middleware and service layer (Phase 0.5+)

## 7. Security Policies

### Secrets Management

- Never commit secrets to repository
- Use environment variables for sensitive config
- Rotate credentials regularly
- Use secret scanning tools

### Dependency Management

- Keep dependencies up to date
- Run `pnpm audit` regularly
- Review security advisories weekly
- No direct commits of `package.json` without review

### Input Validation

- Validate all user input
- Sanitize all output
- Use parameterized queries
- Follow OWASP top 10 guidelines

### Authentication & Authorization

- Enforce strong passwords
- Implement rate limiting
- Use secure session management
- RBAC for admin functions

## 8. CI/CD Gates (Phase 0.8+)

### Pre-Merge Gates

All PRs must pass:

- ✅ TypeScript type checking
- ✅ Linting (ESLint + Prettier)
- ✅ Unit tests (min. 80% coverage)
- ✅ Integration tests
- ✅ E2E tests (critical paths)
- ✅ Documentation drift check
- ✅ Security audit (dependencies)

### Deployment Gates

- All CI gates passing
- Code review approved
- No known critical vulnerabilities
- Rollback plan documented

## 9. Documentation Standards

### Structure

- Use markdown for all docs
- Include table of contents for long docs
- Use code blocks with syntax highlighting
- Include examples where applicable

### Updates

- Update docs in same PR as code changes
- Version docs with releases
- Archive old versions
- Keep CHANGELOG.md current

### Review

- Docs reviewed as part of PR
- Technical accuracy verified
- Clarity and completeness checked

## 10. Monitoring & Observability

### Application Logging

- Structured logging (JSON)
- Log levels: ERROR, WARN, INFO, DEBUG
- Include correlation IDs
- No PII in logs (unless encrypted)

### Metrics

- Track key performance indicators
- Monitor error rates
- Alert on anomalies
- Dashboard for real-time visibility

### Tracing

- Distributed tracing for requests
- Performance profiling
- Database query monitoring

---

## Policy Enforcement

These policies are enforced through:

1. **Automated CI checks** (Phase 0.8)
2. **Code review** (all PRs)
3. **Pre-commit hooks** (Phase 0.8)
4. **Regular audits** (quarterly)

Violations may result in PR rejection or required rework.

## Policy Updates

This document is versioned and updated as needed. All changes require:

- Team review and consensus
- Documentation of rationale
- Communication to all contributors
