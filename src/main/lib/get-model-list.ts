import axios from 'axios'
import { ProviderGetSchema } from '../db/schema'
import { decryptText } from '../../common/utils/encryption.util'
import { ModelSchemaType } from '../../common/schemas/model.schema'

//@TODO in progress with type safety and proper data extraction
/**
 * This function fetches and return the list of models for a given provider
 * @param provider ProviderGetSchema
 */
export async function getModelListFromProvider(
  provider: ProviderGetSchema
): Promise<ModelSchemaType[]> {
  try {
    let apiKey = ''
    if (provider.apiKey) {
      apiKey = decryptText(provider.apiKey)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any
    // handel the fetching logic separately for all the providers
    switch (provider.provider) {
      case 'openai':
        response = await axios.get('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 15000 //15 seconds
        })
        break
      default:
        // For other providers (like ollama) or generic OpenAI-compatible endpoints
        if (provider.serverUrl) {
          response = await axios.get(`${provider.serverUrl}/v1/models`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
            timeout: 15000 //15 seconds
          })
        } else {
          return []
        }
        break
    }

    // map the response to standard format as per the provider
    if (response?.data?.data) {
      switch (provider.provider) {
        case 'openai':
          return response.data.data.map((model: { id: string; name?: string }) => ({
            id: model.id,
            name: model?.name ?? model.id,
            provider: provider.provider
          }))
        default:
          return response.data.data.map((model: { id: string; name?: string }) => ({
            id: model.id,
            name: model?.name ?? model.id,
            provider: provider.provider
          }))
      }
    }
    return []
  } catch (error) {
    console.error('failed to fetch models for ', provider.name, error)
    return []
  }
}
