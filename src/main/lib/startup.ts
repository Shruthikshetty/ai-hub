import db from '../db'
import { connectors } from '../db/schema'
import { eq } from 'drizzle-orm'
import { CONNECTOR_SERVICES } from '../constants/config.constants'
import { mcpService } from '../services/mcp/mcp.service'

/**
 * Auto-starts any connector that has `autoStart: true` in the database.
 * Uses Promise.allSettled so an issue in one connector does not prevent others from starting.
 * if any process failed its ignored
 */
export async function autoStartConnectors(): Promise<void> {
  try {
    // get enabled connectors
    const enabledConnectors = await db.query.connectors.findMany({
      where: eq(connectors.autoStart, true)
    })

    // early return
    if (!enabledConnectors.length) {
      return
    }

    // Start all enabled connectors concurrently
    await Promise.allSettled(
      enabledConnectors.map(async (connector) => {
        const service = CONNECTOR_SERVICES[connector.name]

        // should not happen better for catching any errors during active dev
        if (!service) {
          console.warn(`[Startup] No service configured for connector '${connector.name}'`)
          return
        }

        // if running ignore (this might never happen )
        if (service.isRunning()) {
          return
        }

        try {
          // start the service
          await service.start()
        } catch (err) {
          console.error(`[Startup] Failed to auto-start connector '${connector.name}':`, err)
        }
      })
    )
  } catch (error) {
    console.error('[Startup] Failed to query auto-start connectors:', error)
  }
}

/**
 * Main application startup orchestrator.
 * Designed to be executed in the background ("fire-and-forget") so it does not block
 * app window launch or Hono server readiness.
 *
 * Any future background initialization tasks can be added here.
 */
export async function startupBoot(): Promise<void> {
  // fire all star tup task in parallel
  await Promise.allSettled([
    // start all the connectors that have auto start enabled
    autoStartConnectors(),
    // start all enabled MCP servers
    mcpService.startAll()
  ])

  // Future startup tasks can easily be appended below:
}
