import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { ModelProviderType, ModelSchemaType } from '../../common/schemas/model.schema'
import db from '../db'
import { decryptText } from '../../common/utils/encryption.util'
import { createGateway } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { normalizeProviderUrl } from '../../common/utils/url.util'
import { createOpenRouter, LanguageModelV4 } from '@openrouter/ai-sdk-provider'
import { createGoogle } from '@ai-sdk/google'
import { createGroq } from '@ai-sdk/groq'
import { createHuggingFace } from '@ai-sdk/huggingface'
import { createXai } from '@ai-sdk/xai'
import { createTogetherAI } from '@ai-sdk/togetherai'
import { createFireworks } from '@ai-sdk/fireworks'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { createMistral } from '@ai-sdk/mistral'
import { createCerebras } from '@ai-sdk/cerebras'
import { createElevenLabs } from '@ai-sdk/elevenlabs'
import { createCohere } from '@ai-sdk/cohere'
import { createAlibaba } from '../../common/custom-providers/alibaba'
import { createNinjaChat } from '../../common/custom-providers/ninjachat'
import { parseVertexCredentials } from '../../common/utils/provider.util'

// get the provider instance based on the provider
export async function getProviderInstanceModel({
  provider,
  toolAccess
}: {
  provider: ModelSchemaType['provider']
  toolAccess?: boolean
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
      const googleInstance = createGoogle({
        apiKey
      })
      return googleInstance
    }
    case 'google-vertex': {
      const creds = parseVertexCredentials(apiKey)
      const baseURL =
        providerDetails?.serverUrl ||
        `https://aiplatform.googleapis.com/v1/projects/${creds.projectId}/locations/global/publishers/google`
      const vertexInstance = createGoogle({
        baseURL,
        apiKey: creds.apiKey,
        name: 'google-vertex'
      })
      return vertexInstance
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
      /* xai requires responses factory method for server-side argentic tool calling
       *https://ai-sdk.dev/providers/ai-sdk-providers/xai
       */
      if (toolAccess) {
        return xaiInstance.responses as unknown as (id: string) => LanguageModelV4
      }
      return xaiInstance
    }
    case 'togetherai': {
      const togetheraiInstance = createTogetherAI({
        apiKey
      })
      return togetheraiInstance
    }
    case 'fireworks-ai': {
      const fireworksInstance = createFireworks({
        apiKey
      })
      return fireworksInstance
    }
    case 'lmstudio': {
      const baseURL = normalizeProviderUrl(
        providerDetails?.serverUrl || 'http://localhost:1234',
        '/v1'
      )
      const lmstudioInstance = createOpenAICompatible({
        name: 'lmstudio',
        baseURL
      })
      return lmstudioInstance
    }
    case 'nvidia': {
      const baseURL = normalizeProviderUrl('https://integrate.api.nvidia.com/v1', '/v1')
      const nvidiaInstance = createOpenAICompatible({
        name: 'nvidia',
        baseURL,
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      })
      return nvidiaInstance
    }
    case 'vercel': {
      const gatewayInstance = createGateway({
        apiKey
      })
      return gatewayInstance
    }
    case 'custom': {
      const baseURL = normalizeProviderUrl(
        providerDetails?.serverUrl || 'http://localhost:8080',
        '/v1'
      )
      const customInstance = createOpenAICompatible({
        name: 'custom',
        baseURL,
        apiKey: 'none' // @TODO: does not support auth
      })
      // assign imageModel to image such that our handlers are not disturbed
      Object.assign(customInstance, { image: customInstance.imageModel })
      return customInstance
    }
    case 'poe': {
      const poeInstance = createOpenAI({
        baseURL: 'https://api.poe.com/v1',
        apiKey
      })
      return poeInstance
    }
    case 'opencode': {
      const openCodeInstance = createOpenAICompatible({
        name: 'opencode',
        baseURL: 'https://opencode.ai/inference/openai/v1',
        apiKey
      })
      return openCodeInstance
    }
    case 'nokeep': {
      const noKeepInstance = createOpenAICompatible({
        name: 'nokeep',
        baseURL: 'https://nokeep.ai/v1',
        apiKey
      })
      // assign imageModel to image such that our handlers are not disturbed
      Object.assign(noKeepInstance, { image: noKeepInstance.imageModel })
      return noKeepInstance
    }
    case 'nano-gpt': {
      const nanoGptInstance = createOpenAI({
        name: 'nano-gpt',
        baseURL: 'https://nano-gpt.com/api/v1',
        apiKey
      })
      return nanoGptInstance
    }
    case 'mistral': {
      const mistralInstance = createMistral({
        apiKey
      })
      return mistralInstance
    }
    case 'anthropic': {
      const anthropicInstance = createAnthropic({
        apiKey
      })
      return anthropicInstance
    }
    case 'cerebras': {
      const cerebrasInstance = createCerebras({
        apiKey
      })
      return cerebrasInstance
    }
    case 'cohere': {
      const cohereInstance = createCohere({
        apiKey
      })
      return cohereInstance
    }
    case 'alibaba': {
      const alibabaInstance = createAlibaba({
        apiKey
      })
      return alibabaInstance
    }
    case 'ninjachat': {
      const ninjaChatInstance = createNinjaChat({
        apiKey
      })
      return ninjaChatInstance
    }
    case 'openai': // fall back as default
    default: {
      const openaiInstance = createOpenAI({
        apiKey
      })
      return openaiInstance
    }
  }
}

// get provider instance for tts
export async function getProviderInstanceTTS({
  provider
}: {
  provider: ModelSchemaType['provider']
}) {
  // get the provider details
  const providerDetails = await db.query.providers.findFirst({
    where: (providers, { eq }) => eq(providers.provider, provider)
  })
  // extract api key
  let apiKey: string | undefined
  // if key exists decrypt it
  if (providerDetails?.apiKey) {
    apiKey = decryptText(providerDetails.apiKey)
  }

  // all the tts providers go here
  switch (provider) {
    case 'google': {
      const googleInstance = createGoogle({
        apiKey
      })
      return googleInstance
    }
    case 'google-vertex': {
      const creds = parseVertexCredentials(apiKey)
      const baseURL =
        providerDetails?.serverUrl ||
        `https://aiplatform.googleapis.com/v1/projects/${creds.projectId}/locations/global/publishers/google`
      const vertexInstance = createGoogle({
        baseURL,
        apiKey: creds.apiKey,
        name: 'google-vertex'
      })
      return vertexInstance
    }
    case 'elevenlabs': {
      const elevenlabsInstance = createElevenLabs({
        apiKey
      })
      return elevenlabsInstance
    }
    case 'custom': {
      const baseURL = normalizeProviderUrl(
        providerDetails?.serverUrl || 'http://localhost:8080',
        '/v1'
      )
      const customInstance = createOpenAI({
        name: 'custom',
        baseURL,
        apiKey: 'none' // @TODO: does not support auth
      })

      return customInstance
    }
    case 'openai': // fall back as default
    default: {
      const openaiInstance = createOpenAI({
        apiKey
      })
      return openaiInstance
    }
  }
}
