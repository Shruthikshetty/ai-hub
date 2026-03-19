/**
 * @file Route definitions for media upload with Zod OpenAPI support.
 * File serving is handled by the custom media:// protocol in the main process,
 * NOT through Hono routes — so no serving route is defined here.
 */

import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  getMediaResponseSchema,
  mediaUploadResponseSchema,
  mediaUploadSchema
} from '../../../common/schemas/media.schema'
import { MEDIA_REQUEST_TYPES } from '../../../common/constants/global.constants'

// used to upload a media
export const uploadMedia = createRoute({
  tags: ['Media'],
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

// get all the stored media by type image/video
export const getMedia = createRoute({
  tags: ['Media'],
  method: 'get',
  path: '/media/{type}',
  request: {
    params: z.object({
      type: z
        .enum(MEDIA_REQUEST_TYPES)
        .default('all')
        .openapi({
          param: {
            name: 'type',
            in: 'path',
            required: true,
            description: 'type of media'
          },
          example: 'all'
        })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: getMediaResponseSchema
        }
      },
      description: 'Media items retrieved successfully'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

//types all types
export type UploadMediaRoute = typeof uploadMedia
export type GetMediaRoute = typeof getMedia
