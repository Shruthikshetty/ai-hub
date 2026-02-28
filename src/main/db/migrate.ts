import { migrate } from 'drizzle-orm/libsql/migrator'
import path from 'node:path'
import db from './index'

export async function runMigrations(): Promise<void> {
  if (!process.env.APP_RESOURCES_PATH) {
    throw new Error('APP_RESOURCES_PATH is not set; cannot locate migrations folder')
  }
  const migrationsFolder = path.join(process.env.APP_RESOURCES_PATH, 'migrations')

  console.log(`Running migrations from ${migrationsFolder}`)

  try {
    await migrate(db, { migrationsFolder })
    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}
