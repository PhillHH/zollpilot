/**
 * Structured Logger (Server-Side Only)
 *
 * Emits JSON line logs with consistent schema for machine parsing.
 * Supports request correlation via requestId field.
 *
 * Usage:
 *   import { logger } from '@/server/logger';
 *   logger.info({ scope: 'api.health', requestId, msg: 'Health check received' });
 *
 * DO NOT import this in client components.
 * DO NOT log secrets (env vars, auth headers, credentials, etc.)
 */

/**
 * Log levels (RFC 5424 Syslog severity levels)
 */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

/**
 * Log entry schema
 */
export interface LogEntry {
  /** ISO 8601 timestamp */
  ts: string
  /** Log level */
  level: LogLevel
  /** Human-readable message */
  msg: string
  /** Scope/namespace (e.g., 'api.health', 'service.user') */
  scope: string
  /** Request correlation ID (from x-request-id header) */
  requestId?: string
  /** Additional structured metadata */
  meta?: Record<string, unknown>
}

/**
 * Structured logger instance
 */
class StructuredLogger {
  /**
   * Log an informational message
   */
  info(data: {
    msg: string
    scope: string
    requestId?: string
    meta?: Record<string, unknown>
  }): void {
    this.log('info', data)
  }

  /**
   * Log a warning message
   */
  warn(data: {
    msg: string
    scope: string
    requestId?: string
    meta?: Record<string, unknown>
  }): void {
    this.log('warn', data)
  }

  /**
   * Log an error message
   */
  error(data: {
    msg: string
    scope: string
    requestId?: string
    meta?: Record<string, unknown>
    error?: Error
  }): void {
    const { error: err, ...rest } = data

    const meta = rest.meta || {}

    // Include error details in meta if present
    if (err) {
      meta.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      }
    }

    this.log('error', { ...rest, meta })
  }

  /**
   * Log a debug message (only in development)
   */
  debug(data: {
    msg: string
    scope: string
    requestId?: string
    meta?: Record<string, unknown>
  }): void {
    // Skip debug logs in production
    if (process.env.NODE_ENV === 'production') {
      return
    }

    this.log('debug', data)
  }

  /**
   * Internal log method - emits JSON to stdout
   */
  private log(
    level: LogLevel,
    data: {
      msg: string
      scope: string
      requestId?: string
      meta?: Record<string, unknown>
    }
  ): void {
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      msg: data.msg,
      scope: data.scope,
      ...(data.requestId && { requestId: data.requestId }),
      ...(data.meta &&
        Object.keys(data.meta).length > 0 && { meta: data.meta }),
    }

    // Emit JSON line to stdout
    console.log(JSON.stringify(entry))
  }
}

/**
 * Global logger instance
 *
 * Import this in server-side code only.
 */
export const logger = new StructuredLogger()

/**
 * Security guardrails for logging
 *
 * DO NOT log:
 * - Environment variables (process.env)
 * - Request headers containing auth tokens (Authorization, Cookie)
 * - Database credentials
 * - API keys or secrets
 * - Full user objects with passwords/emails in plain text
 * - PII (Personal Identifiable Information) without hashing
 *
 * DO log:
 * - Request IDs
 * - Action names
 * - Entity types and IDs (not full entity data)
 * - Timestamps
 * - HTTP status codes
 * - Non-sensitive metadata
 */
