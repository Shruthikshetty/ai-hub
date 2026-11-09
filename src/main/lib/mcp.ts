/**
 * @file Helper for creating and managing MCP clients and tools
 *
 * ref - https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools
 */
import { createMCPClient, type MCPClient } from '@ai-sdk/mcp'
import { StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio'
import { withTimeout } from '../../common/utils/async.util'

// types -------------

export type McpToolSet = Awaited<ReturnType<MCPClient['tools']>>

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
export async function testMcpConnection(
  params: CreateMcpClientParams,
  timeoutMs = 10000
): Promise<{
  success: boolean
  message: string
  tools: { name: string; description?: string }[]
}> {
  return await withTimeout(
    async (onCleanup) => {
      // create a client and immediately register its cleanup
      const client = await createMcpClientInstance(params)
      onCleanup(() => client.close())

      // get the tools
      const tools = await client.tools()

      // extract the tool list
      const toolList = Object.entries(tools).map(([name, toolDef]) => ({
        name,
        description: typeof toolDef?.description === 'string' ? toolDef.description : ''
      }))

      // return a response with the tool list
      return {
        success: true,
        message: `Connected successfully! Found ${toolList.length} tool${toolList.length === 1 ? '' : 's'}.`,
        tools: toolList
      }
    },
    {
      timeoutMs,
      errorMessage: `Connection timed out after ${timeoutMs / 1000}s. Check your command, arguments, or URL.`
    }
  )
}
