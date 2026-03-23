import { createOpenAI } from '@ai-sdk/openai'
import { ModelProviderType, ModelSchemaType } from '../../common/schemas/model.schema'
import db from '../db'
import { decryptText } from '../../common/utils/encryption.util'
import { createGateway } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { normalizeProviderUrl } from '../../common/utils/url.util'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createHuggingFace } from '@ai-sdk/huggingface'
import { createXai } from '@ai-sdk/xai'

// get the model based on the provider
export async function getProviderInstanceModel({
  provider
}: {
  provider: ModelSchemaType['provider']
}) {
  // get the provider details
  const providerDetails = await db.query.providers.findFirst({
    where: (providers, { eq }) => eq(providers.provider, provider)
  })

  let apiKey: string | undefined
  // if key exists decrypt it
  if (providerDetails?.apiKey) {
    apiKey = decryptText(providerDetails.apiKey)
  }

  //all the custom providers go here
  switch (provider as ModelProviderType) {
    case 'openai': {
      const openaiInstance = createOpenAI({
        apiKey
      })
      return openaiInstance
    }
    case 'ollama': {
      const baseURL = normalizeProviderUrl(
        providerDetails?.serverUrl || 'http://localhost:11434',
        '/api'
      )
      const ollamaInstance = createOllama({
        baseURL
      })
      return ollamaInstance
    }
    case 'openrouter': {
      const openrouterInstance = createOpenRouter({
        apiKey
      })
      return openrouterInstance
    }
    case 'google': {
      const googleInstance = createGoogleGenerativeAI({
        apiKey
      })
      return googleInstance
    }
    case 'groq': {
      const groqInstance = createGroq({
        apiKey
      })
      return groqInstance
    }
    case 'huggingface': {
      const huggingfaceInstance = createHuggingFace({
        apiKey
      })
      return huggingfaceInstance
    }
    case 'xai': {
      const xaiInstance = createXai({
        apiKey
      })
      return xaiInstance
    }
    case 'vercel': // fall's to default
    default: {
      const gatewayInstance = createGateway({
        apiKey
      })
      return gatewayInstance
    }
  }
}
