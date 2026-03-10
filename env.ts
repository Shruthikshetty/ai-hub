// this file provides env in a type safe way

import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

//Load .env in dev mode
expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
  })
)

// Auto-generate ENCRYPTION_KEY in production
// In dev, the key comes from .env. In production (packaged Electron),
// we auto-generate a unique key per install and persist it in userData.
if (!process.env.ENCRYPTION_KEY && process.env.APP_USER_DATA) {
  const keyFilePath = path.join(process.env.APP_USER_DATA, 'encryption.key')
  try {
    if (fs.existsSync(keyFilePath)) {
      process.env.ENCRYPTION_KEY = fs.readFileSync(keyFilePath, 'utf-8').trim()
    } else {
      const generatedKey = crypto.randomBytes(32).toString('hex')
      fs.mkdirSync(path.dirname(keyFilePath), { recursive: true })
      fs.writeFileSync(keyFilePath, generatedKey, { mode: 0o600 })
      process.env.ENCRYPTION_KEY = generatedKey
    }
  } catch (err) {
    console.error('Failed to load/generate encryption key:', err)
  }
}

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.url().default('file:dev.db'),
  ENCRYPTION_KEY: z.string().min(1, { error: 'Encryption key is required' })
})

export type ENV = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)
if (error) {
  console.error('Invalid environment variables: ', error.flatten())
  process.exit(1)
}
//export type safe env
export default env as ENV
