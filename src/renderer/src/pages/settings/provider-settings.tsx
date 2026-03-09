import ProviderToggleCard from '@renderer/components/provider-toggle-card'
import { useFetchProviders } from '@renderer/services/provider'

/**
 * renders the provider settings tab
 */
export function ProviderSettingsTab() {
  //  get all the providers from qpi
  const { data: providers } = useFetchProviders()

  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5">
      {providers?.data.map((provider) => (
        <ProviderToggleCard key={provider.id} provider={provider} />
      ))}
    </div>
  )
}
