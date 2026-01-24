import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Health Check API
 *
 * Smoke tests for the health check endpoint.
 * Uses Playwright's request fixture to test API directly.
 */

test.describe('Health Check API', () => {
  test('should return 200 OK from /api/health', async ({ request }) => {
    const response = await request.get('/api/health')

    // Check status code
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
  })

  test('should return JSON with status "ok"', async ({ request }) => {
    const response = await request.get('/api/health')

    // Check content type
    expect(response.headers()['content-type']).toContain('application/json')

    // Parse and verify JSON body
    const body = await response.json()
    expect(body).toHaveProperty('status', 'ok')
  })

  test('should be accessible without authentication', async ({ request }) => {
    // Health check should be public - no auth required
    const response = await request.get('/api/health')

    // Should not return 401 or 403
    expect(response.status()).not.toBe(401)
    expect(response.status()).not.toBe(403)
    expect(response.status()).toBe(200)
  })

  test('should return security headers (Phase 0.11)', async ({ request }) => {
    const response = await request.get('/api/health')
    const headers = response.headers()

    // X-Content-Type-Options: Prevent MIME sniffing
    expect(headers['x-content-type-options']).toBe('nosniff')

    // X-Frame-Options: Prevent clickjacking
    expect(headers['x-frame-options']).toBe('DENY')

    // Referrer-Policy: Control referrer information
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')

    // Permissions-Policy: Disable sensitive APIs
    expect(headers['permissions-policy']).toBeDefined()
    expect(headers['permissions-policy']).toContain('camera=()')
    expect(headers['permissions-policy']).toContain('microphone=()')

    // X-DNS-Prefetch-Control: Prevent DNS prefetching
    expect(headers['x-dns-prefetch-control']).toBe('off')

    // Ensure X-Powered-By is not present (security through obscurity)
    expect(headers['x-powered-by']).toBeUndefined()

    // Note: Strict-Transport-Security (HSTS) only in production
    // Not tested here as E2E runs in non-production mode
  })
})
