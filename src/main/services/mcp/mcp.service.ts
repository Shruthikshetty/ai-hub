import { MCPClient } from '@ai-sdk/mcp'
import db from '../../db'
import { eq } from 'drizzle-orm'
import { mcpServers, McpGetSchema } from '../../../common/db-schemas/mcp.schema'
import { decryptText } from '../../../common/utils/encryption.util'
import { KeyedAsyncQueue } from '../../../common/utils/async.util'
import { createMcpClientInstance, McpToolSet } from '../../lib/mcp'

// types
type ActiveServerEntry = {
  server: McpGetSchema
  client: MCPClient
  tools: McpToolSet
}

/**
 * Service for managing persistent in-memory MCP server connections and tools.
 * This is useful so that we don't create a instance on every request
 */
class McpService {
  // store for all mcp servers
  private activeServers = new Map<string, ActiveServerEntry>()
  // FIFO queue per server ID to serialize start/stop/restart operations
  private queue = new KeyedAsyncQueue()

  /**
   * Start an MCP server connection, extract tools, and cache in memory
   */
  public async start(serverOrId: McpGetSchema | string): Promise<boolean> {
    const id = typeof serverOrId === 'string' ? serverOrId : serverOrId.id
    return this.queue.run(id, () => this.doStart(serverOrId))
  }

  /**
   * Stop an active MCP server and close its transport/process
   */
  public async stop(serverId: string): Promise<void> {
    return this.queue.run(serverId, () => this.doStop(serverId))
  }

  /**
   * Restart an MCP server with updated configuration, or stop if disabled/deleted
   */
  public async restart(serverOrId: McpGetSchema | string): Promise<boolean> {
    const id = typeof serverOrId === 'string' ? serverOrId : serverOrId.id
    return this.queue.run(id, async () => {
      const server =
        typeof serverOrId === 'string'
          ? await db.query.mcpServers.findFirst({
              where: eq(mcpServers.id, serverOrId)
            })
          : serverOrId

      // If deleted from DB or toggled OFF, ensure it is stopped
      if (!server || !server.enabled) {
        await this.doStop(id)
        return false
      }

      // start
      return await this.doStart(server)
    })
  }

  private async doStart(serverOrId: McpGetSchema | string): Promise<boolean> {
    let server: McpGetSchema | undefined

    // fetch server if id is passed
    if (typeof serverOrId === 'string') {
      server = await db.query.mcpServers.findFirst({
        where: eq(mcpServers.id, serverOrId)
      })
    } else {
      server = serverOrId
    }

    if (!server) {
      return false
    }

    if (!server.enabled) {
      return false
    }

    // If already running, cleanly close previous connection before reconnecting
    if (this.activeServers.has(server.id)) {
      await this.doStop(server.id)
    }

    // start a connecting
    try {
      const token = server.authToken ? decryptText(server.authToken) : undefined
      // create a client instance
      const client = await createMcpClientInstance({
        type: server.type as 'http' | 'stdio',
        url: server.url ?? '',
        command: server.command,
        args: server.args,
        cwd: server.cwd,
        authToken: token
      })

      // get the tools from the client
      const tools = await client.tools()
      // set in store
      this.activeServers.set(server.id, { server, client, tools })

      return true
    } catch (error) {
      console.error(`[MCP Service] Failed to start server "${server.name}":`, error)
      return false
    }
  }

  private async doStop(serverId: string): Promise<void> {
    const entry = this.activeServers.get(serverId)
    if (!entry) return
    // delete from store
    this.activeServers.delete(serverId)
    // close the connection
    try {
      await entry.client.close()
    } catch (error) {
      console.error(`[MCP Service] Error closing client for "${entry.server.name}":`, error)
    }
  }

  /**
   * Start all enabled MCP servers in parallel (called on startup)
   */
  public async startAll(): Promise<void> {
    try {
      const enabledServers = await db.query.mcpServers.findMany({
        where: eq(mcpServers.enabled, true)
      })

      if (!enabledServers.length) {
        return
      }
      // start all
      await Promise.allSettled(enabledServers.map((server) => this.start(server)))
    } catch (error) {
      console.error('[MCP Service] Failed to query enabled servers on startup:', error)
    }
  }

  /**
   * Stop all active MCP servers (called on shutdown)
   */
  public async stopAll(): Promise<void> {
    const ids = Array.from(this.activeServers.keys())
    // stop all at once
    await Promise.allSettled(ids.map((id) => this.stop(id)))
    this.activeServers.clear()
  }

  /**
   * Returns all active tools cached in memory with 0ms latency
   */
  public getTools(): McpToolSet {
    let combined: McpToolSet = {}
    for (const entry of this.activeServers.values()) {
      try {
        combined = { ...combined, ...entry.tools }
      } catch (err) {
        console.error(`[MCP Service] Error getting tools from "${entry.server.name}":`, err)
      }
    }
    return combined
  }

  /**
   * Check if a specific server is currently active in memory
   */
  public isRunning(serverId: string): boolean {
    return this.activeServers.has(serverId)
  }

  /**
   * Get all currently running server IDs
   */
  public getRunningIds(): string[] {
    return Array.from(this.activeServers.keys())
  }
}

export const mcpService = new McpService()
