/**
 * This contains all the provider related services
 */

import { ProviderPatchSchema } from '@common/db-schemas/provider.schema'
import {
  fetchAllProvidersResponseSchemaType,
  patchProviderResponseSchemaType
} from '@common/schemas/providers.schema'
import { ApiError } from '@common/types'
import { FETCH_PROVIDERS_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

/**
 * service for updating a provider by id
 */
export function useUpdateProviderById() {
  const queryClient = useQueryClient()
  return useMutation<
    patchProviderResponseSchemaType,
    ApiError,
    { id: number; data: ProviderPatchSchema }
  >({
    mutationKey: [MUTATION_KEYS.providerUpdateById],
    mutationFn: async ({ id, data }): Promise<patchProviderResponseSchemaType> => {
      const response = await window.api.request('/api/providers/' + id, 'PATCH', data)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: async () => {
      successToast('Provider updated successfully')
      // invalidate the providers query
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.modelsFetch] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.providersFetch] })
      ])
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to update provider')
    }
  })
}
