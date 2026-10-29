import { asc } from 'drizzle-orm'
import db from '../../db'
import { AppRouteHandler } from '../../types'
import { GetConnectorsRoute } from './connector.route'
import { connectors } from '../../db/schema'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'

// handler to fetch all the connectors
export const fetchConnectors: AppRouteHandler<GetConnectorsRoute> = async (c) => {
  // get all the conservation from the db
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
