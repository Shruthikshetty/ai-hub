/**
 * @file Handlers for media upload route.
 * Uses stream-based file copying for efficient handling of large images.
 */

import { AppRouteHandler } from '../../types'
import {
  DeleteMediaRoute,
  GetMediaByMessageIdRoute,
  GetMediaRoute,
  UploadMediaRoute
} from './media.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { deleteMediaFile, saveFile } from '../../lib/file-storage'
import { MEDIA_TYPE } from '../../../common/constants/global.constants'
import db from '../../db'
import { media, MediaGetSchema } from '../../db/schema'
import { and, desc, eq, isNull, ne, or } from 'drizzle-orm'

// handler for uploading media files (local non db)
export const uploadMedia: AppRouteHandler<UploadMediaRoute> = async (c) => {
  const { sourcePath, category } = c.req.valid('json')

  // do a stream copy and save the image in app storage
  const result = await saveFile({ sourcePath, category })

  // send response once image is saved with the url , path
  return c.json(
    {
      success: true,
      data: {
        relativePath: result.relativePath,
        mediaUrl: result.mediaUrl
      }
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler for getting all the stored media by type image/video  from db
export const getMedia: AppRouteHandler<GetMediaRoute> = async (c) => {
  const { type } = c.req.valid('param')

  // default fetch all
  let getType = 'all'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (MEDIA_TYPE.includes(type as any)) {
    // if a valid type is passed set it
    getType = type
  }

  // build the where condition based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let where: any
  switch (getType) {
    case 'all':
      // Include non-tts media, and only include TTS if it's standalone (no chatId)
      where = or(ne(media.type, 'tts'), isNull(media.chatId))
      break
    case 'tts':
      // standalone voice-gen only — chatId IS NULL filters out chat-context TTS
      where = and(eq(media.type, 'tts'), isNull(media.chatId))
      break
    default:
      // image / video — exact match
      where = eq(media.type, getType as MediaGetSchema['type'])
  }

  // get all the media files from db based on the where condition
  const result = await db.query.media.findMany({
    where,
    orderBy: [desc(media.createdAt)]
  })

  // send response with the media files
  return c.json({ success: true, data: result }, HTTP_STATUS_CODES.OK)
}

// handler for deleting a media file (local non db )
export const deleteMedia: AppRouteHandler<DeleteMediaRoute> = async (c) => {
  // get the relative path from the request body
  const { relativePath } = c.req.valid('json')

  // delete the media file from the app storage
  const deleted = deleteMediaFile(relativePath)

  // send response with the deleted status
  return c.json(
    {
      success: deleted,
      message: deleted ? 'Media deleted successfully' : 'Media not found'
    },
    deleted ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.NOT_FOUND
  )
}

// handler to get a media record by messageId if a file was saved with messageId
export const getMediaByMessageId: AppRouteHandler<GetMediaByMessageIdRoute> = async (c) => {
  const { messageId } = c.req.valid('param')

  // get the record from db
  const record = await db.query.media.findFirst({
    where: eq(media.messageId, messageId)
  })

  // if no record found return null
  if (!record) {
    return c.json(
      {
        success: false,
        message: 'Media not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // send response with the record
  return c.json(
    {
      success: true,
      data: record
    },
    HTTP_STATUS_CODES.OK
  )
}
