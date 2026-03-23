/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tool, ToolSet } from 'ai'
import { ConversationsGetSchema } from '../db/schema'
import { getProviderInstanceModel } from './get-provider-instance'
import { ModelProviderType } from '../../common/schemas/model.schema'
import { XaiProvider } from '@ai-sdk/xai'
import { OpenAIProvider } from '@ai-sdk/openai'

/**
 * Generate tools as per the provider
 */
export const getTools = async (
  conversation: ConversationsGetSchema,
  targetProvider: string
): Promise<ToolSet | undefined> => {
  const tools: Record<string, Tool<any, any>> = {}
  // check for search tool
  if (conversation.tools?.search?.enabled && targetProvider) {
    // get the provider instance
    const modelProvider = await getProviderInstanceModel({
      provider: targetProvider
    })

    /** @TODO to implement others */
    switch (targetProvider as ModelProviderType) {
      case 'openai':
        tools['search'] = (modelProvider as OpenAIProvider).tools.webSearch() as any
        break
      case 'xai':
        tools['search'] = (modelProvider as XaiProvider).tools.webSearch()
        break
      default:
        break
    }
  }

  return Object.keys(tools).length === 0 ? undefined : tools
}
