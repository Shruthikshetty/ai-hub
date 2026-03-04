/**
 * @file contains all the handlers for chat routes
 */
import { StreamChatRoute } from './chat.routes'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { convertToModelMessages, streamText } from 'ai'
import { openai, OpenAILanguageModelResponsesOptions } from '@ai-sdk/openai'

// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  // get the messages from request body
  const { messages } = c.req.valid('json')

  // convert to core messages
  const coreMessages = await convertToModelMessages(messages)

  if (coreMessages.length === 0) {
    console.log('here')
    return c.json(
      {
        message: 'No valid messages left after conversion',
        success: false
      },
      HTTP_STATUS_CODES.BAD_REQUEST
    )
  }

  // stream the response from ai model
  const result = streamText({
    model: openai('gpt-5-mini'),
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
