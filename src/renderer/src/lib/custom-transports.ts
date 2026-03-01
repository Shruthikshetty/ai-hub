/**
 * Custom chat transports for the AI SDK that work over Electron IPC
 */
import { TextStreamChatTransport, UIMessage } from 'ai'

/**
 * Creates a TextStreamChatTransport that streams AI responses
 * through Electron's IPC bridge instead of direct HTTP.
 *
 * This is needed because Electron's CSP blocks direct fetch to localhost,
 * and contextBridge can't serialize Response objects — so we build
 * the ReadableStream in the renderer context from IPC event callbacks.
 */
export function createIPCStreamTransport(apiPath: string): TextStreamChatTransport<UIMessage> {
  return new TextStreamChatTransport({
    api: apiPath,
    fetch: async (_url, options) => {
      const body = JSON.parse(options?.body as string)

      // Get requestId from IPC bridge
      const { requestId } = await window.api.startStream(apiPath, 'POST', body)

      // Build ReadableStream in renderer context (not preload) to avoid contextBridge issues
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()

          window.api.onStreamChunk(requestId, (data) => {
            controller.enqueue(encoder.encode(data))
          })

          window.api.onStreamEnd(requestId, () => {
            window.api.removeStreamListeners(requestId)
            controller.close()
          })

          window.api.onStreamError(requestId, (errorMsg) => {
            window.api.removeStreamListeners(requestId)
            controller.error(new Error(errorMsg))
          })
        }
      })

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    }
  })
}
