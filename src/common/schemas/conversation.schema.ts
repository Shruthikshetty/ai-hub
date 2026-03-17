import { messagesSchema } from '../db-schemas/message.schema'
import { conversationsSchema } from '../db-schemas/conversation.schema'
import { z } from 'zod'
import { REASONING_OPTIONS } from '../constants/global.constants'

// response schema for fetching all conversations
export const fetchAllConversationsResponseSchema = z.object({
  success: z.boolean(),
  data: conversationsSchema.array()
})

//response for delete a conversation
export const deleteConversationByIdSchema = z.object({
  success: z.boolean(),
  data: conversationsSchema,
  message: z.string()
})

// response to get all messages by conversation
export const getMessagesByConversation = z.object({
  success: z.boolean(),
  data: conversationsSchema.extend({
    messages: z.array(messagesSchema)
  })
})

// response schema for creating a conversation
export const createConversationResponseSchema = z.object({
  success: z.boolean(),
  data: conversationsSchema
})

// response schema for updating a conversation
export const updateConversationResponseSchema = z.object({
  success: z.boolean(),
  data: conversationsSchema
})

//conversation tools options
export const conversationToolsSchema = z.object({
  search: z.boolean().default(false),
  imageGeneration: z.boolean().default(false)
})

// reasoning options
export const reasoningOptionsSchema = z.enum(REASONING_OPTIONS)

// extract types
export type FetchAllConversationsResponseSchemaType = z.infer<
  typeof fetchAllConversationsResponseSchema
>
export type CreateConversationResponseSchemaType = z.infer<typeof createConversationResponseSchema>
export type DeleteConversationResponseType = z.infer<typeof deleteConversationByIdSchema>
export type FetchConversationWithMessagesResponseType = z.infer<typeof getMessagesByConversation>
export type ConversationToolsSchemaType = z.infer<typeof conversationToolsSchema>
export type ReasoningOptionsSchemaType = z.infer<typeof reasoningOptionsSchema>
export type UpdateConversationResponseSchemaType = z.infer<typeof updateConversationResponseSchema>
