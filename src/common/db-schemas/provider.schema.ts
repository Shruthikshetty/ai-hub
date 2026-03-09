/**
 * this @file contains providers table  with zod validation schema
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

//tables -------->

//providers table
export const providers = sqliteTable('providers', {
  id: integer().primaryKey({ autoIncrement: true }),
  provider: text().unique(),
  name: text(),
  apiKey: text(),
  description: text(),
  icon: text(),
  enabled: integer({ mode: 'boolean' }).default(false),
  server: integer({ mode: 'boolean' }).default(false),
  serverUrl: text(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// schemas ------->

// zod schema for selecting from provider
export const providersGetSchema = createSelectSchema(providers)
// zod schema for inserting provider
export const providersInsertSchema = createInsertSchema(providers, {
  provider: (field) => field.max(255).nullish(),
  apiKey: (field) => field.max(10000).nullish(),
  description: (field) => field.max(5000).nullish(),
  serverUrl: (field) => field.max(1000).nullish(),
  name: (field) => field.max(255).nullish()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
// zod schema for updating the provider table
export const providerPatchSchema = providersInsertSchema.partial()

//export types
export type ProviderGetSchema = z.infer<typeof providersGetSchema>
export type ProviderPatchSchema = z.infer<typeof providersInsertSchema>
