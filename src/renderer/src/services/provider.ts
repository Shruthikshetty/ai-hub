/**
 * This contains all the provider related services
 */

import { fetchAllProvidersResponseSchemaType } from '@common/schemas/providers.schema'
import { ApiError } from '@common/types'
import { FETCH_PROVIDERS_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * service to fetch all the provider data
 */
export function useFetchProviders() {
  return useQuery<fetchAllProvidersResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.providersFetch],
    queryFn: async () => {
      const response = await window.api.request('/api/providers', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_PROVIDERS_STALE_TIME
  })
}
