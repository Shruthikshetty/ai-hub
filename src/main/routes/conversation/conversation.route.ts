/**
 *  @file contains all the routes related to conversation with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  createConversationResponseSchema,
  fetchAllConversationsResponseSchema
} from '../../../common/schemas/conversation'
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

// export all types
export type GetConversationRoute = typeof getConversation
export type CreateConversationRoute = typeof createConversation
