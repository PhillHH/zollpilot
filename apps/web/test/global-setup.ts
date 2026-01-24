/**
 * Global Setup for Integration Tests
 *
 * This file runs once before all integration tests.
 * It creates a unique Postgres schema for this test run and applies migrations.
 * This ensures test isolation and prevents conflicts with dev data.
 */

import { execSync } from 'child_process'
import { resolve } from 'path'
import { config } from 'dotenv'

export default async function globalSetup() {
  console.log('🔧 Setting up integration test environment...')

  // Load .env from project root (two levels up from apps/web)
  const envPath = resolve(__dirname, '../../../.env')
  config({ path: envPath })

  // Generate unique schema name for this test run
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  const testSchema = `test_${timestamp}_${randomSuffix}`

  console.log(`  ├─ Test schema: ${testSchema}`)

  // Get base DATABASE_URL from environment
  const baseDatabaseUrl = process.env.DATABASE_URL
  if (!baseDatabaseUrl) {
    throw new Error(
      'DATABASE_URL not set. Please run `pnpm db:up` and ensure .env exists.'
    )
  }

  // Append schema to DATABASE_URL
  // Handle existing query params safely
  const url = new URL(baseDatabaseUrl)
  url.searchParams.set('schema', testSchema)
  const testDatabaseUrl = url.toString()

  // Get base URL without query params for psql command
  // psql doesn't understand the ?schema= parameter
  const baseUrl = new URL(baseDatabaseUrl)
  baseUrl.search = '' // Remove all query parameters
  const psqlUrl = baseUrl.toString()

  // Set DATABASE_URL for test process
  process.env.DATABASE_URL = testDatabaseUrl
  process.env.TEST_SCHEMA = testSchema

  console.log(`  ├─ Database URL configured for test schema`)

  try {
    // Create schema
    console.log(`  ├─ Creating schema...`)
    execSync(
      `psql "${psqlUrl}" -c "CREATE SCHEMA IF NOT EXISTS \\"${testSchema}\\";"`,
      {
        stdio: 'pipe',
        env: process.env,
      }
    )
    console.log(`  ├─ ✓ Schema created`)

    // Run migrations using prisma migrate deploy
    console.log(`  ├─ Running migrations...`)
    execSync('pnpm prisma:migrate:deploy', {
      stdio: 'inherit',
      env: process.env,
      cwd: __dirname + '/..',
    })
    console.log(`  ├─ ✓ Migrations applied`)

    console.log(`  └─ ✅ Integration test environment ready`)
  } catch (error) {
    console.error(`  └─ ❌ Failed to set up test environment:`, error)
    throw error
  }

  // Return teardown function for Vitest 4
  return async () => {
    console.log('🧹 Cleaning up integration test environment...')

    const testSchema = process.env.TEST_SCHEMA

    if (!testSchema) {
      console.log('  └─ No test schema found, skipping cleanup')
      return
    }

    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.log('  └─ No DATABASE_URL found, skipping cleanup')
      return
    }

    // Get base URL without query params for psql command
    const baseUrl = new URL(databaseUrl)
    baseUrl.search = '' // Remove all query parameters
    const psqlUrl = baseUrl.toString()

    try {
      console.log(`  ├─ Dropping schema: ${testSchema}`)
      execSync(
        `psql "${psqlUrl}" -c "DROP SCHEMA IF EXISTS \\"${testSchema}\\" CASCADE;"`,
        {
          stdio: 'pipe',
          env: process.env,
        }
      )
      console.log(`  └─ ✅ Test schema dropped successfully`)
    } catch (error) {
      // Best-effort cleanup - don't fail teardown
      console.warn(`  └─ ⚠️  Failed to drop schema (non-fatal):`, error)
    }
  }
}
