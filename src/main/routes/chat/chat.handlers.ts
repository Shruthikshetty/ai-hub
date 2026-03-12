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

// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  // get the messages from request body
  const { messages, model, conversationId } = c.req.valid('json')

  // convert to core messages
  const coreMessages = await convertToModelMessages(messages)

  if (coreMessages.length === 0) {
    return c.json(
      {
        message: 'No valid messages left after conversion',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // const get the provider as per user model
  const modelProvider = await getProviderInstanceModel({ model })

  // stream the response from ai model
  const result = streamText({
    model: modelProvider(model.id),
    messages: coreMessages,
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'auto'
      } as OpenAILanguageModelResponsesOptions
    }
  })

  // stream the response using data stream protocol (required by DefaultChatTransport)
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16
    }),
    onFinish: async ({ messages }) => {
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
          await db.insert(messageSchema).values({
            id: assistantMessage.id,
            role: assistantMessage.role,
            parts: assistantMessage.parts,
            conversationId
          })
        }
      } catch (error) {
        // silent fail
        console.error('Failed to save messages', error)
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
}
