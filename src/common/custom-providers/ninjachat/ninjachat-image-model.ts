import { ImageModelV3, ImageModelV3CallOptions } from '@ai-sdk/provider'
import axios from 'axios'

/**
 * Custom ImageModelV3 implementation for NinjaChat.
 *
 * NinjaChat returns image URLs, so we download the image and return it as
 * a base64 string array — the format the AI SDK natively expects from ImageModelV3.
 */
export class NinjaChatImageModel implements ImageModelV3 {
  readonly specificationVersion = 'v3'
  readonly provider = 'ninjachat'
  readonly maxImagesPerCall = 1

  constructor(
    readonly modelId: string,
    private readonly apiKey: string,
    private readonly baseURL: string = 'https://ninjachat.ai/api/v1'
  ) {}

  async doGenerate(
    options: ImageModelV3CallOptions
  ): Promise<Awaited<ReturnType<ImageModelV3['doGenerate']>>> {
    const startTimestamp = new Date()

    const payload: Record<string, unknown> = {
      model: this.modelId,
      prompt: options.prompt
    }

    if (options.size) {
      payload.size = options.size
    }

    const response = await axios.post(`${this.baseURL}/images`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`
      },
      timeout: 600000 // 10 mins for image generation
    })

    const data = response.data

    if (!data.images || data.images.length === 0) {
      throw new Error('NinjaChat returned no images')
    }

    // NinjaChat returns URLs — download and convert to base64 string
    const imageResponse = await axios.get(data.images[0].url, {
      responseType: 'arraybuffer',
      timeout: 30000 //   60 seconds for image download
    })

    const base64 = Buffer.from(imageResponse.data).toString('base64')

    // Filter headers to avoid issues with Response constructor
    const safeHeaders: Record<string, string> = {}
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        safeHeaders[key] = value
      } else if (Array.isArray(value)) {
        safeHeaders[key] = value.join(', ')
      } else if (value !== undefined) {
        safeHeaders[key] = String(value)
      }
    })

    return {
      // ImageModelV3 expects Array<string> (base64) OR Array<Uint8Array>
      images: [base64],
      warnings: [],
      response: {
        timestamp: startTimestamp,
        modelId: this.modelId,
        headers: safeHeaders
      }
    }
  }
}
