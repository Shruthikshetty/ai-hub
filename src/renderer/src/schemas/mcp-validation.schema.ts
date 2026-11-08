import { z } from 'zod'

/**
 * Validation schema for MCP server form (both add and update)
 */
export const mcpFormValidationSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    type: z.enum(['http', 'stdio']).default('http'),
    url: z.string().optional().default(''),
    command: z.string().optional().default(''),
    args: z.array(z.string()).default([]),
    cwd: z.string().optional().default(''),
    authToken: z.string().optional().default(''),
    enabled: z.boolean().default(true)
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

export type McpFormValidationSchemaType = z.input<typeof mcpFormValidationSchema>
