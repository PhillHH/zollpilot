import { PrismaClient } from '@prisma/client'
import { logAuditEvent, AUDIT_ACTIONS } from '../src/server/audit'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'ZollPilot Demo',
    },
  })

  console.log(`✓ Created tenant: ${tenant.name} (${tenant.id})`)

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@local.test',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@local.test',
      role: 'ADMIN' as const,
    },
  })

  console.log(`✓ Created admin user: ${adminUser.email} (${adminUser.id})`)

  // Log audit event using helper (demonstrates proper usage)
  const auditEvent = await logAuditEvent(prisma, {
    tenantId: tenant.id,
    actorUserId: adminUser.id,
    action: AUDIT_ACTIONS.SYSTEM_SEED,
    entityType: 'Database',
    requestId: 'seed-' + Date.now(),
    ipAddress: '127.0.0.1',
    userAgent: 'Prisma Seed Script',
    metadata: {
      message: 'Initial database seed completed',
      timestamp: new Date().toISOString(),
    },
  })

  console.log(`✓ Created initial audit event (${auditEvent.id})`)

  console.log('✅ Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
