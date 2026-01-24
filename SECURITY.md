# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in ZollPilot, please report it responsibly.

### How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please report security issues via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the repository's "Security" tab
   - Click "Report a vulnerability"
   - Fill out the security advisory form
   - Our security team will respond within 48 hours

2. **Email** (Alternative)
   - Send an email to the project maintainers
   - Include "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: What an attacker could achieve
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are vulnerable
- **Suggested Fix**: If you have ideas for remediation (optional)
- **Proof of Concept**: Code or screenshots demonstrating the issue (if applicable)

### Response Timeline

- **Initial Response**: Within 48 hours of report
- **Triage**: Within 5 business days
- **Fix**: Within 30 days for critical vulnerabilities
- **Disclosure**: Coordinated disclosure after fix is available

### Scope

**In Scope:**
- Authentication and authorization bypasses
- SQL injection, XSS, CSRF, and other injection attacks
- Server-side request forgery (SSRF)
- Remote code execution (RCE)
- Information disclosure (credentials, PII, etc.)
- Cryptographic vulnerabilities
- Dependency vulnerabilities (if actively exploitable)

**Out of Scope:**
- Issues in dependencies with no known exploit
- Theoretical vulnerabilities without proof of concept
- Social engineering attacks
- Physical attacks
- Denial of Service (DoS) attacks
- Issues requiring physical access to infrastructure

## Security Baseline (Phase 0.11)

ZollPilot implements multiple layers of security controls to protect against common vulnerabilities.

### 1. HTTP Security Headers

All HTTP responses include security headers to protect against common web vulnerabilities:

| Header | Value | Purpose |
|--------|-------|---------|
| **X-Content-Type-Options** | `nosniff` | Prevents MIME type sniffing attacks |
| **X-Frame-Options** | `DENY` | Prevents clickjacking via iframes |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | Controls referrer information leakage |
| **Permissions-Policy** | Restrictive | Disables sensitive browser APIs (camera, microphone, geolocation, payment, USB) |
| **Strict-Transport-Security** | `max-age=31536000; includeSubDomains` | Forces HTTPS (production only) |
| **X-DNS-Prefetch-Control** | `off` | Prevents DNS prefetching privacy leaks |

**Configuration:** `apps/web/next.config.js`

**Verification:**
```bash
# Run E2E tests that assert headers
pnpm test:e2e

# Or manually check with curl
curl -I https://your-domain.com/api/health
```

### 2. Environment Validation

All environment variables are validated on application startup using Zod schemas:

**Validated Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required, must be valid URL)
- `NODE_ENV` - Runtime environment (development, test, production)

**Fail-Fast Behavior:**
- Application crashes immediately if required environment variables are missing or invalid
- Clear error messages indicate which variables need to be configured
- Prevents runtime errors due to misconfiguration

**Configuration:** `apps/web/src/server/env.ts`

**Testing:**
```bash
# Run environment validation tests
pnpm test:unit
```

### 3. Dependency Security Auditing

Automated scanning for known vulnerabilities in npm dependencies:

**Command:**
```bash
# Check for high/critical vulnerabilities
pnpm security:audit

# Full audit (all severities)
pnpm audit
```

**CI Enforcement:**
- Runs automatically on every pull request
- Fails CI if high or critical vulnerabilities are detected
- Production dependencies only (dev dependencies excluded)

**Handling Audit Failures:**

1. **Immediate Fix (Preferred):**
   ```bash
   # Update vulnerable dependencies
   pnpm update [package-name]

   # Re-run audit to verify
   pnpm security:audit
   ```

2. **Temporary Exception (Use Sparingly):**
   - Document reason in pull request description
   - Include:
     - Vulnerability ID (CVE or GHSA)
     - Reason for exception (false positive, not exploitable, etc.)
     - Mitigation steps taken
     - Target date for resolution
   - Review exceptions quarterly

3. **False Positives:**
   - Verify the vulnerability doesn't affect our usage
   - Document in PR with evidence
   - Consider contributing fix upstream

