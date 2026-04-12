// this file aggregates all the video generation routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './video-gen.handlers'
import * as routes from './video-gen.routes'

// create the router
const router = createRouter()
  .openapi(routes.generateVideo, handlers.generateVideo)
  .openapi(routes.deleteGeneratedVideo, handlers.deleteGeneratedVideo)

// add all the routes
export default router
