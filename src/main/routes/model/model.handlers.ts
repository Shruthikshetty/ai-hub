/**
 * @file contains all the handlers related to models
 */
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { GetModelsRoute, GetModelsV2Route } from './model.route'
import db from '../../db'
import { getModelListFromProvider } from '../../lib/get-model-list'
import { and } from 'drizzle-orm'

// handler to get all the list of models available
export const getModels: AppRouteHandler<GetModelsRoute> = async (c) => {
  // get the valid outputs from query params
  const { output } = c.req.valid('query')

  // get all the providers that are enabled and not hidden
  const enabledProviders = await db.query.providers.findMany({
    where: (providers, { eq }) => and(eq(providers.enabled, true), eq(providers.hide, false))
  })

  // map over providers and fetch the model list concurrently
  const modelPromises = enabledProviders.map(async (provider) => {
    return await getModelListFromProvider(provider)
  })

  // wait for all promises to resolve and flatten the array
  const nestedModels = await Promise.all(modelPromises)
  let models = nestedModels.flat()

  // filter models by output if the query parameter is provided
  if (output) {
    models = models.filter((model) => (model?.outputs ?? []).includes(output))
  }

  return c.json(
    {
      success: true,
      data: models
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to get all the list of models available from local database (V2)
export const getModelsV2: AppRouteHandler<GetModelsV2Route> = async (c) => {
  const { output, providerId } = c.req.valid('query')

  // get all the providers that are enabled and not hidden
  const enabledProviders = await db.query.providers.findMany({
    where: (providers, { eq, and }) => and(eq(providers.enabled, true), eq(providers.hide, false))
  })

  // get only enabled providers
  const enabledProviderIds = enabledProviders.map((p) => p.provider)

  // in case no providers enabled
  if (enabledProviderIds.length === 0) {
    return c.json({ success: true, data: [] }, HTTP_STATUS_CODES.OK)
  }

  const targetProviders = providerId
    ? enabledProviderIds.filter((p) => p === providerId)
    : enabledProviderIds

  // in case the required provider is not enabled or hidden
  if (targetProviders.length === 0) {
    return c.json({ success: true, data: [] }, HTTP_STATUS_CODES.OK)
  }

  // fetch models from enabled providers only, omitting deprecated and hidden models
  let modelsList = await db.query.models.findMany({
    where: (model, { inArray, eq, and }) =>
      and(
        inArray(model.providerId, targetProviders),
        eq(model.isDeprecated, false),
        eq(model.isHidden, false)
      ),
    orderBy: (model, { desc, asc }) => [
      desc(model.isFavorite),
      asc(model.sortOrder),
      asc(model.name)
    ]
  })

  // filter models by output modality if requested
  if (output) {
    modelsList = modelsList.filter((model) => (model.outputs ?? []).includes(output))
  }

  // send response
  return c.json(
    {
      success: true,
      data: modelsList
    },
    HTTP_STATUS_CODES.OK
  )
}
