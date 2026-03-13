import { z } from 'zod'
import { AVAILABLE_PROVIDER_LIST } from '../constants/global.constants'

export const ModelIOSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'embedding',
  'realtime',
  'file'
])

export const modelSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string().default('unknown'),
  inputs: z.array(ModelIOSchema).default(['text']),
  outputs: z.array(ModelIOSchema).default(['text']),
  capabilities: z
    .object({
      vision: z.boolean().nullish(),
      videoReasoning: z.boolean().nullish(),
      realtime: z.boolean().nullish()
    })
    .nullish()
})

export const modelResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(modelSchema)
})

// extract the type
export type ModelSchemaType = z.infer<typeof modelSchema>
export type ModelResponseSchemaType = z.infer<typeof modelResponseSchema>
export type ModelIOType = z.infer<typeof ModelIOSchema>
export type ModelProviderType = (typeof AVAILABLE_PROVIDER_LIST)[number]
