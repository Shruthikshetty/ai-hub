import { z } from 'zod'
import { AVAILABLE_PROVIDER_LIST } from '../constants/global.constants'
import {
  imageOptionsSchema,
  modalitySchema,
  modelCapabilitiesSchema,
  modelsGetSchema,
  ttsOptionsSchema,
  videoOptionsSchema
} from '../db-schemas/model.schema'

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

export const modelDeleteResponse = z.object({
  success: z.boolean(),
  data: modelsGetSchema.optional(),
  message: z.string().optional()
})

export const modelUpdateResponse = z.object({
  success: z.boolean(),
  data: modelsGetSchema,
  message: z.string().optional()
})

export const updateModelResponseSchema = modelUpdateResponse

export const syncCatalogResponse = z.object({
  success: z.boolean(),
  data: z.object({
    totalSynced: z.number(),
    preservedPreferences: z.number()
  }),
  message: z.string().optional()
})

export const remoteModelSchema = z.object({
  providerId: z.string(),
  id: z.string(),
  canonicalId: z.string(),
  name: z.string(),
  originProvider: z.string(),
  inputs: z.array(modalitySchema).default(['text']),
  outputs: z.array(modalitySchema).default(['text']),
  capabilities: modelCapabilitiesSchema,
  imageOptions: imageOptionsSchema.nullable().default(null),
  ttsOptions: ttsOptionsSchema.nullable().default(null),
  videoOptions: videoOptionsSchema.nullable().default(null),
  contextLength: z.number().int().nullable().default(null),
  maxOutputTokens: z.number().int().nullable().default(null),
  description: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  isDeprecated: z.boolean().default(false)
})

// Schema for the remote catalog container (catalog.json)
export const catalogSchema = z.object({
  version: z.number().default(1),
  updatedAt: z.string(),
  totalModels: z.number(),
  models: z.array(remoteModelSchema)
})

// extract the type
export type ModelSchemaType = z.infer<typeof modelSchema>
export type ModelResponseSchemaType = z.infer<typeof modelResponseSchema>
export type ModelIOType = z.infer<typeof ModelIOSchema>
export type ModelProviderType = (typeof AVAILABLE_PROVIDER_LIST)[number]
export type Catalog = z.infer<typeof catalogSchema>
export type ModelDeleteResponseType = z.infer<typeof modelDeleteResponse>
export type ModelUpdateResponseType = z.infer<typeof modelUpdateResponse>
export type ModelResponseSchemaV2 = z.infer<typeof modelResponseSchemaV2>
export type ModelAddResponseType = z.infer<typeof modelAddResponse>
export type RemoteModel = z.infer<typeof remoteModelSchema>
export type SyncCatalogResponseType = z.infer<typeof syncCatalogResponse>
