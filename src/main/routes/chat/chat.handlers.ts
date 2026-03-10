/**
 * @file contains all the handlers for chat routes
 */
import { StreamChatRoute } from './chat.routes'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { convertToModelMessages, streamText } from 'ai'
import { OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai'
import { getProviderInstanceModel } from '../../lib/get-provider-instance'

// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  // get the messages from request body
  const { messages, model } = c.req.valid('json')

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
    sendReasoning: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
}
