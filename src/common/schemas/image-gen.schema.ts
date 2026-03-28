import { z } from 'zod'
import { modelSchema } from './model.schema'

// generate image request schema
export const generateImageRequestSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
  model: modelSchema
})

// generate image response schema
export const generateImageResponseSchema = z.object({
  imageUrl: z.string(),
  success: z.boolean()
})

// delete image response schema
export const deleteImageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

// extract the type
export type GenerateImageRequestSchemaType = z.infer<typeof generateImageRequestSchema>
export type GenerateImageResponseSchemaType = z.infer<typeof generateImageResponseSchema>
export type DeleteImageResponseSchemaType = z.infer<typeof deleteImageResponseSchema>
