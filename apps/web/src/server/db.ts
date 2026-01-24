/**
 * Prisma Client Singleton
 *
 * This file provides a singleton instance of PrismaClient to avoid
 * creating multiple instances during Next.js hot reloading in development.
 *
 * In production, a single instance is created and reused.
 * In development, the instance is attached to the global object to persist
 * across hot module reloads.
 */

import { PrismaClient } from '@prisma/client'
import { env, isDevelopment, isProduction } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  })

if (!isProduction) {
  globalForPrisma.prisma = prisma
}

/**
 * Helper function to safely disconnect Prisma in edge environments
 * or when running tests.
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
