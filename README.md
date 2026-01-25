# ZollPilot

[![CI](https://github.com/PhillHH/zollpilot/workflows/CI/badge.svg)](https://github.com/PhillHH/zollpilot/actions/workflows/ci.yml)

**A structured customs data management platform**

ZollPilot helps organizations efficiently manage and navigate customs data with a modern, SEO-crawlable public portal and comprehensive admin backend.

## Project Status

**Phase:** Phase 1 Complete - IAA Wizard MVP
**Next:** Phase 2 - Enhancements and extended features

## Features (Planned)

### Public Portal
- SEO-optimized public interface
- Customs data navigation
- User-friendly search and filtering

### Admin Backend
- Pricing configuration management
- Comprehensive logging and monitoring
- Audit trail for all admin actions
- Support tools and user management

## Technology Stack

### Core (Phase 0.1)
- **Monorepo:** pnpm workspaces
- **Package Manager:** pnpm 9.15.2
- **Runtime:** Node.js v20 LTS
- **Language:** TypeScript (strict mode)

### Application Stack (Planned)
- **Framework:** Next.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Vitest (unit/integration), Playwright (E2E)
- **CI/CD:** GitHub Actions

## Repository Structure

```
zollpilot/
├── apps/
│   └── web/              # Next.js application (Phase 0.2+)
├── packages/
│   ├── shared/           # Shared types and utilities
│   └── config/           # Shared configuration
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System architecture
│   ├── SETUP.md          # Development setup guide
│   ├── CONTRIBUTING.md   # Contribution guidelines
│   ├── POLICIES.md       # Development policies
│   ├── USER_MANUAL.md    # End-user documentation
│   └── ADMIN_MANUAL.md   # Admin documentation
├── scripts/              # Build and utility scripts
└── .github/workflows/    # CI/CD pipelines
```

## Prerequisites

- **Node.js:** v20 LTS or higher (use `nvm` or `fnm`)
- **pnpm:** v9.0.0 or higher
- **Git:** Latest stable version

## Getting Started

### 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd zollpilot

# Use correct Node version
nvm use

# Install dependencies (Phase 0.2+)
pnpm install
```

### 2. Development (Phase 0.2+)

```bash
# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Development Standards

### Test-Driven Development (TDD)
All code must be written test-first. No exceptions.

```
Process: Test (red) → Code (green) → Refactor → Commit
```

### Nothing Undocumented
Every feature must be documented. Documentation drift checks enforced in CI.

### Code Quality
- TypeScript strict mode
- 80% minimum test coverage
- ESLint + Prettier enforced
- Comprehensive code reviews

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for full guidelines.

## Key Policies

### Audit Logging
**MANDATORY:** Every admin action generates an immutable audit event including:
- Timestamp and user
- Action and resource
- Old and new values
- IP and user agent

### Security
- No secrets in repository
- Automated dependency monitoring (Dependabot)
- Input validation everywhere
- OWASP compliance

See [docs/POLICIES.md](docs/POLICIES.md) and [SECURITY.md](SECURITY.md) for details.

## Documentation

- **[SETUP.md](docs/SETUP.md)** - Development environment setup
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[POLICIES.md](docs/POLICIES.md)** - Development policies and standards
- **[OBSERVABILITY.md](docs/OBSERVABILITY.md)** - Request IDs, structured logs, and audit trails
- **[USER_MANUAL.md](docs/USER_MANUAL.md)** - End-user guide
- **[ADMIN_MANUAL.md](docs/ADMIN_MANUAL.md)** - Administrator guide

## Scripts

```bash
# Development
pnpm dev              # Start development server (Phase 0.2+)
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Run unit tests
pnpm test:integration # Run integration tests
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Lint code
pnpm format           # Format code
pnpm typecheck        # Type check

# Documentation
pnpm docs:check       # Check for documentation drift
```

## License

UNLICENSED - Proprietary software for internal use.
See [LICENSE](LICENSE) for details.

## Contributing

We follow strict development practices:
- TDD mandatory
- Nothing undocumented
- Code review required
- CI gates enforced

### Merge Requirements

All pull requests must:
- ✅ Pass all CI checks (quality, integration, e2e)
- ✅ Have at least 1 approving review
- ✅ Be up-to-date with base branch
- ✅ Have all conversations resolved

**Note:** When branch protection is configured (Phase 0.9.1+), these requirements are enforced automatically by GitHub. See [CONTRIBUTING.md](docs/CONTRIBUTING.md#branch-protection-setup-phase-091) for setup instructions.

Read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before submitting PRs.

## Support

- **Issues:** Create GitHub issue
- **Documentation:** See `docs/` directory
- **Security:** See [SECURITY.md](SECURITY.md)
