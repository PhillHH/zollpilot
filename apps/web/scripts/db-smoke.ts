/**
 * Database Smoke Test
 *
 * This script performs a basic connectivity test to verify the database
 * is accessible and responding. It's useful for CI/CD pipelines and
 * local development verification.
 *
 * Usage: pnpm db:smoke
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function smokeTest() {
  try {
    console.log('🔍 Running database smoke test...')

    // Test 1: Basic connectivity (SELECT 1)
    console.log('  ├─ Testing database connectivity...')
    await prisma.$queryRaw`SELECT 1 as result`
    console.log('  ├─ ✓ Database connection successful')

    // Test 2: Verify Prisma can query the schema
    console.log('  ├─ Querying tenants table...')
    const tenantCount = await prisma.tenant.count()
    console.log(`  ├─ ✓ Found ${tenantCount} tenant(s)`)

    // Test 3: Verify Prisma can query users
    console.log('  ├─ Querying users table...')
    const userCount = await prisma.user.count()
    console.log(`  ├─ ✓ Found ${userCount} user(s)`)

    // Test 4: Verify audit events table
    console.log('  ├─ Querying audit events table...')
    const auditCount = await prisma.auditEvent.count()
    console.log(`  ├─ ✓ Found ${auditCount} audit event(s)`)

    console.log('  └─ ✅ All smoke tests passed!')
    process.exit(0)
  } catch (error) {
    console.error('  └─ ❌ Smoke test failed:')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

smokeTest()
