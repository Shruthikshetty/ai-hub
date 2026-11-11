import { type XaiImageModelOptions } from '@ai-sdk/xai'
import { DEFAULT_IMAGE_ASPECT_RATIO } from '../../common/constants/image-gen.constants'

/**
 * types
 */
type OpenAiImageModelGenerationOptions = {
  quality: string
}

/**
 * Generate model specific options
 * for image generation based on the provider type
 */
export const generateImageProviderBasedOption = ({
  provider,
  quality
}: {
  provider: string | undefined
  quality: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Record<string, any> | undefined => {
  if (!provider) return undefined
  switch (provider) {
    case 'openai':
      if (!quality) return undefined
      return {
        openai: {
          quality: quality
        } as OpenAiImageModelGenerationOptions
      }
    case 'xai':
      if (!quality) return undefined
      return {
        xai: {
          quality: quality === DEFAULT_IMAGE_ASPECT_RATIO ? undefined : quality
        } as XaiImageModelOptions
      }
    case 'custom':
      return {
        [provider]: {
          response_format: 'b64_json'
        }
      }
    default:
      return undefined
  }
}
