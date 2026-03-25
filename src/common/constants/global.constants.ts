/**
 * @file contains constants used globally throwout the app
 */

// File storage category
export const FILE_STORAGE_CATEGORY = {
  profileImg: 'profile-img',
  imageGen: 'img-gen',
  chatAttachment: 'chat-attachments'
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
    description: 'vercel ai gateway get an aggregated list of models'
  },
  {
    provider: 'groq',
    name: 'Groq',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/groq.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://groq.com',
    description: 'Groq provider models'
  },
  {
    provider: 'huggingface',
    name: 'Hugging Face',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/huggingface.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://huggingface.co/docs/inference-providers',
    description:
      'Hugging Face’s Inference Providers give developers access to hundreds of machine learning models, powered by world-class inference providers'
  },
  {
    provider: 'xai',
    name: 'xAI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/xai.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://console.x.ai',
    description: 'xAI provider models'
  },
  {
    provider: 'togetherai',
    name: 'Together AI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/together.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://together.ai',
    description: 'together.ai provider models'
  },
  {
    provider: 'fireworks-ai',
    name: 'Fireworks AI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/fireworks.svg',
    enabled: false,
    apiKey: '',
    server: false,
    siteUrl: 'https://app.fireworks.ai',
    description: 'Fireworks AI provider models'
  }
]

export const AVAILABLE_PROVIDER_LIST = [
  'fireworks-ai',
  'openai',
  'ollama',
  'openrouter',
  'google',
  'vercel',
  'groq',
  'huggingface',
  'xai',
  'togetherai'
] as const

export const REASONING_OPTIONS = ['none', 'low', 'medium', 'high'] as const

export const MEDIA_TYPE = ['image', 'video'] as const

export const MEDIA_REQUEST_TYPES = [...MEDIA_TYPE, 'all'] as const

export const PROVIDERS_WITH_SEARCH_TOOL = ['openai', 'xai'] as const
