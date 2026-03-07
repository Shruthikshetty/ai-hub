/**
 * @file Shared user table schema + Zod validation schemas.
 * Used by both the main process (DB operations, route validation) and the renderer (form validation).
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  email: text('email'),
  age: integer('age'),
  city: text('city'),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// zod schema for selecting from the users table
export const usersGetSchema = createSelectSchema(users)

// zod schema for inserting into the users table
export const usersInsertSchema = createInsertSchema(users, {
  name: (field) => field.min(3).max(255).nullish(),
  age: (field) => field.int().min(1).max(120).nullish(),
  city: (field) => field.min(1).max(255).nullish(),
  email: (field) => field.email().nullish(),
  image: (field) => field.min(1).nullish()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// zod schema for updating the users table
export const userPatchSchema = usersInsertSchema.partial()

// export type
export type UserPatchSchema = z.input<typeof userPatchSchema>
export type UserGetSchema = z.input<typeof usersGetSchema>
