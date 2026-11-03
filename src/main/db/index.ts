// data base connection
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import path from 'node:path'
import * as schema from './schema.js'
// @ts-expect-error - file extension is .ts but tsconfig is NodeNext
import env from '../../../env.ts'

const dbPath =
  process.env.NODE_ENV === 'development'
    ? env.DATABASE_URL
    : process.env.APP_USER_DATA
      ? `file:${path.join(process.env.APP_USER_DATA, 'app.db')}`
      : env.DATABASE_URL

export const client = createClient({
  url: dbPath
})

/**
 * SQLite Concurrency & Performance Optimizations:
 *
 * 1. PRAGMA journal_mode = WAL (Write-Ahead Logging):
 *    - Instead of locking the whole database file on writes, SQLite appends changes
 *      to a companion WAL file.
 *    - https://www.sqlite.org/wal.html
 *
 * 2. PRAGMA synchronous = NORMAL:
 *    - Reduces disk sync overhead by syncing at critical checkpoints instead of
 *      every single disk transaction. faster reads this way
 */
client.execute('PRAGMA journal_mode = WAL;').catch((err) => {
  console.error('[Database] Failed to enable WAL mode:', err)
})
client.execute('PRAGMA synchronous = NORMAL;').catch((err) => {
  console.error('[Database] Failed to set synchronous NORMAL:', err)
})
// reduce checkpoint for personal app
client.execute('PRAGMA wal_autocheckpoint = 100;').catch((err) => {
  console.error('[Database] Failed to set wal_autocheckpoint:', err)
})
// define the data base with schemas
const db = drizzle(client, {
  schema
})

export default db
