import axios, { AxiosResponse } from 'axios'
import { ProviderGetSchema } from '../db/schema'
import { decryptText } from '../../common/utils/encryption.util'
import { ModelSchemaType, ModelIOType, ModelProviderType } from '../../common/schemas/model.schema'
import { buildGatewayModel, buildGoogleModel, buildOpenAiModel } from './extract-model-capabilities'

// types
type OpenAiModel = {
  id: string
  object: string
  created: number
  owned_by: string
}

/**
 * this is partially type safe as required for the app
 * check doc for all the exact types https://openrouter.ai/docs/guides/overview/models
 */
type OpenRouterModel = {
  id: string
  hugging_face_id: string
  name: string
  created: number
  description: string
  context_length: number
  architecture: {
    modality: string
    input_modalities: string[]
    output_modalities: string[]
    tokenizer: string
    instruct_type: string | null
  }
  pricing: {
    prompt?: string
    completion?: string
  }
}

/**
 * google ai studio mode object
 * doc: https://ai.google.dev/api/models#Model
 */
export type GoogleModel = {
  name: string
  version: string
  displayName: string
  description: string
  inputTokenLimit: number
  outputTokenLimit: number
  supportedGenerationMethods: string[]
  thinking?: boolean
  temperature?: number
  maxTemperature?: number
  topP?: number
  topK?: number
}

/**
 * google ai studio response for models endpoint
 */
type GoogleResponse = {
  models: GoogleModel[]
}

/**
 * vercel gateway model type
 * full types https://vercel.com/docs/ai-gateway/models-and-providers#dynamic-model-discovery
 */
export type GatewayModel = {
  id: string
  object: 'model'
  created: number
  released: number
  owned_by: string
  name: string
  description: string
  context_window: number
  max_token: number
  type: 'language' | 'embedding' | 'image' | 'video'
  tags: string[]
  pricing: {
    input: string
    output: string
  }
}

/**
 * open AI type response for models endpoint
 */
type OpenAiResponse<T> = {
  data: T[]
}

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

    let response:
      | AxiosResponse<OpenAiResponse<OpenRouterModel>>
      | AxiosResponse<OpenAiResponse<OpenAiModel>>
      | AxiosResponse<GoogleResponse>

    // handel the fetching logic separately for all the providers
    switch (provider.provider as ModelProviderType) {
      case 'openai':
        response = await axios.get('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 2000 //2 seconds
        })
        break
      case 'openrouter': {
        response = await axios.get('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 2000 //2 seconds
        })
        break
      }
      case 'google': {
        response = await axios.get('https://generativelanguage.googleapis.com/v1beta/models', {
          params: { key: apiKey },
          timeout: 2000
        })
        break
      }
      case 'vercel': {
        response = await axios.get('https://ai-gateway.vercel.sh/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 2000 //2 seconds
        })
        break
      }
      default:
        // For other providers (like ollama) or generic OpenAI-compatible endpoints
        if (provider.serverUrl) {
          response = await axios.get(`${provider.serverUrl}/v1/models`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
            timeout: 2000 //2 seconds
          })
        } else {
          return []
        }
        break
    }
    // map the response to standard format as per the provider
    // @TODO catch the data and then access from db
    switch (provider.provider as ModelProviderType) {
      case 'openai': {
        const data = (response.data as OpenAiResponse<OpenAiModel>).data
        if (!data) return []
        return data.map((model: OpenAiModel) => buildOpenAiModel(model.id, provider.provider))
      }
      case 'openrouter': {
        const data = (response.data as OpenAiResponse<OpenRouterModel>).data
        if (!data) return []
        return data.map((model: OpenRouterModel) => ({
          id: model.id,
          name: model.id,
          provider: provider.provider,
          //@TODO the modularity to be handled specially all case https://openrouter.ai/docs/guides/overview/models#output_modality
          inputs: (model?.architecture?.input_modalities ?? ['text']) as ModelIOType[],
          outputs: (model?.architecture?.output_modalities ?? ['text']) as ModelIOType[],
          capabilities: {
            vision: model?.architecture?.input_modalities?.includes('image') ?? false,
            // currently not supported or not stable
            videoReasoning: false,
            realtime: false
          }
        }))
      }
      case 'google': {
        const models = (response.data as GoogleResponse).models
        if (!models) return []
        return models.map((model: GoogleModel) => buildGoogleModel(model, provider.provider))
      }
      case 'vercel': {
        const data = (response.data as OpenAiResponse<GatewayModel>).data
        if (!data) return []
        return data.map((model: GatewayModel) => buildGatewayModel(model, provider.provider))
      }
      default: {
        const data = (response.data as OpenAiResponse<OpenAiModel>).data
        if (!data || !Array.isArray(data)) return []
        return data.map((model: OpenAiModel) => ({
          id: model.id,
          name: model.id,
          provider: provider.provider,
          inputs: ['text'],
          outputs: ['text']
        }))
      }
    }
  } catch (error) {
    console.error('failed to fetch models for ', provider.name, error)
    return []
  }
}
