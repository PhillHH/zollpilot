import { PrismaClient } from '@prisma/client'

export async function truncateAll(prisma: PrismaClient) {
  const tableNames = ['AuditEvent', 'User', 'Tenant']

  for (const tableName of tableNames) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`)
  }
}
