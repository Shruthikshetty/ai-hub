/**
 * NinjaChat provider factory
 */

import { LanguageModelV3 } from '@ai-sdk/provider'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { buildNinjaChatFetch } from './ninjachat-fetch-adapter'
import { NinjaChatProviderSettings } from './ninjachat-settings'
import { NinjaChatImageModel } from './ninjachat-image-model'

export type { NinjaChatProviderSettings }

const DEFAULT_BASE_URL = 'https://ninjachat.ai/api/v1'

export interface NinjaChatProvider {
  /**
   * Creates a NinjaChat chat model (default callable form).
   */
  (modelId: string): LanguageModelV3

  /**
   * Creates a NinjaChat chat model for text generation.
   */
  chat(modelId: string): LanguageModelV3

  /**
   * Creates a NinjaChat image model for image generation.
   */
  image(modelId: string): NinjaChatImageModel
}

/**
 * Create a NinjaChat provider instance.
 */
export function createNinjaChat(options: NinjaChatProviderSettings = {}): NinjaChatProvider {
  const resolvedApiKey = options.apiKey ?? process.env.NINJACHAT_API_KEY ?? ''
  const resolvedBaseURL = options.baseURL ?? DEFAULT_BASE_URL
  const customFetch = buildNinjaChatFetch(resolvedApiKey)

  const openaiCompatible = createOpenAICompatible({
    name: 'ninjachat',
    baseURL: resolvedBaseURL,
    fetch: customFetch
  })

  // default callable language model
  const provider = (modelId: string): LanguageModelV3 => openaiCompatible.chatModel(modelId)

  // callable language model as chat
  provider.chat = (modelId: string): LanguageModelV3 => openaiCompatible.chatModel(modelId)

  //image generation model
  provider.image = (modelId: string): NinjaChatImageModel =>
    new NinjaChatImageModel(modelId, resolvedApiKey, resolvedBaseURL)

  return provider as NinjaChatProvider
}
