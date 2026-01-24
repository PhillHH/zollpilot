import { test, expect } from '@playwright/test'

test('should return 200 OK from health check', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)

  const body = await response.json()
  expect(body).toEqual({ status: 'ok' })
})
