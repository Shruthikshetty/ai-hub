/**
 * This file contain all the conversation related services
 */

import { ConversationAddSchema } from '@common/db-schemas/conversation.schema'
import {
  CreateConversationResponseSchemaType,
  DeleteConversationResponseType,
  FetchAllConversationsResponseSchemaType
} from '@common/schemas/conversation.schema'
import { ApiError } from '@common/types'
import { FETCH_CONVERSATIONS_STALE_TIME } from '@renderer/constants/config.constants'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

/**
 * create a new conversation
 */
export const useAddConversation = () => {
  const queryClient = useQueryClient()
  return useMutation<CreateConversationResponseSchemaType, ApiError, ConversationAddSchema>({
    mutationKey: [MUTATION_KEYS.conversationAdd],
    mutationFn: async (conversation: ConversationAddSchema) => {
      const response = await window.api.request('/api/conversation', 'POST', conversation)
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversationsFetch] })
    },
    onError: () => {
      errorToast('Failed to add conversation')
    }
  })
}

/**
 * const delete a conversation by id
 */
export const useDeleteConversationById = () => {
  const queryClient = useQueryClient()
  return useMutation<DeleteConversationResponseType, ApiError, { id: number }>({
    mutationKey: [MUTATION_KEYS.deleteConversationById],
    mutationFn: async ({ id }) => {
      const response = await window.api.request('/api/conversation/' + id, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.conversationsFetch] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete conversation')
    }
  })
}
