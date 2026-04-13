/**
 * @file contains all the handlers related to tts routes
 */

import { openai } from '@ai-sdk/openai'
import { experimental_generateSpeech as generateSpeech } from 'ai'
import { AppRouteHandler } from '../../types'
import { GenerateSpeechFromTextRoute } from './tts.routes'
import { saveFile } from '../../lib/file-storage'
import { FILE_STORAGE_CATEGORY } from '../../../common/constants/global.constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'

// handler to generate speech from text
export const generateSpeechFromText: AppRouteHandler<GenerateSpeechFromTextRoute> = async (c) => {
  // get text and optional chatId from body
  const { text, chatId } = c.req.valid('json')

  // generate speech @TODO will be modified and made selectable
  const { audio } = await generateSpeech({
    model: openai.speech('gpt-4o-mini-tts'),
    text,
    voice: 'nova'
  })

  // if chatId is provided store the audio in chat id specific folder
  if (chatId) {
    const { mediaUrl } = await saveFile({
      category: FILE_STORAGE_CATEGORY.chatAttachment,
      chatId,
      base64: audio.base64,
      extension: 'mp3'
    })

    return c.json({ success: true, data: { mediaUrl } }, HTTP_STATUS_CODES.OK)
  }

  // no chatId — return base64 for ephemeral/standalone use
  return c.json(
    {
      success: true,
      data: {
        base64: audio.base64,
        mimeType: audio.mediaType
      }
    },
    HTTP_STATUS_CODES.OK
  )
}
