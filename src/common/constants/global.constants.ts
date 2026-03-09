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

//All Providers configured in app
export const AVAILABLE_PROVIDERS_DEFAULT_DETAILS = [
  {
    provider: 'openai',
    name: 'Open AI',
    icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg',
    enabled: true,
    apiKey: '',
    server: false,
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
    description: 'Your local models running using ollama please add the exact server url'
  }
]

export const AVAILABLE_PROVIDER_LIST = ['openai', 'ollama']
