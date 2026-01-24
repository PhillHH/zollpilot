import { execSync } from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

export const setup = async () => {
  const schema = `test_${uuidv4().replace(/-/g, '_')}`
  process.env.TEST_SCHEMA = schema

  const originalUrl = process.env.DATABASE_URL || ''
  if (!originalUrl) {
    throw new Error('DATABASE_URL is not set')
  }

  // Append schema to connection string
  const urlObj = new URL(originalUrl)
  urlObj.searchParams.set('schema', schema)
  const databaseUrl = urlObj.toString()

  process.env.DATABASE_URL = databaseUrl

  // Create schema
  const prisma = new PrismaClient({ datasources: { db: { url: originalUrl } } })
  await prisma.$executeRawUnsafe(`CREATE SCHEMA "${schema}";`)
  await prisma.$disconnect()

  // Run migrations
  console.log(`Migrating test schema: ${schema}`)
  execSync(`pnpm prisma:migrate:deploy`, {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  })
}
