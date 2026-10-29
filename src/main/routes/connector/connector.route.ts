/**
 *  @file contains all the routes related to connection with Zod Open Api support
 */

import { createRoute } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { internalServerErrorDocObject } from '../../constants/doc-constants'
import { fetchAllConnectorResponseSchema } from '../../../common/schemas/connector.schema'

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

// export types
export type GetConnectorsRoute = typeof getConnectors
