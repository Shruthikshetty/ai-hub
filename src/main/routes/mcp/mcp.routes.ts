/**
 * @file Contains all the routes related to MCP servers with Zod OpenAPI support
 */
import { createRoute, z } from '@hono/zod-openapi'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  badRequestDocObject,
  conflictDocObject,
  internalServerErrorDocObject,
  zodNotFoundDocObject,
  zodValidationErrorDocObject
} from '../../constants/doc-constants'
import {
  fetchAllMcpServersResponseSchema,
  createMcpServerResponseSchema,
  updateMcpServerResponseSchema,
  deleteMcpServerResponseSchema,
  testMcpServerRequestSchema,
  testMcpServerResponseSchema
} from '../../../common/schemas/mcp.schema'
import { mcpServerInsertSchema, mcpServerUpdateSchema } from '../../../common/db-schemas/mcp.schema'

// route to get all MCP servers
export const getMcpServers = createRoute({
  tags: ['MCP'],
  method: 'get',
  path: '/mcp',
  description: 'Get all configured MCP servers',
  request: {},
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: fetchAllMcpServersResponseSchema
        }
      },
      description: 'List of all MCP servers'
    },
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to create an MCP server
export const createMcpServer = createRoute({
  tags: ['MCP'],
  method: 'post',
  path: '/mcp',
  description: 'Add a new MCP server',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: mcpServerInsertSchema
        }
      },
      description: 'Data for creating a new MCP server'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: {
      content: {
        'application/json': {
          schema: createMcpServerResponseSchema
        }
      },
      description: 'MCP server created successfully'
    },
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.CONFLICT]: conflictDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to patch an MCP server by id
export const patchMcpServerById = createRoute({
  tags: ['MCP'],
  method: 'patch',
  path: '/mcp/{id}',
  description: 'Update an MCP server by ID',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'MCP server ID'
        },
        example: 'mcp_xyz123'
      })
    }),
    body: {
      required: true,
      content: {
        'application/json': {
          schema: mcpServerUpdateSchema
        }
      },
      description: 'Data to update on MCP server'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: updateMcpServerResponseSchema
        }
      },
      description: 'MCP server updated successfully'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to delete an MCP server by id
export const deleteMcpServerById = createRoute({
  tags: ['MCP'],
  method: 'delete',
  path: '/mcp/{id}',
  description: 'Delete an MCP server by ID',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true,
          description: 'MCP server ID'
        },
        example: 'mcp_xyz123'
      })
    })
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: deleteMcpServerResponseSchema
        }
      },
      description: 'MCP server deleted successfully'
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: zodNotFoundDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// route to test an MCP server connection
export const testMcpServer = createRoute({
  tags: ['MCP'],
  method: 'post',
  path: '/mcp/test',
  description: 'Test an MCP server connection and list its tools',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: testMcpServerRequestSchema
        }
      },
      description: 'Connection parameters to test'
    }
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: {
      content: {
        'application/json': {
          schema: testMcpServerResponseSchema
        }
      },
      description: 'Test result and discovered tools'
    },
    [HTTP_STATUS_CODES.BAD_REQUEST]: badRequestDocObject,
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: zodValidationErrorDocObject,
    [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: internalServerErrorDocObject
  }
})

// export route types for AppRouteHandler
export type GetMcpServersRoute = typeof getMcpServers
export type CreateMcpServerRoute = typeof createMcpServer
export type PatchMcpServerByIdRoute = typeof patchMcpServerById
export type DeleteMcpServerByIdRoute = typeof deleteMcpServerById
export type TestMcpServerRoute = typeof testMcpServer
