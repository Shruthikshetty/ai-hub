/**
 *  @file contains all the routes related to message with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject, zodNotFoundDocObject } from '../../constants/doc-constants'
import { messagesSchema } from '../../../common/db-schemas/message.schema'

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
          schema: z.object({
            success: z.boolean(),
            data: messagesSchema
          })
        }
      },
      description: 'success response for getting a message by id'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all types
export type GetMessageRoute = typeof getMessage
