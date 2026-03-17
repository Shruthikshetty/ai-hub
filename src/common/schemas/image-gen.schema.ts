import { z } from 'zod'
import { modelSchema } from './model.schema'

// generate image request schema
export const generateImageRequestSchema = z.object({
  prompt: z.string(),
  model: modelSchema
})

// generate image response schema
export const generateImageResponseSchema = z.object({
  imageUrl: z.string()
})

// extract the type
export type generateImageRequestSchemaType = z.infer<typeof generateImageRequestSchema>
export type generateImageResponseSchemaType = z.infer<typeof generateImageResponseSchema>
