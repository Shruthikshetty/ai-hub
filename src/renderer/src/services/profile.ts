/**
 * This contains all the user profile related services
 */

import { UserGetSchema } from '@common/db-schemas/user.schema'
import { ApiError } from '@common/types'
import { FETCH_USER_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

type UseFetchUserProfile = {
  data?: UserGetSchema
  success: boolean
}

/**
 * service to fetch user profile data
 */
export function useFetchUserProfile() {
  return useQuery<UseFetchUserProfile, ApiError>({
    queryKey: [QUERY_KEYS.userFetch],
    queryFn: async (): Promise<UseFetchUserProfile> => {
      const response = await window.api.request('/api/profile', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_USER_STALE_TIME
  })
}
