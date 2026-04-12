/**
 * This @file contains all video generation service
 */

import { MEDIA_TYPE } from '@common/constants/global.constants'
import type {
  GenerateVideoRequestSchemaType,
  GenerateVideoResponseSchemaType
} from '@common/schemas/video-gen.schema'
import { ApiError } from '@common/types'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * hook to generate video
 */
export const useGenerateVideo = () => {
  return useMutation<GenerateVideoResponseSchemaType, ApiError, GenerateVideoRequestSchemaType>({
    mutationKey: [MUTATION_KEYS.videoGenerate],
    mutationFn: async ({ model, prompt }) => {
      const response = await window.api.request('/api/video-gen', 'POST', { prompt, model })
      if (!response.success) {
        throw response
      }
      return response
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to generate video')
    }
  })
}

/**
 * hook to delete generated video
 */
export const useDeleteVideo = () => {
  // get query client
  const queryClient = useQueryClient()

  return useMutation<void, ApiError, number>({
    mutationKey: [MUTATION_KEYS.videoDelete],
    mutationFn: async (id) => {
      const response = await window.api.request(`/api/video-gen/${id}`, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('Video deleted successfully')
      // invalidate media fetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mediaFetch, MEDIA_TYPE[1]] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete video')
    }
  })
}
