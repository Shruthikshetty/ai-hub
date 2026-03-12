/**
 * @file contains all the handlers for message routes
 */
import { AddMessageRoute, GetMessageRoute } from './message.route'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { messages } from '../../../common/db-schemas/message.schema'
import { eq } from 'drizzle-orm'
import db from '../../db'

// handler for get message route
export const getMessage: AppRouteHandler<GetMessageRoute> = async (c) => {
  const { id } = c.req.valid('param')

  // get the message from the db
  const message = await db.query.messages.findFirst({
    where: eq(messages.id, id)
  })

  // check if message existsF
  if (!message) {
    return c.json(
      {
        success: false,
        message: 'Message not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the data
  return c.json(
    {
      success: true,
      data: message
    },
    HTTP_STATUS_CODES.OK
  )
}

// route to handle the addition of a new message
export const addMessage: AppRouteHandler<AddMessageRoute> = async (c) => {
  const values = c.req.valid('json')
  // insert into database
  const [newMessage] = await db.insert(messages).values(values).returning()
  // return the success response
  return c.json(
    {
      success: true,
      data: newMessage
    },
    HTTP_STATUS_CODES.CREATED
  )
}
