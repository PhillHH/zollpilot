import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tenantName = 'ZollPilot Demo'
  const userEmail = 'admin@local.test'

  let tenant = await prisma.tenant.findFirst({
    where: { name: tenantName }
  })

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: tenantName
      }
    })
    console.log(`Created tenant: ${tenant.name}`)
  } else {
    console.log(`Tenant already exists: ${tenant.name}`)
  }

  const user = await prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: userEmail
      }
    }
  })

  if (!user) {
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: userEmail,
        role: UserRole.ADMIN
      }
    })
    console.log(`Created user: ${userEmail}`)
  } else {
    console.log(`User already exists: ${userEmail}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
