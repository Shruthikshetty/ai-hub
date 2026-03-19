//This file aggregates all the routes for the provider module
import { createRouter } from '../../lib/create-app'
import * as handlers from './provider.handlers'
import * as routes from './provider.routes'

// create the router
const router = createRouter()
  .openapi(routes.getProviders, handlers.getProviders)
  .openapi(routes.patchProviderById, handlers.patchProviderById)

//export the router
export default router
