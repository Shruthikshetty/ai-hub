// this file aggregates all the profile routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './profile.handlers'
import * as routes from './profile.routes'

// create the router
const router = createRouter()
  .openapi(routes.getProfile, handlers.getProfile)
  .openapi(routes.updateProfile, handlers.updateProfile)

// add all the routes
export default router
