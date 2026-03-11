/**
 * @file contains all the routes related to provider with Zod Open Api support
 */

import { createRoute, z } from '@hono/zod-openapi'
import {
  fetchAllProvidersResponseSchema,
  patchProviderResponseSchema
} from '../../../common/schemas/providers.schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject, zodNotFoundDocObject } from '../../constants/doc-constants'
import { providerPatchSchema } from '../../../common/db-schemas/provider.schema'

// route to get all providers
export const getProviders = createRoute({
  method: 'get',
  path: '/provider',
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

// route to patch a provider by id
export const patchProviderById = createRoute({
  method: 'patch',
  path: '/provider/{id}',
  description: 'Update provider by id',
  tags: ['Provider'],
  request: {
    params: z.object({
      id: z.coerce.number().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'provider id'
        },
        example: 2
      })
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: providerPatchSchema
        }
      },
      description: 'request body for update provider route'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      description: 'Provider updated successfully',
      content: {
        'application/json': {
          schema: patchProviderResponseSchema
        }
      }
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export all the route types
export type GetProvidersRoute = typeof getProviders
export type PatchProviderByIdRoute = typeof patchProviderById
