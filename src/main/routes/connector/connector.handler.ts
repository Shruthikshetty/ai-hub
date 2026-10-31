import { asc, eq } from 'drizzle-orm'
import db from '../../db'
import { AppRouteHandler } from '../../types'
import {
  GetConnectorsRoute,
  CreateConnectorRoute,
  PatchConnectorByNameRoute,
  DeleteConnectorByNameRoute,
  StartConnectorByNameRoute
} from './connector.route'
import { connectors } from '../../db/schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { encryptText } from '../../../common/utils/encryption.util'
import { telegramBotService } from '../../services/telegram-bot.service'

// handler to fetch all the connectors
export const fetchConnectors: AppRouteHandler<GetConnectorsRoute> = async (c) => {
  // get all connectors from the db
  const allConnectors = await db.query.connectors.findMany({
    orderBy: [asc(connectors.createdAt)]
  })

  // return the data
  return c.json(
    {
      success: true,
      data: allConnectors
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to create a new connector
export const createConnector: AppRouteHandler<CreateConnectorRoute> = async (c) => {
  const body = c.req.valid('json')

  // Encrypt the botToken if present
  if (body.botToken) {
    body.botToken = encryptText(body.botToken)
  }

  // insert new connector into db
  const [newConnector] = await db.insert(connectors).values(body).returning()

  return c.json(
    {
      success: true,
      data: newConnector,
      message: 'Connector created successfully'
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler to update a connector by primary key (name)
export const updateConnector: AppRouteHandler<PatchConnectorByNameRoute> = async (c) => {
  const { name } = c.req.valid('param')
  const newData = c.req.valid('json')

  // Encrypt the botToken if it's being updated and is not empty
  if (newData.botToken) {
    newData.botToken = encryptText(newData.botToken)
  }

  // update the connector in db
  const [updatedConnector] = await db
    .update(connectors)
    .set(newData)
    .where(eq(connectors.name, name))
    .returning()

  // if connector not found
  if (!updatedConnector) {
    return c.json(
      {
        message: `Connector '${name}' not found`,
        success: false
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the updated data
  return c.json(
    {
      success: true,
      data: updatedConnector
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to delete a connector by primary key (name)
export const deleteConnector: AppRouteHandler<DeleteConnectorByNameRoute> = async (c) => {
  const { name } = c.req.valid('param')

  // delete the connector from db
  const [deleted] = await db.delete(connectors).where(eq(connectors.name, name)).returning()

  // if connector not found
  if (!deleted) {
    return c.json(
      {
        message: `Connector '${name}' not found`,
        success: false
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }
  // return success response
  return c.json(
    {
      success: true,
      data: deleted,
      message: `Connector '${name}' deleted successfully`
    },
    HTTP_STATUS_CODES.OK
  )
}

//@NOTE this is only handling telegram because app only supports that if adding additional connector we need to modify this handler
// start connector long polling
export const startConnector: AppRouteHandler<StartConnectorByNameRoute> = async (c) => {
  const { name } = c.req.valid('param') // name of the connector will be used later to conditionally call the service when more connectors are added

  // start the bot service
  const { botUsername } = await telegramBotService.start()
  // send the response  back to user
  return c.json(
    {
      success: true,
      message: `Connected to Telegram bot @${botUsername}`,
      data: {
        name,
        botUsername: botUsername,
        isRunning: true
      }
    },
    HTTP_STATUS_CODES.OK
  )
}
