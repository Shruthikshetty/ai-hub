import { z } from 'zod'
import { modelSchema } from './model.schema'
import { IMAGE_GEN_SEED_LIMITS } from '../constants/image-gen.constants'

// generate image request schema
export const generateImageRequestSchema = z.object({
  prompt: z.string().trim().min(1, 'Prompt is required'),
  model: modelSchema,
  size: z
    .string()
    .regex(/^\d+x\d+$/, 'Size must be in the format of numberxnumber')
    .transform((val) => val as `${number}x${number}`)
    .optional(),
  aspectRatio: z
    .string()
    .regex(/^\d+(\.\d+)?:\d+(\.\d+)?$/, 'Aspect ratio must be in the format of number:number')
    .transform((val) => val as `${number}:${number}`)
    .optional(),
  quality: z.string().optional(),
  seed: z.number().int().nonnegative().max(IMAGE_GEN_SEED_LIMITS.max).optional()
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
