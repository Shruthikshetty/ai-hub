/**
 * @file Helper for creating and managing MCP clients and tools
 *
 * ref - https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools
 */
import { createMCPClient, type MCPClient } from '@ai-sdk/mcp'
import { StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio'
import db from '../db'
import { eq } from 'drizzle-orm'
import { mcpServers } from '../../common/db-schemas/mcp.schema'
import { decryptText } from '../../common/utils/encryption.util'

// types -------------

export type McpToolSet = Awaited<ReturnType<MCPClient['tools']>>

export type ActiveMcpSession = {
  tools: McpToolSet
  cleanup: () => Promise<void>
}

export type CreateMcpClientParams = {
  type: 'http' | 'stdio'
  url?: string
  command?: string | null
  authToken?: string | null
  args?: string[] | null
  cwd?: string | null
}

// utils ----------------

/**
 * Creates an MCP client based on the transport type (HTTP or stdio)
 * make sure u only pass a decrypted token
 */
export async function createMcpClientInstance(params: CreateMcpClientParams): Promise<MCPClient> {
  // handle mode http
  if (params.type === 'http') {
    if (!params.url) {
      throw new Error('http server requires a url')
    }
    return await createMCPClient({
      transport: {
        type: 'http',
        url: params.url,
        headers: params.authToken ? { Authorization: `Bearer ${params.authToken}` } : {},
        redirect: 'follow' // if a redirect user is send then follow the redirect
      }
    })
  }

  // stdio transport
  if (!params.command) {
    throw new Error('stdio server requires a command')
  }
  return await createMCPClient({
    transport: new StdioMCPTransport({
      command: params.command,
      args: params.args ?? [],
      cwd: params.cwd ?? undefined
    }),
    protocolVersionDiscovery: false // disable discover it caused issue with connecting to fast mcp
  })
}

/**
 * Tests an MCP server connection by creating a temporary client,
 * listing its tools, and immediately closing the connection.
 */
export async function testMcpConnection(params: CreateMcpClientParams): Promise<{
  success: boolean
  message: string
  tools: { name: string; description?: string }[]
}> {
  let client: MCPClient | undefined = undefined

  try {
    // create a client
    client = await createMcpClientInstance(params)

    const tools = await client.tools()

    // extract the tool list
    const toolList = Object.entries(tools).map(([name, toolDef]) => ({
      name,
      description: typeof toolDef?.description === 'string' ? toolDef.description : ''
    }))

    // return a response with the tool list
    return {
      success: true,
      message: `Connected successfully! Found ${toolList?.length} tool${toolList?.length === 1 ? '' : 's'}.`,
      tools: toolList
    }
  } finally {
    if (client) {
      try {
        // close the client
        await client.close()
      } catch (err) {
        // catch any error in closing
        console.error('[MCP] Error closing test client:', err)
      }
    }
  }
}

/**
 * Connects to all enabled MCP servers in the database, extracts tools,
 * and returns a cleanup callback
 */
export async function getActiveMcpTools(): Promise<ActiveMcpSession> {
  // get all the enabled servers from the database
  const enabledServers = await db.query.mcpServers.findMany({
    where: eq(mcpServers.enabled, true)
  })

  const clients: MCPClient[] = []
  let combinedTools: McpToolSet = {}

  // connect to all servers in parallel
  const results = await Promise.allSettled(
    enabledServers.map(async (server) => {
      // decrypt the token
      const token = server.authToken ? decryptText(server.authToken) : undefined

      // create client instance
      const client = await createMcpClientInstance({
        type: server.type as 'http' | 'stdio',
        url: server.url ?? '',
        command: server.command,
        args: server.args,
        cwd: server.cwd,
        authToken: token
      })

      // return  the tools
      const tools = await client.tools()
      return { client, tools }
    })
  )

  // collect tools from fulfilled connections
  for (const result of results) {
    if (result.status === 'fulfilled') {
      clients.push(result.value.client)
      combinedTools = { ...combinedTools, ...result.value.tools }
    } else {
      console.error('[MCP] Failed to connect to server:', result.reason)
    }
  }

  // clean up call back to close all the connections
  const cleanup = async () => {
    await Promise.allSettled(
      clients.map(async (c) => {
        try {
          await c.close()
        } catch (err) {
          console.error('[MCP] Error closing client during cleanup:', err)
        }
      })
    )
  }

  return { tools: combinedTools, cleanup }
}
