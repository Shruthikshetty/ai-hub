/**
 * @file Contains all the handlers related to MCP routes
 */
import { eq } from 'drizzle-orm'
import db from '../../db'
import { AppRouteHandler } from '../../types'
import {
  GetMcpServersRoute,
  CreateMcpServerRoute,
  PatchMcpServerByIdRoute,
  DeleteMcpServerByIdRoute,
  TestMcpServerRoute
} from './mcp.routes'
import { mcpServers } from '../../db/schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { decryptText, encryptText } from '../../../common/utils/encryption.util'
import { testMcpConnection } from '../../lib/mcp'
import { mcpService } from '../../services/mcp/mcp.service'

// handler to fetch all MCP servers
export const fetchMcpServers: AppRouteHandler<GetMcpServersRoute> = async (c) => {
  // fetch all the mcp servers
  const allServers = await db.query.mcpServers.findMany()

  // Decrypt auth token so the UI can display masked or edited value
  const data = allServers.map((server) => ({
    ...server,
    authToken: server.authToken ? decryptText(server.authToken) : ''
  }))

  // send the response
  return c.json(
    {
      success: true,
      data
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to create a new MCP server
export const createMcpServer: AppRouteHandler<CreateMcpServerRoute> = async (c) => {
  const body = c.req.valid('json')

  // Encrypt auth token if provided
  if (body.authToken) {
    body.authToken = encryptText(body.authToken)
  }

  // create a new mcp server (unique constraint violations are handled by global errorHandler)
  const [newServer] = await db.insert(mcpServers).values(body).returning()

  if (!newServer) {
    return c.json(
      {
        success: false,
        message: 'Failed to create MCP server'
      },
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    )
  }

  // Auto-connect if newly created server is enabled
  if (newServer.enabled) {
    mcpService.start(newServer).catch((err) => {
      console.error('[MCP Route] Error starting new server:', err)
    })
  }

  // send success response
  return c.json(
    {
      success: true,
      data: {
        ...newServer,
        authToken: newServer.authToken ? decryptText(newServer.authToken) : ''
      },
      message: 'MCP server added successfully'
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler to update an MCP server by ID
export const updateMcpServer: AppRouteHandler<PatchMcpServerByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const newData = c.req.valid('json')

  // Encrypt the authToken if it is being updated and is not empty
  if (newData.authToken) {
    newData.authToken = encryptText(newData.authToken)
  }

  // update the db
  const [updatedServer] = await db
    .update(mcpServers)
    .set(newData)
    .where(eq(mcpServers.id, id))
    .returning()

  //in case the mcp record is not found or already deleted
  if (!updatedServer) {
    return c.json(
      {
        success: false,
        message: `MCP server with ID '${id}' not found`
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // Reload the server connection in the background (or stop if disabled)
  mcpService.restart(updatedServer).catch((err) => {
    console.error('[MCP Route] Error restarting updated server:', err)
  })

  //return post successfully updating
  return c.json(
    {
      success: true,
      data: {
        ...updatedServer,
        authToken: updatedServer.authToken ? decryptText(updatedServer.authToken) : ''
      },
      message: 'MCP server updated successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to delete an MCP server by ID
export const deleteMcpServer: AppRouteHandler<DeleteMcpServerByIdRoute> = async (c) => {
  const { id } = c.req.valid('param')

  // delete from db
  const [deletedServer] = await db.delete(mcpServers).where(eq(mcpServers.id, id)).returning()

  // if deletion failed
  if (!deletedServer) {
    return c.json(
      {
        success: false,
        message: `MCP server with ID '${id}' not found`
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // Disconnect client and remove from active pool
  mcpService.stop(id).catch((err) => {
    console.error('[MCP Route] Error stopping deleted server:', err)
  })

  // send success response
  return c.json(
    {
      success: true,
      message: 'MCP server deleted successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to test an MCP server connection
export const testMcpServer: AppRouteHandler<TestMcpServerRoute> = async (c) => {
  const body = c.req.valid('json')

  try {
    // run a test on the mcp data provided
    const result = await testMcpConnection({
      type: body.type,
      url: body.url ?? undefined,
      command: body.command,
      args: body.args,
      cwd: body.cwd,
      authToken: body.authToken
    })

    // if success send response
    return c.json(
      {
        success: true,
        message: result.message,
        tools: result.tools
      },
      HTTP_STATUS_CODES.OK
    )
  } catch (error) {
    // check the error type testMcpConnection throw errors with message in case message exist show that
    const message = error instanceof Error ? error.message : 'Failed to connect to MCP server'
    return c.json(
      {
        success: false,
        message,
        tools: []
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }
}
