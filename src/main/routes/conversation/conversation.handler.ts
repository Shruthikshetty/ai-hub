/**
 * @file contains all the handlers for conversation routes
 */
import { GetConversationRoute } from './conversation.route'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { conversations } from '../../../common/db-schemas/conversation.schema'
import { desc } from 'drizzle-orm'
import db from '../../db'

// handler for get conversation route @TODO pagination should be added
export const getConversation: AppRouteHandler<GetConversationRoute> = async (c) => {
  // get all the conservation from the db
  const allConversations = await db.query.conversations.findMany({
    orderBy: [desc(conversations.updatedAt)]
  })

  // return the data
  return c.json(
    {
      success: true,
      data: allConversations
    },
    HTTP_STATUS_CODES.OK
  )
}
