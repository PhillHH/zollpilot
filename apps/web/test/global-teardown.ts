import { PrismaClient } from '@prisma/client'

export const teardown = async () => {
  const schema = process.env.TEST_SCHEMA
  if (!schema) return

  const originalUrl = process.env.DATABASE_URL || ''
  // Use a connection string without the specific schema param to drop the schema
  // We can just rely on the existing DATABASE_URL env which has the schema,
  // but it's cleaner to connect to the default DB to drop a schema.
  // However, since we overwrote DATABASE_URL in setup, we might need to be careful.
  // Actually, standard postgres connection is fine to drop schema if user has rights.

  console.log(`Dropping test schema: ${schema}`)
  const prisma = new PrismaClient()
  try {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`)
  } catch (error) {
    console.error(`Failed to drop test schema ${schema}:`, error)
  } finally {
    await prisma.$disconnect()
  }
}
