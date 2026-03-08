import ProviderToggleCard from '@renderer/components/provider-toggle-card'
import { useState } from 'react'

export type providerType = {
  provider: string
  name: string
  icon?: string | null
  enabled: boolean
  apiKey?: string | null
  server: boolean
  serverUrl?: string
  description?: string | null
}

/**
 * renders the provider settings tab
 */
export function ProviderSettingsTab() {
  // setting to be taken from api
  const [providers, setProviders] = useState<providerType[]>([
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
      provider: 'anthropic',
      name: 'Anthropic',
      icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/anthropic.svg',
      enabled: false,
      apiKey: '',
      server: false,
      description: 'Anthropic AI provider models'
    },
    {
      provider: 'ollama',
      name: 'Ollama',
      icon: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/ollama.svg',
      enabled: false,
      apiKey: null,
      server: true,
      serverUrl: '',
      description: 'Locally run models that you run'
    }
  ])

  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5">
      {providers.map((provider) => (
        <ProviderToggleCard
          key={provider.provider}
          provider={provider}
          setProvider={setProviders}
        />
      ))}
    </div>
  )
}
