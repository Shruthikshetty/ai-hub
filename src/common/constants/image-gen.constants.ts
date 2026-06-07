// this file contains all the image gen options by provider

export type ImageOptionItem = { id: string; label: string }

export type ProviderImageOptions = {
  size?: readonly ImageOptionItem[]
  quality?: readonly ImageOptionItem[]
  seed: boolean
  aspectRatio?: readonly ImageOptionItem[]
}

// default auto value
export const DEFAULT_IMAGE_SIZE_OPTION = 'auto'
export const DEFAULT_IMAGE_ASPECT_RATIO = 'auto'

export const IMAGE_GEN_SEED_LIMITS = { min: 0, max: 4294967295 } as const

export const IMAGE_GEN_OPTIONS: Record<string, ProviderImageOptions> = {
  // https://developers.openai.com/api/docs/guides/image-generation
  openai: {
    size: [
      { id: DEFAULT_IMAGE_SIZE_OPTION, label: 'Auto' },
      { id: '1024x1024', label: 'Square (1024x1024)' },
      { id: '1024x1536', label: 'Portrait (1024x1536)' },
      { id: '1536x1024', label: 'Landscape (1536x1024)' },
      { id: '2048x2048', label: '2K square (2048x2048)' },
      { id: '2048x1152', label: '2K landscape (2048x1152)' },
      { id: '3840x2160', label: '4K landscape (3840x2160)' },
      { id: '2160x3840', label: '4K portrait (2160x3840)' }
    ],
    quality: [
      { id: 'auto', label: 'Auto' },
      { id: 'low', label: 'Low' },
      { id: 'medium', label: 'Medium' },
      { id: 'high', label: 'High' }
    ],
    seed: true
  },
  //https://docs.x.ai/developers/model-capabilities/images/generation
  xai: {
    aspectRatio: [
      { id: DEFAULT_IMAGE_ASPECT_RATIO, label: 'Auto' },
      { id: '1:1', label: 'Square (1:1)' },
      { id: '16:9 ', label: 'Landscape (16:9)' },
      { id: '9:16', label: 'Portrait (9:16)' },
      { id: '4:3', label: '4:3' },
      { id: '3:4', label: '3:4' },
      { id: '2:3', label: '2:3' },
      { id: '3:2', label: '3:2' },
      { id: '1:2', label: '1:2' },
      { id: '2:1', label: '2:1' },
      { id: '9:19.5', label: '9:19.5' },
      { id: '19.5:9', label: '19.5:9' },
      { id: '20:9', label: '20:9' },
      { id: '9:20', label: '9:20' }
    ],
    quality: [
      { id: 'auto', label: 'Auto' },
      { id: 'low', label: 'Low' },
      { id: 'medium', label: 'Medium' },
      { id: 'high', label: 'High' }
    ],
    seed: true
  },
  vercel: {
    size: [
      { id: DEFAULT_IMAGE_SIZE_OPTION, label: 'Auto' },
      { id: '1024x1024', label: 'Square (1024x1024)' },
      { id: '1024x1536', label: 'Portrait (1024x1536)' },
      { id: '1536x1024', label: 'Landscape (1536x1024)' }
    ],
    aspectRatio: [
      { id: DEFAULT_IMAGE_ASPECT_RATIO, label: 'Auto' },
      { id: '1:1', label: 'Square (1:1)' },
      { id: '16:9 ', label: 'Landscape (16:9)' },
      { id: '9:16', label: 'Portrait (9:16)' },
      { id: '4:3', label: '4:3' }
    ],
    seed: true
  }
} as const
