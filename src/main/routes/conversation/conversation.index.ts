// this file aggregates all the conversation routes
import { createRouter } from '../../lib/create-app'
import * as handlers from './conversation.handler'
import * as routes from './conversation.route'

// create the router
const router = createRouter()
  .openapi(routes.getConversation, handlers.getConversation)
  .openapi(routes.createConversation, handlers.createConversation)
  .openapi(routes.deleteConversation, handlers.deleteConversationById)
  .openapi(routes.getConversationMessages, handlers.getConversationMessages)

// add all the routes
export default router
