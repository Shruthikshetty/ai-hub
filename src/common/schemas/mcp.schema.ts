import { z } from 'zod'
import { mcpServerGetSchema } from '../db-schemas/mcp.schema'

// response schema for fetching all MCP servers
export const fetchAllMcpServersResponseSchema = z.object({
  success: z.boolean(),
  data: mcpServerGetSchema.array()
})

// response schema for creating an MCP server
export const createMcpServerResponseSchema = z.object({
  success: z.boolean(),
  data: mcpServerGetSchema,
  message: z.string().optional()
})

// response schema for updating an MCP server
export const updateMcpServerResponseSchema = z.object({
  success: z.boolean(),
  data: mcpServerGetSchema,
  message: z.string().optional()
})

// response schema for deleting an MCP server
export const deleteMcpServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

// request schema for testing an MCP connection
export const testMcpServerRequestSchema = z
  .object({
    type: z.enum(['http', 'stdio']).default('http'),
    url: z.string().nullish(),
    command: z.string().nullish(),
    args: z.array(z.string()).nullish(),
    cwd: z.string().nullish(),
    authToken: z.string().nullish()
  })
  .superRefine((data, ctx) => {
    if (data.type === 'http') {
      if (!data.url || data.url.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'URL is required for HTTP MCP servers',
          path: ['url']
        })
      }
    } else if (data.type === 'stdio') {
      if (!data.command || data.command.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Command is required for stdio MCP servers',
          path: ['command']
        })
      }
    }
  })

// response schema for testing an MCP connection
export const testMcpServerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  tools: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional()
      })
    )
    .optional()
})

// export all the types
export type FetchAllMcpServersResponseSchemaType = z.infer<typeof fetchAllMcpServersResponseSchema>
export type CreateMcpServerResponseSchemaType = z.infer<typeof createMcpServerResponseSchema>
export type UpdateMcpServerResponseSchemaType = z.infer<typeof updateMcpServerResponseSchema>
export type DeleteMcpServerResponseSchemaType = z.infer<typeof deleteMcpServerResponseSchema>
export type TestMcpServerRequestSchemaType = z.infer<typeof testMcpServerRequestSchema>
export type TestMcpServerResponseSchemaType = z.infer<typeof testMcpServerResponseSchema>
