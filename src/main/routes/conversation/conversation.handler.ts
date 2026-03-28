/**
 * @file contains all the handlers for conversation routes
 */
import {
  GetConversationRoute,
  CreateConversationRoute,
  DeleteConversationRoute,
  GetConversationMessagesRoute,
  UpdateConversationRoute,
  DeleteAllConversationsRoute,
  EmptyChatAttachmentsFolderRoute
} from './conversation.route'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { conversations } from '../../../common/db-schemas/conversation.schema'
import { desc, eq } from 'drizzle-orm'
import db from '../../db'
import { messages } from '../../../common/db-schemas/message.schema'
import {
  deleteMediaFile,
  emptyChatAttachmentsFolder as clearChatAttachments
} from '../../lib/file-storage'

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

  // add a new conversation to db
  const [newConversation] = await db.insert(conversations).values(body).returning()

  return c.json(
    {
      success: true,
      data: newConversation
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler for deleting a conversation by id
export const deleteConversationById: AppRouteHandler<DeleteConversationRoute> = async (c) => {
  // get id from params
  const { id } = c.req.valid('param')

  // Clean up any media files attached to messages in this conversation before deleting.
  // The DB cascade will remove the message rows, but files on disk need explicit cleanup.
  try {
    const conversationMessages = await db.query.messages.findMany({
      where: eq(messages.conversationId, id)
    })
    for (const msg of conversationMessages) {
      for (const part of msg.parts ?? []) {
        if (part.type === 'file' && part.url?.startsWith('media://')) {
          const relativePath = part.url.slice('media://'.length)
          deleteMediaFile(relativePath) // best-effort, ignore failures
        }
      }
    }
  } catch {
    // Silent fail — don't block deletion if cleanup errors
  }

  // delete the conversation (cascades to messages in DB)
  const [deleted] = await db.delete(conversations).where(eq(conversations.id, id)).returning()

  // in case not deleted
  if (!deleted) {
    return c.json(
      {
        success: false,
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

// handler for deleting all conversations
export const deleteAllConversations: AppRouteHandler<DeleteAllConversationsRoute> = async (c) => {
  // delete all the conversations
  await db.delete(conversations)

  //empty the chat-attachments folder as all conversation context is gone
  try {
    clearChatAttachments()
  } catch {
    // Best-effort cleanup — don't fail the response if file cleanup errors
  }

  // return success
  return c.json(
    {
      success: true,
      message: 'All conversations deleted successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}

//@TODO Pagination will be implemented later
// handler for getting a conversation with all its messages
export const getConversationMessages: AppRouteHandler<GetConversationMessagesRoute> = async (c) => {
  const { id } = c.req.valid('param')

  // find the conversation by id
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
    with: {
      messages: {
        orderBy: (messages, { asc }) => [asc(messages.createdAt)]
      }
    }
  })

  // in case conversation is not found
  if (!conversation) {
    return c.json(
      {
        success: false,
        message: 'Conversation not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the success with conversation and messages
  return c.json(
    {
      success: true,
      data: conversation
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler for updating a conversation
export const updateConversationById: AppRouteHandler<UpdateConversationRoute> = async (c) => {
  const { id } = c.req.valid('param')
  const body = c.req.valid('json')

  // update the conversation
  const [updated] = await db
    .update(conversations)
    .set(body)
    .where(eq(conversations.id, id))
    .returning()

  // in case conversation is not found
  if (!updated) {
    return c.json(
      {
        success: false,
        message: 'Conversation not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return success with updated conversation
  return c.json(
    {
      success: true,
      data: updated
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler for emptying the chat attachments folder
export const emptyChatAttachmentsFolder: AppRouteHandler<EmptyChatAttachmentsFolderRoute> = async (
  c
) => {
  const removed = clearChatAttachments()

  return c.json(
    {
      success: true,
      message: `Chat attachments folder cleared (${removed} entr${removed === 1 ? 'y' : 'ies'} removed)`
    },
    HTTP_STATUS_CODES.OK
  )
}
