/**
 * This @file contains all model related services
 */

import { ModelResponseSchemaType } from '@common/schemas/model.schema'
import { ApiError } from '@common/types'
import { FETCH_MODELS_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * Fetches the list of models from the backend
 */
export function useFetchModels() {
  return useQuery<ModelResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.modelsFetch],
    queryFn: async (): Promise<ModelResponseSchemaType> => {
      const response = await window.api.request('/api/models', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_MODELS_STALE_TIME
  })
}
