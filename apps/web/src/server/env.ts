/**
 * Environment Variable Validation
 *
 * Provides type-safe, validated access to environment variables.
 * All environment variables MUST be accessed through this module
 * to ensure fail-fast behavior on misconfiguration.
 *
 * Usage:
 *   import { env } from '@/server/env';
 *   const dbUrl = env.DATABASE_URL;
 *
 * DO NOT use process.env directly in application code.
 */

import { z } from 'zod'

/**
 * Environment variable schema
 *
 * Add all required environment variables here with appropriate validation.
 * This ensures the application fails immediately on startup if
 * critical configuration is missing or invalid.
 */
const envSchema = z.object({
  /**
   * Node environment (development, test, production)
   */
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  /**
   * PostgreSQL connection string
   * Required for database operations
   *
   * Format: postgresql://user:password@host:port/database?schema=public
   */
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (url) => url.startsWith('postgresql://'),
      'DATABASE_URL must be a valid PostgreSQL connection string'
    ),

  /**
   * Next.js runtime environment
   * Automatically set by Next.js framework
   */
  NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
})

/**
 * Validated environment variables
 *
 * This object is initialized on module load. If validation fails,
 * the application will crash with a clear error message indicating
 * which environment variables are missing or invalid.
 */
export const env = parseEnv()

/**
 * Type of validated environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 *
 * @throws {ZodError} If validation fails, with detailed error messages
 * @returns Validated environment variables
 */
function parseEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      const missingVars = zodError.issues
        .map((issue) => {
          const path = issue.path.join('.')
          const message = issue.message
          return `  - ${path}: ${message}`
        })
        .join('\n')

      console.error('❌ Environment validation failed:\n')
      console.error(missingVars)
      console.error('\n💡 Required environment variables:')
      console.error('  - DATABASE_URL: PostgreSQL connection string')
      console.error(
        '  - NODE_ENV: development | test | production (optional, defaults to development)'
      )
      console.error('\n📝 See docs/SETUP.md for configuration instructions\n')

      throw new Error(
        'Environment validation failed. Check logs above for details.'
      )
    }
    throw error
  }
}

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production'

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development'

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === 'test'
