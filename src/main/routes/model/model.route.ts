/**
 * @file contains all the routes related to models with Zod Open Api support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject } from '../../constants/doc-constants'
import { ModelIOSchema, modelResponseSchema } from '../../../common/schemas/model.schema'
import { modalitySchema, modelsGetSchema } from '../../../common/db-schemas/model.schema'

/* route to get all the list of models available
 * @deprecated used v2
 */
export const getModels = createRoute({
  method: 'get',
  path: '/model',
  tags: ['Model'],
  summary: 'Get all the list of models available',
  deprecated: true,
  request: {
    query: z.object({
      output: ModelIOSchema.optional()
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: modelResponseSchema
        }
      },
      description: 'Success response of get all models'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to get all models available from local database (v2)
export const getModelsV2 = createRoute({
  method: 'get',
  path: '/v2/model',
  tags: ['Model'],
  summary: 'Get all models available from local database',
  request: {
    query: z.object({
      output: modalitySchema.optional(),
      providerId: z.string().optional()
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.array(modelsGetSchema)
          })
        }
      },
      description: 'Success response of get all models'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the types
export type GetModelsRoute = typeof getModels
export type GetModelsV2Route = typeof getModelsV2
