import { z } from 'zod'
import { FILE_STORAGE_CATEGORY } from '../constants/global.constants'

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

// extract the type
export type mediaUploadSchemaType = z.infer<typeof mediaUploadSchema>
export type mediaUploadResponseSchemaType = z.infer<typeof mediaUploadResponseSchema>
