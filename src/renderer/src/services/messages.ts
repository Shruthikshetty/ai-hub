/**
 * This @file contains all the message related services
 */

import { MessagesAddSchema } from '@common/db-schemas/message.schema'
import { AddMessageResponseType, GetMessageByIdResponseType } from '@common/schemas/messages.schema'
import { ApiError } from '@common/types'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQuery } from '@tanstack/react-query'

/**
 * hook to fetch a message by id
 */
export const useFetchMessageById = (id: string) => {
  return useQuery<GetMessageByIdResponseType, ApiError>({
    queryKey: [QUERY_KEYS.messageFetch, id],
    queryFn: async () => {
      const response = await window.api.request('/api/message/' + id, 'GET')
      if (!response.success) {
        throw response
      }
      return response
    },
    enabled: !!id
  })
}

/**
 * hook to add a new message
 */
export const useAddMessage = () => {
  return useMutation<AddMessageResponseType, ApiError, MessagesAddSchema>({
    mutationKey: [MUTATION_KEYS.messageAdd],
    mutationFn: async (message: MessagesAddSchema) => {
      const response = await window.api.request('/api/message', 'POST', message)
      if (!response.success) {
        throw response
      }
      return response
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to save message')
    }
  })
}
