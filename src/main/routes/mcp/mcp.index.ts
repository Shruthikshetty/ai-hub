/**
 * @file Aggregates all the MCP server routes
 */
import { createRouter } from '../../lib/create-app'
import * as routes from './mcp.routes'
import * as handlers from './mcp.handlers'

// aggregate all the routes
const router = createRouter()
  .openapi(routes.getMcpServers, handlers.fetchMcpServers)
  .openapi(routes.createMcpServer, handlers.createMcpServer)
  .openapi(routes.patchMcpServerById, handlers.updateMcpServer)
  .openapi(routes.deleteMcpServerById, handlers.deleteMcpServer)
  .openapi(routes.testMcpServer, handlers.testMcpServer)

export default router
