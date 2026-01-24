/**
 * Test Data Factories
 *
 * Helper functions to create test data for integration tests.
 * Each factory provides sensible defaults but allows overrides.
 */

import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

/**
 * Creates a tenant with sensible defaults.
 *
 * @param prisma - Prisma client instance
 * @param overrides - Optional fields to override defaults
 * @returns Created tenant
 */
export async function createTenant(
  prisma: PrismaClient,
  overrides: {
    id?: string
    name?: string
  } = {}
) {
  const defaults = {
    id: randomUUID(),
    name: `Test Tenant ${Date.now()}`,
  }

  return await prisma.tenant.create({
    data: {
      ...defaults,
      ...overrides,
    },
  })
}

/**
 * Creates a user with sensible defaults.
 * Automatically creates a tenant if tenantId not provided.
 *
 * @param prisma - Prisma client instance
 * @param overrides - Optional fields to override defaults
 * @returns Created user
 */
export async function createUser(
  prisma: PrismaClient,
  overrides: {
    tenantId?: string
    email?: string
    role?: 'ADMIN' | 'SUPPORT_ADMIN' | 'CONFIG_ADMIN' | 'VIEWER' | 'USER'
  } = {}
) {
  // Create tenant if not provided
  let tenantId = overrides.tenantId
  if (!tenantId) {
    const tenant = await createTenant(prisma)
    tenantId = tenant.id
  }

  const defaults = {
    tenantId,
    email: `test-${randomUUID()}@test.local`,
    role: 'USER' as const,
  }

  return await prisma.user.create({
    data: {
      ...defaults,
      ...overrides,
    },
  })
}

/**
 * Creates an audit event with sensible defaults.
 * Automatically creates a tenant and user if not provided.
 *
 * @param prisma - Prisma client instance
 * @param overrides - Optional fields to override defaults
 * @returns Created audit event
 */
export async function createAuditEvent(
  prisma: PrismaClient,
  overrides: {
    tenantId?: string
    actorUserId?: string
    action?: string
    entityType?: string
    entityId?: string
    requestId?: string
    ipAddress?: string
    userAgent?: string
    metadata?: Record<string, unknown>
  } = {}
) {
  // Create tenant if not provided
  let tenantId = overrides.tenantId
  if (!tenantId) {
    const tenant = await createTenant(prisma)
    tenantId = tenant.id
  }

  // Create user if not provided but allow null
  let actorUserId = overrides.actorUserId
  if (!actorUserId && !('actorUserId' in overrides)) {
    const user = await createUser(prisma, { tenantId })
    actorUserId = user.id
  }

  const defaults = {
    tenantId,
    actorUserId,
    action: 'TEST_ACTION',
    entityType: 'TestEntity',
    entityId: randomUUID(),
    requestId: `req-${randomUUID()}`,
    ipAddress: '127.0.0.1',
    userAgent: 'Test Agent',
    metadata: {
      test: true,
      timestamp: new Date().toISOString(),
    },
  }

  return await prisma.auditEvent.create({
    data: {
      ...defaults,
      ...overrides,
    },
  })
}
