/**
 * This @file contains all tts generation service
 */

import {
  GenerateSpeechFromTextRequestSchemaType,
  GenerateSpeechFromTextResponseSchemaType
} from '@common/schemas/tts.schema'
import { ApiError } from '@common/types'
import { MUTATION_KEYS } from '@renderer/constants/service-keys.constants'
import { errorToast } from '@renderer/lib/toast-wrapper'
import { useMutation } from '@tanstack/react-query'

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
    mutationFn: async ({ text, chatId, messageId }: GenerateSpeechFromTextRequestSchemaType) => {
      const response = await window.api.request('/api/tts', 'POST', { text, chatId, messageId })
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
