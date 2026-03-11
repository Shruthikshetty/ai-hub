/**
 *  @file contains all the routes related to conversation with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { z } from 'zod'
import { internalServerErrorDocObject } from '../../constants/doc-constants'
import { conversationsSchema } from '../../../common/db-schemas/conversation.schema'

export const getConversation = createRoute({
  tags: ['Conversation'],
  method: 'get',
  path: '/conversation',
  request: {},
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: conversationsSchema.array()
          })
        }
      },
      description: 'success response for getting all conversations'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GetConversationRoute = typeof getConversation
