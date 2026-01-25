/**
 * Integration tests for audit logging
 *
 * Tests the logAuditEvent helper with real database operations.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { logAuditEvent, AUDIT_ACTIONS } from './audit'

const prisma = new PrismaClient()

describe('Audit Logging Integration', () => {
  let testTenantId: string
  let testUserId: string

  beforeAll(async () => {
    // Create test tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Audit Test Tenant - ' + Date.now(),
      },
    })
    testTenantId = tenant.id

    // Create test user
    const user = await prisma.user.create({
      data: {
        tenantId: testTenantId,
        email: 'audit-test@local.test',
        role: 'ADMIN',
      },
    })
    testUserId = user.id
  })

  afterAll(async () => {
    // Cleanup: delete test data
    await prisma.auditEvent.deleteMany({ where: { tenantId: testTenantId } })
    await prisma.user.deleteMany({ where: { tenantId: testTenantId } })
    await prisma.tenant.delete({ where: { id: testTenantId } })
    await prisma.$disconnect()
  })

  it('should create audit event with all fields', async () => {
    const requestId = 'test-request-' + Date.now()

    const auditEvent = await logAuditEvent(prisma, {
      tenantId: testTenantId,
      actorUserId: testUserId,
      action: AUDIT_ACTIONS.USER_CREATED,
      entityType: 'User',
      entityId: 'user-123',
      requestId,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      metadata: { email: 'new@local.test' },
    })

    expect(auditEvent).toBeDefined()
    expect(auditEvent.id).toBeDefined()
    expect(auditEvent.tenantId).toBe(testTenantId)
    expect(auditEvent.actorUserId).toBe(testUserId)
    expect(auditEvent.action).toBe(AUDIT_ACTIONS.USER_CREATED)
    expect(auditEvent.entityType).toBe('User')
    expect(auditEvent.entityId).toBe('user-123')
    expect(auditEvent.requestId).toBe(requestId)
    expect(auditEvent.ipAddress).toBe('192.168.1.1')
    expect(auditEvent.userAgent).toBe('Mozilla/5.0')
    expect(auditEvent.metadata).toEqual({ email: 'new@local.test' })
  })

  it('should create audit event with only required fields', async () => {
    const requestId = 'test-request-' + Date.now()

    const auditEvent = await logAuditEvent(prisma, {
      tenantId: testTenantId,
      action: AUDIT_ACTIONS.SYSTEM_SEED,
      requestId,
    })

    expect(auditEvent).toBeDefined()
    expect(auditEvent.tenantId).toBe(testTenantId)
    expect(auditEvent.action).toBe(AUDIT_ACTIONS.SYSTEM_SEED)
    expect(auditEvent.requestId).toBe(requestId)
    expect(auditEvent.actorUserId).toBeNull()
    expect(auditEvent.entityType).toBeNull()
    expect(auditEvent.entityId).toBeNull()
    expect(auditEvent.ipAddress).toBeNull()
    expect(auditEvent.userAgent).toBeNull()
    expect(auditEvent.metadata).toBeNull()
  })

  it('should throw error when tenantId is missing', async () => {
    await expect(
      logAuditEvent(prisma, {
        tenantId: '',
        action: 'TEST_ACTION',
        requestId: 'test-request-123',
      })
    ).rejects.toThrow('tenantId is required')
  })

  it('should throw error when action is missing', async () => {
    await expect(
      logAuditEvent(prisma, {
        tenantId: testTenantId,
        action: '',
        requestId: 'test-request-123',
      })
    ).rejects.toThrow('action is required')
  })

  it('should throw error when requestId is missing', async () => {
    await expect(
      logAuditEvent(prisma, {
        tenantId: testTenantId,
        action: 'TEST_ACTION',
        requestId: '',
      })
    ).rejects.toThrow('requestId is required')
  })

  it('should throw error when metadata exceeds size limit', async () => {
    const largeMetadata = {
      data: 'x'.repeat(20000), // 20KB of data
    }

    await expect(
      logAuditEvent(prisma, {
        tenantId: testTenantId,
        action: 'TEST_ACTION',
        requestId: 'test-request-123',
        metadata: largeMetadata,
      })
    ).rejects.toThrow('metadata exceeds')
  })
})
