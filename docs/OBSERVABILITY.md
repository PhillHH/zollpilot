# Observability

This document describes ZollPilot's observability baseline: request correlation, structured logging, and audit trails.

**Phase:** 0.12
**Status:** ✅ Implemented
**Last Updated:** 2026-01-24

---

## Table of Contents

1. [Overview](#overview)
2. [Request ID Propagation](#request-id-propagation)
3. [Structured Logging](#structured-logging)
4. [Audit Logging](#audit-logging)
5. [Verification](#verification)
6. [Best Practices](#best-practices)

---

## Overview

ZollPilot implements a **three-layer observability baseline** to support debugging, compliance, and distributed tracing:

1. **Request IDs**: Correlation tokens (`x-request-id`) propagated across all HTTP requests
2. **Structured Logs**: Machine-parseable JSON logs with request correlation
3. **Audit Events**: Immutable database records for compliance and security investigation

These layers work together to provide end-to-end visibility into system behavior.

---

## Request ID Propagation

### Purpose

Request IDs enable **distributed tracing** by providing a unique identifier for each HTTP request that flows through:
- API routes (`/api/*`)
- Server-side pages
- Downstream services (future)

### Contract

**Header Name:** `x-request-id`

**Format:** UUID v4 (e.g., `550e8400-e29b-41d4-a716-446655440000`)

**Propagation Rules:**
1. **Incoming request**: Read `x-request-id` from request headers
2. **Missing header**: Generate new UUID v4 using `crypto.randomUUID()`
3. **Response**: Always set `x-request-id` on response headers (same value)
4. **Logging**: Include `requestId` in structured logs when available
5. **Audit events**: MUST include `requestId` in all audit records

### Implementation

**File:** `apps/web/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || randomUUID();
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
}
```

**Coverage:** All routes except static files (`_next/static`, `_next/image`, `favicon.ico`)

### Usage in Route Handlers

```typescript
export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || undefined;

  logger.info({
    msg: 'processing_request',
    scope: 'api.example',
    requestId,
  });

  // ... business logic
}
```

---

## Structured Logging

### Purpose

Structured logs provide **machine-parseable event streams** for:
- Real-time monitoring and alerting
- Historical analysis and debugging
- Correlation with request IDs and audit events

### Log Schema

**File:** `apps/web/src/server/logger.ts`

**Output Format:** JSON Lines (one JSON object per line)

**Required Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `ts` | string | ISO 8601 timestamp in UTC | `"2026-01-24T15:30:45.123Z"` |
| `level` | string | Log level (info, warn, error, debug) | `"info"` |
| `msg` | string | Human-readable message (snake_case) | `"health_check"` |
| `scope` | string | Scope identifier (dot-separated) | `"api.health"` |

**Optional Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `requestId` | string | Request correlation ID | `"550e8400-e29b-41d4-a716-446655440000"` |
| `meta` | object | Additional structured metadata | `{"userId": "123", "duration": 45}` |
| `error` | object | Error details (stack, message, name) | `{"name": "ValidationError", ...}` |

### Example Log Output

```json
{"ts":"2026-01-24T15:30:45.123Z","level":"info","msg":"health_check","scope":"api.health","requestId":"550e8400-e29b-41d4-a716-446655440000"}
{"ts":"2026-01-24T15:30:46.789Z","level":"warn","msg":"slow_query","scope":"db.users","requestId":"550e8400-e29b-41d4-a716-446655440000","meta":{"duration":1234,"query":"SELECT * FROM users"}}
{"ts":"2026-01-24T15:30:47.456Z","level":"error","msg":"auth_failed","scope":"api.login","requestId":"abc123-def456","meta":{"email":"test@example.com"},"error":{"name":"UnauthorizedError","message":"Invalid credentials"}}
```

### Usage

```typescript
import { logger } from '@/server/logger';

// Basic log
logger.info({
  msg: 'user_created',
  scope: 'api.users',
  requestId: '550e8400-e29b-41d4-a716-446655440000',
});

// Log with metadata
logger.warn({
  msg: 'rate_limit_approaching',
  scope: 'api.auth',
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  meta: {
    userId: 'user-123',
    requestCount: 95,
    limit: 100,
  },
});

// Error logging
logger.error({
  msg: 'database_connection_failed',
  scope: 'db.connection',
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  error: new Error('Connection timeout'),
  meta: {
    host: 'db.example.com',
    port: 5432,
  },
});
```

### Security Guardrails

**DO NOT log sensitive data:**
- ❌ Passwords, tokens, API keys
- ❌ Credit card numbers, SSNs, financial data
- ❌ Complete session cookies or JWTs
- ❌ PII (full names, addresses, phone numbers)

**DO log:**
- ✅ Request IDs, user IDs (opaque identifiers)
- ✅ Email addresses (for audit purposes only)
- ✅ Timestamps, durations, counts
- ✅ Error types and messages (sanitized)

---

## Audit Logging

### Purpose

Audit events provide **immutable compliance records** stored in the database for:
- Security investigation (WHO did WHAT, WHEN)
- Regulatory compliance (GDPR, SOX, HIPAA)
- Change tracking and rollback support

### Schema

**Database Table:** `audit_events`
**Prisma Model:** `AuditEvent`
**Helper File:** `apps/web/src/server/audit.ts`

**Required Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenantId` | UUID | ✅ | Multi-tenant isolation |
| `action` | string | ✅ | Action type (see AUDIT_ACTIONS) |
| `requestId` | string | ✅ | Request correlation ID |

**Optional Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `actorUserId` | UUID | User who performed the action (null for system) |
| `entityType` | string | Type of entity affected (e.g., "User", "Shipment") |
| `entityId` | string | ID of entity affected |
| `ipAddress` | string | Client IP address |
| `userAgent` | string | Client user agent |
| `metadata` | JSON | Additional context (max 10KB) |

**Automatic Fields:**
- `id`: UUID v4 (auto-generated)
- `createdAt`: Timestamp (auto-generated, immutable)

### Standard Actions

**Defined in:** `AUDIT_ACTIONS` constant

```typescript
export const AUDIT_ACTIONS = {
  // System events
  SYSTEM_SEED: 'SYSTEM_SEED',

  // User management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',

  // Pricing events
  PRICING_UPDATED: 'PRICING_UPDATED',
  PRICING_EXPORTED: 'PRICING_EXPORTED',

  // Add more as needed...
} as const;
```

### Usage

```typescript
import { logAuditEvent, AUDIT_ACTIONS } from '@/server/audit';
import { prisma } from '@/server/db';

// Example: User creation
const auditEvent = await logAuditEvent(prisma, {
  tenantId: 'tenant-123',
  actorUserId: 'admin-456',
  action: AUDIT_ACTIONS.USER_CREATED,
  entityType: 'User',
  entityId: 'user-789',
  requestId: request.headers.get('x-request-id') || 'unknown',
  ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
  userAgent: request.headers.get('user-agent') || 'unknown',
  metadata: {
    email: 'newuser@example.com',
    role: 'USER',
  },
});
```

### Validation Rules

The `logAuditEvent` helper enforces:

1. **Required fields**: `tenantId`, `action`, `requestId` must be non-empty
2. **Metadata size**: Maximum 10KB JSON (prevents database bloat)
3. **Fail-fast**: Throws clear errors on validation failure

```typescript
// ❌ Will throw: "tenantId is required"
await logAuditEvent(prisma, {
  tenantId: '',
  action: 'TEST',
  requestId: 'req-123',
});

// ❌ Will throw: "metadata exceeds maximum size"
await logAuditEvent(prisma, {
  tenantId: 'tenant-123',
  action: 'TEST',
  requestId: 'req-123',
  metadata: { data: 'x'.repeat(20000) },
});
```

### Recommended Metadata Keys

For consistency across audit events, use these metadata keys:

| Key | Type | Usage |
|-----|------|-------|
| `email` | string | User email address |
| `role` | string | User role (ADMIN, USER) |
| `oldValue` | any | Previous value (for updates) |
| `newValue` | any | New value (for updates) |
| `reason` | string | Human-readable reason for action |
| `ipAddress` | string | Alternative to top-level field |
| `duration` | number | Action duration in milliseconds |
| `affectedRecords` | number | Count of records changed |

---

## Verification

### Local Development

**1. Check Request ID Header:**

```bash
curl -i http://localhost:3000/api/health
```

Expected response header:
```
x-request-id: 550e8400-e29b-41d4-a716-446655440000
```

**2. View Structured Logs:**

```bash
pnpm dev
# Make requests to trigger logs
# Observe JSON output in terminal
```

**3. Query Audit Events:**

```bash
pnpm prisma studio
# Navigate to AuditEvent table
# Verify records exist with requestId
```

### Automated Tests

**Unit Tests:**
```bash
pnpm test apps/web/src/server/logger.test.ts
```

**Integration Tests:**
```bash
pnpm test apps/web/src/server/audit.integration.test.ts
```

**E2E Tests:**
```bash
pnpm test:e2e apps/web/e2e/health.e2e.spec.ts
```

---

## Best Practices

### Request IDs

1. **Always propagate**: Pass `x-request-id` to downstream services
2. **Client-generated OK**: Accept client-provided request IDs for client-side correlation
3. **Logging**: Include `requestId` in all structured logs when available
4. **Audit events**: MUST include `requestId` (required field)

### Structured Logging

1. **Use snake_case**: Message keys should be `snake_case` (e.g., `user_created`)
2. **Dot-separated scopes**: `api.health`, `db.users`, `worker.email`
3. **Avoid string interpolation**: Use `meta` for dynamic values instead of template strings
4. **Performance**: Use `logger.debug()` for verbose logs (filtered in production)

### Audit Logging

1. **Immutable**: NEVER update or delete audit events (compliance requirement)
2. **Complete context**: Include all WHO/WHAT/WHEN/WHERE information
3. **Bounded metadata**: Keep metadata under 10KB (enforced by helper)
4. **Tenant isolation**: ALWAYS include `tenantId` (required field)
5. **Request correlation**: ALWAYS include `requestId` (required field)

### Integration

**Recommended pattern for API routes:**

```typescript
export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || undefined;

  try {
    // 1. Log request received
    logger.info({
      msg: 'request_received',
      scope: 'api.example',
      requestId,
    });

    // 2. Business logic
    const result = await doSomething();

    // 3. Log audit event
    await logAuditEvent(prisma, {
      tenantId: result.tenantId,
      actorUserId: result.userId,
      action: AUDIT_ACTIONS.SOMETHING_HAPPENED,
      entityType: 'Example',
      entityId: result.id,
      requestId: requestId || 'unknown',
      metadata: { /* ... */ },
    });

    // 4. Log success
    logger.info({
      msg: 'request_completed',
      scope: 'api.example',
      requestId,
      meta: { duration: Date.now() - start },
    });

    return NextResponse.json(result);
  } catch (error) {
    // 5. Log error
    logger.error({
      msg: 'request_failed',
      scope: 'api.example',
      requestId,
      error: error as Error,
    });

    throw error;
  }
}
```

---

## Future Enhancements

Potential improvements not yet implemented:

- [ ] **Distributed Tracing**: OpenTelemetry integration for span tracking
- [ ] **Log Aggregation**: Centralized log storage (e.g., Loki, CloudWatch)
- [ ] **Metrics**: Prometheus metrics endpoint for monitoring
- [ ] **Alerting**: Real-time alerts on error thresholds
- [ ] **Audit UI**: Admin interface for querying audit events
- [ ] **Log Sampling**: Reduce log volume in high-traffic scenarios

---

## Related Documentation

- [SETUP.md](./SETUP.md) - Local development verification steps
- [POLICIES.md](./POLICIES.md) - Observability requirements and gates
- [SECURITY.md](./SECURITY.md) - Security considerations for logging
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to add new audit actions

---

**Questions?** See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
