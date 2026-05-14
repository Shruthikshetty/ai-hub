/**
 * NinjaChat provider factory
 */

import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import type { OpenAICompatibleProvider } from '@ai-sdk/openai-compatible'
import { buildNinjaChatFetch } from './ninjachat-fetch-adapter'
import type { NinjaChatProviderSettings } from './ninjachat-settings'

export type { NinjaChatProviderSettings }

const DEFAULT_BASE_URL = 'https://ninjachat.ai/api/v1'

// Re-export the provider type so consumers can type their references
export type NinjaChatProvider = OpenAICompatibleProvider

/**
 * Create a NinjaChat provider instance.
 *
 * @example
 * const ninjachat = createNinjaChat({ apiKey: process.env.NINJACHAT_API_KEY })
 * const model = ninjachat('gpt-5')
 */
export function createNinjaChat(options: NinjaChatProviderSettings = {}): NinjaChatProvider {
  const resolvedApiKey = options.apiKey ?? process.env.NINJACHAT_API_KEY ?? ''
  const resolvedBaseURL = options.baseURL ?? DEFAULT_BASE_URL

  return createOpenAICompatible({
    name: 'ninjachat',
    baseURL: resolvedBaseURL,
    fetch: buildNinjaChatFetch(resolvedApiKey)
  })
}
