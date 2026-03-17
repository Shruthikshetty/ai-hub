// this file aggregates all the image generation routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './image-gen.handlers'
import * as routes from './image-gen.routes'

// create the router
const router = createRouter().openapi(routes.generateImage, handlers.generateImage)

// add all the routes
export default router