### 4. Static Application Security Testing (SAST)

**CodeQL Analysis** (Phase 0.9.3):
- Runs on all pull requests and weekly
- Scans for 100+ security patterns (SQL injection, XSS, command injection, etc.)
- Results visible in GitHub Security tab

**See:** [CONTRIBUTING.md - Security Scanning](docs/CONTRIBUTING.md#security-scanning-phase-093)

### 5. Secret Scanning

**GitHub Secret Scanning** (Phase 0.9.2):
- Detects accidentally committed secrets (API keys, tokens, etc.)
- Push protection prevents commits containing secrets
- Partner patterns and custom patterns supported

**Configuration Required:** Repository Settings → Code security and analysis

### 6. Input Validation

**Policy:**
- All user input must be validated before processing
- Use parameterized queries for database operations (Prisma ORM enforces this)
- Sanitize output in templates (React auto-escapes by default)
- Follow OWASP Top 10 guidelines

**See:** [POLICIES.md - Security Policies](docs/POLICIES.md#7-security-policies)

## Security Architecture

### Defense in Depth

ZollPilot employs multiple layers of security:

1. **Network Layer**: HTTPS/TLS, HSTS
2. **Application Layer**: Security headers, input validation, output encoding
3. **Data Layer**: Encrypted connections, parameterized queries
4. **Code Layer**: SAST scanning, dependency auditing
5. **Runtime Layer**: Environment validation, fail-fast behavior

### Secure Development Lifecycle

- **Design**: Security requirements defined in POLICIES.md
- **Development**: TDD with security test cases
- **Code Review**: Security-focused PR reviews
- **Testing**: Unit, integration, E2E tests include security assertions
- **CI/CD**: Automated security scanning (CodeQL, dependency audit)
- **Deployment**: Environment validation, HTTPS enforcement
- **Monitoring**: (Planned for Phase 1)

## Compliance

**Current Baseline:**
- OWASP Secure Headers Project compliance
- OWASP Top 10 awareness (input validation, authentication, etc.)

**Future:**
- GDPR compliance (data protection, privacy)
- SOC 2 Type II (planned)
- ISO 27001 (planned)

## Security Updates

### Dependency Updates

**Automated:** Dependabot creates weekly PRs for dependency updates

**Review SLAs:** See [POLICIES.md - Dependency Management](docs/POLICIES.md#dependency-management-phase-092)

- Critical vulnerabilities (CVSS ≥9.0): 8 hours
- High vulnerabilities (CVSS 7.0-8.9): 2 business days
- Medium/Low: 5 business days

### Security Patches

**Emergency Hotfix Process:**
1. Create hotfix branch from main
2. Apply minimal fix for vulnerability
3. Run full test suite
4. Fast-track PR review
5. Deploy immediately after merge
6. Notify team and document incident

## Secrets Management

**Best Practices:**
- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration (validated via `apps/web/src/server/env.ts`)
- Rotate credentials regularly
- Use `.env.local` for local development (not tracked in git)
- Enable GitHub Secret Scanning push protection

### Audit Logging

**Policy:** All admin actions must generate immutable audit events

**Implementation:** Planned for Phase 1
- Timestamp and user
- Action and resource
- Old and new values
- IP address and user agent

**See:** [POLICIES.md - Audit Policy](docs/POLICIES.md#6-logging--audit-policy)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| other   | :x:                |

## Additional Resources

- **[POLICIES.md](docs/POLICIES.md)** - Security policies and standards
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Security scanning and testing
- **[CodeQL Documentation](https://codeql.github.com/docs/)** - Static analysis
- **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** - Common vulnerabilities

## Contact

For security-related questions (non-vulnerabilities):
- Create a GitHub Discussion in the "Security" category
- Tag with `security` label

For vulnerability reports:
- Use GitHub Security Advisories (preferred)
- Email maintainers with "SECURITY" in subject line

---

**Last Updated:** Phase 0.11
**Next Review:** Phase 1.0
