/**
 *  @file contains all the routes related to connection with Zod Open Api support
 */

import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  fetchAllConnectorResponseSchema,
  updateConnectorResponseSchema,
  createConnectorResponseSchema,
  deleteConnectorResponseSchema,
  startConnectorResponseSchema
} from '../../../common/schemas/connector.schema'
import {
  connectorInsertSchema,
  connectorUpdateSchema
} from '../../../common/db-schemas/connector.schema'

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

// route to create a connector
export const createConnector = createRoute({
  tags: ['Connector'],
  method: 'post',
  path: '/connector',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: connectorInsertSchema
        }
      },
      description: 'request body for creating a connector'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: createConnectorResponseSchema
        }
      },
      description: 'Connector created successfully'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
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

// route to delete a connector by primary key (name)
export const deleteConnectorByName = createRoute({
  tags: ['Connector'],
  method: 'delete',
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
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: deleteConnectorResponseSchema
        }
      },
      description: 'Connector deleted successfully'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to start a connector (starts long polling for the connector)
export const startConnectorByName = createRoute({
  tags: ['Connector'],
  method: 'post',
  path: '/connector/{name}/start',
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
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: startConnectorResponseSchema
        }
      },
      description: 'Connector started successfully'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export types
export type GetConnectorsRoute = typeof getConnectors
export type CreateConnectorRoute = typeof createConnector
export type PatchConnectorByNameRoute = typeof patchConnectorByName
export type DeleteConnectorByNameRoute = typeof deleteConnectorByName
export type StartConnectorByNameRoute = typeof startConnectorByName
