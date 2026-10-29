import { asc, eq } from 'drizzle-orm'
import db from '../../db'
import { AppRouteHandler } from '../../types'
import { GetConnectorsRoute, PatchConnectorByNameRoute } from './connector.route'
import { connectors } from '../../db/schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { encryptText } from '../../../common/utils/encryption.util'

// handler to fetch all the connectors
export const fetchConnectors: AppRouteHandler<GetConnectorsRoute> = async (c) => {
  // get all connectors from the db
  const allConnectors = await db.query.connectors.findMany({
    orderBy: [asc(connectors.createdAt)]
  })

  // return the data with decrypted botToken
  return c.json(
    {
      success: true,
      data: allConnectors
    },
    HTTP_STATUS_CODES.OK
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

  // return the updated data with decrypted botToken
  return c.json(
    {
      success: true,
      data: updatedConnector
    },
    HTTP_STATUS_CODES.OK
  )
}
