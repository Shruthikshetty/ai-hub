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
      }
    })

    const data = response.data

    if (!data.images || data.images.length === 0) {
      throw new Error('NinjaChat returned no images')
    }

    // NinjaChat returns URLs — download and convert to base64 string
    const imageResponse = await axios.get(data.images[0].url, {
      responseType: 'arraybuffer'
    })

    const base64 = Buffer.from(imageResponse.data).toString('base64')

    return {
      // ImageModelV3 expects Array<string> (base64) OR Array<Uint8Array>
      images: [base64],
      warnings: [],
      response: {
        timestamp: startTimestamp,
        modelId: this.modelId,
        headers: response.headers as Record<string, string>
      }
    }
  }
}
