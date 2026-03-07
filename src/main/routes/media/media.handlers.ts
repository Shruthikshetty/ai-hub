/**
 * @file Handlers for media upload route.
 * Uses stream-based file copying for efficient handling of large images.
 */

import { AppRouteHandler } from '../../types'
import { UploadMediaRoute } from './media.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { saveFile } from '../../lib/file-storage'

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
    HTTP_STATUS_CODES.OK
  )
}
