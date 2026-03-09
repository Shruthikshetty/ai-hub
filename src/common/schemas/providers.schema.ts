import { z } from 'zod'
import { providersGetSchema } from '../db-schemas/provider.schema'

// response schema for fetching all providers
export const fetchAllProvidersResponseSchema = z.object({
  success: z.boolean(),
  data: providersGetSchema.array()
})

//extract the type
export type fetchAllProvidersResponseSchemaType = z.infer<typeof fetchAllProvidersResponseSchema>
