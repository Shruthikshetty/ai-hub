import db from './index'
import { users } from './schema'

export async function seed(): Promise<void> {
  try {
    const existingUser = await db.select().from(users).limit(1)

    if (existingUser.length === 0) {
      console.log('Seeding default user...')
      await db.insert(users).values({
        name: 'Default User'
      })
      console.log('Default user seeded successfully')
    } else {
      console.log('User already exists, skipping seed')
    }
  } catch (error) {
    console.error('Seed failed:', error)
    throw error
  }
}

// Allow running the script directly bunx tsx src/main/db/seed.ts
// if (require.main === module) {
//   seed()
//     .then(() => {
//       console.log('Seed execution finished')
//       process.exit(0)
//     })
//     .catch((error) => {
//       console.error('Seed execution completed with errors:', error)
//       process.exit(1)
//     })
// }
