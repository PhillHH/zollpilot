# ZollPilot Development Policies

**Enforcement:** These policies are enforced through CI gates (Phase 0.8+) and code review.

## 1. Test-Driven Development (TDD)

### Policy
All code must be written test-first.

### Requirements
- Write failing test before implementation
- No implementation without corresponding tests
- **ENFORCED:** Minimum 80% code coverage (lines, functions, branches, statements)
- Critical paths require 100% coverage

### Coverage Enforcement (Phase 0.4+)

**Automated threshold checks:**
- Lines: ≥80%
- Functions: ≥80%
- Branches: ≥80%
- Statements: ≥80%

**Command:** `pnpm test:coverage`

**Enforcement:** The test:coverage command will FAIL if any threshold is not met. This prevents merging code with insufficient coverage.

**Configuration:** See `apps/web/vitest.config.ts` for threshold settings.

### Process
```
1. Write test (red)
2. Write minimal code to pass (green)
3. Refactor (refactor)
4. Verify coverage: pnpm test:coverage
5. Commit
```

### Exceptions
None. TDD is mandatory. Coverage thresholds are enforced.

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
- Pre-commit hooks (Phase 0.7+)
- CI blocks non-compliant code (Phase 0.8+)

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

### Dependency Management (Phase 0.9.2)

**Automated Scanning:**
- Dependabot scans dependencies weekly (Mondays, 06:00 Europe/Berlin)
- Automatically creates PRs for:
  - Security vulnerabilities (via Dependabot security updates)
  - Version updates for npm packages and GitHub Actions
- Updates grouped to reduce noise:
  - `dev-dependencies` group (tooling updates)
  - `runtime-dependencies` group (framework/library updates)

**Review and Merge Timelines:**

| Update Type | Review SLA | Merge SLA | Reviewer |
|-------------|-----------|-----------|----------|
| **Critical security** (CVSS ≥9.0) | 4 hours | 8 hours | Any maintainer + post-merge notification |
| **High security** (CVSS 7.0-8.9) | 1 business day | 2 business days | Any maintainer |
| **Medium/Low security** (CVSS <7.0) | 3 business days | 5 business days | Any maintainer |
| **Major version updates** | 5 business days | Sprint planning | Tech lead review required |
| **Minor/patch updates** (grouped) | 3 business days | 5 business days | Any maintainer |

**Review Requirements:**
- All Dependabot PRs must pass CI (quality, integration, e2e)
- Security updates: Check changelog for breaking changes, test locally if high-risk
- Major updates: Requires migration plan and tech lead approval
- Grouped updates: Review all changes in the group, not just first package

**Emergency Security Patch Workflow:**

1. **Identification (within 1 hour of alert)**
   - Dependabot creates security update PR automatically
   - GitHub Security tab shows alert severity and affected versions

2. **Assessment (within 2 hours)**
   - Review CVE details and exploitability
   - Check if vulnerability affects our usage (dead code paths can defer)
   - Determine if hotfix needed or can wait for next sprint

3. **Hotfix Process (for critical/high severity)**
   ```bash
   # Create hotfix branch from main
   git checkout main
   git pull
   git checkout -b hotfix/CVE-YYYY-NNNNN

   # Cherry-pick Dependabot commit or update manually
   pnpm update <affected-package>@<safe-version>

   # Run full test suite
   pnpm test && pnpm test:integration && pnpm test:e2e

   # Create PR with security label
   gh pr create --title "fix(security): patch CVE-YYYY-NNNNN" \
                --label "security" --label "hotfix"

   # Fast-track review and merge
   # Deploy immediately after merge
   ```

4. **Post-Patch (within 24 hours)**
   - Notify team in security channel
   - Document incident in security log
   - Update dependencies across all branches if needed

**Dependency Audit:**
- `pnpm audit` runs in CI on every PR (planned for Phase 0.9.3)
- Weekly manual audit review (Fridays)
- Quarterly full dependency review and cleanup

**Restrictions:**
- No direct commits of `package.json` or `pnpm-lock.yaml` without PR
- No `--force` flag for dependency installs without documented reason
- No pinning dependencies to vulnerable versions without security exception

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

## 8. CI/CD Gates

### Quality Gates (ENFORCED in Phase 0.4+)

**Locally Enforced (before commit):**
- ✅ TypeScript type checking (`pnpm typecheck`)
- ✅ Linting (`pnpm lint`)
- ✅ Code formatting (`pnpm format`)
- ✅ Unit tests with ≥80% coverage (`pnpm test:coverage`)

**Run all gates:**
```bash
pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm format
```

### Pre-Merge Gates (Phase 0.8+ CI Automation)

**Phase 0.8:** CI pipeline runs automatically on all pull requests.
**Phase 0.9.1:** CI becomes a merge gate via GitHub branch protection (requires manual configuration).

#### CI Pipeline Status (Phase 0.8+)

The following checks **run automatically** on every pull request:

- ✅ TypeScript type checking (strict mode) - **RUNS IN CI**
- ✅ Linting (ESLint) - **RUNS IN CI**
- ✅ Code formatting (Prettier) - **RUNS IN CI**
- ✅ Unit tests (≥80% coverage) - **RUNS IN CI**
- ✅ Integration tests (Postgres + Prisma) - **RUNS IN CI**
- ✅ E2E tests (Playwright smoke tests) - **RUNS IN CI**
- ⏳ Documentation drift check (Phase 0.10)
- ⏳ Security audit (dependencies)

#### Enforcement Status (Phase 0.9.1)

**IMPORTANT DISTINCTION:**
- **"RUNS IN CI"** means the check executes automatically on PRs
- **"ENFORCED AS MERGE GATE"** means GitHub blocks merging if the check fails

**Current Enforcement Status:**

With **branch protection configured** (manual GitHub setup required):
- ✅ CI checks become **MERGE GATES** - PRs cannot merge if CI fails
- ✅ PR approvals required - At least 1 reviewer must approve
- ✅ Up-to-date branches required - Branch must be current with base
- ✅ Direct commits blocked - All changes must go through PRs

Without branch protection (default):
- ⚠️ CI runs but **does not block merging**
- ⚠️ Failed CI checks show warnings but allow merge
- ⚠️ No approval required - Authors can merge their own PRs
- ⚠️ Direct commits allowed - Can push directly to `main`

**To enable enforcement:** Follow the Branch Protection Setup guide in `docs/CONTRIBUTING.md`

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
1. **Pre-commit hooks** (Phase 0.7+) - Local enforcement before commits
2. **Automated CI checks** (Phase 0.8+) - Run on all pull requests
3. **Branch protection** (Phase 0.9.1) - Blocks merging if CI fails (requires GitHub configuration)
4. **Code review** (all PRs) - Human review and approval required
5. **Regular audits** (quarterly) - Periodic compliance reviews

**Enforcement Layers:**
- **Local (pre-commit/pre-push):** Fast feedback, can be bypassed with `--no-verify`
- **CI Pipeline (automated):** Runs on every PR, provides visibility but doesn't block by default
- **Branch Protection (merge gate):** **Only enforcement layer that prevents merging** - must be configured in GitHub

Violations may result in PR rejection or required rework.

## Policy Updates

This document is versioned and updated as needed. All changes require:
- Team review and consensus
- Documentation of rationale
- Communication to all contributors
