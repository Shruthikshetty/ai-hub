/**
 * This @file contains all model related services
 */

import { ModelIOType, ModelResponseSchemaType } from '@common/schemas/model.schema'
import { ApiError } from '@common/types'
import { FETCH_MODELS_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * Fetches the list of models from the backend
 */
export function useFetchModels({ output }: { output?: ModelIOType } = {}) {
  return useQuery<ModelResponseSchemaType, ApiError>({
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
