/**
 * @file contains all the handlers related to provider route
 */

import db from '../../db'
import { AppRouteHandler } from '../../types'
import { GetProvidersRoute } from './provider.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'

// handler to get all the list of providers
export const getProviders: AppRouteHandler<GetProvidersRoute> = async (c) => {
  // get all the providers from db
  const providers = await db.query.providers.findMany()

  // incases no providers found (this should not happen still keeping here n case the providers are ot seeded properly)
  if (!providers) {
    return c.json(
      {
        success: false,
        message: 'No providers found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the providers
  return c.json(
    {
      success: true,
      data: providers
    },
    HTTP_STATUS_CODES.OK
  )
}
