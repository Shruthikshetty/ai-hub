// this file contains all the image gen options by provider

export type ImageOptionItem = { id: string; label: string }

export type ProviderImageOptions = {
  size: readonly ImageOptionItem[]
  quality?: readonly ImageOptionItem[]
}

export const IMAGE_GEN_OPTIONS: Record<string, ProviderImageOptions> = {
  // https://developers.openai.com/api/docs/guides/image-generation
  openai: {
    size: [
      { id: 'auto', label: 'Auto' },
      { id: 'square', label: 'Square (1024x1024)' },
      { id: 'portrait', label: 'Portrait (1024x1536)' },
      { id: 'landscape', label: 'Landscape (1536x1024)' },
      { id: '2k', label: '2K (2560x1440)' },
      { id: '4k', label: '4K (3840x2160)' }
    ],
    quality: [
      { id: 'auto', label: 'Auto' },
      { id: 'high', label: 'High' },
      { id: 'medium', label: 'Medium' },
      { id: 'low', label: 'Low' }
    ]
  }
} as const
