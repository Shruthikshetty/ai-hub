// this file aggregates all the connector routes also contains the specific connector eg(telegram) routes.

import { createRouter } from '../../lib/create-app'
import * as routes from './connector.route'
import * as handlers from './connector.handler'

// create the router
const router = createRouter()
  .openapi(routes.getConnectors, handlers.fetchConnectors)
  .openapi(routes.createConnector, handlers.createConnector)
  .openapi(routes.patchConnectorByName, handlers.updateConnector)
  .openapi(routes.deleteConnectorByName, handlers.deleteConnector)

// add all the routes
export default router
