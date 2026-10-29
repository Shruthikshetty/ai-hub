/**
 *  @file contains all the routes related to connection with Zod Open Api support
 */

import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject, zodNotFoundDocObject } from '../../constants/doc-constants'
import {
  fetchAllConnectorResponseSchema,
  updateConnectorResponseSchema
} from '../../../common/schemas/connector.schema'
import { connectorUpdateSchema } from '../../../common/db-schemas/connector.schema'

// route to get all connectors
export const getConnectors = createRoute({
  tags: ['Connector'],
  method: 'get',
  path: '/connector',
  request: {},
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: fetchAllConnectorResponseSchema
        }
      },
      description: 'success response for getting all connectors'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to patch a connector by primary key (name)
export const patchConnectorByName = createRoute({
  tags: ['Connector'],
  method: 'patch',
  path: '/connector/{name}',
  request: {
    params: z.object({
      name: z.string().openapi({
        param: {
          name: 'name',
          in: 'path',
          required: true,
          description: 'connector name (e.g. telegram)'
        },
        example: 'telegram'
      })
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: connectorUpdateSchema
        }
      },
      description: 'request body for updating connector'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: updateConnectorResponseSchema
        }
      },
      description: 'Connector updated successfully'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export types
export type GetConnectorsRoute = typeof getConnectors
export type PatchConnectorByNameRoute = typeof patchConnectorByName
