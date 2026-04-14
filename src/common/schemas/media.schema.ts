import { z } from 'zod'
import { FILE_STORAGE_CATEGORY } from '../constants/global.constants'
import { mediaGetSchema } from '../db-schemas/media.schema'

export const mediaUploadSchema = z
  .object({
    /** Absolute path to the source file on disk */
    sourcePath: z.string().optional(),
    /**category of storage for separation  */
    category: z.enum(FILE_STORAGE_CATEGORY),
    /** base64 of the file */
    base64: z.string().optional(),
    /** extension of the file */
    extension: z.string().optional()
  })
  .refine(
    (data) => {
      return data.sourcePath || data.base64
    },
    {
      message: 'Either sourcePath or base64 must be provided'
    }
  )

export const mediaUploadResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    /** Relative path from media root, e.g. "profile/avatar.png" */
    relativePath: z.string(),
    /** media:// URL for direct use in UI */
    mediaUrl: z.string()
  })
})

// schema to get all media by type
export const getMediaResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(mediaGetSchema)
})

// schema to get a single media record by messageId
export const getMediaByMessageIdResponseSchema = z.object({
  success: z.boolean(),
  data: mediaGetSchema
})

export const mediaDeleteSchema = z.object({
  /** Relative path from media root, e.g. "profile/avatar.png" */
  relativePath: z.string()
})

// response schema for deleting a media file
export const mediaDeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
})

// extract the type
export type MediaUploadSchemaType = z.infer<typeof mediaUploadSchema>
export type MediaUploadResponseSchemaType = z.infer<typeof mediaUploadResponseSchema>
export type GetMediaResponseType = z.infer<typeof getMediaResponseSchema>
export type GetMediaByMessageIdResponseType = z.infer<typeof getMediaByMessageIdResponseSchema>
export type MediaDeleteSchemaType = z.infer<typeof mediaDeleteSchema>
export type MediaDeleteResponseSchemaType = z.infer<typeof mediaDeleteResponseSchema>
