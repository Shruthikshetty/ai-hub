/**
 * This @file contains all Media upload service
 */

import { MEDIA_REQUEST_TYPES } from '@common/constants/global.constants'
import {
  GetMediaByMessageIdResponseType,
  GetMediaResponseType,
  MediaUploadResponseSchemaType
} from '@common/schemas/media.schema'
import { ApiError, FileStorageCategory } from '@common/types'
import { FETCH_MEDIA_BY_MESSAGE_ID_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { buildQueryString } from '@renderer/lib/generation.utild'
import { uploadMediaFile } from '@renderer/lib/media-upload'
import { errorToast } from '@renderer/lib/toast-wrapper'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

// types
export interface UploadMediaInput {
  file: File
  /** Storage category this is used for storage separation**/
  category: FileStorageCategory
}

/**
 * React Query mutation hook for uploading media.(uploading will only upload and not really add to media db)
 */
export function useUploadMedia() {
  return useMutation<MediaUploadResponseSchemaType, ApiError, UploadMediaInput>({
    mutationKey: [MUTATION_KEYS.mediaUpload],
    mutationFn: async ({ file, category }) => uploadMediaFile(file, category),
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to upload media')
    }
  })
}

/**
 *get all the media items by type
 *@deprecated use the useFetchInfiniteMedia instead
 */
export function useFetchMedia({
  type = 'all',
  cursor,
  limit = 20
}: {
  type?: (typeof MEDIA_REQUEST_TYPES)[number]
  cursor?: number
  limit?: number
}) {
  return useQuery<GetMediaResponseType, ApiError>({
    queryKey: [QUERY_KEYS.mediaFetch, type, cursor, limit],
    queryFn: async () => {
      const queryString = buildQueryString({ cursor, limit })
      const response = await window.api.request(`/api/media/${type}${queryString}`, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    }
  })
}

/**
 * get all the media items by type with infinity scrolling
 */
export function useFetchInfiniteMedia({
  type = 'all',
  limit = 50
}: {
  type?: (typeof MEDIA_REQUEST_TYPES)[number]
  limit?: number
}) {
  return useInfiniteQuery<GetMediaResponseType, ApiError>({
    queryKey: [QUERY_KEYS.mediaFetchInfinite, type, limit],
    initialPageParam: undefined as number | undefined,
    queryFn: async ({ pageParam }) => {
      const queryString = buildQueryString({ cursor: pageParam, limit })
      const response = await window.api.request(`/api/media/${type}${queryString}`, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.pagination.hasMore) {
        return undefined // no more pages
      }
      return lastPage.data.pagination.nextCursor // cursor for the next page
    }
  })
}

/**
 * Fetch the stored media record for a specific message.
 * currently this only stores tts files.
 */
export function useGetMediaByMessageId(messageId: string) {
  return useQuery<GetMediaByMessageIdResponseType, ApiError>({
    queryKey: [QUERY_KEYS.mediaTtsFetch, messageId],
    queryFn: async () => {
      const response = await window.api.request('/api/media/message/' + messageId, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    enabled: !!messageId,
    staleTime: FETCH_MEDIA_BY_MESSAGE_ID_STALE_TIME
  })
}
