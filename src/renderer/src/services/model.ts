/**
 * This @file contains all model related services
 */

import { Modality, ModelInsertSchema } from '@common/db-schemas/model.schema'
import {
  ModelAddResponseType,
  ModelIOType,
  ModelResponseSchemaType,
  ModelResponseSchemaV2
} from '@common/schemas/model.schema'
import { ApiError } from '@common/types'
import { FETCH_MODELS_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/**
 * Fetches the list of models from the backend
 * @deprecated use v2 instead
 */
export function useFetchModels({
  output,
  fetchEnabled = true
}: { output?: ModelIOType; fetchEnabled?: boolean } = {}) {
  return useQuery<ModelResponseSchemaType, ApiError>({
    enabled: fetchEnabled,
    queryKey: [QUERY_KEYS.modelsFetch, output],
    queryFn: async (): Promise<ModelResponseSchemaType> => {
      // generate search params
      const params = new URLSearchParams()
      if (output) {
        params.append('output', output)
      }
      // query params
      const queryString = params.toString() ? `?${params.toString()}` : ''
      const response = await window.api.request(`/api/model${queryString}`, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_MODELS_STALE_TIME
  })
}

/**
 * fetch list of models from the database
 */
export function useFetchModelsV2({
  output,
  fetchEnabled = true
}: {
  output?: Modality
  fetchEnabled?: boolean
}) {
  return useQuery<ModelResponseSchemaV2, ApiError>({
    queryKey: [QUERY_KEYS.modelsFetchV2, output],
    queryFn: async (): Promise<ModelResponseSchemaV2> => {
      // generate search params
      const params = new URLSearchParams()
      if (output) {
        params.append('output', output)
      }
      // query params
      const queryString = params.toString() ? `?${params.toString()}` : ''
      const response = await window.api.request(`/api/model${queryString}`, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    enabled: fetchEnabled,
    staleTime: FETCH_MODELS_STALE_TIME
  })
}

/**
 * Add a new custom model entry
 */
export function useAddModel() {
  // query client
  const queryClient = useQueryClient()
  return useMutation<ModelAddResponseType, ApiError, ModelInsertSchema>({
    mutationKey: [MUTATION_KEYS.addModel],
    mutationFn: async (model: ModelInsertSchema) => {
      if (!model?.source) {
        model.source = 'in-app'
      }
      const response = await window.api.request('/api/model', 'POST', model)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('Model added successfully')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.modelsFetchV2]
      })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to add model')
    }
  })
}

/**
 * Delete model entry
 */
export function useDeleteModel() {
  // query client
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [MUTATION_KEYS.deleteModelById],
    mutationFn: async (id: string) => {
      const response = await window.api.request('/api/model/' + id, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('Model deleted successfully')
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.modelsFetchV2]
      })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete model')
    }
  })
}
