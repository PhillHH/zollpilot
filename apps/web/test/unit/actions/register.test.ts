import { describe, it, expect, vi, beforeEach } from 'vitest'
import { register } from '../../../src/actions/register'
import { prisma } from '../../../src/server/db'
import bcrypt from 'bcryptjs'

vi.mock('@/server/db', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    tenant: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('Register Action (Unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register successfully', async () => {
    vi.mocked(prisma.user.findFirst).mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password' as any)

    const mockTx = {
      user: { create: vi.fn() },
      tenant: { create: vi.fn() },
    }
    vi.mocked(prisma.$transaction).mockImplementation(async (cb: any) => cb(mockTx))

    mockTx.tenant.create.mockResolvedValue({ id: 'tenant-123', name: 'My Workspace' })
    mockTx.user.create.mockResolvedValue({ id: 'user-123' })

    const result = await register({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ success: 'User created!' })
    expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 'test@example.com' } })
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)

    expect(mockTx.tenant.create).toHaveBeenCalledWith({
        data: { name: 'My Workspace' }
    })

    expect(mockTx.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        tenantId: 'tenant-123',
        role: 'ADMIN',
        name: 'test',
      },
    })
  })

  it('should fail if email exists', async () => {
     vi.mocked(prisma.user.findFirst).mockResolvedValue({ id: 'existing' } as any)

     const result = await register({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result).toEqual({ error: 'Email already in use!' })
  })
})
