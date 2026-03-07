/**
 * This @file contains all Media upload service
 */

import { mediaUploadResponseSchemaType } from '@common/schemas/media.schema'
import { ApiError, FileStorageCategory } from '@common/types'
import { MUTATION_KEYS } from '@renderer/constants/service-keys.constants'
import { uploadMediaFile } from '@renderer/lib/media-upload'
import { useMutation } from '@tanstack/react-query'

// types
export interface UploadMediaInput {
  file: File
  /** Storage category this is used for storage separation**/
  category: FileStorageCategory
}

/**
 * React Query mutation hook for uploading media.
 */
export function useUploadMedia() {
  return useMutation<mediaUploadResponseSchemaType, ApiError, UploadMediaInput>({
    mutationKey: [MUTATION_KEYS.mediaUpload],
    mutationFn: async ({ file, category }) => uploadMediaFile(file, category)
  })
}
