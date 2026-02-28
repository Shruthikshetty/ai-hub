import db from './index'
import { users } from './schema'

export async function seed(): Promise<void> {
  try {
    const existingUser = await db.select().from(users).limit(1)

    if (existingUser.length === 0) {
      console.log('Seeding default user...')
      await db.insert(users).values({
        name: 'Default User',
        age: 30,
        city: 'New York'
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
