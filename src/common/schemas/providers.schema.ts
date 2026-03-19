import { z } from 'zod'
import { providersGetSchema } from '../db-schemas/provider.schema'

// response schema for fetching all providers
export const fetchAllProvidersResponseSchema = z.object({
  success: z.boolean(),
  data: providersGetSchema.array()
})

// response schema for patching a single provider
export const patchProviderResponseSchema = z.object({
  success: z.boolean(),
  data: providersGetSchema
})

//extract the type
export type FetchAllProvidersResponseSchemaType = z.infer<typeof fetchAllProvidersResponseSchema>
export type PatchProviderResponseSchemaType = z.infer<typeof patchProviderResponseSchema>
