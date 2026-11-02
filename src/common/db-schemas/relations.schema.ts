/**
 * All the relations between the tables are aggregated here
 */
import { relations } from 'drizzle-orm'
import { conversations } from './conversation.schema'
import { messages } from './message.schema'
import { connectors } from './connector.schema'

// relation one conversation can have multiple messages
export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages)
}))

// relation one message is related to a single conversation
export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id]
  })
}))

// relation one connector is linked to an active conversation
export const connectorsRelations = relations(connectors, ({ one }) => ({
  activeConversation: one(conversations, {
    fields: [connectors.activeConversationId],
    references: [conversations.id]
  })
}))
