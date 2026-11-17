import { z } from 'zod'
import { AVAILABLE_PROVIDER_LIST } from '../constants/global.constants'
import { modelSchema as catalogueModelSchema, modelsGetSchema } from '../db-schemas/model.schema'

//@DEPRECATED
export const ModelIOSchema = z.enum([
  'text',
  'image',
  'audio',
  'video',
  'embedding',
  'realtime',
  'file'
])

//@DEPRECATED
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

//@DEPRECATED
export const modelResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(modelSchema)
})

export const modelResponseSchemaV2 = z.object({
  success: z.boolean(),
  data: z.array(modelsGetSchema)
})

export const modelAddResponse = z.object({
  success: z.boolean(),
  data: modelsGetSchema,
  message: z.string().optional()
})

// Schema for the remote catalog container (catalog.json)
export const catalogSchema = z.object({
  version: z.number().default(1),
  updatedAt: z.string(),
  totalModels: z.number(),
  models: z.array(catalogueModelSchema)
})

// extract the type
export type ModelSchemaType = z.infer<typeof modelSchema>
export type ModelResponseSchemaType = z.infer<typeof modelResponseSchema>
export type ModelIOType = z.infer<typeof ModelIOSchema>
export type ModelProviderType = (typeof AVAILABLE_PROVIDER_LIST)[number]
export type Catalog = z.infer<typeof catalogSchema>
