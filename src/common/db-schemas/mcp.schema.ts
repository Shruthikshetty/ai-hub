/**
 * @file contains the mcptools  schema with zod validation
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// create a mcp server table
export const mcpServers = sqliteTable('mcp_servers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  type: text('type', { enum: ['http', 'stdio'] })
    .notNull()
    .default('http'),
  url: text('url'), // for HTTP transport: url of the MCP server
  command: text('command'), // for stdio transport: command/executable
  args: text('args', { mode: 'json' }).$type<string[]>().default([]), // arguments for stdio command
  cwd: text('cwd'), // working directory for stdio
  authToken: text('auth_token'), // optional since some maybe local running servers
  enabled: integer('enabled', {
    mode: 'boolean'
  })
    .notNull()
    .default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
})

// zod schema for mcp crud actions
export const mcpServerGetSchema = createSelectSchema(mcpServers, {
  args: () => z.array(z.string()).default([])
})

const baseMcpServerInsertSchema = createInsertSchema(mcpServers, {
  name: (field) => field.min(1, 'Name is required'),
  args: () => z.array(z.string()).optional().default([])
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const mcpServerUpdateSchema = baseMcpServerInsertSchema
  .partial()
  .extend({
    args: z.array(z.string()).optional()
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field must be provided'
  })

export const mcpServerInsertSchema = baseMcpServerInsertSchema.superRefine((data, ctx) => {
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

// export all the types
export type McpGetSchema = z.infer<typeof mcpServerGetSchema>
export type McpInsertSchema = z.infer<typeof mcpServerInsertSchema>
export type McpUpdateSchema = z.infer<typeof mcpServerUpdateSchema>
