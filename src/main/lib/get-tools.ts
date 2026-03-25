/* eslint-disable @typescript-eslint/no-explicit-any */
import { tool, Tool, ToolSet } from 'ai'
import { ConversationsGetSchema } from '../db/schema'
import { getProviderInstanceModel } from './get-provider-instance'
import { ModelProviderType } from '../../common/schemas/model.schema'
import { XaiProvider } from '@ai-sdk/xai'
import { OpenAIProvider } from '@ai-sdk/openai'
import z from 'zod'
import db from '../db'

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
    const provider = conversation.tools.search.provider

    if (!provider) return undefined
    // get the provider instance
    const modelProvider = await getProviderInstanceModel({
      provider
    })

    /** @TODO to implement others */
    switch (provider as ModelProviderType) {
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

  // check for profile access tool
  if (conversation.tools?.profileAccess?.enabled) {
    tools['profile'] = tool({
      description: 'Get your profile information or data about user',
      inputSchema: z.object({}).optional().describe('no input required for this tool'),
      execute: async () => {
        //get data from db
        try {
          const profileData = await db.query.users.findFirst()
          if (profileData) {
            return {
              name: profileData.name,
              email: profileData.email,
              age: profileData.age,
              city: profileData.city,
              image: profileData.image
            }
          }
        } catch (error) {
          console.error('Failed to get profile data', error)
        }
        // return the result
        return 'Profile not found ask the user to update their profile'
      }
    })
  }

  return Object.keys(tools).length === 0 ? undefined : tools
}
