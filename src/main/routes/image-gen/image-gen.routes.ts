/**
 * @file contains all the routes related to image generation with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import {
  badRequestDocObject,
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  deleteImageResponseSchema,
  generateImageRequestSchema,
  generateImageResponseSchema
} from '../../../common/schemas/image-gen.schema'

// route to generate image
export const generateImage = createRoute({
  method: 'post',
  path: '/image-gen',
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

//route to delete the generated image
export const deleteGeneratedImage = createRoute({
  method: 'delete',
  path: '/image-gen/{id}',
  tags: ['Image gen'],
  summary: 'Delete generated image',
  request: {
    params: z.object({
      id: z.coerce
        .number()
        .positive()
        .openapi({
          param: {
            name: 'id',
            in: 'path',
            required: true,
            description: 'generated media id'
          },
          example: 2
        })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: deleteImageResponseSchema
        }
      },
      description: 'image deletion success response'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GenerateImageRoute = typeof generateImage
export type DeleteGeneratedImageRoute = typeof deleteGeneratedImage
