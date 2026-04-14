/**
 * @file contains all the handlers related to tts routes
 */

import { openai } from '@ai-sdk/openai'
import { experimental_generateSpeech as generateSpeech } from 'ai'
import { AppRouteHandler } from '../../types'
import { GenerateSpeechFromTextRoute } from './tts.routes'
import { saveFile, deleteMediaFile } from '../../lib/file-storage'
import { FILE_STORAGE_CATEGORY } from '../../../common/constants/global.constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { media } from '../../db/schema'

// handler to generate speech from text
export const generateSpeechFromText: AppRouteHandler<GenerateSpeechFromTextRoute> = async (c) => {
  // get text, optional chatId and optional messageId from body
  const { text, chatId, messageId } = c.req.valid('json')
  // generate speech @TODO will be modified and made selectable model and voice
  const { audio } = await generateSpeech({
    model: openai.speech('gpt-4o-mini-tts'),
    text,
    voice: 'nova'
  })

  // determine storage category:
  // if chat id is present then need to store in  chat attachments else in dedicated tts folder
  const category = chatId ? FILE_STORAGE_CATEGORY.chatAttachment : FILE_STORAGE_CATEGORY.ttsGen

  // save the gen audio as mp3
  const { mediaUrl, relativePath } = await saveFile({
    category,
    chatId,
    base64: audio.base64,
    extension: 'mp3'
  })

  // insert into media table; roll back the file if DB write fails
  try {
    await db.insert(media).values({
      type: 'tts',
      prompt: text,
      mediaUrl,
      relativePath,
      // fixed values @TODO will be modified later
      modelId: 'gpt-4o-mini-tts',
      provider: 'openai',
      // optional files required if tts to be linked to chat message
      chatId: chatId ?? null,
      messageId: messageId ?? null
    })
  } catch (err) {
    deleteMediaFile(relativePath)
    throw err
  }

  // send the response with the url
  return c.json({ success: true, data: { mediaUrl } }, HTTP_STATUS_CODES.OK)
}
