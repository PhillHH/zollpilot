/**
 * Global Teardown for Integration Tests
 *
 * This file runs once after all integration tests complete.
 * It drops the test schema created during setup.
 * Uses best-effort approach - doesn't fail if schema doesn't exist.
 */

import { execSync } from 'child_process'

export default async function globalTeardown() {
  console.log('🧹 Cleaning up integration test environment...')

  const testSchema = process.env.TEST_SCHEMA

  if (!testSchema) {
    console.log('  └─ No test schema found, skipping cleanup')
    return
  }

  const baseDatabaseUrl = process.env.DATABASE_URL?.split('?')[0]

  if (!baseDatabaseUrl) {
    console.log('  └─ No DATABASE_URL found, skipping cleanup')
    return
  }

  try {
    console.log(`  ├─ Dropping schema: ${testSchema}`)
    execSync(
      `psql "${baseDatabaseUrl}" -c "DROP SCHEMA IF EXISTS \\"${testSchema}\\" CASCADE;"`,
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
