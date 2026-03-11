/**
 * @file Route definitions for media upload with Zod OpenAPI support.
 * File serving is handled by the custom media:// protocol in the main process,
 * NOT through Hono routes — so no serving route is defined here.
 */

import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import { mediaUploadResponseSchema, mediaUploadSchema } from '../../../common/schemas/media.schema'

// used to upload a media
export const uploadMedia = createRoute({
  tags: ['media'],
  method: 'post',
  path: '/media/upload',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: mediaUploadSchema
        }
      },
      description: 'Source file path and storage category for saving the media'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: mediaUploadResponseSchema
        }
      },
      description: 'File uploaded successfully'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

//types all types
export type UploadMediaRoute = typeof uploadMedia
