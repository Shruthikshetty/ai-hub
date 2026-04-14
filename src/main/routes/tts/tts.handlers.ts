/**
 * @file contains all the handlers related to tts routes
 */

import { experimental_generateSpeech as generateSpeech } from 'ai'
import { AppRouteHandler } from '../../types'
import { GenerateSpeechFromTextRoute } from './tts.routes'
import { saveFile, deleteMediaFile } from '../../lib/file-storage'
import { FILE_STORAGE_CATEGORY } from '../../../common/constants/global.constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { media } from '../../db/schema'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'

// handler to generate speech from text
export const generateSpeechFromText: AppRouteHandler<GenerateSpeechFromTextRoute> = async (c) => {
  // get text, optional chatId and optional messageId from body
  const { text, chatId, messageId, model, voice } = c.req.valid('json')

  // get the provider as per user model
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelProvider: any = await getProviderInstanceModel({
    provider: model.provider
  })

  // check if provider is capable of generating tts
  if (!modelProvider?.speech) {
    return c.json(
      {
        message: 'This provider / model is not capable of generating tts',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // generate speech @TODO will be modified and made selectable model and voice
  const { audio } = await generateSpeech({
    model: modelProvider.speech(model.id),
    text,
    voice: voice
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
