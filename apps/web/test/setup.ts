/**
 * Test Setup
 *
 * This file runs before each test file in integration tests.
 * Currently minimal - can be extended with common test utilities.
 */

// Make DATABASE_URL available to tests
// (set by global-setup.ts)
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL not set in test environment. Global setup may have failed.'
  )
}
