/**
 * @file contains the mcptools  schema with zod validation
 */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// create a mcp server table
export const mcpServers = sqliteTable('mcp_servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['http', 'stdio'] })
    .notNull()
    .default('http'),
  url: text('url').notNull(), // can store both the stdio path or the http url
  command: text('command'), // optional used for stdio servers
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
export const mcpServerGetSchema = createSelectSchema(mcpServers)
export const mcpServerInsertSchema = createInsertSchema(mcpServers).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const mcpServerUpdateSchema = mcpServerInsertSchema.partial()

// export all the types
export type McpGetSchema = z.infer<typeof mcpServerGetSchema>
export type McpInsertSchema = z.infer<typeof mcpServerInsertSchema>
export type McpUpdateSchema = z.infer<typeof mcpServerUpdateSchema>
