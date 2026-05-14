/**
 * Axios-based fetch adapter for NinjaChat.
 *
 * Why axios instead of global fetch?
 * Electron's main-process global fetch silently strips the Authorization
 * header on outgoing requests. Axios bypasses this.
 *
 * It also rewrites /chat/completions → /chat, which is the endpoint
 * NinjaChat exposes (rather than the standard OpenAI path).
 */

import axios from 'axios'
import type { Readable } from 'stream'

/**
 * Builds a fetch adapter for NinjaChat that uses axios instead of global fetch.
 */
export function buildNinjaChatFetch(apiKey: string): typeof fetch {
  return async (url, init) => {
    // NinjaChat uses /chat not /chat/completions
    const reqUrl = url.toString().replace('/chat/completions', '/chat')

    // detect streaming from the JSON body
    let isStreaming = false
    if (init?.body) {
      try {
        isStreaming = JSON.parse(init.body as string)?.stream === true
      } catch {
        /* ignore */
      }
    }

    const axiosResponse = await axios({
      url: reqUrl,
      method: (init?.method ?? 'POST') as string,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      data: init?.body,
      responseType: isStreaming ? 'stream' : 'text',
      validateStatus: () => true // let the SDK handle HTTP error status codes
    })

    if (isStreaming) {
      const nodeStream = axiosResponse.data as Readable
      const webStream = new ReadableStream<Uint8Array>({
        start(controller) {
          nodeStream.on('data', (chunk: Buffer) => controller.enqueue(chunk))
          nodeStream.on('end', () => controller.close())
          nodeStream.on('error', (err: Error) => controller.error(err))
        },
        cancel() {
          nodeStream.destroy()
        }
      })
      return new Response(webStream, {
        status: axiosResponse.status,
        headers: axiosResponse.headers as HeadersInit
      })
    }

    return new Response(axiosResponse.data as string, {
      status: axiosResponse.status,
      headers: axiosResponse.headers as HeadersInit
    })
  }
}
