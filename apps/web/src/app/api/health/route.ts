import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/server/logger'

export async function GET(request: NextRequest) {
  // Read request ID from header (set by middleware)
  const requestId = request.headers.get('x-request-id') || undefined

  // Emit structured log event
  logger.info({
    msg: 'health_check',
    scope: 'api.health',
    requestId,
  })

  // Response body remains exactly as before
  return NextResponse.json({ status: 'ok' })
}
