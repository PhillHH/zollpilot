import { PrismaClient, UserRole } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

export const createTenant = async (prisma: PrismaClient, overrides = {}) => {
  return prisma.tenant.create({
    data: {
      name: `Test Tenant ${uuidv4()}`,
      ...overrides,
    },
  })
}

export const createUser = async (
  prisma: PrismaClient,
  overrides: { tenantId: string; role?: UserRole; email?: string },
) => {
  return prisma.user.create({
    data: {
      tenantId: overrides.tenantId,
      email: overrides.email || `user-${uuidv4()}@test.com`,
      role: overrides.role || UserRole.USER,
    },
  })
}

export const createAuditEvent = async (
  prisma: PrismaClient,
  overrides: {
    tenantId: string
    action: string
    entityType: string
    requestId: string
    actorUserId?: string
    meta?: any
  },
) => {
  return prisma.auditEvent.create({
    data: {
      tenantId: overrides.tenantId,
      action: overrides.action,
      entityType: overrides.entityType,
      requestId: overrides.requestId,
      actorUserId: overrides.actorUserId,
      meta: overrides.meta || {},
    },
  })
}
