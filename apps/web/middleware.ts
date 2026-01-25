/**
 * Next.js Middleware for Request ID Propagation
 *
 * Ensures every request has a unique x-request-id header for correlation
 * across logs, audit events, and distributed traces.
 *
 * Behavior:
 * - Reads incoming x-request-id header
 * - Generates crypto.randomUUID() if missing
 * - Sets x-request-id on response for client correlation
 * - Applied to all routes (pages and API)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

export function middleware(request: NextRequest) {
  // Read incoming request ID or generate new one
  const requestId = request.headers.get('x-request-id') || randomUUID()

  // Clone the request headers to add the request ID
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)

  // Create response with modified request headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Set request ID on response for client correlation
  response.headers.set('x-request-id', requestId)

  return response
}

/**
 * Middleware configuration
 *
 * Apply to all routes except static files and Next.js internals
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
