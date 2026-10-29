// this file aggregates all the connector routes also contains the specific connector eg(telegram) routes.

import { createRouter } from '../../lib/create-app'
import * as routes from './connector.route'
import * as handlers from './connector.handler'

// create the route
const router = createRouter()
  .openapi(routes.getConnectors, handlers.fetchConnectors)
  .openapi(routes.patchConnectorByName, handlers.updateConnector)

// add all the routes
export default router
