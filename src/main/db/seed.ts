import db from './index'
import { users, providers } from './schema'
import { AVAILABLE_PROVIDERS_DEFAULT_DETAILS } from '../../common/constants/global.constants'
import { count } from 'drizzle-orm'

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
    const [{ providerCount }] = await db.select({ providerCount: count() }).from(providers)

    if (providerCount === AVAILABLE_PROVIDERS_DEFAULT_DETAILS.length) {
      console.log('Providers up to date, skipping seed')
    } else {
      console.log('Syncing providers...')
      for (const provider of AVAILABLE_PROVIDERS_DEFAULT_DETAILS) {
        await db.insert(providers).values(provider).onConflictDoNothing()
      }
      console.log('Providers synced successfully')
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
