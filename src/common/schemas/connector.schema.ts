import { z } from 'zod'
import { connectorSelectSchema } from '../db-schemas/connector.schema'

// response schema for fetching all connectors
export const fetchAllConnectorResponseSchema = z.object({
  success: z.boolean(),
  data: connectorSelectSchema.array()
})

// response schema for updating a connector
export const updateConnectorResponseSchema = z.object({
  success: z.boolean(),
  data: connectorSelectSchema
})
