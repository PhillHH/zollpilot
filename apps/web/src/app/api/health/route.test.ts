import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'

describe('Health API', () => {
  it('returns status ok', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })

  it('returns JSON content type', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET(request)

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
