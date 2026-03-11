/**
 *  @file contains all the routes related to conversation with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  createConversationResponseSchema,
  deleteConversationByIdSchema,
  fetchAllConversationsResponseSchema
} from '../../../common/schemas/conversation.schema'
import { conversationsInsertSchema } from '../../../common/db-schemas/conversation.schema'

export const getConversation = createRoute({
  tags: ['Conversation'],
  method: 'get',
  path: '/conversation',
  request: {},
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: fetchAllConversationsResponseSchema
        }
      },
      description: 'success response for getting all conversations'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

export const createConversation = createRoute({
  tags: ['Conversation'],
  method: 'post',
  path: '/conversation',
  request: {
    body: {
      content: {
        'application/json': {
          schema: conversationsInsertSchema
        }
      },
      required: true
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: createConversationResponseSchema
        }
      },
      description: 'success response for creating a conversation'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// delete a conversation by id
export const deleteConversation = createRoute({
  tags: ['Conversation'],
  method: 'delete',
  path: '/conversation/{id}',
  request: {
    params: z.object({
      id: z.coerce.number().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'conversation id'
        },
        example: 2
      })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: deleteConversationByIdSchema
        }
      },
      description: 'success response for creating a conversation'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GetConversationRoute = typeof getConversation
export type CreateConversationRoute = typeof createConversation
export type DeleteConversationRoute = typeof deleteConversation
