// data base connection
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import path from 'node:path'
import * as schema from './schema.js'
// @ts-expect-error - file extension is .ts but tsconfig is NodeNext
import env from '../../../env.ts'

const dbPath = process.env.APP_USER_DATA
  ? `file:${path.join(process.env.APP_USER_DATA, 'app.db')}`
  : env.DATABASE_URL

export const client = createClient({
  url: dbPath
})
// define the data base with schemas
const db = drizzle(client, {
  schema
})

export default db
