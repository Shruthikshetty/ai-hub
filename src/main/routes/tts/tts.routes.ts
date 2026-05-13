/**
 * @file contains all the routes related to tts with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  generateSpeechFromTextRequestSchema,
  generateSpeechFromTextResponseSchema,
  deleteTTSAudioResponseSchema
} from '../../../common/schemas/tts.schema'
import {
  badRequestDocObject,
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'

// route to generate speech from text
export const generateSpeechFromText = createRoute({
  method: 'post',
  path: '/tts',
  description: 'Generate speech from text',
  tags: ['TTS'],
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: generateSpeechFromTextRequestSchema
        }
      }
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      description: 'Speech generated successfully',
      content: {
        'application/json': {
          schema: generateSpeechFromTextResponseSchema
        }
      }
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to delete the generated tts audio
export const deleteGeneratedTTSAudio = createRoute({
  method: 'delete',
  path: '/tts/{id}',
  description: 'Delete generated tts audio',
  tags: ['TTS'],
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
      description: 'TTS audio deletion success response',
      content: {
        'application/json': {
          schema: deleteTTSAudioResponseSchema
        }
      }
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the route types
export type GenerateSpeechFromTextRoute = typeof generateSpeechFromText
export type DeleteGeneratedTTSAudioRoute = typeof deleteGeneratedTTSAudio
