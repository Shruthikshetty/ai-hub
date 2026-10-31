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

//repose from start a connector
export const startConnectorResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    name: z.string(),
    botUsername: z.string(),
    isRunning: z.boolean()
  })
})

// export all the types
export type FetchAllConnectorResponseSchemaType = z.infer<typeof fetchAllConnectorResponseSchema>
export type UpdateConnectorResponseSchemaType = z.infer<typeof updateConnectorResponseSchema>
export type CreateConnectorResponseSchemaType = z.infer<typeof createConnectorResponseSchema>
export type DeleteConnectorResponseSchemaType = z.infer<typeof deleteConnectorResponseSchema>
export type StartConnectorResponseSchemaType = z.infer<typeof startConnectorResponseSchema>
