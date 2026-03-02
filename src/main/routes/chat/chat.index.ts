// this file aggregates all the chat routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './chat.handlers'
import * as routes from './chat.routes'

// create the router
const router = createRouter().openapi(routes.streamChat, handlers.streamChat)

// add all the routes
export default router
