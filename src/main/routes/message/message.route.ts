/**
 *  @file contains all the routes related to message with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  addMessageResponseSchema,
  getMessageByIdResponseSchema
} from '../../../common/schemas/messages.schema'
import { messagesInsertSchema } from '../../../common/db-schemas/message.schema'

// route to get message by id
export const getMessage = createRoute({
  tags: ['Message'],
  method: 'get',
  path: '/message/{id}',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'message id'
        },
        example: '123'
      })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: getMessageByIdResponseSchema
        }
      },
      description: 'success response for getting a message by id'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

//route to add messages
export const addMessage = createRoute({
  tags: ['Message'],
  method: 'post',
  path: '/message',
  request: {
    body: {
      content: {
        'application/json': {
          schema: messagesInsertSchema
        }
      },
      required: true
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: addMessageResponseSchema
        }
      },
      description: 'success response for adding a message'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GetMessageRoute = typeof getMessage
export type AddMessageRoute = typeof addMessage
