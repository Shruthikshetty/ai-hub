/**
 * @file contains the connectors schema with zod validation
 */
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { conversations } from './conversation.schema'

export const connectors = sqliteTable('connectors', {
  name: text('name').primaryKey(), // name of the connection  telegram , discord etc ...
  displayName: text('display_name').default(''),
  description: text('description').default(''),
  botToken: text('bot_token').notNull(),
  allowedUsers: text('allowed_users', { mode: 'json' }).$type<string[]>().default([]), // userid's that are allowed to access the bot
  activeConversationId: integer('active_conversation_id').references(() => conversations.id, {
    onDelete: 'set null'
  }),
  modelId: text('model-id').notNull(), // can not be pre configured , due to multi provider set but is mandatory before turn on
  provider: text('provider').notNull(),
  systemPrompt: text('system-prompt').default(
    'You are a helpful, concise AI assistant. Format your replies with clean markdown suitable for Telegram mobile screens.'
  ),
  autoStart: integer('auto_start', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// Validation schemas
export const connectorSelectSchema = createSelectSchema(connectors, {
  name: (field) => field.max(150),
  activeConversationId: (field) => field.nullish().default(null)
}).omit({
  createdAt: true,
  updatedAt: true
})

export const connectorInsertSchema = createInsertSchema(connectors)

export const connectorUpdateSchema = connectorSelectSchema.partial().omit({
  name: true
})

//export types
export type ConnectorGetSchema = z.infer<typeof connectorSelectSchema>
export type ConnectorCreateSchema = z.infer<typeof connectorInsertSchema>
export type ConnectorUpdateSchema = z.infer<typeof connectorUpdateSchema>
