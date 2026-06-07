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
  if (!provider || !quality) return undefined
  switch (provider) {
    case 'openai':
      return {
        openai: {
          quality: quality
        } as OpenAiImageModelGenerationOptions
      }
    case 'xai':
      return {
        xai: {
          quality: quality === DEFAULT_IMAGE_ASPECT_RATIO ? undefined : quality
        } as XaiImageModelOptions
      }
    default:
      return undefined
  }
}
