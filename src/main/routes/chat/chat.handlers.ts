/**
 * @file contains all the handlers for chat routes
 */
import { StreamChatRoute } from './chat.routes'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { convertToModelMessages, streamText } from 'ai'

// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  // get the messages from request body
  const { messages } = await c.req.json()

  // call api for getting response
  try {
    // stream the response from ai model
    const result = streamText({
      model: 'alibaba/qwen-3-14b',
      messages: await convertToModelMessages(messages)
    })

    result.usage.then((usage) => {
      console.log(usage)
    })

    // stream the response using data stream protocol (required by DefaultChatTransport)
    return result.toTextStreamResponse({
      status: HTTP_STATUS_CODES.OK
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
  } catch (error) {
    console.log(error)
    return c.json(
      {
        success: false,
        message: 'Failed to get response from API'
      },
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    )
  }
}
