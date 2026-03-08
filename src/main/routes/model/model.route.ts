/**
 * @file contains all the routes related to models with Zod Open Api support
 */
import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject } from '../../constants/doc-constants'
import { modelSchema } from '../../../common/schemas/model.schema'

// route to get all the list of models available
export const getModels = createRoute({
  method: 'get',
  path: '/models',
  tags: ['Model'],
  summary: 'Get all the list of models available',
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelSchema.array()
        }
      },
      description: 'Success response of get all models'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the types
export type GetModelsRoute = typeof getModels
