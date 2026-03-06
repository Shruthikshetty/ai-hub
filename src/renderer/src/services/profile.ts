/**
 * This contains all the user profile related services
 */

import { UserGetSchema, UserPatchSchema } from '@common/db-schemas/user.schema'
import { ApiError } from '@common/types'
import { FETCH_USER_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type UseFetchUserProfileResponse = {
  data?: UserGetSchema
  success: boolean
}

type UseUpdateUserProfileResponse = {
  data?: UserPatchSchema
  success: boolean
}

/**
 * service to fetch user profile data
 */
export function useFetchUserProfile() {
  return useQuery<UseFetchUserProfileResponse, ApiError>({
    queryKey: [QUERY_KEYS.userFetch],
    queryFn: async (): Promise<UseFetchUserProfileResponse> => {
      const response = await window.api.request('/api/profile', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_USER_STALE_TIME
  })
}

/**
 * service to update user profile data
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  return useMutation<UseUpdateUserProfileResponse, ApiError, UserPatchSchema>({
    mutationKey: [MUTATION_KEYS.userUpdate],
    mutationFn: async (data: UserPatchSchema): Promise<UseUpdateUserProfileResponse> => {
      const response = await window.api.request('/api/profile', 'PATCH', data)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      // invalidate user data fetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userFetch] })
    }
  })
}
