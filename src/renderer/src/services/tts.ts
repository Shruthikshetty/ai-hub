/**
 * This @file contains all tts generation service
 */

import {
  GenerateSpeechFromTextRequestSchemaType,
  GenerateSpeechFromTextResponseSchemaType,
  DeleteTTSAudioResponseSchemaType
} from '@common/schemas/tts.schema'
import { ApiError } from '@common/types'
import { MUTATION_KEYS, QUERY_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast, successToast } from '@renderer/lib/toast-wrapper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MEDIA_TYPE } from '@common/constants/global.constants'

/**
 * hook to generate speech from text
 * @TODO to be modified and made selectable model and voice
 */
export const useGenerateSpeech = () => {
  return useMutation<
    GenerateSpeechFromTextResponseSchemaType,
    ApiError,
    GenerateSpeechFromTextRequestSchemaType
  >({
    mutationKey: [MUTATION_KEYS.speechGenerate],
    mutationFn: async ({
      text,
      chatId,
      messageId,
      model,
      voice
    }: GenerateSpeechFromTextRequestSchemaType) => {
      const response = await window.api.request('/api/tts', 'POST', {
        text,
        chatId,
        messageId,
        model,
        voice
      })
      if (!response.success) {
        throw response
      }
      return response
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to generate speech')
    }
  })
}

/**
 * hook to delete generated tts audio
 */
export const useDeleteGeneratedTTSAudio = () => {
  const queryClient = useQueryClient()
  return useMutation<DeleteTTSAudioResponseSchemaType, ApiError, number>({
    mutationKey: [MUTATION_KEYS.speechDelete],
    mutationFn: async (id) => {
      const response = await window.api.request(`/api/tts/${id}`, 'DELETE')
      if (!response.success) {
        throw response
      }
      return response
    },
    onSuccess: () => {
      successToast('TTS Audio deleted successfully')
      // invalidate media fetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mediaFetch, MEDIA_TYPE[2]] })
    },
    onError: (error) => {
      errorToast(error?.message ?? 'Failed to delete TTS audio')
    }
  })
}
