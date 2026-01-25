/**
 * Audit Logging Helper
 *
 * Database-backed audit trail for immutable record of all admin actions.
 * Aligned with Prisma AuditEvent model.
 *
 * Usage:
 *   import { logAuditEvent } from '@/server/audit';
 *   await logAuditEvent(prisma, {
 *     tenantId: 'uuid',
 *     action: 'PRICING_UPDATE',
 *     requestId: 'request-uuid',
 *     actorUserId: 'user-uuid',
 *     entityType: 'Pricing',
 *     entityId: 'pricing-uuid',
 *     ipAddress: '192.168.1.1',
 *     userAgent: 'Mozilla/...',
 *     metadata: { oldValue: 100, newValue: 150 }
 *   });
 */

import type { PrismaClient } from '@prisma/client'
import { logger } from './logger'

/**
 * Audit event data
 */
export interface AuditEventData {
  /** Tenant ID (required) */
  tenantId: string
  /** Actor user ID (optional, null for system actions) */
  actorUserId?: string | null
  /** Action name (required, e.g., 'PRICING_UPDATE', 'USER_ROLE_CHANGE') */
  action: string
  /** Entity type (optional, e.g., 'User', 'Pricing') */
  entityType?: string | null
  /** Entity ID (optional, UUID of affected entity) */
  entityId?: string | null
  /** Request ID for correlation (required) */
  requestId: string
  /** Client IP address (optional) */
  ipAddress?: string | null
  /** User agent string (optional) */
  userAgent?: string | null
  /** Additional metadata (optional, must be JSON-serializable) */
  metadata?: Record<string, unknown> | null
}

/**
 * Maximum metadata size (bytes) to prevent database bloat
 */
const MAX_METADATA_SIZE_BYTES = 10000 // 10KB

/**
 * Log an audit event to the database
 *
 * Creates an immutable record in the audit_events table.
 *
 * @param prisma - Prisma client instance
 * @param data - Audit event data
 * @returns Created audit event
 * @throws Error if required fields are missing or metadata is too large
 */
export async function logAuditEvent(
  prisma: PrismaClient,
  data: AuditEventData
) {
  // Validate required fields
  if (!data.tenantId) {
    throw new Error('Audit event validation failed: tenantId is required')
  }

  if (!data.action) {
    throw new Error('Audit event validation failed: action is required')
  }

  if (!data.requestId) {
    throw new Error('Audit event validation failed: requestId is required')
  }

  // Validate metadata size if present
  if (data.metadata) {
    const metadataJson = JSON.stringify(data.metadata)
    const sizeBytes = Buffer.byteLength(metadataJson, 'utf8')

    if (sizeBytes > MAX_METADATA_SIZE_BYTES) {
      throw new Error(
        `Audit event validation failed: metadata exceeds ${MAX_METADATA_SIZE_BYTES} bytes (got ${sizeBytes} bytes). ` +
          'Store large payloads elsewhere and reference by ID.'
      )
    }
  }

  // Create audit event in database
  const auditEvent = await prisma.auditEvent.create({
    data: {
      tenantId: data.tenantId,
      actorUserId: data.actorUserId ?? null,
      action: data.action,
      entityType: data.entityType ?? null,
      entityId: data.entityId ?? null,
      requestId: data.requestId,
      ipAddress: data.ipAddress ?? null,
      userAgent: data.userAgent ?? null,
      metadata: data.metadata ?? null,
    },
  })

  // Emit structured log for observability
  logger.info({
    msg: 'audit_event_created',
    scope: 'audit',
    requestId: data.requestId,
    meta: {
      auditEventId: auditEvent.id,
      tenantId: data.tenantId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
    },
  })

  return auditEvent
}

/**
 * Recommended metadata keys for common actions
 *
 * Use these conventions for consistency across the application.
 */
export const METADATA_KEYS = {
  /** Old value before change */
  OLD_VALUE: 'oldValue',
  /** New value after change */
  NEW_VALUE: 'newValue',
  /** Reason for action */
  REASON: 'reason',
  /** Reference to related entity */
  RELATED_ENTITY_ID: 'relatedEntityId',
  /** Additional notes */
  NOTES: 'notes',
} as const

/**
 * Common action names for audit events
 *
 * Use these conventions for consistency across the application.
 */
export const AUDIT_ACTIONS = {
  // System actions
  SYSTEM_SEED: 'SYSTEM_SEED',
  SYSTEM_MIGRATION: 'SYSTEM_MIGRATION',

  // User management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',

  // Pricing
  PRICING_CREATED: 'PRICING_CREATED',
  PRICING_UPDATED: 'PRICING_UPDATED',
  PRICING_DELETED: 'PRICING_DELETED',

  // Config
  CONFIG_UPDATED: 'CONFIG_UPDATED',

  // Authentication
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
} as const

/**
 * Metadata guidelines for audit events
 *
 * DO store:
 * - Old and new values for changes (use oldValue/newValue keys)
 * - Entity IDs and types
 * - Action reasons
 * - Relevant business context
 *
 * DO NOT store:
 * - Passwords or credentials
 * - Full user objects (only IDs)
 * - Large binary data (store separately, reference by ID)
 * - Sensitive PII without hashing/encryption
 * - Full request/response bodies (store samples or summaries)
 *
 * Size limit: 10KB per metadata object
 */
