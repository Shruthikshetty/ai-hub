/**
 * @file contains all the handlers related to models
 */
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { GetModelsRoute } from './model.route'
import db from '../../db'
import { getModelListFromProvider } from '../../lib/get-model-list'

// handler to get all the list of models available
export const getModels: AppRouteHandler<GetModelsRoute> = async (c) => {
  // get the valid outputs from query params
  const { output } = c.req.valid('query')
  console.log('Requested outputs filter:', output)
  // get all the providers that are enabled
  const enabledProviders = await db.query.providers.findMany({
    where: (providers, { eq }) => eq(providers.enabled, true)
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
