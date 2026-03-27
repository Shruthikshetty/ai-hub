/**
 * @file Handlers for media upload route.
 * Uses stream-based file copying for efficient handling of large images.
 */

import { AppRouteHandler } from '../../types'
import { DeleteMediaRoute, GetMediaRoute, UploadMediaRoute } from './media.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { deleteMediaFile, saveFile } from '../../lib/file-storage'
import { MEDIA_TYPE } from '../../../common/constants/global.constants'
import db from '../../db'
import { media, MediaGetSchema } from '../../db/schema'
import { desc } from 'drizzle-orm'

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

// handler for getting all the stored media by type image/video (db fetch)
export const getMedia: AppRouteHandler<GetMediaRoute> = async (c) => {
  const { type } = c.req.valid('param')

  let getType = 'all'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (MEDIA_TYPE.includes(type as any)) {
    getType = type
  }

  // get media items from db
  let result: MediaGetSchema[] = []
  if (getType === 'all') {
    result = await db.query.media.findMany({
      orderBy: [desc(media.createdAt)]
    })
  } else {
    result = await db.query.media.findMany({
      where: (media, { eq }) => eq(media.type, getType as MediaGetSchema['type']),
      orderBy: [desc(media.createdAt)]
    })
  }

  // send response with retrieved media items
  return c.json(
    {
      success: true,
      data: result
    },
    HTTP_STATUS_CODES.OK
  )
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
