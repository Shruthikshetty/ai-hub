/**
 * @file contains all the handlers related to tts routes
 */

import { experimental_generateSpeech as generateSpeech } from 'ai'
import { AppRouteHandler } from '../../types'
import { GenerateSpeechFromTextRoute, DeleteGeneratedTTSAudioRoute } from './tts.routes'
import { saveFile, deleteMediaFile } from '../../lib/file-storage'
import { FILE_STORAGE_CATEGORY } from '../../../common/constants/global.constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import db from '../../db'
import { media } from '../../db/schema'
import { getProviderInstanceTTS } from '../../lib/get-provider-instance'
import { and, eq } from 'drizzle-orm'

// handler to generate speech from text
export const generateSpeechFromText: AppRouteHandler<GenerateSpeechFromTextRoute> = async (c) => {
  // get text, optional chatId and optional messageId from body
  const { text, chatId, messageId, model, voice } = c.req.valid('json')

  // get the provider as per user model
  const modelProvider = await getProviderInstanceTTS({
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
      modelId: model.id,
      provider: model.provider,
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

// handler to delete the generated tts audio
export const deleteGeneratedTTSAudio: AppRouteHandler<DeleteGeneratedTTSAudioRoute> = async (c) => {
  // get the id from request params
  const { id } = c.req.valid('param')

  // get the audio from db
  const ttsAudio = await db.query.media.findFirst({
    where: and(eq(media.id, id), eq(media.type, 'tts'))
  })

  // if audio is not found, return error
  if (!ttsAudio) {
    return c.json(
      {
        message: 'TTS Audio not found',
        success: false
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // delete the audio from db
  await db.delete(media).where(eq(media.id, id))
  // delete the audio from file storage
  deleteMediaFile(ttsAudio.relativePath)

  // return success response
  return c.json(
    { success: true, message: 'Successfully deleted the TTS audio' },
    HTTP_STATUS_CODES.OK
  )
}
