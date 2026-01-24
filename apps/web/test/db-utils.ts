/**
 * Database Utilities for Integration Tests
 *
 * Provides helper functions for managing test database state.
 * Works with schema-per-run isolation strategy.
 */

import { PrismaClient } from '@prisma/client'

/**
 * Truncates all tables in the test database schema.
 * Uses CASCADE to handle foreign key dependencies automatically.
 *
 * IMPORTANT: This runs TRUNCATE directly using $executeRawUnsafe.
 * Safe for tests as each test run uses an isolated schema.
 *
 * @param prisma - Prisma client instance (configured with test schema)
 */
export async function truncateAll(prisma: PrismaClient): Promise<void> {
  // TRUNCATE all tables with CASCADE to handle foreign keys
  // Order doesn't matter with CASCADE, but listing explicitly for clarity
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "AuditEvent", "User", "Tenant" CASCADE;
  `)
}
