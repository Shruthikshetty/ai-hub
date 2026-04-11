/**
 * @file contains all the routes related to video generation with Zod Open Api support
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
  deleteVideoResponseSchema,
  generateVideoRequestSchema,
  generateVideoResponseSchema
} from '../../../common/schemas/video-gen.schema'

// route to generate video
export const generateVideo = createRoute({
  method: 'post',
  path: '/video-gen',
  tags: ['Video gen'],
  summary: 'Generate video',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: generateVideoRequestSchema
        }
      },
      description: 'request body for video generation'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: generateVideoResponseSchema
        }
      },
      description: 'video generation success response'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

//route to delete the generated video
export const deleteGeneratedVideo = createRoute({
  method: 'delete',
  path: '/video-gen/{id}',
  tags: ['Video gen'],
  summary: 'Delete generated video',
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
          schema: deleteVideoResponseSchema
        }
      },
      description: 'video deletion success response'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GenerateVideoRoute = typeof generateVideo
export type DeleteGeneratedVideoRoute = typeof deleteGeneratedVideo
