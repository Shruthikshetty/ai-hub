/**
 * @file contains all the routes related to chat with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { z } from 'zod'
import { zodValidationErrorDocObject } from '../../constants/doc-constants'

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
            messages: z.any()
          })
        }
      },
      description: 'request body for chat route'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: z.any()
        }
      },
      description: 'success response for chat route'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject
  }
})

// export all types
export type StreamChatRoute = typeof streamChat
