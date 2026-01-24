import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { createTenant, createUser, createAuditEvent } from '../../test/factories'
import { truncateAll } from '../../test/db-utils'

const prisma = new PrismaClient()

describe('Database Integration', () => {
  beforeEach(async () => {
    await truncateAll(prisma)
  })

  it('should create and read entities via factories', async () => {
    const tenant = await createTenant(prisma, { name: 'Integration Tenant' })
    const user = await createUser(prisma, { tenantId: tenant.id })

    const savedTenant = await prisma.tenant.findUnique({ where: { id: tenant.id } })
    const savedUser = await prisma.user.findUnique({ where: { id: user.id } })

    expect(savedTenant).toBeDefined()
    expect(savedTenant?.name).toBe('Integration Tenant')
    expect(savedUser).toBeDefined()
    expect(savedUser?.tenantId).toBe(tenant.id)
  })

  it('should create an audit event and verify connection', async () => {
    const tenant = await createTenant(prisma)
    const event = await createAuditEvent(prisma, {
      tenantId: tenant.id,
      action: 'TEST_ACTION',
      entityType: 'TEST',
      requestId: 'req-123',
    })

    const savedEvent = await prisma.auditEvent.findUnique({ where: { id: event.id } })
    expect(savedEvent).toBeDefined()
    expect(savedEvent?.action).toBe('TEST_ACTION')
  })

  it('should allow cleanup via truncateAll', async () => {
    await createTenant(prisma)

    // truncateAll is called in beforeEach, so we just need to verify that we are clean now?
    // No, we want to test that truncateAll works.
    // So we create something, call truncateAll manually, and verify empty.

    await createTenant(prisma)
    let count = await prisma.tenant.count()
    expect(count).toBe(1)

    await truncateAll(prisma)
    count = await prisma.tenant.count()
    expect(count).toBe(0)
  })
})
