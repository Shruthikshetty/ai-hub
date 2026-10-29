/**
 * This file contain all the connectors related services
 */

import { FetchAllConnectorResponseSchemaType } from '@common/schemas/connector.schema'
import { ApiError } from '@common/types'
import { FETCH_CONNECTORS_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * hook to fetch all connectors
 */
export const useFetchConnectors = () => {
  return useQuery<FetchAllConnectorResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.connectorsFetch],
    queryFn: async () => {
      const response = await window.api.request('/api/connector', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_CONNECTORS_STALE_TIME
  })
}
