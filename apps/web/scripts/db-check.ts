import { db } from '../src/server/db'

async function main() {
  try {
    console.log('Connecting to database...')
    const result = await db.$queryRaw`SELECT 1`
    console.log('Database connection successful:', result)
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
