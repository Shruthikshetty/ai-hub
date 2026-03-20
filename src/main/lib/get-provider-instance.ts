import { createOpenAI } from '@ai-sdk/openai'
import { ModelProviderType, ModelSchemaType } from '../../common/schemas/model.schema'
import db from '../db'
import { decryptText } from '../../common/utils/encryption.util'
import { createGateway } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { normalizeProviderUrl } from '../../common/utils/url.util'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

// get the model based on the provider
export async function getProviderInstanceModel({ model }: { model: ModelSchemaType }) {
  // get the provider details
  const provider = await db.query.providers.findFirst({
    where: (providers, { eq }) => eq(providers.provider, model.provider)
  })

  let apiKey: string | undefined
  // if key exists decrypt it
  if (provider?.apiKey) {
    apiKey = decryptText(provider.apiKey)
  }

  //all the custom providers go here
  switch (model.provider as ModelProviderType) {
    case 'openai': {
      const openaiInstance = createOpenAI({
        apiKey
      })
      return openaiInstance
    }
    case 'ollama': {
      const baseURL = normalizeProviderUrl(provider?.serverUrl || 'http://localhost:11434', '/api')
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
    default: {
      const gatewayInstance = createGateway({
        apiKey
      })
      return gatewayInstance
    }
  }
}
