import { describe, it, expect } from 'vitest'
import { GET } from './route'

describe('Health API', () => {
  it('returns status ok', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ status: 'ok' })
  })

  it('returns JSON content type', async () => {
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
