/**
 * @file contains all the handlers for chat routes
 */
import { StreamChatRoute } from './chat.routes'
import { AppRouteHandler } from '../../types'
import * as HTTP_STATUS_CODES from '../../constants/http-status-codes.constants'
import { convertToModelMessages, streamText } from 'ai'

//@TODO are try blocks required here? we have a global error handler // can we throw errors as objects ?
// handler for stream chat route
export const streamChat: AppRouteHandler<StreamChatRoute> = async (c) => {
  try {
    // get the messages from request body
    const { messages } = c.req.valid('json')

    // stream the response from ai model
    const result = streamText({
      model: 'alibaba/qwen-3-14b',
      messages: await convertToModelMessages(messages)
    })

    // stream the response using data stream protocol (required by DefaultChatTransport)
    return result.toTextStreamResponse({
      status: HTTP_STATUS_CODES.OK
      // @TODO check if can remove this any cast
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
