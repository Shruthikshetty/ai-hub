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

// response schema for creating a connector
export const createConnectorResponseSchema = z.object({
  success: z.boolean(),
  data: connectorSelectSchema,
  message: z.string().optional()
})

// response schema for deleting a connector
export const deleteConnectorResponseSchema = z.object({
  success: z.boolean(),
  data: connectorSelectSchema.optional(),
  message: z.string().optional()
})
