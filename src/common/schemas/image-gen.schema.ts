import { z } from 'zod'
import { modelSchema } from './model.schema'

// generate image request schema
export const generateImageRequestSchema = z.object({
  prompt: z.string(),
  model: modelSchema
})

// generate image response schema
export const generateImageResponseSchema = z.object({
  imageUrl: z.string(),
  success: z.boolean()
})

// extract the type
export type GenerateImageRequestSchemaType = z.infer<typeof generateImageRequestSchema>
export type GenerateImageResponseSchemaType = z.infer<typeof generateImageResponseSchema>
