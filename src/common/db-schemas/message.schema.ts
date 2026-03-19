/**
 * @file contains the message schema with zod validation
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { MessageMetadataType, MessagePartsType } from '../schemas/messages.schema'
import { conversations } from './conversation.schema'

// create a message table
export const messages = sqliteTable('message', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: text({ enum: ['user', 'assistant', 'system'] }).notNull(),
  metadata: text({ mode: 'json' }).$type<MessageMetadataType>().default({}),
  parts: text({ mode: 'json' }).$type<MessagePartsType[]>().notNull(),
  conversationId: integer()
    .references(() => conversations.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

// zod schema for getting messages
export const messagesSchema = createSelectSchema(messages)
// zod schema for inserting messages
export const messagesInsertSchema = createInsertSchema(messages).omit({
  createdAt: true
})

// export types
export type MessagesGetSchema = z.infer<typeof messagesSchema>
export type MessagesAddSchema = z.infer<typeof messagesInsertSchema>
