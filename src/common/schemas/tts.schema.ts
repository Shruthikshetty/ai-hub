import { z } from 'zod'
import { modelSchema } from './model.schema'

// request schema for generating speech from text
export const generateSpeechFromTextRequestSchema = z.object({
  text: z.string().openapi({
    description: 'text to generate speech from',
    example: 'Hello, how are you?'
  }),
  model: modelSchema,
  voice: z.string().optional().openapi({
    description: 'voice to generate speech from',
    example: 'nova'
  }),
  chatId: z.string().optional().openapi({
    description:
      'if provided, audio is saved under chat-attachments/<chatId>/ and linked back to the chat in DB',
    example: '150'
  }),
  messageId: z.string().optional().openapi({
    description:
      'if provided, the media DB record is linked to this message for deduplication on reload',
    example: 'abc-uuid-123'
  })
})

// response schema — audio is always saved to disk; mediaUrl is always returned
export const generateSpeechFromTextResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    mediaUrl: z.string()
  })
})

// extract the type
export type GenerateSpeechFromTextRequestSchemaType = z.infer<
  typeof generateSpeechFromTextRequestSchema
>
export type GenerateSpeechFromTextResponseSchemaType = z.infer<
  typeof generateSpeechFromTextResponseSchema
>
