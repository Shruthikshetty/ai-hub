/**
 * Extended Alibaba provider that wraps @ai-sdk/alibaba and adds image generation support.
 *
 * DashScope endpoints per model family:
 *   qwen-image-*  →  POST /api/v1/services/aigc/multimodal-generation/generation  (synchronous)
 *   wan*          →  POST /api/v1/services/aigc/image-generation/generation        (async + poll)
 *
 * Async poll endpoint: GET /api/v1/tasks/{task_id}
 * Image URL in all responses: output.choices[0].message.content[0].image
 */
import { createAlibaba as _createAlibaba } from '@ai-sdk/alibaba'
import { ImageModelV3, ImageModelV3CallOptions } from '@ai-sdk/provider'
import axios from 'axios'

export interface AlibabaProviderSettings {
  apiKey?: string
  serverUrl?: string
}

export interface ExtendedAlibabaProvider extends ReturnType<typeof _createAlibaba> {
  image(modelId: string): ImageModelV3
}

export function createAlibaba(
  providerSettings: AlibabaProviderSettings = {}
): ExtendedAlibabaProvider {
  const resolvedApiKey = providerSettings.apiKey ?? ''

  const rawServerUrl = (
    providerSettings.serverUrl || 'https://dashscope-intl.aliyuncs.com'
  ).replace(/\/$/, '')

  // /api/v1 for native DashScope image APIs
  const baseURL = rawServerUrl.endsWith('/api/v1') ? rawServerUrl : `${rawServerUrl}/api/v1`

  // /compatible-mode/v1 for the underlying @ai-sdk/alibaba text/chat provider
  const compatibleBaseURL = rawServerUrl.endsWith('/compatible-mode/v1')
    ? rawServerUrl
    : `${rawServerUrl}/compatible-mode/v1`

  const provider = _createAlibaba({ apiKey: resolvedApiKey, baseURL: compatibleBaseURL })

  /** Normalize axios response headers to Record<string, string> */
  function buildSafeHeaders(headers: Record<string, unknown>): Record<string, string> {
    const safe: Record<string, string> = {}
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') safe[key] = value
      else if (Array.isArray(value)) safe[key] = value.join(', ')
      else if (value != null) safe[key] = String(value)
    }
    return safe
  }

  /** Download an image URL and return base64-encoded string */
  async function downloadAsBase64(url: string): Promise<string> {
    const res = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    })
    return Buffer.from(res.data).toString('base64')
  }

  function image(modelId: string): ImageModelV3 {
    return {
      specificationVersion: 'v3' as const,
      provider: 'alibaba',
      modelId,
      maxImagesPerCall: 1,

      async doGenerate(
        options: ImageModelV3CallOptions
      ): Promise<Awaited<ReturnType<ImageModelV3['doGenerate']>>> {
        const startTimestamp = new Date()

        // DashScope expects "width*height" format
        const size = options.size ? options.size.replace('x', '*') : '1024*1024'

        // qwen-image → sync endpoint; wan → async endpoint
        const isQwenImage = modelId.toLowerCase().startsWith('qwen-image')
        const endpoint = isQwenImage
          ? `${baseURL}/services/aigc/multimodal-generation/generation`
          : `${baseURL}/services/aigc/image-generation/generation`

        const body = {
          model: modelId,
          input: { messages: [{ role: 'user', content: [{ text: options.prompt }] }] },
          parameters: { size, n: 1 }
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resolvedApiKey}`,
          ...(!isQwenImage ? { 'X-DashScope-Async': 'enable' } : {})
        }

        const submitRes = await axios.post(endpoint, body, {
          headers,
          validateStatus: null,
          timeout: 30000
        })

        if (submitRes.status !== 200) {
          throw new Error(
            `Alibaba image request failed: ${submitRes.status} — ${JSON.stringify(submitRes.data)}`
          )
        }

        const responseHeaders = buildSafeHeaders(submitRes.headers as Record<string, unknown>)

        // ── qwen-image: synchronous — image URL is in the response directly ──
        if (isQwenImage) {
          const imageUrl: string | undefined =
            submitRes.data?.output?.choices?.[0]?.message?.content?.[0]?.image

          if (!imageUrl) {
            throw new Error(
              `Alibaba (qwen-image) returned no image URL. Response: ${JSON.stringify(submitRes.data)}`
            )
          }

          return {
            images: [await downloadAsBase64(imageUrl)],
            warnings: [],
            response: { timestamp: startTimestamp, modelId, headers: responseHeaders }
          }
        }

        // ── wan: asynchronous — poll for task completion ──
        const taskId: string = submitRes.data?.output?.task_id
        if (!taskId) {
          throw new Error(
            `Alibaba image task returned no task_id. Response: ${JSON.stringify(submitRes.data)}`
          )
        }

        const pollEndpoint = `${baseURL}/tasks/${taskId}`

        // Poll every 5 s for up to 10 minutes (120 × 5 s)
        for (let i = 0; i < 120; i++) {
          await new Promise((r) => setTimeout(r, 5000))

          const pollRes = await axios.get(pollEndpoint, {
            headers: { Authorization: `Bearer ${resolvedApiKey}` },
            validateStatus: null,
            timeout: 10000
          })

          if (pollRes.status !== 200) {
            throw new Error(
              `Alibaba image task polling failed: ${pollRes.status} — ${JSON.stringify(pollRes.data)}`
            )
          }

          const taskStatus: string | undefined = pollRes.data?.output?.task_status

          if (taskStatus === 'SUCCEEDED') {
            const imageUrl: string | undefined =
              pollRes.data?.output?.choices?.[0]?.message?.content?.[0]?.image

            if (!imageUrl) {
              throw new Error(
                `Alibaba image task SUCCEEDED but no image URL found. Response: ${JSON.stringify(pollRes.data)}`
              )
            }

            return {
              images: [await downloadAsBase64(imageUrl)],
              warnings: [],
              response: { timestamp: startTimestamp, modelId, headers: responseHeaders }
            }
          }

          if (taskStatus === 'FAILED' || taskStatus === 'CANCELED') {
            throw new Error(
              `Alibaba image task ${taskStatus}: ${JSON.stringify(pollRes.data?.output)}`
            )
          }
        }

        throw new Error('Alibaba image task timed out after 10 minutes.')
      }
    }
  }

  return Object.assign(provider, { image }) as ExtendedAlibabaProvider
}
