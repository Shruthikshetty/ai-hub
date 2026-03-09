/**
 * @file contains all the routes related to provider with Zod Open Api support
 */

import { createRoute } from '@hono/zod-openapi'
import { fetchAllProvidersResponseSchema } from '../../../common/schemas/providers.schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject, zodNotFoundDocObject } from '../../constants/doc-constants'

// create the route
export const getProviders = createRoute({
  method: 'get',
  path: '/providers',
  description: 'Get all providers',
  tags: ['Provider'],
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      description: 'Providers fetched successfully',
      content: {
        'application/json': {
          schema: fetchAllProvidersResponseSchema
        }
      }
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the route types
export type GetProvidersRoute = typeof getProviders
