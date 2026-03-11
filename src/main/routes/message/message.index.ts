// this file aggregates all the message routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './message.handler'
import * as routes from './message.route'

// create the router
const router = createRouter().openapi(routes.getMessage, handlers.getMessage)

// add all the routes
export default router
