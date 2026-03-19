import db from './index'
import { users, providers } from './schema'
import { AVAILABLE_PROVIDERS_DEFAULT_DETAILS } from '../../common/constants/global.constants'

export async function seed(): Promise<void> {
  try {
    const existingUser = await db.select().from(users).limit(1)

    //seed default user
    if (existingUser.length === 0) {
      console.log('Seeding default user...')
      await db.insert(users).values({
        name: 'Default User'
      })
      console.log('Default user seeded successfully')
    } else {
      console.log('User already exists, skipping seed')
    }

    // seed providers
    const existingProviders = await db.select().from(providers).limit(1)

    if (existingProviders.length === 0) {
      console.log('Seeding default providers...')
      await db.insert(providers).values(AVAILABLE_PROVIDERS_DEFAULT_DETAILS)
      console.log('Default providers seeded successfully')
    } else {
      console.log('Providers already exist, skipping seed')
    }
  } catch (error) {
    console.error('Seed failed:', error)
    throw error
  }
}

//Allow running the script directly bunx tsx src/main/db/seed.ts
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
