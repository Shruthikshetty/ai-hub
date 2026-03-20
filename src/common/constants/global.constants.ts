/**
 * @file contains constants used globally throwout the app
 */

// File storage category
export const FILE_STORAGE_CATEGORY = {
  profileImg: 'profile-img',
  imageGen: 'img-gen'
} as const

// MIME lookup for common image types
export const EXT_TO_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  bmp: 'image/bmp',
  avif: 'image/avif',
  ico: 'image/x-icon'
}

// For AES, this is always 16 bytes
export const IV_LENGTH = 16

//@TODO get the icons locally
//All Providers configured in app this is loaded in the app on first launch
export const AVAILABLE_PROVIDERS_DEFAULT_DETAILS = [
  {
    provider: 'openai',
    name: 'Open AI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://platform.openai.com',
    description: 'Open AI provider models'
  },
  {
    provider: 'ollama',
    name: 'Ollama',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/ollama.svg',
    enabled: false,
    apiKey: null,
    server: true,
    serverUrl: 'http://localhost:11434',
    siteUrl: 'https://ollama.com',
    description: 'Your local models running using ollama please add the exact server url'
  },
  {
    provider: 'openrouter',
    name: 'Open Router',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openrouter.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://openrouter.ai',
    description: 'Open Router provider models'
  },
  {
    provider: 'google',
    name: 'Google Ai Studio',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/google.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://aistudio.google.com',
    description: 'Google ai studio models'
  },
  {
    provider: 'vercel',
    name: 'AI Gateway',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/vercel.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://vercel.com/ai-gateway',
    description: 'vercel ai gateway get a aggregated list of models'
  }
]

export const AVAILABLE_PROVIDER_LIST = [
  'openai',
  'ollama',
  'openrouter',
  'google',
  'vercel'
] as const

export const REASONING_OPTIONS = ['none', 'low', 'medium', 'high'] as const

export const MEDIA_TYPE = ['image', 'video'] as const

export const MEDIA_REQUEST_TYPES = [...MEDIA_TYPE, 'all'] as const
