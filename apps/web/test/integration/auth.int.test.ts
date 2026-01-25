import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { register } from '../../src/actions/register'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('Auth Integration', () => {
  const testEmail = `auth-test-${Date.now()}@example.com`
  const testPassword = 'password123'
  let createdTenantId: string

  afterAll(async () => {
    if (createdTenantId) {
       try {
         await prisma.tenant.delete({ where: { id: createdTenantId } })
       } catch (e) {
       }
    }
    await prisma.$disconnect()
  })

  it('should register a new user and create a tenant', async () => {
    const result = await register({
      email: testEmail,
      password: testPassword,
    })

    expect(result).toEqual({ success: 'User created!' })

    const user = await prisma.user.findFirst({
      where: { email: testEmail },
      include: { tenant: true },
    })

    expect(user).toBeDefined()
    expect(user?.email).toBe(testEmail)
    expect(user?.role).toBe('ADMIN')
    expect(user?.tenant).toBeDefined()
    expect(user?.tenant.name).toBe('My Workspace')

    createdTenantId = user!.tenantId

    const isValid = await bcrypt.compare(testPassword, user!.passwordHash!)
    expect(isValid).toBe(true)
  })

  it('should prevent duplicate registration', async () => {
     const result = await register({
      email: testEmail,
      password: testPassword,
    })

    expect(result).toEqual({ error: 'Email already in use!' })
  })
})
