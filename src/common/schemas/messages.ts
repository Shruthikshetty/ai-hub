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

// reasoning part schema
export const ReasoningUIPartSchema = z.object({
  type: z.enum(['reasoning']),
  text: z.string(),
  state: z.enum(['streaming', 'done']).optional()
})

// step-start part schema (sent by SDK between tool call rounds)
export const StepStartUIPartSchema = z.object({
  type: z.enum(['step-start'])
})

//added additional parts as required
export const MessagePartSchema = z.discriminatedUnion('type', [
  TextUIPartSchema,
  ReasoningUIPartSchema,
  StepStartUIPartSchema
])

// define the UI message schema used in the app @TODO type tp be taken from db schema file
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
export type MessagePartsType = z.infer<typeof MessagePartSchema>
