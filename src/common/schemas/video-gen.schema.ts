import { z } from 'zod'
import { modelSchema } from './model.schema'

// generate video request schema
export const generateVideoRequestSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
  model: modelSchema
})

// generate video response schema
export const generateVideoResponseSchema = z.object({
  videoUrl: z.string(),
  success: z.boolean()
})

// delete video response schema
export const deleteVideoResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

// extract the type
export type GenerateVideoRequestSchemaType = z.infer<typeof generateVideoRequestSchema>
export type GenerateVideoResponseSchemaType = z.infer<typeof generateVideoResponseSchema>
export type DeleteVideoResponseSchemaType = z.infer<typeof deleteVideoResponseSchema>
