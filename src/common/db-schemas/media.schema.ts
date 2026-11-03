/**
 * @file contains the media schema with zod validation
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { MEDIA_TYPE } from '../constants/global.constants'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// create a media table
export const media = sqliteTable(
  'media',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    prompt: text().notNull(),
    mediaUrl: text().notNull(),
    relativePath: text().notNull(),
    modelId: text().notNull(),
    provider: text().notNull(),
    type: text({ enum: MEDIA_TYPE }).notNull(),
    chatId: text(),
    messageId: text(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
  },
  (table) => [
    index('media_type_id_idx').on(table.type, table.id),
    index('media_message_id_idx').on(table.messageId)
  ]
)

// zod schema for getting media items
export const mediaGetSchema = createSelectSchema(media)

// zod schema for inserting media items
export const mediaInsertSchema = createInsertSchema(media).omit({
  createdAt: true,
  id: true
})

// export types
export type MediaGetSchema = z.infer<typeof mediaGetSchema>
export type MediaInsertSchema = z.infer<typeof mediaInsertSchema>
