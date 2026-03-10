import axios from 'axios'
import { ProviderGetSchema } from '../db/schema'
import { decryptText } from '../../common/utils/encryption.util'
import { ModelSchemaType, ModelIOType } from '../../common/schemas/model.schema'

// types
type OpenAiModel = {
  id: string
  object: string
  created: number
  owned_by: string
}

// helper function to infer capabilities of OpenAI models from their IDs
function inferOpenAiCapabilities(modelId: string): Partial<ModelSchemaType> {
  const isImage = modelId.includes('dall-e') || modelId.includes('image')
  const isEmbedding = modelId.includes('embedding')
  const isTTS = modelId.includes('tts') || modelId.includes('audio')
  const isWhisper = modelId.includes('whisper')
  const isRealTime = modelId.includes('realtime')
  const isVideo = modelId.includes('sora')

  // Vision inputs for newer multimodal textual models NOTE: this might not be accurate
  const isVison =
    modelId.includes('vision') ||
    modelId.startsWith('gpt-4o') ||
    modelId.startsWith('o1') ||
    modelId.startsWith('gpt-5')

  const inputs: ModelIOType[] = ['text']
  const outputs: ModelIOType[] = []

  // Set Inputs
  if (isVison) inputs.push('image')
  if (isWhisper) {
    // Whisper takes audio and returns text
    inputs.push('audio')
  }

  // Set Outputs
  switch (true) {
    case isImage:
      outputs.push('image')
      break
    case isEmbedding:
      outputs.push('embedding')
      break
    case isTTS:
      outputs.push('audio')
      break
    case isRealTime:
      outputs.push('realtime')
      break
    case isVideo:
      outputs.push('video')
      break
    default:
      outputs.push('text')
      break
  }

  return {
    inputs,
    outputs,
    capabilities: {
      vision: isVison,
      videoReasoning: false, // @ TODO No clear distinction for now
      realtime: modelId.includes('realtime')
    }
  }
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any
    // handel the fetching logic separately for all the providers
    switch (provider.provider) {
      case 'openai':
        response = await axios.get<OpenAiModel>('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 15000 //15 seconds
        })
        break
      default:
        // For other providers (like ollama) or generic OpenAI-compatible endpoints
        if (provider.serverUrl) {
          response = await axios.get<OpenAiModel>(`${provider.serverUrl}/v1/models`, {
            headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
            timeout: 15000 //15 seconds
          })
        } else {
          return []
        }
        break
    }

    // map the response to standard format as per the provider
    // @TODO catch the data and then access from db
    if (response?.data?.data) {
      switch (provider.provider) {
        case 'openai':
          return response.data.data.map((model: OpenAiModel) => {
            const capabilities = inferOpenAiCapabilities(model.id)
            return {
              id: model.id,
              name: model.id,
              provider: provider.provider,
              ...capabilities
            }
          })
        default:
          return response.data.data.map((model: OpenAiModel) => ({
            id: model.id,
            name: model.id,
            provider: provider.provider,
            inputs: ['text'],
            outputs: ['text']
          }))
      }
    }
    return []
  } catch (error) {
    console.error('failed to fetch models for ', provider.name, error)
    return []
  }
}
