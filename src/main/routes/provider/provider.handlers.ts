/**
 * @file contains all the handlers related to provider route
 */

import db from '../../db'
import { AppRouteHandler } from '../../types'
import { GetProvidersRoute, PatchProviderByIdRoute } from './provider.routes'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { providers } from '../../db/schema'
import { eq } from 'drizzle-orm'
import { decryptText, encryptText } from '../../../common/utils/encryption.util'

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
      data: providers.map((provider) => ({
        ...provider,
        apiKey: provider.apiKey ? decryptText(provider.apiKey) : ''
      }))
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to update provider by id
export const patchProviderById: AppRouteHandler<PatchProviderByIdRoute> = async (c) => {
  // get the provider updated data
  const newData = c.req.valid('json')

  // Encrypt the apiKey if it's being updated and is not empty
  if (newData.apiKey) {
    newData.apiKey = encryptText(newData.apiKey)
  }

  // get the provider id from the params
  const { id } = c.req.param()

  // update the provider in db
  const [updatedProvider] = await db
    .update(providers)
    .set(newData)
    .where(eq(providers.id, Number(id)))
    .returning()

  // if provider is not found
  if (!updatedProvider) {
    return c.json(
      {
        success: false,
        message: 'Provider not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return the updated provider
  return c.json(
    {
      success: true,
      data: updatedProvider
    },
    HTTP_STATUS_CODES.OK
  )
}
