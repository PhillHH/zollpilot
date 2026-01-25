/**
 * Client-Side Logger
 *
 * A lightweight logger for client-side code that provides consistent
 * error handling and can be extended to send logs to a remote service.
 *
 * Usage:
 *   import { clientLogger } from '@/lib/client-logger';
 *   clientLogger.error('Failed to fetch', { error, context: 'declarations' });
 *
 * This is the client-side counterpart to @/server/logger.
 */

export interface ClientLogEntry {
  level: 'error' | 'warn' | 'info'
  msg: string
  context?: string
  error?: unknown
  meta?: Record<string, unknown>
}

class ClientLogger {
  /**
   * Log an error message
   */
  error(
    msg: string,
    data?: { error?: unknown; context?: string; meta?: Record<string, unknown> }
  ): void {
    this.log('error', msg, data)
  }

  /**
   * Log a warning message
   */
  warn(
    msg: string,
    data?: { context?: string; meta?: Record<string, unknown> }
  ): void {
    this.log('warn', msg, data)
  }

  /**
   * Log an informational message
   */
  info(
    msg: string,
    data?: { context?: string; meta?: Record<string, unknown> }
  ): void {
    this.log('info', msg, data)
  }

  /**
   * Internal log method
   * In production, this could be extended to send logs to a remote service.
   */
  private log(
    level: 'error' | 'warn' | 'info',
    msg: string,
    data?: { error?: unknown; context?: string; meta?: Record<string, unknown> }
  ): void {
    // In development, output to console with structured format
    // In production, this could send to a logging service
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod =
        level === 'error'
          ? console.error
          : level === 'warn'
            ? console.warn
            : console.info
      consoleMethod(
        `[${level.toUpperCase()}]`,
        msg,
        data?.error ?? '',
        data?.meta ?? ''
      )
    }
    // In production: suppress console output
    // Future: Could send structured entry to logging service like Sentry, LogRocket
  }
}

/**
 * Global client logger instance
 */
export const clientLogger = new ClientLogger()
