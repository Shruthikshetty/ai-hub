/**
 *  @file contains all the routes related to conversation with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject } from '../../constants/doc-constants'
import { fetchAllConversationsResponseSchema } from '../../../common/schemas/conversation'

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

// export all types
export type GetConversationRoute = typeof getConversation
