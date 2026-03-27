/**
 * This @file contains all image generation service
 */

import type {
  GenerateImageRequestSchemaType,
  GenerateImageResponseSchemaType
} from '@common/schemas/image-gen.schema'
import { ApiError } from '@common/types'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * hook to generate image
 */
export const useGenerateImage = () => {
  return useMutation<GenerateImageResponseSchemaType, ApiError, GenerateImageRequestSchemaType>({
    mutationKey: [MUTATION_KEYS.imageGenerate],
    mutationFn: async ({ model, prompt }) => {
      const response = await window.api.request('/api/image-gen', 'POST', { prompt, model })
      if (!response.success) {
        throw response
      }
      return response
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to generate image')
    }
  })
}

/**
 * hook to delete generated image
 */
export const useDeleteGeneratedImage = () => {
  const queryClient = useQueryClient()
  return useMutation<GenerateImageResponseSchemaType, ApiError, number>({
    mutationKey: [MUTATION_KEYS.imageGenerate],
    mutationFn: async (id) => {
      const response = await window.api.request(`/api/image-gen/${id}`, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('Image deleted successfully')
      // invalidate media fetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mediaFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete image')
    }
  })
}
