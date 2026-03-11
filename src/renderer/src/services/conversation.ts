/**
 * This file contain all the conversation related services
 */

import { FetchAllConversationsResponseSchemaType } from '@common/schemas/conversation'
import { ApiError } from '@common/types'
import { FETCH_CONVERSATIONS_STALE_TIME } from '@renderer/constants/config.constants'
import { QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { useQuery } from '@tanstack/react-query'

/**
 * hook to fetch all the conversations
 */
export const useFetchConversations = () => {
  return useQuery<FetchAllConversationsResponseSchemaType, ApiError>({
    queryKey: [QUERY_KEYS.conversationsFetch],
    queryFn: async () => {
      const response = await window.api.request('/api/conversation', 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    staleTime: FETCH_CONVERSATIONS_STALE_TIME
  })
}
