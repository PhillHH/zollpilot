/**
 * Integration Tests for Database Module
 *
 * Demonstrates the integration test harness:
 * - Schema-per-run isolation
 * - Factory usage for test data
 * - Database cleanup utilities
 */

import { describe, it, expect, afterEach } from 'vitest'
import { prisma } from './db'
import { truncateAll } from '../../test/db-utils'
import {
  createTenant,
  createUser,
  createAuditEvent,
} from '../../test/factories'

describe('Database Integration', () => {
  // Clean up after each test
  afterEach(async () => {
    await truncateAll(prisma)
  })

  describe('Prisma Client', () => {
    it('should connect to test database', async () => {
      // Simple connectivity test
      const result = await prisma.$queryRaw<
        Array<{ now: Date }>
      >`SELECT NOW() as now`
      expect(result).toHaveLength(1)
      expect(result[0].now).toBeInstanceOf(Date)
    })

    it('should use isolated test schema', async () => {
      // Verify we're using a test schema
      const databaseUrl = process.env.DATABASE_URL
      expect(databaseUrl).toContain('schema=test_')
    })
  })

  describe('Tenant Model', () => {
    it('should create and query tenant', async () => {
      const tenant = await createTenant(prisma, {
        name: 'Integration Test Tenant',
      })

      expect(tenant.id).toBeTruthy()
      expect(tenant.name).toBe('Integration Test Tenant')

      // Query it back
      const found = await prisma.tenant.findUnique({
        where: { id: tenant.id },
      })

      expect(found).toEqual(tenant)
    })

    it('should support multiple tenants', async () => {
      await createTenant(prisma, { name: 'Tenant 1' })
      await createTenant(prisma, { name: 'Tenant 2' })

      const allTenants = await prisma.tenant.findMany()
      expect(allTenants).toHaveLength(2)
      expect(allTenants.map((t: { name: string }) => t.name)).toContain(
        'Tenant 1'
      )
      expect(allTenants.map((t: { name: string }) => t.name)).toContain(
        'Tenant 2'
      )
    })
  })

  describe('User Model', () => {
    it('should create user with auto-generated tenant', async () => {
      const user = await createUser(prisma, {
        email: 'auto@test.local',
        role: 'ADMIN',
      })

      expect(user.id).toBeTruthy()
      expect(user.email).toBe('auto@test.local')
      expect(user.role).toBe('ADMIN')
      expect(user.tenantId).toBeTruthy()

      // Verify tenant was created
      const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId },
      })
      expect(tenant).toBeTruthy()
    })

    it('should create user with specific tenant', async () => {
      const tenant = await createTenant(prisma, { name: 'Specific Tenant' })
      const user = await createUser(prisma, {
        tenantId: tenant.id,
        email: 'user@test.local',
        role: 'VIEWER',
      })

      expect(user.tenantId).toBe(tenant.id)
      expect(user.email).toBe('user@test.local')
      expect(user.role).toBe('VIEWER')
    })

    it('should enforce unique email per tenant', async () => {
      const tenant = await createTenant(prisma)
      const email = 'duplicate@test.local'

      await createUser(prisma, { tenantId: tenant.id, email })

      // Attempting to create duplicate should fail
      await expect(
        createUser(prisma, { tenantId: tenant.id, email })
      ).rejects.toThrow()
    })

    it('should allow same email across different tenants', async () => {
      const tenant1 = await createTenant(prisma)
      const tenant2 = await createTenant(prisma)
      const email = 'cross-tenant@test.local'

      const user1 = await createUser(prisma, { tenantId: tenant1.id, email })
      const user2 = await createUser(prisma, { tenantId: tenant2.id, email })

      expect(user1.email).toBe(email)
      expect(user2.email).toBe(email)
      expect(user1.tenantId).not.toBe(user2.tenantId)
    })
  })

  describe('AuditEvent Model', () => {
    it('should create audit event with auto-generated tenant and user', async () => {
      const event = await createAuditEvent(prisma, {
        action: 'TEST_AUTO',
      })

      expect(event.id).toBeTruthy()
      expect(event.action).toBe('TEST_AUTO')
      expect(event.tenantId).toBeTruthy()
      expect(event.actorUserId).toBeTruthy()
      expect(event.requestId).toBeTruthy()

      // Verify tenant and user exist
      const tenant = await prisma.tenant.findUnique({
        where: { id: event.tenantId },
      })
      expect(tenant).toBeTruthy()

      if (event.actorUserId) {
        const user = await prisma.user.findUnique({
          where: { id: event.actorUserId },
        })
        expect(user).toBeTruthy()
      }
    })

    it('should create audit event with specific tenant and user', async () => {
      const tenant = await createTenant(prisma)
      const user = await createUser(prisma, { tenantId: tenant.id })

      const event = await createAuditEvent(prisma, {
        tenantId: tenant.id,
        actorUserId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        metadata: { loginMethod: 'oauth' },
      })

      expect(event.tenantId).toBe(tenant.id)
      expect(event.actorUserId).toBe(user.id)
      expect(event.action).toBe('USER_LOGIN')
      expect(event.entityType).toBe('User')
      expect(event.entityId).toBe(user.id)
      expect(event.metadata).toEqual({ loginMethod: 'oauth' })
    })

    it('should query audit events by tenant', async () => {
      const tenant1 = await createTenant(prisma)
      const tenant2 = await createTenant(prisma)

      await createAuditEvent(prisma, { tenantId: tenant1.id, action: 'T1_A1' })
      await createAuditEvent(prisma, { tenantId: tenant1.id, action: 'T1_A2' })
      await createAuditEvent(prisma, { tenantId: tenant2.id, action: 'T2_A1' })

      const tenant1Events = await prisma.auditEvent.findMany({
        where: { tenantId: tenant1.id },
        orderBy: { createdAt: 'asc' },
      })

      expect(tenant1Events).toHaveLength(2)
      expect(tenant1Events[0].action).toBe('T1_A1')
      expect(tenant1Events[1].action).toBe('T1_A2')
    })
  })

  describe('Database Cleanup', () => {
    it('should truncate all tables', async () => {
      // Create some data
      await createTenant(prisma)
      await createUser(prisma)
      await createAuditEvent(prisma)

      // Verify data exists
      const tenantsBeforeCount = await prisma.tenant.count()
      const usersBeforeCount = await prisma.user.count()
      const eventsBeforeCount = await prisma.auditEvent.count()

      expect(tenantsBeforeCount).toBeGreaterThan(0)
      expect(usersBeforeCount).toBeGreaterThan(0)
      expect(eventsBeforeCount).toBeGreaterThan(0)

      // Clean up
      await truncateAll(prisma)

      // Verify all tables are empty
      const tenantsAfterCount = await prisma.tenant.count()
      const usersAfterCount = await prisma.user.count()
      const eventsAfterCount = await prisma.auditEvent.count()

      expect(tenantsAfterCount).toBe(0)
      expect(usersAfterCount).toBe(0)
      expect(eventsAfterCount).toBe(0)
    })
  })
})
