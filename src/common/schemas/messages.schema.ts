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

// file ui part schema
export const FileUIPartSchema = z.object({
  type: z.literal('file'),
  mediaType: z.string(),
  filename: z.string().optional(),
  providerMetadata: z.any().optional(),
  url: z.string()
})

// The base invocation states matching your UIToolInvocation type
const ToolInvocationBase = z.object({
  toolCallId: z.string(),
  title: z.string().optional(),
  providerExecuted: z.boolean().optional()
})

// profile tool output schema
export const ProfileToolOutputSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    age: z.number(),
    city: z.string(),
    image: z.string()
  })
  .partial()

// tool state schema
const ToolStateSchema = z.discriminatedUnion('state', [
  z.object({ state: z.literal('input-streaming'), input: z.any() }),
  z.object({ state: z.literal('input-available'), input: z.any() }),
  z.object({
    state: z.literal('approval-requested'),
    input: z.any(),
    approval: z.any()
  }),
  z.object({
    state: z.literal('approval-responded'),
    input: z.any(),
    approval: z.any()
  }),
  z.object({
    state: z.literal('output-available'),
    input: z.any(),
    output: z.any()
  }),
  z.object({ state: z.literal('output-error'), input: z.any(), errorText: z.string() }),
  z.object({ state: z.literal('output-denied'), input: z.any(), approval: z.any() })
])

// search tool schema
const SearchToolSchema = ToolInvocationBase.extend({
  type: z.literal('tool-search')
}).and(ToolStateSchema)

// profile access tool schema
const ProfileAccessToolSchema = ToolInvocationBase.extend({
  type: z.literal('tool-profile')
}).and(ToolStateSchema)

//image tool
const ImageToolSchema = ToolInvocationBase.extend({
  type: z.literal('tool-img_gen')
}).and(ToolStateSchema)

//added additional parts as required
export const MessagePartSchema = z.union([
  TextUIPartSchema,
  ReasoningUIPartSchema,
  StepStartUIPartSchema,
  FileUIPartSchema,
  SearchToolSchema,
  ProfileAccessToolSchema,
  ImageToolSchema
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
    parts: z.any()
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
export type ToolInvocationType = z.infer<typeof ToolInvocationBase>
export type ProfileToolOutputSchemaType = z.infer<typeof ProfileToolOutputSchema>
