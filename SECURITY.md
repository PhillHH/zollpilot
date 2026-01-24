# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within ZollPilot, please report it responsibly.

### Internal Reporting

- **Contact:** [TBD - Internal security team contact]
- **Response Time:** We aim to respond within 48 hours
- **Process:** Issues will be investigated and addressed according to severity

## Security Best Practices

### Secrets Management

- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration
- Rotate credentials regularly
- Use `.env.local` for local development (not tracked in git)

### Code Review

- All code must be reviewed before merging
- Security-sensitive changes require additional review
- Automated security scans will be part of CI (Phase 0.8)

### Dependencies

- Keep dependencies up to date
- Review security advisories regularly
- Use `pnpm audit` to check for known vulnerabilities

### Audit Logging

- All admin actions must generate audit events
- Audit logs are immutable and stored securely
- Implementation details in ARCHITECTURE.md (Phase 0.9)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| other   | :x:                |
