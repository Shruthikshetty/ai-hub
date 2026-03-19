import { mediaUploadResponseSchemaType } from '@common/schemas/media.schema'
import { FileStorageCategory } from '@common/types'

/**
 * Upload a file to the backend file storage.
 * Can be used standalone (without React Query) for one-off uploads.
 */
export async function uploadMediaFile(
  file: File,
  category: FileStorageCategory
): Promise<mediaUploadResponseSchemaType> {
  // Get the real filesystem path from the File object
  const sourcePath = window.api.getFilePath(file)

  const response = await window.api.request('/api/media/upload', 'POST', {
    sourcePath,
    category
  })

  if (!response.success) {
    throw response
  }

  return response
}
