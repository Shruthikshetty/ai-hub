/**
 * @file contains all the schemas related to messages
 */
import { z } from 'zod'
import { messagesSchema } from '../db-schemas/message.schema'

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

// metadata schema for message
export const MessageMetadataSchema = z.object({
  tokensPerMessage: z.number().nullish(),
  timeStamp: z.coerce.date().nullish()
})

// define the UI message schema used in the app @TODO type tp be taken from db schema file
export const UIMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    metadata: MessageMetadataSchema.nullish(),
    parts: z.array(MessagePartSchema)
  })
  .loose()

// schema for response of getting a new message by id
export const getMessageByIdResponseSchema = z.object({
  success: z.boolean(),
  data: messagesSchema
})

// schema for response of adding a new message
export const addMessageResponseSchema = z.object({
  success: z.boolean(),
  data: messagesSchema
})

// export the type of the UI message schema
export type AppUIMessage = z.infer<typeof UIMessageSchema>
export type MessagePartsType = z.infer<typeof MessagePartSchema>
export type GetMessageByIdResponseType = z.infer<typeof getMessageByIdResponseSchema>
export type AddMessageResponseType = z.infer<typeof addMessageResponseSchema>
export type MessageMetadataType = z.infer<typeof MessageMetadataSchema>
