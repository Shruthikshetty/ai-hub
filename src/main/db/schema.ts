/**
 * @file contains all our table schemas
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// table schemas go here

// user table schema
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  city: text('city').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// zod schemas go here

// create a zod schema for the users table
export const usersGetSchema = createSelectSchema(users)

// create a zod schema for inserting into the users table
export const usersInsertSchema = createInsertSchema(users, {
  name: (field) => field.min(3).max(255),
  age: (field) => field.min(1).max(120),
  city: (field) => field.min(1).max(255)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// zod schema for updating the users table
export const userPatchSchema = usersInsertSchema.partial()
