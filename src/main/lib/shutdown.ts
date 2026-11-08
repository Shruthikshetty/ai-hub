/**
 * @file Application shutdown orchestrator
 * Counterpart to startup.ts for clean, structured application teardown.
 */
import { mcpService } from '../services/mcp/mcp.service'

/**
 * Main application shutdown orchestrator.
 * Cleans up all background services, MCP child processes, connectors, and sockets.
 */
export async function shutdownApp(): Promise<void> {
  // Clean up all MCP servers (kills stdio child processes and closes HTTP transports)
  // it important to manually close the mcp servers because they can leave out running child processes
  await mcpService.stopAll()

  // Future shutdown tasks can easily be appended below:
}
