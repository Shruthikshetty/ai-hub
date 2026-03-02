/**
 * @file contains all the schemas related to messages
 */
import { z } from 'zod'

// text part schema
export const TextUIPartSchema = z.object({
  type: z.enum(['text']),
  text: z.string(),
  state: z.enum(['streaming', 'done']).optional()
})

//TODO will be extended later as per use
export const MessagePartSchema = z.discriminatedUnion('type', [TextUIPartSchema])

// define the UI message schema used in the app
export const UIMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    metadata: z.any().optional(), // will be modified later,
    parts: z.array(MessagePartSchema)
  })
  .loose()

// export the type of the UI message schema
export type AppUIMessage = z.infer<typeof UIMessageSchema>
