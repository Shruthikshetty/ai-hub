/**
 * @file contains all the routes related to image generation with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import {
  badRequestDocObject,
  internalServerErrorDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  generateImageRequestSchema,
  generateImageResponseSchema
} from '../../../common/schemas/image-gen.schema'

// route to generate image
export const generateImage = createRoute({
  method: 'post',
  path: '/image-gen',
  description: 'Generate image',
  tags: ['Image gen'],
  summary: 'Generate image',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: generateImageRequestSchema
        }
      },
      description: 'request body for image generation'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: generateImageResponseSchema
        }
      },
      description: 'image generation success response'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GenerateImageRoute = typeof generateImage
