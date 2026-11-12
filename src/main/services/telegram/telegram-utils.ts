import { Context } from 'grammy'
import path from 'node:path'
import axios, { AxiosError } from 'axios'
import { saveFile } from '../../lib/file-storage'
import { FILE_STORAGE_CATEGORY } from '../../../common/constants/global.constants'
import { MessagePartsType } from '../../../common/schemas/messages.schema'
import { isAllowedBotAttachment, resolveBotAttachmentMimeType } from '../../lib/connector-utils'

// types
export interface DownloadTelegramAttachmentResult {
  attachment?: MessagePartsType
  ignoredNotice?: string
  error?: string
}

/**
 * Downloads and saves incoming Telegram media (photo or allowed document)
 * into local file storage and returns a file message part.
 * If an unsupported format is sent, returns an ignoredNotice.
 */
export async function downloadTelegramAttachment(
  ctx: Context,
  token: string
): Promise<DownloadTelegramAttachmentResult | null> {
  const msg = ctx.message
  if (!msg) return null

  const photo = msg.photo
  const document = msg.document

  // If not photo or document, but other media (voice, audio, video, etc.)
  if (!photo && !document) {
    if (msg.voice || msg.audio || msg.video) {
      return {
        ignoredNotice: '⚠️ The attachment is not supported, so it was ignored.'
      }
    }
    return null
  }

  // Pre-check document file size (Telegram Bot API getFile limit is 20MB)
  if (document?.file_size && document.file_size > 20 * 1024 * 1024) {
    return {
      error:
        '⚠️ File too large. Telegram bot can only download files under 20MB. Please send a smaller attachment.'
    }
  }

  // Extract extension, filename, and MIME type up front
  let ext = ''
  let fileName = 'file'
  let mediaType = ''

  if (photo) {
    // Telegram re-encodes photos as JPEG
    ext = 'jpg'
    fileName = 'photo.jpg'
    mediaType = 'image/jpeg'
  } else if (document) {
    fileName = document.file_name || 'document'
    ext = path.extname(fileName).replace('.', '').toLowerCase()
    mediaType = resolveBotAttachmentMimeType(ext, document.mime_type)
  }

  // Validate allowed file type (image, text, pdf)
  if (!isAllowedBotAttachment(mediaType, ext)) {
    return {
      ignoredNotice: '⚠️ The attachment is not supported, so it was ignored.'
    }
  }

  try {
    // get file path
    const file = await ctx.getFile()
    if (!file.file_path) {
      console.warn('[TelegramBot] File path not available from Telegram')
      return {
        error: '⚠️ Could not retrieve the file from Telegram. Please try again.'
      }
    }

    // download and store the attachment
    const downloadUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`
    const response = await axios.get<ArrayBuffer>(downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 60_000 // 60 seconds timeout for file download
    })
    const buffer = Buffer.from(response.data)

    const { mediaUrl } = await saveFile({
      category: FILE_STORAGE_CATEGORY.chatAttachment,
      base64: buffer.toString('base64'),
      extension: ext
    })

    // return attachment
    return {
      attachment: {
        type: 'file',
        mediaType,
        url: mediaUrl,
        filename: fileName
      }
    }
  } catch (err) {
    const error = err as AxiosError<Error>
    console.error('[TelegramBot] Failed to download or save attachment:', {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data
    })
    return {
      error:
        '⚠️ Failed to download the attachment from Telegram (files must be under 20MB). Please try again.'
    }
  }
}
