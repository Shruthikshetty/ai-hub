/**
 * @file contains all the handlers related to models
 */
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { GetModelsRoute } from './model.route'
import axios from 'axios'
import db from '../../db'
import { decryptText } from '../../../common/utils/encryption.util'

// handler to get all the list of models available
export const getModels: AppRouteHandler<GetModelsRoute> = async (c) => {
  // Fetch openai provider from db
  const openaiProvider = await db.query.providers.findFirst({
    where: (providers, { eq }) => eq(providers.provider, 'openai')
  })

  // decrypt the api key if one exists
  let apiKey = ''
  if (openaiProvider?.apiKey) {
    apiKey = decryptText(openaiProvider.apiKey)
  }

  //@TODO THIS IS TEMP FOR UI TESTING
  // fetch open ai models from https://api.openai.com/v1/models
  const response = await axios.get('https://api.openai.com/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  })
  return c.json(
    {
      success: true,
      data: response?.data?.data
        ? response.data.data.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (model: any) => ({
              id: model.id,
              name: model?.name ?? model.id,
              provider: 'openai'
            })
          )
        : []
    },
    HTTP_STATUS_CODES.OK
  )
}
