/**
 * This contains all the user profile related services
 */

import { UserGetSchema } from '@common/db-schemas/user.schema'
import { FETCH_USER_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * service to fetch user profile data
 */
export function useFetchUserProfile() {
  return useQuery<UserGetSchema>({
    queryKey: [QUERY_KEYS.userFetch],
    queryFn: async () => await window.api.request('/api/profile', 'GET'),
    staleTime: FETCH_USER_STALE_TIME
  })
}
