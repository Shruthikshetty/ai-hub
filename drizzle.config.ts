import { defineConfig } from 'drizzle-kit'

import env from './env.ts'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/main/db/schema.ts',
  out: './src/main/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL
  }
})
