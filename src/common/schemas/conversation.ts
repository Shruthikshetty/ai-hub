import { conversationsSchema } from '../db-schemas/conversation.schema'
import { z } from 'zod'

// response schema for fetching all conversations
export const fetchAllConversationsResponseSchema = z.object({
  success: z.boolean(),
  data: conversationsSchema.array()
})

// extract the type
export type FetchAllConversationsResponseSchemaType = z.infer<
  typeof fetchAllConversationsResponseSchema
>
