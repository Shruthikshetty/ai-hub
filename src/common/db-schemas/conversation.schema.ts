/**
 * @file contains the conversation schema with zod validation
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

//tables ----------->
//@TODO setting or option will be later added
export const conversations = sqliteTable('conversations', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().default('New Chat'),
  modelId: text().notNull(), // current selected model
  provider: text().notNull(), //  current selected provider
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// zod schema for inserting conversation
export const conversationsInsertSchema = createInsertSchema(conversations, {
  provider: (field) => field.max(255),
  modelId: (field) => field,
  title: (field) => field.default('New Chat')
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

// schemas ------------>

//zod schema for getting conversations
export const conversationsSchema = createSelectSchema(conversations)

// export types
export type ConversationsGetSchema = z.infer<typeof conversationsSchema>
export type ConversationAddSchema = z.infer<typeof conversationsInsertSchema>
