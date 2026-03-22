/**
 * @file contains all the handlers for chat routes
 */
import { StreamChatRoute } from './chat.routes'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { createIdGenerator, convertToModelMessages, streamText } from 'ai'
import { OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'
import db from '../../db'
import { messages as messageSchema } from '../../../common/db-schemas/message.schema'
import { generateTitle } from '../../lib/generate-title'
import { eq } from 'drizzle-orm'
import { conversations } from '../../db/schema'
import { normalizeMessages } from '../../lib/normalize-messages'

// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  // get the messages from request body
  const { messages, model, conversationId } = c.req.valid('json')

  // Normalize any data: URIs in file parts before handing off to the SDK
  const normalizedMessages = normalizeMessages(messages)

  // convert to core messages
  const coreMessages = await convertToModelMessages(normalizedMessages)

  if (coreMessages.length === 0) {
    return c.json(
      {
        message: 'No valid messages left after conversion',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }
  // get the conversation from db
  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId)
  })

  // if conversation is not found
  if (!conversation) {
    return c.json(
      {
        message: 'Conversation not found',
        success: false
      },
      HTTP_STATUS_CODES.NOT_FOUND
    )
  }

  // const get the provider as per user model
  const modelProvider = await getProviderInstanceModel({ model })

  // stream the response from ai model
  const result = streamText({
    model: modelProvider(model.id),
    messages: coreMessages,
    system: conversation?.systemPrompt ?? undefined,
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'auto'
      } as OpenAILanguageModelResponsesOptions
    }
  })

  //@TODO ADD custom error handling here
  // stream the response using data stream protocol (required by DefaultChatTransport)
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16
    }),
    // attach meta data to the response
    messageMetadata: ({ part }) => {
      // use the conversation db to update and track total tokens
      if (part.type === 'finish' && conversation?.metadata) {
        return {
          tokensPerMessage: part?.totalUsage?.totalTokens,
          timeStamp: new Date()
        }
      }
      return undefined
    },
    onFinish: async ({ messages }) => {
      // generate title if first message
      if (messages.length <= 2) {
        // do not wait for this to complete
        generateTitle({
          model,
          message: messages[0].parts.find((part) => part.type === 'text')?.text || '',
          conversationId
        })
      }
      try {
        const userMessage = messages.at(-2) // previous message
        const assistantMessage = messages.at(-1) // final AI message

        // store user message
        if (userMessage) {
          await db
            .insert(messageSchema)
            .values({
              id: userMessage.id,
              role: userMessage.role,
              parts: userMessage.parts,
              conversationId
            })
            .onConflictDoNothing() // Prevent errors if the user message was already saved (e.g. regenerations)
        }

        // store assistant message
        if (assistantMessage) {
          await db
            .insert(messageSchema)
            .values({
              id: assistantMessage.id,
              role: assistantMessage.role,
              metadata: assistantMessage.metadata,
              parts: assistantMessage.parts,
              conversationId
            })
            .onConflictDoNothing()
        }
      } catch (error) {
        // silent fail
        console.error('Failed to save messages', error)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
}
