/**
 * this contains zod schema to keep proper structure and type safety of the model table
 */
import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  MODALITIES,
  REASONING_TYPES,
  REASONING_EFFORT_LEVELS,
  REASONING_DEFAULT_STATES,
  TTS_GENDERS,
  MODEL_SOURCES
} from '../constants/models.constants'

// enums -------------------------------

export const modalitySchema = z.enum(MODALITIES)
export const reasoningTypeSchema = z.enum(REASONING_TYPES)
export const reasoningEffortLevelSchema = z.enum(REASONING_EFFORT_LEVELS)
export const modelSourceSchema = z.enum(MODEL_SOURCES)

// schemas -------------------------------------

export const reasoningConfigSchema = z.object({
  supported: z.boolean().default(false),
  type: reasoningTypeSchema.nullable().default(null),
  effortLevels: z.array(reasoningEffortLevelSchema).nullable().default(null),
  budgetTokens: z
    .object({
      min: z.number(),
      max: z.number(),
      default: z.number()
    })
    .nullable()
    .default(null),
  canToggleOff: z.boolean().default(true),
  defaultState: z.enum(REASONING_DEFAULT_STATES).default('disabled')
})

export const modelCapabilitiesSchema = z.object({
  vision: z.boolean().default(false),
  functionCalling: z.boolean().default(false),
  webSearch: z.boolean().default(false),
  codeExecution: z.boolean().default(false),
  realtime: z.boolean().default(false),
  videoReasoning: z.boolean().default(false),
  fileInput: z.boolean().default(false),
  supportsStreaming: z.boolean().default(true),
  supportsSystemPrompt: z.boolean().default(true),

  // Advanced Reasoning
  reasoning: reasoningConfigSchema.default({
    supported: false,
    type: null,
    effortLevels: null,
    budgetTokens: null,
    canToggleOff: true,
    defaultState: 'disabled'
  })
})

export const imageOptionsSchema = z.object({
  sizes: z.array(z.string()).default([]),
  aspectRatios: z.array(z.string()).nullable().default(null),
  qualities: z.array(z.string()).nullable().default(null),
  styles: z.array(z.string()).nullable().default(null),
  supportsSeed: z.boolean().default(false),
  providerParamKey: z.string()
})

export const ttsVoiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  gender: z.enum(TTS_GENDERS).nullable()
})

export const ttsOptionsSchema = z.object({
  voices: z.array(ttsVoiceSchema),
  formats: z.array(z.string()).default([]),
  speeds: z
    .object({
      min: z.number().default(0.25),
      max: z.number().default(4.0)
    })
    .nullable()
    .default(null)
})

export const videoOptionsSchema = z.object({
  durations: z.array(z.number()),
  aspectRatios: z.array(z.string()),
  resolutions: z.array(z.string()),
  defaultDuration: z.number().default(5),
  defaultAspectRatio: z.string().default('16:9'),
  defaultResolution: z.string().default('720p')
})

// Schema for an individual model
export const modelSchema = z.object({
  providerId: z.string(),
  id: z.string(),
  canonicalId: z.string(),
  name: z.string(),
  originProvider: z.string(),
  inputs: z.array(modalitySchema).default(['text']),
  outputs: z.array(modalitySchema).default(['text']),
  capabilities: modelCapabilitiesSchema,
  imageOptions: imageOptionsSchema.nullable().default(null),
  ttsOptions: ttsOptionsSchema.nullable().default(null),
  videoOptions: videoOptionsSchema.nullable().default(null),
  contextLength: z.number().int().nullable().default(null),
  maxOutputTokens: z.number().int().nullable().default(null),
  description: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  isDeprecated: z.boolean().default(false)
})

// tables -------->

export const models = sqliteTable(
  'models',
  {
    providerId: text('provider_id').notNull(),
    id: text('id').notNull(),
    canonicalId: text('canonical_id').notNull(),
    name: text('name').notNull(),
    originProvider: text('origin_provider').notNull(),
    inputs: text('inputs', { mode: 'json' }).$type<Modality[]>().notNull().default(['text']),
    outputs: text('outputs', { mode: 'json' }).$type<Modality[]>().notNull().default(['text']),
    capabilities: text('capabilities', { mode: 'json' }).$type<ModelCapabilities>().notNull(),
    imageOptions: text('image_options', { mode: 'json' }).$type<ImageOptions>(),
    ttsOptions: text('tts_options', { mode: 'json' }).$type<TtsOptions>(),
    videoOptions: text('video_options', { mode: 'json' }).$type<VideoOptions>(),
    contextLength: integer('context_length'),
    maxOutputTokens: integer('max_output_tokens'),
    description: text('description'),
    tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
    source: text('source', { enum: MODEL_SOURCES }).default('github'),
    isDeprecated: integer('is_deprecated', { mode: 'boolean' }).default(false),

    // Local user preferences - dose not get overridden on updates
    isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
    isHidden: integer('is_hidden', { mode: 'boolean' }).default(false),
    sortOrder: integer('sort_order').default(0),
    syncedAt: integer('synced_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
  },
  (table) => [
    primaryKey({ columns: [table.providerId, table.id] }),
    index('models_active_idx').on(table.isDeprecated, table.isHidden, table.providerId)
  ]
)

// schemas ------->

export const modelsGetSchema = createSelectSchema(models)
export const modelsInsertSchema = createInsertSchema(models)
export const modelsPatchSchema = modelsInsertSchema.partial()

// export types
export type ModelGetSchema = z.infer<typeof modelsGetSchema>
export type ModelInsertSchema = z.infer<typeof modelsInsertSchema>
export type ModelPatchSchema = z.infer<typeof modelsPatchSchema>
export type Modality = z.infer<typeof modalitySchema>
export type ReasoningType = z.infer<typeof reasoningTypeSchema>
export type ReasoningEffortLevel = z.infer<typeof reasoningEffortLevelSchema>
export type ReasoningConfig = z.infer<typeof reasoningConfigSchema>
export type ModelCapabilities = z.infer<typeof modelCapabilitiesSchema>
export type ImageOptions = z.infer<typeof imageOptionsSchema>
export type TtsVoice = z.infer<typeof ttsVoiceSchema>
export type TtsOptions = z.infer<typeof ttsOptionsSchema>
export type VideoOptions = z.infer<typeof videoOptionsSchema>
export type Model = z.infer<typeof modelSchema>
export type ModelSource = z.infer<typeof modelSourceSchema>
