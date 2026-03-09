/**
 * @file contains all the routes related to chat with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { z } from 'zod'
import {
  badRequestDocObject,
  internalServerErrorDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import { UIMessageSchema } from '../../../common/schemas/messages'
import { modelSchema } from '../../../common/schemas/model.schema'

// route to stream chat response
export const streamChat = createRoute({
  tags: ['chat'],
  method: 'post',
  path: '/chat',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: z.object({
            messages: UIMessageSchema.array(),
            model: modelSchema
          })
        }
      },
      description: 'request body for chat route'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'text/plain': {
          schema: z.string() // we are streaming text
        }
      },
      description: 'success response for chat route'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type StreamChatRoute = typeof streamChat
