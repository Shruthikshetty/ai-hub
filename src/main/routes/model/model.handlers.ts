/**
 * @file contains all the handlers related to models
 */
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import {
  AddModelRoute,
  DeleteModelRoute,
  GetModelsRoute,
  GetModelsV2Route,
  UpdateModelRoute
} from './model.route'
import db from '../../db'
import { getModelListFromProvider } from '../../lib/get-model-list'
import { and, eq } from 'drizzle-orm'
import { models } from '../../db/schema'

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
  const { output, providerId, hidden } = c.req.valid('query')

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

  // fetch models from enabled providers, omitting deprecated models
  let modelsList = await db.query.models.findMany({
    where: (model, { inArray, eq, and }) =>
      and(
        inArray(model.providerId, targetProviders),
        eq(model.isDeprecated, false),
        eq(model.isHidden, hidden ?? false)
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

// handler to add a new model
export const addModel: AppRouteHandler<AddModelRoute> = async (c) => {
  // get the request
  const body = c.req.valid('json')

  // insert to the db
  const [newModel] = await db.insert(models).values(body).returning()

  // return the success response
  return c.json(
    {
      success: true,
      data: newModel,
      message: 'model added successfully'
    },
    HTTP_STATUS_CODES.CREATED
  )
}

// handler to delete a model
export const deleteModel: AppRouteHandler<DeleteModelRoute> = async (c) => {
  const { providerId, id } = c.req.valid('param')

  // delete the model using its composite primary key (providerId, id)
  const [deleted] = await db
    .delete(models)
    .where(and(eq(models.providerId, providerId), eq(models.id, id)))
    .returning()

  // if model not found
  if (!deleted) {
    return c.json(
      {
        success: false,
        message: 'Model not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return success response
  return c.json(
    {
      success: true,
      data: deleted,
      message: 'Model deleted successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}

// handler to update a model
export const updateModel: AppRouteHandler<UpdateModelRoute> = async (c) => {
  const { providerId, id } = c.req.valid('param')
  const body = c.req.valid('json')

  // update the model in the db
  const [updatedModel] = await db
    .update(models)
    .set(body)
    .where(and(eq(models.providerId, providerId), eq(models.id, id)))
    .returning()

  // if model not found
  if (!updatedModel) {
    return c.json(
      {
        success: false,
        message: 'Model not found'
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // return success response
  return c.json(
    {
      success: true,
      data: updatedModel,
      message: 'Model updated successfully'
    },
    HTTP_STATUS_CODES.OK
  )
}
