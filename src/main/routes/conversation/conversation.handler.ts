/**
 * @file contains all the handlers for conversation routes
 */
import {
  GetConversationRoute,
  CreateConversationRoute,
  DeleteConversationRoute
} from './conversation.route'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { conversations } from '../../../common/db-schemas/conversation.schema'
import { desc, eq } from 'drizzle-orm'
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

// handler for create conversation route
export const createConversation: AppRouteHandler<CreateConversationRoute> = async (c) => {
  const body = c.req.valid('json')

  const [created] = await db.insert(conversations).values(body).returning()

  return c.json(
    {
      success: true,
      data: created
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler for deleting a conversation by id
export const deleteConversationById: AppRouteHandler<DeleteConversationRoute> = async (c) => {
  // get id from params
  const { id } = c.req.valid('param')

  // delete the conversation
  const [deleted] = await db.delete(conversations).where(eq(conversations.id, id)).returning()

  // in case not deleted
  if (!deleted) {
    return c.json(
      {
        success: true,
        message: 'Conversation not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }
  // return success
  return c.json(
    {
      success: true,
      data: deleted,
      message: 'Conversation deleted successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}
