/**
 * @file Handlers for media upload route.
 * Uses stream-based file copying for efficient handling of large images.
 */

import { AppRouteHandler } from '../../types'
import { GetMediaRoute, UploadMediaRoute } from './media.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { saveFile } from '../../lib/file-storage'
import { MEDIA_TYPE } from '../../../common/constants/global.constants'
import db from '../../db'
import { MediaGetSchema } from '../../db/schema'

// handler for uploading media files
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

// handler for getting all the stored media by type image/video
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
    result = await db.query.media.findMany()
  } else {
    result = await db.query.media.findMany({
      where: (media, { eq }) => eq(media.type, getType as MediaGetSchema['type'])
    })
  }

  // send response once image is saved with the url , path
  return c.json(
    {
      success: true,
      data: result
    },
    HTTP_STATUS_CODES.OK
  )
}
