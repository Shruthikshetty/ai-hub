// this file contains all the image gen options by provider

export type ImageOptionItem = { id: string; label: string }

export type ProviderImageOptions = {
  size: readonly ImageOptionItem[]
  quality?: readonly ImageOptionItem[]
}

// default auto value
export const DEFAULT_IMAGE_SIZE_OPTION = 'auto'

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
    ]
  }
} as const
