/**
 * @file contains all the routes related to tts with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  generateSpeechFromTextRequestSchema,
  generateSpeechFromTextResponseSchema
} from '../../../common/schemas/tts.schema'
import { badRequestDocObject, internalServerErrorDocObject } from '../../constants/doc-constants'

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

// export all the route types
export type GenerateSpeechFromTextRoute = typeof generateSpeechFromText
