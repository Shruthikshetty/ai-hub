// this file provides env in a type safe way

import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'node:path'
import { z } from 'zod'

//set up env's
expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === 'test' ? '.env.test' : '.env')
  })
)

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.url('').default('file:dev.db')
})

export type ENV = z.infer<typeof EnvSchema>

const { data: env, error } = EnvSchema.safeParse(process.env)
if (error) {
  console.error('Invalid environment variables: ', error.flatten())
  process.exit(1)
}
//export type safe env
export default env as ENV
