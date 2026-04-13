import { z } from 'zod'

// request schema for generating speech from text
export const generateSpeechFromTextRequestSchema = z.object({
  text: z.string().openapi({
    description: 'text to generate speech from',
    example: 'Hello, how are you?'
  }),
  chatId: z.string().optional().openapi({
    description:
      'if provided, audio is saved to disk under chat-audio/<chatId>/ and a mediaUrl is returned instead of base64',
    example: 'abc-123'
  })
})

// response schema for generating speech from text
export const generateSpeechFromTextResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    mediaUrl: z.string().optional(),
    base64: z.string().optional(),
    mimeType: z.string().optional()
  })
})

// extract the type
export type GenerateSpeechFromTextRequestSchemaType = z.infer<
  typeof generateSpeechFromTextRequestSchema
>
export type GenerateSpeechFromTextResponseSchemaType = z.infer<
  typeof generateSpeechFromTextResponseSchema
>
